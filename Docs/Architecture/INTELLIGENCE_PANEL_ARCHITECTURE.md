# Intelligence Panel - Technical Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Dashboard V4                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Intelligence Panel Section                       │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Header: "Intelligence Panel"                        │  │ │
│  │  │  Badge: "✨ 3 insights"                              │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Insight Card #1 (High Priority)                     │  │ │
│  │  │  [Icon] Title | [X]                                  │  │ │
│  │  │  Message                                             │  │ │
│  │  │  Data: value | value                                 │  │ │
│  │  │  [Action Button →]                                   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Insight Card #2 (Medium Priority)                   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Insight Card #3 (Low Priority)                      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: User Opens Dashboard                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│          STEP 2: IntelligencePanelSection Renders                │
│  • Calls useInsightsData(user, onNavigate)                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 3: useInsightsData Hook Executes               │
│  • Sets loading = true                                           │
│  • Shows 3 skeleton cards                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 STEP 4: Load Data from Storage                   │
│                                                                   │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │  localStorage   │     │  Data Functions │                   │
│  │                 │────▶│                 │                   │
│  │ • Properties    │     │ getProperties() │                   │
│  │ • Leads         │     │ getLeadsV4()    │                   │
│  │ • Tasks         │     │ getAllTasks()   │                   │
│  │ • Interactions  │     │ getAllInteractions() │             │
│  │ • Users         │     │ getAllAgents()  │                   │
│  └─────────────────┘     └─────────────────┘                   │
│           ↓                       ↓                              │
│     Raw JSON Data         Parsed Data Objects                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 5: Role-Based Filtering Applied                │
│                                                                   │
│  IF user.role === 'admin':                                       │
│    userId = undefined  (sees ALL data)                           │
│                                                                   │
│  IF user.role === 'agent':                                       │
│    userId = user.id  (sees own data only)                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           STEP 6: Run Pattern Detection (detectInsights)         │
│                                                                   │
│  Detector #1: detectStaledLeads()           → Insight | null     │
│  Detector #2: detectSlowResponseTime()      → Insight | null     │
│  Detector #3: detectRevenueMilestone()      → Insight | null     │
│  Detector #4: detectHotLocation()           → Insight | null     │
│  Detector #5: detectLowConversionLocation() → Insight | null     │
│  Detector #6: detectPipelineRisks()         → Insight | null     │
│  Detector #7: detectBestPerformingDay()     → Insight | null     │
│  Detector #8: detectPriceRangeOpportunity() → Insight | null     │
│                                                                   │
│  Returns: Array<Insight | null>                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 7: Filter Out Null Values                      │
│                                                                   │
│  Before: [Insight, null, Insight, null, Insight]                │
│  After:  [Insight, Insight, Insight]                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 8: Sort by Priority                            │
│                                                                   │
│  Priority Order: { high: 0, medium: 1, low: 2 }                 │
│                                                                   │
│  Before: [Medium, Low, High, Medium, High]                       │
│  After:  [High, High, Medium, Medium, Low]                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│          STEP 9: Attach Navigation Handlers                      │
│                                                                   │
│  For each insight with action:                                   │
│    Map insight.id → page name                                    │
│    Wrap action.onClick with onNavigate(page)                     │
│                                                                   │
│  Example:                                                         │
│    'staled-leads' → onNavigate('leads')                          │
│    'pipeline-risk' → onNavigate('leads')                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│       STEP 10: Load Dismissed Insights from localStorage         │
│                                                                   │
│  Key: 'aaraazi_dismissed_insights'                               │
│  Value: ["hot-location", "best-day"]                             │
│                                                                   │
│  Convert to Set<string> for fast lookup                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│          STEP 11: Filter Out Dismissed Insights                  │
│                                                                   │
│  Before: [High1, High2, Medium1, Medium2, Low1]                  │
│  Filter: insights.filter(i => !dismissedIds.has(i.id))           │
│  After:  [High1, Medium1, Low1]  (High2 & Medium2 dismissed)     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         STEP 12: Apply Miller's Law (Max 7 Insights)             │
│                                                                   │
│  visibleInsights = insights.slice(0, 7)                          │
│                                                                   │
│  If insights.length > 7:                                         │
│    Show "+X more insights available" message                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 13: Update State & Hide Loading                │
│                                                                   │
│  setInsights(visibleInsights)                                    │
│  setLoading(false)                                               │
│  setError(null)                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 14: Render Insight Cards                       │
│                                                                   │
│  For each insight in visibleInsights:                            │
│    <InsightCard                                                  │
│      insight={insight}                                           │
│      onDismiss={dismissInsight}                                  │
│    />                                                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    USER SEES INSIGHTS                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 User Interaction Flow

