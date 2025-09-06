'use client';

import Footer from '@/components/Footer';
import SharedMenu from '../../components/SharedMenu';

interface CopyrightSection {
  title: string;
  content: string | string[];
}

interface CopyrightSectionProps {
  section: CopyrightSection;
}

function CopyrightSection({ section }: CopyrightSectionProps) {
  const renderContent = (content: string | string[]) => {
    if (typeof content === 'string') {
      return <p className="text-gray-700 leading-relaxed mt-3">{content}</p>;
    }
    
    return (
      <div className="text-gray-700 leading-relaxed mt-3">
        {content.map((line, idx) => {
          // Si la línea contiene HTML para centrar
          if (line.includes('<div class=\'text-center\'>')) {
            return (
              <div key={idx} className={`text-center ${idx > 0 ? "mt-4" : ""}`}>
                <div className="bg-gray-50 p-4 rounded-lg inline-block">
                  <div className="text-gray-800 font-medium leading-relaxed">
                    Agente de Derechos de Autor<br />
                    YouTube MP3/MP4 Converter<br />
                    Guayas, Guayaquil<br />
                    Ecuador<br />
                    Email: pepsimanx12@gmail.com
                  </div>
                </div>
              </div>
            );
          }
          // Si es una línea que termina con </div>, la omitimos ya que está incluida arriba
          if (line.includes('</div>')) {
            return null;
          }
          // Si es parte del contenido centrado, la omitimos ya que está incluida arriba
          if (line.includes('Agente de Derechos de Autor<br>') || 
              line.includes('YouTube MP3/MP4 Converter<br>') ||
              line.includes('Guayas, Guayaquil<br>') ||
              line.includes('Ecuador<br>') ||
              line.includes('Email: pepsimanx12@gmail.com')) {
            return null;
          }
          
          return (
            <p key={idx} className={idx > 0 ? "mt-2" : ""}>
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-5 border-b-2 border-gray-300 last:border-b-0">
      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
        {section.title}
      </h3>
      
      {/* Content */}
      <div>
        {renderContent(section.content)}
      </div>
    </div>
  );
}

export default function Copyright() {
  const copyrightData: CopyrightSection[] = [
    {
      title: "Copyright Claims",
      content: "Respetamos los derechos de propiedad intelectual de otros. No puedes infringir los derechos de autor, marcas comerciales u otros derechos de información propietaria de cualquier parte. Podemos, a nuestra entera discreción, eliminar cualquier contenido que tengamos razones para creer que viola cualquiera de los derechos de propiedad intelectual de otros y podemos terminar tu uso del sitio web si envías dicho contenido."
    },
    {
      title: "Política de Infractores Reincidentes",
      content: "COMO PARTE DE NUESTRA POLÍTICA DE INFRACCIÓN REPETIDA, CUALQUIER USUARIO CUYOS MATERIALES RECIBAMOS TRES QUEJAS DE BUENA FE Y EFECTIVAS DENTRO DE CUALQUIER PERÍODO CONTIGUO DE SEIS MESES TENDRÁ SU CONCESIÓN DE USO DEL SITIO WEB TERMINADA."
    },
    {
      title: "Cumplimiento DMCA",
      content: [
        "Aunque no estamos sujetos a la ley de los Estados Unidos, cumplimos voluntariamente con la Ley de Derechos de Autor del Milenio Digital. Según el Título 17, Sección 512(c)(2) del Código de los Estados Unidos, si crees que alguno de tus materiales con derechos de autor está siendo infringido en el sitio web, hemos designado un agente para recibir notificaciones de presunta infracción de derechos de autor.",
        "",
        "Las notificaciones deben enviarse por correo electrónico a: pepsimanx12@gmail.com",
        "",
        "O enviarse a:",
        "",
          "<div class='text-center'>",
          "Agente de Derechos de Autor<br>",
          "YouTube MP3/MP4 Converter<br>",
          "Guayas, Guayaquil<br>",
          "Ecuador<br>",
          "Email: pepsimanx12@gmail.com",
          "</div>"
      ]
    },
    {
      title: "Requisitos para Notificación de Infracción",
      content: [
        "Una notificación efectiva de presunta infracción debe ser una comunicación escrita a nuestro agente que incluya sustancialmente lo siguiente:",
        "",
        "• Identificación del trabajo con derechos de autor que se cree que está siendo infringido",
        "• Identificación del material que se cree que está infringiendo y su ubicación",
        "• Información que nos permita contactarte (dirección, teléfono, email)",
        "• Una declaración de que tienes una creencia de buena fe de que el uso del material no está autorizado",
        "• Una declaración de que la información en la notificación es precisa",
        "• Una firma física o electrónica del titular de los derechos de autor o representante autorizado"
      ]
    },
    {
      title: "Contra-notificación",
      content: [
        "Si tu contenido es eliminado debido a una notificación de presunta infracción de derechos de autor, puedes proporcionarnos una contra-notificación que debe incluir:",
        "",
        "• Tu firma física o electrónica",
        "• Identificación del material que ha sido eliminado",
        "• Una declaración bajo pena de perjurio de que tienes una creencia de buena fe de que el material fue eliminado por error",
        "• Tu nombre, dirección, teléfono, email y una declaración de que consientes a la jurisdicción de los tribunales",
        "• Una declaración de que aceptarás el servicio de proceso del presunto propietario de los derechos de autor"
      ]
    },
    {
      title: "Uso Legítimo",
      content: "Nuestro servicio está diseñado para uso personal y educativo. Los usuarios son responsables de asegurarse de que su uso del contenido descargado cumple con las leyes de derechos de autor aplicables y las políticas de uso de YouTube."
    },
    {
      title: "Limitación de Responsabilidad",
      content: "No somos responsables del uso que los usuarios hagan del contenido descargado. Los usuarios deben obtener los permisos necesarios de los propietarios de los derechos de autor antes de usar el contenido descargado para fines comerciales o de distribución."
    }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Staggered Menu */}
      <SharedMenu />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Copyright Title */}
          <div className="text-center mb-8 md:mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6">
              Copyright 
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Información sobre derechos de autor y uso legítimo de nuestro convertidor de YouTube
            </p>
          </div>

          {/* Copyright Sections */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
            {copyrightData.map((section, index) => (
              <CopyrightSection
                key={index}
                section={section}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="animate-in slide-in-from-bottom duration-700 delay-800">
            <Footer />
          </div>
        
        </div>
      </main>
    </div>
  );
}
