
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/dashboard/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

const Settings = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Engineer',
    role: 'Administrator',
    avatarUrl: 'https://github.com/shadcn.png'
  });
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'FarmAid Admin Dashboard',
    contactEmail: 'contact@farmaid.org',
    contactPhone: '+63 912 345 6789',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newDonationsAlert: true,
    newUserRegistration: true,
    systemUpdates: true,
  });
  
  const [cropCategories, setCropCategories] = useState([
    { id: 1, name: 'Root crops' },
    { id: 2, name: 'Vegetables' },
    { id: 3, name: 'Fruits' },
    { id: 4, name: 'Spices' }
  ]);
  
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    document.title = 'Settings | FarmAid Admin';
  }, []);

  useEffect(() => {
    // Check if any settings have been changed
    setChanged(true); // Simplified for demo purposes
  }, [adminProfile, siteSettings, notificationSettings, cropCategories]);

  const handleSave = () => {
    // Simulate saving settings
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
      setChanged(false);
    }, 1500);
  };

  const handleReset = () => {
    // Reset to default settings
    setAdminProfile({
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Software Engineer',
      role: 'Administrator',
      avatarUrl: 'https://github.com/shadcn.png'
    });
    
    setSiteSettings({
      siteName: 'FarmAid Admin Dashboard',
      contactEmail: 'contact@farmaid.org',
      contactPhone: '+63 912 345 6789',
    });
    
    setNotificationSettings({
      emailNotifications: true,
      newDonationsAlert: true,
      newUserRegistration: true,
      systemUpdates: true,
    });
    
    setCropCategories([
      { id: 1, name: 'Root crops' },
      { id: 2, name: 'Vegetables' },
      { id: 3, name: 'Fruits' },
      { id: 4, name: 'Spices' }
    ]);
    
    toast.info("Settings reset to default.");
    setChanged(false);
  };

  const addCropCategory = () => {
    if (newCategory.trim() === '') {
      toast.error("Category name cannot be empty");
      return;
    }
    
    const existingCategory = cropCategories.find(
      category => category.name.toLowerCase() === newCategory.toLowerCase()
    );
    
    if (existingCategory) {
      toast.error("This category already exists");
      return;
    }
    
    const newId = Math.max(...cropCategories.map(cat => cat.id), 0) + 1;
    setCropCategories([...cropCategories, { id: newId, name: newCategory }]);
    setNewCategory('');
    toast.success(`Added new category: ${newCategory}`);
  };

  const removeCropCategory = (id: number) => {
    setCropCategories(cropCategories.filter(category => category.id !== id));
  };

  return (
    <PageContainer title="Settings" subtitle="Manage your profile and system settings">
      {/* Profile Information */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium text-admin-text">Admin Profile</h3>
            <p className="mt-1 text-sm text-admin-textSecondary">
              Update your personal details and account settings.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Manage your basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={adminProfile.avatarUrl} alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{adminProfile.name}</p>
                  <p className="text-sm text-admin-textSecondary">{adminProfile.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={adminProfile.bio}
                    onChange={(e) => setAdminProfile({...adminProfile, bio: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={adminProfile.role} 
                    onValueChange={(value) => setAdminProfile({...adminProfile, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-admin-border" />
        </div>
      </div>

      {/* Website Settings */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium text-admin-text">Website Settings</h3>
            <p className="mt-1 text-sm text-admin-textSecondary">
              Configure general settings for the FarmAid platform.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the main website settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    type="text"
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    type="email"
                    id="contactEmail"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    type="text"
                    id="contactPhone"
                    value={siteSettings.contactPhone}
                    onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-admin-border" />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium text-admin-text">Notifications</h3>
            <p className="mt-1 text-sm text-admin-textSecondary">
              Manage your notification preferences.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure what notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                  />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newDonationsAlert"
                    checked={notificationSettings.newDonationsAlert}
                    onChange={(e) => setNotificationSettings({...notificationSettings, newDonationsAlert: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                  />
                  <Label htmlFor="newDonationsAlert">New Donations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newUserRegistration"
                    checked={notificationSettings.newUserRegistration}
                    onChange={(e) => setNotificationSettings({...notificationSettings, newUserRegistration: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                  />
                  <Label htmlFor="newUserRegistration">New User Registrations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onChange={(e) => setNotificationSettings({...notificationSettings, systemUpdates: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                  />
                  <Label htmlFor="systemUpdates">System Updates</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-admin-border" />
        </div>
      </div>

      {/* Crop Categories */}
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium text-admin-text">Crop Categories</h3>
            <p className="mt-1 text-sm text-admin-textSecondary">
              Add and remove crop categories used throughout the system.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Crop Category Management</CardTitle>
              <CardDescription>Add or remove crop categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={addCropCategory}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-2 mt-4">
                {cropCategories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>{category.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeCropCategory(category.id)}
                      className="text-admin-danger hover:text-admin-danger/80 hover:bg-admin-danger/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {cropCategories.length === 0 && (
                  <p className="text-admin-textSecondary text-center py-4">No categories added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4 px-4 py-3 text-right sm:px-6">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!changed || saving}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!changed || saving}
          className="bg-admin-primary hover:bg-admin-primary/90 text-white flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </PageContainer>
  );
};

export default Settings;
