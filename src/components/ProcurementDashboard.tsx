import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PurchaseOrderModal } from './PurchaseOrderModal';
import { 
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  BarChart3,
  Package,
  TrendingDown
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'delivered' | 'cancelled';
  items: {
    materialId: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    category: string;
  }[];
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  categories: string[];
  rating: number;
  totalOrders: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  unit: string;
  lastUpdated: string;
  averagePrice: number;
}

interface ProcurementDashboardProps {
  user: User;
  onBack: () => void;
}

// Mock data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    supplierId: 'SUP-001',
    supplierName: 'Askari Cement',
    date: '2024-01-15',
    totalAmount: 2850000,
    status: 'approved',
    items: [
      { materialId: 'MAT-001', materialName: 'OPC Cement 50kg', quantity: 1000, unitPrice: 2850, category: 'Cement' }
    ]
  },
  {
    id: 'PO-2024-002',
    supplierId: 'SUP-002',
    supplierName: 'Amir Steel Mills',
    date: '2024-01-14',
    totalAmount: 4250000,
    status: 'pending-approval',
    items: [
      { materialId: 'MAT-002', materialName: 'Steel Bars 12mm', quantity: 500, unitPrice: 8500, category: 'Steel' }
    ]
  },
  {
    id: 'PO-2024-003',
    supplierId: 'SUP-003',
    supplierName: 'Pak Elektron Limited',
    date: '2024-01-13',
    totalAmount: 1850000,
    status: 'delivered',
    items: [
      { materialId: 'MAT-003', materialName: 'Electrical Cables', quantity: 200, unitPrice: 9250, category: 'Electricals' }
    ]
  },
  {
    id: 'PO-2024-004',
    supplierId: 'SUP-004',
    supplierName: 'National Hardware',
    date: '2024-01-12',
    totalAmount: 950000,
    status: 'draft',
    items: [
      { materialId: 'MAT-004', materialName: 'Paint Premium', quantity: 150, unitPrice: 6333, category: 'Paint & Finishing' }
    ]
  },
  {
    id: 'PO-2024-005',
    supplierId: 'SUP-005',
    supplierName: 'Master Tiles',
    date: '2024-01-11',
    totalAmount: 3200000,
    status: 'approved',
    items: [
      { materialId: 'MAT-005', materialName: 'Ceramic Tiles 2x2', quantity: 800, unitPrice: 4000, category: 'Tiles & Flooring' }
    ]
  }
];

const mockSuppliers: Supplier[] = [
  { id: 'SUP-001', name: 'Askari Cement', contact: '+92-21-1234567', email: 'orders@askari.com', categories: ['Cement'], rating: 4.8, totalOrders: 45 },
  { id: 'SUP-002', name: 'Amir Steel Mills', contact: '+92-21-2345678', email: 'sales@amirsteel.com', categories: ['Steel'], rating: 4.6, totalOrders: 32 },
  { id: 'SUP-003', name: 'Pak Elektron Limited', contact: '+92-21-3456789', email: 'info@pakelektron.com', categories: ['Electricals'], rating: 4.7, totalOrders: 28 },
  { id: 'SUP-004', name: 'National Hardware', contact: '+92-21-4567890', email: 'procurement@nationalhw.com', categories: ['Paint & Finishing', 'Tools'], rating: 4.2, totalOrders: 52 },
  { id: 'SUP-005', name: 'Master Tiles', contact: '+92-21-5678901', email: 'orders@mastertiles.com', categories: ['Tiles & Flooring'], rating: 4.9, totalOrders: 19 }
];

const mockInventoryItems: InventoryItem[] = [
  { id: 'INV-001', name: 'OPC Cement 50kg', category: 'Cement', currentStock: 850, safetyStock: 1000, unit: 'bags', lastUpdated: '2024-01-15', averagePrice: 2850 },
  { id: 'INV-002', name: 'Steel Bars 12mm', category: 'Steel', currentStock: 120, safetyStock: 200, unit: 'pieces', lastUpdated: '2024-01-14', averagePrice: 8500 },
  { id: 'INV-003', name: 'Electrical Cables', category: 'Electricals', currentStock: 45, safetyStock: 80, unit: 'meters', lastUpdated: '2024-01-13', averagePrice: 9250 },
  { id: 'INV-004', name: 'Paint Premium', category: 'Paint & Finishing', currentStock: 25, safetyStock: 50, unit: 'gallons', lastUpdated: '2024-01-12', averagePrice: 6333 },
  { id: 'INV-005', name: 'Ceramic Tiles 2x2', category: 'Tiles & Flooring', currentStock: 2200, safetyStock: 1500, unit: 'pieces', lastUpdated: '2024-01-11', averagePrice: 4000 }
];

