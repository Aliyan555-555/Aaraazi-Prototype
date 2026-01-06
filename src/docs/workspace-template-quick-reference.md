# WorkspacePageTemplate - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

```typescript
import { WorkspacePageTemplate, Column } from '@/components/workspace';
import { MyItem } from '@/types';

export const MyWorkspace = () => {
  const [items, setItems] = useState<MyItem[]>([]);

  const columns: Column<MyItem>[] = [
    { id: 'name', label: 'Name', accessor: (item) => item.name },
    { id: 'status', label: 'Status', accessor: (item) => item.status },
  ];

  return (
    <WorkspacePageTemplate
      title="My Workspace"
      items={items}
      getItemId={(item) => item.id}
      columns={columns}
      onItemClick={(item) => console.log(item)}
    />
  );
};
```

---

## 📋 Essential Props

```typescript
// REQUIRED
title: string
items: T[]
getItemId: (item: T) => string

// COMMON
stats: Array<{ label, value, variant?, icon? }>        // Max 5
primaryAction: { label, icon?, onClick, disabled? }     // 44x44px
columns: Column<T>[]                                   // For table
renderCard: (item: T) => React.ReactNode              // For grid
```

---

## 🎨 View Modes

```typescript
// Table View (best for data-heavy)
defaultView="table"
columns={columns}

// Grid View (best for visual)
defaultView="grid"
renderCard={(item) => <MyCard item={item} />}

// Kanban View (best for workflows)
defaultView="kanban"
kanbanColumns={kanbanColumns}
getKanbanColumn={(item) => item.status}
renderKanbanCard={(item) => <MyKanbanCard item={item} />}
```

---

## 📊 Stats (Max 5)

```typescript
stats={[
  { label: 'Total', value: items.length },
  { label: 'Active', value: 42, variant: 'success' },
  { label: 'Pending', value: 8, variant: 'warning' },
]}

// Variants: default | success | warning | danger | info
```

---

## 🔘 Actions

```typescript
// Primary Action (top-right, 44x44px)
primaryAction={{
  label: 'Add Item',
  icon: <Plus className="w-4 h-4" />,
  onClick: () => handleAdd(),
}}

// Secondary Actions (max 3)
secondaryActions={[
  { label: 'Import', icon: <Upload />, onClick: handleImport },
  { label: 'Export', icon: <Download />, onClick: handleExport },
]}

// Bulk Actions (max 5 visible)
bulkActions={[
  { 
    id: 'delete',
    label: 'Delete',
    icon: <Trash />,
    onClick: (ids) => handleDelete(ids),
    variant: 'destructive'
  },
]}
```

---

## 🔍 Search & Filter

```typescript
// Search
searchPlaceholder="Search items..."
onSearch={(item, query) => item.name.includes(query)}

// Quick Filters (max 7)
quickFilters={[
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active', count: 42 },
      { value: 'inactive', label: 'Inactive', count: 8 },
    ],
    value: selectedStatus,
    onChange: setSelectedStatus,
    multiple: true,
  },
]}

// Sort Options
sortOptions={[
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name (A-Z)' },
]}
```

---

## 📄 Table Columns (Max 7 visible)

```typescript
const columns: Column<MyItem>[] = [
  {
    id: 'name',
    label: 'Name',
    accessor: (item) => item.name,
    sortable: true,
    width: '300px',
    align: 'left',
  },
  {
    id: 'status',
    label: 'Status',
    accessor: (item) => <StatusBadge status={item.status} />,
    align: 'center',
  },
  {
    id: 'price',
    label: 'Price',
    accessor: (item) => formatPKR(item.price),
    align: 'right',
    sortable: true,
  },
];
```

---

## 🎴 Grid Cards

```typescript
renderCard={(item, index) => (
  <div className="bg-white border rounded-lg p-6 hover:shadow-md">
    <h3>{item.name}</h3>
    <p>{item.description}</p>
    <StatusBadge status={item.status} />
  </div>
)}
```

---

## 📊 Kanban Columns (Max 7)

