/**
 * Simple Form Example - PHASE 3 Form Design Standards ✅
 * 
 * Demonstrates:
 * - FormContainer with header and footer
 * - FormSection for grouping fields
 * - FormField with validation
 * - Form validation utilities
 * - Loading and success states
 * 
 * This is a reference implementation for all simple forms in aaraazi.
 */

import React, { useState } from 'react';
import { FormContainer } from '../ui/form-container';
import { FormSection, FormSectionDivider } from '../ui/form-section';
import { FormField } from '../ui/form-field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  required,
  email,
  pakistanPhone,
  minLength,
  maxLength,
  positiveNumber,
  validateForm,
  hasErrors,
  type FormErrors,
} from '../../lib/formValidation';
import { Loader2 } from 'lucide-react';

// Form data type
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  contactType: string;
  budget: string;
  notes: string;
}

// Validation rules
const validationRules = {
  name: (value: string) => required(value, 'Name') || minLength(value, 2, 'Name'),
  email: (value: string) => email(value),
  phone: (value: string) => required(value, 'Phone') || pakistanPhone(value),
  company: (value: string) => maxLength(value, 100, 'Company name'),
  contactType: (value: string) => required(value, 'Contact type'),
  budget: (value: string) => value ? positiveNumber(value, 'Budget') : undefined,
  notes: (value: string) => maxLength(value, 500, 'Notes'),
};

interface SimpleFormExampleProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function SimpleFormExample({ onBack, onSuccess }: SimpleFormExampleProps) {
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    contactType: '',
    budget: '',
    notes: '',
  });

  // Validation state
  const [errors, setErrors] = useState<FormErrors<ContactFormData>>({});
  const [touched, setTouched] = useState<Set<keyof ContactFormData>>(new Set());

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field change
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle field blur - validate on blur
  const handleBlur = (field: keyof ContactFormData) => {
    setTouched(prev => new Set([...prev, field]));

    // Validate this field
    const validator = validationRules[field];
    if (validator) {
      const error = validator(formData[field]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateForm(formData, validationRules);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    // Submit form
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      toast.success('Contact added successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      title="Add Contact"
      description="Enter contact information for your new lead or client"
      onBack={onBack}
      onSubmit={handleSubmit}
      maxWidth="md"
    >
      <FormContainer.Body>
        {/* Personal Information Section */}
        <FormSection
          title="Personal Information"
          description="Basic contact details"
        >
          <FormField
            label="Full Name"
            required
            error={touched.has('name') ? errors.name : undefined}
            hint="Enter the contact's full name"
          >
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="John Doe"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email"
              error={touched.has('email') ? errors.email : undefined}
              hint="Optional email address"
            >
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="john@example.com"
              />
            </FormField>

            <FormField
              label="Phone"
              required
              error={touched.has('phone') ? errors.phone : undefined}
              tooltip="Enter Pakistani phone number in format: 03001234567"
            >
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="03001234567"
              />
            </FormField>
          </div>

          <FormField
            label="Company"
            error={touched.has('company') ? errors.company : undefined}
            hint="Optional company name"
          >
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={() => handleBlur('company')}
              placeholder="Company Name Ltd."
            />
          </FormField>
        </FormSection>

        <FormSectionDivider />

        {/* Contact Details Section */}
        <FormSection
          title="Contact Details"
          description="Additional information about this contact"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Contact Type"
              required
              error={touched.has('contactType') ? errors.contactType : undefined}
            >
              <Select
                value={formData.contactType}
                onValueChange={(value) => handleChange('contactType', value)}
              >
                <SelectTrigger onBlur={() => handleBlur('contactType')}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Budget (PKR)"
              error={touched.has('budget') ? errors.budget : undefined}
              hint="Optional budget amount"
            >
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                onBlur={() => handleBlur('budget')}
                placeholder="5000000"
                min="0"
              />
            </FormField>
          </div>

          <FormField
            label="Notes"
            error={touched.has('notes') ? errors.notes : undefined}
            hint={`${formData.notes.length}/500 characters`}
          >
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Additional notes about this contact..."
              rows={4}
              maxLength={500}
            />
          </FormField>
        </FormSection>
      </FormContainer.Body>

      {/* Form Actions */}
      <FormContainer.Footer>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Contact...
            </>
          ) : (
            'Add Contact'
          )}
        </Button>
      </FormContainer.Footer>
    </FormContainer>
  );
}
