# Leads Module Modernization Plan
## Design System V4.1 Migration - Comprehensive Implementation Guide

---

## **Executive Summary**

**Objective:** Modernize the Leads module to use Design System V4.1 templates while maintaining 100% of existing functionality and improving UX consistency across the agency module.

**Scope:**
- Update `Leads.tsx` to use `WorkspacePageTemplate`
- Remove duplicate "Add Lead" dialog from workspace
- Integrate with existing `LeadFormV2.tsx` in sidebar navigation
- Maintain all features: pipeline view, list view, lead scoring, status management, archiving
- Follow Guidelines.md and Design System V4.1 standards

**Success Criteria:**
- ✅ Zero functional regressions
- ✅ Consistent design with other V4.1 workspaces (Properties, Contacts, Deals)
- ✅ Improved UX through template patterns
- ✅ All existing features working seamlessly
- ✅ No console errors or warnings

---

## **Current State Analysis**

### **Existing Components**

1. **`/components/Leads.tsx`** (Main Workspace - OLD DESIGN)
   - **Line Count:** ~1400 lines
   - **Current Design:** Custom cards and layout
   - **Features:**
     - Two view modes: Pipeline (kanban) | List
     - Stats cards (Total, New Today, Converted, etc.)
     - Search and filters (source, property, search term)
     - Inline "Add Lead" dialog (OLD - needs to be removed)
     - Lead scoring visualization
     - Status change workflows with modals
     - Archive/unarchive functionality
     - Lead detail view dialog
     - Mark as interested (multi-property selection)
     - Convert to deal (with property + price)
   - **Issues:**
     - Not using WorkspacePageTemplate
     - Inline form dialog duplicates LeadFormV2
     - Inconsistent with other modernized workspaces
     - Not following 5 UX Laws structure

2. **`/components/LeadFormV2.tsx`** (Standalone Form - ALREADY MODERNIZED ✅)
   - **Line Count:** ~500 lines
   - **Current Design:** Uses FormContainer + FormSection (V4.1 patterns)
   - **Route:** Accessed via sidebar "Add Lead" navigation (`activeTab === 'add-lead'`)
   - **Features:**
     - Complete lead form with validation
     - Contact search and import
     - Duplicate detection
     - Property association
     - Source tracking
     - Lead type (buyer, seller, tenant, landlord)
     - Budget and urgency fields
   - **Status:** Already follows Design System V4.1 ✅
   - **Action:** Keep as-is, just ensure navigation works correctly

3. **`/components/FollowUpTasks.tsx`**
   - **Connection:** Displays leads that need follow-up
   - **Action:** Review for compatibility (minor updates if needed)

4. **`/components/Dashboard.tsx`**
   - **Connection:** May have lead widgets (new leads today, hot leads, etc.)
   - **Action:** Ensure widgets still work with updated Leads module

### **Current User Flows**

**Flow 1: Add New Lead (Current - NEEDS CHANGE)**
```
Leads Workspace → "Add Lead" button → Inline Dialog → Fill form → Submit → Lead created
```

**Flow 1: Add New Lead (NEW - DESIRED)**
```
Leads Workspace → "Add Lead" button → Navigate to LeadFormV2 → Fill form → Submit → Back to Leads Workspace
```

**Flow 2: View Lead Details (Current - KEEP)**
```
Leads Workspace → Click lead card → Lead Detail Dialog → View/Edit → Close
```

**Flow 3: Change Lead Status (Current - KEEP)**
```
Leads Workspace → Drag to new status column (pipeline) or status dropdown (list) → Update
```

**Flow 4: Mark Lead as Interested (Current - KEEP)**
```
Status change to "interested" → Multi-property selection modal → Select properties → Submit
```

**Flow 5: Convert Lead to Deal (Current - KEEP)**
```
Status change to "converted" → Conversion modal → Select property + price → Create deal
```

---

## **Design System V4.1 Target Architecture**

### **Template Structure**

The modernized Leads workspace will follow the same pattern as PropertiesWorkspaceV4:

```
LeadsWorkspaceV4.tsx
├─ WorkspacePageTemplate
│  ├─ Header (WorkspaceHeader)
│  │  ├─ Title: "Leads Management"
│  │  ├─ Description: "Manage and track your sales pipeline"
│  │  ├─ Stats: [Total, New Today, This Week, Converted, Conversion Rate]
│  │  ├─ Primary Action: "Add Lead" (navigate to LeadFormV2)
│  │  ├─ Secondary Actions: [Show Archived, Export Leads]
│  │  └─ View Mode: Pipeline | List
│  │
│  ├─ Search Bar (WorkspaceSearchBar)
│  │  ├─ Search input (name, phone, email, source)
│  │  ├─ Quick Filters: [Status, Source, Property, Lead Type, Urgency]
│  │  └─ Sort Options: [Recent, Score (high to low), Name A-Z]
│  │
│  ├─ Content (WorkspaceContent)
│  │  ├─ Pipeline View (Custom - Kanban columns)
│  │  │  ├─ New Column
│  │  │  ├─ Contacted Column
│  │  │  ├─ Interested Column
│  │  │  ├─ Not Interested Column
│  │  │  └─ Converted Column
│  │  │
│  │  └─ List View (Custom Table)
│  │     ├─ Columns: [Name, Contact, Source, Type, Property, Score, Status, Agent, Actions]
│  │     └─ Row actions: View, Edit Status, Archive
│  │
│  └─ Footer (WorkspacePagination)
│     └─ Pagination controls (if > 50 leads)
│
└─ Modals (Separate components)
   ├─ LeadDetailModal (view full lead details)
   ├─ MarkInterestedModal (multi-property selection)
   ├─ ConvertLeadModal (convert to deal)
   └─ ArchiveConfirmModal
```

