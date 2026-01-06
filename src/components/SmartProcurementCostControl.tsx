import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Plus,
  FileText,
  BarChart3,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { RFQCreationForm } from './RFQCreationForm';
import { RFQComparativeAnalysis } from './RFQComparativeAnalysis';

interface RFQSummary {
  id: string;
  title: string;
  projectName: string;
  createdDate: string;
  submissionDeadline: string;
  status: 'draft' | 'open' | 'evaluation' | 'awarded' | 'closed';
  materialsCount: number;
  suppliersInvited: number;
  bidsReceived: number;
  estimatedValue: number;
  lowestBid?: number;
}

interface SmartProcurementCostControlProps {
  user: User;
  onBack: () => void;
}

// Mock RFQ data
const mockRFQs: RFQSummary[] = [
  {
    id: 'RFQ-2024-001',
    title: 'Cement and Steel Supply - Phase 2',
    projectName: 'Gulshan Heights Residential',
    createdDate: '2024-01-20',
    submissionDeadline: '2024-02-15T17:00:00',
    status: 'evaluation',
    materialsCount: 4,
    suppliersInvited: 6,
    bidsReceived: 4,
    estimatedValue: 2500000,
    lowestBid: 2298000
  },
  {
    id: 'RFQ-2024-002',
    title: 'Electrical Equipment & Wiring',
    projectName: 'Marina View Apartments',
    createdDate: '2024-01-25',
    submissionDeadline: '2024-02-20T16:00:00',
    status: 'open',
    materialsCount: 8,
    suppliersInvited: 4,
    bidsReceived: 2,
    estimatedValue: 1800000
  },
  {
    id: 'RFQ-2024-003',
    title: 'Paint and Finishing Materials',
    projectName: 'Green Valley Villas',
    createdDate: '2024-01-15',
    submissionDeadline: '2024-02-10T18:00:00',
    status: 'awarded',
    materialsCount: 6,
    suppliersInvited: 5,
    bidsReceived: 5,
    estimatedValue: 950000,
    lowestBid: 875000
  },
  {
    id: 'RFQ-2024-004',
    title: 'Tiles and Flooring Package',
    projectName: 'City Square Commercial',
    createdDate: '2024-02-01',
    submissionDeadline: '2024-02-25T15:00:00',
    status: 'open',
    materialsCount: 12,
    suppliersInvited: 7,
    bidsReceived: 3,
    estimatedValue: 3200000
  },
  {
    id: 'RFQ-2024-005',
    title: 'Plumbing and Sanitary Fixtures',
    projectName: 'Gulshan Heights Residential',
    createdDate: '2024-01-28',
    submissionDeadline: '2024-02-18T16:30:00',
    status: 'draft',
    materialsCount: 15,
    suppliersInvited: 0,
    bidsReceived: 0,
    estimatedValue: 1650000
  }
];

