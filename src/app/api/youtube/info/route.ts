import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

// Configurar runtime para Vercel
export const runtime = 'nodejs';
export const maxDuration = 60;

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
    if (!ytdl.validateURL(url)) {
      console.log('Error: URL de YouTube no válida');
      return NextResponse.json(
        { error: 'URL de YouTube no válida' },
        { status: 400 }
      );
    }

    console.log('URL válida, obteniendo información...');

    // Configurar opciones para mejor compatibilidad en producción
    const options = {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    };

    // Obtener información del video
    const info = await ytdl.getInfo(url, options);
    console.log('Información obtenida, procesando...');
    
    const videoDetails = info.videoDetails;

    // Formatear la información de manera más segura
    const videoInfo = {
      title: videoDetails.title || 'Título no disponible',
      author: videoDetails.author?.name || videoDetails.ownerChannelName || 'Autor no disponible',
      duration: videoDetails.lengthSeconds ? formatDuration(parseInt(videoDetails.lengthSeconds)) : 'N/A',
      views: videoDetails.viewCount ? parseInt(videoDetails.viewCount) : 0,
      thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || 
                videoDetails.thumbnails?.[0]?.url || '',
      description: videoDetails.description || '',
    };

    console.log('Información procesada:', videoInfo);
    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error detallado al obtener información del video:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al obtener información del video: ${errorMessage}` },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
