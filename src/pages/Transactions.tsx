"use client";

import React, { useEffect, useState } from "react";
import PageContainer from "@/components/dashboard/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Filter } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Transaction = {
  id: string;
  buyerDonorName: string;
  farmerName: string;
  crop: string;
  quantity: number;
  unit: string;
  amount: number;
  transactionType: "Donation" | "Purchase";
  status: "Completed" | "Pending" | "Failed";
  date: Timestamp | null;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const txSnapshot = await getDocs(collection(db, "transactions"));

        const txDataPromises = txSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          // Fetch Buyer or Donor name from 'users' collection based on buyerId or donorId
          let buyerDonorName = "N/A";
          const buyerId = data.buyerId;
          const donorId = data.donorId;

          if (buyerId) {
            const buyerDoc = await getDoc(doc(db, "users", buyerId));
            if (buyerDoc.exists()) {
              const buyerData = buyerDoc.data();
              buyerDonorName = `${buyerData.firstname || ""} ${buyerData.lastname || ""}`.trim();
            }
          } else if (donorId) {
            const donorDoc = await getDoc(doc(db, "users", donorId));
            if (donorDoc.exists()) {
              const donorData = donorDoc.data();
              buyerDonorName = `${donorData.firstname || ""} ${donorData.lastname || ""}`.trim();
            }
          }

          return {
            id: docSnap.id,
            buyerDonorName,
            farmerName: data.farmerName || "N/A",
            crop: data.item || "N/A",
            quantity: data.quantity || 0,
            unit: data.unit || "",
            amount: data.totalAmount || 0,
            transactionType:
              data.transactionType === "donation"
                ? "Donation"
                : "Purchase",
            status: data.status || "Pending",
            date: data.date || null,
          } as Transaction;
        });

        const txData = await Promise.all(txDataPromises);

        setTransactions(txData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filtering & Searching
  const filteredTransactions = transactions.filter((tx) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      tx.id.toLowerCase().includes(search) ||
      tx.buyerDonorName.toLowerCase().includes(search) ||
      tx.farmerName.toLowerCase().includes(search);

    const matchesType = !filterType || tx.transactionType === filterType;
    const matchesStatus = !filterStatus || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionTypeFilterText = () => {
    if (filterType) return `Type: ${filterType}`;
    return "Type";
  };

  const getStatusFilterText = () => {
    if (filterStatus) return `Status: ${filterStatus}`;
    return "Status";
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }
    return "N/A";
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  };

  return (
    <PageContainer
      title="Transactions"
      subtitle="View and manage user transactions"
      loading={loading}
    >
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
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("Donation")}>
                Donation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("Purchase")}>
                Purchase
              </DropdownMenuItem>
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
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Transaction ID</TableHead>
              {/*<TableHead className="text-left">Farmer</TableHead>*/}
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
                <TableCell colSpan={9} className="text-center py-8 text-admin-textSecondary">
                  {loading
                    ? "Loading transactions..."
                    : "No transactions found matching the criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  {/*<TableCell>{tx.farmerName}</TableCell>*/}
                  <TableCell>{tx.buyerDonorName}</TableCell>
                  <TableCell>{tx.crop}</TableCell>
                  <TableCell>
                    {tx.quantity} {tx.unit}
                  </TableCell>
                  <TableCell>{formatAmount(tx.amount)}</TableCell>
                  <TableCell>{tx.transactionType}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{formatDate(tx.date)}</TableCell>
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
