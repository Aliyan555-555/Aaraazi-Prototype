# Console Log Cleanup Plan

## 🎯 Objective
Remove debug console.log statements and replace console.error/console.warn with proper logger utility where appropriate.

---

## 📊 Audit Results

**Total console statements found:** 100+ (showing first 100)
**Files affected:** ~40 files

### **Console Statement Types:**
- `console.log` - Debug/info logging (should be removed or wrapped)
- `console.warn` - Warnings (should use logger.warn in dev mode)
- `console.error` - Errors (should use logger.error)

---

## 🔍 Strategy

### **1. console.log Statements**
**Action:** Remove or wrap with dev mode check

```typescript
// BEFORE
console.log('Property reloaded after deal completion');

// AFTER - OPTION A: Remove entirely
// (removed)

// AFTER - OPTION B: Keep for dev mode only
if (import.meta.env.DEV) {
  logger.info('Property reloaded after deal completion');
}
```

### **2. console.error Statements**
**Action:** Replace with logger.error

```typescript
// BEFORE
console.error('Error creating property:', error);

// AFTER
logger.error('Error creating property:', error);
```

### **3. console.warn Statements**
**Action:** Replace with logger.warn

```typescript
// BEFORE
console.warn('Invalid navigation page:', page);

// AFTER
logger.warn(`Invalid navigation page: ${page}`);
```

---

## 📝 File-by-File Cleanup Plan

### **Priority 1: Core Files (High Traffic)**

#### **/App.tsx** (21 console statements)
- [ ] Line 176: `console.warn` → `logger.warn` (initialization timeout)
- [ ] Line 185: `console.error` → `logger.error` (SaaS init error)
- [ ] Line 191: `console.error` → `logger.error` (Users init error)
- [ ] Line 197: `console.error` → `logger.error` (Data init error)
- [ ] Line 203: `console.error` → `logger.error` (Investor data init error)
- [ ] Line 229: `console.error` → `logger.error` (User session error)
- [ ] Line 232: `console.error` → `logger.error` (App init error)
- [ ] Line 261: `console.log` → Remove (debug log)
- [ ] Line 275: `console.log` → Remove (debug log)
- [ ] Line 344: `console.warn` → `logger.warn` (invalid navigation)
- [ ] Line 364: `console.warn` → `logger.warn` (property detail nav)
- [ ] Line 376: `console.warn` → `logger.warn` (project nav)
- [ ] Line 388: `console.warn` → `logger.warn` (land parcel nav)
- [ ] Line 400: `console.warn` → `logger.warn` (sell cycle nav)
- [ ] Line 411: `console.warn` → `logger.warn` (purchase cycle nav)
- [ ] Line 422: `console.warn` → `logger.warn` (rent cycle nav)
- [ ] Line 433: `console.warn` → `logger.warn` (buyer requirement nav)
- [ ] Line 470: `console.log` → Remove (notification debug)
- [ ] Line 521: `console.warn` → `logger.warn` (unknown entity type)
- [ ] Line 638: `console.warn` → `logger.warn` (user state warning)

**Impact:** High - Main app file, frequently executed

---

#### **/components/LogPaymentModal.tsx** (2 statements)
- [ ] Line 44: `console.log` → Remove (debug log)
- [ ] Line 122: `console.error` → `logger.error`

**Impact:** Medium - Payment operations

---

#### **/components/BankingTreasury.tsx** (1 statement)
- [ ] Line 273: `console.log` → Remove (debug log)

**Impact:** Low - Feature-specific

---

#### **/components/DocumentGeneratorModal.tsx** (15 statements)
- [ ] Line 179: `console.log` → Remove (initialization debug)
- [ ] Line 183: `console.log` → Remove (clauses loaded debug)
- [ ] Line 206: `console.log` → Remove (auto-fill debug)
- [ ] Line 216: `console.error` → `logger.error`
- [ ] Line 266: `console.error` → `logger.error`
- [ ] Line 276: `console.error` → `logger.error`
- [ ] Line 294: `console.log` → Remove (add clause debug)
- [ ] Line 297: `console.log` → Remove (clauses count debug)
- [ ] Line 302: `console.error` → `logger.error`
- [ ] Line 319: `console.log` → Remove (drag debug)
- [ ] Line 322: `console.log` → Remove (reorder debug)
- [ ] Line 328: `console.log` → Remove (indices debug)
- [ ] Line 331: `console.log` → Remove (invalid indices debug)
- [ ] Line 341: `console.log` → Remove (reordered debug)
- [ ] Line 345: `console.error` → `logger.error`
- [ ] Line 1187: `console.log` → Remove (render debug)

**Impact:** Medium - Document generation

---

### **Priority 2: Workspace Components**

