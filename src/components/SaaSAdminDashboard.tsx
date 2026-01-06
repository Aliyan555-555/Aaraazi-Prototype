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
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Activity,
  Shield,
  Database,
  Mail,
  Phone,
  Calendar,
  Globe,
  CreditCard,
  AlertTriangle,
  ChevronDown,
  BarChart3,
  TrendingDown,
  UserCheck,
  UserX,
  Zap,
  LogOut,
  MapPin
} from 'lucide-react';
import { SaaSUser, Tenant, SaaSAnalytics, AccountRequest } from '../types/saas';
import { formatPKR } from '../lib/currency';
import { getSaaSAnalytics, getTenants, getSaaSUsers } from '../lib/saas';
import { PlatformSettings } from './PlatformSettings';
import { LocationsManagement } from './admin/LocationsManagement';
import { toast } from 'sonner';

interface SaaSAdminDashboardProps {
  user: SaaSUser;
  onNavigate: (page: string, data?: any) => void;
  onLogout?: () => void;
}

export function SaaSAdminDashboard({ user, onNavigate, onLogout }: SaaSAdminDashboardProps) {
  const [analytics, setAnalytics] = useState<SaaSAnalytics | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<SaaSUser[]>([]);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newBranchName, setNewBranchName] = useState('');

  // Missing state variables for tenant management
  const [newTenant, setNewTenant] = useState({
    name: '',
    domain: '',
    contactEmail: '',
    contactName: '',
    phone: '',
    modules: [] as string[],
    plan: 'basic' as 'basic' | 'professional'
  });

  const [editTenant, setEditTenant] = useState<{
    userLimit: number;
    branches: string[];
    modules: any[];
  } | null>(null);

  // Platform Settings State
  const [settingsActiveTab, setSettingsActiveTab] = useState('system');
  const [platformSettings, setPlatformSettings] = useState({
    system: {
      platformName: 'aaraazi',
      platformUrl: 'https://aaraazi.pk',
      supportEmail: 'support@aaraazi.pk',
      systemVersion: '2.1.0',
      defaultTimezone: 'Asia/Karachi',
      defaultCurrency: 'PKR',
      defaultLanguage: 'en',
      maintenanceMode: false,
      allowRegistrations: true
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90,
      minPasswordLength: 8,
      ipWhitelist: '',
      requireTwoFactor: false,
      allowPasswordReset: true,
      requireSpecialChars: true,
      enableAuditLogs: true,
      enableCaptcha: false
    },
    email: {
      smtpHost: 'smtp.aaraazi.pk',
      smtpPort: 587,
      smtpUser: 'noreply@aaraazi.pk',
      smtpPassword: '',
      fromName: 'aaraazi',
      fromEmail: 'noreply@aaraazi.pk',
      maxEmailsPerHour: 1000,
      enableEmailVerification: true
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      smsProvider: 'twilio',
      smsApiKey: '',
      defaultNotificationSettings: ['tenant_created', 'billing_issues', 'security_alerts']
    },
    billing: {
      gracePeriodDays: 7,
      suspendAfterDays: 14,
      deleteAfterDays: 30,
      defaultPaymentMethod: 'bank_transfer',
      reminderDays: 3,
      autoSuspend: true,
      sendReminders: true,
      allowPartialPayments: false
    },
    modules: {
      enableAgencyModule: true,
      enableDevelopersModule: true,
      defaultModule: 'agency',
      trialPeriodDays: 14,
      agencyModulePrice: 5000,
      developersModulePrice: 7500,
      maxPropertiesPerTenant: 1000,
      maxUsersPerTenant: 25,
      maxStoragePerTenant: 5
    },
    compliance: {
      enforceDataRetention: true,
      requirePrivacyPolicy: true,
      requireTermsOfService: true,
      dataRetentionDays: 365,
      backupRetentionDays: 90,
      privacyPolicyUrl: 'https://aaraazi.pk/privacy',
      termsOfServiceUrl: 'https://aaraazi.pk/terms',
      enableFBRCompliance: true,
      validatePropertyRegistration: true
    },
    integrations: {
      enableJazzCash: true,
      enableEasyPaisa: true,
      enableBankTransfer: true,
      smsProvider: 'jazz',
      smsApiEndpoint: 'https://api.sms-provider.com/send',
      enableGoogleMaps: true,
      googleMapsApiKey: '',
      webhookUrl: '',
      webhookSecret: '',
      webhookEvents: ['tenant_created', 'payment_received', 'security_alert']
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const analyticsData = getSaaSAnalytics();
      const tenantsData = getTenants();
      const usersData = getSaaSUsers();
      
      setAnalytics(analyticsData);
      setTenants(tenantsData);
      setUsers(usersData.filter(u => u.role !== 'saas-admin'));

      // Enhanced mock account requests
      const mockRequests: AccountRequest[] = [
        {
          id: 'req-1',
          companyName: 'Karachi Properties Ltd',
          contactEmail: 'info@karachiproperties.pk',
          contactName: 'Hassan Malik',
          phone: '+92-21-1234567',
          requestedModules: ['agency'],
          businessType: 'agency',
          expectedUsers: 15,
          status: 'pending',
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Large real estate agency in Karachi looking to digitize operations.'
        },
        {
          id: 'req-2',
          companyName: 'Metro Developers',
          contactEmail: 'admin@metrodevelopers.pk',
          contactName: 'Fatima Sheikh',
          phone: '+92-42-9876543',
          requestedModules: ['developers', 'agency'],
          businessType: 'both',
          expectedUsers: 25,
          status: 'approved',
          requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Construction company expanding into real estate sales'
        },
        {
          id: 'req-3',
          companyName: 'Elite Builders',
          contactEmail: 'contact@elitebuilders.pk',
          contactName: 'Ahmed Khan',
          phone: '+92-21-5555555',
          requestedModules: ['developers'],
          businessType: 'developers',
          expectedUsers: 30,
          status: 'pending',
          requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'High-end residential and commercial developer'
        }
      ];
      setAccountRequests(mockRequests);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccountRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      toast.success('Account request approved successfully!');
      setShowRequestModal(false);
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccountRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected' }
            : req
        )
      );
      
      toast.success('Account request rejected');
      setShowRequestModal(false);
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTenants(prev => 
        prev.map(tenant => 
          tenant.id === tenantId 
            ? { ...tenant, status: 'suspended' }
            : tenant
        )
      );
      
      toast.success('Tenant suspended successfully');
      setShowTenantModal(false);
    } catch (error) {
      toast.error('Failed to suspend tenant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.domain || !newTenant.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const tenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: newTenant.name,
        domain: newTenant.domain,
        status: 'active',
        subscriptionPlan: {
          id: newTenant.plan,
          name: newTenant.plan === 'basic' ? 'Basic Plan' : 'Professional Plan',
          type: newTenant.plan as any,
          monthlyPrice: newTenant.plan === 'basic' ? 15000 : 25000,
          yearlyPrice: newTenant.plan === 'basic' ? 150000 : 250000,
          maxUsers: newTenant.plan === 'basic' ? 10 : 50,
          maxProperties: newTenant.plan === 'basic' ? 100 : 500,
          maxProjects: newTenant.plan === 'basic' ? 10 : 50,
          features: []
        },
        modules: newTenant.modules.map(moduleId => ({
          moduleId: moduleId as any,
          enabled: true,
          activatedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        userLimit: newTenant.plan === 'basic' ? 10 : 50,
        branches: ['Main Office'],
        billing: {
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'card'
        }
      };

      setTenants(prev => [tenant, ...prev]);
      setNewTenant({
        name: '',
        domain: '',
        contactEmail: '',
        contactName: '',
        phone: '',
        modules: [],
        plan: 'basic'
      });
      setShowAddTenantModal(false);
      
      toast.success('Tenant created successfully!');
    } catch (error) {
      toast.error('Failed to create tenant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditTenant({
      userLimit: tenant.userLimit || 50,
      branches: tenant.branches || ['Main Office'],
      modules: tenant.modules
    });
    setSelectedTenant(tenant);
    setShowTenantModal(true);
  };

  const handleUpdateTenantModules = async (moduleId: string, enabled: boolean) => {
    if (!selectedTenant || !editTenant) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedModules = editTenant.modules.map(m => 
        m.moduleId === moduleId ? { ...m, enabled } : m
      );
      
      setEditTenant({ ...editTenant, modules: updatedModules });
      
      setTenants(prev => 
        prev.map(tenant => 
          tenant.id === selectedTenant.id 
            ? { ...tenant, modules: updatedModules }
            : tenant
        )
      );
      
      toast.success(`Module ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update module status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserLimit = async (limit: number) => {
    if (!selectedTenant || !editTenant) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEditTenant({ ...editTenant, userLimit: limit });
      
      setTenants(prev => 
        prev.map(tenant => 
          tenant.id === selectedTenant.id 
            ? { ...tenant, userLimit: limit }
            : tenant
        )
      );
      
      toast.success('User limit updated successfully');
    } catch (error) {
      toast.error('Failed to update user limit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBranch = async () => {
    if (!selectedTenant || !editTenant || !newBranchName.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBranches = [...editTenant.branches, newBranchName.trim()];
      setEditTenant({ ...editTenant, branches: updatedBranches });
      
      setTenants(prev => 
        prev.map(tenant => 
          tenant.id === selectedTenant.id 
            ? { ...tenant, branches: updatedBranches }
            : tenant
        )
      );
      
      setNewBranchName('');
      toast.success('Branch added successfully');
    } catch (error) {
      toast.error('Failed to add branch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBranch = async (branchIndex: number) => {
    if (!selectedTenant || !editTenant) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBranches = editTenant.branches.filter((_, index) => index !== branchIndex);
      setEditTenant({ ...editTenant, branches: updatedBranches });
      
      setTenants(prev => 
        prev.map(tenant => 
          tenant.id === selectedTenant.id 
            ? { ...tenant, branches: updatedBranches }
            : tenant
        )
      );
      
      toast.success('Branch removed successfully');
    } catch (error) {
      toast.error('Failed to remove branch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Platform Settings Handlers
  const updatePlatformSettings = (section: string, field: string, value: any) => {
    setPlatformSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to backend
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-50 text-green-700 border-green-200' },
      trial: { label: 'Trial', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      suspended: { label: 'Suspended', color: 'bg-red-50 text-red-700 border-red-200' },
      cancelled: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200' },
      pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      approved: { label: 'Approved', color: 'bg-green-50 text-green-700 border-green-200' },
      rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge className={`${config.color} font-medium px-2 py-1`} variant="outline">
        {config.label}
      </Badge>
    );
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">SaaS Admin Console</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user.name} • Platform Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                <Activity className="w-3 h-3 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">Total Tenants</p>
                  <p className="text-3xl font-bold mt-1">{analytics.totalTenants}</p>
                  <div className="flex items-center mt-2 text-blue-100">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium">Active Users</p>
                  <p className="text-3xl font-bold mt-1">{users.length}</p>
                  <div className="flex items-center mt-2 text-green-100">
                    <UserCheck className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold mt-1">{formatPKR(analytics.revenue.monthly)}</p>
                  <div className="flex items-center mt-2 text-purple-100">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className="text-sm">+{analytics.revenue.growth}% growth</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 font-medium">Trial Accounts</p>
                  <p className="text-3xl font-bold mt-1">{analytics.trialTenants}</p>
                  <div className="flex items-center mt-2 text-orange-100">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-sm">Needs conversion</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tenants" className="space-y-6">
          <TabsList className="bg-white p-1 shadow-sm border">
            <TabsTrigger value="tenants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" />
              Tenants Management
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Account Requests
              {accountRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {accountRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Platform Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants" className="space-y-6">
            {/* Search and Filters */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Tenant Management
                    </CardTitle>
                    <CardDescription>
                      Manage all tenant accounts, subscriptions, and access
                    </CardDescription>
                  </div>
                  <Dialog open={showAddTenantModal} onOpenChange={setShowAddTenantModal}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create New Tenant</DialogTitle>
                        <DialogDescription>
                          Add a new tenant organization to the platform
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Organization Name *</Label>
                            <Input
                              id="name"
                              value={newTenant.name}
                              onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                              placeholder="Karachi Properties Ltd"
                            />
                          </div>
                          <div>
                            <Label htmlFor="domain">Domain *</Label>
                            <Input
                              id="domain"
                              value={newTenant.domain}
                              onChange={(e) => setNewTenant({...newTenant, domain: e.target.value})}
                              placeholder="karachi-properties"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="contactEmail">Contact Email *</Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={newTenant.contactEmail}
                              onChange={(e) => setNewTenant({...newTenant, contactEmail: e.target.value})}
                              placeholder="admin@company.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input
                              id="contactName"
                              value={newTenant.contactName}
                              onChange={(e) => setNewTenant({...newTenant, contactName: e.target.value})}
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={newTenant.phone}
                            onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                            placeholder="+92-21-1234567"
                          />
                        </div>
                        <div>
                          <Label>Subscription Plan</Label>
                          <Select value={newTenant.plan} onValueChange={(value) => setNewTenant({...newTenant, plan: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic Plan - {formatPKR(15000)}/month</SelectItem>
                              <SelectItem value="professional">Professional Plan - {formatPKR(25000)}/month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Available Modules</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              variant={newTenant.modules.includes('agency') ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const modules = newTenant.modules.includes('agency')
                                  ? newTenant.modules.filter(m => m !== 'agency')
                                  : [...newTenant.modules, 'agency'];
                                setNewTenant({...newTenant, modules});
                              }}
                            >
                              Agency Module
                            </Button>
                            <Button
                              type="button"
                              variant={newTenant.modules.includes('developers') ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const modules = newTenant.modules.includes('developers')
                                  ? newTenant.modules.filter(m => m !== 'developers')
                                  : [...newTenant.modules, 'developers'];
                                setNewTenant({...newTenant, modules});
                              }}
                            >
                              Developers Module
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddTenantModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTenant} disabled={isLoading}>
                          {isLoading ? 'Creating...' : 'Create Tenant'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tenants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tenants Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">{tenant.domain}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(tenant.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{tenant.subscriptionPlan.name}</div>
                            <div className="text-muted-foreground">{formatPKR(tenant.subscriptionPlan.monthlyPrice)}/mo</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {tenant.modules.filter(m => m.enabled).map((module) => (
                              <Badge key={module.moduleId} variant="secondary" className="text-xs">
                                {module.moduleId}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{users.filter(u => u.tenantId === tenant.id).length}/{tenant.userLimit || 50}</div>
                            <Progress value={(users.filter(u => u.tenantId === tenant.id).length / (tenant.userLimit || 50)) * 100} className="h-1 mt-1" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatPKR(tenant.subscriptionPlan.monthlyPrice)}</div>
                            <div className="text-muted-foreground">Monthly</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTenant(tenant)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Account Requests
                </CardTitle>
                <CardDescription>
                  Review and manage new account requests from potential customers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.companyName}</div>
                            <div className="text-sm text-muted-foreground">{request.businessType}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.contactName}</div>
                            <div className="text-sm text-muted-foreground">{request.contactEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {request.requestedModules.map((module) => (
                              <Badge key={module} variant="outline" className="text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{request.expectedUsers}</TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog open={showRequestModal && selectedRequest?.id === request.id} 
                                   onOpenChange={(open) => {
                                     setShowRequestModal(open);
                                     if (open) setSelectedRequest(request);
                                   }}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Account Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review the account request from {request.companyName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Company Name</Label>
                                      <p className="text-sm font-medium mt-1">{request.companyName}</p>
                                    </div>
                                    <div>
                                      <Label>Business Type</Label>
                                      <p className="text-sm font-medium mt-1">{request.businessType}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Contact Person</Label>
                                      <p className="text-sm font-medium mt-1">{request.contactName}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm font-medium mt-1">{request.contactEmail}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm font-medium mt-1">{request.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Expected Users</Label>
                                      <p className="text-sm font-medium mt-1">{request.expectedUsers}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Requested Modules</Label>
                                    <div className="flex gap-2 mt-1">
                                      {request.requestedModules.map((module) => (
                                        <Badge key={module} variant="secondary">
                                          {module}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {request.notes && (
                                    <div>
                                      <Label>Notes</Label>
                                      <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{request.notes}</p>
                                    </div>
                                  )}
                                </div>
                                {request.status === 'pending' && (
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => handleRejectRequest(request.id)}
                                      disabled={isLoading}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button 
                                      onClick={() => handleApproveRequest(request.id)}
                                      disabled={isLoading}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      {isLoading ? 'Processing...' : 'Approve'}
                                    </Button>
                                  </DialogFooter>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Monitor platform performance and growth metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and reporting features coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <LocationsManagement saasAdminId={user.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PlatformSettings 
              settings={platformSettings}
              activeTab={settingsActiveTab}
              setActiveTab={setSettingsActiveTab}
              updateSettings={updatePlatformSettings}
              onSave={handleSaveSettings}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tenant Detail Modal with Advanced Tabs */}
      <Dialog open={showTenantModal} onOpenChange={setShowTenantModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Tenant: {selectedTenant?.name}</DialogTitle>
            <DialogDescription>
              Configure tenant settings, modules, and access controls
            </DialogDescription>
          </DialogHeader>
          
          {selectedTenant && editTenant && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="users">Users & Limits</TabsTrigger>
                <TabsTrigger value="branches">Branches</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organization Name</Label>
                    <p className="text-sm font-medium mt-1">{selectedTenant.name}</p>
                  </div>
                  <div>
                    <Label>Domain</Label>
                    <p className="text-sm font-medium mt-1">{selectedTenant.domain}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedTenant.status)}
                    </div>
                  </div>
                  <div>
                    <Label>Subscription Plan</Label>
                    <p className="text-sm font-medium mt-1">{selectedTenant.subscriptionPlan.name}</p>
                  </div>
                  <div>
                    <Label>Monthly Revenue</Label>
                    <p className="text-sm font-medium mt-1">{formatPKR(selectedTenant.subscriptionPlan.monthlyPrice)}</p>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p className="text-sm font-medium mt-1">{new Date(selectedTenant.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <UserX className="w-4 h-4 mr-2" />
                        Suspend Tenant
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Suspend Tenant Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will suspend the tenant account and disable access to all modules. 
                          Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleSuspendTenant(selectedTenant.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Suspend Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4 mt-6">
                <div>
                  <h4 className="font-medium mb-3">Module Access Control</h4>
                  <div className="space-y-3">
                    {editTenant.modules.map((module) => (
                      <div key={module.moduleId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{module.moduleId} Module</div>
                          <div className="text-sm text-muted-foreground">
                            {module.moduleId === 'agency' ? 'Real estate agency management' : 'Construction and development projects'}
                          </div>
                        </div>
                        <Switch
                          checked={module.enabled}
                          onCheckedChange={(enabled) => handleUpdateTenantModules(module.moduleId, enabled)}
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-6">
                <div>
                  <h4 className="font-medium mb-3">User Limit Management</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Current User Limit</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          type="number"
                          value={editTenant.userLimit}
                          onChange={(e) => setEditTenant({...editTenant, userLimit: parseInt(e.target.value) || 0})}
                          className="w-32"
                          min="1"
                          max="999"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateUserLimit(editTenant.userLimit)}
                          disabled={isLoading}
                        >
                          Update Limit
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Current Usage</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{users.filter(u => u.tenantId === selectedTenant.id).length} of {editTenant.userLimit} users</span>
                          <span>{Math.round((users.filter(u => u.tenantId === selectedTenant.id).length / editTenant.userLimit) * 100)}%</span>
                        </div>
                        <Progress value={(users.filter(u => u.tenantId === selectedTenant.id).length / editTenant.userLimit) * 100} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="branches" className="space-y-4 mt-6">
                <div>
                  <h4 className="font-medium mb-3">Branch Management</h4>
                  
                  <div className="space-y-3 mb-4">
                    {editTenant.branches.map((branch, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{branch}</span>
                        </div>
                        {editTenant.branches.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBranch(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter branch name"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddBranch()}
                    />
                    <Button 
                      onClick={handleAddBranch}
                      disabled={!newBranchName.trim() || isLoading}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Branch
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTenantModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Platform Settings</DialogTitle>
            <DialogDescription>
              Configure global platform settings and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center py-8">
              <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Settings Configuration</h3>
              <p className="text-muted-foreground">
                Advanced platform settings panel will be available in the next update
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}