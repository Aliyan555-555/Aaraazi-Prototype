# Detail Page Template System - Complete Guide

## 📚 Overview

This guide covers the reusable detail page template system created to ensure consistency across all entity detail pages in aaraazi. The system follows all 5 UX Laws and the established design system.

---

## 🎯 Components Created

### **Core Template**
- `DetailPageTemplate` - Main template component

### **Helper Components**
- `QuickActionsPanel` - Sidebar with action buttons
- `MetricCardsGroup` - Grid of metric cards
- `SummaryStatsPanel` - Compact stats display
- `DataTable` - Standardized table component
- `PaymentSummaryPanel` - Payment tracking with progress
- `ActivityTimeline` - Chronological activity feed

### **Foundation Components** (Already Existing)
- `PageHeader` - Header with breadcrumbs, metrics, actions
- `ConnectedEntitiesBar` - Related entities display
- `InfoPanel` - Label-value data display
- `MetricCard` - Individual metric display
- `StatusTimeline` - Process progression timeline
- `StatusBadge` - Consistent status indicators

---

## 🏗️ Architecture

### **Universal Detail Page Structure**

```
┌─────────────────────────────────────────────────────┐
│ PageHeader                                          │
│ - Breadcrumbs (Jakob's Law)                        │
│ - Title                                             │
│ - Max 5 Metrics (Miller's Law)                     │
│ - Primary Actions (Fitts's Law: Large buttons)     │
│ - Secondary Actions (Hick's Law: In dropdown)      │
├─────────────────────────────────────────────────────┤
│ ConnectedEntitiesBar                                │
│ - Max 5 entities (Miller's Law)                    │
│ - Clickable for navigation                         │
├─────────────────────────────────────────────────────┤
│ Tabs (Max 7 - Miller's Law)                        │
│ ┌───────────────────────────────┬─────────────────┐ │
│ │ Left Column (2/3)             │ Right (1/3)     │ │
│ │                               │                 │ │
│ │ - StatusTimeline              │ - Quick Actions │ │
│ │ - InfoPanel sections          │ - MetricCards   │ │
│ │ - DataTables                  │ - Forms         │ │
│ │ - Related displays            │ - Stats         │ │
│ │                               │                 │ │
│ └───────────────────────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### **Layout Options**

The template supports 4 layout ratios per tab:

1. **'2-1'** - 2/3 left + 1/3 right (DEFAULT - Overview tabs)
2. **'3-0'** - Full width, no sidebar (Tables, lists)
3. **'1-1'** - 1/2 + 1/2 split (Comparison views)
4. **'1-0'** - Single column (Forms, simple content)

---

## 🚀 Quick Start Guide

### **Step 1: Import Components**

```tsx
import { DetailPageTemplate, DetailPageTab } from '../layout/DetailPageTemplate';
import { QuickActionsPanel } from '../layout/QuickActionsPanel';
import { MetricCardsGroup } from '../layout/MetricCardsGroup';
import { SummaryStatsPanel } from '../layout/SummaryStatsPanel';
import { DataTable } from '../layout/DataTable';
import { PaymentSummaryPanel } from '../layout/PaymentSummaryPanel';
import { ActivityTimeline } from '../layout/ActivityTimeline';
import { InfoPanel } from '../ui/info-panel';
import { StatusTimeline } from '../ui/status-timeline';
import { StatusBadge } from '../layout/StatusBadge';
```

### **Step 2: Configure Page Header**

```tsx
const pageHeader = {
  title: 'Entity Name/Title',
  breadcrumbs: [
    { label: 'Dashboard', onClick: handleBackToDash },
    { label: 'Entity List', onClick: handleBackToList },
    { label: 'Current Entity' },
  ],
  metrics: [
    // MAX 5 METRICS (Miller's Law)
    { label: 'Metric 1', value: 'Value', icon: <Icon /> },
    { label: 'Metric 2', value: 'Value', icon: <Icon /> },
    // ... up to 5
  ],
  primaryActions: [
    // MAX 3 PRIMARY (Fitts's Law - large buttons)
    { label: 'Primary Action', onClick: handler, variant: 'default' },
  ],
  secondaryActions: [
    // Overflow actions (Hick's Law - in dropdown)
    { label: 'Secondary Action', onClick: handler },
  ],
  status: currentStatus,
  onBack: handleBack,
};
```

### **Step 3: Define Connected Entities**

```tsx
const connectedEntities = [
  // MAX 5 ENTITIES (Miller's Law)
  {
    type: 'property',
    name: 'Property Address',
    onClick: viewProperty,
    icon: <Home className="h-3 w-3" />,
  },
  {
    type: 'buyer',
    name: 'Buyer Name',
    onClick: viewBuyer,
    icon: <User className="h-3 w-3" />,
  },
  // ... up to 5
];
```

### **Step 4: Build Tab Content**

```tsx
// Overview Tab - Use 2/3 + 1/3 layout
const overviewContent = (
  <>
    <StatusTimeline steps={[...]} />
    <InfoPanel title="Section 1" data={[...]} columns={2} />
    <InfoPanel title="Section 2" data={[...]} columns={2} />
  </>
);

