# aaraazi Brand Implementation Guide
## Step-by-Step Instructions

---

## 🎯 Overview

This guide will walk you through implementing the new aaraazi brand design system across your application in a systematic, low-risk way.

**Estimated Time**: 4-6 weeks  
**Risk Level**: Low (incremental approach)  
**Rollback**: Easy (keep backups)

---

## 📋 Pre-Implementation Checklist

### Before You Start:
- [ ] Review `/BRAND_REDESIGN_PLAN.md` completely
- [ ] Review `/BRAND_QUICK_REFERENCE.md` for quick lookups
- [ ] Review `/COLOR_PALETTE_EXTRACTION.md` for color details
- [ ] Backup current `globals.css` file
- [ ] Create a new git branch: `brand-redesign-v2`
- [ ] Ensure you have Inter font access
- [ ] Review Guidelines.md for any conflicts

---

## 🚀 Phase 1: Foundation Setup (Week 1)

### Step 1.1: Backup Current Styles
```bash
# Create backup
cp /styles/globals.css /styles/globals-backup-v1.css
```

### Step 1.2: Replace globals.css

**Option A: Direct Replacement (Recommended)**
```bash
# Replace with new design system
cp /styles/globals-new.css /styles/globals.css
```

**Option B: Manual Merge**
If you have custom styles, manually merge:
1. Open `/styles/globals-new.css`
2. Copy all `:root` variables
3. Paste into your current `globals.css`
4. Replace old values with new ones

### Step 1.3: Verify Font Loading

Check that Inter font is loading:
```tsx
// In your browser DevTools:
// 1. Inspect any text element
// 2. Computed tab → font-family
// 3. Should show: "Inter, -apple-system, ..."
```

### Step 1.4: Test Basic Rendering

Create a test page to verify colors:
```tsx
// /components/test/BrandTest.tsx
export function BrandTest() {
  return (
    <div className="p-8 space-y-8 bg-neutral-50">
      <h1 className="text-2xl font-semibold text-slate-700">
        Brand Test Page
      </h1>
      
      {/* Test Buttons */}
      <div className="space-x-4">
        <button className="bg-terracotta-400 text-white px-6 py-3 rounded-lg hover:bg-terracotta-500">
          Primary Button
        </button>
        <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200">
          Secondary Button
        </button>
        <button className="bg-forest-400 text-white px-6 py-3 rounded-lg hover:bg-forest-500">
          Success Button
        </button>
      </div>
      
      {/* Test Card */}
      <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Card Title
        </h3>
        <p className="text-slate-600">
          This is body text in slate-600. It should be readable and professional.
        </p>
      </div>
      
      {/* Test Colors */}
      <div className="grid grid-cols-5 gap-4">
        <div className="h-20 bg-terracotta-400 rounded flex items-center justify-center text-white text-xs">
          Terracotta
        </div>
        <div className="h-20 bg-forest-400 rounded flex items-center justify-center text-white text-xs">
          Forest
        </div>
        <div className="h-20 bg-neutral-200 rounded flex items-center justify-center text-slate-700 text-xs">
          Cream
        </div>
        <div className="h-20 bg-slate-500 rounded flex items-center justify-center text-white text-xs">
          Slate
        </div>
        <div className="h-20 bg-slate-700 rounded flex items-center justify-center text-white text-xs">
          Charcoal
        </div>
      </div>
    </div>
  );
}
```

### Step 1.5: Verify CSS Variables

Open DevTools and check CSS variables are loaded:
```javascript
// In browser console:
getComputedStyle(document.documentElement).getPropertyValue('--terracotta-400')
// Should return: #C17052

getComputedStyle(document.documentElement).getPropertyValue('--font-family')
// Should return: 'Inter', -apple-system, ...
```

**✅ Phase 1 Complete When:**
- [ ] Inter font is loading
- [ ] CSS variables are accessible
- [ ] Test page renders correctly
- [ ] No console errors

---

## 🎨 Phase 2: Core Components (Week 2)

### Step 2.1: Update Button Component

Locate your Button component (likely `/components/ui/button.tsx` or similar):

**Before:**
```tsx
// Old button styles
const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  // ...
}
```

**After:**
```tsx
const buttonVariants = {
  default: "bg-terracotta-400 text-white hover:bg-terracotta-500 active:bg-terracotta-600 px-6 py-3 font-medium",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 px-6 py-3 font-medium",
  success: "bg-forest-400 text-white hover:bg-forest-500 active:bg-forest-600 px-6 py-3 font-medium",
  destructive: "bg-error text-white hover:bg-error-600 px-6 py-3 font-medium",
  outline: "border-2 border-neutral-300 text-slate-700 hover:bg-neutral-100 px-6 py-3 font-medium",
  ghost: "text-slate-600 hover:bg-neutral-100 px-6 py-3 font-medium",
}
```

