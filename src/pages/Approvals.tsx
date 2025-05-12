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
import { CustomBadge } from '@/components/ui/custom-badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, ChevronDown, Eye, FileText, Check, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type ApprovalRequest = {
  id: string;
  name: string;
  userType: 'Farmer' | 'Donor' | 'Organization';
  documents: string[];
  status: 'Pending';
  dateApplied: string;
  email: string;
  phone: string;
  address: string;
};

const Approvals = () => {
  const { data: approvals, loading } = useFirestoreQuery('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  
  const { toast } = useToast();

  const filteredApprovals = approvals.filter((approval: ApprovalRequest) => {
    const matchesSearch =
      approval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterType || approval.userType === filterType;
    
    return matchesSearch && matchesType;
  });

  const viewDetails = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setDetailsOpen(true);
  };

  const handleAction = (approval: ApprovalRequest, actionType: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setAction(actionType);
    setConfirmationOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedApproval || !action) return;
    
    try {
      await updateDoc(doc(db, 'approvals', selectedApproval.id), {
        status: action === 'approve' ? 'Approved' : 'Rejected'
      });
      
      if (action === 'approve') {
        // Implementation for creating verified user would go here
        // This would be handled by a Firebase Cloud Function in a real app
      }
      
      toast({
        title: action === 'approve' ? 'User Approved' : 'User Rejected',
        description: `${selectedApproval.name} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
        variant: "default",
      });
      
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    } finally {
      setConfirmationOpen(false);
    }
  };

  return (
    <PageContainer title="Approvals" subtitle="Review and process verification requests" loading={loading}>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
          <Input
            type="search"
            placeholder="Search approvals..."
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
                User Type
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Farmer')}>
                Farmers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Donor')}>
                Donors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Organization')}>
                Organizations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApprovals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading approval requests...' : 'No approval requests found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredApprovals.map((approval: ApprovalRequest) => (
                <TableRow key={approval.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-admin-secondary/5">
                      {approval.userType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{approval.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {approval.documents.length} Documents
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CustomBadge variant="warning">
                      {approval.status}
                    </CustomBadge>
                  </TableCell>
                  <TableCell>{approval.dateApplied}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewDetails(approval)}
                      className="h-8 w-8 mr-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(approval, 'approve')}
                      className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 mr-1"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(approval, 'reject')}
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedApproval && (
        <>
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Approval Request Details</DialogTitle>
                <DialogDescription>
                  Review details and submitted documents
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">User Information</h3>
                  <dl className="space-y-3">
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Name:</dt>
                      <dd className="col-span-2 font-medium">{selectedApproval.name}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Type:</dt>
                      <dd className="col-span-2">
                        <Badge variant="outline" className="bg-admin-secondary/5">
                          {selectedApproval.userType}
                        </Badge>
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Email:</dt>
                      <dd className="col-span-2">{selectedApproval.email}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Phone:</dt>
                      <dd className="col-span-2">{selectedApproval.phone}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Address:</dt>
                      <dd className="col-span-2">{selectedApproval.address}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <dt className="text-admin-textSecondary">Applied On:</dt>
                      <dd className="col-span-2">{selectedApproval.dateApplied}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Submitted Documents</h3>
                  <div className="space-y-4">
                    {selectedApproval.documents.map((doc, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Document {index + 1}</span>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-admin-secondary text-sm hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                        <div className="aspect-video bg-slate-100 rounded relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="h-10 w-10 text-admin-textSecondary opacity-20" />
                          </div>
                          <img
                            src={doc}
                            alt={`Document ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                
                <div className="space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDetailsOpen(false);
                      handleAction(selectedApproval, 'reject');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setDetailsOpen(false);
                      handleAction(selectedApproval, 'approve');
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {action === 'approve' ? 'Approve User' : 'Reject User'}
                </DialogTitle>
                <DialogDescription>
                  {action === 'approve'
                    ? 'Are you sure you want to approve this user? They will be granted access to the platform.'
                    : 'Are you sure you want to reject this user? They will need to reapply to get access.'}
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant={action === 'approve' ? 'default' : 'destructive'}
                  onClick={confirmAction}
                >
                  {action === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </PageContainer>
  );
};

export default Approvals;
