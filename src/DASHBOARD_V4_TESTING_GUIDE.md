# Dashboard V4 - Testing Guide 🧪

**Version**: 4.0  
**Status**: Production Ready  
**Last Updated**: January 5, 2026  

---

## Quick Start

### 1. Access the Dashboard

The Dashboard V4 is now live and accessible:

1. **Login** to aaraazi
2. **Select** Agency Module
3. **Default view** = Dashboard V4 (automatically shown)

**URL**: Main application → Agency Module → Dashboard

---

## Testing Checklist

### ✅ Phase 1: Hero Section

**What to Test**:
- [ ] 4 metric cards display
- [ ] Active Pipeline shows count and value
- [ ] Monthly Revenue shows PKR amount
- [ ] Available Inventory shows count
- [ ] Lead Velocity shows leads/day
- [ ] Trend arrows show (↑ up, ↓ down, → neutral)
- [ ] Colors match brand (forest green for positive, terracotta for neutral)
- [ ] Click on cards doesn't error

**Expected Data**:
```
Active Pipeline: X deals worth PKR Y
Monthly Revenue: PKR Z this month
Available Inventory: X properties available
Lead Velocity: X leads/day
```

**Role-Based Testing**:
- **Admin**: Should see ALL data
- **Agent**: Should see only THEIR data

---

### ✅ Phase 2 & 3: Action Center

**What to Test**:
- [ ] 6 action item types display
- [ ] Overdue Tasks shows (if any)
- [ ] Urgent Leads shows (if any)
- [ ] Stalled Properties shows (if any)
- [ ] Expiring Deals shows (if any)
- [ ] Unread Messages shows (if any)
- [ ] Pending Approvals shows (if any)
- [ ] Empty state shows if no actions: "You're all caught up!" ✓
- [ ] Click actions navigates correctly
- [ ] Badge counts are accurate

**Detection Logic**:

| Action Type | Detection Rule |
|-------------|----------------|
| Overdue Tasks | Due date < today AND not completed |
| Urgent Leads | Priority = high AND stage ≠ closed |
| Stalled Properties | Listed >30 days, no recent activity |
| Expiring Deals | Closing date within 7 days |
| Unread Messages | Messages with unread flag |
| Pending Approvals | Status = pending approval |

**Empty State**:
```
┌────────────────────────────────────┐
│        [✓ Green checkmark]         │
│                                    │
│   You're all caught up!            │
│                                    │
│   No urgent actions right now.     │
│   Great work!                      │
└────────────────────────────────────┘
```

---

### ✅ Phase 4: Quick Launch

**What to Test**:
- [ ] 12 workflow cards display
- [ ] Create Property workflow
- [ ] Add Lead workflow
- [ ] Create Sell Cycle workflow
- [ ] Create Purchase Cycle workflow
- [ ] Add Contact workflow
- [ ] Schedule Meeting workflow
- [ ] Create Task workflow
- [ ] Log Interaction workflow
- [ ] Upload Document workflow
- [ ] Update Status workflow
- [ ] Send Email workflow
- [ ] Generate Report workflow
- [ ] Recent activity count displays (e.g., "3 today")
- [ ] Click workflows navigates correctly
- [ ] Keyboard shortcuts display (e.g., "⌘P" for Create Property)

**Recent Activity**:
```
Create Property       [3 today]
Add Lead             [7 today]
Schedule Meeting     [2 today]
```

---

### ✅ Phase 5: Performance Pulse

**What to Test**:
- [ ] 8 performance cards display
- [ ] **Weekly Activity** shows line chart (sparkline)
- [ ] **Conversion Rate** shows percentage
- [ ] **Response Time** shows hours
- [ ] **Active Deals** shows count
- [ ] **Revenue This Month** shows bar chart
- [ ] **Lead Velocity** shows bar chart
- [ ] **Top Performer** shows agent name
- [ ] **Deal Cycle** shows bar chart
- [ ] Trend indicators (↑ up, ↓ down, → neutral)
- [ ] Comparison text (e.g., "+15% vs last period")
- [ ] Charts render without errors
- [ ] Responsive grid layout

**Chart Types**:

| Metric | Chart Type | Data |
|--------|-----------|------|
| Weekly Activity | Line (sparkline) | Last 7 days |
| Conversion Rate | - | % of won deals |
| Response Time | - | Avg hours |
| Active Deals | - | Count |
| Revenue | Bar | Last 30 days |
| Lead Velocity | Bar | Last 7 days |
| Top Performer | - | Agent name |
| Deal Cycle | Bar | Avg days |

**Visual Check**:
- All charts should render smoothly
- No console errors
- Colors match brand palette
- Responsive on different screen sizes

---

### ✅ Phase 6: Intelligence Panel