### **Component Breakdown**

#### **1. LeadsWorkspaceV4.tsx** (NEW - Main File)
- **Purpose:** Complete leads workspace using template system
- **Template:** WorkspacePageTemplate
- **Size:** ~800 lines (40% reduction from current 1400)
- **Responsibilities:**
  - Data fetching and filtering
  - View mode switching
  - Lead scoring integration
  - Navigation to LeadFormV2
  - Modal state management

#### **2. LeadWorkspaceCard.tsx** (NEW - Card Component)
- **Purpose:** Individual lead card for pipeline view
- **Similar to:** PropertyWorkspaceCard, ContactWorkspaceCard
- **Features:**
  - Lead name, phone, email
  - Lead score badge (with color coding)
  - Status badge
  - Property interest indicator
  - Quick actions menu
  - Drag and drop support (status change)

#### **3. LeadDetailModal.tsx** (NEW - Detail View)
- **Purpose:** Full lead details in modal
- **Alternative:** Could use a DetailPageTemplate if we want dedicated lead detail page
- **Features:**
  - Contact information
  - Lead scoring breakdown
  - Property interests
  - Interaction history
  - Follow-up tasks
  - Edit capabilities
  - Quick actions

#### **4. MarkInterestedModal.tsx** (EXTRACT from Leads.tsx)
- **Purpose:** Multi-property selection when marking lead as interested
- **Current Location:** Inline in Leads.tsx
- **Action:** Extract to separate component

#### **5. ConvertLeadModal.tsx** (EXTRACT from Leads.tsx)
- **Purpose:** Convert lead to deal with property and price selection
- **Current Location:** Inline in Leads.tsx
- **Action:** Extract to separate component

---

## **Detailed Implementation Plan**

### **Phase 1: Preparation & Audit** (No Code Changes)

**Duration:** 1 session

**Tasks:**
1. ✅ **Read and understand current Leads.tsx completely**
   - Document all features
   - Map all state variables
   - List all user interactions
   - Note all integrations (Dashboard, FollowUpTasks, etc.)

2. ✅ **Audit dependencies**
   - Review all data functions used (getLeads, updateLead, addLead)
   - Check lead scoring functions
   - Verify offer creation integration
   - Check commission creation integration

3. ✅ **Review related components**
   - FollowUpTasks.tsx
   - Dashboard.tsx (lead widgets)
   - Any reports that use leads

4. ✅ **Study reference implementations**
   - PropertiesWorkspaceV4.tsx (primary reference)
   - ContactsWorkspaceV4.tsx
   - WorkspacePageTemplate usage patterns

**Deliverable:** Complete feature inventory document (this section)

---

### **Phase 2: Create New Components** (New Files)

**Duration:** 2-3 sessions

**2.1: Create LeadWorkspaceCard.tsx**

**Location:** `/components/leads/LeadWorkspaceCard.tsx`

**Template:**
```tsx
/**
 * LeadWorkspaceCard Component
 * 
 * Individual lead card for workspace grid/pipeline view
 * Used in LeadsWorkspaceV4 pipeline and grid modes
 * 
 * FEATURES:
 * - Lead score badge with color coding
 * - Contact information display
 * - Property interest indicator
 * - Status badge
 * - Quick actions menu
 * - Drag and drop support
 */

interface LeadWorkspaceCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onStatusChange: (lead: Lead, newStatus: string) => void;
  onArchive: (lead: Lead) => void;
  isDragging?: boolean;
}

export function LeadWorkspaceCard({ ... }: LeadWorkspaceCardProps) {
  // Lead score color coding
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success'; // Hot lead
    if (score >= 60) return 'warning'; // Warm lead
    return 'default'; // Cold lead
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Lead Score Badge */}
        <Badge variant={getScoreColor(lead.score)}>
          Score: {lead.score}
        </Badge>
        
        {/* Lead Name */}
        <h3 className="font-medium">{lead.name}</h3>
        
        {/* Contact Info */}
        <div className="text-sm text-gray-600">
          <Phone /> {lead.phone}
          {lead.email && <Mail /> {lead.email}}
        </div>
        
        {/* Property Interest */}
        {lead.interestedProperties?.length > 0 && (
          <Badge variant="info">
            {lead.interestedProperties.length} properties
          </Badge>
        )}
        
        {/* Status Badge */}
        <StatusBadge status={lead.status} />
        
        {/* Quick Actions */}
        <QuickActionMenu
          actions={[
            { label: 'View Details', onClick: () => onView(lead) },
            { label: 'Change Status', submenu: [...] },
            { label: 'Archive', onClick: () => onArchive(lead) },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

**Features to Include:**
- Lead score visualization (hot/warm/cold indicators)
- Source badge (Facebook, Website, Referral, etc.)
- Time since created (e.g., "3 days ago")
- Urgency indicator (if urgency is high)
- Drag handles for pipeline view
- Responsive design (mobile-friendly)

---

**2.2: Create LeadDetailModal.tsx**

**Location:** `/components/leads/LeadDetailModal.tsx`

**Purpose:** Full lead details view in a modal dialog

**Sections:**
1. **Header**
   - Lead name
   - Lead score (prominent)
   - Status badge
   - Quick actions (Edit Status, Archive, Convert)

2. **Contact Information Panel**
   - Phone (click to call)
   - Email (click to email)
   - Source
   - Lead type (buyer, seller, tenant, landlord)

3. **Property Interests Panel**
   - List of interested properties
   - Match scores (if applicable)
   - Offers made (if any)

4. **Lead Score Breakdown**
   - Score components:
     - Engagement score (interactions, responses)
     - Budget match score
     - Timeline urgency
     - Source quality
   - Total score with gauge visualization

5. **Activity Timeline**
   - Status changes
   - Interactions (calls, emails, meetings)
   - Property views
   - Offers submitted
   - Notes added

6. **Notes Section**
   - All notes (chronological)
   - Add new note
   - Agent annotations

**Template:**
```tsx
interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
  onArchive: () => void;
}

