import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Investor, PropertyInvestment, ProfitDistribution, Property } from '../types';
import { 
  getInvestors, 
  saveInvestor, 
  deleteInvestor, 
  getInvestorStats, 
  getPropertyInvestmentsByInvestor,
  savePropertyInvestment,
  deletePropertyInvestment,
  getProfitDistributionsByInvestor,
  saveProfitDistribution
} from '../lib/investors';
import { getProperties } from '../lib/data';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import { syncPropertyInvestors, recalculateAllInvestorStats } from '../lib/investorIntegration';
import {
  Plus,
  Users,
  TrendingUp,
  DollarSign,
  Building2,
  Phone,
  Mail,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Briefcase,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  PieChart
} from 'lucide-react';

interface InvestorManagementEnhancedProps {
  user: User;
}

export const InvestorManagementEnhanced: React.FC<InvestorManagementEnhancedProps> = ({ user }) => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showInvestorDetailModal, setShowInvestorDetailModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [issyncing, setIsSyncing] = useState(false);

  // Form state for investor
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'individual' as 'individual' | 'company' | 'fund' | 'partnership',
    status: 'active' as 'active' | 'inactive' | 'prospective',
    address: '',
    nationalId: '',
    taxId: '',
    notes: ''
  });

  // Form state for new investment
  const [investmentFormData, setInvestmentFormData] = useState({
    propertyId: '',
    investmentAmount: '',
    profitSharePercentage: '',
    investmentDate: new Date().toISOString().split('T')[0],
    expectedReturn: '',
    agreementTerms: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allInvestors = getInvestors();
    setInvestors(allInvestors);
    
    const allProperties = getProperties(user.id, user.role);
    setProperties(allProperties);
  };

  const stats = useMemo(() => getInvestorStats(), [investors]);

  // Filtered investors
  const filteredInvestors = useMemo(() => {
    return investors.filter(investor => {
      const matchesSearch = 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;
      const matchesType = typeFilter === 'all' || investor.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [investors, searchTerm, statusFilter, typeFilter]);

  const handleOpenAddModal = () => {
    setEditingInvestor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'individual',
      status: 'active',
      address: '',
      nationalId: '',
      taxId: '',
      notes: ''
    });
    setShowAddInvestorModal(true);
  };

  const handleOpenEditModal = (investor: Investor) => {
    setEditingInvestor(investor);
    setFormData({
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      type: investor.type,
      status: investor.status,
      address: investor.address || '',
      nationalId: investor.nationalId || '',
      taxId: investor.taxId || '',
      notes: investor.notes || ''
    });
    setShowAddInvestorModal(true);
  };

  const handleSaveInvestor = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter investor name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter email address');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    const investorData: Investor = editingInvestor ? {
      ...editingInvestor,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      status: formData.status,
      address: formData.address,
      nationalId: formData.nationalId,
      taxId: formData.taxId,
      notes: formData.notes,
      updatedAt: new Date().toISOString()
    } : {
      id: `investor-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      status: formData.status,
      totalInvested: 0,
      totalProfitReceived: 0,
      totalProfitPending: 0,
      currentActiveInvestments: 0,
      address: formData.address,
      nationalId: formData.nationalId,
      taxId: formData.taxId,
      notes: formData.notes,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveInvestor(investorData);
    loadData();
    setShowAddInvestorModal(false);
    toast.success(editingInvestor ? 'Investor updated successfully' : 'Investor added successfully');
  };

  const handleDeleteInvestor = (id: string) => {
    if (confirm('Are you sure you want to delete this investor? This will also delete all associated investments.')) {
      deleteInvestor(id);
      loadData();
      toast.success('Investor deleted successfully');
    }
  };

  const handleViewInvestorDetail = (investor: Investor) => {
    setSelectedInvestor(investor);
    setShowInvestorDetailModal(true);
  };

  const handleOpenAddInvestmentModal = (investor: Investor) => {
    setSelectedInvestor(investor);
    setInvestmentFormData({
      propertyId: '',
      investmentAmount: '',
      profitSharePercentage: '',
      investmentDate: new Date().toISOString().split('T')[0],
      expectedReturn: '',
      agreementTerms: '',
      notes: ''
    });
    setShowAddInvestmentModal(true);
  };

  const handleSaveInvestment = () => {
    if (!selectedInvestor) return;

    if (!investmentFormData.propertyId) {
      toast.error('Please select a property');
      return;
    }

    if (!investmentFormData.investmentAmount || parseFloat(investmentFormData.investmentAmount) <= 0) {
      toast.error('Please enter a valid investment amount');
      return;
    }

    const property = properties.find(p => p.id === investmentFormData.propertyId);
    if (!property) {
      toast.error('Property not found');
      return;
    }

    const investment: PropertyInvestment = {
      id: `propinv-${Date.now()}`,
      propertyId: investmentFormData.propertyId,
      investorId: selectedInvestor.id,
      investorName: selectedInvestor.name,
      investmentAmount: parseFloat(investmentFormData.investmentAmount),
      investmentDate: investmentFormData.investmentDate,
      profitSharePercentage: parseFloat(investmentFormData.profitSharePercentage || '0'),
      status: 'active',
      expectedReturn: parseFloat(investmentFormData.expectedReturn || investmentFormData.investmentAmount),
      paymentStatus: 'invested',
      agreementTerms: investmentFormData.agreementTerms,
      notes: investmentFormData.notes,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    savePropertyInvestment(investment);
    loadData();
    setShowAddInvestmentModal(false);
    toast.success('Investment added successfully');
  };

  const handleSyncAllInvestments = async () => {
    setIsSyncing(true);
    try {
      // Sync all investor-purchase properties
      const investorProps = properties.filter(p => p.acquisitionType === 'investor-purchase');
      
      investorProps.forEach(property => {
        syncPropertyInvestors(property, user.id);
      });

      // Recalculate all stats
      recalculateAllInvestorStats();
      
      loadData();
      toast.success(`Synced ${investorProps.length} investor properties successfully`);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error syncing investments');
    } finally {
      setIsSyncing(false);
    }
  };

  // Get investor investments for detail view
  const getInvestorInvestments = (investorId: string): PropertyInvestment[] => {
    return getPropertyInvestmentsByInvestor(investorId);
  };

  // Get investor distributions for detail view
  const getInvestorDistributions = (investorId: string): ProfitDistribution[] => {
    return getProfitDistributionsByInvestor(investorId);
  };

  // Investor properties with details
  const investorProperties = useMemo(() => {
    return properties.filter(p => 
      p.acquisitionType === 'investor-purchase' && 
      p.purchaseDetails?.assignedInvestors && 
      p.purchaseDetails.assignedInvestors.length > 0
    );
  }, [properties]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl">Investor Management</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive investor tracking and portfolio management</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleSyncAllInvestments}
              disabled={issyncing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${issyncing ? 'animate-spin' : ''}`} />
              Sync from Inventory
            </Button>
            <Button onClick={handleOpenAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Investor
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Active Investors</p>
                <p className="text-3xl mb-1">{stats.totalActiveInvestors}</p>
                <p className="text-xs text-gray-500">
                  +{stats.ytd.newInvestors} new this year
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Capital Deployed</p>
                <p className="text-2xl mb-1">{formatPKR(stats.totalCapitalDeployed)}</p>
                <p className="text-xs text-gray-500">
                  {formatPKR(stats.ytd.capitalDeployed)} YTD
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Profits Distributed (YTD)</p>
                <p className="text-2xl mb-1">{formatPKR(stats.ytd.profitsDistributed)}</p>
                <p className="text-xs text-gray-500">
                  {stats.ytd.completedDeals} deals completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Active Investments</p>
                <p className="text-3xl mb-1">{stats.totalActiveInvestments}</p>
                <p className="text-xs text-gray-500">
                  Avg. Return: {stats.averageReturnRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties with Investor Funding */}
      {investorProperties.length > 0 && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Building2 className="w-5 h-5" />
              Properties with Investor Funding ({investorProperties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {investorProperties.slice(0, 6).map(property => (
                <div key={property.id} className="bg-white p-3 rounded-lg border border-blue-200">
                  <p className="font-medium text-sm mb-1">{property.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{property.address}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {property.purchaseDetails?.assignedInvestors?.length || 0} investors
                    </span>
                    <span className="font-medium text-green-700">
                      {formatPKR(property.purchaseDetails?.totalCostBasis || 0)}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-2 ${
                      property.status === 'sold' ? 'bg-green-50 text-green-700 border-green-200' : 
                      property.status === 'under-contract' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {property.status}
                  </Badge>
                </div>
              ))}
            </div>
            {investorProperties.length > 6 && (
              <p className="text-center text-sm text-gray-600 mt-3">
                +{investorProperties.length - 6} more properties
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospective">Prospective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="fund">Fund</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Investor Portfolio ({filteredInvestors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 text-gray-900">Investor Name</th>
                  <th className="text-left p-3 text-gray-900">Type</th>
                  <th className="text-right p-3 text-gray-900">Total Invested</th>
                  <th className="text-center p-3 text-gray-900">Active Investments</th>
                  <th className="text-right p-3 text-gray-900">Profit Received</th>
                  <th className="text-center p-3 text-gray-900">Status</th>
                  <th className="text-center p-3 text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No investors found</p>
                      <p className="text-xs mt-1">Add your first investor to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvestors.map((investor) => (
                    <tr key={investor.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="text-gray-900 font-medium">{investor.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {investor.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {investor.email}
                              </span>
                            )}
                            {investor.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {investor.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-gray-50 capitalize">
                          {investor.type}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-gray-900 font-medium">{formatPKR(investor.totalInvested)}</p>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {investor.currentActiveInvestments}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-green-700 font-medium">{formatPKR(investor.totalProfitReceived)}</p>
                        {investor.totalProfitPending > 0 && (
                          <p className="text-xs text-orange-600">
                            +{formatPKR(investor.totalProfitPending)} pending
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant="outline"
                          className={
                            investor.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : investor.status === 'inactive'
                              ? 'bg-gray-50 text-gray-700 border-gray-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }
                        >
                          {investor.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvestorDetail(investor)}
                            className="h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenAddInvestmentModal(investor)}
                            className="h-8 w-8 p-0"
                            title="Add Investment"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(investor)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvestor(investor.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Investor Modal */}
      <Dialog open={showAddInvestorModal} onOpenChange={setShowAddInvestorModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInvestor ? 'Edit Investor' : 'Add New Investor'}</DialogTitle>
            <DialogDescription>
              {editingInvestor
                ? 'Update investor information and details'
                : 'Add a new investor to your portfolio'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Investor Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name or company name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="fund">Fund</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="investor@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, city"
              />
            </div>

            {/* Legal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationalId">National ID / CNIC</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  placeholder="12345-1234567-1"
                />
              </div>
              <div>
                <Label htmlFor="taxId">NTN / Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Tax identification number"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospective">Prospective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this investor..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddInvestorModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInvestor}>
              {editingInvestor ? 'Update Investor' : 'Add Investor'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Investor Detail Modal */}
      {selectedInvestor && (
        <Dialog open={showInvestorDetailModal} onOpenChange={setShowInvestorDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedInvestor.name}
              </DialogTitle>
              <DialogDescription>
                Comprehensive investor profile and investment history
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="distributions">Distributions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Investor Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                      <p className="text-2xl text-green-700">{formatPKR(selectedInvestor.totalInvested)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Active Investments</p>
                      <p className="text-2xl">{selectedInvestor.currentActiveInvestments}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Profit Received</p>
                      <p className="text-2xl text-green-700">{formatPKR(selectedInvestor.totalProfitReceived)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Profit Pending</p>
                      <p className="text-2xl text-orange-600">{formatPKR(selectedInvestor.totalProfitPending)}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Investor Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Investor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="capitalize">{selectedInvestor.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <Badge variant="outline" className={
                        selectedInvestor.status === 'active' ? 'bg-green-50 text-green-700' :
                        selectedInvestor.status === 'inactive' ? 'bg-gray-50 text-gray-700' :
                        'bg-yellow-50 text-yellow-700'
                      }>
                        {selectedInvestor.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p>{selectedInvestor.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p>{selectedInvestor.phone}</p>
                    </div>
                    {selectedInvestor.address && (
                      <div className="col-span-2">
                        <p className="text-gray-600">Address</p>
                        <p>{selectedInvestor.address}</p>
                      </div>
                    )}
                    {selectedInvestor.nationalId && (
                      <div>
                        <p className="text-gray-600">National ID</p>
                        <p>{selectedInvestor.nationalId}</p>
                      </div>
                    )}
                    {selectedInvestor.taxId && (
                      <div>
                        <p className="text-gray-600">Tax ID</p>
                        <p>{selectedInvestor.taxId}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investments">
                <InvestorInvestmentsList 
                  investments={getInvestorInvestments(selectedInvestor.id)} 
                  properties={properties}
                />
              </TabsContent>

              <TabsContent value="distributions">
                <InvestorDistributionsList 
                  distributions={getInvestorDistributions(selectedInvestor.id)}
                  investorId={selectedInvestor.id}
                  properties={properties}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Investment Modal */}
      {selectedInvestor && (
        <Dialog open={showAddInvestmentModal} onOpenChange={setShowAddInvestmentModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Investment for {selectedInvestor.name}</DialogTitle>
              <DialogDescription>
                Record a new property investment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="propertyId">Property *</Label>
                <Select
                  value={investmentFormData.propertyId}
                  onValueChange={(value) => setInvestmentFormData({ ...investmentFormData, propertyId: value })}
                >
                  <SelectTrigger id="propertyId">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.filter(p => p.status === 'available' || p.status === 'negotiation').map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {formatPKR(property.price || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentAmount">Investment Amount (PKR) *</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentFormData.investmentAmount}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, investmentAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="profitSharePercentage">Profit Share Percentage</Label>
                  <Input
                    id="profitSharePercentage"
                    type="number"
                    value={investmentFormData.profitSharePercentage}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, profitSharePercentage: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentDate">Investment Date *</Label>
                  <Input
                    id="investmentDate"
                    type="date"
                    value={investmentFormData.investmentDate}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, investmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedReturn">Expected Return (PKR)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    value={investmentFormData.expectedReturn}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, expectedReturn: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="agreementTerms">Agreement Terms</Label>
                <Textarea
                  id="agreementTerms"
                  value={investmentFormData.agreementTerms}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, agreementTerms: e.target.value })}
                  placeholder="Terms and conditions of the investment..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="investmentNotes">Notes</Label>
                <Textarea
                  id="investmentNotes"
                  value={investmentFormData.notes}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddInvestmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveInvestment}>
                Add Investment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Helper component for investments list
const InvestorInvestmentsList: React.FC<{ investments: PropertyInvestment[], properties: Property[] }> = ({ investments, properties }) => {
  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No investments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {investments.map(investment => {
        const property = properties.find(p => p.id === investment.propertyId);
        const returnAmount = investment.actualReturn || investment.expectedReturn || 0;
        const profitAmount = returnAmount - investment.investmentAmount;
        const roi = investment.investmentAmount > 0 ? ((profitAmount / investment.investmentAmount) * 100) : 0;

        return (
          <Card key={investment.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium">{property?.title || 'Unknown Property'}</p>
                  <p className="text-sm text-gray-600">{property?.address}</p>
                </div>
                <Badge variant="outline" className={
                  investment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                  investment.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }>
                  {investment.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Investment</p>
                  <p className="font-medium text-green-700">{formatPKR(investment.investmentAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Expected Return</p>
                  <p className="font-medium">{formatPKR(returnAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">ROI</p>
                  <p className={`font-medium ${roi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {roi.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Investment Date</p>
                  <p>{new Date(investment.investmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Profit Share</p>
                  <p>{investment.profitSharePercentage}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Status</p>
                  <p className="capitalize">{investment.paymentStatus || 'invested'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Helper component for distributions list
const InvestorDistributionsList: React.FC<{ 
  distributions: ProfitDistribution[], 
  investorId: string,
  properties: Property[]
}> = ({ distributions, investorId, properties }) => {
  if (distributions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No profit distributions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {distributions.map(distribution => {
        const property = properties.find(p => p.id === distribution.propertyId);
        const investorDist = distribution.distributions.find(d => d.recipientId === investorId);
        if (!investorDist) return null;

        return (
          <Card key={distribution.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium">{property?.title || 'Unknown Property'}</p>
                  <p className="text-sm text-gray-600">
                    Sale Price: {formatPKR(distribution.finalSalePrice)} | 
                    Net Profit: {formatPKR(distribution.totalNetProfit)}
                  </p>
                </div>
                <Badge variant="outline" className={
                  investorDist.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                  investorDist.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }>
                  {investorDist.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                <div>
                  <p className="text-gray-600">Investment Returned</p>
                  <p className="font-medium">{formatPKR(investorDist.investmentAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Profit Share ({investorDist.profitSharePercentage}%)</p>
                  <p className="font-medium text-green-700">{formatPKR(investorDist.profitAmount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Total Payout</p>
                  <p className="text-xl font-medium text-green-700">{formatPKR(investorDist.totalPayout)}</p>
                </div>
                {investorDist.paymentDate && (
                  <div>
                    <p className="text-gray-600">Payment Date</p>
                    <p>{new Date(investorDist.paymentDate).toLocaleDateString()}</p>
                  </div>
                )}
                {investorDist.paymentMethod && (
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="capitalize">{investorDist.paymentMethod}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
