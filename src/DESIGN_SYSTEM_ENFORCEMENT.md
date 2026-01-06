# Design System V4 - Enforcement Guidelines

**Version**: 1.0.0  
**Date**: December 27, 2024  
**Status**: Mandatory for All New Development ⚠️

---

## 🚫 CRITICAL RULES - NO EXCEPTIONS

### Rule 1: Template-First Development

**MANDATORY**: Every new page MUST use one of the three official templates.

```tsx
// ❌ FORBIDDEN - Creating custom page layout
export const MyNewPage = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Title</h1>
        <button>Action</button>
      </div>
      <div className="content">...</div>
    </div>
  );
};

// ✅ REQUIRED - Using official template
export const MyNewPageV4 = () => {
  return (
    <DetailPageTemplate
      pageHeader={pageHeader}
      tabs={tabs}
    />
  );
};
```

**Templates**:
1. **DetailPageTemplate** - For all detail pages (showing single entity)
2. **WorkspaceTemplate** - For all list/grid pages (showing multiple entities)
3. **FormTemplate** - For all forms (create/edit)

**Violations**: Any PR with custom page layouts will be rejected.

---

### Rule 2: Component Reuse - NEVER Recreate

**MANDATORY**: Before creating ANY component, check if it exists.

**Component Library Locations**:
```
/components/layout/        ← Page-level components
/components/workspace/     ← Workspace components
/components/forms/         ← Form components
/components/ui/            ← UI primitives
```

**Checklist Before Creating Component**:
- [ ] Searched `/components/layout/` for similar component
- [ ] Searched `/components/workspace/` for similar component
- [ ] Searched `/components/ui/` for similar component
- [ ] Reviewed `DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`
- [ ] Confirmed component does NOT exist

**If component exists**: Use it. No exceptions.

**Violations**: Recreating existing components will result in PR rejection.

---

### Rule 3: Naming Conventions - STRICT

**MANDATORY**: All new components must follow exact naming conventions.

```tsx
// ✅ CORRECT NAMING
PropertyDetailsV4.tsx        // Detail page
PropertiesWorkspaceV4.tsx    // Workspace page
AddPropertyFormV2.tsx        // Add form
EditPropertyFormV2.tsx       // Edit form

// ❌ FORBIDDEN NAMING
PropertyDetail.tsx           // Missing V4
PropertiesList.tsx          // Use "Workspace" not "List"
PropertyForm.tsx            // Ambiguous - Add or Edit?
property-details.tsx        // Wrong case
```

**Naming Rules**:
- Detail pages: `{Entity}DetailsV4.tsx`
- Workspace pages: `{Entities}WorkspaceV4.tsx`
- Add forms: `Add{Entity}FormV2.tsx`
- Edit forms: `Edit{Entity}FormV2.tsx`
- Components: `PascalCase`
- Never use: `kebab-case`, `snake_case`, or `camelCase` for files

**Violations**: Wrong naming will result in PR rejection.

---

### Rule 4: No Tailwind Typography Classes

**MANDATORY**: Never use Tailwind typography classes unless explicitly overriding.

```tsx
// ❌ FORBIDDEN
<h1 className="text-2xl font-bold">Title</h1>
<p className="text-sm font-medium">Text</p>

// ✅ REQUIRED
<h1>Title</h1>                    // Let CSS handle it
<p>Text</p>                       // Let CSS handle it

// ✅ EXCEPTION - Only when explicitly needed
<p className="text-sm">Override small text</p>
```

**Why**: Typography is handled by `/styles/globals.css` to ensure consistency.

**Violations**: Using typography classes without justification will be flagged in code review.

---

### Rule 5: 8px Grid Spacing

**MANDATORY**: All spacing must be multiples of 8px.

```tsx
// ✅ CORRECT - 8px grid
className="p-2"     // 8px
className="p-4"     // 16px
className="p-6"     // 24px
className="gap-4"   // 16px
className="space-y-6" // 24px

// ❌ FORBIDDEN - Not on grid
className="p-3"     // 12px
className="gap-5"   // 20px
className="space-y-7" // 28px
```

**Valid spacing values**: `2, 4, 6, 8, 12, 16, 20, 24, 32`

**Violations**: Non-grid spacing will be flagged in code review.

---

### Rule 6: UX Laws Compliance

**MANDATORY**: All components must follow the 5 UX Laws.

#### Fitts's Law (Targeting)
- ✅ Primary buttons: Minimum 44x44px
- ✅ Optimal placement for primary actions
```tsx
<Button size="lg" className="min-w-[120px] min-h-[44px]">
  Primary Action
</Button>
```

