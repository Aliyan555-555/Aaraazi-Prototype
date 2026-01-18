/**
 * Tenant Service
 * 
 * Multi-tenant SaaS management utilities
 * Handles tenant isolation, module access, and permissions
 */

import { Tenant, ModuleAccess, SaaSUser, SaaSUserRole } from '../types/saas';
// Supabase removed - using localStorage only
// const BACKEND_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c0858a00`;

/**
 * Get current tenant from session
 */
export function getCurrentTenant(): Tenant | null {
  const tenantStr = localStorage.getItem('estate_current_tenant');
  if (!tenantStr) return null;
  
  try {
    return JSON.parse(tenantStr);
  } catch {
    return null;
  }
}

/**
 * Set current tenant in session
 */
export function setCurrentTenant(tenant: Tenant | null): void {
  if (tenant) {
    localStorage.setItem('estate_current_tenant', JSON.stringify(tenant));
  } else {
    localStorage.removeItem('estate_current_tenant');
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): SaaSUser | null {
  const userStr = localStorage.getItem('estate_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user has access to a module
 */
export function hasModuleAccess(moduleId: 'agency' | 'developers'): boolean {
  const user = getCurrentUser();
  const tenant = getCurrentTenant();
  
  // SaaS Admin has access to everything
  if (user?.role === 'saas-admin') return true;
  
  // Check tenant module subscription
  if (!tenant) return false;
  
  const moduleAccess = tenant.modules.find(m => m.moduleId === moduleId);
  if (!moduleAccess?.enabled) return false;
  
  // Check if module has expired
  if (moduleAccess.expiresAt) {
    const expiryDate = new Date(moduleAccess.expiresAt);
    if (expiryDate < new Date()) return false;
  }
  
  // Check user's module access
  if (!user?.moduleAccess.includes(moduleId)) return false;
  
  return true;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete',
  scope?: 'all' | 'own' | 'branch' | 'organization'
): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // SaaS Admin has all permissions
  if (user.role === 'saas-admin') return true;
  
  // Super Admin has all permissions within their tenant
  if (user.role === 'super-admin') return true;
  
  // Check specific permissions
  const permission = user.permissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  // Check action
  if (!permission.actions.includes(action)) return false;
  
  // Check scope if specified
  if (scope && permission.scope !== 'all' && permission.scope !== scope) {
    return false;
  }
  
  return true;
}

/**
 * Get user's permission scope
 */
export function getPermissionScope(resource: string): 'all' | 'own' | 'branch' | 'organization' | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  if (user.role === 'saas-admin' || user.role === 'super-admin') {
    return 'all';
  }
  
  const permission = user.permissions.find(p => p.resource === resource);
  return permission?.scope || null;
}

/**
 * Check if user is SaaS Admin
 */
export function isSaaSAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'saas-admin';
}

/**
 * Check if user is Super Admin
 */
export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'super-admin';
}

/**
 * Check if user can manage tenant settings
 */
export function canManageTenant(): boolean {
  const user = getCurrentUser();
  return user?.role === 'saas-admin' || user?.role === 'super-admin';
}

/**
 * Get tenant display name
 */
export function getTenantDisplayName(): string {
  const tenant = getCurrentTenant();
  const user = getCurrentUser();
  
  if (user?.role === 'saas-admin') {
    return 'SaaS Admin Portal';
  }
  
  return tenant?.name || 'aaraazi';
}

/**
 * Fetch tenant from backend
 */
