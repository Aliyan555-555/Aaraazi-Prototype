import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  UserCheck,
  Calculator,
  Percent,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Award,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Users,
  Building2,
  Home,
  Plus,
  X,
  Save,
  Send,
  Printer,
  Download
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface EnhancedUnit {
  id: string;
  projectId: string;
  unitNumber: string;
  block?: string;
  floor?: number;
  unitType: 'studio' | '1br' | '2br' | '3br' | '4br' | 'penthouse' | 'commercial' | 'parking';
  area: number;
  builtUpArea?: number;
  balconyArea?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  basePrice: number;
  currentPrice: number;
  pricePerSqft: number;
  status: 'available' | 'blocked' | 'reserved' | 'booked' | 'sold' | 'handed-over';
  amenities: string[];
  facing: 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
  view: string[];
  priority: 'standard' | 'premium' | 'luxury';
  readyForHandover: boolean;
  handoverDate?: string;
}

interface CustomerProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  cnic: string;
  address: string;
  city: string;
  occupation: string;
  monthlyIncome?: number;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  languagePreference: 'english' | 'urdu';
  source: 'walk-in' | 'referral' | 'online' | 'advertisement' | 'social-media' | 'other';
  creditScore?: number;
  bankingRelationship?: string;
  previousProjects?: string[];
  tags: string[];
  notes: string[];
}

interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  description: string;
  type: 'booking' | 'down-payment' | 'construction-linked' | 'possession' | 'final';
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'waived';
}

interface BookingFormData {
  customer: CustomerProfile;
  totalAmount: number;
  discountAmount: number;
  discountReason: string;
  finalAmount: number;
  paymentPlan: {
    type: 'lump-sum' | 'installments' | 'construction-linked' | 'possession-linked';
    downPaymentPercentage: number;
    installmentCount: number;
    installments: PaymentInstallment[];
  };
  referredBy?: string;
  commissionRate: number;
  specialTerms: string[];
  urgency: 'low' | 'medium' | 'high';
  followUpDate: string;
  salesNotes: string;
  competitorComparison?: {
    competitorName: string;
    competitorPrice: number;
    advantages: string[];
  };
}

interface EnhancedBookingFormProps {
  unit: EnhancedUnit;
  existingCustomers: CustomerProfile[];
  onSave: (bookingData: BookingFormData) => void;
  onCancel: () => void;
  open: boolean;
}

const PAYMENT_PLAN_TEMPLATES = {
  'standard-residential': {
    name: 'Standard Residential',
    downPayment: 20,
    installments: [
      { percentage: 20, description: 'Booking Amount', timing: 'immediate' },
      { percentage: 30, description: 'Down Payment', timing: '30 days' },
      { percentage: 40, description: 'Construction Linked', timing: 'progress-based' },
      { percentage: 10, description: 'On Possession', timing: 'handover' }
    ]
  },
  'luxury-residential': {
    name: 'Luxury Residential',
    downPayment: 30,
    installments: [
      { percentage: 10, description: 'Booking Amount', timing: 'immediate' },
      { percentage: 20, description: 'Down Payment', timing: '30 days' },
      { percentage: 50, description: 'Construction Linked', timing: 'progress-based' },
      { percentage: 20, description: 'On Possession', timing: 'handover' }
    ]
  },
  'commercial': {
    name: 'Commercial',
    downPayment: 40,
    installments: [
      { percentage: 20, description: 'Booking Amount', timing: 'immediate' },
      { percentage: 20, description: 'Down Payment', timing: '45 days' },
      { percentage: 40, description: 'Construction Linked', timing: 'progress-based' },
      { percentage: 20, description: 'On Possession', timing: 'handover' }
    ]
  }
};

const CUSTOMER_SOURCES = [
  { value: 'walk-in', label: 'Walk-in', icon: User },
  { value: 'referral', label: 'Referral', icon: Users },
  { value: 'online', label: 'Online', icon: TrendingUp },
  { value: 'advertisement', label: 'Advertisement', icon: Target },
  { value: 'social-media', label: 'Social Media', icon: Star },
  { value: 'other', label: 'Other', icon: Building2 }
];

