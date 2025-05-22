import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const audienceOptions = [
  { id: "all-users", label: "All Users" },
  { id: "farmer", label: "Farmer" },
  { id: "organizations", label: "Organizations" },
  { id: "market", label: "Market" },
];

const Broadcasts = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewedAnnouncement, setViewedAnnouncement] = useState<any | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    audienceTargets: { "all-users": true },
    sendNow: true,
    sendDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the announcement.",
        variant: "destructive"
      });
      return;
    }
    if (!newAnnouncement.message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message for the announcement.",
        variant: "destructive"
      });
      return;
    }
    if (!Object.values(newAnnouncement.audienceTargets).some(Boolean)) {
      toast({
        title: "Audience required",
        description: "Please select at least one target audience.",
        variant: "destructive"
      });
      return;
    }
    if (!newAnnouncement.sendNow && !newAnnouncement.sendDate) {
      toast({
        title: "Send date required",
        description: "Please select a send date for scheduled announcements.",
        variant: "destructive"
      });
      return;
    }

    const selectedAudiences = Object.entries(newAnnouncement.audienceTargets)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => audienceOptions.find(opt => opt.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const createdAt = Timestamp.now();
    let scheduledTimestamp;
    if (newAnnouncement.sendNow) {
      scheduledTimestamp = createdAt;
    } else {
      scheduledTimestamp = Timestamp.fromDate(new Date(newAnnouncement.sendDate));
      if (scheduledTimestamp.seconds < createdAt.seconds) {
        toast({
          title: "Invalid send date",
          description: "Scheduled send date must be in the future.",
          variant: "destructive"
        });
        return;
      }
    }

    const announcementData = {
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      audience: selectedAudiences,
      status: newAnnouncement.sendNow ? 'Sent' : 'Scheduled',
      date: createdAt,
      dateSent: scheduledTimestamp,
    };

    try {
      await addDoc(collection(db, 'announcements'), announcementData);

      toast({
        title: "Announcement created",
        description: newAnnouncement.sendNow
          ? `Your announcement has been sent to ${selectedAudiences}.`
          : `Your announcement has been scheduled for ${newAnnouncement.sendDate}.`,
      });

      setAnnouncements(prev => [
        { id: 'temp-id', ...announcementData }, // Add temporarily for UI update
        ...prev,
      ]);

      setNewAnnouncement({
        title: '',
        message: '',
        audienceTargets: { "all-users": true },
        sendNow: true,
        sendDate: ''
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setNewAnnouncement(prev => ({
      ...prev,
      audienceTargets: {
        ...prev.audienceTargets,
        [audienceId]: checked,
        ...(audienceId === "all-users" && checked
          ? audienceOptions.filter(opt => opt.id !== "all-users").reduce((acc, opt) => ({ ...acc, [opt.id]: false }), {})
          : audienceId !== "all-users" && checked
            ? { "all-users": false }
            : {}
        )
      }
    }));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Sent') return <Badge className="bg-emerald-100 text-emerald-800">Sent</Badge>;
    if (status === 'Scheduled') return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    return <Badge>{status}</Badge>;
  };

  const getSelectedAudienceText = () => {
    const selected = Object.entries(newAnnouncement.audienceTargets)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => audienceOptions.find(opt => opt.id === id)?.label);

    if (selected.includes("All Users")) return "All Users";
    return selected.length > 0 ? selected.join(", ") : "No audience selected";
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
                <TableCell>{announcement.date?.toDate?.()?.toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                <TableCell>{announcement.dateSent?.toDate?.()?.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setViewedAnnouncement(announcement);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Announcement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              <p><strong>Audience:</strong> {viewedAnnouncement?.audience}</p>
              <p><strong>Status:</strong> {viewedAnnouncement?.status}</p>
              <p><strong>Created:</strong> {viewedAnnouncement?.date?.toDate?.()?.toLocaleString()}</p>
              <p><strong>Send Date:</strong> {viewedAnnouncement?.dateSent?.toDate?.()?.toLocaleString()}</p>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">
            {viewedAnnouncement?.message}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Fill out the announcement details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                placeholder="Enter your message here..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Audience</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {/* Replace buyers checkbox with markets */}
{audienceOptions.map((option) => (
  <label key={option.id} className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={newAnnouncement.audienceTargets[option.id] || false}
      onChange={(e) =>
        handleAudienceChange(option.id, e.target.checked)
      }
    />
    {option.label}
  </label>
))}

              </div>
              <p className="text-xs mt-1 text-muted-foreground">Selected: {getSelectedAudienceText()}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Send Options</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sendOption"
                    value="now"
                    checked={newAnnouncement.sendNow}
                    onChange={() =>
                      setNewAnnouncement((prev) => ({
                        ...prev,
                        sendNow: true,
                        sendDate: '',
                      }))
                    }
                  />
                  Send now
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sendOption"
                    value="schedule"
                    checked={!newAnnouncement.sendNow}
                    onChange={() =>
                      setNewAnnouncement((prev) => ({
                        ...prev,
                        sendNow: false,
                      }))
                    }
                  />
                  Schedule for later
                </label>
              </div>
            </div>

            {!newAnnouncement.sendNow && (
              <div>
                <label className="text-sm font-medium">Send Date</label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.sendDate}
                  onChange={(e) =>
                    setNewAnnouncement((prev) => ({
                      ...prev,
                      sendDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Broadcasts;
