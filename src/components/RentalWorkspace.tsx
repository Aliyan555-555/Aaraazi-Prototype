import React, { useState, useEffect } from 'react';
import { Property, Transaction, Contact } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { 
  FileText, 
  DollarSign, 
  Calendar as CalendarIcon,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  Clock,
  Key,
  Shield,
  FileCheck,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { format } from 'date-fns';

interface RentalWorkspaceProps {
  property: Property;
  onClose: () => void;
  onUpdate: (property: Property) => void;
  user: { id: string; name: string };
}

export function RentalWorkspace({ property, onClose, onUpdate, user }: RentalWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Contact | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Lease form state
  const [leaseData, setLeaseData] = useState({
    tenantId: '',
    leaseDuration: property.leaseDuration || 11,
    monthlyRent: property.monthlyRent || 0,
    securityDeposit: property.securityDeposit || 0,
    advanceRentMonths: property.advanceRentMonths || 1,
    leaseStartDate: '',
    maintenanceFee: property.maintenanceFee || 0,
  });

  // Compliance checklist state
  const [compliance, setCompliance] = useState({
    cnicUploaded: false,
    policeVerification: false,
    referencesChecked: false,
    utilityBillsCleared: false,
    tenancyAgreementSigned: false,
  });

  // Payment tracking
  const [payments, setPayments] = useState({
    securityDepositPaid: false,
    firstRentPaid: false,
    advanceRentPaid: false,
  });

  useEffect(() => {
    loadContacts();
    loadTransaction();
  }, [property.id]);

  const loadContacts = () => {
    try {
      const stored = localStorage.getItem('crm_contacts');
      if (stored) {
        const allContacts = JSON.parse(stored);
        // Filter to show only renters and potential tenants
        const tenants = allContacts.filter(
          (c: Contact) => 
            (c.category === 'renter' || c.category === 'buyer') && 
            c.status === 'active'
        );
        setContacts(tenants);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadTransaction = () => {
    try {
      const stored = localStorage.getItem('crm_transactions');
      if (stored) {
        const transactions = JSON.parse(stored);
        const propertyTransaction = transactions.find(
          (t: Transaction) => t.propertyId === property.id && t.status === 'active'
        );
        setTransaction(propertyTransaction || null);
        
        if (propertyTransaction && propertyTransaction.buyerContactId) {
          const tenant = contacts.find(c => c.id === propertyTransaction.buyerContactId);
          if (tenant) setSelectedTenant(tenant);
        }
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    }
  };

  const handleStartRentalTransaction = async () => {
    if (!leaseData.tenantId || !leaseData.leaseStartDate) {
      toast.error('Please select a tenant and lease start date');
      return;
    }

    setLoading(true);
    try {
      const tenant = contacts.find(c => c.id === leaseData.tenantId);
      if (!tenant) {
        toast.error('Selected tenant not found');
        return;
      }

      const leaseEndDate = new Date(leaseData.leaseStartDate);
      leaseEndDate.setMonth(leaseEndDate.getMonth() + leaseData.leaseDuration);

      // Create new rental transaction
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        propertyId: property.id,
        type: 'rental',
        buyerName: tenant.name,
        buyerContact: tenant.phone,
        buyerEmail: tenant.email,
        buyerContactId: tenant.id,
        acceptedOfferAmount: leaseData.monthlyRent,
        acceptedDate: new Date().toISOString(),
        expectedClosingDate: leaseEndDate.toISOString(),
        status: 'active',
        agentId: user.id,
        leaseDuration: leaseData.leaseDuration,
        advanceRentMonths: leaseData.advanceRentMonths,
        policeVerificationStatus: 'pending',
        moveInDate: leaseData.leaseStartDate,
        leaseEndDate: leaseEndDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save transaction
      const stored = localStorage.getItem('crm_transactions');
      const transactions = stored ? JSON.parse(stored) : [];
      transactions.push(newTransaction);
      localStorage.setItem('crm_transactions', JSON.stringify(transactions));

      // Update property status
      const updatedProperty = {
        ...property,
        status: 'under-contract' as const,
        currentTenantId: tenant.id,
        leaseStartDate: leaseData.leaseStartDate,
        leaseExpirationDate: leaseEndDate.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedProperty);
      setTransaction(newTransaction);
      setSelectedTenant(tenant);
      setActiveTab('compliance');
      
      toast.success('Rental transaction started successfully');
    } catch (error) {
      console.error('Error starting rental transaction:', error);
      toast.error('Failed to start rental transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeLeaseAndHandover = async () => {
    if (!transaction) return;

    // Validate all payments received
    if (!payments.securityDepositPaid || !payments.firstRentPaid) {
      toast.error('Please confirm all payments have been received before finalizing');
      return;
    }

    // Validate compliance
    if (!compliance.tenancyAgreementSigned) {
      toast.error('Tenancy agreement must be signed before finalizing');
      return;
    }

    setLoading(true);
    try {
      // Update property to "rented" status
      const updatedProperty = {
        ...property,
        status: 'rented' as const,
        updatedAt: new Date().toISOString(),
        lastRentalDate: new Date().toISOString(),
      };

      // Calculate commission (typically 1 month rent for rentals)
      const commissionAmount = leaseData.monthlyRent * (property.commissionRate || 1);

      // Create commission record
      const commission = {
        id: `comm-${Date.now()}`,
        agentId: user.id,
        agentName: user.name,
        propertyId: property.id,
        propertyTitle: property.title,
        amount: commissionAmount,
        rate: property.commissionRate || 1,
        status: 'pending' as const,
        payoutTrigger: 'full-payment' as const,
        createdAt: new Date().toISOString(),
      };

      const commissionsStored = localStorage.getItem('commissions');
      const commissions = commissionsStored ? JSON.parse(commissionsStored) : [];
      commissions.push(commission);
      localStorage.setItem('commissions', JSON.stringify(commissions));

      onUpdate(updatedProperty);
      setActiveTab('overview');
      
      toast.success('Lease finalized and possession handed over!');
    } catch (error) {
      console.error('Error finalizing lease:', error);
      toast.error('Failed to finalize lease');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewLease = async () => {
    if (!transaction || !selectedTenant) return;

    setLoading(true);
    try {
      const newLeaseEndDate = new Date(property.leaseExpirationDate || '');
      newLeaseEndDate.setMonth(newLeaseEndDate.getMonth() + (leaseData.leaseDuration || 11));

      // Update existing transaction
      const stored = localStorage.getItem('crm_transactions');
      const transactions = stored ? JSON.parse(stored) : [];
      const updatedTransactions = transactions.map((t: Transaction) => {
        if (t.id === transaction.id) {
          return {
            ...t,
            acceptedOfferAmount: leaseData.monthlyRent,
            expectedClosingDate: newLeaseEndDate.toISOString(),
            leaseEndDate: newLeaseEndDate.toISOString(),
            leaseDuration: leaseData.leaseDuration,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      localStorage.setItem('crm_transactions', JSON.stringify(updatedTransactions));

      // Update property
      const updatedProperty = {
        ...property,
        leaseExpirationDate: newLeaseEndDate.toISOString(),
        monthlyRent: leaseData.monthlyRent,
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedProperty);
      toast.success('Lease renewed successfully!');
    } catch (error) {
      console.error('Error renewing lease:', error);
      toast.error('Failed to renew lease');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateLease = async (relistProperty: boolean) => {
    if (!transaction) return;

    setLoading(true);
    try {
      // Update transaction to completed
      const stored = localStorage.getItem('crm_transactions');
      const transactions = stored ? JSON.parse(stored) : [];
      const updatedTransactions = transactions.map((t: Transaction) => {
        if (t.id === transaction.id) {
          return {
            ...t,
            status: 'completed',
            depositRefundStatus: 'pending',
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      localStorage.setItem('crm_transactions', JSON.stringify(updatedTransactions));

      // Update property
      const updatedProperty = {
        ...property,
        status: relistProperty ? ('available' as const) : ('withdrawn' as const),
        currentTenantId: undefined,
        leaseStartDate: undefined,
        leaseExpirationDate: undefined,
        updatedAt: new Date().toISOString(),
      };

      onUpdate(updatedProperty);
      setTransaction(null);
      setSelectedTenant(null);
      
      toast.success(relistProperty 
        ? 'Lease terminated and property re-listed' 
        : 'Lease terminated successfully'
      );
    } catch (error) {
      console.error('Error terminating lease:', error);
      toast.error('Failed to terminate lease');
    } finally {
      setLoading(false);
    }
  };

  const isLeaseExpiringSoon = () => {
    if (!property.leaseExpirationDate) return false;
    const expiryDate = new Date(property.leaseExpirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const getDaysUntilExpiry = () => {
    if (!property.leaseExpirationDate) return 0;
    const expiryDate = new Date(property.leaseExpirationDate);
    const today = new Date();
    return Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl">Rental Lifecycle Management</h2>
            <p className="text-sm text-gray-600 mt-1">{property.title}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6">
          {/* Lease Expiration Alert */}
          {property.status === 'rented' && isLeaseExpiringSoon() && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Lease Action Required:</strong> This lease expires in {getDaysUntilExpiry()} days 
                ({property.leaseExpirationDate && format(new Date(property.leaseExpirationDate), 'MMM dd, yyyy')}).
                Please decide on renewal or termination.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="initiate">Initiate Lease</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="manage">Manage Lease</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <Badge className="mt-1">
                        {property.status === 'available' && 'Vacant & Listed'}
                        {property.status === 'under-contract' && 'Processing Lease'}
                        {property.status === 'rented' && 'Active Tenancy'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="mt-1">{formatPKR(property.monthlyRent || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="mt-1">{formatPKR(property.securityDeposit || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lease Duration</p>
                      <p className="mt-1">{property.leaseDuration || 11} months</p>
                    </div>
                  </div>

                  {selectedTenant && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Current Tenant</p>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{selectedTenant.name}</p>
                            <p className="text-sm text-gray-600">{selectedTenant.phone}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {property.leaseStartDate && property.leaseExpirationDate && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Lease Start Date</p>
                          <p className="mt-1">{format(new Date(property.leaseStartDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lease End Date</p>
                          <p className="mt-1">{format(new Date(property.leaseExpirationDate), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {property.status === 'available' && (
                <Alert>
                  <Home className="h-4 w-4" />
                  <AlertDescription>
                    This property is currently vacant and available for rent. Use the "Initiate Lease" tab to start a new rental transaction.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Initiate Lease Tab */}
            <TabsContent value="initiate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Start New Rental Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant">Select Tenant *</Label>
                    <Select
                      value={leaseData.tenantId}
                      onValueChange={(value) => {
                        setLeaseData({ ...leaseData, tenantId: value });
                        const tenant = contacts.find(c => c.id === value);
                        if (tenant) setSelectedTenant(tenant);
                      }}
                    >
                      <SelectTrigger id="tenant">
                        <SelectValue placeholder="Choose tenant..." />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} - {contact.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leaseStart">Lease Start Date *</Label>
                      <Input
                        id="leaseStart"
                        type="date"
                        value={leaseData.leaseStartDate}
                        onChange={(e) => setLeaseData({ ...leaseData, leaseStartDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Lease Duration (Months)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={leaseData.leaseDuration}
                        onChange={(e) => setLeaseData({ ...leaseData, leaseDuration: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-gray-600">Default: 11 months</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rent">Monthly Rent</Label>
                      <Input
                        id="rent"
                        type="number"
                        value={leaseData.monthlyRent}
                        onChange={(e) => setLeaseData({ ...leaseData, monthlyRent: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposit">Security Deposit</Label>
                      <Input
                        id="deposit"
                        type="number"
                        value={leaseData.securityDeposit}
                        onChange={(e) => setLeaseData({ ...leaseData, securityDeposit: parseFloat(e.target.value) })}
                      />
                      <p className="text-xs text-gray-600">Typically 2-3 months rent</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="advance">Advance Rent (Months)</Label>
                      <Input
                        id="advance"
                        type="number"
                        value={leaseData.advanceRentMonths}
                        onChange={(e) => setLeaseData({ ...leaseData, advanceRentMonths: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenance">Maintenance Fee (Monthly)</Label>
                      <Input
                        id="maintenance"
                        type="number"
                        value={leaseData.maintenanceFee}
                        onChange={(e) => setLeaseData({ ...leaseData, maintenanceFee: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Initial Payment Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Security Deposit:</span>
                        <span>{formatPKR(leaseData.securityDeposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance Rent ({leaseData.advanceRentMonths} month(s)):</span>
                        <span>{formatPKR(leaseData.monthlyRent * leaseData.advanceRentMonths)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total Initial Payment:</span>
                        <span>{formatPKR(leaseData.securityDeposit + (leaseData.monthlyRent * leaseData.advanceRentMonths))}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleStartRentalTransaction}
                    disabled={loading || !leaseData.tenantId || !leaseData.leaseStartDate}
                    className="w-full"
                  >
                    {loading ? 'Starting...' : 'Start Rental Transaction'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Compliance Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Complete all compliance requirements before finalizing the lease.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={compliance.cnicUploaded}
                        onCheckedChange={(checked) => 
                          setCompliance({ ...compliance, cnicUploaded: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">Tenant CNIC Uploaded</p>
                        <p className="text-sm text-gray-600">Collect and verify tenant's national ID</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={compliance.policeVerification}
                        onCheckedChange={(checked) => 
                          setCompliance({ ...compliance, policeVerification: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">Police Verification Form Generated</p>
                        <p className="text-sm text-gray-600">Submit tenant details for police verification</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={compliance.referencesChecked}
                        onCheckedChange={(checked) => 
                          setCompliance({ ...compliance, referencesChecked: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">References Checked</p>
                        <p className="text-sm text-gray-600">Verify employment and previous rental references</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={compliance.utilityBillsCleared}
                        onCheckedChange={(checked) => 
                          setCompliance({ ...compliance, utilityBillsCleared: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">Utility Bills Cleared</p>
                        <p className="text-sm text-gray-600">Ensure all previous utility bills are paid</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg border-blue-200 bg-blue-50">
                      <Checkbox
                        checked={compliance.tenancyAgreementSigned}
                        onCheckedChange={(checked) => 
                          setCompliance({ ...compliance, tenancyAgreementSigned: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Tenancy Agreement Signed</p>
                        <p className="text-sm text-blue-700">Execute formal agreement with landlord and tenant</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {Object.values(compliance).filter(Boolean).length} of {Object.values(compliance).length} completed
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Collection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Checkbox
                        checked={payments.securityDepositPaid}
                        onCheckedChange={(checked) => 
                          setPayments({ ...payments, securityDepositPaid: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">Security Deposit Received</p>
                        <p className="text-sm text-gray-600">{formatPKR(leaseData.securityDeposit)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Checkbox
                        checked={payments.firstRentPaid}
                        onCheckedChange={(checked) => 
                          setPayments({ ...payments, firstRentPaid: checked as boolean })
                        }
                      />
                      <div className="flex-1">
                        <p className="font-medium">First Month Rent Received</p>
                        <p className="text-sm text-gray-600">{formatPKR(leaseData.monthlyRent)}</p>
                      </div>
                    </div>

                    {leaseData.advanceRentMonths > 1 && (
                      <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <Checkbox
                          checked={payments.advanceRentPaid}
                          onCheckedChange={(checked) => 
                            setPayments({ ...payments, advanceRentPaid: checked as boolean })
                          }
                        />
                        <div className="flex-1">
                          <p className="font-medium">Advance Rent Received</p>
                          <p className="text-sm text-gray-600">
                            {formatPKR(leaseData.monthlyRent * (leaseData.advanceRentMonths - 1))} 
                            ({leaseData.advanceRentMonths - 1} additional month(s))
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Total Collected</h4>
                    </div>
                    <p className="text-2xl text-green-900">
                      {formatPKR(
                        (payments.securityDepositPaid ? leaseData.securityDeposit : 0) +
                        (payments.firstRentPaid ? leaseData.monthlyRent : 0) +
                        (payments.advanceRentPaid ? leaseData.monthlyRent * (leaseData.advanceRentMonths - 1) : 0)
                      )}
                    </p>
                  </div>

                  {property.status === 'under-contract' && (
                    <Button
                      onClick={handleFinalizeLeaseAndHandover}
                      disabled={loading || !payments.securityDepositPaid || !payments.firstRentPaid || !compliance.tenancyAgreementSigned}
                      className="w-full"
                    >
                      {loading ? 'Finalizing...' : 'Finalize Lease & Handover Keys'}
                      <Key className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Lease Tab */}
            <TabsContent value="manage" className="space-y-6">
              {property.status === 'rented' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5" />
                        Lease Renewal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newRent">New Monthly Rent</Label>
                          <Input
                            id="newRent"
                            type="number"
                            value={leaseData.monthlyRent}
                            onChange={(e) => setLeaseData({ ...leaseData, monthlyRent: parseFloat(e.target.value) })}
                          />
                          <p className="text-xs text-gray-600">Adjust rent for renewal if needed</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newDuration">Lease Duration (Months)</Label>
                          <Input
                            id="newDuration"
                            type="number"
                            value={leaseData.leaseDuration}
                            onChange={(e) => setLeaseData({ ...leaseData, leaseDuration: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>

                      <Button onClick={handleRenewLease} disabled={loading} className="w-full">
                        {loading ? 'Renewing...' : 'Renew Lease'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        Lease Termination
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertDescription className="text-amber-900">
                          Terminating a lease will mark the tenancy as complete and optionally re-list the property.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => handleTerminateLease(true)}
                          disabled={loading}
                          className="flex-1"
                        >
                          Terminate & Re-list
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleTerminateLease(false)}
                          disabled={loading}
                          className="flex-1"
                        >
                          Terminate Only
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {property.status !== 'rented' && (
                <Alert>
                  <AlertDescription>
                    Lease management features are only available for properties with active tenancies.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
