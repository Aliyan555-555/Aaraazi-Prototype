import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Plus,
  Search,
  Filter,
  Building2,
  Camera,
  FileImage,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Calendar as CalendarIcon,
  Target,
  Activity,
  Award,
  Users,
  Hammer,
  HardHat,
  Wrench,
  Settings,
  MapPin,
  Flag
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format } from 'date-fns';
import { User, Project, ProjectPhase, ProjectMilestone } from '../types';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface ConstructionActivity {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  description: string;
  type: 'foundation' | 'structure' | 'roofing' | 'plumbing' | 'electrical' | 'finishing' | 'inspection' | 'other';
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progress: number; // 0-100
  assignedContractor?: string;
  supervisorId?: string;
  estimatedCost: number;
  actualCost: number;
  qualityRating?: number; // 1-5
  safetyCompliance: boolean;
  materialsUsed: ConstructionMaterial[];
  laborHours: number;
  weatherImpact?: string;
  issues: ConstructionIssue[];
  photos: ConstructionPhoto[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ConstructionMaterial {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  deliveryDate?: string;
  quality: 'excellent' | 'good' | 'acceptable' | 'poor';
}

interface ConstructionIssue {
  id: string;
  activityId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'quality' | 'safety' | 'delay' | 'cost' | 'design' | 'weather' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  resolvedDate?: string;
  resolution?: string;
  impact: string;
  photos: string[];
}

interface ConstructionPhoto {
  id: string;
  activityId: string;
  url: string;
  caption: string;
  type: 'progress' | 'issue' | 'quality' | 'safety' | 'milestone' | 'other';
  location?: string;
  takenBy: string;
  takenDate: string;
  tags: string[];
}

interface QualityInspection {
  id: string;
  projectId: string;
  activityId?: string;
  inspectionType: 'foundation' | 'structure' | 'electrical' | 'plumbing' | 'finishing' | 'final' | 'safety';
  inspectorName: string;
  inspectionDate: string;
  status: 'passed' | 'failed' | 'conditional' | 'pending';
  overallRating: number; // 1-5
  criteria: InspectionCriteria[];
  findings: string;
  recommendations: string;
  photos: string[];
  nextInspectionDate?: string;
  approvedBy?: string;
  certificateNumber?: string;
}

interface InspectionCriteria {
  id: string;
  name: string;
  description: string;
  rating: number; // 1-5
  passed: boolean;
  notes?: string;
}

interface ConstructionTrackingProps {
  user: User;
  project: Project;
  onNavigate: (page: string, data?: any) => void;
}

const ACTIVITY_STATUS_CONFIG = {
  'planned': { label: 'Planned', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Activity },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'delayed': { label: 'Delayed', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  'on-hold': { label: 'On Hold', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
};

const ACTIVITY_TYPE_CONFIG = {
  'foundation': { label: 'Foundation', icon: Building2, color: 'bg-brown-100 text-brown-800' },
  'structure': { label: 'Structure', icon: Building2, color: 'bg-gray-100 text-gray-800' },
  'roofing': { label: 'Roofing', icon: HardHat, color: 'bg-blue-100 text-blue-800' },
  'plumbing': { label: 'Plumbing', icon: Wrench, color: 'bg-blue-100 text-blue-800' },
  'electrical': { label: 'Electrical', icon: Settings, color: 'bg-yellow-100 text-yellow-800' },
  'finishing': { label: 'Finishing', icon: Award, color: 'bg-purple-100 text-purple-800' },
  'inspection': { label: 'Inspection', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  'other': { label: 'Other', icon: Hammer, color: 'bg-gray-100 text-gray-800' }
};

const ISSUE_SEVERITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-green-100 text-green-800' },
  'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' }
};

const INSPECTION_STATUS_CONFIG = {
  'passed': { label: 'Passed', color: 'bg-green-100 text-green-800' },
  'failed': { label: 'Failed', color: 'bg-red-100 text-red-800' },
  'conditional': { label: 'Conditional', color: 'bg-yellow-100 text-yellow-800' },
  'pending': { label: 'Pending', color: 'bg-blue-100 text-blue-800' }
};

export const ConstructionTracking: React.FC<ConstructionTrackingProps> = ({ 
  user, 
  project,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState('activities');
  const [activities, setActivities] = useState<ConstructionActivity[]>([]);
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ConstructionActivity | null>(null);

  // Load data
  useEffect(() => {
    loadActivities();
    loadInspections();
  }, [project.id]);

  const loadActivities = () => {
    try {
      const storedActivities = JSON.parse(localStorage.getItem('construction_activities') || '[]');
      const projectActivities = storedActivities.filter((activity: ConstructionActivity) => activity.projectId === project.id);
      setActivities(projectActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load construction activities');
    } finally {
      setIsLoading(false);
    }
  };

  const loadInspections = () => {
    try {
      const storedInspections = JSON.parse(localStorage.getItem('quality_inspections') || '[]');
      const projectInspections = storedInspections.filter((inspection: QualityInspection) => inspection.projectId === project.id);
      setInspections(projectInspections);
    } catch (error) {
      console.error('Error loading inspections:', error);
      toast.error('Failed to load inspections');
    }
  };

  const saveActivity = (activityData: Partial<ConstructionActivity>) => {
    try {
      const storedActivities = JSON.parse(localStorage.getItem('construction_activities') || '[]');
      
      if (editingActivity) {
        const updatedActivities = storedActivities.map((activity: ConstructionActivity) =>
          activity.id === editingActivity.id ? { ...activity, ...activityData, updatedAt: new Date().toISOString() } : activity
        );
        localStorage.setItem('construction_activities', JSON.stringify(updatedActivities));
        toast.success('Activity updated successfully');
      } else {
        const newActivity: ConstructionActivity = {
          id: `activity-${Date.now()}`,
          projectId: project.id,
          progress: 0,
          actualCost: 0,
          laborHours: 0,
          safetyCompliance: true,
          materialsUsed: [],
          issues: [],
          photos: [],
          ...activityData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as ConstructionActivity;
        
        storedActivities.push(newActivity);
        localStorage.setItem('construction_activities', JSON.stringify(storedActivities));
        toast.success('Activity created successfully');
      }
      
      loadActivities();
      setShowActivityForm(false);
      setEditingActivity(null);
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const updateActivityProgress = (activityId: string, progress: number) => {
    try {
      const storedActivities = JSON.parse(localStorage.getItem('construction_activities') || '[]');
      const updatedActivities = storedActivities.map((activity: ConstructionActivity) =>
        activity.id === activityId ? { 
          ...activity, 
          progress, 
          status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'planned',
          updatedAt: new Date().toISOString() 
        } : activity
      );
      localStorage.setItem('construction_activities', JSON.stringify(updatedActivities));
      loadActivities();
      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const getConstructionStats = () => {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.status === 'completed').length;
    const inProgressActivities = activities.filter(a => a.status === 'in-progress').length;
    const delayedActivities = activities.filter(a => a.status === 'delayed').length;
    
    const totalEstimatedCost = activities.reduce((sum, a) => sum + a.estimatedCost, 0);
    const totalActualCost = activities.reduce((sum, a) => sum + a.actualCost, 0);
    const totalLaborHours = activities.reduce((sum, a) => sum + a.laborHours, 0);
    
    const overallProgress = totalActivities > 0 ? 
      Math.round(activities.reduce((sum, a) => sum + a.progress, 0) / totalActivities) : 0;
    
    const averageQuality = activities.filter(a => a.qualityRating).length > 0 ?
      activities.filter(a => a.qualityRating).reduce((sum, a) => sum + (a.qualityRating || 0), 0) / activities.filter(a => a.qualityRating).length : 0;
    
    return {
      totalActivities,
      completedActivities,
      inProgressActivities,
      delayedActivities,
      overallProgress,
      totalEstimatedCost,
      totalActualCost,
      totalLaborHours,
      averageQuality,
      costVariance: totalActualCost - totalEstimatedCost
    };
  };

  const stats = getConstructionStats();

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderActivitiesTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgressActivities}</p>
                <p className="text-sm text-muted-foreground">Active Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completedActivities}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.delayedActivities}</p>
                <p className="text-sm text-muted-foreground">Delayed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(ACTIVITY_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(ACTIVITY_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setShowActivityForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredActivities.map(activity => {
          const StatusIcon = ACTIVITY_STATUS_CONFIG[activity.status].icon;
          const TypeIcon = ACTIVITY_TYPE_CONFIG[activity.type].icon;
          
          return (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{activity.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{activity.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <Badge className={ACTIVITY_STATUS_CONFIG[activity.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {ACTIVITY_STATUS_CONFIG[activity.status].label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{activity.progress}%</span>
                  </div>
                  <Progress value={activity.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Estimated Cost:</span>
                    <p className="font-medium">{formatPKR(activity.estimatedCost)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual Cost:</span>
                    <p className="font-medium">{formatPKR(activity.actualCost)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{format(new Date(activity.startDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Date:</span>
                    <p className="font-medium">{format(new Date(activity.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                {activity.qualityRating && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Quality: {activity.qualityRating}/5</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {activity.photos.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Camera className="h-3 w-3 mr-1" />
                          {activity.photos.length}
                        </Badge>
                      )}
                      {activity.issues.length > 0 && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {activity.issues.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingActivity(activity);
                        setShowActivityForm(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photos
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Issue
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No construction activities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters to see more activities.'
              : 'Start by adding construction activities to track progress.'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Button onClick={() => setShowActivityForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Activity
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Construction Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="text-blue-600"
                    strokeDasharray={`${stats.overallProgress * 3.51} 351`}
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.overallProgress}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completedActivities}</p>
                <p className="text-sm text-muted-foreground">Completed Activities</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.inProgressActivities}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.totalActivities - stats.completedActivities - stats.inProgressActivities}</p>
                <p className="text-sm text-muted-foreground">Planned</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Phase Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {project.timeline.phases.map(phase => {
            const phaseActivities = activities.filter(a => a.phaseId === phase.id);
            const phaseProgress = phaseActivities.length > 0 ? 
              Math.round(phaseActivities.reduce((sum, a) => sum + a.progress, 0) / phaseActivities.length) : 0;
            
            return (
              <div key={phase.id} className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{phase.name}</h4>
                    <p className="text-sm text-muted-foreground">{phaseActivities.length} activities</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{phaseProgress}%</span>
                  </div>
                </div>
                <Progress value={phaseProgress} className="h-3" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatPKR(stats.totalEstimatedCost)}</p>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatPKR(stats.totalActualCost)}</p>
              <p className="text-sm text-muted-foreground">Actual Cost</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${stats.costVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatPKR(Math.abs(stats.costVariance))}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.costVariance >= 0 ? 'Over Budget' : 'Under Budget'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQualityTab = () => (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.averageQuality.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Quality Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{inspections.filter(i => i.status === 'passed').length}</p>
                <p className="text-sm text-muted-foreground">Passed Inspections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.reduce((sum, a) => sum + a.issues.filter(i => i.status === 'open').length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quality Inspections</CardTitle>
            <Button onClick={() => setShowInspectionForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Inspection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inspections.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map(inspection => (
                  <TableRow key={inspection.id}>
                    <TableCell className="capitalize">{inspection.inspectionType.replace('-', ' ')}</TableCell>
                    <TableCell>{inspection.inspectorName}</TableCell>
                    <TableCell>{format(new Date(inspection.inspectionDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>{inspection.overallRating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={INSPECTION_STATUS_CONFIG[inspection.status].color}>
                        {INSPECTION_STATUS_CONFIG[inspection.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Certificate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No inspections recorded</h3>
              <p className="text-muted-foreground mb-4">
                Start recording quality inspections to track construction standards.
              </p>
              <Button onClick={() => setShowInspectionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Inspection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPhotosTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Construction Photos</CardTitle>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Photo Documentation</h3>
            <p className="text-muted-foreground mb-4">
              Upload and organize construction progress photos by activity and date.
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Start Uploading
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Construction Tracking</h1>
          <p className="text-muted-foreground">
            Monitor construction progress and quality for {project.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="photos">Photo Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-6">
          {renderActivitiesTab()}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          {renderProgressTab()}
        </TabsContent>

        <TabsContent value="quality" className="mt-6">
          {renderQualityTab()}
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          {renderPhotosTab()}
        </TabsContent>
      </Tabs>

      {/* Activity Form Dialog */}
      <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add Construction Activity'}</DialogTitle>
            <DialogDescription>
              {editingActivity ? 'Update activity details' : 'Add a new construction activity to track progress'}
            </DialogDescription>
          </DialogHeader>
          <ActivityFormContent 
            activity={editingActivity} 
            project={project}
            onSave={saveActivity} 
            onCancel={() => {
              setShowActivityForm(false);
              setEditingActivity(null);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Activity Form Component
const ActivityFormContent: React.FC<{
  activity: ConstructionActivity | null;
  project: Project;
  onSave: (data: Partial<ConstructionActivity>) => void;
  onCancel: () => void;
}> = ({ activity, project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    type: activity?.type || 'foundation',
    status: activity?.status || 'planned',
    phaseId: activity?.phaseId || (project.timeline.phases[0]?.id || ''),
    startDate: activity?.startDate || new Date().toISOString().split('T')[0],
    endDate: activity?.endDate || new Date().toISOString().split('T')[0],
    estimatedCost: activity?.estimatedCost || 0,
    assignedContractor: activity?.assignedContractor || '',
    notes: activity?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Activity Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Foundation Excavation"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Activity Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_TYPE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detailed description of the activity..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phaseId">Project Phase</Label>
          <Select value={formData.phaseId} onValueChange={(value) => setFormData(prev => ({ ...prev, phaseId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select phase" />
            </SelectTrigger>
            <SelectContent>
              {project.timeline.phases.map(phase => (
                <SelectItem key={phase.id} value={phase.id}>
                  {phase.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedCost">Estimated Cost (PKR)</Label>
          <Input
            id="estimatedCost"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) || 0 }))}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedContractor">Assigned Contractor</Label>
          <Input
            id="assignedContractor"
            value={formData.assignedContractor}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedContractor: e.target.value }))}
            placeholder="Contractor name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this activity..."
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {activity ? 'Update Activity' : 'Create Activity'}
        </Button>
      </div>
    </form>
  );
};