/**
 * Investor Shares Card
 * Displays ownership breakdown for investor-owned properties
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Property } from '../../types';
import { getInvestorById } from '../../lib/investors';
import { formatPKR } from '../../lib/currency';
import { Users, Percent, TrendingUp, Eye } from 'lucide-react';

interface InvestorSharesCardProps {
  property: Property;
  onNavigateToInvestor?: (investorId: string) => void;
}

export function InvestorSharesCard({ property, onNavigateToInvestor }: InvestorSharesCardProps) {
  if (!property.investorShares || property.investorShares.length === 0) {
    return null;
  }

  const totalPercentage = property.investorShares.reduce(
    (sum, share) => sum + (share.sharePercentage || 0),
    0
  );

  const getInvestorName = (investorId: string) => {
    const investor = getInvestorById(investorId);
    return investor?.name || investorId;
  };

  const calculateInvestmentAmount = (percentage: number) => {
    // Use investmentAmount if available, otherwise calculate from percentage
    if (percentage === 0) return 0;
    const propertyPrice = property.price || 0;
    return (propertyPrice * percentage) / 100;
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-blue-600" />
          Investor Ownership
          <Badge variant="secondary" className="ml-auto">
            {property.investorShares.length} {property.investorShares.length === 1 ? 'Investor' : 'Investors'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Ownership Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Ownership</span>
            <span className="font-medium">{totalPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={totalPercentage} className="h-2" />
          {totalPercentage !== 100 && (
            <p className="text-xs text-amber-600">
              Warning: Ownership percentages total {totalPercentage.toFixed(2)}% (should be 100%)
            </p>
          )}
        </div>

        <Separator />

        {/* Investor List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Ownership Breakdown</h4>
          {property.investorShares.map((share, index) => {
            const investorName = getInvestorName(share.investorId);
            const sharePercentage = share.sharePercentage || 0;
            const investmentAmount = share.investmentAmount || calculateInvestmentAmount(sharePercentage);

            return (
              <div
                key={share.investorId || index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{investorName}</span>
                    <Badge variant="outline" className="text-xs">
                      <Percent className="w-3 h-3 mr-1" />
                      {sharePercentage.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Investment: {formatPKR(investmentAmount)}
                  </div>
                </div>
                {onNavigateToInvestor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    onClick={() => onNavigateToInvestor(share.investorId)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <Separator />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-2 bg-white rounded border border-gray-200">
            <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
            <p className="font-medium text-sm">
              {formatPKR(
                property.investorShares.reduce(
                  (sum, share) =>
                    sum + (share.investmentAmount || calculateInvestmentAmount(share.sharePercentage || 0)),
                  0
                )
              )}
            </p>
          </div>
          <div className="p-2 bg-white rounded border border-gray-200">
            <p className="text-xs text-muted-foreground mb-1">Ownership</p>
            <p className="font-medium text-sm">{totalPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
