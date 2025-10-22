
import { useState } from "react";
import { Settings as SettingsIcon, Download, Upload, Key, Database, Save, Users, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AmazonServices from "@/components/AmazonServices";

const SettingsPanel = () => {
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
    link.download = `mivyna-backup-${new Date().toISOString().split("T")[0]}.json`;
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

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="amazon-services">Amazon Services</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Amazon Seller API Configuration</CardTitle>
              <CardDescription>
                Enter your Amazon Seller API credentials to connect to your Amazon seller account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input 
                    id="clientId" 
                    name="clientId"
                    placeholder="Your Amazon API Client ID" 
                    value={amazonCredentials.clientId}
                    onChange={handleCredentialsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input 
                    id="clientSecret" 
                    name="clientSecret"
                    type="password" 
                    placeholder="Your Amazon API Client Secret" 
                    value={amazonCredentials.clientSecret}
                    onChange={handleCredentialsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refreshToken">Refresh Token</Label>
                  <Input 
                    id="refreshToken" 
                    name="refreshToken"
                    placeholder="Your Amazon API Refresh Token" 
                    value={amazonCredentials.refreshToken}
                    onChange={handleCredentialsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">AWS Region</Label>
                  <select 
                    id="region" 
                    name="region"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={amazonCredentials.region}
                    onChange={(e) => setAmazonCredentials(prev => ({...prev, region: e.target.value}))}
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-iraav-dark-blue hover:bg-iraav-navy" onClick={handleSaveCredentials}>
                <Key className="mr-2 h-4 w-4" />
                Save API Credentials
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="amazon-services" className="space-y-4 mt-6">
          <AmazonServices />
        </TabsContent>
        
        <TabsContent value="user-management" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, permissions and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Create and manage user accounts for your team members. Control what parts of the system each user can access.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Accounts</CardTitle>
                    <CardDescription>Manage employee accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Create, edit, or delete user accounts and control access permissions.</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                      <Link to="/settings/users">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Messaging System</CardTitle>
                    <CardDescription>Configure internal communication</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Control who can message whom and manage messaging permissions.</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                      <Link to="/settings/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Manage Messages
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Messaging System
              </CardTitle>
              <CardDescription>
                Configure internal communications and messaging features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Manage how users can communicate within the application. Control messaging permissions and file sharing capabilities.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Link to="/messages" className="block">
                  <Button className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                    <MessageSquare className="mr-2 h-4 w-4" /> Open Messaging System
                  </Button>
                </Link>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowFileSharing">Allow File Sharing</Label>
                      <Switch id="allowFileSharing" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow users to share files in messages
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="restrictCommunication">Restrict Communication</Label>
                      <Switch id="restrictCommunication" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only allow users to message within their department
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="messageHistory">Message History</Label>
                      <select 
                        id="messageHistory" 
                        className="flex h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      How long to keep message history
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-iraav-dark-blue hover:bg-iraav-navy">
                <Save className="mr-2 h-4 w-4" />
                Save Message Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup and Restore</CardTitle>
              <CardDescription>
                Create backups of your data and restore from previous backups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="autoBackup" 
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(checked) => setBackupSettings(prev => ({...prev, autoBackup: checked}))}
                    />
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                  </div>
                  
                  {backupSettings.autoBackup && (
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <select 
                        id="backupFrequency" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={backupSettings.backupFrequency}
                        onChange={(e) => setBackupSettings(prev => ({...prev, backupFrequency: e.target.value}))}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    Last Backup: {backupSettings.lastBackup}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-iraav-dark-blue hover:bg-iraav-navy" 
                    onClick={handleCreateBackup}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Create Backup
                  </Button>
                  
                  <div className="space-y-2">
                    <Label htmlFor="importBackup">Import Backup</Label>
                    <div className="flex items-center">
                      <Input 
                        id="importBackup" 
                        type="file" 
                        accept=".json" 
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById("importBackup")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Backup File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
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
                    defaultValue="INR"
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
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
