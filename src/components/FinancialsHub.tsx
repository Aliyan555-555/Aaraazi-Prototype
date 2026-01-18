import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { User, Expense, JournalEntry, AccountPayment, Commission, CommissionSplit } from '../types';
import { 
  getProperties, 
  getLeads, 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense,
  getJournalEntries,
  addJournalEntry,
  reverseJournalEntry,
  getAccountPayments,
  addAccountPayment,
  getContacts
} from '../lib/data';
import { formatCurrency, formatCurrencyShort } from '../lib/currency';
import { formatPropertyAddressShort } from '../lib/utils';
import { toast } from 'sonner';
import { 
  generateTrialBalance, 
  generateChangesInEquity,
  getEquityTransactions,
  addEquityTransaction,
  deleteEquityTransaction,
  getNetIncomeForPeriod,
  exportTrialBalanceToCSV,
  exportChangesInEquityToCSV
} from '../lib/accounting';
import { ManualJournalEntryModal } from './ManualJournalEntryModal';
import { CommissionReports } from './CommissionReports';
import { AccountPaymentModal } from './AccountPaymentModal';
import { EditExpenseModal } from './EditExpenseModal';
import { CommissionSplitModal } from './CommissionSplitModal';
import { CommissionApprovalModal } from './CommissionApprovalModal';
import { CommissionsSection } from './CommissionsSection';
import {
  createCommissionWithSplits,
  approveCommission,
  rejectCommission,
  overrideCommission,
  updateOverdueCommissions,
  getYTDCommissionSummary
} from '../lib/phase3Enhancements';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Plus,
  Download,
  PieChart,
  BarChart3,
  Building2,
  Receipt,
  CreditCard,
  Banknote,
  FileText,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Briefcase,
  Users,
  Handshake,
  Trophy,
  Star,
  Search,
  Building,
  Percent,
  X,
  Eye,
  CheckCircle,
  MapPin,
  AlertCircle,
  BookOpen,
  TrendingUpIcon,
  Wallet,
  FileCheck,
  Clock,
  Edit,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface FinancialsHubProps {
  user: User;
}

interface GeneratedReport {
  id: string;
  type: 'P&L' | 'Balance Sheet' | 'Cash Flow' | 'Trial Balance' | 'Changes in Equity';
  period: string;
  generatedDate: string;
  data: any;
}

