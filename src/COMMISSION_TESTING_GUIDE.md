# Commission Management V2 - Testing Guide

## Quick Start Testing

### Prerequisites
1. Navigate to any Deal in the system
2. Click on the "Commission" tab
3. Ensure you have admin or primary agent permissions

---

## Test Scenarios

### ✅ Test 1: Commission Rate Configuration
**Objective**: Verify commission rate changes update total commission

**Steps**:
1. Note current commission rate (e.g., 2%)
2. Note current total commission amount
3. Change commission rate to 3%
4. Verify total commission updates automatically
5. Click "Save Configuration"
6. Refresh page
7. Verify change persisted

**Expected**:
- Total commission = Deal Price × New Rate / 100
- All agent amounts recalculate automatically
- Changes persist after save

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 2: Toggle Between Percentage and Amount (Agent)
**Objective**: Verify dual input mode works for agents

**Steps**:
1. Find an existing agent in the list
2. Note current percentage and amount
3. Click the [⇄] toggle button
4. Verify input switches from percentage to amount (or vice versa)
5. Change the value
6. Verify the inverse value auto-calculates
7. Toggle back
8. Verify values are consistent

**Example**:
- Start: `[2.5] % = PKR 50,000`
- Click toggle: `[50000] PKR = 2.5%`
- Edit: `[60000] PKR = 3.0%`
- Toggle back: `[3.0] % = PKR 60,000`

**Expected**:
- Toggle button switches input mode
- Inverse value calculates correctly
- No data loss when toggling

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 3: Toggle Between Percentage and Amount (Agency)
**Objective**: Verify dual input mode works for agency split

**Steps**:
1. Find the Agency Commission section
2. Note current agency percentage and amount
3. Click the [⇄] toggle button
4. Verify input switches modes
5. Change the value
6. Verify calculation is correct
7. Click "Save Configuration"
8. Verify agency split saves correctly

**Expected**:
- Same behavior as agent toggle
- Agency calculations correct
- Saves and persists properly

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 4: Real-time Allocation Progress
**Objective**: Verify allocation bar updates in real-time

**Steps**:
1. Note current allocated percentage
2. Change any agent's percentage
3. Verify allocation bar updates immediately
4. Verify "Allocated" and "Remaining" update
5. Make total > 100%
6. Verify bar turns red with over-allocation message
7. Make total < 100%
8. Verify bar shows under-allocation
9. Make total = 100%
10. Verify bar turns green with success message

**Expected**:
- Progress bar updates without clicking save
- Colors: Green (100%), Red (≠100%)
- Allocated % + Remaining % = 100%
- Amount calculations correct

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 5: Add New Agent
**Objective**: Verify adding agents works correctly

**Steps**:
1. Click "+ Add Agent" button
2. Modal should open
3. Select "Internal User" tab
4. Choose an agent not already in the list
5. Enter percentage (e.g., 5%)
6. Click "Add Agent"
7. Verify agent appears in the list
8. Verify allocation bar updates
9. Repeat with "External Broker"

**Expected**:
- Modal opens correctly
- Can add internal users
- Can add external brokers
- Allocation updates immediately
- Cannot add same agent twice

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 6: Remove Agent
**Objective**: Verify removing agents works correctly

**Steps**:
1. Ensure at least 2 agents exist
2. Click trash icon (🗑️) on one agent
3. Confirm the removal
4. Verify agent is removed
5. Verify allocation bar updates
6. Try to remove when only 1 agent remains
7. Verify you can still remove (different from old behavior)

**Expected**:
- Confirmation dialog appears
- Agent removed after confirmation
- Allocation recalculates
- Can remove all agents if needed

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 7: Validation - Over Allocation
**Objective**: Verify validation prevents over-allocation

**Steps**:
1. Set agents + agency to total > 100%
   - Agent 1: 50%
   - Agent 2: 40%
   - Agency: 20%
   - Total: 110%
2. Verify validation footer shows red error
3. Verify error message: "Over-allocated by 10%"
4. Try to click "Save Configuration"
5. Verify save is disabled or shows error

**Expected**:
- Red validation card appears
- Shows exact over-allocation amount
- Save button disabled or error on save
- Clear error message

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 8: Validation - Under Allocation
**Objective**: Verify validation shows under-allocation

**Steps**:
1. Set agents + agency to total < 100%
   - Agent 1: 30%
   - Agency: 60%
   - Total: 90%
2. Verify validation footer shows red warning
3. Verify message: "Under-allocated by 10%"
4. Verify remaining amount shown

**Expected**:
- Red validation card appears
- Shows under-allocation percentage
- Shows remaining PKR amount
- Save disabled until fixed

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 9: Validation - Perfect 100%
**Objective**: Verify validation accepts exact 100%

