/**
 * Property Action Modal - V3.0
 * NEW MODAL: Shown after property creation to choose what to do
 * User can: Start Sell Cycle | Start Purchase Cycle | Start Rent Cycle | Do Later
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Property } from '../types';
import { Home, ShoppingCart, Key, Clock, TrendingUp, TrendingDown, Building2 } from 'lucide-react';

interface PropertyActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onStartSellCycle: () => void;
  onStartPurchaseCycle: () => void;
  onStartRentCycle: () => void;
}

export function PropertyActionModal({
  isOpen,
  onClose,
  property,
  onStartSellCycle,
  onStartPurchaseCycle,
  onStartRentCycle,
}: PropertyActionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Property Added Successfully! 🎉</DialogTitle>
          <DialogDescription>
            {property.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            What would you like to do with this property?
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Sell Cycle */}
            <button
              onClick={() => {
                onClose();
                onStartSellCycle();
              }}
              className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all p-6 text-left bg-background hover:bg-accent"
            >
              <div className="absolute top-4 right-4 p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                
                <div>
                  <h3 className="font-medium">Start Sell Cycle</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    List this property for sale, receive offers, and manage buyers
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-accent">Marketing</span>
                  <span className="px-2 py-1 rounded bg-accent">Offers</span>
                </div>
              </div>
            </button>

            {/* Start Purchase Cycle */}
            <button
              onClick={() => {
                onClose();
                onStartPurchaseCycle();
              }}
              className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all p-6 text-left bg-background hover:bg-accent"
            >
              <div className="absolute top-4 right-4 p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                
                <div>
                  <h3 className="font-medium">Start Purchase Cycle</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Buy this property for agency, investor, or client
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-accent">3 Types</span>
                  <span className="px-2 py-1 rounded bg-accent">Acquisition</span>
                </div>
              </div>
            </button>

            {/* Start Rent Cycle */}
            <button
              onClick={() => {
                onClose();
                onStartRentCycle();
              }}
              className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all p-6 text-left bg-background hover:bg-accent"
            >
              <div className="absolute top-4 right-4 p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
                  <Key className="h-5 w-5 text-purple-600" />
                </div>
                
                <div>
                  <h3 className="font-medium">Start Rent Cycle</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    List for rent, manage tenants, and track leases
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-accent">Leasing</span>
                  <span className="px-2 py-1 rounded bg-accent">Tenants</span>
                </div>
              </div>
            </button>
          </div>

          {/* Do Later Option */}
          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent transition-all"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                I'll decide later - just save the property
              </span>
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong>💡 Tip:</strong> You can start multiple cycles on the same property. For example, you can list it for sale AND for rent simultaneously, or have multiple buyers making offers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
