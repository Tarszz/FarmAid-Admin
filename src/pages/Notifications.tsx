import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
import { Search, Filter, ChevronDown, Bell, MessageSquare, Truck } from 'lucide-react';

type Notification = {
  id: string;
  type: 'Donation' | 'Delivery' | 'Dispute' | 'System';
  message: string;
  date: any;
  read: boolean;
  details: string;
  buyerId?: string;
  userLink?: {
    id: string;
    name: string;
    type: string;
  };
  transactionLink?: {
    id: string;
    type: string;
  };
  formattedDate?: string;
};

type TransactionDetails = {
  location?: string;
  name?: string;
  quantity?: number;
  quantityUnit?: string;
  price?: number;
  transactionType?: string;
  organizationName?: string;
  imageUrl?: string;
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
  const { data: notifications = [], loading } = useFirestoreQuery('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

  useEffect(() => {
    const fetchBuyerNames = async () => {
      const buyerIds = Array.from(
        new Set(notifications.map((n: Notification) => n.buyerId).filter(Boolean))
      );

      const names: Record<string, string> = {};
      await Promise.all(
        buyerIds.map(async (id) => {
          const userDoc = await getDoc(doc(db, 'users', id));
          if (userDoc.exists()) {
            const data = userDoc.data();
            names[id] = `${data.firstname} ${data.lastname}`;
          }
        })
      );
      setBuyerNames(names);
    };

    if (notifications.length > 0) fetchBuyerNames();
  }, [notifications]);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (selectedNotification?.transactionLink?.id) {
        const transactionDoc = await getDoc(doc(db, 'transactions', selectedNotification.transactionLink.id));
        if (transactionDoc.exists()) {
          const data = transactionDoc.data();
          setTransactionDetails({
            location: data.location,
            name: data.name,
            quantity: data.quantity,
            quantityUnit: data.quantityUnit,
            price: data.price,
            transactionType: data.transactionType,
            organizationName: data.organizationName,
            imageUrl: data.imageUrl,
          });
        } else {
          setTransactionDetails(null);
        }
      } else {
        setTransactionDetails(null);
      }
    };

    if (detailsOpen) {
      fetchTransactionDetails();
    }
  }, [selectedNotification, detailsOpen]);

  const filteredNotifications = notifications
    .map((notification: Notification) => {
      let updatedMessage = notification.message;
      if (notification.buyerId && buyerNames[notification.buyerId]) {
        const fullName = buyerNames[notification.buyerId];
        updatedMessage = updatedMessage
          .replace(/\byour\b/gi, `${fullName}'s`)
          .replace(/\byou\b/gi, fullName);
      }
      return {
        ...notification,
        message: updatedMessage,
        formattedDate: notification.date?.seconds
          ? new Date(notification.date.seconds * 1000).toLocaleString()
          : 'Invalid date',
      };
    })
    .filter((notification: Notification) => {
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

  // Improved console log to show full object contents:
  console.log('Selected Notification:', JSON.stringify(selectedNotification, null, 2));

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
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Donation')}>Donation</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Delivery')}>Delivery</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Dispute')}>Dispute</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('System')}>System</DropdownMenuItem>
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
                  <TableCell>{notification.formattedDate}</TableCell>
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

            <div className="mt-4 space-y-4">
              <div>
                <p><strong>Message:</strong></p>
                <p>{selectedNotification.message}</p>
              </div>
              <div>
                <p><strong>Date:</strong></p>
                <p>{selectedNotification.formattedDate}</p>
              </div>
              <div>
                <p><strong>Details:</strong></p>
                <p>{selectedNotification.details ? selectedNotification.details : "No details available."}</p>
              </div>

              {transactionDetails ? (
                <div className="mt-4 border p-4 rounded-md bg-gray-50">
                  <h3 className="font-semibold mb-2">Transaction Details</h3>
                  {transactionDetails.imageUrl && (
                    <img
                      src={transactionDetails.imageUrl}
                      alt={transactionDetails.name}
                      className="mb-2 max-h-40 object-contain"
                    />
                  )}
                  <p><strong>Name:</strong> {transactionDetails.name}</p>
                  <p><strong>Quantity:</strong> {transactionDetails.quantity} {transactionDetails.quantityUnit}</p>
                  <p><strong>Price:</strong> ₱{transactionDetails.price}</p>
                  <p><strong>Location:</strong> {transactionDetails.location}</p>
                  <p><strong>Transaction Type:</strong> {transactionDetails.transactionType}</p>
                  <p><strong>Organization:</strong> {transactionDetails.organizationName}</p>
                </div>
              ) : (
                <p>No transaction details available.</p>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default Notifications;
