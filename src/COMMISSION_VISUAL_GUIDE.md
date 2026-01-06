# Commission Management V2 - Visual Guide

## 📐 Complete UI Layout

```
╔══════════════════════════════════════════════════════════════════════╗
║                         COMMISSION MANAGEMENT                        ║
║  Configure and track commission splits across agents and agency     ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌─────────────────┬─────────────────┬─────────────────────────┐   ║
║  │ 💰 Commission   │ 🏠 Deal Price   │ ✅ Payout Trigger       │   ║
║  │ Rate (%)        │                 │                         │   ║
║  │                 │                 │                         │   ║
║  │  ┌───────────┐  │  PKR 2,000,000  │  ┌──────────────────┐  │   ║
║  │  │   2.5     │  │                 │  │ At Full Payment ▼│  │   ║
║  │  └───────────┘  │  (Read-only)    │  └──────────────────┘  │   ║
║  │                 │                 │                         │   ║
║  │  Total:         │                 │  When commission is     │   ║
║  │  PKR 50,000     │                 │  paid out               │   ║
║  └─────────────────┴─────────────────┴─────────────────────────┘   ║
║                                                                      ║
║                                          [💾 Save Configuration]    ║
╠══════════════════════════════════════════════════════════════════════╣
║  📊 COMMISSION ALLOCATION                                            ║
║                                                                      ║
║  Allocated: 100.0%                           Remaining: 0.0%        ║
║  ██████████████████████████████████████████████████████████         ║
║                                                                      ║
║  Total Allocated: PKR 50,000           Remaining: PKR 0             ║
╠══════════════════════════════════════════════════════════════════════╣
║  👥 AGENT COMMISSIONS                              [➕ Add Agent]   ║
║                                                                      ║
║  ┌────────────────────────────────────────────────────────────┐    ║
║  │ 👤 Asif Khan  [Internal] [Pending ▼]                🗑️     │    ║
║  │ asif@agency.com                                             │    ║
║  │                                                             │    ║
║  │ Percentage                                                  │    ║
║  │ ┌─────────┐                                                 │    ║
║  │ │  2.5    │  %     [⇄]     =  PKR 50,000                  │    ║
║  │ └─────────┘                                                 │    ║
║  └────────────────────────────────────────────────────────────┘    ║
║                                                                      ║
║  ┌────────────────────────────────────────────────────────────┐    ║
║  │ 👤 Sarah Ahmed  [External] [Approved ▼]             🗑️     │    ║
║  │ sarah@broker.com                                            │    ║
║  │                                                             │    ║
║  │ Amount                                                      │    ║
║  │ ┌─────────┐                                                 │    ║
║  │ │ 100000  │  PKR   [⇄]     =  5.0%                        │    ║
║  │ └─────────┘                                                 │    ║
║  │                                                             │    ║
║  │ ℹ️ Approved by Admin on Dec 31, 2024                       │    ║
║  └────────────────────────────────────────────────────────────┘    ║
╠══════════════════════════════════════════════════════════════════════╣
║  🏢 AGENCY COMMISSION                                                ║
║                                                                      ║
║  ┌────────────────────────────────────────────────────────────┐    ║
║  │ 🏢 Agency Split  [Paid ▼]                                   │    ║
║  │ Portion retained by the agency                              │    ║
║  │                                                             │    ║
║  │ Percentage                                                  │    ║
║  │ ┌─────────┐                                                 │    ║
║  │ │  90.0   │  %     [⇄]     =  PKR 1,800,000               │    ║
║  │ └─────────┘                                                 │    ║
║  │                                                             │    ║
║  │ ℹ️ Payment received on Dec 30, 2024                        │    ║
║  └────────────────────────────────────────────────────────────┘    ║
╠══════════════════════════════════════════════════════════════════════╣
║  ✅ VALIDATION                                                       ║
║                                                                      ║
║  ✓ Commission allocation is valid                                   ║
║    All splits total exactly 100% (PKR 2,000,000)                    ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Color Coding Legend

### Status Badges
```
┌──────────────┬──────────────┬────────────────────┐
│ Status       │ Color        │ Use Case           │
├──────────────┼──────────────┼────────────────────┤
│ Pending      │ 🟡 Yellow    │ Default state      │
│ Approved     │ 🟢 Green     │ Admin approved     │
│ Paid         │ 🔵 Blue      │ Payment completed  │
│ Cancelled    │ 🔴 Red       │ Commission void    │
│ On Hold      │ 🟠 Orange    │ Temporarily paused │
└──────────────┴──────────────┴────────────────────┘
```

### Agent Type Badges
```
┌──────────────┬──────────────┬────────────────────┐
│ Type         │ Color        │ Description        │
├──────────────┼──────────────┼────────────────────┤
│ Internal     │ 🔵 Blue      │ Agency employee    │
│ External     │ 🟠 Orange    │ Outside broker     │
└──────────────┴──────────────┴────────────────────┘
```

### Validation States
```
┌──────────────┬──────────────┬────────────────────┐
│ State        │ Color        │ Meaning            │
├──────────────┼──────────────┼────────────────────┤
│ Valid        │ 🟢 Green     │ Exactly 100%       │
│ Invalid      │ 🔴 Red       │ Over/under 100%    │
│ Warning      │ 🟡 Yellow    │ Close but not 100% │
└──────────────┴──────────────┴────────────────────┘
```

---

## 🔄 Toggle Animation Flow

### Percentage Mode → Amount Mode

```
BEFORE (Percentage Mode):
┌─────────────────────────────────────────────────┐
│ Percentage                                      │
│ ┌─────────┐                                     │
│ │  2.5    │  %     [⇄]     =  PKR 50,000       │
│ └─────────┘                                     │
│   input         toggle       calculated         │
└─────────────────────────────────────────────────┘

         [USER CLICKS ⇄ TOGGLE BUTTON]
                      ↓
                      ↓
                      ↓

