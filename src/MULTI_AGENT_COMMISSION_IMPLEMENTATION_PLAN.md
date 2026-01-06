# Multi-Agent Commission with External Brokers - Implementation Plan

## Overview
Implement a comprehensive multi-agent commission system that supports:
- Multiple internal agents (users)
- External brokers (contacts)
- Flexible commission splits
- Status tracking per agent
- Financial integration

## Phase 1: Add "External Broker" Contact Category

### Files to Update:
1. **`/components/ContactFormModal.tsx`**
   - Add 'external-broker' to contact type options
   - Update type definition

2. **`/components/contacts/ContactsWorkspaceV4Enhanced.tsx`**
   - Add filter for external brokers
   - Update stats to include external broker count

3. **`/lib/data.ts`**
   - Update any contact filtering logic if needed

## Phase 2: Update Deal Commission Structure

### Current Structure:
```typescript
deal.financial.commission = {
  total: number;
  rate: number;
  split: {
    primaryAgent: { percentage, amount, status, ... };
    secondaryAgent?: { percentage, amount, status, ... };
    agency: { percentage, amount };
  };
  payoutTrigger?: string;
}
```

### New Structure:
```typescript
deal.financial.commission = {
  total: number;
  rate: number;
  
  // MULTI-AGENT SUPPORT
  agents: Array<{
    id: string;                    // User ID or Contact ID
    type: 'internal' | 'external'; // internal=User, external=Contact
    name: string;
    entityType: 'user' | 'contact';// For data fetching
    percentage: number;
    amount: number;
    status: CommissionStatus;
    paidDate?: string;
    approvedBy?: string;
    approvedAt?: string;
    notes?: string;
  }>;
  
  // AGENCY SPLIT
  agency: {
    percentage: number;
    amount: number;
    status: CommissionStatus;
    notes?: string;
  };
  
  // PAYOUT
  payoutTrigger?: 'booking' | '50-percent' | 'possession' | 'full-payment';
  overallStatus: CommissionStatus;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  
  // BACKWARD COMPATIBILITY (deprecated, will be removed)
  _legacy?: {
    primaryAgent?: any;
    secondaryAgent?: any;
  };
}
```

## Phase 3: Create "Add Agent to Commission" Modal

### Component: `/components/deals/AddAgentToCommissionModal.tsx`

**Features:**
- Dual search: Internal agents OR external brokers
- Tab-based selection (Internal Agents | External Brokers)
- Agent search with filtering
- Percentage input with validation
- Real-time total calculation
- Prevent duplicate agents

**Props:**
```typescript
interface AddAgentToCommissionModalProps {
  open: boolean;
  onClose: () => void;
  currentAgents: CommissionAgent[];
  agencyPercentage: number;
  totalCommission: number;
  onAdd: (agent: CommissionAgent) => void;
}
```

## Phase 4: Update CommissionTab Component

### Updates to `/components/deals/CommissionTab.tsx`:

1. **Replace fixed splits with dynamic list**:
   - Display all agents in commissionagents array
   - Each gets a CommissionSplitCard
   - "Add Agent" button
   - "Remove Agent" button per agent
   - Automatic percentage redistribution option

2. **Add Agent Management**:
   - Add Agent button opens AddAgentToCommissionModal
   - Remove agent confirmation
   - Edit agent percentage inline
   - Rebalance percentages button

3. **Enhanced Validation**:
   - Sum of all agent percentages + agency = 100%
   - At least 1 agent required
   - Agency percentage 0-20%

4. **Visual Improvements**:
   - Agent type badges (Internal/External)
   - Color coding by agent type
   - Stacked list view for multiple agents
   - Summary card showing total distribution

## Phase 5: Create CommissionAgent Type

### New Type Definition:
```typescript
export interface CommissionAgent {
  id: string;                     // User ID or Contact ID
  type: 'internal' | 'external';  // Agent type
  entityType: 'user' | 'contact'; // For fetching
  name: string;
  email?: string;
  phone?: string;
  percentage: number;
  amount: number;
  status: CommissionStatus;
  paidDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export type CommissionStatus = 
  | 'pending'
  | 'pending-approval'
  | 'approved'
  | 'paid'
  | 'cancelled'
  | 'on-hold';
```

## Phase 6: Financial Integration

### Updates to Financial Tracking:

1. **Commission Tracking**:
   - Each agent commission creates a payable entry
   - Link to financial transactions
   - Track payment dates and amounts
   - Generate commission aging reports

2. **Integration Points**:
   - `/lib/deals.ts` - Update deal commission logic
   - `/lib/phase3Enhancements.ts` - Update commission functions
   - `/components/Financials.tsx` - Add commission payables section
   - `/components/FinancialsHub.tsx` - Commission module

3. **New Functions**:
   ```typescript
   // Add agent to commission split
   addAgentToCommission(dealId: string, agent: CommissionAgent): Deal;
   
   // Remove agent from commission split  
   removeAgentFromCommission(dealId: string, agentId: string): Deal;
   
   // Update agent commission percentage
   updateAgentCommission(dealId: string, agentId: string, percentage: number): Deal;
   
   // Recalculate commission amounts
   recalculateCommissionAmounts(deal: Deal): Deal;
   
   // Mark agent commission as paid
   markAgentCommissionPaid(dealId: string, agentId: string): Deal;
   ```

