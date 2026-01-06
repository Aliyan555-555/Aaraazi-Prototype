# Leads Module - Flow Diagrams
**Visual Reference for Implementation**

---

## **1. Lead Lifecycle Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LEAD ENTRY POINTS                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  ┌──────────┐            ┌──────────┐            ┌──────────┐
  │ WEBSITE  │            │  PHONE   │            │ WALK-IN  │
  │   FORM   │            │   CALL   │            │  OFFICE  │
  └────┬─────┘            └────┬─────┘            └────┬─────┘
       │                       │                       │
       └───────────────────────┴───────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    CREATE LEAD      │
                    │  Status: "new"      │
                    │  Priority: Auto     │
                    │  Agent: Assigned    │
                    └──────────┬──────────┘
                               │
                    ⏰ SLA Target: < 2 hours
                               │
                               ▼
                    ┌─────────────────────┐
                    │  FIRST CONTACT      │
                    │  Status: "qualifying"│
                    └──────────┬──────────┘
                               │
                    📋 Qualification Questions:
                    • What are you looking for?
                    • When do you need it?
                    • What's your budget?
                    • Which areas?
                               │
                    ⏰ SLA Target: < 24 hours
                               │
                               ▼
                    ┌─────────────────────┐
                    │   QUALIFICATION     │
                    │   COMPLETED         │
                    │  Status: "qualified"│
                    │  Score: 0-100       │
                    └──────────┬──────────┘
                               │
                    ⏰ SLA Target: < 48 hours
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
            ▼                                     ▼
    ┌──────────────┐                    ┌──────────────┐
    │   CONVERT    │                    │  MARK LOST   │
    │              │                    │              │
    └──────┬───────┘                    └──────┬───────┘
           │                                   │
           │                                   │
           ▼                                   ▼
    ┌──────────────────────┐          ┌──────────────┐
    │ Create Contact       │          │ Select Reason│
    │ + Route to Module    │          │ • No budget  │
    │                      │          │ • Not ready  │
    │ Status: "converted"  │          │ • No response│
    └──────────┬───────────┘          │ • Other      │
               │                      └──────┬───────┘
               │                             │
               ▼                             ▼
    ┌──────────────────────┐          ┌──────────────┐
    │   ARCHIVE LEAD       │          │ ARCHIVE LEAD │
    │ Status: "archived"   │◄─────────┤Status: "lost"│
    │ Keep for reporting   │          │Keep for stats│
    └──────────────────────┘          └──────────────┘
```

---

## **2. Intent-Based Routing Flow**

```
                    ┌─────────────────────┐
                    │  QUALIFIED LEAD     │
                    │  Score: 85/100      │
                    │  Priority: High     │
                    └──────────┬──────────┘
                               │
                    What is their intent?
                               │
        ┌──────────────────────┼──────────────────────┬──────────────┐
        │                      │                      │              │
        ▼                      ▼                      ▼              ▼
┌───────────────┐      ┌───────────────┐     ┌───────────────┐  ┌──────────────┐
│  INTENT:      │      │  INTENT:      │     │  INTENT:      │  │  INTENT:     │
│  BUYING       │      │  SELLING      │     │  RENTING      │  │ LEASING-OUT  │
└───────┬───────┘      └───────┬───────┘     └───────┬───────┘  └──────┬───────┘
        │                      │                     │                 │
        │                      │                     │                 │
   STEP 1: Create Contact (Same for all)                              │
        │                      │                     │                 │
        ├──────────────────────┼─────────────────────┼─────────────────┤
        │                      │                     │                 │
        ▼                      ▼                     ▼                 ▼
┌───────────────┐      ┌───────────────┐     ┌───────────────┐  ┌──────────────┐
│ Contact Type: │      │ Contact Type: │     │ Contact Type: │  │Contact Type: │
│   "buyer"     │      │   "seller"    │     │   "tenant"    │  │ "landlord"   │
└───────┬───────┘      └───────┬───────┘     └───────┬───────┘  └──────┬───────┘
        │                      │                     │                 │
        │                      │                     │                 │
   STEP 2: Create specific record                                     │
        │                      │                     │                 │
        ▼                      ▼                     ▼                 ▼
