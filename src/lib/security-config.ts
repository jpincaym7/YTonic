/**
 * Configuración de seguridad para el formulario de contacto
 */

export const SECURITY_CONFIG = {
  // Límites de rate limiting
  RATE_LIMIT: {
    MAX_ATTEMPTS: 3,
    TIME_WINDOW: 5 * 60 * 1000, // 5 minutos
  },

  // Límites de campos
  FIELD_LIMITS: {
    NAME: { min: 2, max: 50 },
    EMAIL: { min: 5, max: 100 },
    SUBJECT: { min: 5, max: 100 },
    MESSAGE: { min: 10, max: 1000 },
  },

  // Patrones de validación
  PATTERNS: {
    EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    NAME: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/,
    NO_HTML: /[<>]/g,
    NO_JAVASCRIPT: /javascript:/gi,
    NO_EVENTS: /on\w+=/gi,
  },

  // Dominios de email desechables a bloquear
  DISPOSABLE_DOMAINS: [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email',
    'yopmail.com',
    'maildrop.cc',
    'sharklasers.com',
    'getnada.com',
    'tempail.com',
    // Agregar más según sea necesario
  ],

  // Patrones de spam
  SPAM_PATTERNS: [
    /\b(buy now|click here|limited time|act now)\b/gi,
    /\b(viagra|casino|lottery|winner|congratulations)\b/gi,
    /(http[s]?:\/\/[^\s]+){3,}/gi, // Múltiples URLs
    /[A-Z]{10,}/g, // Texto en mayúsculas excesivo
    /(.)\1{4,}/g, // Caracteres repetidos excesivamente
  ],

  // Mensajes de error
  ERROR_MESSAGES: {
    REQUIRED: 'Este campo es requerido',
    INVALID_EMAIL: 'Por favor ingresa un email válido',
    DISPOSABLE_EMAIL: 'No se permiten emails temporales o desechables',
    MIN_LENGTH: (field: string, min: number) => `${field} debe tener al menos ${min} caracteres`,
    MAX_LENGTH: (field: string, max: number) => `${field} no puede exceder ${max} caracteres`,
    INVALID_CHARACTERS: (field: string) => `${field} contiene caracteres no válidos`,
    SPAM_DETECTED: 'El contenido parece ser spam',
    RATE_LIMITED: 'Demasiados intentos. Espera un momento antes de intentar nuevamente.',
    SERVER_ERROR: 'Error del servidor. Por favor, inténtalo más tarde.',
  },
} as const;
