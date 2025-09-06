import Image from 'next/image';
import { useState } from 'react';
import type { VideoInfo, DownloadOptions } from '../types';

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  error: string;
  videoInfo: VideoInfo | null;
  downloadProgress: number;
  advancedOptions: DownloadOptions;
  setShowAdvancedOptions: (show: boolean) => void;
  onGetInfo: () => void;
  onDownload: (format: 'mp3' | 'mp4') => void;
}

export default function InputSection({
  url,
  setUrl,
  loading,
  error,
  videoInfo,
  downloadProgress,
  setShowAdvancedOptions,
  onGetInfo,
  onDownload,
}: InputSectionProps) {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'mp3' | 'mp4' | null>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Generar CAPTCHA simple
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  const handleDownloadClick = (format: 'mp3' | 'mp4') => {
    setPendingFormat(format);
    generateCaptcha();
    setShowCaptcha(true);
    setCaptchaInput('');
  };

  const verifyCaptcha = () => {
    if (captchaInput.toUpperCase() === captchaText) {
      setShowCaptcha(false);
      if (pendingFormat) {
        onDownload(pendingFormat);
      }
      setPendingFormat(null);
      setCaptchaInput('');
    } else {
      alert('CAPTCHA incorrecto. Inténtalo de nuevo.');
      generateCaptcha();
      setCaptchaInput('');
    }
  };

  const closeCaptcha = () => {
    setShowCaptcha(false);
    setPendingFormat(null);
    setCaptchaInput('');
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          {loading ? (
            <button
              disabled={true}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-90 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm"
            >
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Convirtiendo...
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega aquí la URL de YouTube..."
                className="flex-1 px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-sm"
                disabled={loading}
              />
              <button
                onClick={onGetInfo}
                disabled={loading || !url}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[120px] text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Convertir
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Info & Download Section */}
      {videoInfo && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {videoInfo.thumbnail && (
                <div className="flex-shrink-0">
                  <Image
                    src={videoInfo.thumbnail}
                    alt="Video thumbnail"
                    width={200}
                    height={112}
                    className="w-full lg:w-50 h-auto rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <h3 className="text-foreground font-semibold text-lg line-clamp-2 leading-tight mb-2">
                    {videoInfo.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{videoInfo.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{videoInfo.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>{videoInfo.views?.toLocaleString()} vistas</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownloadClick('mp3')}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span>Descargar MP3</span>
                      <span className="text-xs opacity-80">(Solo Audio)</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownloadClick('mp4')}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span>Descargar MP4</span>
                      <span className="text-xs opacity-80">(Video + Audio)</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={() => setShowAdvancedOptions(true)}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Opciones avanzadas
              </button>
            </div>
          </div>

          {/* Download Progress */}
          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="px-6 pb-6">
              <div className="space-y-2">
                <div className="bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Descargando... {downloadProgress}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CAPTCHA Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Verificación de Seguridad
              </h3>
              <p className="text-sm text-muted-foreground">
                Por favor, ingresa el código que aparece abajo para continuar con la descarga
              </p>
              
              {/* CAPTCHA Display */}
              <div className="bg-muted p-4 rounded-md border-2 border-dashed border-border">
                <div className="text-2xl font-bold text-center tracking-widest font-mono bg-white text-black p-2 rounded select-none">
                  {captchaText}
                </div>
              </div>

              {/* Input */}
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Ingresa el código..."
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-center uppercase"
                maxLength={5}
                autoFocus
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeCaptcha}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={verifyCaptcha}
                  disabled={captchaInput.length !== 5}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  Verificar
                </button>
              </div>
              
              <button
                onClick={generateCaptcha}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Generar nuevo código
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