### Step 2.2: Update Badge Component

**Before:**
```tsx
const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  // ...
}
```

**After:**
```tsx
const badgeVariants = {
  success: "bg-forest-50 text-forest-700 border border-forest-200",
  warning: "bg-warning-50 text-warning-600 border border-warning-100",
  error: "bg-error-50 text-error-600 border border-error-100",
  neutral: "bg-neutral-200 text-slate-600 border border-neutral-300",
  info: "bg-info-50 text-info-600 border border-info-100",
}
```

### Step 2.3: Update Input Component

**Before:**
```tsx
<Input className="bg-input-background border-input" />
```

**After:**
```tsx
<Input 
  className="
    bg-neutral-100 
    border border-neutral-300 
    text-slate-700
    placeholder:text-slate-400
    focus:border-terracotta-400 
    focus:ring-2 
    focus:ring-terracotta-400/20
    px-4 
    py-2.5
    rounded-lg
  " 
/>
```

### Step 2.4: Update Card Component

**Before:**
```tsx
<Card className="p-4">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

**After:**
```tsx
<Card className="bg-white border border-neutral-200 shadow-sm rounded-lg">
  <CardHeader className="p-6 border-b border-neutral-200">
    <CardTitle className="text-lg font-semibold text-slate-700">
      Title
    </CardTitle>
    <CardDescription className="text-sm text-slate-400 mt-1">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    Content with better spacing
  </CardContent>
  <CardFooter className="p-6 pt-0">
    Footer actions
  </CardFooter>
</Card>
```

### Step 2.5: Update Table Component

**Before:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
</Table>
```

**After:**
```tsx
<Table>
  <TableHeader className="bg-neutral-100 border-b-2 border-neutral-300">
    <TableRow>
      <TableHead className="text-slate-700 font-semibold px-6 py-4">
        Name
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-neutral-50 border-b border-neutral-200">
      <TableCell className="text-slate-600 px-6 py-4">
        Data
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**✅ Phase 2 Complete When:**
- [ ] All buttons use new colors
- [ ] Badges use new semantic colors
- [ ] Inputs have proper styling
- [ ] Cards have increased padding
- [ ] Tables are styled consistently

---

## 📐 Phase 3: Layout & Spacing (Week 3)

### Step 3.1: Update Page Layouts

**Before:**
```tsx
<div className="p-6">
  <h1>Page Title</h1>
  <div className="mt-4">
    Content
  </div>
</div>
```

**After:**
```tsx
<div className="min-h-screen bg-neutral-50">
  <div className="p-8 md:p-10 lg:p-12">
    <h1 className="text-2xl font-semibold text-slate-700">
      Page Title
    </h1>
    <div className="mt-8">
      Content with more breathing room
    </div>
  </div>
</div>
```

### Step 3.2: Update WorkspaceHeader

Increase spacing and update colors:

**Before:**
```tsx
<WorkspaceHeader
  title="Properties"
  className="p-4"
/>
```

**After:**
```tsx
<WorkspaceHeader
  title="Properties"
  className="px-8 py-6 bg-white border-b border-neutral-200"
/>

// Inside WorkspaceHeader component, update:
<h1 className="text-2xl font-semibold text-slate-700">
  {title}
</h1>
<p className="text-sm text-slate-400 mt-1">
  {description}
</p>
```

### Step 3.3: Update PageHeader

**Before:**
```tsx
<PageHeader
  title={property.title}
  className="p-4"
/>
```

**After:**
```tsx
<PageHeader
  title={property.title}
  className="px-8 py-6 bg-white border-b border-neutral-200"
/>

// Update internal spacing:
<div className="space-y-4"> {/* was space-y-2 */}
  <Breadcrumbs className="text-sm" />
  <h1 className="text-2xl font-semibold text-slate-700">
    {title}
  </h1>
</div>
```

### Step 3.4: Update Form Layouts

**Before:**
```tsx
<form className="space-y-4">
  <div>
    <Label>Name</Label>
    <Input />
  </div>
</form>
```

**After:**
```tsx
<form className="space-y-6"> {/* More vertical space */}
  <div className="space-y-2">
    <Label className="text-sm font-medium text-slate-700">
      Name
    </Label>
    <Input className="bg-neutral-100 border-neutral-300" />
    <p className="text-xs text-slate-400">
      Helper text goes here
    </p>
  </div>
</form>
```

### Step 3.5: Update Grid Layouts

**Before:**
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map(item => <Card />)}
</div>
```

