import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { formatCurrency } from '../lib/currency';

// PHASE 5: Import foundation components ✅
import { MetricCard } from './ui/metric-card';
import { InfoPanel } from './ui/info-panel';
import {
  MonthlyBudget,
  createMonthlyBudget,
  updateActualSpending,
  getBudgetSummary,
  getBudgetComparison,
  getExpenseBreakdown,
  projectCashFlow,
  projectRevenue,
  getCashFlowHealth,
  calculateBreakEven,
  getFinancialSummary,
  saveBudgets,
  loadBudgets
} from '../lib/budgeting';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Edit,
  ArrowLeft,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface BudgetingDashboardProps {
  user: User;
  onBack: () => void;
}

export const BudgetingDashboard: React.FC<BudgetingDashboardProps> = ({ user, onBack }) => {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [editingBudget, setEditingBudget] = useState<MonthlyBudget | null>(null);
  const [showAddBudget, setShowAddBudget] = useState(false);

  // Load budgets on mount
  useEffect(() => {
    const loaded = loadBudgets();
    setBudgets(loaded);
  }, []);

  // Save budgets whenever they change
  useEffect(() => {
    if (budgets.length > 0) {
      saveBudgets(budgets);
    }
  }, [budgets]);

  // Calculate summaries
  const currentMonthSummary = useMemo(() => {
    return getBudgetSummary(budgets, selectedMonth);
  }, [budgets, selectedMonth]);

  const budgetComparison = useMemo(() => {
    return getBudgetComparison(budgets, 6);
  }, [budgets]);

  const expenseBreakdown = useMemo(() => {
    return getExpenseBreakdown(budgets, selectedMonth);
  }, [budgets, selectedMonth]);

  const cashFlowProjections = useMemo(() => {
    return projectCashFlow(6, 1000000); // Starting with PKR 1M
  }, []);

  const cashFlowHealth = useMemo(() => {
    return getCashFlowHealth(cashFlowProjections);
  }, [cashFlowProjections]);

  const revenueProjection = useMemo(() => {
    return projectRevenue(selectedMonth);
  }, [selectedMonth]);

  // Handle budget creation
  const handleAddBudget = (category: MonthlyBudget['category'], budgeted: number) => {
    const newBudget = createMonthlyBudget(selectedMonth, category, budgeted);
    setBudgets([...budgets, newBudget]);
    setShowAddBudget(false);
    toast.success('Budget added successfully');
  };

  // Handle budget update
  const handleUpdateBudget = (budget: MonthlyBudget, actual: number) => {
    const updated = updateActualSpending(budget, actual);
    setBudgets(budgets.map(b => (b.id === budget.id ? updated : b)));
    setEditingBudget(null);
    toast.success('Budget updated successfully');
  };

  // Chart colors
  const COLORS = ['#030213', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getHealthStatusColor = () => {
    if (cashFlowHealth.status === 'healthy') return 'text-green-600';
    if (cashFlowHealth.status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatusIcon = () => {
    if (cashFlowHealth.status === 'healthy') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (cashFlowHealth.status === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl text-gray-900">Budget & Cash Flow</h1>
            <p className="text-sm text-gray-600 mt-1">
              Financial planning and cash flow forecasting
            </p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = date.toISOString().slice(0, 7);
                return (
                  <SelectItem key={monthKey} value={monthKey}>
                    {formatMonth(monthKey)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Cash Flow Health Alert */}
        <Card className={
          cashFlowHealth.status === 'healthy' ? 'border-green-200 bg-green-50' :
          cashFlowHealth.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getHealthStatusIcon()}
              <div className="flex-1">
                <p className={`text-sm mb-1 ${getHealthStatusColor()}`}>
                  {cashFlowHealth.message}
                </p>
                <p className="text-xs text-gray-600">
                  {cashFlowHealth.recommendation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Month Budget</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">
                {formatCurrency(currentMonthSummary.totalBudgeted)}
              </p>
              <p className="text-xs text-gray-500">
                Planned spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Actual Spent</p>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">
                {formatCurrency(currentMonthSummary.totalActual)}
              </p>
              <p className="text-xs text-gray-500">
                {((currentMonthSummary.totalActual / currentMonthSummary.totalBudgeted) * 100).toFixed(0)}% utilized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Variance</p>
                {currentMonthSummary.overBudget ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className={`text-2xl mb-1 ${
                currentMonthSummary.overBudget ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(Math.abs(currentMonthSummary.totalVariance))}
              </p>
              <p className="text-xs text-gray-500">
                {currentMonthSummary.overBudget ? 'Over budget' : 'Under budget'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Projected Revenue</p>
                <Calculator className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl text-green-600 mb-1">
                {formatCurrency(revenueProjection.projectedCommissions)}
              </p>
              <p className="text-xs text-gray-500">
                {revenueProjection.expectedClosings} expected deals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Budget vs Actual Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget vs Actual (6 Months)</CardTitle>
                <CardDescription>Comparing planned vs actual spending</CardDescription>
              </CardHeader>
              <CardContent>
                {budgetComparison.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={budgetComparison}>
                      <defs>
                        <linearGradient id="colorBudgeted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        labelFormatter={formatMonth}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="budgeted"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorBudgeted)"
                        name="Budgeted"
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorActual)"
                        name="Actual"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <p>No budget data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expense Breakdown</CardTitle>
                  <CardDescription>Current month spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.values(expenseBreakdown.categories).some(v => v > 0) ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={Object.entries(expenseBreakdown.categories)
                            .filter(([_, value]) => value > 0)
                            .map(([category, value]) => ({
                              name: category.charAt(0).toUpperCase() + category.slice(1),
                              value
                            }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.keys(expenseBreakdown.categories).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <p>No expense data for this month</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cash Flow Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cash Flow Forecast</CardTitle>
                  <CardDescription>6-month projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={cashFlowProjections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        labelFormatter={formatMonth}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulativeCashFlow"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Cumulative Cash"
                        dot={{ fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base">Budget Categories</h3>
              <Button onClick={() => setShowAddBudget(true)} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </div>

            {/* Budget Categories */}
            <div className="grid grid-cols-1 gap-4">
              {currentMonthSummary.categories.map(budget => (
                <Card key={budget.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          budget.variance > 0 ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm text-gray-900 capitalize">{budget.category}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBudget(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Budgeted</p>
                        <p className="text-sm text-gray-900">{formatCurrency(budget.budgeted)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Actual</p>
                        <p className="text-sm text-gray-900">{formatCurrency(budget.actual)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Variance</p>
                        <p className={`text-sm ${
                          budget.variance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {budget.variance > 0 ? '+' : ''}
                          {formatCurrency(budget.variance)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budget.variance > 0 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (budget.actual / budget.budgeted) * 100)}%`
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Budget Modal */}
            {editingBudget && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base">Update Actual Spending</CardTitle>
                  <CardDescription>
                    Update actual amount spent for {editingBudget.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Actual Amount (PKR)</Label>
                      <Input
                        type="number"
                        defaultValue={editingBudget.actual}
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          handleUpdateBudget(editingBudget, value);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingBudget(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Budget Modal */}
            {showAddBudget && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-base">Add New Budget</CardTitle>
                  <CardDescription>
                    Set budget for a category in {formatMonth(selectedMonth)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const category = formData.get('category') as MonthlyBudget['category'];
                      const budgeted = parseFloat(formData.get('budgeted') as string) || 0;
                      handleAddBudget(category, budgeted);
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <Label>Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="salaries">Salaries</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Budgeted Amount (PKR)</Label>
                        <Input
                          type="number"
                          name="budgeted"
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Add Budget
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowAddBudget(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cash Flow Projection (6 Months)</CardTitle>
                <CardDescription>Expected revenue vs expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={cashFlowProjections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      labelFormatter={formatMonth}
                    />
                    <Legend />
                    <Bar dataKey="expectedRevenue" fill="#10b981" name="Revenue" />
                    <Bar dataKey="expectedExpenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="netCashFlow" fill="#4f46e5" name="Net Cash Flow" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Projections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Breakdown</CardTitle>
                <CardDescription>Detailed cash flow by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cashFlowProjections.map((projection, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-900">{formatMonth(projection.month)}</p>
                        <Badge variant="outline" className={
                          projection.confidence === 'high' ? 'bg-green-50 border-green-300 text-green-700' :
                          projection.confidence === 'medium' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                          'bg-red-50 border-red-300 text-red-700'
                        }>
                          {projection.confidence} confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Revenue</p>
                          <p className="text-sm text-green-600">
                            {formatCurrency(projection.expectedRevenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Expenses</p>
                          <p className="text-sm text-red-600">
                            {formatCurrency(projection.expectedExpenses)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Net Flow</p>
                          <p className={`text-sm ${
                            projection.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(projection.netCashFlow)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Cumulative</p>
                          <p className={`text-sm ${
                            projection.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(projection.cumulativeCashFlow)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Projection</CardTitle>
                <CardDescription>Expected commission for {formatMonth(selectedMonth)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Projected Commission</p>
                    <p className="text-3xl text-green-600 mb-1">
                      {formatCurrency(revenueProjection.projectedCommissions)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {revenueProjection.expectedClosings} expected closings
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Average Deal Size</p>
                    <p className="text-3xl text-blue-600 mb-1">
                      {formatCurrency(revenueProjection.averageDealSize)}
                    </p>
                    <p className="text-xs text-gray-500">Per property</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Revenue Sources</p>
                    <p className="text-3xl text-purple-600 mb-1">3</p>
                    <p className="text-xs text-gray-500">Active, Pipeline, Prospects</p>
                  </div>
                </div>

                {/* Revenue Sources Breakdown */}
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-900">Active Listings</p>
                      <p className="text-sm text-green-600">
                        {formatCurrency(revenueProjection.sources.activeListings)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(revenueProjection.sources.activeListings / revenueProjection.projectedCommissions) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-900">Pipeline Deals</p>
                      <p className="text-sm text-blue-600">
                        {formatCurrency(revenueProjection.sources.pipelineDeals)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(revenueProjection.sources.pipelineDeals / revenueProjection.projectedCommissions) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-900">New Prospects</p>
                      <p className="text-sm text-purple-600">
                        {formatCurrency(revenueProjection.sources.newProspects)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(revenueProjection.sources.newProspects / revenueProjection.projectedCommissions) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
