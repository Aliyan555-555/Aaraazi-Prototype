# Rent Requirements & Dashboard - Flow Diagrams
**Visual Reference for Implementation**

---

## **PART A: RENT REQUIREMENTS MODULE**

### **1. Rent Requirement Lifecycle Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│              RENT REQUIREMENT ENTRY POINTS                          │
└─────────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  ┌──────────┐            ┌──────────┐            ┌──────────┐
  │  FROM    │            │  FROM    │            │ DIRECT   │
  │  LEAD    │            │ CONTACT  │            │  CREATE  │
  │CONVERSION│            │ DETAILS  │            │          │
  └────┬─────┘            └────┬─────┘            └────┬─────┘
       │                       │                       │
       └───────────────────────┴───────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │CREATE RENT REQUIREMENT│
                    │ Tenant: Selected    │
                    │ Criteria: Set       │
                    │ Agent: Assigned     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  STATUS: ACTIVE     │
                    │ Searching for       │
                    │ Rental Properties   │
                    │ Auto-Matching ON    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  MATCHES FOUND      │
                    │ Rental Properties   │
                    │ Algorithm Matched   │
                    │ Notify Tenant       │
                    └──────────┬──────────┘
                               │
                     Schedule Viewings
                               │
                               ▼
                    ┌─────────────────────┐
                    │ VIEWINGS DONE       │
                    │ Tenant Feedback     │
                    │ Property Selected   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ LEASE APPLICATION   │
                    │ Tenant Applies      │
                    │ Screening Process   │
                    └──────────┬──────────┘
                               │
                     Application Approved
                               │
                               ▼
                    ┌─────────────────────┐
                    │ RENT CYCLE CREATED  │
                    │ Lease Signed        │
                    │ Requirement Converted│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   ARCHIVED          │
                    │ Status: Converted   │
                    │ History Preserved   │
                    └─────────────────────┘
```

---

### **2. Rent Requirement Creation (Condensed)**

```
CREATE RENT REQUIREMENT WIZARD:

STEP 1: Tenant Selection
│ Select Tenant: [Fatima Shah ▼]
│ Or [+ Add New Contact] (Type: Tenant)
│
STEP 2: Property Preferences
│ Type: ☑ Apartment □ House □ Villa
│ Areas: ☑ Clifton ☑ DHA Phase 5 ☑ Defence View
│ Bedrooms: Min [2] Max [3]
│ Bathrooms: Min [2]
│
STEP 3: Rent Budget
│ Monthly Budget: Min PKR [50,000] Max PKR [80,000]
│ Flexible: ☑ Yes (can go 10% above)
│ Security Deposit: Ready: [2-3 months]
│
STEP 4: Must-Have Features
│ ESSENTIAL:
│ ☑ Furnished  ☑ Elevator  ☑ Parking  ☑ Security
│ PREFERRED:
│ □ Gym  □ Pool  □ Generator
│
STEP 5: Lease Terms
│ Duration: [12] months preferred
│ Move-in: [Within 2 weeks]
│ Priority: ● High
│
[Create Rent Requirement] → Triggers matching algorithm
                          → Creates R002
                          → Finds 6 matching properties
```

---

### **3. Rental Property Matching (Simplified)**

```
MATCHING ALGORITHM FOR RENT:

Input: Rent Requirement R002
       Tenant: Fatima Shah
       Budget: PKR 50K - 80K/month
       Type: 2-3BR Apartment
       Areas: Clifton, DHA Ph 5, Defence View

STEP 1: Filter Available Rentals
Available Properties (status = "available" OR "rented" with ending lease)
│
├─ Property Type: Apartment → 45 properties
├─ Location: Clifton/DHA/Defence → 25 properties  
├─ Budget: PKR 50-80K/month → 12 properties
├─ Bedrooms: 2-3 BR → 8 properties
└─ Must-have Features → 6 properties ✓

STEP 2: Calculate Match Scores
│
├─ P010: Clifton Apartment
│   Location: 10/10 (Top priority)
│   Budget: 9/10 (PKR 75K, mid-range)
│   Features: 10/10 (All must-haves + extras)
│   Condition: 9/10 (Excellent)
│   SCORE: 93% ⭐⭐⭐⭐⭐
│
├─ P015: DHA Phase 5 Apartment
│   SCORE: 88%
│
└─ (4 more properties...)

