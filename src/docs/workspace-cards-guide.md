# Workspace Cards & Actions - Usage Guide
**Phase 5.3: Data Display Components**

---

## 📋 Overview

This guide covers the reusable card and action components for workspace views:

1. **WorkspaceCard** - Base card for grid view
2. **WorkspaceKanbanCard** - Compact card for Kanban view
3. **BulkActionBar** - Floating action bar for bulk operations
4. **QuickActionMenu** - 3-dot contextual menu
5. **InlineActions** - Inline action buttons

---

## 🎴 WorkspaceCard

### Purpose
Flexible card component for grid view with image, metadata, status, and actions.

### Basic Usage

```typescript
import { WorkspaceCard } from '@/components/workspace';

<WorkspaceCard
  title="Modern Villa - DHA Phase 8"
  subtitle="Plot 123, Street 45"
  image="/images/property.jpg"
  status={{ label: 'Available', variant: 'success' }}
  metadata={[
    { label: 'Price', value: 'PKR 15,000,000' },
    { label: 'Area', value: '500 sq yd' },
  ]}
  onClick={() => handleViewProperty()}
/>
```

### With All Features

```typescript
<WorkspaceCard
  // Basic Info
  title="Modern Villa - DHA Phase 8"
  subtitle="Plot 123, Street 45, DHA Phase 8"
  
  // Image
  image="/images/property-1.jpg"
  imageFallback={<Home className="h-12 w-12" />}
  
  // Status
  status={{ label: 'Available', variant: 'success' }}
  
  // Metadata (max 5 - Miller's Law)
  metadata={[
    { label: 'Price', value: formatPKR(15000000), icon: <DollarSign /> },
    { label: 'Area', value: '500 sq yd', icon: <Ruler /> },
    { label: 'Bedrooms', value: '5', icon: <Bed /> },
    { label: 'Agent', value: 'Ahmed Khan' },
  ]}
  
  // Tags
  tags={[
    { label: 'Featured', variant: 'info' },
    { label: 'New Listing', variant: 'success' },
  ]}
  
  // Actions (shown on hover)
  actions={[
    { label: 'View', icon: <Eye />, onClick: handleView },
    { label: 'Edit', icon: <Edit />, onClick: handleEdit },
  ]}
  
  // Footer
  footer={
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>Listed 2 days ago</span>
      <span>3 inquiries</span>
    </div>
  }
  
  // Handlers
  onClick={handleViewProperty}
  isSelected={selectedIds.has(property.id)}
  onSelect={(selected) => handleSelect(property.id, selected)}
  showSelection={true}
/>
```

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Card title |
| `subtitle` | string | ❌ | Card subtitle |
| `image` | string | ❌ | Image URL |
| `imageFallback` | ReactNode | ❌ | Fallback when no image |
| `status` | object | ❌ | Status badge |
| `metadata` | array | ❌ | Metadata items (max 5) |
| `tags` | array | ❌ | Tags/badges (max 3) |
| `actions` | array | ❌ | Quick actions (hover) |
| `footer` | ReactNode | ❌ | Footer content |
| `onClick` | function | ❌ | Click handler |
| `isSelected` | boolean | ❌ | Selected state |
| `onSelect` | function | ❌ | Selection handler |
| `showSelection` | boolean | ❌ | Show checkbox |
| `compact` | boolean | ❌ | Compact mode |

### Variants

**Loading Skeleton:**
```typescript
<WorkspaceCardSkeleton showImage={true} />
```

**Empty Card:**
```typescript
<WorkspaceCardEmpty
  icon={<Plus className="h-12 w-12" />}
  title="No properties yet"
  description="Add your first property to get started"
  action={{
    label: 'Add Property',
    onClick: handleAdd,
  }}
/>
```

---

## 🗂️ WorkspaceKanbanCard

### Purpose
Compact card optimized for Kanban columns with progress, assignee, and metrics.

### Basic Usage

