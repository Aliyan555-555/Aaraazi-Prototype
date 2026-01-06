/**
 * Property Details - V3.1
 * Comprehensive property view with all cycles displayed
 * REDESIGNED: Phase 2 Foundation - Aligned with new Figma design improvements
 * Updated: December 2024 - New layout with PageHeader, metrics, ConnectedEntitiesBar, StatusTimeline
 */

import React, { useState, useMemo } from 'react';
import { Property, SellCycle, PurchaseCycle, RentCycle, User } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Home,
  DollarSign,
  Clock,
  Eye,
  FileText,
  Users,
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { formatAreaDisplay } from '../lib/areaUnits';

// PHASE 2: Import foundation components ✅
import { InfoPanel } from './ui/info-panel';
import { MetricCard } from './ui/metric-card';
import { StatusTimeline } from './ui/status-timeline';
import { StatusBadge } from './layout/StatusBadge';
import { PageHeader } from './layout/PageHeader';
import { ConnectedEntitiesBar } from './layout/ConnectedEntitiesBar';

interface PropertyDetailsV3Props {
  property: Property;
  sellCycles: SellCycle[];
  purchaseCycles: PurchaseCycle[];
  rentCycles: RentCycle[];
  user: User;
  onBack: () => void;
  onEdit: () => void;
  onStartSellCycle: () => void;
  onStartPurchaseCycle: () => void;
  onStartRentCycle: () => void;
  onViewCycle: (cycleId: string, type: 'sell' | 'purchase' | 'rent') => void;
}

