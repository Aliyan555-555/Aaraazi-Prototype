/**
 * Deal Empty States
 * User-friendly empty state messages
 */

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  FileText, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  FileCheck,
  Calendar,
  TrendingUp,
  Plus,
  Archive
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        {icon || <FileText className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// No Deals
export const NoDealsEmptyState: React.FC<{ onCreateDeal?: () => void }> = ({ onCreateDeal }) => {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="No deals yet"
      description="Get started by creating your first deal from an accepted offer. Track payments, manage tasks, and collaborate with other agents."
      action={onCreateDeal ? {
        label: 'Create First Deal',
        onClick: onCreateDeal
      } : undefined}
    />
  );
};

// No Search Results
export const NoSearchResultsEmptyState: React.FC<{ onClearSearch: () => void }> = ({ onClearSearch }) => {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No deals found"
      description="We couldn't find any deals matching your search criteria. Try adjusting your search terms or filters."
      action={{
        label: 'Clear Search',
        onClick: onClearSearch
      }}
    />
  );
};

// No Filtered Results
export const NoFilteredResultsEmptyState: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => {
  return (
    <EmptyState
      icon={<Filter className="h-8 w-8 text-muted-foreground" />}
      title="No matching deals"
      description="No deals match your current filter settings. Try adjusting or clearing your filters to see more results."
      action={{
        label: 'Clear All Filters',
        onClick: onClearFilters
      }}
    />
  );
};

// No Active Deals
export const NoActiveDealsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
      title="No active deals"
      description="You don't have any active deals at the moment. All your deals have been completed or cancelled."
    />
  );
};

// No Completed Deals
export const NoCompletedDealsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<CheckCircle2 className="h-8 w-8 text-muted-foreground" />}
      title="No completed deals"
      description="You haven't completed any deals yet. Keep working on your active deals to see them here once they're done."
    />
  );
};

// No Cancelled Deals
export const NoCancelledDealsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />}
      title="No cancelled deals"
      description="Great! You don't have any cancelled deals. All your deals are either active or completed successfully."
    />
  );
};

// No Tasks
export const NoTasksEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
      title="All tasks completed"
      description="Excellent work! All tasks for this stage have been completed. You can now progress to the next stage."
    />
  );
};

// No Pending Tasks
export const NoPendingTasksEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
      title="No pending tasks"
      description="All tasks are up to date. New tasks will appear as you progress through deal stages."
    />
  );
};

// No Documents
export const NoDocumentsEmptyState: React.FC<{ onAddDocument?: () => void }> = ({ onAddDocument }) => {
  return (
    <EmptyState
      icon={<FileCheck className="h-8 w-8 text-muted-foreground" />}
      title="No documents yet"
      description="Upload required documents for this deal to keep everything organized and ensure compliance."
      action={onAddDocument ? {
        label: 'Add Document',
        onClick: onAddDocument
      } : undefined}
    />
  );
};

// No Payments
export const NoPaymentsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
      title="No payments scheduled"
      description="Payment schedule will be generated based on the deal terms and stages."
    />
  );
};

// No Overdue Payments
export const NoOverduePaymentsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
      title="All payments on track"
      description="Great! There are no overdue payments. All payments are either completed or scheduled for the future."
    />
  );
};

// No Notes
export const NoNotesEmptyState: React.FC<{ onAddNote?: () => void }> = ({ onAddNote }) => {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="No notes yet"
      description="Add notes to keep track of important information, discussions, and updates about this deal."
      action={onAddNote ? {
        label: 'Add First Note',
        onClick: onAddNote
      } : undefined}
    />
  );
};

// No Analytics Data
export const NoAnalyticsDataEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
      title="Not enough data"
      description="Analytics will be available once you have more deal activity. Create and manage deals to see insights here."
    />
  );
};

// No Commission Data
export const NoCommissionDataEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
      title="No commission earned yet"
      description="Commission will appear here once you complete deals. Keep working on your active deals to earn commission."
    />
  );
};

// Access Denied
export const AccessDeniedEmptyState: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <EmptyState
      icon={<AlertCircle className="h-8 w-8 text-red-600" />}
      title="Access Denied"
      description={message || "You don't have permission to view this content. Contact the deal owner for access."}
    />
  );
};

// Error State
export const ErrorEmptyState: React.FC<{ 
  message?: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => {
  return (
    <EmptyState
      icon={<AlertCircle className="h-8 w-8 text-red-600" />}
      title="Something went wrong"
      description={message || "We encountered an error while loading this content. Please try again."}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry
      } : undefined}
    />
  );
};

// Archived Deals
export const ArchivedDealsEmptyState: React.FC = () => {
  return (
    <EmptyState
      icon={<Archive className="h-8 w-8 text-muted-foreground" />}
      title="No archived deals"
      description="Deals you archive will appear here. Archived deals can be restored or permanently deleted."
    />
  );
};

// Generic Card Empty State (for use inside cards)
export const CardEmptyState: React.FC<{
  icon?: React.ReactNode;
  message: string;
}> = ({ icon, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="h-12 w-12 rounded-full bg-accent/50 flex items-center justify-center mb-3">
        {icon || <FileText className="h-6 w-6 text-muted-foreground" />}
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
