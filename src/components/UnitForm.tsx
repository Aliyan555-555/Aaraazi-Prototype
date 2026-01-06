import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface EnhancedUnit {
  id: string;
  projectId: string;
  unitNumber: string;
  block?: string;
  floor?: number;
  unitType: 'studio' | '1br' | '2br' | '3br' | '4br' | 'penthouse' | 'commercial' | 'parking';
  area: number;
  builtUpArea?: number;
  balconyArea?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  basePrice: number;
  currentPrice: number;
  pricePerSqft: number;
  status: 'available' | 'blocked' | 'reserved' | 'booked' | 'sold' | 'handed-over';
  amenities: string[];
  facing: 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
  view: string[];
  floorPlan?: string;
  images: string[];
  virtualTour?: string;
  priority: 'standard' | 'premium' | 'luxury';
  readyForHandover: boolean;
  handoverDate?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface UnitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: Omit<EnhancedUnit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  projectId: string;
  editingUnit?: EnhancedUnit | null;
}

export const UnitForm: React.FC<UnitFormProps> = ({
  isOpen,
  onClose,
  onSave,
  projectId,
  editingUnit
}) => {
  const [formData, setFormData] = useState({
    unitNumber: editingUnit?.unitNumber || '',
    block: editingUnit?.block || '',
    floor: editingUnit?.floor || 1,
    unitType: editingUnit?.unitType || '2br',
    area: editingUnit?.area || 0,
    builtUpArea: editingUnit?.builtUpArea || 0,
    balconyArea: editingUnit?.balconyArea || 0,
    bedrooms: editingUnit?.bedrooms || 2,
    bathrooms: editingUnit?.bathrooms || 2,
    parkingSlots: editingUnit?.parkingSlots || 1,
    basePrice: editingUnit?.basePrice || 0,
    currentPrice: editingUnit?.currentPrice || 0,
    status: editingUnit?.status || 'available',
    amenities: editingUnit?.amenities || [],
    facing: editingUnit?.facing || 'north',
    view: editingUnit?.view || [],
    priority: editingUnit?.priority || 'standard',
    readyForHandover: editingUnit?.readyForHandover || false,
    handoverDate: editingUnit?.handoverDate || '',
    tags: editingUnit?.tags || [],
    notes: editingUnit?.notes || ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newView, setNewView] = useState('');
  const [newTag, setNewTag] = useState('');

  const commonAmenities = [
    'Air Conditioning', 'Balcony', 'Built-in Wardrobes', 'Central Heating',
    'Elevator Access', 'Gym Access', 'Internet Ready', 'Parking Space',
    'Pool Access', 'Security System', 'Storage Room', 'Terrace'
  ];

  const commonViews = [
    'City View', 'Garden View', 'Pool View', 'Mountain View',
    'Sea View', 'Park View', 'Road View', 'Courtyard View'
  ];

  // Calculate price per sqft when area or price changes
  React.useEffect(() => {
    if (formData.area > 0 && formData.currentPrice > 0) {
      const pricePerSqft = formData.currentPrice / formData.area;
      setFormData(prev => ({ ...prev, pricePerSqft }));
    }
  }, [formData.area, formData.currentPrice]);

  const handleSave = () => {
    if (!formData.unitNumber.trim()) {
      toast.error('Unit number is required');
      return;
    }

    if (formData.area <= 0) {
      toast.error('Area must be greater than 0');
      return;
    }

    if (formData.currentPrice <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    const unitData: Omit<EnhancedUnit, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId,
      unitNumber: formData.unitNumber.trim(),
      block: formData.block || undefined,
      floor: formData.floor || undefined,
      unitType: formData.unitType as EnhancedUnit['unitType'],
      area: formData.area,
      builtUpArea: formData.builtUpArea || undefined,
      balconyArea: formData.balconyArea || undefined,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      parkingSlots: formData.parkingSlots,
      basePrice: formData.basePrice || formData.currentPrice,
      currentPrice: formData.currentPrice,
      pricePerSqft: formData.area > 0 ? formData.currentPrice / formData.area : 0,
      status: formData.status as EnhancedUnit['status'],
      amenities: formData.amenities,
      specifications: [],
      facing: formData.facing as EnhancedUnit['facing'],
      view: formData.view,
      floorPlan: undefined,
      images: [],
      virtualTour: undefined,
      priority: formData.priority as EnhancedUnit['priority'],
      readyForHandover: formData.readyForHandover,
      handoverDate: formData.handoverDate || undefined,
      tags: formData.tags,
      notes: formData.notes
    };

    onSave(unitData);
    onClose();
    toast.success(`Unit ${editingUnit ? 'updated' : 'created'} successfully`);
  };

  const addItem = (type: 'amenity' | 'view' | 'tag', value: string) => {
    if (!value.trim()) return;

    const fieldMap = {
      amenity: 'amenities',
      view: 'view',
      tag: 'tags'
    };

    const field = fieldMap[type];
    const currentValues = formData[field as keyof typeof formData] as string[];

    if (!currentValues.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentValues, value.trim()]
      }));
    }

    // Clear the input
    if (type === 'amenity') setNewAmenity('');
    if (type === 'view') setNewView('');
    if (type === 'tag') setNewTag('');
  };

  const removeItem = (type: 'amenity' | 'view' | 'tag', value: string) => {
    const fieldMap = {
      amenity: 'amenities',
      view: 'view',
      tag: 'tags'
    };

    const field = fieldMap[type];
    const currentValues = formData[field as keyof typeof formData] as string[];

    setFormData(prev => ({
      ...prev,
      [field]: currentValues.filter(item => item !== value)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? 'Edit Unit' : 'Add New Unit'}
          </DialogTitle>
          <DialogDescription>
            {editingUnit ? 'Update the unit details' : 'Create a new unit for this project'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                placeholder="e.g., A-101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block">Block (Optional)</Label>
              <Input
                id="block"
                value={formData.block}
                onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                placeholder="e.g., Block A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                min="0"
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) || 0 }))}
                placeholder="Floor number"
              />
            </div>
          </div>

          {/* Unit Type and Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type</Label>
              <Select
                value={formData.unitType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unitType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1br">1 Bedroom</SelectItem>
                  <SelectItem value="2br">2 Bedroom</SelectItem>
                  <SelectItem value="3br">3 Bedroom</SelectItem>
                  <SelectItem value="4br">4 Bedroom</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="handed-over">Handed Over</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Areas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Total Area (sq ft) *</Label>
              <Input
                id="area"
                type="number"
                min="0"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) || 0 }))}
                placeholder="Total area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="builtUpArea">Built-up Area (sq ft)</Label>
              <Input
                id="builtUpArea"
                type="number"
                min="0"
                value={formData.builtUpArea}
                onChange={(e) => setFormData(prev => ({ ...prev, builtUpArea: parseFloat(e.target.value) || 0 }))}
                placeholder="Built-up area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balconyArea">Balcony Area (sq ft)</Label>
              <Input
                id="balconyArea"
                type="number"
                min="0"
                value={formData.balconyArea}
                onChange={(e) => setFormData(prev => ({ ...prev, balconyArea: parseFloat(e.target.value) || 0 }))}
                placeholder="Balcony area"
              />
            </div>
          </div>

          {/* Rooms and Parking */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                placeholder="Number of bedrooms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                placeholder="Number of bathrooms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSlots">Parking Slots</Label>
              <Input
                id="parkingSlots"
                type="number"
                min="0"
                value={formData.parkingSlots}
                onChange={(e) => setFormData(prev => ({ ...prev, parkingSlots: parseInt(e.target.value) || 0 }))}
                placeholder="Number of parking slots"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (PKR) *</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="Base price"
              />
              {formData.basePrice > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatPKR(formData.basePrice)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price (PKR) *</Label>
              <Input
                id="currentPrice"
                type="number"
                min="0"
                value={formData.currentPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="Current price"
              />
              {formData.currentPrice > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatPKR(formData.currentPrice)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Price per sq ft</Label>
              <div className="p-3 bg-muted rounded border">
                {formData.area > 0 && formData.currentPrice > 0 ? (
                  <span className="text-sm">
                    {formatPKR(formData.currentPrice / formData.area)} per sq ft
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Enter area and price to calculate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Facing */}
          <div className="space-y-2">
            <Label htmlFor="facing">Facing Direction</Label>
            <Select
              value={formData.facing}
              onValueChange={(value) => setFormData(prev => ({ ...prev, facing: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select facing direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
                <SelectItem value="north-east">North-East</SelectItem>
                <SelectItem value="north-west">North-West</SelectItem>
                <SelectItem value="south-east">South-East</SelectItem>
                <SelectItem value="south-west">South-West</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  <span>{amenity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem('amenity', amenity)}
                    className="h-auto p-0 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {commonAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('amenity', amenity)}
                  disabled={formData.amenities.includes(amenity)}
                  className="text-xs"
                >
                  {amenity}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                onKeyPress={(e) => e.key === 'Enter' && addItem('amenity', newAmenity)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem('amenity', newAmenity)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Views */}
          <div className="space-y-2">
            <Label>Views</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.view.map((view, index) => (
                <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  <span>{view}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem('view', view)}
                    className="h-auto p-0 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {commonViews.map((view) => (
                <Button
                  key={view}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('view', view)}
                  disabled={formData.view.includes(view)}
                  className="text-xs"
                >
                  {view}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newView}
                onChange={(e) => setNewView(e.target.value)}
                placeholder="Add custom view"
                onKeyPress={(e) => e.key === 'Enter' && addItem('view', newView)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem('view', newView)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Handover Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="readyForHandover"
                checked={formData.readyForHandover}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyForHandover: checked }))}
              />
              <Label htmlFor="readyForHandover">Ready for handover</Label>
            </div>
            
            {formData.readyForHandover && (
              <div className="space-y-2">
                <Label htmlFor="handoverDate">Expected Handover Date</Label>
                <Input
                  id="handoverDate"
                  type="date"
                  value={formData.handoverDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, handoverDate: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  <span>{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem('tag', tag)}
                    className="h-auto p-0 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && addItem('tag', newTag)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem('tag', newTag)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this unit"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {editingUnit ? 'Update Unit' : 'Create Unit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};