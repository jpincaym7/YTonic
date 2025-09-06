# 🎵 YTonic

**Convertidor moderno de YouTube a MP3/MP4**

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Características

- 🎵 **Conversión MP3/MP4** - Audio y video de alta calidad
- ⚡ **Descarga rápida** - Procesamiento optimizado
- 📱 **Diseño responsivo** - Compatible con todos los dispositivos  
- 🔒 **Privacidad total** - Sin registro ni almacenamiento de datos
- 🎨 **Interfaz moderna** - Animaciones fluidas con GSAP y Framer Motion
- 🛡️ **Validación CAPTCHA** - Protección contra bots

## 🚀 Inicio rápido

```bash
# Clonar repositorio
git clone <repo-url>
cd api-youtube-mp3

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🛠️ Stack tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS 4
- **Animaciones**: GSAP + Framer Motion
- **Backend**: ytdl-core para procesamiento de videos
- **UI**: Componentes personalizados minimalistas

## 📋 Funcionalidades

### URLs soportadas
- `youtube.com/watch?v=videoId`
- `youtube.com/shorts/videoId`  
- `youtu.be/videoId`

### Formatos de descarga
- **MP3**: Audio de alta calidad (hasta 320 kbps)
- **MP4**: Video completo con audio incluido

### Opciones avanzadas
- Configuración de calidad
- Ajustes de buffer y chunk size
- Filtros de descarga personalizados

## 🎯 Uso

1. **Pegar URL** - Ingresa el enlace del video de YouTube
2. **Obtener información** - Visualiza metadatos del video
3. **Seleccionar formato** - Elige entre MP3 o MP4
4. **Descargar** - Completa el CAPTCHA y descarga

## ⚠️ Limitaciones

- Videos de máximo 90 minutos
- No admite streams en vivo
- No funciona con videos privados o restringidos por edad

## 📄 Páginas

- **Inicio** - Convertidor principal
- **FAQ** - Preguntas frecuentes  
- **Contacto** - Formulario de soporte
- **Copyright** - Políticas y derechos de autor

## 🔧 API Endpoints

- `POST /api/youtube/info` - Obtener metadatos del video
- `POST /api/youtube/download` - Descargar archivo convertido
- `POST /api/contact` - Enviar mensaje de contacto

## 👨‍💻 Desarrollo

```bash
# Modo desarrollo con Turbopack
npm run dev

# Linting
npm run lint

# Build optimizado
npm run build
```

## 📝 Licencia

© Todos los derechos reservados a: **Jordy David Pincay Murillo**

---

<div align="center">
  <strong>YTonic</strong> - Convierte videos de YouTube de forma rápida y segura
</div>
