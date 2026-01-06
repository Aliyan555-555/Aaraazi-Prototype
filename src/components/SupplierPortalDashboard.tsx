import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  FileText,
  ShoppingCart,
  DollarSign,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Package2,
  Receipt
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';

interface RFQ {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedValue: number;
  status: 'open' | 'submitted' | 'awarded' | 'closed';
  category: string;
}

interface PurchaseOrder {
  id: string;
  issueDate: string;
  description: string;
  totalAmount: number;
  status: 'pending-acknowledgment' | 'accepted' | 'in-progress' | 'delivered' | 'completed';
  deliveryDate: string;
  itemsCount: number;
}

interface Invoice {
  id: string;
  poId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'approved' | 'paid' | 'overdue';
}

interface RecentActivity {
  id: string;
  date: string;
  documentId: string;
  type: 'RFQ' | 'PO' | 'Invoice' | 'Payment';
  description: string;
  status: string;
  actionRequired?: boolean;
}

interface SupplierPortalDashboardProps {
  user: User;
  onBack: () => void;
  supplierName?: string;
}

// Mock data for supplier portal
const mockRFQs: RFQ[] = [
  {
    id: 'RFQ-2024-001',
    title: 'Cement Supply - Phase 2 Construction',
    description: 'Supply of OPC cement for residential project Phase 2',
    dueDate: '2024-02-15',
    estimatedValue: 5000000,
    status: 'open',
    category: 'Cement'
  },
  {
    id: 'RFQ-2024-002',
    title: 'Steel Reinforcement Bars',
    description: 'Various grades of steel bars for structural work',
    dueDate: '2024-02-20',
    estimatedValue: 8500000,
    status: 'open',
    category: 'Steel'
  }
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    issueDate: '2024-01-15',
    description: 'OPC Cement 50kg bags - 1000 units',
    totalAmount: 2850000,
    status: 'accepted',
    deliveryDate: '2024-02-01',
    itemsCount: 1
  },
  {
    id: 'PO-2024-002',
    issueDate: '2024-01-20',
    description: 'Premium grade cement and additives',
    totalAmount: 3200000,
    status: 'in-progress',
    deliveryDate: '2024-02-10',
    itemsCount: 3
  },
  {
    id: 'PO-2024-003',
    issueDate: '2024-01-25',
    description: 'Construction materials package',
    totalAmount: 1950000,
    status: 'pending-acknowledgment',
    deliveryDate: '2024-02-15',
    itemsCount: 2
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    poId: 'PO-2024-001',
    amount: 2850000,
    issueDate: '2024-01-22',
    dueDate: '2024-02-21',
    status: 'approved'
  },
  {
    id: 'INV-002',
    poId: 'PO-2023-045',
    amount: 1500000,
    issueDate: '2024-01-10',
    dueDate: '2024-02-09',
    status: 'pending'
  }
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: 'ACT-001',
    date: '2024-01-28',
    documentId: 'RFQ-2024-001',
    type: 'RFQ',
    description: 'New RFQ received for cement supply',
    status: 'Awaiting Your Bid',
    actionRequired: true
  },
  {
    id: 'ACT-002',
    date: '2024-01-27',
    documentId: 'PO-2024-003',
    type: 'PO',
    description: 'Purchase order requires acknowledgment',
    status: 'PO Pending Acknowledgment',
    actionRequired: true
  },
  {
    id: 'ACT-003',
    date: '2024-01-25',
    documentId: 'INV-002',
    type: 'Invoice',
    description: 'Invoice approved for payment processing',
    status: 'Invoice Approved'
  },
  {
    id: 'ACT-004',
    date: '2024-01-24',
    documentId: 'PAY-001',
    type: 'Payment',
    description: 'Payment received for PO-2023-045',
    status: 'Payment Received'
  }
];

