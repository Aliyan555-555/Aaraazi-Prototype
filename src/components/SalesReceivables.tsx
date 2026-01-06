import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User } from '../types';
import { 
  DollarSign,
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Building,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowLeft,
  UserCheck,
  Calculator,
  Info
} from 'lucide-react';

interface SalesReceivablesProps {
  user: User;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchased: number;
  totalPaid: number;
  balance: number;
  units: ClientUnit[];
  paymentHistory: PaymentRecord[];
  lateCharges: LateCharge[];
  creditRating: 'excellent' | 'good' | 'fair' | 'poor';
  lastPaymentDate: string;
}

interface ClientUnit {
  id: string;
  unitNumber: string;
  projectName: string;
  unitType: string;
  totalPrice: number;
  amountPaid: number;
  balance: number;
  status: 'sold-fully-paid' | 'sold-installments' | 'booked-overdue' | 'available';
  installmentPlan: InstallmentPlan;
}

interface InstallmentPlan {
  totalInstallments: number;
  paidInstallments: number;
  nextDueDate: string;
  nextAmount: number;
  monthlyAmount: number;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'bank-transfer' | 'check' | 'cash' | 'credit-card';
  description: string;
  unitNumber?: string;
  receiptNumber: string;
}

interface LateCharge {
  id: string;
  date: string;
  amount: number;
  reason: string;
  unitNumber: string;
  isPaid: boolean;
}

