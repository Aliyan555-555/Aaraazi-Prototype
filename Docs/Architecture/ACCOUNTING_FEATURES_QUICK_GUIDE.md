# Accounting Features Quick Guide

## Accessing the Features

### Navigation Path:
```
Main Menu > Financials Hub > Reports Tab
```

## Feature 1: Trial Balance

### Purpose:
Verifies that your books are balanced (Total Debits = Total Credits) across all accounts.

### When to Use:
- End of each accounting period (month/quarter/year)
- Before generating financial statements
- When troubleshooting accounting discrepancies
- During audits or financial reviews

### How to Use:
1. Go to **Financials Hub** > **Reports** tab
2. Scroll to "Accounting Cycle Reports" section
3. In the "Trial Balance" card:
   - Select "As of Date" (e.g., December 31, 2024)
   - Click "Generate Trial Balance"
4. Review the report in the popup dialog

### What You'll See:
```
TRIAL BALANCE
As of December 31, 2024

ASSETS
  Cash & Bank                          Dr: 5,000,000    Cr: 0
  Accounts Receivable                  Dr: 2,500,000    Cr: 0
  Property Inventory                   Dr: 50,000,000   Cr: 0
  
LIABILITIES
  Accounts Payable                     Dr: 0            Cr: 1,200,000
  Accrued Expenses                     Dr: 0            Cr: 300,000
  
EQUITY
  Owner's Capital                      Dr: 0            Cr: 40,000,000
  Retained Earnings                    Dr: 0            Cr: 10,000,000
  
REVENUE
  Commission Revenue                   Dr: 0            Cr: 8,000,000
  Rental Income                        Dr: 0            Cr: 500,000
  
EXPENSES
  Salaries & Wages                     Dr: 1,500,000    Cr: 0
  Marketing & Advertising              Dr: 800,000      Cr: 0
  Office Expenses                      Dr: 200,000      Cr: 0

TOTAL                                  Dr: 60,000,000   Cr: 60,000,000

✅ BALANCED
```

### Understanding the Results:
- **Green Badge "Balanced"** = Your books are correct (debits = credits)
- **Red Badge "Out of Balance"** = Error detected, investigate immediately
- **Accounts organized by type** = Easy to review each category
- **Zero balances hidden** = Only shows accounts with activity

### Best Practices:
✅ Run Trial Balance at end of each month
✅ Investigate any imbalances immediately
✅ Save/print for financial records
✅ Compare with previous periods

## Feature 2: Statement of Changes in Equity

### Purpose:
Shows how owner's equity changed during a period due to profits, contributions, and withdrawals.

### When to Use:
- End of each quarter or year
- When owner makes contributions or withdrawals
- For understanding business profitability impact
- During investor reporting or fundraising

### How to Use:
1. Go to **Financials Hub** > **Reports** tab
2. Scroll to "Accounting Cycle Reports" section
3. In the "Changes in Equity" card:
   - Select period (MTD/QTD/YTD)
   - Click "Record Transaction" if you need to add contributions/withdrawals first
   - Click "Generate" to create the statement
4. Review the statement in the popup dialog

### Recording Equity Transactions (Before Generating Report):
1. Click "Record Transaction" button
2. Fill in the modal:
   - **Transaction Type**: 
     - Owner Contribution (adding money/assets to business)
     - Owner Withdrawal (taking money out for personal use)
     - Dividend Payment (distributing profits to owners)
   - **Amount**: Enter PKR amount
   - **Date**: Transaction date
   - **Description**: Why this transaction happened
   - **Payment Method**: Cash, Bank Transfer, Cheque, or Online
3. Click "Record Transaction"

### What You'll See:
```
STATEMENT OF CHANGES IN EQUITY
Period: January 1, 2024 - December 31, 2024

Beginning Balance (Jan 1, 2024)           40,000,000

Add: Net Income for Period                 7,500,000
Add: Owner Contributions                   2,000,000

Less: Owner Withdrawals                   (1,000,000)
Less: Dividends Paid                      (1,500,000)

Ending Balance (Dec 31, 2024)             47,000,000

DETAILED TRANSACTIONS
Date           Type                  Description              Amount
-----------------------------------------------------------------
Jan 15, 2024   Owner Contribution    Capital injection      2,000,000
Mar 31, 2024   Dividend              Q1 profit distribution (500,000)
Jun 30, 2024   Dividend              Q2 profit distribution (500,000)
Sep 15, 2024   Owner Withdrawal      Personal expenses      (1,000,000)
Sep 30, 2024   Dividend              Q3 profit distribution (500,000)
Dec 31, 2024   Net Income            Yearly profit           7,500,000
```

### Understanding the Components:

**Beginning Balance**: Equity at start of period
- Previous period's ending balance
- Or initial capital if first period

**Net Income**: Profit (or loss) from operations
- Automatically calculated from P&L Statement
- Revenue minus Expenses for the period
- Positive = Profit (increases equity)
- Negative = Loss (decreases equity)

**Owner Contributions**: Money/assets owner puts INTO business
- Cash investments
- Property contributed to business
- Equipment or other assets
- INCREASES equity

