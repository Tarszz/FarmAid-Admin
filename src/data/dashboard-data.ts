
// Sample data for the dashboard
export const chartData = [
  { name: 'Jan', transactions: 400, donations: 240 },
  { name: 'Feb', transactions: 300, donations: 198 },
  { name: 'Mar', transactions: 520, donations: 308 },
  { name: 'Apr', transactions: 278, donations: 401 },
  { name: 'May', transactions: 189, donations: 290 },
  { name: 'Jun', transactions: 239, donations: 330 },
  { name: 'Jul', transactions: 349, donations: 430 },
  { name: 'Aug', transactions: 568, donations: 355 },
  { name: 'Sep', transactions: 640, donations: 489 },
  { name: 'Oct', transactions: 540, donations: 350 },
  { name: 'Nov', transactions: 420, donations: 320 },
  { name: 'Dec', transactions: 700, donations: 550 },
];

export const pendingApprovals = [
  { id: 1, name: 'Rivera Family Farm', type: 'Farmer', dateApplied: '2023-10-15', status: 'pending' },
  { id: 2, name: 'GreenLeaf Organics', type: 'Supplier', dateApplied: '2023-10-14', status: 'review' },
  { id: 3, name: 'Community Food Bank', type: 'Recipient', dateApplied: '2023-10-13', status: 'pending' },
  { id: 4, name: 'Fresh Harvest Co-op', type: 'Market', dateApplied: '2023-10-12', status: 'review' },
];

// Sample User Data
export const userData = [
  { id: 'u1', name: 'Juan Dela Cruz', email: 'juan@farmaid.gov', role: 'Admin', status: 'Active', lastLogin: '2023-10-20T08:30:00' },
  { id: 'u2', name: 'Maria Santos', email: 'maria@farmaid.gov', role: 'Moderator', status: 'Active', lastLogin: '2023-10-19T14:45:00' },
  { id: 'u3', name: 'Pedro Reyes', email: 'pedro@gmail.com', role: 'Farmer', status: 'Pending', lastLogin: '2023-10-18T09:15:00' },
  { id: 'u4', name: 'Ana Manalo', email: 'ana@organicfarms.com', role: 'Farmer', status: 'Active', lastLogin: '2023-10-17T11:20:00' },
  { id: 'u5', name: 'Roberto Luna', email: 'roberto@communityfood.org', role: 'Recipient', status: 'Active', lastLogin: '2023-10-16T16:10:00' },
  { id: 'u6', name: 'Sofia Cruz', email: 'sofia@greenleaf.com', role: 'Supplier', status: 'Inactive', lastLogin: '2023-10-15T10:30:00' },
  { id: 'u7', name: 'Antonio Mendoza', email: 'antonio@market.com', role: 'Market', status: 'Active', lastLogin: '2023-10-14T13:45:00' },
  { id: 'u8', name: 'Elena Torres', email: 'elena@farmaid.gov', role: 'Admin', status: 'Active', lastLogin: '2023-10-13T09:00:00' },
];

