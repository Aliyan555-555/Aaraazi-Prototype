/**
 * Multi-Step Form Example - PHASE 3 Form Design Standards ✅
 * 
 * Demonstrates:
 * - MultiStepForm component
 * - Step-by-step data collection
 * - Step validation
 * - Progress indicator
 * - Form state management across steps
 * 
 * This is a reference implementation for complex multi-step forms.
 */

import React, { useState } from 'react';
import { FormContainer } from '../ui/form-container';
import { FormSection } from '../ui/form-section';
import { FormField } from '../ui/form-field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { MultiStepForm, useMultiStepForm, type Step } from '../ui/multi-step-form';
import { toast } from 'sonner';
import {
  required,
  email,
  pakistanPhone,
  positiveNumber,
  propertyArea,
  validateForm,
  hasErrors,
} from '../../lib/formValidation';
import { Home, FileText, CheckCircle } from 'lucide-react';

// Form data type
interface PropertyFormData {
  // Step 1: Basic Information
  title: string;
  propertyType: string;
  listingType: string;
  
  // Step 2: Location & Details
  address: string;
  city: string;
  area: string;
  areaUnit: string;
  bedrooms: string;
  bathrooms: string;
  
  // Step 3: Pricing
  price: string;
  priceNegotiable: boolean;
  
  // Step 4: Additional Details
  description: string;
  features: string[];
}

// Initial form data
const initialData: PropertyFormData = {
  title: '',
  propertyType: '',
  listingType: '',
  address: '',
  city: '',
  area: '',
  areaUnit: 'sq yd',
  bedrooms: '',
  bathrooms: '',
  price: '',
  priceNegotiable: false,
  description: '',
  features: [],
};

interface MultiStepFormExampleProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function MultiStepFormExample({ onBack, onSuccess }: MultiStepFormExampleProps) {
  const { formData, updateFormData, resetFormData } = useMultiStepForm(initialData);
  const [errors, setErrors] = useState<any>({});

