import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';
import { 
  ArrowLeft,
  Edit,
  Plus,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Building2,
  Target,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  FileText,
  Camera,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Square,
  Settings,
  Save,
  RefreshCw,
  Zap,
  Award,
  Star,
  Bookmark,
  Tag,
  Link,
  GitBranch,
  Layers,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Timer,
  TrendingDown,
  Calculator,
  Banknote,
  CreditCard,
  Wallet,
  LineChart,
  RotateCcw,
  CheckSquare,
  Archive,
  Flag,
  MessageSquare,
  Bell,
  Shield,
  Lock,
  Unlock,
  UserCheck,
  Gauge,
  ThumbsUp
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { User, Project, ProjectPhase } from '../types';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';
import { getProjectById, updateProject } from '../lib/projects';

interface ProjectDetailEnhancedProps {
  project: Project;
  user: User;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

// Enhanced Timeline Types
interface TimelineEvent {
  id: string;
  projectId: string;
  type: 'milestone' | 'phase' | 'task' | 'inspection' | 'payment' | 'delivery';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dependencies: string[];
  tags: string[];
  budget: number;
  actualCost: number;
  attachments: string[];
  notes: string;
  color?: string;
  isEditable: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Financial Types
interface FinancialCategory {
  id: string;
  name: string;
  description: string;
  budgetAllocated: number;
  budgetSpent: number;
  subcategories: FinancialSubcategory[];
}

interface FinancialSubcategory {
  id: string;
  name: string;
  budgetAllocated: number;
  budgetSpent: number;
  transactions: FinancialTransaction[];
}

interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'card';
  vendor?: string;
  receiptNumber?: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  tags: string[];
  attachments: string[];
}

interface PaymentSchedule {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  paidAmount: number;
  paymentMethod?: string;
  linkedTransactions: string[];
  stakeholder: string;
  type: 'milestone' | 'installment' | 'vendor' | 'contractor' | 'other';
}

// Enhanced Unit Booking Types
interface EnhancedUnit {
  id: string;
  projectId: string;
  unitNumber: string;
  block?: string;
  floor?: number;
  unitType: 'studio' | '1br' | '2br' | '3br' | '4br' | 'penthouse' | 'commercial' | 'parking';
  area: number;
  builtUpArea?: number;
  balconyArea?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSlots: number;
  basePrice: number;
  currentPrice: number;
  pricePerSqft: number;
  status: 'available' | 'blocked' | 'reserved' | 'booked' | 'sold' | 'handed-over';
  amenities: string[];
  specifications: UnitSpecification[];
  facing: 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
  view: string[];
  floorPlan?: string;
  images: string[];
  virtualTour?: string;
  priority: 'standard' | 'premium' | 'luxury';
  readyForHandover: boolean;
  handoverDate?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface UnitSpecification {
  category: string;
  items: SpecificationItem[];
}

interface SpecificationItem {
  name: string;
  brand?: string;
  model?: string;
  description: string;
  included: boolean;
}

interface CustomerBooking {
  id: string;
  unitId: string;
  projectId: string;
  customer: CustomerProfile;
  bookingDate: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  paymentPlan: BookingPaymentPlan;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'defaulted';
  salesAgent: string;
  referredBy?: string;
  commissionRate: number;
  documents: BookingDocument[];
  communications: BookingCommunication[];
  followUps: FollowUp[];
  handoverScheduled?: string;
  handoverCompleted?: string;
  satisfactionRating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  cnic: string;
  address: string;
  city: string;
  occupation: string;
  monthlyIncome?: number;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  languagePreference: 'english' | 'urdu';
  source: 'walk-in' | 'referral' | 'online' | 'advertisement' | 'social-media' | 'other';
  creditScore?: number;
  bankingRelationship?: string;
  previousProjects?: string[];
  tags: string[];
  notes: string[];
}

interface BookingPaymentPlan {
  type: 'lump-sum' | 'installments' | 'construction-linked' | 'possession-linked';
  downPayment: number;
  installments: PaymentInstallment[];
  penaltyRate: number;
  gracePeriod: number;
}

interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paidAmount: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'waived';
  paymentMethod?: string;
  receiptNumber?: string;
  penaltyAmount: number;
  notes?: string;
}

interface BookingDocument {
  id: string;
  name: string;
  type: 'agreement' | 'payment-receipt' | 'id-copy' | 'income-proof' | 'bank-statement' | 'noc' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  expiryDate?: string;
}

interface BookingCommunication {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'sms';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  content: string;
  attachments: string[];
  outcome: string;
  followUpRequired: boolean;
  handledBy: string;
}

interface FollowUp {
  id: string;
  type: 'payment-reminder' | 'document-collection' | 'status-update' | 'handover-coordination' | 'general';
  scheduledDate: string;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  outcome?: string;
  status: 'pending' | 'completed' | 'cancelled';
  assignedTo: string;
}

// Enhanced Construction Types
interface ConstructionArea {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'building' | 'amenity' | 'infrastructure' | 'landscape' | 'parking';
  supervisor: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  progress: number;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budget: number;
  spentAmount: number;
  workPackages: WorkPackage[];
  issues: ConstructionIssue[];
  qualityChecks: QualityCheck[];
  safetyRecords: SafetyRecord[];
  photos: ConstructionPhoto[];
  weather: WeatherLog[];
  materials: MaterialConsumption[];
  labor: LaborRecord[];
  equipment: EquipmentUsage[];
  notes: string;
  tags: string[];
}

interface WorkPackage {
  id: string;
  areaId: string;
  name: string;
  description: string;
  trade: 'civil' | 'electrical' | 'plumbing' | 'hvac' | 'finishing' | 'landscaping' | 'other';
  contractor: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'rework-required';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  budget: number;
  actualCost: number;
  tasks: ConstructionTask[];
  dependencies: string[];
  milestones: TaskMilestone[];
  approvals: WorkApproval[];
}

interface ConstructionTask {
  id: string;
  workPackageId: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
  assignedTo: string[];
  estimatedHours: number;
  actualHours: number;
  materials: string[];
  tools: string[];
  safetyRequirements: string[];
  qualityStandards: string[];
  completionCriteria: string[];
  progress: number;
  startDate?: string;
  endDate?: string;
  blockedReason?: string;
  photos: string[];
  notes: string;
}

interface TaskMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: 'pending' | 'achieved' | 'delayed';
  criteria: string[];
  approvedBy?: string;
  evidence: string[];
}

interface ConstructionIssue {
  id: string;
  projectId: string;
  areaId?: string;
  workPackageId?: string;
  title: string;
  description: string;
  category: 'quality' | 'safety' | 'delay' | 'cost' | 'design' | 'weather' | 'material' | 'labor' | 'equipment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed' | 'escalated';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  targetResolutionDate?: string;
  actualResolutionDate?: string;
  rootCause?: string;
  solution?: string;
  preventiveActions: string[];
  cost: number;
  timeImpact: number; // days
  photos: string[];
  communications: IssueCommunication[];
  escalationLevel: number;
  tags: string[];
}

interface IssueCommunication {
  id: string;
  issueId: string;
  timestamp: string;
  by: string;
  message: string;
  attachments: string[];
  actionTaken?: string;
}

interface QualityCheck {
  id: string;
  areaId: string;
  workPackageId?: string;
  checklistType: 'daily' | 'weekly' | 'milestone' | 'final' | 'audit';
  inspectorName: string;
  inspectionDate: string;
  criteria: QualityCriteria[];
  overallRating: number; // 1-5
  passed: boolean;
  defects: QualityDefect[];
  recommendations: string[];
  nextInspectionDate?: string;
  certificateIssued: boolean;
  photos: string[];
  signedOff: boolean;
  signedBy?: string;
}

interface QualityCriteria {
  id: string;
  name: string;
  description: string;
  standard: string;
  actualValue: string;
  rating: number; // 1-5
  passed: boolean;
  notes?: string;
  photos: string[];
}

interface QualityDefect {
  id: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  location: string;
  photos: string[];
  correctiveAction: string;
  timeline: string;
  assignedTo: string;
  status: 'open' | 'in-progress' | 'resolved' | 'verified';
  resolvedDate?: string;
}

interface SafetyRecord {
  id: string;
  areaId: string;
  date: string;
  inspectorName: string;
  safetyOfficer: string;
  incidents: SafetyIncident[];
  violations: SafetyViolation[];
  improvements: SafetyImprovement[];
  trainingConducted: SafetyTraining[];
  equipmentStatus: EquipmentSafety[];
  overallRating: number; // 1-5
  certificateValid: boolean;
  nextAuditDate: string;
  recommendations: string[];
}

interface SafetyIncident {
  id: string;
  type: 'accident' | 'near-miss' | 'property-damage' | 'environmental';
  severity: 'minor' | 'major' | 'serious' | 'fatal';
  description: string;
  location: string;
  timeOfIncident: string;
  personsInvolved: string[];
  witnesses: string[];
  immediateActions: string[];
  rootCause: string;
  preventiveActions: string[];
  reportedToAuthorities: boolean;
  investigationComplete: boolean;
  photos: string[];
  status: 'open' | 'investigating' | 'closed';
}

interface SafetyViolation {
  id: string;
  type: string;
  description: string;
  violatedBy: string;
  correctedOn?: string;
  penaltyImposed?: string;
  trainingRequired: boolean;
}

interface SafetyImprovement {
  id: string;
  suggestion: string;
  implementedDate?: string;
  cost: number;
  effectiveness: number; // 1-5
  suggestedBy: string;
}

interface SafetyTraining {
  id: string;
  topic: string;
  conductedBy: string;
  attendees: string[];
  duration: number; // hours
  effectiveness: number; // 1-5
  certificatesIssued: boolean;
}

interface EquipmentSafety {
  id: string;
  equipmentName: string;
  lastInspected: string;
  nextInspection: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe';
  issues: string[];
  maintenanceRequired: boolean;
}

interface ConstructionPhoto {
  id: string;
  url: string;
  caption: string;
  type: 'progress' | 'quality' | 'safety' | 'issue' | 'milestone' | 'before' | 'after' | 'inspection';
  location: string;
  takenBy: string;
  takenDate: string;
  gpsCoordinates?: string;
  tags: string[];
  linkedTo: string; // ID of related entity
  linkType: 'area' | 'workpackage' | 'task' | 'issue' | 'quality' | 'safety';
}

interface WeatherLog {
  id: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'extreme-heat' | 'extreme-cold';
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  workImpacted: boolean;
  impactDescription?: string;
  hoursLost: number;
  precautionsTaken: string[];
  recordedBy: string;
}

interface MaterialConsumption {
  id: string;
  areaId: string;
  materialName: string;
  category: string;
  quantityPlanned: number;
  quantityUsed: number;
  unit: string;
  cost: number;
  supplier: string;
  deliveryDate: string;
  usageDate: string;
  quality: 'excellent' | 'good' | 'acceptable' | 'rejected';
  wastage: number;
  notes: string;
}

interface LaborRecord {
  id: string;
  areaId: string;
  date: string;
  trade: string;
  skillLevel: 'helper' | 'semi-skilled' | 'skilled' | 'supervisor' | 'specialist';
  plannedWorkers: number;
  actualWorkers: number;
  hoursWorked: number;
  overtimeHours: number;
  productivity: number; // 1-5
  tasks: string[];
  supervisor: string;
  safetyTrainingCompleted: boolean;
  issues: string[];
  cost: number;
  notes: string;
}

interface EquipmentUsage {
  id: string;
  areaId: string;
  equipmentName: string;
  type: string;
  operatorName: string;
  date: string;
  hoursUsed: number;
  fuelCost: number;
  maintenanceCost: number;
  efficiency: number; // 1-5
  breakdowns: EquipmentBreakdown[];
  tasks: string[];
  notes: string;
}

interface EquipmentBreakdown {
  id: string;
  description: string;
  timeOccurred: string;
  timeFixed?: string;
  cause: string;
  solution: string;
  cost: number;
  preventiveAction: string;
}

interface WorkApproval {
  id: string;
  workPackageId: string;
  type: 'start' | 'progress' | 'completion' | 'payment' | 'quality' | 'handover';
  status: 'pending' | 'approved' | 'rejected' | 'conditional';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  conditions?: string[];
  documents: string[];
  nextApprovalRequired?: string;
}

const PROJECT_STATUS_CONFIG = {
  'planning': { label: 'Planning', color: 'bg-blue-100 text-blue-800', icon: Target },
  'permitting': { label: 'Permitting', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'construction': { label: 'Construction', color: 'bg-orange-100 text-orange-800', icon: PlayCircle },
  'marketing': { label: 'Marketing', color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
  'sales': { label: 'Sales', color: 'bg-indigo-100 text-indigo-800', icon: DollarSign },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  'on-hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800', icon: PauseCircle }
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' }
};

export const ProjectDetailEnhanced: React.FC<ProjectDetailEnhancedProps> = ({ 
  project, 
  user, 
  onBack,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState<Project>(project);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [financialData, setFinancialData] = useState<FinancialCategory[]>([]);
  const [enhancedUnits, setEnhancedUnits] = useState<EnhancedUnit[]>([]);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [constructionAreas, setConstructionAreas] = useState<ConstructionArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Timeline states
  const [timelineView, setTimelineView] = useState<'gantt' | 'list' | 'calendar'>('gantt');
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  
  // Financial states
  const [financialView, setFinancialView] = useState<'overview' | 'budget' | 'transactions' | 'forecasting'>('overview');
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  
  // Unit Booking states
  const [unitsView, setUnitsView] = useState<'grid' | 'list' | 'floor-plan'>('grid');
  const [unitFilter, setUnitFilter] = useState('all');
  const [unitSearch, setUnitSearch] = useState('');
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<EnhancedUnit | null>(null);
  
  // Construction states
  const [constructionView, setConstructionView] = useState<'areas' | 'tasks' | 'quality' | 'safety'>('areas');
  const [showConstructionForm, setShowConstructionForm] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [project.id]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadTimelineEvents(),
        loadFinancialData(),
        loadEnhancedUnits(),
        loadCustomerBookings(),
        loadConstructionAreas()
      ]);
    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimelineEvents = async () => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('timeline_events') || '[]');
      const projectEvents = storedEvents.filter((event: TimelineEvent) => event.projectId === project.id);
      setTimelineEvents(projectEvents);
    } catch (error) {
      console.error('Error loading timeline events:', error);
    }
  };

  const loadFinancialData = async () => {
    try {
      const storedFinancials = JSON.parse(localStorage.getItem('project_financials') || '[]');
      const projectFinancials = storedFinancials.filter((data: any) => data.projectId === project.id);
      setFinancialData(projectFinancials);
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  };

  const loadEnhancedUnits = async () => {
    try {
      const storedUnits = JSON.parse(localStorage.getItem('enhanced_units') || '[]');
      const projectUnits = storedUnits.filter((unit: EnhancedUnit) => unit.projectId === project.id);
      setEnhancedUnits(projectUnits);
    } catch (error) {
      console.error('Error loading enhanced units:', error);
    }
  };

  const loadCustomerBookings = async () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('customer_bookings') || '[]');
      const projectBookings = storedBookings.filter((booking: CustomerBooking) => booking.projectId === project.id);
      setCustomerBookings(projectBookings);
    } catch (error) {
      console.error('Error loading customer bookings:', error);
    }
  };

  const loadConstructionAreas = async () => {
    try {
      const storedAreas = JSON.parse(localStorage.getItem('construction_areas') || '[]');
      const projectAreas = storedAreas.filter((area: ConstructionArea) => area.projectId === project.id);
      setConstructionAreas(projectAreas);
    } catch (error) {
      console.error('Error loading construction areas:', error);
    }
  };

  // Calculate enhanced metrics
  const getEnhancedMetrics = () => {
    const totalBudget = projectData.budget?.totalBudget || 0;
    const spentBudget = projectData.budget?.spentBudget || 0;
    const projectedRevenue = projectData.revenue?.projectedRevenue || 0;
    
    // Timeline metrics
    const totalEvents = timelineEvents.length;
    const completedEvents = timelineEvents.filter(e => e.status === 'completed').length;
    const overallProgress = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
    const delayedEvents = timelineEvents.filter(e => e.status === 'delayed').length;
    
    // Financial metrics
    const totalTransactions = financialData.reduce((sum, cat) => 
      sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.transactions.length, 0), 0);
    const cashFlow = financialData.reduce((sum, cat) => 
      sum + cat.subcategories.reduce((subSum, sub) => 
        subSum + sub.transactions.reduce((transSum, trans) => 
          transSum + (trans.type === 'income' ? trans.amount : -trans.amount), 0), 0), 0);
    
    // Unit metrics
    const totalUnits = enhancedUnits.length;
    const availableUnits = enhancedUnits.filter(u => u.status === 'available').length;
    const soldUnits = enhancedUnits.filter(u => u.status === 'sold' || u.status === 'booked').length;
    const totalInventoryValue = enhancedUnits.reduce((sum, unit) => sum + unit.currentPrice, 0);
    const soldValue = enhancedUnits.filter(u => u.status === 'sold' || u.status === 'booked')
      .reduce((sum, unit) => sum + unit.currentPrice, 0);
    
    // Construction metrics
    const totalAreas = constructionAreas.length;
    const completedAreas = constructionAreas.filter(a => a.status === 'completed').length;
    const constructionProgress = totalAreas > 0 ? 
      Math.round(constructionAreas.reduce((sum, area) => sum + area.progress, 0) / totalAreas) : 0;
    const activeIssues = constructionAreas.reduce((sum, area) => 
      sum + area.issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress').length, 0);
    
    // Customer metrics
    const totalBookings = customerBookings.length;
    const activeBookings = customerBookings.filter(b => b.status === 'active').length;
    const totalBookingValue = customerBookings.reduce((sum, booking) => sum + booking.finalAmount, 0);
    const collectedAmount = customerBookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
    
    return {
      totalBudget,
      spentBudget,
      remainingBudget: totalBudget - spentBudget,
      budgetUtilization: totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0,
      projectedRevenue,
      projectedProfit: projectedRevenue - totalBudget,
      profitMargin: projectedRevenue > 0 ? ((projectedRevenue - totalBudget) / projectedRevenue) * 100 : 0,
      roi: totalBudget > 0 ? ((projectedRevenue - totalBudget) / totalBudget) * 100 : 0,
      
      // Timeline
      totalEvents,
      completedEvents,
      overallProgress,
      delayedEvents,
      
      // Financial
      totalTransactions,
      cashFlow,
      
      // Units
      totalUnits,
      availableUnits,
      soldUnits,
      totalInventoryValue,
      soldValue,
      salesConversion: totalUnits > 0 ? (soldUnits / totalUnits) * 100 : 0,
      
      // Construction
      totalAreas,
      completedAreas,
      constructionProgress,
      activeIssues,
      
      // Customers
      totalBookings,
      activeBookings,
      totalBookingValue,
      collectedAmount,
      pendingCollection: totalBookingValue - collectedAmount
    };
  };

  const metrics = getEnhancedMetrics();
  const StatusIcon = PROJECT_STATUS_CONFIG[projectData.status]?.icon || Target;

  // Enhanced Timeline Component
  const renderEnhancedTimeline = () => (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Timeline</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive project timeline with dependencies and milestones
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timelineView} onValueChange={(value) => setTimelineView(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gantt">Gantt View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowTimelineForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.completedEvents}</p>
              <p className="text-sm text-muted-foreground">Completed Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{metrics.totalEvents - metrics.completedEvents}</p>
              <p className="text-sm text-muted-foreground">Remaining Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.delayedEvents}</p>
              <p className="text-sm text-muted-foreground">Delayed Events</p>
            </div>
          </div>
          
          {timelineView === 'gantt' && renderGanttView()}
          {timelineView === 'list' && renderTimelineList()}
          {timelineView === 'calendar' && renderTimelineCalendar()}
        </CardContent>
      </Card>
    </div>
  );

  const renderGanttView = () => (
    <div className="space-y-4">
      {timelineEvents.length > 0 ? (
        <div className="relative">
          {/* Gantt Chart Implementation */}
          <div className="space-y-2">
            {timelineEvents.map((event, index) => {
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              const duration = differenceInDays(endDate, startDate) + 1;
              const projectStart = new Date(project.timeline?.startDate || new Date());
              const daysFromStart = differenceInDays(startDate, projectStart);
              
              return (
                <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={PRIORITY_CONFIG[event.priority].color}>
                          {event.priority}
                        </Badge>
                        <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                        <span className="text-sm font-medium">{event.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd')} ({duration} days)
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            event.status === 'completed' ? 'bg-green-500' :
                            event.status === 'delayed' ? 'bg-red-500' :
                            event.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{event.progress}% complete</span>
                        <div className="flex items-center space-x-1">
                          {event.dependencies.length > 0 && (
                            <GitBranch className="h-3 w-3 text-muted-foreground" />
                          )}
                          {event.attachments.length > 0 && (
                            <FileText className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingEvent(event);
                          setShowTimelineForm(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link className="h-4 w-4 mr-2" />
                          Manage Dependencies
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No timeline events yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding milestones, phases, and key project events to track progress.
          </p>
          <Button onClick={() => setShowTimelineForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Event
          </Button>
        </div>
      )}
    </div>
  );

  const renderTimelineList = () => (
    <div className="space-y-4">
      {timelineEvents.map(event => (
        <Card key={event.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={PRIORITY_CONFIG[event.priority].color}>
                  {event.priority}
                </Badge>
                <h4 className="font-medium">{event.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{event.progress}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatPKR(event.budget)}</span>
                </span>
              </div>
            </div>
            <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
              {event.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderTimelineCalendar = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium mb-2">Calendar View</h3>
        <p className="text-muted-foreground">Interactive calendar view coming soon</p>
      </div>
    </div>
  );

  // Enhanced Financial Component
  const renderEnhancedFinancials = () => (
    <div className="space-y-6">
      {/* Financial Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive financial tracking and budget management
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={financialView} onValueChange={(value) => setFinancialView(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="budget">Budget Tracking</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="forecasting">Forecasting</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowFinancialForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Banknote className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPKR(metrics.totalBudget / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPKR(metrics.cashFlow / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.budgetUtilization.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <LineChart className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.roi.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Projected ROI</p>
                </div>
              </div>
            </Card>
          </div>
          
          {financialView === 'overview' && renderFinancialOverview()}
          {financialView === 'budget' && renderBudgetTracking()}
          {financialView === 'transactions' && renderTransactionHistory()}
          {financialView === 'forecasting' && renderFinancialForecasting()}
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialOverview = () => (
    <div className="space-y-6">
      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Used</span>
              <span>{formatPKR(metrics.spentBudget)} / {formatPKR(metrics.totalBudget)}</span>
            </div>
            <Progress value={metrics.budgetUtilization} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{metrics.budgetUtilization.toFixed(1)}% utilized</span>
              <span>{formatPKR(metrics.remainingBudget)} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue vs Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Unit Sales</span>
                <span className="font-medium">{formatPKR(metrics.soldValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Amount</span>
                <span className="font-medium">{formatPKR(metrics.collectedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Collections</span>
                <span className="font-medium text-orange-600">{formatPKR(metrics.pendingCollection)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Revenue</span>
                <span className="text-green-600">{formatPKR(metrics.projectedRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Major Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Construction</span>
                <span className="font-medium">{formatPKR(metrics.spentBudget * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span>Materials</span>
                <span className="font-medium">{formatPKR(metrics.spentBudget * 0.15)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor</span>
                <span className="font-medium">{formatPKR(metrics.spentBudget * 0.1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Other</span>
                <span className="font-medium">{formatPKR(metrics.spentBudget * 0.05)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Expenses</span>
                <span className="text-red-600">{formatPKR(metrics.spentBudget)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBudgetTracking = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Budget Categories</h3>
      {financialData.length > 0 ? (
        <div className="space-y-4">
          {financialData.map(category => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <Badge variant="outline">
                    {((category.budgetSpent / category.budgetAllocated) * 100).toFixed(1)}% used
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Allocated: {formatPKR(category.budgetAllocated)}</span>
                    <span>Spent: {formatPKR(category.budgetSpent)}</span>
                  </div>
                  <Progress value={((category.budgetSpent / category.budgetAllocated) * 100)} className="h-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.subcategories.map(sub => (
                      <div key={sub.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{sub.name}</span>
                          <span>{formatPKR(sub.budgetSpent)} / {formatPKR(sub.budgetAllocated)}</span>
                        </div>
                        <Progress value={((sub.budgetSpent / sub.budgetAllocated) * 100)} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No budget categories set up</h3>
          <p className="text-muted-foreground mb-4">
            Create budget categories to track spending across different project areas.
          </p>
          <Button onClick={() => setShowFinancialForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Set Up Budget
          </Button>
        </div>
      )}
    </div>
  );

  const renderTransactionHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {metrics.totalTransactions > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Sample data - in real implementation, this would come from financialData */}
                <TableRow>
                  <TableCell>{format(new Date(), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>Construction Payment - Phase 1</TableCell>
                  <TableCell>Construction</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Expense</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPKR(2500000)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No transactions recorded</h3>
              <p className="text-muted-foreground">
                Transaction history will appear here as you record income and expenses.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialForecasting = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Financial Forecasting</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{formatPKR(metrics.cashFlow)}</p>
                <p className="text-sm text-muted-foreground">Current Net Cash Flow</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">+{formatPKR(metrics.projectedRevenue / 1000000)}M</p>
                  <p className="text-xs text-muted-foreground">Expected Inflow</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-600">-{formatPKR(metrics.remainingBudget / 1000000)}M</p>
                  <p className="text-xs text-muted-foreground">Planned Outflow</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{formatPKR(metrics.projectedProfit / 1000000)}M</p>
                  <p className="text-xs text-muted-foreground">Net Position</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profitability Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Gross Profit Margin</span>
                <span className="font-medium">{metrics.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Return on Investment</span>
                <span className="font-medium">{metrics.roi.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Break-even Point</span>
                <span className="font-medium">{Math.round(metrics.salesConversion)}% sales</span>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Project Viability</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {metrics.roi > 15 ? (
                    <>
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">Excellent</span>
                    </>
                  ) : metrics.roi > 10 ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-600">Good</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-600">Review Required</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Enhanced Unit Booking Component
  const renderEnhancedUnitBooking = () => (
    <div className="space-y-6">
      {/* Unit Booking Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Smart Unit Booking System</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced unit inventory and customer booking management for sales teams
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={unitsView} onValueChange={(value) => setUnitsView(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="floor-plan">Floor Plan</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowUnitForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sales Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.totalUnits}</p>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.availableUnits}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.soldUnits}</p>
                  <p className="text-sm text-muted-foreground">Sold</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.salesConversion.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Sales Rate</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Banknote className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPKR(metrics.soldValue / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">Sales Value</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Advanced Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search units..."
                    value={unitSearch}
                    onChange={(e) => setUnitSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={unitFilter} onValueChange={setUnitFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                    <SelectItem value="2br">2 Bedroom</SelectItem>
                    <SelectItem value="3br">3 Bedroom</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {unitsView === 'grid' && renderUnitsGrid()}
          {unitsView === 'list' && renderUnitsList()}
          {unitsView === 'floor-plan' && renderFloorPlan()}
        </CardContent>
      </Card>
    </div>
  );

  const renderUnitsGrid = () => {
    const filteredUnits = enhancedUnits.filter(unit => {
      const matchesSearch = unit.unitNumber.toLowerCase().includes(unitSearch.toLowerCase()) ||
                           unit.unitType.toLowerCase().includes(unitSearch.toLowerCase());
      const matchesFilter = unitFilter === 'all' || unit.status === unitFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUnits.map(unit => (
          <Card key={unit.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardContent className="p-0">
              {/* Unit Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
                {unit.images.length > 0 ? (
                  <img
                    src={unit.images[0]}
                    alt={unit.unitNumber}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Home className="h-16 w-16 text-blue-300" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={getUnitStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </div>
                
                {/* Priority Badge */}
                {unit.priority !== 'standard' && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      {unit.priority}
                    </Badge>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Unit Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{unit.unitNumber}</h3>
                  <Badge variant="outline" className="text-xs">
                    {unit.block && `Block ${unit.block}`}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="capitalize">{unit.unitType.replace('br', ' Bedroom')}</p>
                  {unit.floor && <p>Floor {unit.floor}</p>}
                </div>
                
                {/* Unit Specifications */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.area} sqft</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bedrooms} BR</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.parkingSlots} Parking</span>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="border-t border-b py-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatPKR(unit.currentPrice)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPKR(unit.pricePerSqft)} per sqft
                    </p>
                  </div>
                </div>
                
                {/* Amenities Preview */}
                {unit.amenities.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {unit.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {unit.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{unit.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // Edit unit functionality
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={unit.status === 'sold' || unit.status === 'booked'}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setShowBookingForm(true);
                    }}
                  >
                    {unit.status === 'available' ? 'Book Now' : 
                     unit.status === 'reserved' ? 'Convert' : 'Booked'}
                  </Button>
                </div>
                
                {/* Quick Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Updated {format(new Date(unit.updatedAt), 'MMM dd')}</span>
                  <div className="flex items-center space-x-2">
                    {unit.virtualTour && <Badge variant="outline" className="text-xs">3D Tour</Badge>}
                    {unit.readyForHandover && <Badge variant="outline" className="text-xs">Ready</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredUnits.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No units found</h3>
            <p className="text-muted-foreground mb-4">
              {unitSearch || unitFilter !== 'all'
                ? 'Try adjusting your search or filters to see more units.'
                : 'Start by adding units to your project inventory.'}
            </p>
            {!unitSearch && unitFilter === 'all' && (
              <Button onClick={() => setShowUnitForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Unit
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const getUnitStatusColor = (status: string) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'blocked': 'bg-gray-100 text-gray-800',
      'reserved': 'bg-yellow-100 text-yellow-800',
      'booked': 'bg-blue-100 text-blue-800',
      'sold': 'bg-purple-100 text-purple-800',
      'handed-over': 'bg-indigo-100 text-indigo-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderUnitsList = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Amenities</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancedUnits.map(unit => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                  <TableCell className="capitalize">{unit.unitType}</TableCell>
                  <TableCell>{unit.area} sqft</TableCell>
                  <TableCell>{formatPKR(unit.currentPrice)}</TableCell>
                  <TableCell>
                    <Badge className={getUnitStatusColor(unit.status)}>
                      {unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{unit.floor || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {unit.amenities.slice(0, 2).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {unit.amenities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{unit.amenities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Unit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={unit.status === 'sold' || unit.status === 'booked'}
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowBookingForm(true);
                          }}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Book Unit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Generate Brochure
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderFloorPlan = () => (
    <div className="text-center py-12">
      <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Interactive Floor Plan</h3>
      <p className="text-muted-foreground mb-4">
        Visual floor plan with unit availability coming soon
      </p>
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Upload Floor Plan
      </Button>
    </div>
  );

  // Enhanced Construction Tracking Component
  const renderEnhancedConstruction = () => (
    <div className="space-y-6">
      {/* Construction Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Smart Construction Tracking</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Intelligent construction management with real-time progress tracking
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={constructionView} onValueChange={(value) => setConstructionView(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="areas">Areas</SelectItem>
                  <SelectItem value="tasks">Tasks</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowConstructionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Construction Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Gauge className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.constructionProgress}%</p>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.totalAreas}</p>
                  <p className="text-sm text-muted-foreground">Active Areas</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.activeIssues}</p>
                  <p className="text-sm text-muted-foreground">Open Issues</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">4.2</p>
                  <p className="text-sm text-muted-foreground">Safety Score</p>
                </div>
              </div>
            </Card>
          </div>
          
          {constructionView === 'areas' && renderConstructionAreas()}
          {constructionView === 'tasks' && renderConstructionTasks()}
          {constructionView === 'quality' && renderQualityTracking()}
          {constructionView === 'safety' && renderSafetyTracking()}
        </CardContent>
      </Card>
    </div>
  );

  const renderConstructionAreas = () => (
    <div className="space-y-4">
      {constructionAreas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {constructionAreas.map(area => (
            <Card key={area.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{area.type}</p>
                  </div>
                  <Badge className={getConstructionStatusColor(area.status)}>
                    {area.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{area.description}</p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{area.progress}%</span>
                  </div>
                  <Progress value={area.progress} className="h-3" />
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">{formatPKR(area.budget)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Spent:</span>
                    <p className="font-medium">{formatPKR(area.spentAmount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Work Packages:</span>
                    <p className="font-medium">{area.workPackages.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issues:</span>
                    <p className="font-medium text-red-600">{area.issues.length}</p>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{format(new Date(area.startDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target End:</span>
                    <p className="font-medium">{format(new Date(area.targetEndDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {area.supervisor}
                    </Badge>
                    {area.photos.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        {area.photos.length}
                      </Badge>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Area
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photos
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Issue
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Quality Check
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No construction areas defined</h3>
          <p className="text-muted-foreground mb-4">
            Start by defining construction areas to organize and track your project work.
          </p>
          <Button onClick={() => setShowConstructionForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Area
          </Button>
        </div>
      )}
    </div>
  );

  const getConstructionStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'delayed': 'bg-red-100 text-red-800',
      'on-hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderConstructionTasks = () => (
    <div className="text-center py-12">
      <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Task Management</h3>
      <p className="text-muted-foreground">
        Detailed task tracking and assignment coming soon
      </p>
    </div>
  );

  const renderQualityTracking = () => (
    <div className="text-center py-12">
      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Quality Control</h3>
      <p className="text-muted-foreground">
        Quality inspections and compliance tracking coming soon
      </p>
    </div>
  );

  const renderSafetyTracking = () => (
    <div className="text-center py-12">
      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Safety Management</h3>
      <p className="text-muted-foreground">
        Safety incident tracking and compliance monitoring coming soon
      </p>
    </div>
  );

  // Enhanced Overview Tab
  const renderEnhancedOverview = () => (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{metrics.overallProgress}%</p>
                <p className="text-sm text-blue-700">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{formatPKR(metrics.totalBudget / 1000000)}M</p>
                <p className="text-sm text-green-700">Project Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{metrics.salesConversion.toFixed(1)}%</p>
                <p className="text-sm text-purple-700">Sales Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">{metrics.totalUnits}</p>
                <p className="text-sm text-orange-700">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Health Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                  <span className="text-2xl font-bold text-green-600">8.5</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Health Score</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Timeline Performance</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget Control</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.budgetUtilization} className="w-20 h-2" />
                    <span className="text-sm font-medium">{metrics.budgetUtilization.toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Standards</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={90} className="w-20 h-2" />
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safety Compliance</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={95} className="w-20 h-2" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{metrics.completedEvents}</p>
                  <p className="text-xs text-blue-700">Milestones Achieved</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{metrics.soldUnits}</p>
                  <p className="text-xs text-green-700">Units Sold</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{metrics.activeBookings}</p>
                  <p className="text-xs text-purple-700">Active Bookings</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{metrics.totalAreas}</p>
                  <p className="text-xs text-orange-700">Construction Areas</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Revenue Recognition</span>
                  <span className="font-medium">{formatPKR(metrics.collectedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Collections</span>
                  <span className="font-medium text-orange-600">{formatPKR(metrics.pendingCollection)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Net Cash Position</span>
                  <span className={`font-medium ${metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPKR(metrics.cashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Foundation work completed in Block A</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Unit A-101 booking confirmed</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality inspection scheduled for tomorrow</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received from customer</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Important Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.delayedEvents > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {metrics.delayedEvents} timeline event(s) delayed
                    </p>
                    <p className="text-xs text-red-700">Requires immediate attention</p>
                  </div>
                </div>
              )}
              
              {metrics.activeIssues > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      {metrics.activeIssues} construction issue(s) pending
                    </p>
                    <p className="text-xs text-yellow-700">Review and assign resolution</p>
                  </div>
                </div>
              )}
              
              {metrics.budgetUtilization > 80 && (
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      Budget utilization at {metrics.budgetUtilization.toFixed(1)}%
                    </p>
                    <p className="text-xs text-orange-700">Monitor spending closely</p>
                  </div>
                </div>
              )}
              
              {metrics.pendingCollection > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {formatPKR(metrics.pendingCollection)} pending collection
                    </p>
                    <p className="text-xs text-blue-700">Follow up with customers</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading enhanced project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="border-b bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{projectData.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={PROJECT_STATUS_CONFIG[projectData.status]?.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {PROJECT_STATUS_CONFIG[projectData.status]?.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {projectData.location?.city}, {projectData.location?.state}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(projectData.timeline?.startDate || new Date()), 'MMM yyyy')} - 
                    {format(new Date(projectData.timeline?.estimatedEndDate || new Date()), 'MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Data
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={() => onNavigate('edit-project', projectData)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white">
          <div className="px-6">
            <TabsList className="h-12 bg-transparent">
              <TabsTrigger value="overview" className="px-6">
                <Target className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="timeline" className="px-6">
                <Clock className="h-4 w-4 mr-2" />
                Smart Timeline
              </TabsTrigger>
              <TabsTrigger value="financial" className="px-6">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial Hub
              </TabsTrigger>
              <TabsTrigger value="units" className="px-6">
                <Home className="h-4 w-4 mr-2" />
                Unit Booking
              </TabsTrigger>
              <TabsTrigger value="construction" className="px-6">
                <Building2 className="h-4 w-4 mr-2" />
                Construction
              </TabsTrigger>
              <TabsTrigger value="team" className="px-6">
                <Users className="h-4 w-4 mr-2" />
                Team & CRM
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-6">
          <TabsContent value="overview" className="mt-0">
            {renderEnhancedOverview()}
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            {renderEnhancedTimeline()}
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            {renderEnhancedFinancials()}
          </TabsContent>

          <TabsContent value="units" className="mt-0">
            {renderEnhancedUnitBooking()}
          </TabsContent>

          <TabsContent value="construction" className="mt-0">
            {renderEnhancedConstruction()}
          </TabsContent>

          <TabsContent value="team" className="mt-0">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Team & CRM Management</h3>
                      <p className="text-sm text-blue-700">
                        Manage stakeholders, contractors, vendors, and customers using the integrated CRM system.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onNavigate('crm')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Open Developers CRM
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};