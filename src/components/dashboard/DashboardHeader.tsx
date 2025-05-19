
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
  onMessageClick
}) => {
  return (
    <header className="bg-white border-b border-admin-border px-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">{title}</h1>
          {subtitle && <p className="text-admin-textSecondary mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-textSecondary h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-10 w-full bg-admin-background border-admin-border"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-admin-textSecondary hover:text-admin-text"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-admin-secondary">
                3
              </Badge>
            </Button>
            
            
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