**What to Test**:
- [ ] Insights display (if patterns detected)
- [ ] Empty state shows if no insights: "All clear!"
- [ ] Insights sorted by priority (high → medium → low)
- [ ] Max 7 insights visible
- [ ] Insight count badge shows (e.g., "✨ 5 insights")
- [ ] Insight cards color-coded by type
- [ ] Priority badges show (High/Medium only)
- [ ] Supporting data displays
- [ ] Action buttons work
- [ ] Dismiss button saves to localStorage
- [ ] Dismissed insights don't reappear on refresh

**Insight Types & Colors**:

| Type | Color | Icon | Example |
|------|-------|------|---------|
| Opportunity | Terracotta | 📈 | "5 leads need follow-up" |
| Warning | Amber | ⚠️ | "Response time increasing" |
| Achievement | Forest Green | 🏆 | "PKR 100M milestone!" |
| Recommendation | Blue | 💡 | "DHA Phase 8 trending" |
| Alert | Red | 🚨 | "5 deals stalling" |
| Info | Gray | ℹ️ | "Tuesdays most active" |

**Pattern Detection**:

Test these scenarios to trigger insights:

1. **Staled Leads** - Don't contact leads for >3 days
2. **Slow Response** - Take >6 hours to respond
3. **Revenue Milestone** - Sell properties worth PKR 50M+ in one month
4. **Hot Location** - Get ≥5 inquiries in same area
5. **Low Conversion** - Get ≥10 leads in area with <10% conversion
6. **Pipeline Risks** - Leave deals in negotiation for >14 days
7. **Best Day** - Track which day has ≥20 activities
8. **Price Range** - Get ≥10 inquiries in same price range

**Dismissal Test**:
1. Click X on a dismissible insight
2. Refresh page
3. Insight should NOT reappear
4. Check localStorage: `aaraazi_dismissed_insights`

**Empty State**:
```
┌────────────────────────────────────┐
│        [✓ Green checkmark]         │
│                                    │
│   All clear! No insights right now.│
│                                    │
│   Your business is running smoothly│
└────────────────────────────────────┘
```

---

## Role-Based Testing

### Admin User

**Expected Behavior**:
- ✅ Sees ALL properties, leads, deals
- ✅ Sees ALL team members' data
- ✅ Insights based on entire organization
- ✅ Top Performer shows best agent
- ✅ All actions across team

**Test Steps**:
1. Login as admin
2. Verify metrics show total numbers
3. Check insights include team data
4. Verify can see all agents' activities

---

### Agent User

**Expected Behavior**:
- ✅ Sees only THEIR properties, leads, deals
- ✅ Sees only THEIR data
- ✅ Insights based on their work only
- ✅ Top Performer shows themselves
- ✅ Only their actions

**Test Steps**:
1. Login as agent
2. Verify metrics show only their numbers
3. Check insights are personalized
4. Verify cannot see other agents' data

---

## Context-Aware Testing

### Time-Based Greeting

**Test at different times**:

| Time | Greeting | Description |
|------|----------|-------------|
| 5am-11am | "Good morning" | "Start your day strong" |
| 11am-5pm | "Good afternoon" | "Keep the momentum going" |
| 5pm-9pm | "Good evening" | "Finish strong" |
| 9pm-5am | "Welcome back" | "Working late" |

**Test Steps**:
1. Change system time
2. Refresh dashboard
3. Verify greeting changes

---

### Stats Badge Testing

WorkspaceHeader shows 3 stats:

| Stat | Source |
|------|--------|
| Active Deals | From Hero Section "Active Pipeline" |
| Revenue | From Hero Section "Monthly Revenue" |
| Inventory | From Hero Section "Available Inventory" |

**Test**:
- Create/close deals → Active Deals updates
- Sell properties → Revenue updates
- Add/sell properties → Inventory updates

---

## Data-Driven Testing

### Create Sample Data

To fully test the dashboard, you need data:

#### Minimum Test Data:
- ✅ 10 properties (mix of available/sold)
- ✅ 20 leads (various stages)
- ✅ 5 tasks (some overdue)
- ✅ 10 interactions (various dates)
- ✅ 3 contacts

#### Optimal Test Data:
- ✅ 50+ properties
- ✅ 100+ leads
- ✅ 20+ tasks
- ✅ 50+ interactions
- ✅ 10+ contacts
- ✅ Multiple agents (for admin testing)

---

### Data Scenarios

#### Scenario 1: Empty State (New User)
**Setup**: Fresh account, no data
**Expected**:
- Hero Section: All zeros
- Action Center: "You're all caught up!"
- Quick Launch: All "0 today"
- Performance Pulse: No data / zero metrics
- Intelligence Panel: "All clear!"

---

#### Scenario 2: Active Business (Lots of Data)
**Setup**: 50 properties, 100 leads, 20 tasks
**Expected**:
- Hero Section: Real numbers with trends
- Action Center: Multiple action items
- Quick Launch: Activity counts (e.g., "5 today")
- Performance Pulse: Charts with data
- Intelligence Panel: 3-7 insights detected

---

