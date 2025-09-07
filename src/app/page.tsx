'use client';

import { useState } from 'react';
import AdvancedOptions from '../components/AdvancedOptions';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import FeaturesSection from '../components/FeaturesSection';
import InfoSection from '../components/InfoSection';
import SharedMenu from '../components/SharedMenu';
import Footer from '../components/Footer';
import type { VideoInfo, DownloadOptions } from '../types';

export default function Home() {
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

  const handleGetInfo = async () => {
    if (!url) {
      setError('Por favor ingresa una URL de YouTube');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch('/api/youtube/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del video');
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'mp3' | 'mp4') => {
    if (!videoInfo) return;

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

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al procesar la descarga');
      }

      console.log('Respuesta de descarga:', data);

      // Redirigir al usuario al enlace de descarga
      const downloadUrl = data.downloadUrl;
      
      if (downloadUrl) {
        // Crear un enlace temporal y hacer clic en él para iniciar la descarga
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.target = '_blank'; // Abrir en nueva pestaña
        a.rel = 'noopener noreferrer';
        
        // Intentar usar el nombre del archivo si está disponible
        if (data.format === 'mp3' && data.title) {
          a.download = `${data.title.replace(/[^\w\s-]/gi, '').trim()}.mp3`;
        } else {
          a.download = `${videoInfo.title.replace(/[^\w\s-]/gi, '').trim()}.${format}`;
        }
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setDownloadProgress(100);
        
        // Mostrar información adicional si está disponible
        if (data.format === 'mp4') {
          console.log(`Calidad: ${data.quality}, Tamaño: ${data.size}, Tipo: ${data.type}`);
          if (data.comment) {
            console.log('Nota:', data.comment);
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
