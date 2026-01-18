// ============================================
// USER TYPES
// ============================================

/**
 * User type for authentication and user management
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  avatar?: string;
  contactNumber?: string;
}

export type UserRole = 'admin' | 'agent' | 'manager';

// ============================================
// CORE ENTITIES (Property, Contact, Cycles)
// ============================================

export type { Property, PropertyType, PropertyStatus, AreaUnit } from './properties';
export * from './contacts';
export * from './cycles';
export * from './requirements';
export * from './transactions';
export * from './financials';

// ============================================
// MODULE TYPES
// ============================================

export * from './accounting';
export * from './crm';
export * from './custom-reports';
export * from './deals';
export * from './documents';
export * from './leads';
export * from './leadsIntegration';
export * from './locations';
export * from './notifications';
export * from './paymentSchedule';
export * from './report-history';
export * from './reports';
export * from './saas';
export * from './tasks';

// SHARING - avoid conflicts with deals.ts
export type {
  AccessLevel,
  CycleType,
  RequirementType,
  ShareLevel,
  PropertyMatch,
  MatchDetails,
  SharingSettings,
  PrivacySettings,
  CollaborationData,
  ShareEvent,
  Inquiry,
  AccessContext,
  PermissionCheck,
  SellCycleSharing,
  RentCycleSharing,
  BuyerRequirementMatching,
  RentRequirementMatching,
  OfferCrossAgentTracking
} from './sharing';