```typescript
kanbanColumns={[
  { id: 'todo', label: 'To Do', color: 'gray' },
  { id: 'in-progress', label: 'In Progress', color: 'blue' },
  { id: 'done', label: 'Done', color: 'green' },
]}

getKanbanColumn={(item) => item.status}

renderKanbanCard={(item) => (
  <div className="bg-white border rounded-lg p-4">
    <h4>{item.name}</h4>
    <p className="text-sm">{item.description}</p>
  </div>
)}
```

---

## 📑 Pagination

```typescript
pagination={{
  enabled: true,
  pageSize: 24,
  pageSizeOptions: [12, 24, 48, 96],
}}
```

---

## 🎯 Empty States

```typescript
// Use preset
emptyStatePreset={EmptyStatePresets.properties(handleAdd)}

// Custom empty state
customEmptyState={
  <div className="text-center py-12">
    <p>No items yet</p>
    <Button onClick={handleAdd}>Add First Item</Button>
  </div>
}

// Custom no results
noResultsState={
  <WorkspaceEmptyState
    variant="no-results"
    title="No results found"
    primaryAction={{ label: 'Clear Filters', onClick: handleClear }}
  />
}
```

---

## 🎨 UX Laws Cheatsheet

**Miller's Law** (Max items to remember):
- ✅ Stats: 5
- ✅ Filters: 7
- ✅ Columns: 7
- ✅ Actions: 5
- ✅ Kanban: 7

**Fitts's Law** (Touch targets):
- ✅ Primary action: 44x44px
- ✅ Bulk actions: 40x40px
- ✅ Pagination: 40x40px

**Hick's Law** (Decision time):
- ✅ Max 5 visible actions
- ✅ Progressive disclosure

**Jakob's Law** (Familiarity):
- ✅ Search: top-left
- ✅ Add: top-right
- ✅ Pagination: center-bottom

---

## 🔧 Common Patterns

### Pattern 1: Properties Workspace
```typescript
<WorkspacePageTemplate
  defaultView="grid"
  availableViews={['grid', 'table']}
  renderCard={(p) => <PropertyCard property={p} />}
  columns={propertyColumns}
/>
```

### Pattern 2: Cycles Workspace
```typescript
<WorkspacePageTemplate
  defaultView="table"
  availableViews={['table', 'grid']}
  columns={cycleColumns}
/>
```

### Pattern 3: Deal Dashboard
```typescript
<WorkspacePageTemplate
  defaultView="kanban"
  availableViews={['kanban', 'table', 'grid']}
  kanbanColumns={dealStages}
  getKanbanColumn={(d) => d.lifecycle.stage}
  renderKanbanCard={(d) => <DealKanbanCard deal={d} />}
/>
```

---

## ⚡ Performance Tips

```typescript
// 1. Memoize card components
const PropertyCard = React.memo(({ property }) => { ... });

// 2. Use simple getItemId
getItemId={(item) => item.id}  // ✅ Good
getItemId={(item) => `${item.type}-${item.id}`}  // ❌ Avoid

// 3. Enable pagination for large lists
pagination={{ enabled: items.length > 50 }}

// 4. Memoize expensive accessors
const columns = useMemo(() => [...], []);
```

---

## 🐛 Troubleshooting

**Items not showing?**
```typescript
// Check these:
console.log('Items:', items.length);
console.log('Item IDs:', items.map(getItemId));
console.log('Filters:', activeFilters);
```

**Table not rendering?**
```typescript
// Ensure columns are defined
columns={[
  { id: 'name', label: 'Name', accessor: (item) => item.name }
]}
```

**Kanban empty?**
```typescript
// Check column IDs match
kanbanColumns={[{ id: 'active', ... }]}
getKanbanColumn={(item) => item.status}  // Must return 'active'
```

---

## 📚 Full Docs

- **Complete Guide**: `/docs/workspace-template-guide.md`
- **Implementation Plan**: `/WORKSPACE_TEMPLATE_PLAN.md`
- **Migration Guide**: `/docs/workspace-migration-guide.md`

---

## 🎯 Quick Checklist

Before using the template:
- [ ] Define item type interface
- [ ] Prepare getItemId function
- [ ] Choose default view mode
- [ ] Define columns OR renderCard
- [ ] Add stats (max 5)
- [ ] Add primary action
- [ ] Add empty state

---

**Need help?** Check the full guide or existing implementations! 🚀
