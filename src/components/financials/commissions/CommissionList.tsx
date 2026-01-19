import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { StatusBadge } from '../../layout/StatusBadge';
import { formatPKR } from '../../../lib/currency';
import { Eye, CheckCircle, XCircle, Edit, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export interface CommissionAgent {
  id: string;
  agentId: string;
  name: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  role?: string;
  dealId?: string;
  dealNumber?: string;
  propertyTitle?: string;
  createdAt?: string;
  approvedAt?: string;
  paidAt?: string;
}

interface CommissionListProps {
  commissions: CommissionAgent[];
  selectedCommissions: string[];
  onSelectionChange: (selected: string[]) => void;
  onViewDeal?: (dealId: string) => void;
  onApprove?: (commissionId: string) => void;
  onReject?: (commissionId: string) => void;
  onMarkPaid?: (commissionId: string) => void;
  userRole: 'admin' | 'agent';
}

/**
 * CommissionList Component
 * 
 * Table displaying all commission records with selection, filtering, and actions.
 * Integrates with Deal.financial.commission.agents data.
 * 
 * Design System V4.1 Compliant:
 * - Uses Shadcn Table components
 * - Uses StatusBadge for status display
 * - No Tailwind typography classes
 * - Follows 8px spacing grid
 * 
 * UX Laws Applied:
 * - Fitts's Law: Large checkboxes (44x44px target)
 * - Hick's Law: Actions in dropdown menu
 * - Jakob's Law: Standard table layout
 * 
 * Features:
 * - Multi-select with checkboxes
 * - Status badges with color coding
 * - Action dropdown per row
 * - Click row to view deal
 * - Admin-only actions (approve, reject, mark paid)
 * 
 * @example
 * <CommissionList
 *   commissions={commissions}
 *   selectedCommissions={selected}
 *   onSelectionChange={setSelected}
 *   onViewDeal={handleViewDeal}
 *   onApprove={handleApprove}
 *   userRole={user.role}
 * />
 */
export const CommissionList: React.FC<CommissionListProps> = ({
  commissions,
  selectedCommissions,
  onSelectionChange,
  onViewDeal,
  onApprove,
  onReject,
  onMarkPaid,
  userRole,
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(commissions.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (commissionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCommissions, commissionId]);
    } else {
      onSelectionChange(selectedCommissions.filter(id => id !== commissionId));
    }
  };

  const isAllSelected = commissions.length > 0 && selectedCommissions.length === commissions.length;
  const isSomeSelected = selectedCommissions.length > 0 && !isAllSelected;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                {...(isSomeSelected ? { indeterminate: true } : {})}
                onCheckedChange={handleSelectAll}
                aria-label="Select all commissions"
              />
            </TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Deal</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                No commissions found
              </TableCell>
            </TableRow>
          ) : (
            commissions.map((commission) => (
              <TableRow
                key={commission.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredRow(commission.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => {
                  if (commission.dealId && onViewDeal) {
                    onViewDeal(commission.dealId);
                  }
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedCommissions.includes(commission.id)}
                    onCheckedChange={(checked) => handleSelectOne(commission.id, checked as boolean)}
                    aria-label={`Select commission for ${commission.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{commission.name}</p>
                    {commission.agentId && (
                      <p className="text-gray-500">ID: {commission.agentId.slice(0, 8)}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {commission.dealNumber ? (
                      <>
                        <p className="text-gray-900">{commission.dealNumber}</p>
                        {commission.createdAt && (
                          <p className="text-gray-500">
                            {new Date(commission.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">-</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900 max-w-xs truncate" title={commission.propertyTitle}>
                    {commission.propertyTitle || '-'}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-600">{commission.role || 'Agent'}</p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-gray-900">{formatPKR(commission.amount)}</p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-gray-600">{commission.percentage.toFixed(2)}%</p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={commission.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {commission.dealId && onViewDeal && (
                        <DropdownMenuItem onClick={() => onViewDeal(commission.dealId!)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Deal
                        </DropdownMenuItem>
                      )}
                      
                      {userRole === 'admin' && (
                        <>
                          {commission.status === 'pending' && onApprove && (
                            <DropdownMenuItem 
                              onClick={() => onApprove(commission.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          
                          {commission.status === 'pending' && onReject && (
                            <DropdownMenuItem 
                              onClick={() => onReject(commission.id)}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          
                          {commission.status === 'approved' && onMarkPaid && (
                            <DropdownMenuItem 
                              onClick={() => onMarkPaid(commission.id)}
                              className="text-blue-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
