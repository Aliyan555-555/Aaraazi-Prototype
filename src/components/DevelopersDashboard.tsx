import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { User, Project } from '../types';
import { formatPKR } from '../lib/currency';

// PHASE 5: Import foundation components ✅
import { MetricCard } from './ui/metric-card';
import { InfoPanel } from './ui/info-panel';

import { 
  FolderKanban,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Home,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Target,
  Award,
  Hammer
} from 'lucide-react';

interface DevelopersDashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export const DevelopersDashboard: React.FC<DevelopersDashboardProps> = ({ user, onNavigate }) => {
  const projects = useMemo(() => {
    try {
      const savedProjects = localStorage.getItem('projects');
      if (!savedProjects) return [];
      const allProjects = JSON.parse(savedProjects);
      
      if (!Array.isArray(allProjects)) return [];
      
      const validProjects = allProjects.filter((project: any) => 
        project && project.id && project.name && project.agentId && 
        project.team && Array.isArray(project.team.agents)
      );
      
      return user.role === 'admin' 
        ? validProjects 
        : validProjects.filter((project: Project) => 
            project.agentId === user.id || 
            project.team.agents.includes(user.id)
          );
    } catch (error) {
      console.error('Error parsing projects data:', error);
      return [];
    }
  }, [user.id, user.role]);

  // Load construction activities
  const constructionActivities = useMemo(() => {
    try {
      const storedActivities = localStorage.getItem('construction_activities') || '[]';
      const allActivities = JSON.parse(storedActivities);
      return allActivities.filter((activity: any) => 
        projects.some(p => p.id === activity.projectId)
      );
    } catch (error) {
      console.error('Error loading construction activities:', error);
      return [];
    }
  }, [projects]);

  // Load unit bookings
  const unitBookings = useMemo(() => {
    try {
      const storedBookings = localStorage.getItem('unit_bookings') || '[]';
      const allBookings = JSON.parse(storedBookings);
      return allBookings.filter((booking: any) => 
        projects.some(p => p.id === booking.projectId)
      );
    } catch (error) {
      console.error('Error loading unit bookings:', error);
      return [];
    }
  }, [projects]);

  // Load project units
  const projectUnits = useMemo(() => {
    try {
      const storedUnits = localStorage.getItem('project_units') || '[]';
      const allUnits = JSON.parse(storedUnits);
      return allUnits.filter((unit: any) => 
        projects.some(p => p.id === unit.projectId)
      );
    } catch (error) {
      console.error('Error loading project units:', error);
      return [];
    }
  }, [projects]);

