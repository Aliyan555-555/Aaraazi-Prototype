# Leads Module Redesign - Implementation Summary
**Quick Reference Guide**

---

## **🎯 What We're Building**

**OLD Leads Module (Problematic):**
- ❌ Long-term sales pipeline
- ❌ Stores "interested properties" (duplicates Requirements)
- ❌ Manages relationships (duplicates Contacts)
- ❌ Bypasses Asset-Centric flow

**NEW Leads Module (Clean & Focused):**
- ✅ **Fast qualification only** (< 72 hours)
- ✅ **Routes to appropriate modules** (Contacts, Requirements, Properties)
- ✅ **No redundancy** with other modules
- ✅ **SLA-driven** with accountability

---

## **📊 The New Lead Lifecycle**

```
Inquiry Received (Phone/Website/Walk-in)
          ↓
    [ NEW LEAD ]
    Status: "new"
    Age: 0 hours
          ↓
   (Agent makes first contact within 2h)
          ↓
   [ QUALIFYING ]
   Status: "qualifying"
   Agent asks: Intent? Timeline? Budget? Areas?
          ↓
   (Qualification completed within 24h)
          ↓
   [ QUALIFIED ]
   Status: "qualified"
   Ready to route
          ↓
   ┌──────┴──────┬──────────┬──────────┐
   ▼             ▼          ▼          ▼
 BUYER        SELLER     TENANT    LANDLORD
   │             │          │          │
   ├─ Create Contact (always)
   │
   ├─ Create Buyer Req   Property    Rent Req    Property
   │                     Listing                  Listing
   │
   └─ Archive Lead (status: "converted")

Alternative Path:
   [ QUALIFIED ] → Not interested → [ LOST ] → Archive (with reason)
```

**Target SLA:**
- First contact: < 2 hours
- Qualification: < 24 hours
- Conversion: < 48 hours
- **Total lifecycle: < 72 hours**

---

## **🗂️ Key Data Model Changes**

### **New Lead Interface**
```typescript
interface Lead {
  // Core
  id: string;
  name: string;
  phone: string;
  email?: string;
  
  // Qualification (NEW)
  intent: 'buying' | 'selling' | 'renting' | 'leasing-out' | 'investing';
  timeline: 'immediate' | 'within-1-month' | 'within-3-months' | '3-6-months' | 'long-term';
  details?: { /* Intent-specific details */ };
  
  // Scoring (NEW)
  qualificationScore: number; // 0-100
  scoreBreakdown: {
    contactQuality: number;    // /20
    intentClarity: number;     // /20
    budgetRealism: number;     // /20
    timelineUrgency: number;   // /20
    sourceQuality: number;     // /20
  };
  priority: 'high' | 'medium' | 'low';
  
  // Status
  status: 'new' | 'qualifying' | 'qualified' | 'converted' | 'lost' | 'archived';
  
  // Routing (NEW)
  routedTo?: {
    contactId: string;           // Always created
    buyerRequirementId?: string; // If buyer
    rentRequirementId?: string;  // If tenant
    propertyId?: string;         // If seller/landlord
    convertedAt: string;
    convertedBy: string;
  };
  
  // SLA Tracking (NEW)
  sla: {
    createdAt: string;
    firstContactAt?: string;
    qualifiedAt?: string;
    convertedAt?: string;
    slaCompliant: boolean;
    overdueBy?: number; // hours
  };
  
  // Simple interaction log
  interactions: LeadInteraction[];
  
  // Assignment
  agentId: string;
  source: LeadSource;
}
```

### **Updated Contact Interface**
```typescript
interface Contact {
  // ... existing fields ...
  
  // NEW: Lead conversion tracking
  leadId?: string;
  convertedFromLead: boolean;
  leadSource?: LeadSource;
  leadInitialIntent?: LeadIntent;
  leadConvertedAt?: string;
}
```

### **Updated Requirement Interfaces**
```typescript
interface BuyerRequirement {
  // ... existing fields ...
  
  // NEW: Required links
  contactId: string; // REQUIRED
  leadId?: string;
  createdFromLead: boolean;
}

interface RentRequirement {
  // Same as BuyerRequirement
}
```

---

## **🔄 Integration Workflows**

### **1. Lead → Contact (Always)**
```typescript
convertLeadToContact(leadId) {
  1. Get lead data
  2. Create Contact with:
     - Contact info from lead
     - Type based on intent
     - leadId reference
     - Source from lead
  3. Copy interactions to Contact
  4. Update lead.routedTo.contactId
  5. Return contact
}
```

