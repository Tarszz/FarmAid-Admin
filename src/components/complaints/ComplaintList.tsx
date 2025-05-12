
import React from 'react';
import { Complaint } from '@/types/complaint';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CustomBadge } from '@/components/ui/custom-badge';
import ComplaintDetails from './ComplaintDetails';

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
  expandedComplaint: string | null;
  toggleExpand: (id: string) => void;
  handleStatusChange: (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => void;
  submitResponse: (id: string, response: string) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  loading,
  expandedComplaint,
  toggleExpand,
  handleStatusChange,
  submitResponse
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <CustomBadge variant="warning" className="text-xs">Open</CustomBadge>;
      case 'In Progress':
        return <CustomBadge variant="warning" className="text-xs">In Progress</CustomBadge>;
      case 'Resolved':
        return <CustomBadge variant="success" className="text-xs">Resolved</CustomBadge>;
      default:
        return <CustomBadge className="text-xs">{status}</CustomBadge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="py-8 text-center text-admin-textSecondary">
        No complaints found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Complaint ID</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Issue Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {complaints.map((complaint) => (
          <React.Fragment key={complaint.id}>
            <TableRow className="hover:bg-admin-background/50 cursor-pointer" onClick={() => toggleExpand(complaint.id)}>
              <TableCell className="font-medium">{complaint.id.substring(0, 8)}...</TableCell>
              <TableCell>{complaint.userName}</TableCell>
              <TableCell>{complaint.issueType}</TableCell>
              <TableCell>{getStatusBadge(complaint.status)}</TableCell>
              <TableCell>{complaint.date}</TableCell>
              <TableCell>
                {expandedComplaint === complaint.id ? 
                  <ChevronUp size={18} /> : 
                  <ChevronDown size={18} />}
              </TableCell>
            </TableRow>
            
            {expandedComplaint === complaint.id && (
              <TableRow className="bg-admin-background/30">
                <TableCell colSpan={6} className="p-4">
                  <ComplaintDetails 
                    complaint={complaint}
                    handleStatusChange={handleStatusChange}
                    submitResponse={submitResponse}
                  />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default ComplaintList;
