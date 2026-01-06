# Navigation Integration Guide

## Overview
This guide shows how to integrate the Lead Management System into your main application navigation and routing.

---

## Step 1: Import Lead Components

Add these imports to your main App.tsx or routing file:

```typescript
// Lead Management Components
import { 
  LeadWorkspaceV4, 
  LeadDetailsV4,
  LeadsDashboardWidget,
  CreateLeadModal,
  QualifyLeadModal,
  ConvertLeadModal,
  LeadInteractionModal
} from './components/leads';
```

---

## Step 2: Add Leads to Navigation Menu

### For Sidebar Navigation:

```typescript
import { UserPlus } from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    icon: Home,
    badge: null,
  },
  // ADD THIS:
  {
    name: 'Leads',
    route: 'leads',
    icon: UserPlus,
    badge: requiresActionCount > 0 ? requiresActionCount : null,
    badgeVariant: 'destructive', // Red badge for urgent items
  },
  {
    name: 'Contacts',
    route: 'contacts',
    icon: Users,
    badge: null,
  },
  {
    name: 'Properties',
    route: 'properties',
    icon: Building,
    badge: null,
  },
  // ... other items
];
```

### For Top Navigation:

```typescript
<nav className="flex items-center gap-1">
  <NavButton 
    label="Dashboard" 
    active={currentView === 'dashboard'}
    onClick={() => setCurrentView('dashboard')}
  />
  
  {/* ADD THIS */}
  <NavButton 
    label="Leads" 
    active={currentView === 'leads'}
    onClick={() => setCurrentView('leads')}
    badge={urgentLeadsCount}
  />
  
  <NavButton 
    label="Contacts" 
    active={currentView === 'contacts'}
    onClick={() => setCurrentView('contacts')}
  />
  
  {/* ... other buttons */}
</nav>
```

---

## Step 3: Add Routing Logic

### Simple Routing Example:

```typescript
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Modal states
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showQualifyLead, setShowQualifyLead] = useState(false);
  const [showConvertLead, setShowConvertLead] = useState(false);
  const [showLeadInteraction, setShowLeadInteraction] = useState(false);

  // Navigation handler
  const handleNavigation = (view: string, id?: string) => {
    setCurrentView(view);
    if (id) {
      if (view === 'lead-details') {
        setSelectedLeadId(id);
      }
      // Handle other ID-based navigation
    }
  };

  // Render content based on current view
  function renderContent() {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            onNavigate={handleNavigation}
          />
        );
      
      // ADD THESE CASES:
      case 'leads':
        return (
          <LeadWorkspaceV4
            user={user}
            onNavigate={handleNavigation}
            onCreateLead={() => setShowCreateLead(true)}
          />
        );
      
      case 'lead-details':
        return selectedLeadId ? (
          <LeadDetailsV4
            leadId={selectedLeadId}
            user={user}
            onNavigate={handleNavigation}
            onBack={() => setCurrentView('leads')}
            onQualify={(id) => {
              setSelectedLeadId(id);
              setShowQualifyLead(true);
            }}
            onConvert={(id) => {
              setSelectedLeadId(id);
              setShowConvertLead(true);
            }}
            onAddInteraction={(id) => {
              setSelectedLeadId(id);
              setShowLeadInteraction(true);
            }}
          />
        ) : null;
      
      // ... other cases
      
      default:
        return <Dashboard user={user} onNavigate={handleNavigation} />;
    }
  }

  return (
    <div className="app">
      <Sidebar 
        currentView={currentView}
        onNavigate={handleNavigation}
      />
      
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Lead Modals */}
      <CreateLeadModal
        open={showCreateLead}
        onClose={() => setShowCreateLead(false)}
        user={user}
        workspaceId={user.workspaceId}
        onSuccess={(leadId) => {
          setShowCreateLead(false);
          handleNavigation('lead-details', leadId);
        }}
      />

      <QualifyLeadModal
        open={showQualifyLead}
        onClose={() => setShowQualifyLead(false)}
        leadId={selectedLeadId || ''}
        onSuccess={() => {
          setShowQualifyLead(false);
          // Refresh lead details
        }}
      />

      <ConvertLeadModal
        open={showConvertLead}
        onClose={() => setShowConvertLead(false)}
        leadId={selectedLeadId || ''}
        user={user}
        onSuccess={(result) => {
          setShowConvertLead(false);
          // Navigate to created contact
          if (result.contactId) {
            handleNavigation('contact-details', result.contactId);
          }
        }}
      />

      <LeadInteractionModal
        open={showLeadInteraction}
        onClose={() => setShowLeadInteraction(false)}
        leadId={selectedLeadId || ''}
        agentId={user.id}
        agentName={user.name}
        onSuccess={() => {
          setShowLeadInteraction(false);
          // Refresh lead details
        }}
      />
    </div>
  );
}
```

