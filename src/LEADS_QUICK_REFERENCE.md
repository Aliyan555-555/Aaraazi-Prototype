# Lead System - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### Import Components
```typescript
import { 
  LeadWorkspaceV4, 
  LeadDetailsV4,
  CreateLeadModal,
  QualifyLeadModal,
  ConvertLeadModal,
  LeadInteractionModal,
  SLADashboard
} from './components/leads';
```

### Basic Usage
```typescript
// In your App.tsx or routing file
<LeadWorkspaceV4 
  user={user} 
  onNavigate={(view, id) => handleNavigation(view, id)} 
  onCreateLead={() => setShowCreateModal(true)} 
/>
```

---

## 📁 File Structure

```
/types/
  ├─ leads.ts              # Lead types (800 lines)
  └─ leadsIntegration.ts   # Integration types (240 lines)

/lib/
  ├─ leads.ts              # CRUD operations (900 lines)
  ├─ leadConversion.ts     # Conversion logic (600 lines)
  └─ leadUtils.ts          # Utilities (500 lines)

/components/leads/
  ├─ LeadWorkspaceV4.tsx          # Main workspace (900 lines)
  ├─ LeadDetailsV4.tsx            # Detail page (850 lines)
  ├─ CreateLeadModal.tsx          # Create modal (430 lines)
  ├─ QualifyLeadModal.tsx         # Qualify modal (650 lines)
  ├─ ConvertLeadModal.tsx         # Convert modal (380 lines)
  ├─ LeadInteractionModal.tsx     # Interaction modal (270 lines)
  ├─ SLADashboard.tsx             # SLA widget (420 lines)
  └─ index.ts                     # Exports
```

---

## 🔧 Core Functions

### Lead CRUD
```typescript
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from './lib/leads';

// Create
const lead = createLead({
  name: 'John Doe',
  phone: '+92 300 1234567',
  source: 'website',
  intent: 'buying',
  agentId: user.id,
  agentName: user.name,
  workspaceId: 'workspace_123'
});

// Read
const leads = getLeads(); // All leads
const lead = getLeadById('lead_123'); // Single lead

// Update
updateLead('lead_123', { status: 'qualified' });

// Delete (archives)
deleteLead('lead_123');
```

### Lead Conversion
```typescript
import { convertLead, previewLeadConversion } from './lib/leadConversion';

// Preview before converting
const preview = previewLeadConversion('lead_123');
console.log(preview.willCreate); // { contact: true, buyerRequirement: true, ... }
console.log(preview.validation); // Validation results
console.log(preview.duplicateCheck); // Duplicate detection

// Convert
const result = await convertLead('lead_123', {
  convertedBy: user.id,
  convertedByName: user.name,
  additionalNotes: 'Customer ready to proceed'
});

if (result.success) {
  console.log('Contact ID:', result.contactId);
  console.log('Requirement ID:', result.buyerRequirementId);
}
```

### Lead Utilities
```typescript
import { 
  filterLeads, 
  sortLeads, 
  getSLAAlerts, 
  getSLAPerformance,
  getAgentWorkloads 
} from './lib/leadUtils';

// Filter
const filtered = filterLeads({
  status: ['new', 'qualifying'],
  priority: ['high'],
  slaCompliant: false
});

// Sort
const sorted = sortLeads(leads, 'score-high');

// SLA
const alerts = getSLAAlerts(); // Overdue leads
const performance = getSLAPerformance(); // Overall metrics
const workloads = getAgentWorkloads(); // Per-agent stats
```

---

## 🎨 Component Props

### LeadWorkspaceV4
```typescript
<LeadWorkspaceV4
  user={{ id: string, name: string, role: 'admin' | 'agent' }}
  onNavigate={(view: string, id?: string) => void}
  onCreateLead={() => void}
/>
```

### LeadDetailsV4
```typescript
<LeadDetailsV4
  leadId={string}
  user={{ id: string, name: string, role: 'admin' | 'agent' }}
  onNavigate={(view: string, id?: string) => void}
  onBack={() => void}
  onQualify={(leadId: string) => void}
  onConvert={(leadId: string) => void}
  onAddInteraction={(leadId: string) => void}
  onMarkLost={(leadId: string) => void}
  onEdit={(leadId: string) => void}
/>
```

### CreateLeadModal
```typescript
<CreateLeadModal
  open={boolean}
  onClose={() => void}
  user={{ id: string, name: string }}
  workspaceId={string}
  onSuccess={(leadId: string) => void}
/>
```

### SLADashboard
```typescript
<SLADashboard
  onViewLead={(leadId: string) => void}
  onViewAllAlerts={() => void}
  maxAlertsToShow={5} // optional, default 5
/>
```

---

## 📊 Lead Types Reference

### Lead Status
```typescript
'new' | 'qualifying' | 'qualified' | 'converted' | 'lost' | 'archived'
```

### Lead Intent
```typescript
'buying' | 'selling' | 'renting' | 'leasing-out' | 'investing' | 'unknown'
```

### Lead Priority
```typescript
'high' | 'medium' | 'low'
```

