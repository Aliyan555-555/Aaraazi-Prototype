# aaraazi Agency Module - Complete Component Tree & Architecture

**Document Version**: 1.0  
**Last Updated**: January 7, 2026  
**Status**: Complete Technical Architecture Mapping

---

## Table of Contents

1. [Overview](#overview)
2. [Application Root Structure](#application-root-structure)
3. [Complete Component Tree](#complete-component-tree)
4. [Module Integration Architecture](#module-integration-architecture)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Navigation Flow Architecture](#navigation-flow-architecture)
7. [Service Layer Connections](#service-layer-connections)
8. [State Management Patterns](#state-management-patterns)
9. [Component Dependencies Map](#component-dependencies-map)
10. [File Structure & Organization](#file-structure--organization)

---

## Overview

The aaraazi Agency Module is built as a **single-page application (SPA)** using React 18 with TypeScript. The architecture follows a **component-based design** with **unidirectional data flow** and **prop-drilling navigation**.

### Key Architectural Principles

1. **Component Hierarchy**: Strict parent-child relationships
2. **State Management**: Local state with useState/useEffect (no global state)
3. **Navigation**: Callback-based routing via `onNavigate` props
4. **Data Persistence**: localStorage via service layer
5. **Modularity**: Feature-based component organization

---

## Application Root Structure

### Entry Point: `/App.tsx`

The root component manages:
- Authentication state
- Global navigation routing
- View state management
- Module switching (Agency ↔ Developers)
- Lazy loading of components
- Error boundary handling

**Key State Variables**:
```typescript
const [currentView, setCurrentView] = useState<string>('dashboard');
const [user, setUser] = useState<User | null>(null);
const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
const [currentModule, setCurrentModule] = useState<'agency' | 'developers'>('agency');
```

---

## Complete Component Tree

### Level 1: Root Application

```
App.tsx
├─ React.Suspense (Lazy Loading Wrapper)
│  └─ ErrorBoundary (Error Handling)
│     └─ ToastProvider (Notifications)
│        └─ Main Application Container
```

### Level 2: Authentication Layer

```
Main Application Container
│
├─ Unauthenticated State
│  └─ LoginPage
│     ├─ LoginForm
│     ├─ WorkspaceSelector
│     └─ UserCredentials
│
└─ Authenticated State
   ├─ Sidebar Component
   ├─ Main Content Area
   └─ Global Components
```

### Level 3: Main Application Layout (Authenticated)

```
Authenticated Application
│
├─ Sidebar
│  ├─ Logo & Branding
│  ├─ User Profile Section
│  ├─ Navigation Menu
│  │  ├─ Dashboard Link
│  │  ├─ Properties Link
│  │  ├─ Transactions Link
│  │  ├─ Leads Link
│  │  ├─ Contacts Link
│  │  ├─ Deals Link
│  │  ├─ Requirements Link
│  │  ├─ Portfolio Link
│  │  ├─ Financials Link
│  │  └─ Settings Link
│  ├─ Module Switcher (Agency/Developers)
│  └─ Logout Button
│
├─ Main Content Area
│  └─ [Dynamic View Rendering based on currentView]
│
└─ Global Components
   ├─ Toast Notifications (Sonner)
   ├─ Loading Indicators
   └─ Error Dialogs
```

---

## Module Integration Architecture

### Module 1: Dashboard V4

**Entry Component**: `DashboardV4.tsx`

**Props Received**:
- `user: User`
- `onNavigate: (view, params) => void`
- `currentModule: 'agency' | 'developers'`

**Data Sources**:
- `getAllProperties()` → Properties[]
- `getAllTransactions()` → Transactions[]
- `getAllLeads()` → Leads[]
- `getAllContacts()` → Contacts[]
- `getFinancialSummary()` → FinancialMetrics

**Child Components**:
1. **HeroSection**: Welcome message, date, quick stats
2. **ActionCenter**: Contextual quick actions
3. **QuickLaunch**: Module navigation cards
4. **PerformancePulse**: Real-time metrics, charts
5. **IntelligencePanel**: Smart insights, alerts, recommendations

---

### Module 2: Properties Module

**Entry Component**: `PropertiesWorkspaceV4.tsx`

**State Management**:
- `properties: Property[]`
- `searchQuery: string`
- `filters: FilterState`
- `sortOption: string`
- `viewMode: 'grid' | 'table'`
- `selectedProperties: string[]`

**Layout Components**:
1. **WorkspaceHeader**: Title, stats, actions, view toggle
2. **WorkspaceSearchBar**: Search, filters, sort options
3. **Property Display**: Grid view (PropertyCard) or Table view

**Property Details Component**: `PropertyDetailsV4.tsx`

**Tabs**:
- Overview: Images, description, specifications
- Transactions: Related transactions list
- Financial: Purchase price, ROI, expenses
- History: Ownership timeline, price history
- Documents: Document list, upload/download

---

### Module 3: Transactions Module

Split into three sub-modules:

#### 3.1 Sell Cycle Module

**Entry Component**: `SellCyclesWorkspaceV4.tsx`

**Stages**:
1. Listed
2. Negotiation
3. Offer Accepted
4. Documentation
5. Payment
6. Ownership Transfer
7. Completed

**Views**: Kanban (default), Table, Timeline

#### 3.2 Purchase Cycle Module

Similar structure to Sell Cycle, focused on agency buying properties.

#### 3.3 Rent Cycle Module

Similar structure to Sell Cycle, focused on leasing properties.

---

### Module 4: Leads Module

**Entry Component**: `LeadsWorkspaceV4.tsx`

**Pipeline Stages**:
1. New (uncontacted)
2. Contacted (initial contact made)
3. Qualified (meets criteria)
4. Negotiation (deal discussions)
5. Closed (converted or lost)

**Lead Actions (Modals)**:
- **CreateLeadModal**: Add new lead
- **QualifyLeadModal**: Qualify lead
- **ConvertLeadModal**: Convert to contact
- **LeadInteractionModal**: Log interaction

---

### Module 5: Contacts/Clients Module

**Entry Component**: `ContactsWorkspaceV4.tsx`

**Contact Types**:
- Buyer
- Seller
- Tenant
- Landlord
- Investor

**Contact Details Tabs**:
- Overview: Personal information
- Transactions: Transaction history
- Properties: Owned properties
- Requirements: Active/fulfilled requirements
- Financial: Payment history, LTV
- Communication: Interaction history
- Origin: Source lead information (if converted)

---

### Module 6: Requirements Module

#### 6.1 Buyer Requirements

**Entry Component**: `BuyerRequirementsWorkspace.tsx`

**Property Matching System**:

**Matching Criteria**:
- Property Type (exact match)
- Budget Range (±10% tolerance)
- Location (area match)
- Bedrooms (±1 tolerance)
- Bathrooms (±1 tolerance)
- Area Size (±20% tolerance)
- Additional Features (bonus points)

**Scoring Algorithm**:
- Type Match: 25 points
- Budget Match: 25 points
- Location Match: 20 points
- Specs Match: 20 points
- Features Match: 10 points
- **Total**: 100 points max

**Match Ranking**:
- Excellent Match: 80-100 points
- Good Match: 60-79 points
- Fair Match: 40-59 points
- Poor Match: <40 points (not shown)

**Send Offer Modal**: `SendOfferToBuyerModal.tsx` ✅ **PRODUCTION-READY**

**Features**:
- Buyer information display
- Property summary
- Match score breakdown
- Customizable message template
- Send method selection (Email, WhatsApp, In-App)
- Comprehensive error handling
- Graceful user feedback via toasts

**Bug Fixes Applied**:
- ✅ Props mismatch resolved
- ✅ Address object rendering fixed
- ✅ User null reference handled
- ✅ setState during render eliminated
- ✅ Navigation validation implemented
- ✅ Type safety improvements

---

### Module 7: Portfolio Module

#### 7.1 Agency Portfolio

**Focus**: Agency-owned inventory

**Key Metrics**:
- Total Portfolio Value
- Number of Properties
- Properties Under Offer
- Total Invested
- Expected Returns

#### 7.2 Investor Portfolio

**Focus**: Co-investment tracking

**Syndication Lifecycle**:
1. Property Acquisition
2. Capital Contribution
3. Property Management
4. Profit Distribution
5. Exit/Sale

---

### Module 8: Financials Module

**Entry Component**: `FinancialsHub.tsx`

**Sub-Modules**:
1. **General Ledger**: Double-entry bookkeeping, chart of accounts
2. **Bank Reconciliation**: Statement import, transaction matching
3. **Financial Reports**: 9 report templates (P&L, Balance Sheet, Cash Flow, etc.)
4. **Budgeting & Forecasting**: Budget creation, variance analysis
5. **Commission Tracker**: Auto calculation, payment tracking
6. **Expense Management**: Recording, categorization, approval workflow
7. **Revenue Analytics**: Revenue by source, trends, forecasting
8. **Payment Schedules**: Installment plans, payment tracking, reminders

---

## Data Flow Diagrams

### Primary Data Flow Pattern

```
User Action
    ↓
Component Event Handler
    ↓
Service Layer Function (/lib/*.ts)
    ↓
localStorage Operations
    ↓
Update Success/Error
    ↓
Toast Notification
    ↓
Component State Update
    ↓
UI Re-render
```

### Example: Create Property Flow

```
1. User clicks "Add Property" button
2. PropertiesWorkspaceV4 calls: onNavigate('add-property')
3. App.tsx updates: setCurrentView('add-property')
4. App.tsx renders: <PropertyFormV2 mode="create" />
5. User fills form and clicks "Save"
6. PropertyFormV2 validates data
7. PropertyFormV2 calls: addProperty(propertyData)
8. /lib/data.ts: addProperty() → localStorage
9. Success returned to PropertyFormV2
10. Show toast: "Property added successfully!"
11. PropertyFormV2 calls: onNavigate('properties')
12. App.tsx updates: setCurrentView('properties')
13. PropertiesWorkspaceV4 renders with new property
```

---

## Navigation Flow Architecture

### Navigation System Design

The application uses a **callback-based navigation system** where navigation state is managed in the root `App.tsx` component and navigation functions are passed down via props.

**Key Concepts**:
1. **Single Source of Truth**: `currentView` state in App.tsx
2. **Prop Drilling**: `onNavigate` callback passed to all components
3. **Context Preservation**: Navigation params stored for entity IDs
4. **Lazy Loading**: Components loaded on-demand

### Navigation Function Signature

```typescript
type NavigateFunction = (
  view: string,
  params?: Record<string, any>
) => void;

// Examples:
onNavigate('properties');
onNavigate('property-detail', { propertyId: '123' });
onNavigate('create-sell-cycle', { propertyId: '456', returnTo: 'properties' });
```

---

## Service Layer Connections

### Service Layer Architecture

All data operations go through a centralized service layer located in `/lib/` directory.

**Benefits**:
1. **Abstraction**: Components don't directly access localStorage
2. **Consistency**: Standard CRUD operations
3. **Validation**: Data validation before storage
4. **Error Handling**: Centralized error management

### Core Service Files

```
/lib/
├─ data.ts              # Main CRUD operations
├─ auth.ts              # Authentication service
├─ currency.ts          # PKR formatting
├─ ownership.ts         # Ownership transfer logic
├─ payment-schedule.ts  # Payment schedule operations
├─ stats.ts             # Statistics calculations
├─ validation.ts        # Data validation
├─ propertyMatching.ts  # Property matching algorithm
└─ saas.ts              # Multi-tenant operations
```

---

## State Management Patterns

### Local Component State

**Pattern**: useState for component-specific state

```typescript
export function PropertiesWorkspaceV4({ user, onNavigate }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({});
  const [sortOption, setSortOption] = useState<string>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
}
```

### Data Loading Pattern

**Pattern**: useEffect for data fetching

```typescript
export function PropertyDetailsV4({ propertyId, user }: Props) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    try {
      const data = getPropertyById(propertyId);
      setProperty(data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);
}
```

### Computed State Pattern

**Pattern**: useMemo for derived state

```typescript
const filteredProperties = useMemo(() => {
  let result = properties;
  
  if (searchQuery) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filters.status) {
    result = result.filter(p => filters.status.includes(p.status));
  }
  
  return sortProperties(result, sortOption);
}, [properties, searchQuery, filters, sortOption]);
```

---

## Component Dependencies Map

### Dependency Hierarchy

```
App.tsx (root)
│
├─ UI Components (/components/ui)
│  ├─ Button, Card, Dialog, Input, Select, Tabs, Table, Badge
│  └─ ... (18+ shadcn/ui components)
│
├─ Workspace Components (/components/workspace)
│  ├─ PageHeader, WorkspaceHeader, WorkspaceSearchBar
│  ├─ WorkspaceEmptyState, ConnectedEntitiesBar
│
├─ Layout Components (/components/layout)
│  ├─ MetricCard, StatusBadge, StatusTimeline, StatCard
│
├─ Dashboard Module (/components/dashboard)
│  ├─ DashboardV4, HeroSection, ActionCenter
│  ├─ QuickLaunch, PerformancePulse, IntelligencePanel
│
├─ Properties Module
│  ├─ PropertiesWorkspaceV4, PropertyDetailsV4
│  ├─ PropertyFormV2, PropertyCard
│
├─ Transactions Module
│  ├─ SellCyclesWorkspaceV4, SellCycleDetails
│  ├─ PurchaseCyclesWorkspaceV4, PurchaseCycleDetails
│  ├─ RentCyclesWorkspaceV4, RentCycleDetails
│
├─ Leads Module (/components/leads)
│  ├─ LeadsWorkspaceV4, LeadDetailsV4
│  ├─ CreateLeadModal, QualifyLeadModal
│  ├─ ConvertLeadModal, LeadInteractionModal
│
├─ Contacts Module (/components/contacts)
│  ├─ ContactsWorkspaceV4, ContactDetailsV4, ContactCard
│
├─ Requirements Module
│  ├─ BuyerRequirementsWorkspace, BuyerRequirementDetails
│  ├─ SendOfferToBuyerModal ✅ PRODUCTION-READY
│  ├─ RentRequirementsWorkspace, RentRequirementDetails
│
├─ Portfolio Module
│  ├─ AgencyPortfolioDashboard, InvestorManagement
│  ├─ InvestorPortfolioDashboard
│
├─ Financials Module
│  ├─ FinancialsHub, GeneralLedger, BankReconciliation
│  ├─ FinancialReports, BudgetingForecasting
│  ├─ CommissionTracker, ExpenseManagement
│
└─ Shared Components (/components/shared)
   ├─ Sidebar, ErrorBoundary, LoadingSpinner, EmptyState
```

---

## File Structure & Organization

### Complete File Tree

```
/aaraazi
├─ /public
│  └─ assets (images, icons)
│
├─ /src
│  ├─ App.tsx                    # Root component (~2,000 lines)
│  ├─ index.tsx                  # Entry point
│  ├─ index.css                  # Global styles
│  │
│  ├─ /components
│  │  ├─ /ui                     # Shadcn/ui base components (18+)
│  │  ├─ /workspace              # V4 Workspace components
│  │  ├─ /layout                 # V4 Layout components
│  │  ├─ /dashboard              # Dashboard V4 module
│  │  ├─ /contacts               # Contacts V4 module
│  │  ├─ /leads                  # Leads module
│  │  ├─ /deals                  # Deals module
│  │  ├─ /financials             # Financials module
│  │  ├─ /shared                 # Shared components
│  │  └─ Root-level components   # Flat structure (many components)
│  │
│  ├─ /lib                       # Service layer
│  │  ├─ data.ts                 # CRUD operations (~800 lines)
│  │  ├─ auth.ts                 # Authentication (~200 lines)
│  │  ├─ currency.ts             # PKR formatting (~100 lines)
│  │  ├─ propertyMatching.ts     # Matching algorithm (~300 lines)
│  │  └─ ... (more service files)
│  │
│  ├─ /types                     # TypeScript types
│  │  ├─ index.ts, property.ts, transaction.ts
│  │  ├─ lead.ts, contact.ts, requirement.ts
│  │  └─ financial.ts, user.ts
│  │
│  └─ /styles                    # Styling
│     └─ globals.css             # Design System V4.1 (~300 lines)
│
├─ /docs                         # Documentation (10+ files)
├─ Guidelines.md                 # Development guidelines
├─ package.json                  # Dependencies
├─ tsconfig.json                 # TypeScript config
└─ README.md                     # Project readme
```

### Component Size Breakdown

**Large Components (>500 lines)**:
- App.tsx: ~2,000 lines
- PropertyDetailsV4.tsx: ~800 lines
- SellCycleDetails.tsx: ~700 lines
- BuyerRequirementDetails.tsx: ~600 lines
- PropertiesWorkspaceV4.tsx: ~600 lines
- ContactDetailsV4.tsx: ~600 lines
- DashboardV4.tsx: ~500 lines
- PropertyFormV2.tsx: ~500 lines

---

## Summary

This document provides a complete technical architecture mapping of the aaraazi Agency Module, covering:

1. **Component Tree**: Full hierarchy from root to leaf components
2. **Module Integration**: How each module connects and communicates
3. **Data Flow**: How data moves through the application
4. **Navigation**: Callback-based routing system
5. **Service Layer**: Centralized data operations
6. **State Management**: Local state patterns and best practices
7. **Dependencies**: Component and service layer dependencies
8. **File Structure**: Complete project organization

For more detailed information on specific modules, refer to the other documentation files in the `/docs` directory.

---

**End of Document**
