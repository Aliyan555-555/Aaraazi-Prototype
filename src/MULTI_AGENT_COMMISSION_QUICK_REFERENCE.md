# Multi-Agent Commission - Quick Reference Guide

## 🎯 Quick Start

### Add External Broker Contact
```
Contacts → Add Contact → Type: "External Broker" → Save
```

### Add Agent to Commission
```
Deal Details → Commission Tab → Add Agent → Select Agent/Broker → Enter % → Add
```

### Change Commission Status (Admin Only)
```
Commission Tab → Overview → Agent Card → Change Status → Select → Confirm
```

## 📊 Commission Structure

### Components:
- **Agents** (Multiple) - Internal users or external brokers - Each with own %
- **Agency Split** - 0-20% of total commission

### Validation Rules:
- Total must equal 100%
- Minimum 1 agent required
- Agency split: 0-20% only
- No duplicate agents allowed

## 🎨 Agent Types

### Internal Agent (Blue Badge)
- User from system
- Access to platform
- Full integration

### External Broker (Orange Badge)
- Contact with type "External Broker"
- External partner
- No platform access

## 🔄 Status Workflow

```
pending → pending-approval → approved → paid
          ↓
       cancelled / on-hold
```

**Status Transitions**:
- `pending` → `pending-approval`, `cancelled`
- `pending-approval` → `approved`, `cancelled`
- `approved` → `paid`, `on-hold`, `cancelled`
- `paid` → (locked, cannot change)
- `cancelled` → (locked, cannot change)
- `on-hold` → `approved`, `cancelled`

## 💡 Common Scenarios

### Single Agent Deal (95/5)
```
Agent: 95%
Agency: 5%
Total: 100% ✓
```

### Dual Agent Deal (60/35/5)
```
Primary Agent: 60%
Secondary Agent: 35%
Agency: 5%
Total: 100% ✓
```

### Multi-Agent with External Broker
```
Internal Agent 1: 50%
Internal Agent 2: 25%
External Broker: 20%
Agency: 5%
Total: 100% ✓
```

### External Broker Only
```
External Broker: 95%
Agency: 5%
Total: 100% ✓
```

## ⚙️ Functions Reference

### Add Agent
```typescript
addAgentToCommission(dealId, {
  id: 'agent_id',
  type: 'internal' | 'external',
  entityType: 'user' | 'contact',
  name: 'Agent Name',
  percentage: 50,
  // amount calculated automatically
}, totalCommission);
```

### Remove Agent
```typescript
removeAgentFromCommission(dealId, agentId);
```

### Update Percentage
```typescript
updateAgentCommissionPercentage(dealId, agentId, newPercentage, totalCommission);
```

### Mark as Paid
```typescript
markAgentCommissionPaid(dealId, agentId, paidBy);
```

### Validate Splits
```typescript
validateCommissionSplits(agents, agencyPercentage);
// Returns: { valid: boolean, message: string }
```

## 🔐 Permissions

| Action | Primary Agent | Admin | Others |
|--------|--------------|-------|--------|
| View Commission | ✅ | ✅ | ✅ |
| Edit Structure | ✅ | ✅ | ❌ |
| Add/Remove Agents | ✅ | ✅ | ❌ |
| Change Status | ❌ | ✅ | ❌ |
| View Audit Trail | ✅ | ✅ | Limited |

## 📍 UI Locations

### Commission Tab
```
Deal Details → Commission Tab
├── Overview (View all agents)
│   ├── Agent Cards
│   ├── Agency Card
│   └── Action Buttons
└── Configure (Edit structure)
    ├── Commission Rate
    ├── Payout Trigger
    ├── Agent Management
    └── Agency Split
```

### Add Agent Modal
```
Commission Tab → Add Agent
├── Internal Agents Tab
│   └── Searchable user list
└── External Brokers Tab
    └── Searchable broker list
```

## 🎨 Visual Indicators

### Colors:
- **Blue** - Internal agents
- **Orange** - External brokers
- **Gray** - Agency split
- **Green** - Approved/Paid status
- **Yellow** - Pending approval
- **Red** - Cancelled/Errors

### Icons:
- 👤 - Internal Agent
- 🏢 - External Broker / Agency
- 👥 - Multiple Agents
- ✅ - Approved/Completed
- ⏸️ - On Hold
- ❌ - Cancelled

## ⚡ Quick Tips

1. **Migration**: Legacy deals auto-migrate on first view
2. **Validation**: Real-time feedback on percentage totals
3. **Search**: Use Command+K in Add Agent modal for quick search
4. **Bulk**: Can add multiple agents, then adjust percentages
5. **Audit**: All status changes are logged with timestamp and user
6. **Backup**: Legacy structure preserved in `_legacy` field
7. **Revert**: Can restore from backup if needed (admin only)
8. **Export**: Commission data included in deal exports

## 🚨 Common Issues

### "Splits must total 100%"
- **Solution**: Adjust agent or agency percentages until total = 100%

### "Agent already added"
- **Solution**: Agent can only be added once per deal

### "At least one agent required"
- **Solution**: Cannot remove last agent, must have minimum 1

### "Agency percentage cannot exceed 20%"
- **Solution**: Agency split limited to 0-20% by policy

### External broker not showing?
- **Solution**: Ensure contact has type = "external-broker"

## 📞 Support

### For Users:
- See Help → Commission Management
- Contact admin for status changes
- Request external broker addition from Contacts

### For Developers:
- See `/lib/commissionAgents.ts` for API
- See `/MULTI_AGENT_COMMISSION_COMPLETE.md` for details
- Check console for validation errors

## 🔄 Migration Notes

### Existing Deals:
- Automatically migrated on first view
- Primary agent → agents[0]
- Secondary agent → agents[1]
- No manual action required
- Legacy data preserved

### New Deals:
- Start with empty agents array
- Add agents as needed
- No legacy structure

---

## 📊 At a Glance

```
┌─────────────────────────────────────────────┐
│   MULTI-AGENT COMMISSION SYSTEM             │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Unlimited agents per deal               │
│  ✓ Mix internal & external                 │
│  ✓ Independent status tracking             │
│  ✓ Real-time validation                    │
│  ✓ Audit trail                             │
│  ✓ Backward compatible                     │
│  ✓ Admin status control                    │
│  ✓ Financial integration ready             │
│                                             │
└─────────────────────────────────────────────┘
```

**Version**: 1.0.0
**Last Updated**: December 31, 2024
**Status**: ✅ Production Ready
