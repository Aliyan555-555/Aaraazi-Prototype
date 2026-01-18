import { Property, Lead, User, Contact, GeneratedDocument, Commission, Expense, CRMInteraction, CRMTask, Payment, AccountPayment, JournalEntry, ContactType, ContactCategory, ContactStatus } from '../types';
import { City, Area, Block, Building } from '../types/locations';
import { seedCities, seedAreas, seedBlocks, seedBuildings } from './seedLocations';
import { logger } from './logger';

const PROPERTIES_KEY = 'estate_properties';
const LEADS_KEY = 'estate_leads';
const DOCUMENTS_KEY = 'estate_documents';
const COMMISSIONS_KEY = 'estate_commissions';
const EXPENSES_KEY = 'estate_expenses';
const CRM_CONTACTS_KEY = 'crm_contacts';
const CRM_INTERACTIONS_KEY = 'crm_interactions';
const CRM_TASKS_KEY = 'crm_tasks';
const PAYMENTS_KEY = 'property_payments';
const PROJECTS_KEY = 'developer_projects';
const LAND_PARCELS_KEY = 'land_parcels';
const ACCOUNT_PAYMENTS_KEY = 'account_payments';
const JOURNAL_ENTRIES_KEY = 'journal_entries';

// Location Management Keys
const CITIES_KEY = 'aaraazi_cities';
const AREAS_KEY = 'aaraazi_areas';
const BLOCKS_KEY = 'aaraazi_blocks';
const BUILDINGS_KEY = 'aaraazi_buildings';

// Mock data initialization
const mockProperties: Property[] = [
  // V3.0: Empty - users will add properties using the new Asset-Centric model
  // Old V2 mock data removed to prevent confusion
];

const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    workspaceId: 'default',
    name: 'Ahmed Shah',
    phone: '+92-300-1234567',
    email: 'ahmed.shah@example.com',
    phoneVerified: true,
    emailVerified: false,
    intent: 'buying',
    timeline: 'within-1-month',
    source: 'website',
    qualificationScore: 85,
    scoreBreakdown: {
      contactQuality: 15,
      intentClarity: 20,
      budgetRealism: 15,
      timelineUrgency: 20,
      sourceQuality: 15
    },
    priority: 'high',
    status: 'new',
    interactions: [],
    notes: 'Looking for a 3BHK in DHA Phase 8.',
    sla: {
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      slaCompliant: true
    },
    agentId: 'agent-1',
    agentName: 'Ali Raza',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    version: 2
  }
];

// Track if initialization has already been done
let isInitialized = false;

export const initializeData = () => {
  // Skip if already initialized in this session
  if (isInitialized) {
    return;
  }

  try {
    // Properties
    if (!localStorage.getItem(PROPERTIES_KEY)) {
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(mockProperties));
    } else {
      // Validate existing properties data
      try {
        const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
        if (!Array.isArray(properties)) {
          logger.warn('Invalid properties data structure, resetting');
          localStorage.setItem(PROPERTIES_KEY, JSON.stringify([]));
        }
      } catch (e) {
        logger.warn('Failed to parse properties, resetting');
        localStorage.setItem(PROPERTIES_KEY, JSON.stringify([]));
      }
    }

    // Leads
    if (!localStorage.getItem(LEADS_KEY)) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(mockLeads));
    } else {
      // Validate existing leads data
      try {
        const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
        if (!Array.isArray(leads)) {
          logger.warn('Invalid leads data structure, resetting');
          localStorage.setItem(LEADS_KEY, JSON.stringify([]));
        }
      } catch (e) {
        logger.warn('Failed to parse leads, resetting');
        localStorage.setItem(LEADS_KEY, JSON.stringify([]));
      }
    }

    // Initialize other data structures with validation
    const dataKeys = [
      { key: DOCUMENTS_KEY, defaultValue: [] },
      { key: COMMISSIONS_KEY, defaultValue: [] },
      { key: EXPENSES_KEY, defaultValue: [] },
      { key: CRM_INTERACTIONS_KEY, defaultValue: [] },
      { key: CRM_TASKS_KEY, defaultValue: [] },
      { key: PAYMENTS_KEY, defaultValue: [] },
      { key: PROJECTS_KEY, defaultValue: [] },
      { key: LAND_PARCELS_KEY, defaultValue: [] },
      { key: JOURNAL_ENTRIES_KEY, defaultValue: [] }
    ];

    dataKeys.forEach(({ key, defaultValue }) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      } else {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '[]');
          if (!Array.isArray(data)) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
          }
        } catch (error) {
          localStorage.setItem(key, JSON.stringify(defaultValue));
        }
      }
    });

    // Smart CRM data initialization - populate with existing leads if CRM is empty
    if (!localStorage.getItem(CRM_CONTACTS_KEY)) {
      try {
        const crmContacts = migrateLeadsToContacts();
        localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(crmContacts));
      } catch (error) {
        console.error('Error migrating leads to contacts:', error);
        localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify([]));
      }
    } else {
      try {
        const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
        if (!Array.isArray(contacts)) {
          const crmContacts = migrateLeadsToContacts();
          localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(crmContacts));
        }
      } catch (error) {
        console.error('Error validating CRM contacts:', error);
        localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify([]));
      }
    }

    // Initialize Location Data (Cities, Areas, Blocks, Buildings)
    if (!localStorage.getItem(CITIES_KEY)) {
      localStorage.setItem(CITIES_KEY, JSON.stringify(seedCities));
    }
    if (!localStorage.getItem(AREAS_KEY)) {
      localStorage.setItem(AREAS_KEY, JSON.stringify(seedAreas));
    }
    if (!localStorage.getItem(BLOCKS_KEY)) {
      localStorage.setItem(BLOCKS_KEY, JSON.stringify(seedBlocks));
    }
    if (!localStorage.getItem(BUILDINGS_KEY)) {
      localStorage.setItem(BUILDINGS_KEY, JSON.stringify(seedBuildings));
    }
  } catch (error) {
    console.error('Error initializing data, resetting to defaults:', error);
    // Reset all data to defaults
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(mockProperties));
    localStorage.setItem(LEADS_KEY, JSON.stringify(mockLeads));
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify([]));
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify([]));
    localStorage.setItem(EXPENSES_KEY, JSON.stringify([]));
    localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify([]));
    localStorage.setItem(CRM_INTERACTIONS_KEY, JSON.stringify([]));
    localStorage.setItem(CRM_TASKS_KEY, JSON.stringify([]));
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify([]));
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([]));
    localStorage.setItem(LAND_PARCELS_KEY, JSON.stringify([]));
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify([]));
  } finally {
    // Mark as initialized to prevent redundant calls
    isInitialized = true;
  }
};

