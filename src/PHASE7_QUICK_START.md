# ⚡ PHASE 7 - QUICK START GUIDE

## 🎯 TL;DR

**Goal**: Add 3 advanced features to Financials Hub  
**Time**: 6-7 days  
**Start**: Day 1, Feature 1 (Custom Report Builder)  
**Priority**: Reports → Charts → Budget Editing  

---

## 🚀 Getting Started (First 30 Minutes)

### Step 1: Verify Phase 6 is Complete
```bash
# Check that Phase 6 is working
1. Open aaraazi
2. Navigate to Financials Hub
3. Test Financial Reports module
4. Test Budgeting module
5. Confirm no console errors
```

### Step 2: Review the Plan
- [ ] Read PHASE7_PLAN.md (20 min) - Detailed specifications
- [ ] Skim PHASE7_ROADMAP.md (10 min) - Day-by-day breakdown

### Step 3: Set Up Your Workspace
```bash
# Create feature branches (if using git)
git checkout -b phase7-custom-reports
git checkout -b phase7-charts
git checkout -b phase7-budget-editing

# Or work on main branch with frequent commits
```

---

## 📋 Day 1 Checklist (Custom Report Builder Foundation)

### Morning Tasks (4 hours)

#### Task 1.1: Create TypeScript Interfaces (45 min)
```typescript
// Create file: /types/custom-reports.ts

export interface CustomReportTemplate {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  isShared: boolean;
  config: ReportConfiguration;
  generationCount: number;
  lastGenerated?: string;
}

export interface ReportConfiguration {
  dataSources: DataSource[];
  fields: SelectedField[];
  filters: FilterRule[];
  grouping?: GroupingConfig;
  sorting?: SortConfig[];
}

// ... rest of interfaces from PHASE7_PLAN.md
```

**✅ Done when**: File compiles without errors, interfaces exported

#### Task 1.2: Create Folder Structure (15 min)
```bash
# Create new folders
/components/financials/reports/custom-builder/
/components/financials/reports/visualizations/
/components/financials/reports/visualizations/charts/
```

**✅ Done when**: Folders created, empty index files added

#### Task 1.3: Create ReportBuilderModal Shell (2 hours)
```typescript
// Create file: /components/financials/reports/custom-builder/ReportBuilderModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (report: CustomReportTemplate) => void;
}

export const ReportBuilderModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ReportConfiguration>({
    dataSources: [],
    fields: [],
    filters: [],
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Create Custom Report - Step {currentStep} of 5
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          {currentStep === 1 && <DataSourceStep />}
          {currentStep === 2 && <FieldSelectorStep />}
          {currentStep === 3 && <FilterStep />}
          {currentStep === 4 && <GroupingStep />}
          {currentStep === 5 && <PreviewStep />}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button 
              onClick={() => setCurrentStep(s => Math.min(5, s + 1))}
              disabled={currentStep === 5}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Placeholder step components (will be built out)
const DataSourceStep = () => <div>Data Source Selection</div>;
const FieldSelectorStep = () => <div>Field Selector</div>;
const FilterStep = () => <div>Filter Configurator</div>;
const GroupingStep = () => <div>Grouping</div>;
const PreviewStep = () => <div>Preview</div>;
```

**✅ Done when**: Modal opens, step navigation works, placeholders visible

#### Task 1.4: Implement Step 1 - Data Source Selection (1.5 hours)
```typescript
// Inside ReportBuilderModal.tsx

const DataSourceStep: React.FC<Props> = ({ config, onChange }) => {
  const sources: DataSource[] = [
    { id: 'deals', label: 'Deals', icon: <DollarSign /> },
    { id: 'properties', label: 'Properties', icon: <Building2 /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt /> },
    { id: 'commissions', label: 'Commissions', icon: <Percent /> },
    { id: 'investors', label: 'Investors', icon: <Users /> },
    { id: 'budgets', label: 'Budgets', icon: <Target /> },
  ];

  const handleToggle = (sourceId: string) => {
    const isSelected = config.dataSources.includes(sourceId);
    const newSources = isSelected
      ? config.dataSources.filter(s => s !== sourceId)
      : [...config.dataSources, sourceId];
    
    onChange({ ...config, dataSources: newSources });
  };

  return (
    <div className="space-y-4">
      <h3>Select Data Sources</h3>
      <p className="text-muted-foreground">
        Choose one or more data sources for your report
      </p>

      <div className="grid grid-cols-2 gap-4">
        {sources.map(source => (
          <button
            key={source.id}
            onClick={() => handleToggle(source.id)}
            className={`p-4 border rounded-lg flex items-center gap-3 ${
              config.dataSources.includes(source.id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            {source.icon}
            <span>{source.label}</span>
            {config.dataSources.includes(source.id) && (
              <Check className="ml-auto h-5 w-5 text-blue-600" />
            )}
          </button>
        ))}
      </div>

      {config.dataSources.length === 0 && (
        <p className="text-yellow-600">
          ⚠️ Please select at least one data source
        </p>
      )}
    </div>
  );
};
```

**✅ Done when**: Can select/deselect sources, validation works, state updates

---

### Afternoon Tasks (4 hours)

#### Task 1.5: Implement Step 2 - Field Selector (Basic) (3 hours)
```typescript
// Create file: /components/financials/reports/custom-builder/FieldSelector.tsx

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface Field {
  id: string;
  source: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
}

interface Props {
  dataSources: string[];
  selectedFields: SelectedField[];
  onChange: (fields: SelectedField[]) => void;
}

