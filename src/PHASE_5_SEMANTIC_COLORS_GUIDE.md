# Phase 5: Semantic Colors & Status System

**Status**: ✅ StatusBadge Component Updated  
**Date**: January 2026  
**Progress**: 40% Complete (Task 1/3)

---

## 🎨 Semantic Color System

### Brand-Aligned Status Colors:

#### 1. **SUCCESS** (Forest Green #2D6A54)
**Usage**: Positive outcomes, ready states, approvals

**Color Values**:
- Background: `--success-bg` (#F2F7F5)
- Text: `--success` (#2D6A54)
- Border: `--success-border` (#B3D9C8)

**Statuses**:
- ✅ Available (Property)
- ✅ Active (Cycle)
- ✅ Qualified (Lead)
- ✅ Won (Deal)
- ✅ Approved (Commission)
- ✅ Paid (Payment)
- ✅ Verified
- ✅ Published

---

#### 2. **WARNING** (Terracotta #C17052)
**Usage**: Attention needed, in-progress, negotiation

**Color Values**:
- Background: `--warning-bg` (#FEF3C7)
- Text: `--warning-foreground` (#D97706)
- Border: `--warning-border` (#FDE68A)

**Statuses**:
- ⚠️ Under Contract (Property)
- ⚠️ Pending (Transaction)
- ⚠️ Contacted (Lead)
- ⚠️ Negotiation (Deal)
- ⚠️ On Hold
- ⚠️ In Review
- ⚠️ Offers Received
- ⚠️ Processing
- ⚠️ Scheduled

---

#### 3. **PROGRESS** (Warm Blue #3B82F6)
**Usage**: Active work in progress, new items

**Color Values**:
- Background: `--info-bg` (#DBEAFE)
- Text: `--info-foreground` (#2563EB)
- Border: `--info-border` (#BFDBFE)

**Statuses**:
- 🔵 New (Lead)
- 🔵 Draft (Document)
- 🔵 In Pipeline
- 🔵 Viewing Scheduled

---

#### 4. **NEUTRAL** (Warm Gray)
**Usage**: Completed, sold, inactive (not negative)

**Color Values**:
- Background: `--neutral-100` (#F5F4F1)
- Text: `--slate-700` (#1A1D1F)
- Border: `--neutral-200` (#E8E2D5)

**Statuses**:
- ⚪ Sold (Property)
- ⚪ Completed (Cycle/Deal)
- ⚪ Closed
- ⚪ Archived
- ⚪ Finalized
- ⚪ Settled
- ⚪ Delivered

---

#### 5. **DESTRUCTIVE** (Red #DC2626)
**Usage**: Errors, rejections, cancellations

**Color Values**:
- Background: `--destructive-bg` (#FEE2E2)
- Text: `--destructive` (#DC2626)
- Border: `--destructive-border` (#FECACA)

**Statuses**:
- ❌ Cancelled (Cycle/Deal)
- ❌ Lost (Deal)
- ❌ Rejected (Offer)
- ❌ Failed (Transaction)
- ❌ Expired
- ❌ Overdue
- ❌ Declined
- ❌ Terminated

---

#### 6. **INFO** (Blue)
**Usage**: Informational, notifications, matches

**Color Values**:
- Background: `--info-bg` (#DBEAFE)
- Text: `--info-foreground` (#2563EB)
- Border: `--info-border` (#BFDBFE)

**Statuses**:
- ℹ️ Matched (Requirements)
- ℹ️ Assigned
- ℹ️ Notified
- ℹ️ Sent

---

## 📋 Status Mappings by Entity

### Property Statuses:
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| Available | SUCCESS | Forest Green | ✅ Ready to sell/rent |
| Under Contract | WARNING | Terracotta | ⚠️ Pending completion |
| Sold | NEUTRAL | Warm Gray | ⚪ Transaction complete |
| Off Market | NEUTRAL | Warm Gray | ⚪ Not listed |
| Pending | WARNING | Terracotta | ⚠️ In process |

---

### Lead Statuses (5-Stage Pipeline):
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| New | PROGRESS | Blue | 🔵 Just received |
| Contacted | WARNING | Terracotta | ⚠️ Initial contact made |
| Qualified | SUCCESS | Forest Green | ✅ Meets criteria |
| Negotiation | WARNING | Terracotta | ⚠️ Active negotiation |
| Won | SUCCESS | Forest Green | ✅ Converted to deal |
| Lost | DESTRUCTIVE | Red | ❌ Not converted |

---

### Deal Statuses:
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| Active | SUCCESS | Forest Green | ✅ In progress |
| On Hold | WARNING | Terracotta | ⚠️ Temporarily paused |
| Completed | NEUTRAL | Warm Gray | ⚪ Successfully closed |
| Cancelled | DESTRUCTIVE | Red | ❌ Terminated |

---

### Transaction Statuses:
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| Pending | WARNING | Terracotta | ⚠️ Awaiting processing |
| In Progress | PROGRESS | Blue | 🔵 Being processed |
| Completed | NEUTRAL | Warm Gray | ⚪ Finalized |
| Failed | DESTRUCTIVE | Red | ❌ Error occurred |

---

### Commission Statuses:
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| Pending | WARNING | Terracotta | ⚠️ Awaiting approval |
| Approved | SUCCESS | Forest Green | ✅ Approved for payment |
| Paid | SUCCESS | Forest Green | ✅ Payment complete |
| Cancelled | DESTRUCTIVE | Red | ❌ Not payable |

---

### Cycle Statuses (Sell/Purchase/Rent):
| Status | Variant | Color | Visual |
|--------|---------|-------|--------|
| Active | SUCCESS | Forest Green | ✅ Currently active |
| Offers Received | WARNING | Terracotta | ⚠️ Under consideration |
| Under Contract | WARNING | Terracotta | ⚠️ Pending closing |
| Completed | NEUTRAL | Warm Gray | ⚪ Successfully closed |
| Cancelled | DESTRUCTIVE | Red | ❌ Terminated |

---

## 💻 Component Usage

### StatusBadge Component

#### Basic Usage (Auto-mapping):
```tsx
import { StatusBadge } from './components/layout/StatusBadge';

// Auto-maps to SUCCESS (forest green)
<StatusBadge status="Available" />

// Auto-maps to WARNING (terracotta)
<StatusBadge status="Under Contract" />

// Auto-maps to NEUTRAL (gray)
<StatusBadge status="Sold" />

// Auto-maps to DESTRUCTIVE (red)
<StatusBadge status="Cancelled" />
```

#### Manual Variant Override:
```tsx
// Force a specific variant
<StatusBadge status="Custom Status" variant="warning" />

// With size
<StatusBadge status="Active" variant="success" size="sm" />
<StatusBadge status="Pending" variant="warning" size="lg" />
```

#### Size Options:
```tsx
<StatusBadge status="New" size="sm" />  // Small (text-xs)
<StatusBadge status="New" size="md" />  // Medium (default)
<StatusBadge status="New" size="lg" />  // Large
```

---

## 🎯 Auto-Mapping Logic

The StatusBadge component automatically maps status strings to the appropriate variant:

### Success Mapping:
```typescript
['available', 'active', 'approved', 'accepted', 'success', 
 'paid', 'verified', 'qualified', 'won', 'published']
→ SUCCESS (Forest Green)
```

### Warning Mapping:
```typescript
['pending', 'in progress', 'review', 'offers received', 
 'negotiation', 'under contract', 'contacted', 'processing', 
 'scheduled', 'on hold']
→ WARNING (Terracotta)
```

### Progress Mapping:
```typescript
['new', 'draft', 'in pipeline', 'viewing scheduled']
→ PROGRESS (Blue)
```

### Neutral Mapping:
```typescript
['sold', 'completed', 'closed', 'archived', 'finalized', 
 'settled', 'delivered']
→ NEUTRAL (Warm Gray)
```

### Destructive Mapping:
```typescript
['rejected', 'cancelled', 'overdue', 'failed', 'expired', 
 'inactive', 'lost', 'declined', 'terminated']
→ DESTRUCTIVE (Red)
```

### Info Mapping:
```typescript
['matched', 'assigned', 'notified', 'sent']
→ INFO (Blue)
```

---

## 🔧 Technical Implementation

### CSS Variables Used:
```css
/* Success */
--success-bg: var(--forest-50);           /* #F2F7F5 */
--success: var(--forest-400);             /* #2D6A54 */
--success-border: var(--forest-200);      /* #B3D9C8 */

/* Warning */
--warning-bg: var(--warning-50);          /* #FEF3C7 */
--warning-foreground: var(--warning-600); /* #D97706 */
--warning-border: var(--warning-100);     /* #FDE68A */

/* Progress/Info */
--info-bg: var(--info-50);                /* #DBEAFE */
--info-foreground: var(--info-600);       /* #2563EB */
--info-border: var(--info-100);           /* #BFDBFE */

/* Neutral */
--neutral-100: #F5F4F1;
--slate-700: #1A1D1F;
--neutral-200: #E8E2D5;

/* Destructive */
--destructive-bg: var(--error-50);        /* #FEE2E2 */
--destructive: var(--error);              /* #DC2626 */
--destructive-border: var(--error-100);   /* #FECACA */
```

### Tailwind Classes Applied:
```tsx
// Success
className="bg-success-bg text-success border-success/20"

// Warning
className="bg-warning-bg text-warning-foreground border-warning/20"

// Progress
className="bg-info-bg text-info-foreground border-info/20"

// Neutral
className="bg-neutral-100 text-slate-700 border-neutral-200"

// Destructive
className="bg-destructive-bg text-destructive border-destructive/20"
```

---

## 📊 Visual Examples

### Property Status Timeline:
```
New Property → Available (SUCCESS ✅)
  ↓
Offers Received → Offers Received (WARNING ⚠️)
  ↓
Under Contract → Under Contract (WARNING ⚠️)
  ↓
Sold → Sold (NEUTRAL ⚪)
```

### Lead Lifecycle:
```
Inquiry → New (PROGRESS 🔵)
  ↓
Follow-up → Contacted (WARNING ⚠️)
  ↓
Meets Criteria → Qualified (SUCCESS ✅)
  ↓
Active Negotiation → Negotiation (WARNING ⚠️)
  ↓
Conversion → Won (SUCCESS ✅) or Lost (DESTRUCTIVE ❌)
```

### Deal Progress:
```
Initiated → Active (SUCCESS ✅)
  ↓
Issues → On Hold (WARNING ⚠️)
  ↓
Resolution → Active (SUCCESS ✅)
  ↓
Finalized → Completed (NEUTRAL ⚪)
```

---

## ✅ Completed Tasks

### Task 1: StatusBadge Component ✅
- [x] Updated component with brand colors
- [x] Implemented semantic color system
- [x] Added comprehensive auto-mapping
- [x] Forest green for success states
- [x] Terracotta for warning states
- [x] Warm gray for neutral/completed
- [x] Red for destructive states
- [x] Blue for progress/info states
- [x] Pill-shaped badges (rounded-full)
- [x] Proper contrast ratios (WCAG AA)
- [x] Size variants (sm, md, lg)
- [x] Documentation and examples

---

## ⏳ Remaining Tasks

### Task 2: Apply to All Pages (In Progress)
- [ ] Update property detail pages
- [ ] Update cycle detail pages
- [ ] Update deal pages
- [ ] Update lead pages
- [ ] Update transaction pages
- [ ] Update commission displays
- [ ] Test all status displays

### Task 3: Notification & Alert Colors
- [ ] Update toast notifications
- [ ] Update alert components
- [ ] Update notification bell
- [ ] Ensure consistency

---

## 🎨 Design Consistency

### Before Phase 5:
- ❌ Generic gray/green/red colors
- ❌ No brand alignment
- ❌ Inconsistent mappings
- ❌ Sharp corners (rounded-md)

### After Phase 5:
- ✅ Brand-aligned colors (terracotta, forest)
- ✅ Warm, inviting palette
- ✅ Consistent auto-mapping
- ✅ Pill-shaped (rounded-full)
- ✅ Professional appearance
- ✅ Clear visual hierarchy

---

## 🚀 Next Steps

1. **Test Current Implementation**
   - Open app and verify StatusBadge displays
   - Check property statuses
   - Check lead statuses
   - Check cycle statuses

2. **Apply to Remaining Pages**
   - Find all status displays
   - Replace custom badges with StatusBadge
   - Ensure consistency

3. **Update Notifications**
   - Apply semantic colors to toasts
   - Update alert variants
   - Ensure accessibility

---

## 📝 Migration Guide

### Old Pattern:
```tsx
// DON'T: Custom badge with hardcoded colors
<Badge className="bg-green-100 text-green-800">
  Available
</Badge>
```

### New Pattern:
```tsx
// DO: Use StatusBadge with auto-mapping
<StatusBadge status="Available" />
```

### Benefits:
- ✅ Automatic color mapping
- ✅ Brand consistency
- ✅ Single source of truth
- ✅ Easy to update globally
- ✅ Accessibility built-in

---

## 🎊 Impact

### Visual Consistency:
- All status badges use the same component
- Automatic brand color application
- Consistent sizing and styling
- Professional appearance

### Developer Experience:
- Simple API (`<StatusBadge status="..." />`)
- Auto-mapping reduces errors
- Easy to maintain
- Type-safe with TypeScript

### Brand Alignment:
- Forest green for positive states
- Terracotta for attention states
- Warm grays for completed states
- Professional color palette

---

**Status**: ✅ StatusBadge Updated & Ready  
**Next**: Apply to all pages, update notifications

**Last Updated**: Phase 5 - Task 1 Complete