```typescript
import { WorkspaceKanbanCard } from '@/components/workspace';

<WorkspaceKanbanCard
  id="deal-123"
  title="Villa Sale - Ahmed Khan"
  reference="#D-2024-123"
  priority="high"
  status={{ label: 'Agreement', variant: 'info' }}
  assignee={{
    name: 'Sarah Ali',
    avatar: '/avatars/sarah.jpg',
    initials: 'SA',
  }}
  dueDate="Dec 30"
  progress={65}
  onClick={() => handleViewDeal()}
/>
```

### With All Features

```typescript
<WorkspaceKanbanCard
  // IDs
  id="deal-123"
  reference="#D-2024-123"
  
  // Content
  title="Modern Villa Sale - Ahmed Khan to Fatima Hassan"
  
  // Priority (low, medium, high, urgent)
  priority="high"
  
  // Status
  status={{ label: 'Agreement Signing', variant: 'info' }}
  
  // Assignee
  assignee={{
    name: 'Sarah Ali',
    avatar: '/avatars/sarah.jpg',
    initials: 'SA',
  }}
  
  // Dates
  dueDate="Dec 30, 2024"
  isOverdue={false}
  
  // Progress
  progress={65}
  
  // Metrics (max 3)
  metrics={[
    { label: 'Value', value: formatPKR(15000000), icon: <DollarSign /> },
    { label: 'Commission', value: formatPKR(300000) },
    { label: 'Documents', value: '8/10' },
  ]}
  
  // Tags
  tags={['High Value', 'DHA']}
  
  // Handlers
  onClick={handleViewDeal}
  isSelected={selectedIds.has(deal.id)}
  
  // Drag & drop (future)
  draggable={true}
/>
```

### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | ✅ | Unique ID |
| `title` | string | ✅ | Card title |
| `reference` | string | ❌ | Reference number |
| `priority` | enum | ❌ | low/medium/high/urgent |
| `status` | object | ❌ | Status badge |
| `assignee` | object | ❌ | Assigned user |
| `dueDate` | string | ❌ | Due date |
| `isOverdue` | boolean | ❌ | Overdue state |
| `progress` | number | ❌ | Progress (0-100) |
| `metrics` | array | ❌ | Metrics (max 3) |
| `tags` | array | ❌ | Tags (max 2) |
| `onClick` | function | ❌ | Click handler |
| `isSelected` | boolean | ❌ | Selected state |
| `draggable` | boolean | ❌ | Enable drag & drop |

---

## 📊 BulkActionBar

### Purpose
Floating action bar that appears at bottom when items are selected.

### Basic Usage

```typescript
import { BulkActionBar } from '@/components/workspace';

<BulkActionBar
  selectedCount={5}
  selectedIds={['id1', 'id2', 'id3', 'id4', 'id5']}
  actions={[
    {
      id: 'export',
      label: 'Export',
      icon: <Download />,
      onClick: (ids) => handleExport(ids),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash />,
      onClick: (ids) => handleDelete(ids),
      variant: 'destructive',
      requireConfirm: true,
    },
  ]}
  onClearSelection={() => setSelectedIds(new Set())}
  entityName="properties"
/>
```

### With All Features

```typescript
<BulkActionBar
  // Selection
  selectedCount={selectedIds.size}
  selectedIds={Array.from(selectedIds)}
  
  // Actions (max 5 visible - Miller's Law)
  actions={[
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: (ids) => handleExport(ids),
      variant: 'default',
    },
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: <User className="h-4 w-4" />,
      onClick: (ids) => handleAssign(ids),
    },
    {
      id: 'change-status',
      label: 'Change Status',
      icon: <Edit className="h-4 w-4" />,
      onClick: (ids) => handleChangeStatus(ids),
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      onClick: (ids) => handleArchive(ids),
      disabled: !canArchive,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash className="h-4 w-4" />,
      onClick: (ids) => handleDelete(ids),
      variant: 'destructive',
      requireConfirm: true,
    },
  ]}
  
  // Handlers
  onClearSelection={handleClearSelection}
  
  // Config
  entityName="properties"
  animate={true}
/>
```

### Mobile Variant

