import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Property, User } from '../types';
import { getProperties, getPropertyPayments, getContextualSuggestions } from '../lib/data';
import { getActiveTransaction } from '../lib/transactions';
import { formatCurrency, formatCurrencyShort, formatArea } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { isPropertyExpired, getExpiringSoonProperties, calculateDaysOnMarket, isPropertyFeatured } from '../lib/phase3Enhancements';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Eye,
  Edit,
  Share2,
  Building,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Users,
  Phone,
  Map,
  Home,
  Calculator,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface InventoryProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

interface VisualPropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  unitType: 'apartment' | 'plot' | 'commercial' | 'townhouse';
  size: number;
  floor?: number;
  position: { x: number; y: number };
  price: number;
  financialStatus: 'available' | 'sold-paid' | 'sold-installments' | 'overdue';
  costBasis?: number;
  projectedProfit?: number;
  clientName?: string;
  paymentProgress?: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
}

export const Inventory: React.FC<InventoryProps> = ({ user, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'visual'>('grid');
  const [activeTab, setActiveTab] = useState<'for-sale' | 'for-rent' | 'wanted'>('for-sale');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [acquisitionTypeFilter, setAcquisitionTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState<Property | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock visual property units data
  const getVisualPropertyUnits = (propertyId: string): VisualPropertyUnit[] => {
    // Generate mock units for demonstration
    const units: VisualPropertyUnit[] = [];
    const floors = 5;
    const unitsPerFloor = 8;
    
    for (let floor = 1; floor <= floors; floor++) {
      for (let unit = 1; unit <= unitsPerFloor; unit++) {
        const unitId = `${floor.toString().padStart(2, '0')}${unit.toString().padStart(2, '0')}`;
        const statuses: VisualPropertyUnit['financialStatus'][] = ['available', 'sold-paid', 'sold-installments', 'overdue'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        units.push({
          id: `unit-${unitId}`,
          propertyId,
          unitNumber: `A-${unitId}`,
          unitType: 'apartment',
          size: 1200 + Math.floor(Math.random() * 800),
          floor,
          position: { x: unit * 120, y: floor * 80 },
          price: 150000 + Math.floor(Math.random() * 100000),
          financialStatus: randomStatus,
          costBasis: 85000 + Math.floor(Math.random() * 30000),
          projectedProfit: 65000 + Math.floor(Math.random() * 20000),
          clientName: randomStatus !== 'available' ? `Client ${unitId}` : undefined,
          paymentProgress: randomStatus === 'sold-installments' ? Math.floor(Math.random() * 80) + 20 : undefined,
          lastPaymentDate: randomStatus !== 'available' ? '2024-01-15' : undefined,
          nextDueDate: randomStatus === 'sold-installments' || randomStatus === 'overdue' ? '2024-02-15' : undefined
        });
      }
    }
    
    return units;
  };

  const getFinancialStatusColor = (status: VisualPropertyUnit['financialStatus']) => {
    switch (status) {
      case 'sold-paid':
        return 'bg-green-500 hover:bg-green-600 border-green-600';
      case 'sold-installments':
        return 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600';
      case 'available':
        return 'bg-blue-500 hover:bg-blue-600 border-blue-600';
      case 'overdue':
        return 'bg-red-500 hover:bg-red-600 border-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600 border-gray-600';
    }
  };

  const getFinancialStatusLabel = (status: VisualPropertyUnit['financialStatus']) => {
    switch (status) {
      case 'sold-paid':
        return 'Sold & Fully Paid';
      case 'sold-installments':
        return 'Sold & Installments Ongoing';
      case 'available':
        return 'Available for Sale';
      case 'overdue':
        return 'Booked but Payment Overdue';
      default:
        return 'Unknown Status';
    }
  };

  // Add effect to listen for storage changes (when properties are updated in other components)
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'estate_properties') {
        setRefreshKey(prev => prev + 1);
      }
    };
    
    // Custom event for same-window updates
    const handlePropertyUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('propertyUpdated', handlePropertyUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertyUpdated', handlePropertyUpdate);
    };
  }, []);

  const properties = useMemo(() => 
    getProperties(user.id, user.role), [user.id, user.role, refreshKey]
  );

  const filteredProperties = useMemo(() => {
    try {
      if (!Array.isArray(properties)) {
        console.error('Properties is not an array');
        return [];
      }

      return properties.filter(property => {
        // Validate property object
        if (!property || typeof property !== 'object') {
          return false;
        }

        try {
          const matchesTab = property.listingType === activeTab;
          const matchesSearch = searchTerm === '' || 
            (property.title && property.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (property.address && property.address.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
          const matchesType = propertyTypeFilter === 'all' || property.propertyType === propertyTypeFilter;
          const matchesAcquisition = acquisitionTypeFilter === 'all' || 
            (acquisitionTypeFilter === 'client-listing' && (!property.acquisitionType || property.acquisitionType === 'client-listing')) ||
            property.acquisitionType === acquisitionTypeFilter;
          
          return matchesTab && matchesSearch && matchesStatus && matchesType && matchesAcquisition;
        } catch (error) {
          console.error('Error filtering property:', error);
          return false;
        }
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low': {
            const priceA = a.listingType === 'for-rent' ? (a.monthlyRent || 0) : (a.price || 0);
            const priceB = b.listingType === 'for-rent' ? (b.monthlyRent || 0) : (b.price || 0);
            return priceA - priceB;
          }
          case 'price-high': {
            const priceA = a.listingType === 'for-rent' ? (a.monthlyRent || 0) : (a.price || 0);
            const priceB = b.listingType === 'for-rent' ? (b.monthlyRent || 0) : (b.price || 0);
            return priceB - priceA;
          }
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error filtering properties:', error);
      return [];
    }
  }, [properties, activeTab, searchTerm, statusFilter, propertyTypeFilter, acquisitionTypeFilter, sortBy]);

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      negotiation: 'bg-yellow-100 text-yellow-800',
      'under-contract': 'bg-purple-100 text-purple-800',
      sold: 'bg-blue-100 text-blue-800',
      withdrawn: 'bg-gray-100 text-gray-800',
      rented: 'bg-indigo-100 text-indigo-800',
      'lease-signed': 'bg-purple-100 text-purple-800',
      'application-pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    // Simplified to avoid complex calculations that might cause timeout
    const suggestions: string[] = [];
    
    // Calculate days on market and check expiry status
    const daysOnMarket = calculateDaysOnMarket(property);
    const isFeatured = isPropertyFeatured(property);
    const isExpired = isPropertyExpired(property);
    
    // Get transaction data for under-contract and sold properties
    const transaction = (property.status === 'under-contract' || property.status === 'sold') ? getActiveTransaction(property.id) : null;
    
    // Calculate payment summary using the new scheduled payments system
    let paymentSummary = {
      totalAmount: property.finalSalePrice || property.price,
      paidAmount: 0,
      remainingAmount: property.finalSalePrice || property.price,
      payments: [] as any[],
      installmentCount: 0
    };
    
    let paymentProgress = 0;
    
    if (property.status === 'under-contract' || property.status === 'sold') {
      // Try to get payment summary from scheduled payments (new system)
      try {
        const { getPaymentSummary, getScheduledPayments } = require('../lib/payments');
        const summary = getPaymentSummary(property.id);
        const scheduledPayments = getScheduledPayments(property.id);
        
        if (summary.totalAmount > 0 && scheduledPayments.length > 0) {
          paymentProgress = summary.percentagePaid;
          paymentSummary = {
            totalAmount: summary.totalAmount,
            paidAmount: summary.totalPaid,
            remainingAmount: summary.amountRemaining,
            payments: scheduledPayments,
            installmentCount: scheduledPayments.length
          };
        } else if (transaction?.paymentPlan) {
          // Fallback to transaction payment plan if scheduled payments not found (backwards compatibility)
          const plan = transaction.paymentPlan;
          const paidInstallments = plan.installments.filter(i => i.status === 'paid');
          const paidAmount = paidInstallments.reduce((sum, i) => sum + (i.paidAmount || i.amount), 0);
          
          paymentSummary = {
            totalAmount: plan.totalAmount,
            paidAmount: paidAmount,
            remainingAmount: plan.totalAmount - paidAmount,
            payments: plan.installments,
            installmentCount: plan.installments.length
          };
          
          paymentProgress = plan.totalAmount > 0 ? (paidAmount / plan.totalAmount) * 100 : 0;
        }
      } catch (err) {
        console.error('Error loading payment data:', err);
        // Fallback to transaction payment plan
        if (transaction?.paymentPlan) {
          const plan = transaction.paymentPlan;
          const paidInstallments = plan.installments.filter(i => i.status === 'paid');
          const paidAmount = paidInstallments.reduce((sum, i) => sum + (i.paidAmount || i.amount), 0);
          
          paymentSummary = {
            totalAmount: plan.totalAmount,
            paidAmount: paidAmount,
            remainingAmount: plan.totalAmount - paidAmount,
            payments: plan.installments,
            installmentCount: plan.installments.length
          };
          
          paymentProgress = plan.totalAmount > 0 ? (paidAmount / plan.totalAmount) * 100 : 0;
        }
      }
    }

    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={property.images[0] || '/placeholder.jpg'}
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-1 flex-col items-end">
            <div className="flex gap-1 flex-wrap max-w-[200px] justify-end">
              {isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 gap-1">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {isExpired && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Expired
                </Badge>
              )}
              <Badge className={getStatusColor(property.status)}>
                {property.status === 'under-contract' ? 'Under Contract' : property.status}
              </Badge>
              {property.isPublished && (
                <Badge variant="outline" className="bg-white">
                  Published
                </Badge>
              )}
            </div>
            {/* Acquisition Type Badge */}
            {property.acquisitionType && (
              <Badge 
                variant="outline" 
                className={
                  property.acquisitionType === 'agency-purchase' 
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : property.acquisitionType === 'investor-purchase'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }
              >
                {property.acquisitionType === 'agency-purchase' ? '🏢 Agency' :
                 property.acquisitionType === 'investor-purchase' ? '💼 Investor' :
                 '👤 Client'}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {property.listingType === 'for-rent' 
                ? `${formatCurrencyShort(property.monthlyRent || 0)}/mo`
                : formatCurrencyShort(property.price || 0)}
            </Badge>
            <Badge variant="outline" className="bg-white/90 gap-1">
              <Clock className="h-3 w-3" />
              {daysOnMarket}d
            </Badge>
            {(property.viewCount || 0) > 0 && (
              <Badge variant="outline" className="bg-white/90 gap-1">
                <Eye className="h-3 w-3" />
                {property.viewCount}
              </Badge>
            )}
          </div>
          
          {/* Smart suggestion indicator */}
          {suggestions.length > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="bg-orange-500 text-white">
                {suggestions.length} Action{suggestions.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-lg line-clamp-1">{property.title}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {formatPropertyAddress(property.address)}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Badge variant="outline">{property.propertyType}</Badge>
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  {property.bedrooms}
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  {property.bathrooms}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Square className="h-3 w-3" />
                {property.area} sq ft
              </div>
            </div>
            
            {/* Enhanced financial section */}
            {(property.status === 'sold' || property.status === 'negotiation' || property.status === 'under-contract') && (
              <div className="bg-gray-50 rounded-md p-3 space-y-2">
                {property.status === 'under-contract' && transaction?.paymentPlan && (
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {paymentSummary.installmentCount} Installments
                    </span>
                    {transaction.buyerName && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {transaction.buyerName}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Progress</span>
                  <span className="font-medium">{paymentProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Paid: {formatCurrency(paymentSummary.paidAmount)}</span>
                  <span>Remaining: {formatCurrency(paymentSummary.remainingAmount)}</span>
                </div>
                
                {property.status === 'under-contract' && transaction?.paymentPlan && (
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <p className="text-xs font-medium text-gray-700">Upcoming Payments:</p>
                    {transaction.paymentPlan.installments
                      .filter(i => i.status === 'pending')
                      .slice(0, 2)
                      .map((inst, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                          <span>{inst.description}</span>
                          <span className="font-medium">{formatCurrency(inst.amount)}</span>
                        </div>
                      ))}
                  </div>
                )}
                
                {paymentSummary.remainingAmount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    Payment pending
                  </div>
                )}
              </div>
            )}
            
            <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
            
            {/* Smart suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-md p-2">
                <p className="text-xs text-blue-800 font-medium mb-1">Suggested Actions:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-gray-500">
                Agent: {property.agentName}
              </span>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onNavigate('property-detail', property)}
                  title="View details"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    // Store property data for editing
                    localStorage.setItem('editing_property', JSON.stringify(property));
                    onNavigate('add-property');
                  }}
                  title="Edit property"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('property-detail', property)}
                >
                  Manage Deal
                </Button>
                {property.propertyType !== 'land' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedProject(property);
                      setViewMode('visual');
                    }}
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Visual
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PropertyListItem: React.FC<{ property: Property }> = ({ property }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={property.images[0] || '/placeholder.jpg'}
            alt={property.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{property.title}</h3>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(property.status)}>
                  {property.status === 'under-contract' ? 'Under Contract' : property.status}
                </Badge>
                {property.isPublished && (
                  <Badge variant="outline">Published</Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3" />
              {formatPropertyAddress(property.address)}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <Badge variant="outline">{property.propertyType}</Badge>
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  {property.bedrooms} bed
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  {property.bathrooms} bath
                </div>
              )}
              <div className="flex items-center gap-1">
                <Square className="h-3 w-3" />
                {property.area} sq ft
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-lg">
                  {property.listingType === 'for-rent'
                    ? `${formatCurrency(property.monthlyRent || 0)}/month`
                    : formatCurrency(property.price || 0)}
                </span>
                <span className="text-xs text-gray-500">Agent: {property.agentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onNavigate('property-detail', property)}
                  title="View details"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    // Store property data for editing
                    localStorage.setItem('editing_property', JSON.stringify(property));
                    onNavigate('add-property');
                  }}
                  title="Edit property"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('property-detail', property)}
                >
                  Manage Deal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VisualPropertyGrid: React.FC<{ property: Property }> = ({ property }) => {
    const units = getVisualPropertyUnits(property.id);
    const statusCounts = {
      'available': units.filter(u => u.financialStatus === 'available').length,
      'sold-paid': units.filter(u => u.financialStatus === 'sold-paid').length,
      'sold-installments': units.filter(u => u.financialStatus === 'sold-installments').length,
      'overdue': units.filter(u => u.financialStatus === 'overdue').length
    };

    const totalRevenue = units.reduce((sum, unit) => {
      return unit.financialStatus !== 'available' ? sum + unit.price : sum;
    }, 0);

    const totalCostBasis = units.reduce((sum, unit) => {
      return unit.financialStatus !== 'available' ? sum + (unit.costBasis || 0) : sum;
    }, 0);

    const totalProfit = totalRevenue - totalCostBasis;

    return (
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">{property.title}</h2>
            <p className="text-muted-foreground">{formatPropertyAddress(property.address)}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedProject(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-lg font-medium">{units.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-medium">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calculator className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Gross Profit</p>
                  <p className="text-lg font-medium">${totalProfit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-50">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Units Sold</p>
                  <p className="text-lg font-medium">
                    {units.length - statusCounts.available}/{units.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Sold & Fully Paid ({statusCounts['sold-paid']})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Sold & Installments ({statusCounts['sold-installments']})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Available for Sale ({statusCounts.available})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Payment Overdue ({statusCounts.overdue})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Unit Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Inventory Map</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click on any unit to view detailed financial information
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 rounded-lg p-6 min-h-96 overflow-auto">
              {/* Floor labels */}
              <div className="absolute left-2 top-6 space-y-8">
                {[5, 4, 3, 2, 1].map(floor => (
                  <div key={floor} className="h-12 flex items-center">
                    <span className="text-xs font-medium text-gray-500">Floor {floor}</span>
                  </div>
                ))}
              </div>

              {/* Unit grid */}
              <div className="ml-16 grid grid-cols-8 gap-2">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className={`
                      relative w-16 h-12 rounded border-2 cursor-pointer transition-all duration-200
                      ${getFinancialStatusColor(unit.financialStatus)}
                      hover:scale-105 hover:shadow-lg
                    `}
                    title={`${unit.unitNumber} - ${getFinancialStatusLabel(unit.financialStatus)} - ${formatCurrency(unit.price)}`}
                    onClick={() => {
                      // Open unit detail modal or navigate to unit detail
                      alert(`Unit: ${unit.unitNumber}\nStatus: ${getFinancialStatusLabel(unit.financialStatus)}\nPrice: ${unit.price.toLocaleString()}\nClient: ${unit.clientName || 'N/A'}`);
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-medium">
                      <span>{unit.unitNumber.split('-')[1]}</span>
                      {unit.paymentProgress && (
                        <div className="w-10 bg-white/20 rounded-full h-1 mt-1">
                          <div
                            className="bg-white h-1 rounded-full"
                            style={{ width: `${unit.paymentProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sales Rate</span>
                  <span className="font-medium">
                    {(((units.length - statusCounts.available) / units.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Unit Price</span>
                  <span className="font-medium">
                    ${Math.round(units.reduce((sum, u) => sum + u.price, 0) / units.length).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Profit Margin</span>
                  <span className="font-medium text-green-600">
                    {((totalProfit / totalRevenue) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Collection Rate</span>
                  <span className="font-medium">
                    {(((statusCounts['sold-paid'] + statusCounts['sold-installments']) / (units.length - statusCounts.available)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Units Requiring Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {units.filter(u => u.financialStatus === 'overdue').slice(0, 5).map(unit => (
                  <div key={unit.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="font-medium text-red-800">{unit.unitNumber}</span>
                    <Badge variant="destructive">Payment Overdue</Badge>
                  </div>
                ))}
                {units.filter(u => u.financialStatus === 'sold-installments' && u.paymentProgress && u.paymentProgress < 50).slice(0, 3).map(unit => (
                  <div key={unit.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="font-medium text-yellow-800">{unit.unitNumber}</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {unit.paymentProgress}% Paid
                    </Badge>
                  </div>
                ))}
                {statusCounts.overdue === 0 && units.filter(u => u.financialStatus === 'sold-installments' && u.paymentProgress && u.paymentProgress < 50).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No units require immediate attention
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (viewMode === 'visual' && selectedProject) {
    return (
      <div className="p-6">
        <VisualPropertyGrid property={selectedProject} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => onNavigate('add-property')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add For Sale
          </Button>
          <Button onClick={() => onNavigate('add-property')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Wanted to Buy
          </Button>
        </div>
      </div>

      {/* Toggle and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">
                Listing Type:
              </Label>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  size="sm"
                  variant={activeTab === 'for-sale' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('for-sale')}
                  className="h-8"
                >
                  For Sale
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'for-rent' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('for-rent')}
                  className="h-8"
                >
                  For Rent
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'wanted' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('wanted')}
                  className="h-8"
                >
                  Wanted to Buy
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'visual' ? 'default' : 'outline'}
                onClick={() => setViewMode('visual')}
                title="Visual Inventory View"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="under-contract">Under Contract</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="rented">Rented/Leased</SelectItem>
                <SelectItem value="lease-signed">Lease Signed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={acquisitionTypeFilter} onValueChange={setAcquisitionTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="client-listing">Client Listing</SelectItem>
                <SelectItem value="agency-purchase">Agency Purchase</SelectItem>
                <SelectItem value="investor-purchase">Investor Purchase</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProperties.length} properties
        </p>
      </div>

      {/* Visual Inventory for Projects */}
      {viewMode === 'visual' && !selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Visual Inventory Projects
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a project to view its visual inventory map
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties
                .filter(p => p.propertyType !== 'land')
                .map((property) => (
                <Card key={property.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedProject(property);
                        setViewMode('visual');
                      }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{formatPropertyAddress(property.address)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{property.propertyType}</Badge>
                          <Badge className={getStatusColor(property.status)}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrencyShort(property.price)}</p>
                        <p className="text-xs text-muted-foreground">{formatArea(property.area, property.propertyType === 'house' ? 'yards' : 'sqft')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredProperties.filter(p => p.propertyType !== 'land').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-3" />
                <p>No projects available for visual inventory view</p>
                <p className="text-sm">Visual inventory is available for apartments and commercial properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Property Grid/List */}
      {viewMode !== 'visual' && filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-sm mb-4">
                {activeTab === 'for-sale' 
                  ? 'No properties for sale match your criteria.' 
                  : activeTab === 'for-rent'
                  ? 'No rental properties match your criteria.'
                  : 'No buyer requirement listings match your criteria.'}
              </p>
              <Button onClick={() => onNavigate('add-property')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode !== 'visual' ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredProperties.map((property) => 
            viewMode === 'grid' 
              ? <PropertyCard key={property.id} property={property} />
              : <PropertyListItem key={property.id} property={property} />
          )}
        </div>
      ) : null}
    </div>
  );
};