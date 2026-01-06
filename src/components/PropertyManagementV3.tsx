/**
 * Property Management V3 - Main Workspace
 * PHASE 4: Updated with new workspace components ✅
 * 
 * IMPROVEMENTS:
 * - New WorkspaceHeader with stats and actions
 * - WorkspaceSearchBar with filters and sort
 * - WorkspaceEmptyState for empty lists
 * - Consistent patterns with other workspaces
 */

import React, { useState, useEffect, useMemo } from "react";
import { User, Property, SellCycle, PurchaseCycle } from "../types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Plus,
  Building,
  Upload,
  Download,
  Edit,
  Eye,
  TrendingUp,
  Home,
} from "lucide-react";
import { getProperties } from "../lib/data";
import { getSellCyclesByProperty } from "../lib/sellCycle";
import { getPurchaseCyclesByProperty } from "../lib/purchaseCycle";
import { getRentCyclesByProperty } from "../lib/rentCycle";
import { PropertyCard } from "./PropertyCard";
import { PropertyDetailsV3 } from "./PropertyDetailsV3"; // Updated to use V3.1 with new Figma design
import { InternalMatchesWidget } from "./InternalMatchesWidget";
import { StartSellCycleModal } from "./StartSellCycleModal";
import { StartPurchaseCycleModal } from "./StartPurchaseCycleModal";
import { StartRentCycleModal } from "./StartRentCycleModal";
import { SellCycleDetails } from "./SellCycleDetails";
import { PurchaseCycleDetailsV4 } from "./PurchaseCycleDetailsV4";
import { getSellCycleById } from "../lib/sellCycle";
import { getPurchaseCycleById } from "../lib/purchaseCycle";
import { toast } from "sonner";

// PHASE 4: Import new workspace components ✅
import {
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
  EmptyStatePresets,
} from "./workspace";

interface PropertyManagementV3Props {
  user: User;
  onNavigate?: (page: string, data?: any) => void; // Added for V2 form navigation
}

