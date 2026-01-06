import { 
  Tenant, 
  SaaSUser, 
  SaaSUserRole, 
  Organization, 
  Branch, 
  Module, 
  SubscriptionPlan, 
  SaaSAnalytics, 
  AccountRequest 
} from '../types/saas';

// SaaS Storage Keys
export const SAAS_STORAGE_KEYS = {
  TENANTS: 'saas_tenants',
  SAAS_USERS: 'saas_users',
  CURRENT_SAAS_USER: 'current_saas_user',
  ORGANIZATIONS: 'saas_organizations',
  MODULES: 'saas_modules',
  SUBSCRIPTION_PLANS: 'saas_subscription_plans',
  ACCOUNT_REQUESTS: 'saas_account_requests',
  ANALYTICS: 'saas_analytics'
} as const;

// Default Subscription Plans
export const defaultSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    type: 'trial',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxUsers: 3,
    maxProperties: 10,
    maxProjects: 2,
    features: ['basic-dashboard', 'property-management', 'lead-tracking']
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    type: 'basic',
    monthlyPrice: 15000, // PKR 150 per user
    yearlyPrice: 150000, // PKR 1500 per user/year
    maxUsers: 10,
    maxProperties: 100,
    maxProjects: 10,
    features: ['basic-dashboard', 'property-management', 'lead-tracking', 'financial-reports', 'document-management']
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    type: 'premium',
    monthlyPrice: 25000, // PKR 250 per user
    yearlyPrice: 250000, // PKR 2500 per user/year
    maxUsers: 50,
    maxProperties: 500,
    maxProjects: 50,
    features: ['all-basic', 'advanced-analytics', 'crm-module', 'project-accounting', 'banking-treasury', 'api-access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    type: 'enterprise',
    monthlyPrice: 40000, // PKR 400 per user
    yearlyPrice: 400000, // PKR 4000 per user/year
    maxUsers: -1, // Unlimited
    maxProperties: -1, // Unlimited
    maxProjects: -1, // Unlimited
    features: ['all-premium', 'custom-branding', 'advanced-permissions', 'multi-branch', 'dedicated-support', 'custom-integrations']
  }
];

// Available Modules
export const availableModules: Module[] = [
  {
    id: 'agency',
    name: 'Agency Module',
    description: 'Complete real estate agency management system',
    icon: 'Building2',
    price: 10000, // PKR 100 per month additional
    features: [
      {
        id: 'property-management',
        name: 'Property Management',
        description: 'Add, manage, and track property listings',
        component: 'PropertyManagement',
        permissions: ['property.read', 'property.create', 'property.update']
      },
      {
        id: 'lead-management',
        name: 'Lead Management',
        description: 'Track and nurture potential clients',
        component: 'LeadManagement', 
        permissions: ['lead.read', 'lead.create', 'lead.update']
      },
      {
        id: 'commission-tracking',
        name: 'Commission Tracking',
        description: 'Track agent commissions and payouts',
        component: 'CommissionTracking',
        permissions: ['commission.read', 'commission.create']
      },
      {
        id: 'agency-hub',
        name: 'Agency Hub',
        description: 'Multi-agent dashboard and sales management',
        component: 'AgencyHub',
        permissions: ['agency.read', 'agency.manage']
      }
    ],
    dependencies: []
  },
  {
    id: 'developers',
    name: 'Developers Module',
    description: 'Building developers project management system',
    icon: 'Hammer',
    price: 15000, // PKR 150 per month additional
    features: [
      {
        id: 'project-management',
        name: 'Project Management',
        description: 'Manage construction and development projects',
        component: 'ProjectManagement',
        permissions: ['project.read', 'project.create', 'project.update']
      },
      {
        id: 'project-accounting',
        name: 'Project Accounting',
        description: 'Track project costs and budgets',
        component: 'ProjectAccounting',
        permissions: ['accounting.read', 'accounting.create']
      },
      {
        id: 'unit-booking',
        name: 'Unit Booking',
        description: 'Manage apartment/house bookings and sales',
        component: 'UnitBooking',
        permissions: ['booking.read', 'booking.create', 'booking.update']
      },
      {
        id: 'construction-tracking',
        name: 'Construction Tracking',
        description: 'Track construction progress and milestones',
        component: 'ConstructionTracking',
        permissions: ['construction.read', 'construction.update']
      }
    ],
    dependencies: []
  }
];

// Track if SaaS system initialization has already been done
let isSaaSInitialized = false;

