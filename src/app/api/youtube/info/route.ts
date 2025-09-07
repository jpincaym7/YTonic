import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { extractVideoId, isValidYouTubeUrl, formatDuration, parseISODuration } from '../../../../lib/youtube-utils';

// Configurar runtime para Vercel
export const runtime = 'nodejs';
export const maxDuration = 60;

// Clave de YouTube Data API
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando petición a /api/youtube/info');
    
    const body = await request.json();
    console.log('Body recibido:', body);
    
    const { url } = body;

    if (!url) {
      console.log('Error: URL no proporcionada');
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    console.log('URL recibida:', url);

    // Validar si es una URL válida de YouTube
    if (!isValidYouTubeUrl(url)) {
      console.log('Error: URL de YouTube no válida');
      return NextResponse.json(
        { error: 'URL de YouTube no válida' },
        { status: 400 }
      );
    }

    // Extraer ID del video
    const videoId = extractVideoId(url);
    if (!videoId) {
      console.log('Error: No se pudo extraer el ID del video');
      return NextResponse.json(
        { error: 'No se pudo extraer el ID del video de la URL' },
        { status: 400 }
      );
    }

    console.log('ID del video extraído:', videoId);
    console.log('Obteniendo información del video desde YouTube Data API...');

    // Obtener información del video usando YouTube Data API
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos`;
    const apiResponse = await axios.get(youtubeApiUrl, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (!apiResponse.data.items || apiResponse.data.items.length === 0) {
      console.log('Error: Video no encontrado');
      return NextResponse.json(
        { error: 'Video no encontrado o no disponible' },
        { status: 404 }
      );
    }

    const videoData = apiResponse.data.items[0];
    const snippet = videoData.snippet;
    const statistics = videoData.statistics;
    const contentDetails = videoData.contentDetails;

    console.log('Información obtenida de YouTube Data API, procesando...');

    // Convertir duración ISO 8601 a segundos
    const durationSeconds = parseISODuration(contentDetails.duration);

    // Formatear la información
    const videoInfo = {
      id: videoId,
      title: snippet.title || 'Título no disponible',
      author: snippet.channelTitle || 'Autor no disponible',
      duration: formatDuration(durationSeconds),
      durationSeconds: durationSeconds,
      views: statistics.viewCount ? parseInt(statistics.viewCount) : 0,
      thumbnail: snippet.thumbnails?.maxres?.url || 
                snippet.thumbnails?.high?.url || 
                snippet.thumbnails?.medium?.url ||
                snippet.thumbnails?.default?.url || '',
      description: snippet.description || '',
      publishedAt: snippet.publishedAt,
      channelId: snippet.channelId
    };

    console.log('Información procesada:', videoInfo);
    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error detallado al obtener información del video:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    let errorMessage = 'Error desconocido';
    if (axios.isAxiosError(error)) {
      errorMessage = `Error de API: ${error.response?.data?.error?.message || error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: `Error al obtener información del video: ${errorMessage}` },
      { status: 500 }
    );
  }
}
