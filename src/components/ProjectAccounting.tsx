import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { User } from '../types';
import { 
  Plus,
  Building2,
  DollarSign,
  TrendingUp,
  Target,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Percent,
  ArrowLeft,
  Receipt,
  Calculator,
  Wallet,
  FileText
} from 'lucide-react';

interface ProjectAccountingProps {
  user: User;
  onNavigate?: (page: string, data?: any) => void;
}

interface Project {
  id: string;
  name: string;
  location: string;
  type: 'residential' | 'commercial' | 'mixed-use' | 'industrial';
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  estimatedEndDate: string;
  totalBudget: number;
  costsIncurred: number;
  revenueBooked: number;
  cashCollected: number;
  totalUnits: number;
  unitsSold: number;
  projectManager: string;
  description: string;
}

interface ProjectExpense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  invoiceNumber: string;
  amount: number;
  description: string;
}

interface BudgetLineItem {
  id: string;
  category: string;
  budgetedAmount: number;
  actualSpent: number;
  amountRemaining: number;
}

interface ProjectSale {
  id: string;
  unitNumber: string;
  clientName: string;
  saleValue: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
}

export const ProjectAccounting: React.FC<ProjectAccountingProps> = ({ user, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'project-detail'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('cost-ledger');

  // Mock project data - enhanced with specific data for user's requirements
  const projects: Project[] = [
    {
      id: '1',
      name: 'Downtown Towers Phase 1',
      location: 'Downtown District, Karachi',
      type: 'residential',
      status: 'active',
      startDate: '2023-06-01',
      estimatedEndDate: '2025-12-31',
      totalBudget: 15000000,
      costsIncurred: 8750000,
      revenueBooked: 12000000,
      cashCollected: 8500000,
      totalUnits: 120,
      unitsSold: 85,
      projectManager: 'Sarah Johnson',
      description: 'Luxury residential high-rise with 120 premium apartments'
    },
    {
      id: '2',
      name: 'Riverside Villa Community',
      location: 'Defence Phase 8, Karachi',
      type: 'residential',
      status: 'active',
      startDate: '2023-09-01',
      estimatedEndDate: '2024-08-31',
      totalBudget: 8500000,
      costsIncurred: 4200000,
      revenueBooked: 6800000,
      cashCollected: 3900000,
      totalUnits: 25,
      unitsSold: 18,
      projectManager: 'Michael Chen',
      description: 'Premium villa development with modern amenities'
    },
    {
      id: '3',
      name: 'Metro Commercial Complex',
      location: 'Gulshan-e-Iqbal, Karachi',
      type: 'commercial',
      status: 'planning',
      startDate: '2024-03-01',
      estimatedEndDate: '2026-06-30',
      totalBudget: 25000000,
      costsIncurred: 850000,
      revenueBooked: 2100000,
      cashCollected: 750000,
      totalUnits: 45,
      unitsSold: 8,
      projectManager: 'David Rodriguez',
      description: 'Mixed-use commercial complex with retail and office spaces'
    },
    {
      id: '4',
      name: 'Industrial Park Phase A',
      location: 'Port Qasim, Karachi',
      type: 'industrial',
      status: 'active',
      startDate: '2023-04-15',
      estimatedEndDate: '2025-03-31',
      totalBudget: 35000000,
      costsIncurred: 18500000,
      revenueBooked: 28000000,
      cashCollected: 21000000,
      totalUnits: 12,
      unitsSold: 9,
      projectManager: 'Ali Ahmed',
      description: 'Industrial warehouse and manufacturing facility development'
    },
    {
      id: '5',
      name: 'Green Heights Mixed Development',
      location: 'Clifton Block 2, Karachi',
      type: 'mixed-use',
      status: 'completed',
      startDate: '2022-01-10',
      estimatedEndDate: '2023-10-31',
      totalBudget: 12000000,
      costsIncurred: 11200000,
      revenueBooked: 15500000,
      cashCollected: 15500000,
      totalUnits: 80,
      unitsSold: 80,
      projectManager: 'Fatima Khan',
      description: 'Mixed-use development with residential and commercial units'
    }
  ];

  const getProjectTypeDisplay = (type: string) => {
    const types = {
      'residential': 'Residential',
      'commercial': 'Commercial', 
      'mixed-use': 'Mixed Use',
      'industrial': 'Industrial'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'planning': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'completed': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      'on-hold': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calculateProjectedProfitability = (project: Project) => {
    const profitMargin = ((project.revenueBooked - project.costsIncurred) / project.revenueBooked) * 100;
    return profitMargin.toFixed(1);
  };

  const calculateBudgetProgress = (project: Project) => {
    return (project.costsIncurred / project.totalBudget) * 100;
  };

  const calculateSalesProgress = (project: Project) => {
    return (project.unitsSold / project.totalUnits) * 100;
  };

  // Summary calculations
  const totalActiveProjects = projects.filter(p => p.status === 'active').length;
  const totalInvestment = projects.reduce((sum, p) => sum + p.costsIncurred, 0);
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenueBooked, 0);
  const totalUnits = projects.reduce((sum, p) => sum + p.totalUnits, 0);
  const totalSoldUnits = projects.reduce((sum, p) => sum + p.unitsSold, 0);

  // Mock data for project details
  const getProjectExpenses = (projectId: string): ProjectExpense[] => {
    return [
      {
        id: '1',
        date: '2024-01-15',
        vendor: 'ABC Construction Co.',
        category: 'Construction - Foundation',
        invoiceNumber: 'INV-2024-001',
        amount: 125000,
        description: 'Foundation concrete pour - Phase 1'
      },
      {
        id: '2',
        date: '2024-01-12',
        vendor: 'Steel Supply Inc.',
        category: 'Materials - Steel',
        invoiceNumber: 'INV-2024-002',
        amount: 85000,
        description: 'Steel reinforcement bars - Building A'
      },
      {
        id: '3',
        date: '2024-01-10',
        vendor: 'ElectroTech Solutions',
        category: 'MEP - Electrical',
        invoiceNumber: 'INV-2024-003',
        amount: 65000,
        description: 'Electrical system installation'
      },
      {
        id: '4',
        date: '2024-01-08',
        vendor: 'City Planning Dept.',
        category: 'Permits & Approvals',
        invoiceNumber: 'PERMIT-2024-001',
        amount: 25000,
        description: 'Building permit and NOC fees'
      },
      {
        id: '5',
        date: '2024-01-05',
        vendor: 'Digital Marketing Solutions',
        category: 'Marketing - Digital',
        invoiceNumber: 'MKT-2024-001',
        amount: 35000,
        description: 'Marketing campaign - Digital advertising'
      }
    ];
  };

  const getBudgetLineItems = (projectId: string): BudgetLineItem[] => {
    return [
      {
        id: '1',
        category: 'Land Acquisition',
        budgetedAmount: 3000000,
        actualSpent: 3000000,
        amountRemaining: 0
      },
      {
        id: '2',
        category: 'Construction - Structure',
        budgetedAmount: 6500000,
        actualSpent: 4200000,
        amountRemaining: 2300000
      },
      {
        id: '3',
        category: 'Construction - Interior',
        budgetedAmount: 2800000,
        actualSpent: 1200000,
        amountRemaining: 1600000
      },
      {
        id: '4',
        category: 'MEP Systems',
        budgetedAmount: 1500000,
        actualSpent: 650000,
        amountRemaining: 850000
      },
      {
        id: '5',
        category: 'Marketing & Sales',
        budgetedAmount: 450000,
        actualSpent: 180000,
        amountRemaining: 270000
      },
      {
        id: '6',
        category: 'Legal & Permits',
        budgetedAmount: 350000,
        actualSpent: 170000,
        amountRemaining: 180000
      }
    ];
  };

  const getProjectSales = (projectId: string): ProjectSale[] => {
    return [
      {
        id: '1',
        unitNumber: 'A-1201',
        clientName: 'Johnson Family Trust',
        saleValue: 185000,
        paymentStatus: 'partial'
      },
      {
        id: '2',
        unitNumber: 'A-0801',
        clientName: 'Metro Investments LLC',
        saleValue: 145000,
        paymentStatus: 'completed'
      },
      {
        id: '3',
        unitNumber: 'B-1205',
        clientName: 'Capital Properties',
        saleValue: 225000,
        paymentStatus: 'pending'
      },
      {
        id: '4',
        unitNumber: 'A-0605',
        clientName: 'Ahmed Construction',
        saleValue: 165000,
        paymentStatus: 'completed'
      },
      {
        id: '5',
        unitNumber: 'C-0301',
        clientName: 'Sunrise Developers',
        saleValue: 195000,
        paymentStatus: 'partial'
      }
    ];
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'partial': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const renderSingleProjectView = () => {
    if (!selectedProject) return null;

    const projectExpenses = getProjectExpenses(selectedProject.id);
    const budgetLineItems = getBudgetLineItems(selectedProject.id);
    const projectSales = getProjectSales(selectedProject.id);

    return (
      <div className="p-6 space-y-6">
        {/* Header with Back Button and Project Name */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setViewMode('dashboard');
              setSelectedProject(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1>{selectedProject.name}</h1>
            <p className="text-muted-foreground">{selectedProject.description}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl text-foreground">
                    ${selectedProject.totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Receipt className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Costs Incurred (WIP)</p>
                  <p className="text-2xl text-foreground">
                    ${selectedProject.costsIncurred.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((selectedProject.costsIncurred / selectedProject.totalBudget) * 100).toFixed(1)}% of budget
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Revenue Booked</p>
                  <p className="text-2xl text-foreground">
                    ${selectedProject.revenueBooked.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Cash Collected</p>
                  <p className="text-2xl text-foreground">
                    ${selectedProject.cashCollected.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((selectedProject.cashCollected / selectedProject.revenueBooked) * 100).toFixed(1)}% of revenue
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cost-ledger">Cost Ledger</TabsTrigger>
            <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
            <TabsTrigger value="linked-sales">Linked Sales</TabsTrigger>
          </TabsList>

          {/* Cost Ledger Tab */}
          <TabsContent value="cost-ledger">
            <Card>
              <CardHeader>
                <CardTitle>Cost Ledger - Work in Progress (WIP)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Every expense allocated to {selectedProject.name}
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor/Contractor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{expense.vendor}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="font-mono text-sm">{expense.invoiceNumber}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${expense.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Costs Incurred:</span>
                    <span className="font-medium text-lg">
                      ${projectExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budgeting Tab */}
          <TabsContent value="budgeting">
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compare budgeted amounts vs actual spending for {selectedProject.name}
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Budgeted Amount</TableHead>
                      <TableHead className="text-right">Actual Spent</TableHead>
                      <TableHead className="text-right">Amount Remaining</TableHead>
                      <TableHead className="text-right">% Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetLineItems.map((item) => {
                      const percentUsed = (item.actualSpent / item.budgetedAmount) * 100;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="text-right">
                            ${item.budgetedAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.actualSpent.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={item.amountRemaining > 0 ? 'text-green-600' : 'text-red-600'}>
                              ${item.amountRemaining.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Progress value={Math.min(percentUsed, 100)} className="h-2 w-16" />
                              <span className="text-sm min-w-12">{percentUsed.toFixed(0)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Budgeted</p>
                    <p className="font-medium">
                      ${budgetLineItems.reduce((sum, item) => sum + item.budgetedAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-medium">
                      ${budgetLineItems.reduce((sum, item) => sum + item.actualSpent, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remaining Budget</p>
                    <p className="font-medium">
                      ${budgetLineItems.reduce((sum, item) => sum + item.amountRemaining, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Linked Sales Tab */}
          <TabsContent value="linked-sales">
            <Card>
              <CardHeader>
                <CardTitle>Linked Sales</CardTitle>
                <p className="text-sm text-muted-foreground">
                  All units sold in {selectedProject.name}
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit No.</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Sale Value</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-medium">{sale.unitNumber}</TableCell>
                        <TableCell>{sale.clientName}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${sale.saleValue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusBadge(sale.paymentStatus)}>
                            {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales Value</p>
                      <p className="font-medium text-lg">
                        ${projectSales.reduce((sum, sale) => sum + sale.saleValue, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Units Sold</p>
                      <p className="font-medium text-lg">
                        {projectSales.length} of {selectedProject.totalUnits} units
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (viewMode === 'project-detail' && selectedProject) {
    return renderSingleProjectView();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Accounting Dashboard</h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' ? 'Manage all development projects and track performance' : 'View your assigned project portfolio'}
          </p>
        </div>
        <Button onClick={() => onNavigate?.('add-project')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl text-foreground">{totalActiveProjects}</p>
                <p className="text-xs text-muted-foreground">of {projects.length} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl text-foreground">
                  ${totalInvestment.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">costs incurred</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Revenue Booked</p>
                <p className="text-2xl text-foreground">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                  {((totalRevenue - totalInvestment) / totalRevenue * 100).toFixed(1)}% margin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-50">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Units Sold</p>
                <p className="text-2xl text-foreground">{totalSoldUnits}</p>
                <p className="text-xs text-muted-foreground">
                  of {totalUnits} total ({((totalSoldUnits / totalUnits) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>All Projects</h2>
          <p className="text-sm text-muted-foreground">{projects.length} projects total</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const budgetProgress = calculateBudgetProgress(project);
            const salesProgress = calculateSalesProgress(project);
            const profitability = calculateProjectedProfitability(project);
            
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-2">
                      {getStatusBadge(project.status)}
                      <Badge variant="outline" className="text-xs">
                        {getProjectTypeDisplay(project.type)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Budget vs Actual Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Budget vs. Actual Cost</span>
                      <span className="text-xs text-muted-foreground">
                        {budgetProgress.toFixed(1)}% spent
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(budgetProgress, 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${project.costsIncurred.toLocaleString()}</span>
                      <span>of ${project.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Units Sold Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">% of Units Sold</span>
                      <span className="text-xs text-green-600">
                        {salesProgress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={salesProgress} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{project.unitsSold} sold</span>
                      <span>{project.totalUnits} total units</span>
                    </div>
                  </div>

                  {/* Projected Profitability */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                      <Percent className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">Projected Profitability</span>
                    </div>
                    <span className={`font-medium ${parseFloat(profitability) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitability}%
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project);
                      setViewMode('project-detail');
                    }}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Project Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>


    </div>
  );
};