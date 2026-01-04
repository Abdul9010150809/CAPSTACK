import { createClient, RedisClientType } from 'redis';
import { config } from './env';

// Basic in-memory cache implementation as fallback
interface CacheEntry {
  value: any;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry>();

// Redis client setup
let redisClient: RedisClientType | null = null;
let redisAvailable = false;

const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: config.redisUrl,
    });

    redisClient.on('error', (err: Error) => {
      console.warn('Redis connection error:', err.message);
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      redisAvailable = true;
    });

    redisClient.on('ready', () => {
      redisAvailable = true;
    });

    redisClient.on('end', () => {
      redisAvailable = false;
    });

    await redisClient.connect();
  } catch (error) {
    console.warn('Failed to initialize Redis, falling back to in-memory cache:', error);
    redisAvailable = false;
  }
};

// Initialize Redis on module load
initializeRedis();

export const cache = {
  set: async (key: string, value: any, ttlSeconds: number = 300) => {
    try {
      if (redisAvailable && redisClient) {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      } else {
        // Fallback to in-memory
        const expiresAt = Date.now() + ttlSeconds * 1000;
        cacheStore.set(key, { value, expiresAt });
      }
    } catch (error) {
      console.warn('Cache set error, using fallback:', error);
      // Fallback to in-memory even if Redis was thought available
      const expiresAt = Date.now() + ttlSeconds * 1000;
      cacheStore.set(key, { value, expiresAt });
    }
  },
  get: async (key: string) => {
    try {
      if (redisAvailable && redisClient) {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Fallback to in-memory
        const entry = cacheStore.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
          cacheStore.delete(key);
          return null;
        }
        return entry.value;
      }
    } catch (error) {
      console.warn('Cache get error, using fallback:', error);
      // Fallback to in-memory
      const entry = cacheStore.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        cacheStore.delete(key);
        return null;
      }
      return entry.value;
    }
  },
  delete: async (key: string) => {
    try {
      if (redisAvailable && redisClient) {
        await redisClient.del(key);
      }
      // Always clear in-memory as well for consistency
      cacheStore.delete(key);
    } catch (error) {
      console.warn('Cache delete error:', error);
      // Still try to clear in-memory
      cacheStore.delete(key);
    }
  },
  clear: async () => {
    try {
      if (redisAvailable && redisClient) {
        await redisClient.flushAll();
      }
      // Always clear in-memory
      cacheStore.clear();
    } catch (error) {
      console.warn('Cache clear error:', error);
      // Still try to clear in-memory
      cacheStore.clear();
    }
  },
};