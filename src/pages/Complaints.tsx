
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PageContainer from '@/components/dashboard/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Complaint } from '@/types/complaint';
import ComplaintList from '@/components/complaints/ComplaintList';

const Complaints = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch complaints from Firestore
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const complaintsRef = collection(db, 'complaints');
        let q;
        
        if (activeTab === 'all') {
          q = query(complaintsRef);
        } else {
          q = query(complaintsRef, where('status', '==', activeTab));
        }
        
        const querySnapshot = await getDocs(q);
        const complaintsData: Complaint[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          complaintsData.push({
            id: doc.id,
            userId: data.userId || '',
            userName: data.userName || '',
            userType: data.userType || '',
            issueType: data.issueType || '',
            status: (data.status as 'Open' | 'In Progress' | 'Resolved') || 'Open',
            message: data.message || '',
            date: data.date || '',
            email: data.email || '',
            phone: data.phone || '',
            responseHistory: data.responseHistory || []
          });
        });
        
        setComplaints(complaintsData);
      } catch (err) {
        setError(err as Error);
        toast({
          title: "Error fetching complaints",
          description: (err as Error).message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [activeTab, toast]);

  const toggleExpand = (id: string) => {
    if (expandedComplaint === id) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(id);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    try {
      const complaintRef = doc(db, 'complaints', id);
      await updateDoc(complaintRef, {
        status: newStatus
      });
      
      // Update the local state to reflect the change
      setComplaints(complaints.map(complaint => 
        complaint.id === id ? {...complaint, status: newStatus} : complaint
      ));
      
      toast({
        title: "Status updated",
        description: `Complaint status changed to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Error updating status",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const submitResponse = async (id: string, responseText: string) => {
    if (!responseText.trim()) return;
    
    try {
      const complaint = complaints.find(c => c.id === id);
      if (!complaint) return;
      
      const complaintRef = doc(db, 'complaints', id);
      
      const newResponse = {
        adminId: "admin123", // In a real app, this would be the current admin's ID
        adminName: "Administrator", // In a real app, this would be the current admin's name
        response: responseText,
        date: new Date().toISOString()
      };
      
      const responseHistory = complaint.responseHistory || [];
      
      await updateDoc(complaintRef, {
        responseHistory: [...responseHistory, newResponse]
      });
      
      // Update the local state to reflect the change
      setComplaints(complaints.map(c => 
        c.id === id ? {
          ...c, 
          responseHistory: [...(c.responseHistory || []), newResponse]
        } : c
      ));
      
      toast({
        title: "Response sent",
        description: "Your response has been submitted"
      });
    } catch (err) {
      toast({
        title: "Error sending response",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer title="Complaints Management" subtitle="View and manage user complaints">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Complaints</TabsTrigger>
            <TabsTrigger value="Open">Open</TabsTrigger>
            <TabsTrigger value="In Progress">In Progress</TabsTrigger>
            <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Complaint List
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-admin-danger flex items-center gap-2 py-4">
                  <AlertCircle size={16} /> 
                  <span>Failed to load complaints</span>
                </div>
              ) : (
                <ComplaintList
                  complaints={complaints}
                  loading={loading}
                  expandedComplaint={expandedComplaint}
                  toggleExpand={toggleExpand}
                  handleStatusChange={handleStatusChange}
                  submitResponse={submitResponse}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Complaints;
