import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { User, Investor } from '../types';
import { getInvestors, saveInvestor, deleteInvestor, getInvestorStats, getPropertyInvestmentsByInvestor } from '../lib/investors';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
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
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase
} from 'lucide-react';

interface InvestorManagementDashboardProps {
  user: User;
}

export const InvestorManagementDashboard: React.FC<InvestorManagementDashboardProps> = ({ user }) => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Form state
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

  useEffect(() => {
    loadInvestors();
  }, []);

  const loadInvestors = () => {
    const allInvestors = getInvestors();
    setInvestors(allInvestors);
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
    loadInvestors();
    setShowAddInvestorModal(false);
    toast.success(editingInvestor ? 'Investor updated successfully' : 'Investor added successfully');
  };

  const handleDeleteInvestor = (id: string) => {
    if (confirm('Are you sure you want to delete this investor? This action cannot be undone.')) {
      deleteInvestor(id);
      loadInvestors();
      toast.success('Investor deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl">Investor Management</h1>
          <Button onClick={handleOpenAddModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Investor
          </Button>
        </div>
        <p className="text-sm text-gray-600">Manage investor relationships and track capital deployment</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Active Investors</p>
                <p className="text-3xl">{stats.totalActiveInvestors}</p>
                <p className="text-xs text-gray-500 mt-1">
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
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Capital Deployed</p>
                <p className="text-3xl">{formatPKR(stats.totalCapitalDeployed)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPKR(stats.ytd.capitalDeployed)} deployed YTD
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
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Profits Distributed (YTD)</p>
                <p className="text-3xl">{formatPKR(stats.ytd.profitsDistributed)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.ytd.completedDeals} deals completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <th className="text-right p-3 text-gray-900">Total Amount Invested</th>
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
                          <p className="text-gray-900">{investor.name}</p>
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
                        <p className="text-gray-900">{formatPKR(investor.totalInvested)}</p>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full">
                          {investor.currentActiveInvestments}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-green-700">{formatPKR(investor.totalProfitReceived)}</p>
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
                        <div className="flex items-center justify-center gap-2">
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
    </div>
  );
};
