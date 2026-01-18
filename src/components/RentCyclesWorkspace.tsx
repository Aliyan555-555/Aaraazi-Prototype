/**
 * Rent Cycles Workspace - V3.0
 * PHASE 4: Updated with new workspace components ✅
 */

import React, { useState, useEffect, useMemo } from 'react';
import { RentCycle, Property, User } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Home,
  Download,
  Upload,
  Eye,
  DollarSign,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { getRentCycles, getRentCycleStats } from '../lib/rentCycle';
import { getProperties } from '../lib/data';
import { formatPKR } from '../lib/currency';

// PHASE 4: Import new workspace components ✅
import {
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
  EmptyStatePresets,
} from './workspace';

interface RentCyclesWorkspaceProps {
  user: User;
  onViewDetails?: (cycle: RentCycle) => void;
  onStartNew?: () => void;
}

export function RentCyclesWorkspace({
  user,
  onViewDetails,
  onStartNew,
}: RentCyclesWorkspaceProps) {
  const [cycles, setCycles] = useState<RentCycle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Load data
  useEffect(() => {
    const allCycles = getRentCycles(user.id, user.role);
    const allProperties = getProperties(user.id, user.role);
    
    setCycles(allCycles);
    setProperties(allProperties);
  }, [user.id, user.role]);

  // Helper to get property
  const getProperty = (propertyId: string): Property | null => {
    return properties.find(p => p.id === propertyId) || null;
  };

  // Filtered and sorted cycles
  const filteredCycles = useMemo(() => {
    let result = [...cycles];

    // Search filter
    if (searchQuery) {
      result = result.filter(c => {
        const property = getProperty(c.propertyId);
        return (
          c.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Status filter
    if (selectedStatus.length > 0) {
      result = result.filter(c => selectedStatus.includes(c.status));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case 'rent-high':
        result.sort((a, b) => (b.monthlyRent || 0) - (a.monthlyRent || 0));
        break;
      case 'rent-low':
        result.sort((a, b) => (a.monthlyRent || 0) - (b.monthlyRent || 0));
        break;
    }

    return result;
  }, [cycles, searchQuery, selectedStatus, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    const cycleStats = getRentCycleStats(user.id, user.role);
    
    return [
      {
        label: 'Total',
        value: cycleStats.total,
        variant: 'default' as const,
      },
      {
        label: 'Listed',
        value: cycleStats.listed,
        variant: 'success' as const,
      },
      {
        label: 'Viewing Scheduled',
        value: cycleStats.viewingScheduled,
        variant: 'warning' as const,
      },
      {
        label: 'Active',
        value: cycleStats.active,
        variant: 'info' as const,
      },
    ];
  }, [cycles, user.id, user.role]);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'listed': 'default',
      'viewing-scheduled': 'secondary',
      'application-received': 'secondary',
      'active': 'outline',
      'expired': 'outline',
      'terminated': 'outline',
    };
    return variants[status] || 'default';
  };

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus([]);
    setSortBy('newest');
  };

  const handleExport = () => {
    console.log('Export rent cycles');
  };

  const handleImport = () => {
    console.log('Import rent cycles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 4: New WorkspaceHeader ✅ */}
      <WorkspaceHeader
        title="Rent Cycles"
        description="Track and manage property rentals"
        stats={stats}
        primaryAction={onStartNew ? {
          label: 'Start Rent Cycle',
          icon: <Home className="w-4 h-4" />,
          onClick: onStartNew,
        } : undefined}
        secondaryActions={[
          {
            label: 'Export to CSV',
            icon: <Download className="w-4 h-4" />,
            onClick: handleExport,
          },
          {
            label: 'Import Cycles',
            icon: <Upload className="w-4 h-4" />,
            onClick: handleImport,
          },
        ]}
      />

      {/* PHASE 4: New WorkspaceSearchBar ✅ */}
      <WorkspaceSearchBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by tenant name or property..."
        quickFilters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              {
                value: 'listed',
                label: 'Listed',
                count: cycles.filter(c => c.status === 'listed').length,
              },
              {
                value: 'viewing-scheduled',
                label: 'Viewing Scheduled',
                count: cycles.filter(c => c.status === 'viewing-scheduled').length,
              },
              {
                value: 'application-received',
                label: 'Application Received',
                count: cycles.filter(c => c.status === 'application-received').length,
              },
              {
                value: 'active',
                label: 'Active',
                count: cycles.filter(c => c.status === 'active').length,
              },
              {
                value: 'expired',
                label: 'Expired',
                count: cycles.filter(c => c.status === 'expired').length,
              },
              {
                value: 'terminated',
                label: 'Terminated',
                count: cycles.filter(c => c.status === 'terminated').length,
              },
            ],
            value: selectedStatus,
            onChange: setSelectedStatus,
            multiple: true,
          },
        ]}
        sortOptions={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'rent-high', label: 'Rent: High to Low' },
          { value: 'rent-low', label: 'Rent: Low to High' },
        ]}
        sortValue={sortBy}
        onSortChange={setSortBy}
        onClearAll={handleClearFilters}
      />

      {/* Content Area */}
      <div className="p-6">
        {filteredCycles.length === 0 ? (
          // PHASE 4: New WorkspaceEmptyState ✅
          cycles.length === 0 ? (
            <WorkspaceEmptyState
              icon={<Home className="w-16 h-16 text-gray-400" />}
              title="No rent cycles yet"
              description="Create rent cycles to track property rentals and manage tenants"
              primaryAction={onStartNew ? {
                label: 'Start Rent Cycle',
                icon: <Home className="w-4 h-4" />,
                onClick: onStartNew,
              } : undefined}
            />
          ) : (
            <WorkspaceEmptyState
              {...EmptyStatePresets.noResults(handleClearFilters)}
            />
          )
        ) : (
          // Rent Cycles List
          <div className="space-y-4">
            {filteredCycles.map(cycle => {
              const property = getProperty(cycle.propertyId);
              
              return (
                <Card
                  key={cycle.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewDetails && onViewDetails(cycle)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Left: Property & Tenant Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Home className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {property?.title || property?.address || 'Unknown Property'}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {property?.address || 'No address'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-600">Tenant</p>
                            <p className="text-sm flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {cycle.tenantName || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Start Date</p>
                            <p className="text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {cycle.startDate ? new Date(cycle.startDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Lease Term</p>
                            <p className="text-sm">{cycle.leaseTerm || 'N/A'} months</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Rent & Status */}
                      <div className="text-right">
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Monthly Rent</p>
                          <p className="text-xl font-medium flex items-center justify-end gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatPKR(cycle.monthlyRent || 0)}
                          </p>
                        </div>
                        <Badge variant={getStatusBadge(cycle.status)} className="capitalize">
                          {cycle.status.replace(/-/g, ' ')}
                        </Badge>
                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails && onViewDetails(cycle);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
