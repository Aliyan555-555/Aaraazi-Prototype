# Detail Page Implementation Checklist

Use this checklist when creating or updating any detail page in aaraazi.

---

## 📋 Pre-Implementation

- [ ] Review the entity type and its data structure
- [ ] Identify all related entities (for ConnectedEntitiesBar)
- [ ] List all key metrics (limit to 5 for header)
- [ ] Determine required tabs (limit to 7)
- [ ] Identify primary actions (1-3 max)
- [ ] List secondary actions (for dropdown)
- [ ] Review `/components/examples/SellCycleDetailsExample.tsx`
- [ ] Read `DETAIL_PAGE_TEMPLATE_GUIDE.md`

---

## 🏗️ Component Structure

### **1. Imports**
```tsx
- [ ] Import DetailPageTemplate and types
- [ ] Import helper components needed
- [ ] Import foundation components (InfoPanel, StatusTimeline, etc.)
- [ ] Import UI components (Button, Badge, etc.)
- [ ] Import icons from lucide-react
- [ ] Import utility functions (formatPKR, formatDate, etc.)
- [ ] Import types (Entity, User, etc.)
```

### **2. PageHeader Configuration**
```tsx
- [ ] Title: Clear, descriptive entity name
- [ ] Breadcrumbs: Max 3 levels, proper onClick handlers
- [ ] Description: Optional subtitle/context
- [ ] Metrics: Exactly 5 or fewer, with icons
- [ ] Primary Actions: 1-3 actions, proper variants
- [ ] Secondary Actions: Additional actions for dropdown
- [ ] Status: Current status with proper value
- [ ] onBack: Navigation handler
```

**Metrics Checklist:**
- [ ] Each metric has: label, value, icon
- [ ] Values are formatted (PKR, dates, counts)
- [ ] Icons are 16x16px (h-4 w-4)
- [ ] Maximum 5 metrics total

**Actions Checklist:**
- [ ] Primary actions use 'default' or 'outline' variant
- [ ] Most important action is first
- [ ] All onClick handlers are defined
- [ ] Consider loading/disabled states

### **3. ConnectedEntitiesBar**
```tsx
- [ ] List all related entities (max 5)
- [ ] Each entity has: type, name, onClick, icon
- [ ] Icons are 12x12px (h-3 w-3)
- [ ] onClick handlers navigate to entity detail
- [ ] Order by importance/relevance
```

**Entity Types to Consider:**
- [ ] Property (if applicable)
- [ ] Buyer/Seller/Owner
- [ ] Agent/Staff
- [ ] Deal/Transaction
- [ ] Parent/Child entities

### **4. Overview Tab - Left Column (2/3)**
```tsx
- [ ] StatusTimeline at top (if multi-step process)
- [ ] InfoPanel sections for key information
- [ ] PaymentSummaryPanel (if payments exist)
- [ ] Related entity cards/displays
```

