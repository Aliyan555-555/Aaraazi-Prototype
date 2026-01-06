/**
 * Match Review Modal - V3.0
 * Detailed modal to review internal matches and take action
 * Shows sell cycle, purchase cycle(s), and potential deals
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Property, SellCycle, PurchaseCycle, User } from '../types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Calculator,
  FileText,
  CheckCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { getSellCycleById } from '../lib/sellCycle';
import { getPurchaseCycleById, getPurchaseCyclesByProperty } from '../lib/purchaseCycle';
import { getPropertyById } from '../lib/data';
import { formatPKR } from '../lib/currency';
import { formatPropertyAddress } from '../lib/utils';
import { toast } from 'sonner';
import { DualRepresentationWarning } from './DualRepresentationWarning';

interface MatchReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: any; // From detectInternalMatches
  user: User;
  onFacilitateDeal?: () => void;
}

export function MatchReviewModal({
  isOpen,
  onClose,
  matchData,
  user,
  onFacilitateDeal,
}: MatchReviewModalProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [sellCycle, setSellCycle] = useState<SellCycle | null>(null);
  const [purchaseCycles, setPurchaseCycles] = useState<PurchaseCycle[]>([]);
  const [selectedPurchaseCycle, setSelectedPurchaseCycle] = useState<PurchaseCycle | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Deal proposal state
  const [proposedPrice, setProposedPrice] = useState('');
  const [dealNotes, setDealNotes] = useState('');

  // Load data
  useEffect(() => {
    if (!matchData || !isOpen) return;

    const prop = getPropertyById(matchData.propertyId);
    const sell = getSellCycleById(matchData.sellCycleId);
    const purchases = getPurchaseCyclesByProperty(matchData.propertyId);

    setProperty(prop || null);
    setSellCycle(sell || null);
    setPurchaseCycles(purchases);
    
    if (purchases.length > 0) {
      setSelectedPurchaseCycle(purchases[0]);
      setProposedPrice(purchases[0].offerAmount.toString());
    }
  }, [matchData, isOpen]);

  if (!matchData) return null;

  // Calculate potential commission
  const calculateCommission = (price: number) => {
    if (!sellCycle) return 0;
    
    const sellCommission = sellCycle.commissionType === 'percentage'
      ? (price * sellCycle.commissionRate) / 100
      : sellCycle.commissionRate;

    // Add purchase commission if client type
    let purchaseCommission = 0;
    if (selectedPurchaseCycle && selectedPurchaseCycle.purchaserType === 'client') {
      purchaseCommission = selectedPurchaseCycle.commissionType === 'percentage'
        ? (price * (selectedPurchaseCycle.commissionRate || 0)) / 100
        : (selectedPurchaseCycle.commissionRate || 0);
    }

    return sellCommission + purchaseCommission;
  };

  const handleProposeDeal = () => {
    if (!proposedPrice || parseFloat(proposedPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    // In real implementation, this would create a formal deal proposal
    toast.success('Deal proposal created! Both parties will be notified.');
    
    if (onFacilitateDeal) {
      onFacilitateDeal();
    }
    
    onClose();
  };

  const getGapColor = () => {
    const gap = matchData.gap;
    const avgPrice = (matchData.sellAskingPrice + matchData.highestPurchaseOffer) / 2;
    const gapPercentage = (gap / avgPrice) * 100;
    
    if (gapPercentage <= 10) return 'text-green-600';
    if (gapPercentage <= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Internal Match Review
          </DialogTitle>
          <DialogDescription>
            {property?.address || 'Loading...'}
          </DialogDescription>
        </DialogHeader>

        {/* Dual Rep Warning */}
        {matchData.isDualRepresentation && (
          <DualRepresentationWarning
            agentName={matchData.agentName}
            propertyAddress={property?.address || 'Unknown'}
            sellCycleId={matchData.sellCycleId}
            purchaseCycleId={matchData.purchaseCycleIds[0]}
            severity="warning"
            showActions={false}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sell">Sell Side</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Side</TabsTrigger>
            <TabsTrigger value="proposal">Deal Proposal</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Asking Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPKR(matchData.sellAskingPrice)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    Highest Offer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPKR(matchData.highestPurchaseOffer)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-purple-600" />
                    Gap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${getGapColor()}`}>
                    {formatPKR(matchData.gap)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Potential Revenue */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Potential Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-700">
                      {formatPKR(matchData.potentialRevenue)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Combined commission from both sides
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            {property && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{formatPropertyAddress(property.address)}</p>
                  </div>
                  {property.propertyType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{property.propertyType}</p>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Match Quality Indicator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gap as % of asking price</span>
                  <Badge>
                    {((matchData.gap / matchData.sellAskingPrice) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Purchase Cycles</span>
                  <Badge>{purchaseCycles.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dual Representation</span>
                  <Badge variant={matchData.isDualRepresentation ? 'destructive' : 'secondary'}>
                    {matchData.isDualRepresentation ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sell Side Tab */}
          <TabsContent value="sell" className="space-y-6">
            {sellCycle && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Seller Name</p>
                      <p className="font-medium">{sellCycle.sellerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seller Type</p>
                      <p className="font-medium capitalize">{sellCycle.sellerType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Agent</p>
                      <p className="font-medium">{sellCycle.agentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge>{sellCycle.status}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Commission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Asking Price</p>
                        <p className="text-xl font-bold">{formatPKR(sellCycle.askingPrice)}</p>
                      </div>
                      {sellCycle.minAcceptablePrice && (
                        <div>
                          <p className="text-sm text-muted-foreground">Minimum Acceptable</p>
                          <p className="text-xl font-bold">{formatPKR(sellCycle.minAcceptablePrice)}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Commission</p>
                      <p className="font-medium">
                        {sellCycle.commissionType === 'percentage'
                          ? `${sellCycle.commissionRate}%`
                          : formatPKR(sellCycle.commissionRate)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {sellCycle.sellerMotivation && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Seller Motivation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{sellCycle.sellerMotivation}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Purchase Side Tab */}
          <TabsContent value="purchase" className="space-y-6">
            {/* Purchase Cycle Selector */}
            {purchaseCycles.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Purchase Cycle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {purchaseCycles.map(pc => (
                    <button
                      key={pc.id}
                      onClick={() => setSelectedPurchaseCycle(pc)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedPurchaseCycle?.id === pc.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{pc.purchaserName}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {pc.purchaserType} purchase
                          </p>
                        </div>
                        <p className="font-bold text-blue-600">
                          {formatPKR(pc.offerAmount)}
                        </p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Selected Purchase Cycle Details */}
            {selectedPurchaseCycle && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Purchaser Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purchaser Name</p>
                      <p className="font-medium">{selectedPurchaseCycle.purchaserName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchaser Type</p>
                      <Badge className="capitalize">{selectedPurchaseCycle.purchaserType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Agent</p>
                      <p className="font-medium">{selectedPurchaseCycle.agentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge>{selectedPurchaseCycle.status}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Offer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Offer Amount</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatPKR(selectedPurchaseCycle.offerAmount)}
                        </p>
                      </div>
                      {selectedPurchaseCycle.financingType && (
                        <div>
                          <p className="text-sm text-muted-foreground">Financing</p>
                          <p className="font-medium capitalize">{selectedPurchaseCycle.financingType}</p>
                        </div>
                      )}
                    </div>

                    {/* Type-specific details */}
                    {selectedPurchaseCycle.purchaserType === 'client' && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Commission</p>
                        <p className="font-medium">
                          {selectedPurchaseCycle.commissionType === 'percentage'
                            ? `${selectedPurchaseCycle.commissionRate}%`
                            : formatPKR(selectedPurchaseCycle.commissionRate || 0)}
                        </p>
                      </div>
                    )}

                    {selectedPurchaseCycle.purchaserType === 'investor' && selectedPurchaseCycle.facilitationFee && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Facilitation Fee</p>
                        <p className="font-medium text-green-600">
                          {formatPKR(selectedPurchaseCycle.facilitationFee)}
                        </p>
                      </div>
                    )}

                    {selectedPurchaseCycle.purchaserType === 'agency' && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-900 font-medium">Agency Investment</p>
                        <p className="text-xs text-blue-700 mt-1">
                          This is an internal investment. No commission, but opportunity for resale profit.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Deal Proposal Tab */}
          <TabsContent value="proposal" className="space-y-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Propose Internal Deal
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Facilitate a deal between your seller and purchaser
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proposed Price */}
                <div className="space-y-2">
                  <Label htmlFor="proposedPrice">
                    Proposed Deal Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="proposedPrice"
                    type="number"
                    placeholder="Enter proposed price"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    min="0"
                    step="100000"
                  />
                  {proposedPrice && (
                    <p className="text-sm text-muted-foreground">
                      {formatPKR(parseFloat(proposedPrice))}
                    </p>
                  )}
                </div>

                {/* Commission Breakdown */}
                {proposedPrice && parseFloat(proposedPrice) > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Total Commission</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPKR(calculateCommission(parseFloat(proposedPrice)))}
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {sellCycle && (
                        <div className="flex justify-between">
                          <span>Sell Side Commission:</span>
                          <span className="font-medium">
                            {formatPKR(
                              sellCycle.commissionType === 'percentage'
                                ? (parseFloat(proposedPrice) * sellCycle.commissionRate) / 100
                                : sellCycle.commissionRate
                            )}
                          </span>
                        </div>
                      )}
                      {selectedPurchaseCycle && selectedPurchaseCycle.purchaserType === 'client' && (
                        <div className="flex justify-between">
                          <span>Purchase Side Commission:</span>
                          <span className="font-medium">
                            {formatPKR(
                              selectedPurchaseCycle.commissionType === 'percentage'
                                ? (parseFloat(proposedPrice) * (selectedPurchaseCycle.commissionRate || 0)) / 100
                                : (selectedPurchaseCycle.commissionRate || 0)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Deal Notes */}
                <div className="space-y-2">
                  <Label htmlFor="dealNotes">Deal Notes (Optional)</Label>
                  <Textarea
                    id="dealNotes"
                    placeholder="Special conditions, timeline, or other important details..."
                    value={dealNotes}
                    onChange={(e) => setDealNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Price Comparison */}
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller Asking:</span>
                    <span className="font-medium">{formatPKR(matchData.sellAskingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer Offer:</span>
                    <span className="font-medium">{formatPKR(matchData.highestPurchaseOffer)}</span>
                  </div>
                  {proposedPrice && (
                    <>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Your Proposal:</span>
                        <span className="text-purple-600">{formatPKR(parseFloat(proposedPrice))}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {parseFloat(proposedPrice) > matchData.highestPurchaseOffer && (
                          <span className="text-orange-600">
                            ⚠️ Above buyer's offer by {formatPKR(parseFloat(proposedPrice) - matchData.highestPurchaseOffer)}
                          </span>
                        )}
                        {parseFloat(proposedPrice) < matchData.sellAskingPrice && (
                          <span className="text-orange-600">
                            {' '}⚠️ Below asking by {formatPKR(matchData.sellAskingPrice - parseFloat(proposedPrice))}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Before proposing this deal:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Ensure both parties are aware of the dual agency situation</li>
                    <li>Obtain written consent from both buyer and seller</li>
                    <li>Remain impartial and represent both parties fairly</li>
                    <li>Document all communications and decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {activeTab === 'proposal' && (
            <Button
              onClick={handleProposeDeal}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Propose Deal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
