# EstateManager Agency Module - System Architecture Overview

**Document Version**: 1.0  
**Last Updated**: December 22, 2024  
**Status**: Current Production State

---

## Executive Summary

EstateManager is a comprehensive real estate management SaaS platform built for the Pakistani market, specifically optimized for Karachi real estate operations. The system follows a **multi-tenant architecture** with **modular access control** and supports both **real estate agencies** (Agency Module) and **property developers** (Developers Module - future).

### Current State
- **Agency Module**: ✅ Complete (100% functional)
- **Developers Module**: ⏳ Planned (not yet implemented)
- **Core Infrastructure**: ✅ Complete
- **Multi-tenant System**: ✅ Complete

---

## System Architecture

### Technology Stack

```
Frontend Framework:    React 18 + TypeScript (strict mode)
Styling:              Tailwind CSS v4.0
UI Components:        Shadcn/ui (customized)
State Management:     React Hooks + Context (local state)
Data Persistence:     localStorage (browser-based)
Routing:              Custom navigation system (onNavigate callbacks)
Form Management:      React Hook Form v7.55.0
Notifications:        Sonner toast system
Icons:                Lucide React
Charts:               Recharts
Date Handling:        Native JavaScript Date
Currency:             PKR (Pakistani Rupee) - custom formatting
```

### Architecture Pattern

**Pattern**: Modular Monolith with Multi-tenant Workspace Isolation

```
┌─────────────────────────────────────────────────────────────┐
│                     EstateManager SaaS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  SaaS Admin  │  │ Super Admin  │  │ Regular User │     │
│  │   (L1)       │  │   (L2)       │  │   (L3)       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│  ┌────────────────────────┴────────────────────────┐       │
│  │         Workspace (Tenant Container)            │       │
│  ├─────────────────────────────────────────────────┤       │
│  │                                                  │       │
│  │  ┌──────────────────┐  ┌──────────────────┐   │       │
│  │  │  Agency Module   │  │ Developer Module │   │       │
│  │  │   (Active)       │  │   (Future)       │   │       │
│  │  └────────┬─────────┘  └──────────────────┘   │       │
│  │           │                                     │       │
│  │  ┌────────▼─────────────────────────────────┐ │       │
│  │  │  Shared Core Components & Services       │ │       │
│  │  └──────────────────────────────────────────┘ │       │
│  └─────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Multi-Tenant Structure

### User Hierarchy

```
Level 1: SaaS Admin (Platform Owner)
├─ Full system access across all workspaces
├─ Can create/delete workspaces
├─ Can assign modules to workspaces
├─ System-wide analytics and billing
└─ User management across all tenants

Level 2: Super Admin (Workspace Owner)
├─ Full access within their workspace
├─ Can manage workspace users and roles
├─ Can configure workspace settings
├─ Access to all enabled modules
└─ Cannot access other workspaces

Level 3: Regular User (Agent/Staff)
├─ Access only to their workspace
├─ Role-based permissions (Admin/Agent)
├─ Data filtered by ownership and sharing
└─ Module access based on workspace subscription
```

### Workspace Isolation

Each workspace maintains complete data isolation:

```typescript
interface Workspace {
  id: string;
  name: string;
  ownerId: string;              // Super Admin user ID
  enabledModules: Module[];     // Purchased modules
  settings: WorkspaceSettings;
  createdAt: string;
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    modules: ('agency' | 'developer')[];
    status: 'active' | 'suspended' | 'cancelled';
  };
}
```

**Data Namespacing**:
```
localStorage key pattern: {workspaceId}_{dataType}

Examples:
- ws_abc123_properties
- ws_abc123_leads
- ws_abc123_transactions
- ws_abc123_users
```

---

## Agency Module Architecture

### Core Pillars

The Agency Module is built on **4 Core Pillars**:

```
1. PROPERTY MANAGEMENT (Asset-Centric)
   ├─ Properties (physical assets)
   ├─ Ownership tracking
   ├─ Re-listing workflow
   └─ Portfolio management

2. TRANSACTION MANAGEMENT (Deal-Centric)
   ├─ Sell Cycle (agency sells properties)
   ├─ Purchase Cycle (agency buys properties)
   ├─ Rent Cycle (leasing operations)
   └─ Transaction Trinity integration

3. CLIENT RELATIONSHIP (Lead-Centric)
   ├─ Lead pipeline management
   ├─ Client database
   ├─ Follow-up scheduling
   └─ Conversion tracking

4. FINANCIAL MANAGEMENT (Money-Centric)
   ├─ 8 specialized financial modules
   ├─ Payment schedules
   ├─ Commission tracking
   └─ Expense management
