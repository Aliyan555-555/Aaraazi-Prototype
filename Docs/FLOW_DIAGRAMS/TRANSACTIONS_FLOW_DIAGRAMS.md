# Transactions Module - Flow Diagrams
**Visual Reference for Implementation**

---

## **1. Transaction Trinity Overview**

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TRANSACTION TRINITY SYSTEM                       │
│         Three Complete Lifecycle Workflows in One Module             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  │  SELL CYCLE │         │ PURCHASE    │         │ RENT CYCLE  │
  │             │         │   CYCLE     │         │             │
  │  7 Stages   │         │  7 Stages   │         │  9 Stages   │
  │             │         │             │         │             │
  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
         │                       │                        │
         │                       │                        │
  Property → Buyer          Market → Agency         Property → Tenant
  Ownership Transfer        Inventory Acquisition   Lease Agreement
         │                       │                        │
         ▼                       ▼                        ▼
  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  │ COMMISSION  │         │   PROFIT    │         │  MONTHLY    │
  │   EARNED    │         │   ON SALE   │         │   RENT      │
  │  (2% sale)  │         │             │         │ COLLECTION  │
  └─────────────┘         └─────────────┘         └─────────────┘

KEY CONCEPTS:
🔑 All three types use same TransactionDetailModal component
🔑 Each type has unique stages and workflows
🔑 Properties can go through multiple transaction cycles
🔑 Asset-centric: Property persists, transactions accumulate
```

---

## **2. Sell Cycle: 7-Stage Pipeline**

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SELL CYCLE COMPLETE FLOW                        │
│               From Listing to Ownership Transfer                     │
└─────────────────────────────────────────────────────────────────────┘

START: Property available + Buyer interested
   │
   ▼
┌─────────────────────────────────┐
│  STAGE 1: LISTING               │
│  Property Listed for Sale       │
│  • Property status: available   │
│  • Price set                    │
│  • Agent assigned               │
│  • Marketing active             │
└──────────┬──────────────────────┘
           │
           │ Buyer expresses interest
           │ Create Sell Cycle
           ▼
┌─────────────────────────────────┐
│  STAGE 2: SHOWING              │
│  Property Tours & Viewings      │
│  • Schedule viewings            │
│  • Show property to buyer       │
│  • Answer questions             │
│  • Property status: available   │
│  • Multiple showings possible   │
└──────────┬──────────────────────┘
           │
           │ Buyer interested
           │ Move to offer stage
           ▼
┌─────────────────────────────────┐
│  STAGE 3: OFFER                │
│  Buyer Makes Offer              │
│  • Buyer submits offer          │
│  • Offer amount documented      │
│  • Offer date recorded          │
│  • Property status: under-offer │
│  • Seller reviews offer         │
└──────────┬──────────────────────┘
           │
           │ Seller accepts/counters
           │ Negotiation begins
           ▼
┌─────────────────────────────────┐
│  STAGE 4: NEGOTIATION          │
│  Price & Terms Discussion       │
│  • Counter-offers exchanged     │
│  • Price negotiation            │
│  • Terms discussion             │
│  • Payment terms agreed         │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Agreement reached
           │ Set agreed price
           ▼
┌─────────────────────────────────┐
│  STAGE 5: AGREEMENT            │
│  Final Price Confirmed          │
│  • Agreed price set             │
│  • Payment type chosen:         │
│    - Cash (full payment)        │
│    - Installment (schedule)     │
│    - Bank Finance               │
│  • Expected closing date        │
│  • Property status: under-offer │
│  • Create payment schedule if   │
│    installment selected         │
└──────────┬──────────────────────┘
           │
           │ Payment processing
           │ Documentation prepared
           ▼
┌─────────────────────────────────┐
│  STAGE 6: PAPERWORK            │
│  Legal Documentation            │
│  • Sale deed preparation        │
│  • Title transfer documents     │
│  • NOC from society             │
│  • Utility transfer letters     │
│  • Possession documents         │
│  • All parties sign             │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Documents signed
           │ Payment complete/verified
           ▼
┌─────────────────────────────────┐
│  STAGE 7: OWNERSHIP TRANSFER   │
│  Property Legally Transferred   │
│  • All payments verified        │
│  • Documents registered         │
│  • Ownership transferred:       │
│    Property.currentOwnerId =    │
│    Transaction.buyerId          │
│  • Property status: sold        │
│  • Commission calculated & due  │
│  • Transaction status: complete │
│  • Ownership history updated    │
└──────────┬──────────────────────┘
           │
           │ Deal closed
           ▼
┌─────────────────────────────────┐
│  POST-COMPLETION               │
│  Property Re-listable           │
│  • Property in buyer's name     │
│  • Transaction record preserved │
│  • Commission to be paid        │
│  • Property can be re-purchased │
│    by agency for resale (if     │
│    buyer wants to sell)         │
│  • Property status: sold        │
└─────────────────────────────────┘

ASSET-CENTRIC MODEL:
🔑 Property NOT deleted after sale
🔑 Can be repurchased (Re-listing Flow)
🔑 Complete history preserved
🔑 Unlimited future transactions possible
```

