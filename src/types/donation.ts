
export type Donation = {
  id: string;
  donorName: string;
  crop: string;
  quantity: string;
  recipientOrganization: string;
  date: string;
  timeReceived: string;
  confirmationImage?: string;
  deliveryDetails?: {
    address: string;
    date: string;
    courier: string;
    contactPerson: string;
    contactNumber: string;
  };
};
