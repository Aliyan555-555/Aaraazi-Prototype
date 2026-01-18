# Reports Module - Complete User Guide

**aaraazi Real Estate Management Platform**  
**Module**: Reports & Analytics  
**Version**: 4.1  
**Last Updated**: January 15, 2026

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Understanding Reports](#understanding-reports)
3. [Who Uses This Module](#who-uses-this-module)
4. [Report Categories](#report-categories)
5. [Property Reports](#property-reports)
6. [Sales & Transaction Reports](#sales--transaction-reports)
7. [Lead & Pipeline Reports](#lead--pipeline-reports)
8. [Financial Reports](#financial-reports)
9. [Performance Reports](#performance-reports)
10. [Custom Report Builder](#custom-report-builder)
11. [Report Scheduling](#report-scheduling)
12. [Export & Sharing](#export--sharing)
13. [Tips & Best Practices](#tips--best-practices)
14. [Troubleshooting](#troubleshooting)
15. [FAQs](#faqs)

---

## Overview

### What is the Reports Module?

The Reports Module is your **business intelligence system** that transforms raw data into actionable insights. It provides 50+ pre-built reports plus a custom report builder to analyze every aspect of your real estate business.

**Think of it like this**: If your modules are data collectors, Reports is the analyst that makes sense of all that data and shows you what's working, what's not, and where to focus.

### What Can You Do?

✅ **Run Pre-Built Reports** - 50+ ready-to-use reports  
✅ **Build Custom Reports** - Create your own analytics  
✅ **Schedule Reports** - Automate delivery (daily/weekly/monthly)  
✅ **Export Data** - PDF, Excel, CSV formats  
✅ **Share Insights** - Email reports to team/clients  
✅ **Track Trends** - Compare periods, spot patterns  
✅ **Measure Performance** - KPIs, goals, benchmarks  
✅ **Make Decisions** - Data-driven business strategy  

### Key Features

| Feature | Description |
|---------|-------------|
| **50+ Pre-Built Reports** | Ready-to-run across all modules |
| **Custom Report Builder** | Drag-and-drop report creation |
| **Real-Time Data** | Always current information |
| **Scheduled Delivery** | Auto-email reports daily/weekly/monthly |
| **Multiple Formats** | PDF, Excel, CSV export |
| **Filters & Segments** | Slice data any way you need |
| **Visualizations** | Charts, graphs, tables |
| **Comparisons** | Period-over-period analysis |

---

## Understanding Reports

### Reports vs Dashboards

**Dashboard**:
```
Real-time overview
- Live metrics
- Quick glance
- Action items
- Updated constantly
```

**Reports**:
```
Detailed analysis
- Historical data
- Deep dive
- Trends over time
- Run on demand or scheduled
```

### Report Types

```
┌─────────────────────────────────────┐
│  REPORT TYPES                       │
│                                     │
│  📊 SUMMARY REPORTS                 │
│  High-level overviews              │
│  Example: Monthly sales summary    │
│                                     │
│  📈 DETAILED REPORTS                │
│  Transaction-level details         │
│  Example: All deals this quarter   │
│                                     │
│  📉 TREND REPORTS                   │
│  Changes over time                 │
│  Example: Revenue by month (12mo)  │
│                                     │
│  🎯 PERFORMANCE REPORTS             │
│  Goals vs actuals                  │
│  Example: Agent performance        │
│                                     │
│  💰 FINANCIAL REPORTS               │
│  P&L, cash flow, etc.              │
│  Example: Profit & Loss statement  │
└─────────────────────────────────────┘
```

---

## Who Uses This Module

### For Agency Owners

**Strategic Decision Makers** - Owners use reports to:
- Monitor overall business health
- Identify growth opportunities
- Track profitability by segment
- Make investment decisions
- Plan strategic direction

**Most Used Reports**:
- Executive Summary
- Revenue & Profitability
- Portfolio Performance
- Market Analysis

---

### For Sales Managers

**Team Leaders** - Managers use reports to:
- Track team performance
- Identify coaching opportunities
- Forecast revenue
- Allocate resources
- Set realistic goals

**Most Used Reports**:
- Agent Performance
- Sales Pipeline
- Conversion Rates
- Lead Sources

---

### For Agents

**Individual Contributors** - Agents use reports to:
- Monitor personal performance
- Track commission earnings
- Analyze their pipeline
- Improve conversion rates
- Plan their activities

**Most Used Reports**:
- My Commission Report
- My Deals Report
- My Lead Conversion
- My Activity Report

---

### For Finance Teams

**Financial Analysts** - Finance uses reports to:
- Generate financial statements
- Track cash flow
- Monitor budgets
- Calculate taxes
- Audit transactions

**Most Used Reports**:
- Profit & Loss
- Cash Flow Statement
- Commission Report
- Tax Reports

---

## Report Categories

### The 6 Report Categories

```
1. PROPERTY REPORTS (12 reports)
   - Inventory, listings, performance
   
2. SALES & TRANSACTION REPORTS (15 reports)
   - Deals, cycles, commission
   
3. LEAD & PIPELINE REPORTS (10 reports)
   - Conversion, sources, pipeline
   
4. FINANCIAL REPORTS (8 reports)
   - P&L, cash flow, budgets
   
5. PERFORMANCE REPORTS (10 reports)
   - Agent, team, goals
   
6. CUSTOM REPORTS (Unlimited)
   - Build your own
```

---

## Property Reports

### 1. Property Inventory Report

**Purpose**: Complete list of all properties with key details.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ PROPERTY INVENTORY REPORT                   │
│ As of January 15, 2026                      │
│                                             │
│ TOTAL PROPERTIES: 25                        │
│                                             │
│ BY STATUS:                                  │
│ ┌─────────────────────────────┐            │
│ │ Available      12    48%    │            │
│ │ Under Offer     8    32%    │            │
│ │ Sold            3    12%    │            │
│ │ Rented          2     8%    │            │
│ └─────────────────────────────┘            │
│                                             │
│ BY TYPE:                                    │
│ ┌─────────────────────────────┐            │
│ │ Villa          10    40%    │            │
│ │ Apartment       8    32%    │            │
│ │ Commercial      5    20%    │            │
│ │ Plot            2     8%    │            │
│ └─────────────────────────────┘            │
│                                             │
│ BY LOCATION:                                │
│ DHA Phase 8:     10 (40%)                   │
│ Clifton:          8 (32%)                   │
│ Bahria Town:      5 (20%)                   │
│ Other:            2 (8%)                    │
│                                             │
│ TOTAL VALUE: PKR 1,250,000,000              │
│ Average Price: PKR 50,000,000               │
│                                             │
│ DETAILED LISTING:                           │
│ ┌───────────────────────────────────────┐  │
│ │ ID   Property        Type    Status   │  │
│ │ P001 Modern Villa    Villa   Available│  │
│ │      PKR 75M • DHA • 500 sq yd        │  │
│ │                                        │  │
│ │ P002 Sea View Apt    Apt     Under    │  │
│ │      PKR 45M • Clifton • 1800 sq ft   │  │
│ │                                        │  │
│ │ [23 more properties...]                │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ [Export to Excel] [Email Report] [Print]   │
└─────────────────────────────────────────────┘
```

**Filters Available**:
- Status (Available, Sold, etc.)
- Type (Villa, Apartment, etc.)
- Location (DHA, Clifton, etc.)
- Price range
- Date added
- Agent assigned

---

### 2. Days on Market Report

**Purpose**: Track how long properties take to sell/rent.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ DAYS ON MARKET ANALYSIS                     │
│ January 1 - January 15, 2026                │
│                                             │
│ OVERALL PERFORMANCE:                        │
│ Average Days on Market: 42 days             │
│ Median: 38 days                             │
│ Market Benchmark: 45 days ✅                │
│                                             │
│ BY STATUS:                                  │
│ ┌─────────────────────────────┐            │
│ │ Sold           38 days       │            │
│ │ Under Offer    28 days       │            │
│ │ Available      56 days ⚠️    │            │
│ └─────────────────────────────┘            │
│                                             │
│ BY PROPERTY TYPE:                           │
│ Villa:        45 days                       │
│ Apartment:    35 days                       │
│ Commercial:   52 days                       │
│ Plot:         68 days                       │
│                                             │
│ BY PRICE RANGE:                             │
│ < PKR 50M:        32 days ✅                │
│ PKR 50-100M:      45 days                   │
│ > PKR 100M:       62 days ⚠️                │
│                                             │
│ LONGEST ON MARKET (Alert):                  │
│ 1. Commercial Plaza - 89 days              │
│    Recommended: Price reduction             │
│                                             │
│ 2. DHA Villa - 76 days                     │
│    Recommended: Enhanced marketing          │
│                                             │
│ 3. Bahria Plot - 72 days                   │
│    Recommended: Review pricing              │
│                                             │
│ FASTEST SALES:                              │
│ 1. Clifton Apartment - 12 days             │
│ 2. DHA Villa - 18 days                     │
│ 3. Defence House - 21 days                 │
│                                             │
│ INSIGHTS:                                   │
│ ✅ Properties < PKR 50M sell 40% faster    │
│ ⚠️ Commercial takes 45% longer than resi   │
│ 💡 Average 25% faster when priced right    │
└─────────────────────────────────────────────┘
```

---

### 3. Property Performance Report

**Purpose**: Analyze which properties are performing best.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ PROPERTY PERFORMANCE RANKING                │
│ Q1 2026                                     │
│                                             │
│ TOP PERFORMERS (By Interest):               │
│                                             │
│ 1. Modern Villa DHA                         │
│    Viewings: 15                             │
│    Leads: 8                                 │
│    Offers: 3                                │
│    Status: Under negotiation                │
│    Days Listed: 25                          │
│                                             │
│ 2. Sea View Apartment Clifton               │
│    Viewings: 12                             │
│    Leads: 6                                 │
│    Offers: 2                                │
│    Status: Offer accepted                   │
│    Days Listed: 18                          │
│                                             │
│ 3. Commercial Plaza                         │
│    Viewings: 10                             │
│    Leads: 5                                 │
│    Offers: 1                                │
│    Status: Active                           │
│    Days Listed: 32                          │
│                                             │
│ POOR PERFORMERS (Need Attention):           │
│                                             │
│ 1. Bahria Villa                             │
│    Viewings: 2                              │
│    Leads: 1                                 │
│    Offers: 0                                │
│    Days Listed: 68 ⚠️                       │
│    Issue: Pricing too high                  │
│    Action: Reduce by 8-10%                  │
│                                             │
│ 2. Industrial Warehouse                     │
│    Viewings: 1                              │
│    Leads: 0                                 │
│    Offers: 0                                │
│    Days Listed: 82 🔴                       │
│    Issue: Limited target market             │
│    Action: Targeted marketing needed        │
│                                             │
│ PERFORMANCE METRICS:                        │
│ Avg Viewings per Property: 5.2              │
│ Avg Leads per Property: 2.8                 │
│ Viewing to Lead Rate: 54%                   │
│ Lead to Offer Rate: 18%                     │
└─────────────────────────────────────────────┘
```

---

### 4. Price Analysis Report

**Purpose**: Compare your pricing vs market.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ PRICING ANALYSIS REPORT                     │
│ By Location and Type                        │
│                                             │
│ DHA PHASE 8 - VILLAS:                       │
│ Your Average: PKR 75,000,000                │
│ Market Average: PKR 72,000,000              │
│ Variance: +4.2% (Slightly high)             │
│                                             │
│ Your Properties (5):                        │
│ • Villa A: PKR 80M (Market: PKR 76M) ⚠️     │
│ • Villa B: PKR 75M (Market: PKR 73M) ✅     │
│ • Villa C: PKR 72M (Market: PKR 70M) ✅     │
│ • Villa D: PKR 70M (Market: PKR 68M) ✅     │
│ • Villa E: PKR 68M (Market: PKR 72M) 💰     │
│                                             │
│ CLIFTON - APARTMENTS:                       │
│ Your Average: PKR 42,000,000                │
│ Market Average: PKR 45,000,000              │
│ Variance: -6.7% (Competitively priced) ✅   │
│                                             │
│ RECOMMENDATIONS:                            │
│ 1. Reduce Villa A by PKR 4M (5%)            │
│    Expected: Faster sale                    │
│                                             │
│ 2. Consider increasing Clifton apartments   │
│    Opportunity: PKR 3M more per unit        │
│                                             │
│ 3. Price Villa E as-is                      │
│    Already below market - good deal         │
│                                             │
│ MARKET TRENDS:                              │
│ DHA: Prices stable (+2% YoY)                │
│ Clifton: Prices rising (+8% YoY)            │
│ Bahria: Prices declining (-3% YoY)          │
└─────────────────────────────────────────────┘
```

---

### 5. Property Listings Report

**Purpose**: Track active listings and their status.

**Includes**:
- All active listings
- Listing agent
- List date
- Price changes history
- Marketing activities
- Current status

---

### 6. Sold Properties Report

**Purpose**: Analyze completed sales.

**Includes**:
- Sale price
- Original list price
- Price variance
- Days on market
- Selling agent
- Commission earned

---

### 7-12. Additional Property Reports

- **Property Valuation Report** - Current market values
- **Rental Income Report** - Rental performance
- **Property Comparison Report** - Side-by-side analysis
- **Location Analysis Report** - Performance by area
- **Property Type Performance** - Villas vs Apartments vs Commercial
- **Photo & Marketing Report** - Marketing material status

---

## Sales & Transaction Reports

### 1. Sales Pipeline Report

**Purpose**: Visualize all active deals and forecast closings.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ SALES PIPELINE REPORT                       │
│ January 15, 2026                            │
│                                             │
│ PIPELINE OVERVIEW:                          │
│ Total Pipeline Value: PKR 450,000,000       │
│ Number of Deals: 42                         │
│ Average Deal Size: PKR 10,714,286           │
│                                             │
│ BY STAGE:                                   │
│ ┌─────────────────────────────────────┐    │
│ │ Stage           Deals    Value      │    │
│ │ NEW              12    PKR 120M     │    │
│ │ ACTIVE           18    PKR 180M     │    │
│ │ NEGOTIATION       8    PKR 100M     │    │
│ │ ACCEPTED          4    PKR 50M      │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ VISUAL PIPELINE:                            │
│ NEW          [████████████] 12 deals        │
│ ACTIVE       [████████████████████] 18      │
│ NEGOTIATION  [████████] 8 deals             │
│ ACCEPTED     [████] 4 deals                 │
│                                             │
│ CONVERSION FUNNEL:                          │
│ NEW → ACTIVE:         75% (9/12 typically)  │
│ ACTIVE → NEGOTIATION: 44% (8/18)            │
│ NEGOTIATION → CLOSE:  50% (4/8 expected)    │
│ Overall Close Rate:   15% (realistic)       │
│                                             │
│ FORECAST (Next 30 Days):                    │
│ Expected Closings: 4 deals                  │
│ Expected Value: PKR 50,000,000              │
│ Expected Commission: PKR 2,000,000          │
│ Confidence: 85%                             │
│                                             │
│ AT RISK (Need Attention):                   │
│ 1. DEAL-045 - No activity 8 days           │
│ 2. DEAL-032 - Stalled in negotiation       │
│ 3. DEAL-018 - Buyer financing issues       │
│                                             │
│ HOT DEALS (Likely to Close Soon):           │
│ 1. DEAL-051 - Verbal agreement reached     │
│ 2. DEAL-049 - Final offer submitted        │
│ 3. DEAL-043 - Due diligence complete       │
└─────────────────────────────────────────────┘
```

---

### 2. Commission Report

**Purpose**: Track earned and pending commission.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ COMMISSION REPORT                           │
│ January 2026                                │
│                                             │
│ TOTAL COMMISSION EARNED:                    │
│ PKR 12,450,000                              │
│                                             │
│ BREAKDOWN:                                  │
│ ┌─────────────────────────────────────┐    │
│ │ Type          Amount        %       │    │
│ │ Sell Cycles   PKR 8.5M     68%      │    │
│ │ Purchase      PKR 3.0M     24%      │    │
│ │ Rent Cycles   PKR 1.0M      8%      │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ BY AGENT:                                   │
│ 1. Ali Khan:     PKR 4,500,000 (36%)       │
│ 2. Sara Ahmed:   PKR 3,800,000 (31%)       │
│ 3. Hassan Ali:   PKR 2,900,000 (23%)       │
│ 4. Others:       PKR 1,250,000 (10%)       │
│                                             │
│ PAYMENT STATUS:                             │
│ ┌─────────────────────────────────────┐    │
│ │ Status        Amount        %       │    │
│ │ Paid          PKR 9.25M    74%      │    │
│ │ Pending       PKR 3.20M    26%      │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ PENDING DETAILS (6 transactions):           │
│ 1. SELL-045: PKR 1,500,000 (Awaiting)      │
│ 2. BUY-023: PKR 900,000 (Due this week)    │
│ 3. SELL-042: PKR 450,000 (Processing)      │
│ [+3 more...]                                │
│                                             │
│ TREND (Last 6 Months):                      │
│ Jan: PKR 2.1M                               │
│ Dec: PKR 1.9M                               │
│ Nov: PKR 2.3M                               │
│ Oct: PKR 1.8M                               │
│ Sep: PKR 2.0M                               │
│ Aug: PKR 1.7M                               │
│ Average: PKR 2.0M/month                     │
│ Trend: ↗ +10% vs 6-month average            │
│                                             │
│ GOALS:                                      │
│ Monthly Target: PKR 3,000,000               │
│ Achieved: PKR 2,100,000 (70%)               │
│ Remaining: PKR 900,000 needed               │
│ Days Left: 16 days                          │
│ Daily Target: PKR 56,250/day                │
└─────────────────────────────────────────────┘
```

---

### 3. Transaction Volume Report

**Purpose**: Track number and value of transactions.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ TRANSACTION VOLUME REPORT                   │
│ Q1 2026 (Jan 1 - Mar 31)                   │
│                                             │
│ TOTAL TRANSACTIONS: 27                      │
│ Total Value: PKR 850,000,000                │
│ Average Transaction: PKR 31,481,481         │
│                                             │
│ BY TYPE:                                    │
│ ┌─────────────────────────────────────┐    │
│ │ Type      Count   Value      Avg    │    │
│ │ Sell        15   PKR 550M   36.7M   │    │
│ │ Purchase     8   PKR 250M   31.3M   │    │
│ │ Rent         4   PKR 50M    12.5M   │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ MONTHLY BREAKDOWN:                          │
│ January:  9 deals, PKR 285M                 │
│ February: 10 deals, PKR 315M (projected)    │
│ March:    8 deals, PKR 250M (projected)     │
│                                             │
│ YEAR-OVER-YEAR:                             │
│ Q1 2025: 22 transactions, PKR 680M          │
│ Q1 2026: 27 transactions, PKR 850M          │
│ Growth: +23% volume, +25% value 🎉          │
│                                             │
│ AVERAGE DEAL SIZE TREND:                    │
│ Q1 2025: PKR 30.9M                          │
│ Q1 2026: PKR 31.5M                          │
│ Change: +2% (larger deals)                  │
│                                             │
│ TOP 5 TRANSACTIONS (By Value):              │
│ 1. Commercial Plaza: PKR 120M               │
│ 2. DHA Villa: PKR 80M                       │
│ 3. Clifton Apartments: PKR 75M              │
│ 4. Office Building: PKR 65M                 │
│ 5. Residential Villa: PKR 55M               │
└─────────────────────────────────────────────┘
```

---

### 4. Cycle Performance Report

**Purpose**: Analyze sell/purchase/rent cycle performance.

**Includes**:
- Average time per stage
- Bottleneck identification
- Success rate by cycle type
- Agent performance by cycle

---

### 5. Deal Conversion Report

**Purpose**: Track how deals convert through stages.

**Includes**:
- Conversion rates by stage
- Time in each stage
- Drop-off points
- Success factors analysis

---

### 6-15. Additional Sales Reports

- **Closed Deals Report** - All completed transactions
- **Lost Deals Report** - Failed deals with reasons
- **Negotiation Analysis** - Offer patterns, acceptance rates
- **Commission by Property Type** - Which types earn most
- **Cross-Agent Deals Report** - Co-brokerage performance
- **Average Days to Close** - Transaction speed
- **Price Reduction Analysis** - Impact of price changes
- **Offer Acceptance Rate** - First offer vs counters
- **Transaction Timeline Report** - Stage duration analysis
- **Revenue Forecast Report** - Projected earnings

---

## Lead & Pipeline Reports

### 1. Lead Conversion Report

**Purpose**: Measure lead-to-deal conversion performance.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ LEAD CONVERSION ANALYSIS                    │
│ Q1 2026 (Jan 1 - Mar 31)                   │
│                                             │
│ OVERVIEW:                                   │
│ Total Leads: 156                            │
│ Converted to Deals: 23                      │
│ Conversion Rate: 14.7%                      │
│ Industry Benchmark: 12% ✅                  │
│                                             │
│ BY LEAD SOURCE:                             │
│ ┌──────────────────────────────────────┐   │
│ │ Source      Leads  Deals  Rate       │   │
│ │ Referrals    32     8     25% 🏆     │   │
│ │ Facebook     45     8     18% ✅     │   │
│ │ Google       28     3     11%        │   │
│ │ Walk-ins     24     2     8%         │   │
│ │ Website      27     2     7%         │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ BY LEAD SCORE:                              │
│ Hot (80+):     20 leads → 9 deals (45%)     │
│ Warm (50-79):  56 leads → 11 deals (20%)    │
│ Cold (<50):    80 leads → 3 deals (4%)      │
│                                             │
│ INSIGHT: Focus on hot leads (9x better!)    │
│                                             │
│ TIME TO CONVERSION:                         │
│ Average: 28 days                            │
│ Fastest: 7 days (hot referral)              │
│ Slowest: 68 days (cold website lead)        │
│                                             │
│ BY AGENT:                                   │
│ Ali Khan:    42 leads → 8 deals (19%) 🏆    │
│ Sara Ahmed:  38 leads → 6 deals (16%)       │
│ Hassan Ali:  32 leads → 5 deals (16%)       │
│ Others:      44 leads → 4 deals (9%)        │
│                                             │
│ ROI BY SOURCE:                              │
│ ┌──────────────────────────────────────┐   │
│ │ Source      Cost    Revenue   ROI    │   │
│ │ Referrals   PKR 0   PKR 12M   ∞ 🎉   │   │
│ │ Facebook    150K    PKR 10M   67x    │   │
│ │ Google      200K    PKR 4M    20x    │   │
│ │ Website     100K    PKR 3M    30x    │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ RECOMMENDATIONS:                            │
│ ✅ Build referral program (best ROI)        │
│ ✅ Increase Facebook budget (high ROI)      │
│ ⚠️ Optimize Google campaigns (improve)      │
│ 💡 Focus on lead scoring (qualify faster)   │
└─────────────────────────────────────────────┘
```

---

### 2. Lead Source Performance Report

**Purpose**: Identify which marketing channels work best.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ LEAD SOURCE PERFORMANCE                     │
│ January 2026                                │
│                                             │
│ ALL SOURCES RANKED:                         │
│                                             │
│ 1. REFERRALS 🏆                             │
│    Leads: 32                                │
│    Converted: 8 (25%)                       │
│    Revenue: PKR 12,000,000                  │
│    Cost: PKR 0                              │
│    ROI: Infinite!                           │
│    Quality Score: 9.5/10                    │
│                                             │
│ 2. FACEBOOK ADS                             │
│    Leads: 45                                │
│    Converted: 8 (18%)                       │
│    Revenue: PKR 10,000,000                  │
│    Cost: PKR 150,000                        │
│    ROI: 67x                                 │
│    Quality Score: 8.2/10                    │
│                                             │
│ 3. WEBSITE                                  │
│    Leads: 27                                │
│    Converted: 2 (7%)                        │
│    Revenue: PKR 3,000,000                   │
│    Cost: PKR 100,000                        │
│    ROI: 30x                                 │
│    Quality Score: 6.5/10                    │
│                                             │
│ 4. GOOGLE ADS                               │
│    Leads: 28                                │
│    Converted: 3 (11%)                       │
│    Revenue: PKR 4,000,000                   │
│    Cost: PKR 200,000                        │
│    ROI: 20x                                 │
│    Quality Score: 7.0/10                    │
│                                             │
│ 5. WALK-INS                                 │
│    Leads: 24                                │
│    Converted: 2 (8%)                        │
│    Revenue: PKR 3,000,000                   │
│    Cost: PKR 0 (office rent allocated)      │
│    Quality Score: 6.0/10                    │
│                                             │
│ MONTHLY TREND (Last 6 Months):              │
│      Jan  Dec  Nov  Oct  Sep  Aug           │
│ REF   32   28   25   22   20   18  ↗        │
│ FB    45   40   38   35   30   28  ↗        │
│ WEB   27   25   22   20   18   15  ↗        │
│ GOO   28   26   24   22   20   18  →        │
│ WALK  24   22   20   18   16   14  →        │
│                                             │
│ STRATEGY RECOMMENDATIONS:                   │
│ 1. Invest in referral program              │
│    Current: Organic                         │
│    Potential: +50% with incentives          │
│                                             │
│ 2. Scale Facebook ads                       │
│    Current: PKR 150K/month                  │
│    Recommended: PKR 250K/month              │
│    Expected: +40% leads, same ROI           │
│                                             │
│ 3. Optimize Google campaigns                │
│    Issue: Lower conversion (11%)            │
│    Action: Better targeting, landing pages  │
└─────────────────────────────────────────────┘
```

---

### 3. Pipeline Health Report

**Purpose**: Assess overall sales pipeline quality.

**Includes**:
- Pipeline coverage (months)
- Stage balance
- Velocity (movement speed)
- At-risk deals
- Health score

---

### 4. Lead Response Time Report

**Purpose**: Track how quickly you contact leads.

**Includes**:
- Average response time
- Response time by source
- Impact on conversion
- Agent performance

---

### 5-10. Additional Lead Reports

- **Lead Aging Report** - How old are your leads
- **Follow-Up Activity Report** - Tracking touchpoints
- **Lead Score Distribution** - Hot/Warm/Cold breakdown
- **Abandoned Leads Report** - Leads that went cold
- **Lead Reactivation Report** - Re-engaged old leads
- **Lead Quality by Campaign** - Marketing campaign effectiveness

---

## Financial Reports

### 1. Profit & Loss Statement

**Purpose**: Complete income statement for the business.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ PROFIT & LOSS STATEMENT                     │
│ January 1 - January 31, 2026                │
│                                             │
│ REVENUE:                                    │
│ Commission Income          PKR 4,250,000    │
│ Rental Income              PKR 700,000      │
│ Management Fees            PKR 250,000      │
│ Other Income               PKR 50,000       │
│ ─────────────────────────────────────       │
│ Total Revenue              PKR 5,250,000    │
│                                             │
│ COST OF REVENUE:                            │
│ Agent Commissions          PKR 2,100,000    │
│ Co-Agent Splits            PKR 300,000      │
│ ─────────────────────────────────────       │
│ Total COGS                 PKR 2,400,000    │
│                                             │
│ GROSS PROFIT               PKR 2,850,000    │
│ Gross Margin               54.3%            │
│                                             │
│ OPERATING EXPENSES:                         │
│ Marketing & Advertising    PKR 330,000      │
│ Office Rent                PKR 400,000      │
│ Utilities                  PKR 80,000       │
│ Technology & Software      PKR 120,000      │
│ Professional Fees          PKR 150,000      │
│ Insurance                  PKR 50,000       │
│ Office Supplies            PKR 40,000       │
│ Travel & Entertainment     PKR 80,000       │
│ Training & Development     PKR 30,000       │
│ Miscellaneous              PKR 20,000       │
│ ─────────────────────────────────────       │
│ Total Operating Expenses   PKR 1,300,000    │
│                                             │
│ OPERATING INCOME           PKR 1,550,000    │
│ Operating Margin           29.5%            │
│                                             │
│ OTHER INCOME/EXPENSES:                      │
│ Interest Income            PKR 20,000       │
│ Interest Expense           (PKR 50,000)     │
│ ─────────────────────────────────────       │
│ Net Other                  (PKR 30,000)     │
│                                             │
│ NET INCOME                 PKR 1,520,000    │
│ Net Margin                 28.9%            │
│                                             │
│ COMPARISON TO PRIOR MONTH:                  │
│ December 2025:             PKR 1,380,000    │
│ Change:                    +PKR 140,000     │
│ Growth:                    +10.1% ✅        │
│                                             │
│ COMPARISON TO BUDGET:                       │
│ Budgeted Net Income:       PKR 1,500,000    │
│ Actual:                    PKR 1,520,000    │
│ Variance:                  +PKR 20,000      │
│ Performance:               101.3% ✅        │
└─────────────────────────────────────────────┘
```

---

### 2. Cash Flow Statement

**Purpose**: Track all cash movements.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ CASH FLOW STATEMENT                         │
│ January 2026                                │
│                                             │
│ BEGINNING CASH BALANCE:                     │
│ PKR 8,500,000                               │
│                                             │
│ OPERATING ACTIVITIES:                       │
│ Commission Received        +PKR 4,200,000   │
│ Rental Income Received     +PKR 700,000     │
│ Management Fees            +PKR 250,000     │
│ Agent Payments             -PKR 2,100,000   │
│ Operating Expenses         -PKR 1,300,000   │
│ Tax Payments               -PKR 550,000     │
│ ─────────────────────────────────────       │
│ Net Operating Cash Flow    +PKR 1,200,000   │
│                                             │
│ INVESTING ACTIVITIES:                       │
│ Property Acquisitions      -PKR 0           │
│ Property Sales             +PKR 0           │
│ Capital Improvements       -PKR 500,000     │
│ ─────────────────────────────────────       │
│ Net Investing Cash Flow    -PKR 500,000     │
│                                             │
│ FINANCING ACTIVITIES:                       │
│ Investor Capital           +PKR 0           │
│ Investor Distributions     -PKR 0           │
│ Loan Proceeds              +PKR 0           │
│ Loan Repayments            -PKR 200,000     │
│ ─────────────────────────────────────       │
│ Net Financing Cash Flow    -PKR 200,000     │
│                                             │
│ NET CHANGE IN CASH         +PKR 500,000     │
│                                             │
│ ENDING CASH BALANCE:                        │
│ PKR 9,000,000                               │
│                                             │
│ CASH ANALYSIS:                              │
│ Monthly Burn Rate:         PKR 1,470,000    │
│ Cash Runway:               6.1 months ✅    │
│ Cash Reserve Target:       PKR 10,000,000   │
│ Gap to Target:             PKR 1,000,000    │
│                                             │
│ FORECAST (Next 3 Months):                   │
│ Feb: +PKR 800,000 (PKR 9.8M balance)       │
│ Mar: +PKR 1,200,000 (PKR 11M balance) ✅   │
│ Apr: -PKR 500,000 (PKR 10.5M balance)      │
└─────────────────────────────────────────────┘
```

---

### 3. Budget vs Actual Report

**Purpose**: Compare actual performance to budget.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ BUDGET vs ACTUAL REPORT                     │
│ January 2026                                │
│                                             │
│ ┌──────────────────────────────────────┐   │
│ │ Category      Budget   Actual  Var   │   │
│ │──────────────────────────────────────│   │
│ │ REVENUE                               │   │
│ │ Commission    4.5M     4.25M   -6% ⚠️│   │
│ │ Rental        700K     700K     0% ✅ │   │
│ │ Mgmt Fees     250K     250K     0% ✅ │   │
│ │ Total         5.45M    5.2M    -5%   │   │
│ │                                       │   │
│ │ EXPENSES                              │   │
│ │ Agents        2.2M     2.1M    +5% ✅ │   │
│ │ Marketing     350K     330K    +6% ✅ │   │
│ │ Operations    650K     680K    -5% ⚠️│   │
│ │ Tech          120K     120K     0% ✅ │   │
│ │ Professional  150K     150K     0% ✅ │   │
│ │ Other         130K     120K    +8% ✅ │   │
│ │ Total         3.6M     3.5M    +3% ✅ │   │
│ │                                       │   │
│ │ NET INCOME                            │   │
│ │ Target        1.5M     1.52M   +1% ✅ │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ KEY VARIANCES:                              │
│                                             │
│ ⚠️ Commission Revenue (6% Under)            │
│ Reason: 2 deals pushed to February         │
│ Impact: -PKR 250K                           │
│ Action: Close pending deals ASAP            │
│                                             │
│ ⚠️ Operations (5% Over)                     │
│ Reason: Unexpected repairs (PKR 30K)        │
│ Impact: +PKR 30K                            │
│ Action: Review maintenance contracts        │
│                                             │
│ ✅ Marketing (6% Under)                     │
│ Reason: Better Facebook ad rates            │
│ Impact: Saved PKR 20K                       │
│ Action: Maintain current strategy           │
│                                             │
│ OVERALL PERFORMANCE:                        │
│ Budget Achievement: 101% ✅                 │
│ Status: On Track                            │
│ Recommendation: Continue current plan       │
└─────────────────────────────────────────────┘
```

---

### 4-8. Additional Financial Reports

- **Revenue by Source Report** - Income breakdown
- **Expense by Category Report** - Spending analysis
- **Agent Compensation Report** - Payout details
- **Tax Summary Report** - All tax obligations
- **Balance Sheet** - Assets, liabilities, equity

---

## Performance Reports

### 1. Agent Performance Report

**Purpose**: Comprehensive agent performance analysis.

**What it shows**:
```
┌─────────────────────────────────────────────┐
│ AGENT PERFORMANCE REPORT                    │
│ Q1 2026                                     │
│                                             │
│ TOP PERFORMERS:                             │
│                                             │
│ 1. ALI KHAN 🏆                              │
│    ┌──────────────────────────────┐        │
│    │ Commission: PKR 4,500,000    │        │
│    │ Deals Closed: 12             │        │
│    │ Avg Deal: PKR 375,000        │        │
│    │ Goal Achievement: 150% 🎉    │        │
│    │                              │        │
│    │ Breakdown:                   │        │
│    │ • Sell Cycles: 8 (PKR 3.2M)  │        │
│    │ • Purchase: 3 (PKR 1.1M)     │        │
│    │ • Rentals: 1 (PKR 200K)      │        │
│    │                              │        │
│    │ Conversion Metrics:          │        │
│    │ • Lead Conversion: 19%       │        │
│    │ • Deal Close Rate: 75%       │        │
│    │ • Avg Days to Close: 38      │        │
│    │                              │        │
│    │ Activity:                    │        │
│    │ • Calls: 245                 │        │
│    │ • Viewings: 68               │        │
│    │ • Offers Made: 28            │        │
│    └──────────────────────────────┘        │
│                                             │
│ 2. SARA AHMED ⭐                            │
│    Commission: PKR 3,800,000                │
│    Deals Closed: 9                          │
│    Goal Achievement: 127%                   │
│    [Similar details...]                     │
│                                             │
│ 3. HASSAN ALI ✅                            │
│    Commission: PKR 2,900,000                │
│    Deals Closed: 7                          │
│    Goal Achievement: 97%                    │
│    [Similar details...]                     │
│                                             │
│ TEAM AVERAGES:                              │
│ Avg Commission/Agent: PKR 2,750,000         │
│ Avg Deals/Agent: 7.8                        │
│ Team Conversion Rate: 14.2%                 │
│ Team Close Rate: 68%                        │
│                                             │
│ IMPROVEMENT OPPORTUNITIES:                  │
│ • 3 agents below 80% goal                   │
│ • Average response time: 6 hours            │
│   (Target: < 4 hours)                       │
│ • Follow-up consistency: 72%                │
│   (Target: 90%+)                            │
│                                             │
│ COACHING PRIORITIES:                        │
│ 1. Improve lead response time               │
│ 2. Follow-up discipline training            │
│ 3. Negotiation skills workshop              │
└─────────────────────────────────────────────┘
```

---

### 2. Team Performance Report

**Purpose**: Overall team metrics and trends.

**Includes**:
- Team totals and averages
- Team vs individual goals
- Team growth trends
- Collaboration metrics

---

### 3. Goal Achievement Report

**Purpose**: Track progress toward targets.

**Includes**:
- Individual goals vs actual
- Team goals vs actual
- Monthly/quarterly/annual targets
- Forecast to goal

---

### 4-10. Additional Performance Reports

- **Activity Report** - Calls, meetings, emails tracked
- **Response Time Report** - Speed of lead contact
- **Conversion Rate Report** - Lead → Deal → Close rates
- **Average Deal Size Report** - Transaction values by agent
- **Win/Loss Analysis** - Why deals succeed or fail
- **Customer Satisfaction Report** - Client feedback
- **Productivity Report** - Tasks completed, efficiency

---

## Custom Report Builder

### How to Build Custom Reports

**Step-by-Step**:

```
┌─────────────────────────────────────────────┐
│ CUSTOM REPORT BUILDER                       │
│                                             │
│ STEP 1: SELECT DATA SOURCE                  │
│ ┌──────────────────────────────┐            │
│ │ ● Properties                 │            │
│ │ ○ Transactions               │            │
│ │ ○ Leads                      │            │
│ │ ○ Contacts                   │            │
│ │ ○ Deals                      │            │
│ │ ○ Commission                 │            │
│ │ ○ Financials                 │            │
│ └──────────────────────────────┘            │
│                                             │
│ STEP 2: CHOOSE FIELDS                       │
│ Available Fields:                           │
│ ☑ Property Title                            │
│ ☑ Property Type                             │
│ ☑ Location                                  │
│ ☑ Price                                     │
│ ☑ Area (sq yd)                              │
│ ☑ Status                                    │
│ ☑ Days on Market                            │
│ ☑ Agent                                     │
│ ☑ Date Listed                               │
│ ☐ Bedrooms                                  │
│ ☐ Bathrooms                                 │
│ [+20 more fields...]                        │
│                                             │
│ STEP 3: ADD FILTERS                         │
│ ┌──────────────────────────────┐            │
│ │ Status = [Available ▼]       │            │
│ │ AND                          │            │
│ │ Type = [Villa ▼]             │            │
│ │ AND                          │            │
│ │ Location = [DHA Phase 8 ▼]   │            │
│ │ AND                          │            │
│ │ Days on Market > [30]        │            │
│ │                              │            │
│ │ [+ Add Filter]               │            │
│ └──────────────────────────────┘            │
│                                             │
│ STEP 4: GROUP BY (Optional)                 │
│ [Location ▼]                                │
│ Then By: [Type ▼]                           │
│                                             │
│ STEP 5: SORT BY                             │
│ [Days on Market ▼] [Descending ▼]           │
│                                             │
│ STEP 6: SUMMARIZE (Optional)                │
│ ☑ Count of Properties                       │
│ ☑ Average Price                             │
│ ☑ Total Value                               │
│ ☐ Min/Max Price                             │
│                                             │
│ STEP 7: PREVIEW                             │
│ ┌──────────────────────────────┐            │
│ │ Location    Type   Count Avg │            │
│ │ DHA Phase 8 Villa    5   75M │            │
│ │             Apt      2   45M │            │
│ │ Clifton     Villa    3   80M │            │
│ │             Apt      4   42M │            │
│ └──────────────────────────────┘            │
│                                             │
│ STEP 8: SAVE & SCHEDULE                     │
│ Report Name: [DHA Villas Over 30 Days]      │
│                                             │
│ ☑ Save as Template                          │
│ ☑ Schedule this report                      │
│   Frequency: [Weekly ▼]                     │
│   Day: [Monday ▼]                           │
│   Time: [9:00 AM ▼]                         │
│   Send To: [ali@agency.com]                 │
│                                             │
│ [Generate Report] [Save Template]           │
└─────────────────────────────────────────────┘
```

### Sample Custom Reports You Can Build

**1. Stale Listings Report**
```
Source: Properties
Filter: Status = Available, Days on Market > 45
Sort: Days on Market (descending)
Purpose: Identify properties needing attention
```

**2. Hot Leads This Week**
```
Source: Leads
Filter: Score > 80, Created this week
Sort: Score (descending)
Purpose: Prioritize follow-ups
```

**3. Commission by Property Type**
```
Source: Commission
Group By: Property Type
Summarize: Sum(Commission), Count(Deals)
Purpose: Identify most profitable property types
```

**4. Agent Activity Report**
```
Source: Activities
Filter: Agent = [Selected Agent], Date = This Month
Group By: Activity Type
Purpose: Monitor agent productivity
```

**5. Price Reduction Impact**
```
Source: Properties
Filter: Price Changes > 0
Fields: Original Price, Current Price, Days to Sell
Purpose: Analyze pricing strategy effectiveness
```

---

## Report Scheduling

### How to Schedule Reports

**Setup**:
```
┌─────────────────────────────────────────────┐
│ SCHEDULE REPORT                             │
│                                             │
│ Report: Commission Summary                  │
│                                             │
│ FREQUENCY:                                  │
│ ● Daily                                     │
│ ○ Weekly                                    │
│ ○ Monthly                                   │
│ ○ Quarterly                                 │
│ ○ Custom                                    │
│                                             │
│ DAILY OPTIONS:                              │
│ Every: [Weekday ▼] (Mon-Fri)               │
│ Time: [9:00 AM ▼]                           │
│ Timezone: [PKT (UTC+5) ▼]                   │
│                                             │
│ SEND TO:                                    │
│ ☑ ali@agency.com                            │
│ ☑ manager@agency.com                        │
│ ☐ team@agency.com                           │
│ [+ Add Email]                               │
│                                             │
│ FORMAT:                                     │
│ ☑ PDF (For reading)                         │
│ ☑ Excel (For analysis)                      │
│ ☐ CSV (For import)                          │
│                                             │
│ EMAIL SUBJECT:                              │
│ [Daily Commission Report - {date}]          │
│                                             │
│ MESSAGE:                                    │
│ ┌──────────────────────────────┐            │
│ │ Your daily commission report │            │
│ │ is attached.                 │            │
│ └──────────────────────────────┘            │
│                                             │
│ START DATE: [Tomorrow]                      │
│ END DATE: [Never ▼]                         │
│                                             │
│ [Schedule Report] [Test Email Now]          │
└─────────────────────────────────────────────┘
```

### Common Schedules

**Daily Reports**:
- Morning activity summary (8 AM)
- End-of-day sales update (6 PM)
- Hot leads report (9 AM)

**Weekly Reports**:
- Monday: Week ahead forecast
- Friday: Week in review
- Sunday: Performance summary

**Monthly Reports**:
- 1st: Previous month summary
- 5th: Commission report
- 15th: Mid-month check-in

**Quarterly Reports**:
- Financial statements
- Strategic review
- Goal assessment

---

## Export & Sharing

### Export Formats

**PDF** - Best for:
```
✅ Presentations
✅ Client reports
✅ Archiving
✅ Printing
✅ Formal documentation

File size: Small
Editability: None
Compatibility: Universal
```

**Excel** - Best for:
```
✅ Further analysis
✅ Pivoting data
✅ Creating charts
✅ Combining reports
✅ Calculations

File size: Medium
Editability: Full
Compatibility: Microsoft Office
```

**CSV** - Best for:
```
✅ Importing to other systems
✅ Database imports
✅ Bulk processing
✅ Data integration

File size: Smallest
Editability: Text editor
Compatibility: Universal
```

---

### Sharing Options

**1. Email**
```
Send report directly from system
- Attach in selected format
- Include custom message
- Track delivery
```

**2. Download**
```
Save to your computer
- All formats available
- Instant download
- No size limits
```

**3. Public Link**
```
Generate shareable link
- Set expiry date
- Password protect (optional)
- Track views
```

**4. Embed**
```
Embed in website/portal
- Live data
- Auto-refresh
- Branded display
```

---

## Tips & Best Practices

### Report Organization

✅ **DO**:
- **Name reports clearly**: "Monthly Commission Report" not "Report 1"
- **Use folders**: Group by category (Sales, Finance, etc.)
- **Schedule regularly**: Automate recurring reports
- **Set reminders**: Review key reports weekly
- **Archive old reports**: Keep system organized
- **Document custom reports**: Note what they're for

❌ **DON'T**:
- Create duplicate reports (consolidate)
- Over-complicate custom reports
- Ignore scheduled reports (review them!)
- Generate reports you never use
- Forget to update filters (dates, etc.)

---

### Data Interpretation

**Reading Trends**:
```
GOOD TREND ✅:
Month 1: 5 deals
Month 2: 7 deals
Month 3: 9 deals
→ Growing steadily

BAD TREND ⚠️:
Month 1: 12 deals
Month 2: 8 deals
Month 3: 5 deals
→ Declining - investigate!

VOLATILE ❓:
Month 1: 10 deals
Month 2: 4 deals
Month 3: 15 deals
→ Inconsistent - identify causes
```

**Benchmarking**:
```
Your Performance: 14% conversion
Industry Average: 12% conversion
Result: Above average ✅

Your Performance: 45 days to close
Industry Average: 38 days
Result: Below average ⚠️ - improve process
```

---

### Report Frequency Recommendations

**Daily**:
- Today's tasks
- Hot leads
- Urgent actions

**Weekly**:
- Pipeline summary
- Activity report
- Team performance

**Monthly**:
- Financial statements
- Commission report
- Goal achievement
- Market analysis

**Quarterly**:
- Strategic review
- Budget vs actual
- Investor reports

**Annually**:
- Year in review
- Tax reports
- Strategic planning data

---

## Troubleshooting

### Common Issues

#### Issue: Report Shows No Data

**Problem**: Report runs but shows empty.

**Solutions**:
1. **Check filters**: Remove filters and try again
2. **Check date range**: Expand date range
3. **Check permissions**: Ensure you have data access
4. **Check data**: Verify there is data for that period

---

#### Issue: Report Takes Too Long

**Problem**: Report generation is slow.

**Solutions**:
1. **Reduce date range**: Use shorter periods
2. **Limit fields**: Select fewer columns
3. **Add filters**: Narrow down results
4. **Run off-peak**: Generate during low usage times

---

#### Issue: Scheduled Report Not Received

**Problem**: Email didn't arrive.

**Solutions**:
1. **Check email address**: Verify it's correct
2. **Check spam folder**: Look in junk mail
3. **Check schedule**: Confirm it's active
4. **Test send**: Use "Test Email Now" button

---

#### Issue: Data Doesn't Match

**Problem**: Report numbers don't match dashboard.

**Solutions**:
1. **Check timing**: Reports may be cached
2. **Check filters**: Ensure same filters applied
3. **Refresh**: Re-generate report
4. **Compare periods**: Ensure same date ranges

---

## FAQs

### General Questions

**Q: How many reports can I create?**  
A: Unlimited! Both pre-built and custom reports.

**Q: Can I edit pre-built reports?**  
A: No, but you can clone them and create custom versions.

**Q: How long are reports stored?**  
A: Generated reports stored for 90 days. Scheduled reports stored for 30 days.

**Q: Can I automate report distribution to clients?**  
A: Yes! Schedule reports and add client emails to recipient list.

---

### Custom Reports

**Q: Do I need to know SQL or coding?**  
A: No! The visual builder is drag-and-drop, no coding required.

**Q: Can I combine data from multiple modules?**  
A: Yes, through advanced queries. Contact support for help.

**Q: Can I save custom reports as templates?**  
A: Yes! Save any custom report and reuse it anytime.

**Q: What's the maximum number of fields in a custom report?**  
A: 50 fields per report (for performance).

---

### Scheduling

**Q: Can I schedule the same report to multiple people?**  
A: Yes! Add multiple email addresses to any scheduled report.

**Q: Can I pause a scheduled report?**  
A: Yes. Go to scheduled reports and toggle "Pause/Resume".

**Q: What if I need a report at a specific time?**  
A: Use custom schedule and set exact time.

**Q: Can I get reports on weekends?**  
A: Yes! Choose "Every Day" or "Custom" schedule.

---

### Exports

**Q: Is there a limit on export size?**  
A: Yes. Maximum 10,000 rows per export. Use filters to reduce if needed.

**Q: Can I export charts/graphs?**  
A: Charts export in PDF format. Excel exports raw data.

**Q: Can I password-protect exports?**  
A: PDF exports can be password-protected. Excel/CSV cannot.

---

## Quick Reference

### Report Categories Quick Guide

| Category | Count | Use Case |
|----------|-------|----------|
| **Property** | 12 | Inventory management |
| **Sales** | 15 | Transaction tracking |
| **Leads** | 10 | Pipeline optimization |
| **Financial** | 8 | Financial analysis |
| **Performance** | 10 | Team management |
| **Custom** | ∞ | Specific needs |

---

### Export Format Comparison

| Feature | PDF | Excel | CSV |
|---------|-----|-------|-----|
| **Formatting** | ✅ Rich | ✅ Tables | ❌ Plain text |
| **Charts** | ✅ Yes | ✅ Yes | ❌ No |
| **Editable** | ❌ No | ✅ Yes | ✅ Yes |
| **File Size** | Small | Medium | Smallest |
| **Best For** | Sharing | Analysis | Import |

---

### Scheduling Quick Reference

| Frequency | Best For | Common Time |
|-----------|----------|-------------|
| **Daily** | Operations | 9:00 AM |
| **Weekly** | Reviews | Monday 9 AM |
| **Monthly** | Financials | 1st @ 9 AM |
| **Quarterly** | Strategic | 1st @ 9 AM |
| **Custom** | Specific needs | Any time |

---

## Next Steps

### Getting Started with Reports

1. **Start with pre-built** - Explore 50+ ready reports
2. **Run key reports** - Commission, Pipeline, Performance
3. **Schedule important ones** - Automate weekly/monthly reports
4. **Learn custom builder** - Create your first custom report
5. **Set up dashboard** - Add key reports to dashboard
6. **Share with team** - Email reports to stakeholders
7. **Iterate & improve** - Refine based on usage

### Learn More

- **Dashboard Module**: How to view key metrics
- **Financials Module**: Understanding financial reports
- **Performance Module**: Agent performance tracking
- **Custom Queries**: Advanced reporting techniques

---

**Need Help?**

- **In-app**: Click "?" for report help
- **Support**: Contact your administrator
- **Training**: Request reports training session
- **Documentation**: Review this guide

---

**End of Reports Module User Guide**

**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Module**: Reports & Analytics  
**aaraazi Real Estate Platform**

📊 **Happy Reporting & Analyzing!**
