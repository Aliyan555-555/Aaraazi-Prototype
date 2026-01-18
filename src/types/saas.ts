// SaaS Multi-tenant Type Definitions
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  createdAt: string;
  lastActiveAt: string;
  subscriptionPlan: SubscriptionPlan;
  modules: ModuleAccess[];
  userLimit?: number;
  branches?: string[];
  billing: BillingInfo;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'trial' | 'basic' | 'premium' | 'enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  maxProperties: number;
  maxProjects: number;
  features: string[];
}

export interface ModuleAccess {
  moduleId: 'agency' | 'developers';
  enabled: boolean;
  activatedAt?: string;
  expiresAt?: string;
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor: string;
    companyName: string;
  };
  localization: {
    currency: 'PKR' | 'USD' | 'EUR';
    language: 'en' | 'ur';
    timezone: string;
  };
  features: {
    enableAdvancedReporting: boolean;
    enableAPIAccess: boolean;
    enableCustomFields: boolean;
  };
}

export interface BillingInfo {
  paymentMethod: string;
  nextBillingDate: string;
  billingHistory?: BillingTransaction[];
}

export interface BillingTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
  type: 'agency' | 'developer' | 'both';
  branches: Branch[];
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  managerId: string;
  users: string[]; // User IDs assigned to this branch
  status: 'active' | 'inactive';
}

export interface OrganizationSettings {
  workingHours: {
    start: string;
    end: string;
    workingDays: string[];
  };
  policies: {
    requireApprovalForLargeDeals: boolean;
    autoAssignLeads: boolean;
    enableDocumentSharing: boolean;
  };
}

// Enhanced User Roles for SaaS
export interface SaaSUser {
  id: string;
  email: string;
  name: string;
  role: SaaSUserRole;
  tenantId?: string; // null for SaaS Admin
  organizationId?: string;
  branchId?: string;
  avatar?: string;
  permissions: Permission[];
  moduleAccess: string[]; // 'agency', 'developers'
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type SaaSUserRole = 
  | 'saas-admin'        // Product owner - manages all tenants and pricing
  | 'super-admin'       // Agency/Developer owner - manages organization
  | 'agency-manager'    // Agency department manager
  | 'agent'            // Real estate agent
  | 'developer-admin'   // Developer company admin
  | 'project-manager'   // Project manager in developer company
  | 'developer-user'    // General user in developer company
  | 'viewer';          // Read-only access

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  scope: 'all' | 'own' | 'branch' | 'organization';
}

// Module Definition
export interface Module {
  id: 'agency' | 'developers';
  name: string;
  description: string;
  icon: string;
  price: number;
  features: ModuleFeature[];
  dependencies: string[];
}

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  component: string;
  permissions: string[];
}

// Navigation structure for modules
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  module: 'agency' | 'developers';
  permission?: string;
  children?: NavigationItem[];
}

// SaaS Dashboard Analytics
export interface SaaSAnalytics {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  revenue: {
    monthly: number;
    yearly: number;
    growth: number;
  };
  moduleUsage: {
    agency: number;
    developers: number;
  };
  userGrowth: {
    labels: string[];
    data: number[];
  };
}

// Account Management
export interface AccountRequest {
  id: string;
  companyName: string;
  contactEmail: string;
  contactName: string;
  phone: string;
  requestedModules: string[];
  businessType: 'agency' | 'developer' | 'both';
  expectedUsers: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  notes?: string;
}