# 🚀 PHASE 7 PLAN - Advanced Financial Features

## 📋 Overview

**Phase**: 7  
**Status**: 🟡 Planning  
**Target Start**: January 2, 2026  
**Estimated Duration**: 5-7 days  
**Complexity**: High  

---

## 🎯 Phase 7 Objectives

Enhance the Financials Hub with advanced capabilities that empower users to:
1. **Build custom reports** tailored to their specific needs
2. **Visualize financial data** through interactive charts and graphs
3. **Edit and manage budgets** with full CRUD operations

---

## 📦 Feature Breakdown

### **Feature 1: Custom Report Builder** ⭐ Priority: HIGH
**Estimated Time**: 2-3 days  
**Complexity**: High  

#### Vision
A powerful, user-friendly report builder that allows users to create custom financial reports by selecting fields, applying filters, and configuring layouts without touching code.

#### Core Capabilities
- ✅ Drag-and-drop field selection
- ✅ Multi-source data integration (deals, properties, expenses, etc.)
- ✅ Custom filter configuration
- ✅ Date range presets and custom ranges
- ✅ Grouping and aggregation options
- ✅ Save custom report templates
- ✅ Share reports with team members
- ✅ Export to PDF, CSV, Excel
- ✅ Schedule recurring reports (future)

---

### **Feature 2: Advanced Reporting with Charts** ⭐ Priority: HIGH
**Estimated Time**: 2-3 days  
**Complexity**: Medium  

#### Vision
Transform static reports into dynamic, interactive visualizations that reveal insights and trends at a glance.

#### Core Capabilities
- ✅ Interactive chart library (Recharts)
- ✅ Multiple chart types (Line, Bar, Pie, Area, Combo)
- ✅ Real-time data binding
- ✅ Drill-down capabilities
- ✅ Tooltip and legend customization
- ✅ Export charts as PNG/SVG
- ✅ Responsive chart sizing
- ✅ Chart builder interface

---

### **Feature 3: Budget Editing Capabilities** ⭐ Priority: MEDIUM
**Estimated Time**: 1 day  
**Complexity**: Low  

#### Vision
Complete the budget lifecycle with full edit capabilities, versioning, and audit trails.

#### Core Capabilities
- ✅ Edit budget amount
- ✅ Edit budget period
- ✅ Edit budget category
- ✅ Budget version history
- ✅ Audit trail (who edited when)
- ✅ Bulk edit operations
- ✅ Budget cloning (copy from previous period)
- ✅ Budget archiving

---

## 🏗️ Architecture & Design

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FINANCIALS HUB V4.1                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Existing 8 Modules]                                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Module 7: Financial Reports (ENHANCED)               │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ • Existing: 8 predefined templates                   │ │
│  │ • NEW: Custom Report Builder                         │ │
│  │ • NEW: Chart Visualizations                          │ │
│  │ • NEW: Advanced Export Options                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Module 8: Budgeting & Forecasting (ENHANCED)         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ • Existing: Create & View Budgets                    │ │
│  │ • NEW: Edit Budget Modal                             │ │
│  │ • NEW: Budget Version History                        │ │
│  │ • NEW: Bulk Edit Operations                          │ │
│  │ • NEW: Clone Budget Feature                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
/components/financials/

