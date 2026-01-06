# Dashboard V4 - Phase 1 Testing Guide

**Phase**: 1 - Foundation  
**Status**: Ready for Testing  
**Date**: January 5, 2026  

---

## 🧪 Quick Start Testing

### 1. Start the Application
```bash
npm run dev
# or
yarn dev
```

### 2. Login to the Application
- Use your test credentials
- Select "Agency Module" if prompted

### 3. Navigate to Dashboard
- Should load automatically on login
- Or click "Dashboard" in the sidebar

---

## ✅ Visual Testing Checklist

### Header Section
```
Expected to see:
┌─────────────────────────────────────────────────────────────┐
│ Good [morning/afternoon/evening], [YourName] 👋             │
│ Here's what needs your attention today                      │
│                                                              │
│ Active: 8  |  This Month: PKR 4.5M  |  Available: 12       │
│                                            🔔 🔍 ⚙️         │
└─────────────────────────────────────────────────────────────┘
```

**Check**:
- [ ] Greeting changes based on time (morning/afternoon/evening)
- [ ] Your name appears in greeting
- [ ] Description shows contextual message
- [ ] Three stats visible in header
- [ ] Three action icons on the right (Bell, Search, Settings)

---

### Hero Metrics Section
```
Expected to see:
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  📈          │  💰          │  🏢          │  📊          │
│ Active       │ This Month   │ Available    │ Conversion   │
│ Pipeline     │ Revenue      │ Inventory    │ Rate         │
│              │              │              │              │
│ PKR 15.2M    │ PKR 4.5M     │ 12           │ 32%          │
│ ↑ 12 8 deals │ ↑ 15 vs last │ properties   │ ↑ 8 vs last  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Check**:
- [ ] All 4 metric cards visible
- [ ] Icons render correctly (chart, dollar, building, bar chart)
- [ ] Labels show: "Active Pipeline", "This Month Revenue", "Available Inventory", "Conversion Rate"
- [ ] Values show: "PKR 15.2M", "PKR 4.5M", "12", "32%"
- [ ] Trend arrows visible (↑) with green color
- [ ] Comparison text visible below trends
- [ ] Cards have white background
- [ ] Cards have warm cream border (#E8E2D5)

---

### Color Testing

**Forest Green (#2D6A54)**:
- [ ] Active Pipeline icon background (light green tint)
- [ ] Active Pipeline icon color (forest green)
- [ ] Conversion Rate icon background
- [ ] Conversion Rate icon color
- [ ] Trend up arrows (green)

**Terracotta (#C17052)**:
- [ ] This Month Revenue icon background (light terracotta tint)
- [ ] This Month Revenue icon color (terracotta)

**Slate (#363F47)**:
- [ ] Available Inventory icon background (light slate tint)
- [ ] Available Inventory icon color (slate)
- [ ] Label text color (all cards)

**Warm Cream (#E8E2D5)**:
- [ ] Card borders
- [ ] Placeholder section backgrounds

**Charcoal (#1A1D1F)**:
- [ ] Card value text (large numbers)

---

### Typography Testing

**CRITICAL**: Verify NO Tailwind typography classes are visible

Open browser DevTools → Inspect metric card value:
- [ ] Should NOT see classes like: `text-3xl`, `font-bold`, `font-semibold`, `text-lg`, etc.
- [ ] Should see `<h3>` tag for values
- [ ] Should see `<small>` tag for labels
- [ ] Text should be styled by globals.css, not inline classes

---

### Spacing Testing

**Check 8px grid compliance**:
- [ ] Space between metric cards: 16px (gap-4)
- [ ] Space between sections: 24px (gap-6)
- [ ] Card padding: 24px (p-6)
- [ ] Page padding: 24px (p-6)

**Measure in DevTools**:
1. Inspect a metric card
2. Check padding: should be 24px (1.5rem)
3. Check gap between cards: should be 16px (1rem)

---

## 📱 Responsive Testing

### Desktop (> 1024px)
**Expected**:
- [ ] 4 metric cards in a row
- [ ] All cards equal width
- [ ] No horizontal scrolling
- [ ] Comfortable spacing

**Test**: Resize browser window to > 1024px wide

---

### Tablet (640px - 1024px)
**Expected**:
- [ ] 2 metric cards per row (2x2 grid)
- [ ] Cards stack in 2 rows
- [ ] Still readable and comfortable

**Test**: Resize browser window to ~768px wide

---

### Mobile (< 640px)
**Expected**:
- [ ] 1 metric card per row
- [ ] Cards stack vertically
- [ ] Full-width cards
- [ ] Easy to scroll

**Test**: Resize browser window to ~375px wide (iPhone size)

---

## 🖱️ Interaction Testing

### Hover Effects
**Test each metric card**:
1. Hover over "Active Pipeline" card
   - [ ] Border changes from warm cream to forest green
   - [ ] Shadow appears (elevation increase)
   - [ ] Cursor changes to pointer
   - [ ] Smooth transition (200ms)

2. Hover over "This Month Revenue" card
   - [ ] Border changes to terracotta
   - [ ] Shadow appears
   - [ ] Cursor changes to pointer

3. Hover over "Available Inventory" card
   - [ ] Border changes to slate
   - [ ] Shadow appears
   - [ ] Cursor changes to pointer

4. Hover over "Conversion Rate" card
   - [ ] Border changes to forest green
   - [ ] Shadow appears
   - [ ] Cursor changes to pointer

---

### Click Navigation
**Test each metric card**:
1. Click "Active Pipeline"
   - [ ] Should navigate to Deals page
   - [ ] URL changes

2. Click "This Month Revenue"
   - [ ] Should navigate to Deals page

3. Click "Available Inventory"
   - [ ] Should navigate to Properties page

4. Click "Conversion Rate"
   - [ ] Should navigate to Leads page

---

### Header Actions
**Test secondary actions**:
1. Click Bell icon (🔔)
   - [ ] Should toggle notifications (placeholder for now)

2. Click Search icon (🔍)
   - [ ] Should trigger search (placeholder for now)

3. Click Settings icon (⚙️)
   - [ ] Should navigate to Settings page

---

## ⌨️ Keyboard Accessibility Testing

### Tab Navigation
1. Click on page, press Tab key repeatedly
   - [ ] Focus moves to first metric card
   - [ ] Focus outline visible (should be visible ring)
   - [ ] Press Tab again → focus moves to next card
   - [ ] Continue tabbing through all 4 cards
   - [ ] Focus outline clearly visible on each

### Keyboard Activation
1. Tab to "Active Pipeline" card
2. Press Enter
   - [ ] Should navigate to Deals page

3. Tab to any card
4. Press Space
   - [ ] Should navigate to corresponding page

---

## 🎨 Browser Testing

### Chrome
- [ ] Dashboard loads
- [ ] All metrics visible
- [ ] Colors correct
- [ ] Hover works
- [ ] Click works
- [ ] Responsive works

### Firefox
- [ ] Dashboard loads
- [ ] All metrics visible
- [ ] Colors correct
- [ ] Hover works
- [ ] Click works
- [ ] Responsive works

### Safari
- [ ] Dashboard loads
- [ ] All metrics visible
- [ ] Colors correct
- [ ] Hover works
- [ ] Click works
- [ ] Responsive works

### Edge
- [ ] Dashboard loads
- [ ] All metrics visible
- [ ] Colors correct
- [ ] Hover works
- [ ] Click works
- [ ] Responsive works

---

## 🔍 DevTools Console Testing

### Check for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Refresh page
   - [ ] NO errors (red messages)
   - [ ] NO warnings about typography classes
   - [ ] NO missing import errors
   - [ ] NO React warnings

### Check Network Tab
1. Open DevTools → Network tab
2. Refresh page
   - [ ] DashboardV4.tsx loads successfully
   - [ ] HeroSection.tsx loads successfully
   - [ ] DashboardMetricCard.tsx loads successfully
   - [ ] No 404 errors

---

## 📊 Performance Testing

### Load Time
1. Open DevTools → Network tab
2. Disable cache
3. Refresh page
4. Check "DOMContentLoaded" time
   - [ ] Should be < 1 second
   - [ ] Dashboard visible immediately
   - [ ] No layout shift

### Memory Usage
1. Open DevTools → Performance tab
2. Record page load
3. Stop recording
   - [ ] No memory leaks
   - [ ] Reasonable memory usage (< 50MB for dashboard)

---

## 🐛 Common Issues & Fixes

### Issue: Greeting not changing
**Fix**: 
- Clear browser cache
- Check system time is correct
- Verify `getGreeting()` function logic

### Issue: Metrics not clickable
**Fix**:
- Check onClick handlers are passed
- Verify navigation function works
- Check z-index not blocking

### Issue: Colors not matching
**Fix**:
- Check Tailwind config has custom colors
- Verify hex codes are correct
- Clear browser cache

### Issue: Responsive not working
**Fix**:
- Check Tailwind breakpoints
- Verify grid classes: grid-cols-1, md:grid-cols-2, lg:grid-cols-4
- Check viewport meta tag in HTML

### Issue: Typography classes visible
**Fix**:
- Remove any text-xl, font-bold, etc. classes
- Use semantic HTML tags (<h3>, <small>)
- Check globals.css is loaded

---

## ✅ Final Verification

### Before Moving to Phase 2

**All checks must pass**:
- [ ] Dashboard loads without errors
- [ ] All 4 metrics visible and correct
- [ ] Brand colors match design (use color picker)
- [ ] No Tailwind typography classes
- [ ] 8px spacing grid followed
- [ ] Responsive on mobile/tablet/desktop
- [ ] Hover effects work on all cards
- [ ] Click navigation works on all cards
- [ ] Keyboard accessible (tab, enter, space)
- [ ] No console errors
- [ ] Performance acceptable (< 1s load)

**If ALL checks pass** → ✅ Ready for Phase 2

**If ANY checks fail** → ❌ Fix issues before proceeding

---

## 📸 Screenshot Checklist

Take screenshots for documentation:
- [ ] Desktop view (full dashboard)
- [ ] Tablet view (2-column layout)
- [ ] Mobile view (stacked layout)
- [ ] Hover state (one card)
- [ ] DevTools showing no errors
- [ ] Responsive inspector showing breakpoints

---

## 🎓 Testing Tips

1. **Use multiple browsers**: Test in at least 2 browsers
2. **Test on real devices**: If possible, test on actual phone/tablet
3. **Use DevTools device mode**: Simulate different screen sizes
4. **Clear cache often**: Avoid stale code issues
5. **Check console always**: Catch errors early
6. **Test systematically**: Go through checklist in order
7. **Document issues**: Note any bugs found
8. **Verify fixes**: Re-test after fixing issues

---

## 📝 Bug Report Template

If you find issues, report using this template:

```
**Bug**: [Brief description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Browser**: [Chrome/Firefox/Safari/Edge]
**Screen Size**: [Desktop/Tablet/Mobile]
**Screenshot**: [Attach if possible]

**Console Errors**: [Copy any errors]
```

---

## 🚀 Next Steps After Testing

Once all tests pass:
1. ✅ Mark Phase 1 as complete
2. 📸 Take screenshots for documentation
3. 📊 Move to Phase 2: Data Integration
4. 🎉 Celebrate successful foundation!

---

*Phase 1 Testing Guide*  
*Version: 1.0.0*  
*Last Updated: January 5, 2026*
