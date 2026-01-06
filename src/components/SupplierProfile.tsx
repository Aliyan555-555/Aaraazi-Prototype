import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { 
  ArrowLeft,
  Building2,
  Star,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Package
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SupplierData {
  id: string;
  companyName: string;
  logo?: string;
  overallRating: number;
  status: 'active' | 'on-hold' | 'suspended';
  contactInfo: {
    primaryContact: string;
    phone: string;
    email: string;
    alternatePhone?: string;
    alternateEmail?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessInfo: {
    registrationNumber: string;
    taxId: string;
    ntnNumber: string;
    establishedYear: number;
    businessType: string;
  };
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    branchCode: string;
    iban: string;
  };
  performance: {
    onTimeDeliveryRate: number;
    qualityAcceptanceRate: number;
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
    ratingHistory: Array<{
      month: string;
      rating: number;
    }>;
  };
  categories: string[];
  joinDate: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'contract' | 'compliance' | 'certificate' | 'invoice' | 'other';
  status: 'active' | 'expired' | 'pending';
}

interface PurchaseOrder {
  id: string;
  date: string;
  totalAmount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'delivered' | 'cancelled';
  itemsCount: number;
  deliveryDate?: string;
  description: string;
}

interface SupplierProfileProps {
  user: User;
  onBack: () => void;
  supplierId?: string;
}

// Mock supplier data
const mockSupplierData: SupplierData = {
  id: 'SUP-001',
  companyName: 'Askari Cement Industries Ltd.',
  overallRating: 4.5,
  status: 'active',
  contactInfo: {
    primaryContact: 'Muhammad Tariq',
    phone: '+92-21-35831234',
    email: 'tariq@askari-cement.com',
    alternatePhone: '+92-300-1234567',
    alternateEmail: 'sales@askari-cement.com'
  },
  address: {
    street: 'Plot No. 15-17, Industrial Area',
    city: 'Karachi',
    state: 'Sindh',
    postalCode: '74900',
    country: 'Pakistan'
  },
  businessInfo: {
    registrationNumber: 'SECP-12345',
    taxId: 'STN-098765',
    ntnNumber: '1234567-8',
    establishedYear: 1995,
    businessType: 'Manufacturing'
  },
  bankDetails: {
    bankName: 'Habib Bank Limited',
    accountTitle: 'Askari Cement Industries Ltd.',
    accountNumber: '12345678901',
    branchCode: '1234',
    iban: 'PK36HABB0012345678901234'
  },
  performance: {
    onTimeDeliveryRate: 92,
    qualityAcceptanceRate: 96,
    totalOrders: 156,
    totalValue: 85000000,
    averageOrderValue: 545000,
    ratingHistory: [
      { month: 'Jan', rating: 4.2 },
      { month: 'Feb', rating: 4.3 },
      { month: 'Mar', rating: 4.1 },
      { month: 'Apr', rating: 4.4 },
      { month: 'May', rating: 4.6 },
      { month: 'Jun', rating: 4.5 },
      { month: 'Jul', rating: 4.7 },
      { month: 'Aug', rating: 4.5 },
      { month: 'Sep', rating: 4.4 },
      { month: 'Oct', rating: 4.6 },
      { month: 'Nov', rating: 4.5 },
      { month: 'Dec', rating: 4.5 }
    ]
  },
  categories: ['Cement', 'Construction Materials', 'Building Supplies'],
  joinDate: '2020-03-15'
};

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'Master Service Agreement 2024',
    type: 'PDF',
    size: '2.3 MB',
    uploadDate: '2024-01-15',
    category: 'contract',
    status: 'active'
  },
  {
    id: 'DOC-002',
    name: 'ISO 9001 Certificate',
    type: 'PDF',
    size: '1.1 MB',
    uploadDate: '2024-02-01',
    category: 'certificate',
    status: 'active'
  },
  {
    id: 'DOC-003',
    name: 'Tax Registration Certificate',
    type: 'PDF',
    size: '856 KB',
    uploadDate: '2024-01-10',
    category: 'compliance',
    status: 'active'
  },
  {
    id: 'DOC-004',
    name: 'Fire Safety Certificate',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2023-06-15',
    category: 'certificate',
    status: 'expired'
  }
];

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    date: '2024-01-15',
    totalAmount: 2850000,
    status: 'delivered',
    itemsCount: 1,
    deliveryDate: '2024-01-22',
    description: 'OPC Cement 50kg bags - 1000 units'
  },
  {
    id: 'PO-2024-002',
    date: '2024-02-10',
    totalAmount: 3200000,
    status: 'approved',
    itemsCount: 2,
    deliveryDate: '2024-02-20',
    description: 'Cement & Steel reinforcement bars'
  },
  {
    id: 'PO-2024-003',
    date: '2024-03-05',
    totalAmount: 1950000,
    status: 'pending-approval',
    itemsCount: 1,
    description: 'Premium cement grade - 750 units'
  }
];

