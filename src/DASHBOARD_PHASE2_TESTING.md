# Dashboard V4 - Phase 2 Testing Guide

**Phase**: 2 - Data Integration  
**Status**: Ready for Testing  
**Date**: January 5, 2026  

---

## 🚀 Quick Start

1. **Start the app** → Should see new dashboard with real data
2. **Check metrics** → Should show YOUR actual data (not static)
3. **Verify trends** → Arrows should show up/down based on calculations

---

## ✅ Quick Verification Checklist

### 1. Dashboard Loads
- [ ] No console errors
- [ ] Metrics appear (not "...")
- [ ] All 4 cards visible
- [ ] Header stats match card values

### 2. Real Data Display
- [ ] Active Pipeline shows actual PKR value (not PKR 15.2M static)
- [ ] Deal count matches sell cycles workspace
- [ ] Monthly Revenue shows current month sales
- [ ] Available Inventory matches properties with status='available'
- [ ] Conversion Rate shows actual lead conversion %

### 3. Trend Indicators
- [ ] Trends show (if data exists for comparison)
- [ ] Up arrows (↑) for positive trends
- [ ] Down arrows (↓) for negative trends
- [ ] No trend if no comparison data

---

## 🧪 Test Scenarios

### Scenario A: Fresh Database (No Data)

**Setup**: Clear localStorage or use new user

**Expected Results**:
```
Active Pipeline: PKR 0 (0 deals)
Monthly Revenue: PKR 0
Available Inventory: 0
Conversion Rate: 0%
Trends: None visible (all neutral/0%)
```

**Test**:
1. Login
2. Go to Dashboard
3. Verify all metrics show 0
4. No errors in console

---

### Scenario B: With Sample Data

**Setup**: Add some test data:
- 2-3 sell cycles (status: 'listed')
- 3-5 properties (status: 'available')
- 5-10 leads (some converted, some not)

**Expected Results**:
```
Active Pipeline: Shows sum of listing prices
Monthly Revenue: PKR 0 (if no sales this month)
Available Inventory: Shows count (3-5)
Conversion Rate: Shows % (e.g., 30% if 3/10 converted)
```

**Test**:
1. Add data using the app
2. Go to Dashboard
3. Verify counts match
4. Click each metric card
5. Should navigate to correct page

---

### Scenario C: Admin vs Agent

**Setup**: Test with both roles

**Admin Expected**:
- Sees ALL sell cycles
- Sees ALL properties
- Sees ALL leads
- Higher counts

**Agent Expected**:
- Sees only THEIR sell cycles
- Sees only THEIR properties
- Sees only THEIR leads
- Lower counts (their data only)

**Test**:
1. Login as Admin
2. Note metric values
3. Logout
4. Login as Agent
5. Verify Agent sees fewer/different numbers
6. Verify Agent doesn't see other agents' data

---

### Scenario D: Monthly Revenue Calculation

**Setup**: Create sell cycles with sales:
- 1 sale last month (PKR 5M)
- 2 sales this month (PKR 3M + PKR 2M = PKR 5M)

**Expected Results**:
```
Monthly Revenue: PKR 5M
Trend: Neutral (0%) - same as last month
```

**If this month > last month**:
```
Monthly Revenue: PKR 6M
Trend: ↑ 20% (if last month was PKR 5M)
```

**Test**:
1. Add sell cycles with different sale dates
2. Mark as 'sold' with saleDate
3. Go to Dashboard
4. Verify only current month counted
5. Verify trend calculation

---

### Scenario E: Conversion Rate Calculation

**Setup**: Create leads:
- 10 leads total
- 3 converted (conversionStatus = 'converted')
- 7 not converted

**Expected Results**:
```
Conversion Rate: 30%
Comparison: "leads → contacts"
Trend: Shows change vs last 30 days
```

**Test**:
1. Create leads with various statuses
2. Convert some to contacts
3. Go to Dashboard
4. Verify rate = (converted / total) * 100
5. Verify count is correct

---

## 🔍 Detailed Verification Steps

### Verify Active Pipeline

**What it should calculate**:
- Sum of sell cycles with status: 'listed', 'offer-received', or 'under-contract'
- Use highest offer amount if offers exist
- Otherwise use askingPrice

**How to test**:
1. Go to Sell Cycles workspace
2. Filter by active status
3. Note the asking prices
4. Manually sum them
5. Compare to dashboard metric
6. Should match!

**Example**:
```
Sell Cycle 1: PKR 5M (listed)
Sell Cycle 2: PKR 3M (offer-received, highest offer: PKR 3.2M)
Sell Cycle 3: PKR 4M (under-contract)
Expected Pipeline: PKR 12.2M (5 + 3.2 + 4)
```

---

### Verify Monthly Revenue

**What it should calculate**:
- Sum of sell cycles with status = 'sold'
- Only if saleDate is in current month
- Use soldPrice (or askingPrice as fallback)

**How to test**:
1. Go to Sell Cycles workspace
2. Filter by status = 'sold'
3. Check saleDate for each
4. Note which are THIS month
5. Sum their soldPrice values
6. Compare to dashboard metric
7. Should match!

**Example**:
```
Today: Jan 5, 2026
Cycle 1: Sold Dec 15, 2025 - PKR 5M (excluded)
Cycle 2: Sold Jan 2, 2026 - PKR 3M (included)
Cycle 3: Sold Jan 3, 2026 - PKR 2M (included)
Expected Revenue: PKR 5M (3 + 2)
```

---

### Verify Available Inventory

