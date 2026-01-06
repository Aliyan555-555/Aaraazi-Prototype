# 🚀 Property Status Sync - Quick Reference

## ✅ What Was Fixed

**Problem:** Property shows "For Sale" even after being sold  
**Solution:** Automatic status sync when cycles update  
**Result:** Property status ALWAYS matches cycle states

---

## 🎯 How It Works (Automatic)

When you update a cycle status, the property status updates automatically:

```typescript
// You do this:
updateSellCycle(cycleId, { status: 'sold' });

// System does this automatically:
// ✅ Checks all cycles for this property
// ✅ Calculates correct status (priority: sold > under_contract > leased > for_rent > for_sale)
// ✅ Updates property status to "sold"
// ✅ Dispatches UI update event
```

**No manual property updates needed!**

---

## 📊 Status Priority

Property status is determined by the **highest priority** active cycle:

| Priority | Status | Cycle Source |
|----------|--------|--------------|
| 1️⃣ | sold | Sell Cycle = "sold" |
| 2️⃣ | under_contract | Any cycle = "under-contract" |
| 3️⃣ | leased | Rent Cycle = "leased"/"active-lease" |
| 4️⃣ | for_rent | Rent Cycle = "listed"/"showing" |
| 5️⃣ | for_sale | Sell Cycle = "listed"/"negotiation" |
| 6️⃣ | available | No active cycles or acquired |

---

## 🔧 Common Scenarios

### Scenario 1: Sell a Property
```typescript
// Mark sell cycle as sold
updateSellCycle(sellCycleId, { status: 'sold' });
// ✅ Property automatically becomes "sold"
```

### Scenario 2: Under Contract
```typescript
// Accept an offer
acceptOffer(sellCycleId, offerId);
// ✅ Property automatically becomes "under_contract"
```

### Scenario 3: Lease a Property
```typescript
// Sign lease with tenant
signLease(rentCycleId, tenantId, tenantName, tenantContact);
// ✅ Property automatically becomes "leased"
```

### Scenario 4: List for Sale
```typescript
// Create sell cycle
createSellCycle({ propertyId, askingPrice, ... });
// ✅ Property automatically becomes "for_sale"
```

### Scenario 5: List for Rent
```typescript
// Create rent cycle
createRentCycle({ propertyId, monthlyRent, ... });
// ✅ Property automatically becomes "for_rent"
// (or stays "for_sale" if sell cycle exists - higher priority)
```

---

## 🛠️ Manual Operations (If Needed)

### Fix a Single Property
```typescript
import { forcePropertyStatusSync } from './lib/propertyStatusSync';

// Force sync a specific property
forcePropertyStatusSync(propertyId);
```

### Fix All Properties (Data Migration)
```typescript
import { batchSyncAllPropertyStatuses } from './lib/propertyStatusSync';

// Sync all properties at once
batchSyncAllPropertyStatuses();
```

### Browser Console (DevTools)
```javascript
// Preview what would change
window.aaraazi.previewPropertyStatusMigration();

// Run migration to fix all
window.aaraazi.runPropertyStatusMigration();
```

---

## 📋 Migration Steps (First Time Setup)

1. **Deploy the fix** (already done ✅)

2. **Preview changes:**
   ```javascript
   // In browser console
   window.aaraazi.previewPropertyStatusMigration();
   ```

3. **Run migration:**
   ```javascript
   // In browser console
   window.aaraazi.runPropertyStatusMigration();
   ```

4. **Verify:**
   - Check property listings
   - Verify workspace counts
   - Review dashboard metrics

---

## 🐛 Debugging

### Check Why a Property Has a Certain Status
```typescript
import { getPropertyStatusReason } from './lib/propertyStatusSync';

const reason = getPropertyStatusReason(propertyId);
console.log(reason);
// "Property was sold through Sell Cycle on 27/12/2025"
```

### Console Logging
All sync operations log to console:
```
🔄 Syncing property prop_123 status: for_sale → sold
✅ Property status updated successfully
```

### Listen to Status Changes
```typescript
window.addEventListener('propertyStatusChanged', (event) => {
  console.log('Status changed:', event.detail);
  // {
  //   propertyId: 'prop_123',
  //   oldStatus: 'for_sale',
  //   newStatus: 'sold',
  //   triggeredBy: 'sell-cycle',
  //   cycleId: 'sell_1234567890'
  // }
});
```

---

## ✨ Benefits

✅ **Automatic** - No manual updates needed  
✅ **Real-time** - UI updates immediately  
✅ **Accurate** - Always matches cycle states  
✅ **Reliable** - Single source of truth  
✅ **Auditable** - All changes logged  

---

## 📚 Full Documentation

For detailed information, see `/PROPERTY_STATUS_SYNC_FIX.md`

---

## 🎉 You're Done!

The system handles everything automatically. Just update cycle statuses normally and property statuses will sync automatically!

**Need help?** Check the full documentation or console logs for debugging.
