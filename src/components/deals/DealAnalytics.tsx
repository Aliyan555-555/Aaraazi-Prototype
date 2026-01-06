/**
 * Deal Analytics Component
 * Comprehensive analytics and insights for deal performance
 */

import React, { useMemo } from 'react';
import { Deal, User } from '../../types';
import { getDeals } from '../../lib/deals';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatPKR } from '../../lib/currency';

interface DealAnalyticsProps {
  user: User;
  deals?: Deal[];
}

export const DealAnalytics: React.FC<DealAnalyticsProps> = ({ user, deals: providedDeals }) => {
  const allDeals = providedDeals || getDeals();
  
  // Filter deals for current user
  const myDeals = useMemo(() => {
    return allDeals.filter(deal => 
      deal.agents.primary.agentId === user.id || 
      deal.agents.secondary?.agentId === user.id
    );
  }, [allDeals, user.id]);
  
  // Calculate analytics
  const analytics = useMemo(() => {
    const activeDeals = myDeals.filter(d => d.lifecycle.status === 'active');
    const completedDeals = myDeals.filter(d => d.lifecycle.status === 'completed');
    const cancelledDeals = myDeals.filter(d => d.lifecycle.status === 'cancelled');
    
    // Financial metrics
    const totalValue = myDeals.reduce((sum, d) => sum + d.financial.agreedPrice, 0);
    const totalPaid = myDeals.reduce((sum, d) => sum + d.financial.totalPaid, 0);
    const totalCommission = myDeals.reduce((sum, d) => sum + d.financial.commission.total, 0);
    const myCommission = myDeals.reduce((sum, d) => {
      if (d.agents.primary.agentId === user.id) {
        return sum + d.financial.commission.split.primaryAgent.amount;
      } else if (d.agents.secondary?.agentId === user.id && d.financial.commission.split.secondaryAgent) {
        return sum + d.financial.commission.split.secondaryAgent.amount;
      }
      return sum;
    }, 0);
    
    // Stage distribution
    const stageDistribution: Record<string, number> = {};
    activeDeals.forEach(deal => {
      stageDistribution[deal.lifecycle.stage] = (stageDistribution[deal.lifecycle.stage] || 0) + 1;
    });
    
    // Average deal duration
    const completedWithDates = completedDeals.filter(d => d.lifecycle.timeline.actualClosingDate);
    const avgDuration = completedWithDates.length > 0 
      ? completedWithDates.reduce((sum, d) => {
          const start = new Date(d.lifecycle.timeline.offerAcceptedDate);
          const end = new Date(d.lifecycle.timeline.actualClosingDate!);
          return sum + (end.getTime() - start.getTime());
        }, 0) / completedWithDates.length
      : 0;
    const avgDurationDays = Math.round(avgDuration / (1000 * 60 * 60 * 24));
    
    // Payment collection rate
    const paymentCollectionRate = totalValue > 0 ? (totalPaid / totalValue) * 100 : 0;
    
    // Overdue payments
    const overduePayments = activeDeals.reduce((count, deal) => {
      return count + deal.financial.payments.filter(p => 
        p.status === 'pending' && new Date(p.dueDate) < new Date()
      ).length;
    }, 0);
    
    // Role breakdown
    const asPrimary = myDeals.filter(d => d.agents.primary.agentId === user.id).length;
    const asSecondary = myDeals.filter(d => d.agents.secondary?.agentId === user.id).length;
    
    // Recent activity
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentDeals = myDeals.filter(d => 
      new Date(d.createdAt) >= last30Days
    ).length;
    
    return {
      total: myDeals.length,
      active: activeDeals.length,
      completed: completedDeals.length,
      cancelled: cancelledDeals.length,
      totalValue,
      totalPaid,
      totalCommission,
      myCommission,
      stageDistribution,
      avgDurationDays,
      paymentCollectionRate,
      overduePayments,
      asPrimary,
      asSecondary,
      recentDeals,
      completionRate: myDeals.length > 0 ? (completedDeals.length / myDeals.length) * 100 : 0
    };
  }, [myDeals, user.id]);
  
  const getStageDisplay = (stage: string) => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Deal Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your deal performance
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deals</p>
                <p className="text-3xl font-semibold mt-1">{analytics.total}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {analytics.recentDeals} in last 30 days
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-3xl font-semibold mt-1 text-blue-600">{analytics.active}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {analytics.overduePayments} overdue payments
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-semibold mt-1 text-green-600">{analytics.completed}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(analytics.completionRate)}% success rate
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-3xl font-semibold mt-1 text-red-600">{analytics.cancelled}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {myDeals.length > 0 ? Math.round((analytics.cancelled / myDeals.length) * 100) : 0}% of total
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Deal Value</span>
                <span className="font-semibold">{formatPKR(analytics.totalValue)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Collected</span>
                <span className="font-semibold text-green-600">{formatPKR(analytics.totalPaid)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Collection Rate</span>
                <span className="font-semibold">{Math.round(analytics.paymentCollectionRate)}%</span>
              </div>
              <Progress value={analytics.paymentCollectionRate} className="h-2" />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Commission</span>
                <span className="font-semibold">{formatPKR(analytics.totalCommission)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">My Commission</span>
                <span className="font-semibold text-blue-600">{formatPKR(analytics.myCommission)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">As Primary Agent</span>
                <span className="font-semibold">{analytics.asPrimary}</span>
              </div>
              <Progress value={(analytics.asPrimary / analytics.total) * 100} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground">
                {Math.round((analytics.asPrimary / analytics.total) * 100)}% of total deals
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">As Secondary Agent</span>
                <span className="font-semibold">{analytics.asSecondary}</span>
              </div>
              <Progress value={(analytics.asSecondary / analytics.total) * 100} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground">
                {Math.round((analytics.asSecondary / analytics.total) * 100)}% of total deals
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Deal Duration</span>
                <span className="font-semibold">{analytics.avgDurationDays} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Active Deals by Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(analytics.stageDistribution).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active deals at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(analytics.stageDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([stage, count]) => (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{getStageDisplay(stage)}</span>
                      <Badge variant="secondary">{count} deals</Badge>
                    </div>
                    <Progress 
                      value={(count / analytics.active) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                analytics.completionRate >= 50 ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {analytics.completionRate >= 50 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-semibold">{Math.round(analytics.completionRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                analytics.paymentCollectionRate >= 70 ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {analytics.paymentCollectionRate >= 70 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-xl font-semibold">{Math.round(analytics.paymentCollectionRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                analytics.overduePayments === 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {analytics.overduePayments === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue Payments</p>
                <p className="text-xl font-semibold">{analytics.overduePayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};