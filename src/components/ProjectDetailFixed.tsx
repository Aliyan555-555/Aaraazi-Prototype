import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { 
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Plus,
  Home,
  Hammer,
  ContactRound
} from 'lucide-react';
import { format } from 'date-fns';
import { User, Project, ProjectPhase, ProjectStakeholder, ProjectContractor } from '../types';
import { toast } from 'sonner';
import { UnitBookingSystem } from './UnitBookingSystem';
import { ConstructionTracking } from './ConstructionTracking';
import { formatPKR } from '../lib/currency';

interface ProjectDetailProps {
  project: Project;
  user: User;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
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

const PHASE_STATUS_CONFIG = {
  'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
  'delayed': { label: 'Delayed', color: 'bg-red-100 text-red-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'urgent': { label: 'Urgent', color: 'bg-red-100 text-red-800' }
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  user, 
  onBack,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState<Project>(project);

  // Sync projectData when project prop changes
  useEffect(() => {
    setProjectData(project);
  }, [project]);

  // Calculate project progress
  const calculateProgress = (phases: ProjectPhase[]): number => {
    if (!phases || phases.length === 0) return 0;
    const completedPhases = phases.filter(phase => phase.status === 'completed').length;
    return Math.round((completedPhases / phases.length) * 100);
  };

  // Calculate financial metrics
  const getFinancialMetrics = () => {
    const totalBudget = projectData.budget?.totalBudget || 0;
    const spentBudget = projectData.budget?.spentBudget || 0;
    const projectedRevenue = projectData.revenue?.projectedRevenue || 0;
    const projectedProfit = projectedRevenue - totalBudget;
    const profitMargin = projectedRevenue > 0 ? (projectedProfit / projectedRevenue) * 100 : 0;
    const roi = totalBudget > 0 ? (projectedProfit / totalBudget) * 100 : 0;
    const budgetUtilization = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

    return {
      totalBudget,
      spentBudget,
      remainingBudget: totalBudget - spentBudget,
      budgetUtilization,
      projectedRevenue,
      projectedProfit,
      profitMargin,
      roi
    };
  };

  const metrics = getFinancialMetrics();
  const overallProgress = calculateProgress(projectData.timeline?.phases || []);
  const StatusIcon = PROJECT_STATUS_CONFIG[projectData.status]?.icon || Target;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(metrics.totalBudget / 1000000)}M</p>
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
                <p className="text-2xl font-bold">{formatPKR(metrics.projectedRevenue / 1000000)}M</p>
                <p className="text-sm text-muted-foreground">Projected Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {(projectData.team?.stakeholders?.length || 0) + (projectData.team?.contractors?.length || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Info and Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{projectData.type?.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge className={PROJECT_STATUS_CONFIG[projectData.status]?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {PROJECT_STATUS_CONFIG[projectData.status]?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <Badge className={PRIORITY_CONFIG[projectData.priority]?.color}>
                {PRIORITY_CONFIG[projectData.priority]?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{projectData.location?.city}, {projectData.location?.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span>{projectData.timeline?.startDate ? format(new Date(projectData.timeline.startDate), 'MMM dd, yyyy') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span>{projectData.timeline?.estimatedEndDate ? format(new Date(projectData.timeline.estimatedEndDate), 'MMM dd, yyyy') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Units:</span>
              <span>{projectData.properties?.totalUnits || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget Utilization</span>
                <span className="font-medium">{metrics.budgetUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.budgetUtilization} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget:</span>
                <span className="font-semibold">{formatPKR(metrics.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent:</span>
                <span className="text-red-600">{formatPKR(metrics.spentBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="text-green-600">{formatPKR(metrics.remainingBudget)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projected Profit:</span>
                <span className={`font-semibold ${metrics.projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPKR(metrics.projectedProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-medium">{metrics.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI:</span>
                <span className="font-medium">{metrics.roi.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Description */}
      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {projectData.description}
          </p>
          
          {projectData.tags && projectData.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {projectData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTimelineTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Phases</CardTitle>
            <Badge className={PROJECT_STATUS_CONFIG[projectData.status]?.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {PROJECT_STATUS_CONFIG[projectData.status]?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectData.timeline?.phases && projectData.timeline.phases.length > 0 ? (
              projectData.timeline.phases.map((phase, index) => {
                const phaseProgress = phase.progress || 0;
                const isCurrentPhase = projectData.timeline?.currentPhase === phase.id;
                
                return (
                  <Card key={phase.id} className={`p-4 ${isCurrentPhase ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'in-progress' ? 'bg-blue-500' :
                            phase.status === 'delayed' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{phase.name}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={PHASE_STATUS_CONFIG[phase.status]?.color}>
                            {PHASE_STATUS_CONFIG[phase.status]?.label}
                          </Badge>
                          {isCurrentPhase && (
                            <Badge className="bg-blue-100 text-blue-800 ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <p className="font-medium">{format(new Date(phase.startDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End Date:</span>
                          <p className="font-medium">{format(new Date(phase.endDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">{formatPKR(phase.budgetAllocation || 0)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{phaseProgress}%</span>
                        </div>
                        <Progress value={phaseProgress} className="h-2" />
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No phases defined</h3>
                <p className="text-muted-foreground mb-4">
                  Project phases will help track progress and milestones
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Quick Link to CRM */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ContactRound className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Manage Project Relationships</h3>
                <p className="text-sm text-blue-700">
                  Use the Developers CRM to manage stakeholders, vendors, contractors, and customers for this project.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('crm')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Open CRM
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholders */}
      <Card>
        <CardHeader>
          <CardTitle>Stakeholders</CardTitle>
        </CardHeader>
        <CardContent>
          {projectData.team?.stakeholders && projectData.team.stakeholders.length > 0 ? (
            <div className="space-y-4">
              {projectData.team.stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{stakeholder.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{stakeholder.role}</p>
                      {stakeholder.company && (
                        <p className="text-xs text-muted-foreground">{stakeholder.company}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={
                      stakeholder.influence === 'high' ? 'bg-red-100 text-red-800' :
                      stakeholder.influence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {stakeholder.influence} influence
                    </Badge>
                    
                    <div className="flex space-x-1">
                      {stakeholder.email && (
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {stakeholder.phone && (
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No stakeholders added</h3>
              <p className="text-muted-foreground mb-4">
                Use the CRM to add stakeholders and track their involvement
              </p>
              <Button onClick={() => onNavigate('crm')}>
                <Plus className="h-4 w-4 mr-2" />
                Open CRM
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contractors */}
      <Card>
        <CardHeader>
          <CardTitle>Contractors & Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          {projectData.team?.contractors && projectData.team.contractors.length > 0 ? (
            <div className="space-y-4">
              {projectData.team.contractors.map((contractor) => (
                <div key={contractor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contractor.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{contractor.type?.replace('-', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{contractor.company}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={
                      contractor.status === 'active' ? 'bg-green-100 text-green-800' :
                      contractor.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      contractor.status === 'contracted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {contractor.status}
                    </Badge>
                    {contractor.contractValue && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPKR(contractor.contractValue)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No contractors added</h3>
              <p className="text-muted-foreground mb-4">
                Use the CRM to add contractors and vendors to manage project resources
              </p>
              <Button onClick={() => onNavigate('crm')}>
                <Plus className="h-4 w-4 mr-2" />
                Open CRM
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialTab = () => (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatPKR(metrics.totalBudget)}</p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatPKR(metrics.projectedRevenue)}</p>
              <p className="text-sm text-muted-foreground">Projected Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className={`text-2xl font-bold ${metrics.projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPKR(metrics.projectedProfit)}
              </p>
              <p className="text-sm text-muted-foreground">Projected Profit</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Streams</CardTitle>
        </CardHeader>
        <CardContent>
          {projectData.revenue?.revenueStreams && projectData.revenue.revenueStreams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Projected Amount</TableHead>
                  <TableHead className="text-right">Probability</TableHead>
                  <TableHead>Timing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData.revenue.revenueStreams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell className="capitalize">{stream.type?.replace('-', ' ')}</TableCell>
                    <TableCell>{stream.description}</TableCell>
                    <TableCell className="text-right">{formatPKR(stream.projectedAmount || 0)}</TableCell>
                    <TableCell className="text-right">{stream.probability || 0}%</TableCell>
                    <TableCell>{stream.timing}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No revenue streams defined</h3>
              <p className="text-muted-foreground mb-4">
                Define revenue streams to track different income sources
              </p>
              <Button onClick={() => onNavigate('edit-project', projectData)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Revenue Streams
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.profitMargin.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.roi.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">ROI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.budgetUtilization.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Budget Used</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {projectData.properties?.totalUnits && projectData.properties.totalUnits > 0 ? 
                  formatPKR(Math.round(metrics.projectedRevenue / projectData.properties.totalUnits)) : 
                  'N/A'
                }
              </p>
              <p className="text-sm text-muted-foreground">Revenue per Unit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold">{projectData.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {projectData.location?.address}, {projectData.location?.city}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={() => onNavigate('edit-project', projectData)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button variant="outline" onClick={() => onNavigate('project-accounting', { projectId: projectData.id })}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Project Accounting
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="units">Unit Booking</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            {renderTimelineTab()}
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            {renderTeamTab()}
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            {renderFinancialTab()}
          </TabsContent>

          <TabsContent value="units" className="mt-6">
            <UnitBookingSystem 
              project={projectData} 
              user={user} 
              onProjectUpdate={(updatedProject) => setProjectData(updatedProject)}
            />
          </TabsContent>

          <TabsContent value="construction" className="mt-6">
            <ConstructionTracking 
              project={projectData} 
              user={user}
              onProjectUpdate={(updatedProject) => setProjectData(updatedProject)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};