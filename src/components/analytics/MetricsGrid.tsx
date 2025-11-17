import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { DollarSign, Users, HandHeart, Home, Store, Building2 } from 'lucide-react';
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
  const [activeHouseholds, setActiveHouseholds] = useState<Metric>({ value: 0, change: 0 });
  const [activeMarkets, setActiveMarkets] = useState<Metric>({ value: 0, change: 0 });
  const [activeOrganizations, setActiveOrganizations] = useState<Metric>({ value: 0, change: 0 });

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
      snapshot.forEach(doc => {
        const data = doc.data();
        total += Number(data.amount || 0);
      });
      setTotalDonations({ value: total, change: 0 });
    });

    // --- Fetch Users by Type ---
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), snapshot => {
      let farmers = 0;
      let households = 0;
      let markets = 0;
      let organizations = 0;

      snapshot.forEach(doc => {
        const type = doc.data().userType;

        if (type === 'Farmer') farmers++;
        if (type === 'Household') households++;
        if (type === 'Market') markets++;
        if (type === 'Organization') organizations++;
      });

      setActiveFarmers({ value: farmers, change: 0 });
      setActiveHouseholds({ value: households, change: 0 });
      setActiveMarkets({ value: markets, change: 0 });
      setActiveOrganizations({ value: organizations, change: 0 });
    });

    return () => {
      unsubscribePayments();
      unsubscribeDonations();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      
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
        title="Active Households"
        value={activeHouseholds.value}
        change={activeHouseholds.change}
        icon={Home}
      />

      <MetricCard
        title="Active Markets"
        value={activeMarkets.value}
        change={activeMarkets.change}
        icon={Store}
      />

      <MetricCard
        title="Active Organizations"
        value={activeOrganizations.value}
        change={activeOrganizations.change}
        icon={Building2}
      />

    </div>
  );
};

export default MetricsGrid;
