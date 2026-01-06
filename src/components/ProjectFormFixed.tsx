import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Building2,
  Target,
  Clock,
  CheckCircle,
  Save,
  Plus,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { User, Project, ProjectPhase, ProjectStakeholder, ProjectContractor, RevenueStream } from '../types';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface ProjectFormProps {
  user: User;
  editProject?: Project;
  onBack: () => void;
  onSuccess: () => void;
}

interface ProjectFormData {
  // Basic Information
  name: string;
  description: string;
  type: string;
  priority: string;
  tags: string[];
  
  // Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Timeline
  startDate: Date | null;
  estimatedEndDate: Date | null;
  phases: ProjectPhase[];
  
  // Financial
  totalBudget: number;
  contingencyPercentage: number;
  projectedRevenue: number;
  revenueStreams: RevenueStream[];
  
  // Team
  projectManager: string;
  stakeholders: ProjectStakeholder[];
  contractors: ProjectContractor[];
  
  // Properties
  totalUnits: number;
  
  // Documents
  requiredDocuments: string[];
}

const PROJECT_TYPES = [
  { value: 'residential-development', label: 'Residential Development' },
  { value: 'commercial-development', label: 'Commercial Development' },
  { value: 'mixed-use-development', label: 'Mixed-Use Development' },
  { value: 'renovation', label: 'Renovation/Refurbishment' },
  { value: 'land-development', label: 'Land Development' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

const DEFAULT_PHASES = [
  { name: 'Planning & Design', description: 'Initial planning, design, and feasibility studies' },
  { name: 'Permitting', description: 'Obtaining necessary permits and approvals' },
  { name: 'Construction', description: 'Main construction and development work' },
  { name: 'Marketing & Sales', description: 'Marketing units and managing sales process' },
  { name: 'Completion & Handover', description: 'Final inspections and unit handovers' }
];

const REVENUE_STREAM_TYPES = [
  { value: 'unit-sales', label: 'Unit Sales' },
  { value: 'rental-income', label: 'Rental Income' },
  { value: 'commercial-lease', label: 'Commercial Leasing' },
  { value: 'parking', label: 'Parking Revenue' },
  { value: 'amenity-fees', label: 'Amenity Fees' },
  { value: 'other', label: 'Other Revenue' }
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  user, 
  editProject, 
  onBack, 
  onSuccess 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    type: '',
    priority: 'medium',
    tags: [],
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    startDate: null,
    estimatedEndDate: null,
    phases: [],
    totalBudget: 0,
    contingencyPercentage: 10,
    projectedRevenue: 0,
    revenueStreams: [],
    projectManager: user.id,
    stakeholders: [],
    contractors: [],
    totalUnits: 0,
    requiredDocuments: []
  });

  const [newTag, setNewTag] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editProject) {
      setFormData({
        name: editProject.name,
        description: editProject.description,
        type: editProject.type,
        priority: editProject.priority,
        tags: editProject.tags || [],
        address: editProject.location.address,
        city: editProject.location.city,
        state: editProject.location.state,
        zipCode: editProject.location.zipCode,
        country: editProject.location.country,
        startDate: new Date(editProject.timeline.startDate),
        estimatedEndDate: new Date(editProject.timeline.estimatedEndDate),
        phases: editProject.timeline.phases || [],
        totalBudget: editProject.budget.totalBudget,
        contingencyPercentage: editProject.budget.contingencyPercentage || 10,
        projectedRevenue: editProject.revenue.projectedRevenue,
        revenueStreams: editProject.revenue.revenueStreams || [],
        projectManager: editProject.team.projectManager,
        stakeholders: editProject.team.stakeholders || [],
        contractors: editProject.team.contractors || [],
        totalUnits: editProject.properties.totalUnits,
        requiredDocuments: editProject.documents.categories || []
      });
    }
  }, [editProject]);

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generatePhases = () => {
    if (formData.phases.length === 0 && formData.startDate && formData.estimatedEndDate) {
      const phaseDuration = Math.floor((formData.estimatedEndDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24) / DEFAULT_PHASES.length);

      const phases: ProjectPhase[] = DEFAULT_PHASES.map((phase, index) => {
        const startDate = new Date(formData.startDate!.getTime());
        startDate.setDate(startDate.getDate() + (index * phaseDuration));
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + phaseDuration);

        return {
          id: `phase-${index + 1}`,
          name: phase.name,
          description: phase.description,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          status: 'not-started',
          progress: 0,
          budgetAllocation: Math.floor(formData.totalBudget / DEFAULT_PHASES.length),
          actualCost: 0,
          milestones: [],
          dependencies: index > 0 ? [`phase-${index}`] : [],
          deliverables: []
        };
      });

      setFormData(prev => ({ ...prev, phases }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.type && formData.description);
      case 2:
        return !!(formData.address && formData.city && formData.state);
      case 3:
        return !!(formData.startDate && formData.estimatedEndDate);
      case 4:
        return formData.totalBudget > 0;
      case 5:
        return true; // Team step is optional
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        generatePhases();
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Fix potential division by zero and NaN issues
      const projectedProfit = (formData.projectedRevenue || 0) - (formData.totalBudget || 0);
      const profitMargin = formData.projectedRevenue > 0 ? (projectedProfit / formData.projectedRevenue) * 100 : 0;
      const roi = formData.totalBudget > 0 ? (projectedProfit / formData.totalBudget) * 100 : 0;

      // Create the project object
      const projectData: Project = {
        id: editProject?.id || `proj-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type: formData.type as any,
        status: editProject?.status || 'planning',
        priority: formData.priority as any,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        timeline: {
          startDate: format(formData.startDate!, 'yyyy-MM-dd'),
          estimatedEndDate: format(formData.estimatedEndDate!, 'yyyy-MM-dd'),
          phases: formData.phases,
          currentPhase: formData.phases[0]?.id
        },
        budget: {
          totalBudget: formData.totalBudget,
          allocatedBudget: editProject?.budget.allocatedBudget || 0,
          spentBudget: editProject?.budget.spentBudget || 0,
          remainingBudget: formData.totalBudget - (editProject?.budget.spentBudget || 0),
          contingencyPercentage: formData.contingencyPercentage,
          lastUpdated: new Date().toISOString()
        },
        revenue: {
          projectedRevenue: formData.projectedRevenue,
          actualRevenue: editProject?.revenue.actualRevenue || 0,
          revenueStreams: formData.revenueStreams
        },
        profitability: {
          estimatedProfit: projectedProfit,
          actualProfit: editProject?.profitability.actualProfit || 0,
          profitMargin: profitMargin,
          roi: roi
        },
        team: {
          projectManager: formData.projectManager,
          architects: editProject?.team.architects || [],
          contractors: formData.contractors,
          stakeholders: formData.stakeholders,
          agents: editProject?.team.agents || [user.id]
        },
        properties: {
          totalUnits: formData.totalUnits,
          completedUnits: editProject?.properties.completedUnits || 0,
          soldUnits: editProject?.properties.soldUnits || 0,
          availableUnits: formData.totalUnits - (editProject?.properties.soldUnits || 0),
          propertyIds: editProject?.properties.propertyIds || []
        },
        documents: {
          folderId: editProject?.documents.folderId || `project-${Date.now()}`,
          categories: formData.requiredDocuments,
          requiredDocuments: editProject?.documents.requiredDocuments || []
        },
        risks: editProject?.risks || [],
        tags: formData.tags,
        customFields: editProject?.customFields || {},
        agentId: user.id,
        createdAt: editProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: editProject?.createdBy || user.id,
        lastModifiedBy: user.id
      };

      // Save to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      
      if (editProject) {
        const projectIndex = existingProjects.findIndex((p: Project) => p.id === editProject.id);
        if (projectIndex !== -1) {
          existingProjects[projectIndex] = projectData;
        }
      } else {
        existingProjects.push(projectData);
      }
      
      localStorage.setItem('projects', JSON.stringify(existingProjects));

      toast.success(editProject ? 'Project updated successfully!' : 'Project created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderBasicInformation();
      case 2: return renderLocationInfo();
      case 3: return renderTimelineInfo();
      case 4: return renderFinancialInfo();
      case 5: return renderTeamInfo();
      case 6: return renderReviewInfo();
      default: return null;
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h3>Basic Project Information</h3>
        <p className="text-muted-foreground">Start by defining the core details of your project</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter project name"
            className="bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Project Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your project in detail..."
          rows={4}
          className="bg-input-background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_LEVELS.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <span>{priority.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalUnits">Total Units (if applicable)</Label>
          <Input
            id="totalUnits"
            type="number"
            value={formData.totalUnits || ''}
            onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
            placeholder="Number of units"
            min="0"
            className="bg-input-background"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Project Tags</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1">
              {tag}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="bg-input-background"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLocationInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3>Project Location</h3>
        <p className="text-muted-foreground">Specify where this project will be located</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter street address"
            className="bg-input-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State or Province"
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="ZIP or Postal Code"
              className="bg-input-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger className="bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="UAE">United Arab Emirates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTimelineInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Clock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
        <h3>Project Timeline</h3>
        <p className="text-muted-foreground">Define the project schedule and key phases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Project Start Date *</Label>
          <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-input-background">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {formData.startDate ? format(formData.startDate, 'PPP') : 'Select start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate || undefined}
                onSelect={(date) => {
                  handleInputChange('startDate', date);
                  setShowStartDatePicker(false);
                }}
                disabled={(date) => date < new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Estimated End Date *</Label>
          <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-input-background">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {formData.estimatedEndDate ? format(formData.estimatedEndDate, 'PPP') : 'Select end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.estimatedEndDate || undefined}
                onSelect={(date) => {
                  handleInputChange('estimatedEndDate', date);
                  setShowEndDatePicker(false);
                }}
                disabled={(date) => !formData.startDate || date <= formData.startDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {formData.phases.length > 0 && (
        <div className="space-y-4">
          <h4>Generated Project Phases</h4>
          <div className="space-y-3">
            {formData.phases.map((phase, index) => (
              <Card key={phase.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5>{phase.name}</h5>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(phase.startDate), 'MMM dd')} - {format(new Date(phase.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {Math.round((new Date(phase.endDate).getTime() - new Date(phase.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3>Financial Planning</h3>
        <p className="text-muted-foreground">Set budget and revenue projections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="totalBudget">Total Project Budget (PKR) *</Label>
          <Input
            id="totalBudget"
            type="number"
            value={formData.totalBudget || ''}
            onChange={(e) => handleInputChange('totalBudget', parseFloat(e.target.value) || 0)}
            placeholder="Enter total budget in PKR"
            min="0"
            className="bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contingency">Contingency Percentage</Label>
          <Input
            id="contingency"
            type="number"
            value={formData.contingencyPercentage || ''}
            onChange={(e) => handleInputChange('contingencyPercentage', parseFloat(e.target.value) || 0)}
            placeholder="10"
            max="50"
            min="0"
            className="bg-input-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectedRevenue">Projected Total Revenue (PKR)</Label>
        <Input
          id="projectedRevenue"
          type="number"
          value={formData.projectedRevenue || ''}
          onChange={(e) => handleInputChange('projectedRevenue', parseFloat(e.target.value) || 0)}
          placeholder="Enter projected revenue in PKR"
          min="0"
          className="bg-input-background"
        />
      </div>

      {formData.totalBudget > 0 && formData.projectedRevenue > 0 && (
        <Card className="p-4 bg-accent/50">
          <h4 className="mb-3">Financial Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Projected Profit</p>
              <p className="font-medium text-green-600">
                {formatPKR(formData.projectedRevenue - formData.totalBudget)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Profit Margin</p>
              <p className="font-medium">
                {(((formData.projectedRevenue - formData.totalBudget) / formData.projectedRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">ROI</p>
              <p className="font-medium">
                {(((formData.projectedRevenue - formData.totalBudget) / formData.totalBudget) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderTeamInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="h-12 w-12 text-orange-600 mx-auto mb-3" />
        <h3>Team & Stakeholders</h3>
        <p className="text-muted-foreground">Define who will be involved in this project</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectManager">Project Manager</Label>
          <Input
            id="projectManager"
            value={user.name}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">You are assigned as the project manager</p>
        </div>

        <Card className="p-4 bg-accent/30">
          <h4 className="mb-3">Team Setup</h4>
          <p className="text-sm text-muted-foreground mb-3">
            You can add team members, contractors, and stakeholders after creating the project using the CRM module.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Stakeholders (investors, partners, regulators)</p>
            <p>• Contractors (architects, engineers, construction teams)</p>
            <p>• Vendors & Suppliers (materials, equipment, services)</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderReviewInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3>Review & Submit</h3>
        <p className="text-muted-foreground">Review your project details before submitting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{formData.type.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <Badge className={PRIORITY_LEVELS.find(p => p.value === formData.priority)?.color}>
                {PRIORITY_LEVELS.find(p => p.value === formData.priority)?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>
                {formData.startDate && formData.estimatedEndDate
                  ? Math.round((formData.estimatedEndDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))
                  : 0} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Units:</span>
              <span>{formData.totalUnits || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <span>{formatPKR(formData.totalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected Revenue:</span>
              <span>{formatPKR(formData.projectedRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projected Profit:</span>
              <span className={formData.projectedRevenue - formData.totalBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPKR(formData.projectedRevenue - formData.totalBudget)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phases:</span>
              <span>{formData.phases.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contingency:</span>
              <span>{formData.contingencyPercentage}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {formData.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-medium">{editProject ? 'Edit Project' : 'Create New Project'}</h1>
                <p className="text-sm text-muted-foreground">
                  {editProject ? 'Update project details' : 'Set up a new development project'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      {editProject ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editProject ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};