
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import { pendingApprovals } from '@/data/dashboard-data';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Dashboard | FarmAid Admin';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Format currency to use Peso sign
  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString('en-PH')}`;
  };

  // Handle notification click
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Handle message click
  const handleMessageClick = () => {
    toast.info("Messages feature will be implemented in the next update.", {
      description: "You'll be able to chat with farmers, recipients, and other admins.",
      action: {
        label: "Coming Soon",
        onClick: () => {}
      }
    });
  };

  // Handle view all activities
  const handleViewAllActivities = () => {
    navigate('/notifications');
  };

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening today."
        onNotificationClick={handleNotificationClick}
        onMessageClick={handleMessageClick}
      />
      
      <div className="p-8 space-y-8">
        <DashboardMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <ActivityFeed onViewAll={handleViewAllActivities} />
          </div>
        </div>
        
        <PendingApprovals approvals={pendingApprovals} />
      </div>
    </div>
  );
};

export default Dashboard;
