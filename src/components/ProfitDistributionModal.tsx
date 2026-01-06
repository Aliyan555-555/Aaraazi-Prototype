import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Property, Transaction, User, ProfitDistribution } from '../types';
import { getPropertyInvestmentsByProperty } from '../lib/investors';
import { saveProfitDistribution } from '../lib/investors';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Users,
  Briefcase
} from 'lucide-react';

interface ProfitDistributionModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
  transaction: Transaction;
  user: User;
}

export const ProfitDistributionModal: React.FC<ProfitDistributionModalProps> = ({
  open,
  onClose,
  property,
  transaction,
  user
}) => {
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate financial summary
  const finalSalePrice = useMemo(() => {
    return property.finalSalePrice || transaction.acceptedOfferAmount || property.price;
  }, [property, transaction]);

  const totalCostBasis = useMemo(() => {
    return property.purchaseDetails?.totalCostBasis || 0;
  }, [property]);

  const totalNetProfit = useMemo(() => {
    return finalSalePrice - totalCostBasis;
  }, [finalSalePrice, totalCostBasis]);

  // Get property investments
  const propertyInvestments = useMemo(() => {
    return getPropertyInvestmentsByProperty(property.id);
  }, [property.id]);

  // Calculate distribution breakdown
  const distributionBreakdown = useMemo(() => {
    const distributions: ProfitDistribution['distributions'] = [];

    // Add investor distributions
    propertyInvestments.forEach(investment => {
      const profitAmount = totalNetProfit * (investment.profitSharePercentage / 100);
      distributions.push({
        recipientId: investment.investorId,
        recipientName: investment.investorName,
        recipientType: 'investor',
        profitSharePercentage: investment.profitSharePercentage,
        profitAmount: profitAmount,
        status: 'pending'
      });
    });

    // Calculate agency share (remaining percentage)
    const investorTotalPercentage = propertyInvestments.reduce(
      (sum, inv) => sum + inv.profitSharePercentage,
      0
    );
    const agencyPercentage = 100 - investorTotalPercentage;

    if (agencyPercentage > 0) {
      const agencyProfitAmount = totalNetProfit * (agencyPercentage / 100);
      distributions.push({
        recipientId: 'agency',
        recipientName: 'Agency',
        recipientType: 'agency',
        profitSharePercentage: agencyPercentage,
        profitAmount: agencyProfitAmount,
        status: 'pending'
      });
    }

    return distributions;
  }, [propertyInvestments, totalNetProfit]);

  // Calculate totals for validation
  const totalPercentage = useMemo(() => {
    return distributionBreakdown.reduce((sum, d) => sum + d.profitSharePercentage, 0);
  }, [distributionBreakdown]);

  const totalDistributed = useMemo(() => {
    return distributionBreakdown.reduce((sum, d) => sum + d.profitAmount, 0);
  }, [distributionBreakdown]);

  const handleConfirmDistribution = () => {
    setIsProcessing(true);

    const profitDistribution: ProfitDistribution = {
      id: `profit-dist-${property.id}-${Date.now()}`,
      propertyId: property.id,
      transactionId: transaction.id,
      finalSalePrice,
      totalCostBasis,
      totalNetProfit,
      distributions: distributionBreakdown,
      status: 'confirmed',
      calculatedDate: new Date().toISOString(),
      confirmedDate: new Date().toISOString(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || undefined
    };

    try {
      saveProfitDistribution(profitDistribution);
      toast.success('Profit distribution recorded successfully');
      onClose();
    } catch (error) {
      console.error('Error saving profit distribution:', error);
      toast.error('Failed to record profit distribution');
    } finally {
      setIsProcessing(false);
    }
  };

  const isProfitPositive = totalNetProfit > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculate & Distribute Profits
          </DialogTitle>
          <DialogDescription>
            Review and confirm profit distribution for this sold property
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property Information */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{property.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{property.address}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-gray-600">
                    Buyer: <span className="text-gray-900">{transaction.buyerName}</span>
                  </span>
                  <Badge variant="outline" className="bg-white capitalize">
                    {property.acquisitionType?.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Final Sale Price</p>
                <p className="text-3xl text-blue-900">{formatPKR(finalSalePrice)}</p>
              </div>
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700 mb-1">Total Cost Basis</p>
                <p className="text-3xl text-orange-900">{formatPKR(totalCostBasis)}</p>
                {property.purchaseDetails && (
                  <div className="mt-2 pt-2 border-t border-orange-200">
                    <div className="flex justify-between text-xs text-orange-700">
                      <span>Purchase Price:</span>
                      <span>{formatPKR(property.purchaseDetails.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-orange-700 mt-1">
                      <span>Associated Costs:</span>
                      <span>{formatPKR(property.purchaseDetails.associatedCosts)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`p-4 rounded-lg border-4 ${
                  isProfitPositive
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300'
                }`}
              >
                <p className={`text-sm mb-1 ${isProfitPositive ? 'text-green-700' : 'text-red-700'}`}>
                  Total Net Profit
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-4xl ${isProfitPositive ? 'text-green-900' : 'text-red-900'}`}>
                    {formatPKR(Math.abs(totalNetProfit))}
                  </p>
                  {isProfitPositive ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                {finalSalePrice > 0 && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700">Profit Margin:</span>
                      <Badge
                        variant="outline"
                        className={`${isProfitPositive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
                      >
                        {((totalNetProfit / finalSalePrice) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profit Warning for Negative Profit */}
          {!isProfitPositive && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900">Loss Detected</p>
                <p className="text-xs text-red-700 mt-1">
                  This property was sold at a loss. Distribution will reflect negative returns.
                </p>
              </div>
            </div>
          )}

          {/* Profit Distribution Breakdown */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Profit Distribution Breakdown
            </h3>

            {distributionBreakdown.length === 0 ? (
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No profit distribution configured</p>
                <p className="text-xs text-gray-500 mt-1">
                  Add investors to this property to set up profit sharing
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-gray-900">Recipient</th>
                      <th className="text-left p-3 text-gray-900">Type</th>
                      <th className="text-right p-3 text-gray-900">Profit Share %</th>
                      <th className="text-right p-3 text-gray-900">Amount Due</th>
                      <th className="text-center p-3 text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionBreakdown.map((dist, index) => (
                      <tr
                        key={index}
                        className={`border-b last:border-b-0 ${
                          dist.recipientType === 'agency' ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {dist.recipientType === 'agency' ? (
                              <Briefcase className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Users className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="text-gray-900">{dist.recipientName}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              dist.recipientType === 'agency'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }
                          >
                            {dist.recipientType}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-gray-900">{dist.profitSharePercentage.toFixed(1)}%</span>
                        </td>
                        <td className="p-3 text-right">
                          <p
                            className={`${
                              isProfitPositive ? 'text-green-700' : 'text-red-700'
                            }`}
                          >
                            {formatPKR(Math.abs(dist.profitAmount))}
                          </p>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-100 border-t-2">
                      <td className="p-3" colSpan={2}>
                        <span>Total</span>
                      </td>
                      <td className="p-3 text-right">
                        <span>{totalPercentage.toFixed(1)}%</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className={isProfitPositive ? 'text-green-700' : 'text-red-700'}>
                          {formatPKR(Math.abs(totalDistributed))}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {Math.abs(totalPercentage - 100) < 0.01 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Validation Messages */}
            {Math.abs(totalPercentage - 100) >= 0.01 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  Warning: Total profit share is {totalPercentage.toFixed(1)}%. It should equal 100%.
                </p>
              </div>
            )}

            {Math.abs(totalDistributed - totalNetProfit) >= 0.01 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Note: Rounding differences of {formatPKR(Math.abs(totalDistributed - totalNetProfit))} detected
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Distribution Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this profit distribution..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDistribution}
            disabled={isProcessing || distributionBreakdown.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Recording...' : 'Confirm & Record Distribution'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
