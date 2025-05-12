
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import CropDistributionChart from './CropDistributionChart';

interface CropDistributionCardProps {
  cropData: Array<{ name: string; value: number }>;
}

const CropDistributionCard: React.FC<CropDistributionCardProps> = ({ cropData }) => {
  return (
    <Card className="lg:col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle>Crop Distribution</CardTitle>
        <CardDescription>Top crop categories by weight (Kg)</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <CropDistributionChart data={cropData} />
      </CardContent>
    </Card>
  );
};

export default CropDistributionCard;
