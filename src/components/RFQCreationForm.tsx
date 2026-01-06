import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  FileText,
  Calendar,
  Package,
  Users,
  Send,
  AlertCircle
} from 'lucide-react';
import { User } from '../types';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specifications: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  rating: number;
  email: string;
  status: 'active' | 'on-hold';
}

interface RFQData {
  title: string;
  projectName: string;
  submissionDeadline: string;
  description: string;
  materials: Material[];
  selectedSuppliers: string[];
}

interface RFQCreationFormProps {
  user: User;
  onBack: () => void;
  onSubmit?: (rfqData: RFQData) => void;
}

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Askari Cement Industries Ltd.',
    category: 'Cement',
    rating: 4.5,
    email: 'sales@askari-cement.com',
    status: 'active'
  },
  {
    id: 'SUP-002',
    name: 'Amir Steel Mills Pvt. Ltd.',
    category: 'Steel',
    rating: 4.2,
    email: 'quotes@amirsteel.com',
    status: 'active'
  },
  {
    id: 'SUP-003',
    name: 'Pak Elektron Limited',
    category: 'Electrical',
    rating: 4.7,
    email: 'procurement@pakelektron.com',
    status: 'active'
  },
  {
    id: 'SUP-004',
    name: 'National Hardware Co.',
    category: 'Hardware',
    rating: 3.8,
    email: 'sales@nationalhw.com',
    status: 'on-hold'
  },
  {
    id: 'SUP-005',
    name: 'Master Tiles & Ceramics',
    category: 'Tiles & Flooring',
    rating: 4.9,
    email: 'orders@mastertiles.com',
    status: 'active'
  },
  {
    id: 'SUP-006',
    name: 'Diamond Paints Industries',
    category: 'Paint & Finishing',
    rating: 4.1,
    email: 'sales@diamondpaints.com',
    status: 'active'
  }
];

const units = [
  'Bags',
  'Tons', 
  'Pieces',
  'Meters',
  'Square Feet',
  'Square Meters',
  'Liters',
  'Gallons',
  'Units',
  'Rolls'
];