STEP 3: Rank & Present
Top 6 Matches:
1. P010 - 93% match
2. P015 - 88% match
3. P020 - 84% match
4. P025 - 79% match
5. P030 - 75% match
6. P035 - 71% match

Notify tenant: "We found 6 properties for you!"
Create viewing tasks for agent
```

---

### **4. Rent Requirement Conversion**

```
CONVERSION FLOW:

Rent Requirement R002 (Active)
│
├─ Tenant views 3 properties
├─ Selects P010 (Clifton Apartment)
├─ Applies for lease
├─ Screening passed ✓
│
▼
Create Rent Cycle T004
│ Property: P010
│ Tenant: Fatima Shah  
│ Monthly Rent: PKR 75,000
│ Duration: 12 months
│ Stage: Agreement
│
▼
Lease Signed → Rent Cycle: Active
│
▼
Update Rent Requirement R002
│ Status: active → converted
│ Converted to: T004
│ Conversion Date: Jan 25, 2026
│ Time to Convert: 18 days ✓
│
▼
Archive Requirement (preserve history)
Close other matches
Update tenant contact record
```

---

## **PART B: DASHBOARD MODULE**

### **5. Dashboard Data Loading Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD INITIALIZATION                         │
└─────────────────────────────────────────────────────────────────────┘

User logs in → Navigate to Dashboard
           │
           ▼
┌─────────────────────────────────────┐
│ DashboardV4 Component Mounts        │
└──────────┬──────────────────────────┘
           │
    useEffect hook executes
           │
           ▼
┌─────────────────────────────────────┐
│ useDashboardData() Hook             │
│                                     │
│ Loads data in parallel:             │
│                                     │
│ Promise.all([                       │
│   loadProperties(),                 │
│   loadDeals(),                      │
│   loadLeads(),                      │
│   loadContacts(),                   │
│   loadTasks(),                      │
│   loadRequirements(),               │
│   loadTransactions(),               │
│   loadPayments()                    │
│ ])                                  │
└──────────┬──────────────────────────┘
           │
    All data fetched from localStorage
           │
           ▼
┌─────────────────────────────────────┐
│ CALCULATE KEY METRICS               │
│                                     │
│ usePerformanceData():               │
│ ├─ MTD Revenue                      │
│ ├─ MTD Commission                   │
│ ├─ Active Deals                     │
│ ├─ Properties Listed                │
│ ├─ Conversion Rate                  │
│ └─ Deal Velocity                    │
│                                     │
│ useActionData():                    │
│ ├─ Overdue Tasks                    │
│ ├─ Pending Follow-ups               │
│ ├─ Urgent Leads                     │
│ ├─ Expiring Leases                  │
│ └─ Payment Reminders                │
│                                     │
│ useInsightsData():                  │
│ ├─ Trend Analysis                   │
│ ├─ Anomaly Detection                │
│ ├─ Opportunity Identification       │
│ └─ Risk Alerts                      │
│                                     │
│ useRecentActivity():                │
│ ├─ Last 10 interactions             │
│ ├─ Recent property updates          │
│ └─ Latest deal changes              │
└──────────┬──────────────────────────┘
           │
    All calculations complete
           │
           ▼
┌─────────────────────────────────────┐
│ RENDER DASHBOARD SECTIONS           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 1. HERO SECTION                 │ │
│ │    Welcome Message              │ │
│ │    Quick Stats Overview         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 2. PERFORMANCE PULSE            │ │
│ │    Revenue, Commission, Deals   │ │
│ │    Trend Charts                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 3. ACTION CENTER                │ │
│ │    Prioritized Tasks            │ │
│ │    Urgent Items                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 4. INTELLIGENCE PANEL           │ │
│ │    AI-Generated Insights        │ │
│ │    Opportunities & Risks        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 5. QUICK LAUNCH                 │ │
│ │    Common Workflows             │ │
│ │    Recent Items                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

LOADING TIME: ~200-300ms
REFRESH: Auto-refresh every 5 minutes
CACHE: Uses useMemo for expensive calculations
```

