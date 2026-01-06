import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Property, User, Transaction, ScheduledPayment, PaymentTransaction, PaymentPlan, TransactionTask, SellerPayout } from '../types';
import { formatCurrency, formatPKR } from '../lib/currency';
import { getTransactionTasks, toggleTaskCompletion, getTaskProgress } from '../lib/transactions';
import { getPaymentTransactions } from '../lib/payments';
import { toast } from 'sonner';
import {
  Wallet,
  Plus,
  Receipt,
  DollarSign,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Building2,
  Calculator,
  Banknote
} from 'lucide-react';

interface TransactionWorkspaceProps {
  property: Property;
  user: User;
  transaction: Transaction | null;
  scheduledPayments: ScheduledPayment[];
  paymentPlan: PaymentPlan | null;
  paymentSummary: {
    totalAmount: number;
    totalPaid: number;
    amountRemaining: number;
    percentagePaid: number;
  };
  transactionTasks: TransactionTask[];
  isLoadingPayments: boolean;
  sellerPayout: SellerPayout | null;
  onSetupPaymentPlan: () => void;
  onLogPayment: (payment: ScheduledPayment) => void;
  onViewReceipt: (payment: ScheduledPayment, transaction: PaymentTransaction) => void;
  onManageSellerPayout: () => void;
  onRefreshTasks: () => void;
  onDistributeProfits?: () => void;
  onCreateCommission?: () => void;
}

