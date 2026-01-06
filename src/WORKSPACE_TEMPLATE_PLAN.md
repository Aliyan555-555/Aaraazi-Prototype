# Workspace Pages Standardization - Comprehensive Plan
## Phase 5: Workspace Template System

**Version**: 1.0  
**Date**: December 27, 2024  
**Status**: Planning

---

## 📋 Executive Summary

This plan establishes a comprehensive **WorkspacePageTemplate** system to standardize all workspace/listing pages across the aaraazi platform, similar to the successful **DetailPageTemplate** system created in Phase 4. The goal is to create consistent, reusable patterns that follow UX laws, maintain the data-dense ERP design system, and provide module-specific flexibility.

### Current State Analysis

**✅ Already Completed (Phase 4):**
- `WorkspaceHeader` - Header with stats, actions, view modes
- `WorkspaceSearchBar` - Search with filters and sorting
- `WorkspaceEmptyState` - Empty states with presets
- Basic integration in: Properties, Cycles (Sell/Purchase/Rent), Requirements (Buy/Rent), Deals

**⚠️ Current Issues:**
1. **Inconsistent Data Display**: Different workspaces use different card layouts and table structures
2. **No Standardized View Modes**: Table/Grid/Kanban implementations vary across pages
3. **Inconsistent Actions**: Quick actions, bulk operations, and contextual menus differ
4. **Missing Patterns**: No standard for status indicators, progress tracking, relationship display
5. **UX Law Violations**: Some pages exceed Miller's Law limits, inconsistent Fitts's Law targeting
6. **No Template System**: Each workspace is built from scratch, leading to code duplication

---

## 🎯 Goals & Success Criteria

### Primary Goals
1. **Create WorkspacePageTemplate System** - Similar to DetailPageTemplate but for listing pages
2. **Standardize Data Display Patterns** - Consistent cards, tables, and grid layouts
3. **Implement All View Modes** - Table, Grid, Kanban with smooth transitions
4. **Enforce UX Laws** - All workspaces follow the 5 UX laws consistently
5. **Module-Specific Flexibility** - Templates adapt to Properties, Cycles, Deals, Requirements contexts
6. **Reduce Code by 50%+** - Like DetailPageTemplate achieved 60% reduction

### Success Criteria
- ✅ All 10+ workspace pages use the new template system
- ✅ Consistent look and feel matching detail pages V4 quality
- ✅ All UX laws implemented and documented
- ✅ Code reduction of 50%+ across workspace components
- ✅ Mobile-responsive and accessible (WCAG 2.1 AA)
- ✅ Performance optimized with React.memo and useMemo

---

## 🏗️ Architecture Overview

### Component Hierarchy

```
WorkspacePageTemplate (Main Container)
├── WorkspaceHeader (Already exists ✅)
├── WorkspaceSearchBar (Already exists ✅)
├── WorkspaceToolbar (NEW - Bulk actions, view switcher, filters toggle)
├── WorkspaceContent (NEW - Main content area)
│   ├── WorkspaceTableView (NEW - Standardized table)
│   ├── WorkspaceGridView (NEW - Standardized grid)
│   ├── WorkspaceKanbanView (NEW - Kanban board)
│   └── WorkspaceEmptyState (Already exists ✅)
└── WorkspaceFooter (NEW - Pagination, summary stats)
```

### Supporting Components

```
Data Display Components:
├── WorkspaceCard (NEW - Standardized card for grid view)
├── WorkspaceTableRow (NEW - Reusable table row)
├── WorkspaceKanbanCard (NEW - Kanban card)
├── BulkActionBar (NEW - Floating action bar for selected items)
└── QuickActionMenu (NEW - 3-dot menu for row actions)

Helper Components:
├── ViewModeSwitcher (NEW - Table/Grid/Kanban toggle)
├── FilterPanel (NEW - Advanced filter sidebar)
├── ColumnCustomizer (NEW - Table column visibility)
├── ExportMenu (NEW - Export options dropdown)
└── WorkspacePagination (NEW - Pagination with page size)
```

