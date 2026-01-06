import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Property, User, Document, Contact, Offer, TransactionTask, Transaction, ScheduledPayment, PaymentTransaction, PaymentPlan, SellerPayout, ProfitDistribution } from '../types';
import { updateProperty, getDocuments, addDocument } from '../lib/data';
import { formatCurrency, formatCurrencyShort, formatArea, formatPKR } from '../lib/currency';
import { CRMIntegration } from './CRMIntegration';
import { getOffers, saveOffer, updateOfferStatus } from '../lib/offers';
import { getTransactionTasks, toggleTaskCompletion, getTaskProgress, getActiveTransaction, saveTransaction } from '../lib/transactions';
import { getScheduledPayments, getPaymentSummary, getPaymentTransactions, getPaymentPlanByTransaction, getSellerPayoutByProperty, savePaymentPlan, saveScheduledPayments } from '../lib/payments';
import { PaymentPlanModal } from './PaymentPlanModal';
import { LogPaymentModal } from './LogPaymentModal';
import { PaymentReceipt } from './PaymentReceipt';
import { SellerPayoutModal } from './SellerPayoutModal';
import { TransactionWorkspace } from './TransactionWorkspace';
import { ProfitDistributionModal } from './ProfitDistributionModal';
import { UnderContractModal } from './UnderContractModal';
import { PropertyTransactionHistory } from './PropertyTransactionHistory';
import { CommissionManagementModal } from './CommissionManagementModal';
import { RelistPropertyModal } from './RelistPropertyModal';
import { PropertyDealDocuments } from './PropertyDealDocuments';
import { RentalWorkspace } from './RentalWorkspace';
import { canRelist } from '../lib/ownership';
import { incrementPropertyViews, calculateDaysOnMarket, duplicateProperty } from '../lib/phase3Enhancements';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

// PHASE 3: Import new transaction components ✅
import { 
  UnifiedTransactionHeader,
  ConnectedEntitiesCard,
  SmartBreadcrumbs
} from './transactions';
import { getTransactionGraph, getUnifiedTimeline } from '../lib/transaction-graph';

import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileText, 
  DollarSign,
  Eye,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square,
  Camera,
  Share2,
  BarChart3,
  ContactRound,
  Calculator,
  Plus,
  MoreVertical,
  Edit,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileCheck,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  History,
  Copy
} from 'lucide-react';

