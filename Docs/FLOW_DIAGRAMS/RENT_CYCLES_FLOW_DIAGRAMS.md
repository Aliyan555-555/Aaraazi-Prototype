# Rent Cycles Module - Flow Diagrams
**Visual Reference for Implementation**

---

## **1. Rent Cycle Lifecycle Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RENT CYCLE ENTRY POINTS                          │
└─────────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  ┌──────────┐            ┌──────────┐            ┌──────────┐
  │  FROM    │            │  FROM    │            │ DIRECT   │
  │PROPERTY  │            │  RENT    │            │  START   │
  │ DETAILS  │            │REQUIREMENT│           │  RENT    │
  └────┬─────┘            └────┬─────┘            └────┬─────┘
       │                       │                       │
       └───────────────────────┴───────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  CREATE RENT CYCLE  │
                    │  Stage: Searching   │
                    │  Property: Selected │
                    │  Agent: Assigned    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  STAGE: SEARCHING   │
                    │  Finding Tenants    │
                    │  Marketing Property │
                    │  Scheduling Viewings│
                    └──────────┬──────────┘
                               │
                     Tenant Identified
                               │
                               ▼
                    ┌─────────────────────┐
                    │ STAGE: APPLICATION  │
                    │ Tenant Applies      │
                    │ Background Check    │
                    │ Income Verification │
                    └──────────┬──────────┘
                               │
                     Application Approved
                               │
                               ▼
                    ┌─────────────────────┐
                    │ STAGE: AGREEMENT    │
                    │ Lease Prepared      │
                    │ Terms Negotiated    │
                    │ Signatures          │
                    └──────────┬──────────┘
                               │
                     Lease Signed
                               │
                               ▼
                    ┌─────────────────────┐
                    │ STAGE: MOVE-IN      │
                    │ Security Deposit    │
                    │ First Month Rent    │
                    │ Keys Handed         │
                    │ Inventory Check     │
                    └──────────┬──────────┘
                               │
                     Tenant Moved In
                               │
                               ▼
                    ┌─────────────────────┐
                    │  STAGE: ACTIVE      │
                    │ Monthly Rent Due    │
                    │ Maintenance Requests│
                    │ Ongoing Management  │
                    └──────────┬──────────┘
                               │
                   ┌───────────┴───────────┐
                   │                       │
                   ▼                       ▼
            ┌─────────────┐        ┌─────────────┐
            │   RENEWAL   │        │  MOVE-OUT   │
            │ Extend Lease│        │End Tenancy  │
            └──────┬──────┘        └──────┬──────┘
                   │                       │
            Loop back to Active     Continue below
                   │                       │
                   │                       ▼
                   │            ┌─────────────────────┐
                   │            │ STAGE: TERMINATION  │
                   │            │ Final Inspection    │
                   │            │ Deposit Settlement  │
                   │            │ Property Handback   │
                   │            └──────────┬──────────┘
                   │                       │
                   │                       ▼
                   │            ┌─────────────────────┐
                   │            │  STAGE: COMPLETED   │
                   │            │ Lease Ended         │
                   │            │ Property Available  │
                   └────────────┤ Can Relist          │
                                └─────────────────────┘