┌───────────────────┐  ┌───────────────────┐ ┌──────────────────┐ ┌──────────────┐
│ Buyer Requirement │  │  Property Form    │ │ Rent Requirement │ │Property Form │
├───────────────────┤  ├───────────────────┤ ├──────────────────┤ ├──────────────┤
│ • Budget range    │  │ • Address         │ │ • Monthly budget │ │• Address     │
│ • Preferred areas │  │ • Property type   │ │ • Lease duration │ │• Expected    │
│ • Property type   │  │ • Expected price  │ │ • Preferred areas│ │  rent        │
│ • Bedrooms        │  │ • Area            │ │ • Property type  │ │• Property    │
│ • Bathrooms       │  │ • Owner: Contact  │ │ • Bedrooms       │ │  type        │
│ • Must-have       │  │ • Agent: Inherit  │ │ • Must-have      │ │• Owner:      │
│   features        │  │ • Status:         │ │   features       │ │  Contact     │
│ • Agent: Inherit  │  │   "available"     │ │ • Agent: Inherit │ │• Status:     │
│ • Contact: Link   │  │ • Source: Lead    │ │ • Contact: Link  │ │  "available" │
│ • Lead: Link      │  │   conversion      │ │ • Lead: Link     │ │• Source: Lead│
│ • Status: "active"│  └───────────────────┘ │ • Status:"active"│ │  conversion  │
└───────────────────┘                        └──────────────────┘ └──────────────┘
        │                      │                     │                 │
        │                      │                     │                 │
   STEP 3: Archive Lead (Same for all)                                │
        │                      │                     │                 │
        └──────────────────────┴─────────────────────┴─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   ARCHIVE LEAD      │
                    ├─────────────────────┤
                    │ Status: "converted" │
                    │ routedTo: {         │
                    │   contactId         │
                    │   requirementId? OR │
                    │   propertyId?       │
                    │ }                   │
                    └─────────────────────┘
```

---

## **3. Data Flow: Lead → Contact → Requirement → Deal**

```
┌────────────────────────────────────────────────────────────────────┐
│                    COMPLETE BUYER JOURNEY                          │
└────────────────────────────────────────────────────────────────────┘

DAY 1: First Contact
┌─────────────┐
│    LEAD     │  ← Ahmed calls: "Looking for apartment in DHA"
├─────────────┤
│ Name: Ahmed │
│ Phone: 0300 │
│ Intent: BUY │
│ Timeline: 1m│
│ Budget: 5-7Cr
│ Areas: DHA  │
└─────┬───────┘
      │
      │ Agent qualifies (within 2 hours)
      ▼
┌─────────────┐
│ LEAD SCORE  │
│   85/100    │  HIGH Priority
└─────┬───────┘
      │
      │ Convert & Route
      ▼

DAY 2: Conversion
┌──────────────────┐         ┌──────────────────────┐
│    CONTACT       │         │ BUYER REQUIREMENT    │
├──────────────────┤         ├──────────────────────┤
│ ID: C001         │◄────────│ ID: R001             │
│ Name: Ahmed      │   Link  │ Buyer: Ahmed (C001)  │
│ Phone: 0300      │         │ Budget: 5-7 Cr       │
│ Type: buyer      │         │ Areas: DHA           │
│ leadId: L001     │         │ Type: apartment      │
│ Source: phone    │         │ Beds: 3              │
│ Agent: A001      │         │ leadId: L001         │
│                  │         │ contactId: C001      │
│ relatedReqs: [R001]        │ Status: active       │
└──────────────────┘         │ Agent: A001          │
                             └──────────────────────┘
      │                                │
      │                                │
      │ Interaction history            │ Property matching
      │ Tasks & follow-ups             │ Viewings scheduled
      │                                │
      │                                ▼
      │                      ┌──────────────────────┐
      │                      │ MATCHED PROPERTIES   │
      │                      ├──────────────────────┤
      │                      │ P001: DHA Ph 5, 3BR  │
      │                      │ P002: DHA Ph 6, 3BR  │
      │                      │ P003: DHA Ph 8, 3BR  │
      │                      └──────────┬───────────┘
      │                                 │
      │                                 │ Viewings done
      │                                 ▼

