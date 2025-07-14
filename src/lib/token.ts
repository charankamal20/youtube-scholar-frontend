import { V2 } from "paseto";
import { Buffer } from "buffer";

interface KeyCache {
  key: Buffer | null;
  fetchPromise: Promise<Buffer> | null;
  lastFetched: number;
  error: Error | null;
}

const keyCache: KeyCache = {
  key: null,
  fetchPromise: null,
  lastFetched: 0,
  error: null,
};

const KEY_CACHE_TTL = 60 * 60 * 1000 * 24;

async function fetchPublicKeyFromBackend(): Promise<Buffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/public-key`,
      {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch public key: ${res.status} ${res.statusText}`
      );
    }

    const keyRaw = await res.arrayBuffer();
    return Buffer.from(keyRaw);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error == "AbortError") {
      throw new Error("Public key fetch timeout");
    }
    throw error;
  }
}

async function getPublicKey(): Promise<Buffer> {
  const now = Date.now();

  if (keyCache.key && now - keyCache.lastFetched < KEY_CACHE_TTL) {
    return keyCache.key;
  }

  if (keyCache.fetchPromise) {
    try {
      return await keyCache.fetchPromise;
    } catch (error) {
      // If the ongoing fetch fails, we'll try again below
      keyCache.fetchPromise = null;
    }
  }

  // Start a new fetch
  keyCache.fetchPromise = (async () => {
    try {
      console.log("Fetching public key from backend...");
      const key = await fetchPublicKeyFromBackend();

      // Update cache
      keyCache.key = key;
      keyCache.lastFetched = now;
      keyCache.error = null;
      keyCache.fetchPromise = null;

      console.log("Public key fetched and cached successfully");
      return key;
    } catch (error) {
      keyCache.error = error as Error;
      keyCache.fetchPromise = null;

      // If we have a stale key, use it as fallback
      if (keyCache.key) {
        console.warn("Using stale public key due to fetch error:", error);
        return keyCache.key;
      }

      throw error;
    }
  })();

  return keyCache.fetchPromise;
}

export async function verifyPaseto(token: string) {
  try {
    const publicKey = await getPublicKey();
    const payload = await V2.verify(token, publicKey);

    if (typeof payload === "object" && payload !== null) {
      if ("exp" in payload && typeof payload.exp === "number") {
        if (Date.now() > payload.exp * 1000) {
          throw new Error("Token expired");
        }
      }

      if ("iat" in payload && typeof payload.iat === "number") {
        if (payload.iat > Date.now() / 1000 + 60) {
          throw new Error("Token used before issued");
        }
      }
    }

    return payload;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("PASETO verification failed:", error);
    }

    throw error;
  }
}

// Optional: Export function to manually refresh the key
export async function refreshPublicKey(): Promise<void> {
  keyCache.key = null;
  keyCache.lastFetched = 0;
  keyCache.error = null;
  await getPublicKey();
}

// Optional: Export function to get cache status
export function getKeyStatus() {
  return {
    hasKey: !!keyCache.key,
    lastFetched: keyCache.lastFetched,
    age: keyCache.lastFetched ? Date.now() - keyCache.lastFetched : 0,
    error: keyCache.error?.message,
  };
}
