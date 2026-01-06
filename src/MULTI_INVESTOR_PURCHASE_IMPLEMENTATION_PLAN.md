# Multi-Investor Purchase Cycle Implementation Plan

## Executive Summary
Transform the Purchase Cycle investor selection from single-investor/contact-based to multi-investor with percentage allocation, using the dedicated Investor registry from Portfolio Management.

---

## Current State Analysis

### Issues Identified
1. **Wrong Data Source**: Investor selection pulls from Contacts (contact.type === 'investor') instead of Portfolio Management Investors
2. **Single Investor Limitation**: Can only select one investor per purchase cycle
3. **No Percentage Allocation**: No way to split ownership among multiple investors
4. **Data Fragmentation**: Investors exist in two places (Contacts vs. Portfolio Management)

### Current Flow
```
Start Purchase Cycle 
  → Select Type: Agency/Investor/Client
  → If Investor:
      → Search Contacts (filtered by type='investor')
      → Select ONE contact
      → Enter deal details
      → Create purchase cycle with single investorId
```

---

## Desired State

### Requirements
1. ✅ Use Portfolio Management Investors (from `/lib/investors.ts`)
2. ✅ Support multiple investor selection
3. ✅ Allow percentage allocation per investor
4. ✅ Validate percentages sum to 100%
5. ✅ Show investor profile summaries (capacity, preferences, etc.)
6. ✅ Create InvestorInvestment records for each investor
7. ✅ Link all investments to the same property/purchase cycle
8. ✅ Support quick "Add Investor" from within the flow

### New Flow
```
Start Purchase Cycle 
  → Select Type: Agency/Investor/Client
  → If Investor:
      → Multi-Investor Selection Modal
          ├─ Search Portfolio Management Investors
          ├─ View investor profiles (capacity, risk profile, preferences)
          ├─ Add multiple investors
          ├─ Set investment percentage for each (must total 100%)
          ├─ Quick Add Investor button (opens CreateInvestorModal)
          └─ Validate percentages
      → Enter deal details (price, seller, dates)
      → Calculate investment amounts per investor
      → Create purchase cycle
      → Create InvestorInvestment records for each investor
      → Update investor portfolio values
```

---

## Technical Implementation Plan

### Phase 1: Data Model Updates

#### 1.1 Update PurchaseCycle Type
**File**: `/types/index.ts`

```typescript
// Current
export interface PurchaseCycle {
  id: string;
  propertyId: string;
  purchaserType: 'agency' | 'investor' | 'client';
  investorId?: string; // Single investor
  investorName?: string;
  // ... other fields
}

// New
export interface PurchaseCycle {
  id: string;
  propertyId: string;
  purchaserType: 'agency' | 'investor' | 'client';
  
  // Multi-investor support
  investors?: InvestorShare[];  // NEW: Array of investors
  
  // Legacy single investor (deprecated but kept for backward compatibility)
  investorId?: string;
  investorName?: string;
  
  // ... other fields
}

// New type for investor shares
export interface InvestorShare {
  investorId: string;
  investorName: string;
  sharePercentage: number;
  investmentAmount: number;
}
```

#### 1.2 Update InvestorInvestment Creation
**File**: `/lib/investors.ts`

Add function to create multiple investments from purchase cycle:
```typescript
export function createInvestmentsFromPurchase(
  purchaseCycleId: string,
  propertyId: string,
  investors: InvestorShare[],
  totalPrice: number,
  purchaseDate: Date
): InvestorInvestment[]
```

### Phase 2: UI Components

#### 2.1 Create InvestorSelectionModal Component
**New File**: `/components/purchase/InvestorSelectionModal.tsx`

**Features**:
- Search and filter Portfolio Management investors
- Display investor cards with key info:
  - Name, contact info
  - Investment capacity
  - Risk profile
  - Preferred property types/locations
  - Current portfolio value
- Multi-select with checkboxes
- Percentage input for each selected investor
- Real-time percentage validation (must sum to 100%)
- Visual progress indicator showing percentage allocation
- "Add Investor" button (opens CreateInvestorModal)
- Selected investors summary panel

