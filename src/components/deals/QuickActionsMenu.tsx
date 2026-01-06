/**
 * Quick Actions Menu Component
 * Contextual actions for deals
 */

import React from 'react';
import { Deal } from '../../types';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Share2,
  FileText,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface QuickActionsMenuProps {
  deal: Deal;
  userRole: 'primary' | 'secondary' | 'none';
  onAction: (action: QuickAction) => void;
}

export type QuickAction = 
  | 'view'
  | 'edit'
  | 'duplicate'
  | 'download-pdf'
  | 'notify-agents'
  | 'share'
  | 'progress-stage'
  | 'record-payment'
  | 'add-document'
  | 'complete-deal'
  | 'cancel-deal'
  | 'archive'
  | 'delete';

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ 
  deal, 
  userRole,
  onAction 
}) => {
  const isPrimary = userRole === 'primary';
  const canEdit = isPrimary;
  const isActive = deal.lifecycle.status === 'active';
  const isCompleted = deal.lifecycle.status === 'completed';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* View Actions */}
        <DropdownMenuItem onClick={() => onAction('view')}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        
        {canEdit && (
          <DropdownMenuItem onClick={() => onAction('edit')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Deal
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => onAction('duplicate')}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Deal
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Deal Actions */}
        {isActive && canEdit && (
          <>
            <DropdownMenuItem onClick={() => onAction('progress-stage')}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Progress Stage
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onAction('record-payment')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onAction('add-document')}>
              <FileText className="h-4 w-4 mr-2" />
              Add Document
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Export & Share */}
        <DropdownMenuItem onClick={() => onAction('download-pdf')}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onAction('share')}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Deal
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onAction('notify-agents')}>
          <Mail className="h-4 w-4 mr-2" />
          Notify Agents
        </DropdownMenuItem>
        
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            
            {/* Status Actions */}
            {isActive && (
              <>
                <DropdownMenuItem 
                  onClick={() => onAction('complete-deal')}
                  className="text-green-600"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onAction('cancel-deal')}
                  className="text-orange-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Deal
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuItem onClick={() => onAction('archive')}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => onAction('delete')}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Deal
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// PDF Generation helper
export const generateDealPDF = (deal: Deal): void => {
  // This is a placeholder - in production, you would use a library like jsPDF or pdfmake
  const content = `
DEAL SUMMARY
============

Deal Number: ${deal.dealNumber}
Status: ${deal.lifecycle.status}
Stage: ${deal.lifecycle.stage}

PARTIES
-------
Seller: ${deal.parties.seller.name}
Buyer: ${deal.parties.buyer.name}

PROPERTY
--------
Address: ${deal.property.address}
Type: ${deal.property.type}
Area: ${deal.property.area}

FINANCIAL
---------
Agreed Price: PKR ${deal.financial.agreedPrice.toLocaleString()}
Total Paid: PKR ${deal.financial.totalPaid.toLocaleString()}
Balance: PKR ${deal.financial.balanceRemaining.toLocaleString()}
Commission: PKR ${deal.financial.commission.total.toLocaleString()}

AGENTS
------
Primary Agent: ${deal.agents.primary.name} (${deal.agents.primary.role})
Secondary Agent: ${deal.agents.secondary?.name || 'N/A'}

TIMELINE
--------
Offer Accepted: ${new Date(deal.lifecycle.timeline.offerAcceptedDate).toLocaleDateString()}
Expected Closing: ${new Date(deal.lifecycle.timeline.expectedClosingDate).toLocaleDateString()}
${deal.lifecycle.timeline.actualClosingDate ? `Actual Closing: ${new Date(deal.lifecycle.timeline.actualClosingDate).toLocaleDateString()}` : ''}

TASKS
-----
Total Tasks: ${deal.tasks.length}
Completed: ${deal.tasks.filter(t => t.status === 'completed').length}
Pending: ${deal.tasks.filter(t => t.status === 'pending').length}

DOCUMENTS
---------
Total Documents: ${deal.documents.length}
Verified: ${deal.documents.filter(d => d.status === 'verified').length}
Pending: ${deal.documents.filter(d => d.status === 'required').length}

PAYMENTS
--------
${deal.financial.payments.map(p => 
  `${p.type}: PKR ${p.amount.toLocaleString()} - ${p.status} (Due: ${new Date(p.dueDate).toLocaleDateString()})`
).join('\n')}

---
Generated on ${new Date().toLocaleString()}
  `.trim();
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${deal.dealNumber}-summary.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Share functionality
export const shareDeal = (deal: Deal): void => {
  const shareUrl = `${window.location.origin}/deals/${deal.id}`;
  const shareText = `Deal ${deal.dealNumber}: ${deal.parties.seller.name} → ${deal.parties.buyer.name}`;
  
  if (navigator.share) {
    navigator.share({
      title: `Deal ${deal.dealNumber}`,
      text: shareText,
      url: shareUrl,
    }).catch(() => {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    });
  } else {
    // Fallback to clipboard
    copyToClipboard(shareUrl);
  }
};

const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).then(() => {
    // Could show a toast notification here
    console.log('Link copied to clipboard');
  });
};
