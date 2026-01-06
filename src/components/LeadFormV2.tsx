/**
 * Lead Form V2 - Clean Implementation with Form Design Standards ✅
 * 
 * Simple form for adding leads with:
 * - FormContainer + FormSection + FormField
 * - Complete validation
 * - Contact search and import
 * - Duplicate detection
 * - Property association
 * - Source tracking
 * 
 * Industry standard lead fields for real estate CRM
 */

import React, { useState, useMemo } from 'react';
import { User, Contact } from '../types';
import { FormContainer } from './ui/form-container';
import { FormSection, FormSectionDivider } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  required,
  email,
  pakistanPhone,
  minLength,
  maxLength,
  validateForm,
  hasErrors,
  type FormErrors,
} from '../lib/formValidation';
import { addLead, getProperties } from '../lib/data';
import { toast } from 'sonner';
import { Loader2, Users, Search, AlertTriangle } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  source: string;
  leadType: 'buyer' | 'seller' | 'tenant' | 'landlord' | '';
  budget: string;
  propertyId: string;
  propertyType: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | '';
  notes: string;
}

interface LeadFormV2Props {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
}

// ==================== LEAD SOURCES ====================

const LEAD_SOURCES = [
  'Website',
  'Facebook',
  'Instagram',
  'WhatsApp',
  'Phone Call',
  'Walk-in',
  'Referral',
  'Zameen.com',
  'Lamudi',
  'OLX',
  'Property Portal',
  'Email Campaign',
  'Other',
];

// ==================== MAIN COMPONENT ====================