├── reports/                                   
│   ├── ReportMetrics.tsx                      ✅ Existing
│   ├── ReportTemplateCard.tsx                 ✅ Existing
│   ├── GenerateReportModal.tsx                ✅ Existing
│   ├── FinancialReportsWorkspace.tsx          ✅ Existing (will be enhanced)
│   │
│   ├── custom-builder/                        ⭐ NEW - Phase 7A
│   │   ├── ReportBuilderModal.tsx            (Main builder interface)
│   │   ├── FieldSelector.tsx                 (Drag-drop field selection)
│   │   ├── FilterConfigurator.tsx            (Filter builder)
│   │   ├── GroupingConfigurator.tsx          (Grouping & aggregation)
│   │   ├── PreviewPanel.tsx                  (Live preview)
│   │   └── CustomReportCard.tsx              (Display saved custom reports)
│   │
│   └── visualizations/                        ⭐ NEW - Phase 7B
│       ├── ChartBuilder.tsx                   (Chart configuration)
│       ├── ChartPreview.tsx                   (Live chart preview)
│       ├── ChartTypeSelector.tsx              (Select chart type)
│       ├── ChartExporter.tsx                  (Export chart as image)
│       └── charts/                            (Individual chart components)
│           ├── LineChartComponent.tsx
│           ├── BarChartComponent.tsx
│           ├── PieChartComponent.tsx
│           ├── AreaChartComponent.tsx
│           └── ComboChartComponent.tsx
│
└── budgeting/
    ├── BudgetMetrics.tsx                      ✅ Existing
    ├── BudgetCategoryCard.tsx                 ✅ Existing (will be enhanced)
    ├── CreateBudgetModal.tsx                  ✅ Existing
    ├── BudgetingWorkspace.tsx                 ✅ Existing (will be enhanced)
    │
    ├── EditBudgetModal.tsx                    ⭐ NEW - Phase 7C
    ├── BudgetHistoryModal.tsx                 ⭐ NEW - Phase 7C
    ├── BulkEditBudgetsModal.tsx               ⭐ NEW - Phase 7C
    └── CloneBudgetModal.tsx                   ⭐ NEW - Phase 7C

/lib/
├── custom-report-builder.ts                   ⭐ NEW - Business logic
├── chart-data-transformer.ts                  ⭐ NEW - Data transformation
└── budget-versioning.ts                       ⭐ NEW - Version management

/types/
└── custom-reports.ts                          ⭐ NEW - TypeScript interfaces
```

**Estimated New Files**: 25  
**Estimated Lines of Code**: ~4,500  

---

## 🎨 Feature 1: Custom Report Builder - Detailed Spec

### User Flow

```
1. User clicks "Create Custom Report" button
2. ReportBuilderModal opens with 4-step wizard:
   
   Step 1: Select Data Sources
   ┌─────────────────────────────────────┐
   │ ☑ Deals                            │
   │ ☑ Properties                        │
   │ ☐ Expenses                          │
   │ ☐ Commissions                       │
   │ ☐ Investors                         │
   └─────────────────────────────────────┘
   
   Step 2: Select Fields (Drag & Drop)
   ┌─────────────────┬───────────────────┐
   │ Available       │ Selected          │
   │ Fields          │ Fields            │
   ├─────────────────┼───────────────────┤
   │ ⋮ Deal ID       │ ⋮ Property Title  │
   │ ⋮ Property      │ ⋮ Deal Price      │
   │ ⋮ Agent         │ ⋮ Agent Name      │
   │ ⋮ Status        │ ⋮ Status          │
   │ ⋮ Date          │                   │
   └─────────────────┴───────────────────┘
   
   Step 3: Configure Filters
   ┌─────────────────────────────────────┐
   │ + Add Filter Rule                   │
   │                                     │
   │ [Status] [equals] [completed]  [×] │
   │ [Date] [between] [Jan-Jun 2026] [×]│
   └─────────────────────────────────────┘
   
   Step 4: Grouping & Aggregation
   ┌─────────────────────────────────────┐
   │ Group By: [Agent Name]    ▼         │
   │                                     │
   │ Aggregate:                          │
   │ • Sum of Deal Price                │
   │ • Count of Deals                    │
   │ • Average Commission                │
   └─────────────────────────────────────┘
   
   Step 5: Preview & Save
   ┌─────────────────────────────────────┐
   │ [Live Preview Table]                │
   │                                     │
   │ Report Name: [Agent Performance Q1] │
   │ Description: [Optional]             │
   │                                     │
   │ [Cancel]  [Save & Generate]         │
   └─────────────────────────────────────┘
```

### Data Model

```typescript
// /types/custom-reports.ts

export interface CustomReportTemplate {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  isShared: boolean;
  
  config: ReportConfiguration;
  
  // Usage stats
  generationCount: number;
  lastGenerated?: string;
}

