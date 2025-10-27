
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomBadge } from '@/components/ui/custom-badge';
import { MapPin, Phone, Calendar, Image, Clock } from 'lucide-react';
import { Delivery } from '@/types/delivery';

interface DeliveryDetailsProps {
  delivery: Delivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  delivery,
  open,
  onOpenChange,
}) => {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delivery Details</DialogTitle>
          <DialogDescription>
            Complete information about this delivery
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Badge variant={delivery.transactionType === 'Donation' ? 'outline' : 'secondary'} className="mr-2">
                    {delivery.transactionType}
                  </Badge>
                  <CustomBadge variant={delivery.status === 'Delivered' ? 'success' : 'warning'}>
                    {delivery.status}
                  </CustomBadge>
                </div>
                <p className="text-sm text-admin-textSecondary">
                  Delivery ID: <span className="text-admin-text font-medium">{delivery.id}</span>
                </p>
                <p className="text-sm text-admin-textSecondary">
                  Courier: <span className="text-admin-text">{delivery.courier}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Recipient Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{delivery.recipient}</p>
                    <p className="text-sm text-admin-textSecondary">{delivery.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                    <Phone size={16} />
                  </div>
                  <p className="text-sm">{delivery.contactInfo}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Delivery Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date Sent</p>
                    <p className="text-sm text-admin-textSecondary">{delivery.date}</p>
                  </div>
                </div>
                
                {delivery.status === 'In Progress' && (
                  <div className="flex items-center">
                    <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-admin-textSecondary">{delivery.estimatedDelivery}</p>
                    </div>
                  </div>
                )}
                
                {delivery.status === 'Delivered' && (
                  <>
                    <div className="flex items-center">
                      <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date Received</p>
                        <p className="text-sm text-admin-textSecondary">{delivery.dateReceived || delivery.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-admin-secondary/10 p-2 rounded mr-3 text-admin-secondary">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time Received</p>
                        <p className="text-sm text-admin-textSecondary">{delivery.timeReceived || "3:45 PM"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {delivery.status === 'Delivered' && delivery.proofOfReceipt && (
              <div>
                <h3 className="text-lg font-medium mb-2">Proof of Receipt</h3>
                <div className="relative border rounded-md overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-10 w-10 text-admin-textSecondary" />
                  </div>
                  <img
                    src={delivery.proofOfReceipt}
                    alt="Proof of receipt"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryDetails;