export const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({
  user,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const pendingOrders = mockPurchaseOrders.filter(po => 
      po.status === 'pending-approval' || po.status === 'draft'
    ).length;
    
    const lowStockItems = mockInventoryItems.filter(item => 
      item.currentStock < item.safetyStock
    ).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpend = mockPurchaseOrders
      .filter(po => {
        const poDate = new Date(po.date);
        return poDate.getMonth() === currentMonth && 
               poDate.getFullYear() === currentYear &&
               (po.status === 'approved' || po.status === 'delivered');
      })
      .reduce((sum, po) => sum + po.totalAmount, 0);
    
    const totalSuppliers = mockSuppliers.length;

    return {
      pendingOrders,
      lowStockItems,
      monthlySpend,
      totalSuppliers
    };
  }, []);

  // Calculate spend by category for chart
  const spendByCategory = useMemo(() => {
    const categorySpend: Record<string, number> = {};
    
    mockPurchaseOrders
      .filter(po => po.status === 'approved' || po.status === 'delivered')
      .forEach(po => {
        po.items.forEach(item => {
          if (!categorySpend[item.category]) {
            categorySpend[item.category] = 0;
          }
          categorySpend[item.category] += item.quantity * item.unitPrice;
        });
      });

    return Object.entries(categorySpend).map(([category, amount]) => ({
      category,
      amount
    }));
  }, []);

  // Filter purchase orders based on search
  const filteredPurchaseOrders = useMemo(() => {
    if (!searchTerm) return mockPurchaseOrders;
    
    return mockPurchaseOrders.filter(po =>
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Get items below safety stock
  const itemsBelowSafetyStock = useMemo(() => {
    return mockInventoryItems.filter(item => item.currentStock < item.safetyStock);
  }, []);

  const handleCreatePO = () => {
    setIsCreatePOModalOpen(true);
  };

  const handleSavePO = async (poData: any, status: 'draft' | 'pending-approval') => {
    try {
      // Generate PO ID
      const poId = `PO-${new Date().getFullYear()}-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`;
      
      // Create new PO object
      const newPO = {
        id: poId,
        supplierId: poData.supplierId,
        supplierName: poData.supplierName,
        date: poData.poDate,
        totalAmount: poData.grandTotal,
        status: status,
        items: poData.lineItems.map((item: any) => ({
          materialId: `MAT-${Math.random().toString(36).substr(2, 9)}`,
          materialName: item.itemDescription,
          quantity: item.quantity,
          unitPrice: item.rate,
          category: 'General' // Could be derived from supplier or item
        }))
      };

      // In a real app, this would save to backend
      mockPurchaseOrders.unshift(newPO);
      
      // Close modal
      setIsCreatePOModalOpen(false);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
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

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
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
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Procurement & Inventory</h1>
              <p className="text-gray-600 mt-1">
                Manage purchase orders and monitor inventory levels
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={handleCreatePO} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              New Purchase Order
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <ShoppingCart className="h-5 w-5" />
                Pending Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-2">
                {kpis.pendingOrders}
              </div>
              <p className="text-sm text-orange-700">
                Awaiting approval or processing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 mb-2">
                {kpis.lowStockItems}
              </div>
              <p className="text-sm text-red-700">
                Below safety stock levels
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <DollarSign className="h-5 w-5" />
                Total Spend This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-2">
                {formatPKR(kpis.monthlySpend)}
              </div>
              <p className="text-sm text-green-700">
                Approved and delivered orders
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Users className="h-5 w-5" />
                Number of Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {kpis.totalSuppliers}
              </div>
              <p className="text-sm text-blue-700">
                Active supplier network
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Purchase Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Purchase Orders</CardTitle>
                    <CardDescription>
                      Track and manage your procurement activities
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by PO ID or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO ID</TableHead>
                        <TableHead>Supplier Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchaseOrders.map((po) => (
                        <TableRow key={po.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{po.id}</TableCell>
                          <TableCell>{po.supplierName}</TableCell>
                          <TableCell>
                            {new Date(po.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPKR(po.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(po.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Charts and Lists */}
          <div className="space-y-6">
            
            {/* Spend by Material Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Spend by Material Category
                </CardTitle>
                <CardDescription>
                  Monthly expenditure breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatPKR(value), 'Amount']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Items Below Safety Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Items Below Safety Stock
                </CardTitle>
                <CardDescription>
                  Items requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {itemsBelowSafetyStock.length === 0 ? (
                  <div className="text-center py-4">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">All items are above safety stock</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itemsBelowSafetyStock.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-red-900">{item.name}</div>
                          <div className="text-sm text-red-700">
                            {item.currentStock} {item.unit} / {item.safetyStock} {item.unit} required
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-900">
                            {Math.round(((item.safetyStock - item.currentStock) / item.safetyStock) * 100)}% below
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-200 mt-1">
                            Urgent
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common procurement and inventory tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Purchase Requisition
              </Button>
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                Update Stock Levels
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Manage Suppliers
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Inventory Report
              </Button>
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Spend Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Order Modal */}
      <PurchaseOrderModal
        isOpen={isCreatePOModalOpen}
        onClose={() => setIsCreatePOModalOpen(false)}
        user={user}
        onSave={handleSavePO}
      />
    </div>
  );
};