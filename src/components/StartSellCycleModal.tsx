/**
 * Start Sell Cycle Modal - V3.0
 * Configure a new sell cycle for a property
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Property, User, Contact } from '../types';
import { createSellCycle } from '../lib/sellCycle';
import { getContacts } from '../lib/data';
import { TrendingUp, DollarSign, Percent, Calendar, AlertCircle, Users, Search, Plus } from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { toast } from 'sonner';
import { QuickAddContactModal } from './QuickAddContactModal';

interface StartSellCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  user: User;
  onSuccess: () => void;
}

export function StartSellCycleModal({
  isOpen,
  onClose,
  property,
  user,
  onSuccess,
}: StartSellCycleModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);

  const [formData, setFormData] = useState({
    // Seller (defaults to current owner)
    sellerId: property.currentOwnerId,
    sellerName: property.currentOwnerName,
    sellerType: 'individual' as 'individual' | 'developer' | 'agency' | 'investor',
    
    // Pricing
    askingPrice: '',
    minAcceptablePrice: '',
    
    // Commission
    commissionRate: '2',
    commissionType: 'percentage' as 'percentage' | 'fixed',
    
    // Listing details
    marketingPlan: '',
    exclusiveListing: false,
    exclusivityEndDate: '',
    
    // Timeline
    listedDate: new Date().toISOString().split('T')[0],
    targetSaleDate: '',
    
    // Notes
    sellerMotivation: '',
    privateNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load contacts
  useEffect(() => {
    const allContacts = getContacts(user.id, user.role);
    setContacts(allContacts);
  }, [user.id, user.role]);

  // Filter sellers based on search
  const filteredSellers = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSellerSelect = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      sellerId: contact.id,
      sellerName: contact.name,
    }));
    setSearchQuery(contact.name);
    setShowSellerDropdown(false);
  };

  // Calculate commission
  const calculatedCommission = formData.askingPrice && formData.commissionRate
    ? formData.commissionType === 'percentage'
      ? (parseFloat(formData.askingPrice) * parseFloat(formData.commissionRate)) / 100
      : parseFloat(formData.commissionRate)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.sellerId) {
      toast.error('Please select a seller');
      return;
    }
    if (!formData.askingPrice || parseFloat(formData.askingPrice) <= 0) {
      toast.error('Please enter valid asking price');
      return;
    }

    setIsSubmitting(true);

    try {
      createSellCycle({
        propertyId: property.id,
        
        // Seller
        sellerId: formData.sellerId,
        sellerName: formData.sellerName,
        sellerType: formData.sellerType,
        
        // Pricing
        askingPrice: parseFloat(formData.askingPrice),
        minAcceptablePrice: formData.minAcceptablePrice ? parseFloat(formData.minAcceptablePrice) : undefined,
        
        // Commission
        commissionRate: parseFloat(formData.commissionRate),
        commissionType: formData.commissionType,
        
        // Listing
        marketingPlan: formData.marketingPlan || undefined,
        exclusiveListing: formData.exclusiveListing,
        exclusivityEndDate: formData.exclusivityEndDate || undefined,
        
        // Agent
        agentId: user.id,
        agentName: user.name,
        
        // Timeline
        listedDate: formData.listedDate,
        targetSaleDate: formData.targetSaleDate || undefined,
        
        // Notes
        sellerMotivation: formData.sellerMotivation || undefined,
        privateNotes: formData.privateNotes || undefined,
      });

      toast.success('Sell cycle created successfully!');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating sell cycle:', error);
      toast.error('Failed to create sell cycle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Start Sell Cycle
            </DialogTitle>
            <DialogDescription>
              {formatPropertyAddress(property)}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Alert */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900">Listing Property for Sale</p>
                  <p className="text-green-700 mt-1">
                    You're listing this property for sale. Configure pricing, commission, and receive offers from buyers.
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Seller
                </CardTitle>
                <CardDescription>Who is selling this property?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seller">
                    Select Seller <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search sellers..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSellerDropdown(true);
                          }}
                          onFocus={() => setShowSellerDropdown(true)}
                          className="pl-9"
                        />
                      </div>
                      
                      {/* Seller Dropdown */}
                      {showSellerDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSellers.length > 0 ? (
                            filteredSellers.map(seller => (
                              <button
                                key={seller.id}
                                type="button"
                                onClick={() => handleSellerSelect(seller)}
                                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                              >
                                <div className="font-medium">{seller.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {seller.phone} • {seller.type}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              No sellers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowQuickAdd(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.sellerName && (
                    <p className="text-sm text-muted-foreground">
                      Selected: <span className="font-medium">{formData.sellerName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerType">Seller Type</Label>
                  <Select
                    value={formData.sellerType}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, sellerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
                <CardDescription>Set asking price and minimum acceptable price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="askingPrice">
                      Asking Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="askingPrice"
                      type="number"
                      placeholder="0"
                      value={formData.askingPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
                      required
                      min="0"
                      step="100000"
                    />
                    {formData.askingPrice && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.askingPrice))}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAcceptablePrice">Minimum Acceptable (Optional)</Label>
                    <Input
                      id="minAcceptablePrice"
                      type="number"
                      placeholder="0"
                      value={formData.minAcceptablePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, minAcceptablePrice: e.target.value }))}
                      min="0"
                      step="100000"
                    />
                    {formData.minAcceptablePrice && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.minAcceptablePrice))}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Commission
                </CardTitle>
                <CardDescription>Your commission for this sale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionType">Commission Type</Label>
                    <Select
                      value={formData.commissionType}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, commissionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">
                      {formData.commissionType === 'percentage' ? 'Rate (%)' : 'Amount'}
                    </Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      placeholder={formData.commissionType === 'percentage' ? '2' : '500000'}
                      value={formData.commissionRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: e.target.value }))}
                      min="0"
                      step={formData.commissionType === 'percentage' ? '0.1' : '10000'}
                    />
                  </div>
                </div>

                {/* Commission Calculation */}
                {calculatedCommission > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Commission</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPKR(calculatedCommission)}
                        </p>
                      </div>
                      <Percent className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="exclusiveListing">Exclusive Listing</Label>
                    <p className="text-xs text-muted-foreground">Only your agency can sell this property</p>
                  </div>
                  <Switch
                    id="exclusiveListing"
                    checked={formData.exclusiveListing}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exclusiveListing: checked }))}
                  />
                </div>

                {formData.exclusiveListing && (
                  <div className="space-y-2">
                    <Label htmlFor="exclusivityEndDate">Exclusivity End Date</Label>
                    <Input
                      id="exclusivityEndDate"
                      type="date"
                      value={formData.exclusivityEndDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, exclusivityEndDate: e.target.value }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="marketingPlan">Marketing Plan (Optional)</Label>
                  <Textarea
                    id="marketingPlan"
                    placeholder="e.g., Online listings, open houses, social media campaign..."
                    value={formData.marketingPlan}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketingPlan: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listedDate">Listed Date</Label>
                    <Input
                      id="listedDate"
                      type="date"
                      value={formData.listedDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, listedDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetSaleDate">Target Sale Date (Optional)</Label>
                    <Input
                      id="targetSaleDate"
                      type="date"
                      value={formData.targetSaleDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetSaleDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerMotivation">Seller Motivation (Optional)</Label>
                  <Textarea
                    id="sellerMotivation"
                    placeholder="Why is the seller selling? Any time constraints?"
                    value={formData.sellerMotivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerMotivation: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateNotes">Private Notes (Optional)</Label>
                  <Textarea
                    id="privateNotes"
                    placeholder="Internal notes, special conditions..."
                    value={formData.privateNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, privateNotes: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Sell Cycle'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Contact Modal */}
      {showQuickAdd && (
        <QuickAddContactModal
          user={user}
          onClose={() => setShowQuickAdd(false)}
          onSuccess={(newContact) => {
            setContacts(prev => [...prev, newContact]);
            handleSellerSelect(newContact);
            setShowQuickAdd(false);
          }}
          defaultCategory="seller"
        />
      )}
    </>
  );
}