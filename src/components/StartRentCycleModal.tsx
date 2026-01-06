/**
 * Start Rent Cycle Modal - V3.0
 * Configure a new rent cycle for a property
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Property, User, RentCycle, Contact } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Key, AlertCircle, Users, Search, Plus, DollarSign, Calendar, Home } from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { createRentCycle } from '../lib/rentCycle';
import { getContacts } from '../lib/data';
import { toast } from 'sonner';
import { QuickAddContactModal } from './QuickAddContactModal';

interface StartRentCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  user: User;
  onSuccess: () => void;
}

export function StartRentCycleModal({
  isOpen,
  onClose,
  property,
  user,
  onSuccess,
}: StartRentCycleModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLandlordDropdown, setShowLandlordDropdown] = useState(false);

  // Load contacts
  useEffect(() => {
    const allContacts = getContacts(user.id, user.role);
    setContacts(allContacts);
  }, [user.id, user.role]);

  // Filter landlords based on search
  const filteredLandlords = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleLandlordSelect = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      landlordId: contact.id,
      landlordName: contact.name,
    }));
    setSearchQuery(contact.name);
    setShowLandlordDropdown(false);
  };

  const [formData, setFormData] = useState({
    // Landlord (defaults to current owner)
    landlordId: property.currentOwnerId,
    landlordName: property.currentOwnerName,
    landlordType: 'individual' as 'individual' | 'agency' | 'investor' | 'corporate',
    
    // Rent Details
    monthlyRent: '',
    securityDeposit: '',
    advanceMonths: '1',
    
    // Lease Terms
    leaseDuration: '12',
    availableFrom: new Date().toISOString().split('T')[0],
    
    // Additional Costs
    maintenanceFee: '',
    utilities: 'tenant' as 'tenant' | 'landlord' | 'shared',
    
    // Commission
    commissionMonths: '1',
    
    // Requirements
    petPolicy: 'not-allowed' as 'allowed' | 'not-allowed' | 'case-by-case',
    furnishingStatus: 'unfurnished' as 'furnished' | 'semi-furnished' | 'unfurnished',
    
    // Notes
    tenantRequirements: '',
    specialTerms: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total upfront cost
  const monthlyRentNum = parseFloat(formData.monthlyRent) || 0;
  const securityDepositNum = parseFloat(formData.securityDeposit) || 0;
  const advanceMonthsNum = parseInt(formData.advanceMonths) || 0;
  const totalUpfront = securityDepositNum + (monthlyRentNum * advanceMonthsNum);

  // Calculate commission
  const commissionMonthsNum = parseInt(formData.commissionMonths) || 0;
  const estimatedCommission = monthlyRentNum * commissionMonthsNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.landlordId) {
      toast.error('Please select a landlord');
      return;
    }
    if (!formData.monthlyRent || parseFloat(formData.monthlyRent) <= 0) {
      toast.error('Please enter valid monthly rent');
      return;
    }

    setIsSubmitting(true);

    try {
      createRentCycle({
        propertyId: property.id,
        
        // Landlord
        landlordId: formData.landlordId,
        landlordName: formData.landlordName,
        landlordType: formData.landlordType,
        
        // Rent details
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined,
        advanceMonths: parseInt(formData.advanceMonths),
        
        // Lease
        leaseDuration: parseInt(formData.leaseDuration),
        availableFrom: formData.availableFrom,
        
        // Additional
        maintenanceFee: formData.maintenanceFee ? parseFloat(formData.maintenanceFee) : undefined,
        utilities: formData.utilities,
        
        // Commission
        commissionMonths: parseInt(formData.commissionMonths),
        
        // Requirements
        petPolicy: formData.petPolicy,
        furnishingStatus: formData.furnishingStatus,
        
        // Agent
        agentId: user.id,
        agentName: user.name,
        
        // Notes
        tenantRequirements: formData.tenantRequirements || undefined,
        specialTerms: formData.specialTerms || undefined,
      });

      toast.success('Rent cycle created successfully!');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating rent cycle:', error);
      toast.error('Failed to create rent cycle');
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
              <Key className="h-5 w-5" />
              Start Rent Cycle
            </DialogTitle>
            <DialogDescription>
              {formatPropertyAddress(property)}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Alert */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-purple-900">Listing Property for Rent</p>
                  <p className="text-purple-700 mt-1">
                    Configure rental terms, receive tenant applications, and manage leases.
                  </p>
                </div>
              </div>
            </div>

            {/* Landlord Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Landlord
                </CardTitle>
                <CardDescription>Who is renting out this property?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landlord">
                    Select Landlord <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search landlords..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowLandlordDropdown(true);
                          }}
                          onFocus={() => setShowLandlordDropdown(true)}
                          className="pl-9"
                        />
                      </div>
                      
                      {showLandlordDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredLandlords.length > 0 ? (
                            filteredLandlords.map(landlord => (
                              <button
                                key={landlord.id}
                                type="button"
                                onClick={() => handleLandlordSelect(landlord)}
                                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                              >
                                <div className="font-medium">{landlord.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {landlord.phone} • {landlord.type}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              No landlords found
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
                  {formData.landlordName && (
                    <p className="text-sm text-muted-foreground">
                      Selected: <span className="font-medium">{formData.landlordName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landlordType">Landlord Type</Label>
                  <Select
                    value={formData.landlordType}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, landlordType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Rent Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Rent Details
                </CardTitle>
                <CardDescription>Monthly rent and upfront costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">
                      Monthly Rent <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      placeholder="0"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                      required
                      min="0"
                      step="1000"
                    />
                    {formData.monthlyRent && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.monthlyRent))}/month
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      placeholder="0"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                      min="0"
                      step="1000"
                    />
                    {formData.securityDeposit && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.securityDeposit))}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advanceMonths">Advance Rent (Months)</Label>
                  <Select
                    value={formData.advanceMonths}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, advanceMonths: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Advance</SelectItem>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Upfront Calculation */}
                {totalUpfront > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Upfront Cost</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPKR(totalUpfront)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Security deposit + {advanceMonthsNum} month(s) advance
                        </p>
                      </div>
                      <Home className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lease Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lease Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaseDuration">Lease Duration (Months)</Label>
                    <Select
                      value={formData.leaseDuration}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, leaseDuration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="24">24 Months</SelectItem>
                        <SelectItem value="36">36 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceFee">Maintenance Fee (Optional)</Label>
                    <Input
                      id="maintenanceFee"
                      type="number"
                      placeholder="0"
                      value={formData.maintenanceFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenanceFee: e.target.value }))}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utilities">Utilities</Label>
                    <Select
                      value={formData.utilities}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, utilities: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Tenant Pays</SelectItem>
                        <SelectItem value="landlord">Landlord Pays</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Property Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petPolicy">Pet Policy</Label>
                    <Select
                      value={formData.petPolicy}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, petPolicy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allowed">Pets Allowed</SelectItem>
                        <SelectItem value="not-allowed">No Pets</SelectItem>
                        <SelectItem value="case-by-case">Case by Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="furnishingStatus">Furnishing Status</Label>
                    <Select
                      value={formData.furnishingStatus}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, furnishingStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="furnished">Furnished</SelectItem>
                        <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                        <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantRequirements">Tenant Requirements (Optional)</Label>
                  <Textarea
                    id="tenantRequirements"
                    placeholder="e.g., Working professionals preferred, no smoking, minimum income requirement..."
                    value={formData.tenantRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenantRequirements: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialTerms">Special Terms (Optional)</Label>
                  <Textarea
                    id="specialTerms"
                    placeholder="Any special conditions or terms..."
                    value={formData.specialTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialTerms: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Commission */}
            <Card>
              <CardHeader>
                <CardTitle>Commission</CardTitle>
                <CardDescription>Your commission for this rental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commissionMonths">Commission (Months of Rent)</Label>
                  <Select
                    value={formData.commissionMonths}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, commissionMonths: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">Half Month</SelectItem>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {estimatedCommission > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Commission</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatPKR(estimatedCommission)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Rent Cycle'}
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
            handleLandlordSelect(newContact);
            setShowQuickAdd(false);
          }}
        />
      )}
    </>
  );
}