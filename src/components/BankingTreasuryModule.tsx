import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus,
  Banknote,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building
} from 'lucide-react';

interface BankingTreasuryModuleProps {
  userRole: 'admin' | 'agent';
}

export const BankingTreasuryModule: React.FC<BankingTreasuryModuleProps> = ({ userRole }) => {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Mock bank accounts data
  const bankAccounts = [
    {
      id: '1',
      accountName: 'Business Checking',
      accountNumber: '****1234',
      bankName: 'First National Bank',
      accountType: 'checking',
      balance: 89500.00,
      availableBalance: 87200.00,
      isPrimary: true,
      isActive: true,
      lastReconciled: '2024-01-08',
      interestRate: 0.5,
      monthlyFee: 25
    },
    {
      id: '2',
      accountName: 'Escrow Trust Account',
      accountNumber: '****5678',
      bankName: 'Trust Bank & Securities',
      accountType: 'escrow',
      balance: 156000.00,
      availableBalance: 156000.00,
      isPrimary: false,
      isActive: true,
      lastReconciled: '2024-01-10',
      interestRate: 1.2,
      monthlyFee: 0
    },
    {
      id: '3',
      accountName: 'Money Market Savings',
      accountNumber: '****9876',
      bankName: 'Community Bank',
      accountType: 'savings',
      balance: 45000.00,
      availableBalance: 45000.00,
      isPrimary: false,
      isActive: true,
      lastReconciled: '2024-01-05',
      interestRate: 2.1,
      monthlyFee: 0
    }
  ];

  // Mock transactions data
  const transactions = [
    {
      id: '1',
      bankAccountId: '1',
      date: '2024-01-12',
      description: 'Commission Payment - Johnson Property',
      amount: 15000.00,
      type: 'credit',
      category: 'Income',
      isReconciled: true,
      balance: 89500.00
    },
    {
      id: '2',
      bankAccountId: '1',
      date: '2024-01-11',
      description: 'Office Rent - January',
      amount: -2500.00,
      type: 'debit',
      category: 'Operating Expenses',
      isReconciled: true,
      balance: 74500.00
    },
    {
      id: '3',
      bankAccountId: '2',
      date: '2024-01-10',
      description: 'Escrow Deposit - Metro Properties',
      amount: 50000.00,
      type: 'credit',
      category: 'Escrow',
      isReconciled: true,
      balance: 156000.00
    },
    {
      id: '4',
      bankAccountId: '1',
      date: '2024-01-09',
      description: 'Marketing Expenses - Digital Ads',
      amount: -850.00,
      type: 'debit',
      category: 'Marketing',
      isReconciled: false,
      balance: 77000.00
    }
  ];

  // Mock cash flow forecast data
  const cashFlowForecast = [
    {
      period: 'Next 7 Days',
      projectedInflow: 12500,
      projectedOutflow: 8200,
      netFlow: 4300,
      confidence: 'high'
    },
    {
      period: 'Next 30 Days',
      projectedInflow: 67800,
      projectedOutflow: 34500,
      netFlow: 33300,
      confidence: 'medium'
    },
    {
      period: 'Next 90 Days',
      projectedInflow: 185000,
      projectedOutflow: 89000,
      netFlow: 96000,
      confidence: 'medium'
    }
  ];

  const getTotalBalance = () => {
    return bankAccounts.reduce((total, account) => total + account.balance, 0);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return Banknote;
      case 'escrow': return Building;
      default: return Banknote;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    const colors = {
      checking: 'bg-blue-100 text-blue-800',
      savings: 'bg-green-100 text-green-800',
      escrow: 'bg-purple-100 text-purple-800',
      'money-market': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors.checking;
  };

  const renderAccountOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <Banknote className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotalBalance().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bankAccounts.filter(acc => acc.isActive).length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Monthly Inflow</p>
                <p className="text-2xl font-bold text-gray-900">$67,800</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15.2% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Outflow</p>
                <p className="text-2xl font-bold text-gray-900">$34,500</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.7% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {bankAccounts.map((account) => {
          const Icon = getAccountTypeIcon(account.accountType);
          return (
            <Card key={account.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.accountName}</CardTitle>
                      <p className="text-sm text-gray-600">{account.bankName}</p>
                    </div>
                  </div>
                  {account.isPrimary && (
                    <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Account Number</span>
                    <span className="text-sm font-medium">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge className={getAccountTypeBadge(account.accountType)}>
                      {account.accountType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Balance</span>
                    <span className="font-bold text-lg">${account.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="text-sm font-medium text-green-600">
                      ${account.availableBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Reconciled</span>
                    <span className="text-sm">{account.lastReconciled}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAccount(account.id)}
                    >
                      Transactions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setShowReconciliation(true)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reconcile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-gray-600">
            {selectedAccount ? `Account: ${bankAccounts.find(acc => acc.id === selectedAccount)?.accountName}` : 'All Accounts'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedAccount || 'all'} onValueChange={(value) => setSelectedAccount(value === 'all' ? null : value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {bankAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.accountName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .filter(t => !selectedAccount || t.bankAccountId === selectedAccount)
                .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>${transaction.balance.toLocaleString()}</TableCell>
                  <TableCell>
                    {transaction.isReconciled ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Reconciled
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cash Flow Forecast</h3>
          <p className="text-sm text-gray-600">Projected cash inflows and outflows</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Forecast
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cashFlowForecast.map((forecast, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{forecast.period}</CardTitle>
              <Badge className={forecast.confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {forecast.confidence} confidence
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Projected Inflow</span>
                  <span className="font-medium text-green-600">
                    +${forecast.projectedInflow.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Projected Outflow</span>
                  <span className="font-medium text-red-600">
                    -${forecast.projectedOutflow.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Net Cash Flow</span>
                  <span className={`font-bold ${forecast.netFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {forecast.netFlow > 0 ? '+' : ''}${forecast.netFlow.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cash Flow Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Interactive cash flow chart</p>
              <p className="text-sm text-gray-400">Chart visualization coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReconciliation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Bank Reconciliation</h3>
          <p className="text-sm text-gray-600">Match bank statements with recorded transactions</p>
        </div>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Book Balance</span>
                <span className="font-medium">$89,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Statement Balance</span>
                <span className="font-medium">$89,350.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outstanding Deposits</span>
                <span className="font-medium text-green-600">+$1,200.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outstanding Checks</span>
                <span className="font-medium text-red-600">-$1,050.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Reconciled Balance</span>
                <span className="font-bold">$89,500.00</span>
              </div>
              <Badge className="bg-green-100 text-green-800 w-full justify-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Reconciled
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unreconciled Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.filter(t => !t.isReconciled).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Mark Reconciled
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Banking & Treasury</h2>
          <p className="text-gray-600">Manage bank accounts, cash flow, and reconciliation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Bank Statement
          </Button>
          <Button onClick={() => setShowAddAccount(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Account Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">{renderAccountOverview()}</TabsContent>
        <TabsContent value="transactions">{renderTransactions()}</TabsContent>
        <TabsContent value="cashflow">{renderCashFlow()}</TabsContent>
        <TabsContent value="reconciliation">{renderReconciliation()}</TabsContent>
      </Tabs>
    </div>
  );
};