```typescript
import { CompactBulkActionBar } from '@/components/workspace';

<CompactBulkActionBar
  selectedCount={5}
  selectedIds={selectedIds}
  actions={actions}
  onClearSelection={handleClear}
/>
```

---

## ⚡ QuickActionMenu

### Purpose
3-dot contextual menu for cards and table rows.

### Basic Usage

```typescript
import { QuickActionMenu } from '@/components/workspace';

<QuickActionMenu
  actions={[
    { id: 'view', label: 'View Details', onClick: handleView },
    { id: 'edit', label: 'Edit', onClick: handleEdit },
    { id: 'delete', label: 'Delete', onClick: handleDelete, variant: 'destructive', separator: true },
  ]}
/>
```

### With Presets

```typescript
import { QuickActionMenu, QuickActionPresets } from '@/components/workspace';

// Standard CRUD
<QuickActionMenu
  actions={QuickActionPresets.standard({
    onView: () => navigate(`/properties/${property.id}`),
    onEdit: () => setEditModal(true),
    onDelete: () => handleDelete(property.id),
  })}
/>

// Property-specific
<QuickActionMenu
  actions={QuickActionPresets.property({
    onView: handleView,
    onEdit: handleEdit,
    onShare: handleShare,
    onDuplicate: handleDuplicate,
    onArchive: handleArchive,
    onDelete: handleDelete,
  })}
/>

// Deal-specific
<QuickActionMenu
  actions={QuickActionPresets.deal({
    onView: handleView,
    onEdit: handleEdit,
    onAdvanceStage: handleAdvance,
    onAddNote: handleAddNote,
    onViewDocuments: handleDocs,
    onCancel: handleCancel,
  })}
/>

// Cycle-specific
<QuickActionMenu
  actions={QuickActionPresets.cycle({
    onView: handleView,
    onEdit: handleEdit,
    onViewOffers: handleOffers,
    onClose: handleClose,
  })}
/>
```

### Custom Styling

```typescript
<QuickActionMenu
  actions={actions}
  orientation="horizontal"  // or "vertical"
  variant="outline"         // or "ghost"
  size="default"            // or "sm"
  align="end"               // or "start", "center"
  showOnHover={true}        // Show only on hover
/>
```

### Inline Actions

```typescript
import { InlineActions } from '@/components/workspace';

// Show as buttons instead of menu
<InlineActions
  actions={[
    { id: 'view', label: 'View', icon: <Eye />, onClick: handleView },
    { id: 'edit', label: 'Edit', icon: <Edit />, onClick: handleEdit },
    { id: 'delete', label: 'Delete', icon: <Trash />, onClick: handleDelete },
  ]}
  maxVisible={2}  // Show 2 buttons, rest in menu
/>
```

---

## 🎯 Real-World Examples

### Example 1: Property Grid Card

```typescript
const PropertyGridCard = ({ property }: { property: Property }) => {
  return (
    <WorkspaceCard
      title={property.title || property.address}
      subtitle={property.address}
      image={property.images?.[0]}
      imageFallback={<Home className="h-12 w-12 text-gray-400" />}
      status={{
        label: property.status,
        variant: property.status === 'available' ? 'success' : 'default',
      }}
      metadata={[
        { label: 'Price', value: formatPKR(property.price), icon: <DollarSign className="h-4 w-4" /> },
        { label: 'Area', value: `${property.area} sq yd`, icon: <Ruler className="h-4 w-4" /> },
        { label: 'Type', value: property.propertyType },
        { label: 'Agent', value: property.agentName },
      ]}
      tags={[
        property.featured && { label: 'Featured', variant: 'info' },
        property.isNew && { label: 'New', variant: 'success' },
      ].filter(Boolean)}
      footer={
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Listed {formatDate(property.listingDate)}
          </span>
          <QuickActionMenu
            actions={QuickActionPresets.property({
              onView: () => navigate(`/properties/${property.id}`),
              onEdit: () => setEditProperty(property),
              onShare: () => handleShare(property),
              onDelete: () => handleDelete(property.id),
            })}
          />
        </div>
      }
      onClick={() => navigate(`/properties/${property.id}`)}
    />
  );
};
```

