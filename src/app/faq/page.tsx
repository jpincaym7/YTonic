'use client';

import Footer from '@/components/Footer';
import SharedMenu from '../../components/SharedMenu';

interface FAQItem {
  question: string;
  answer: string | string[];
}

interface FAQItemProps {
  item: FAQItem;
}

function FAQItem({ item }: FAQItemProps) {
  const renderAnswer = (answer: string | string[]) => {
    if (typeof answer === 'string') {
      return <p className="text-gray-700 leading-relaxed mt-3">{answer}</p>;
    }
    
    return (
      <div className="text-gray-700 leading-relaxed mt-3">
        {answer.map((line, idx) => (
          <p key={idx} className={idx > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="py-5 border-b-2 border-gray-300 last:border-b-0">
      {/* Question */}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
        {item.question}
      </h3>
      
      {/* Answer */}
      <div>
        {renderAnswer(item.answer)}
      </div>
    </div>
  );
}

export default function FAQ() {
  const faqData: FAQItem[] = [
    {
      question: "¿Qué URLs de video son compatibles?",
      answer: [
        "Actualmente, solo admitimos URLs de videos de YouTube:",
        "• youtube.com/watch?v=videoId",
        "• youtube.com/shorts/videoId",
        "• youtu.be/videoId"
      ]
    },
    {
      question: "¿Qué formatos son compatibles?",
      answer: "Por el momento, solo es posible convertir videos de YouTube a archivos MP3 (audio) o MP4 (video)."
    },
    {
      question: "¿Cómo cambiar el formato?",
      answer: "Simplemente haz clic en el botón \"MP3\" y el formato cambiará a \"MP4\". Haz clic nuevamente para volver a \"MP3\"."
    },
    {
      question: "La conversión se quedó atascada.",
      answer: "Limpia el caché de tu navegador y actualiza la página. Si la conversión sigue atascada, utiliza nuestro formulario de contacto para obtener soporte."
    },
    {
      question: "Estoy recibiendo un error.",
      answer: [
        "Por favor, asegúrate de que tu video no sea:",
        "• Restringido por edad",
        "• Una transmisión en vivo",
        "• Más largo de 90 minutos",
        "• Privado (debe ser visible sin iniciar sesión)"
      ]
    },
    {
      question: "Fui bloqueado/incluido en lista negra.",
      answer: "Has alcanzado tu límite diario de descargas. Tu IP será incluida en la lista blanca después de 24 horas."
    },
    {
      question: "Mi pregunta no está en la lista.",
      answer: "Usa nuestro formulario de contacto para comunicarte con nosotros o reportar cualquier error."
    }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Staggered Menu */}
      <SharedMenu />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">
          {/* FAQ Title */}
          <div className="text-center mb-8 md:mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6">
              FAQ 
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Encuentra respuestas a las preguntas más comunes sobre nuestro convertidor de YouTube a MP3/MP4
            </p>
          </div>

          {/* FAQ Items */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
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