interface ARAgingData {
  clientId: string;
  clientName: string;
  totalBalance: number;
  current: number; // 0-30 days
  days31to60: number;
  days61to90: number;
  over90Days: number;
  lastPaymentDate: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const SalesReceivables: React.FC<SalesReceivablesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('ar-aging');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock client data
  const clients: Client[] = [
    {
      id: '1',
      name: 'Johnson Family Trust',
      email: 'contact@johnsonfamily.com',
      phone: '+1-555-0123',
      totalPurchased: 285000,
      totalPaid: 198000,
      balance: 87000,
      creditRating: 'excellent',
      lastPaymentDate: '2024-01-10',
      units: [
        {
          id: 'u1',
          unitNumber: 'A-1201',
          projectName: 'Downtown Towers Phase 1',
          unitType: '3BHK Premium',
          totalPrice: 185000,
          amountPaid: 125000,
          balance: 60000,
          status: 'sold-installments',
          installmentPlan: {
            totalInstallments: 12,
            paidInstallments: 8,
            nextDueDate: '2024-02-15',
            nextAmount: 15000,
            monthlyAmount: 15000
          }
        },
        {
          id: 'u2',
          unitNumber: 'B-805',
          projectName: 'Riverside Villa Community',
          unitType: '2BHK Standard',
          totalPrice: 100000,
          amountPaid: 73000,
          balance: 27000,
          status: 'sold-installments',
          installmentPlan: {
            totalInstallments: 8,
            paidInstallments: 6,
            nextDueDate: '2024-01-28',
            nextAmount: 13500,
            monthlyAmount: 13500
          }
        }
      ],
      paymentHistory: [
        {
          id: 'p1',
          date: '2024-01-10',
          amount: 15000,
          method: 'bank-transfer',
          description: 'Monthly installment - Unit A-1201',
          unitNumber: 'A-1201',
          receiptNumber: 'RCP-2024-001'
        },
        {
          id: 'p2',
          date: '2023-12-15',
          amount: 13500,
          method: 'bank-transfer',
          description: 'Monthly installment - Unit B-805',
          unitNumber: 'B-805',
          receiptNumber: 'RCP-2023-156'
        }
      ],
      lateCharges: [
        {
          id: 'lc1',
          date: '2023-11-20',
          amount: 750,
          reason: 'Late payment fee - 5 days overdue',
          unitNumber: 'A-1201',
          isPaid: true
        }
      ]
    },
    {
      id: '2',
      name: 'Metro Investments LLC',
      email: 'finance@metroinvest.com',
      phone: '+1-555-0456',
      totalPurchased: 320000,
      totalPaid: 320000,
      balance: 0,
      creditRating: 'excellent',
      lastPaymentDate: '2023-12-20',
      units: [
        {
          id: 'u3',
          unitNumber: 'A-0801',
          projectName: 'Downtown Towers Phase 1',
          unitType: '2BHK Standard',
          totalPrice: 145000,
          amountPaid: 145000,
          balance: 0,
          status: 'sold-fully-paid',
          installmentPlan: {
            totalInstallments: 1,
            paidInstallments: 1,
            nextDueDate: '',
            nextAmount: 0,
            monthlyAmount: 0
          }
        },
        {
          id: 'u4',
          unitNumber: 'C-1504',
          projectName: 'Metro Commercial Complex',
          unitType: 'Office Space',
          totalPrice: 175000,
          amountPaid: 175000,
          balance: 0,
          status: 'sold-fully-paid',
          installmentPlan: {
            totalInstallments: 1,
            paidInstallments: 1,
            nextDueDate: '',
            nextAmount: 0,
            monthlyAmount: 0
          }
        }
      ],
      paymentHistory: [
        {
          id: 'p3',
          date: '2023-12-20',
          amount: 145000,
          method: 'bank-transfer',
          description: 'Full payment - Unit A-0801',
          unitNumber: 'A-0801',
          receiptNumber: 'RCP-2023-145'
        }
      ],
      lateCharges: []
    },
    {
      id: '3',
      name: 'Capital Properties Group',
      email: 'accounts@capitalproperties.com',
      phone: '+1-555-0789',
      totalPurchased: 450000,
      totalPaid: 275000,
      balance: 175000,
      creditRating: 'fair',
      lastPaymentDate: '2023-10-15',
      units: [
        {
          id: 'u5',
          unitNumber: 'A-2401',
          projectName: 'Downtown Towers Phase 1',
          unitType: '4BHK Penthouse',
          totalPrice: 450000,
          amountPaid: 275000,
          balance: 175000,
          status: 'booked-overdue',
          installmentPlan: {
            totalInstallments: 24,
            paidInstallments: 14,
            nextDueDate: '2023-11-15',
            nextAmount: 17500,
            monthlyAmount: 17500
          }
        }
      ],
      paymentHistory: [
        {
          id: 'p4',
          date: '2023-10-15',
          amount: 17500,
          method: 'check',
          description: 'Monthly installment - Unit A-2401',
          unitNumber: 'A-2401',
          receiptNumber: 'RCP-2023-098'
        }
      ],
      lateCharges: [
        {
          id: 'lc2',
          date: '2023-12-01',
          amount: 2100,
          reason: 'Late payment fee - 15 days overdue',
          unitNumber: 'A-2401',
          isPaid: false
        },
        {
          id: 'lc3',
          date: '2024-01-01',
          amount: 3500,
          reason: 'Extended overdue penalty - 45 days',
          unitNumber: 'A-2401',
          isPaid: false
        }
      ]
    }
  ];

  // Calculate AR Aging data
  const arAgingData: ARAgingData[] = useMemo(() => {
    return clients.filter(client => client.balance > 0).map(client => {
      const daysSinceLastPayment = Math.floor((new Date().getTime() - new Date(client.lastPaymentDate).getTime()) / (1000 * 3600 * 24));
      
      let current = 0, days31to60 = 0, days61to90 = 0, over90Days = 0;
      
      if (daysSinceLastPayment <= 30) {
        current = client.balance;
      } else if (daysSinceLastPayment <= 60) {
        days31to60 = client.balance;
      } else if (daysSinceLastPayment <= 90) {
        days61to90 = client.balance;
      } else {
        over90Days = client.balance;
      }

      const riskLevel: 'low' | 'medium' | 'high' = 
        daysSinceLastPayment > 90 ? 'high' :
        daysSinceLastPayment > 60 ? 'medium' : 'low';

      return {
        clientId: client.id,
        clientName: client.name,
        totalBalance: client.balance,
        current,
        days31to60,
        days61to90,
        over90Days,
        lastPaymentDate: client.lastPaymentDate,
        riskLevel
      };
    });
  }, [clients]);