const overviewSidebar = (
  <>
    <QuickActionsPanel actions={[...]} />
    <MetricCardsGroup metrics={[...]} columns={2} />
    <SummaryStatsPanel stats={[...]} />
  </>
);

// Data Tab - Use full width
const dataTabContent = (
  <>
    <MetricCardsGroup metrics={[...]} columns={4} />
    <DataTable
      title="Table Title"
      columns={[...]}
      data={data}
      onRowClick={handleRowClick}
    />
  </>
);
```

### **Step 5: Define Tabs**

```tsx
const tabs: DetailPageTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: overviewContent,
    sidebar: overviewSidebar,
    layout: '2-1', // 2/3 + 1/3
  },
  {
    id: 'data',
    label: 'Data List',
    badge: dataCount, // Shows as "Data List (15)"
    content: dataTabContent,
    layout: '3-0', // Full width
  },
  {
    id: 'activity',
    label: 'Activity',
    content: <ActivityTimeline activities={[...]} />,
    layout: '3-0',
  },
];
```

### **Step 6: Render Template**

```tsx
return (
  <DetailPageTemplate
    pageHeader={pageHeader}
    connectedEntities={connectedEntities}
    tabs={tabs}
    defaultTab="overview"
  />
);
```

---

## 📦 Helper Components Guide

### **1. QuickActionsPanel**

**Purpose:** Sidebar with quick action buttons  
**Max Items:** 7 (Miller's Law)  
**Touch Target:** 40px height (Fitts's Law)

```tsx
<QuickActionsPanel
  title="Quick Actions" // Optional
  actions={[
    {
      label: 'Record Offer',
      icon: <Plus className="h-4 w-4" />,
      onClick: handleRecordOffer,
      variant: 'outline', // default | outline | ghost | destructive
      disabled: false,
      loading: false,
    },
    // ... up to 7 actions
  ]}
/>
```

---

### **2. MetricCardsGroup**

**Purpose:** Grid of metric cards with consistent spacing  
**Max Items:** 5 (Miller's Law)  
**Responsive:** Auto-adjusts columns

```tsx
<MetricCardsGroup
  metrics={[
    {
      label: 'Total Revenue',
      value: formatPKR(5000000),
      icon: <DollarSign className="h-5 w-5" />,
      variant: 'success', // info | success | warning | danger | default
      trend: { direction: 'up', value: 15 }, // Optional
      comparison: 'vs last month', // Optional
      onClick: () => {}, // Optional
    },
    // ... up to 5 metrics
  ]}
  columns={3} // 2 | 3 | 4 | 5