---

## 📐 UX Laws Implementation

### 1. Fitts's Law (Targeting)
**Implementation:**
- Primary action button: 44x44px minimum, top-right placement
- Row action buttons: 40x40px minimum
- Checkbox selection targets: 24x24px minimum
- Touch-friendly spacing: 12px minimum between interactive elements
- Hover states increase clickable area visually

**Components Affected:**
- WorkspaceHeader (primary action)
- WorkspaceCard (entire card clickable)
- WorkspaceTableRow (row clickable, actions right-aligned)
- BulkActionBar (large action buttons)

### 2. Miller's Law (Cognitive Load)
**Limits:**
- Stats in header: Max 5 metrics
- Quick filters: Max 7 filters
- Bulk actions: Max 5 visible actions (more in dropdown)
- Table columns: Max 7 default columns (customizable)
- Grid cards per row: 3-4 max (responsive)
- Kanban columns: Max 7 status columns

**Components Affected:**
- WorkspaceHeader (stats limit)
- WorkspaceSearchBar (filter limit)
- BulkActionBar (action limit)
- WorkspaceTableView (column limit)

### 3. Hick's Law (Decision Time)
**Implementation:**
- Progressive disclosure: Advanced filters in panel
- Primary vs secondary actions: Clear hierarchy
- Default view mode: Grid (familiar for properties/cycles)
- Contextual actions: Only show relevant actions per status
- Grouped actions: Related actions in dropdowns

**Components Affected:**
- WorkspaceToolbar (action hierarchy)
- QuickActionMenu (contextual actions)
- FilterPanel (progressive disclosure)
- ExportMenu (grouped export options)

### 4. Jakob's Law (Familiarity)
**Standards:**
- Search bar: Top-left, magnifying glass icon
- Add button: Top-right, "+" icon, blue/primary color
- Bulk actions: Floating bar at bottom when items selected
- Sort/Filter: Right side of search bar
- Pagination: Bottom-center
- View mode toggle: Top-right near actions

**Components Affected:**
- All workspace components follow familiar patterns
- Consistent with industry standards (Gmail, Linear, Notion)

### 5. Aesthetic-Usability Effect
**Design System:**
- Consistent spacing: 8px grid system
- Color palette: Matches detail pages (from Guidelines.md)
- Typography: 14px base, consistent weights (400, 500)
- Smooth transitions: 200ms for hovers, 300ms for view changes
- Professional appearance: Subtle shadows, clean borders
- Cohesive design: Matches DetailPageTemplate quality

**Components Affected:**
- All components use design system tokens
- Consistent styling across all workspaces

---

## 🧩 Template System Design

### WorkspacePageTemplate Component

```typescript
interface WorkspacePageTemplateProps<T> {
  // Header Configuration
  title: string;
  description?: string;
  icon?: React.ReactNode;
  stats?: Array<{
    label: string;
    value: number | string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    icon?: React.ReactNode;
  }>;
  
  // Actions
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
  
  // Data & Display
  items: T[];
  isLoading?: boolean;
  
  // View Configuration
  defaultView?: 'table' | 'grid' | 'kanban';
  availableViews?: Array<'table' | 'grid' | 'kanban'>;
  
  // Search & Filter
  searchPlaceholder?: string;
  quickFilters?: QuickFilter[];
  advancedFilters?: AdvancedFilter[];
  sortOptions?: SortOption[];
  
  // Render Functions (for flexibility)
  renderCard?: (item: T) => React.ReactNode;
  renderTableRow?: (item: T) => React.ReactNode;
  renderKanbanCard?: (item: T) => React.ReactNode;
  
  // Table Configuration
  columns?: Column<T>[];
  
  // Kanban Configuration
  kanbanColumns?: KanbanColumn[];
  getKanbanColumn?: (item: T) => string;
  
  // Callbacks
  onItemClick?: (item: T) => void;
  onBulkAction?: (action: string, items: T[]) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  
  // Pagination
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  
  // Empty States
  emptyStatePreset?: EmptyStatePreset;
  customEmptyState?: React.ReactNode;
}
```

