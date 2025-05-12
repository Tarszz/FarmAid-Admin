
import React from 'react';
import { Transaction, formatCurrency } from '@/types/transaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import TransactionDetails from './TransactionDetails';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Buyer/Donor</TableHead>
            <TableHead>Crop</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-admin-textSecondary">
                {loading ? 'Loading transactions...' : 'No transactions found matching the criteria.'}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TableRow>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.farmerName}</TableCell>
                  <TableCell>{transaction.buyerName}</TableCell>
                  <TableCell>{transaction.crop}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-admin-secondary/5">
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={transaction.status} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={transaction.id} className="border-0">
                        <AccordionTrigger className="py-2 px-4 text-sm text-admin-textSecondary">
                          View Details
                        </AccordionTrigger>
                        <AccordionContent>
                          <TransactionDetails transaction={transaction} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
