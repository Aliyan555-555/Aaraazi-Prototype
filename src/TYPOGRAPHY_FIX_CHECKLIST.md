# Typography Fix Checklist

## ✅ **FIXED FILES** (4/18)

1. ✅ `/components/financials/reports/custom-builder/PreviewStep.tsx`
   - Removed `text-lg` from h3
   - Removed `text-2xl` from metric displays
   
2. ✅ `/components/financials/reports/custom-builder/DataSourceStep.tsx`
   - Removed `text-lg` from h3
   
3. ✅ `/components/financials/reports/custom-builder/FieldSelectorStep.tsx`
   - Removed `text-lg` from h3
   
4. ✅ `/components/financials/budgeting/EditBudgetModal.tsx`
   - Removed `text-2xl` from budget comparison values
   
5. ✅ `/components/financials/budgeting/BudgetHistoryModal.tsx`
   - Removed `text-2xl` from version stats

---

## ⏳ **REMAINING FILES TO FIX** (13/18)

### Custom Report Builder Components:

6. ❌ `/components/financials/reports/custom-builder/FilterConfiguratorStep.tsx`
   - Line 286: Remove `text-lg` from `<h3>`
   
7. ❌ `/components/financials/reports/custom-builder/GroupingConfiguratorStep.tsx`
   - Line 203: Remove `text-lg` from `<h3>`
   
8. ❌ `/components/financials/reports/custom-builder/ChartConfiguratorStep.tsx`
   - Line 181: Remove `text-lg` from `<h3>`
   
9. ❌ `/components/financials/reports/custom-builder/ScheduleConfiguratorStep.tsx`
   - Line 209: Remove `text-lg` from `<h3>`
   - Line 261: Remove `text-2xl` from icon display
   
10. ❌ `/components/financials/reports/custom-builder/RunCustomReportModal.tsx`
    - Lines 116, 120, 124, 128: Remove `text-2xl` from stat values
    
11. ❌ `/components/financials/reports/custom-builder/ReportComparisonView.tsx`
    - Lines 260, 268, 284, 294: Remove `text-lg` from comparison values
    
12. ❌ `/components/financials/reports/custom-builder/ReportAnalyticsDashboard.tsx`
    - Lines 163, 174, 186, 199, 345, 352, 359, 366: Remove `text-2xl` from metric displays

### Budget Editing Components:

13. ❌ `/components/financials/budgeting/CloneBudgetModal.tsx`
    - Remove `text-2xl` from budget preview displays
    
14. ❌ `/components/financials/budgeting/BulkEditBudgetsModal.tsx`
    - Remove `text-2xl` from summary metrics

---

## 🔧 **STANDARD FIX PATTERN**

### For H3 Headings:
```tsx
// ❌ WRONG
<h3 className="text-lg text-gray-900">Title</h3>

// ✅ CORRECT
<h3 className="text-gray-900">Title</h3>
```

### For Metric Values:
```tsx
// ❌ WRONG
<div className="text-2xl text-gray-900">{value}</div>

// ✅ CORRECT  
<div className="text-gray-900">{value}</div>
```

### For Comparison Values:
```tsx
// ❌ WRONG
<span className="text-lg text-gray-900">{diff}</span>

// ✅ CORRECT
<span className="text-gray-900">{diff}</span>
```

---

## 📊 **PROGRESS**

- **Total Files**: 18 files with typography violations
- **Fixed**: 5 files (28%)
- **Remaining**: 13 files (72%)
- **Estimated Time**: 15 minutes to fix all remaining

---

## 🎯 **NEXT STEPS**

1. Fix remaining 13 files using fast_apply_tool
2. Run search to verify no more violations
3. Test all components visually
4. Update FINANCIALS_AUDIT_REPORT.md to 100% complete

---

## ✅ **VERIFICATION COMMAND**

After fixing all files, run:
```bash
file_search with pattern: "text-xl|text-lg|text-2xl|text-3xl|font-bold|font-semibold"
in: components/financials/**/*.tsx
```

Should return 0 results in the affected files (typography classes only remain where they're used for actual styling like icon sizes `h-4`, `w-4` which are allowed).

---

**Status**: 28% Complete  
**Priority**: HIGH  
**Blocking**: Production deployment