### **2. Lead → Buyer Requirement (If Buying)**
```typescript
createRequirementFromLead(lead, contact) {
  1. Create BuyerRequirement with:
     - contactId (required)
     - leadId (optional)
     - Budget from lead.details
     - Areas from lead.details
     - Property types from lead.details
  2. Update contact.relatedRequirements
  3. Update lead.routedTo.buyerRequirementId
  4. Return requirement
}
```

### **3. Lead → Property Listing (If Selling)**
```typescript
preparePropertyListingFromLead(lead, contact) {
  1. Prepare property form data:
     - Owner = contact
     - Address from lead.details
     - Price from lead.details
     - listingSource = { type: 'lead-conversion', leadId }
  2. Navigate to Property Form
  3. Pass pre-filled data
  4. Update lead.routedTo after property created
}
```

---

## **🎨 UI Components Structure**

```
/components/leads/
├── LeadsWorkspaceV4.tsx          ← Main workspace (uses WorkspacePageTemplate)
├── LeadQualificationModal.tsx    ← Wizard for qualification
├── LeadQueueCard.tsx              ← Individual lead card
├── LeadStatsCards.tsx             ← Dashboard stats
├── AddLeadModal.tsx               ← Quick add form
├── LeadDetailsModal.tsx           ← View-only details
├── MarkLeadLostModal.tsx          ← Mark as lost with reason
├── LeadInteractionModal.tsx       ← Log interaction
├── LeadPriorityBadge.tsx          ← Priority indicator
├── LeadStatusBadge.tsx            ← Status badge
├── LeadSLAIndicator.tsx           ← SLA compliance indicator
├── LeadSourceBadge.tsx            ← Source badge
└── LeadIntentIcon.tsx             ← Intent icon

/lib/
└── leads.ts                       ← Lead data service & conversion logic
```

---

## **📅 21-Day Implementation Plan**

### **Week 1: Foundation (Days 1-7)**
- **Days 1-3:** Type definitions + Core services (CRUD + conversions)
- **Days 4-6:** UI foundation (Workspace + Queue cards + Stats)
- **Day 7:** Qualification wizard modal structure

### **Week 2: Wizard & Integration (Days 8-14)**
- **Days 8-9:** Wizard steps + Scoring + Routing
- **Days 10-11:** Supporting modals + Utility components
- **Days 12-14:** Integration with Contacts, Requirements, Properties

### **Week 3: Polish & Deploy (Days 15-21)**
- **Days 15-16:** Dashboard widget + Navigation updates
- **Days 17-19:** Testing (Functional + Integration + UI/UX polish)
- **Days 20-21:** Documentation + Final review + Deployment

---

## **✅ Pre-Implementation Checklist**

- [ ] Review complete analysis document (`/LEADS_MODULE_COMPLETE_ANALYSIS.md`)
- [ ] Understand new Lead data model
- [ ] Understand conversion workflows (Lead → Contact, Requirement, Property)
- [ ] Understand SLA tracking requirements
- [ ] Review UI mockups in analysis document
- [ ] Clear understanding of no migration needed (clean build)
- [ ] Ready to start Phase 1: Type Definitions

---

## **🚀 Getting Started**

**Step 1: Read the full analysis**
```bash
Open: /LEADS_MODULE_COMPLETE_ANALYSIS.md
Read: Sections 1-7 for complete context
Focus on: Section 6 (Data Model) and Section 7 (Integration)
```

**Step 2: Start Phase 1 - Day 1**
```bash
File to create: Update /types.ts
Add: Lead, LeadIntent, LeadTimeline, LeadStatus, LeadSource, LeadInteraction interfaces
Update: Contact, BuyerRequirement, RentRequirement, Property interfaces
```

**Step 3: Follow the 21-day plan**
```bash
Track progress in: Section 9 of the analysis document
Check off tasks as completed
Test each phase before moving to next
```

---

## **📖 Key Documents**

1. **`/LEADS_MODULE_COMPLETE_ANALYSIS.md`** - Complete redesign analysis (16,000 words)
2. **`/LEADS_IMPLEMENTATION_SUMMARY.md`** - This quick reference guide
3. **`/Guidelines.md`** - Overall development guidelines (to be updated)

---

## **💡 Key Principles to Remember**

1. **Leads are TEMPORARY** - They exist for < 72 hours, then get archived
2. **No interested properties in Leads** - That's the Requirements module's job
3. **Always create Contact** - Every qualified lead becomes a Contact
4. **Route based on intent** - Buyer → Requirement, Seller → Property Form
5. **SLA-driven** - Track first contact, qualification, conversion times
6. **Clean architecture** - No redundancy with Contacts or Requirements
7. **Asset-Centric alignment** - Properties remain the core, Leads feed into the system

---

**Ready to begin? Start with Phase 1, Day 1! 🚀**
