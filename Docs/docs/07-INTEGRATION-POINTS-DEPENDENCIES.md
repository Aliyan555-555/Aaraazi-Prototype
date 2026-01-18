# EstateManager Agency Module - Integration Points & Dependencies

**Document Version**: 3.0  
**Last Updated**: January 15, 2026  
**Status**: Phase 5 Complete - All Integrations Documented ⭐

---

## Version 3.0 Updates ⭐ NEW

**Major Changes**:
- ✅ Added Lead → Contact conversion integration
- ✅ Added Buyer Requirements → Property matching integration
- ✅ Added Rent Requirements → Property matching integration
- ✅ Added Dashboard V4 data aggregation integrations
- ✅ Added Financial Reports integration points
- ✅ Added Bank Reconciliation integration
- ✅ Updated all component dependencies for V4
- ✅ Documented new data flows for requirements matching
- ✅ **Added Tasks Module integration points (Phase 5)** ⭐ NEW
- ✅ **Added Reports Module integration points (Phase 5)** ⭐ NEW
- ✅ **Added Sharing System integration points (Phase 5)** ⭐ NEW
- ✅ **Added Smart Matching integration (Phase 5)** ⭐ NEW
- ✅ **Added Cross-Agent Collaboration integration (Phase 5)** ⭐ NEW
- ✅ **Total Integration Points: 65+ (up from 45)** ⭐

**Architecture Stability**: All existing integrations preserved, new Phase 5 integrations added.

---

## Table of Contents

