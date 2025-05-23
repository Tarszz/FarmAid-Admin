
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesChart from './SalesChart';
import DonationsChart from './DonationsChart';

interface SalesAndDonationsChartsProps {
  salesData: Array<{ month: string; value: number }>;
  donationsData: Array<{ month: string; value: number; families: number }>;
  className?: string; // Added className prop as optional
}

const SalesAndDonationsCharts: React.FC<SalesAndDonationsChartsProps> = ({ 
  salesData,
  donationsData,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales & Donations Trends</CardTitle>
        <CardDescription>Monthly overview of sales and donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
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