#### Scenario 3: Problem Detection (Issues Present)
**Setup**: 
- 10 overdue tasks
- 5 leads not contacted in 5 days
- 3 deals stalling >14 days
- Avg response time 8 hours

**Expected**:
- Action Center: Shows all 4 action types
- Intelligence Panel: Detects problems
  - "10 tasks overdue" (alert)
  - "5 leads need follow-up" (opportunity)
  - "3 deals stalling" (alert)
  - "Response time increasing" (warning)

---

## Performance Testing

### Loading Speed

**Targets**:
- ✅ Dashboard loads in <2 seconds
- ✅ No visible lag when switching sections
- ✅ Charts render smoothly
- ✅ No console errors

**Test**:
1. Open DevTools → Network tab
2. Refresh dashboard
3. Measure load time
4. Check Console for errors

---

### Memory Usage

**Test**:
1. Open DevTools → Performance tab
2. Record while using dashboard
3. Check for memory leaks
4. Verify no infinite loops

---

## Responsive Testing

### Screen Sizes

Test on:
- ✅ **Desktop**: 1920×1080 (standard)
- ✅ **Laptop**: 1366×768 (common)
- ✅ **Tablet**: 768×1024 (iPad)
- ✅ **Mobile**: 375×667 (iPhone)

**Expected**:
- All sections stack vertically on mobile
- Cards resize appropriately
- Charts remain readable
- No horizontal scroll

---

## Accessibility Testing

### Keyboard Navigation

**Test**:
- ✅ Tab through all interactive elements
- ✅ Enter/Space activates buttons
- ✅ Escape closes modals
- ✅ Focus visible (blue outline)

### Screen Reader

**Test with**:
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (Mac)

**Expected**:
- All sections have aria-labels
- Cards announce correctly
- Actions are descriptive

---

## Browser Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## localStorage Testing

### Keys to Check

The dashboard uses these localStorage keys:

| Key | Purpose |
|-----|---------|
| `aaraazi_dismissed_insights` | Dismissed insight IDs |
| `sidebar-collapsed` | Sidebar state |
| All data keys | Properties, leads, etc. |

**Test**:
1. Open DevTools → Application → Local Storage
2. Verify keys exist
3. Modify values → Refresh → Check updates
4. Clear localStorage → Verify reset

---

## Common Issues & Solutions

### Issue 1: Dashboard Shows All Zeros

**Cause**: No data in localStorage  
**Solution**: Create sample data  
**Fix**: Use "Add Property", "Add Lead" buttons

---

### Issue 2: Insights Not Appearing

**Cause**: No patterns detected OR all dismissed  
**Solution**: 
1. Create conditions (e.g., overdue tasks)
2. Clear localStorage: `aaraazi_dismissed_insights`

---

### Issue 3: Charts Not Rendering

**Cause**: Recharts library issue  
**Solution**: Check console for errors  
**Fix**: Verify Recharts is imported correctly

---

### Issue 4: Navigation Not Working

**Cause**: onNavigate callback issue  
**Solution**: Check App.tsx integration  
**Fix**: Verify handleNavigation is passed correctly

---

### Issue 5: Role Filtering Not Working

**Cause**: User role not set correctly  
**Solution**: Check user object  
**Fix**: Verify user.role = 'admin' or 'agent'

---

## Bug Reporting Template

If you find a bug, report it like this:

```markdown
### Bug Report

**Section**: [Hero/Actions/QuickLaunch/Performance/Intelligence]
**Issue**: [Brief description]
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Environment**:
- Browser: [Chrome 120]
- Screen: [1920x1080]
- User Role: [admin/agent]
- Data: [amount of data]

**Console Errors**: [Copy any errors]
**Screenshots**: [If applicable]
```

---

## Success Criteria

Dashboard V4 is working correctly if:

- ✅ All 5 sections render without errors
- ✅ Real data displays (not mock)
- ✅ Role-based filtering works
- ✅ Context-aware greeting shows
- ✅ Charts render smoothly
- ✅ Actions navigate correctly
- ✅ Workflows navigate correctly
- ✅ Insights detect patterns
- ✅ Dismissal persists
- ✅ Responsive on all screens
- ✅ No console errors
- ✅ <2 second load time

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Deploy to production
2. Collect user feedback
3. Monitor analytics
4. Plan iterations

### If Issues Found ❌
1. Document bugs
2. Prioritize fixes
3. Create fix plan
4. Re-test after fixes

---

## Support & Resources

- **Code**: `/components/dashboard/`
- **Documentation**: `/DASHBOARD_PHASE[1-6]_COMPLETE.md`
- **Summary**: `/DASHBOARD_V4_FINAL_SUMMARY.md`
- **Guidelines**: `/Guidelines.md`

---

*Happy Testing! 🎉*

**Dashboard V4 is production-ready and waiting for you to test it!**

---

*Testing Guide Version: 1.0*  
*Created: January 5, 2026*  
*Status: Ready for testing*
