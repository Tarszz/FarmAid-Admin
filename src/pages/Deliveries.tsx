
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { useFirestoreQuery } from '@/hooks/useFirestoreQuery';
import DeliverySearch from '@/components/deliveries/DeliverySearch';
import DeliveryTable from '@/components/deliveries/DeliveryTable';
import DeliveryDetails from '@/components/deliveries/DeliveryDetails';
import { Delivery } from '@/types/delivery';

const Deliveries = () => {
  const { data: deliveries, loading } = useFirestoreQuery('deliveries');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredDeliveries = deliveries.filter((delivery: Delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.courier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !filterStatus || delivery.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const viewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDetailsOpen(true);
  };

  return (
    <PageContainer title="Deliveries" subtitle="Track ongoing and completed deliveries" loading={loading}>
      <DeliverySearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      
      <DeliveryTable
        deliveries={filteredDeliveries}
        loading={loading}
        onRowClick={viewDetails}
      />
      
      <DeliveryDetails
        delivery={selectedDelivery}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </PageContainer>
  );
};

export default Deliveries;