**Component Structure**:
```tsx
<InvestorSelectionModal>
  <SearchBar />
  <InvestorGrid>
    <InvestorCard 
      investor={investor}
      selected={boolean}
      onSelect={fn}
      percentage={number}
      onPercentageChange={fn}
    />
  </InvestorGrid>
  <SelectedInvestorsSummary>
    <PercentageProgressBar />
    <InvestorList />
    <TotalValidation />
  </SelectedInvestorsSummary>
  <Actions>
    <AddInvestorButton />
    <CancelButton />
    <ConfirmButton disabled={!isValid} />
  </Actions>
</InvestorSelectionModal>
```

#### 2.2 Update InvestorPurchaseForm
**File**: `/components/purchase/InvestorPurchaseForm.tsx`

**Changes**:
1. Replace single investor selection with "Select Investors" button
2. Open InvestorSelectionModal
3. Display selected investors with their percentages
4. Calculate individual investment amounts based on total price
5. Show breakdown table before submission
6. Update form submission to create multiple InvestorInvestment records

**New UI Elements**:
```tsx
// Instead of dropdown
<SelectedInvestorsDisplay>
  {investors.map(inv => (
    <InvestorChip 
      investor={inv}
      percentage={inv.sharePercentage}
      amount={calculateAmount(totalPrice, inv.sharePercentage)}
      onRemove={handleRemove}
    />
  ))}
  <Button onClick={openModal}>+ Add/Edit Investors</Button>
</SelectedInvestorsDisplay>

<InvestmentBreakdown>
  <Table>
    <Row investor, percentage, amount for each />
    <TotalRow />
  </Table>
</InvestmentBreakdown>
```

### Phase 3: Business Logic Updates

#### 3.1 Update Purchase Cycle Creation
**File**: `/lib/purchaseCycle.ts`

```typescript
export function createPurchaseCycle(data: Partial<PurchaseCycle>): PurchaseCycle {
  // ... existing code
  
  // NEW: If multiple investors, create InvestorInvestment records
  if (data.purchaserType === 'investor' && data.investors && data.investors.length > 0) {
    createInvestmentsFromPurchaseCycle(
      purchaseCycle.id,
      data.propertyId!,
      data.investors,
      purchaseCycle
    );
  }
  
  return purchaseCycle;
}
```

#### 3.2 Create Investment Records
**File**: `/lib/investors.ts`

```typescript
export function createInvestmentsFromPurchaseCycle(
  purchaseCycleId: string,
  propertyId: string,
  investorShares: InvestorShare[],
  purchaseCycle: PurchaseCycle
): void {
  const property = getPropertyById(propertyId);
  if (!property) throw new Error('Property not found');
  
  const totalPrice = parseFloat(purchaseCycle.offerAmount || purchaseCycle.askingPrice || '0');
  
  investorShares.forEach(share => {
    const investment: Partial<InvestorInvestment> = {
      investorId: share.investorId,
      propertyId: propertyId,
      investmentAmount: share.investmentAmount,
      sharePercentage: share.sharePercentage,
      currentValue: share.investmentAmount, // Initial value
      investmentDate: purchaseCycle.createdAt || new Date().toISOString(),
      status: 'active',
      purchaseCycleId: purchaseCycleId,
    };
    
    createInvestorInvestment(investment);
  });
}
```

### Phase 4: Validation & Business Rules

#### 4.1 Percentage Validation
```typescript
function validateInvestorShares(shares: InvestorShare[]): { valid: boolean; error?: string } {
  if (shares.length === 0) {
    return { valid: false, error: 'At least one investor required' };
  }
  
  const totalPercentage = shares.reduce((sum, s) => sum + s.sharePercentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    return { valid: false, error: `Total percentage must be 100% (currently ${totalPercentage.toFixed(2)}%)` };
  }
  
  // Check individual percentages
  const invalidShares = shares.filter(s => s.sharePercentage <= 0 || s.sharePercentage > 100);
  if (invalidShares.length > 0) {
    return { valid: false, error: 'Each investor must have a percentage between 0 and 100' };
  }
  
  return { valid: true };
}
```

