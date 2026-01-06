# Detail Page Architecture - Visual Reference

## 🏛️ Component Hierarchy

```
DetailPageTemplate (Root Container)
│
├── PageHeader
│   ├── Breadcrumbs (max 5)
│   ├── Title + Description
│   ├── Metrics (max 5) ← Miller's Law
│   ├── Primary Actions (1-3) ← Fitts's Law (large buttons)
│   ├── Secondary Actions (dropdown) ← Hick's Law
│   └── Status Badge
│
├── ConnectedEntitiesBar
│   └── Entity Pills (max 5) ← Miller's Law
│       ├── Icon
│       ├── Label
│       └── onClick → Navigation
│
└── Tabs Container
    ├── TabsList (max 7 tabs) ← Miller's Law
    │
    └── TabsContent (per tab)
        │
        ├── Layout: 2/3 + 1/3 (Overview tabs)
        │   ├── Left Column (2/3 width)
        │   │   ├── StatusTimeline
        │   │   ├── InfoPanel (Section 1)
        │   │   ├── InfoPanel (Section 2)
        │   │   ├── InfoPanel (Section 3)
        │   │   └── PaymentSummaryPanel
        │   │
        │   └── Right Column (1/3 width)
        │       ├── QuickActionsPanel
        │       ├── MetricCardsGroup
        │       └── SummaryStatsPanel
        │
        ├── Layout: 3/0 (Full width - Tables)
        │   ├── MetricCardsGroup (Summary)
        │   └── DataTable
        │       ├── Header with action
        │       ├── Column definitions
        │       ├── Data rows
        │       └── Empty/Loading states
        │
        └── Layout: 1/1 (Split view)
            ├── Left Panel
            └── Right Panel
```

---

## 📐 Responsive Layout Breakpoints

```
Mobile (< 768px):
┌─────────────────────┐
│ PageHeader          │
├─────────────────────┤
│ Entities (scroll)   │
├─────────────────────┤
│ Tabs                │
├─────────────────────┤
│ Content (stacked)   │
│ ├─ Main Content     │
│ └─ Sidebar          │
└─────────────────────┘

Tablet (768px - 1023px):
┌─────────────────────────────────┐
│ PageHeader                      │
├─────────────────────────────────┤
│ Entities Bar                    │
├─────────────────────────────────┤
│ Tabs                            │
├─────────────────────────────────┤
│ Content (side-by-side)          │
│ ├──────────────┬──────────────┤ │
│ │ Main (2/3)   │ Sidebar (1/3)│ │
│ └──────────────┴──────────────┘ │
└─────────────────────────────────┘

Desktop (≥ 1024px):
┌──────────────────────────────────────────┐
│ PageHeader                               │
│ Breadcrumbs | Title | Metrics | Actions  │
├──────────────────────────────────────────┤
│ Entity1 | Entity2 | Entity3 | Entity4    │
├──────────────────────────────────────────┤
│ Overview | Data | Payments | Activity    │
├──────────────────────────────────────────┤
│ ┌────────────────────────┬─────────────┐ │
│ │ Main Content (2/3)     │ Sidebar (1/3)│ │
│ │                        │             │ │
│ │ • StatusTimeline       │ • Actions   │ │
│ │ • InfoPanel x3         │ • Metrics   │ │
│ │ • PaymentSummary       │ • Stats     │ │
│ │                        │             │ │
│ └────────────────────────┴─────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🎨 Color-Coded Component Map

```
┌─────────────────────────────────────────────────┐
│ 🔵 PageHeader (Foundation - Always Present)    │ ← Jakob's Law
├─────────────────────────────────────────────────┤
│ 🟢 ConnectedEntitiesBar (Optional - Max 5)     │ ← Miller's Law
├─────────────────────────────────────────────────┤
│ 🟡 Tabs (Max 7 tabs)                           │ ← Miller's Law
│ ┌─────────────────────────────┬─────────────┐  │
│ │ 🟠 Left Content             │ 🟣 Sidebar  │  │
│ │                             │             │  │
│ │ StatusTimeline (purple)     │ QuickActions│  │
│ │ ├─ Complete steps (green)   │ (max 7)     │  │ ← Miller's Law
│ │ ├─ Current step (blue)      │             │  │
│ │ └─ Pending steps (gray)     │ MetricCards │  │
│ │                             │ (max 5)     │  │ ← Miller's Law
│ │ InfoPanel (white cards)     │             │  │
│ │ ├─ Title (base text)        │ StatsSummary│  │
│ │ ├─ 2-column grid            │ (max 7)     │  │ ← Miller's Law
│ │ └─ Label-Value pairs        │             │  │
│ │                             │             │  │
│ │ DataTable (full width)      │             │  │
│ │ ├─ Header (gray-50)         │             │  │
│ │ ├─ Rows (hover: gray-50)    │             │  │
│ │ └─ Empty state              │             │  │
│ │                             │             │  │
│ └─────────────────────────────┴─────────────┘  │
└─────────────────────────────────────────────────┘

