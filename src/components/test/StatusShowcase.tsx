import React from 'react';
import { StatusBadge } from '../layout/StatusBadge';

/**
 * Status Showcase - Visual demonstration of semantic status colors
 * Phase 5: Semantic Colors & Status System
 */
export function StatusShowcase() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Semantic Status System
          </h1>
          <p className="text-muted-foreground">
            Phase 5: Brand-aligned status colors for aaraazi
          </p>
        </div>

        {/* Property Statuses */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Property Statuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <StatusBadge status="Available" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - Ready for sale/rent</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Under Contract" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Pending completion</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Sold" size="md" />
              <p className="text-sm text-muted-foreground">Warm Gray - Transaction complete</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Pending" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - In process</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Off Market" />
              <p className="text-sm text-muted-foreground">Neutral - Not currently listed</p>
            </div>
          </div>
        </div>

        {/* Lead Statuses */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Lead Statuses (5-Stage Pipeline)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <StatusBadge status="New" size="md" />
              <p className="text-sm text-muted-foreground">Blue - Just received</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Contacted" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Initial contact made</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Qualified" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - Meets criteria</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Negotiation" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Active negotiation</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Won" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - Converted to deal</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Lost" size="md" />
              <p className="text-sm text-muted-foreground">Red - Not converted</p>
            </div>
          </div>
        </div>

        {/* Deal Statuses */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Deal Statuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <StatusBadge status="Active" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - In progress</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="On Hold" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Temporarily paused</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Completed" size="md" />
              <p className="text-sm text-muted-foreground">Warm Gray - Successfully closed</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Cancelled" size="md" />
              <p className="text-sm text-muted-foreground">Red - Terminated</p>
            </div>
          </div>
        </div>

        {/* Transaction Statuses */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Transaction Statuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <StatusBadge status="Pending" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Awaiting processing</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="In Progress" size="md" />
              <p className="text-sm text-muted-foreground">Blue - Being processed</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Completed" size="md" />
              <p className="text-sm text-muted-foreground">Warm Gray - Finalized</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Failed" size="md" />
              <p className="text-sm text-muted-foreground">Red - Error occurred</p>
            </div>
          </div>
        </div>

        {/* Commission Statuses */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Commission Statuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <StatusBadge status="Pending" size="md" />
              <p className="text-sm text-muted-foreground">Terracotta - Awaiting approval</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Approved" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - Approved for payment</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Paid" size="md" />
              <p className="text-sm text-muted-foreground">Forest Green - Payment complete</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Cancelled" size="md" />
              <p className="text-sm text-muted-foreground">Red - Not payable</p>
            </div>
          </div>
        </div>

        {/* Size Variants */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Size Variants
          </h2>
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <StatusBadge status="Available" size="sm" />
              <p className="text-xs text-muted-foreground">Small (xs text)</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Available" size="md" />
              <p className="text-xs text-muted-foreground">Medium (default)</p>
            </div>
            <div className="space-y-2">
              <StatusBadge status="Available" size="lg" />
              <p className="text-xs text-muted-foreground">Large</p>
            </div>
          </div>
        </div>

        {/* All Variants Grid */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            All Status Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <StatusBadge status="Available" />
            <StatusBadge status="Active" />
            <StatusBadge status="Qualified" />
            <StatusBadge status="Won" />
            <StatusBadge status="Approved" />
            <StatusBadge status="Paid" />
            <StatusBadge status="Verified" />
            <StatusBadge status="Success" />
            <StatusBadge status="Published" />
            <StatusBadge status="Accepted" />
            
            <StatusBadge status="Pending" />
            <StatusBadge status="Under Contract" />
            <StatusBadge status="Contacted" />
            <StatusBadge status="Negotiation" />
            <StatusBadge status="On Hold" />
            <StatusBadge status="Review" />
            <StatusBadge status="Processing" />
            <StatusBadge status="Scheduled" />
            <StatusBadge status="Offers Received" />
            <StatusBadge status="In Progress" />
            
            <StatusBadge status="New" />
            <StatusBadge status="Draft" />
            <StatusBadge status="In Pipeline" />
            <StatusBadge status="Viewing Scheduled" />
            
            <StatusBadge status="Sold" />
            <StatusBadge status="Completed" />
            <StatusBadge status="Closed" />
            <StatusBadge status="Archived" />
            <StatusBadge status="Finalized" />
            <StatusBadge status="Settled" />
            
            <StatusBadge status="Cancelled" />
            <StatusBadge status="Lost" />
            <StatusBadge status="Rejected" />
            <StatusBadge status="Failed" />
            <StatusBadge status="Expired" />
            <StatusBadge status="Overdue" />
            <StatusBadge status="Declined" />
            <StatusBadge status="Terminated" />
            
            <StatusBadge status="Matched" />
            <StatusBadge status="Assigned" />
            <StatusBadge status="Notified" />
            <StatusBadge status="Sent" />
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Color Legend
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-success-bg border border-success/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-success"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Success - Forest Green</h3>
                <p className="text-sm text-muted-foreground">Positive outcomes, ready states</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-warning-bg border border-warning/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-warning"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Warning - Terracotta/Orange</h3>
                <p className="text-sm text-muted-foreground">Attention needed, in progress</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-info-bg border border-info/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-info"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Progress - Blue</h3>
                <p className="text-sm text-muted-foreground">Active work, new items</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-slate-700"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Neutral - Warm Gray</h3>
                <p className="text-sm text-muted-foreground">Completed, sold (not negative)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive-bg border border-destructive/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-destructive"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Destructive - Red</h3>
                <p className="text-sm text-muted-foreground">Errors, cancellations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-info-bg border border-info/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-info"></div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Info - Blue</h3>
                <p className="text-sm text-muted-foreground">Informational, matched</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-white border border-border-light rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Usage Example
          </h2>
          <div className="bg-neutral-100 border border-border rounded-lg p-4 mb-4">
            <code className="text-sm text-foreground font-mono">
              {`import { StatusBadge } from './components/layout/StatusBadge';

// Auto-mapping (recommended)
<StatusBadge status="Available" />

// Manual variant
<StatusBadge status="Custom" variant="warning" />

// With size
<StatusBadge status="Active" size="sm" />`}
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            The StatusBadge component automatically maps common status strings to the appropriate brand colors.
            See the documentation for the complete mapping table.
          </p>
        </div>

      </div>
    </div>
  );
}
