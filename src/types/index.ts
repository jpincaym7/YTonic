/**
 * Tipos e interfaces para la aplicación YouTube / Spotify to MP3/MP4 Downloader
 */

/**
 * Fuente de descarga soportada
 */
export type MediaSource = 'youtube' | 'spotify';

/**
 * Información básica de un video (YouTube) o track (Spotify)
 */
export interface VideoInfo {
  /** ID único del video/track */
  id: string;
  /** Título del video/canción */
  title: string;
  /** Nombre del autor/canal o artista */
  author: string;
  /** Duración en formato legible */
  duration: string;
  /** Duración en segundos */
  durationSeconds: number;
  /** Número de visualizaciones (0 para Spotify) */
  views: number;
  /** URL de la miniatura / carátula */
  thumbnail: string;
  /** Descripción del video (opcional) */
  description?: string;
  /** Fecha de publicación */
  publishedAt?: string;
  /** ID del canal */
  channelId?: string;
  /** Fuente del contenido (youtube por defecto) */
  source?: MediaSource;
  /** Álbum (solo Spotify) */
  album?: string;
  /** Enlace de descarga ya resuelto (solo Spotify: se resuelve al obtener info) */
  downloadUrl?: string;
}

/**
 * Opciones de descarga avanzadas
 */
export interface DownloadOptions {
  /** Calidad del video/audio a descargar */
  quality: string;
  /** Tamaño del buffer de escritura en bytes */
  highWaterMark: number;
  /** Tamaño del chunk de descarga en bytes */
  dlChunkSize: number;
  /** Tiempo de inicio para recortar el video (opcional) */
  begin?: string;
  /** Filtro de descarga (audioonly, audioandvideo, etc.) */
  filter?: string;
}

/**
 * Respuesta de descarga MP3
 */
export interface Mp3DownloadResponse {
  success: boolean;
  format: 'mp3';
  title: string;
  downloadUrl: string;
  duration: number;
  progress: number;
  status: string;
  message: string;
}

/**
 * Respuesta de descarga MP4
 */
export interface Mp4DownloadResponse {
  success: boolean;
  format: 'mp4';
  downloadUrl: string;
  quality: string;
  type: string;
  bitrate: number;
  size: string;
  mime: string;
  comment: string;
}

/**
 * Respuesta unificada de descarga
 */
export type DownloadResponse = Mp3DownloadResponse | Mp4DownloadResponse;

/**
 * Formatos de descarga soportados
 */
export type DownloadFormat = 'mp3' | 'mp4';

/**
 * Estados de carga de la aplicación
 */
export interface LoadingState {
  /** Indica si hay una operación en progreso */
  isLoading: boolean;
  /** Tipo de operación que se está realizando */
  operation?: 'info' | 'download';
}

/**
 * Estado de progreso de descarga
 */
export interface DownloadProgress {
  /** Porcentaje de descarga completado (0-100) */
  percentage: number;
  /** Bytes descargados */
  downloaded?: number;
  /** Tamaño total en bytes */
  total?: number;
}
