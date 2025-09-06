import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

// Configuración de timeouts y límites
const TIMEOUT_DURATION = 50000; // 50 segundos
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando descarga...');
    const { url, format, options = {} } = await request.json();

    if (!url) {
      console.log('❌ Error: URL no proporcionada');
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      );
    }

    if (!ytdl.validateURL(url)) {
      console.log('❌ Error: URL de YouTube no válida');
      return NextResponse.json(
        { error: 'URL de YouTube no válida' },
        { status: 400 }
      );
    }

    console.log('✅ URL válida, obteniendo información...');
    
    // Configurar opciones con headers mejorados para evitar detección de bot
    const requestOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      }
    };
    
    // Obtener información del video para el nombre del archivo con timeout
    const infoPromise = ytdl.getInfo(url, { requestOptions });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout obteniendo información')), TIMEOUT_DURATION)
    );
    
    const info = await Promise.race([infoPromise, timeoutPromise]) as ytdl.videoInfo;
    const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '').trim().substring(0, 50);
    
    console.log('📹 Video:', title);
    console.log('⚙️ Formato solicitado:', format);

    // Verificar duración del video
    const duration = parseInt(info.videoDetails.lengthSeconds);
    if (duration > 5400) { // 90 minutos
      return NextResponse.json(
        { error: 'Video demasiado largo. Máximo 90 minutos.' },
        { status: 400 }
      );
    }

    // Configurar opciones según el formato
    let downloadOptions: ytdl.downloadOptions = {
      quality: 'highest',
      requestOptions,
      ...options
    };

    if (format === 'mp3') {
      downloadOptions = {
        quality: 'highestaudio',
        filter: 'audioonly',
        requestOptions,
        ...options
      };
    } else if (format === 'mp4') {
      downloadOptions = {
        quality: 'highest',
        filter: (fmt) => fmt.container === 'mp4' && fmt.hasVideo && fmt.hasAudio,
        requestOptions,
        ...options
      };
    }

    console.log('🔧 Opciones configuradas:', downloadOptions);

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

    console.log('📦 Iniciando stream...');

    // Convertir el stream de Node.js a un ReadableStream web-compatible con control de tamaño
    let totalSize = 0;
    const webStream = new ReadableStream({
      start(controller) {
        const timeout = setTimeout(() => {
          console.log('⏰ Timeout alcanzado, cerrando stream');
          videoStream.destroy();
          controller.error(new Error('Timeout de descarga'));
        }, TIMEOUT_DURATION);

        videoStream.on('data', (chunk: Buffer) => {
          totalSize += chunk.length;
          
          // Verificar tamaño máximo
          if (totalSize > MAX_FILE_SIZE) {
            clearTimeout(timeout);
            videoStream.destroy();
            controller.error(new Error('Archivo demasiado grande'));
            return;
          }
          
          controller.enqueue(new Uint8Array(chunk));
        });

        videoStream.on('end', () => {
          clearTimeout(timeout);
          console.log('✅ Stream completado, tamaño:', totalSize);
          controller.close();
        });

        videoStream.on('error', (error: Error) => {
          clearTimeout(timeout);
          console.error('❌ Error en el stream:', error);
          controller.error(error);
        });
      },
      cancel() {
        console.log('🛑 Stream cancelado');
        videoStream.destroy();
      }
    });

    return new Response(webStream, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('💥 Error fatal al descargar video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    // Errores específicos para mejor debugging
    if (errorMessage.includes('Timeout')) {
      return NextResponse.json(
        { error: 'La descarga tardó demasiado. Intenta con un video más corto.' },
        { status: 408 }
      );
    }
    
    if (errorMessage.includes('demasiado grande')) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 100MB.' },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      { error: `Error al descargar el video: ${errorMessage}` },
      { status: 500 }
    );
  }
}
