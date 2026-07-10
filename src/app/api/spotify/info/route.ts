import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  isValidSpotifyUrl,
  extractSpotifyTrackId,
  buildCanonicalTrackUrl,
} from '../../../../lib/spotify-utils';
import { formatDuration } from '../../../../lib/youtube-utils';
import { reserveDownloadSlot, refundDownloadSlot } from '../../../../lib/rate-limit';

// Configurar runtime para Vercel
export const runtime = 'nodejs';
export const maxDuration = 60;

// Clave de RapidAPI (la misma que usa YouTube)
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// La respuesta exacta de la API se confirma con el console.log de abajo;
// por eso el mapeo de campos es defensivo (varios nombres posibles).
interface SpotifyTrackData {
  title?: string;
  name?: string;
  artist?: string;
  artists?: string;
  author?: string;
  album?: string;
  cover?: string;
  image?: string;
  thumbnail?: string;
  albumCover?: string;
  duration?: string | number;
  downloadLink?: string;
  downloadUrl?: string;
  link?: string;
  url?: string;
}

type SpotifyApiResponse = SpotifyTrackData & {
  success?: boolean;
  data?: SpotifyTrackData;
};

export async function POST(request: NextRequest) {
  let reserved = false;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL es requerida' }, { status: 400 });
    }

    if (!isValidSpotifyUrl(url)) {
      return NextResponse.json({ error: 'URL de Spotify no válida' }, { status: 400 });
    }

    const trackId = extractSpotifyTrackId(url);
    if (!trackId) {
      return NextResponse.json(
        { error: 'No se pudo extraer el ID del track de la URL' },
        { status: 400 }
      );
    }

    // Reservar un cupo ANTES de llamar a RapidAPI (protege la cuota).
    const slot = await reserveDownloadSlot('spotify');
    if (!slot.ok) {
      return NextResponse.json(
        { error: `Se alcanzó el límite diario de ${slot.limit} descargas de Spotify. Vuelve a intentarlo mañana.` },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(slot.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
    reserved = true;

    console.log(`Iniciando descarga Spotify para track ID: ${trackId}`);

    const response = await axios.request({
      method: 'GET',
      url: 'https://spotify-downloader9.p.rapidapi.com/downloadSong',
      params: { songId: buildCanonicalTrackUrl(trackId) },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
      },
    });

    const payload = response.data as SpotifyApiResponse;
    console.log('Respuesta Spotify API:', payload);

    if (payload?.success === false) {
      refundDownloadSlot('spotify');
      reserved = false;
      return NextResponse.json(
        { error: 'No se pudo procesar el track de Spotify' },
        { status: 502 }
      );
    }

    // La API puede anidar los datos bajo `data` o traerlos aplanados.
    const track: SpotifyTrackData = (payload?.data ?? payload) as SpotifyTrackData;

    const downloadUrl =
      track?.downloadLink ?? track?.downloadUrl ?? track?.link ?? track?.url ?? null;

    if (!downloadUrl) {
      refundDownloadSlot('spotify');
      reserved = false;
      return NextResponse.json(
        { error: 'No se recibió un enlace de descarga desde Spotify' },
        { status: 502 }
      );
    }

    // Formatear duración (best-effort: puede venir en ms, segundos o string).
    let duration = '';
    if (typeof track.duration === 'string') {
      duration = track.duration;
    } else if (typeof track.duration === 'number') {
      const seconds = track.duration > 10000 ? Math.round(track.duration / 1000) : track.duration;
      duration = formatDuration(seconds);
    }

    return NextResponse.json(
      {
        id: trackId,
        title: track?.title ?? track?.name ?? 'Título no disponible',
        author: track?.artist ?? track?.artists ?? track?.author ?? 'Artista no disponible',
        album: track?.album,
        thumbnail: track?.cover ?? track?.image ?? track?.thumbnail ?? track?.albumCover ?? '',
        duration,
        durationSeconds: 0,
        views: 0,
        source: 'spotify',
        format: 'mp3',
        downloadUrl,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(slot.limit),
          'X-RateLimit-Remaining': String(slot.remaining),
        },
      }
    );
  } catch (error) {
    // Cualquier error tras reservar: devolver el cupo para no gastar cuota.
    if (reserved) {
      await refundDownloadSlot('spotify');
    }
    console.error('Error en API Spotify:', error);

    let errorMessage = 'Error desconocido';
    if (axios.isAxiosError(error)) {
      errorMessage = `Error de API: ${error.response?.data?.message || error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: `Error al procesar la descarga de Spotify: ${errorMessage}` },
      { status: 500 }
    );
  }
}
