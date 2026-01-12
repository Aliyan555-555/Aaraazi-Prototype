/**
 * RentRequirementsWorkspaceV4 Component
 * WORKSPACE V4: Built with WorkspacePageTemplate ✅
 * 
 * PURPOSE:
 * Complete rent requirements workspace using the template system.
 * Demonstrates tenant search criteria and property matching.
 */

import React, { useState, useMemo } from 'react';
import {
    Plus,
    Download,
    Trash2,
    Upload,
    Search,
    DollarSign,
    User,
    Calendar,
    Tag,
    MapPin,
} from 'lucide-react';
import { RentRequirement } from '../../types';
import { User as UserType } from '../../types';
import { WorkspacePageTemplate } from '../workspace/WorkspacePageTemplate';
import { RentRequirementWorkspaceCard } from './RentRequirementWorkspaceCard';
import { StatusBadge } from '../layout/StatusBadge';
import { Column, EmptyStatePresets } from '../workspace';
import { formatPKR } from '../../lib/currency';
import { getRentRequirements, updateRentRequirement, deleteRentRequirement } from '../../lib/rentRequirements';
import { toast } from 'sonner';

export interface RentRequirementsWorkspaceV4Props {
    user: UserType;
    onNavigate: (section: string, id?: string) => void;
    onAddNew?: () => void;
    onEditRequirement?: (requirement: RentRequirement) => void;
}

/**
 * RentRequirementsWorkspaceV4 - Complete workspace using template system
 */
