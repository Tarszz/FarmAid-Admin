
export type Delivery = {
  id: string;
  courier: string;
  status: 'In Progress' | 'Delivered';
  recipient: string;
  address: string;
  date: string;
  estimatedDelivery: string;
  contactInfo: string;
  transactionType: 'Donation' | 'Sale';
  dateReceived?: string;
  timeReceived?: string;
  proofOfReceipt?: string;
};