AFTER (Amount Mode):
┌─────────────────────────────────────────────────┐
│ Amount                                          │
│ ┌─────────┐                                     │
│ │ 50000   │  PKR   [⇄]     =  2.5%             │
│ └─────────┘                                     │
│   input         toggle       calculated         │
└─────────────────────────────────────────────────┘
```

**What Happens**:
1. Input label changes: "Percentage" → "Amount"
2. Input value converts: `2.5` → `50000`
3. Input suffix changes: `%` → `PKR`
4. Calculated side updates: Shows percentage instead
5. Same data, different input format

---

## 📊 Allocation Progress Bar States

### State 1: Under-allocated (❌ Invalid)
```
Allocated: 85.0%                Remaining: 15.0%
█████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░
Total: PKR 42,500              Remaining: PKR 7,500

⚠️ Under-allocated by 15.0% (PKR 7,500)
```

### State 2: Perfect (✅ Valid)
```
Allocated: 100.0%               Remaining: 0.0%
███████████████████████████████████████████████████
Total: PKR 50,000              Remaining: PKR 0

✅ Commission allocation is valid
```

### State 3: Over-allocated (❌ Invalid)
```
Allocated: 105.0%               Remaining: -5.0%
███████████████████████████████████████████████████ (red)
Total: PKR 52,500              Remaining: PKR -2,500

⚠️ Over-allocated by 5.0% (PKR 2,500)
```

---

## 🎭 Interaction States

### Input Field States

#### Normal State
```
┌─────────────────┐
│     2.5         │ %
└─────────────────┘
  Default border
  Gray text
```

#### Focus State
```
┌═════════════════┐ ← Blue border (3px)
│     2.5 |       │ %
└═════════════════┘
  Blue outline
  Cursor visible
```

#### Disabled State
```
┌─────────────────┐
│     2.5         │ %  (grayed out)
└─────────────────┘
  Gray background
  Cursor not-allowed
