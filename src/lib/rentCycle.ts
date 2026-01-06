/**
 * Rent Cycle Management Service - V3.0
 * Handles all rental/leasing operations
 */

import { RentCycle, Property } from '../types';
import { getProperties, updateProperty } from './data';
import { syncPropertyStatusFromRentCycle } from './propertyStatusSync';

const RENT_CYCLES_KEY = 'rent_cycles_v3';

/**
 * Get all rent cycles (with optional filtering by user)
 */
export function getRentCycles(userId?: string, userRole?: string): RentCycle[] {
  const json = localStorage.getItem(RENT_CYCLES_KEY);
  const cycles: RentCycle[] = json ? JSON.parse(json) : [];
  
  // Admin sees everything
  if (!userId || userRole === 'admin') {
    return cycles;
  }
  
  // Agents see only their cycles
  return cycles.filter((c: RentCycle) => c.agentId === userId);
}

/**
 * Get a specific rent cycle by ID
 */
export function getRentCycleById(id: string): RentCycle | undefined {
  const cycles = getRentCycles();
  return cycles.find(c => c.id === id);
}

/**
 * Get all rent cycles for a specific property
 * ASSET-CENTRIC: Returns ALL cycles including ended ones for full history
 */
export function getRentCyclesByProperty(propertyId: string): RentCycle[] {
  const cycles = getRentCycles();
  // Return ALL cycles for the property - never hide ended cycles
  // This preserves the complete rental history (Asset-Centric principle)
  return cycles.filter(c => c.propertyId === propertyId);
}

/**
 * Create a new rent cycle
 */
export function createRentCycle(data: Partial<RentCycle>): RentCycle {
  const cycles = getRentCycles();
  
  const newCycle: RentCycle = {
    id: `rent_${Date.now()}`,
    propertyId: data.propertyId!,
    
    // Landlord info
    landlordType: data.landlordType || 'client',
    landlordId: data.landlordId!,
    landlordName: data.landlordName!,
    
    // Rental terms
    monthlyRent: data.monthlyRent!,
    securityDeposit: data.securityDeposit!,
    leasePeriod: data.leasePeriod || 12,
    availableFrom: data.availableFrom || new Date().toISOString().split('T')[0],
    minimumLeasePeriod: data.minimumLeasePeriod,
    
    // Utilities
    utilitiesIncluded: data.utilitiesIncluded || [],
    maintenanceIncluded: data.maintenanceIncluded || false,
    maintenanceResponsibility: data.maintenanceResponsibility,
    
    // Agent/Manager
    agentId: data.agentId!,
    agentName: data.agentName!,
    propertyManagerId: data.propertyManagerId,
    propertyManagerName: data.propertyManagerName,
    
    // Status
    status: 'available',
    
    // Current lease
    rentDueDay: data.rentDueDay || 1,
    
    // History
    leaseHistory: [],
    applications: [],
    
    // Marketing
    title: data.title,
    description: data.description,
    images: data.images || [],
    isPublished: data.isPublished || false,
    publishedOn: data.publishedOn || [],
    
    // Rent collection
    rentPayments: [],
    
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.agentId!,
  };
  
  cycles.push(newCycle);
  localStorage.setItem(RENT_CYCLES_KEY, JSON.stringify(cycles));
  
  // Update property to link this rent cycle
  const properties = getProperties();
  const property = properties.find(p => p.id === data.propertyId);
  if (property) {
    const updatedProperty: Partial<Property> = {
      activeRentCycleIds: [...(property.activeRentCycleIds || []), newCycle.id],
    };
    updateProperty(data.propertyId!, updatedProperty);
  }
  
  // Dispatch event so UI can update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cycleCreated', { 
      detail: { propertyId: data.propertyId, cycleId: newCycle.id, cycleType: 'rent' } 
    }));
  }
  
  return newCycle;
}

/**
 * Update an existing rent cycle
 */
