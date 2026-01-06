/**
 * DashboardTemplateExample - Example implementation using DashboardTemplate
 * 
 * This example shows how to migrate an existing agency dashboard to use
 * the new DashboardTemplate from Design System V4.1
 * 
 * BEFORE (Old Pattern):
 * - Custom header with manual styling
 * - Metric cards built from scratch
 * - Tab navigation implemented manually
 * - Inconsistent spacing and layout
 * 
 * AFTER (DashboardTemplate):
 * - Standardized header with built-in actions
 * - MetricCard components (reusable)
 * - Tab system included
 * - Consistent 8px grid spacing
 * - UX Laws applied (max 5 metrics, 3 actions)
 * 
 * TIME TO BUILD: 15-30 minutes (vs 4-8 hours custom)
 */

import React, { useState, useMemo } from 'react';
import { DashboardTemplate, DashboardCard, DashboardGrid } from './DashboardTemplate';
import { User, Property, Lead } from '../../types';
import { getProperties, getLeads } from '../../lib/data';
import { formatPKR } from '../../lib/currency';
import {
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  Target,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AgencyDashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
  onBack?: () => void;
}

export const AgencyDashboardExample: React.FC<AgencyDashboardProps> = ({
  user,
  onNavigate,
  onBack,
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ============================================================================
  // Data Loading
  // ============================================================================

  const properties = useMemo(() => 
    getProperties(user.id, user.role), 
    [user.id, user.role]
  );

  const leads = useMemo(() => 
    getLeads(user.id, user.role), 
    [user.id, user.role]
  );

  // ============================================================================
  // Calculations
  // ============================================================================

  const metrics = useMemo(() => {
    const totalProperties = properties.length;
    const availableProperties = properties.filter(p => p.status === 'available').length;
    const soldProperties = properties.filter(p => p.status === 'sold').length;
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const activeLeads = leads.filter(l => l.status !== 'closed' && l.status !== 'lost').length;

    return [
      {
        label: 'Total Properties',
        value: totalProperties.toString(),
        icon: <Home className="h-5 w-5" />,
        trend: 12, // +12% from last period
        variant: 'default' as const,
      },
      {
        label: 'Available',
        value: availableProperties.toString(),
        icon: <Target className="h-5 w-5" />,
        trend: 5,
        variant: 'success' as const,
      },
      {
        label: 'Total Value',
        value: formatPKR(totalValue),
        icon: <DollarSign className="h-5 w-5" />,
        trend: 18,
        variant: 'default' as const,
      },
      {
        label: 'Active Leads',
        value: activeLeads.toString(),
        icon: <Users className="h-5 w-5" />,
        trend: -3,
        variant: 'warning' as const,
      },
      {
        label: 'Sold This Month',
        value: soldProperties.toString(),
        icon: <TrendingUp className="h-5 w-5" />,
        trend: 25,
        variant: 'success' as const,
      },
    ];
  }, [properties, leads]);

  // ============================================================================
  // Actions
  // ============================================================================

  const handleExportReport = () => {
    console.log('Exporting report...');
    // Implementation
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Reload data
  };

  const handleViewAnalytics = () => {
    onNavigate('analytics');
  };

  // ============================================================================
  // Tab Content
  // ============================================================================

  const OverviewContent = () => (
    <div className="p-6 space-y-6">
      <DashboardGrid columns={2}>
        {/* Properties Chart */}
        <DashboardCard
          title="Properties Overview"
          description="Distribution of properties by status"
          action={
            <Button variant="ghost" size="sm">
              View All
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Available</span>
              <Badge variant="default">{properties.filter(p => p.status === 'available').length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Under Contract</span>
              <Badge variant="secondary">{properties.filter(p => p.status === 'under_contract').length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sold</span>
              <Badge variant="outline">{properties.filter(p => p.status === 'sold').length}</Badge>
            </div>
          </div>
        </DashboardCard>

        {/* Leads Chart */}
        <DashboardCard
          title="Leads Pipeline"
          description="Active leads by stage"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate('leads')}>
              View All
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">New</span>
              <Badge>{leads.filter(l => l.status === 'new').length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contacted</span>
              <Badge>{leads.filter(l => l.status === 'contacted').length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Qualified</span>
              <Badge>{leads.filter(l => l.status === 'qualified').length}</Badge>
            </div>
          </div>
        </DashboardCard>
      </DashboardGrid>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onNavigate('property-detail', property)}
              >
                <div>
                  <p className="font-medium">{property.title}</p>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPKR(property.price)}</p>
                  <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PropertiesContent = () => (
    <div className="p-6">
      <DashboardCard title="Properties" description="All properties in your portfolio">
        <div className="space-y-2">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 cursor-pointer"
              onClick={() => onNavigate('property-detail', property)}
            >
              <span>{property.title}</span>
              <span>{formatPKR(property.price)}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );

  const LeadsContent = () => (
    <div className="p-6">
      <DashboardCard title="Active Leads" description="Leads in your pipeline">
        <div className="space-y-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 cursor-pointer"
            >
              <span>{lead.name}</span>
              <Badge>{lead.status}</Badge>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );

  // ============================================================================
  // Filters
  // ============================================================================

  const filters = (
    <div className="flex items-center gap-2">
      <Button
        variant={timeRange === '7days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('7days')}
      >
        7 Days
      </Button>
      <Button
        variant={timeRange === '30days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('30days')}
      >
        30 Days
      </Button>
      <Button
        variant={timeRange === '90days' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('90days')}
      >
        90 Days
      </Button>
    </div>
  );

  // ============================================================================
  // Render with DashboardTemplate
  // ============================================================================

  return (
    <DashboardTemplate
      title="Agency Dashboard"
      description={`Welcome back, ${user.name}! Here's your agency overview.`}
      onBack={onBack}
      
      // Metrics (max 5 per Miller's Law)
      metrics={metrics}
      
      // Actions (max 3 primary per Hick's Law)
      primaryAction={{
        label: 'Export Report',
        icon: <Download className="h-4 w-4" />,
        onClick: handleExportReport,
      }}
      secondaryActions={[
        {
          label: 'Refresh Data',
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: handleRefresh,
        },
        {
          label: 'View Analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          onClick: handleViewAnalytics,
        },
      ]}
      
      // Filters
      filters={filters}
      
      // Tabs
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <BarChart3 className="h-4 w-4" />,
          content: <OverviewContent />,
        },
        {
          id: 'properties',
          label: 'Properties',
          icon: <Home className="h-4 w-4" />,
          content: <PropertiesContent />,
          badge: properties.length,
        },
        {
          id: 'leads',
          label: 'Leads',
          icon: <Users className="h-4 w-4" />,
          content: <LeadsContent />,
          badge: leads.length,
        },
      ]}
      defaultTab="overview"
      
      // Real-time updates
      refreshInterval={30000} // 30 seconds
      onRefresh={handleRefresh}
      lastUpdated={lastUpdated}
    />
  );
};

export default AgencyDashboardExample;
