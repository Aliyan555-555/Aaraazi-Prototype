# aaraazi Brand Quick Reference Guide

## 🎨 Color Palette Cheat Sheet

### When to Use Each Color

#### Terracotta (#C17052) - PRIMARY ACCENT ⭐
✅ **USE FOR:**
- Primary action buttons (Save, Submit, Add, Create)
- Important CTAs
- Active navigation items
- Links and clickable elements
- Progress indicators
- Focus states

❌ **DON'T USE FOR:**
- Large background areas
- Body text
- Borders (use sparingly)

**Example:**
```tsx
<Button className="bg-terracotta-400 text-white hover:bg-terracotta-500">
  Add Property
</Button>
```

---

#### Forest Green (#2D6A54) - SUCCESS
✅ **USE FOR:**
- Success messages and alerts
- Positive metrics (growth, profit, increase)
- "Available" status badges
- Confirmation actions
- Positive data in charts

❌ **DON'T USE FOR:**
- Primary actions (use terracotta)
- Error states
- Neutral information

**Example:**
```tsx
<Badge className="bg-forest-50 text-forest-700 border-forest-200">
  Available
</Badge>
```

---

#### Warm Cream (#E8E2D5) - NEUTRAL BACKGROUND
✅ **USE FOR:**
- Page backgrounds (subtle variation from white)
- Card backgrounds (alternating)
- Section dividers
- Hover states on neutral elements
- Disabled button backgrounds

❌ **DON'T USE FOR:**
- Text (too low contrast)
- Borders (use neutral-300)

**Example:**
```tsx
<div className="bg-neutral-50 p-8">
  <Card className="bg-neutral-0 border-neutral-200">
    Content
  </Card>
</div>
```

---

#### Slate (#363F47) - PRIMARY TEXT
✅ **USE FOR:**
- Headings (slate-700 for strongest)
- Body text (slate-600)
- Icons (slate-500)
- Secondary buttons
- Borders (slate-200)

❌ **DON'T USE FOR:**
- Large solid backgrounds (too dark)
- Primary CTAs

**Example:**
```tsx
<h1 className="text-slate-700 font-semibold">Property Details</h1>
<p className="text-slate-600">Description text goes here</p>
<span className="text-slate-400">Secondary info</span>
```

---

## 📐 Spacing Quick Guide

### Page Layouts
```tsx
// Main page container
<div className="min-h-screen bg-neutral-50">
  <div className="p-8 md:p-10 lg:p-12"> {/* 32px → 40px → 48px */}
    {/* Content */}
  </div>
</div>
```

### Section Spacing
```tsx
// Between major sections
<div className="space-y-8 md:space-y-10"> {/* 32px → 40px */}
  <Section1 />
  <Section2 />
</div>
```

### Card Components
```tsx
// Card with proper padding
<Card className="p-6">  {/* 24px instead of old 16px */}
  <CardHeader className="mb-4">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content with 16px gaps */}
  </CardContent>
</Card>
```

### Form Elements
```tsx
// Form with better spacing
<form className="space-y-6"> {/* 24px between fields */}
  <div className="space-y-2"> {/* 8px between label and input */}
    <Label>Property Name</Label>
    <Input />
  </div>
</form>
```

---

## 🔤 Typography Quick Guide

### Headings
```tsx
// Page title
<h1 className="text-2xl font-semibold text-slate-700">
  Properties Workspace
</h1>

// Section heading
<h2 className="text-xl font-semibold text-slate-700">
  Active Listings
</h2>

// Subsection heading
<h3 className="text-lg font-semibold text-slate-700">
  Details
</h3>

// Card title
<h4 className="text-base font-semibold text-slate-700">
  Owner Information
</h4>

// Small section label
<h5 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
  Metrics
</h5>
```

### Body Text
```tsx
// Primary body text
<p className="text-base text-slate-600">
  Main content goes here
</p>

// Secondary/helper text
<p className="text-sm text-slate-400">
  Additional information
</p>

// Tiny labels
<span className="text-xs text-slate-400">
  Badge or tiny label
</span>
```

### Links
```tsx
// Links automatically use terracotta
<a href="#" className="text-terracotta-500 hover:text-terracotta-600">
  View Details
</a>

// Or using built-in styles (from globals.css)
<a href="#">View Details</a>  {/* Will be terracotta */}
```

---

## 🎯 Component Patterns

### Primary Button
```tsx
<Button className="bg-terracotta-400 text-white hover:bg-terracotta-500 px-6 py-3">
  Add New Property
</Button>
```

### Secondary Button
```tsx
<Button className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-3">
  Cancel
</Button>
```

### Success Button
```tsx
<Button className="bg-forest-400 text-white hover:bg-forest-500 px-6 py-3">
  Approve
</Button>
```

### Destructive Button
```tsx
<Button className="bg-error text-white hover:bg-error-600 px-6 py-3">
  Delete
</Button>
```

### Status Badges
```tsx
// Success/Available
<Badge className="bg-forest-50 text-forest-700 border border-forest-200">
  Available
</Badge>

// Warning/Pending
<Badge className="bg-warning-50 text-warning-600 border border-warning-100">
  Pending
</Badge>

// Error/Sold
<Badge className="bg-error-50 text-error-600 border border-error-100">
  Sold
</Badge>

// Neutral/Archived
<Badge className="bg-neutral-200 text-slate-600 border border-neutral-300">
  Archived
</Badge>
```