RENT CYCLE TYPES:
• Residential Lease (long-term: 6-12 months)
• Commercial Lease (long-term: 1-5 years)
• Short-term Rental (vacation: days/weeks)
```

---

## **2. Rent Cycle Creation Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                CREATE RENT CYCLE (Complete)                        │
└────────────────────────────────────────────────────────────────────┘

STEP 1: Property & Lease Type
┌─────────────────────────────────────┐
│ RentCycleFormV2                     │
│                                     │
│ Property to Rent:                   │
│ [P001 - Modern Apartment DHA ▼]     │
│                                     │
│ Property Details:                   │
│ • Type: Apartment                   │
│ • Size: 3BR, 250 sq yd             │
│ • Location: DHA Phase 5             │
│ • Furnishing: Furnished             │
│                                     │
│ Lease Type:                         │
│ ○ Residential Lease                 │
│ ○ Commercial Lease                  │
│ ○ Short-term Rental                 │
│                                     │
│ [Next: Rent Terms] ─────────────────►│
└─────────────────────────────────────┘

STEP 2: Rent & Financial Terms
┌─────────────────────────────────────┐
│ Monthly Rent:                       │
│ PKR [80,000]                        │
│                                     │
│ Security Deposit:                   │
│ [3] months = PKR 2,40,000           │
│ (Default: 2-3 months)               │
│                                     │
│ Advance Rent:                       │
│ [1] month = PKR 80,000              │
│                                     │
│ Total Move-in Cost:                 │
│ PKR 3,20,000                        │
│ (Deposit + First month)             │
│                                     │
│ Rent Includes:                      │
│ □ Electricity                       │
│ ☑ Water                             │
│ □ Gas                               │
│ ☑ Maintenance                       │
│ □ Internet                          │
│                                     │
│ Utilities Responsibility:           │
│ ○ Landlord pays all                 │
│ ● Tenant pays (except maintenance)  │
│ ○ Split between both                │
│                                     │
│ Annual Rent Increase:               │
│ [10]% (standard in Karachi)         │
│                                     │
│ [Back] [Next: Lease Terms] ─────────►│
└─────────────────────────────────────┘

STEP 3: Lease Duration & Dates
┌─────────────────────────────────────┐
│ Lease Duration:                     │
│ [12] months (1 year)                │
│                                     │
│ Lease Start Date:                   │
│ [2026-02-01]                        │
│                                     │
│ Lease End Date (auto-calculated):   │
│ [2027-01-31]                        │
│                                     │
│ Notice Period:                      │
│ [2] months before end date          │
│                                     │
│ Rent Payment Schedule:              │
│ ○ Monthly (1st of each month)       │
│ ○ Quarterly (advance)               │
│ ○ Semi-annually (advance)           │
│ ● Custom dates                      │
│                                     │
│ If Custom:                          │
│ Rent Due Day: [5th] of each month   │
│                                     │
│ Late Payment Penalty:               │
│ PKR [1,000] per day after grace     │
│ Grace Period: [5] days              │
│                                     │
│ [Back] [Next: Tenant] ──────────────►│
└─────────────────────────────────────┘

STEP 4: Tenant Selection (Optional)
┌─────────────────────────────────────┐
│ Do you have a tenant?               │
│ ○ Yes (specific tenant identified)  │
│ ● No (searching for tenant)         │
│                                     │
│ If NO (Searching):                  │
│ • Stage will be: "Searching"        │
│ • Property status: "Available"      │
│ • Can add tenant later              │
│                                     │
│ If YES:                             │
│ ┌─────────────────────────────────┐ │
│ │ Select Tenant:                  │ │
│ │ [Ahmed Khan ▼]                  │ │
│ │                                 │ │
│ │ Or create new contact:          │ │
│ │ [+ Add New Contact]             │ │
│ │ Type: Tenant                    │ │
│ │                                 │ │
│ │ Tenant from requirement?        │ │
│ │ □ Link to requirement: R002     │ │
│ │                                 │ │
│ │ Tenant Details Required:        │ │
│ │ • Employment Status             │ │
│ │ • Monthly Income                │ │
│ │ • Current Address               │ │
│ │ • References (2)                │ │
│ │ • CNIC/Passport Copy            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Back] [Next: Agreement] ───────────►│
└─────────────────────────────────────┘

STEP 5: Lease Agreement Details
┌─────────────────────────────────────┐
│ Lease Agreement Terms:              │
│                                     │
│ Property Condition:                 │
│ ○ As-is                             │
│ ● Good condition                    │
│ ○ Needs minor repairs               │
│                                     │
│ Maintenance Responsibility:         │
│ Landlord:                           │
│ ☑ Structural repairs                │
│ ☑ Major plumbing/electrical         │
│ ☑ Appliance replacement             │
│                                     │
│ Tenant:                             │
│ ☑ Minor repairs                     │
│ ☑ Cleaning                          │
│ ☑ Light bulbs, fixtures             │
│                                     │
│ Allowed Activities:                 │
│ □ Subletting                        │
│ □ Pets                              │
│ ☑ Minor wall painting               │
│ □ Running business                  │
│                                     │
│ Special Terms:                      │
│ ┌─────────────────────────────────┐ │
│ │ • No major renovations          │ │
│ │ • 2 months notice to vacate     │ │
│ │ • Society rules must be followed│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Back] [Create Rent Cycle] ─────────►│
└─────────────────────────────────────┘
           │
    Create rent cycle
           │
           ▼
┌─────────────────────────────────────┐
│ BACKEND PROCESSING:                 │
│                                     │
│ 1. Create Transaction:              │
│    • Type: "rent"                   │
│    • propertyId: P001               │
│    • landlordId: property owner     │
│    • tenantId: (if selected)        │
│    • stage: "searching" or          │
│      "application"                  │
│    • Monthly rent: 80,000           │
│    • Lease duration: 12 months      │
│                                     │
│ 2. Create Rent Schedule:            │
│    • Generate 12 monthly payments   │
│    • Due date: 5th of each month    │
│    • Amount: PKR 80,000 each        │
│    • First payment: Security +      │
│      First month                    │
│                                     │
│ 3. Update Property:                 │
│    • If tenant: status "rented"     │
│    • If no tenant: status "available"│
│    • Link to rent transaction       │
│                                     │
│ 4. Create Tasks:                    │
│    • Prepare lease agreement        │
│    • Schedule property viewing      │
│    • Tenant background check        │
│                                     │
│ 5. Save to localStorage              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│    ✅ RENT CYCLE CREATED            │
│                                     │
│ Transaction ID: T003                │
│ Property: Modern Apartment DHA      │
│ Monthly Rent: PKR 80,000            │
│ Duration: 12 months                 │
│ Stage: Searching for tenant         │
│                                     │
│ [View Rent Cycle] [Find Tenant]     │
└─────────────────────────────────────┘
```

