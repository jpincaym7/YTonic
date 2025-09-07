import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { extractVideoId, isValidYouTubeUrl } from '../../../../lib/youtube-utils';

// Configurar runtime para Edge (mejor para Vercel)
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos

// Claves de RapidAPI
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Tipos para la respuesta de ytstream
interface VideoFormat {
  itag: number;
  mimeType: string;
  bitrate: number;
  width?: number;
  height?: number;
  fps?: number;
  quality: string;
  qualityLabel?: string;
  audioChannels?: number;
  url: string;
  contentLength?: string;
}

interface YTStreamResponse {
  status: string;
  title: string;
  lengthSeconds: string;
  channelTitle: string;
  viewCount: string;
  thumbnail: Array<{ url: string; width: number; height: number }>;
  formats: VideoFormat[];
  adaptiveFormats: VideoFormat[];
}

export async function POST(request: NextRequest) {
  try {
    const { url, format } = await request.json();

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
      // Usar RapidAPI ytstream para obtener información completa y enlaces de descarga
      const mp4Options = {
        method: 'GET',
        url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
        params: { id: videoId },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(mp4Options);
        const data = response.data as YTStreamResponse;

        console.log('Respuesta ytstream API:', data);

        if (data.status !== 'OK') {
          return NextResponse.json(
            { error: 'No se pudo obtener información del video' },
            { status: 500 }
          );
        }

        // Buscar el mejor formato de video (MP4 con audio)
        let selectedFormat: VideoFormat | undefined = undefined;
        
        // Priorizar formatos combinados (video + audio)
        if (data.formats && data.formats.length > 0) {
          // Buscar formato 18 (360p MP4 con audio) como predeterminado
          selectedFormat = data.formats.find((f: VideoFormat) => f.itag === 18);
          
          // Si no hay formato 18, buscar cualquier formato MP4 con audio
          if (!selectedFormat) {
            selectedFormat = data.formats.find((f: VideoFormat) => 
              f.mimeType.includes('video/mp4') && 
              f.audioChannels && 
              f.audioChannels > 0
            );
          }
        }

        // Si no hay formatos combinados, usar formatos adaptativos
        if (!selectedFormat && data.adaptiveFormats) {
          // Buscar el mejor formato de video adaptativo (MP4)
          const videoFormats = data.adaptiveFormats.filter((f: VideoFormat) => 
            f.mimeType.includes('video/mp4') && 
            f.qualityLabel
          );
          
          if (videoFormats.length > 0) {
            // Ordenar por calidad (720p, 480p, 360p, etc.)
            videoFormats.sort((a: VideoFormat, b: VideoFormat) => {
              const qualityOrder: { [key: string]: number } = { '720p': 3, '480p': 2, '360p': 1 };
              const aQuality = qualityOrder[a.qualityLabel || ''] || 0;
              const bQuality = qualityOrder[b.qualityLabel || ''] || 0;
              return bQuality - aQuality;
            });
            
            selectedFormat = videoFormats[0];
          }
        }

        if (!selectedFormat) {
          return NextResponse.json(
            { error: 'No se encontró un formato de video compatible' },
            { status: 500 }
          );
        }

        // Retornar información de descarga
        return NextResponse.json({
          success: true,
          format: 'mp4',
          title: data.title,
          downloadUrl: selectedFormat.url,
          quality: selectedFormat.qualityLabel || selectedFormat.quality,
          width: selectedFormat.width,
          height: selectedFormat.height,
          fps: selectedFormat.fps,
          bitrate: selectedFormat.bitrate,
          fileSize: selectedFormat.contentLength,
          mimeType: selectedFormat.mimeType,
          duration: data.lengthSeconds,
          thumbnail: data.thumbnail?.[data.thumbnail.length - 1]?.url,
          channelTitle: data.channelTitle,
          viewCount: data.viewCount
        });

      } catch (error) {
        console.error('Error en API ytstream:', error);
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
