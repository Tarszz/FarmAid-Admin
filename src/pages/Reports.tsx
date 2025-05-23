
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Printer, Calendar, Filter } from 'lucide-react';

// Sample donation data
const donationData = [
  { month: 'Jan', rice: 250, corn: 150, vegetables: 320 },
  { month: 'Feb', rice: 300, corn: 180, vegetables: 270 },
  { month: 'Mar', rice: 280, corn: 200, vegetables: 290 },
  { month: 'Apr', rice: 320, corn: 210, vegetables: 340 },
  { month: 'May', rice: 350, corn: 220, vegetables: 380 },
  { month: 'Jun', rice: 400, corn: 250, vegetables: 420 },
];

// Sample purchase data
const purchaseData = [
  { month: 'Jan', amount: 25000 },
  { month: 'Feb', amount: 32000 },
  { month: 'Mar', amount: 28000 },
  { month: 'Apr', amount: 35000 },
  { month: 'May', amount: 40000 },
  { month: 'Jun', amount: 45000 },
];

// Sample market trends data
const marketTrendsData = [
  { name: 'Rice', value: 45, fill: '#4ECDC4' },
  { name: 'Corn', value: 25, fill: '#FF6B6B' },
  { name: 'Vegetables', value: 20, fill: '#C7F464' },
  { name: 'Fruits', value: 10, fill: '#556270' },
];

// Sample recipient data
const recipientOrganizations = [
  { id: 1, name: 'Community Food Bank', needs: 'Rice, Vegetables', region: 'Metro Manila', impact: '500 families' },
  { id: 2, name: 'Rural Aid Foundation', needs: 'Corn, Rice', region: 'Calabarzon', impact: '350 families' },
  { id: 3, name: 'Children\'s Nutrition Center', needs: 'Vegetables, Fruits', region: 'Central Luzon', impact: '200 children' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('donations');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(value);
  };

  return (
    <PageContainer title="Reports" subtitle="Generate and analyze system-wide reports">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 months
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="donations" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="donations">Crop Donations</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crop Donations Overview</CardTitle>
              <CardDescription>
                Monthly breakdown of crop donations by type (kg)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={donationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kg`, '']} />
                    <Legend />
                    <Bar dataKey="rice" name="Rice" stackId="a" fill="#4ECDC4" />
                    <Bar dataKey="corn" name="Corn" stackId="a" fill="#FF6B6B" />
                    <Bar dataKey="vegetables" name="Vegetables" stackId="a" fill="#C7F464" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Rice Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,900 kg</div>
                <p className="text-sm text-admin-textSecondary mt-1">+15% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Corn Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,210 kg</div>
                <p className="text-sm text-admin-textSecondary mt-1">+8% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Vegetables Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,020 kg</div>
                <p className="text-sm text-admin-textSecondary mt-1">+22% from previous period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crop Purchases Overview</CardTitle>
              <CardDescription>
                Monthly breakdown of crop purchases in Pesos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={purchaseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Purchase Amount" stroke="#4ECDC4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₱205,000</div>
                <p className="text-sm text-admin-textSecondary mt-1">+18% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₱12,500</div>
                <p className="text-sm text-admin-textSecondary mt-1">+5% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Farmers Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87</div>
                <p className="text-sm text-admin-textSecondary mt-1">+12 from previous period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Crop Market Share</CardTitle>
                <CardDescription>
                  Distribution of crops in the market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketTrendsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketTrendsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recipient Organizations</CardTitle>
                <CardDescription>
                  Collaboration with recipient organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipientOrganizations.map((org) => (
                    <div key={org.id} className="border p-4 rounded-md">
                      <h3 className="font-medium">{org.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                        <div className="text-admin-textSecondary">Primary Needs:</div>
                        <div>{org.needs}</div>
                        <div className="text-admin-textSecondary">Region:</div>
                        <div>{org.region}</div>
                        <div className="text-admin-textSecondary">Impact:</div>
                        <div>{org.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Price Trends Analysis</CardTitle>
              <CardDescription>
                Monthly price changes by crop type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-admin-textSecondary mb-4">
                Market analysis shows stable prices for rice with seasonal fluctuations for vegetables.
                Corn prices have increased by 5% in the last quarter due to increased demand.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium text-lg">Rice</h3>
                  <p className="text-2xl font-bold mt-2">₱45<span className="text-sm font-normal text-admin-textSecondary">/kg</span></p>
                  <p className="text-admin-success text-sm mt-1">+2% from last month</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium text-lg">Corn</h3>
                  <p className="text-2xl font-bold mt-2">₱38<span className="text-sm font-normal text-admin-textSecondary">/kg</span></p>
                  <p className="text-admin-success text-sm mt-1">+5% from last month</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium text-lg">Vegetables</h3>
                  <p className="text-2xl font-bold mt-2">₱65<span className="text-sm font-normal text-admin-textSecondary">/kg</span></p>
                  <p className="text-admin-danger text-sm mt-1">-3% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Reports;
