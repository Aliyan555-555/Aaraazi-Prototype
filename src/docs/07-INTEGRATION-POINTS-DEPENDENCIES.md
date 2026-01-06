# EstateManager Agency Module - Integration Points & Dependencies

**Document Version**: 1.0  
**Last Updated**: December 22, 2024  
**Status**: Current Architecture

---

## Table of Contents

1. [Internal Integration Points](#internal-integration-points)
2. [Data Flow & Dependencies](#data-flow--dependencies)
3. [Component Dependencies](#component-dependencies)
4. [External Integration Opportunities](#external-integration-opportunities)
5. [Module Interoperability](#module-interoperability)

---

## Internal Integration Points

### 1. Property ↔ Transaction Integration

**Relationship**: One-to-Many (Property → Transactions)

```typescript
// Property stores transaction references
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
}

// Transaction references property
interface Transaction {
  id: string;
  propertyId: string;      // REQUIRED link
  type: 'sell' | 'purchase' | 'rent';
  buyerId?: string;
  sellerId?: string;
}
```

**Integration Points**:

1. **Property Detail Page → Start Transaction**
   ```
   PropertyDetailPage
   └─ Quick Actions
      ├─ "Start Sell Cycle" → Create sell transaction
      ├─ "Start Purchase Cycle" → Create purchase transaction
      └─ "Start Rent Cycle" → Create rent transaction
   
   Data Flow:
   Property.id → Transaction.propertyId
   Property.status → 'under-offer' (when transaction starts)
   ```

2. **Transaction Completion → Property Update**
   ```
   Transaction.status = 'completed'
   ├─ If Sell Cycle:
   │  ├─ Transfer ownership: Property.currentOwnerId = Transaction.buyerId
   │  ├─ Update status: Property.status = 'sold'
   │  └─ Add to history: Property.ownershipHistory.push(...)
   ├─ If Purchase Cycle:
   │  ├─ Transfer to agency: Property.currentOwnerId = null
   │  ├─ Update status: Property.status = 'available'
   │  └─ Add to history: Property.ownershipHistory.push(...)
   └─ If Rent Cycle:
      ├─ Set tenant: Property.tenantId = Transaction.tenantId
      └─ Update status: Property.status = 'rented'
   ```

3. **Transaction Detail → Property Navigation**
   ```
   TransactionDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create transaction from property
function startTransactionFromProperty(
  propertyId: string,
  type: TransactionType,
  userId: string
): Transaction {
  const property = getPropertyById(propertyId);
  
  const transaction: Transaction = {
    id: generateId(),
    propertyId: property.id,
    type,
    agentId: userId,
    stage: getInitialStage(type),
    status: 'active',
    // ... other fields
  };
  
  // Update property status
  updateProperty(propertyId, { status: 'under-offer' });
  
  // Link transaction to property
  property.transactions.push(transaction.id);
  updateProperty(propertyId, property);
  
  return createTransaction(transaction);
}

// Complete transaction and update property
function completeTransaction(transactionId: string): Result {
  const transaction = getTransactionById(transactionId);
  const property = getPropertyById(transaction.propertyId);
  
  if (transaction.type === 'sell') {
    transferOwnership(
      property.id,
      transaction.buyerId!,
      transaction.id,
      transaction.agreedPrice
    );
  } else if (transaction.type === 'purchase') {
    transferOwnership(
      property.id,
      null, // Agency ownership
      transaction.id,
      transaction.agreedPrice
    );
  }
  
  updateTransaction(transactionId, {
    status: 'completed',
    actualClosingDate: new Date().toISOString()
  });
  
  return { success: true };
}
```

---

### 2. Lead ↔ Transaction Integration

**Relationship**: One-to-One (Lead → Transaction conversion)

```typescript
// Lead stores interested properties
interface Lead {
  id: string;
  interestedProperties: string[];  // Property IDs
  convertedToClientId?: string;
  conversionTransactionId?: string;
  status: 'active' | 'converted' | 'lost';
}

// Transaction can originate from lead
interface Transaction {
  id: string;
  leadId?: string;  // Origin lead
  buyerId?: string; // Converted client
}
```

**Integration Points**:

1. **Lead Qualification → Property Interest**
   ```
   LeadDetailModal
   └─ Add Interested Property
      └─ Lead.interestedProperties.push(propertyId)
   
   PropertyDetailPage
   └─ Shows interested leads
      └─ Property.leadIds (derived from leads)
   ```

2. **Lead Conversion → Client + Transaction**
   ```
   Lead.stage = 'closed' (negotiation successful)
   ├─ Create Client from Lead
   │  ├─ Client.originLeadId = Lead.id
   │  ├─ Copy: name, phone, email
   │  └─ Type: based on Lead.type
   ├─ Create Transaction
   │  ├─ Transaction.leadId = Lead.id
   │  ├─ Transaction.buyerId = Client.id (if buyer)
   │  └─ Transaction.propertyId = interested property
   └─ Update Lead
      ├─ Lead.status = 'converted'
      ├─ Lead.convertedToClientId = Client.id
      └─ Lead.conversionTransactionId = Transaction.id
   ```

3. **Transaction → Lead Tracking**
   ```
   TransactionDetailModal
   └─ Shows origin lead (if exists)
      └─ Link back to Lead.id
   
   Conversion metrics calculated:
   - Lead conversion rate
   - Time from lead to conversion
   - Lead source effectiveness
   ```

**Key Service Functions**:
```typescript
function convertLeadToClient(
  leadId: string,
  transactionId: string
): { client: Client; success: boolean } {
  const lead = getLeadById(leadId);
  
  // Create client from lead
  const client: Client = {
    id: generateId(),
    workspaceId: lead.workspaceId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    type: [lead.type], // 'buyer', 'seller', etc.
    originLeadId: lead.id,
    source: lead.source,
    transactions: [transactionId],
    propertiesOwned: [],
    propertiesSold: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    // ...
  };
  
  saveClient(client);
  
  // Update lead
  updateLead(leadId, {
    status: 'converted',
    convertedToClientId: client.id,
    convertedDate: new Date().toISOString(),
    conversionTransactionId: transactionId
  });
  
  // Update transaction
  updateTransaction(transactionId, {
    buyerId: client.id, // or sellerId based on lead type
    leadId: lead.id
  });
  
  return { client, success: true };
}
```

---

### 3. Transaction ↔ Payment Schedule Integration

**Relationship**: One-to-One (Transaction → PaymentSchedule)

```typescript
// Transaction links to payment schedule
interface Transaction {
  id: string;
  paymentType: 'cash' | 'installment' | 'finance';
  paymentScheduleId?: string;  // Link to schedule
  agreedPrice: number;
}

// Payment schedule links to transaction
interface PaymentSchedule {
  id: string;
  transactionId: string;  // Parent transaction
  propertyId: string;
  clientId: string;
  instalments: Instalment[];
}
```

**Integration Points**:

1. **Transaction Creation → Payment Schedule**
   ```
   Create Transaction with paymentType = 'installment'
   ├─ Transaction created
   ├─ User clicks "Create Payment Schedule"
   └─ CreatePaymentScheduleModal opens
      ├─ Pre-filled from transaction:
      │  ├─ totalAmount = Transaction.agreedPrice
      │  ├─ clientId = Transaction.buyerId
      │  └─ propertyId = Transaction.propertyId
      ├─ User inputs:
      │  ├─ downPayment
      │  ├─ totalInstalments
      │  └─ instalmentFrequency
      └─ Generate instalments
         └─ Link: Transaction.paymentScheduleId = Schedule.id
   ```

2. **Payment Recording → Transaction Update**
   ```
   PaymentScheduleView
   └─ Record Payment on Instalment
      ├─ Update Instalment.paidAmount
      ├─ Update PaymentSchedule.paidAmount
      ├─ Check if all paid
      └─ If complete:
         └─ Enable "Complete Transaction" in Transaction flow
   ```

3. **Transaction Completion → Payment Validation**
   ```
   Complete Transaction (Ownership Transfer stage)
   ├─ Check if payment schedule exists
   ├─ If yes:
   │  ├─ Validate: PaymentSchedule.status = 'completed'
   │  └─ If not complete: Block completion
   └─ If cash: Allow immediate completion
   ```

**Key Service Functions**:
```typescript
function createPaymentScheduleFromTransaction(
  transactionId: string,
  scheduleData: PaymentScheduleInput
): PaymentSchedule {
  const transaction = getTransactionById(transactionId);
  
  const schedule: PaymentSchedule = {
    id: generateId(),
    transactionId: transaction.id,
    propertyId: transaction.propertyId,
    clientId: transaction.buyerId!,
    totalAmount: transaction.agreedPrice,
    downPayment: scheduleData.downPayment,
    totalInstalments: scheduleData.totalInstalments,
    instalmentAmount: calculateInstalmentAmount(
      transaction.agreedPrice - scheduleData.downPayment,
      scheduleData.totalInstalments
    ),
    instalments: generateInstalments(scheduleData),
    status: 'active',
    // ...
  };
  
  savePaymentSchedule(schedule);
  
  // Link to transaction
  updateTransaction(transactionId, {
    paymentScheduleId: schedule.id
  });
  
  return schedule;
}

function canCompleteTransaction(transactionId: string): boolean {
  const transaction = getTransactionById(transactionId);
  
  if (transaction.paymentType === 'cash') {
    return true; // Can complete immediately
  }
  
  if (transaction.paymentScheduleId) {
    const schedule = getPaymentSchedule(transaction.paymentScheduleId);
    return schedule.status === 'completed';
  }
  
  return false; // Has installments but no schedule created
}
```

---

### 4. Transaction ↔ Commission Integration

**Relationship**: One-to-One (Transaction → CommissionRecord)

```typescript
// Transaction generates commission
interface Transaction {
  id: string;
  agreedPrice: number;
  commissionAmount: number;
  commissionStatus: 'pending' | 'partial' | 'paid';
}

// Commission record links to transaction
interface CommissionRecord {
  id: string;
  transactionId: string;
  propertyId: string;
  agentId: string;
  commissionAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
}
```

**Integration Points**:

1. **Transaction Completion → Commission Creation**
   ```
   Transaction.status = 'completed'
   └─ calculateCommission()
      ├─ Get Property.commissionRate (default 2%)
      ├─ Calculate: Transaction.agreedPrice × (rate / 100)
      ├─ Create CommissionRecord
      │  ├─ transactionId
      │  ├─ agentId = Transaction.agentId
      │  ├─ commissionAmount
      │  └─ paymentStatus = 'pending'
      └─ Update Transaction.commissionAmount
   ```

2. **Commission Payment → Transaction Update**
   ```
   CommissionTracker
   └─ Record Commission Payment
      ├─ Update CommissionRecord.paidAmount
      ├─ Update CommissionRecord.paymentStatus
      └─ Update Transaction.commissionStatus
   ```

3. **Agent Performance → Commission Aggregation**
   ```
   Agent Performance Dashboard
   └─ Calculate total commissions
      ├─ Filter: CommissionRecord.agentId = currentAgent
      ├─ Sum: commissionAmount (all)
      ├─ Sum: paidAmount (paid)
      └─ Calculate: pendingAmount (unpaid)
   ```

**Key Service Functions**:
```typescript
function calculateAndCreateCommission(
  transactionId: string
): CommissionRecord {
  const transaction = getTransactionById(transactionId);
  const property = getPropertyById(transaction.propertyId);
  
  const commissionRate = property.commissionRate || 2; // Default 2%
  const commissionAmount = transaction.agreedPrice * (commissionRate / 100);
  
  const commissionRecord: CommissionRecord = {
    id: generateId(),
    module: 'commission-tracker',
    transactionId: transaction.id,
    propertyId: property.id,
    agentId: transaction.agentId,
    saleAmount: transaction.agreedPrice,
    commissionRate,
    commissionAmount,
    paidAmount: 0,
    pendingAmount: commissionAmount,
    paymentStatus: 'pending',
    type: 'income',
    date: new Date().toISOString(),
    // ...
  };
  
  saveFinancialRecord(commissionRecord);
  
  // Update transaction
  updateTransaction(transactionId, {
    commissionAmount,
    commissionStatus: 'pending'
  });
  
  // Update agent stats
  const agent = getUserById(transaction.agentId);
  updateUser(agent.id, {
    commissionEarned: (agent.commissionEarned || 0) + commissionAmount
  });
  
  return commissionRecord;
}
```

---

### 5. Property ↔ Investor Integration

**Relationship**: Many-to-Many (Property ↔ Investors)

```typescript
// Property has investor shares
interface Property {
  id: string;
  acquisitionType: 'inventory' | 'client-listing' | 'investor';
  investorShares?: InvestorShare[];
  totalInvestment?: number;
}

// Investor has investment records
interface Investor {
  id: string;
  activeInvestments: InvestmentRecord[];
  totalInvested: number;
  currentROI: number;
}

interface InvestorShare {
  investorId: string;
  sharePercentage: number;
  investmentAmount: number;
}

interface InvestmentRecord {
  id: string;
  propertyId: string;
  investmentAmount: number;
  sharePercentage: number;
  actualROI?: number;
}
```

**Integration Points**:

1. **Property Creation → Investor Assignment**
   ```
   Add Property (acquisitionType = 'investor')
   └─ Investor Setup Form
      ├─ Select investors
      ├─ Define share percentages
      ├─ Input investment amounts
      └─ Create Property.investorShares[]
         └─ Update Investor.activeInvestments[]
   ```

2. **Property Sale → ROI Distribution**
   ```
   Complete Sell Cycle for Investor Property
   ├─ Calculate total profit
   │  └─ salePrice - totalInvestment - costs
   ├─ Distribute by percentage
   │  └─ For each InvestorShare:
   │     ├─ investorProfit = totalProfit × sharePercentage
   │     ├─ investorROI = (investorProfit / investmentAmount) × 100
   │     └─ Update InvestmentRecord.actualROI
   └─ Move from activeInvestments to completedInvestments
   ```

3. **Investor Dashboard → Property View**
   ```
   InvestorPortfolioDashboard
   └─ Select Investor
      └─ Shows:
         ├─ Active Investments (InvestmentRecord[])
         │  └─ For each: Link to Property.id
         ├─ Total Invested
         ├─ Current Portfolio Value
         └─ Projected ROI
   ```

**Key Service Functions**:
```typescript
function createInvestorProperty(
  propertyData: PropertyInput,
  investorShares: InvestorShare[]
): Property {
  // Validate shares sum to 100%
  const totalShare = investorShares.reduce(
    (sum, share) => sum + share.sharePercentage, 0
  );
  if (totalShare !== 100) {
    throw new Error('Investor shares must total 100%');
  }
  
  const totalInvestment = investorShares.reduce(
    (sum, share) => sum + share.investmentAmount, 0
  );
  
  // Create property
  const property: Property = {
    ...propertyData,
    acquisitionType: 'investor',
    currentOwnerId: null, // Collectively owned
    investorShares,
    totalInvestment,
    status: 'available'
  };
  
  saveProperty(property);
  
  // Update each investor
  investorShares.forEach(share => {
    const investor = getInvestorById(share.investorId);
    
    const investmentRecord: InvestmentRecord = {
      id: generateId(),
      propertyId: property.id,
      propertyTitle: property.title,
      investmentAmount: share.investmentAmount,
      sharePercentage: share.sharePercentage,
      dateInvested: new Date().toISOString(),
      status: 'active',
      expectedROI: property.targetROI || 0
    };
    
    investor.activeInvestments.push(investmentRecord);
    investor.totalInvested += share.investmentAmount;
    investor.availableCapital -= share.investmentAmount;
    
    updateInvestor(investor.id, investor);
  });
  
  return property;
}

function distributeInvestorReturns(
  propertyId: string,
  salePrice: number
): InvestorReturn[] {
  const property = getPropertyById(propertyId);
  
  if (property.acquisitionType !== 'investor') {
    throw new Error('Not an investor property');
  }
  
  const totalCosts = calculatePropertyCosts(propertyId);
  const totalProfit = salePrice - property.totalInvestment! - totalCosts;
  
  const returns: InvestorReturn[] = property.investorShares!.map(share => {
    const investorProfit = totalProfit * (share.sharePercentage / 100);
    const totalReturn = share.investmentAmount + investorProfit;
    const roi = (investorProfit / share.investmentAmount) * 100;
    
    // Update investor record
    const investor = getInvestorById(share.investorId);
    const investmentIndex = investor.activeInvestments.findIndex(
      inv => inv.propertyId === propertyId
    );
    
    if (investmentIndex !== -1) {
      const investment = investor.activeInvestments[investmentIndex];
      investment.actualROI = roi;
      investment.totalReturned = totalReturn;
      investment.profitEarned = investorProfit;
      investment.status = 'exited';
      investment.dateExited = new Date().toISOString();
      
      // Move to completed investments
      investor.completedInvestments.push(investment);
      investor.activeInvestments.splice(investmentIndex, 1);
      
      // Update investor totals
      investor.totalReturned = (investor.totalReturned || 0) + totalReturn;
      investor.availableCapital += totalReturn;
      
      updateInvestor(investor.id, investor);
    }
    
    return {
      investorId: share.investorId,
      investorName: share.investorName,
      investmentAmount: share.investmentAmount,
      profitAmount: investorProfit,
      totalReturn,
      roi
    };
  });
  
  return returns;
}
```

---

## Data Flow & Dependencies

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│  ENTITY DEPENDENCY HIERARCHY                                 │
└─────────────────────────────────────────────────────────────┘

Level 0: Independent Entities (No dependencies)
├─ Workspace
├─ User
└─ Investor

Level 1: Primary Entities (Depend on Level 0)
├─ Property (depends on: Workspace, User/Agent)
├─ Lead (depends on: Workspace, User/Agent)
└─ Client (depends on: Workspace, User/Agent, Lead)

Level 2: Transaction Entities (Depend on Level 1)
├─ Transaction (depends on: Property, Client, Lead, User/Agent)
└─ Financial Records (depends on: Workspace, User)

Level 3: Derived Entities (Depend on Level 2)
├─ PaymentSchedule (depends on: Transaction, Property, Client)
├─ Instalment (depends on: PaymentSchedule)
├─ CommissionRecord (depends on: Transaction, Property, User/Agent)
└─ InvestmentRecord (depends on: Property, Investor)

Level 4: Audit & History (Embedded)
├─ OwnershipRecord (embedded in Property)
├─ Note (embedded in Lead/Client)
└─ Activity (embedded in Lead)
```

### Critical Data Flows

**1. Property Sale Flow**
```
Property (available)
   ↓
Lead (buyer interest)
   ↓
Transaction (sell) created
   │
   ├─ Property.status → 'under-offer'
   ├─ Transaction.propertyId ← Property.id
   └─ Transaction.leadId ← Lead.id
   ↓
Lead converted to Client
   │
   ├─ Client created (from Lead)
   ├─ Transaction.buyerId ← Client.id
   └─ Lead.status → 'converted'
   ↓
Payment Schedule created (if installments)
   │
   ├─ PaymentSchedule.transactionId ← Transaction.id
   ├─ Instalments generated
   └─ Transaction.paymentScheduleId ← PaymentSchedule.id
   ↓
Transaction progresses through stages
   ↓
Transaction completed
   │
   ├─ Property ownership transferred
   │  ├─ Property.currentOwnerId ← Client.id
   │  ├─ Property.status → 'sold'
   │  └─ ownershipHistory updated
   ├─ Commission calculated
   │  ├─ CommissionRecord created
   │  └─ Transaction.commissionAmount set
   └─ Transaction.status → 'completed'
```

**2. Agency Inventory Acquisition Flow**
```
Identify Property
   ↓
Create Property (acquisitionType = 'inventory')
   ↓
Create Purchase Transaction
   │
   ├─ Transaction.propertyId ← Property.id
   ├─ Transaction.type ← 'purchase'
   └─ Transaction.isPurchaseForResale ← true
   ↓
Payment Schedule created
   ↓
Transaction completed
   │
   ├─ Property.currentOwnerId ← null (agency)
   ├─ Property.status → 'available'
   ├─ ownershipHistory ← agency purchase record
   └─ Property ready for resale
   ↓
Start Sell Cycle (when buyer found)
```

**3. Investor Property Flow**
```
Identify Investment Opportunity
   ↓
Create Property (acquisitionType = 'investor')
   │
   └─ Property.investorShares[] populated
   ↓
Update Investors
   │
   ├─ For each InvestorShare:
   │  ├─ Investor.activeInvestments.push(InvestmentRecord)
   │  ├─ Investor.totalInvested += investmentAmount
   │  └─ Investor.availableCapital -= investmentAmount
   ↓
Create Purchase Transaction
   ↓
Transaction completed → Property acquired
   ↓
Property managed (rent/hold/sell)
   ↓
Property sold → Distribute returns
   │
   ├─ Calculate profit per investor
   ├─ Update InvestmentRecord.actualROI
   ├─ Move to completedInvestments
   └─ Return capital + profit to investors
```

---

## Component Dependencies

### Component Hierarchy

```
App.tsx
└─ WorkspacePage
   └─ AgencyWorkspace
      ├─ Dashboard
      │  ├─ StatsCards
      │  ├─ RecentActivity
      │  └─ QuickActions
      │
      ├─ PropertiesPage
      │  ├─ PropertyFilters
      │  ├─ PropertySearchBar
      │  ├─ PropertyCard (multiple)
      │  └─ PropertyDetailPage
      │     ├─ TransactionHeader
      │     ├─ PropertyConnectedCard
      │     ├─ ConnectedEntityCard
      │     └─ RelatedTransactions
      │
      ├─ Transactions
      │  ├─ SellCycleManagement
      │  │  ├─ TransactionHeader
      │  │  ├─ DealCard (multiple)
      │  │  └─ DealDetailModal
      │  │     ├─ TransactionHeader
      │  │     ├─ PropertyConnectedCard
      │  │     ├─ PaymentScheduleView
      │  │     └─ Documents
      │  │
      │  ├─ PurchaseCycleManagement
      │  │  └─ (similar structure)
      │  │
      │  └─ RentCycleManagement
      │     └─ (similar structure)
      │
      ├─ LeadsPage
      │  ├─ LeadCard (multiple)
      │  ├─ LeadDetailModal
      │  └─ ActivityLog
      │
      ├─ ClientsPage
      │  ├─ ClientCard (multiple)
      │  └─ ClientDetailModal
      │
      ├─ FinancialsHub
      │  ├─ CommissionTracker
      │  ├─ ExpenseManagement
      │  ├─ RevenueAnalytics
      │  ├─ ClientPayments
      │  │  ├─ CreatePaymentScheduleModal
      │  │  └─ PaymentScheduleView
      │  │     └─ InstalmentTable
      │  └─ (other financial modules)
      │
      └─ PortfolioManagement
         ├─ AgencyPortfolioDashboardEnhancedV2
         │  ├─ AcquisitionTracker
         │  ├─ InventoryManagementEnhancedV2
         │  └─ InvestmentAnalytics
         │
         └─ InvestorManagement
            ├─ InvestorManagementEnhancedV2
            ├─ InvestorPortfolioDashboard
            ├─ PropertyInvestmentTracking
            └─ InvestmentPerformanceAnalytics
```

### Shared Component Usage

**TransactionHeader** (used across multiple components):
```
Used in:
- PropertyDetailPage (when viewing property with active transaction)
- DealDetailModal (transaction detail view)
- SellCycleManagement (transaction cards)
- PurchaseCycleManagement (transaction cards)
- RentCycleManagement (transaction cards)

Receives:
- transaction: Transaction
- property: Property
- onNavigate: (view, params) => void

Provides:
- Consistent header across all transaction views
- Quick navigation to property/client
- Status badges
- Key metrics display
```

**ConnectedEntityCard** (used for related entities):
```
Used in:
- PropertyDetailPage (show leads, clients, transactions)
- DealDetailModal (show buyer, seller, property)
- LeadDetailModal (show interested properties)
- ClientDetailModal (show owned properties)

Receives:
- entity: Property | Lead | Client | Transaction
- entityType: string
- onNavigate: (view, params) => void

Provides:
- Visual card with entity summary
- Click to navigate to entity detail
- Relationship indicator
```

---

## External Integration Opportunities

### Current External Dependencies

**NPM Packages**:
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "lucide-react": "latest",
  "recharts": "latest",
  "sonner": "^2.0.3",
  "react-hook-form": "^7.55.0",
  "tailwindcss": "^4.0.0"
}
```

### Future Integration Points

#### 1. Payment Gateway Integration

**Pakistani Market**:
```typescript
interface PaymentGatewayIntegration {
  providers: ['JazzCash', 'EasyPaisa', 'Bank Transfer'];
  
  initiatePayment(amount: number, method: string): PaymentResponse;
  verifyPayment(transactionId: string): PaymentStatus;
  processRefund(transactionId: string, amount: number): RefundResponse;
}

// Usage in Payment Schedule
function recordPaymentWithGateway(
  instalmentId: string,
  amount: number,
  method: 'jazzcash' | 'easypaisa'
) {
  const paymentResponse = PaymentGateway.initiatePayment(amount, method);
  
  if (paymentResponse.success) {
    recordPayment(instalmentId, amount, paymentResponse.transactionId);
  }
}
```

#### 2. SMS/WhatsApp Integration

**Notifications**:
```typescript
interface MessagingService {
  sendSMS(phone: string, message: string): Promise<boolean>;
  sendWhatsApp(phone: string, template: string, params: any): Promise<boolean>;
}

// Usage for follow-up reminders
function sendFollowUpReminder(leadId: string) {
  const lead = getLeadById(leadId);
  const message = `Hi ${lead.name}, this is a reminder for your property viewing scheduled for tomorrow.`;
  
  MessagingService.sendWhatsApp(lead.phone, 'follow_up_reminder', {
    name: lead.name,
    date: lead.nextFollowUpDate
  });
}

// Usage for payment reminders
function sendPaymentReminder(instalmentId: string) {
  const instalment = getInstalmentById(instalmentId);
  const schedule = getPaymentSchedule(instalment.scheduleId);
  const client = getClientById(schedule.clientId);
  
  const message = `Payment reminder: PKR ${formatPKR(instalment.dueAmount)} due on ${instalment.dueDate}`;
  
  MessagingService.sendSMS(client.phone, message);
}
```

#### 3. Email Service Integration

```typescript
interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  sendTemplate(to: string, template: string, data: any): Promise<boolean>;
}

// Email templates
const emailTemplates = {
  property_viewing: {
    subject: 'Property Viewing Scheduled',
    template: 'viewing-confirmation.html'
  },
  payment_receipt: {
    subject: 'Payment Receipt',
    template: 'payment-receipt.html'
  },
  lease_agreement: {
    subject: 'Lease Agreement',
    template: 'lease-agreement.html'
  }
};

// Usage
function sendPaymentReceipt(instalmentId: string) {
  const instalment = getInstalmentById(instalmentId);
  const schedule = getPaymentSchedule(instalment.scheduleId);
  const client = getClientById(schedule.clientId);
  const property = getPropertyById(schedule.propertyId);
  
  EmailService.sendTemplate(client.email, 'payment_receipt', {
    clientName: client.name,
    propertyTitle: property.title,
    amount: instalment.paidAmount,
    date: instalment.paidDate,
    receiptNumber: instalment.receiptNumber
  });
}
```

#### 4. Maps & Location Services

```typescript
interface MapsService {
  geocodeAddress(address: string): Promise<Coordinates>;
  getDirections(from: string, to: string): Promise<Route>;
  getNearbyPlaces(location: Coordinates, type: string): Promise<Place[]>;
}

// Usage in property detail
function showPropertyOnMap(propertyId: string) {
  const property = getPropertyById(propertyId);
  const coordinates = await MapsService.geocodeAddress(property.address);
  
  // Show map with property marker
  displayMap(coordinates, {
    marker: {
      title: property.title,
      address: property.address
    },
    nearbyPlaces: ['schools', 'hospitals', 'shopping']
  });
}
```

#### 5. Document Storage (Cloud)

```typescript
interface DocumentStorage {
  uploadDocument(file: File, metadata: any): Promise<DocumentUrl>;
  getDocument(documentId: string): Promise<Blob>;
  deleteDocument(documentId: string): Promise<boolean>;
}

// Replace current base64 storage
function uploadPropertyImages(propertyId: string, images: File[]) {
  const uploadedUrls = await Promise.all(
    images.map(image => 
      DocumentStorage.uploadDocument(image, {
        entityType: 'property',
        entityId: propertyId,
        type: 'image'
      })
    )
  );
  
  updateProperty(propertyId, {
    images: uploadedUrls.map(u => u.url)
  });
}
```

#### 6. CRM Integration

```typescript
interface CRMIntegration {
  syncLead(lead: Lead): Promise<boolean>;
  syncClient(client: Client): Promise<boolean>;
  syncTransaction(transaction: Transaction): Promise<boolean>;
}

// Bi-directional sync
function syncWithCRM() {
  const leads = getAllLeads();
  const clients = getAllClients();
  
  leads.forEach(lead => CRMIntegration.syncLead(lead));
  clients.forEach(client => CRMIntegration.syncClient(client));
}
```

#### 7. Accounting Software Integration

```typescript
interface AccountingIntegration {
  syncInvoice(transaction: Transaction): Promise<boolean>;
  syncExpense(expense: ExpenseRecord): Promise<boolean>;
  syncCommission(commission: CommissionRecord): Promise<boolean>;
  getChartOfAccounts(): Promise<Account[]>;
}

// Sync financial records to QuickBooks
function syncFinancials() {
  const commissions = getAllCommissions();
  const expenses = getAllExpenses();
  
  commissions.forEach(c => AccountingIntegration.syncCommission(c));
  expenses.forEach(e => AccountingIntegration.syncExpense(e));
}
```

---

## Module Interoperability

### Agency Module ↔ Developer Module (Future)

**Shared Entities**:
```typescript
// Properties can be used by both modules
interface Property {
  workspaceId: string;
  moduleType: 'agency' | 'developer';  // NEW field
  // ... existing fields
}

// Clients can be shared
interface Client {
  workspaceId: string;
  sourceModule: 'agency' | 'developer' | 'both';  // NEW field
  // ... existing fields
}

// Financial records shared
interface FinancialRecord {
  workspaceId: string;
  sourceModule: 'agency' | 'developer';  // NEW field
  // ... existing fields
}
```

**Cross-module Workflows**:

1. **Developer sells to Agency**
   ```
   Developer Module:
   - Create Property (moduleType = 'developer')
   - Complete construction
   - Mark "Available for Sale"
   
   Agency Module:
   - View Developer Properties
   - Purchase for inventory
   - Create Purchase Transaction
   - Property.moduleType → 'agency'
   ```

2. **Agency refers client to Developer**
   ```
   Agency Module:
   - Lead interested in new construction
   - Create referral to Developer Module
   
   Developer Module:
   - Receive referred lead
   - Convert to developer client
   - Track referral commission
   
   Agency Module:
   - Receive referral commission
   ```

---

## Conclusion

The EstateManager Agency Module has **well-defined integration points** that enable:

✅ **Seamless data flow** between all entities  
✅ **Bidirectional navigation** across related records  
✅ **Automatic updates** cascading through dependencies  
✅ **Future-ready architecture** for external integrations  
✅ **Module interoperability** for Developer Module  

**Key Strengths**:
- Clear dependency hierarchy
- Robust data relationships
- Service layer abstraction
- External integration readiness

**Next Steps**:
- Implement external integrations (Phase 5+)
- Build Developer Module with shared foundation (Phase 8)
- Enhance with real-time features (Phase 6-7)

---

**Document Chain Complete**:
1. `01-SYSTEM-ARCHITECTURE-OVERVIEW.md` ✅
2. `02-DATA-MODEL-ENTITY-RELATIONSHIPS.md` ✅
3. `03-USER-ROLES-PERMISSIONS.md` ✅
4. `04-BUSINESS-FLOWS-WORKFLOWS.md` ✅
5. `05-MODULE-FEATURE-MAP.md` ✅
6. `06-DEVELOPMENT-STATUS-ROADMAP.md` ✅
7. `07-INTEGRATION-POINTS-DEPENDENCIES.md` ✅

**Final Document**: `00-DOCUMENTATION-INDEX.md` (Next)

