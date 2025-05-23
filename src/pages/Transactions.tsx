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
import { Link } from 'react-router-dom';


type Transaction = {
  id: string;
  buyerDonorName: string;
  sellerNames: { name: string; id: string }[];
  farmerName: string;
  crops: string[];
  weight: number;
  unit: string;
  amount: number;
  transactionType: "Donation" | "Purchase";
  status: "Completed" | "Pending" | "Failed";
  timestamp: Timestamp | null;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSeller, setFilterSeller] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const txSnapshot = await getDocs(collection(db, "transactions"));

        const txDataPromises = txSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

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

          const itemsArray = data.items || [];
          const cropNames = itemsArray.map((item: any) => item.name || "N/A");

          const totalAmount = itemsArray.reduce((sum: number, item: any) => {
            const price = parseFloat(item.price);
            return sum + (isNaN(price) ? 0 : price);
          }, 0);

          const totalWeight = itemsArray.reduce((sum: number, item: any) => {
            const weight = parseFloat(item.weight);
            return sum + (isNaN(weight) ? 0 : weight);
          }, 0);

          const unit = itemsArray.length > 0 ? itemsArray[0].unit || "" : "";

          let sellerIds: string[] = [];

          if (itemsArray.length > 0) {
            sellerIds = Array.from(
              new Set(
                itemsArray
                  .map((item: any) => item.sellerId)
                  .filter((id: any) => typeof id === "string")
              )
            );
          }

          if (
            sellerIds.length === 0 &&
            data.transactionType &&
            data.transactionType.toLowerCase() === "sale" &&
            typeof data.sellerId === "string"
          ) {
            sellerIds = [data.sellerId];
          }

          const sellerNames = await Promise.all(
            sellerIds.map(async (id) => {
              const sellerDoc = await getDoc(doc(db, "users", id));
              if (sellerDoc.exists()) {
                const sellerData = sellerDoc.data();
                const name = `${sellerData.firstname || ""} ${sellerData.lastname || ""}`.trim();
                return { name, id };
              }
              return { name: "Unknown Seller", id };
            })
          );

          return {
            id: docSnap.id,
            buyerDonorName,
            sellerNames,
            farmerName: data.farmerName || "N/A",
            crops: cropNames,
            weight: totalWeight,
            unit,
            amount: totalAmount,
            transactionType:
              data.transactionType?.toLowerCase() === "donation"
                ? "Donation"
                : "Purchase",
            status: data.status || "Pending",
            timestamp: data.timestamp || null,
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

  const sellerFilterOptions = Array.from(
    new Set(
      transactions.flatMap((tx) => tx.sellerNames.map((s) => s.name))
    )
  );

  const filteredTransactions = transactions.filter((tx) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(search) ||
      tx.buyerDonorName.toLowerCase().includes(search) ||
      tx.farmerName.toLowerCase().includes(search) ||
      tx.sellerNames.some((s) => s.name.toLowerCase().includes(search));

    const matchesType = !filterType || tx.transactionType === filterType;
    const matchesStatus = !filterStatus || tx.status === filterStatus;
    const matchesSeller =
      !filterSeller || tx.sellerNames.some((s) => s.name === filterSeller);

    return matchesSearch && matchesType && matchesStatus && matchesSeller;
  });

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
            placeholder="Search by user, seller, or transaction ID..."
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
                {filterType ? `Type: ${filterType}` : "Type"}
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
                {filterStatus ? `Status: ${filterStatus}` : "Status"}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                {filterSeller ? `Seller: ${filterSeller}` : "Seller"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterSeller(null)}>
                All Sellers
              </DropdownMenuItem>
              {sellerFilterOptions.map((name) => (
                <DropdownMenuItem key={name} onClick={() => setFilterSeller(name)}>
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Transaction ID</TableHead>
              <TableHead className="text-left">Seller</TableHead>
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
        <TableCell>
          {tx.sellerNames.map((seller, i) => (
            <div key={i}>
              {seller.name}
            </div>
          ))}
        </TableCell>
        <TableCell>{tx.buyerDonorName}</TableCell>
        <TableCell>
          {tx.crops.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {tx.crops.map((cropName, index) => (
                <span key={index}>{cropName}</span>
              ))}
            </div>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          {tx.weight} {tx.unit}
        </TableCell>
        <TableCell>{formatAmount(tx.amount)}</TableCell>
        <TableCell>{tx.transactionType}</TableCell>
        <TableCell>{tx.status}</TableCell>
        <TableCell>{formatDate(tx.timestamp)}</TableCell>
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