export const RFQCreationForm: React.FC<RFQCreationFormProps> = ({
  user,
  onBack,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [rfqData, setRFQData] = useState<RFQData>({
    title: '',
    projectName: '',
    submissionDeadline: '',
    description: '',
    materials: [],
    selectedSuppliers: []
  });

  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id'>>({
    name: '',
    quantity: 0,
    unit: '',
    specifications: ''
  });

  const steps = [
    { id: 1, title: 'RFQ Details', icon: FileText },
    { id: 2, title: 'Add Materials', icon: Package },
    { id: 3, title: 'Select Suppliers', icon: Users },
    { id: 4, title: 'Review & Send', icon: Send }
  ];

  // Filtered suppliers based on search
  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity || !newMaterial.unit) {
      toast.error('Please fill all required fields for the material');
      return;
    }

    const material: Material = {
      id: `MAT-${Date.now()}`,
      ...newMaterial
    };

    setRFQData(prev => ({
      ...prev,
      materials: [...prev.materials, material]
    }));

    setNewMaterial({
      name: '',
      quantity: 0,
      unit: '',
      specifications: ''
    });

    toast.success('Material added successfully');
  };

  const handleRemoveMaterial = (materialId: string) => {
    setRFQData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== materialId)
    }));
    toast.success('Material removed');
  };

  const handleSupplierToggle = (supplierId: string) => {
    setRFQData(prev => ({
      ...prev,
      selectedSuppliers: prev.selectedSuppliers.includes(supplierId)
        ? prev.selectedSuppliers.filter(id => id !== supplierId)
        : [...prev.selectedSuppliers, supplierId]
    }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!rfqData.title || !rfqData.projectName || !rfqData.submissionDeadline) {
        toast.error('Please fill all required fields');
        return;
      }
    } else if (currentStep === 2) {
      if (rfqData.materials.length === 0) {
        toast.error('Please add at least one material');
        return;
      }
    } else if (currentStep === 3) {
      if (rfqData.selectedSuppliers.length === 0) {
        toast.error('Please select at least one supplier');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Final validation
    if (!rfqData.title || !rfqData.projectName || !rfqData.submissionDeadline || 
        rfqData.materials.length === 0 || rfqData.selectedSuppliers.length === 0) {
      toast.error('Please complete all required information');
      return;
    }

    // In a real application, this would send the RFQ
    if (onSubmit) {
      onSubmit(rfqData);
    }
    
    toast.success('RFQ sent successfully to selected suppliers');
    onBack();
  };

  const getStepIcon = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    const Icon = step?.icon || FileText;
    
    if (stepId < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (stepId === currentStep) {
      return <Icon className="h-5 w-5 text-blue-600" />;
    } else {
      return <Icon className="h-5 w-5 text-gray-400" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rfq-title">RFQ Title *</Label>
                <Input
                  id="rfq-title"
                  value={rfqData.title}
                  onChange={(e) => setRFQData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter RFQ title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={rfqData.projectName}
                  onChange={(e) => setRFQData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-deadline">Submission Deadline *</Label>
              <Input
                id="submission-deadline"
                type="datetime-local"
                value={rfqData.submissionDeadline}
                onChange={(e) => setRFQData(prev => ({ ...prev, submissionDeadline: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={rfqData.description}
                onChange={(e) => setRFQData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details or requirements for this RFQ"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Add Material Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-name">Material Name *</Label>
                    <Input
                      id="material-name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter material name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMaterial.quantity || ''}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter quantity"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select value={newMaterial.unit} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={handleAddMaterial} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="specifications">Specifications (Optional)</Label>
                  <Textarea
                    id="specifications"
                    value={newMaterial.specifications}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, specifications: e.target.value }))}
                    placeholder="Technical specifications, quality requirements, etc."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Materials List */}
            {rfqData.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Materials List ({rfqData.materials.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Material Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Specifications</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfqData.materials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.name}</TableCell>
                            <TableCell>{material.quantity}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell className="max-w-xs truncate">{material.specifications || '-'}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveMaterial(material.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {rfqData.materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No materials added yet. Add materials above to continue.</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Select Suppliers</h3>
                <p className="text-sm text-gray-600">
                  Choose suppliers to receive this RFQ ({rfqData.selectedSuppliers.length} selected)
                </p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card 
                  key={supplier.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    rfqData.selectedSuppliers.includes(supplier.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : ''
                  } ${supplier.status === 'on-hold' ? 'opacity-60' : ''}`}
                  onClick={() => handleSupplierToggle(supplier.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={rfqData.selectedSuppliers.includes(supplier.id)}
                        onChange={() => handleSupplierToggle(supplier.id)}
                      />
                      <Badge 
                        variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {supplier.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">{supplier.name}</h4>
                      <p className="text-sm text-gray-600">{supplier.category}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 rounded-full ${
                              star <= supplier.rating
                                ? 'bg-yellow-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm ml-1">{supplier.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No suppliers found matching your search.</p>
              </div>
            )}
          </div>
        );

      case 4:
        const selectedSuppliersData = mockSuppliers.filter(s => 
          rfqData.selectedSuppliers.includes(s.id)
        );
        
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Review RFQ Details</h3>
              </div>
              <p className="text-sm text-blue-800">
                Please review all information before sending the RFQ to selected suppliers.
              </p>
            </div>

            {/* RFQ Summary */}
            <Card>
              <CardHeader>
                <CardTitle>RFQ Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>RFQ Title</Label>
                    <p className="font-medium">{rfqData.title}</p>
                  </div>
                  <div>
                    <Label>Project Name</Label>
                    <p className="font-medium">{rfqData.projectName}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Submission Deadline</Label>
                  <p className="font-medium">
                    {new Date(rfqData.submissionDeadline).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {rfqData.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="font-medium">{rfqData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Materials Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Materials ({rfqData.materials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Material Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Specifications</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfqData.materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.name}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell className="max-w-xs">{material.specifications || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Selected Suppliers */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Suppliers ({selectedSuppliersData.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSuppliersData.map((supplier) => (
                    <div key={supplier.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{supplier.name}</h4>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{supplier.category}</p>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Create New RFQ</h1>
              <p className="text-gray-600 mt-1">
                Request quotations from multiple suppliers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stepper */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2
                      ${step.id === currentStep 
                        ? 'border-blue-600 bg-blue-50' 
                        : step.id < currentStep 
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      }
                    `}>
                      {getStepIcon(step.id)}
                    </div>
                    <div className="ml-3">
                      <p className={`
                        font-medium 
                        ${step.id === currentStep 
                          ? 'text-blue-600' 
                          : step.id < currentStep 
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      `}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4
                      ${step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(currentStep)}
              {steps.find(s => s.id === currentStep)?.title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter basic information about this RFQ'}
              {currentStep === 2 && 'Add materials and specifications needed'}
              {currentStep === 3 && 'Select suppliers to send this RFQ to'}
              {currentStep === 4 && 'Review all details before sending'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 gap-2">
                <Send className="h-4 w-4" />
                Send RFQ
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};