/**
 * Notification Test Panel - V3.0
 * Development tool for testing notification system
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User } from '../types';
import {
  notifyOfferReceived,
  notifyPropertyMatch,
  notifyFollowUpReminder,
  notifyRelistingOpportunity,
  notifyCommissionEarned,
  notifyLeadStatusChange,
  notifyOfferStatusChange,
  createNotification,
} from '../lib/notifications';
import { toast } from 'sonner@2.0.3';
import { 
  DollarSign, 
  Home, 
  Bell, 
  TrendingUp, 
  Users,
  Calendar,
  FileText,
  Zap
} from 'lucide-react';

interface NotificationTestPanelProps {
  user: User;
  onUpdate: () => void;
}

export function NotificationTestPanel({ user, onUpdate }: NotificationTestPanelProps) {
  const triggerTestNotification = (type: string) => {
    try {
      switch (type) {
        case 'offer-received':
          notifyOfferReceived(user.id, {
            propertyAddress: '123 Main Street, DHA Phase 5',
            sellCycleId: 'test-sell-cycle-1',
            buyerName: 'Ahmed Khan',
            offerAmount: 25000000,
            offerId: 'test-offer-1',
          });
          break;

        case 'property-match':
          notifyPropertyMatch(user.id, {
            buyerRequirementId: 'test-req-1',
            buyerName: 'Sara Ahmed',
            propertyAddress: '456 Park Avenue, Clifton',
            propertyId: 'test-prop-1',
            matchScore: 85,
          });
          break;

        case 'follow-up-reminder':
          notifyFollowUpReminder(user.id, {
            leadId: 'test-lead-1',
            leadName: 'Hassan Ali',
            leadContact: '+92-300-1234567',
            dueDate: new Date().toISOString(),
          });
          break;

        case 'relisting-opportunity':
          notifyRelistingOpportunity(user.id, {
            propertyId: 'test-prop-2',
            propertyAddress: '789 Ocean View, Sea View',
            soldDate: '2024-09-15',
          });
          break;

        case 'commission-earned':
          notifyCommissionEarned(user.id, {
            amount: 500000,
            propertyAddress: '321 Garden Road, Gulshan',
            transactionId: 'test-txn-1',
            transactionType: 'sale',
          });
          break;

        case 'lead-status-change':
          notifyLeadStatusChange(user.id, {
            leadId: 'test-lead-2',
            leadName: 'Fatima Sheikh',
            oldStatus: 'Qualified',
            newStatus: 'Negotiation',
          });
          break;

        case 'offer-accepted':
          notifyOfferStatusChange(user.id, {
            propertyAddress: '555 Luxury Plaza, Bahria Town',
            status: 'accepted',
            sellCycleId: 'test-sell-cycle-2',
            offerId: 'test-offer-2',
          });
          break;

        case 'offer-rejected':
          notifyOfferStatusChange(user.id, {
            propertyAddress: '777 Business Center, I.I. Chundrigar Road',
            status: 'rejected',
            sellCycleId: 'test-sell-cycle-3',
            offerId: 'test-offer-3',
          });
          break;

        case 'viewing-scheduled':
          createNotification({
            userId: user.id,
            type: 'VIEWING_SCHEDULED',
            priority: 'MEDIUM',
            title: 'Viewing Scheduled',
            message: 'Client scheduled viewing for 999 Tower Heights, Shahrah-e-Faisal on Dec 25, 2024 at 2:00 PM',
            entityType: 'property',
            entityId: 'test-prop-3',
            actionLabel: 'View Details',
            actionType: 'navigate',
          });
          break;

        case 'payment-due':
          createNotification({
            userId: user.id,
            type: 'PAYMENT_DUE',
            priority: 'HIGH',
            title: 'Payment Due',
            message: 'Payment of PKR 100,000 due on Dec 31, 2024',
            actionLabel: 'View Payment',
            actionType: 'navigate',
          });
          break;

        case 'critical-alert':
          createNotification({
            userId: user.id,
            type: 'SYSTEM_ALERT',
            priority: 'CRITICAL',
            title: 'Urgent: Contract Expiring',
            message: 'Rental contract for Property #456 expires in 3 days!',
            entityType: 'rentCycle',
            entityId: 'test-rent-1',
            actionLabel: 'Review Contract',
            actionType: 'navigate',
          });
          break;

        case 'bulk-test':
          // Create 10 varied notifications
          const types = [
            'OFFER_RECEIVED',
            'NEW_PROPERTY_MATCH',
            'LEAD_STATUS_CHANGE',
            'FOLLOW_UP_REMINDER',
            'COMMISSION_EARNED',
            'VIEWING_SCHEDULED',
            'PAYMENT_DUE',
            'RELISTING_OPPORTUNITY',
            'OFFER_ACCEPTED',
            'SYSTEM_ALERT',
          ];

          types.forEach((notifType, index) => {
            setTimeout(() => {
              createNotification({
                userId: user.id,
                type: notifType as any,
                priority: index % 4 === 0 ? 'CRITICAL' : index % 3 === 0 ? 'HIGH' : index % 2 === 0 ? 'MEDIUM' : 'LOW',
                title: `Test ${notifType.replace(/_/g, ' ')} #${index + 1}`,
                message: `This is a test notification to demonstrate the ${notifType.toLowerCase()} notification type.`,
                actionLabel: 'View',
                actionType: 'navigate',
              });
            }, index * 200);
          });
          break;
      }

      toast.success('Test notification created!');
      onUpdate();
    } catch (error) {
      console.error('Error creating test notification:', error);
      toast.error('Failed to create test notification');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Notification Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Test the notification system with sample notifications. These will appear in your notification bell and center.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('offer-received')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Offer Received
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('property-match')}
          >
            <Home className="mr-2 h-4 w-4" />
            Property Match
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('follow-up-reminder')}
          >
            <Bell className="mr-2 h-4 w-4" />
            Follow-up Reminder
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('relisting-opportunity')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Relisting Opportunity
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('commission-earned')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Commission Earned
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('lead-status-change')}
          >
            <Users className="mr-2 h-4 w-4" />
            Lead Status Change
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('offer-accepted')}
          >
            <DollarSign className="mr-2 h-4 w-4 text-green-600" />
            Offer Accepted
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('offer-rejected')}
          >
            <DollarSign className="mr-2 h-4 w-4 text-red-600" />
            Offer Rejected
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('viewing-scheduled')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Viewing Scheduled
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('payment-due')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Payment Due
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('critical-alert')}
            className="border-red-300"
          >
            <Bell className="mr-2 h-4 w-4 text-red-600" />
            Critical Alert
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => triggerTestNotification('bulk-test')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            Create 10 Notifications
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click the notification bell in the header to see your notifications, or navigate to the Notification Center for full management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