export function LeadDetailModal({ lead, open, onClose, ... }: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Score */}
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>{lead.name}</DialogTitle>
              <DialogDescription>
                {lead.phone} • {lead.email}
              </DialogDescription>
            </div>
            <Badge variant={getScoreVariant(lead.score)}>
              Score: {lead.score}/100
            </Badge>
          </div>
        </DialogHeader>

        {/* Tabs or Sections */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Contact info, score breakdown, status */}
          </TabsContent>

          <TabsContent value="properties">
            {/* Interested properties, offers */}
          </TabsContent>

          <TabsContent value="activity">
            {/* Activity timeline */}
          </TabsContent>

          <TabsContent value="notes">
            {/* Notes list + add note */}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => onStatusChange('interested')}>
            Mark Interested
          </Button>
          <Button onClick={() => onStatusChange('converted')}>
            Convert to Deal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

**2.3: Create MarkInterestedModal.tsx**

**Location:** `/components/leads/MarkInterestedModal.tsx`

**Purpose:** Multi-property selection when marking lead as interested

**Current Implementation:** Lines 584-680 in Leads.tsx

**Features:**
- Property search
- Multi-select checkboxes
- Property cards with images
- Match score display (if available)
- Notes per property
- Offer amount input (optional)

**Extract and Clean:**
```tsx
interface MarkInterestedModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (propertyIds: string[], offers?: Record<string, OfferData>) => void;
}

export function MarkInterestedModal({ lead, open, onClose, onSubmit }: MarkInterestedModalProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [offerData, setOfferData] = useState<Record<string, OfferData>>({});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark {lead?.name} as Interested</DialogTitle>
          <DialogDescription>
            Select the properties this lead is interested in
          </DialogDescription>
        </DialogHeader>

        {/* Property selection grid */}
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {properties.map(property => (
            <PropertySelectionCard
              key={property.id}
              property={property}
              selected={selectedProperties.includes(property.id)}
              onToggle={handleToggle}
              onOfferChange={handleOfferChange}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(selectedProperties, offerData)}>
            Mark Interested ({selectedProperties.length} properties)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

**2.4: Create ConvertLeadModal.tsx**

**Location:** `/components/leads/ConvertLeadModal.tsx`

**Purpose:** Convert lead to deal with property and price selection

**Current Implementation:** Lines 682-780 in Leads.tsx

**Features:**
- Property selection (single)
- Price input
- Deal type (sale, rent, purchase)
- Commission settings
- Notes
- Creates commission record
- Creates deal record
- Updates lead status

**Extract and Clean:**
```tsx
interface ConvertLeadModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onConvert: (propertyId: string, price: number, dealType: string) => void;
}

export function ConvertLeadModal({ lead, open, onClose, onConvert }: ConvertLeadModalProps) {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [conversionPrice, setConversionPrice] = useState('');
  const [dealType, setDealType] = useState<'sale' | 'rent'>('sale');

  const handleConvert = () => {
    if (!selectedProperty || !conversionPrice) {
      toast.error('Please select a property and enter a price');
      return;
    }

    onConvert(selectedProperty, parseFloat(conversionPrice), dealType);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert {lead?.name} to Deal</DialogTitle>
          <DialogDescription>
            Select the property and enter the agreed price
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Selection */}
          <FormField label="Property" required>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} - {formatPKR(p.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Deal Type */}
          <FormField label="Deal Type" required>
            <Select value={dealType} onValueChange={(v) => setDealType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Price */}
          <FormField label="Agreed Price (PKR)" required>
            <Input
              type="number"
              value={conversionPrice}
              onChange={(e) => setConversionPrice(e.target.value)}
              placeholder="Enter amount"
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConvert}>Convert to Deal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

