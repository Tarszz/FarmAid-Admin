
import { useState, useEffect, useRef } from 'react';
import { 
  sampleSalesData, 
  sampleDonationsData, 
  sampleCropData, 
  sampleMetricsData,
  type MetricsData 
} from '@/data/analyticsData';
import { loadFromCache, saveToCache } from '@/utils/cacheUtils';
import { fetchAnalyticsData, AnalyticsData } from '@/services/analyticsService';

// Re-export with 'export type' to comply with 'isolatedModules'
export type { MetricsData };

export const useAnalyticsData = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsData>(sampleMetricsData);
  const [salesData, setSalesData] = useState<any[]>(sampleSalesData);
  const [donationsData, setDonationsData] = useState<any[]>(sampleDonationsData);
  const [cropData, setCropData] = useState<any[]>(sampleCropData);
  const initialized = useRef(false);
  
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const loadData = async () => {
      // First try to get cached data
      const cacheKey = 'analytics-cache';
      const cachedData = loadFromCache<AnalyticsData>(cacheKey);
      
      if (cachedData) {
        // Use cached data if available
        if (cachedData.metrics) setMetrics(cachedData.metrics);
        if (cachedData.salesData) setSalesData(cachedData.salesData);
        if (cachedData.donationsData) setDonationsData(cachedData.donationsData);
        if (cachedData.cropData) setCropData(cachedData.cropData);
        setLoading(false);
        return;
      }
      
      // If no cached data, fetch from Firebase
      try {
        const data = await fetchAnalyticsData();
        
        // Update state with fetched data
        setMetrics(data.metrics);
        setSalesData(data.salesData);
        setDonationsData(data.donationsData);
        setCropData(data.cropData);
        
        // Cache the fetched data
        saveToCache(cacheKey, data);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []); // Empty dependency array means this runs once on mount

  return {
    loading,
    metrics,
    salesData,
    donationsData,
    cropData
  };
};
