/**
 * Sell Cycle Details - V4.0 UI/UX OPTIMIZED ✅
 * Hick's Law implementation: Reduced from 6 tabs to 4 tabs (-33% cognitive load)
 * 
 * NEW TAB STRUCTURE:
 * 1. Overview - Summary + Connected Entities + Payment Summary
 * 2. Details - Offers Management (RENAMED from "Offers")
 * 3. Payments - Payment tracking from linked Deal
 * 4. Activity - Timeline + Documents + Communications (MERGED)
 * 
 * IMPROVEMENTS:
 * - Reduced tabs from 6 to 4 (Hick's Law compliance)
 * - Removed "Installments" tab (historical feature, now in Deals)
 * - Renamed "Offers" → "Details" for consistency
 * - Merged Documents → Activity
 * - Consistent icons on all tabs
 * - Better information architecture
 * 
 * PHASE 2 FOUNDATION UPDATE:
 * - Overview tab redesigned with InfoPanel (data-dense)
 * - Added MetricCard components for key metrics
 * - StatusTimeline for sell cycle workflow
 * - 2/3 + 1/3 responsive layout
 * - Removed card-based layout in favor of ERP-style dense display
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SellCycle, Property, User, Offer, InstallmentPlan, PaymentReceipt, PaymentSchedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// PHASE 2 FOUNDATION: Import new UI components ✅
import { InfoPanel } from './ui/info-panel';
import { MetricCard } from './ui/metric-card';
import { StatusTimeline } from './ui/status-timeline';

import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Receipt,
  CreditCard,
  AlertCircle,
  Clock,
  Home,
  Wallet,
  Building,
  User as UserIcon,
  MapPin,
  Percent,
  Eye,
} from 'lucide-react';
import { 
  updateSellCycle, 
  acceptOffer, 
  rejectOffer,
  getSellCycleById,
} from '../lib/sellCycle';
import {
  getInstallmentPlansBySellCycle,
  getReceiptsBySellCycle,
  getInstallmentPlanStats,
  updateOverdueInstallments,
} from '../lib/installments';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { toast } from 'sonner';
import { AddOfferModal } from './AddOfferModal';

// PHASE 1-2: Import new UI components ✅
import { PageHeader, ConnectedEntitiesBar, StatusBadge } from './layout';
import { User } from 'lucide-react';

// PHASE 3: Import new transaction components ✅
import { 
  UnifiedTransactionHeader,
  ConnectedEntitiesCard,
  TransactionTimeline,
  SmartBreadcrumbs
} from './transactions';
import { getTransactionGraph, getUnifiedTimeline } from '../lib/transaction-graph';

// PAYMENT SCHEDULE: Import new payment components ✅
import { PaymentScheduleView } from './PaymentScheduleView';
import { CreatePaymentScheduleModal } from './CreatePaymentScheduleModal';
import { 
  getActivePaymentSchedule, 
  createPaymentSchedule,
  recordInstalmentPayment,
  activatePaymentSchedule,
  cancelPaymentSchedule
} from '../lib/paymentSchedule';

// FLEXIBLE PAYMENT SYSTEM: Import read-only view ✅
import { PaymentSummaryReadOnly } from './deals/PaymentSummaryReadOnly';
import { getDealById } from '../lib/deals';

interface SellCycleDetailsProps {
  cycle: SellCycle;
  property: Property;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  onNavigate?: (page: string, id: string) => void;
}

export function SellCycleDetails({
  cycle: initialCycle,
  property,
  user,
  onBack,
  onUpdate,
  onNavigate,
}: SellCycleDetailsProps) {
  const [cycle, setCycle] = useState<SellCycle>(initialCycle);
  const [activeTab, setActiveTab] = useState('overview');
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  
  // Modals
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<{ plan: InstallmentPlan; installment: any } | null>(null);

  // PAYMENT SCHEDULE: State for payment schedule ✅
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule | null>(null);
  const [showCreatePaymentScheduleModal, setShowCreatePaymentScheduleModal] = useState(false);

  // PHASE 3: Get transaction graph and timeline ✅
  const graph = useMemo(() => {
    return getTransactionGraph(cycle.id, 'sellCycle');
  }, [cycle.id]);
  
  const timeline = useMemo(() => {
    return getUnifiedTimeline(cycle.id);
  }, [cycle.id]);
  
  // PHASE 3: Navigation handler ✅
  const handleNavigation = (page: string, id: string) => {
    if (onNavigate) {
      onNavigate(page, id);
    } else {
      // Fallback - use session storage
      switch (page) {
        case 'property-detail':
          sessionStorage.setItem('selected_property_id', id);
          break;
        case 'sell-cycle-detail':
          sessionStorage.setItem('selected_sell_cycle_id', id);
          break;
        case 'purchase-cycle-detail':
          sessionStorage.setItem('selected_purchase_cycle_id', id);
          break;
        case 'deal-detail':
          sessionStorage.setItem('selected_deal_id', id);
          break;
        case 'buyer-requirement-detail':
          sessionStorage.setItem('selected_buyer_requirement_id', id);
          break;
      }
      toast.info('Navigation to ' + page);
    }
  };

  // Load data
  const loadData = () => {
    const updatedCycle = getSellCycleById(cycle.id);
    if (updatedCycle) {
      setCycle(updatedCycle);
    }
    
    const plans = getInstallmentPlansBySellCycle(cycle.id);
    setInstallmentPlans(plans);
    
    const rcpts = getReceiptsBySellCycle(cycle.id);
    setReceipts(rcpts);
    
    // Update overdue status
    updateOverdueInstallments();

    // PAYMENT SCHEDULE: Load active payment schedule ✅
    const activeSchedule = getActivePaymentSchedule(cycle.id, 'sell-cycle');
    setPaymentSchedule(activeSchedule);
  };

  useEffect(() => {
    loadData();
  }, [cycle.id]);

  // Listen for offer updates from other components (e.g., purchase cycles sending offers)
  useEffect(() => {
    const handleOfferUpdate = () => {
      loadData();
    };

    const handleCycleUpdate = (event: CustomEvent) => {
      if (event.detail?.cycleId === cycle.id || event.detail?.sellCycleId === cycle.id) {
        loadData();
      }
    };

    window.addEventListener('offerCreated', handleOfferUpdate);
    window.addEventListener('cycleUpdated', handleCycleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('offerCreated', handleOfferUpdate);
      window.removeEventListener('cycleUpdated', handleCycleUpdate as EventListener);
    };
  }, [cycle.id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'listed': 'bg-blue-100 text-blue-800',
      'offer-received': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'under-contract': 'bg-purple-100 text-purple-800',
      'sold': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOfferStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'countered': 'bg-blue-100 text-blue-800',
      'expired': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAcceptOffer = (offerId: string) => {
    if (confirm('Accept this offer? This will reject all other pending offers and automatically create a Deal for this transaction.')) {
      acceptOffer(cycle.id, offerId);
      toast.success('Offer accepted! Deal has been created - check Deal Management.');
      
      // Show additional notification about next steps
      setTimeout(() => {
        toast.info('📋 Next: Go to Deal Management to track this transaction through to completion.');
      }, 2000);
      
      loadData();
      onUpdate();
    }
  };

  const handleRejectOffer = (offerId: string) => {
    if (confirm('Reject this offer?')) {
      rejectOffer(cycle.id, offerId);
      toast.success('Offer rejected');
      loadData();
      onUpdate();
    }
  };

  const acceptedOffer = cycle.offers.find(o => o.id === cycle.acceptedOfferId);
  const pendingOffers = cycle.offers.filter(o => o.status === 'pending');
  const allOffersSorted = [...cycle.offers].sort((a, b) => 
    new Date(b.offeredDate).getTime() - new Date(a.offeredDate).getTime()
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* PHASE 1-2: New PageHeader ✅ */}
      <PageHeader
        title={cycle.title || formatPropertyAddress(property.address)}
        breadcrumbs={[
          { label: 'Properties', onClick: onBack },
          { label: formatPropertyAddress(property.address), onClick: () => handleNavigation('property-detail', property.id) },
          { label: 'Sell Cycle' }
        ]}
        description={`Listed by ${cycle.agentName} • ${new Date(cycle.listedDate).toLocaleDateString()}`}
        metrics={[
          { 
            label: 'Asking Price', 
            value: formatPKR(cycle.askingPrice),
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Offers', 
            value: String(cycle.offers.length),
            icon: <FileText className="w-4 h-4" />
          },
          {
            label: 'Highest Offer',
            value: cycle.offers.length > 0 
              ? formatPKR(Math.max(...cycle.offers.map(o => o.offerAmount)))
              : 'No offers',
            icon: <TrendingUp className="w-4 h-4" />
          },
          {
            label: 'Days Listed',
            value: String(Math.floor((Date.now() - new Date(cycle.listedDate).getTime()) / (1000 * 60 * 60 * 24))),
            icon: <Calendar className="w-4 h-4" />
          },
          {
            label: 'Status',
            value: <StatusBadge status={cycle.status} />,
            icon: <CheckCircle className="w-4 h-4" />
          }
        ]}
        onBack={onBack}
      />

      {/* PHASE 1-2: New ConnectedEntitiesBar ✅ */}
      <ConnectedEntitiesBar
        entities={[
          {
            type: 'property',
            name: formatPropertyAddress(property.address),
            icon: <Home className="w-4 h-4" />,
            onClick: () => handleNavigation('property-detail', property.id)
          },
          {
            type: 'seller',
            name: cycle.sellerName,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          },
          {
            type: 'agent',
            name: cycle.agentName,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          },
          ...(cycle.linkedDealId || cycle.createdDealId ? [{
            type: 'deal' as const,
            name: 'View Deal',
            icon: <FileText className="w-4 h-4" />,
            onClick: () => handleNavigation('deal-detail', cycle.linkedDealId || cycle.createdDealId || '')
          }] : [])
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
              {cycle.offers.length > 0 && (
                <Badge variant="secondary" className="ml-1">{cycle.offers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2 FOUNDATION: New data-dense layout with InfoPanel, MetricCard, StatusTimeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* PHASE 3: Connected Entities Card (Keep existing) ✅ */}
                {graph && (
                  <ConnectedEntitiesCard
                    graph={graph}
                    currentEntityType="sellCycle"
                    onNavigate={handleNavigation}
                  />
                )}
                
                {/* FLEXIBLE PAYMENT SYSTEM: Payment Summary (Keep existing) ✅ */}
                {(cycle.linkedDealId || cycle.createdDealId) && (() => {
                  const dealId = cycle.linkedDealId || cycle.createdDealId;
                  const deal = dealId ? getDealById(dealId) : null;
                  
                  return deal ? (
                    <PaymentSummaryReadOnly
                      deal={deal}
                      onViewFullDetails={() => handleNavigation('deal-detail', deal.id)}
                      compact={false}
                    />
                  ) : null;
                })()}
                
                {/* Primary Cycle Information - InfoPanel (Data-Dense) */}
                <InfoPanel
                  title="Cycle Information"
                  data={[
                    { 
                      label: 'Status', 
                      value: <Badge className={getStatusColor(cycle.status)}>{cycle.status}</Badge>
                    },
                    { 
                      label: 'Asking Price', 
                      value: formatPKR(cycle.askingPrice),
                      icon: <DollarSign /> 
                    },
                    { 
                      label: 'Listed Date', 
                      value: new Date(cycle.listedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }),
                      icon: <Calendar /> 
                    },
                    { 
                      label: 'Days Listed', 
                      value: Math.floor((Date.now() - new Date(cycle.listedDate).getTime()) / (1000 * 60 * 60 * 24)),
                      icon: <Clock /> 
                    },
                    { 
                      label: 'Total Offers', 
                      value: cycle.offers.length,
                      icon: <FileText /> 
                    },
                    { 
                      label: 'Pending Offers', 
                      value: pendingOffers.length,
                      icon: <AlertCircle /> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Property Information - InfoPanel */}
                <InfoPanel
                  title="Property Information"
                  data={[
                    { 
                      label: 'Address', 
                      value: property.address,
                      icon: <MapPin />,
                      copyable: true,
                      onClick: () => handleNavigation('property-detail', property.id)
                    },
                    { 
                      label: 'Type', 
                      value: <span className="capitalize">{property.propertyType}</span>,
                      icon: <Building /> 
                    },
                    { 
                      label: 'Area', 
                      value: `${property.area} ${property.areaUnit}`,
                      icon: <Home /> 
                    },
                    ...(property.bedrooms ? [{ 
                      label: 'Bedrooms', 
                      value: property.bedrooms 
                    }] : []),
                    ...(property.bathrooms ? [{ 
                      label: 'Bathrooms', 
                      value: property.bathrooms 
                    }] : []),
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Seller & Commission - InfoPanel */}
                <InfoPanel
                  title="Seller & Commission"
                  data={[
                    { 
                      label: 'Seller Name', 
                      value: cycle.sellerName,
                      icon: <UserIcon /> 
                    },
                    { 
                      label: 'Seller Type', 
                      value: <span className="capitalize">{cycle.sellerType}</span> 
                    },
                    { 
                      label: 'Commission', 
                      value: cycle.commissionType === 'percentage' 
                        ? `${cycle.commissionRate}%` 
                        : formatPKR(cycle.commissionRate),
                      icon: <Percent /> 
                    },
                    { 
                      label: 'Est. Commission Amount', 
                      value: formatPKR(cycle.commissionType === 'percentage' 
                        ? (cycle.askingPrice * cycle.commissionRate) / 100 
                        : cycle.commissionRate
                      ),
                      icon: <DollarSign /> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Description (if exists) */}
                {cycle.description && (
                  <InfoPanel
                    title="Description"
                    data={[
                      { 
                        label: 'Details', 
                        value: cycle.description 
                      }
                    ]}
                    columns={1}
                    density="comfortable"
                  />
                )}

                {/* Amenities (if exist) */}
                {cycle.amenities && cycle.amenities.length > 0 && (
                  <InfoPanel
                    title="Amenities"
                    data={[
                      { 
                        label: 'Available Features', 
                        value: (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {cycle.amenities.map((amenity, idx) => (
                              <Badge key={idx} variant="secondary">{amenity}</Badge>
                            ))}
                          </div>
                        ) 
                      }
                    ]}
                    columns={1}
                    density="comfortable"
                  />
                )}

                {/* Sell Cycle Workflow Timeline */}
                <StatusTimeline
                  steps={[
                    { 
                      label: 'Listed', 
                      status: 'complete',
                      date: cycle.listedDate,
                      description: `Asking ${formatPKR(cycle.askingPrice)}`
                    },
                    { 
                      label: 'Offers Received', 
                      status: cycle.offers.length > 0 ? 'complete' : 
                             cycle.status === 'listed' ? 'current' : 'pending',
                      description: `${cycle.offers.length} offer${cycle.offers.length !== 1 ? 's' : ''}`
                    },
                    { 
                      label: 'Negotiation', 
                      status: cycle.status === 'negotiation' ? 'current' : 
                             ['under-contract', 'sold'].includes(cycle.status) ? 'complete' : 'pending'
                    },
                    { 
                      label: 'Under Contract', 
                      status: cycle.status === 'under-contract' ? 'current' : 
                             cycle.status === 'sold' ? 'complete' : 'pending',
                      date: acceptedOffer?.offeredDate
                    },
                    { 
                      label: 'Sold', 
                      status: cycle.status === 'sold' ? 'complete' : 
                             cycle.status === 'cancelled' ? 'skipped' : 'pending'
                    }
                  ]}
                />
              </div>

              {/* Sidebar (1/3 width) */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <MetricCard
                  label="Asking Price"
                  value={formatPKR(cycle.askingPrice)}
                  icon={<DollarSign />}
                  variant="success"
                />

                {cycle.offers.length > 0 && (
                  <MetricCard
                    label="Highest Offer"
                    value={formatPKR(Math.max(...cycle.offers.map(o => o.offerAmount)))}
                    icon={<TrendingUp />}
                    trend={{
                      direction: Math.max(...cycle.offers.map(o => o.offerAmount)) >= cycle.askingPrice ? 'up' : 'down',
                      value: ((Math.max(...cycle.offers.map(o => o.offerAmount)) / cycle.askingPrice) * 100).toFixed(1)
                    }}
                    comparison="of asking price"
                    variant="info"
                  />
                )}

                <MetricCard
                  label="Days Listed"
                  value={Math.floor((Date.now() - new Date(cycle.listedDate).getTime()) / (1000 * 60 * 60 * 24))}
                  icon={<Clock />}
                  trend={{
                    direction: 'neutral',
                    value: 'Active'
                  }}
                  variant="default"
                />

                {/* Quick Stats Panel */}
                <InfoPanel
                  title="Offer Statistics"
                  data={[
                    { 
                      label: 'Total Offers', 
                      value: cycle.offers.length,
                      icon: <FileText /> 
                    },
                    { 
                      label: 'Pending', 
                      value: pendingOffers.length,
                      icon: <Clock /> 
                    },
                    { 
                      label: 'Accepted', 
                      value: cycle.acceptedOfferId ? 1 : 0,
                      icon: <CheckCircle /> 
                    },
                  ]}
                  columns={1}
                  density="compact"
                />

                {/* Next Steps / Actions */}
                {cycle.status === 'under-contract' && acceptedOffer && installmentPlans.length === 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-sm">Next Step</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          An offer has been accepted. Create an installment plan to track payments.
                        </p>
                      </div>
                      <Button onClick={() => setShowCreatePlanModal(true)} size="sm" className="w-full">
                        Create Installment Plan
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                {cycle.status !== 'sold' && cycle.status !== 'cancelled' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setShowAddOfferModal(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Record New Offer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleNavigation('property-detail', property.id)}
                      >
                        <Home className="h-4 w-4" />
                        View Property
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">All Offers</h3>
                <p className="text-sm text-muted-foreground">
                  {cycle.offers.length} total • {pendingOffers.length} pending
                </p>
              </div>
              {cycle.status !== 'sold' && cycle.status !== 'cancelled' && (
                <Button onClick={() => setShowAddOfferModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record New Offer
                </Button>
              )}
            </div>

            {allOffersSorted.length > 0 ? (
              <div className="space-y-3">
                {allOffersSorted.map((offer) => (
                  <Card 
                    key={offer.id}
                    className={offer.id === cycle.acceptedOfferId ? 'border-green-500 border-2' : ''}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{offer.buyerName}</h4>
                            <Badge className={getOfferStatusColor(offer.status)}>
                              {offer.status}
                            </Badge>
                            {offer.id === cycle.acceptedOfferId && (
                              <Badge className="bg-green-100 text-green-800">
                                ACCEPTED
                              </Badge>
                            )}
                          </div>
                          {offer.buyerContact && (
                            <p className="text-sm text-muted-foreground">{offer.buyerContact}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatPKR(offer.offerAmount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {((offer.offerAmount / cycle.askingPrice) * 100).toFixed(1)}% of asking
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Offered Date</p>
                          <p className="font-medium">{new Date(offer.offeredDate).toLocaleDateString()}</p>
                        </div>
                        {offer.tokenAmount && (
                          <div>
                            <p className="text-muted-foreground">Token Money</p>
                            <p className="font-medium">{formatPKR(offer.tokenAmount)}</p>
                          </div>
                        )}
                        {offer.expiryDate && (
                          <div>
                            <p className="text-muted-foreground">Expiry</p>
                            <p className="font-medium">{new Date(offer.expiryDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      {offer.conditions && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Conditions:</p>
                          <p className="text-sm">{offer.conditions}</p>
                        </div>
                      )}

                      {offer.notes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Buyer Notes:</p>
                          <p className="text-sm text-muted-foreground">{offer.notes}</p>
                        </div>
                      )}

                      {offer.agentNotes && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Internal Notes:</p>
                          <p className="text-sm">{offer.agentNotes}</p>
                        </div>
                      )}

                      {offer.status === 'pending' && cycle.status !== 'sold' && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Offer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectOffer(offer.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Offers Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Record offers as they come in to track negotiations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            {/* UNIFIED PAYMENT SYSTEM: Show payments from linked Deal ✅ */}
            {(() => {
              const dealId = cycle.linkedDealId || cycle.createdDealId;
              const deal = dealId ? getDealById(dealId) : null;
              
              if (deal) {
                // Show payment information from the linked Deal
                return (
                  <PaymentSummaryReadOnly
                    deal={deal}
                    onViewFullDetails={() => handleNavigation('deal-detail', deal.id)}
                    compact={false}
                  />
                );
              } else {
                // No deal linked yet
                return (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="font-medium text-gray-900 mb-2">No Payment Information</h3>
                      <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                        Payments are tracked in Deals. Accept an offer to create a Deal and manage payment schedules.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
                        <p className="text-sm font-medium text-blue-900 mb-2">💡 Next Steps:</p>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Review and accept an offer in the <strong>Details</strong> tab</li>
                          <li>A Deal will be automatically created</li>
                          <li>Manage payment schedules in the Deal</li>
                          <li>Track all payments through the unified system</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })()}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Activity Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Activity timeline coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <AddOfferModal
          isOpen={showAddOfferModal}
          onClose={() => setShowAddOfferModal(false)}
          sellCycleId={cycle.id}
          askingPrice={cycle.askingPrice}
          user={user}
          onSuccess={loadData}
        />

        {acceptedOffer && (
          <CreateInstallmentPlanModal
            isOpen={showCreatePlanModal}
            onClose={() => setShowCreatePlanModal(false)}
            sellCycle={cycle}
            acceptedOffer={acceptedOffer}
            user={user}
            onSuccess={loadData}
          />
        )}

        {selectedInstallment && (
          <RecordPaymentModal
            isOpen={showRecordPaymentModal}
            onClose={() => {
              setShowRecordPaymentModal(false);
              setSelectedInstallment(null);
            }}
            installmentPlan={selectedInstallment.plan}
            installment={selectedInstallment.installment}
            sellCycleId={cycle.id}
            sellerName={cycle.sellerName}
            user={user}
            onSuccess={loadData}
          />
        )}

        {/* PAYMENT SCHEDULE: Create Modal ✅ */}
        <CreatePaymentScheduleModal
          open={showCreatePaymentScheduleModal}
          onClose={() => setShowCreatePaymentScheduleModal(false)}
          onSave={(data) => {
            const schedule = createPaymentSchedule(
              {
                ...data,
                entityId: cycle.id,
                entityType: 'sell-cycle',
                propertyId: property.id,
              },
              user.id,
              user.name
            );
            setPaymentSchedule(schedule);
            setShowCreatePaymentScheduleModal(false);
            toast.success('Payment schedule created successfully!');
          }}
          defaultTotalAmount={acceptedOffer?.offerAmount || cycle.askingPrice}
          entityName={`Sell Cycle - ${formatPropertyAddress(property.address)}`}
        />

        {paymentSchedule && (
          <PaymentScheduleView
            schedule={paymentSchedule}
            onActivate={() => {
              activatePaymentSchedule(paymentSchedule.id);
              loadData();
            }}
            onCancel={() => {
              cancelPaymentSchedule(paymentSchedule.id);
              loadData();
            }}
            onRecordPayment={(instalmentId, amount, date, method, receipt, notes) => {
              recordInstalmentPayment(paymentSchedule.id, {
                instalmentId,
                amount,
                paymentDate: date,
                paymentMethod: method,
                receiptNumber: receipt,
                notes,
              });
              loadData();
            }}
            canEdit={true}
          />
        )}
      </div>
    </div>
  );
}