Legend:
🔵 Foundation (always visible)
🟢 Context-dependent
🟡 Navigation
🟠 Primary content
🟣 Secondary content
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│ Parent Component                            │
│ (e.g., SellCycleDetails)                    │
│                                             │
│ Data Sources:                               │
│ • cycle (from API/localStorage)             │
│ • property (from API/localStorage)          │
│ • user (from context)                       │
│ • offers, payments, etc.                    │
└───────────────┬─────────────────────────────┘
                │
                ├──────────────────────────────────┐
                │                                  │
                ▼                                  ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│ Build Configuration       │    │ Build Content Components  │
│                           │    │                           │
│ • pageHeader props        │    │ • overviewContent (JSX)   │
│ • connectedEntities[]     │    │ • overviewSidebar (JSX)   │
│ • tabs[] definition       │    │ • offersContent (JSX)     │
│                           │    │ • activityContent (JSX)   │
└───────────┬───────────────┘    └──────────┬────────────────┘
            │                               │
            │                               │
            └───────────┬───────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │ DetailPageTemplate            │
        │                               │
        │ • Receives configuration      │
        │ • Manages tab state           │
        │ • Handles layout              │
        │ • Renders structure           │
        └───────────────────────────────┘
                        │
                        ├────────────────────┬────────────────┐
                        ▼                    ▼                ▼
            ┌──────────────────┐  ┌─────────────────┐  ┌──────────────┐
            │ PageHeader       │  │ EntitiesBar     │  │ Tabs         │
            └──────────────────┘  └─────────────────┘  └──────────────┘
                                                                │
                                                                ├──────────┬────────────┐
                                                                ▼          ▼            ▼
                                                        ┌─────────┐  ┌────────┐  ┌─────────┐
                                                        │Overview │  │Offers  │  │Activity │
                                                        │  Tab    │  │  Tab   │  │   Tab   │
                                                        └─────────┘  └────────┘  └─────────┘
```

---

## 🧩 Component Composition Patterns

### **Pattern 1: Information Display**
```
InfoPanel (Container)
└─ Grid Layout (2-4 columns)
   └─ InfoPanelItem[] (Each item)
      ├─ Label (text-xs, uppercase)
      ├─ Value (text-sm, medium weight)
      ├─ Icon (optional)
      └─ Copy button (if copyable)
```

### **Pattern 2: Metric Display**
```
MetricCard (Individual)
├─ Icon + Label (top)
├─ Large Value (center)
├─ Trend indicator (optional)
└─ Comparison text (optional)

MetricCardsGroup (Collection)
└─ Responsive Grid (2-5 columns)
   └─ MetricCard[] (max 5)
```

### **Pattern 3: Timeline**
```
StatusTimeline (Horizontal)
└─ Steps[] (max 7)
   └─ Each Step
      ├─ Status indicator (dot/check)
      ├─ Label
      ├─ Date (optional)
      ├─ Description (optional)
      └─ Connector line
```

### **Pattern 4: Actions**
```
QuickActionsPanel (Sidebar)
├─ Title
└─ Action Buttons (max 7)
   └─ Each Button (40px height)
      ├─ Icon (16px)
      ├─ Label
      ├─ Loading state
      └─ Disabled state
