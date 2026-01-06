/**
 * Stage Progression Modal
 * Validates and guides stage progression with checklist
 */

import React, { useState, useMemo } from 'react';
import { Deal, DealStage } from '../../types';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  FileText,
  CheckSquare,
  DollarSign
} from 'lucide-react';

interface StageProgressionModalProps {
  deal: Deal;
  currentStage: DealStage;
  nextStage: DealStage;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StageProgressionModal: React.FC<StageProgressionModalProps> = ({
  deal,
  currentStage,
  nextStage,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Calculate stage readiness
  const stageReadiness = useMemo(() => {
    // Get tasks for current stage
    const stageTasks = deal.tasks.filter(t => t.stage === currentStage);
    const completedTasks = stageTasks.filter(t => t.status === 'completed');
    const taskCompletion = stageTasks.length > 0 
      ? (completedTasks.length / stageTasks.length) * 100 
      : 100;
    
    // Get documents for current stage
    const stageDocuments = deal.documents.filter(d => d.stage === currentStage);
    const verifiedDocuments = stageDocuments.filter(d => d.status === 'verified');
    const documentCompletion = stageDocuments.length > 0 
      ? (verifiedDocuments.length / stageDocuments.length) * 100 
      : 100;
    
    // Get payments expected by this stage
    const paymentsForStage = getExpectedPaymentsByStage(currentStage);
    const completedPayments = paymentsForStage.filter(paymentType => {
      const payment = deal.financial.payments.find(p => p.type === paymentType);
      return payment?.status === 'completed';
    });
    const paymentCompletion = paymentsForStage.length > 0 
      ? (completedPayments.length / paymentsForStage.length) * 100 
      : 100;
    
    // Calculate overall readiness
    const overallReadiness = (taskCompletion + documentCompletion + paymentCompletion) / 3;
    
    // Determine blockers
    const blockers: string[] = [];
    if (taskCompletion < 80) {
      blockers.push(`Only ${Math.round(taskCompletion)}% of tasks completed`);
    }
    if (documentCompletion < 80) {
      blockers.push(`Only ${Math.round(documentCompletion)}% of documents verified`);
    }
    if (paymentCompletion < 100) {
      blockers.push(`Missing required payments for this stage`);
    }
    
    return {
      taskCompletion,
      documentCompletion,
      paymentCompletion,
      overallReadiness,
      isReady: overallReadiness >= 80,
      blockers,
      stageTasks,
      completedTasks,
      stageDocuments,
      verifiedDocuments,
      paymentsForStage,
      completedPayments: completedPayments.length
    };
  }, [deal, currentStage]);
  
  const getStageDisplay = (stage: DealStage) => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const handleConfirm = () => {
    if (stageReadiness.isReady || acknowledged) {
      onConfirm();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Progress to Next Stage
            <ArrowRight className="h-5 w-5" />
          </DialogTitle>
          <DialogDescription>
            Ensure all requirements are met before progressing to the next stage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stage Transition */}
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {getStageDisplay(currentStage)}
              </Badge>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-sm">
                {getStageDisplay(nextStage)}
              </Badge>
            </div>
          </div>
          
          {/* Overall Readiness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Overall Stage Readiness</h3>
              <span className="text-sm font-semibold">
                {Math.round(stageReadiness.overallReadiness)}%
              </span>
            </div>
            <Progress value={stageReadiness.overallReadiness} className="h-3" />
            
            {stageReadiness.isReady ? (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  This stage is ready for progression. All requirements are met.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Some requirements are incomplete. Review the checklist below.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Checklist */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stage Completion Checklist</h3>
            
            {/* Tasks */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stageReadiness.completedTasks.length} / {stageReadiness.stageTasks.length}
                  </span>
                  {stageReadiness.taskCompletion >= 80 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </div>
              <Progress value={stageReadiness.taskCompletion} className="h-2" />
              {stageReadiness.taskCompletion < 80 && (
                <p className="text-sm text-muted-foreground">
                  Complete at least 80% of tasks before progressing
                </p>
              )}
            </div>
            
            {/* Documents */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stageReadiness.verifiedDocuments.length} / {stageReadiness.stageDocuments.length}
                  </span>
                  {stageReadiness.documentCompletion >= 80 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </div>
              <Progress value={stageReadiness.documentCompletion} className="h-2" />
              {stageReadiness.documentCompletion < 80 && (
                <p className="text-sm text-muted-foreground">
                  Verify at least 80% of required documents
                </p>
              )}
            </div>
            
            {/* Payments */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {stageReadiness.completedPayments} / {stageReadiness.paymentsForStage.length}
                  </span>
                  {stageReadiness.paymentCompletion >= 100 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </div>
              <Progress value={stageReadiness.paymentCompletion} className="h-2" />
              {stageReadiness.paymentCompletion < 100 && (
                <p className="text-sm text-muted-foreground">
                  All required payments must be completed for this stage
                </p>
              )}
            </div>
          </div>
          
          {/* Blockers Warning */}
          {!stageReadiness.isReady && stageReadiness.blockers.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-medium mb-2">Progression Blockers:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {stageReadiness.blockers.map((blocker, index) => (
                    <li key={index}>{blocker}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Override Option */}
          {!stageReadiness.isReady && (
            <div className="flex items-start gap-3 p-4 border-2 border-dashed rounded-lg">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="acknowledge" className="text-sm cursor-pointer">
                <span className="font-medium">I acknowledge the risks</span>
                <p className="text-muted-foreground mt-1">
                  I understand that progressing without completing all requirements may cause 
                  issues in the deal lifecycle. I will address the incomplete items as soon as possible.
                </p>
              </label>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!stageReadiness.isReady && !acknowledged}
          >
            {stageReadiness.isReady ? 'Progress to Next Stage' : 'Override and Progress'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get expected payments by stage
const getExpectedPaymentsByStage = (stage: DealStage): Array<'token' | 'downPayment' | 'installment1' | 'installment2' | 'installment3'> => {
  switch (stage) {
    case 'offer-accepted':
      return ['token'];
    case 'agreement-signing':
      return ['token', 'downPayment'];
    case 'documentation':
      return ['token', 'downPayment'];
    case 'payment-processing':
      return ['token', 'downPayment', 'installment1'];
    case 'handover-preparation':
      return ['token', 'downPayment', 'installment1', 'installment2'];
    case 'transfer-registration':
      return ['token', 'downPayment', 'installment1', 'installment2', 'installment3'];
    case 'final-handover':
      return ['token', 'downPayment', 'installment1', 'installment2', 'installment3'];
    default:
      return [];
  }
};