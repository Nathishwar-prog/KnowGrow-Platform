"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { Label } from "../../../../@/components/ui/label";
import { 
    Search, 
    Loader2, 
    Trash2, 
    Edit, 
    Plus,
    X
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../../@/components/ui/dialog";

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        subscriptionId: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.get("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.delete(`/api/admin/users?id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("User deleted successfully");
                fetchUsers();
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            age: user.age.toString(),
            subscriptionId: user.subscriptionId || ""
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            age: "",
            subscriptionId: ""
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("adminToken");
            const headers = { Authorization: `Bearer ${token}` };
            
            if (editingUser) {
                // Update
                const response = await axios.put("/api/admin/users", {
                    id: editingUser.id,
                    ...formData,
                    age: parseInt(formData.age)
                }, { headers });
                
                if (response.data.success) {
                    toast.success("User updated successfully");
                    setIsDialogOpen(false);
                    fetchUsers();
                }
            } else {
                // Create
                const response = await axios.post("/api/admin/users", {
                    ...formData,
                    age: parseInt(formData.age)
                }, { headers });
                
                if (response.data.success) {
                    toast.success("User created successfully");
                    setIsDialogOpen(false);
                    fetchUsers();
                }
            }
        } catch (error) {
            toast.error(editingUser ? "Failed to update user" : "Failed to create user");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Users Management</h2>
                    <p className="text-muted-foreground">Manage all platform users</p>
                </div>
                <Button onClick={handleCreate} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-3 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Name</th>
                                        <th className="text-left p-3">Email</th>
                                        <th className="text-left p-3">Age</th>
                                        <th className="text-left p-3">Subscription</th>
                                        <th className="text-right p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <td className="p-3 font-medium">{user.name}</td>
                                            <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                                            <td className="p-3">{user.age}</td>
                                            <td className="p-3">
                                                {user.subscriptionId ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                                                ) : (
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">None</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? "Update user information" : "Add a new user to the platform"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({...formData, age: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="subscriptionId">Subscription ID (Optional)</Label>
                            <Input
                                id="subscriptionId"
                                value={formData.subscriptionId}
                                onChange={(e) => setFormData({...formData, subscriptionId: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingUser ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