DAY 15: Offer Submitted
      │                      ┌──────────────────────┐
      │                      │ SELECTED PROPERTY    │
      │                      ├──────────────────────┤
      │                      │ P001: DHA Ph 5       │
      │                      │ Price: PKR 6.5 Cr    │
      │                      │ Owner: Contact (C050)│
      │                      └──────────┬───────────┘
      │                                 │
      │                                 │ Offer accepted
      │                                 ▼

DAY 20: Deal Created
      │                      ┌──────────────────────┐
      │                      │      DEAL            │
      │                      ├──────────────────────┤
      │◄─────────────────────│ ID: D001             │
      │      Linked          │ Property: P001       │
      │                      │ Buyer: Ahmed (C001)  │
      │                      │ Seller: Owner (C050) │
      │                      │ Price: PKR 6.5 Cr    │
      │                      │ requirementId: R001  │
      │                      │ leadId: L001 (origin)│
      │                      │ Agent: A001          │
      │                      │ Status: active       │
      │                      │ Stage: negotiation   │
      │                      └──────────────────────┘
      │                                 │
      │                                 │ Payment plan
      │                                 │ Documents
      │                                 │ Commission
      │                                 ▼

DAY 45: Deal Closed
                             ┌──────────────────────┐
                             │  COMPLETED DEAL      │
                             ├──────────────────────┤
                             │ Status: completed    │
                             │ Commission: Paid     │
                             │ Property: Transferred│
                             └──────────────────────┘

REPORTING:
┌─────────────┐
│ LEAD (L001) │  Status: archived (converted)
├─────────────┤
│ Origin: Phone call on Day 1
│ Qualified: 1.5 hours (✓ SLA)
│ Converted: Day 2 (✓ SLA)
│ → Contact: C001
│ → Requirement: R001
│ → Deal: D001 (Day 20)
│ → Closed: Day 45
│ 
│ Lead-to-Close: 45 days
│ Commission: PKR 1,30,000
└─────────────┘
```

---

## **4. SLA Tracking Timeline**

```
┌────────────────────────────────────────────────────────────────────┐
│                         LEAD SLA TIMELINE                          │
└────────────────────────────────────────────────────────────────────┘

HOUR 0                                    HOUR 72
│                                              │
├──────┬──────────────────┬──────────────────┬┤
│      │                  │                  ││
▼      ▼                  ▼                  ▼▼
┌──────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────┐
│   NEW    │   │  QUALIFYING    │   │  QUALIFIED   │   │CONVERTED │
└──────────┘   └────────────────┘   └──────────────┘   └──────────┘
│              │                │                  │
│ < 2h         │ < 24h          │ < 48h            │
│              │                │                  │
│ First        │ Qualification  │ Route to         │
│ Contact      │ Questions      │ Module           │
│              │                │                  │

STATUS INDICATORS:

🟢 GREEN (On Track):
├─ New lead < 1 hour old
├─ Qualifying < 12 hours since first contact
└─ Qualified < 24 hours since qualification

🟡 YELLOW (Warning):
├─ New lead 1-2 hours old
├─ Qualifying 12-24 hours since first contact
└─ Qualified 24-48 hours since qualification

🔴 RED (Overdue):
├─ New lead > 2 hours old
├─ Qualifying > 24 hours since first contact
└─ Qualified > 48 hours since qualification

