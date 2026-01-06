/**
 * Payment Tracker Component
 * Visual payment schedule with tracking
 */

import React, { useState } from 'react';
import { Deal, DealPayment } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { PermissionGate } from './PermissionGate';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Calendar,
  DollarSign,
  Receipt,
  Download
} from 'lucide-react';
import { formatPKR } from '../../lib/currency';

interface PaymentTrackerProps {
  deal: Deal;
  currentUserId: string;
  onRecordPayment?: (payment: DealPayment) => void;
  onDownloadReceipt?: (payment: DealPayment) => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({ 
  deal, 
  currentUserId,
  onRecordPayment,
  onDownloadReceipt
}) => {
  const totalAmount = deal.financial.agreedPrice;
  const totalPaid = deal.financial.totalPaid;
  const balance = deal.financial.balanceRemaining;
  const progressPercent = (totalPaid / totalAmount) * 100;
  
  const getPaymentStatus = (payment: DealPayment): { 
    icon: React.ReactNode; 
    color: string; 
    label: string;
  } => {
    if (payment.status === 'paid') {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        color: 'bg-green-100 text-green-800',
        label: 'Paid'
      };
    }
    
    if (payment.status === 'overdue') {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        color: 'bg-red-100 text-red-800',
        label: 'Overdue'
      };
    }
    
    return {
      icon: <Circle className="h-5 w-5 text-gray-400" />,
      color: 'bg-gray-100 text-gray-800',
      label: 'Pending'
    };
  };
  
  const getPaymentTypeDisplay = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Payment Progress</span>
                <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
            
            {/* Amounts */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Total Amount</div>
                <div className="text-lg font-semibold">{formatPKR(totalAmount)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Paid</div>
                <div className="text-lg font-semibold text-green-600">{formatPKR(totalPaid)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Balance</div>
                <div className="text-lg font-semibold text-orange-600">{formatPKR(balance)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deal.financial.payments.map((payment, index) => {
              const status = getPaymentStatus(payment);
              const isPaid = payment.status === 'paid';
              
              return (
                <div 
                  key={payment.id}
                  className={`p-4 border rounded-lg ${isPaid ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex items-start gap-3 flex-1">
                      {/* Status Icon */}
                      <div className="mt-1">
                        {status.icon}
                      </div>
                      
                      {/* Payment Info */}
                      <div className="flex-1 space-y-2">
                        {/* Type & Status */}
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {getPaymentTypeDisplay(payment.type)}
                          </h4>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                          {payment.syncedToPurchaseCycle && deal.agents.secondary && (
                            <Badge variant="outline" className="text-xs">
                              Synced
                            </Badge>
                          )}
                        </div>
                        
                        {/* Amount & Percentage */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{formatPKR(payment.amount)}</span>
                            <span className="text-muted-foreground">({payment.percentage}%)</span>
                          </div>
                          
                          {/* Due Date */}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Payment Details (if paid) */}
                        {isPaid && (
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Paid on: {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'N/A'}</div>
                            {payment.paymentMethod && (
                              <div>Method: {payment.paymentMethod}</div>
                            )}
                            {payment.referenceNumber && (
                              <div>Reference: {payment.referenceNumber}</div>
                            )}
                            {payment.recordedBy && (
                              <div>Recorded by: {payment.recordedBy.agentName}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Side - Actions */}
                    <div className="flex items-center gap-2">
                      {!isPaid && (
                        <PermissionGate
                          deal={deal}
                          userId={currentUserId}
                          permission="canUpdatePayments"
                          showMessage={false}
                        >
                          <Button
                            size="sm"
                            onClick={() => onRecordPayment?.(payment)}
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            Record Payment
                          </Button>
                        </PermissionGate>
                      )}
                      
                      {isPaid && payment.receiptUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadReceipt?.(payment)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Transfer Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer & Closing Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stamp Duty (4%)</span>
              <span className="font-medium">{formatPKR(deal.financial.transferCosts.stampDuty)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration Fee</span>
              <span className="font-medium">{formatPKR(deal.financial.transferCosts.registrationFee)}</span>
            </div>
            {deal.financial.transferCosts.legalFees > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Legal Fees</span>
                <span className="font-medium">{formatPKR(deal.financial.transferCosts.legalFees)}</span>
              </div>
            )}
            {deal.financial.transferCosts.societyFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Society Fee</span>
                <span className="font-medium">{formatPKR(deal.financial.transferCosts.societyFee)}</span>
              </div>
            )}
            {deal.financial.transferCosts.other > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other Costs</span>
                <span className="font-medium">{formatPKR(deal.financial.transferCosts.other)}</span>
              </div>
            )}
            <div className="pt-2 border-t flex justify-between font-semibold">
              <span>Total Transfer Costs</span>
              <span>{formatPKR(deal.financial.transferCosts.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