**2.5: Create LeadsWorkspaceV4.tsx**

**Location:** `/components/leads/LeadsWorkspaceV4.tsx`

**Purpose:** Main workspace using WorkspacePageTemplate

**Size:** ~800 lines (vs current 1400 lines)

**Template Structure:**
```tsx
/**
 * LeadsWorkspaceV4 Component
 * WORKSPACE V4: Built with WorkspacePageTemplate ✅
 * 
 * PURPOSE:
 * Complete leads workspace using the template system.
 * 60%+ code reduction through template reuse.
 * 
 * FEATURES:
 * - Pipeline view (kanban) and List view
 * - Search and filtering (source, property, lead type, urgency)
 * - Sorting options (recent, score, name)
 * - Lead scoring visualization
 * - Status change workflows
 * - Archive/restore functionality
 * - Integration with LeadFormV2 (sidebar navigation)
 * - Empty states for each status column
 * - Lead detail modal
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Download,
  Archive,
  ArchiveRestore,
  // ... other icons
} from 'lucide-react';
import { Lead, User } from '../../types';
import { getLeads, updateLead } from '../../lib/data';
import {
  WorkspacePageTemplate,
  EmptyStatePresets,
} from '../workspace';
import { LeadWorkspaceCard } from './LeadWorkspaceCard';
import { LeadDetailModal } from './LeadDetailModal';
import { MarkInterestedModal } from './MarkInterestedModal';
import { ConvertLeadModal } from './ConvertLeadModal';
import { toast } from 'sonner';

export interface LeadsWorkspaceV4Props {
  user: User;
  onNavigate: (section: string, id?: string) => void;
}

export const LeadsWorkspaceV4: React.FC<LeadsWorkspaceV4Props> = ({
  user,
  onNavigate,
}) => {
  // ==================== STATE ====================
  const [isLoading, setIsLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [leadTypeFilter, setLeadTypeFilter] = useState<string[]>([]);
  const [urgencyFilter, setUrgencyFilter] = useState<string[]>([]);
  
  // Modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  // ==================== DATA ====================
  const allLeads = useMemo(() => {
    return getLeads(user.id, user.role);
  }, [user.id, user.role]);

  const leads = useMemo(() => {
    return showArchived
      ? allLeads
      : allLeads.filter((lead) => !lead.isArchived);
  }, [allLeads, showArchived]);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const activeLeads = allLeads.filter((l) => !l.isArchived);
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return [
      {
        label: 'Total',
        value: activeLeads.length,
        variant: 'default' as const,
      },
      {
        label: 'New Today',
        value: activeLeads.filter((l) => l.createdAt === today).length,
        variant: 'success' as const,
      },
      {
        label: 'This Week',
        value: activeLeads.filter((l) => l.createdAt >= weekAgoStr).length,
        variant: 'info' as const,
      },
      {
        label: 'Converted',
        value: allLeads.filter((l) => l.status === 'converted').length,
        variant: 'warning' as const,
      },
      {
        label: 'Conversion Rate',
        value:
          allLeads.length > 0
            ? `${((allLeads.filter((l) => l.status === 'converted').length / allLeads.length) * 100).toFixed(1)}%`
            : '0%',
        variant: 'default' as const,
      },
    ];
  }, [allLeads]);

  // ==================== HANDLERS ====================
  const handleAddLead = useCallback(() => {
    // Navigate to LeadFormV2 in sidebar
    onNavigate('add-lead');
  }, [onNavigate]);

  const handleViewDetails = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  }, []);

  const handleStatusChange = useCallback((lead: Lead, newStatus: string) => {
    // Handle special status changes
    if (newStatus === 'interested') {
      setSelectedLead(lead);
      setShowInterestedModal(true);
      return;
    }

    if (newStatus === 'converted') {
      setSelectedLead(lead);
      setShowConvertModal(true);
      return;
    }

    if (newStatus === 'not-interested') {
      // Archive the lead
      updateLead(lead.id, {
        status: newStatus,
        isArchived: true,
        archivedAt: new Date().toISOString(),
      });
      toast.success('Lead marked as not interested and archived');
      return;
    }

    // Regular status update
    updateLead(lead.id, { status: newStatus });
    toast.success('Lead status updated');
  }, []);

  const handleArchive = useCallback((lead: Lead) => {
    updateLead(lead.id, {
      isArchived: true,
      archivedAt: new Date().toISOString(),
    });
    toast.success('Lead archived');
  }, []);

  const handleRestore = useCallback((lead: Lead) => {
    updateLead(lead.id, {
      isArchived: false,
      archivedAt: undefined,
    });
    toast.success('Lead restored');
  }, []);

  const handleMarkInterested = useCallback(
    (propertyIds: string[], offers?: Record<string, any>) => {
      if (!selectedLead) return;

      // Update lead with interested properties
      updateLead(selectedLead.id, {
        status: 'interested',
        interestedProperties: propertyIds,
      });

      // Save offers if provided
      // ... offer saving logic

      setShowInterestedModal(false);
      toast.success('Lead marked as interested');
    },
    [selectedLead]
  );

  const handleConvert = useCallback(
    (propertyId: string, price: number, dealType: string) => {
      if (!selectedLead) return;

      // Create deal
      // Create commission
      // Update lead status

      setShowConvertModal(false);
      toast.success('Lead converted to deal');
    },
    [selectedLead]
  );

  const handleExport = useCallback(() => {
    // Export leads to CSV
    toast.success('Leads exported');
  }, []);

  // ==================== RENDER ====================
  return (
    <>
      <WorkspacePageTemplate
        // Header
        title="Leads Management"
        description="Manage and track your sales pipeline"
        stats={stats}
        primaryAction={{
          label: 'Add Lead',
          icon: <Plus className="h-4 w-4" />,
          onClick: handleAddLead,
        }}
        secondaryActions={[
          {
            label: showArchived ? 'Hide Archived' : 'Show Archived',
            icon: showArchived ? <ArchiveRestore /> : <Archive />,
            onClick: () => setShowArchived(!showArchived),
          },
          {
            label: 'Export Leads',
            icon: <Download />,
            onClick: handleExport,
          },
        ]}
        viewMode="pipeline"
        onViewModeChange={(mode) => {
          // Switch between pipeline and list
        }}
        // Search & Filters
        searchConfig={{
          placeholder: 'Search leads by name, phone, email, or source...',
          onSearch: (query) => {
            // Search logic
          },
        }}
        quickFilters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'interested', label: 'Interested' },
              { value: 'not-interested', label: 'Not Interested' },
              { value: 'converted', label: 'Converted' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            id: 'source',
            label: 'Source',
            options: [
              // ... source options
            ],
            value: sourceFilter,
            onChange: setSourceFilter,
          },
          // ... more filters
        ]}
        sortOptions={[
          { value: 'recent', label: 'Most Recent' },
          { value: 'score-high', label: 'Score (High to Low)' },
          { value: 'score-low', label: 'Score (Low to High)' },
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'name-desc', label: 'Name (Z-A)' },
        ]}
        // Content
        isLoading={isLoading}
        emptyState={
          leads.length === 0 ? (
            <EmptyStatePresets.leads(handleAddLead) />
          ) : undefined
        }
      >
        {/* Pipeline View */}
        {viewMode === 'pipeline' && (
          <div className="grid grid-cols-5 gap-4">
            {/* New Column */}
            <LeadsPipelineColumn
              title="New"
              status="new"
              leads={leads.filter((l) => l.status === 'new')}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />

            {/* Contacted Column */}
            <LeadsPipelineColumn
              title="Contacted"
              status="contacted"
              leads={leads.filter((l) => l.status === 'contacted')}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />

            {/* Interested Column */}
            <LeadsPipelineColumn
              title="Interested"
              status="interested"
              leads={leads.filter((l) => l.status === 'interested')}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />

            {/* Not Interested Column */}
            <LeadsPipelineColumn
              title="Not Interested"
              status="not-interested"
              leads={leads.filter((l) => l.status === 'not-interested')}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />

            {/* Converted Column */}
            <LeadsPipelineColumn
              title="Converted"
              status="converted"
              leads={leads.filter((l) => l.status === 'converted')}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <LeadsListView
            leads={leads}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onArchive={handleArchive}
            onRestore={handleRestore}
          />
        )}
      </WorkspacePageTemplate>

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusChange={(status) => {
          if (selectedLead) {
            handleStatusChange(selectedLead, status);
          }
        }}
        onArchive={() => {
          if (selectedLead) {
            handleArchive(selectedLead);
          }
        }}
      />

      <MarkInterestedModal
        lead={selectedLead}
        open={showInterestedModal}
        onClose={() => setShowInterestedModal(false)}
        onSubmit={handleMarkInterested}
      />

      <ConvertLeadModal
        lead={selectedLead}
        open={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvert}
      />
    </>
  );
};
```