  // ==================== STEP 1: BASIC INFORMATION ====================
  const Step1BasicInfo = () => {
    const handleChange = (field: keyof PropertyFormData, value: any) => {
      updateFormData({ [field]: value });
      // Clear error
      if (errors[field]) {
        setErrors((prev: any) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    return (
      <FormSection
        title="Basic Information"
        description="Start with the fundamentals"
      >
        <FormField
          label="Property Title"
          required
          error={errors.title}
          hint="Create a descriptive title for the property"
        >
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Beautiful 3-Bedroom Villa in DHA"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Property Type"
            required
            error={errors.propertyType}
          >
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Listing Type"
            required
            error={errors.listingType}
          >
            <Select
              value={formData.listingType}
              onValueChange={(value) => handleChange('listingType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for-sale">For Sale</SelectItem>
                <SelectItem value="for-rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </FormSection>
    );
  };

  // ==================== STEP 2: LOCATION & DETAILS ====================
  const Step2LocationDetails = () => {
    const handleChange = (field: keyof PropertyFormData, value: any) => {
      updateFormData({ [field]: value });
      if (errors[field]) {
        setErrors((prev: any) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    return (
      <FormSection
        title="Location & Details"
        description="Where is the property located?"
      >
        <FormField
          label="Address"
          required
          error={errors.address}
        >
          <Input
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main Street"
          />
        </FormField>

        <FormField
          label="City"
          required
          error={errors.city}
        >
          <Select
            value={formData.city}
            onValueChange={(value) => handleChange('city', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="karachi">Karachi</SelectItem>
              <SelectItem value="lahore">Lahore</SelectItem>
              <SelectItem value="islamabad">Islamabad</SelectItem>
              <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Area"
            required
            error={errors.area}
          >
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="500"
              min="0"
            />
          </FormField>

          <FormField
            label="Area Unit"
            required
          >
            <Select
              value={formData.areaUnit}
              onValueChange={(value) => handleChange('areaUnit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sq yd">Sq Yards</SelectItem>
                <SelectItem value="sq ft">Sq Feet</SelectItem>
                <SelectItem value="marla">Marla</SelectItem>
                <SelectItem value="kanal">Kanal</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Bedrooms"
            required
            error={errors.bedrooms}
          >
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="3"
              min="0"
            />
          </FormField>

          <FormField
            label="Bathrooms"
            required
            error={errors.bathrooms}
          >
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              placeholder="2"
              min="0"
            />
          </FormField>
        </div>
      </FormSection>
    );
  };

  // ==================== STEP 3: PRICING ====================
  const Step3Pricing = () => {
    const handleChange = (field: keyof PropertyFormData, value: any) => {
      updateFormData({ [field]: value });
      if (errors[field]) {
        setErrors((prev: any) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    return (
      <FormSection
        title="Pricing"
        description="Set the property price"
      >
        <FormField
          label={formData.listingType === 'for-rent' ? 'Monthly Rent (PKR)' : 'Price (PKR)'}
          required
          error={errors.price}
        >
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="5000000"
            min="0"
          />
        </FormField>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="negotiable"
            checked={formData.priceNegotiable}
            onCheckedChange={(checked) => handleChange('priceNegotiable', checked)}
          />
          <div>
            <Label htmlFor="negotiable" className="cursor-pointer">
              Price is negotiable
            </Label>
            <p className="text-sm text-gray-500">
              Allow buyers to make offers below asking price
            </p>
          </div>
        </div>
      </FormSection>
    );
  };

  // ==================== STEP 4: ADDITIONAL DETAILS ====================
  const Step4Additional = () => {
    const handleChange = (field: keyof PropertyFormData, value: any) => {
      updateFormData({ [field]: value });
    };

    const toggleFeature = (feature: string) => {
      const currentFeatures = formData.features || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];
      handleChange('features', newFeatures);
    };

    const availableFeatures = [
      'Parking',
      'Garden',
      'Swimming Pool',
      'Gym',
      'Security',
      'Elevator',
    ];

    return (
      <FormSection
        title="Additional Details"
        description="Provide more information about the property"
      >
        <FormField
          label="Description"
          hint={`${formData.description.length}/1000 characters`}
        >
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the property, its features, and nearby amenities..."
            rows={6}
            maxLength={1000}
          />
        </FormField>

        <div>
          <Label className="mb-3 block">Features</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={formData.features?.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <Label htmlFor={feature} className="cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </FormSection>
    );
  };

  // ==================== STEP VALIDATION ====================
  const validateStep1 = () => {
    const stepErrors = validateForm(formData, {
      title: (value) => required(value, 'Title'),
      propertyType: (value) => required(value, 'Property type'),
      listingType: (value) => required(value, 'Listing type'),
    });

    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const stepErrors = validateForm(formData, {
      address: (value) => required(value, 'Address'),
      city: (value) => required(value, 'City'),
      area: (value) => required(value, 'Area') || propertyArea(value, formData.areaUnit),
      bedrooms: (value) => required(value, 'Bedrooms'),
      bathrooms: (value) => required(value, 'Bathrooms'),
    });

    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const stepErrors = validateForm(formData, {
      price: (value) => required(value, 'Price') || positiveNumber(value, 'Price'),
    });

    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      toast.error('Please enter a valid price');
      return false;
    }
    return true;
  };

  // ==================== FORM STEPS ====================
  const steps: Step[] = [
    {
      id: 'basic',
      title: 'Basic Info',
      description: 'Property type and listing details',
      component: <Step1BasicInfo />,
      validate: validateStep1,
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Address and property details',
      component: <Step2LocationDetails />,
      validate: validateStep2,
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Set the property price',
      component: <Step3Pricing />,
      validate: validateStep3,
    },
    {
      id: 'details',
      title: 'Details',
      description: 'Additional information',
      component: <Step4Additional />,
    },
  ];

  // Handle form completion
  const handleComplete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form Data:', formData);
      toast.success('Property added successfully!');
      resetFormData();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add property. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">Add New Property</h1>
          <p className="text-gray-600">
            Fill in the property details step by step
          </p>
        </div>

        {/* Multi-Step Form */}
        <MultiStepForm
          steps={steps}
          onComplete={handleComplete}
          allowStepNavigation={true}
          showStepNumbers={true}
          submitText="Add Property"
        />
      </div>
    </div>
  );
}