export const SupplierPortalDashboard: React.FC<SupplierPortalDashboardProps> = ({
  user,
  onBack,
  supplierName = 'Askari Cement Industries Ltd.'
}) => {
  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const newRFQs = mockRFQs.filter(rfq => rfq.status === 'open').length;
    const activePOs = mockPurchaseOrders.filter(po => 
      ['pending-acknowledgment', 'accepted', 'in-progress'].includes(po.status)
    ).length;
    const pendingInvoices = mockInvoices.filter(inv => 
      ['pending', 'approved'].includes(inv.status)
    ).length;
    
    // Calculate YTD payments (mock calculation)
    const ytdPayments = 12500000; // This would be calculated from actual payment data

    return {
      newRFQs,
      activePOs,
      pendingInvoices,
      ytdPayments
    };
  }, []);

  const getStatusBadge = (status: string, type: string) => {
    const rfqVariants = {
      open: 'bg-green-100 text-green-800 border-green-200',
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      awarded: 'bg-purple-100 text-purple-800 border-purple-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const poVariants = {
      'pending-acknowledgment': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const invoiceVariants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      overdue: 'bg-red-100 text-red-800 border-red-200'
    };

    const activityVariants = {
      'Awaiting Your Bid': 'bg-green-100 text-green-800 border-green-200',
      'PO Pending Acknowledgment': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PO Accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'Invoice Approved': 'bg-blue-100 text-blue-800 border-blue-200',
      'Payment Received': 'bg-green-100 text-green-800 border-green-200'
    };

    let variants;
    if (type === 'RFQ') variants = rfqVariants;
    else if (type === 'PO') variants = poVariants;
    else if (type === 'Invoice') variants = invoiceVariants;
    else variants = activityVariants;

    const variant = variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <Badge className={`${variant} border`}>
        {status}
      </Badge>
    );
  };

  const getActionButton = (activity: RecentActivity) => {
    if (!activity.actionRequired) return null;

    const buttonProps = {
      'RFQ': { text: 'Submit Bid', icon: Send, variant: 'default' as const },
      'PO': { text: 'Acknowledge', icon: CheckCircle, variant: 'default' as const },
      'Invoice': { text: 'View Details', icon: Eye, variant: 'outline' as const },
      'Payment': { text: 'View Details', icon: Eye, variant: 'outline' as const }
    };

    const config = buttonProps[activity.type];
    const Icon = config.icon;

    return (
      <Button size="sm" variant={config.variant} className="gap-2">
        <Icon className="h-4 w-4" />
        {config.text}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">
              Welcome, {supplierName}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your business activities and track orders with our platform
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Last Login: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">New RFQs to Bid On</p>
                  <p className="text-3xl font-medium text-green-900 mt-2">
                    {dashboardMetrics.newRFQs}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Action required
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <FileText className="h-8 w-8 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Purchase Orders</p>
                  <p className="text-3xl font-medium text-blue-900 mt-2">
                    {dashboardMetrics.activePOs}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    In progress
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Pending Invoices</p>
                  <p className="text-3xl font-medium text-yellow-900 mt-2">
                    {dashboardMetrics.pendingInvoices}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Awaiting payment
                  </p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <Receipt className="h-8 w-8 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Payments (YTD)</p>
                  <p className="text-3xl font-medium text-purple-900 mt-2">
                    {formatPKR(dashboardMetrics.ytdPayments)}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    Year to date
                  </p>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Your latest business activities and required actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Date</TableHead>
                        <TableHead>Document ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRecentActivities.map((activity) => (
                        <TableRow 
                          key={activity.id} 
                          className={`hover:bg-gray-50 ${
                            activity.actionRequired ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(activity.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium font-mono">
                            {activity.documentId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {activity.type === 'RFQ' && <FileText className="h-4 w-4 text-green-600" />}
                              {activity.type === 'PO' && <Package2 className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'Invoice' && <Receipt className="h-4 w-4 text-yellow-600" />}
                              {activity.type === 'Payment' && <DollarSign className="h-4 w-4 text-purple-600" />}
                              <span className="font-medium">{activity.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>
                            {getStatusBadge(activity.status, activity.type)}
                          </TableCell>
                          <TableCell>
                            {getActionButton(activity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions and Summaries */}
          <div className="space-y-6">
            
            {/* Open RFQs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Open RFQs
                </CardTitle>
                <CardDescription>
                  Request for quotations awaiting your bid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRFQs.filter(rfq => rfq.status === 'open').map((rfq) => (
                    <div key={rfq.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-green-900">{rfq.id}</h4>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {rfq.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-800 mb-2">{rfq.title}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-700">
                          Est: {formatPKR(rfq.estimatedValue)}
                        </span>
                        <span className="text-green-700">
                          Due: {new Date(rfq.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Bid
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Purchase Orders Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-blue-600" />
                  Active Purchase Orders
                </CardTitle>
                <CardDescription>
                  Current orders requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPurchaseOrders
                    .filter(po => po.status !== 'completed')
                    .slice(0, 3)
                    .map((po) => (
                    <div key={po.id} className="border p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium font-mono">{po.id}</span>
                        {getStatusBadge(po.status, 'PO')}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{po.description}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPKR(po.totalAmount)}</span>
                        <span>Due: {new Date(po.deliveryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Invoices Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-yellow-600" />
                  Pending Invoices
                </CardTitle>
                <CardDescription>
                  Invoices awaiting payment processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.map((invoice) => (
                    <div key={invoice.id} className="border p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium font-mono">{invoice.id}</span>
                        {getStatusBadge(invoice.status, 'Invoice')}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPKR(invoice.amount)}</span>
                        <span>Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full gap-2">
                    <Receipt className="h-4 w-4" />
                    View All Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};