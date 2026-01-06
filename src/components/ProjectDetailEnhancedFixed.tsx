import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  ArrowLeft,
  Plus,
  DollarSign,
  Building2,
  Target,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Home,
  Bed,
  Bath,
  Car,
  Square,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';
import { User, Project } from '../types';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';
import { TimelineEventForm } from './TimelineEventForm';
import { FinancialTransactionForm } from './FinancialTransactionForm';
import { UnitForm } from './UnitForm';
import { ConstructionAreaForm } from './ConstructionAreaForm';

interface ProjectDetailEnhancedProps {
  project: Project;
  user: User;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

// Enhanced Timeline Types
interface TimelineEvent {
  id: string;
  projectId: string;
  type: 'milestone' | 'phase' | 'task' | 'inspection' | 'payment' | 'delivery';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dependencies: string[];
  tags: string[];
  budget: number;
  actualCost: number;
  attachments: string[];
  notes: string;
  color?: string;
  isEditable: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Financial Types
interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'card';
  vendor?: string;
  receiptNumber?: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  tags: string[];
  attachments: string[];
}

// Enhanced Unit Types
interface EnhancedUnit {
  id: string;
  projectId: string;
  unitNumber: string;
  block?: string;
  floor?: number;
  unitType: 'studio' | '1br' | '2br' | '3br' | '4br' | 'penthouse' | 'commercial' | 'parking';
  area: number;
  builtUpArea?: number;
  balconyArea?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  basePrice: number;
  currentPrice: number;
  pricePerSqft: number;
  status: 'available' | 'blocked' | 'reserved' | 'booked' | 'sold' | 'handed-over';
  amenities: string[];
  specifications: any[];
  facing: 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
  view: string[];
  floorPlan?: string;
  images: string[];
  virtualTour?: string;
  priority: 'standard' | 'premium' | 'luxury';
  readyForHandover: boolean;
  handoverDate?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Construction Types
interface ConstructionArea {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'building' | 'amenity' | 'infrastructure' | 'landscape' | 'parking';
  supervisor: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  progress: number;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budget: number;
  spentAmount: number;
  workPackages: any[];
  issues: any[];
  qualityChecks: any[];
  safetyRecords: any[];
  photos: any[];
  weather: any[];
  materials: any[];
  labor: any[];
  equipment: any[];
  notes: string;
  tags: string[];
}

const PROJECT_STATUS_CONFIG = {
  'planning': { label: 'Planning', color: 'bg-blue-100 text-blue-800', icon: Target },
  'permitting': { label: 'Permitting', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'construction': { label: 'Construction', color: 'bg-orange-100 text-orange-800', icon: PlayCircle },
  'marketing': { label: 'Marketing', color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
  'sales': { label: 'Sales', color: 'bg-indigo-100 text-indigo-800', icon: DollarSign },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  'on-hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800', icon: PauseCircle }
};

export const ProjectDetailEnhanced: React.FC<ProjectDetailEnhancedProps> = ({ 
  project, 
  user, 
  onBack,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState<Project>(project);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [enhancedUnits, setEnhancedUnits] = useState<EnhancedUnit[]>([]);
  const [constructionAreas, setConstructionAreas] = useState<ConstructionArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [showConstructionForm, setShowConstructionForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [editingUnit, setEditingUnit] = useState<EnhancedUnit | null>(null);
  const [editingArea, setEditingArea] = useState<ConstructionArea | null>(null);

  useEffect(() => {
    loadAllData();
  }, [project.id]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadTimelineEvents(),
        loadFinancialTransactions(),
        loadEnhancedUnits(),
        loadConstructionAreas()
      ]);
    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimelineEvents = async () => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('timeline_events') || '[]');
      const projectEvents = storedEvents.filter((event: TimelineEvent) => event.projectId === project.id);
      setTimelineEvents(projectEvents);
    } catch (error) {
      console.error('Error loading timeline events:', error);
    }
  };