// Sample Transaction Data
export const transactionData = [
  { 
    id: 'tr001', 
    farmerName: 'Rivera Family Farm', 
    buyerName: 'Central Market', 
    crop: 'Rice', 
    quantity: '500 kg', 
    amount: 25000, 
    transactionType: 'Sold to Market', 
    status: 'Completed', 
    date: '2023-10-15',
    marketName: 'Central Market',
    priceBreakdown: {
      basePrice: 23500,
      taxes: 500,
      delivery: 1000,
      total: 25000
    },
    deliveryDetails: {
      address: '123 Market St, Manila',
      courier: 'FarmExpress',
      trackingNumber: 'FE123456789',
      estimatedDelivery: '2023-10-16'
    },
    proofOfDelivery: '/placeholder.svg'
  },
  { 
    id: 'tr002', 
    farmerName: 'GreenLeaf Organics', 
    buyerName: 'Community Food Bank', 
    crop: 'Vegetables', 
    quantity: '200 kg', 
    amount: 0, 
    transactionType: 'Donation', 
    status: 'Completed', 
    date: '2023-10-14',
    recipientOrganization: 'Community Food Bank',
    deliveryDetails: {
      address: '456 Charity Rd, Quezon City',
      courier: 'FarmExpress',
      trackingNumber: 'FE987654321',
      estimatedDelivery: '2023-10-15'
    },
    proofOfDelivery: '/placeholder.svg'
  },
  { 
    id: 'tr003', 
    farmerName: 'Mendoza Farms', 
    buyerName: 'South Market', 
    crop: 'Corn', 
    quantity: '300 kg', 
    amount: 15000, 
    transactionType: 'Sold to Market', 
    status: 'Pending', 
    date: '2023-10-13',
    marketName: 'South Market',
    priceBreakdown: {
      basePrice: 13500,
      taxes: 500,
      delivery: 1000,
      total: 15000
    },
    deliveryDetails: {
      address: '789 South St, Makati',
      courier: 'FarmExpress',
      trackingNumber: 'FE456789123',
      estimatedDelivery: '2023-10-14'
    }
  },
  { 
    id: 'tr004', 
    farmerName: 'Rodriguez Cooperative', 
    buyerName: 'East Market', 
    crop: 'Fruits', 
    quantity: '150 kg', 
    amount: 9000, 
    transactionType: 'Sold to Market', 
    status: 'Completed', 
    date: '2023-10-12',
    marketName: 'East Market',
    priceBreakdown: {
      basePrice: 7500,
      taxes: 500,
      delivery: 1000,
      total: 9000
    },
    deliveryDetails: {
      address: '321 East Ave, Pasig',
      courier: 'FarmExpress',
      trackingNumber: 'FE789123456',
      estimatedDelivery: '2023-10-13'
    },
    proofOfDelivery: '/placeholder.svg'
  },
  { 
    id: 'tr005', 
    farmerName: 'Santos Agriculture', 
    buyerName: 'North Hospital', 
    crop: 'Vegetables', 
    quantity: '100 kg', 
    amount: 0, 
    transactionType: 'Donation', 
    status: 'Pending', 
    date: '2023-10-11',
    recipientOrganization: 'North Hospital',
    deliveryDetails: {
      address: '654 Hospital Blvd, Manila',
      courier: 'FarmExpress',
      trackingNumber: 'FE321654987',
      estimatedDelivery: '2023-10-12'
    }
  }
];

// Sample Donation Data
export const donationData = [
  { 
    id: 'd001', 
    farmerName: 'GreenLeaf Organics', 
    recipientName: 'Community Food Bank', 
    items: 'Mixed Vegetables', 
    quantity: '200 kg', 
    value: 10000, 
    status: 'Delivered', 
    date: '2023-10-14',
    deliveryDetails: {
      address: '456 Charity Rd, Quezon City',
      courier: 'FarmExpress',
      trackingNumber: 'FE987654321',
      deliveredOn: '2023-10-15'
    },
    proofOfDelivery: '/placeholder.svg',
    impactMetrics: {
      familiesHelped: 40,
      mealsProvided: 600
    }
  },
  { 
    id: 'd002', 
    farmerName: 'Santos Agriculture', 
    recipientName: 'North Hospital', 
    items: 'Fresh Vegetables', 
    quantity: '100 kg', 
    value: 5000, 
    status: 'In Transit', 
    date: '2023-10-11',
    deliveryDetails: {
      address: '654 Hospital Blvd, Manila',
      courier: 'FarmExpress',
      trackingNumber: 'FE321654987',
      estimatedDelivery: '2023-10-12'
    },
    impactMetrics: {
      patientsHelped: 100,
      mealsProvided: 300
    }
  },
  { 
    id: 'd003', 
    farmerName: 'Rivera Family Farm', 
    recipientName: 'East Orphanage', 
    items: 'Rice and Vegetables', 
    quantity: '150 kg', 
    value: 7500, 
    status: 'Delivered', 
    date: '2023-10-05',
    deliveryDetails: {
      address: '123 Care St, Pasig',
      courier: 'FarmExpress',
      trackingNumber: 'FE123987456',
      deliveredOn: '2023-10-06'
    },
    proofOfDelivery: '/placeholder.svg',
    impactMetrics: {
      childrenHelped: 50,
      mealsProvided: 450
    }
  },
  { 
    id: 'd004', 
    farmerName: 'Rodriguez Cooperative', 
    recipientName: 'South Shelter', 
    items: 'Fruits and Vegetables', 
    quantity: '120 kg', 
    value: 6000, 
    status: 'Scheduled', 
    date: '2023-10-18',
    deliveryDetails: {
      address: '789 Shelter Ave, Makati',
      courier: 'FarmExpress',
      trackingNumber: 'FE456123789',
      estimatedDelivery: '2023-10-19'
    },
    impactMetrics: {
      peopleHelped: 60,
      mealsProvided: 360
    }
  }
];