**Steps**:
1. Set agents + agency to exactly 100%
   - Agent 1: 5%
   - Agent 2: 5%
   - Agency: 90%
   - Total: 100%
2. Verify validation footer shows green success
3. Verify message: "Commission allocation is valid"
4. Verify save button is enabled
5. Click "Save Configuration"
6. Verify success toast appears

**Expected**:
- Green validation card
- Success message
- Save button enabled
- Saves successfully

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 10: Status Management (Admin Only)
**Objective**: Verify admin can change commission status

**Prerequisites**: Must be logged in as Admin

**Steps**:
1. Find an agent with "Pending" status
2. Click the status badge
3. Modal should open showing status options
4. Change to "Approved"
5. Add optional reason
6. Click "Confirm"
7. Verify status badge updates to "Approved"
8. Verify approval info shows (approvedBy, approvedAt)
9. Click badge again, change to "Paid"
10. Verify paid date appears

**Expected**:
- Only admin sees clickable badges
- Modal opens on click
- Status updates immediately
- Audit info (who, when) recorded
- Toast notification on success

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 11: Status Management (Non-Admin)
**Objective**: Verify non-admin cannot change status

**Prerequisites**: Logged in as Agent (not admin)

**Steps**:
1. Find any agent's status badge
2. Try to click it
3. Verify nothing happens (not clickable)
4. Verify no modal opens
5. Check agency status badge
6. Verify also not clickable

**Expected**:
- Status badges not clickable for non-admin
- No hover effect indicating clickability
- No modal opens

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 12: Payout Trigger Configuration
**Objective**: Verify payout trigger can be changed

**Steps**:
1. Note current payout trigger
2. Click the dropdown
3. Verify all options appear:
   - At Booking
   - At 50% Payment
   - At Possession
   - At Full Payment
4. Select different option
5. Click "Save Configuration"
6. Refresh page
7. Verify new trigger persisted

**Expected**:
- Dropdown shows all options
- Selection saves correctly
- Persists after refresh

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 13: Real-World Scenario - Manual Amounts
**Objective**: Verify can enter actual amounts paid

**Scenario**: Deal closed. Amounts paid differ from percentages.

**Steps**:
1. Start with calculated percentages:
   - Deal: PKR 2,000,000
   - Commission Rate: 2% = PKR 40,000
   - Agent 1: 55% = PKR 22,000
   - Agent 2: 37.5% = PKR 15,000
   - Agency: 7.5% = PKR 3,000

2. Reality: Amounts slightly different due to negotiation
   - Agent 1: Actually paid PKR 23,000
   - Agent 2: Actually paid PKR 14,500
   - Agency: Took PKR 2,500
   - Total: PKR 40,000

3. Enter actual amounts:
   - Click [⇄] on Agent 1, enter 23000
   - Click [⇄] on Agent 2, enter 14500
   - Click [⇄] on Agency, enter 2500

4. Verify:
   - Percentages auto-calculate
   - Total = 100%
   - Can save successfully

**Expected**:
- Can enter exact PKR amounts
- Percentages calculate correctly:
  - Agent 1: 57.5%
  - Agent 2: 36.25%
  - Agency: 6.25%
- Total validates to 100%
- Saves successfully

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 14: External Broker Support
**Objective**: Verify external brokers work correctly

**Steps**:
1. Click "+ Add Agent"
2. Switch to "External Broker" tab
3. Add a contact with type "external-broker"
4. Verify external broker appears with:
   - [External] badge (orange)
   - Contact email/phone if available
5. Edit their commission
6. Save configuration
7. Change their status (admin)
8. Verify all features work for external broker

**Expected**:
- External brokers selectable
- Shows [External] badge
- Contact info displayed
- All features work same as internal

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 15: Backward Compatibility
**Objective**: Verify old deals migrate correctly

**Steps**:
1. Find a deal created before this update
2. Open its Commission tab
3. Verify commission data displays correctly
4. Verify legacy structure migrated:
   - Old primary/secondary agent → agents array
   - Old splits → new format
5. Make a change and save
6. Verify saves in new format
7. Verify still displays correctly

**Expected**:
- Automatic migration on load
- No data loss
- Old deals work perfectly
- New format after save

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 16: Save and Persistence
**Objective**: Verify all changes persist correctly

**Steps**:
1. Make multiple changes:
   - Change commission rate
   - Toggle agent to amount mode
   - Change agent amount
   - Change payout trigger
   - Adjust agency split
2. Click "Save Configuration"
3. Verify success toast
4. Navigate away from deal
5. Navigate back to deal
6. Open Commission tab
7. Verify all changes persisted
8. Verify input modes restored

**Expected**:
- All changes save
- Success notification
- Changes persist across navigation
- Data loads correctly on return

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 17: Permission Enforcement
**Objective**: Verify only authorized users can edit