### **Scenario A: User Clicks Action Button**

```
┌─────────────────────────────────────────────────────────────────┐
│  USER: Clicks "View Leads" button on staled leads insight       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  action.onClick() triggered                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Switch statement matches insight.id                             │
│  case 'staled-leads': onNavigate('leads')                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  App.tsx receives onNavigate('leads')                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  setCurrentPage('leads')                                         │
│  LeadsWorkspace component renders                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  USER: Sees leads workspace, can take action                     │
└─────────────────────────────────────────────────────────────────┘
```

---

### **Scenario B: User Dismisses Insight**

```
┌─────────────────────────────────────────────────────────────────┐
│  USER: Clicks X button on dismissible insight                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  InsightCard: setIsDismissed(true)                               │
│  InsightCard: onDismiss(insight.id) called                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  useInsightsData: dismissInsight(id) executed                    │
│                                                                   │
│  1. Create new Set: newDismissed = new Set(dismissedIds)         │
│  2. Add ID: newDismissed.add(id)                                 │
│  3. Update state: setDismissedIds(newDismissed)                  │
│  4. Save to localStorage: saveDismissedInsights(newDismissed)    │
│  5. Remove from UI: setInsights(prev => prev.filter(...))        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  localStorage updated:                                           │
│  'aaraazi_dismissed_insights' = ["hot-location", "best-day", ... ]│
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  InsightCard: Returns null (due to isDismissed = true)           │
│  Card disappears from UI                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  USER: Insight no longer visible                                 │
│  Won't re-appear on page refresh (persisted)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Component Hierarchy

```
App.tsx
  └── DashboardV4
        └── IntelligencePanelSection
              ├── Header
              │     ├── Lightbulb Icon
              │     └── Insight Count Badge
              │
              ├── Loading State (if loading)
              │     └── 3 × Skeleton Cards
              │
              ├── Error State (if error)
              │     └── Error Message
              │
              ├── Empty State (if no insights)
              │     └── "All clear!" Message
              │
              └── Insight Cards (if insights)
                    ├── InsightCard (High Priority)
                    │     ├── Icon
                    │     ├── Title
                    │     ├── Priority Badge
                    │     ├── Message
                    │     ├── Data Points
                    │     ├── Action Button
                    │     └── Dismiss Button
                    │
                    ├── InsightCard (Medium Priority)
                    │
                    └── InsightCard (Low Priority)
```

---

## 🧩 Module Dependencies

```
IntelligencePanelSection.tsx
  ├── Imports:
  │     ├── React
  │     ├── User (type from types.ts)
  │     ├── InsightCard (from components/)
  │     ├── useInsightsData (from hooks/)
  │     └── Lucide Icons (Lightbulb, Sparkles, CheckCircle2)
  │
  └── Exports:
        └── IntelligencePanelSection (component)

useInsightsData.ts
  ├── Imports:
  │     ├── React hooks (useState, useEffect, useCallback)
  │     ├── Types (User, Property, LeadV4, CRMTask, CRMInteraction)
  │     ├── Insight (type from InsightCard)
  │     ├── detectInsights (from utils/)
  │     ├── getProperties (from lib/data.ts)
  │     ├── getLeadsV4 (from lib/leadsV4.ts)
  │     ├── getAllTasks (from lib/data.ts)
  │     ├── getAllInteractions (from lib/data.ts)
  │     └── getAllAgents (from lib/auth.ts)
  │
  └── Exports:
        └── useInsightsData (hook)