export function updateRentCycle(id: string, updates: Partial<RentCycle>): void {
  const cycles = getRentCycles();
  const index = cycles.findIndex(c => c.id === id);
  
  if (index !== -1) {
    cycles[index] = {
      ...cycles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(RENT_CYCLES_KEY, JSON.stringify(cycles));
    
    // 🔄 AUTO-SYNC: Update property status if cycle status changed
    if (updates.status) {
      try {
        syncPropertyStatusFromRentCycle(id);
      } catch (error) {
        console.error('Error syncing property status from rent cycle:', error);
        // Don't throw - cycle update should succeed even if sync fails
      }
    }
  }
}

/**
 * Add a tenant application
 */
export function addTenantApplication(
  cycleId: string,
  tenantId: string,
  tenantName: string,
  tenantContact: string,
  notes?: string
): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  const application = {
    id: `app_${Date.now()}`,
    tenantId,
    tenantName,
    tenantContact,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    notes,
  };
  
  const updatedApplications = [...cycle.applications, application];
  updateRentCycle(cycleId, { 
    applications: updatedApplications,
    status: 'application-received',
  });
}

/**
 * Approve a tenant application
 */
export function approveTenantApplication(cycleId: string, applicationId: string): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  const updatedApplications = cycle.applications.map(app => ({
    ...app,
    status: app.id === applicationId ? 'approved' as const : 'rejected' as const,
  }));
  
  updateRentCycle(cycleId, { applications: updatedApplications });
}

/**
 * Reject a tenant application
 */
export function rejectTenantApplication(cycleId: string, applicationId: string): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  const updatedApplications = cycle.applications.map(app => ({
    ...app,
    status: app.id === applicationId ? 'rejected' as const : app.status,
  }));
  
  updateRentCycle(cycleId, { applications: updatedApplications });
}

/**
 * Sign a lease with a tenant
 */
export function signLease(
  cycleId: string,
  tenantId: string,
  tenantName: string,
  tenantContact: string,
  startDate?: string
): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  const leaseStart = startDate || new Date().toISOString().split('T')[0];
  const leaseEndDate = new Date(leaseStart);
  leaseEndDate.setMonth(leaseEndDate.getMonth() + cycle.leasePeriod);
  
  updateRentCycle(cycleId, {
    status: 'active',
    currentTenantId: tenantId,
    currentTenantName: tenantName,
    currentTenantContact: tenantContact,
    leaseStartDate: leaseStart,
    leaseEndDate: leaseEndDate.toISOString().split('T')[0],
  });
  
  // Initialize rent payments for the lease period
  const payments = [];
  const currentDate = new Date(leaseStart);
  
  for (let i = 0; i < cycle.leasePeriod; i++) {
    const month = currentDate.toISOString().slice(0, 7); // "YYYY-MM"
    payments.push({
      month,
      amount: cycle.monthlyRent,
      status: 'pending' as const,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  updateRentCycle(cycleId, { rentPayments: payments });
}

/**
 * Record rent payment
 */
export function recordRentPayment(
  cycleId: string,
  month: string,
  amountPaid: number,
  paidDate?: string,
  notes?: string
): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  const updatedPayments = (cycle.rentPayments || []).map(payment => {
    if (payment.month === month) {
      return {
        ...payment,
        paidDate: paidDate || new Date().toISOString().split('T')[0],
        status: amountPaid >= payment.amount ? 'paid' as const : 'partial' as const,
        notes,
      };
    }
    return payment;
  });
  
  updateRentCycle(cycleId, { rentPayments: updatedPayments });
}

/**
 * End a lease
 */
export function endLease(
  cycleId: string,
  moveOutDate: string,
  depositReturned: number,
  deductions?: { reason: string; amount: number }[]
): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  // Add to lease history
  const leaseRecord = {
    id: `lease_${Date.now()}`,
    tenantId: cycle.currentTenantId!,
    tenantName: cycle.currentTenantName!,
    startDate: cycle.leaseStartDate!,
    endDate: cycle.leaseEndDate!,
    monthlyRent: cycle.monthlyRent,
    securityDeposit: cycle.securityDeposit,
    moveOutDate,
    depositReturned,
    deductions,
  };
  
  const updatedHistory = [...cycle.leaseHistory, leaseRecord];
  
  updateRentCycle(cycleId, {
    status: 'available', // Back to available
    currentTenantId: undefined,
    currentTenantName: undefined,
    currentTenantContact: undefined,
    leaseStartDate: undefined,
    leaseEndDate: undefined,
    leaseHistory: updatedHistory,
    rentPayments: [], // Clear for next tenant
  });
}

