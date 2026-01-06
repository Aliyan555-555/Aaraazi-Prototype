import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Plus, 
  Trash2, 
  Calendar,
  Calculator,
  FileText,
  Save,
  Send,
  X
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { toast } from 'sonner';

interface PurchaseOrderLineItem {
  id: string;
  itemDescription: string;
  quantity: number;
  rate: number;
  total: number;
}

interface PurchaseOrderData {
  supplierId: string;
  supplierName: string;
  poDate: string;
  expectedDeliveryDate: string;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  notes: string;
}

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (poData: PurchaseOrderData, status: 'draft' | 'pending-approval') => void;
}

// Mock suppliers data
const mockSuppliers = [
  { id: 'SUP-001', name: 'Askari Cement', category: 'Cement' },
  { id: 'SUP-002', name: 'Amir Steel Mills', category: 'Steel' },
  { id: 'SUP-003', name: 'Pak Elektron Limited', category: 'Electricals' },
  { id: 'SUP-004', name: 'National Hardware', category: 'Hardware' },
  { id: 'SUP-005', name: 'Master Tiles', category: 'Tiles & Flooring' },
  { id: 'SUP-006', name: 'Diamond Paints', category: 'Paint & Finishing' },
  { id: 'SUP-007', name: 'Al-Ghazi Steel', category: 'Steel' },
  { id: 'SUP-008', name: 'Lucky Cement', category: 'Cement' }
];

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [formData, setFormData] = useState<PurchaseOrderData>({
    supplierId: '',
    supplierName: '',
    poDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    lineItems: [],
    subtotal: 0,
    taxRate: 17, // Standard GST rate in Pakistan
    taxAmount: 0,
    grandTotal: 0,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with one empty line item
  useEffect(() => {
    if (isOpen && formData.lineItems.length === 0) {
      addLineItem();
    }
  }, [isOpen]);

  // Recalculate totals when line items or tax rate changes
  useEffect(() => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      grandTotal
    }));
  }, [formData.lineItems, formData.taxRate]);

  const addLineItem = () => {
    const newItem: PurchaseOrderLineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemDescription: '',
      quantity: 0,
      rate: 0,
      total: 0
    };

    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (itemId: string) => {
    if (formData.lineItems.length <= 1) {
      toast.error('At least one line item is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== itemId)
    }));
  };

  const updateLineItem = (itemId: string, field: keyof PurchaseOrderLineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate total for this line item
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total = updatedItem.quantity * updatedItem.rate;
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    setFormData(prev => ({
      ...prev,
      supplierId,
      supplierName: supplier?.name || ''
    }));
    
    // Clear supplier error if it exists
    if (errors.supplier) {
      setErrors(prev => ({ ...prev, supplier: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate supplier
    if (!formData.supplierId) {
      newErrors.supplier = 'Please select a supplier';
    }

    // Validate expected delivery date
    if (!formData.expectedDeliveryDate) {
      newErrors.deliveryDate = 'Expected delivery date is required';
    } else {
      const deliveryDate = new Date(formData.expectedDeliveryDate);
      const poDate = new Date(formData.poDate);
      if (deliveryDate <= poDate) {
        newErrors.deliveryDate = 'Delivery date must be after PO date';
      }
    }

    // Validate line items
    const hasValidLineItems = formData.lineItems.some(item => 
      item.itemDescription.trim() && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidLineItems) {
      newErrors.lineItems = 'At least one complete line item is required';
    }

    // Check for incomplete line items
    formData.lineItems.forEach((item, index) => {
      const hasAnyData = item.itemDescription.trim() || item.quantity > 0 || item.rate > 0;
      const isComplete = item.itemDescription.trim() && item.quantity > 0 && item.rate > 0;
      
      if (hasAnyData && !isComplete) {
        newErrors[`lineItem-${index}`] = 'Please complete all fields for this line item';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'pending-approval') => {
    if (!validateForm()) {
      toast.error('Please correct the errors before saving');
      return;
    }

    setLoading(true);
    try {
      // Filter out empty line items
      const validLineItems = formData.lineItems.filter(item => 
        item.itemDescription.trim() && item.quantity > 0 && item.rate > 0
      );

      const poData = {
        ...formData,
        lineItems: validLineItems
      };

      await onSave(poData, status);
      
      const statusText = status === 'draft' ? 'saved as draft' : 'submitted for approval';
      toast.success(`Purchase Order ${statusText} successfully`);
      onClose();
    } catch (error) {
      toast.error('Failed to save Purchase Order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      supplierId: '',
      supplierName: '',
      poDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      lineItems: [],
      subtotal: 0,
      taxRate: 17,
      taxAmount: 0,
      grandTotal: 0,
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Create Purchase Order
              </DialogTitle>
              <DialogDescription className="mt-1">
                Create a new purchase order for material procurement
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="supplier" className="flex items-center gap-2">
                  Supplier *
                  {errors.supplier && <span className="text-red-500 text-sm">({errors.supplier})</span>}
                </Label>
                <Select value={formData.supplierId} onValueChange={handleSupplierChange}>
                  <SelectTrigger className={errors.supplier ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{supplier.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {supplier.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  PO Date
                </Label>
                <Input
                  id="poDate"
                  type="date"
                  value={formData.poDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, poDate: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Expected Delivery Date *
                  {errors.deliveryDate && <span className="text-red-500 text-sm">({errors.deliveryDate})</span>}
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                  className={`w-full ${errors.deliveryDate ? 'border-red-500' : ''}`}
                  min={formData.poDate}
                />
              </div>
            </div>

            {/* Line Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  Line Items
                  {errors.lineItems && <span className="text-red-500 text-sm">({errors.lineItems})</span>}
                </h3>
                <Button onClick={addLineItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[40%]">Item Description</TableHead>
                      <TableHead className="w-[15%]">Quantity</TableHead>
                      <TableHead className="w-[20%]">Rate (PKR)</TableHead>
                      <TableHead className="w-[20%]">Total (PKR)</TableHead>
                      <TableHead className="w-[5%]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.lineItems.map((item, index) => (
                      <TableRow key={item.id} className={errors[`lineItem-${index}`] ? 'bg-red-50' : ''}>
                        <TableCell>
                          <Input
                            value={item.itemDescription}
                            onChange={(e) => updateLineItem(item.id, 'itemDescription', e.target.value)}
                            placeholder="Enter item description"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            step="1"
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate || ''}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-right font-medium">
                            {formatPKR(item.total)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            disabled={formData.lineItems.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Show line item errors */}
              {Object.entries(errors).filter(([key]) => key.startsWith('lineItem-')).map(([key, error]) => (
                <p key={key} className="text-sm text-red-600 mt-1">{error}</p>
              ))}
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes or special instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="pt-4 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Totals */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Order Summary
              </h4>
              
              <div className="space-y-3 bg-white p-4 rounded-lg border">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPKR(formData.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    Tax ({formData.taxRate}%):
                    <Input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      className="w-16 h-6 text-xs text-center"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </span>
                  <span className="font-medium">{formatPKR(formData.taxAmount)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Grand Total:</span>
                  <span className="text-lg text-blue-600">{formatPKR(formData.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save as Draft
                </Button>
                
                <Button
                  onClick={() => handleSave('pending-approval')}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit for Approval
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mt-3 text-center">
                Draft orders can be edited later. Submitted orders require approval.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};