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
import { Progress } from './ui/progress';
import { User, Investor, PropertyInvestment, ProfitDistribution, Property } from '../types';

// PHASE 5: Import foundation components ✅
import { MetricCard } from './ui/metric-card';
import { InfoPanel } from './ui/info-panel';
import { 
  getInvestors, 
  saveInvestor, 
  deleteInvestor, 
  getInvestorStats, 
  getPropertyInvestmentsByInvestor,
  getPropertyInvestmentsByProperty,
  savePropertyInvestment,
  deletePropertyInvestment,
  getProfitDistributionsByInvestor,
  saveProfitDistribution,
  validateProfitShares,
  calculateInvestorPerformance,
  updateInvestorStats
} from '../lib/investors';
import { InvestorFormModal } from './InvestorFormModal';
import { InvestorDashboardCharts } from './InvestorDashboardCharts';
import { getProperties } from '../lib/data';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import { syncPropertyInvestors, recalculateAllInvestorStats } from '../lib/investorIntegration';
import { getPropertyInvestments } from '../lib/investors';
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
  PieChart,
  Filter,
  X,
  Landmark,
  FileCheck,
  TrendingDown,
  Calendar,
  Tag,
  ChevronDown,
  Settings,
  ChevronUp
} from 'lucide-react';

interface InvestorManagementEnhancedV2Props {
  user: User;
  onAddNew?: () => void;
  onEdit?: (investorId: string) => void;
}

