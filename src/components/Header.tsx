import { Highlighter } from './magicui/highlighter';
import { AuroraText } from './magicui/aurora-text';

export default function Header() {
  return (
    <header className="bg-black border-b border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black mb-4 tracking-tight text-gray-300">
            Y<AuroraText>Tonic</AuroraText>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Convierte y descarga{" "}
            <Highlighter action="highlight" color="#FF6B35">
              videos de YouTube
            </Highlighter>{" "}
            en{" "}
            <Highlighter action="underline" color="#00D4FF">
              MP3 o MP4
            </Highlighter>{" "}
            con la mejor calidad
          </p>
        </div>
      </div>
    </header>
  );
}