```

#### Error State
```
┌─────────────────┐ ← Red border
│     150         │ %
└─────────────────┘
⚠️ Must be ≤ 100%
```

---

## 👆 Clickable Elements

### Status Badge (Admin Only)

**Default**:
```
[  Pending  ]  ← Hoverable
```

**Hover** (Admin):
```
[  Pending ▼ ]  ← Cursor: pointer, darker background
```

**Hover** (Non-admin):
```
[  Pending  ]  ← Cursor: default, no hover effect
```

**After Click** (Admin):
```
┌─────────────────────────────────────┐
│  Change Commission Status           │
├─────────────────────────────────────┤
│  Current: Pending                   │
│                                     │
│  New Status:                        │
│  ┌──────────────────────────────┐  │
│  │ Approved                    ▼│  │
│  └──────────────────────────────┘  │
│                                     │
│  Reason (optional):                 │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│      [Cancel]    [Confirm]         │
└─────────────────────────────────────┘
```

---

## 📱 Responsive Layout

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────┐
│  Header Card (3 columns)                        │
├─────────────────────────────────────────────────┤
│  Allocation Progress (full width)               │
├─────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  Agent 1         │  │  Agent 2         │    │
│  └──────────────────┘  └──────────────────┘    │
│  (2 columns grid)                               │
├─────────────────────────────────────────────────┤
│  Agency (full width)                            │
├─────────────────────────────────────────────────┤
│  Validation (full width)                        │
└─────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────────────┐
│  Header Card (2 columns)           │
│  ┌──────────┐  ┌──────────┐       │
│  │ Rate     │  │ Price    │       │
│  └──────────┘  └──────────┘       │
│  ┌──────────────────────────┐     │
│  │ Payout Trigger           │     │
│  └──────────────────────────┘     │
├────────────────────────────────────┤
│  Allocation Progress               │
├────────────────────────────────────┤
│  Agents (1 column)                 │
│  ┌──────────────────────────┐     │
│  │  Agent 1                 │     │
│  └──────────────────────────┘     │
│  ┌──────────────────────────┐     │
│  │  Agent 2                 │     │
│  └──────────────────────────┘     │
├────────────────────────────────────┤
│  Agency                            │
├────────────────────────────────────┤
│  Validation                        │
└────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│  Header (stacked)    │
│  ┌────────────────┐  │
│  │ Rate           │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Price          │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Trigger        │  │
│  └────────────────┘  │
├──────────────────────┤
│  Allocation          │
│  (smaller bars)      │
├──────────────────────┤
│  Agents (stack)      │
│  ┌────────────────┐  │
│  │  Agent 1       │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │  Agent 2       │  │
│  └────────────────┘  │
├──────────────────────┤
│  Agency              │
├──────────────────────┤
│  Validation          │
└──────────────────────┘
```

---

## 🎬 User Flow Diagrams

### Flow 1: Add New Agent

```
    START
      │
      ├─→ Click [+ Add Agent]
      │
      ├─→ Modal Opens
      │   │
      │   ├─→ Select Tab (Internal/External)
      │   │
      │   ├─→ Choose Person from List
      │   │
      │   ├─→ Enter Percentage
      │   │
      │   └─→ Click [Add Agent]
      │
      ├─→ Agent Added to List
      │
      ├─→ Allocation Bar Updates
      │
      └─→ END
```

### Flow 2: Toggle Input Mode

```
    START (Percentage Mode)
      │
      │   Display: [2.5] % = PKR 50,000
      │
      ├─→ User Clicks [⇄] Toggle
      │
      ├─→ Calculate: PKR = (Total × %) / 100
      │
      ├─→ Mode Changes to Amount
      │
      │   Display: [50000] PKR = 2.5%
      │
      ├─→ User Edits Amount: 52000
      │
      ├─→ Calculate: % = (Amount / Total) × 100
      │
      │   Display: [52000] PKR = 2.6%
      │
      ├─→ Allocation Bar Updates
      │
      └─→ END
```

### Flow 3: Save Configuration

```
    START
      │
      ├─→ User Makes Changes
      │   ├─→ Edit rate
      │   ├─→ Toggle modes
      │   ├─→ Adjust values
      │   └─→ Add/remove agents
      │
      ├─→ Real-time Validation
      │   │
      │   ├─→ Total = 100%? ────YES──→ ✅ Valid
      │   │                      │
      │   └─────NO──→ ❌ Invalid │
      │                          │
      ├─────────────────────────┘
      │
      ├─→ Click [Save Configuration]
      │
      ├─→ Validate Again
      │   │
      │   ├─→ Valid? ────YES──→ Continue
      │   │                    │
      │   └────NO──→ Show Error & STOP
      │                        │
      ├───────────────────────┘
      │
      ├─→ Update Deal in localStorage
      │
      ├─→ Show Success Toast
      │
      └─→ END
```

---

## 🎨 Visual Design Tokens

### Spacing
```
Padding:
  Small:  p-2   (8px)
  Medium: p-4   (16px)
  Large:  p-6   (24px)

Gap:
  Tight:  gap-2  (8px)
  Normal: gap-4  (16px)
  Loose:  gap-6  (24px)

Margin:
  Section: mb-6  (24px)
  Element: mb-4  (16px)
  Tight:   mb-2  (8px)
```

