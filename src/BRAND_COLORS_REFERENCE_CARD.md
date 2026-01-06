# aaraazi Brand Colors - Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              aaraazi BRAND COLORS REFERENCE CARD                │
│                     Design System v2.0                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 PRIMARY BRAND COLORS

### 🟠 TERRACOTTA (Primary Accent - 10% Usage)
```
Primary:  #C17052  rgb(193, 112, 82)
Hover:    #A85D42  rgb(168, 93, 66)
Pressed:  #8F4A33  rgb(143, 74, 51)

USE FOR:
✓ Primary action buttons (Save, Add, Create)
✓ Links and clickable elements
✓ Active navigation states
✓ Important highlights

DO NOT USE FOR:
✗ Large backgrounds
✗ Body text
✗ Subtle borders
```

### 🟢 FOREST GREEN (Success & Growth - 10% Usage)
```
Primary:  #2D6A54  rgb(45, 106, 84)
Hover:    #255745  rgb(37, 87, 69)
Pressed:  #1E4637  rgb(30, 70, 55)

USE FOR:
✓ Success messages
✓ "Available" status badges
✓ Positive metrics (+12%, Growth)
✓ Confirmation actions

DO NOT USE FOR:
✗ Primary actions (use terracotta)
✗ Warning states
✗ Error messages
```

### 🟤 WARM CREAM (Neutral - 60% Usage)
```
Primary:  #E8E2D5  rgb(232, 226, 213)
Lighter:  #F5F4F1  rgb(245, 244, 241)
Darker:   #D4CFC3  rgb(212, 207, 195)

USE FOR:
✓ Page backgrounds (subtle)
✓ Section dividers
✓ Card backgrounds
✓ Hover states on neutral elements

DO NOT USE FOR:
✗ Text (too low contrast)
✗ Important borders
```

### ⚫ SLATE (Text & UI - 30% Usage)
```
Headings: #1A1D1F  rgb(26, 29, 31)   [Charcoal]
Body:     #363F47  rgb(54, 63, 71)   [Slate]
Icons:    #6B7580  rgb(107, 117, 128) [Slate-400]

USE FOR:
✓ All headings (charcoal #1A1D1F)
✓ Body text (slate #363F47)
✓ Icons and secondary text (#6B7580)
✓ Borders and dividers

DO NOT USE FOR:
✗ Large solid backgrounds
✗ Primary CTAs
```

---

## 📊 60-30-10 COLOR RATIO

```
███████████████████████████████████████████████████ 60% NEUTRAL
  └─ White, Cream, Light grays
  └─ Backgrounds, cards, sections

██████████████████████████ 30% SLATE
  └─ Charcoal, Slate, Dark grays
  └─ Text, icons, UI elements

█████ 10% ACCENT
  └─ Terracotta (7%) + Forest (3%)
  └─ Buttons, highlights, status
```

---

## 🎯 COMMON USE CASES

### Primary Button
```
Background:  #C17052 (terracotta-400)
Text:        #FFFFFF (white)
Hover:       #A85D42 (terracotta-500)
Pressed:     #8F4A33 (terracotta-600)
```

### Success Badge
```
Background:  #F2F7F5 (forest-50)
Text:        #163529 (forest-700)
Border:      #B3D9C8 (forest-200)
```

### Card
```
Background:  #FFFFFF (white)
Border:      #E8E2D5 (neutral-200)
Text:        #363F47 (slate-500)
Heading:     #1A1D1F (slate-700)
```

### Input Field
```
Background:  #F5F4F1 (neutral-100)
Border:      #D4CFC3 (neutral-300)
Focus:       #C17052 (terracotta-400)
Text:        #1A1D1F (slate-700)
```

---

## 🔤 TYPOGRAPHY

**Font**: Inter  
**Base Size**: 14px

```
H1:  26.25px  Semibold (600)  Charcoal (#1A1D1F)
H2:  21px     Semibold (600)  Charcoal (#1A1D1F)
H3:  17.5px   Semibold (600)  Charcoal (#1A1D1F)
H4:  14px     Semibold (600)  Charcoal (#1A1D1F)
Body: 14px    Normal (400)    Slate (#363F47)
Small: 12.25px Normal (400)   Slate-400 (#6B7580)
```

---

## 📏 SPACING

```
Card Padding:    24px  (was 16px)
Page Padding:    32-48px  (was 24px)
Section Gaps:    32-40px  (was 16-24px)
Element Gaps:    16-24px  (was 8-16px)
```

---

## ✅ STATUS COLORS

```
Available:  🟢 Forest-50 bg, Forest-700 text
Sold:       ⚪ Neutral-200 bg, Slate-600 text
Pending:    🟠 Terracotta-50 bg, Terracotta-700 text
Error:      🔴 Error-50 bg (#FEE2E2), Error-600 text
Warning:    🟡 Warning-50 bg (#FEF3C7), Warning-600 text
Info:       🔵 Info-50 bg (#DBEAFE), Info-600 text
```

---

## 🚫 COMMON MISTAKES

```
❌ Using #000000 (pure black) for text
✅ Use #1A1D1F (charcoal) instead

❌ Terracotta for large backgrounds
✅ Use for accents only (buttons, highlights)

❌ Tiny padding (8px, 12px)
✅ Use minimum 24px for cards

❌ Inconsistent spacing
✅ Stick to 4px grid: 16, 24, 32, 40

❌ Forgetting hover states
✅ Always add hover effects on buttons
```

---

## 🎨 ACCESSIBILITY

**WCAG AA Compliance** (4.5:1 contrast minimum)

```
✅ PASS: Forest-400 on White (6.8:1)
✅ PASS: Slate-500 on White (10.2:1)
⚠️  WARNING: Terracotta-400 on White (3.8:1)
   → Use Terracotta-500 for text on light backgrounds

✅ PASS: White on Forest-400 (6.8:1)
✅ PASS: White on Terracotta-500 (5.2:1)
```

---

## 💾 CSS VARIABLES

```css
/* Primary Actions */
--primary: #C17052;
--primary-hover: #A85D42;

/* Success */
--success: #2D6A54;
--success-bg: #F2F7F5;

/* Neutrals */
--neutral-0: #FFFFFF;
--neutral-200: #E8E2D5;

/* Text */
--slate-700: #1A1D1F;  /* Headings */
--slate-600: #363F47;  /* Body */
--slate-400: #6B7580;  /* Secondary */
```

---

## 🔗 QUICK LINKS

**View Test Page:**  
`?brand-test=true`

**Documentation:**
- BRAND_REDESIGN_PLAN.md
- BRAND_QUICK_REFERENCE.md
- IMPLEMENTATION_GUIDE.md

---

## 📱 CONTACT

**Design System Version**: 2.0.0  
**Last Updated**: January 2026  
**Brand**: aaraazi Real Estate Platform

---

```
┌─────────────────────────────────────────────────┐
│  PRINT THIS PAGE FOR QUICK REFERENCE            │
│  Keep it handy while designing/developing       │
└─────────────────────────────────────────────────┘
```

**Color Palette**: Terracotta • Forest • Cream • Slate  
**Design Principle**: 60-30-10 Color Ratio  
**Typography**: Inter Font Family  
**Spacing**: 30-50% more negative space

---

**aaraazi** - Professional Real Estate Management Platform 🏠