export const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  unit,
  existingCustomers,
  onSave,
  onCancel,
  open
}) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    customer: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      cnic: '',
      address: '',
      city: 'Karachi',
      occupation: '',
      monthlyIncome: 0,
      preferredContactMethod: 'phone',
      languagePreference: 'english',
      source: 'walk-in',
      tags: [],
      notes: []
    },
    totalAmount: unit.currentPrice,
    discountAmount: 0,
    discountReason: '',
    finalAmount: unit.currentPrice,
    paymentPlan: {
      type: 'installments',
      downPaymentPercentage: 20,
      installmentCount: 4,
      installments: []
    },
    commissionRate: 2.0,
    specialTerms: [],
    urgency: 'medium',
    followUpDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    salesNotes: ''
  });

  const [priceAdjustments, setPriceAdjustments] = useState({
    parkingPremium: 0,
    floorPremium: 0,
    facingPremium: 0,
    amenityPremium: 0
  });
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    calculateInstallments();
  }, [formData.finalAmount, formData.paymentPlan.type, formData.paymentPlan.downPaymentPercentage]);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer: selectedCustomer
      }));
    }
  }, [selectedCustomer]);

  const calculateInstallments = () => {
    const planType = unit.unitType.includes('commercial') ? 'commercial' : 
                    unit.priority === 'luxury' ? 'luxury-residential' : 'standard-residential';
    
    const template = PAYMENT_PLAN_TEMPLATES[planType];
    const installments: PaymentInstallment[] = template.installments.map((inst, index) => ({
      id: `inst-${index + 1}`,
      installmentNumber: index + 1,
      amount: Math.round((formData.finalAmount * inst.percentage) / 100),
      dueDate: calculateDueDate(inst.timing, index),
      description: inst.description,
      type: getInstallmentType(inst.description),
      status: 'pending'
    }));

    setFormData(prev => ({
      ...prev,
      paymentPlan: {
        ...prev.paymentPlan,
        installments
      }
    }));
  };

  const calculateDueDate = (timing: string, index: number): string => {
    const baseDate = new Date();
    switch (timing) {
      case 'immediate':
        return format(baseDate, 'yyyy-MM-dd');
      case '30 days':
        return format(addDays(baseDate, 30), 'yyyy-MM-dd');
      case '45 days':
        return format(addDays(baseDate, 45), 'yyyy-MM-dd');
      case 'progress-based':
        return format(addDays(baseDate, 90 + (index * 90)), 'yyyy-MM-dd');
      case 'handover':
        return unit.handoverDate || format(addDays(baseDate, 365), 'yyyy-MM-dd');
      default:
        return format(addDays(baseDate, index * 30), 'yyyy-MM-dd');
    }
  };

  const getInstallmentType = (description: string): PaymentInstallment['type'] => {
    if (description.includes('Booking')) return 'booking';
    if (description.includes('Down')) return 'down-payment';
    if (description.includes('Construction')) return 'construction-linked';
    if (description.includes('Possession')) return 'possession';
    return 'final';
  };

  const handlePriceAdjustment = () => {
    const totalAdjustment = Object.values(priceAdjustments).reduce((sum, val) => sum + val, 0);
    const adjustedPrice = unit.currentPrice + totalAdjustment;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: adjustedPrice,
      finalAmount: adjustedPrice - prev.discountAmount
    }));
  };

  const applyDiscount = (amount: number, reason: string) => {
    setFormData(prev => ({
      ...prev,
      discountAmount: amount,
      discountReason: reason,
      finalAmount: prev.totalAmount - amount
    }));
  };

  const getCustomerCreditScore = (income: number, occupation: string): number => {
    let baseScore = 650;
    
    // Income-based adjustments
    if (income >= 200000) baseScore += 100;
    else if (income >= 100000) baseScore += 50;
    else if (income >= 50000) baseScore += 25;
    
    // Occupation-based adjustments
    const highValueOccupations = ['doctor', 'engineer', 'banker', 'government', 'business'];
    if (highValueOccupations.some(occ => occupation.toLowerCase().includes(occ))) {
      baseScore += 50;
    }
    
    return Math.min(850, Math.max(300, baseScore));
  };

  const validateBooking = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.customer.name.trim()) errors.push('Customer name is required');
    if (!formData.customer.phone.trim()) errors.push('Customer phone is required');
    if (!formData.customer.cnic.trim()) errors.push('Customer CNIC is required');
    if (formData.customer.cnic.length !== 13) errors.push('CNIC must be 13 digits');
    if (!formData.customer.email.includes('@')) errors.push('Valid email is required');
    
    if (formData.paymentPlan.installments.length === 0) {
      errors.push('Payment plan is required');
    }
    
    const totalInstallments = formData.paymentPlan.installments.reduce((sum, inst) => sum + inst.amount, 0);
    if (Math.abs(totalInstallments - formData.finalAmount) > 100) {
      errors.push('Installment amounts do not match final amount');
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateBooking();
    if (errors.length > 0) {
      toast.error(`Please fix the following errors:\n${errors.join('\n')}`);
      return;
    }

    // Add credit score if not existing customer
    if (!isExistingCustomer && formData.customer.monthlyIncome) {
      formData.customer.creditScore = getCustomerCreditScore(
        formData.customer.monthlyIncome, 
        formData.customer.occupation
      );
    }

    onSave(formData);
    toast.success('Booking created successfully!');
  };

  const renderCustomerTab = () => (
    <div className="space-y-6">
      {/* Existing vs New Customer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isExistingCustomer}
                onCheckedChange={setIsExistingCustomer}
              />
              <Label>Existing Customer</Label>
            </div>
            {isExistingCustomer && (
              <Select onValueChange={(value) => {
                const customer = existingCustomers.find(c => c.id === value);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {existingCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id!}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customer.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, name: e.target.value }
                }))}
                placeholder="Enter full name..."
                disabled={isExistingCustomer}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerCnic">CNIC *</Label>
              <Input
                id="customerCnic"
                value={formData.customer.cnic}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, cnic: e.target.value }
                }))}
                placeholder="13-digit CNIC..."
                maxLength={13}
                disabled={isExistingCustomer}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Primary Phone *</Label>
              <Input
                id="customerPhone"
                value={formData.customer.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, phone: e.target.value }
                }))}
                placeholder="+92 300 1234567"
                disabled={isExistingCustomer}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.customer.alternatePhone || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, alternatePhone: e.target.value }
                }))}
                placeholder="+92 321 1234567"
                disabled={isExistingCustomer}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customer.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                customer: { ...prev.customer, email: e.target.value }
              }))}
              placeholder="customer@example.com"
              disabled={isExistingCustomer}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea
              id="customerAddress"
              value={formData.customer.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                customer: { ...prev.customer, address: e.target.value }
              }))}
              placeholder="Complete address..."
              disabled={isExistingCustomer}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.customer.occupation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, occupation: e.target.value }
                }))}
                placeholder="e.g., Engineer, Doctor..."
                disabled={isExistingCustomer}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (PKR)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={formData.customer.monthlyIncome || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, monthlyIncome: parseFloat(e.target.value) || 0 }
                }))}
                placeholder="100000"
                disabled={isExistingCustomer}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Select
                value={formData.customer.source}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, source: value as any }
                }))}
                disabled={isExistingCustomer}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_SOURCES.map(source => {
                    const Icon = source.icon;
                    return (
                      <SelectItem key={source.value} value={source.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{source.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Insights */}
          {formData.customer.monthlyIncome > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Customer Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Estimated Credit Score:</span>
                    <p className="font-semibold text-blue-900">
                      {getCustomerCreditScore(formData.customer.monthlyIncome, formData.customer.occupation)}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Affordability:</span>
                    <p className="font-semibold text-blue-900">
                      {formatPKR(formData.customer.monthlyIncome * 60)} (5x annual)
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Risk Level:</span>
                    <Badge className={
                      formData.customer.monthlyIncome >= 150000 ? 'bg-green-100 text-green-800' :
                      formData.customer.monthlyIncome >= 75000 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {formData.customer.monthlyIncome >= 150000 ? 'Low' :
                       formData.customer.monthlyIncome >= 75000 ? 'Medium' : 'High'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      {/* Unit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Home className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="font-semibold">{unit.unitNumber}</p>
              <p className="text-xs text-muted-foreground">{unit.unitType}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="font-semibold">{unit.area} sqft</p>
              <p className="text-xs text-muted-foreground">Total Area</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="font-semibold">{unit.facing}</p>
              <p className="text-xs text-muted-foreground">Facing</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Star className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="font-semibold capitalize">{unit.priority}</p>
              <p className="text-xs text-muted-foreground">Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Calculator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Price Calculator</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {showCalculator ? 'Hide' : 'Show'} Calculator
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Base Price:</span>
              <span className="font-semibold text-lg">{formatPKR(unit.currentPrice)}</span>
            </div>

            {showCalculator && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Price Adjustments</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Parking Premium (PKR)</Label>
                    <Input
                      type="number"
                      value={priceAdjustments.parkingPremium}
                      onChange={(e) => setPriceAdjustments(prev => ({
                        ...prev,
                        parkingPremium: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Floor Premium (PKR)</Label>
                    <Input
                      type="number"
                      value={priceAdjustments.floorPremium}
                      onChange={(e) => setPriceAdjustments(prev => ({
                        ...prev,
                        floorPremium: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Facing Premium (PKR)</Label>
                    <Input
                      type="number"
                      value={priceAdjustments.facingPremium}
                      onChange={(e) => setPriceAdjustments(prev => ({
                        ...prev,
                        facingPremium: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Amenity Premium (PKR)</Label>
                    <Input
                      type="number"
                      value={priceAdjustments.amenityPremium}
                      onChange={(e) => setPriceAdjustments(prev => ({
                        ...prev,
                        amenityPremium: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <Button onClick={handlePriceAdjustment} className="w-full">
                  Apply Adjustments
                </Button>
              </div>
            )}

            <Separator />

            {/* Discount Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Discount & Final Price</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Amount (PKR)</Label>
                  <Input
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      discountAmount: parseFloat(e.target.value) || 0,
                      finalAmount: prev.totalAmount - (parseFloat(e.target.value) || 0)
                    }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Discount Reason</Label>
                  <Select
                    value={formData.discountReason}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, discountReason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-bird">Early Bird Discount</SelectItem>
                      <SelectItem value="bulk-purchase">Bulk Purchase</SelectItem>
                      <SelectItem value="referral">Referral Discount</SelectItem>
                      <SelectItem value="festival">Festival Offer</SelectItem>
                      <SelectItem value="negotiation">Price Negotiation</SelectItem>
                      <SelectItem value="loyalty">Loyalty Customer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Discount Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyDiscount(formData.totalAmount * 0.05, 'early-bird')}
                >
                  5% Early Bird
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyDiscount(formData.totalAmount * 0.03, 'referral')}
                >
                  3% Referral
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyDiscount(formData.totalAmount * 0.10, 'negotiation')}
                >
                  10% Negotiation
                </Button>
              </div>
            </div>

            <Separator />

            {/* Final Price Summary */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatPKR(formData.totalAmount)}</span>
                </div>
                {formData.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatPKR(formData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-green-700 border-t pt-2">
                  <span>Final Amount:</span>
                  <span>{formatPKR(formData.finalAmount)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {formatPKR(Math.round(formData.finalAmount / unit.area))} per sqft
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      {/* Payment Plan Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(PAYMENT_PLAN_TEMPLATES).map(([key, plan]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  formData.paymentPlan.type === key ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  paymentPlan: { ...prev.paymentPlan, type: key as any }
                }))}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium mb-2">{plan.name}</h4>
                  <p className="text-2xl font-bold text-blue-600">{plan.downPayment}%</p>
                  <p className="text-xs text-muted-foreground">Down Payment</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Installment Schedule</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Amount: {formatPKR(formData.finalAmount)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.paymentPlan.installments.map((installment, index) => (
              <div key={installment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{installment.installmentNumber}</Badge>
                    <span className="font-medium">{installment.description}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatPKR(installment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((installment.amount / formData.finalAmount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <p className="font-medium">{format(new Date(installment.dueDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <Badge className="ml-2" variant="secondary">
                      {installment.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Installments:</span>
              <span className="font-bold text-blue-600">
                {formatPKR(formData.paymentPlan.installments.reduce((sum, inst) => sum + inst.amount, 0))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTermsTab = () => (
    <div className="space-y-6">
      {/* Sales Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sales Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  commissionRate: parseFloat(e.target.value) || 0
                }))}
                placeholder="2.0"
              />
              <p className="text-xs text-muted-foreground">
                Commission: {formatPKR((formData.finalAmount * formData.commissionRate) / 100)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Referred By (Optional)</Label>
            <Input
              value={formData.referredBy || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, referredBy: e.target.value }))}
              placeholder="Name of person who referred this customer..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sales Notes & Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.salesNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, salesNotes: e.target.value }))}
            placeholder="Add any important notes about this customer, their preferences, concerns, or special requirements..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Competitor Analysis (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Competitor Name</Label>
              <Input
                value={formData.competitorComparison?.competitorName || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  competitorComparison: {
                    ...prev.competitorComparison,
                    competitorName: e.target.value,
                    competitorPrice: prev.competitorComparison?.competitorPrice || 0,
                    advantages: prev.competitorComparison?.advantages || []
                  }
                }))}
                placeholder="e.g., ABC Builders"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Competitor Price (PKR)</Label>
              <Input
                type="number"
                value={formData.competitorComparison?.competitorPrice || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  competitorComparison: {
                    ...prev.competitorComparison,
                    competitorName: prev.competitorComparison?.competitorName || '',
                    competitorPrice: parseFloat(e.target.value) || 0,
                    advantages: prev.competitorComparison?.advantages || []
                  }
                }))}
                placeholder="0"
              />
            </div>
          </div>
          
          {formData.competitorComparison?.competitorPrice && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Price Difference:</span>
                <span className={`font-semibold ${
                  formData.finalAmount < formData.competitorComparison.competitorPrice 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.finalAmount < formData.competitorComparison.competitorPrice ? '-' : '+'}
                  {formatPKR(Math.abs(formData.finalAmount - formData.competitorComparison.competitorPrice))}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Create Booking - {unit.unitNumber}</span>
          </DialogTitle>
          <DialogDescription>
            Complete the booking process for {unit.unitType} unit with advanced sales tools
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Terms</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="customer" className="mt-0">
              {renderCustomerTab()}
            </TabsContent>

            <TabsContent value="pricing" className="mt-0">
              {renderPricingTab()}
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              {renderPaymentTab()}
            </TabsContent>

            <TabsContent value="terms" className="mt-0">
              {renderTermsTab()}
            </TabsContent>
          </div>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoSaveEnabled}
              onCheckedChange={setAutoSaveEnabled}
            />
            <Label className="text-sm">Auto-save draft</Label>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};