interface PropertyDetailProps {
  property: Property;
  user: User;
  onBack: () => void;
  onNavigate?: (page: string, id: string) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, user, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPublished, setIsPublished] = useState(property.isPublished);
  const [isAnonymous, setIsAnonymous] = useState(property.isAnonymous);
  const [dealStatus, setDealStatus] = useState(property.status);
  const [finalSalePrice, setFinalSalePrice] = useState(property.finalSalePrice?.toString() || '');
  const [commissionRate, setCommissionRate] = useState(property.commissionRate?.toString() || '3');
  const [unitCostBasis, setUnitCostBasis] = useState(property.unitCostBasis?.toString() || '');
  const [projectedGrossProfit, setProjectedGrossProfit] = useState(property.projectedGrossProfit?.toString() || '');
  const [commissionAmount, setCommissionAmount] = useState(property.commissionAmount?.toString() || '');

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerFormData, setOfferFormData] = useState({
    buyerName: '',
    buyerContact: '',
    buyerEmail: '',
    offerAmount: '',
    dateReceived: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: 'active' as 'active' | 'accepted' | 'rejected' | 'countered',
    counterAmount: '',
    notes: ''
  });

  // Transaction state
  const [transactionTasks, setTransactionTasks] = useState<TransactionTask[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  
  // Payment state
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([]);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [showPaymentPlanModal, setShowPaymentPlanModal] = useState(false);
  const [showLogPaymentModal, setShowLogPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedScheduledPayment, setSelectedScheduledPayment] = useState<ScheduledPayment | null>(null);
  const [selectedPaymentTransaction, setSelectedPaymentTransaction] = useState<PaymentTransaction | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  
  // Seller payout state
  const [showSellerPayoutModal, setShowSellerPayoutModal] = useState(false);
  const [sellerPayout, setSellerPayout] = useState<SellerPayout | null>(null);
  
  // Profit distribution state
  const [showProfitDistributionModal, setShowProfitDistributionModal] = useState(false);
  
  // Under contract modal state
  const [showUnderContractModal, setShowUnderContractModal] = useState(false);
  
  // Relist modal state
  const [showRelistModal, setShowRelistModal] = useState(false);
  const [canBeRelisted, setCanBeRelisted] = useState(false);
  
  // Commission management state
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<User[]>([]);
  
  // Rental workspace state
  const [showRentalWorkspace, setShowRentalWorkspace] = useState(false);

  // PHASE 3: Get transaction graph and timeline ✅
  const graph = useMemo(() => {
    return getTransactionGraph(property.id, 'property');
  }, [property.id]);
  
  const timeline = useMemo(() => {
    return getUnifiedTimeline(property.id);
  }, [property.id]);
  
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

  const documents = useMemo(() => getDocuments(property.id), [property.id]);
  
  // Memoize payment summary to avoid recalculating on every render
  const paymentSummary = useMemo(() => {
    if ((property.status === 'under-contract' || property.status === 'sold') && scheduledPayments.length > 0) {
      return getPaymentSummary(property.id);
    }
    return { totalAmount: 0, totalPaid: 0, amountRemaining: 0, percentagePaid: 0 };
  }, [property.id, property.status, scheduledPayments]);

  // Load offers
  useMemo(() => {
    const propertyOffers = getOffers(property.id);
    setOffers(propertyOffers);
  }, [property.id, activeTab]);

  // Load transaction data - use useEffect instead of useMemo to prevent blocking
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    if (property.status === 'under-contract' || property.status === 'sold') {
      setIsLoadingPayments(true);
      
      // Add timeout protection
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('Transaction data loading timeout');
          setIsLoadingPayments(false);
        }
      }, 5000);
      
      try {
        const tasks = getTransactionTasks(property.id);
        if (isMounted) setTransactionTasks(tasks);
        
        const activeTransaction = getActiveTransaction(property.id);
        if (isMounted) setTransaction(activeTransaction);
        
        // Load payment data
        const payments = getScheduledPayments(property.id);
        if (isMounted) setScheduledPayments(payments);
        
        if (activeTransaction) {
          // Try to get separate payment plan record first
          let plan = getPaymentPlanByTransaction(activeTransaction.id);
          
          // If not found but transaction has embedded payment plan, migrate it (backwards compatibility)
          if (!plan && activeTransaction.paymentPlan) {
            // Create PaymentPlan record
            plan = {
              id: `plan-${activeTransaction.id}`,
              propertyId: property.id,
              transactionId: activeTransaction.id,
              totalSaleAmount: activeTransaction.paymentPlan.totalAmount,
              planType: 'installments',
              createdBy: activeTransaction.agentId,
              createdAt: activeTransaction.createdAt,
              updatedAt: activeTransaction.updatedAt
            };
            
            // Save the plan
            try {
              savePaymentPlan(plan);
              
              // Create ScheduledPayment records from embedded installments
              if (activeTransaction.paymentPlan.installments && activeTransaction.paymentPlan.installments.length > 0) {
                const migratedPayments = activeTransaction.paymentPlan.installments.map(inst => ({
                  id: `scheduled-${activeTransaction.id}-${inst.installmentNumber}`,
                  paymentPlanId: plan!.id,
                  propertyId: property.id,
                  title: inst.description,
                  amountDue: inst.amount,
                  amountPaid: 0,
                  dueDate: inst.dueDate,
                  status: (inst.status || 'pending') as 'pending' | 'paid' | 'overdue' | 'partially-paid',
                  paymentTransactionIds: [],
                  createdAt: activeTransaction.createdAt,
                  updatedAt: new Date().toISOString()
                }));
                
                saveScheduledPayments(migratedPayments);
                
                // Reload scheduled payments after migration
                const updatedPayments = getScheduledPayments(property.id);
                if (isMounted) setScheduledPayments(updatedPayments);
              }
            } catch (error) {
              console.error('Error migrating payment plan:', error);
            }
          }
          
          if (isMounted) setPaymentPlan(plan);
        }
        
        // Load seller payout if exists
        const payout = getSellerPayoutByProperty(property.id);
        if (isMounted) setSellerPayout(payout);
      } catch (error) {
        console.error('Error loading transaction data:', error);
        toast.error('Failed to load transaction data');
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (isMounted) setIsLoadingPayments(false);
      }
    }
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [property.id, property.status, property.currentOwnerId]); // Re-run when ownership changes
  
  // Check if property can be re-listed
  useEffect(() => {
    const checkRelist = () => {
      const { canRelist: isEligible } = canRelist(property.id);
      setCanBeRelisted(isEligible);
    };
    
    checkRelist();
  }, [property.id, property.status, property.currentOwnerId]);

  // Track property view on mount
  useEffect(() => {
    incrementPropertyViews(property.id);
  }, [property.id]);
  
  // Load available agents for commission splits
  useEffect(() => {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const allUsers = JSON.parse(usersJson);
      const agents = allUsers.filter((u: User) => u.role === 'agent' || u.role === 'admin');
      setAvailableAgents(agents);
    }
  }, []);

  // Get contacts interested in this property
  const interestedContacts = useMemo(() => {
    const savedContacts = localStorage.getItem('crm_contacts');
    if (!savedContacts) return [];
    const allContacts = JSON.parse(savedContacts);
    return allContacts.filter((contact: Contact) => 
      contact.interestedProperties.includes(property.id) &&
      (user.role === 'admin' || contact.agentId === user.id)
    );
  }, [property.id, user.id, user.role]);

  const handleStatusUpdate = () => {
    // Show Under Contract modal when moving to under-contract status
    if (dealStatus === 'under-contract' && property.status !== 'under-contract') {
      // First update the property status
      const updates: Partial<Property> = {
        isPublished,
        isAnonymous,
        status: dealStatus
      };
      updateProperty(property.id, updates);
      
      // Then show modal to set up buyer and payment plan
      setShowUnderContractModal(true);
      return;
    }

    const updates: Partial<Property> = {
      isPublished,
      isAnonymous,
      status: dealStatus
    };

    if (dealStatus === 'sold' && finalSalePrice) {
      updates.finalSalePrice = parseFloat(finalSalePrice);
      updates.commissionEarned = (parseFloat(finalSalePrice) * parseFloat(commissionRate)) / 100;
    }

    updateProperty(property.id, updates);
    toast.success('Property updated successfully');
  };

  const handleFileUpload = (type: string) => {
    // Simulate file upload
    const mockDoc: Omit<Document, 'id' | 'uploadedAt'> = {
      name: `${type}_document_${Date.now()}.pdf`,
      type: type,
      url: '#',
      propertyId: property.id,
      uploadedBy: user.name
    };
    addDocument(mockDoc);
    window.location.reload(); // Simple refresh for demo
  };

  const commissionEarned = useMemo(() => {
    if (dealStatus === 'sold' && finalSalePrice && commissionRate) {
      return (parseFloat(finalSalePrice) * parseFloat(commissionRate)) / 100;
    }
    return 0;
  }, [dealStatus, finalSalePrice, commissionRate]);

  // Handle property duplication
  const handleDuplicate = () => {
    const newProperty = duplicateProperty(property.id, user.id, user.name);
    if (newProperty) {
      toast.success('Property duplicated successfully! Navigate to inventory to see it.');
    } else {
      toast.error('Failed to duplicate property');
    }
  };

  // Calculate days on market
  const daysOnMarket = calculateDaysOnMarket(property);

  return (
    <div className="p-6">
      {/* PHASE 3: Smart Breadcrumbs ✅ */}
      {graph && (
        <SmartBreadcrumbs
          currentPage="property-detail"
          currentEntityId={property.id}
          graph={graph}
          onNavigate={handleNavigation}
        />
      )}
      
      {/* PHASE 3: Unified Transaction Header ✅ */}
      {graph && (graph.sellCycle || graph.purchaseCycle || graph.deal) && (
        <div className="mb-6">
          <UnifiedTransactionHeader
            graph={graph}
            currentPage="property"
            onNavigate={handleNavigation}
          />
        </div>
      )}
      
      {/* PHASE 3: Connected Entities Card ✅ */}
      {graph && (graph.sellCycle || graph.purchaseCycle || graph.deal) && (
        <div className="mb-6">
          <ConnectedEntitiesCard
            graph={graph}
            currentEntityType="property"
            onNavigate={handleNavigation}
          />
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <Badge className={
              property.status === 'available' ? 'bg-green-100 text-green-800' :
              property.status === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
              property.status === 'under-contract' ? 'bg-purple-100 text-purple-800' :
              property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }>
              {property.status === 'under-contract' ? 'Under Contract' : property.status}
            </Badge>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {property.address}
          </p>
        </div>
        <div className="flex gap-2">
          <CRMIntegration user={user} propertyId={property.id} />
          {property.listingType === 'for-rent' && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setShowRentalWorkspace(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Rental Workflow
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${property.status === 'under-contract' ? 'grid-cols-9' : 'grid-cols-8'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transaction-history">
            <History className="h-4 w-4 mr-2" />
            Deal History
          </TabsTrigger>
          <TabsTrigger value="contacts">Interested Contacts</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          {property.status === 'under-contract' && (
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
          )}
          <TabsTrigger value="financial-asset">Financial Details</TabsTrigger>
          <TabsTrigger value="marketing">Marketing & Publishing</TabsTrigger>
          <TabsTrigger value="financials">Financials & Commission</TabsTrigger>
          <TabsTrigger value="deal-documents">
            <FileText className="h-4 w-4 mr-2" />
            Deal Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Images */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Property Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(property.price || 0)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{property.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="font-medium">{formatArea(property.area, property.propertyType === 'house' ? 'yards' : 'sqft')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Days on Market
                      </p>
                      <p className="font-medium">{daysOnMarket} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View Count
                      </p>
                      <p className="font-medium">{property.viewCount || 0} views</p>
                    </div>
                  </div>
                  
                  {property.bedrooms && property.bathrooms && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-medium flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-medium flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Agent</p>
                    <p className="font-medium">{property.agentName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Listed Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {property.createdAt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Acquisition Type & Purchase Details */}
          {property.acquisitionType && property.acquisitionType !== 'client-listing' && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {property.acquisitionType === 'agency-purchase' ? '🏢 Agency Purchase' : '💼 Investor Purchase'}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {property.acquisitionType === 'agency-purchase' 
                    ? 'This property was purchased by the agency for inventory'
                    : 'This property was purchased with investor funds'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.purchaseDetails && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Purchase Price</p>
                        <p className="font-medium text-lg">{formatCurrency(property.purchaseDetails.purchasePrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Associated Costs</p>
                        <p className="font-medium">{formatCurrency(property.purchaseDetails.associatedCosts || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Cost Basis</p>
                        <p className="font-medium text-lg text-blue-600">
                          {formatCurrency(property.purchaseDetails.totalCostBasis)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Purchase Date</p>
                        <p className="font-medium">{property.purchaseDetails.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Source</p>
                        <p className="font-medium">{property.purchaseDetails.paymentSource || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Investor Details for investor-purchase */}
                    {property.acquisitionType === 'investor-purchase' && property.purchaseDetails.assignedInvestors && property.purchaseDetails.assignedInvestors.length > 0 && (
                      <div className="pt-4 border-t border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Assigned Investors</p>
                        <div className="space-y-2">
                          {property.purchaseDetails.assignedInvestors.map((investorId) => {
                            const investors = JSON.parse(localStorage.getItem('crm_investors') || '[]');
                            const investor = investors.find((inv: any) => inv.id === investorId);
                            return investor ? (
                              <div key={investorId} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                                <span className="font-medium">{investor.name}</span>
                                <span className="text-sm text-gray-600">{investor.email || 'No email'}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Profitability Calculations */}
                    {property.price && (
                      <div className="pt-4 border-t border-blue-200 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Asking Price</span>
                          <span className="font-medium">{formatCurrency(property.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cost Basis</span>
                          <span className="font-medium text-red-600">- {formatCurrency(property.purchaseDetails.totalCostBasis)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-300">
                          <span className="font-medium text-gray-700">Projected Gross Profit</span>
                          <span className="font-medium text-lg text-green-600">
                            {formatCurrency(property.price - property.purchaseDetails.totalCostBasis)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Profit Margin</span>
                          <span className="font-medium">
                            {(((property.price - property.purchaseDetails.totalCostBasis) / property.price) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Sale Completion Banner - Show for Recently Sold Properties */}
          {property.status === 'sold' && property.soldDate && (() => {
            const soldDate = new Date(property.soldDate);
            const daysSinceSold = Math.floor((new Date().getTime() - soldDate.getTime()) / (1000 * 60 * 60 * 24));
            const isRecentlySold = daysSinceSold <= 7;
            
            return isRecentlySold ? (
              <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">Sale Completed & Ownership Transferred</h4>
                      <p className="text-sm text-green-700 mb-2">
                        This property was successfully sold on {soldDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      {property.finalSalePrice && (
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Final Sale Price: </span>
                            <span className="font-medium text-green-900">{formatCurrency(property.finalSalePrice)}</span>
                          </div>
                          {transaction?.buyerName && (
                            <div>
                              <span className="text-gray-600">Sold to: </span>
                              <span className="font-medium text-green-900">{transaction.buyerName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })()}
          
          {/* Ownership & Transaction Information */}
          {(property.currentOwnerId || property.ownershipHistory?.length || transaction) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Owner Information */}
              {property.currentOwnerId && (() => {
                const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
                const owner = contacts.find((c: any) => c.id === property.currentOwnerId);
                return owner ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Owner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{owner.name}</p>
                      </div>
                      {owner.phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{owner.phone}</p>
                        </div>
                      )}
                      {owner.email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{owner.email}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null;
              })()}
              
              {/* Buyer/Transaction Information */}
              {transaction && (
                <Card>
                  <CardHeader>
                    <CardTitle>Buyer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Buyer Name</p>
                      <p className="font-medium">{transaction.buyerName}</p>
                    </div>
                    {transaction.buyerContact && (
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium">{transaction.buyerContact}</p>
                      </div>
                    )}
                    {transaction.buyerEmail && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{transaction.buyerEmail}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Accepted Offer</p>
                      <p className="font-medium">{formatCurrency(transaction.acceptedOfferAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Ownership History */}
              {property.ownershipHistory && property.ownershipHistory.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Ownership History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {property.ownershipHistory.map((record, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                          <div>
                            <p className="font-medium">{record.contactName}</p>
                            {record.notes && <p className="text-sm text-gray-500 mt-1">{record.notes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {record.startDate} {record.endDate ? `- ${record.endDate}` : ''}
                            </p>
                            {!record.endDate && (
                              <Badge variant="secondary" className="mt-1">Current</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{property.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="transaction-history" className="space-y-6">
          <PropertyTransactionHistory
            property={property}
            user={user}
            onCreateNewDeal={() => {
              setActiveTab('transaction');
            }}
          />
          
          {/* Re-list Button for Eligible Properties */}
          {canBeRelisted && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Re-List This Property
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Buy this property back into your agency's inventory to resell it
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowRelistModal(true)} 
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Buy Back Property
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ContactRound className="h-5 w-5" />
                Interested Contacts ({interestedContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interestedContacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ContactRound className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No contacts have expressed interest in this property yet.</p>
                  <p className="text-sm mt-2">Use the CRM to track client interest and add contacts to this property.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interestedContacts.map((contact: Contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <ContactRound className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {contact.phone && <span>📞 {contact.phone}</span>}
                            {contact.email && <span>✉️ {contact.email}</span>}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{contact.type}</Badge>
                            <Badge variant="outline">{contact.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {contact.lastContactDate 
                            ? `Last contact: ${new Date(contact.lastContactDate).toLocaleDateString()}`
                            : 'No recent contact'
                          }
                        </p>
                        <div className="flex gap-2 mt-2">
                          <CRMIntegration user={user} propertyId={property.id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial-asset" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Asset Details
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Internal financial tracking for this property unit
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost and Revenue Inputs */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unit-cost-basis">Unit Cost Basis</Label>
                    <Input
                      id="unit-cost-basis"
                      type="number"
                      value={unitCostBasis}
                      onChange={(e) => setUnitCostBasis(e.target.value)}
                      placeholder="Allocated construction/acquisition cost"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The allocated cost of constructing or acquiring this unit
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="sale-price">Sale Price</Label>
                    <Input
                      id="sale-price"
                      type="number"
                      value={finalSalePrice || property.price}
                      onChange={(e) => setFinalSalePrice(e.target.value)}
                      placeholder="Current sale price"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The current or final sale price for this unit
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="projected-profit">Projected Gross Profit</Label>
                    <Input
                      id="projected-profit"
                      type="number"
                      value={projectedGrossProfit}
                      onChange={(e) => setProjectedGrossProfit(e.target.value)}
                      placeholder="Expected gross profit"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Projected profit before commission and other expenses
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="commission-amount">Commission Amount</Label>
                    <Input
                      id="commission-amount"
                      type="number"
                      value={commissionAmount}
                      onChange={(e) => setCommissionAmount(e.target.value)}
                      placeholder="Commission amount"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total commission amount for this transaction
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">Financial Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Listed Price</span>
                        <span className="font-medium text-blue-900">
                          {formatCurrency(property.price)}
                        </span>
                      </div>
                      
                      {unitCostBasis && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Cost Basis</span>
                          <span className="font-medium text-blue-900">
                            {formatCurrency(parseFloat(unitCostBasis))}
                          </span>
                        </div>
                      )}

                      {finalSalePrice && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Sale Price</span>
                          <span className="font-medium text-blue-900">
                            {formatCurrency(parseFloat(finalSalePrice))}
                          </span>
                        </div>
                      )}

                      {unitCostBasis && finalSalePrice && (
                        <>
                          <div className="border-t border-blue-200 pt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-700">Gross Profit</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(parseFloat(finalSalePrice) - parseFloat(unitCostBasis))}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-700">Profit Margin</span>
                            <span className="font-medium text-green-600">
                              {(((parseFloat(finalSalePrice) - parseFloat(unitCostBasis)) / parseFloat(finalSalePrice)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}

                      {commissionAmount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Commission</span>
                          <span className="font-medium text-orange-600">
                            {formatCurrency(parseFloat(commissionAmount))}
                          </span>
                        </div>
                      )}

                      {unitCostBasis && finalSalePrice && commissionAmount && (
                        <div className="border-t border-blue-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-900">Net Profit</span>
                            <span className="font-bold text-green-600">
                              {formatCurrency(parseFloat(finalSalePrice) - parseFloat(unitCostBasis) - parseFloat(commissionAmount))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROI Calculator */}
                  {unitCostBasis && finalSalePrice && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-3">Return on Investment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Investment</span>
                          <span className="font-medium text-green-900">
                            {formatCurrency(parseFloat(unitCostBasis))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Return</span>
                          <span className="font-medium text-green-900">
                            {formatCurrency(parseFloat(finalSalePrice) - parseFloat(unitCostBasis))}
                          </span>
                        </div>
                        <div className="border-t border-green-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-green-900">ROI</span>
                            <span className="font-bold text-green-600 text-lg">
                              {(((parseFloat(finalSalePrice) - parseFloat(unitCostBasis)) / parseFloat(unitCostBasis)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    const updates: Partial<Property> = {
                      unitCostBasis: unitCostBasis ? parseFloat(unitCostBasis) : undefined,
                      projectedGrossProfit: projectedGrossProfit ? parseFloat(projectedGrossProfit) : undefined,
                      commissionAmount: commissionAmount ? parseFloat(commissionAmount) : undefined
                    };
                    updateProperty(property.id, updates);
                    toast.success('Financial details updated successfully!');
                  }}
                >
                  Save Financial Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="publish-toggle">Publish Listing</Label>
                    <p className="text-sm text-gray-500">Make this listing visible to clients</p>
                  </div>
                  <Switch
                    id="publish-toggle"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymous-toggle">Post Anonymously</Label>
                    <p className="text-sm text-gray-500">Hide agent information from public view</p>
                  </div>
                  <Switch
                    id="anonymous-toggle"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>
                
                <Button onClick={handleStatusUpdate} className="w-full">
                  Update Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inquiries</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Showings</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days on Market</span>
                    <span className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Deal Status Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deal-status">Current Status</Label>
                  <select
                    id="deal-status"
                    value={dealStatus}
                    onChange={(e) => setDealStatus(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="available">Available</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="under-contract">Under Contract</option>
                    <option value="sold">Sold</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                
                {dealStatus === 'sold' && (
                  <div>
                    <Label htmlFor="final-price">Final Sale Price</Label>
                    <Input
                      id="final-price"
                      type="number"
                      value={finalSalePrice}
                      onChange={(e) => setFinalSalePrice(e.target.value)}
                      placeholder="Enter final sale price"
                    />
                  </div>
                )}
                
                <Button onClick={handleStatusUpdate} className="w-full">
                  Update Status
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Commission Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                  <Input
                    id="commission-rate"
                    type="number"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Listed Price</span>
                    <span className="font-medium">{formatCurrency(property.price || 0)}</span>
                  </div>
                  
                  {finalSalePrice && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Final Sale Price</span>
                      <span className="font-medium">{formatCurrency(parseFloat(finalSalePrice))}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission Rate</span>
                    <span className="font-medium">{commissionRate}%</span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Commission Earned</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(commissionEarned)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offers Tab */}
        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Offer Ledger</CardTitle>
                <Button onClick={() => {
                  setOfferFormData({
                    buyerName: '',
                    buyerContact: '',
                    buyerEmail: '',
                    offerAmount: '',
                    dateReceived: new Date().toISOString().split('T')[0],
                    notes: ''
                  });
                  setShowOfferModal(true);
                }} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log New Offer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                // Empty State
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 mb-2">No offers have been logged</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Click &quot;+ Log New Offer&quot; to start tracking offers for this property
                  </p>
                </div>
              ) : (
                // Data Table
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Buyer Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Offer Amount</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Date Received</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-900">{offer.buyerName}</p>
                              {offer.buyerContact && (
                                <p className="text-xs text-gray-500">{offer.buyerContact}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-900">{formatPKR(offer.offerAmount)}</p>
                            {offer.status === 'countered' && offer.counterAmount && (
                              <p className="text-xs text-orange-600">Counter: {formatPKR(offer.counterAmount)}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600">
                              {new Date(offer.dateReceived).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant="outline"
                              className={
                                offer.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                offer.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                offer.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                offer.status === 'countered' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }
                            >
                              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOffer(offer);
                                  setStatusUpdateData({
                                    status: offer.status,
                                    counterAmount: offer.counterAmount?.toString() || '',
                                    notes: ''
                                  });
                                  setShowStatusModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction Tab */}
        {property.status === 'under-contract' && (
          <TabsContent value="transaction" className="space-y-6">
            <TransactionWorkspace
              property={property}
              user={user}
              transaction={transaction}
              scheduledPayments={scheduledPayments}
              paymentPlan={paymentPlan}
              paymentSummary={paymentSummary}
              transactionTasks={transactionTasks}
              isLoadingPayments={isLoadingPayments}
              sellerPayout={sellerPayout}
              onSetupPaymentPlan={() => setShowPaymentPlanModal(true)}
              onLogPayment={(payment) => {
                setSelectedScheduledPayment(payment);
                setShowLogPaymentModal(true);
              }}
              onViewReceipt={(payment, txn) => {
                setSelectedScheduledPayment(payment);
                setSelectedPaymentTransaction(txn);
                setShowReceiptModal(true);
              }}
              onManageSellerPayout={() => setShowSellerPayoutModal(true)}
              onRefreshTasks={() => {
                setTransactionTasks(getTransactionTasks(property.id));
              }}
              onDistributeProfits={() => setShowProfitDistributionModal(true)}
              onCreateCommission={() => setShowCommissionModal(true)}
            />
          </TabsContent>
        )}

        {/* Deal Documents Tab - Smart Auto-fill from Current Deal */}
        <TabsContent value="deal-documents" className="space-y-6">
          <PropertyDealDocuments 
            property={property}
            transaction={transaction}
            contacts={interestedContacts}
          />
        </TabsContent>
      </Tabs>

      {/* Log New Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log New Offer</DialogTitle>
            <DialogDescription>
              Record a new offer received for this property
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyer-name" className="text-sm mb-2 block">
                  Buyer Name *
                </Label>
                <Input
                  id="buyer-name"
                  value={offerFormData.buyerName}
                  onChange={(e) => setOfferFormData({ ...offerFormData, buyerName: e.target.value })}
                  placeholder="Enter buyer's name"
                />
              </div>
              <div>
                <Label htmlFor="buyer-contact" className="text-sm mb-2 block">
                  Contact Number
                </Label>
                <Input
                  id="buyer-contact"
                  value={offerFormData.buyerContact}
                  onChange={(e) => setOfferFormData({ ...offerFormData, buyerContact: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="buyer-email" className="text-sm mb-2 block">
                Email Address
              </Label>
              <Input
                id="buyer-email"
                type="email"
                value={offerFormData.buyerEmail}
                onChange={(e) => setOfferFormData({ ...offerFormData, buyerEmail: e.target.value })}
                placeholder="buyer@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-amount" className="text-sm mb-2 block">
                  Offer Amount (PKR) *
                </Label>
                <Input
                  id="offer-amount"
                  type="number"
                  value={offerFormData.offerAmount}
                  onChange={(e) => setOfferFormData({ ...offerFormData, offerAmount: e.target.value })}
                  placeholder="25000000"
                />
              </div>
              <div>
                <Label htmlFor="date-received" className="text-sm mb-2 block">
                  Date Received *
                </Label>
                <Input
                  id="date-received"
                  type="date"
                  value={offerFormData.dateReceived}
                  onChange={(e) => setOfferFormData({ ...offerFormData, dateReceived: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm mb-2 block">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={offerFormData.notes}
                onChange={(e) => setOfferFormData({ ...offerFormData, notes: e.target.value })}
                placeholder="Additional details about the offer..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowOfferModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!offerFormData.buyerName || !offerFormData.offerAmount) {
                toast.error('Please fill in all required fields');
                return;
              }

              const newOffer: Offer = {
                id: `offer-${Date.now()}`,
                propertyId: property.id,
                buyerName: offerFormData.buyerName,
                buyerContact: offerFormData.buyerContact,
                buyerEmail: offerFormData.buyerEmail,
                offerAmount: parseFloat(offerFormData.offerAmount),
                dateReceived: offerFormData.dateReceived,
                status: 'active',
                notes: offerFormData.notes,
                agentId: user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };

              saveOffer(newOffer);
              setOffers(getOffers(property.id));
              setShowOfferModal(false);
              toast.success('Offer logged successfully');
            }}>
              Log Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Offer Status Modal */}
      {selectedOffer && (
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Offer Status</DialogTitle>
              <DialogDescription>
                Update the status for {selectedOffer.buyerName}&apos;s offer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="status" className="text-sm mb-2 block">
                  Status *
                </Label>
                <Select 
                  value={statusUpdateData.status} 
                  onValueChange={(value: any) => setStatusUpdateData({ ...statusUpdateData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="countered">Countered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {statusUpdateData.status === 'countered' && (
                <div>
                  <Label htmlFor="counter-amount" className="text-sm mb-2 block">
                    Counter Offer Amount (PKR) *
                  </Label>
                  <Input
                    id="counter-amount"
                    type="number"
                    value={statusUpdateData.counterAmount}
                    onChange={(e) => setStatusUpdateData({ ...statusUpdateData, counterAmount: e.target.value })}
                    placeholder="Enter counter amount"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="status-notes" className="text-sm mb-2 block">
                  Notes
                </Label>
                <Textarea
                  id="status-notes"
                  value={statusUpdateData.notes}
                  onChange={(e) => setStatusUpdateData({ ...statusUpdateData, notes: e.target.value })}
                  placeholder="Add notes about this status change..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (statusUpdateData.status === 'countered' && !statusUpdateData.counterAmount) {
                  toast.error('Please enter a counter amount');
                  return;
                }

                updateOfferStatus(
                  selectedOffer.id,
                  statusUpdateData.status,
                  user.id,
                  statusUpdateData.notes,
                  statusUpdateData.counterAmount ? parseFloat(statusUpdateData.counterAmount) : undefined
                );

                setOffers(getOffers(property.id));
                setShowStatusModal(false);
                setSelectedOffer(null);
                toast.success('Offer status updated successfully');
              }}>
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Plan Modal */}
      {transaction && (
        <PaymentPlanModal
          open={showPaymentPlanModal}
          onOpenChange={setShowPaymentPlanModal}
          transaction={transaction}
          userId={user.id}
          onSuccess={() => {
            setScheduledPayments(getScheduledPayments(property.id));
            const plan = getPaymentPlanByTransaction(transaction.id);
            setPaymentPlan(plan);
          }}
        />
      )}

      {/* Log Payment Modal */}
      {selectedScheduledPayment && (
        <LogPaymentModal
          open={showLogPaymentModal}
          onOpenChange={setShowLogPaymentModal}
          scheduledPayment={selectedScheduledPayment}
          propertyId={property.id}
          userId={user.id}
          onSuccess={() => {
            // Reload all payment-related data
            const updatedPayments = getScheduledPayments(property.id);
            setScheduledPayments(updatedPayments);
            
            // Reload the transaction to get updated payment plan
            const updatedTransaction = getActiveTransaction(property.id);
            setTransaction(updatedTransaction);
            
            // Clear selected payment
            setSelectedScheduledPayment(null);
            
            // Force a small delay to ensure state updates propagate
            setTimeout(() => {
              setScheduledPayments(getScheduledPayments(property.id));
            }, 100);
          }}
        />
      )}

      {/* Payment Receipt Modal */}
      {selectedPaymentTransaction && selectedScheduledPayment && (
        <PaymentReceipt
          open={showReceiptModal}
          onOpenChange={setShowReceiptModal}
          paymentTransaction={selectedPaymentTransaction}
          scheduledPayment={selectedScheduledPayment}
          property={property}
          transaction={transaction!}
          totalPaid={paymentSummary.totalPaid}
          totalAmount={paymentSummary.totalAmount}
        />
      )}

      {/* Seller Payout Modal */}
      {transaction && (
        <SellerPayoutModal
          open={showSellerPayoutModal}
          onClose={() => setShowSellerPayoutModal(false)}
          property={property}
          transaction={transaction}
          totalCollected={paymentSummary.totalPaid}
          user={user}
          existingPayout={sellerPayout}
        />
      )}
      
      {/* Profit Distribution Modal */}
      {transaction && (
        <ProfitDistributionModal
          open={showProfitDistributionModal}
          onClose={() => setShowProfitDistributionModal(false)}
          property={property}
          transaction={transaction}
          user={user}
        />
      )}
      
      {/* Commission Management Modal */}
      {transaction && (
        <CommissionManagementModal
          open={showCommissionModal}
          onClose={() => setShowCommissionModal(false)}
          property={property}
          saleAmount={transaction.acceptedOfferAmount || property.price}
          availableAgents={availableAgents}
          onSuccess={() => {
            toast.success('Commission created successfully! View it in Financials > Commissions.');
            setShowCommissionModal(false);
          }}
        />
      )}
      
      {/* Under Contract Modal - Only render when needed */}
      {showUnderContractModal && (
        <UnderContractModal
          open={showUnderContractModal}
          onClose={() => setShowUnderContractModal(false)}
          property={property}
          user={user}
          onSuccess={(newTransaction) => {
            setTransaction(newTransaction);
            setShowUnderContractModal(false);
            setDealStatus('under-contract');
            
            // Reload transaction data
            const tasks = getTransactionTasks(property.id);
            setTransactionTasks(tasks);
            
            // Trigger property update event for real-time sync
            window.dispatchEvent(new CustomEvent('propertyUpdated', { 
              detail: { propertyId: property.id } 
            }));
            
            // Show success and switch to transaction tab
            toast.success('Property is now under contract!');
            setActiveTab('transaction');
          }}
        />
      )}
      
      {/* Relist Property Modal */}
      <RelistPropertyModal
        property={property}
        user={user}
        open={showRelistModal}
        onOpenChange={setShowRelistModal}
        onSuccess={() => {
          toast.success('Property re-listed successfully!');
          window.location.reload();
        }}
      />
      
      {/* Rental Workspace Modal */}
      {showRentalWorkspace && (
        <RentalWorkspace
          property={property}
          onClose={() => setShowRentalWorkspace(false)}
          onUpdate={(updatedProperty) => {
            updateProperty(property.id, updatedProperty);
            window.location.reload();
          }}
          user={user}
        />
      )}
    </div>
  );
};