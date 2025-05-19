import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase'; // adjust import path

type NotificationItem = {
  id: string;
  message: string;
  buyerId: string;
  timestamp: number; // changed to number since Firestore stores it as number
};

type User = {
  firstname: string;
  lastname: string;
  avatar?: string;
};

type ActivityItem = {
  id: string;
  user: User & { initials: string };
  message: string;
  timestamp: Date; // JS Date object
};

interface ActivityFeedProps {
  onViewAll?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ onViewAll }) => {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(4));
        const notificationSnapshot = await getDocs(q);

        const activities: ActivityItem[] = [];

        for (const docSnap of notificationSnapshot.docs) {
          const notification = docSnap.data() as NotificationItem;
          const userDocRef = doc(db, 'users', notification.buyerId);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) continue;

          const userData = userDocSnap.data() as User;
          const initials = (userData.firstname[0] + userData.lastname[0]).toUpperCase();

          const replacedMessage = notification.message.replace(
            /^(you|your)\b/i,
            `${userData.firstname} ${userData.lastname}`
          );

          activities.push({
            id: docSnap.id,
            user: { ...userData, initials },
            timestamp: new Date(notification.timestamp), // <-- here is the fix
            message: replacedMessage,
          });
        }

        setActivityItems(activities);
      } catch (error) {
        console.error('Error fetching activity feed:', error);
      }
    }

    fetchActivity();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-admin-text">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activityItems.length === 0 && (
          <p className="text-admin-textSecondary">No recent activity</p>
        )}

        {activityItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 pb-4 border-b border-admin-border last:border-0 last:pb-0"
          >
            <Avatar className="h-8 w-8">
              {item.user.avatar ? (
                <AvatarImage
                  src={item.user.avatar}
                  alt={`${item.user.firstname} ${item.user.lastname}`}
                />
              ) : (
                <AvatarFallback className="bg-admin-secondary text-white text-xs">
                  {item.user.initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-admin-text">{item.message}</p>
              <p className="text-xs text-admin-textSecondary">{formatDate(item.timestamp)}</p>
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