1. [Internal Integration Points](#internal-integration-points)
2. [V4 New Integration Points](#v4-new-integration-points)
3. **[Phase 5 Integration Points](#phase-5-integration-points)** ⭐ NEW
4. [Data Flow & Dependencies](#data-flow--dependencies)
5. [Component Dependencies](#component-dependencies)
6. [External Integration Opportunities](#external-integration-opportunities)
7. [Module Interoperability](#module-interoperability)

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

## V4 New Integration Points

### 1. Lead ↔ Contact Integration

**Relationship**: One-to-One (Lead → Contact conversion)

```typescript
// Lead stores interested properties
interface Lead {
  id: string;
  interestedProperties: string[];  // Property IDs
  convertedToClientId?: string;
  conversionTransactionId?: string;
  status: 'active' | 'converted' | 'lost';
}

// Contact can originate from lead
interface Contact {
  id: string;
  leadId?: string;  // Origin lead
  name: string;
  email: string;
  phone: string;
  type: 'buyer' | 'seller' | 'tenant';
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

2. **Lead Conversion → Contact + Transaction**
   ```
   Lead.stage = 'closed' (negotiation successful)
   ├─ Create Contact from Lead
   │  ├─ Contact.leadId = Lead.id
   │  ├─ Copy: name, phone, email
   │  └─ Type: based on Lead.type
   ├─ Create Transaction
   │  ├─ Transaction.leadId = Lead.id
   │  ├─ Transaction.buyerId = Contact.id (if buyer)
   │  └─ Transaction.propertyId = interested property
   └─ Update Lead
      ├─ Lead.status = 'converted'
      ├─ Lead.convertedToClientId = Contact.id
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
function convertLeadToContact(
  leadId: string,
  transactionId: string
): { contact: Contact; success: boolean } {
  const lead = getLeadById(leadId);
  
  // Create contact from lead
  const contact: Contact = {
    id: generateId(),
    workspaceId: lead.workspaceId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    type: lead.type, // 'buyer', 'seller', etc.
    leadId: lead.id,
    source: lead.source,
    transactions: [transactionId],
    propertiesOwned: [],
    propertiesSold: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    // ...
  };
  
  saveContact(contact);
  
  // Update lead
  updateLead(leadId, {
    status: 'converted',
    convertedToClientId: contact.id,
    convertedDate: new Date().toISOString(),
    conversionTransactionId: transactionId
  });
  
  // Update transaction
  updateTransaction(transactionId, {
    buyerId: contact.id, // or sellerId based on lead type
    leadId: lead.id
  });
  
  return { contact, success: true };
}
```

---

### 2. Buyer Requirements ↔ Property Matching Integration

**Relationship**: One-to-Many (Buyer Requirements → Properties)

```typescript
// Buyer Requirements store interested properties
interface BuyerRequirements {
  id: string;
  interestedProperties: string[];  // Property IDs
  status: 'active' | 'matched' | 'closed';
}

// Property can match buyer requirements
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

1. **Buyer Requirements Creation → Property Matching**
   ```
   Add Buyer Requirements
   ├─ Define criteria
   ├─ Match properties
   └─ Link properties to BuyerRequirements.interestedProperties
   ```

2. **Property Matching → Transaction Creation**
   ```
   PropertyDetailPage
   └─ Show matched Buyer Requirements
      ├─ Click "Start Transaction"
      └─ Create Transaction with BuyerRequirements.leadId
   ```

3. **Transaction Completion → Property Update**
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

**Key Service Functions**:
```typescript
function matchPropertiesToBuyerRequirements(
  requirementsId: string
): Property[] {
  const requirements = getBuyerRequirementsById(requirementsId);
  
  const matchedProperties = properties.filter(property => {
    // Match criteria
    return (
      property.price <= requirements.maxPrice &&
      property.bedrooms >= requirements.minBedrooms &&
      property.bathrooms >= requirements.minBathrooms &&
      property.location === requirements.location
    );
  });
  
  // Link properties to requirements
  updateBuyerRequirements(requirementsId, {
    interestedProperties: matchedProperties.map(p => p.id),
    status: 'matched'
  });
  
  return matchedProperties;
}

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

### 3. Rent Requirements ↔ Property Matching Integration

**Relationship**: One-to-Many (Rent Requirements → Properties)

```typescript
// Rent Requirements store interested properties
interface RentRequirements {
  id: string;
  interestedProperties: string[];  // Property IDs
  status: 'active' | 'matched' | 'closed';
}

// Property can match rent requirements
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

1. **Rent Requirements Creation → Property Matching**
   ```
   Add Rent Requirements
   ├─ Define criteria
   ├─ Match properties
   └─ Link properties to RentRequirements.interestedProperties
   ```

2. **Property Matching → Transaction Creation**
   ```
   PropertyDetailPage
   └─ Show matched Rent Requirements
      ├─ Click "Start Transaction"
      └─ Create Transaction with RentRequirements.leadId
   ```

3. **Transaction Completion → Property Update**
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

**Key Service Functions**:
```typescript
function matchPropertiesToRentRequirements(
  requirementsId: string
): Property[] {
  const requirements = getRentRequirementsById(requirementsId);
  
  const matchedProperties = properties.filter(property => {
    // Match criteria
    return (
      property.price <= requirements.maxPrice &&
      property.bedrooms >= requirements.minBedrooms &&
      property.bathrooms >= requirements.minBathrooms &&
      property.location === requirements.location
    );
  });
  
  // Link properties to requirements
  updateRentRequirements(requirementsId, {
    interestedProperties: matchedProperties.map(p => p.id),
    status: 'matched'
  });
  
  return matchedProperties;
}

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

### 4. Dashboard V4 Data Aggregation Integrations

**Relationship**: Many-to-One (Multiple Data Sources → Dashboard V4)

```typescript
// Dashboard V4 aggregates data from multiple sources
interface DashboardV4 {
  id: string;
  workspaceId: string;
  dataSources: string[];  // IDs of data sources
  metrics: Metric[];
}

// Data sources can be properties, transactions, leads, etc.
interface DataSource {
  id: string;
  type: 'property' | 'transaction' | 'lead' | 'client';
  data: any;
}

// Metrics are calculated from data sources
interface Metric {
  id: string;
  name: string;
  value: number;
  type: 'count' | 'sum' | 'average';
}
```

**Integration Points**:

1. **Data Sources Collection → Dashboard V4**
   ```
   Collect data from properties, transactions, leads, etc.
   ├─ Store in DataSource entities
   └─ Link to DashboardV4.dataSources
   ```

2. **Metric Calculation → Dashboard V4**
   ```
   Calculate metrics from data sources
   ├─ For each Metric:
   │  ├─ Aggregate data from relevant DataSources
   │  └─ Calculate value
   └─ Update DashboardV4.metrics
   ```

3. **Dashboard V4 Display → User Interface**
   ```
   DashboardV4
   └─ Show metrics
      ├─ For each Metric:
      │  ├─ Display name
      │  ├─ Display value
      │  └─ Display type
      └─ Show data sources
   ```

**Key Service Functions**:
```typescript
function collectDataSources(
  workspaceId: string
): DataSource[] {
  const properties = getPropertiesByWorkspace(workspaceId);
  const transactions = getTransactionsByWorkspace(workspaceId);
  const leads = getLeadsByWorkspace(workspaceId);
  const clients = getClientsByWorkspace(workspaceId);
  
  const dataSources: DataSource[] = [
    ...properties.map(p => ({
      id: p.id,
      type: 'property',
      data: p
    })),
    ...transactions.map(t => ({
      id: t.id,
      type: 'transaction',
      data: t
    })),
    ...leads.map(l => ({
      id: l.id,
      type: 'lead',
      data: l
    })),
    ...clients.map(c => ({
      id: c.id,
      type: 'client',
      data: c
    }))
  ];
  
  return dataSources;
}

function calculateMetrics(
  dataSources: DataSource[]
): Metric[] {
  const metrics: Metric[] = [
    {
      id: 'total_properties',
      name: 'Total Properties',
      value: dataSources.filter(ds => ds.type === 'property').length,
      type: 'count'
    },
    {
      id: 'total_transactions',
      name: 'Total Transactions',
      value: dataSources.filter(ds => ds.type === 'transaction').length,
      type: 'count'
    },
    {
      id: 'total_leads',
      name: 'Total Leads',
      value: dataSources.filter(ds => ds.type === 'lead').length,
      type: 'count'
    },
    {
      id: 'total_clients',
      name: 'Total Clients',
      value: dataSources.filter(ds => ds.type === 'client').length,
      type: 'count'
    },
    {
      id: 'total_sales',
      name: 'Total Sales',
      value: dataSources
        .filter(ds => ds.type === 'transaction' && ds.data.type === 'sell')
        .reduce((sum, ds) => sum + ds.data.agreedPrice, 0),
      type: 'sum'
    }
  ];
  
  return metrics;
}

function updateDashboardV4(
  dashboardId: string,
  dataSources: DataSource[],
  metrics: Metric[]
): DashboardV4 {
  const dashboard: DashboardV4 = {
    id: dashboardId,
    workspaceId: dataSources[0].data.workspaceId,
    dataSources: dataSources.map(ds => ds.id),
    metrics
  };
  
  saveDashboardV4(dashboard);
  
  return dashboard;
}
```

---

### 5. Financial Reports Integration Points

**Relationship**: Many-to-One (Multiple Data Sources → Financial Reports)

```typescript
// Financial Reports aggregate data from multiple sources
interface FinancialReport {
  id: string;
  workspaceId: string;
  dataSources: string[];  // IDs of data sources
  metrics: Metric[];
}

// Data sources can be transactions, payments, commissions, etc.
interface DataSource {
  id: string;
  type: 'transaction' | 'payment' | 'commission';
  data: any;
}

// Metrics are calculated from data sources
interface Metric {
  id: string;
  name: string;
  value: number;
  type: 'count' | 'sum' | 'average';
}
```

**Integration Points**:

1. **Data Sources Collection → Financial Reports**
   ```
   Collect data from transactions, payments, commissions, etc.
   ├─ Store in DataSource entities
   └─ Link to FinancialReport.dataSources
   ```

2. **Metric Calculation → Financial Reports**
   ```
   Calculate metrics from data sources
   ├─ For each Metric:
   │  ├─ Aggregate data from relevant DataSources
   │  └─ Calculate value
   └─ Update FinancialReport.metrics
   ```

3. **Financial Reports Display → User Interface**
   ```
   FinancialReport
   └─ Show metrics
      ├─ For each Metric:
      │  ├─ Display name
      │  ├─ Display value
      │  └─ Display type
      └─ Show data sources
   ```

**Key Service Functions**:
```typescript
function collectDataSources(
  workspaceId: string
): DataSource[] {
  const transactions = getTransactionsByWorkspace(workspaceId);
  const payments = getPaymentsByWorkspace(workspaceId);
  const commissions = getCommissionsByWorkspace(workspaceId);
  
  const dataSources: DataSource[] = [
    ...transactions.map(t => ({
      id: t.id,
      type: 'transaction',
      data: t
    })),
    ...payments.map(p => ({
      id: p.id,
      type: 'payment',
      data: p
    })),
    ...commissions.map(c => ({
      id: c.id,
      type: 'commission',
      data: c
    }))
  ];
  
  return dataSources;
}

function calculateMetrics(
  dataSources: DataSource[]
): Metric[] {
  const metrics: Metric[] = [
    {
      id: 'total_transactions',
      name: 'Total Transactions',
      value: dataSources.filter(ds => ds.type === 'transaction').length,
      type: 'count'
    },
    {
      id: 'total_payments',
      name: 'Total Payments',
      value: dataSources.filter(ds => ds.type === 'payment').length,
      type: 'count'
    },
    {
      id: 'total_commissions',
      name: 'Total Commissions',
      value: dataSources.filter(ds => ds.type === 'commission').length,
      type: 'count'
    },
    {
      id: 'total_sales',
      name: 'Total Sales',
      value: dataSources
        .filter(ds => ds.type === 'transaction' && ds.data.type === 'sell')
        .reduce((sum, ds) => sum + ds.data.agreedPrice, 0),
      type: 'sum'
    },
    {
      id: 'total_commission_earned',
      name: 'Total Commission Earned',
      value: dataSources
        .filter(ds => ds.type === 'commission')
        .reduce((sum, ds) => sum + ds.data.commissionAmount, 0),
      type: 'sum'
    }
  ];
  
  return metrics;
}

function updateFinancialReport(
  reportId: string,
  dataSources: DataSource[],
  metrics: Metric[]
): FinancialReport {
  const report: FinancialReport = {
    id: reportId,
    workspaceId: dataSources[0].data.workspaceId,
    dataSources: dataSources.map(ds => ds.id),
    metrics
  };
  
  saveFinancialReport(report);
  
  return report;
}
```

---

### 6. Bank Reconciliation Integration

**Relationship**: One-to-One (Bank Reconciliation → Financial Records)

```typescript
// Bank Reconciliation links to financial records
interface BankReconciliation {
  id: string;
  financialRecordId: string;  // Link to financial record
  bankTransactionId: string;
  amount: number;
  date: string;
  status: 'pending' | 'matched' | 'discrepancy';
}

// Financial record links to bank reconciliation
interface FinancialRecord {
  id: string;
  transactionId: string;  // Parent transaction
  propertyId: string;
  clientId: string;
  amount: number;
  date: string;
  status: 'pending' | 'matched' | 'discrepancy';
}
```

**Integration Points**:

1. **Bank Reconciliation Creation → Financial Record Linking**
   ```
   Create Bank Reconciliation
   ├─ Link to Financial Record
   └─ Update BankReconciliation.financialRecordId
   ```

2. **Reconciliation Matching → Financial Record Update**
   ```
   Reconciliation Matching
   ├─ Match Bank Reconciliation with Financial Record
   └─ Update FinancialRecord.status = 'matched'
   ```

3. **Reconciliation Discrepancy → Financial Record Update**
   ```
   Reconciliation Discrepancy
   ├─ Identify discrepancies
   └─ Update FinancialRecord.status = 'discrepancy'
   ```

**Key Service Functions**:
```typescript
function createBankReconciliation(
  financialRecordId: string,
  bankTransactionId: string,
  amount: number,
  date: string
): BankReconciliation {
  const financialRecord = getFinancialRecordById(financialRecordId);
  
  const reconciliation: BankReconciliation = {
    id: generateId(),
    financialRecordId: financialRecord.id,
    bankTransactionId,
    amount,
    date,
    status: 'pending'
  };
  
  saveBankReconciliation(reconciliation);
  
  return reconciliation;
}

function matchBankReconciliation(
  reconciliationId: string
): Result {
  const reconciliation = getBankReconciliationById(reconciliationId);
  const financialRecord = getFinancialRecordById(reconciliation.financialRecordId);
  
  if (reconciliation.amount === financialRecord.amount) {
    updateFinancialRecord(reconciliation.financialRecordId, {
      status: 'matched'
    });
    
    updateBankReconciliation(reconciliationId, {
      status: 'matched'
    });
    
    return { success: true };
  } else {
    updateFinancialRecord(reconciliation.financialRecordId, {
      status: 'discrepancy'
    });
    
    updateBankReconciliation(reconciliationId, {
      status: 'discrepancy'
    });
    
    return { success: false };
  }
}
```

---

## Phase 5 Integration Points ⭐ NEW

### 1. Tasks Module Integration

**Relationship**: One-to-Many (Property → Tasks)

```typescript
// Property can have multiple tasks
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
  tasks: Task[];
}

// Task references property
interface Task {
  id: string;
  propertyId: string;      // REQUIRED link
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}
```

**Integration Points**:

1. **Property Detail Page → Add Task**
   ```
   PropertyDetailPage
   └─ Add Task Button
      ├─ Open Task Creation Modal
      ├─ User inputs:
      │  ├─ Title
      │  ├─ Description
      │  └─ Due Date
      └─ Save Task
         └─ Link: Task.propertyId = Property.id
   ```

2. **Task Completion → Property Update**
   ```
   Task.status = 'completed'
   ├─ Update Property.tasks
   └─ Mark task as completed
   ```

3. **Task Detail → Property Navigation**
   ```
   TaskDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create task from property
function createTaskFromProperty(
  propertyId: string,
  taskData: TaskInput
): Task {
  const property = getPropertyById(propertyId);
  
  const task: Task = {
    id: generateId(),
    propertyId: property.id,
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    status: 'pending'
  };
  
  // Link task to property
  property.tasks.push(task);
  updateProperty(propertyId, property);
  
  return createTask(task);
}

// Complete task and update property
function completeTask(taskId: string): Result {
  const task = getTaskById(taskId);
  const property = getPropertyById(task.propertyId);
  
  updateTask(taskId, {
    status: 'completed'
  });
  
  return { success: true };
}
```

---

### 2. Reports Module Integration

**Relationship**: One-to-Many (Property → Reports)

```typescript
// Property can have multiple reports
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
  reports: Report[];
}

// Report references property
interface Report {
  id: string;
  propertyId: string;      // REQUIRED link
  title: string;
  description: string;
  date: string;
  type: 'inspection' | 'valuation' | 'maintenance';
}
```

**Integration Points**:

1. **Property Detail Page → Add Report**
   ```
   PropertyDetailPage
   └─ Add Report Button
      ├─ Open Report Creation Modal
      ├─ User inputs:
      │  ├─ Title
      │  ├─ Description
      │  └─ Date
      └─ Save Report
         └─ Link: Report.propertyId = Property.id
   ```

2. **Report Completion → Property Update**
   ```
   Report.status = 'completed'
   ├─ Update Property.reports
   └─ Mark report as completed
   ```

3. **Report Detail → Property Navigation**
   ```
   ReportDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create report from property
function createReportFromProperty(
  propertyId: string,
  reportData: ReportInput
): Report {
  const property = getPropertyById(propertyId);
  
  const report: Report = {
    id: generateId(),
    propertyId: property.id,
    title: reportData.title,
    description: reportData.description,
    date: reportData.date,
    type: reportData.type
  };
  
  // Link report to property
  property.reports.push(report);
  updateProperty(propertyId, property);
  
  return createReport(report);
}

// Complete report and update property
function completeReport(reportId: string): Result {
  const report = getReportById(reportId);
  const property = getPropertyById(report.propertyId);
  
  updateReport(reportId, {
    status: 'completed'
  });
  
  return { success: true };
}
```

---

### 3. Sharing System Integration

**Relationship**: One-to-Many (Property → Shares)

```typescript
// Property can have multiple shares
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
  shares: Share[];
}

// Share references property
interface Share {
  id: string;
  propertyId: string;      // REQUIRED link
  userId: string;
  sharePercentage: number;
  accessLevel: 'view' | 'edit' | 'admin';
}
```

**Integration Points**:

1. **Property Detail Page → Add Share**
   ```
   PropertyDetailPage
   └─ Add Share Button
      ├─ Open Share Creation Modal
      ├─ User inputs:
      │  ├─ User ID
      │  ├─ Share Percentage
      │  └─ Access Level
      └─ Save Share
         └─ Link: Share.propertyId = Property.id
   ```

2. **Share Completion → Property Update**
   ```
   Share.status = 'active'
   ├─ Update Property.shares
   └─ Mark share as active
   ```

3. **Share Detail → Property Navigation**
   ```
   ShareDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create share from property
function createShareFromProperty(
  propertyId: string,
  shareData: ShareInput
): Share {
  const property = getPropertyById(propertyId);
  
  const share: Share = {
    id: generateId(),
    propertyId: property.id,
    userId: shareData.userId,
    sharePercentage: shareData.sharePercentage,
    accessLevel: shareData.accessLevel
  };
  
  // Link share to property
  property.shares.push(share);
  updateProperty(propertyId, property);
  
  return createShare(share);
}

// Complete share and update property
function completeShare(shareId: string): Result {
  const share = getShareById(shareId);
  const property = getPropertyById(share.propertyId);
  
  updateShare(shareId, {
    status: 'active'
  });
  
  return { success: true };
}
```

---

### 4. Smart Matching Integration

**Relationship**: One-to-Many (Property → Matches)

```typescript
// Property can have multiple matches
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
  matches: Match[];
}

// Match references property
interface Match {
  id: string;
  propertyId: string;      // REQUIRED link
  criteria: string;
  score: number;
}
```

**Integration Points**:

1. **Property Detail Page → Add Match**
   ```
   PropertyDetailPage
   └─ Add Match Button
      ├─ Open Match Creation Modal
      ├─ User inputs:
      │  ├─ Criteria
      │  └─ Score
      └─ Save Match
         └─ Link: Match.propertyId = Property.id
   ```

2. **Match Completion → Property Update**
   ```
   Match.status = 'active'
   ├─ Update Property.matches
   └─ Mark match as active
   ```

3. **Match Detail → Property Navigation**
   ```
   MatchDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create match from property
function createMatchFromProperty(
  propertyId: string,
  matchData: MatchInput
): Match {
  const property = getPropertyById(propertyId);
  
  const match: Match = {
    id: generateId(),
    propertyId: property.id,
    criteria: matchData.criteria,
    score: matchData.score
  };
  
  // Link match to property
  property.matches.push(match);
  updateProperty(propertyId, property);
  
  return createMatch(match);
}

// Complete match and update property
function completeMatch(matchId: string): Result {
  const match = getMatchById(matchId);
  const property = getPropertyById(match.propertyId);
  
  updateMatch(matchId, {
    status: 'active'
  });
  
  return { success: true };
}
```

---

### 5. Cross-Agent Collaboration Integration

**Relationship**: One-to-Many (Property → Collaborations)

```typescript
// Property can have multiple collaborations
interface Property {
  id: string;
  transactions: string[];  // Transaction IDs
  currentOwnerId?: string;
  status: PropertyStatus;
  collaborations: Collaboration[];
}

// Collaboration references property
interface Collaboration {
  id: string;
  propertyId: string;      // REQUIRED link
  agentId: string;
  role: 'lead' | 'support';
}
```

**Integration Points**:

1. **Property Detail Page → Add Collaboration**
   ```
   PropertyDetailPage
   └─ Add Collaboration Button
      ├─ Open Collaboration Creation Modal
      ├─ User inputs:
      │  ├─ Agent ID
      │  └─ Role
      └─ Save Collaboration
         └─ Link: Collaboration.propertyId = Property.id
   ```

2. **Collaboration Completion → Property Update**
   ```
   Collaboration.status = 'active'
   ├─ Update Property.collaborations
   └─ Mark collaboration as active
   ```

3. **Collaboration Detail → Property Navigation**
   ```
   CollaborationDetailModal
   └─ PropertyConnectedCard
      └─ Click → Navigate to PropertyDetailPage
   
   Bidirectional navigation maintained
   ```

**Key Service Functions**:
```typescript
// Create collaboration from property
function createCollaborationFromProperty(
  propertyId: string,
  collaborationData: CollaborationInput
): Collaboration {
  const property = getPropertyById(propertyId);
  
  const collaboration: Collaboration = {
    id: generateId(),
    propertyId: property.id,
    agentId: collaborationData.agentId,
    role: collaborationData.role
  };
  
  // Link collaboration to property
  property.collaborations.push(collaboration);
  updateProperty(propertyId, property);
  
  return createCollaboration(collaboration);
}

// Complete collaboration and update property
function completeCollaboration(collaborationId: string): Result {
  const collaboration = getCollaborationById(collaborationId);
  const property = getPropertyById(collaboration.propertyId);
  
  updateCollaboration(collaborationId, {
    status: 'active'
  });
  
  return { success: true };
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