import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesChart from './SalesChart';
import DonationsChart from './DonationsChart';
import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { sampleSalesData, sampleDonationsData, sampleCropData } from '@/data/analyticsData';

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyC2_a91SdWfX5eVihs2wKb5MjZVVq58seg",
  authDomain: "farmaid-21053.firebaseapp.com",
  databaseURL: "https://farmaid-21053-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "farmaid-21053",
  storageBucket: "farmaid-21053.firebasestorage.app",
  messagingSenderId: "822952482588",
  appId: "1:822952482588:web:74a55c97e58c797e5dccd9",
  measurementId: "G-EQ0D2XM5MX"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

interface SalesAndDonationsChartsProps {
  className?: string;
}

const SalesAndDonationsCharts: React.FC<SalesAndDonationsChartsProps> = ({ className = '' }) => {
  const [salesData, setSalesData] = useState(sampleSalesData);
  const [donationsData, setDonationsData] = useState(sampleDonationsData);
  const [cropData, setCropData] = useState(sampleCropData);

  // --- Helper to Merge Sample + Firestore Data ---
  const mergeData = (sample: any[], fetched: any[]) => {
    const combined = [...sample];
    fetched.forEach(fetchedItem => {
      const existing = combined.find(item => item.month === fetchedItem.month);
      if (existing) {
        existing.value += fetchedItem.value;
        if ('families' in existing && 'families' in fetchedItem) {
          existing.families += fetchedItem.families || 0;
        }
      } else {
        combined.push(fetchedItem);
      }
    });
    return combined.sort(
      (a, b) =>
        new Date(`01 ${a.month} 2025`).getTime() - new Date(`01 ${b.month} 2025`).getTime()
    );
  };

  // --- Fetch Real-time Purchases ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'payments'), snapshot => {
      const monthMap: Record<string, number> = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        const timestamp = data.timestamp;
        const date = timestamp?.toDate ? timestamp.toDate() : new Date();
        const month = date.toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + amount;
      });

      const formatted = Object.entries(monthMap).map(([month, value]) => ({ month, value }));
      setSalesData(prev => mergeData(sampleSalesData, formatted));
    });

    return () => unsub();
  }, []);

  // --- Fetch Real-time Donations ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'donation_payments'), snapshot => {
      const monthMap: Record<string, number> = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        const timestamp = data.timestamp;
        const date = timestamp?.toDate ? timestamp.toDate() : new Date();
        const month = date.toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + amount;
      });

      const formatted = Object.entries(monthMap).map(([month, value]) => ({
        month,
        value,
        families: Math.floor(value / 10) // estimate families served if not recorded
      }));

      setDonationsData(prev => mergeData(sampleDonationsData, formatted));
    });

    return () => unsub();
  }, []);

  // --- Fetch Crop Data ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), snapshot => {
      const cropMap: Record<string, number> = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const category = data.category || 'Unknown';
        const quantity = data.quantity || 0;
        const unit = data.quantityUnit || '';
        cropMap[`${category} (${unit})`] = (cropMap[`${category} (${unit})`] || 0) + quantity;
      });

      const formatted = Object.entries(cropMap).map(([name, value]) => ({ name, value }));
      if (formatted.length > 0) setCropData(prev => [...prev, ...formatted]);
    });

    return () => unsub();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Purchases & Donations Trends</CardTitle>
        <CardDescription>Monthly overview of purchases and donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Purchases</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <SalesChart data={salesData} />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsChart data={donationsData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesAndDonationsCharts;
