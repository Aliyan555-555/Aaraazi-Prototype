/**
 * Add Offer Modal - V3.0
 * Modal for receiving and recording buyer offers on a property
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User } from '../types';
import { toast } from 'sonner';
import { addOffer } from '../lib/sellCycle';
import { DollarSign, User as UserIcon, Phone, Calendar, FileText } from 'lucide-react';

interface AddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellCycleId: string;
  askingPrice: number;
  user: User;
  onSuccess: () => void;
}

export function AddOfferModal({
  isOpen,
  onClose,
  sellCycleId,
  askingPrice,
  user,
  onSuccess,
}: AddOfferModalProps) {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerContact: '',
    offerAmount: askingPrice,
    tokenAmount: 0,
    expiryDate: '',
    conditions: '',
    notes: '',
    agentNotes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.offerAmount) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addOffer(sellCycleId, {
        buyerId: `buyer_${Date.now()}`,
        buyerName: formData.buyerName,
        buyerContact: formData.buyerContact,
        offerAmount: formData.offerAmount,
        tokenAmount: formData.tokenAmount || undefined,
        expiryDate: formData.expiryDate || undefined,
        conditions: formData.conditions || undefined,
        notes: formData.notes || undefined,
        agentNotes: formData.agentNotes || undefined,
      });
      
      toast.success('Offer recorded successfully');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error adding offer:', error);
      toast.error('Failed to record offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      buyerName: '',
      buyerContact: '',
      offerAmount: askingPrice,
      tokenAmount: 0,
      expiryDate: '',
      conditions: '',
      notes: '',
      agentNotes: '',
    });
    onClose();
  };

  const percentageOfAsking = ((formData.offerAmount / askingPrice) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Buyer Offer</DialogTitle>
          <DialogDescription>
            Enter the details of the buyer's offer for the property.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Buyer Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Buyer Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">
                  Buyer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="buyerName"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  placeholder="Enter buyer's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerContact">
                  <Phone className="inline h-3 w-3 mr-1" />
                  Contact Number
                </Label>
                <Input
                  id="buyerContact"
                  value={formData.buyerContact}
                  onChange={(e) => setFormData({ ...formData, buyerContact: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Offer Details
            </h3>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asking Price:</span>
                <span className="font-medium">PKR {askingPrice.toLocaleString()}</span>
              </div>
              {formData.offerAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Offer Amount:</span>
                    <span className="font-medium">PKR {formData.offerAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">% of Asking:</span>
                    <span 
                      className={`font-medium ${
                        formData.offerAmount >= askingPrice 
                          ? 'text-green-600' 
                          : formData.offerAmount >= askingPrice * 0.9 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}
                    >
                      {percentageOfAsking}%
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerAmount">
                  Offer Amount (PKR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="offerAmount"
                  type="number"
                  value={formData.offerAmount}
                  onChange={(e) => setFormData({ ...formData, offerAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  min="0"
                  step="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenAmount">Token Money (PKR)</Label>
                <Input
                  id="tokenAmount"
                  type="number"
                  value={formData.tokenAmount}
                  onChange={(e) => setFormData({ ...formData, tokenAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Offer Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Conditions & Notes */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conditions">Offer Conditions</Label>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  placeholder="e.g., Subject to financing, inspection, or other contingencies..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Any conditions or contingencies attached to this offer
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Buyer Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or comments from the buyer..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentNotes">Internal Agent Notes</Label>
                <Textarea
                  id="agentNotes"
                  value={formData.agentNotes}
                  onChange={(e) => setFormData({ ...formData, agentNotes: e.target.value })}
                  placeholder="Internal notes (not visible to buyer)..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Private notes for internal use only
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}