export function PropertyDetailsV3({
  property,
  sellCycles,
  purchaseCycles,
  rentCycles,
  user,
  onBack,
  onEdit,
  onStartSellCycle,
  onStartPurchaseCycle,
  onStartRentCycle,
  onViewCycle,
}: PropertyDetailsV3Props) {
  const [activeTab, setActiveTab] = useState('overview');

  // Defensive: Ensure cycles are always arrays
  const safeSellCycles = sellCycles || [];
  const safePurchaseCycles = purchaseCycles || [];
  const safeRentCycles = rentCycles || [];

  const totalActiveCycles =
    safeSellCycles.length + safePurchaseCycles.length + safeRentCycles.length;

  // Calculate days on market
  const daysOnMarket = useMemo(() => {
    if (!property.createdAt) return 1;
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, [property.createdAt]);

  // Get status
  const currentStatus = property.currentStatus || property.status || 'available';

  // Determine property lifecycle stage based on status
  const getLifecycleStage = () => {
    if (currentStatus === 'sold' || currentStatus === 'rented') {
      return 'transaction-complete';
    } else if (currentStatus === 'under-contract') {
      return 'under-contract';
    } else if (safeSellCycles.length > 0 || safePurchaseCycles.length > 0 || safeRentCycles.length > 0) {
      return 'active-marketing';
    }
    return 'property-listed';
  };

  const lifecycleStage = getLifecycleStage();

  // Get ownership history
  const ownershipHistory = property.ownershipHistory || [];

  // All cycles for history
  const allCycles = useMemo(() => {
    const sells = safeSellCycles.map((c: any) => ({ ...c, type: 'sell', date: c.listedDate || c.createdAt }));
    const purchases = safePurchaseCycles.map((c: any) => ({ ...c, type: 'purchase', date: c.offerDate || c.createdAt }));
    const rents = safeRentCycles.map((c: any) => ({ ...c, type: 'rent', date: c.availableFrom || c.createdAt }));
    
    return [...sells, ...purchases, ...rents].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [safeSellCycles, safePurchaseCycles, safeRentCycles]);

  // Build InfoPanel data for Primary Information
  const primaryInfoData = useMemo(() => {
    const data = [
      { label: 'Address', value: property.address },
      { label: 'Property Type', value: <span className="capitalize">{property.propertyType}</span> },
      { label: 'Price', value: formatPKR(property.price || 0) },
      { label: 'Area', value: formatAreaDisplay(property.area, property.areaUnit) },
    ];
    
    if (property.bedrooms) {
      data.push({ label: 'Bedrooms', value: property.bedrooms.toString() });
    }
    if (property.bathrooms) {
      data.push({ label: 'Bathrooms', value: property.bathrooms.toString() });
    }
    if (property.constructionYear) {
      data.push({ label: 'Construction Year', value: property.constructionYear.toString() });
    }
    
    data.push({ label: 'Status', value: <StatusBadge status={currentStatus} /> });
    
    if (property.description) {
      data.push({ label: 'Description', value: property.description });
    }
    
    return data;
  }, [property, currentStatus]);

  // Build InfoPanel data for People
  const peopleData = useMemo(() => {
    const data = [
      { label: 'Current Owner', value: property.currentOwnerName || property.sellerName || 'Unknown' },
    ];
    
    if (property.agentId) {
      data.push({ label: 'Assigned Agent', value: property.agentName || property.agentId });
    }
    
    return data;
  }, [property]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 2: PageHeader with breadcrumbs, title, status, metrics ✅ */}
      <PageHeader
        title={property.title || property.address}
        breadcrumbs={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Properties', onClick: onBack },
          { label: property.title || property.address },
        ]}
        description={property.address}
        metrics={[
          {
            label: 'Price',
            value: formatPKR(property.price || 0),
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            label: 'Area',
            value: formatAreaDisplay(property.area, property.areaUnit),
            icon: <Square className="h-4 w-4" />,
          },
          {
            label: 'Days Listed',
            value: daysOnMarket.toString(),
            icon: <Calendar className="h-4 w-4" />,
          },
          {
            label: 'Views',
            value: (property.viewCount || 0).toString(),
            icon: <Eye className="h-4 w-4" />,
          },
          {
            label: 'Cycles',
            value: totalActiveCycles.toString(),
            icon: <FileText className="h-4 w-4" />,
          },
        ]}
        primaryActions={[
          {
            label: 'Edit',
            onClick: onEdit,
            variant: 'outline',
          },
          {
            label: 'Start Sell Cycle',
            onClick: onStartSellCycle,
            variant: 'default',
          },
        ]}
        secondaryActions={[
          {
            label: 'Start Purchase Cycle',
            onClick: onStartPurchaseCycle,
          },
          {
            label: 'Start Rent Cycle',
            onClick: onStartRentCycle,
          },
        ]}
        status={currentStatus}
        onBack={onBack}
      />

      {/* PHASE 2: ConnectedEntitiesBar ✅ */}
      <ConnectedEntitiesBar
        entities={[
          {
            type: 'owner',
            name: property.currentOwnerName || property.sellerName || 'Unknown Owner',
            onClick: () => {},
            icon: <Users className="h-3 w-3" />,
          },
        ]}
      />

      {/* Main Content Area */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cycles">Cycles ({totalActiveCycles})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2: 2/3 + 1/3 Layout ✅ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Timeline */}
                <StatusTimeline
                  steps={[
                    {
                      label: 'Property Listed',
                      status: 'complete',
                      date: property.createdAt,
                      description: 'Initial listing',
                    },
                    {
                      label: 'Active Marketing',
                      status: lifecycleStage === 'property-listed' ? 'current' : 'complete',
                      date: property.createdAt,
                      description: `${totalActiveCycles} cycles created`,
                    },
                    {
                      label: 'Under Contract',
                      status: lifecycleStage === 'under-contract' ? 'current' : lifecycleStage === 'transaction-complete' ? 'complete' : 'pending',
                      date: undefined,
                    },
                    {
                      label: 'Transaction Complete',
                      status: lifecycleStage === 'transaction-complete' ? 'complete' : 'pending',
                      date: undefined,
                    },
                  ]}
                />

                {/* Primary Information */}
                <InfoPanel 
                  title="Primary Information"
                  data={primaryInfoData}
                  columns={2}
                  density="comfortable"
                />

                {/* People */}
                <InfoPanel 
                  title="People"
                  data={peopleData}
                  columns={2}
                  density="comfortable"
                />
              </div>

              {/* Right Column (1/3) */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-sm mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={onStartSellCycle}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Start Sell Cycle
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={onStartPurchaseCycle}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Start Purchase Cycle
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={onStartRentCycle}
                    >
                      <Home className="h-4 w-4" />
                      Start Rent Cycle
                    </Button>
                  </div>
                </div>

                {/* Days on Market */}
                <MetricCard
                  label="Days on Market"
                  value={daysOnMarket.toString()}
                  icon={<Clock className="h-5 w-5" />}
                  variant="info"
                  description="since listing"
                />

                {/* Total Views */}
                <MetricCard
                  label="Total Views"
                  value={(property.viewCount || 0).toString()}
                  icon={<Eye className="h-5 w-5" />}
                  variant="info"
                  description="0% of average"
                />

                {/* Total Cycles */}
                <MetricCard
                  label="Total Cycles"
                  value={totalActiveCycles.toString()}
                  icon={<FileText className="h-5 w-5" />}
                  variant="info"
                />

                {/* Cycle Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-sm mb-4">Cycle Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Sell Cycles
                      </span>
                      <span>{safeSellCycles.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                        Purchase Cycles
                      </span>
                      <span>{safePurchaseCycles.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Home className="h-4 w-4 text-purple-600" />
                        Rent Cycles
                      </span>
                      <span>{safeRentCycles.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cycles Tab */}
          <TabsContent value="cycles" className="space-y-6">
            {/* Sell Cycles Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Sell Cycles ({safeSellCycles.length})
                </h3>
                <Button size="sm" onClick={onStartSellCycle}>
                  + Add Sell Cycle
                </Button>
              </div>
              {safeSellCycles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No sell cycles yet</p>
              ) : (
                <div className="space-y-3">
                  {safeSellCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onViewCycle(cycle.id, 'sell')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Seller: {cycle.sellerName}</p>
                          <p className="text-xs text-gray-600">
                            Listed: {cycle.listedDate || new Date(cycle.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatPKR(cycle.askingPrice)}</p>
                          <StatusBadge status={cycle.status} className="text-xs mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Cycles Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Purchase Cycles ({safePurchaseCycles.length})
                </h3>
                <Button size="sm" onClick={onStartPurchaseCycle}>
                  + Add Purchase Cycle
                </Button>
              </div>
              {safePurchaseCycles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No purchase cycles yet</p>
              ) : (
                <div className="space-y-3">
                  {safePurchaseCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onViewCycle(cycle.id, 'purchase')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">
                            {cycle.purchaserType === 'buyer' ? 'Buyer' : 'Agency Investment'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Created: {cycle.offerDate || new Date(cycle.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatPKR(cycle.offerAmount)}</p>
                          <StatusBadge status={cycle.status} className="text-xs mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rent Cycles Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-600" />
                  Rent Cycles ({safeRentCycles.length})
                </h3>
                <Button size="sm" onClick={onStartRentCycle}>
                  + Add Rent Cycle
                </Button>
              </div>
              {safeRentCycles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No rent cycles yet</p>
              ) : (
                <div className="space-y-3">
                  {safeRentCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onViewCycle(cycle.id, 'rent')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Tenant: {cycle.currentTenantName || 'N/A'}</p>
                          <p className="text-xs text-gray-600">
                            Started: {cycle.availableFrom || new Date(cycle.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatPKR(cycle.monthlyRent || 0)}/mo</p>
                          <StatusBadge status={cycle.status} className="text-xs mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Ownership History */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-base mb-4">Ownership History</h3>
              {ownershipHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No ownership history yet</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Current Owner: {property.currentOwnerName || property.sellerName || property.currentOwnerId}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Since: {property.createdAt 
                      ? new Date(property.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Unknown'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownershipHistory.map((ownership, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs text-blue-600">
                          {ownershipHistory.length - index}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{ownership.ownerName || ownership.ownerId}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(ownership.acquiredAt || ownership.acquiredDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {ownership.transactionId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Transaction: {ownership.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cycle History */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-base mb-4">Cycle History</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl text-green-700">{safeSellCycles.length}</p>
                  <p className="text-xs text-gray-600">Sell Cycles</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl text-blue-700">{safePurchaseCycles.length}</p>
                  <p className="text-xs text-gray-600">Purchase Cycles</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl text-purple-700">{safeRentCycles.length}</p>
                  <p className="text-xs text-gray-600">Rent Cycles</p>
                </div>
              </div>

              {allCycles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No cycle history yet</p>
              ) : (
                <div className="space-y-3">
                  {allCycles.map((cycle: any) => {
                    const typeConfig = {
                      sell: { label: 'Sell Cycle', color: 'bg-green-100 text-green-800', icon: TrendingUp },
                      purchase: { label: 'Purchase Cycle', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
                      rent: { label: 'Rent Cycle', color: 'bg-purple-100 text-purple-800', icon: Home },
                    };
                    
                    const config = typeConfig[cycle.type as keyof typeof typeConfig];
                    const Icon = config.icon;

                    return (
                      <div
                        key={cycle.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <div>
                              <Badge className={`${config.color} text-xs mb-1`}>
                                {config.label}
                              </Badge>
                              <p className="text-xs text-gray-600">
                                {new Date(cycle.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={cycle.status} className="text-xs" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}