export const InvestorManagementEnhancedV2: React.FC<InvestorManagementEnhancedV2Props> = ({ user, onAddNew, onEdit }) => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [allInvestments, setAllInvestments] = useState<PropertyInvestment[]>([]);
  const [showInvestorFormModal, setShowInvestorFormModal] = useState(false);
  const [showInvestorDetailModal, setShowInvestorDetailModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [issyncing, setIsSyncing] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    kycStatus: 'all',
    minInvestment: '',
    maxInvestment: '',
    minROI: '',
    maxROI: '',
    tags: [] as string[],
    hasActiveInvestments: false
  });

  // Form state for new investment
  const [investmentFormData, setInvestmentFormData] = useState({
    propertyId: '',
    investmentAmount: '',
    profitSharePercentage: '',
    investmentDate: new Date().toISOString().split('T')[0],
    expectedReturn: '',
    expectedReturnPercentage: '',
    agreementTerms: '',
    notes: ''
  });

  const [profitShareValidation, setProfitShareValidation] = useState<{
    valid: boolean;
    message?: string;
    totalPercentage: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allInvestors = getInvestors();
    setInvestors(allInvestors);
    
    const allProperties = getProperties(user.id, user.role);
    setProperties(allProperties);
    
    const investments = getPropertyInvestments();
    setAllInvestments(investments);
  };

  const stats = useMemo(() => {
    const baseStats = getInvestorStats();
    
    // Calculate additional stats that the UI expects
    const currentYear = new Date().getFullYear();
    const ytdInvestors = investors.filter(inv => {
      const createdYear = new Date(inv.createdAt).getFullYear();
      return createdYear === currentYear;
    });
    
    const ytdInvestments = allInvestments.filter(inv => {
      const investmentYear = new Date(inv.investmentDate).getFullYear();
      return investmentYear === currentYear;
    });
    
    const ytdCapitalDeployed = ytdInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const ytdProfitsDistributed = ytdInvestments
      .filter(inv => inv.status === 'exited')
      .reduce((sum, inv) => sum + (inv.actualReturn || 0) - inv.investmentAmount, 0);
    
    const ytdCompletedDeals = ytdInvestments.filter(inv => inv.status === 'exited').length;
    
    // Calculate total active investments and average return rate
    const activeInvestments = allInvestments.filter(inv => inv.status === 'active');
    const totalActiveInvestments = activeInvestments.length;
    
    const investmentsWithReturns = allInvestments.filter(inv => 
      inv.actualReturn !== undefined && inv.actualReturn > 0
    );
    const averageReturnRate = investmentsWithReturns.length > 0
      ? investmentsWithReturns.reduce((sum, inv) => {
          const returnRate = ((inv.actualReturn! - inv.investmentAmount) / inv.investmentAmount) * 100;
          return sum + returnRate;
        }, 0) / investmentsWithReturns.length
      : 0;
    
    return {
      totalInvestors: baseStats.totalInvestors,
      totalActiveInvestors: baseStats.activeInvestors,
      totalCapitalDeployed: baseStats.totalCapitalInvested,
      totalPortfolioValue: baseStats.totalPortfolioValue,
      averageROI: baseStats.averageROI,
      totalActiveProperties: baseStats.totalActiveProperties,
      totalActiveInvestments,
      averageReturnRate,
      ytd: {
        newInvestors: ytdInvestors.length,
        capitalDeployed: ytdCapitalDeployed,
        profitsDistributed: ytdProfitsDistributed,
        completedDeals: ytdCompletedDeals,
      }
    };
  }, [investors, allInvestments]);

  // Get all available agents for relationship manager assignment
  const agents = useMemo(() => {
    // In a real implementation, this would fetch from users table
    // For now, return current user
    return [user];
  }, [user]);

  // Advanced filtered investors
  const filteredInvestors = useMemo(() => {
    return investors.filter(investor => {
      // Basic search
      const matchesSearch = 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.phone.includes(searchTerm) ||
        (investor.nationalId && investor.nationalId.includes(searchTerm)) ||
        (investor.tags && investor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      // Status filter
      const matchesStatus = filters.status === 'all' || investor.status === filters.status;
      
      // Type filter
      const matchesType = filters.type === 'all' || investor.type === filters.type;
      
      // KYC status filter
      const matchesKYC = filters.kycStatus === 'all' || investor.kycStatus === filters.kycStatus;
      
      // Investment amount filter
      let matchesInvestmentRange = true;
      if (filters.minInvestment) {
        matchesInvestmentRange = investor.totalInvested >= parseFloat(filters.minInvestment);
      }
      if (filters.maxInvestment && matchesInvestmentRange) {
        matchesInvestmentRange = investor.totalInvested <= parseFloat(filters.maxInvestment);
      }
      
      // ROI filter
      let matchesROI = true;
      if (filters.minROI && investor.averageROI) {
        matchesROI = investor.averageROI >= parseFloat(filters.minROI);
      }
      if (filters.maxROI && matchesROI && investor.averageROI) {
        matchesROI = investor.averageROI <= parseFloat(filters.maxROI);
      }
      
      // Tags filter
      let matchesTags = true;
      if (filters.tags.length > 0 && investor.tags) {
        matchesTags = filters.tags.some(tag => investor.tags?.includes(tag));
      }
      
      // Active investments filter
      const matchesActiveInvestments = !filters.hasActiveInvestments || investor.currentActiveInvestments > 0;
      
      return matchesSearch && matchesStatus && matchesType && matchesKYC && 
             matchesInvestmentRange && matchesROI && matchesTags && matchesActiveInvestments;
    });
  }, [investors, searchTerm, filters]);

  const handleOpenAddModal = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      setEditingInvestor(null);
      setShowInvestorFormModal(true);
    }
  };

  const handleOpenEditModal = (investor: Investor) => {
    if (onEdit) {
      onEdit(investor.id);
    } else {
      setEditingInvestor(investor);
      setShowInvestorFormModal(true);
    }
  };

  const handleSaveInvestor = (investorData: Partial<Investor>) => {
    const fullInvestorData: Investor = editingInvestor ? {
      ...editingInvestor,
      ...investorData,
      updatedAt: new Date().toISOString()
    } : {
      id: `investor-${Date.now()}`,
      name: investorData.name!,
      email: investorData.email!,
      phone: investorData.phone!,
      type: investorData.type || 'individual',
      status: investorData.status || 'active',
      totalInvested: 0,
      totalProfitReceived: 0,
      totalProfitPending: 0,
      currentActiveInvestments: 0,
      averageROI: 0,
      ...investorData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveInvestor(fullInvestorData);
    loadData();
    setShowInvestorFormModal(false);
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
      expectedReturnPercentage: '',
      agreementTerms: '',
      notes: ''
    });
    setProfitShareValidation(null);
    setShowAddInvestmentModal(true);
  };

  // Validate profit share when property or percentage changes
  useEffect(() => {
    if (investmentFormData.propertyId && investmentFormData.profitSharePercentage) {
      const percentage = parseFloat(investmentFormData.profitSharePercentage);
      if (!isNaN(percentage) && percentage > 0) {
        const validation = validateProfitShares(investmentFormData.propertyId, percentage);
        setProfitShareValidation(validation);
      }
    }
  }, [investmentFormData.propertyId, investmentFormData.profitSharePercentage]);

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

    const profitShare = parseFloat(investmentFormData.profitSharePercentage || '0');
    if (profitShare < 0 || profitShare > 100) {
      toast.error('Profit share must be between 0 and 100%');
      return;
    }

    // Validate profit shares
    const validation = validateProfitShares(investmentFormData.propertyId, profitShare);
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid profit share percentage');
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
      propertyTitle: property.title,
      investorId: selectedInvestor.id,
      investorName: selectedInvestor.name,
      investmentAmount: parseFloat(investmentFormData.investmentAmount),
      investmentDate: investmentFormData.investmentDate,
      profitSharePercentage: profitShare,
      status: 'active',
      expectedReturn: investmentFormData.expectedReturn ? parseFloat(investmentFormData.expectedReturn) : undefined,
      expectedReturnPercentage: investmentFormData.expectedReturnPercentage ? parseFloat(investmentFormData.expectedReturnPercentage) : undefined,
      agreementTerms: investmentFormData.agreementTerms || undefined,
      notes: investmentFormData.notes || undefined,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    savePropertyInvestment(investment);
    updateInvestorStats(selectedInvestor.id);
    loadData();
    setShowAddInvestmentModal(false);
    toast.success('Investment added successfully');
  };

  const handleSyncAllInvestments = async () => {
    setIsSyncing(true);
    try {
      const investorProps = properties.filter(p => p.acquisitionType === 'investor-purchase');
      
      investorProps.forEach(property => {
        syncPropertyInvestors(property, user.id);
      });

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

  const getInvestorInvestments = (investorId: string): PropertyInvestment[] => {
    return getPropertyInvestmentsByInvestor(investorId);
  };

  const getInvestorDistributions = (investorId: string): ProfitDistribution[] => {
    return getProfitDistributionsByInvestor(investorId);
  };

  const investorProperties = useMemo(() => {
    return properties.filter(p => 
      p.acquisitionType === 'investor-purchase' && 
      p.purchaseDetails?.assignedInvestors && 
      p.purchaseDetails.assignedInvestors.length > 0
    );
  }, [properties]);

  const clearFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      kycStatus: 'all',
      minInvestment: '',
      maxInvestment: '',
      minROI: '',
      maxROI: '',
      tags: [],
      hasActiveInvestments: false
    });
    setSearchTerm('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.kycStatus !== 'all') count++;
    if (filters.minInvestment) count++;
    if (filters.maxInvestment) count++;
    if (filters.minROI) count++;
    if (filters.maxROI) count++;
    if (filters.tags.length > 0) count++;
    if (filters.hasActiveInvestments) count++;
    return count;
  }, [filters]);

  const getKYCStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const colors = {
      verified: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || 'bg-gray-100'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getROIIndicator = (roi?: number) => {
    if (!roi || roi === 0) return null;
    
    return (
      <span className={`flex items-center gap-1 text-xs ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {roi > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {roi.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-gray-900">Investor Management</h1>
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
            <Button onClick={handleOpenAddModal} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
                <p className="text-gray-900 mb-1" style={{ fontSize: '1.875rem', fontWeight: '500' }}>
                  {stats.totalActiveInvestors}
                </p>
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
                <p className="text-gray-900 mb-1" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
                  {formatPKR(stats.totalCapitalDeployed)}
                </p>
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
                <p className="text-gray-900 mb-1" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
                  {formatPKR(stats.ytd.profitsDistributed)}
                </p>
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
                <p className="text-gray-900 mb-1" style={{ fontSize: '1.875rem', fontWeight: '500' }}>
                  {stats.totalActiveInvestments}
                </p>
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

      {/* Dashboard Charts */}
      <InvestorDashboardCharts investors={investors} investments={allInvestments} />

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
                  <p className="text-sm text-gray-900 mb-1" style={{ fontWeight: '500' }}>{property.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{property.address}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {property.purchaseDetails?.assignedInvestors?.length || 0} investors
                    </span>
                    <span className="text-green-700" style={{ fontWeight: '500' }}>
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
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, email, phone, CNIC, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
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
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
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

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="gap-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 border-blue-200">
                  {activeFiltersCount}
                </Badge>
              )}
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2 text-sm text-red-600">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-600">KYC Status</Label>
                <Select value={filters.kycStatus} onValueChange={(value) => setFilters({...filters, kycStatus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All KYC Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KYC Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Min Investment (PKR)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000000"
                  value={filters.minInvestment}
                  onChange={(e) => setFilters({...filters, minInvestment: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Max Investment (PKR)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 50000000"
                  value={filters.maxInvestment}
                  onChange={(e) => setFilters({...filters, maxInvestment: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Min ROI (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 10"
                  value={filters.minROI}
                  onChange={(e) => setFilters({...filters, minROI: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Max ROI (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 50"
                  value={filters.maxROI}
                  onChange={(e) => setFilters({...filters, maxROI: e.target.value})}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasActiveInvestments}
                    onChange={(e) => setFilters({...filters, hasActiveInvestments: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Has Active Investments</span>
                </label>
              </div>
            </div>
          )}
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
                  <th className="text-center p-3 text-gray-900">KYC Status</th>
                  <th className="text-right p-3 text-gray-900">Total Invested</th>
                  <th className="text-center p-3 text-gray-900">Active</th>
                  <th className="text-right p-3 text-gray-900">Profit Received</th>
                  <th className="text-center p-3 text-gray-900">ROI</th>
                  <th className="text-center p-3 text-gray-900">Status</th>
                  <th className="text-center p-3 text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No investors found</p>
                      <p className="text-xs mt-1">
                        {searchTerm || activeFiltersCount > 0 
                          ? 'Try adjusting your search or filters' 
                          : 'Add your first investor to get started'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInvestors.map((investor) => (
                    <tr key={investor.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900" style={{ fontWeight: '500' }}>{investor.name}</p>
                            {investor.preferences && (
                              <span 
                                className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded"
                                title="Has preferences configured"
                              >
                                <Settings className="w-3 h-3" />
                              </span>
                            )}
                            {investor.bankDetails && (
                              <span 
                                className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded"
                                title="Has bank details"
                              >
                                <Landmark className="w-3 h-3" />
                              </span>
                            )}
                          </div>
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
                          {investor.tags && investor.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {investor.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                  {tag}
                                </Badge>
                              ))}
                              {investor.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs bg-gray-50">
                                  +{investor.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          {investor.preferences?.preferredPropertyTypes && investor.preferences.preferredPropertyTypes.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Prefers: {investor.preferences.preferredPropertyTypes.slice(0, 2).join(', ')}
                              {investor.preferences.preferredPropertyTypes.length > 2 && ` +${investor.preferences.preferredPropertyTypes.length - 2}`}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-gray-50 capitalize">
                          {investor.type}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        {getKYCStatusBadge(investor.kycStatus)}
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-gray-900" style={{ fontWeight: '500' }}>
                          {formatPKR(investor.totalInvested)}
                        </p>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full" style={{ fontWeight: '500' }}>
                          {investor.currentActiveInvestments}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-green-700" style={{ fontWeight: '500' }}>
                          {formatPKR(investor.totalProfitReceived)}
                        </p>
                        {investor.totalProfitPending > 0 && (
                          <p className="text-xs text-orange-600">
                            +{formatPKR(investor.totalProfitPending)} pending
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {getROIIndicator(investor.averageROI)}
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

      {/* Investor Form Modal */}
      <InvestorFormModal
        open={showInvestorFormModal}
        onClose={() => setShowInvestorFormModal(false)}
        onSave={handleSaveInvestor}
        investor={editingInvestor}
        user={user}
        agents={agents}
      />

      {/* Add Investment Modal */}
      <Dialog open={showAddInvestmentModal} onOpenChange={setShowAddInvestmentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Add Investment for {selectedInvestor?.name}
            </DialogTitle>
            <DialogDescription>
              Record a new investment with profit share allocation and expected returns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="property">Property <span className="text-red-500">*</span></Label>
              <Select 
                value={investmentFormData.propertyId} 
                onValueChange={(value) => setInvestmentFormData({ ...investmentFormData, propertyId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties
                    .filter(p => p.status !== 'sold')
                    .map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {formatPKR(property.price)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Investment Amount (PKR) <span className="text-red-500">*</span></Label>
                <Input
                  id="amount"
                  type="number"
                  value={investmentFormData.investmentAmount}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, investmentAmount: e.target.value })}
                  placeholder="e.g., 5000000"
                />
              </div>

              <div>
                <Label htmlFor="profitShare">
                  Profit Share (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="profitShare"
                  type="number"
                  step="0.1"
                  max="100"
                  value={investmentFormData.profitSharePercentage}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, profitSharePercentage: e.target.value })}
                  placeholder="e.g., 30"
                  className={profitShareValidation && !profitShareValidation.valid ? 'border-red-500' : ''}
                />
                {profitShareValidation && (
                  <div className={`text-xs mt-1 flex items-center gap-1 ${profitShareValidation.valid ? 'text-blue-600' : 'text-red-600'}`}>
                    {profitShareValidation.valid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {profitShareValidation.message || `Total allocated: ${profitShareValidation.totalPercentage}%, Agency: ${100 - profitShareValidation.totalPercentage}%`}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedReturn">Expected Return (PKR)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={investmentFormData.expectedReturn}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, expectedReturn: e.target.value })}
                  placeholder="e.g., 7000000"
                />
              </div>

              <div>
                <Label htmlFor="expectedReturnPct">Expected Return (%)</Label>
                <Input
                  id="expectedReturnPct"
                  type="number"
                  step="0.1"
                  value={investmentFormData.expectedReturnPercentage}
                  onChange={(e) => setInvestmentFormData({ ...investmentFormData, expectedReturnPercentage: e.target.value })}
                  placeholder="e.g., 40"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="investmentDate">Investment Date</Label>
              <Input
                id="investmentDate"
                type="date"
                value={investmentFormData.investmentDate}
                onChange={(e) => setInvestmentFormData({ ...investmentFormData, investmentDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="agreementTerms">Agreement Terms</Label>
              <Textarea
                id="agreementTerms"
                value={investmentFormData.agreementTerms}
                onChange={(e) => setInvestmentFormData({ ...investmentFormData, agreementTerms: e.target.value })}
                placeholder="Key terms and conditions..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={investmentFormData.notes}
                onChange={(e) => setInvestmentFormData({ ...investmentFormData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddInvestmentModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveInvestment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!profitShareValidation?.valid && !!investmentFormData.profitSharePercentage}
            >
              Add Investment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Investor Detail Modal - Will be enhanced in next iteration */}
      {selectedInvestor && (
        <Dialog open={showInvestorDetailModal} onOpenChange={setShowInvestorDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedInvestor.name}
              </DialogTitle>
              <DialogDescription>
                View complete investor profile, investments, and profit distributions
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="distributions">Distributions</TabsTrigger>
              </TabsList>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600">Email</Label>
                    <p className="text-sm text-gray-900">{selectedInvestor.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Phone</Label>
                    <p className="text-sm text-gray-900">{selectedInvestor.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Type</Label>
                    <Badge variant="outline" className="capitalize">{selectedInvestor.type}</Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Status</Label>
                    <Badge variant="outline" className={
                      selectedInvestor.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                    }>
                      {selectedInvestor.status}
                    </Badge>
                  </div>
                  {selectedInvestor.kycStatus && (
                    <div>
                      <Label className="text-xs text-gray-600">KYC Status</Label>
                      <div>{getKYCStatusBadge(selectedInvestor.kycStatus)}</div>
                    </div>
                  )}
                  {selectedInvestor.relationshipManager && (
                    <div>
                      <Label className="text-xs text-gray-600">Relationship Manager</Label>
                      <p className="text-sm text-gray-900">
                        {agents.find(a => a.id === selectedInvestor.relationshipManager)?.name || 
                         (selectedInvestor.relationshipManager === user.id ? user.name : 'Unknown')}
                      </p>
                    </div>
                  )}
                </div>

                {selectedInvestor.tags && selectedInvestor.tags.length > 0 && (
                  <div className="pt-3 border-t">
                    <Label className="text-xs text-gray-600 mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-xs text-gray-600">Total Invested</Label>
                    <p className="text-gray-900" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
                      {formatPKR(selectedInvestor.totalInvested)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Profit Received</Label>
                    <p className="text-green-700" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
                      {formatPKR(selectedInvestor.totalProfitReceived)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Average ROI</Label>
                    <p className="text-blue-700" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
                      {selectedInvestor.averageROI?.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>

                {selectedInvestor.notes && (
                  <div className="pt-4 border-t">
                    <Label className="text-xs text-gray-600 mb-2 block">Notes</Label>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInvestor.notes}</p>
                  </div>
                )}
              </TabsContent>

              {/* DETAILS TAB */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedInvestor.address && (
                    <div>
                      <Label className="text-xs text-gray-600">Address</Label>
                      <p className="text-sm text-gray-900">{selectedInvestor.address}</p>
                    </div>
                  )}
                  {selectedInvestor.city && (
                    <div>
                      <Label className="text-xs text-gray-600">City</Label>
                      <p className="text-sm text-gray-900">{selectedInvestor.city}</p>
                    </div>
                  )}
                  {selectedInvestor.nationalId && (
                    <div>
                      <Label className="text-xs text-gray-600">CNIC</Label>
                      <p className="text-sm text-gray-900">{selectedInvestor.nationalId}</p>
                    </div>
                  )}
                  {selectedInvestor.taxId && (
                    <div>
                      <Label className="text-xs text-gray-600">NTN/Tax ID</Label>
                      <p className="text-sm text-gray-900">{selectedInvestor.taxId}</p>
                    </div>
                  )}
                  {selectedInvestor.sourceOfFunds && (
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">Source of Funds</Label>
                      <p className="text-sm text-gray-900">{selectedInvestor.sourceOfFunds}</p>
                    </div>
                  )}
                </div>

                {selectedInvestor.secondaryContact && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm text-gray-900 mb-3" style={{ fontWeight: '500' }}>Secondary Contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">Name</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.secondaryContact.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Relationship</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.secondaryContact.relationship || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Phone</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.secondaryContact.phone}</p>
                      </div>
                      {selectedInvestor.secondaryContact.email && (
                        <div>
                          <Label className="text-xs text-gray-600">Email</Label>
                          <p className="text-sm text-gray-900">{selectedInvestor.secondaryContact.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedInvestor.bankDetails && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm text-gray-900 mb-3" style={{ fontWeight: '500' }}>Bank Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">Account Title</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.accountTitle}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Account Number</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Bank Name</Label>
                        <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.bankName}</p>
                      </div>
                      {selectedInvestor.bankDetails.branchName && (
                        <div>
                          <Label className="text-xs text-gray-600">Branch</Label>
                          <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.branchName}</p>
                        </div>
                      )}
                      {selectedInvestor.bankDetails.iban && (
                        <div>
                          <Label className="text-xs text-gray-600">IBAN</Label>
                          <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.iban}</p>
                        </div>
                      )}
                      {selectedInvestor.bankDetails.swiftCode && (
                        <div>
                          <Label className="text-xs text-gray-600">SWIFT Code</Label>
                          <p className="text-sm text-gray-900">{selectedInvestor.bankDetails.swiftCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedInvestor.kycStatus && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm text-gray-900 mb-3" style={{ fontWeight: '500' }}>KYC Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">KYC Status</Label>
                        <div className="mt-1">{getKYCStatusBadge(selectedInvestor.kycStatus)}</div>
                      </div>
                      {selectedInvestor.kycVerifiedDate && (
                        <div>
                          <Label className="text-xs text-gray-600">Verified Date</Label>
                          <p className="text-sm text-gray-900">{new Date(selectedInvestor.kycVerifiedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedInvestor.kycExpiryDate && (
                        <div>
                          <Label className="text-xs text-gray-600">Expiry Date</Label>
                          <p className="text-sm text-gray-900">{new Date(selectedInvestor.kycExpiryDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedInvestor.kycNotes && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-600">KYC Notes</Label>
                          <p className="text-sm text-gray-900">{selectedInvestor.kycNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* PREFERENCES TAB */}
              <TabsContent value="preferences" className="space-y-4">
                {selectedInvestor.preferences ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedInvestor.preferences.minInvestmentAmount !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-600">Minimum Investment</Label>
                          <p className="text-sm text-gray-900">{formatPKR(selectedInvestor.preferences.minInvestmentAmount)}</p>
                        </div>
                      )}
                      {selectedInvestor.preferences.maxInvestmentAmount !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-600">Maximum Investment</Label>
                          <p className="text-sm text-gray-900">{formatPKR(selectedInvestor.preferences.maxInvestmentAmount)}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-gray-600">Risk Tolerance</Label>
                        <Badge variant="outline" className={
                          selectedInvestor.preferences.riskTolerance === 'high' ? 'bg-red-50 text-red-700' :
                          selectedInvestor.preferences.riskTolerance === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }>
                          {selectedInvestor.preferences.riskTolerance?.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Investment Strategy</Label>
                        <Badge variant="outline" className="capitalize">
                          {selectedInvestor.preferences.investmentStrategy?.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {selectedInvestor.preferences.preferredPropertyTypes && selectedInvestor.preferences.preferredPropertyTypes.length > 0 && (
                      <div className="pt-3 border-t">
                        <Label className="text-xs text-gray-600 mb-2 block">Preferred Property Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedInvestor.preferences.preferredPropertyTypes.map(type => (
                            <Badge key={type} variant="outline" className="bg-blue-50 text-blue-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedInvestor.preferences.preferredLocations && selectedInvestor.preferences.preferredLocations.length > 0 && (
                      <div className="pt-3 border-t">
                        <Label className="text-xs text-gray-600 mb-2 block">Preferred Locations</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedInvestor.preferences.preferredLocations.map(loc => (
                            <Badge key={loc} variant="outline" className="bg-green-50 text-green-700">
                              {loc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No preferences configured</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => {
                        setEditingInvestor(selectedInvestor);
                        setShowInvestorDetailModal(false);
                        setShowInvestorFormModal(true);
                      }}
                    >
                      Add Preferences
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="investments">
                <div className="space-y-3">
                  {getInvestorInvestments(selectedInvestor.id).map(inv => (
                    <div key={inv.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900" style={{ fontWeight: '500' }}>{inv.propertyTitle || inv.propertyId}</p>
                          <p className="text-xs text-gray-600">Invested on {new Date(inv.investmentDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className={
                          inv.status === 'active' ? 'bg-blue-50 text-blue-700' : 
                          inv.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-gray-50'
                        }>
                          {inv.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-xs text-gray-600">Amount:</span>
                          <p className="text-gray-900" style={{ fontWeight: '500' }}>{formatPKR(inv.investmentAmount)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Profit Share:</span>
                          <p className="text-gray-900" style={{ fontWeight: '500' }}>{inv.profitSharePercentage}%</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Expected Return:</span>
                          <p className="text-gray-900" style={{ fontWeight: '500' }}>
                            {inv.expectedReturn ? formatPKR(inv.expectedReturn) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getInvestorInvestments(selectedInvestor.id).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No investments found</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="distributions">
                <div className="space-y-3">
                  {getInvestorDistributions(selectedInvestor.id).map(dist => {
                    const investorDist = dist.distributions.find(d => d.recipientId === selectedInvestor.id);
                    if (!investorDist) return null;

                    return (
                      <div key={dist.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-900" style={{ fontWeight: '500' }}>{dist.propertyTitle || dist.propertyId}</p>
                            <p className="text-xs text-gray-600">Transaction: {dist.transactionId}</p>
                          </div>
                          <Badge variant="outline" className={
                            investorDist.status === 'paid' ? 'bg-green-50 text-green-700' :
                            investorDist.status === 'approved' ? 'bg-blue-50 text-blue-700' :
                            'bg-yellow-50 text-yellow-700'
                          }>
                            {investorDist.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-xs text-gray-600">Profit Amount:</span>
                            <p className="text-green-700" style={{ fontWeight: '500' }}>{formatPKR(investorDist.profitAmount)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Share:</span>
                            <p className="text-gray-900" style={{ fontWeight: '500' }}>{investorDist.profitSharePercentage}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {getInvestorDistributions(selectedInvestor.id).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No distributions found</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
