/**
 * ActionItem Component
 * 
 * Displays a single action item with priority indicator and quick action.
 * 
 * FEATURES:
 * - Priority color coding (critical=red, high=orange, medium=yellow, low=blue)
 * - Icon based on action type
 * - Clear title and description
 * - Quick action button
 * - Clickable to navigate
 * 
 * DESIGN:
 * - Follows Design System V4.1
 * - NO Tailwind typography classes
 * - Accessible (keyboard nav, ARIA labels)
 * 
 * UX LAWS:
 * - Fitts's Law: Full-width click target
 * - Aesthetic-Usability: Clean, professional
 */

import React from 'react';
import { DashboardAction, ActionPriority } from '../utils/detectActions';
import {
  AlertCircle,
  Clock,
  Home,
  FileText,
  Calendar,
  UserPlus,
  ChevronRight,
} from 'lucide-react';

interface ActionItemProps {
  action: DashboardAction;
  onClick: () => void;
  onQuickAction?: () => void;
}

/**
 * Get icon based on action type
 */
function getActionIcon(type: DashboardAction['type']) {
  switch (type) {
    case 'overdue-task':
      return <AlertCircle className="h-5 w-5" />;
    case 'stale-lead':
      return <Clock className="h-5 w-5" />;
    case 'inactive-property':
      return <Home className="h-5 w-5" />;
    case 'expiring-offer':
      return <FileText className="h-5 w-5" />;
    case 'upcoming-appointment':
      return <Calendar className="h-5 w-5" />;
    case 'new-lead':
      return <UserPlus className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
}

/**
 * Get colors based on priority
 */
function getPriorityColors(priority: ActionPriority) {
  switch (priority) {
    case 'critical':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
      };
    case 'high':
      return {
        border: 'border-l-orange-500',
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700',
      };
    case 'medium':
      return {
        border: 'border-l-yellow-500',
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-700',
      };
    case 'low':
      return {
        border: 'border-l-blue-500',
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      };
  }
}

/**
 * Format priority label
 */
function formatPriority(priority: ActionPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * ActionItem Component
 */
export const ActionItem: React.FC<ActionItemProps> = ({
  action,
  onClick,
  onQuickAction,
}) => {
  const colors = getPriorityColors(action.priority);
  const icon = getActionIcon(action.type);

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAction) {
      onQuickAction();
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${colors.bg} ${colors.border}
        border-l-4 rounded-lg p-4
        hover:shadow-md transition-shadow cursor-pointer
        group
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${action.title} - ${action.description}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority Badge */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-[#1A1D1F] flex-1 truncate">
              {action.title}
            </h3>
            <span className={`${colors.badge} px-2 py-0.5 rounded text-xs flex-shrink-0`}>
              {formatPriority(action.priority)}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#363F47] text-sm mb-2">
            {action.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-[#6B7280]">
            {action.daysOverdue !== undefined && (
              <span>
                {action.daysOverdue} {action.daysOverdue === 1 ? 'day' : 'days'} overdue
              </span>
            )}
            <span className="capitalize">{action.entityType}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleQuickAction}
          className={`
            ${colors.icon}
            px-3 py-1.5 rounded-md
            border border-current
            hover:bg-white
            transition-colors
            text-sm
            flex-shrink-0
            opacity-0 group-hover:opacity-100
            focus:opacity-100
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2D6A54]
          `}
          aria-label={action.actionLabel}
        >
          {action.actionLabel}
        </button>

        {/* Chevron */}
        <ChevronRight className="h-5 w-5 text-[#6B7280] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
