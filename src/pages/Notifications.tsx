
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, ExternalLink, Bell, MessageSquare, Truck } from 'lucide-react';

type Notification = {
  id: string;
  type: 'Donation' | 'Delivery' | 'Dispute' | 'System';
  message: string;
  date: string;
  read: boolean;
  details: string;
  userLink?: {
    id: string;
    name: string;
    type: string;
  };
  transactionLink?: {
    id: string;
    type: string;
  };
};

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Donation':
      return <Bell className="h-4 w-4" />;
    case 'Delivery':
      return <Truck className="h-4 w-4" />;
    case 'Dispute':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const Notifications = () => {
  const { data: notifications, loading } = useFirestoreQuery('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredNotifications = notifications.filter((notification: Notification) => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || notification.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const viewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Donation':
        return 'bg-emerald-100 text-emerald-800';
      case 'Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Dispute':
        return 'bg-amber-100 text-amber-800';
      case 'System':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageContainer title="Notifications" subtitle="Manage system notifications and alerts" loading={loading}>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
          <Input
            type="search"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Type
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Donation')}>
                Donation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Delivery')}>
                Delivery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Dispute')}>
                Dispute
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('System')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading notifications...' : 'No notifications found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <TableRow key={notification.id} className={notification.read ? '' : 'bg-admin-secondary/5'}>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      <NotificationIcon type={notification.type} />
                      <span className="ml-1.5">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="truncate font-medium">{notification.message}</p>
                  </TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell>
                    {notification.read ? (
                      <Badge variant="outline">Read</Badge>
                    ) : (
                      <Badge>Unread</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewDetails(notification)}
                      className="h-8"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedNotification && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Details</DialogTitle>
              <DialogDescription>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getTypeColor(selectedNotification.type)}`}>
                  <NotificationIcon type={selectedNotification.type} />
                  <span className="ml-1.5">{selectedNotification.type} Notification</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="text-lg font-medium mb-2">{selectedNotification.message}</h3>
              <p className="text-admin-textSecondary text-sm mb-4">{selectedNotification.date}</p>
              
              <div className="border-l-2 border-admin-secondary/20 pl-4 py-1 mb-4">
                <p className="text-admin-textSecondary">
                  {selectedNotification.details}
                </p>
              </div>
              
              <div className="space-y-3">
                {selectedNotification.userLink && (
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Related User</p>
                      <p className="text-sm text-admin-textSecondary">
                        {selectedNotification.userLink.name} ({selectedNotification.userLink.type})
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View User
                    </Button>
                  </div>
                )}
                
                {selectedNotification.transactionLink && (
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Related Transaction</p>
                      <p className="text-sm text-admin-textSecondary">
                        {selectedNotification.transactionLink.id} ({selectedNotification.transactionLink.type})
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Transaction
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default Notifications;