---

## **3. Purchase Cycle: 7-Stage Pipeline**

```
┌─────────────────────────────────────────────────────────────────────┐
│                   PURCHASE CYCLE COMPLETE FLOW                       │
│            Agency Buying Property for Inventory/Resale               │
└─────────────────────────────────────────────────────────────────────┘

START: Agency identifies property to buy
   │
   ▼
┌─────────────────────────────────┐
│  STAGE 1: SOURCING             │
│  Identify Purchase Opportunity  │
│  • Find property to buy         │
│  • Market research              │
│  • Price analysis               │
│  • Investment decision          │
│  • Target property identified   │
└──────────┬──────────────────────┘
           │
           │ Property selected
           │ Create Purchase Cycle
           ▼
┌─────────────────────────────────┐
│  STAGE 2: VIEWING              │
│  Inspect Property               │
│  • Physical inspection          │
│  • Condition assessment         │
│  • Valuation                    │
│  • Due diligence                │
│  • Decision to proceed          │
└──────────┬──────────────────────┘
           │
           │ Property approved
           │ Make offer to seller
           ▼
┌─────────────────────────────────┐
│  STAGE 3: OFFER                │
│  Agency Makes Offer             │
│  • Agency submits offer         │
│  • Purchase price offered       │
│  • Terms proposed               │
│  • Seller reviews offer         │
│  • Property marked for purchase │
└──────────┬──────────────────────┘
           │
           │ Seller accepts/counters
           │ Price negotiation
           ▼
┌─────────────────────────────────┐
│  STAGE 4: NEGOTIATION          │
│  Price & Terms Discussion       │
│  • Counter-offers exchanged     │
│  • Final price negotiated       │
│  • Payment terms agreed         │
│  • Conditions finalized         │
│  • Timeline agreed              │
└──────────┬──────────────────────┘
           │
           │ Agreement reached
           │ Set purchase price
           ▼
┌─────────────────────────────────┐
│  STAGE 5: AGREEMENT            │
│  Purchase Terms Confirmed       │
│  • Agreed purchase price        │
│  • Payment schedule:            │
│    - Cash payment               │
│    - Installments               │
│  • Closing date set             │
│  • Token money paid             │
│  • isPurchaseForResale: true    │
└──────────┬──────────────────────┘
           │
           │ Payment processing
           │ Documentation
           ▼
┌─────────────────────────────────┐
│  STAGE 6: PAPERWORK            │
│  Legal Documentation            │
│  • Purchase agreement signed    │
│  • Title verification           │
│  • NOC obtained                 │
│  • Transfer documents prepared  │
│  • All legal checks complete    │
└──────────┬──────────────────────┘
           │
           │ Payment complete
           │ Documents signed
           ▼
┌─────────────────────────────────┐
│  STAGE 7: ACQUISITION          │
│  Property Acquired by Agency    │
│  • Full payment made            │
│  • Documents registered         │
│  • Ownership transferred:       │
│    Property.currentOwnerId =    │
│    null (agency)                │
│  • Property status: available   │
│    (ready for resale)           │
│  • Transaction status: complete │
│  • Add to agency inventory      │
│  • Property ready to sell       │
└──────────┬──────────────────────┘
           │
           │ Acquisition complete
           ▼
┌─────────────────────────────────┐
│  POST-ACQUISITION              │
│  Property in Agency Portfolio   │
│  • Property owned by agency     │
│  • Status: available            │
│  • Ready to start Sell Cycle    │
│  • Full profit on resale        │
│  • Track:                       │
│    - Purchase price             │
│    - Holding costs              │
│    - Target sale price          │
│    - Expected profit margin     │
└─────────────────────────────────┘

KEY DIFFERENCES FROM SELL CYCLE:
🔑 Agency is the BUYER (not facilitator)
🔑 Property becomes agency inventory
🔑 isPurchaseForResale flag set to true
🔑 No commission (agency owns property)
🔑 Focus on profit margin, not commission
```

