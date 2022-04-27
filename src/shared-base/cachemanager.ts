//import { checkEmpty } from "src/baseplate/utils";
import { Logger } from './logger';

export class CacheManager {
  private static SEP = '$%$';
  private static CACHE_MAP = new Map();
  private static LOG = new Logger('CacheManager');

  // This is a static class so there's no need to create an instance
  private constructor() {}

  public static get(type: string, key: any): any {
    try {
      let value = CacheManager.CACHE_MAP.get(CacheManager.buildKey(type, key));
      CacheManager.LOG.debug(
        'Retrieved cached value for {}.{}: {}',
        type,
        key,
        value ?? 'Not found'
      );
      return value;
    } catch (e) {
      CacheManager.LOG.error('get: {}', (e as Error).message);
    }
    return null;
  }

  public static set(type: string, key: any, value: any): void {
    try {
      let cacheKey = CacheManager.buildKey(type, key);
      if (!value) {
        CacheManager.CACHE_MAP.delete(cacheKey);
        CacheManager.LOG.debug('Cleared cache entry {}.{}.', type, key);
      } else {
        CacheManager.CACHE_MAP.set(cacheKey, value);
        CacheManager.LOG.debug('Added cache entry {}.{}: {}', type, key, value);
      }
    } catch (e) {
      CacheManager.LOG.error('set: {}', (e as Error).message);
    }
  }

  public static clear(): void {
    CacheManager.CACHE_MAP.clear();
    CacheManager.LOG.debug('Cache cleared.');
  }

  public static clearType(type: string): void {
    try {
      //checkEmpty(type, "Cache type cannot be empty.");
      CacheManager.CACHE_MAP.forEach((value: boolean, key: string) => {
        if (key.startsWith(type + CacheManager.SEP)) {
          CacheManager.CACHE_MAP.delete(key);
        }
      });
      CacheManager.LOG.debug('Cache type {} cleared.', type);
    } catch (e) {
      CacheManager.LOG.error('clearType: {}', (e as Error).message);
    }
  }

  private static buildKey(type: string, key: any): string {
    //checkEmpty(type, "Cache type cannot be empty.");
    //checkEmpty(key, "Cache key cannot be empty.");
    let strKey = key;
    if (typeof key != 'string') {
      if (typeof key['toString'] === 'function') {
        strKey = key.toString();
      } else {
        strKey = JSON.stringify(key);
        CacheManager.LOG.warn(
          "Consider using a string, or a type with a 'toString()' method, as cache key."
        );
      }
    }
    return type + CacheManager.SEP + strKey;
  }
}
