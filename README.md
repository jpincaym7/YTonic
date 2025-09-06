# YouTube to MP3/MP4 Downloader

Una aplicación web moderna construida con Next.js 15 y TypeScript que permite descargar videos de YouTube en formato MP3 (solo audio) o MP4 (video completo).

## Características

### 🎵 Descarga de Audio (MP3)
- Extrae solo el audio del video
- Calidad de audio optimizada (highestaudio)
- Formato MP3 compatible con todos los reproductores

### 🎬 Descarga de Video (MP4)
- Video completo con audio
- Calidad automática optimizada
- Formato MP4 estándar

### 📱 Interfaz Moderna
- Diseño responsivo con Tailwind CSS
- Vista previa del video con thumbnail
- Información detallada (título, autor, duración, vistas)
- Indicador de progreso de descarga

### ⚡ Tecnologías Utilizadas
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **ytdl-core** - Biblioteca para descargar videos de YouTube
- **Streaming API** - Descarga eficiente sin bloqueos

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd api-youtube-mp3
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso

1. **Ingresa la URL**: Pega la URL de un video de YouTube en el campo de entrada
2. **Obtén información**: Haz clic en "Obtener Info" para ver los detalles del video
3. **Elige formato**: Selecciona MP3 (audio) o MP4 (video)
4. **Descarga**: Haz clic en el botón correspondiente para iniciar la descarga

## API Endpoints

### GET /api/youtube/info
Obtiene información detallada de un video de YouTube.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Título del video",
  "author": "Nombre del canal",
  "duration": "3:45",
  "views": 1000000,
  "thumbnail": "https://...",
  "description": "Descripción del video"
}
```

### POST /api/youtube/download
Descarga un video de YouTube en el formato especificado.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format": "mp3",
  "options": {
    "quality": "highestaudio",
    "filter": "audioonly"
  }
}
```

**Response:** Stream de archivo binario

## Opciones Avanzadas de ytdl

La aplicación soporta las siguientes opciones avanzadas de `ytdl-core`:

### Opciones de Calidad
- `quality`: 'highest', 'lowest', 'highestaudio', 'lowestaudio'
- `filter`: 'audioonly', 'videoonly', 'audioandvideo'

### Opciones de Rango
```javascript
{
  range: { start: 10355705, end: 12452856 } // Descarga parcial
}
```

### Opciones de Tiempo
```javascript
{
  begin: '1:30', // Formato: mm:ss, hh:mm:ss, milisegundos
  liveBuffer: 20000, // Buffer para videos en vivo (ms)
}
```

### Opciones de Red
```javascript
{
  highWaterMark: 512 * 1024, // Buffer de memoria (512 KB por defecto)
  dlChunkSize: 10 * 1024 * 1024, // Tamaño de fragmentos (10 MB por defecto)
  IPv6Block: undefined // Bloque IPv6 para rotación
}
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── youtube/
│   │       ├── info/
│   │       │   └── route.ts      # API para obtener info del video
│   │       └── download/
│   │           └── route.ts      # API para descargar videos
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal
```

## Limitaciones

- Los videos muy largos pueden tomar tiempo considerable en descargarse
- Algunos videos pueden tener restricciones de descarga por parte de YouTube
- La calidad disponible depende de lo que YouTube proporcione
- Los videos en vivo tienen limitaciones especiales

## Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Advertencia Legal

Esta herramienta es solo para uso educativo y personal. Asegúrate de cumplir con los términos de servicio de YouTube y las leyes de derechos de autor de tu país antes de descargar contenido.
