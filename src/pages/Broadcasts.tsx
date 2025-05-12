
import React, { useState } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Send, Users, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Sample announcement data
const announcements = [
  {
    id: 1,
    title: 'System Maintenance',
    message: 'The system will be down for maintenance on Saturday, August 10th from 2:00 AM to 6:00 AM.',
    audience: 'All Users',
    dateCreated: '2023-08-05',
    status: 'Scheduled',
    sendDate: '2023-08-09'
  },
  {
    id: 2,
    title: 'New Crop Pricing Policy',
    message: 'We are updating our crop pricing policy to better support local farmers. Please check the updated guidelines.',
    audience: 'Farmers, Buyers',
    dateCreated: '2023-08-03',
    status: 'Sent',
    sendDate: '2023-08-03'
  },
  {
    id: 3,
    title: 'Food Security Initiative',
    message: 'New partnership with the Department of Agriculture to enhance food security across rural communities.',
    audience: 'Organizations',
    dateCreated: '2023-08-01',
    status: 'Sent',
    sendDate: '2023-08-01'
  },
  {
    id: 4,
    title: 'Donation Drive for Typhoon Victims',
    message: 'We are coordinating a donation drive for families affected by the recent typhoon. Please consider donating crops.',
    audience: 'All Users',
    dateCreated: '2023-07-28',
    status: 'Sent',
    sendDate: '2023-07-28'
  },
];

const audienceOptions = [
  { id: "all-users", label: "All Users" },
  { id: "farmers", label: "Farmers" },
  { id: "organizations", label: "Organizations" },
  { id: "buyers", label: "Buyers" },
  { id: "administrators", label: "Administrators" },
];

const Broadcasts = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    audienceTargets: { "all-users": true },
    sendNow: true,
    sendDate: ''
  });
  const { toast } = useToast();

  const handleCreateAnnouncement = () => {
    // Here you would typically call an API to create the announcement
    const selectedAudiences = Object.entries(newAnnouncement.audienceTargets)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => audienceOptions.find(opt => opt.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    toast({
      title: "Announcement created",
      description: newAnnouncement.sendNow 
        ? `Your announcement has been sent to ${selectedAudiences}.` 
        : "Your announcement has been scheduled for sending.",
    });
    
    setIsCreateDialogOpen(false);
    setNewAnnouncement({
      title: '',
      message: '',
      audienceTargets: { "all-users": true },
      sendNow: true,
      sendDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Sent') {
      return <Badge className="bg-emerald-100 text-emerald-800">Sent</Badge>;
    } else if (status === 'Scheduled') {
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setNewAnnouncement({
      ...newAnnouncement,
      audienceTargets: {
        ...newAnnouncement.audienceTargets,
        [audienceId]: checked,
        // If "All Users" is selected, deselect others. If others are selected, deselect "All Users"
        ...(audienceId === "all-users" && checked 
            ? audienceOptions.filter(opt => opt.id !== "all-users").reduce((acc, opt) => ({ ...acc, [opt.id]: false }), {})
            : audienceId !== "all-users" && checked 
              ? { "all-users": false }
              : {}
        )
      }
    });
  };

  // Get a string representation of selected audience for display
  const getSelectedAudienceText = () => {
    const selectedAudiences = Object.entries(newAnnouncement.audienceTargets)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => audienceOptions.find(opt => opt.id === id)?.label);
    
    if (selectedAudiences.length === 0) return "No audience selected";
    if (selectedAudiences.includes("All Users")) return "All Users";
    return selectedAudiences.join(", ");
  };

  return (
    <PageContainer title="Broadcasts" subtitle="Send notifications and announcements to users">
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Send className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Send Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell>{announcement.audience}</TableCell>
                <TableCell>{announcement.dateCreated}</TableCell>
                <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                <TableCell>{announcement.sendDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Send notifications and important updates to users of the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Announcement Title
              </label>
              <Input
                id="title"
                placeholder="Enter a clear and concise title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write your announcement message here..."
                rows={5}
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Target Audience
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {audienceOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`audience-${option.id}`} 
                      checked={newAnnouncement.audienceTargets[option.id] || false}
                      onCheckedChange={(checked) => handleAudienceChange(option.id, checked === true)}
                    />
                    <label 
                      htmlFor={`audience-${option.id}`} 
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              <p className="text-sm text-admin-textSecondary mt-3">
                <Users className="inline h-3 w-3 mr-1" />
                Selected audience: {getSelectedAudienceText()}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sending Options
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={newAnnouncement.sendNow}
                    onChange={() => setNewAnnouncement({...newAnnouncement, sendNow: true})}
                    className="accent-admin-primary h-4 w-4"
                  />
                  <span>Send Immediately</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!newAnnouncement.sendNow}
                    onChange={() => setNewAnnouncement({...newAnnouncement, sendNow: false})}
                    className="accent-admin-primary h-4 w-4"
                  />
                  <span>Schedule for Later</span>
                </label>
              </div>
              
              {!newAnnouncement.sendNow && (
                <div className="mt-2">
                  <Input
                    type="date"
                    value={newAnnouncement.sendDate}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, sendDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.message}>
              {newAnnouncement.sendNow ? 'Send Now' : 'Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Open Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Response Rate</span>
                <span className="font-medium">43%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '43%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Action Completion</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-admin-secondary h-2.5 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Communication Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-admin-secondary mr-2">•</span>
                <span>Keep messages clear and concise</span>
              </li>
              <li className="flex items-start">
                <span className="text-admin-secondary mr-2">•</span>
                <span>Include a clear call to action when needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-admin-secondary mr-2">•</span>
                <span>Use a descriptive subject line</span>
              </li>
              <li className="flex items-start">
                <span className="text-admin-secondary mr-2">•</span>
                <span>Target specific user groups for better engagement</span>
              </li>
              <li className="flex items-start">
                <span className="text-admin-secondary mr-2">•</span>
                <span>Schedule important announcements during peak usage hours</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Best Practices</Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Broadcasts;
