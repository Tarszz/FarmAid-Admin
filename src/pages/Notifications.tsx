import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, Bell, MessageSquare, Truck } from 'lucide-react';

type Notification = {
  id: string;
  type: 'Donation' | 'Delivery' | 'Dispute' | 'System' | string;
  message: string;
  date: any;
  read?: boolean;
  buyerId?: string;
  transactionType?: string;
  productId?: string;
  category?: string;
  quantity?: number;
  quantityUnit?: string;
  imageUrl?: string;
  organizationName?: string;
  transactionNumber?: string;
};

type User = {
  firstname: string;
  lastname: string;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notifications'));
        const notifs: Notification[] = [];
        const buyerIds: Set<string> = new Set();

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data) return;

          const notif: Notification = {
            id: docSnap.id,
            buyerId: data.buyerId || '',
            transactionType: data.transactionType || '',
            message: data.message || '',
            date: data.date || null,
            productId: data.productId || '',
            category: data.category || '',
            quantity: data.quantity || 0,
            quantityUnit: data.quantityUnit || '',
            imageUrl: data.imageUrl || '',
            organizationName: data.organizationName || '',
            transactionNumber: data.transactionNumber || '',
            type: data.type || 'System',
            read: data.read || false,
          };

          notifs.push(notif);

          if (notif.buyerId) {
            buyerIds.add(notif.buyerId);
          }
        });

        const usersMap: Record<string, User> = {};
        await Promise.all(
          Array.from(buyerIds).map(async (buyerId) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', buyerId));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                usersMap[buyerId] = {
                  firstname: userData.firstname,
                  lastname: userData.lastname,
                };
              }
            } catch (err) {
              console.error(`Failed to fetch user for buyerId ${buyerId}`, err);
            }
          })
        );

        setUsers(usersMap);
        setNotifications(notifs);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Prepare notifications for display: replace 'you' and 'your' with buyer full names
  const displayedNotifications = notifications
    .map((notification) => {
      let updatedMessage = notification.message;
      if (notification.buyerId && users[notification.buyerId]) {
        const fullName = `${users[notification.buyerId].firstname} ${users[notification.buyerId].lastname}`;
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
    .filter((notification) => {
      const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || notification.type === filterType;
      return matchesSearch && matchesType;
    });

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
        {/*<div className="flex flex-wrap gap-2">
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
        </div>*/}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading notifications...' : 'No notifications found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              displayedNotifications.map((notification) => (
                <TableRow key={notification.id} className={notification.read ? '' : 'bg-admin-secondary/5'}>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      <NotificationIcon type={notification.type} />
                      <span className="ml-1.5">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>{notification.formattedDate}</TableCell>
                  
                  <TableCell className="text-right">
                    <Dialog
                      open={selectedNotification?.id === notification.id}
                      onOpenChange={(open) => {
                        if (!open) setSelectedNotification(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedNotification(notification)}
                          size="sm"
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogTitle>Transaction Details</DialogTitle>
                        {selectedNotification && selectedNotification.id === notification.id && (
                          <div className="space-y-4 mt-4 text-sm">
                            <p>
                              <strong>Buyer Name:</strong>{' '}
                              {selectedNotification.buyerId && users[selectedNotification.buyerId]
                                ? `${users[selectedNotification.buyerId].firstname} ${users[selectedNotification.buyerId].lastname}`
                                : 'N/A'}
                            </p>
                            <p>
                              <strong>Transaction Type:</strong> {selectedNotification.transactionType || selectedNotification.type}
                            </p>
                            <p>
                              <strong>Product ID:</strong> {selectedNotification.productId || 'N/A'}
                            </p>
                            <p>
                              <strong>Category:</strong> {selectedNotification.category || 'N/A'}
                            </p>
                            <p>
                              <strong>Quantity:</strong>{' '}
                              {selectedNotification.quantity
                                ? `${selectedNotification.quantity} ${selectedNotification.quantityUnit || ''}`
                                : 'N/A'}
                            </p>
                            <p>
                              <strong>Organization Name:</strong>{' '}
                              {selectedNotification.organizationName || 'N/A'}
                            </p>
                            <p>
                              <strong>Transaction Number:</strong>{' '}
                              {selectedNotification.transactionNumber || 'N/A'}
                            </p>
                            {selectedNotification.imageUrl && (
                              <div>
                                <strong>Image:</strong>
                                <img
                                  src={selectedNotification.imageUrl}
                                  alt="Notification related"
                                  className="mt-2 max-w-full rounded-md border"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
};

export default Notifications;
