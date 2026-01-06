# 📚 Financials Hub V4 - User Guide

## 🎯 Overview

The **Financials Hub V4** is aaraazi's comprehensive financial management system with 8 specialized modules designed for real estate agencies. This guide covers the two newly added modules in Phase 6.

---

## 📊 Module 7: Financial Reports

### Purpose
Generate professional financial statements and analytical reports for your agency.

### Getting Started

1. **Access the Module**
   - Navigate to Financials from the main menu
   - Click on the "Financial Reports" card

2. **Dashboard Overview**
   - **Total Reports**: Total number of reports generated
   - **This Month**: Reports generated this month
   - **Last Generated**: Date of most recent report
   - **Favorite Reports**: Number of favorited templates
   - **Templates**: Total available report templates (8)

### Available Report Templates

#### Financial Reports
1. **Profit & Loss Statement**
   - Income statement showing revenue, expenses, and net profit
   - Best for: Monthly/quarterly financial review

2. **Balance Sheet**
   - Snapshot of assets, liabilities, and equity
   - Best for: Year-end financial position

3. **Cash Flow Statement**
   - Track cash inflows and outflows
   - Best for: Understanding liquidity

4. **Trial Balance**
   - Summary of all ledger accounts
   - Best for: Accounting verification

#### Operational Reports
5. **Commission Report**
   - Detailed breakdown of all commissions
   - Best for: Agent performance review

6. **Expense Summary**
   - Categorized expense analysis
   - Best for: Cost control and budgeting

7. **Property Performance**
   - ROI analysis by property
   - Best for: Investment decisions

8. **Investor Distribution Report**
   - Summary of investor profit distributions
   - Best for: Investor relations

### Generating a Report

#### Step 1: Select Report Template
- Click "Generate Report" on any template card
- Or click star icon to add to favorites first

#### Step 2: Configure Date Range
- **From Date**: Report start date
- **To Date**: Report end date
- **Quick Presets**:
  - This Month
  - Last Month
  - This Year
  - Last Year

#### Step 3: Select Export Format
- **PDF**: Professional formatted document
- **CSV**: Spreadsheet data (Excel compatible)
- **Excel**: Native Excel workbook (.xlsx)

#### Step 4: Comparison Options (Optional)
- ☑️ Include comparison with previous period
- **Previous Period (MoM)**: Compare with previous month
- **Previous Year (YoY)**: Compare with same period last year

#### Step 5: Generate & Export
- Click "Generate & Export"
- Report automatically downloads
- Report saved to history

### Managing Reports

#### Favorites System
1. Click the **star icon** on any template
2. Star turns yellow when favorited
3. Toggle "Show Favorites Only" filter
4. Quick access to frequently used reports

#### View History
- Click "History" button on templates
- See generation count
- Track reporting frequency

#### Search & Filter
- **Search**: Type report name or description
- **Category Filter**: Financial, Operational, Custom
- **Clear All**: Reset all filters

### Best Practices

✅ **Monthly Reports**
- Generate P&L at month-end
- Review expense summary weekly
- Track commission reports bi-weekly

✅ **Quarterly Reports**
- Generate balance sheet quarterly
- Review property performance quarterly
- Analyze cash flow trends

✅ **Annual Reports**
- Full year P&L for tax purposes
- Annual balance sheet for audits
- Investor distribution summary for year-end

✅ **Comparative Analysis**
- Use YoY comparison for annual planning
- Use MoM comparison for trend detection
- Export to Excel for custom analysis

---

## 🎯 Module 8: Budgeting & Forecasting

### Purpose
Plan budgets, track spending, and monitor variance against targets.

### Getting Started

1. **Access the Module**
   - Navigate to Financials from the main menu
   - Click on the "Budgeting & Forecasting" card

2. **Dashboard Overview**
   - **Total Budget**: Sum of all budget categories
   - **Actual Spend**: Total spending to date
   - **Variance**: Budget vs Actual (positive = under budget)
   - **Variance Percentage**: Variance as % of budget
   - **Remaining Budget**: Unspent budget amount
   - **Utilization Rate**: Percentage of budget used

### Creating a Budget

#### Step 1: Open Create Modal
- Click "Create Budget" button (top-right)

