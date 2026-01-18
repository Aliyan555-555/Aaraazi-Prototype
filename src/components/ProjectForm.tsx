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
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  Building2,
  Target,
  Clock,
  Briefcase,
  CheckCircle,
  Save,
  Plus,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { User, Project, ProjectPhase, ProjectStakeholder, ProjectContractor, RevenueStream } from '../types';
import { toast } from 'sonner';
import { addProject, updateProject } from '../lib/projects';

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
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'mixed-use', label: 'Mixed-Use' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'infrastructure', label: 'Infrastructure' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
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
        tags: editProject.tags,
        address: editProject.location.address,
        city: editProject.location.city,
        state: editProject.location.state,
        zipCode: editProject.location.zipCode,
        country: editProject.location.country,
        startDate: new Date(editProject.timeline.startDate),
        estimatedEndDate: new Date(editProject.timeline.estimatedEndDate),
        phases: editProject.timeline.phases,
        totalBudget: editProject.budget.totalBudget,
        contingencyPercentage: Math.round((editProject.budget.contingencyReserve / editProject.budget.totalBudget) * 100) || 10,
        projectedRevenue: editProject.revenue.projectedRevenue,
        revenueStreams: editProject.revenue.revenueStreams,
        projectManager: editProject.team.projectManager,
        stakeholders: editProject.team.stakeholders,
        contractors: editProject.team.contractors,
        totalUnits: editProject.properties?.totalUnits || 0,
        requiredDocuments: editProject.documents?.map(doc => doc.name) || []
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
    if (formData.phases.length === 0) {
      const phaseDuration = formData.startDate && formData.estimatedEndDate 
        ? Math.floor((formData.estimatedEndDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24) / DEFAULT_PHASES.length)
        : 60;

      const phases: ProjectPhase[] = DEFAULT_PHASES.map((phase, index) => {
        const startDate = new Date(formData.startDate?.getTime() || Date.now());
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
      // Create the project object matching our Project type
      const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        type: formData.type as Project['type'],
        status: 'planning',
        priority: formData.priority as Project['priority'],
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
          actualEndDate: null,
          currentPhase: formData.phases[0]?.id || '',
          phases: formData.phases
        },
        budget: {
          totalBudget: formData.totalBudget,
          allocatedBudget: 0,
          spentBudget: 0,
          remainingBudget: formData.totalBudget,
          contingencyReserve: Math.floor(formData.totalBudget * (formData.contingencyPercentage / 100))
        },
        revenue: {
          projectedRevenue: formData.projectedRevenue,
          actualRevenue: 0,
          revenueStreams: formData.revenueStreams
        },
        team: {
          projectManager: user.name || user.id,
          stakeholders: formData.stakeholders,
          contractors: formData.contractors
        },
        properties: {
          totalUnits: formData.totalUnits,
          soldUnits: 0,
          reservedUnits: 0,
          availableUnits: formData.totalUnits,
          unitTypes: []
        },
        documents: formData.requiredDocuments.map((doc, index) => ({
          id: `doc-${index}`,
          name: doc,
          type: 'regulatory',
          category: 'planning',
          url: '#',
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString().split('T')[0],
          isRequired: true,
          expiryDate: null
        })),
        tags: formData.tags,
        isActive: true,
        visibility: 'private',
        createdBy: user.id,
        assignedTo: [user.id]
      };

      if (editProject) {
        const updatedProject = updateProject(editProject.id, projectData);
        if (updatedProject) {
          toast.success('Project updated successfully!');
          onSuccess();
        } else {
          toast.error('Failed to update project');
        }
      } else {
        const newProject = addProject(projectData);
        toast.success('Project created successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderLocationInfo();
      case 3:
        return renderTimelineInfo();
      case 4:
        return renderFinancialInfo();
      case 5:
        return renderTeamInfo();
      case 6:
        return renderReviewInfo();
      default:
        return null;
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold">Basic Project Information</h3>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Project Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
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
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_LEVELS.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center space-x-2">
                    <Badge className={priority.color}>{priority.label}</Badge>
                  </div>
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
            value={formData.totalUnits}
            onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
            placeholder="Number of units"
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
                className="h-3 w-3 ml-1 cursor-pointer" 
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
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
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
        <h3 className="text-xl font-semibold">Project Location</h3>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State or Province"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="ZIP or Postal Code"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="India">India</SelectItem>
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
        <h3 className="text-xl font-semibold">Project Timeline</h3>
        <p className="text-muted-foreground">Define the project schedule and key phases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Project Start Date *</Label>
          <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
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
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Estimated End Date *</Label>
          <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
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
          <h4 className="font-semibold">Generated Project Phases</h4>
          <div className="space-y-3">
            {formData.phases.map((phase, index) => (
              <Card key={phase.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{phase.name}</h5>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        try {
                          const start = new Date(phase.startDate);
                          const end = new Date(phase.endDate);
                          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                            return 'Invalid dates';
                          }
                          return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
                        } catch (error) {
                          return 'Invalid dates';
                        }
                      })()}
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
        <h3 className="text-xl font-semibold">Financial Planning</h3>
        <p className="text-muted-foreground">Set budget and revenue projections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="totalBudget">Total Project Budget *</Label>
          <Input
            id="totalBudget"
            type="number"
            value={formData.totalBudget}
            onChange={(e) => handleInputChange('totalBudget', parseFloat(e.target.value) || 0)}
            placeholder="Enter total budget"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contingency">Contingency Percentage</Label>
          <Input
            id="contingency"
            type="number"
            value={formData.contingencyPercentage}
            onChange={(e) => handleInputChange('contingencyPercentage', parseFloat(e.target.value) || 0)}
            placeholder="10"
            max="50"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectedRevenue">Projected Total Revenue</Label>
        <Input
          id="projectedRevenue"
          type="number"
          value={formData.projectedRevenue}
          onChange={(e) => handleInputChange('projectedRevenue', parseFloat(e.target.value) || 0)}
          placeholder="Enter projected revenue"
        />
      </div>

      {formData.totalBudget > 0 && formData.projectedRevenue > 0 && (
        <Card className="p-4 bg-blue-50">
          <h4 className="font-semibold mb-3">Financial Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Projected Profit</p>
              <p className="font-semibold text-green-600">
                Rs. {(formData.projectedRevenue - formData.totalBudget).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Profit Margin</p>
              <p className="font-semibold">
                {(((formData.projectedRevenue - formData.totalBudget) / formData.projectedRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">ROI</p>
              <p className="font-semibold">
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
        <h3 className="text-xl font-semibold">Team & Stakeholders</h3>
        <p className="text-muted-foreground">Define who will be involved in this project</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectManager">Project Manager</Label>
          <Input
            id="projectManager"
            value={user.name}
            disabled
            placeholder="Project manager"
          />
          <p className="text-xs text-muted-foreground">You are assigned as the project manager</p>
        </div>

        <Card className="p-4">
          <h4 className="font-semibold mb-3">Team Setup</h4>
          <p className="text-sm text-muted-foreground mb-3">
            You can add team members, contractors, and stakeholders after creating the project.
          </p>
          <div className="text-xs text-muted-foreground">
            • Stakeholders (investors, partners, regulators)<br/>
            • Contractors (architects, engineers, construction teams)<br/>
            • Team members (sales agents, property managers)
          </div>
        </Card>
      </div>
    </div>
  );

  const renderReviewInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold">Review & Create Project</h3>
        <p className="text-muted-foreground">Review all details before creating your project</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Project Overview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>{PROJECT_TYPES.find(t => t.value === formData.type)?.label}</span>
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
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-3">Timeline & Budget</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span>{formData.startDate ? format(formData.startDate, 'MMM dd, yyyy') : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span>{formData.estimatedEndDate ? format(formData.estimatedEndDate, 'MMM dd, yyyy') : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <span>Rs. {formData.totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue:</span>
              <span>Rs. {formData.projectedRevenue.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Project Phases ({formData.phases.length})</h4>
        <div className="space-y-2">
          {formData.phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center space-x-3 text-sm">
              <Badge variant="outline">{index + 1}</Badge>
              <span>{phase.name}</span>
              <span className="text-muted-foreground">
                ({format(new Date(phase.startDate), 'MMM dd')} - {format(new Date(phase.endDate), 'MMM dd')})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {editProject ? 'Edit Project' : 'Create New Project'}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {editProject ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editProject ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};