export const SupplierProfile: React.FC<SupplierProfileProps> = ({
  user,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [supplierData] = useState<SupplierData>(mockSupplierData);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    return [
      {
        name: 'On-Time Delivery',
        value: supplierData.performance.onTimeDeliveryRate,
        color: '#22c55e'
      },
      {
        name: 'Quality Acceptance',
        value: supplierData.performance.qualityAcceptanceRate,
        color: '#3b82f6'
      }
    ];
  }, [supplierData]);

  const getStatusBadge = (status: string) => {
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
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: Document['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      active: 'Active',
      expired: 'Expired',
      pending: 'Pending'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const getPOStatusBadge = (status: PurchaseOrder['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      'pending-approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      draft: 'Draft',
      'pending-approval': 'Pending Approval',
      approved: 'Approved',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };

    const icons = {
      draft: <Clock className="h-3 w-3" />,
      'pending-approval': <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      delivered: <CheckCircle className="h-3 w-3" />,
      cancelled: <AlertCircle className="h-3 w-3" />
    };

    return (
      <Badge className={`${variants[status]} border flex items-center gap-1`}>
        {icons[status]}
        {labels[status]}
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
        <span className="ml-2 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-900">{supplierData.companyName}</h1>
                <div className="flex items-center gap-4 mt-1">
                  {renderStarRating(supplierData.overallRating)}
                  {getStatusBadge(supplierData.status)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Profile
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Package className="h-4 w-4" />
              Create New PO
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-medium">{supplierData.performance.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-medium">{formatPKR(supplierData.performance.totalValue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-medium">{formatPKR(supplierData.performance.averageOrderValue)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Partnership Since</p>
                  <p className="text-2xl font-medium">
                    {new Date(supplierData.joinDate).getFullYear()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabbed Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="purchase-history">Purchase History</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Primary Contact</p>
                        <p className="font-medium">{supplierData.contactInfo.primaryContact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{supplierData.contactInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{supplierData.contactInfo.email}</p>
                      </div>
                      {supplierData.contactInfo.alternatePhone && (
                        <div>
                          <p className="text-sm text-gray-600">Alternate Phone</p>
                          <p className="font-medium">{supplierData.contactInfo.alternatePhone}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>{supplierData.address.street}</p>
                        <p>{supplierData.address.city}, {supplierData.address.state}</p>
                        <p>{supplierData.address.postalCode}</p>
                        <p>{supplierData.address.country}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Registration Number</p>
                        <p className="font-medium">{supplierData.businessInfo.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tax ID</p>
                        <p className="font-medium">{supplierData.businessInfo.taxId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">NTN Number</p>
                        <p className="font-medium">{supplierData.businessInfo.ntnNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Business Type</p>
                        <p className="font-medium">{supplierData.businessInfo.businessType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Established</p>
                        <p className="font-medium">{supplierData.businessInfo.establishedYear}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bank Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Bank Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium">{supplierData.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Title</p>
                        <p className="font-medium">{supplierData.bankDetails.accountTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium font-mono">{supplierData.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">IBAN</p>
                        <p className="font-medium font-mono">{supplierData.bankDetails.iban}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {supplierData.categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Performance Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceMetrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rating Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Rating Trend (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={supplierData.performance.ratingHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[3.5, 5]} />
                            <Tooltip formatter={(value) => [value, 'Rating']} />
                            <Line 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="#22c55e" 
                              strokeWidth={3}
                              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-medium text-green-700">
                          {supplierData.performance.onTimeDeliveryRate}%
                        </div>
                        <div className="text-sm text-green-600 mt-1">On-Time Delivery</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-medium text-blue-700">
                          {supplierData.performance.qualityAcceptanceRate}%
                        </div>
                        <div className="text-sm text-blue-600 mt-1">Quality Acceptance</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-medium text-purple-700">
                          {supplierData.performance.totalOrders}
                        </div>
                        <div className="text-sm text-purple-600 mt-1">Total Orders</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-3xl font-medium text-orange-700">
                          {supplierData.overallRating.toFixed(1)}
                        </div>
                        <div className="text-sm text-orange-600 mt-1">Average Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Document Library</h3>
                    <p className="text-sm text-gray-600">
                      Contracts, certificates, and compliance documents
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Document Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDocuments.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {doc.category.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>
                            {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            {getDocumentStatusBadge(doc.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Purchase History Tab */}
              <TabsContent value="purchase-history" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Purchase Order History</h3>
                    <p className="text-sm text-gray-600">
                      Complete history of all purchase orders with this supplier
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Package className="h-4 w-4" />
                    Create New PO
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>PO ID</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPurchaseOrders.map((po) => (
                        <TableRow key={po.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{po.id}</TableCell>
                          <TableCell>
                            {new Date(po.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{po.description}</TableCell>
                          <TableCell>{po.itemsCount} items</TableCell>
                          <TableCell className="font-medium">
                            {formatPKR(po.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {po.deliveryDate ? (
                              new Date(po.deliveryDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getPOStatusBadge(po.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};