/**
 * Example Workspace Page - Complete Implementation
 * 
 * Demonstrates how to use all workspace components together
 * to create a consistent workspace/listing page experience.
 * 
 * This example shows:
 * - WorkspaceHeader with stats and actions
 * - WorkspaceSearchBar with filters and sort
 * - WorkspaceEmptyState for empty lists
 * - Table/Grid view switching
 * - Filter sidebar toggle
 */

import React, { useState, useMemo } from 'react';
import {
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
  EmptyStatePresets,
} from './index';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Plus,
  Upload,
  Download,
  FileText,
  Home,
  TrendingUp,
  Eye,
  Edit,
} from 'lucide-react';

// Mock data type
interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  status: 'available' | 'negotiation' | 'sold';
  type: 'house' | 'apartment' | 'commercial';
  agent: string;
  views: number;
  createdAt: string;
}

export const ExampleWorkspace: React.FC = () => {
  // Mock data
  const [properties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern Villa',
      address: 'DHA Phase 8, Karachi',
      price: 25000000,
      status: 'available',
      type: 'house',
      agent: 'John Doe',
      views: 45,
      createdAt: '2024-12-20',
    },
    {
      id: '2',
      title: 'Luxury Apartment',
      address: 'Clifton, Karachi',
      price: 15000000,
      status: 'negotiation',
      type: 'apartment',
      agent: 'Jane Smith',
      views: 67,
      createdAt: '2024-12-18',
    },
  ]);

  // State
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Filtered and sorted data
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      result = result.filter((p) => selectedStatus.includes(p.status));
    }

    // Apply type filter
    if (selectedType.length > 0) {
      result = result.filter((p) => selectedType.includes(p.type));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [properties, searchTerm, selectedStatus, selectedType, sortBy]);

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
        label: 'In Negotiation',
        value: properties.filter((p) => p.status === 'negotiation').length,
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
  const handleAddProperty = () => {
    console.log('Add property clicked');
  };

  const handleImport = () => {
    console.log('Import clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleBulkEdit = () => {
    console.log('Bulk edit clicked');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus([]);
    setSelectedType([]);
    setSortBy('newest');
  };

  // Calculate active filter count
  const activeFilterCount =
    selectedStatus.length + selectedType.length + (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Workspace Header */}
      <WorkspaceHeader
        title="Properties"
        description="Manage your property portfolio"
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => console.log('Navigate to dashboard') },
          { label: 'Properties' },
        ]}
        stats={stats}
        primaryAction={{
          label: 'Add Property',
          icon: <Plus className="w-4 h-4" />,
          onClick: handleAddProperty,
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
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterCount={activeFilterCount}
      />

      {/* Search and Filter Bar */}
      <WorkspaceSearchBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search properties by title or address..."
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
                count: properties.filter((p) => p.type === 'house').length,
              },
              {
                value: 'apartment',
                label: 'Apartment',
                count: properties.filter((p) => p.type === 'apartment').length,
              },
              {
                value: 'commercial',
                label: 'Commercial',
                count: properties.filter((p) => p.type === 'commercial').length,
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
          { value: 'views', label: 'Most Viewed' },
        ]}
        sortValue={sortBy}
        onSortChange={setSortBy}
        onClearAll={handleClearFilters}
      />

      {/* Content Area */}
      <div className="p-6">
        {filteredProperties.length === 0 ? (
          // Empty State
          properties.length === 0 ? (
            // No properties at all
            <WorkspaceEmptyState
              {...EmptyStatePresets.properties(handleAddProperty, handleImport)}
            />
          ) : (
            // No results from filters
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
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-gray-600">{property.address}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              property.status === 'available'
                                ? 'default'
                                : property.status === 'negotiation'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="capitalize"
                          >
                            {property.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 capitalize">{property.type}</td>
                        <td className="px-6 py-4">PKR {property.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            {property.views}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant={
                        property.status === 'available'
                          ? 'default'
                          : property.status === 'negotiation'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {property.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {property.views}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{property.address}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium">PKR {property.price.toLocaleString()}</p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleWorkspace;
