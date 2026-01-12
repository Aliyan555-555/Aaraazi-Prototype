// Core Entity Definitions
export type UserRole = 'admin' | 'agent' | 'superadmin' | 'viewer' | 'saas-admin' | 'super-admin' | 'agency-manager' | 'developer-admin' | 'project-manager' | 'developer-user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    branchId?: string;
    organizationId?: string;
    status?: 'active' | 'inactive' | 'suspended';
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Property {
    id: string;
    title: string;
    address: string;
    price: number;
    status: 'available' | 'negotiation' | 'sold' | 'rented' | 'active';
    type: 'house' | 'apartment' | 'commercial' | 'plot' | 'land';
    agentId: string;
    agentName: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    areaSize?: number;
    areaUnit?: string;
    images?: string[];
    listingSource?: any; // From LeadsIntegration
    createdAt: string;
    updatedAt: string;
}

export interface BuyerRequirement {
    id: string;
    buyerId: string;
    buyerName: string;
    buyerContact: string;
    agentId: string;
    agentName: string;
    status: 'active' | 'matched' | 'closed' | 'archived';
    propertyTypes: string[];
    minBudget: number;
    maxBudget: number;
    minBedrooms: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    preferredLocations: string[];
    matchedProperties?: string[];
    urgency: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    viewings?: any[];
}

export interface RentRequirement {
    id: string;
    tenantName: string;
    tenantContact: string;
    agentId: string;
    agentName: string;
    status: 'active' | 'matched' | 'closed' | 'archived';
    propertyTypes: string[];
    preferredLocation: string;
    minBudget: number;
    maxBudget: number;
    bedrooms?: number;
    leaseDuration?: string;
    moveInDate?: string;
    matchedProperties?: string[];
    urgency: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    email?: string;
    type: 'individual' | 'investor' | 'corporate';
    status: 'active' | 'inactive';
    leadSource?: string;
    assignedAgentId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SellCycle {
    id: string;
    agentId: string;
    agentName: string;
    propertyId: string;
    sellerId: string;
    sellerName: string;
    commissionRate: number;
    status: 'active' | 'negotiating' | 'sold' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    linkedDealId?: string;
}

export interface PurchaseCycle {
    id: string;
    agentId: string;
    agentName: string;
    purchaserId: string;
    purchaserName: string;
    buyerRequirementId?: string;
    status: 'active' | 'negotiating' | 'closed' | 'cancelled';
    purchaserType: 'client' | 'investor' | 'agency';
    createdAt: string;
    updatedAt: string;
    linkedDealId?: string;
}

export interface RentCycle {
    id: string;
    agentId: string;
    agentName: string;
    propertyId: string;
    tenantId: string;
    tenantName: string;
    landlordId: string;
    landlordName: string;
    rentAmount: number;
    status: 'active' | 'negotiating' | 'rented' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    developer: string;
    location: string;
    status: 'planned' | 'under-construction' | 'completed';
    units: number;
    createdAt: string;
    updatedAt: string;
}

export interface LandParcel {
    id: string;
    title: string;
    location: string;
    totalArea: number;
    unit: string;
    status: 'available' | 'sold';
    createdAt: string;
    updatedAt: string;
}

export interface Deal {
    id: string;
    dealNumber: string;
    cycles: {
        sellCycle?: any;
        purchaseCycle?: any;
        rentCycle?: any;
    };
    agents: {
        primary: any;
        secondary?: any;
    };
    parties: {
        seller?: any;
        buyer?: any;
        tenant?: any;
        landlord?: any;
    };
    financial: any;
    lifecycle: any;
    collaboration: any;
    tasks: any[];
    documents: any[];
    sync: any;
    metadata: any;
}

export interface Commission {
    id: string;
    dealId: string;
    amount: number;
    agentId: string;
    status: 'pending' | 'paid';
    date: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    status: 'pending' | 'paid';
    propertyId?: string;
    agentId: string;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    entityId: string;
    entityType: string;
    uploadedBy: string;
    createdAt: string;
}
