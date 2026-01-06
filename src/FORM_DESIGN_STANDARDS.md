# Form Design Standards - PHASE 3

**Version:** 1.0  
**Date:** December 27, 2024  
**Status:** ✅ Active Standard  

---

## 📋 OVERVIEW

This document establishes comprehensive form design standards for the aaraazi platform, ensuring consistency, usability, and accessibility across all forms.

---

## 🎯 DESIGN PRINCIPLES

### **1. Progressive Disclosure**
- Show only relevant fields based on context
- Use multi-step forms for complex data collection
- Group related fields logically

### **2. Clear Feedback**
- Inline validation with immediate feedback
- Success states after completion
- Error messages with actionable guidance

### **3. Efficiency**
- Auto-fill where possible
- Smart defaults based on context
- Keyboard shortcuts for power users

### **4. Accessibility**
- WCAG 2.1 AA compliance
- Clear labels and instructions
- Keyboard navigation support
- Screen reader friendly

### **5. Mobile-First**
- Responsive layouts
- Touch-friendly inputs
- Appropriate input types for mobile keyboards

---

## 🏗️ FORM ARCHITECTURE

### **Standard Form Structure:**

```tsx
<FormContainer>
  <FormHeader>
    <Title />
    <Description />
    <ProgressIndicator /> {/* Multi-step forms only */}
  </FormHeader>
  
  <FormBody>
    <FormSection>
      <SectionTitle />
      <FieldGroup>
        <FormField />
        <FormField />
      </FieldGroup>
    </FormSection>
  </FormBody>
  
  <FormFooter>
    <SecondaryAction />
    <PrimaryAction />
  </FormFooter>
</FormContainer>
```

---

## 📐 LAYOUT STANDARDS

### **1. Single Column Layout (Recommended)**
- **Width:** Max 640px (focus on readability)
- **Spacing:** 24px between sections, 16px between fields
- **Labels:** Always above inputs (not side-by-side)
- **Use for:** Most forms (90% of cases)

### **2. Two Column Layout**
- **Use for:** Short related fields only (e.g., First Name / Last Name)
- **Grid:** Equal columns with 16px gap
- **Breakpoint:** Stack on mobile (<768px)
- **Limit:** Max 2 fields per row

