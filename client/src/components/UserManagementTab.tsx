import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserCog, Trash2, ArrowLeft } from "lucide-react";
import { defaultPermissions, User } from "@/models/UserPermissions";
import UserForm from "./UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUserRecord,
} from "../services/authService";

const UserManagementTab = () => {
  const [users, setUsers] = useState<User[]>([]);

  // let's start here.
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

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleUserSubmit = async (data: User) => {
    if (editingUser) {
      // Update existing user

      try {
        const response = await updateUser(data._id, data);
        if (!response) {
          throw new Error("Failed to update user");
        }

        setUsers(
          users.map((user) =>
            user._id === data._id
              ? {
                  ...response.user,
                  // If password is empty in edit mode, keep the current password
                  password: data.password || user.password,
                }
              : user
          )
        );

        toast.success("User updated successfully");
      } catch (err) {
        console.error("Error updating user:", err);
        toast.error("Failed to update user. Please try again.");
        return;
      }
    } else {
      // Create new user
      const newUser: User = {
        ...data,
      };

      try {
        const response = await registerUser(newUser);
        if (response) {
          setUsers([...users, newUser]);
          toast.success("User created successfully");
        }
      } catch (err) {
        console.error("Error creating user:", err);
        toast.error("Failed to create user. Please try again.");
        return;
      }
    }

    setShowUserForm(false);
    setEditingUser(null);
  };

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUserRecord(id);

        console.log("Delete response:", response);

        if (response.status === 200) {
          setUsers(users.filter((user) => user._id !== id));
          toast.success("User deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user. Please try again.");
        return;
      }
    }
  };

  const openEditUserForm = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  if (showUserForm) {
    return (
      <Card className="h-[calc(100vh-200px)] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowUserForm(false);
                setEditingUser(null);
              }}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto pb-6">
          <UserForm
            user={editingUser || {}}
            onSubmit={handleUserSubmit}
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
            isEditing={!!editingUser}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button
          onClick={() => {
            setEditingUser(null);
            setShowUserForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user._id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditUserForm(user)}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteUser(user._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Email:
                    </span>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <p>{user.role}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Access:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.permissions.officePlatform && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Office
                        </span>
                      )}
                      {user.permissions.amazonPlatform && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Amazon
                        </span>
                      )}
                      {user.permissions.meeshoPlatform && (
                        <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                          Meesho
                        </span>
                      )}
                      {user.permissions.websitePlatform && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Website
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