---

## **4. Rent Cycle: 9-Stage Pipeline**

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RENT CYCLE COMPLETE FLOW                         │
│              From Listing to Active Lease Management                 │
└─────────────────────────────────────────────────────────────────────┘

START: Property available for rent + Tenant interested
   │
   ▼
┌─────────────────────────────────┐
│  STAGE 1: LISTING               │
│  Property Listed for Rent       │
│  • Property status: available   │
│  • Monthly rent amount set      │
│  • Agent assigned               │
│  • Rent marketing active        │
│  • Target tenant profile        │
└──────────┬──────────────────────┘
           │
           │ Tenant interested
           │ Create Rent Cycle
           ▼
┌─────────────────────────────────┐
│  STAGE 2: SHOWING              │
│  Property Tours for Tenant      │
│  • Schedule viewings            │
│  • Show property               │
│  • Discuss terms               │
│  • Answer questions            │
│  • Property status: available   │
└──────────┬──────────────────────┘
           │
           │ Tenant wants to rent
           │ Application submitted
           ▼
┌─────────────────────────────────┐
│  STAGE 3: APPLICATION          │
│  Tenant Applies to Rent         │
│  • Tenant submits application   │
│  • Background check             │
│  • Credit check (optional)      │
│  • References verified          │
│  • Employment verification      │
│  • Property status: available   │
└──────────┬──────────────────────┘
           │
           │ Application approved
           │ Offer to rent
           ▼
┌─────────────────────────────────┐
│  STAGE 4: OFFER                │
│  Tenant Makes Offer             │
│  • Rent amount offered          │
│  • Lease duration proposed      │
│  • Move-in date suggested       │
│  • Special terms/conditions     │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Landlord accepts/counters
           │ Terms negotiation
           ▼
┌─────────────────────────────────┐
│  STAGE 5: NEGOTIATION          │
│  Rent Terms Discussion          │
│  • Monthly rent negotiated      │
│  • Security deposit amount      │
│  • Lease duration finalized     │
│  • Maintenance responsibilities │
│  • Utility arrangements         │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Agreement reached
           │ Set final terms
           ▼
┌─────────────────────────────────┐
│  STAGE 6: AGREEMENT            │
│  Lease Terms Confirmed          │
│  • Monthly rent amount          │
│  • Security deposit amount      │
│  • Advance rent (if any)        │
│  • Lease start date             │
│  • Lease end date               │
│  • Lease duration (months)      │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Lease document prepared
           │ Security deposit paid
           ▼
┌─────────────────────────────────┐
│  STAGE 7: LEASE SIGNING        │
│  Legal Lease Agreement          │
│  • Lease agreement prepared     │
│  • Terms documented             │
│  • Landlord signs               │
│  • Tenant signs                 │
│  • Witnesses sign               │
│  • Lease registered (optional)  │
│  • Property status: under-offer │
└──────────┬──────────────────────┘
           │
           │ Lease signed
           │ Security deposit verified
           ▼
┌─────────────────────────────────┐
│  STAGE 8: MOVE-IN              │
│  Tenant Takes Possession        │
│  • Security deposit paid        │
│  • First month rent paid        │
│  • Property inspected           │
│  • Condition documented         │
│  • Keys handed over             │
│  • Utilities transferred        │
│  • Property status: rented      │
│  • Transaction status: complete │
│  • Commission due (1 month)     │
└──────────┬──────────────────────┘
           │
           │ Lease active
           ▼
┌─────────────────────────────────┐
│  STAGE 9: LEASE MANAGEMENT     │
│  Active Lease Period            │
│  • Monthly rent collection      │
│  • Maintenance tracking         │
│  • Tenant communication         │
│  • Issue resolution             │
│  • Lease renewal reminders      │
│  • Property status: rented      │
│  • Lease end date monitoring    │
└──────────┬──────────────────────┘
           │
           │ Lease period ending
           ▼
