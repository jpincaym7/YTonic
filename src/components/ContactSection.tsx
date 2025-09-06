'use client';

import { useState } from 'react';
import { validateFormField, sanitizeInput, RateLimiter } from '@/lib/validation';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Validar en tiempo real
    const error = validateFormField(name, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Verificar rate limiting
    if (!RateLimiter.canSubmit()) {
      const remainingTime = RateLimiter.getRemainingTime();
      setRateLimitMessage(`Demasiados intentos. Espera ${remainingTime} segundos antes de intentar nuevamente.`);
      setSubmitStatus('rate-limited');
      setIsSubmitting(false);
      return;
    }

    // Validar todos los campos antes del envío
    const newErrors = {
      name: validateFormField('name', formData.name),
      email: validateFormField('email', formData.email),
      subject: validateFormField('subject', formData.subject),
      message: validateFormField('message', formData.message)
    };

    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Registrar intento de envío
    RateLimiter.recordAttempt();

    // Enviar datos al servidor
    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        message: sanitizeInput(formData.message)
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setRateLimitMessage(result.error || 'Demasiados intentos. Espera un momento.');
          setSubmitStatus('rate-limited');
        } else if (response.status === 400 && result.details) {
          // Mostrar errores específicos del servidor
          setErrors(prev => ({ ...prev, ...result.details }));
          setSubmitStatus('error');
        } else {
          throw new Error(result.error || 'Error al enviar mensaje');
        }
        return;
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({ name: '', email: '', subject: '', message: '' });
      setRateLimitMessage('');
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-6">
          CONTACTO
        </h1>
        <p className="text-gray-300 text-lg font-light leading-relaxed max-w-3xl mx-auto">
          ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para ayudarte. 
          <span className="text-white font-semibold"> Envíanos un mensaje</span> y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Envíanos un mensaje
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.name ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200`}
                placeholder="Tu nombre completo"
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.email ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200`}
                placeholder="tu@email.com"
                maxLength={100}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.subject ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200`}
                placeholder="¿En qué podemos ayudarte?"
                maxLength={100}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.message ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none`}
                placeholder="Escribe tu mensaje aquí..."
                maxLength={1000}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-destructive">{errors.message}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {formData.message.length}/1000 caracteres
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Enviar mensaje
                </>
              )}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>¡Mensaje enviado exitosamente! Te responderemos pronto.</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Error al enviar el mensaje. Por favor, revisa los campos e inténtalo de nuevo.</span>
                </div>
              </div>
            )}

            {submitStatus === 'rate-limited' && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{rateLimitMessage}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Info Cards */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-display font-bold text-foreground mb-6">
              Información de contacto
            </h3>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground">pepsimanx12@gmail.com</p>
                  <p className="text-sm text-muted-foreground">Respuesta en 24 horas</p>
                </div>
              </div>

              {/* Support */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.003 6.003 0 004 10c0 .639.1 1.254.287 1.827l1.55-1.55zm3.472-2.757L10 6.73l1.37 1.63a3.997 3.997 0 00-1.524.41L8.63 8.36z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Soporte técnico</h4>
                  <p className="text-muted-foreground">Disponible 24/7</p>
                  <p className="text-sm text-muted-foreground">Para problemas técnicos</p>
                </div>
              </div>

              {/* Social */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Redes sociales</h4>
                  <p className="text-muted-foreground">Síguenos para novedades</p>
                  <p className="text-sm text-muted-foreground">@pepsimanx12</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              ¿Necesitas ayuda rápida?
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Antes de contactarnos, revisa nuestras preguntas frecuentes. Probablemente encuentres la respuesta que buscas.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all duration-200 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Ver preguntas frecuentes
            </a>
          </div>

          {/* Response Time */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              Tiempo de respuesta
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Consultas generales</span>
                <span className="text-foreground font-medium">24 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Soporte técnico</span>
                <span className="text-foreground font-medium">12 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reportar errores</span>
                <span className="text-foreground font-medium">6 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
