
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  sampleSalesData, 
  sampleDonationsData, 
  sampleCropData, 
  sampleMetricsData,
  type MetricsData
} from '@/data/analyticsData';
import { toast } from "sonner";

// Type definitions for returned data
export interface AnalyticsData {
  metrics: MetricsData;
  salesData: any[];
  donationsData: any[];
  cropData: any[];
}

/**
 * Fetch analytics data from Firestore
 * @returns Promise with analytics data
 */
export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Metrics collection
    const metricsQuery = query(collection(db, 'metrics'), limit(1));
    const metricsSnapshot = await getDocs(metricsQuery);
    
    // Sales collection (last 6 months)
    const salesQuery = query(collection(db, 'sales'), orderBy('date', 'desc'), limit(6));
    const salesSnapshot = await getDocs(salesQuery);
    
    // Donations collection (last 6 months)
    const donationsQuery = query(collection(db, 'donations'), orderBy('date', 'desc'), limit(6));
    const donationsSnapshot = await getDocs(donationsQuery);
    
    // Crops collection
    const cropsQuery = query(collection(db, 'crops'), limit(10));
    const cropsSnapshot = await getDocs(cropsQuery);
    
    // Process metrics data
    let metricsData = { ...sampleMetricsData };
    if (!metricsSnapshot.empty) {
      const metricsDocData = metricsSnapshot.docs[0].data();
      metricsData = {
        totalDonations: metricsDocData.totalDonations || sampleMetricsData.totalDonations,
        totalSales: metricsDocData.totalSales || sampleMetricsData.totalSales,
        activeFarmers: metricsDocData.activeFarmers || sampleMetricsData.activeFarmers,
        impactedFamilies: metricsDocData.impactedFamilies || sampleMetricsData.impactedFamilies
      };
    }
    
    // Process sales data
    let salesDataArray = [...sampleSalesData];
    if (!salesSnapshot.empty) {
      salesDataArray = salesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          month: new Date(data.date.toDate()).toLocaleString('default', { month: 'short' }),
          value: data.amount || 0
        };
      });
    }
    
    // Process donations data
    let donationsDataArray = [...sampleDonationsData];
    if (!donationsSnapshot.empty) {
      donationsDataArray = donationsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          month: new Date(data.date.toDate()).toLocaleString('default', { month: 'short' }),
          value: data.amount || 0,
          families: data.familiesHelped || 0
        };
      });
    }
    
    // Process crops data
    let cropsDataArray = [...sampleCropData];
    if (!cropsSnapshot.empty) {
      // Collect all crop entries
      const allCrops = cropsSnapshot.docs.map(doc => doc.data());
      
      // Categorize crops
      const categories = {
        'Root crops': 0,
        'Vegetables': 0,
        'Spices': 0,
        'Fruits': 0
      };
      
      allCrops.forEach(crop => {
        const category = crop.category || 'Other';
        const weight = crop.weight || 0;
        
        if (category.toLowerCase().includes('root') || ["potato", "carrot", "radish", "turnip", "cassava", "yam"].includes(category.toLowerCase())) {
          categories['Root crops'] += weight;
        } else if (category.toLowerCase().includes('vegetable') || ["cabbage", "lettuce", "broccoli", "spinach", "tomato"].includes(category.toLowerCase())) {
          categories['Vegetables'] += weight;
        } else if (category.toLowerCase().includes('spice') || ["pepper", "chili", "oregano", "basil", "ginger"].includes(category.toLowerCase())) {
          categories['Spices'] += weight;
        } else if (category.toLowerCase().includes('fruit') || ["apple", "orange", "banana", "mango", "grape"].includes(category.toLowerCase())) {
          categories['Fruits'] += weight;
        }
      });
      
      // Convert to array format for the chart
      cropsDataArray = Object.entries(categories).map(([name, value]) => ({
        name,
        value: value > 0 ? value : (name === 'Root crops' ? 35 : name === 'Vegetables' ? 25 : name === 'Spices' ? 20 : 15)
      }));
    }

    return {
      metrics: metricsData,
      salesData: salesDataArray,
      donationsData: donationsDataArray,
      cropData: cropsDataArray
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    toast.error("Failed to load some analytics data", {
      description: "Using sample data instead. Please try again later."
    });
    
    // Return sample data on error
    return {
      metrics: sampleMetricsData,
      salesData: sampleSalesData,
      donationsData: sampleDonationsData,
      cropData: sampleCropData
    };
  }
};