// Sample Delivery Data
export const deliveryData = [
  { 
    id: 'del001', 
    transactionId: 'tr001', 
    origin: 'Rivera Family Farm', 
    destination: 'Central Market', 
    items: 'Rice', 
    quantity: '500 kg', 
    status: 'Delivered', 
    courier: 'FarmExpress',
    trackingNumber: 'FE123456789',
    scheduledDate: '2023-10-15',
    estimatedDelivery: '2023-10-16',
    actualDelivery: '2023-10-16',
    address: '123 Market St, Manila',
    contactPerson: 'Miguel Santos',
    contactNumber: '+63 912 345 6789',
    notes: 'Leave at loading dock',
    proofOfDelivery: '/placeholder.svg'
  },
  { 
    id: 'del002', 
    transactionId: 'tr002', 
    origin: 'GreenLeaf Organics', 
    destination: 'Community Food Bank', 
    items: 'Vegetables', 
    quantity: '200 kg', 
    status: 'Delivered', 
    courier: 'FarmExpress',
    trackingNumber: 'FE987654321',
    scheduledDate: '2023-10-14',
    estimatedDelivery: '2023-10-15',
    actualDelivery: '2023-10-15',
    address: '456 Charity Rd, Quezon City',
    contactPerson: 'Rosa Reyes',
    contactNumber: '+63 923 456 7891',
    notes: 'Donation - priority delivery',
    proofOfDelivery: '/placeholder.svg'
  },
  { 
    id: 'del003', 
    transactionId: 'tr003', 
    origin: 'Mendoza Farms', 
    destination: 'South Market', 
    items: 'Corn', 
    quantity: '300 kg', 
    status: 'In Transit', 
    courier: 'FarmExpress',
    trackingNumber: 'FE456789123',
    scheduledDate: '2023-10-13',
    estimatedDelivery: '2023-10-14',
    address: '789 South St, Makati',
    contactPerson: 'Carlos Tan',
    contactNumber: '+63 934 567 8912',
    notes: 'Call before delivery'
  },
  { 
    id: 'del004', 
    transactionId: 'tr005', 
    origin: 'Santos Agriculture', 
    destination: 'North Hospital', 
    items: 'Vegetables', 
    quantity: '100 kg', 
    status: 'Scheduled', 
    courier: 'FarmExpress',
    trackingNumber: 'FE321654987',
    scheduledDate: '2023-10-11',
    estimatedDelivery: '2023-10-12',
    address: '654 Hospital Blvd, Manila',
    contactPerson: 'Dr. Ana Cruz',
    contactNumber: '+63 945 678 9123',
    notes: 'Donation for hospital kitchen - deliver to loading area B'
  }
];

// Sample Security Settings
export const securitySettings = {
  general: {
    twoFactorAuthentication: false,
    sessionTimeout: 30, // minutes
    lastPasswordChange: '2023-09-15',
    passwordExpiry: 90, // days
    requiredPasswordStrength: 'Medium',
    accountLockoutThreshold: 5, // failed attempts
    accountLockoutDuration: 15, // minutes
  },
  permissions: {
    roles: [
      { id: 1, name: 'Admin', description: 'Full system access', usersCount: 3 },
      { id: 2, name: 'Moderator', description: 'Can manage content but not users or settings', usersCount: 5 },
      { id: 3, name: 'Farmer', description: 'Can manage own transactions and donations', usersCount: 42 },
      { id: 4, name: 'Recipient', description: 'Can view donations and delivery details', usersCount: 18 },
      { id: 5, name: 'Market', description: 'Can manage purchases from farmers', usersCount: 12 },
      { id: 6, name: 'Supplier', description: 'Can manage product listings', usersCount: 8 }
    ],
    modules: [
      { id: 1, name: 'Dashboard', requiredRole: 'All' },
      { id: 2, name: 'Users Management', requiredRole: 'Admin' },
      { id: 3, name: 'Transactions', requiredRole: 'Admin, Moderator, Farmer, Market' },
      { id: 4, name: 'Donations', requiredRole: 'Admin, Moderator, Farmer, Recipient' },
      { id: 5, name: 'Deliveries', requiredRole: 'Admin, Moderator, Farmer, Recipient, Market' },
      { id: 6, name: 'Approvals', requiredRole: 'Admin' },
      { id: 7, name: 'Notifications', requiredRole: 'All' },
      { id: 8, name: 'Broadcasts', requiredRole: 'Admin, Moderator' },
      { id: 9, name: 'Reports', requiredRole: 'Admin, Moderator' },
      { id: 10, name: 'Settings', requiredRole: 'Admin' }
    ]
  },
  activity: {
    loginHistory: [
      { id: 1, user: 'Juan Dela Cruz', ip: '192.168.1.1', device: 'Windows/Chrome', timestamp: '2023-10-20T08:30:00', status: 'Success' },
      { id: 2, user: 'Maria Santos', ip: '192.168.1.2', device: 'MacOS/Safari', timestamp: '2023-10-19T14:45:00', status: 'Success' },
      { id: 3, user: 'Unknown', ip: '192.168.1.3', device: 'Windows/Firefox', timestamp: '2023-10-19T10:15:00', status: 'Failed' },
      { id: 4, user: 'Elena Torres', ip: '192.168.1.4', device: 'Android/Chrome', timestamp: '2023-10-18T09:20:00', status: 'Success' },
      { id: 5, user: 'Pedro Reyes', ip: '192.168.1.5', device: 'iOS/Safari', timestamp: '2023-10-18T09:15:00', status: 'Success' }
    ],
    dataAccess: [
      { id: 1, user: 'Juan Dela Cruz', action: 'Export Users', timestamp: '2023-10-20T09:15:00', details: 'Exported all users data to CSV' },
      { id: 2, user: 'Maria Santos', action: 'View Sensitive Information', timestamp: '2023-10-19T15:30:00', details: 'Accessed transaction details for ID tr001' },
      { id: 3, user: 'Elena Torres', action: 'Change Password', timestamp: '2023-10-18T10:45:00', details: 'Changed password for user Roberto Luna' }
    ]
  }
};