export function PropertyManagementV3({
  user,
  onNavigate,
}: PropertyManagementV3Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal states for cycles
  const [showSellCycleModal, setShowSellCycleModal] = useState(false);
  const [showPurchaseCycleModal, setShowPurchaseCycleModal] = useState(false);
  const [showRentCycleModal, setShowRentCycleModal] = useState(false);
  
  // Cycle detail views
  const [viewingSellCycle, setViewingSellCycle] = useState<SellCycle | null>(null);
  const [viewingPurchaseCycle, setViewingPurchaseCycle] = useState<PurchaseCycle | null>(null);

  // Load properties
  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = () => {
    const allProperties = getProperties(user.id, user.role);
    setProperties(allProperties);
  };

  // Listen for property updates
  useEffect(() => {
    const handlePropertyUpdate = (event: any) => {
      const { propertyId } = event.detail || {};
      loadProperties();
      
      if (selectedProperty && propertyId === selectedProperty.id) {
        const allProperties = getProperties(user.id, user.role);
        const updatedProperty = allProperties.find(p => p.id === propertyId);
        if (updatedProperty) {
          setSelectedProperty(updatedProperty);
        }
      }
    };

    const handleStorageChange = () => {
      loadProperties();
    };

    window.addEventListener('propertyUpdated', handlePropertyUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('propertyUpdated', handlePropertyUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, selectedProperty]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus.length > 0) {
      result = result.filter((p) => selectedStatus.includes(p.status || 'available'));
    }

    // Type filter
    if (selectedType.length > 0) {
      result = result.filter((p) => selectedType.includes(p.propertyType));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
      case 'oldest':
        result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'title':
        result.sort((a, b) => (a.title || a.address || '').localeCompare(b.title || b.address || ''));
        break;
    }

    return result;
  }, [properties, searchQuery, selectedStatus, selectedType, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    return [
      {
        label: 'Total',
        value: properties.length,
        variant: 'default' as const,
      },
      {
        label: 'Available',
        value: properties.filter((p) => p.status === 'available').length,
        variant: 'success' as const,
      },
      {
        label: 'Under Contract',
        value: properties.filter((p) => p.status === 'under-contract').length,
        variant: 'warning' as const,
      },
      {
        label: 'Sold',
        value: properties.filter((p) => p.status === 'sold').length,
        variant: 'info' as const,
      },
    ];
  }, [properties]);

  // Handlers
  const handleBackToList = () => {
    setSelectedProperty(null);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleFormSubmit = () => {
    loadProperties();
    if (onNavigate) {
      onNavigate('properties'); // Navigate back to properties list
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus([]);
    setSelectedType([]);
    setSortBy('newest');
  };

  const handleImport = () => {
    toast.info('Import feature coming soon');
  };

  const handleExport = () => {
    toast.info('Export feature coming soon');
  };

  const handleBulkEdit = () => {
    toast.info('Bulk edit feature coming soon');
  };

  // Active filter count
  const activeFilterCount = selectedStatus.length + selectedType.length;

  // Render modals - Always render these regardless of view state
  const renderModals = () => {
    console.log('🟢 renderModals() called');
    console.log('🟢 showSellCycleModal:', showSellCycleModal);
    console.log('🟢 selectedProperty:', selectedProperty?.title);
    console.log('🟢 Should render StartSellCycleModal:', showSellCycleModal && selectedProperty);
    
    return (
    <>
      {/* Sell Cycle Modal */}
      {showSellCycleModal && selectedProperty && (
        <StartSellCycleModal
          isOpen={showSellCycleModal}
          property={selectedProperty}
          user={user}
          onClose={() => setShowSellCycleModal(false)}
          onSuccess={(cycle) => {
            setShowSellCycleModal(false);
            loadProperties();
            toast.success('Sell cycle started successfully');
          }}
        />
      )}

      {/* Purchase Cycle Modal */}
      {showPurchaseCycleModal && selectedProperty && (
        <StartPurchaseCycleModal
          isOpen={showPurchaseCycleModal}
          property={selectedProperty}
          user={user}
          onClose={() => setShowPurchaseCycleModal(false)}
          onSuccess={() => {
            setShowPurchaseCycleModal(false);
            loadProperties();
            toast.success('Purchase cycle started successfully');
          }}
        />
      )}

      {/* Rent Cycle Modal */}
      {showRentCycleModal && selectedProperty && (
        <StartRentCycleModal
          isOpen={showRentCycleModal}
          property={selectedProperty}
          user={user}
          onClose={() => setShowRentCycleModal(false)}
          onSuccess={() => {
            setShowRentCycleModal(false);
            loadProperties();
            toast.success('Rent cycle started successfully');
          }}
        />
      )}
    </>
  );
  };

  // If viewing a cycle, show its details
  if (viewingSellCycle) {
    return (
      <>
        <SellCycleDetails
          cycle={viewingSellCycle}
          property={properties.find(p => p.id === viewingSellCycle.propertyId) || null}
          user={user}
          onBack={() => setViewingSellCycle(null)}
          onUpdate={() => {
            loadProperties();
            const updatedCycle = getSellCycleById(viewingSellCycle.id);
            if (updatedCycle) setViewingSellCycle(updatedCycle);
          }}
        />
        {renderModals()}
      </>
    );
  }

  if (viewingPurchaseCycle) {
    return (
      <>
        <PurchaseCycleDetailsV4
          cycle={viewingPurchaseCycle}
          property={properties.find(p => p.id === viewingPurchaseCycle.propertyId) || null}
          user={user}
          onBack={() => setViewingPurchaseCycle(null)}
          onUpdate={() => {
            loadProperties();
            const updatedCycle = getPurchaseCycleById(viewingPurchaseCycle.id);
            if (updatedCycle) setViewingPurchaseCycle(updatedCycle);
          }}
        />
        {renderModals()}
      </>
    );
  }

  // If property is selected, show details
  if (selectedProperty) {
    return (
      <>
        <PropertyDetailsV3
          property={selectedProperty}
          sellCycles={getSellCyclesByProperty(selectedProperty.id)}
          purchaseCycles={getPurchaseCyclesByProperty(selectedProperty.id)}
          rentCycles={getRentCyclesByProperty(selectedProperty.id)}
          user={user}
          onBack={handleBackToList}
          onEdit={() => {
            if (onNavigate) {
              onNavigate('edit-property', { id: selectedProperty.id });
            }
          }}
          onStartSellCycle={() => {
            console.log('🔵 onStartSellCycle called, setting modal state to true');
            console.log('🔵 Current selectedProperty:', selectedProperty?.title);
            console.log('🔵 Current showSellCycleModal state:', showSellCycleModal);
            setShowSellCycleModal(true);
            console.log('🔵 setShowSellCycleModal(true) called');
          }}
          onStartPurchaseCycle={() => {
            setShowPurchaseCycleModal(true);
          }}
          onStartRentCycle={() => {
            setShowRentCycleModal(true);
          }}
          onViewCycle={(cycleId, type) => {
            if (type === 'sell') {
              const cycle = getSellCycleById(cycleId);
              if (cycle) {
                setViewingSellCycle(cycle);
              } else {
                toast.error('Sell cycle not found');
              }
            } else if (type === 'purchase') {
              const cycle = getPurchaseCycleById(cycleId);
              if (cycle) setViewingPurchaseCycle(cycle);
            } else if (type === 'rent') {
              toast.info('Rent cycle details coming soon!');
            }
          }}
        />
        {renderModals()}
      </>
    );
  }

  // Main workspace view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 4: New WorkspaceHeader ✅ */}
      <WorkspaceHeader
        title="Properties"
        description="Manage your property portfolio with cycles"
        stats={stats}
        primaryAction={{
          label: 'Add Property',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            if (onNavigate) {
              onNavigate('add-property');
            }
          },
        }}
        secondaryActions={[
          {
            label: 'Import Properties',
            icon: <Upload className="w-4 h-4" />,
            onClick: handleImport,
          },
          {
            label: 'Export to CSV',
            icon: <Download className="w-4 h-4" />,
            onClick: handleExport,
          },
          {
            label: 'Bulk Edit',
            icon: <Edit className="w-4 h-4" />,
            onClick: handleBulkEdit,
          },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableViews={['table', 'grid']}
      />

      {/* PHASE 4: New WorkspaceSearchBar ✅ */}
      <WorkspaceSearchBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search properties by title, address, or owner..."
        quickFilters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              {
                value: 'available',
                label: 'Available',
                count: properties.filter((p) => p.status === 'available').length,
              },
              {
                value: 'negotiation',
                label: 'In Negotiation',
                count: properties.filter((p) => p.status === 'negotiation').length,
              },
              {
                value: 'under-contract',
                label: 'Under Contract',
                count: properties.filter((p) => p.status === 'under-contract').length,
              },
              {
                value: 'sold',
                label: 'Sold',
                count: properties.filter((p) => p.status === 'sold').length,
              },
            ],
            value: selectedStatus,
            onChange: setSelectedStatus,
            multiple: true,
          },
          {
            id: 'type',
            label: 'Property Type',
            options: [
              {
                value: 'house',
                label: 'House',
                count: properties.filter((p) => p.propertyType === 'house').length,
              },
              {
                value: 'apartment',
                label: 'Apartment',
                count: properties.filter((p) => p.propertyType === 'apartment').length,
              },
              {
                value: 'commercial',
                label: 'Commercial',
                count: properties.filter((p) => p.propertyType === 'commercial').length,
              },
              {
                value: 'plot',
                label: 'Plot',
                count: properties.filter((p) => p.propertyType === 'plot').length,
              },
            ],
            value: selectedType,
            onChange: setSelectedType,
            multiple: true,
          },
        ]}
        sortOptions={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price-high', label: 'Price: High to Low' },
          { value: 'price-low', label: 'Price: Low to High' },
          { value: 'title', label: 'Title (A-Z)' },
        ]}
        sortValue={sortBy}
        onSortChange={setSortBy}
        onClearAll={handleClearFilters}
      />

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {/* Internal Matches Widget */}
        <InternalMatchesWidget
          user={user}
          onViewMatch={(match) => {
            // Navigate to the property detail when viewing a match
            if (match.propertyId) {
              const property = properties.find(p => p.id === match.propertyId);
              if (property) {
                handlePropertyClick(property);
              }
            }
          }}
          onViewProperty={(propertyId) => {
            const property = properties.find(p => p.id === propertyId);
            if (property) {
              handlePropertyClick(property);
            }
          }}
        />

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          // PHASE 4: New WorkspaceEmptyState ✅
          properties.length === 0 ? (
            <WorkspaceEmptyState
              {...EmptyStatePresets.properties(
                () => {
                  if (onNavigate) {
                    onNavigate('add-property');
                  }
                },
                handleImport
              )}
            />
          ) : (
            <WorkspaceEmptyState
              {...EmptyStatePresets.noResults(handleClearFilters)}
            />
          )
        ) : viewMode === 'table' ? (
          // Table View
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Cycles
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {filteredProperties.map((property) => {
                      const sellCyclesCount = property.activeSellCycleIds?.length || 0;
                      const purchaseCyclesCount = property.activePurchaseCycleIds?.length || 0;
                      const rentCyclesCount = property.activeRentCycleIds?.length || 0;
                      const totalCycles = sellCyclesCount + purchaseCyclesCount + rentCyclesCount;

                      return (
                        <tr
                          key={property.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handlePropertyClick(property)}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{property.title || property.address}</p>
                              <p className="text-sm text-gray-600">{property.address}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                property.status === 'available'
                                  ? 'default'
                                  : property.status === 'sold'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="capitalize"
                            >
                              {property.status || 'available'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 capitalize">{property.propertyType}</td>
                          <td className="px-6 py-4">PKR {(property.price || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            {property.area} {property.propertyType === 'house' ? 'sq yd' : 'sq ft'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              {totalCycles}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePropertyClick(property);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const sellCyclesCount = property.activeSellCycleIds?.length || 0;
              const purchaseCyclesCount = property.activePurchaseCycleIds?.length || 0;
              const rentCyclesCount = property.activeRentCycleIds?.length || 0;

              return (
                <PropertyCard
                  key={property.id}
                  property={property}
                  sellCyclesCount={sellCyclesCount}
                  purchaseCyclesCount={purchaseCyclesCount}
                  rentCyclesCount={rentCyclesCount}
                  onClick={() => handlePropertyClick(property)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {renderModals()}
    </div>
  );
}