```

### Asset-Centric Model (Critical Design Pattern)

**Philosophy**: Properties are permanent assets, not temporary listings.

```
Traditional Model (Listing-Centric):
Property → Listed → Sold → [DELETED]
❌ Data lost after sale
❌ No ownership history
❌ Cannot track property lifecycle

EstateManager Model (Asset-Centric):
Property → Listed → Sold → Owned by Client → Re-Listed → Sold Again → ...
✅ Property record permanent
✅ Complete ownership history
✅ Full lifecycle tracking
✅ Transaction history preserved
```

**Implementation**:
```typescript
interface Property {
  // Core asset identity
  id: string;
  title: string;
  address: string;
  
  // Current state
  status: 'available' | 'under-offer' | 'sold' | 'rented';
  currentOwnerId?: string;        // Who owns it now
  
  // History tracking
  ownershipHistory: OwnershipRecord[];  // All past owners
  transactions: string[];                // All deals for this property
  
  // Lifecycle
  listedDate: string;
  lastSoldDate?: string;
  acquisitionType?: 'inventory' | 'client-listing';
}

interface OwnershipRecord {
  ownerId: string;
  ownerName: string;
  acquiredDate: string;
  soldDate?: string;
  transactionId?: string;        // Link to the deal
  acquisitionPrice?: number;
  salePrice?: number;
}
```

### Transaction Trinity Architecture

**Concept**: Unified experience across all transaction views with bidirectional navigation and context preservation.

```
┌─────────────────────────────────────────────────────┐
│           Transaction Trinity System                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Property Detail Page (Central Hub)                 │
│  ├─ Property info + Transaction Header              │
│  ├─ Related Transactions section                    │
│  ├─ Connected Entities (Leads, Owners, Agents)     │
│  └─ Quick actions (Start Sell/Purchase)            │
│                                                      │
│  Transaction Pages (Sell/Purchase/Rent Cycles)      │
│  ├─ Transaction Header (shared component)           │
│  ├─ Property Card with quick nav                    │
│  ├─ Deal stages and workflow                        │
│  └─ Related entity links                            │
│                                                      │
│  Deal Detail Modal                                   │
│  ├─ Transaction Header (shared component)           │
│  ├─ Property quick view                             │
│  ├─ Deal timeline and status                        │
│  └─ Bidirectional navigation                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Shared Components**:
- `TransactionHeader`: Unified header across all transaction views
- `PropertyConnectedCard`: Property info with quick navigation
- `ConnectedEntityCard`: Related leads, clients, agents
- Smart breadcrumbs with context preservation

---

## Data Architecture

### Core Entities

```
Primary Entities (Own tables):
├─ Properties (physical assets)
├─ Transactions (deals: sell/purchase/rent)
├─ Leads (potential clients)
├─ Clients (converted leads/buyers/sellers)
├─ Users (agents, admins)
├─ Investors (capital providers)
├─ Projects (development projects - future)
└─ Financial Records (8 module types)

Relationship Entities:
├─ PaymentSchedules (linked to transactions)
├─ Instalments (linked to schedules)
├─ OwnershipRecords (embedded in properties)
├─ Documents (linked to multiple entities)
└─ Tasks/Reminders (linked to leads/deals)
```

### Data Model Philosophy

1. **Normalization with Controlled Denormalization**
   - Primary data normalized (single source of truth)
   - Strategic denormalization for performance (cached names, IDs)
   - Update cascades handled in service layer

2. **Relationship Fields**
   - Properties contain `currentOwnerId`, `agentId`, `transactions[]`
   - Transactions contain `propertyId`, `buyerId`, `sellerId`, `agentId`
   - Leads contain `interestedProperties[]`, `agentId`
   - Enables bidirectional navigation

3. **History Preservation**
   - All entities keep audit trails
   - Soft deletes where appropriate
   - Ownership history embedded in properties
   - Transaction history linked but preserved

---

## Service Layer Architecture

### Service Organization

```
/lib/
├─ data.ts              # Core CRUD operations
├─ auth.ts              # Authentication service
├─ currency.ts          # PKR formatting
├─ ownership.ts         # Ownership transfer logic
├─ payment-schedule.ts  # Payment schedule service
├─ stats.ts             # Statistics calculations
└─ validation.ts        # Data validation
```

### Service Layer Principles

1. **Single Responsibility**: Each service handles one domain
2. **Transaction Safety**: Batch updates for consistency
3. **Error Handling**: All operations return success/error states
4. **Audit Trails**: Automatic tracking of changes
5. **Data Validation**: Input validation before persistence

