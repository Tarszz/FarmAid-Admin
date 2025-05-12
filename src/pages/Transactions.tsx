import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Search, 
  Filter 
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

type Transaction = {
  id: string;
  userId: string;
  Farmer: string;
  BuyerDonor: string;
  crop: string;
  quantity: number;
  amount: number;
  TransactionType: 'Donation' | 'Purchase';
  status: 'Completed' | 'Pending' | 'Failed';
  DateTime: Timestamp | null;
};

const Transactions = () => {
  const { data: transactions, loading } = useFirestoreQuery('Transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((tx: Transaction) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
        
          tx.id?.toLowerCase().includes(search);

        const matchesType = !filterType || tx.TransactionType === filterType;
        const matchesStatus = !filterStatus || tx.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

  const getTransactionTypeFilterText = () => {
    if (filterType) return `Type: ${filterType}`;
    return 'Type';
  };

  const getStatusFilterText = () => {
    if (filterStatus) return `Status: ${filterStatus}`;
    return 'Status';
  };

  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
  
    console.warn('Invalid timestamp value:', timestamp);
    return 'N/A';
  };
  

  return (
    <PageContainer title="Transactions" subtitle="View and manage user transactions" loading={loading}>
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary" />
          <Input
            type="search"
            placeholder="Search by user or transaction ID..."
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
                {getTransactionTypeFilterText()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Donation')}>Donation</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Purchase')}>Purchase</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                {getStatusFilterText()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Failed')}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Transaction ID</TableHead>
              <TableHead className="text-left">Farmer</TableHead>
              <TableHead className="text-left">Buyer/Donor</TableHead>
              <TableHead className="text-left">Crop</TableHead>
              <TableHead className="text-left">Quantity</TableHead>
              <TableHead className="text-left">Amount</TableHead>
              <TableHead className="text-left">Type</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-left">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading transactions...' : 'No transactions found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx: Transaction) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
               
                  <TableCell>{tx.Farmer}</TableCell>
                  <TableCell>{tx.BuyerDonor}</TableCell>
                  <TableCell>{tx.crop}</TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.TransactionType}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{formatDate(tx.DateTime)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
};

export default Transactions;
