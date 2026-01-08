/**
 * Multi-Investor Purchase Modal
 * Modal for purchasing a property with multiple investors
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Property, User, InvestorShare } from '../../types';
import { InvestorSelectionModal } from '../purchase/InvestorSelectionModal';

interface MultiInvestorPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property: Property;
  user: User;
}

export function MultiInvestorPurchaseModal({
  isOpen,
  onClose,
  onSuccess,
  property,
  user,
}: MultiInvestorPurchaseModalProps) {
  const [selectedInvestors, setSelectedInvestors] = useState<InvestorShare[]>([]);
  const [showInvestorSelection, setShowInvestorSelection] = useState(false);

  const handleInvestorConfirm = (investors: InvestorShare[]) => {
    setSelectedInvestors(investors);
    setShowInvestorSelection(false);
    // TODO: Implement purchase cycle creation with multiple investors
    // This would integrate with the purchase cycle flow
  };

  const handleCompletePurchase = () => {
    // TODO: Implement actual purchase cycle creation
    // This is a placeholder - the actual implementation would:
    // 1. Create a purchase cycle with type 'investor-purchase'
    // 2. Create investor investments for each selected investor
    // 3. Transfer property ownership to investors
    onSuccess();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Property with Investors</DialogTitle>
            <DialogDescription>
              Select multiple investors and allocate ownership percentages for this property.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedInvestors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No investors selected yet.</p>
                <p className="text-sm mt-2">Click below to select investors and allocate shares.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected Investors:</h4>
                {selectedInvestors.map((share, index) => (
                  <div
                    key={share.investorId || index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{share.investorName || share.investorId}</span>
                    <span className="text-sm font-medium">{share.sharePercentage || 0}%</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInvestorSelection(true)}
                className="flex-1"
              >
                {selectedInvestors.length === 0 ? 'Select Investors' : 'Edit Investors'}
              </Button>
              {selectedInvestors.length > 0 && (
                <Button onClick={handleCompletePurchase} className="flex-1">
                  Complete Purchase
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InvestorSelectionModal
        isOpen={showInvestorSelection}
        onClose={() => setShowInvestorSelection(false)}
        onConfirm={handleInvestorConfirm}
        totalPrice={property.price || 0}
        user={user}
      />
    </>
  );
}
