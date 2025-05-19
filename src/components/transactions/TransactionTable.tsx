"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Make sure you have this file and exported 'db' from your Firebase config
import { Transaction, formatCurrency } from "@/types/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import TransactionDetails from "./TransactionDetails";

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));

        const data: Transaction[] = querySnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            farmerId: docData.farmerId || "",
            donorId: docData.donorId || "",
            date: docData.date,
            name: docData.name || "",
            items: docData.items || [],
            farmerName: docData.farmerName || "",
            buyerName: docData.buyerName || "",
            donorName: docData.donorName || "",
            crop: docData.crop || "",
            quantity: docData.quantity || 0,
            totalAmount: docData.totalAmount || 0,
            transactionType: docData.transactionType,
            status: docData.status || "",
          };
        });

        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Buyer / Donor</TableHead>
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
                {loading ? "Loading transactions..." : "No transactions found matching the criteria."}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TableRow>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.farmerName || "N/A"}</TableCell>

                  {/* Show Buyer or Donor name depending on the transaction type */}
                  <TableCell>
                    {transaction.transactionType === "purchase"
                      ? transaction.buyerName || "N/A"
                      : transaction.donorName || "N/A"}
                  </TableCell>

                  <TableCell>{transaction.crop || "N/A"}</TableCell>
                  <TableCell>{transaction.quantity ?? "N/A"}</TableCell>
                  <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-admin-secondary/5 capitalize">
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                </TableRow>

                {/* Expandable details */}
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={transaction.id} className="border-0">
                        <AccordionTrigger className="py-2 px-4 text-sm text-admin-textSecondary">
                          View Details
                        </AccordionTrigger>
                        <AccordionContent>
                        <TransactionDetails
  transactionId={transaction.id}
  buyerId={transaction.buyerId}
  donorId={transaction.donorId}
/>

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