  // Mock inventory units for financial status view
  const inventoryUnits = useMemo(() => {
    const allUnits = clients.flatMap(client => client.units);
    
    // Add some available units
    const availableUnits = [
      { id: 'av1', unitNumber: 'A-1001', projectName: 'Downtown Towers Phase 1', unitType: '2BHK Standard', totalPrice: 145000, status: 'available' as const },
      { id: 'av2', unitNumber: 'A-1002', projectName: 'Downtown Towers Phase 1', unitType: '2BHK Standard', totalPrice: 145000, status: 'available' as const },
      { id: 'av3', unitNumber: 'B-501', projectName: 'Riverside Villa Community', unitType: '3BHK Villa', totalPrice: 200000, status: 'available' as const },
      { id: 'av4', unitNumber: 'B-502', projectName: 'Riverside Villa Community', unitType: '3BHK Villa', totalPrice: 200000, status: 'available' as const },
      { id: 'av5', unitNumber: 'C-1001', projectName: 'Metro Commercial Complex', unitType: 'Office Space', totalPrice: 125000, status: 'available' as const }
    ];

    return [...allUnits, ...availableUnits];
  }, [clients]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold-fully-paid':
        return 'bg-green-500';
      case 'sold-installments':
        return 'bg-blue-500';
      case 'available':
        return 'bg-gray-300';
      case 'booked-overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sold-fully-paid':
        return 'Sold & Fully Paid';
      case 'sold-installments':
        return 'Sold & Installments Ongoing';
      case 'available':
        return 'Available for Sale';
      case 'booked-overdue':
        return 'Booked but Overdue/On Hold';
      default:
        return status;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[riskLevel as keyof typeof colors] || colors.low;
  };

