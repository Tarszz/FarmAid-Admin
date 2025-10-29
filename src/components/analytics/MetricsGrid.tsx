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
    // --- Total Purchases ---
    const unsubscribePayments = onSnapshot(collection(db, 'payments'), snapshot => {
      let total = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        total += Number(data.amount || 0);
      });
      setTotalSales({ value: total, change: 0 });
    });

    // --- Total Donations ---
    const unsubscribeDonations = onSnapshot(collection(db, 'donation_payments'), snapshot => {
      let total = 0;
      const familySet = new Set<string>();

      snapshot.forEach(doc => {
        const data = doc.data();
        total += Number(data.amount || 0);

        // Track families impacted if there's a familyId field
        if (data.familyId) familySet.add(data.familyId);
      });

      setTotalDonations({ value: total, change: 0 });
      setImpactedFamilies({ value: familySet.size, change: 0 });
    });

    // --- Active Farmers ---
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), snapshot => {
      const farmers = snapshot.docs.filter(doc => doc.data().userType === 'Farmer');
      setActiveFarmers({ value: farmers.length, change: 0 });
    });

    return () => {
      unsubscribePayments();
      unsubscribeDonations();
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
        title="Total Purchases"
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
