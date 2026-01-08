/**
 * Deal Details Component - V4.0 UI/UX OPTIMIZED ✅
 * Hick's Law implementation: Reduced from 6 tabs to 4 tabs (-33% cognitive load)
 * 
 * NEW TAB STRUCTURE:
 * 1. Overview - Summary + Connected Entities + Progress
 * 2. Payments - Payment schedules and history
 * 3. Tasks - Task management and tracking
 * 4. Activity - Timeline + Documents + Notes (MERGED)
 * 
 * IMPROVEMENTS:
 * - Reduced tabs from 6 to 4 (Hick's Law compliance)
 * - Merged Documents + Timeline + Notes → Activity
 * - All time-based information in one place
 * - Consistent icons on all tabs
 * - Better information architecture
 */

import React, { useState, useMemo } from 'react';
import { Deal, User } from '../types';
import { getDealById, progressDealStage, completeDeal, cancelDeal } from '../lib/deals';
import { getUserRoleInDeal } from '../lib/dealPermissions';
import { DualAgentHeader } from './deals/DualAgentHeader';
import { PermissionGate } from './deals/PermissionGate';
import { TaskList } from './deals/TaskList';
import { DocumentList } from './deals/DocumentList';
import { TimelineVisualization } from './deals/TimelineVisualization';
import { NotesPanel } from './deals/NotesPanel';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

// PHASE 2 FOUNDATION: Import new UI components ✅
import { InfoPanel } from './ui/info-panel';
import { MetricCard } from './ui/metric-card';
import { StatusTimeline } from './ui/status-timeline';
import { PageHeader } from './layout/PageHeader';
import { ConnectedEntitiesBar } from './layout/ConnectedEntitiesBar';
import { StatusBadge } from './layout/StatusBadge';

