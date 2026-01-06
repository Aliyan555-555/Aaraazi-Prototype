import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { User } from '../types';
import { 
  Keyboard, 
  HelpCircle, 
  Zap, 
  ArrowRight, 
  Command,
  Search,
  Plus,
  X,
  Info,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartUXEnhancementsProps {
  user: User;
  currentPage: string;
  onNavigate?: (page: string, data?: any) => void;
}

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  scope?: string;
}

interface ContextualTip {
  id: string;
  page: string;
  title: string;
  description: string;
  element?: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const SmartUXEnhancements: React.FC<SmartUXEnhancementsProps> = ({ 
  user, 
  currentPage, 
  onNavigate 
}) => {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  // Keyboard shortcuts configuration
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Ctrl+K',
      description: 'Quick search (Global)',
      action: () => {
        // Focus search input if available
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          toast.info('Navigate to a page with search functionality');
        }
      }
    },
    {
      key: 'Ctrl+N',
      description: 'Create new (Context-aware)',
      action: () => {
        switch (currentPage) {
          case 'leads':
            onNavigate?.('add-lead');
            break;
          case 'inventory':
            onNavigate?.('add-property');
            break;
          case 'crm':
            // Trigger add contact dialog
            toast.info('Use the "Add Contact" button in CRM');
            break;
          default:
            onNavigate?.('add-property');
        }
      }
    },
    {
      key: 'Ctrl+D',
      description: 'Go to Dashboard',
      action: () => onNavigate?.('dashboard')
    },
    {
      key: 'Ctrl+L',
      description: 'Go to Leads',
      action: () => onNavigate?.('leads')
    },
    {
      key: 'Ctrl+I',
      description: 'Go to Inventory',
      action: () => onNavigate?.('inventory')
    },
    {
      key: 'Ctrl+R',
      description: 'Go to CRM',
      action: () => onNavigate?.('crm')
    },
    {
      key: 'Ctrl+F',
      description: 'Go to Financials',
      action: () => onNavigate?.('financials')
    },
    {
      key: 'Esc',
      description: 'Close dialogs/Cancel actions',
      action: () => {
        // Close any open dialogs
        const closeButtons = document.querySelectorAll('[aria-label="Close"]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
      }
    }
  ];

  // Contextual tips based on current page
  const contextualTips: ContextualTip[] = [
    {
      id: 'dashboard-overview',
      page: 'dashboard',
      title: 'Quick Actions Available',
      description: 'Use keyboard shortcuts Ctrl+N to quickly add new leads or properties from anywhere in the app.',
      action: {
        label: 'View Shortcuts',
        handler: () => setShowKeyboardHelp(true)
      }
    },
    {
      id: 'leads-conversion',
      page: 'leads',
      title: 'Convert Leads to CRM Contacts',
      description: 'When leads show interest, convert them to contacts in your CRM for better relationship management.',
      action: {
        label: 'Learn More',
        handler: () => toast.info('Use the CRM integration button on each lead to convert them to contacts')
      }
    },
    {
      id: 'inventory-smart-suggestions',
      page: 'inventory',
      title: 'Smart Property Insights',
      description: 'Orange action badges on properties show AI-powered suggestions for improving your listings.',
    },
    {
      id: 'crm-automation',
      page: 'crm',
      title: 'Automated Task Creation',
      description: 'The system automatically creates follow-up tasks based on your interactions and lead status changes.',
    },
    {
      id: 'property-detail-payments',
      page: 'property-detail',
      title: 'Payment Tracking',
      description: 'For sold properties, use the Payment Tracking section to monitor outstanding payments and progress.',
    },
    {
      id: 'financials-insights',
      page: 'financials',
      title: 'Financial Performance',
      description: 'Track your commission earnings and identify payment delays across all your properties.',
    }
  ];

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      try {
        // Ignore if user is typing in an input field
        if (event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement ||
            event.target instanceof HTMLSelectElement) {
          return;
        }

        // Only handle basic shortcuts to avoid complexity
        if (event.ctrlKey && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }

        if (event.key === '?' && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          setShowKeyboardHelp(true);
        }
      } catch (error) {
        console.error('Keyboard shortcut error:', error);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-show tips for new pages (simplified)
  useEffect(() => {
    try {
      const pageTips = contextualTips.filter(tip => 
        tip.page === currentPage && !dismissedTips.includes(tip.id)
      );
      
      if (pageTips.length > 0) {
        const timer = setTimeout(() => {
          setShowTips(true);
        }, 3000); // Show tips after 3 seconds
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Tips error:', error);
    }
  }, [currentPage]);

  const dismissTip = (tipId: string) => {
    setDismissedTips(prev => [...prev, tipId]);
  };

  const currentPageTips = contextualTips.filter(tip => 
    tip.page === currentPage && !dismissedTips.includes(tip.id)
  );

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <Button
          onClick={() => setShowKeyboardHelp(true)}
          className="rounded-full w-12 h-12 shadow-lg bg-gray-700 hover:bg-gray-800 text-white"
          size="sm"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Contextual Tips */}
      {currentPageTips.length > 0 && showTips && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          {currentPageTips.map((tip) => (
            <Card key={tip.id} className="mb-3 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">{tip.title}</h4>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      dismissTip(tip.id);
                      if (currentPageTips.length === 1) setShowTips(false);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-blue-800 mb-3">{tip.description}</p>
                {tip.action && (
                  <Button
                    size="sm"
                    onClick={tip.action.handler}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {tip.action.label}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Help Dialog */}
      <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Keyboard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Keyboard Shortcuts & Tips</DialogTitle>
                <DialogDescription>
                  Master aaraazi with these productivity shortcuts and tips
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Command className="h-4 w-4" />
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {shortcut.key}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pro Tips */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Pro Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Smart Assistant</p>
                    <p className="text-sm text-blue-700">
                      The floating brain icon provides AI-powered insights and task suggestions based on your data.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-md">
                  <Info className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Auto-created Tasks</p>
                    <p className="text-sm text-green-700">
                      The system automatically creates follow-up tasks when you add new leads or change property status.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-md">
                  <Info className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">CRM Integration</p>
                    <p className="text-sm text-orange-700">
                      Leads are automatically converted to CRM contacts when their status changes to "interested" or "converted".
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-md">
                  <Info className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Payment Tracking</p>
                    <p className="text-sm text-purple-700">
                      For sold properties, track payment progress and outstanding amounts in the Financials tab.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Page Context */}
            <div>
              <h3 className="font-semibold mb-3">Current Page: {currentPage}</h3>
              <div className="text-sm text-gray-600">
                {currentPage === 'dashboard' && 'Use the dashboard to get a quick overview of your leads, properties, and tasks.'}
                {currentPage === 'leads' && 'Manage your sales pipeline and convert interested leads to CRM contacts.'}
                {currentPage === 'inventory' && 'View and manage your property listings with smart AI suggestions.'}
                {currentPage === 'crm' && 'Manage contacts, interactions, and tasks for better client relationships.'}
                {currentPage === 'financials' && 'Track commissions, expenses, and payment status across all deals.'}
                {currentPage === 'property-detail' && 'Manage all aspects of a property deal from marketing to final payment.'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Press <Badge variant="outline" className="font-mono">?</Badge> anytime to open this help
            </div>
            <Button onClick={() => setShowKeyboardHelp(false)}>
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};