---

## **3. Tenant Application & Screening Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                 TENANT APPLICATION PROCESS                         │
└────────────────────────────────────────────────────────────────────┘

Rent Cycle at "Searching" stage
Tenant interested in property
           │
           ▼
┌─────────────────────────────────────┐
│ Add Tenant to Rent Cycle            │
│                                     │
│ [+ Add Tenant]                      │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Tenant Application Form             │
├─────────────────────────────────────┤
│ Personal Information:               │
│ • Name: [Ahmed Khan              ]  │
│ • CNIC: [42101-1234567-1         ]  │
│ • Phone: [+92-300-1234567        ]  │
│ • Email: [ahmed@example.com      ]  │
│ • Current Address: [Full address ]  │
│                                     │
│ Employment Information:             │
│ • Status: [Employed ▼]              │
│ • Employer: [ABC Company         ]  │
│ • Designation: [Manager          ]  │
│ • Monthly Income: PKR [1,50,000  ]  │
│ • Employment Duration: [3] years    │
│                                     │
│ Financial Verification:             │
│ □ Salary slip (last 3 months)       │
│ □ Bank statement (last 6 months)    │
│ □ Employment letter                 │
│                                     │
│ References:                         │
│ Reference 1:                        │
│ • Name: [Previous Landlord       ]  │
│ • Phone: [+92-321-9999999        ]  │
│ • Relationship: [Landlord        ]  │
│                                     │
│ Reference 2:                        │
│ • Name: [Employer                ]  │
│ • Phone: [+92-322-8888888        ]  │
│ • Relationship: [Employer        ]  │
│                                     │
│ Family Information:                 │
│ • Family Size: [4] members          │
│ • Children: [2]                     │
│ • Pets: [None]                      │
│                                     │
│ [Submit Application]                │
└──────────┬──────────────────────────┘
           │
    Application submitted
           │
           ▼
┌─────────────────────────────────────┐
│ SCREENING CHECKLIST                 │
│                                     │
│ Agent Reviews:                      │
│                                     │
│ 1. Income Verification:             │
│    ☑ Income > 3x rent ✓             │
│    ☑ Salary slips verified ✓        │
│    ☑ Bank statements reviewed ✓     │
│    Status: PASSED                   │
│                                     │
│ 2. Employment Verification:         │
│    ☑ Called employer ✓              │
│    ☑ Verified designation ✓         │
│    ☑ Confirmed employment ✓         │
│    Status: PASSED                   │
│                                     │
│ 3. Reference Check:                 │
│    ☑ Called previous landlord ✓     │
│    ☑ No issues reported ✓           │
│    ☑ Good tenant history ✓          │
│    Status: PASSED                   │
│                                     │
│ 4. CNIC Verification:               │
│    ☑ Valid CNIC ✓                   │
│    ☑ Address verified ✓             │
│    Status: PASSED                   │
│                                     │
│ 5. Background Check:                │
│    ☑ No criminal record ✓           │
│    ☑ No previous disputes ✓         │
│    Status: PASSED                   │
│                                     │
│ Overall Score: 95/100 ✓             │
│                                     │
│ Decision:                           │
│ ● Approve Application               │
│ ○ Request More Info                 │
│ ○ Reject Application                │
│                                     │
│ Notes:                              │
│ ┌─────────────────────────────────┐ │
│ │ Excellent applicant.            │ │
│ │ Stable income, good references. │ │
│ │ Recommend approval.             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Approve & Progress]                │
└──────────┬──────────────────────────┘
           │
    Application approved
           │
           ▼