#### 4.2 Investment Capacity Validation (Optional)
```typescript
function validateInvestorCapacity(
  investor: Investor,
  investmentAmount: number
): { valid: boolean; warning?: string } {
  if (!investor.totalInvestmentCapacity) {
    return { valid: true }; // No capacity set, allow
  }
  
  const currentInvestments = getInvestorInvestments(investor.id);
  const totalInvested = currentInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const remainingCapacity = investor.totalInvestmentCapacity - totalInvested;
  
  if (investmentAmount > remainingCapacity) {
    return {
      valid: true,
      warning: `This investment (${formatPKR(investmentAmount)}) exceeds remaining capacity (${formatPKR(remainingCapacity)})`
    };
  }
  
  return { valid: true };
}
```

### Phase 5: Integration Points

#### 5.1 InvestorInvestment Linking
Ensure InvestorInvestment records are properly linked:
- `investorId` → Investor from Portfolio Management
- `propertyId` → Property being purchased
- `purchaseCycleId` → The purchase cycle (NEW field if not exists)

#### 5.2 Portfolio Updates
When purchase cycle is created:
1. Create InvestorInvestment records
2. Update investor's portfolio metrics
3. Update property ownership if applicable
4. Trigger portfolio recalculation

#### 5.3 Backward Compatibility
Support existing single-investor purchase cycles:
```typescript
// In getPurchaseCycleInvestors()
export function getPurchaseCycleInvestors(cycle: PurchaseCycle): InvestorShare[] {
  // New multi-investor format
  if (cycle.investors && cycle.investors.length > 0) {
    return cycle.investors;
  }
  
  // Legacy single investor format
  if (cycle.investorId && cycle.investorName) {
    return [{
      investorId: cycle.investorId,
      investorName: cycle.investorName,
      sharePercentage: 100,
      investmentAmount: parseFloat(cycle.offerAmount || cycle.askingPrice || '0')
    }];
  }
  
  return [];
}
```

---

## UI/UX Wireframes

### InvestorSelectionModal Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Select Investors for Purchase                          [X]  │
├─────────────────────────────────────────────────────────────┤
│ [Search investors...]                    [+ Add Investor]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Available Investors                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ [ ] Investor │ │ [✓] Investor │ │ [ ] Investor │         │
│ │     Name 1   │ │     Name 2   │ │     Name 3   │         │
│ │              │ │              │ │              │         │
│ │ Capacity:    │ │ Capacity:    │ │ Capacity:    │         │
│ │ PKR 5M       │ │ PKR 10M      │ │ PKR 8M       │         │
│ │              │ │              │ │              │         │
│ │ Risk: Mod    │ │ Risk: Agg    │ │ Risk: Con    │         │
│ │ Properties:2 │ │ Properties:5 │ │ Properties:1 │         │
│ │              │ │ [────60%──] │ │              │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Selected Investors (2)                    100% allocated ✓  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Investor Name 2        60% [───────] PKR 12,000,000  [x]│ │
│ │ Investor Name 4        40% [─────  ] PKR  8,000,000  [x]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Progress: [████████████████████████████████] 100%           │
│                                                              │
│                                  [Cancel] [Confirm Selection]│
└─────────────────────────────────────────────────────────────┘
```

### Purchase Form with Multi-Investors

```
┌─────────────────────────────────────────────────────────────┐
│ Purchase Details                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Investors (2 selected)              [Change Selection]      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Investor Name 2 (60%) - PKR 12,000,000                │ │
│ │ • Investor Name 4 (40%) - PKR  8,000,000                │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ Total Investment: PKR 20,000,000                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Rest of purchase form fields...]                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Checklist

### Unit Tests
- [ ] Percentage validation (sum to 100%)
- [ ] Investment amount calculation
- [ ] InvestorInvestment record creation
- [ ] Backward compatibility with single investor

### Integration Tests
- [ ] Select single investor (100%)
- [ ] Select multiple investors with valid percentages
- [ ] Add new investor from within modal
- [ ] Remove investor from selection
- [ ] Update percentages dynamically
- [ ] Create purchase cycle with multiple investors
- [ ] Verify InvestorInvestment records created
- [ ] Verify portfolio metrics updated

### Edge Cases
- [ ] 0% percentage not allowed
- [ ] Percentages sum to 99.99% (floating point)
- [ ] Percentages sum to 100.01% (floating point)
- [ ] No investors selected
- [ ] Investor exceeds capacity (warning only)
- [ ] Delete investor mid-selection
- [ ] Network error during creation

