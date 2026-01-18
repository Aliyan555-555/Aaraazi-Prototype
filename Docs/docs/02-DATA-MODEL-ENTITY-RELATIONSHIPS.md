# EstateManager Agency Module - Data Model & Entity Relationships

**Document Version**: 3.0  
**Last Updated**: January 15, 2026  
**Status**: Phase 5 Complete - Production Schema with New Modules ⭐

---

## Version 3.0 Updates ⭐ NEW

**Major Changes**:
- ✅ Added Contact entity (V4 - replaces Client)
- ✅ Added BuyerRequirement entity (V4)
- ✅ Added RentRequirement entity (V4)
- ✅ Updated Lead entity with conversion fields
- ✅ Added ContactInteraction entity for relationship tracking
- ✅ Added FinancialTransaction entity for double-entry bookkeeping
- ✅ Updated all relationships to reflect V4 architecture
- ✅ Documented new data flows for requirements matching
- ✅ Added Intelligence Panel data structures
- ✅ **Added Task entity (Phase 5)** ⭐ NEW
- ✅ **Added CycleShare entity (Phase 5)** ⭐ NEW
- ✅ **Added PropertyMatch entity (Phase 5)** ⭐ NEW
- ✅ **Added CrossAgentOffer entity (Phase 5)** ⭐ NEW
- ✅ **Added Report/ReportSchedule entities (Phase 5)** ⭐ NEW
- ✅ **Total Entities: 18+ (up from 15)** ⭐

**Schema Stability**: All existing entities preserved, new entities added for Phase 5 features.

---

## Table of Contents