┌─────────────────────────────────────┐
│ Update Rent Cycle:                  │
│ • Add tenant: Ahmed Khan            │
│ • Stage: searching → application    │
│ • Application status: Approved      │
│ • Ready for lease agreement         │
│                                     │
│ Notify tenant:                      │
│ "Your application has been approved"│
│                                     │
│ [Prepare Lease Agreement]           │
└─────────────────────────────────────┘
```

---

## **4. Monthly Rent Collection Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                  MONTHLY RENT COLLECTION                           │
└────────────────────────────────────────────────────────────────────┘

Rent Cycle at "Active" stage
Monthly rent due
           │
           ▼
┌─────────────────────────────────────┐
│ RENT PAYMENT SCHEDULE               │
│                                     │
│ Month: February 2026                │
│ Due Date: Feb 5, 2026               │
│ Amount Due: PKR 80,000              │
│ Status: ⏳ Pending                  │
│                                     │
│ Tenant: Ahmed Khan                  │
│ Property: Modern Apartment DHA      │
│                                     │
│ [Record Payment] [Send Reminder]    │
└──────────┬──────────────────────────┘
           │
    Tenant pays rent
           │
           ▼
┌─────────────────────────────────────┐
│ RecordRentPaymentModal              │
├─────────────────────────────────────┤
│ Rent Month: February 2026           │
│ Amount Due: PKR 80,000              │
│                                     │
│ Amount Paid:                        │
│ PKR [80,000]                        │
│                                     │
│ Payment Date:                       │
│ [2026-02-04] (1 day early)          │
│                                     │
│ Payment Method:                     │
│ ○ Cash                              │
│ ● Bank Transfer                     │
│ ○ Check                             │
│ ○ Online Payment                    │
│                                     │
│ If Bank Transfer:                   │
│ Reference: [TXN987654321         ]  │
│ Bank: [HBL                       ]  │
│                                     │
│ Utilities This Month:               │
│ • Electricity: PKR [3,500]          │
│ • Gas: PKR [1,200]                  │
│ • Water: Included                   │
│ ─────────────────────────────────   │
│ Total Utilities: PKR 4,700          │
│                                     │
│ Late Payment?                       │
│ ○ Yes (apply penalty)               │
│ ● No (on time)                      │
│                                     │
│ Generate Receipt:                   │
│ ☑ Yes, send to tenant               │
│                                     │
│ Notes:                              │
│ ┌─────────────────────────────────┐ │
│ │ Payment received on time.       │ │
│ │ Tenant very cooperative.        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Record Payment]                    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ BACKEND PROCESSING:                 │
│                                     │
│ 1. Create Payment Record:           │
│    • Month: February 2026           │
│    • Amount: PKR 80,000             │
│    • Paid date: Feb 4, 2026         │
│    • Status: Paid ✓                 │
│    • Early by: 1 day                │
│                                     │
│ 2. Update Payment Schedule:         │
│    • Mark Feb as PAID ✓             │
│    • Update next due: March 5       │
│                                     │
│ 3. Generate Receipt:                │
│    • Receipt #: RENT-T003-002       │
│    • Include all details            │
│    • PDF format                     │
│                                     │
│ 4. Send Receipt:                    │
│    • Email to tenant ✓              │
│    • WhatsApp ✓                     │
│                                     │
│ 5. Update Statistics:               │
│    • Payments received: 2/12        │
│    • On-time payments: 2/2          │
│    • Total collected: PKR 1,60,000  │
│                                     │
│ 6. Update Cash Flow:                │
│    • Add to monthly revenue         │
│    • Update property income         │
│                                     │
│ 7. Save all changes                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│    ✅ PAYMENT RECORDED              │
│                                     │
│ Amount: PKR 80,000                  │
│ Month: February 2026                │
│ Status: Paid ✓                      │
│                                     │
│ Receipt sent to tenant              │
│                                     │
│ Next payment due:                   │
│ March 5, 2026 - PKR 80,000          │
│                                     │
│ [View Receipt] [Close]              │
└─────────────────────────────────────┘

LATE PAYMENT HANDLING:
┌─────────────────────────────────────┐
│ If payment is late:                 │
│                                     │
│ Grace Period: 5 days                │
│ After grace: PKR 1,000/day penalty  │
│                                     │
│ Day 6 (Feb 11):                     │
│ • Send reminder notification        │
│ • Call tenant                       │
│                                     │
│ Day 10 (Feb 15):                    │
│ • Send formal notice                │
│ • Penalty: PKR 5,000 added          │
│                                     │
│ Day 15 (Feb 20):                    │
│ • Final warning                     │
│ • Consider legal action             │
│ • Penalty: PKR 10,000               │
│                                     │
│ Day 30 (Mar 5):                     │
│ • Lease termination notice          │
│ • Eviction proceedings              │
└─────────────────────────────────────┘
```

---

## **5. Lease Renewal Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                     LEASE RENEWAL PROCESS                          │
└────────────────────────────────────────────────────────────────────┘

60 Days Before Lease End
System sends notification
           │
           ▼
┌─────────────────────────────────────┐
│ LEASE RENEWAL ALERT                 │
│                                     │
│ Property: Modern Apartment DHA      │
│ Tenant: Ahmed Khan                  │
│ Current Lease End: Jan 31, 2027     │
│                                     │
│ Lease expiring in: 60 days          │
│                                     │
│ Current Terms:                      │
│ • Monthly Rent: PKR 80,000          │
│ • Security Deposit: PKR 2,40,000    │
│ • Duration: 12 months               │
│                                     │
│ Tenant Status:                      │
│ ✓ All payments on time              │
│ ✓ No complaints                     │
│ ✓ Property well maintained          │
│                                     │
│ [Contact Tenant] [Prepare Renewal]  │
└──────────┬──────────────────────────┘
           │
    Agent contacts tenant
           │
           ▼