export const SmartProcurementCostControl: React.FC<SmartProcurementCostControlProps> = ({
  user,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQSummary | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'analysis'>('list');

  // Filter RFQs based on search
  const filteredRFQs = useMemo(() => {
    if (!searchTerm) return mockRFQs;
    
    return mockRFQs.filter(rfq =>
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRFQs = mockRFQs.length;
    const activeRFQs = mockRFQs.filter(rfq => ['open', 'evaluation'].includes(rfq.status)).length;
    const completedRFQs = mockRFQs.filter(rfq => rfq.status === 'awarded').length;
    
    const totalEstimatedValue = mockRFQs.reduce((sum, rfq) => sum + rfq.estimatedValue, 0);
    const totalBidsValue = mockRFQs.reduce((sum, rfq) => sum + (rfq.lowestBid || 0), 0);
    const savings = totalEstimatedValue - totalBidsValue;
    const savingsPercentage = totalEstimatedValue > 0 ? (savings / totalEstimatedValue) * 100 : 0;

    const avgResponseRate = mockRFQs.reduce((sum, rfq) => {
      return sum + (rfq.suppliersInvited > 0 ? (rfq.bidsReceived / rfq.suppliersInvited) * 100 : 0);
    }, 0) / totalRFQs;

    return {
      totalRFQs,
      activeRFQs,
      completedRFQs,
      totalEstimatedValue,
      totalSavings: savings,
      savingsPercentage: Math.round(savingsPercentage * 10) / 10,
      avgResponseRate: Math.round(avgResponseRate)
    };
  }, []);

  const handleCreateRFQ = () => {
    setViewMode('create');
  };

  const handleViewAnalysis = (rfq: RFQSummary) => {
    setSelectedRFQ(rfq);
    setViewMode('analysis');
  };

  const handleBackToList = () => {
    setSelectedRFQ(null);
    setViewMode('list');
  };

  const getStatusBadge = (status: RFQSummary['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      open: 'bg-green-100 text-green-800 border-green-200',
      evaluation: 'bg-blue-100 text-blue-800 border-blue-200',
      awarded: 'bg-purple-100 text-purple-800 border-purple-200',
      closed: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      draft: 'Draft',
      open: 'Open',
      evaluation: 'Under Evaluation',
      awarded: 'Awarded',
      closed: 'Closed'
    };

    const icons = {
      draft: <Clock className="h-3 w-3" />,
      open: <CheckCircle className="h-3 w-3" />,
      evaluation: <BarChart3 className="h-3 w-3" />,
      awarded: <Star className="h-3 w-3" />,
      closed: <AlertCircle className="h-3 w-3" />
    };

    return (
      <Badge className={`${variants[status]} border flex items-center gap-1`}>
        {icons[status]}
        {labels[status]}
      </Badge>
    );
  };

  // Handle different view modes
  if (viewMode === 'create') {
    return (
      <RFQCreationForm
        user={user}
        onBack={handleBackToList}
      />
    );
  }

  if (viewMode === 'analysis' && selectedRFQ) {
    return (
      <RFQComparativeAnalysis
        user={user}
        onBack={handleBackToList}
        rfqId={selectedRFQ.id}
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
              <h1 className="text-2xl font-medium text-gray-900">Smart Procurement & Cost Control</h1>
              <p className="text-gray-600 mt-1">
                Streamlined RFQ management and competitive bidding analysis
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={handleCreateRFQ} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Create New RFQ
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
                <FileText className="h-5 w-5" />
                Active RFQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-blue-900 mb-2">
                {kpis.activeRFQs}
              </div>
              <p className="text-sm text-blue-700">
                {kpis.totalRFQs} total RFQs created
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <TrendingDown className="h-5 w-5" />
                Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-green-900 mb-2">
                {kpis.savingsPercentage}%
              </div>
              <p className="text-sm text-green-700">
                {formatPKR(kpis.totalSavings)} saved vs estimates
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                <Star className="h-5 w-5" />
                Completed RFQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-purple-900 mb-2">
                {kpis.completedRFQs}
              </div>
              <p className="text-sm text-purple-700">
                Successfully awarded projects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <TrendingUp className="h-5 w-5" />
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-orange-900 mb-2">
                {kpis.avgResponseRate}%
              </div>
              <p className="text-sm text-orange-700">
                Average supplier response rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  RFQ Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cost Analytics
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Supplier Performance
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              
              {/* RFQ Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Request for Quotations</h3>
                    <p className="text-sm text-gray-600">
                      Manage and track all RFQ processes from creation to award
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search RFQs..."
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
                        <TableHead>RFQ Details</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Materials</TableHead>
                        <TableHead>Suppliers</TableHead>
                        <TableHead>Estimated Value</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRFQs.map((rfq) => {
                        const isOverdue = new Date(rfq.submissionDeadline) < new Date() && rfq.status === 'open';
                        
                        return (
                          <TableRow 
                            key={rfq.id} 
                            className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium">{rfq.title}</div>
                                <div className="text-sm text-gray-600 font-mono">{rfq.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{rfq.projectName}</div>
                              <div className="text-sm text-gray-600">
                                Created: {new Date(rfq.createdDate).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="font-medium">{rfq.materialsCount}</div>
                              <div className="text-sm text-gray-600">materials</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="font-medium">{rfq.bidsReceived}/{rfq.suppliersInvited}</div>
                              <div className="text-sm text-gray-600">
                                {rfq.suppliersInvited > 0 ? 
                                  `${Math.round((rfq.bidsReceived / rfq.suppliersInvited) * 100)}% response` 
                                  : 'No invites sent'
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{formatPKR(rfq.estimatedValue)}</div>
                              {rfq.lowestBid && (
                                <div className="text-sm text-green-600">
                                  Lowest: {formatPKR(rfq.lowestBid)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className={isOverdue ? 'text-red-600' : ''}>
                                  {new Date(rfq.submissionDeadline).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {isOverdue && (
                                <div className="text-sm text-red-600">Overdue</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(rfq.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="gap-2"
                                  onClick={() => handleViewAnalysis(rfq)}
                                  disabled={rfq.bidsReceived === 0}
                                >
                                  <Eye className="h-4 w-4" />
                                  {rfq.bidsReceived > 0 ? 'Analyze' : 'No Bids'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Cost Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Cost Analysis & Savings Dashboard</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Savings by Project */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-green-500" />
                          Savings by Project
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockRFQs
                            .filter(rfq => rfq.lowestBid)
                            .map((rfq) => {
                              const savings = rfq.estimatedValue - (rfq.lowestBid || 0);
                              const savingsPercent = (savings / rfq.estimatedValue) * 100;
                              
                              return (
                                <div key={rfq.id} className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{rfq.projectName}</div>
                                    <div className="text-sm text-gray-600">
                                      {formatPKR(savings)} saved
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-green-600">
                                      {savingsPercent.toFixed(1)}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* RFQ Status Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                          RFQ Status Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {['open', 'evaluation', 'awarded', 'draft'].map((status) => {
                            const count = mockRFQs.filter(rfq => rfq.status === status).length;
                            const percentage = (count / mockRFQs.length) * 100;
                            
                            return (
                              <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(status as RFQSummary['status'])}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium w-8">{count}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Response Rates */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                          Supplier Response Rates
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockRFQs
                            .filter(rfq => rfq.suppliersInvited > 0)
                            .sort((a, b) => (b.bidsReceived / b.suppliersInvited) - (a.bidsReceived / a.suppliersInvited))
                            .slice(0, 5)
                            .map((rfq) => {
                              const responseRate = (rfq.bidsReceived / rfq.suppliersInvited) * 100;
                              
                              return (
                                <div key={rfq.id} className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{rfq.title}</div>
                                    <div className="text-sm text-gray-600">
                                      {rfq.bidsReceived}/{rfq.suppliersInvited} suppliers
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className={`font-medium ${
                                      responseRate >= 70 ? 'text-green-600' :
                                      responseRate >= 50 ? 'text-yellow-600' : 
                                      'text-red-600'
                                    }`}>
                                      {responseRate.toFixed(0)}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Supplier Performance Tab */}
              <TabsContent value="suppliers" className="space-y-6">
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium mb-2">Supplier Performance Analytics</h3>
                  <p className="text-sm">
                    Detailed supplier performance metrics will be available here
                  </p>
                  <Button variant="outline" className="mt-4">
                    View Supplier Management
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};