---

### **6. Dashboard Metrics Calculation**

```
┌─────────────────────────────────────────────────────────────────────┐
│                PERFORMANCE METRICS CALCULATION                      │
└─────────────────────────────────────────────────────────────────────┘

METRIC 1: MTD Revenue
┌─────────────────────────────────────┐
│ calculateMetrics.ts                 │
│                                     │
│ const calculateMTDRevenue = () => { │
│   const thisMonth = new Date()      │
│     .getMonth();                    │
│                                     │
│   const deals = getCompletedDeals() │
│     .filter(d =>                    │
│       new Date(d.completedDate)     │
│         .getMonth() === thisMonth   │
│     );                              │
│                                     │
│   const total = deals.reduce(      │
│     (sum, deal) => sum + deal.price,│
│     0                               │
│   );                                │
│                                     │
│   const lastMonth = get            │
│     LastMonthRevenue();             │
│                                     │
│   const trend = ((total -          │
│     lastMonth) / lastMonth) * 100;  │
│                                     │
│   return {                          │
│     value: total,                   │
│     trend: trend,                   │
│     direction: trend > 0            │
│       ? 'up' : 'down'               │
│   };                                │
│ }                                   │
└─────────────────────────────────────┘

OUTPUT:
{
  label: "MTD Revenue",
  value: "PKR 3.8 Cr",
  trend: "+15.2%",
  direction: "up",
  icon: <TrendingUp />
}

METRIC 2: Conversion Rate
┌─────────────────────────────────────┐
│ const conversionRate = () => {      │
│   const leads = getLeads()          │
│     .filter(l =>                    │
│       l.status === 'converted'      │
│     );                              │
│                                     │
│   const total = getLeads().length;  │
│                                     │
│   const rate = (leads.length /     │
│     total) * 100;                   │
│                                     │
│   return {                          │
│     value: `${rate.toFixed(1)}%`,   │
│     actual: leads.length,           │
│     total: total                    │
│   };                                │
│ }                                   │
└─────────────────────────────────────┘

OUTPUT:
{
  label: "Conversion Rate",
  value: "24.5%",
  subtitle: "89 of 363 leads",
  icon: <Target />
}

METRIC 3: Active Pipeline Value
┌─────────────────────────────────────┐
│ const pipelineValue = () => {       │
│   const activeDeals =               │
│     getTransactions()               │
│       .filter(t =>                  │
│         t.status !== 'completed' && │
│         t.status !== 'lost'         │
│       );                            │
│                                     │
│   const totalValue =                │
│     activeDeals.reduce(             │
│       (sum, deal) =>                │
│         sum + deal.expectedPrice,   │
│       0                             │
│     );                              │
│                                     │
│   const expectedCommission =        │
│     totalValue * 0.02;              │
│                                     │
│   return {                          │
│     value: totalValue,              │
│     deals: activeDeals.length,      │
│     commission: expectedCommission  │
│   };                                │
│ }                                   │
└─────────────────────────────────────┘

OUTPUT:
{
  label: "Pipeline Value",
  value: "PKR 28.5 Cr",
  subtitle: "15 active deals",
  potentialCommission: "PKR 57 Lakh"
}
```

---

### **7. Action Item Detection**

