/**
 * PropertiesWorkspaceV4 Component
 * WORKSPACE V4: Built with WorkspacePageTemplate ✅
 * 
 * PURPOSE:
 * Complete properties workspace using the template system.
 * Demonstrates 60%+ code reduction and consistent UX.
 * 
 * FEATURES:
 * - Grid view (primary) and Table view (secondary)
 * - Search and filtering
 * - Sorting options
 * - Bulk actions (export, delete, assign, change status)
 * - Quick actions (view, edit, share, delete)
 * - Pagination
 * - Empty states
 * - Loading states
 */

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Download, 
  Trash2, 
  UserPlus, 
  Edit3,
  Home,
  MapPin,
  Ruler,
  DollarSign,
  Zap,
  // ... existing code ... 
} from 'lucide-react';
import { User, Property } from '../../types';
import { WorkspacePageTemplate } from '../workspace/WorkspacePageTemplate';
import { PropertyWorkspaceCard } from './PropertyWorkspaceCard';
import { StatusBadge } from '../layout/StatusBadge'; // PHASE 5: Add StatusBadge import
import { getProperties, deleteProperty, updateProperty, getAllAgents, addProperty, getContacts } from '../../lib/data';
import { formatPropertyAddress } from '../../lib/utils';
import { exportPropertiesToCSV } from '../../lib/exportUtils';
import {
  Column,
  EmptyStatePresets,
} from '../workspace';
import BulkAssignAgentModal from '../BulkAssignAgentModal';
import BulkEditPropertiesModal from '../BulkEditPropertiesModal';
import { toast } from 'sonner';

export interface PropertiesWorkspaceV4Props {
  user: User;
  onNavigate: (section: string, id?: string) => void;
  onAddProperty?: () => void;
  onEditProperty?: (property: Property) => void;
}

/**
 * PropertiesWorkspaceV4 - Complete workspace using template system
 */
