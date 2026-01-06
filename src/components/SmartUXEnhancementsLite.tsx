import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { User } from '../types';
import { 
  HelpCircle, 
  X, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartUXEnhancementsLiteProps {
  user: User;
  currentPage: string;
  onNavigate?: (page: string) => void;
}

interface QuickTip {
  id: string;
  page: string;
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const SmartUXEnhancementsLite: React.FC<SmartUXEnhancementsLiteProps> = ({ 
  user, 
  currentPage, 
  onNavigate 
}) => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<QuickTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  // Simple context-aware tips
  const tips: QuickTip[] = [
    {
      id: 'dashboard-overview',
      page: 'dashboard',
      title: 'Quick Dashboard Tip',
      description: 'Use the quick action buttons to add properties and leads faster.',
      action: {
        label: 'Got it',
        handler: () => setShowTip(false)
      }
    },
    {
      id: 'inventory-tip',
      page: 'inventory',
      title: 'Property Management',
      description: 'Click on any property card to view detailed information and track payments.',
      action: {
        label: 'Understood',
        handler: () => setShowTip(false)
      }
    },
    {
      id: 'leads-tip',
      page: 'leads',
      title: 'Lead Management',
      description: 'Convert interested leads to CRM contacts for better relationship tracking.',
      action: {
        label: 'Thanks',
        handler: () => setShowTip(false)
      }
    }
  ];

  useEffect(() => {
    // Show tip for current page if not dismissed
    const pageTip = tips.find(tip => tip.page === currentPage);
    if (pageTip && !dismissedTips.includes(pageTip.id)) {
      // Delay to prevent blocking
      const timer = setTimeout(() => {
        setCurrentTip(pageTip);
        setShowTip(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, dismissedTips]);

  const dismissTip = (tipId: string) => {
    setDismissedTips(prev => {
      const newDismissed = [...prev, tipId];
      try {
        localStorage.setItem(`dismissed_tips_${user.id}`, JSON.stringify(newDismissed));
      } catch (error) {
        console.error('Error storing dismissed tips:', error);
      }
      return newDismissed;
    });
    setShowTip(false);
    toast.success('Tip dismissed');
  };

  // Load dismissed tips on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dismissed_tips_${user.id}`);
      if (stored) {
        setDismissedTips(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading dismissed tips:', error);
    }
  }, [user.id]);

  if (!showTip || !currentTip) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm">
      <Card className="shadow-lg border-l-4 border-l-blue-500 animate-in slide-in-from-bottom-2">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-sm">{currentTip.title}</h4>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissTip(currentTip.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {currentTip.description}
          </p>
          {currentTip.action && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={currentTip.action.handler}
                className="flex-1"
              >
                {currentTip.action.label}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};