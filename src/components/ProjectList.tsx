import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus,
  Search,
  Filter,
  Building2,
  Calendar,
  DollarSign,
  Users,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  XCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format } from 'date-fns';
import { User, Project } from '../types';
import { toast } from 'sonner';
import { getProjects, deleteProject, getProjectStats } from '../lib/projects';

interface ProjectListProps {
  user: User;
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

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' }
};

const PROJECT_TYPE_CONFIG = {
  'residential': { label: 'Residential', icon: Building2 },
  'commercial': { label: 'Commercial', icon: Building2 },
  'mixed-use': { label: 'Mixed-Use', icon: Building2 },
  'industrial': { label: 'Industrial', icon: Building2 },
  'infrastructure': { label: 'Infrastructure', icon: MapPin }
};

export const ProjectList: React.FC<ProjectListProps> = ({ user, onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = () => {
      try {
        const userProjects = getProjects(user.id, user.role);
        setProjects(userProjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const success = deleteProject(projectId);
        if (success) {
          setProjects(projects.filter(p => p.id !== projectId));
          toast.success('Project deleted successfully');
        } else {
          toast.error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const calculateProjectProgress = (project: Project): number => {
    if (!project.timeline?.phases || project.timeline.phases.length === 0) return 0;
    
    const completedPhases = project.timeline.phases.filter(phase => phase.status === 'completed').length;
    return Math.round((completedPhases / project.timeline.phases.length) * 100);
  };

  const stats = getProjectStats(user.id, user.role);

  const renderProjectCard = (project: Project) => {
    const progress = calculateProjectProgress(project);
    const StatusIcon = PROJECT_STATUS_CONFIG[project.status]?.icon || Target;
    const TypeIcon = PROJECT_TYPE_CONFIG[project.type]?.icon || Building2;

    return (
      <Card key={project.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <TypeIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg truncate">{project.name}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="flex items-center space-x-2">
                <Badge className={PROJECT_STATUS_CONFIG[project.status]?.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {PROJECT_STATUS_CONFIG[project.status]?.label}
                </Badge>
                <Badge className={PRIORITY_CONFIG[project.priority]?.color}>
                  {PRIORITY_CONFIG[project.priority]?.label}
                </Badge>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('project-detail', project)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('edit-project', project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {project.location.city}, {project.location.state}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {project.timeline?.startDate ? format(new Date(project.timeline.startDate), 'MMM yyyy') : 'N/A'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Budget</p>
              <p className="font-semibold">Rs. {project.budget.totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <p className="font-semibold text-green-600">Rs. {project.revenue.projectedRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {(project.team?.stakeholders?.length || 0) + (project.team?.contractors?.length || 0)} members
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={() => onNavigate('project-detail', project)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProjectTable = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => {
              const progress = calculateProjectProgress(project);
              const StatusIcon = PROJECT_STATUS_CONFIG[project.status]?.icon || Target;
              
              return (
                <TableRow key={project.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PROJECT_TYPE_CONFIG[project.type]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PROJECT_STATUS_CONFIG[project.status]?.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {PROJECT_STATUS_CONFIG[project.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_CONFIG[project.priority]?.color}>
                      {PRIORITY_CONFIG[project.priority]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {project.location.city}, {project.location.state}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      Rs. {(project.budget?.totalBudget || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(project.timeline.startDate), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onNavigate('project-detail', project)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNavigate('edit-project', project)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters to see more projects.'
                : 'Get started by creating your first project.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button onClick={() => onNavigate('add-project')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-3" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            Manage your real estate development projects
          </p>
        </div>
        <Button onClick={() => onNavigate('add-project')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">Rs. {(stats.totalBudget / 1000000).toFixed(1)}M</p>
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
                <p className="text-2xl font-bold">Rs. {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Projected Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(PROJECT_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(PROJECT_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(renderProjectCard)}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Try adjusting your filters to see more projects.'
                  : 'Get started by creating your first project.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button onClick={() => onNavigate('add-project')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          {renderProjectTable()}
        </TabsContent>
      </Tabs>
    </div>
  );
};