// Initialize SaaS System
export const initializeSaaSSstem = () => {
  // Skip if already initialized in this session
  if (isSaaSInitialized) {
    return;
  }
  
  try {
    // Initialize subscription plans
    if (!localStorage.getItem(SAAS_STORAGE_KEYS.SUBSCRIPTION_PLANS)) {
      localStorage.setItem(SAAS_STORAGE_KEYS.SUBSCRIPTION_PLANS, JSON.stringify(defaultSubscriptionPlans));
    }

    // Initialize modules
    if (!localStorage.getItem(SAAS_STORAGE_KEYS.MODULES)) {
      localStorage.setItem(SAAS_STORAGE_KEYS.MODULES, JSON.stringify(availableModules));
    }

    // Initialize SaaS Admin user
    initializeSaaSUsers();
    
    // Initialize demo tenants
    initializeDemoTenants();
  } finally {
    // Mark as initialized
    isSaaSInitialized = true;
  }
};

// Initialize SaaS Users
export const initializeSaaSUsers = () => {
  const existingUsers = localStorage.getItem(SAAS_STORAGE_KEYS.SAAS_USERS);
  
  // Check if developer user exists and add if missing
  if (existingUsers) {
    const users = JSON.parse(existingUsers);
    const developerExists = users.some((user: SaaSUser) => user.email === 'developer@premiumrealty.pk');
    
    if (!developerExists) {
      const developerUser: SaaSUser = {
        id: 'developer-1',
        email: 'developer@premiumrealty.pk',
        name: 'Fatima Khan',
        role: 'developer',
        tenantId: 'tenant-1',
        organizationId: 'org-1',
        branchId: 'branch-1',
        avatar: '/avatars/developer.jpg',
        permissions: [
          { resource: 'project', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'accounting', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'booking', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'construction', actions: ['read', 'update'], scope: 'own' }
        ],
        moduleAccess: ['developers'],
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(developerUser);
      localStorage.setItem(SAAS_STORAGE_KEYS.SAAS_USERS, JSON.stringify(users));
      
      // Also update the organization to include the developer user
      const orgsStr = localStorage.getItem(SAAS_STORAGE_KEYS.ORGANIZATIONS);
      if (orgsStr) {
        const orgs = JSON.parse(orgsStr);
        const mainOrg = orgs.find((org: any) => org.id === 'org-1');
        if (mainOrg && mainOrg.branches[0]) {
          const users = mainOrg.branches[0].users;
          if (!users.includes('developer-1')) {
            mainOrg.branches[0].users.push('developer-1');
            localStorage.setItem(SAAS_STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
          }
        }
      }
    }
    return;
  }
  
  if (!existingUsers) {
    const defaultUsers: SaaSUser[] = [
      {
        id: 'saas-admin-1',
        email: 'admin@aaraazi.com',
        name: 'aaraazi Admin',
        role: 'saas-admin',
        avatar: '/avatars/saas-admin.jpg',
        permissions: [
          { resource: '*', actions: ['create', 'read', 'update', 'delete'], scope: 'all' }
        ],
        moduleAccess: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Demo Super Admin
      {
        id: 'super-admin-1',
        email: 'owner@premiumrealty.pk',
        name: 'Ahmad Hassan',
        role: 'super-admin',
        tenantId: 'tenant-1',
        organizationId: 'org-1',
        avatar: '/avatars/super-admin.jpg',
        permissions: [
          { resource: 'tenant', actions: ['read', 'update'], scope: 'own' },
          { resource: 'user', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
          { resource: 'property', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
          { resource: 'lead', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
          { resource: 'financial', actions: ['read'], scope: 'organization' }
        ],
        moduleAccess: ['agency', 'developers'],
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Demo Agency Manager
      {
        id: 'agency-manager-1',
        email: 'manager@premiumrealty.pk',
        name: 'Sarah Ahmed',
        role: 'agency-manager',
        tenantId: 'tenant-1',
        organizationId: 'org-1',
        branchId: 'branch-1',
        avatar: '/avatars/manager.jpg',
        permissions: [
          { resource: 'property', actions: ['create', 'read', 'update'], scope: 'branch' },
          { resource: 'lead', actions: ['create', 'read', 'update'], scope: 'branch' },
          { resource: 'agent', actions: ['read', 'update'], scope: 'branch' }
        ],
        moduleAccess: ['agency'],
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Demo Agent
      {
        id: 'agent-1',
        email: 'agent1@premiumrealty.pk',
        name: 'Ali Raza',
        role: 'agent',
        tenantId: 'tenant-1',
        organizationId: 'org-1',
        branchId: 'branch-1',
        avatar: '/avatars/agent1.jpg',
        permissions: [
          { resource: 'property', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'lead', actions: ['create', 'read', 'update'], scope: 'own' }
        ],
        moduleAccess: ['agency'],
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Demo Developer User
      {
        id: 'developer-1',
        email: 'developer@premiumrealty.pk',
        name: 'Fatima Khan',
        role: 'developer',
        tenantId: 'tenant-1',
        organizationId: 'org-1',
        branchId: 'branch-1',
        avatar: '/avatars/developer.jpg',
        permissions: [
          { resource: 'project', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'accounting', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'booking', actions: ['create', 'read', 'update'], scope: 'own' },
          { resource: 'construction', actions: ['read', 'update'], scope: 'own' }
        ],
        moduleAccess: ['developers'],
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(SAAS_STORAGE_KEYS.SAAS_USERS, JSON.stringify(defaultUsers));
  }
};

// Initialize Demo Tenants
export const initializeDemoTenants = () => {
  const existingTenants = localStorage.getItem(SAAS_STORAGE_KEYS.TENANTS);
  
  if (!existingTenants) {
    const demoTenants: Tenant[] = [
      {
        id: 'tenant-1',
        name: 'Premium Realty Pakistan',
        domain: 'premiumrealty.pk',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        subscriptionPlan: defaultSubscriptionPlans[2], // Premium plan
        modules: [
          {
            moduleId: 'agency',
            enabled: true,
            purchasedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            features: availableModules[0].features.map(f => f.id)
          },
          {
            moduleId: 'developers',
            enabled: true,
            purchasedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            features: availableModules[1].features.map(f => f.id)
          }
        ],
        settings: {
          branding: {
            primaryColor: '#030213',
            companyName: 'Premium Realty Pakistan'
          },
          localization: {
            currency: 'PKR',
            language: 'en',
            timezone: 'Asia/Karachi'
          },
          features: {
            enableAdvancedReporting: true,
            enableAPIAccess: true,
            enableCustomFields: true
          }
        },
        billing: {
          paymentMethod: 'bank_transfer',
          billingAddress: {
            street: '123 Shahrah-e-Faisal',
            city: 'Karachi',
            state: 'Sindh',
            country: 'Pakistan',
            postalCode: '74400'
          },
          nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          billingHistory: [
            {
              id: 'bill-1',
              amount: 75000,
              currency: 'PKR',
              status: 'paid',
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Monthly subscription - Premium Plan'
            }
          ]
        }
      }
    ];

    localStorage.setItem(SAAS_STORAGE_KEYS.TENANTS, JSON.stringify(demoTenants));
  }

  // Initialize demo organizations
  const existingOrgs = localStorage.getItem(SAAS_STORAGE_KEYS.ORGANIZATIONS);
  
  if (!existingOrgs) {
    const demoOrganizations: Organization[] = [
      {
        id: 'org-1',
        tenantId: 'tenant-1',
        name: 'Premium Realty Pakistan',
        type: 'both',
        branches: [
          {
            id: 'branch-1',
            name: 'Karachi Main Office',
            address: {
              street: '123 Shahrah-e-Faisal',
              city: 'Karachi',
              state: 'Sindh',
              country: 'Pakistan',
              postalCode: '74400'
            },
            phone: '+92-21-1234567',
            email: 'karachi@premiumrealty.pk',
            managerId: 'agency-manager-1',
            users: ['super-admin-1', 'agency-manager-1', 'agent-1', 'developer-1'],
            status: 'active'
          },
          {
            id: 'branch-2',
            name: 'Lahore Branch',
            address: {
              street: '456 Mall Road',
              city: 'Lahore',
              state: 'Punjab',
              country: 'Pakistan',
              postalCode: '54000'
            },
            phone: '+92-42-1234567',
            email: 'lahore@premiumrealty.pk',
            managerId: 'agency-manager-2',
            users: [],
            status: 'active'
          }
        ],
        settings: {
          workingHours: {
            start: '09:00',
            end: '18:00',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          policies: {
            requireApprovalForLargeDeals: true,
            autoAssignLeads: false,
            enableDocumentSharing: true
          }
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(SAAS_STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(demoOrganizations));
  }
};

// SaaS Authentication
export const saasLogin = (email: string, password: string): SaaSUser | null => {
  try {
    const users = getSaaSUsers();
    
    // For demo purposes, accept any password that matches the email pattern
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && user.status === 'active') {
      // Update last login
      user.lastLogin = new Date().toISOString();
      updateSaaSUser(user);
      
      // Store current user
      localStorage.setItem(SAAS_STORAGE_KEYS.CURRENT_SAAS_USER, JSON.stringify(user));
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('SaaS login error:', error);
    return null;
  }
};

export const saasLogout = (): void => {
  localStorage.removeItem(SAAS_STORAGE_KEYS.CURRENT_SAAS_USER);
};

export const getCurrentSaaSUser = (): SaaSUser | null => {
  try {
    const userStr = localStorage.getItem(SAAS_STORAGE_KEYS.CURRENT_SAAS_USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Get current SaaS user error:', error);
    return null;
  }
};

// Data Management Functions
export const getSaaSUsers = (): SaaSUser[] => {
  try {
    const usersStr = localStorage.getItem(SAAS_STORAGE_KEYS.SAAS_USERS);
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Get SaaS users error:', error);
    return [];
  }
};

export const updateSaaSUser = (user: SaaSUser): void => {
  try {
    const users = getSaaSUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
      localStorage.setItem(SAAS_STORAGE_KEYS.SAAS_USERS, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Update SaaS user error:', error);
  }
};

export const getTenants = (): Tenant[] => {
  try {
    const tenantsStr = localStorage.getItem(SAAS_STORAGE_KEYS.TENANTS);
    return tenantsStr ? JSON.parse(tenantsStr) : [];
  } catch (error) {
    console.error('Get tenants error:', error);
    return [];
  }
};

export const updateTenant = (tenant: Tenant): void => {
  try {
    const tenants = getTenants();
    const index = tenants.findIndex(t => t.id === tenant.id);
    
    if (index !== -1) {
      tenants[index] = { ...tenant, updatedAt: new Date().toISOString() };
      localStorage.setItem(SAAS_STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    }
  } catch (error) {
    console.error('Update tenant error:', error);
  }
};

export const getOrganizations = (): Organization[] => {
  try {
    const orgsStr = localStorage.getItem(SAAS_STORAGE_KEYS.ORGANIZATIONS);
    return orgsStr ? JSON.parse(orgsStr) : [];
  } catch (error) {
    console.error('Get organizations error:', error);
    return [];
  }
};

// Analytics Functions
export const getSaaSAnalytics = (): SaaSAnalytics => {
  try {
    const tenants = getTenants();
    const users = getSaaSUsers();
    
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const trialTenants = tenants.filter(t => t.status === 'trial').length;
    
    // Calculate revenue (simplified)
    const monthlyRevenue = tenants
      .filter(t => t.status === 'active')
      .reduce((sum, t) => sum + (t.subscriptionPlan?.monthlyPrice || 0), 0);
    
    const agencyModuleUsage = tenants
      .filter(t => t.modules.some(m => m.moduleId === 'agency' && m.enabled))
      .length;
    
    const developersModuleUsage = tenants
      .filter(t => t.modules.some(m => m.moduleId === 'developers' && m.enabled))
      .length;

    return {
      totalTenants: tenants.length,
      activeTenants,
      trialTenants,
      revenue: {
        monthly: monthlyRevenue,
        yearly: monthlyRevenue * 12,
        growth: 15.5 // Mock growth percentage
      },
      moduleUsage: {
        agency: agencyModuleUsage,
        developers: developersModuleUsage
      },
      userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [10, 25, 45, 62, 89, users.length]
      }
    };
  } catch (error) {
    console.error('Get SaaS analytics error:', error);
    return {
      totalTenants: 0,
      activeTenants: 0,
      trialTenants: 0,
      revenue: { monthly: 0, yearly: 0, growth: 0 },
      moduleUsage: { agency: 0, developers: 0 },
      userGrowth: { labels: [], data: [] }
    };
  }
};

// Module Access Functions
export const hasModuleAccess = (user: SaaSUser, moduleId: string): boolean => {
  return user.moduleAccess.includes(moduleId);
};

export const getAvailableModules = (): Module[] => {
  try {
    const modulesStr = localStorage.getItem(SAAS_STORAGE_KEYS.MODULES);
    return modulesStr ? JSON.parse(modulesStr) : availableModules;
  } catch (error) {
    console.error('Get available modules error:', error);
    return availableModules;
  }
};

// Permission Functions
export const hasPermission = (user: SaaSUser, resource: string, action: string): boolean => {
  return user.permissions.some(p => 
    (p.resource === resource || p.resource === '*') && 
    p.actions.includes(action as any)
  );
};