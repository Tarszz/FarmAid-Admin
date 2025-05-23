import { Timestamp } from "firebase/firestore";

export interface Transaction {
  id: string;
  farmerId?: string;
  buyerId?: string;
  donorId?: string;
  date?: Timestamp;       // Use Timestamp here if possible
  name?: string;
  items?: any[];
  farmerName?: string;
  buyerName?: string;
  donorName?: string;
  crop?: string;
  quantity?: number;
  totalAmount?: number;
  transactionType?: string;
  status?: string;
  unit?: string;
  item?: string;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};