detectInsights.ts
  ├── Imports:
  │     ├── Types (Property, User, LeadV4, CRMTask, CRMInteraction)
  │     ├── Insight (type from InsightCard)
  │     └── formatPKR (from lib/currency.ts)
  │
  └── Exports:
        └── detectInsights (function)

InsightCard.tsx
  ├── Imports:
  │     ├── React
  │     └── Lucide Icons (X, ArrowRight, AlertCircle, etc.)
  │
  └── Exports:
        ├── Insight (type)
        ├── InsightType (type)
        ├── InsightPriority (type)
        └── InsightCard (component)
```

---

## 💾 Data Storage Schema

### **localStorage Keys Used:**

```
'aaraazi_dismissed_insights'
  Type: string (JSON array)
  Value: ["insight-id-1", "insight-id-2", ...]
  Purpose: Persist dismissed insights across sessions
  
'aaraazi_properties'
  Type: string (JSON array)
  Value: [Property, Property, ...]
  Purpose: Property data for analysis
  
'aaraazi_leads_v4'
  Type: string (JSON array)
  Value: [LeadV4, LeadV4, ...]
  Purpose: Lead data for analysis
  
'aaraazi_crm_tasks'
  Type: string (JSON array)
  Value: [CRMTask, CRMTask, ...]
  Purpose: Task data for analysis
  
'aaraazi_crm_interactions'
  Type: string (JSON array)
  Value: [CRMInteraction, CRMInteraction, ...]
  Purpose: Interaction data for analysis
  
'aaraazi_users'
  Type: string (JSON array)
  Value: [User, User, ...]
  Purpose: User/agent data for analysis
```

---

## 🔍 Pattern Detection Logic

### **Example: Staled Leads Detector**

```typescript
Input:
  leads: LeadV4[]
  interactions: CRMInteraction[]

Algorithm:
  1. Get current date and 3-days-ago threshold
  2. Filter leads:
     • Exclude closed/lost/disqualified
     • Find last interaction for each lead
     • Check if last interaction > 3 days ago
  3. Count staled leads
  4. If count > 0:
     • Determine priority (high if ≥5, medium if <5)
     • Calculate oldest lead age
     • Create insight object with:
       - id: 'staled-leads'
       - type: 'opportunity'
       - priority: high/medium
       - title: "X leads need follow-up"
       - message: Explanation
       - data: [count, oldest age]
       - action: { label, onClick }
       - dismissible: false
  5. Return insight or null

Output:
  Insight | null