### **3. Multi-Step Forms**
- **Steps:** Max 5-7 steps (Miller's Law)
- **Progress:** Visual progress indicator at top
- **Navigation:** Back/Next buttons, never "Step 3 of 7" text only
- **Save:** Auto-save or "Save Draft" option

---

## 🎨 COMPONENT STANDARDS

### **Form Fields**

#### **Input Field:**
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id" className="flex items-center gap-2">
    Field Label
    {required && <span className="text-red-500">*</span>}
    {tooltip && <InfoTooltip content={tooltip} />}
  </Label>
  <Input
    id="field-id"
    type="text"
    value={value}
    onChange={handleChange}
    placeholder="Placeholder text"
    className={error ? 'border-red-500' : ''}
    aria-invalid={!!error}
    aria-describedby={error ? 'field-id-error' : undefined}
  />
  {error && (
    <p id="field-id-error" className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {error}
    </p>
  )}
  {hint && !error && (
    <p className="text-sm text-gray-500">{hint}</p>
  )}
</div>
```

**Rules:**
- ✅ Always use `<Label>` with `htmlFor`
- ✅ Required fields marked with red asterisk
- ✅ Errors shown below field with icon
- ✅ Hints shown below field when no error
- ✅ ARIA attributes for accessibility
- ✅ Red border on error state

---

### **Select Dropdown:**
```tsx
<div className="space-y-2">
  <Label htmlFor="select-id">Select Label *</Label>
  <Select value={value} onValueChange={handleChange}>
    <SelectTrigger id="select-id">
      <SelectValue placeholder="Choose an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
  {error && <p className="text-sm text-red-600">{error}</p>}
</div>
```

**Rules:**
- ✅ Always include placeholder
- ✅ Sort options alphabetically (unless order matters)
- ✅ Use "Choose...", "Select..." for placeholders
- ✅ Disabled state for unavailable options

---

### **Textarea:**
```tsx
<div className="space-y-2">
  <Label htmlFor="textarea-id" className="flex items-center justify-between">
    <span>Description</span>
    <span className="text-sm text-gray-500">
      {value.length}/{maxLength}
    </span>
  </Label>
  <Textarea
    id="textarea-id"
    value={value}
    onChange={handleChange}
    placeholder="Enter description..."
    rows={4}
    maxLength={maxLength}
  />
</div>
```

**Rules:**
- ✅ Show character count for limited fields
- ✅ Min 4 rows, max 12 rows
- ✅ Auto-resize if needed
- ✅ Clear placeholder text

---

### **Checkbox:**
```tsx
<div className="flex items-start space-x-3">
  <Checkbox
    id="checkbox-id"
    checked={checked}
    onCheckedChange={handleChange}
  />
  <div className="space-y-1">
    <Label
      htmlFor="checkbox-id"
      className="text-sm cursor-pointer"
    >
      Checkbox Label
    </Label>
    {description && (
      <p className="text-sm text-gray-500">{description}</p>
    )}
  </div>
</div>
```

**Rules:**
- ✅ Label on right side
- ✅ Clickable label area
- ✅ Optional description below
- ✅ Group related checkboxes

---

### **Radio Group:**
```tsx
<div className="space-y-2">
  <Label>Choose One *</Label>
  <RadioGroup value={value} onValueChange={handleChange}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="r1" />
      <Label htmlFor="r1" className="cursor-pointer">Option 1</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="r2" />
      <Label htmlFor="r2" className="cursor-pointer">Option 2</Label>
    </div>
  </RadioGroup>
</div>
```

**Rules:**
- ✅ Always have one option selected by default
- ✅ Max 5 options (use Select for more)
- ✅ Vertical layout preferred
- ✅ Clickable labels

---

### **Switch (Toggle):**
```tsx
<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label htmlFor="switch-id">Feature Name</Label>
    <p className="text-sm text-gray-500">Description of what this toggles</p>
  </div>
  <Switch
    id="switch-id"
    checked={checked}
    onCheckedChange={handleChange}
  />
</div>
```

**Rules:**
- ✅ Use for on/off states only
- ✅ Always show current state clearly
- ✅ Label describes what is toggled
- ✅ Provide description of impact

---

### **Date Picker:**
```tsx
<div className="space-y-2">
  <Label htmlFor="date-id">Date *</Label>
  <Input
    id="date-id"
    type="date"
    value={value}
    onChange={handleChange}
    min={minDate}
    max={maxDate}
  />
</div>
```

**Rules:**
- ✅ Use native date picker for simplicity
- ✅ Set min/max constraints when applicable
- ✅ Format: YYYY-MM-DD (ISO standard)
- ✅ Show formatted date in display mode

---

### **File Upload:**
```tsx
<div className="space-y-2">
  <Label>Upload Documents</Label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
    <input
      type="file"
      id="file-upload"
      className="hidden"
      onChange={handleFileChange}
      accept=".pdf,.doc,.docx,.jpg,.png"
      multiple
    />
    <Label htmlFor="file-upload" className="cursor-pointer">
      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">
        PDF, DOC, DOCX, JPG, PNG (max 10MB)
      </p>
    </Label>
  </div>
  {files.length > 0 && (
    <div className="space-y-2">
      {files.map((file, idx) => (
        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">{file.name}</span>
          <Button variant="ghost" size="sm" onClick={() => removeFile(idx)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )}
</div>
```

**Rules:**
- ✅ Drag & drop support
- ✅ Show accepted file types
- ✅ Show file size limit
- ✅ Preview uploaded files
- ✅ Allow file removal

---

## 🎨 VALIDATION STANDARDS

### **Client-Side Validation**

**Trigger Points:**
1. **On Blur** - Validate when user leaves field (preferred)
2. **On Submit** - Validate all fields before submission
3. **Real-time** - For specific cases (password strength, availability)

**Validation Rules:**

```tsx
const validate = (formData: FormData): Errors => {
  const errors: Errors = {};
  
  // Required field
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  // Length validation
  if (formData.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  
  // Email format
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone format (Pakistan)
  if (formData.phone && !isValidPakistanPhone(formData.phone)) {
    errors.phone = 'Please enter a valid Pakistani phone number';
  }
  
  // Number validation
  if (formData.price && isNaN(Number(formData.price))) {
    errors.price = 'Please enter a valid number';
  }
  
  // Custom business rule
  if (formData.minPrice > formData.maxPrice) {
    errors.maxPrice = 'Maximum price must be greater than minimum price';
  }
  
  return errors;
};
```

**Error Message Guidelines:**
- ✅ Clear and actionable
- ✅ Specific to the error
- ✅ Polite tone (avoid "Invalid" or "Wrong")
- ✅ Suggest correction when possible

**Good Examples:**
- ✅ "Please enter your email address"
- ✅ "Phone number should be 11 digits starting with 03"
- ✅ "Price must be a positive number"

**Bad Examples:**
- ❌ "Invalid input"
- ❌ "Error"
- ❌ "Field required"

---

## 🎯 FORM STATES

### **1. Default State**
```tsx
<Input
  placeholder="Enter property title"
  className="border-gray-200"
/>
```

### **2. Focus State**
```tsx
<Input
  className="border-blue-500 ring-2 ring-blue-200"
/>
```

### **3. Error State**
```tsx
<Input
  className="border-red-500 focus:ring-red-200"
  aria-invalid="true"
/>
<p className="text-sm text-red-600 flex items-center gap-1">
  <AlertCircle className="h-3 w-3" />
  Error message here
</p>
```

### **4. Success State**
```tsx
<Input
  className="border-green-500"
  aria-invalid="false"
/>
<p className="text-sm text-green-600 flex items-center gap-1">
  <CheckCircle className="h-3 w-3" />
  Looks good!
</p>
```

### **5. Disabled State**
```tsx
<Input
  disabled
  className="bg-gray-100 cursor-not-allowed opacity-60"
/>
```

### **6. Loading State**
```tsx
<Input
  disabled
  className="bg-gray-50"
/>
<div className="flex items-center gap-2 text-sm text-gray-500">
  <Loader2 className="h-3 w-3 animate-spin" />
  <span>Validating...</span>
</div>
```

---

## 🎨 FORM ACTIONS (BUTTONS)

### **Button Placement**

**Desktop:**
```
[Cancel]                    [Save Draft]  [Submit]
```

**Mobile:**
```
[Submit (Full Width)]
[Save Draft (Full Width)]
[Cancel (Full Width)]
```

### **Button Hierarchy:**

**Primary Action:**
```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      Saving...
    </>
  ) : (
    'Save Property'
  )}
</Button>
```

**Secondary Action:**
```tsx
<Button variant="outline" onClick={onCancel}>
  Cancel
</Button>
```

**Tertiary Action:**
```tsx
<Button variant="ghost" onClick={onSaveDraft}>
  Save Draft
</Button>
```

**Rules:**
- ✅ Max 3 actions in footer (Hick's Law)
- ✅ Primary button on right (Western reading pattern)
- ✅ Destructive actions require confirmation
- ✅ Loading state shows progress
- ✅ Disabled state prevents double-submit

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints:**

```css
/* Mobile First */
.form-container {
  padding: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .form-container {
    padding: 24px;
    max-width: 640px;
    margin: 0 auto;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .form-container {
    padding: 32px;
  }
}
```

### **Mobile Considerations:**
- ✅ Full-width inputs for easy tapping
- ✅ Larger touch targets (min 44x44px)
- ✅ Appropriate `inputMode` and `type` attributes
- ✅ Stack all multi-column layouts
- ✅ Fixed action buttons at bottom

---

## ♿ ACCESSIBILITY STANDARDS

### **Required Practices:**

1. **Labels:**
   ```tsx
   <Label htmlFor="input-id">Label Text *</Label>
   <Input id="input-id" aria-required="true" />
   ```

2. **Error Association:**
   ```tsx
   <Input
     aria-invalid={hasError}
     aria-describedby={hasError ? 'error-id' : undefined}
   />
   {hasError && <p id="error-id">{error}</p>}
   ```

3. **Field Groups:**
   ```tsx
   <fieldset>
     <legend>Personal Information</legend>
     {/* Form fields */}
   </fieldset>
   ```

4. **Live Regions:**
   ```tsx
   <div role="status" aria-live="polite">
     Form submitted successfully
   </div>
   ```

5. **Keyboard Navigation:**
   - Tab: Move to next field
   - Shift+Tab: Move to previous field
   - Enter: Submit form (when in text input)
   - Escape: Cancel/close modal forms

---

## 🎨 MULTI-STEP FORMS

### **Progress Indicator:**

```tsx
<div className="mb-8">
  <div className="flex justify-between mb-2">
    {steps.map((step, index) => (
      <div key={index} className="flex-1">
        <div className={`h-2 rounded ${
          index < currentStep ? 'bg-blue-600' :
          index === currentStep ? 'bg-blue-400' :
          'bg-gray-200'
        }`} />
      </div>
    ))}
  </div>
  <p className="text-sm text-gray-600">
    Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
  </p>
</div>
```

### **Step Navigation:**

```tsx
<div className="flex justify-between">
  <Button
    variant="outline"
    onClick={handleBack}
    disabled={currentStep === 0}
  >
    <ChevronLeft className="h-4 w-4 mr-1" />
    Back
  </Button>
  
  {currentStep < steps.length - 1 ? (
    <Button onClick={handleNext}>
      Next
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  ) : (
    <Button type="submit">
      Submit
    </Button>
  )}
</div>
```

**Rules:**
- ✅ Visual progress bar at top
- ✅ Step title shown clearly
- ✅ Back button on all steps except first
- ✅ Next button until last step
- ✅ Submit button only on last step
- ✅ Validate each step before proceeding
- ✅ Allow direct navigation to completed steps

---

## 💾 AUTO-SAVE & DRAFTS

### **Auto-Save Implementation:**

```tsx
// Debounce auto-save
useEffect(() => {
  const timer = setTimeout(() => {
    if (hasChanges && isValid) {
      saveDraft(formData);
    }
  }, 2000); // Save 2 seconds after last change
  
  return () => clearTimeout(timer);
}, [formData]);
```

### **Save Indicators:**

```tsx
{saveStatus === 'saving' && (
  <span className="text-sm text-gray-500 flex items-center gap-1">
    <Loader2 className="h-3 w-3 animate-spin" />
    Saving...
  </span>
)}

{saveStatus === 'saved' && (
  <span className="text-sm text-green-600 flex items-center gap-1">
    <Check className="h-3 w-3" />
    Saved
  </span>
)}
```

**Rules:**
- ✅ Auto-save after 2-3 seconds of inactivity
- ✅ Show save status indicator
- ✅ "Save Draft" button as backup
- ✅ Restore draft on return
- ✅ Clear draft after successful submit

---

## 🎯 FORM PATTERNS

### **1. Simple Form (Single Step)**
- Use for: < 10 fields, quick actions
- Layout: Single column
- Example: Add Contact, Quick Note

### **2. Modal Form**
- Use for: Quick edits, secondary actions
- Max fields: 5-7
- Size: Medium (max 600px wide)
- Example: Edit Price, Change Status

### **3. Multi-Step Form**
- Use for: Complex data, > 15 fields
- Steps: 3-5 logical sections
- Progress: Visual indicator
- Example: Add Property, Create Project

### **4. Wizard Form**
- Use for: Sequential process
- Steps: Must be completed in order
- Branching: Different paths based on choices
- Example: Purchase Workflow, Deal Creation

### **5. Inline Edit Form**
- Use for: Quick field updates
- Display: Show save/cancel on focus
- Reset: Cancel restores original
- Example: Property price, Description

---

## 📋 FORM CHECKLIST

Before implementing any form, verify:

**Structure:**
- [ ] Logical field grouping
- [ ] Clear section titles
- [ ] Proper label associations
- [ ] Required fields marked

**Validation:**
- [ ] Client-side validation on blur
- [ ] Clear error messages
- [ ] Error summary at top (if multiple)
- [ ] Prevent submit if invalid

**Accessibility:**
- [ ] All labels have `htmlFor`
- [ ] ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Error messages announced
- [ ] Focus management correct

**UX:**
- [ ] Auto-focus first field
- [ ] Tab order logical
- [ ] Enter submits form
- [ ] Escape cancels/closes
- [ ] Loading states shown
- [ ] Success feedback provided

**Mobile:**
- [ ] Touch targets ≥ 44px
- [ ] Inputs stack vertically
- [ ] Buttons full-width
- [ ] Appropriate input types
- [ ] Zoom not disabled

**Performance:**
- [ ] Debounced validation
- [ ] Auto-save if needed
- [ ] No blocking operations
- [ ] Fast feedback

---

## 🎨 DESIGN TOKENS

### **Spacing:**
```css
--form-spacing-field: 16px;      /* Between fields */
--form-spacing-section: 24px;    /* Between sections */
--form-spacing-group: 8px;       /* Within field groups */
```

### **Colors:**
```css
--form-error: #d4183d;           /* Error text/border */
--form-success: #10b981;         /* Success state */
--form-border: #e5e7eb;          /* Default border */
--form-border-focus: #3b82f6;    /* Focus border */
--form-bg-disabled: #f3f4f6;     /* Disabled background */
```

### **Typography:**
```css
--form-label-size: 14px;         /* Label text */
--form-input-size: 14px;         /* Input text */
--form-hint-size: 12px;          /* Hint/error text */
--form-label-weight: 500;        /* Label weight */
```

---

## 📚 EXAMPLES

See `/components/examples/` for complete implementations:
- `SimpleForm.tsx` - Basic single-step form
- `ModalForm.tsx` - Modal-based form
- `MultiStepForm.tsx` - Multi-step wizard
- `InlineEditForm.tsx` - Inline editing pattern

---

## 🚀 NEXT STEPS

1. ✅ Review this standard
2. ⏳ Create reusable form components
3. ⏳ Update existing forms to match
4. ⏳ Create Storybook stories
5. ⏳ Write unit tests

---

**Last Updated:** December 27, 2024  
**Version:** 1.0  
**Status:** ✅ **ACTIVE STANDARD**  

**This standard must be followed for all forms in the aaraazi platform.**