#### Miller's Law (Cognitive Load)
- ✅ Max 5 metrics in PageHeader
- ✅ Max 7 quick filters
- ✅ Max 5 stats in panels
- ✅ Max 5 entities in ConnectedEntitiesBar
```tsx
// ❌ TOO MANY - Violates Miller's Law
<PageHeader
  metrics={[
    metric1, metric2, metric3, metric4,
    metric5, metric6, metric7, metric8, // Too many!
  ]}
/>

// ✅ CORRECT - Max 5 metrics
<PageHeader
  metrics={[
    metric1, metric2, metric3, metric4, metric5
  ]}
/>
```

#### Hick's Law (Decision Time)
- ✅ Max 3 primary actions
- ✅ Secondary actions in dropdown
```tsx
// ✅ CORRECT
<PageHeader
  primaryActions={[
    action1, action2, action3 // Max 3
  ]}
  secondaryActions={[
    action4, action5, action6, ... // Many in dropdown
  ]}
/>
```

#### Jakob's Law (Familiarity)
- ✅ Breadcrumbs top-left
- ✅ Primary actions top-right
- ✅ Standard patterns everywhere

#### Aesthetic-Usability Effect
- ✅ Consistent spacing (8px grid)
- ✅ Professional appearance
- ✅ Smooth transitions (200ms)

**Violations**: Components violating UX Laws will be rejected.

---

### Rule 7: Accessibility - NON-NEGOTIABLE

**MANDATORY**: All components must be accessible.

**Requirements**:
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (Tab, Enter, Esc, Arrows)
- ✅ Visible focus indicators (3px blue outline)
- ✅ Color contrast WCAG 2.1 AA (4.5:1 minimum)
- ✅ Screen reader compatible

```tsx
// ✅ CORRECT - Accessible
<Button
  onClick={handleAction}
  aria-label="Add new property"
>
  <Plus className="h-4 w-4" />
  <span className="sr-only">Add Property</span>
</Button>

// ❌ FORBIDDEN - Not accessible
<div onClick={handleAction}>
  <Plus />
</div>
```

**Violations**: Non-accessible components will be rejected.

---

## ⚠️ MANDATORY CHECKLISTS

### Before Creating ANY Component

- [ ] Checked `/components/layout/` - component doesn't exist
- [ ] Checked `/components/workspace/` - component doesn't exist
- [ ] Checked `/components/ui/` - component doesn't exist
- [ ] Checked `/components/forms/` - component doesn't exist
- [ ] Read `DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`
- [ ] Determined correct template to use
- [ ] Confirmed naming follows conventions

### Before Submitting PR

**Design System Compliance**:
- [ ] Uses official template (DetailPageTemplate, WorkspaceTemplate, or FormTemplate)
- [ ] No custom layouts (uses PageHeader/WorkspaceHeader)
- [ ] No recreated components
- [ ] Follows 8px grid spacing
- [ ] Uses CSS variables for colors
- [ ] No Tailwind typography classes (unless justified)
- [ ] Correct naming convention

**UX Laws**:
- [ ] Fitts's Law: Primary actions large (44x44px)
- [ ] Miller's Law: Max 5-7 items in groups
- [ ] Hick's Law: Max 3 primary actions
- [ ] Jakob's Law: Standard patterns used
- [ ] Aesthetic-Usability: Professional appearance

**Accessibility**:
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works
- [ ] Visible focus indicators
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader compatible (or will be tested)

**Performance**:
- [ ] Component memoized if pure (React.memo)
- [ ] Event handlers memoized (useCallback)
- [ ] Calculations memoized (useMemo)
- [ ] Large lists paginated/virtualized

**Code Quality**:
- [ ] TypeScript strict mode compliant
- [ ] No `any` types without justification
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] JSDoc comments for complex logic

---

## 🔍 CODE REVIEW CRITERIA

### Automatic Rejection Criteria

**These violations will result in immediate PR rejection**:

1. ❌ Custom page layout (not using template)
2. ❌ Recreated component that already exists
3. ❌ Wrong naming convention
4. ❌ More than 5 metrics in PageHeader
5. ❌ More than 3 primary actions
6. ❌ More than 7 quick filters
7. ❌ No ARIA labels on interactive elements
8. ❌ No keyboard navigation
9. ❌ Typography classes without justification
10. ❌ Spacing not on 8px grid

### Warning Criteria

**These will require explanation/justification**:

