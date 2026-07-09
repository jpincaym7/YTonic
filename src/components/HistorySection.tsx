'use client';

import { useEffect, useState } from 'react';
import {
  getDownloadHistory,
  getDownloadReport,
  clearDownloadHistory,
  type DownloadHistoryEntry,
} from '../lib/download-history';

interface HistorySectionProps {
  refreshKey: number;
}

export default function HistorySection({ refreshKey }: HistorySectionProps) {
  const [history, setHistory] = useState<DownloadHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, [refreshKey]);

  if (history.length === 0) {
    return null;
  }

  const report = getDownloadReport(history);

  const handleClear = () => {
    clearDownloadHistory();
    setHistory([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground font-semibold text-lg">
            Historial y reportes de descargas
          </h2>
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Limpiar historial
          </button>
        </div>

        {/* Reporte resumen */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-secondary/40 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{report.total}</p>
            <p className="text-xs text-muted-foreground">Total descargas</p>
          </div>
          <div className="bg-secondary/40 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{report.mp3Count}</p>
            <p className="text-xs text-muted-foreground">MP3</p>
          </div>
          <div className="bg-secondary/40 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{report.mp4Count}</p>
            <p className="text-xs text-muted-foreground">MP4</p>
          </div>
        </div>

        {/* Lista de historial */}
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
            >
              <span className="text-foreground truncate flex-1 mr-3">{entry.title}</span>
              <span className="text-muted-foreground uppercase text-xs mr-3">{entry.format}</span>
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {new Date(entry.downloadedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
