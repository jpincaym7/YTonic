import { Marquee } from './magicui/marquee';

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4.369 4.369 0 00-1-.114 4 4 0 104 4V5.221l8-1.6v4.893a4.369 4.369 0 00-1-.114 4 4 0 104 4V3z" />
      </svg>
    ),
    title: "Audio MP3",
    description: "Alta calidad de audio sin video"
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    ),
    title: "Video MP4",
    description: "Video completo con audio incluido"
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    title: "Metadatos",
    description: "Información completa del video"
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd" />
      </svg>
    ),
    title: "Descarga Rápida",
    description: "Procesamiento optimizado y veloz"
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    title: "Sin Límites",
    description: "Descarga todos los videos que quieras"
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    title: "Seguro",
    description: "Sin registro ni datos personales"
  }
];

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-black rounded-xl p-6 border border-gray-700 text-center min-w-[280px] mx-2">
      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-white mb-3 text-lg">{title}</h3>
      <p className="text-sm text-gray-300 font-medium leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <div className="mt-16 w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-6 tracking-tight">
          Características principales
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Una herramienta simple y poderosa para descargar contenido de YouTube con la mejor calidad
        </p>
      </div>
      
      <div className="relative overflow-hidden">
        <Marquee pauseOnHover className="[--duration:30s]">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