---

### **Phase 3: Update App.tsx Navigation** (Minor Changes)

**Duration:** 30 minutes

**Changes Required:**

**File:** `/App.tsx`

**Current:**
```tsx
case 'leads':
  return (
    <Leads 
      user={user}
      onNavigate={handleNavigation}
    />
  );

case 'add-lead':
  return (
    <LeadFormV2 
      user={user}
      onBack={handleBackToDashboard}
      onSuccess={handleSuccess}
    />
  );
```

**Updated:**
```tsx
case 'leads':
  return (
    <LeadsWorkspaceV4 
      user={user}
      onNavigate={handleNavigation}
    />
  );

case 'add-lead':
  return (
    <LeadFormV2 
      user={user}
      onBack={() => setActiveTab('leads')} // Navigate back to leads workspace
      onSuccess={() => {
        toast.success('Lead added successfully');
        setActiveTab('leads'); // Navigate back to leads workspace
      }}
    />
  );
```

**Key Changes:**
1. Replace `<Leads />` with `<LeadsWorkspaceV4 />`
2. Update `onBack` in LeadFormV2 to navigate to 'leads' tab
3. Update `onSuccess` in LeadFormV2 to navigate to 'leads' tab

---

### **Phase 4: Update Sidebar Navigation** (No Changes Needed)