export const FieldSelector: React.FC<Props> = ({ 
  dataSources, 
  selectedFields, 
  onChange 
}) => {
  // Generate available fields based on selected data sources
  const availableFields = useMemo(() => {
    return dataSources.flatMap(source => 
      getFieldsForSource(source)
    );
  }, [dataSources]);

  const handleAddField = (field: Field) => {
    if (!selectedFields.find(f => f.id === field.id)) {
      onChange([...selectedFields, field]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    onChange(selectedFields.filter(f => f.id !== fieldId));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Available Fields */}
      <div className="space-y-2">
        <h4>Available Fields</h4>
        <div className="border rounded-lg p-4 h-96 overflow-y-auto">
          {availableFields.map(field => (
            <div 
              key={field.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium">{field.label}</div>
                <div className="text-xs text-gray-500">{field.source}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAddField(field)}
              >
                Add →
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Fields */}
      <div className="space-y-2">
        <h4>Selected Fields</h4>
        <div className="border rounded-lg p-4 h-96 overflow-y-auto">
          {selectedFields.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Click "Add" to select fields
            </p>
          ) : (
            selectedFields.map((field, index) => (
              <div 
                key={field.id}
                className="flex items-center justify-between p-2 bg-blue-50 rounded mb-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{field.label}</div>
                    <div className="text-xs text-gray-500">{field.type}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveField(field.id)}
                >
                  Remove ×
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate fields for each source
const getFieldsForSource = (source: string): Field[] => {
  const fieldsBySource: Record<string, Field[]> = {
    deals: [
      { id: 'deal_id', source: 'deals', label: 'Deal ID', type: 'text' },
      { id: 'deal_price', source: 'deals', label: 'Deal Price', type: 'currency' },
      { id: 'deal_status', source: 'deals', label: 'Status', type: 'text' },
      { id: 'deal_date', source: 'deals', label: 'Date', type: 'date' },
    ],
    properties: [
      { id: 'property_title', source: 'properties', label: 'Property Title', type: 'text' },
      { id: 'property_price', source: 'properties', label: 'Price', type: 'currency' },
      { id: 'property_area', source: 'properties', label: 'Area', type: 'number' },
    ],
    // ... add fields for other sources
  };

  return fieldsBySource[source] || [];
};
```

**✅ Done when**: Can add/remove fields, list updates correctly, validation works

#### Task 1.6: Test and Debug (1 hour)
- [ ] Test modal opening and closing
- [ ] Test step navigation
- [ ] Test data source selection
- [ ] Test field selection
- [ ] Fix any bugs
- [ ] Check console for errors

**✅ Done when**: No console errors, basic flow works smoothly

---

## 🎯 End of Day 1 Goals

You should have:
- ✅ TypeScript interfaces created
- ✅ Folder structure set up
- ✅ ReportBuilderModal with 5-step wizard shell
- ✅ Step 1 (Data Sources) fully functional
- ✅ Step 2 (Fields) basic version working
- ✅ No TypeScript or console errors

**Progress**: ~15% of Phase 7 complete

---

## 📝 Quick Commands

### Check Current Status
```bash
# Files that should exist after Day 1
ls /types/custom-reports.ts
ls /components/financials/reports/custom-builder/ReportBuilderModal.tsx
ls /components/financials/reports/custom-builder/FieldSelector.tsx
```

### Test Modal
```typescript
// In FinancialReportsWorkspace.tsx, add temporarily:

const [showBuilder, setShowBuilder] = useState(false);

// In JSX:
<Button onClick={() => setShowBuilder(true)}>
  Test Report Builder
</Button>

<ReportBuilderModal 
  open={showBuilder}
  onClose={() => setShowBuilder(false)}
  onSave={(report) => console.log('Report:', report)}
/>
```

---

## 🚨 Common Issues & Solutions

### Issue: TypeScript errors with interfaces
**Solution**: Make sure all imports are correct, use `export interface` not `type`

### Issue: Modal doesn't open
**Solution**: Check Dialog `open` prop is connected to state, verify Shadcn Dialog is installed

### Issue: Fields not displaying
**Solution**: Verify `dataSources` array is populated, check `getFieldsForSource()` returns data

### Issue: State not updating
**Solution**: Make sure `onChange` callbacks are called, use functional updates: `setState(prev => ...)`

---

## 💡 Pro Tips

1. **Save frequently**: Commit after each task completion
2. **Test as you go**: Don't wait until end of day to test
3. **Use console.log**: Log state changes to debug
4. **Reference Phase 6**: Look at existing modals for patterns
5. **Keep it simple**: Start with basic functionality, enhance later

---

## 📞 Need Help?

### Stuck on TypeScript?
- Check `/types/index.ts` for similar interface patterns
- Look at existing components for examples
- Use `any` temporarily, fix types later

### Stuck on UI?
- Reference existing modals (CreateBudgetModal, GenerateReportModal)
- Use Shadcn UI components consistently
- Follow Design System V4.1 guidelines

### Stuck on Logic?
- Break down into smaller functions
- Write pseudo-code first
- Test with mock data

---

## ✅ Daily Wrap-Up

At end of each day:
1. [ ] Commit all code changes
2. [ ] Update checklist in PHASE7_ROADMAP.md
3. [ ] Note any blockers for tomorrow
4. [ ] Test that nothing is broken
5. [ ] Clear console errors/warnings

---

## 🎊 Motivation

Remember: You're building a **world-class financial management system**!

After Phase 7:
- ✅ Users can build any custom report they need
- ✅ Data comes alive with beautiful charts
- ✅ Budgets are fully editable with complete audit trails
- ✅ aaraazi will be **enterprise-ready**!

---

**Day 1 Status**: ⏰ Ready to Start  
**Time Estimate**: 8 hours  
**Difficulty**: Medium  
**Confidence**: High  

---

*You've got this! Let's build! 🚀*