### Supporting Interfaces

```typescript
interface QuickFilter {
  id: string;
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
}

interface Column<T> {
  id: string;
  label: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
}

interface KanbanColumn {
  id: string;
  label: string;
  color?: string;
  count?: number;
}

interface SortOption {
  value: string;
  label: string;
}
```

---

## 📊 Module-Specific Requirements

### 1. Properties Workspace

**Special Requirements:**
- Grid view as default (visual, image-heavy)
- Property type icons (House, Apartment, Commercial, Plot)
- Status badges (Available, Under Contract, Sold)
- Cycle indicators (Sell/Purchase/Rent active cycles)
- Price range filters
- Area/location filters

**Unique Components:**
- PropertyCard (with image, price, area, cycles count)
- PropertyTableRow (7 columns: Property, Status, Type, Price, Area, Cycles, Actions)

**Stats:**
1. Total Properties
2. Available
3. Under Contract
4. Sold
5. Total Value (PKR)

**Quick Actions:**
- Add Property
- Start Sell Cycle
- Start Purchase Cycle
- Start Rent Cycle
- Import/Export

### 2. Sell Cycles Workspace

**Special Requirements:**
- Table view as default (data-heavy)
- Stage progress indicators
- Offer counts
- Days on market
- Commission tracking
- Seller information

**Unique Components:**
- SellCycleCard (property info, seller, asking price, offers)
- SellCycleTableRow (8 columns: Property, Seller, Status, Asking Price, Best Offer, Offers, Days Listed, Actions)

**Stats:**
1. Total Cycles
2. Active
3. Under Negotiation
4. Closed
5. Total Commission (PKR)

**Quick Filters:**
- Status (active, negotiation, under-contract, closed)
- Price range
- Days listed
- Offer count

### 3. Purchase Cycles Workspace

**Special Requirements:**
- Similar to Sell Cycles but buyer perspective
- Budget tracking
- Offer status
- Seller information
- Purchase timeline

**Unique Components:**
- PurchaseCycleCard (property info, seller, offer amount, status)
- PurchaseCycleTableRow (8 columns: Property, Seller, Status, Offer Amount, Negotiated Price, Response, Days Active, Actions)

**Stats:**
1. Total Cycles
2. Active Offers
3. Accepted
4. Completed
5. Total Budget (PKR)

**Quick Filters:**
- Status (searching, offer-made, negotiation, accepted, completed)
- Budget range
- Days active
- Response status

### 4. Rent Cycles Workspace

**Special Requirements:**
- Lease duration display
- Monthly rent tracking
- Tenant information
- Renewal status
- Payment status

**Unique Components:**
- RentCycleCard (property info, tenant, monthly rent, lease term)
- RentCycleTableRow (8 columns: Property, Tenant, Status, Monthly Rent, Lease Start, Lease End, Payment, Actions)

**Stats:**
1. Total Rentals
2. Active Leases
3. Expiring Soon
4. Vacant
5. Monthly Revenue (PKR)

**Quick Filters:**
- Status (active, expiring-soon, expired, vacant)
- Rent range
- Lease duration
- Payment status

### 5. Deal Dashboard (Management)

**Special Requirements:**
- Kanban view option (by stage)
- Multi-stage progress
- Dual agent display
- Payment progress
- Timeline tracking
- Critical path highlighting