// Sample Notifications Data
export const notificationsData = [
  { 
    id: 'n001', 
    title: 'New Farmer Registration', 
    content: 'Pedro Reyes has registered as a new farmer', 
    timestamp: '2023-10-18T09:15:00',
    type: 'User',
    isRead: false,
    actionRequired: true,
    actionLink: '/approvals',
    actionText: 'Review Application'
  },
  { 
    id: 'n002', 
    title: 'Donation Delivered', 
    content: 'Donation to Community Food Bank has been delivered successfully', 
    timestamp: '2023-10-15T14:30:00',
    type: 'Donation',
    isRead: true,
    actionRequired: false,
    actionLink: '/donations/d001',
    actionText: 'View Details'
  },
  { 
    id: 'n003', 
    title: 'System Maintenance', 
    content: 'System will be under maintenance on October 25, 2023 from 1AM to 3AM', 
    timestamp: '2023-10-15T10:00:00',
    type: 'System',
    isRead: false,
    actionRequired: false
  },
  { 
    id: 'n004', 
    title: 'New Transaction', 
    content: 'Mendoza Farms has initiated a new transaction with South Market', 
    timestamp: '2023-10-13T11:45:00',
    type: 'Transaction',
    isRead: true,
    actionRequired: false,
    actionLink: '/transactions/tr003',
    actionText: 'View Transaction'
  },
  { 
    id: 'n005', 
    title: 'Delivery Delayed', 
    content: 'Delivery to North Hospital is delayed due to transportation issues', 
    timestamp: '2023-10-12T16:30:00',
    type: 'Delivery',
    isRead: false,
    actionRequired: true,
    actionLink: '/deliveries/del004',
    actionText: 'Manage Delivery'
  }
];

// Sample Broadcast Messages
export const broadcastsData = [
  {
    id: 'b001',
    title: 'New Donation Program',
    content: 'We are launching a new donation program for underserved communities. All farmers are encouraged to participate.',
    recipients: 'All Users',
    sentBy: 'Juan Dela Cruz',
    sentAt: '2023-10-15T09:00:00',
    status: 'Sent',
    readCount: 78,
    totalRecipients: 86
  },
  {
    id: 'b002',
    title: 'System Maintenance Alert',
    content: 'The system will be undergoing maintenance on October 25, 2023, from 1AM to 3AM. Please complete any ongoing work before this time.',
    recipients: 'All Users',
    sentBy: 'Elena Torres',
    sentAt: '2023-10-15T10:00:00',
    status: 'Sent',
    readCount: 65,
    totalRecipients: 86
  },
  {
    id: 'b003',
    title: 'New Price Guidelines',
    content: 'Updated price guidelines for all agricultural products have been released. Please review the new pricing structure.',
    recipients: 'Farmers, Markets',
    sentBy: 'Maria Santos',
    sentAt: '2023-10-10T14:30:00',
    status: 'Sent',
    readCount: 42,
    totalRecipients: 54
  },
  {
    id: 'b004',
    title: 'Annual Farmer Survey',
    content: 'Please participate in our annual farmer survey to help us improve our services.',
    recipients: 'Farmers',
    sentBy: 'Juan Dela Cruz',
    status: 'Draft',
    lastEdited: '2023-10-18T11:20:00'
  }
];