  const loadFinancialTransactions = async () => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem('financial_transactions') || '[]');
      const projectTransactions = storedTransactions.filter((transaction: FinancialTransaction) => 
        transaction.tags?.includes(project.id) || transaction.description?.includes(project.name)
      );
      setFinancialTransactions(projectTransactions);
    } catch (error) {
      console.error('Error loading financial transactions:', error);
    }
  };

  const loadEnhancedUnits = async () => {
    try {
      const storedUnits = JSON.parse(localStorage.getItem('enhanced_units') || '[]');
      const projectUnits = storedUnits.filter((unit: EnhancedUnit) => unit.projectId === project.id);
      setEnhancedUnits(projectUnits);
    } catch (error) {
      console.error('Error loading enhanced units:', error);
    }
  };

  const loadConstructionAreas = async () => {
    try {
      const storedAreas = JSON.parse(localStorage.getItem('construction_areas') || '[]');
      const projectAreas = storedAreas.filter((area: ConstructionArea) => area.projectId === project.id);
      setConstructionAreas(projectAreas);
    } catch (error) {
      console.error('Error loading construction areas:', error);
    }
  };

  // Save functions
  const saveTimelineEvent = (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allEvents = JSON.parse(localStorage.getItem('timeline_events') || '[]');
    allEvents.push(newEvent);
    localStorage.setItem('timeline_events', JSON.stringify(allEvents));
    setTimelineEvents(prev => [...prev, newEvent]);
  };

  const saveFinancialTransaction = (transactionData: Omit<FinancialTransaction, 'id'>) => {
    const newTransaction: FinancialTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      tags: [...(transactionData.tags || []), project.id] // Tag with project ID
    };

    const allTransactions = JSON.parse(localStorage.getItem('financial_transactions') || '[]');
    allTransactions.push(newTransaction);
    localStorage.setItem('financial_transactions', JSON.stringify(allTransactions));
    setFinancialTransactions(prev => [...prev, newTransaction]);
  };

  const saveEnhancedUnit = (unitData: Omit<EnhancedUnit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUnit: EnhancedUnit = {
      ...unitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allUnits = JSON.parse(localStorage.getItem('enhanced_units') || '[]');
    allUnits.push(newUnit);
    localStorage.setItem('enhanced_units', JSON.stringify(allUnits));
    setEnhancedUnits(prev => [...prev, newUnit]);
  };

  const saveConstructionArea = (areaData: Omit<ConstructionArea, 'id'>) => {
    const newArea = {
      ...areaData,
      id: Date.now().toString()
    };

    const allAreas = JSON.parse(localStorage.getItem('construction_areas') || '[]');
    allAreas.push(newArea);
    localStorage.setItem('construction_areas', JSON.stringify(allAreas));
    setConstructionAreas(prev => [...prev, newArea]);
  };

  // Calculate enhanced metrics
  const getEnhancedMetrics = () => {
    const totalBudget = projectData.budget?.totalBudget || 0;
    const spentBudget = projectData.budget?.spentBudget || 0;
    const projectedRevenue = projectData.revenue?.projectedRevenue || 0;
    
    // Timeline metrics
    const totalEvents = timelineEvents.length;
    const completedEvents = timelineEvents.filter(e => e.status === 'completed').length;
    const overallProgress = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
    
    // Financial metrics
    const totalTransactions = financialTransactions.length;
    const totalExpenses = financialTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = financialTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Unit metrics
    const totalUnits = enhancedUnits.length;
    const availableUnits = enhancedUnits.filter(u => u.status === 'available').length;
    const soldUnits = enhancedUnits.filter(u => u.status === 'sold' || u.status === 'booked').length;
    const totalInventoryValue = enhancedUnits.reduce((sum, unit) => sum + unit.currentPrice, 0);
    
    // Construction metrics
    const totalAreas = constructionAreas.length;
    const completedAreas = constructionAreas.filter(a => a.status === 'completed').length;
    const constructionProgress = totalAreas > 0 ? 
      Math.round(constructionAreas.reduce((sum, area) => sum + area.progress, 0) / totalAreas) : 0;
    
    return {
      totalBudget,
      spentBudget,
      remainingBudget: totalBudget - spentBudget,
      projectedRevenue,
      totalEvents,
      completedEvents,
      overallProgress,
      totalTransactions,
      totalExpenses,
      totalIncome,
      totalUnits,
      availableUnits,
      soldUnits,
      totalInventoryValue,
      totalAreas,
      completedAreas,
      constructionProgress
    };
  };

  const metrics = getEnhancedMetrics();
  const StatusIcon = PROJECT_STATUS_CONFIG[projectData.status]?.icon || Target;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-3" />
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{projectData.name}</h1>
            <p className="text-muted-foreground">{projectData.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={PROJECT_STATUS_CONFIG[projectData.status]?.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {PROJECT_STATUS_CONFIG[projectData.status]?.label}
          </Badge>
          <Button
            variant="outline"
            onClick={() => onNavigate('edit-project', projectData)}
          >
            Edit Project
          </Button>
        </div>
      </div>

      {/* Enhanced Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(metrics.totalBudget)}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(metrics.projectedRevenue)}</p>
                <p className="text-sm text-muted-foreground">Projected Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalUnits}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{projectData.location.city}, {projectData.location.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{projectData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="font-medium capitalize">{projectData.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project Manager</p>
                    <p className="font-medium">{projectData.team?.projectManager || 'Not assigned'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Budget Utilization</span>
                    <span className="text-sm font-medium">
                      {metrics.totalBudget > 0 ? ((metrics.spentBudget / metrics.totalBudget) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={metrics.totalBudget > 0 ? (metrics.spentBudget / metrics.totalBudget) * 100 : 0} 
                    className="w-full" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Budget</p>
                    <p className="font-medium">{formatPKR(metrics.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-medium text-green-600">{formatPKR(metrics.remainingBudget)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Timeline</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track project milestones and key events
                  </p>
                </div>
                <Button 
                  onClick={() => setShowTimelineForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {timelineEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No timeline events</h3>
                  <p className="text-muted-foreground mb-4">Start tracking your project progress by adding timeline events.</p>
                  <Button onClick={() => setShowTimelineForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge 
                          className={
                            event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'delayed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Type: {event.type}</span>
                        <span>Priority: {event.priority}</span>
                        <span>Progress: {event.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Management</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track income and expenses for this project
                  </p>
                </div>
                <Button 
                  onClick={() => setShowFinancialForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {financialTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No transactions recorded</h3>
                  <p className="text-muted-foreground mb-4">Start tracking your project finances by adding transactions.</p>
                  <Button onClick={() => setShowFinancialForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{formatPKR(metrics.totalIncome)}</p>
                      <p className="text-sm text-muted-foreground">Total Income</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{formatPKR(metrics.totalExpenses)}</p>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{formatPKR(metrics.totalIncome - metrics.totalExpenses)}</p>
                      <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : '-'}{formatPKR(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Smart Unit Booking System</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage project units and bookings
                  </p>
                </div>
                <Button 
                  onClick={() => setShowUnitForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {enhancedUnits.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No units created</h3>
                  <p className="text-muted-foreground mb-4">Start managing your inventory by adding units to this project.</p>
                  <Button onClick={() => setShowUnitForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Unit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{metrics.totalUnits}</p>
                      <p className="text-sm text-muted-foreground">Total Units</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{metrics.availableUnits}</p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{metrics.soldUnits}</p>
                      <p className="text-sm text-muted-foreground">Sold/Booked</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{formatPKR(metrics.totalInventoryValue)}</p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enhancedUnits.map((unit) => (
                      <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{unit.unitNumber}</h4>
                            <Badge 
                              className={
                                unit.status === 'available' ? 'bg-green-100 text-green-800' :
                                unit.status === 'sold' ? 'bg-red-100 text-red-800' :
                                unit.status === 'booked' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {unit.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 capitalize">{unit.unitType}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Square className="h-4 w-4 text-muted-foreground" />
                              <span>{unit.area} sq ft</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Bed className="h-4 w-4 text-muted-foreground" />
                              <span>{unit.bedrooms} bed</span>
                              <Bath className="h-4 w-4 text-muted-foreground" />
                              <span>{unit.bathrooms} bath</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <span>{unit.parkingSlots} parking</span>
                            </div>
                            <div className="pt-2 border-t">
                              <p className="font-semibold text-green-600">{formatPKR(unit.currentPrice)}</p>
                              <p className="text-xs text-muted-foreground">{formatPKR(unit.pricePerSqft)}/sq ft</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Construction Tab */}
        <TabsContent value="construction" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Smart Construction Tracking</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor construction progress and areas
                  </p>
                </div>
                <Button 
                  onClick={() => setShowConstructionForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Area
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {constructionAreas.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No construction areas defined</h3>
                  <p className="text-muted-foreground mb-4">Start tracking construction progress by defining project areas.</p>
                  <Button onClick={() => setShowConstructionForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Area
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{metrics.totalAreas}</p>
                      <p className="text-sm text-muted-foreground">Total Areas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{metrics.completedAreas}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{metrics.constructionProgress}%</p>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {constructionAreas.map((area) => (
                      <Card key={area.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{area.name}</h4>
                            <Badge 
                              className={
                                area.status === 'completed' ? 'bg-green-100 text-green-800' :
                                area.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                area.status === 'delayed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {area.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{area.progress}%</span>
                            </div>
                            <Progress value={area.progress} className="w-full" />
                            <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                              <div>
                                <p className="text-muted-foreground">Budget</p>
                                <p className="font-medium">{formatPKR(area.budget)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Spent</p>
                                <p className="font-medium">{formatPKR(area.spentAmount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Supervisor</p>
                                <p className="font-medium">{area.supervisor}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialogs */}
      <TimelineEventForm
        isOpen={showTimelineForm}
        onClose={() => {
          setShowTimelineForm(false);
          setEditingEvent(null);
        }}
        onSave={saveTimelineEvent}
        projectId={project.id}
        editingEvent={editingEvent}
        existingEvents={timelineEvents}
      />

      <FinancialTransactionForm
        isOpen={showFinancialForm}
        onClose={() => {
          setShowFinancialForm(false);
          setEditingTransaction(null);
        }}
        onSave={saveFinancialTransaction}
        projectId={project.id}
        editingTransaction={editingTransaction}
      />

      <UnitForm
        isOpen={showUnitForm}
        onClose={() => {
          setShowUnitForm(false);
          setEditingUnit(null);
        }}
        onSave={saveEnhancedUnit}
        projectId={project.id}
        editingUnit={editingUnit}
      />

      <ConstructionAreaForm
        isOpen={showConstructionForm}
        onClose={() => {
          setShowConstructionForm(false);
          setEditingArea(null);
        }}
        onSave={saveConstructionArea}
        projectId={project.id}
        editingArea={editingArea}
      />
    </div>
  );
};