import { useState } from "react";
import { Settings as SettingsIcon, Download, Upload, Key, Save, UserPlus, Users, UserMinus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
// import AmazonServices from "@/components/AmazonServices";
import UserManagementTab from "@/components/UserManagementTab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlatformPermissions, User, defaultPermissions } from "@/models/UserPermissions";

const Settings = () => {
  const [amazonCredentials, setAmazonCredentials] = useState({
    clientId: "",
    clientSecret: "",
    refreshToken: "",
    region: "us-east-1",
  });
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: false,
    backupFrequency: "daily",
    lastBackup: "Never"
  });

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAmazonCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCredentials = () => {
    toast.success("API credentials saved successfully");
  };
  
  const handleCreateBackup = () => {
    // In a real implementation, this would create a JSON backup of all data
    const mockData = {
      timestamp: new Date().toISOString(),
      orders: "Sample orders data",
      inventory: "Sample inventory data",
      returns: "Sample returns data",
      expenses: "Sample expenses data",
      payments: "Sample payments data"
    };
    
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iraav-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setBackupSettings(prev => ({
      ...prev,
      lastBackup: new Date().toLocaleString()
    }));
    
    toast.success("Backup created successfully");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would parse and restore the backup
      toast.success("Backup imported successfully");
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-iraav-dark-blue flex items-center">
          <SettingsIcon className="h-7 w-7" />
          <span className="ml-2">Settings</span>
        </h2>
        <p className="text-muted-foreground">Configure your application preferences</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize how the application looks and behaves.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="darkMode" />
                  <Label htmlFor="darkMode">Dark Mode</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="compactMode" />
                  <Label htmlFor="compactMode">Compact View</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="emailNotifications" defaultChecked />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="desktopNotifications" />
                  <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Notify me about:</Label>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center space-x-2">
                      <Switch id="orderNotifications" defaultChecked />
                      <Label htmlFor="orderNotifications">New Orders</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="returnNotifications" defaultChecked />
                      <Label htmlFor="returnNotifications">New Returns</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="inventoryAlerts" defaultChecked />
                      <Label htmlFor="inventoryAlerts">Low Inventory</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-6">
          <UserManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
