# EstateManager Agency Module - Business Flows & Workflows

**Document Version**: 3.0  
**Last Updated**: January 15, 2026  
**Status**: Phase 5 Complete - All Workflows Documented ⭐

---

## Version 3.0 Updates ⭐ NEW

**Major Changes**:
- ✅ Added Lead → Contact conversion workflow (V4)
- ✅ Added Buyer Requirements matching workflow (V4)
- ✅ Added Rent Requirements workflow (V4)
- ✅ Added Dashboard V4 intelligent insights workflow
- ✅ Added Contacts/Clients V4 relationship tracking
- ✅ Added Financial Reports generation workflow
- ✅ Added Bank Reconciliation workflow
- ✅ Updated all workflows to reflect V4 components
- ✅ Cross-referenced with Flow Diagrams documentation
- ✅ **Added Task Management workflows (Phase 5)** ⭐ NEW
- ✅ **Added Reports Generation workflows (Phase 5)** ⭐ NEW
- ✅ **Added Sharing & Collaboration workflows (Phase 5)** ⭐ NEW
- ✅ **Added Smart Matching workflows (Phase 5)** ⭐ NEW
- ✅ **Added Cross-Agent Offer workflows (Phase 5)** ⭐ NEW
- ✅ **Total Workflows: 45+ (up from 30+)** ⭐

**Note**: For detailed visual flow diagrams, see `/docs/flow_diagrams/` directory with 70+ scenarios across all modules.

---

## Table of Contents

