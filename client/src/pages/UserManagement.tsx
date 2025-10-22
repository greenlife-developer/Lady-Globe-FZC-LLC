import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserPlus, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { PlatformPermissions } from "../models/UserPermissions";
import { registerUser, getUsers } from "../services/authService";

interface UserType {
  _id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  permissions: PlatformPermissions;
  messaging: boolean; // Added messaging permission
  createdAt: string;
  lastActive: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log("Fetched users:", response);
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  // utils/permissions.ts or inline above your component

  const buildPermissionObject = (
    selectedPermissions: string[],
    messaging: boolean
  ): PlatformPermissions => {
    const permissionObj: PlatformPermissions = {
      officePlatform: false,
      amazonPlatform: false,
      meeshoPlatform: false,
      websitePlatform: false,
      dashboard: false,
      categories: false,
      products: false,
      stocks: false,
      customers: false,
      vendors: false,
      salesInvoice: false,
      purchaseInvoice: false,
      creditDebitNote: false,
      expenses: false,
      reports: false,
      settings: false,
      amazonDashboard: false,
      orders: false,
      catalog: false,
      inventory: false,
      advertising: false,
      amazonVendors: false,
      returns: false,
      payments: false,
      amazonReports: false,
      messaging: false,
    };

    // Platforms
    permissionObj.officePlatform = selectedPermissions.some((p) =>
      p.startsWith("office-")
    );
    permissionObj.amazonPlatform = selectedPermissions.some((p) =>
      p.startsWith("amazon-")
    );
    permissionObj.meeshoPlatform = selectedPermissions.some((p) =>
      p.startsWith("meesho-")
    );
    permissionObj.websitePlatform = selectedPermissions.some((p) =>
      p.startsWith("website-")
    );

    // Individual permissions
    selectedPermissions.forEach((perm) => {
      const [prefix, key] = perm.split("-");
      switch (key) {
        case "stock":
          permissionObj.stocks = true;
          break;
        case "customer":
          permissionObj.customers = true;
          break;
        case "vendor":
          permissionObj.vendors = true;
          break;
        case "creditDebit":
          permissionObj.creditDebitNote = true;
          break;
        default:
          // Only set valid keys
          if (key in permissionObj) {
            (permissionObj as any)[key] = true;
          }
      }
    });

    permissionObj.messaging = messaging;

    return permissionObj;
  };

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
    permissions: [],
    messaging: false,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateUser = async () => {
    // In a real app, this would send data to an API
    const user: UserType = {
      // id: Math.random().toString(36).substring(7),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // Password should be hashed in a real app
      role: newUser.role,
      permissions: buildPermissionObject(
        newUser.permissions,
        newUser.messaging
      ),
      messaging: newUser.messaging,
      createdAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await registerUser(user);

      if (response) {
        toast.success("User created successfully");
        setDialogOpen(false);
        setUsers([...users, user]);
        // Reset form
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "Staff",
          permissions: [],
          messaging: false,
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
      return;
    }
  };

  // Grouped permissions by platform
  const officePermissions = [
    { id: "dashboard", label: "Dashboard Access" },
    { id: "categories", label: "Categories Access" },
    { id: "products", label: "Products Access" },
    { id: "stock", label: "Stock Access" },
    { id: "customer", label: "Customer Access" },
    { id: "vendor", label: "Vendor Access" },
    { id: "salesInvoice", label: "Sales Invoice Access" },
    { id: "purchaseInvoice", label: "Purchase Invoice Access" },
    { id: "creditDebit", label: "Credit & Debit Note Access" },
    { id: "expenses", label: "Expenses Access" },
    { id: "reports", label: "Reports Access" },
    { id: "settings", label: "Settings Access" },
  ];

  const amazonPermissions = [
    { id: "amazonDashboard", label: "Dashboard Access" },
    { id: "orders", label: "Orders Access" },
    { id: "catalog", label: "Catalog Access" },
    { id: "inventory", label: "Inventory Access" },
    { id: "advertising", label: "Advertising Access" },
    { id: "vendors", label: "Vendor Access" },
    { id: "returns", label: "Returns Access" },
    { id: "payments", label: "Payments Access" },
    { id: "amazonReports", label: "Reports Access" },
  ];

  const meeshoPermissions = [
    { id: "meeshoDashboard", label: "Dashboard Access" },
  ];

  const flipkartPermissions = [
    { id: "flipkartDashboard", label: "Dashboard Access" },
  ];

  const websitePermissions = [
    { id: "websiteDashboard", label: "Dashboard Access" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-iraav-dark-blue">
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage user access and permissions
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iraav-dark-blue hover:bg-iraav-navy">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[70vw] max-w-[70vw] p-8 max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user account and set their permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Messaging permission */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="messaging" className="text-right">
                  Messaging
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="messaging"
                      checked={newUser.messaging}
                      onCheckedChange={(checked) => {
                        setNewUser({ ...newUser, messaging: !!checked });
                      }}
                    />
                    <Label htmlFor="messaging">Allow Messaging</Label>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="office" className="col-span-4">
                <TabsList className="w-full">
                  <TabsTrigger value="office">Office</TabsTrigger>
                  <TabsTrigger value="amazon">Amazon</TabsTrigger>
                  <TabsTrigger value="meesho">Meesho</TabsTrigger>
                  <TabsTrigger value="flipkart">Flipkart</TabsTrigger>
                  <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                <TabsContent value="office">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {officePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`office-${permission.id}`}
                          checked={newUser.permissions.includes(
                            `office-${permission.id}`
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  `office-${permission.id}`,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== `office-${permission.id}`
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`office-${permission.id}`}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="amazon">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {amazonPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`amazon-${permission.id}`}
                          checked={newUser.permissions.includes(
                            `amazon-${permission.id}`
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  `amazon-${permission.id}`,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== `amazon-${permission.id}`
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`amazon-${permission.id}`}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Similar layout for other platforms */}
                <TabsContent value="meesho">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {meeshoPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`meesho-${permission.id}`}
                          checked={newUser.permissions.includes(
                            `meesho-${permission.id}`
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  `meesho-${permission.id}`,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== `meesho-${permission.id}`
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`meesho-${permission.id}`}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="flipkart">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {flipkartPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`flipkart-${permission.id}`}
                          checked={newUser.permissions.includes(
                            `flipkart-${permission.id}`
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  `flipkart-${permission.id}`,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== `flipkart-${permission.id}`
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`flipkart-${permission.id}`}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="website">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {websitePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`website-${permission.id}`}
                          checked={newUser.permissions.includes(
                            `website-${permission.id}`
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  `website-${permission.id}`,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== `website-${permission.id}`
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`website-${permission.id}`}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-iraav-dark-blue hover:bg-iraav-navy"
                onClick={handleCreateUser}
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="manager">Managers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                Manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Messaging</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.messaging ? (
                          <div className="flex items-center text-green-600">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>Enabled</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Disabled</span>
                        )}
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs */}
        <TabsContent value="admin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Users with administrator privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Messaging</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    ?.filter((user) => user.role === "Admin")
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.messaging ? (
                            <div className="flex items-center text-green-600">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>Enabled</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Disabled</span>
                          )}
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