/>
```

---

### **3. SummaryStatsPanel**

**Purpose:** Compact stats with icon + label + value  
**Max Items:** 7 (Miller's Law)  
**Use Case:** Breakdowns, categorized counts

```tsx
<SummaryStatsPanel
  title="Status Breakdown"
  stats={[
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Pending',
      value: 12,
      color: 'yellow', // green | blue | purple | red | yellow | gray
      onClick: () => {}, // Optional
    },
    // ... up to 7 stats
  ]}
/>
```

---

### **4. DataTable**

**Purpose:** Standardized tables with sorting, hover, actions  
**Features:** Empty state, loading state, row click

```tsx
<DataTable
  title="Transaction History"
  headerAction={
    <Button onClick={handleAdd}>
      <Plus className="h-4 w-4 mr-2" />
      Add Transaction
    </Button>
  }
  columns={[
    {
      header: 'Date',
      accessor: 'date',
      className: 'w-32', // Optional column styling
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => formatPKR(row.amount), // Custom render
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ]}
  data={transactions}
  onRowClick={(row, index) => viewTransaction(row)}
  emptyMessage="No transactions yet"
  loading={isLoading}
/>
```

---

### **5. PaymentSummaryPanel**

**Purpose:** Payment tracking with progress bar  
**Use Case:** Installment plans, payment schedules

```tsx
<PaymentSummaryPanel
  title="Payment Summary" // Optional
  totalAmount={5000000}
  paidAmount={3000000}
  pendingAmount={2000000}
  nextPayment={{
    amount: 1000000,
    dueDate: '2024-03-15',
    description: 'Installment 3 of 5', // Optional
  }}
/>
```

**Output:**
- 3 metric cards: Total, Paid, Pending
- Progress bar with percentage
- Next payment due card (if provided)

---

### **6. ActivityTimeline**

**Purpose:** Chronological activity feed  
**Features:** Icons, relative time, user attribution

```tsx
<ActivityTimeline
  title="Activity Timeline"
  activities={[
    {
      id: '1',
      type: 'offer',
      title: 'New offer received',
      description: 'PKR 5,000,000 from John Doe',
      date: '2024-12-27T10:30:00',
      user: 'Agent Name', // Optional
      icon: <FileText className="h-5 w-5 text-blue-600" />, // Optional
      onClick: () => viewActivity(), // Optional
    },
  ]}
  emptyMessage="No activities yet"
/>
```

**Time Display:** Uses relative time (e.g., "2 hours ago", "3 days ago")

---

## 🎨 Design System Compliance

### **Spacing (8px Grid)**
- Section spacing: 24px (1.5rem) = `space-y-6`
- Card padding: 20px (1.25rem) = `p-5`
- Card gap: 16px (1rem) = `gap-4`
- Input spacing: 16px (1rem) = `space-y-4`

### **Typography**
- Page title: Default (from PageHeader)
- Section titles: `text-base` (16px)
- Card titles: `text-sm` (14px)
- Body text: `text-sm` (14px)
- Labels: `text-xs text-gray-600 uppercase`

### **Colors (aaraazi Palette)**
- Primary: `#030213`
- Secondary: `#ececf0`
- Success: Green variants
- Warning: Yellow variants
- Destructive: Red variants (`#d4183d`)
- Info: Blue variants

### **Borders & Radius**
- Border: `border border-gray-200`
- Radius: `rounded-lg` (10px)

---

## ✅ UX Laws Compliance Checklist

For each detail page, verify:

### **Fitts's Law (Targeting)**
- [ ] Primary action buttons are large (min 44x44px)
- [ ] Actions placed in optimal locations (top-right)
- [ ] Quick Actions buttons are 40px height
- [ ] Click targets are easy to hit

### **Miller's Law (Cognitive Load)**
- [ ] Max 5 metrics in PageHeader
- [ ] Max 7 tabs
- [ ] Max 7 Quick Actions
- [ ] Max 5 entities in ConnectedEntitiesBar
- [ ] Max 5 MetricCards in a group

### **Hick's Law (Decision Time)**
- [ ] Primary actions limited to 1-3
- [ ] Secondary actions in dropdown
- [ ] Progressive disclosure used
- [ ] Filter/search options in popovers

### **Jakob's Law (Familiarity)**
- [ ] Breadcrumbs in expected location
- [ ] Tabs below header
- [ ] Standard action placement
- [ ] Consistent patterns across pages

### **Aesthetic-Usability Effect**
- [ ] 8px grid spacing throughout
- [ ] Consistent colors from palette
- [ ] Professional appearance
- [ ] Smooth transitions on interactive elements

---

## 📄 Implementation Examples

### **Property Details** ✅
Already implemented with template pattern.

### **Sell Cycle Details**
See `/components/examples/SellCycleDetailsExample.tsx`

### **Purchase Cycle Details**
Copy Sell Cycle pattern, adjust for buyer perspective.

### **Rent Cycle Details**
Similar to Sell Cycle, add:
- Lease duration timeline
- Maintenance requests tab
- Rent payment schedule

### **Deal Details**
Focus on:
- Transaction breakdown
- Commission calculations
- Document tracking
- Deal stage timeline

### **Requirement Details**
Focus on:
- Matching criteria
- Matched properties grid
- Client preferences
- Activity tracking

---

## 🔧 Customization Guide

### **Custom Layout Ratios**

If you need a different layout, add to `layoutClasses` in DetailPageTemplate:

```tsx
const layoutClasses = {
  '2-1': 'grid-cols-1 lg:grid-cols-3',
  '3-0': 'grid-cols-1',
  '1-1': 'grid-cols-1 lg:grid-cols-2',
  '1-0': 'grid-cols-1',
  '4-1': 'grid-cols-1 lg:grid-cols-5', // Custom: 4/5 + 1/5
};
```

### **Custom Tab Layouts**

Mix and match layouts per tab:

```tsx
tabs: [
  { id: 'overview', layout: '2-1' }, // Sidebar
  { id: 'table', layout: '3-0' },    // Full width
  { id: 'compare', layout: '1-1' },  // Split view
]
```

### **Conditional Sidebars**

Show sidebar only when needed:

```tsx
{
  id: 'overview',
  content: overviewContent,
  sidebar: hasActions ? overviewSidebar : undefined,
  layout: hasActions ? '2-1' : '3-0',
}
```

---

## 🐛 Troubleshooting

### **Issue: Tabs not showing**
**Solution:** Ensure each tab has unique `id` and at least `label` + `content`.

### **Issue: Sidebar not appearing**
**Solution:** Check that `sidebar` prop is provided and `layout` is not `'3-0'` or `'1-0'`.

### **Issue: Metrics not displaying**
**Solution:** Limit to 5 metrics. Check icon components are imported.

### **Issue: ConnectedEntitiesBar empty**
**Solution:** Pass `connectedEntities` array. Leave empty array if no entities.

### **Issue: Table not responsive**
**Solution:** DataTable has built-in overflow scroll. Ensure container has width.

---

## 📊 Performance Considerations

- **React.memo**: Helper components are memoized where appropriate
- **Large lists**: Use pagination for > 50 items in DataTable
- **Heavy data**: Use `useMemo` for filtered/sorted data
- **Event handlers**: Use `useCallback` for stability

---

## 🎯 Next Steps

1. **Update Sell Cycle Details** - Using template
2. **Update Purchase Cycle Details** - Using template
3. **Update Rent Cycle Details** - Using template
4. **Update Deal Details** - Using template
5. **Update Requirement Details** - Using template

Each implementation should take ~30-60 minutes using this template system.

---

## 📞 Support

For questions or improvements to the template system, refer to:
- `/components/examples/SellCycleDetailsExample.tsx` - Full example
- `Guidelines.md` - Design system guidelines
- This guide - Complete reference

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