1. [Property Lifecycle Workflows](#property-lifecycle-workflows)
2. [Transaction Cycles](#transaction-cycles)
3. [Lead Management Pipeline](#lead-management-pipeline)
4. [Requirements Matching Workflows](#requirements-matching-workflows)
5. [Contact Management Workflows](#contact-management-workflows)
6. [Payment & Financial Flows](#payment--financial-flows)
7. [Agency & Investor Portfolio Flows](#agency--investor-portfolio-flows)
8. [Dashboard Intelligence Workflows](#dashboard-intelligence-workflows)
9. **[Task Management Workflows](#task-management-workflows)** ⭐ NEW
10. **[Reports & Analytics Workflows](#reports--analytics-workflows)** ⭐ NEW
11. **[Sharing & Collaboration Workflows](#sharing--collaboration-workflows)** ⭐ NEW
12. [User Workflows by Role](#user-workflows-by-role)

---

## Property Lifecycle Workflows

### 1. Client Listing Workflow

**Scenario**: Client wants to sell their property through the agency

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT LISTING WORKFLOW                                     │
└─────────────────────────────────────────────────────────────┘

[START] Client Approaches Agency
    ↓
Step 1: Initial Contact
    ├─ Create Lead (if new client)
    ├─ Record: Lead type = 'seller'
    ├─ Assign to Agent
    └─ Schedule Property Visit
    ↓
Step 2: Property Evaluation
    ├─ Agent visits property
    ├─ Records property details
    ├─ Takes photos
    ├─ Evaluates market value
    └─ Prepares listing recommendation
    ↓
Step 3: Listing Agreement
    ├─ Discuss commission (default 2%)
    ├─ Agree on listing price
    ├─ Sign agreement (document upload)
    └─ Convert Lead to Client
    ↓
Step 4: Create Property Record
    ├─ Add Property to system
    │  ├─ acquisitionType = 'client-listing'
    │  ├─ currentOwnerId = Client.id
    │  ├─ agentId = Assigned Agent
    │  ├─ status = 'available'
    │  └─ commissionRate = agreed %
    ├─ Upload photos & documents
    └─ Set listing preferences
    ↓
Step 5: Marketing & Showing
    ├─ Property appears in listings
    ├─ Generate leads (buyers)
    ├─ Schedule viewings
    └─ Track inquiries
    ↓
Step 6: Offer & Negotiation
    ├─ Buyer submits offer
    ├─ Start Sell Cycle Transaction
    ├─ Property status = 'under-offer'
    └─ Negotiate terms
    ↓
Step 7: Sale Completion
    ├─ Complete Transaction
    ├─ Transfer Ownership
    │  ├─ Property.currentOwnerId → Buyer
    │  ├─ Property.status = 'sold'
    │  └─ Add to ownershipHistory
    ├─ Commission Earned
    └─ [END]
    ↓
Optional Step 8: Re-listing
    ├─ New owner may want to sell again
    ├─ Property marked 're-listable'
    └─ Cycle can repeat

```

**Key Points**:
- ✅ Property owned by client, listed through agency
- ✅ 2% commission (default)
- ✅ Agent manages the listing
- ✅ Can be re-listed after sale

---

### 2. Agency Inventory Acquisition Workflow

**Scenario**: Agency purchases property for resale (investment)

```
┌────────────────────────────────────────────────────────────┐
│  AGENCY INVENTORY ACQUISITION WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

[START] Property Identified for Purchase
    ↓
Step 1: Property Search & Identification
    ├─ Agent finds suitable property
    ├─ Market research
    ├─ Investment analysis
    └─ Get management approval
    ↓
Step 2: Start Purchase Cycle
    ├─ Navigate: Add Property → Purchase for Inventory
    ├─ Create Property Record
    │  ├─ acquisitionType = 'inventory'
    │  ├─ currentOwnerId = null (agency owned)
    │  ├─ status = 'available' (can start as sold)
    │  └─ agentId = handling agent
    └─ Create Purchase Transaction
       ├─ type = 'purchase'
       ├─ sellerId = Current Owner
       ├─ buyerId = null (agency)
       └─ isPurchaseForResale = true
    ↓
Step 3: Due Diligence
    ├─ Legal verification
    ├─ Property inspection
    ├─ Title verification
    └─ Valuation confirmation
    ↓
Step 4: Negotiation & Agreement
    ├─ Negotiate purchase price
    ├─ Agree payment terms
    ├─ Set target resale price
    └─ Define payment structure
    ↓
Step 5: Payment Processing
    ├─ Create Payment Schedule (if installments)
    ├─ Process down payment
    ├─ Track installment payments
    └─ Update payment status
    ↓
Step 6: Ownership Transfer
    ├─ Complete legal transfer
    ├─ Update Property
    │  ├─ currentOwnerId = null
    │  ├─ acquisitionType = 'inventory'
    │  ├─ status = 'available'
    │  └─ Add to ownershipHistory
    └─ Transaction.status = 'completed'
    ↓
Step 7: Prepare for Resale
    ├─ Property now in agency inventory
    ├─ Set resale price
    ├─ Market the property
    └─ Generate buyer leads
    ↓
Step 8: Resale (Sell Cycle)
    ├─ Start Sell Cycle Transaction
    ├─ Find buyer
    ├─ Complete sale
    └─ Profit = Sale Price - Purchase Price - Costs
    ↓
[END] Ownership Transferred to Buyer

```

**Key Points**:
- ✅ Agency owns the property
- ✅ Purchase Transaction created
- ✅ currentOwnerId = null (agency inventory)
- ✅ Can set target resale price
- ✅ Profit tracking enabled

---

### 3. Investor-Backed Property Workflow

**Scenario**: Multiple investors co-fund property purchase

```
┌─────────────────────────────────────────────────────────────┐
│  INVESTOR-BACKED PROPERTY ACQUISITION WORKFLOW               │
└─────────────────────────────────────────────────────────────┘

[START] Investment Opportunity Identified
    ↓
Step 1: Property Identification
    ├─ Agency identifies investment property
    ├─ Financial analysis
    ├─ ROI projections
    └─ Investment proposal prepared
    ↓
Step 2: Investor Recruitment
    ├─ Present to potential investors
    ├─ Define share structure
    │  ├─ Investor A: 40% (PKR 4,000,000)
    │  ├─ Investor B: 35% (PKR 3,500,000)
    │  └─ Investor C: 25% (PKR 2,500,000)
    ├─ Total Investment: PKR 10,000,000
    └─ Target ROI: 25%
    ↓
Step 3: Start Purchase Cycle
    ├─ Navigate: Add Property → Purchase for Investors
    ├─ Create Property Record
    │  ├─ acquisitionType = 'investor'
    │  ├─ currentOwnerId = null
    │  ├─ status = 'available'
    │  ├─ investorShares = [...]
    │  └─ totalInvestment = PKR 10M
    └─ Create Purchase Transaction
       ├─ type = 'purchase'
       ├─ isPurchaseForInvestor = true
       └─ Link to property
    ↓
Step 4: Capital Collection
    ├─ Each investor contributes their share
    ├─ Track in investor records
    ├─ Update Investment Records
    │  └─ InvestmentRecord for each investor
    └─ Create Payment Schedule
    ↓
Step 5: Property Acquisition
    ├─ Purchase property
    ├─ Complete due diligence
    ├─ Ownership transfer
    └─ Transaction completed
    ↓
Step 6: Property Management
    ├─ Property in portfolio
    ├─ Rent it out (optional)
    ├─ Maintain property
    └─ Track expenses & income
    ↓
Step 7: Exit Strategy
    
    Option A: Resale
    ├─ Sell property
    ├─ Calculate profit
    ├─ Distribute to investors
    │  ├─ Investor A: 40% of profit
    │  ├─ Investor B: 35% of profit
    │  └─ Investor C: 25% of profit
    └─ Update ROI metrics
    
    Option B: Rental Income
    ├─ Lease property
    ├─ Collect rent
    ├─ Distribute monthly
    └─ Ongoing returns
    
    Option C: Partial Exit
    ├─ One investor wants out
    ├─ Buy their share
    └─ Redistribute ownership
    ↓
[END] Investment Closed or Ongoing

```

**Key Points**:
- ✅ Multiple investors share ownership
- ✅ Percentage-based investment tracking
- ✅ ROI calculation per investor
- ✅ Flexible exit strategies
- ✅ Separate from regular inventory

---

### 4. Property Re-listing Workflow

**Scenario**: Sold property comes back to market (agency repurchases)

```
┌─────────────────────────────────────────────────────────────┐
│  PROPERTY RE-LISTING WORKFLOW                                │
└─────────────────────────────────────────────────────────────┘

[START] Property Previously Sold
    Current State:
    ├─ Property.status = 'sold'
    ├─ Property.currentOwnerId = Client X
    └─ Property.ownershipHistory = [agency → client X]
    ↓
Step 1: Re-listing Opportunity
    ├─ Client X wants to sell
    ├─ OR Agency wants to buy back
    └─ Property appears in "Re-listable Properties"
    ↓
Step 2: Initiate Re-listing
    
    Option A: Client Re-lists (Standard Flow)
    ├─ Client contacts agency
    ├─ Follow Client Listing Workflow
    └─ Create new Sell Cycle
    
    Option B: Agency Repurchases
    ├─ Navigate: Re-listable Properties
    ├─ Click "Re-list Property"
    ├─ Opens RelistPropertyModal
    └─ Start Purchase Cycle
    ↓
Step 3: Purchase Transaction (Agency Repurchase)
    ├─ Create Transaction
    │  ├─ type = 'purchase'
    │  ├─ sellerId = Client X
    │  ├─ buyerId = null (agency)
    │  └─ isPurchaseForResale = true
    ├─ Negotiate price
    └─ Process payment
    ↓
Step 4: Ownership Transfer Back to Agency
    ├─ transferOwnership()
    │  ├─ currentOwnerId: Client X → null
    │  ├─ ownershipHistory.push({
    │  │    ownerId: 'agency',
    │  │    acquiredDate: today,
    │  │    acquisitionPrice: repurchase price
    │  │  })
    ├─ Property.status = 'available'
    └─ Property.acquisitionType = 'inventory'
    ↓
Step 5: Ready for Resale
    ├─ Property back in agency inventory
    ├─ Can start new Sell Cycle
    └─ Full history preserved
    ↓
[END] Property Available for Sale Again

```

**Key Points**:
- ✅ Property record never deleted
- ✅ Complete ownership history tracked
- ✅ Can be re-listed unlimited times
- ✅ Each sale/purchase creates new transaction
- ✅ Asset-centric model in action

---

## Transaction Cycles

### 1. Sell Cycle Workflow

**Purpose**: Selling a property to a buyer

```
┌─────────────────────────────────────────────────────────────┐
│  SELL CYCLE - COMPLETE WORKFLOW                              │
└─────────────────────────────────────────────────────────────┘

[START] Property Available for Sale
    ↓
Step 1: LISTED
    ├─ Property is active listing
    ├─ Marketing & promotion
    ├─ Generate buyer leads
    ├─ Schedule viewings
    └─ Wait for offers
    ↓
Step 2: NEGOTIATION
    Trigger: Buyer shows serious interest
    ├─ Lead.stage = 'negotiation'
    ├─ Create Transaction
    │  ├─ type = 'sell'
    │  ├─ propertyId = selected property
    │  ├─ leadId = buyer lead
    │  ├─ agentId = handling agent
    │  └─ stage = 'negotiation'
    ├─ Discuss price & terms
    ├─ Multiple offers possible
    └─ Property.status = 'under-offer'
    ↓
Step 3: OFFER ACCEPTED
    Trigger: Agreement reached
    ├─ Transaction.agreedPrice = final price
    ├─ Transaction.stage = 'offer-accepted'
    ├─ Transaction.paymentType = selected
    ├─ Convert Lead to Client
    │  ├─ Lead.status = 'converted'
    │  └─ Client created
    ├─ Transaction.buyerId = Client.id
    └─ Lock property (no other offers)
    ↓
Step 4: DOCUMENTATION
    ├─ Transaction.stage = 'documentation'
    ├─ Prepare sale agreement
    ├─ Legal documentation
    ├─ Upload documents
    ├─ Both parties sign
    └─ Verify legal requirements
    ↓
Step 5: PAYMENT PROCESSING
    ├─ Transaction.stage = 'payment-processing'
    
    If Cash Payment:
    ├─ Receive full payment
    ├─ Issue receipt
    └─ Mark as paid
    
    If Installment:
    ├─ Create Payment Schedule
    │  ├─ Down payment
    │  ├─ Monthly installments
    │  └─ Track each payment
    ├─ Receive down payment
    └─ Schedule installments
    ↓
Step 6: OWNERSHIP TRANSFER
    ├─ Transaction.stage = 'ownership-transfer'
    ├─ Legal transfer process
    ├─ Registry office procedures
    ├─ Transfer utilities
    ├─ Hand over keys
    └─ Call transferOwnership()
       ├─ Property.currentOwnerId = Buyer
       ├─ Property.status = 'sold'
       └─ ownershipHistory updated
    ↓
Step 7: COMPLETED
    ├─ Transaction.status = 'completed'
    ├─ Transaction.stage = 'completed'
    ├─ Transaction.actualClosingDate = today
    ├─ Calculate Commission
    │  ├─ commissionAmount = agreedPrice × rate
    │  ├─ Create CommissionRecord
    │  └─ commissionStatus = 'pending'
    ├─ Update Agent Performance
    └─ Close transaction
    ↓
[END] Sale Complete

```

**Stage Transitions**:
```typescript
const sellCycleStages: TransactionStage[] = [
  'listed',              // Initial state
  'negotiation',         // Buyer interested
  'offer-accepted',      // Agreement reached
  'documentation',       // Legal paperwork
  'payment-processing',  // Money exchange
  'ownership-transfer',  // Legal transfer
  'completed'            // Final state
];
```

---

### 2. Purchase Cycle Workflow

**Purpose**: Agency purchasing a property

```
┌─────────────────────────────────────────────────────────────┐
│  PURCHASE CYCLE - COMPLETE WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

[START] Property Acquisition Decision
    ↓
Step 1: PROPERTY SEARCH
    ├─ Transaction.stage = 'property-search'
    ├─ Identify target property
    ├─ Market research
    ├─ Financial analysis
    ├─ Set budget
    └─ Get approval (if needed)
    ↓
Step 2: OFFER SUBMITTED
    ├─ Transaction.stage = 'offer-submitted'
    ├─ Create Purchase Transaction
    │  ├─ type = 'purchase'
    │  ├─ propertyId = target property
    │  ├─ sellerId = current owner
    │  ├─ buyerId = null (agency)
    │  ├─ isPurchaseForResale = true/false
    │  └─ isPurchaseForInvestor = true/false
    ├─ Submit offer to seller
    ├─ Wait for response
    └─ Negotiate if needed
    ↓
Step 3: OFFER ACCEPTED
    ├─ Transaction.stage = 'offer-accepted'
    ├─ Transaction.agreedPrice = final price
    ├─ Terms agreed
    └─ Move to due diligence
    ↓
Step 4: DUE DILIGENCE
    ├─ Transaction.stage = 'due-diligence'
    ├─ Legal verification
    │  ├─ Title verification
    │  ├─ Encumbrance certificate
    │  └─ Legal ownership
    ├─ Property inspection
    │  ├─ Structural assessment
    │  ├─ Valuation
    │  └─ Condition report
    ├─ Financial verification
    └─ Upload due diligence docs
    ↓
Step 5: PAYMENT PROCESSING
    ├─ Transaction.stage = 'payment-processing'
    ├─ Create Payment Schedule
    │  ├─ Down payment
    │  ├─ Installments (if applicable)
    │  └─ Track payments
    ├─ Process payments
    │  ├─ Bank transfer
    │  ├─ Cheque
    │  └─ Cash
    └─ Maintain payment records
    ↓
Step 6: OWNERSHIP TRANSFER
    ├─ Transaction.stage = 'ownership-transfer'
    ├─ Registry procedures
    ├─ Legal transfer
    ├─ Stamp duty payment
    ├─ Registration fees
    └─ Call transferOwnership()
       ├─ Property.currentOwnerId = null (agency)
       ├─ Property.acquisitionType = 'inventory'/'investor'
       ├─ Property.status = 'available'
       └─ ownershipHistory updated
    ↓
Step 7: COMPLETED
    ├─ Transaction.status = 'completed'
    ├─ Transaction.stage = 'completed'
    ├─ Transaction.actualClosingDate = today
    ├─ Property in agency portfolio
    ├─ Update financial records
    │  ├─ Record as capital expenditure
    │  └─ Update inventory value
    └─ Ready for resale or rental
    ↓
[END] Purchase Complete

```

**Stage Transitions**:
```typescript
const purchaseCycleStages: TransactionStage[] = [
  'property-search',     // Finding property
  'offer-submitted',     // Offer made
  'offer-accepted',      // Seller agreed
  'due-diligence',       // Verification
  'payment-processing',  // Paying
  'ownership-transfer',  // Legal transfer
  'completed'            // Final state
];
```

---

### 3. Rent Cycle Workflow

**Purpose**: Leasing a property to a tenant

```
┌─────────────────────────────────────────────────────────────┐
│  RENT CYCLE - COMPLETE WORKFLOW                              │
└─────────────────────────────────────────────────────────────┘

[START] Property Available for Rent
    ↓
Step 1: SEARCHING
    ├─ Transaction.stage = 'searching'
    ├─ Property listed for rent
    ├─ Marketing to tenants
    ├─ Generate tenant leads
    └─ Schedule property viewings
    ↓
Step 2: VIEWING
    ├─ Transaction.stage = 'viewing'
    ├─ Conduct property viewings
    ├─ Answer tenant questions
    ├─ Assess tenant suitability
    └─ Discuss terms
    ↓
Step 3: APPLICATION
    ├─ Transaction.stage = 'application'
    ├─ Tenant submits application
    ├─ Create Rent Transaction
    │  ├─ type = 'rent'
    │  ├─ propertyId = property
    │  ├─ tenantId = applicant
    │  ├─ landlordId = owner/agency
    │  └─ agentId = handling agent
    ├─ Tenant screening
    │  ├─ Credit check
    │  ├─ Employment verification
    │  ├─ References
    │  └─ Background check
    ├─ Agree on terms
    │  ├─ Monthly rent
    │  ├─ Security deposit
    │  ├─ Lease period
    │  └─ Conditions
    └─ Decision: Accept/Reject
    ↓
Step 4: LEASE SIGNING
    ├─ Transaction.stage = 'lease-signing'
    ├─ Prepare lease agreement
    ├─ Review terms with tenant
    ├─ Both parties sign
    ├─ Upload lease document
    └─ Set lease dates
       ├─ Transaction.leaseStartDate
       ├─ Transaction.leaseEndDate
       └─ Transaction.leasePeriodMonths
    ↓
Step 5: PAYMENT PROCESSING
    ├─ Transaction.stage = 'payment-processing'
    ├─ Collect security deposit
    │  ├─ Transaction.securityDeposit
    │  └─ Issue receipt
    ├─ Collect first month's rent
    │  ├─ Transaction.monthlyRent
    │  └─ Issue receipt
    └─ Create Payment Schedule
       ├─ Monthly installments
       ├─ Due date: 1st of each month
       └─ Total: leasePeriodMonths
    ↓
Step 6: MOVE-IN
    ├─ Transaction.stage = 'move-in'
    ├─ Property inspection (checklist)
    ├─ Document property condition
    ├─ Take photos
    ├─ Hand over keys
    ├─ Transfer utilities
    └─ Property.status = 'rented'
    ↓
Step 7: ACTIVE LEASE
    ├─ Transaction.stage = 'active-lease'
    ├─ Ongoing rental period
    ├─ Monthly rent collection
    │  ├─ Track payments
    │  ├─ Send reminders
    │  └─ Late fees if applicable
    ├─ Maintenance requests
    ├─ Property management
    └─ Lease renewal negotiations (if applicable)
    ↓
Step 8: LEASE ENDING
    ├─ Transaction.stage = 'lease-ending'
    ├─ Lease period ending soon
    ├─ Decision: Renew or Terminate
    
    If Renew:
    ├─ Create new Rent Transaction
    ├─ Update terms if needed
    └─ Back to LEASE SIGNING
    
    If Terminate:
    ├─ Schedule move-out
    ├─ Final inspection
    ├─ Return security deposit
    │  ├─ Deduct damages if any
    │  └─ Return remainder
    ├─ Collect keys
    └─ Property.status = 'available'
    ↓
Step 9: COMPLETED
    ├─ Transaction.status = 'completed'
    ├─ Transaction.stage = 'completed'
    ├─ Final accounting
    ├─ Commission calculation
    │  ├─ Typically 1 month's rent
    │  └─ Create CommissionRecord
    ├─ Close transaction
    └─ Property available for new tenant
    ↓
[END] Lease Complete

```

**Stage Transitions**:
```typescript
const rentCycleStages: TransactionStage[] = [
  'searching',           // Looking for tenant
  'viewing',             // Showing property
  'application',         // Tenant applies
  'lease-signing',       // Agreement signed
  'payment-processing',  // Security deposit + first rent
  'move-in',             // Tenant moves in
  'active-lease',        // Ongoing rental
  'lease-ending',        // Lease expiring
  'completed'            // Lease ended
];
```

---

## Lead Management Pipeline

### 5-Stage Pipeline Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  LEAD PIPELINE - COMPLETE WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘

[START] Lead Created
    ↓
STAGE 1: NEW
├─ Lead just entered system
├─ Source recorded (website, referral, walk-in, etc.)
├─ Basic info captured
│  ├─ Name, phone
│  ├─ Lead type (buyer/seller/tenant)
│  ├─ Budget (if known)
│  └─ Preferred areas
├─ Assigned to agent
├─ Status = 'active'
└─ Next Action: Initial contact within 24 hours
    ↓
    ↓ Advance Trigger: First contact made
    ↓
STAGE 2: CONTACTED
├─ Agent has made contact
├─ Initial conversation completed
├─ Record activity
│  ├─ Call/email/meeting
│  ├─ Notes from conversation
│  └─ Next follow-up scheduled
├─ Qualify lead
│  ├─ Budget confirmed?
│  ├─ Timeline to buy/sell?
│  ├─ Serious intent?
│  └─ Decision makers identified?
└─ Next Action: Qualify the lead
    ↓
    ↓ Advance Trigger: Lead qualification complete
    ↓
STAGE 3: QUALIFIED
├─ Lead verified as genuine opportunity
├─ Requirements clarified
│  ├─ Specific property types
│  ├─ Must-have features
│  ├─ Deal-breaker criteria
│  └─ Timeline confirmed
├─ Properties matched
│  ├─ Add to interestedProperties[]
│  ├─ Schedule viewings
│  └─ Share listings
├─ Relationship building
└─ Next Action: Present properties, schedule viewings
    ↓
    ↓ Advance Trigger: Serious interest in specific property
    ↓
STAGE 4: NEGOTIATION
├─ Lead ready to make offer
├─ Specific property identified
├─ Start transaction
│  ├─ Create Transaction (Sell/Rent)
│  ├─ Link Lead to Transaction
│  └─ Transaction.leadId = Lead.id
├─ Price negotiation
├─ Terms discussion
├─ Multiple rounds possible
└─ Next Action: Close the deal
    ↓
    ↓ Advance Trigger: Agreement reached
    ↓
STAGE 5: CLOSED
├─ Lead.stage = 'closed'
├─ Decision point:
   
   If WON:
   ├─ Lead.status = 'converted'
   ├─ Create Client record
   │  ├─ Client.originLeadId = Lead.id
   │  └─ Transfer all details
   ├─ Lead.convertedToClientId = Client.id
   ├─ Lead.convertedDate = today
   ├─ Lead.conversionTransactionId = Transaction.id
   ├─ Transaction proceeds
   └─ Commission opportunity
   
   If LOST:
   ├─ Lead.status = 'lost'
   ├─ Record reason
   │  ├─ Budget issues
   │  ├─ Timing not right
   │  ├─ Chose competitor
   │  └─ Other
   ├─ Add to nurture list (maybe retry later)
   └─ No transaction created
    ↓
[END] Lead Lifecycle Complete

```

**Pipeline Metrics**:
```typescript
interface LeadPipelineMetrics {
  // Conversion rates
  newToContacted: number;       // % that get contacted
  contactedToQualified: number; // % that qualify
  qualifiedToNegotiation: number; // % that enter negotiation
  negotiationToClose: number;   // % that close (win or lose)
  overallConversion: number;    // % from new to won
  
  // Time metrics
  avgTimeInNew: number;         // Hours
  avgTimeInContacted: number;   // Days
  avgTimeInQualified: number;   // Days
  avgTimeInNegotiation: number; // Days
  avgTotalCycleTime: number;    // Days from new to closed
  
  // Activity metrics
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;       // converted / total
}
```

---

## Requirements Matching Workflows

### Buyer Requirements Matching Workflow

**Scenario**: Matching properties to buyer requirements

```
┌─────────────────────────────────────────────────────────────┐
│  BUYER REQUIREMENTS MATCHING WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

[START] Lead Qualification Complete
    ↓
Step 1: Capture Requirements
    ├─ Agent records buyer preferences
    ├─ Property type
    ├─ Location
    ├─ Budget
    ├─ Features (e.g., bedrooms, bathrooms)
    └─ Timeline
    ↓
Step 2: Search Properties
    ├─ Agent searches database
    ├─ Filters properties based on requirements
    ├─ Generates shortlist
    └─ Shares with buyer
    ↓
Step 3: Schedule Viewings
    ├─ Buyer selects properties
    ├─ Agent schedules viewings
    ├─ Prepares property for viewing
    └─ Meets buyer at property
    ↓
Step 4: Feedback Collection
    ├─ Agent collects buyer feedback
    ├─ Updates property record
    ├─ Adjusts shortlist
    └─ Repeats if necessary
    ↓
Step 5: Final Selection
    ├─ Buyer makes final decision
    ├─ Agent starts transaction
    └─ Proceeds to negotiation
    ↓
[END] Property Selected

```

**Key Points**:
- ✅ Detailed requirements capture
- ✅ Property search and filtering
- ✅ Viewing scheduling and feedback
- ✅ Final selection and transaction start

---

### Rent Requirements Workflow

**Scenario**: Matching properties to tenant requirements

```
┌─────────────────────────────────────────────────────────────┐
│  RENT REQUIREMENTS MATCHING WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

[START] Lead Qualification Complete
    ↓
Step 1: Capture Requirements
    ├─ Agent records tenant preferences
    ├─ Property type
    ├─ Location
    ├─ Budget
    ├─ Features (e.g., bedrooms, bathrooms)
    └─ Timeline
    ↓
Step 2: Search Properties
    ├─ Agent searches database
    ├─ Filters properties based on requirements
    ├─ Generates shortlist
    └─ Shares with tenant
    ↓
Step 3: Schedule Viewings
    ├─ Tenant selects properties
    ├─ Agent schedules viewings
    ├─ Prepares property for viewing
    └─ Meets tenant at property
    ↓
Step 4: Feedback Collection
    ├─ Agent collects tenant feedback
    ├─ Updates property record
    ├─ Adjusts shortlist
    └─ Repeats if necessary
    ↓
Step 5: Final Selection
    ├─ Tenant makes final decision
    ├─ Agent starts transaction
    └─ Proceeds to negotiation
    ↓
[END] Property Selected

```

**Key Points**:
- ✅ Detailed requirements capture
- ✅ Property search and filtering
- ✅ Viewing scheduling and feedback
- ✅ Final selection and transaction start

---

## Contact Management Workflows

### Lead → Contact Conversion Workflow

**Scenario**: Converting leads to contacts

```
┌─────────────────────────────────────────────────────────────┐
│  LEAD → CONTACT CONVERSION WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

[START] Lead Qualification Complete
    ↓
Step 1: Evaluate Lead
    ├─ Agent assesses lead quality
    ├─ Checks for serious intent
    ├─ Confirms budget and timeline
    └─ Identifies decision makers
    ↓
Step 2: Convert to Contact
    ├─ Agent updates lead status
    ├─ Lead.status = 'converted'
    ├─ Creates Contact record
    │  ├─ Contact.originLeadId = Lead.id
    │  └─ Transfer all details
    ├─ Lead.convertedToContactId = Contact.id
    ├─ Lead.convertedDate = today
    └─ Lead.conversionTransactionId = Transaction.id
    ↓
Step 3: Relationship Building
    ├─ Agent initiates relationship
    ├─ Regular follow-ups
    ├─ Shares updates
    └─ Builds trust
    ↓
[END] Contact Established

```

**Key Points**:
- ✅ Lead evaluation and quality check
- ✅ Conversion to Contact record
- ✅ Relationship building and follow-ups

---

## Payment & Financial Flows

### Payment Schedule Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  PAYMENT SCHEDULE - COMPLETE WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

[START] Transaction with Installment Payment
    ↓
Step 1: Create Payment Schedule
    ├─ Triggered by Transaction with paymentType = 'installment'
    ├─ Input parameters:
    │  ├─ totalAmount (agreed price)
    │  ├─ downPayment (initial payment)
    │  ├─ totalInstalments (number of payments)
    │  ├─ instalmentFrequency ('monthly', 'quarterly')
    │  └─ startDate (first installment date)
    ├─ Create PaymentSchedule record
    │  ├─ Link to Transaction
    │  ├─ Link to Property
    │  ├─ Link to Client (payer)
    │  └─ status = 'active'
    └─ Generate Instalment records
       ├─ Calculate dates based on frequency
       ├─ Calculate amounts (equal or custom)
       └─ Set all to status = 'pending'
    ↓
Step 2: Down Payment Collection
    ├─ Collect down payment
    ├─ Update PaymentSchedule
    │  ├─ downPaymentStatus = 'paid'
    │  ├─ downPaymentDate = today
    │  └─ paidAmount += downPayment
    ├─ Issue receipt
    └─ Transaction can proceed
    ↓
Step 3: Installment Payments (Ongoing)
    
    For each installment:
    ├─ Due date approaches
    ├─ Send reminder (3 days before)
    ├─ Due date arrives
    
    Payment Received:
    ├─ Record payment
    │  ├─ Instalment.paidAmount = amount
    │  ├─ Instalment.paidDate = today
    │  ├─ Instalment.status = 'paid'
    │  └─ Instalment.paymentMethod = method
    ├─ Update PaymentSchedule
    │  ├─ paidAmount += payment
    │  ├─ remainingAmount -= payment
    │  ├─ onTimePayments++ (if on time)
    │  └─ Calculate next due
    ├─ Issue receipt
    └─ Update client record
    
    Payment Late:
    ├─ Instalment.status = 'overdue'
    ├─ Calculate late fee
    │  ├─ lateFee = amount × lateFeePercentage
    │  └─ Instalment.lateFee = calculated
    ├─ Send overdue notice
    ├─ Track latePayments++
    └─ Follow up with client
    
    Partial Payment:
    ├─ Instalment.paidAmount = partial amount
    ├─ Instalment.status = 'partial'
    ├─ remainingAmount = dueAmount - paidAmount
    └─ Schedule follow-up for remainder
    ↓
Step 4: Schedule Completion
    
    All Installments Paid:
    ├─ PaymentSchedule.remainingAmount = 0
    ├─ PaymentSchedule.status = 'completed'
    ├─ Transaction fully paid
    ├─ Can proceed to ownership transfer
    └─ Generate completion certificate
    
    Default (Missed Payments):
    ├─ PaymentSchedule.status = 'defaulted'
    ├─ PaymentSchedule.missedPayments > threshold
    ├─ Initiate recovery process
    ├─ Legal action if needed
    └─ Transaction may be cancelled
    
    Early Payoff:
    ├─ Client pays remaining balance
    ├─ Waive remaining installments
    ├─ PaymentSchedule.status = 'completed'
    └─ Update all remaining Instalments to 'waived'
    ↓
[END] Payment Schedule Closed

```

**Payment Status Transitions**:
```typescript
// Instalment Status Flow
'pending' → 'paid'      // Paid on time
'pending' → 'overdue'   // Past due date
'pending' → 'partial'   // Partially paid
'overdue' → 'paid'      // Late payment received
'partial' → 'paid'      // Remainder paid
'pending' → 'waived'    // Cancelled or forgiven

// PaymentSchedule Status Flow
'active' → 'completed'  // All paid
'active' → 'defaulted'  // Too many missed payments
'active' → 'cancelled'  // Transaction cancelled
```

---

### Commission Calculation & Tracking

```
┌─────────────────────────────────────────────────────────────┐
│  COMMISSION WORKFLOW                                          │
└─────────────────────────────────────────────────────────────┘

[START] Transaction Completed
    ↓
Step 1: Calculate Commission
    
    For Sales:
    ├─ commissionRate = Property.commissionRate || 2%
    ├─ commissionAmount = Transaction.agreedPrice × (rate / 100)
    └─ Example: PKR 10,000,000 × 2% = PKR 200,000
    
    For Rentals:
    ├─ commissionRate = 100% (one month's rent)
    ├─ commissionAmount = Transaction.monthlyRent × 1
    └─ Example: PKR 50,000 × 1 = PKR 50,000
    ↓
Step 2: Create Commission Record
    ├─ CommissionRecord created
    │  ├─ transactionId = Transaction.id
    │  ├─ propertyId = Property.id
    │  ├─ agentId = Transaction.agentId
    │  ├─ saleAmount = agreedPrice
    │  ├─ commissionRate = rate
    │  ├─ commissionAmount = calculated
    │  ├─ paidAmount = 0
    │  ├─ pendingAmount = commissionAmount
    │  └─ paymentStatus = 'pending'
    ├─ Update Transaction
    │  └─ Transaction.commissionStatus = 'pending'
    └─ Update Agent Performance
       └─ Agent.commissionEarned += commissionAmount
    ↓
Step 3: Commission Payment
    
    Full Payment:
    ├─ Record payment
    ├─ CommissionRecord.paidAmount = commissionAmount
    ├─ CommissionRecord.pendingAmount = 0
    ├─ CommissionRecord.paymentStatus = 'paid'
    ├─ CommissionRecord.paymentDates = [today]
    └─ Transaction.commissionStatus = 'paid'
    
    Partial Payment:
    ├─ CommissionRecord.paidAmount += payment
    ├─ CommissionRecord.pendingAmount -= payment
    ├─ CommissionRecord.paymentStatus = 'partial'
    ├─ CommissionRecord.paymentDates.push(today)
    └─ Transaction.commissionStatus = 'partial'
    
    Installment Commission:
    ├─ Payment linked to property payment schedule
    ├─ Commission paid as client pays
    └─ Proportional commission release
    ↓
[END] Commission Paid

```

---

## Agency & Investor Portfolio Flows

### Agency Portfolio Management

```
┌─────────────────────────────────────────────────────────────┐
│  AGENCY PORTFOLIO MANAGEMENT                                  │
└─────────────────────────────────────────────────────────────┘

Portfolio Categories:

1. AGENCY INVENTORY
   ├─ Properties: acquisitionType = 'inventory'
   ├─ Status: Available, Sold, Under Offer
   ├─ Tracking:
   │  ├─ Purchase cost
   │  ├─ Holding period
   │  ├─ Maintenance costs
   │  ├─ Target resale price
   │  └─ Actual sale price
   └─ Metrics:
      ├─ Total inventory value
      ├─ Average holding time
      ├─ Profit margin
      └─ ROI per property

2. CLIENT LISTINGS
   ├─ Properties: acquisitionType = 'client-listing'
   ├─ Status: Available, Sold
   ├─ Tracking:
   │  ├─ Commission rate
   │  ├─ Days on market
   │  ├─ View count
   │  └─ Lead generation
   └─ Metrics:
      ├─ Active listings
      ├─ Average commission
      ├─ Conversion rate
      └─ Average time to sale

3. INVESTOR PROPERTIES
   ├─ Properties: acquisitionType = 'investor'
   ├─ Status: Invested, Sold, Leased
   ├─ Tracking:
   │  ├─ Total investment
   │  ├─ Investor shares
   │  ├─ ROI by investor
   │  └─ Distributions made
   └─ Metrics:
      ├─ Total under management
      ├─ Average ROI
      ├─ Active investments
      └─ Completed investments

Dashboard Views:
├─ Portfolio Overview
├─ Performance Analytics
├─ Cash Flow Projection
└─ Inventory Aging Report

```

---

### Investor Management Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  INVESTOR MANAGEMENT WORKFLOW                                 │
└─────────────────────────────────────────────────────────────┘

[START] Investor Onboarding
    ↓
Step 1: Create Investor Profile
    ├─ Capture investor details
    ├─ Investment capacity
    ├─ Risk profile
    ├─ Preferences
    └─ Assign relationship manager
    ↓
Step 2: Investment Opportunity Presentation
    ├─ Identify suitable properties
    ├─ Prepare investment proposal
    │  ├─ Property details
    │  ├─ Financial projections
    │  ├─ ROI estimates
    │  └─ Risk analysis
    ├─ Present to investor
    └─ Investor decision
    ↓
Step 3: Investment Execution
    ├─ Investor commits
    ├─ Define share percentage
    ├─ Create investment record
    ├─ Purchase property
    └─ Update investor portfolio
    ↓
Step 4: Active Investment Management
    ├─ Property management
    ├─ Rental income (if applicable)
    │  ├─ Collect rent
    │  ├─ Distribute to investors
    │  └─ Record distributions
    ├─ Track appreciation
    ├─ Handle maintenance
    └─ Regular reporting to investors
    ↓
Step 5: Exit & Distribution
    ├─ Sell property
    ├─ Calculate total returns
    ├─ Distribute proceeds
    │  ├─ By share percentage
    │  ├─ Principal + profit
    │  └─ Update ROI metrics
    ├─ Close investment
    └─ Update investor records
    ↓
[END] Investment Complete

```

---

## Dashboard Intelligence Workflows

### Dashboard V4 Intelligent Insights Workflow

**Scenario**: Generating intelligent insights from dashboard data

```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD V4 INTELLIGENT INSIGHTS WORKFLOW                  │
└─────────────────────────────────────────────────────────────┘

[START] Dashboard Data Available
    ↓
Step 1: Data Collection
    ├─ Gather data from all modules
    ├─ Include:
    │  ├─ Property transactions
    │  ├─ Lead pipeline
    │  ├─ Payment schedules
    │  ├─ Commission records
    │  ├─ Investor portfolios
    │  └─ Agent performance
    ↓
Step 2: Data Processing
    ├─ Clean and normalize data
    ├─ Apply filters and aggregations
    ├─ Generate key metrics
    └─ Store processed data
    ↓
Step 3: Insight Generation
    ├─ Use machine learning algorithms
    ├─ Identify trends and patterns
    ├─ Generate actionable insights
    └─ Highlight opportunities and risks
    ↓
Step 4: Visualization
    ├─ Create dynamic charts and graphs
    ├─ Display insights on dashboard
    ├─ Include:
    │  ├─ Revenue vs targets
    │  ├─ Team productivity
    │  ├─ Market trends
    │  └─ Growth opportunities
    └─ Provide drill-down capabilities
    ↓
Step 5: Reporting
    ├─ Generate reports
    │  ├─ Daily activity
    │  ├─ Weekly performance
    │  ├─ Monthly summaries
    │  └─ Financial reports
    └─ Share with management
    ↓
[END] Insights Generated

```

**Key Points**:
- ✅ Data collection and processing
- ✅ Insight generation using machine learning
- ✅ Visualization and reporting
- ✅ Actionable insights for decision-making

---

## Task Management Workflows

### Task Creation Workflow

**Scenario**: Creating a new task

```
┌─────────────────────────────────────────────────────────────┐
│  TASK CREATION WORKFLOW                                      │
└─────────────────────────────────────────────────────────────┘

[START] Task Creation Request
    ↓
Step 1: Define Task Details
    ├─ Task title
    ├─ Description
    ├─ Due date
    ├─ Priority
    ├─ Assignee
    └─ Related property/lead/transaction
    ↓
Step 2: Create Task Record
    ├─ Add to Task Management module
    ├─ Link to related entities
    └─ Set status to 'open'
    ↓
Step 3: Notify Assignee
    ├─ Send email notification
    ├─ Add to assignee's task list
    └─ Set reminder
    ↓
[END] Task Created

```

**Key Points**:
- ✅ Task details definition
- ✅ Task record creation
- ✅ Assignee notification

---

### Task Completion Workflow

**Scenario**: Completing a task

```
┌─────────────────────────────────────────────────────────────┐
│  TASK COMPLETION WORKFLOW                                    │
└─────────────────────────────────────────────────────────────┘

[START] Task Assigned
    ↓
Step 1: Task Execution
    ├─ Assignee performs task
    ├─ Records progress
    └─ Upload relevant documents
    ↓
Step 2: Mark Task as Complete
    ├─ Assignee updates task status
    ├─ Set completion date
    └─ Add final notes
    ↓
Step 3: Notify Stakeholders
    ├─ Send completion notification
    ├─ Update related entities
    └─ Archive task
    ↓
[END] Task Completed

```

**Key Points**:
- ✅ Task execution
- ✅ Task completion marking
- ✅ Stakeholder notification

---

## Reports & Analytics Workflows

### Financial Reports Generation Workflow

**Scenario**: Generating financial reports

```
┌─────────────────────────────────────────────────────────────┐
│  FINANCIAL REPORTS GENERATION WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

[START] Report Generation Request
    ↓
Step 1: Define Report Parameters
    ├─ Time period
    ├─ Report type (daily, weekly, monthly)
    ├─ Include entities (properties, leads, transactions)
    └─ Metrics (revenue, expenses, profit margins)
    ↓
Step 2: Data Collection
    ├─ Gather data from all modules
    ├─ Include:
    │  ├─ Property transactions
    │  ├─ Lead pipeline
    │  ├─ Payment schedules
    │  ├─ Commission records
    │  ├─ Investor portfolios
    │  └─ Agent performance
    ↓
Step 3: Data Processing
    ├─ Clean and normalize data
    ├─ Apply filters and aggregations
    ├─ Generate key metrics
    └─ Store processed data
    ↓
Step 4: Report Generation
    ├─ Use reporting tools
    ├─ Create charts and graphs
    ├─ Include:
    │  ├─ Revenue vs targets
    │  ├─ Team productivity
    │  ├─ Market trends
    │  └─ Growth opportunities
    └─ Provide drill-down capabilities
    ↓
Step 5: Share Report
    ├─ Generate PDF/Excel report
    ├─ Share with management
    └─ Archive report
    ↓
[END] Report Generated

```

**Key Points**:
- ✅ Report parameters definition
- ✅ Data collection and processing
- ✅ Report generation
- ✅ Report sharing

---

### Analytics Dashboard Workflow

**Scenario**: Accessing analytics dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ANALYTICS DASHBOARD WORKFLOW                                │
└─────────────────────────────────────────────────────────────┘

[START] Dashboard Access Request
    ↓
Step 1: Authenticate User
    ├─ Verify user credentials
    ├─ Check user permissions
    └─ Grant access
    ↓
Step 2: Load Dashboard Data
    ├─ Gather data from all modules
    ├─ Include:
    │  ├─ Property transactions
    │  ├─ Lead pipeline
    │  ├─ Payment schedules
    │  ├─ Commission records
    │  ├─ Investor portfolios
    │  └─ Agent performance
    ↓
Step 3: Data Processing
    ├─ Clean and normalize data
    ├─ Apply filters and aggregations
    ├─ Generate key metrics
    └─ Store processed data
    ↓
Step 4: Display Insights
    ├─ Create dynamic charts and graphs
    ├─ Display insights on dashboard
    ├─ Include:
    │  ├─ Revenue vs targets
    │  ├─ Team productivity
    │  ├─ Market trends
    │  └─ Growth opportunities
    └─ Provide drill-down capabilities
    ↓
[END] Insights Displayed

```

**Key Points**:
- ✅ User authentication
- ✅ Data collection and processing
- ✅ Insights display

---

## Sharing & Collaboration Workflows

### Property Sharing Workflow

**Scenario**: Sharing a property with another agent

```
┌─────────────────────────────────────────────────────────────┐
│  PROPERTY SHARING WORKFLOW                                   │
└─────────────────────────────────────────────────────────────┘

[START] Sharing Request
    ↓
Step 1: Define Sharing Parameters
    ├─ Property ID
    ├─ Agent ID (recipient)
    ├─ Sharing permissions (view, edit, manage)
    └─ Expiry date
    ↓
Step 2: Create Sharing Record
    ├─ Add to Sharing Management module
    ├─ Link to property and agent
    └─ Set status to 'active'
    ↓
Step 3: Notify Recipient
    ├─ Send email notification
    ├─ Add to recipient's property list
    └─ Set reminder
    ↓
[END] Property Shared

```

**Key Points**:
- ✅ Sharing parameters definition
- ✅ Sharing record creation
- ✅ Recipient notification

---

### Collaboration Workflow

**Scenario**: Collaborating on a property

```
┌─────────────────────────────────────────────────────────────┐
│  COLLABORATION WORKFLOW                                      │
└─────────────────────────────────────────────────────────────┘

[START] Collaboration Request
    ↓
Step 1: Define Collaboration Parameters
    ├─ Property ID
    ├─ Agent IDs (collaborators)
    ├─ Collaboration permissions (view, edit, manage)
    └─ Expiry date
    ↓
Step 2: Create Collaboration Record
    ├─ Add to Collaboration Management module
    ├─ Link to property and agents
    └─ Set status to 'active'
    ↓
Step 3: Notify Collaborators
    ├─ Send email notification
    ├─ Add to collaborators' property list
    └─ Set reminder
    ↓
[END] Collaboration Established

```

**Key Points**:
- ✅ Collaboration parameters definition
- ✅ Collaboration record creation
- ✅ Collaborators notification

---

## User Workflows by Role

### Agent Daily Workflow

```
Morning:
├─ Login to workspace
├─ Check dashboard
│  ├─ My active properties
│  ├─ New leads assigned
│  ├─ Follow-ups due today
│  └─ Active transactions
├─ Prioritize follow-ups
└─ Plan day's activities

Property Management:
├─ Add new listing
│  ├─ Client wants to sell
│  ├─ Visit property
│  ├─ Take photos
│  ├─ Create property record
│  └─ Set listing price
├─ Update existing properties
│  ├─ Price changes
│  ├─ Status updates
│  └─ Add new photos

Lead Management:
├─ New leads
│  ├─ Review new assignments
│  ├─ Call within 24 hours
│  ├─ Qualify leads
│  └─ Schedule follow-ups
├─ Follow-ups
│  ├─ Check due today list
│  ├─ Call/email clients
│  ├─ Record activities
│  └─ Schedule next actions
├─ Property viewings
│  ├─ Prepare property
│  ├─ Meet client
│  ├─ Show property
│  └─ Record feedback

Transaction Management:
├─ Active deals
│  ├─ Progress through stages
│  ├─ Chase documentation
│  ├─ Follow up on payments
│  └─ Coordinate with clients
├─ Close deals
│  ├─ Complete final steps
│  ├─ Ownership transfer
│  └─ Collect commission

Evening:
├─ Update all activities
├─ Set tomorrow's follow-ups
└─ Review performance metrics
```

### Admin Daily Workflow

```
Morning:
├─ Login to workspace
├─ Review workspace dashboard
│  ├─ All active properties
│  ├─ All leads (all agents)
│  ├─ All transactions
│  └─ Team performance
├─ Check critical items
│  ├─ Overdue follow-ups
│  ├─ Stalled transactions
│  ├─ Hot leads
│  └─ Payment issues

Team Management:
├─ Assign new leads
│  ├─ Review unassigned leads
│  ├─ Match to best agent
│  ├─ Assign and notify
├─ Redistribute workload
│  ├─ Balance across team
│  ├─ Handle agent absences
│  └─ Reassign if needed
├─ Monitor performance
│  ├─ Agent activity levels
│  ├─ Conversion rates
│  ├─ Response times
│  └─ Commission earnings

Operations:
├─ Approve transactions
├─ Review documentation
├─ Handle escalations
├─ Coordinate with agents
└─ Client relationship management

Reporting:
├─ Generate reports
│  ├─ Daily activity
│  ├─ Weekly performance
│  ├─ Monthly summaries
│  └─ Financial reports
└─ Share with management
```

### Super Admin Monthly Workflow

```
Strategic:
├─ Review workspace performance
│  ├─ Revenue vs targets
│  ├─ Team productivity
│  ├─ Market trends
│  └─ Growth opportunities
├─ Plan next month
│  ├─ Set targets
│  ├─ Allocate resources
│  └─ Strategy adjustments

People:
├─ Review team performance
├─ Conduct evaluations
├─ Handle HR matters
├─ Onboard new agents
└─ Training & development

Financial:
├─ Review financials
│  ├─ Revenue
│  ├─ Expenses
│  ├─ Profit margins
│  └─ Cash flow
├─ Commission payouts
├─ Budget planning
└─ Financial forecasting

System:
├─ Configure settings
├─ Update commission rates
├─ Manage users
└─ Workspace optimization
```

---

## Conclusion

This document covers all major business workflows in the EstateManager Agency Module:

✅ **Property Lifecycles** (Client listing, Agency inventory, Investor properties, Re-listing)  
✅ **Transaction Cycles** (Sell, Purchase, Rent - complete stage progressions)  
✅ **Lead Pipeline** (5-stage conversion funnel)  
✅ **Requirements Matching Workflows** (Buyer, Rent)  
✅ **Contact Management Workflows** (Lead → Contact conversion)  
✅ **Payment Flows** (Installment schedules, Commission tracking)  
✅ **Portfolio Management** (Agency & Investor portfolios)  
✅ **Dashboard Intelligence Workflows** (V4 insights)  
✅ **Role-Based Workflows** (Agent, Admin, Super Admin daily activities)  
✅ **Task Management Workflows** (Phase 5)  
✅ **Reports & Analytics Workflows** (Phase 5)  
✅ **Sharing & Collaboration Workflows** (Phase 5)  
✅ **Smart Matching Workflows** (Phase 5)  
✅ **Cross-Agent Offer Workflows** (Phase 5)  

**Next Document**: `05-MODULE-FEATURE-MAP.md`