**Unique Components:**
- DealCard (property, parties, stage, payment progress)
- DealTableRow (9 columns: Deal #, Property, Buyer, Seller, Stage, Status, Agreed Price, Paid, Actions)
- DealKanbanCard (compact with stage info)

**Stats:**
1. Total Deals
2. Active
3. Pending Payment
4. Completed
5. Total Value (PKR)

**Kanban Columns:**
1. Offer Accepted
2. Agreement Signing
3. Documentation
4. Payment Processing
5. Transfer Registration
6. Final Handover
7. Completed

**Quick Filters:**
- Stage (6 stages)
- Status (active, completed, cancelled)
- Agent (primary/secondary)
- Payment status
- Date range

### 6. Buyer Requirements Workspace

**Special Requirements:**
- Match count indicators
- Budget vs market comparison
- Priority levels
- Contact frequency tracking
- Auto-matching status

**Unique Components:**
- BuyerRequirementCard (buyer info, criteria, matches, priority)
- BuyerRequirementTableRow (8 columns: Buyer, Property Type, Budget, Area, Location, Matches, Priority, Actions)

**Stats:**
1. Total Requirements
2. Active
3. Matched
4. Closed
5. Avg Budget (PKR)

**Quick Filters:**
- Priority (high, medium, low)
- Status (active, matched, closed)
- Property type
- Budget range
- Match count

### 7. Rent Requirements Workspace

**Special Requirements:**
- Similar to Buyer Requirements
- Monthly budget tracking
- Lease duration preferences
- Furnished/unfurnished filter

**Unique Components:**
- RentRequirementCard (tenant info, criteria, matches, priority)
- RentRequirementTableRow (8 columns: Tenant, Property Type, Monthly Budget, Duration, Location, Matches, Priority, Actions)

**Stats:**
1. Total Requirements
2. Active
3. Matched
4. Closed
5. Avg Monthly Budget (PKR)

**Quick Filters:**
- Priority (high, medium, low)
- Status (active, matched, closed)
- Property type
- Budget range
- Duration preference

---

## 🎨 Visual Design Standards

### Color System (from Guidelines.md)
```css
--color-primary: #030213 (Dark navy)
--color-secondary: #ececf0 (Light gray)
--color-muted: #ececf0 (Subtle backgrounds)
--color-accent: #e9ebef (Highlighted elements)
--color-background: #ffffff (Main background)
--color-destructive: #d4183d (Error/dangerous)

Status Colors:
--status-success: #10b981 (Available, Active, Completed)
--status-warning: #f59e0b (Negotiation, Pending)
--status-danger: #ef4444 (Cancelled, Expired)
--status-info: #3b82f6 (Under Contract, Processing)
--status-muted: #6b7280 (Sold, Closed)
```

### Spacing System (8px Grid)
```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
```

### Typography (from Guidelines.md)
```css
--font-size-base: 14px
--font-weight-normal: 400
--font-weight-medium: 500

Headers:
- Page title: text-2xl (24px) font-medium
- Section title: text-lg (18px) font-medium
- Card title: text-base (16px) font-medium
- Label: text-sm (14px) font-normal
- Helper text: text-xs (12px) text-gray-600
```

### Card Design
```css
Card Structure:
- Background: white
- Border: 1px solid #e5e7eb
- Border radius: 10px (rounded-lg)
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: shadow-md, border-gray-300
- Transition: 200ms ease

Grid Layout:
- Columns: 3-4 per row (responsive)
- Gap: 24px
- Min card height: 200px
- Max card width: 400px
```

### Table Design
```css
Table Structure:
- Background: white
- Border: 1px solid #e5e7eb
- Header background: #f9fafb
- Row hover: #f9fafb
- Row border: 1px solid #e5e7eb
- Cell padding: 16px 24px
- Header font: font-medium text-xs uppercase text-gray-600
- Sticky header: Yes
- Min column width: 120px
```

### Kanban Design
```css
Kanban Structure:
- Column background: #f9fafb
- Column border: 1px solid #e5e7eb
- Column width: 300px (fixed)
- Column gap: 16px
- Card margin: 12px
- Header padding: 16px
- Max columns visible: 7
- Horizontal scroll: Yes
- Drag & drop: Yes (future)
```

---

## 🚀 Implementation Phases

### Phase 5.1: Core Template Components (Week 1)
**Priority: Critical**

**Tasks:**
1. Create `WorkspacePageTemplate` main component
2. Create `WorkspaceToolbar` component
3. Create `WorkspaceContent` wrapper
4. Create `WorkspaceFooter` component
5. Create `ViewModeSwitcher` component
6. Document template props and usage

**Deliverables:**
- `/components/workspace/WorkspacePageTemplate.tsx`
- `/components/workspace/WorkspaceToolbar.tsx`
- `/components/workspace/WorkspaceContent.tsx`
- `/components/workspace/WorkspaceFooter.tsx`
- `/components/workspace/ViewModeSwitcher.tsx`
- Updated `/components/workspace/index.ts`

### Phase 5.2: View Components (Week 1)
**Priority: Critical**

**Tasks:**
1. Create `WorkspaceTableView` component
2. Create `WorkspaceGridView` component
3. Create `WorkspaceKanbanView` component
4. Create `WorkspacePagination` component
5. Implement view transitions/animations
6. Add accessibility support

**Deliverables:**
- `/components/workspace/views/WorkspaceTableView.tsx`
- `/components/workspace/views/WorkspaceGridView.tsx`
- `/components/workspace/views/WorkspaceKanbanView.tsx`
- `/components/workspace/WorkspacePagination.tsx`

### Phase 5.3: Data Display Components (Week 2)
**Priority: High**

**Tasks:**
1. Create `WorkspaceCard` base component
2. Create `WorkspaceTableRow` base component
3. Create `WorkspaceKanbanCard` base component
4. Create `BulkActionBar` component
5. Create `QuickActionMenu` component
6. Add hover states and transitions

**Deliverables:**
- `/components/workspace/cards/WorkspaceCard.tsx`
- `/components/workspace/tables/WorkspaceTableRow.tsx`
- `/components/workspace/kanban/WorkspaceKanbanCard.tsx`
- `/components/workspace/BulkActionBar.tsx`
- `/components/workspace/QuickActionMenu.tsx`

### Phase 5.4: Advanced Features (Week 2)
**Priority: Medium**

**Tasks:**
1. Create `FilterPanel` (advanced filters sidebar)
2. Create `ColumnCustomizer` (table column selection)
3. Create `ExportMenu` component
4. Implement bulk selection logic
5. Add keyboard shortcuts
6. Performance optimization

**Deliverables:**
- `/components/workspace/FilterPanel.tsx`
- `/components/workspace/ColumnCustomizer.tsx`
- `/components/workspace/ExportMenu.tsx`
- Updated keyboard shortcuts documentation

### Phase 5.5: Properties Workspace Migration (Week 3)
**Priority: High**

**Tasks:**
1. Create PropertyWorkspaceV4 using template
2. Create PropertyCard component
3. Create PropertyTableRow component
4. Migrate PropertyManagementV3 to V4
5. Add property-specific filters
6. Testing and refinement

**Deliverables:**
- `/components/PropertyWorkspaceV4.tsx`
- `/components/properties/PropertyWorkspaceCard.tsx`
- `/components/properties/PropertyWorkspaceTableRow.tsx`
- Deprecated `/components/PropertyManagementV3.tsx`

### Phase 5.6: Cycles Workspaces Migration (Week 3-4)
**Priority: High**

**Tasks:**
1. Create SellCyclesWorkspaceV4
2. Create PurchaseCyclesWorkspaceV4
3. Create RentCyclesWorkspaceV4
4. Create cycle-specific cards and rows
5. Add cycle-specific filters and stats
6. Testing and refinement

**Deliverables:**
- `/components/SellCyclesWorkspaceV4.tsx`
- `/components/PurchaseCyclesWorkspaceV4.tsx`
- `/components/RentCyclesWorkspaceV4.tsx`
- Cycle-specific components in `/components/cycles/`

### Phase 5.7: Deal Dashboard Migration (Week 4)
**Priority: High**

**Tasks:**
1. Create DealDashboardV4 with Kanban support
2. Create DealCard component
3. Create DealTableRow component
4. Create DealKanbanCard component
5. Add stage-based Kanban columns
6. Add dual-agent filtering
7. Testing and refinement

**Deliverables:**
- `/components/DealDashboardV4.tsx`
- `/components/deals/DealWorkspaceCard.tsx`
- `/components/deals/DealWorkspaceTableRow.tsx`
- `/components/deals/DealKanbanCard.tsx`

### Phase 5.8: Requirements Workspaces Migration (Week 4)
**Priority: Medium**

**Tasks:**
1. Create BuyerRequirementsWorkspaceV4
2. Create RentRequirementsWorkspaceV4
3. Create requirement-specific cards and rows
4. Add match count indicators
5. Add priority filters
6. Testing and refinement

**Deliverables:**
- `/components/BuyerRequirementsWorkspaceV4.tsx`
- `/components/RentRequirementsWorkspaceV4.tsx`
- Requirement-specific components in `/components/requirements/`

### Phase 5.9: Documentation & Guidelines (Week 5)
**Priority: High**

**Tasks:**
1. Create comprehensive template usage guide
2. Document all UX law implementations
3. Create migration guide for future workspaces
4. Add code examples and best practices
5. Update Guidelines.md
6. Create video walkthrough

**Deliverables:**
- `/docs/workspace-template-guide.md`
- `/docs/workspace-migration-guide.md`
- Updated `/Guidelines.md`
- Example implementations
- Video documentation

### Phase 5.10: Polish & Optimization (Week 5)
**Priority: Medium**

**Tasks:**
1. Performance audit all workspaces
2. Accessibility audit (WCAG 2.1 AA)
3. Mobile responsiveness testing
4. Cross-browser testing
5. Code cleanup and optimization
6. Final UX review

**Deliverables:**
- Performance report
- Accessibility report
- Bug fixes and optimizations
- Final sign-off

---

## 📏 Component Specifications

### WorkspacePageTemplate

**File**: `/components/workspace/WorkspacePageTemplate.tsx`

**Purpose**: Main container component that orchestrates all workspace page elements

**Key Features:**
- Manages view mode state (table/grid/kanban)
- Handles search and filter state
- Coordinates bulk selection
- Manages pagination
- Provides consistent layout structure

**Props**: See "Template System Design" section above

**Performance:**
- Memoized with React.memo
- Uses useCallback for event handlers
- Uses useMemo for filtered data
- Lazy loads heavy components

**Accessibility:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader announcements
- Focus management

### WorkspaceToolbar

**File**: `/components/workspace/WorkspaceToolbar.tsx`

**Purpose**: Action bar below search with bulk actions and view controls

**Layout:**
```
[Bulk Actions] [Selection Count]  |  [View Mode] [Filter Toggle] [Column Customizer]
```

**Features:**
- Bulk action buttons (max 5 visible, Hick's Law)
- Selection counter
- View mode switcher (Table/Grid/Kanban)
- Advanced filter toggle
- Column customizer (table view only)
- Sticky positioning on scroll

**Props:**
```typescript
interface WorkspaceToolbarProps {
  selectedCount: number;
  totalCount: number;
  bulkActions?: BulkAction[];
  viewMode: 'table' | 'grid' | 'kanban';
  onViewModeChange: (mode: 'table' | 'grid' | 'kanban') => void;
  showColumnCustomizer?: boolean;
  onToggleFilters?: () => void;
  onClearSelection?: () => void;
}
```

### WorkspaceCard

**File**: `/components/workspace/cards/WorkspaceCard.tsx`

**Purpose**: Base card component for grid view, extended by module-specific cards

**Structure:**
```tsx
<Card onClick={onItemClick} hoverable>
  <CardHeader>
    <Badge status={status} />
    <QuickActionMenu actions={actions} />
  </CardHeader>
  <CardContent>
    {children} {/* Module-specific content */}
  </CardContent>
  <CardFooter>
    {footerMetrics} {/* Key metrics */}
  </CardFooter>
</Card>
```

**Features:**
- Entire card clickable (Fitts's Law)
- 3-dot menu for quick actions
- Status badge (top-right)
- Hover state with elevation
- Checkbox for bulk selection
- Loading skeleton state

**Props:**
```typescript
interface WorkspaceCardProps {
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  actions?: QuickAction[];
  status?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}
```

### WorkspaceTableView

**File**: `/components/workspace/views/WorkspaceTableView.tsx`

**Purpose**: Standardized table view with sorting, column customization

**Features:**
- Sticky header on scroll
- Sortable columns
- Resizable columns
- Customizable column visibility
- Row selection (checkbox)
- Row hover with actions
- Responsive (horizontal scroll on mobile)
- Empty state integration
- Loading skeleton rows

**Props:**
```typescript
interface WorkspaceTableViewProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  selectedItems?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}
```

### WorkspaceKanbanView

**File**: `/components/workspace/views/WorkspaceKanbanView.tsx`

**Purpose**: Kanban board view for stage-based workflows (Deals)

**Features:**
- Horizontal scrolling columns
- Max 7 columns (Miller's Law)
- Drag & drop (future feature)
- Column headers with counts
- Card density options
- Collapsed column state
- Mobile: Stack columns vertically

**Props:**
```typescript
interface WorkspaceKanbanViewProps<T> {
  data: T[];
  columns: KanbanColumn[];
  getColumn: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  isLoading?: boolean;
}
```

### BulkActionBar

**File**: `/components/workspace/BulkActionBar.tsx`

**Purpose**: Floating action bar when items are selected

**Layout:**
```
[X items selected] [Action 1] [Action 2] [Action 3] [More ▼] [Clear Selection]
```

**Features:**
- Floating at bottom of viewport
- Sticky positioning
- Slide-up animation when items selected
- Max 5 visible actions (more in dropdown)
- Large action buttons (Fitts's Law)
- Mobile: Stack vertically

**Props:**
```typescript
interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}
```

---

## 📊 Data Flow & State Management

### State Architecture

```typescript
// Workspace State (in WorkspacePageTemplate)
interface WorkspaceState<T> {
  // Data
  items: T[];
  isLoading: boolean;
  
  // View
  viewMode: 'table' | 'grid' | 'kanban';
  
  // Search & Filter
  searchQuery: string;
  activeFilters: Map<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Selection
  selectedItems: Set<string>;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  
  // UI
  showFilterPanel: boolean;
  showColumnCustomizer: boolean;
}
```

### Performance Optimization

```typescript
// Memoized Filtering
const filteredItems = useMemo(() => {
  let result = items;
  
  // Search
  if (searchQuery) {
    result = result.filter(item => matchesSearch(item, searchQuery));
  }
  
  // Filters
  activeFilters.forEach((value, key) => {
    result = result.filter(item => matchesFilter(item, key, value));
  });
  
  // Sort
  result = sortItems(result, sortBy, sortOrder);
  
  return result;
}, [items, searchQuery, activeFilters, sortBy, sortOrder]);

// Memoized Pagination
const paginatedItems = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return filteredItems.slice(start, end);
}, [filteredItems, currentPage, pageSize]);
```

---

## 🔒 Accessibility Requirements

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- Tab: Navigate through interactive elements
- Enter/Space: Activate buttons, select items
- Arrow keys: Navigate table rows, kanban columns
- Escape: Close panels, deselect items
- Ctrl+A: Select all (in focused view)
- Delete: Bulk delete (with confirmation)

**Screen Readers:**
- ARIA labels on all buttons
- ARIA live regions for dynamic content
- ARIA expanded/collapsed for panels
- Role attributes (table, grid, listbox)
- Alt text for icons

**Color Contrast:**
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

**Focus Management:**
- Visible focus indicators (3px blue outline)
- Focus trap in modals
- Focus restoration after actions
- Skip links for large tables

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Large Desktop: > 1440px
```

### Responsive Behaviors

**Mobile (< 640px):**
- Grid: 1 column
- Table: Horizontal scroll or card-based list
- Kanban: Vertical stack
- Search bar: Full width
- Filters: Bottom sheet
- Actions: Floating action button

**Tablet (640px - 1024px):**
- Grid: 2 columns
- Table: 5-6 visible columns
- Kanban: 2-3 visible columns
- Search bar: Full width
- Filters: Side panel

**Desktop (> 1024px):**
- Grid: 3-4 columns
- Table: All columns
- Kanban: All columns (scroll if > 7)
- Search bar: Contained width
- Filters: Side panel

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Props validation
- State management
- Event handlers
- Utility functions

### Integration Tests
- Template with different configurations
- View mode switching
- Filter/search/sort combinations
- Bulk selection and actions
- Pagination

### Accessibility Tests
- Automated: axe-core, eslint-plugin-jsx-a11y
- Manual: Screen reader testing (NVDA, JAWS)
- Keyboard navigation testing
- Color contrast checking

### Performance Tests
- Large datasets (1000+ items)
- View switching speed
- Filter/search responsiveness
- Memory leaks
- Bundle size impact

### Visual Regression Tests
- Screenshot comparison
- Cross-browser testing
- Responsive layout testing

---

## 📈 Success Metrics

### Code Quality
- Code reduction: 50%+ vs current implementations
- Component reusability: 80%+ across workspaces
- TypeScript coverage: 100%
- Test coverage: 80%+

### Performance
- Initial render: < 500ms
- View switch: < 300ms
- Filter/search: < 200ms
- Smooth 60fps scrolling

### UX Quality
- All UX laws implemented
- WCAG 2.1 AA compliant
- Mobile-friendly
- Consistent with detail pages

### Developer Experience
- Clear documentation
- Easy to extend
- Type-safe
- Good error messages

---

## 🚧 Migration Strategy

### Backward Compatibility
1. Keep old workspace components until migration complete
2. Suffix new components with "V4"
3. Update routes progressively
4. A/B test with feature flags (optional)

### Migration Checklist per Workspace
- [ ] Create V4 component using template
- [ ] Create module-specific cards/rows
- [ ] Migrate data fetching logic
- [ ] Migrate filters and stats
- [ ] Update routing
- [ ] Test all functionality
- [ ] Update navigation links
- [ ] Deprecate old component

### Rollback Plan
- Keep old components for 2 sprints
- Easy to revert route changes
- Document known issues
- User feedback mechanism

---

## 🔮 Future Enhancements

### Phase 6 (Future)
1. **Drag & Drop**: Kanban card reordering
2. **Saved Views**: User-customizable view presets
3. **Advanced Export**: PDF reports, custom templates
4. **Real-time Updates**: WebSocket for live data
5. **Collaborative Features**: Shared filters, annotations
6. **AI Features**: Smart filters, predictive sorting
7. **Mobile App**: Native mobile views
8. **Offline Mode**: PWA with local caching

---

## 📚 References

### Internal Documents
- `Guidelines.md` - Development standards
- Detail page V4 implementations
- Phase 4 workspace components
- aaraazi type definitions

### External Resources
- [Fitts's Law](https://lawsofux.com/fittss-law/)
- [Miller's Law](https://lawsofux.com/millers-law/)
- [Hick's Law](https://lawsofux.com/hicks-law/)
- [Jakob's Law](https://lawsofux.com/jakobs-law/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)

---

## ✅ Approval & Sign-off

**Prepared by**: AI Assistant  
**Date**: December 27, 2024  
**Status**: Awaiting Review

**Review Checklist:**
- [ ] Architecture approved
- [ ] UX laws implementation approved
- [ ] Module requirements validated
- [ ] Timeline feasible
- [ ] Resources allocated
- [ ] Dependencies identified

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 5.1 implementation
3. Create component skeletons
4. Start with Properties workspace migration
5. Iterate based on feedback

---

**End of Plan Document**