#### Step 2: Select Category
Choose from 10 predefined categories:
- Marketing & Advertising
- Salaries & Wages
- Office Rent
- Utilities
- Technology & Software
- Travel & Entertainment
- Professional Services
- Maintenance & Repairs
- Insurance
- Other Operating Expenses

#### Step 3: Set Budget Amount
- **Manual Entry**: Type amount in PKR
- **Quick Presets**: 250K, 500K, 1M, 2.5M, 5M
- Live PKR formatting displays below input

#### Step 4: Select Period
- **Monthly**: Jan 2026, Feb 2026, etc.
- **Quarterly**: Q1 2026, Q2 2026, etc.
- **Yearly**: FY 2026

#### Step 5: Create Budget
- Click "Create Budget"
- Budget appears in grid immediately
- Actual spend calculated from existing expenses

### Understanding Budget Cards

#### Card Layout
```
┌─────────────────────────────────────┐
│ Category Name          [Status Icon]│
│ Period                              │
│                                     │
│ Budget:        PKR 500,000         │
│ Actual Spend:  PKR 425,000         │
│ Remaining:     PKR 75,000          │
│                                     │
│ [Progress Bar] ████████░░ 85%      │
│                                     │
│ Variance: +PKR 75,000 (15.0%)      │
│ Utilization: 85.0%                 │
└─────────────────────────────────────┘
```

#### Status Indicators

🟢 **On Track** (Green)
- Utilization: 0% - 90%
- Spending is healthy
- No action needed

🟡 **Warning** (Yellow)
- Utilization: 90% - 100%
- Approaching budget limit
- Monitor closely

🔴 **Over Budget** (Red)
- Utilization: > 100%
- Budget exceeded
- Immediate action required

### Budget vs Actual Tracking

#### How It Works
1. You create a budget (e.g., "Marketing & Advertising: PKR 500,000")
2. System automatically tracks expenses with matching categories
3. Actual spend updates in real-time
4. Variance and utilization calculated automatically

#### Category Matching
The system matches expenses to budgets by:
- Exact category name match
- Partial keyword match
- Case-insensitive matching

Example:
- Budget: "Marketing & Advertising"
- Matches expenses with category: "Marketing", "Advertising", "marketing campaign"

### Search & Filter

#### Search Bar
- Search by category name
- Search by period (e.g., "Q1", "2026", "Jan")

#### Status Filter
- **On Track**: Show only healthy budgets
- **Warning**: Show budgets approaching limit
- **Over Budget**: Show exceeded budgets

#### Period Filter
- Filter by specific periods when multiple exist
- Useful for multi-period planning

### Export & Reporting

#### Export to CSV
1. Click "Export CSV" button (top-right)
2. File downloads automatically
3. Open in Excel or Google Sheets

#### CSV Columns
- Category
- Period
- Budget (PKR)
- Actual (PKR)
- Variance (PKR)
- Variance %
- Status

### Variance Analysis

#### Understanding Variance

**Positive Variance** (Green)
- Budget: PKR 500,000
- Actual: PKR 425,000
- Variance: +PKR 75,000 (15%)
- Meaning: Under budget by PKR 75,000

**Negative Variance** (Red)
- Budget: PKR 500,000
- Actual: PKR 550,000
- Variance: -PKR 50,000 (-10%)
- Meaning: Over budget by PKR 50,000

#### Taking Action

**When Under Budget**
✅ Maintain current spending pace
✅ Consider reallocating to other categories
✅ Plan for next period's budget

**When Approaching Budget (Warning)**
⚠️ Review remaining essential expenses
⚠️ Prioritize critical spending
⚠️ Consider budget adjustment request

**When Over Budget**
🚨 Immediate spending freeze in category
🚨 Review and cut non-essential costs
🚨 Document reason for overage
🚨 Submit budget revision request

### Budget Planning Best Practices

#### Monthly Budgeting
1. **Week 1**: Review previous month actuals
2. **Week 2**: Set budgets for current month
3. **Week 3**: Monitor mid-month utilization
4. **Week 4**: Adjust spending if needed

#### Quarterly Budgeting
1. Break down quarterly budget into monthly targets
2. Create separate budgets for each month
3. Track cumulative spending
4. Adjust remaining months based on actuals