// Smart migration function to convert existing leads to CRM contacts (simplified)
const migrateLeadsToContacts = (): Contact[] => {
  try {
    const leads = mockLeads;

    return leads.map((lead) => ({
      id: `contact_${lead.id}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      type: lead.status === 'converted' ? 'client' as ContactType : 'prospect' as ContactType,
      category: 'buyer' as ContactCategory,
      status: 'active' as ContactStatus,
      source: lead.source,
      notes: lead.notes,
      tags: [lead.source.toLowerCase().replace(/\s+/g, '-')],
      agentId: lead.agentId,
      createdBy: lead.createdBy || 'system',
      createdAt: lead.createdAt || new Date().toISOString(),
      updatedAt: lead.updatedAt || new Date().toISOString(),
      lastContactDate: lead.status !== 'new' ? lead.updatedAt : undefined,
      nextFollowUp: undefined,
      interestedProperties: [], // Lead V2 doesn't have propertyId directly in some cases, or it's in details
      totalTransactions: lead.status === 'converted' ? 1 : 0,
      totalCommissionEarned: 0,
      totalDeals: 0,
      totalVolume: 0
    }));
  } catch (error) {
    console.error('Error in migrateLeadsToContacts:', error);
    return [];
  }
};



// Properties
export const getProperties = (agentId?: string, userRole?: string): Property[] => {
  try {
    initializeData();
    const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');

    // Validate properties array
    if (!Array.isArray(properties)) {
      console.error('Properties data is not an array, returning empty array');
      return [];
    }

    // Filter out invalid property objects
    // V3.0: Check for address and createdBy instead of title and agentId
    const validProperties = properties.filter((p: any) =>
      p && p.id && p.address && p.createdBy && Array.isArray(p.sharedWith)
    );

    if (userRole === 'admin') {
      return validProperties;
    }

    if (agentId) {
      // V3.0: Filter by createdBy instead of agentId
      return validProperties.filter((p: Property) =>
        p.createdBy === agentId || p.sharedWith.includes(agentId)
      );
    }

    return validProperties;
  } catch (error) {
    console.error('Error getting properties:', error);
    return [];
  }
};

export const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
  initializeData();
  const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
  const newProperty: Property = {
    ...property,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };

  properties.push(newProperty);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));

  // Sync investor allocations if this is an investor-purchase property
  if (newProperty.acquisitionType === 'investor-purchase') {
    try {
      // Dynamically import to avoid circular dependencies
      import('./investorIntegration').then(({ syncPropertyInvestors }) => {
        syncPropertyInvestors(newProperty, property.createdBy);
      }).catch(err => console.error('Error syncing investors:', err));
    } catch (error) {
      console.error('Error loading investor integration:', error);
    }
  }

  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('propertyUpdated', {
    detail: { propertyId: newProperty.id, action: 'added' }
  }));

  return newProperty;
};

export const updateProperty = (id: string, updates: Partial<Property>): Property | null => {
  initializeData();
  const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
  const index = properties.findIndex((p: Property) => p.id === id);

  if (index !== -1) {
    const updatedProperty = {
      ...properties[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    properties[index] = updatedProperty;
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));

    // Sync investor allocations if this is an investor-purchase property
    if (updatedProperty.acquisitionType === 'investor-purchase') {
      try {
        // Dynamically import to avoid circular dependencies
        import('./investorIntegration').then(({ syncPropertyInvestors }) => {
          syncPropertyInvestors(updatedProperty, updatedProperty.createdBy);
        }).catch(err => console.error('Error syncing investors:', err));
      } catch (error) {
        console.error('Error loading investor integration:', error);
      }
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyUpdated', {
      detail: { propertyId: id, updates }
    }));

    return updatedProperty;
  }

  return null;
};

export const getPropertyById = (id: string): Property | null => {
  initializeData();
  const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
  return properties.find((p: Property) => p.id === id) || null;
};

/**
 * Delete a property (for admin/testing purposes)
 * Note: In production, consider using archiveProperty instead
 */
export const deleteProperty = (id: string): boolean => {
  try {
    initializeData();
    const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
    const filtered = properties.filter((p: Property) => p.id !== id);

    if (filtered.length === properties.length) {
      // Property not found
      return false;
    }

    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(filtered));

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('propertyUpdated', {
      detail: { propertyId: id, action: 'deleted' }
    }));

    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
};

/**
 * Archive a property
 * Marks property as archived with timestamp and user info
 */
export const archiveProperty = (propertyId: string, userId: string): Property | null => {
  try {
    initializeData();
    const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
    const property = properties.find((p: Property) => p.id === propertyId);

    if (!property) {
      console.error('Property not found:', propertyId);
      return null;
    }

    const updated = properties.map((p: Property) =>
      p.id === propertyId
        ? {
          ...p,
          archived: true,
          archivedAt: new Date().toISOString(),
          archivedBy: userId,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        : p
    );

    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('propertyUpdated', {
      detail: { propertyId, action: 'archived' }
    }));

    return updated.find((p: Property) => p.id === propertyId) || null;
  } catch (error) {
    console.error('Error archiving property:', error);
    return null;
  }
};

/**
 * Unarchive a property
 * Removes archived status from property
 */
export const unarchiveProperty = (propertyId: string): Property | null => {
  try {
    initializeData();
    const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
    const property = properties.find((p: Property) => p.id === propertyId);

    if (!property) {
      console.error('Property not found:', propertyId);
      return null;
    }

    const updated = properties.map((p: Property) =>
      p.id === propertyId
        ? {
          ...p,
          archived: false,
          archivedAt: undefined,
          archivedBy: undefined,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        : p
    );

    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('propertyUpdated', {
      detail: { propertyId, action: 'unarchived' }
    }));

    return updated.find((p: Property) => p.id === propertyId) || null;
  } catch (error) {
    console.error('Error unarchiving property:', error);
    return null;
  }
};

/**
 * Get archived properties
 * Returns only properties that are archived
 */
export const getArchivedProperties = (agentId?: string, userRole?: string): Property[] => {
  try {
    const allProperties = getProperties(agentId, userRole);
    return allProperties.filter(p => p.archived === true);
  } catch (error) {
    console.error('Error getting archived properties:', error);
    return [];
  }
};

/**
 * Get active (non-archived) properties
 * Returns only properties that are not archived
 */
export const getActiveProperties = (agentId?: string, userRole?: string): Property[] => {
  try {
    const allProperties = getProperties(agentId, userRole);
    return allProperties.filter(p => p.archived !== true);
  } catch (error) {
    console.error('Error getting active properties:', error);
    return [];
  }
};

// Leads
export const getLeads = (agentId?: string, userRole?: string): Lead[] => {
  try {
    initializeData();
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');

    // Validate leads array
    if (!Array.isArray(leads)) {
      console.error('Leads data is not an array, returning empty array');
      return [];
    }

    // Filter out invalid lead objects
    const validLeads = leads.filter((l: any) =>
      l && l.id && l.name && l.agentId && l.status
    );

    if (userRole === 'admin') {
      return validLeads;
    }

    if (agentId) {
      return validLeads.filter((l: Lead) => l.agentId === agentId);
    }

    return validLeads;
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
};

export const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead | null => {
  try {
    // Validate required fields
    if (!lead.name || !lead.phone || !lead.agentId || !lead.status) {
      console.error('Missing required fields for lead');
      return null;
    }

    // Validate data types and lengths
    if (typeof lead.name !== 'string' || lead.name.trim().length < 2 || lead.name.trim().length > 100) {
      console.error('Invalid lead name');
      return null;
    }

    // Phone validation - allow numbers, spaces, dashes, parentheses, and plus sign
    // Extract only digits to check minimum length
    // Pakistani phone numbers are typically 10-11 digits (with country code up to 13)
    const phoneDigits = lead.phone.replace(/\D/g, '');
    if (typeof lead.phone !== 'string' || lead.phone.trim().length === 0) {
      console.error('Invalid lead phone - phone is required');
      return null;
    }

    // Relaxed validation: allow 7-15 digits for flexibility
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      console.error('Invalid lead phone - must contain 7-15 digits');
      return null;
    }

    if (lead.email && (typeof lead.email !== 'string' || lead.email.trim().length === 0)) {
      console.error('Invalid lead email');
      return null;
    }

    initializeData();
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');

    if (!Array.isArray(leads)) {
      console.error('Leads data is not an array');
      return null;
    }

    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    leads.push(newLead);

    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (storageError) {
      console.error('Failed to save lead to localStorage:', storageError);
      // Handle localStorage quota exceeded
      if (storageError instanceof DOMException && storageError.code === 22) {
        console.error('localStorage quota exceeded');
        // Could implement cleanup logic here
      }
      return null;
    }

    return newLead;
  } catch (error) {
    console.error('Error adding lead:', error);
    return null;
  }
};

export const updateLead = (id: string, updates: Partial<Lead>): Lead | null => {
  initializeData();
  const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  const index = leads.findIndex((l: Lead) => l.id === id);

  if (index !== -1) {
    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return leads[index];
  }

  return null;
};

// Documents
export const getDocuments = (propertyId: string): GeneratedDocument[] => {
  initializeData();
  const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]');
  return documents.filter((d: GeneratedDocument) => d.propertyId === propertyId);
};

export const addDocument = (document: Omit<GeneratedDocument, 'id' | 'createdAt'>): GeneratedDocument => {
  initializeData();
  const documents = JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]');
  const newDocument: GeneratedDocument = {
    ...document,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  documents.push(newDocument);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  return newDocument;
};

// Commissions
export const getCommissions = (agentId?: string, userRole?: string): Commission[] => {
  initializeData();
  const commissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');

  if (userRole === 'admin') {
    return commissions;
  }

  if (agentId) {
    return commissions.filter((c: Commission) => c.agentId === agentId);
  }

  return commissions;
};

// Expenses
export const getExpenses = (agentId?: string, userRole?: string): Expense[] => {
  initializeData();
  const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');

  if (userRole === 'admin') {
    return expenses;
  }

  if (agentId) {
    return expenses.filter((e: Expense) => e.agentId === agentId);
  }

  return expenses;
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  initializeData();
  const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString()
  };

  expenses.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return newExpense;
};

// Update an existing expense
export const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id'>>): Expense | null => {
  initializeData();
  const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
  const index = expenses.findIndex((e: Expense) => e.id === id);

  if (index === -1) {
    return null;
  }

  expenses[index] = {
    ...expenses[index],
    ...updates
  };

  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expenses[index];
};

// Delete an expense
export const deleteExpense = (id: string): boolean => {
  initializeData();
  const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
  const filteredExpenses = expenses.filter((e: Expense) => e.id !== id);

  if (filteredExpenses.length === expenses.length) {
    return false; // Expense not found
  }

  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filteredExpenses));
  return true;
};

// ============================================================================
// ACCOUNT PAYMENTS - A/R and A/P Management
// ============================================================================

export const getAccountPayments = (agentId?: string, userRole?: string): AccountPayment[] => {
  initializeData();
  const payments = JSON.parse(localStorage.getItem(ACCOUNT_PAYMENTS_KEY) || '[]');

  if (userRole === 'admin') {
    return payments;
  }

  if (agentId) {
    return payments.filter((p: AccountPayment) => p.agentId === agentId);
  }

  return payments;
};

export const addAccountPayment = (payment: Omit<AccountPayment, 'id' | 'createdAt' | 'updatedAt'>): AccountPayment => {
  initializeData();
  const payments = JSON.parse(localStorage.getItem(ACCOUNT_PAYMENTS_KEY) || '[]');

  const newPayment: AccountPayment = {
    ...payment,
    id: `PAY-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  payments.push(newPayment);
  localStorage.setItem(ACCOUNT_PAYMENTS_KEY, JSON.stringify(payments));
  return newPayment;
};

export const updateAccountPayment = (id: string, updates: Partial<Omit<AccountPayment, 'id' | 'createdAt'>>): AccountPayment | null => {
  initializeData();
  const payments = JSON.parse(localStorage.getItem(ACCOUNT_PAYMENTS_KEY) || '[]');
  const index = payments.findIndex((p: AccountPayment) => p.id === id);

  if (index === -1) {
    return null;
  }

  payments[index] = {
    ...payments[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(ACCOUNT_PAYMENTS_KEY, JSON.stringify(payments));
  return payments[index];
};

export const deleteAccountPayment = (id: string): boolean => {
  initializeData();
  const payments = JSON.parse(localStorage.getItem(ACCOUNT_PAYMENTS_KEY) || '[]');
  const filteredPayments = payments.filter((p: AccountPayment) => p.id !== id);

  if (filteredPayments.length === payments.length) {
    return false;
  }

  localStorage.setItem(ACCOUNT_PAYMENTS_KEY, JSON.stringify(filteredPayments));
  return true;
};

// Get all agents (for admin use and commission assignment)
// Returns all users who can be assigned to commissions (agents, admins, managers)
export const getAllAgents = (): User[] => {
  const USERS_KEY = 'estate_users';
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  // Include agents, admins, and any other user who can earn commission
  return users.filter((u: User) => u.role === 'agent' || u.role === 'admin');
};

// Smart data integration functions
export const getContactById = (id: string): Contact | null => {
  const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
  return contacts.find((c: Contact) => c.id === id) || null;
};

// Get all contacts for a user
export const getContacts = (agentId?: string, userRole?: string): Contact[] => {
  try {
    initializeData();
    const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');

    // Validate contacts array
    if (!Array.isArray(contacts)) {
      logger.error('Contacts data is not an array, returning empty array');
      return [];
    }

    // Filter out invalid contact objects
    const validContacts = contacts.filter((c: any) =>
      c && c.id && c.name && c.agentId
    );

    if (userRole === 'admin') {
      return validContacts;
    }

    if (agentId) {
      return validContacts.filter((c: Contact) => c.agentId === agentId);
    }

    return validContacts;
  } catch (error) {
    logger.error('Error getting contacts:', error);
    return [];
  }
};

// Add a new contact
export const addContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
  initializeData();
  const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
  const newContact: Contact = {
    ...contact,
    id: `contact_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  contacts.push(newContact);
  localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
};

// Update contact
export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
  initializeData();
  const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
  const index = contacts.findIndex((c: Contact) => c.id === id);

  if (index !== -1) {
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
    return contacts[index];
  }

  return null;
};

// Delete contact
export const deleteContact = (id: string): boolean => {
  initializeData();
  const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
  const index = contacts.findIndex((c: Contact) => c.id === id);

  if (index !== -1) {
    contacts.splice(index, 1);
    localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
    return true;
  }

  return false;
};

export const getPropertyContacts = (propertyId: string): Contact[] => {
  const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
  return contacts.filter((c: Contact) => c.interestedProperties && c.interestedProperties.includes(propertyId));
};

export const getContactInteractions = (contactId: string): CRMInteraction[] => {
  const interactions = JSON.parse(localStorage.getItem(CRM_INTERACTIONS_KEY) || '[]');
  return interactions.filter((i: CRMInteraction) => i.contactId === contactId);
};

export const getContactTasks = (contactId: string): CRMTask[] => {
  const tasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');
  return tasks.filter((t: CRMTask) => t.contactId === contactId);
};

// ============================================================================
// INTERACTION MANAGEMENT
// ============================================================================

export const getAllInteractions = (agentId?: string, role?: string): CRMInteraction[] => {
  try {
    const interactions = JSON.parse(localStorage.getItem(CRM_INTERACTIONS_KEY) || '[]');

    if (role === 'admin') {
      return interactions;
    }

    if (agentId) {
      return interactions.filter((i: CRMInteraction) => i.agentId === agentId);
    }

    return interactions;
  } catch (error) {
    console.error('Error getting interactions:', error);
    return [];
  }
};

export const addInteraction = (interactionData: Omit<CRMInteraction, 'id' | 'createdAt'>): CRMInteraction | null => {
  try {
    const interactions = JSON.parse(localStorage.getItem(CRM_INTERACTIONS_KEY) || '[]');

    const newInteraction: CRMInteraction = {
      ...interactionData,
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const updatedInteractions = [...interactions, newInteraction];
    localStorage.setItem(CRM_INTERACTIONS_KEY, JSON.stringify(updatedInteractions));

    // Update contact's lastContactDate
    if (interactionData.contactId) {
      const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');
      const contactIndex = contacts.findIndex((c: Contact) => c.id === interactionData.contactId);
      if (contactIndex !== -1) {
        contacts[contactIndex].lastContactDate = new Date().toISOString();
        contacts[contactIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
      }
    }

    return newInteraction;
  } catch (error) {
    console.error('Error adding interaction:', error);
    return null;
  }
};

export const updateInteraction = (id: string, updates: Partial<CRMInteraction>): boolean => {
  try {
    const interactions = JSON.parse(localStorage.getItem(CRM_INTERACTIONS_KEY) || '[]');
    const index = interactions.findIndex((i: CRMInteraction) => i.id === id);

    if (index === -1) return false;

    interactions[index] = {
      ...interactions[index],
      ...updates,
      id: interactions[index].id, // Prevent ID from being updated
      createdAt: interactions[index].createdAt // Prevent createdAt from being updated
    };

    localStorage.setItem(CRM_INTERACTIONS_KEY, JSON.stringify(interactions));
    return true;
  } catch (error) {
    console.error('Error updating interaction:', error);
    return false;
  }
};

export const deleteInteraction = (id: string): boolean => {
  try {
    const interactions = JSON.parse(localStorage.getItem(CRM_INTERACTIONS_KEY) || '[]');
    const filteredInteractions = interactions.filter((i: CRMInteraction) => i.id !== id);
    localStorage.setItem(CRM_INTERACTIONS_KEY, JSON.stringify(filteredInteractions));
    return true;
  } catch (error) {
    console.error('Error deleting interaction:', error);
    return false;
  }
};

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

export const getAllTasks = (agentId?: string, role?: string): CRMTask[] => {
  try {
    const tasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');

    if (role === 'admin') {
      return tasks;
    }

    if (agentId) {
      return tasks.filter((t: CRMTask) => t.agentId === agentId);
    }

    return tasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const addTask = (taskData: Omit<CRMTask, 'id' | 'createdAt'>): CRMTask | null => {
  try {
    const tasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');

    const newTask: CRMTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    localStorage.setItem(CRM_TASKS_KEY, JSON.stringify(updatedTasks));

    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

export const updateTask = (id: string, updates: Partial<CRMTask>): boolean => {
  try {
    const tasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');
    const index = tasks.findIndex((t: CRMTask) => t.id === id);

    if (index === -1) return false;

    // If marking as completed, set completedAt
    if (updates.status === 'completed' && tasks[index].status !== 'completed') {
      updates.completedAt = new Date().toISOString();
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      id: tasks[index].id, // Prevent ID from being updated
      createdAt: tasks[index].createdAt // Prevent createdAt from being updated
    };

    localStorage.setItem(CRM_TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

export const deleteTask = (id: string): boolean => {
  try {
    const tasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');
    const filteredTasks = tasks.filter((t: CRMTask) => t.id !== id);
    localStorage.setItem(CRM_TASKS_KEY, JSON.stringify(filteredTasks));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Convert lead to contact when lead status changes to interested or converted (simplified)
export const convertLeadToContact = (leadId: string): Contact | null => {
  try {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    const lead = leads.find((l: Lead) => l.id === leadId);

    if (!lead) return null;

    const contacts = JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]');

    // Create new contact from lead
    const newContact: Contact = {
      id: `contact_from_lead_${leadId}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      type: lead.status === 'converted' ? 'client' : 'prospect',
      category: 'buyer',
      status: 'active',
      source: lead.source,
      notes: lead.notes,
      tags: [lead.source.toLowerCase()],
      agentId: lead.agentId,
      createdBy: lead.createdBy || 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      interestedProperties: [],
      totalTransactions: 0,
      totalCommissionEarned: 0
    };

    const updatedContacts = [...contacts, newContact];
    localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(updatedContacts));
    return newContact;
  } catch (error) {
    console.error('Error converting lead to contact:', error);
    return null;
  }
};

// Payment tracking functions

export const getPropertyPayments = (propertyId: string): Payment[] => {
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
  return payments.filter((p: Payment) => p.propertyId === propertyId);
};

export const addPropertyPayment = (payment: Omit<Payment, 'id' | 'createdAt'>): Payment => {
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
  const newPayment: Payment = {
    ...payment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

  // Update property payment tracking
  if (payment.propertyId) {
    updatePropertyPaymentSummary(payment.propertyId);
  }

  return newPayment;
};

export const updatePropertyPaymentSummary = (propertyId: string): void => {
  const properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
  const payments = getPropertyPayments(propertyId);
  const propertyIndex = properties.findIndex((p: Property) => p.id === propertyId);

  if (propertyIndex === -1) return;

  const property = properties[propertyIndex];
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = property.finalSalePrice || property.price;

  properties[propertyIndex] = {
    ...property,
    paymentTracking: {
      totalAmount,
      paidAmount: totalPaid,
      remainingAmount: totalAmount - totalPaid,
      payments,
      isFinanced: payments.some(p => p.paymentMethod === 'financing'),
      ...(property.paymentTracking || {})
    }
  };

  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
};

// Smart contextual suggestions (simplified)
export const getContextualSuggestions = (context: {
  type: 'property' | 'contact' | 'lead';
  id: string;
  userRole: string;
}): string[] => {
  // Simplified to prevent timeout issues
  return [];
};

// Utility function to calculate days since a date
const daysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Auto-create tasks based on smart rules
export const createSmartTasks = (triggerType: string, entityId: string, agentId: string): CRMTask[] => {
  const tasks: CRMTask[] = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  switch (triggerType) {
    case 'new_lead':
      tasks.push({
        id: `task_${Date.now()}_1`,
        title: 'Initial contact with new lead',
        description: 'Reach out to new lead within 24 hours',
        type: 'call',
        priority: 'high',
        status: 'pending',
        dueDate: tomorrow.toISOString().split('T')[0],
        contactId: entityId,
        agentId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      break;

    case 'property_negotiation':
      tasks.push({
        id: `task_${Date.now()}_2`,
        title: 'Follow up on negotiation status',
        description: 'Check status of property negotiation and next steps',
        type: 'follow-up',
        priority: 'medium',
        status: 'pending',
        dueDate: tomorrow.toISOString().split('T')[0],
        propertyId: entityId,
        agentId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      break;
  }

  // Save tasks
  if (tasks.length > 0) {
    const existingTasks = JSON.parse(localStorage.getItem(CRM_TASKS_KEY) || '[]');
    localStorage.setItem(CRM_TASKS_KEY, JSON.stringify([...existingTasks, ...tasks]));
  }

  return tasks;
};

// ============================================================================
// LOCATION MANAGEMENT - Cities, Areas, Blocks, Buildings
// ============================================================================

// CITIES
export const getCities = (): City[] => {
  try {
    initializeData();
    const cities = JSON.parse(localStorage.getItem(CITIES_KEY) || '[]');
    return Array.isArray(cities) ? cities : [];
  } catch (error) {
    console.error('Error getting cities:', error);
    return [];
  }
};

export const getActiveCities = (): City[] => {
  return getCities().filter(city => city.isActive);
};

export const getCityById = (id: string): City | null => {
  const cities = getCities();
  return cities.find(city => city.id === id) || null;
};

export const addCity = (city: Omit<City, 'id' | 'createdAt'>): City => {
  initializeData();
  const cities = getCities();

  const newCity: City = {
    ...city,
    id: `city_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  cities.push(newCity);
  localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
  return newCity;
};

export const updateCity = (id: string, updates: Partial<City>): City | null => {
  initializeData();
  const cities = getCities();
  const index = cities.findIndex(city => city.id === id);

  if (index !== -1) {
    cities[index] = { ...cities[index], ...updates };
    localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
    return cities[index];
  }

  return null;
};

export const toggleCityStatus = (id: string): City | null => {
  const city = getCityById(id);
  if (!city) return null;

  return updateCity(id, { isActive: !city.isActive });
};

export const deleteCity = (id: string): boolean => {
  initializeData();

  // Check if city has areas
  const areas = getAreasByCity(id);
  if (areas.length > 0) {
    throw new Error('Cannot delete city with existing areas. Please delete all areas first.');
  }

  const cities = getCities();
  const filtered = cities.filter(city => city.id !== id);

  if (filtered.length === cities.length) {
    return false; // City not found
  }

  localStorage.setItem(CITIES_KEY, JSON.stringify(filtered));
  return true;
};

// AREAS
export const getAreas = (): Area[] => {
  try {
    initializeData();
    const areas = JSON.parse(localStorage.getItem(AREAS_KEY) || '[]');
    return Array.isArray(areas) ? areas : [];
  } catch (error) {
    console.error('Error getting areas:', error);
    return [];
  }
};

export const getAreasByCity = (cityId: string): Area[] => {
  return getAreas().filter(area => area.cityId === cityId);
};

export const getActiveAreasByCity = (cityId: string): Area[] => {
  return getAreasByCity(cityId).filter(area => area.isActive);
};

export const getAreaById = (id: string): Area | null => {
  const areas = getAreas();
  return areas.find(area => area.id === id) || null;
};

export const addArea = (area: Omit<Area, 'id' | 'createdAt'>): Area => {
  initializeData();
  const areas = getAreas();

  const newArea: Area = {
    ...area,
    id: `area_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  areas.push(newArea);
  localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
  return newArea;
};

export const updateArea = (id: string, updates: Partial<Area>): Area | null => {
  initializeData();
  const areas = getAreas();
  const index = areas.findIndex(area => area.id === id);

  if (index !== -1) {
    areas[index] = { ...areas[index], ...updates };
    localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
    return areas[index];
  }

  return null;
};

export const toggleAreaStatus = (id: string): Area | null => {
  const area = getAreaById(id);
  if (!area) return null;

  return updateArea(id, { isActive: !area.isActive });
};

export const deleteArea = (id: string): boolean => {
  initializeData();

  // Check if area has blocks
  const blocks = getBlocksByArea(id);
  if (blocks.length > 0) {
    throw new Error('Cannot delete area with existing blocks. Please delete all blocks first.');
  }

  // Check if area has buildings
  const buildings = getBuildingsByArea(id);
  if (buildings.length > 0) {
    throw new Error('Cannot delete area with existing buildings. Please delete all buildings first.');
  }

  const areas = getAreas();
  const filtered = areas.filter(area => area.id !== id);

  if (filtered.length === areas.length) {
    return false; // Area not found
  }

  localStorage.setItem(AREAS_KEY, JSON.stringify(filtered));
  return true;
};

// BLOCKS
export const getBlocks = (): Block[] => {
  try {
    initializeData();
    const blocks = JSON.parse(localStorage.getItem(BLOCKS_KEY) || '[]');
    return Array.isArray(blocks) ? blocks : [];
  } catch (error) {
    console.error('Error getting blocks:', error);
    return [];
  }
};

export const getBlocksByArea = (areaId: string): Block[] => {
  return getBlocks().filter(block => block.areaId === areaId);
};

export const getActiveBlocksByArea = (areaId: string): Block[] => {
  return getBlocksByArea(areaId).filter(block => block.isActive);
};

export const getBlockById = (id: string): Block | null => {
  const blocks = getBlocks();
  return blocks.find(block => block.id === id) || null;
};

export const addBlock = (block: Omit<Block, 'id' | 'createdAt'>): Block => {
  initializeData();
  const blocks = getBlocks();

  const newBlock: Block = {
    ...block,
    id: `block_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  blocks.push(newBlock);
  localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
  return newBlock;
};

export const updateBlock = (id: string, updates: Partial<Block>): Block | null => {
  initializeData();
  const blocks = getBlocks();
  const index = blocks.findIndex(block => block.id === id);

  if (index !== -1) {
    blocks[index] = { ...blocks[index], ...updates };
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
    return blocks[index];
  }

  return null;
};

export const toggleBlockStatus = (id: string): Block | null => {
  const block = getBlockById(id);
  if (!block) return null;

  return updateBlock(id, { isActive: !block.isActive });
};

export const deleteBlock = (id: string): boolean => {
  initializeData();

  // Check if block has buildings
  const buildings = getBuildings().filter(building => building.blockId === id);
  if (buildings.length > 0) {
    throw new Error('Cannot delete block with existing buildings. Please delete all buildings first.');
  }

  const blocks = getBlocks();
  const filtered = blocks.filter(block => block.id !== id);

  if (filtered.length === blocks.length) {
    return false; // Block not found
  }

  localStorage.setItem(BLOCKS_KEY, JSON.stringify(filtered));
  return true;
};

// BUILDINGS
export const getBuildings = (): Building[] => {
  try {
    initializeData();
    const buildings = JSON.parse(localStorage.getItem(BUILDINGS_KEY) || '[]');
    return Array.isArray(buildings) ? buildings : [];
  } catch (error) {
    console.error('Error getting buildings:', error);
    return [];
  }
};

export const getBuildingsByArea = (areaId: string, blockId?: string): Building[] => {
  const buildings = getBuildings().filter(building => building.areaId === areaId);

  if (blockId) {
    return buildings.filter(building => building.blockId === blockId);
  }

  return buildings;
};

export const getActiveBuildingsByArea = (areaId: string, blockId?: string): Building[] => {
  return getBuildingsByArea(areaId, blockId).filter(building => building.isActive);
};

export const getBuildingById = (id: string): Building | null => {
  const buildings = getBuildings();
  return buildings.find(building => building.id === id) || null;
};

export const addBuilding = (building: Omit<Building, 'id' | 'createdAt'>): Building => {
  initializeData();
  const buildings = getBuildings();

  const newBuilding: Building = {
    ...building,
    id: `building_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  buildings.push(newBuilding);
  localStorage.setItem(BUILDINGS_KEY, JSON.stringify(buildings));
  return newBuilding;
};

export const updateBuilding = (id: string, updates: Partial<Building>): Building | null => {
  initializeData();
  const buildings = getBuildings();
  const index = buildings.findIndex(building => building.id === id);

  if (index !== -1) {
    buildings[index] = { ...buildings[index], ...updates };
    localStorage.setItem(BUILDINGS_KEY, JSON.stringify(buildings));
    return buildings[index];
  }

  return null;
};

export const toggleBuildingStatus = (id: string): Building | null => {
  const building = getBuildingById(id);
  if (!building) return null;

  return updateBuilding(id, { isActive: !building.isActive });
};

export const deleteBuilding = (id: string): boolean => {
  initializeData();

  // TODO: Check if building has properties
  // This will be implemented when we update property form

  const buildings = getBuildings();
  const filtered = buildings.filter(building => building.id !== id);

  if (filtered.length === buildings.length) {
    return false; // Building not found
  }

  localStorage.setItem(BUILDINGS_KEY, JSON.stringify(filtered));
  return true;
};

// ============================================================================
// JOURNAL ENTRIES - Double Entry Accounting
// ============================================================================

export const getJournalEntries = (agentId?: string, userRole?: string): JournalEntry[] => {
  try {
    initializeData();
    const entries = JSON.parse(localStorage.getItem(JOURNAL_ENTRIES_KEY) || '[]');

    if (!Array.isArray(entries)) {
      console.error('Journal entries data is not an array, returning empty array');
      return [];
    }

    if (userRole === 'admin') {
      return entries;
    }

    if (agentId) {
      return entries.filter((e: JournalEntry) => e.createdBy === agentId);
    }

    return entries;
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
};

export const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>): JournalEntry => {
  initializeData();
  const entries = getJournalEntries();

  const newEntry: JournalEntry = {
    ...entry,
    id: `JE-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  entries.push(newEntry);
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
  return newEntry;
};

export const reverseJournalEntry = (entryId: string, userId: string): JournalEntry | null => {
  try {
    const entries = getJournalEntries();
    const originalEntry = entries.find(e => e.id === entryId);

    if (!originalEntry) {
      console.error('Journal entry not found:', entryId);
      return null;
    }

    // Create reversal entry (swap debit and credit)
    const reversalEntry: JournalEntry = {
      id: `JE-${Date.now()}-REV`,
      date: new Date().toISOString().split('T')[0],
      description: `REVERSAL: ${originalEntry.description}`,
      debitAccount: originalEntry.creditAccount,
      creditAccount: originalEntry.debitAccount,
      amount: originalEntry.amount,
      reference: `Reverses ${originalEntry.id}`,
      status: 'posted',
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    entries.push(reversalEntry);
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));

    return reversalEntry;
  } catch (error) {
    console.error('Error reversing journal entry:', error);
    return null;
  }
};