export const PropertiesWorkspaceV4: React.FC<PropertiesWorkspaceV4Props> = ({
  user,
  onNavigate,
  onAddProperty,
  onEditProperty,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter state - maintain state for each filter
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<string[]>([]);
  
  // Bulk operation modals state
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);

  // Load properties based on user role
  const allProperties = useMemo(() => {
    return getProperties(user.role === 'admin' ? undefined : user.id, user.role);
  }, [user.id, user.role]);
  
  // Load agents for bulk assignment
  const availableAgents = useMemo(() => {
    return getAllAgents().filter(u => u.role === 'agent' || u.role === 'admin');
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const forSale = allProperties.filter(p => p.activeSellCycleIds?.length > 0).length;
    const forRent = allProperties.filter(p => p.activeRentCycleIds?.length > 0).length;
    const inAcquisition = allProperties.filter(p => p.activePurchaseCycleIds?.length > 0).length;
    
    return [
      { label: 'Total', value: allProperties.length, variant: 'default' as const },
      { label: 'For Sale', value: forSale, variant: 'success' as const },
      { label: 'For Rent', value: forRent, variant: 'info' as const },
      { label: 'In Acquisition', value: inAcquisition, variant: 'warning' as const },
    ];
  }, [allProperties]);

  // Define table columns
  const columns: Column<Property>[] = [
    {
      id: 'address',
      label: 'Property',
      accessor: (p) => {
        const propertyAddress = typeof p.address === 'string' 
          ? p.address 
          : formatPropertyAddress(p.address);
        
        return (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={propertyAddress} className="w-full h-full object-cover rounded" />
              ) : (
                <Home className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{propertyAddress}</div>
              <div className="text-sm text-gray-500 capitalize">{p.propertyType}</div>
            </div>
          </div>
        );
      },
      width: '300px',
      sortable: true,
    },
    {
      id: 'area',
      label: 'Area',
      accessor: (p) => {
        const unitLabels = { sqft: 'sq ft', sqyards: 'sq yd', marla: 'marla', kanal: 'kanal' };
        return `${p.area} ${unitLabels[p.areaUnit] || p.areaUnit}`;
      },
      width: '120px',
      sortable: true,
    },
    {
      id: 'rooms',
      label: 'Rooms',
      accessor: (p) => {
        if (!p.bedrooms) return '-';
        return `${p.bedrooms} bed${p.bathrooms ? `, ${p.bathrooms} bath` : ''}`;
      },
      width: '120px',
    },
    {
      id: 'owner',
      label: 'Owner',
      accessor: (p) => (
        <div>
          <div className="text-sm text-gray-900">{p.currentOwnerName}</div>
          <div className="text-xs text-gray-500 capitalize">{p.currentOwnerType}</div>
        </div>
      ),
      width: '150px',
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (p) => {
        let status = 'Available';
        
        if (p.activeSellCycleIds?.length > 0) {
          status = 'For Sale';
        } else if (p.activeRentCycleIds?.length > 0) {
          status = 'For Rent';
        } else if (p.activePurchaseCycleIds?.length > 0) {
          status = 'In Acquisition';
        }
        
        // PHASE 5: Use StatusBadge component with auto-mapping
        return <StatusBadge status={status} size="sm" />;
      },
      width: '120px',
      align: 'center',
    },
    {
      id: 'agent',
      label: 'Agent',
      accessor: (p) => p.createdBy === user.id ? 'You' : 'Shared',
      width: '100px',
    },
  ];

  // Define quick filters with state management
  const quickFilters = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'for-sale', label: 'For Sale' },
        { value: 'for-rent', label: 'For Rent' },
        { value: 'in-acquisition', label: 'In Acquisition' },
        { value: 'available', label: 'Available' },
      ],
      value: statusFilter,
      onChange: (value: string | string[]) => setStatusFilter(Array.isArray(value) ? value : [value]),
      multiple: true,
    },
    {
      id: 'type',
      label: 'Type',
      options: [
        { value: 'house', label: 'House' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'plot', label: 'Plot' },
        { value: 'commercial', label: 'Commercial' },
      ],
      value: typeFilter,
      onChange: (value: string | string[]) => setTypeFilter(Array.isArray(value) ? value : [value]),
      multiple: true,
    },
    {
      id: 'owner',
      label: 'Owner Type',
      options: [
        { value: 'client', label: 'Client' },
        { value: 'agency', label: 'Agency' },
        { value: 'investor', label: 'Investor' },
      ],
      value: ownerFilter,
      onChange: (value: string | string[]) => setOwnerFilter(Array.isArray(value) ? value : [value]),
      multiple: true,
    },
  ];

  // Define sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'area-high', label: 'Area: High to Low' },
    { value: 'area-low', label: 'Area: Low to High' },
  ];

  // Define bulk actions
  const bulkActions = [
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: (ids: string[]) => {
        const selectedProperties = allProperties.filter(p => ids.includes(p.id));
        exportPropertiesToCSV(selectedProperties);
        toast.success(`Exported ${ids.length} properties to CSV`);
      },
    },
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: <UserPlus className="h-4 w-4" />,
      onClick: (ids: string[]) => {
        setSelectedPropertyIds(ids);
        setBulkAssignOpen(true);
      },
      disabled: user.role !== 'admin',
    },
    {
      id: 'edit',
      label: 'Bulk Edit',
      icon: <Edit3 className="h-4 w-4" />,
      onClick: (ids: string[]) => {
        setSelectedPropertyIds(ids);
        setBulkEditOpen(true);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (ids: string[]) => {
        if (window.confirm(`Are you sure you want to delete ${ids.length} properties?`)) {
          ids.forEach(id => deleteProperty(id, user.id));
          toast.success(`Deleted ${ids.length} properties`);
          window.location.reload(); // Refresh data
        }
      },
      variant: 'destructive' as const,
      requireConfirm: true,
    },
  ];

  // Custom filter callback for WorkspacePageTemplate
  const handleFilter = useCallback((property: Property, activeFilters: Map<string, any>) => {
    // Status filter
    const statusValues = activeFilters.get('status');
    if (statusValues && statusValues.length > 0) {
      let matchesStatus = false;
      if (statusValues.includes('for-sale') && property.activeSellCycleIds?.length > 0) matchesStatus = true;
      if (statusValues.includes('for-rent') && property.activeRentCycleIds?.length > 0) matchesStatus = true;
      if (statusValues.includes('in-acquisition') && property.activePurchaseCycleIds?.length > 0) matchesStatus = true;
      if (statusValues.includes('available') && 
          !property.activeSellCycleIds?.length && 
          !property.activeRentCycleIds?.length && 
          !property.activePurchaseCycleIds?.length) matchesStatus = true;
      if (!matchesStatus) return false;
    }

    // Type filter
    const typeValues = activeFilters.get('type');
    if (typeValues && typeValues.length > 0) {
      if (!typeValues.includes(property.propertyType)) return false;
    }

    // Owner filter
    const ownerValues = activeFilters.get('owner');
    if (ownerValues && ownerValues.length > 0) {
      if (!ownerValues.includes(property.currentOwnerType)) return false;
    }

    return true;
  }, []);

  // Custom search callback
  const handleSearch = useCallback((property: Property, query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Format property address for search
    const propertyAddress = typeof property.address === 'string' 
      ? property.address 
      : formatPropertyAddress(property.address);
    
    return (
      propertyAddress.toLowerCase().includes(lowerQuery) ||
      property.propertyType.toLowerCase().includes(lowerQuery) ||
      property.currentOwnerName.toLowerCase().includes(lowerQuery) ||
      (property.description?.toLowerCase() || '').includes(lowerQuery)
    );
  }, []);

  // Custom sort callback
  const handleSort = useCallback((items: Property[], sortBy: string, order: 'asc' | 'desc') => {
    const sorted = [...items];
    
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'area-high') {
      sorted.sort((a, b) => b.area - a.area);
    } else if (sortBy === 'area-low') {
      sorted.sort((a, b) => a.area - b.area);
    }
    
    return sorted;
  }, []);

  // Generate random property data
  const generateRandomProperty = useCallback(() => {
    // Random data arrays
    const propertyTypes = ['house', 'apartment', 'plot', 'commercial', 'land'] as const;
    const areaUnits = ['sqft', 'sqyards', 'marla', 'kanal'] as const;
    const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
    const areas = ['DHA Phase 5', 'Clifton', 'Gulshan', 'Bahria Town', 'Model Town', 'Saddar', 'Defence'];
    const streets = ['Street 1', 'Street 5', 'Street 10', 'Main Boulevard', 'Park Road', 'Commercial Avenue'];
    const ownerTypes = ['client', 'agency', 'investor'] as const;
    
    // Get random contact for owner or create a default
    const contacts = getContacts(user.role === 'admin' ? undefined : user.id, user.role);
    let ownerId = `owner_${Date.now()}`;
    let ownerName = 'Random Owner';
    let ownerType: 'client' | 'agency' | 'investor' = ownerTypes[Math.floor(Math.random() * ownerTypes.length)];
    
    if (contacts.length > 0) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      ownerId = randomContact.id;
      ownerName = randomContact.name;
      // Try to infer owner type from contact type
      if (randomContact.type === 'investor') ownerType = 'investor';
      else if (randomContact.type === 'corporate') ownerType = 'agency';
      else ownerType = 'client';
    }
    
    // Generate random property details
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const areaUnit = areaUnits[Math.floor(Math.random() * areaUnits.length)];
    
    // Area based on property type and unit
    let area = 0;
    if (propertyType === 'plot' || propertyType === 'land') {
      area = areaUnit === 'marla' ? Math.floor(Math.random() * 20) + 5 : // 5-25 marla
             areaUnit === 'kanal' ? Math.floor(Math.random() * 5) + 1 : // 1-6 kanal
             areaUnit === 'sqyards' ? Math.floor(Math.random() * 1000) + 500 : // 500-1500 sq yards
             Math.floor(Math.random() * 9000) + 4500; // 4500-13500 sqft
    } else {
      area = areaUnit === 'marla' ? Math.floor(Math.random() * 15) + 5 : // 5-20 marla
             areaUnit === 'kanal' ? Math.floor(Math.random() * 2) + 1 : // 1-3 kanal
             areaUnit === 'sqyards' ? Math.floor(Math.random() * 600) + 200 : // 200-800 sq yards
             Math.floor(Math.random() * 5400) + 1800; // 1800-7200 sqft
    }
    
    // Bedrooms and bathrooms (only for house/apartment)
    const bedrooms = (propertyType === 'house' || propertyType === 'apartment') 
      ? Math.floor(Math.random() * 4) + 2 // 2-5 bedrooms
      : undefined;
    const bathrooms = bedrooms 
      ? Math.floor(Math.random() * (bedrooms - 1)) + 1 // 1 to bedrooms-1
      : undefined;
    
    // Generate address
    const city = cities[Math.floor(Math.random() * cities.length)];
    const areaName = areas[Math.floor(Math.random() * areas.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    const address = `${houseNumber} ${street}, ${areaName}, ${city}`;
    
    // Generate description
    const descriptions = [
      `Beautiful ${propertyType} in prime location`,
      `Well-maintained ${propertyType} with modern amenities`,
      `Spacious ${propertyType} perfect for families`,
      `Luxury ${propertyType} with excellent views`,
      `Affordable ${propertyType} in growing area`,
    ];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Features
    const allFeatures = ['Parking', 'Garden', 'Security', 'Elevator', 'Gym', 'Pool', 'Balcony', 'Terrace'];
    const numFeatures = Math.floor(Math.random() * 4) + 1; // 1-4 features
    const features = allFeatures.sort(() => 0.5 - Math.random()).slice(0, numFeatures);
    
    // Create property data (using any to support extended Property type)
    const propertyData: any = {
      // Physical details
      address: address,
      propertyType: propertyType,
      area: area,
      areaUnit: areaUnit,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      features: features,
      description: description,
      images: [],
      
      // Ownership
      currentOwnerId: ownerId,
      currentOwnerName: ownerName,
      currentOwnerType: ownerType,
      ownershipHistory: [
        {
          ownerId: ownerId,
          ownerName: ownerName,
          acquiredDate: new Date().toISOString().split('T')[0],
          notes: 'Initial owner',
        },
      ],
      
      // V3.0: Empty cycle arrays (cycles added separately!)
      activeSellCycleIds: [],
      activePurchaseCycleIds: [],
      activeRentCycleIds: [],
      
      // Status (computed)
      currentStatus: 'No Active Cycle',
      
      // History
      cycleHistory: {
        sellCycles: [],
        purchaseCycles: [],
        rentCycles: [],
      },
      transactionIds: [],
      
      // Sharing
      createdBy: user.id,
      sharedWith: [],
      isInternalListing: false,
    };

    // Add the property
    try {
      addProperty(propertyData as Omit<Property, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success(`Quick property added: ${address}`);
      // Refresh the page to show the new property
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error adding quick property:', error);
      toast.error('Failed to add quick property');
    }
  }, [user.id, user.role]);

  return (
    <>
      <WorkspacePageTemplate
        // Header
        title="Properties"
        description="Manage your property portfolio"
        stats={stats}

        // Primary Action
        primaryAction={{
          label: 'Add Property',
          icon: <Plus className="h-4 w-4" />,
          onClick: onAddProperty || (() => toast.info('Add Property clicked')),
        }}

        // Secondary Actions
        secondaryActions={[
          {
            label: 'Quick Property',
            icon: <Zap className="h-4 w-4" />,
            onClick: generateRandomProperty,
          },
        ]}

        // Data
        items={allProperties}
        getItemId={(p) => p.id}
        isLoading={isLoading}

        // View Configuration
        defaultView="grid"
        availableViews={['grid', 'table']}

        // Table View
        columns={columns}

        // Grid View
        renderCard={(property) => {
          const propertyAddress = typeof property.address === 'string' 
            ? property.address 
            : formatPropertyAddress(property.address);
          
          return (
            <PropertyWorkspaceCard
              property={property}
              onClick={() => onNavigate('property-detail', property.id)}
              onEdit={() => onEditProperty?.(property)}
              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this property?')) {
                  deleteProperty(property.id, user.id);
                  toast.success('Property deleted');
                  window.location.reload();
                }
              }}
              onShare={() => toast.info('Share property: ' + propertyAddress)}
            />
          );
        }}

        // Search & Filter
        searchPlaceholder="Search properties by address, type, or owner..."
        quickFilters={quickFilters}
        sortOptions={sortOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}

        // Bulk Actions
        bulkActions={bulkActions}

        // Pagination
        pagination={{
          enabled: true,
          pageSize: 24,
          pageSizeOptions: [12, 24, 48, 96],
        }}

        // Empty State
        emptyStatePreset={EmptyStatePresets.properties(
          onAddProperty || (() => toast.info('Add your first property'))
        )}

        // Callbacks
        onItemClick={(property) => onNavigate('property-detail', property.id)}
      />
      
      {/* Bulk Assign Agent Modal */}
      <BulkAssignAgentModal
        open={bulkAssignOpen}
        onClose={() => {
          setBulkAssignOpen(false);
          setSelectedPropertyIds([]);
        }}
        properties={allProperties.filter(p => selectedPropertyIds.includes(p.id))}
        agents={availableAgents}
        onSuccess={() => {
          setBulkAssignOpen(false);
          setSelectedPropertyIds([]);
          window.location.reload();
        }}
      />
      
      {/* Bulk Edit Properties Modal */}
      <BulkEditPropertiesModal
        open={bulkEditOpen}
        onClose={() => {
          setBulkEditOpen(false);
          setSelectedPropertyIds([]);
        }}
        properties={allProperties.filter(p => selectedPropertyIds.includes(p.id))}
        onSuccess={() => {
          setBulkEditOpen(false);
          setSelectedPropertyIds([]);
          window.location.reload();
        }}
      />
    </>
  );
};

// Default export for lazy loading
export default PropertiesWorkspaceV4;