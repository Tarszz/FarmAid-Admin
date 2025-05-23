
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

interface DonationDetailsProps {
  donation: Donation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonationDetails: React.FC<DonationDetailsProps> = ({
  donation,
  open,
  onOpenChange,
}) => {
  if (!donation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Donation Details</DialogTitle>
          <DialogDescription>
            Complete information about this donation
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <dl className="space-y-3">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Donor:</dt>
                <dd className="col-span-2 font-medium">{donation.donorName}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Crop:</dt>
                <dd className="col-span-2">{donation.crop}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Quantity:</dt>
                <dd className="col-span-2">{donation.quantity} Kg</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Recipient:</dt>
                <dd className="col-span-2">{donation.recipientOrganization}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Date:</dt>
                <dd className="col-span-2">{donation.date}</dd>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-admin-textSecondary">Time Received:</dt>
                <dd className="col-span-2">{donation.timeReceived || "10:30 AM"}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            {donation.deliveryDetails && (
              <>
                <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="text-admin-textSecondary">Address:</dt>
                    <dd className="col-span-2">{donation.deliveryDetails.address}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="text-admin-textSecondary">Delivery Date:</dt>
                    <dd className="col-span-2">{donation.deliveryDetails.date}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="text-admin-textSecondary">Courier:</dt>
                    <dd className="col-span-2">{donation.deliveryDetails.courier}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="text-admin-textSecondary">Contact Person:</dt>
                    <dd className="col-span-2">{donation.deliveryDetails.contactPerson}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="text-admin-textSecondary">Contact Number:</dt>
                    <dd className="col-span-2">{donation.deliveryDetails.contactNumber}</dd>
                  </div>
                </dl>
              </>
            )}
          </div>
          
          {donation.confirmationImage && (
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-lg font-medium mb-4">Confirmation Image</h3>
              <div className="border rounded-md overflow-hidden w-full max-w-lg mx-auto aspect-video">
                <img
                  src={donation.confirmationImage}
                  alt="Donation confirmation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationDetails;
