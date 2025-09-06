# Guía de Despliegue en Vercel

## Configuraciones Realizadas para Producción

### 1. Configuración de `vercel.json`
- **maxDuration**: 300 segundos (5 minutos) para `/download` y 60 segundos para `/info`
- **Headers CORS** configurados para APIs
- **NODE_OPTIONS** optimizado para mayor memoria

### 2. Configuración de `next.config.ts`
- **serverExternalPackages**: Paquetes externos para el servidor
- **Headers de seguridad** para APIs
- **Webpack optimizado** para dependencias externas

### 3. APIs Optimizadas
- **Runtime nodejs** configurado
- **User-Agent** personalizado para mejor compatibilidad con YouTube
- **Headers de cache** optimizados
- **Manejo de errores** mejorado

## Pasos para Desplegar en Vercel

### 1. Preparar el Proyecto
```bash
# Instalar dependencias
npm install

# Verificar que el build funciona
npm run build
```

### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Importa el proyecto `YTonic`

### 3. Configurar Variables de Entorno (Opcional)
En el dashboard de Vercel, añade estas variables si es necesario:
```
NODE_ENV=production
VERCEL_ENV=production
```

### 4. Configuración de Dominio
- Configura tu dominio personalizado en Vercel
- Vercel automáticamente manejará HTTPS

## Consideraciones Importantes

### Limitaciones de Vercel
- **Tiempo máximo de ejecución**: 300 segundos (plan Pro)
- **Tamaño de respuesta**: Sin límite específico, pero considera la memoria
- **Memoria**: 1GB (plan Pro) / 3GB (plan Enterprise)

### Optimizaciones Implementadas
1. **Headers optimizados** para descarga de archivos
2. **Stream processing** para manejar archivos grandes
3. **User-Agent personalizado** para mejor compatibilidad
4. **Timeouts configurados** según el tipo de operación

### Monitoreo
- Usa los logs de Vercel para monitorear errores
- Configura alertas para funciones que fallen

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción local
npm run start

# Linting
npm run lint
```

## Troubleshooting

### Si las APIs fallan en producción:
1. Verifica los logs en el dashboard de Vercel
2. Asegúrate de que las URLs de YouTube son válidas
3. Revisa que los timeouts sean suficientes para videos largos

### Si hay problemas de CORS:
- Los headers están configurados en `next.config.ts` y `vercel.json`
- Verifica que el frontend use las URLs correctas de la API

### Si hay errores de memoria:
- Considera upgradar a Vercel Pro para más memoria
- Optimiza el procesamiento de streams para videos muy largos