---

## Step 4: Add Dashboard Widget

### On Main Dashboard:

```typescript
function Dashboard({ user, onNavigate }) {
  return (
    <div className="dashboard-grid">
      {/* Existing widgets */}
      <StatsWidget />
      <RevenueWidget />
      
      {/* ADD THIS - Full width or 2-column span */}
      <div className="col-span-2">
        <LeadsDashboardWidget
          user={user}
          onNavigate={onNavigate}
          variant="full" // or "compact" for smaller space
        />
      </div>
      
      {/* Other widgets */}
      <PropertiesWidget />
      <DealsWidget />
    </div>
  );
}
```

### Compact Variant (for sidebar or smaller space):

```typescript
<LeadsDashboardWidget
  user={user}
  onNavigate={onNavigate}
  variant="compact"
/>
```

---

## Step 5: Add Notification Badge

Calculate urgent leads count for navigation badge:

```typescript
import { getSLAAlerts, filterLeads } from './lib/leadUtils';

function App() {
  const [urgentLeadsCount, setUrgentLeadsCount] = useState(0);

  // Update badge count
  useEffect(() => {
    const updateUrgentCount = () => {
      const alerts = getSLAAlerts();
      const overdueCount = alerts.filter(a => a.isOverdue).length;
      
      const requiresAction = filterLeads({
        status: ['new', 'qualifying'],
        slaCompliant: false
      }).length;
      
      setUrgentLeadsCount(Math.max(overdueCount, requiresAction));
    };

    updateUrgentCount();
    
    // Update every minute
    const interval = setInterval(updateUrgentCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Use urgentLeadsCount in navigation badge
  // ...
}
```

---

## Step 6: Add Quick Actions

### In App Header/Toolbar:

```typescript
<header className="app-header">
  <div className="header-left">
    {/* Logo, breadcrumbs, etc. */}
  </div>
  
  <div className="header-right">
    {/* ADD THIS */}
    <Button
      onClick={() => setShowCreateLead(true)}
      size="sm"
      variant="outline"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      New Lead
    </Button>
    
    {/* Other actions */}
    <NotificationsButton />
    <UserMenu />
  </div>
</header>
```

---

## Step 7: Add Keyboard Shortcuts (Optional)

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + L = Go to Leads
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      setCurrentView('leads');
    }
    
    // Ctrl/Cmd + Shift + L = New Lead
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      setShowCreateLead(true);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## Complete Integration Example

