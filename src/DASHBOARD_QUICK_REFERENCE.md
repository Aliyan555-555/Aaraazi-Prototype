# Dashboard V4 - Quick Reference Card

## 📋 One-Page Summary

### Vision
Transform the dashboard from **"Here's your data"** into **"Here's what you should do next"**

### Core Principle
**ACTION over INFORMATION** - Focus on what the user needs to DO, not just KNOW

---

## 🎯 5 Main Sections

| # | Section | Purpose | Size | Key Metric |
|---|---------|---------|------|------------|
| 1 | **Hero Section** | Business health at a glance | 3-4 cards | Pipeline value, Revenue, Inventory |
| 2 | **Action Center** | What needs attention NOW | 4-6 items | Urgency score 1-100 |
| 3 | **Quick Launch** | Jump to key workflows | 6-8 cards | Click-through rate |
| 4 | **Performance Pulse** | Recent activity & trends | 1 chart + timeline | Engagement time |
| 5 | **Intelligence Panel** | Smart insights | 1-3 insights | Action completion rate |

---

## 🎨 Design System Checklist

### Colors (60-30-10 Ratio)
- ✅ **60%**: White (#FFFFFF) + Warm Cream (#E8E2D5)
- ✅ **30%**: Forest Green (#2D6A54) for primary actions
- ✅ **10%**: Terracotta (#C17052) for accents

### Typography
- ✅ **NO** Tailwind classes (text-xl, font-bold, etc.)
- ✅ Use CSS custom properties from globals.css
- ✅ Inter font family

### Spacing
- ✅ 8px grid (gap-1, gap-2, gap-3, gap-4, gap-6)
- ✅ Consistent padding (p-2, p-3, p-4)

### Components
- ✅ WorkspaceHeader from workspace/
- ✅ MetricCard from ui/
- ✅ StatusBadge from layout/
- ✅ Card, Button from ui/

---

## 🧠 Context-Aware Logic

### User Activity Profiles
```typescript
type Profile = 'lead-heavy' | 'property-heavy' | 'deal-heavy' | 'balanced';

// Detection logic
if (recentLeads > recentProperties && recentLeads > activeDeals) 
  → lead-heavy

if (recentProperties > recentLeads && recentProperties > activeDeals)
  → property-heavy

if (activeDeals * 3 > recentLeads && activeDeals * 3 > recentProperties)
  → deal-heavy

else → balanced
```

### Time-Based Adaptation
```typescript
const hour = new Date().getHours();

if (hour >= 8 && hour < 12)  → morning  → Focus: Today's tasks
if (hour >= 12 && hour < 18) → afternoon → Focus: Progress
if (hour >= 18 || hour < 8)  → evening  → Focus: Tomorrow prep
```

### Metric Selection
```typescript
// Always show (2-3)
- Active Pipeline Value (deals in negotiation)
- This Month Revenue (completed deals)
- Available Inventory (ready to list)

// Contextual (1-2 based on profile)
lead-heavy    → Conversion Rate
deal-heavy    → Commission Pending
property-heavy → Days on Market
admin         → Team Performance
```

---

## 🔴🟡🟢 Action Prioritization

### Urgency Tiers
```typescript
🔴 URGENT (Show first)
- Overdue tasks
- SLA violations (lead not contacted within SLA)
- Expiring deals (close date < 3 days)
- Document deadlines

🟡 IMPORTANT (Show second)
- Today's follow-ups
- Pending approvals
- Payment due this week
- Hot leads without activity 48h

🟢 PROACTIVE (Show third)
- Property matches (new matches for buyer requirements)
- Re-list opportunities
- Lease renewals (30-60 days out)
- Cross-sell opportunities
```

### Priority Algorithm
```typescript
priority = urgencyScore(50) + impactScore(30) + effortScore(20)

// urgencyScore: How soon? (0-50)
slaViolation → 50
overdue → 40
dueToday → 30
dueThisWeek → 20

// impactScore: How much revenue? (0-30)
highValue (>1M) → 30
mediumValue (500K-1M) → 20
lowValue (<500K) → 10

// effortScore: How easy? (0-20)
oneClick → 20
fiveMinutes → 15
thirtyMinutes → 10

// Sort by priority DESC, take top 6
```

---

## 📊 Smart Metrics Calculation

### Active Pipeline Value
```typescript
getDeals()
  .filter(d => ['negotiation', 'under-contract'].includes(d.lifecycle.status))
  .reduce((sum, d) => sum + d.financial.agreedPrice, 0)
```

### This Month Revenue
```typescript
const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();

getDeals()
  .filter(d => {
    if (d.lifecycle.status !== 'completed') return false;
    const completed = new Date(d.metadata.completedAt);
    return completed.getMonth() === thisMonth && 
           completed.getFullYear() === thisYear;
  })
  .reduce((sum, d) => sum + d.financial.agreedPrice, 0)
```

### Conversion Rate
```typescript
const leads = getLeads();
const converted = leads.filter(l => l.convertedToContactId);
const rate = (converted.length / leads.length) * 100;
```

### Available Inventory
```typescript
getProperties()
  .filter(p => p.status === 'available')
  .length
```

---

## 💡 Smart Insights

### Detection Rules
```typescript
// Low Inventory Alert
if (availableProperties < 5) {
  return {
    type: 'alert',
    priority: 90,
    title: 'Low Inventory Alert',
    message: 'Your available inventory is 40% below average...',
    actions: [
      { label: 'Add Property', onClick: () => navigate('add-property') },
      { label: 'View Analytics', onClick: () => navigate('analytics') }
    ]
  };
}

// Re-list Opportunities
const relistable = getProperties()
  .filter(p => p.status === 'sold' && canRelist(p));

if (relistable.length > 0) {
  return {
    type: 'opportunity',
    priority: 70,
    title: 'Re-list Opportunity',
    message: `${relistable.length} properties ready to re-list. Avg profit: PKR 850K`,
    actions: [
      { label: 'View Properties', onClick: () => navigate('relistable') }
    ]
  };
}

// Performance vs Target
if (monthlyRevenue > monthlyTarget * 1.1) {
  return {
    type: 'performance',
    priority: 60,
    title: 'Exceeding Target',
    message: `You're on track to exceed monthly target by 15%!`,
    actions: [
      { label: 'View Details', onClick: () => navigate('analytics') }
    ]
  };
}
```

---

## 🚀 Quick Launch Cards

### Default Configuration (6 cards)
```typescript
const defaultQuickLaunch = [
  { 
    id: 'leads', 
    icon: Users, 
    label: 'Leads',
    badge: newLeadsCount,
    color: 'terracotta',
    onClick: () => navigate('leads')
  },
  { 
    id: 'properties', 
    icon: Building2, 
    label: 'Properties',
    badge: availablePropertiesCount,
    color: 'slate',
    onClick: () => navigate('properties')
  },
  { 
    id: 'deals', 
    icon: Handshake, 
    label: 'Deals',
    badge: activeDealsCount,
    color: 'terracotta',
    onClick: () => navigate('deals')
  },
  { 
    id: 'contacts', 
    icon: ContactRound, 
    label: 'Contacts',
    badge: highValueContactsCount,
    color: 'slate',
    onClick: () => navigate('contacts')
  },
  { 
    id: 'add-lead', 
    icon: UserPlus, 
    label: 'Add Lead',
    color: 'forestGreen',
    onClick: () => openModal('create-lead')
  },
  { 
    id: 'add-property', 
    icon: PlusCircle, 
    label: 'Add Property',
    color: 'forestGreen',
    onClick: () => navigate('add-property')
  }
];
```

### Contextual Adaptation
```typescript
if (activityProfile === 'lead-heavy') {
  // Promote lead-related cards
  cards.unshift({ id: 'lead-workspace', ... });
  cards.unshift({ id: 'add-lead', ... });
}

if (activityProfile === 'deal-heavy') {
  // Add deal-specific cards
  cards.push({ id: 'commission-tracker', ... });
  cards.push({ id: 'payment-schedule', ... });
}
```

---

## 📈 Performance Pulse

### Chart Selection Logic
```typescript
// If user closed deals recently (last 7 days) → Revenue Trend
if (dealsClosedLast7Days > 0) {
  return <RevenueTrendChart data={last30DaysRevenue} />;
}

// If user has active pipeline → Pipeline Funnel
if (activePipelineValue > 0) {
  return <PipelineFunnelChart stages={[...]} />;
}

// Default → Activity Heatmap
return <ActivityHeatmap days={7} />;
```

### Activity Timeline
```typescript
const recentActivity = [
  ...getRecentProperties().map(p => ({
    type: 'property',
    icon: Building2,
    title: 'Property Added',
    description: p.title,
    timestamp: p.createdAt
  })),
  ...getRecentDeals().map(d => ({
    type: 'deal',
    icon: Handshake,
    title: `Deal ${d.lifecycle.status}`,
    description: `${d.property.address} • ${formatPKR(d.financial.agreedPrice)}`,
    timestamp: d.metadata.updatedAt
  })),
  // ... more activity types
]
  .sort((a, b) => b.timestamp - a.timestamp)
  .slice(0, 7);
```

---

## ⚡ Performance Optimization

### Caching
```typescript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const dashboardCache = new Map();

function getDashboardData(userId: string) {
  const cached = dashboardCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = computeDashboardData(userId);
  dashboardCache.set(userId, { data, timestamp: Date.now() });
  return data;
}
```

### Memoization
```typescript
const metrics = useMemo(() => 
  calculateMetrics(deals, properties, leads), 
  [deals, properties, leads]
);

const actions = useMemo(() => 
  prioritizeActions(context, data),
  [context, data]
);

const insights = useMemo(() =>
  detectInsights(businessState),
  [businessState]
);
```

### Lazy Loading
```typescript
// Load Intelligence Panel on scroll
const IntelligencePanel = lazy(() => 
  import('./sections/IntelligencePanel')
);

// In component
<Suspense fallback={<Skeleton />}>
  <IntelligencePanel />
</Suspense>
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Metric calculations return correct values
- [ ] Action prioritization sorts correctly
- [ ] Context detection identifies profiles
- [ ] Insight rules trigger appropriately
- [ ] Empty states display when no data

### Integration Tests
- [ ] Dashboard loads without errors
- [ ] Navigation works from all cards
- [ ] Action CTAs trigger correct flows
- [ ] Responsive on mobile/tablet/desktop
- [ ] Caching improves performance

### User Acceptance
- [ ] User can identify top priority in < 5 seconds
- [ ] Dashboard loads in < 1 second
- [ ] All workflows accessible in 2 clicks
- [ ] Adaptive behavior works correctly
- [ ] Insights are helpful and actionable

---

## 📦 Component Props

### DashboardV4
```typescript
interface DashboardV4Props {
  user: User;
  onNavigate: (page: string, data?: any) => void;
  currentModule?: 'agency' | 'developer';
}
```

### DashboardMetricCard
```typescript
interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: 'forestGreen' | 'terracotta' | 'slate';
  onClick?: () => void;
}
```

### ActionItem
```typescript
interface ActionItemProps {
  type: 'urgent' | 'important' | 'proactive';
  title: string;
  description: string;
  priority: number;
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  icon?: LucideIcon;
}
```

### QuickLaunchCard
```typescript
interface QuickLaunchCardProps {
  icon: LucideIcon;
  label: string;
  badge?: number | string;
  color: 'forestGreen' | 'terracotta' | 'slate';
  onClick: () => void;
}
```

### InsightCard
```typescript
interface InsightCardProps {
  type: 'alert' | 'opportunity' | 'performance';
  title: string;
  message: string;
  actions: {
    label: string;
    onClick: () => void;
  }[];
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

---

## 🎨 Styling Patterns

### Metric Card
```tsx
<div className="bg-white rounded-lg p-6 border border-warm-cream shadow-sm 
                hover:border-forest-green hover:shadow-md transition-all">
  <div className="flex items-center gap-3">
    <div className="p-3 rounded-lg bg-forest-green/10">
      <Icon className="h-6 w-6 text-forest-green" />
    </div>
    <div>
      <p className="text-slate">{label}</p>
      <p className="text-charcoal">{value}</p>
    </div>
  </div>
</div>
```

### Action Item
```tsx
<div className="bg-white rounded-lg p-4 border-l-4 
                ${urgency === 'urgent' ? 'border-red-500' : 
                  urgency === 'important' ? 'border-terracotta' : 
                  'border-forest-green'}
                hover:bg-warm-cream transition-colors cursor-pointer">
  <h3>{title}</h3>
  <p className="text-slate">{description}</p>
  <div className="flex gap-2 mt-3">
    <Button variant="primary">{action}</Button>
  </div>
</div>
```

### Quick Launch Card
```tsx
<button className="flex flex-col items-center justify-center p-6 
                   bg-warm-cream rounded-lg border border-transparent
                   hover:bg-white hover:border-forest-green hover:shadow-md
                   transition-all group relative">
  {badge && (
    <span className="absolute top-2 right-2 bg-terracotta text-white 
                     px-2 py-1 rounded-full text-xs">
      {badge}
    </span>
  )}
  <Icon className="h-8 w-8 mb-2 text-forest-green 
                   group-hover:scale-110 transition-transform" />
  <span className="text-charcoal">{label}</span>
</button>
```

---

## 📱 Responsive Breakpoints

```typescript
const responsive = {
  // Mobile: Stack everything vertically
  mobile: 'grid-cols-1 gap-4',
  
  // Tablet: 2 columns for most sections
  tablet: 'md:grid-cols-2 md:gap-6',
  
  // Desktop: Full layout
  desktop: 'lg:grid-cols-4 lg:gap-8',
  
  // Wide: Maintain max-width for readability
  wide: 'xl:max-w-7xl xl:mx-auto'
};
```

---

## ⏱️ Implementation Timeline

| Phase | Days | Focus | Deliverable |
|-------|------|-------|-------------|
| 1 | 1-2 | Foundation | Layout + static metrics |
| 2 | 3-4 | Data | Real metrics from data |
| 3 | 5-7 | Actions | Smart action center |
| 4 | 8-9 | Quick Launch | Workflow shortcuts |
| 5 | 10-11 | Performance | Charts + timeline |
| 6 | 12-14 | Intelligence | Smart insights |
| 7 | 15-16 | Context | Adaptive behavior |
| 8 | 17-18 | Polish | Animations + optimization |
| 9 | 19-20 | Testing | Integration + UAT |
| 10 | 21 | Documentation | Docs + handoff |

**Total: 21 days**

---

## ✅ Launch Checklist

### Pre-Launch
- [ ] All 5 sections implemented
- [ ] Metrics calculating correctly
- [ ] Actions prioritizing correctly
- [ ] Insights detecting correctly
- [ ] Navigation working
- [ ] Responsive on all devices
- [ ] Accessible (WCAG AA)
- [ ] Performance < 1s load
- [ ] Tests passing
- [ ] Documentation complete

### Launch Day
- [ ] Replace old Dashboard.tsx
- [ ] Test with production data
- [ ] Monitor error logs
- [ ] Collect user feedback
- [ ] Track metrics (load time, engagement)

### Post-Launch (Week 1)
- [ ] Review analytics
- [ ] Gather user feedback
- [ ] Fix any bugs
- [ ] Optimize based on usage
- [ ] Plan Phase 11 (ML features)

---

## 🔗 Quick Links

- **Full Plan**: `/DASHBOARD_REDESIGN_PLAN.md`
- **Visual Mockup**: `/DASHBOARD_VISUAL_MOCKUP.md`
- **Guidelines**: `/Guidelines.md`
- **Design System**: `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`
- **Brand Guide**: `/BRAND_QUICK_REFERENCE.md`

---

**Ready to Build?** → Start with Phase 1: Foundation

**Questions?** → Refer to full plan document

**Stuck?** → Check existing V4 components for patterns

---

*Quick Reference Version: 1.0.0*
*Created: January 5, 2026*
