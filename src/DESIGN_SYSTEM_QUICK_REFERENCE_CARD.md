# Design System V4.1 - Quick Reference Card

**Keep this open while coding!** 📌

---

## 🎯 Before You Code

### 1. Choose Your Template

```
Detail page (one entity)?     → DetailPageTemplate
List page (many entities)?    → WorkspaceTemplate
Form (create/edit)?           → FormTemplate
```

### 2. Check Template Registry

```typescript
import { TEMPLATE_REGISTRY } from '@/components/templates';

// See all available templates
console.log(listAllTemplates());
```

### 3. Study Reference Implementation

```
Detail:     /components/PropertyDetailsV4.tsx
Workspace:  /components/properties/PropertiesWorkspaceV4.tsx
Form:       /components/AddPropertyFormV2.tsx
```

---

## ✅ Mandatory Checks

### UX Laws (Always Apply)

- [ ] **Fitts**: Primary buttons ≥ 44x44px
- [ ] **Miller**: Max 5 metrics, 7 filters, 5 stats
- [ ] **Hick**: Max 3 primary actions
- [ ] **Jakob**: Standard placement (breadcrumbs top-left, actions top-right)
- [ ] **Aesthetic**: 8px grid spacing

### Design Tokens (Required)

```tsx
// ✅ Colors: Use CSS variables
className="bg-primary text-white"
className="bg-secondary"

// ✅ Spacing: 8px grid only
className="p-2"   // 8px
className="p-4"   // 16px
className="p-6"   // 24px
className="gap-4" // 16px

// ❌ Typography: NO Tailwind classes
<h1 className="text-2xl">Title</h1>      // WRONG
<h1>Title</h1>                           // RIGHT
```

### Accessibility (Non-Negotiable)

```tsx
// ✅ All interactive elements
<Button
  onClick={handleAction}
  aria-label="Add new property"
>
  <Plus className="h-4 w-4" />
  <span className="sr-only">Add Property</span>
</Button>

// ✅ Keyboard navigation works
// - Tab to navigate
// - Enter to activate
// - Esc to close/cancel
// - Arrows for lists
```

---

## 🚀 Quick Templates

### Detail Page

```tsx
import { DetailPageTemplate } from '@/components/layout';

export const EntityDetailsV4 = ({ entity, user, onBack }) => {
  return (
    <DetailPageTemplate
      pageHeader={{
        title: entity.name,
        breadcrumbs: [
          { label: 'Entities', onClick: onBack },
          { label: entity.name },
        ],
        metrics: [
          { label: 'Metric', value: 'Value' },
          // Max 5
        ],
        primaryActions: [
          { label: 'Action', onClick: handleAction },
          // Max 3
        ],
        onBack,
      }}
      tabs={tabs}
    />
  );
};
```

### Workspace Page

```tsx
import { WorkspaceTemplate } from '@/components/workspace/WorkspaceTemplate';

export const EntitiesWorkspaceV4 = ({ user }) => {
  return (
    <WorkspaceTemplate
      header={{
        title: 'Entities',
        stats: [
          { label: 'Total', value: 150 },
          // Max 5
        ],
        primaryAction: {
          label: 'Add Entity',
          onClick: handleAdd,
        },
      }}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        quickFilters: filters, // Max 7
      }}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      data={entities}
      renderCard={(entity) => <EntityCard {...entity} />}
      renderRow={(entity) => <EntityRow {...entity} />}
    />
  );
};
```

### Form

```tsx
import { FormTemplate } from '@/components/forms/FormTemplate';

export const AddEntityFormV2 = ({ onClose, onSave }) => {
  return (
    <FormTemplate
      title="Add Entity"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sections={[
        {
          title: 'Basic Info',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
          ],
        },
      ]}
    />
  );
};
```

---

## 🎨 Design Tokens Reference

### Colors

```
bg-primary      #030213 (dark navy)
bg-secondary    #ececf0 (light gray)
bg-muted        #ececf0 (muted)
bg-accent       #e9ebef (accent)
bg-destructive  #d4183d (red)
```

### Spacing (8px Grid)

```
p-2   = 8px   (tight)
p-4   = 16px  (normal) ← Most common
p-6   = 24px  (comfortable)
p-8   = 32px  (spacious)
p-12  = 48px  (section)
```

### Border Radius

```
rounded-lg  = 10px (default)
rounded-md  = 6px  (small)
rounded-xl  = 12px (large)
```

---

## ❌ Common Mistakes

```tsx
// ❌ WRONG: Custom layout
<div className="flex items-center">
  <h1>{title}</h1>
</div>

// ✅ RIGHT: Use template
<DetailPageTemplate {...config} />

// ❌ WRONG: Typography classes
<h1 className="text-2xl font-bold">Title</h1>

// ✅ RIGHT: Let CSS handle it
<h1>Title</h1>

// ❌ WRONG: Non-grid spacing
className="p-3 gap-5"

// ✅ RIGHT: 8px grid
className="p-4 gap-4"

// ❌ WRONG: Too many metrics
metrics={[m1, m2, m3, m4, m5, m6, m7, m8]}

// ✅ RIGHT: Max 5 metrics
metrics={[m1, m2, m3, m4, m5]}
```

---

## 🔧 When to Extend vs Create New

```
Template does 80%+ of what I need?
  → Use existing template

Template does 50-80% of what I need?
  → Extend with customContent/props

Template does <50% of what I need?
  ├─ Repeatable (2+ places)? → Create new template
  └─ One-off unique?         → Build custom component
```

---

## 📚 Documentation Links

Quick access:
- `/DESIGN_SYSTEM_QUICK_START.md` - 5 min guide
- `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md` - Complete reference
- `/DESIGN_SYSTEM_FLEXIBILITY_ADDENDUM.md` - Flexibility guidance
- `/Guidelines.md` - Development standards

Component docs:
- `/components/layout/README.md` - Layout components
- `/components/workspace/WORKSPACE_SYSTEM_DOCUMENTATION.md` - Workspace components
- `/components/templates/index.ts` - Template registry

---

## ✅ Pre-Commit Checklist

- [ ] Using appropriate template OR documented why not
- [ ] No recreated components (checked library first)
- [ ] Follows UX Laws (5 metrics, 3 actions, 7 filters, 44px buttons)
- [ ] Uses design tokens (8px grid, CSS variables)
- [ ] No typography classes (unless justified)
- [ ] Accessible (ARIA labels, keyboard nav, focus states)
- [ ] Responsive (tested mobile, tablet, desktop)
- [ ] TypeScript strict (no `any`)
- [ ] Has JSDoc comments
- [ ] Memoized properly (React.memo, useCallback, useMemo)

---

## 🆘 Quick Help

**"Which template do I use?"**
→ Detail/List/Form? See section 1 above.

**"Can I create new template?"**
→ Follow decision tree in section "When to Extend vs Create New"

**"What's the spacing value?"**
→ 8px grid only: p-2, p-4, p-6, p-8

**"Can I use text-xl?"**
→ NO. Let CSS handle typography.

**"Max metrics allowed?"**
→ 5 metrics, 3 primary actions, 7 filters

---

**Print and keep at your desk!** 🖨️

**Last Updated**: December 27, 2024  
**Version**: 4.1.0
