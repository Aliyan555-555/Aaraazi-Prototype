/**
 * Accounting Library
 * Functions for Trial Balance and Statement of Changes in Equity
 */

import { 
  TrialBalance, 
  AccountBalance, 
  ChangesInEquity, 
  EquityTransaction,
  AccountType,
  NormalBalance
} from '../types/accounting';
import { getJournalEntries, getAccountPayments } from './data';
import { getProperties, getExpenses } from './data';

// ============================================
// CHART OF ACCOUNTS MAPPING
// ============================================

/**
 * Standard Chart of Accounts for Real Estate Agency
 */
export const CHART_OF_ACCOUNTS = {
  // ASSETS (Normal Balance: Debit)
  'Cash & Bank': { code: '1000', type: 'asset' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Accounts Receivable': { code: '1100', type: 'asset' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Property Inventory': { code: '1200', type: 'asset' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Prepaid Expenses': { code: '1300', type: 'asset' as AccountType, normalBalance: 'debit' as NormalBalance },
  
  // LIABILITIES (Normal Balance: Credit)
  'Accounts Payable': { code: '2000', type: 'liability' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Accrued Expenses': { code: '2100', type: 'liability' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Customer Deposits': { code: '2200', type: 'liability' as AccountType, normalBalance: 'credit' as NormalBalance },
  
  // EQUITY (Normal Balance: Credit)
  'Owner\'s Capital': { code: '3000', type: 'equity' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Retained Earnings': { code: '3100', type: 'equity' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Current Year Earnings': { code: '3200', type: 'equity' as AccountType, normalBalance: 'credit' as NormalBalance },
  
  // REVENUE (Normal Balance: Credit)
  'Commission Revenue': { code: '4000', type: 'revenue' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Rental Income': { code: '4100', type: 'revenue' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Consulting Fees': { code: '4200', type: 'revenue' as AccountType, normalBalance: 'credit' as NormalBalance },
  'Other Income': { code: '4900', type: 'revenue' as AccountType, normalBalance: 'credit' as NormalBalance },
  
  // EXPENSES (Normal Balance: Debit)
  'Salaries & Wages': { code: '5000', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Marketing & Advertising': { code: '5100', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Office Expenses': { code: '5200', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Utilities': { code: '5300', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Transportation': { code: '5400', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Professional Fees': { code: '5500', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Insurance': { code: '5600', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Depreciation': { code: '5700', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
  'Other Expenses': { code: '5900', type: 'expense' as AccountType, normalBalance: 'debit' as NormalBalance },
};

/**
 * Get account information from chart of accounts
 */
export function getAccountInfo(accountName: string) {
  return CHART_OF_ACCOUNTS[accountName] || {
    code: '9999',
    type: 'expense' as AccountType,
    normalBalance: 'debit' as NormalBalance
  };
}

// ============================================
// TRIAL BALANCE GENERATION
// ============================================

/**
 * Generate Trial Balance as of a specific date
 * Shows all accounts with their debit/credit balances
 * Validates that total debits = total credits
 */
export function generateTrialBalance(
  asOfDate: string,
  userId: string,
  userRole: string
): TrialBalance {
  const accountBalances: { [accountName: string]: AccountBalance } = {};
  
  // Initialize all accounts with zero balances
  Object.keys(CHART_OF_ACCOUNTS).forEach(accountName => {
    const accountInfo = CHART_OF_ACCOUNTS[accountName];
    accountBalances[accountName] = {
      accountCode: accountInfo.code,
      accountName: accountName,
      accountType: accountInfo.type,
      debitBalance: 0,
      creditBalance: 0,
      normalBalance: accountInfo.normalBalance
    };
  });
  
  // Get all journal entries up to the as-of date
  const journalEntries = getJournalEntries(userId, userRole)
    .filter(entry => 
      entry.status === 'posted' && 
      new Date(entry.date) <= new Date(asOfDate)
    );
  
  // Process each journal entry
  journalEntries.forEach(entry => {
    // Debit side
    if (!accountBalances[entry.debitAccount]) {
      // Create account if not in chart
      accountBalances[entry.debitAccount] = {
        accountCode: '9999',
        accountName: entry.debitAccount,
        accountType: 'expense',
        debitBalance: 0,
        creditBalance: 0,
        normalBalance: 'debit'
      };
    }
    accountBalances[entry.debitAccount].debitBalance += entry.debitAmount || 0;
    
    // Credit side
    if (!accountBalances[entry.creditAccount]) {
      // Create account if not in chart
      accountBalances[entry.creditAccount] = {
        accountCode: '9999',
        accountName: entry.creditAccount,
        accountType: 'revenue',
        debitBalance: 0,
        creditBalance: 0,
        normalBalance: 'credit'
      };
    }
    accountBalances[entry.creditAccount].creditBalance += entry.creditAmount || 0;
  });
  
  // Calculate totals
  let totalDebits = 0;
  let totalCredits = 0;
  
  Object.values(accountBalances).forEach(account => {
    totalDebits += account.debitBalance;
    totalCredits += account.creditBalance;
  });
  
  // Calculate difference (should be 0 if balanced)
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.01; // Allow for minor rounding errors
  
  // Filter out accounts with zero balances
  const accounts = Object.values(accountBalances)
    .filter(account => account.debitBalance > 0 || account.creditBalance > 0)
    .sort((a, b) => {
      // Sort by account code
      return a.accountCode.localeCompare(b.accountCode);
    });
  
  return {
    id: `TB-${Date.now()}`,
    asOfDate,
    accounts,
    totalDebits,
    totalCredits,
    isBalanced,
    difference,
    generatedAt: new Date().toISOString(),
    generatedBy: userId
  };
}

/**
 * Export Trial Balance to CSV format
 */
export function exportTrialBalanceToCSV(trialBalance: TrialBalance): string {
  let csv = 'Account Code,Account Name,Account Type,Debit Balance,Credit Balance\n';
  
  trialBalance.accounts.forEach(account => {
    csv += `${account.accountCode},"${account.accountName}",${account.accountType},`;
    csv += `${account.debitBalance.toFixed(2)},${account.creditBalance.toFixed(2)}\n`;
  });
  
  csv += '\n';
  csv += `Total,,,${trialBalance.totalDebits.toFixed(2)},${trialBalance.totalCredits.toFixed(2)}\n`;
  csv += `Difference,,,${trialBalance.difference.toFixed(2)},\n`;
  csv += `Balanced?,,,${trialBalance.isBalanced ? 'Yes' : 'No'},\n`;
  
  return csv;
}

// ============================================
// EQUITY TRANSACTIONS
// ============================================

const EQUITY_TRANSACTIONS_KEY = 'equity_transactions';

/**
 * Get all equity transactions
 */
export function getEquityTransactions(userId?: string, userRole?: string): EquityTransaction[] {
  try {
    const stored = localStorage.getItem(EQUITY_TRANSACTIONS_KEY);
    const transactions = stored ? JSON.parse(stored) : [];
    
    if (!Array.isArray(transactions)) {
      return [];
    }
    
    // Admin sees all, others see only their own
    if (userRole === 'admin') {
      return transactions;
    }
    
    if (userId) {
      return transactions.filter(t => t.createdBy === userId);
    }
    
    return transactions;
  } catch (error) {
    console.error('Error getting equity transactions:', error);
    return [];
  }
}

/**
 * Add equity transaction
 */
export function addEquityTransaction(
  transaction: Omit<EquityTransaction, 'id' | 'createdAt'>
): EquityTransaction {
  const transactions = getEquityTransactions();
  
  const newTransaction: EquityTransaction = {
    ...transaction,
    id: `EQ-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  localStorage.setItem(EQUITY_TRANSACTIONS_KEY, JSON.stringify(transactions));
  
  return newTransaction;
}

/**
 * Delete equity transaction
 */
export function deleteEquityTransaction(id: string): boolean {
  try {
    const transactions = getEquityTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem(EQUITY_TRANSACTIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting equity transaction:', error);
    return false;
  }
}

// ============================================
// STATEMENT OF CHANGES IN EQUITY
// ============================================

/**
 * Generate Statement of Changes in Equity
 * Shows how owner's equity changed during a period
 */
export function generateChangesInEquity(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string,
  netIncomeFromPL: number
): ChangesInEquity {
  // Get equity transactions for the period
  const allTransactions = getEquityTransactions(userId, userRole);
  const periodTransactions = allTransactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate >= new Date(startDate) && txDate <= new Date(endDate);
  });
  
  // Calculate beginning balance (all transactions before start date)
  const beginningTransactions = allTransactions.filter(t => 
    new Date(t.date) < new Date(startDate)
  );
  
  let beginningBalance = 0;
  beginningTransactions.forEach(t => {
    if (t.type === 'owner-contribution' || t.type === 'net-income') {
      beginningBalance += t.amount;
    } else if (t.type === 'owner-withdrawal' || t.type === 'dividend' || t.type === 'net-loss') {
      beginningBalance -= t.amount;
    }
  });
  
  // Calculate changes during period
  let contributions = 0;
  let withdrawals = 0;
  let dividends = 0;
  
  periodTransactions.forEach(t => {
    switch (t.type) {
      case 'owner-contribution':
        contributions += t.amount;
        break;
      case 'owner-withdrawal':
        withdrawals += t.amount;
        break;
      case 'dividend':
        dividends += t.amount;
        break;
    }
  });
  
  // Calculate ending balance
  const endingBalance = beginningBalance + netIncomeFromPL + contributions - withdrawals - dividends;
  
  return {
    id: `CE-${Date.now()}`,
    period: {
      startDate,
      endDate
    },
    beginningBalance,
    netIncome: netIncomeFromPL,
    contributions,
    withdrawals,
    dividends,
    endingBalance,
    transactions: periodTransactions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
    generatedAt: new Date().toISOString(),
    generatedBy: userId
  };
}

/**
 * Export Changes in Equity to CSV
 */
export function exportChangesInEquityToCSV(report: ChangesInEquity): string {
  let csv = 'Statement of Changes in Equity\n';
  csv += `Period: ${new Date(report.period.startDate).toLocaleDateString()} to ${new Date(report.period.endDate).toLocaleDateString()}\n\n`;
  
  csv += 'Description,Amount\n';
  csv += `Beginning Balance,${report.beginningBalance.toFixed(2)}\n`;
  csv += `Net Income for Period,${report.netIncome.toFixed(2)}\n`;
  csv += `Owner Contributions,${report.contributions.toFixed(2)}\n`;
  csv += `Owner Withdrawals,(${report.withdrawals.toFixed(2)})\n`;
  csv += `Dividends Paid,(${report.dividends.toFixed(2)})\n`;
  csv += `Ending Balance,${report.endingBalance.toFixed(2)}\n\n`;
  
  csv += '\nDetailed Transactions\n';
  csv += 'Date,Type,Description,Amount\n';
  
  report.transactions.forEach(t => {
    const sign = (t.type === 'owner-contribution' || t.type === 'net-income') ? '' : '-';
    csv += `${new Date(t.date).toLocaleDateString()},"${t.type}","${t.description}",${sign}${t.amount.toFixed(2)}\n`;
  });
  
  return csv;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get net income from P&L for a period
 * This would typically come from the P&L report generation
 */
export function getNetIncomeForPeriod(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): number {
  // Get properties and calculate commission revenue
  const properties = getProperties(userId, userRole);
  const commissionRevenue = properties
    .filter(p => 
      p.status === 'sold' && 
      p.soldDate &&
      new Date(p.soldDate) >= new Date(startDate) &&
      new Date(p.soldDate) <= new Date(endDate)
    )
    .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
  
  // Get expenses for the period
  const expenses = getExpenses(userId, userRole);
  const totalExpenses = expenses
    .filter(e => 
      new Date(e.date) >= new Date(startDate) &&
      new Date(e.date) <= new Date(endDate)
    )
    .reduce((sum, e) => sum + e.amount, 0);
  
  // Net Income = Revenue - Expenses
  return commissionRevenue - totalExpenses;
}

/**
 * Get account balance for a specific account
 */
export function getAccountBalance(
  accountName: string,
  asOfDate: string,
  userId: string,
  userRole: string
): { debit: number; credit: number; balance: number } {
  const journalEntries = getJournalEntries(userId, userRole)
    .filter(entry => 
      entry.status === 'posted' && 
      new Date(entry.date) <= new Date(asOfDate)
    );
  
  let debit = 0;
  let credit = 0;
  
  journalEntries.forEach(entry => {
    if (entry.debitAccount === accountName) {
      debit += entry.debitAmount || 0;
    }
    if (entry.creditAccount === accountName) {
      credit += entry.creditAmount || 0;
    }
  });
  
  const accountInfo = getAccountInfo(accountName);
  const balance = accountInfo.normalBalance === 'debit' 
    ? (debit - credit) 
    : (credit - debit);
  
  return { debit, credit, balance };
}

// ============================================
// PROFIT & LOSS STATEMENT (INCOME STATEMENT)
// ============================================

export interface ProfitAndLoss {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  revenue: {
    commissionRevenue: number;
    rentalIncome: number;
    consultingFees: number;
    otherIncome: number;
    totalRevenue: number;
  };
  expenses: {
    salariesWages: number;
    marketingAdvertising: number;
    officeExpenses: number;
    utilities: number;
    depreciation: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  generatedAt: string;
  generatedBy: string;
}

export function generateProfitAndLoss(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): ProfitAndLoss {
  // Get all revenue and expense accounts
  const journalEntries = getJournalEntries(userId, userRole)
    .filter(entry => 
      entry.status === 'posted' && 
      new Date(entry.date) >= new Date(startDate) &&
      new Date(entry.date) <= new Date(endDate)
    );

  // Initialize revenue
  let commissionRevenue = 0;
  let rentalIncome = 0;
  let consultingFees = 0;
  let otherIncome = 0;

  // Initialize expenses
  let salariesWages = 0;
  let marketingAdvertising = 0;
  let officeExpenses = 0;
  let utilities = 0;
  let depreciation = 0;
  let otherExpenses = 0;

  // Process journal entries
  journalEntries.forEach(entry => {
    // Revenue accounts (credit increases revenue)
    if (entry.creditAccount === 'Commission Revenue') {
      commissionRevenue += entry.creditAmount || 0;
    } else if (entry.creditAccount === 'Rental Income') {
      rentalIncome += entry.creditAmount || 0;
    } else if (entry.creditAccount === 'Consulting Fees') {
      consultingFees += entry.creditAmount || 0;
    } else if (entry.creditAccount === 'Other Income') {
      otherIncome += entry.creditAmount || 0;
    }

    // Expense accounts (debit increases expenses)
    if (entry.debitAccount === 'Salaries & Wages') {
      salariesWages += entry.debitAmount || 0;
    } else if (entry.debitAccount === 'Marketing & Advertising') {
      marketingAdvertising += entry.debitAmount || 0;
    } else if (entry.debitAccount === 'Office Expenses') {
      officeExpenses += entry.debitAmount || 0;
    } else if (entry.debitAccount === 'Utilities & Communication') {
      utilities += entry.debitAmount || 0;
    } else if (entry.debitAccount === 'Depreciation') {
      depreciation += entry.debitAmount || 0;
    } else if (entry.debitAccount && CHART_OF_ACCOUNTS[entry.debitAccount]?.type === 'expense') {
      // Any other expense account
      otherExpenses += entry.debitAmount || 0;
    }
  });

  const totalRevenue = commissionRevenue + rentalIncome + consultingFees + otherIncome;
  const totalExpenses = salariesWages + marketingAdvertising + officeExpenses + utilities + depreciation + otherExpenses;
  const grossProfit = totalRevenue; // For service business, gross profit = total revenue
  const operatingIncome = grossProfit - totalExpenses;
  const netIncome = operatingIncome; // Simplified (no other income/expenses)

  return {
    id: `PL-${Date.now()}`,
    period: { startDate, endDate },
    revenue: {
      commissionRevenue,
      rentalIncome,
      consultingFees,
      otherIncome,
      totalRevenue,
    },
    expenses: {
      salariesWages,
      marketingAdvertising,
      officeExpenses,
      utilities,
      depreciation,
      otherExpenses,
      totalExpenses,
    },
    grossProfit,
    operatingIncome,
    netIncome,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// BALANCE SHEET
// ============================================

export interface BalanceSheet {
  id: string;
  asOfDate: string;
  assets: {
    currentAssets: {
      cashAndBank: number;
      accountsReceivable: number;
      prepaidExpenses: number;
      totalCurrentAssets: number;
    };
    nonCurrentAssets: {
      propertyInventory: number;
      fixedAssets: number;
      totalNonCurrentAssets: number;
    };
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      accruedExpenses: number;
      customerDeposits: number;
      totalCurrentLiabilities: number;
    };
    longTermLiabilities: {
      loansPayable: number;
      totalLongTermLiabilities: number;
    };
    totalLiabilities: number;
  };
  equity: {
    ownersCapital: number;
    retainedEarnings: number;
    currentYearEarnings: number;
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  generatedAt: string;
  generatedBy: string;
}

export function generateBalanceSheet(
  asOfDate: string,
  userId: string,
  userRole: string
): BalanceSheet {
  // Get balances for all accounts as of the date
  const cashAndBank = getAccountBalance('Cash & Bank', asOfDate, userId, userRole).balance;
  const accountsReceivable = getAccountBalance('Accounts Receivable', asOfDate, userId, userRole).balance;
  const prepaidExpenses = getAccountBalance('Prepaid Expenses', asOfDate, userId, userRole).balance;
  const propertyInventory = getAccountBalance('Property Inventory', asOfDate, userId, userRole).balance;
  const fixedAssets = 0; // Placeholder for fixed assets
  
  const accountsPayable = getAccountBalance('Accounts Payable', asOfDate, userId, userRole).balance;
  const accruedExpenses = getAccountBalance('Accrued Expenses', asOfDate, userId, userRole).balance;
  const customerDeposits = getAccountBalance('Customer Deposits', asOfDate, userId, userRole).balance;
  const loansPayable = 0; // Placeholder for loans
  
  const ownersCapital = getAccountBalance("Owner's Capital", asOfDate, userId, userRole).balance;
  const retainedEarnings = getAccountBalance('Retained Earnings', asOfDate, userId, userRole).balance;
  const currentYearEarnings = getAccountBalance('Current Year Earnings', asOfDate, userId, userRole).balance;

  // Calculate totals
  const totalCurrentAssets = cashAndBank + accountsReceivable + prepaidExpenses;
  const totalNonCurrentAssets = propertyInventory + fixedAssets;
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = accountsPayable + accruedExpenses + customerDeposits;
  const totalLongTermLiabilities = loansPayable;
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = ownersCapital + retainedEarnings + currentYearEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  return {
    id: `BS-${Date.now()}`,
    asOfDate,
    assets: {
      currentAssets: {
        cashAndBank,
        accountsReceivable,
        prepaidExpenses,
        totalCurrentAssets,
      },
      nonCurrentAssets: {
        propertyInventory,
        fixedAssets,
        totalNonCurrentAssets,
      },
      totalAssets,
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable,
        accruedExpenses,
        customerDeposits,
        totalCurrentLiabilities,
      },
      longTermLiabilities: {
        loansPayable,
        totalLongTermLiabilities,
      },
      totalLiabilities,
    },
    equity: {
      ownersCapital,
      retainedEarnings,
      currentYearEarnings,
      totalEquity,
    },
    totalLiabilitiesAndEquity,
    isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// CASH FLOW STATEMENT
// ============================================

export interface CashFlowStatement {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  operatingActivities: {
    netIncome: number;
    adjustments: {
      depreciation: number;
      accountsReceivableChange: number;
      accountsPayableChange: number;
      totalAdjustments: number;
    };
    netCashFromOperating: number;
  };
  investingActivities: {
    propertyPurchases: number;
    propertyDisposals: number;
    netCashFromInvesting: number;
  };
  financingActivities: {
    ownerContributions: number;
    ownerWithdrawals: number;
    loanProceeds: number;
    loanRepayments: number;
    netCashFromFinancing: number;
  };
  netCashChange: number;
  beginningCash: number;
  endingCash: number;
  generatedAt: string;
  generatedBy: string;
}

export function generateCashFlowStatement(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): CashFlowStatement {
  // Get net income from P&L
  const plReport = generateProfitAndLoss(startDate, endDate, userId, userRole);
  const netIncome = plReport.netIncome;

  // Get depreciation from expenses
  const depreciation = plReport.expenses.depreciation;

  // Calculate changes in working capital
  // This is simplified - in reality you'd compare beginning and ending balances
  const accountsReceivableChange = 0; // Placeholder
  const accountsPayableChange = 0; // Placeholder

  const totalAdjustments = depreciation + accountsReceivableChange + accountsPayableChange;
  const netCashFromOperating = netIncome + totalAdjustments;

  // Investing activities (property transactions)
  const properties = getProperties(userId, userRole);
  const propertyPurchases = properties
    .filter(p => 
      p.createdAt &&
      new Date(p.createdAt) >= new Date(startDate) &&
      new Date(p.createdAt) <= new Date(endDate)
    )
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const propertyDisposals = properties
    .filter(p => 
      p.soldDate &&
      new Date(p.soldDate) >= new Date(startDate) &&
      new Date(p.soldDate) <= new Date(endDate)
    )
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const netCashFromInvesting = propertyDisposals - propertyPurchases;

  // Financing activities
  const equityTransactions = getEquityTransactions(userId, userRole)
    .filter(t => 
      new Date(t.date) >= new Date(startDate) &&
      new Date(t.date) <= new Date(endDate)
    );

  const ownerContributions = equityTransactions
    .filter(t => t.type === 'owner-contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  const ownerWithdrawals = equityTransactions
    .filter(t => t.type === 'owner-withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const loanProceeds = 0; // Placeholder
  const loanRepayments = 0; // Placeholder

  const netCashFromFinancing = ownerContributions - ownerWithdrawals + loanProceeds - loanRepayments;

  // Calculate net change in cash
  const netCashChange = netCashFromOperating + netCashFromInvesting + netCashFromFinancing;

  // Get beginning and ending cash balances
  const beginningCash = getAccountBalance('Cash & Bank', startDate, userId, userRole).balance;
  const endingCash = getAccountBalance('Cash & Bank', endDate, userId, userRole).balance;

  return {
    id: `CF-${Date.now()}`,
    period: { startDate, endDate },
    operatingActivities: {
      netIncome,
      adjustments: {
        depreciation,
        accountsReceivableChange,
        accountsPayableChange,
        totalAdjustments,
      },
      netCashFromOperating,
    },
    investingActivities: {
      propertyPurchases,
      propertyDisposals,
      netCashFromInvesting,
    },
    financingActivities: {
      ownerContributions,
      ownerWithdrawals,
      loanProceeds,
      loanRepayments,
      netCashFromFinancing,
    },
    netCashChange,
    beginningCash,
    endingCash,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// COMMISSION REPORT
// ============================================

export interface CommissionReport {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  commissions: Array<{
    propertyId: string;
    propertyTitle: string;
    dealType: 'sale' | 'rental';
    dealValue: number;
    commissionRate: number;
    commissionAmount: number;
    agentId: string;
    agentName: string;
    closedDate: string;
  }>;
  summary: {
    totalDeals: number;
    totalDealValue: number;
    totalCommission: number;
    averageCommissionRate: number;
    salesCommission: number;
    rentalCommission: number;
  };
  byAgent: Array<{
    agentId: string;
    agentName: string;
    dealsCount: number;
    totalCommission: number;
  }>;
  generatedAt: string;
  generatedBy: string;
}

export function generateCommissionReport(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): CommissionReport {
  const properties = getProperties(userId, userRole);

  // Get sold/rented properties in the period
  const commissionProperties = properties.filter(p => 
    (p.status === 'sold' || p.status === 'rented') &&
    p.soldDate &&
    new Date(p.soldDate) >= new Date(startDate) &&
    new Date(p.soldDate) <= new Date(endDate)
  );

  const commissions = commissionProperties.map(p => ({
    propertyId: p.id,
    propertyTitle: p.title,
    dealType: (p.type === 'sale' ? 'sale' : 'rental') as 'sale' | 'rental',
    dealValue: p.price || 0,
    commissionRate: p.commissionRate || (p.type === 'sale' ? 2 : 8.33), // Default rates
    commissionAmount: p.commissionEarned || 0,
    agentId: p.agentId || '',
    agentName: p.agentName || 'Unknown Agent',
    closedDate: p.soldDate || '',
  }));

  // Calculate summary
  const totalDeals = commissions.length;
  const totalDealValue = commissions.reduce((sum, c) => sum + c.dealValue, 0);
  const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const averageCommissionRate = totalDeals > 0 
    ? commissions.reduce((sum, c) => sum + c.commissionRate, 0) / totalDeals 
    : 0;
  const salesCommission = commissions
    .filter(c => c.dealType === 'sale')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const rentalCommission = commissions
    .filter(c => c.dealType === 'rental')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  // Group by agent
  const agentMap = new Map<string, { agentId: string; agentName: string; dealsCount: number; totalCommission: number }>();
  
  commissions.forEach(c => {
    if (!agentMap.has(c.agentId)) {
      agentMap.set(c.agentId, {
        agentId: c.agentId,
        agentName: c.agentName,
        dealsCount: 0,
        totalCommission: 0,
      });
    }
    const agent = agentMap.get(c.agentId)!;
    agent.dealsCount++;
    agent.totalCommission += c.commissionAmount;
  });

  const byAgent = Array.from(agentMap.values())
    .sort((a, b) => b.totalCommission - a.totalCommission);

  return {
    id: `CR-${Date.now()}`,
    period: { startDate, endDate },
    commissions,
    summary: {
      totalDeals,
      totalDealValue,
      totalCommission,
      averageCommissionRate,
      salesCommission,
      rentalCommission,
    },
    byAgent,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// EXPENSE SUMMARY REPORT
// ============================================

export interface ExpenseSummaryReport {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  expenses: Array<{
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    paymentMethod: string;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    total: number;
    percentage: number;
  }>;
  byMonth: Array<{
    month: string;
    total: number;
  }>;
  summary: {
    totalExpenses: number;
    transactionCount: number;
    averageExpense: number;
    largestCategory: string;
    largestCategoryAmount: number;
  };
  generatedAt: string;
  generatedBy: string;
}

export function generateExpenseSummaryReport(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): ExpenseSummaryReport {
  const allExpenses = getExpenses(userId, userRole);
  
  // Filter expenses in the period
  const expenses = allExpenses
    .filter(e => 
      new Date(e.date) >= new Date(startDate) &&
      new Date(e.date) <= new Date(endDate)
    )
    .map(e => ({
      id: e.id,
      date: e.date,
      category: e.category,
      description: e.description || '',
      amount: e.amount,
      paymentMethod: e.paymentMethod || 'Unknown',
    }));

  // Group by category
  const categoryMap = new Map<string, { count: number; total: number }>();
  expenses.forEach(e => {
    if (!categoryMap.has(e.category)) {
      categoryMap.set(e.category, { count: 0, total: 0 });
    }
    const cat = categoryMap.get(e.category)!;
    cat.count++;
    cat.total += e.amount;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      total: data.total,
      percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Group by month
  const monthMap = new Map<string, number>();
  expenses.forEach(e => {
    const month = new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthMap.set(month, (monthMap.get(month) || 0) + e.amount);
  });

  const byMonth = Array.from(monthMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Summary
  const transactionCount = expenses.length;
  const averageExpense = transactionCount > 0 ? totalExpenses / transactionCount : 0;
  const largestCategory = byCategory[0]?.category || 'N/A';
  const largestCategoryAmount = byCategory[0]?.total || 0;

  return {
    id: `ES-${Date.now()}`,
    period: { startDate, endDate },
    expenses,
    byCategory,
    byMonth,
    summary: {
      totalExpenses,
      transactionCount,
      averageExpense,
      largestCategory,
      largestCategoryAmount,
    },
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// PROPERTY PERFORMANCE REPORT
// ============================================

export interface PropertyPerformanceReport {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  properties: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    listingDate: string;
    soldDate?: string;
    daysOnMarket: number;
    listPrice: number;
    soldPrice?: number;
    priceChange: number;
    priceChangePercentage: number;
    commissionEarned: number;
    agentName: string;
  }>;
  summary: {
    totalProperties: number;
    activeListing: number;
    soldProperties: number;
    averageDaysOnMarket: number;
    averagePriceReduction: number;
    totalCommissionEarned: number;
    conversionRate: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topPerformers: Array<{
    id: string;
    title: string;
    commissionEarned: number;
    daysOnMarket: number;
  }>;
  generatedAt: string;
  generatedBy: string;
}

export function generatePropertyPerformanceReport(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): PropertyPerformanceReport {
  const allProperties = getProperties(userId, userRole);
  
  // Filter properties listed in the period
  const properties = allProperties
    .filter(p => 
      p.createdAt &&
      new Date(p.createdAt) >= new Date(startDate) &&
      new Date(p.createdAt) <= new Date(endDate)
    )
    .map(p => {
      const listingDate = new Date(p.createdAt || '');
      const soldDate = p.soldDate ? new Date(p.soldDate) : null;
      const daysOnMarket = soldDate 
        ? Math.floor((soldDate.getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((new Date().getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const listPrice = p.price || 0;
      const soldPrice = p.status === 'sold' ? (p.price || 0) : undefined;
      const priceChange = soldPrice ? soldPrice - listPrice : 0;
      const priceChangePercentage = listPrice > 0 ? (priceChange / listPrice) * 100 : 0;

      return {
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        listingDate: p.createdAt || '',
        soldDate: p.soldDate,
        daysOnMarket,
        listPrice,
        soldPrice,
        priceChange,
        priceChangePercentage,
        commissionEarned: p.commissionEarned || 0,
        agentName: p.agentName || 'Unknown',
      };
    });

  // Summary
  const totalProperties = properties.length;
  const activeListing = properties.filter(p => p.status === 'available').length;
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  const averageDaysOnMarket = totalProperties > 0
    ? properties.reduce((sum, p) => sum + p.daysOnMarket, 0) / totalProperties
    : 0;
  const averagePriceReduction = totalProperties > 0
    ? properties.reduce((sum, p) => sum + p.priceChange, 0) / totalProperties
    : 0;
  const totalCommissionEarned = properties.reduce((sum, p) => sum + p.commissionEarned, 0);
  const conversionRate = totalProperties > 0 ? (soldProperties / totalProperties) * 100 : 0;

  // By status
  const statusMap = new Map<string, number>();
  properties.forEach(p => {
    statusMap.set(p.status, (statusMap.get(p.status) || 0) + 1);
  });

  const byStatus = Array.from(statusMap.entries())
    .map(([status, count]) => ({
      status,
      count,
      percentage: totalProperties > 0 ? (count / totalProperties) * 100 : 0,
    }));

  // Top performers
  const topPerformers = properties
    .filter(p => p.commissionEarned > 0)
    .sort((a, b) => b.commissionEarned - a.commissionEarned)
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      commissionEarned: p.commissionEarned,
      daysOnMarket: p.daysOnMarket,
    }));

  return {
    id: `PP-${Date.now()}`,
    period: { startDate, endDate },
    properties,
    summary: {
      totalProperties,
      activeListing,
      soldProperties,
      averageDaysOnMarket,
      averagePriceReduction,
      totalCommissionEarned,
      conversionRate,
    },
    byStatus,
    topPerformers,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// INVESTOR DISTRIBUTION REPORT
// ============================================

export interface InvestorDistributionReport {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  distributions: Array<{
    investorId: string;
    investorName: string;
    propertyId: string;
    propertyTitle: string;
    investmentAmount: number;
    ownershipPercentage: number;
    distributionAmount: number;
    distributionDate: string;
    roi: number;
  }>;
  summary: {
    totalInvestors: number;
    totalDistributed: number;
    totalInvestmentCapital: number;
    averageROI: number;
    largestDistribution: number;
  };
  byInvestor: Array<{
    investorId: string;
    investorName: string;
    distributionsCount: number;
    totalDistributed: number;
    totalInvested: number;
    roi: number;
  }>;
  generatedAt: string;
  generatedBy: string;
}

export function generateInvestorDistributionReport(
  startDate: string,
  endDate: string,
  userId: string,
  userRole: string
): InvestorDistributionReport {
  // This is a placeholder implementation
  // In a real system, you'd have investor and distribution data
  
  const distributions: any[] = [];
  
  // Placeholder summary
  const summary = {
    totalInvestors: 0,
    totalDistributed: 0,
    totalInvestmentCapital: 0,
    averageROI: 0,
    largestDistribution: 0,
  };

  const byInvestor: any[] = [];

  return {
    id: `ID-${Date.now()}`,
    period: { startDate, endDate },
    distributions,
    summary,
    byInvestor,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  };
}

// ============================================
// REPORT COMPARISON UTILITIES
// ============================================

export interface ReportComparison {
  type: 'YoY' | 'MoM' | 'Custom';
  current: any;
  previous: any;
  changes: {
    [key: string]: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
  };
}

/**
 * Compare two P&L reports (YoY or MoM)
 */
export function compareProfitAndLoss(
  current: ProfitAndLoss,
  previous: ProfitAndLoss
): ReportComparison {
  const calculateChange = (currentVal: number, previousVal: number) => ({
    current: currentVal,
    previous: previousVal,
    change: currentVal - previousVal,
    changePercentage: previousVal !== 0 ? ((currentVal - previousVal) / previousVal) * 100 : 0,
  });

  return {
    type: 'YoY', // Can be determined based on date ranges
    current,
    previous,
    changes: {
      totalRevenue: calculateChange(current.revenue.totalRevenue, previous.revenue.totalRevenue),
      totalExpenses: calculateChange(current.expenses.totalExpenses, previous.expenses.totalExpenses),
      netIncome: calculateChange(current.netIncome, previous.netIncome),
      commissionRevenue: calculateChange(current.revenue.commissionRevenue, previous.revenue.commissionRevenue),
      operatingIncome: calculateChange(current.operatingIncome, previous.operatingIncome),
    },
  };
}

/**
 * Compare two Balance Sheets
 */
export function compareBalanceSheets(
  current: BalanceSheet,
  previous: BalanceSheet
): ReportComparison {
  const calculateChange = (currentVal: number, previousVal: number) => ({
    current: currentVal,
    previous: previousVal,
    change: currentVal - previousVal,
    changePercentage: previousVal !== 0 ? ((currentVal - previousVal) / previousVal) * 100 : 0,
  });

  return {
    type: 'YoY',
    current,
    previous,
    changes: {
      totalAssets: calculateChange(current.assets.totalAssets, previous.assets.totalAssets),
      totalLiabilities: calculateChange(current.liabilities.totalLiabilities, previous.liabilities.totalLiabilities),
      totalEquity: calculateChange(current.equity.totalEquity, previous.equity.totalEquity),
      cashAndBank: calculateChange(current.assets.currentAssets.cashAndBank, previous.assets.currentAssets.cashAndBank),
      currentAssets: calculateChange(current.assets.currentAssets.totalCurrentAssets, previous.assets.currentAssets.totalCurrentAssets),
    },
  };
}

/**
 * Generate date ranges for YoY comparison
 */
export function getYoYDateRanges(currentStart: string, currentEnd: string): {
  current: { start: string; end: string };
  previous: { start: string; end: string };
} {
  const currentStartDate = new Date(currentStart);
  const currentEndDate = new Date(currentEnd);
  
  const previousStartDate = new Date(currentStartDate);
  previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
  
  const previousEndDate = new Date(currentEndDate);
  previousEndDate.setFullYear(previousEndDate.getFullYear() - 1);
  
  return {
    current: {
      start: currentStart,
      end: currentEnd,
    },
    previous: {
      start: previousStartDate.toISOString().split('T')[0],
      end: previousEndDate.toISOString().split('T')[0],
    },
  };
}

/**
 * Generate date ranges for MoM comparison
 */
export function getMoMDateRanges(currentStart: string, currentEnd: string): {
  current: { start: string; end: string };
  previous: { start: string; end: string };
} {
  const currentStartDate = new Date(currentStart);
  const currentEndDate = new Date(currentEnd);
  
  const previousStartDate = new Date(currentStartDate);
  previousStartDate.setMonth(previousStartDate.getMonth() - 1);
  
  const previousEndDate = new Date(currentEndDate);
  previousEndDate.setMonth(previousEndDate.getMonth() - 1);
  
  return {
    current: {
      start: currentStart,
      end: currentEnd,
    },
    previous: {
      start: previousStartDate.toISOString().split('T')[0],
      end: previousEndDate.toISOString().split('T')[0],
    },
  };
}