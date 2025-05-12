
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, FileCheck, ShoppingCart, HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

type Metric = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  bgColor: string;
};

const DashboardMetrics = () => {
  const metrics: Metric[] = [
    {
      title: 'Total Users',
      value: '1,293',
      change: 12.5,
      icon: <Users size={24} className="text-indigo-500" />,
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Pending Approvals',
      value: '42',
      change: -18.2,
      icon: <FileCheck size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Transactions',
      value: '₱12,430',
      change: 23.1,
      icon: <ShoppingCart size={24} className="text-emerald-500" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Donations',
      value: '532 kg',
      change: 8.3,
      icon: <HandHeart size={24} className="text-rose-500" />,
      bgColor: 'bg-rose-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
      {metrics.map((metric, idx) => (
        <div 
          key={idx}
          className="admin-card p-6 hover:translate-y-[-4px] transition-all duration-300 border border-admin-border rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-admin-textSecondary text-sm font-medium mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-admin-text">{metric.value}</h3>
              <div className={cn(
                "flex items-center text-sm font-medium mt-2", 
                metric.change >= 0 ? "text-admin-success" : "text-admin-danger"
              )}>
                {metric.change >= 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                <span>
                  {Math.abs(metric.change)}% from last month
                </span>
              </div>
            </div>
            <div className={cn("p-3 rounded-lg", metric.bgColor)}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
