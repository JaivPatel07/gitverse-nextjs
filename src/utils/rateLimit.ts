// This Map stores the IP address as the key, and the attempt count + expiration time as the value.
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10);
  const now = Date.now();

  const record = rateLimitMap.get(ip);

  // If no record exists, or the previous penalty window has expired, reset them.
  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  // If they hit the limit, calculate how many seconds they need to wait (retry hint)
  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.expiresAt - now) / 1000);
    return { success: false, retryAfter: retryAfterSeconds };
  }

  // Otherwise, increment their attempt count
  record.count += 1;
  rateLimitMap.set(ip, record);
  return { success: true };
}