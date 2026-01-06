# 🎨 Visual Design Wireframes - aaraazi ERP

**Purpose:** Visual reference for UI/UX implementation  
**Date:** December 26, 2024

---

## 📐 Page Layouts

### 1. Workspace Page (List View)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ aaraazi                                    [Profile] [Settings] [Logout]  │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  WORKSPACE HEADER                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ Dashboard > Properties                                              │ │
│  │                                                                     │ │
│  │ Properties                                         [Filter] [≡|☷]  │ │
│  │ Manage your property portfolio                     [•••] [+ Add]   │ │
│  │                                                                     │ │
│  │ ──────────────────────────────────────────────────────────────────  │ │
│  │ 📊 Total: 150  ✅ Available: 45  📝 Listed: 30  ✓ Sold: 75        │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  SEARCH & FILTERS                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 Search properties...                          [Sort ▾] [View ▾]  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│  Active: [Status: Available ×] [Price: 30M-60M ×]           [Clear All]  │
│                                                                           │
│  DATA TABLE                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ □  Address ▲          Type      Price        Status        Actions  │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │ □  123 Main Street    House     PKR 50M      Available     [•••]    │ │
│  │ □  456 Park Avenue    Apartment PKR 30M      Listed        [•••]    │ │
│  │ □  789 Beach Road     Villa     PKR 80M      Under Offer   [•••]    │ │
│  │ □  321 Garden Lane    House     PKR 45M      Available     [•••]    │ │
│  │ □  654 Ocean View     Penthouse PKR 120M     Listed        [•••]    │ │
│  │ ...                                                                  │ │
│  │ [15 items selected]                                                  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  PAGINATION                                                               │
│  Showing 1-10 of 150     [◄] [1] 2 3 ... 15 [►]     [10 per page ▾]     │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Detail Page (Property/Cycle/Deal)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ aaraazi                                    [Profile] [Settings] [Logout]  │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PAGE HEADER                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ [← Back]  Dashboard > Properties > Marina Residences                │ │
│  │                                                                     │ │
│  │ Marina Residences - DHA Phase 8                [Edit] [•••] [×]     │ │
│  │ Luxury apartment complex in prime location                          │ │
│  │                                                                     │ │
│  │ ──────────────────────────────────────────────────────────────────  │ │
│  │ 💰 PKR 50M  📐 500 sq yd  🛏️ 3 Beds  🚿 2 Baths  ✅ Available     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  CONNECTED ENTITIES                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ Connected: [🏠 Property] | [👤 Agent: Sarah] | [🤝 Active Deal]     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  TABS                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ [Overview] Details  Activity  Documents  Timeline                   │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │                                                                     │ │
│  │  ┌───────────────────────────────┬───────────────────────────────┐  │ │
│  │  │ MAIN CONTENT (2/3)            │ SIDEBAR (1/3)                 │  │ │
│  │  │                               │                               │  │ │
│  │  │ Property Information          │ Quick Stats                   │  │ │
│  │  │ ┌───────────┬───────────┐     │ ┌───────────────────────────┐ │  │ │
│  │  │ │ Address   │ 123 Main  │     │ │ Days Listed: 45           │ │  │ │
│  │  │ │ Type      │ House     │     │ │ Offers: 3                 │ │  │ │
│  │  │ │ Area      │ 500 sq yd │     │ │ Views: 234                │ │  │ │
│  │  │ │ Price     │ PKR 50M   │     │ │ Last Updated: 2h ago      │ │  │ │
│  │  │ │ Bedrooms  │ 3         │     │ └───────────────────────────┘ │  │ │
│  │  │ │ Bathrooms │ 2         │     │                               │  │ │
│  │  │ └───────────┴───────────┘     │ Recent Activity               │  │ │
│  │  │                               │ ┌───────────────────────────┐ │  │ │
│  │  │ Status Timeline               │ │ • Offer received 2h ago   │ │  │ │
│  │  │ ────●────●────○────○          │ │ • Viewing scheduled       │ │  │ │
│  │  │ Listed→Offers→Contract→Sold   │ │ • Price updated          │ │  │ │
│  │  │                               │ └───────────────────────────┘ │  │ │
│  │  │ Active Offers (3)             │                               │  │ │
│  │  │ ┌─────────────────────────┐   │ Documents                     │  │ │
│  │  │ │Buyer    Amount   Status │   │ ┌───────────────────────────┐ │  │ │
│  │  │ ├─────────────────────────┤   │ │ 📄 Title Deed             │ │  │ │
│  │  │ │Ahmed    PKR 48M  Pending│   │ │ 📄 NOC                    │ │  │ │
│  │  │ │Sara     PKR 50M  Counter│   │ │ 📄 Valuation Report       │ │  │ │
│  │  │ │Khan     PKR 45M  Pending│   │ └───────────────────────────┘ │  │ │
│  │  │ └─────────────────────────┘   │                               │  │ │
│  │  │                               │                               │  │ │
│  │  └───────────────────────────────┴───────────────────────────────┘  │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Filter Panel (Slide-in from Right)

