# How to Find the New Accounting Features

## Step-by-Step Guide

### Step 1: Navigate to Financials Hub
1. Click on **"Financials Hub"** from your main navigation menu

### Step 2: Click on the "Reports" Tab
1. Once in Financials Hub, you'll see a horizontal navigation bar with tabs
2. Click on the **"Reports"** tab (fifth tab from the left)

The tabs are:
```
Dashboard | Sales & Commissions | Expenses & Payables | Accounting | Reports
                                                                      ^^^^^^^^
                                                                   Click HERE!
```

### Step 3: Scroll Down to "Accounting Cycle Reports"
Once you're in the Reports tab, you'll see:

1. **First Section**: Main Financial Statements (3 cards)
   - P&L Statement
   - Balance Sheet
   - Cash Flow Statement

2. **Second Section**: 🎉 **NEW - Accounting Cycle Reports** (2 cards)
   - **Trial Balance** (Orange icon with Calculator)
   - **Changes in Equity** (Indigo icon with Wallet)

3. **Third Section**: Report Archive
   - Shows all previously generated reports

## What You Should See

### Trial Balance Card (Orange)
```
┌─────────────────────────────────────┐
│ 🔶 Trial Balance                    │
├─────────────────────────────────────┤
│ Verify that total debits equal      │
│ total credits across all accounts   │
│                                     │
│ As of Date: [Date Picker]          │
│                                     │
│ [Generate Trial Balance Button]     │
└─────────────────────────────────────┘
```

### Changes in Equity Card (Indigo)
```
┌─────────────────────────────────────┐
│ 💼 Changes in Equity                │
├─────────────────────────────────────┤
│ Track changes in owner's equity     │
│ including contributions and...      │
│                                     │
│ Report Period: [MTD/QTD/YTD]       │
│                                     │
│ [Record Transaction] [Generate]     │
└─────────────────────────────────────┘
```

## Testing the Features

### Test Trial Balance:
1. Go to Reports tab
2. Find "Trial Balance" card (orange with calculator icon)
3. Select a date (default is today)
4. Click "Generate Trial Balance"
5. A dialog will pop up showing all your accounts with debit/credit balances
6. Look for the "✅ BALANCED" or "⚠️ OUT OF BALANCE" indicator at the top

### Test Changes in Equity:
1. Go to Reports tab
2. Find "Changes in Equity" card (indigo with wallet icon)
3. **First, Record a Transaction:**
   - Click "Record Transaction" button
   - Select transaction type (Owner Contribution, Withdrawal, or Dividend)
   - Enter amount (e.g., 1000000)
   - Add description (e.g., "Initial capital investment")
   - Click "Record Transaction"
   - You should see a success toast notification
4. **Then Generate the Report:**
   - Select period (MTD, QTD, or YTD)
   - Click "Generate" button
   - A dialog will pop up showing:
     - Beginning Balance
     - Net Income (from P&L)
     - Contributions
     - Withdrawals
     - Dividends
     - Ending Balance
     - Detailed transaction list

## Troubleshooting

### I don't see the "Reports" tab
- Make sure you're actually in the **Financials Hub** (not another module)
- Check the URL - it should have Financials Hub active
- Look for the horizontal tab navigation under the page header

### I see the Reports tab but not the new sections
- Make sure you've clicked on the "Reports" tab (it should be highlighted in blue)
- Scroll down past the first 3 cards (P&L, Balance Sheet, Cash Flow)
- Look for a header that says "Accounting Cycle Reports"
- If you still don't see it, try refreshing the page (F5 or Ctrl+R)

### The buttons don't do anything
- Open browser console (F12) and check for errors
- Look at the Console tab for any red error messages
- Common issues:
  - LocalStorage might be full - try clearing some old data
  - JavaScript error - refresh the page
  - Date picker issue - try selecting a different date

### Generate button shows an error
- Make sure you have selected a date for Trial Balance
- Make sure you have selected a period for Changes in Equity
- Check if you have any journal entries in your system (Trial Balance needs data)
- For Changes in Equity, you may need to generate a P&L Statement first to get Net Income

## Where Data is Stored

All new data is stored in your browser's localStorage:

- **Equity Transactions**: Key `equity_transactions`
- **Generated Reports**: Key `generated-reports`
- **Journal Entries**: Key `journal_entries` (used by Trial Balance)

To check your data:
1. Open browser console (F12)
2. Go to "Application" or "Storage" tab
3. Click on "Local Storage"
4. Look for keys starting with `equity_` or `generated-`

## Visual Navigation Map

```
Main App
  └─ Financials Hub (click here first)
      └─ Tabs Bar (horizontal navigation)
          ├─ Dashboard
          ├─ Sales & Commissions
          ├─ Expenses & Payables
          ├─ Accounting
          └─ Reports ⭐ (CLICK THIS)
              ├─ Main Financial Statements Section
              │   ├─ P&L Statement
              │   ├─ Balance Sheet
              │   └─ Cash Flow Statement
              │
              ├─ Accounting Cycle Reports Section ⭐⭐⭐ NEW
              │   ├─ Trial Balance 🎉
              │   └─ Changes in Equity 🎉
              │
              └─ Report Archive Section
                  └─ Previously generated reports appear here
```

## Quick Test Checklist

- [ ] Can navigate to Financials Hub
- [ ] Can see the Reports tab
- [ ] Can click on Reports tab
- [ ] Can see "Accounting Cycle Reports" section
- [ ] Can see Trial Balance card (orange)
- [ ] Can see Changes in Equity card (indigo)
- [ ] Can generate Trial Balance report
- [ ] Can open Record Transaction modal
- [ ] Can record an equity transaction
- [ ] Can generate Changes in Equity report
- [ ] Can see reports in Report Archive
- [ ] Can view previously generated reports

## Still Having Issues?

If you've followed all these steps and still don't see the features:

1. **Hard Refresh**: Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear Cache**: Clear browser cache and refresh
3. **Check Browser Console**: Look for JavaScript errors (F12 > Console tab)
4. **Verify File**: Make sure `/components/FinancialsHub.tsx` has the latest code
5. **Check Imports**: Verify `/lib/accounting.ts` and `/types/accounting.ts` exist

## Success Indicators

When everything is working correctly, you should see:

✅ "Reports" tab is clickable and highlights in blue when selected  
✅ Section header "Accounting Cycle Reports" is visible  
✅ Two new cards are present (Trial Balance and Changes in Equity)  
✅ Clicking "Generate Trial Balance" opens a dialog with account balances  
✅ Clicking "Record Transaction" opens a modal form  
✅ Successfully generated reports appear in Report Archive with proper icons  
✅ Toast notifications appear after generating reports  

## Next Steps After Finding Features

Once you can see the features:
1. Read `/ACCOUNTING_FEATURES_QUICK_GUIDE.md` for detailed usage instructions
2. Read `/ACCOUNTING_CYCLE_COMPLETE.md` for implementation details
3. Start by generating a Trial Balance to verify your books
4. Record some equity transactions to test the system
5. Generate a Changes in Equity statement

---

**If you've confirmed the features are visible**, refer to the other documentation files for detailed usage instructions!