COMPLIANCE REPORT:
┌─────────────────────────────────────────┐
│ Last 7 Days SLA Performance             │
├─────────────────────────────────────────┤
│ First Contact SLA:       92% (✓)        │
│ Qualification SLA:       87% (✓)        │
│ Conversion SLA:          78% (!)        │
│                                         │
│ Average Lead Lifecycle:  38 hours       │
│ Fastest Conversion:      6 hours        │
│ Slowest Conversion:      68 hours       │
└─────────────────────────────────────────┘
```

---

## **5. Qualification Wizard Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│              LEAD QUALIFICATION WIZARD                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Step 1  →  Step 2  →  Step 3  →  Step 4  →  Step 5              │
└────────────────────────────────────────────────────────────────────┘

STEP 1: Verify Contact
┌─────────────────────────┐
│ ☑ Phone: 0300-1234567   │ ← Verify number is valid
│ ☑ Email: ahmed@x.com    │ ← Verify email is valid
│ □ Alt Phone: [Add]      │ ← Optional alternate
│                         │
│ [Next] ────────────────►│
└─────────────────────────┘

STEP 2: Understand Intent
┌─────────────────────────┐
│ What is the customer    │
│ looking for?            │
│                         │
│ ○ Buying a property     │ ← Select one
│ ○ Selling a property    │
│ ○ Renting (tenant)      │
│ ○ Renting out (landlord)│
│ ○ Investment            │
│                         │
│ [Back] [Next] ─────────►│
└─────────────────────────┘

STEP 3: Assess Timeline
┌─────────────────────────┐
│ When do they need it?   │
│                         │
│ ○ Immediately (< 1 wk)  │ ← Urgency affects
│ ○ Within 1 month        │   priority score
│ ○ Within 3 months       │
│ ○ 3-6 months            │
│ ○ Just browsing         │
│                         │
│ [Back] [Next] ─────────►│
└─────────────────────────┘

STEP 4: Gather Details (Dynamic based on intent)

IF BUYER:
┌─────────────────────────┐
│ Budget Range:           │
│ Min: [PKR 5 Crore    ]  │
│ Max: [PKR 7 Crore    ]  │
│                         │
│ Preferred Areas:        │
│ [✓] DHA Phase 5         │
│ [✓] DHA Phase 6         │
│ [ ] Clifton             │
│                         │
│ Property Type:          │
│ [Apartment ▼]           │
│                         │
│ Bedrooms: [3 ▼]         │
│                         │
│ [Back] [Next] ─────────►│
└─────────────────────────┘

IF SELLER:
┌─────────────────────────┐
│ Property Address:       │
│ [DHA Phase 5, Block 10] │
│                         │
│ Property Type:          │
│ [House ▼]               │
│                         │
│ Expected Price:         │
│ [PKR 8 Crore         ]  │
│                         │
│ Area:                   │
│ [500] [sq yd ▼]         │
│                         │
│ [Back] [Next] ─────────►│
└─────────────────────────┘

STEP 5: Add Notes
┌─────────────────────────────────────┐
│ Qualification Notes:                │
│ ┌─────────────────────────────────┐ │
│ │ Looking for 3BR apartment in    │ │
│ │ DHA, prefers high floor with    │ │
│ │ elevator. Has 20% down payment  │ │
│ │ ready. Wants to move within     │ │
│ │ 1 month due to job relocation.  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✅ QUALIFICATION SCORE: 85/100  │ │
│ │ Priority: HIGH 🔴               │ │
│ │                                 │ │
│ │ • Contact Quality:   20/20      │ │
│ │ • Intent Clarity:    20/20      │ │
│ │ • Budget Realism:    18/20      │ │
│ │ • Timeline Urgency:  18/20      │ │
│ │ • Source Quality:     9/20      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Back] [Qualify & Route] ──────────►│
└─────────────────────────────────────┘

ROUTING DECISION:
┌──────────────────────────────────────┐
│ Based on qualification, this lead   │
│ will be:                             │
│                                      │
│ 1. ✓ Converted to Contact           │
│    Type: Buyer                       │
│    Name: Ahmed Khan                  │
│                                      │
│ 2. ✓ Create Buyer Requirement       │
│    Budget: PKR 5-7 Cr                │
│    Areas: DHA Ph 5, DHA Ph 6         │
│    Type: Apartment, 3BR              │
│                                      │
│ 3. ✓ Archive Lead                    │
│    Status: Converted                 │
│    Keep for reporting                │
│                                      │
│ [Cancel] [Confirm & Convert] ───────►│
└──────────────────────────────────────┘

SUCCESS:
┌──────────────────────────────────────┐
│          ✓ Lead Converted            │
│                                      │
│ Contact created: C001                │
│ Requirement created: R001            │
│ Lead archived: L001                  │
│                                      │
│ [View Contact] [View Requirement]    │
└──────────────────────────────────────┘
```