**After:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {items.map(item => <Card />)}
</div>
```

**✅ Phase 3 Complete When:**
- [ ] Page padding increased to 32-48px
- [ ] Section gaps increased to 32-40px
- [ ] Card padding increased to 24px
- [ ] Form fields have 24px vertical spacing
- [ ] Grids have 24-32px gaps

---

## 📊 Phase 4: Charts & Data Viz (Week 4)

### Step 4.1: Update Chart Colors

Find where you're using Recharts (likely in Financial reports):

**Before:**
```tsx
<BarChart data={data}>
  <Bar dataKey="value" fill="#8884d8" />
</BarChart>
```

**After:**
```tsx
<BarChart data={data}>
  <Bar dataKey="value" fill="var(--terracotta-400)" />
  <Bar dataKey="profit" fill="var(--forest-400)" />
</BarChart>
```

### Step 4.2: Create Chart Color Constants

Create `/lib/chart-colors.ts`:
```typescript
export const CHART_COLORS = {
  primary: '#C17052',      // terracotta-400
  success: '#2D6A54',      // forest-400
  warning: '#F59E0B',      // warning
  neutral: '#6B7580',      // slate-400
  accent1: '#D99A7E',      // terracotta-300
  accent2: '#7AB89D',      // forest-300
} as const;

export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.neutral,
  CHART_COLORS.accent1,
  CHART_COLORS.accent2,
];
```

### Step 4.3: Update Financial Report Charts

In your report components:

**Before:**
```tsx
<Line stroke="#8884d8" />
```

**After:**
```tsx
import { CHART_COLORS } from '@/lib/chart-colors';

<Line 
  stroke={CHART_COLORS.primary} 
  strokeWidth={2}
  dot={{ fill: CHART_COLORS.primary, r: 4 }}
/>
```

### Step 4.4: Update Dashboard Widgets

**Before:**
```tsx
<MetricCard
  value="PKR 5M"
  trend="+12%"
  trendColor="green"
/>
```

**After:**
```tsx
<MetricCard
  value="PKR 5M"
  trend="+12%"
  trendColor="forest-400"
  className="bg-white border border-neutral-200 p-6"
/>
```

**✅ Phase 4 Complete When:**
- [ ] All charts use brand colors
- [ ] Positive trends use forest-400
- [ ] Negative trends use error color
- [ ] Neutral data uses slate-400
- [ ] Charts are visually cohesive

---

## ✨ Phase 5: Status & Semantic Colors (Week 5)

### Step 5.1: Update Status Badges

Create a status color mapping:

```typescript
// /lib/status-colors.ts
export const STATUS_COLORS = {
  // Property statuses
  available: {
    bg: 'bg-forest-50',
    text: 'text-forest-700',
    border: 'border-forest-200',
  },
  sold: {
    bg: 'bg-neutral-200',
    text: 'text-slate-600',
    border: 'border-neutral-300',
  },
  pending: {
    bg: 'bg-terracotta-50',
    text: 'text-terracotta-700',
    border: 'border-terracotta-200',
  },
  archived: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
  },
  
  // Lead statuses
  new: {
    bg: 'bg-info-50',
    text: 'text-info-600',
    border: 'border-info-100',
  },
  contacted: {
    bg: 'bg-terracotta-50',
    text: 'text-terracotta-700',
    border: 'border-terracotta-200',
  },
  qualified: {
    bg: 'bg-forest-50',
    text: 'text-forest-700',
    border: 'border-forest-200',
  },
  closed: {
    bg: 'bg-neutral-200',
    text: 'text-slate-600',
    border: 'border-neutral-300',
  },
} as const;
```

### Step 5.2: Create StatusBadge Component

```tsx
// /components/ui/status-badge.tsx
import { STATUS_COLORS } from '@/lib/status-colors';