1. [Core Entity Schemas](#core-entity-schemas)
2. [V4 New Entities](#v4-new-entities)
3. [Phase 5 New Entities](#phase-5-new-entities) ⭐ NEW
4. [Relationship Mapping](#relationship-mapping)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Service Layer Functions](#service-layer-functions)
7. [localStorage Schema](#localstorage-schema)

---

## Core Entity Schemas

### 1. Property Entity

**Purpose**: Represents physical real estate assets (permanent records)

```typescript
interface Property {
  // Identity
  id: string;                    // UUID
  workspaceId: string;           // Multi-tenant isolation
  
  // Basic Information
  title: string;                 // e.g., "Modern Villa DHA Phase 6"
  description?: string;
  address: string;               // Full address
  city: string;                  // Default: "Karachi"
  area: string;                  // e.g., "DHA Phase 6", "Clifton"
  
  // Classification
  type: PropertyType;            // 'residential' | 'commercial' | 'plot' | 'agricultural'
  subType?: string;              // 'house' | 'apartment' | 'office' | 'shop' | etc.
  
  // Specifications
  size: number;                  // Numeric value
  sizeUnit: SizeUnit;            // 'sqft' | 'sqyd' | 'marla' | 'kanal' | 'acre'
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  features?: string[];           // ['Garden', 'Swimming Pool', 'Security', ...]
  
  // Financial
  price: number;                 // In PKR
  pricePerUnit?: number;         // Calculated: price / size
  
  // Ownership & Agency
  currentOwnerId?: string;       // Client ID (if sold) or null (if agency inventory)
  acquisitionType?: AcquisitionType;  // 'inventory' | 'client-listing' | 'investor'
  agentId: string;               // Responsible agent
  sharedWith?: string[];         // Other agents who can access
  
  // Status & Lifecycle
  status: PropertyStatus;        // 'available' | 'under-offer' | 'sold' | 'rented'
  listedDate: string;            // ISO date
  lastSoldDate?: string;
  
  // Ownership History (embedded)
  ownershipHistory: OwnershipRecord[];
  
  // Related Entities
  transactions: string[];        // Transaction IDs
  leadIds?: string[];           // Interested leads
  
  // Media
  images?: string[];             // Image URLs or base64
  documents?: string[];          // Document IDs
  
  // Commission
  commissionRate?: number;       // Percentage (default 2% for sales)
  commissionType?: 'percentage' | 'fixed';
  fixedCommission?: number;
  
  // Investor Properties (if acquisitionType === 'investor')
  investorShares?: InvestorShare[];
  totalInvestment?: number;
  targetROI?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;             // User ID
  isArchived?: boolean;
}

type PropertyType = 'residential' | 'commercial' | 'plot' | 'agricultural';
type SizeUnit = 'sqft' | 'sqyd' | 'marla' | 'kanal' | 'acre';
type PropertyStatus = 'available' | 'under-offer' | 'sold' | 'rented';
type AcquisitionType = 'inventory' | 'client-listing' | 'investor';

interface OwnershipRecord {
  ownerId: string;               // Client ID or 'agency'
  ownerName: string;
  ownerType: 'agency' | 'client' | 'investor-group';
  acquiredDate: string;
  soldDate?: string;
  acquisitionPrice?: number;
  salePrice?: number;
  transactionId?: string;        // Link to transaction
  transferredBy: string;         // Agent who processed
  notes?: string;
}

interface InvestorShare {
  investorId: string;
  investorName: string;
  sharePercentage: number;       // 0-100
  investmentAmount: number;
  dateInvested: string;
  expectedROI?: number;
  actualROI?: number;
  status: 'active' | 'exited';
}
```

**Key Design Decisions**:
- ✅ Property is a **permanent record** (never deleted)
- ✅ `currentOwnerId` tracks who owns it now
- ✅ `ownershipHistory` preserves all past owners
- ✅ `acquisitionType` determines property category
- ✅ `status` reflects listing state, not lifecycle end
- ✅ Can be sold and re-listed unlimited times

---

### 2. Transaction Entity

**Purpose**: Represents individual deals (buy, sell, rent)

```typescript
interface Transaction {
  // Identity
  id: string;
  workspaceId: string;
  
  // Classification
  type: TransactionType;         // 'sell' | 'purchase' | 'rent'
  dealType?: string;             // 'outright-sale' | 'installment' | 'lease'
  
  // Related Entities
  propertyId: string;            // REQUIRED: Property involved
  sellerId?: string;             // Client ID (who's selling)
  buyerId?: string;              // Client ID (who's buying)
  tenantId?: string;             // Client ID (for rent cycle)
  landlordId?: string;           // Client ID (for rent cycle)
  agentId: string;               // Agent handling the deal
  leadId?: string;               // Originating lead (if applicable)
  
  // Financial Terms
  agreedPrice: number;           // Final agreed price (PKR)
  paymentType: PaymentType;      // 'cash' | 'installment' | 'finance'
  downPayment?: number;
  totalInstallments?: number;
  installmentAmount?: number;
  
  // Rent-specific
  monthlyRent?: number;
  securityDeposit?: number;
  leasePeriodMonths?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  
  // Commission
  commissionAmount: number;      // Calculated commission (PKR)
  commissionRate?: number;       // Percentage used
  commissionStatus: CommissionStatus;  // 'pending' | 'partial' | 'paid'
  commissionPaidAmount?: number;
  
  // Deal Stage & Status
  stage: TransactionStage;       // Workflow stage
  status: TransactionStatus;     // 'active' | 'completed' | 'cancelled'
  
  // Payment Schedule
  paymentScheduleId?: string;    // Link to PaymentSchedule
  
  // Timeline
  initiatedDate: string;
  expectedClosingDate?: string;
  actualClosingDate?: string;
  
  // Purchase Cycle specific
  isPurchaseForResale?: boolean;      // Agency buying for inventory
  isPurchaseForInvestor?: boolean;    // Investor property
  targetResalePrice?: number;
  
  // Documents & Notes
  documents?: string[];
  notes?: string;
  internalNotes?: string;        // Agent-only notes
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type TransactionType = 'sell' | 'purchase' | 'rent';
type PaymentType = 'cash' | 'installment' | 'finance';

type TransactionStage = 
  // Sell Cycle
  | 'listed' | 'negotiation' | 'offer-accepted' | 'documentation' 
  | 'payment-processing' | 'ownership-transfer' | 'completed'
  // Purchase Cycle
  | 'property-search' | 'offer-submitted' | 'offer-accepted' 
  | 'due-diligence' | 'payment-processing' | 'ownership-transfer' | 'completed'
  // Rent Cycle
  | 'searching' | 'viewing' | 'application' | 'lease-signing'
  | 'payment-processing' | 'move-in' | 'active-lease' | 'lease-ending' | 'completed';

type TransactionStatus = 'active' | 'completed' | 'cancelled';
type CommissionStatus = 'pending' | 'partial' | 'paid';
```

**Key Design Decisions**:
- ✅ Unified transaction model for sell/purchase/rent
- ✅ Always linked to a property (propertyId required)
- ✅ Buyer and seller tracked separately
- ✅ Commission tracking built-in
- ✅ Stage-based workflow management
- ✅ Payment schedule linkage

---

### 3. Lead Entity

**Purpose**: Represents potential clients in the sales pipeline

```typescript
interface Lead {
  // Identity
  id: string;
  workspaceId: string;
  
  // Personal Information
  name: string;
  email?: string;
  phone: string;                 // Required for Pakistani market
  alternatePhone?: string;
  
  // Classification
  type: LeadType;               // 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor'
  source: LeadSource;           // 'website' | 'referral' | 'walk-in' | 'social-media' | ...
  
  // Intent
  interestedIn: string;         // 'buying' | 'selling' | 'renting' | 'investing'
  budget?: number;              // Maximum budget (PKR)
  preferredAreas?: string[];    // ['DHA', 'Clifton', ...]
  propertyTypes?: PropertyType[];
  
  // Related Properties
  interestedProperties: string[];  // Property IDs they've shown interest in
  
  // Pipeline Management
  stage: LeadStage;             // 5-stage pipeline
  status: LeadStatus;           // 'active' | 'converted' | 'lost' | 'archived'
  
  // Assignment
  agentId: string;              // Assigned agent
  sharedWith?: string[];        // Other agents
  
  // Follow-up
  lastContactDate?: string;
  nextFollowUpDate?: string;
  followUpPriority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Conversion
  convertedToClientId?: string;  // Client ID after conversion
  convertedDate?: string;
  conversionTransactionId?: string;
  
  // Communication History
  notes?: Note[];
  activityLog?: Activity[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type LeadType = 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor';
type LeadSource = 'website' | 'referral' | 'walk-in' | 'social-media' | 'advertisement' | 'other';
type LeadStage = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed';
type LeadStatus = 'active' | 'converted' | 'lost' | 'archived';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'property-viewing' | 'follow-up';
  description: string;
  date: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ 5-stage pipeline (New → Contacted → Qualified → Negotiation → Closed)
- ✅ Multiple property interests tracked
- ✅ Conversion to Client tracked
- ✅ Follow-up scheduling built-in
- ✅ Activity logging for audit trail

---

### 4. Contact Entity

**Purpose**: Represents actual clients (converted leads or direct clients)

```typescript
interface Contact {
  // Identity
  id: string;
  workspaceId: string;
  
  // Personal Information
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  cnic?: string;                // Pakistani national ID
  
  // Classification
  type: ContactType[];           // Can be multiple: ['buyer', 'seller', 'tenant']
  
  // Origin
  originLeadId?: string;        // If converted from lead
  source: string;               // How they became a client
  
  // Relationships
  propertiesOwned: string[];    // Property IDs they currently own
  propertiesSold: string[];     // Property IDs they've sold
  propertiesRented: string[];   // Property IDs they're renting
  
  transactions: string[];       // All transaction IDs
  
  // Financial
  totalTransactionValue: number; // Lifetime value
  commissionGenerated: number;   // Total commission from this client
  outstandingPayments?: number;
  
  // Status
  status: 'active' | 'inactive';
  lastTransactionDate?: string;
  
  // Assignment
  primaryAgentId: string;
  sharedWith?: string[];
  
  // Communication
  preferredContactMethod?: 'phone' | 'email' | 'whatsapp';
  notes?: Note[];
  
  // Documents
  documents?: string[];         // KYC, agreements, etc.
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type ContactType = 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor';
```

**Key Design Decisions**:
- ✅ Separate from leads (converted leads become clients)
- ✅ Can have multiple roles (buyer AND seller)
- ✅ Tracks all properties and transactions
- ✅ Lifetime value calculation
- ✅ CNIC field for Pakistani market

---

### 5. Investor Entity

**Purpose**: Represents investors who provide capital for property purchases

```typescript
interface Investor {
  // Identity
  id: string;
  workspaceId: string;
  
  // Personal Information
  name: string;
  email?: string;
  phone: string;
  cnic?: string;
  address?: string;
  
  // Investment Profile
  investorType: 'individual' | 'corporate' | 'partnership';
  investmentCapacity: number;    // Total capacity (PKR)
  availableCapital: number;      // Current available
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  
  // Portfolio
  activeInvestments: InvestmentRecord[];
  completedInvestments: InvestmentRecord[];
  totalInvested: number;
  totalReturned: number;
  currentROI: number;            // Percentage
  
  // Performance Metrics
  totalPropertiesInvested: number;
  averageInvestmentSize: number;
  totalProfitEarned: number;
  
  // Preferences
  preferredPropertyTypes?: PropertyType[];
  preferredAreas?: string[];
  minimumROI?: number;
  maximumInvestmentPeriod?: number;  // Months
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  
  // Assignment
  relationshipManagerId: string;  // Agent managing this investor
  
  // Communication
  notes?: Note[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface InvestmentRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  investmentAmount: number;
  sharePercentage: number;
  dateInvested: string;
  dateExited?: string;
  expectedROI: number;
  actualROI?: number;
  status: 'active' | 'exited' | 'partial-exit';
  totalReturned?: number;
  profitEarned?: number;
}
```

**Key Design Decisions**:
- ✅ Separate entity from clients
- ✅ Portfolio tracking built-in
- ✅ ROI calculation and monitoring
- ✅ Risk profile classification
- ✅ Active vs completed investments

---

### 6. PaymentSchedule Entity

**Purpose**: Represents installment payment plans for transactions

```typescript
interface PaymentSchedule {
  // Identity
  id: string;
  workspaceId: string;
  
  // Linkage
  transactionId: string;         // Parent transaction
  propertyId: string;            // Property involved
  clientId: string;              // Who's making payments
  
  // Schedule Details
  totalAmount: number;           // Total to be paid (PKR)
  paidAmount: number;            // Amount paid so far
  remainingAmount: number;       // Outstanding
  
  downPayment: number;
  downPaymentDate?: string;
  downPaymentStatus: PaymentStatus;
  
  totalInstalments: number;
  instalmentAmount: number;
  instalmentFrequency: InstalmentFrequency;  // 'monthly' | 'quarterly' | 'custom'
  
  startDate: string;
  endDate: string;
  
  // Instalments
  instalments: Instalment[];
  
  // Status
  status: ScheduleStatus;        // 'active' | 'completed' | 'defaulted' | 'cancelled'
  
  // Penalties & Charges
  lateFeePercentage?: number;
  totalLateFees: number;
  totalPenalties: number;
  
  // Performance Metrics
  onTimePayments: number;
  latePayments: number;
  missedPayments: number;
  nextDueDate?: string;
  nextDueAmount?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Instalment {
  id: string;
  instalmentNumber: number;      // 1, 2, 3, ...
  dueDate: string;
  dueAmount: number;
  paidAmount: number;
  paidDate?: string;
  status: PaymentStatus;         // 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
  lateFee?: number;
  penalty?: number;
  notes?: string;
  paymentMethod?: string;        // 'cash' | 'bank-transfer' | 'cheque'
  receiptNumber?: string;
}

type InstalmentFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'custom';
type ScheduleStatus = 'active' | 'completed' | 'defaulted' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived';
```

**Key Design Decisions**:
- ✅ Unified payment schedule system
- ✅ Tracks both down payment and instalments
- ✅ Performance metrics built-in
- ✅ Late fee and penalty tracking
- ✅ Individual instalment status

---

### 7. User Entity

**Purpose**: Represents users (agents, admins) in the system

```typescript
interface User {
  // Identity
  id: string;
  workspaceId: string;
  
  // Authentication
  email: string;
  passwordHash: string;          // (Currently not hashed - TODO)
  
  // Personal Information
  name: string;
  phone?: string;
  avatar?: string;
  
  // Authorization
  role: UserRole;                // 'saas-admin' | 'super-admin' | 'admin' | 'agent'
  
  // Agent-specific
  agentCode?: string;            // Unique agent identifier
  employeeId?: string;
  department?: string;
  joiningDate?: string;
  
  // Performance (for agents)
  propertiesManaged?: number;
  leadsManaged?: number;
  transactionsCompleted?: number;
  commissionEarned?: number;
  
  // Permissions
  permissions?: Permission[];
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  
  // Settings
  preferences?: UserPreferences;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

type UserRole = 'saas-admin' | 'super-admin' | 'admin' | 'agent';

interface Permission {
  module: string;               // 'properties' | 'leads' | 'transactions' | ...
  actions: PermissionAction[];  // ['view', 'create', 'edit', 'delete']
}

type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'share' | 'export';

interface UserPreferences {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}
```

**Key Design Decisions**:
- ✅ Role-based access control
- ✅ Agent performance tracking
- ✅ Granular permissions (future)
- ✅ User preferences

---

### 8. Financial Records (8 Module Types)

**Purpose**: Tracks various financial transactions across 8 modules

```typescript
// Base interface for all financial records
interface BaseFinancialRecord {
  id: string;
  workspaceId: string;
  module: FinancialModule;
  
  // Transaction Details
  date: string;
  amount: number;                // PKR
  type: 'income' | 'expense';
  category: string;
  description: string;
  
  // Related Entities
  relatedEntityType?: 'property' | 'transaction' | 'client' | 'agent';
  relatedEntityId?: string;
  
  // Payment Details
  paymentMethod?: string;
  receiptNumber?: string;
  invoiceNumber?: string;
  
  // Status
  status: 'pending' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type FinancialModule = 
  | 'commission-tracker'
  | 'expense-management'
  | 'revenue-analytics'
  | 'client-payments'
  | 'agent-payroll'
  | 'project-costs'
  | 'tax-calculator'
  | 'reports-export';

// Commission Record (extends base)
interface CommissionRecord extends BaseFinancialRecord {
  module: 'commission-tracker';
  transactionId: string;
  propertyId: string;
  agentId: string;
  commissionRate: number;
  saleAmount: number;
  commissionAmount: number;      // Calculated
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentDates?: string[];
}

// Expense Record
interface ExpenseRecord extends BaseFinancialRecord {
  module: 'expense-management';
  expenseCategory: 'office' | 'marketing' | 'salary' | 'utilities' | 'travel' | 'other';
  propertyId?: string;           // If property-specific expense
  projectId?: string;            // If project-specific expense
  isRecurring: boolean;
  recurrencePattern?: 'monthly' | 'quarterly' | 'annual';
  attachments?: string[];
  approvedBy?: string;
}

// Revenue Record
interface RevenueRecord extends BaseFinancialRecord {
  module: 'revenue-analytics';
  revenueSource: 'commission' | 'rental-income' | 'consulting' | 'other';
  transactionId?: string;
  propertyId?: string;
  clientId?: string;
  month: string;                 // YYYY-MM
  quarter: string;               // YYYY-Q1
  year: string;                  // YYYY
}
```

---

## V4 New Entities

### 1. BuyerRequirement Entity

**Purpose**: Represents the requirements of a buyer

```typescript
interface BuyerRequirement {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  contactId: string;             // Link to Contact entity
  agentId: string;               // Agent handling the requirement
  
  // Requirements
  budget: number;                // Maximum budget (PKR)
  preferredAreas: string[];      // ['DHA', 'Clifton', ...]
  propertyTypes: PropertyType[];
  sizeRange: { min: number, max: number };  // Size range in sqft
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  features?: string[];           // ['Garden', 'Swimming Pool', 'Security', ...]
  
  // Status
  status: 'active' | 'fulfilled' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks buyer requirements for matching properties
- ✅ Linked to Contact entity for client details
- ✅ Agent handling the requirement
- ✅ Status tracking for requirement lifecycle

---

### 2. RentRequirement Entity

**Purpose**: Represents the requirements of a tenant

```typescript
interface RentRequirement {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  contactId: string;             // Link to Contact entity
  agentId: string;               // Agent handling the requirement
  
  // Requirements
  budget: number;                // Maximum budget (PKR)
  preferredAreas: string[];      // ['DHA', 'Clifton', ...]
  propertyTypes: PropertyType[];
  sizeRange: { min: number, max: number };  // Size range in sqft
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  features?: string[];           // ['Garden', 'Swimming Pool', 'Security', ...]
  
  // Status
  status: 'active' | 'fulfilled' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks tenant requirements for matching properties
- ✅ Linked to Contact entity for client details
- ✅ Agent handling the requirement
- ✅ Status tracking for requirement lifecycle

---

### 3. ContactInteraction Entity

**Purpose**: Represents interactions between agents and contacts

```typescript
interface ContactInteraction {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  contactId: string;             // Link to Contact entity
  agentId: string;               // Agent handling the interaction
  
  // Interaction Details
  type: 'call' | 'email' | 'meeting' | 'property-viewing' | 'follow-up';
  description: string;
  date: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks interactions between agents and contacts
- ✅ Linked to Contact entity for client details
- ✅ Agent handling the interaction
- ✅ Type and description for interaction details

---

### 4. FinancialTransaction Entity

**Purpose**: Represents financial transactions for double-entry bookkeeping

```typescript
interface FinancialTransaction {
  // Identity
  id: string;
  workspaceId: string;
  
  // Transaction Details
  date: string;
  amount: number;                // PKR
  type: 'income' | 'expense';
  category: string;
  description: string;
  
  // Related Entities
  relatedEntityType?: 'property' | 'transaction' | 'client' | 'agent';
  relatedEntityId?: string;
  
  // Payment Details
  paymentMethod?: string;
  receiptNumber?: string;
  invoiceNumber?: string;
  
  // Status
  status: 'pending' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Represents financial transactions for double-entry bookkeeping
- ✅ Linked to related entities for context
- ✅ Payment details and status tracking
- ✅ Metadata for audit trail

---

## Phase 5 New Entities ⭐ NEW

### 1. Task Entity

**Purpose**: Represents tasks assigned to agents

```typescript
interface Task {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  agentId: string;               // Agent assigned to the task
  propertyId?: string;           // Property related to the task (optional)
  transactionId?: string;        // Transaction related to the task (optional)
  
  // Task Details
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Status
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks tasks assigned to agents
- ✅ Linked to properties and transactions for context
- ✅ Priority and due date for task management
- ✅ Status tracking for task lifecycle

---

### 2. CycleShare Entity

**Purpose**: Represents shared properties in a cycle

```typescript
interface CycleShare {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  propertyId: string;            // Property being shared
  agentId: string;               // Agent managing the share
  
  // Share Details
  shareType: 'rent' | 'sale';
  startDate: string;
  endDate: string;
  sharePercentage: number;       // 0-100
  shareAmount: number;           // PKR
  
  // Status
  status: 'active' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks shared properties in a cycle
- ✅ Linked to properties and agents for context
- ✅ Share type, dates, and amounts for management
- ✅ Status tracking for share lifecycle

---

### 3. PropertyMatch Entity

**Purpose**: Represents matched properties for requirements

```typescript
interface PropertyMatch {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  requirementId: string;         // Requirement being matched
  propertyId: string;            // Property matched
  
  // Match Details
  matchScore: number;            // 0-100
  matchReasons: string[];        // Reasons for match
  
  // Status
  status: 'active' | 'fulfilled' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks matched properties for requirements
- ✅ Linked to requirements and properties for context
- ✅ Match score and reasons for management
- ✅ Status tracking for match lifecycle

---

### 4. CrossAgentOffer Entity

**Purpose**: Represents offers made between agents

```typescript
interface CrossAgentOffer {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  offeringAgentId: string;       // Agent making the offer
  receivingAgentId: string;      // Agent receiving the offer
  propertyId: string;            // Property being offered
  
  // Offer Details
  offerType: 'rent' | 'sale';
  offerAmount: number;           // PKR
  offerDate: string;
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks offers made between agents
- ✅ Linked to agents and properties for context
- ✅ Offer type, amount, and date for management
- ✅ Status tracking for offer lifecycle

---

### 5. Report/ReportSchedule Entities

**Purpose**: Represents reports and their schedules

```typescript
interface Report {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  agentId: string;               // Agent generating the report
  propertyId?: string;           // Property related to the report (optional)
  transactionId?: string;        // Transaction related to the report (optional)
  
  // Report Details
  reportType: 'property' | 'transaction' | 'agent' | 'client' | 'investor';
  reportDate: string;
  reportContent: string;         // JSON or HTML content
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ReportSchedule {
  // Identity
  id: string;
  workspaceId: string;
  
  // Related Entities
  agentId: string;               // Agent generating the report
  propertyId?: string;           // Property related to the report (optional)
  transactionId?: string;        // Transaction related to the report (optional)
  
  // Schedule Details
  reportType: 'property' | 'transaction' | 'agent' | 'client' | 'investor';
  scheduleFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextRunDate: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

**Key Design Decisions**:
- ✅ Tracks reports and their schedules
- ✅ Linked to agents, properties, and transactions for context
- ✅ Report type, content, and schedule frequency for management
- ✅ Metadata for audit trail

---

## Relationship Mapping

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│  Workspace  │
└──────┬──────┘
       │
       │ owns
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Users   │   │Properties│   │  Leads   │   │ Clients  │   │Investors │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │              │              │
     │ manages      │ interested   │ converts     │ invests      │
     │              │ in           │ to           │ in           │
     │              │              │              │              │
     │              └──────┬───────┴──────┬───────┴──────────────┘
     │                     │              │
     │                     ▼              ▼
     │              ┌─────────────────────────┐
     │              │     Transactions        │
     │              └──────────┬──────────────┘
     │                         │
     │                         │ has
     │                         │
     │                         ▼
     │              ┌─────────────────────────┐
     │              │   Payment Schedules     │
     │              └──────────┬──────────────┘
     │                         │
     │                         │ contains
     │                         │
     │                         ▼
     │              ┌─────────────────────────┐
     │              │     Instalments         │
     │              └─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Financial Records      │
└─────────────────────────┘
```

### Relationship Details

#### 1. Property Relationships

```typescript
// Property → Ownership
Property.currentOwnerId → Client.id
Property.ownershipHistory[] → OwnershipRecord[]

// Property → Transactions
Property.transactions[] → Transaction.id[]
Transaction.propertyId → Property.id

// Property → Leads
Property.leadIds[] → Lead.id[]
Lead.interestedProperties[] → Property.id[]

// Property → Agents
Property.agentId → User.id
Property.sharedWith[] → User.id[]

// Property → Investors
Property.investorShares[] → InvestorShare[]
InvestorShare.investorId → Investor.id
```

#### 2. Transaction Relationships

```typescript
// Transaction → Property (1:1 required)
Transaction.propertyId → Property.id

// Transaction → Clients (many possible)
Transaction.buyerId → Client.id
Transaction.sellerId → Client.id
Transaction.tenantId → Client.id
Transaction.landlordId → Client.id

// Transaction → Lead (optional origin)
Transaction.leadId → Lead.id

// Transaction → Agent (1:1 required)
Transaction.agentId → User.id

// Transaction → Payment Schedule (1:1 optional)
Transaction.paymentScheduleId → PaymentSchedule.id
PaymentSchedule.transactionId → Transaction.id

// Transaction → Commission
CommissionRecord.transactionId → Transaction.id
```

#### 3. Lead Relationships

```typescript
// Lead → Properties (many-to-many)
Lead.interestedProperties[] → Property.id[]

// Lead → Agent (1:1)
Lead.agentId → User.id
Lead.sharedWith[] → User.id[]

// Lead → Client (conversion)
Lead.convertedToClientId → Client.id
Lead.conversionTransactionId → Transaction.id
```

#### 4. Client Relationships

```typescript
// Client → Properties (many-to-many)
Client.propertiesOwned[] → Property.id[]
Client.propertiesSold[] → Property.id[]
Client.propertiesRented[] → Property.id[]

// Client → Transactions (1:many)
Client.transactions[] → Transaction.id[]

// Client → Lead (origin)
Client.originLeadId → Lead.id

// Client → Agent
Client.primaryAgentId → User.id
Client.sharedWith[] → User.id[]

// Client → Payment Schedules
PaymentSchedule.clientId → Client.id
```

#### 5. Investor Relationships

```typescript
// Investor → Properties (many-to-many through shares)
Property.investorShares[] → InvestorShare[]
InvestorShare.investorId → Investor.id

// Investor → Investment Records
Investor.activeInvestments[] → InvestmentRecord[]
InvestmentRecord.propertyId → Property.id

// Investor → Agent (relationship manager)
Investor.relationshipManagerId → User.id
```

---

## Data Flow Diagrams

### 1. Sell Cycle Flow

```
Property (Available) → Lead (Buyer Interest) → Transaction (Sell)
                                    ↓
                          Lead Converted to Client
                                    ↓
                         Transaction Progresses Stages
                                    ↓
                          Payment Schedule Created
                                    ↓
                           Payments Received
                                    ↓
                         Ownership Transferred
                                    ↓
            Property.currentOwnerId = Client.id
            Property.status = 'sold'
            Property.ownershipHistory.push(newRecord)
                                    ↓
                         Commission Calculated
                                    ↓
                    Transaction Status = 'completed'
```

### 2. Purchase Cycle Flow

```
Property Search → Offer Submitted → Transaction (Purchase)
                                          ↓
                        ┌─────────────────┴─────────────────┐
                        │                                   │
                  isPurchaseForResale               isPurchaseForInvestor
                        │                                   │
                        ▼                                   ▼
            acquisitionType = 'inventory'      acquisitionType = 'investor'
            currentOwnerId = null              investorShares[] populated
            status = 'available'               currentOwnerId = null
                        │                                   │
                        └─────────────────┬─────────────────┘
                                          │
                                          ▼
                              Payment Schedule Created
                                          ↓
                                 Payments Made
                                          ↓
                              Ownership Transferred
                                          ▼
                Property.ownershipHistory.push(agencyRecord)
```

### 3. Re-listing Flow

```
Property (Sold to Client)
  status = 'sold'
  currentOwnerId = Client.id
         ↓
Agency Wants to Re-list
         ↓
Start Purchase Cycle (Buy Back)
         ↓
Transaction (Purchase from Client)
  type = 'purchase'
  sellerId = Client.id
  buyerId = null (agency)
  isPurchaseForResale = true
         ↓
Complete Purchase
         ↓
Ownership Transferred Back
  Property.currentOwnerId = null
  Property.acquisitionType = 'inventory'
  Property.status = 'available'
  Property.ownershipHistory.push(agencyRepurchase)
         ↓
Property Available for Resale
```

### 4. Lead Conversion Flow

```
Lead Created
  stage = 'new'
  status = 'active'
         ↓
Lead Progresses
  stage: new → contacted → qualified → negotiation
         ↓
Lead Qualified
  interestedProperties[] populated
         ↓
Transaction Started
  Transaction.leadId = Lead.id
         ↓
Lead Converted
  Lead.status = 'converted'
  Lead.convertedToClientId = newClient.id
  Lead.convertedDate = today
  Lead.conversionTransactionId = Transaction.id
         ↓
Client Created
  Client.originLeadId = Lead.id
  Client.transactions[] = [Transaction.id]
```

### 5. Payment Schedule Flow

```
Transaction Created
  paymentType = 'installment'
         ↓
Payment Schedule Created
  PaymentSchedule.transactionId = Transaction.id
  totalAmount = Transaction.agreedPrice
  downPayment = specified
         ↓
Instalments Generated
  for i = 1 to totalInstalments:
    Instalment {
      instalmentNumber = i
      dueDate = calculated
      dueAmount = calculated
      status = 'pending'
    }
         ↓
Payment Received
  Instalment.paidAmount += payment
  Instalment.paidDate = today
  Instalment.status = 'paid' | 'partial'
  PaymentSchedule.paidAmount += payment
  PaymentSchedule.remainingAmount -= payment
         ↓
All Paid?
  Yes → PaymentSchedule.status = 'completed'
  No  → Continue
```

---

## Service Layer Functions

### Property Services (`/lib/data.ts`, `/lib/ownership.ts`)

```typescript
// CRUD Operations
getProperties(workspaceId: string, filters?: PropertyFilters): Property[]
getPropertyById(id: string): Property | null
createProperty(property: Omit<Property, 'id' | 'createdAt'>): Property
updateProperty(id: string, updates: Partial<Property>): boolean
deleteProperty(id: string): boolean  // Soft delete (isArchived = true)

// Ownership Operations
transferOwnership(
  propertyId: string,
  newOwnerId: string,
  transactionId: string,
  salePrice: number
): { success: boolean; error?: string }

getOwnershipHistory(propertyId: string): OwnershipRecord[]

// Portfolio Queries
getAgencyInventory(workspaceId: string): Property[]  // acquisitionType = 'inventory'
getClientListings(workspaceId: string): Property[]   // acquisitionType = 'client-listing'
getInvestorProperties(workspaceId: string): Property[]  // acquisitionType = 'investor'
getRelistableProperties(workspaceId: string): Property[]  // status = 'sold', can buy back

// Agent Filtering
getPropertiesByAgent(agentId: string): Property[]
getSharedProperties(agentId: string): Property[]
```

### Transaction Services

```typescript
// CRUD
getTransactions(workspaceId: string, filters?: TransactionFilters): Transaction[]
getTransactionById(id: string): Transaction | null
createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction
updateTransaction(id: string, updates: Partial<Transaction>): boolean

// Workflow
advanceTransactionStage(id: string, newStage: TransactionStage): boolean
completeTransaction(id: string): { success: boolean; error?: string }
cancelTransaction(id: string, reason: string): boolean

// Queries
getTransactionsByProperty(propertyId: string): Transaction[]
getTransactionsByClient(clientId: string): Transaction[]
getTransactionsByAgent(agentId: string): Transaction[]
getActiveTransactions(workspaceId: string): Transaction[]
```

### Lead Services

```typescript
// CRUD
getLeads(workspaceId: string, filters?: LeadFilters): Lead[]
createLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead
updateLead(id: string, updates: Partial<Lead>): boolean

// Pipeline
advanceLeadStage(id: string, newStage: LeadStage): boolean
convertLead(leadId: string, transactionId: string): { client: Client; success: boolean }

// Queries
getLeadsByStage(stage: LeadStage): Lead[]
getLeadsByAgent(agentId: string): Lead[]
getHotLeads(workspaceId: string): Lead[]  // Priority leads
```

### Payment Schedule Services (`/lib/payment-schedule.ts`)

```typescript
// CRUD
createPaymentSchedule(schedule: Omit<PaymentSchedule, 'id'>): PaymentSchedule
getPaymentSchedule(id: string): PaymentSchedule | null
getPaymentScheduleByTransaction(transactionId: string): PaymentSchedule | null

// Instalment Management
generateInstalments(
  totalAmount: number,
  frequency: InstalmentFrequency,
  startDate: string,
  count: number
): Instalment[]

recordPayment(
  scheduleId: string,
  instalmentId: string,
  amount: number,
  paymentDate: string
): { success: boolean; error?: string }

// Queries
getOverdueInstalments(workspaceId: string): Instalment[]
getUpcomingPayments(workspaceId: string, daysAhead: number): Instalment[]
calculateLateFees(instalment: Instalment, lateFeeRate: number): number
```

### Financial Services

```typescript
// Commission
calculateCommission(transaction: Transaction, property: Property): number
recordCommission(transaction: Transaction): CommissionRecord
getUnpaidCommissions(workspaceId: string): CommissionRecord[]
getAgentCommissions(agentId: string): CommissionRecord[]

// Revenue
calculateMonthlyRevenue(workspaceId: string, month: string): number
getRevenueBySource(workspaceId: string): RevenueBreakdown
getYearToDateRevenue(workspaceId: string): number

// Expenses
recordExpense(expense: ExpenseRecord): boolean
getExpensesByCategory(category: string): ExpenseRecord[]
getMonthlyExpenses(month: string): number
```

---

## localStorage Schema

### Storage Keys

```typescript
// Multi-tenant pattern: {workspaceId}_{dataType}

const STORAGE_KEYS = {
  // Core entities
  properties: (workspaceId: string) => `${workspaceId}_properties`,
  transactions: (workspaceId: string) => `${workspaceId}_transactions`,
  leads: (workspaceId: string) => `${workspaceId}_leads`,
  clients: (workspaceId: string) => `${workspaceId}_clients`,
  investors: (workspaceId: string) => `${workspaceId}_investors`,
  users: (workspaceId: string) => `${workspaceId}_users`,
  
  // Financial
  paymentSchedules: (workspaceId: string) => `${workspaceId}_payment_schedules`,
  financialRecords: (workspaceId: string) => `${workspaceId}_financial_records`,
  
  // System
  workspaces: 'em_workspaces',
  currentSession: 'em_current_session',
};
```

### Data Persistence Pattern

```typescript
// Save to localStorage
function saveData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
    // Handle quota exceeded error
  }
}

// Load from localStorage
function loadData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load data:', error);
    return [];
  }
}

// Update single entity
function updateEntity<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): boolean {
  const data = loadData<T>(key);
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
  saveData(key, data);
  return true;
}
```

---

## Data Migration Strategy

### Version Management

```typescript
interface DataVersion {
  version: string;  // Semantic versioning
  migrationDate: string;
  changes: string[];
}

const CURRENT_SCHEMA_VERSION = '3.0.0';
```

### Migration Functions

```typescript
function migrateData(fromVersion: string, toVersion: string): void {
  // Example: Adding new fields
  if (fromVersion === '2.0.0' && toVersion === '3.0.0') {
    // Add acquisitionType to all properties
    const properties = loadData<Property>('properties');
    properties.forEach(p => {
      if (!p.acquisitionType) {
        p.acquisitionType = p.currentOwnerId ? 'client-listing' : 'inventory';
      }
    });
    saveData('properties', properties);
  }
}
```

---

## Conclusion

This data model provides a **comprehensive, flexible, and scalable** foundation for the EstateManager Agency Module. Key strengths:

✅ Asset-centric property management  
✅ Complete transaction lifecycle tracking  
✅ Ownership history preservation  
✅ Flexible payment schedules  
✅ Multi-role support (agents, admins, investors)  
✅ Audit trail for compliance  
✅ Pakistani market-specific features  

**Next Document**: `03-USER-ROLES-PERMISSIONS.md`