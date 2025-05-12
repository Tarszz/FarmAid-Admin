
import React from 'react';
import MetricCard from './MetricCard';
import { DollarSign, Users, ShoppingBag, HandHeart } from 'lucide-react';

interface MetricsData {
  totalDonations: { value: number, change: number };
  totalSales: { value: number, change: number };
  activeFarmers: { value: number, change: number };
  impactedFamilies: { value: number, change: number };
}

interface MetricsGridProps {
  metrics: MetricsData;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Donations"
        value={metrics.totalDonations.value}
        change={metrics.totalDonations.change}
        icon={HandHeart}
        formatter={formatCurrency}
      />
      
      <MetricCard
        title="Total Sales"
        value={metrics.totalSales.value}
        change={metrics.totalSales.change}
        icon={DollarSign}
        formatter={formatCurrency}
      />
      
      <MetricCard
        title="Active Farmers"
        value={metrics.activeFarmers.value}
        change={metrics.activeFarmers.change}
        icon={Users}
      />
      
      <MetricCard
        title="Impacted Families"
        value={metrics.impactedFamilies.value}
        change={metrics.impactedFamilies.change}
        icon={ShoppingBag}
      />
    </div>
  );
};

export default MetricsGrid;
