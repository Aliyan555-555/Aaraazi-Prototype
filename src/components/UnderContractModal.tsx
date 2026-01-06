import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Property, User, Contact, Transaction } from '../types';
import { getContacts, updateProperty } from '../lib/data';
import { saveTransaction } from '../lib/transactions';
import { savePaymentPlan, saveScheduledPayments } from '../lib/payments';
import { QuickAddContactModal } from './QuickAddContactModal';
import { formatCurrency } from '../lib/currency';
import { toast } from 'sonner';
import { 
  User as UserIcon, 
  Plus, 
  Calendar, 
  DollarSign, 
  Clock,
  X,
  Check
} from 'lucide-react';

interface UnderContractModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
  user: User;
  onSuccess: (transaction: Transaction) => void;
}

interface PaymentInstallment {
  id: string;
  name: string;
  percentage: number;
  daysFromStart: number;
  amount: number;
  dueDate: string;
}

export const UnderContractModal: React.FC<UnderContractModalProps> = ({
  open,
  onClose,
  property,
  user,
  onSuccess
}) => {
  const [step, setStep] = useState<'buyer' | 'payment'>('buyer');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Buyer Information
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [buyerSearchTerm, setBuyerSearchTerm] = useState('');
  
  // Payment Plan
  const [agreedPrice, setAgreedPrice] = useState(property.finalSalePrice?.toString() || property.price?.toString() || '');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('20');
  const [numberOfInstallments, setNumberOfInstallments] = useState('6');
  const [installmentInterval, setInstallmentInterval] = useState('30'); // days
  const [customInstallments, setCustomInstallments] = useState<PaymentInstallment[]>([]);
  const [useCustomPlan, setUseCustomPlan] = useState(false);

  useEffect(() => {
    if (open) {
      const allContacts = getContacts(user.id, user.role);
      setContacts(allContacts);
      
      // Reset to step 1
      setStep('buyer');
      setSelectedBuyerId('');
      setBuyerSearchTerm('');
    }
  }, [open, user.id, user.role]);

  // Generate automatic payment plan - memoized to prevent recalculation
  const generateAutomaticPlan = useCallback((): PaymentInstallment[] => {
    try {
      const price = parseFloat(agreedPrice);
      if (!price || isNaN(price) || price <= 0) return [];
      
      const downPaymentPct = parseFloat(downPaymentPercentage);
      if (isNaN(downPaymentPct)) return [];
      
      const numInst = parseInt(numberOfInstallments);
      if (isNaN(numInst) || numInst <= 0) return [];
      
      const interval = parseInt(installmentInterval);
      if (isNaN(interval) || interval <= 0) return [];

      const downPayment = (price * downPaymentPct) / 100;
      const remainingAmount = price - downPayment;
      const installmentAmount = remainingAmount / numInst;

      const installments: PaymentInstallment[] = [];
      const startDate = new Date();

      // Down payment
      installments.push({
        id: `installment-0`,
        name: 'Down Payment',
        percentage: downPaymentPct,
        daysFromStart: 0,
        amount: downPayment,
        dueDate: startDate.toISOString().split('T')[0]
      });

      // Regular installments
      for (let i = 1; i <= numInst; i++) {
        const daysFromStart = i * interval;
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + daysFromStart);

        installments.push({
          id: `installment-${i}`,
          name: `Installment ${i}`,
          percentage: (installmentAmount / price) * 100,
          daysFromStart,
          amount: installmentAmount,
          dueDate: dueDate.toISOString().split('T')[0]
        });
      }

      return installments;
    } catch (error) {
      console.error('Error generating payment plan:', error);
      return [];
    }
  }, [agreedPrice, downPaymentPercentage, numberOfInstallments, installmentInterval]);

  // Memoize expensive operations
  const selectedBuyer = useMemo(() => 
    contacts.find(c => c.id === selectedBuyerId),
    [contacts, selectedBuyerId]
  );
  
  const filteredContacts = useMemo(() => 
    contacts.filter(c => 
      c.name.toLowerCase().includes(buyerSearchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(buyerSearchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(buyerSearchTerm.toLowerCase()))
    ),
    [contacts, buyerSearchTerm]
  );

  const handleContinueToPayment = useCallback(() => {
    if (!selectedBuyerId) {
      toast.error('Please select a buyer');
      return;
    }
    setStep('payment');
  }, [selectedBuyerId]);

  const handleAddCustomInstallment = useCallback(() => {
    setCustomInstallments(prev => [...prev, {
      id: `custom-${Date.now()}`,
      name: `Payment ${prev.length + 1}`,
      percentage: 0,
      daysFromStart: prev.length === 0 ? 0 : 30,
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0]
    }]);
  }, []);

  const handleUpdateCustomInstallment = useCallback((index: number, field: keyof PaymentInstallment, value: any) => {
    setCustomInstallments(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      const price = parseFloat(agreedPrice);
      if (isNaN(price) || price <= 0) return updated;
      
      // If updating amount, recalculate percentage
      if (field === 'amount') {
        updated[index].percentage = (parseFloat(value) / price) * 100;
      }
      
      // If updating percentage, recalculate amount
      if (field === 'percentage') {
        updated[index].amount = (parseFloat(value) / 100) * price;
      }
      
      // If updating days, recalculate due date
      if (field === 'daysFromStart') {
        const startDate = new Date();
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + parseInt(value));
        updated[index].dueDate = dueDate.toISOString().split('T')[0];
      }
      
      return updated;
    });
  }, [agreedPrice]);

  const handleRemoveCustomInstallment = useCallback((index: number) => {
    setCustomInstallments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleComplete = useCallback(() => {
    try {
      if (!selectedBuyer) {
        toast.error('Buyer information is missing');
        return;
      }

      const price = parseFloat(agreedPrice);
      if (!price || price <= 0 || isNaN(price)) {
        toast.error('Please enter a valid agreed price');
        return;
      }

      // Generate or use custom payment plan
      const paymentPlan = useCustomPlan ? customInstallments : generateAutomaticPlan();
      
      if (paymentPlan.length === 0) {
        toast.error('Payment plan is empty. Please configure payment terms.');
        return;
      }
      
      // Validate payment plan totals
      const totalAmount = paymentPlan.reduce((sum, inst) => sum + inst.amount, 0);
      if (Math.abs(totalAmount - price) > 1) { // Allow 1 PKR rounding difference
        toast.error(`Payment plan total (${formatCurrency(totalAmount)}) doesn't match agreed price (${formatCurrency(price)})`);
        return;
      }

      // Create transaction
      const transaction: Transaction = {
        id: `transaction-${property.id}-${Date.now()}`,
        propertyId: property.id,
        buyerName: selectedBuyer.name,
        buyerContact: selectedBuyer.phone,
        buyerEmail: selectedBuyer.email,
        buyerContactId: selectedBuyer.id,
        acceptedOfferAmount: price,
        acceptedDate: new Date().toISOString(),
        expectedClosingDate: paymentPlan[paymentPlan.length - 1].dueDate,
        status: 'active',
        agentId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentPlan: {
          totalAmount: price,
          installments: paymentPlan.map(inst => ({
            installmentNumber: parseInt(inst.id.split('-')[1]) || 0,
            description: inst.name,
            amount: inst.amount,
            dueDate: inst.dueDate,
            status: 'pending' as const,
            percentage: inst.percentage
          }))
        }
      };

      // Save transaction
      saveTransaction(transaction);
      
      // Create and save PaymentPlan record
      const paymentPlanRecord: import('../types').PaymentPlan = {
        id: `plan-${transaction.id}`,
        transactionId: transaction.id,
        propertyId: property.id,
        totalSaleAmount: price,
        planType: 'installments',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      savePaymentPlan(paymentPlanRecord);
      
      // Create and save ScheduledPayment records
      const scheduledPayments: import('../types').ScheduledPayment[] = transaction.paymentPlan!.installments.map(inst => ({
        id: `scheduled-${transaction.id}-${inst.installmentNumber}`,
        paymentPlanId: paymentPlanRecord.id,
        propertyId: property.id,
        title: inst.description,
        amountDue: inst.amount,
        amountPaid: 0,
        dueDate: inst.dueDate,
        status: 'pending' as const,
        paymentTransactionIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      saveScheduledPayments(scheduledPayments);
      
      // Update property status and final sale price
      updateProperty(property.id, {
        status: 'under-contract',
        finalSalePrice: price
      });
      
      toast.success('Transaction created with payment plan');
      onSuccess(transaction);
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction. Please try again.');
    }
  }, [selectedBuyer, agreedPrice, useCustomPlan, customInstallments, generateAutomaticPlan, property.id, user.id, onSuccess, onClose]);

  // Memoize calculated values
  const currentInstallments = useMemo(() => 
    useCustomPlan ? customInstallments : generateAutomaticPlan(),
    [useCustomPlan, customInstallments, generateAutomaticPlan]
  );
  
  const totalPlanned = useMemo(() => 
    currentInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0),
    [currentInstallments]
  );
  
  const planningDifference = useMemo(() => {
    const price = parseFloat(agreedPrice);
    return isNaN(price) ? 0 : price - totalPlanned;
  }, [agreedPrice, totalPlanned]);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Under Contract</DialogTitle>
            <DialogDescription>
              Set up buyer information and payment plan for {property.title}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex items-center gap-2 ${step === 'buyer' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'buyer' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="font-medium">Buyer Information</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                2
              </div>
              <span className="font-medium">Payment Plan</span>
            </div>
          </div>

          {/* Step 1: Buyer Selection */}
          {step === 'buyer' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Select Buyer from CRM</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickAdd(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Contact
                  </Button>
                </div>

                {/* Search */}
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={buyerSearchTerm}
                  onChange={(e) => setBuyerSearchTerm(e.target.value)}
                  className="mb-4"
                />

                {/* Selected Buyer Display */}
                {selectedBuyer && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{selectedBuyer.name}</p>
                        <p className="text-sm text-blue-700 mt-1">{selectedBuyer.phone}</p>
                        {selectedBuyer.email && (
                          <p className="text-sm text-blue-700">{selectedBuyer.email}</p>
                        )}
                      </div>
                      <Badge variant="secondary">Selected</Badge>
                    </div>
                  </div>
                )}

                {/* Contact List */}
                <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-lg p-2">
                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No contacts found</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBuyerId === contact.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedBuyerId(contact.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                            {contact.email && (
                              <p className="text-sm text-gray-500">{contact.email}</p>
                            )}
                          </div>
                          {selectedBuyerId === contact.id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleContinueToPayment}>
                  Continue to Payment Plan
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Plan */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Agreed Price */}
              <div>
                <Label htmlFor="agreed-price">Agreed Sale Price (PKR)</Label>
                <Input
                  id="agreed-price"
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(e.target.value)}
                  placeholder="Enter final agreed price"
                  className="mt-1"
                />
              </div>

              {/* Plan Type Toggle */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Label className="flex-1">Payment Plan Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={!useCustomPlan ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseCustomPlan(false)}
                  >
                    Automatic
                  </Button>
                  <Button
                    variant={useCustomPlan ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseCustomPlan(true)}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {/* Automatic Plan Configuration */}
              {!useCustomPlan && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="down-payment">Down Payment (%)</Label>
                    <Input
                      id="down-payment"
                      type="number"
                      value={downPaymentPercentage}
                      onChange={(e) => setDownPaymentPercentage(e.target.value)}
                      placeholder="20"
                      min="0"
                      max="100"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="num-installments">Number of Installments</Label>
                    <Input
                      id="num-installments"
                      type="number"
                      value={numberOfInstallments}
                      onChange={(e) => setNumberOfInstallments(e.target.value)}
                      placeholder="6"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interval">Interval (Days)</Label>
                    <Input
                      id="interval"
                      type="number"
                      value={installmentInterval}
                      onChange={(e) => setInstallmentInterval(e.target.value)}
                      placeholder="30"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Custom Plan Builder */}
              {useCustomPlan && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Custom Payment Schedule</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomInstallment}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {customInstallments.map((inst, index) => (
                      <div key={inst.id} className="p-3 border rounded-lg">
                        <div className="grid grid-cols-5 gap-2">
                          <div className="col-span-1">
                            <Label className="text-xs">Name</Label>
                            <Input
                              value={inst.name}
                              onChange={(e) => handleUpdateCustomInstallment(index, 'name', e.target.value)}
                              placeholder="Payment 1"
                              className="mt-1"
                            />
                          </div>
                          <div className="col-span-1">
                            <Label className="text-xs">Amount (PKR)</Label>
                            <Input
                              type="number"
                              value={inst.amount}
                              onChange={(e) => handleUpdateCustomInstallment(index, 'amount', e.target.value)}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div className="col-span-1">
                            <Label className="text-xs">%</Label>
                            <Input
                              type="number"
                              value={inst.percentage.toFixed(1)}
                              onChange={(e) => handleUpdateCustomInstallment(index, 'percentage', e.target.value)}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div className="col-span-1">
                            <Label className="text-xs">Days</Label>
                            <Input
                              type="number"
                              value={inst.daysFromStart}
                              onChange={(e) => handleUpdateCustomInstallment(index, 'daysFromStart', e.target.value)}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div className="col-span-1 flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCustomInstallment(index)}
                              className="w-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Due: {inst.dueDate}
                        </p>
                      </div>
                    ))}

                    {customInstallments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No payments added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Plan Preview */}
              {agreedPrice && currentInstallments.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Payment Schedule Preview</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {currentInstallments.map((inst, index) => (
                      <div key={inst.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{inst.name}</p>
                            <p className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {inst.dueDate} ({inst.daysFromStart} days)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(inst.amount)}</p>
                          <p className="text-xs text-gray-500">{inst.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Planned:</span>
                      <span className="font-medium">{formatCurrency(totalPlanned)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Agreed Price:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(agreedPrice))}</span>
                    </div>
                    {Math.abs(planningDifference) > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Difference:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(Math.abs(planningDifference))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setStep('buyer')}>
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleComplete}>
                    Create Transaction
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Add Contact Modal */}
      {showQuickAdd && (
        <QuickAddContactModal
          open={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          user={user}
          onContactAdded={(newContact) => {
            setContacts([...contacts, newContact]);
            setSelectedBuyerId(newContact.id);
            setShowQuickAdd(false);
          }}
        />
      )}
    </>
  );
};
