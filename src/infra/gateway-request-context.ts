import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Per-request metadata for gateway → provider bridges (AsyncLocalStorage).
 * Populated by HTTP handlers around `agentCommandFromIngress` calls.
 */
export type GatewayRequestContextValue = {
  /** DeepSeek Web `/api/v0/chat/completion` JSON field `model_type`. */
  deepseekWebModelType?: string;
};

const storage = new AsyncLocalStorage<GatewayRequestContextValue>();

export function runWithGatewayRequestContext<T>(
  value: GatewayRequestContextValue,
  fn: () => T,
): T {
  return storage.run(value, fn);
}

export function getGatewayRequestContext(): GatewayRequestContextValue | undefined {
  return storage.getStore();
}

/** Allow safe pass-through tokens for DeepSeek `model_type` (alphanumeric, dot, underscore, hyphen). */
export function normalizeDeepseekWebModelTypeToken(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  const t = raw.trim();
  if (t.length === 0 || t.length > 64) {
    return undefined;
  }
  if (!/^[A-Za-z0-9._-]+$/.test(t)) {
    return undefined;
  }
  return t;
}
