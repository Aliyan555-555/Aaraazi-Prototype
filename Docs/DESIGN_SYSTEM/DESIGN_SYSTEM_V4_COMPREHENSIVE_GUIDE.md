# aaraazi Design System V4 - Comprehensive Guide

**Version**: 4.1.0  
**Last Updated**: December 27, 2024  
**Status**: Official Standard - Flexible & Extensible ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Flexibility & Extensibility](#flexibility--extensibility)
4. [UX Laws Implementation](#ux-laws-implementation)
5. [Component Systems](#component-systems)
6. [Design Tokens](#design-tokens)
7. [Usage Guidelines](#usage-guidelines)
8. [Quality Checklist](#quality-checklist)
9. [Migration Strategy](#migration-strategy)

---

## Overview

### What is Design System V4?

Design System V4 is the official design standard for aaraazi, established in December 2024. It is a **flexible, extensible, and context-aware** system that provides:

**Core Template Systems**:
1. **Details V4** - Detail page template system
2. **Workspace V4** - List/grid/kanban workspace system
3. **Form V2** - Form template system

**Extensibility**:
- **New templates can be created** when existing ones don't fit the context
- **Context-appropriate solutions** for unique challenges
- **Adaptive patterns** that evolve with your needs

### Why V4?

- ✅ **Consistency** - Same look & feel across all modules
- ✅ **Efficiency** - Faster development with reusable templates
- ✅ **Quality** - Built-in UX best practices and accessibility
- ✅ **Maintainability** - Centralized updates affect all pages
- ✅ **User Experience** - Proven patterns users understand
- ✅ **Flexibility** - Adapts to new challenges and contexts
- ✅ **Extensibility** - Grows with your application needs

### Core Philosophy

> "Every page should feel familiar, every interaction should be predictable, every component should be accessible. **But when unique contexts demand unique solutions, the system should flex to support them.**"

### Design System Mindset

**Consistency ≠ Rigidity**

The design system provides:
- **Strong defaults** for 90% of use cases (use the core templates)
- **Flexibility** for the 10% that need something different (extend or create new templates)
- **Guidance** on when to follow patterns vs when to innovate
- **Quality standards** that apply to all components, old and new

---

## Design Principles

### 1. Consistency First (But Context Matters)

**Rule**: If a component exists AND fits your context, use it. If it doesn't fit, adapt or extend.

```tsx
// ❌ BAD - Creating custom header when PageHeader fits
<div className="flex justify-between items-center p-4">
  <h1>{title}</h1>
  <button>Action</button>
</div>

// ✅ GOOD - Using PageHeader (90% of cases)
<PageHeader
  title={title}
  primaryActions={[{ label: 'Action', onClick: handleAction }]}
/>

// ✅ ALSO GOOD - Extending when context requires it
<PageHeader
  title={title}
  customContent={<SpecialContextualWidget />}
  primaryActions={actions}
/>

// ✅ ACCEPTABLE - New component when truly unique context
<DashboardHeader 
  widgets={dashboardWidgets}
  liveUpdates={true}
  customLayout="grid"
/>
// ^ New template justified: Dashboard has unique requirements
```

**When to Reuse vs Create New**:
- ✅ Reuse: Component does 80%+ of what you need → Use it and extend
- ⚠️ Extend: Component does 50-80% of what you need → Extend with props
- 🆕 Create: Component does <50% of what you need → Create new, document why

### 2. Template-First Approach (Start Here, Then Adapt)

**Rule**: Always start with a template. If it doesn't fit, understand why before building new.

```tsx
// ❌ BAD - Building from scratch without considering templates
export const PropertyDetails = () => {
  return (
    <div className="container">
      <div className="header">...</div>
      <div className="content">...</div>
    </div>
  );
};

// ✅ GOOD - Using DetailPageTemplate (standard case)
export const PropertyDetailsV4 = () => {
  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      tabs={tabs}
      connectedEntities={entities}
    />
  );
};

// ✅ ALSO GOOD - New template when context demands it
export const FinancialDashboardTemplate = () => {
  // New template for financial dashboard context
  // Documented why DetailPageTemplate doesn't fit
  return (
    <div className="dashboard-layout">
      <DashboardHeader widgets={widgets} />
      <LiveMetricsPanel />
      <MultiChartGrid charts={charts} />
    </div>
  );
};
```

**Template Decision Tree**:
1. Does **DetailPageTemplate** fit? → Use it
2. Does **WorkspaceTemplate** fit? → Use it
3. Does **FormTemplate** fit? → Use it
4. Can you **extend** one of these? → Extend it
5. Does an **existing custom template** fit? → Use it
6. Need **new template**? → Create it (with documentation)

### 3. Data-Dense But Readable

**Rule**: Show all important information, but organize it clearly.

```tsx
// ✅ Use InfoPanel for dense data
<InfoPanel
  title="Property Details"
  data={[
    { label: 'Price', value: formatPKR(price) },
    { label: 'Area', value: `${area} sq yd` },
    // ... up to 10 fields
  ]}
  columns={2}
  density="comfortable"
/>
```

### 4. Progressive Disclosure

**Rule**: Show essentials first, details on demand.

```tsx
// ✅ Primary actions prominent, secondary in dropdown
<PageHeader
  primaryActions={[
    { label: 'Add Property', onClick: handleAdd }, // Max 3
  ]}
  secondaryActions={[
    { label: 'Export' },
    { label: 'Import' },
    { label: 'Settings' },
    // ... more actions in dropdown
  ]}
/>
```

### 5. Accessibility by Default

**Rule**: Every component must be keyboard-navigable and screen-reader friendly.

```tsx
// ✅ All interactive elements have ARIA labels
<Button
  onClick={handleAction}
  aria-label="Add new property"
>
  <Plus className="h-4 w-4" />
  <span className="sr-only">Add Property</span>
</Button>
```

---

## Flexibility & Extensibility

### Philosophy: Consistent yet Adaptive

The design system is **not a straightjacket**. It's a **foundation** that provides:

1. **Strong defaults** for common scenarios (90% of cases)
2. **Extension mechanisms** for unique requirements (8% of cases)
3. **Freedom to innovate** when truly necessary (2% of cases)

**Key Principle**: Consistency enables users to work efficiently. Flexibility enables the system to grow.

### When to Extend or Create New Templates

#### Decision Framework

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Can existing template handle this with minor tweaks?   │
│  ├─ YES → Use existing template, add props if needed            │
│  └─ NO  → Continue to Step 2                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Can you extend existing template with custom content?  │
│  ├─ YES → Extend template with customContent slots              │
│  └─ NO  → Continue to Step 3                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Does this represent a NEW pattern that will be used    │
│         multiple times across the application?                   │
│  ├─ YES → Create new template, document pattern                 │
│  └─ NO  → Continue to Step 4                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Is this a one-off unique page?                         │
│  ├─ YES → Build custom (but follow design tokens & UX Laws)     │
│  └─ NO  → Re-evaluate Steps 1-3                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Example Scenarios

**Scenario 1: Minor Extension (Use Existing)**
```tsx
// Context: Property details needs a special "Virtual Tour" button
// Solution: Extend primaryActions

<DetailPageTemplate
  pageHeader={{
    ...pageHeader,
    primaryActions: [
      ...standardActions,
      { 
        label: 'Virtual Tour', 
        icon: <Camera />, 
        onClick: handleVirtualTour,
        variant: 'secondary' 
      }
    ]
  }}
  // ... rest of config
/>
```

**Scenario 2: Moderate Extension (Custom Content)**
```tsx
// Context: Deal details needs real-time price negotiation widget
// Solution: Use customContent slot

<DetailPageTemplate
  pageHeader={pageHeader}
  tabs={tabs}
  customContent={
    <div className="border-t border-muted">
      <LiveNegotiationPanel dealId={deal.id} />
    </div>
  }
/>
```

**Scenario 3: New Template (Repeatable Pattern)**
```tsx
/**
 * DashboardTemplate - New template for dashboard pages
 * 
 * WHY NEW TEMPLATE?
 * - Dashboards need real-time data updates
 * - Multi-widget grid layout (not tab-based like DetailPageTemplate)
 * - Different information hierarchy (metrics-first, not entity-first)
 * - Will be used for: Main Dashboard, Sales Dashboard, Analytics Dashboard
 * 
 * WHEN TO USE:
 * - Page shows overview of multiple entity types
 * - Real-time data updates required
 * - Widget-based layout needed
 * - No single entity focus
 */
export const DashboardTemplate = ({ 
  widgets, 
  filters, 
  refreshInterval 
}: DashboardTemplateProps) => {
  return (
    <div className="dashboard-container">
      <DashboardHeader filters={filters} refreshInterval={refreshInterval} />
      <WidgetGrid widgets={widgets} />
      <LiveDataProvider />
    </div>
  );
};
```

**Scenario 4: One-Off Custom (Unique Context)**
```tsx
/**
 * PropertyComparisonView - Custom one-off page
 * 
 * WHY CUSTOM?
 * - Unique side-by-side comparison layout (not standard detail view)
 * - Only used in this one location
 * - Doesn't fit any template pattern
 * 
 * STILL FOLLOWS:
 * - Design tokens (colors, spacing, typography)
 * - UX Laws (max 5 comparison metrics visible)
 * - Accessibility standards
 * - Component reuse (uses InfoPanel, MetricCard, etc.)
 */
export const PropertyComparisonView = ({ properties }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {properties.map(property => (
        <div key={property.id} className="space-y-4">
          <InfoPanel data={property.details} />
          <MetricCardsGroup metrics={property.metrics} />
        </div>
      ))}
    </div>
  );
};
```

### Extending Existing Templates

#### Adding Custom Props

```tsx
// Example: Extend PageHeader to support custom toolbar
interface PageHeaderProps {
  // ... existing props
  customToolbar?: React.ReactNode; // New prop for extension
  showLiveIndicator?: boolean;     // New prop for real-time features
}

// Usage
<PageHeader
  title="Live Property Auction"
  customToolbar={<AuctionTimer endTime={auction.endTime} />}
  showLiveIndicator={true}
  // ... other props
/>
```

#### Using Custom Content Slots

```tsx
// Example: DetailPageTemplate with custom content slots
<DetailPageTemplate
  pageHeader={pageHeader}
  
  // Custom content above tabs
  beforeTabs={<ImportantNotice />}
  
  // Custom content in specific tab
  tabs={[
    {
      id: 'overview',
      content: (
        <>
          <StandardOverview />
          <CustomAnalyticsWidget />
        </>
      )
    }
  ]}
  
  // Custom content after tabs
  afterTabs={<RelatedRecommendations />}
/>
```

### Creating New Templates

#### Template Creation Checklist

When creating a new template, ensure:

**1. Documentation**
- [ ] Clear JSDoc explaining why new template is needed
- [ ] Document when to use this template vs existing ones
- [ ] Provide usage examples
- [ ] List similar pages that will use this template

**2. Design System Compliance**
- [ ] Uses design tokens (colors, spacing, typography)
- [ ] Follows 5 UX Laws
- [ ] Reuses existing components where possible
- [ ] Maintains accessibility standards
- [ ] Follows naming conventions (TemplateNameTemplate.tsx)

**3. Reusability**
- [ ] Parameterized (not hardcoded for one use case)
- [ ] Flexible props for different contexts
- [ ] Composable with existing components
- [ ] Will be used in at least 2-3 places

**4. Quality**
- [ ] TypeScript interfaces for all props
- [ ] Responsive design
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Performance optimized

#### New Template Example Structure

```tsx
/**
 * ReportTemplate - Template for report pages
 * 
 * PURPOSE:
 * Standardized layout for generating and viewing reports across the application.
 * 
 * WHY NEW TEMPLATE?
 * - Reports have unique structure (filters → generate → view results)
 * - Different from detail pages (no single entity focus)
 * - Different from workspaces (no CRUD operations)
 * - Will be used for: Sales Reports, Financial Reports, Activity Reports
 * 
 * WHEN TO USE:
 * - Page purpose is to generate and view reports
 * - Needs filter configuration section
 * - Needs report generation action
 * - Displays tabular or chart data
 * - Export functionality required
 * 
 * FOLLOWS:
 * - UX Laws: Max 7 filter options (Miller), 44px Generate button (Fitts)
 * - Design Tokens: 8px grid, standard colors
 * - Accessibility: Keyboard shortcuts, ARIA labels
 * 
 * @example
 * <ReportTemplate
 *   reportType="sales"
 *   filters={filterConfig}
 *   onGenerate={handleGenerate}
 *   exportOptions={['PDF', 'Excel', 'CSV']}
 * />
 */

import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { FilterPanel } from './FilterPanel';
import { ReportViewer } from './ReportViewer';

interface ReportTemplateProps {
  reportType: string;
  reportTitle: string;
  filters: FilterConfig[];
  onGenerate: (filters: FilterValues) => Promise<ReportData>;
  exportOptions?: ExportFormat[];
  refreshInterval?: number;
  customActions?: Action[];
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({
  reportType,
  reportTitle,
  filters,
  onGenerate,
  exportOptions = ['PDF', 'Excel'],
  refreshInterval,
  customActions,
}) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (filterValues: FilterValues) => {
    setIsGenerating(true);
    try {
      const data = await onGenerate(filterValues);
      setReportData(data);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - follows PageHeader pattern */}
      <ReportHeader
        title={reportTitle}
        exportOptions={exportOptions}
        customActions={customActions}
        onExport={handleExport}
      />

      <div className="p-6 space-y-6">
        {/* Filter Panel - max 7 filters (Miller's Law) */}
        <FilterPanel
          filters={filters}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Report Viewer */}
        {reportData ? (
          <ReportViewer data={reportData} />
        ) : (
          <EmptyState
            title="No Report Generated"
            description="Configure filters above and click Generate to view report"
          />
        )}
      </div>
    </div>
  );
};
```

### Context-Appropriate Solutions

#### Understanding Context

**Context** = The specific requirements, constraints, and goals of a particular feature or module.

**Context-Appropriate** = Choosing the right solution for the specific context, not forcing a one-size-fits-all approach.

#### Examples of Context-Appropriate Decisions

**Example 1: Financial Dashboard**

**Context**:
- Real-time data updates every 5 seconds
- Multiple data visualizations (charts, graphs, tables)
- Widget-based layout (drag-and-drop in future)
- Overview of financial health, not single entity

**Context-Appropriate Solution**:
```tsx
// Don't force DetailPageTemplate (wrong context)
// Create DashboardTemplate (right context)

<DashboardTemplate
  refreshInterval={5000}
  widgets={[
    { type: 'revenue-chart', config: {...} },
    { type: 'expense-table', config: {...} },
    { type: 'profit-metric', config: {...} },
  ]}
  layout="responsive-grid"
/>
```

**Example 2: Document Viewer**

**Context**:
- Full-screen document viewing
- Annotation capabilities
- Version comparison
- Unique to document module

**Context-Appropriate Solution**:
```tsx
// Don't use DetailPageTemplate (not entity-focused)
// Create custom DocumentViewer (unique context)

<DocumentViewerLayout
  document={document}
  annotations={annotations}
  comparisonVersion={previousVersion}
  fullscreen={true}
/>
```

**Example 3: Kanban Board**

**Context**:
- Drag-and-drop cards between columns
- Real-time updates from multiple users
- Different from table/grid workspace views
- Used for deal pipeline, task management

**Context-Appropriate Solution**:
```tsx
// WorkspaceTemplate supports kanban, but extend it
// for real-time collaboration features

<WorkspaceTemplate
  viewMode="kanban"
  renderKanban={(data) => (
    <CollaborativeKanbanBoard
      data={data}
      onDragEnd={handleDragEnd}
      realtimeUpdates={true}
      showUserAvatars={true}
    />
  )}
  // ... other props
/>
```

### Template Registry

**Maintain a registry of all templates to avoid duplication:**

```tsx
// /components/templates/index.ts

/**
 * Template Registry - All available templates
 * 
 * Before creating a new template, check if one exists here.
 * If creating new, add to this registry.
 */

export const TEMPLATE_REGISTRY = {
  // Core Templates (Use for 90% of cases)
  detail: {
    name: 'DetailPageTemplate',
    path: '/components/layout/DetailPageTemplate.tsx',
    useCase: 'Single entity detail pages',
    examples: ['PropertyDetailsV4', 'BuyerRequirementDetailsV4'],
  },
  
  workspace: {
    name: 'WorkspaceTemplate',
    path: '/components/workspace/WorkspaceTemplate.tsx',
    useCase: 'List/grid/kanban of multiple entities',
    examples: ['PropertiesWorkspaceV4', 'BuyerRequirementsWorkspaceV4'],
  },
  
  form: {
    name: 'FormTemplate',
    path: '/components/forms/FormTemplate.tsx',
    useCase: 'Create/edit forms',
    examples: ['AddPropertyFormV2', 'EditBuyerRequirementFormV2'],
  },
  
  // Extended Templates (Context-specific)
  dashboard: {
    name: 'DashboardTemplate',
    path: '/components/templates/DashboardTemplate.tsx',
    useCase: 'Widget-based dashboards with real-time data',
    examples: ['MainDashboard', 'SalesDashboard', 'FinancialDashboard'],
    created: '2024-12-27',
    reason: 'Dashboards need real-time updates and widget grid layout',
  },
  
  report: {
    name: 'ReportTemplate',
    path: '/components/templates/ReportTemplate.tsx',
    useCase: 'Report generation and viewing',
    examples: ['SalesReport', 'FinancialReport'],
    created: '2024-12-27',
    reason: 'Reports need filter → generate → view flow',
  },
  
  // Add new templates here with documentation
};
```

### Flexibility Guidelines Summary

**DO**:
- ✅ Start with existing templates
- ✅ Extend when context requires minor changes
- ✅ Create new templates for repeatable patterns
- ✅ Document why new templates are needed
- ✅ Follow design tokens and UX Laws always
- ✅ Reuse existing components
- ✅ Consider context-appropriate solutions

**DON'T**:
- ❌ Build from scratch without checking templates
- ❌ Force-fit templates to wrong contexts
- ❌ Create new templates for one-off pages
- ❌ Ignore design system standards
- ❌ Recreate existing components
- ❌ Skip documentation for new templates

**REMEMBER**:
> "The design system provides the foundation. Your judgment provides the context. Together, they create the right solution."

---

## UX Laws Implementation

### Law 1: Fitts's Law (Targeting)

**Principle**: The time to acquire a target is a function of distance and size.

**Implementation**:
- ✅ Primary action buttons: Minimum 44x44px
- ✅ Optimal placement: Top-right for primary actions
- ✅ Large click targets for important actions
- ✅ Small targets only for non-critical actions

```tsx
// ✅ Large primary button (Fitts's Law)
<Button size="lg" className="min-w-[120px] min-h-[44px]">
  Add Property
</Button>

// ✅ Smaller secondary actions (less critical)
<Button variant="ghost" size="sm">
  Export
</Button>
```

### Law 2: Miller's Law (Cognitive Load)

**Principle**: The average person can only keep 7±2 items in working memory.

**Implementation**:
- ✅ Max 5 metrics in PageHeader
- ✅ Max 7 quick filters
- ✅ Max 5 stats in SummaryStatsPanel
- ✅ Max 5 entities in ConnectedEntitiesBar
- ✅ Group related items together

```tsx
// ✅ Limited to 5 metrics (Miller's Law)
<PageHeader
  metrics={[
    { label: 'Price', value: formatPKR(price) },
    { label: 'Area', value: area },
    { label: 'Bedrooms', value: bedrooms },
    { label: 'Status', value: status },
    { label: 'Agent', value: agentName },
    // Max 5 metrics
  ]}
/>
```

### Law 3: Hick's Law (Decision Time)

**Principle**: The time it takes to make a decision increases with the number of choices.

**Implementation**:
- ✅ Max 3 primary actions (reduce decision time)
- ✅ Secondary actions in dropdown (progressive disclosure)
- ✅ Filters in popover (not all visible at once)
- ✅ Quick filters limited to 7 most common

```tsx
// ✅ Limited primary choices (Hick's Law)
<WorkspaceHeader
  primaryAction={{
    label: 'Add Property',
    onClick: handleAdd,
  }}
  secondaryActions={[
    // Many secondary actions hidden in dropdown
    { label: 'Export to CSV' },
    { label: 'Import from Excel' },
    { label: 'Bulk Edit' },
    { label: 'Archive Selected' },
  ]}
/>
```

### Law 4: Jakob's Law (Familiarity)

**Principle**: Users spend most of their time on other sites, so they prefer your site to work the same way.

**Implementation**:
- ✅ Breadcrumbs in expected location (top-left)
- ✅ Primary actions in expected location (top-right)
- ✅ Search bar at top of listings
- ✅ Tabs below header
- ✅ Filters on left or top

```tsx
// ✅ Standard patterns (Jakob's Law)
<PageHeader
  breadcrumbs={[
    { label: 'Properties', onClick: onBack },
    { label: property.title },
  ]}
  // Breadcrumbs always top-left
/>
```

### Law 5: Aesthetic-Usability Effect

**Principle**: Users often perceive aesthetically pleasing designs as more usable.

**Implementation**:
- ✅ Consistent 8px grid spacing
- ✅ Professional color palette
- ✅ Smooth transitions (200ms)
- ✅ Proper shadows and borders
- ✅ Cohesive design language

```tsx
// ✅ 8px grid system (Aesthetic-Usability)
<div className="space-y-6"> {/* 24px = 8px × 3 */}
  <div className="p-6"> {/* 24px padding */}
    <div className="gap-4"> {/* 16px = 8px × 2 */}
      {/* Content */}
    </div>
  </div>
</div>
```

---

## Component Systems

### System 1: Details V4 (Detail Pages)

**When to use**: Any page showing full details of a single entity.

**Components**:
- `DetailPageTemplate` - Main template
- `PageHeader` - Top header with breadcrumbs, metrics, actions
- `ConnectedEntitiesBar` - Related entities navigation
- `InfoPanel` - Grouped data fields
- `MetricCardsGroup` - Key metrics cards
- `ContactCard` - Contact information
- `QuickActionsPanel` - Sidebar actions
- `ActivityTimeline` - Activity history
- `NotesPanel` - Notes section
- `StatusTimeline` - Status progression

**File Structure**:
```
/components/
  /layout/
    DetailPageTemplate.tsx (Main template)
    PageHeader.tsx
    ConnectedEntitiesBar.tsx
    MetricCardsGroup.tsx
    QuickActionsPanel.tsx
    SummaryStatsPanel.tsx
    ActivityTimeline.tsx
    ContactCard.tsx
    NotesPanel.tsx
  /ui/
    InfoPanel.tsx
    StatusTimeline.tsx
    StatusBadge.tsx
```

**Usage Example**:
```tsx
import { DetailPageTemplate } from './layout';

export const PropertyDetailsV4 = ({ property, user, onBack }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: overviewContent,
      sidebar: overviewSidebar,
      layout: '2-1',
    },
    // More tabs...
  ];

  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      connectedEntities={entities}
      tabs={tabs}
      defaultTab="overview"
    />
  );
};
```

### System 2: Workspace V4 (List/Grid Pages)

**When to use**: Any page showing a list, grid, or kanban view of multiple entities.

**Components**:
- `WorkspaceTemplate` - Main template
- `WorkspaceHeader` - Top header with stats, actions, view switcher
- `WorkspaceSearchBar` - Search and filters
- `WorkspaceEmptyState` - Empty states
- `WorkspaceTabs` - Tab navigation
- `EntityCard` - Card for grid view
- `EntityTableRow` - Row for table view
- `KanbanBoard` - Kanban view

**File Structure**:
```
/components/
  /workspace/
    WorkspaceTemplate.tsx (Main template)
    WorkspaceHeader.tsx
    WorkspaceSearchBar.tsx
    WorkspaceEmptyState.tsx
    WorkspaceTabs.tsx
    ViewModeToggle.tsx
  /ui/
    entity-card.tsx
    data-table.tsx
```

**Usage Example**:
```tsx
import { WorkspaceTemplate } from './workspace/WorkspaceTemplate';

export const PropertiesWorkspaceV4 = ({ user }) => {
  return (
    <WorkspaceTemplate
      header={{
        title: 'Properties',
        stats: stats,
        primaryAction: { label: 'Add Property', onClick: handleAdd },
      }}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        quickFilters: filters,
      }}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      data={properties}
      renderCard={(property) => <PropertyCard {...property} />}
      renderRow={(property) => <PropertyRow {...property} />}
      emptyState={EmptyStatePresets.properties(handleAdd)}
    />
  );
};
```

### System 3: Form V2 (Forms & Modals)

**When to use**: Any form for creating or editing entities.

**Components**:
- `FormTemplate` - Main form template
- `FormSection` - Grouped form fields
- `FormField` - Individual field wrapper
- `FormActions` - Form buttons (Save, Cancel)

**File Structure**:
```
/components/
  /forms/
    FormTemplate.tsx
    FormSection.tsx
    FormField.tsx
    FormActions.tsx
```

**Usage Example**:
```tsx
import { FormTemplate } from './forms/FormTemplate';

export const AddPropertyFormV2 = ({ onClose, onSave }) => {
  return (
    <FormTemplate
      title="Add New Property"
      description="Enter property details below"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sections={[
        {
          title: 'Basic Information',
          fields: [
            { name: 'title', label: 'Property Title', type: 'text' },
            { name: 'price', label: 'Price', type: 'currency' },
          ],
        },
      ]}
    />
  );
};
```

---

## Design Tokens

### Colors

Defined in `/styles/globals.css`:

```css
/* Primary Colors */
--color-primary: #030213; /* Dark navy */
--color-secondary: #ececf0; /* Light gray */
--color-muted: #ececf0; /* Muted gray */
--color-accent: #e9ebef; /* Accent gray */
--color-background: #ffffff; /* White */
--color-destructive: #d4183d; /* Red */

/* Usage in components */
```

```tsx
// ✅ Use CSS variables
<div className="bg-primary text-white" />
<div className="bg-secondary" />
<div className="border-muted" />
```

### Typography

**IMPORTANT**: Never use Tailwind typography classes unless explicitly overriding.

```tsx
// ❌ BAD - Don't use Tailwind typography
<h1 className="text-2xl font-bold">Title</h1>

// ✅ GOOD - Let CSS handle it
<h1>Title</h1>

// ✅ EXCEPTION - Only when explicitly needed
<p className="text-sm">Small text override</p>
```

**Defaults (from globals.css)**:
- Base font size: 14px
- Font weights: 400 (normal), 500 (medium)
- Line heights: Automatic based on element

### Spacing (8px Grid)

All spacing must be multiples of 8px:

```tsx
// ✅ GOOD - 8px grid
className="p-2"   // 8px
className="p-4"   // 16px
className="p-6"   // 24px
className="p-8"   // 32px
className="gap-4" // 16px gap
className="space-y-6" // 24px vertical spacing

// ❌ BAD - Non-grid values
className="p-3"   // 12px - not on grid
className="gap-5" // 20px - not on grid
```

**Standard Spacing Scale**:
- `2` = 8px (tight)
- `4` = 16px (normal)
- `6` = 24px (comfortable)
- `8` = 32px (spacious)
- `12` = 48px (section breaks)

### Border Radius

```tsx
// Standard border radius
className="rounded-lg" // 10px - default for most UI

// Alternatives
className="rounded-md" // 6px - smaller elements
className="rounded-xl" // 12px - large cards
className="rounded-full" // Pills/avatars
```

### Shadows

```tsx
// Card shadows
className="shadow-sm"  // Subtle
className="shadow-md"  // Standard
className="shadow-lg"  // Elevated

// Hover states
className="hover:shadow-lg transition-shadow"
```

---

## Usage Guidelines

### When Creating a New Detail Page

**Checklist**:
- [ ] Use `DetailPageTemplate`
- [ ] Create `PageHeader` with breadcrumbs, metrics, actions
- [ ] Add `ConnectedEntitiesBar` if there are related entities
- [ ] Use `InfoPanel` for grouped data fields
- [ ] Create tabs for different sections
- [ ] Use 2-1 layout for overview tab (content + sidebar)
- [ ] Add `QuickActionsPanel` in sidebar
- [ ] Add `ActivityTimeline` if entity has history
- [ ] Follow 5 UX Laws (max 5 metrics, max 3 primary actions, etc.)
- [ ] Add accessibility attributes (ARIA labels, keyboard navigation)
- [ ] Test responsive behavior

**Template**:
```tsx
export const EntityDetailsV4 = ({ entity, user, onBack }) => {
  // 1. Define page header
  const pageHeader = {
    title: entity.name,
    breadcrumbs: [
      { label: 'Entities', onClick: onBack },
      { label: entity.name },
    ],
    metrics: [
      { label: 'Metric 1', value: value1 },
      // Max 5 metrics
    ],
    primaryActions: [
      { label: 'Primary Action', onClick: handleAction },
      // Max 3 primary actions
    ],
    onBack,
  };

  // 2. Define connected entities
  const connectedEntities = [
    { type: 'user', name: entity.userName, onClick: () => {} },
    // Max 5 entities
  ];

  // 3. Define tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: overviewContent,
      sidebar: overviewSidebar,
      layout: '2-1',
    },
    // More tabs...
  ];

  // 4. Render
  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      connectedEntities={connectedEntities}
      tabs={tabs}
      defaultTab="overview"
    />
  );
};
```

### When Creating a New Workspace Page

**Checklist**:
- [ ] Use `WorkspaceTemplate`
- [ ] Create `WorkspaceHeader` with stats and actions
- [ ] Add `WorkspaceSearchBar` with filters
- [ ] Implement view mode switching (grid/table/kanban)
- [ ] Use `WorkspaceEmptyState` for empty states
- [ ] Follow 5 UX Laws (max 5 stats, max 7 filters, etc.)
- [ ] Implement search debouncing (300ms)
- [ ] Add loading states
- [ ] Test responsive behavior
- [ ] Add keyboard shortcuts (optional)

**Template**:
```tsx
export const EntitiesWorkspaceV4 = ({ user }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <WorkspaceTemplate
      header={{
        title: 'Entities',
        description: 'Manage your entities',
        stats: [
          { label: 'Total', value: total },
          // Max 5 stats
        ],
        primaryAction: {
          label: 'Add Entity',
          icon: <Plus />,
          onClick: handleAdd,
        },
      }}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        quickFilters: filters, // Max 7 filters
      }}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      data={entities}
      renderCard={(entity) => <EntityCard {...entity} />}
      renderRow={(entity) => <EntityRow {...entity} />}
      emptyState={EmptyStatePresets.entities(handleAdd)}
    />
  );
};
```

### When Creating a New Form

**Checklist**:
- [ ] Use `FormTemplate`
- [ ] Group related fields in `FormSection`
- [ ] Use proper field types (text, number, select, etc.)
- [ ] Add validation rules
- [ ] Show loading state during submission
- [ ] Show success/error toasts
- [ ] Handle keyboard shortcuts (Enter to submit, Esc to cancel)
- [ ] Add proper ARIA labels
- [ ] Test accessibility

**Template**:
```tsx
export const AddEntityFormV2 = ({ onClose, onSave }) => {
  const handleSubmit = async (data) => {
    try {
      await onSave(data);
      toast.success('Entity created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create entity');
    }
  };

  return (
    <FormTemplate
      title="Add New Entity"
      description="Enter entity details below"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sections={[
        {
          title: 'Basic Information',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
          ],
        },
        {
          title: 'Additional Details',
          fields: [
            { name: 'notes', label: 'Notes', type: 'textarea' },
          ],
        },
      ]}
    />
  );
};
```

---

## Quality Checklist

### Before Committing Any Component

**Design System Compliance**:
- [ ] Uses existing template (Details V4, Workspace V4, or Form V2)
- [ ] No custom headers/layouts (uses PageHeader/WorkspaceHeader)
- [ ] No recreated components (checked component library first)
- [ ] Follows 8px grid spacing
- [ ] Uses CSS variables for colors
- [ ] No Tailwind typography classes (unless explicitly needed)
- [ ] Follows naming conventions

**UX Laws**:
- [ ] Fitts's Law: Primary actions are large (min 44x44px)
- [ ] Miller's Law: Max 5-7 items in groups
- [ ] Hick's Law: Max 3 primary actions
- [ ] Jakob's Law: Standard patterns used
- [ ] Aesthetic-Usability: Professional appearance

**Accessibility**:
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Visible focus indicators (3px blue outline)
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- [ ] Screen reader tested (or will be)

**Performance**:
- [ ] Component memoized if pure (React.memo)
- [ ] Event handlers memoized (useCallback)
- [ ] Expensive calculations memoized (useMemo)
- [ ] Large lists use pagination or virtual scrolling
- [ ] No unnecessary re-renders

**Responsive**:
- [ ] Mobile tested (< 768px)
- [ ] Tablet tested (768px - 1024px)
- [ ] Desktop tested (> 1024px)
- [ ] Grid collapses properly
- [ ] Touch targets large enough on mobile

**Code Quality**:
- [ ] TypeScript strict mode compliant
- [ ] No `any` types without justification
- [ ] Proper error handling (try-catch)
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] JSDoc comments for complex logic

---

## Migration Strategy

### Phase 1: Audit (Current Phase)

**Goal**: Identify all components that need updating.

**Tasks**:
1. List all detail pages
2. List all workspace/list pages
3. List all forms
4. Categorize by priority (high-traffic vs low-traffic)
5. Estimate effort for each migration

### Phase 2: Core Modules First

**Priority Order**:
1. **Properties** (Already done ✅)
   - PropertyDetailsV4 ✅
   - PropertiesWorkspaceV4 ✅
   
2. **Requirements** (In progress)
   - BuyerRequirementDetailsV4 ✅
   - RentRequirementDetailsV4 ✅
   - BuyerRequirementsWorkspaceV4 ✅
   - RentRequirementsWorkspace (Needs V4)
   
3. **Cycles** (Next priority)
   - SellCycleDetailsV4 (Check status)
   - PurchaseCycleDetailsV4 (Check status)
   - RentCycleDetailsV4 (Check status)
   - Workspaces (Check status)
   
4. **Deals** (Next)
   - DealDetailsV4
   - DealsWorkspaceV4
   
5. **Financials** (Lower priority)
   - Each financial module
   
6. **Documents** (Lower priority)
   - DocumentsWorkspaceV4

### Phase 3: Forms Migration

**Forms to Update**:
- Add Property Form → AddPropertyFormV2
- Edit Property Form → EditPropertyFormV2
- Add Buyer Requirement Form → AddBuyerRequirementFormV2
- Add Rent Requirement Form → AddRentRequirementFormV2
- Add Sell Cycle Form → AddSellCycleFormV2
- And so on...

### Phase 4: Cleanup

**Tasks**:
1. Delete old V1/V2/V3 components
2. Update imports throughout codebase
3. Remove unused CSS
4. Optimize bundle size
5. Performance audit

---

## Enforcement Mechanisms

### 1. Code Review Checklist

Before approving any PR, verify:
- [ ] Uses V4 templates where applicable
- [ ] No recreated components
- [ ] Follows UX Laws
- [ ] Passes Quality Checklist
- [ ] Has proper documentation

### 2. Component Library Reference

**Always check these locations before creating new components**:
- `/components/layout/` - Page-level components
- `/components/workspace/` - Workspace components
- `/components/forms/` - Form components
- `/components/ui/` - UI primitives

### 3. Naming Conventions

**Required naming**:
- Detail pages: `EntityDetailsV4.tsx`
- Workspace pages: `EntitiesWorkspaceV4.tsx`
- Forms: `AddEntityFormV2.tsx`, `EditEntityFormV2.tsx`
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### 4. Documentation Requirements

**Every new V4 component must have**:
- JSDoc header with description
- Usage example in comments
- Props interface with comments
- UX Laws applied (documented)
- Accessibility notes

Example:
```tsx
/**
 * Property Details V4 - Detail page for properties
 * 
 * Uses DetailPageTemplate system with:
 * - PageHeader with breadcrumbs, metrics, actions
 * - ConnectedEntitiesBar for related entities
 * - InfoPanels for grouped data
 * - ActivityTimeline for history
 * 
 * UX Laws Applied:
 * - Fitts's Law: Large primary action buttons (44x44px)
 * - Miller's Law: Max 5 metrics in header
 * - Hick's Law: Max 3 primary actions
 * - Jakob's Law: Standard breadcrumb placement
 * - Aesthetic-Usability: 8px grid, professional appearance
 * 
 * Accessibility:
 * - ARIA labels on all interactive elements
 * - Keyboard navigation (Tab, Enter, Esc)
 * - Screen reader compatible
 * 
 * @example
 * <PropertyDetailsV4
 *   property={property}
 *   user={user}
 *   onBack={() => navigate('properties')}
 * />
 */
export function PropertyDetailsV4({ property, user, onBack }: Props) {
  // Implementation...
}
```

---

## Quick Reference

### Common Patterns

**Detail Page Pattern**:
```tsx
DetailPageTemplate + PageHeader + ConnectedEntitiesBar + Tabs(2-1 layout)
```

**Workspace Page Pattern**:
```tsx
WorkspaceTemplate + WorkspaceHeader + WorkspaceSearchBar + Grid/Table View
```

**Form Pattern**:
```tsx
FormTemplate + FormSections + FormFields + FormActions
```

### Component Quick Guide

| Need | Component | Location |
|------|-----------|----------|
| Detail page layout | `DetailPageTemplate` | `/components/layout/DetailPageTemplate.tsx` |
| Page header | `PageHeader` | `/components/layout/PageHeader.tsx` |
| Related entities | `ConnectedEntitiesBar` | `/components/layout/ConnectedEntitiesBar.tsx` |
| Grouped data fields | `InfoPanel` | `/components/ui/info-panel.tsx` |
| Key metrics | `MetricCardsGroup` | `/components/layout/MetricCardsGroup.tsx` |
| Contact info | `ContactCard` | `/components/layout/ContactCard.tsx` |
| Sidebar actions | `QuickActionsPanel` | `/components/layout/QuickActionsPanel.tsx` |
| Activity history | `ActivityTimeline` | `/components/layout/ActivityTimeline.tsx` |
| Status progression | `StatusTimeline` | `/components/ui/status-timeline.tsx` |
| Workspace layout | `WorkspaceTemplate` | `/components/workspace/WorkspaceTemplate.tsx` |
| Workspace header | `WorkspaceHeader` | `/components/workspace/WorkspaceHeader.tsx` |
| Search & filters | `WorkspaceSearchBar` | `/components/workspace/WorkspaceSearchBar.tsx` |
| Empty states | `WorkspaceEmptyState` | `/components/workspace/WorkspaceEmptyState.tsx` |
| Form layout | `FormTemplate` | `/components/forms/FormTemplate.tsx` |

### Spacing Quick Reference

```
2  = 8px   (tight)
4  = 16px  (normal)
6  = 24px  (comfortable)
8  = 32px  (spacious)
12 = 48px  (section)
16 = 64px  (page)
```

### Color Quick Reference

```
bg-primary    - #030213 (dark navy)
bg-secondary  - #ececf0 (light gray)
bg-muted      - #ececf0 (muted)
bg-destructive - #d4183d (red)
```

---

## Need Help?

**Resources**:
- Full component documentation: `/components/layout/README.md`
- Workspace documentation: `/components/workspace/WORKSPACE_SYSTEM_DOCUMENTATION.md`
- Guidelines: `/Guidelines.md`
- This guide: `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`

**Questions to Ask**:
1. Is there an existing component for this?
2. Which template should I use (Details V4, Workspace V4, Form V2)?
3. Am I following the 5 UX Laws?
4. Does this pass the Quality Checklist?
5. Is this accessible?

**When in Doubt**:
> Look at existing V4 components (PropertyDetailsV4, BuyerRequirementDetailsV4) and follow their patterns.

---

**Version History**:
- **v4.0.0** (Dec 2024) - Initial Design System V4 documentation
- **v4.0.1** (Dec 2024) - Added migration strategy and enforcement
- **v4.1.0** (Dec 2024) - Added flexibility & extensibility framework
  - Context-appropriate solutions guidance
  - Template creation guidelines
  - Extension mechanisms
  - Decision frameworks for when to create new templates
  - Template registry system
  - Flexibility while maintaining consistency

**Maintained by**: aaraazi Development Team  
**Status**: Living Document - Updated as system evolves ✅

**Philosophy**: Consistent foundations, flexible solutions, context-aware decisions