interface StatusBadgeProps {
  status: keyof typeof STATUS_COLORS;
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${colors.bg} ${colors.text} border ${colors.border}
    `}>
      {children}
    </span>
  );
}
```

### Step 5.3: Update All Status Displays

**Before:**
```tsx
<Badge variant={property.status}>
  {property.status}
</Badge>
```

**After:**
```tsx
<StatusBadge status={property.status}>
  {property.status}
</StatusBadge>
```

**✅ Phase 5 Complete When:**
- [ ] All statuses use semantic colors
- [ ] Success states use forest-400
- [ ] Warning states use warning color
- [ ] Error states use error color
- [ ] Neutral states use slate/neutral

---

## 🔍 Phase 6: Polish & Refinement (Week 6)

### Step 6.1: Audit Color Usage

Create a checklist for each major page:

```markdown
## Color Audit Checklist

### Dashboard Page
- [ ] Background: neutral-50 or neutral-0 ✅
- [ ] Primary actions: terracotta-400 ✅
- [ ] Success metrics: forest-400 ✅
- [ ] Text: slate-600 to slate-700 ✅
- [ ] Borders: neutral-200 or neutral-300 ✅
- [ ] 60-30-10 ratio maintained ✅

### Properties Workspace
- [ ] ... (repeat for each page)
```

### Step 6.2: Verify Accessibility

Use automated tools:

```bash
# Install axe-core (if not already)
npm install --save-dev @axe-core/react

# Or use browser extension:
# - axe DevTools
# - WAVE
# - Lighthouse
```

Check:
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Focus states are visible
- [ ] Interactive elements have proper labels
- [ ] Form inputs have associated labels

### Step 6.3: Test Responsive Behavior

Check spacing at different breakpoints:

```tsx
// Ensure spacing scales properly
<div className="
  p-6 md:p-8 lg:p-12         /* Padding increases */
  space-y-6 md:space-y-8     /* Vertical spacing increases */
  gap-6 md:gap-8 lg:gap-10   /* Grid gaps increase */
">
```

### Step 6.4: Performance Check

Verify no performance regression:

```javascript
// Check font loading
window.addEventListener('load', () => {
  const fontCheck = document.fonts.check('1em Inter');
  console.log('Inter loaded:', fontCheck);
});

// Check CSS custom properties
const getVar = (name) => 
  getComputedStyle(document.documentElement).getPropertyValue(name);

console.log('Terracotta:', getVar('--terracotta-400'));
console.log('Forest:', getVar('--forest-400'));
```

### Step 6.5: Create Style Guide Page

Create a living style guide for your team:

```tsx
// /components/StyleGuide.tsx
export function StyleGuide() {
  return (
    <div className="p-12 space-y-12 bg-neutral-50">
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Color Palette
        </h2>
        <ColorSwatches />
      </section>
      
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Typography
        </h2>
        <TypographyExamples />
      </section>
      
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Components
        </h2>
        <ComponentExamples />
      </section>
    </div>
  );
}
```

**✅ Phase 6 Complete When:**
- [ ] All pages audited for color usage
- [ ] Accessibility verified (WCAG AA)
- [ ] Responsive behavior tested
- [ ] Performance is acceptable
- [ ] Style guide is created

---

## 🎯 Testing Checklist

### Visual Testing
- [ ] Inter font loads correctly
- [ ] Colors match brand palette
- [ ] Spacing feels generous
- [ ] Components are consistent
- [ ] No visual glitches

### Functional Testing
- [ ] All buttons clickable
- [ ] Forms still work
- [ ] Navigation works
- [ ] Modals open/close
- [ ] Charts render

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Responsive Testing
- [ ] Mobile (< 640px)
- [ ] Tablet (640-1024px)
- [ ] Desktop (> 1024px)
- [ ] Large screens (> 1440px)

---

## 🚨 Troubleshooting

### Issue: Inter font not loading

**Solution:**
```html
<!-- Add to index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Issue: Colors not applying

**Solution:**
```bash
# Check CSS is imported in main file
# Verify Tailwind is processing the new classes
# Clear browser cache
# Restart dev server
```

### Issue: Spacing too large

**Solution:**
```tsx
// Adjust spacing variables in globals.css
--space-8: 1.75rem;  /* Reduce from 2rem if needed */
```

### Issue: Low contrast warnings

**Solution:**
```tsx
// Use darker shades for text
text-slate-700  // instead of text-slate-500
bg-terracotta-500  // instead of bg-terracotta-400 for backgrounds
```

---

## 📊 Progress Tracking

### Week 1: Foundation
- [x] Backup current styles
- [x] Replace globals.css
- [ ] Verify font loading
- [ ] Test CSS variables
- [ ] Create test page

### Week 2: Core Components
- [ ] Update Button
- [ ] Update Badge
- [ ] Update Input
- [ ] Update Card
- [ ] Update Table

### Week 3: Layout & Spacing
- [ ] Update page layouts
- [ ] Update headers
- [ ] Update forms
- [ ] Update grids

### Week 4: Charts
- [ ] Update chart colors
- [ ] Update dashboard
- [ ] Update reports

### Week 5: Semantic Colors
- [ ] Update status badges
- [ ] Update alerts
- [ ] Update notifications

### Week 6: Polish
- [ ] Audit all pages
- [ ] Test accessibility
- [ ] Test responsive
- [ ] Create style guide

---

## 🎉 Launch Checklist

Before going live:

- [ ] All phases completed
- [ ] All tests passed
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Team trained on new system
- [ ] Documentation complete
- [ ] Backup created
- [ ] Rollback plan ready

---

## 📚 Next Steps After Implementation

1. **Monitor**: Watch for user feedback
2. **Iterate**: Make small adjustments as needed
3. **Document**: Keep style guide updated
4. **Train**: Ensure team knows new system
5. **Maintain**: Enforce consistency in new features

---

**Implementation Version**: 1.0  
**Last Updated**: January 2026  
**Estimated Completion**: 6 weeks  
**Risk Level**: Low