export interface ReportConfiguration {
  dataSources: DataSource[];
  fields: SelectedField[];
  filters: FilterRule[];
  grouping?: GroupingConfig;
  sorting?: SortConfig[];
  formatting?: FormattingConfig;
}

export interface DataSource {
  source: 'deals' | 'properties' | 'expenses' | 'commissions' | 'investors' | 'budgets';
  alias?: string;
  joins?: JoinConfig[];
}

export interface SelectedField {
  source: string;
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface FilterRule {
  id: string;
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'between' | 'in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface GroupingConfig {
  groupBy: string[];
  aggregations: {
    field: string;
    function: 'sum' | 'avg' | 'count' | 'min' | 'max';
    label: string;
  }[];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
```

### Key Components

#### 1. ReportBuilderModal.tsx
```typescript
/**
 * Multi-step wizard for building custom reports
 * 
 * Features:
 * - 5-step progressive disclosure
 * - Real-time preview
 * - Validation at each step
 * - Save template functionality
 * 
 * Steps:
 * 1. Select data sources
 * 2. Choose fields (drag & drop)
 * 3. Configure filters
 * 4. Set grouping/aggregation
 * 5. Preview & save
 */
export const ReportBuilderModal: React.FC<Props> = ({ ... }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ReportConfiguration>({...});
  
  // Step navigation
  // Data source selection
  // Field selection with drag-drop
  // Filter builder
  // Grouping configurator
  // Live preview
  // Save functionality
}
```

**Estimated Lines**: 450

#### 2. FieldSelector.tsx
```typescript
/**
 * Drag-and-drop field selection interface
 * 
 * Features:
 * - Two-column layout (Available | Selected)
 * - Drag-drop using react-dnd
 * - Field type indicators
 * - Reordering selected fields
 * - Quick actions (select all, clear)
 */
export const FieldSelector: React.FC<Props> = ({ ... }) => {
  // Available fields based on data sources
  // Drag-drop handlers
  // Field metadata display
  // Reordering logic
}
```

**Estimated Lines**: 280

#### 3. FilterConfigurator.tsx
```typescript
/**
 * Visual filter builder
 * 
 * Features:
 * - Add/remove filter rules
 * - Field-aware operator selection
 * - Value input based on field type
 * - AND/OR logical operators
 * - Filter validation
 */
export const FilterConfigurator: React.FC<Props> = ({ ... }) => {
  // Filter rules state
  // Add/remove handlers
  // Operator selection based on field type
  // Value input components
  // Validation
}
```

**Estimated Lines**: 320

### localStorage Structure

```javascript
{
  "custom_report_templates": [
    {
      id: "custom_001",
      name: "Agent Performance Q1 2026",
      description: "Quarterly performance by agent",
      createdBy: "user_123",
      createdAt: "2026-01-05T10:00:00Z",
      lastModified: "2026-01-05T10:00:00Z",
      isShared: false,
      generationCount: 3,
      lastGenerated: "2026-01-10T15:30:00Z",
      config: {
        dataSources: [
          { source: "deals", alias: "Deals" },
          { source: "properties", alias: "Properties" }
        ],
        fields: [
          { source: "deals", field: "agentId", label: "Agent", type: "text" },
          { source: "deals", field: "agreedPrice", label: "Deal Value", type: "currency", aggregation: "sum" },
          { source: "deals", field: "id", label: "Deal Count", type: "number", aggregation: "count" }
        ],
        filters: [
          { id: "f1", field: "status", operator: "equals", value: "completed" },
          { id: "f2", field: "completedAt", operator: "between", value: ["2026-01-01", "2026-03-31"] }
        ],
        grouping: {
          groupBy: ["agentId"],
          aggregations: [
            { field: "agreedPrice", function: "sum", label: "Total Sales" },
            { field: "id", function: "count", label: "Number of Deals" }
          ]
        }
      }
    }
  ]
}
```

---

## 📊 Feature 2: Advanced Reporting with Charts - Detailed Spec

### Vision

Transform reports into visual stories with interactive charts that reveal patterns and insights.

### Supported Chart Types

1. **Line Chart** - Trends over time
2. **Bar Chart** - Comparisons across categories
3. **Pie Chart** - Proportional breakdowns
4. **Area Chart** - Cumulative trends
5. **Combo Chart** - Multiple data series

### User Flow

```
Option A: Add Chart to Predefined Report
1. Generate any predefined report (P&L, Balance Sheet, etc.)
2. Click "Add Visualization" button
3. ChartBuilder modal opens
4. Select chart type
5. Map data fields to chart axes
6. Customize appearance
7. Preview and save

Option B: Add Chart to Custom Report
1. Build custom report
2. In Step 5 (Preview), click "Add Chart"
3. Same flow as Option A

Option C: Standalone Chart Creation
1. Click "Create Chart" in Reports workspace
2. Select data source
3. Configure chart
4. Save as standalone visualization
```

### Component Architecture

#### 1. ChartBuilder.tsx
```typescript
/**
 * Chart configuration wizard
 * 
 * Features:
 * - Chart type selection
 * - Data field mapping
 * - Axis configuration
 * - Color customization
 * - Legend & tooltip settings
 * - Real-time preview
 */
export const ChartBuilder: React.FC<Props> = ({ data, onSave }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [config, setConfig] = useState<ChartConfig>({...});
  
  // Chart type selection
  // Field mapping (X-axis, Y-axis, series)
  // Color picker
  // Preview
  // Export options
}
```

**Estimated Lines**: 380

#### 2. LineChartComponent.tsx (Example)
```typescript
/**
 * Recharts Line Chart wrapper
 * 
 * Features:
 * - Responsive sizing
 * - Interactive tooltips
 * - Clickable data points
 * - Export as PNG/SVG
 * - Customizable colors
 */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartComponent: React.FC<Props> = ({ 
  data, 
  xField, 
  yFields, 
  colors,
  title 
}) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xField} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yFields.map((field, index) => (
            <Line 
              key={field}
              type="monotone"
              dataKey={field}
              stroke={colors[index]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-actions">
        <Button onClick={exportAsPNG}>Export PNG</Button>
        <Button onClick={exportAsSVG}>Export SVG</Button>
      </div>
    </div>
  );
};
```

**Estimated Lines**: 150 per chart type

### Chart Data Transformer

```typescript
// /lib/chart-data-transformer.ts

/**
 * Transform report data into chart-compatible format
 */
export const transformForChart = (
  reportData: any[],
  config: ChartConfig
): ChartData => {
  // Group by time periods if needed
  // Aggregate values
  // Format for Recharts
  // Handle missing data
  // Apply formatting
};

export const generateChartOptions = (
  dataSource: DataSource,
  fields: SelectedField[]
): ChartOption[] => {
  // Generate recommended chart types
  // Based on data types and cardinality
};
```

### Example Charts

#### Revenue Trend (Line Chart)
```typescript
// Data structure
const revenueData = [
  { month: 'Jan', revenue: 500000, expenses: 350000 },
  { month: 'Feb', revenue: 650000, expenses: 400000 },
  { month: 'Mar', revenue: 720000, expenses: 420000 },
  // ...
];

// Chart config
{
  type: 'line',
  xAxis: 'month',
  yAxis: ['revenue', 'expenses'],
  colors: ['#10b981', '#ef4444'],
  title: 'Revenue vs Expenses Trend',
  showLegend: true
}
```

#### Deal Status Distribution (Pie Chart)
```typescript
// Data structure
const statusData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'Active', value: 32, color: '#3b82f6' },
  { name: 'Pending', value: 18, color: '#f59e0b' },
  { name: 'Cancelled', value: 5, color: '#ef4444' },
];

