import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { DollarSign, Users, ShoppingBag, HandHeart } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Metric {
  value: number;
  change: number;
}

const MetricsGrid: React.FC = () => {
  const [totalDonations, setTotalDonations] = useState<Metric>({ value: 0, change: 0 });
  const [totalSales, setTotalSales] = useState<Metric>({ value: 0, change: 0 });
  const [activeFarmers, setActiveFarmers] = useState<Metric>({ value: 0, change: 0 });
  const [impactedFamilies, setImpactedFamilies] = useState<Metric>({ value: 0, change: 0 });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    const unsubscribeTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      let donationTotal = 0;
      let salesTotal = 0;
      const familySet = new Set<string>();
  
      snapshot.forEach(doc => {
        const data = doc.data();
  
        if (data.transactionType === 'donation') {
          donationTotal += Number(data.totalAmount || 0);
          if (data.familyId) {
            familySet.add(data.familyId);
          }
        }
  
        if (data.transactionType === 'sale' && Array.isArray(data.items)) {
          for (const item of data.items) {
            const price = typeof item?.price === 'number' ? item.price : Number(item?.price || 0);
            salesTotal += price;
          }
        }
      });
  
      setTotalDonations({ value: donationTotal, change: 0 });
      setTotalSales({ value: salesTotal, change: 0 });
      setImpactedFamilies({ value: familySet.size, change: 0 });
    });
  
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const farmers = snapshot.docs.filter(doc => doc.data().userType === 'Farmer');
      setActiveFarmers({ value: farmers.length, change: 0 });
    });
  
    return () => {
      unsubscribeTransactions();
      unsubscribeUsers();
    };
  }, []);
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Donations"
        value={totalDonations.value}
        change={totalDonations.change}
        icon={HandHeart}
        formatter={formatCurrency}
      />

      <MetricCard
        title="Total Sales"
        value={totalSales.value}
        change={totalSales.change}
        icon={DollarSign}
        formatter={formatCurrency}
      />

      <MetricCard
        title="Active Farmers"
        value={activeFarmers.value}
        change={activeFarmers.change}
        icon={Users}
      />

      <MetricCard
        title="Impacted Families"
        value={impactedFamilies.value}
        change={impactedFamilies.change}
        icon={ShoppingBag}
      />
    </div>
  );
};

export default MetricsGrid;