**StatusTimeline:**
- [ ] Max 7 steps (Miller's Law)
- [ ] Proper status values: complete, current, pending, skipped, error
- [ ] Include dates where available
- [ ] Add descriptions for context

**InfoPanel Sections:**
- [ ] Each panel has clear title
- [ ] Data array properly formatted
- [ ] Columns set to 2 (or 3 for simple data)
- [ ] Density set to 'comfortable'
- [ ] Status fields use StatusBadge component
- [ ] Clickable items have onClick handlers
- [ ] Money values use formatPKR()
- [ ] Dates are formatted consistently

### **5. Overview Tab - Right Column (1/3)**
```tsx
- [ ] QuickActionsPanel at top (max 7 actions)
- [ ] MetricCardsGroup for key stats (max 5)
- [ ] SummaryStatsPanel for breakdowns (max 7)
```

**QuickActionsPanel:**
- [ ] Actions ordered by frequency of use
- [ ] Icons are 16x16px (h-4 w-4)
- [ ] All onClick handlers defined
- [ ] Consider disabled/loading states

**MetricCards:**
- [ ] Max 5 cards
- [ ] Icons are 20x20px (h-5 w-5)
- [ ] Proper variants: info, success, warning, danger
- [ ] Include trends if applicable
- [ ] Add comparison text if helpful
- [ ] Consider onClick for drill-down

### **6. Data Tabs (Full Width)**
```tsx
- [ ] MetricCardsGroup summary at top
- [ ] DataTable for lists
- [ ] Proper empty states
- [ ] Loading states handled
```

**DataTable Setup:**
- [ ] Title and headerAction defined
- [ ] Columns: header, accessor, optional render
- [ ] Custom render for: money, dates, status, actions
- [ ] onRowClick if rows are clickable
- [ ] emptyMessage is context-specific
- [ ] loading prop connected to data fetch state

**Common Table Columns:**
- [ ] Date/Timestamp
- [ ] Name/Title
- [ ] Amount (formatted with formatPKR)
- [ ] Status (using StatusBadge)
- [ ] Actions (View/Edit buttons)

### **7. Activity Tab**
```tsx
- [ ] ActivityTimeline with proper activities
- [ ] Icons for different activity types
- [ ] User attribution included
- [ ] Relative time formatting
- [ ] onClick handlers for clickable items
```

**Activity Properties:**
- [ ] id (unique)
- [ ] type (for categorization)
- [ ] title (clear, concise)
- [ ] description (optional details)
- [ ] date (ISO format)
- [ ] user (optional attribution)
- [ ] icon (optional, custom per type)
- [ ] onClick (optional, for drill-down)

### **8. Tab Configuration**
```tsx
- [ ] Max 7 tabs total (Miller's Law)
- [ ] Each tab has unique id
- [ ] Labels are clear and concise
- [ ] Badges show counts where relevant
- [ ] Content is properly structured
- [ ] Sidebar included only where needed
- [ ] Layout specified per tab
```

**Layout Selection Guide:**
- [ ] '2-1': Overview tabs with sidebar
- [ ] '3-0': Tables, full-width lists
- [ ] '1-1': Comparison/split views
- [ ] '1-0': Forms, simple content

---

## 🎨 Design System Compliance

### **Spacing (8px Grid)**
- [ ] Section spacing: 24px (`space-y-6`)
- [ ] Card padding: 20px (`p-5` or `p-6`)
- [ ] Grid gaps: 16px (`gap-4`)
- [ ] Form field spacing: 16px (`space-y-4`)

### **Typography**
- [ ] Section titles: `text-base`
- [ ] Card titles: `text-sm`
- [ ] Body text: `text-sm`
- [ ] Labels: `text-xs text-gray-600 uppercase`
- [ ] No custom font sizes in Tailwind
- [ ] No custom font weights in Tailwind

### **Colors (aaraazi Palette)**
- [ ] Primary text: `text-[#030213]`
- [ ] Secondary text: `text-gray-600`
- [ ] Borders: `border-gray-200`
- [ ] Background: `bg-gray-50` (page), `bg-white` (cards)
- [ ] Success: Green variants
- [ ] Warning: Yellow variants
- [ ] Destructive: `text-red-600`, `bg-red-100`
- [ ] Info: Blue variants

### **Borders & Radius**
- [ ] Card borders: `border border-gray-200`
- [ ] Border radius: `rounded-lg` (10px)
- [ ] Input borders: `border border-gray-300`

### **Interactive States**
- [ ] Hover: `hover:bg-gray-50` (rows, buttons)
- [ ] Focus: `focus:ring-2 focus:ring-blue-500`
- [ ] Active: `active:scale-95` (optional)
- [ ] Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- [ ] Transitions: `transition-colors` or `transition-all`

---

## ✅ UX Laws Verification

### **Fitts's Law (Targeting)**
- [ ] Primary action buttons ≥ 44x44px
- [ ] Quick action buttons = 40px height
- [ ] Table rows ≥ 40px height
- [ ] Actions placed top-right (optimal location)
- [ ] Adequate spacing between clickable elements

### **Miller's Law (Cognitive Load)**
- [ ] PageHeader metrics ≤ 5
- [ ] Tabs ≤ 7
- [ ] QuickActions ≤ 7
- [ ] ConnectedEntities ≤ 5
- [ ] MetricCardsGroup ≤ 5
- [ ] SummaryStats ≤ 7
- [ ] StatusTimeline steps ≤ 7

### **Hick's Law (Decision Time)**
- [ ] Primary actions: 1-3 visible
- [ ] Secondary actions in dropdown
- [ ] Progressive disclosure via tabs
- [ ] Filters in popovers (not inline)
- [ ] Complex choices broken down

### **Jakob's Law (Familiarity)**
- [ ] Breadcrumbs in expected location (top-left)
- [ ] Actions in expected location (top-right)
- [ ] Tabs below header
- [ ] Sidebar on right (when present)
- [ ] Consistent with other detail pages

### **Aesthetic-Usability Effect**
- [ ] Consistent 8px grid spacing
- [ ] Professional appearance
- [ ] Smooth transitions on interactions
- [ ] Cohesive color scheme
- [ ] Clean, uncluttered layout

---

## 🧪 Testing Checklist

### **Functionality**
- [ ] All onClick handlers work correctly
- [ ] Navigation (breadcrumbs, back button) works
- [ ] Tabs switch properly
- [ ] Forms submit successfully
- [ ] Data loads correctly
- [ ] Empty states display when no data
- [ ] Loading states show during async operations
- [ ] Error states handled gracefully

### **Responsive Design**
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1023px)
- [ ] Test on desktop (≥ 1024px)
- [ ] Sidebar stacks on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Actions remain accessible on all sizes

