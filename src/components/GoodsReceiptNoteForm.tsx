import React, { useState, useEffect } from 'react';
import { User, PurchaseOrder, GoodsReceiptNote, GoodsReceiptItem } from '../types';
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  saveGoodsReceiptNote,
  generateGRNNumber,
  initializeGRNSystem,
} from '../lib/grn';
import { formatPKR } from '../lib/currency';
import { ArrowLeft, Upload, CheckCircle, XCircle, AlertTriangle, Package, Calendar, User as UserIcon, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface GoodsReceiptNoteFormProps {
  user: User;
  onBack: () => void;
}

export function GoodsReceiptNoteForm({ user, onBack }: GoodsReceiptNoteFormProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPOId, setSelectedPOId] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<GoodsReceiptItem[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeGRNSystem();
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = () => {
    // Only show approved POs that are not fully received
    const pos = getPurchaseOrders().filter(
      po => po.status === 'approved' || po.status === 'partially-received'
    );
    setPurchaseOrders(pos);
  };

  const handlePOSelection = (poId: string) => {
    setSelectedPOId(poId);
    const po = getPurchaseOrderById(poId);
    setSelectedPO(po);

    if (po) {
      // Initialize GRN items from PO items
      const grnItems: GoodsReceiptItem[] = po.items.map(poItem => ({
        id: `grn-item-${poItem.id}`,
        materialId: poItem.materialId,
        materialCode: poItem.materialCode,
        materialName: poItem.materialName,
        unit: poItem.unit,
        orderedQuantity: poItem.orderedQuantity,
        receivedQuantity: 0,
        qualityCheck: 'accepted',
        remarks: '',
        damageQuantity: 0,
        acceptedQuantity: 0,
      }));
      setItems(grnItems);
    }
  };

  const updateItem = (index: number, field: keyof GoodsReceiptItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculate accepted quantity based on quality check
    if (field === 'receivedQuantity' || field === 'damageQuantity' || field === 'qualityCheck') {
      const item = updatedItems[index];
      const received = item.receivedQuantity || 0;
      const damaged = item.damageQuantity || 0;

      if (item.qualityCheck === 'accepted') {
        item.acceptedQuantity = received;
      } else if (item.qualityCheck === 'partially-accepted') {
        item.acceptedQuantity = Math.max(0, received - damaged);
      } else if (item.qualityCheck === 'rejected') {
        item.acceptedQuantity = 0;
      }
    }

    setItems(updatedItems);
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const photoId = `photo-${Date.now()}`;
    const photoUrl = `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400`;
    setPhotos([...photos, photoUrl]);
    toast.success('Photo uploaded successfully');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const calculateOverallQualityStatus = (): 'accepted' | 'rejected' | 'partially-accepted' => {
    const allAccepted = items.every(item => item.qualityCheck === 'accepted');
    const allRejected = items.every(item => item.qualityCheck === 'rejected');
    
    if (allAccepted) return 'accepted';
    if (allRejected) return 'rejected';
    return 'partially-accepted';
  };

  const calculateTotalValue = (): number => {
    if (!selectedPO) return 0;
    
    return items.reduce((total, item) => {
      const poItem = selectedPO.items.find(pi => pi.materialId === item.materialId);
      if (!poItem) return total;
      
      const acceptedQty = item.acceptedQuantity || 0;
      return total + (acceptedQty * poItem.unitPrice);
    }, 0);
  };

  const validateForm = (): boolean => {
    if (!selectedPOId) {
      toast.error('Please select a purchase order');
      return false;
    }

    if (!receivedDate) {
      toast.error('Please select received date');
      return false;
    }

    if (items.some(item => item.receivedQuantity === 0)) {
      toast.error('Please enter received quantity for all items');
      return false;
    }

    if (items.some(item => item.receivedQuantity > item.orderedQuantity)) {
      toast.error('Received quantity cannot exceed ordered quantity');
      return false;
    }

    if (items.some(item => 
      item.qualityCheck === 'partially-accepted' && 
      (!item.damageQuantity || item.damageQuantity === 0)
    )) {
      toast.error('Please specify damage quantity for partially accepted items');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm() || !selectedPO) return;

    setIsSubmitting(true);

    try {
      const grn: GoodsReceiptNote = {
        id: `grn-${Date.now()}`,
        grnNumber: generateGRNNumber(),
        purchaseOrderId: selectedPO.id,
        purchaseOrderNumber: selectedPO.poNumber,
        supplierId: selectedPO.supplierId,
        supplierName: selectedPO.supplierName,
        siteId: selectedPO.siteId,
        siteName: selectedPO.siteName,
        receivedDate,
        receivedBy: user.id,
        receivedByName: user.name,
        status: 'submitted',
        items,
        overallQualityStatus: calculateOverallQualityStatus(),
        totalReceivedValue: calculateTotalValue(),
        photos,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveGoodsReceiptNote(grn);
      toast.success('Goods Receipt Note created successfully');
      onBack();
    } catch (error) {
      console.error('Error saving GRN:', error);
      toast.error('Failed to create GRN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQualityIcon = (status: 'accepted' | 'rejected' | 'partially-accepted') => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'partially-accepted':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const overallStatus = calculateOverallQualityStatus();
  const totalValue = calculateTotalValue();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl text-gray-900">Goods Receipt Note (GRN)</h1>
                <p className="text-gray-600 mt-1">Record delivery receipt and quality verification</p>
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !selectedPO}
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              {isSubmitting ? 'Finalizing...' : 'Finalize GRN'}
            </Button>
          </div>

          {/* Summary Cards */}
          {selectedPO && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Purchase Order</p>
                    <p className="text-gray-900 mt-1">{selectedPO.poNumber}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Supplier</p>
                    <p className="text-gray-900 mt-1">{selectedPO.supplierName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    {getQualityIcon(overallStatus)}
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Overall Status</p>
                    <p className="text-gray-900 mt-1 capitalize">{overallStatus.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">Total Value</p>
                    <p className="text-gray-900 mt-1">{formatPKR(totalValue)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* PO Selection & Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Delivery Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Purchase Order (PO) ID *
                </label>
                <Select value={selectedPOId} onValueChange={handlePOSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Purchase Order" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseOrders.map(po => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.poNumber} - {po.supplierName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Received Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Received By
                </label>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              </div>
            </div>

            {selectedPO && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Delivery Site:</span>
                    <span className="text-gray-900 ml-2">{selectedPO.siteName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Delivery:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(selectedPO.expectedDeliveryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">PO Total:</span>
                    <span className="text-gray-900 ml-2">{formatPKR(selectedPO.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Materials List */}
          {selectedPO && items.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-gray-900">Materials Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Verify quantity received and quality check for each material
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Material Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Material Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Ordered Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Received Qty *
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Quality Check *
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Damage Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Accepted Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.materialCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.materialName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.orderedQuantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={item.orderedQuantity}
                            value={item.receivedQuantity || ''}
                            onChange={(e) => updateItem(index, 'receivedQuantity', parseFloat(e.target.value) || 0)}
                            className="w-28 px-3 py-1.5 border border-gray-300 rounded text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={item.qualityCheck}
                            onValueChange={(value: any) => updateItem(index, 'qualityCheck', value)}
                          >
                            <SelectTrigger className="w-44">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accepted">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  Accepted
                                </div>
                              </SelectItem>
                              <SelectItem value="partially-accepted">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                  Partially Accepted
                                </div>
                              </SelectItem>
                              <SelectItem value="rejected">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  Rejected
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={item.receivedQuantity}
                            value={item.damageQuantity || ''}
                            onChange={(e) => updateItem(index, 'damageQuantity', parseFloat(e.target.value) || 0)}
                            disabled={item.qualityCheck !== 'partially-accepted'}
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getQualityIcon(item.qualityCheck)}
                            <span className="text-sm text-gray-900">
                              {item.acceptedQuantity || 0} {item.unit}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.remarks || ''}
                            onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                            className="w-48 px-3 py-1.5 border border-gray-300 rounded text-sm"
                            placeholder="e.g., 3 bags damaged"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Photos Section */}
          {selectedPO && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900">Delivery Photos</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload photos of delivered goods or any damages
                  </p>
                </div>
                <Button onClick={handlePhotoUpload} variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </Button>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Delivery photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No photos uploaded yet. Click "Upload Photo" to add images.
                </div>
              )}
            </div>
          )}

          {/* Notes Section */}
          {selectedPO && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-gray-900 mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                placeholder="Add any additional observations, special conditions, or concerns about the delivery..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
