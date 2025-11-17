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
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust to your firebase config path
import { Timestamp } from 'firebase/firestore';

interface Donation {
  id: string;
  donorName: string;
  crop: string;
  quantity: number;
  unit: string;
  recipientOrganization: string;
  timestamp: Timestamp | null;
  status: string;
}

const Donations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        // Query transactions collection where transactionType == "donation"
        const q = query(
          collection(db, 'transactions'),
          where('transactionType', '==', 'donation')
        );
        const snapshot = await getDocs(q);

        const donationsData: Donation[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const transactionId = docSnap.id;

          // Fetch donor name from users collection using buyerId
          const buyerId = data.buyerId;
          let donorName = 'Unknown Donor';
          if (buyerId) {
            const userDoc = await getDoc(doc(db, 'users', buyerId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              donorName = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
            }
          }

          donationsData.push({
            id: transactionId,
            donorName,
            crop: data.item || '',
            quantity: data.quantity || 0,
            unit: data.unit || '',
            recipientOrganization: data.organization || '',
            timestamp: data.timestamp || null,
            status: data.status || '',
          });
        }

        setDonations(donationsData);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
      setLoading(false);
    };

    fetchDonations();
  }, []);

  const formatDate = (timestamp: Timestamp | null) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    return 'N/A';
  };

  const filteredDonations = donations.filter((donation) => {
    const term = searchTerm.toLowerCase();
    return (
      donation.id.toLowerCase().includes(term) ||
      donation.donorName.toLowerCase().includes(term) ||
      donation.crop.toLowerCase().includes(term) ||
      donation.recipientOrganization.toLowerCase().includes(term) ||
      donation.status.toLowerCase().includes(term)
    );
  });

  return (
    <PageContainer title="Donations" subtitle="Track and manage all crop donations" loading={loading}>
      <div className="mb-6 w-full md:w-72 relative">
        <Input
          type="search"
          placeholder="Search by transaction ID, donor, crop, organization, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3 w-full"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Transaction ID</TableHead>
              <TableHead className="text-left">Donor Name</TableHead>
              <TableHead className="text-left">Crop</TableHead>
              <TableHead className="text-left">Quantity</TableHead>
              <TableHead className="text-left">Recipient Organization</TableHead>
              <TableHead className="text-left">Date and Time Received</TableHead>
              <TableHead className="text-left">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-admin-textSecondary">
                  {loading ? 'Loading donations...' : 'No donations found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.id}</TableCell>
                  <TableCell>{donation.donorName}</TableCell>
                  <TableCell>{donation.crop}</TableCell>
                  <TableCell>{`${donation.quantity} ${donation.unit}`}</TableCell>
                  <TableCell>{donation.recipientOrganization}</TableCell>
                  <TableCell>{formatDate(donation.timestamp)}</TableCell>
                  <TableCell>{donation.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
};

export default Donations;
