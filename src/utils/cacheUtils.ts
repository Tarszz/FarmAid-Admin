
// Utility functions for data caching

/**
 * Load data from localStorage cache if it exists and is valid
 * @param cacheKey The key to retrieve from localStorage
 * @param cacheDuration Duration in minutes for which the cache is considered valid
 * @returns The cached data if valid, or null if not found or expired
 */
export const loadFromCache = <T>(cacheKey: string, cacheDuration: number = 30): T | null => {
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cacheTime = parsedData.timestamp;
      // Cache is valid for specified duration in minutes
      if (cacheTime && Date.now() - cacheTime < cacheDuration * 60 * 1000) {
        return parsedData;
      }
    }
  } catch (error) {
    console.warn(`Failed to load cached data for ${cacheKey}`, error);
  }
  return null;
};

/**
 * Save data to localStorage cache with current timestamp
 * @param cacheKey The key to use in localStorage
 * @param data The data to cache
 */
export const saveToCache = (cacheKey: string, data: any): void => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn(`Failed to cache data for ${cacheKey}`, error);
  }
};