```

---

## 🎨 Styling Architecture

### **Color Palette (Brand Colors):**

```
Terracotta: #C17052 (Opportunities)
  ├── Background: bg-[#C17052]/5
  ├── Border: border-[#C17052]/30
  ├── Icon BG: bg-[#C17052]/10
  └── Icon Color: text-[#C17052]

Forest Green: #2D6A54 (Achievements)
  ├── Background: bg-[#2D6A54]/5
  ├── Border: border-[#2D6A54]/30
  ├── Icon BG: bg-[#2D6A54]/10
  └── Icon Color: text-[#2D6A54]

Charcoal: #1A1D1F (Primary Text)
  └── Headings, titles

Slate: #363F47 (Secondary Text)
  └── Body text, descriptions

Gray: #6B7280 (Tertiary Text)
  └── Supporting text, metadata
```

### **Spacing Grid (8px base):**

```
gap-2   = 8px   (tight spacing)
gap-3   = 12px  (default spacing)
gap-4   = 16px  (comfortable spacing)
p-4     = 16px  (card padding)
mb-2    = 8px   (tight margin)
mb-3    = 12px  (default margin)
```

---

## 🔐 Security & Access Control

### **Role-Based Data Access:**

```
┌──────────────────────────────────────────────────────────────┐
│                        User Roles                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ADMIN ROLE:                                                  │
│    userId = undefined                                         │
│    → getProperties() returns ALL properties                   │
│    → getLeadsV4() returns ALL leads                          │
│    → getAllTasks() returns ALL tasks                         │
│    → getAllInteractions() returns ALL interactions           │
│    → Sees insights for entire organization                   │
│                                                               │
│  AGENT ROLE:                                                  │
│    userId = user.id                                           │
│    → getProperties() returns own + shared properties         │
│    → getLeadsV4() returns own + shared leads                 │
│    → getAllTasks() returns own + shared tasks                │
│    → getAllInteractions() returns own + shared interactions  │
│    → Sees insights only for own data                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Performance Characteristics

### **Time Complexity:**

```
Data Loading:     O(n) - Linear scan of localStorage
Pattern Detection: O(n) - Linear scan of each data array
Sorting:          O(n log n) - Standard sort algorithm
Filtering:        O(n) - Linear filter operations
Rendering:        O(n) - Max 7 cards rendered

Overall:          O(n log n) - Dominated by sorting step
                  where n = number of detected insights
```

### **Space Complexity:**

```
Data Storage:     O(properties + leads + tasks + interactions)
Insight Storage:  O(insights) - Max 7 in memory
Dismissed IDs:    O(dismissed) - Set in memory + localStorage

Overall:          O(n) - Linear with data size
```

### **Optimization Techniques:**

```
✅ Miller's Law: Max 7 insights prevents UI overload
✅ React.memo: InsightCard memoized for performance
✅ useCallback: dismissInsight callback memoized
✅ Early Return: Pattern detectors return null early if no match
✅ Set for Lookups: dismissedIds as Set for O(1) lookup
✅ localStorage: Minimal reads/writes, cached in memory
```

---

## 🧪 Testing Points

### **Unit Tests:**

```
1. Pattern Detectors
   ✓ detectStaledLeads() with various lead states
   ✓ detectSlowResponseTime() with different timings
   ✓ detectRevenueMilestone() at each threshold
   ✓ detectHotLocation() with inquiry counts
   ✓ detectLowConversionLocation() with conversion rates
   ✓ detectPipelineRisks() with stalled deals
   ✓ detectBestPerformingDay() with activity counts
   ✓ detectPriceRangeOpportunity() with price distributions

2. useInsightsData Hook
   ✓ Data loading for admin vs agent
   ✓ Dismissed insights filtering
   ✓ dismissInsight updates state + localStorage
   ✓ Error handling

3. InsightCard Component
   ✓ Renders all insight types correctly
   ✓ Dismiss button works
   ✓ Action button triggers onClick
   ✓ Priority badges display correctly
```

### **Integration Tests:**

```
1. Dashboard → Intelligence Panel
   ✓ Component renders in correct position
   ✓ Receives user and onNavigate props
   ✓ Displays loading state initially

2. Navigation Flow
   ✓ Action button navigates to correct page
   ✓ onNavigate callback works

3. Persistence
   ✓ Dismissed insights persist across refresh
   ✓ localStorage updates correctly
```

---

## 📝 Summary

The Intelligence Panel is a **fully integrated, production-ready feature** that:

✅ **Loads data** from 5 sources (properties, leads, tasks, interactions, users)  
✅ **Detects patterns** using 8 specialized detectors  
✅ **Prioritizes insights** by urgency (high/medium/low)  
✅ **Filters by role** (admin sees all, agents see own)  
✅ **Persists dismissals** to localStorage  
✅ **Navigates intelligently** to relevant pages  
✅ **Follows UX laws** (Miller's Law, Aesthetic-Usability)  
✅ **Complies with design system** (brand colors, spacing, typography)  
✅ **Handles errors gracefully** (loading, error, empty states)  

**Current Status:** ✅ **100% Functional & Production Ready**

---

**Last Updated:** January 12, 2026  
**Version:** 1.0.0  
**Architecture Status:** Complete ✅
