/**
 * DealKanbanCard Component
 * Custom Kanban card for Deals Workspace - Kanban View
 * 
 * Uses WorkspaceKanbanCard with deal-specific customization
 */

import React from 'react';
import { 
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Deal } from '../../types';
import { WorkspaceKanbanCard } from '../workspace/cards/WorkspaceKanbanCard';
import { formatPKR } from '../../lib/currency';

export interface DealKanbanCardProps {
  deal: Deal;
  onClick?: () => void;
}

/**
 * DealKanbanCard - Custom card for deal kanban view
 */
export const DealKanbanCard: React.FC<DealKanbanCardProps> = ({
  deal,
  onClick,
}) => {
  // Calculate payment progress
  const paymentProgress = deal.financial.agreedPrice > 0
    ? Math.round((deal.financial.totalPaid / deal.financial.agreedPrice) * 100)
    : 0;

  // Calculate days to closing
  const getDaysToClosing = () => {
    const expectedDate = new Date(deal.lifecycle.timeline.expectedClosingDate);
    const now = new Date();
    const diffTime = expectedDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysToClosing = getDaysToClosing();

  // Determine priority based on days to closing
  let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
  if (daysToClosing < 0) {
    priority = 'urgent';
  } else if (daysToClosing <= 3) {
    priority = 'high';
  } else if (daysToClosing <= 7) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  // Build tags
  const tags: Array<{ label: string; variant: 'default' | 'success' | 'info' | 'warning' }> = [];
  
  if (deal.cycles.purchaseCycle) {
    tags.push({ label: 'Dual Agent', variant: 'info' });
  }
  
  if (paymentProgress === 100) {
    tags.push({ label: 'Paid', variant: 'success' });
  } else if (paymentProgress > 0) {
    tags.push({ label: `${paymentProgress}% Paid`, variant: 'info' });
  }

  if (daysToClosing < 0) {
    tags.push({ label: 'Overdue', variant: 'warning' });
  }

  // Build metadata
  const metadata = [
    {
      icon: <DollarSign className="h-3.5 w-3.5" />,
      label: formatPKR(deal.financial.agreedPrice),
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      label: deal.parties.buyer.name,
    },
    {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      label: `${paymentProgress}% paid`,
    },
  ];

  // Add closing date or overdue indicator
  if (daysToClosing >= 0) {
    metadata.push({
      icon: <Calendar className="h-3.5 w-3.5" />,
      label: `${daysToClosing} days to close`,
    });
  } else {
    metadata.push({
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      label: `${Math.abs(daysToClosing)} days overdue`,
    });
  }

  return (
    <WorkspaceKanbanCard
      title={deal.dealNumber}
      subtitle={`${deal.parties.buyer.name} • ${formatPKR(deal.financial.agreedPrice)}`}
      priority={priority}
      tags={tags.slice(0, 2)} // Max 2 tags for kanban
      metadata={metadata.slice(0, 4)} // Max 4 metadata items
      onClick={onClick}
    />
  );
};
