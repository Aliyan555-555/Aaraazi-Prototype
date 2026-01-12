/**
 * RentRequirementWorkspaceCard Component
 * Custom card for Rent Requirements Workspace V4
 * 
 * Uses WorkspaceCard with rent requirement-specific customization
 */

import React from 'react';
import {
    Home,
    MapPin,
    DollarSign,
    User,
    Calendar,
    Tag,
    Eye,
    FileText,
    Search,
} from 'lucide-react';
import { RentRequirement } from '../../types';
import { WorkspaceCard } from '../workspace/cards/WorkspaceCard';
import { QuickActionMenu } from '../workspace/QuickActionMenu';
import { formatPKR } from '../../lib/currency';

export interface RentRequirementWorkspaceCardProps {
    requirement: RentRequirement;
    isSelected?: boolean;
    onSelect?: (selected: boolean) => void;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showSelection?: boolean;
}

/**
 * RentRequirementWorkspaceCard - Custom card for rent requirement grid view
 */
export const RentRequirementWorkspaceCard: React.FC<RentRequirementWorkspaceCardProps> = ({
    requirement,
    isSelected = false,
    onSelect,
    onClick,
    onEdit,
    onDelete,
    showSelection = true,
}) => {
    // Get status badge variant
    const getStatusVariant = (): { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'secondary' } => {
        switch (requirement.status) {
            case 'active':
                return { label: 'Active', variant: 'success' };
            case 'matched':
                return { label: 'Matched', variant: 'warning' };
            case 'closed':
                return { label: 'Closed', variant: 'secondary' };
            default:
                return { label: (requirement.status as string) || 'Active', variant: 'default' };
        }
    };

    // Get urgency label
    const getUrgencyLabel = () => {
        const labels: Record<string, string> = {
            low: 'Low Priority',
            medium: 'Medium Priority',
            high: 'Urgent',
        };
        return labels[requirement.urgency] || (requirement.urgency as string);
    };

    // Get urgency variant
    const getUrgencyVariant = (): 'default' | 'success' | 'info' | 'warning' => {
        switch (requirement.urgency) {
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            case 'low':
                return 'default';
            default:
                return 'default';
        }
    };

    // Determine tags (max 3)
    const tags: Array<{ label: string; variant: 'default' | 'success' | 'info' | 'warning' }> = [];

    // Add urgency tag
    tags.push({
        label: getUrgencyLabel(),
        variant: getUrgencyVariant()
    });

    // Add lease duration tag
    if (requirement.leaseDuration) {
        tags.push({ label: requirement.leaseDuration, variant: 'info' });
    }

    // Add matched properties tag
    if (requirement.matchedProperties && requirement.matchedProperties.length > 0) {
        tags.push({
            label: `${requirement.matchedProperties.length} Match${requirement.matchedProperties.length > 1 ? 'es' : ''}`,
            variant: 'warning'
        });
    }

    // Build metadata (max 5 items - Miller's Law)
    const metadata = [
        {
            label: 'Budget Range',
            value: `${formatPKR(requirement.minBudget)} - ${formatPKR(requirement.maxBudget)}`.replace(/PKR /g, ''),
            icon: <DollarSign className="h-4 w-4" />,
        },
        {
            label: 'Tenant',
            value: (requirement as any).contactName || (requirement as any).tenantName || 'Tenant',
            icon: <User className="h-4 w-4" />,
        },
        {
            label: 'Bedrooms',
            value: `${requirement.bedrooms}+`,
            icon: <Home className="h-4 w-4" />,
        },
    ];

    // Add property types
    if (requirement.propertyTypes && requirement.propertyTypes.length > 0) {
        metadata.push({
            label: 'Types',
            value: requirement.propertyTypes.slice(0, 2).join(', '),
            icon: <Tag className="h-4 w-4" />,
        });
    }

    // Add preferred location
    if (requirement.preferredLocation) {
        metadata.push({
            label: 'Location',
            value: requirement.preferredLocation,
            icon: <MapPin className="h-4 w-4" />,
        });
    }

    // Limit to 5 items
    const displayMetadata = metadata.slice(0, 5);

    const status = getStatusVariant();

    // Title based on tenant name or property types
    const title = (requirement as any).contactName || (requirement as any).tenantName || 'Tenant Requirement';
    const subtitle = requirement.propertyTypes && requirement.propertyTypes.length > 0
        ? requirement.propertyTypes.join(', ')
        : 'Rental Search';

    return (
        <WorkspaceCard
            title={title}
            subtitle={subtitle}
            imageFallback={<Search className="h-12 w-12 text-gray-400" />}
            status={status}
            metadata={displayMetadata}
            tags={tags.slice(0, 3)}
            footer={
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        {requirement.moveInDate ? (
                            <>
                                <Calendar className="h-3 w-3" />
                                <span>
                                    Move-in: {new Date(requirement.moveInDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </>
                        ) : (
                            <>
                                <Calendar className="h-3 w-3" />
                                <span>
                                    Created {new Date(requirement.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                    <QuickActionMenu
                        actions={[
                            ...(onClick ? [{
                                id: 'view',
                                label: 'View Details',
                                icon: <Eye className="h-4 w-4" />,
                                onClick: onClick,
                            }] : []),
                            ...(onEdit ? [{
                                id: 'edit',
                                label: 'Edit',
                                icon: <FileText className="h-4 w-4" />,
                                onClick: onEdit,
                            }] : []),
                            ...(onDelete ? [{
                                id: 'delete',
                                label: 'Delete',
                                icon: <FileText className="h-4 w-4" />,
                                onClick: onDelete,
                                variant: 'destructive' as const,
                            }] : []),
                        ]}
                        showOnHover={true}
                    />
                </div>
            }
            onClick={onClick}
            isSelected={isSelected}
            onSelect={onSelect}
            showSelection={showSelection}
        />
    );
};
