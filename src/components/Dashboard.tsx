import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Property, Lead, User, Contact, Task, Project } from '../types';
import { getProperties, getLeads, updateLead } from '../lib/data';
import { formatCurrency, formatCurrencyShort } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { RelistablePropertiesWidget } from './RelistablePropertiesWidget';
import { FollowUpTasks } from './FollowUpTasks';

// PHASE 5: Import foundation components ✅
import { MetricCard } from './ui/metric-card';
import { InfoPanel } from './ui/info-panel';

import { 
  Home, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Phone,
  Mail,
  Plus,
  Search,
  ContactRound,
  Calendar,
  AlertCircle,
  FolderKanban,
  Building2
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
  currentModule?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, currentModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const properties = useMemo(() => 
    getProperties(user.id, user.role), [user.id, user.role]
  );
  
  const leads = useMemo(() => 
    getLeads(user.id, user.role), [user.id, user.role]
  );

  // Only load projects for Developers module or legacy (no module specified)
  const projects = useMemo(() => {
    // Don't load projects for Agency module
    if (currentModule === 'agency') {
      return [];
    }
    
    try {
      const savedProjects = localStorage.getItem('projects');
      if (!savedProjects) return [];
      const allProjects = JSON.parse(savedProjects);
      
      if (!Array.isArray(allProjects)) {
        console.error('Projects data is not an array');
        return [];
      }
      
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
  }, [user.id, user.role, currentModule]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const newLeadsToday = leads.filter(l => l.createdAt === today).length;
    const activeListings = properties.filter(p => p.status === 'available').length;
    const dealsInNegotiation = properties.filter(p => p.status === 'negotiation').length;
    const totalCommission = properties
      .filter(p => p.status === 'sold' && p.commissionEarned)
      .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);

    // Project Stats (only for Developers module)
    const totalProjects = currentModule === 'agency' ? 0 : projects.length;
    const activeProjects = currentModule === 'agency' ? 0 : projects.filter((p: Project) => 
      ['construction', 'marketing', 'sales', 'permitting'].includes(p.status)
    ).length;
    const totalProjectBudget = currentModule === 'agency' ? 0 : projects.reduce((sum: number, p: Project) => 
      sum + p.budget.totalBudget, 0
    );

    return {
      newLeadsToday,
      activeListings,
      dealsInNegotiation,
      totalCommission,
      totalProjects,
      activeProjects,
      totalProjectBudget
    };
  }, [properties, leads, projects, currentModule]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, selectedStatus]);

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLead(leadId, { status: newStatus });
    window.location.reload(); // Simple refresh for demo
  };

  // Conditionally build stat cards based on module
  const statCards = currentModule === 'agency' ? [
    {
      title: 'New Leads Today',
      value: stats.newLeadsToday,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: Home,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Total Commission',
      value: formatCurrency(stats.totalCommission),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ] : [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Project Budget',
      value: `Rs. ${(stats.totalProjectBudget / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'New Leads Today',
      value: stats.newLeadsToday,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: Home,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Total Commission',
      value: formatCurrency(stats.totalCommission),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'not-interested', label: 'Not Interested' },
    { value: 'converted', label: 'Converted' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      interested: 'bg-green-100 text-green-800',
      'not-interested': 'bg-red-100 text-red-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <Button onClick={() => onNavigate('add-lead')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${currentModule !== 'agency' ? 'xl:grid-cols-6' : ''} gap-6`}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agency Transaction Cycle Management - Only show for Agency module */}
      {currentModule === 'agency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy Cycle Management Card */}
          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer group"
            onClick={() => onNavigate('buyer-workspace')}>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Buy Cycle Management</CardTitle>
                    <CardDescription>Buyer Representation & Property Matching</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Manage buyer requirements, match properties, schedule viewings, and draft offers. Complete buyer representation workflow from search to purchase.
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-gray-500">Active Searches</p>
                    <p className="text-xl text-orange-600">
                      {properties.filter(p => p.listingType === 'wanted' && p.status === 'available').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">In Negotiation</p>
                    <p className="text-xl text-orange-600">
                      {properties.filter(p => p.listingType === 'wanted' && p.status === 'negotiation').length}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="group-hover:bg-orange-50">
                  View →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rent Cycle Management Card */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer group"
            onClick={() => onNavigate('properties')}>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Rent Cycle Management</CardTitle>
                    <CardDescription>Lease Management & Tenant Relations</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Manage rental properties, tenant applications, lease agreements, rent collection, maintenance requests, and lease renewals. Access from property details.
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-gray-500">Active Leases</p>
                    <p className="text-xl text-blue-600">
                      {properties.filter(p => p.status === 'rented').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Available</p>
                    <p className="text-xl text-blue-600">
                      {properties.filter(p => p.saleType === 'rent' && p.status === 'available').length}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="group-hover:bg-blue-50">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Projects - Only show for Developers module or legacy (no module) */}
      {currentModule !== 'agency' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest development projects</CardDescription>
              </div>
              <Button variant="outline" onClick={() => onNavigate('projects')}>
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project: Project) => {
                const progress = project.timeline.phases.length > 0 
                  ? Math.round((project.timeline.phases.filter(p => p.status === 'completed').length / project.timeline.phases.length) * 100)
                  : 0;
                
                return (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FolderKanban className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.location.city}, {project.location.state}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FolderKanban className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="mb-2">No projects yet</p>
                  <Button size="sm" onClick={() => onNavigate('add-project')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>Your latest property listings</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onNavigate('inventory')}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{property.title}</h3>
                    <p className="text-sm text-gray-600">{formatPropertyAddress(property)}</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrencyShort(property.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNavigate('property-detail', property)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Re-listable Properties Widget */}
      <RelistablePropertiesWidget
        user={user}
        onViewProperty={(property) => onNavigate('property-detail', property)}
        onRelistProperty={(property) => {
          // Open property detail which will show relist option
          onNavigate('property-detail', property);
        }}
      />

      {/* Follow-up Tasks */}
      <FollowUpTasks
        user={user}
        onNavigateToLead={(leadId) => {
          const lead = leads.find(l => l.id === leadId);
          if (lead) {
            onNavigate('leads', lead);
          }
        }}
      />

      {/* Leads Pipeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leads Pipeline</CardTitle>
              <CardDescription>Manage your leads and track their progress</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads found matching your criteria
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                        <span>Source: {lead.source}</span>
                      </div>
                      {lead.notes && (
                        <p className="text-sm text-gray-500 mt-1">{lead.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-none ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="not-interested">Not Interested</option>
                      <option value="converted">Converted</option>
                    </select>
                    <span className="text-xs text-gray-500">{lead.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};