// Sample Collaboration Data
export const collaborationsData = [
  {
    id: 'c001',
    recipientOrg: 'Community Food Bank',
    contactPerson: 'Rosa Reyes',
    contactEmail: 'rosa@communityfood.org',
    contactPhone: '+63 923 456 7891',
    status: 'Active',
    startDate: '2023-05-15',
    needsAssessment: {
      foodTypes: ['Rice', 'Vegetables', 'Fruits', 'Canned Goods'],
      weeklyVolume: '500 kg',
      beneficiaries: 'Low-income families in Quezon City',
      beneficiaryCount: 120,
      specialRequirements: 'Need fresh produce for nutrition program'
    },
    donationHistory: [
      { id: 'd001', date: '2023-10-14', items: 'Mixed Vegetables', quantity: '200 kg', value: 10000 },
      { id: 'd003', date: '2023-09-20', items: 'Rice and Fruits', quantity: '250 kg', value: 12500 }
    ],
    impactMetrics: {
      familiesHelped: 120,
      mealsProvided: 3600,
      nutritionalImprovement: 'Significant increase in fresh produce consumption'
    },
    upcomingDeliveries: [
      { id: 'd004', scheduledDate: '2023-10-30', items: 'Rice and Vegetables', quantity: '300 kg' }
    ]
  },
  {
    id: 'c002',
    recipientOrg: 'North Hospital',
    contactPerson: 'Dr. Ana Cruz',
    contactEmail: 'ana.cruz@northhospital.ph',
    contactPhone: '+63 945 678 9123',
    status: 'Active',
    startDate: '2023-06-10',
    needsAssessment: {
      foodTypes: ['Vegetables', 'Fruits'],
      weeklyVolume: '150 kg',
      beneficiaries: 'Hospital patients and staff',
      beneficiaryCount: 200,
      specialRequirements: 'Organic produce preferred for patient meals'
    },
    donationHistory: [
      { id: 'd002', date: '2023-10-11', items: 'Fresh Vegetables', quantity: '100 kg', value: 5000 },
      { id: 'd005', date: '2023-09-15', items: 'Fruits', quantity: '100 kg', value: 6000 }
    ],
    impactMetrics: {
      patientsHelped: 250,
      mealsProvided: 2000,
      nutritionalImprovement: 'Better quality meals for patients'
    },
    upcomingDeliveries: [
      { id: 'd006', scheduledDate: '2023-10-25', items: 'Vegetables', quantity: '100 kg' }
    ]
  },
  {
    id: 'c003',
    recipientOrg: 'East Orphanage',
    contactPerson: 'Manuel Dizon',
    contactEmail: 'manuel@eastorphanage.org',
    contactPhone: '+63 912 345 8765',
    status: 'Active',
    startDate: '2023-07-20',
    needsAssessment: {
      foodTypes: ['Rice', 'Vegetables', 'Fruits', 'Meat', 'Milk'],
      weeklyVolume: '200 kg',
      beneficiaries: 'Children aged 5-15',
      beneficiaryCount: 50,
      specialRequirements: 'Need balanced diet components for growing children'
    },
    donationHistory: [
      { id: 'd003', date: '2023-10-05', items: 'Rice and Vegetables', quantity: '150 kg', value: 7500 },
      { id: 'd007', date: '2023-09-10', items: 'Fruits and Milk', quantity: '100 kg', value: 8000 }
    ],
    impactMetrics: {
      childrenHelped: 50,
      mealsProvided: 1500,
      nutritionalImprovement: 'Improved overall nutrition for children'
    },
    upcomingDeliveries: [
      { id: 'd008', scheduledDate: '2023-11-05', items: 'Mixed Nutritional Package', quantity: '200 kg' }
    ]
  },
  {
    id: 'c004',
    recipientOrg: 'South Shelter',
    contactPerson: 'Lucia Bautista',
    contactEmail: 'lucia@southshelter.org',
    contactPhone: '+63 934 567 1234',
    status: 'Pending',
    requestDate: '2023-10-10',
    needsAssessment: {
      foodTypes: ['Rice', 'Canned Goods', 'Vegetables'],
      weeklyVolume: '150 kg',
      beneficiaries: 'Homeless individuals in Makati',
      beneficiaryCount: 60,
      specialRequirements: 'Easy to prepare foods needed'
    },
    upcomingDeliveries: [
      { id: 'd004', scheduledDate: '2023-10-18', items: 'Fruits and Vegetables', quantity: '120 kg' }
    ]
  }
];
