/**
 * Sell Cycles Workspace - V3.0
 * PHASE 4: Updated with new workspace components ✅
 * 
 * IMPROVEMENTS:
 * - New WorkspaceHeader with stats and actions
 * - WorkspaceSearchBar with filters and sort
 * - WorkspaceEmptyState for empty lists
 * - Consistent patterns with other workspaces
 */

import { useState, useEffect, useMemo } from 'react';
import { SellCycle, Property, User } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  TrendingUp,
  Download,
  Upload,
  Eye,
  DollarSign,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getSellCycles, getSellCycleStats } from '../lib/sellCycle';
import { getProperties } from '../lib/data';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';

// PHASE 4: Import new workspace components ✅
import {
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
  EmptyStatePresets,
} from './workspace';

interface SellCyclesWorkspaceProps {
  user: User;
  onViewDetails?: (cycle: SellCycle) => void;
  onStartNew?: () => void;
}

export function SellCyclesWorkspace({
  user,
  onViewDetails,
  onStartNew,
}: SellCyclesWorkspaceProps) {
  const [cycles, setCycles] = useState<SellCycle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Load data
  useEffect(() => {
    const allCycles = getSellCycles(user.id, user.role);
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
          c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        result.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime());
        break;
      case 'price-high':
        result.sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case 'price-low':
        result.sort((a, b) => a.askingPrice - b.askingPrice);
        break;
    }

    return result;
  }, [cycles, searchQuery, selectedStatus, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    const cycleStats = getSellCycleStats(user.id, user.role);

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
        label: 'In Negotiation',
        value: cycleStats.negotiation,
        variant: 'warning' as const,
      },
      {
        label: 'Under Contract',
        value: cycleStats.underContract,
        variant: 'info' as const,
      },
      {
        label: 'Sold',
        value: cycleStats.sold,
        variant: 'info' as const,
      },
    ];
  }, [cycles, user.id, user.role]);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'listed': 'default',
      'offer-received': 'secondary',
      'negotiation': 'secondary',
      'under-contract': 'secondary',
      'sold': 'outline',
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
    console.log('Export sell cycles');
  };

  const handleImport = () => {
    console.log('Import sell cycles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 4: New WorkspaceHeader ✅ */}
      <WorkspaceHeader
        title="Sell Cycles"
        description="Track and manage property sales"
        stats={stats}
        primaryAction={onStartNew ? {
          label: 'Start Sell Cycle',
          icon: <TrendingUp className="w-4 h-4" />,
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
                value: 'listed',
                label: 'Listed',
                count: cycles.filter(c => c.status === 'listed').length,
              },
              {
                value: 'offer-received',
                label: 'Offer Received',
                count: cycles.filter(c => c.status === 'offer-received').length,
              },
              {
                value: 'negotiation',
                label: 'Negotiation',
                count: cycles.filter(c => c.status === 'negotiation').length,
              },
              {
                value: 'under-contract',
                label: 'Under Contract',
                count: cycles.filter(c => c.status === 'under-contract').length,
              },
              {
                value: 'sold',
                label: 'Sold',
                count: cycles.filter(c => c.status === 'sold').length,
              },
              {
                value: 'cancelled',
                label: 'Cancelled',
                count: cycles.filter(c => c.status === 'cancelled').length,
              },
            ],
            value: selectedStatus,
            onChange: (val) => setSelectedStatus(val as string[]),
            multiple: true,
          },
        ]}
        sortOptions={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price-high', label: 'Price: High to Low' },
          { value: 'price-low', label: 'Price: Low to High' },
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
              {...EmptyStatePresets.sellCycles(onStartNew || (() => { }))}
            />
          ) : (
            <WorkspaceEmptyState
              {...EmptyStatePresets.noResults(handleClearFilters)}
            />
          )
        ) : (
          // Sell Cycles List
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
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {property?.title || property?.address || 'Unknown Property'}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {formatPropertyAddress(property?.address)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-600">Seller</p>
                            <p className="text-sm">{cycle.sellerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Listed Date</p>
                            <p className="text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(cycle.listedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Offers</p>
                            <p className="text-sm">{cycle.offers?.length || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Status */}
                      <div className="text-right">
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Asking Price</p>
                          <p className="text-xl font-medium flex items-center justify-end gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatPKR(cycle.askingPrice)}
                          </p>
                        </div>
                        <Badge variant={getStatusBadge(cycle.status)} className="capitalize">
                          {cycle.status.replace(/-/g, ' ')}
                        </Badge>
                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
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