┌─────────────────────────────────────┐
│ Tenant Response:                    │
│ ● Wants to renew                    │
│ ○ Will vacate                       │
│ ○ Undecided                         │
│                                     │
│ If RENEW selected:                  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ LeaseRenewalModal                   │
├─────────────────────────────────────┤
│ Current Lease:                      │
│ • Start: Feb 1, 2026                │
│ • End: Jan 31, 2027                 │
│ • Rent: PKR 80,000/month            │
│                                     │
│ NEW LEASE TERMS:                    │
│                                     │
│ New Duration:                       │
│ [12] months (1 year)                │
│                                     │
│ New Start Date:                     │
│ [2027-02-01] (day after current)    │
│                                     │
│ New End Date (auto):                │
│ [2028-01-31]                        │
│                                     │
│ Rent Increase:                      │
│ Current: PKR 80,000                 │
│ Increase %: [10]%                   │
│ New Rent: PKR 88,000/month          │
│                                     │
│ Security Deposit:                   │
│ ○ Keep existing (PKR 2,40,000)      │
│ ● Top up to new rent (PKR 24,000)   │
│ ○ Return and get new deposit        │
│                                     │
│ If top-up: New deposit: PKR 2,64,000│
│ Additional payment: PKR 24,000      │
│                                     │
│ Terms Changes:                      │
│ □ Update utility inclusion          │
│ □ Change maintenance terms          │
│ □ Update special conditions         │
│                                     │
│ Negotiation Notes:                  │
│ ┌─────────────────────────────────┐ │
│ │ Tenant accepted 10% increase.   │ │
│ │ Happy to continue for another   │ │
│ │ year. Will pay top-up deposit.  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Prepare Renewal Agreement]         │
└──────────┬──────────────────────────┘
           │
    Generate new lease
           │
           ▼
