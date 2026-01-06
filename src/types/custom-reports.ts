/**
 * Custom Report Builder - Type Definitions
 * 
 * Defines all TypeScript interfaces for the custom report builder feature.
 * Supports multi-source data integration, filtering, grouping, and aggregation.
 * 
 * @module types/custom-reports
 */

/**
 * Main custom report template
 * Persisted to localStorage as 'custom_report_templates'
 */
export interface CustomReportTemplate {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  isShared: boolean;
  
  // Report configuration
  config: ReportConfiguration;
  
  // Usage statistics
  generationCount: number;
  lastGenerated?: string;
}

/**
 * Grouping configuration
 */
export interface GroupingConfig {
  groupBy: string[]; // Field paths to group by
  aggregations: AggregationConfig[];
  sortGroupsBy: 'name' | 'value';
  sortDirection: 'asc' | 'desc';
}

/**
 * Chart types
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

/**
 * Chart configuration
 */
export interface ChartConfig {
  enabled: boolean;
  chartType: ChartType;
  xAxis?: string; // Field path for X axis
  yAxis?: string; // Field path for Y axis
  series?: string[]; // Field paths for series (multiple lines/bars)
  title?: string;
  showLegend: boolean;
  showGrid: boolean;
  colorScheme?: 'default' | 'blue' | 'green' | 'red' | 'purple';
}

/**
 * Schedule frequency
 */
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

/**
 * Schedule configuration
 */
export interface ScheduleConfig {
  enabled: boolean;
  frequency: ScheduleFrequency;
  dayOfWeek?: number; // 0-6 for weekly (0 = Sunday)
  dayOfMonth?: number; // 1-31 for monthly
  monthOfQuarter?: number; // 1-3 for quarterly
  time: string; // HH:MM format (24-hour)
  timezone?: string; // e.g., 'Asia/Karachi'
  lastRun?: string; // ISO date string
  nextRun?: string; // ISO date string
}

/**
 * Report configuration
 */
export interface ReportConfiguration {
  dataSources: DataSource[];
  fields: SelectedField[];
  filters: FilterRule[];
  grouping?: GroupingConfig;
  sorting: SortConfig[];
  chart?: ChartConfig;
  schedule?: ScheduleConfig;
}

/**
 * Data source selection
 * Supports multiple sources for join-like queries
 */
export interface DataSource {
  source: 'deals' | 'properties' | 'expenses' | 'commissions' | 'investors' | 'budgets' | 'ledger';
  alias?: string;
  joins?: JoinConfig[];
}

/**
 * Join configuration for multi-source reports
 * Future feature - not implemented in Phase 7A
 */
export interface JoinConfig {
  targetSource: string;
  joinType: 'inner' | 'left' | 'right';
  onField: string;
  targetField: string;
}

/**
 * Selected field for display in report
 * Includes field metadata and optional aggregation
 */
export interface SelectedField {
  id: string;
  source: string;
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  aggregation?: AggregationFunction;
  
  // Display formatting
  format?: FieldFormat;
}

/**
 * Aggregation functions for grouping
 */
export type AggregationFunction = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none';

/**
 * Field formatting options
 */
export interface FieldFormat {
  decimals?: number;
  prefix?: string;
  suffix?: string;
  dateFormat?: string;
}

/**
 * Filter rule for data filtering
 * Supports multiple operators based on field type
 */
export interface FilterRule {
  id: string;
  field: string;
  fieldType: 'text' | 'number' | 'date' | 'currency' | 'boolean';
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Filter operators
 * Different operators available based on field type
 */
export type FilterOperator = 
  | 'equals' 
  | 'not-equals' 
  | 'contains' 
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'greater-than' 
  | 'less-than'
  | 'greater-or-equal'
  | 'less-or-equal'
  | 'between' 
  | 'in'
  | 'not-in'
  | 'is-null'
  | 'is-not-null';

/**
 * Aggregation configuration for grouped data
 */
export interface AggregationConfig {
  field: string;
  function: AggregationFunction;
  label: string;
}

/**
 * Sorting configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
  priority: number; // For multi-column sorting
}

/**
 * Report-wide formatting configuration
 */
export interface FormattingConfig {
  // Table formatting
  showRowNumbers?: boolean;
  alternateRowColors?: boolean;
  
  // Number formatting
  currencySymbol?: string;
  decimalPlaces?: number;
  thousandsSeparator?: string;
  
  // Date formatting
  dateFormat?: 'short' | 'medium' | 'long' | 'iso';
  
  // Styling
  headerBackgroundColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

/**
 * Available field definition
 * Defines fields available for selection from each data source
 */
export interface AvailableField {
  id: string;
  source: string;
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  description?: string;
  
  // Metadata
  isRequired?: boolean;
  isPrimaryKey?: boolean;
  allowAggregation?: boolean;
  allowGrouping?: boolean;
}

/**
 * Generated report data
 * Result of executing a report configuration
 */
export interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  
  // Configuration used
  config: ReportConfiguration;
  
  // Report data
  data: ReportRow[];
  columns: ReportColumn[];
  
  // Metadata
  generatedAt: string;
  generatedBy: string;
  rowCount: number;
  
  // Export info
  exportFormat?: 'pdf' | 'csv' | 'excel';
}

/**
 * Report row data
 */
export interface ReportRow {
  [key: string]: any;
}

/**
 * Report column metadata
 */
export interface ReportColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  width?: number;
  align?: 'left' | 'center' | 'right';
}

/**
 * Report builder state
 * Internal state for the report builder modal
 */
export interface ReportBuilderState {
  currentStep: number;
  config: Partial<ReportConfiguration>;
  errors: ValidationError[];
  isPreviewLoading: boolean;
  previewData?: GeneratedReport;
}

/**
 * Validation error
 */
export interface ValidationError {
  step: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Quick filter preset
 * Pre-configured common filters for quick selection
 */
export interface QuickFilterPreset {
  id: string;
  label: string;
  description: string;
  filters: FilterRule[];
}

/**
 * Report template category
 * For organizing saved templates
 */
export type ReportCategory = 'financial' | 'operational' | 'analytical' | 'custom';

/**
 * Export options
 */
export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includeHeader: boolean;
  includeFooter: boolean;
  paperSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  
  // PDF-specific
  title?: string;
  subtitle?: string;
  logo?: string;
  
  // CSV-specific
  delimiter?: ',' | ';' | '\t';
  encoding?: 'utf-8' | 'utf-16';
}