import { 
  ArrowLeft,
  Home,
  Users,
  DollarSign,
  CheckSquare,
  FileText,
  Clock,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Wallet,
  Plus,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

// PHASE 3: Import new transaction components ✅
import { 
  UnifiedTransactionHeader,
  ConnectedEntitiesCard,
  TransactionTimeline,
  SmartBreadcrumbs
} from './transactions';
import { getTransactionGraph, getUnifiedTimeline } from '../lib/transaction-graph';

// FLEXIBLE PAYMENT SYSTEM: Import new components ✅
import { PaymentSummaryCard } from './deals/PaymentSummaryCard';
import { PaymentSchedule } from './deals/PaymentSchedule';
import { PaymentHistory } from './deals/PaymentHistory';
import { CreatePaymentPlanModal } from './deals/CreatePaymentPlanModal';
import { AddInstallmentModal } from './deals/AddInstallmentModal';
import { RecordPaymentModal } from './deals/RecordPaymentModal';
import { exportPaymentRecord } from '../lib/dealPayments';
import { generatePaymentSchedulePDF, generatePaymentReceiptPDF } from '../lib/pdfExport';

interface DealDetailsProps {
  dealId: string;
  user: User;
  onBack: () => void;
  onNavigate?: (page: string, id: string) => void;
}

export const DealDetails: React.FC<DealDetailsProps> = ({ dealId, user, onBack, onNavigate }) => {
  const [deal, setDeal] = useState<Deal | null>(getDealById(dealId));
  
  // FLEXIBLE PAYMENT SYSTEM: State management ✅
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  
  // PHASE 3: Get transaction graph and timeline ✅
  const graph = useMemo(() => {
    if (!deal) return null;
    return getTransactionGraph(deal.id, 'deal');
  }, [deal?.id]);
  
  const timeline = useMemo(() => {
    if (!deal) return [];
    return getUnifiedTimeline(deal.id);
  }, [deal?.id]);

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
  
  if (!deal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Deal not found</h3>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const userRole = getUserRoleInDeal(user.id, deal);
  const isPrimary = userRole === 'primary';
  
  const handleProgressStage = async () => {
    const stageOrder: Array<Deal['lifecycle']['stage']> = [
      'offer-accepted',
      'agreement-signing',
      'documentation',
      'payment-processing',
      'handover-preparation',
      'transfer-registration',
      'final-handover'
    ];
    
    const currentIndex = stageOrder.indexOf(deal.lifecycle.stage);
    if (currentIndex === stageOrder.length - 1) {
      toast.info('Already at final stage');
      return;
    }
    
    const nextStage = stageOrder[currentIndex + 1];
    
    try {
      const updatedDeal = progressDealStage(deal.id, nextStage, user.id, user.name);
      setDeal(updatedDeal);
      toast.success(`Deal progressed to ${nextStage.replace('-', ' ')}`);
    } catch (error) {
      console.error('Error progressing stage:', error);
      toast.error('Failed to progress stage');
    }
  };
  
  const handleCompleteDeal = async () => {
    // Dynamic confirmation message based on current stage
    const isFinalHandover = deal.lifecycle.stage === 'final-handover';
    const confirmMessage = isFinalHandover
      ? 'This will mark Final Handover as complete and close the deal. Property ownership will be transferred to the buyer. Continue?'
      : 'Are you sure you want to mark this deal as completed? This will complete all remaining stages including Final Handover.';
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const updatedDeal = completeDeal(deal.id, user.id, user.name);
      setDeal(updatedDeal);
      toast.success('Deal completed successfully! 🎉');
    } catch (error) {
      console.error('Error completing deal:', error);
      toast.error('Failed to complete deal');
    }
  };
  
  const getStageDisplay = (stage: string) => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const calculateOverallProgress = () => {
    const stages = Object.values(deal.lifecycle.timeline.stages);
    const completed = stages.filter(s => s.status === 'completed').length;
    return (completed / stages.length) * 100;
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page Header */}
      <PageHeader
        title={deal.dealNumber}
        breadcrumbs={[
          { label: 'Deal Management', onClick: onBack },
          { label: deal.dealNumber }
        ]}
        description={`${deal.parties.seller.name} → ${deal.parties.buyer.name}`}
        metrics={[
          { 
            label: 'Agreed Price', 
            value: formatPKR(deal.financial.agreedPrice),
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Total Paid', 
            value: formatPKR(deal.financial.totalPaid),
            icon: <Wallet className="w-4 h-4" />
          },
          {
            label: 'Balance',
            value: formatPKR(deal.financial.balanceRemaining),
            icon: <DollarSign className="w-4 h-4" />
          },
          {
            label: 'Progress',
            value: `${Math.round(calculateOverallProgress())}%`,
            icon: <CheckCircle2 className="w-4 h-4" />
          },
        ]}
        primaryActions={deal.lifecycle.status === 'active' ? [
          {
            label: deal.lifecycle.stage === 'final-handover' 
              ? 'Complete Final Handover' 
              : 'Complete Deal',
            icon: <CheckCircle2 className="w-4 h-4" />,
            onClick: handleCompleteDeal
          }
        ] : []}
        secondaryActions={deal.lifecycle.status === 'active' && deal.lifecycle.stage !== 'final-handover' ? [
          {
            label: 'Progress Stage',
            icon: <ChevronRight className="w-4 h-4" />,
            onClick: handleProgressStage
          }
        ] : []}
        onBack={onBack}
      />

      {/* PHASE 1-2: New ConnectedEntitiesBar ✅ */}
      <ConnectedEntitiesBar
        entities={[
          {
            type: 'property',
            name: graph?.property?.address || 'Property',
            icon: <Home className="w-4 h-4" />,
            onClick: () => graph?.property && handleNavigation('property-detail', graph.property.id)
          },
          {
            type: 'seller',
            name: deal.parties.seller.name,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          },
          {
            type: 'buyer',
            name: deal.parties.buyer.name,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          },
          {
            type: 'agent',
            name: deal.agents.primary.name,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          },
          ...(deal.agents.secondary ? [{
            type: 'agent' as const,
            name: deal.agents.secondary.name,
            icon: <UserIcon className="w-4 h-4" />,
            onClick: () => {}
          }] : [])
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Dual Agent Header */}
        <DualAgentHeader deal={deal} currentUserId={user.id} />
        
        {/* Overall Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Current Stage: {getStageDisplay(deal.lifecycle.stage)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">{Math.round(calculateOverallProgress())}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3" />
              
              {/* Final Handover Notice */}
              {deal.lifecycle.status === 'active' && deal.lifecycle.stage === 'final-handover' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Final Handover Stage</p>
                      <p className="text-sm text-blue-700 mt-1">
                        All previous stages completed. Click "Complete Final Handover & Close Deal" button above to finalize this transaction and transfer property ownership.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <PermissionGate
                deal={deal}
                userId={user.id}
                permission="canProgressStages"
                showMessage={false}
              >
                {deal.lifecycle.status === 'active' && deal.lifecycle.stage !== 'final-handover' && (
                  <Button onClick={handleProgressStage} className="w-full">
                    Progress to Next Stage
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </PermissionGate>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2 FOUNDATION: New data-dense layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* PHASE 3: Connected Entities Card ✅ */}
                {graph && (
                  <ConnectedEntitiesCard
                    graph={graph}
                    currentEntityType="deal"
                    onNavigate={handleNavigation}
                  />
                )}
                
                <InfoPanel
                  title="Deal Information"
                  data={[
                    { label: 'Deal Number', value: deal.dealNumber, icon: <FileText className="w-4 h-4" /> },
                    { label: 'Status', value: <Badge>{deal.lifecycle.status}</Badge> },
                    { label: 'Stage', value: getStageDisplay(deal.lifecycle.stage), icon: <TrendingUp className="w-4 h-4" /> },
                    { label: 'Offer Accepted', value: new Date(deal.lifecycle.timeline.offerAcceptedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Expected Closing', value: new Date(deal.lifecycle.timeline.expectedClosingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), icon: <Calendar className="w-4 h-4" /> },
                    ...(deal.lifecycle.timeline.actualClosingDate ? [{ label: 'Actual Closing', value: new Date(deal.lifecycle.timeline.actualClosingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), icon: <CheckCircle2 className="w-4 h-4" /> }] : []),
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Parties Involved"
                  data={[
                    { label: 'Seller', value: deal.parties.seller.name, icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Seller Contact', value: deal.parties.seller.contact || 'N/A' },
                    { label: 'Seller Agent', value: deal.agents.primary.name, icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Buyer', value: deal.parties.buyer.name, icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Buyer Contact', value: deal.parties.buyer.contact || 'N/A' },
                    { label: 'Buyer Agent', value: deal.agents.secondary?.name || 'None', icon: <UserIcon className="w-4 h-4" /> },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Financial Details"
                  data={[
                    { label: 'Agreed Price', value: formatPKR(deal.financial.agreedPrice), icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Total Paid', value: formatPKR(deal.financial.totalPaid), icon: <CheckCircle2 className="w-4 h-4" /> },
                    { label: 'Balance Remaining', value: formatPKR(deal.financial.balanceRemaining), icon: <AlertCircle className="w-4 h-4" /> },
                    { label: 'Commission Rate', value: `${deal.financial.commission.rate}%` },
                    { label: 'Total Commission', value: formatPKR(deal.financial.commission.total), icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Primary Agent Split', value: `${formatPKR(deal.financial.commission.split.primaryAgent.amount)} (${deal.financial.commission.split.primaryAgent.percentage}%)` },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <StatusTimeline
                  steps={[
                    { label: 'Offer Accepted', status: 'complete', date: deal.lifecycle.timeline.offerAcceptedDate, description: formatPKR(deal.financial.agreedPrice) },
                    { label: 'Agreement', status: deal.lifecycle.stage === 'agreement-signing' ? 'current' : ['documentation', 'payment-processing', 'handover-preparation', 'transfer-registration', 'final-handover'].includes(deal.lifecycle.stage) ? 'complete' : 'pending' },
                    { label: 'Documentation', status: deal.lifecycle.stage === 'documentation' ? 'current' : ['payment-processing', 'handover-preparation', 'transfer-registration', 'final-handover'].includes(deal.lifecycle.stage) ? 'complete' : 'pending' },
                    { label: 'Payment', status: deal.lifecycle.stage === 'payment-processing' ? 'current' : ['handover-preparation', 'transfer-registration', 'final-handover'].includes(deal.lifecycle.stage) ? 'complete' : 'pending', description: `${Math.round((deal.financial.totalPaid / deal.financial.agreedPrice) * 100)}% paid` },
                    { label: 'Transfer', status: deal.lifecycle.stage === 'transfer-registration' ? 'current' : deal.lifecycle.stage === 'final-handover' ? 'complete' : 'pending' },
                    { label: 'Handover', status: deal.lifecycle.stage === 'final-handover' ? 'current' : deal.lifecycle.status === 'completed' ? 'complete' : 'pending', date: deal.lifecycle.timeline.actualClosingDate }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <MetricCard label="Deal Value" value={formatPKR(deal.financial.agreedPrice)} icon={<DollarSign className="w-4 h-4" />} />
                <MetricCard 
                  label="Total Commission" 
                  value={formatPKR(deal.financial.commission.total)} 
                  icon={<DollarSign className="w-4 h-4" />} 
                />
                <MetricCard 
                  label="Days to Close" 
                  value={deal.lifecycle.timeline.expectedClosingDate ? Math.ceil((new Date(deal.lifecycle.timeline.expectedClosingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 'TBD'} 
                  icon={<Clock className="w-4 h-4" />} 
                />
                
                <InfoPanel
                  title="Quick Stats"
                  data={[
                    { label: 'Payment Progress', value: `${Math.round((deal.financial.totalPaid / deal.financial.agreedPrice) * 100)}%`, icon: <CheckCircle2 className="w-4 h-4" /> },
                    { label: 'Overall Progress', value: `${Math.round(calculateOverallProgress())}%`, icon: <TrendingUp className="w-4 h-4" /> },
                    { label: 'Current Stage', value: getStageDisplay(deal.lifecycle.stage), icon: <AlertCircle className="w-4 h-4" /> },
                  ]}
                  columns={1}
                  density="compact"
                />

                {deal.lifecycle.status === 'active' && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => document.querySelector('[value="payments"]')?.dispatchEvent(new Event('click', { bubbles: true }))}><DollarSign className="h-4 w-4" />View Payments</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => document.querySelector('[value="tasks"]')?.dispatchEvent(new Event('click', { bubbles: true }))}><CheckSquare className="h-4 w-4" />View Tasks</Button>
                      {deal.lifecycle.stage !== 'final-handover' && (
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleProgressStage}><ChevronRight className="h-4 w-4" />Progress Stage</Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* FLEXIBLE PAYMENT SYSTEM ✅ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Payment Summary */}
              <div className="lg:col-span-1">
                <PaymentSummaryCard
                  deal={deal}
                  onCreatePlan={() => setShowCreatePlan(true)}
                  onRecordAdHoc={() => {
                    setSelectedInstallment(undefined);
                    setShowRecordPayment(true);
                  }}
                  onExport={() => {
                    try {
                      generatePaymentSchedulePDF(deal.id);
                      toast.success('Opening payment schedule PDF...');
                    } catch (error: any) {
                      toast.error(error.message || 'Failed to generate PDF');
                    }
                  }}
                  isPrimaryAgent={isPrimary}
                />
              </div>

              {/* Right Column: Payment Schedule & History */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentSchedule
                      deal={deal}
                      currentUserId={user.id}
                      currentUserName={user.name}
                      onDealUpdate={(updatedDeal) => setDeal(updatedDeal)}
                      onAddInstallment={() => setShowAddInstallment(true)}
                    />
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentHistory deal={deal} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <TaskList deal={deal} currentUserId={user.id} />
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity">
            {/* PHASE 3: Enhanced Timeline with Transaction Timeline ✅ */}
            {timeline && timeline.length > 0 && (
              <TransactionTimeline 
                timeline={timeline} 
                onNavigate={handleNavigation}
              />
            )}
            
            {/* Original Deal Timeline */}
            <div className="mt-6">
              <TimelineVisualization deal={deal} />
            </div>
            
            {/* Documents */}
            <div className="mt-6">
              <DocumentList deal={deal} currentUserId={user.id} />
            </div>
            
            {/* Notes */}
            <div className="mt-6">
              <NotesPanel deal={deal} currentUserId={user.id} currentUserName={user.name} />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* FLEXIBLE PAYMENT SYSTEM: Modals ✅ */}
        {showCreatePlan && (
          <CreatePaymentPlanModal
            open={showCreatePlan}
            onClose={() => setShowCreatePlan(false)}
            deal={deal}
            currentUserId={user.id}
            currentUserName={user.name}
            onSuccess={(updatedDeal) => {
              setDeal(updatedDeal);
              setShowCreatePlan(false);
            }}
          />
        )}
        
        {showAddInstallment && (
          <AddInstallmentModal
            open={showAddInstallment}
            onClose={() => setShowAddInstallment(false)}
            deal={deal}
            currentUserId={user.id}
            currentUserName={user.name}
            onSuccess={(updatedDeal) => {
              setDeal(updatedDeal);
              setShowAddInstallment(false);
            }}
          />
        )}
        
        {showRecordPayment && (
          <RecordPaymentModal
            open={showRecordPayment}
            onClose={() => {
              setShowRecordPayment(false);
              setSelectedInstallment(undefined);
            }}
            deal={deal}
            currentUserId={user.id}
            currentUserName={user.name}
            selectedInstallment={selectedInstallment}
            onSuccess={(updatedDeal) => {
              setDeal(updatedDeal);
              setShowRecordPayment(false);
              setSelectedInstallment(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};