┌─────────────────────────────────────┐
│ BACKEND PROCESSING:                 │
│                                     │
│ 1. Close Current Rent Cycle:        │
│    • Mark as "renewing"             │
│    • Preserve all history           │
│    • Keep payments record           │
│                                     │
│ 2. Create New Rent Cycle:           │
│    • Type: "rent" (renewal)         │
│    • Link to previous cycle         │
│    • Same property, same tenant     │
│    • New terms and rent             │
│    • New payment schedule (12)      │
│                                     │
│ 3. Generate New Lease:              │
│    • Renewal agreement document     │
│    • Updated terms                  │
│    • New signatures required        │
│                                     │
│ 4. Create Payment for Top-up:       │
│    • Additional deposit: PKR 24,000 │
│    • Due: Before new lease starts   │
│                                     │
│ 5. Update Property:                 │
│    • Link to new rent cycle         │
│    • Update monthly rent income     │
│                                     │
│ 6. Notify Tenant:                   │
│    • Renewal terms                  │
│    • New agreement for signing      │
│    • Deposit top-up details         │
│                                     │
│ 7. Save all changes                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   ✅ LEASE RENEWED                  │
│                                     │
│ New Rent Cycle: T003-R1             │
│ Duration: Feb 1, 2027 - Jan 31, 2028│
│ Monthly Rent: PKR 88,000            │
│ Deposit Top-up: PKR 24,000          │
│                                     │
│ Tenant receives:                    │
│ • New lease agreement               │
│ • Payment instructions              │
│                                     │
│ [View New Cycle] [Send Agreement]   │
└─────────────────────────────────────┘
```

---

## **6. Lease Termination & Move-Out Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                 LEASE TERMINATION PROCESS                          │
└────────────────────────────────────────────────────────────────────┘

SCENARIO: Tenant decides not to renew OR
          Tenant/Landlord wants early termination

Tenant gives notice (60 days before)
           │
           ▼
┌─────────────────────────────────────┐
│ TERMINATION NOTICE RECEIVED         │
│                                     │
│ Tenant: Ahmed Khan                  │
│ Notice Date: Nov 30, 2026           │
│ Move-out Date: Jan 31, 2027         │
│ Reason: Job relocation              │
│                                     │
│ Type:                               │
│ ● Normal termination (lease end)    │
│ ○ Early termination (penalty may    │
│   apply)                            │
│                                     │
│ [Accept Notice] [Start Process]     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ MOVE-OUT CHECKLIST                  │
│                                     │
│ 30 Days Before Move-out:            │
│ □ Final rent payment                │
│ □ Schedule final inspection         │
│ □ Arrange key handover              │
│ □ Transfer utility accounts         │
│ □ Deep cleaning arranged            │
│                                     │
│ 7 Days Before:                      │
│ □ Final meter readings              │
│ □ Inspection scheduled              │
│ □ Deposit settlement calculated     │
│                                     │
│ Move-out Day:                       │
│ □ Property inspection done          │
│ □ Keys collected                    │
│ □ Inventory check completed         │
│ □ Deposit settlement finalized      │
│                                     │
│ [Track Progress]                    │
└──────────┬──────────────────────────┘
           │
    Move-out day arrives
           │
           ▼
┌─────────────────────────────────────┐
│ FINAL PROPERTY INSPECTION           │
│                                     │
│ Date: Jan 31, 2027                  │
│ Inspector: Agent + Landlord         │
│ Tenant: Present                     │
│                                     │
│ Inspection Results:                 │
│ ┌─────────────────────────────────┐ │
│ │ Room-by-Room Check:             │ │
│ │                                 │ │
│ │ Living Room:                    │ │
│ │ ✓ Clean                         │ │
│ │ ✓ No damage                     │ │
│ │                                 │ │
│ │ Bedrooms (3):                   │ │
│ │ ✓ Clean                         │ │
│ │ ✓ No damage                     │ │
│ │                                 │ │
│ │ Bathrooms (3):                  │ │
│ │ ✓ Clean                         │ │
│ │ ⚠ Minor tile crack (bath 2)     │ │
│ │   Estimated repair: PKR 5,000   │ │
│ │                                 │ │
│ │ Kitchen:                        │ │
│ │ ✓ Clean                         │ │
│ │ ⚠ Cooktop needs replacement     │ │
│ │   Cost: PKR 8,000               │ │
│ │                                 │ │
│ │ Overall Condition: GOOD         │ │
│ │ Normal wear and tear: YES       │ │
│ │ Major damages: NO               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Continue to Settlement]            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ SECURITY DEPOSIT SETTLEMENT         │
├─────────────────────────────────────┤
│ Original Deposit: PKR 2,40,000      │
│                                     │
│ DEDUCTIONS:                         │
│ • Bathroom tile repair: 5,000       │
│ • Cooktop replacement: 8,000        │
│ • Outstanding utilities: 3,200      │
│ • Cleaning (none needed): 0         │
│ ─────────────────────────────────   │
│ Total Deductions: PKR 16,200        │
│                                     │
│ REFUND AMOUNT:                      │
│ PKR 2,23,800                        │
│                                     │
│ Breakdown for tenant:               │
│ ┌─────────────────────────────────┐ │
│ │ Security Deposit:   2,40,000    │ │
│ │ Less: Repairs      (13,000)     │ │
│ │ Less: Utilities     (3,200)     │ │
│ │ ──────────────────────────────  │ │
│ │ Refund Amount:      2,23,800    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Refund Method:                      │
│ ● Bank Transfer                     │
│ ○ Check                             │
│                                     │
│ Refund Timeline:                    │
│ [Within 15 days] (standard)         │
│                                     │
│ Tenant Agreement:                   │
│ □ Tenant agrees to deductions       │
│                                     │
│ Notes:                              │
│ ┌─────────────────────────────────┐ │
│ │ Tenant was excellent. Property  │ │
│ │ in good condition. Minor issues │ │
│ │ only. Would recommend again.    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Process Refund]                    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ BACKEND PROCESSING:                 │
│                                     │
│ 1. Update Rent Cycle:               │
│    • Stage: active → termination    │
│    • → completed                    │
│    • End date: Jan 31, 2027         │
│    • Completion reason: Normal end  │
│                                     │
│ 2. Process Deposit Refund:          │
│    • Create refund record           │
│    • Deductions: PKR 16,200         │
│    • Refund: PKR 2,23,800           │
│    • Payment via bank transfer      │
│                                     │
│ 3. Update Property:                 │
│    • Status: rented → available     │
│    • Remove tenant link             │
│    • Update last rented date        │
│    • Ready for re-listing           │
│                                     │
│ 4. Financial Records:               │
│    • Record deposit refund expense  │
│    • Record repair expenses         │
│    • Calculate total rent received  │
│    • Calculate ROI for lease period │
│                                     │
│ 5. Generate Documents:              │
│    • Move-out certificate           │
│    • Deposit settlement statement   │
│    • Property handover form         │
│    • Tenant recommendation (opt)    │
│                                     │
│ 6. Send to Tenant:                  │
│    • Settlement statement           │
│    • Refund confirmation            │
│    • Move-out certificate           │
│                                     │
│ 7. Archive Rent Cycle:              │
│    • Keep all payment records       │
│    • Preserve lease documents       │
│    • Store for future reference     │
│                                     │
│ 8. Save all changes                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  ✅ LEASE TERMINATED & COMPLETED    │
│                                     │
│ Tenant: Ahmed Khan                  │
│ Lease Period: Feb 1, 2026 -         │
│               Jan 31, 2027          │
│ Total Rent Collected: PKR 9,60,000  │
│ Deposit Refunded: PKR 2,23,800      │
│                                     │
│ Property Status: Available          │
│                                     │
│ Next Steps:                         │
│ • Arrange repairs                   │
│ • List property for rent            │
│ • Find new tenant                   │
│                                     │
│ [View Property] [Start New Cycle]   │
└─────────────────────────────────────┘
```

