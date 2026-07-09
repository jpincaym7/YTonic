/**
 * Historial de descargas y reportes (persistidos en localStorage)
 * Funcionalidad exclusiva de la Version 2 (Completa) de YTonic.
 */

const STORAGE_KEY = 'ytonic_download_history';
const MAX_ENTRIES = 50;

export interface DownloadHistoryEntry {
  id: string;
  title: string;
  format: 'mp3' | 'mp4';
  downloadedAt: string;
}

export interface DownloadReport {
  total: number;
  mp3Count: number;
  mp4Count: number;
  lastDownloadAt: string | null;
}

export function getDownloadHistory(): DownloadHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDownloadHistoryEntry(
  entry: Omit<DownloadHistoryEntry, 'id' | 'downloadedAt'>
): DownloadHistoryEntry[] {
  const history = getDownloadHistory();
  const newEntry: DownloadHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    downloadedAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearDownloadHistory(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getDownloadReport(history: DownloadHistoryEntry[]): DownloadReport {
  return {
    total: history.length,
    mp3Count: history.filter((h) => h.format === 'mp3').length,
    mp4Count: history.filter((h) => h.format === 'mp4').length,
    lastDownloadAt: history[0]?.downloadedAt ?? null,
  };
}
