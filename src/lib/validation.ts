/**
 * Utilidades de validación y sanitización para formularios
 */

// Lista de dominios de email temporales/desechables comunes para bloquear
const disposableEmailDomains = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'maildrop.cc',
  'sharklasers.com',
  'getnada.com',
  'tempail.com'
];

// Patrones de spam comunes
const spamPatterns = [
  /\b(buy now|click here|limited time|act now)\b/gi,
  /\b(viagra|casino|lottery|winner|congratulations)\b/gi,
  /(http[s]?:\/\/[^\s]+){3,}/gi, // Múltiples URLs
  /[A-Z]{10,}/g, // Texto en mayúsculas excesivo
];

/**
 * Valida formato de email con regex robusta
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

/**
 * Verifica si el email es de un dominio desechable
 */
export const isDisposableEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1];
  return disposableEmailDomains.includes(domain);
};

/**
 * Sanitiza input removiendo caracteres peligrosos
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover eventos onclick, onload, etc.
    .replace(/data:/gi, '') // Remover data URIs
    .replace(/vbscript:/gi, '') // Remover vbscript
    .replace(/expression\(/gi, '') // Remover CSS expressions
    .trim();
};

/**
 * Detecta contenido de spam
 */
export const isSpamContent = (text: string): boolean => {
  return spamPatterns.some(pattern => pattern.test(text));
};

/**
 * Validación completa de campo de formulario
 */
export const validateFormField = (name: string, value: string): string => {
  const sanitizedValue = sanitizeInput(value);
  
  // Verificar contenido de spam
  if (isSpamContent(sanitizedValue)) {
    return 'El contenido parece ser spam';
  }
  
  switch (name) {
    case 'name':
      if (!sanitizedValue) return 'El nombre es requerido';
      if (sanitizedValue.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (sanitizedValue.length > 50) return 'El nombre no puede exceder 50 caracteres';
      if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/.test(sanitizedValue)) {
        return 'El nombre solo puede contener letras, espacios, apostrofes y guiones';
      }
      break;
      
    case 'email':
      if (!sanitizedValue) return 'El email es requerido';
      if (!validateEmail(sanitizedValue)) return 'Por favor ingresa un email válido';
      if (isDisposableEmail(sanitizedValue)) return 'No se permiten emails temporales o desechables';
      if (sanitizedValue.length > 100) return 'El email no puede exceder 100 caracteres';
      break;
      
    case 'subject':
      if (!sanitizedValue) return 'El asunto es requerido';
      if (sanitizedValue.length < 5) return 'El asunto debe tener al menos 5 caracteres';
      if (sanitizedValue.length > 100) return 'El asunto no puede exceder 100 caracteres';
      break;
      
    case 'message':
      if (!sanitizedValue) return 'El mensaje es requerido';
      if (sanitizedValue.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
      if (sanitizedValue.length > 1000) return 'El mensaje no puede exceder 1000 caracteres';
      
      // Verificar que no sea solo números o caracteres especiales
      if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(sanitizedValue)) {
        return 'El mensaje debe contener al menos algunas letras';
      }
      break;
  }
  
  return '';
};

/**
 * Límite de velocidad para prevenir spam (cliente)
 */
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly TIME_WINDOW = 5 * 60 * 1000; // 5 minutos

  static canSubmit(identifier: string = 'default'): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = attempts.filter(time => now - time < this.TIME_WINDOW);
    
    return recentAttempts.length < this.MAX_ATTEMPTS;
  }

  static recordAttempt(identifier: string = 'default'): void {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(now);
    this.attempts.set(identifier, attempts);
  }

  static getRemainingTime(identifier: string = 'default'): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const recentAttempts = attempts.filter(time => now - time < this.TIME_WINDOW);
    
    if (recentAttempts.length < this.MAX_ATTEMPTS) return 0;
    
    const oldestAttempt = Math.min(...recentAttempts);
    return Math.ceil((this.TIME_WINDOW - (now - oldestAttempt)) / 1000);
  }
}
