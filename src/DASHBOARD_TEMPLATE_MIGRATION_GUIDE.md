# Dashboard Template Migration Guide

**Purpose**: Step-by-step guide to migrate existing agency dashboards to use the new DashboardTemplate

**Time per Dashboard**: 30-60 minutes  
**Complexity**: Easy to Moderate  
**Design System**: V4.1

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why Migrate?](#why-migrate)
3. [Migration Checklist](#migration-checklist)
4. [Step-by-Step Guide](#step-by-step-guide)
5. [Examples](#examples)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What is DashboardTemplate?

A standardized, reusable template for all dashboard pages in the agency module. It provides:

- ✅ Consistent header with title, description, actions
- ✅ KPI metric cards (max 5 per Miller's Law)
- ✅ Tab-based content organization
- ✅ Filter section
- ✅ Real-time data refresh capability
- ✅ Built-in UX Laws compliance
- ✅ Automatic accessibility

### Dashboards to Migrate

1. ✅ **Dashboard.tsx** (Main Dashboard) - Example provided
2. 🔄 **AgencyAnalyticsDashboard.tsx** - To migrate
3. 🔄 **AgencyHub.tsx** - To migrate
4. 🔄 **AgencyPropertiesDashboard.tsx** - To migrate
5. 🔄 **DealDashboard.tsx** - To migrate
6. 🔄 **AgentPerformanceDashboard.tsx** - To migrate

---

## Why Migrate?

### Benefits

**1. Consistency**
- Same look & feel across all dashboards
- Users learn once, use everywhere

**2. Less Code** (70% reduction)
```tsx
// Before: ~300 lines
// After:  ~90 lines
```

**3. Built-in Best Practices**
- UX Laws automatically applied
- Accessibility built-in
- Responsive design included

**4. Faster Development**
- 30-60 min per dashboard (vs 4-8 hours)
- Copy-paste-modify approach
- No layout decisions needed

**5. Easier Maintenance**
- Update template once, all dashboards update
- Centralized bug fixes
- Consistent behavior

---

## Migration Checklist

### Pre-Migration

- [ ] Read this guide completely
- [ ] Study `DashboardTemplateExample.tsx`
- [ ] Review existing dashboard to migrate
- [ ] Identify metrics, tabs, and actions

### During Migration

- [ ] Extract data loading logic
- [ ] Define metrics array (max 5)
- [ ] Define actions (1 primary, rest secondary)
- [ ] Create tab content components
- [ ] Configure filters if needed
- [ ] Test all functionality

### Post-Migration

- [ ] Test keyboard navigation
- [ ] Test on mobile/tablet/desktop
- [ ] Verify metrics display correctly
- [ ] Ensure all actions work
- [ ] Check accessibility with screen reader
- [ ] Update routing if needed

---

## Step-by-Step Guide

### Step 1: Analyze Current Dashboard

Open your dashboard file and identify:

**1. Header Information**
- Title
- Description
- Back button handler

**2. Metrics/KPIs**
- How many? (should be max 5)
- What data?
- Icons?
- Trends?

**3. Actions**
- Primary action (1 max)
- Secondary actions (rest)

**4. Content Organization**
- Tabs? How many?
- Single view?
- What's in each section?

**5. Filters**
- Time range selector?
- Status filters?
- Other filters?

### Step 2: Create New File (Optional)

If you want to keep old version during migration:

```bash
# Rename old file
mv Dashboard.tsx Dashboard.OLD.tsx

# Create new file
touch Dashboard.tsx
```

Or migrate in place.

### Step 3: Set Up Imports

```tsx
import React, { useState, useMemo } from 'react';
import { DashboardTemplate, DashboardCard, DashboardGrid } from './templates/DashboardTemplate';
import { User } from '../types';
// ... other imports
```

### Step 4: Extract Data Logic

Keep your existing data loading logic:

```tsx
export const YourDashboard: React.FC<Props> = ({ user, onNavigate, onBack }) => {
  // Keep existing data loading
  const properties = useMemo(() => 
    getProperties(user.id, user.role), 
    [user.id, user.role]
  );

  const leads = useMemo(() => 
    getLeads(user.id, user.role), 
    [user.id, user.role]
  );

  // Keep calculations
  const totalValue = useMemo(() => {
    return properties.reduce((sum, p) => sum + p.price, 0);
  }, [properties]);

  // ... rest of logic
};
```

### Step 5: Define Metrics

Convert your metric cards to metrics array:

```tsx
const metrics = useMemo(() => [
  {
    label: 'Total Properties',
    value: properties.length.toString(),
    icon: <Home className="h-5 w-5" />,
    trend: 12, // % change from last period
    variant: 'default' as const,
  },
  {
    label: 'Active Leads',
    value: activeLeads.toString(),
    icon: <Users className="h-5 w-5" />,
    trend: -3,
    variant: 'warning' as const,
  },
  // Max 5 metrics total
], [properties, leads]);
```

**Variants**:
- `default` - Blue theme
- `success` - Green theme
- `warning` - Yellow theme
- `danger` - Red theme

### Step 6: Define Actions

**Primary Action** (1 max - Hick's Law):
```tsx
const primaryAction = {
  label: 'Export Report',
  icon: <Download className="h-4 w-4" />,
  onClick: handleExportReport,
};
```

**Secondary Actions** (dropdown):
```tsx
const secondaryActions = [
  {
    label: 'Refresh Data',
    icon: <RefreshCw className="h-4 w-4" />,
    onClick: handleRefresh,
  },
  {
    label: 'View Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    onClick: () => onNavigate('analytics'),
  },
];
```

### Step 7: Create Tab Content Components

Extract each tab's content into a component:

```tsx
const OverviewContent = () => (
  <div className="p-6 space-y-6">
    <DashboardGrid columns={2}>
      <DashboardCard title="Properties" description="Overview">
        {/* Your content */}
      </DashboardCard>
      
      <DashboardCard title="Leads" description="Pipeline">
        {/* Your content */}
      </DashboardCard>
    </DashboardGrid>
  </div>
);

const PropertiesContent = () => (
  <div className="p-6">
    {/* Properties list/grid */}
  </div>
);

const LeadsContent = () => (
  <div className="p-6">
    {/* Leads list */}
  </div>
);
```

### Step 8: Define Tabs Array

```tsx
const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="h-4 w-4" />,
    content: <OverviewContent />,
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: <Home className="h-4 w-4" />,
    content: <PropertiesContent />,
    badge: properties.length, // Optional badge
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users className="h-4 w-4" />,
    content: <LeadsContent />,
    badge: leads.length,
  },
];
```

### Step 9: Create Filters (Optional)

```tsx
const filters = (
  <div className="flex items-center gap-2">
    <Button
      variant={timeRange === '7days' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setTimeRange('7days')}
    >
      7 Days
    </Button>
    <Button
      variant={timeRange === '30days' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setTimeRange('30days')}
    >
      30 Days
    </Button>
    <Button
      variant={timeRange === '90days' ? 'default' : 'outline'}
      size="sm"
      onClick={() => setTimeRange('90days')}
    >
      90 Days
    </Button>
  </div>
);
```

### Step 10: Render with DashboardTemplate

```tsx
return (
  <DashboardTemplate
    title="Agency Dashboard"
    description={`Welcome back, ${user.name}!`}
    onBack={onBack}
    
    // Metrics (max 5)
    metrics={metrics}
    
    // Actions
    primaryAction={primaryAction}
    secondaryActions={secondaryActions}
    
    // Filters
    filters={filters}
    
    // Tabs
    tabs={tabs}
    defaultTab="overview"
    
    // Real-time updates (optional)
    refreshInterval={30000} // 30 seconds
    onRefresh={handleRefresh}
    lastUpdated={lastUpdated}
  />
);
```

---

## Examples

### Example 1: Simple Dashboard (No Tabs)

```tsx
export const SimpleDashboard = ({ user }) => {
  const data = fetchData();

  return (
    <DashboardTemplate
      title="Sales Dashboard"
      metrics={[
        { label: 'Revenue', value: 'PKR 5M', icon: <DollarSign /> },
        { label: 'Deals', value: '45', icon: <Handshake /> },
      ]}
      primaryAction={{
        label: 'New Deal',
        onClick: handleNewDeal,
      }}
      content={
        <div className="p-6">
          <DashboardCard title="Recent Deals">
            {/* Content */}
          </DashboardCard>
        </div>
      }
    />
  );
};
```

### Example 2: Multi-Tab Dashboard

```tsx
export const MultiTabDashboard = ({ user }) => {
  return (
    <DashboardTemplate
      title="Agency Hub"
      metrics={metrics}
      tabs={[
        { id: 'overview', label: 'Overview', content: <Overview /> },
        { id: 'agents', label: 'Agents', content: <Agents />, badge: 12 },
        { id: 'commission', label: 'Commission', content: <Commission /> },
      ]}
    />
  );
};
```

### Example 3: Real-time Dashboard

```tsx
export const RealtimeDashboard = ({ user }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const handleRefresh = async () => {
    await fetchLatestData();
    setLastUpdated(new Date());
  };

  return (
    <DashboardTemplate
      title="Live Metrics"
      metrics={metrics}
      refreshInterval={5000} // Update every 5 seconds
      onRefresh={handleRefresh}
      lastUpdated={lastUpdated}
      tabs={tabs}
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Properties Overview

```tsx
<DashboardCard
  title="Properties Overview"
  description="Distribution by status"
  action={
    <Button variant="ghost" size="sm" onClick={handleViewAll}>
      View All
    </Button>
  }
>
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm">Available</span>
      <Badge>{availableCount}</Badge>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm">Sold</span>
      <Badge variant="secondary">{soldCount}</Badge>
    </div>
  </div>
</DashboardCard>
```

### Pattern 2: Agent Leaderboard

```tsx
<DashboardCard title="Top Agents" description="This month">
  <div className="space-y-3">
    {topAgents.map((agent, index) => (
      <div key={agent.id} className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="font-medium">{agent.name}</p>
          <p className="text-sm text-muted-foreground">
            {agent.dealsCount} deals
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatPKR(agent.commission)}</p>
        </div>
      </div>
    ))}
  </div>
</DashboardCard>
```

### Pattern 3: Chart Widget

```tsx
<DashboardCard title="Sales Trend" description="Last 6 months">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#030213" />
    </LineChart>
  </ResponsiveContainer>
</DashboardCard>
```

### Pattern 4: Recent Activity

```tsx
<DashboardCard title="Recent Activity">
  <div className="space-y-2">
    {recentItems.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 cursor-pointer"
        onClick={() => handleItemClick(item)}
      >
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
        </div>
        <Badge>{item.status}</Badge>
      </div>
    ))}
  </div>
</DashboardCard>
```

---

## Troubleshooting

### Issue: Metrics not displaying

**Problem**: Metrics array not showing  
**Solution**: Check metrics array format

```tsx
// ❌ WRONG
metrics={[
  { name: 'Revenue', val: 5000 } // Wrong keys
]}

// ✅ RIGHT
metrics={[
  { label: 'Revenue', value: '5000', icon: <DollarSign /> }
]}
```

### Issue: Tabs not working

**Problem**: Clicking tabs doesn't switch content  
**Solution**: Ensure unique tab IDs

```tsx
// ❌ WRONG
tabs={[
  { id: 'tab1', label: 'Tab 1', content: <Content1 /> },
  { id: 'tab1', label: 'Tab 2', content: <Content2 /> }, // Duplicate ID!
]}

// ✅ RIGHT
tabs={[
  { id: 'overview', label: 'Overview', content: <Content1 /> },
  { id: 'details', label: 'Details', content: <Content2 /> },
]}
```

### Issue: Actions not showing

**Problem**: Primary action button not visible  
**Solution**: Check action format

```tsx
// ❌ WRONG
primaryAction="Export" // String not allowed

// ✅ RIGHT
primaryAction={{
  label: 'Export',
  onClick: handleExport,
}}
```

### Issue: Layout broken on mobile

**Problem**: Content overflows on small screens  
**Solution**: Use DashboardGrid with proper columns

```tsx
// ✅ GOOD - Responsive
<DashboardGrid columns={2}>
  {/* Auto-adjusts to 1 column on mobile */}
</DashboardGrid>

// ❌ BAD - Fixed columns
<div className="grid grid-cols-3">
  {/* Always 3 columns, breaks on mobile */}
</div>
```

### Issue: Too many metrics

**Problem**: More than 5 metrics  
**Solution**: Prioritize, slice to 5

```tsx
// ❌ WRONG - Too many (violates Miller's Law)
metrics={allMetrics} // 12 metrics

// ✅ RIGHT - Max 5
metrics={allMetrics.slice(0, 5)}

// ✅ ALSO RIGHT - Prioritize important ones
metrics={[
  mostImportantMetric,
  secondMostImportant,
  thirdMostImportant,
  fourthMostImportant,
  fifthMostImportant,
]}
```

---

## Before & After Comparison

### Before (Custom Dashboard)

```tsx
// Dashboard.tsx - 350 lines

export const Dashboard = ({ user, onNavigate }) => {
  // ... data loading (50 lines)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom header (30 lines) */}
      <div className="bg-white border-b p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={handleExport}>Export</Button>
            <Button onClick={handleRefresh}>Refresh</Button>
          </div>
        </div>
        
        {/* Custom metrics (50 lines) */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <div className="text-sm text-green-600">+12%</div>
            </CardContent>
          </Card>
          {/* ... 4 more cards */}
        </div>
      </div>

      {/* Custom tabs (100 lines) */}
      <div className="bg-white border-b">
        <div className="flex gap-4 px-6">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {/* ... more tabs */}
        </div>
      </div>

      {/* Tab content (120 lines) */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewContent />}
        {activeTab === 'properties' && <PropertiesContent />}
        {activeTab === 'leads' && <LeadsContent />}
      </div>
    </div>
  );
};
```

### After (DashboardTemplate)

```tsx
// Dashboard.tsx - 120 lines

import { DashboardTemplate } from './templates/DashboardTemplate';

export const Dashboard = ({ user, onNavigate }) => {
  // ... same data loading (50 lines)

  const metrics = [...]; // 15 lines
  const tabs = [...]; // 20 lines

  return (
    <DashboardTemplate
      title="Dashboard"
      metrics={metrics}
      primaryAction={{ label: 'Export', onClick: handleExport }}
      secondaryActions={[
        { label: 'Refresh', onClick: handleRefresh },
      ]}
      tabs={tabs}
    />
  );
};

// 230 lines saved! (66% reduction)
```

**Benefits**:
- ✅ 66% less code
- ✅ Consistent with other dashboards
- ✅ Automatic UX Laws compliance
- ✅ Built-in accessibility
- ✅ Easier to maintain

---

## Migration Timeline

### Phase 1 (Week 1): Main Dashboards
- [ ] Dashboard.tsx (Main Dashboard)
- [ ] AgencyHub.tsx
- [ ] AgencyAnalyticsDashboard.tsx

### Phase 2 (Week 2): Specialized Dashboards
- [ ] AgencyPropertiesDashboard.tsx
- [ ] DealDashboard.tsx
- [ ] AgentPerformanceDashboard.tsx

### Phase 3 (Week 3): Testing & Refinement
- [ ] Cross-browser testing
- [ ] Accessibility testing
- [ ] Mobile responsiveness testing
- [ ] User acceptance testing

### Phase 4 (Week 4): Cleanup
- [ ] Delete old dashboard files
- [ ] Update documentation
- [ ] Create video tutorial
- [ ] Team training session

---

## Success Criteria

Migration is complete when:

- ✅ All dashboards use DashboardTemplate
- ✅ All functionality preserved
- ✅ UX Laws compliance verified
- ✅ Accessibility tested (keyboard nav, screen reader)
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Code review passed
- ✅ User testing passed

---

## Resources

- **DashboardTemplate**: `/components/templates/DashboardTemplate.tsx`
- **Example**: `/components/templates/DashboardTemplateExample.tsx`
- **Template Registry**: `/components/templates/index.ts`
- **README**: `/components/templates/README.md`
- **Design System**: `/DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md`
- **Quick Reference**: `/DESIGN_SYSTEM_QUICK_REFERENCE_CARD.md`

---

## Need Help?

1. **Study the example**: `DashboardTemplateExample.tsx`
2. **Check template docs**: `/components/templates/README.md`
3. **Review design system**: `/DESIGN_SYSTEM_INDEX.md`
4. **Ask for code review**: Before completing migration

---

**Version**: 1.0.0  
**Last Updated**: December 27, 2024  
**Status**: Ready for Use ✅

**Let's make all dashboards consistent and excellent!** 🚀
