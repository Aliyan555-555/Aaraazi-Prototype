/**
 * SellCycleDetailsExample - Example implementation using DetailPageTemplate
 * 
 * This demonstrates how to use the reusable template and helper components
 * to build a consistent, world-class detail page following all UX laws.
 * 
 * Copy this pattern for:
 * - Purchase Cycle Details
 * - Rent Cycle Details
 * - Deal Details
 * - Requirement Details
 */

import React, { useState } from 'react';
import { DetailPageTemplate, DetailPageTab } from '../layout/DetailPageTemplate';
import { QuickActionsPanel, QuickAction } from '../layout/QuickActionsPanel';
import { MetricCardsGroup } from '../layout/MetricCardsGroup';
import { SummaryStatsPanel, SummaryStat } from '../layout/SummaryStatsPanel';
import { DataTable, DataTableColumn } from '../layout/DataTable';
import { PaymentSummaryPanel } from '../layout/PaymentSummaryPanel';
import { ActivityTimeline, Activity } from '../layout/ActivityTimeline';
import { InfoPanel } from '../ui/info-panel';
import { StatusTimeline } from '../ui/status-timeline';
import { StatusBadge } from '../layout/StatusBadge';
import { Button } from '../ui/button';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Plus,
  Edit,
  Home,
  User,
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { formatPKR } from '../../lib/currency';
import { SellCycle, Property, User as UserType } from '../../types';

interface SellCycleDetailsExampleProps {
  cycle: SellCycle;
  property: Property;
  user: UserType;
  onBack: () => void;
  onEdit: () => void;
  onRecordOffer: () => void;
  onUpdateStatus: () => void;
  onViewProperty: () => void;
}

