/**
 * aaraazi - Comprehensive Real Estate Management Platform
 * 
 * DESIGN SYSTEM V4.1 - Flexible, Extensible, Context-Aware
 * =========================================================
 * 
 * This application follows Design System V4.1 guidelines.
 * 
 * QUICK START:
 * - New feature? Read: /DESIGN_SYSTEM_QUICK_START.md (5 min)
 * - Complete guide: /DESIGN_SYSTEM_V4_COMPREHENSIVE_GUIDE.md
 * - All resources: /DESIGN_SYSTEM_INDEX.md
 * - Guidelines: /Guidelines.md
 * 
 * CORE TEMPLATES (Start here for 90% of cases):
 * - DetailPageTemplate: Single entity detail pages
 * - WorkspaceTemplate: List/grid/kanban pages
 * - FormTemplate: Create/edit forms
 * 
 * QUALITY STANDARDS (Apply to ALL components):
 * - UX Laws: Fitts, Miller, Hick, Jakob, Aesthetic-Usability
 * - Design Tokens: 8px grid, CSS variables, no typography classes
 * - Accessibility: WCAG 2.1 AA, keyboard nav, ARIA labels
 * 
 * See /Guidelines.md for complete development standards.
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SaaSLogin } from './components/SaaSLogin';
import { SaaSAdminDashboard } from './components/SaaSAdminDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { ModuleSelector } from './components/ModuleSelector';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DashboardV4 } from './components/dashboard/DashboardV4';
import { DevelopersDashboard } from './components/DevelopersDashboard';
import { initializeSaaSSstem, getCurrentSaaSUser, hasModuleAccess, saasLogout } from './lib/saas';
import { initializeUsers } from './lib/auth';
import { initializeData } from './lib/data';
import { initializeInvestorData } from './lib/investors'; // For purchase cycle investor syndication
import { SaaSUser, User, Property, Project, LandParcel, Contact } from './types';
import { BuyerRequirement, RentRequirement, SellCycle, PurchaseCycle, RentCycle } from './types';
import { Users } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import { Button } from './components/ui/button';
import { getUnreadCount } from './lib/notifications';
import { getPropertyById, getContacts, getProperties, deleteContact } from './lib/data';
import { getSellCycleById, getSellCycles } from './lib/sellCycle';
import { getPurchaseCycles, getPurchaseCycleById } from './lib/purchaseCycle';
import { getRentCycles, getRentCycleById } from './lib/rentCycle';
import { BrandTestPage } from './components/test/BrandTestPage';
import { NotificationShowcase } from './components/test/NotificationShowcase'; // PHASE 5 TASK 3
import { getBuyerRequirementById } from './lib/buyerRequirements';
import { getRentRequirement } from './lib/rentRequirements';
import { logger } from './lib/logger';

// Property Status Migration (load for dev tools access)
import './lib/propertyStatusMigration';

// Lazy load heavy components to improve initial load time
const AcquisitionTypeSelector = lazy(() => import('./components/AcquisitionTypeSelector').then(m => ({ default: m.AcquisitionTypeSelector })));
const PropertyFormV2 = lazy(() => import('./components/PropertyFormV2').then(m => ({ default: m.PropertyFormV2 })));
const PropertyManagementV3 = lazy(() => import('./components/PropertyManagementV3').then(m => ({ default: m.PropertyManagementV3 })));
const PropertiesWorkspaceV4 = lazy(() => import('./components/properties/PropertiesWorkspaceV4'));
const Inventory = lazy(() => import('./components/Inventory').then(m => ({ default: m.Inventory })));
const PropertyDetail = lazy(() => import('./components/PropertyDetailsV4').then(m => ({ default: m.PropertyDetailsV4 })));

// V4 Lead Management System (NEW - Redesigned)
const LeadWorkspaceV4 = lazy(() => import('./components/leads/LeadWorkspaceV4').then(m => ({ default: m.LeadWorkspaceV4 })));
const LeadDetailsV4 = lazy(() => import('./components/leads/LeadDetailsV4').then(m => ({ default: m.LeadDetailsV4 })));

// OLD Lead Components (DEPRECATED - Keeping for reference only)
const LeadFormV2 = lazy(() => import('./components/LeadFormV2').then(m => ({ default: m.LeadFormV2 })));
const Leads = lazy(() => import('./components/Leads').then(m => ({ default: m.Leads })));

const FollowUpTasks = lazy(() => import('./components/FollowUpTasks').then(m => ({ default: m.FollowUpTasks })));
const CommissionReports = lazy(() => import('./components/CommissionReports').then(m => ({ default: m.CommissionReports })));
const FinancialsHub = lazy(() => import('./components/FinancialsHub').then(m => ({ default: m.FinancialsHub })));
const FinancialsHubV4 = lazy(() => import('./components/financials/FinancialsHubV4').then(m => ({ default: m.FinancialsHubV4 })));
const ProjectAccounting = lazy(() => import('./components/ProjectAccounting').then(m => ({ default: m.ProjectAccounting })));
const BankingTreasury = lazy(() => import('./components/BankingTreasury').then(m => ({ default: m.BankingTreasury })));
const FinancialReports = lazy(() => import('./components/FinancialReports').then(m => ({ default: m.FinancialReports })));
const DocumentManagement = lazy(() => import('./components/DocumentManagement').then(m => ({ default: m.DocumentManagement })));
const AgencyHub = lazy(() => import('./components/AgencyHub').then(m => ({ default: m.AgencyHub })));
const ProjectForm = lazy(() => import('./components/ProjectForm').then(m => ({ default: m.ProjectForm })));
const ProjectList = lazy(() => import('./components/ProjectList').then(m => ({ default: m.ProjectList })));
const ProjectDetailEnhanced = lazy(() => import('./components/ProjectDetailEnhancedFixed').then(m => ({ default: m.ProjectDetailEnhanced })));
const LandAcquisitionDashboard = lazy(() => import('./components/LandAcquisitionDashboard').then(m => ({ default: m.LandAcquisitionDashboard })));
const LandParcelForm = lazy(() => import('./components/LandParcelForm').then(m => ({ default: m.LandParcelForm })));
const FeasibilityCalculator = lazy(() => import('./components/FeasibilityCalculator').then(m => ({ default: m.FeasibilityCalculator })));
const ProcurementDashboard = lazy(() => import('./components/ProcurementDashboard').then(m => ({ default: m.ProcurementDashboard })));
const AdvancedFinancials = lazy(() => import('./components/AdvancedFinancials').then(m => ({ default: m.AdvancedFinancials })));
const AdvancedSupplierManagement = lazy(() => import('./components/AdvancedSupplierManagement').then(m => ({ default: m.AdvancedSupplierManagement })));
const SmartProcurementCostControl = lazy(() => import('./components/SmartProcurementCostControl').then(m => ({ default: m.SmartProcurementCostControl })));
const CentralInventory = lazy(() => import('./components/CentralInventory').then(m => ({ default: m.CentralInventory })));
const GoodsReceiptNoteForm = lazy(() => import('./components/GoodsReceiptNoteForm').then(m => ({ default: m.GoodsReceiptNoteForm })));
const AgencyPropertiesDashboard = lazy(() => import('./components/AgencyPropertiesDashboard').then(m => ({ default: m.AgencyPropertiesDashboard })));
const DocumentCenter = lazy(() => import('./components/DocumentCenter').then(m => ({ default: m.DocumentCenter })));
const DocumentTemplates = lazy(() => import('./components/DocumentTemplates').then(m => ({ default: m.DocumentTemplates })));
const AgencyAnalyticsDashboard = lazy(() => import('./components/AgencyAnalyticsDashboard').then(m => ({ default: m.AgencyAnalyticsDashboard })));
const PortfolioHub = lazy(() => import('./components/portfolio/PortfolioHub'));
const NotificationCenter = lazy(() => import('./components/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const UserProfile = lazy(() => import('./components/UserProfile').then(m => ({ default: m.UserProfile })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));

// V3.0 Cycle Workspaces
const SellCyclesWorkspace = lazy(() => import('./components/SellCyclesWorkspace').then(m => ({ default: m.SellCyclesWorkspace })));
const SellCyclesWorkspaceV4 = lazy(() => import('./components/sell-cycles/SellCyclesWorkspaceV4').then(m => ({ default: m.SellCyclesWorkspaceV4 })));
const SellCycleDetails = lazy(() => import('./components/SellCycleDetailsV4').then(m => ({ default: m.SellCycleDetailsV4 })));
const PurchaseCyclesWorkspace = lazy(() => import('./components/PurchaseCyclesWorkspace').then(m => ({ default: m.PurchaseCyclesWorkspace })));
const PurchaseCyclesWorkspaceV4 = lazy(() => import('./components/purchase-cycles/PurchaseCyclesWorkspaceV4').then(m => ({ default: m.PurchaseCyclesWorkspaceV4 })));
const PurchaseCycleDetails = lazy(() => import('./components/PurchaseCycleDetailsV4').then(m => ({ default: m.PurchaseCycleDetailsV4 })));
const RentCyclesWorkspace = lazy(() => import('./components/RentCyclesWorkspace').then(m => ({ default: m.RentCyclesWorkspace })));
const RentCyclesWorkspaceV4 = lazy(() => import('./components/rent-cycles/RentCyclesWorkspaceV4').then(m => ({ default: m.RentCyclesWorkspaceV4 })));
const RentCycleDetails = lazy(() => import('./components/RentCycleDetailsV4').then(m => ({ default: m.RentCycleDetailsV4 })));
const BuyerRequirementsWorkspace = lazy(() => import('./components/BuyerRequirementsWorkspace').then(m => ({ default: m.BuyerRequirementsWorkspace })));
const BuyerRequirementsWorkspaceV4 = lazy(() => import('./components/requirements/BuyerRequirementsWorkspaceV4').then(m => ({ default: m.BuyerRequirementsWorkspaceV4 })));
const BuyerRequirementDetailsV4 = lazy(() => import('./components/BuyerRequirementDetailsV4').then(m => ({ default: m.BuyerRequirementDetailsV4 })));
const RentRequirementsWorkspace = lazy(() => import('./components/RentRequirementsWorkspace').then(m => ({ default: m.RentRequirementsWorkspace })));
const RentRequirementDetailsV4 = lazy(() => import('./components/RentRequirementDetailsV4').then(m => ({ default: m.RentRequirementDetailsV4 })));
const DealDashboard = lazy(() => import('./components/DealDashboard').then(m => ({ default: m.DealDashboard })));
const DealsWorkspaceV4 = lazy(() => import('./components/deals/DealsWorkspaceV4').then(m => ({ default: m.DealsWorkspaceV4 })));
const DealDetails = lazy(() => import('./components/DealDetailsV4').then(m => ({ default: m.DealDetailsV4 })));
const ContactsWorkspaceV4 = lazy(() => import('./components/contacts/ContactsWorkspaceV4').then(m => ({ default: m.ContactsWorkspaceV4 })));
const ContactDetailsV4 = lazy(() => import('./components/contacts/ContactDetailsV4').then(m => ({ default: m.ContactDetailsV4 })));

// V2 Form Components - Phase 3 Form Standards
const BuyerRequirementFormV2 = lazy(() => import('./components/BuyerRequirementFormV2').then(m => ({ default: m.BuyerRequirementFormV2 })));
const ContactFormModal = lazy(() => import('./components/ContactFormModal').then(m => ({ default: m.ContactFormModal })));

// V4 Lead Modals (Non-lazy for better UX)
import { CreateLeadModal, QualifyLeadModal, ConvertLeadModal, LeadInteractionModal } from './components/leads/index';

// Cycle Forms - Full-page forms (V2 - Design System V4.1)
const SellCycleFormV2 = lazy(() => import('./components/SellCycleFormV2').then(m => ({ default: m.SellCycleFormV2 })));
const PurchaseCycleFormV2 = lazy(() => import('./components/PurchaseCycleFormV2').then(m => ({ default: m.PurchaseCycleFormV2 })));
const RentCycleFormV2 = lazy(() => import('./components/RentCycleFormV2').then(m => ({ default: m.RentCycleFormV2 })));

function App() {
  // Check for brand test page parameter
  const urlParams = new URLSearchParams(window.location.search);
  const showBrandTest = urlParams.get('brand-test') === 'true';
  const showNotificationTest = urlParams.get('notification-test') === 'true'; // PHASE 5 TASK 3

  // If brand test mode, show test page immediately
  if (showBrandTest) {
    return (
      <>
        <BrandTestPage />
        <Toaster />
      </>
    );
  }

  // PHASE 5 TASK 3: If notification test mode, show notification showcase
  if (showNotificationTest) {
    return (
      <>
        <NotificationShowcase />
        <Toaster />
      </>
    );
  }

  const [saasUser, setSaaSUser] = useState<SaaSUser | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedLandParcel, setSelectedLandParcel] = useState<LandParcel | null>(null);
  
  // V3.0 Cycle States
  const [selectedSellCycle, setSelectedSellCycle] = useState<SellCycle | null>(null);
  const [selectedPurchaseCycle, setSelectedPurchaseCycle] = useState<PurchaseCycle | null>(null);
  const [selectedRentCycle, setSelectedRentCycle] = useState<RentCycle | null>(null);
  const [selectedBuyerRequirement, setSelectedBuyerRequirement] = useState<BuyerRequirement | null>(null);
  const [selectedRentRequirement, setSelectedRentRequirement] = useState<RentRequirement | null>(null);
  
  // V4 Lead Management States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showQualifyLead, setShowQualifyLead] = useState(false);
  const [showConvertLead, setShowConvertLead] = useState(false);
  const [showLeadInteraction, setShowLeadInteraction] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [acquisitionType, setAcquisitionType] = useState<'client-listing' | 'agency-purchase' | 'investor-purchase' | null>(null);

  // Legacy user state for module compatibility
  const [user, setUser] = useState<User | null>(null);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | undefined;
    
    const initializeApp = () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            logger.warn('Initialization timeout - forcing completion');
            setIsLoading(false);
          }
        }, 3000); // Reduced from 5000 to 3000ms

        // Initialize systems synchronously with error boundaries
        try {
          initializeSaaSSstem();
        } catch (error) {
          logger.error('SaaS system initialization error:', error);
        }

        try {
          initializeUsers();
        } catch (error) {
          logger.error('Users initialization error:', error);
        }

        try {
          initializeData();
        } catch (error) {
          logger.error('Data initialization error:', error);
        }

        try {
          initializeInvestorData(); // Initialize for purchase cycle investor syndication
        } catch (error) {
          logger.error('Investor syndication data initialization error:', error);
        }
        
        if (!mounted) return;
        
        // Get current user after initialization
        try {
          const currentSaaSUser = getCurrentSaaSUser();
          if (currentSaaSUser && mounted) {
            // Batch state updates to prevent multiple renders
            if (currentSaaSUser.role !== 'saas-admin') {
              const legacyUser: User = {
                id: currentSaaSUser.id,
                email: currentSaaSUser.email,
                name: currentSaaSUser.name,
                role: currentSaaSUser.role.includes('admin') ? 'admin' : 'agent',
                avatar: currentSaaSUser.avatar
              };
              // Use a single state update with both values
              setSaaSUser(currentSaaSUser);
              setUser(legacyUser);
            } else {
              setSaaSUser(currentSaaSUser);
            }
          }
        } catch (error) {
          logger.error('User session error:', error);
        }
      } catch (error) {
        logger.error('App initialization error:', error);
      } finally {
        if (mounted) {
          if (timeoutId) clearTimeout(timeoutId);
          setIsLoading(false);
        }
      }
    };

    // Initialize immediately (synchronous)
    initializeApp();
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Listen for deal completion events to reload property
  useEffect(() => {
    const handleDealCompleted = (event: CustomEvent) => {
      const { propertyId } = event.detail;
      
      // If we're viewing this property, reload it
      if (selectedProperty && selectedProperty.id === propertyId) {
        const updatedProperty = getPropertyById(propertyId);
        if (updatedProperty) {
          setSelectedProperty(updatedProperty);
        }
      }
    };

    const handlePropertyStatusChanged = (event: CustomEvent) => {
      const { propertyId } = event.detail;
      
      // If we're viewing this property, reload it
      if (selectedProperty && selectedProperty.id === propertyId) {
        const updatedProperty = getPropertyById(propertyId);
        if (updatedProperty) {
          setSelectedProperty(updatedProperty);
        }
      }
    };

    window.addEventListener('dealCompleted', handleDealCompleted as EventListener);
    window.addEventListener('propertyStatusChanged', handlePropertyStatusChanged as EventListener);

    return () => {
      window.removeEventListener('dealCompleted', handleDealCompleted as EventListener);
      window.removeEventListener('propertyStatusChanged', handlePropertyStatusChanged as EventListener);
    };
  }, [selectedProperty]);

  const handleSaaSLogin = (loggedInUser: SaaSUser) => {
    setSaaSUser(loggedInUser);
    
    // Create legacy user for module compatibility
    if (loggedInUser.role !== 'saas-admin') {
      setUser({
        id: loggedInUser.id,
        email: loggedInUser.email,
        name: loggedInUser.name,
        role: loggedInUser.role.includes('admin') ? 'admin' : 'agent',
        avatar: loggedInUser.avatar
      });
    }
    
    toast.success(`Welcome back, ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    saasLogout();
    setSaaSUser(null);
    setUser(null);
    setCurrentModule(null);
    setActiveTab('dashboard');
    toast.success('Logged out successfully');
  };

  const handleModuleSelect = (moduleId: string) => {
    if (saasUser && hasModuleAccess(saasUser, moduleId)) {
      setCurrentModule(moduleId);
      setActiveTab('dashboard');
      toast.success(`Switched to ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Module`);
    }
  };

  // Stable callbacks with no dependencies to prevent render loops
  const handleNavigation = React.useCallback((page: string, data?: any) => {
    // Handle SaaS-specific navigation
    if (page === 'module-selector') {
      setCurrentModule(null);
      return;
    }
    
    // Validate page parameter for module navigation
    const validPages = [
      'dashboard', 'properties-dashboard', 'add-property', 'inventory', 'property-detail', 
      'add-lead', 'leads', 'lead-details', 'financials', 'agency', 'analytics', 'documents', 
      'document-templates', 'budgeting', 
      'portfolio', 'project-accounting', 'banking-treasury', 'reports', 
      'projects', 'add-project', 'edit-project', 'project-detail',
      'land-acquisition', 'add-land-parcel', 'edit-land-parcel', 'land-parcel-detail',
      'feasibility-calculator', 'procurement', 'smart-procurement', 'supplier-management', 'advanced-financials',
      'central-inventory', 'goods-receipt', 'buyer-workspace', 'contacts', 'contact-details', 'add-contact', 'edit-contact',
      'sell-cycles', 'sell-cycle-detail', 'purchase-cycles', 'purchase-cycle-detail', 'rent-cycles', 'rent-cycle-detail',
      'buyer-requirements', 'buyer-requirement-detail', 'rent-requirements', 'rent-requirement-detail'
    ];
    
    if (!validPages.includes(page)) {
      logger.warn(`Invalid navigation page: ${page}, redirecting to dashboard`);
      setActiveTab('dashboard');
      return;
    }
    
    setActiveTab(page);
    
    // Handle acquisition type for add-property
    if (page === 'add-property' && data?.acquisitionType) {
      setAcquisitionType(data.acquisitionType);
    } else if (page !== 'add-property') {
      // Reset acquisition type when leaving add-property
      setAcquisitionType(null);
    }
    
    // Property navigation with validation
    if (page === 'property-detail') {
      if (data?.id) {
        setSelectedProperty(data);
      } else {
        logger.warn('Property detail navigation without valid property data');
        setActiveTab('inventory');
      }
    } else {
      setSelectedProperty(null);
    }
    
    // Project navigation with validation
    if (page === 'project-detail' || page === 'edit-project') {
      if (data?.id) {
        setSelectedProject(data);
      } else {
        logger.warn('Project navigation without valid project data');
        setActiveTab('projects');
      }
    } else if (page !== 'add-project') {
      setSelectedProject(null);
    }
    
    // Land parcel navigation with validation
    if (page === 'land-parcel-detail' || page === 'edit-land-parcel') {
      if (data?.id) {
        setSelectedLandParcel(data);
      } else {
        logger.warn('Land parcel navigation without valid data');
        setActiveTab('land-acquisition');
      }
    } else if (page !== 'add-land-parcel') {
      setSelectedLandParcel(null);
    }
    
    // V3.0 Cycle Navigation
    if (page === 'sell-cycle-details') {
      if (data?.id) {
        setSelectedSellCycle(data);
      } else {
        logger.warn('Sell cycle detail navigation without valid data');
        setActiveTab('sell-cycles');
      }
    } else {
      setSelectedSellCycle(null);
    }
    
    if (page === 'purchase-cycles') {
      if (data?.id) {
        setSelectedPurchaseCycle(data);
      } else {
        logger.warn('Purchase cycle detail navigation without valid data');
        setActiveTab('purchase-cycles');
      }
    } else {
      setSelectedPurchaseCycle(null);
    }
    
    if (page === 'rent-cycles') {
      if (data?.id) {
        setSelectedRentCycle(data);
      } else {
        logger.warn('Rent cycle detail navigation without valid data');
        setActiveTab('rent-cycles');
      }
    } else {
      setSelectedRentCycle(null);
    }
    
    if (page === 'buyer-requirements') {
      if (data?.id) {
        setSelectedBuyerRequirement(data);
      } else {
        logger.warn('Buyer requirement detail navigation without valid data');
        setActiveTab('buyer-requirements');
      }
    } else {
      setSelectedBuyerRequirement(null);
    }
    
    // V4 Lead Management Navigation
    if (page === 'lead-details') {
      if (data?.id || data) {
        setSelectedLeadId(typeof data === 'string' ? data : data?.id);
      } else {
        logger.warn('Lead detail navigation without valid lead ID');
        setActiveTab('leads');
      }
    } else {
      setSelectedLeadId(null);
    }
  }, []);

  const handleSuccess = React.useCallback(() => {
    setActiveTab('dashboard');
    toast.success('Operation completed successfully!');
  }, []);

  const handleBackToDashboard = React.useCallback(() => {
    setActiveTab('dashboard');
    setSelectedProperty(null);
    setSelectedProject(null);
    setSelectedLandParcel(null);
    setAcquisitionType(null);
  }, []);

  const handleBackToInventory = React.useCallback(() => {
    setActiveTab('inventory');
    setSelectedProperty(null);
  }, []);

  const handleBackToProjects = React.useCallback(() => {
    setActiveTab('projects');
    setSelectedProject(null);
  }, []);

  // Notification Navigation Handlers
  const handleOpenNotificationCenter = React.useCallback(() => {
    setActiveTab('notifications');
  }, []);

  const handleNavigateFromNotification = React.useCallback((entityType: string, entityId: string) => {
    switch (entityType) {
      case 'sellCycle':
        const sellCycle = getSellCycleById(entityId);
        if (sellCycle) {
          setSelectedSellCycle(sellCycle);
          setActiveTab('sell-cycle-details');
        } else {
          toast.error('Sell cycle not found');
        }
        break;
        
      case 'buyerRequirement':
        const requirement = getBuyerRequirementById(entityId);
        if (requirement) {
          setSelectedBuyerRequirement(requirement);
          setActiveTab('buyer-requirements');
        } else {
          toast.error('Buyer requirement not found');
        }
        break;
        
      case 'property':
        const property = getPropertyById(entityId);
        if (property) {
          setSelectedProperty(property);
          setActiveTab('properties');
        } else {
          toast.error('Property not found');
        }
        break;
        
      case 'lead':
        setActiveTab('leads');
        break;
        
      case 'rentCycle':
        setActiveTab('rent-cycles');
        break;
        
      case 'purchaseCycle':
        setActiveTab('purchase-cycles');
        break;
        
      case 'deal':
        // Navigate to deal management
        setActiveTab('deals');
        break;
        
      default:
        logger.warn('Unknown entity type:', entityType);
        setActiveTab('dashboard');
    }
  }, []);

  // Profile and Settings Navigation Handlers
  const handleNavigateToProfile = React.useCallback(() => {
    setActiveTab('profile');
  }, []);

  const handleNavigateToSettings = React.useCallback(() => {
    setActiveTab('settings');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading aaraazi...</p>
          <p className="mt-2 text-xs text-gray-400">Initializing data...</p>
        </div>
      </div>
    );
  }

  // Show SaaS Login if no user is logged in
  if (!saasUser) {
    return (
      <>
        <SaaSLogin onLogin={handleSaaSLogin} />
        <Toaster />
      </>
    );
  }

  // SaaS Admin Dashboard
  if (saasUser.role === 'saas-admin') {
    return (
      <>
        <SaaSAdminDashboard user={saasUser} onNavigate={handleNavigation} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Super Admin Dashboard
  if (saasUser.role === 'super-admin' && !currentModule) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            user={user} 
            saasUser={saasUser} 
            onLogout={handleLogout} 
            onModuleSwitch={() => setCurrentModule(null)}
            onNavigateToNotificationCenter={handleOpenNotificationCenter}
            onNavigateFromNotification={handleNavigateFromNotification}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToSettings={handleNavigateToSettings}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />
          <SuperAdminDashboard user={saasUser} onNavigate={handleNavigation} />
        </div>
        <Toaster />
      </>
    );
  }

  // Module Selection Screen
  if (!currentModule && saasUser.moduleAccess.length > 0) {
    return (
      <>
        <ModuleSelector user={saasUser} onModuleSelect={handleModuleSelect} />
        <Toaster />
      </>
    );
  }

  // No module access
  if (!currentModule && saasUser.moduleAccess.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Module Access</h2>
            <p className="text-gray-600 mb-4">
              Please contact your administrator to get access to the modules you need.
            </p>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign Out
            </button>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  // Render content without callback dependencies to prevent loops
  const renderContent = () => {
    // Simplified loading fallback for lazy components
    const simpleFallback = (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
    
    // Early return for invalid user state
    if (!user) {
      logger.warn('Attempting to render content without user');
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading user data...</p>
        </div>
      );
    }
    
    // Wrap content in Suspense for lazy-loaded components
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return currentModule === 'developers' 
            ? <DevelopersDashboard user={user} onNavigate={handleNavigation} />
            : <DashboardV4 user={user} onNavigate={handleNavigation} currentModule={currentModule} />;
      
      // V3.0 Properties - Main Route
      case 'properties':
        return <PropertiesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'property-detail' && id) {
              // Load the property
              const property = getPropertyById(id);
              if (property) {
                setSelectedProperty(property);
                setActiveTab('property-detail');
              }
            } else if (section === 'add-property') {
              setActiveTab('add-property');
            }
          }}
          onAddProperty={() => setActiveTab('add-property')}
          onEditProperty={(property) => { sessionStorage.setItem('edit_property_id', property.id); setActiveTab('edit-property'); }}
        />;      
      
      // V2 Form: Add Property (Direct - No Acquisition Selector)
      case 'add-property':
        return (
          <PropertyFormV2
            user={user}
            onBack={() => setActiveTab('properties')}
            onSuccess={() => {
              setActiveTab('properties');
              toast.success('Property added successfully!');
            }}
          />
        );
      
      // V2 Forms: Property Addition Flow (OLD - DEPRECATED)
      case 'select-acquisition-type':
        return (
          <AcquisitionTypeSelector
            onSelect={(type) => {
              setAcquisitionType(type);
              setActiveTab(`add-property-${type}`);
            }}
            onBack={() => {
              setAcquisitionType(null);
              setActiveTab('properties');
            }}
          />
        );
      
      case 'add-property-client-listing':
      case 'add-property-agency-purchase':
      case 'add-property-investor-purchase':
        const acqType = activeTab.replace('add-property-', '') as 'client-listing' | 'agency-purchase' | 'investor-purchase';
        return (
          <PropertyFormV2
            user={user}
            acquisitionType={acquisitionType || acqType}
            onBack={() => {
              setAcquisitionType(null);
              setActiveTab('properties');
            }}
            onSuccess={() => {
              setAcquisitionType(null);
              setActiveTab('properties');
              toast.success('Property added successfully!');
            }}
          />
        );
      
      // V2 Forms: Edit Property
      case 'edit-property':
        const editPropertyId = sessionStorage.getItem('edit_property_id');
        if (editPropertyId) {
          const propertyToEdit = getPropertyById(editPropertyId);
          
          if (propertyToEdit) {
            return (
              <PropertyFormV2
                user={user}
                editingProperty={propertyToEdit}
                onBack={() => {
                  sessionStorage.removeItem('edit_property_id');
                  setActiveTab('properties');
                }}
                onSuccess={() => {
                  sessionStorage.removeItem('edit_property_id');
                  setActiveTab('properties');
                  toast.success('Property updated successfully!');
                }}
              />
            );
          }
        }
        // If no property found, redirect to properties
        return <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} onAddProperty={() => setActiveTab('add-property')} onEditProperty={(p) => { sessionStorage.setItem('edit_property_id', p.id); setActiveTab('edit-property'); }} />;
      
      // Cycle Forms
      case 'add-sell-cycle':
        const sellCyclePropertyId = sessionStorage.getItem('cycle_property_id');
        if (sellCyclePropertyId) {
          const cycleProperty = getPropertyById(sellCyclePropertyId);
          
          if (cycleProperty) {
            return (
              <SellCycleFormV2
                property={cycleProperty}
                user={user}
                onBack={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                }}
                onSuccess={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                  toast.success('Sell cycle created successfully!');
                }}
              />
            );
          }
        }
        return <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} onAddProperty={() => setActiveTab('add-property')} onEditProperty={(p) => { sessionStorage.setItem('edit_property_id', p.id); setActiveTab('edit-property'); }} />;
      
      case 'add-purchase-cycle':
        const purchaseCyclePropertyId = sessionStorage.getItem('cycle_property_id');
        if (purchaseCyclePropertyId) {
          const cycleProperty = getPropertyById(purchaseCyclePropertyId);
          
          if (cycleProperty) {
            return (
              <PurchaseCycleFormV2
                property={cycleProperty}
                user={user}
                onBack={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                }}
                onSuccess={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                  toast.success('Purchase cycle created successfully!');
                }}
              />
            );
          }
        }
        return <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} onAddProperty={() => setActiveTab('add-property')} onEditProperty={(p) => { sessionStorage.setItem('edit_property_id', p.id); setActiveTab('edit-property'); }} />;
      
      case 'add-rent-cycle':
        const rentCyclePropertyId = sessionStorage.getItem('cycle_property_id');
        if (rentCyclePropertyId) {
          const cycleProperty = getPropertyById(rentCyclePropertyId);
          
          if (cycleProperty) {
            return (
              <RentCycleFormV2
                property={cycleProperty}
                user={user}
                onBack={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                }}
                onSuccess={() => {
                  sessionStorage.removeItem('cycle_property_id');
                  setSelectedProperty(cycleProperty);
                  setActiveTab('property-detail');
                  toast.success('Rent cycle created successfully!');
                }}
              />
            );
          }
        }
        return <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} onAddProperty={() => setActiveTab('add-property')} onEditProperty={(p) => { sessionStorage.setItem('edit_property_id', p.id); setActiveTab('edit-property'); }} />;
      
      // Property Detail View
      case 'property-detail':
        if (selectedProperty) {
          // Load cycles for this property
          const propertySellCycles = getSellCycles(user.role === 'admin' ? undefined : user.id, user.role)
            .filter((c: SellCycle) => c.propertyId === selectedProperty.id);
          const propertyPurchaseCycles = getPurchaseCycles(user.role === 'admin' ? undefined : user.id, user.role)
            .filter((c: PurchaseCycle) => c.propertyId === selectedProperty.id);
          const propertyRentCycles = getRentCycles(user.role === 'admin' ? undefined : user.id, user.role)
            .filter((c: RentCycle) => c.propertyId === selectedProperty.id);
          
          return (
            <PropertyDetail
              property={selectedProperty}
              sellCycles={propertySellCycles}
              purchaseCycles={propertyPurchaseCycles}
              rentCycles={propertyRentCycles}
              user={user}
              onBack={() => {
                setSelectedProperty(null);
                setActiveTab('properties');
              }}
              onEdit={() => {
                sessionStorage.setItem('edit_property_id', selectedProperty.id);
                setActiveTab('edit-property');
              }}
              onStartSellCycle={() => {
                sessionStorage.setItem('cycle_property_id', selectedProperty.id);
                setActiveTab('add-sell-cycle');
              }}
              onStartPurchaseCycle={() => {
                sessionStorage.setItem('cycle_property_id', selectedProperty.id);
                setActiveTab('add-purchase-cycle');
              }}
              onStartRentCycle={() => {
                sessionStorage.setItem('cycle_property_id', selectedProperty.id);
                setActiveTab('add-rent-cycle');
              }}
              onViewCycle={(cycleId, type) => {
                if (type === 'sell') {
                  const cycle = getSellCycles(user.role === 'admin' ? undefined : user.id, user.role)
                    .find((c: SellCycle) => c.id === cycleId);
                  if (cycle) {
                    setSelectedSellCycle(cycle);
                    setActiveTab('sell-cycle-details');
                  }
                } else if (type === 'purchase') {
                  const cycle = getPurchaseCycles(user.role === 'admin' ? undefined : user.id, user.role)
                    .find((c: PurchaseCycle) => c.id === cycleId);
                  if (cycle) {
                    setSelectedPurchaseCycle(cycle);
                    setActiveTab('purchase-cycle-details');
                  }
                } else if (type === 'rent') {
                  const cycle = getRentCycles(user.role === 'admin' ? undefined : user.id, user.role)
                    .find((c: RentCycle) => c.id === cycleId);
                  if (cycle) {
                    setSelectedRentCycle(cycle);
                    setActiveTab('rent-cycle-details');
                  }
                }
              }}
              onNavigate={handleNavigation}
            />
          );
        }
        return <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} onAddProperty={() => setActiveTab('add-property')} onEditProperty={(p) => { sessionStorage.setItem('edit_property_id', p.id); setActiveTab('edit-property'); }} />;      
      
      // V2 Forms: Add Contact (Modal as Page)
      case 'add-contact':
        const defaultContactType = sessionStorage.getItem('default_contact_type') as 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor' | 'vendor' | undefined;
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
              <ContactFormModal
                isOpen={true}
                onClose={() => {
                  sessionStorage.removeItem('default_contact_type');
                  setActiveTab('contacts');
                }}
                onSuccess={(contact) => {
                  sessionStorage.removeItem('default_contact_type');
                  setActiveTab('contacts');
                  toast.success('Contact added successfully!');
                }}
                agentId={user.id}
                defaultType={defaultContactType}
              />
            </div>
          </div>
        );
      
      // V2 Forms: Edit Contact
      case 'edit-contact':
        const editContactId = sessionStorage.getItem('selected_contact_id');
        if (editContactId) {
          const contacts = getContacts(user.role === 'admin' ? undefined : user.id, user.role);
          const editingContact = contacts.find((c: Contact) => c.id === editContactId);
          
          return editingContact ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
              <div className="w-full max-w-2xl">
                <ContactFormModal
                  isOpen={true}
                  onClose={() => {
                    sessionStorage.removeItem('selected_contact_id');
                    setActiveTab('contacts');
                  }}
                  onSuccess={(contact) => {
                    sessionStorage.removeItem('selected_contact_id');
                    setActiveTab('contacts');
                    toast.success('Contact updated successfully!');
                  }}
                  agentId={user.id}
                  editingContact={editingContact}
                />
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">Contact not found</p>
                <Button onClick={() => setActiveTab('contacts')} className="mt-4">
                  Back to Contacts
                </Button>
              </div>
            </div>
          );
        }
        return <ContactsWorkspaceV4 user={user} onNavigate={handleNavigation} />;
      
      case 'sell-cycles':
        return <SellCyclesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'sell-cycle-details' && id) {
              const sellCycle = getSellCycleById(id);
              if (sellCycle) {
                setSelectedSellCycle(sellCycle);
                setActiveTab('sell-cycle-details');
              }
            }
          }}
          onStartNew={() => {
            // Navigate to properties to select a property first
            toast.info('Please select a property first from the Properties page', {
              description: 'Sell cycles must be linked to a property',
              action: {
                label: 'Go to Properties',
                onClick: () => setActiveTab('properties'),
              },
            });
          }}
          onEditCycle={(cycle) => {
            toast.info('Edit Sell Cycle - Integration coming soon');
          }}
        />;
      
      case 'sell-cycle-details':
        if (selectedSellCycle) {
          // Get the property for this cycle
          const properties = getProperties();
          const cycleProperty = properties.find((p: Property) => p.id === selectedSellCycle.propertyId);
          
          return cycleProperty ? (
            <SellCycleDetails 
              cycle={selectedSellCycle}
              property={cycleProperty}
              user={user}
              onBack={() => {
                setSelectedSellCycle(null);
                setActiveTab('sell-cycles');
              }}
              onUpdate={() => {
                // Reload the cycle
                const updatedCycle = getSellCycleById(selectedSellCycle.id);
                if (updatedCycle) {
                  setSelectedSellCycle(updatedCycle);
                }
              }}
            />
          ) : (
            <div className="p-6">
              <p>Property not found for this sell cycle</p>
              <button onClick={() => setActiveTab('sell-cycles')}>Back to Sell Cycles</button>
            </div>
          );
        }
        return <SellCyclesWorkspace user={user} onViewDetails={(cycle) => {
          setSelectedSellCycle(cycle);
          setActiveTab('sell-cycle-details');
        }} />;      
      
      case 'purchase-cycles':
        return <PurchaseCyclesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'purchase-cycle-details' && id) {
              const purchaseCycle = getPurchaseCycleById(id);
              if (purchaseCycle) {
                setSelectedPurchaseCycle(purchaseCycle);
                setActiveTab('purchase-cycle-details');
              }
            }
          }}
          onStartNew={() => {
            // Navigate to properties to select a property first
            toast.info('Please select a property first from the Properties page', {
              description: 'Purchase cycles must be linked to a property',
              action: {
                label: 'Go to Properties',
                onClick: () => setActiveTab('properties'),
              },
            });
          }}
          onEditCycle={(cycle) => {
            toast.info('Edit Purchase Cycle - Integration coming soon');
          }}
        />;
      
      case 'purchase-cycle-details':
        if (selectedPurchaseCycle) {
          // Get the property for this cycle
          const purchaseProperties = getProperties();
          const purchaseCycleProperty = purchaseProperties.find((p: Property) => p.id === selectedPurchaseCycle.propertyId);
          
          return purchaseCycleProperty ? (
            <PurchaseCycleDetails 
              cycle={selectedPurchaseCycle}
              property={purchaseCycleProperty}
              user={user}
              onBack={() => {
                setSelectedPurchaseCycle(null);
                setActiveTab('purchase-cycles');
              }}
              onUpdate={() => {
                // Reload the cycle
                const updatedCycle = getPurchaseCycleById(selectedPurchaseCycle.id);
                if (updatedCycle) {
                  setSelectedPurchaseCycle(updatedCycle);
                }
              }}
            />
          ) : (
            <div className="p-6">
              <p>Property not found for this purchase cycle</p>
              <button onClick={() => setActiveTab('purchase-cycles')}>Back to Purchase Cycles</button>
            </div>
          );
        }
        return <PurchaseCyclesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'purchase-cycle-details' && id) {
              const purchaseCycle = getPurchaseCycleById(id);
              if (purchaseCycle) {
                setSelectedPurchaseCycle(purchaseCycle);
                setActiveTab('purchase-cycle-details');
              }
            }
          }}
          onStartNew={() => {
            // Navigate to start purchase cycle modal/form
            toast.info('Start Purchase Cycle - Integration coming soon');
          }}
          onEditCycle={(cycle) => {
            toast.info('Edit Purchase Cycle - Integration coming soon');
          }}
        />;
      
      case 'rent-cycles':
        return <RentCyclesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'rent-cycle-details' && id) {
              const rentCycle = getRentCycleById(id);
              if (rentCycle) {
                setSelectedRentCycle(rentCycle);
                setActiveTab('rent-cycle-details');
              }
            }
          }}
          onStartNew={() => {
            // Navigate to properties to select a property first
            toast.info('Please select a property first from the Properties page', {
              description: 'Rent cycles must be linked to a property',
              action: {
                label: 'Go to Properties',
                onClick: () => setActiveTab('properties'),
              },
            });
          }}
          onEditCycle={(cycle) => {
            toast.info('Edit Rent Cycle - Integration coming soon');
          }}
        />;
      
      case 'rent-cycle-details':
        if (selectedRentCycle) {
          // Get the property for this cycle
          const rentProperties = getProperties();
          const rentCycleProperty = rentProperties.find((p: Property) => p.id === selectedRentCycle.propertyId);
          
          return rentCycleProperty ? (
            <RentCycleDetails 
              cycle={selectedRentCycle}
              property={rentCycleProperty}
              user={user}
              onBack={() => {
                setSelectedRentCycle(null);
                setActiveTab('rent-cycles');
              }}
              onUpdate={() => {
                // Reload the cycle
                const updatedCycle = getRentCycleById(selectedRentCycle.id);
                if (updatedCycle) {
                  setSelectedRentCycle(updatedCycle);
                }
              }}
            />
          ) : (
            <div className="p-6">
              <p>Property not found for this rent cycle</p>
              <button onClick={() => setActiveTab('rent-cycles')}>Back to Rent Cycles</button>
            </div>
          );
        }
        return <RentCyclesWorkspaceV4 
          user={user} 
          onNavigate={(section, id) => {
            if (section === 'rent-cycle-details' && id) {
              const rentCycle = getRentCycleById(id);
              if (rentCycle) {
                setSelectedRentCycle(rentCycle);
                setActiveTab('rent-cycle-details');
              }
            }
          }}
          onStartNew={() => {
            // Navigate to start rent cycle modal/form
            toast.info('Start Rent Cycle - Integration coming soon');
          }}
          onEditCycle={(cycle) => {
            toast.info('Edit Rent Cycle - Integration coming soon');
          }}
        />;
      
      case 'buyer-requirements':
        return <BuyerRequirementsWorkspaceV4 
          user={user}
          onNavigate={(section, id) => {
            if (section === 'buyer-requirement-details' && id) {
              const requirement = getBuyerRequirementById(id);
              if (requirement) {
                setSelectedBuyerRequirement(requirement);
                setActiveTab('buyer-requirement-details');
              }
            }
          }}
          onAddNew={() => setActiveTab('add-buyer-requirement')}
          onEditRequirement={(requirement) => {
            toast.info('Edit Buyer Requirement - Integration coming soon');
          }}
        />;      
      
      case 'buyer-requirement-details':
        if (selectedBuyerRequirement) {
          return <BuyerRequirementDetailsV4 
            requirement={selectedBuyerRequirement}
            user={user}
            onBack={() => {
              setSelectedBuyerRequirement(null);
              setActiveTab('buyer-requirements');
            }}
            onUpdate={() => {
              // Refresh the requirement data
              const updated = getBuyerRequirementById(selectedBuyerRequirement.id);
              if (updated) {
                setSelectedBuyerRequirement(updated);
              }
            }}
            onNavigateToSellCycle={(sellCycleId) => {
              const sellCycle = getSellCycleById(sellCycleId);
              if (sellCycle) {
                sessionStorage.setItem('selected_sell_cycle_id', sellCycleId);
                setActiveTab('sell-cycle-details');
              }
            }}
            onNavigateToProperty={(propertyId) => {
              const property = getPropertyById(propertyId);
              if (property) {
                setSelectedProperty(property);
                setActiveTab('property-details');
              }
            }}
          />;
        }
        return null;
      
      case 'rent-requirements':
        return <RentRequirementsWorkspace 
          user={user}
          onAddNew={() => setActiveTab('add-rent-requirement')}
          onViewDetails={(requirement) => {
            // Store the requirement for detail view
            sessionStorage.setItem('selected_rent_requirement_id', requirement.id);
            setActiveTab('rent-requirement-details');
          }}
        />;      
      
      case 'rent-requirement-details':
        const rentReqId = sessionStorage.getItem('selected_rent_requirement_id');
        if (rentReqId) {
          const rentRequirement = getRentRequirement(rentReqId);
          if (rentRequirement) {
            return <RentRequirementDetailsV4 
              requirement={rentRequirement}
              user={user}
              onBack={() => {
                sessionStorage.removeItem('selected_rent_requirement_id');
                setActiveTab('rent-requirements');
              }}
              onUpdate={() => {
                // Refresh the requirement data
                const updated = getRentRequirement(rentReqId);
                if (updated) {
                  // Force re-render
                  setActiveTab('rent-requirement-details-temp');
                  setTimeout(() => setActiveTab('rent-requirement-details'), 0);
                }
              }}
              onNavigateToRentCycle={(rentCycleId) => {
                const rentCycle = getRentCycleById(rentCycleId);
                if (rentCycle) {
                  setSelectedRentCycle(rentCycle);
                  setActiveTab('rent-cycle-details');
                }
              }}
              onNavigateToProperty={(propertyId) => {
                const property = getPropertyById(propertyId);
                if (property) {
                  setSelectedProperty(property);
                  setActiveTab('property-details');
                }
              }}
            />;
          }
        }
        return null;
      
      case 'deals':
        return <DealsWorkspaceV4 
          user={user}
          onNavigate={(section, id) => {
            if (section === 'deal-details' && id) {
              sessionStorage.setItem('selected_deal_id', id);
              setActiveTab('deal-details');
            }
          }}
          onAddDeal={() => toast.info('Create deal functionality coming soon')}
          onEditDeal={(deal) => toast.info('Edit deal: ' + deal.dealNumber)}
        />;      
      case 'deal-details':
        const dealId = sessionStorage.getItem('selected_deal_id');
        if (dealId) {
          return <DealDetails 
            dealId={dealId}
            user={user}
            onBack={() => {
              sessionStorage.removeItem('selected_deal_id');
              setActiveTab('deals');
            }}
          />;
        }
        return <DealDashboard user={user} onViewDeal={(id) => {
          sessionStorage.setItem('selected_deal_id', id);
          setActiveTab('deal-details');
        }} />;
      
      case 'add-lead':
        // Redirect to new leads workspace (use Create Lead modal there)
        setActiveTab('leads');
        setTimeout(() => setShowCreateLead(true), 100);
        return null;
      
      // V4 Lead Management System
      case 'leads':
        return (
          <LeadWorkspaceV4 
            user={user}
            onNavigate={(view, id) => {
              if (view === 'lead-details' && id) {
                setSelectedLeadId(id);
                setActiveTab('lead-details');
              } else if (view === 'contact-details' && id) {
                sessionStorage.setItem('selected_contact_id', id);
                setActiveTab('contact-details');
              } else if (view === 'buyer-requirements' && id) {
                const requirement = getBuyerRequirementById(id);
                if (requirement) {
                  setSelectedBuyerRequirement(requirement);
                  setActiveTab('buyer-requirements');
                }
              }
            }}
            onCreateLead={() => setShowCreateLead(true)}
          />
        );
      
      case 'lead-details':
        if (!selectedLeadId) {
          setActiveTab('leads');
          return null;
        }
        return (
          <LeadDetailsV4
            leadId={selectedLeadId}
            user={user}
            onNavigate={(view, id) => {
              if (view === 'contact-details' && id) {
                sessionStorage.setItem('selected_contact_id', id);
                setActiveTab('contact-details');
              } else if (view === 'buyer-requirements' && id) {
                const requirement = getBuyerRequirementById(id);
                if (requirement) {
                  setSelectedBuyerRequirement(requirement);
                  setActiveTab('buyer-requirements');
                }
              } else if (view === 'property-detail' && id) {
                const property = getPropertyById(id);
                if (property) {
                  setSelectedProperty(property);
                  setActiveTab('property-detail');
                }
              }
            }}
            onBack={() => {
              setSelectedLeadId(null);
              setActiveTab('leads');
            }}
            onQualify={(leadId) => {
              setSelectedLeadId(leadId);
              setShowQualifyLead(true);
            }}
            onConvert={(leadId) => {
              setSelectedLeadId(leadId);
              setShowConvertLead(true);
            }}
            onAddInteraction={(leadId) => {
              setSelectedLeadId(leadId);
              setShowLeadInteraction(true);
            }}
            onMarkLost={() => {
              // Handled within component, just refresh
              setActiveTab('lead-details');
            }}
            onEdit={() => {
              // Handled within component, just refresh
              setActiveTab('lead-details');
            }}
          />
        );
      
      case 'financials':
        return <FinancialsHubV4 user={user} onNavigate={(module) => {
          console.log('Navigate to financial module:', module);
          // TODO: Add module-specific routing once workspaces are created
        }} />;
      
      case 'agency':
        return <AgencyHub user={user} />;
      
      case 'analytics':
        return <AgencyAnalyticsDashboard user={user} onBack={handleBackToDashboard} />;
      
      case 'documents':
        return <DocumentCenter />;
      
      case 'document-templates':
        return <DocumentTemplates onBack={handleBackToDashboard} />;
      
      case 'contacts':
        return <ContactsWorkspaceV4 
          user={user}
          onNavigate={(section, id) => {
            if (section === 'contact-details' && id) {
              sessionStorage.setItem('selected_contact_id', id);
              setActiveTab('contact-details');
            }
          }}
          onAddContact={() => {
            sessionStorage.removeItem('default_contact_type');
            setActiveTab('add-contact');
          }}
          onEditContact={(contact) => {
            sessionStorage.setItem('selected_contact_id', contact.id);
            setActiveTab('edit-contact');
          }}
        />;
      
      case 'contact-details':
        const contactId = sessionStorage.getItem('selected_contact_id');
        if (contactId) {
          return (
            <ContactDetailsV4
              contactId={contactId}
              user={user}
              onBack={() => {
                sessionStorage.removeItem('selected_contact_id');
                setActiveTab('contacts');
              }}
              onEdit={(contact) => {
                sessionStorage.setItem('selected_contact_id', contact.id);
                setActiveTab('edit-contact');
              }}
              onDelete={(id) => {
                deleteContact(id);
                sessionStorage.removeItem('selected_contact_id');
                setActiveTab('contacts');
                toast.success('Contact deleted successfully');
              }}
              onNavigate={handleNavigation}
            />
          );
        }
        return <ContactsWorkspaceV4 user={user} onNavigate={handleNavigation} />;
      
      case 'budgeting':
        return <BudgetingDashboard user={user} onBack={handleBackToDashboard} />;
      
      // V2 Forms: Add Buyer Requirement
      case 'add-buyer-requirement':
        return (
          <BuyerRequirementFormV2
            user={user}
            onBack={() => setActiveTab('buyer-requirements')}
            onSuccess={() => {
              setActiveTab('buyer-requirements');
              toast.success('Buyer requirement added successfully!');
            }}
            requirementType="buy"
          />
        );
      
      // V2 Forms: Add Rent Requirement
      case 'add-rent-requirement':
        return (
          <BuyerRequirementFormV2
            user={user}
            onBack={() => setActiveTab('rent-requirements')}
            onSuccess={() => {
              setActiveTab('rent-requirements');
              toast.success('Rent requirement added successfully!');
            }}
            requirementType="rent"
          />
        );
      
      case 'portfolio':
        return <PortfolioHub user={user} onNavigate={handleNavigation} />;
      
      case 'project-accounting':
        return <ProjectAccounting user={user} onNavigate={handleNavigation} />;
      
      case 'banking-treasury':
        return <BankingTreasury user={user} />;
      
      case 'reports':
        return <FinancialReports user={user} />;
      
      case 'projects':
        return <ProjectList user={user} onNavigate={handleNavigation} />;
      
      case 'add-project':
        return (
          <ProjectForm 
            user={user}
            onBack={handleBackToDashboard}
            onSuccess={handleSuccess}
          />
        );
      
      case 'edit-project':
        return selectedProject ? (
          <ProjectForm 
            user={user}
            editProject={selectedProject}
            onBack={handleBackToProjects}
            onSuccess={() => {
              setActiveTab('projects');
              setSelectedProject(null);
              toast.success('Project updated successfully!');
            }}
          />
        ) : (
          <ProjectList user={user} onNavigate={handleNavigation} />
        );
      
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetailEnhanced 
            project={selectedProject}
            user={user}
            onBack={handleBackToProjects}
            onNavigate={handleNavigation}
          />
        ) : (
          <ProjectList user={user} onNavigate={handleNavigation} />
        );
      
      case 'land-acquisition':
        return <LandAcquisitionDashboard user={user} onNavigate={handleNavigation} />;
      
      case 'add-land-parcel':
        return (
          <LandParcelForm 
            user={user}
            onBack={() => setActiveTab('land-acquisition')}
            onSuccess={() => {
              setActiveTab('land-acquisition');
              toast.success('Land parcel created successfully!');
            }}
          />
        );
      
      case 'edit-land-parcel':
        return selectedLandParcel ? (
          <LandParcelForm 
            user={user}
            editingParcel={selectedLandParcel}
            onBack={() => setActiveTab('land-acquisition')}
            onSuccess={() => {
              setActiveTab('land-acquisition');
              setSelectedLandParcel(null);
              toast.success('Land parcel updated successfully!');
            }}
          />
        ) : (
          <LandAcquisitionDashboard user={user} onNavigate={handleNavigation} />
        );
      
      case 'land-parcel-detail':
        return selectedLandParcel ? (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl text-gray-900">{selectedLandParcel.parcelName}</h1>
                  <p className="text-gray-600 mt-1">{selectedLandParcel.location.address}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('land-acquisition')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Land Acquisition
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="mb-4">Area Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Area:</span>
                      <span>{selectedLandParcel.area.totalArea} {selectedLandParcel.area.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shape:</span>
                      <span className="capitalize">{selectedLandParcel.area.shape}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="mb-4">Financial Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Asking Price:</span>
                      <span>PKR {selectedLandParcel.financial.askingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Unit:</span>
                      <span>PKR {selectedLandParcel.financial.pricePerUnit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="mb-4">Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Stage:</span>
                      <span className="capitalize">{selectedLandParcel.process.stage.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal Status:</span>
                      <span className="capitalize">{selectedLandParcel.legal.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feasibility Score:</span>
                      <span>{selectedLandParcel.feasibility.score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LandAcquisitionDashboard user={user} onNavigate={handleNavigation} />
        );
      
      case 'feasibility-calculator':
        return <FeasibilityCalculator user={user} onBack={handleBackToDashboard} />;
      
      case 'central-inventory':
        return <CentralInventory user={user} onBack={handleBackToDashboard} />;
      
      case 'goods-receipt':
        return <GoodsReceiptNoteForm user={user} onBack={handleBackToDashboard} />;
      
      case 'procurement':
        return <ProcurementDashboard user={user} onBack={handleBackToDashboard} />;
      
      case 'advanced-financials':
        return <AdvancedFinancials user={user} onBack={handleBackToDashboard} />;
      
      case 'supplier-management':
        return <AdvancedSupplierManagement user={user} onBack={handleBackToDashboard} />;
      
      case 'smart-procurement':
        return <SmartProcurementCostControl user={user} onBack={handleBackToDashboard} />;
      
      case 'buyer-workspace':
        return <BuyerWorkspace user={user} onBack={handleBackToDashboard} />;
      
      case 'notifications':
        return <NotificationCenter 
          user={user} 
          onNavigate={handleNavigateFromNotification}
        />;
      
      case 'profile':
        return <UserProfile user={user} onBack={handleBackToDashboard} />;
      
      case 'settings':
        return <Settings user={user} onBack={handleBackToDashboard} />;
      
      default:
        return <DashboardV4 user={user} onNavigate={handleNavigation} currentModule={currentModule} />;
      }
    })();
    
    return (
      <Suspense fallback={simpleFallback}>
        {content}
      </Suspense>
    );
  };

  // Safety check - don't render main UI without user
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user session...</p>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          user={user} 
          saasUser={saasUser}
          currentModule={currentModule}
          onLogout={handleLogout} 
          onModuleSwitch={() => setCurrentModule(null)}
          onNavigateToNotificationCenter={handleOpenNotificationCenter}
          onNavigateFromNotification={handleNavigateFromNotification}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToSettings={handleNavigateToSettings}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        
        <div className="flex">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            userRole={user.role}
            currentModule={currentModule}
            saasUser={saasUser}
            unreadNotificationCount={getUnreadCount(user.id)}
            isCollapsed={isSidebarCollapsed}
          />
          
          <main className="flex-1 min-h-screen">
            <ErrorBoundary>
              {renderContent()}
            </ErrorBoundary>
          </main>
        </div>
        
        {/* V4 Lead Management Modals */}
        <CreateLeadModal
          open={showCreateLead}
          onClose={() => setShowCreateLead(false)}
          user={user}
          workspaceId={saasUser?.workspaceId || 'default'}
          onSuccess={(leadId) => {
            setShowCreateLead(false);
            setSelectedLeadId(leadId);
            setActiveTab('lead-details');
            toast.success('Lead created successfully!');
          }}
        />

        <QualifyLeadModal
          open={showQualifyLead}
          onClose={() => setShowQualifyLead(false)}
          leadId={selectedLeadId || ''}
          onSuccess={() => {
            setShowQualifyLead(false);
            // Refresh the lead details view
            if (activeTab === 'lead-details' && selectedLeadId) {
              setActiveTab('lead-details');
            }
            toast.success('Lead qualified successfully!');
          }}
        />

        <ConvertLeadModal
          open={showConvertLead}
          onClose={() => setShowConvertLead(false)}
          leadId={selectedLeadId || ''}
          user={user}
          onSuccess={(contactId, requirementId, propertyId) => {
            setShowConvertLead(false);
            toast.success('Lead converted successfully!');
            
            // Navigate to created contact
            if (contactId) {
              setTimeout(() => {
                sessionStorage.setItem('selected_contact_id', contactId);
                setActiveTab('contact-details');
              }, 500);
            }
          }}
        />

        <LeadInteractionModal
          open={showLeadInteraction}
          onClose={() => setShowLeadInteraction(false)}
          leadId={selectedLeadId || ''}
          user={{ id: user.id, name: user.name }}
          onSuccess={() => {
            setShowLeadInteraction(false);
            // Refresh the lead details view
            if (activeTab === 'lead-details' && selectedLeadId) {
              setActiveTab('lead-details');
            }
            toast.success('Interaction added successfully!');
          }}
        />
        
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;