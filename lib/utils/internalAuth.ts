/**
 * Shared internal authorization utilities.
 *
 * Centralizes the secret-based authentication used by:
 * - Webhook worker (`app/api/internal/worker/webhook/route.ts`)
 * - Webhook queue (`lib/services/webhook-queue.ts`)
 * - Cron endpoints (`app/api/cron/webhook-recovery/route.ts`)
 *
 * This ensures all internal services use the same secret derivation
 * and prevents mismatches between callers and receivers.
 */

import crypto from "crypto";

/**
 * Derives a Bearer token from a secret using SHA-256.
 * Both the worker and queue must use this same derivation.
 */
export function deriveBearerToken(secret: string): string {
  const hash = crypto.createHash("sha256").update(secret).digest("hex");
  return `Bearer ${hash}`;
}

/**
 * Validates an Authorization header against a secret.
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @param authHeader - The Authorization header value from the request.
 * @param secret - The secret to validate against.
 * @returns `true` if the Authorization header matches the expected token.
 */
export function validateAuthorizationHeader(
  authHeader: string | null,
  secret: string
): boolean {
  if (!secret) return false;

  const expectedToken = deriveBearerToken(secret);

  try {
    const a = Buffer.from(expectedToken);
    const b = Buffer.from(authHeader || "");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Validates the internal worker authorization.
 * Uses `INTERNAL_WORKER_SECRET` exclusively.
 */
export function isInternalWorkerAuthorized(
  authHeader: string | null
): boolean {
  const secret = process.env.INTERNAL_WORKER_SECRET;
  return validateAuthorizationHeader(authHeader, secret);
}

/**
 * Validates cron job authorization.
 * Uses `CRON_SECRET` with fallback to `ANALYSIS_RUNNER_SECRET`.
 */
export function isCronAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET || process.env.ANALYSIS_RUNNER_SECRET;
  return validateAuthorizationHeader(authHeader, secret);
}

/**
 * Validates the analysis runner authorization.
 * Uses `ANALYSIS_RUNNER_SECRET` with fallback to ephemeral secret.
 */
export function isAnalysisRunnerAuthorized(
  headerSecret: string | null,
  ephemeralSecret?: string
): boolean {
  const secret = process.env.ANALYSIS_RUNNER_SECRET || ephemeralSecret;
  if (!secret) return false;
  if (!headerSecret) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(headerSecret),
      Buffer.from(secret)
    );
  } catch {
    return false;
  }
}

/**
 * Checks that required internal secrets are configured.
 * Returns an array of missing secret names.
 */
export function validateRequiredSecrets(): string[] {
  const missing: string[] = [];

  if (!process.env.INTERNAL_WORKER_SECRET) {
    missing.push("INTERNAL_WORKER_SECRET");
  }

  return missing;
}

/**
 * Validates that secrets are not reused across different purposes.
 * Returns warnings about potential security issues.
 */
export function validateSecretIsolation(): string[] {
  const warnings: string[] = [];

  const workerSecret = process.env.INTERNAL_WORKER_SECRET;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  if (workerSecret && webhookSecret && workerSecret === webhookSecret) {
    warnings.push(
      "INTERNAL_WORKER_SECRET should differ from GITHUB_WEBHOOK_SECRET"
    );
  }

  if (workerSecret && jwtSecret && workerSecret === jwtSecret) {
    warnings.push(
      "INTERNAL_WORKER_SECRET should differ from JWT_SECRET"
    );
  }

  if (cronSecret && workerSecret && cronSecret === workerSecret) {
    warnings.push(
      "CRON_SECRET should differ from INTERNAL_WORKER_SECRET"
    );
  }

  return warnings;
}
