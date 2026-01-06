import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { User } from '../types';
import { getLeads, getProperties } from '../lib/data';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  X,
  Brain,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartAssistantLiteProps {
  user: User;
  currentPage: string;
  onNavigate?: (page: string, data?: any) => void;
}

interface SimpleInsight {
  id: string;
  type: 'alert' | 'opportunity' | 'suggestion';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  priority: 'high' | 'medium' | 'low';
}

export const SmartAssistantLite: React.FC<SmartAssistantLiteProps> = ({ 
  user, 
  currentPage, 
  onNavigate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights, setInsights] = useState<SimpleInsight[]>([]);

  // Simple, fast data loading
  const leads = useMemo(() => {
    try {
      return getLeads(user.id, user.role);
    } catch {
      return [];
    }
  }, [user.id, user.role]);

  const properties = useMemo(() => {
    try {
      return getProperties(user.id, user.role);
    } catch {
      return [];
    }
  }, [user.id, user.role]);

  // Lightweight insight generation - only check essential items
  useEffect(() => {
    const newInsights: SimpleInsight[] = [];

    // Only check for new leads (most important)
    const newLeads = leads.filter(l => l.status === 'new');
    if (newLeads.length > 0) {
      newInsights.push({
        id: 'new-leads',
        type: 'alert',
        title: `${newLeads.length} New Lead${newLeads.length > 1 ? 's' : ''}`,
        description: 'New leads need immediate attention for best results.',
        action: {
          label: 'View Leads',
          handler: () => onNavigate?.('leads')
        },
        priority: 'high'
      });
    }

    // Check for properties in negotiation (second most important)
    const negotiating = properties.filter(p => p.status === 'negotiation');
    if (negotiating.length > 0) {
      newInsights.push({
        id: 'negotiations',
        type: 'opportunity',
        title: `${negotiating.length} Active Deal${negotiating.length > 1 ? 's' : ''}`,
        description: 'Properties in negotiation need follow-up.',
        action: {
          label: 'Check Status',
          handler: () => onNavigate?.('inventory')
        },
        priority: 'high'
      });
    }

    // Simple performance tip
    if (leads.length > 0 && newInsights.length === 0) {
      newInsights.push({
        id: 'performance-tip',
        type: 'suggestion',
        title: 'Great Job! 👍',
        description: 'All your leads and deals are up to date.',
        priority: 'low'
      });
    }

    setInsights(newInsights);
  }, [leads.length, properties.length, onNavigate]);

  const dismissInsight = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    toast.success('Insight dismissed');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'suggestion': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (type === 'opportunity') return 'text-green-600 bg-green-50 border-green-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const highPriorityCount = insights.filter(i => i.priority === 'high').length;

  if (insights.length === 0) return null;

  return (
    <>
      {/* Simple Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            highPriorityCount > 0 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <div className="relative">
            <Brain className="h-6 w-6" />
            {highPriorityCount > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {highPriorityCount}
                </span>
              </div>
            )}
          </div>
        </Button>
      </div>

      {/* Simple Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle>Smart Assistant</DialogTitle>
                <DialogDescription>
                  Quick insights for your business
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <Card
                    key={insight.id}
                    className={`border ${getInsightColor(insight.type, insight.priority)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="h-4 w-4 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{insight.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {insight.description}
                            </p>
                            {insight.action && (
                              <Button
                                size="sm"
                                onClick={insight.action.handler}
                                className="mr-2"
                              >
                                {insight.action.label}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissInsight(insight.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <div className="pt-3 border-t text-center">
            <div className="text-sm text-gray-600">
              {insights.length} insight{insights.length !== 1 ? 's' : ''} • Lightweight mode
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};