## Phase 7: Migration & Backward Compatibility

### Data Migration:
1. **Migrate existing deals**:
   ```typescript
   function migrateCommissionStructure(deal: Deal): Deal {
     if (!deal.financial.commission.agents) {
       const agents: CommissionAgent[] = [];
       
       // Migrate primary agent
       if (deal.financial.commission.split.primaryAgent) {
         agents.push({
           id: deal.agents.primary.id,
           type: 'internal',
           entityType: 'user',
           name: deal.agents.primary.name,
           ...deal.financial.commission.split.primaryAgent,
         });
       }
       
       // Migrate secondary agent
       if (deal.financial.commission.split.secondaryAgent) {
         agents.push({
           id: deal.agents.secondary!.id,
           type: 'internal',
           entityType: 'user',
           name: deal.agents.secondary!.name,
           ...deal.financial.commission.split.secondaryAgent,
         });
       }
       
       return {
         ...deal,
         financial: {
           ...deal.financial,
           commission: {
             ...deal.financial.commission,
             agents,
             _legacy: {
               primaryAgent: deal.financial.commission.split.primaryAgent,
               secondaryAgent: deal.financial.commission.split.secondaryAgent,
             },
           },
         },
       };
     }
     return deal;
   }
   ```

## Phase 8: UI/UX Enhancements

### Commission Tab Layout (from image):

```
┌─────────────────────────────────────────────────────────────────┐
│ Commission Management                    [Save Changes] [Cancel] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Total Commission│  │   Agent Splits  │  │  Agency Split   │ │
│  │   Rs 2,000      │  │     1 Agent     │  │       0%        │ │
│  │ 1% of Rs 2,00,000│  │ Single agent deal│  │      Rs 0       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  [Overview]  [Configure]                                        │
│                                                                   │
│  Commission Configuration                                        │
│  ────────────────────────────────────────────────────────────── │
│                                                                   │
│  Quick Presets:                                                  │
│  [Single Agent (95/5)]  [Multi-Agent (60/30/10)]               │
│                                                                   │
│  Commission Rate (%):  [1      ]                                │
│  Total: Rs 2,000                                                │
│                                                                   │
│  Payout Trigger:  [At Full Payment ▼]                           │
│                                                                   │
│  Split Percentages                          Total: 100.0% ✓     │
│  ────────────────────────────────────────────────────────────── │
│                                                                   │
│  Agents: [+ Add Agent]                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 👤 Primary Agent - Sarah Ahmed              [Remove]     │ │
│  │ Internal Agent                                            │ │
│  │ Percentage: [100] %    Amount: Rs 2,000                  │ │
│  │ Status: ● Pending                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Agency Split:                                                  │
│  Percentage: [0] %     Amount: Rs 0                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Phase 9: Testing Checklist

- [ ] Add external broker contact
- [ ] Create deal with single internal agent
- [ ] Add external broker to commission
- [ ] Add multiple internal agents
- [ ] Remove agent from commission
- [ ] Edit agent percentages
- [ ] Validate total = 100%
- [ ] Change commission status (admin)
- [ ] Mark commission as paid
- [ ] View commission in financials
- [ ] Migrate existing deals
- [ ] Export commission data

## Implementation Order

1. ✅ **Step 1**: Add 'external-broker' to contact types
2. ✅ **Step 2**: Create CommissionAgent type definition
3. ✅ **Step 3**: Create AddAgentToCommissionModal component
4. ✅ **Step 4**: Update CommissionTab to support multiple agents
5. ✅ **Step 5**: Update deal commission data structure
6. ✅ **Step 6**: Implement helper functions for agent management
7. ✅ **Step 7**: Update CommissionSplitCard for agent types
8. ✅ **Step 8**: Integrate with financials
9. ✅ **Step 9**: Data migration for existing deals
10. ✅ **Step 10**: Testing and polish

## Files to Create/Modify

### Create:
- `/components/deals/AddAgentToCommissionModal.tsx` (new)
- `/components/deals/MultiAgentCommissionList.tsx` (new)
- `/lib/commissionAgents.ts` (new - helper functions)

### Modify:
- `/components/ContactFormModal.tsx` (add external-broker type)
- `/components/contacts/ContactsWorkspaceV4Enhanced.tsx` (filter/stats)
- `/components/deals/CommissionTab.tsx` (multi-agent support)
- `/components/deals/CommissionSplitCard.tsx` (agent type support)
- `/lib/deals.ts` (commission functions)
- `/lib/phase3Enhancements.ts` (update commission creation)

### Reference (no changes needed):
- `/components/deals/CommissionStatusBadge.tsx`
- `/components/deals/ChangeCommissionStatusModal.tsx`

## Success Criteria

✅ Can add "External Broker" contacts
✅ Can add multiple agents to commission
✅ Can mix internal and external agents
✅ All percentages validate to 100%
✅ Each agent has independent status tracking
✅ Commissions appear in financials
✅ Existing deals continue to work
✅ No data loss during migration
✅ Intuitive UI/UX
✅ Comprehensive error handling

---

**Status**: Ready for Implementation
**Estimated Time**: 4-6 hours
**Complexity**: High
**Risk**: Medium (data migration required)
