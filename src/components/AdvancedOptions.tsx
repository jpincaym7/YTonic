'use client';

import { useState } from 'react';

interface DownloadOptions {
  quality: string;
  highWaterMark: number;
  dlChunkSize: number;
  begin?: string;
}

interface AdvancedOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (options: DownloadOptions) => void;
}

export default function AdvancedOptions({ isOpen, onClose, onApply }: AdvancedOptionsProps) {
  const [quality, setQuality] = useState('highest');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [customRange, setCustomRange] = useState(false);
  const [highWaterMark, setHighWaterMark] = useState(512);
  const [dlChunkSize, setDlChunkSize] = useState(10);

  const handleApply = () => {
    const options: DownloadOptions = {
      quality,
      highWaterMark: highWaterMark * 1024,
      dlChunkSize: dlChunkSize * 1024 * 1024,
    };

    if (customRange && startTime) {
      options.begin = startTime;
    }

    if (customRange && startTime && endTime) {
      // Para implementar rango completo necesitaríamos lógica adicional
      // ya que ytdl-core no soporta directamente end time
      options.begin = startTime;
    }

    onApply(options);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Opciones Avanzadas
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Calidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calidad de video/audio:
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="highest">Más alta disponible</option>
              <option value="lowest">Más baja disponible</option>
              <option value="highestaudio">Mejor calidad de audio</option>
              <option value="lowestaudio">Menor calidad de audio</option>
            </select>
          </div>

          {/* Rango de tiempo personalizado */}
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="customRange"
                checked={customRange}
                onChange={(e) => setCustomRange(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="customRange" className="text-sm font-medium text-gray-700">
                Rango de tiempo personalizado
              </label>
            </div>
            
            {customRange && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Inicio (mm:ss)
                  </label>
                  <input
                    type="text"
                    placeholder="0:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Fin (mm:ss)
                  </label>
                  <input
                    type="text"
                    placeholder="5:00"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buffer de memoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buffer de memoria: {highWaterMark} KB
            </label>
            <input
              type="range"
              min="128"
              max="2048"
              step="128"
              value={highWaterMark}
              onChange={(e) => setHighWaterMark(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>128 KB</span>
              <span>2 MB</span>
            </div>
          </div>

          {/* Tamaño de fragmentos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de fragmentos: {dlChunkSize} MB
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={dlChunkSize}
              onChange={(e) => setDlChunkSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 MB</span>
              <span>50 MB</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
