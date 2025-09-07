import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { extractVideoId, isValidYouTubeUrl } from '../../../../lib/youtube-utils';

// Configurar runtime para Edge (mejor para Vercel)
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos

// Claves de RapidAPI
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'c26b1d1718msh5e69086ad261f42p1e6dcbjsn0f6b8e45530e';

export async function POST(request: NextRequest) {
  try {
    const { url, format, options = {} } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'URL de YouTube no válida' },
        { status: 400 }
      );
    }

    // Extraer ID del video
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'No se pudo extraer el ID del video de la URL' },
        { status: 400 }
      );
    }

    console.log(`Iniciando descarga ${format.toUpperCase()} para video ID: ${videoId}`);

    if (format === 'mp3') {
      // Usar RapidAPI para MP3
      const mp3Options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id: videoId },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(mp3Options);
        const data = response.data;

        console.log('Respuesta MP3 API:', data);

        if (data.status !== 'ok') {
          return NextResponse.json(
            { error: `Error al procesar MP3: ${data.msg || 'Error desconocido'}` },
            { status: 500 }
          );
        }

        // Retornar información de descarga
        return NextResponse.json({
          success: true,
          format: 'mp3',
          title: data.title,
          downloadUrl: data.link,
          duration: data.duration,
          progress: data.progress,
          status: data.status,
          message: data.msg
        });

      } catch (error) {
        console.error('Error en API MP3:', error);
        return NextResponse.json(
          { error: 'Error al conectar con el servicio de descarga MP3' },
          { status: 500 }
        );
      }

    } else if (format === 'mp4') {
      // Usar RapidAPI para MP4
      const quality = options.quality || '251'; // Calidad por defecto
      
      const mp4Options = {
        method: 'GET',
        url: `https://youtube-video-fast-downloader-24-7.p.rapidapi.com/download_audio/${videoId}`,
        params: { quality: quality },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'youtube-video-fast-downloader-24-7.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(mp4Options);
        const data = response.data;

        console.log('Respuesta MP4 API:', data);

        if (!data.file) {
          return NextResponse.json(
            { error: 'No se pudo obtener el archivo de descarga' },
            { status: 500 }
          );
        }

        // Retornar información de descarga
        return NextResponse.json({
          success: true,
          format: 'mp4',
          downloadUrl: data.file,
          quality: data.id,
          type: data.type,
          bitrate: data.bitrate,
          size: data.size,
          mime: data.mime,
          comment: data.comment
        });

      } catch (error) {
        console.error('Error en API MP4:', error);
        return NextResponse.json(
          { error: 'Error al conectar con el servicio de descarga MP4' },
          { status: 500 }
        );
      }

    } else {
      return NextResponse.json(
        { error: 'Formato no soportado. Usa "mp3" o "mp4"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al procesar descarga:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    );
  }
}
