/**
 * Purchase Cycles Workspace - V3.0
 * PHASE 4: Updated with new workspace components ✅
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PurchaseCycle, Property, User } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ShoppingCart,
  Download,
  Upload,
  Eye,
  DollarSign,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getPurchaseCycles, getPurchaseCycleStats } from '../lib/purchaseCycle';
import { getProperties } from '../lib/data';
import { formatPKR } from '../lib/currency';

// PHASE 4: Import new workspace components ✅
import {
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
  EmptyStatePresets,
} from './workspace';

interface PurchaseCyclesWorkspaceProps {
  user: User;
  onViewDetails?: (cycle: PurchaseCycle) => void;
  onStartNew?: () => void;
}

export function PurchaseCyclesWorkspace({
  user,
  onViewDetails,
  onStartNew,
}: PurchaseCyclesWorkspaceProps) {
  const [cycles, setCycles] = useState<PurchaseCycle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Load data
  useEffect(() => {
    const allCycles = getPurchaseCycles(user.id, user.role);
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
          c.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      case 'price-high':
        result.sort((a, b) => (b.offerAmount || 0) - (a.offerAmount || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.offerAmount || 0) - (b.offerAmount || 0));
        break;
    }

    return result;
  }, [cycles, searchQuery, selectedStatus, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    const cycleStats = getPurchaseCycleStats(user.id, user.role);
    
    return [
      {
        label: 'Total',
        value: cycleStats.total,
        variant: 'default' as const,
      },
      {
        label: 'Searching',
        value: cycleStats.searching,
        variant: 'success' as const,
      },
      {
        label: 'Offer Made',
        value: cycleStats.offerMade,
        variant: 'warning' as const,
      },
      {
        label: 'Under DD',
        value: cycleStats.dueDiligence,
        variant: 'warning' as const,
      },
      {
        label: 'Completed',
        value: cycleStats.completed,
        variant: 'info' as const,
      },
    ];
  }, [cycles, user.id, user.role]);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'searching': 'default',
      'offer-made': 'secondary',
      'due-diligence': 'secondary',
      'financing': 'secondary',
      'closing': 'secondary',
      'completed': 'outline',
      'cancelled': 'outline',
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
    console.log('Export purchase cycles');
  };

  const handleImport = () => {
    console.log('Import purchase cycles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 4: New WorkspaceHeader ✅ */}
      <WorkspaceHeader
        title="Purchase Cycles"
        description="Track and manage property acquisitions"
        stats={stats}
        primaryAction={onStartNew ? {
          label: 'Start Purchase Cycle',
          icon: <ShoppingCart className="w-4 h-4" />,
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
        placeholder="Search by seller name or property..."
        quickFilters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              {
                value: 'searching',
                label: 'Searching',
                count: cycles.filter(c => c.status === 'searching').length,
              },
              {
                value: 'offer-made',
                label: 'Offer Made',
                count: cycles.filter(c => c.status === 'offer-made').length,
              },
              {
                value: 'due-diligence',
                label: 'Due Diligence',
                count: cycles.filter(c => c.status === 'due-diligence').length,
              },
              {
                value: 'financing',
                label: 'Financing',
                count: cycles.filter(c => c.status === 'financing').length,
              },
              {
                value: 'closing',
                label: 'Closing',
                count: cycles.filter(c => c.status === 'closing').length,
              },
              {
                value: 'completed',
                label: 'Completed',
                count: cycles.filter(c => c.status === 'completed').length,
              },
              {
                value: 'cancelled',
                label: 'Cancelled',
                count: cycles.filter(c => c.status === 'cancelled').length,
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
          { value: 'price-high', label: 'Offer: High to Low' },
          { value: 'price-low', label: 'Offer: Low to High' },
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
              {...EmptyStatePresets.purchaseCycles(onStartNew || (() => {}))}
            />
          ) : (
            <WorkspaceEmptyState
              {...EmptyStatePresets.noResults(handleClearFilters)}
            />
          )
        ) : (
          // Purchase Cycles List
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
                      {/* Left: Property & Seller Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
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
                            <p className="text-xs text-gray-600">Seller</p>
                            <p className="text-sm">{cycle.sellerName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Started Date</p>
                            <p className="text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {cycle.createdAt ? new Date(cycle.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Purchaser Type</p>
                            <p className="text-sm capitalize">{cycle.purchaserType || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Status */}
                      <div className="text-right">
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Offer Amount</p>
                          <p className="text-xl font-medium flex items-center justify-end gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatPKR(cycle.offerAmount || 0)}
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