### Example 2: Deal Kanban Card

```typescript
const DealKanbanCardComponent = ({ deal }: { deal: Deal }) => {
  return (
    <WorkspaceKanbanCard
      id={deal.id}
      title={`${deal.propertyTitle} - ${deal.buyerName}`}
      reference={`#${deal.dealNumber}`}
      priority={deal.priority}
      status={{
        label: deal.lifecycle.stage,
        variant: deal.lifecycle.status === 'active' ? 'info' : 'default',
      }}
      assignee={{
        name: deal.agentName,
        avatar: deal.agentAvatar,
        initials: deal.agentName.slice(0, 2).toUpperCase(),
      }}
      dueDate={formatRelativeDate(deal.lifecycle.expectedCompletionDate)}
      isOverdue={isOverdue(deal.lifecycle.expectedCompletionDate)}
      progress={calculateProgress(deal.lifecycle.stage)}
      metrics={[
        { label: 'Value', value: formatPKR(deal.amount) },
        { label: 'Commission', value: formatPKR(deal.expectedCommission) },
      ]}
      tags={[deal.propertyType, deal.transactionType]}
      onClick={() => navigate(`/deals/${deal.id}`)}
    />
  );
};
```

### Example 3: Complete Workspace with Bulk Actions

```typescript
const PropertiesWorkspace = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState<Property[]>([]);

  const bulkActions = [
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      onClick: (ids: string[]) => handleExport(ids),
    },
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: <User className="h-4 w-4" />,
      onClick: (ids: string[]) => handleAssignAgent(ids),
    },
    {
      id: 'change-status',
      label: 'Change Status',
      icon: <Edit className="h-4 w-4" />,
      onClick: (ids: string[]) => handleChangeStatus(ids),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash className="h-4 w-4" />,
      onClick: (ids: string[]) => handleDelete(ids),
      variant: 'destructive' as const,
      requireConfirm: true,
    },
  ];

  return (
    <>
      <WorkspaceGridView
        items={properties}
        getItemId={(p) => p.id}
        selectedIds={selectedIds}
        onSelectItem={(id, selected) => {
          const next = new Set(selectedIds);
          selected ? next.add(id) : next.delete(id);
          setSelectedIds(next);
        }}
        renderCard={(property) => (
          <PropertyGridCard property={property} />
        )}
      />

      <BulkActionBar
        selectedCount={selectedIds.size}
        selectedIds={Array.from(selectedIds)}
        actions={bulkActions}
        onClearSelection={() => setSelectedIds(new Set())}
        entityName="properties"
      />
    </>
  );
};
```

---

## ✅ Best Practices

### 1. Card Design

**DO:**
- Keep title concise (< 60 characters)
- Limit metadata to 5 items (Miller's Law)
- Use meaningful icons
- Show status prominently
- Provide visual hierarchy

**DON'T:**
- Overcrowd with information
- Use tiny text (< 12px)
- Hide important data
- Use too many colors

### 2. Actions

**DO:**
- Limit to 5 bulk actions (Miller's Law)
- Group related actions
- Use confirmation for destructive actions
- Show most common actions first
- Use clear labels

**DON'T:**
- Show too many actions (overwhelming)
- Hide delete in submenu
- Use vague labels ("Manage", "Options")
- Forget icons

### 3. Performance

**DO:**
- Use WorkspaceCardSkeleton while loading
- Lazy load images
- Memoize card components
- Limit visible cards (pagination)

**DON'T:**
- Render 100+ cards at once
- Load all images eagerly
- Create new objects in render

---

## 🎨 Customization

### Custom Card Style

```typescript
<WorkspaceCard
  className="border-2 border-blue-500 shadow-xl"
  compact={true}
  // ... props
/>
```

### Custom Action Menu

```typescript
<QuickActionMenu
  actions={customActions}
  trigger={
    <Button variant="ghost" size="sm">
      <Settings className="h-4 w-4" />
    </Button>
  }
/>
```

---

**Happy Building! 🚀**
