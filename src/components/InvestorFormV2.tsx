/**
 * Investor Form V2 - Clean Implementation with Form Design Standards ✅
 * 
 * Simple form for adding/editing investors with:
 * - FormContainer + FormSection + FormField
 * - Complete validation
 * - Investment preferences
 * - Risk profile
 * - Pakistani CNIC validation
 * - Banking details
 */

import React, { useState } from 'react';
import { User } from '../types';
import { FormContainer } from './ui/form-container';
import { FormSection, FormSectionDivider } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  required,
  email,
  pakistanPhone,
  pakistaniCNIC,
  positiveNumber,
  minLength,
  maxLength,
  validateForm,
  hasErrors,
  type FormErrors,
} from '../lib/formValidation';
import { addInvestor, updateInvestor } from '../lib/investors';
import { toast } from 'sonner';
import { Loader2, TrendingUp } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

interface InvestorFormData {
  // Personal Information
  name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  
  // Investment Profile
  investorType: 'individual' | 'corporate' | 'institutional' | '';
  companyName: string;
  investmentCapacity: string;
  investmentHorizon: 'short-term' | 'medium-term' | 'long-term' | '';
  riskProfile: 'conservative' | 'moderate' | 'aggressive' | '';
  
  // Investment Preferences
  preferredPropertyTypes: string[];
  preferredLocations: string[];
  minInvestmentAmount: string;
  maxInvestmentAmount: string;
  
  // Banking Information
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  
  // Additional Information
  previousInvestments: string;
  notes: string;
}

interface InvestorFormV2Props {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
  editingInvestor?: any;
}

// ==================== CONSTANTS ====================

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land', 'Mixed-Use'];

const KARACHI_AREAS = [
  'DHA', 'Clifton', 'Bahria Town', 'Gulshan-e-Iqbal',
  'North Nazimabad', 'PECHS', 'Malir', 'Saddar',
];

const PAKISTANI_BANKS = [
  'Habib Bank Limited (HBL)',
  'United Bank Limited (UBL)',
  'MCB Bank Limited',
  'Allied Bank Limited',
  'National Bank of Pakistan',
  'Meezan Bank',
  'Bank Alfalah',
  'Standard Chartered Bank',
  'Faysal Bank',
  'Askari Bank',
];

// ==================== MAIN COMPONENT ====================

