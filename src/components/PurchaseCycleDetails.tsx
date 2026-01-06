/**
 * Purchase Cycle Details - V4.0 UI/UX OPTIMIZED ✅
 * Hick's Law implementation: Reduced from 7 tabs to 5 tabs (-29% cognitive load)
 * 
 * NEW TAB STRUCTURE:
 * 1. Overview - Summary + Connected Entities + Key Metrics
 * 2. Details - Seller Info + Property Info + Due Diligence + Financing (MERGED)
 * 3. Payments - Payment tracking from linked Deal
 * 4. Activity - Communications + Timeline (MERGED)
 * 5. Actions - Status updates + Workflows
 * 
 * IMPROVEMENTS:
 * - Reduced tabs from 7 to 5 (Hick's Law compliance)
 * - Merged related info: Seller + DD + Financing → Details
 * - Merged communications → Activity
 * - Consistent icons on all tabs
 * - Better information architecture
 * 
 * PHASE 2 FOUNDATION UPDATE:
 * - Overview tab redesigned with InfoPanel (data-dense)
 * - Added MetricCard components for key metrics
 * - StatusTimeline for purchase cycle workflow
 * - 2/3 + 1/3 responsive layout
 * - Removed card-based layout in favor of ERP-style dense display
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PurchaseCycle, Property, User, SellCycle, PaymentSchedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';

// PHASE 2 FOUNDATION: Import new UI components ✅
import { InfoPanel } from './ui/info-panel';
import { MetricCard } from './ui/metric-card';
import { StatusTimeline } from './ui/status-timeline';

import {
  ArrowLeft,
  TrendingDown,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  AlertCircle,
  Clock,
  Home,
  Building,
  User as UserIcon,
  Phone,
  FileCheck,
  Search,
  Landmark,
  ClipboardCheck,
  MessageSquare,
  Wallet,
  Settings,
  Activity,
} from 'lucide-react';
import { 
  updatePurchaseCycle,
  completePurchase,
  cancelPurchaseCycle,
  getPurchaseCycleById,
  addCommunicationLog,
  getAgencyInvestmentROI,
} from '../lib/purchaseCycle';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

// PHASE 1-2: Import new UI components ✅
import { PageHeader, ConnectedEntitiesBar, StatusBadge } from './layout';

// PHASE 3: Import new transaction components ✅
import { 
  UnifiedTransactionHeader,
  ConnectedEntitiesCard,
  TransactionTimeline,
  SmartBreadcrumbs
} from './transactions';
import { getTransactionGraph, getUnifiedTimeline } from '../lib/transaction-graph';

// PAYMENT SCHEDULE: State management ✅
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

// OFFER SENDING: Import modal for sending offers to sell cycles ✅
import { SendOfferFromPurchaseCycleModal } from './SendOfferFromPurchaseCycleModal';
import { getSellCyclesByProperty } from '../lib/sellCycle';

interface PurchaseCycleDetailsProps {
  cycle: PurchaseCycle;
  property: Property;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  onNavigate?: (page: string, id: string) => void;
}

export function PurchaseCycleDetails({
  cycle: initialCycle,
  property,
  user,
  onBack,
  onUpdate,
  onNavigate,
}: PurchaseCycleDetailsProps) {
  const [cycle, setCycle] = useState<PurchaseCycle>(initialCycle);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingNegotiatedPrice, setEditingNegotiatedPrice] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState(cycle.negotiatedPrice || cycle.offerAmount);
  const [showCompletePurchase, setShowCompletePurchase] = useState(false);
  const [finalPrice, setFinalPrice] = useState(cycle.negotiatedPrice || cycle.offerAmount);
  
  // Communication log
  const [showAddLog, setShowAddLog] = useState(false);
  const [logType, setLogType] = useState<'call' | 'email' | 'meeting' | 'note'>('note');
  const [logSummary, setLogSummary] = useState('');

  // PAYMENT SCHEDULE: State management ✅
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule | null>(null);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  
  // OFFER SENDING: State management for sending offers to sell cycles ✅
  const [showSendOfferModal, setShowSendOfferModal] = useState(false);
  const [availableSellCycles, setAvailableSellCycles] = useState<SellCycle[]>([]);
  const [selectedSellCycle, setSelectedSellCycle] = useState<SellCycle | null>(null);
  
  // PHASE 3: Get transaction graph and timeline ✅
  const graph = useMemo(() => {
    return getTransactionGraph(cycle.id, 'purchaseCycle');
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
    const updatedCycle = getPurchaseCycleById(cycle.id);
    if (updatedCycle) {
      setCycle(updatedCycle);
    }
  };

  useEffect(() => {
    loadData();
  }, [cycle.id]);

  // PAYMENT SCHEDULE: Load schedule when component mounts ✅
  useEffect(() => {
    const schedule = getActivePaymentSchedule(cycle.id, 'purchase-cycle');
    setPaymentSchedule(schedule);
  }, [cycle.id]);
  
  // OFFER SENDING: Load available sell cycles for this property ✅
  useEffect(() => {
    const sellCycles = getSellCyclesByProperty(property.id);
    // Filter to only active/listed sell cycles
    const activeSellCycles = sellCycles.filter(sc => 
      sc.status === 'listed' || sc.status === 'offer-received' || sc.status === 'negotiation'
    );
    setAvailableSellCycles(activeSellCycles);
  }, [property.id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'prospecting': 'bg-gray-100 text-gray-800',
      'offer-made': 'bg-blue-100 text-blue-800',
      'negotiation': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'due-diligence': 'bg-purple-100 text-purple-800',
      'financing': 'bg-orange-100 text-orange-800',
      'closing': 'bg-indigo-100 text-indigo-800',
      'acquired': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateStatus = (newStatus: PurchaseCycle['status']) => {
    // Special handling for "accepted" status - this creates a deal!
    if (newStatus === 'accepted') {
      if (!confirm('Accept this purchase offer?\n\nThis will:\n1. Mark the offer as accepted\n2. Automatically create a Deal to track the transaction\n3. Update the purchase cycle status\n\nProceed?')) {
        return;
      }
      
      // Call markPurchaseCycleOfferAccepted which will also create the deal
      const { markPurchaseCycleOfferAccepted } = require('../lib/purchaseCycle');
      markPurchaseCycleOfferAccepted(cycle.id, cycle.negotiatedPrice || cycle.offerAmount);
      
      toast.success('Offer accepted! Deal has been created - check Deal Management.');
      
      // Show additional notification about next steps
      setTimeout(() => {
        toast.info('📋 Next: Go to Deal Management to track this transaction through to completion.');
      }, 2000);
      
      loadData();
      onUpdate();
      return;
    }
    
    // Regular status update for other statuses
    updatePurchaseCycle(cycle.id, { status: newStatus });
    toast.success('Purchase cycle status updated');
    loadData();
    onUpdate();
  };

  const handleUpdateDueDiligence = (field: keyof PurchaseCycle, value: boolean) => {
    updatePurchaseCycle(cycle.id, { [field]: value });
    toast.success('Due diligence updated');
    loadData();
  };

  const handleSaveNegotiatedPrice = () => {
    updatePurchaseCycle(cycle.id, { negotiatedPrice });
    toast.success('Negotiated price updated');
    setEditingNegotiatedPrice(false);
    loadData();
  };

  const handleAddCommunicationLog = () => {
    if (!logSummary.trim()) {
      toast.error('Please enter log details');
      return;
    }
    
    addCommunicationLog(cycle.id, logType, logSummary, user.name);
    toast.success('Communication log added');
    setLogSummary('');
    setShowAddLog(false);
    loadData();
  };

  const handleCompletePurchase = () => {
    const result = completePurchase(cycle.id, finalPrice);
    if (result.success) {
      toast.success('Purchase completed! Property ownership transferred.');
      loadData();
      onUpdate();
      setTimeout(() => onBack(), 1500);
    } else {
      toast.error(result.error || 'Failed to complete purchase');
    }
  };

  const handleCancelCycle = () => {
    if (confirm('Are you sure you want to cancel this purchase cycle?')) {
      cancelPurchaseCycle(cycle.id, 'Cancelled by user');
      toast.success('Purchase cycle cancelled');
      onUpdate();
      onBack();
    }
  };

  const roi = cycle.purchaserType === 'agency' ? getAgencyInvestmentROI(cycle.id) : null;
  const dueDiligenceProgress = [
    cycle.titleClear,
    cycle.inspectionDone,
    cycle.documentsVerified,
    cycle.surveyCompleted,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 1-2: New PageHeader ✅ */}
      <PageHeader
        title={`Purchase Cycle: ${property.address}`}
        breadcrumbs={[
          { label: 'Purchase Cycles', onClick: onBack },
          { label: property.address, onClick: () => handleNavigation('property-detail', property.id) },
          { label: 'Purchase Cycle' }
        ]}
        description={`${cycle.purchaserType.charAt(0).toUpperCase() + cycle.purchaserType.slice(1)} Purchase • Created ${new Date(cycle.createdAt).toLocaleDateString()}`}
        metrics={[
          { 
            label: 'Asking Price', 
            value: formatPKR(cycle.askingPrice),
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Offer Amount', 
            value: formatPKR(cycle.offerAmount),
            icon: <TrendingDown className="w-4 h-4" />
          },
          {
            label: 'Negotiated',
            value: cycle.negotiatedPrice ? formatPKR(cycle.negotiatedPrice) : 'Pending',
            icon: <CheckCircle className="w-4 h-4" />
          },
          {
            label: 'Due Diligence',
            value: `${dueDiligenceProgress}/4`,
            icon: <FileCheck className="w-4 h-4" />
          },
          {
            label: 'Status',
            value: <StatusBadge status={cycle.status} />,
            icon: <Settings className="w-4 h-4" />
          }
        ]}
        onBack={onBack}
      />

      {/* PHASE 1-2: New ConnectedEntitiesBar ✅ */}
      <ConnectedEntitiesBar
        entities={[
          {
            type: 'property',
            name: property.address,
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
            type: 'purchaser',
            name: cycle.purchaserName,
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="details">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="payment">
              <Wallet className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Settings className="h-4 w-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* PHASE 2 FOUNDATION: New data-dense layout with InfoPanel, MetricCard, StatusTimeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* PHASE 3: Connected Entities Card (Keep existing) ✅ */}
                {graph && (
                  <ConnectedEntitiesCard
                    graph={graph}
                    currentEntityType="purchaseCycle"
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
                
                {/* Purchase Cycle Information - InfoPanel (Data-Dense) */}
                <InfoPanel
                  title="Purchase Information"
                  data={[
                    { 
                      label: 'Status', 
                      value: <Badge className={getStatusColor(cycle.status)}>{cycle.status}</Badge>
                    },
                    { 
                      label: 'Purchaser Type', 
                      value: <span className="capitalize">{cycle.purchaserType}</span>,
                      icon: <UserIcon className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Purchaser Name', 
                      value: cycle.purchaserName,
                      icon: <UserIcon className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Agent', 
                      value: cycle.agentName,
                      icon: <UserIcon className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Offer Date', 
                      value: cycle.offerDate ? new Date(cycle.offerDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A',
                      icon: <Calendar className="w-4 h-4" /> 
                    },
                    ...(cycle.targetCloseDate ? [{ 
                      label: 'Target Close Date', 
                      value: new Date(cycle.targetCloseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }),
                      icon: <Calendar className="w-4 h-4" /> 
                    }] : []),
                    ...(cycle.actualCloseDate ? [{ 
                      label: 'Actual Close Date', 
                      value: new Date(cycle.actualCloseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }),
                      icon: <CheckCircle className="w-4 h-4" /> 
                    }] : []),
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Pricing Information - InfoPanel */}
                <InfoPanel
                  title="Pricing"
                  data={[
                    { 
                      label: 'Asking Price', 
                      value: formatPKR(cycle.askingPrice),
                      icon: <DollarSign className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Offer Amount', 
                      value: formatPKR(cycle.offerAmount),
                      icon: <TrendingDown className="w-4 h-4" /> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />
                
                {/* Editable Negotiated Price Section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Negotiated Price</Label>
                      {!editingNegotiatedPrice && cycle.status !== 'acquired' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNegotiatedPrice(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    {editingNegotiatedPrice ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={negotiatedPrice}
                          onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
                          placeholder="Enter negotiated price"
                        />
                        <Button onClick={handleSaveNegotiatedPrice}>Save</Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingNegotiatedPrice(false);
                            setNegotiatedPrice(cycle.negotiatedPrice || cycle.offerAmount);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="text-lg font-medium">
                        {cycle.negotiatedPrice ? formatPKR(cycle.negotiatedPrice) : formatPKR(cycle.offerAmount)}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Agency Investment ROI (if applicable) */}
                {cycle.purchaserType === 'agency' && roi && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Investment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Investment</p>
                          <p className="font-medium">{formatPKR(roi.invested)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Return</p>
                          <p className="font-medium">{formatPKR(roi.expectedReturn)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected ROI</p>
                          <p className={`font-medium ${roi.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {roi.roi.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {cycle.purpose && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">Purpose: <span className="font-medium capitalize">{cycle.purpose}</span></p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Notes (if exist) */}
                {cycle.notes && (
                  <InfoPanel
                    title="Notes"
                    data={[
                      { 
                        label: 'Details', 
                        value: cycle.notes 
                      }
                    ]}
                    columns={1}
                    density="comfortable"
                    showDivider={false}
                  />
                )}

                {/* Purchase Cycle Workflow Timeline */}
                <StatusTimeline
                  steps={[
                    { 
                      label: 'Prospecting', 
                      status: 'complete',
                      date: cycle.createdAt,
                      description: 'Property identified'
                    },
                    { 
                      label: 'Offer Made', 
                      status: ['offer-made', 'negotiation', 'accepted', 'due-diligence', 'financing', 'closing', 'acquired'].includes(cycle.status) ? 'complete' : 'pending',
                      date: cycle.offerDate,
                      description: formatPKR(cycle.offerAmount)
                    },
                    { 
                      label: 'Negotiation', 
                      status: cycle.status === 'negotiation' ? 'current' : 
                             ['accepted', 'due-diligence', 'financing', 'closing', 'acquired'].includes(cycle.status) ? 'complete' : 'pending',
                      description: cycle.negotiatedPrice ? formatPKR(cycle.negotiatedPrice) : undefined
                    },
                    { 
                      label: 'Accepted', 
                      status: cycle.status === 'accepted' ? 'current' : 
                             ['due-diligence', 'financing', 'closing', 'acquired'].includes(cycle.status) ? 'complete' : 'pending'
                    },
                    { 
                      label: 'Due Diligence', 
                      status: cycle.status === 'due-diligence' ? 'current' : 
                             ['financing', 'closing', 'acquired'].includes(cycle.status) ? 'complete' : 'pending',
                      description: `${dueDiligenceProgress}/4 complete`
                    },
                    { 
                      label: 'Financing', 
                      status: cycle.status === 'financing' ? 'current' : 
                             ['closing', 'acquired'].includes(cycle.status) ? 'complete' : 'pending',
                      description: cycle.loanApproved ? 'Approved' : undefined
                    },
                    { 
                      label: 'Acquired', 
                      status: cycle.status === 'acquired' ? 'complete' : 
                             cycle.status === 'cancelled' ? 'skipped' : 'pending',
                      date: cycle.actualCloseDate
                    }
                  ]}
                />
              </div>

              {/* Sidebar (1/3 width) */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <MetricCard
                  label="Offer Amount"
                  value={formatPKR(cycle.offerAmount)}
                  icon={<DollarSign className="w-4 h-4" />}
                  variant="info"
                />

                {cycle.negotiatedPrice && (
                  <MetricCard
                    label="Negotiated Price"
                    value={formatPKR(cycle.negotiatedPrice)}
                    icon={<TrendingDown className="w-4 h-4" />}
                    trend={{
                      direction: cycle.negotiatedPrice < cycle.askingPrice ? 'down' : 'up',
                      value: ((1 - cycle.negotiatedPrice / cycle.askingPrice) * 100).toFixed(1)
                    }}
                    comparison="vs asking price"
                    variant="success"
                  />
                )}

                <MetricCard
                  label="Due Diligence"
                  value={`${dueDiligenceProgress}/4`}
                  icon={<FileCheck className="w-4 h-4" />}
                  trend={{
                    direction: dueDiligenceProgress === 4 ? 'up' : 'neutral',
                    value: dueDiligenceProgress === 4 ? 'Complete' : 'In Progress'
                  }}
                  variant={dueDiligenceProgress === 4 ? 'success' : 'default'}
                />

                {/* Quick Stats Panel */}
                <InfoPanel
                  title="Quick Stats"
                  data={[
                    { 
                      label: 'Days Since Offer', 
                      value: cycle.offerDate ? Math.floor((Date.now() - new Date(cycle.offerDate).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A',
                      icon: <Clock className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Financing Type', 
                      value: <span className="capitalize">{cycle.financingType}</span>,
                      icon: <Landmark className="w-4 h-4" /> 
                    },
                    ...(cycle.loanAmount ? [{ 
                      label: 'Loan Status', 
                      value: <Badge className={cycle.loanApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {cycle.loanApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    }] : []),
                  ]}
                  columns={1}
                  density="compact"
                />

                {/* Quick Actions */}
                {cycle.status !== 'acquired' && cycle.status !== 'cancelled' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab('details')}
                      >
                        <FileCheck className="h-4 w-4" />
                        View Due Diligence
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab('actions')}
                      >
                        <ClipboardCheck className="h-4 w-4" />
                        Update Status
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
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Seller Name</Label>
                    <p className="text-sm mt-1">{cycle.sellerName}</p>
                  </div>
                  <div>
                    <Label>Seller Contact</Label>
                    <p className="text-sm mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {cycle.sellerContact}
                    </p>
                  </div>
                  <div>
                    <Label>Seller Type</Label>
                    <p className="text-sm mt-1 capitalize">{cycle.sellerType}</p>
                  </div>
                  {cycle.tokenAmount && (
                    <div>
                      <Label>Token Amount</Label>
                      <p className="text-sm mt-1">{formatPKR(cycle.tokenAmount)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Address</Label>
                    <p className="mt-1">{property.address}</p>
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <p className="mt-1 capitalize">{property.propertyType}</p>
                  </div>
                  <div>
                    <Label>Area</Label>
                    <p className="mt-1">{property.area} {property.areaUnit}</p>
                  </div>
                  {property.bedrooms && (
                    <div>
                      <Label>Bedrooms / Bathrooms</Label>
                      <p className="mt-1">{property.bedrooms} / {property.bathrooms || 0}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Due Diligence Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Due Diligence Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Completion Progress</span>
                    <span className="text-sm font-medium">{dueDiligenceProgress}/4</span>
                  </div>
                  <Progress value={(dueDiligenceProgress / 4) * 100} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={cycle.titleClear}
                        onCheckedChange={(checked) => 
                          handleUpdateDueDiligence('titleClear', checked as boolean)
                        }
                        disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                      />
                      <div>
                        <p className="font-medium">Title Verification</p>
                        <p className="text-sm text-gray-500">Verify property title is clear and transferable</p>
                      </div>
                    </div>
                    {cycle.titleClear && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={cycle.inspectionDone}
                        onCheckedChange={(checked) => 
                          handleUpdateDueDiligence('inspectionDone', checked as boolean)
                        }
                        disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                      />
                      <div>
                        <p className="font-medium">Property Inspection</p>
                        <p className="text-sm text-gray-500">Complete physical inspection of the property</p>
                      </div>
                    </div>
                    {cycle.inspectionDone && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={cycle.documentsVerified}
                        onCheckedChange={(checked) => 
                          handleUpdateDueDiligence('documentsVerified', checked as boolean)
                        }
                        disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                      />
                      <div>
                        <p className="font-medium">Document Verification</p>
                        <p className="text-sm text-gray-500">Verify all property documents and certificates</p>
                      </div>
                    </div>
                    {cycle.documentsVerified && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={cycle.surveyCompleted}
                        onCheckedChange={(checked) => 
                          handleUpdateDueDiligence('surveyCompleted', checked as boolean)
                        }
                        disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                      />
                      <div>
                        <p className="font-medium">Property Survey</p>
                        <p className="text-sm text-gray-500">Complete professional survey of the property</p>
                      </div>
                    </div>
                    {cycle.surveyCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </div>

                {dueDiligenceProgress === 4 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Due Diligence Complete</p>
                      <p className="text-sm text-green-700">All verification steps have been completed. Ready to proceed with closing.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financing Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Financing Details
                  </CardTitle>
                  {cycle.financingType !== 'cash' && (
                    <Button 
                      size="sm" 
                      variant={cycle.loanApproved ? "outline" : "default"}
                      onClick={() => {
                        if (!cycle.loanApproved) {
                          if (confirm('Mark loan as approved?')) {
                            updatePurchaseCycle(cycle.id, { loanApproved: true });
                            toast.success('Loan marked as approved!');
                            loadData();
                          }
                        } else {
                          if (confirm('Mark loan as pending again?')) {
                            updatePurchaseCycle(cycle.id, { loanApproved: false });
                            toast.info('Loan marked as pending');
                            loadData();
                          }
                        }
                      }}
                    >
                      {cycle.loanApproved ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Mark as Pending
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Loan
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Financing Type</Label>
                    <p className="text-sm mt-1 capitalize">{cycle.financingType}</p>
                  </div>
                  {cycle.loanAmount && (
                    <>
                      <div>
                        <Label>Loan Amount</Label>
                        <p className="text-sm mt-1">{formatPKR(cycle.loanAmount)}</p>
                      </div>
                      <div>
                        <Label>Bank Name</Label>
                        <p className="text-sm mt-1">{cycle.bankName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label>Loan Status</Label>
                        <Badge className={cycle.loanApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {cycle.loanApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {cycle.financingType !== 'cash' && !cycle.loanApproved && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Loan Approval Pending</p>
                      <p className="text-sm text-yellow-700">Financing approval is required before proceeding to closing.</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Purchase Price</span>
                      <span className="font-medium">{formatPKR(cycle.negotiatedPrice || cycle.offerAmount)}</span>
                    </div>
                    {cycle.estimatedClosingCosts && (
                      <div className="flex justify-between">
                        <span>Estimated Closing Costs</span>
                        <span className="font-medium">{formatPKR(cycle.estimatedClosingCosts)}</span>
                      </div>
                    )}
                    {cycle.additionalCosts && cycle.additionalCosts.length > 0 && (
                      <>
                        {cycle.additionalCosts.map((cost: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>{cost.description}</span>
                            <span className="font-medium">{formatPKR(cost.amount)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {cycle.renovationBudget && (
                      <div className="flex justify-between">
                        <span>Renovation Budget</span>
                        <span className="font-medium">{formatPKR(cycle.renovationBudget)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span>Total Investment</span>
                      <span>{formatPKR(
                        (cycle.negotiatedPrice || cycle.offerAmount) + 
                        (cycle.estimatedClosingCosts || 0) + 
                        (cycle.renovationBudget || 0)
                      )}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Schedule Tab */}
          <TabsContent value="payment" className="space-y-4">
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
                        Payments are tracked in Deals. Accept this purchase offer to create a Deal and manage payment schedules.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
                        <p className="text-sm font-medium text-blue-900 mb-2">💡 Next Steps:</p>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Review the purchase details and due diligence</li>
                          <li>Go to the <strong>Actions</strong> tab</li>
                          <li>Click "Accepted" status to create a Deal</li>
                          <li>Manage payments in the Deal</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })()}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activity & Communications
                  </CardTitle>
                  <Button onClick={() => setShowAddLog(!showAddLog)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddLog && (
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                    <div>
                      <Label>Type</Label>
                      <select
                        className="w-full border rounded p-2 mt-1"
                        value={logType}
                        onChange={(e) => setLogType(e.target.value as any)}
                      >
                        <option value="note">Note</option>
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>
                    <div>
                      <Label>Details</Label>
                      <Textarea
                        value={logSummary}
                        onChange={(e) => setLogSummary(e.target.value)}
                        placeholder="Enter communication details..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddCommunicationLog}>Save Log</Button>
                      <Button variant="outline" onClick={() => setShowAddLog(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {cycle.communicationLog && cycle.communicationLog.length > 0 ? (
                    cycle.communicationLog.map((log: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="capitalize">{log.type}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{log.summary}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {log.by}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No activity logs yet</p>
                      <p className="text-xs mt-2">Click "Add Log" to record communications, notes, or activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Updates */}
                <div>
                  <Label className="mb-2 block">Update Status</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={cycle.status === 'prospecting' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('prospecting')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Prospecting
                    </Button>
                    <Button
                      variant={cycle.status === 'offer-made' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('offer-made')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Offer Made
                    </Button>
                    <Button
                      variant={cycle.status === 'negotiation' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('negotiation')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Negotiation
                    </Button>
                    <Button
                      variant={cycle.status === 'accepted' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('accepted')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Accepted
                    </Button>
                    <Button
                      variant={cycle.status === 'due-diligence' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('due-diligence')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Due Diligence
                    </Button>
                    <Button
                      variant={cycle.status === 'financing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('financing')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Financing
                    </Button>
                    <Button
                      variant={cycle.status === 'closing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('closing')}
                      disabled={cycle.status === 'acquired' || cycle.status === 'cancelled'}
                    >
                      Closing
                    </Button>
                  </div>
                </div>

                {/* Send Offer to Sell Cycle */}
                {cycle.status !== 'acquired' && cycle.status !== 'cancelled' && availableSellCycles.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">Send Offer to Seller</h4>
                      <p className="text-sm text-gray-600">
                        {cycle.linkedSellCycleId 
                          ? 'You have already sent an offer to a sell cycle for this property.'
                          : `Found ${availableSellCycles.length} active sell ${availableSellCycles.length === 1 ? 'cycle' : 'cycles'} for this property.`
                        }
                      </p>
                    </div>
                    
                    {cycle.linkedSellCycleId ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">Offer Already Sent</p>
                            <p className="text-sm text-blue-700 mt-1">
                              Your offer is linked to sell cycle: {cycle.linkedSellCycleId.slice(0, 12)}...
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                              Status updates will sync automatically between purchase and sell cycles.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {availableSellCycles.length === 1 ? (
                          <Button
                            className="w-full"
                            onClick={() => {
                              setSelectedSellCycle(availableSellCycles[0]);
                              setShowSendOfferModal(true);
                            }}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Send Offer to Seller
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Label>Select Sell Cycle</Label>
                            <div className="space-y-2">
                              {availableSellCycles.map((sc) => (
                                <div key={sc.id} className="border rounded-lg p-3 hover:bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-sm">
                                        {sc.sellerName} • {formatPKR(sc.askingPrice)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Agent: {sc.agentName} • Status: {sc.status}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedSellCycle(sc);
                                        setShowSendOfferModal(true);
                                      }}
                                    >
                                      Send Offer
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Complete Purchase */}
                {cycle.status !== 'acquired' && cycle.status !== 'cancelled' && (
                  <div className="border-t pt-4">
                    {!showCompletePurchase ? (
                      <Button
                        className="w-full"
                        onClick={() => setShowCompletePurchase(true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Purchase & Transfer Ownership
                      </Button>
                    ) : (
                      <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium">Complete Purchase</h4>
                        <p className="text-sm text-gray-600">
                          This will mark the purchase as complete and automatically transfer property ownership to {cycle.purchaserName}.
                        </p>
                        <div>
                          <Label>Final Purchase Price</Label>
                          <Input
                            type="number"
                            value={finalPrice}
                            onChange={(e) => setFinalPrice(Number(e.target.value))}
                            placeholder="Enter final price"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCompletePurchase} className="flex-1">
                            Confirm & Complete
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCompletePurchase(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancel Cycle */}
                {cycle.status !== 'acquired' && cycle.status !== 'cancelled' && (
                  <div className="border-t pt-4">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelCycle}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Purchase Cycle
                    </Button>
                  </div>
                )}

                {/* Completed/Cancelled Message */}
                {cycle.status === 'acquired' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Purchase Completed</p>
                        <p className="text-sm text-green-700 mt-1">
                          This property was successfully acquired on {cycle.actualCloseDate ? new Date(cycle.actualCloseDate).toLocaleDateString() : 'N/A'}.
                          Ownership has been transferred to {cycle.purchaserName}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {cycle.status === 'cancelled' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Purchase Cancelled</p>
                        <p className="text-sm text-red-700 mt-1">This purchase cycle has been cancelled.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* PAYMENT SCHEDULE: Create Payment Schedule Modal ✅ */}
        <CreatePaymentScheduleModal
          open={showCreateSchedule}
          onClose={() => setShowCreateSchedule(false)}
          onSave={(data) => {
            const schedule = createPaymentSchedule(
              {
                ...data,
                entityId: cycle.id,
                entityType: 'purchase-cycle',
                propertyId: cycle.propertyId,
              },
              user.id,
              user.name
            );
            setPaymentSchedule(schedule);
            setShowCreateSchedule(false);
            toast.success('Payment schedule created successfully!');
          }}
          defaultTotalAmount={cycle.negotiatedPrice || cycle.offerAmount}
          entityName={`Purchase Cycle - ${property.address}`}
        />
        
        {/* OFFER SENDING: Send Offer From Purchase Cycle Modal ✅ */}
        {showSendOfferModal && selectedSellCycle && (
          <SendOfferFromPurchaseCycleModal
            isOpen={showSendOfferModal}
            onClose={() => {
              setShowSendOfferModal(false);
              setSelectedSellCycle(null);
            }}
            purchaseCycle={cycle}
            sellCycle={selectedSellCycle}
            property={property}
            onSuccess={() => {
              toast.success('Offer sent successfully! It now appears in the sell cycle.');
              loadData();
              onUpdate();
            }}
          />
        )}
      </div>
    </div>
  );
}