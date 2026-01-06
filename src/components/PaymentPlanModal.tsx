import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { PaymentPlan, ScheduledPayment, Transaction } from '../types';
import { savePaymentPlan, saveScheduledPayments } from '../lib/payments';
import { formatPKR } from '../lib/currency';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  userId: string;
  onSuccess: () => void;
}

interface InstallmentRow {
  id: string;
  title: string;
  amountDue: string;
  dueDate: string;
}

export const PaymentPlanModal: React.FC<PaymentPlanModalProps> = ({
  open,
  onOpenChange,
  transaction,
  userId,
  onSuccess
}) => {
  const [planType, setPlanType] = useState<'lump-sum' | 'installments'>('installments');
  const [installments, setInstallments] = useState<InstallmentRow[]>([
    {
      id: '1',
      title: 'Biyana (Token Money)',
      amountDue: '',
      dueDate: new Date().toISOString().split('T')[0]
    }
  ]);

  const totalSaleAmount = transaction.acceptedOfferAmount;

  const calculateTotal = (): number => {
    return installments.reduce((sum, inst) => {
      const amount = parseFloat(inst.amountDue) || 0;
      return sum + amount;
    }, 0);
  };

  const isValidPlan = (): boolean => {
    if (planType === 'lump-sum') return true;
    
    const total = calculateTotal();
    const allFilled = installments.every(inst => 
      inst.title.trim() !== '' && 
      inst.amountDue !== '' && 
      parseFloat(inst.amountDue) > 0 &&
      inst.dueDate !== ''
    );
    
    return allFilled && Math.abs(total - totalSaleAmount) < 1; // Allow 1 rupee difference for rounding
  };

  const addInstallment = () => {
    const newInstallment: InstallmentRow = {
      id: Date.now().toString(),
      title: '',
      amountDue: '',
      dueDate: new Date().toISOString().split('T')[0]
    };
    setInstallments([...installments, newInstallment]);
  };

  const removeInstallment = (id: string) => {
    if (installments.length > 1) {
      setInstallments(installments.filter(inst => inst.id !== id));
    }
  };

  const updateInstallment = (id: string, field: keyof InstallmentRow, value: string) => {
    setInstallments(installments.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const handleSave = () => {
    if (!isValidPlan()) {
      toast.error('Please complete all installments and ensure total matches sale amount');
      return;
    }

    try {
      // Create payment plan
      const plan: PaymentPlan = {
        id: `plan-${transaction.id}-${Date.now()}`,
        propertyId: transaction.propertyId,
        transactionId: transaction.id,
        totalSaleAmount,
        planType,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      savePaymentPlan(plan);

      // Create scheduled payments
      if (planType === 'installments') {
        const scheduledPayments: ScheduledPayment[] = installments.map((inst, index) => ({
          id: `payment-${plan.id}-${index + 1}`,
          paymentPlanId: plan.id,
          propertyId: transaction.propertyId,
          title: inst.title,
          amountDue: parseFloat(inst.amountDue),
          dueDate: inst.dueDate,
          status: 'pending' as const,
          amountPaid: 0,
          paymentTransactionIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        saveScheduledPayments(scheduledPayments);
      } else {
        // Lump sum - create single payment
        const scheduledPayment: ScheduledPayment = {
          id: `payment-${plan.id}-1`,
          paymentPlanId: plan.id,
          propertyId: transaction.propertyId,
          title: 'Full Payment',
          amountDue: totalSaleAmount,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          amountPaid: 0,
          paymentTransactionIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        saveScheduledPayments([scheduledPayment]);
      }

      toast.success('Payment plan created successfully!');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving payment plan:', error);
      toast.error('Failed to create payment plan');
    }
  };

  const total = calculateTotal();
  const difference = total - totalSaleAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Up Payment Plan</DialogTitle>
          <DialogDescription>
            Configure the payment schedule for this property transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Sale Amount */}
          <div>
            <Label className="text-gray-900">Total Sale Amount</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg text-gray-900">{formatPKR(totalSaleAmount)}</p>
            </div>
          </div>

          {/* Plan Type */}
          <div>
            <Label className="text-gray-900 mb-2 block">Payment Plan Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlanType('lump-sum')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  planType === 'lump-sum'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-gray-900">Lump Sum</p>
                <p className="text-xs text-gray-600 mt-1">Single full payment</p>
              </button>
              <button
                type="button"
                onClick={() => setPlanType('installments')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  planType === 'installments'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-gray-900">Installments</p>
                <p className="text-xs text-gray-600 mt-1">Multiple scheduled payments</p>
              </button>
            </div>
          </div>

          {/* Installments Table */}
          {planType === 'installments' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-gray-900">Payment Schedule</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addInstallment}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Installment
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-gray-900">Title</th>
                      <th className="text-left p-3 text-gray-900">Amount Due (PKR)</th>
                      <th className="text-left p-3 text-gray-900">Due Date</th>
                      <th className="w-12 p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst, index) => (
                      <tr key={inst.id} className="border-b last:border-b-0">
                        <td className="p-3">
                          <Input
                            value={inst.title}
                            onChange={(e) => updateInstallment(inst.id, 'title', e.target.value)}
                            placeholder="e.g., Biyana, 1st Installment"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={inst.amountDue}
                            onChange={(e) => updateInstallment(inst.id, 'amountDue', e.target.value)}
                            placeholder="0"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="date"
                            value={inst.dueDate}
                            onChange={(e) => updateInstallment(inst.id, 'dueDate', e.target.value)}
                            className="w-full"
                          />
                        </td>
                        <td className="p-3">
                          {installments.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeInstallment(inst.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Running Total */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Total Sale Amount</p>
                    <p className="text-gray-900">{formatPKR(totalSaleAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Sum of Installments</p>
                    <p className="text-gray-900">{formatPKR(total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Difference</p>
                    <div className="flex items-center gap-2">
                      <p className={`${Math.abs(difference) < 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPKR(Math.abs(difference))}
                      </p>
                      {Math.abs(difference) >= 1 && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
                {Math.abs(difference) >= 1 && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      The sum of installments must equal the total sale amount. 
                      Please adjust the amounts.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValidPlan()}>
              Save Payment Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
