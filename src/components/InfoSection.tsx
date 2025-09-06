export default function InfoSection() {
  return (
    <div className="mt-20 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-6 tracking-tight">
          Convertidor de YouTube a MP3/MP4
        </h2>
        <p className="text-gray-300 text-lg font-light leading-relaxed max-w-3xl mx-auto">
          Nuestro convertidor te permite descargar tus videos favoritos de YouTube como archivos MP3 (audio) o MP4 (video) de forma 
          <span className="text-white font-semibold"> gratuita y segura</span>. Compatible con ordenadores, tablets y dispositivos móviles 
          sin necesidad de instalar aplicaciones adicionales.
        </p>
      </div>

      {/* How to Use Section */}
      <div className="bg-card border border-border rounded-lg p-8 mb-12">
        <h3 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
          ¿Cómo descargar videos de YouTube?
        </h3>
        
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
              1
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Copia la URL del video
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Ve a YouTube.com, busca el video que quieres descargar y copia la URL desde la barra de direcciones 
                del navegador (youtube.com/watch?v=id).
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Pega y analiza
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Pega la URL en nuestro convertidor y haz clic en &ldquo;Analizar&rdquo;. Obtendrás toda la información del video 
                incluyendo título, duración y miniatura.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
              3
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Elige formato y descarga
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Selecciona tu formato preferido (MP3 para audio o MP4 para video) y haz clic en descargar. 
                La conversión comenzará automáticamente y podrás guardar el archivo en tu dispositivo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground">100% Gratis</h4>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sin costos ocultos, sin suscripciones. Convierte y descarga todos los videos que quieras de forma completamente gratuita.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground">Seguro y Privado</h4>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No almacenamos tus datos personales ni los videos descargados. Tu privacidad es nuestra prioridad.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground">Multi-dispositivo</h4>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Funciona perfectamente en ordenadores, tablets y móviles. No necesitas instalar ninguna aplicación adicional.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground">Descarga Rápida</h4>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Procesamiento optimizado para conversiones rápidas. Obtén tus archivos en segundos, no en minutos.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Al utilizar nuestro convertidor, aceptas que respetas los derechos de autor y solo descargas contenido 
          para uso personal. Agradecemos que hayas elegido nuestro convertidor de YouTube a MP3/MP4.
        </p>
      </div>
    </div>
  );
}