**File:** `/components/Sidebar.tsx`

**Current Setup (Lines 95-96):**
```tsx
{ id: 'leads', label: 'Leads' },
{ id: 'contacts', label: 'Contacts' },
```

**Quick Actions (for future enhancement):**
Could add a "+" icon next to Leads that directly navigates to 'add-lead':
```tsx
{
  id: 'relationships',
  label: 'Relationships',
  icon: Users,
  items: [
    { 
      id: 'leads', 
      label: 'Leads',
      quickAction: { 
        id: 'add-lead', 
        icon: Plus, 
        tooltip: 'Add Lead' 
      }
    },
    { id: 'contacts', label: 'Contacts' },
  ]
}
```

**Decision:** Keep sidebar as-is for now. Users can click "Add Lead" button in workspace header.

---

### **Phase 5: Testing & Validation**

**Duration:** 2 sessions

**5.1: Unit Testing Checklist**

**LeadsWorkspaceV4:**
- [ ] Loads all leads correctly
- [ ] Filters by status work
- [ ] Filters by source work
- [ ] Search works (name, phone, email)
- [ ] Pipeline view displays correctly
- [ ] List view displays correctly
- [ ] View mode switching works
- [ ] Stats calculate correctly
- [ ] Add Lead button navigates to LeadFormV2
- [ ] Show Archived toggle works
- [ ] Export Leads works

**LeadWorkspaceCard:**
- [ ] Displays lead info correctly
- [ ] Lead score badge shows correct color
- [ ] Status badge displays correctly
- [ ] Property interest indicator works
- [ ] Quick actions menu opens
- [ ] View details action works
- [ ] Archive action works

**LeadDetailModal:**
- [ ] Opens with correct lead data
- [ ] Tabs switch correctly
- [ ] Contact info displays
- [ ] Lead score breakdown shows
- [ ] Property interests list correct
- [ ] Activity timeline displays
- [ ] Notes section works
- [ ] Status change actions work
- [ ] Archive action works

**MarkInterestedModal:**
- [ ] Property list loads
- [ ] Multi-select works
- [ ] Offer input works per property
- [ ] Submit updates lead correctly
- [ ] Cancel closes without changes

**ConvertLeadModal:**
- [ ] Property dropdown populates
- [ ] Price input validates
- [ ] Deal type selection works
- [ ] Convert creates deal
- [ ] Convert creates commission
- [ ] Convert updates lead status
- [ ] Navigation to deal details works

**5.2: Integration Testing**

**Lead Scoring Integration:**
- [ ] Lead scores calculate on load
- [ ] Scores update when lead changes
- [ ] Score colors match thresholds
- [ ] Score breakdown displays correctly

**Data Persistence:**
- [ ] Lead CRUD operations work
- [ ] Status changes persist
- [ ] Archive/restore persists
- [ ] Property interests save
- [ ] Offers save correctly

**Navigation Flow:**
- [ ] Leads → Add Lead → Back to Leads
- [ ] Leads → View Details → Close → Back to Leads
- [ ] Leads → Mark Interested → Submit → Stays on Leads
- [ ] Leads → Convert → Submit → Navigate to Deal

**Dashboard Integration:**
- [ ] Dashboard lead widgets still work
- [ ] "New Leads" count correct
- [ ] "Hot Leads" list correct
- [ ] Click lead in dashboard navigates correctly

**FollowUpTasks Integration:**
- [ ] Follow-up tasks for leads display
- [ ] Complete follow-up updates lead
- [ ] Navigate from task to lead works

**5.3: UX Testing**

**Design System Compliance:**
- [ ] Follows 8px grid system
- [ ] Uses CSS variables (no hardcoded colors)
- [ ] No typography classes (text-xl, font-bold) unless intentional
- [ ] StatusBadge used for all statuses
- [ ] MetricCard used for stats (if applicable)
- [ ] Consistent spacing with other V4 workspaces

**5 UX Laws:**
- [ ] **Fitts's Law:** Primary actions are large and easy to click
- [ ] **Miller's Law:** Max 5-7 items in filter groups
- [ ] **Hick's Law:** Progressive disclosure (modals, dropdowns)
- [ ] **Jakob's Law:** Consistent with other workspaces
- [ ] **Aesthetic-Usability Effect:** Clean, professional appearance

**Accessibility:**
- [ ] All buttons have ARIA labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG 2.1 AA

**Responsiveness:**
- [ ] Mobile view works (1 column pipeline)
- [ ] Tablet view works (2-3 column pipeline)
- [ ] Desktop view works (5 column pipeline)
- [ ] Cards stack properly on small screens
- [ ] Modals are scrollable on mobile

---

### **Phase 6: Cleanup & Documentation**

**Duration:** 1 session

**6.1: Remove Old Components**

**Action:** Delete old Leads.tsx after confirming V4 works

**Before Deleting:**
1. Backup old file to `/components/archive/Leads.tsx.backup`
2. Confirm all features migrated
3. Confirm no other components import old Leads.tsx
4. Test entire application