┌─────────────────────────────────┐
│  LEASE END OPTIONS             │
│                                 │
│  Option 1: RENEWAL              │
│  • Tenant renews lease          │
│  • New terms negotiated         │
│  • Lease extended               │
│  • Property status: rented      │
│                                 │
│  Option 2: VACATION             │
│  • Tenant moves out             │
│  • Property inspected           │
│  • Security deposit returned    │
│  • Property status: available   │
│  • Ready for new tenant         │
│                                 │
│  Option 3: PURCHASE             │
│  • Tenant wants to buy          │
│  • Convert to Sell Cycle        │
│  • Property status: under-offer │
└─────────────────────────────────┘

RENT CYCLE SPECIFICS:
🔑 Longest pipeline (9 stages)
🔑 Commission: 1 month rent (instead of 2%)
🔑 Ongoing lease management required
🔑 Property stays with landlord
🔑 Renewable lease cycles
```

---

## **5. Transaction Creation Flows**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 TRANSACTION CREATION ENTRY POINTS                    │
└─────────────────────────────────────────────────────────────────────┘

ENTRY POINT 1: From Property Detail Page
┌────────────────────────────────┐
│  PROPERTY DETAIL PAGE          │
│  Property: Modern Villa DHA    │
│  Status: Available             │
└───────────┬────────────────────┘
            │
            │ User clicks "Quick Actions"
            ▼
    ┌──────────────────┐
    │  Quick Actions   │
    │  ┌────────────┐  │
    │  │Start Sell  │  │──► Creates Sell Cycle
    │  │  Cycle     │  │    Property Status: under-offer
    │  └────────────┘  │
    │  ┌────────────┐  │
    │  │Start Rent  │  │──► Creates Rent Cycle
    │  │  Cycle     │  │    Property Status: available
    │  └────────────┘  │
    │  ┌────────────┐  │
    │  │Start       │  │──► Creates Purchase Cycle
    │  │ Purchase   │  │    (Agency buying)
    │  └────────────┘  │
    └──────────────────┘


ENTRY POINT 2: From Transactions Workspace
┌────────────────────────────────┐
│  TRANSACTIONS WORKSPACE        │
│  View: Sell Cycles            │
└───────────┬────────────────────┘
            │
            │ User clicks "Create Sell Cycle"
            ▼
┌─────────────────────────────────┐
│  CREATE SELL CYCLE MODAL       │
│  Step 1: Select Property        │
│  [Search & Select Property...] │
│                                 │
│  Step 2: Select Buyer           │
│  [Search & Select Contact...]  │
│                                 │
│  Step 3: Initial Details        │
│  • Expected Price               │
│  • Target Closing Date          │
│  • Notes                        │
│                                 │
│  [Create Sell Cycle] [Cancel]  │
└──────────┬──────────────────────┘
           │
           │ Cycle created
           ▼
┌─────────────────────────────────┐
│  TRANSACTION DETAIL MODAL      │
│  Opens automatically            │
│  Stage 1: Listing               │
│  Ready to progress              │
└─────────────────────────────────┘


ENTRY POINT 3: From Lead Conversion
┌────────────────────────────────┐
│  LEAD DETAIL MODAL             │
│  Lead: Ahmed (Buyer)           │
│  Stage: Negotiation (Closed)   │
└───────────┬────────────────────┘
            │
            │ User clicks "Convert Lead"
            ▼
┌─────────────────────────────────┐
│  CONVERT LEAD TO CLIENT        │
│  & CREATE TRANSACTION          │
│                                 │
│  ✓ Create Contact (Ahmed)      │
│  ✓ Select interested property  │
│  ✓ Create Sell Cycle           │
│  ✓ Link to original lead       │
│                                 │
│  [Convert & Create] [Cancel]   │
└──────────┬──────────────────────┘
           │
           │ Conversion complete
           ▼
┌─────────────────────────────────┐
│  NEW SELL CYCLE CREATED        │
│  • Contact: Ahmed               │
│  • Property: Selected           │
│  • Lead ID: Linked              │
│  • Stage 1: Listing             │
└─────────────────────────────────┘


ENTRY POINT 4: From Matched Requirements
┌────────────────────────────────┐
│  BUYER REQUIREMENTS DETAIL     │
│  Requirement: 3BR in DHA       │
│  Status: Active                │
└───────────┬────────────────────┘
            │
            │ Property matched
            ▼
┌─────────────────────────────────┐
│  MATCHED PROPERTIES TAB        │
│  • Villa in DHA Phase 8         │
│    Price: PKR 75M               │
│    Match: 95%                   │
│    [Start Sell Cycle]          │
└──────────┬──────────────────────┘
           │
           │ User clicks Start
           ▼
┌─────────────────────────────────┐
│  CREATE SELL CYCLE             │
│  Pre-filled:                    │
│  • Buyer: From requirement      │
│  • Property: Matched property   │
│  • Price: Expected range        │
│                                 │
│  [Create] [Cancel]             │
└─────────────────────────────────┘
```

