import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Property, User, Commission } from '../types';
import { formatPKR } from '../lib/currency';
import { createSingleCommission, createCommissionWithSplits } from '../lib/phase3Enhancements';
import { toast } from 'sonner';
import { DollarSign, Users, Plus, Trash2, AlertCircle, Calculator } from 'lucide-react';

interface CommissionManagementModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
  saleAmount: number;
  availableAgents: User[];
  onSuccess: () => void;
}

interface CommissionSplit {
  agentId: string;
  agentName: string;
  percentage: number;
}

export function CommissionManagementModal({
  open,
  onClose,
  property,
  saleAmount,
  availableAgents,
  onSuccess
}: CommissionManagementModalProps) {
  const [commissionType, setCommissionType] = useState<'single' | 'split'>('single');
  const [singleAgentId, setSingleAgentId] = useState('');
  const [commissionRate, setCommissionRate] = useState(property.commissionRate?.toString() || '2');
  const [payoutTrigger, setPayoutTrigger] = useState<Commission['payoutTrigger']>('full-payment');
  
  const [splits, setSplits] = useState<CommissionSplit[]>([
    { agentId: '', agentName: '', percentage: 50 },
    { agentId: '', agentName: '', percentage: 50 }
  ]);

  const totalCommission = (saleAmount * parseFloat(commissionRate || '0')) / 100;
  const totalSplitPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);

  const addSplit = () => {
    if (splits.length >= 5) {
      toast.error('Maximum 5 agents can split a commission');
      return;
    }
    setSplits([...splits, { agentId: '', agentName: '', percentage: 0 }]);
  };

  const removeSplit = (index: number) => {
    if (splits.length <= 2) {
      toast.error('At least 2 agents required for commission split');
      return;
    }
    setSplits(splits.filter((_, i) => i !== index));
  };

  const updateSplit = (index: number, field: keyof CommissionSplit, value: string | number) => {
    const newSplits = [...splits];
    if (field === 'agentId') {
      const agent = availableAgents.find(a => a.id === value);
      newSplits[index] = {
        ...newSplits[index],
        agentId: value as string,
        agentName: agent?.name || ''
      };
    } else {
      newSplits[index] = { ...newSplits[index], [field]: value };
    }
    setSplits(newSplits);
  };

  const handleSubmit = () => {
    const rate = parseFloat(commissionRate);
    if (!rate || rate <= 0 || rate > 100) {
      toast.error('Please enter a valid commission rate (1-100%)');
      return;
    }

    if (commissionType === 'single') {
      if (!singleAgentId) {
        toast.error('Please select an agent');
        return;
      }

      const agent = availableAgents.find(a => a.id === singleAgentId);
      if (!agent) {
        toast.error('Selected agent not found');
        return;
      }

      const commission = createSingleCommission(
        property.id,
        property.title,
        saleAmount,
        rate,
        agent.id,
        agent.name,
        payoutTrigger
      );

      if (commission) {
        toast.success(`Commission of ${formatPKR(commission.amount)} created for ${agent.name}`);
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to create commission');
      }
    } else {
      // Validate splits
      if (totalSplitPercentage !== 100) {
        toast.error('Commission splits must total exactly 100%');
        return;
      }

      const invalidSplits = splits.filter(s => !s.agentId || !s.agentName || s.percentage <= 0);
      if (invalidSplits.length > 0) {
        toast.error('All splits must have a valid agent and percentage');
        return;
      }

      // Check for duplicate agents
      const agentIds = splits.map(s => s.agentId);
      const uniqueAgentIds = new Set(agentIds);
      if (agentIds.length !== uniqueAgentIds.size) {
        toast.error('Cannot assign same agent multiple times');
        return;
      }

      const commissions = createCommissionWithSplits(
        property.id,
        property.title,
        totalCommission,
        splits,
        payoutTrigger
      );

      if (commissions && commissions.length > 0) {
        toast.success(`Commission split created for ${commissions.length} agents`);
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to create commission splits');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Create Commission for Sale
          </DialogTitle>
          <DialogDescription>
            Configure commission structure for {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sale Summary */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-700 mb-1">Property</p>
                <p className="font-medium text-blue-900">{property.title}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Sale Amount</p>
                <p className="font-medium text-blue-900">{formatPKR(saleAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Commission</p>
                <p className="text-xl font-medium text-blue-900">{formatPKR(totalCommission)}</p>
              </div>
            </div>
          </Card>

          {/* Commission Rate */}
          <div>
            <Label htmlFor="commission-rate">Commission Rate (%)</Label>
            <Input
              id="commission-rate"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="Enter commission rate"
              min="0.1"
              max="100"
              step="0.1"
            />
            <p className="text-sm text-gray-600 mt-1">
              Commission Amount: {formatPKR(totalCommission)}
            </p>
          </div>

          {/* Payout Trigger */}
          <div>
            <Label htmlFor="payout-trigger">Payout Trigger</Label>
            <Select value={payoutTrigger} onValueChange={(value: any) => setPayoutTrigger(value)}>
              <SelectTrigger id="payout-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking">At Booking</SelectItem>
                <SelectItem value="50-percent">At 50% Payment</SelectItem>
                <SelectItem value="possession">At Possession</SelectItem>
                <SelectItem value="full-payment">At Full Payment</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">
              When should this commission be paid out to the agent(s)?
            </p>
          </div>

          {/* Commission Type Selection */}
          <div>
            <Label>Commission Structure</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                variant={commissionType === 'single' ? 'default' : 'outline'}
                onClick={() => setCommissionType('single')}
                className="justify-start h-auto py-3"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Single Agent</div>
                  <div className="text-xs opacity-80">100% to one agent</div>
                </div>
              </Button>
              <Button
                variant={commissionType === 'split' ? 'default' : 'outline'}
                onClick={() => setCommissionType('split')}
                className="justify-start h-auto py-3"
              >
                <Users className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Team Split</div>
                  <div className="text-xs opacity-80">Divide among agents</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Single Agent Selection */}
          {commissionType === 'single' && (
            <div>
              <Label htmlFor="single-agent">Select Agent</Label>
              <Select value={singleAgentId} onValueChange={setSingleAgentId}>
                <SelectTrigger id="single-agent">
                  <SelectValue placeholder="Choose agent..." />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name} ({agent.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Split Configuration */}
          {commissionType === 'split' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Commission Splits</Label>
                <Badge 
                  variant={totalSplitPercentage === 100 ? 'default' : 'destructive'}
                  className="gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  {totalSplitPercentage}% Total
                </Badge>
              </div>

              {totalSplitPercentage !== 100 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">
                    Split percentages must total exactly 100%. Current total: {totalSplitPercentage}%
                  </p>
                </div>
              )}

              {splits.map((split, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-xs">Agent {index + 1}</Label>
                        <Select
                          value={split.agentId}
                          onValueChange={(value) => updateSplit(index, 'agentId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select agent..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAgents.map(agent => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Percentage (%)</Label>
                          <Input
                            type="number"
                            value={split.percentage}
                            onChange={(e) => updateSplit(index, 'percentage', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Amount</Label>
                          <Input
                            type="text"
                            value={formatPKR((totalCommission * split.percentage) / 100)}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    {splits.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSplit(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              {splits.length < 5 && (
                <Button
                  variant="outline"
                  onClick={addSplit}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Agent
                </Button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Create Commission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}