**Command:**
```bash
# Backup
mv /components/Leads.tsx /components/archive/Leads.tsx.backup

# Delete old file (after backup and testing)
# (The LeadsWorkspaceV4 in /components/leads/ is the new version)
```

**6.2: Update Documentation**

**Files to Update:**

1. **Guidelines.md** - Add Leads workspace to component patterns
2. **DESIGN_SYSTEM_INDEX.md** - Reference LeadsWorkspaceV4
3. **README.md** (if exists) - Update component list

**Add to Guidelines.md:**
```markdown
### Leads Management - V4 Workspace Pattern

#### LeadsWorkspaceV4 Component
* **Usage**: Main workspace for lead management
* **Template**: WorkspacePageTemplate
* **Props Required**: user, onNavigate
* **Features**:
  - Pipeline view (5 status columns)
  - List view (table format)
  - Lead scoring visualization
  - Search and filtering (status, source, type, urgency)
  - Integration with LeadFormV2
  - Archive/restore functionality
* **Best Practices**:
  - Use pipeline view for visual sales pipeline
  - Use list view for detailed lead analysis
  - Lead score helps prioritize hot leads
  - Archive "not interested" leads to keep workspace clean
* **Example**:
```tsx
<LeadsWorkspaceV4
  user={user}
  onNavigate={handleNavigation}
/>
```

#### Lead Status Flow
```
New → Contacted → Interested → Converted
  ↓                    ↓
Not Interested (Archived)
```

#### Lead Scoring
* **Hot Lead**: Score 80-100 (Red badge)
* **Warm Lead**: Score 60-79 (Yellow badge)
* **Cold Lead**: Score 0-59 (Gray badge)

Score Components:
- Engagement (interactions, responses)
- Budget match
- Timeline urgency
- Source quality
```

**6.3: Create Migration Guide** (For other developers)

**File:** `/LEADS_MIGRATION_GUIDE.md`

```markdown
# Leads Module Migration Guide
## From Old Leads.tsx to LeadsWorkspaceV4

### What Changed?

**Before (Old Leads.tsx):**
- Custom layout and cards
- Inline "Add Lead" dialog
- ~1400 lines of code
- Inconsistent with other workspaces

**After (LeadsWorkspaceV4):**
- Uses WorkspacePageTemplate
- Navigates to LeadFormV2 for adding leads
- ~800 lines of code (40% reduction)
- Consistent with Properties, Contacts, Deals workspaces

### Breaking Changes

**None!** All functionality preserved.

### New Features

1. **Consistent Design**: Matches other V4 workspaces
2. **Better Empty States**: EmptyStatePresets for each status
3. **Improved Modals**: Extracted to separate components
4. **Enhanced Search**: Unified search bar with filters
5. **Better Stats**: Clearer metrics display

### For Developers

**Importing:**
```tsx
// OLD
import { Leads } from './components/Leads';

// NEW
import { LeadsWorkspaceV4 } from './components/leads/LeadsWorkspaceV4';
```

**Usage:**
```tsx
// Same props, same behavior
<LeadsWorkspaceV4
  user={user}
  onNavigate={handleNavigation}
/>
```

**Related Components:**
- `LeadWorkspaceCard` - Individual lead cards
- `LeadDetailModal` - Full lead details
- `MarkInterestedModal` - Multi-property selection
- `ConvertLeadModal` - Convert to deal
- `LeadFormV2` - Add/edit lead form (unchanged)

### Testing

Run all tests to ensure migration success:
```bash
# Manual testing checklist
- [ ] Load leads workspace
- [ ] View pipeline mode
- [ ] View list mode
- [ ] Search leads
- [ ] Filter by status
- [ ] Filter by source
- [ ] Add new lead (navigates to form)
- [ ] View lead details
- [ ] Change lead status
- [ ] Mark lead as interested
- [ ] Convert lead to deal
- [ ] Archive/restore lead
```
```

---

## **File Structure After Migration**

```
/components/
├─ leads/                                    (NEW DIRECTORY)
│  ├─ LeadsWorkspaceV4.tsx                   (NEW - Main workspace)
│  ├─ LeadWorkspaceCard.tsx                  (NEW - Card component)
│  ├─ LeadDetailModal.tsx                    (NEW - Detail view)
│  ├─ MarkInterestedModal.tsx                (NEW - Extracted modal)
│  ├─ ConvertLeadModal.tsx                   (NEW - Extracted modal)
│  └─ index.ts                               (NEW - Barrel export)
│
├─ LeadFormV2.tsx                            (KEEP - Already V4.1 compliant)
├─ Leads.tsx                                 (DELETE after testing)
├─ FollowUpTasks.tsx                         (UPDATE if needed)
└─ Dashboard.tsx                             (UPDATE lead widget references)

/components/archive/
└─ Leads.tsx.backup                          (BACKUP of old file)
```

---

## **Success Metrics**

### **Code Quality**
- [ ] 40%+ code reduction (1400 → 800 lines)
- [ ] No duplicate code
- [ ] All TypeScript strict mode compliant
- [ ] Zero console errors/warnings
- [ ] All ESLint rules passing

