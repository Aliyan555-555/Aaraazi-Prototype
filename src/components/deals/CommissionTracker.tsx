/**
 * Commission Tracker Component
 * Track and visualize commission earnings from deals
 */

import React, { useMemo, useState } from 'react';
import { Deal, User } from '../../types';
import { getDeals } from '../../lib/deals';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DollarSign, 
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { formatPKR } from '../../lib/currency';

interface CommissionTrackerProps {
  user: User;
}

export const CommissionTracker: React.FC<CommissionTrackerProps> = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  
  const allDeals = getDeals();
  
  // Filter deals for current user
  const myDeals = useMemo(() => {
    return allDeals.filter(deal => 
      deal.agents.primary.agentId === user.id || 
      deal.agents.secondary?.agentId === user.id
    );
  }, [allDeals, user.id]);
  
  // Calculate commission analytics
  const commissionData = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0); // All time
    
    if (selectedPeriod === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (selectedPeriod === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    } else if (selectedPeriod === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    const filteredDeals = myDeals.filter(d => 
      new Date(d.createdAt) >= startDate
    );
    
    // Calculate earned commission (from completed deals)
    const completedDeals = filteredDeals.filter(d => d.lifecycle.status === 'completed');
    const earnedCommission = completedDeals.reduce((sum, deal) => {
      if (deal.agents.primary.agentId === user.id) {
        return sum + deal.financial.commission.split.primaryAgent.amount;
      } else if (deal.agents.secondary?.agentId === user.id && deal.financial.commission.split.secondaryAgent) {
        return sum + deal.financial.commission.split.secondaryAgent.amount;
      }
      return sum;
    }, 0);
    
    // Calculate pending commission (from active deals)
    const activeDeals = filteredDeals.filter(d => d.lifecycle.status === 'active');
    const pendingCommission = activeDeals.reduce((sum, deal) => {
      if (deal.agents.primary.agentId === user.id) {
        return sum + deal.financial.commission.split.primaryAgent.amount;
      } else if (deal.agents.secondary?.agentId === user.id && deal.financial.commission.split.secondaryAgent) {
        return sum + deal.financial.commission.split.secondaryAgent.amount;
      }
      return sum;
    }, 0);
    
    // Calculate total potential
    const totalPotential = earnedCommission + pendingCommission;
    
    // Break down by role
    const asPrimary = filteredDeals.filter(d => d.agents.primary.agentId === user.id);
    const asSecondary = filteredDeals.filter(d => d.agents.secondary?.agentId === user.id);
    
    const primaryCommission = asPrimary.reduce((sum, d) => {
      if (d.lifecycle.status === 'completed') {
        return sum + d.financial.commission.split.primaryAgent.amount;
      }
      return sum;
    }, 0);
    
    const secondaryCommission = asSecondary.reduce((sum, d) => {
      if (d.lifecycle.status === 'completed' && d.financial.commission.split.secondaryAgent) {
        return sum + d.financial.commission.split.secondaryAgent.amount;
      }
      return sum;
    }, 0);
    
    // Top deals by commission
    const topDeals = completedDeals
      .map(deal => {
        const myCommission = deal.agents.primary.agentId === user.id
          ? deal.financial.commission.split.primaryAgent.amount
          : (deal.financial.commission.split.secondaryAgent?.amount || 0);
        
        return { deal, myCommission };
      })
      .sort((a, b) => b.myCommission - a.myCommission)
      .slice(0, 5);
    
    // Commission by stage (active deals)
    const commissionByStage: Record<string, number> = {};
    activeDeals.forEach(deal => {
      const stage = deal.lifecycle.stage;
      const myComm = deal.agents.primary.agentId === user.id
        ? deal.financial.commission.split.primaryAgent.amount
        : (deal.financial.commission.split.secondaryAgent?.amount || 0);
      
      commissionByStage[stage] = (commissionByStage[stage] || 0) + myComm;
    });
    
    return {
      earnedCommission,
      pendingCommission,
      totalPotential,
      primaryCommission,
      secondaryCommission,
      completedDeals: completedDeals.length,
      activeDeals: activeDeals.length,
      topDeals,
      commissionByStage
    };
  }, [myDeals, user.id, selectedPeriod]);
  
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  };
  
  const getStageDisplay = (stage: string) => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Commission Tracker</h2>
          <p className="text-muted-foreground">
            Monitor your earnings and commission breakdown
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="secondary">{getPeriodLabel()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Earned Commission</p>
            <p className="text-3xl font-semibold text-green-600">
              {formatPKR(commissionData.earnedCommission)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              From {commissionData.completedDeals} completed deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary">{getPeriodLabel()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pending Commission</p>
            <p className="text-3xl font-semibold text-blue-600">
              {formatPKR(commissionData.pendingCommission)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              From {commissionData.activeDeals} active deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary">{getPeriodLabel()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Potential</p>
            <p className="text-3xl font-semibold text-purple-600">
              {formatPKR(commissionData.totalPotential)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {commissionData.earnedCommission > 0 
                ? `${Math.round((commissionData.earnedCommission / commissionData.totalPotential) * 100)}% realized`
                : 'No earnings yet'
              }
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Commission by Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm font-medium">As Primary Agent (60%)</span>
                </div>
                <span className="font-semibold">{formatPKR(commissionData.primaryCommission)}</span>
              </div>
              <Progress 
                value={commissionData.earnedCommission > 0 
                  ? (commissionData.primaryCommission / commissionData.earnedCommission) * 100 
                  : 0
                } 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                  <span className="text-sm font-medium">As Secondary Agent (40%)</span>
                </div>
                <span className="font-semibold">{formatPKR(commissionData.secondaryCommission)}</span>
              </div>
              <Progress 
                value={commissionData.earnedCommission > 0 
                  ? (commissionData.secondaryCommission / commissionData.earnedCommission) * 100 
                  : 0
                } 
                className="h-2" 
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Earned</span>
                <span className="text-lg font-semibold text-green-600">
                  {formatPKR(commissionData.earnedCommission)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending by Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Pending Commission by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(commissionData.commissionByStage).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending commission</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(commissionData.commissionByStage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([stage, amount]) => (
                    <div key={stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{getStageDisplay(stage)}</span>
                        <span className="font-semibold text-sm">{formatPKR(amount)}</span>
                      </div>
                      <Progress 
                        value={(amount / commissionData.pendingCommission) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Top Earning Deals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            Top Commission Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commissionData.topDeals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed deals yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commissionData.topDeals.map(({ deal, myCommission }, index) => (
                <div 
                  key={deal.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        index === 1 ? 'bg-gray-100 text-gray-800' : 
                        index === 2 ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'}
                    `}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{deal.dealNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {deal.parties.seller.name} → {deal.parties.buyer.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{formatPKR(myCommission)}</div>
                    <div className="text-xs text-muted-foreground">
                      {deal.agents.primary.agentId === user.id ? 'Primary (60%)' : 'Secondary (40%)'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Commission per Deal</p>
                <p className="text-2xl font-semibold">
                  {commissionData.completedDeals > 0 
                    ? formatPKR(commissionData.earnedCommission / commissionData.completedDeals)
                    : formatPKR(0)
                  }
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Commission Realization Rate</p>
                <p className="text-2xl font-semibold">
                  {commissionData.totalPotential > 0
                    ? `${Math.round((commissionData.earnedCommission / commissionData.totalPotential) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};