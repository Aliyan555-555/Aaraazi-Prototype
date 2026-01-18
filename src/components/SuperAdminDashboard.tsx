import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Key
} from 'lucide-react';
import { SaaSUser, Organization, Branch } from '../types/saas';
import { formatPKR } from '../lib/currency';
import { getSaaSUsers, getOrganizations, getTenants } from '../lib/saas';

interface SuperAdminDashboardProps {
  user: SaaSUser;
  onNavigate: (page: string, data?: any) => void;
}

export function SuperAdminDashboard({ user, onNavigate }: SuperAdminDashboardProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [users, setUsers] = useState<SaaSUser[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadOrganizationData();
  }, [user.organizationId]);

  const loadOrganizationData = () => {
    try {
      const organizations = getOrganizations();
      const currentOrg = organizations.find(org => org.id === user.organizationId);
      
      if (currentOrg) {
        setOrganization(currentOrg);
        setBranches(currentOrg.branches);
      }

      const allUsers = getSaaSUsers();
      const orgUsers = allUsers.filter(u => u.organizationId === user.organizationId);
      setUsers(orgUsers);
    } catch (error) {
      console.error('Error loading organization data:', error);
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalBranches = branches.length;
    const activeBranches = branches.filter(b => b.status === 'active').length;

    return {
      totalUsers,
      activeUsers,
      totalBranches,
      activeBranches
    };
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'super-admin': 'bg-purple-100 text-purple-800',
      'agency-manager': 'bg-blue-100 text-blue-800',
      'agent': 'bg-green-100 text-green-800',
      'developer-admin': 'bg-orange-100 text-orange-800',
      'project-manager': 'bg-indigo-100 text-indigo-800',
      'developer-user': 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Organization Management
        </h1>
        <p className="text-gray-600">
          {organization?.name} - Super Admin Dashboard
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">{stats.activeUsers} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Branches</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.totalBranches}</p>
                <p className="text-sm text-green-600 mt-1">{stats.activeBranches} active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modules</p>
                <p className="text-3xl font-semibold text-gray-900">{user.moduleAccess.length}</p>
                <p className="text-sm text-blue-600 mt-1">Licensed modules</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Business Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {organization?.type}
                </p>
                <p className="text-sm text-gray-600 mt-1">Operations model</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="branches">Branch Management</TabsTrigger>
          <TabsTrigger value="modules">Module Access</TabsTrigger>
          <TabsTrigger value="settings">Organization Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users, roles, and permissions across your organization
                  </CardDescription>
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account for your organization
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john.doe@company.com" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agency-manager">Agency Manager</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="developer-admin">Developer Admin</SelectItem>
                            <SelectItem value="project-manager">Project Manager</SelectItem>
                            <SelectItem value="developer-user">Developer User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="branch">Branch</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddUserDialogOpen(false)}>
                          Create User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="agency-manager">Agency Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="developer-admin">Developer Admin</SelectItem>
                    <SelectItem value="project-manager">Project Manager</SelectItem>
                    <SelectItem value="developer-user">Developer User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            {user.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {branches.find(b => b.id === user.branchId)?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Branch Management</CardTitle>
                  <CardDescription>
                    Manage branch locations and assign managers
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddBranchDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {branches.map((branch) => (
                  <Card key={branch.id} className="border">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{branch.name}</CardTitle>
                          <Badge 
                            variant={branch.status === 'active' ? 'default' : 'secondary'}
                            className="mt-2"
                          >
                            {branch.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{branch.address.street}, {branch.address.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{branch.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{branch.users.length} users assigned</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-xs text-gray-500">Manager: </span>
                          <span className="text-sm font-medium">
                            {users.find(u => u.id === branch.managerId)?.name || 'Not assigned'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Access</CardTitle>
              <CardDescription>
                Manage access to different platform modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-blue-900">Agency Module</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span>Access Status</span>
                        <Badge 
                          variant={user.moduleAccess.includes('agency') ? 'default' : 'secondary'}
                          className={user.moduleAccess.includes('agency') ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.moduleAccess.includes('agency') ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Real estate agency management system with property listings, 
                        lead tracking, and commission management.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-purple-900">Developers Module</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span>Access Status</span>
                        <Badge 
                          variant={user.moduleAccess.includes('developers') ? 'default' : 'secondary'}
                          className={user.moduleAccess.includes('developers') ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.moduleAccess.includes('developers') ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Construction project management system with project accounting, 
                        unit booking, and construction tracking.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Configure your organization preferences and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Organization Name</Label>
                  <Input 
                    className="mt-2" 
                    defaultValue={organization?.name || ''}
                    placeholder="Enter organization name" 
                  />
                </div>
                
                <div>
                  <Label>Business Type</Label>
                  <Select defaultValue={organization?.type || ''}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agency">Real Estate Agency</SelectItem>
                      <SelectItem value="developer">Property Developer</SelectItem>
                      <SelectItem value="both">Both Agency & Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Working Hours Start</Label>
                    <Input 
                      type="time" 
                      className="mt-2"
                      defaultValue={organization?.settings.workingHours.start || '09:00'}
                    />
                  </div>
                  <div>
                    <Label>Working Hours End</Label>
                    <Input 
                      type="time" 
                      className="mt-2"
                      defaultValue={organization?.settings.workingHours.end || '18:00'}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button>Save Settings</Button>
                  <Button variant="outline" onClick={() => onNavigate('module-selector')}>
                    Access Modules
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}