### **Design System Compliance**
- [ ] Uses WorkspacePageTemplate
- [ ] Follows 8px grid system
- [ ] Uses CSS variables
- [ ] No typography classes (unless intentional)
- [ ] Consistent with other V4 workspaces

### **Functionality**
- [ ] All existing features work
- [ ] No regressions
- [ ] Lead scoring intact
- [ ] Status changes work
- [ ] Archive/restore works
- [ ] Integration with LeadFormV2 works
- [ ] Dashboard widgets work
- [ ] FollowUpTasks integration works

### **UX/Performance**
- [ ] Loads in < 1 second
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Mobile responsive
- [ ] Keyboard navigable
- [ ] WCAG 2.1 AA compliant

---

## **Risk Mitigation**

### **Risk 1: Breaking Lead Scoring**
**Mitigation:** 
- Test lead scoring thoroughly in Phase 5
- Keep original scoring functions unchanged
- Add scoring to LeadWorkspaceCard display

### **Risk 2: Lost Functionality**
**Mitigation:**
- Complete feature audit in Phase 1
- Checklist every feature during migration
- Keep old Leads.tsx as backup until fully tested

### **Risk 3: Dashboard/FollowUpTasks Breaking**
**Mitigation:**
- Test all integrations in Phase 5.2
- Update references gradually
- Test each integration independently

### **Risk 4: Data Loss**
**Mitigation:**
- No data model changes
- Only UI changes
- Backup localStorage before testing
- Test data persistence thoroughly

### **Risk 5: User Confusion**
**Mitigation:**
- Design is more consistent, not radically different
- Navigation pattern matches other workspaces
- Add tooltips/help text where needed
- Create user guide if needed

---

## **Timeline Estimate**

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Audit** | 1 session (2h) | Feature inventory document |
| **Phase 2: Create Components** | 3 sessions (6h) | 5 new components created |
| **Phase 3: Update App.tsx** | 0.5 session (1h) | Navigation working |
| **Phase 4: Sidebar** | 0 session | No changes needed |
| **Phase 5: Testing** | 2 sessions (4h) | All tests passing |
| **Phase 6: Cleanup** | 1 session (2h) | Documentation updated |
| **TOTAL** | **7.5 sessions** | **Fully migrated module** |

**Estimated Total Time:** 15 hours

---

## **Implementation Order**

### **Session 1: Preparation**
1. Read current Leads.tsx completely
2. Document all features
3. Study PropertiesWorkspaceV4
4. Create feature checklist

### **Session 2-3: Core Components**
1. Create LeadWorkspaceCard
2. Create LeadDetailModal
3. Test both components in isolation

### **Session 4: Modals**
1. Extract MarkInterestedModal
2. Extract ConvertLeadModal
3. Test both modals

### **Session 5-6: Main Workspace**
1. Create LeadsWorkspaceV4
2. Implement pipeline view
3. Implement list view
4. Wire up all modals

### **Session 7: Integration**
1. Update App.tsx
2. Test navigation flow
3. Test LeadFormV2 integration

### **Session 8: Testing**
1. Run all unit tests
2. Test integrations
3. Test UX and accessibility
4. Fix any issues

### **Session 9: Finalize**
1. Cleanup old files
2. Update documentation
3. Final testing
4. Deploy

---

## **Rollback Plan**

If critical issues found after deployment:

**Step 1:** Restore old Leads.tsx
```tsx
// In App.tsx
case 'leads':
  return <Leads user={user} onNavigate={handleNavigation} />;
```

**Step 2:** Investigate issues

**Step 3:** Fix and re-deploy

**Step 4:** Keep both versions available during transition period if needed

---

## **Post-Migration Enhancements** (Future)

After successful migration, consider:

1. **Lead Detail Page** (Full page instead of modal)
   - Use DetailPageTemplate
   - More space for information
   - Better for complex lead profiles

2. **Advanced Lead Scoring**
   - Machine learning predictions
   - Historical conversion data
   - Market trend integration

3. **Lead Assignment**
   - Auto-assign based on location
   - Round-robin assignment
   - Load balancing

4. **Lead Nurturing Automation**
   - Auto-follow-up sequences
   - Email templates
   - WhatsApp integration

5. **Lead Import/Export**
   - CSV import
   - Excel export
   - Integration with marketing tools

---

## **Conclusion**

This migration plan provides a comprehensive, step-by-step approach to modernizing the Leads module to Design System V4.1. By following this plan:

✅ **Zero functional regressions**  
✅ **Consistent design across agency module**  
✅ **Improved maintainability (40% less code)**  
✅ **Better UX through template patterns**  
✅ **Future-proof architecture**

The migration is **low-risk** because:
- All changes are UI-only (no data model changes)
- Old component backed up
- Comprehensive testing plan
- Clear rollback strategy

**Ready to proceed with implementation!**

---

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1 (Audit)
3. Execute phases sequentially
4. Test thoroughly at each phase
5. Deploy with confidence

---

*Last Updated: January 2025*  
*Document Version: 1.0*  
*Author: Development Team*