```
┌────────────────────────────────────────┐
│ Filters                           [×]  │
├────────────────────────────────────────┤
│                                        │
│ ▼ Status                               │
│   ☑ Available                          │
│   ☑ Listed                             │
│   ☐ Under Contract                     │
│   ☐ Sold                               │
│   ☐ Off Market                         │
│                                        │
│ ▼ Property Type                        │
│   ☑ House                              │
│   ☑ Apartment                          │
│   ☐ Villa                              │
│   ☐ Plot                               │
│   ☐ Commercial                         │
│                                        │
│ ▼ Price Range                          │
│   Min: [PKR 0         ]                │
│   Max: [PKR 100M      ]                │
│   ───●────────────●───                 │
│   0              100M                  │
│                                        │
│ ▼ Bedrooms                             │
│   [Any ▾] [1+] [2+] [3+] [4+] [5+]     │
│                                        │
│ ▼ Location                             │
│   ☑ DHA                                │
│   ☑ Clifton                            │
│   ☐ Gulshan                            │
│   ☐ PECHS                              │
│                                        │
│ ▼ Listed Date                          │
│   From: [2024-01-01]                   │
│   To:   [2024-12-31]                   │
│                                        │
├────────────────────────────────────────┤
│ [Clear All]              [Apply]       │
└────────────────────────────────────────┘
```

---

## 🎨 Component Designs

### DataTable - Normal State

```
┌───────────────────────────────────────────────────────────────┐
│ □  Property ▲         Type       Price        Status   Actions│
├───────────────────────────────────────────────────────────────┤
│ □  Marina Residences  Apartment  PKR 50M      Listed   [•••]  │
│ □  Ocean View         House      PKR 75M      Available[•••]  │
│ □  Garden Estate      Villa      PKR 120M     Sold     [•••]  │
└───────────────────────────────────────────────────────────────┘
```

### DataTable - Selected State

```
┌───────────────────────────────────────────────────────────────┐
│ ☑  Property ▲         Type       Price        Status   Actions│
├───────────────────────────────────────────────────────────────┤
│ ☑  Marina Residences  Apartment  PKR 50M      Listed   [•••]  │ ← Selected (blue bg)
│ □  Ocean View         House      PKR 75M      Available[•••]  │
│ ☑  Garden Estate      Villa      PKR 120M     Sold     [•••]  │ ← Selected (blue bg)
└───────────────────────────────────────────────────────────────┘
```

### DataTable - With Bulk Actions

```
┌───────────────────────────────────────────────────────────────┐
│ 2 items selected      [Export] [Edit] [Delete]           [×]  │
└───────────────────────────────────────────────────────────────┘
```

---

### InfoPanel - 2 Column Layout

```
┌─────────────────────────────────────────┐
│ Property Information                    │
├─────────────────────────────────────────┤
│ Address         Marina Residences       │
│ Type            Apartment               │
│ Area            500 sq yd               │
│ Price           💰 PKR 50,000,000       │
│ Bedrooms        3                       │
│ Bathrooms       2                       │
│ Status          ✅ Available            │
│ Agent           👤 Sarah Khan           │
└─────────────────────────────────────────┘
```

### InfoPanel - 3 Column Layout (Compact)

```
┌─────────────────────────────────────────────────────────┐
│ Property Information                                    │
├─────────────────────────────────────────────────────────┤
│ Address: 123 Main     Type: House      Area: 500 sq yd │
│ Price: PKR 50M        Beds: 3          Baths: 2        │
│ Status: Available     Agent: Sarah     Listed: 45d ago │
└─────────────────────────────────────────────────────────┘
```

---

### StatusTimeline - Horizontal