**Owner Withdrawals**: Money owner takes OUT for personal use
- Also called "drawings"
- Personal expenses paid from business
- Not the same as salary (salary is an expense)
- DECREASES equity

**Dividends**: Profit distributions to owners
- Formal profit sharing
- Usually done quarterly or annually
- DECREASES equity
- Different from withdrawals (dividends come from profits)

**Ending Balance**: Final equity at end of period
- This becomes next period's beginning balance

### Common Scenarios:

#### Scenario 1: Profitable Year with No Withdrawals
```
Beginning: 40,000,000
+ Net Income: 10,000,000
= Ending: 50,000,000
(Equity grew 25%)
```

#### Scenario 2: Owner Invests More Capital
```
Beginning: 40,000,000
+ Net Income: 5,000,000
+ Contribution: 3,000,000
= Ending: 48,000,000
```

#### Scenario 3: Owner Takes Withdrawals
```
Beginning: 40,000,000
+ Net Income: 8,000,000
- Withdrawals: 2,000,000
- Dividends: 1,000,000
= Ending: 45,000,000
```

#### Scenario 4: Loss Year
```
Beginning: 40,000,000
- Net Loss: (3,000,000)
= Ending: 37,000,000
(Equity decreased)
```

### Best Practices:
✅ Generate at least quarterly (every 3 months)
✅ Record all contributions/withdrawals promptly
✅ Distinguish between withdrawals (personal) and dividends (profit distribution)
✅ Compare ending balance with Balance Sheet equity to verify accuracy
✅ Use for tax planning and owner compensation decisions

## Report Archive

### Accessing Previous Reports:
1. All generated reports appear in the "Report Archive" section
2. Click "View" to re-open any previous report
3. Reports show:
   - Report type (with color-coded icon)
   - Period covered
   - Generation date and time

### Report Icons:
- 🔵 Blue (Bar Chart) = P&L Statement
- 🟢 Green (Pie Chart) = Balance Sheet
- 🟣 Purple (Trending Up) = Cash Flow Statement
- 🟠 Orange (Calculator) = Trial Balance
- 🟣 Indigo (Wallet) = Changes in Equity

## Integration with Other Modules

### Trial Balance Integrations:
- **General Ledger**: Reads all posted journal entries
- **Expenses Module**: Includes all recorded expenses
- **Commission Tracking**: Includes commission revenue
- **Property Sales**: Includes sale transaction entries

### Changes in Equity Integrations:
- **P&L Statement**: Net income auto-populated from latest P&L
- **Equity Transactions**: All manually recorded transactions
- **Property Portfolio**: Agency-owned property profits
- **Commission Earnings**: Net profitability calculations

## Exporting Reports

Currently, you can export reports by:
1. Click "Export PDF" button in report view dialog
2. This triggers browser print dialog
3. Save as PDF using print-to-PDF
4. Alternatively, use browser's "Print to PDF" feature

## Troubleshooting

### Trial Balance Won't Balance:
**Problem**: Difference shows non-zero amount
**Possible Causes**:
1. Manual journal entry with unequal debits/credits
2. Deleted or reversed entry not properly recorded
3. Data corruption in localStorage

**Solutions**:
1. Review recent manual journal entries
2. Check General Ledger for suspicious entries
3. Verify all transactions have matching debits and credits
4. Contact support if issue persists

### Changes in Equity Shows Unexpected Numbers:
**Problem**: Ending balance doesn't match Balance Sheet
**Possible Causes**:
1. Forgot to record a contribution or withdrawal
2. Net Income not properly calculated from P&L
3. Missing equity transactions

**Solutions**:
1. Compare with Balance Sheet equity section
2. Review all equity transactions for the period
3. Re-generate P&L Statement to verify net income
4. Add any missing transactions and re-generate

### Report Not Generating:
**Problem**: Click generate but nothing happens
**Possible Causes**:
1. No data available for selected period
2. Browser localStorage full
3. JavaScript error in console

**Solutions**:
1. Check browser console for errors (F12)
2. Verify you have transactions in the selected period
3. Clear browser cache and reload
4. Try different date range

## Tips for Accountants

### Month-End Close Process:
1. ✅ Record all transactions for the month
2. ✅ Post all journal entries to General Ledger
3. ✅ Run Trial Balance to verify accuracy
4. ✅ Generate P&L Statement
5. ✅ Generate Balance Sheet
6. ✅ Generate Cash Flow Statement
7. ✅ Generate Changes in Equity (if applicable)
8. ✅ Export all reports for records
9. ✅ Reconcile bank accounts
10. ✅ File reports and lock period

### Quarterly Review:
- Compare Trial Balance to prior quarter
- Analyze Changes in Equity trends
- Review owner contribution/withdrawal patterns
- Verify equity balance accuracy

### Year-End Closing:
- Generate annual Trial Balance
- Create annual Changes in Equity statement
- Calculate total owner distributions for tax reporting
- Verify all equity transactions recorded
- Transfer net income to Retained Earnings
- Prepare for tax filing

## Keyboard Shortcuts

When in Financials Hub:
- **Tab** to navigate between sections
- **Enter** to generate selected report
- **Esc** to close report viewing dialog

---

**Last Updated**: January 4, 2026
**Version**: 1.0
**Status**: ✅ Production Ready
