"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Your Firestore instance
import { formatCurrency } from "@/types/transaction";

interface TransactionDetailsProps {
  transactionId: string;
  buyerId?: string;
  donorId?: string;
}

interface User {
  firstname: string;
  lastname: string;
}

interface TransactionData {
  item: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: string;
  transactionType: string;
  date: any; // Timestamp from Firestore
  buyerId?: string;
  donorId?: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionId,
  buyerId,
  donorId,
}) => {
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionAndUser = async () => {
      setLoading(true);
      try {
        // Fetch transaction document
        const transactionDoc = await getDoc(doc(db, "transactions", transactionId));

        if (!transactionDoc.exists()) {
          console.error("Transaction not found");
          setTransaction(null);
          setUser(null);
          setLoading(false);
          return;
        }

        const txnData = transactionDoc.data() as TransactionData;

        setTransaction(txnData);

        // Determine user ID (buyerId or donorId)
        const userId = buyerId || donorId || txnData.buyerId || txnData.donorId;

        if (!userId) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user document from users collection
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching transaction or user data:", error);
        setTransaction(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionAndUser();
  }, [transactionId, buyerId, donorId]);

  if (loading) {
    return <p>Loading details...</p>;
  }

  if (!transaction) {
    return <p>No details available for this transaction.</p>;
  }

  return (
    <div className="p-4 space-y-2">
      <p><strong>Transaction ID:</strong> {transactionId}</p>
      <p>
        <strong>Buyer / Donor:</strong>{" "}
        {user ? `${user.firstname} ${user.lastname}` : "N/A"}
      </p>
      <p><strong>Crop:</strong> {transaction.item || "N/A"}</p>
      <p>
        <strong>Quantity:</strong> {transaction.quantity ?? "N/A"} {transaction.unit || ""}
      </p>
      <p><strong>Amount:</strong> {formatCurrency(transaction.totalAmount)}</p>
      <p><strong>Status:</strong> {transaction.status || "N/A"}</p>
      <p><strong>Type:</strong> {transaction.transactionType || "N/A"}</p>
      <p>
        <strong>Date:</strong>{" "}
        {transaction.date?.toDate
          ? transaction.date.toDate().toLocaleString()
          : transaction.date
          ? new Date(transaction.date).toLocaleString()
          : "N/A"}
      </p>
    </div>
  );
};

export default TransactionDetails;