### Border Radius
```
Input:  rounded-md  (6px)
Card:   rounded-lg  (10px)
Badge:  rounded-full (999px)
```

### Typography
```
Heading:     text-lg  (18px) - font-semibold
Subheading:  text-base (16px) - font-medium
Body:        text-sm  (14px) - font-normal
Caption:     text-xs  (12px) - font-normal
```

### Shadows
```
Card:   border border-gray-200 (no shadow)
Hover:  hover:bg-gray-50
Focus:  ring-2 ring-blue-500
```

---

## 🎯 Component Anatomy

### Agent Row Breakdown
```
┌────────────────────────────────────────────────────────────┐
│ ┌─── Header Row ────────────────────────────────────────┐  │
│ │ 👤 Name  [Badge]  [Status ▼]              🗑️         │  │
│ │ ↑       ↑         ↑                        ↑          │  │
│ │ Icon    Type      Status (clickable)       Remove     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─── Contact Info (if available) ──────────────────────┐  │
│ │ email@example.com                                     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─── Input Row ─────────────────────────────────────────┐ │
│ │ Label                                                  │ │
│ │ ┌────────┐                                            │ │
│ │ │ Value  │ Unit  [⇄]  =  Calculated                  │ │
│ │ └────────┘                                            │ │
│ │  ↑        ↑     ↑      ↑                              │ │
│ │  Input   Suffix Toggle  Inverse                       │ │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─── Notes (if any) ────────────────────────────────────┐ │
│ │ ℹ️ Additional information...                          │ │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 🌈 Complete Color Palette

```
Primary Colors:
  #030213 - Dark Navy (Headers, Primary Text)
  #ececf0 - Light Gray (Backgrounds, Borders)

Success:
  #10b981 - Green (Valid states, Success)
  #d1fae5 - Light Green (Success backgrounds)

Error:
  #ef4444 - Red (Invalid states, Errors)
  #fee2e2 - Light Red (Error backgrounds)

Warning:
  #f59e0b - Orange (Warnings, External badges)
  #fed7aa - Light Orange (Warning backgrounds)

Info:
  #3b82f6 - Blue (Info, Internal badges)
  #dbeafe - Light Blue (Info backgrounds)

Neutral:
  #ffffff - White (Main background)
  #f9fafb - Off White (Card backgrounds)
  #6b7280 - Gray (Secondary text)
  #9ca3af - Light Gray (Disabled text)
```

---

## ✨ Animation & Transitions

### Hover Transitions
```
Duration: 150ms
Easing:   ease-in-out

Examples:
  Button:   background-color, box-shadow
  Input:    border-color, outline
  Badge:    background-color
  Toggle:   transform (rotate)
```

### Progress Bar
```
Duration: 300ms
Easing:   ease-out

Animation: width change
```

### Modal
```
Duration: 200ms
Easing:   ease-in-out

Animation: opacity, scale
```

---

## 📏 Measurement Reference

```
┌──────────────┬──────────┬─────────────────────┐
│ Element      │ Size     │ Notes               │
├──────────────┼──────────┼─────────────────────┤
│ Input Height │ 40px     │ Standard            │
│ Button       │ 40px     │ Standard            │
│ Icon         │ 16-20px  │ Varies by context   │
│ Badge        │ 24px     │ Height              │
│ Card Padding │ 24px     │ p-6                 │
│ Section Gap  │ 24px     │ space-y-6           │
│ Touch Target │ 44×44px  │ Minimum (mobile)    │
└──────────────┴──────────┴─────────────────────┘
```

---

## 🎓 Legend & Glossary

```
Symbol Key:
  💰 = Money/Financial
  🏠 = Property/Real Estate
  ✅ = Validation/Approval
  👤 = User/Person
  👥 = Multiple Users
  🏢 = Organization/Agency
  📊 = Statistics/Analytics
  ⇄  = Toggle/Switch
  🗑️ = Delete/Remove
  ➕ = Add/Create
  ℹ️ = Information
  ⚠️ = Warning
  ✓  = Success/Complete
  ✗  = Error/Invalid
```

---

**This visual guide provides a comprehensive reference for the Commission Management V2 UI design and interactions.**