---

## **6. Stage Progression Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STAGE PROGRESSION MECHANICS                       │
└─────────────────────────────────────────────────────────────────────┘

Current Stage: STAGE 3 (OFFER)
   │
   │ User opens TransactionDetailModal
   ▼
┌─────────────────────────────────┐
│  TRANSACTION DETAIL MODAL      │
│  ┌─────────────────────────┐   │
│  │  [◀ Back] Modern Villa  │   │
│  │  Sell Cycle · Stage 3   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ STAGE HEADER ─────────┐    │
│  │ 🟢 Stage 3: OFFER       │    │
│  │ Buyer makes offer       │    │
│  │                         │    │
│  │ [Move to Stage 4 ►]    │◄───┼─── Primary action
│  └─────────────────────────┘    │
│                                 │
│  📝 Stage 3 Form Fields:        │
│  • Offered Price: [Input]      │
│  • Offer Date: [Date]          │
│  • Offer Notes: [Textarea]     │
│  • [Save Changes]               │
│                                 │
│  📊 Stage Progress Timeline:    │
│  ✓ Stage 1: Listing            │
│  ✓ Stage 2: Showing            │
│  🔵 Stage 3: Offer ◄ Current   │
│  ⚪ Stage 4: Negotiation        │
│  ⚪ Stage 5: Agreement           │
│  ⚪ Stage 6: Paperwork           │
│  ⚪ Stage 7: Ownership Transfer │
└─────────────────────────────────┘
   │
   │ User clicks "Move to Stage 4"
   ▼
┌─────────────────────────────────┐
│  CONFIRM STAGE PROGRESSION     │
│                                 │
│  Move from Stage 3 to Stage 4?  │
│                                 │
│  Stage 4: NEGOTIATION          │
│  • Price & terms discussion     │
│  • Counter-offers               │
│                                 │
│  ⚠️  Make sure Stage 3 details  │
│     are complete before moving  │
│                                 │
│  [Confirm Move] [Cancel]       │
└──────────┬──────────────────────┘
           │
           │ User confirms
           ▼
┌─────────────────────────────────┐
│  STAGE UPDATED                 │
│  Transaction now at Stage 4     │
│  • Current stage: Negotiation   │
│  • Stage 3 marked complete      │
│  • Stage 4 form fields shown    │
│  • Timeline updated             │
│  • Activity logged              │
└─────────────────────────────────┘

PROGRESSION RULES:
🔑 Can only move forward (Stage N → Stage N+1)
🔑 Cannot skip stages
🔑 Previous stage data must be saved
🔑 Activity log records each progression
🔑 Property status updates automatically
🔑 Final stage triggers ownership transfer
```

---

## **7. Payment Schedule Integration**

```
┌─────────────────────────────────────────────────────────────────────┐
│              PAYMENT SCHEDULE IN TRANSACTION FLOW                    │
└─────────────────────────────────────────────────────────────────────┘

Transaction at Stage 5: AGREEMENT
   │
   │ User sets payment type = "installment"
   ▼
┌─────────────────────────────────┐
│  AGREEMENT STAGE FORM          │
│                                 │
│  Agreed Price: PKR 75,000,000   │
│                                 │
│  Payment Type:                  │
│  ⚪ Cash (full payment)         │
│  🔵 Installment (schedule)     │◄─── Selected
│  ⚪ Bank Finance                │
│                                 │
│  [Create Payment Schedule]     │◄─── New button appears
└──────────┬──────────────────────┘
           │
           │ User clicks "Create Payment Schedule"
           ▼