---

## **6. Module Integration Map**

```
┌────────────────────────────────────────────────────────────────────┐
│                   AARAAZI AGENCY MODULE MAP                        │
│            (Showing Lead Integration Points)                       │
└────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │  DASHBOARD   │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
       │   LEADS     │   │  CONTACTS   │   │ PROPERTIES  │
       │ Workspace   │   │  Workspace  │   │  Workspace  │
       └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
              │                 │                  │
              │                 │                  │
     NEW LEAD ADDED      VIEW CONTACT        VIEW PROPERTY
              │                 │                  │
              ▼                 │                  │
       ┌─────────────┐          │                  │
       │ Qualify     │          │                  │
       │ Lead        │          │                  │
       └──────┬──────┘          │                  │
              │                 │                  │
     INTENT DETERMINED          │                  │
              │                 │                  │
       ┌──────┴──────┬──────────┴──────┬──────────┘
       │             │                 │
       ▼             ▼                 ▼
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│   CREATE    │ │   CREATE     │ │   CREATE    │
│  CONTACT    │ │  CONTACT     │ │  CONTACT    │
│ (Buyer)     │ │ (Seller)     │ │ (Tenant)    │
└──────┬──────┘ └──────┬───────┘ └──────┬──────┘
       │               │                │
       │               │                │
       ▼               ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   CREATE    │ │ NAVIGATE TO │ │   CREATE    │
│   BUYER     │ │  PROPERTY   │ │    RENT     │
│ REQUIREMENT │ │    FORM     │ │ REQUIREMENT │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │                │
       │               │                │
       ▼               ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  PROPERTY   │ │  PROPERTY   │ │  PROPERTY   │
│  MATCHING   │ │  LISTING    │ │  MATCHING   │
│  ALGORITHM  │ │   CREATED   │ │  ALGORITHM  │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │                │
       │               │                │
       ▼               ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  SCHEDULE   │ │  SELL CYCLE │ │  SCHEDULE   │
│  VIEWINGS   │ │   STARTS    │ │  VIEWINGS   │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │                │
       │               │                │
       └───────────────┼────────────────┘
                       │
                       ▼
                ┌─────────────┐
                │    DEALS    │
                │  Workspace  │
                └─────────────┘

DATA LINKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead.routedTo.contactId ──────────► Contact.id
Contact.leadId ◄────────────────── Lead.id

Lead.routedTo.buyerRequirementId ──► BuyerRequirement.id
BuyerRequirement.leadId ◄────────── Lead.id
BuyerRequirement.contactId ────────► Contact.id

Lead.routedTo.propertyId ──────────► Property.id
Property.listingSource.leadId ◄──── Lead.id
Property.currentOwnerId ───────────► Contact.id

Deal.buyerId ──────────────────────► Contact.id (buyer)
Deal.requirementId ────────────────► BuyerRequirement.id
Deal.propertyId ───────────────────► Property.id
```

---

**Use these diagrams during implementation to ensure correct data flow and relationships!**
