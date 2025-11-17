
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, MessageSquare, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle,
  onNotificationClick,

}) => {
  return (
    <header className="bg-white border-b border-admin-border px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">{title}</h1>
          {subtitle && <p className="text-admin-textSecondary mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border border-admin-border">
              <AvatarImage src="../images/ValCity.png" alt="User" />
              <AvatarFallback className="bg-admin-secondary text-white">
                Vanlenzuela City Agriculture Office
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