┌─────────────────────────────────┐
│  CREATE PAYMENT SCHEDULE       │
│  MODAL                          │
│                                 │
│  Total Amount: PKR 75,000,000   │
│  (from agreed price)            │
│                                 │
│  Down Payment:                  │
│  [25,000,000]  (33%)           │
│                                 │
│  Remaining: PKR 50,000,000      │
│                                 │
│  Number of Installments:        │
│  [10]                          │
│                                 │
│  Frequency:                     │
│  [Monthly ▼]                   │
│                                 │
│  First Payment Date:            │
│  [Feb 1, 2026]                 │
│                                 │
│  📊 Preview:                    │
│  • Down: PKR 25M (Feb 1)       │
│  • 10 x PKR 5M (monthly)       │
│  • Total: PKR 75M              │
│  • Last payment: Nov 1, 2026   │
│                                 │
│  [Create Schedule] [Cancel]    │
└──────────┬──────────────────────┘
           │
           │ Schedule created
           ▼
┌─────────────────────────────────┐
│  TRANSACTION DETAIL MODAL      │
│  New Tab Appears:               │
│  • Overview                     │
│  • Details                      │
│  • 💰 Payment Schedule ◄ NEW   │
│  • Documents                    │
│  • Activity                     │
└──────────┬──────────────────────┘
           │
           │ User clicks Payment Schedule tab
           ▼
┌─────────────────────────────────┐
│  PAYMENT SCHEDULE VIEW         │
│                                 │
│  Schedule ID: PS-2026-001       │
│  Status: Active                 │
│                                 │
│  Progress: PKR 30M / PKR 75M    │
│  [▓▓▓▓░░░░░░] 40%              │
│                                 │
│  INSTALLMENTS:                  │
│  ┌───────────────────────────┐ │
│  │ 1. Down Payment           │ │
│  │    PKR 25M · Feb 1, 2026  │ │
│  │    Status: ✓ Paid         │ │
│  │    [View Receipt]         │ │
│  ├───────────────────────────┤ │
│  │ 2. Installment 1          │ │
│  │    PKR 5M · Mar 1, 2026   │ │
│  │    Status: ✓ Paid         │ │
│  │    [View Receipt]         │ │
│  ├───────────────────────────┤ │
│  │ 3. Installment 2          │ │
│  │    PKR 5M · Apr 1, 2026   │ │
│  │    Status: ⏳ Due Soon    │ │
│  │    [Record Payment]       │ │
│  ├───────────────────────────┤ │
│  │ 4-10. Future Installments │ │
│  │    PKR 35M remaining      │ │
│  │    Status: ⚪ Pending     │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘

PAYMENT COMPLETION CHECK:
┌─────────────────────────────────┐
│  Before Stage 7 (Ownership      │
│  Transfer) can complete:        │
│                                 │
│  ✓ All installments paid        │
│  ✓ Payment schedule complete    │
│  ✓ Total amount verified        │
│                                 │
│  Only then ownership transfer   │
│  is allowed                     │
└─────────────────────────────────┘
```

---

## **8. Transaction Status Transitions**

```
┌─────────────────────────────────────────────────────────────────────┐
│                   TRANSACTION STATUS LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐
   │   CREATE    │
   │ TRANSACTION │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   ACTIVE    │◄──────────────┐
   │             │               │
   │ • Progressing through       │
   │   stages                    │
   │ • Property under-offer      │
   │   (Sell/Purchase) or        │
   │   available (Rent)          │
   │ • Can be edited             │
   │ • Stage changes tracked     │
   └──────┬──────┘               │
          │                      │
          │                      │
    ┌─────┴─────┐                │
    │           │                │
    ▼           ▼                │
┌─────────┐ ┌─────────┐          │
│ON-HOLD  │ │ PAUSED  │          │
│         │ │         │          │
│Deal     │ │Temporary│          │
│delayed  │ │pause    │          │
│         │ │         │          │
│[Resume]─┼─┤[Resume]─┼──────────┘
└─────────┘ └─────────┘
    │           │
    │           │
    ▼           ▼
┌──────────────────┐
│   CANCELLED      │
│                  │
│ • Deal fell      │
│   through        │
│ • Property back  │
│   to available   │
│ • Record         │
│   preserved      │
│ • Reason noted   │
└──────────────────┘

          OR
          
          ▼ (from ACTIVE)
   ┌─────────────┐
   │  COMPLETED  │
   │             │
   │ • All stages done          │
   │ • Ownership transferred    │
   │   (Sell/Purchase) or       │
   │ • Lease active (Rent)      │
   │ • Commission calculated    │
   │ • Transaction closed       │
   │ • Record preserved         │
   └─────────────┘

PROPERTY STATUS CORRELATION:

Transaction Status    Property Status
─────────────────    ───────────────
Active (Sell)    →   under-offer
Active (Rent)    →   available
Completed (Sell) →   sold
Completed (Purch)→   available (agency owned)
Completed (Rent) →   rented
Cancelled        →   available
On-Hold          →   under-offer (Sell) / available (Rent)
```

---

## **9. Commission Calculation Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMMISSION AUTO-CALCULATION                       │
└─────────────────────────────────────────────────────────────────────┘

SELL CYCLE - Stage 7: Ownership Transfer completed
   │
   ▼
┌─────────────────────────────────┐
│  TRANSACTION COMPLETED         │
│  Status: complete               │
│  Type: sell                     │
│  Agreed Price: PKR 75,000,000   │
└──────────┬──────────────────────┘
           │
           │ Auto-trigger commission calculation
           ▼
┌─────────────────────────────────┐
│  GET COMMISSION RATE           │
│  From Property:                 │
│  • commissionRate: 2%           │
│    (default for sales)          │
│                                 │
│  Calculate:                     │
│  PKR 75,000,000 × 0.02          │
│  = PKR 1,500,000                │
└──────────┬──────────────────────┘
           │
           │ Create commission record
           ▼
┌─────────────────────────────────┐
│  CREATE COMMISSION RECORD      │
│  in FinancialsHub               │
│                                 │
│  module: 'commission-tracker'   │
│  type: 'income'                 │
│  transactionId: [link]          │
│  propertyId: [link]             │
│  agentId: [link]                │
│  saleAmount: PKR 75,000,000     │
│  commissionRate: 2%             │
│  commissionAmount: PKR 1,500,000│
│  paidAmount: PKR 0              │
│  pendingAmount: PKR 1,500,000   │
│  paymentStatus: 'pending'       │
│  date: [transaction close date] │
└──────────┬──────────────────────┘
           │
           │ Update transaction
           ▼
┌─────────────────────────────────┐
│  UPDATE TRANSACTION            │
│  commissionAmount: PKR 1,500,000│
│  commissionStatus: 'pending'    │
└──────────┬──────────────────────┘
           │
           │ Visible in FinancialsHub
           ▼
┌─────────────────────────────────┐
│  FINANCIALS HUB                │
│  Commission Tracker Module      │
│                                 │
│  PENDING COMMISSIONS:           │
│  • Modern Villa DHA             │
│    Amount: PKR 1,500,000        │
│    Status: Pending              │
│    Agent: Ali Khan              │
│    [Record Payment]             │
└─────────────────────────────────┘


RENT CYCLE - Commission Calculation
┌─────────────────────────────────┐
│  RENT CYCLE COMPLETED          │
│  Stage 8: Move-In complete      │
│  Monthly Rent: PKR 150,000      │
└──────────┬──────────────────────┘
           │
           │ Commission = 1 month rent
           ▼
┌─────────────────────────────────┐
│  COMMISSION CALCULATION        │
│  1 × PKR 150,000 = PKR 150,000  │
│  (Fixed: 1 month rent)          │
│                                 │
│  Create commission record       │
│  with same structure as above   │
└─────────────────────────────────┘


PURCHASE CYCLE - No Commission
┌─────────────────────────────────┐
│  PURCHASE CYCLE COMPLETED      │
│  Stage 7: Acquisition complete  │
│  Purchase Price: PKR 50,000,000 │
└──────────┬──────────────────────┘
           │
           │ NO commission (agency buying)
           ▼
┌─────────────────────────────────┐
│  NO COMMISSION RECORD          │
│  Agency owns property           │
│  Profit comes from resale       │
│  Track in Portfolio instead     │
└─────────────────────────────────┘
```

---

## **10. Transaction-Property Integration**

