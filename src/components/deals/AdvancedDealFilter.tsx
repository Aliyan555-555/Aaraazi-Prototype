/**
 * Advanced Deal Filter Component
 * Comprehensive filtering and search for deals
 */

import React, { useState } from 'react';
import { Deal } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Filter, 
  X, 
  Search,
  Calendar,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

export interface DealFilterOptions {
  searchQuery: string;
  status: Deal['lifecycle']['status'] | 'all';
  stage: Deal['lifecycle']['stage'] | 'all';
  role: 'all' | 'primary' | 'secondary';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';
  priceMin: number;
  priceMax: number;
  hasOverduePayments: boolean | null;
  paymentStatus: 'all' | 'on-track' | 'overdue' | 'completed';
}

interface AdvancedDealFilterProps {
  filters: DealFilterOptions;
  onFiltersChange: (filters: DealFilterOptions) => void;
  activeFilterCount: number;
}

const defaultFilters: DealFilterOptions = {
  searchQuery: '',
  status: 'all',
  stage: 'all',
  role: 'all',
  dateRange: 'all',
  priceMin: 0,
  priceMax: 0,
  hasOverduePayments: null,
  paymentStatus: 'all'
};

export const AdvancedDealFilter: React.FC<AdvancedDealFilterProps> = ({ 
  filters, 
  onFiltersChange,
  activeFilterCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };
  
  const updateFilter = <K extends keyof DealFilterOptions>(
    key: K,
    value: DealFilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Simple' : 'Advanced'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deal number, parties, property..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(v) => updateFilter('status', v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Role */}
          <div className="space-y-2">
            <Label>My Role</Label>
            <Select 
              value={filters.role} 
              onValueChange={(v) => updateFilter('role', v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="primary">Primary Agent</SelectItem>
                <SelectItem value="secondary">Secondary Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(v) => updateFilter('dateRange', v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {isExpanded && (
          <>
            <div className="border-t pt-4 space-y-4">
              {/* Stage */}
              <div className="space-y-2">
                <Label>Lifecycle Stage</Label>
                <Select 
                  value={filters.stage} 
                  onValueChange={(v) => updateFilter('stage', v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="offer-accepted">Offer Accepted</SelectItem>
                    <SelectItem value="agreement-signing">Agreement Signing</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="payment-processing">Payment Processing</SelectItem>
                    <SelectItem value="handover-preparation">Handover Preparation</SelectItem>
                    <SelectItem value="transfer-registration">Transfer & Registration</SelectItem>
                    <SelectItem value="final-handover">Final Handover</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range (PKR)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={filters.priceMin || ''}
                      onChange={(e) => updateFilter('priceMin', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={filters.priceMax || ''}
                      onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Status */}
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select 
                  value={filters.paymentStatus} 
                  onValueChange={(v) => updateFilter('paymentStatus', v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Status</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="overdue">Has Overdue</SelectItem>
                    <SelectItem value="completed">Fully Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
        
        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  Search: {filters.searchQuery}
                  <button 
                    onClick={() => updateFilter('searchQuery', '')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <button 
                    onClick={() => updateFilter('status', 'all')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.stage !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Stage: {filters.stage.replace('-', ' ')}
                  <button 
                    onClick={() => updateFilter('stage', 'all')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.role !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {filters.role === 'primary' ? 'Primary Agent' : 'Secondary Agent'}
                  <button 
                    onClick={() => updateFilter('role', 'all')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateRange}
                  <button 
                    onClick={() => updateFilter('dateRange', 'all')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {(filters.priceMin > 0 || filters.priceMax > 0) && (
                <Badge variant="secondary" className="gap-1">
                  <DollarSign className="h-3 w-3" />
                  Price Range
                  <button 
                    onClick={() => {
                      updateFilter('priceMin', 0);
                      updateFilter('priceMax', 0);
                    }}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.paymentStatus !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Payment: {filters.paymentStatus}
                  <button 
                    onClick={() => updateFilter('paymentStatus', 'all')}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to apply filters to deals
export const applyDealFilters = (deals: Deal[], filters: DealFilterOptions, userId: string): Deal[] => {
  return deals.filter(deal => {
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDealNumber = deal.dealNumber.toLowerCase().includes(query);
      const matchesSeller = deal.parties.seller.name.toLowerCase().includes(query);
      const matchesBuyer = deal.parties.buyer.name.toLowerCase().includes(query);
      const matchesProperty = deal.property.address.toLowerCase().includes(query);
      
      if (!matchesDealNumber && !matchesSeller && !matchesBuyer && !matchesProperty) {
        return false;
      }
    }
    
    // Status
    if (filters.status !== 'all' && deal.lifecycle.status !== filters.status) {
      return false;
    }
    
    // Stage
    if (filters.stage !== 'all' && deal.lifecycle.stage !== filters.stage) {
      return false;
    }
    
    // Role
    if (filters.role !== 'all') {
      const isPrimary = deal.agents.primary.agentId === userId;
      const isSecondary = deal.agents.secondary?.agentId === userId;
      
      if (filters.role === 'primary' && !isPrimary) return false;
      if (filters.role === 'secondary' && !isSecondary) return false;
    }
    
    // Date Range
    if (filters.dateRange !== 'all') {
      const dealDate = new Date(deal.createdAt);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (dealDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (dealDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (dealDate < monthAgo) return false;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          if (dealDate < quarterAgo) return false;
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          if (dealDate < yearAgo) return false;
          break;
      }
    }
    
    // Price Range
    if (filters.priceMin > 0 && deal.financial.agreedPrice < filters.priceMin) {
      return false;
    }
    if (filters.priceMax > 0 && deal.financial.agreedPrice > filters.priceMax) {
      return false;
    }
    
    // Payment Status
    if (filters.paymentStatus !== 'all') {
      const hasOverdue = deal.financial.payments.some(p => 
        p.status === 'pending' && new Date(p.dueDate) < new Date()
      );
      const isFullyPaid = deal.financial.balanceRemaining === 0;
      
      if (filters.paymentStatus === 'overdue' && !hasOverdue) return false;
      if (filters.paymentStatus === 'completed' && !isFullyPaid) return false;
      if (filters.paymentStatus === 'on-track' && (hasOverdue || isFullyPaid)) return false;
    }
    
    return true;
  });
};

// Helper function to count active filters
export const countActiveFilters = (filters: DealFilterOptions): number => {
  let count = 0;
  
  if (filters.searchQuery) count++;
  if (filters.status !== 'all') count++;
  if (filters.stage !== 'all') count++;
  if (filters.role !== 'all') count++;
  if (filters.dateRange !== 'all') count++;
  if (filters.priceMin > 0 || filters.priceMax > 0) count++;
  if (filters.paymentStatus !== 'all') count++;
  
  return count;
};
