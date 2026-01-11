// ============================================
// LEAD MANAGEMENT TYPES
// ============================================

export * from './leads';

// ============================================
// LEAD INTEGRATION TYPES
// ============================================

export * from './leadsIntegration';

// ============================================
// CRM TYPES
// ============================================

export * from './crm';

// ============================================
// AGENCY FINANCIAL TRACKING TYPES
// ============================================

/**
 * Transaction types for agency-owned properties
 */
export type AgencyTransactionType = 
  // Acquisition costs
  | 'purchase_price'
  | 'registration_fee'
  | 'stamp_duty'
  | 'legal_fees'
  | 'broker_commission'
  | 'renovation'
  | 'other_acquisition'
  
  // Income during ownership
  | 'rental_income'
  | 'parking_fee'
  | 'late_fee'
  | 'other_income'
  
  // Expenses during ownership
  | 'property_tax'
  | 'maintenance'
  | 'repairs'
  | 'utilities'
  | 'insurance'
  | 'management_fee'
  | 'marketing'
  | 'legal_expense'
  | 'other_expense'
  
  // Sale
  | 'sale_price'
  | 'sale_commission'
  | 'closing_costs';

/**
 * Category for UI grouping and filtering
 */
export type AgencyTransactionCategory = 'acquisition' | 'income' | 'expense' | 'sale';

/**
 * Financial transaction for agency-owned properties
 * Tracks all money in/out from purchase to sale
 */
export interface AgencyTransaction {
  id: string;
  propertyId: string;
  propertyAddress: string;
  
  // Transaction classification
  category: AgencyTransactionCategory;
  type: AgencyTransactionType;
  
  // Financial details
  amount: number;
  date: string;
  
  // Description and notes
  description: string;
  notes?: string;
  
  // Receipt tracking
  receiptNumber?: string;
  receiptUrl?: string;
  
  // Payment details
  paymentMethod?: 'cash' | 'bank-transfer' | 'cheque' | 'online';
  paymentReference?: string;
  
  // Relationships to other entities
  purchaseCycleId?: string;  // Link to purchase cycle if acquisition
  sellCycleId?: string;       // Link to sell cycle if sale
  dealId?: string;            // Link to deal if sale
  
  // Tracking
  recordedBy: string;
  recordedByName: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Financial summary for a property
 * Calculated from all transactions
 */
export interface PropertyFinancials {
  propertyId: string;
  propertyAddress: string;
  
  // ACQUISITION PHASE
  totalAcquisitionCost: number;
  purchasePrice: number;
  acquisitionExpenses: number; // All non-purchase acquisition costs
  
  acquisitionBreakdown?: {
    registrationFee: number;
    stampDuty: number;
    legalFees: number;
    brokerCommission: number;
    renovation: number;
    other: number;
  };
  
  // OWNERSHIP PHASE
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number; // totalIncome - totalExpenses
  
  incomeBreakdown?: {
    rentalIncome: number;
    parkingFee: number;
    lateFee: number;
    otherIncome: number;
  };
  
  expenseBreakdown?: {
    propertyTax: number;
    maintenance: number;
    repairs: number;
    utilities: number;
    insurance: number;
    managementFee: number;
    marketing: number;
    legalExpense: number;
    otherExpense: number;
  };
  
  // SALE PHASE (if sold)
  salePrice?: number;
  saleExpenses?: number;
  netSaleProceeds?: number; // salePrice - saleExpenses
  
  saleBreakdown?: {
    saleCommission: number;
    closingCosts: number;
  };
  
  // PROFITABILITY ANALYSIS
  capitalGain?: number; // netSaleProceeds - totalAcquisitionCost
  operatingProfit: number; // netCashFlow
  totalProfit?: number; // capitalGain + operatingProfit (only if sold)
  roi?: number; // (totalProfit / totalAcquisitionCost) * 100
  annualizedROI?: number; // ROI adjusted for holding period
  
  // DATES
  acquisitionDate: string;
  saleDate?: string;
  holdingPeriod?: number; // Days
  holdingPeriodYears?: number;
  
  // STATUS
  status: 'active' | 'sold';
  
  // METADATA
  lastCalculated: string;
  transactionCount: number;
}

/**
 * Portfolio-wide financial summary for all agency-owned properties
 */
export interface AgencyPortfolioFinancials {
  // PORTFOLIO OVERVIEW
  totalProperties: number;
  activeProperties: number;
  soldProperties: number;
  
  // INVESTMENT
  totalInvested: number; // Sum of all acquisition costs
  currentPortfolioValue: number; // Current market value of active properties
  
  // INCOME & EXPENSES (Active properties)
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  
  // INCOME & EXPENSES (YTD)
  incomeYTD: number;
  expensesYTD: number;
  netCashFlowYTD: number;
  
  // PROFITABILITY (Sold properties)
  totalRealizedProfit: number;
  totalRealizedROI: number;
  averageHoldingPeriod: number; // Days
  
  // PROFITABILITY (Portfolio)
  unrealizedProfit: number; // Potential profit if all active properties sold at current value
  portfolioROI: number;
  
  // TOP PERFORMERS
  bestROIProperty?: {
    propertyId: string;
    address: string;
    roi: number;
  };
  
  bestCashFlowProperty?: {
    propertyId: string;
    address: string;
    netCashFlow: number;
  };
  
  // METADATA
  calculatedAt: string;
}

/**
 * Profit/Loss statement for a sold property
 * Complete financial breakdown from purchase to sale
 */
export interface PropertyProfitLoss {
  propertyId: string;
  propertyAddress: string;
  
  // ACQUISITION
  acquisitionDate: string;
  totalAcquisitionCost: number;
  acquisitionBreakdown: {
    purchasePrice: number;
    registrationFee: number;
    stampDuty: number;
    legalFees: number;
    brokerCommission: number;
    renovation: number;
    other: number;
  };
  
  // OPERATIONS
  operatingPeriod: {
    start: string;
    end: string;
    days: number;
    years: number;
  };
  
  totalIncome: number;
  totalExpenses: number;
  operatingProfit: number; // totalIncome - totalExpenses
  
  // SALE
  saleDate: string;
  salePrice: number;
  saleExpenses: number;
  netSaleProceeds: number;
  
  // PROFITABILITY
  capitalGain: number; // netSaleProceeds - totalAcquisitionCost
  totalProfit: number; // capitalGain + operatingProfit
  totalROI: number; // (totalProfit / totalAcquisitionCost) * 100
  annualizedROI: number;
  
  // BREAKDOWN
  profitBreakdown: {
    fromCapitalGain: number;
    fromOperations: number;
  };
  
  // METADATA
  generatedAt: string;
  generatedBy: string;
}

// ============================================
// ACCOUNTING TYPES
// ============================================

export * from './accounting';

// ============================================
// SAAS TYPES
// ============================================

export * from './saas';