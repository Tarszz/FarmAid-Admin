
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, BadgeCheck, Sparkles, Building, Package, Calendar as CalendarIcon, MessageSquare, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Sample organizations data
const organizations = [
  {
    id: 1,
    name: 'Community Food Bank',
    location: 'Metro Manila',
    status: 'Active',
    primaryNeeds: 'Rice, Vegetables',
    monthlyRequirement: '250 kg',
    servingCapacity: '500 families',
    lastDelivery: '2023-07-28',
    contact: {
      name: 'Maria Santos',
      position: 'Program Director',
      email: 'maria@communityfoodbank.org',
      phone: '+63 919 123 4567'
    }
  },
  {
    id: 2,
    name: 'Rural Aid Foundation',
    location: 'Calabarzon',
    status: 'Active',
    primaryNeeds: 'Corn, Rice',
    monthlyRequirement: '180 kg',
    servingCapacity: '350 families',
    lastDelivery: '2023-08-02',
    contact: {
      name: 'Juan Dela Cruz',
      position: 'Executive Director',
      email: 'juan@ruralaided.org',
      phone: '+63 917 234 5678'
    }
  },
  {
    id: 3,
    name: 'Children\'s Nutrition Center',
    location: 'Central Luzon',
    status: 'Pending',
    primaryNeeds: 'Vegetables, Fruits',
    monthlyRequirement: '120 kg',
    servingCapacity: '200 children',
    lastDelivery: 'N/A',
    contact: {
      name: 'Ana Reyes',
      position: 'Nutritionist',
      email: 'ana@childrensnutrition.org',
      phone: '+63 916 345 6789'
    }
  },
];

// Sample needs assessment data
const needsAssessments = [
  {
    id: 1,
    organization: 'Community Food Bank',
    date: '2023-07-15',
    region: 'Metro Manila',
    population: '500 families',
    findings: 'Families need more rice and vegetables. Current supplies will last 2 weeks.',
    recommendations: 'Increase rice donations by 25% and vegetables by 15%',
    status: 'Implemented'
  },
  {
    id: 2,
    organization: 'Rural Aid Foundation',
    date: '2023-07-22',
    region: 'Calabarzon',
    population: '350 families',
    findings: 'Current corn supplies are sufficient, but rice is running low. Need diversification of crops.',
    recommendations: 'Maintain corn donations and increase rice by 30%',
    status: 'In Progress'
  },
  {
    id: 3,
    organization: 'Children\'s Nutrition Center',
    date: '2023-08-05',
    region: 'Central Luzon',
    population: '200 children',
    findings: 'Children need more fruits for proper nutrition. Vegetables are adequate.',
    recommendations: 'Add fruit donations to the mix. Target 60kg of fruits per month.',
    status: 'Pending Review'
  },
];