### UI/UX Tests
- [ ] Search filters correctly
- [ ] Cards display investor info correctly
- [ ] Percentage inputs validate on blur
- [ ] Progress bar updates real-time
- [ ] Error messages are clear
- [ ] Success toast on completion
- [ ] Modal closes on success
- [ ] Form resets properly

---

## Migration Strategy

### Existing Data
No migration needed - legacy single-investor purchase cycles continue working:
- `investorId` and `investorName` fields remain
- New `investors` array used for multi-investor cycles
- Helper functions handle both formats transparently

### Rollout Plan
1. **Phase 1**: Deploy InvestorSelectionModal (hidden feature flag)
2. **Phase 2**: Update InvestorPurchaseForm to use new modal
3. **Phase 3**: Test with staging data
4. **Phase 4**: Enable for production
5. **Phase 5**: Monitor for issues, collect feedback

---

## Success Metrics

### Functionality
- ✅ Can select multiple investors from Portfolio Management
- ✅ Percentages validate to 100%
- ✅ Investment records created correctly
- ✅ Portfolio metrics update accurately
- ✅ Backward compatible with existing data

### User Experience
- ⏱️ Selection flow takes < 60 seconds
- 📊 Clear visual feedback at each step
- ✅ Error messages are actionable
- 🔄 Can modify selection before confirming

---

## Future Enhancements

### Phase 2 Features
1. **Smart Matching**: Suggest investors based on:
   - Property type preference
   - Location preference
   - Available capacity
   - Risk profile match

2. **Auto-allocation**: "Distribute evenly" button to split equally

3. **Templates**: Save common investor groupings

4. **Investment Packages**: Pre-configured investor groups with set percentages

5. **Capacity Warnings**: Visual indicators when approaching investor limits

6. **Historical Performance**: Show each investor's past ROI on similar properties

---

## Files to Create/Modify

### New Files
1. `/components/purchase/InvestorSelectionModal.tsx` - Main selection component
2. `/components/purchase/InvestorCard.tsx` - Investor display card
3. `/components/purchase/PercentageInput.tsx` - Validated percentage input
4. `/components/purchase/InvestorShareSummary.tsx` - Selected investors display

### Modified Files
1. `/types/index.ts` - Add InvestorShare type, update PurchaseCycle
2. `/components/purchase/InvestorPurchaseForm.tsx` - Integrate new modal
3. `/lib/purchaseCycle.ts` - Multi-investor creation logic
4. `/lib/investors.ts` - Add createInvestmentsFromPurchase function
5. `/components/PurchaseCycleDetailsV4.tsx` - Display multiple investors
6. `/components/portfolio/InvestorDetailView.tsx` - Link to purchase cycles

---

## Timeline Estimate

- **Phase 1** (Data Model): 1 hour
- **Phase 2** (InvestorSelectionModal): 3 hours
- **Phase 3** (InvestorPurchaseForm updates): 2 hours
- **Phase 4** (Business logic): 2 hours
- **Phase 5** (Testing & polish): 2 hours

**Total**: ~10 hours development time

---

## Dependencies

### External
- None - all components use existing UI library

### Internal
- Portfolio Management Investors (`/lib/investors.ts`)
- Purchase Cycle system (`/lib/purchaseCycle.ts`)
- CreateInvestorModal (for quick add)

---

## Risk Assessment

### Low Risk
- ✅ Backward compatible design
- ✅ No database schema changes (localStorage)
- ✅ Incremental rollout possible

### Medium Risk
- ⚠️ Complex percentage validation logic
- ⚠️ Multi-step user flow (potential confusion)

### Mitigation
- Clear error messages
- Visual progress indicators
- Comprehensive testing
- User documentation/tooltips

---

## Conclusion

This implementation provides a robust, user-friendly multi-investor purchase system that:
1. ✅ Uses the correct data source (Portfolio Management Investors)
2. ✅ Supports unlimited investors per purchase
3. ✅ Validates percentage allocation
4. ✅ Maintains backward compatibility
5. ✅ Provides excellent UX with clear feedback
6. ✅ Integrates seamlessly with existing portfolio tracking

The phased approach ensures safe deployment while the modular design allows future enhancements.
