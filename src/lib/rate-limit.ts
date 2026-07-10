/**
 * Contador global y persistente de descargas por servicio (YouTube / Spotify).
 *
 * Usa Upstash Redis (HTTP, compatible con serverless de Vercel). El contador es
 * atómico (INCR) y se reinicia solo cada 24 h mediante un TTL. Si no hay
 * credenciales de Upstash configuradas (dev local / build de CI), NO limita y
 * deja pasar para no romper el build ni el desarrollo local.
 */
import { Redis } from '@upstash/redis';
import { SECURITY_CONFIG } from './security-config';

export type DownloadService = 'youtube' | 'spotify';

export interface SlotResult {
  ok: boolean;
  remaining: number;
  limit: number;
}

const WINDOW_SECONDS = Math.floor(SECURITY_CONFIG.DOWNLOAD_LIMIT.TIME_WINDOW / 1000); // 24 h

// Soporta tanto los nombres nativos de Upstash como los que inyecta la
// integración de Vercel (prefijo KV_). Así funciona igual en local y producción.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

function keyFor(service: DownloadService): string {
  return `dl:count:${service}`;
}

/**
 * Reserva atómicamente un cupo de descarga para el servicio dado.
 * Devuelve { ok:false } si ya se alcanzó el tope de la ventana actual.
 */
export async function reserveDownloadSlot(service: DownloadService): Promise<SlotResult> {
  const limit = SECURITY_CONFIG.DOWNLOAD_LIMIT.MAX_REQUESTS;

  // Sin Redis configurado: no limitamos (dev local / CI).
  if (!redis) {
    return { ok: true, remaining: limit, limit };
  }

  const key = keyFor(service);
  const count = await redis.incr(key);

  // Primer request de la ventana: fijar el TTL de 24 h.
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  // Se pasó del tope: devolver el cupo y bloquear.
  if (count > limit) {
    await redis.decr(key);
    return { ok: false, remaining: 0, limit };
  }

  return { ok: true, remaining: limit - count, limit };
}

/**
 * Devuelve un cupo previamente reservado (p. ej. si la descarga externa falló),
 * para no gastar cuota en errores.
 */
export async function refundDownloadSlot(service: DownloadService): Promise<void> {
  if (!redis) return;
  await redis.decr(keyFor(service));
}
