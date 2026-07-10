/**
 * Utilidades para trabajar con URLs de Spotify
 * (espejo de youtube-utils.ts)
 */

/**
 * Extrae el ID de un track de una URL de Spotify.
 * Soporta:
 *   - https://open.spotify.com/track/<id>
 *   - https://open.spotify.com/intl-es/track/<id>
 *   - spotify:track:<id>
 */
export function extractSpotifyTrackId(url: string): string | null {
  const httpMatch = url.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]{22})/);
  if (httpMatch) return httpMatch[1];

  const uriMatch = url.match(/spotify:track:([A-Za-z0-9]{22})/);
  if (uriMatch) return uriMatch[1];

  return null;
}

/**
 * Valida si una URL corresponde a un track de Spotify.
 */
export function isValidSpotifyUrl(url: string): boolean {
  return extractSpotifyTrackId(url) !== null;
}

/**
 * Construye una URL canónica y limpia (sin parámetros de tracking)
 * para pasarla como `songId` a la API de descarga.
 */
export function buildCanonicalTrackUrl(id: string): string {
  return `https://open.spotify.com/track/${id}`;
}