  const stats = useMemo(() => {
    // Project Stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p: Project) => 
      ['construction', 'marketing', 'sales', 'permitting'].includes(p.status)
    ).length;
    const completedProjects = projects.filter((p: Project) => p.status === 'completed').length;
    const totalProjectBudget = projects.reduce((sum: number, p: Project) => 
      sum + p.budget.totalBudget, 0
    );
    const totalProjectRevenue = projects.reduce((sum: number, p: Project) => 
      sum + p.revenue.projectedRevenue, 0
    );

    // Construction Stats
    const totalActivities = constructionActivities.length;
    const completedActivities = constructionActivities.filter((a: any) => a.status === 'completed').length;
    const inProgressActivities = constructionActivities.filter((a: any) => a.status === 'in-progress').length;
    const delayedActivities = constructionActivities.filter((a: any) => a.status === 'delayed').length;
    const overallProgress = totalActivities > 0 ? 
      Math.round(constructionActivities.reduce((sum: number, a: any) => sum + (a.progress || 0), 0) / totalActivities) : 0;

    // Unit & Booking Stats
    const totalUnits = projectUnits.length;
    const availableUnits = projectUnits.filter((u: any) => u.status === 'available').length;
    const soldUnits = projectUnits.filter((u: any) => u.status === 'sold').length;
    const reservedUnits = projectUnits.filter((u: any) => u.status === 'reserved').length;
    const totalBookings = unitBookings.length;
    const activeBookings = unitBookings.filter((b: any) => b.status === 'active').length;
    const totalSalesValue = unitBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
    const receivedAmount = unitBookings.reduce((sum: number, b: any) => sum + (b.paidAmount || 0), 0);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalProjectBudget,
      totalProjectRevenue,
      totalActivities,
      completedActivities,
      inProgressActivities,
      delayedActivities,
      overallProgress,
      totalUnits,
      availableUnits,
      soldUnits,
      reservedUnits,
      totalBookings,
      activeBookings,
      totalSalesValue,
      receivedAmount,
      pendingAmount: totalSalesValue - receivedAmount
    };
  }, [projects, constructionActivities, unitBookings, projectUnits]);

  const developersStatCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: stats.activeProjects > 0 ? `${stats.activeProjects} active` : 'No active projects'
    },
    {
      title: 'Construction Progress',
      value: `${stats.overallProgress}%`,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: `${stats.inProgressActivities} activities in progress`
    },
    {
      title: 'Total Units',
      value: stats.totalUnits,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: `${stats.soldUnits} sold, ${stats.availableUnits} available`
    },
    {
      title: 'Sales Revenue',
      value: formatPKR(stats.totalSalesValue / 1000000) + 'M',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: `${formatPKR(stats.receivedAmount / 1000000)}M received`
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: `${formatPKR(stats.pendingAmount / 1000000)}M pending`
    },
    {
      title: 'Project Budget',
      value: formatPKR(stats.totalProjectBudget / 1000000) + 'M',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'Total allocated budget'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developers Dashboard</h1>
          <p className="text-gray-600">Manage your construction projects and development portfolio</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => onNavigate('projects')}>
            <Eye className="h-4 w-4 mr-2" />
            View All Projects
          </Button>
          <Button onClick={() => onNavigate('add-project')}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developersStatCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Development Projects</CardTitle>
              <CardDescription>Monitor progress across your development portfolio</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onNavigate('projects')}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 4).map((project: Project) => {
              const progress = project.timeline.phases.length > 0 
                ? Math.round((project.timeline.phases.filter(p => p.status === 'completed').length / project.timeline.phases.length) * 100)
                : 0;
              
              const budgetUtilization = project.budget.totalBudget > 0 
                ? (project.budget.spentBudget / project.budget.totalBudget) * 100 
                : 0;

              return (
                <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.location.city}, {project.location.state}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Progress:</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{progress}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Budget:</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{budgetUtilization.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-semibold">{formatPKR(project.budget.totalBudget / 1000000)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold text-green-600">{formatPKR(project.revenue.projectedRevenue / 1000000)}M</p>
                      </div>
                      <Badge variant={
                        project.status === 'completed' ? 'default' : 
                        ['construction', 'marketing', 'sales'].includes(project.status) ? 'secondary' :
                        'outline'
                      }>
                        {project.status.replace('-', ' ')}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate('project-detail', project)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {projects.length === 0 && (
              <div className="text-center py-12">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">
                  Start your first development project to track construction progress and manage sales.
                </p>
                <Button onClick={() => onNavigate('add-project')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Construction Progress */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('projects')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Hammer className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Construction Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Activities</span>
                <span className="font-semibold">{stats.totalActivities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-green-600 font-semibold">{stats.completedActivities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-blue-600 font-semibold">{stats.inProgressActivities}</span>
              </div>
              {stats.delayedActivities > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delayed</span>
                  <span className="text-red-600 font-semibold">{stats.delayedActivities}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unit Sales */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('projects')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Unit Sales</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Units</span>
                <span className="font-semibold">{stats.totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sold</span>
                <span className="text-green-600 font-semibold">{stats.soldUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reserved</span>
                <span className="text-yellow-600 font-semibold">{stats.reservedUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Available</span>
                <span className="text-blue-600 font-semibold">{stats.availableUnits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('project-accounting')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Financial Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budget</span>
                <span className="font-semibold">{formatPKR(stats.totalProjectBudget / 1000000)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projected Revenue</span>
                <span className="text-green-600 font-semibold">{formatPKR(stats.totalProjectRevenue / 1000000)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sales Revenue</span>
                <span className="text-blue-600 font-semibold">{formatPKR(stats.totalSalesValue / 1000000)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Collected</span>
                <span className="text-purple-600 font-semibold">{formatPKR(stats.receivedAmount / 1000000)}M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};