```
┌─────────────────────────────────────────────────────────┐
│ Listing Status                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Listed        Offers        Contract         Sold     │
│    ●────────────●────────────○──────────────○          │
│   Done        Done        Current       Pending        │
│  Jan 15       Feb 1        Feb 10                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

Legend:
● = Complete (green)
● = Current (blue, pulsing)
○ = Pending (gray)
```

---

### MetricCard - With Trend

```
┌─────────────────────────┐
│ 🏠                      │
│ Total Properties        │
│                         │
│ 150                     │
│                         │
│ ↗ +12% vs last month   │
└─────────────────────────┘

Colors:
- Background: White
- Border: Gray-200
- Number: Large, bold, primary color
- Trend up: Green
- Trend down: Red
- Trend neutral: Gray
```

---

### SmartSearch

```
┌───────────────────────────────────────────┐
│ 🔍 Search properties...              [×]  │
└───────────────────────────────────────────┘

States:
- Empty: Gray placeholder
- Typing: Show clear button (×)
- Loading: Show spinner
- Has results: Show count badge
```

---

### Filter Chips

```
Active Filters:
┌────────────────┐ ┌──────────────────┐ ┌────────────┐
│ Status: Listed │ │ Price: 30M-60M  │ │ Type: House │
│             [×]│ │              [×]│ │         [×]│
└────────────────┘ └──────────────────┘ └────────────┘
```

---

## 🎨 Color Palette

### Primary Colors

```
┌────────┐
│ #030213│ Primary (Navy)
└────────┘

┌────────┐
│ #ececf0│ Secondary (Light Gray)
└────────┘

┌────────┐
│ #e9ebef│ Accent
└────────┘

┌────────┐
│ #d4183d│ Destructive (Red)
└────────┘
```

---

### Status Colors

```
┌────────┐
│ #10b981│ Success (Green)
└────────┘

┌────────┐
│ #f59e0b│ Warning (Orange)
└────────┘

┌────────┐
│ #ef4444│ Error (Red)
└────────┘

┌────────┐
│ #3b82f6│ Info (Blue)
└────────┘
```

---

### Gray Scale

```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ #f9fafb│ │ #e5e7eb│ │ #9ca3af│ │ #4b5563│ │ #111827│
│  Gray-50│ │ Gray-200│ │ Gray-400│ │ Gray-600│ │ Gray-900│
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 📏 Spacing System (8px Grid)

```
Space-1:  8px   ████
Space-2:  16px  ████████
Space-3:  24px  ████████████
Space-4:  32px  ████████████████
Space-5:  40px  ████████████████████
Space-6:  48px  ████████████████████████
Space-8:  64px  ████████████████████████████████
```

---

## 🔤 Typography Scale

```
Text-xs:   12px  Small text
Text-sm:   14px  Body text (DEFAULT)
Text-base: 16px  Emphasized body
Text-lg:   18px  Section headers
Text-xl:   20px  Card titles
Text-2xl:  24px  Page titles
Text-3xl:  30px  Hero titles
```

---

## 📐 Layout Grid

### Desktop (1400px max-width)

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────────┬─────────────────────────────────────────┐  │
│ │Sidebar  │ Main Content Area                       │  │
│ │240px    │ Flexible (remaining space)              │  │
│ │         │                                         │  │
│ │         │ ┌─────────────────┬─────────────────┐   │  │
│ │         │ │2/3 Column       │1/3 Sidebar      │   │  │
│ │         │ │                 │                 │   │  │
│ │         │ └─────────────────┴─────────────────┘   │  │
│ └─────────┴─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Main Content (Full Width)           │ │
│ │                                     │ │
│ │ ┌───────────────┬───────────────┐   │ │
│ │ │1/2 Column     │1/2 Column     │   │ │
│ │ └───────────────┴───────────────┘   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────┐
│ ┌─────────────┐ │
│ │Full Width   │ │
│ │Single Column│ │
│ │             │ │
│ │Stacked      │ │
│ │Content      │ │
│ └─────────────┘ │
└─────────────────┘
```

---

## 🎯 Interactive States

### Button States

```
Normal:    [  Add Property  ]
Hover:     [  Add Property  ] ← Slightly darker bg
Active:    [  Add Property  ] ← Even darker bg, scale 0.98
Disabled:  [  Add Property  ] ← Gray, opacity 0.5
Loading:   [  ⟳ Loading...  ]
```