**Example Service Pattern**:
```typescript
// Service function signature
export function transferOwnership(
  propertyId: string,
  newOwnerId: string,
  transactionId: string,
  salePrice: number
): { success: boolean; error?: string } {
  try {
    // 1. Validate inputs
    // 2. Get current data
    // 3. Create ownership record
    // 4. Update property
    // 5. Save to localStorage
    // 6. Return success
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Component Architecture

### Component Organization

```
/components/
├─ ui/                  # Base Shadcn components
├─ workspace/           # Workspace-level components
├─ agency/              # Agency module components
│   ├─ properties/
│   ├─ transactions/
│   ├─ leads/
│   ├─ financials/
│   └─ portfolio/
├─ shared/              # Shared across modules
└─ figma/               # System components
```

### Component Patterns

1. **Container/Presenter Pattern**
   - Containers handle data and business logic
   - Presenters handle UI rendering
   - Props passed down explicitly

2. **Composition over Inheritance**
   - Small, focused components
   - Composed into larger features
   - Shared components reused

3. **State Management**
   - Local state with useState
   - Side effects with useEffect
   - No global state management (yet)
   - Props drilling accepted for shallow trees

4. **Navigation Pattern**
   ```typescript
   // Parent component
   function WorkspacePage() {
     const [currentView, setCurrentView] = useState('dashboard');
     
     const handleNavigate = (view: string, params?: any) => {
       setCurrentView(view);
       // Handle params (property ID, etc.)
     };
     
     return <ComponentA onNavigate={handleNavigate} />;
   }
   ```

---

## Routing & Navigation

### Current Routing System

**Pattern**: State-based routing with callback propagation

```typescript
// Navigation hierarchy
App.tsx
└─ WorkspacePage
    └─ AgencyWorkspace
        ├─ Dashboard
        ├─ Properties
        │   └─ PropertyDetail
        ├─ Transactions
        │   ├─ SellCycleManagement
        │   ├─ PurchaseCycleManagement
        │   └─ RentCycleManagement
        ├─ Leads
        └─ Financials
```

**Navigation Params**:
```typescript
interface NavigationParams {
  view: string;
  subView?: string;
  entityId?: string;
  action?: string;
  returnTo?: string;
  [key: string]: any;
}

// Example navigations
onNavigate('properties', { subView: 'detail', propertyId: '123' });
onNavigate('sell-cycle', { transactionId: '456' });
onNavigate('financials', { subView: 'commissions' });
```

### Smart Breadcrumbs

Context-aware navigation breadcrumbs throughout the app:

```typescript
// Breadcrumb examples
Dashboard
Properties > Property Detail > "Modern Villa DHA"
Sell Cycle > Deal Detail > "Sale to Ahmed Khan"
Purchase Cycle > Property: "Apartment Clifton"
Leads > Lead Detail > "Fatima Ahmed"
```

---

## Performance Considerations

### Current Performance Profile

**Strengths**:
- ✅ Fast initial load (no backend API calls)
- ✅ Instant navigation (state-based routing)
- ✅ Responsive UI with optimistic updates
- ✅ Efficient localStorage operations

**Limitations**:
- ⚠️ localStorage size limits (~5-10MB)
- ⚠️ No data pagination (loads all records)
- ⚠️ No virtual scrolling for large lists
- ⚠️ Re-renders not fully optimized

### Optimization Strategies

1. **Data Loading**
   - Lazy load components (React.lazy)
   - Filter data early in service layer
   - Cache computed values (useMemo)

2. **Rendering**
   - React.memo for pure components
   - useCallback for stable function references
   - Proper key props in lists

3. **Storage**
   - Compress large text fields
   - Archive old data periodically
   - Implement data pruning strategies

---

## Security Model

### Current Security Implementation

**Authentication**: Basic localStorage-based session
```typescript
// Current session storage
interface UserSession {
  userId: string;
  workspaceId: string;
  role: 'saas-admin' | 'super-admin' | 'admin' | 'agent';
  token: string;  // Simple session token
  expiresAt: number;
}
```

**Authorization**: Role-based access control
```typescript
// Permission checking
function hasPermission(user: User, action: string, resource: string): boolean {
  if (user.role === 'saas-admin') return true;
  if (user.role === 'super-admin' && user.workspaceId === resource.workspaceId) return true;
  if (user.role === 'admin') return canAdminDoAction(action);
  if (user.role === 'agent') return canAgentDoAction(action, user, resource);
  return false;
}
```

**Data Filtering**: Automatic based on user role
```typescript
// Agent sees only their data + shared
function getFilteredProperties(user: User): Property[] {
  const all = getAllProperties();
  
  if (user.role === 'admin' || user.role === 'super-admin') {
    return all;  // See everything
  }
  
  if (user.role === 'agent') {
    return all.filter(p => 
      p.agentId === user.id ||        // Owned by agent
      p.sharedWith?.includes(user.id)  // Shared with agent
    );
  }
}
```

### Security Limitations

⚠️ **Current limitations** (acceptable for MVP, needs addressing for production):
- No encryption of localStorage data
- No password hashing
- No session timeout enforcement
- No audit logging
- No rate limiting
- No CSRF protection
- No XSS sanitization

---

## Deployment Model

### Current Deployment

**Type**: Static Web Application  
**Hosting**: Any static host (Netlify, Vercel, GitHub Pages)  
**Database**: Browser localStorage (client-side)  
**Build**: React production build

```bash
npm run build
# Output: /dist folder with static files
```

### Future Deployment Considerations

When moving to production:
1. Backend API (Node.js/Express or similar)
2. Real database (PostgreSQL, MongoDB)
3. Authentication service (Auth0, Firebase)
4. File storage (S3, Cloudinary)
5. CDN for assets
6. SSL/TLS certificates
7. Environment-based configuration

---

## Development Workflow

### Code Organization Principles

1. **Colocation**: Related files grouped together
2. **Separation of Concerns**: UI, logic, data separated
3. **Reusability**: Shared components extracted
4. **Type Safety**: TypeScript interfaces for all data
5. **Documentation**: JSDoc comments for complex logic

### File Naming Conventions

```
Components:     PascalCase (PropertyCard.tsx)
Utilities:      camelCase (currency.ts)
Types:          PascalCase (types/Property.ts)
Constants:      UPPER_SNAKE_CASE (MAX_FILE_SIZE)
Folders:        kebab-case (sell-cycle)
```

### Git Workflow (Recommended)

```
main          # Production-ready code
├─ develop    # Integration branch
   ├─ feature/agency-properties
   ├─ feature/payment-schedules
   └─ bugfix/transaction-navigation
