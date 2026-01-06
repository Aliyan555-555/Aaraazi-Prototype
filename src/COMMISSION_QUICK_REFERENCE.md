# Commission Management - Quick Reference Card

## 🎯 At a Glance

**Location**: Deal Details → Commission Tab  
**Purpose**: Configure and track commission splits  
**Users**: Admins and Primary Agents can edit

---

## 📋 Main Sections

### 1️⃣ Header Card
Configure the basic commission parameters.

```
┌──────────────┬──────────────┬──────────────┐
│ Rate (%)     │ Deal Price   │ Payout       │
│ [2.5]       │ PKR 2M       │ [Full Pay ▼] │
└──────────────┴──────────────┴──────────────┘
              [Save Configuration]
```

**What to do**:
- Set commission rate (0.1% - 100%)
- Choose when commission is paid
- Click Save after changes

---

### 2️⃣ Allocation Progress
See how commission is distributed.

```
Allocated: 100%         Remaining: 0%
████████████████████████████████
Total: PKR 50,000      Remaining: PKR 0
```

**What it means**:
- 🟢 Green bar = Perfect (100%)
- 🔴 Red bar = Over or under 100%
- Watch this as you make changes

---

### 3️⃣ Agent Rows
Manage each agent's commission.

```
┌─────────────────────────────────────────┐
│ Asif Khan  [Internal] [Pending] 🗑️      │
│                                         │
│ [2.5] %    [⇄]    = PKR 50,000         │
└─────────────────────────────────────────┘
```

**What to do**:
- Type percentage OR amount
- Click [⇄] to switch input type
- Click status badge to change (admin only)
- Click 🗑️ to remove agent

---

### 4️⃣ Agency Split
Set what the agency keeps.

```
┌─────────────────────────────────────────┐
│ 🏢 Agency Split  [Paid]                 │
│                                         │
│ [90.0] %   [⇄]    = PKR 1,800,000      │
└─────────────────────────────────────────┘
```

**What to do**:
- Same as agent rows
- Typically 70-95% of total

---

### 5️⃣ Validation Footer
Know if your splits are valid.

```
┌─────────────────────────────────────────┐
│ ✅ Commission allocation is valid      │
│ All splits total exactly 100%          │
└─────────────────────────────────────────┘
```

**What it means**:
- ✅ Green = Ready to save
- ❌ Red = Fix the allocation

---

## 🔧 Common Tasks

### Change Commission Rate
1. Type new percentage in "Rate (%)" field
2. Total commission updates automatically
3. All agent amounts recalculate
4. Click "Save Configuration"

**Example**: 2% → 3%  
**Effect**: PKR 40,000 → PKR 60,000

---

### Add an Agent
1. Click "+ Add Agent" button
2. Choose "Internal User" or "External Broker" tab
3. Select the person
4. Enter their percentage
5. Click "Add Agent"

**Note**: Allocation bar updates immediately

---

### Remove an Agent
1. Find the agent's card
2. Click the 🗑️ trash icon
3. Confirm the removal

**Note**: Their percentage goes back to "unallocated"

---

### Switch Between % and Amount

**Why?** Real-world amounts don't always match perfect percentages.

**How?**
1. Find the [⇄] toggle button
2. Click it

**Example**:
```
Before: [2.5] %     [⇄]  = PKR 50,000
Click!
After:  [50000] PKR [⇄]  = 2.5%
```

Now you can type the actual PKR amount!

---

### Enter Actual Amounts Paid

**Scenario**: Deal closed. You paid different amounts than calculated.

**Steps**:
1. For each agent:
   - Click [⇄] to switch to amount mode
   - Type the actual PKR amount paid
   - Percentage auto-calculates
2. Do the same for agency
3. Check validation footer
4. If green ✅, click "Save Configuration"

**Example**:
```
Calculated:
- Agent 1: 50% = PKR 25,000
- Agent 2: 40% = PKR 20,000
- Agency: 10% = PKR 5,000

Actually Paid:
- Agent 1: PKR 27,000 → 54%
- Agent 2: PKR 18,000 → 36%
- Agency: PKR 5,000 → 10%

Still totals 100% ✅
```

---

### Change Commission Status (Admin Only)

**What statuses mean**:
- **Pending** = Default, not yet processed
- **Pending Approval** = Waiting for admin review
- **Approved** = Admin approved, ready to pay
- **Paid** = Payment completed
- **On Hold** = Temporarily paused
- **Cancelled** = Commission cancelled

**How to change**:
1. Click the status badge (colored pill)
2. Modal opens
3. Select new status
4. Add optional reason/note
5. Click "Confirm"

**Note**: Only admins can change status. Others see badges as read-only.

---

### Approve Commission (Admin)

1. Click agent's status badge
2. Change to "Approved"
3. Add approval note (optional)
4. Click "Confirm"

**Result**: Shows "Approved by [Your Name] on [Date]"

---

### Mark as Paid (Admin)

1. Click agent's status badge
2. Change to "Paid"
3. Add payment reference (optional)
4. Click "Confirm"

**Result**: Shows "Paid on [Date]"

---

## ⚠️ Important Rules

### Validation Rules
1. **Total must equal 100%**
   - All agents + agency must sum to exactly 100%
   - Slight rounding OK (±0.01%)

