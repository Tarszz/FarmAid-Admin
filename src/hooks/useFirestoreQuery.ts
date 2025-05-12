
import { useEffect, useState, useRef, useCallback } from "react";
import { collection, onSnapshot, query, limit, getDocs, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useFirestoreQuery = (collectionName: string, constraints: QueryConstraint[] = []) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const initialLoadDoneRef = useRef(false);

  // Create a stable cache key for this query
  const cacheKey = `firestore-cache:${collectionName}:${JSON.stringify(constraints)}`;
  
  // Check for cached data on mount
  const loadCachedData = useCallback(() => {
    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (parsedData && Array.isArray(parsedData.items)) {
          setData(parsedData.items);
          // Still show as loading until we get fresh data
          setLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.warn("Error loading cached data:", error);
    }
    return false;
  }, [cacheKey]);

  // Cache current data
  const cacheData = useCallback((items: any[]) => {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ 
        items, 
        timestamp: Date.now() 
      }));
    } catch (error) {
      console.warn("Error caching data:", error);
    }
  }, [cacheKey]);

  useEffect(() => {
    // Clean up previous listener if collection name changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [collectionName]);

  useEffect(() => {
    // Skip if we've already initialized this query
    if (initialLoadDoneRef.current) return;

    // Try to load from cache first
    const hasCachedData = loadCachedData();
    
    const fetchData = async () => {
      try {
        // Build the query with any constraints
        const baseQuery = query(
          collection(db, collectionName),
          ...(constraints.length > 0 ? constraints : [limit(20)])
        );
        
        // If we don't have cached data, show loading
        if (!hasCachedData) {
          setLoading(true);
        }
        
        // Get initial data quickly
        const snapshot = await getDocs(baseQuery);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setData(items);
        setLoading(false);
        cacheData(items);
        
        // Set up real-time listener for future updates
        const unsubscribe = onSnapshot(
          collection(db, collectionName),
          (snapshot) => {
            const updatedItems = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            
            setData(updatedItems);
            setLoading(false);
            cacheData(updatedItems);
          },
          (error) => {
            console.error(`Error in real-time listener for ${collectionName}:`, error);
            setLoading(false);
          }
        );
        
        unsubscribeRef.current = unsubscribe;
        initialLoadDoneRef.current = true;
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [collectionName, constraints, cacheData, loadCachedData]);

  return { data, loading };
};
