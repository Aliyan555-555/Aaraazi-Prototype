/**
 * Rent Cycle Details - V3.0
 * Detailed view of rent cycle with tenant applications and lease management
 * 
 * PHASE 2 FOUNDATION UPDATE:
 * - Overview tab redesigned with InfoPanel (data-dense)
 * - Added MetricCard components for key metrics
 * - StatusTimeline for rent cycle workflow
 * - 2/3 + 1/3 responsive layout
 * - Removed card-based layout in favor of ERP-style dense display
 */

import React, { useState } from 'react';
import { RentCycle, Property, User } from '../types';
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
  Key,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Home,
  Clock,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { 
  approveTenantApplication,
  rejectTenantApplication,
  signLease,
  recordRentPayment,
  endLease,
  renewLease,
  closeRentCycle,
} from '../lib/rentCycle';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

interface RentCycleDetailsProps {
  cycle: RentCycle;
  property: Property;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
}

export function RentCycleDetails({
  cycle,
  property,
  user,
  onBack,
  onUpdate,
}: RentCycleDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'available': 'bg-green-100 text-green-800',
      'pending-applications': 'bg-yellow-100 text-yellow-800',
      'leased': 'bg-blue-100 text-blue-800',
      'expired': 'bg-gray-100 text-gray-800',
      'terminated': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getApplicationStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleApproveApplication = (applicationId: string) => {
    approveTenantApplication(cycle.id, applicationId);
    toast.success('Application approved');
    onUpdate();
  };

  const handleRejectApplication = (applicationId: string) => {
    rejectTenantApplication(cycle.id, applicationId);
    toast.success('Application rejected');
    onUpdate();
  };

  const handleSignLease = (applicationId: string, leaseStart: string, leaseEnd: string) => {
    const result = signLease(cycle.id, applicationId, leaseStart, leaseEnd);
    if (result.success) {
      toast.success('Lease signed successfully!');
      onUpdate();
    } else {
      toast.error(result.error || 'Failed to sign lease');
    }
  };

  const handleRecordPayment = (amount: number, month: string) => {
    recordRentPayment(cycle.id, amount, month, 'paid', user.name);
    toast.success('Payment recorded');
    onUpdate();
  };

  const handleEndLease = () => {
    endLease(cycle.id, new Date().toISOString().split('T')[0]);
    toast.success('Lease ended');
    onUpdate();
  };

  const handleRenewLease = () => {
    const currentEnd = new Date(cycle.currentLeaseEnd || Date.now());
    const newStart = new Date(currentEnd);
    newStart.setDate(newStart.getDate() + 1);
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + cycle.leaseDuration);

    renewLease(
      cycle.id,
      newStart.toISOString().split('T')[0],
      newEnd.toISOString().split('T')[0],
      cycle.monthlyRent
    );
    toast.success('Lease renewed');
    onUpdate();
  };

  // Calculate totals
  const totalUpfront = (cycle.securityDeposit || 0) + (cycle.monthlyRent * cycle.advanceMonths);
  const estimatedCommission = cycle.monthlyRent * cycle.commissionMonths;

  // Get pending applications
  const pendingApplications = cycle.tenantApplications?.filter(a => a.status === 'pending') || [];
  const approvedApplications = cycle.tenantApplications?.filter(a => a.status === 'approved') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PHASE 1-2: New PageHeader ✅ */}
      <PageHeader
        title={`Rent Cycle: ${property.address}`}
        breadcrumbs={[
          { label: 'Rent Cycles', onClick: onBack },
          { label: property.address, onClick: () => {} },
          { label: 'Rent Cycle' }
        ]}
        description={`Managed by ${cycle.agentName || user.name} • Available from ${cycle.availableFrom}`}
        metrics={[
          { 
            label: 'Monthly Rent', 
            value: formatPKR(cycle.monthlyRent),
            icon: <DollarSign className="w-4 h-4" />
          },
          { 
            label: 'Applications', 
            value: String(cycle.tenantApplications?.length || 0),
            icon: <Users className="w-4 h-4" />
          },
          {
            label: 'Upfront Cost',
            value: formatPKR(totalUpfront),
            icon: <DollarSign className="w-4 h-4" />
          },
          {
            label: 'Lease Duration',
            value: `${cycle.leaseDuration} mo`,
            icon: <Calendar className="w-4 h-4" />
          },
          {
            label: 'Status',
            value: <StatusBadge status={cycle.status} />,
            icon: <Key className="w-4 h-4" />
          }
        ]}
        primaryActions={cycle.status === 'leased' && cycle.currentTenantId ? [
          {
            label: 'Renew Lease',
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleRenewLease
          }
        ] : []}
        secondaryActions={cycle.status === 'leased' && cycle.currentTenantId ? [
          {
            label: 'End Lease',
            icon: <XCircle className="w-4 h-4" />,
            onClick: handleEndLease
          }
        ] : []}
        onBack={onBack}
      />

      {/* PHASE 1-2: New ConnectedEntitiesBar ✅ */}
      <ConnectedEntitiesBar
        entities={[
          {
            type: 'property',
            name: property.address,
            icon: <Home className="w-4 h-4" />,
            onClick: () => {}
          },
          {
            type: 'landlord',
            name: cycle.landlordName,
            icon: <User className="w-4 h-4" />,
            onClick: () => {}
          },
          ...(cycle.currentTenantName ? [{
            type: 'tenant' as const,
            name: cycle.currentTenantName,
            icon: <Users className="w-4 h-4" />,
            onClick: () => {}
          }] : []),
          {
            type: 'agent',
            name: cycle.agentName || user.name,
            icon: <User className="w-4 h-4" />,
            onClick: () => {}
          }
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">
              Applications ({cycle.tenantApplications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="lease">Lease</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* PHASE 2 FOUNDATION: New data-dense layout with InfoPanel, MetricCard, StatusTimeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Rent & Financial Information - InfoPanel (Data-Dense) */}
                <InfoPanel
                  title="Rent & Financial Details"
                  data={[
                    { 
                      label: 'Monthly Rent', 
                      value: formatPKR(cycle.monthlyRent),
                      icon: <DollarSign className="w-4 h-4" /> 
                    },
                    ...(cycle.securityDeposit ? [{ 
                      label: 'Security Deposit', 
                      value: formatPKR(cycle.securityDeposit),
                      icon: <DollarSign className="w-4 h-4" /> 
                    }] : []),
                    { 
                      label: 'Advance Months', 
                      value: cycle.advanceMonths 
                    },
                    { 
                      label: 'Total Upfront Cost', 
                      value: formatPKR(totalUpfront),
                      icon: <DollarSign className="w-4 h-4" /> 
                    },
                    ...(cycle.maintenanceFee ? [{ 
                      label: 'Maintenance Fee', 
                      value: `${formatPKR(cycle.maintenanceFee)}/month` 
                    }] : []),
                    { 
                      label: 'Utilities', 
                      value: <span className="capitalize">{cycle.utilities} pays</span> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Lease Terms - InfoPanel */}
                <InfoPanel
                  title="Lease Terms"
                  data={[
                    { 
                      label: 'Lease Duration', 
                      value: `${cycle.leaseDuration} months`,
                      icon: <Calendar className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Available From', 
                      value: cycle.availableFrom,
                      icon: <Calendar className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Pet Policy', 
                      value: <span className="capitalize">{cycle.petPolicy?.replace('-', ' ')}</span> 
                    },
                    { 
                      label: 'Furnishing', 
                      value: <span className="capitalize">{cycle.furnishingStatus}</span> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Landlord & Commission - InfoPanel */}
                <InfoPanel
                  title="Landlord & Commission"
                  data={[
                    { 
                      label: 'Landlord Name', 
                      value: cycle.landlordName,
                      icon: <UserIcon className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Landlord Type', 
                      value: <span className="capitalize">{cycle.landlordType}</span> 
                    },
                    { 
                      label: 'Commission', 
                      value: `${cycle.commissionMonths} month${cycle.commissionMonths !== 1 ? 's' : ''} of rent` 
                    },
                    { 
                      label: 'Est. Commission Amount', 
                      value: formatPKR(estimatedCommission),
                      icon: <DollarSign className="w-4 h-4" /> 
                    },
                  ]}
                  columns={2}
                  density="comfortable"
                />

                {/* Tenant Requirements (if exist) */}
                {cycle.tenantRequirements && (
                  <InfoPanel
                    title="Tenant Requirements"
                    data={[
                      { 
                        label: 'Requirements', 
                        value: cycle.tenantRequirements 
                      }
                    ]}
                    columns={1}
                    density="comfortable"
                    showDivider={false}
                  />
                )}

                {/* Special Terms (if exist) */}
                {cycle.specialTerms && (
                  <InfoPanel
                    title="Special Terms"
                    data={[
                      { 
                        label: 'Terms', 
                        value: cycle.specialTerms 
                      }
                    ]}
                    columns={1}
                    density="comfortable"
                    showDivider={false}
                  />
                )}

                {/* Rent Cycle Workflow Timeline */}
                <StatusTimeline
                  steps={[
                    { 
                      label: 'Available', 
                      status: 'complete',
                      date: cycle.createdAt,
                      description: `Listed at ${formatPKR(cycle.monthlyRent)}/mo`
                    },
                    { 
                      label: 'Applications', 
                      status: (cycle.tenantApplications && cycle.tenantApplications.length > 0) ? 'complete' : 
                             cycle.status === 'available' ? 'current' : 'pending',
                      description: `${cycle.tenantApplications?.length || 0} application${(cycle.tenantApplications?.length || 0) !== 1 ? 's' : ''}`
                    },
                    { 
                      label: 'Screening', 
                      status: approvedApplications.length > 0 ? 'complete' : 
                             (cycle.status === 'pending-applications' && pendingApplications.length > 0) ? 'current' : 'pending',
                      description: approvedApplications.length > 0 ? `${approvedApplications.length} approved` : undefined
                    },
                    { 
                      label: 'Lease Signed', 
                      status: cycle.currentTenantId ? 'complete' : 'pending',
                      date: cycle.currentLeaseStart
                    },
                    { 
                      label: 'Active', 
                      status: cycle.status === 'leased' ? 'current' : 
                             cycle.status === 'expired' || cycle.status === 'terminated' ? 'complete' : 'pending',
                      description: cycle.currentTenantName
                    },
                    { 
                      label: 'Ended', 
                      status: cycle.status === 'expired' || cycle.status === 'terminated' ? 'complete' : 'pending',
                      date: cycle.status === 'expired' || cycle.status === 'terminated' ? cycle.currentLeaseEnd : undefined
                    }
                  ]}
                />
              </div>

              {/* Sidebar (1/3 width) */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <MetricCard
                  label="Monthly Rent"
                  value={formatPKR(cycle.monthlyRent)}
                  icon={<DollarSign className="w-4 h-4" />}
                  variant="success"
                />

                <MetricCard
                  label="Upfront Cost"
                  value={formatPKR(totalUpfront)}
                  icon={<TrendingUp className="w-4 h-4" />}
                  trend={{
                    direction: 'neutral',
                    value: `${cycle.advanceMonths} month${cycle.advanceMonths !== 1 ? 's' : ''} advance`
                  }}
                  variant="info"
                />

                <MetricCard
                  label="Days Active"
                  value={cycle.createdAt ? Math.floor((Date.now() - new Date(cycle.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  icon={<Clock className="w-4 h-4" />}
                  trend={{
                    direction: 'neutral',
                    value: cycle.status === 'leased' ? 'Leased' : 'Available'
                  }}
                  variant="default"
                />

                {/* Quick Stats Panel */}
                <InfoPanel
                  title="Quick Stats"
                  data={[
                    { 
                      label: 'Total Applications', 
                      value: cycle.tenantApplications?.length || 0,
                      icon: <Users className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Pending', 
                      value: pendingApplications.length,
                      icon: <Clock className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Approved', 
                      value: approvedApplications.length,
                      icon: <CheckCircle className="w-4 h-4" /> 
                    },
                    { 
                      label: 'Est. Commission', 
                      value: formatPKR(estimatedCommission),
                      icon: <DollarSign className="w-4 h-4" /> 
                    },
                  ]}
                  columns={1}
                  density="compact"
                />

                {/* Current Tenant (if exists) */}
                {cycle.currentTenantId && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Current Tenant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{cycle.currentTenantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-medium">{cycle.currentTenantContact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lease Period</p>
                        <p className="font-medium text-sm">
                          {cycle.currentLeaseStart} - {cycle.currentLeaseEnd}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab('applications')}
                    >
                      <Users className="h-4 w-4" />
                      View Applications ({cycle.tenantApplications?.length || 0})
                    </Button>
                    {cycle.currentTenantId && (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={() => setActiveTab('lease')}
                        >
                          <FileText className="h-4 w-4" />
                          View Lease
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={() => setActiveTab('payments')}
                        >
                          <DollarSign className="h-4 w-4" />
                          View Payments
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {cycle.tenantApplications && cycle.tenantApplications.length > 0 ? (
              <div className="space-y-4">
                {cycle.tenantApplications.map(app => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getApplicationStatusColor(app.status)} variant="secondary">
                              {app.status}
                            </Badge>
                          </div>

                          <div>
                            <p className="font-medium text-lg">{app.tenantName}</p>
                            <p className="text-sm text-muted-foreground">
                              Contact: {app.tenantContact}
                            </p>
                          </div>

                          {app.moveInDate && (
                            <div>
                              <p className="text-sm text-muted-foreground">Preferred Move-in Date</p>
                              <p className="text-sm font-medium">{app.moveInDate}</p>
                            </div>
                          )}

                          {app.employmentInfo && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Employment Info</p>
                              <p className="text-sm">{app.employmentInfo}</p>
                            </div>
                          )}

                          {app.references && app.references.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">References</p>
                              <div className="space-y-1">
                                {app.references.map((ref, idx) => (
                                  <p key={idx} className="text-sm">• {ref}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {app.notes && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Notes</p>
                              <p className="text-sm">{app.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="text-right space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(app.applicationDate).toLocaleDateString()}
                          </p>

                          {app.status === 'pending' && (
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveApplication(app.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectApplication(app.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {app.status === 'approved' && !cycle.currentTenantId && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const leaseStart = new Date().toISOString().split('T')[0];
                                const leaseEndDate = new Date();
                                leaseEndDate.setMonth(leaseEndDate.getMonth() + cycle.leaseDuration);
                                const leaseEnd = leaseEndDate.toISOString().split('T')[0];
                                handleSignLease(app.id, leaseStart, leaseEnd);
                              }}
                            >
                              Sign Lease
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications received yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Lease Tab */}
          <TabsContent value="lease" className="space-y-6">
            {cycle.currentTenantId ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Current Lease</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tenant</p>
                        <p className="font-medium">{cycle.currentTenantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tenant Contact</p>
                        <p className="font-medium">{cycle.currentTenantContact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lease Start</p>
                        <p className="font-medium">{cycle.currentLeaseStart}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lease End</p>
                        <p className="font-medium">{cycle.currentLeaseEnd}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lease History */}
                {cycle.leaseHistory && cycle.leaseHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lease History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cycle.leaseHistory.map((lease, idx) => (
                          <div key={idx} className="flex justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{lease.tenantName}</p>
                              <p className="text-sm text-muted-foreground">
                                {lease.startDate} - {lease.endDate}
                              </p>
                            </div>
                            <p className="font-medium">{formatPKR(lease.rentAmount)}/mo</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active lease</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {cycle.rentPayments && cycle.rentPayments.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cycle.rentPayments.map((payment, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.month}</p>
                          <p className="text-sm text-muted-foreground">
                            Recorded by: {payment.recordedBy}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPKR(payment.amount)}</p>
                          <Badge 
                            variant={payment.status === 'paid' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment records yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}