/**
 * Add Rent Requirement Modal - V3.0
 * Form to add new tenant search criteria for rental properties
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Contact } from '../types';
import { createRentRequirement } from '../lib/rentRequirements';
import { getContacts } from '../lib/data';
import { Search, Plus, UserCheck, DollarSign, Home, MapPin, Calendar } from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import { ContactFormModal } from './ContactFormModal';

interface AddRentRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export function AddRentRequirementModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: AddRentRequirementModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  const [formData, setFormData] = useState({
    // Tenant
    tenantId: '',
    tenantName: '',
    tenantContact: '',
    
    // Budget (Monthly Rent)
    minBudget: '',
    maxBudget: '',
    
    // Property criteria
    propertyTypes: [] as string[],
    minBedrooms: '2',
    maxBedrooms: '',
    minBathrooms: '',
    
    // Locations
    preferredLocations: [] as string[],
    locationInput: '',
    
    // Features
    mustHaveFeatures: [] as string[],
    featureInput: '',
    niceToHaveFeatures: [] as string[],
    niceFeatureInput: '',
    
    // Rental-specific
    leaseDuration: 'flexible' as '3-months' | '6-months' | '1-year' | '2-years' | 'flexible',
    moveInDate: '',
    petsAllowed: false,
    furnished: 'either' as 'yes' | 'no' | 'either',
    
    // Timeline
    urgency: 'medium' as 'low' | 'medium' | 'high',
    
    // Tenant verification
    employmentVerified: false,
    hasGuarantor: false,
    
    // Notes
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load contacts
  useEffect(() => {
    const allContacts = getContacts(user.id, user.role);
    const tenants = allContacts.filter(c => 
      c.category === 'tenant' || c.category === 'renter' || c.category === 'both'
    );
    setContacts(tenants);
  }, [user.id, user.role]);

  const filteredTenants = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleTenantSelect = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      tenantId: contact.id,
      tenantName: contact.name,
      tenantContact: contact.phone,
    }));
    setSearchQuery(contact.name);
    setShowTenantDropdown(false);
  };

  const handlePropertyTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleAddLocation = () => {
    if (formData.locationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, prev.locationInput.trim()],
        locationInput: '',
      }));
    }
  };

  const handleRemoveLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(l => l !== location),
    }));
  };

  const handleAddFeature = () => {
    if (formData.featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        mustHaveFeatures: [...prev.mustHaveFeatures, prev.featureInput.trim()],
        featureInput: '',
      }));
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      mustHaveFeatures: prev.mustHaveFeatures.filter(f => f !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.tenantId) {
      toast.error('Please select a tenant');
      return;
    }
    if (!formData.minBudget || parseFloat(formData.minBudget) <= 0) {
      toast.error('Please enter minimum monthly rent budget');
      return;
    }
    if (!formData.maxBudget || parseFloat(formData.maxBudget) <= 0) {
      toast.error('Please enter maximum monthly rent budget');
      return;
    }
    if (parseFloat(formData.minBudget) > parseFloat(formData.maxBudget)) {
      toast.error('Minimum budget cannot be greater than maximum budget');
      return;
    }
    if (formData.propertyTypes.length === 0) {
      toast.error('Please select at least one property type');
      return;
    }
    if (formData.preferredLocations.length === 0) {
      toast.error('Please add at least one preferred location');
      return;
    }

    setIsSubmitting(true);

    try {
      createRentRequirement({
        tenantId: formData.tenantId,
        tenantName: formData.tenantName,
        tenantContact: formData.tenantContact,
        agentId: user.id,
        agentName: user.name,
        
        minBudget: parseFloat(formData.minBudget),
        maxBudget: parseFloat(formData.maxBudget),
        
        propertyTypes: formData.propertyTypes,
        minBedrooms: parseInt(formData.minBedrooms),
        maxBedrooms: formData.maxBedrooms ? parseInt(formData.maxBedrooms) : undefined,
        minBathrooms: formData.minBathrooms ? parseInt(formData.minBathrooms) : undefined,
        preferredLocations: formData.preferredLocations,
        
        mustHaveFeatures: formData.mustHaveFeatures.length > 0 ? formData.mustHaveFeatures : undefined,
        niceToHaveFeatures: formData.niceToHaveFeatures.length > 0 ? formData.niceToHaveFeatures : undefined,
        
        leaseDuration: formData.leaseDuration,
        moveInDate: formData.moveInDate || undefined,
        petsAllowed: formData.petsAllowed,
        furnished: formData.furnished,
        
        urgency: formData.urgency,
        
        employmentVerified: formData.employmentVerified,
        hasGuarantor: formData.hasGuarantor,
        
        additionalNotes: formData.additionalNotes || undefined,
      });

      toast.success('Rent requirement added successfully!');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating rent requirement:', error);
      toast.error('Failed to create rent requirement');
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Add Rent Requirement
            </DialogTitle>
            <DialogDescription>
              Track what your tenant is looking for in a rental property
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Tenant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Select Tenant <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tenants..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowTenantDropdown(true);
                          }}
                          onFocus={() => setShowTenantDropdown(true)}
                          className="pl-9"
                        />
                      </div>
                      
                      {showTenantDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredTenants.length > 0 ? (
                            filteredTenants.map(tenant => (
                              <button
                                key={tenant.id}
                                type="button"
                                onClick={() => handleTenantSelect(tenant)}
                                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                              >
                                <div className="font-medium">{tenant.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {tenant.phone}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              No tenants found
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
                  {formData.tenantName && (
                    <p className="text-sm text-muted-foreground">
                      Selected: <span className="font-medium">{formData.tenantName}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Budget (Monthly Rent) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monthly Rent Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Minimum Monthly Rent <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.minBudget}
                      onChange={(e) => setFormData(prev => ({ ...prev, minBudget: e.target.value }))}
                      required
                      min="0"
                      step="5000"
                    />
                    {formData.minBudget && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.minBudget))}/month
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Maximum Monthly Rent <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.maxBudget}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: e.target.value }))}
                      required
                      min="0"
                      step="5000"
                    />
                    {formData.maxBudget && (
                      <p className="text-sm text-muted-foreground">
                        {formatPKR(parseFloat(formData.maxBudget))}/month
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Property Types <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['house', 'apartment', 'villa', 'commercial'].map(type => (
                      <Button
                        key={type}
                        type="button"
                        variant={formData.propertyTypes.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePropertyTypeToggle(type)}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Min Bedrooms</Label>
                    <Select
                      value={formData.minBedrooms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, minBedrooms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Bedrooms (Optional)</Label>
                    <Select
                      value={formData.maxBedrooms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, maxBedrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Min Bathrooms (Optional)</Label>
                    <Select
                      value={formData.minBathrooms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, minBathrooms: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Preferred Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., DHA Phase 5, Clifton"
                    value={formData.locationInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                  />
                  <Button type="button" onClick={handleAddLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc)}
                          className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Must-Have Features */}
            <Card>
              <CardHeader>
                <CardTitle>Must-Have Features (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Parking, Backup Generator, Gas"
                    value={formData.featureInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, featureInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.mustHaveFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.mustHaveFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="hover:bg-muted rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rental-Specific Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rental Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Lease Duration</Label>
                    <Select
                      value={formData.leaseDuration}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, leaseDuration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2 Years</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Desired Move-In Date (Optional)</Label>
                    <Input
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, moveInDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Furnished Preference</Label>
                    <Select
                      value={formData.furnished}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, furnished: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Furnished Only</SelectItem>
                        <SelectItem value="no">Unfurnished Only</SelectItem>
                        <SelectItem value="either">Either</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Has Pets</Label>
                      <p className="text-xs text-muted-foreground">Needs pet-friendly</p>
                    </div>
                    <Switch
                      checked={formData.petsAllowed}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, petsAllowed: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Employment Verified</Label>
                      <p className="text-xs text-muted-foreground">Has proof of income</p>
                    </div>
                    <Switch
                      checked={formData.employmentVerified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, employmentVerified: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Has Guarantor</Label>
                      <p className="text-xs text-muted-foreground">Has rental guarantor</p>
                    </div>
                    <Switch
                      checked={formData.hasGuarantor}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasGuarantor: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any specific requirements, preferences, or constraints..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    rows={3}
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
                {isSubmitting ? 'Adding...' : 'Add Requirement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Contact Modal */}
      {showQuickAdd && (
        <ContactFormModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onSuccess={(newContact) => {
            setContacts(prev => [...prev, newContact]);
            handleTenantSelect(newContact);
            setShowQuickAdd(false);
          }}
          agentId={user.id}
          defaultType="tenant"
        />
      )}
    </>
  );
}