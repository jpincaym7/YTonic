import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

// Configurar runtime para Edge (mejor para Vercel)
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos

export async function POST(request: NextRequest) {
  try {
    const { url, format, options = {} } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'URL de YouTube no válida' },
        { status: 400 }
      );
    }

    // Obtener información del video para el nombre del archivo
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '').trim().substring(0, 100);

    // Configurar opciones según el formato
    let downloadOptions: ytdl.downloadOptions = {
      quality: 'highest',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
      ...options
    };

    if (format === 'mp3') {
      downloadOptions = {
        quality: 'highestaudio',
        filter: 'audioonly',
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        },
        ...options
      };
    } else if (format === 'mp4') {
      downloadOptions = {
        quality: 'highest',
        filter: (fmt) => fmt.container === 'mp4' && fmt.hasVideo && fmt.hasAudio,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        },
        ...options
      };
    }

    // Crear el stream de descarga
    const videoStream = ytdl(url, downloadOptions);
    
    // Configurar headers para la descarga
    const headers = new Headers();
    
    if (format === 'mp3') {
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Content-Disposition', `attachment; filename="${title}.mp3"`);
    } else {
      headers.set('Content-Type', 'video/mp4');
      headers.set('Content-Disposition', `attachment; filename="${title}.mp4"`);
    }
    
    headers.set('Access-Control-Expose-Headers', 'Content-Disposition');
    headers.set('Cache-Control', 'no-cache');

    // Convertir el stream de Node.js a un ReadableStream web-compatible
    const webStream = new ReadableStream({
      start(controller) {
        videoStream.on('data', (chunk: Buffer) => {
          const uint8Array = new Uint8Array(chunk);
          controller.enqueue(uint8Array);
        });

        videoStream.on('end', () => {
          controller.close();
        });

        videoStream.on('error', (error: Error) => {
          console.error('Error en el stream:', error);
          controller.error(error);
        });
      },
      cancel() {
        videoStream.destroy();
      }
    });

    return new Response(webStream, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Error al descargar video:', error);
    return NextResponse.json(
      { error: 'Error al descargar el video: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    );
  }
}