---

## **7. Maintenance Request Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│             TENANT MAINTENANCE REQUEST                             │
└────────────────────────────────────────────────────────────────────┘

During Active Lease
Tenant reports issue
           │
           ▼
┌─────────────────────────────────────┐
│ TENANT REPORTS ISSUE                │
│                                     │
│ Via:                                │
│ • Phone call to agent               │
│ • WhatsApp message                  │
│ • Tenant portal (if exists)         │
│                                     │
│ Issue: "AC not cooling properly"    │
└──────────┬──────────────────────────┘
           │
    Agent logs request
           │
           ▼
┌─────────────────────────────────────┐
│ MaintenanceRequestModal             │
├─────────────────────────────────────┤
│ Rent Cycle: T003 (auto-filled)      │
│ Tenant: Ahmed Khan                  │
│ Property: Modern Apartment DHA      │
│                                     │
│ Issue Category:                     │
│ [HVAC/Cooling ▼]                    │
│ • Plumbing                          │
│ • Electrical                        │
│ • HVAC/Cooling                      │
│ • Appliances                        │
│ • Structural                        │
│ • Other                             │
│                                     │
│ Priority:                           │
│ ○ Low (cosmetic)                    │
│ ● Medium (affects comfort)          │
│ ○ High (urgent)                     │
│ ○ Emergency (immediate danger)      │
│                                     │
│ Description:                        │
│ ┌─────────────────────────────────┐ │
│ │ Living room AC not cooling.     │ │
│ │ Started 2 days ago. Making      │ │
│ │ strange noise. Possibly needs   │ │
│ │ servicing or repair.            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Upload Photos: (Optional)           │
│ [ac_issue.jpg] ✓                    │
│                                     │
│ Reported Date:                      │
│ [2026-07-15] [10:30 AM]             │
│                                     │
│ Responsibility (per lease):         │
│ ● Landlord (major HVAC)             │
│ ○ Tenant (minor maintenance)        │
│ ○ Shared                            │
│                                     │
│ [Create Maintenance Request]        │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ MAINTENANCE WORKFLOW                │
│                                     │
│ Request ID: MR-T003-015             │
│ Priority: Medium                    │
│ Status: ⏳ Open                     │
│                                     │
│ STEP 1: Assign Vendor               │
│ Vendor: [Cool Air Services ▼]       │
│ Contact: +92-321-1111111            │
│ Specialization: AC Repair           │
│                                     │
│ [Assign Vendor]                     │
└──────────┬──────────────────────────┘
           │
    Vendor assigned
           │
           ▼
┌─────────────────────────────────────┐
│ STEP 2: Schedule Visit              │
│                                     │
│ Vendor: Cool Air Services           │
│ Visit Date: [2026-07-16]            │
│ Time Slot: [2:00 PM - 4:00 PM]      │
│                                     │
│ Notify:                             │
│ ☑ Tenant (visit confirmation)       │
│ ☑ Vendor (job details)              │
│                                     │
│ Status: ⏳ Scheduled                │
│                                     │
│ [Confirm Schedule]                  │
└──────────┬──────────────────────────┘
           │
    Visit completed
           │
           ▼
┌─────────────────────────────────────┐
│ STEP 3: Record Work Done            │
│                                     │
│ Visit Date: July 16, 2026           │
│ Technician: Ali from Cool Air       │
│                                     │
│ Diagnosis:                          │
│ ┌─────────────────────────────────┐ │
│ │ Gas leakage in AC unit.         │ │
│ │ Compressor working fine.        │ │
│ │ Gas refilled. Leak sealed.      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Work Completed:                     │
│ ☑ Gas refill                        │
│ ☑ Leak repair                       │
│ ☑ Testing                           │
│                                     │
│ Parts Used:                         │
│ • Refrigerant gas: 2 kg             │
│ • Sealant                           │
│                                     │
│ Labor Cost: PKR 2,000               │
│ Parts Cost: PKR 3,500               │
│ ─────────────────────────────────   │
│ Total Cost: PKR 5,500               │
│                                     │
│ Warranty: 3 months on work          │
│                                     │
│ Status: ✅ Completed                │
│                                     │
│ [Mark as Complete]                  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ STEP 4: Payment & Feedback          │
│                                     │
│ Bill Payment:                       │
│ Amount: PKR 5,500                   │
│ Paid By: ● Landlord                 │
│         ○ Tenant                    │
│ Method: Bank Transfer               │
│                                     │
│ Tenant Feedback:                    │
│ ┌─────────────────────────────────┐ │
│ │ Issue resolved. AC working      │ │
│ │ perfectly now. Quick service.   │ │
│ │ Thank you!                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Rating: ★★★★★ (5/5)                 │
│                                     │
│ [Close Request]                     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   ✅ MAINTENANCE COMPLETED          │
│                                     │
│ Request: MR-T003-015                │
│ Total Time: 1 day                   │
│ Cost: PKR 5,500 (Landlord paid)     │
│ Tenant Satisfied: Yes               │
│                                     │
│ Added to:                           │
│ • Property maintenance log          │
│ • Landlord expense report           │
│ • Rent cycle history                │
└─────────────────────────────────────┘
```

---

## **8. Rent Cycle - Property Integration**

```
┌────────────────────────────────────────────────────────────────────┐
│           RENT CYCLE ↔ PROPERTY RELATIONSHIP                       │
└────────────────────────────────────────────────────────────────────┘

