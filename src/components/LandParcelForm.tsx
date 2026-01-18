import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  MapPin, 
  Building, 
  DollarSign, 
  FileText,
  Users,
  AlertTriangle
} from 'lucide-react';
import { User, LandParcel } from '../types';
import { addLandParcel, updateLandParcel, calculateFeasibilityScore } from '../lib/landAcquisition';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

interface LandParcelFormProps {
  user: User;
  editingParcel?: LandParcel | null;
  onBack: () => void;
  onSuccess: () => void;
}

export const LandParcelForm: React.FC<LandParcelFormProps> = ({
  user,
  editingParcel,
  onBack,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [tags, setTags] = useState<string[]>(editingParcel?.tags || []);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    // Basic Information
    parcelName: editingParcel?.parcelName || '',
    description: editingParcel?.description || '',
    
    // Location
    address: editingParcel?.location.address || '',
    city: editingParcel?.location.city || '',
    state: editingParcel?.location.state || 'Sindh',
    zipCode: editingParcel?.location.zipCode || '',
    country: editingParcel?.location.country || 'Pakistan',
    
    // Area
    totalArea: editingParcel?.area.totalArea || 0,
    areaUnit: editingParcel?.area.unit || 'sq-yards',
    usableArea: editingParcel?.area.usableArea || 0,
    frontage: editingParcel?.area.frontage || 0,
    depth: editingParcel?.area.depth || 0,
    shape: editingParcel?.area.shape || 'regular',
    
    // Legal
    ownershipType: editingParcel?.legal.ownershipType || 'freehold',
    titleDeedStatus: editingParcel?.legal.titleDeedStatus || 'pending',
    
    // Financial
    askingPrice: editingParcel?.financial.askingPrice || 0,
    pricePerUnit: editingParcel?.financial.pricePerUnit || 0,
    paymentTerms: editingParcel?.financial.paymentTerms || '',
    
    // Development
    zoningType: editingParcel?.development.zoningType || 'residential',
    maxFloors: editingParcel?.development.maxFloors || 0,
    maxCoverage: editingParcel?.development.maxCoverage || 0,
    
    // Process
    stage: editingParcel?.process.stage || 'scouting',
    priority: editingParcel?.process.priority || 'medium',
    
    // Owner Information
    ownerName: editingParcel?.stakeholders.currentOwner.name || '',
    ownerContact: editingParcel?.stakeholders.currentOwner.contact || '',
    ownerType: editingParcel?.stakeholders.currentOwner.type || 'individual',
    
    // Notes
    notes: editingParcel?.notes || ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-calculate price per unit when area or price changes
    if (field === 'totalArea' || field === 'askingPrice') {
      const area = field === 'totalArea' ? value : formData.totalArea;
      const price = field === 'askingPrice' ? value : formData.askingPrice;
      if (area > 0 && price > 0) {
        setFormData(prev => ({
          ...prev,
          pricePerUnit: Math.round(price / area)
        }));
      }
    }
    
    // Auto-calculate usable area (90% of total area by default)
    if (field === 'totalArea' && value > 0) {
      setFormData(prev => ({
        ...prev,
        usableArea: Math.round(value * 0.9)
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.parcelName.trim()) errors.push('Parcel name is required');
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (formData.totalArea <= 0) errors.push('Total area must be greater than 0');
    if (formData.askingPrice <= 0) errors.push('Asking price must be greater than 0');
    if (!formData.ownerName.trim()) errors.push('Owner name is required');
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setLoading(true);
    try {
      // Calculate basic feasibility score
      const feasibilityFactors = {
        location: 75, // Default values - would be calculated based on actual factors
        accessibility: 70,
        legalClearance: formData.titleDeedStatus === 'clear' ? 90 : 50,
        marketPotential: 70,
        infrastructure: 65,
        priceValue: 60
      };
      
      const feasibilityScore = calculateFeasibilityScore(feasibilityFactors);
      
      const parcelData: Omit<LandParcel, 'id' | 'createdAt' | 'updatedAt'> = {
        parcelName: formData.parcelName.trim(),
        description: formData.description.trim(),
        
        location: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          landmarks: [],
          accessibility: {
            roadAccess: 'good',
            publicTransport: 'fair',
            utilities: 'partial'
          }
        },
        
        area: {
          totalArea: formData.totalArea,
          unit: formData.areaUnit as any,
          usableArea: formData.usableArea,
          frontage: formData.frontage,
          depth: formData.depth,
          shape: formData.shape as any
        },
        
        legal: {
          status: 'pending',
          ownershipType: formData.ownershipType as any,
          titleDeedStatus: formData.titleDeedStatus as any,
          approvals: [],
          restrictions: [],
          easements: [],
          encumbrances: []
        },
        
        financial: {
          askingPrice: formData.askingPrice,
          pricePerUnit: formData.pricePerUnit,
          valuationAmount: formData.askingPrice * 0.95, // 5% below asking price
          marketValue: formData.askingPrice,
          stampDuty: formData.askingPrice * 0.01, // 1% stamp duty
          registrationCharges: formData.askingPrice * 0.002, // 0.2% registration
          totalCost: formData.askingPrice * 1.012, // Including stamp duty and registration
          paymentTerms: formData.paymentTerms,
          brokerageRate: 1,
          brokerageAmount: formData.askingPrice * 0.01
        },
        
        feasibility: {
          score: feasibilityScore,
          factors: feasibilityFactors,
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
          recommendation: feasibilityScore >= 70 ? 'recommended' : feasibilityScore >= 50 ? 'conditional' : 'not-recommended'
        },
        
        development: {
          zoningType: formData.zoningType as any,
          buildingPermissions: [],
          developmentRestrictions: [],
          maxFloors: formData.maxFloors,
          maxCoverage: formData.maxCoverage,
          farRatio: formData.maxFloors * 0.7, // Estimated FAR
          potentialUnits: Math.floor(formData.totalArea / 125), // Estimated units
          estimatedDevelopmentCost: formData.askingPrice * 0.6,
          estimatedRevenue: formData.askingPrice * 1.8,
          estimatedProfit: formData.askingPrice * 0.2
        },
        
        market: {
          comparablePrices: [],
          marketTrend: 'stable',
          demandLevel: 'medium',
          competitionLevel: 'medium',
          futureGrowthPotential: 'good',
          nearbyDevelopments: []
        },
        
        dueDiligence: {
          soilTest: {
            status: 'not-required',
            suitability: 'good'
          },
          surveyReport: {
            status: 'not-required'
          },
          environmentalClearance: {
            required: false,
            status: 'not-applicable'
          },
          utilityConnections: {
            electricity: 'nearby',
            water: 'nearby',
            gas: 'nearby',
            sewerage: 'nearby'
          }
        },
        
        process: {
          stage: formData.stage as any,
          priority: formData.priority as any,
          assignedTo: [user.id],
          keyDates: {
            scoutedDate: new Date().toISOString().split('T')[0],
            reviewDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dueDiligenceDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            finalDecisionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          milestones: [],
          nextActions: ['Initial feasibility study', 'Legal verification', 'Market analysis'],
          risks: []
        },
        
        stakeholders: {
          currentOwner: {
            name: formData.ownerName.trim(),
            contact: formData.ownerContact,
            type: formData.ownerType as any
          }
        },
        
        documents: {
          photos: [],
          reports: []
        },
        
        tags: tags,
        notes: formData.notes.trim(),
        internalRef: `LA-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
        projectId: undefined,
        createdBy: user.id,
        assignedTo: [user.id],
        lastReviewedAt: new Date().toISOString().split('T')[0],
        lastReviewedBy: user.id
      };

      if (editingParcel) {
        await updateLandParcel(editingParcel.id, parcelData);
        toast.success('Land parcel updated successfully');
      } else {
        await addLandParcel(parcelData);
        toast.success('Land parcel created successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving land parcel:', error);
      toast.error('Failed to save land parcel');
    } finally {
      setLoading(false);
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
              <h1 className="text-2xl font-semibold text-gray-900">
                {editingParcel ? 'Edit Land Parcel' : 'Add New Land Parcel'}
              </h1>
              <p className="text-gray-600 mt-1">
                {editingParcel ? 'Update land parcel information' : 'Enter details for the new land parcel'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingParcel ? 'Update Parcel' : 'Create Parcel'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Land Parcel Information</CardTitle>
            <CardDescription>
              Complete the form below to add a new land parcel to your acquisition pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-5 w-full mb-6">
                <TabsTrigger value="basic" className="gap-2">
                  <Building className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="location" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </TabsTrigger>
                <TabsTrigger value="financial" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial
                </TabsTrigger>
                <TabsTrigger value="legal" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Legal & Dev
                </TabsTrigger>
                <TabsTrigger value="stakeholders" className="gap-2">
                  <Users className="h-4 w-4" />
                  Stakeholders
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="parcelName">Parcel Name *</Label>
                    <Input
                      id="parcelName"
                      value={formData.parcelName}
                      onChange={(e) => handleInputChange('parcelName', e.target.value)}
                      placeholder="e.g., DHA Phase 9 - Corner Plot"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage">Current Stage</Label>
                    <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scouting">Scouting</SelectItem>
                        <SelectItem value="initial-review">Initial Review</SelectItem>
                        <SelectItem value="detailed-analysis">Detailed Analysis</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="due-diligence">Due Diligence</SelectItem>
                        <SelectItem value="finalization">Finalization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the land parcel, its features, and potential..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Total Area *</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      value={formData.totalArea}
                      onChange={(e) => handleInputChange('totalArea', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="areaUnit">Area Unit</Label>
                    <Select value={formData.areaUnit} onValueChange={(value) => handleInputChange('areaUnit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sq-yards">Square Yards</SelectItem>
                        <SelectItem value="sq-feet">Square Feet</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="marla">Marla</SelectItem>
                        <SelectItem value="kanal">Kanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address including street, sector, and area"
                    rows={2}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Karachi"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sindh">Sindh</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="KPK">KPK</SelectItem>
                        <SelectItem value="Balochistan">Balochistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="75000"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Pakistan"
                      className="w-full"
                      disabled
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="usableArea">Usable Area</Label>
                    <Input
                      id="usableArea"
                      type="number"
                      value={formData.usableArea}
                      onChange={(e) => handleInputChange('usableArea', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frontage">Frontage</Label>
                    <Input
                      id="frontage"
                      type="number"
                      value={formData.frontage}
                      onChange={(e) => handleInputChange('frontage', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={formData.depth}
                      onChange={(e) => handleInputChange('depth', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shape">Shape</Label>
                    <Select value={formData.shape} onValueChange={(value) => handleInputChange('shape', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                        <SelectItem value="corner">Corner</SelectItem>
                        <SelectItem value="through">Through</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="askingPrice">Asking Price (PKR) *</Label>
                    <Input
                      id="askingPrice"
                      type="number"
                      value={formData.askingPrice}
                      onChange={(e) => handleInputChange('askingPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                    {formData.askingPrice > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(formData.askingPrice)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">Price per Unit (PKR)</Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full"
                    />
                    {formData.pricePerUnit > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(formData.pricePerUnit)} per {formData.areaUnit.replace('-', ' ')}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    placeholder="e.g., 30% advance, 70% on registration"
                    rows={2}
                    className="w-full"
                  />
                </div>

                {/* Financial Summary */}
                {formData.askingPrice > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Estimated Costs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Asking Price:</span>
                          <span className="font-medium">{formatPKR(formData.askingPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stamp Duty (1%):</span>
                          <span className="font-medium">{formatPKR(formData.askingPrice * 0.01)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registration (0.2%):</span>
                          <span className="font-medium">{formatPKR(formData.askingPrice * 0.002)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brokerage (1%):</span>
                          <span className="font-medium">{formatPKR(formData.askingPrice * 0.01)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span>Total Cost:</span>
                          <span>{formatPKR(formData.askingPrice * 1.032)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Legal & Development Tab */}
              <TabsContent value="legal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownershipType">Ownership Type</Label>
                    <Select value={formData.ownershipType} onValueChange={(value) => handleInputChange('ownershipType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freehold">Freehold</SelectItem>
                        <SelectItem value="leasehold">Leasehold</SelectItem>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titleDeedStatus">Title Deed Status</Label>
                    <Select value={formData.titleDeedStatus} onValueChange={(value) => handleInputChange('titleDeedStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear">Clear</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="encumbered">Encumbered</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Development Potential</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="zoningType">Zoning Type</Label>
                      <Select value={formData.zoningType} onValueChange={(value) => handleInputChange('zoningType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select zoning" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="mixed-use">Mixed Use</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxFloors">Max Floors</Label>
                      <Input
                        id="maxFloors"
                        type="number"
                        value={formData.maxFloors}
                        onChange={(e) => handleInputChange('maxFloors', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxCoverage">Max Coverage (%)</Label>
                      <Input
                        id="maxCoverage"
                        type="number"
                        value={formData.maxCoverage}
                        onChange={(e) => handleInputChange('maxCoverage', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Stakeholders Tab */}
              <TabsContent value="stakeholders" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Current Owner Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="Enter owner name"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerType">Owner Type</Label>
                      <Select value={formData.ownerType} onValueChange={(value) => handleInputChange('ownerType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="cooperative">Cooperative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerContact">Contact Information</Label>
                    <Input
                      id="ownerContact"
                      value={formData.ownerContact}
                      onChange={(e) => handleInputChange('ownerContact', e.target.value)}
                      placeholder="Phone number or email"
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Additional Information</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes, observations, or important information about this land parcel..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};