export const RentRequirementsWorkspaceV4: React.FC<RentRequirementsWorkspaceV4Props> = ({
    user,
    onNavigate,
    onAddNew,
    onEditRequirement,
}) => {
    // State
    const [isLoading, setIsLoading] = useState(false);

    // Load rent requirements based on user role
    const allRequirements = useMemo(() => {
        return getRentRequirements(user.id, user.role);
    }, [user.id, user.role]);

    // Calculate stats
    const stats = useMemo(() => {
        const active = allRequirements.filter(r => r.status === 'active').length;
        const matched = allRequirements.filter(r => r.status === 'matched').length;
        const urgent = allRequirements.filter(r => r.urgency === 'high' && r.status === 'active').length;

        return [
            { label: 'Total', value: allRequirements.length, variant: 'default' as const },
            { label: 'Active', value: active, variant: 'success' as const },
            { label: 'Matched', value: matched, variant: 'warning' as const },
            { label: 'Urgent', value: urgent, variant: 'danger' as const },
        ];
    }, [allRequirements]);

    // Define table columns
    const columns: Column<RentRequirement>[] = [
        {
            id: 'tenant',
            label: 'Tenant',
            accessor: (r) => (
                <div>
                    <div className="font-medium text-gray-900">{(r as any).contactName || (r as any).tenantName || 'Tenant'}</div>
                    <div className="text-sm text-gray-500">{(r as any).contactPhone || (r as any).tenantPhone}</div>
                </div>
            ),
            width: '200px',
            sortable: true,
        },
        {
            id: 'budget',
            label: 'Monthly Budget',
            accessor: (r) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-900">
                        {formatPKR(r.minBudget)} - {formatPKR(r.maxBudget)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {r.leaseDuration || 'Long term'}
                    </div>
                </div>
            ),
            width: '180px',
            sortable: true,
        },
        {
            id: 'propertyTypes',
            label: 'Property Types',
            accessor: (r) => (
                <div className="text-sm text-gray-900">
                    {r.propertyTypes && r.propertyTypes.length > 0
                        ? r.propertyTypes.slice(0, 2).join(', ') + (r.propertyTypes.length > 2 ? '...' : '')
                        : 'Any'}
                </div>
            ),
            width: '150px',
        },
        {
            id: 'bedrooms',
            label: 'Bedrooms',
            accessor: (r) => (
                <div className="text-sm text-gray-900">
                    {r.bedrooms}+
                </div>
            ),
            width: '100px',
            sortable: true,
        },
        {
            id: 'areas',
            label: 'Preferred Location',
            accessor: (r) => (
                <div className="text-sm text-gray-900">
                    {r.preferredLocation || 'Any'}
                </div>
            ),
            width: '180px',
        },
        {
            id: 'status',
            label: 'Status',
            accessor: (r) => {
                const statusLabel = r.status.charAt(0).toUpperCase() + r.status.slice(1);
                return <StatusBadge status={statusLabel} size="sm" />;
            },
            width: '100px',
            sortable: true,
        },
        {
            id: 'urgency',
            label: 'Urgency',
            accessor: (r) => {
                const urgencyLabels: Record<string, { label: string; variant: 'default' | 'info' | 'warning' }> = {
                    low: { label: 'Low', variant: 'default' },
                    medium: { label: 'Medium', variant: 'info' },
                    high: { label: 'High', variant: 'warning' },
                };
                const urgency = urgencyLabels[r.urgency] || { label: r.urgency, variant: 'default' as const };
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${urgency.variant === 'warning' ? 'bg-red-100 text-red-800' : ''}
            ${urgency.variant === 'info' ? 'bg-blue-100 text-blue-800' : ''}
            ${urgency.variant === 'default' ? 'bg-gray-100 text-gray-600' : ''}
          `}>
                        {urgency.label}
                    </span>
                );
            },
            width: '100px',
            sortable: true,
        },
    ];

    // Define quick filters
    const quickFilters = [
        {
            id: 'status',
            label: 'Status',
            options: [
                { value: 'active', label: 'Active', count: allRequirements.filter(r => r.status === 'active').length },
                { value: 'matched', label: 'Matched', count: allRequirements.filter(r => r.status === 'matched').length },
                { value: 'closed', label: 'Closed', count: allRequirements.filter(r => r.status === 'closed').length },
            ],
            multiple: true,
        },
        {
            id: 'urgency',
            label: 'Urgency',
            options: [
                { value: 'high', label: 'High', count: allRequirements.filter(r => r.urgency === 'high').length },
                { value: 'medium', label: 'Medium', count: allRequirements.filter(r => r.urgency === 'medium').length },
                { value: 'low', label: 'Low', count: allRequirements.filter(r => r.urgency === 'low').length },
            ],
            multiple: true,
        },
    ];

    // Define sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'budget-high', label: 'Budget: High to Low' },
        { value: 'budget-low', label: 'Budget: Low to High' },
        { value: 'urgency', label: 'Urgency: High to Low' },
    ];

    // Define bulk actions
    const bulkActions = [
        {
            id: 'export',
            label: 'Export Selected',
            icon: <Download className="h-4 w-4" />,
            onClick: (ids: string[]) => {
                toast.success(`Exporting ${ids.length} requirements`);
            },
        },
        {
            id: 'delete',
            label: 'Delete Selected',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (ids: string[]) => {
                toast.success(`${ids.length} requirements deleted`);
            },
            variant: 'destructive' as const,
        },
    ];

    // Custom filter function
    const handleFilter = (requirement: RentRequirement, filterValues: Record<string, any>): boolean => {
        if (filterValues.status?.length > 0 && !filterValues.status.includes(requirement.status)) {
            return false;
        }
        if (filterValues.urgency?.length > 0 && !filterValues.urgency.includes(requirement.urgency)) {
            return false;
        }
        return true;
    };

    // Custom sort function
    const handleSort = (requirements: RentRequirement[], sortBy: string): RentRequirement[] => {
        const sorted = [...requirements];
        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'budget-high':
                sorted.sort((a, b) => b.maxBudget - a.maxBudget);
                break;
            case 'budget-low':
                sorted.sort((a, b) => a.minBudget - b.minBudget);
                break;
            case 'urgency':
                sorted.sort((a, b) => {
                    const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                    return (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
                });
                break;
        }
        return sorted;
    };

    // Custom search function
    const handleSearch = (requirement: RentRequirement, query: string): boolean => {
        const searchLower = query.toLowerCase();
        const tenantName = ((requirement as any).contactName || (requirement as any).tenantName || '').toLowerCase();

        return (
            tenantName.includes(searchLower) ||
            requirement.propertyTypes?.some(type => type.toLowerCase().includes(searchLower)) ||
            (requirement.preferredLocation && requirement.preferredLocation.toLowerCase().includes(searchLower)) ||
            requirement.minBudget.toString().includes(searchLower) ||
            requirement.maxBudget.toString().includes(searchLower)
        );
    };

    return (
        <WorkspacePageTemplate
            title="Rent Requirements"
            description="Manage tenant search criteria and rental property matching"
            stats={stats}

            primaryAction={{
                label: 'Add Rent Requirement',
                icon: <Plus className="w-4 h-4" />,
                onClick: onAddNew || (() => toast.info('Add Rent Requirement clicked')),
            }}

            secondaryActions={[
                {
                    label: 'Import',
                    icon: <Upload className="w-4 h-4" />,
                    onClick: () => toast.info('Import clicked'),
                },
                {
                    label: 'Export All',
                    icon: <Download className="w-4 h-4" />,
                    onClick: () => toast.info('Export All clicked'),
                },
            ]}

            defaultView="grid"
            availableViews={['grid', 'table']}
            items={allRequirements}
            getItemId={(requirement) => requirement.id}
            columns={columns}

            renderCard={(requirement) => (
                <RentRequirementWorkspaceCard
                    requirement={requirement}
                    onClick={() => onNavigate('rent-requirement-details', requirement.id)}
                    onEdit={() => onEditRequirement?.(requirement)}
                    onDelete={() => toast.info(`Delete requirement ${requirement.id}`)}
                />
            )}

            searchPlaceholder="Search by tenant name, area, property type..."
            onSearch={handleSearch}
            quickFilters={quickFilters}
            onFilter={handleFilter}
            sortOptions={sortOptions}
            onSort={handleSort}
            bulkActions={bulkActions}

            onItemClick={(requirement) => onNavigate('rent-requirement-details', requirement.id)}

            isLoading={isLoading}
        />
    );
};
