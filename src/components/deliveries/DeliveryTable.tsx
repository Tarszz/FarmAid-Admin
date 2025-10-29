
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomBadge } from '@/components/ui/custom-badge';
import { Delivery } from '@/types/delivery';

interface DeliveryTableProps {
  deliveries: Delivery[];
  loading: boolean;
  onRowClick: (delivery: Delivery) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  loading,
  onRowClick,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Delivery ID</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Date Sent</TableHead>
            <TableHead>Date Received</TableHead>
            <TableHead>Time Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-admin-textSecondary">
                {loading ? 'Loading deliveries...' : 'No deliveries found matching the criteria.'}
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery: Delivery) => (
              <TableRow 
                key={delivery.id} 
                onClick={() => onRowClick(delivery)} 
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="font-medium">{delivery.id}</TableCell>
                <TableCell>{delivery.courier}</TableCell>
                <TableCell>
                  <CustomBadge variant={delivery.status === 'Delivered' ? 'success' : 'warning'}>
                    {delivery.status}
                  </CustomBadge>
                </TableCell>
                <TableCell>{delivery.recipient}</TableCell>
                <TableCell>{delivery.date}</TableCell>
                <TableCell>{delivery.status === 'Delivered' ? (delivery.dateReceived || delivery.estimatedDelivery) : '-'}</TableCell>
                <TableCell>{delivery.status === 'Delivered' ? (delivery.timeReceived || '3:45 PM') : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryTable;