export const TransactionWorkspace: React.FC<TransactionWorkspaceProps> = ({
  property,
  user,
  transaction,
  scheduledPayments,
  paymentPlan,
  paymentSummary,
  transactionTasks,
  isLoadingPayments,
  sellerPayout,
  onSetupPaymentPlan,
  onLogPayment,
  onViewReceipt,
  onManageSellerPayout,
  onRefreshTasks,
  onDistributeProfits,
  onCreateCommission
}) => {
  // Log scheduledPayments for debugging
  React.useEffect(() => {
    console.log('TransactionWorkspace received scheduledPayments:', scheduledPayments.map(p => ({
      id: p.id,
      title: p.title,
      amountDue: p.amountDue,
      amountPaid: p.amountPaid,
      status: p.status
    })));
  }, [scheduledPayments]);
  
  // ============================================================================
  // CONTEXT-AWARE TERMINOLOGY
  // ============================================================================
  // Determine appropriate labels based on listing type
  const terminology = React.useMemo(() => {
    switch (property.listingType) {
      case 'for-sale':
        return {
          party: 'Buyer',
          payee: 'Seller',
          amount: 'Sale Price',
          payment: 'Payment',
          collection: 'Collection',
          payout: 'Seller Payout',
          managePayoutButton: 'Manage Payout to Seller'
        };
      case 'for-rent':
        return {
          party: 'Tenant',
          payee: 'Landlord',
          amount: 'Monthly Rent',
          payment: 'Rent Payment',
          collection: 'Rent Collection',
          payout: 'Landlord Payout',
          managePayoutButton: 'Manage Payout to Landlord'
        };
      case 'wanted':
        return {
          party: 'Seller',
          payee: 'Agency',
          amount: 'Purchase Price',
          payment: 'Purchase Payment',
          collection: 'Payment to Seller',
          payout: 'Agency Purchase Record',
          managePayoutButton: 'Manage Purchase Payment'
        };
      default:
        return {
          party: 'Buyer',
          payee: 'Seller',
          amount: 'Sale Price',
          payment: 'Payment',
          collection: 'Collection',
          payout: 'Seller Payout',
          managePayoutButton: 'Manage Payout to Seller'
        };
    }
  }, [property.listingType]);
  
  // Determine if this is a standard listing or agency-owned property
  const isStandardListing = !property.acquisitionType || property.acquisitionType === 'client-listing';
  const isAgencyOwned = property.acquisitionType === 'agency-purchase' || property.acquisitionType === 'investor-purchase';

  // Calculate profitability metrics for agency-owned properties
  const finalSalePrice = property.finalSalePrice || transaction?.acceptedOfferAmount || property.price;
  const totalCostBasis = property.purchaseDetails?.totalCostBasis || 0;
  const estimatedNetProfit = finalSalePrice - totalCostBasis;
  const profitMargin = totalCostBasis > 0 ? ((estimatedNetProfit / finalSalePrice) * 100) : 0;

  // Render Standard Listing Transaction Workspace
  if (isStandardListing) {
    return (
      <div className="space-y-6">
        {/* Financial Summary Header with Seller Payout Button */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  {terminology.payment} {terminology.collection} & {terminology.payout}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Track {terminology.party.toLowerCase()} {terminology.payment.toLowerCase()}s and manage payout to property {terminology.payee.toLowerCase()}
                </p>
              </div>
              <div className="flex gap-2">
                {onCreateCommission && (
                  <Button 
                    onClick={onCreateCommission}
                    variant="outline"
                    size="lg"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Commission
                  </Button>
                )}
                <Button 
                  onClick={onManageSellerPayout}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  {terminology.managePayoutButton}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-700">Total {terminology.amount} to Collect</p>
                </div>
                <p className="text-2xl text-blue-900 font-medium">
                  {formatPKR(transaction?.acceptedOfferAmount || property.price || property.monthlyRent || 0)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Agreed {terminology.amount.toLowerCase()} from {terminology.party.toLowerCase()}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700">Amount Collected</p>
                </div>
                <p className="text-2xl text-green-900 font-medium">
                  {formatPKR(paymentSummary.totalPaid)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {paymentSummary.percentagePaid.toFixed(1)}% collected from {terminology.party.toLowerCase()}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-orange-700">Balance Due to {terminology.payee}</p>
                </div>
                <p className="text-2xl text-orange-900 font-medium">
                  {formatPKR(
                    paymentSummary.totalPaid - 
                    ((transaction?.acceptedOfferAmount || property.price || property.monthlyRent || 0) * (property.commissionRate || 3) / 100)
                  )}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  After {property.commissionRate || 3}% commission deduction
                </p>
              </div>
            </div>

            {/* Seller Payout Status */}
            {sellerPayout && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{terminology.payout} Completed</p>
                      <p className="text-sm text-green-700">
                        {formatPKR(sellerPayout.netPayoutToSeller)} paid on {new Date(sellerPayout.payoutDate).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onManageSellerPayout}>
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Plan Tracker */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Buyer Payment Plan Tracker
              </CardTitle>
              {!paymentPlan && transaction && (
                <Button onClick={onSetupPaymentPlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Up Payment Plan
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingPayments ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm">Loading payment data...</p>
              </div>
            ) : !paymentPlan ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm mb-4">No payment plan set up yet</p>
                <Button onClick={onSetupPaymentPlan}>Set Up Payment Plan</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-900">Collection Progress</p>
                    <span className="text-sm text-gray-600">
                      {paymentSummary.percentagePaid.toFixed(1)}% Collected
                    </span>
                  </div>
                  <Progress value={paymentSummary.percentagePaid} className="h-3" />
                </div>

                {/* Payment Schedule Table */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3">Payment Schedule</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 text-gray-900">Installment Title</th>
                          <th className="text-left p-3 text-gray-900">Due Date</th>
                          <th className="text-left p-3 text-gray-900">Amount Due</th>
                          <th className="text-left p-3 text-gray-900">Amount Paid</th>
                          <th className="text-left p-3 text-gray-900">Status</th>
                          <th className="text-right p-3 text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledPayments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              No payment schedule found
                            </td>
                          </tr>
                        ) : (
                          scheduledPayments.map((payment) => (
                            <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="p-3 text-gray-900">{payment.title}</td>
                              <td className="p-3 text-gray-600">
                                {new Date(payment.dueDate).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="p-3 text-gray-900">{formatPKR(payment.amountDue)}</td>
                              <td className="p-3 text-gray-900">{formatPKR(payment.amountPaid)}</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    payment.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                    payment.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                                    payment.status === 'partially-paid' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-gray-50 text-gray-700 border-gray-200'
                                  }
                                >
                                  {payment.status === 'paid' ? 'Paid' :
                                   payment.status === 'overdue' ? 'Overdue' :
                                   payment.status === 'partially-paid' ? 'Partial' :
                                   'Pending'}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                {payment.status === 'paid' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const transactions = getPaymentTransactions(property.id, payment.id);
                                      if (transactions.length > 0) {
                                        onViewReceipt(payment, transactions[0]);
                                      }
                                    }}
                                  >
                                    <Receipt className="h-4 w-4 mr-1" />
                                    View Receipt
                                  </Button>
                                ) : (
                                  <Button size="sm" onClick={() => onLogPayment(payment)}>
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Log Payment
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestone Checklist */}
        <MilestoneChecklist 
          property={property}
          user={user}
          transaction={transaction}
          transactionTasks={transactionTasks}
          onRefreshTasks={onRefreshTasks}
        />
      </div>
    );
  }

  // Render Agency/Investor-Owned Property Profitability Calculator
  if (isAgencyOwned) {
    return (
      <div className="space-y-6">
        {/* Profitability Header */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              Property Profitability Calculator
            </CardTitle>
            <p className="text-sm text-gray-600">
              Track the profit performance of this {property.acquisitionType === 'investor-purchase' ? 'investor-funded' : 'agency-owned'} property
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Final Sale Price */}
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <p className="font-medium text-blue-900">Final Sale Price</p>
                </div>
                <p className="text-3xl text-blue-900 font-medium mb-2">
                  {formatPKR(finalSalePrice)}
                </p>
                <p className="text-sm text-blue-600">
                  Agreed sale amount
                </p>
              </div>

              {/* Total Cost Basis */}
              <div className="p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="h-6 w-6 text-orange-600" />
                  <p className="font-medium text-orange-900">Total Cost Basis</p>
                </div>
                <p className="text-3xl text-orange-900 font-medium mb-2">
                  {formatPKR(totalCostBasis)}
                </p>
                <p className="text-sm text-orange-600">
                  Purchase price + associated costs
                </p>
                {property.purchaseDetails && (
                  <div className="mt-3 pt-3 border-t border-orange-200 text-xs text-orange-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Purchase Price:</span>
                      <span className="font-medium">{formatPKR(property.purchaseDetails.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Associated Costs:</span>
                      <span className="font-medium">{formatPKR(property.purchaseDetails.associatedCosts)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimated Net Profit - HIGHLIGHTED */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-4 border-green-300 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-7 w-7 text-green-600" />
                  <p className="font-medium text-green-900 text-lg">Estimated Net Profit</p>
                </div>
                <p className={`text-4xl font-medium mb-2 ${
                  estimatedNetProfit >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatPKR(estimatedNetProfit)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-green-700">
                    {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(2)}% Margin
                  </p>
                  {estimatedNetProfit >= 0 && (
                    <Badge className="bg-green-600 text-white">
                      Profitable
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Transaction Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Purchase Date</p>
                  <p className="font-medium text-gray-900">
                    {property.purchaseDetails?.purchaseDate ? 
                      new Date(property.purchaseDetails.purchaseDate).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Sale Date</p>
                  <p className="font-medium text-gray-900">
                    {transaction?.acceptedDate ?
                      new Date(transaction.acceptedDate).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Acquisition Type</p>
                  <p className="font-medium text-gray-900">
                    {property.acquisitionType === 'agency-purchase' ? 'Agency Purchase' : 'Investor-Funded'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Buyer</p>
                  <p className="font-medium text-gray-900">
                    {transaction?.buyerName || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Investor Information (if applicable) */}
            {property.acquisitionType === 'investor-purchase' && property.purchaseDetails?.assignedInvestors && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Assigned Investors</h4>
                <p className="text-sm text-purple-700">
                  {property.purchaseDetails.assignedInvestors.length} investor(s) involved in this property
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Profit distribution will be calculated based on investor shares
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribute Profits Button - Only for Investor-Funded Sold Properties */}
        {property.acquisitionType === 'investor-purchase' && property.status === 'sold' && onDistributeProfits && (
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Property Sold - Distribute Profits</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Calculate and record profit distribution to investors and agency
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={onDistributeProfits}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate & Distribute Profits
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Collection (if buyer is paying in installments) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Buyer Payment Collection
              </CardTitle>
              <div className="flex gap-2">
                {onCreateCommission && (
                  <Button 
                    onClick={onCreateCommission}
                    variant="outline"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Commission
                  </Button>
                )}
                {!paymentPlan && transaction && (
                  <Button onClick={onSetupPaymentPlan}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Up Payment Plan
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingPayments ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm">Loading payment data...</p>
              </div>
            ) : !paymentPlan ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm mb-4">No payment plan set up yet</p>
                <Button onClick={onSetupPaymentPlan}>Set Up Payment Plan</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-900">Collection Progress</p>
                    <span className="text-sm text-gray-600">
                      {paymentSummary.percentagePaid.toFixed(1)}% Collected
                    </span>
                  </div>
                  <Progress value={paymentSummary.percentagePaid} className="h-3" />
                </div>

                {/* Payment Schedule Table */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3">Payment Schedule</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 text-gray-900">Installment Title</th>
                          <th className="text-left p-3 text-gray-900">Due Date</th>
                          <th className="text-left p-3 text-gray-900">Amount Due</th>
                          <th className="text-left p-3 text-gray-900">Amount Paid</th>
                          <th className="text-left p-3 text-gray-900">Status</th>
                          <th className="text-right p-3 text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledPayments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              No payment schedule found
                            </td>
                          </tr>
                        ) : (
                          scheduledPayments.map((payment) => (
                            <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="p-3 text-gray-900">{payment.title}</td>
                              <td className="p-3 text-gray-600">
                                {new Date(payment.dueDate).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="p-3 text-gray-900">{formatPKR(payment.amountDue)}</td>
                              <td className="p-3 text-gray-900">{formatPKR(payment.amountPaid)}</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    payment.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                    payment.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                                    payment.status === 'partially-paid' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-gray-50 text-gray-700 border-gray-200'
                                  }
                                >
                                  {payment.status === 'paid' ? 'Paid' :
                                   payment.status === 'overdue' ? 'Overdue' :
                                   payment.status === 'partially-paid' ? 'Partial' :
                                   'Pending'}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                {payment.status === 'paid' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const transactions = getPaymentTransactions(property.id, payment.id);
                                      if (transactions.length > 0) {
                                        onViewReceipt(payment, transactions[0]);
                                      }
                                    }}
                                  >
                                    <Receipt className="h-4 w-4 mr-1" />
                                    View Receipt
                                  </Button>
                                ) : (
                                  <Button size="sm" onClick={() => onLogPayment(payment)}>
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Log Payment
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestone Checklist */}
        <MilestoneChecklist 
          property={property}
          user={user}
          transaction={transaction}
          transactionTasks={transactionTasks}
          onRefreshTasks={onRefreshTasks}
        />
      </div>
    );
  }

  return null;
};

// Milestone Checklist Component (shared between both views)
interface MilestoneChecklistProps {
  property: Property;
  user: User;
  transaction: Transaction | null;
  transactionTasks: TransactionTask[];
  onRefreshTasks: () => void;
}

const MilestoneChecklist: React.FC<MilestoneChecklistProps> = ({
  property,
  user,
  transaction,
  transactionTasks,
  onRefreshTasks
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          {/* Header Section */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b">
            <div>
              <p className="text-xs text-gray-600 mb-1">Property</p>
              <p className="text-sm text-gray-900">{property.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Buyer Name</p>
              <p className="text-sm text-gray-900">{transaction?.buyerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Accepted Offer Amount</p>
              <p className="text-sm text-gray-900">
                {transaction?.acceptedOfferAmount ? formatPKR(transaction.acceptedOfferAmount) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-900">Milestone Progress</h3>
              <span className="text-xs text-gray-600">
                {getTaskProgress(property.id).completed} of {getTaskProgress(property.id).total} Milestones Complete
              </span>
            </div>
            <Progress value={getTaskProgress(property.id).percentage} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {getTaskProgress(property.id).percentage}% Complete
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm text-gray-900 mb-3">Milestone Checklist</h4>
          
          {transactionTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileCheck className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No tasks found. Tasks will be created automatically.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactionTasks.map((task) => {
                const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();
                
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      task.isCompleted 
                        ? 'bg-gray-50 border-gray-200' 
                        : isOverdue
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() => {
                        toggleTaskCompletion(task.id, user.id);
                        onRefreshTasks();
                        toast.success(
                          task.isCompleted 
                            ? 'Task marked as incomplete' 
                            : 'Task completed!'
                        );
                      }}
                      className="mt-0.5"
                    />

                    {/* Task Info */}
                    <div className="flex-1">
                      <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      <span className={isOverdue && !task.isCompleted ? 'text-red-600' : 'text-gray-600'}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        task.status === 'completed'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : task.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : isOverdue
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {isOverdue && !task.isCompleted && <AlertCircle className="h-3 w-3 mr-1" />}
                      {task.isCompleted ? 'Completed' : isOverdue ? 'Overdue' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>

                    {/* Document Icon */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        toast.info('Document management coming soon');
                      }}
                    >
                      <FileText className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};