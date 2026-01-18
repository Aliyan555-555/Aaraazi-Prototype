# EstateManager Agency Module - User Roles & Permissions

**Document Version**: 3.0  
**Last Updated**: January 15, 2026  
**Status**: Phase 5 Complete - All Permissions Documented ⭐

---

## Version 3.0 Updates ⭐ NEW

**Major Changes**:
- ✅ Updated permissions for Contacts/Clients V4 module
- ✅ Added permissions for Buyer Requirements module
- ✅ Added permissions for Rent Requirements module
- ✅ Updated permissions for Dashboard V4 features
- ✅ Added permissions for Financial Reports module
- ✅ Added permissions for Bank Reconciliation module
- ✅ Clarified role-based access for all V4 features
- ✅ Updated data access control patterns for V4
- ✅ **Added permissions for Tasks Module (Phase 5)** ⭐ NEW
- ✅ **Added permissions for Reports Module (Phase 5)** ⭐ NEW
- ✅ **Added permissions for Sharing System (Phase 5)** ⭐ NEW
- ✅ **Added cross-agent collaboration permissions (Phase 5)** ⭐ NEW
- ✅ **Total Permission Categories: 13+ (up from 10)** ⭐

**Role Stability**: All existing roles preserved, permissions expanded for Phase 5 features.

---

## Table of Contents