**What it should calculate**:
- Count of properties with status = 'available'

**How to test**:
1. Go to Properties workspace
2. Filter by status = 'available'
3. Count how many show up
4. Compare to dashboard metric
5. Should match!

**Example**:
```
Property 1: status = 'available' ✅
Property 2: status = 'sold' ❌
Property 3: status = 'available' ✅
Property 4: status = 'under-contract' ❌
Property 5: status = 'available' ✅
Expected Inventory: 3
```

---

### Verify Conversion Rate

**What it should calculate**:
- Count of leads V4 with conversionStatus = 'converted'
- Divide by total leads
- Multiply by 100 for percentage

**How to test**:
1. Go to Leads workspace
2. Count total leads
3. Filter/count how many are converted
4. Calculate: (converted / total) * 100
5. Compare to dashboard metric
6. Should match!

**Example**:
```
Total Leads: 20
Converted: 6 (conversionStatus = 'converted')
Expected Rate: 30% (6/20 * 100)
```

---

## 📊 Trend Verification

### Revenue Trend

**Calculation**:
- This month revenue vs last month revenue
- Percentage change
- Direction: up if positive, down if negative

**Example**:
```
Last Month (Dec 2025): PKR 4M
This Month (Jan 2026): PKR 5M
Change: +25% → ↑ 25
```

**Test**:
1. Ensure you have sales in last month AND this month
2. Calculate manually
3. Compare to dashboard
4. Trend direction should match (↑ or ↓)
5. Percentage should be close (rounded)

---

### Conversion Trend

**Calculation**:
- Last 30 days conversion rate vs previous 30 days
- Based on createdAt date of leads
- Percentage change in the rate itself

**Example**:
```
Days 31-60 ago: 10 leads, 2 converted = 20% rate
Days 0-30 ago: 15 leads, 6 converted = 40% rate
Change: +100% (40% vs 20%) → ↑ 100
```

---

## 🐛 Common Issues & Fixes

### Issue: Metrics show "..."
**Cause**: Still loading
**Fix**: Wait 1-2 seconds, should update automatically

---

### Issue: Metrics show PKR 0 but I have data
**Cause**: 
1. Data might not match filter criteria
2. Wrong status on sell cycles/properties
3. Wrong conversionStatus on leads

**Fix**: 
1. Check data in workspace pages
2. Verify status fields
3. Check console for errors

---

### Issue: Trends not showing
**Cause**: No comparison data (e.g., no sales last month)
**Fix**: This is expected! Trends only show when there's data to compare

---

### Issue: Agent sees too much data
**Cause**: Data might not have proper agentId
**Fix**: Check that sell cycles/properties have correct agentId field

---

### Issue: Numbers don't match workspace
**Cause**: 
1. Different filtering logic
2. Caching issue
3. Data sync issue

**Fix**:
1. Refresh page
2. Clear browser cache
3. Check filter logic in code

---

## 📸 Visual Checklist

### What You Should See

**Header Stats (WorkspaceHeader)**:
```
Good [morning/afternoon/evening], [Your Name] 👋
Here's what needs your attention today

Active: [X] | This Month: [Y] M | Available: [Z]
```

**Hero Metrics (4 Cards)**:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 📈 Active   │ 💰 This Mo. │ 🏢 Availab. │ 📊 Conver.  │
│ Pipeline    │ Revenue     │ Inventory   │ Rate        │
│             │             │             │             │
│ PKR [X] M   │ PKR [Y] M   │ [Z]         │ [W]%        │
│ ↑[T]% [N]   │ ↑[T]% vs    │ properties  │ ↑[T]% leads │
│ deals       │ last month  │ ready       │ → contacts  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Not This** (Phase 1 static):
```
PKR 15.2M (always the same)
↑ 12% 8 deals (never changes)
```

**But This** (Phase 2 dynamic):
```
PKR 0 (if no data)
PKR 5.4M (your actual data)
↑ 15% 3 deals (calculated trend)
No trend (if no comparison data)
```

---

## ✅ Final Acceptance Criteria

Before moving to Phase 3, verify:

- [ ] Dashboard loads without errors
- [ ] All metrics show REAL data (not static)
- [ ] Active Pipeline = sum of active sell cycles
- [ ] Monthly Revenue = sum of sales THIS month
- [ ] Available Inventory = count of 'available' properties
- [ ] Conversion Rate = (converted leads / total leads) * 100
- [ ] Trends calculate correctly (if data exists)
- [ ] Loading states work ('...' appears briefly)
- [ ] Header stats match hero metrics
- [ ] Admin sees all data
- [ ] Agent sees only their data
- [ ] Clicking metrics navigates correctly
- [ ] No console errors
- [ ] Performance is good (< 1s load)

**If ALL boxes checked** → ✅ Phase 2 Complete, Ready for Phase 3!

---

## 🎓 Understanding the Calculations

### Why these metrics?

1. **Active Pipeline** - Shows potential revenue in negotiation
2. **Monthly Revenue** - Shows actual closed deals this month
3. **Available Inventory** - Shows ready-to-sell properties
4. **Conversion Rate** - Shows lead quality and sales effectiveness

### Why these trends?

1. **Revenue Trend** - Are we growing or declining month-over-month?
2. **Conversion Trend** - Is our lead quality improving?
3. **Pipeline Trend** - Are we adding new opportunities?

---

*Phase 2 Testing Guide*  
*Version: 1.0.0*  
*Last Updated: January 5, 2026*  
*Ready for production testing*
