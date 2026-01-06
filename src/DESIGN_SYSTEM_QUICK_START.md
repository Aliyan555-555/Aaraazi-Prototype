# Design System V4 - Quick Start Guide

**For**: Developers starting new features  
**Time to Read**: 5 minutes  
**Last Updated**: December 27, 2024

---

## 🚀 Quick Start in 3 Steps

### Step 1: Choose Your Template (10 seconds)

**What are you building?**

```
Showing details of ONE entity?     → Use DetailPageTemplate
Showing a LIST of entities?        → Use WorkspaceTemplate
Creating a FORM to add/edit?       → Use FormTemplate
```

### Step 2: Copy Reference Implementation (2 minutes)

**Detail Page Example**:
```bash
# Copy from existing implementation
cp components/PropertyDetailsV4.tsx components/YourEntityDetailsV4.tsx
```

**Workspace Page Example**:
```bash
cp components/PropertiesWorkspaceV4.tsx components/YourEntitiesWorkspaceV4.tsx
```

**Form Example**:
```bash
cp components/AddPropertyFormV2.tsx components/AddYourEntityFormV2.tsx
```

### Step 3: Customize (10-30 minutes)

Replace the example data with your entity's data. That's it!

---

## 📋 Detail Page Template (30 seconds to understand)

```tsx
import { DetailPageTemplate } from './layout';

export const YourEntityDetailsV4 = ({ entity, user, onBack }) => {
  // 1. Configure header
  const pageHeader = {
    title: entity.name,
    breadcrumbs: [
      { label: 'Entities', onClick: onBack },
      { label: entity.name },
    ],
    metrics: [
      { label: 'Metric 1', value: 'Value 1' },
      // Max 5 metrics
    ],
    primaryActions: [
      { label: 'Edit', onClick: handleEdit },
      // Max 3 actions
    ],
    onBack,
  };

  // 2. Configure tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <YourContent />,
      sidebar: <YourSidebar />,
      layout: '2-1', // 2/3 content + 1/3 sidebar
    },
  ];

  // 3. Render
  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      tabs={tabs}
    />
  );
};
```

**Done!** You have a fully-functional detail page with:
- ✅ Header with breadcrumbs
- ✅ Metrics display
- ✅ Action buttons
- ✅ Tab navigation
- ✅ Responsive layout
- ✅ Accessible
- ✅ Consistent design

---

## 📋 Workspace Template (30 seconds to understand)

```tsx
import { WorkspaceTemplate } from './workspace/WorkspaceTemplate';

export const YourEntitiesWorkspaceV4 = ({ user }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <WorkspaceTemplate
      header={{
        title: 'Your Entities',
        stats: [
          { label: 'Total', value: entities.length },
          // Max 5 stats
        ],
        primaryAction: {
          label: 'Add Entity',
          onClick: handleAdd,
        },
      }}
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        quickFilters: [
          { label: 'All', value: 'all' },
          // Max 7 filters
        ],
      }}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      data={entities}
      renderCard={(entity) => <EntityCard {...entity} />}
      renderRow={(entity) => <EntityRow {...entity} />}
      emptyState={EmptyStatePresets.yourEntity(handleAdd)}
    />
  );
};
```

**Done!** You have a fully-functional workspace with:
- ✅ Header with stats
- ✅ Search bar
- ✅ Filters
- ✅ Grid/Table view switcher
- ✅ Empty states
- ✅ Responsive
- ✅ Consistent design

---

## 📋 Form Template (30 seconds to understand)

```tsx
import { FormTemplate } from './forms/FormTemplate';

export const AddYourEntityFormV2 = ({ onClose, onSave }) => {
  return (
    <FormTemplate
      title="Add Your Entity"
      description="Enter entity details"
      onSubmit={handleSubmit}
      onCancel={onClose}
      sections={[
        {
          title: 'Basic Info',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email' },
          ],
        },
      ]}
    />
  );
};
```

**Done!** You have a fully-functional form with:
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Cancel button
- ✅ Keyboard shortcuts
- ✅ Consistent design

---

## 🎨 Common Components (Know These)

### For Detail Pages

```tsx
import {
  DetailPageTemplate,
  PageHeader,
  ConnectedEntitiesBar,
  InfoPanel,
  MetricCardsGroup,
  ContactCard,
  QuickActionsPanel,
  ActivityTimeline,
} from './layout';
```