BIDIRECTIONAL LINKS:

Transaction (Rent):
┌─────────────────────────────────────┐
│ Transaction {                       │
│   id: "T003",                       │
│   type: "rent",                     │
│   propertyId: "P001",        ← Link │
│   landlordId: "C050",               │
│   tenantId: "C001",                 │
│   monthlyRent: 80000,               │
│   stage: "active",                  │
│   leaseStart: "2026-02-01",         │
│   leaseEnd: "2027-01-31"            │
│ }                                   │
└─────────────────────────────────────┘

Property:
┌─────────────────────────────────────┐
│ Property {                          │
│   id: "P001",                       │
│   status: "rented",                 │
│   transactions: ["T003"],    ← Link │
│   monthlyRentIncome: 80000,         │
│   currentTenantId: "C001"    ← Link │
│ }                                   │
└─────────────────────────────────────┘

FROM RENT CYCLE TO PROPERTY:

Rent Cycle Details
           │
           ▼
┌─────────────────────────────────────┐
│ Transaction has propertyId: "P001"  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Display PropertyConnectedCard:      │
│                                     │
│ 🏠 Modern Apartment DHA Phase 5     │
│ 3BR | 250 sq yd                     │
│ Monthly Rent: PKR 80,000            │
│ Lease: Feb 1, 2026 - Jan 31, 2027   │
│ [View Property →]                   │
└─────────────────────────────────────┘

FROM PROPERTY TO RENT CYCLES:

Property Details → Transactions Tab
           │
           ▼
┌─────────────────────────────────────┐
│ Query: getRentCyclesByProperty()    │
│ Filter: type === "rent"             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Display Rent History:               │
│                                     │
│ CURRENT LEASE:                      │
│ ┌─────────────────────────────────┐ │
│ │ T003 - Active Lease             │ │
│ │ Tenant: Ahmed Khan              │ │
│ │ Rent: PKR 80,000/month          │ │
│ │ Period: Feb 1, 2026 - Jan 31,   │ │
│ │         2027                    │ │
│ │ Status: Active                  │ │
│ │ [View Details →]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ PREVIOUS LEASES:                    │
│ • T002: Feb 2025 - Jan 2026         │
│   Rent: PKR 75,000/month            │
└─────────────────────────────────────┘

DATA LINKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transaction.propertyId ───────────► Property.id
Property.transactions[] ──────────► [Transaction IDs]
Transaction.landlordId ───────────► Contact.id
Transaction.tenantId ─────────────► Contact.id
Property.currentTenantId ─────────► Contact.id
```

---

## **9. localStorage Data Flow**

```
┌────────────────────────────────────────────────────────────────────┐
│                RENT CYCLE DATA PERSISTENCE                         │
└────────────────────────────────────────────────────────────────────┘

CREATE RENT CYCLE:

RentCycleFormV2 → Create
           │
           ▼
┌─────────────────────────────────────┐
│ createTransaction(rentData)         │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ /lib/data.ts                        │
│                                     │
│ • Validate rent cycle data          │
│ • Get existing transactions         │
│ • Add new rent transaction          │
│ • Generate rent payment schedule    │
│ • Update property status            │
│ • Create initial tasks              │
│ • Save to localStorage               │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Success ✓                           │
│ Navigate to rent cycle details      │
└─────────────────────────────────────┘

localStorage KEYS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
estatemanager_transactions ─► [Transaction[]]
estatemanager_properties ───► [Property[]]
estatemanager_rent_payments ─► [RentPayment[]]
estatemanager_maintenance ──► [MaintenanceRequest[]]
estatemanager_lease_documents ──► [Document[]]
```

---

**Use these diagrams during implementation to ensure correct data flow, relationships, and user experience!**

**Document Status**: Complete  
**Total Flows**: 9 comprehensive scenarios  
**Coverage**: 100% of Rent Cycles Module functionality