```typescript
import React, { useState, useEffect } from 'react';
import { 
  LeadWorkspaceV4, 
  LeadDetailsV4,
  LeadsDashboardWidget,
  CreateLeadModal,
  QualifyLeadModal,
  ConvertLeadModal,
  LeadInteractionModal
} from './components/leads';
import { getSLAAlerts, filterLeads } from './lib/leadUtils';
import { UserPlus, Home, Users, Building } from 'lucide-react';

function App() {
  // State
  const [user] = useState(getCurrentUser());
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [urgentLeadsCount, setUrgentLeadsCount] = useState(0);
  
  // Modal states
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showQualifyLead, setShowQualifyLead] = useState(false);
  const [showConvertLead, setShowConvertLead] = useState(false);
  const [showLeadInteraction, setShowLeadInteraction] = useState(false);

  // Update urgent leads badge
  useEffect(() => {
    const updateBadge = () => {
      const alerts = getSLAAlerts();
      const overdueCount = alerts.filter(a => a.isOverdue).length;
      setUrgentLeadsCount(overdueCount);
    };

    updateBadge();
    const interval = setInterval(updateBadge, 60000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handler
  const handleNavigation = (view: string, id?: string) => {
    setCurrentView(view);
    if (id) {
      if (view === 'lead-details') {
        setSelectedLeadId(id);
      }
    }
  };

  // Render content
  function renderContent() {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Widget - Full or compact based on layout */}
              <LeadsDashboardWidget
                user={user}
                onNavigate={handleNavigation}
                variant="full"
              />
              
              {/* Other widgets */}
              {/* ... */}
            </div>
          </div>
        );
      
      case 'leads':
        return (
          <LeadWorkspaceV4
            user={user}
            onNavigate={handleNavigation}
            onCreateLead={() => setShowCreateLead(true)}
          />
        );
      
      case 'lead-details':
        return selectedLeadId ? (
          <LeadDetailsV4
            leadId={selectedLeadId}
            user={user}
            onNavigate={handleNavigation}
            onBack={() => setCurrentView('leads')}
            onQualify={(id) => {
              setSelectedLeadId(id);
              setShowQualifyLead(true);
            }}
            onConvert={(id) => {
              setSelectedLeadId(id);
              setShowConvertLead(true);
            }}
            onAddInteraction={(id) => {
              setSelectedLeadId(id);
              setShowLeadInteraction(true);
            }}
          />
        ) : null;
      
      default:
        return <div>View not found</div>;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <nav className="p-4 space-y-2">
          <NavItem
            icon={<Home />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          
          <NavItem
            icon={<UserPlus />}
            label="Leads"
            active={currentView === 'leads'}
            onClick={() => setCurrentView('leads')}
            badge={urgentLeadsCount}
          />
          
          <NavItem
            icon={<Users />}
            label="Contacts"
            active={currentView === 'contacts'}
            onClick={() => setCurrentView('contacts')}
          />
          
          <NavItem
            icon={<Building />}
            label="Properties"
            active={currentView === 'properties'}
            onClick={() => setCurrentView('properties')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Modals */}
      <CreateLeadModal
        open={showCreateLead}
        onClose={() => setShowCreateLead(false)}
        user={user}
        workspaceId={user.workspaceId}
        onSuccess={(leadId) => {
          setShowCreateLead(false);
          handleNavigation('lead-details', leadId);
        }}
      />

      <QualifyLeadModal
        open={showQualifyLead}
        onClose={() => setShowQualifyLead(false)}
        leadId={selectedLeadId || ''}
        onSuccess={() => {
          setShowQualifyLead(false);
        }}
      />

      <ConvertLeadModal
        open={showConvertLead}
        onClose={() => setShowConvertLead(false)}
        leadId={selectedLeadId || ''}
        user={user}
        onSuccess={(result) => {
          setShowConvertLead(false);
          if (result.contactId) {
            handleNavigation('contact-details', result.contactId);
          }
        }}
      />

      <LeadInteractionModal
        open={showLeadInteraction}
        onClose={() => setShowLeadInteraction(false)}
        leadId={selectedLeadId || ''}
        agentId={user.id}
        agentName={user.name}
        onSuccess={() => {
          setShowLeadInteraction(false);
        }}
      />
    </div>
  );
}

// Helper component
function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
        ${active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        }
      `}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

export default App;
```

---

## Testing Checklist

After integration, test these flows:

- [ ] Click "Leads" in navigation → Shows LeadWorkspaceV4
- [ ] Badge count updates when leads become overdue
- [ ] Click "New Lead" → Opens CreateLeadModal
- [ ] Create lead → Navigates to lead details
- [ ] Click lead card → Opens LeadDetailsV4
- [ ] Qualify lead → Opens QualifyLeadModal
- [ ] Convert lead → Opens ConvertLeadModal → Navigates to contact
- [ ] Add interaction → Opens LeadInteractionModal
- [ ] Back button → Returns to leads workspace
- [ ] Dashboard widget → Shows correct metrics
- [ ] Dashboard widget "View All" → Navigates to leads
- [ ] Dashboard widget quick actions work
- [ ] Keyboard shortcuts work (if implemented)

---

## Performance Considerations

### Lazy Loading (Optional):

```typescript
const LeadWorkspaceV4 = lazy(() => import('./components/leads/LeadWorkspaceV4'));
const LeadDetailsV4 = lazy(() => import('./components/leads/LeadDetailsV4'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  {renderContent()}
</Suspense>
```

### Memoization:

```typescript
const Dashboard = memo(({ user, onNavigate }) => {
  // ... component code
});
```

---

## Done! ✅

Your Lead Management System is now fully integrated into the main application navigation.

Users can:
- Access leads from the main navigation
- See urgent lead counts in badge
- Create leads from anywhere
- Navigate seamlessly between leads and other modules
- Monitor lead metrics on dashboard