export async function fetchTenant(tenantId: string): Promise<Tenant | null> {
  // Supabase removed - tenant data stored in localStorage only
  // Check localStorage for tenant data
  const tenantStr = localStorage.getItem(`estate_tenant_${tenantId}`);
  if (tenantStr) {
    try {
      return JSON.parse(tenantStr);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Create new tenant (SaaS Admin only)
 */
export async function createTenant(tenantData: Partial<Tenant>): Promise<Tenant | null> {
  if (!isSaaSAdmin()) {
    throw new Error('Unauthorized: SaaS Admin access required');
  }
  
  // Supabase removed - store tenant in localStorage
  const tenant: Tenant = {
    id: tenantData.id || `tenant_${Date.now()}`,
    name: tenantData.name || 'New Tenant',
    modules: tenantData.modules || [],
    createdAt: tenantData.createdAt || new Date().toISOString(),
    ...tenantData
  } as Tenant;
  
  localStorage.setItem(`estate_tenant_${tenant.id}`, JSON.stringify(tenant));
  return tenant;
}

/**
 * Update tenant
 */
export async function updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
  if (!canManageTenant()) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  // Supabase removed - update tenant in localStorage
  const tenant = await fetchTenant(tenantId);
  if (!tenant) return null;
  
  const updated = { ...tenant, ...updates };
  localStorage.setItem(`estate_tenant_${tenantId}`, JSON.stringify(updated));
  return updated;
}

/**
 * Activate module for tenant
 */
export async function activateModule(
  tenantId: string,
  moduleId: 'agency' | 'developers',
  expiresAt?: string
): Promise<boolean> {
  if (!canManageTenant()) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  try {
    const tenant = await fetchTenant(tenantId);
    if (!tenant) return false;
    
    const moduleIndex = tenant.modules.findIndex(m => m.moduleId === moduleId);
    
    const moduleAccess: ModuleAccess = {
      moduleId,
      enabled: true,
      activatedAt: new Date().toISOString(),
      expiresAt
    };
    
    if (moduleIndex >= 0) {
      tenant.modules[moduleIndex] = moduleAccess;
    } else {
      tenant.modules.push(moduleAccess);
    }
    
    const updated = await updateTenant(tenantId, { modules: tenant.modules });
    return !!updated;
  } catch (error) {
    console.error('Activate module error:', error);
    return false;
  }
}

/**
 * Deactivate module for tenant
 */
export async function deactivateModule(
  tenantId: string,
  moduleId: 'agency' | 'developers'
): Promise<boolean> {
  if (!canManageTenant()) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  try {
    const tenant = await fetchTenant(tenantId);
    if (!tenant) return false;
    
    const moduleIndex = tenant.modules.findIndex(m => m.moduleId === moduleId);
    
    if (moduleIndex >= 0) {
      tenant.modules[moduleIndex].enabled = false;
    }
    
    const updated = await updateTenant(tenantId, { modules: tenant.modules });
    return !!updated;
  } catch (error) {
    console.error('Deactivate module error:', error);
    return false;
  }
}

/**
 * Get tenant analytics from backend
 */
export async function getTenantAnalytics(tenantId: string): Promise<any> {
  // Supabase removed - return empty analytics
  return {
    tenantId,
    propertiesCount: 0,
    leadsCount: 0,
    usersCount: 0,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Default permissions by role
 */
export function getDefaultPermissions(role: SaaSUserRole) {
  const allActions: ('create' | 'read' | 'update' | 'delete')[] = ['create', 'read', 'update', 'delete'];
  const readOnly: ('create' | 'read' | 'update' | 'delete')[] = ['read'];
  
  const rolePermissions: Record<SaaSUserRole, any[]> = {
    'saas-admin': [
      { resource: '*', actions: allActions, scope: 'all' }
    ],
    'super-admin': [
      { resource: 'properties', actions: allActions, scope: 'all' },
      { resource: 'leads', actions: allActions, scope: 'all' },
      { resource: 'projects', actions: allActions, scope: 'all' },
      { resource: 'investors', actions: allActions, scope: 'all' },
      { resource: 'users', actions: allActions, scope: 'organization' },
      { resource: 'financials', actions: allActions, scope: 'all' }
    ],
    'agency-manager': [
      { resource: 'properties', actions: allActions, scope: 'branch' },
      { resource: 'leads', actions: allActions, scope: 'branch' },
      { resource: 'investors', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'financials', actions: readOnly, scope: 'branch' }
    ],
    'agent': [
      { resource: 'properties', actions: allActions, scope: 'own' },
      { resource: 'leads', actions: allActions, scope: 'own' },
      { resource: 'investors', actions: readOnly, scope: 'own' }
    ],
    'developer-admin': [
      { resource: 'projects', actions: allActions, scope: 'all' },
      { resource: 'properties', actions: allActions, scope: 'all' },
      { resource: 'investors', actions: allActions, scope: 'all' },
      { resource: 'financials', actions: allActions, scope: 'all' }
    ],
    'project-manager': [
      { resource: 'projects', actions: allActions, scope: 'own' },
      { resource: 'properties', actions: ['read', 'update'], scope: 'own' },
      { resource: 'financials', actions: readOnly, scope: 'own' }
    ],
    'developer-user': [
      { resource: 'projects', actions: readOnly, scope: 'own' },
      { resource: 'properties', actions: readOnly, scope: 'own' }
    ],
    'viewer': [
      { resource: '*', actions: readOnly, scope: 'own' }
    ]
  };
  
  return rolePermissions[role] || [];
}