### Lead Source
```typescript
'website' | 'phone-call' | 'walk-in' | 'referral' | 'social-media' | 
'whatsapp' | 'email' | 'property-sign' | 'olx' | 'zameen' | 
'coldcall' | 'event' | 'other'
```

### Lead Timeline
```typescript
'immediate' | 'within-1-month' | 'within-3-months' | 
'within-6-months' | 'long-term' | 'unknown'
```

---

## 🔗 Integration Patterns

### Contact Creation from Lead
```typescript
// Automatically happens in convertLead()
// Contact gets these additional fields:
{
  leadId: string,
  convertedFromLead: boolean,
  leadSource: LeadSource,
  leadInitialIntent: LeadIntent,
  leadConvertedAt: string,
  leadQualificationScore: number
}
```

### Requirement Creation from Lead
```typescript
// Buying intent → Buyer Requirement
// Renting intent → Rent Requirement
// Both get:
{
  contactId: string,  // Link to contact
  leadId: string,
  createdFromLead: boolean
}
```

### Property Creation from Lead
```typescript
// Selling/Leasing-out intent → Property
// Property gets:
{
  listingSource: {
    type: 'lead-conversion',
    leadId: string,
    contactId: string,
    convertedAt: string
  }
}
```

---

## ⚡ SLA Timings

```
First Contact: < 2 hours from lead creation
Qualification: < 24 hours from lead creation  
Conversion: < 48 hours from lead creation
Total Lifecycle: < 72 hours
```

---

## 🎯 Common Workflows

### 1. Create Lead from Website
```typescript
const lead = createLead({
  name: form.name,
  phone: form.phone,
  email: form.email,
  source: 'website',
  sourceDetails: 'Contact form submission',
  intent: 'unknown',
  timeline: 'unknown',
  initialMessage: form.message,
  agentId: assignedAgent.id,
  agentName: assignedAgent.name,
  workspaceId: workspace.id
});
// SLA tracking starts automatically
```

### 2. Qualify a Buying Lead
```typescript
updateLead(leadId, {
  intent: 'buying',
  timeline: 'within-1-month',
  phoneVerified: true,
  emailVerified: true,
  details: {
    budgetMin: 5000000,
    budgetMax: 10000000,
    preferredAreas: ['DHA', 'Clifton'],
    propertyTypes: ['House', 'Apartment'],
    bedrooms: 3,
    mustHaveFeatures: ['Parking', 'Garden']
  },
  status: 'qualified'
});
recalculateLeadScore(leadId); // Updates score
```

### 3. Convert to Contact + Requirement
```typescript
const result = await convertLead(leadId, {
  convertedBy: user.id,
  convertedByName: user.name
});

// Navigate to new contact
if (result.success) {
  navigate('contact-details', result.contactId);
}
```

### 4. Add Interaction
```typescript
addLeadInteraction(leadId, {
  type: 'phone-call',
  direction: 'outbound',
  summary: 'Discussed property requirements',
  notes: 'Customer confirmed budget and timeline. Will send property options.',
  duration: 15,
  agentId: user.id,
  agentName: user.name
});
```

---

## 🐛 Troubleshooting

### Lead not converting?
- Check validation: `previewLeadConversion(leadId).validation`
- Ensure name and phone are present
- Check lead status (can't convert 'lost' or 'archived')

### Duplicate detection not working?
- Ensure getContacts() returns data
- Check phone format consistency
- Verify email format

### SLA showing incorrect times?
- Check system clock
- Verify createdAt timestamp
- Review SLA checkpoint timestamps

### Score not updating?
- Call `recalculateLeadScore(leadId)` after updates
- Check that details object has data
- Verify phone/email verification flags

---

## 📚 Documentation Links

- **Phase 1:** Types & Services - `LEADS_PHASE1_COMPLETE.md`
- **Phase 2:** UI Components - `LEADS_PHASE2_COMPLETE.md`  
- **Phase 3:** Integration - `LEADS_PHASE3_COMPLETE.md`
- **Phase 4:** Final Integration - `LEADS_PHASE4_COMPLETE.md`
- **Summary:** Complete overview - `LEADS_SYSTEM_FINAL_SUMMARY.md`

---

## ✅ Quick Checklist

### For Implementation:
- [ ] Import lead components
- [ ] Add to navigation
- [ ] Set up routing
- [ ] Test lead creation
- [ ] Test qualification
- [ ] Test conversion
- [ ] Test SLA tracking

### For Testing:
- [ ] Create from each source
- [ ] Qualify all intent types
- [ ] Convert all intent types
- [ ] Test duplicate detection
- [ ] Verify SLA alerts
- [ ] Check mobile responsive
- [ ] Test accessibility

### For Deployment:
- [ ] Review all documentation
- [ ] Train agents
- [ ] Monitor first conversions
- [ ] Track SLA compliance
- [ ] Gather feedback

---

**🎉 You're all set! The Lead System is production-ready!**

*Last Updated: January 3, 2026*
*Version: 2.0*
*Status: Production Ready*
