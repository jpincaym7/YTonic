import { NextRequest, NextResponse } from 'next/server';
import { validateFormField, sanitizeInput, isSpamContent } from '@/lib/validation';

// Rate limiting en el servidor (usando Map - en producción usar Redis)
const rateLimit = new Map<string, number[]>();
const MAX_REQUESTS = 3;
const TIME_WINDOW = 5 * 60 * 1000; // 5 minutos

function getRateLimitKey(request: NextRequest): string {
  // Usar IP + User-Agent como identificador único
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const requests = rateLimit.get(key) || [];
  
  // Filtrar requests dentro de la ventana de tiempo
  const recentRequests = requests.filter(time => now - time < TIME_WINDOW);
  rateLimit.set(key, recentRequests);
  
  return recentRequests.length >= MAX_REQUESTS;
}

function recordRequest(key: string): void {
  const now = Date.now();
  const requests = rateLimit.get(key) || [];
  requests.push(now);
  rateLimit.set(key, requests);
}

export async function POST(request: NextRequest) {
  try {
    // Verificar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo más tarde.' },
        { status: 429 }
      );
    }

    // Parsear y validar JSON
    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'JSON inválido' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = data;

    // Verificar que todos los campos estén presentes
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Sanitizar todos los inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    };

    // Validar cada campo
    const errors: Record<string, string> = {};
    Object.entries(sanitizedData).forEach(([field, value]) => {
      const error = validateFormField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Datos de formulario inválidos', details: errors },
        { status: 400 }
      );
    }

    // Verificación adicional de spam
    const allText = `${sanitizedData.name} ${sanitizedData.subject} ${sanitizedData.message}`;
    if (isSpamContent(allText)) {
      return NextResponse.json(
        { error: 'Contenido detectado como spam' },
        { status: 400 }
      );
    }

    // Registrar el intento
    recordRequest(rateLimitKey);

    // Aquí iría la lógica para enviar el email
    // Por ejemplo, usando nodemailer, sendgrid, etc.
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
    
    console.log('Formulario de contacto recibido:', {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      ip: clientIp
    });

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implementar envío real de email
    // const emailSent = await sendEmail(sanitizedData);
    // if (!emailSent) {
    //   throw new Error('Error al enviar email');
    // }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado exitosamente' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en contacto API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Manejar métodos no permitidos
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}
