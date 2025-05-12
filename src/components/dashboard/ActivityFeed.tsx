
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

type ActivityItem = {
  id: number;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  target: string;
  time: string;
};

const activityItems: ActivityItem[] = [
  {
    id: 1,
    user: {
      name: 'Maria Santos',
      initials: 'MS',
    },
    action: 'approved',
    target: 'Rivera Farm donation',
    time: '10 minutes ago'
  },
  {
    id: 2,
    user: {
      name: 'Juan Dela Cruz',
      initials: 'JD',
    },
    action: 'added',
    target: 'new price guidelines',
    time: '2 hours ago'
  },
  {
    id: 3,
    user: {
      name: 'Elena Torres',
      initials: 'ET',
    },
    action: 'updated',
    target: 'marketplace regulations',
    time: '5 hours ago'
  },
  {
    id: 4,
    user: {
      name: 'Pedro Reyes',
      initials: 'PR',
    },
    action: 'registered',
    target: 'as a new farmer',
    time: '1 day ago'
  }
];

interface ActivityFeedProps {
  onViewAll?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ onViewAll }) => {
  return (
    <div className="admin-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-admin-text">Recent Activity</h2>
      </div>
      
      <div className="space-y-4">
        {activityItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 pb-4 border-b border-admin-border last:border-0 last:pb-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
              <AvatarFallback className="bg-admin-secondary text-white text-xs">
                {item.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium text-admin-text">{item.user.name}</span>
                <span className="text-admin-textSecondary"> {item.action} </span>
                <span className="text-admin-text">{item.target}</span>
              </p>
              <p className="text-xs text-admin-textSecondary">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full text-admin-textSecondary hover:text-admin-text border-admin-border"
          onClick={onViewAll}
        >
          View All Activity
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;
