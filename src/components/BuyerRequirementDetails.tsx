/**
 * Buyer Requirement Details - V3.0
 * Detailed view of a buyer requirement with matched properties
 * ENHANCED with Offer Management System
 * PAYMENT SCHEDULE: Integrated payment planning for buyers ✅
 */

import React, { useState, useEffect } from 'react';
import { BuyerRequirement, User, PaymentSchedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// PHASE 2 FOUNDATION: Import new UI components ✅
import { InfoPanel } from './ui/info-panel';
import { MetricCard } from './ui/metric-card';
import { StatusTimeline } from './ui/status-timeline';

import {
  ArrowLeft,
  UserCheck,
  DollarSign,
  Home,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Wallet,
  Plus,
  Clock,
  Search,
  Landmark,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import {
  updateBuyerRequirement,
  closeBuyerRequirement,
  deleteBuyerRequirement,
} from '../lib/buyerRequirements';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner@2.0.3';
import { 
  findMatchingPropertiesForBuyer, 
  getMatchScoreColor, 
  getMatchScoreLabel,
  PropertyMatch 
} from '../lib/propertyMatching';
import { SendOfferToBuyerModal } from './SendOfferToBuyerModal';
import { EnhancedMatchCard } from './EnhancedMatchCard';
import { 
  getOffersByBuyerRequirement, 
  getLatestOfferForProperty,
  getSellCycleById 
} from '../lib/sellCycle';

interface BuyerRequirementDetailsProps {
  requirement: BuyerRequirement;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  onNavigateToSellCycle?: (sellCycleId: string) => void;
  onNavigateToProperty?: (propertyId: string) => void;
}

export function BuyerRequirementDetails({
  requirement,
  user,
  onBack,
  onUpdate,
  onNavigateToSellCycle,
  onNavigateToProperty,
}: BuyerRequirementDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [matchedProperties, setMatchedProperties] = useState<PropertyMatch[]>([]);
  const [showSendOfferModal, setShowSendOfferModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<PropertyMatch | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule | null>(null);
  const [showCreatePaymentScheduleModal, setShowCreatePaymentScheduleModal] = useState(false);

  useEffect(() => {
    // Find matching properties
    const matches = findMatchingPropertiesForBuyer(requirement, user.id, user.role);
    setMatchedProperties(matches);

    // PAYMENT SCHEDULE: Get active payment schedule for this requirement ✅
    const activeSchedule = getActivePaymentSchedule(requirement.id, 'buyer-requirement');
    setPaymentSchedule(activeSchedule);
  }, [requirement, user.id, user.role]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'matched': 'bg-blue-100 text-blue-800',
      'closed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-800',
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const handleClose = () => {
    closeBuyerRequirement(requirement.id);
    toast.success('Requirement closed');
    onUpdate();
    onBack();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this requirement?')) {
      deleteBuyerRequirement(requirement.id);
      toast.success('Requirement deleted');
      onUpdate();
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 2 FOUNDATION: New InfoPanel ✅ */}
      <InfoPanel
        title={`Buyer Requirement: ${requirement.buyerName}`}
        breadcrumbs={[
          { label: 'Buyer Requirements', onClick: onBack },
          { label: requirement.buyerName }
        ]}
        description={`Managed by ${requirement.agentName} • Created ${new Date(requirement.createdAt).toLocaleDateString()}`}
        metrics={[
          { 
            label: 'Min Budget', 
            value: formatPKR(requirement.minBudget),
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Max Budget', 
            value: formatPKR(requirement.maxBudget),
            icon: <DollarSign className="w-4 h-4" />
          },
          {
            label: 'Matches',
            value: String(matchedProperties.length || 0),
            icon: <Home className="w-4 h-4" />
          },
          {
            label: 'Urgency',
            value: <Badge className={getUrgencyColor(requirement.urgency)} variant="secondary">{requirement.urgency}</Badge>,
            icon: <Calendar className="w-4 h-4" />
          },
          {
            label: 'Status',
            value: <StatusBadge status={requirement.status} />,
            icon: <UserCheck className="w-4 h-4" />
          }
        ]}
        primaryActions={requirement.status !== 'closed' ? [
          {
            label: 'Close Requirement',
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleClose
          }
        ] : []}
        secondaryActions={requirement.status !== 'closed' ? [
          {
            label: 'Delete',
            icon: <XCircle className="w-4 h-4" />,
            onClick: handleDelete
          }
        ] : []}
        onBack={onBack}
      />

      {/* PHASE 2 FOUNDATION: New StatusTimeline ✅ */}
      <StatusTimeline
        status={requirement.status}
        onBack={onBack}
      />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="matches">
              Matches ({matchedProperties.length || 0})
            </TabsTrigger>
            <TabsTrigger value="viewings">
              Viewings ({requirement.viewings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="payment">Payment Schedule</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2 FOUNDATION: New data-dense layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <InfoPanel
                  title="Buyer Information"
                  data={[
                    { label: 'Name', value: requirement.buyerName, icon: <UserCheck className="w-4 h-4" /> },
                    { label: 'Contact', value: requirement.buyerContact, icon: <Phone className="w-4 h-4" /> },
                    { label: 'Agent', value: requirement.agentName, icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Created', value: new Date(requirement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), icon: <Calendar className="w-4 h-4" /> },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Budget & Requirements"
                  data={[
                    { label: 'Min Budget', value: formatPKR(requirement.minBudget), icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Max Budget', value: formatPKR(requirement.maxBudget), icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Budget Range', value: formatPKR(requirement.maxBudget - requirement.minBudget) },
                    { label: 'Property Types', value: requirement.propertyTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', '), icon: <Home className="w-4 h-4" /> },
                    { label: 'Preferred Locations', value: requirement.preferredLocations.join(', '), icon: <MapPin className="w-4 h-4" /> },
                    { label: 'Bedrooms', value: requirement.maxBedrooms ? `${requirement.minBedrooms}-${requirement.maxBedrooms}` : `${requirement.minBedrooms}+` },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Timeline & Financing"
                  data={[
                    { label: 'Urgency', value: <Badge className={getUrgencyColor(requirement.urgency)}>{requirement.urgency}</Badge> },
                    { label: 'Target Move Date', value: requirement.targetMoveDate || 'Flexible', icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Financing Type', value: <span className="capitalize">{requirement.financingType}</span>, icon: <Landmark className="w-4 h-4" /> },
                    { label: 'Pre-Approved', value: <Badge variant={requirement.preApproved ? 'default' : 'secondary'}>{requirement.preApproved ? 'Yes' : 'No'}</Badge> },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {requirement.additionalNotes && (
                  <InfoPanel title="Additional Notes" data={[{ label: 'Details', value: requirement.additionalNotes }]} columns={1} density="comfortable" showDivider={false} />
                )}

                <StatusTimeline
                  steps={[
                    { label: 'Created', status: 'complete', date: requirement.createdAt, description: `${formatPKR(requirement.maxBudget)} budget` },
                    { label: 'Searching', status: requirement.status === 'active' ? 'current' : ['matched', 'viewing', 'negotiating', 'satisfied'].includes(requirement.status) ? 'complete' : 'pending' },
                    { label: 'Matches Found', status: matchedProperties.length > 0 ? 'complete' : 'pending', description: `${matchedProperties.length} match${matchedProperties.length !== 1 ? 'es' : ''}` },
                    { label: 'Viewing', status: requirement.status === 'viewing' ? 'current' : ['negotiating', 'satisfied'].includes(requirement.status) ? 'complete' : 'pending' },
                    { label: 'Negotiating', status: requirement.status === 'negotiating' ? 'current' : requirement.status === 'satisfied' ? 'complete' : 'pending' },
                    { label: 'Satisfied', status: requirement.status === 'satisfied' ? 'complete' : requirement.status === 'closed' ? 'skipped' : 'pending' }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <MetricCard label="Budget Range" value={formatPKR(requirement.maxBudget)} icon={<DollarSign className="w-4 h-4" />} trend={{ direction: 'neutral', value: formatPKR(requirement.minBudget) + ' min' }} variant="success" />
                <MetricCard label="Matches Found" value={matchedProperties.length} icon={<Search className="w-4 h-4" />} trend={{ direction: matchedProperties.length > 0 ? 'up' : 'neutral', value: matchedProperties.length > 0 ? 'Available' : 'Searching' }} variant={matchedProperties.length > 0 ? 'info' : 'default'} />
                <MetricCard label="Days Active" value={Math.floor((Date.now() - new Date(requirement.createdAt).getTime()) / (1000 * 60 * 60 * 24))} icon={<Clock className="w-4 h-4" />} variant="default" />
                
                <InfoPanel
                  title="Quick Stats"
                  data={[
                    { label: 'Status', value: <Badge className={getStatusColor(requirement.status)}>{requirement.status}</Badge> },
                    { label: 'Property Types', value: `${requirement.propertyTypes.length} type${requirement.propertyTypes.length !== 1 ? 's' : ''}`, icon: <Home className="w-4 h-4" /> },
                    { label: 'Locations', value: `${requirement.preferredLocations.length} area${requirement.preferredLocations.length !== 1 ? 's' : ''}`, icon: <MapPin className="w-4 h-4" /> },
                    { label: 'Urgency', value: <Badge className={getUrgencyColor(requirement.urgency)}>{requirement.urgency}</Badge>, icon: <Clock className="w-4 h-4" /> },
                  ]}
                  columns={1}
                  density="compact"
                />

                {requirement.status !== 'closed' && requirement.status !== 'satisfied' && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('matches')}><Search className="h-4 w-4" />View Matches ({matchedProperties.length})</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('criteria')}><Home className="h-4 w-4" />View Criteria</Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab('viewings')}><Calendar className="h-4 w-4" />View Viewings ({requirement.viewings?.length || 0})</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Criteria Tab */}
          <TabsContent value="criteria" className="space-y-6">
            {/* Property Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Property Types</p>
                  <div className="flex flex-wrap gap-2">
                    {requirement.propertyTypes.map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Min Bedrooms</p>
                    <p className="font-medium">{requirement.minBedrooms}</p>
                  </div>
                  {requirement.maxBedrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Max Bedrooms</p>
                      <p className="font-medium">{requirement.maxBedrooms}</p>
                    </div>
                  )}
                  {requirement.minBathrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Min Bathrooms</p>
                      <p className="font-medium">{requirement.minBathrooms}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Preferred Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requirement.preferredLocations.map((loc, idx) => (
                    <Badge key={idx} variant="outline">
                      {loc}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Must-Have Features */}
            {requirement.mustHaveFeatures && requirement.mustHaveFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Must-Have Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {requirement.mustHaveFeatures.map((feature, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nice-to-Have Features */}
            {requirement.niceToHaveFeatures && requirement.niceToHaveFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nice-to-Have Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {requirement.niceToHaveFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ============================================================
              MATCHES TAB - ENHANCED WITH OFFER MANAGEMENT
              ============================================================ */}
          <TabsContent value="matches" className="space-y-4">
            {matchedProperties && matchedProperties.length > 0 ? (
              <div className="space-y-4">
                {matchedProperties.map((match) => {
                  // Get latest offer for this property (if any)
                  const latestOffer = getLatestOfferForProperty(requirement.id, match.propertyId);
                  
                  // Get total offers on this property
                  const sellCycle = match.sellCycleId ? getSellCycleById(match.sellCycleId) : null;
                  const totalOffersOnProperty = sellCycle?.offers.length || 0;
                  
                  return (
                    <EnhancedMatchCard
                      key={match.propertyId}
                      match={match}
                      latestOffer={latestOffer}
                      totalOffersOnProperty={totalOffersOnProperty}
                      onSendOffer={() => {
                        setSelectedMatch(match);
                        setShowSendOfferModal(true);
                      }}
                      onViewSellCycle={(sellCycleId) => {
                        if (onNavigateToSellCycle) {
                          onNavigateToSellCycle(sellCycleId);
                        } else {
                          toast.info('Navigation to Sell Cycle - Coming soon!');
                        }
                      }}
                      onViewProperty={(propertyId) => {
                        if (onNavigateToProperty) {
                          onNavigateToProperty(propertyId);
                        } else {
                          toast.info('Navigation to Property - Coming soon!');
                        }
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No matching properties found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We couldn't find any properties that match this buyer's criteria.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Matching criteria: Budget range, property type, bedrooms, location, and features
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Viewings Tab */}
          <TabsContent value="viewings">
            <Card>
              <CardHeader>
                <CardTitle>Property Viewings</CardTitle>
              </CardHeader>
              <CardContent>
                {requirement.viewings && requirement.viewings.length > 0 ? (
                  <div className="space-y-3">
                    {requirement.viewings.map((viewing, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Property ID: {viewing.propertyId}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(viewing.viewingDate).toLocaleDateString()}
                          </p>
                        </div>
                        {viewing.feedback && (
                          <p className="text-sm text-muted-foreground">
                            Feedback: {viewing.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No viewings scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Schedule Tab */}
          <TabsContent value="payment" className="space-y-4">
            {paymentSchedule ? (
              <PaymentScheduleView
                schedule={paymentSchedule}
                onRecordPayment={recordInstalmentPayment}
                onActivate={activatePaymentSchedule}
                onCancel={cancelPaymentSchedule}
                canEdit={true}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No payment schedule set</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up a payment schedule for this buyer requirement.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePaymentScheduleModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payment Schedule
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Send Offer Modal */}
        {showSendOfferModal && selectedMatch && (
          <SendOfferToBuyerModal
            isOpen={showSendOfferModal}
            requirement={requirement}
            property={selectedMatch.property}
            sellCycleId={selectedMatch.sellCycleId!}
            askingPrice={selectedMatch.askingPrice}
            user={user}
            onClose={() => {
              setShowSendOfferModal(false);
              setSelectedMatch(null);
            }}
            onSuccess={() => {
              setShowSendOfferModal(false);
              setSelectedMatch(null);
              onUpdate();
            }}
          />
        )}

        {/* Create Payment Schedule Modal */}
        {showCreatePaymentScheduleModal && (
          <CreatePaymentScheduleModal
            open={showCreatePaymentScheduleModal}
            onClose={() => setShowCreatePaymentScheduleModal(false)}
            onSave={(data) => {
              const schedule = createPaymentSchedule(
                {
                  ...data,
                  entityId: requirement.id,
                  entityType: 'buyer-requirement',
                },
                user.id,
                user.name
              );
              setPaymentSchedule(schedule);
              setShowCreatePaymentScheduleModal(false);
              toast.success('Payment schedule created successfully!');
              onUpdate();
            }}
            defaultTotalAmount={requirement.maxBudget}
            entityName={`Buyer Requirement - ${requirement.buyerName}`}
          />
        )}
      </div>
    </div>
  );
}