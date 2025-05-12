
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import DonationSearch from '@/components/donations/DonationSearch';
import DonationTable from '@/components/donations/DonationTable';
import DonationDetails from '@/components/donations/DonationDetails';
import { Donation } from '@/types/donation';

const Donations = () => {
  const { data: donations, loading } = useFirestoreQuery('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredDonations = (donations || [])
  .filter((donation: Donation) =>
    donation.donorName && donation.crop && donation.recipientOrganization
  )
  .filter((donation: Donation) => {
    const term = searchTerm.toLowerCase();
    return (
      donation.donorName.toLowerCase().includes(term) ||
      donation.crop.toLowerCase().includes(term) ||
      donation.recipientOrganization.toLowerCase().includes(term)
    );
  });

  const viewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setDetailsOpen(true);
  };

  return (
    <PageContainer title="Donations" subtitle="Track and manage all crop donations" loading={loading}>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <DonationSearch 
          searchTerm={searchTerm} 
          onChange={setSearchTerm} 
        />
      </div>
      
      <DonationTable 
        donations={filteredDonations} 
        loading={loading} 
        onViewDetails={viewDetails} 
      />
      
      <DonationDetails 
        donation={selectedDonation} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
    </PageContainer>
  );
};

export default Donations;