```
┌─────────────────────────────────────────────────────────────────────┐
│                  ACTION CENTER INTELLIGENCE                         │
└─────────────────────────────────────────────────────────────────────┘

detectActions() Algorithm:

PRIORITY 1: OVERDUE ITEMS
┌─────────────────────────────────────┐
│ Check all tasks:                    │
│                                     │
│ const overdueTasks =                │
│   getTasks()                        │
│     .filter(task =>                 │
│       task.dueDate < today &&       │
│       task.status !== 'completed'   │
│     );                              │
│                                     │
│ If found → Create action item:      │
│ {                                   │
│   type: 'urgent',                   │
│   priority: 'high',                 │
│   title: 'Overdue Tasks',           │
│   count: overdueTasks.length,       │
│   action: 'View Tasks',             │
│   link: '/tasks?filter=overdue'     │
│ }                                   │
└─────────────────────────────────────┘

PRIORITY 2: LEADS REQUIRING ATTENTION
┌─────────────────────────────────────┐
│ SLA Violations:                     │
│                                     │
│ const urgentLeads =                 │
│   getLeads()                        │
│     .filter(lead => {               │
│       const age = Date.now() -      │
│         lead.createdAt;             │
│                                     │
│       // New leads > 2 hours old    │
│       if (lead.status === 'new' &&  │
│           age > 2 * HOUR) {         │
│         return true;                │
│       }                             │
│                                     │
│       // Qualifying > 24 hours      │
│       if (lead.status ===           │
│             'qualifying' &&         │
│           age > 24 * HOUR) {        │
│         return true;                │
│       }                             │
│                                     │
│       return false;                 │
│     });                             │
│                                     │
│ Action:                             │
│ {                                   │
│   type: 'warning',                  │
│   priority: 'high',                 │
│   title: 'Leads Need Attention',    │
│   count: urgentLeads.length,        │
│   message: 'SLA violations',        │
│   action: 'View Leads'              │
│ }                                   │
└─────────────────────────────────────┘

PRIORITY 3: EXPIRING LEASES
┌─────────────────────────────────────┐
│ const expiringLeases =              │
│   getRentCycles()                   │
│     .filter(cycle =>                │
│       cycle.status === 'active' &&  │
│       daysUntil(cycle.leaseEnd) <= 60│
│     );                              │
│                                     │
│ // Notify 60 days before lease end  │
│                                     │
│ Action:                             │
│ {                                   │
│   type: 'info',                     │
│   priority: 'medium',               │
│   title: 'Leases Expiring Soon',    │
│   count: expiringLeases.length,     │
│   message: 'Renewal reminders',     │
│   action: 'Review Leases'           │
│ }                                   │
└─────────────────────────────────────┘

PRIORITY 4: PENDING PAYMENTS
┌─────────────────────────────────────┐
│ const pendingPayments =             │
│   getPaymentSchedule()              │
│     .filter(payment =>              │
│       payment.status === 'pending' &&│
│       payment.dueDate <= today      │
│     );                              │
│                                     │
│ Action:                             │
│ {                                   │
│   type: 'warning',                  │
│   priority: 'high',                 │
│   title: 'Payment Reminders',       │
│   count: pendingPayments.length,    │
│   totalAmount: sum(amounts),        │
│   action: 'Send Reminders'          │
│ }                                   │
└─────────────────────────────────────┘

PRIORITY 5: STALE PROPERTIES
┌─────────────────────────────────────┐
│ const staleProperties =             │
│   getProperties()                   │
│     .filter(p =>                    │
│       p.status === 'available' &&   │
│       daysOnMarket(p) > 90          │
│     );                              │
│                                     │
│ Action:                             │
│ {                                   │
│   type: 'info',                     │
│   priority: 'low',                  │
│   title: 'Long-Listed Properties',  │
│   count: staleProperties.length,    │
│   message: 'Consider price review', │
│   action: 'Review Pricing'          │
│ }                                   │
└─────────────────────────────────────┘

ACTION CENTER DISPLAY:
Sorted by Priority (High → Low)
Grouped by Type (Urgent, Warning, Info)
Each with quick action button
Real-time count updates
```

---

### **8. Dashboard Insights Generation**

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INTELLIGENCE PANEL INSIGHTS                        │
└─────────────────────────────────────────────────────────────────────┘

detectInsights() Algorithm:

