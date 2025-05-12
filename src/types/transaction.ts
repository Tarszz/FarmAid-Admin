
export type Transaction = {
  id: string;
  farmerName: string;
  buyerName: string;
  crop: string;
  quantity: string;
  amount: number;
  transactionType: 'Donation' | 'Sold to Market';
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
  recipientOrganization?: string;
  marketName?: string;
  priceBreakdown?: {
    basePrice: number;
    taxes: number;
    delivery: number;
    total: number;
  };
  deliveryDetails?: {
    address: string;
    courier: string;
    trackingNumber: string;
    estimatedDelivery: string;
  };
  proofOfDelivery?: string;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};
