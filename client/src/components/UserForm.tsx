import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultPermissions, PlatformPermissions, User } from "@/models/UserPermissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface UserFormProps {
  user: Partial<User>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({ user, onSubmit, onCancel, isEditing }: UserFormProps) => {
  const [userData, setUserData] = useState<User>({
    _id: user._id || crypto.randomUUID(),
    name: user.name || "",
    email: user.email || "",
    password: user.password || "",
    role: user.role || "Staff", // Default to Staff
    permissions: user.permissions || {...defaultPermissions},
    createdAt: user.createdAt || new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserData(prev => ({
      ...prev,
      role: e.target.value
    }));
  };

  const handlePermissionChange = (permission: keyof PlatformPermissions) => {
    setUserData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove email from submitted data if it's empty, as the field is gone
    const dataToSubmit = { ...userData };
    if (!dataToSubmit.email) {
      delete dataToSubmit.email;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          <Input
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        {/* Email field removed */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={userData.email || ""} // Handle potentially undefined email
            onChange={handleInputChange}
            // required // No longer required as it's removed
          />
        </div>
       
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={(userData.password.length < 12 ? userData.password : "")}
            onChange={handleInputChange}
            required={!isEditing}
            placeholder={isEditing ? "Leave blank to keep current password" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            value={userData.role}
            onChange={handleRoleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Accountant">Accountant</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="platform">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="platform">Platform Access</TabsTrigger>
          <TabsTrigger value="office">Office Permissions</TabsTrigger>
          <TabsTrigger value="amazon">Amazon Permissions</TabsTrigger>
          <TabsTrigger value="other">Other Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platform">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="officePlatform">Office Platform</Label>
                  <Switch
                    id="officePlatform"
                    checked={userData.permissions.officePlatform}
                    onCheckedChange={() => handlePermissionChange("officePlatform")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="amazonPlatform">Amazon Platform</Label>
                  <Switch
                    id="amazonPlatform"
                    checked={userData.permissions.amazonPlatform}
                    onCheckedChange={() => handlePermissionChange("amazonPlatform")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="meeshoPlatform">Meesho Platform</Label>
                  <Switch
                    id="meeshoPlatform"
                    checked={userData.permissions.meeshoPlatform}
                    onCheckedChange={() => handlePermissionChange("meeshoPlatform")}
                  />
                </div>
                
                {/* Flipkart Platform removed
                <div className="flex items-center justify-between">
                  <Label htmlFor="flipkartPlatform">Flipkart Platform</Label>
                  <Switch
                    id="flipkartPlatform"
                    checked={userData.permissions.flipkartPlatform}
                    onCheckedChange={() => handlePermissionChange("flipkartPlatform")}
                  />
                </div>
                */}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="websitePlatform">Website Platform</Label>
                  <Switch
                    id="websitePlatform"
                    checked={userData.permissions.websitePlatform}
                    onCheckedChange={() => handlePermissionChange("websitePlatform")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ... keep existing code (Office, Amazon, Other permission tabs) */}
        <TabsContent value="office">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dashboard">Dashboard</Label>
                  <Switch
                    id="dashboard"
                    checked={userData.permissions.dashboard}
                    onCheckedChange={() => handlePermissionChange("dashboard")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="categories">Categories</Label>
                  <Switch
                    id="categories"
                    checked={userData.permissions.categories}
                    onCheckedChange={() => handlePermissionChange("categories")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="products">Products</Label>
                  <Switch
                    id="products"
                    checked={userData.permissions.products}
                    onCheckedChange={() => handlePermissionChange("products")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="stocks">Stocks</Label>
                  <Switch
                    id="stocks"
                    checked={userData.permissions.stocks}
                    onCheckedChange={() => handlePermissionChange("stocks")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="customers">Customers</Label>
                  <Switch
                    id="customers"
                    checked={userData.permissions.customers}
                    onCheckedChange={() => handlePermissionChange("customers")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="vendors">Vendors</Label>
                  <Switch
                    id="vendors"
                    checked={userData.permissions.vendors}
                    onCheckedChange={() => handlePermissionChange("vendors")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="salesInvoice">Sales Invoice</Label>
                  <Switch
                    id="salesInvoice"
                    checked={userData.permissions.salesInvoice}
                    onCheckedChange={() => handlePermissionChange("salesInvoice")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="purchaseInvoice">Purchase Invoice</Label>
                  <Switch
                    id="purchaseInvoice"
                    checked={userData.permissions.purchaseInvoice}
                    onCheckedChange={() => handlePermissionChange("purchaseInvoice")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="creditDebitNote">Credit/Debit Note</Label>
                  <Switch
                    id="creditDebitNote"
                    checked={userData.permissions.creditDebitNote}
                    onCheckedChange={() => handlePermissionChange("creditDebitNote")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="expenses">Expenses</Label>
                  <Switch
                    id="expenses"
                    checked={userData.permissions.expenses}
                    onCheckedChange={() => handlePermissionChange("expenses")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reports">Reports</Label>
                  <Switch
                    id="reports"
                    checked={userData.permissions.reports}
                    onCheckedChange={() => handlePermissionChange("reports")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="settings">Settings</Label>
                  <Switch
                    id="settings"
                    checked={userData.permissions.settings}
                    onCheckedChange={() => handlePermissionChange("settings")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amazon">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amazonDashboard">Dashboard</Label>
                  <Switch
                    id="amazonDashboard"
                    checked={userData.permissions.amazonDashboard}
                    onCheckedChange={() => handlePermissionChange("amazonDashboard")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="orders">Orders</Label>
                  <Switch
                    id="orders"
                    checked={userData.permissions.orders}
                    onCheckedChange={() => handlePermissionChange("orders")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="catalog">Catalog</Label>
                  <Switch
                    id="catalog"
                    checked={userData.permissions.catalog}
                    onCheckedChange={() => handlePermissionChange("catalog")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Switch
                    id="inventory"
                    checked={userData.permissions.inventory}
                    onCheckedChange={() => handlePermissionChange("inventory")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="advertising">Advertising</Label>
                  <Switch
                    id="advertising"
                    checked={userData.permissions.advertising}
                    onCheckedChange={() => handlePermissionChange("advertising")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="amazonVendors">Vendors</Label>
                  <Switch
                    id="amazonVendors"
                    checked={userData.permissions.amazonVendors}
                    onCheckedChange={() => handlePermissionChange("amazonVendors")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="returns">Returns</Label>
                  <Switch
                    id="returns"
                    checked={userData.permissions.returns}
                    onCheckedChange={() => handlePermissionChange("returns")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="payments">Payments</Label>
                  <Switch
                    id="payments"
                    checked={userData.permissions.payments}
                    onCheckedChange={() => handlePermissionChange("payments")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="amazonReports">Reports</Label>
                  <Switch
                    id="amazonReports"
                    checked={userData.permissions.amazonReports}
                    onCheckedChange={() => handlePermissionChange("amazonReports")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="other">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="messaging">Messaging</Label>
                  <Switch
                    id="messaging"
                    checked={userData.permissions.messaging}
                    onCheckedChange={() => handlePermissionChange("messaging")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{isEditing ? "Update User" : "Create User"}</Button>
      </div>
    </form>
  );
};

export default UserForm;
