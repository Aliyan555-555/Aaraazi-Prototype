import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface ConstructionArea {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'building' | 'amenity' | 'infrastructure' | 'landscape' | 'parking';
  supervisor: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  progress: number;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budget: number;
  spentAmount: number;
  workPackages: any[];
  issues: any[];
  qualityChecks: any[];
  safetyRecords: any[];
  photos: any[];
  weather: any[];
  materials: any[];
  labor: any[];
  equipment: any[];
  notes: string;
  tags: string[];
}

interface ConstructionAreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (area: Omit<ConstructionArea, 'id'>) => void;
  projectId: string;
  editingArea?: ConstructionArea | null;
}

export const ConstructionAreaForm: React.FC<ConstructionAreaFormProps> = ({
  isOpen,
  onClose,
  onSave,
  projectId,
  editingArea
}) => {
  const [formData, setFormData] = useState({
    name: editingArea?.name || '',
    description: editingArea?.description || '',
    type: editingArea?.type || 'building',
    supervisor: editingArea?.supervisor || '',
    status: editingArea?.status || 'not-started',
    progress: editingArea?.progress || 0,
    startDate: editingArea?.startDate || format(new Date(), 'yyyy-MM-dd'),
    targetEndDate: editingArea?.targetEndDate || format(new Date(), 'yyyy-MM-dd'),
    actualEndDate: editingArea?.actualEndDate || '',
    budget: editingArea?.budget || 0,
    spentAmount: editingArea?.spentAmount || 0,
    notes: editingArea?.notes || '',
    tags: editingArea?.tags || []
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [actualEndDateOpen, setActualEndDateOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const areaTypes = [
    { value: 'building', label: 'Building Structure' },
    { value: 'amenity', label: 'Amenity Area' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'landscape', label: 'Landscaping' },
    { value: 'parking', label: 'Parking Area' }
  ];

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: 'text-gray-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'delayed', label: 'Delayed', color: 'text-red-600' },
    { value: 'on-hold', label: 'On Hold', color: 'text-yellow-600' }
  ];

  const commonTags = [
    'Foundation', 'Structure', 'MEP', 'Finishing', 'External Works',
    'Safety Critical', 'High Priority', 'Weather Dependent', 'Inspection Required'
  ];

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Area name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.supervisor.trim()) {
      toast.error('Supervisor is required');
      return;
    }

    if (formData.budget <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.targetEndDate)) {
      toast.error('Target end date must be after start date');
      return;
    }

    const areaData: Omit<ConstructionArea, 'id'> = {
      projectId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type as ConstructionArea['type'],
      supervisor: formData.supervisor.trim(),
      status: formData.status as ConstructionArea['status'],
      progress: formData.progress,
      startDate: formData.startDate,
      targetEndDate: formData.targetEndDate,
      actualEndDate: formData.actualEndDate || undefined,
      budget: formData.budget,
      spentAmount: formData.spentAmount,
      workPackages: [],
      issues: [],
      qualityChecks: [],
      safetyRecords: [],
      photos: [],
      weather: [],
      materials: [],
      labor: [],
      equipment: [],
      notes: formData.notes,
      tags: formData.tags
    };

    onSave(areaData);
    onClose();
    toast.success(`Construction area ${editingArea ? 'updated' : 'created'} successfully`);
  };

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag.trim();
    if (tagToAdd && !formData.tags.includes(tagToAdd)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagToAdd]
      }));
      if (!tag) setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingArea ? 'Edit Construction Area' : 'Add Construction Area'}
          </DialogTitle>
          <DialogDescription>
            {editingArea ? 'Update the construction area details' : 'Create a new construction area for this project'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Area Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Tower A Foundation"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Area Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area type" />
                </SelectTrigger>
                <SelectContent>
                  {areaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the construction area and its scope"
              rows={3}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
              placeholder="Name of the area supervisor"
              className="w-full"
            />
          </div>

          {/* Status and Progress */}
          <div className="grid grid-cols-2 gap-4">
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
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <span className={status.color}>{status.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="px-3">
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0%</span>
                  <span className="text-blue-600 font-medium">{formData.progress}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, startDate: format(date, 'yyyy-MM-dd') }));
                        setStartDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Target End Date *</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetEndDate ? format(new Date(formData.targetEndDate), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.targetEndDate ? new Date(formData.targetEndDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, targetEndDate: format(date, 'yyyy-MM-dd') }));
                        setEndDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Actual End Date</Label>
              <Popover open={actualEndDateOpen} onOpenChange={setActualEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.actualEndDate ? format(new Date(formData.actualEndDate), 'PPP') : 'Not completed'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.actualEndDate ? new Date(formData.actualEndDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, actualEndDate: format(date, 'yyyy-MM-dd') }));
                        setActualEndDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (PKR) *</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
              {formData.budget > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatPKR(formData.budget)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="spentAmount">Spent Amount (PKR)</Label>
              <Input
                id="spentAmount"
                type="number"
                min="0"
                max={formData.budget}
                value={formData.spentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, spentAmount: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
              {formData.spentAmount > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formatPKR(formData.spentAmount)}
                  </p>
                  {formData.budget > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {((formData.spentAmount / formData.budget) * 100).toFixed(1)}% of budget used
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  <span>{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-auto p-0 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              {commonTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(tag)}
                  disabled={formData.tags.includes(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag()}
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
              placeholder="Additional notes about this construction area"
              rows={3}
            />
          </div>

          {/* Summary */}
          {formData.budget > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Budget Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Budget</p>
                  <p className="font-medium">{formatPKR(formData.budget)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spent Amount</p>
                  <p className="font-medium">{formatPKR(formData.spentAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-medium text-green-600">{formatPKR(formData.budget - formData.spentAmount)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {editingArea ? 'Update Area' : 'Create Area'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};