#### Annual Budgeting
1. Review previous year's expenses
2. Account for inflation (typically 8-12% in Pakistan)
3. Plan for growth and new initiatives
4. Create quarterly budgets
5. Review and revise quarterly

### Integration with Expenses

#### Automatic Updates
- Create expense → Budget actual spend updates
- Edit expense → Budget recalculates
- Delete expense → Budget adjusts downward
- Real-time synchronization

#### Workflow Example
1. **Monday**: Create marketing budget (PKR 100,000)
2. **Tuesday**: Add expense "Facebook Ads" (PKR 25,000)
3. **Instant**: Budget shows:
   - Actual: PKR 25,000
   - Remaining: PKR 75,000
   - Utilization: 25%
   - Status: On Track

### Common Use Cases

#### Use Case 1: Monthly Operating Budget
```
Category: Office Rent
Amount: PKR 150,000
Period: Jan 2026
Usage: Track fixed monthly costs
```

#### Use Case 2: Marketing Campaign
```
Category: Marketing & Advertising
Amount: PKR 500,000
Period: Q1 2026
Usage: Plan quarter-long campaign spending
```

#### Use Case 3: Annual Salaries
```
Category: Salaries & Wages
Amount: PKR 6,000,000
Period: FY 2026
Usage: Track total payroll for year
```

#### Use Case 4: Project-Based Budget
```
Category: Professional Services
Amount: PKR 250,000
Period: Q2 2026
Usage: Allocate for specific project costs
```

---

## 🔗 Module Integration

### Financial Reports ↔ Budgeting

#### Generate Budget Performance Report
1. Create budgets in Budgeting workspace
2. Add expenses throughout period
3. Navigate to Financial Reports
4. Generate "Expense Summary" report
5. Compare with budgets manually in Excel

#### Monthly Review Process
1. **End of Month**: Generate P&L report
2. Navigate to Budgeting workspace
3. Review all budget variances
4. Export budget CSV
5. Combine with P&L for complete picture

### Budgeting ↔ Expenses

#### Real-Time Tracking
- Every expense automatically updates relevant budget
- No manual reconciliation needed
- Instant variance alerts

#### Category Alignment
- Create expenses with clear categories
- Match expense categories to budget names
- Consistent naming for accurate tracking

---

## 🎯 Quick Tips

### Financial Reports Module

✅ **Favorite frequently-used reports** for quick access  
✅ **Use comparison features** for trend analysis  
✅ **Export to Excel** for custom calculations  
✅ **Generate monthly reports** on consistent schedule  
✅ **Keep report history** for audit trail  

### Budgeting Module

✅ **Start with major categories** (rent, salaries, marketing)  
✅ **Use quarterly budgets** for better forecasting  
✅ **Review weekly** to catch issues early  
✅ **Adjust budgets** when needed (don't set and forget)  
✅ **Track utilization rate** as primary KPI  

---

## ❓ Frequently Asked Questions

### Financial Reports

**Q: Can I customize report templates?**  
A: Currently, use the 8 predefined templates. Custom reports coming in Phase 7.

**Q: How do I share reports with investors?**  
A: Export to PDF and send via email. Direct sharing coming soon.

**Q: Can I schedule automatic report generation?**  
A: Not yet. This is a planned feature for future release.

**Q: What's the difference between PDF and Excel export?**  
A: PDF is formatted document. Excel/CSV allows data manipulation.

### Budgeting & Forecasting

**Q: How do I delete a budget?**  
A: Currently, budgets are permanent. Editing feature coming soon.

**Q: Can I have multiple budgets for same category?**  
A: Yes, if they're for different periods (e.g., Jan vs Feb).

**Q: What if my expense category doesn't match budget?**  
A: System uses partial matching. Or adjust expense category name.

**Q: Can I set budget alerts?**  
A: Visual alerts at 90% and 100%. Email alerts coming in Phase 7.

**Q: How do I forecast next period's budget?**  
A: Review current period actuals, add 10-15% buffer, set as new budget.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review testing checklist for known issues
3. Contact aaraazi support
4. Submit feedback for improvements

---

**Document Version**: 1.0.0  
**Last Updated**: January 1, 2026  
**Modules Covered**: Financial Reports, Budgeting & Forecasting  

---

*Happy budgeting! 🎯*