**When to use each**:
- `PageHeader` - Top header (automatic in template)
- `ConnectedEntitiesBar` - Show related entities (Owner, Agent, etc.)
- `InfoPanel` - Group of data fields
- `MetricCardsGroup` - Key metrics cards
- `ContactCard` - Contact information
- `QuickActionsPanel` - Sidebar quick actions
- `ActivityTimeline` - Activity history

### For Workspace Pages

```tsx
import {
  WorkspaceTemplate,
  WorkspaceHeader,
  WorkspaceSearchBar,
  WorkspaceEmptyState,
} from './workspace';
```

**When to use each**:
- `WorkspaceHeader` - Top header (automatic in template)
- `WorkspaceSearchBar` - Search + filters (automatic in template)
- `WorkspaceEmptyState` - Empty state when no data

---

## 🚫 Common Mistakes (Avoid These)

### ❌ Mistake 1: Creating Custom Layout

```tsx
// ❌ DON'T DO THIS
export const MyPage = () => (
  <div className="container">
    <div className="header">
      <h1>Title</h1>
    </div>
  </div>
);

// ✅ DO THIS
export const MyPageV4 = () => (
  <DetailPageTemplate
    pageHeader={pageHeader}
    tabs={tabs}
  />
);
```

### ❌ Mistake 2: Using Typography Classes

```tsx
// ❌ DON'T DO THIS
<h1 className="text-2xl font-bold">Title</h1>

// ✅ DO THIS
<h1>Title</h1>  // CSS handles it automatically
```

### ❌ Mistake 3: Too Many Metrics

```tsx
// ❌ DON'T DO THIS - 8 metrics!
metrics={[m1, m2, m3, m4, m5, m6, m7, m8]}

// ✅ DO THIS - Max 5 metrics
metrics={[m1, m2, m3, m4, m5]}
```

### ❌ Mistake 4: Wrong Naming

```tsx
// ❌ DON'T DO THIS
PropertyDetail.tsx
PropertyDetails.tsx
property-details.tsx

// ✅ DO THIS
PropertyDetailsV4.tsx
```

### ❌ Mistake 5: Non-Grid Spacing

```tsx
// ❌ DON'T DO THIS
className="p-3 gap-5"  // 12px, 20px - not on grid

// ✅ DO THIS
className="p-4 gap-4"  // 16px, 16px - on 8px grid
```

---

## ⚡ Pro Tips

### Tip 1: Study Reference Implementations

**Best examples to learn from**:
- `PropertyDetailsV4.tsx` - Perfect detail page
- `PropertiesWorkspaceV4.tsx` - Perfect workspace
- `AddPropertyFormV2.tsx` - Perfect form

**Copy-paste-modify approach**:
1. Copy one of these files
2. Replace "Property" with your entity name
3. Replace the data fields
4. Done!

### Tip 2: Use InfoPanel for Data Groups

```tsx
// ✅ Group related fields together
<InfoPanel
  title="Basic Information"
  data={[
    { label: 'Name', value: entity.name },
    { label: 'Email', value: entity.email },
    { label: 'Phone', value: entity.phone },
  ]}
  columns={2}
/>
```

### Tip 3: Use Presets for Empty States

```tsx
// ✅ Use built-in presets
import { EmptyStatePresets } from './workspace/WorkspaceEmptyState';

<WorkspaceEmptyState {...EmptyStatePresets.properties(handleAdd)} />
<WorkspaceEmptyState {...EmptyStatePresets.sellCycles(handleAdd)} />
<WorkspaceEmptyState {...EmptyStatePresets.noResults()} />
```

### Tip 4: Follow the 5-7 Rule

- Max **5** metrics in header
- Max **5** stats in panels
- Max **7** quick filters
- Max **5** connected entities
- Max **3** primary actions

### Tip 5: Use Proper Icons

```tsx
import { Home, Users, DollarSign } from 'lucide-react';

// ✅ Consistent icon sizing
<Home className="h-4 w-4" />  // Small icons
<Users className="h-5 w-5" />  // Medium icons
<DollarSign className="h-6 w-6" />  // Large icons
```

---

## 📖 When You Need More Info

