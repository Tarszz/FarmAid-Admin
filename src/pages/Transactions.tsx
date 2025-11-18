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

type Item = {
  name: string;
  weight: number;
  unit: string;
  sellerId?: string;
  price: number;
};

type Transaction = {
  id: string;
  buyerDonorName: string;
  farmerName: string;
  items: {
    name: string;
    weight: number;
    unit: string;
    sellerName: string;
    price: number;
  }[];
  transactionType: "Donation" | "Purchase";
  status: "Completed" | "Pending" ;
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

          const buyerId: string | undefined = data.buyerId;
          const donorId: string | undefined = data.donorId;

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

          const itemsArray: Item[] = data.items || [];

          const items = await Promise.all(
            itemsArray.map(async (item) => {
              let sellerName = "Unknown Seller";
              if (item.sellerId) {
                const sellerDoc = await getDoc(doc(db, "users", item.sellerId));
                if (sellerDoc.exists()) {
                  const sellerData = sellerDoc.data();
                  sellerName = `${sellerData.firstname || ""} ${sellerData.lastname || ""}`.trim();
                }
              }

              return {
                name: item.name || "N/A",
                weight: parseFloat(item.weight as unknown as string) || 0,
                unit: item.unit || "",
                price: parseFloat(item.price as unknown as string) || 0,
                sellerName,
              };
            })
          );

          return {
            id: docSnap.id,
            buyerDonorName,
            farmerName: data.farmerName || "N/A",
            items,
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
      transactions.flatMap((tx) => tx.items.map((item) => item.sellerName))
    )
  );

  const filteredTransactions = transactions.filter((tx) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(search) ||
      tx.buyerDonorName.toLowerCase().includes(search) ||
      tx.farmerName.toLowerCase().includes(search) ||
      tx.items.some((item) => item.sellerName.toLowerCase().includes(search));

    const matchesType = !filterType || tx.transactionType === filterType;
    const matchesStatus = !filterStatus || tx.status === filterStatus;
    const matchesSeller =
      !filterSeller || tx.items.some((item) => item.sellerName === filterSeller);

    return matchesSearch && matchesType && matchesStatus && matchesSeller;
  });

  const formatDate = (timestamp: Timestamp | null) => {
    if (timestamp?.toDate) {
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
          {/* Filter: Type */}
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

          {/* Filter: Status */}
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
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Buyer/Donor</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
                    {tx.items.map((item, i) => (
                      <div key={i}>{item.sellerName}</div>
                    ))}
                  </TableCell>
                  <TableCell>{tx.buyerDonorName}</TableCell>
                  <TableCell>
                    {tx.items.map((item, i) => (
                      <div key={i}>{item.name}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {tx.items.map((item, i) => (
                      <div key={i}>
                        {item.weight} {item.unit}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {tx.items.map((item, i) => (
                      <div key={i}>{formatAmount(item.price)}</div>
                    ))}
                  </TableCell>
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