/**
 * Renew a lease
 */
export function renewLease(
  cycleId: string,
  newMonthlyRent?: number,
  newLeasePeriod?: number
): void {
  const cycle = getRentCycleById(cycleId);
  if (!cycle) {
    throw new Error('Rent cycle not found');
  }
  
  // Archive current lease
  const currentLeaseRecord = {
    id: `lease_${Date.now()}`,
    tenantId: cycle.currentTenantId!,
    tenantName: cycle.currentTenantName!,
    startDate: cycle.leaseStartDate!,
    endDate: cycle.leaseEndDate!,
    monthlyRent: cycle.monthlyRent,
    securityDeposit: cycle.securityDeposit,
  };
  
  const updatedHistory = [...cycle.leaseHistory, currentLeaseRecord];
  
  // Start new lease period
  const newStartDate = new Date().toISOString().split('T')[0];
  const leasePeriod = newLeasePeriod || cycle.leasePeriod;
  const leaseEndDate = new Date(newStartDate);
  leaseEndDate.setMonth(leaseEndDate.getMonth() + leasePeriod);
  
  const rentAmount = newMonthlyRent || cycle.monthlyRent;
  
  updateRentCycle(cycleId, {
    monthlyRent: rentAmount,
    leasePeriod,
    leaseStartDate: newStartDate,
    leaseEndDate: leaseEndDate.toISOString().split('T')[0],
    leaseHistory: updatedHistory,
    status: 'active',
  });
  
  // Initialize new rent payments
  const payments = [];
  const currentDate = new Date(newStartDate);
  
  for (let i = 0; i < leasePeriod; i++) {
    const month = currentDate.toISOString().slice(0, 7);
    payments.push({
      month,
      amount: rentAmount,
      status: 'pending' as const,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  updateRentCycle(cycleId, { rentPayments: payments });
}

/**
 * End/Close a rent cycle
 */
export function closeRentCycle(id: string): void {
  updateRentCycle(id, { status: 'ended' });
  
  const cycle = getRentCycleById(id);
  if (cycle) {
    // Remove from property's active cycles
    const properties = getProperties();
    const property = properties.find(p => p.id === cycle.propertyId);
    if (property) {
      const updatedActiveRentCycles = (property.activeRentCycleIds || [])
        .filter(cId => cId !== id);
      const updatedProperty: Partial<Property> = {
        activeRentCycleIds: updatedActiveRentCycles,
        cycleHistory: {
          ...property.cycleHistory,
          rentCycles: [...(property.cycleHistory?.rentCycles || []), id],
        },
      };
      updateProperty(cycle.propertyId, updatedProperty);
    }
  }
}

/**
 * Get rent cycle statistics
 */
export function getRentCycleStats(userId?: string, userRole?: string) {
  const cycles = getRentCycles(userId, userRole);
  
  const activeCycles = cycles.filter(c => c.status === 'active');
  const totalRentCollected = activeCycles.reduce((sum, c) => {
    const paidPayments = (c.rentPayments || []).filter(p => p.status === 'paid');
    return sum + paidPayments.reduce((pSum, p) => pSum + p.amount, 0);
  }, 0);
  
  const pendingPayments = activeCycles.reduce((sum, c) => {
    const pending = (c.rentPayments || []).filter(p => p.status === 'pending');
    return sum + pending.reduce((pSum, p) => pSum + p.amount, 0);
  }, 0);
  
  return {
    total: cycles.length,
    available: cycles.filter(c => c.status === 'available').length,
    showing: cycles.filter(c => c.status === 'showing').length,
    applicationReceived: cycles.filter(c => c.status === 'application-received').length,
    leased: cycles.filter(c => c.status === 'leased').length,
    active: cycles.filter(c => c.status === 'active').length,
    renewalPending: cycles.filter(c => c.status === 'renewal-pending').length,
    ending: cycles.filter(c => c.status === 'ending').length,
    ended: cycles.filter(c => c.status === 'ended').length,
    totalApplications: cycles.reduce((sum, c) => sum + c.applications.length, 0),
    totalRentCollected,
    pendingPayments,
    occupancyRate: cycles.length > 0
      ? (activeCycles.length / cycles.length) * 100
      : 0,
  };
}