export function SellCycleDetailsExample({
  cycle,
  property,
  user,
  onBack,
  onEdit,
  onRecordOffer,
  onUpdateStatus,
  onViewProperty,
}: SellCycleDetailsExampleProps) {
  // Calculate metrics
  const daysListed = Math.floor(
    (Date.now() - new Date(cycle.listedDate || cycle.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalOffers = cycle.offers?.length || 0;
  const highestOffer = cycle.offers?.reduce(
    (max, offer) => Math.max(max, offer.amount),
    0
  ) || 0;

  // Mock data for demonstration
  const offers = cycle.offers || [];
  const payments = [
    {
      id: '1',
      installment: 1,
      dueDate: '2024-02-15',
      amount: 1000000,
      status: 'paid',
      paidDate: '2024-02-14',
    },
    {
      id: '2',
      installment: 2,
      dueDate: '2024-03-15',
      amount: 1000000,
      status: 'pending',
      paidDate: null,
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'offer',
      title: 'New offer received',
      description: `${formatPKR(5000000)} from John Doe`,
      date: '2024-12-26T14:30:00',
      user: 'Agent Name',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
    },
    {
      id: '2',
      type: 'status',
      title: 'Status updated',
      description: 'Changed from Listed to Negotiation',
      date: '2024-12-25T10:00:00',
      user: 'Agent Name',
      icon: <Edit className="h-5 w-5 text-green-600" />,
    },
  ];

  // ==================== PAGE HEADER ====================
  const pageHeader = {
    title: `Sell Cycle: ${property.address}`,
    breadcrumbs: [
      { label: 'Dashboard', onClick: onBack },
      { label: 'Sell Cycles', onClick: onBack },
      { label: 'Current Cycle' },
    ],
    metrics: [
      {
        label: 'Asking Price',
        value: formatPKR(cycle.askingPrice),
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        label: 'Highest Offer',
        value: formatPKR(highestOffer),
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        label: 'Total Offers',
        value: totalOffers.toString(),
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: 'Days Listed',
        value: daysListed.toString(),
        icon: <Calendar className="h-4 w-4" />,
      },
    ],
    primaryActions: [
      {
        label: 'Record Offer',
        onClick: onRecordOffer,
        variant: 'default' as const,
      },
      {
        label: 'Update Status',
        onClick: onUpdateStatus,
        variant: 'outline' as const,
      },
    ],
    secondaryActions: [
      {
        label: 'Edit Cycle',
        onClick: onEdit,
      },
      {
        label: 'View Property',
        onClick: onViewProperty,
      },
    ],
    status: cycle.status,
    onBack,
  };

  // ==================== CONNECTED ENTITIES ====================
  const connectedEntities = [
    {
      type: 'property' as const,
      name: property.address,
      onClick: onViewProperty,
      icon: <Home className="h-3 w-3" />,
    },
    {
      type: 'seller' as const,
      name: cycle.sellerName,
      onClick: () => {},
      icon: <User className="h-3 w-3" />,
    },
    {
      type: 'agent' as const,
      name: cycle.agentName || 'Assigned Agent',
      onClick: () => {},
      icon: <Briefcase className="h-3 w-3" />,
    },
  ];

  // ==================== OVERVIEW TAB CONTENT ====================
  const overviewContent = (
    <>
      {/* Status Timeline */}
      <StatusTimeline
        steps={[
          {
            label: 'Listed',
            status: 'complete',
            date: cycle.listedDate,
            description: 'Property listed for sale',
          },
          {
            label: 'Offers Received',
            status: totalOffers > 0 ? 'complete' : 'current',
            date: offers[0]?.date,
            description: `${totalOffers} offers received`,
          },
          {
            label: 'Negotiation',
            status: cycle.status === 'negotiation' ? 'current' : 'pending',
          },
          {
            label: 'Under Contract',
            status: cycle.status === 'under-contract' ? 'current' : 'pending',
          },
          {
            label: 'Sold',
            status: cycle.status === 'sold' ? 'complete' : 'pending',
          },
        ]}
      />

      {/* Cycle Information */}
      <InfoPanel
        title="Cycle Information"
        data={[
          { label: 'Status', value: <StatusBadge status={cycle.status} /> },
          { label: 'Asking Price', value: formatPKR(cycle.askingPrice) },
          { label: 'Listed Date', value: cycle.listedDate || 'N/A' },
          { label: 'Days on Market', value: daysListed.toString() },
          { label: 'Total Offers', value: totalOffers.toString() },
          { label: 'Highest Offer', value: formatPKR(highestOffer) },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Property Information */}
      <InfoPanel
        title="Property Information"
        data={[
          { label: 'Address', value: property.address, onClick: onViewProperty },
          { label: 'Type', value: property.propertyType },
          {
            label: 'Area',
            value: `${property.area} ${property.areaUnit || 'sq yd'}`,
          },
          { label: 'Bedrooms', value: property.bedrooms?.toString() || 'N/A' },
          { label: 'Bathrooms', value: property.bathrooms?.toString() || 'N/A' },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Seller & Commission */}
      <InfoPanel
        title="Seller & Commission"
        data={[
          { label: 'Seller Name', value: cycle.sellerName },
          { label: 'Seller Type', value: cycle.sellerType || 'Individual' },
          {
            label: 'Commission %',
            value: `${cycle.commissionPercentage || 2}%`,
          },
          {
            label: 'Commission Amount',
            value: formatPKR((cycle.askingPrice * (cycle.commissionPercentage || 2)) / 100),
          },
        ]}
        columns={2}
        density="comfortable"
      />

      {/* Payment Summary (if applicable) */}
      {payments.length > 0 && (
        <PaymentSummaryPanel
          totalAmount={2000000}
          paidAmount={1000000}
          pendingAmount={1000000}
          nextPayment={{
            amount: 1000000,
            dueDate: '2024-03-15',
            description: 'Installment 2 of 2',
          }}
        />
      )}
    </>
  );

  // ==================== OVERVIEW TAB SIDEBAR ====================
  const overviewSidebar = (
    <>
      {/* Quick Actions */}
      <QuickActionsPanel
        actions={[
          {
            label: 'Record Offer',
            icon: <Plus className="h-4 w-4" />,
            onClick: onRecordOffer,
          },
          {
            label: 'Schedule Showing',
            icon: <Calendar className="h-4 w-4" />,
            onClick: () => {},
          },
          {
            label: 'Update Status',
            icon: <Edit className="h-4 w-4" />,
            onClick: onUpdateStatus,
          },
          {
            label: 'View Property',
            icon: <Home className="h-4 w-4" />,
            onClick: onViewProperty,
          },
        ]}
      />

      {/* Offer Statistics */}
      <MetricCardsGroup
        metrics={[
          {
            label: 'Total Offers',
            value: totalOffers.toString(),
            icon: <FileText className="h-5 w-5" />,
            variant: 'info',
          },
          {
            label: 'Highest Offer',
            value: formatPKR(highestOffer),
            icon: <TrendingUp className="h-5 w-5" />,
            variant: 'success',
            description: `${Math.round((highestOffer / cycle.askingPrice) * 100)}% of asking`,
          },
        ]}
        columns={2}
      />

      {/* Offer Status Breakdown */}
      <SummaryStatsPanel
        title="Offer Status"
        stats={[
          {
            icon: <Clock className="h-4 w-4" />,
            label: 'Pending',
            value: offers.filter((o) => o.status === 'pending').length,
            color: 'yellow',
          },
          {
            icon: <CheckCircle className="h-4 w-4" />,
            label: 'Accepted',
            value: offers.filter((o) => o.status === 'accepted').length,
            color: 'green',
          },
        ]}
      />
    </>
  );

  // ==================== OFFERS TAB ====================
  const offersContent = (
    <>
      <MetricCardsGroup
        metrics={[
          { label: 'Total Offers', value: totalOffers.toString(), variant: 'info' },
          {
            label: 'Pending',
            value: offers.filter((o) => o.status === 'pending').length.toString(),
            variant: 'warning',
          },
          {
            label: 'Accepted',
            value: offers.filter((o) => o.status === 'accepted').length.toString(),
            variant: 'success',
          },
          {
            label: 'Rejected',
            value: offers.filter((o) => o.status === 'rejected').length.toString(),
            variant: 'destructive',
          },
        ]}
        columns={4}
      />

      <DataTable
        title="All Offers"
        headerAction={
          <Button onClick={onRecordOffer}>
            <Plus className="h-4 w-4 mr-2" />
            Record Offer
          </Button>
        }
        columns={[
          { header: 'Date', accessor: 'date' },
          { header: 'Buyer Name', accessor: 'buyerName' },
          {
            header: 'Offer Amount',
            accessor: 'amount',
            render: (row) => formatPKR(row.amount),
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (row) => <StatusBadge status={row.status} size="sm" />,
          },
        ]}
        data={offers}
        onRowClick={(offer) => console.log('View offer', offer)}
        emptyMessage="No offers yet. Record the first offer to get started."
      />
    </>
  );

  // ==================== PAYMENTS TAB ====================
  const paymentsContent = (
    <>
      <MetricCardsGroup
        metrics={[
          {
            label: 'Total Amount',
            value: formatPKR(2000000),
            variant: 'info',
          },
          { label: 'Paid', value: formatPKR(1000000), variant: 'success' },
          { label: 'Pending', value: formatPKR(1000000), variant: 'warning' },
        ]}
        columns={3}
      />

      <DataTable
        title="Payment Schedule"
        columns={[
          { header: 'Installment', accessor: 'installment' },
          { header: 'Due Date', accessor: 'dueDate' },
          {
            header: 'Amount',
            accessor: 'amount',
            render: (row) => formatPKR(row.amount),
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (row) => <StatusBadge status={row.status} size="sm" />,
          },
          { header: 'Paid Date', accessor: 'paidDate', render: (row) => row.paidDate || '-' },
        ]}
        data={payments}
        emptyMessage="No payment schedule available"
      />
    </>
  );

  // ==================== ACTIVITY TAB ====================
  const activityContent = <ActivityTimeline activities={activities} />;

  // ==================== DEFINE TABS ====================
  const tabs: DetailPageTab[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: overviewContent,
      sidebar: overviewSidebar,
      layout: '2-1', // 2/3 + 1/3
    },
    {
      id: 'offers',
      label: 'Offers',
      badge: totalOffers,
      content: offersContent,
      layout: '3-0', // Full width
    },
    {
      id: 'payments',
      label: 'Payments',
      content: paymentsContent,
      layout: '3-0', // Full width
    },
    {
      id: 'activity',
      label: 'Activity',
      content: activityContent,
      layout: '3-0', // Full width
    },
  ];

  // ==================== RENDER ====================
  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      connectedEntities={connectedEntities}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