### Quick References

- **Main Guide**: `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md` (30 min read)
- **Component List**: `/COMPONENT_AUDIT_AND_MIGRATION_PLAN.md` (10 min read)
- **Enforcement Rules**: `/DESIGN_SYSTEM_ENFORCEMENT.md` (15 min read)

### Component Documentation

- **Layout Components**: `/components/layout/README.md`
- **Workspace Components**: `/components/workspace/WORKSPACE_SYSTEM_DOCUMENTATION.md`
- **UI Components**: Check individual component files for JSDoc

### Code Examples

**Study these files** (best learning resource):
```
/components/PropertyDetailsV4.tsx              ← Detail page example
/components/PropertiesWorkspaceV4.tsx          ← Workspace example
/components/BuyerRequirementDetailsV4.tsx      ← Another detail page
/components/BuyerRequirementsWorkspaceV4.tsx   ← Another workspace
/components/AddPropertyFormV2.tsx              ← Form example
```

---

## ✅ Checklist Before Starting

**Before writing any code**:
- [ ] I know which template to use (Detail/Workspace/Form)
- [ ] I've checked if similar component exists
- [ ] I've copied a reference implementation
- [ ] I know the naming convention (EntityDetailsV4, etc.)
- [ ] I know not to use typography classes
- [ ] I know to use 8px grid spacing
- [ ] I know the UX limits (max 5 metrics, max 3 actions, etc.)

**If you checked all boxes, you're ready to start!**

---

## 🎯 Your First Component (Step by Step)

### Example: Creating "TeamDetailsV4"

**Step 1: Copy reference**
```bash
cp components/PropertyDetailsV4.tsx components/TeamDetailsV4.tsx
```

**Step 2: Update imports**
```tsx
import { Team, User } from '../types';  // Your types
```

**Step 3: Update interface**
```tsx
interface TeamDetailsV4Props {
  team: Team;        // Changed from 'property'
  user: User;
  onBack: () => void;
}
```

**Step 4: Update component name**
```tsx
export function TeamDetailsV4({  // Changed from PropertyDetailsV4
  team,                          // Changed from 'property'
  user,
  onBack,
}: TeamDetailsV4Props) {
```

**Step 5: Update pageHeader**
```tsx
const pageHeader = {
  title: team.name,              // Changed from property.title
  breadcrumbs: [
    { label: 'Teams', onClick: onBack },
    { label: team.name },
  ],
  metrics: [
    { label: 'Members', value: team.memberCount },
    { label: 'Projects', value: team.projectCount },
    // Add your team-specific metrics (max 5)
  ],
  // ... rest of config
};
```

**Step 6: Update tab content**
```tsx
// Replace property-specific content with team-specific content
const overviewContent = (
  <>
    <InfoPanel
      title="Team Information"
      data={[
        { label: 'Name', value: team.name },
        { label: 'Department', value: team.department },
        // Your team fields
      ]}
    />
  </>
);
```

**Step 7: Test**
```tsx
// In App.tsx
case 'team-details':
  return <TeamDetailsV4 team={selectedTeam} user={user} onBack={...} />;
```

**Done!** You now have a fully functional team details page that:
- Follows all design system standards
- Is consistent with the rest of the app
- Is accessible and responsive
- Took only 15-20 minutes to create

---

## 🆘 Common Questions

**Q: Can I create a custom component if templates don't fit?**  
A: 99% of the time, templates will fit. If you think you need custom, ask first.

**Q: Can I modify the template?**  
A: No. Templates are centralized. If you need a feature, request it for the template itself.

**Q: What if I need more than 5 metrics?**  
A: You don't. Group related metrics, or move some to the overview content.

**Q: Can I use text-xl just this once?**  
A: No. Let CSS handle typography. Consistency is non-negotiable.

**Q: Where do I put business logic?**  
A: In `/lib/` directory. Keep components focused on UI only.

**Q: How do I test accessibility?**  
A: Use keyboard navigation (Tab, Enter, Esc), check ARIA labels, test contrast.

---

**Start coding with confidence! The templates do the heavy lifting. You just provide the data.** 🚀

---

**Quick Start Version**: 1.0.0  
**Last Updated**: December 27, 2024  
**Time to Build First Component**: 15-20 minutes ⚡