#### **Buyer Requirements**
- [ ] /components/BuyerRequirementsWorkspace.tsx Line 143: Remove export debug
- [ ] /components/BuyerRequirementsWorkspace.tsx Line 147: Remove import debug

#### **Deal Components**
- [ ] /components/DealDashboard.tsx Line 56-57: Remove debug logs (2 statements)
- [ ] /components/DealDashboard.tsx Line 175: Remove export debug
- [ ] /components/DealDashboard.tsx Line 179: Remove import debug
- [ ] /components/DealDetails.tsx Line 176: Use logger.error
- [ ] /components/DealDetails.tsx Line 195: Use logger.error

**Impact:** Medium - Core deal functionality

---

### **Priority 3: Data/Infrastructure Components**

#### **Error Handling Files**
- [ ] /components/ErrorBoundary.tsx Line 45: Already wrapped in DEV check ✅

#### **Dashboard Files**
- [ ] /components/Dashboard.tsx Line 65: Use logger.error
- [ ] /components/Dashboard.tsx Line 81: Use logger.error
- [ ] /components/DevelopersDashboard.tsx (4 console.error statements): Use logger

**Impact:** Medium - Dashboard views

---

### **Priority 4: Modal Components**

All modal error handlers should use logger.error:
- [ ] AddBuyerRequirementModal.tsx
- [ ] AddOfferModal.tsx
- [ ] AddRentRequirementModal.tsx
- [ ] BuyerOfferModal.tsx
- [ ] CloseBuyerDealModal.tsx
- [ ] CreateInstallmentPlanModal.tsx
- [ ] GoodsReceiptNoteForm.tsx
- [ ] LandParcelForm.tsx
- [ ] PaymentPlanModal.tsx
- [ ] PaymentScheduleRecordingModal.tsx
- [ ] ProfitDistributionModal.tsx

**Impact:** Low - Error logging only

---

### **Priority 5: Feature-Specific Components**

Keep logger.error for these (already using console.error properly):
- [ ] AgencyHub.tsx Line 665: Remove debug log
- [ ] CommissionReports.tsx
- [ ] ConstructionTracking.tsx (4 statements)
- [ ] FarmingProspecting.tsx
- [ ] FinancialsHub.tsx
- [ ] InvestorManagement components
- [ ] InvestorPortfolioDashboard.tsx Line 128: Remove TODO debug
- [ ] Inventory.tsx
- [ ] LandAcquisitionDashboard.tsx
- [ ] Leads.tsx
- [ ] LeaseExpiryWidget.tsx
- [ ] NotificationTestPanel.tsx
- [ ] PaymentTracking.tsx
- [ ] ProjectDetail components
- [ ] ProjectAccountingModule.tsx Line 99: Remove debug log

**Impact:** Low - Feature-specific logging

---

## 🎯 Implementation Plan

### **Phase 1: Clean Critical Files (TODAY)**
1. ✅ App.tsx - Remove all debug logs, keep error/warn with logger
2. ⏳ LogPaymentModal.tsx - Clean debug logs
3. ⏳ BankingTreasury.tsx - Remove debug log
4. ⏳ DocumentGeneratorModal.tsx - Remove all debug logs

**Expected Impact:** ~40 console statements removed

---

### **Phase 2: Clean Workspace Components**
5. ⏳ BuyerRequirementsWorkspace.tsx
6. ⏳ DealDashboard.tsx
7. ⏳ DealDetails.tsx

**Expected Impact:** ~10 console statements cleaned

---

### **Phase 3: Clean Modal Components**
8. ⏳ Batch replace console.error → logger.error in all modals

**Expected Impact:** ~15 console statements improved

---

### **Phase 4: Clean Feature Components**
9. ⏳ Remove remaining debug logs
10. ⏳ Standardize error logging

**Expected Impact:** ~35 console statements improved

---

## ✅ Success Criteria

**After cleanup:**
- [ ] Zero `console.log` in production code
- [ ] All `console.error` replaced with `logger.error`
- [ ] All `console.warn` replaced with `logger.warn`
- [ ] Logger utility used consistently
- [ ] Dev-only logs wrapped in `import.meta.env.DEV` check
- [ ] No console errors in browser DevTools during normal operation

---

## 🛠️ Tools

### **Logger Utility** (already created: /lib/logger.ts)
```typescript
import { logger } from '../lib/logger';

// Usage:
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
logger.debug('Debug message'); // Only in DEV mode
```

### **Regex for Finding Console Statements**
```regex
console\.(log|warn|error|info|debug)
```

---

**Status:** Ready to execute
**Estimated Time:** 2-3 hours for complete cleanup
**Priority:** High (production readiness)
**Next Step:** Begin Phase 1 cleanup