```

### **Pattern 5: Data Table**
```
DataTable (Full component)
├─ Header Section
│  ├─ Title
│  └─ Action button
├─ Table
│  ├─ Column Headers (gray-50 bg)
│  ├─ Data Rows (hover effect)
│  │  └─ Cells (custom render)
│  └─ States
│     ├─ Loading (spinner)
│     └─ Empty (message)
└─ Optional: Pagination
```

---

## 📊 UX Laws Implementation Map

```
FITTS'S LAW (Targeting)
├─ PageHeader primary actions: 44x44px min ✓
├─ QuickActions buttons: 40px height ✓
├─ Table row height: 40px+ ✓
└─ Optimal placement: Top-right corner ✓

MILLER'S LAW (Cognitive Load)
├─ PageHeader metrics: Max 5 ✓
├─ Tabs: Max 7 ✓
├─ QuickActions: Max 7 ✓
├─ ConnectedEntities: Max 5 ✓
└─ MetricCardsGroup: Max 5 ✓

HICK'S LAW (Decision Time)
├─ Primary actions: 1-3 visible ✓
├─ Secondary actions: In dropdown ✓
├─ Progressive disclosure: Tabs ✓
└─ Filters: In popovers ✓

JAKOB'S LAW (Familiarity)
├─ Breadcrumbs: Top-left ✓
├─ Actions: Top-right ✓
├─ Tabs: Below header ✓
└─ Sidebar: Right column ✓

AESTHETIC-USABILITY
├─ Spacing: 8px grid system ✓
├─ Colors: aaraazi palette ✓
├─ Typography: Consistent ✓
└─ Animations: Smooth transitions ✓
```

---

## 🎯 Quick Reference: When to Use Each Component

| Component | Use When | Max Items | Location |
|-----------|----------|-----------|----------|
| **PageHeader** | Every detail page | 5 metrics | Top |
| **ConnectedEntitiesBar** | Related entities exist | 5 entities | Below header |
| **StatusTimeline** | Multi-step process | 7 steps | Left column, top |
| **InfoPanel** | Label-value data | No limit | Left column |
| **MetricCard** | Single important stat | - | Sidebar or grid |
| **MetricCardsGroup** | Multiple metrics | 5 cards | Any location |
| **QuickActionsPanel** | Common actions | 7 actions | Sidebar, top |
| **SummaryStatsPanel** | Simple stats | 7 stats | Sidebar |
| **DataTable** | Lists/collections | Paginate > 50 | Full width |
| **PaymentSummaryPanel** | Payment tracking | - | Left or full |
| **ActivityTimeline** | Activity feed | No limit | Full width |

---

## 🔍 Component Selection Decision Tree

```
Need to display information?
│
├─ Single important number?
│  └─ Use: MetricCard
│
├─ Multiple metrics (2-5)?
│  └─ Use: MetricCardsGroup
│
├─ Label-value pairs?
│  └─ Use: InfoPanel
│
├─ Simple stats with icons?
│  └─ Use: SummaryStatsPanel
│
├─ Process progression?
│  └─ Use: StatusTimeline
│
├─ List of items/records?
│  └─ Use: DataTable
│
├─ Payment information?
│  └─ Use: PaymentSummaryPanel
│
├─ Chronological events?
│  └─ Use: ActivityTimeline
│
└─ Action buttons?
   └─ Use: QuickActionsPanel
```

---

## 💡 Best Practices Summary

### **DO:**
✅ Use DetailPageTemplate for all detail pages  
✅ Follow the 2/3 + 1/3 layout for Overview tabs  
✅ Limit metrics to 5 in PageHeader  
✅ Place QuickActions in sidebar  
✅ Use InfoPanel for structured data  
✅ Apply StatusBadge for all statuses  
✅ Include breadcrumbs for navigation  
✅ Show empty states in tables  
✅ Add loading states for async data  
✅ Use relative time in ActivityTimeline  

### **DON'T:**
❌ Exceed Miller's Law limits (5-7 items)  
❌ Create custom layouts without template  
❌ Mix different metric components  
❌ Skip ConnectedEntitiesBar if entities exist  
❌ Use inline styles (use Tailwind classes)  
❌ Hardcode colors (use design system)  
❌ Forget responsive breakpoints  
❌ Ignore empty/loading states  
❌ Create tables without DataTable component  
❌ Put actions in random locations  

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Reference Guide ✅
