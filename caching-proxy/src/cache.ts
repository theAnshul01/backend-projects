export interface CacheEntry {
    status : number;
    headers : Headers;
    body : Buffer;
    expiresAt : number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 60 * 1000; // 60 seconds

export function setCache(
    key: string,
    entry: Omit<CacheEntry, "expiresAt">,
    ttl: number = DEFAULT_TTL
) : void { 
    cache.set(
        key, {
            ...entry,
            expiresAt: Date.now() + ttl
        }
    );
}

export function getCache(key: string): CacheEntry | undefined { 
    const entry = cache.get(key);

    if(!entry) { 
        return undefined;
    }

    if(Date.now() > entry.expiresAt){
        cache.delete(key);
        return undefined;
    }

    return entry;
}

export function clearCache(): void { 
    cache.clear();
}

