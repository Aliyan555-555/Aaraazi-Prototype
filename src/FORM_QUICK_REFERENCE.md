# Form Design - Quick Reference Guide

**Use this guide for quick copy-paste form implementation.**

---

## 🚀 QUICK START

### **1. Simple Form Template**

```tsx
import { FormContainer } from '@/components/ui/form-container';
import { FormSection, FormSectionDivider } from '@/components/ui/form-section';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { required, email, validateForm, hasErrors } from '@/lib/formValidation';
import { useState } from 'react';
import { toast } from 'sonner';

export function MyForm({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = {...prev}; delete e[field]; return e; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      name: (v) => required(v, 'Name'),
      email: (v) => email(v),
    });

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Please fix the errors');
      return;
    }

    setIsSubmitting(true);
    try {
      // Your API call here
      toast.success('Saved!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      title="My Form"
      description="Form description"
      onBack={onBack}
      onSubmit={handleSubmit}
    >
      <FormContainer.Body>
        <FormSection title="Section 1">
          <FormField label="Name" required error={errors.name}>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </FormField>
        </FormSection>
      </FormContainer.Body>

      <FormContainer.Footer>
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </FormContainer.Footer>
    </FormContainer>
  );
}
```

---

## 📋 COMMON PATTERNS

### **Text Input**
```tsx
<FormField label="Title" required error={errors.title}>
  <Input
    value={formData.title}
    onChange={(e) => handleChange('title', e.target.value)}
    placeholder="Enter title"
  />
</FormField>
```

### **Number Input**
```tsx
<FormField label="Price" required error={errors.price}>
  <Input
    type="number"
    value={formData.price}
    onChange={(e) => handleChange('price', e.target.value)}
    placeholder="5000000"
    min="0"
  />
</FormField>
```

### **Select Dropdown**
```tsx
<FormField label="Type" required error={errors.type}>
  <Select
    value={formData.type}
    onValueChange={(value) => handleChange('type', value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</FormField>
```

### **Textarea**
```tsx
<FormField label="Description" error={errors.description}>
  <Textarea
    value={formData.description}
    onChange={(e) => handleChange('description', e.target.value)}
    placeholder="Enter description..."
    rows={4}
  />
</FormField>
```

### **Checkbox**
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="agree"
    checked={formData.agree}
    onCheckedChange={(checked) => handleChange('agree', checked)}
  />
  <Label htmlFor="agree">I agree to terms</Label>
</div>
```

### **2-Column Layout**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField label="First Name">
    <Input {...} />
  </FormField>
  <FormField label="Last Name">
    <Input {...} />
  </FormField>
</div>
```

---

## ✅ VALIDATION CHEAT SHEET

### **Import**
```tsx
import {
  required,
  email,
  pakistanPhone,
  positiveNumber,
  minLength,
  maxLength,
  validateForm,
  hasErrors,
} from '@/lib/formValidation';
```

### **Common Validators**
```tsx
// Required
required(value, 'Field name')

// Email
email(value)

// Pakistani Phone
pakistanPhone(value)

// Positive Number
positiveNumber(value, 'Field name')

// Length
minLength(value, 3, 'Field name')
maxLength(value, 100, 'Field name')

// PKR Amount
pkrAmount(value, 'Price')

// Property Area
propertyArea(value, 'sq yd')
```

### **Validate Form**
```tsx
const errors = validateForm(formData, {
  name: (v) => required(v, 'Name'),
  email: (v) => email(v),
  phone: (v) => required(v, 'Phone') || pakistanPhone(v),
  price: (v) => positiveNumber(v, 'Price'),
});

if (hasErrors(errors)) {
  setErrors(errors);
  return;
}
```

---

## 🎨 SPACING GUIDE

```tsx
// Between fields
<div className="space-y-4">
  <FormField>...</FormField>
  <FormField>...</FormField>
</div>

// Between sections
<div className="space-y-6">
  <FormSection>...</FormSection>
  <FormSection>...</FormSection>
</div>

// 2-column gap
<div className="grid grid-cols-2 gap-4">
  <FormField>...</FormField>
  <FormField>...</FormField>
</div>
```

---

## 🚨 ERROR HANDLING

### **Set Errors**
```tsx
setErrors({ fieldName: 'Error message' });
```

### **Clear Error on Change**
```tsx
const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};
```

### **Show Error in Field**
```tsx
<FormField label="Name" error={errors.name}>
  <Input ... />
</FormField>
```

---

## 💾 LOADING STATES

### **Submitting State**
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Saving...
    </>
  ) : (
    'Save'
  )}
</Button>
```

---

## 📱 RESPONSIVE COLUMNS

```tsx
// Stack on mobile, 2 cols on tablet+
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Stack on mobile, 2 cols on tablet, 3 cols on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🎯 FORM CHECKLIST

**Before Submitting Form for Review:**
- [ ] Uses FormContainer
- [ ] Has FormField for all inputs
- [ ] Required fields marked with *
- [ ] All fields validated
- [ ] Clear error messages
- [ ] Loading state on submit
- [ ] Success/error toast messages
- [ ] Cancel button works
- [ ] Mobile responsive
- [ ] Keyboard navigation works

---

**For full documentation, see `/FORM_DESIGN_STANDARDS.md`**