INSIGHT 1: TREND ANALYSIS
┌─────────────────────────────────────┐
│ Analyze performance trends:         │
│                                     │
│ const revenueInsight = () => {      │
│   const last3Months =               │
│     getMonthlyRevenue(3);           │
│                                     │
│   // [Jan: 3.2Cr, Feb: 3.5Cr,      │
│   //  Mar: 3.8Cr]                   │
│                                     │
│   const trend = calculateTrend(     │
│     last3Months                     │
│   );                                │
│                                     │
│   if (trend.direction === 'up' &&   │
│       trend.percentage > 10) {      │
│     return {                        │
│       type: 'positive',             │
│       icon: <TrendingUp />,         │
│       title: 'Strong Growth',       │
│       message: 'Revenue up 18.7%    │
│         over last 3 months',        │
│       recommendation: 'Maintain     │
│         current sales strategy'     │
│     };                              │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘

INSIGHT 2: OPPORTUNITY DETECTION
┌─────────────────────────────────────┐
│ const hotLeadsInsight = () => {     │
│   const highValueLeads =            │
│     getLeads()                      │
│       .filter(l =>                  │
│         l.qualificationScore > 85 &&│
│         l.status === 'qualified' && │
│         l.timeline === 'urgent'     │
│       );                            │
│                                     │
│   if (highValueLeads.length > 0) {  │
│     const totalValue =              │
│       estimateValue(highValueLeads);│
│                                     │
│     return {                        │
│       type: 'opportunity',          │
│       icon: <Target />,             │
│       title: 'Hot Leads Ready',     │
│       message: `${                  │
│         highValueLeads.length       │
│       } qualified leads worth       │
│       PKR ${totalValue} potential   │
│       commission`,                  │
│       action: 'Prioritize Follow-up'│
│     };                              │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘

INSIGHT 3: RISK ALERTS
┌─────────────────────────────────────┐
│ const dealRiskInsight = () => {     │
│   const stalledDeals =              │
│     getTransactions()               │
│       .filter(t =>                  │
│         t.status === 'active' &&    │
│         daysSinceUpdate(t) > 7      │
│       );                            │
│                                     │
│   if (stalledDeals.length > 0) {    │
│     return {                        │
│       type: 'risk',                 │
│       icon: <AlertTriangle />,      │
│       title: 'Deals At Risk',       │
│       message: `${                  │
│         stalledDeals.length         │
│       } deals with no activity      │
│       for 7+ days`,                 │
│       recommendation: 'Follow up    │
│         immediately to keep         │
│         momentum'                   │
│     };                              │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘

INSIGHT 4: MARKET INTELLIGENCE
┌─────────────────────────────────────┐
│ const marketInsight = () => {       │
│   const inventory =                 │
│     getAgencyProperties();          │
│                                     │
│   const avgDaysOnMarket =           │
│     calculateAvg(                   │
│       inventory.map(p =>            │
│         daysOnMarket(p)             │
│       )                             │
│     );                              │
│                                     │
│   if (avgDaysOnMarket > 60) {       │
│     return {                        │
│       type: 'warning',              │
│       icon: <Clock />,              │
│       title: 'Slow Market',         │
│       message: 'Properties taking   │
│         ${avgDaysOnMarket} days     │
│         on average to sell',        │
│       recommendation: 'Consider     │
│         competitive pricing or      │
│         enhanced marketing'         │
│     };                              │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘

INSIGHT 5: PERFORMANCE COMPARISON
┌─────────────────────────────────────┐
│ const performanceInsight = () => {  │
│   const thisMonth = getStats();     │
│   const target = getMonthlyTarget();│
│                                     │
│   const progress =                  │
│     (thisMonth.revenue /            │
│      target.revenue) * 100;         │
│                                     │
│   if (progress > 100) {             │
│     return {                        │
│       type: 'achievement',          │
│       icon: <Trophy />,             │
│       title: 'Target Exceeded!',    │
│       message: 'Achieved ${progress}%│
│         of monthly target',         │
│       recommendation: 'Celebrate    │
│         success, set stretch goals' │
│     };                              │
│   } else if (progress < 70 &&       │
│              dayOfMonth() > 20) {   │
│     return {                        │
│       type: 'alert',                │
│       icon: <AlertCircle />,        │
│       title: 'Target Risk',         │
│       message: 'Only ${progress}%   │
│         of target achieved with     │
│         ${daysLeft()} days left',   │
│       recommendation: 'Accelerate   │
│         deal closures'              │
│     };                              │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘

INTELLIGENCE PANEL DISPLAY:
┌─────────────────────────────────────┐
│ 🎯 Hot Leads Ready                  │
│ 8 qualified leads worth PKR 45L     │
│ potential commission                │
│ → Prioritize Follow-up              │
│─────────────────────────────────────│
│ ⚠️ Deals At Risk                    │
│ 3 deals with no activity for 7+ days│
│ → Follow up immediately             │
│─────────────────────────────────────│
│ 📈 Strong Growth                    │
│ Revenue up 18.7% over 3 months      │
│ → Maintain current strategy         │
└─────────────────────────────────────┘

Insights refresh: Real-time
Max insights shown: 5
Prioritized by: Impact & Urgency
```

---

### **9. Quick Launch Workflows**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    QUICK LAUNCH SECTION                             │
└─────────────────────────────────────────────────────────────────────┘

COMMON WORKFLOWS:

1. ADD NEW LEAD
   [+ Lead] → LeadFormModal
            → Pre-fill agent
            → Quick capture
            → Auto-qualify

2. LOG INTERACTION
   [💬 Log] → InteractionFormModal
            → Select contact
            → Quick logging
            → Follow-up tasks

3. CREATE PROPERTY
   [🏠 Property] → PropertyFormV2
                 → 5-step wizard
                 → Quick add
                 → Auto-list

4. RECORD PAYMENT
   [💰 Payment] → RecordPaymentModal
                → Select deal
                → Receipt generation
                → Auto-update

5. SCHEDULE VIEWING
   [📅 Viewing] → ScheduleViewingModal
                → Calendar integration
                → Notifications
                → Reminders

RECENT ITEMS:
┌─────────────────────────────────────┐
│ Recently Viewed:                    │
│ • P001 - Modern Apartment (5m ago)  │
│ • C025 - Ahmed Khan (15m ago)       │
│ • T003 - Sell Cycle (1h ago)        │
│                                     │
│ Recently Modified:                  │
│ • L015 - New lead added             │
│ • D007 - Payment recorded           │
│ • R002 - Requirement updated        │
│                                     │
│ [View All Recent]                   │
└─────────────────────────────────────┘

QUICK SEARCH:
[🔍 Search anything...] → Smart search
                        → Properties
                        → Contacts  
                        → Deals
                        → Requirements
                        → Fuzzy matching
```

---

### **10. Dashboard Refresh & Real-time Updates**

```
┌─────────────────────────────────────────────────────────────────────┐
│                  REAL-TIME DASHBOARD UPDATES                        │
└─────────────────────────────────────────────────────────────────────┘

AUTO-REFRESH MECHANISM:

useEffect(() => {
  // Initial load
  loadDashboardData();
  
  // Set up auto-refresh interval
  const refreshInterval = setInterval(() => {
    refreshDashboardData();
  }, 5 * 60 * 1000); // Every 5 minutes
  
  // Cleanup
  return () => clearInterval(refreshInterval);
}, []);

MANUAL REFRESH:
┌─────────────────────────────────────┐
│ [🔄 Refresh] button in header       │
│                                     │
│ onClick={() => {                    │
│   setIsRefreshing(true);            │
│   await loadDashboardData();        │
│   setIsRefreshing(false);           │
│   toast.success('Dashboard updated');│
│ }}                                  │
└─────────────────────────────────────┘

EVENT-DRIVEN UPDATES:
When user performs action:
│
├─ Creates new property
│  → Refresh properties count
│  → Update inventory value
│  → Recalculate metrics
│
├─ Records payment
│  → Update revenue
│  → Update commission
│  → Refresh payment schedule
│
├─ Completes task
│  → Update action items
│  → Refresh overdue count
│  → Update completion rate
│
└─ Converts lead
   → Update conversion rate
   → Refresh pipeline value
   → Update insights

OPTIMISTIC UPDATES:
// Update UI immediately
updateMetricOptimistically(newValue);

// Then sync with data
syncWithLocalStorage()
  .catch(error => {
    // Rollback on error
    revertMetric(previousValue);
  });
```

---

**Use these diagrams during implementation to ensure correct data flow, relationships, and user experience!**

**Document Status**: Complete  
**Total Flows**: 10 comprehensive scenarios  
**Coverage**: 100% of Rent Requirements & Dashboard functionality