**Test as Admin**:
1. Verify all fields editable
2. Verify can save configuration
3. Verify can change status
4. Verify can add/remove agents

**Test as Primary Agent**:
1. Verify all fields editable
2. Verify can save configuration
3. Verify CANNOT change status
4. Verify can add/remove agents

**Test as Secondary Agent**:
1. Verify fields are read-only OR
2. Verify shows permission message
3. Verify CANNOT save
4. Verify CANNOT change status
5. Verify CANNOT add/remove agents

**Expected**:
- Admin: Full access
- Primary Agent: Edit but not approve
- Secondary Agent: View only

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 18: Multiple Agents (Stress Test)
**Objective**: Verify works with many agents

**Steps**:
1. Add 5+ agents to a deal
2. Distribute commission across all:
   - Agent 1: 10%
   - Agent 2: 8%
   - Agent 3: 6%
   - Agent 4: 5%
   - Agent 5: 5%
   - Agency: 66%
3. Verify allocation bar correct
4. Toggle different agents to amount mode
5. Verify calculations correct
6. Save configuration
7. Verify all agents save correctly

**Expected**:
- Handles 5+ agents smoothly
- Calculations remain accurate
- UI doesn't break
- Saves all agents

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 19: Edge Cases - Zero Commission
**Objective**: Verify handles edge cases

**Steps**:
1. Set commission rate to 0%
2. Verify total commission = PKR 0
3. Verify validation still works
4. Try to save with 0% commission
5. Verify system allows it

**Expected**:
- Handles zero commission gracefully
- No division by zero errors
- Can save (some deals have no commission)

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Test 20: UI/UX Polish
**Objective**: Verify visual design and UX

**Checklist**:
- [ ] No tabs visible (single view)
- [ ] Progress bar animates smoothly
- [ ] Colors follow design system:
  - Primary: #030213
  - Success: Green
  - Error: Red
  - Warning: Orange
- [ ] 8px grid spacing consistent
- [ ] Typography uses defaults (no text-xl, font-bold)
- [ ] Icons render correctly
- [ ] Buttons have proper hover states
- [ ] Input fields have proper focus states
- [ ] Toggle button has clear UX
- [ ] Status badges color-coded
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] No layout shifts
- [ ] Smooth animations

**Expected**:
- Professional, polished appearance
- Follows design system
- No visual bugs
- Smooth interactions

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## Browser Compatibility Testing

Test in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Expected**: Works identically in all browsers

---

## Performance Testing

### Load Time
- [ ] Commission tab loads in < 1 second
- [ ] No lag when typing in inputs
- [ ] Calculations happen instantly (< 100ms)
- [ ] Save operation completes quickly

### Memory
- [ ] No memory leaks when switching tabs
- [ ] No memory leaks when adding/removing agents
- [ ] Component cleans up properly

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all inputs in order
- [ ] Enter key submits form
- [ ] Escape key closes modals
- [ ] Arrow keys work in selects

### Screen Reader
- [ ] All labels read correctly
- [ ] Status changes announced
- [ ] Validation messages read
- [ ] Button purposes clear

### Visual
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible (3px blue outline)
- [ ] Text readable at 200% zoom
- [ ] Works with high contrast mode

---

## Regression Testing

Verify old functionality still works:

- [ ] Can still view commission in old format deals
- [ ] Status change modal works
- [ ] Add agent modal works
- [ ] Commission calculation logic correct
- [ ] Integration with deal workflow intact

---

## Test Results Summary

| Category | Tests | Passed | Failed | Not Tested |
|----------|-------|--------|--------|------------|
| Core Functionality | 9 | 0 | 0 | 9 |
| Input/Toggle | 3 | 0 | 0 | 3 |
| Validation | 3 | 0 | 0 | 3 |
| Permissions | 2 | 0 | 0 | 2 |
| Edge Cases | 2 | 0 | 0 | 2 |
| UX/Polish | 1 | 0 | 0 | 1 |
| **TOTAL** | **20** | **0** | **0** | **20** |

---

## Known Issues

*Document any bugs found during testing here*

### Issue Template
```
Issue #: 
Title: 
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1. 
2. 
3. 
Expected: 
Actual: 
Browser/Device: 
Status: Open / Fixed / Won't Fix
```

---

## Sign-off

**Tester**: ___________________  
**Date**: ___________________  
**Version**: 2.0  
**Overall Status**: ⬜ Pass | ⬜ Fail | ⬜ Pass with Issues  

**Notes**:
_____________________________________
_____________________________________
_____________________________________

---

**Ready for Production**: ⬜ Yes | ⬜ No | ⬜ Conditional

**Conditions** (if conditional):
_____________________________________
_____________________________________
_____________________________________
