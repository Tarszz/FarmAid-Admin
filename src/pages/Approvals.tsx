import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  EyeIcon,
  BadgeCheck,
  Ban,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

type User = {
  id: string;
  firstname: string;
  lastname?: string;
  email: string;
  userType: 'Farmer' | 'Donor' | 'Market' | 'Organization';
  status: 'Verified' | 'Pending' | 'Disabled';
  dateJoined: Timestamp;
  address: string;
  phoneNumber?: string;
  profileImage?: string;
  certificateUrl?: string;
};

const Approvals = () => {
  const { data: users, loading } = useFirestoreQuery('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'view' | 'verify' | 'disable'>('view');
  const { toast } = useToast();

  const pendingUsers = users.filter(
    (user: User) =>
      user.status === 'Pending' &&
      (user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleActionClick = (user: User, action: 'view' | 'verify' | 'disable') => {
    setSelectedUser(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedUser) return;

    try {
      if (dialogAction === 'verify') {
        await updateDoc(doc(db, 'users', selectedUser.id), { status: 'Verified' });
        toast({
          title: 'User Verified',
          description: `${selectedUser.firstname} has been verified.`,
        });
      } else if (dialogAction === 'disable') {
        await updateDoc(doc(db, 'users', selectedUser.id), { status: 'Disabled' });
        toast({
          title: 'User Disabled',
          description: `${selectedUser.firstname} has been disabled.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'There was an error processing the request.',
        variant: 'destructive',
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp?.toDate ? timestamp.toDate().toLocaleString() : 'Invalid date';
  };

  return (
    <PageContainer title="Approvals" subtitle="Approve or disable pending users" loading={loading}>
      <div className="flex mb-6 w-full md:w-96 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">User Type</TableHead>
              <TableHead className="text-left">Email</TableHead>
              <TableHead className="text-left">Date Joined</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading...' : 'No pending users found.'}
                </TableCell>
              </TableRow>
            ) : (
              pendingUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstname || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-admin-secondary/5">
                      {user.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.dateJoined)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'view')}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'verify')}>
                      <BadgeCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'disable')}>
                      <Ban className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction === 'view' ? 'User Details' : 'Confirm Action'}</DialogTitle>
          </DialogHeader>
          {dialogAction === 'view' && selectedUser ? (
            <DialogDescription className="space-y-2 text-left">
              <p><strong>First Name:</strong> {selectedUser.firstname}</p>
              <p><strong>Last Name:</strong> {selectedUser.lastname || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
              <p><strong>Phone Number:</strong> {selectedUser.phoneNumber || 'N/A'}</p>
              <p><strong>User Type:</strong> {selectedUser.userType}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              {selectedUser.certificateUrl && (
                <div className="mt-4">
                  <p className="mb-1 font-semibold">Certificate:</p>
                  <img
                    src={selectedUser.certificateUrl}
                    alt="Certificate"
                    className="rounded-md border max-h-64 w-auto"
                  />
                </div>
              )}
            </DialogDescription>
          ) : (
            <DialogDescription>
              Are you sure you want to {dialogAction} this user?
            </DialogDescription>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            {dialogAction !== 'view' && (
              <Button onClick={handleActionConfirm}>Confirm</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Approvals;
