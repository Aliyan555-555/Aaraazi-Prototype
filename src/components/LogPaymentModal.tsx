import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScheduledPayment, PaymentTransaction } from '../types';
import { savePaymentTransaction, generateReceiptNumber } from '../lib/payments';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

interface LogPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledPayment: ScheduledPayment;
  propertyId: string;
  userId: string;
  onSuccess: () => void;
}

export const LogPaymentModal: React.FC<LogPaymentModalProps> = ({
  open,
  onOpenChange,
  scheduledPayment,
  propertyId,
  userId,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as 'cash' | 'cheque' | 'bank-transfer' | 'other',
    referenceNumber: '',
    notes: ''
  });

  // Calculate remaining amount - ensuring we have fresh data
  const remainingAmount = (scheduledPayment.amountDue || 0) - (scheduledPayment.amountPaid || 0);

  const handleSubmit = () => {
    const amount = parseFloat(formData.amountPaid);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > remainingAmount) {
      toast.error('Payment amount cannot exceed remaining balance');
      return;
    }

    if (!formData.paymentDate) {
      toast.error('Please select a payment date');
      return;
    }

    if ((formData.paymentMethod === 'cheque' || formData.paymentMethod === 'bank-transfer') && !formData.referenceNumber.trim()) {
      toast.error('Please enter a reference/cheque number');
      return;
    }

    try {
      const transaction: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        scheduledPaymentId: scheduledPayment.id,
        propertyId,
        amountPaid: amount,
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber || undefined,
        notes: formData.notes || undefined,
        receivedBy: userId,
        receiptNumber: generateReceiptNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      savePaymentTransaction(transaction);
      
      // Check if this was the final payment
      import('../lib/payments').then(({ getPaymentSummary }) => {
        const summary = getPaymentSummary(propertyId);
        if (summary.percentagePaid >= 99.9 && summary.amountRemaining <= 1) {
          toast.success('🎉 Final payment received! Deal completed and ownership transferred to buyer.', {
            duration: 6000
          });
        } else {
          toast.success('Payment logged successfully!');
        }
      }).catch(() => {
        toast.success('Payment logged successfully!');
      });
      
      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        amountPaid: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        referenceNumber: '',
        notes: ''
      });
    } catch (error) {
      logger.error('Error logging payment:', error);
      toast.error('Failed to log payment');
    }
  };

  const showReferenceField = formData.paymentMethod === 'cheque' || formData.paymentMethod === 'bank-transfer';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Received Payment</DialogTitle>
          <DialogDescription>
            Record a payment received for: {scheduledPayment.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Amount Due</p>
                <p className="text-gray-900">{formatPKR(scheduledPayment.amountDue)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Already Paid</p>
                <p className="text-gray-900">{formatPKR(scheduledPayment.amountPaid)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Remaining</p>
                <p className="text-gray-900">{formatPKR(remainingAmount)}</p>
              </div>
            </div>
          </div>

          {/* Amount Paid */}
          <div>
            <Label htmlFor="amount-paid">Amount Paid (PKR) *</Label>
            <Input
              id="amount-paid"
              type="number"
              value={formData.amountPaid}
              onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
              placeholder="Enter amount received"
              max={remainingAmount}
              step="0.01"
            />
            <p className="text-xs text-gray-600 mt-1">
              Maximum: {formatPKR(remainingAmount)}
            </p>
          </div>

          {/* Payment Date */}
          <div>
            <Label htmlFor="payment-date">Payment Date *</Label>
            <Input
              id="payment-date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference Number (conditional) */}
          {showReferenceField && (
            <div>
              <Label htmlFor="reference">
                {formData.paymentMethod === 'cheque' ? 'Cheque Number *' : 'Reference Number *'}
              </Label>
              <Input
                id="reference"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder={formData.paymentMethod === 'cheque' ? 'Enter cheque number' : 'Enter reference number'}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this payment"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Confirm & Log Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};