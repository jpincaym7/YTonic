'use client';

import { useState } from 'react';
import AdvancedOptions from '../components/AdvancedOptions';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import FeaturesSection from '../components/FeaturesSection';
import InfoSection from '../components/InfoSection';
import SharedMenu from '../components/SharedMenu';
import Footer from '../components/Footer';
import type { VideoInfo, DownloadOptions, MediaSource } from '../types';

export default function Home() {
  const [source, setSource] = useState<MediaSource>('youtube');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState<DownloadOptions>({
    quality: 'highest',
    highWaterMark: 512 * 1024,
    dlChunkSize: 10 * 1024 * 1024,
  });

  // Cambiar de fuente limpia el estado para evitar mezclar YouTube y Spotify
  const handleSourceChange = (next: MediaSource) => {
    if (next === source) return;
    setSource(next);
    setUrl('');
    setVideoInfo(null);
    setError('');
    setDownloadProgress(0);
  };

  // Dispara la descarga en el navegador a partir de un enlace ya resuelto
  const triggerBrowserDownload = (downloadUrl: string, title: string, ext: string) => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank'; // Abrir en nueva pestaña
    a.rel = 'noopener noreferrer';
    a.download = `${title.replace(/[^\w\s-]/gi, '').trim()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleGetInfo = async () => {
    if (!url) {
      setError(
        source === 'spotify'
          ? 'Por favor ingresa una URL de Spotify'
          : 'Por favor ingresa una URL de YouTube'
      );
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);
    setDownloadProgress(0);

    try {
      const endpoint = source === 'spotify' ? '/api/spotify/info' : '/api/youtube/info';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Error al obtener información del contenido');
      }

      setVideoInfo({ ...data, source });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'mp3' | 'mp4') => {
    if (!videoInfo) return;

    // Spotify: el enlace de descarga ya se resolvió al obtener la info.
    if (source === 'spotify') {
      if (!videoInfo.downloadUrl) {
        setError('No se recibió URL de descarga');
        return;
      }
      triggerBrowserDownload(videoInfo.downloadUrl, videoInfo.title, 'mp3');
      setDownloadProgress(100);
      return;
    }

    setLoading(true);
    setDownloadProgress(0);

    try {
      const mergedOptions = {
        ...advancedOptions,
        quality: format === 'mp3' ? 'highestaudio' : advancedOptions.quality,
        filter: format === 'mp3' ? 'audioonly' : 'audioandvideo'
      };

      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          format,
          options: mergedOptions
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Error al descargar el archivo');
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar la descarga');
      }

      console.log('Respuesta de descarga:', data);

      // Redirigir al usuario al enlace de descarga
      const downloadUrl = data.downloadUrl;

      if (downloadUrl) {
        // Usar el nombre del archivo si está disponible
        const title = data.format === 'mp3' && data.title ? data.title : videoInfo.title;
        triggerBrowserDownload(downloadUrl, title, format);

        setDownloadProgress(100);

        // Mostrar información adicional si está disponible
        if (data.format === 'mp4') {
          console.log(`Calidad: ${data.quality}, Resolución: ${data.width}x${data.height}`);
          if (data.fileSize) {
            console.log(`Tamaño: ${(parseInt(data.fileSize) / (1024 * 1024)).toFixed(2)} MB`);
          }
          if (data.duration) {
            console.log(`Duración: ${Math.floor(parseInt(data.duration) / 60)}:${(parseInt(data.duration) % 60).toString().padStart(2, '0')}`);
          }
        }

      } else {
        throw new Error('No se recibió URL de descarga');
      }

    } catch (err) {
      console.error('Error en descarga:', err);
      setError(err instanceof Error ? err.message : 'Error al descargar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black animate-in fade-in duration-1000 relative">
      {/* Staggered Menu - Positioned absolutely to overlay content */}
      <SharedMenu />

      {/* Header */}
      <div className="animate-in slide-in-from-top duration-700 delay-100">
        <Header />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Input Section */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-200">
          <InputSection
            source={source}
            setSource={handleSourceChange}
            url={url}
            setUrl={setUrl}
            loading={loading}
            error={error}
            videoInfo={videoInfo}
            downloadProgress={downloadProgress}
            advancedOptions={advancedOptions}
            setShowAdvancedOptions={setShowAdvancedOptions}
            onGetInfo={handleGetInfo}
            onDownload={handleDownload}
          />
        </div>

        {/* Info Section */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-700">
          <InfoSection />
        </div>

        {/* Features Section */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-500">
          <FeaturesSection />
        </div>

      </main>

      {/* Footer */}
      <div className="animate-in slide-in-from-bottom duration-700 delay-800">
        <Footer />
      </div>

      <AdvancedOptions
        isOpen={showAdvancedOptions}
        onClose={() => setShowAdvancedOptions(false)}
        onApply={(options) => setAdvancedOptions(options)}
      />
    </div>
  );
}