export function InvestorFormV2({
  user,
  onBack,
  onSuccess,
  editingInvestor,
}: InvestorFormV2Props) {
  const isEditMode = !!editingInvestor;

  const [formData, setFormData] = useState<InvestorFormData>({
    name: editingInvestor?.name || '',
    cnic: editingInvestor?.cnic || '',
    phone: editingInvestor?.phone || '',
    email: editingInvestor?.email || '',
    address: editingInvestor?.address || '',
    investorType: editingInvestor?.investorType || '',
    companyName: editingInvestor?.companyName || '',
    investmentCapacity: editingInvestor?.investmentCapacity?.toString() || '',
    investmentHorizon: editingInvestor?.investmentHorizon || '',
    riskProfile: editingInvestor?.riskProfile || '',
    preferredPropertyTypes: editingInvestor?.preferredPropertyTypes || [],
    preferredLocations: editingInvestor?.preferredLocations || [],
    minInvestmentAmount: editingInvestor?.minInvestmentAmount?.toString() || '',
    maxInvestmentAmount: editingInvestor?.maxInvestmentAmount?.toString() || '',
    bankName: editingInvestor?.bankName || '',
    accountTitle: editingInvestor?.accountTitle || '',
    accountNumber: editingInvestor?.accountNumber || '',
    iban: editingInvestor?.iban || '',
    previousInvestments: editingInvestor?.previousInvestments || '',
    notes: editingInvestor?.notes || '',
  });

  const [errors, setErrors] = useState<FormErrors<InvestorFormData>>({});
  const [touched, setTouched] = useState<Set<keyof InvestorFormData>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field change
  const handleChange = (field: keyof InvestorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle field blur
  const handleBlur = (field: keyof InvestorFormData) => {
    setTouched((prev) => new Set([...prev, field]));

    // Validate this field
    const validator = validationRules[field];
    if (validator) {
      const error = validator(formData[field] as any);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  // Toggle array field
  const toggleArrayField = (field: 'preferredPropertyTypes' | 'preferredLocations', value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    handleChange(field, updated);
  };

  // Validation rules
  const validationRules = {
    name: (value: string) =>
      required(value, 'Name') || minLength(value, 2, 'Name'),
    cnic: (value: string) =>
      required(value, 'CNIC') || pakistaniCNIC(value),
    phone: (value: string) =>
      required(value, 'Phone') || pakistanPhone(value),
    email: (value: string) =>
      required(value, 'Email') || email(value),
    address: (value: string) => required(value, 'Address'),
    investorType: (value: string) => required(value, 'Investor type'),
    companyName: (value: string) =>
      formData.investorType === 'corporate' || formData.investorType === 'institutional'
        ? required(value, 'Company name')
        : undefined,
    investmentCapacity: (value: string) =>
      required(value, 'Investment capacity') || positiveNumber(value, 'Investment capacity'),
    investmentHorizon: (value: string) => required(value, 'Investment horizon'),
    riskProfile: (value: string) => required(value, 'Risk profile'),
    minInvestmentAmount: (value: string) =>
      required(value, 'Minimum investment') || positiveNumber(value, 'Minimum investment'),
    maxInvestmentAmount: (value: string) => {
      if (!value) return undefined;
      const minAmount = parseFloat(formData.minInvestmentAmount);
      const maxAmount = parseFloat(value);
      if (maxAmount < minAmount) {
        return 'Maximum investment must be greater than minimum';
      }
      return positiveNumber(value, 'Maximum investment');
    },
    notes: (value: string) =>
      value ? maxLength(value, 1000, 'Notes') : undefined,
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateForm(formData, validationRules as any);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      setTouched(new Set(Object.keys(formData) as Array<keyof InvestorFormData>));
      return;
    }

    setIsSubmitting(true);

    try {
      const investorData = {
        name: formData.name,
        cnic: formData.cnic,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        investorType: formData.investorType,
        companyName: formData.companyName || undefined,
        investmentCapacity: parseFloat(formData.investmentCapacity),
        investmentHorizon: formData.investmentHorizon,
        riskProfile: formData.riskProfile,
        preferredPropertyTypes: formData.preferredPropertyTypes,
        preferredLocations: formData.preferredLocations,
        minInvestmentAmount: parseFloat(formData.minInvestmentAmount),
        maxInvestmentAmount: formData.maxInvestmentAmount
          ? parseFloat(formData.maxInvestmentAmount)
          : undefined,
        bankName: formData.bankName || undefined,
        accountTitle: formData.accountTitle || undefined,
        accountNumber: formData.accountNumber || undefined,
        iban: formData.iban || undefined,
        previousInvestments: formData.previousInvestments || undefined,
        notes: formData.notes,
        agentId: user.id,
        status: 'active',
        totalInvested: editingInvestor?.totalInvested || 0,
        activeInvestments: editingInvestor?.activeInvestments || 0,
        returns: editingInvestor?.returns || 0,
        createdAt: editingInvestor?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode) {
        updateInvestor(editingInvestor.id, investorData);
        toast.success('Investor updated successfully!');
      } else {
        addInvestor(investorData);
        toast.success('Investor added successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving investor:', error);
      toast.error('Failed to save investor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      title={isEditMode ? 'Edit Investor' : 'Add New Investor'}
      description="Manage investor information and investment preferences"
      onBack={onBack}
      onSubmit={handleSubmit}
      maxWidth="lg"
    >
      <FormContainer.Body>
        {/* Personal Information */}
        <FormSection
          title="Personal Information"
          description="Basic details of the investor"
        >
          <FormField
            label="Full Name"
            required
            error={touched.has('name') ? errors.name : undefined}
          >
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Enter full name"
            />
          </FormField>

          <FormField
            label="CNIC"
            required
            error={touched.has('cnic') ? errors.cnic : undefined}
            hint="Format: 12345-1234567-1"
          >
            <Input
              value={formData.cnic}
              onChange={(e) => handleChange('cnic', e.target.value)}
              onBlur={() => handleBlur('cnic')}
              placeholder="12345-1234567-1"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              required
              error={touched.has('phone') ? errors.phone : undefined}
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
              required
              error={touched.has('email') ? errors.email : undefined}
            >
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="investor@example.com"
              />
            </FormField>
          </div>

          <FormField
            label="Address"
            required
            error={touched.has('address') ? errors.address : undefined}
          >
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Complete address"
            />
          </FormField>
        </FormSection>

        <FormSectionDivider />

        {/* Investment Profile */}
        <FormSection
          title="Investment Profile"
          description="Investor classification and preferences"
        >
          <FormField
            label="Investor Type"
            required
            error={touched.has('investorType') ? errors.investorType : undefined}
          >
            <Select
              value={formData.investorType}
              onValueChange={(value) => handleChange('investorType', value)}
            >
              <SelectTrigger onBlur={() => handleBlur('investorType')}>
                <SelectValue placeholder="Select investor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="institutional">Institutional</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {(formData.investorType === 'corporate' ||
            formData.investorType === 'institutional') && (
            <FormField
              label="Company Name"
              required
              error={touched.has('companyName') ? errors.companyName : undefined}
            >
              <Input
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                onBlur={() => handleBlur('companyName')}
                placeholder="Company name"
              />
            </FormField>
          )}

          <FormField
            label="Total Investment Capacity (PKR)"
            required
            error={touched.has('investmentCapacity') ? errors.investmentCapacity : undefined}
            hint="Total amount available for investment"
          >
            <Input
              type="number"
              value={formData.investmentCapacity}
              onChange={(e) => handleChange('investmentCapacity', e.target.value)}
              onBlur={() => handleBlur('investmentCapacity')}
              placeholder="50000000"
              min="0"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Investment Horizon"
              required
              error={touched.has('investmentHorizon') ? errors.investmentHorizon : undefined}
            >
              <Select
                value={formData.investmentHorizon}
                onValueChange={(value) => handleChange('investmentHorizon', value)}
              >
                <SelectTrigger onBlur={() => handleBlur('investmentHorizon')}>
                  <SelectValue placeholder="Select horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short-term (1-2 years)</SelectItem>
                  <SelectItem value="medium-term">Medium-term (3-5 years)</SelectItem>
                  <SelectItem value="long-term">Long-term (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Risk Profile"
              required
              error={touched.has('riskProfile') ? errors.riskProfile : undefined}
            >
              <Select
                value={formData.riskProfile}
                onValueChange={(value) => handleChange('riskProfile', value)}
              >
                <SelectTrigger onBlur={() => handleBlur('riskProfile')}>
                  <SelectValue placeholder="Select risk profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSectionDivider />

        {/* Investment Preferences */}
        <FormSection title="Investment Preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Minimum Investment Amount (PKR)"
              required
              error={touched.has('minInvestmentAmount') ? errors.minInvestmentAmount : undefined}
            >
              <Input
                type="number"
                value={formData.minInvestmentAmount}
                onChange={(e) => handleChange('minInvestmentAmount', e.target.value)}
                onBlur={() => handleBlur('minInvestmentAmount')}
                placeholder="5000000"
                min="0"
              />
            </FormField>

            <FormField
              label="Maximum Investment Amount (PKR)"
              error={touched.has('maxInvestmentAmount') ? errors.maxInvestmentAmount : undefined}
              hint="Optional"
            >
              <Input
                type="number"
                value={formData.maxInvestmentAmount}
                onChange={(e) => handleChange('maxInvestmentAmount', e.target.value)}
                onBlur={() => handleBlur('maxInvestmentAmount')}
                placeholder="20000000"
                min="0"
              />
            </FormField>
          </div>

          <div>
            <Label className="mb-3 block">
              Preferred Property Types
              <span className="text-sm text-gray-500 ml-2">
                ({formData.preferredPropertyTypes.length} selected)
              </span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.preferredPropertyTypes.includes(type)}
                    onCheckedChange={() =>
                      toggleArrayField('preferredPropertyTypes', type)
                    }
                  />
                  <Label htmlFor={type} className="cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">
              Preferred Locations
              <span className="text-sm text-gray-500 ml-2">
                ({formData.preferredLocations.length} selected)
              </span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {KARACHI_AREAS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.preferredLocations.includes(area)}
                    onCheckedChange={() =>
                      toggleArrayField('preferredLocations', area)
                    }
                  />
                  <Label htmlFor={area} className="cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </FormSection>

        <FormSectionDivider />

        {/* Banking Information */}
        <FormSection
          title="Banking Information"
          description="Optional banking details for transactions"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Bank Name" hint="Optional">
              <Select
                value={formData.bankName}
                onValueChange={(value) => handleChange('bankName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {PAKISTANI_BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Account Title" hint="Optional">
              <Input
                value={formData.accountTitle}
                onChange={(e) => handleChange('accountTitle', e.target.value)}
                placeholder="Account holder name"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Account Number" hint="Optional">
              <Input
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="0123456789"
              />
            </FormField>

            <FormField label="IBAN" hint="Optional - Format: PK36SCBL0000001123456702">
              <Input
                value={formData.iban}
                onChange={(e) => handleChange('iban', e.target.value)}
                placeholder="PK36SCBL0000001123456702"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSectionDivider />

        {/* Additional Information */}
        <FormSection title="Additional Information">
          <FormField
            label="Previous Investments"
            hint="Brief description of past investment experience"
          >
            <Textarea
              value={formData.previousInvestments}
              onChange={(e) => handleChange('previousInvestments', e.target.value)}
              placeholder="Describe any previous real estate investments..."
              rows={3}
            />
          </FormField>

          <FormField
            label="Notes"
            error={touched.has('notes') ? errors.notes : undefined}
            hint={`${formData.notes.length}/1000 characters`}
          >
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Any additional notes about this investor..."
              rows={4}
              maxLength={1000}
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
              {isEditMode ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              {isEditMode ? 'Update Investor' : 'Add Investor'}
            </>
          )}
        </Button>
      </FormContainer.Footer>
    </FormContainer>
  );
}