export const FinancialsHub: React.FC<FinancialsHubProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    propertyId: 'none' // For property association
  });

  // Reports state
  const [plPeriod, setPlPeriod] = useState('qtd');
  const [balanceSheetDate, setBalanceSheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashFlowPeriod, setCashFlowPeriod] = useState('ytd');
  const [trialBalanceDate, setTrialBalanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [equityPeriod, setEquityPeriod] = useState('ytd');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [viewingReport, setViewingReport] = useState<GeneratedReport | null>(null);
  
  // Equity transaction state
  const [showEquityTransactionModal, setShowEquityTransactionModal] = useState(false);
  const [newEquityTransaction, setNewEquityTransaction] = useState({
    type: 'owner-contribution' as 'owner-contribution' | 'owner-withdrawal' | 'dividend',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'bank-transfer' as 'cash' | 'bank-transfer' | 'cheque' | 'online'
  });

  // Accounting state
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [showLedgerDialog, setShowLedgerDialog] = useState(false);
  const [showReconciliationDialog, setShowReconciliationDialog] = useState(false);
  const [reconciliationData, setReconciliationData] = useState({
    bookBalance: 0,
    statementBalance: 0,
    difference: 0
  });

  // Enhanced Features state
  const [showJournalEntryModal, setShowJournalEntryModal] = useState(false);
  const [showAccountPaymentModal, setShowAccountPaymentModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Commission state
  const [showCommissionSplitModal, setShowCommissionSplitModal] = useState(false);
  const [showCommissionApprovalModal, setShowCommissionApprovalModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [commissionFilter, setCommissionFilter] = useState<'all' | 'pending-approval' | 'approved' | 'paid'>('all');
  
  const properties = useMemo(() => getProperties(user.id, user.role), [user.id, user.role]);
  const leads = useMemo(() => getLeads(user.id, user.role), [user.id, user.role]);
  const contacts = useMemo(() => getContacts(user.id, user.role), [user.id, user.role, refreshKey]);
  const expenses = useMemo(() => getExpenses(user.id, user.role), [user.id, user.role, refreshKey]);
  
  // Load commissions from localStorage
  const commissions = useMemo(() => {
    const stored = localStorage.getItem('commissions');
    if (stored) {
      try {
        const allCommissions: Commission[] = JSON.parse(stored);
        // Filter based on user role
        if (user.role === 'admin') {
          return allCommissions;
        } else {
          return allCommissions.filter(c => c.agentId === user.id);
        }
      } catch (e) {
        console.error('Failed to load commissions:', e);
        return [];
      }
    }
    return [];
  }, [user.id, user.role, refreshKey]);
  
  // Get available agents for split commission
  const availableAgents = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: User) => u.role === 'agent' || u.role === 'admin')
      .map((u: User) => ({ id: u.id, name: u.name }));
  }, []);

  // Load generated reports from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('generated-reports');
    if (stored) {
      try {
        setGeneratedReports(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load reports:', e);
      }
    }
  }, []);

  // Helper function to get date range based on period
  const getDateRange = (period: string): { startDate: Date; endDate: Date } => {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = new Date(today);

    switch (period) {
      case 'mtd': // Month to Date
        startDate.setDate(1);
        break;
      case 'qtd': // Quarter to Date
        const quarter = Math.floor(today.getMonth() / 3);
        startDate.setMonth(quarter * 3);
        startDate.setDate(1);
        break;
      case 'ytd': // Year to Date
        startDate.setMonth(0);
        startDate.setDate(1);
        break;
      default:
        startDate.setMonth(0);
        startDate.setDate(1);
    }

    return { startDate, endDate };
  };

  // Generate P&L Statement
  const generatePLStatement = () => {
    const { startDate, endDate } = getDateRange(plPeriod);
    
    // Calculate revenue from sold properties
    const soldProperties = properties.filter(p => 
      p.status === 'sold' && 
      new Date(p.soldDate || '') >= startDate && 
      new Date(p.soldDate || '') <= endDate
    );
    
    const commissionRevenue = soldProperties.reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
    
    // Calculate expenses in the period
    const periodExpenses = expenses.filter(e => 
      new Date(e.date) >= startDate && 
      new Date(e.date) <= endDate
    );
    
    const totalExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Group expenses by category
    const expensesByCategory = periodExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const netIncome = commissionRevenue - totalExpenses;
    const profitMargin = commissionRevenue > 0 ? (netIncome / commissionRevenue) * 100 : 0;
    
    const report: GeneratedReport = {
      id: `pl-${Date.now()}`,
      type: 'P&L',
      period: plPeriod.toUpperCase(),
      generatedDate: new Date().toISOString(),
      data: {
        period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        revenue: {
          commissions: commissionRevenue,
          total: commissionRevenue
        },
        expenses: {
          byCategory: expensesByCategory,
          total: totalExpenses
        },
        netIncome,
        profitMargin,
        transactions: {
          soldProperties: soldProperties.length,
          expenses: periodExpenses.length
        }
      }
    };
    
    const updated = [...generatedReports, report];
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
    setViewingReport(report);
    toast.success('P&L Statement generated successfully');
  };

  // Generate Balance Sheet
  const generateBalanceSheet = () => {
    const asOfDate = new Date(balanceSheetDate);
    
    // Assets
    const activeProperties = properties.filter(p => p.status === 'available');
    const totalInventoryValue = activeProperties.reduce((sum, p) => sum + (p.price || 0), 0);
    
    // Receivables from pending commissions
    const receivables = properties
      .filter(p => p.status === 'sold' && p.commissionEarned && p.commissionEarned > 0)
      .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
    
    const cashAndBank = 7410000; // From dashboard mock data
    const totalAssets = totalInventoryValue + receivables + cashAndBank;
    
    // Liabilities
    const payables = expenses.filter(e => e.date <= balanceSheetDate).reduce((sum, e) => sum + e.amount, 0);
    const totalLiabilities = payables;
    
    // Equity
    const equity = totalAssets - totalLiabilities;
    
    const report: GeneratedReport = {
      id: `bs-${Date.now()}`,
      type: 'Balance Sheet',
      period: new Date(balanceSheetDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      generatedDate: new Date().toISOString(),
      data: {
        asOfDate: balanceSheetDate,
        assets: {
          cash: cashAndBank,
          receivables,
          inventory: totalInventoryValue,
          total: totalAssets
        },
        liabilities: {
          payables,
          total: totalLiabilities
        },
        equity: {
          total: equity
        }
      }
    };
    
    const updated = [...generatedReports, report];
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
    setViewingReport(report);
    toast.success('Balance Sheet generated successfully');
  };

  // Generate Cash Flow Statement
  const generateCashFlowStatement = () => {
    const { startDate, endDate } = getDateRange(cashFlowPeriod);
    
    // Operating Activities
    const commissionsColl = properties
      .filter(p => p.status === 'sold' && new Date(p.soldDate || '') >= startDate && new Date(p.soldDate || '') <= endDate)
      .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
    
    const expensesPaid = expenses
      .filter(e => new Date(e.date) >= startDate && new Date(e.date) <= endDate)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const operatingCashFlow = commissionsColl - expensesPaid;
    
    // Investing Activities (property acquisitions, disposals)
    const investingCashFlow = 0; // Would track property purchases/sales
    
    // Financing Activities
    const financingCashFlow = 0; // Would track loans, equity
    
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    
    const report: GeneratedReport = {
      id: `cf-${Date.now()}`,
      type: 'Cash Flow',
      period: cashFlowPeriod.toUpperCase(),
      generatedDate: new Date().toISOString(),
      data: {
        period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        operating: {
          commissionsCollected: commissionsColl,
          expensesPaid: -expensesPaid,
          net: operatingCashFlow
        },
        investing: {
          net: investingCashFlow
        },
        financing: {
          net: financingCashFlow
        },
        netCashFlow
      }
    };
    
    const updated = [...generatedReports, report];
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
    setViewingReport(report);
    toast.success('Cash Flow Statement generated successfully');
  };

  // Generate Trial Balance
  const generateTrialBalanceReport = () => {
    const trialBalance = generateTrialBalance(trialBalanceDate, user.id, user.role);
    
    const report: GeneratedReport = {
      id: trialBalance.id,
      type: 'Trial Balance',
      period: new Date(trialBalanceDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      generatedDate: new Date().toISOString(),
      data: trialBalance
    };
    
    const updated = [...generatedReports, report];
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
    setViewingReport(report);
    toast.success(
      trialBalance.isBalanced 
        ? 'Trial Balance generated successfully - Books are balanced ✓' 
        : `Trial Balance generated - WARNING: Out of balance by ${formatCurrency(Math.abs(trialBalance.difference))}`
    );
  };

  // Generate Statement of Changes in Equity
  const generateChangesInEquityReport = () => {
    const { startDate, endDate } = getDateRange(equityPeriod);
    
    // Get net income from P&L for this period
    const netIncome = getNetIncomeForPeriod(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      user.id,
      user.role
    );
    
    const changesInEquity = generateChangesInEquity(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      user.id,
      user.role,
      netIncome
    );
    
    const report: GeneratedReport = {
      id: changesInEquity.id,
      type: 'Changes in Equity',
      period: equityPeriod.toUpperCase(),
      generatedDate: new Date().toISOString(),
      data: changesInEquity
    };
    
    const updated = [...generatedReports, report];
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
    setViewingReport(report);
    toast.success('Statement of Changes in Equity generated successfully');
  };

  // Add Equity Transaction
  const handleAddEquityTransaction = () => {
    if (!newEquityTransaction.amount || !newEquityTransaction.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction = addEquityTransaction({
      type: newEquityTransaction.type,
      amount: parseFloat(newEquityTransaction.amount),
      date: newEquityTransaction.date,
      description: newEquityTransaction.description,
      paymentMethod: newEquityTransaction.paymentMethod,
      createdBy: user.id,
      createdByName: user.name
    });

    if (transaction) {
      toast.success('Equity transaction recorded successfully');
      setShowEquityTransactionModal(false);
      setNewEquityTransaction({
        type: 'owner-contribution',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'bank-transfer'
      });
      setRefreshKey(prev => prev + 1);
    }
  };

  // Generate General Ledger Entries
  const generateLedgerEntries = useMemo(() => {
    const entries: any[] = [];
    
    // Commission Revenue entries (Credits to Revenue, Debits to Accounts Receivable)
    properties
      .filter(p => p.status === 'sold')
      .forEach(p => {
        const commission = p.commissionEarned || 0;
        if (commission > 0) {
          entries.push({
            id: `revenue-${p.id}`,
            date: p.soldDate || p.createdAt,
            description: `Commission - ${p.title}`,
            account: 'Revenue',
            accountType: 'revenue',
            debit: 0,
            credit: commission,
            reference: p.id,
            balance: commission,
            source: 'auto'
          });
          entries.push({
            id: `ar-${p.id}`,
            date: p.soldDate || p.createdAt,
            description: `Commission Receivable - ${p.title}`,
            account: 'Accounts Receivable',
            accountType: 'assets',
            debit: commission,
            credit: 0,
            reference: p.id,
            balance: commission,
            source: 'auto'
          });
        }
      });
    
    // Expense entries (Debits to Expense accounts, Credits to Accounts Payable)
    expenses.forEach(e => {
      entries.push({
        id: `expense-${e.id}`,
        date: e.date,
        description: e.description,
        account: e.category,
        accountType: 'expenses',
        debit: e.amount,
        credit: 0,
        reference: e.id,
        balance: e.amount,
        source: 'auto'
      });
      entries.push({
        id: `ap-${e.id}`,
        date: e.date,
        description: `Payable - ${e.description}`,
        account: 'Accounts Payable',
        accountType: 'liabilities',
        debit: 0,
        credit: e.amount,
        reference: e.id,
        balance: e.amount,
        source: 'auto'
      });
    });
    
    // Manual Journal Entries
    const journalEntries = getJournalEntries(user.id, user.role);
    journalEntries
      .filter(je => je.status === 'posted')
      .forEach(je => {
        je.entries.forEach((line, index) => {
          entries.push({
            id: `je-${je.id}-${index}`,
            date: je.date,
            description: `${line.description} [${je.description}]`,
            account: line.account,
            accountType: line.accountType,
            debit: line.debit,
            credit: line.credit,
            reference: je.reference || je.id,
            balance: line.debit || line.credit,
            source: 'manual'
          });
        });
      });
    
    // Account Payments
    const accountPayments = getAccountPayments(user.id, user.role);
    accountPayments
      .filter(ap => ap.status === 'cleared')
      .forEach(ap => {
        if (ap.transactionType === 'payment-received') {
          // Debit: Bank Account (Cash received)
          entries.push({
            id: `payment-${ap.id}-bank`,
            date: ap.paymentDate,
            description: `${ap.description} [${ap.paymentMethod}]`,
            account: ap.bankAccount || 'Bank Account',
            accountType: 'assets',
            debit: ap.amount,
            credit: 0,
            reference: ap.referenceNumber || ap.id,
            balance: ap.amount,
            source: 'payment'
          });
          // Credit: Accounts Receivable (Reduce what's owed)
          entries.push({
            id: `payment-${ap.id}-ar`,
            date: ap.paymentDate,
            description: `A/R Payment: ${ap.description}`,
            account: 'Accounts Receivable',
            accountType: 'assets',
            debit: 0,
            credit: ap.amount,
            reference: ap.referenceNumber || ap.id,
            balance: ap.amount,
            source: 'payment'
          });
        } else {
          // Debit: Accounts Payable (Reduce what we owe)
          entries.push({
            id: `payment-${ap.id}-ap`,
            date: ap.paymentDate,
            description: `A/P Payment: ${ap.description}`,
            account: 'Accounts Payable',
            accountType: 'liabilities',
            debit: ap.amount,
            credit: 0,
            reference: ap.referenceNumber || ap.id,
            balance: ap.amount,
            source: 'payment'
          });
          // Credit: Bank Account (Cash paid out)
          entries.push({
            id: `payment-${ap.id}-bank`,
            date: ap.paymentDate,
            description: `${ap.description} [${ap.paymentMethod}]`,
            account: ap.bankAccount || 'Bank Account',
            accountType: 'assets',
            debit: 0,
            credit: ap.amount,
            reference: ap.referenceNumber || ap.id,
            balance: ap.amount,
            source: 'payment'
          });
        }
      });
    
    // Sort by date
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return entries;
  }, [properties, expenses, user.id, user.role, refreshKey]);

  // Filter ledger entries
  const filteredLedgerEntries = useMemo(() => {
    if (ledgerFilter === 'all') return generateLedgerEntries;
    return generateLedgerEntries.filter(e => e.accountType === ledgerFilter);
  }, [generateLedgerEntries, ledgerFilter]);

  // Calculate reconciliation data
  React.useEffect(() => {
    const soldCommissions = properties
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const bookBalance = 4560000; // From mockData
    // Simulate bank statement having some unrecorded transactions
    const statementBalance = bookBalance + 50000;
    
    setReconciliationData({
      bookBalance,
      statementBalance,
      difference: statementBalance - bookBalance
    });
  }, [properties, expenses]);

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const expenseData: Omit<Expense, 'id'> = {
      agentId: user.id,
      description: newExpense.description,
      amount: amount,
      category: newExpense.category,
      date: newExpense.date,
      propertyId: newExpense.propertyId && newExpense.propertyId !== 'none' ? newExpense.propertyId : undefined
    };

    const created = addExpense(expenseData);
    if (created) {
      toast.success('Expense added successfully' + (newExpense.propertyId && newExpense.propertyId !== 'none' ? ' and associated with property' : ''));
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        propertyId: 'none'
      });
      setShowAddExpenseDialog(false);
      setRefreshKey(prev => prev + 1);
    }
  };

  // Handle edit expense
  const handleEditExpense = (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    const updated = updateExpense(id, updates);
    if (updated) {
      toast.success('Expense updated successfully');
      setShowEditExpenseModal(false);
      setEditingExpense(null);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to update expense');
    }
  };

  // Handle delete expense
  const handleDeleteExpense = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete this expense: "${description}"?\n\nThis action cannot be undone.`)) {
      const deleted = deleteExpense(id);
      if (deleted) {
        toast.success('Expense deleted successfully');
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error('Failed to delete expense');
      }
    }
  };

  // Handle add journal entry
  const handleAddJournalEntry = (entry: any) => {
    const created = addJournalEntry({
      ...entry,
      createdBy: user.id
    });
    
    if (created) {
      toast.success(entry.status === 'posted' ? 'Journal entry posted successfully' : 'Journal entry saved as draft');
      setShowJournalEntryModal(false);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to create journal entry');
    }
  };

  // Handle add account payment
  const handleAddAccountPayment = (payment: any) => {
    const created = addAccountPayment({
      ...payment,
      agentId: user.id
    });
    
    if (created) {
      toast.success(`Payment ${payment.transactionType === 'payment-received' ? 'received' : 'made'} recorded successfully`);
      setShowAccountPaymentModal(false);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to record payment');
    }
  };

  // Commission Handlers
  const handleSaveSplitCommission = (splits: CommissionSplit[]) => {
    if (!selectedCommission) return;
    
    const commission = createCommissionWithSplits(
      selectedCommission.propertyId,
      selectedCommission.propertyTitle,
      selectedCommission.amount,
      splits,
      selectedCommission.payoutTrigger
    );
    
    if (commission) {
      toast.success('Commission split created successfully');
      setShowCommissionSplitModal(false);
      setSelectedCommission(null);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to create commission split');
    }
  };

  const handleApproveCommission = (commissionId: string) => {
    const approved = approveCommission(commissionId, user.id);
    if (approved) {
      toast.success('Commission approved successfully');
      setShowCommissionApprovalModal(false);
      setSelectedCommission(null);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to approve commission');
    }
  };

  const handleRejectCommission = (commissionId: string, reason: string) => {
    const rejected = rejectCommission(commissionId, reason);
    if (rejected) {
      toast.success('Commission rejected');
      setShowCommissionApprovalModal(false);
      setSelectedCommission(null);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to reject commission');
    }
  };

  const handleOverrideCommission = (commissionId: string, newAmount: number, reason: string) => {
    const overridden = overrideCommission(commissionId, newAmount, reason, user.id);
    if (overridden) {
      toast.success('Commission amount overridden');
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to override commission');
    }
  };

  // Mock data - in real app this would come from API/database
  const mockData = useMemo(() => {
    const soldProperties = properties.filter(p => p.status === 'sold');
    const totalCommission = soldProperties.reduce((sum, p) => sum + (p.commissionEarned || 0), 0);

    return {
      dashboard: {
        cashBalance: 2850000,
        bankBalance: 4560000,
        accountsReceivable: 15675000,
        accountsPayable: 4530000,
        cashFlowProjected: 3330000
      },
      commissions: {
        pipeline: 24500000,
        paidYTD: 45300000,
        readyForPayout: 5620000,
        accruing: 8450000
      },
      paymentAlerts: [
        {
          id: '1',
          description: 'Final payment due from Metro Properties LLC - Tower A',
          amount: 12500000,
          dueDate: '2024-01-18',
          daysUntilDue: 6,
          type: 'incoming',
          priority: 'high',
          projectName: 'Downtown Towers Development'
        },
        {
          id: '2',
          description: 'Contractor payment - ABC Construction Phase 2',
          amount: 8500000,
          dueDate: '2024-01-15',
          daysUntilDue: 3,
          type: 'outgoing',
          priority: 'high',
          projectName: 'Downtown Renovation'
        },
        {
          id: '3',
          description: 'Client installment - Johnson Family Trust',
          amount: 4500000,
          dueDate: '2024-01-22',
          daysUntilDue: 10,
          type: 'incoming',
          priority: 'medium',
          projectName: 'Luxury Villa Project'
        }
      ],
      commissionLedger: [
        {
          id: '1',
          dealDate: '2024-01-15',
          property: 'Downtown Towers, Apt 502',
          agent: 'Sarah Johnson',
          totalCommissionValue: 850000,
          amountAccrued: 850000,
          amountPaid: 850000,
          balanceDue: 0,
          status: 'Paid'
        },
        {
          id: '2',
          dealDate: '2024-01-12',
          property: 'Riverside Villas, Unit 12A',
          agent: 'Michael Chen',
          totalCommissionValue: 620000,
          amountAccrued: 620000,
          amountPaid: 310000,
          balanceDue: 310000,
          status: 'Ready for Payout'
        },
        {
          id: '3',
          dealDate: '2024-01-10',
          property: 'Metro Complex, Suite 208',
          agent: 'Emily Rodriguez',
          totalCommissionValue: 780000,
          amountAccrued: 468000,
          amountPaid: 0,
          balanceDue: 468000,
          status: 'Accruing'
        }
      ],
      paymentPlans: [
        {
          id: '1',
          property: 'Downtown Towers, Apt 502',
          buyer: 'Johnson Family Trust',
          totalValue: 28500000,
          paidToDate: 19950000,
          nextInstallment: 4275000,
          nextDueDate: '2024-02-01',
          status: 'On Track'
        },
        {
          id: '2',
          property: 'Riverside Villas, Unit 12A',
          buyer: 'Metro Properties LLC',
          totalValue: 22500000,
          paidToDate: 11250000,
          nextInstallment: 5625000,
          nextDueDate: '2024-01-20',
          status: 'Due Soon'
        }
      ],
      expenses: expenses,
      payables: [
        {
          id: '1',
          vendor: 'ABC Construction',
          billNumber: 'BILL-001',
          amount: 1250000,
          dueDate: '2024-01-20',
          status: 'Pending',
          category: 'Contractor Services'
        },
        {
          id: '2',
          vendor: 'Steel & Concrete Co',
          billNumber: 'BILL-002',
          amount: 8500000,
          dueDate: '2024-01-15',
          status: 'Approved',
          category: 'Material Supply'
        }
      ]
    };
  }, [properties, leads, expenses]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cash & Bank Position</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrencyShort(mockData.dashboard.cashBalance + mockData.dashboard.bankBalance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total liquid funds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AR vs. AP</p>
                <div className="flex items-center space-x-2">
                  <div className="text-green-600">
                    <p className="text-lg font-bold">{formatCurrencyShort(mockData.dashboard.accountsReceivable)}</p>
                    <p className="text-xs">Receivables</p>
                  </div>
                  <span className="text-gray-400">vs</span>
                  <div className="text-red-600">
                    <p className="text-lg font-bold">{formatCurrencyShort(mockData.dashboard.accountsPayable)}</p>
                    <p className="text-xs">Payables</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">30-Day Cash Flow</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrencyShort(mockData.dashboard.cashFlowProjected)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Projected net inflow
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-50">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Payment Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockData.paymentAlerts.length}
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Action required
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Payment Alerts */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-orange-50">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Critical Payment Alerts</CardTitle>
            </div>
            <Badge className="bg-orange-100 text-orange-800">
              {mockData.paymentAlerts.length} alerts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.paymentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.priority === 'high' ? 'bg-red-500' : 
                    alert.priority === 'medium' ? 'bg-orange-500' : 
                    'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Due: {alert.dueDate}</span>
                      <span>•</span>
                      <span>{alert.type}</span>
                      {alert.projectName && (
                        <>
                          <span>•</span>
                          <span>{alert.projectName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${alert.type === 'outgoing' ? 'text-red-600' : 'text-green-600'}`}>
                    {alert.type === 'outgoing' ? '-' : '+'}{formatCurrencyShort(alert.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{alert.daysUntilDue} days</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExpensesPayables = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Expenses & Payables</h2>
          <p className="text-gray-600">Manage company expenses and vendor payments</p>
        </div>
        <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new company expense or business cost.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expense-date">Date *</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-category">Category *</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                  <SelectTrigger id="expense-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Office">Office Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Travel">Travel & Transport</SelectItem>
                    <SelectItem value="Professional Fees">Professional Fees</SelectItem>
                    <SelectItem value="Rent">Rent & Lease</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Technology">Technology & Software</SelectItem>
                    <SelectItem value="Maintenance">Maintenance & Repairs</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-description">Description *</Label>
                <Input
                  id="expense-description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Brief description of the expense"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount (PKR) *</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-property">Associate with Property (Optional)</Label>
                <Select value={newExpense.propertyId} onValueChange={(value) => setNewExpense({ ...newExpense, propertyId: value })}>
                  <SelectTrigger id="expense-property">
                    <SelectValue placeholder="Select a property (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None - General Expense</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {formatPropertyAddressShort(property.address)} ({formatCurrencyShort(property.price || property.monthlyRent || 0)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Link this expense to a specific property for detailed profit & loss tracking on property flips
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddExpenseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {mockData.expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No expenses recorded yet</p>
              <p className="text-sm mt-1">Click "Add Expense" to record your first expense</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Associated Property</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => {
                  const associatedProperty = expense.propertyId 
                    ? properties.find(p => p.id === expense.propertyId)
                    : null;
                  
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{expense.description}</TableCell>
                      <TableCell>
                        {associatedProperty ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{associatedProperty.title}</span>
                            <span className="text-xs text-gray-500">{associatedProperty.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">General Expense</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingExpense(expense);
                              setShowEditExpenseModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id, expense.description)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Vendor Payables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Payables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Bill Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.payables.map((payable) => (
                <TableRow key={payable.id}>
                  <TableCell className="font-medium">{payable.vendor}</TableCell>
                  <TableCell>{payable.billNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payable.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payable.amount)}
                  </TableCell>
                  <TableCell>{payable.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={
                      payable.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }>
                      {payable.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Pay Bill
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccounting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Accounting</h2>
          <p className="text-gray-600">General ledger and bank reconciliation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowJournalEntryModal(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Manual Journal Entry
          </Button>
          <Button
            onClick={() => setShowAccountPaymentModal(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Account Balances Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-50">
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Assets</p>
                <p className="font-medium">
                  {formatCurrencyShort(
                    generateLedgerEntries
                      .filter(e => e.accountType === 'assets')
                      .reduce((sum, e) => sum + e.debit - e.credit, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-red-50">
                <Receipt className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Liabilities</p>
                <p className="font-medium">
                  {formatCurrencyShort(
                    generateLedgerEntries
                      .filter(e => e.accountType === 'liabilities')
                      .reduce((sum, e) => sum + e.credit - e.debit, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Revenue</p>
                <p className="font-medium">
                  {formatCurrencyShort(
                    generateLedgerEntries
                      .filter(e => e.accountType === 'revenue')
                      .reduce((sum, e) => sum + e.credit - e.debit, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-orange-50">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Expenses</p>
                <p className="font-medium">
                  {formatCurrencyShort(
                    generateLedgerEntries
                      .filter(e => e.accountType === 'expenses')
                      .reduce((sum, e) => sum + e.debit - e.credit, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <Calculator className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Net Position</p>
                <p className="font-medium text-green-700">
                  {formatCurrencyShort(
                    generateLedgerEntries
                      .filter(e => e.accountType === 'revenue')
                      .reduce((sum, e) => sum + e.credit - e.debit, 0) -
                    generateLedgerEntries
                      .filter(e => e.accountType === 'expenses')
                      .reduce((sum, e) => sum + e.debit - e.credit, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* General Ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>General Ledger</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={ledgerFilter} onValueChange={setLedgerFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                  <SelectItem value="liabilities">Liabilities</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLedgerDialog(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Ledger
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLedgerEntries.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium mb-2">No Ledger Entries</h3>
              <p className="text-sm text-gray-600">
                Ledger entries will appear here as transactions are recorded
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredLedgerEntries.length} entries {ledgerFilter !== 'all' && `(${ledgerFilter})`}
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLedgerEntries.slice(0, 10).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.account}
                          </Badge>
                          {entry.source === 'manual' && (
                            <Badge className="text-xs bg-purple-100 text-purple-800">Manual</Badge>
                          )}
                          {entry.source === 'payment' && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">Payment</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{entry.description}</TableCell>
                      <TableCell className="text-right font-medium text-green-700">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-700">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(entry.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredLedgerEntries.length > 10 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowLedgerDialog(true)}
                  >
                    View All {filteredLedgerEntries.length} Entries
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank Reconciliation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="h-5 w-5" />
              <span>Bank Reconciliation</span>
            </CardTitle>
            <Button onClick={() => setShowReconciliationDialog(true)}>
              <Eye className="h-4 w-4 mr-2" />
              View Reconciliation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Book Balance</p>
                <p className="text-xl font-medium">{formatCurrencyShort(reconciliationData.bookBalance)}</p>
                <p className="text-xs text-gray-500 mt-1">Per accounting records</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Bank Statement Balance</p>
                <p className="text-xl font-medium">{formatCurrencyShort(reconciliationData.statementBalance)}</p>
                <p className="text-xs text-gray-500 mt-1">Per bank statement</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Difference</p>
                <p className="text-xl font-medium text-orange-600">
                  {formatCurrencyShort(Math.abs(reconciliationData.difference))}
                </p>
                <p className="text-xs text-orange-600 mt-1">Needs reconciliation</p>
              </div>
            </div>
            {reconciliationData.difference !== 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-900">Reconciliation Required</p>
                    <p className="text-sm text-orange-700 mt-1">
                      There are unreconciled transactions totaling {formatCurrency(Math.abs(reconciliationData.difference))}. 
                      This could be due to outstanding checks, deposits in transit, or bank fees.
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowReconciliationDialog(true)}
                      >
                        Start Reconciliation
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {reconciliationData.difference === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Reconciled</p>
                    <p className="text-sm text-green-700 mt-1">
                      Bank account is fully reconciled. Book balance matches bank statement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries & Account Payments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Manual Journal Entries</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowJournalEntryModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const journalEntries = getJournalEntries(user.id, user.role);
              
              if (journalEntries.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No manual journal entries recorded</p>
                    <p className="text-sm mt-1">Create adjustments using double-entry bookkeeping</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {journalEntries.slice(0, 5).map((entry) => (
                    <div 
                      key={entry.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entry.description}</p>
                            <Badge className={
                              entry.status === 'posted' ? 'bg-green-100 text-green-800' :
                              entry.status === 'reversed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {entry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {entry.reference && ` • Ref: ${entry.reference}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrencyShort(entry.totalDebit)}</p>
                          <p className="text-xs text-gray-500">{entry.entries.length} lines</p>
                        </div>
                      </div>
                      {entry.status === 'reversed' && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-xs text-red-700">
                            <strong>Reversed:</strong> {entry.reversalReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {journalEntries.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm">
                        View All {journalEntries.length} Entries
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Recent Account Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Account Payments (A/R & A/P)</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAccountPaymentModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Record Payment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const accountPayments = getAccountPayments(user.id, user.role);
              
              if (accountPayments.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No account payments recorded</p>
                    <p className="text-sm mt-1">Record payments received or made</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {accountPayments.slice(0, 5).map((payment) => (
                    <div 
                      key={payment.id}
                      className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors ${
                        payment.transactionType === 'payment-received' 
                          ? 'border-l-4 border-l-green-500' 
                          : 'border-l-4 border-l-orange-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{payment.description}</p>
                            <Badge className={
                              payment.transactionType === 'payment-received' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }>
                              {payment.transactionType === 'payment-received' ? 'Received' : 'Made'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(payment.paymentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {' • '}
                            {payment.paymentMethod}
                            {payment.referenceNumber && ` • ${payment.referenceNumber}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            payment.transactionType === 'payment-received' 
                              ? 'text-green-700' 
                              : 'text-orange-700'
                          }`}>
                            {formatCurrencyShort(payment.amount)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {accountPayments.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm">
                        View All {accountPayments.length} Payments
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Full Ledger Dialog */}
      <Dialog open={showLedgerDialog} onOpenChange={setShowLedgerDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>General Ledger - All Entries</DialogTitle>
            <DialogDescription>
              Complete record of all accounting transactions with double-entry bookkeeping
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Total Entries: {filteredLedgerEntries.length}
                </p>
              </div>
              <Select value={ledgerFilter} onValueChange={setLedgerFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                  <SelectItem value="liabilities">Liabilities</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLedgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {entry.account}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{entry.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-700">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-700">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(entry.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowLedgerDialog(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Reconciliation Dialog */}
      <Dialog open={showReconciliationDialog} onOpenChange={setShowReconciliationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bank Reconciliation</DialogTitle>
            <DialogDescription>
              Reconcile accounting records with bank statement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Book Balance</p>
                <p className="text-2xl font-medium text-blue-900">
                  {formatCurrency(reconciliationData.bookBalance)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 mb-1">Bank Statement</p>
                <p className="text-2xl font-medium text-green-900">
                  {formatCurrency(reconciliationData.statementBalance)}
                </p>
              </div>
              <div className={`rounded-lg p-4 border ${
                reconciliationData.difference === 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <p className={`text-sm mb-1 ${
                  reconciliationData.difference === 0 ? 'text-green-700' : 'text-orange-700'
                }`}>
                  Difference
                </p>
                <p className={`text-2xl font-medium ${
                  reconciliationData.difference === 0 ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {formatCurrency(Math.abs(reconciliationData.difference))}
                </p>
              </div>
            </div>

            {/* Reconciliation Items */}
            <div>
              <h3 className="font-medium mb-3">Reconciliation Items</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Outstanding Checks</p>
                    <p className="text-sm text-gray-600">Not yet cleared by bank</p>
                  </div>
                  <p className="text-sm text-gray-600">No outstanding checks recorded</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Deposits in Transit</p>
                    <p className="text-sm text-gray-600">Deposited but not yet on statement</p>
                  </div>
                  <p className="text-sm text-gray-600">No deposits in transit</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-orange-900">Bank Fees & Charges</p>
                    <p className="font-medium text-orange-700">{formatCurrency(50000)}</p>
                  </div>
                  <p className="text-sm text-orange-700">
                    Bank maintenance fees and charges not yet recorded in books
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Record in Books
                  </Button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to Reconcile</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Start with the book balance from your accounting records</li>
                <li>Add deposits in transit (recorded but not on bank statement)</li>
                <li>Subtract outstanding checks (written but not cleared)</li>
                <li>Add/subtract bank fees, interest, or errors</li>
                <li>Compare adjusted book balance with bank statement balance</li>
              </ol>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowReconciliationDialog(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              Complete Reconciliation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Financial Reports</h2>
        <p className="text-gray-600">Generate and view key financial statements</p>
      </div>

      {/* Main Financial Statements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* P&L Statement */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>P&L Statement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Profit and Loss statement showing revenue, expenses, and net income over a period
            </p>
            <div className="space-y-2">
              <Label>Report Period</Label>
              <Select value={plPeriod} onValueChange={setPlPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">Month to Date</SelectItem>
                  <SelectItem value="qtd">Quarter to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={generatePLStatement}>
              <FileCheck className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Balance Sheet */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-50">
                <PieChart className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Balance Sheet</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Statement of assets, liabilities, and equity showing the company's financial position
            </p>
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Input 
                type="date" 
                value={balanceSheetDate} 
                onChange={(e) => setBalanceSheetDate(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={generateBalanceSheet}>
              <FileCheck className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Cash Flow Statement */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <TrendingUpIcon className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle>Cash Flow Statement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Statement of cash inflows and outflows from operating, investing, and financing activities
            </p>
            <div className="space-y-2">
              <Label>Report Period</Label>
              <Select value={cashFlowPeriod} onValueChange={setCashFlowPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">Month to Date</SelectItem>
                  <SelectItem value="qtd">Quarter to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={generateCashFlowStatement}>
              <FileCheck className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Accounting Cycle Reports */}
      <div className="mt-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Accounting Cycle Reports</h3>
          <p className="text-sm text-gray-600">Trial Balance and equity tracking reports</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trial Balance */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Calculator className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle>Trial Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Verify that total debits equal total credits across all accounts
              </p>
              <div className="space-y-2">
                <Label>As of Date</Label>
                <Input 
                  type="date" 
                  value={trialBalanceDate} 
                  onChange={(e) => setTrialBalanceDate(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={generateTrialBalanceReport}>
                <FileCheck className="h-4 w-4 mr-2" />
                Generate Trial Balance
              </Button>
            </CardContent>
          </Card>

          {/* Statement of Changes in Equity */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle>Changes in Equity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Track changes in owner's equity including contributions and withdrawals
              </p>
              <div className="space-y-2">
                <Label>Report Period</Label>
                <Select value={equityPeriod} onValueChange={setEquityPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtd">Month to Date</SelectItem>
                    <SelectItem value="qtd">Quarter to Date</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowEquityTransactionModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Record Transaction
                </Button>
                <Button className="flex-1" onClick={generateChangesInEquityReport}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Archive */}
      <Card>
        <CardHeader>
          <CardTitle>Report Archive</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No previously generated reports</p>
              <p className="text-sm mt-1">Generated reports will appear here for quick access</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedReports.slice().reverse().map((report) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      report.type === 'P&L' ? 'bg-blue-50' :
                      report.type === 'Balance Sheet' ? 'bg-green-50' :
                      report.type === 'Cash Flow' ? 'bg-purple-50' :
                      report.type === 'Trial Balance' ? 'bg-orange-50' :
                      'bg-indigo-50'
                    }`}>
                      {report.type === 'P&L' ? <BarChart3 className="h-4 w-4 text-blue-600" /> :
                       report.type === 'Balance Sheet' ? <PieChart className="h-4 w-4 text-green-600" /> :
                       report.type === 'Cash Flow' ? <TrendingUpIcon className="h-4 w-4 text-purple-600" /> :
                       report.type === 'Trial Balance' ? <Calculator className="h-4 w-4 text-orange-600" /> :
                       <Wallet className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{report.type}</p>
                      <p className="text-sm text-gray-600">{report.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(report.generatedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewingReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report View Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingReport?.type} - {viewingReport?.period}
            </DialogTitle>
            <DialogDescription>
              Generated on {viewingReport && new Date(viewingReport.generatedDate).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </DialogDescription>
          </DialogHeader>
          
          {viewingReport?.type === 'P&L' && (
            <div className="space-y-6">
              {/* Period Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Period: {new Date(viewingReport.data.period.startDate).toLocaleDateString()} - {new Date(viewingReport.data.period.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Revenue Section */}
              <div>
                <h3 className="font-medium mb-3">Revenue</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Commission Revenue</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.revenue.commissions)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium">Total Revenue</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.revenue.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Expenses Section */}
              <div>
                <h3 className="font-medium mb-3">Expenses</h3>
                <Table>
                  <TableBody>
                    {Object.entries(viewingReport.data.expenses.byCategory).map(([category, amount]) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(amount as number)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-red-50">
                      <TableCell className="font-medium">Total Expenses</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.expenses.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Net Income */}
              <div className="border-t-2 pt-4">
                <Table>
                  <TableBody>
                    <TableRow className={viewingReport.data.netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                      <TableCell className="font-medium text-lg">Net Income</TableCell>
                      <TableCell className={`text-right font-medium text-lg ${
                        viewingReport.data.netIncome >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(viewingReport.data.netIncome)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Profit Margin</TableCell>
                      <TableCell className="text-right font-medium">
                        {viewingReport.data.profitMargin.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Transaction Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Properties Sold</p>
                    <p className="font-medium">{viewingReport.data.transactions.soldProperties}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expense Transactions</p>
                    <p className="font-medium">{viewingReport.data.transactions.expenses}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewingReport?.type === 'Balance Sheet' && (
            <div className="space-y-6">
              {/* Date Info */}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  As of {new Date(viewingReport.data.asOfDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Assets */}
              <div>
                <h3 className="font-medium mb-3">Assets</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cash & Bank</TableCell>
                      <TableCell className="text-right">{formatCurrency(viewingReport.data.assets.cash)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Accounts Receivable</TableCell>
                      <TableCell className="text-right">{formatCurrency(viewingReport.data.assets.receivables)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Inventory (Active Properties)</TableCell>
                      <TableCell className="text-right">{formatCurrency(viewingReport.data.assets.inventory)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-50">
                      <TableCell className="font-medium">Total Assets</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.assets.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Liabilities */}
              <div>
                <h3 className="font-medium mb-3">Liabilities</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Accounts Payable</TableCell>
                      <TableCell className="text-right">{formatCurrency(viewingReport.data.liabilities.payables)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-red-50">
                      <TableCell className="font-medium">Total Liabilities</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.liabilities.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Equity */}
              <div className="border-t-2 pt-4">
                <Table>
                  <TableBody>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-lg">Total Equity</TableCell>
                      <TableCell className="text-right font-medium text-lg text-blue-700">
                        {formatCurrency(viewingReport.data.equity.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Balance Check */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Assets = Liabilities + Equity
                </p>
                <p className="font-medium">
                  {formatCurrency(viewingReport.data.assets.total)} = {formatCurrency(viewingReport.data.liabilities.total)} + {formatCurrency(viewingReport.data.equity.total)}
                </p>
              </div>
            </div>
          )}

          {viewingReport?.type === 'Cash Flow' && (
            <div className="space-y-6">
              {/* Period Info */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  Period: {new Date(viewingReport.data.period.startDate).toLocaleDateString()} - {new Date(viewingReport.data.period.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Operating Activities */}
              <div>
                <h3 className="font-medium mb-3">Cash Flow from Operating Activities</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Commissions Collected</TableCell>
                      <TableCell className="text-right text-green-700">
                        {formatCurrency(viewingReport.data.operating.commissionsCollected)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Expenses Paid</TableCell>
                      <TableCell className="text-right text-red-700">
                        {formatCurrency(viewingReport.data.operating.expensesPaid)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium">Net Cash from Operations</TableCell>
                      <TableCell className={`text-right font-medium ${
                        viewingReport.data.operating.net >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(viewingReport.data.operating.net)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Investing Activities */}
              <div>
                <h3 className="font-medium mb-3">Cash Flow from Investing Activities</h3>
                <Table>
                  <TableBody>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-medium">Net Cash from Investing</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.investing.net)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Financing Activities */}
              <div>
                <h3 className="font-medium mb-3">Cash Flow from Financing Activities</h3>
                <Table>
                  <TableBody>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-medium">Net Cash from Financing</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(viewingReport.data.financing.net)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Net Change */}
              <div className="border-t-2 pt-4">
                <Table>
                  <TableBody>
                    <TableRow className={viewingReport.data.netCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50'}>
                      <TableCell className="font-medium text-lg">Net Change in Cash</TableCell>
                      <TableCell className={`text-right font-medium text-lg ${
                        viewingReport.data.netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(viewingReport.data.netCashFlow)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {viewingReport?.type === 'Trial Balance' && (
            <div className="space-y-6">
              {/* Date Info */}
              <div className="bg-orange-50 p-4 rounded-lg flex items-center justify-between">
                <p className="text-sm font-medium text-orange-900">
                  As of {new Date(viewingReport.data.asOfDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                {viewingReport.data.isBalanced ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Balanced
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Out of Balance: {formatCurrency(Math.abs(viewingReport.data.difference))}
                  </Badge>
                )}
              </div>

              {/* Account Balances by Type */}
              {['asset', 'liability', 'equity', 'revenue', 'expense'].map(accountType => {
                const typeAccounts = viewingReport.data.accounts.filter(
                  (acc: any) => acc.accountType === accountType
                );
                
                if (typeAccounts.length === 0) return null;
                
                return (
                  <div key={accountType}>
                    <h3 className="font-medium mb-3 capitalize">{accountType}s</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typeAccounts.map((account: any) => (
                          <TableRow key={account.accountCode}>
                            <TableCell>{account.accountName}</TableCell>
                            <TableCell className="text-right">
                              {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="border-t-2 pt-4">
                <Table>
                  <TableBody>
                    <TableRow className="bg-gray-100">
                      <TableCell className="font-bold text-lg">TOTAL</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(viewingReport.data.totalDebits)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(viewingReport.data.totalCredits)}
                      </TableCell>
                    </TableRow>
                    {!viewingReport.data.isBalanced && (
                      <TableRow className="bg-red-50">
                        <TableCell className="font-medium">Difference</TableCell>
                        <TableCell className="text-right font-medium text-red-700" colSpan={2}>
                          {formatCurrency(Math.abs(viewingReport.data.difference))}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {viewingReport?.type === 'Changes in Equity' && (
            <div className="space-y-6">
              {/* Period Info */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-indigo-900">
                  Period: {new Date(viewingReport.data.period.startDate).toLocaleDateString()} - {new Date(viewingReport.data.period.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Equity Summary */}
              <div>
                <h3 className="font-medium mb-3">Statement of Changes in Equity</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Beginning Balance</TableCell>
                      <TableCell className="text-right">{formatCurrency(viewingReport.data.beginningBalance)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Add: Net Income for Period</TableCell>
                      <TableCell className="text-right text-green-700">
                        {formatCurrency(viewingReport.data.netIncome)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Add: Owner Contributions</TableCell>
                      <TableCell className="text-right text-green-700">
                        {formatCurrency(viewingReport.data.contributions)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Less: Owner Withdrawals</TableCell>
                      <TableCell className="text-right text-red-700">
                        ({formatCurrency(viewingReport.data.withdrawals)})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Less: Dividends Paid</TableCell>
                      <TableCell className="text-right text-red-700">
                        ({formatCurrency(viewingReport.data.dividends)})
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-indigo-50 border-t-2">
                      <TableCell className="font-bold text-lg">Ending Balance</TableCell>
                      <TableCell className="text-right font-bold text-lg text-indigo-700">
                        {formatCurrency(viewingReport.data.endingBalance)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Transaction Details */}
              {viewingReport.data.transactions && viewingReport.data.transactions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Detailed Transactions</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingReport.data.transactions.map((txn: any) => (
                        <TableRow key={txn.id}>
                          <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {txn.type.replace(/-/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell className={`text-right ${
                            txn.type === 'owner-contribution' || txn.type === 'net-income' 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {txn.type === 'owner-contribution' || txn.type === 'net-income' 
                              ? formatCurrency(txn.amount)
                              : `(${formatCurrency(txn.amount)})`
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setViewingReport(null)}>
              Close
            </Button>
            <Button onClick={() => {
              window.print();
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equity Transaction Modal */}
      <Dialog open={showEquityTransactionModal} onOpenChange={setShowEquityTransactionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Equity Transaction</DialogTitle>
            <DialogDescription>
              Track owner contributions, withdrawals, or dividend payments
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Type *</Label>
              <Select 
                value={newEquityTransaction.type} 
                onValueChange={(value: any) => setNewEquityTransaction({...newEquityTransaction, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner-contribution">Owner Contribution</SelectItem>
                  <SelectItem value="owner-withdrawal">Owner Withdrawal</SelectItem>
                  <SelectItem value="dividend">Dividend Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount (PKR) *</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={newEquityTransaction.amount}
                onChange={(e) => setNewEquityTransaction({...newEquityTransaction, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={newEquityTransaction.date}
                onChange={(e) => setNewEquityTransaction({...newEquityTransaction, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Enter description of the transaction"
                value={newEquityTransaction.description}
                onChange={(e) => setNewEquityTransaction({...newEquityTransaction, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select 
                value={newEquityTransaction.paymentMethod} 
                onValueChange={(value: any) => setNewEquityTransaction({...newEquityTransaction, paymentMethod: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEquityTransactionModal(false);
                setNewEquityTransaction({
                  type: 'owner-contribution',
                  amount: '',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  paymentMethod: 'bank-transfer'
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEquityTransaction}>
              <Plus className="h-4 w-4 mr-2" />
              Record Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financials Hub</h1>
            <p className="text-gray-600 mt-1">Unified center for all accounting and money management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Financial Dashboard
            </Button>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="mt-6">
          <nav className="flex space-x-1 border-b">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeSection === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection('sales-commissions')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeSection === 'sales-commissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Sales & Commissions
            </button>
            <button
              onClick={() => setActiveSection('expenses-payables')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeSection === 'expenses-payables'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses & Payables
            </button>
            <button
              onClick={() => setActiveSection('accounting')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeSection === 'accounting'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Accounting
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeSection === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'sales-commissions' && (
          <CommissionsSection
            commissions={commissions}
            user={user}
            userRole={user.role}
            filter={commissionFilter}
            onFilterChange={setCommissionFilter}
            onReviewCommission={(commission) => {
              setSelectedCommission(commission);
              setShowCommissionApprovalModal(true);
            }}
            onSplitCommission={(commission) => {
              setSelectedCommission(commission);
              setShowCommissionSplitModal(true);
            }}
          />
        )}
        {activeSection === 'expenses-payables' && renderExpensesPayables()}
        {activeSection === 'accounting' && renderAccounting()}
        {activeSection === 'reports' && renderReports()}
      </div>

      {/* Enhanced Feature Modals */}
      <ManualJournalEntryModal
        open={showJournalEntryModal}
        onClose={() => setShowJournalEntryModal(false)}
        onSave={handleAddJournalEntry}
        userId={user.id}
      />

      <AccountPaymentModal
        open={showAccountPaymentModal}
        onClose={() => setShowAccountPaymentModal(false)}
        onSave={handleAddAccountPayment}
        properties={properties}
        contacts={contacts}
        userId={user.id}
      />

      <EditExpenseModal
        open={showEditExpenseModal}
        onClose={() => {
          setShowEditExpenseModal(false);
          setEditingExpense(null);
        }}
        expense={editingExpense}
        onSave={handleEditExpense}
        properties={properties}
      />

      {/* Commission Modals */}
      {selectedCommission && (
        <>
          <CommissionSplitModal
            open={showCommissionSplitModal}
            onClose={() => {
              setShowCommissionSplitModal(false);
              setSelectedCommission(null);
            }}
            onSave={handleSaveSplitCommission}
            totalAmount={selectedCommission.amount}
            propertyTitle={selectedCommission.propertyTitle}
            availableAgents={availableAgents}
          />

          <CommissionApprovalModal
            open={showCommissionApprovalModal}
            onClose={() => {
              setShowCommissionApprovalModal(false);
              setSelectedCommission(null);
            }}
            commission={selectedCommission}
            onApprove={() => handleApproveCommission(selectedCommission.id)}
            onReject={(reason) => handleRejectCommission(selectedCommission.id, reason)}
            onOverride={(newAmount, reason) => handleOverrideCommission(selectedCommission.id, newAmount, reason)}
            userRole={user.role}
          />
        </>
      )}
    </div>
  );
};
