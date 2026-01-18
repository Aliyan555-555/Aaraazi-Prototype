# Transactions Module - Complete User Guide

**aaraazi Real Estate Management Platform**  
**Module**: Transactions (Sell/Purchase/Rent Cycles)  
**Version**: 4.1  
**Last Updated**: January 15, 2026

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Understanding the Transaction Trinity](#understanding-the-transaction-trinity)
3. [Who Uses This Module](#who-uses-this-module)
4. [Sell Cycles - Complete Guide](#sell-cycles---complete-guide)
5. [Purchase Cycles - Complete Guide](#purchase-cycles---complete-guide)
6. [Rent Cycles - Complete Guide](#rent-cycles---complete-guide)
7. [Common Workflows](#common-workflows)
8. [Commission Tracking](#commission-tracking)
9. [Payment Schedules](#payment-schedules)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)
12. [FAQs](#faqs)

---

## Overview

### What is the Transactions Module?

The Transactions Module is where **real estate deals happen**. It manages the complete lifecycle of buying, selling, and renting properties through structured, stage-based workflows called "Cycles".

**Think of it like this**: If Properties are the "products", Transactions are the "sales process" that moves them from one person to another.

### The Three Transaction Types

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ SELL CYCLE  │  │  BUY CYCLE  │  │ RENT CYCLE  │
│  (7 stages) │  │  (7 stages) │  │  (9 stages) │
└─────────────┘  └─────────────┘  └─────────────┘
      │                 │                  │
      ▼                 ▼                  ▼
  Selling a         Buying a         Renting a
  property          property         property
```

### What Can You Do?

✅ **Start Transactions** - Begin sell, buy, or rent cycles  
✅ **Track Progress** - Move through stages systematically  
✅ **Manage Documents** - Store agreements, contracts, certificates  
✅ **Record Payments** - Track down payments, installments  
✅ **Calculate Commission** - Auto-calculate and track earnings  
✅ **Set Schedules** - Payment installment plans  
✅ **View History** - Complete audit trail of all activities  
✅ **Generate Reports** - Transaction performance analytics  

---

## Understanding the Transaction Trinity

### Why Three Types?

Each transaction type serves a different business purpose:

| Type | Your Role | Purpose | Example |
|------|-----------|---------|---------|
| **Sell Cycle** | Seller's Agent | Sell properties | You list Mr. Ahmed's villa and find a buyer |
| **Purchase Cycle** | Buyer's Agent | Buy properties | You help client buy a commercial plaza |
| **Rent Cycle** | Leasing Agent | Lease properties | You rent apartment to tenant |

### The Complete Picture

```
SELL CYCLE + PURCHASE CYCLE = Complete Property Sale

Your Agency (Sell):          Other Agency (Purchase):
┌─────────────┐              ┌─────────────┐
│ Seller:     │              │ Buyer:      │
│ Ahmed Khan  │──Property──▶│ Sara Ali    │
│             │              │             │
│ You help    │              │ They help   │
│ sell it     │              │ buy it      │
└─────────────┘              └─────────────┘

Result: Both earn commission!
```

---

## Sell Cycles - Complete Guide

### What is a Sell Cycle?

A **Sell Cycle** is the process of selling a property from listing to completion. It has **7 stages** that guide you through the entire sales process.

### The 7 Stages Explained

```
Stage 1: LISTING
   ↓ (Property listed, marketing started)
Stage 2: SHOWING
   ↓ (Viewings with potential buyers)
Stage 3: OFFER
   ↓ (Buyer makes an offer)
Stage 4: NEGOTIATION
   ↓ (Price and terms discussed)
Stage 5: AGREEMENT
   ↓ (Sale agreement signed)
Stage 6: PAPERWORK
   ↓ (Legal documentation)
Stage 7: COMPLETION
   ✓ (Sale complete, ownership transferred)
```

### How to Start a Sell Cycle

#### Method 1: From Property Page

**Steps**:
1. Go to **Properties**
2. Open a property detail page
3. Click **"Start Sell Cycle"** button
4. Property is pre-filled
5. Complete the form:

```
┌──────────────────────────────────┐
│ START SELL CYCLE                 │
│                                  │
│ Property: Modern Villa DHA       │
│ (Auto-filled from property)      │
│                                  │
│ Seller:                          │
│ [Ahmed Khan ▼] (Owner)           │
│                                  │
│ Agreed Price:                    │
│ PKR [75,000,000]                 │
│                                  │
│ Your Commission:                 │
│ [2] % = PKR 1,500,000           │
│                                  │
│ Payment Type:                    │
│ ● Full Payment                   │
│ ○ Installments                   │
│                                  │
│ [Start Cycle]                    │
└──────────────────────────────────┘
```

6. Click **"Start Cycle"**
7. Cycle is now in Stage 1 (Listing)

#### Method 2: From Transactions Page

**Steps**:
1. Go to **Transactions**
2. Click **"+ Start Sell Cycle"**
3. Select property
4. Fill in seller details
5. Set pricing and terms
6. Start cycle

### Working Through Sell Cycle Stages

#### Stage 1: Listing
**What happens**: Property is officially listed for sale.

**Your actions**:
- Upload property photos
- Write compelling description
- Set competitive pricing
- Start marketing activities
- Share on platforms
- Generate leads

**Move to next stage when**: You have interested buyers to show the property to.

**To move**: Click **"Move to Showing"** button.

---

#### Stage 2: Showing
**What happens**: Conducting property viewings with potential buyers.

**Your actions**:
- Schedule viewings
- Show property to buyers
- Collect feedback
- Answer questions
- Create deals with serious buyers

**Record activities**:
```
┌──────────────────────────────────┐
│ LOG VIEWING                      │
│                                  │
│ Date: [Tomorrow, 10:00 AM]       │
│ Buyer: [Sara Ali]                │
│ Feedback: [Very interested...]   │
│ Next Action: [Follow up call]    │
│                                  │
│ [Save Activity]                  │
└──────────────────────────────────┘
```

**Move to next stage when**: A buyer makes an offer.

---

#### Stage 3: Offer
**What happens**: Buyer has submitted a formal offer.

**Your actions**:
- Review offer details
- Present to seller
- Discuss terms
- Record offer in system

**Offer details**:
```
┌──────────────────────────────────┐
│ OFFER RECEIVED                   │
│                                  │
│ From: Sara Ali                   │
│ Offered Price: PKR 72,000,000    │
│ (Listed at PKR 75,000,000)       │
│                                  │
│ Terms:                           │
│ • Down payment: PKR 25M          │
│ • Installments: 10 months        │
│ • Closing: 30 days               │
│                                  │
│ Status: ● Under Review           │
│                                  │
│ [Accept] [Counter] [Reject]      │
└──────────────────────────────────┘
```

**Move to next stage when**: Offer is accepted and negotiation begins.

---

#### Stage 4: Negotiation
**What happens**: Buyer and seller negotiate final terms.

**Your actions**:
- Facilitate negotiations
- Communicate offers/counter-offers
- Find middle ground
- Get verbal agreement

**Negotiation log**:
```
Day 1: Buyer offers PKR 72M
Day 2: Seller counters PKR 74M
Day 3: Buyer counters PKR 73M
Day 4: Seller accepts PKR 73.5M ✓
```

**Move to next stage when**: Both parties agree on price and terms.

---

#### Stage 5: Agreement
**What happens**: Formal sale agreement is signed.

**Your actions**:
- Prepare sale agreement
- Review with both parties
- Schedule signing meeting
- Get signatures
- Upload signed document

**Agreement checklist**:
```
☑ Sale agreement drafted
☑ Legal review completed
☑ Buyer reviewed and approved
☑ Seller reviewed and approved
☑ Signing meeting scheduled
☑ Down payment confirmed
☑ Earnest money received
☑ Documents uploaded to system
```

**Move to next stage when**: Agreement is fully executed.

---

#### Stage 6: Paperwork
**What happens**: Complete legal documentation and registration.

**Your actions**:
- Prepare transfer documents
- Coordinate with legal team
- Submit to authorities
- Pay stamp duty
- Get NOC certificates
- Process registrations

**Documents needed**:
```
☑ Transfer of ownership deed
☑ Tax clearance certificate
☑ NOC from society
☑ Utility bills clearance
☑ Original property documents
☑ ID copies (buyer & seller)
☑ Payment receipts
```

**Move to next stage when**: All legal work is complete.

---

#### Stage 7: Completion
**What happens**: Sale is finalized, ownership transferred.

**Your actions**:
- Confirm full payment received
- Hand over property keys
- Transfer ownership officially
- Close the cycle
- Record commission earned

**Completion form**:
```
┌──────────────────────────────────┐
│ COMPLETE SELL CYCLE              │
│                                  │
│ Final Sale Price: PKR 73,500,000 │
│ Commission: PKR 1,470,000 (2%)   │
│                                  │
│ Payment Status: ✓ Received       │
│ Ownership: ✓ Transferred         │
│ Keys: ✓ Handed over              │
│                                  │
│ Completion Date: [Today]         │
│                                  │
│ [Complete Cycle] [Cancel]        │
└──────────────────────────────────┘
```

**Cycle Status**: ✓ **COMPLETED**

**Automatic actions**:
- Property status → "Sold"
- Ownership → Transferred to buyer
- Commission → Recorded as "Pending"
- Transaction → Moved to "Completed"

---

## Purchase Cycles - Complete Guide

### What is a Purchase Cycle?

A **Purchase Cycle** is the process of buying a property for a client or for your agency. It has **7 stages** similar to sell cycles but from the buyer's perspective.

### The 7 Stages Explained

```
Stage 1: REQUIREMENT
   ↓ (Buyer's requirements defined)
Stage 2: SEARCHING
   ↓ (Looking for suitable properties)
Stage 3: VIEWING
   ↓ (Viewing shortlisted properties)
Stage 4: OFFER MADE
   ↓ (Offer submitted to seller)
Stage 5: AGREEMENT
   ↓ (Purchase agreement signed)
Stage 6: PAPERWORK
   ↓ (Legal documentation)
Stage 7: COMPLETION
   ✓ (Purchase complete, ownership received)
```

### Three Purchase Types

#### Type 1: Agency Purchase (For Inventory)
**You buy it** to resell later for profit.

```
Agency → Buys Property → Owns It → Sells Later
```

**Example**: Buy villa for PKR 50M, renovate, sell for PKR 75M.

#### Type 2: Client Purchase (Brokerage)
**Client buys it**, you earn commission.

```
Client → Wants Property → You Help Buy → Earn Commission
```

**Example**: Help Mr. Ahmed buy an apartment, earn 2% commission.

#### Type 3: Investor Purchase (Syndication)
**Multiple investors buy** together, shared ownership.

```
Investors → Pool Money → Buy Together → Share Ownership
```

**Example**: You + 3 investors buy commercial plaza, each owns 25%.

### How to Start a Purchase Cycle

**Steps**:
1. Go to **Transactions**
2. Click **"+ Start Purchase Cycle"**
3. Select purchase type:

```
┌──────────────────────────────────┐
│ SELECT PURCHASE TYPE             │
│                                  │
│ ● Agency Purchase                │
│   (For your inventory)           │
│                                  │
│ ○ Client Purchase                │
│   (Helping a buyer)              │
│                                  │
│ ○ Investor Purchase              │
│   (Shared ownership)             │
│                                  │
│ [Continue]                       │
└──────────────────────────────────┘
```

4. **If Agency Purchase**:
```
Property: [Select property...]
Purchase Price: PKR [50,000,000]
Seller: [Ahmed Khan]
Funding Source: [Agency Capital ▼]
Purpose: ● For Resale  ○ For Rental
```

5. **If Client Purchase**:
```
Buyer: [Sara Ali]
Property: [Select property...]
Purchase Price: PKR [45,000,000]
Commission Rate: [2] %
Your Commission: PKR 900,000
```

6. **If Investor Purchase**:
```
Property: [Commercial Plaza]
Total Investment: PKR [120,000,000]
Investors:
  ☑ Ahmed (30%) - PKR 36M
  ☑ Sara (20%) - PKR 24M
  ☑ Khan (20%) - PKR 24M
  ☑ Agency (30%) - PKR 36M
```

7. Click **"Start Cycle"**

### Working Through Purchase Cycle Stages

#### Stage 1: Requirement
**Define what the buyer needs**.

**Buyer requirements**:
```
Budget: PKR 40M - 50M
Type: Apartment
Location: Clifton or DHA
Bedrooms: 3+
Must-have: Parking, Security
```

#### Stage 2: Searching
**Find properties matching requirements**.

**Your actions**:
- Search property database
- Contact other agents
- Check market listings
- Shortlist 5-10 options

#### Stage 3: Viewing
**Show shortlisted properties**.

**Your actions**:
- Schedule viewings
- Accompany buyer
- Collect feedback
- Narrow down to top 2-3

#### Stage 4: Offer Made
**Submit offer to seller**.

**Your actions**:
- Prepare offer
- Submit to seller's agent
- Wait for response
- Negotiate if needed

#### Stage 5-7: Agreement, Paperwork, Completion
Same as Sell Cycle but from buyer's side.

---

## Rent Cycles - Complete Guide

### What is a Rent Cycle?

A **Rent Cycle** manages property leasing. It has **9 stages** (more than sell/buy because of move-in/move-out).

### The 9 Stages Explained

```
Stage 1: LISTING FOR RENT
   ↓ (Property available for lease)
Stage 2: TENANT SEARCH
   ↓ (Finding suitable tenants)
Stage 3: VIEWING
   ↓ (Showing property to prospects)
Stage 4: APPLICATION
   ↓ (Tenant applies, background check)
Stage 5: LEASE AGREEMENT
   ↓ (Lease contract signed)
Stage 6: MOVE-IN
   ↓ (Tenant moves in, deposit paid)
Stage 7: ACTIVE LEASE
   ↓ (Ongoing tenancy, rent collection)
Stage 8: LEASE RENEWAL/TERMINATION
   ↓ (Extend or end lease)
Stage 9: MOVE-OUT
   ✓ (Tenant moves out, deposit returned)
```

### How to Start a Rent Cycle

**Steps**:
1. Go to **Transactions**
2. Click **"+ Start Rent Cycle"**
3. Fill in details:

```
┌──────────────────────────────────┐
│ START RENT CYCLE                 │
│                                  │
│ Property: [Modern Apartment]     │
│ Owner: [Ahmed Khan]              │
│                                  │
│ Monthly Rent: PKR [150,000]      │
│ Security Deposit: PKR [300,000]  │
│ Lease Duration: [12] months      │
│                                  │
│ Your Commission:                 │
│ [1 month] = PKR 150,000          │
│                                  │
│ Available From: [Next week]      │
│                                  │
│ [Start Cycle]                    │
└──────────────────────────────────┘
```

4. Click **"Start Cycle"**

### Rent Cycle Special Features

#### Recurring Rent Collection
**Automatically track monthly rent**:

```
Monthly Rent: PKR 150,000
Due Date: 1st of each month

Payment Schedule:
☑ Jan 2026 - Paid
☑ Feb 2026 - Paid
⏰ Mar 2026 - Due in 5 days
⚪ Apr 2026 - Upcoming
⚪ May 2026 - Upcoming
```

#### Lease Renewal
**At end of lease**:

```
┌──────────────────────────────────┐
│ LEASE EXPIRING                   │
│                                  │
│ Current Lease: Jan 2026 - Dec 2026│
│ Expiry: Dec 31, 2026 (30 days)   │
│                                  │
│ Options:                         │
│ ● Renew Lease                    │
│   New rent: PKR [160,000] (+7%)  │
│   Duration: [12] months          │
│                                  │
│ ○ Terminate Lease                │
│   Move-out date: [Dec 31]        │
│                                  │
│ [Continue]                       │
└──────────────────────────────────┘
```

---

## Common Workflows

### Workflow 1: Complete Sell Cycle (Standard)

**Scenario**: Selling Mr. Ahmed's villa to Sara Ali.

**Timeline**: 45-60 days

**Steps**:

**Week 1: Listing & Marketing**
```
Day 1: Start Sell Cycle (Stage 1: Listing)
Day 2: Upload photos, write description
Day 3: Set pricing, start marketing
Day 4-7: Share on platforms, generate leads
```

**Week 2-3: Showings**
```
Day 8: Move to Stage 2 (Showing)
Day 9-14: Schedule viewings (5-10 prospects)
Day 15-21: Collect feedback, follow up
```

**Week 4: Offer & Negotiation**
```
Day 22: Sara makes offer (Stage 3: Offer)
Day 23: Present to seller
Day 24-26: Negotiate (Stage 4: Negotiation)
Day 27: Agreement on PKR 73.5M
```

**Week 5-6: Agreement & Paperwork**
```
Day 28: Draft agreement (Stage 5: Agreement)
Day 30: Signatures obtained
Day 31-40: Legal work (Stage 6: Paperwork)
Day 35: Down payment received
```

**Week 7: Completion**
```
Day 41: Final payment confirmed
Day 42: Transfer ownership
Day 43: Hand over keys
Day 44: Complete cycle (Stage 7: Completion)
Day 45: Commission recorded
```

**Result**:
- ✓ Property sold
- ✓ Commission: PKR 1,470,000 (2%)
- ✓ Seller satisfied
- ✓ Buyer satisfied

### Workflow 2: Agency Inventory Purchase & Resale

**Scenario**: Buy villa for PKR 50M, sell for PKR 75M.

**Phase 1: Purchase (30 days)**
```
Start Purchase Cycle (Agency Purchase)
  → Find suitable property
  → Negotiate price: PKR 50M
  → Complete purchase
  → Record acquisition cost
```

**Phase 2: Hold & Improve (60 days)**
```
Property in inventory
  → Minor renovations: PKR 5M
  → Professional photos
  → Updated description
```

**Phase 3: Sell (45 days)**
```
Start Sell Cycle
  → List at PKR 75M
  → Find buyer
  → Sell for PKR 73.5M
  → Complete sale
```

**Financial Summary**:
```
Purchase Price:    PKR 50,000,000
Renovation Costs:  PKR  5,000,000
Selling Costs:     PKR  1,000,000
Total Costs:       PKR 56,000,000

Sale Price:        PKR 73,500,000
Total Costs:       PKR 56,000,000
────────────────────────────────
Net Profit:        PKR 17,500,000 (31% ROI)
```

### Workflow 3: Dual-Agent Transaction

**Scenario**: Your agency has both sides (seller AND buyer).

**Setup**:
```
Seller: Ahmed Khan (Your client)
Buyer: Sara Ali (Also your client)
Property: Modern Villa
```

**Cycles**:
1. **Start Sell Cycle** (You represent seller)
2. **Start Purchase Cycle** (You represent buyer)
3. Both cycles link to same property

**Commission**:
```
Sale Price: PKR 75M

From Seller (Sell Cycle):
  2% commission = PKR 1,500,000

From Buyer (Purchase Cycle):
  2% commission = PKR 1,500,000

Total Commission: PKR 3,000,000 (4%)
```

**Ethics Note**: Disclose dual representation to both parties.

---

## Commission Tracking

### How Commission is Calculated

#### Sell Cycles
```
Sale Price × Commission % = Commission Amount

Example:
PKR 75,000,000 × 2% = PKR 1,500,000
```

#### Purchase Cycles
```
Same as sell cycles (typically 2%)

Example:
PKR 45,000,000 × 2% = PKR 900,000
```

#### Rent Cycles
```
Monthly Rent × Months = Commission Amount

Example (1 month commission):
PKR 150,000 × 1 = PKR 150,000

Example (2 months commission):
PKR 150,000 × 2 = PKR 300,000
```

### Commission States

```
┌─────────────┐
│   PENDING   │ ← Deal complete, waiting for payment
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    PAID     │ ← Commission received
└─────────────┘
```

### Recording Commission Payment

**When commission is received**:

```
┌──────────────────────────────────┐
│ RECORD COMMISSION PAYMENT        │
│                                  │
│ Transaction: SELL-001            │
│ Commission Due: PKR 1,500,000    │
│                                  │
│ Amount Received: PKR [1,500,000] │
│ Payment Date: [Today]            │
│ Payment Method: [Bank Transfer]  │
│                                  │
│ Reference: [TXN-12345]           │
│                                  │
│ Notes:                           │
│ ┌──────────────────────────┐    │
│ │ Full commission received  │    │
│ │ from seller's account     │    │
│ └──────────────────────────┘    │
│                                  │
│ [Record Payment] [Cancel]        │
└──────────────────────────────────┘
```

---

## Payment Schedules

### What are Payment Schedules?

**Payment Schedules** track installment payments from buyers.

**Example**:
```
Property Price: PKR 75M
Down Payment: PKR 25M (33%)
Remaining: PKR 50M
Installments: 10 monthly (PKR 5M each)
```

### Creating a Payment Schedule

**During Sell Cycle (Stage 5: Agreement)**:

```
┌──────────────────────────────────┐
│ CREATE PAYMENT SCHEDULE          │
│                                  │
│ Total Amount: PKR 75,000,000     │
│                                  │
│ Down Payment:                    │
│ Amount: PKR [25,000,000]         │
│ Date: [Signing day]              │
│                                  │
│ Remaining: PKR 50,000,000        │
│                                  │
│ Number of Installments: [10]     │
│ Amount per Installment: PKR 5M   │
│ (Auto-calculated)                │
│                                  │
│ Frequency: ● Monthly             │
│            ○ Quarterly           │
│                                  │
│ First Installment: [Next month]  │
│                                  │
│ [Create Schedule]                │
└──────────────────────────────────┘
```

### Tracking Payments

**Payment schedule view**:

```
┌──────────────────────────────────┐
│ PAYMENT SCHEDULE: PS-001         │
│ Buyer: Sara Ali                  │
│ Property: Modern Villa           │
│                                  │
│ Progress: PKR 35M / PKR 75M (47%)│
│ [▓▓▓▓▓▓▓▓▓░░░░░░░░░░]           │
│                                  │
│ PAYMENTS:                        │
│ 1. Down Payment                  │
│    ✓ PKR 25M - Paid (Jan 1)      │
│                                  │
│ 2. Installment 1                 │
│    ✓ PKR 5M - Paid (Feb 1)       │
│                                  │
│ 3. Installment 2                 │
│    ✓ PKR 5M - Paid (Mar 1)       │
│                                  │
│ 4. Installment 3                 │
│    ⏰ PKR 5M - Due Apr 1 (5 days)│
│    [Record Payment]              │
│                                  │
│ 5-11. Future Installments        │
│    ⚪ PKR 40M remaining           │
│                                  │
│ [View Full Schedule]             │
└──────────────────────────────────┘
```

### Recording Installment Payment

**When payment is received**:

```
┌──────────────────────────────────┐
│ RECORD PAYMENT                   │
│                                  │
│ Installment: #3                  │
│ Due Amount: PKR 5,000,000        │
│ Due Date: Apr 1, 2026            │
│                                  │
│ Amount Received: PKR [5,000,000] │
│ Payment Date: [Mar 28, 2026]     │
│ (3 days early!)                  │
│                                  │
│ Payment Method:                  │
│ ● Bank Transfer                  │
│ ○ Cash                           │
│ ○ Cheque                         │
│                                  │
│ Reference: [TXN-67890]           │
│                                  │
│ [Record Payment] [Cancel]        │
└──────────────────────────────────┘
```

**Result**: Installment marked as paid, schedule updated.

---

## Tips & Best Practices

### General Best Practices

✅ **DO**:
- **Start cycle early** - As soon as serious interest
- **Move stages logically** - Don't skip stages
- **Document everything** - Upload all agreements
- **Update regularly** - Keep cycle current
- **Set realistic timelines** - Don't rush stages
- **Communicate clearly** - Keep all parties informed
- **Track payments diligently** - Record immediately
- **Close cycles promptly** - Don't leave incomplete

❌ **DON'T**:
- Skip stages (breaks audit trail)
- Leave cycles incomplete indefinitely
- Forget to upload documents
- Miss payment deadlines
- Start cycle without serious buyer
- Neglect commission tracking
- Ignore failed cycles (mark as lost)

### Sell Cycle Tips

**Pricing Strategy**:
```
Listed Price:     PKR 75M (Start high)
Expected Sale:    PKR 73M (Target)
Minimum Accept:   PKR 70M (Bottom line)
```

**Timing Benchmarks**:
- Listing to Showing: 1-2 weeks
- Showing to Offer: 2-4 weeks
- Offer to Agreement: 1-2 weeks
- Agreement to Completion: 2-4 weeks
- **Total**: 6-12 weeks typically

### Purchase Cycle Tips

**Buyer Requirements**:
- Get detailed requirements upfront
- Understand budget clearly
- Know must-haves vs nice-to-haves
- Set realistic expectations

**Property Search**:
- Shortlist 10-15 properties
- Show top 5-7 to buyer
- Narrow to top 2-3
- Make offer on #1 choice

### Rent Cycle Tips

**Tenant Screening**:
```
✓ Background check
✓ Employment verification
✓ Credit check
✓ Reference checks
✓ Income verification (3x rent minimum)
```

**Lease Terms**:
- Standard: 12 months
- Include rent escalation (5-10% annual)
- Maintenance responsibilities clear
- Security deposit (2-3 months rent)

---

## Troubleshooting

### Common Issues

#### Issue: Can't Move to Next Stage

**Problem**: "Move to Next Stage" button is greyed out.

**Possible Causes**:
1. Missing required information
2. Previous stage incomplete
3. Documents not uploaded

**Solution**:
```
Check Requirements:
☑ All required fields filled
☑ Documents uploaded
☑ Activities logged
☑ Payments recorded (if applicable)

Then try moving to next stage.
```

#### Issue: Commission Not Calculated

**Problem**: Commission shows PKR 0.

**Solution**:
1. Check agreed price is entered
2. Check commission % is set
3. Re-save the transaction
4. Commission auto-calculates

#### Issue: Payment Schedule Not Working

**Problem**: Can't create payment schedule.

**Solution**:
1. Ensure in Stage 5 (Agreement) or later
2. Check agreed price is set
3. Down payment must be less than total
4. Number of installments must be > 0

#### Issue: Cycle Stuck in Wrong Stage

**Problem**: Cycle is in wrong stage, can't complete.

**Solution** (Admin only):
1. Edit transaction
2. Manual stage override
3. Document reason
4. Adjust as needed

---

## FAQs

### General Questions

**Q: What's the difference between a property and a transaction?**  
A: A property is the physical asset. A transaction is the process of buying/selling/renting it. One property can have many transactions.

**Q: Can I have multiple transactions on one property?**  
A: Yes! One property can have multiple sell cycles, purchase cycles, and rent cycles over time.

**Q: What if a deal falls through?**  
A: Mark the cycle as "Lost" and document the reason. You can start a new cycle later.

**Q: How long should a sell cycle take?**  
A: Typically 6-12 weeks. Faster for cash buyers, slower for complex deals.

### Sell Cycles

**Q: Can I skip stages?**  
A: No. You must progress sequentially for proper audit trail.

**Q: What if I need to go back a stage?**  
A: Admin can move backwards, but it's not recommended. Better to complete and start new.

**Q: When do I get my commission?**  
A: Commission is earned when Stage 7 (Completion) is reached. Payment timing varies by agreement.

### Purchase Cycles

**Q: What's the difference between agency purchase and client purchase?**  
A: Agency purchase = you buy and own it. Client purchase = you help someone else buy it.

**Q: Can I convert a purchase cycle to inventory?**  
A: Yes, if it's an agency purchase, it automatically goes to inventory when complete.

### Rent Cycles

**Q: How do I handle lease renewals?**  
A: At Stage 8, choose "Renew Lease" and set new terms. Or choose "Terminate" to end.

**Q: What about maintenance during lease?**  
A: Track in the Active Lease stage. Log all maintenance requests and work done.

**Q: How do I track rent collection?**  
A: Payment schedule auto-generates monthly reminders. Record each payment when received.

---

## Quick Reference

### Transaction Types Comparison

| Aspect | Sell Cycle | Purchase Cycle | Rent Cycle |
|--------|-----------|----------------|------------|
| **Stages** | 7 | 7 | 9 |
| **Duration** | 6-12 weeks | 4-8 weeks | 12+ months |
| **Commission** | 2% of price | 2% of price | 1-2 months rent |
| **Payment** | Lump or installments | Usually lump | Monthly recurring |
| **Ownership** | Transfers out | Transfers in | No transfer |

### Stage Progression Time

| Stage | Typical Duration | Fast Track | Slow Track |
|-------|-----------------|------------|------------|
| **Listing** | 1-2 weeks | 3 days | 1 month |
| **Showing** | 2-4 weeks | 1 week | 2 months |
| **Offer** | 3-7 days | 1 day | 2 weeks |
| **Negotiation** | 1-2 weeks | 2 days | 1 month |
| **Agreement** | 1 week | 2 days | 2 weeks |
| **Paperwork** | 2-3 weeks | 1 week | 6 weeks |
| **Completion** | 1 week | 1 day | 2 weeks |

### Commission Calculator

```
Sell/Purchase:
Commission = Sale Price × Rate%

Example 1: PKR 75M × 2% = PKR 1,500,000
Example 2: PKR 45M × 2% = PKR 900,000

Rent:
Commission = Monthly Rent × Months

Example 1: PKR 150K × 1 = PKR 150,000
Example 2: PKR 150K × 2 = PKR 300,000
```

---

## Next Steps

### After Starting Your First Transaction

1. **Set Timeline** - Plan stage durations
2. **Upload Documents** - Add agreements as you go
3. **Track Progress** - Update regularly
4. **Log Activities** - Document everything
5. **Monitor Payments** - Stay on top of schedules
6. **Communicate** - Keep all parties informed
7. **Complete Cycle** - Finish strong!

### Learn More

- **Properties Module**: How properties link to transactions
- **Deals Module**: How deals create transactions
- **Financials Module**: How commission flows work
- **Portfolio Module**: How purchases become inventory

---

**Need Help?**

- **In-app**: Click "?" for stage-specific help
- **Support**: Contact your administrator
- **Training**: Request transactions module training

---

**End of Transactions Module User Guide**

**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Module**: Transactions (Sell/Purchase/Rent)  
**aaraazi Real Estate Platform**

🔄 **Happy Transacting!**
