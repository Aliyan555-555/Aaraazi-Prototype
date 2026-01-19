import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Building2,
  Users,
  Star,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Phone,
  MapPin,
  Package,
  AlertTriangle
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { SupplierProfile } from './SupplierProfile';
import { SupplierPortalDashboard } from './SupplierPortalDashboard';

interface Supplier {
  id: string;
  companyName: string;
  primaryContact: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  overallRating: number;
  status: 'active' | 'on-hold' | 'suspended';
  totalOrders: number;
  totalValue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  joinDate: string;
  lastOrderDate: string;
}

interface AdvancedSupplierManagementProps {
  user: User;
  onBack: () => void;
}

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    companyName: 'Askari Cement Industries Ltd.',
    primaryContact: 'Muhammad Tariq',
    phone: '+92-21-35831234',
    email: 'tariq@askari-cement.com',
    location: 'Karachi, Sindh',
    category: 'Cement',
    overallRating: 4.5,
    status: 'active',
    totalOrders: 156,
    totalValue: 85000000,
    onTimeDeliveryRate: 92,
    qualityScore: 96,
    joinDate: '2020-03-15',
    lastOrderDate: '2024-01-15'
  },
  {
    id: 'SUP-002',
    companyName: 'Amir Steel Mills Pvt. Ltd.',
    primaryContact: 'Ahmed Ali Khan',
    phone: '+92-42-37654321',
    email: 'ahmed@amirsteel.com',
    location: 'Lahore, Punjab',
    category: 'Steel',
    overallRating: 4.2,
    status: 'active',
    totalOrders: 89,
    totalValue: 65000000,
    onTimeDeliveryRate: 88,
    qualityScore: 91,
    joinDate: '2019-08-20',
    lastOrderDate: '2024-01-12'
  },
  {
    id: 'SUP-003',
    companyName: 'Pak Elektron Limited',
    primaryContact: 'Fatima Hassan',
    phone: '+92-21-34567890',
    email: 'fatima@pakelektron.com',
    location: 'Karachi, Sindh',
    category: 'Electrical',
    overallRating: 4.7,
    status: 'active',
    totalOrders: 134,
    totalValue: 45000000,
    onTimeDeliveryRate: 94,
    qualityScore: 97,
    joinDate: '2021-01-10',
    lastOrderDate: '2024-01-20'
  },
  {
    id: 'SUP-004',
    companyName: 'National Hardware Co.',
    primaryContact: 'Syed Imran',
    phone: '+92-21-32109876',
    email: 'imran@nationalhw.com',
    location: 'Karachi, Sindh',
    category: 'Hardware',
    overallRating: 3.8,
    status: 'on-hold',
    totalOrders: 67,
    totalValue: 28000000,
    onTimeDeliveryRate: 76,
    qualityScore: 82,
    joinDate: '2020-11-05',
    lastOrderDate: '2023-12-15'
  },
  {
    id: 'SUP-005',
    companyName: 'Master Tiles & Ceramics',
    primaryContact: 'Sarah Ahmed',
    phone: '+92-21-35555555',
    email: 'sarah@mastertiles.com',
    location: 'Karachi, Sindh',
    category: 'Tiles & Flooring',
    overallRating: 4.9,
    status: 'active',
    totalOrders: 78,
    totalValue: 32000000,
    onTimeDeliveryRate: 98,
    qualityScore: 99,
    joinDate: '2021-06-12',
    lastOrderDate: '2024-01-18'
  },
  {
    id: 'SUP-006',
    companyName: 'Diamond Paints Industries',
    primaryContact: 'Kashif Malik',
    phone: '+92-42-36777777',
    email: 'kashif@diamondpaints.com',
    location: 'Lahore, Punjab',
    category: 'Paint & Finishing',
    overallRating: 4.1,
    status: 'active',
    totalOrders: 45,
    totalValue: 18500000,
    onTimeDeliveryRate: 85,
    qualityScore: 89,
    joinDate: '2022-02-28',
    lastOrderDate: '2024-01-08'
  }
];

