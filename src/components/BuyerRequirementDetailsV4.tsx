/**
 * Buyer Requirement Details - V4.0 with DetailPageTemplate ✅
 * 
 * COMPLETE REDESIGN using DetailPageTemplate system:
 * - DetailPageTemplate for consistent structure
 * - ContactCard for buyer information
 * - QuickActionsPanel for sidebar actions
 * - MetricCardsGroup for statistics
 * - DataTable for matched properties
 * - NotesPanel for additional notes
 * - ActivityTimeline for viewing history
 * - All 5 UX Laws applied
 * - 8px grid system
 * - Responsive 2/3 + 1/3 layout
 * 
 * TABS:
 * 1. Overview - Summary + InfoPanels + Sidebar
 * 2. Criteria - Property search criteria
 * 3. Matches - Matched properties with offers
 * 4. Viewings - Viewing history and schedule
 * 5. Activity - Timeline of all activities
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BuyerRequirement, User } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// DetailPageTemplate System
import {
  DetailPageTemplate,
  DetailPageTab,
  QuickActionsPanel,
  MetricCardsGroup,
  SummaryStatsPanel,
  ActivityTimeline,
  Activity,
  ContactCard,
  NotesPanel,
  Note,
} from './layout';

// Foundation Components
import { InfoPanel } from './ui/info-panel';
import { StatusTimeline } from './ui/status-timeline';
import { StatusBadge } from './layout/StatusBadge';

// Requirement-Specific Components
import { SendOfferToBuyerModal } from './SendOfferToBuyerModal';
import { EnhancedMatchCard } from './EnhancedMatchCard';

// Icons
import {
  DollarSign,
  Home,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Landmark,
  Phone,
  User as UserIcon,
  Clock,
  Search,
  UserCheck,
  Plus,
  Eye,
} from 'lucide-react';

// Business Logic
import {
  updateBuyerRequirement,
  closeBuyerRequirement,
  deleteBuyerRequirement,
} from '../lib/buyerRequirements';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import {
  findMatchingPropertiesForBuyer,
  getMatchScoreColor,
  getMatchScoreLabel,
  PropertyMatch,
} from '../lib/propertyMatching';
import {
  getOffersByBuyerRequirement,
  getLatestOfferForProperty,
  getSellCycleById,
} from '../lib/sellCycle';

interface BuyerRequirementDetailsV4Props {
  requirement: BuyerRequirement;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  onNavigateToSellCycle?: (sellCycleId: string) => void;
  onNavigateToProperty?: (propertyId: string) => void;
}

export function BuyerRequirementDetailsV4({
  requirement,
  user,
  onBack,
  onUpdate,
  onNavigateToSellCycle,
  onNavigateToProperty,
}: BuyerRequirementDetailsV4Props) {
  const [matchedProperties, setMatchedProperties] = useState<PropertyMatch[]>([]);
  const [showSendOfferModal, setShowSendOfferModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<PropertyMatch | null>(null);

  // Navigation helper
  const handleNavigation = (page: string, id: string) => {
    if (page === 'sell-cycle' && onNavigateToSellCycle) {
      onNavigateToSellCycle(id);
    } else if (page === 'property' && onNavigateToProperty) {
      onNavigateToProperty(id);
    } else {
      toast.info('Navigate to ' + page);
    }
  };

  // Load matched properties
  useEffect(() => {
    const matches = findMatchingPropertiesForBuyer(requirement, user.id, user.role);
    setMatchedProperties(matches);
  }, [requirement, user.id, user.role]);

  // Calculate metrics
  const budgetRange = requirement.maxBudget - requirement.minBudget;
  const daysActive = Math.floor(
    (Date.now() - new Date(requirement.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Action handlers
  const handleClose = () => {
    if (confirm('Are you sure you want to close this requirement?')) {
      closeBuyerRequirement(requirement.id);
      toast.success('Requirement closed');
      onUpdate();
      onBack();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this requirement? This action cannot be undone.')) {
      deleteBuyerRequirement(requirement.id);
      toast.success('Requirement deleted');
      onUpdate();
      onBack();
    }
  };

  const handleSendOffer = (match: PropertyMatch) => {
    setSelectedMatch(match);
    setShowSendOfferModal(true);
  };

  // ==================== PAGE HEADER ====================
  const pageHeader = {
    title: `Buyer: ${requirement.buyerName}`,
    breadcrumbs: [
      { label: 'Buyer Requirements', onClick: onBack },
      { label: requirement.buyerName },
    ],
    description: `Managed by ${requirement.agentName} • Created ${new Date(
      requirement.createdAt
    ).toLocaleDateString()}`,
    metrics: [
      {
        label: 'Min Budget',
        value: formatPKR(requirement.minBudget),
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        label: 'Max Budget',
        value: formatPKR(requirement.maxBudget),
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        label: 'Matches',
        value: String(matchedProperties.length || 0),
        icon: <Home className="w-4 h-4" />,
      },
      {
        label: 'Urgency',
        value: <StatusBadge status={requirement.urgency} />,
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        label: 'Status',
        value: <StatusBadge status={requirement.status} />,
        icon: <UserCheck className="w-4 h-4" />,
      },
    ],
    primaryActions:
      requirement.status !== 'closed'
        ? [
            {
              label: 'Close Requirement',
              onClick: handleClose,
              variant: 'default' as const,
            },
          ]
        : [],
    secondaryActions:
      requirement.status !== 'closed'
        ? [
            {
              label: 'Delete',
              onClick: handleDelete,
            },
          ]
        : [],
    status: requirement.status,
    onBack,
  };

  // ==================== CONNECTED ENTITIES ====================
  const connectedEntities = [
    {
      type: 'buyer' as const,
      name: requirement.buyerName,
      icon: <UserCheck className="h-3 w-3" />,
      onClick: () => {},
    },
    {
      type: 'agent' as const,
      name: requirement.agentName,
      icon: <UserIcon className="h-3 w-3" />,
      onClick: () => {},
    },
  ];

  // ==================== OVERVIEW TAB - LEFT COLUMN ====================
  const overviewContent = (
    <>
      {/* Status Timeline */}
      <StatusTimeline
        steps={[
          {
            label: 'Created',
            status: 'complete',
            date: requirement.createdAt,
            description: `${formatPKR(requirement.maxBudget)} budget`,
          },
          {
            label: 'Searching',
            status:
              requirement.status === 'active'
                ? 'current'
                : ['matched', 'viewing', 'negotiating', 'satisfied'].includes(requirement.status)
                ? 'complete'
                : 'pending',
          },
          {
            label: 'Matches Found',
            status: matchedProperties.length > 0 ? 'complete' : 'pending',
            description: `${matchedProperties.length} match${matchedProperties.length !== 1 ? 'es' : ''}`,
          },
          {
            label: 'Viewing',
            status:
              requirement.status === 'viewing'
                ? 'current'
                : ['negotiating', 'satisfied'].includes(requirement.status)
                ? 'complete'
                : 'pending',
          },
          {
            label: 'Negotiating',
            status:
              requirement.status === 'negotiating'
                ? 'current'
                : requirement.status === 'satisfied'
                ? 'complete'
                : 'pending',
          },
          {
            label: 'Satisfied',
            status:
              requirement.status === 'satisfied'
                ? 'complete'
                : requirement.status === 'closed'
                ? 'complete'
                : 'pending',
          },
        ]}
      />

      {/* Buyer Information */}
      <InfoPanel
        title="Buyer Information"
        data={[
          {
            label: 'Name',
            value: requirement.buyerName,
            icon: <UserCheck className="h-4 w-4" />,
          },
          {
            label: 'Contact',
            value: requirement.buyerContact,
            icon: <Phone className="h-4 w-4" />,
            copyable: true,
          },
          {
            label: 'Agent',
            value: requirement.agentName,
            icon: <UserIcon className="h-4 w-4" />,
          },
          {
            label: 'Created',
            value: new Date(requirement.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            icon: <Calendar className="h-4 w-4" />,
          },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Budget & Requirements */}
      <InfoPanel
        title="Budget & Requirements"
        data={[
          {
            label: 'Min Budget',
            value: formatPKR(requirement.minBudget),
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            label: 'Max Budget',
            value: formatPKR(requirement.maxBudget),
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            label: 'Budget Range',
            value: formatPKR(budgetRange),
          },
          {
            label: 'Property Types',
            value: (requirement.propertyTypes || [])
              .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
              .join(', ') || 'Not specified',
            icon: <Home className="h-4 w-4" />,
          },
          {
            label: 'Preferred Locations',
            value: (requirement.preferredLocations || []).join(', ') || 'Not specified',
            icon: <MapPin className="h-4 w-4" />,
          },
          {
            label: 'Bedrooms',
            value: requirement.maxBedrooms
              ? `${requirement.minBedrooms}-${requirement.maxBedrooms}`
              : `${requirement.minBedrooms}+`,
          },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Timeline & Financing */}
      <InfoPanel
        title="Timeline & Financing"
        data={[
          {
            label: 'Urgency',
            value: <StatusBadge status={requirement.urgency} />,
          },
          {
            label: 'Target Move Date',
            value: requirement.targetMoveDate || 'Flexible',
            icon: <Calendar className="h-4 w-4" />,
          },
          {
            label: 'Financing Type',
            value: <span className="capitalize">{requirement.financingType}</span>,
            icon: <Landmark className="h-4 w-4" />,
          },
          {
            label: 'Pre-Approved',
            value: (
              <Badge variant={requirement.preApproved ? 'default' : 'secondary'}>
                {requirement.preApproved ? 'Yes' : 'No'}
              </Badge>
            ),
          },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Additional Notes */}
      {requirement.additionalNotes && (
        <InfoPanel
          title="Additional Notes"
          data={[
            {
              label: 'Notes',
              value: requirement.additionalNotes,
            },
          ]}
          columns={1}
          density="comfortable"
          showDivider={false}
        />
      )}
    </>
  );

  // ==================== OVERVIEW TAB - RIGHT COLUMN ====================
  const overviewSidebar = (
    <>
      {/* Buyer Contact Card */}
      <ContactCard
        name={requirement.buyerName}
        role="buyer"
        phone={requirement.buyerContact}
        notes={`Looking for ${(requirement.propertyTypes || []).join(', ')} in ${(requirement.preferredLocations || []).join(', ')}`}
        tags={['Buyer', requirement.urgency === 'high' ? 'Urgent' : requirement.urgency]}
        onCall={() => window.open(`tel:${requirement.buyerContact}`)}
      />

      {/* Quick Actions */}
      <QuickActionsPanel
        title="Quick Actions"
        actions={[
          {
            label: `View Matches (${matchedProperties.length})`,
            icon: <Search className="h-4 w-4" />,
            onClick: () => toast.info('Switch to Matches tab'),
          },
          {
            label: 'View Criteria',
            icon: <Home className="h-4 w-4" />,
            onClick: () => toast.info('Switch to Criteria tab'),
          },
          {
            label: `View Viewings (${requirement.viewings?.length || 0})`,
            icon: <Calendar className="h-4 w-4" />,
            onClick: () => toast.info('Switch to Viewings tab'),
          },
          ...(requirement.status !== 'closed'
            ? [
                {
                  label: 'Close Requirement',
                  icon: <CheckCircle className="h-4 w-4" />,
                  onClick: handleClose,
                },
              ]
            : []),
        ]}
      />

      {/* Key Metrics */}
      <MetricCardsGroup
        metrics={[
          {
            label: 'Budget Range',
            value: formatPKR(requirement.maxBudget),
            icon: <DollarSign className="h-5 w-5" />,
            variant: 'success',
            description: `${formatPKR(requirement.minBudget)} min`,
          },
          {
            label: 'Matches Found',
            value: matchedProperties.length.toString(),
            icon: <Search className="h-5 w-5" />,
            variant: matchedProperties.length > 0 ? 'info' : 'default',
            description: matchedProperties.length > 0 ? 'Available' : 'Searching',
          },
          {
            label: 'Days Active',
            value: daysActive.toString(),
            icon: <Clock className="h-5 w-5" />,
            variant: 'default',
          },
        ]}
        columns={2}
      />

      {/* Quick Stats */}
      <SummaryStatsPanel
        title="Quick Stats"
        stats={[
          {
            icon: <Home className="h-4 w-4" />,
            label: 'Property Types',
            value: `${(requirement.propertyTypes || []).length} type${
              (requirement.propertyTypes || []).length !== 1 ? 's' : ''
            }`,
            color: 'blue',
          },
          {
            icon: <MapPin className="h-4 w-4" />,
            label: 'Locations',
            value: `${(requirement.preferredLocations || []).length} area${
              (requirement.preferredLocations || []).length !== 1 ? 's' : ''
            }`,
            color: 'green',
          },
          {
            icon: <Clock className="h-4 w-4" />,
            label: 'Status',
            value: requirement.status,
            color: requirement.status === 'active' ? 'green' : 'yellow',
          },
        ]}
      />
    </>
  );

  // ==================== CRITERIA TAB ====================
  const criteriaContent = (
    <>
      {/* Property Types */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-5 w-5 text-gray-600" />
          <h3 className="text-base font-medium">Property Criteria</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Property Types</p>
            <div className="flex flex-wrap gap-2">
              {(requirement.propertyTypes || []).map((type, idx) => (
                <Badge key={idx} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Min Bedrooms</p>
              <p className="font-medium">{requirement.minBedrooms}</p>
            </div>
            {requirement.maxBedrooms && (
              <div>
                <p className="text-sm text-gray-600">Max Bedrooms</p>
                <p className="font-medium">{requirement.maxBedrooms}</p>
              </div>
            )}
            {requirement.minBathrooms && (
              <div>
                <p className="text-sm text-gray-600">Min Bathrooms</p>
                <p className="font-medium">{requirement.minBathrooms}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-gray-600" />
          <h3 className="text-base font-medium">Preferred Locations</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(requirement.preferredLocations || []).map((loc, idx) => (
            <Badge key={idx} variant="outline">
              {loc}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );

  // ==================== MATCHES TAB ====================
  const matchesContent =
    matchedProperties && matchedProperties.length > 0 ? (
      <div className="space-y-4">
        {matchedProperties.map((match) => {
          const latestOffer = getLatestOfferForProperty(requirement.id, match.propertyId);
          return (
            <EnhancedMatchCard
              key={match.propertyId}
              match={match}
              latestOffer={latestOffer}
              onSendOffer={() => handleSendOffer(match)}
              onViewProperty={() => handleNavigation('property', match.propertyId)}
              onViewSellCycle={() =>
                match.sellCycleId && handleNavigation('sell-cycle', match.sellCycleId)
              }
            />
          );
        })}
      </div>
    ) : (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-base mb-2">No Matches Found</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          No properties currently match this buyer's requirements. We'll notify you when new matches
          become available.
        </p>
      </div>
    );

  // ==================== VIEWINGS TAB ====================
  const viewingsContent =
    requirement.viewings && requirement.viewings.length > 0 ? (
      <div className="space-y-4">
        {requirement.viewings.map((viewing, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-2">{viewing.propertyAddress}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(viewing.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{viewing.scheduledTime || 'Time TBD'}</span>
                  </div>
                  {viewing.notes && <p className="mt-2">{viewing.notes}</p>}
                </div>
              </div>
              <StatusBadge status={viewing.status || 'scheduled'} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-base mb-2">No Viewings Scheduled</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          No property viewings have been scheduled yet.
        </p>
      </div>
    );

  // ==================== ACTIVITY TAB ====================
  const activities: Activity[] = useMemo(() => {
    const activityList: Activity[] = [];

    // Requirement created
    activityList.push({
      id: 'created',
      type: 'created',
      title: 'Requirement created',
      description: `Budget: ${formatPKR(requirement.minBudget)} - ${formatPKR(requirement.maxBudget)}`,
      date: requirement.createdAt,
      user: requirement.agentName,
      icon: <Plus className="h-5 w-5 text-blue-600" />,
    });

    // Viewings
    (requirement.viewings || []).forEach((viewing, idx) => {
      activityList.push({
        id: `viewing-${idx}`,
        type: 'viewing',
        title: 'Viewing scheduled',
        description: viewing.propertyAddress,
        date: viewing.scheduledDate,
        icon: <Eye className="h-5 w-5 text-green-600" />,
      });
    });

    // Sort by date descending
    return activityList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [requirement]);

  const activityContent = (
    <ActivityTimeline
      title="Requirement Timeline"
      activities={activities}
      emptyMessage="No activities yet"
    />
  );

  // ==================== TABS CONFIGURATION ====================
  const tabs: DetailPageTab[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: overviewContent,
      sidebar: overviewSidebar,
      layout: '2-1',
    },
    {
      id: 'criteria',
      label: 'Criteria',
      content: criteriaContent,
      layout: '3-0',
    },
    {
      id: 'matches',
      label: `Matches (${matchedProperties.length})`,
      content: matchesContent,
      layout: '3-0',
    },
    {
      id: 'viewings',
      label: `Viewings (${requirement.viewings?.length || 0})`,
      content: viewingsContent,
      layout: '3-0',
    },
    {
      id: 'activity',
      label: 'Activity',
      content: activityContent,
      layout: '3-0',
    },
  ];

  // ==================== RENDER ====================
  return (
    <>
      <DetailPageTemplate
        pageHeader={pageHeader}
        connectedEntities={connectedEntities}
        tabs={tabs}
        defaultTab="overview"
      />

      {/* Send Offer Modal */}
      {showSendOfferModal && selectedMatch && (
        <SendOfferToBuyerModal
          match={selectedMatch}
          buyerRequirement={requirement}
          onClose={() => {
            setShowSendOfferModal(false);
            setSelectedMatch(null);
          }}
          onSuccess={() => {
            setShowSendOfferModal(false);
            setSelectedMatch(null);
            onUpdate();
            toast.success('Offer sent successfully');
          }}
        />
      )}
    </>
  );
}