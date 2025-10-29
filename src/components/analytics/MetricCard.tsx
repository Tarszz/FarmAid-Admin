
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: LucideIcon;
  formatter?: (value: number) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  formatter = (val) => val.toString()
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-admin-textSecondary">
            {title}
          </CardTitle>
          <CardDescription className="text-2xl font-bold text-admin-text">
            {typeof value === 'number' ? formatter(value) : value}
          </CardDescription>
        </div>
        <div className="h-9 w-9 rounded-full bg-admin-secondary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-admin-secondary" />
        </div>
      </CardHeader>
      <CardContent>
       
      </CardContent>
    </Card>
  );
};

export default MetricCard;
