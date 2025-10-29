import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { logSuperAdminAction } from '@/lib/firebaseUtils';

interface WebsiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
}

interface AuditLog {
  id: string;
  action: string;
  details?: string;
  user: string;
  timestamp: string;
}

const SuperAdminSettings: React.FC = () => {
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [prevSettings, setPrevSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchWebsiteSettings = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'website');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as WebsiteSettings;
        setWebsiteSettings(data);
        setPrevSettings(data); // store previous values
      } else {
        await setDoc(docRef, websiteSettings);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch website settings');
    }
    setLoading(false);
  };

  const fetchAuditLogs = async () => {
    try {
      const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const logsData: AuditLog[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as AuditLog));
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWebsiteSettings();
    fetchAuditLogs();
  }, []);

  const generateChangeDetails = (prev: WebsiteSettings, curr: WebsiteSettings) => {
    const changes: string[] = [];
    if (prev.siteName !== curr.siteName) changes.push(`Site Name changed from "${prev.siteName}" to "${curr.siteName}"`);
    if (prev.contactEmail !== curr.contactEmail) changes.push(`Contact Email changed from "${prev.contactEmail}" to "${curr.contactEmail}"`);
    if (prev.contactPhone !== curr.contactPhone) changes.push(`Contact Phone changed from "${prev.contactPhone}" to "${curr.contactPhone}"`);
    return changes.join('; ');
  };

  const handleSaveSettings = async () => {
    if (!prevSettings) return;
    setSaving(true);
    try {
      const changes = generateChangeDetails(prevSettings, websiteSettings);
      if (changes) {
        await setDoc(doc(db, 'settings', 'website'), websiteSettings);
        await logSuperAdminAction('Updated website settings', changes);
        toast.success('Website settings saved successfully!');
      } else {
        toast('No changes detected');
      }
      setPrevSettings(websiteSettings);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    }
    setSaving(false);
    fetchAuditLogs();
  };

  const handleBackup = async () => {
    try {
      const collections = ['settings', 'admins', 'transactions', 'auditLogs', 'users'];
      const backupData: Record<string, any> = {};

      for (const col of collections) {
        const snapshot = await getDocs(collection(db, col));
        backupData[col] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const structuredBackup = {
        timestamp: new Date().toISOString(),
        data: backupData
      };

      const blob = new Blob([JSON.stringify(structuredBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `farmaid_backup_${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      await logSuperAdminAction('Downloaded system backup including all collections');
      toast.success('System backup downloaded successfully!');
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to download backup');
    }
  };

  return (
    <PageContainer title="Settings" subtitle="Manage system-wide configurations">
      {/* Website Settings Form */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 px-4 sm:px-0">
          <h3 className="text-lg font-medium text-admin-text">Website Settings</h3>
          <p className="mt-1 text-sm text-admin-textSecondary">
            Configure general settings for the FarmAid platform.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update main website details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={websiteSettings.siteName}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={websiteSettings.contactEmail}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={websiteSettings.contactPhone}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving || loading}
                  className="flex items-center gap-2 bg-admin-primary hover:bg-admin-primary/90 text-white"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button
                  onClick={handleBackup}
                  className="flex items-center gap-2 bg-admin-secondary hover:bg-admin-secondary/90 text-white"
                >
                  <Download className="h-4 w-4" /> Download Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 px-4 sm:px-0">
          <h3 className="text-lg font-medium text-admin-text">Audit Logs</h3>
          <p className="mt-1 text-sm text-admin-textSecondary">
            View all actions performed by the super admin.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Action Logs</CardTitle>
              <CardDescription>Newest actions first</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 && <p className="text-admin-textSecondary text-center py-4">No logs yet</p>}
              {logs.map(log => (
                <div key={log.id} className="p-3 border-b border-gray-200 rounded-md bg-gray-50">
                  <p className="text-sm font-medium text-admin-text">{log.action}</p>
                  {log.details && <p className="text-xs text-gray-600 mt-1">{log.details}</p>}
                  <p className="text-xs text-gray-400 mt-1">{log.user} • {new Date(log.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default SuperAdminSettings;
