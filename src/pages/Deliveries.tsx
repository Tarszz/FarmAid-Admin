import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface Delivery {
  id: string;
  courier: string;
  status: string;
  recipient: string;
  dateSent: Timestamp | null;
  dateReceived: Timestamp | null;
}

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'transactions'));
        const snapshot = await getDocs(q);

        const deliveriesData: Delivery[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const deliveryId = docSnap.id;

          let status = data.status || 'N/A';
          if (status === 'Failed') continue; // Skip failed statuses

          if (status === 'Pending') {
            status = 'In Progress';
          }

          const courier = data.courier || 'N/A';
          let recipient = 'N/A';

          if (data.transactionType === 'donation') {
            recipient = data.organization || 'N/A';
          } else if (data.buyerId) {
            const userDoc = await getDoc(doc(db, 'users', data.buyerId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              recipient = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
            }
          }

          deliveriesData.push({
            id: deliveryId,
            courier,
            status,
            recipient,
            dateSent: data.dateSent || null,
            dateReceived: data.dateReceived || null,
          });
        }

        setDeliveries(deliveriesData);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
      setLoading(false);
    };

    fetchDeliveries();
  }, []);

  const formatDate = (timestamp: Timestamp | null) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    return 'N/A';
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      delivery.id.toLowerCase().includes(term) ||
      delivery.courier.toLowerCase().includes(term) ||
      delivery.recipient.toLowerCase().includes(term) ||
      delivery.status.toLowerCase().includes(term);

    const matchesStatus = !filterStatus || delivery.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer title="Deliveries" subtitle="Track ongoing and completed deliveries" loading={loading}>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <Input
          type="search"
          placeholder="Search by Delivery ID, Courier, Recipient, or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3 w-full md:w-72"
        />
        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Delivery ID</TableHead>
              <TableHead className="text-left">Courier</TableHead>
              <TableHead className="text-left">Recipient</TableHead>
              <TableHead className="text-left">Date and Time Sent</TableHead>
              <TableHead className="text-left">Date and Time Received</TableHead>
              <TableHead className="text-left">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading deliveries...' : 'No deliveries found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>{delivery.courier}</TableCell>
                  <TableCell>{delivery.recipient}</TableCell>
                  <TableCell>{formatDate(delivery.dateSent)}</TableCell>
                  <TableCell>{formatDate(delivery.dateReceived)}</TableCell>
                  <TableCell>{delivery.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
};

export default Deliveries;
