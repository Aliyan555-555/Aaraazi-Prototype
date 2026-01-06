# Cycle Forms Quick Guide

**How to use the new full-page cycle forms**

---

## Overview

All cycle forms are now full-page forms (not modals) that follow the same pattern as the Property Form.

---

## Starting Cycles from Property Details

### Sell Cycle

**Button:** "Start Sell Cycle" in PropertyDetailsV4 actions  
**Route:** `add-sell-cycle`  
**Component:** `SellCycleFormV2`

**Steps:**
1. **Seller** - Select who is selling (contact search + quick add)
2. **Pricing** - Set asking price and minimum acceptable price
3. **Commission** - Configure commission type and rate
4. **Details** - Marketing plan, exclusivity, dates, notes

**Navigation:**
- Back button → Returns to property details
- Cancel → Returns to property details
- Submit → Creates cycle & returns to property details

---

### Purchase Cycle

**Button:** "Start Purchase Cycle" in PropertyDetailsV4 actions  
**Route:** `add-purchase-cycle`  
**Component:** `PurchaseCycleFormV2`

**Steps:**
1. **Type Selection** - Choose purchaser type:
   - Agency Purchase (your agency buying)
   - Investor Purchase (investors buying through you)
   - Client Purchase (helping client buy)
2. **Type-Specific Form** - Complete form based on type

**Navigation:**
- Back button (type selection) → Returns to property details
- Back button (form) → Returns to type selection
- Cancel → Returns to property details
- Submit → Creates cycle & returns to property details

---

### Rent Cycle

**Button:** "Start Rent Cycle" in PropertyDetailsV4 actions  
**Route:** `add-rent-cycle`  
**Component:** `RentCycleFormV2`

**Steps:**
1. **Landlord** - Select property owner (contact search + quick add)
2. **Rent Details** - Monthly rent, deposit, advance payments
3. **Lease Terms** - Duration, utilities, maintenance, commission
4. **Requirements** - Pet policy, furnishing, tenant requirements

**Navigation:**
- Back button → Returns to property details
- Cancel → Returns to property details
- Submit → Creates cycle & returns to property details

---

## Development Reference

### Adding Cycle from Code

```tsx
// Store property ID
sessionStorage.setItem('cycle_property_id', propertyId);

// Navigate to form
setActiveTab('add-sell-cycle');    // For sell cycle
setActiveTab('add-purchase-cycle'); // For purchase cycle
setActiveTab('add-rent-cycle');    // For rent cycle
```

### Form Props

All cycle forms accept these props:

```tsx
interface CycleFormProps {
  property: Property;  // The property for this cycle
  user: User;         // Current user
  onBack: () => void; // Called when back/cancel
  onSuccess: () => void; // Called on successful submission
}
```

### Route Handlers (in App.tsx)

```tsx
case 'add-sell-cycle':
  const propertyId = sessionStorage.getItem('cycle_property_id');
  const property = getPropertyById(propertyId);
  
  return (
    <SellCycleFormV2
      property={property}
      user={user}
      onBack={() => {
        sessionStorage.removeItem('cycle_property_id');
        setSelectedProperty(property);
        setActiveTab('property-detail');
      }}
      onSuccess={() => {
        sessionStorage.removeItem('cycle_property_id');
        setSelectedProperty(property);
        setActiveTab('property-detail');
        toast.success('Sell cycle created successfully!');
      }}
    />
  );
```

---

## Design System Compliance

All forms use:
- ✅ `FormContainer` - Page wrapper with title and back button
- ✅ `MultiStepForm` - Step indicator and navigation
- ✅ `FormSection` - Grouped form fields with icon
- ✅ `FormField` - Individual field with label, error, hint
- ✅ Design System V4.1 components
- ✅ PKR currency formatting
- ✅ Validation per step
- ✅ Consistent styling and spacing

---

## Common Features

### Contact Selection
Both Sell and Rent forms include:
- Searchable contact dropdown
- Search by name or phone
- Quick add new contact
- Selected contact display

### PKR Formatting
All monetary fields show formatted PKR values:
```
Input: 5000000
Display: PKR 50,00,000
```

### Validation
- Required fields validated per step
- Can't proceed to next step with errors
- Error messages displayed under fields
- Toast notifications for validation errors

### Auto-Save State
Form state preserved during:
- Step navigation
- Contact quick add
- Field focus changes

---

## Keyboard Shortcuts

- **Tab** - Move to next field
- **Shift+Tab** - Move to previous field
- **Enter** - Submit current step / Complete form
- **Escape** - Cancel (if in modal sub-component)

---

## Mobile Responsive

All forms are fully responsive:
- Single column on mobile
- Two columns on desktop (where applicable)
- Touch-friendly buttons and inputs
- Scrollable step content

---

## Accessibility

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Error announcements
- ✅ Visible focus indicators

---

## Error Handling

### Validation Errors
- Shown inline under field
- Prevents step progression
- Toast notification on submit attempt
- Clear error on field change

### Submission Errors
- Toast notification
- Form remains open
- User can retry
- Error logged to console

### Navigation Errors
- Missing property → Redirect to properties
- Invalid state → Reset to safe state
- Console warnings for debugging

---

## Examples

### Starting Sell Cycle

```tsx
// From PropertyDetailsV4
<Button onClick={() => {
  sessionStorage.setItem('cycle_property_id', property.id);
  setActiveTab('add-sell-cycle');
}}>
  Start Sell Cycle
</Button>
```

### Direct Navigation

```tsx
// Navigate directly to form
const startSellCycle = (propertyId: string) => {
  sessionStorage.setItem('cycle_property_id', propertyId);
  setActiveTab('add-sell-cycle');
};
```

---

## Tips

1. **Always clear sessionStorage** after use
2. **Use formatPropertyAddress** for consistent property display
3. **Show success toast** on completion
4. **Return to property details** after creation
5. **Handle missing property gracefully**

---

## Support

For issues or questions:
- Check console for errors
- Verify property exists
- Ensure user has permissions
- Check form validation rules
- Review sessionStorage state

---

**Last Updated:** December 30, 2024
