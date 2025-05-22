
// Sample data for analytics
export const sampleSalesData = [
  { month: 'Jan', value: 5400 },
  { month: 'Feb', value: 3200 },
  { month: 'Mar', value: 8900 },
  { month: 'Apr', value: 7200 },
  { month: 'May', value: 9100 },
  { month: 'Jun', value: 6500 },
];

export const sampleDonationsData = [
  { month: 'Jan', value: 1200, families: 120 },
  { month: 'Feb', value: 1800, families: 180 },
  { month: 'Mar', value: 2200, families: 220 },
  { month: 'Apr', value: 1900, families: 190 },
  { month: 'May', value: 2500, families: 250 },
  { month: 'Jun', value: 3000, families: 300 },
];

export const sampleCropData = [
  { name: 'Root crops', value: 35 },
  { name: 'Vegetables', value: 25 },
  { name: 'Spices', value: 20 },
  { name: 'Fruits', value: 15 },
];

export const sampleMetricsData = {
  totalDonations: { value: 12600, change: 24 },
  totalSales: { value: 40300, change: 18 },
  activeFarmers: { value: 842, change: 12 },
  impactedFamilies: { value: 1260, change: 24 }
};

// Export the type explicitly with export type
export type MetricsData = typeof sampleMetricsData;