```

---

## Integration Points

### Module Integration

Agency Module integrates with:
- **Core System**: Authentication, user management
- **Workspace**: Multi-tenant data isolation
- **Shared Components**: UI library, utilities
- **Future Modules**: Developer Module (planned)

### Data Integration

```
Properties ←→ Transactions
    ↓              ↓
Ownership      Payment Schedules
    ↓              ↓
History        Instalments

Leads → Clients → Transactions
          ↓
      Ownership

Agents → Properties, Leads, Transactions
```

### External Integration (Future)

Planned integrations:
- Payment gateways (JazzCash, EasyPaisa)
- SMS notifications (Twilio)
- Email service (SendGrid)
- Document storage (S3)
- Maps API (Google Maps)
- CRM systems
- Accounting software (QuickBooks)

---

## Scalability Considerations

### Current Limits

| Resource | Current Limit | Notes |
|----------|--------------|-------|
| Properties | ~1000 | localStorage limit |
| Transactions | ~2000 | Performance degradation |
| Leads | ~5000 | Filter performance |
| Users per workspace | ~50 | No hard limit |
| Concurrent users | N/A | Static site |
| File uploads | None | No file storage yet |

### Scale-Up Path

**Phase 1** (Current): localStorage + React
**Phase 2** (Next): Backend API + PostgreSQL
**Phase 3** (Future): Microservices + Redis cache
**Phase 4** (Growth): Multi-region + CDN

---

## Technology Debt & Limitations

### Known Technical Debt

1. **localStorage Dependency**
   - ⚠️ No server-side persistence
   - ⚠️ Data lost if browser cache cleared
   - ⚠️ No multi-device sync
   - ⚠️ Size limitations

2. **No Real-time Collaboration**
   - ⚠️ No multi-user editing
   - ⚠️ No conflict resolution
   - ⚠️ No presence indicators

3. **Limited Search**
   - ⚠️ Client-side filtering only
   - ⚠️ No full-text search
   - ⚠️ No fuzzy matching

4. **No File Uploads**
   - ⚠️ Base64 encoding only
   - ⚠️ No actual file storage
   - ⚠️ Size limitations

5. **Basic Reporting**
   - ⚠️ No export functionality
   - ⚠️ No advanced analytics
   - ⚠️ No custom reports

### Mitigation Strategies

All limitations are acceptable for current MVP stage. Migration path defined for production deployment.

---

## Conclusion

EstateManager's Agency Module represents a **complete, production-ready MVP** for a Pakistani real estate agency management system. The architecture supports:

✅ Multi-tenant isolation  
✅ Modular access control  
✅ Asset-centric property management  
✅ Comprehensive transaction tracking  
✅ Role-based permissions  
✅ Financial management  
✅ Portfolio tracking (agency + investor)  

**Next Steps**: See separate documents for detailed workflows, data models, and development roadmap.

---

**Document Chain**:
- Next: `02-DATA-MODEL-ENTITY-RELATIONSHIPS.md`
- Related: `03-USER-ROLES-PERMISSIONS.md`
- Related: `04-BUSINESS-FLOWS-WORKFLOWS.md`

