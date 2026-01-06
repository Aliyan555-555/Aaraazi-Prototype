/**
 * Rent Requirement Details - V4.0 UI/UX OPTIMIZED ✅
 * Detailed view of a tenant's rental requirement with matched properties
 * PHASE 2 FOUNDATION: Uses new InfoPanel, MetricCard, and StatusTimeline components
 */

import React, { useState, useEffect } from 'react';
import { RentRequirement, User } from '../types';
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
  Users,
  DollarSign,
  Home,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  Phone,
  User as UserIcon,
  Clock,
  Search,
  Landmark,
  Key,
  FileCheck,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import {
  updateRentRequirement,
  closeRentRequirement,
  deleteRentRequirement,
  getRentRequirement,
} from '../lib/rentRequirements';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner@2.0.3';
import { 
  findMatchingPropertiesForRent, 
  getMatchScoreColor, 
  getMatchScoreLabel,
  PropertyMatch 
} from '../lib/propertyMatching';

interface RentRequirementDetailsProps {
  requirement: RentRequirement;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  onNavigateToRentCycle?: (rentCycleId: string) => void;
  onNavigateToProperty?: (propertyId: string) => void;
}

export function RentRequirementDetails({
  requirement,
  user,
  onBack,
  onUpdate,
  onNavigateToRentCycle,
  onNavigateToProperty,
}: RentRequirementDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [matchedProperties, setMatchedProperties] = useState<PropertyMatch[]>([]);

  useEffect(() => {
    // TODO: Implement property matching for rent requirements
    const matches = findMatchingPropertiesForRent(requirement, user.id, user.role);
    setMatchedProperties(matches);
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

  const getLeaseDurationDisplay = (duration: string) => {
    const labels: Record<string, string> = {
      '3-months': '3 Months',
      '6-months': '6 Months',
      '1-year': '1 Year',
      '2-years': '2 Years',
      'flexible': 'Flexible',
    };
    return labels[duration] || duration;
  };

  const handleClose = () => {
    if (!requirement.rentedPropertyId) {
      toast.error('Please specify the rented property before closing');
      return;
    }
    closeRentRequirement(requirement.id, requirement.rentedPropertyId);
    toast.success('Rent requirement closed');
    onUpdate();
    onBack();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this rent requirement?')) {
      deleteRentRequirement(requirement.id);
      toast.success('Rent requirement deleted');
      onUpdate();
      onBack();
    }
  };

  const handleMarkAsMatched = () => {
    updateRentRequirement(requirement.id, { status: 'matched' });
    toast.success('Marked as matched');
    onUpdate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 2 FOUNDATION: New InfoPanel ✅ */}
      <InfoPanel
        title={`Rent Requirement: ${requirement.tenantName}`}
        breadcrumbs={[
          { label: 'Rent Requirements', onClick: onBack },
          { label: requirement.tenantName }
        ]}
        description={`Managed by ${requirement.agentName} • Created ${new Date(requirement.createdAt).toLocaleDateString()}`}
        metrics={[
          { 
            label: 'Min Budget', 
            value: formatPKR(requirement.minBudget) + '/mo',
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Max Budget', 
            value: formatPKR(requirement.maxBudget) + '/mo',
            icon: <DollarSign className="w-4 h-4" />
          },
          {
            label: 'Lease Term',
            value: getLeaseDurationDisplay(requirement.leaseDuration),
            icon: <Calendar className="w-4 h-4" />
          },
          {
            label: 'Urgency',
            value: <Badge className={getUrgencyColor(requirement.urgency)} variant="secondary">{requirement.urgency}</Badge>,
            icon: <Clock className="w-4 h-4" />
          },
          {
            label: 'Status',
            value: <StatusTimeline status={requirement.status} />,
            icon: <Key className="w-4 h-4" />
          }
        ]}
        primaryActions={requirement.status !== 'closed' ? [
          {
            label: 'Mark as Matched',
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleMarkAsMatched
          }
        ] : []}
        secondaryActions={requirement.status !== 'closed' ? [
          {
            label: 'Close Requirement',
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleClose
          },
          {
            label: 'Delete',
            icon: <XCircle className="w-4 h-4" />,
            onClick: handleDelete
          }
        ] : []}
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2 FOUNDATION: New data-dense layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <InfoPanel
                  title="Tenant Information"
                  data={[
                    { label: 'Name', value: requirement.tenantName, icon: <UserCheck className="w-4 h-4" /> },
                    { label: 'Contact', value: requirement.tenantContact, icon: <Phone className="w-4 h-4" /> },
                    { label: 'Agent', value: requirement.agentName, icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Created', value: new Date(requirement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), icon: <Calendar className="w-4 h-4" /> },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Budget & Requirements"
                  data={[
                    { label: 'Min Monthly Rent', value: formatPKR(requirement.minBudget) + '/mo', icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Max Monthly Rent', value: formatPKR(requirement.maxBudget) + '/mo', icon: <DollarSign className="w-4 h-4" /> },
                    { label: 'Budget Range', value: formatPKR(requirement.maxBudget - requirement.minBudget) },
                    { label: 'Property Types', value: requirement.propertyTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', '), icon: <Home className="w-4 h-4" /> },
                    { label: 'Preferred Locations', value: requirement.preferredLocations.join(', '), icon: <MapPin className="w-4 h-4" /> },
                    { label: 'Bedrooms', value: requirement.maxBedrooms ? `${requirement.minBedrooms}-${requirement.maxBedrooms}` : `${requirement.minBedrooms}+` },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                <InfoPanel
                  title="Rental Preferences"
                  data={[
                    { label: 'Urgency', value: <Badge className={getUrgencyColor(requirement.urgency)}>{requirement.urgency}</Badge> },
                    { label: 'Move-in Date', value: requirement.moveInDate || 'Flexible', icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Lease Duration', value: getLeaseDurationDisplay(requirement.leaseDuration), icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Furnished', value: <span className="capitalize">{requirement.furnished}</span>, icon: <Home className="w-4 h-4" /> },
                    ...(requirement.petsAllowed !== undefined ? [{ label: 'Pets Allowed', value: <Badge variant={requirement.petsAllowed ? 'default' : 'secondary'}>{requirement.petsAllowed ? 'Yes' : 'No'}</Badge> }] : []),
                    ...(requirement.employmentVerified !== undefined ? [{ label: 'Employment Verified', value: <Badge variant={requirement.employmentVerified ? 'default' : 'secondary'}>{requirement.employmentVerified ? 'Yes' : 'No'}</Badge>, icon: <FileCheck className="w-4 h-4" /> }] : []),
                    ...(requirement.hasGuarantor !== undefined ? [{ label: 'Has Guarantor', value: <Badge variant={requirement.hasGuarantor ? 'default' : 'secondary'}>{requirement.hasGuarantor ? 'Yes' : 'No'}</Badge> }] : []),
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {requirement.additionalNotes && (
                  <InfoPanel title="Additional Notes" data={[{ label: 'Details', value: requirement.additionalNotes }]} columns={1} density="comfortable" showDivider={false} />
                )}

                <StatusTimeline
                  steps={[
                    { label: 'Created', status: 'complete', date: requirement.createdAt, description: `${formatPKR(requirement.maxBudget)}/mo budget` },
                    { label: 'Searching', status: requirement.status === 'active' ? 'current' : ['matched', 'viewing', 'negotiating', 'satisfied'].includes(requirement.status) ? 'complete' : 'pending' },
                    { label: 'Matches Found', status: matchedProperties.length > 0 ? 'complete' : 'pending', description: `${matchedProperties.length} match${matchedProperties.length !== 1 ? 'es' : ''}` },
                    { label: 'Viewing', status: requirement.status === 'viewing' ? 'current' : ['negotiating', 'satisfied'].includes(requirement.status) ? 'complete' : 'pending' },
                    { label: 'Negotiating', status: requirement.status === 'negotiating' ? 'current' : requirement.status === 'satisfied' ? 'complete' : 'pending' },
                    { label: 'Satisfied', status: requirement.status === 'satisfied' ? 'complete' : requirement.status === 'closed' ? 'skipped' : 'pending' }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <MetricCard label="Monthly Rent Range" value={formatPKR(requirement.maxBudget) + '/mo'} icon={<DollarSign className="w-4 h-4" />} trend={{ direction: 'neutral', value: formatPKR(requirement.minBudget) + '/mo min' }} variant="success" />
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

                {(requirement.minArea || requirement.maxArea) && (
                  <div className="grid grid-cols-2 gap-4">
                    {requirement.minArea && (
                      <div>
                        <p className="text-sm text-muted-foreground">Min Area</p>
                        <p className="font-medium">{requirement.minArea} sq ft</p>
                      </div>
                    )}
                    {requirement.maxArea && (
                      <div>
                        <p className="text-sm text-muted-foreground">Max Area</p>
                        <p className="font-medium">{requirement.maxArea} sq ft</p>
                      </div>
                    )}
                  </div>
                )}
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

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            {matchedProperties.length > 0 ? (
              matchedProperties.map((match) => (
                <Card 
                  key={match.propertyId}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigateToProperty && onNavigateToProperty(match.propertyId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Home className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{match.property.address}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {match.property.propertyType}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="text-right">
                        <Badge className={getMatchScoreColor(match.matchScore)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {match.matchScore}% Match
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getMatchScoreLabel(match.matchScore)}
                        </p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Rent</p>
                        <p className="font-semibold">{formatPKR(match.monthlyRent || 0)}/mo</p>
                      </div>
                      {match.property.bedrooms && (
                        <div>
                          <p className="text-sm text-muted-foreground">Bedrooms</p>
                          <p className="font-semibold">{match.property.bedrooms}</p>
                        </div>
                      )}
                      {match.property.bathrooms && (
                        <div>
                          <p className="text-sm text-muted-foreground">Bathrooms</p>
                          <p className="font-semibold">{match.property.bathrooms}</p>
                        </div>
                      )}
                      {match.property.area && (
                        <div>
                          <p className="text-sm text-muted-foreground">Area</p>
                          <p className="font-semibold">{match.property.area} {match.property.areaUnit}</p>
                        </div>
                      )}
                    </div>

                    {/* Match Reasons */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Why this matches:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchReasons.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mismatches (if any) */}
                    {match.mismatches.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Minor differences:</p>
                        <div className="flex flex-wrap gap-2">
                          {match.mismatches.map((mismatch, idx) => (
                            <Badge key={idx} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {mismatch}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToProperty && onNavigateToProperty(match.propertyId);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Property
                      </Button>
                      {match.rentCycleId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToRentCycle && onNavigateToRentCycle(match.rentCycleId!);
                          }}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          View Rent Cycle
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Matches Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No properties currently match this tenant's requirements.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Matching criteria: Budget range ({formatPKR(requirement.minBudget)} - {formatPKR(requirement.maxBudget)}/mo), 
                    property type, bedrooms ({requirement.minBedrooms}+), location, and features
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
        </Tabs>
      </div>
    </div>
  );
}