// Chart config
{
  type: 'pie',
  valueField: 'value',
  nameField: 'name',
  title: 'Deal Status Distribution',
  showPercentage: true
}
```

---

## 🎯 Feature 3: Budget Editing - Detailed Spec

### User Flow

```
Option 1: Edit Single Budget
1. Click "Edit" button on budget card (three-dot menu)
2. EditBudgetModal opens with pre-filled data
3. Modify amount, category, or period
4. Click "Save Changes"
5. Budget updates, version saved to history

Option 2: Bulk Edit Budgets
1. Select multiple budgets (checkboxes)
2. Click "Bulk Edit" button
3. BulkEditBudgetsModal opens
4. Choose what to edit (amount, period, add percentage)
5. Apply changes to all selected

Option 3: Clone Budget
1. Click "Clone" on existing budget
2. CloneBudgetModal opens
3. Select new period
4. Optionally adjust amount (e.g., +10% inflation)
5. Create new budget based on template
```

### Component Architecture

#### 1. EditBudgetModal.tsx
```typescript
/**
 * Edit existing budget
 * 
 * Features:
 * - Pre-filled form with current values
 * - All fields editable
 * - Validation
 * - Change tracking
 * - Version history preview
 * - Confirmation on major changes
 */
export const EditBudgetModal: React.FC<Props> = ({ 
  budget, 
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    category: budget.name,
    amount: budget.budgetAmount,
    period: budget.period,
  });
  
  const [changes, setChanges] = useState<string[]>([]);
  
  const handleSave = () => {
    // Create version entry
    const version = {
      id: generateId(),
      budgetId: budget.id,
      previousAmount: budget.budgetAmount,
      newAmount: formData.amount,
      changedBy: currentUser.id,
      changedAt: new Date().toISOString(),
      changeType: 'edit',
      changes: changes
    };
    
    // Save version
    saveBudgetVersion(version);
    
    // Update budget
    onSave({
      ...budget,
      ...formData,
      lastModified: new Date().toISOString(),
      lastModifiedBy: currentUser.id
    });
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      {/* Form fields */}
      {/* Change summary */}
      {/* Save/Cancel buttons */}
    </Dialog>
  );
};
```

**Estimated Lines**: 250

#### 2. BudgetHistoryModal.tsx
```typescript
/**
 * View budget version history
 * 
 * Features:
 * - Timeline of all changes
 * - Who changed what and when
 * - Before/after values
 * - Restore previous version
 */