```
┌─────────────────────────────────────────────────────────────────────┐
│              TRANSACTION ↔ PROPERTY RELATIONSHIP                     │
└─────────────────────────────────────────────────────────────────────┘

PROPERTY RECORD (Persistent)
┌─────────────────────────────────┐
│  Property ID: PROP-001          │
│  Title: Modern Villa DHA        │
│  Current Owner: Ali Khan        │
│  Status: sold                   │
│                                 │
│  Transaction History:           │
│  • TRANS-001 (Purchase) ✓       │
│  • TRANS-002 (Sell) ✓           │
│  • TRANS-003 (Rent) ✓           │
│  • TRANS-004 (Sell) ✓           │
│                                 │
│  Ownership History:             │
│  • Jan 2024: Agency acquired    │
│  • Mar 2024: Sold to Ali        │
│  • Dec 2025: Repurchased        │
│  • Jan 2026: Sold to Sara       │
└─────────────────────────────────┘
         ▲
         │
         │ Bidirectional link
         │
         ▼
TRANSACTION RECORD (Immutable history)
┌─────────────────────────────────┐
│  Transaction ID: TRANS-004      │
│  Property ID: PROP-001 ◄─────┐  │
│  Type: sell                  │  │
│  Stage: 7 (Ownership Transfer)  │
│  Status: completed              │
│  Agreed Price: PKR 75M          │
│  Buyer: Sara Ahmed              │
│  Seller: Agency (repurchased)   │
│  Closed Date: Jan 10, 2026      │
│                                 │
│  Links to Property:          │  │
│  • Title                     ├──┘
│  • Address                      │
│  • Specifications               │
│                                 │
│  Updates Property:              │
│  • currentOwnerId → Sara ID     │
│  • status → sold                │
│  • Add to ownershipHistory      │
└─────────────────────────────────┘

FLOW: Transaction Completion Updates Property
┌─────────────────────────────────┐
│  completeTransaction(transId)   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  1. Get transaction & property  │
│  2. Transfer ownership          │
│     transferOwnership(          │
│       propertyId,               │
│       newOwnerId,               │
│       transactionId,            │
│       price                     │
│     )                           │
│  3. Update property status      │
│  4. Add to ownership history    │
│  5. Update transaction status   │
│  6. Calculate commission        │
└─────────────────────────────────┘
```

---

## **11. Role-Based Transaction Access**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRANSACTION ACCESS BY ROLE                        │
└─────────────────────────────────────────────────────────────────────┘

ADMIN USER
┌─────────────────────────────────┐
│  Can Access:                    │
│  ✓ All transactions             │
│  ✓ All cycles (Sell/Purch/Rent) │
│  ✓ All agents' transactions     │
│  ✓ Full edit permissions        │
│  ✓ Can delete transactions      │
│  ✓ Can reassign agents          │
│  ✓ Override stage restrictions  │
│  ✓ View all financials          │
└─────────────────────────────────┘

AGENT USER
┌─────────────────────────────────┐
│  Can Access:                    │
│  ✓ Own transactions only        │
│  ✓ Transactions assigned to me  │
│  ✓ Full edit on own items       │
│  ✗ Cannot delete transactions   │
│  ✗ Cannot reassign to others    │
│  ✓ Must follow stage progression│
│  ✓ View own commissions only    │
│                                 │
│  Filter Applied:                │
│  transactions.filter(t =>       │
│    t.agentId === currentUser.id │
│  )                              │
└─────────────────────────────────┘

VIEWING TRANSACTION DETAIL
┌─────────────────────────────────┐
│  If Admin:                      │
│  • Show all fields              │
│  • Enable all actions           │
│  • Show agent assignment        │
│                                 │
│  If Agent (own transaction):    │
│  • Show all fields              │
│  • Enable progression           │
│  • Limited admin actions        │
│                                 │
│  If Agent (other's transaction):│
│  • Blocked - "No permission"    │
│  • Cannot view details          │
└─────────────────────────────────┘
```

---

## Quick Reference

### Transaction Types Summary

| Type | Stages | Commission | Property Status | Use Case |
|------|--------|------------|-----------------|----------|
| **Sell Cycle** | 7 | 2% of sale | under-offer → sold | Selling property |
| **Purchase Cycle** | 7 | None | available (agency) | Buying for inventory |
| **Rent Cycle** | 9 | 1 month rent | available → rented | Leasing property |

### Key Integrations

1. **Property** ↔ Transaction (One-to-Many)
2. **Transaction** ↔ PaymentSchedule (One-to-One)
3. **Transaction** ↔ Commission (One-to-One)
4. **Lead** → Transaction (Conversion)
5. **Contact** ↔ Transaction (Buyer/Seller/Tenant)

### Stage Progression Rules

✅ Must progress sequentially (1→2→3...)  
✅ Cannot skip stages  
✅ Previous stage data required  
✅ Final stage triggers ownership/status changes  
✅ Activity logged for each progression  

### Status Transitions

- **Active**: In progress
- **On-Hold**: Temporarily paused
- **Cancelled**: Deal failed
- **Completed**: Successfully closed

---

**End of Transactions Flow Diagrams**