### **Data Scenarios**
- [ ] Empty data (no items)
- [ ] Single item
- [ ] Multiple items (5-10)
- [ ] Many items (50+)
- [ ] Missing optional fields
- [ ] Null/undefined values handled
- [ ] Long text content (overflow handling)

### **Performance**
- [ ] Large lists use pagination
- [ ] Filtered data uses useMemo
- [ ] Event handlers use useCallback
- [ ] No unnecessary re-renders
- [ ] Images lazy load (if applicable)

### **Accessibility**
- [ ] All buttons have clear labels
- [ ] Icons have proper aria-labels
- [ ] Tables have proper headers
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## 📄 Documentation

- [ ] Add JSDoc comments to component
- [ ] Document prop types
- [ ] Include usage example in comments
- [ ] Update Guidelines.md if needed
- [ ] Note any UX laws applied
- [ ] Document any custom patterns used

---

## 🚀 Pre-Commit Checklist

- [ ] Remove console.logs
- [ ] Remove commented-out code
- [ ] Verify imports are used
- [ ] Check for TypeScript errors
- [ ] Format code (Prettier)
- [ ] Test all features manually
- [ ] Verify responsive design
- [ ] Check browser console for warnings
- [ ] Ensure no hardcoded values (use constants)
- [ ] Verify empty/loading states work

---

## 🎯 Post-Implementation

- [ ] Create PR with clear description
- [ ] Add screenshots to PR
- [ ] Note any breaking changes
- [ ] Update CHANGELOG if applicable
- [ ] Request review from team
- [ ] Test in staging environment
- [ ] Update user documentation if needed
- [ ] Mark task as complete in project tracker

---

## 📊 Quality Standards

Your detail page should meet these standards:

**Data Density:** ⭐⭐⭐⭐⭐
- [ ] InfoPanel used for all structured data
- [ ] No wasted whitespace
- [ ] Efficient use of 8px grid

**Consistency:** ⭐⭐⭐⭐⭐
- [ ] Matches other detail pages
- [ ] Uses template system
- [ ] Follows design system

**UX Laws:** ⭐⭐⭐⭐⭐
- [ ] All 5 laws applied
- [ ] Verified against checklist
- [ ] Documented in code

**Accessibility:** ⭐⭐⭐⭐⭐
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader friendly

**Performance:** ⭐⭐⭐⭐⭐
- [ ] No unnecessary re-renders
- [ ] Optimized data handling
- [ ] Fast page load

---

## 🔧 Common Issues & Solutions

### **Issue: Sidebar not showing**
```tsx
// ❌ Wrong
tabs: [{ id: 'overview', content: <div>...</div> }]

// ✅ Correct
tabs: [{ 
  id: 'overview', 
  content: <div>...</div>,
  sidebar: <div>...</div>,
  layout: '2-1'
}]
```

### **Issue: Metrics not displaying**
```tsx
// ❌ Wrong - More than 5 metrics
metrics: [m1, m2, m3, m4, m5, m6]

// ✅ Correct - Max 5 metrics
metrics: [m1, m2, m3, m4, m5]
```

### **Issue: Table not responsive**
```tsx
// ❌ Wrong - Custom table
<table className="w-full">...</table>

// ✅ Correct - DataTable component
<DataTable columns={[...]} data={[...]} />
```

### **Issue: Inconsistent spacing**
```tsx
// ❌ Wrong - Custom spacing
<div className="mb-3">
<div className="mt-5">

// ✅ Correct - 8px grid (space-y-6 = 24px)
<div className="space-y-6">
```

---

## 📞 Resources

- **Template Guide:** `/DETAIL_PAGE_TEMPLATE_GUIDE.md`
- **Architecture:** `/DETAIL_PAGE_ARCHITECTURE.md`
- **Example:** `/components/examples/SellCycleDetailsExample.tsx`
- **Guidelines:** `/Guidelines.md`
- **Design System:** `/styles/globals.css`

---

**Estimated Time:** 30-60 minutes per detail page using this template system

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Ready to Use ✅
