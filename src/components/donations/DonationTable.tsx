
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

type Donation = {
  id: string;
  donorName: string;
  crop: string;
  quantity: string;
  recipientOrganization: string;
  date: string;
  timeReceived: string;
  confirmationImage?: string;
  deliveryDetails?: {
    address: string;
    date: string;
    courier: string;
    contactPerson: string;
    contactNumber: string;
  };
};

interface DonationTableProps {
  donations: Donation[];
  loading: boolean;
  onViewDetails: (donation: Donation) => void;
}

const DonationTable: React.FC<DonationTableProps> = ({ 
  donations, 
  loading, 
  onViewDetails 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor Name</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Quantity (Kg)</TableHead>
            <TableHead>Recipient Organization</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time Received</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-admin-textSecondary">
                {loading ? 'Loading donations...' : 'No donations found matching the criteria.'}
              </TableCell>
            </TableRow>
          ) : (
            donations.map((donation: Donation) => (
              <TableRow key={donation.id}>
                <TableCell className="font-medium">{donation.donorName}</TableCell>
                <TableCell>{donation.crop}</TableCell>
                <TableCell>{donation.quantity}</TableCell>
                <TableCell>{donation.recipientOrganization}</TableCell>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{donation.timeReceived || "10:30 AM"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(donation)}
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationTable;