1. [User Hierarchy](#user-hierarchy)
2. [Role Definitions](#role-definitions)
3. [Permission Matrix](#permission-matrix)
4. [V4 Module Permissions](#v4-module-permissions)
5. **[Phase 5 Module Permissions](#phase-5-module-permissions)** ⭐ NEW
6. [Data Access Control](#data-access-control)
7. [Role-Specific Features](#role-specific-features)
8. [Implementation Details](#implementation-details)

---

## User Hierarchy

### Three-Tier User System

```
┌─────────────────────────────────────────────────────────────┐
│                    LEVEL 1: SaaS Admin                       │
│              (Platform Owner / System Administrator)         │
├─────────────────────────────────────────────────────────────┤
│  Access Scope: ALL WORKSPACES                                │
│  Typical Users: Platform developers, system administrators   │
│  Count: 1-3 users typically                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ creates & manages
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  LEVEL 2: Super Admin                        │
│                    (Workspace Owner)                         │
├─────────────────────────────────────────────────────────────┤
│  Access Scope: SINGLE WORKSPACE (their own)                  │
│  Typical Users: Agency owner, business owner                 │
│  Count: 1 per workspace                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ manages
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   LEVEL 3: Regular Users                     │
│                  (Admins & Agents)                           │
├─────────────────────────────────────────────────────────────┤
│  Access Scope: SINGLE WORKSPACE                              │
│  Typical Users: Office managers, real estate agents          │
│  Count: 1-100+ per workspace                                 │
│                                                              │
│  ┌──────────────────────┐  ┌───────────────────────┐       │
│  │   Admin Role         │  │   Agent Role          │       │
│  │   (Management)       │  │   (Field Operations)  │       │
│  └──────────────────────┘  └───────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Role Definitions

### 1. SaaS Admin (Level 1)

**Purpose**: Platform-level administration and system management

**Responsibilities**:
- Create and manage workspaces
- Assign modules to workspaces (Agency Module, Developer Module)
- Monitor system-wide performance and usage
- Handle billing and subscription management
- Manage global system settings
- Access all data across all workspaces for support purposes

**Key Characteristics**:
- ✅ Cross-workspace access
- �� System configuration
- ✅ Billing management
- ✅ Module assignment
- ✅ Full administrative privileges

**Typical Use Cases**:
- "Create a new workspace for ABC Real Estate"
- "Upgrade XYZ Agency to Professional plan"
- "Investigate reported bug across all workspaces"
- "Enable Developer Module for a workspace"

**User Interface**:
```
SaaS Admin Dashboard
├─ Workspaces Management
│  ├─ Create New Workspace
│  ├─ View All Workspaces
│  ├─ Assign Modules
│  └─ Suspend/Activate Workspaces
├─ Billing & Subscriptions
│  ├─ View All Subscriptions
│  ├─ Process Payments
│  └─ Manage Plans
├─ System Settings
└─ Analytics (Cross-workspace)
```

---

### 2. Super Admin (Level 2)

**Purpose**: Workspace-level ownership and management

**Responsibilities**:
- Manage all users within their workspace
- Configure workspace settings and branding
- Access all data within their workspace (no restrictions)
- Create and manage admin and agent users
- View comprehensive analytics and reports
- Configure commission structures and business rules
- Make final decisions on all workspace operations

**Key Characteristics**:
- ✅ Full access within workspace
- ✅ User management (create/edit/delete)
- ✅ Settings configuration
- ✅ Financial oversight
- ❌ Cannot access other workspaces
- ❌ Cannot change module subscription (requires SaaS Admin)

**Typical Use Cases**:
- "Add new agent to the team"
- "Configure commission rates for sales"
- "View company-wide performance metrics"
- "Manage workspace branding and settings"
- "Assign properties between agents"

**User Interface**:
```
Super Admin Dashboard
├─ Complete Agency Workspace Access
├─ User Management
│  ├─ Create/Edit/Delete Users
│  ├─ Assign Roles
│  └─ View User Performance
├─ Workspace Settings
│  ├─ Commission Configuration
│  ├─ Branding
│  └─ Business Rules
├─ All Properties (unrestricted)
├─ All Transactions (unrestricted)
├─ All Leads (unrestricted)
├─ Complete Financial Access
└─ Advanced Analytics
```

---

### 3. Admin User (Level 3 - Admin Role)

**Purpose**: Operational management and oversight

**Responsibilities**:
- Manage day-to-day operations
- View all properties, leads, and transactions in workspace
- Assign leads and properties to agents
- Approve and manage transactions
- Generate reports and analytics
- Manage client relationships
- Cannot create/delete users (only Super Admin can)

**Key Characteristics**:
- ✅ View all workspace data
- ✅ Manage all entities (properties, leads, transactions)
- ✅ Assign work to agents
- ✅ Generate reports
- ❌ Cannot manage users
- ❌ Cannot change workspace settings

**Typical Use Cases**:
- "Assign new lead to best-performing agent"
- "View all active transactions across the team"
- "Generate monthly performance report"
- "Manage property inventory across all agents"
- "Oversee commission payments"

**User Interface**:
```
Admin Dashboard
├─ Agency Workspace (Full Access)
│  ├─ All Properties
│  ├─ All Leads
│  ├─ All Transactions
│  └─ All Clients
├─ Team Management
│  ├─ View Agent Performance
│  ├─ Assign Leads
│  └─ Reassign Properties
├─ Financial Management (View + Edit)
└─ Reports & Analytics
```

---

### 4. Agent User (Level 3 - Agent Role)

**Purpose**: Field operations and client-facing work

**Responsibilities**:
- Manage assigned properties and leads
- Handle client interactions and viewings
- Progress deals through transaction stages
- Record client communications
- Update property and lead information
- View only their own data (+ shared items)

**Key Characteristics**:
- ✅ Full control over assigned properties
- ✅ Full control over assigned leads
- ✅ Manage own transactions
- ✅ View own performance metrics
- ❌ Cannot see other agents' data (unless shared)
- ❌ Cannot reassign properties/leads
- ❌ Limited financial access (own commissions only)

**Typical Use Cases**:
- "Add new property to my portfolio"
- "Update lead status after client meeting"
- "Record property viewing"
- "Progress sale through stages"
- "View my commission earnings"

**User Interface**:
```
Agent Dashboard
├─ My Properties
│  ├─ Assigned to Me
│  └─ Shared with Me
├─ My Leads
│  ├─ Active Pipeline
│  └─ Follow-ups
├─ My Transactions
│  ├─ Active Deals
│  └─ Completed Deals
├─ My Performance
│  ├─ Sales This Month
│  ├─ Commission Earned
│  └─ Lead Conversion Rate
└─ My Commissions (View Only)
```

---

## Permission Matrix

### Core Entity Permissions

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Properties** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |
| **Leads** |
| View All | ✅ | ✅ | ✅ | ❌ |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Convert to Client | ✅ | ✅ | ✅ | ✅ |
| **Transactions** |
| View All | ✅ | ✅ | ✅ | ❌ |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Cancel | ✅ | ✅ | ✅ | ❌ |
| Complete | ✅ | ✅ | ✅ | ✅ |
| **Clients** |
| View All | ✅ | ✅ | ✅ | ❌ |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| **Investors** |
| View All | ✅ | ✅ | ✅ | ❌ |
| View Assigned | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Edit All | ✅ | ✅ | ✅ | ❌ |
| Manage Portfolio | ✅ | ✅ | ✅ | ✅ (assigned) |
| **Financials** |
| View All Records | ✅ | ✅ | ✅ | ❌ |
| View Own Commissions | ✅ | ✅ | ✅ | ✅ |
| Create Expense | ✅ | ✅ | ✅ | ❌ |
| Approve Expense | ✅ | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ (own only) |
| Export Data | ✅ | ✅ | ✅ | ❌ |
| **Users & Settings** |
| View All Users | ✅ | ✅ | ✅ | ✅ (directory) |
| Create User | ✅ | ✅ | ❌ | ❌ |
| Edit User | ✅ | ✅ | ❌ | ❌ (own profile) |
| Delete User | ✅ | ✅ | ❌ | ❌ |
| Change Workspace Settings | ✅ | ✅ | ❌ | ❌ |
| Configure Commissions | ✅ | ✅ | ❌ | ❌ |

---

## V4 Module Permissions

### Contacts/Clients V4 Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Contacts/Clients** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ |  | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Buyer Requirements Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Buyer Requirements** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Rent Requirements Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Rent Requirements** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Dashboard V4 Features

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Dashboard V4** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Financial Reports Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Financial Reports** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Bank Reconciliation Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Bank Reconciliation** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

---

## Phase 5 Module Permissions ⭐ NEW

### Tasks Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Tasks** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Reports Module

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Reports** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Sharing System

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Sharing System** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

### Cross-Agent Collaboration

| Entity | SaaS Admin | Super Admin | Admin | Agent |
|--------|-----------|-------------|-------|-------|
| **Cross-Agent Collaboration** |
| View All | ✅ | ✅ | ✅ | ❌ (own only) |
| View Own | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ✅ |
| Edit All | ✅ | ✅ | ✅ | ❌ (own only) |
| Edit Own | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ✅ | ✅ | ❌ |
| Assign/Reassign | ✅ | ✅ | ✅ | ❌ |
| Share | ✅ | ✅ | ✅ | ✅ |

---

## Data Access Control

### Filtering Logic

#### Properties

```typescript
function getFilteredProperties(user: User): Property[] {
  const allProperties = loadData<Property>('properties');
  
  // SaaS Admin: All properties across all workspaces
  if (user.role === 'saas-admin') {
    return allProperties;
  }
  
  // Filter by workspace first
  const workspaceProperties = allProperties.filter(
    p => p.workspaceId === user.workspaceId
  );
  
  // Super Admin & Admin: All properties in workspace
  if (user.role === 'super-admin' || user.role === 'admin') {
    return workspaceProperties;
  }
  
  // Agent: Only their properties + shared
  if (user.role === 'agent') {
    return workspaceProperties.filter(p =>
      p.agentId === user.id ||                    // Assigned to agent
      p.sharedWith?.includes(user.id) ||          // Shared with agent
      p.createdBy === user.id                     // Created by agent
    );
  }
  
  return [];
}
```

#### Leads

```typescript
function getFilteredLeads(user: User): Lead[] {
  const allLeads = loadData<Lead>('leads');
  
  if (user.role === 'saas-admin') {
    return allLeads;
  }
  
  const workspaceLeads = allLeads.filter(
    l => l.workspaceId === user.workspaceId
  );
  
  if (user.role === 'super-admin' || user.role === 'admin') {
    return workspaceLeads;
  }
  
  if (user.role === 'agent') {
    return workspaceLeads.filter(l =>
      l.agentId === user.id ||
      l.sharedWith?.includes(user.id) ||
      l.createdBy === user.id
    );
  }
  
  return [];
}
```

#### Transactions

```typescript
function getFilteredTransactions(user: User): Transaction[] {
  const allTransactions = loadData<Transaction>('transactions');
  
  if (user.role === 'saas-admin') {
    return allTransactions;
  }
  
  const workspaceTransactions = allTransactions.filter(
    t => t.workspaceId === user.workspaceId
  );
  
  if (user.role === 'super-admin' || user.role === 'admin') {
    return workspaceTransactions;
  }
  
  if (user.role === 'agent') {
    return workspaceTransactions.filter(t =>
      t.agentId === user.id ||              // Agent handling the deal
      t.createdBy === user.id               // Agent created the transaction
    );
  }
  
  return [];
}
```

#### Financial Records

```typescript
function getFilteredFinancialRecords(user: User): FinancialRecord[] {
  const allRecords = loadData<FinancialRecord>('financialRecords');
  
  if (user.role === 'saas-admin') {
    return allRecords;
  }
  
  const workspaceRecords = allRecords.filter(
    r => r.workspaceId === user.workspaceId
  );
  
  if (user.role === 'super-admin' || user.role === 'admin') {
    return workspaceRecords;
  }
  
  if (user.role === 'agent') {
    // Agents see only their commission records
    return workspaceRecords.filter(r =>
      r.module === 'commission-tracker' &&
      r.agentId === user.id
    );
  }
  
  return [];
}
```

---

## Role-Specific Features

### SaaS Admin Exclusive Features

```typescript
interface SaaSAdminFeatures {
  // Workspace Management
  createWorkspace(name: string, ownerId: string): Workspace;
  deleteWorkspace(workspaceId: string): boolean;
  suspendWorkspace(workspaceId: string, reason: string): boolean;
  assignModules(workspaceId: string, modules: Module[]): boolean;
  
  // Cross-workspace Analytics
  getSystemWideMetrics(): SystemMetrics;
  getAllWorkspaces(): Workspace[];
  getWorkspaceUsage(workspaceId: string): UsageMetrics;
  
  // Billing
  manageSubscription(workspaceId: string, plan: SubscriptionPlan): boolean;
  processBilling(workspaceId: string, amount: number): boolean;
  
  // System Settings
  configureSystemSettings(settings: SystemSettings): boolean;
  managePlatformUsers(): void;
}
```

**UI Components**:
- Workspace Management Dashboard
- System-wide Analytics
- Billing & Subscriptions Module
- Platform Settings
- Multi-workspace Search

---

### Super Admin Exclusive Features

```typescript
interface SuperAdminFeatures {
  // User Management
  createUser(user: Omit<User, 'id'>): User;
  updateUser(userId: string, updates: Partial<User>): boolean;
  deleteUser(userId: string): boolean;
  assignRole(userId: string, role: UserRole): boolean;
  
  // Workspace Configuration
  updateWorkspaceSettings(settings: WorkspaceSettings): boolean;
  configureCommissionRates(rates: CommissionConfig): boolean;
  manageBranding(branding: BrandingConfig): boolean;
  
  // Data Management
  bulkReassignProperties(fromAgentId: string, toAgentId: string): boolean;
  bulkReassignLeads(fromAgentId: string, toAgentId: string): boolean;
  archiveOldData(beforeDate: string): boolean;
  
  // Advanced Analytics
  getWorkspaceAnalytics(): WorkspaceAnalytics;
  getAgentPerformanceComparison(): AgentMetrics[];
  exportAllData(): ExportResult;
}
```

**UI Components**:
- User Management Interface
- Workspace Settings Panel
- Commission Configuration
- Bulk Operations Tools
- Advanced Reports & Analytics

---

### Admin Role Exclusive Features

```typescript
interface AdminFeatures {
  // Team Management
  viewAllAgents(): User[];
  getAgentPerformance(agentId: string): PerformanceMetrics;
  reassignProperty(propertyId: string, newAgentId: string): boolean;
  reassignLead(leadId: string, newAgentId: string): boolean;
  
  // Operations
  viewAllWorkspaceData(): WorkspaceData;
  generateReports(type: ReportType): Report;
  approveTransaction(transactionId: string): boolean;
  
  // Financial Oversight
  viewAllCommissions(): CommissionRecord[];
  approveExpenses(expenseId: string): boolean;
  reconcilePayments(): ReconciliationReport;
}
```

**UI Components**:
- Team Performance Dashboard
- All Properties/Leads/Transactions View
- Assignment & Reassignment Tools
- Financial Overview
- Reporting Interface

---

### Agent Role Features

```typescript
interface AgentFeatures {
  // Portfolio Management
  getMyProperties(): Property[];
  getMyLeads(): Lead[];
  getMyTransactions(): Transaction[];
  
  // Daily Operations
  addProperty(property: Property): boolean;
  updateLead(leadId: string, updates: Partial<Lead>): boolean;
  progressTransaction(transactionId: string, stage: TransactionStage): boolean;
  recordActivity(leadId: string, activity: Activity): boolean;
  
  // Performance
  getMyPerformance(): AgentPerformance;
  getMyCommissions(): CommissionRecord[];
  getMyTargets(): TargetMetrics;
  
  // Collaboration
  shareProperty(propertyId: string, withAgentId: string): boolean;
  requestAssistance(propertyId: string, message: string): boolean;
}
```

**UI Components**:
- My Dashboard (Personalized)
- My Properties/Leads/Transactions
- Activity Logger
- Personal Performance Metrics
- Commission Tracker

---

## Permission Checking Implementation

### Authorization Helper Functions

```typescript
// Check if user can view an entity
function canView(user: User, entity: any, entityType: string): boolean {
  // SaaS Admin can view everything
  if (user.role === 'saas-admin') return true;
  
  // Check workspace match
  if (entity.workspaceId !== user.workspaceId) return false;
  
  // Super Admin and Admin can view all in workspace
  if (user.role === 'super-admin' || user.role === 'admin') return true;
  
  // Agent can view their own + shared
  if (user.role === 'agent') {
    return (
      entity.agentId === user.id ||
      entity.createdBy === user.id ||
      entity.sharedWith?.includes(user.id)
    );
  }
  
  return false;
}

// Check if user can edit an entity
function canEdit(user: User, entity: any, entityType: string): boolean {
  if (!canView(user, entity, entityType)) return false;
  
  // SaaS Admin and Super Admin can edit anything in workspace
  if (user.role === 'saas-admin' || user.role === 'super-admin') return true;
  
  // Admin can edit most things
  if (user.role === 'admin') {
    // Except user management
    if (entityType === 'user') return false;
    return true;
  }
  
  // Agent can only edit their own
  if (user.role === 'agent') {
    return entity.agentId === user.id || entity.createdBy === user.id;
  }
  
  return false;
}

// Check if user can delete an entity
function canDelete(user: User, entity: any, entityType: string): boolean {
  if (!canEdit(user, entity, entityType)) return false;
  
  // Only Super Admin and Admin can delete
  if (user.role === 'super-admin' || user.role === 'admin') return true;
  
  // Agents cannot delete
  return false;
}

// Check if user can perform specific action
function hasPermission(user: User, action: string, resource: string): boolean {
  const permissionMap: Record<string, string[]> = {
    'saas-admin': ['*'],  // All permissions
    'super-admin': ['view-all', 'edit-all', 'delete-all', 'manage-users', 'configure-workspace'],
    'admin': ['view-all', 'edit-all', 'delete-all', 'generate-reports'],
    'agent': ['view-own', 'edit-own', 'create', 'share'],
  };
  
  const userPermissions = permissionMap[user.role] || [];
  
  if (userPermissions.includes('*')) return true;
  if (userPermissions.includes(action)) return true;
  
  return false;
}
```

### UI Conditional Rendering

```typescript
// Example: Conditional rendering based on role
function PropertyCard({ property, user }: Props) {
  const canEditProperty = canEdit(user, property, 'property');
  const canDeleteProperty = canDelete(user, property, 'property');
  const canReassign = user.role === 'admin' || user.role === 'super-admin';
  
  return (
    <div className="property-card">
      <h3>{property.title}</h3>
      <p>{formatPKR(property.price)}</p>
      
      {/* View button - everyone who can see the card can click */}
      <Button onClick={() => viewProperty(property.id)}>
        View Details
      </Button>
      
      {/* Edit button - only if can edit */}
      {canEditProperty && (
        <Button onClick={() => editProperty(property.id)}>
          Edit
        </Button>
      )}
      
      {/* Delete button - only if can delete */}
      {canDeleteProperty && (
        <Button variant="destructive" onClick={() => deleteProperty(property.id)}>
          Delete
        </Button>
      )}
      
      {/* Reassign button - only for admins */}
      {canReassign && (
        <Button onClick={() => reassignProperty(property.id)}>
          Reassign Agent
        </Button>
      )}
    </div>
  );
}
```

---

## Role-Based Navigation

### Dashboard Views by Role

#### SaaS Admin Dashboard
```typescript
const saasAdminMenu = [
  { label: 'Workspaces', icon: Building, view: 'workspaces' },
  { label: 'Billing', icon: CreditCard, view: 'billing' },
  { label: 'Analytics', icon: BarChart, view: 'system-analytics' },
  { label: 'Settings', icon: Settings, view: 'system-settings' },
  { label: 'Support', icon: HelpCircle, view: 'support' },
];
```

#### Super Admin Dashboard
```typescript
const superAdminMenu = [
  { label: 'Dashboard', icon: Home, view: 'dashboard' },
  { label: 'Properties', icon: Building, view: 'properties' },
  { label: 'Leads', icon: Users, view: 'leads' },
  { label: 'Transactions', icon: FileText, view: 'transactions' },
  { label: 'Financials', icon: DollarSign, view: 'financials' },
  { label: 'Team', icon: Users, view: 'team-management' },
  { label: 'Investors', icon: TrendingUp, view: 'investors' },
  { label: 'Reports', icon: BarChart, view: 'reports' },
  { label: 'Settings', icon: Settings, view: 'workspace-settings' },
];
```

#### Admin Dashboard
```typescript
const adminMenu = [
  { label: 'Dashboard', icon: Home, view: 'dashboard' },
  { label: 'Properties', icon: Building, view: 'properties' },
  { label: 'Leads', icon: Users, view: 'leads' },
  { label: 'Transactions', icon: FileText, view: 'transactions' },
  { label: 'Financials', icon: DollarSign, view: 'financials' },
  { label: 'Team', icon: Users, view: 'team-performance' },
  { label: 'Investors', icon: TrendingUp, view: 'investors' },
  { label: 'Reports', icon: BarChart, view: 'reports' },
];
```

#### Agent Dashboard
```typescript
const agentMenu = [
  { label: 'My Dashboard', icon: Home, view: 'dashboard' },
  { label: 'My Properties', icon: Building, view: 'my-properties' },
  { label: 'My Leads', icon: Users, view: 'my-leads' },
  { label: 'My Deals', icon: FileText, view: 'my-transactions' },
  { label: 'My Performance', icon: TrendingUp, view: 'my-performance' },
  { label: 'My Commissions', icon: DollarSign, view: 'my-commissions' },
];
```

---

## Future Enhancements

### Planned Permission Features

1. **Granular Permissions**
   ```typescript
   interface Permission {
     module: string;
     entity: string;
     actions: ('create' | 'read' | 'update' | 'delete' | 'share' | 'export')[];
     conditions?: PermissionCondition[];
   }
   
   interface PermissionCondition {
     field: string;
     operator: 'equals' | 'contains' | 'greater_than';
     value: any;
   }
   ```

2. **Custom Roles**
   - Allow Super Admin to create custom roles
   - Mix-and-match permissions
   - Role templates

3. **Field-Level Permissions**
   - Hide specific fields based on role
   - Sensitive data masking
   - Conditional field editing

4. **Time-Based Permissions**
   - Temporary access grants
   - Scheduled permission changes
   - Access expiration

5. **Audit Logging**
   - Track all permission checks
   - Log denied access attempts
   - Permission change history

---

## Conclusion

The EstateManager role-based permission system provides:

✅ **Clear hierarchy** (4 distinct roles)  
✅ **Workspace isolation** (multi-tenant security)  
✅ **Flexible access control** (view/edit/delete permissions)  
✅ **Agent privacy** (agents see only their data)  
✅ **Admin oversight** (admins see everything in workspace)  
✅ **Platform control** (SaaS admin manages system)  

**Next Document**: `04-BUSINESS-FLOWS-WORKFLOWS.md`