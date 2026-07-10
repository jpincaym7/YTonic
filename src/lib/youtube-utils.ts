/**
 * Utilidades para trabajar con URLs y APIs de YouTube
 */

/**
 * Extrae el ID del video de una URL de YouTube.
 * Cubre todos los formatos comunes: watch, youtu.be, shorts, embed, live, v,
 * y los subdominios www / m / music. El ID de YouTube son exactamente 11
 * caracteres del conjunto [A-Za-z0-9_-].
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/, // www/m/music .youtube.com/watch?v=
    /youtu\.be\/([A-Za-z0-9_-]{11})/,                     // youtu.be/ID
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,          // /shorts/ID
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,            // /live/ID
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,           // /embed/ID
    /youtube\.com\/v\/([A-Za-z0-9_-]{11})/,               // /v/ID
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match) return match[1];
  }
  return null;
}

/**
 * Valida si una URL es un video de YouTube reconocible.
 * Coherente con extractVideoId: válida ⟺ se puede extraer un ID.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Formatea la duración de segundos a formato MM:SS o HH:MM:SS
 */
export function formatDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Convierte duración ISO 8601 a segundos
 */
export function parseISODuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}
