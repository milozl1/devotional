// ============================================
// IndexedDB Cache Layer
// Eliminates redundant Supabase queries for
// devotionals and progress data.
// ============================================

const DB_NAME = 'devotional_cache';
const DB_VERSION = 1;

interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

// Default TTL: 10 minutes for devotionals, 5 minutes for progress
const TTL = {
  devotionals: 10 * 60 * 1000,
  progress: 5 * 60 * 1000,
  single: 15 * 60 * 1000,
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('cache', 'readonly');
      const store = tx.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;
        if (!entry) {
          resolve(null);
          return;
        }

        // Check if entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
          // Expired — delete it asynchronously
          void deleteFromCache(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setInCache<T>(key: string, data: T, ttl: number): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cache', 'readwrite');
    const store = tx.objectStore('cache');

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
    };

    store.put(entry);

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve(); // Don't block on cache errors
    });
  } catch {
    // Silently fail — cache is an optimization, not critical
  }
}

async function deleteFromCache(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cache', 'readwrite');
    tx.objectStore('cache').delete(key);
  } catch {
    // Silently fail
  }
}

// Invalidate all cache entries matching a prefix
async function invalidateByPrefix(prefix: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cache', 'readwrite');
    const store = tx.objectStore('cache');
    const request = store.getAllKeys();

    request.onsuccess = () => {
      const keys = request.result as string[];
      for (const key of keys) {
        if (typeof key === 'string' && key.startsWith(prefix)) {
          store.delete(key);
        }
      }
    };
  } catch {
    // Silently fail
  }
}

// ─── Public API ────────────────────────────

/**
 * Cache-first fetch for published devotionals list.
 * Returns cached data if fresh, otherwise calls fetcher and caches result.
 */
export async function cachedDevotionals<T>(fetcher: () => Promise<T>): Promise<T> {
  const key = 'devotionals:published';
  const cached = await getFromCache<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await setInCache(key, data, TTL.devotionals);
  return data;
}

/**
 * Cache-first fetch for a single devotional by day number.
 */
export async function cachedDevotionalByDay<T>(dayNumber: number, fetcher: () => Promise<T>): Promise<T> {
  const key = `devotional:day:${dayNumber}`;
  const cached = await getFromCache<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await setInCache(key, data, TTL.single);
  return data;
}

/**
 * Cache-first fetch for user progress.
 */
export async function cachedProgress<T>(deviceId: string, fetcher: () => Promise<T>): Promise<T> {
  const key = `progress:${deviceId}`;
  const cached = await getFromCache<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  await setInCache(key, data, TTL.progress);
  return data;
}

/**
 * Invalidate progress cache after a step update.
 */
export async function invalidateProgress(deviceId: string): Promise<void> {
  await invalidateByPrefix(`progress:${deviceId}`);
}

/**
 * Invalidate all devotional caches (after admin changes).
 */
export async function invalidateDevotionals(): Promise<void> {
  await invalidateByPrefix('devotionals:');
  await invalidateByPrefix('devotional:');
}

/**
 * Clear entire cache.
 */
export async function clearAllCache(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('cache', 'readwrite');
    tx.objectStore('cache').clear();
  } catch {
    // Silently fail
  }
}
