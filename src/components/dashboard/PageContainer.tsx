
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Loader2 } from 'lucide-react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  subtitle, 
  loading = false, 
  children 
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader 
        title={title} 
        subtitle={subtitle || `Manage and monitor ${title.toLowerCase()}`}
      />
      
      <div className="p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-10 h-10 text-admin-secondary animate-spin mb-4" />
            <p className="text-admin-textSecondary">Loading data...</p>
          </div>
        ) : children}
      </div>
    </div>
  );
};

export default PageContainer;