export const AdvancedSupplierManagement: React.FC<AdvancedSupplierManagementProps> = ({
  user,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'profile' | 'portal'>('list');

  // Filter suppliers based on search
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return mockSuppliers;
    
    return mockSuppliers.filter(supplier =>
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSuppliers = mockSuppliers.length;
    const activeSuppliers = mockSuppliers.filter(s => s.status === 'active').length;
    const onHoldSuppliers = mockSuppliers.filter(s => s.status === 'on-hold').length;
    
    const totalValue = mockSuppliers.reduce((sum, s) => sum + s.totalValue, 0);
    const avgRating = mockSuppliers.reduce((sum, s) => sum + s.overallRating, 0) / totalSuppliers;
    const avgDeliveryRate = mockSuppliers.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / totalSuppliers;
    
    return {
      totalSuppliers,
      activeSuppliers,
      onHoldSuppliers,
      totalValue,
      avgRating: Math.round(avgRating * 10) / 10,
      avgDeliveryRate: Math.round(avgDeliveryRate)
    };
  }, []);

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setViewMode('profile');
  };

  const handleBackToList = () => {
    setSelectedSupplier(null);
    setViewMode('list');
  };

  const getStatusBadge = (status: Supplier['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      active: 'Active',
      'on-hold': 'On Hold',
      suspended: 'Suspended'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Cement': 'bg-blue-100 text-blue-800 border-blue-200',
      'Steel': 'bg-gray-100 text-gray-800 border-gray-200',
      'Electrical': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Hardware': 'bg-green-100 text-green-800 border-green-200',
      'Tiles & Flooring': 'bg-purple-100 text-purple-800 border-purple-200',
      'Paint & Finishing': 'bg-red-100 text-red-800 border-red-200'
    };

    const color = colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <Badge className={`${color} border`}>
        {category}
      </Badge>
    );
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Handle different view modes
  if (viewMode === 'profile' && selectedSupplier) {
    return (
      <SupplierProfile
        user={user}
        onBack={handleBackToList}
        supplierId={selectedSupplier.id}
      />
    );
  }

  if (viewMode === 'portal') {
    return (
      <SupplierPortalDashboard
        user={user}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Advanced Supplier Management</h1>
              <p className="text-gray-600 mt-1">
                Manage supplier relationships and performance tracking
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setViewMode('portal')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Supplier Portal
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Building2 className="h-5 w-5" />
                Total Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-blue-900 mb-2">
                {kpis.totalSuppliers}
              </div>
              <p className="text-sm text-blue-700">
                {kpis.activeSuppliers} active, {kpis.onHoldSuppliers} on hold
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-green-900 mb-2">
                {formatPKR(kpis.totalValue)}
              </div>
              <p className="text-sm text-green-700">
                Cumulative procurement value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                <Star className="h-5 w-5" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-yellow-900 mb-2">
                {kpis.avgRating}/5.0
              </div>
              <p className="text-sm text-yellow-700">
                Overall supplier performance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                <Package className="h-5 w-5" />
                Delivery Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-purple-900 mb-2">
                {kpis.avgDeliveryRate}%
              </div>
              <p className="text-sm text-purple-700">
                Average on-time delivery
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suppliers" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Suppliers Directory
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              
              {/* Suppliers Directory Tab */}
              <TabsContent value="suppliers" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Suppliers Directory</h3>
                    <p className="text-sm text-gray-600">
                      Complete list of registered suppliers with performance metrics
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Supplier</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Delivery Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier) => (
                        <TableRow 
                          key={supplier.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSupplierClick(supplier)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">{supplier.companyName}</div>
                              <div className="text-sm text-gray-600">{supplier.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getCategoryBadge(supplier.category)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{supplier.primaryContact}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {supplier.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {supplier.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderStarRating(supplier.overallRating)}
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">{supplier.totalOrders}</div>
                              <div className="text-sm text-gray-600">orders</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPKR(supplier.totalValue)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  supplier.onTimeDeliveryRate >= 90 ? 'bg-green-500' :
                                  supplier.onTimeDeliveryRate >= 75 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                              />
                              <span className="font-medium">{supplier.onTimeDeliveryRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(supplier.status)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={(e:any) => {
                                e.stopPropagation();
                                handleSupplierClick(supplier);
                              }}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Performance Analytics Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Supplier Performance Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Top Performers */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Top Performers
                        </CardTitle>
                        <CardDescription>
                          Highest rated suppliers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockSuppliers
                            .sort((a, b) => b.overallRating - a.overallRating)
                            .slice(0, 5)
                            .map((supplier, index) => (
                            <div key={supplier.id} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{supplier.companyName}</div>
                                <div className="text-sm text-gray-600">{supplier.category}</div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="font-medium">{supplier.overallRating}</span>
                                </div>
                                <div className="text-sm text-gray-600">#{index + 1}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5 text-green-500" />
                          Best Delivery Rate
                        </CardTitle>
                        <CardDescription>
                          Most reliable delivery performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockSuppliers
                            .sort((a, b) => b.onTimeDeliveryRate - a.onTimeDeliveryRate)
                            .slice(0, 5)
                            .map((supplier, index) => (
                            <div key={supplier.id} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{supplier.companyName}</div>
                                <div className="text-sm text-gray-600">{supplier.category}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-green-600">{supplier.onTimeDeliveryRate}%</div>
                                <div className="text-sm text-gray-600">#{index + 1}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Attention Required */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Attention Required
                        </CardTitle>
                        <CardDescription>
                          Suppliers needing review
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockSuppliers
                            .filter(s => s.status === 'on-hold' || s.overallRating < 4.0 || s.onTimeDeliveryRate < 80)
                            .map((supplier) => (
                            <div key={supplier.id} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{supplier.companyName}</div>
                                <div className="text-sm text-gray-600">{supplier.category}</div>
                              </div>
                              <div className="text-right">
                                {getStatusBadge(supplier.status)}
                                <div className="text-sm text-gray-600 mt-1">
                                  {supplier.overallRating < 4.0 ? 'Low rating' : 
                                   supplier.onTimeDeliveryRate < 80 ? 'Poor delivery' : 
                                   'On hold'}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {mockSuppliers.filter(s => s.status === 'on-hold' || s.overallRating < 4.0 || s.onTimeDeliveryRate < 80).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p>No issues requiring attention</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};