export function LeadFormV2({ user, onBack, onSuccess }: LeadFormV2Props) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    source: '',
    leadType: '',
    budget: '',
    propertyId: '',
    propertyType: '',
    location: '',
    urgency: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors<LeadFormData>>({});
  const [touched, setTouched] = useState<Set<keyof LeadFormData>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');

  // Load properties and contacts
  const properties = useMemo(() => {
    return getProperties(user.id, user.role).filter((p) => p.status === 'available');
  }, [user.id, user.role]);

  const crmContacts = useMemo(() => {
    const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
    return user.role === 'admin'
      ? contacts
      : contacts.filter((contact: Contact) => contact.agentId === user.id);
  }, [user.id, user.role]);

  const filteredContacts = useMemo(() => {
    if (!contactSearchQuery) return crmContacts;
    const query = contactSearchQuery.toLowerCase();
    return crmContacts.filter(
      (contact: Contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(query))
    );
  }, [crmContacts, contactSearchQuery]);

  // Handle field change
  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Check for duplicates when phone/email changes
    if (field === 'phone' || field === 'email') {
      checkDuplicates(field, value);
    }
  };

  // Handle field blur
  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => new Set([...prev, field]));

    // Validate this field
    const validator = validationRules[field];
    if (validator) {
      const error = validator(formData[field]);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  // Check for duplicate leads
  const checkDuplicates = (field: 'phone' | 'email', value: string) => {
    if (!value) {
      setDuplicateWarning('');
      return;
    }

    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const duplicate = leads.find((lead: any) => {
      if (field === 'phone') return lead.phone === value;
      if (field === 'email') return lead.email === value;
      return false;
    });

    if (duplicate) {
      setDuplicateWarning(
        `A lead with this ${field} already exists: ${duplicate.name}`
      );
    } else {
      setDuplicateWarning('');
    }
  };

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setFormData({
      ...formData,
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      source: contact.source || 'CRM Import',
      notes: `Imported from CRM. ${contact.notes ? `\n\nPrevious notes: ${contact.notes}` : ''}`,
    });
    setShowContactSearch(false);
    setContactSearchQuery('');
    toast.success(`Contact imported: ${contact.name}`);
  };

  // Validation rules
  const validationRules = {
    name: (value: string) =>
      required(value, 'Name') || minLength(value, 2, 'Name'),
    phone: (value: string) =>
      required(value, 'Phone') || pakistanPhone(value),
    email: (value: string) => (value ? email(value) : undefined),
    source: (value: string) => required(value, 'Lead source'),
    leadType: (value: string) => required(value, 'Lead type'),
    budget: (value: string) => undefined, // Optional
    propertyId: (value: string) => undefined, // Optional
    propertyType: (value: string) => undefined, // Optional
    location: (value: string) => undefined, // Optional
    urgency: (value: string) => undefined, // Optional
    notes: (value: string) =>
      value ? maxLength(value, 500, 'Notes') : undefined,
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateForm(formData, validationRules);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      // Mark all fields as touched
      setTouched(
        new Set(Object.keys(formData) as Array<keyof LeadFormData>)
      );
      return;
    }

    // Check for duplicates
    if (duplicateWarning) {
      if (
        !confirm(
          'This lead appears to be a duplicate. Do you want to continue?'
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare lead data
      const leadData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        agentId: user.id,
        agentName: user.name,
        status: 'new',
        createdAt: new Date().toISOString(),
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 7 days from now
      };

      addLead(leadData);
      toast.success('Lead added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      title="Add New Lead"
      description="Capture potential client information for follow-up"
      onBack={onBack}
      onSubmit={handleSubmit}
      maxWidth="md"
    >
      <FormContainer.Body>
        {/* Contact Import Section */}
        {crmContacts.length > 0 && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Import from Existing Contacts
                    </p>
                    <p className="text-sm text-blue-700">
                      {crmContacts.length} contacts available
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactSearch(!showContactSearch)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {showContactSearch ? 'Hide' : 'Search'}
                </Button>
              </div>

              {showContactSearch && (
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Search by name, phone, or email..."
                    value={contactSearchQuery}
                    onChange={(e) => setContactSearchQuery(e.target.value)}
                  />
                  {filteredContacts.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredContacts.slice(0, 10).map((contact) => (
                        <div
                          key={contact.id}
                          className="p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-600">
                                {contact.phone}
                              </p>
                            </div>
                            <Badge variant="secondary">{contact.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No contacts found
                    </p>
                  )}
                </div>
              )}
            </div>

            <FormSectionDivider />
          </>
        )}

        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">
                Potential Duplicate
              </p>
              <p className="text-sm text-yellow-700">{duplicateWarning}</p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <FormSection
          title="Contact Information"
          description="Basic details of the lead"
        >
          <FormField
            label="Full Name"
            required
            error={touched.has('name') ? errors.name : undefined}
            hint="Enter the lead's full name"
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
              label="Phone Number"
              required
              error={touched.has('phone') ? errors.phone : undefined}
              tooltip="Enter Pakistani phone number: 03001234567"
            >
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="03001234567"
              />
            </FormField>

            <FormField
              label="Email"
              error={touched.has('email') ? errors.email : undefined}
              hint="Optional"
            >
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="john@example.com"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSectionDivider />

        {/* Lead Details */}
        <FormSection
          title="Lead Details"
          description="Classification and requirements"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Lead Type"
              required
              error={touched.has('leadType') ? errors.leadType : undefined}
            >
              <Select
                value={formData.leadType}
                onValueChange={(value) => handleChange('leadType', value)}
              >
                <SelectTrigger onBlur={() => handleBlur('leadType')}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Lead Source"
              required
              error={touched.has('source') ? errors.source : undefined}
            >
              <Select
                value={formData.source}
                onValueChange={(value) => handleChange('source', value)}
              >
                <SelectTrigger onBlur={() => handleBlur('source')}>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <FormField label="Urgency" hint="How urgent is this lead?">
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleChange('urgency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Just browsing</SelectItem>
                  <SelectItem value="medium">
                    Medium - Actively looking
                  </SelectItem>
                  <SelectItem value="high">High - Ready to buy/rent</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Property Type Interest"
            hint="What type of property are they interested in?"
          >
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land/Plot</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Preferred Location"
            hint="Neighborhood or area they're interested in"
          >
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="DHA Phase 8, Clifton, etc."
            />
          </FormField>

          {properties.length > 0 && (
            <FormField
              label="Interested in Specific Property"
              hint="Link to an available property"
            >
              <Select
                value={formData.propertyId}
                onValueChange={(value) => handleChange('propertyId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title || property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}
        </FormSection>

        <FormSectionDivider />

        {/* Additional Notes */}
        <FormSection title="Additional Notes">
          <FormField
            label="Notes"
            error={touched.has('notes') ? errors.notes : undefined}
            hint={`${formData.notes.length}/500 characters`}
          >
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Any additional information about this lead, their requirements, or conversation notes..."
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Lead...
            </>
          ) : (
            'Add Lead'
          )}
        </Button>
      </FormContainer.Footer>
    </FormContainer>
  );
}
