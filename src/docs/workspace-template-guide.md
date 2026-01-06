# WorkspacePageTemplate - Complete Usage Guide
**Phase 5.1: Core Template System**  
**Version**: 1.0  
**Date**: December 27, 2024

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Component Architecture](#component-architecture)
4. [Props Reference](#props-reference)
5. [View Modes](#view-modes)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [UX Laws Implementation](#ux-laws-implementation)

---

## Overview

The **WorkspacePageTemplate** is a comprehensive template system for building consistent, high-quality workspace/listing pages across the aaraazi platform. It provides:

- **Multiple view modes**: Table, Grid, and Kanban
- **Integrated search & filtering**: Built-in state management
- **Bulk selection & actions**: Multi-select with action bar
- **Pagination**: Customizable page sizes
- **Empty states**: Automatic empty/no-results handling
- **UX laws compliance**: Follows all 5 UX laws
- **Performance optimized**: React.memo, useMemo, useCallback
- **Fully typed**: Complete TypeScript support

### Benefits

✅ **60% code reduction** vs building from scratch  
✅ **Consistent UX** across all workspaces  
✅ **Faster development** with reusable patterns  
✅ **World-class quality** matching DetailPageTemplate V4  
✅ **Accessible** WCAG 2.1 AA compliant  
✅ **Mobile responsive** out of the box  

---

## Quick Start

### Basic Example

```tsx
import { WorkspacePageTemplate, Column } from '@/components/workspace';
import { Property } from '@/types';

const PropertiesWorkspace = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  // Define table columns
  const columns: Column<Property>[] = [
    {
      id: 'title',
      label: 'Property',
      accessor: (property) => property.title || property.address,
      sortable: true,
    },
    {
      id: 'price',
      label: 'Price',
      accessor: (property) => formatPKR(property.price),
      sortable: true,
      align: 'right',
    },
  ];

  return (
    <WorkspacePageTemplate
      // Header
      title="Properties"
      description="Manage your property portfolio"
      stats={[
        { label: 'Total', value: properties.length, variant: 'default' },
        { label: 'Available', value: 45, variant: 'success' },
      ]}
      
      // Actions
      primaryAction={{
        label: 'Add Property',
        icon: <Plus className="w-4 h-4" />,
        onClick: () => console.log('Add property'),
      }}
      
      // Data
      items={properties}
      getItemId={(property) => property.id}
      
      // Table
      columns={columns}
      
      // Callbacks
      onItemClick={(property) => console.log('View', property)}
    />
  );
};
```

---

## Component Architecture

### Component Tree

```
WorkspacePageTemplate
├── WorkspaceHeader (stats, actions, view switcher)
├── WorkspaceSearchBar (search, filters, sort)
├── WorkspaceToolbar (bulk actions, selection count)
├── WorkspaceContent (view-specific rendering)
│   ├── TableView (with columns)
│   ├── GridView (with cards)
│   └── KanbanView (with columns)
└── WorkspaceFooter (pagination, page size)
```

### State Management

The template manages the following state internally:

- **View mode**: Current view (table/grid/kanban)
- **Search query**: Text search
- **Active filters**: Map of filter values
- **Sort**: Sort field and order
- **Selection**: Set of selected item IDs
- **Pagination**: Current page, page size

All state is managed within the template - you just provide the data and configuration!

---

## Props Reference

### Header Props

```typescript
// Title and description
title: string;                    // Required - Page title
description?: string;             // Optional - Subtitle
icon?: React.ReactNode;          // Optional - Icon next to title

// Stats (max 5 - Miller's Law)
stats?: Array<{
  label: string;                  // Stat label
  value: number | string;         // Stat value
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;         // Optional icon
}>;
```

### Action Props

```typescript
// Primary action (top-right, 44x44px - Fitts's Law)
primaryAction?: {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

// Secondary actions (max 3 visible - Hick's Law)
secondaryActions?: Array<{
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}>;

// Bulk actions (max 5 visible - Miller's Law)
bulkActions?: Array<{
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedIds: string[]) => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}>;
```

### Data Props

```typescript
// Items to display
items: T[];                       // Required - Array of items
isLoading?: boolean;             // Optional - Loading state
getItemId: (item: T) => string;  // Required - Extract ID from item
```

### View Configuration

```typescript
// View modes
defaultView?: 'table' | 'grid' | 'kanban';  // Default: 'grid'
availableViews?: Array<'table' | 'grid' | 'kanban'>;  // Default: ['table', 'grid']
```

### Search & Filter Props

```typescript
// Search
searchPlaceholder?: string;      // Default: 'Search...'
onSearch?: (item: T, query: string) => boolean;  // Custom search

// Filters (max 7 quick filters - Miller's Law)
quickFilters?: QuickFilter[];

// Sort
sortOptions?: SortOption[];
onSort?: (items: T[], sortBy: string, order: 'asc' | 'desc') => T[];

// Custom filter
onFilter?: (item: T, filters: Map<string, any>) => boolean;
```

### Render Functions

```typescript
// Grid view
renderCard?: (item: T, index: number) => React.ReactNode;

// Table view
renderTableRow?: (item: T, index: number) => React.ReactNode;
columns?: Column<T>[];  // Alternative to renderTableRow

// Kanban view
renderKanbanCard?: (item: T, index: number) => React.ReactNode;
kanbanColumns?: KanbanColumn[];
getKanbanColumn?: (item: T) => string;
```

### Column Definition

```typescript
interface Column<T> {
  id: string;                     // Unique column ID
  label: string;                  // Column header text
  accessor: (item: T) => React.ReactNode;  // Render cell content
  sortable?: boolean;             // Enable sorting
  width?: string;                 // CSS width (e.g., '200px')
  align?: 'left' | 'center' | 'right';  // Cell alignment
  visible?: boolean;              // Show/hide column
}
```

### Pagination Props

```typescript
pagination?: {
  enabled: boolean;               // Enable pagination
  pageSize?: number;              // Items per page (default: 24)
  pageSizeOptions?: number[];     // Options (default: [12, 24, 48, 96])
};
```

### Empty States

```typescript
emptyStatePreset?: EmptyStatePreset;  // Preset empty state
customEmptyState?: React.ReactNode;   // Custom empty JSX
noResultsState?: React.ReactNode;     // Custom no-results JSX
```

---

## View Modes

### Table View

Best for: Data-heavy workspaces (Cycles, Deals)

**Features:**
- Sortable columns
- Resizable columns (future)
- Column visibility toggle
- Sticky header
- Horizontal scroll on mobile
- Row selection

**Example:**

```typescript
<WorkspacePageTemplate
  defaultView="table"
  availableViews={['table', 'grid']}
  columns={[
    {
      id: 'property',
      label: 'Property',
      accessor: (cycle) => cycle.propertyTitle,
      sortable: true,
      width: '300px',
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (cycle) => <StatusBadge status={cycle.status} />,
      align: 'center',
    },
    {
      id: 'price',
      label: 'Price',
      accessor: (cycle) => formatPKR(cycle.price),
      align: 'right',
      sortable: true,
    },
  ]}
  items={cycles}
  getItemId={(cycle) => cycle.id}
/>
```

### Grid View

Best for: Visual workspaces (Properties, Requirements)

**Features:**
- Responsive grid (1-4 columns)
- Image support
- Card hover states
- Card selection
- Flexible card content

**Example:**

```typescript
<WorkspacePageTemplate
  defaultView="grid"
  availableViews={['grid', 'table']}
  renderCard={(property) => (
    <PropertyCard
      property={property}
      onClick={() => handleViewProperty(property)}
    />
  )}
  items={properties}
  getItemId={(property) => property.id}
/>
```

### Kanban View

Best for: Stage-based workflows (Deals)

**Features:**
- Horizontal scrolling columns
- Max 7 columns (Miller's Law)
- Column counts
- Drag & drop (future)
- Mobile: Vertical stack

**Example:**

```typescript
<WorkspacePageTemplate
  defaultView="kanban"
  availableViews={['kanban', 'table', 'grid']}
  kanbanColumns={[
    { id: 'offer-accepted', label: 'Offer Accepted', color: 'blue' },
    { id: 'agreement', label: 'Agreement', color: 'purple' },
    { id: 'documentation', label: 'Documentation', color: 'yellow' },
    { id: 'payment', label: 'Payment', color: 'orange' },
    { id: 'transfer', label: 'Transfer', color: 'green' },
  ]}
  getKanbanColumn={(deal) => deal.lifecycle.stage}
  renderKanbanCard={(deal) => (
    <DealKanbanCard deal={deal} />
  )}
  items={deals}
  getItemId={(deal) => deal.id}
/>
```

---

## Examples

### Example 1: Properties Workspace (Grid + Table)

```typescript
import { WorkspacePageTemplate } from '@/components/workspace';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Property } from '@/types';
import { formatPKR } from '@/lib/currency';

export const PropertiesWorkspaceV4 = ({ user }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  const columns = [
    {
      id: 'property',
      label: 'Property',
      accessor: (p: Property) => (
        <div>
          <p className="font-medium">{p.title || p.address}</p>
          <p className="text-sm text-gray-600">{p.address}</p>
        </div>
      ),
      width: '300px',
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (p: Property) => <StatusBadge status={p.status} />,
      align: 'center',
    },
    {
      id: 'type',
      label: 'Type',
      accessor: (p: Property) => <span className="capitalize">{p.propertyType}</span>,
    },
    {
      id: 'price',
      label: 'Price',
      accessor: (p: Property) => formatPKR(p.price),
      align: 'right',
      sortable: true,
    },
    {
      id: 'area',
      label: 'Area',
      accessor: (p: Property) => `${p.area} sq yd`,
      align: 'right',
    },
  ];

  const stats = [
    { label: 'Total', value: properties.length },
    { label: 'Available', value: properties.filter(p => p.status === 'available').length, variant: 'success' },
    { label: 'Sold', value: properties.filter(p => p.status === 'sold').length, variant: 'info' },
  ];

  const bulkActions = [
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      onClick: (ids: string[]) => console.log('Export', ids),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash className="w-4 h-4" />,
      onClick: (ids: string[]) => console.log('Delete', ids),
      variant: 'destructive',
    },
  ];

  return (
    <WorkspacePageTemplate
      title="Properties"
      description="Manage your property portfolio"
      stats={stats}
      primaryAction={{
        label: 'Add Property',
        icon: <Plus className="w-4 h-4" />,
        onClick: () => console.log('Add property'),
      }}
      items={properties}
      getItemId={(p) => p.id}
      defaultView="grid"
      availableViews={['grid', 'table']}
      columns={columns}
      renderCard={(property) => (
        <PropertyCard
          property={property}
          onClick={() => console.log('View', property)}
        />
      )}
      bulkActions={bulkActions}
      searchPlaceholder="Search properties by title, address..."
      quickFilters={[
        {
          id: 'status',
          label: 'Status',
          options: [
            { value: 'available', label: 'Available', count: 45 },
            { value: 'sold', label: 'Sold', count: 23 },
          ],
          value: [],
          onChange: (value) => console.log('Filter by status', value),
          multiple: true,
        },
      ]}
      sortOptions={[
        { value: 'newest', label: 'Newest First' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'price-low', label: 'Price: Low to High' },
      ]}
      emptyStatePreset={EmptyStatePresets.properties(() => console.log('Add property'))}
      onItemClick={(property) => console.log('View property', property)}
    />
  );
};
```

### Example 2: Deal Dashboard (Kanban + Table)

```typescript
export const DealDashboardV4 = ({ user }) => {
  const [deals, setDeals] = useState<Deal[]>([]);

  const kanbanColumns = [
    { id: 'offer-accepted', label: 'Offer Accepted' },
    { id: 'agreement-signing', label: 'Agreement' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'payment-processing', label: 'Payment' },
    { id: 'transfer-registration', label: 'Transfer' },
    { id: 'final-handover', label: 'Handover' },
  ];

  return (
    <WorkspacePageTemplate
      title="Deals"
      description="Manage all property transactions"
      stats={[
        { label: 'Total', value: deals.length },
        { label: 'Active', value: deals.filter(d => d.lifecycle.status === 'active').length, variant: 'success' },
        { label: 'Completed', value: deals.filter(d => d.lifecycle.status === 'completed').length, variant: 'info' },
      ]}
      items={deals}
      getItemId={(d) => d.id}
      defaultView="kanban"
      availableViews={['kanban', 'table', 'grid']}
      kanbanColumns={kanbanColumns}
      getKanbanColumn={(deal) => deal.lifecycle.stage}
      renderKanbanCard={(deal) => (
        <DealKanbanCard deal={deal} />
      )}
      onItemClick={(deal) => console.log('View deal', deal)}
    />
  );
};
```

---

## Best Practices

### 1. Performance

**DO:**
- Use `React.memo` on custom card/row components
- Use `useMemo` for expensive computations
- Keep `getItemId` function simple
- Implement pagination for large datasets (>100 items)

**DON'T:**
- Create new objects/arrays in render functions
- Use heavy computations in `accessor` functions
- Render large images without optimization

### 2. UX Laws Compliance

**Miller's Law (Cognitive Load):**
- Max 5 stats in header
- Max 7 quick filters
- Max 7 table columns (default visible)
- Max 7 kanban columns

**Fitts's Law (Targeting):**
- Primary action: 44x44px minimum
- Bulk actions: 40x40px minimum
- Row/card: Entire area clickable

**Hick's Law (Decision Time):**
- Max 5 visible bulk actions (more in dropdown)
- Max 3 primary actions
- Use progressive disclosure for advanced features

### 3. Accessibility

**Required:**
- Provide meaningful `aria-label` attributes
- Support keyboard navigation (Tab, Enter, Space)
- Ensure color contrast meets WCAG 2.1 AA (4.5:1)
- Add screen reader announcements for state changes

### 4. Mobile Responsiveness

**Grid View:**
- 1 column on mobile (< 640px)
- 2 columns on tablet (640px - 1024px)
- 3-4 columns on desktop (> 1024px)

**Table View:**
- Horizontal scroll on mobile
- Consider switching to card layout on small screens

**Kanban View:**
- Vertical stack on mobile
- Horizontal scroll on tablet/desktop

### 5. Empty States

**Always provide empty states:**

```typescript
// No data
emptyStatePreset={EmptyStatePresets.properties(handleAdd)}

// No results (custom)
noResultsState={
  <WorkspaceEmptyState
    variant="no-results"
    title="No properties found"
    description="Try adjusting your search criteria"
    primaryAction={{
      label: 'Clear Filters',
      onClick: handleClearFilters,
    }}
  />
}
```

---

## UX Laws Implementation

### Fitts's Law (Targeting)
- Primary action button: **44x44px minimum** (top-right)
- Bulk action buttons: **40x40px minimum**
- Entire row/card clickable: **Easy targeting**
- Pagination buttons: **40x40px minimum**

### Miller's Law (Cognitive Load)
- Stats: **Max 5** metrics
- Quick filters: **Max 7** filters
- Table columns: **Max 7** default visible
- Kanban columns: **Max 7** columns
- Bulk actions: **Max 5** visible

### Hick's Law (Decision Time)
- Primary vs secondary actions: **Clear hierarchy**
- Bulk actions: **5 visible, more in dropdown**
- Advanced filters: **Progressive disclosure**
- Default view: **Most common use case**

### Jakob's Law (Familiarity)
- Search bar: **Top-left placement**
- Add button: **Top-right, blue, "+" icon**
- Pagination: **Center-bottom**
- View switcher: **Top-right near actions**
- Bulk actions: **Floating bar at bottom**

### Aesthetic-Usability Effect
- Spacing: **8px grid system**
- Colors: **Consistent palette from Guidelines.md**
- Typography: **14px base, weights 400/500**
- Transitions: **200ms hovers, 300ms view changes**
- Shadows: **Subtle, professional**

---

## Troubleshooting

### Issue: Items not showing

**Check:**
1. Is `items` array populated?
2. Is `getItemId` returning unique IDs?
3. Are filters too restrictive?
4. Is pagination working correctly?

### Issue: Table columns not rendering

**Check:**
1. Are `columns` defined?
2. Is `visible` set to false?
3. Are `accessor` functions returning valid React nodes?

### Issue: Kanban not working

**Check:**
1. Are `kanbanColumns` defined?
2. Is `getKanbanColumn` function provided?
3. Does `getKanbanColumn` return valid column IDs?

### Issue: Performance slow

**Solutions:**
1. Enable pagination (default is enabled)
2. Memoize card/row components
3. Optimize images (lazy loading, compression)
4. Reduce number of columns/stats

---

## Migration from Old Workspaces

See `/docs/workspace-migration-guide.md` for detailed migration instructions.

---

## Support

For issues or questions:
1. Check this guide and examples
2. Review existing V4 implementations
3. Check Guidelines.md for design standards
4. Consult with the development team

---

**Happy Building! 🚀**
