/**
 * Send Offer To Buyer Modal - V3.0
 * Modal for sending offers from buyer requirements to matching properties
 * CORRECTED: Purchase Cycle created WHEN OFFER IS ACCEPTED, not when sent
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { BuyerRequirement, User } from '../types';
import { PropertyMatch } from '../lib/propertyMatching';
import { toast } from 'sonner';
import { addOffer, getSellCycleById } from '../lib/sellCycle';
import { DollarSign, User as UserIcon, FileText, Info } from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';

interface SendOfferToBuyerModalProps {
  match: PropertyMatch;
  buyerRequirement: BuyerRequirement;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendOfferToBuyerModal({
  match,
  buyerRequirement,
  user,
  onClose,
  onSuccess,
}: SendOfferToBuyerModalProps) {
  // Debug: Log user prop on mount
  console.log('SendOfferToBuyerModal rendered', { 
    hasUser: !!user, 
    userId: user?.id, 
    userName: user?.name,
    userObject: user 
  });
  
  const property = match.property;
  const sellCycleId = match.sellCycleId;
  const askingPrice = match.askingPrice;
  
  // Safety check - user must be provided FIRST (before other checks)
  if (!user || !user.id || !user.name) {
    console.error('SendOfferToBuyerModal: Invalid user object', { 
      user, 
      hasUser: !!user, 
      hasUserId: !!user?.id, 
      hasUserName: !!user?.name,
      userType: typeof user 
    });
    // Don't show toast here as it might be called during render
    // useEffect will handle closing if needed
    return null;
  }
  
  // Safety check - property and sell cycle required
  // Return null early to prevent rendering if critical data is missing
  if (!property) {
    console.warn('SendOfferToBuyerModal: Missing property', { match, property });
    toast.error('Property information is missing');
    onClose();
    return null;
  }
  
  if (!sellCycleId) {
    console.warn('SendOfferToBuyerModal: Missing sellCycleId', { match, sellCycleId });
    toast.error('Sell cycle ID is missing. Cannot send offer.');
    onClose();
    return null;
  }
  
  // V3.0: Use asking price from sell cycle, fallback to property price
  const effectiveAskingPrice = askingPrice || property.price || 0;
  
  const [formData, setFormData] = useState({
    offerAmount: effectiveAskingPrice,
    tokenAmount: Math.round(effectiveAskingPrice * 0.10), // Default 10% token
    conditions: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.offerAmount || formData.offerAmount <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    
    if (!sellCycleId) {
      console.error('SendOfferToBuyerModal: Missing sellCycleId', { match, sellCycleId });
      toast.error('Error: Sell cycle ID is missing. Cannot send offer.');
      return;
    }
    
    // Verify sell cycle exists before attempting to add offer
    const sellCycle = getSellCycleById(sellCycleId);
    if (!sellCycle) {
      console.error('SendOfferToBuyerModal: Sell cycle not found', { sellCycleId });
      toast.error(`Error: Sell cycle not found (ID: ${sellCycleId}). The property may not be listed for sale.`);
      return;
    }
    
    if (!buyerRequirement?.id) {
      console.error('SendOfferToBuyerModal: Missing buyer requirement ID', { buyerRequirement });
      toast.error('Error: Buyer requirement information is missing.');
      return;
    }
    
    if (!user?.id) {
      console.error('SendOfferToBuyerModal: Missing user ID', { user });
      toast.error('Error: User information is missing.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Sending offer...', {
        sellCycleId,
        buyerRequirementId: buyerRequirement.id,
        offerAmount: formData.offerAmount,
        userId: user.id,
        sellCycleExists: !!sellCycle
      });
      
      // Send offer to the sell cycle
      // Purchase Cycle will be created automatically when seller accepts
      const offer = addOffer(sellCycleId, {
        buyerId: buyerRequirement.id,
        buyerName: buyerRequirement.buyerName,
        buyerContact: buyerRequirement.contactNumber,
        offerAmount: formData.offerAmount,
        tokenAmount: formData.tokenAmount || undefined,
        conditions: formData.conditions || undefined,
        notes: formData.notes || undefined,
        agentNotes: `Offer sent from buyer requirement match (ID: ${buyerRequirement.id}). Buyer Agent: ${user.name}`,
        buyerRequirementId: buyerRequirement.id, // V3.0: Link to buyer requirement
        buyerAgentId: user.id, // V3.0: Track buyer agent for later Purchase Cycle creation
        buyerAgentName: user.name,
        sourceType: 'buyer-requirement' as const, // V3.0: Track source
      });
      
      console.log('Offer created successfully:', offer.id);
      toast.success(`Offer sent successfully! The seller will review your offer.`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error sending offer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to send offer: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      offerAmount: effectiveAskingPrice,
      tokenAmount: Math.round(effectiveAskingPrice * 0.10),
      conditions: '',
      notes: '',
    });
    onClose();
  };

  const percentageOfAsking = effectiveAskingPrice > 0 
    ? ((formData.offerAmount / effectiveAskingPrice) * 100).toFixed(1) 
    : '0.0';

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Offer - {formatPropertyAddress(property.address)}</DialogTitle>
          <DialogDescription>
            Create and send an offer from {buyerRequirement.buyerName} to this property listing.
          </DialogDescription>
        </DialogHeader>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Explore Freely</h4>
            <p className="text-sm text-blue-700">
              Send as many offers as you need to explore options. If the seller accepts this offer, a Purchase Cycle and Deal will be automatically created for proper tracking.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Buyer Information */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Buyer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{buyerRequirement.buyerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium">{buyerRequirement.contactNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget</p>
                <p className="font-medium">{formatPKR(buyerRequirement.minBudget)} - {formatPKR(buyerRequirement.maxBudget)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Property Type</p>
                <p className="font-medium capitalize">{buyerRequirement.propertyType}</p>
              </div>
            </div>
          </div>

          {/* Property Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Property Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Asking Price</p>
                <p className="font-bold text-lg">{formatPKR(effectiveAskingPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Property Type</p>
                <p className="font-medium capitalize">{property.propertyType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bedrooms</p>
                <p className="font-medium">{property.bedrooms || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Area</p>
                <p className="font-medium">{property.area} {property.areaUnit}</p>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Offer Details
            </h3>

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
                  required
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-muted-foreground">
                  {percentageOfAsking}% of asking price
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenAmount">Token Money (PKR)</Label>
                <Input
                  id="tokenAmount"
                  type="number"
                  value={formData.tokenAmount}
                  onChange={(e) => setFormData({ ...formData, tokenAmount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.offerAmount > 0 
                    ? ((formData.tokenAmount / formData.offerAmount) * 100).toFixed(1) 
                    : '0.0'}% of offer
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
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
                  placeholder="e.g., Subject to financing approval, home inspection..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes for Seller</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or comments..."
                  rows={2}
                />
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
              {isSubmitting ? 'Sending...' : 'Send Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}