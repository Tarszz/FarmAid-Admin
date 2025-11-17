import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  Search,
  EyeIcon,
  BadgeCheck,
  Ban,
  Filter,
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

const Users = () => {
  const { data: users, loading } = useFirestoreQuery('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'view' | 'verify' | 'disable'>('view');

  const { toast } = useToast();

  // ⭐ NEWEST FIRST SORTING + FILTERS ⭐
  const filteredUsers = [...users]
    .sort((a, b) => {
      const dateA = a.dateJoined?.toMillis?.() ?? 0;
      const dateB = b.dateJoined?.toMillis?.() ?? 0;
      return dateB - dateA; // newest first
    })
    .filter((user: User) => {
      const matchesSearch =
        (user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesType = !filterType || user.userType === filterType;
      const matchesStatus = !filterStatus || user.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

  const handleActionClick = (user: User, action: 'view' | 'verify' | 'disable') => {
    setSelectedUser(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedUser) return;

    try {
      if (dialogAction === 'verify') {
        await updateDoc(doc(db, 'users', selectedUser.id), {
          status: 'Verified',
        });
        toast({
          title: 'User Verified',
          description: `${selectedUser.firstname} has been successfully verified.`,
        });
      } else if (dialogAction === 'disable') {
        await updateDoc(doc(db, 'users', selectedUser.id), {
          status: 'Disabled',
        });
        toast({
          title: 'User Disabled',
          description: `${selectedUser.firstname} has been disabled.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'There was an error processing your request.',
        variant: 'destructive',
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const formatDate = (timestamp) => {
    return timestamp?.toDate ? timestamp.toDate().toLocaleString() : 'Invalid date';
  };

  const getUserTypeFilterText = () => (filterType ? `User Type: ${filterType}` : 'User Type');
  const getStatusFilterText = () => (filterStatus ? `Status: ${filterStatus}` : 'Status');

  return (
    <PageContainer title="Users" subtitle="Manage all system users" loading={loading}>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
          <Input
            type="search"
            placeholder="Search by name or email..."
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
                {getUserTypeFilterText()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Farmer')}>Farmers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Donor')}>Donors</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Market')}>Markets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Organization')}>Organizations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                {getStatusFilterText()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Verified')}>Verified</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Disabled')}>Disabled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">User Name</TableHead>
              <TableHead className="text-left">User Type</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-left">Email</TableHead>
              <TableHead className="text-left">Date Joined</TableHead>
              <TableHead className="text-left pl-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading users...' : 'No users found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {`${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-admin-secondary/5">
                      {user.userType || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === 'Verified'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'Pending'
                          ? 'bg-white text-yellow-600 border border-yellow-300'
                          : user.status === 'Disabled'
                          ? 'bg-red-100 text-red-800'
                          : ''
                      }
                    >
                      {user.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.dateJoined)}</TableCell>
                  <TableCell className="text-left pl-6">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'view')}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'verify')}>
                        <BadgeCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleActionClick(user, 'disable')}>
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
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
              <p><strong>First Name:</strong> {selectedUser.firstname || 'N/A'}</p>
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
                    alt="User Certificate"
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
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            {dialogAction !== 'view' && (
              <Button onClick={handleActionConfirm}>
                {dialogAction === 'verify' ? 'Verify' : 'Disable'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Users;