2. **Commission rate range**
   - Minimum: 0.1%
   - Maximum: 100%

3. **Cannot save invalid**
   - Save button disabled if not 100%
   - Fix allocation first

### Permissions
- **Admin**: Can do everything
- **Primary Agent**: Can edit, cannot change status
- **Secondary Agent**: View only
- **Other Users**: No access

---

## 💡 Pro Tips

### Tip 1: Use Amount Mode for Final Adjustments
When a deal closes and you know exact amounts paid, switch to amount mode and enter real numbers. Much easier than calculating percentages!

### Tip 2: Watch the Allocation Bar
The progress bar updates in real-time. Keep an eye on it while editing to stay at 100%.

### Tip 3: Start with Percentages, End with Amounts
- **During planning**: Use percentages (easier to plan splits)
- **After closing**: Switch to amounts (match reality)

### Tip 4: Add Agents First, Then Distribute
1. Add all agents who will receive commission
2. Then distribute the 100% across all
3. Adjust agency split last

### Tip 5: Use Notes for Context
When changing status, add a note explaining why. Helps with audit trail later.

---

## 🐛 Troubleshooting

### Problem: Can't Save Changes
**Cause**: Total allocation ≠ 100%  
**Solution**: Check validation footer. Adjust splits until green ✅

---

### Problem: Toggle Button Not Working
**Cause**: Not in edit mode OR no permission  
**Solution**: Check if you're admin or primary agent

---

### Problem: Agent Already Added
**Cause**: Same person already in commission split  
**Solution**: Find and edit existing entry instead

---

### Problem: Status Badge Not Clickable
**Cause**: Not an admin  
**Solution**: Only admins can change status

---

### Problem: Numbers Not Adding Up
**Cause**: Rounding differences  
**Solution**: Use amount mode for precision, or accept ±0.01% variance

---

### Problem: Changes Not Saving
**Cause**: Browser issue or network error  
**Solution**: 
1. Check internet connection
2. Try refreshing page
3. Re-enter changes
4. Contact support if persists

---

## 📊 Examples

### Example 1: Standard 2-Agent Deal

**Setup**:
- Deal: PKR 10,000,000
- Commission: 2% = PKR 200,000

**Split**:
- Primary Agent: 5% = PKR 10,000
- Secondary Agent: 3% = PKR 6,000
- Agency: 92% = PKR 184,000
- **Total: 100%** ✅

---

### Example 2: External Broker Involved

**Setup**:
- Deal: PKR 5,000,000
- Commission: 3% = PKR 150,000

**Split**:
- Internal Agent: 10% = PKR 15,000
- External Broker: 8% = PKR 12,000
- Agency: 82% = PKR 123,000
- **Total: 100%** ✅

---

### Example 3: High-Value Deal, Low Agency Cut

**Setup**:
- Deal: PKR 50,000,000
- Commission: 1.5% = PKR 750,000

**Split**:
- Star Agent 1: 30% = PKR 225,000
- Star Agent 2: 25% = PKR 187,500
- Support Agent: 10% = PKR 75,000
- Agency: 35% = PKR 262,500
- **Total: 100%** ✅

---

### Example 4: Solo Agent (No Split)

**Setup**:
- Deal: PKR 8,000,000
- Commission: 2.5% = PKR 200,000

**Split**:
- Solo Agent: 5% = PKR 10,000
- Agency: 95% = PKR 190,000
- **Total: 100%** ✅

---

### Example 5: Real-World Manual Adjustment

**Calculated**:
- Deal: PKR 12,000,000
- Commission: 2% = PKR 240,000
- Agent 1: 50% = PKR 120,000
- Agent 2: 40% = PKR 96,000
- Agency: 10% = PKR 24,000

**Actually Happened**:
- Agent 1 negotiated bonus: PKR 130,000
- Agent 2 took slightly less: PKR 90,000
- Agency took the difference: PKR 20,000
- Total still: PKR 240,000

**How to Enter**:
1. Toggle all to "Amount" mode
2. Enter: 130000, 90000, 20000
3. Percentages calculate: 54.17%, 37.5%, 8.33%
4. Total: 100% ✅
5. Save!

---

## 🔐 Security Notes

- All changes are logged with user and timestamp
- Status changes require admin privileges
- Audit trail preserved for compliance
- Cannot delete commission records (only cancel)

---

## 📱 Mobile Usage

On mobile devices:
- Swipe to scroll through agents
- Tap [⇄] button to toggle modes
- Tap status badges (admin)
- All features work same as desktop

---

## ⌨️ Keyboard Shortcuts

- **Tab**: Move between fields
- **Enter**: Save configuration
- **Escape**: Close modals
- **Arrow Keys**: Navigate dropdowns

---

## 📞 Need Help?

**In-App**: Settings → Support  
**Email**: support@aaraazi.com  
**Documentation**: /docs/commission-management

---

## 🔄 Version History

**V2.0** (Current)
- Redesigned UI
- Dual input mode (% ⇄ Amount)
- Real-time allocation bar
- Inline editing
- Better validation

**V1.0** (Legacy)
- Tab-based UI
- Percentage only
- Separate edit mode

---

**Last Updated**: December 31, 2024  
**Version**: 2.0  
**Status**: Production Ready ✅