### Cards with Proper Spacing
```tsx
<Card className="bg-white border-neutral-200 shadow-sm">
  <CardHeader className="p-6 border-b border-neutral-200">
    <CardTitle className="text-lg font-semibold text-slate-700">
      Property Details
    </CardTitle>
    <CardDescription className="text-sm text-slate-400">
      View and edit property information
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    {/* Content with 16px vertical spacing */}
  </CardContent>
  <CardFooter className="p-6 pt-0">
    {/* Footer actions */}
  </CardFooter>
</Card>
```

### Input Fields
```tsx
<div className="space-y-2">
  <Label className="text-sm font-medium text-slate-700">
    Property Name
  </Label>
  <Input 
    className="bg-neutral-100 border-neutral-300 focus:border-terracotta-400 px-4 py-2"
    placeholder="Enter property name"
  />
  <p className="text-xs text-slate-400">
    This will appear in listings
  </p>
</div>
```

### Tables
```tsx
<Table>
  <TableHeader className="bg-neutral-100">
    <TableRow>
      <TableHead className="text-slate-700 font-medium">Property</TableHead>
      <TableHead className="text-slate-700 font-medium">Status</TableHead>
      <TableHead className="text-slate-700 font-medium">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-neutral-50 border-b border-neutral-200">
      <TableCell className="text-slate-600">Villa 123</TableCell>
      <TableCell>
        <Badge className="bg-forest-50 text-forest-700">Available</Badge>
      </TableCell>
      <TableCell className="text-slate-700 font-medium">PKR 5,000,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 🚦 60-30-10 Rule Examples

### Dashboard Page
```tsx
<div className="min-h-screen bg-neutral-50"> {/* 60% - Neutral */}
  <header className="bg-white border-b border-neutral-200 p-6">
    <h1 className="text-2xl font-semibold text-slate-700"> {/* 30% - Slate */}
      Dashboard
    </h1>
  </header>
  
  <main className="p-8 space-y-8">
    <Card className="bg-white"> {/* 60% - Neutral */}
      <CardHeader>
        <CardTitle className="text-slate-700"> {/* 30% - Slate */}
          Active Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="bg-terracotta-400"> {/* 10% - Accent */}
          Add Property
        </Button>
      </CardContent>
    </Card>
  </main>
</div>
```

### Visual Breakdown:
- **60% Neutral**: White backgrounds, cream accents, neutral borders
- **30% Slate**: All text, icons, neutral UI elements
- **10% Terracotta**: Primary buttons, active states, highlights

---

## 🎨 Design Tokens Reference

### Most Commonly Used Variables
```css
/* Backgrounds */
--neutral-0        /* White - main backgrounds */
--neutral-50       /* Off-white - page backgrounds */
--neutral-100      /* Light - card alternates, inputs */
--neutral-200      /* Cream - subtle sections */

/* Text */
--slate-700        /* Headings */
--slate-600        /* Body text */
--slate-400        /* Secondary text */

/* Borders */
--neutral-200      /* Soft borders */
--neutral-300      /* Standard borders */
--slate-200        /* Stronger borders */

/* Accents */
--terracotta-400   /* Primary actions */
--terracotta-500   /* Hover states */
--forest-400       /* Success states */

/* Spacing */
--space-4          /* 16px - element gaps */
--space-6          /* 24px - card padding */
--space-8          /* 32px - section gaps */
--space-10         /* 40px - page padding */
```

---

## ✅ Before You Code - Checklist

### For Every Component:
- [ ] Is the background neutral (white or cream)?
- [ ] Is the primary action terracotta?
- [ ] Are text colors slate (not black)?
- [ ] Is padding at least 24px on cards?
- [ ] Are sections spaced 32-40px apart?
- [ ] Do success states use forest green?
- [ ] Are borders using neutral-200 or neutral-300?
- [ ] Does it follow 60-30-10 color ratio?

### For Every Page:
- [ ] Page background is neutral-50 or neutral-0
- [ ] Headings use slate-700 with semibold weight
- [ ] Body text uses slate-600 with normal weight
- [ ] Primary CTA uses terracotta-400
- [ ] Spacing feels generous (not cramped)
- [ ] Color contrast meets WCAG AA
- [ ] Inter font is being used

---

## 🚀 Quick Start

### Step 1: Replace globals.css
```bash
# Backup current file
cp /styles/globals.css /styles/globals-old.css

# Replace with new version
cp /styles/globals-new.css /styles/globals.css
```

### Step 2: Update a Component
```tsx
// Before
<Button className="bg-primary text-white">
  Save
</Button>

// After
<Button className="bg-terracotta-400 text-white hover:bg-terracotta-500 px-6 py-3">
  Save
</Button>
```

### Step 3: Test
- Check color contrast
- Verify spacing looks better
- Ensure Inter font loads
- Test hover states

---

## 🎯 Common Mistakes to Avoid

❌ **Using black (#000000) for text**
✅ Use slate-700 or slate-600 instead

❌ **Tiny padding (8px, 12px)**
✅ Use minimum 24px for cards, 32px for pages

❌ **Terracotta for large backgrounds**
✅ Use sparingly for accents only

❌ **Inconsistent spacing**
✅ Stick to 4px grid: 16px, 24px, 32px, 40px

❌ **Using old color variables**
✅ Use new semantic names (terracotta-400, not primary)

❌ **Forgetting hover states**
✅ Always add hover:bg-terracotta-500 on buttons

---

## 📚 Need Help?

### Reference Files:
- `/BRAND_REDESIGN_PLAN.md` - Full implementation plan
- `/styles/globals-new.css` - Complete design system
- `/Guidelines.md` - Development standards

### Quick Questions:
- **What color for primary button?** → terracotta-400
- **What color for success?** → forest-400
- **What color for body text?** → slate-600
- **How much card padding?** → 24px (space-6)
- **What font?** → Inter

---

**Last Updated**: January 2026  
**Version**: 2.0.0
