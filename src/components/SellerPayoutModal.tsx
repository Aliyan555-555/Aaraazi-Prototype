import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { SellerPayout, Transaction, Property, User } from '../types';
import { saveSellerPayout } from '../lib/payments';
import { formatCurrency } from '../lib/currency';
import { toast } from 'sonner';
import { DollarSign, Calendar, Building2, CheckCircle, AlertCircle } from 'lucide-react';

interface SellerPayoutModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
  transaction: Transaction;
  totalCollected: number;
  user: User;
  existingPayout?: SellerPayout | null;
}

export const SellerPayoutModal: React.FC<SellerPayoutModalProps> = ({
  open,
  onClose,
  property,
  transaction,
  totalCollected,
  user,
  existingPayout
}) => {
  // Calculate commission amount
  const commissionRate = property.commissionRate || 3;
  const commissionAmount = (transaction.acceptedOfferAmount * commissionRate) / 100;
  const netPayoutToSeller = totalCollected - commissionAmount;

  const [formData, setFormData] = useState({
    paymentSource: existingPayout?.paymentSource || '',
    payoutDate: existingPayout?.payoutDate || new Date().toISOString().split('T')[0],
    notes: existingPayout?.notes || ''
  });

  // Mock bank accounts - in a real app, this would come from the banking module
  const bankAccounts = useMemo(() => [
    { id: 'acc-1', name: 'Standard Chartered - Business (****1234)', balance: 'PKR 5,500,000' },
    { id: 'acc-2', name: 'HBL - Operations (****5678)', balance: 'PKR 8,200,000' },
    { id: 'acc-3', name: 'MCB - Investment (****9012)', balance: 'PKR 12,750,000' },
    { id: 'acc-4', name: 'UBL - Petty Cash (****3456)', balance: 'PKR 450,000' }
  ], []);

  const handleSubmit = () => {
    if (!formData.paymentSource) {
      toast.error('Please select a payment source');
      return;
    }

    if (!formData.payoutDate) {
      toast.error('Please select a payout date');
      return;
    }

    if (netPayoutToSeller < 0) {
      toast.error('Net payout cannot be negative');
      return;
    }

    const payout: SellerPayout = {
      id: existingPayout?.id || `payout-${property.id}-${Date.now()}`,
      propertyId: property.id,
      transactionId: transaction.id,
      totalCollectedFromBuyer: totalCollected,
      agreedCommissionAmount: commissionAmount,
      netPayoutToSeller: netPayoutToSeller,
      paymentSource: formData.paymentSource,
      payoutDate: formData.payoutDate,
      status: 'paid',
      notes: formData.notes,
      createdBy: user.id,
      createdAt: existingPayout?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      saveSellerPayout(payout);
      toast.success('Seller payout recorded successfully');
      onClose();
    } catch (error) {
      console.error('Error saving payout:', error);
      toast.error('Failed to save seller payout');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Record Payout to Seller
          </DialogTitle>
          <DialogDescription>
            Record the payment made to the property seller after collecting funds from the buyer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">{property.title}</p>
                <p className="text-sm text-blue-700">{property.address}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Buyer: {transaction.buyerName}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary - Read Only Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Total Amount Collected from Buyer</Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">{formatCurrency(totalCollected)}</p>
                <p className="text-xs text-green-700 mt-1">
                  100% of agreed sale amount
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Agreed Commission Amount</Label>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-900">{formatCurrency(commissionAmount)}</p>
                <p className="text-xs text-orange-700 mt-1">
                  {commissionRate}% of PKR {transaction.acceptedOfferAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Net Payout - Auto-calculated */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Net Payout Due to Seller</Label>
            <div className={`p-4 rounded-lg border-2 ${
              netPayoutToSeller >= 0 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {netPayoutToSeller >= 0 ? (
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <p className={`text-2xl font-medium ${
                      netPayoutToSeller >= 0 ? 'text-blue-900' : 'text-red-900'
                    }`}>
                      {formatCurrency(netPayoutToSeller)}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Collected ({formatCurrency(totalCollected)}) - Commission ({formatCurrency(commissionAmount)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="payment-source">
              Payment Source <span className="text-red-600">*</span>
            </Label>
            <Select 
              value={formData.paymentSource} 
              onValueChange={(value) => setFormData({ ...formData, paymentSource: value })}
            >
              <SelectTrigger id="payment-source">
                <SelectValue placeholder="Select bank account for payment" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{account.name}</span>
                      <span className="text-xs text-gray-500">Current Balance: {account.balance}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select the agency bank account from which the payment will be made
            </p>
          </div>

          {/* Payout Date */}
          <div className="space-y-2">
            <Label htmlFor="payout-date">
              Payout Date <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="payout-date"
                type="date"
                value={formData.payoutDate}
                onChange={(e) => setFormData({ ...formData, payoutDate: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this payout..."
              rows={3}
            />
          </div>

          {/* Warning if not fully collected */}
          {totalCollected < transaction.acceptedOfferAmount && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-900">Partial Collection Warning</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have collected PKR {totalCollected.toLocaleString()} out of PKR {transaction.acceptedOfferAmount.toLocaleString()}.
                    The remaining PKR {(transaction.acceptedOfferAmount - totalCollected).toLocaleString()} is still outstanding from the buyer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={netPayoutToSeller < 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm & Record Payout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
