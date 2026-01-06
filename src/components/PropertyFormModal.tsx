/**
 * Property Form Modal - V3.0
 * Simplified form for adding ONLY physical property details
 * NO cycle/listing type selection - that comes AFTER property creation
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Property, Contact, User } from '../types';
import { getContacts, addProperty, updateProperty } from '../lib/data';
import { QuickAddContactModal } from './QuickAddContactModal';
import { Plus, Search, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (property: Property) => void;
  user: User;
  editingProperty?: Property;
}

export function PropertyFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
  editingProperty,
}: PropertyFormModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    // Owner (required for Asset-Centric architecture)
    currentOwnerId: '',
    currentOwnerName: '',
    
    // Physical property details ONLY
    address: '',
    propertyType: 'house' as 'house' | 'apartment' | 'plot' | 'commercial' | 'land' | 'industrial',
    area: '',
    areaUnit: 'sqft' as 'sqft' | 'sqyards' | 'marla' | 'kanal',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    constructionYear: '',
    
    // Optional details
    features: [] as string[],
    description: '',
    images: [] as string[],
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Load contacts
  useEffect(() => {
    const allContacts = getContacts(user.id, user.role);
    setContacts(allContacts);
  }, [user.id, user.role]);

  // Populate form if editing
  useEffect(() => {
    if (editingProperty) {
      setFormData({
        currentOwnerId: editingProperty.currentOwnerId,
        currentOwnerName: editingProperty.currentOwnerName,
        address: editingProperty.address,
        propertyType: editingProperty.propertyType,
        area: editingProperty.area.toString(),
        areaUnit: editingProperty.areaUnit,
        bedrooms: editingProperty.bedrooms?.toString() || '',
        bathrooms: editingProperty.bathrooms?.toString() || '',
        floor: editingProperty.floor?.toString() || '',
        constructionYear: editingProperty.constructionYear?.toString() || '',
        features: editingProperty.features || [],
        description: editingProperty.description || '',
        images: editingProperty.images || [],
      });
    }
  }, [editingProperty]);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleOwnerSelect = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      currentOwnerId: contact.id,
      currentOwnerName: contact.name,
    }));
    setSearchQuery(contact.name);
    setShowContactDropdown(false);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      // Basic URL validation
      try {
        new URL(imageUrlInput.trim());
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrlInput.trim()],
        }));
        setImageUrlInput('');
      } catch {
        toast.error('Please enter a valid image URL');
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.currentOwnerId) {
      toast.error('Please select a property owner');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter property address');
      return;
    }
    if (!formData.area || parseFloat(formData.area) <= 0) {
      toast.error('Please enter a valid area');
      return;
    }

    try {
      let savedProperty: Property;

      if (editingProperty) {
        // Update existing property
        const updates: Partial<Property> = {
          address: formData.address.trim(),
          propertyType: formData.propertyType,
          area: parseFloat(formData.area),
          areaUnit: formData.areaUnit,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          floor: formData.floor ? parseInt(formData.floor) : undefined,
          constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : undefined,
          features: formData.features,
          description: formData.description.trim() || undefined,
          images: formData.images,
          currentOwnerId: formData.currentOwnerId,
          currentOwnerName: formData.currentOwnerName,
        };
        
        const updated = updateProperty(editingProperty.id, updates);
        if (!updated) {
          toast.error('Failed to update property');
          return;
        }
        savedProperty = updated;
      } else {
        // Create new property
        const propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
          // Physical details
          address: formData.address.trim(),
          propertyType: formData.propertyType,
          area: parseFloat(formData.area),
          areaUnit: formData.areaUnit,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          floor: formData.floor ? parseInt(formData.floor) : undefined,
          constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : undefined,
          features: formData.features,
          description: formData.description.trim() || undefined,
          images: formData.images,
          
          // Ownership
          currentOwnerId: formData.currentOwnerId,
          currentOwnerName: formData.currentOwnerName,
          ownershipHistory: [
            {
              ownerId: formData.currentOwnerId,
              ownerName: formData.currentOwnerName,
              acquiredDate: new Date().toISOString().split('T')[0],
              notes: 'Initial owner',
            },
          ],
          
          // V3.0: Empty cycle arrays (cycles added separately!)
          activeSellCycleIds: [],
          activePurchaseCycleIds: [],
          activeRentCycleIds: [],
          
          // Status (computed)
          currentStatus: 'No Active Cycle',
          
          // History
          cycleHistory: {
            sellCycles: [],
            purchaseCycles: [],
            rentCycles: [],
          },
          transactionIds: [],
          
          // Sharing
          createdBy: user.id,
          sharedWith: [],
          isInternalListing: false,
        };

        savedProperty = addProperty(propertyData);
      }

      onSuccess(savedProperty);
      handleClose();
      toast.success(editingProperty ? 'Property updated successfully!' : 'Property added successfully!');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      currentOwnerId: '',
      currentOwnerName: '',
      address: '',
      propertyType: 'house',
      area: '',
      areaUnit: 'sqft',
      bedrooms: '',
      bathrooms: '',
      floor: '',
      constructionYear: '',
      features: [],
      description: '',
      images: [],
    });
    setSearchQuery('');
    setFeatureInput('');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
            <DialogDescription>
              Enter the physical details of the property. You'll choose what to do with it (Sell, Purchase, Rent) in the next step.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Selection */}
            <div className="space-y-2">
              <Label htmlFor="owner">
                Property Owner <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search or select owner..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowContactDropdown(true);
                      }}
                      onFocus={() => setShowContactDropdown(true)}
                      className="pl-9"
                    />
                  </div>
                  
                  {/* Contact Dropdown */}
                  {showContactDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map(contact => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() => handleOwnerSelect(contact)}
                            className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {contact.phone} • {contact.type}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          No contacts found
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
              {formData.currentOwnerName && (
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{formData.currentOwnerName}</span>
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Property Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="e.g., R-164, Block D, Naya Nazimabad, Karachi"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="propertyType">
                Property Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">
                  Area <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g., 200"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaUnit">Unit</Label>
                <Select
                  value={formData.areaUnit}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, areaUnit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Square Feet</SelectItem>
                    <SelectItem value="sqyards">Square Yards</SelectItem>
                    <SelectItem value="marla">Marla</SelectItem>
                    <SelectItem value="kanal">Kanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bedrooms & Bathrooms (conditional) */}
            {(formData.propertyType === 'house' || formData.propertyType === 'apartment') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Floor (for apartments) */}
            {formData.propertyType === 'apartment' && (
              <div className="space-y-2">
                <Label htmlFor="floor">Floor Number</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.floor}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                  min="0"
                />
              </div>
            )}

            {/* Construction Year */}
            <div className="space-y-2">
              <Label htmlFor="constructionYear">Construction Year</Label>
              <Input
                id="constructionYear"
                type="number"
                placeholder="e.g., 2020"
                value={formData.constructionYear}
                onChange={(e) => setFormData(prev => ({ ...prev, constructionYear: e.target.value }))}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Property Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Corner Plot, Garden, Parking"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                >
                  Add
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-accent rounded-full"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Property Images
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add property photos to help showcase the asset. URLs can be from any image hosting service.
              </p>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                        {image}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional details about the property..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProperty ? 'Update Property' : 'Add Property'}
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
            handleOwnerSelect(newContact);
            setShowQuickAdd(false);
          }}
        />
      )}
    </>
  );
}