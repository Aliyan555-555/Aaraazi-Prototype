# aaraazi System Architecture & Integration Guide

**Complete Technical Architecture & Module Orchestration**  
**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Type**: Technical Architecture Documentation

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Layer Architecture](#data-layer-architecture)
7. [Module Interconnections](#module-interconnections)
8. [Data Flow & Orchestration](#data-flow--orchestration)
9. [API Architecture](#api-architecture)
10. [State Management](#state-management)
11. [Component Hierarchy](#component-hierarchy)
12. [Integration Points](#integration-points)
13. [Entity Relationships](#entity-relationships)
14. [Cross-Module Communication](#cross-module-communication)
15. [Business Logic Flow](#business-logic-flow)
16. [Security Architecture](#security-architecture)
17. [Performance & Optimization](#performance--optimization)
18. [Deployment Architecture](#deployment-architecture)

---

## Executive Summary

### What This Document Covers

This document provides a **complete technical blueprint** of the aaraazi real estate management platform, explaining how all components, modules, and features work together as a cohesive system.

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                    AARAAZI PLATFORM                 │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   FRONTEND   │  │   BACKEND    │  │ DATABASE │ │
│  │   (React)    │◄─┤  (Services)  │◄─┤(LocalDB) │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                  │                │       │
│         └──────────────────┴────────────────┘       │
│                    DATA FLOW                        │
│                                                     │
│  11 Modules • 350+ Components • 80+ Services        │
│  Real-time Updates • Persistent Storage             │
└─────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Component-Based Architecture** - Modular, reusable components
2. **Single Source of Truth** - Centralized data management
3. **Unidirectional Data Flow** - Predictable state updates
4. **Separation of Concerns** - Clear boundaries between layers
5. **Entity-Centric Design** - Data models reflect real-world entities

---

## System Architecture Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        USER LAYER                        │
│  Browser (Chrome, Firefox, Safari, Edge)                 │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  ┌────────────────────────────────────────────────┐     │
│  │ React Components (350+)                        │     │
│  │ - Workspace Components (Grid/List/Kanban)      │     │
│  │ - Detail Page Components                       │     │
│  │ - Form Components                              │     │
│  │ - UI Components (Shadcn)                       │     │
│  └────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────┐     │
│  │ State Management (React Hooks)                 │     │
│  │ - useState (Local state)                       │     │
│  │ - useEffect (Side effects)                     │     │
│  │ - Custom hooks (Business logic)                │     │
│  └────────────────────────────────────────────────┘     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                  │
│  ┌────────────────────────────────────────────────┐     │
│  │ Service Layer (/lib/*.ts - 80+ files)          │     │
│  │ - Properties Service                           │     │
│  │ - Transactions Service                         │     │
│  │ - Leads Service                                │     │
│  │ - Contacts Service                             │     │
│  │ - Deals Service                                │     │
│  │ - Financials Service                           │     │
│  │ - Portfolio Service                            │     │
│  │ - Reports Service                              │     │
│  │ - Tasks Service                                │     │
│  │ - Sharing Service                              │     │
│  │ - Dashboard Service                            │     │
│  └────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────┐     │
│  │ Utility Layer                                  │     │
│  │ - Validation (formValidation.ts)               │     │
│  │ - Currency (currency.ts)                       │     │
│  │ - Date Utils (utils.ts)                        │     │
│  │ - Math Utils (mathUtils.ts)                    │     │
│  └────────────────────────────────────────────────┘     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ Data Service (dataService.ts)                  │     │
│  │ - CRUD Operations                              │     │
│  │ - Data Validation                              │     │
│  │ - Entity Management                            │     │
│  └────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────┐     │
│  │ Storage Layer (storage.ts)                     │     │
│  │ - localStorage Interface                       │     │
│  │ - Data Persistence                             │     │
│  │ - Migration Support                            │     │
│  └────────────────────────────────────────────────┘     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                     │
│  ┌────────────────────────────────────────────────┐     │
│  │ Browser localStorage (Client-Side Database)    │     │
│  │ - Properties Data                              │     │
│  │ - Transactions Data                            │     │
│  │ - Leads Data                                   │     │
│  │ - Contacts Data                                │     │
│  │ - Deals Data                                   │     │
│  │ - Financials Data                              │     │
│  │ - Portfolio Data                               │     │
│  │ - User Settings                                │     │
│  │ - Application State                            │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Architecture Layers Explained

#### 1. User Layer
- **What**: Browser interface where users interact
- **Technology**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Responsibility**: Rendering UI, capturing user input
- **Communication**: HTTP requests to presentation layer

#### 2. Presentation Layer
- **What**: React-based UI components
- **Technology**: React 18+, TypeScript, Tailwind CSS
- **Responsibility**: Display data, capture user actions, local state management
- **Communication**: Calls to business logic layer

#### 3. Business Logic Layer
- **What**: Core application logic and rules
- **Technology**: TypeScript services and utilities
- **Responsibility**: Business rules, calculations, validations
- **Communication**: Calls to data layer

#### 4. Data Layer
- **What**: Data access and management
- **Technology**: TypeScript data services
- **Responsibility**: CRUD operations, data transformation
- **Communication**: Calls to persistence layer

#### 5. Persistence Layer
- **What**: Data storage
- **Technology**: Browser localStorage
- **Responsibility**: Persistent data storage
- **Communication**: Read/write operations

---

## Technology Stack

### Frontend Stack

```
┌─────────────────────────────────────────┐
│ FRONTEND TECHNOLOGY STACK               │
├─────────────────────────────────────────┤
│ Core Framework                          │
│ • React 18.x                            │
│ • TypeScript 5.x                        │
│                                         │
│ UI Framework                            │
│ • Tailwind CSS 4.0                      │
│ • Shadcn UI Components                  │
│                                         │
│ State Management                        │
│ • React Hooks (useState, useEffect)     │
│ • Custom Hooks                          │
│ • Context API (when needed)             │
│                                         │
│ Routing                                 │
│ • Client-side routing (manual)          │
│ • Navigation service                    │
│                                         │
│ Form Handling                           │
│ • React Hook Form 7.55.0                │
│ • Custom validation                     │
│                                         │
│ Icons & Assets                          │
│ • Lucide React (icons)                  │
│ • Custom SVG components                 │
│                                         │
│ Charts & Visualization                  │
│ • Recharts (charts/graphs)              │
│                                         │
│ Notifications                           │
│ • Sonner (toast notifications)          │
│                                         │
│ Build Tool                              │
│ • Vite                                  │
└─────────────────────────────────────────┘
```

### Backend/Service Stack

```
┌─────────────────────────────────────────┐
│ BACKEND/SERVICE TECHNOLOGY STACK        │
├─────────────────────────────────────────┤
│ Language                                │
│ • TypeScript 5.x                        │
│                                         │
│ Data Storage                            │
│ • localStorage (Browser-based)          │
│ • JSON data structure                   │
│                                         │
│ Business Logic                          │
│ • 80+ TypeScript service files          │
│ • Pure functions                        │
│ • Immutable data patterns               │
│                                         │
│ Utilities                               │
│ • Date manipulation                     │
│ • Currency formatting (PKR)             │
│ • Validation functions                  │
│ • Mathematical calculations             │
│                                         │
│ Type System                             │
│ • 15+ TypeScript type definition files  │
│ • Strict type checking                  │
│ • Interface-based design                │
└─────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Structure

```
/components
│
├── /ui (Shadcn UI Components - 30+ files)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── form.tsx
│   ├── card.tsx
│   └── ... (25+ more)
│
├── /layout (Layout Components - 20+ files)
│   ├── PageHeader.tsx
│   ├── ConnectedEntitiesBar.tsx
│   ├── MetricCard.tsx
│   ├── StatusBadge.tsx
│   ├── StatusTimeline.tsx
│   ├── DetailPageTemplate.tsx
│   └── ... (14+ more)
│
├── /workspace (Workspace Components - 15+ files)
│   ├── WorkspaceHeader.tsx
│   ├── WorkspaceSearchBar.tsx
│   ├── WorkspaceEmptyState.tsx
│   ├── WorkspacePageTemplate.tsx
│   ├── /cards
│   │   ├── WorkspaceCard.tsx
│   │   └── WorkspaceKanbanCard.tsx
│   ├── /views
│   │   ├── WorkspaceGridView.tsx
│   │   ├── WorkspaceTableView.tsx
│   │   └── WorkspaceKanbanView.tsx
│   └── ...
│
├── /dashboard (Dashboard Components - 20+ files)
│   ├── DashboardV4.tsx
│   ├── /components
│   │   ├── DashboardMetricCard.tsx
│   │   ├── InsightCard.tsx
│   │   ├── ActionItem.tsx
│   │   └── ...
│   ├── /sections
│   │   ├── HeroSection.tsx
│   │   ├── IntelligencePanelSection.tsx
│   │   ├── ActionCenterSection.tsx
│   │   └── ...
│   ├── /hooks
│   │   ├── useDashboardData.ts
│   │   ├── useInsightsData.ts
│   │   └── ...
│   └── /utils
│       ├── detectInsights.ts
│       ├── detectActions.ts
│       └── ...
│
├── /properties (Properties Module - 10+ files)
│   ├── PropertiesWorkspaceV4.tsx
│   ├── PropertyDetailsV4.tsx
│   ├── PropertyWorkspaceCard.tsx
│   ├── PropertyFormModal.tsx
│   └── ...
│
├── /contacts (Contacts Module - 15+ files)
│   ├── ContactsWorkspaceV4.tsx
│   ├── ContactDetailsV4.tsx
│   ├── ContactWorkspaceCard.tsx
│   ├── ContactFormModal.tsx
│   ├── InteractionForm.tsx
│   └── ...
│
├── /leads (Leads Module - 12+ files)
│   ├── LeadWorkspaceV4.tsx
│   ├── LeadDetailsV4.tsx
│   ├── LeadWorkspaceCard.tsx
│   ├── LeadFormModal.tsx
│   └── ...
│
├── /deals (Deals Module - 15+ files)
│   ├── DealsWorkspaceV4.tsx
│   ├── DealDetailsV4.tsx
│   ├── DealWorkspaceCard.tsx
│   ├── DealFormModal.tsx
│   ├── OfferForm.tsx
│   └── ...
│
├── /sell-cycles (Sell Cycles - 8+ files)
│   ├── SellCyclesWorkspaceV4.tsx
│   ├── SellCycleDetailsV4.tsx
│   ├── SellCycleWorkspaceCard.tsx
│   └── ...
│
├── /purchase-cycles (Purchase Cycles - 8+ files)
│   ├── PurchaseCyclesWorkspaceV4.tsx
│   ├── PurchaseCycleDetailsV4.tsx
│   └── ...
│
├── /rent-cycles (Rent Cycles - 8+ files)
│   ├── RentCyclesWorkspaceV4.tsx
│   ├── RentCycleDetailsV4.tsx
│   └── ...
│
├── /tasks (Tasks Module - 12+ files)
│   ├── TasksWorkspaceV4.tsx
│   ├── TaskDetailsV4.tsx
│   ├── TaskWorkspaceCard.tsx
│   └── ...
│
├── /reports (Reports Module - 10+ files)
│   ├── ReportsHub.tsx
│   ├── ReportViewer.tsx
│   ├── CustomReportBuilder.tsx
│   └── ...
│
└── /figma (Protected System Components)
    └── ImageWithFallback.tsx
```

### Component Hierarchy

```
App.tsx (Root Component)
│
├── Navigation System
│   ├── Sidebar Navigation
│   ├── Top Bar
│   └── User Menu
│
├── Module Router (Manual Routing)
│   │
│   ├── Dashboard Module
│   │   └── DashboardV4
│   │       ├── HeroSection
│   │       ├── IntelligencePanelSection
│   │       ├── ActionCenterSection
│   │       ├── PerformancePulseSection
│   │       └── QuickLaunchSection
│   │
│   ├── Properties Module
│   │   ├── PropertiesWorkspaceV4 (List View)
│   │   │   ├── WorkspaceHeader
│   │   │   ├── WorkspaceSearchBar
│   │   │   ├── WorkspaceGridView / WorkspaceTableView
│   │   │   │   └── PropertyWorkspaceCard (x N)
│   │   │   └── WorkspaceFooter
│   │   │
│   │   └── PropertyDetailsV4 (Detail View)
│   │       ├── PageHeader
│   │       ├── ConnectedEntitiesBar
│   │       ├── Tabs
│   │       │   ├── Overview Tab
│   │       │   ├── Photos Tab
│   │       │   ├── Documents Tab
│   │       │   ├── Transactions Tab
│   │       │   └── Timeline Tab
│   │       └── QuickActionsPanel
│   │
│   ├── Contacts Module
│   │   ├── ContactsWorkspaceV4
│   │   └── ContactDetailsV4
│   │
│   ├── Leads Module
│   │   ├── LeadWorkspaceV4
│   │   └── LeadDetailsV4
│   │
│   ├── Deals Module
│   │   ├── DealsWorkspaceV4
│   │   └── DealDetailsV4
│   │
│   ├── Transactions Module
│   │   ├── SellCyclesWorkspaceV4
│   │   ├── PurchaseCyclesWorkspaceV4
│   │   ├── RentCyclesWorkspaceV4
│   │   ├── SellCycleDetailsV4
│   │   ├── PurchaseCycleDetailsV4
│   │   └── RentCycleDetailsV4
│   │
│   ├── Tasks Module
│   │   ├── TasksWorkspaceV4
│   │   └── TaskDetailsV4
│   │
│   ├── Reports Module
│   │   ├── ReportsHub
│   │   └── ReportViewer
│   │
│   └── ... (Other modules)
│
└── Global Modals & Overlays
    ├── Property Form Modal
    ├── Contact Form Modal
    ├── Lead Form Modal
    ├── Deal Form Modal
    ├── Task Form Modal
    └── Notification System
```

---

## Backend Architecture

### Service Layer Organization

```
/lib (Business Logic Services - 80+ files)
│
├── Core Entity Services
│   ├── properties.ts (Property management)
│   ├── contacts.ts (Contact management)
│   ├── leads.ts (Lead management)
│   ├── leadsV4.ts (Enhanced lead features)
│   ├── deals.ts (Deal management)
│   ├── transactions.ts (Transaction core)
│   ├── sellCycle.ts (Sell cycle logic)
│   ├── purchaseCycle.ts (Purchase cycle logic)
│   ├── rentCycle.ts (Rent cycle logic)
│   ├── buyCycle.ts (Buy cycle logic)
│   ├── tasks.ts (Task management)
│   └── portfolio.ts (Portfolio management)
│
├── Relationship Services
│   ├── ownership.ts (Ownership tracking)
│   ├── cycleManager.ts (Cycle orchestration)
│   ├── dealSync.ts (Deal synchronization)
│   ├── propertyStatusSync.ts (Status sync)
│   └── sharingPermissions.ts (Sharing system)
│
├── Financial Services
│   ├── accounting.ts (Accounting logic)
│   ├── agencyFinancials.ts (Agency finances)
│   ├── agencyTransactions.ts (Agency transactions)
│   ├── agentPerformance.ts (Performance metrics)
│   ├── commissionAgents.ts (Commission tracking)
│   ├── commissionReporting.ts (Commission reports)
│   ├── dealPayments.ts (Payment handling)
│   ├── payments.ts (Payment core)
│   ├── installments.ts (Installment plans)
│   ├── paymentSchedule.ts (Schedules)
│   ├── budgeting.ts (Budget management)
│   ├── budget-versioning.ts (Budget versions)
│   └── investorTransactions.ts (Investor finances)
│
├── Investor & Syndication Services
│   ├── investors.ts (Investor management)
│   ├── investorIntegration.ts (Integration)
│   ├── multiInvestorPurchase.ts (Syndication)
│   ├── saleDistribution.ts (Profit distribution)
│   └── farming.ts (Farming logic)
│
├── Requirements & Matching Services
│   ├── buyerRequirements.ts (Buyer requirements)
│   ├── rentRequirements.ts (Rent requirements)
│   ├── propertyMatching.ts (Property matching)
│   ├── smartMatching.ts (Smart algorithms)
│   └── testMatching.ts (Matching tests)
│
├── Lead Management Services
│   ├── leadConversion.ts (Conversion tracking)
│   ├── leadScoring.ts (Lead scoring)
│   └── leadUtils.ts (Lead utilities)
│
├── Deal Services
│   ├── dealValidation.ts (Deal validation)
│   ├── dealPermissions.ts (Permissions)
│   ├── crossAgentDeals.ts (Cross-agent)
│   └── offers.ts (Offer management)
│
├── Document Services
│   ├── documents.ts (Document management)
│   ├── documentTemplates.ts (Templates)
│   └── receiptGeneration.ts (Receipt gen)
│
├── Project Services
│   ├── projects.ts (Project management)
│   ├── landAcquisition.ts (Land acquisition)
│   ├── grn.ts (GRN management)
│   └── inventory.ts (Inventory tracking)
│
├── Reporting Services
│   ├── reports.ts (Report core)
│   ├── reportTemplates.ts (Templates)
│   ├── reportFieldConfig.ts (Configuration)
│   ├── reportExport.ts (Export logic)
│   ├── report-export.ts (Enhanced export)
│   ├── report-distribution.ts (Distribution)
│   ├── report-history.ts (History)
│   ├── report-sharing.ts (Sharing)
│   └── custom-report-builder.ts (Builder)
│
├── Analytics Services
│   ├── propertyAnalytics.ts (Property analytics)
│   ├── marketTrends.ts (Market analysis)
│   ├── performance.ts (Performance tracking)
│   └── dashboardData.ts (Dashboard data)
│
├── Utility Services
│   ├── validation.ts (General validation)
│   ├── formValidation.ts (Form validation)
│   ├── currency.ts (PKR formatting)
│   ├── areaUnits.ts (Area calculations)
│   ├── utils.ts (General utilities)
│   ├── mathUtils.ts (Math functions)
│   ├── exportUtils.ts (Export utilities)
│   └── pdfExport.ts (PDF generation)
│
├── Integration Services
│   ├── notificationIntegration.ts (Notifications)
│   ├── notifications.ts (Notification core)
│   └── keyboardShortcuts.ts (Shortcuts)
│
├── User & Auth Services
│   ├── auth.ts (Authentication)
│   ├── userProfile.ts (User profiles)
│   ├── userSettings.ts (User settings)
│   └── saas.ts (SaaS features)
│
├── Data Services
│   ├── data.ts (Data storage keys)
│   ├── dataService.ts (CRUD operations)
│   ├── storage.ts (Storage interface)
│   ├── migration.ts (Data migration)
│   ├── seedLocations.ts (Seed data)
│   ├── testData.ts (Test data)
│   └── testUtils.ts (Test utilities)
│
├── Advanced Features
│   ├── autoSave.ts (Auto-save)
│   ├── taskAutomation Helper.ts (Task automation)
│   ├── phase3Enhancements.ts (Phase 3 features)
│   ├── fixAgencyOwnership.ts (Ownership fixes)
│   ├── propertyStatusMigration.ts (Status migration)
│   ├── e2eTests.ts (End-to-end tests)
│   └── transaction-graph.ts (Transaction graph)
│
├── Navigation & Config
│   ├── navigation.ts (Navigation service)
│   ├── config.ts (Configuration)
│   ├── chartColors.ts (Chart colors)
│   └── logger.ts (Logging)
│
└── Security & Error Handling
    ├── security.ts (Security functions)
    └── errorReporting.ts (Error handling)
```

### Service Patterns

**CRUD Pattern**:
```typescript
// Example: properties.ts

// Create
export function createProperty(property: Property): Property {
  const newProperty = {
    id: generateId(),
    ...property,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const properties = getProperties();
  properties.push(newProperty);
  saveProperties(properties);
  
  return newProperty;
}

// Read
export function getProperty(id: string): Property | undefined {
  const properties = getProperties();
  return properties.find(p => p.id === id);
}

// Update
export function updateProperty(id: string, updates: Partial<Property>): Property {
  const properties = getProperties();
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) throw new Error('Property not found');
  
  properties[index] = {
    ...properties[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveProperties(properties);
  return properties[index];
}

// Delete
export function deleteProperty(id: string): void {
  const properties = getProperties();
  const filtered = properties.filter(p => p.id !== id);
  saveProperties(filtered);
}
```

---

## Data Layer Architecture

### Data Storage Keys

```typescript
// From /lib/data.ts

export const STORAGE_KEYS = {
  // Core Entities
  PROPERTIES: 'aaraazi_properties',
  CONTACTS: 'aaraazi_contacts',
  LEADS: 'aaraazi_leads',
  DEALS: 'aaraazi_deals',
  
  // Transactions
  SELL_CYCLES: 'aaraazi_sell_cycles',
  PURCHASE_CYCLES: 'aaraazi_purchase_cycles',
  RENT_CYCLES: 'aaraazi_rent_cycles',
  
  // Requirements
  BUYER_REQUIREMENTS: 'aaraazi_buyer_requirements',
  RENT_REQUIREMENTS: 'aaraazi_rent_requirements',
  
  // Tasks & Activities
  TASKS: 'aaraazi_tasks',
  ACTIVITIES: 'aaraazi_activities',
  
  // Financial
  COMMISSION: 'aaraazi_commission',
  PAYMENTS: 'aaraazi_payments',
  EXPENSES: 'aaraazi_expenses',
  
  // Investors & Portfolio
  INVESTORS: 'aaraazi_investors',
  SYNDICATES: 'aaraazi_syndicates',
  PORTFOLIO: 'aaraazi_portfolio',
  
  // Documents
  DOCUMENTS: 'aaraazi_documents',
  
  // Reports
  REPORTS: 'aaraazi_reports',
  REPORT_TEMPLATES: 'aaraazi_report_templates',
  
  // User & Settings
  USER: 'aaraazi_user',
  USER_SETTINGS: 'aaraazi_user_settings',
  AGENCY_SETTINGS: 'aaraazi_agency_settings',
  
  // Sharing
  SHARED_ITEMS: 'aaraazi_shared_items',
  PERMISSIONS: 'aaraazi_permissions',
  
  // System
  APP_VERSION: 'aaraazi_version',
  MIGRATION_STATUS: 'aaraazi_migration_status'
};
```

### Data Models

```typescript
// Core Entity Models

// Property Model
interface Property {
  id: string;
  title: string;
  address: string;
  type: PropertyType;
  subType: string;
  price: number;
  area: number;
  areaUnit: 'sqyd' | 'sqft' | 'sqm';
  bedrooms?: number;
  bathrooms?: number;
  status: PropertyStatus;
  acquisitionType: 'inventory' | 'client-listing' | 'syndication';
  currentOwnerId?: string;
  ownershipHistory: OwnershipRecord[];
  agentId: string;
  photos: string[];
  features: string[];
  description: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Model
interface Contact {
  id: string;
  type: ContactType; // buyer, seller, investor, agent, vendor, partner, tenant, other
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: Address;
  tags: string[];
  notes: string;
  source: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

// Lead Model
interface Lead {
  id: string;
  contactId: string;
  stage: LeadStage; // new, contacted, qualified, negotiation, closed
  score: number; // 0-100
  budget: { min: number; max: number };
  timeline: string;
  motivation: number; // 1-10
  interestedProperties: string[];
  source: string;
  followUpSchedule: FollowUpTask[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

// Deal Model
interface Deal {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  buyerAgentId: string;
  sellerAgentId: string;
  stage: DealStage; // new, active, negotiation, accepted, lost, converted
  offers: Offer[];
  agreedPrice?: number;
  commissionBuyer: number;
  commissionSeller: number;
  isDualAgent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transaction Models (Sell/Purchase/Rent Cycles)
interface SellCycle {
  id: string;
  propertyId: string;
  sellerId: string;
  agentId: string;
  stage: SellCycleStage; // 1-7
  agreedPrice: number;
  commission: number;
  commissionRate: number;
  paymentSchedule?: PaymentSchedule;
  documents: string[];
  activities: Activity[];
  createdAt: string;
  completedAt?: string;
}

// ... Similar for PurchaseCycle and RentCycle

// Task Model
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  relatedTo?: {
    entityType: string;
    entityId: string;
  };
  createdAt: string;
  completedAt?: string;
}
```

---

## Module Interconnections

### Module Dependency Graph

```
┌──────────────────────────────────────────────────────┐
│              MODULE INTERCONNECTIONS                 │
└──────────────────────────────────────────────────────┘

PROPERTIES (Core)
    │
    ├──→ CONTACTS (Owners, Agents)
    ├──→ SELL CYCLES (When selling)
    ├──→ PURCHASE CYCLES (When buying)
    ├──→ RENT CYCLES (When renting)
    ├──→ DEALS (Interested buyers)
    ├──→ LEADS (Property interests)
    ├──→ PORTFOLIO (If syndication)
    ├──→ DOCUMENTS (Property docs)
    └──→ FINANCIALS (Property costs/revenue)

CONTACTS (Core)
    │
    ├──→ LEADS (Contact becomes lead)
    ├──→ DEALS (Contact in deal)
    ├──→ PROPERTIES (Owner/Agent)
    ├──→ TRANSACTIONS (Buyer/Seller)
    ├──→ PORTFOLIO (Investor)
    ├──→ TASKS (Follow-ups)
    └──→ DOCUMENTS (Contact docs)

LEADS (Pipeline)
    │
    ├──→ CONTACTS (Lead source)
    ├──→ PROPERTIES (Interested properties)
    ├──→ DEALS (Converts to deal)
    ├──→ TASKS (Follow-up tasks)
    └──→ REPORTS (Conversion tracking)

DEALS (Negotiation)
    │
    ├──→ PROPERTIES (Subject property)
    ├──→ CONTACTS (Buyer, Seller)
    ├──→ LEADS (Source lead)
    ├──→ SELL CYCLES (Creates when accepted)
    ├──→ PURCHASE CYCLES (Creates when accepted)
    ├──→ DOCUMENTS (Offers, agreements)
    └──→ FINANCIALS (Commission tracking)

TRANSACTIONS (Sell/Purchase/Rent Cycles)
    │
    ├──→ PROPERTIES (Subject property)
    ├──→ CONTACTS (Parties involved)
    ├──→ DEALS (Source deal)
    ├──→ DOCUMENTS (Transaction docs)
    ├──→ FINANCIALS (Payments, commission)
    ├──→ TASKS (Stage-based tasks)
    └──→ OWNERSHIP (Updates ownership)

FINANCIALS (Money)
    │
    ├──→ TRANSACTIONS (Commission source)
    ├──→ PROPERTIES (Property costs/income)
    ├──→ PORTFOLIO (Investment tracking)
    ├──→ CONTACTS (Agents, Vendors)
    └──→ REPORTS (Financial reports)

PORTFOLIO (Investments)
    │
    ├──→ PROPERTIES (Portfolio properties)
    ├──→ CONTACTS (Investors)
    ├──→ PURCHASE CYCLES (Acquisitions)
    ├──→ SELL CYCLES (Exits)
    ├──→ FINANCIALS (ROI tracking)
    └──→ REPORTS (Portfolio reports)

TASKS (Activities)
    │
    ├──→ ALL MODULES (Related to any entity)
    ├──→ CONTACTS (Follow-ups)
    ├──→ LEADS (Follow-up schedule)
    ├──→ DEALS (Deal tasks)
    └──→ TRANSACTIONS (Stage tasks)

REPORTS (Analytics)
    │
    ├──→ ALL MODULES (Data source)
    └──→ Aggregates data from everywhere

DASHBOARD (Overview)
    │
    ├──→ ALL MODULES (Data source)
    ├──→ TASKS (Action items)
    └──→ REPORTS (Key metrics)

SHARING (Collaboration)
    │
    └──→ ALL MODULES (Any entity shareable)
```

---

## Data Flow & Orchestration

### Example: Complete Property Sale Flow

```
USER ACTION: Agent adds new property
    │
    ▼
┌─────────────────────────────────────┐
│ 1. PROPERTY CREATION                │
└─────────────────────────────────────┘
    │
    │ Component: PropertyFormModal
    │ User fills: Title, Price, Type, Location, etc.
    │ Clicks: "Add Property"
    │
    ▼
┌─────────────────────────────────────┐
│ 2. VALIDATION                       │
└─────────────────────────────────────┘
    │
    │ Service: formValidation.ts
    │ Validates: Required fields, data types, ranges
    │ If invalid: Show error, stop
    │ If valid: Continue
    │
    ▼
┌─────────────────────────────────────┐
│ 3. CREATE PROPERTY ENTITY           │
└─────────────────────────────────────┘
    │
    │ Service: properties.ts → createProperty()
    │ Generates: Unique ID
    │ Sets: createdAt, updatedAt, status='available'
    │ Sets: agentId (current user)
    │
    ▼
┌─────────────────────────────────────┐
│ 4. SAVE TO STORAGE                  │
└─────────────────────────────────────┘
    │
    │ Service: dataService.ts → saveEntity()
    │ Retrieves: Existing properties from localStorage
    │ Adds: New property to array
    │ Saves: Updated array to localStorage
    │ Key: STORAGE_KEYS.PROPERTIES
    │
    ▼
┌─────────────────────────────────────┐
│ 5. UPDATE UI                        │
└─────────────────────────────────────┘
    │
    │ Component: PropertiesWorkspaceV4
    │ Re-fetches: Properties list
    │ Re-renders: Grid/List view
    │ Shows: Success notification (Sonner)
    │ Closes: Modal
    │
    ▼
═══════════════════════════════════════
USER ACTION: Lead Sara interested in property
    │
    ▼
┌─────────────────────────────────────┐
│ 6. LEAD CREATION                    │
└─────────────────────────────────────┘
    │
    │ Component: LeadFormModal
    │ User: Links to Sara (Contact)
    │ User: Links to Property
    │ User: Sets budget, timeline
    │
    ▼
┌─────────────────────────────────────┐
│ 7. LEAD SCORING                     │
└─────────────────────────────────────┘
    │
    │ Service: leadScoring.ts → calculateScore()
    │ Factors: Budget match, Timeline, Pre-approval
    │ Calculates: Score (0-100)
    │ Result: Score = 85 (HOT lead)
    │
    ▼
┌─────────────────────────────────────┐
│ 8. AUTO-CREATE FOLLOW-UP TASKS     │
└─────────────────────────────────────┘
    │
    │ Service: leadUtils.ts → create21DaySchedule()
    │ Creates: Tasks for Day 2, 4, 7, 14, 21
    │ Links: Tasks to Lead
    │ Saves: Tasks to storage
    │
    ▼
┌─────────────────────────────────────┐
│ 9. UPDATE PROPERTY                  │
└─────────────────────────────────────┘
    │
    │ Service: propertyMatching.ts → linkLeadToProperty()
    │ Updates: Property.interestedLeads[]
    │ Adds: Lead ID to property
    │
    ▼
═══════════════════════════════════════
USER ACTION: Sara makes offer
    │
    ▼
┌─────────────────────────────────────┐
│ 10. DEAL CREATION                   │
└─────────────────────────────────────┘
    │
    │ Component: DealFormModal
    │ Auto-fills: Property, Buyer (Sara), Seller
    │ User: Sets offer price
    │ Creates: Deal entity
    │
    ▼
┌─────────────────────────────────────┐
│ 11. UPDATE LEAD                     │
└─────────────────────────────────────┘
    │
    │ Service: leadConversion.ts → convertToDeal()
    │ Updates: Lead.stage = 'negotiation'
    │ Links: Lead.dealId = new deal
    │
    ▼
┌─────────────────────────────────────┐
│ 12. UPDATE PROPERTY                 │
└─────────────────────────────────────┘
    │
    │ Service: propertyStatusSync.ts → updateStatus()
    │ Updates: Property.status = 'under-offer'
    │
    ▼
═══════════════════════════════════════
USER ACTION: Offer accepted
    │
    ▼
┌─────────────────────────────────────┐
│ 13. UPDATE DEAL                     │
└─────────────────────────────────────┘
    │
    │ Component: DealDetailsV4
    │ User: Clicks "Accept Offer"
    │ Updates: Deal.stage = 'accepted'
    │
    ▼
┌─────────────────────────────────────┐
│ 14. CREATE SELL CYCLE               │
└─────────────────────────────────────┘
    │
    │ Service: dealSync.ts → createCycleFromDeal()
    │ Creates: SellCycle from deal data
    │ Sets: Stage 1 (Listing)
    │ Calculates: Commission
    │ Links: SellCycle.dealId
    │
    ▼
┌─────────────────────────────────────┐
│ 15. CREATE PURCHASE CYCLE (if applicable)│
└─────────────────────────────────────┘
    │
    │ Service: purchaseCycle.ts → createPurchaseCycle()
    │ Creates: PurchaseCycle for buyer
    │ Links: To same property
    │
    ▼
┌─────────────────────────────────────┐
│ 16. AUTO-CREATE STAGE TASKS         │
└─────────────────────────────────────┘
    │
    │ Service: cycleManager.ts → createStageTasks()
    │ Creates: Tasks for each cycle stage
    │ Example: "Prepare agreement" (Stage 5)
    │
    ▼
┌─────────────────────────────────────┐
│ 17. UPDATE PROPERTY                 │
└─────────────────────────────────────┘
    │
    │ Updates: Property.status = 'sold' (when complete)
    │
    ▼
═══════════════════════════════════════
USER ACTION: Complete sale
    │
    ▼
┌─────────────────────────────────────┐
│ 18. COMPLETE SELL CYCLE             │
└─────────────────────────────────────┘
    │
    │ Component: SellCycleDetailsV4
    │ User: Moves through stages 1-7
    │ Stage 7: Clicks "Complete Cycle"
    │
    ▼
┌─────────────────────────────────────┐
│ 19. TRANSFER OWNERSHIP              │
└─────────────────────────────────────┘
    │
    │ Service: ownership.ts → transferOwnership()
    │ Updates: Property.currentOwnerId = Sara
    │ Adds: OwnershipRecord to history
    │ Links: Transaction ID to ownership
    │
    ▼
┌─────────────────────────────────────┐
│ 20. RECORD COMMISSION               │
└─────────────────────────────────────┘
    │
    │ Service: commissionAgents.ts → recordCommission()
    │ Creates: Commission record
    │ Amount: Based on sale price × rate
    │ Status: 'pending'
    │
    ▼
┌─────────────────────────────────────┐
│ 21. UPDATE FINANCIALS               │
└─────────────────────────────────────┘
    │
    │ Service: agencyTransactions.ts → recordSale()
    │ Records: Sale transaction
    │ Updates: Revenue
    │ Updates: Agent performance
    │
    ▼
┌─────────────────────────────────────┐
│ 22. UPDATE REPORTS DATA             │
└─────────────────────────────────────┘
    │
    │ Service: reports.ts → invalidateCache()
    │ Clears: Report caches
    │ Next report: Will include new data
    │
    ▼
┌─────────────────────────────────────┐
│ 23. UPDATE DASHBOARD                │
└─────────────────────────────────────┘
    │
    │ Service: dashboardData.ts → recalculateMetrics()
    │ Updates: Total sales count
    │ Updates: Revenue this month
    │ Updates: Agent performance
    │
    ▼
┌─────────────────────────────────────┐
│ 24. SEND NOTIFICATIONS              │
└─────────────────────────────────────┘
    │
    │ Service: notifications.ts
    │ Notifies: Agent (success)
    │ Notifies: Manager (new sale)
    │ Creates: Activity record
    │
    ▼
═══════════════════════════════════════
COMPLETE! Property sold, all systems updated.

AFFECTED MODULES:
✅ Properties (status, ownership)
✅ Contacts (buyer/seller records)
✅ Leads (converted)
✅ Deals (closed)
✅ Transactions (completed cycle)
✅ Financials (commission, revenue)
✅ Tasks (completed)
✅ Reports (data updated)
✅ Dashboard (metrics updated)
```

---

## API Architecture

### Internal API Pattern

Since aaraazi uses localStorage (no backend server), the "API" is the service layer:

```typescript
// API Pattern: Service Functions

// Example: Property API
class PropertyAPI {
  // GET /properties
  static getAll(filters?: PropertyFilters): Property[] {
    let properties = getProperties();
    
    if (filters) {
      properties = this.applyFilters(properties, filters);
    }
    
    return properties;
  }
  
  // GET /properties/:id
  static getById(id: string): Property | undefined {
    return getProperty(id);
  }
  
  // POST /properties
  static create(data: CreatePropertyInput): Property {
    // Validate
    const validation = validateProperty(data);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }
    
    // Create
    return createProperty(data);
  }
  
  // PUT /properties/:id
  static update(id: string, data: UpdatePropertyInput): Property {
    // Validate
    const validation = validatePropertyUpdate(data);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }
    
    // Update
    return updateProperty(id, data);
  }
  
  // DELETE /properties/:id
  static delete(id: string): void {
    deleteProperty(id);
  }
  
  // Custom endpoints
  static search(query: string): Property[] {
    return searchProperties(query);
  }
  
  static getByAgent(agentId: string): Property[] {
    return getProperties().filter(p => p.agentId === agentId);
  }
}
```

### Data Access Patterns

```typescript
// Pattern 1: Direct Access (Simple)
const properties = getProperties();
const property = properties.find(p => p.id === id);

// Pattern 2: Service Layer (Recommended)
const property = PropertyService.getById(id);

// Pattern 3: Hook Pattern (React Components)
function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const data = PropertyService.getById(id);
    setProperty(data || null);
    setLoading(false);
  }, [id]);
  
  return { property, loading };
}

// Usage in component
const { property, loading } = useProperty(propertyId);
```

---

## State Management

### State Architecture

```
┌─────────────────────────────────────────┐
│         STATE MANAGEMENT                │
├─────────────────────────────────────────┤
│                                         │
│  GLOBAL STATE (localStorage)            │
│  ├── Properties                         │
│  ├── Contacts                           │
│  ├── Leads                              │
│  ├── Deals                              │
│  ├── Transactions                       │
│  ├── Tasks                              │
│  ├── User                               │
│  └── Settings                           │
│                                         │
│  COMPONENT STATE (useState)             │
│  ├── UI State (modals, tabs, etc.)     │
│  ├── Form State (input values)          │
│  ├── View State (grid/list, filters)   │
│  └── Loading States                    │
│                                         │
│  DERIVED STATE (useMemo)                │
│  ├── Filtered Lists                    │
│  ├── Sorted Lists                      │
│  ├── Calculated Metrics                │
│  └── Aggregations                      │
│                                         │
│  EPHEMERAL STATE                        │
│  ├── Hover States                      │
│  ├── Focus States                      │
│  ├── Animations                        │
│  └── Tooltips                          │
└─────────────────────────────────────────┘
```

### State Update Flow

```typescript
// 1. User Action
<button onClick={handleAddProperty}>Add Property</button>

// 2. Event Handler
const handleAddProperty = async () => {
  try {
    // 3. Optimistic UI Update (optional)
    setLoading(true);
    
    // 4. Call Service
    const newProperty = PropertyService.create(formData);
    
    // 5. Update Local State
    setProperties(prev => [...prev, newProperty]);
    
    // 6. Success Feedback
    toast.success('Property added successfully!');
    
    // 7. Navigate or close modal
    onClose();
    
  } catch (error) {
    // 8. Error Handling
    toast.error('Failed to add property');
    console.error(error);
  } finally {
    // 9. Reset UI State
    setLoading(false);
  }
};
```

---

## Component Hierarchy

### Workspace Pattern

```
WorkspacePageTemplate
│
├── WorkspaceHeader
│   ├── Title & Description
│   ├── Stats Cards (4-5 metrics)
│   ├── Primary Action Button
│   ├── Secondary Actions Dropdown
│   └── View Mode Switcher (Grid/List/Kanban)
│
├── WorkspaceSearchBar
│   ├── Search Input
│   ├── Quick Filters (5-7 filters)
│   ├── Sort Dropdown
│   └── Clear Filters Button
│
├── WorkspaceContent (conditional)
│   │
│   ├── IF data exists:
│   │   │
│   │   ├── WorkspaceGridView
│   │   │   └── WorkspaceCard (x N items)
│   │   │       ├── Card Header
│   │   │       ├── Card Body (key info)
│   │   │       ├── Card Footer (actions)
│   │   │       └── Card Menu (3-dot menu)
│   │   │
│   │   ├── WorkspaceTableView
│   │   │   └── Table
│   │   │       ├── Table Header
│   │   │       └── Table Rows (x N items)
│   │   │           ├── Columns (data)
│   │   │           └── Actions Column
│   │   │
│   │   └── WorkspaceKanbanView
│   │       └── Kanban Columns
│   │           └── WorkspaceKanbanCard (x N items)
│   │
│   └── IF no data:
│       └── WorkspaceEmptyState
│           ├── Icon
│           ├── Title
│           ├── Description
│           ├── Primary Action (Add first item)
│           └── Guide Items (How to get started)
│
└── WorkspaceFooter
    └── WorkspacePagination
        ├── Page Info
        ├── Previous Button
        ├── Page Numbers
        └── Next Button
```

### Detail Page Pattern

```
DetailPageTemplate
│
├── PageHeader
│   ├── Breadcrumbs
│   ├── Title
│   ├── Description (optional)
│   ├── Metric Cards (3-5 key metrics)
│   ├── Primary Actions (1-3 buttons)
│   ├── Secondary Actions (dropdown)
│   └── Back Button
│
├── ConnectedEntitiesBar
│   └── Entity Chips (Owner, Agent, Buyer, etc.)
│       └── Click to navigate
│
├── Main Content Area
│   │
│   └── Tabs
│       │
│       ├── Overview Tab
│       │   ├── Summary Section
│       │   ├── Details Section
│       │   └── Key Information
│       │
│       ├── Related Tab (varies by entity)
│       │   ├── Properties: Photos, Documents, Transactions
│       │   ├── Contacts: Interactions, Entities
│       │   ├── Deals: Offers, Negotiation
│       │   └── Transactions: Stages, Payments
│       │
│       ├── Activity/Timeline Tab
│       │   └── ActivityTimeline
│       │       └── Activity Items (chronological)
│       │
│       └── Additional Tabs (entity-specific)
│
└── Side Panels (optional)
    ├── Quick Actions Panel
    ├── Related Items Panel
    └── Notes Panel
```

---

## Integration Points

### Cross-Module Integration Map

```
┌────────────────────────────────────────────────────┐
│           INTEGRATION POINTS                       │
└────────────────────────────────────────────────────┘

1. PROPERTY → CONTACT (Owner/Agent)
   Integration: properties.ts → contacts.ts
   Function: getPropertyOwner(propertyId)
   Returns: Contact object
   Display: Owner chip, contact card

2. LEAD → CONTACT (Lead Person)
   Integration: leads.ts → contacts.ts
   Function: getLeadContact(leadId)
   Returns: Contact object
   Display: Lead detail page

3. LEAD → PROPERTY (Interested Properties)
   Integration: leads.ts → properties.ts
   Function: getLeadProperties(leadId)
   Returns: Property[]
   Display: Properties tab in lead detail

4. DEAL → PROPERTY (Subject Property)
   Integration: deals.ts → properties.ts
   Function: getDealProperty(dealId)
   Returns: Property object
   Display: Deal detail page

5. DEAL → CONTACT (Buyer/Seller)
   Integration: deals.ts → contacts.ts
   Function: getDealParties(dealId)
   Returns: { buyer: Contact, seller: Contact }
   Display: Connected entities bar

6. DEAL → LEAD (Source Lead)
   Integration: deals.ts → leads.ts
   Function: getDealSourceLead(dealId)
   Returns: Lead object (if exists)
   Display: Deal origin section

7. TRANSACTION → PROPERTY
   Integration: sellCycle.ts → properties.ts
   Function: getCycleProperty(cycleId)
   Returns: Property object
   Display: Cycle detail page

8. TRANSACTION → DEAL (Source Deal)
   Integration: sellCycle.ts → deals.ts
   Function: getCycleSourceDeal(cycleId)
   Returns: Deal object (if exists)
   Display: Cycle origin

9. TRANSACTION → COMMISSION
   Integration: sellCycle.ts → commissionAgents.ts
   Function: calculateCycleCommission(cycleId)
   Returns: Commission object
   Trigger: On cycle completion

10. PORTFOLIO → PROPERTY (Portfolio Properties)
    Integration: portfolio.ts → properties.ts
    Function: getPortfolioProperties()
    Returns: Property[] (filtered by ownership)
    Display: Portfolio view

11. PORTFOLIO → INVESTOR (Co-owners)
    Integration: portfolio.ts → investors.ts
    Function: getPropertyInvestors(propertyId)
    Returns: Investor[]
    Display: Ownership breakdown

12. TASK → ANY ENTITY (Related Entity)
    Integration: tasks.ts → [any module]
    Function: getTaskRelatedEntity(task)
    Returns: Entity object
    Display: Task detail, related entity link

13. DOCUMENT → ANY ENTITY (Attached To)
    Integration: documents.ts → [any module]
    Function: getEntityDocuments(entityType, entityId)
    Returns: Document[]
    Display: Documents tab

14. ACTIVITY → ANY ENTITY (Activity Subject)
    Integration: activities → [any module]
    Function: logActivity(entityType, entityId, activity)
    Effect: Adds to timeline
    Display: Timeline tab

15. SHARING → ANY ENTITY (Shared Entity)
    Integration: sharingPermissions.ts → [any module]
    Function: getSharedEntity(entityType, entityId)
    Returns: Entity + permissions
    Display: Shared items view

16. REPORTS → ALL MODULES (Data Source)
    Integration: reports.ts → [all modules]
    Function: aggregateReportData(reportType)
    Returns: Aggregated data
    Display: Report viewer
```

### Integration Flow Example: Lead to Deal to Transaction

```typescript
// Step 1: User converts lead to deal
async function convertLeadToDeal(leadId: string) {
  // Get lead data
  const lead = getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');
  
  // Get associated contact
  const contact = getContactById(lead.contactId);
  if (!contact) throw new Error('Contact not found');
  
  // Get interested property
  const propertyId = lead.interestedProperties[0];
  const property = getPropertyById(propertyId);
  if (!property) throw new Error('Property not found');
  
  // Get property owner
  const owner = getContactById(property.currentOwnerId);
  
  // Create deal
  const deal = createDeal({
    propertyId: property.id,
    buyerId: contact.id,
    sellerId: owner.id,
    buyerAgentId: getCurrentUserId(),
    sellerAgentId: property.agentId,
    stage: 'new',
    offers: [],
    leadId: lead.id // Link back to source lead
  });
  
  // Update lead
  updateLead(leadId, {
    stage: 'negotiation',
    dealId: deal.id
  });
  
  // Update property
  updateProperty(propertyId, {
    status: 'under-offer'
  });
  
  return deal;
}

// Step 2: User accepts offer in deal
async function acceptDealOffer(dealId: string, offerId: string) {
  const deal = getDealById(dealId);
  const offer = deal.offers.find(o => o.id === offerId);
  
  // Update deal
  updateDeal(dealId, {
    stage: 'accepted',
    agreedPrice: offer.amount
  });
  
  // Create sell cycle
  const sellCycle = createSellCycle({
    propertyId: deal.propertyId,
    sellerId: deal.sellerId,
    agentId: deal.sellerAgentId,
    agreedPrice: offer.amount,
    dealId: deal.id // Link back to source deal
  });
  
  // Create purchase cycle (if different agent)
  if (deal.buyerAgentId !== deal.sellerAgentId) {
    const purchaseCycle = createPurchaseCycle({
      propertyId: deal.propertyId,
      buyerId: deal.buyerId,
      agentId: deal.buyerAgentId,
      agreedPrice: offer.amount,
      dealId: deal.id
    });
  }
  
  // Update property
  updateProperty(deal.propertyId, {
    status: 'sold' // Or 'pending' until completion
  });
  
  // Create stage-based tasks
  createCycleTasks(sellCycle.id);
  
  return sellCycle;
}

// Step 3: User completes transaction
async function completeSellCycle(cycleId: string) {
  const cycle = getSellCycleById(cycleId);
  const property = getPropertyById(cycle.propertyId);
  const deal = getDealById(cycle.dealId);
  
  // Update cycle
  updateSellCycle(cycleId, {
    stage: 7, // Completion stage
    completedAt: new Date().toISOString()
  });
  
  // Transfer property ownership
  transferOwnership({
    propertyId: property.id,
    fromOwnerId: cycle.sellerId,
    toOwnerId: deal.buyerId,
    transactionId: cycle.id,
    transactionType: 'sell',
    salePrice: cycle.agreedPrice
  });
  
  // Record commission
  recordCommission({
    agentId: cycle.agentId,
    transactionId: cycle.id,
    transactionType: 'sell',
    amount: cycle.commission,
    status: 'pending'
  });
  
  // Update financials
  recordSaleTransaction({
    propertyId: property.id,
    amount: cycle.agreedPrice,
    commission: cycle.commission,
    date: new Date().toISOString()
  });
  
  // Update reports cache
  invalidateReportsCache();
  
  // Send notifications
  sendNotification({
    userId: cycle.agentId,
    type: 'sale_completed',
    message: `Sale completed: ${property.title}`,
    relatedEntity: { type: 'property', id: property.id }
  });
  
  return cycle;
}
```

---

## Entity Relationships

### Entity Relationship Diagram (ERD)

```
┌──────────────────────────────────────────────────────┐
│              ENTITY RELATIONSHIPS                    │
└──────────────────────────────────────────────────────┘

PROPERTY (Core Entity)
│
├── HAS ONE currentOwner → CONTACT
├── HAS MANY ownershipHistory → OWNERSHIP_RECORD[]
├── HAS ONE assignedAgent → CONTACT (type: agent)
├── HAS MANY interestedLeads → LEAD[]
├── HAS MANY deals → DEAL[]
├── HAS MANY sellCycles → SELL_CYCLE[]
├── HAS MANY purchaseCycles → PURCHASE_CYCLE[]
├── HAS MANY rentCycles → RENT_CYCLE[]
├── HAS MANY documents → DOCUMENT[]
├── HAS MANY photos → PHOTO[]
├── HAS MANY tasks → TASK[]
└── BELONGS TO (optional) syndicate → SYNDICATE

CONTACT (Core Entity)
│
├── HAS MANY ownedProperties → PROPERTY[] (as owner)
├── HAS MANY managedProperties → PROPERTY[] (as agent)
├── HAS MANY leads → LEAD[] (as buyer/seller)
├── HAS MANY dealsAsBuyer → DEAL[]
├── HAS MANY dealsAsSeller → DEAL[]
├── HAS MANY sellCycles → SELL_CYCLE[] (as seller)
├── HAS MANY purchaseCycles → PURCHASE_CYCLE[] (as buyer)
├── HAS MANY rentCycles → RENT_CYCLE[] (as tenant/landlord)
├── HAS MANY interactions → INTERACTION[]
├── HAS MANY tasks → TASK[]
├── HAS MANY documents → DOCUMENT[]
└── HAS MANY investments → INVESTMENT[] (if investor)

LEAD (Pipeline Entity)
│
├── BELONGS TO contact → CONTACT
├── HAS MANY interestedProperties → PROPERTY[]
├── HAS ONE (optional) convertedToDeal → DEAL
├── HAS MANY followUpTasks → TASK[]
├── HAS MANY activities → ACTIVITY[]
└── HAS ONE assignedAgent → CONTACT (type: agent)

DEAL (Negotiation Entity)
│
├── BELONGS TO property → PROPERTY
├── BELONGS TO buyer → CONTACT
├── BELONGS TO seller → CONTACT
├── BELONGS TO buyerAgent → CONTACT (type: agent)
├── BELONGS TO sellerAgent → CONTACT (type: agent)
├── HAS ONE (optional) sourceLead → LEAD
├── HAS MANY offers → OFFER[]
├── HAS ONE (optional) sellCycle → SELL_CYCLE
├── HAS ONE (optional) purchaseCycle → PURCHASE_CYCLE
├── HAS MANY documents → DOCUMENT[]
└── HAS MANY activities → ACTIVITY[]

SELL_CYCLE (Transaction Entity)
│
├── BELONGS TO property → PROPERTY
├── BELONGS TO seller → CONTACT
├── BELONGS TO agent → CONTACT (type: agent)
├── HAS ONE (optional) sourceDeal → DEAL
├── HAS ONE (optional) paymentSchedule → PAYMENT_SCHEDULE
├── HAS MANY documents → DOCUMENT[]
├── HAS MANY activities → ACTIVITY[]
├── HAS MANY tasks → TASK[]
└── CREATES ONE commission → COMMISSION

PURCHASE_CYCLE (Transaction Entity)
│
├── BELONGS TO property → PROPERTY
├── BELONGS TO buyer → CONTACT
├── BELONGS TO agent → CONTACT (type: agent)
├── HAS ONE (optional) sourceDeal → DEAL
├── HAS ONE (optional) paymentSchedule → PAYMENT_SCHEDULE
├── HAS MANY documents → DOCUMENT[]
├── HAS MANY activities → ACTIVITY[]
├── HAS MANY tasks → TASK[]
└── CREATES ONE commission → COMMISSION

RENT_CYCLE (Transaction Entity)
│
├── BELONGS TO property → PROPERTY
├── BELONGS TO tenant → CONTACT
├── BELONGS TO landlord → CONTACT
├── BELONGS TO agent → CONTACT (type: agent)
├── HAS ONE leaseAgreement → DOCUMENT
├── HAS MANY rentPayments → PAYMENT[]
├── HAS MANY maintenanceRequests → TASK[]
├── HAS MANY documents → DOCUMENT[]
└── CREATES ONE commission → COMMISSION

TASK (Activity Entity)
│
├── BELONGS TO assignedTo → CONTACT
├── BELONGS TO (optional) relatedEntity → ANY_ENTITY
│   ├── Can link to: PROPERTY
│   ├── Can link to: CONTACT
│   ├── Can link to: LEAD
│   ├── Can link to: DEAL
│   ├── Can link to: SELL_CYCLE
│   ├── Can link to: PURCHASE_CYCLE
│   └── Can link to: RENT_CYCLE
└── HAS MANY comments → COMMENT[]

DOCUMENT (Supporting Entity)
│
└── BELONGS TO entity → ANY_ENTITY
    ├── Can belong to: PROPERTY
    ├── Can belong to: CONTACT
    ├── Can belong to: DEAL
    ├── Can belong to: SELL_CYCLE
    ├── Can belong to: PURCHASE_CYCLE
    └── Can belong to: RENT_CYCLE

COMMISSION (Financial Entity)
│
├── BELONGS TO agent → CONTACT (type: agent)
├── BELONGS TO transaction → SELL_CYCLE | PURCHASE_CYCLE | RENT_CYCLE
└── HAS ONE (optional) payment → PAYMENT

SYNDICATE (Investment Entity)
│
├── BELONGS TO property → PROPERTY
├── HAS MANY investors → INVESTOR[]
├── HAS MANY shares → SHARE[]
├── HAS MANY distributions → DISTRIBUTION[]
└── HAS MANY documents → DOCUMENT[]

INVESTOR (Investment Entity)
│
├── BELONGS TO contact → CONTACT
├── HAS MANY syndicates → SYNDICATE[]
├── HAS MANY shares → SHARE[]
├── HAS MANY distributions → DISTRIBUTION[]
└── HAS MANY documents → DOCUMENT[]
```

### Relationship Cardinality

```
ONE-TO-ONE:
Property → Current Owner (Contact)
SellCycle → Commission
Deal → Source Lead

ONE-TO-MANY:
Property → Sell Cycles
Property → Ownership History
Contact → Owned Properties
Contact → Leads
Lead → Follow-up Tasks

MANY-TO-MANY:
Lead → Properties (interested in)
Contact → Deals (as buyer or seller)
Contact → Syndicates (investors)
```

---

## Cross-Module Communication

### Event System (Conceptual)

```typescript
// Event Bus Pattern (if implemented)

// Event Types
type SystemEvent = 
  | { type: 'property:created', payload: Property }
  | { type: 'property:updated', payload: { id: string, changes: Partial<Property> } }
  | { type: 'property:deleted', payload: { id: string } }
  | { type: 'deal:created', payload: Deal }
  | { type: 'deal:accepted', payload: { dealId: string } }
  | { type: 'cycle:completed', payload: { cycleId: string, cycleType: string } }
  | { type: 'commission:earned', payload: Commission }
  | { type: 'task:completed', payload: { taskId: string } };

// Event Listeners
EventBus.on('property:updated', (payload) => {
  // Update reports cache
  invalidateReportsCache();
  
  // Update dashboard
  recalculateDashboardMetrics();
  
  // Update related entities
  updateRelatedDeals(payload.id);
});

EventBus.on('deal:accepted', (payload) => {
  // Create transaction
  createSellCycleFromDeal(payload.dealId);
  
  // Update property status
  updatePropertyStatus(payload.dealId);
  
  // Create tasks
  createDealTasks(payload.dealId);
  
  // Send notifications
  notifyRelevantParties(payload.dealId);
});

EventBus.on('cycle:completed', (payload) => {
  // Transfer ownership
  handleOwnershipTransfer(payload.cycleId);
  
  // Record commission
  recordCommission(payload.cycleId, payload.cycleType);
  
  // Update financials
  updateFinancials(payload.cycleId);
  
  // Update reports
  invalidateReportsCache();
});
```

### Service Communication Patterns

```typescript
// Pattern 1: Direct Service Calls
// When: Simple, synchronous operations

function getPropertyWithOwner(propertyId: string) {
  const property = PropertyService.getById(propertyId);
  const owner = ContactService.getById(property.currentOwnerId);
  
  return { property, owner };
}

// Pattern 2: Coordinated Service Calls
// When: Multiple updates needed atomically

function convertDealToTransaction(dealId: string) {
  const deal = DealService.getById(dealId);
  
  // 1. Create transaction
  const cycle = SellCycleService.create({
    propertyId: deal.propertyId,
    sellerId: deal.sellerId,
    agentId: deal.sellerAgentId,
    agreedPrice: deal.agreedPrice
  });
  
  // 2. Update deal
  DealService.update(dealId, {
    stage: 'converted',
    sellCycleId: cycle.id
  });
  
  // 3. Update property
  PropertyService.update(deal.propertyId, {
    status: 'sold'
  });
  
  // 4. Update lead (if exists)
  if (deal.leadId) {
    LeadService.update(deal.leadId, {
      stage: 'closed',
      outcome: 'won'
    });
  }
  
  return cycle;
}

// Pattern 3: Cascade Updates
// When: Changes ripple through multiple entities

function deleteProperty(propertyId: string) {
  // 1. Check dependencies
  const deals = DealService.getByProperty(propertyId);
  if (deals.some(d => d.stage !== 'lost')) {
    throw new Error('Cannot delete property with active deals');
  }
  
  // 2. Clean up related entities
  const leads = LeadService.getByProperty(propertyId);
  leads.forEach(lead => {
    LeadService.update(lead.id, {
      interestedProperties: lead.interestedProperties.filter(id => id !== propertyId)
    });
  });
  
  // 3. Archive documents
  const docs = DocumentService.getByEntity('property', propertyId);
  docs.forEach(doc => DocumentService.archive(doc.id));
  
  // 4. Delete property
  PropertyService.delete(propertyId);
  
  // 5. Invalidate caches
  invalidateReportsCache();
  recalculateDashboardMetrics();
}
```

---

## Business Logic Flow

### Critical Business Flows

#### Flow 1: Property Acquisition (Agency Inventory)

```
START: Agency decides to buy property
    │
    ▼
1. Create Purchase Cycle
   - Type: Agency Purchase
   - Buyer: Agency
   - Property: Selected property
   - Purpose: For resale
    │
    ▼
2. Move through Purchase Stages
   - Stage 1: Requirement
   - Stage 2: Searching
   - Stage 3: Viewing
   - Stage 4: Offer Made
   - Stage 5: Agreement
   - Stage 6: Paperwork
   - Stage 7: Completion
    │
    ▼
3. Complete Purchase
   - Transfer ownership to Agency
   - Record purchase price
   - Add to Portfolio (inventory)
   - Create property entry if new
    │
    ▼
4. Property Now in Inventory
   - Status: Available (for resale)
   - Owner: Agency
   - Acquisition Type: Inventory
   - Can renovate, improve, hold
    │
    ▼
5. When Ready to Sell
   - Start Sell Cycle
   - Find buyer
   - Complete sale
   - Calculate profit: Sale Price - (Purchase Price + Costs)
    │
    ▼
END: Profit recorded in Financials
```

#### Flow 2: Client Listing Sale

```
START: Client wants to sell their property
    │
    ▼
1. Add Client as Contact
   - Type: Seller
   - Collect information
    │
    ▼
2. Add Property
   - Owner: Client (contact)
   - Acquisition Type: Client Listing
   - Set commission rate (e.g., 2%)
    │
    ▼
3. Marketing Phase
   - Upload photos
   - Write description
   - Share on platforms
   - Generate leads
    │
    ▼
4. Lead Qualification
   - Interested buyers contact
   - Create Lead records
   - Score and qualify
   - Schedule viewings
    │
    ▼
5. Deal Creation
   - Buyer makes offer
   - Create Deal
   - Link: Property, Buyer, Seller
    │
    ▼
6. Negotiation
   - Offers and counter-offers
   - Move through deal stages
   - Reach agreement
    │
    ▼
7. Deal Accepted
   - Create Sell Cycle
   - Move through stages
   - Complete paperwork
    │
    ▼
8. Sale Completion
   - Transfer ownership (Client → Buyer)
   - Client receives sale proceeds
   - Agency receives commission (2% of price)
    │
    ▼
END: Commission recorded, everyone happy
```

#### Flow 3: Investor Syndication

```
START: Large property opportunity ($500M)
    │
    ▼
1. Structure Deal
   - Total investment: $500M
   - Agency: 20% ($100M)
   - Investors: 80% ($400M)
   - Min investment: $5M per investor
    │
    ▼
2. Create Syndicate
   - Property: Commercial Plaza
   - Total shares: 100
   - Share price: $5M each
   - Agency reserves: 20 shares
   - Available: 80 shares
    │
    ▼
3. Fundraising
   - Market to investors
   - Present opportunity
   - Collect commitments
   - Track: 80 shares = $400M target
    │
    ▼
4. Close Syndicate
   - All shares sold
   - $400M raised
   - Add Agency $100M
   - Total: $500M
    │
    ▼
5. Acquire Property
   - Create Purchase Cycle (Syndication)
   - Complete purchase
   - Transfer ownership to Syndicate
   - Record all investor shares
    │
    ▼
6. Ongoing Management
   - Collect rental income
   - Pay expenses
   - Calculate net income
   - Distribute quarterly:
     * Agency gets 20%
     * Investors get 80% (split by shares)
    │
    ▼
7. Generate Investor Statements
   - Quarterly distributions
   - Property valuation updates
   - ROI calculations
   - Tax documents
    │
    ▼
8. Exit Strategy (after 5 years)
   - Property value: $750M (+50%)
   - Create Sell Cycle
   - Market and sell
   - Distribute proceeds:
     * Total: $750M
     * Agency: $150M (20%)
     * Investors: $600M (80%, by shares)
    │
    ▼
END: Investors happy with returns, Agency earns management fees + profit share
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│     SECURITY ARCHITECTURE               │
└─────────────────────────────────────────┘

AUTHENTICATION
├── Login Flow
│   ├── User enters credentials
│   ├── Validate against stored user
│   ├── Create session token
│   ├── Store in localStorage
│   └── Redirect to dashboard
│
├── Session Management
│   ├── Session stored in localStorage
│   ├── Session includes: userId, role, tenantId
│   ├── Session timeout: Configurable
│   └── Auto-logout on inactivity
│
└── Password Security
    ├── Passwords hashed (if backend exists)
    ├── Minimum complexity requirements
    └── Password reset flow

AUTHORIZATION
├── Role-Based Access Control (RBAC)
│   │
│   ├── Agency Owner
│   │   ├── Full access to all modules
│   │   ├── View all agents' data
│   │   ├── Manage users
│   │   └── Configure system
│   │
│   ├── Agent
│   │   ├── Access own data only
│   │   ├── Create/edit own entities
│   │   ├── View shared entities
│   │   └── Limited reports
│   │
│   └── Investor
│       ├── View own investments
│       ├── View related properties
│       ├── Download statements
│       └── Read-only access
│
├── Data Access Rules
│   │
│   ├── Properties
│   │   ├── Owner: Full access to all
│   │   ├── Agent: Only own properties + shared
│   │   └── Investor: Only invested properties
│   │
│   ├── Contacts
│   │   ├── Owner: All contacts
│   │   ├── Agent: Own contacts + shared
│   │   └── Investor: No access
│   │
│   ├── Financials
│   │   ├── Owner: All financial data
│   │   ├── Agent: Own commission only
│   │   └── Investor: Own distributions only
│   │
│   └── Reports
│       ├── Owner: All reports
│       ├── Agent: Personal reports
│       └── Investor: Investment reports
│
└── Sharing System
    ├── Share with specific users
    ├── Permission levels: View, Edit, Full
    ├── Expiry dates
    └── Audit trail
```

### Data Security

```typescript
// Example: Permission Check

function canAccessProperty(userId: string, propertyId: string): boolean {
  const user = getUserById(userId);
  const property = getPropertyById(propertyId);
  
  // Owner can access everything
  if (user.role === 'owner') return true;
  
  // Agent can access own properties
  if (property.agentId === userId) return true;
  
  // Check if shared
  const shared = getSharedItems(userId);
  if (shared.some(s => s.entityId === propertyId && s.entityType === 'property')) {
    return true;
  }
  
  // Investor can access invested properties
  if (user.role === 'investor') {
    const syndicate = getSyndicateByProperty(propertyId);
    if (syndicate?.investors.some(inv => inv.contactId === userId)) {
      return true;
    }
  }
  
  return false;
}

// Example: Data Filtering

function getProperties(userId: string): Property[] {
  const user = getUserById(userId);
  const allProperties = getAllProperties();
  
  // Owner sees all
  if (user.role === 'owner') {
    return allProperties;
  }
  
  // Agent sees own + shared
  if (user.role === 'agent') {
    return allProperties.filter(p => 
      p.agentId === userId || isSharedWithUser(p.id, userId)
    );
  }
  
  // Investor sees invested
  if (user.role === 'investor') {
    const investedPropertyIds = getInvestedPropertyIds(userId);
    return allProperties.filter(p => investedPropertyIds.includes(p.id));
  }
  
  return [];
}
```

---

## Performance & Optimization

### Performance Strategies

```
1. DATA LOADING
   ├── Lazy Loading
   │   ├── Load modules on demand
   │   ├── Load detail data only when viewed
   │   └── Paginate large lists
   │
   ├── Data Caching
   │   ├── Cache frequently accessed data
   │   ├── Invalidate on updates
   │   └── localStorage as cache
   │
   └── Selective Fetching
       ├── Fetch only needed fields
       ├── Load related data on demand
       └── Avoid over-fetching

2. RENDERING OPTIMIZATION
   ├── React.memo
   │   ├── Memoize expensive components
   │   ├── Prevent unnecessary re-renders
   │   └── Used on: Workspace cards, metric cards
   │
   ├── useMemo
   │   ├── Memoize calculations
   │   ├── Filter/sort operations
   │   └── Derived data
   │
   ├── useCallback
   │   ├── Stable function references
   │   ├── Prevent child re-renders
   │   └── Event handlers
   │
   └── Virtual Scrolling
       ├── Render only visible items
       ├── For lists > 100 items
       └── Improves performance

3. STATE MANAGEMENT
   ├── Local State First
   │   ├── useState for component state
   │   ├── Avoid global state when local works
   │   └── Reduce complexity
   │
   ├── Debouncing
   │   ├── Search inputs (300ms delay)
   │   ├── Filter changes
   │   └── Auto-save operations
   │
   └── Batching Updates
       ├── React batches automatically
       ├── Group related updates
       └── Use transactions when needed

4. ASSET OPTIMIZATION
   ├── Images
   │   ├── Compress before upload
   │   ├── Lazy load images
   │   ├── Use appropriate formats
   │   └── Responsive images
   │
   ├── Code Splitting
   │   ├── Split by route
   │   ├── Dynamic imports
   │   └── Reduce initial bundle
   │
   └── Tree Shaking
       ├── Remove unused code
       ├── Import only needed functions
       └── Vite handles automatically
```

### Performance Monitoring

```typescript
// Performance Metrics

// 1. Time to Interactive (TTI)
// Measure: When app becomes usable
// Target: < 3 seconds
console.time('App Load');
// ... app loads
console.timeEnd('App Load');

// 2. Component Render Time
// Measure: How long components take to render
function ExpensiveComponent() {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`Component rendered in ${end - start}ms`);
    };
  });
  
  return <div>...</div>;
}

// 3. Data Fetch Time
// Measure: How long data operations take
async function fetchData() {
  const start = performance.now();
  const data = await getData();
  const end = performance.now();
  
  console.log(`Data fetched in ${end - start}ms`);
  
  if (end - start > 1000) {
    console.warn('Slow data fetch detected');
  }
  
  return data;
}

// 4. localStorage Performance
// Monitor: Read/write times
function saveWithMetrics(key: string, data: any) {
  const start = performance.now();
  localStorage.setItem(key, JSON.stringify(data));
  const end = performance.now();
  
  console.log(`localStorage write: ${end - start}ms`);
}
```

---

## Deployment Architecture

### Build & Deployment

```
┌─────────────────────────────────────────┐
│      DEPLOYMENT ARCHITECTURE            │
└─────────────────────────────────────────┘

DEVELOPMENT
│
├── Local Development Server
│   ├── Tool: Vite Dev Server
│   ├── Port: 5173 (default)
│   ├── Hot Module Replacement (HMR)
│   └── Fast refresh
│
└── Development Build
    ├── Command: npm run dev
    ├── No optimization
    ├── Source maps enabled
    └── Fast compilation

PRODUCTION
│
├── Build Process
│   ├── Command: npm run build
│   ├── Tool: Vite
│   ├── Output: /dist folder
│   ├── Minification: Yes
│   ├── Tree shaking: Yes
│   ├── Code splitting: Yes
│   └── Asset optimization: Yes
│
├── Build Output
│   ├── index.html (entry point)
│   ├── /assets
│   │   ├── index-[hash].js (main bundle)
│   │   ├── vendor-[hash].js (dependencies)
│   │   ├── [route]-[hash].js (code split chunks)
│   │   └── [asset]-[hash].css
│   └── Manifest files
│
└── Deployment Options
    │
    ├── Option 1: Static Host (Vercel, Netlify)
    │   ├── Connect to Git repo
    │   ├── Auto-deploy on push
    │   ├── CDN distribution
    │   └── HTTPS by default
    │
    ├── Option 2: Traditional Web Server
    │   ├── Upload /dist folder
    │   ├── Configure web server (nginx, Apache)
    │   ├── Setup HTTPS
    │   └── Configure caching headers
    │
    └── Option 3: Cloud Storage (S3, Cloud Storage)
        ├── Upload /dist to bucket
        ├── Enable static website hosting
        ├── Setup CloudFront/CDN
        └── Configure domain
```

### Environment Configuration

```typescript
// Environment Variables

// Development
const config = {
  apiUrl: 'http://localhost:3000', // If backend exists
  environment: 'development',
  logLevel: 'debug',
  enableDevTools: true
};

// Production
const config = {
  apiUrl: 'https://api.aaraazi.com', // If backend exists
  environment: 'production',
  logLevel: 'error',
  enableDevTools: false
};

// Usage
import.meta.env.VITE_API_URL
import.meta.env.VITE_ENVIRONMENT
```

---

## Summary

### System Overview

**aaraazi is a comprehensive real estate management platform built with**:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: React Hooks + localStorage
- **Business Logic**: 80+ TypeScript service files
- **Data Storage**: Browser localStorage (client-side)
- **UI Components**: 350+ React components
- **Modules**: 11 interconnected modules
- **Architecture**: Layered (Presentation → Business → Data → Persistence)

### Key Integration Points

1. **Properties** ↔ All modules (central entity)
2. **Contacts** ↔ All people-related entities
3. **Leads** → **Deals** → **Transactions** (sales pipeline)
4. **Transactions** → **Financials** (money flow)
5. **Portfolio** ↔ **Properties** + **Investors** (investments)
6. **Tasks** ↔ All modules (activities)
7. **Reports** ← All modules (analytics)
8. **Dashboard** ← All modules (overview)
9. **Sharing** → All modules (collaboration)

### Data Flow Pattern

```
User Action → Component → Service → Data Layer → localStorage
                ↓
            UI Update ← State Update ← Data Return
```

### Module Communication

- **Direct**: Service-to-service function calls
- **Coordinated**: Multi-service transactions
- **Cascading**: Updates ripple through related entities
- **Event-driven**: Future enhancement opportunity

---

**End of System Architecture & Integration Guide**

**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Type**: Technical Architecture Documentation  
**aaraazi Real Estate Platform**

🏗️ **Complete System Architecture Documented!**
