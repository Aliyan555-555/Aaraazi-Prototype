import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { User, Lead, Property, Contact, Task } from '../types';
import { 
  getLeads, 
  getProperties, 
  createSmartTasks,
  convertLeadToContact 
} from '../lib/data';
import { 
  Lightbulb, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  X,
  Zap,
  Brain,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  DollarSign,
  Home,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartAssistantProps {
  user: User;
  currentPage: string;
  onNavigate?: (page: string, data?: any) => void;
}

interface SmartInsight {
  id: string;
  type: 'suggestion' | 'alert' | 'opportunity' | 'task';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ 
  user, 
  currentPage, 
  onNavigate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized data with error handling
  const leads = useMemo(() => {
    try {
      return getLeads(user.id, user.role);
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }, [user.id, user.role]);

  const properties = useMemo(() => {
    try {
      return getProperties(user.id, user.role);
    } catch (error) {
      console.error('Error loading properties:', error);
      return [];
    }
  }, [user.id, user.role]);

  // Debounced insight generation
  const generateSmartInsights = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Use setTimeout to make this async and prevent blocking
      setTimeout(() => {
        const newInsights: SmartInsight[] = [];

        // 1. New Leads Alert
        const newLeads = leads.filter(l => l.status === 'new');
        if (newLeads.length > 0) {
          newInsights.push({
            id: 'new-leads-alert',
            type: 'alert',
            title: `${newLeads.length} New Lead${newLeads.length > 1 ? 's' : ''} Awaiting Contact`,
            description: 'Research shows that contacting new leads within 1 hour increases conversion by 60x.',
            action: {
              label: 'Contact Now',
              handler: () => onNavigate?.('leads')
            },
            priority: 'high',
            category: 'Urgent Action'
          });
        }

        // 2. Stale Leads Opportunity
        const staleLeads = leads.filter(l => {
          if (l.status !== 'contacted') return false;
          const daysSinceUpdate = Math.floor(
            (new Date().getTime() - new Date(l.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceUpdate > 5;
        });

        if (staleLeads.length > 0) {
          newInsights.push({
            id: 'stale-leads-opportunity',
            type: 'opportunity',
            title: `${staleLeads.length} Lead${staleLeads.length > 1 ? 's' : ''} Need Follow-up`,
            description: 'These leads haven\'t been updated recently. A simple follow-up could re-engage them.',
            action: {
              label: 'Review & Contact',
              handler: () => onNavigate?.('leads')
            },
            priority: 'medium',
            category: 'Follow-up'
          });
        }

        // 3. Properties in Negotiation
        const negotiationProperties = properties.filter(p => p.status === 'negotiation');
        if (negotiationProperties.length > 0) {
          newInsights.push({
            id: 'negotiation-follow-up',
            type: 'task',
            title: `${negotiationProperties.length} Active Negotiation${negotiationProperties.length > 1 ? 's' : ''}`,
            description: 'Keep momentum alive with regular check-ins and updates to close deals faster.',
            action: {
              label: 'Review Deals',
              handler: () => {
                negotiationProperties.forEach(property => {
                  createSmartTasks('property_negotiation', property.id, user.id);
                });
                toast.success(`Created ${negotiationProperties.length} follow-up task${negotiationProperties.length > 1 ? 's' : ''}`);
              }
            },
            priority: 'high',
            category: 'Active Deals'
          });
        }

        // 4. Long-term Listings Suggestion
        const oldListings = properties.filter(p => {
          if (p.status !== 'available') return false;
          const daysSinceListed = Math.floor(
            (new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceListed > 30;
        });

        if (oldListings.length > 0) {
          newInsights.push({
            id: 'old-listings-suggestion',
            type: 'suggestion',
            title: `${oldListings.length} Listing${oldListings.length > 1 ? 's' : ''} Over 30 Days`,
            description: 'Consider refreshing photos, adjusting price, or enhancing marketing strategy.',
            action: {
              label: 'Optimize Listings',
              handler: () => onNavigate?.('inventory')
            },
            priority: 'medium',
            category: 'Marketing'
          });
        }

        // 5. CRM Integration Opportunity
        if (currentPage === 'leads') {
          const interestedLeads = leads.filter(l => l.status === 'interested');
          if (interestedLeads.length > 0) {
            newInsights.push({
              id: 'convert-interested-leads',
              type: 'opportunity',
              title: 'Smart CRM Integration Available',
              description: `Convert ${interestedLeads.length} interested lead${interestedLeads.length > 1 ? 's' : ''} to contacts for better relationship management.`,
              action: {
                label: 'Auto-Convert',
                handler: () => {
                  let converted = 0;
                  interestedLeads.forEach(lead => {
                    if (convertLeadToContact(lead.id)) converted++;
                  });
                  toast.success(`Successfully converted ${converted} lead${converted > 1 ? 's' : ''} to CRM contacts`);
                  // Refresh insights after conversion
                  setTimeout(() => generateSmartInsights(), 1000);
                }
              },
              priority: 'medium',
              category: 'CRM Optimization'
            });
          }
        }

        // 6. Performance Insights
        const thisMonthLeads = leads.filter(l => {
          const leadDate = new Date(l.createdAt);
          const now = new Date();
          return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
        });

        if (thisMonthLeads.length > 5) {
          const conversionRate = (thisMonthLeads.filter(l => l.status === 'converted').length / thisMonthLeads.length) * 100;
          
          if (conversionRate > 15) {
            newInsights.push({
              id: 'high-performance-celebration',
              type: 'suggestion',
              title: 'Excellent Performance! 🎉',
              description: `Your conversion rate is ${conversionRate.toFixed(1)}% this month - that's outstanding!`,
              action: {
                label: 'View Analytics',
                handler: () => onNavigate?.('financials')
              },
              priority: 'low',
              category: 'Performance'
            });
          } else if (conversionRate < 8) {
            newInsights.push({
              id: 'improve-conversion-tip',
              type: 'suggestion',
              title: 'Boost Your Conversion Rate',
              description: `Current rate: ${conversionRate.toFixed(1)}%. Quick tip: Follow up within 1 hour of lead inquiry.`,
              action: {
                label: 'Get More Tips',
                handler: () => {
                  toast.info('💡 Pro tip: Use the CRM to set automated follow-up reminders and never miss an opportunity!');
                }
              },
              priority: 'medium',
              category: 'Performance'
            });
          }
        }

        // Filter out dismissed insights and set state
        const filteredInsights = newInsights.filter(insight => !dismissedInsights.includes(insight.id));
        setInsights(filteredInsights);
        setIsLoading(false);
      }, 100); // Small delay to prevent blocking

    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights([]);
      setIsLoading(false);
    }
  }, [leads, properties, currentPage, dismissedInsights, onNavigate, user.id, isLoading]);

  // Debounced effect to prevent too many calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSmartInsights();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [leads.length, properties.length, currentPage]);

  const dismissInsight = useCallback((insightId: string) => {
    setDismissedInsights(prev => {
      const newDismissed = [...prev, insightId];
      // Store in localStorage to persist across sessions
      try {
        localStorage.setItem(`dismissed_insights_${user.id}`, JSON.stringify(newDismissed));
      } catch (error) {
        console.error('Error storing dismissed insights:', error);
      }
      return newDismissed;
    });
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    toast.success('Insight dismissed');
  }, [user.id]);

  // Load dismissed insights from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dismissed_insights_${user.id}`);
      if (stored) {
        setDismissedInsights(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading dismissed insights:', error);
    }
  }, [user.id]);

  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const sortedInsights = insights.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'task': return Calendar;
      case 'suggestion': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (type === 'opportunity') return 'text-green-600 bg-green-50 border-green-200';
    if (type === 'task') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const highPriorityCount = insights.filter(i => i.priority === 'high').length;
  
  if (insights.length === 0 && !isLoading) return null;

  return (
    <>
      {/* Floating Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className={`rounded-full w-16 h-16 shadow-xl transition-all duration-300 ${
              highPriorityCount > 0 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white`}
            size="lg"
            disabled={isLoading}
          >
            <div className="relative">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Brain className="h-7 w-7" />
              )}
              {highPriorityCount > 0 && !isLoading && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs text-white font-bold">
                    {highPriorityCount}
                  </span>
                </div>
              )}
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {isLoading ? 'Analyzing...' : insights.length > 0 ? `${insights.length} AI insight${insights.length > 1 ? 's' : ''}` : 'AI Assistant'}
          </div>
        </div>
      </div>

      {/* Smart Assistant Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl flex items-center gap-2">
                  Smart Assistant
                  {highPriorityCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {highPriorityCount} Urgent
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  AI-powered insights and automated task suggestions for your real estate business
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Analyzing your data...</p>
              </div>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-gray-600">No urgent items need your attention right now.</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[55vh]">
              <div className="space-y-4">
                {sortedInsights.map((insight, index) => {
                  const Icon = getInsightIcon(insight.type);
                  return (
                    <Card
                      key={insight.id}
                      className={`border transition-all duration-200 hover:shadow-md ${getInsightColor(insight.type, insight.priority)}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-2 rounded-lg bg-white/50">
                              <Icon className="h-5 w-5 flex-shrink-0" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{insight.title}</h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/50"
                                >
                                  {insight.category}
                                </Badge>
                                <Badge
                                  className={`text-xs ${getPriorityBadgeColor(insight.priority)}`}
                                >
                                  {insight.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm mb-4 leading-relaxed">
                                {insight.description}
                              </p>
                              {insight.action && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={insight.action.handler}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                  >
                                    {insight.action.label}
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => dismissInsight(insight.id)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    Dismiss
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          <div className="pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>AI-Powered</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>Updated every 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDismissedInsights([]);
                    localStorage.removeItem(`dismissed_insights_${user.id}`);
                    generateSmartInsights();
                    toast.success('All insights restored');
                  }}
                >
                  Reset All
                </Button>
                <div className="text-sm text-gray-600">
                  {insights.length} active insight{insights.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};