const Collaborations = () => {
  const [activeTab, setActiveTab] = useState('organizations');
  const [selectedOrg, setSelectedOrg] = useState<null | any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { toast } = useToast();

  const handleInvite = () => {
    toast({
      title: "Invitation Sent",
      description: "The organization has been invited to collaborate.",
    });
    setIsInviteOpen(false);
  };

  const handleSaveAssessment = () => {
    toast({
      title: "Needs Assessment Saved",
      description: "The needs assessment has been recorded and will be reviewed.",
    });
    setIsNewAssessmentOpen(false);
  };

  const viewOrganizationDetails = (org: any) => {
    setSelectedOrg(org);
    setIsDetailsOpen(true);
  };

  return (
    <PageContainer title="Collaborations" subtitle="Manage partnerships with recipient organizations">
      <Tabs defaultValue="organizations" onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="needsAssessment">Needs Assessment</TabsTrigger>
            <TabsTrigger value="distribution">Distribution Planning</TabsTrigger>
          </TabsList>
          
          {activeTab === 'organizations' && (
            <Button onClick={() => setIsInviteOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Organization
            </Button>
          )}
          
          {activeTab === 'needsAssessment' && (
            <Button onClick={() => setIsNewAssessmentOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          )}
        </div>
        
        <TabsContent value="organizations" className="space-y-4">
          <div className="relative w-full md:w-72 mb-4">
            <Input 
              placeholder="Search organizations..." 
              className="pl-9"
            />
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-textSecondary"
            >
              <path
                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <Badge className={org.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                      {org.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-admin-textSecondary mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {org.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                      <div className="text-admin-textSecondary">Primary Needs:</div>
                      <div>{org.primaryNeeds}</div>
                      <div className="text-admin-textSecondary">Monthly Requirement:</div>
                      <div>{org.monthlyRequirement}</div>
                      <div className="text-admin-textSecondary">Serving:</div>
                      <div>{org.servingCapacity}</div>
                    </div>
                    
                    <div className="pt-3 border-t mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => viewOrganizationDetails(org)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="needsAssessment">
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-admin-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Population</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-admin-textSecondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-admin-border">
                {needsAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-admin-background/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-admin-text">{assessment.organization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-admin-text">{assessment.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-admin-text">{assessment.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-admin-text">{assessment.population}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        assessment.status === 'Implemented' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : assessment.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }>
                        {assessment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="h-8">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Community Food Bank</h3>
                        <p className="text-sm text-admin-textSecondary flex items-center mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          August 15, 2023
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                    </div>
                    <div className="mt-3 text-sm">
                      <p><span className="font-medium">Items:</span> 150kg Rice, 80kg Vegetables</p>
                      <p><span className="font-medium">Beneficiaries:</span> 320 families</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Rural Aid Foundation</h3>
                        <p className="text-sm text-admin-textSecondary flex items-center mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          August 18, 2023
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                    </div>
                    <div className="mt-3 text-sm">
                      <p><span className="font-medium">Items:</span> 100kg Rice, 60kg Corn</p>
                      <p><span className="font-medium">Beneficiaries:</span> 240 families</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Organizations</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Families Reached</span>
                    <span className="font-medium">560 / 1050</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>August Distribution Goal</span>
                    <span className="font-medium">620kg / 1000kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button className="w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Plan New Distribution
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Organization Details Dialog */}
      {selectedOrg && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedOrg.name}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-admin-textSecondary" />
                  <span>{selectedOrg.location}</span>
                  <span className="mx-2">•</span>
                  <Badge className={selectedOrg.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                    {selectedOrg.status}
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Organization Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-admin-textSecondary w-32">Primary Needs:</span>
                    <span>{selectedOrg.primaryNeeds}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-32">Monthly Requirement:</span>
                    <span>{selectedOrg.monthlyRequirement}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-32">Serving Capacity:</span>
                    <span>{selectedOrg.servingCapacity}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-32">Last Delivery:</span>
                    <span>{selectedOrg.lastDelivery}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-admin-textSecondary w-20">Name:</span>
                    <span>{selectedOrg.contact.name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-20">Position:</span>
                    <span>{selectedOrg.contact.position}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-20">Email:</span>
                    <span>{selectedOrg.contact.email}</span>
                  </div>
                  <div className="flex">
                    <span className="text-admin-textSecondary w-20">Phone:</span>
                    <span>{selectedOrg.contact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-admin-secondary/10 p-1 rounded mr-3 mt-0.5">
                    <Package className="h-4 w-4 text-admin-secondary" />
                  </div>
                  <div>
                    <p className="text-sm">Delivered 120kg of rice and vegetables</p>
                    <p className="text-xs text-admin-textSecondary">July 28, 2023</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-admin-secondary/10 p-1 rounded mr-3 mt-0.5">
                    <BadgeCheck className="h-4 w-4 text-admin-secondary" />
                  </div>
                  <div>
                    <p className="text-sm">Completed needs assessment</p>
                    <p className="text-xs text-admin-textSecondary">July 15, 2023</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-admin-secondary/10 p-1 rounded mr-3 mt-0.5">
                    <MessageSquare className="h-4 w-4 text-admin-secondary" />
                  </div>
                  <div>
                    <p className="text-sm">Updated contact information</p>
                    <p className="text-xs text-admin-textSecondary">July 10, 2023</p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Delivery
                </Button>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* New Needs Assessment Dialog */}
      <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Needs Assessment</DialogTitle>
            <DialogDescription>
              Record food security needs and make recommendations for distribution.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <select id="organization" className="w-full border border-input rounded-md px-3 py-2">
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Assessment Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" placeholder="Enter region" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="population">Population Served</Label>
                <Input id="population" placeholder="e.g., 500 families" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="findings">Assessment Findings</Label>
              <Textarea id="findings" placeholder="Document the current food security situation..." rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea id="recommendations" placeholder="Provide recommendations for addressing needs..." rows={3} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAssessmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssessment}>
              Save Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Organization Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Organization</DialogTitle>
            <DialogDescription>
              Send an invitation to a new organization to collaborate on the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="Enter organization name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" placeholder="contact@organization.org" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input id="contact-person" placeholder="Enter contact person's name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message</Label>
              <Textarea 
                id="message" 
                placeholder="Write a message to the organization..."
                defaultValue="We would like to invite your organization to collaborate with us on our food security platform. This will allow us to better coordinate donations and address food security needs in your community."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Collaborations;