export const BudgetHistoryModal: React.FC<Props> = ({ budgetId }) => {
  const versions = useMemo(() => {
    return getBudgetVersions(budgetId).sort(
      (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
    );
  }, [budgetId]);
  
  return (
    <Dialog>
      <div className="timeline">
        {versions.map(version => (
          <TimelineItem key={version.id}>
            <div className="timestamp">{formatDate(version.changedAt)}</div>
            <div className="user">{version.changedBy}</div>
            <div className="changes">
              {version.changes.map(change => (
                <div key={change}>
                  {change.field}: 
                  <span className="old">{change.oldValue}</span> → 
                  <span className="new">{change.newValue}</span>
                </div>
              ))}
            </div>
          </TimelineItem>
        ))}
      </div>
    </Dialog>
  );
};
```

**Estimated Lines**: 180

#### 3. CloneBudgetModal.tsx
```typescript
/**
 * Clone budget to new period
 * 
 * Features:
 * - Select source budget
 * - Choose new period
 * - Adjust amount (±%)
 * - Preview new budget
 * - Bulk clone multiple budgets
 */
export const CloneBudgetModal: React.FC<Props> = ({ budget }) => {
  const [newPeriod, setNewPeriod] = useState('');
  const [adjustment, setAdjustment] = useState(0); // percentage
  
  const newAmount = useMemo(() => {
    return budget.budgetAmount * (1 + adjustment / 100);
  }, [budget.budgetAmount, adjustment]);
  
  return (
    <Dialog>
      <div className="source-budget">
        <label>Cloning from:</label>
        <BudgetPreview budget={budget} />
      </div>
      
      <div className="new-period">
        <Select value={newPeriod} onValueChange={setNewPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {generatePeriods().map(period => (
              <SelectItem key={period} value={period}>{period}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="adjustment">
        <label>Adjust amount:</label>
        <Input
          type="number"
          value={adjustment}
          onChange={(e) => setAdjustment(Number(e.target.value))}
          suffix="%"
        />
        <p className="preview">
          New amount: {formatPKR(newAmount)}
        </p>
      </div>
      
      <DialogFooter>
        <Button onClick={handleClone}>Clone Budget</Button>
      </DialogFooter>
    </Dialog>
  );
};
```

**Estimated Lines**: 200

### Enhanced BudgetCategoryCard

Add edit actions to existing card:

```typescript
// BudgetCategoryCard.tsx - Add three-dot menu

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setShowEditModal(true)}>
      <Edit className="mr-2 h-4 w-4" />
      Edit Budget
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShowHistoryModal(true)}>
      <History className="mr-2 h-4 w-4" />
      View History
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShowCloneModal(true)}>
      <Copy className="mr-2 h-4 w-4" />
      Clone to New Period
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem 
      onClick={() => handleArchive(budget.id)}
      className="text-yellow-600"
    >
      <Archive className="mr-2 h-4 w-4" />
      Archive Budget
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Budget Versioning Data Model

```typescript
// /lib/budget-versioning.ts

export interface BudgetVersion {
  id: string;
  budgetId: string;
  versionNumber: number;
  
  // Change tracking
  previousAmount: number;
  newAmount: number;
  previousPeriod?: string;
  newPeriod?: string;
  previousCategory?: string;
  newCategory?: string;
  
  // Metadata
  changedBy: string;
  changedAt: string;
  changeType: 'create' | 'edit' | 'clone' | 'archive';
  changeReason?: string;
  
  // Detailed changes
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export const saveBudgetVersion = (version: BudgetVersion) => {
  const versions = getBudgetVersions(version.budgetId);
  versions.push(version);
  localStorage.setItem(
    `budget_versions_${version.budgetId}`,
    JSON.stringify(versions)
  );
};

export const getBudgetVersions = (budgetId: string): BudgetVersion[] => {
  const data = localStorage.getItem(`budget_versions_${budgetId}`);
  return data ? JSON.parse(data) : [];
};

export const restoreVersion = (budgetId: string, versionId: string) => {
  // Find version
  // Create new version for restore action
  // Update budget with version data
};
```

---

## 📅 Implementation Timeline

### **Phase 7A: Custom Report Builder** (Days 1-3)
**Duration**: 2-3 days  

#### Day 1: Foundation
- [ ] Create custom-reports.ts types
- [ ] Create ReportBuilderModal shell
- [ ] Implement Step 1: Data source selection
- [ ] Implement Step 2: Field selector (basic)
- [ ] Test localStorage integration

#### Day 2: Core Builder
- [ ] Implement drag-drop for FieldSelector
- [ ] Create FilterConfigurator component
- [ ] Implement GroupingConfigurator
- [ ] Build PreviewPanel with live updates
- [ ] Add save functionality

#### Day 3: Integration & Polish
- [ ] Integrate with FinancialReportsWorkspace
- [ ] Add CustomReportCard component
- [ ] Test report generation
- [ ] Export functionality
- [ ] Bug fixes and polish

**Deliverables**:
- 6 new components
- Custom report builder fully functional
- localStorage persistence
- Export to PDF/CSV/Excel

---

### **Phase 7B: Advanced Charts** (Days 4-5)
**Duration**: 2 days  

#### Day 4: Chart Foundation
- [ ] Install and configure recharts
- [ ] Create ChartBuilder component
- [ ] Implement ChartTypeSelector
- [ ] Build LineChartComponent
- [ ] Build BarChartComponent
- [ ] Create chart-data-transformer.ts

#### Day 5: More Charts & Integration
- [ ] Build PieChartComponent
- [ ] Build AreaChartComponent
- [ ] Implement ChartExporter (PNG/SVG)
- [ ] Integrate charts with reports
- [ ] Add "Add Chart" button to report previews
- [ ] Test all chart types

**Deliverables**:
- 5 chart components
- Chart builder interface
- Export chart as image
- Integration with reports

---

### **Phase 7C: Budget Editing** (Day 6)
**Duration**: 1 day  

#### Day 6: Budget Edit Features
- [ ] Create EditBudgetModal
- [ ] Create BudgetHistoryModal
- [ ] Create CloneBudgetModal
- [ ] Create BulkEditBudgetsModal
- [ ] Add three-dot menu to BudgetCategoryCard
- [ ] Implement budget-versioning.ts
- [ ] Test all edit flows
- [ ] Update BudgetingWorkspace

**Deliverables**:
- 4 new components
- Budget versioning system
- Full CRUD for budgets
- Audit trail

---

### **Phase 7D: Testing & Documentation** (Day 7)
**Duration**: 1 day  

#### Day 7: Final Testing
- [ ] Integration testing all features
- [ ] Create TESTING_CHECKLIST_PHASE7.md
- [ ] Create USER_GUIDE_PHASE7.md
- [ ] Update PHASE7_IMPLEMENTATION_SUMMARY.md
- [ ] Fix bugs
- [ ] Performance optimization
- [ ] Final polish

**Deliverables**:
- Complete testing checklist
- User documentation
- Bug fixes
- Production-ready code

---

## 📊 Success Metrics

### Custom Report Builder
- [ ] Users can create custom report in < 5 minutes
- [ ] 80%+ of custom reports generate successfully
- [ ] At least 3 custom reports created per user per month
- [ ] Export success rate > 95%

### Charts
- [ ] All 5 chart types render correctly
- [ ] Chart load time < 500ms
- [ ] Export image success rate > 95%
- [ ] Users create at least 1 chart per report

### Budget Editing
- [ ] Edit budget in < 30 seconds
- [ ] Zero data loss during edits
- [ ] Version history tracks all changes
- [ ] Clone budget success rate 100%

---

## 🎨 Design Mockups (Text-Based)

### Custom Report Builder Modal

```
┌────────────────────────────────────────────────────────────────┐
│  Create Custom Report                             [Step 2 of 5] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Select Fields                                                 │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  ┌─────────────────────────┬────────────────────────────────┐ │
│  │ Available Fields        │ Selected Fields                │ │
│  ├─────────────────────────┼────────────────────────────────┤ │
│  │                         │                                │ │
│  │ 📋 Deals                │ 🏢 Property Title             │ │
│  │   ⋮ Deal ID             │ 💰 Deal Price                 │ │
│  │   ⋮ Agent Name          │ 👤 Agent Name                 │ │
│  │   ⋮ Status              │ 📅 Completion Date            │ │
│  │   ⋮ Agreed Price        │                                │ │
│  │   ⋮ Commission          │ [Drag fields here]             │ │
│  │                         │                                │ │
│  │ 🏠 Properties           │                                │ │
│  │   ⋮ Property Title      │                                │ │
│  │   ⋮ Address             │                                │ │
│  │   ⋮ Area                │                                │ │
│  │   ⋮ Price               │                                │ │
│  │                         │                                │ │
│  └─────────────────────────┴────────────────────────────────┘ │
│                                                                │
│  💡 Tip: Drag fields from left to right to add to your report │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                    [Back] [Next: Add Filters] │
└────────────────────────────────────────────────────────────────┘
```

### Chart Builder Interface

```
┌────────────────────────────────────────────────────────────────┐
│  Chart Builder                                            [×]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Chart Type                                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ 📈   │ │ 📊   │ │ 🥧   │ │ 📉   │ │ 📊📈 │                │
│  │ Line │ │ Bar  │ │ Pie  │ │ Area │ │Combo │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
│    [✓]                                                         │
│                                                                │
│  Data Configuration                                            │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  X-Axis:  [Month]                           ▼                 │
│  Y-Axis:  [☑ Revenue] [☑ Expenses] [ ] Profit  ▼             │
│                                                                │
│  Colors                                                        │
│  Revenue:  [🟢 Green]    Expenses: [🔴 Red]                   │
│                                                                │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  Preview                                                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Revenue vs Expenses Trend                              │   │
│  │                                                        │   │
│  │  800K ┤                               ●───●            │   │
│  │  600K ┤                     ●───●                      │   │
│  │  400K ┤           ●───●                       ■───■    │   │
│  │  200K ┤ ●───●                       ■───■              │   │
│  │       └─────┬─────┬─────┬─────┬─────┬─────┬─────      │   │
│  │           Jan   Feb   Mar   Apr   May   Jun           │   │
│  │                                                        │   │
│  │  ──── Revenue (PKR)    ──── Expenses (PKR)            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│  [Export PNG] [Export SVG]              [Cancel] [Add Chart] │
└────────────────────────────────────────────────────────────────┘
```

### Budget Edit Modal

```
┌────────────────────────────────────────────────────────────────┐
│  Edit Budget                                              [×]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Current Budget Details                                        │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Category:  Marketing & Advertising                     │   │
│  │ Period:    Jan 2026                                    │   │
│  │ Budget:    PKR 500,000                                 │   │
│  │ Actual:    PKR 425,000 (85% used)                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  Edit Details                                                  │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  Category                                                      │
│  [Marketing & Advertising]                       ▼             │
│                                                                │
│  Budget Amount                                                 │
│  [550000]                                                      │
│  PKR 550,000                                                   │
│                                                                │
│  Period                                                        │
│  [Jan 2026]                                      ▼             │
│                                                                │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  ⚠️  Changes Summary                                           │
│  • Budget Amount: PKR 500,000 → PKR 550,000 (+10%)            │
│                                                                │
│  💡 This change will be recorded in budget history             │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│  [View History]                    [Cancel] [Save Changes]    │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Integration Points

### With Existing Modules

```
Custom Reports ←→ All Data Sources
├── Deals (commissions, revenue)
├── Properties (P&L, performance)
├── Expenses (spending analysis)
├── Investors (distribution reports)
├── Budgets (variance reports)
└── Ledger (account summaries)

Charts ←→ All Reports
├── Predefined reports (P&L, Balance Sheet)
├── Custom reports
└── Standalone visualizations

Budget Editing ←→ Budgeting Workspace
├── Enhanced BudgetCategoryCard
├── Version history tracking
└── Audit trail integration
```

---

## 🚨 Risks & Mitigation

### Risk 1: Complexity Overload
**Risk**: Custom report builder too complex for users  
**Mitigation**: 
- Progressive disclosure (5-step wizard)
- Provide templates and examples
- Tooltips and help text throughout
- Save partially completed reports

### Risk 2: Performance with Large Datasets
**Risk**: Charts lag with thousands of data points  
**Mitigation**:
- Implement data sampling for charts
- Limit initial load to recent data
- Add pagination to reports
- Optimize Recharts configuration

### Risk 3: Data Inconsistency in Edits
**Risk**: Budget edits could corrupt actual spend tracking  
**Mitigation**:
- Immutable version history
- Validation before save
- Confirm major changes
- Backup before destructive operations

---

## ✅ Definition of Done

Phase 7 is complete when:

1. **Custom Report Builder**
   - [ ] All 5 wizard steps functional
   - [ ] Drag-drop works smoothly
   - [ ] Reports generate correctly
   - [ ] Export to PDF/CSV/Excel works
   - [ ] Save custom templates to localStorage
   - [ ] Zero errors in console

2. **Charts**
   - [ ] All 5 chart types render correctly
   - [ ] Chart builder interface complete
   - [ ] Export PNG/SVG functional
   - [ ] Integration with reports working
   - [ ] Responsive on all devices
   - [ ] Performance acceptable (< 500ms render)

3. **Budget Editing**
   - [ ] Edit modal fully functional
   - [ ] Version history tracked correctly
   - [ ] Clone budget works
   - [ ] Bulk edit operational
   - [ ] No data loss
   - [ ] Audit trail complete

4. **Quality**
   - [ ] Zero TypeScript errors
   - [ ] Zero console warnings
   - [ ] 100% Design System V4.1 compliance
   - [ ] All features tested
   - [ ] Documentation complete
   - [ ] User guide created

---

**Plan Status**: ✅ COMPLETE  
**Ready to Start**: January 2, 2026  
**Expected Completion**: January 8, 2026  

---

*Let's build amazing features! 🚀*
