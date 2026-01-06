/**
 * Deal Templates Component
 * Pre-configured templates for common deal scenarios
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Home,
  Building2,
  MapPin,
  Zap,
  Clock,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

interface DealTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  propertyType: string;
  estimatedDuration: string;
  paymentSchedule: string;
  tasksIncluded: number;
  documentsRequired: number;
  popular?: boolean;
}

interface DealTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const templates: DealTemplate[] = [
  {
    id: 'residential-sale',
    name: 'Residential Property Sale',
    description: 'Standard template for selling residential properties (houses, apartments)',
    icon: <Home className="h-8 w-8" />,
    propertyType: 'Residential',
    estimatedDuration: '60-90 days',
    paymentSchedule: '5 installments',
    tasksIncluded: 28,
    documentsRequired: 18,
    popular: true
  },
  {
    id: 'commercial-sale',
    name: 'Commercial Property Sale',
    description: 'Template for commercial properties (offices, shops, warehouses)',
    icon: <Building2 className="h-8 w-8" />,
    propertyType: 'Commercial',
    estimatedDuration: '90-120 days',
    paymentSchedule: '5 installments',
    tasksIncluded: 32,
    documentsRequired: 22,
    popular: true
  },
  {
    id: 'land-sale',
    name: 'Land/Plot Sale',
    description: 'Simplified template for undeveloped land and plots',
    icon: <MapPin className="h-8 w-8" />,
    propertyType: 'Land',
    estimatedDuration: '45-60 days',
    paymentSchedule: '4 installments',
    tasksIncluded: 22,
    documentsRequired: 15,
    popular: false
  },
  {
    id: 'quick-sale',
    name: 'Express/Quick Sale',
    description: 'Accelerated template for time-sensitive deals',
    icon: <Zap className="h-8 w-8" />,
    propertyType: 'Any',
    estimatedDuration: '30-45 days',
    paymentSchedule: '3 installments',
    tasksIncluded: 18,
    documentsRequired: 12,
    popular: false
  },
  {
    id: 'installment-heavy',
    name: 'Extended Payment Plan',
    description: 'Template with extended payment schedule for buyer convenience',
    icon: <DollarSign className="h-8 w-8" />,
    propertyType: 'Any',
    estimatedDuration: '120-180 days',
    paymentSchedule: '8 installments',
    tasksIncluded: 35,
    documentsRequired: 20,
    popular: false
  },
  {
    id: 'luxury-property',
    name: 'Luxury Property Deal',
    description: 'Premium template for high-value properties with enhanced due diligence',
    icon: <Building2 className="h-8 w-8" />,
    propertyType: 'Luxury',
    estimatedDuration: '90-150 days',
    paymentSchedule: '6 installments',
    tasksIncluded: 40,
    documentsRequired: 25,
    popular: true
  }
];

export const DealTemplates: React.FC<DealTemplatesProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Choose Deal Template
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Select a pre-configured template to automatically set up tasks, documents, and timeline
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {templates.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'hover:shadow-md hover:border-primary/50'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.name}
                        {template.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span>{template.propertyType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{template.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{template.paymentSchedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{template.tasksIncluded} tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <FileText className="h-4 w-4" />
                    <span>{template.documentsRequired} document requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedTemplate}>
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Template configuration details
export const getTemplateConfig = (templateId: string) => {
  const configs: Record<string, any> = {
    'residential-sale': {
      paymentSchedule: {
        token: 5, // 5% of total
        downPayment: 20, // 20% of total
        installments: [25, 25, 25], // 3 installments of 25% each
      },
      expectedDurationDays: 75,
      commissionRate: 2,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    },
    'commercial-sale': {
      paymentSchedule: {
        token: 10, // 10% of total
        downPayment: 25, // 25% of total
        installments: [20, 20, 25], // 3 installments
      },
      expectedDurationDays: 105,
      commissionRate: 2,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    },
    'land-sale': {
      paymentSchedule: {
        token: 10, // 10% of total
        downPayment: 30, // 30% of total
        installments: [30, 30, 0], // 2 installments
      },
      expectedDurationDays: 52,
      commissionRate: 2,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    },
    'quick-sale': {
      paymentSchedule: {
        token: 10, // 10% of total
        downPayment: 40, // 40% of total
        installments: [50, 0, 0], // 1 large installment
      },
      expectedDurationDays: 37,
      commissionRate: 2.5,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    },
    'installment-heavy': {
      paymentSchedule: {
        token: 5, // 5% of total
        downPayment: 15, // 15% of total
        installments: [10, 10, 10], // 3 small installments (rest in extra installments)
      },
      expectedDurationDays: 150,
      commissionRate: 1.8,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    },
    'luxury-property': {
      paymentSchedule: {
        token: 10, // 10% of total
        downPayment: 30, // 30% of total
        installments: [20, 20, 20], // 3 installments
      },
      expectedDurationDays: 120,
      commissionRate: 2.5,
      autoGenerateTasks: true,
      autoGenerateDocuments: true
    }
  };
  
  return configs[templateId] || configs['residential-sale'];
};