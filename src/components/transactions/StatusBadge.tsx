
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CustomBadge } from '@/components/ui/custom-badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return <CustomBadge variant="success">{status}</CustomBadge>;
    case 'Pending':
      return <CustomBadge variant="warning">{status}</CustomBadge>;
    case 'Cancelled':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