1. ⚠️ Typography class override (must justify)
2. ⚠️ Custom color (must justify)
3. ⚠️ Non-standard spacing (must justify)
4. ⚠️ New component (must explain why existing doesn't work)
5. ⚠️ Performance impact (must benchmark)

### Approval Criteria

**PR will be approved if**:

1. ✅ Uses official template
2. ✅ Reuses existing components
3. ✅ Follows all naming conventions
4. ✅ Follows all UX Laws
5. ✅ Passes accessibility checklist
6. ✅ Passes quality checklist
7. ✅ Has proper documentation
8. ✅ No regressions in functionality

---

## 📚 REQUIRED READING

**Before ANY development**:

1. **DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md** (Main guide)
2. **COMPONENT_AUDIT_AND_MIGRATION_PLAN.md** (What exists)
3. **This document** (Enforcement rules)

**Reference Implementations**:

Study these before creating similar components:

- **Detail Pages**: `PropertyDetailsV4.tsx`, `BuyerRequirementDetailsV4.tsx`
- **Workspace Pages**: `PropertiesWorkspaceV4.tsx`, `BuyerRequirementsWorkspaceV4.tsx`
- **Forms**: `AddPropertyFormV2.tsx`, `AddBuyerRequirementFormV2.tsx`

---

## 🚨 EMERGENCY EXCEPTIONS

**Only in these cases can rules be broken**:

1. **Critical bug fix** (security or data loss)
   - Document exception in PR
   - Create follow-up ticket to fix properly

2. **External library limitation**
   - Document limitation in code
   - Create follow-up ticket to find alternative

3. **Temporary workaround**
   - Add `// TODO: Fix after V4 migration` comment
   - Create follow-up ticket immediately

**All exceptions must**:
- Be documented in code with comments
- Have follow-up ticket created
- Be approved by lead developer
- Be temporary (max 1 sprint)

---

## 📊 METRICS & MONITORING

### Component Compliance Tracking

**Monthly metrics**:
- % of components using V4 templates
- % of components following UX Laws
- % of components passing accessibility checks
- Number of violations in code review
- Time to migrate old components

**Goals**:
- 100% of new components use V4 templates
- 0 violations in code review
- All existing components migrated within 4 weeks

### Quality Gates

**Cannot merge PR if**:
- Uses custom layout (not template)
- Violates UX Laws
- Fails accessibility checklist
- Has wrong naming convention
- Recreates existing component

---

## 🎯 SUCCESS CRITERIA

### Individual Component

A component is considered "V4 compliant" if:
- ✅ Uses official template OR exists in component library
- ✅ Follows all naming conventions
- ✅ Follows all 5 UX Laws
- ✅ Passes accessibility checklist
- ✅ Passes quality checklist
- ✅ Has proper documentation
- ✅ No design system violations

### Entire Application

The application is "V4 complete" when:
- ✅ 100% of detail pages use DetailPageTemplate
- ✅ 100% of workspace pages use WorkspaceTemplate
- ✅ 100% of forms use FormTemplate
- ✅ 0 custom page layouts exist
- ✅ 0 recreated components exist
- ✅ All components follow Guidelines.md
- ✅ All components are accessible
- ✅ Design is consistent across all modules

---

## 🆘 NEED HELP?

### Questions to Ask Before Starting

1. "Does this component already exist?"
   → Check `/components/` directories

2. "Which template should I use?"
   → Detail page? → DetailPageTemplate
   → List page? → WorkspaceTemplate
   → Form? → FormTemplate

3. "Can I create a custom layout?"
   → NO. Use templates.

4. "Can I recreate this component?"
   → NO. Use existing components.

5. "Can I use text-2xl?"
   → NO (unless explicitly overriding for good reason).

6. "Can I use p-3 (12px spacing)?"
   → NO. Use 8px grid (p-2, p-4, p-6, p-8).

### Where to Find Help

- **Main Guide**: `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`
- **Component Audit**: `/COMPONENT_AUDIT_AND_MIGRATION_PLAN.md`
- **Reference Code**: Study `PropertyDetailsV4.tsx` and `PropertiesWorkspaceV4.tsx`
- **Component Docs**: `/components/layout/README.md`
- **Workspace Docs**: `/components/workspace/WORKSPACE_SYSTEM_DOCUMENTATION.md`

### When in Doubt

> "If an existing component does 90% of what you need, use it and extend it. Don't create a new one from scratch."

> "If you're not sure which template to use, look at similar pages and use the same template."

> "If you think you need to break a rule, ask first. There's usually a better way."

---

## ✅ FINAL CHECKLIST

**Before committing any code**:

- [ ] I have read the Design System V4 Comprehensive Guide
- [ ] I have checked if components already exist
- [ ] I am using the correct template
- [ ] I am following naming conventions
- [ ] I am not using typography classes
- [ ] I am using 8px grid spacing
- [ ] I am following all 5 UX Laws
- [ ] My component is accessible
- [ ] My component has proper documentation
- [ ] I have tested on mobile, tablet, and desktop
- [ ] I am ready for code review

**If you answered NO to any of these, fix it before submitting PR.**

---

**Version**: 1.0.0  
**Status**: MANDATORY ⚠️  
**Effective**: Immediately  
**Last Updated**: December 27, 2024

**This document supersedes all previous design guidelines.**