  const getCreditRatingBadge = (rating: string) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return colors[rating as keyof typeof colors] || colors.fair;
  };

  // Mock agents data for the sales & commission assignment
  const availableAgents = [
    { id: '1', name: 'Sarah Johnson', type: 'In-house', defaultRate: 3.0 },
    { id: '2', name: 'Michael Chen', type: 'In-house', defaultRate: 3.0 },
    { id: '3', name: 'Emily Rodriguez', type: 'External Broker', defaultRate: 4.5 },
    { id: '4', name: 'David Thompson', type: 'In-house', defaultRate: 3.0 },
    { id: '5', name: 'Lisa Park', type: 'External Broker', defaultRate: 4.5 }
  ];

  // New Client Booking Form State
  const [bookingForm, setBookingForm] = useState({
    // Client Information
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    
    // Property Information
    propertyProject: '',
    unitNumber: '',
    unitType: '',
    totalSalePrice: '',
    downPayment: '',
    
    // Payment Plan
    paymentPlan: 'installments', // 'full' or 'installments'
    installmentDuration: '12',
    installmentAmount: '',
    
    // Sales & Commission Assignment
    soldBy: '',
    commissionAgreement: '% of Total Sale Value', // '% of Total Sale Value' or 'Fixed Amount'
    rateAmount: '',
    commissionPayoutTrigger: 'Pro-Rata with Client Payments',
    
    // Additional Details
    notes: '',
    saleDate: new Date().toISOString().split('T')[0]
  });

  const handleBookingFormChange = (field: string, value: any) => {
    setBookingForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate commission rate when agent is selected
      if (field === 'soldBy') {
        const selectedAgent = availableAgents.find(agent => agent.id === value);
        if (selectedAgent && updated.commissionAgreement === '% of Total Sale Value') {
          updated.rateAmount = selectedAgent.defaultRate.toString();
        }
      }
      
      // Calculate installment amount when relevant fields change
      if (field === 'totalSalePrice' || field === 'downPayment' || field === 'installmentDuration') {
        const totalPrice = parseFloat(updated.totalSalePrice || '0');
        const downPayment = parseFloat(updated.downPayment || '0');
        const duration = parseInt(updated.installmentDuration || '12');
        
        if (totalPrice > 0 && downPayment >= 0 && duration > 0) {
          const remainingAmount = totalPrice - downPayment;
          const monthlyInstallment = remainingAmount / duration;
          updated.installmentAmount = monthlyInstallment.toFixed(2);
        }
      }
      
      return updated;
    });
  };

  const handleBookingSubmit = () => {
    // Here we would save the booking and create commission ledger entry
    console.log('New booking submitted:', bookingForm);
    setShowBookingForm(false);
    // Reset form
    setBookingForm({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      propertyProject: '',
      unitNumber: '',
      unitType: '',
      totalSalePrice: '',
      downPayment: '',
      paymentPlan: 'installments',
      installmentDuration: '12',
      installmentAmount: '',
      soldBy: '',
      commissionAgreement: '% of Total Sale Value',
      rateAmount: '',
      commissionPayoutTrigger: 'Pro-Rata with Client Payments',
      notes: '',
      saleDate: new Date().toISOString().split('T')[0]
    });
  };

  const renderNewClientBooking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setShowBookingForm(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales & Receivables
          </Button>
          <div>
            <h2 className="text-xl font-bold">New Client Booking</h2>
            <p className="text-gray-600">Record a new property sale with commission assignment</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Client Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={bookingForm.clientName}
                    onChange={(e) => handleBookingFormChange('clientName', e.target.value)}
                    placeholder="Full name or company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email Address *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={bookingForm.clientEmail}
                    onChange={(e) => handleBookingFormChange('clientEmail', e.target.value)}
                    placeholder="client@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone Number *</Label>
                  <Input
                    id="clientPhone"
                    value={bookingForm.clientPhone}
                    onChange={(e) => handleBookingFormChange('clientPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleDate">Sale Date *</Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={bookingForm.saleDate}
                    onChange={(e) => handleBookingFormChange('saleDate', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  value={bookingForm.clientAddress}
                  onChange={(e) => handleBookingFormChange('clientAddress', e.target.value)}
                  placeholder="Full address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Property Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyProject">Project Name *</Label>
                  <Select value={bookingForm.propertyProject} onValueChange={(value) => handleBookingFormChange('propertyProject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown-towers">Downtown Towers Phase 1</SelectItem>
                      <SelectItem value="riverside-villas">Riverside Villa Community</SelectItem>
                      <SelectItem value="metro-complex">Metro Commercial Complex</SelectItem>
                      <SelectItem value="sunset-heights">Sunset Heights</SelectItem>
                      <SelectItem value="garden-plaza">Garden Plaza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit Number *</Label>
                  <Input
                    id="unitNumber"
                    value={bookingForm.unitNumber}
                    onChange={(e) => handleBookingFormChange('unitNumber', e.target.value)}
                    placeholder="e.g., A-1201, B-805"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type *</Label>
                  <Select value={bookingForm.unitType} onValueChange={(value) => handleBookingFormChange('unitType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1bhk">1BHK</SelectItem>
                      <SelectItem value="2bhk-standard">2BHK Standard</SelectItem>
                      <SelectItem value="2bhk-premium">2BHK Premium</SelectItem>
                      <SelectItem value="3bhk-standard">3BHK Standard</SelectItem>
                      <SelectItem value="3bhk-premium">3BHK Premium</SelectItem>
                      <SelectItem value="4bhk-penthouse">4BHK Penthouse</SelectItem>
                      <SelectItem value="office-space">Office Space</SelectItem>
                      <SelectItem value="retail-shop">Retail Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSalePrice">Total Sale Price *</Label>
                  <Input
                    id="totalSalePrice"
                    type="number"
                    value={bookingForm.totalSalePrice}
                    onChange={(e) => handleBookingFormChange('totalSalePrice', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Payment Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Type *</Label>
                <Select value={bookingForm.paymentPlan} onValueChange={(value) => handleBookingFormChange('paymentPlan', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="installments">Installment Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {bookingForm.paymentPlan === 'installments' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="downPayment">Down Payment</Label>
                      <Input
                        id="downPayment"
                        type="number"
                        value={bookingForm.downPayment}
                        onChange={(e) => handleBookingFormChange('downPayment', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="installmentDuration">Duration (Months)</Label>
                      <Select value={bookingForm.installmentDuration} onValueChange={(value) => handleBookingFormChange('installmentDuration', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="18">18 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="installmentAmount">Monthly Installment</Label>
                      <Input
                        id="installmentAmount"
                        type="number"
                        value={bookingForm.installmentAmount}
                        onChange={(e) => handleBookingFormChange('installmentAmount', e.target.value)}
                        placeholder="Auto-calculated"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Sales & Commission Assignment */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800">Sales & Commission Assignment</span>
              </CardTitle>
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Developer Note:</strong> When a sale is saved, the system will automatically create a linked entry in the 'Commission Ledger' based on these details, in addition to creating the client's payment schedule.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soldBy">Sold By *</Label>
                  <Select value={bookingForm.soldBy} onValueChange={(value) => handleBookingFormChange('soldBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search and select agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{agent.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {agent.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionAgreement">Commission Agreement *</Label>
                  <Select value={bookingForm.commissionAgreement} onValueChange={(value) => handleBookingFormChange('commissionAgreement', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="% of Total Sale Value">% of Total Sale Value</SelectItem>
                      <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateAmount">
                    {bookingForm.commissionAgreement === 'Fixed Amount' ? 'Commission Amount' : 'Commission Rate (%)'}
                  </Label>
                  <Input
                    id="rateAmount"
                    type="number"
                    step={bookingForm.commissionAgreement === 'Fixed Amount' ? '1' : '0.1'}
                    value={bookingForm.rateAmount}
                    onChange={(e) => handleBookingFormChange('rateAmount', e.target.value)}
                    placeholder={bookingForm.commissionAgreement === 'Fixed Amount' ? '0' : '3.0'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionPayoutTrigger">Commission Payout Trigger *</Label>
                  <Select value={bookingForm.commissionPayoutTrigger} onValueChange={(value) => handleBookingFormChange('commissionPayoutTrigger', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pro-Rata with Client Payments">
                        <div>
                          <p>Pro-Rata with Client Payments</p>
                          <p className="text-xs text-gray-500">Standard in Karachi: If client pays 20%, 20% of commission is accrued</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="On 50% Client Payment">On 50% Client Payment</SelectItem>
                      <SelectItem value="On Possession">On Possession</SelectItem>
                      <SelectItem value="On Full and Final Payment">On Full and Final Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={bookingForm.notes}
                  onChange={(e) => handleBookingFormChange('notes', e.target.value)}
                  placeholder="Any additional information about this sale..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sale Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sale Price:</span>
                  <span className="font-medium">${parseFloat(bookingForm.totalSalePrice || '0').toLocaleString()}</span>
                </div>
                {bookingForm.downPayment && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium">${parseFloat(bookingForm.downPayment || '0').toLocaleString()}</span>
                  </div>
                )}
                {bookingForm.paymentPlan === 'installments' && bookingForm.installmentAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Installment:</span>
                    <span className="font-medium">${parseFloat(bookingForm.installmentAmount || '0').toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              {bookingForm.soldBy && bookingForm.rateAmount && (
                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-medium text-blue-600">Commission Details</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agent:</span>
                    <span className="font-medium">{availableAgents.find(a => a.id === bookingForm.soldBy)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium">
                      {bookingForm.commissionAgreement === 'Fixed Amount' 
                        ? `${parseFloat(bookingForm.rateAmount || '0').toLocaleString()}`
                        : `${bookingForm.rateAmount}% (${(parseFloat(bookingForm.totalSalePrice || '0') * parseFloat(bookingForm.rateAmount || '0') / 100).toLocaleString()})`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payout Trigger:</span>
                    <span className="font-medium text-xs">{bookingForm.commissionPayoutTrigger}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button 
              onClick={handleBookingSubmit} 
              className="w-full"
              disabled={!bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.propertyProject || !bookingForm.totalSalePrice || !bookingForm.soldBy || !bookingForm.rateAmount}
            >
              Save Sale & Create Commission Entry
            </Button>
            <Button variant="outline" onClick={() => setShowBookingForm(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderARAgingReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total AR Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${arAgingData.reduce((sum, item) => sum + item.totalBalance, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current (0-30 days)</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${arAgingData.reduce((sum, item) => sum + item.current, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">31-90 days</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${arAgingData.reduce((sum, item) => sum + item.days31to60 + item.days61to90, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Over 90 days</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${arAgingData.reduce((sum, item) => sum + item.over90Days, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AR Aging Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accounts Receivable Aging Report</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Total Balance</TableHead>
                <TableHead>Current (0-30)</TableHead>
                <TableHead>31-60 Days</TableHead>
                <TableHead>61-90 Days</TableHead>
                <TableHead>Over 90 Days</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arAgingData.map((item) => (
                <TableRow key={item.clientId}>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell className="font-bold">${item.totalBalance.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">${item.current.toLocaleString()}</TableCell>
                  <TableCell className="text-yellow-600">${item.days31to60.toLocaleString()}</TableCell>
                  <TableCell className="text-orange-600">${item.days61to90.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">${item.over90Days.toLocaleString()}</TableCell>
                  <TableCell>{item.lastPaymentDate}</TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(item.riskLevel)}>
                      {item.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const client = clients.find(c => c.id === item.clientId);
                        if (client) {
                          setSelectedClient(client);
                          setActiveTab('client-ledger');
                        }
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientLedger = () => {
    if (!selectedClient) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Ledger - Select a Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedClient(client)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                        <Badge className={getCreditRatingBadge(client.creditRating)}>
                          {client.creditRating}
                        </Badge>
                      </div>
                      <div className="mt-3 text-sm">
                        <p>Balance: <span className="font-medium">${client.balance.toLocaleString()}</span></p>
                        <p>Units: <span className="font-medium">{client.units.length}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const totalLateCharges = selectedClient.lateCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const unpaidLateCharges = selectedClient.lateCharges.filter(charge => !charge.isPaid).reduce((sum, charge) => sum + charge.amount, 0);

    return (
      <div className="space-y-6">
        {/* Client Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Client Statement of Account</CardTitle>
                <p className="text-gray-600">{selectedClient.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setSelectedClient(null)} variant="outline">
                  Back to Clients
                </Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Statement
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Contact Information</p>
                <p className="font-medium">{selectedClient.email}</p>
                <p className="text-sm text-gray-500">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Credit Rating</p>
                <Badge className={getCreditRatingBadge(selectedClient.creditRating)}>
                  {selectedClient.creditRating}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Payment</p>
                <p className="font-medium">{selectedClient.lastPaymentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="font-bold text-red-600">${selectedClient.balance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Purchased</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedClient.totalPurchased.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedClient.totalPaid.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Balance Due</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedClient.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-50">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Late Charges</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalLateCharges.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600">
                    ${unpaidLateCharges.toLocaleString()} unpaid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unit Details */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Number</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedClient.units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                    <TableCell>{unit.projectName}</TableCell>
                    <TableCell>{unit.unitType}</TableCell>
                    <TableCell>${unit.totalPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">${unit.amountPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">${unit.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {unit.installmentPlan.nextDueDate ? (
                        <div>
                          <p className="font-medium">${unit.installmentPlan.nextAmount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{unit.installmentPlan.nextDueDate}</p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(unit.status)} text-white`}>
                        {getStatusLabel(unit.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Receipt #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedClient.paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{payment.unitNumber || '-'}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.method}</Badge>
                    </TableCell>
                    <TableCell>{payment.receiptNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Late Charges */}
        {selectedClient.lateCharges.length > 0 && (
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-700">Late Payment Surcharges</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClient.lateCharges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell>{charge.date}</TableCell>
                      <TableCell>{charge.unitNumber}</TableCell>
                      <TableCell>{charge.reason}</TableCell>
                      <TableCell className="font-medium text-orange-600">
                        ${charge.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={charge.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {charge.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderInventoryFinancialStatus = () => (
    <div className="space-y-6">
      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Financial Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Sold & Fully Paid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Sold & Installments Ongoing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm">Available for Sale</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Booked but Overdue/On Hold</span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sold-fully-paid">Sold & Fully Paid</SelectItem>
                <SelectItem value="sold-installments">Sold & Installments</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked-overdue">Booked but Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unit Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {inventoryUnits
              .filter(unit => 
                (filterStatus === 'all' || unit.status === filterStatus) &&
                (searchTerm === '' || unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((unit) => (
                <TooltipProvider key={unit.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          ${getStatusColor(unit.status)} 
                          aspect-square rounded-lg flex items-center justify-center 
                          cursor-pointer hover:opacity-80 transition-opacity
                          text-white font-medium text-sm
                        `}
                      >
                        {unit.unitNumber}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-medium">{unit.unitNumber}</p>
                        <p className="text-sm text-gray-600">{unit.projectName}</p>
                        <p className="text-sm text-gray-600">{unit.unitType}</p>
                        <p className="font-medium">${unit.totalPrice.toLocaleString()}</p>
                        <p className="text-sm">{getStatusLabel(unit.status)}</p>
                        {'amountPaid' in unit && unit.amountPaid > 0 && (
                          <p className="text-sm text-green-600">
                            Paid: ${unit.amountPaid.toLocaleString()}
                          </p>
                        )}
                        {'balance' in unit && unit.balance > 0 && (
                          <p className="text-sm text-red-600">
                            Balance: ${unit.balance.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fully Paid Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryUnits.filter(u => u.status === 'sold-fully-paid').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Installment Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryUnits.filter(u => u.status === 'sold-installments').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-50">
                <Building className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryUnits.filter(u => u.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryUnits.filter(u => u.status === 'booked-overdue').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6">

      {!showBookingForm && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sales & Receivables Management</h1>
            <p className="text-gray-600">
              {user.role === 'admin' ? 'Manage all client accounts and receivables' : 'View client payment status and collections'}
            </p>
          </div>
          <Button onClick={() => setShowBookingForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Client Booking
          </Button>
        </div>
      )}

      {showBookingForm ? (
        renderNewClientBooking()
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ar-aging">AR Aging Report</TabsTrigger>
            <TabsTrigger value="client-ledger">Client Ledger</TabsTrigger>
            <TabsTrigger value="inventory-status">Inventory Financial Status</TabsTrigger>
          </TabsList>

        <TabsContent value="ar-aging" className="space-y-6">
          {renderARAgingReport()}
        </TabsContent>

        <TabsContent value="client-ledger" className="space-y-6">
          {renderClientLedger()}
        </TabsContent>

        <TabsContent value="inventory-status" className="space-y-6">
          {renderInventoryFinancialStatus()}
        </TabsContent>
        </Tabs>
      )}
    </div>
  );
};