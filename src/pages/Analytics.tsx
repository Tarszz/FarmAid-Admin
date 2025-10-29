
import React from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import MetricsGrid from '@/components/analytics/MetricsGrid';
import SalesAndDonationsCharts from '@/components/analytics/SalesAndDonationsCharts';
import CropDistributionCard from '@/components/analytics/CropDistributionCard';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const Analytics = () => {
  const { loading, metrics, salesData, donationsData, cropData } = useAnalyticsData();

  return (
    <PageContainer title="Analytics" subtitle="Overview of system performance and trends" loading={loading}>
      <MetricsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SalesAndDonationsCharts 
          salesData={salesData}
          donationsData={donationsData}
          className="lg:col-span-2"
        />
        
        <CropDistributionCard cropData={cropData} />
      </div>

    </PageContainer>
  );
};

export default Analytics;