---

### Input States

```
Normal:    ┌────────────────┐
           │ Enter value... │
           └────────────────┘

Focus:     ┌────────────────┐ ← Blue border, shadow
           │ Enter value... │
           └────────────────┘

Error:     ┌────────────────┐ ← Red border
           │ Enter value... │
           └────────────────┘
           ⚠ This field is required

Success:   ┌────────────────┐ ← Green border
           │ Valid value    │
           └────────────────┘
           ✓ Looks good
```

---

### Table Row States

```
Normal:    │ Marina Residences  │ Apartment │ PKR 50M │

Hover:     │ Marina Residences  │ Apartment │ PKR 50M │ ← Light gray bg
           │                                  [View] [Edit] [Delete] │

Selected:  │ Marina Residences  │ Apartment │ PKR 50M │ ← Blue bg
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Single column, stacked layout */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column layout */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 3-column layout, sidebars */
}

/* Large Desktop */
@media (min-width: 1400px) {
  /* Max-width containers, centered */
}
```

---

## ✨ Animation Examples

### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 200ms ease;
}
```

---

### Slide In (from right)

```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slideInRight 300ms ease;
}
```

---

### Scale Pop

```css
@keyframes scalePop {
  0% { transform: scale(0.95); opacity: 0; }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

.scale-pop {
  animation: scalePop 200ms ease;
}
```

---

## 🎨 Shadow Depths

```
Shadow-sm:  Subtle lift (buttons, inputs)
            └──┘

Shadow:     Standard elevation (cards)
            └────┘

Shadow-md:  Medium elevation (dropdowns, popovers)
            └──────┘

Shadow-lg:  High elevation (modals, dialogs)
            └────────┘
```

---

## 📋 Form Layouts

### Vertical Form (Mobile-friendly)

```
┌─────────────────────────┐
│ Property Title          │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Property Type           │
│ ┌─────────────────────┐ │
│ │ Select type...    ▾ │ │
│ └─────────────────────┘ │
│                         │
│ Price                   │
│ ┌─────────────────────┐ │
│ │ PKR                 │ │
│ └─────────────────────┘ │
│                         │
│ [Cancel]      [Save]    │
└─────────────────────────┘
```

---

### Horizontal Form (Desktop)

```
┌───────────────────────────────────────────┐
│ Property Title  ┌───────────────────────┐ │
│                 │                       │ │
│                 └───────────────────────┘ │
│                                           │
│ Property Type   ┌───────────────────────┐ │
│                 │ Select type...      ▾ │ │
│                 └───────────────────────┘ │
│                                           │
│ Price (PKR)     ┌───────────────────────┐ │
│                 │                       │ │
│                 └───────────────────────┘ │
│                                           │
│                      [Cancel]    [Save]   │
└───────────────────────────────────────────┘
```

---

## 🎯 Loading States

### Table Loading

```
┌───────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓ │ ← Skeleton rows
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓ │
└───────────────────────────────────────┘
```

### Card Loading

```
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Skeleton title
│                     │
│ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓  │ ← Skeleton content
│ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓  │
│                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓        │ ← Skeleton text
└─────────────────────┘
```

---

## 📱 Mobile Considerations

### Touch Targets (Minimum 44x44px)

```
Good:
┌──────────┐
│  Button  │ ← 44px height
│          │
└──────────┘

Bad:
┌────────┐
│ Button │ ← 32px height (too small!)
└────────┘
```

---

### Mobile Navigation

```
┌─────────────────┐
│ aaraazi      ☰ │ ← Hamburger menu
├─────────────────┤
│                 │
│ [Search bar]    │
│                 │
│ Content         │
│                 │
└─────────────────┘

Menu open:
┌─────────────────┐
│ aaraazi      × │
│ ─────────────── │
│ Dashboard       │
│ Properties      │
│ Cycles          │
│ Requirements    │
│ Deals           │
│ Settings        │
└─────────────────┘
```

---

**This wireframe guide provides visual reference for implementing the UI/UX overhaul!**

**Use this alongside:**
- `/UI_UX_OVERHAUL_MASTER_PLAN.md` (detailed plan)
- `/QUICK_START_IMPLEMENTATION.md` (implementation steps)
- `/Guidelines.md` (coding standards)

---

**Created by:** AI Assistant  
**Date:** December 26, 2024  
**Let's build! 🎨**
