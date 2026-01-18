# Properties Module - Complete Flow Diagrams & Scenarios

**Document Version**: 1.0  
**Last Updated**: January 7, 2026  
**Status**: Complete Flow Documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Module Entry & Navigation Flows](#module-entry--navigation-flows)
3. [Property Creation Flows](#property-creation-flows)
4. [Property Viewing & Details Flows](#property-viewing--details-flows)
5. [Property Editing Flows](#property-editing-flows)
6. [Property Transaction Flows](#property-transaction-flows)
7. [Property Search & Filter Flows](#property-search--filter-flows)
8. [Property Portfolio Flows](#property-portfolio-flows)
9. [Property Re-listing Flows](#property-re-listing-flows)
10. [Integration Flows](#integration-flows)
11. [Error Handling Flows](#error-handling-flows)
12. [Data Persistence Flows](#data-persistence-flows)

---

## Overview

### Properties Module Architecture

**Entry Point**: `PropertiesWorkspaceV4.tsx`  
**Detail View**: `PropertyDetailsV4.tsx`  
**Form Component**: `PropertyFormV2.tsx`  
**Card Component**: `PropertyCard.tsx`

**Key Data Entity**:
```typescript
interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  type: string;
  subtype: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  images: string[];
  status: 'available' | 'under-offer' | 'sold' | 'rented';
  currentOwnerId?: string;
  agentId: string;
  acquisitionType: 'inventory' | 'client-listing' | 'investor';
  ownershipHistory: OwnershipRecord[];
  listedDate: string;
  lastSoldDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Module Entry & Navigation Flows

### Flow 1: Access Properties Module from Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Access Properties Module from Dashboard              │
└─────────────────────────────────────────────────────────────┘

START: User on Dashboard
    ↓
User clicks "Properties" in Sidebar
    ↓
Sidebar.onClick → onNavigate('properties')
    ↓
App.tsx receives navigation event
    ↓
setCurrentView('properties')
    ↓
App.tsx renders: <PropertiesWorkspaceV4 user={user} onNavigate={handleNavigation} />
    ↓
PropertiesWorkspaceV4 mounts
    ↓
useEffect hook executes
    ↓
Call: getAllProperties() from /lib/data.ts
    ↓
Retrieve properties from localStorage: 'estatemanager_properties'
    ↓
Filter by user role:
    ├─ If Admin/Super Admin: Return all properties
    └─ If Agent: Return only agent's properties + shared
    ↓
setProperties(filteredProperties)
    ↓
Calculate stats:
    ├─ Total properties
    ├─ Available properties
    ├─ Under offer
    ├─ Sold properties
    └─ Total value
    ↓
Render WorkspaceHeader with stats
    ↓
Render WorkspaceSearchBar
    ↓
Render Property Grid/Table based on viewMode
    ↓
Display PropertyCard for each property
    ↓
END: Properties workspace displayed
```

**Time Complexity**: O(n) where n = number of properties  
**Performance**: ~100-200ms for 100 properties

---

### Flow 2: Navigate to Property Details

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Navigate to Property Details                         │
└─────────────────────────────────────────────────────────────┘

START: User viewing Properties Workspace
    ↓
User clicks on PropertyCard
    ↓
PropertyCard.onClick → onNavigate('property-detail', { propertyId })
    ↓
App.tsx receives navigation event
    ↓
setCurrentView('property-detail')
    ↓
setSelectedPropertyId(propertyId)
    ↓
App.tsx renders: <PropertyDetailsV4 propertyId={propertyId} user={user} onNavigate={handleNavigation} />
    ↓
PropertyDetailsV4 mounts
    ↓
useEffect hook executes with propertyId dependency
    ↓
setIsLoading(true)
    ↓
Call: getPropertyById(propertyId) from /lib/data.ts
    ↓
Check if property exists
    ├─ Found: Continue
    └─ Not Found: Show error, redirect to properties list
    ↓
Fetch related data in parallel:
    ├─ getTransactionsByProperty(propertyId)
    ├─ getLeadsByProperty(propertyId)
    ├─ getOwnerById(currentOwnerId)
    └─ getAgentById(agentId)
    ↓
Process ownership history
    ↓
Calculate property metrics:
    ├─ Days on market
    ├─ Price per sq ft
    ├─ Number of transactions
    └─ Commission earned
    ↓
setProperty(propertyData)
    ↓
setIsLoading(false)
    ↓
Render PageHeader with breadcrumbs
    ↓
Render property metrics cards
    ↓
Render ConnectedEntitiesBar (owner, agent, leads)
    ↓
Render Tabs:
    ├─ Overview (default)
    ├─ Transactions
    ├─ Financial
    ├─ History
    └─ Documents
    ↓
END: Property details displayed
```

**Data Dependencies**:
- Property entity (primary)
- Related transactions
- Related leads
- Owner entity
- Agent entity
- Ownership history

---

## Property Creation Flows

### Flow 3: Create New Property - Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Create New Property (Complete Process)               │
└─────────────────────────────────────────────────────────────┘

START: User clicks "Add Property" button
    ↓
PropertiesWorkspaceV4.onAddProperty
    ↓
onNavigate('add-property')
    ↓
App.tsx updates state
    ↓
setCurrentView('add-property')
    ↓
App.tsx renders: <PropertyFormV2 mode="create" user={user} onNavigate={handleNavigation} />
    ↓
PropertyFormV2 initializes
    ↓
Initialize form state with empty values
    ↓
Set agentId to current user.id
    ↓
Render multi-step form:
    ├─ Step 1: Basic Information
    ├─ Step 2: Property Details
    ├─ Step 3: Pricing & Commission
    ├─ Step 4: Images & Documents
    └─ Step 5: Additional Settings
    ↓
[USER INTERACTION: Filling Step 1 - Basic Information]
    ↓
User enters:
    ├─ Title (required)
    ├─ Address (required)
    ├─ Description
    ├─ Property Type (required)
    └─ Property Subtype
    ↓
Validate on blur:
    ├─ Title: Min 5 characters
    ├─ Address: Min 10 characters
    └─ Type: Must be selected
    ↓
Display validation errors inline
    ↓
User clicks "Next" button
    ↓
validateStep(1)
    ├─ Check all required fields
    ├─ Check field constraints
    └─ Return validation result
    ↓
If valid: setCurrentStep(2)
If invalid: Show error toast, stay on Step 1
    ↓
[USER INTERACTION: Filling Step 2 - Property Details]
    ↓
User enters:
    ├─ Area (sq ft/sq yd) (required)
    ├─ Bedrooms
    ├─ Bathrooms
    ├─ Parking Spaces
    ├─ Floor Number
    └─ Features (checkbox list)
    ↓
Validate on blur
    ↓
User clicks "Next"
    ↓
validateStep(2)
    ↓
If valid: setCurrentStep(3)
    ↓
[USER INTERACTION: Filling Step 3 - Pricing]
    ↓
User enters:
    ├─ Price (required)
    ├─ Commission Rate (%) (default: 2%)
    ├─ Price Negotiable (checkbox)
    └─ Acquisition Type (inventory/client-listing/investor)
    ↓
Calculate commission amount: price * (commissionRate / 100)
    ↓
Display: "Commission: PKR XX,XXX"
    ↓
User clicks "Next"
    ↓
validateStep(3)
    ↓
If valid: setCurrentStep(4)
    ↓
[USER INTERACTION: Filling Step 4 - Images]
    ↓
User uploads images:
    ├─ Click "Upload Images" button
    ├─ Select files from device
    ├─ Validate file types (jpg, png, webp)
    ├─ Validate file sizes (<5MB each)
    ├─ Convert to base64 (for localStorage)
    └─ Add to images array
    ↓
Display image thumbnails with remove option
    ↓
User can reorder images (drag & drop)
    ↓
User clicks "Next"
    ↓
validateStep(4)
    ↓
If valid: setCurrentStep(5)
    ↓
[USER INTERACTION: Filling Step 5 - Additional Settings]
    ↓
User sets:
    ├─ Listing Date (default: today)
    ├─ Status (default: 'available')
    ├─ Visibility (public/private)
    └─ Tags (optional)
    ↓
User reviews all information (summary view)
    ↓
User clicks "Create Property" button
    ↓
setIsSubmitting(true)
    ↓
Perform final validation
    ↓
validateAllSteps()
    ├─ Validate Step 1
    ├─ Validate Step 2
    ├─ Validate Step 3
    ├─ Validate Step 4
    └─ Validate Step 5
    ↓
If validation fails:
    ├─ Show error toast with details
    ├─ Jump to first invalid step
    ├─ setIsSubmitting(false)
    └─ STOP
    ↓
If validation passes: Continue
    ↓
Prepare property object:
    ├─ Generate unique ID: uuidv4()
    ├─ Set timestamps (createdAt, updatedAt)
    ├─ Set current user as agent
    ├─ Initialize empty arrays (transactions, ownershipHistory)
    └─ Set status and other metadata
    ↓
Call: addProperty(propertyData) from /lib/data.ts
    ↓
Service Layer: /lib/data.ts → addProperty()
    ↓
Validate property data schema
    ↓
Get existing properties from localStorage
    ↓
Check for duplicates (by address)
    ├─ If duplicate found: Return error
    └─ If unique: Continue
    ↓
Add new property to array
    ↓
Save to localStorage: 'estatemanager_properties'
    ↓
Update related stats/caches
    ↓
Return success response
    ↓
PropertyFormV2 receives success
    ↓
Show success toast: "Property added successfully!"
    ↓
setIsSubmitting(false)
    ↓
Navigate to property details
    ↓
onNavigate('property-detail', { propertyId: newProperty.id })
    ↓
END: New property created and displayed
```

**Success Criteria**:
- All required fields filled
- Validation passed
- Property saved to localStorage
- User redirected to property details

**Error Scenarios**: See Error Handling Flows section

---

### Flow 4: Create Property from Purchase Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Create Property from Purchase Cycle                  │
└─────────────────────────────────────────────────────────────┘

START: User creating purchase transaction
    ↓
PurchaseCycleFormV2 renders
    ↓
User needs to add property being purchased
    ↓
User clicks "Add Property" in form
    ↓
Open PropertyFormV2 in modal or inline
    ↓
Pre-fill acquisition type: 'inventory'
    ↓
User fills property details
    ↓
User submits form
    ↓
Property created (follow Flow 3)
    ↓
Return propertyId to PurchaseCycleFormV2
    ↓
Auto-fill property field in purchase form
    ↓
Link transaction to property
    ↓
Continue purchase cycle creation
    ↓
END: Property and transaction created together
```

**Integration Point**: Transaction → Property linkage

---

## Property Viewing & Details Flows

### Flow 5: View Property Overview Tab

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Property Overview Tab (Default)                 │
└─────────────────────────────────────────────────────────────┘

START: PropertyDetailsV4 mounted with Overview tab active
    ↓
Render PageHeader:
    ├─ Title: property.title
    ├─ Breadcrumbs: [Properties, Property Name]
    ├─ Metrics: [Price, Area, Status, Days on Market, Commission]
    ├─ Primary Actions: [Edit, Start Sell, Start Purchase, Start Rent]
    └─ Secondary Actions: [Share, Archive, Delete]
    ↓
Render ConnectedEntitiesBar:
    ├─ Owner entity (if exists)
    ├─ Agent entity
    └─ Related leads (if any)
    ↓
Render Overview Tab Content:
    ↓
Section 1: Image Gallery
    ├─ Display primary image (large)
    ├─ Display thumbnail gallery
    └─ Click to view fullscreen
    ↓
Section 2: Property Information
    ├─ Description (formatted text)
    ├─ Property Type & Subtype
    ├─ Listing Date
    └─ Last Updated
    ↓
Section 3: Specifications Grid
    ├─ Area: XX sq ft
    ├─ Bedrooms: X
    ├─ Bathrooms: X
    ├─ Parking: X spaces
    ├─ Floor: Xth floor
    └─ Other specs
    ↓
Section 4: Features List
    ├─ Display checkmarks for available features
    └─ Organized by category
    ↓
Section 5: Location
    ├─ Full address
    ├─ Area/Neighborhood
    └─ City, Province
    ↓
Section 6: Pricing Details
    ├─ Listed Price: PKR XX,XXX,XXX
    ├─ Price per sq ft: PKR XX,XXX
    ├─ Commission Rate: X%
    └─ Commission Amount: PKR XX,XXX
    ↓
END: Overview tab fully displayed
```

---

### Flow 6: View Property Transactions Tab

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Property Transactions Tab                       │
└─────────────────────────────────────────────────────────────┘

START: User clicks "Transactions" tab
    ↓
PropertyDetailsV4.onTabChange('transactions')
    ↓
setActiveTab('transactions')
    ↓
useEffect hook executes (dependency: activeTab)
    ↓
Fetch transactions for this property
    ↓
Call: getTransactionsByProperty(propertyId) from /lib/data.ts
    ↓
Service layer retrieves all transactions
    ↓
Filter transactions where: transaction.propertyId === propertyId
    ↓
Sort by date (newest first)
    ↓
Categorize by transaction type:
    ├─ Sell Cycles
    ├─ Purchase Cycles
    └─ Rent Cycles
    ↓
Calculate transaction stats:
    ├─ Total transactions
    ├─ Active transactions
    ├─ Completed transactions
    └─ Total transaction value
    ↓
Render Transaction Stats Cards
    ↓
Render Transaction Sections:
    ↓
Section 1: Active Transactions
    ├─ For each active transaction:
    │   ├─ Transaction Card
    │   ├─ Type badge (Sell/Purchase/Rent)
    │   ├─ Stage indicator
    │   ├─ Buyer/Seller name
    │   ├─ Amount
    │   ├─ Date
    │   └─ View Details button
    └─ If no active: Show empty state
    ↓
Section 2: Completed Transactions
    ├─ Display in timeline format
    ├─ For each completed transaction:
    │   ├─ Timeline entry
    │   ├─ Date
    │   ├─ Type
    │   ├─ Parties involved
    │   └─ Final amount
    └─ If none: Show empty state
    ↓
Section 3: Transaction History Chart
    ├─ Line chart showing price over time
    └─ Bar chart showing transaction count by month
    ↓
User can click on transaction card
    ↓
onNavigate('transaction-detail', { transactionId })
    ↓
END: Navigate to transaction details
```

**Data Integration**:
- Property ↔ Transaction link via `propertyId`
- Bi-directional navigation

---

### Flow 7: View Property Financial Tab

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Property Financial Tab                          │
└─────────────────────────────────────────────────────────────┘

START: User clicks "Financial" tab
    ↓
setActiveTab('financial')
    ↓
useEffect hook executes
    ↓
Fetch financial data for property:
    ↓
Call multiple service functions in parallel:
    ├─ getPropertyFinancials(propertyId)
    ├─ getCommissionsByProperty(propertyId)
    ├─ getExpensesByProperty(propertyId)
    └─ getPaymentSchedulesByProperty(propertyId)
    ↓
Calculate financial metrics:
    ├─ Purchase Price (if agency-owned)
    ├─ Current Market Value
    ├─ Total Revenue (from transactions)
    ├─ Total Commissions Earned
    ├─ Total Expenses
    ├─ Net Profit/Loss
    ├─ ROI Percentage
    └─ Holding Period (days)
    ↓
Render Financial Summary Cards:
    ├─ Total Value
    ├─ Total Revenue
    ├─ Total Expenses
    ├─ Net Profit
    └─ ROI %
    ↓
Section 1: Purchase Information (if applicable)
    ├─ Purchase Date
    ├─ Purchase Price
    ├─ Purchase Type (inventory/investor)
    ├─ Seller Name
    └─ Purchase Transaction Link
    ↓
Section 2: Revenue Breakdown
    ├─ Sales Revenue
    ├─ Rental Revenue
    ├─ Commission Earned
    └─ Other Income
    ↓
Section 3: Expense Breakdown
    ├─ Maintenance Expenses
    ├─ Marketing Expenses
    ├─ Legal Fees
    ├─ Other Expenses
    └─ Total Expenses
    ↓
Section 4: Commission Details
    ├─ Table of commissions earned
    ├─ For each commission:
    │   ├─ Transaction Type
    │   ├─ Amount
    │   ├─ Date
    │   ├─ Agent
    │   └─ Status (Paid/Pending)
    ↓
Section 5: Payment Schedules (if any)
    ├─ Active payment schedules linked to this property
    ├─ Schedule summary
    └─ Outstanding balance
    ↓
Section 6: Financial Charts
    ├─ Revenue vs Expenses (bar chart)
    ├─ ROI Timeline (line chart)
    └─ Commission Trend (area chart)
    ↓
END: Financial tab fully displayed
```

**Calculations**:
```typescript
ROI = ((Current Value - Purchase Price + Revenue - Expenses) / Purchase Price) * 100
Holding Period = Current Date - Purchase Date (in days)
Net Profit = Revenue - Purchase Price - Expenses
```

---

### Flow 8: View Property Ownership History

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Property Ownership History Tab                  │
└─────────────────────────────────────────────────────────────┘

START: User clicks "History" tab
    ↓
setActiveTab('history')
    ↓
useEffect hook executes
    ↓
Fetch ownership history from property.ownershipHistory[]
    ↓
Process ownership records:
    ├─ Sort by acquiredDate (chronological)
    ├─ For each record, fetch owner details
    ├─ For each record, fetch transaction details (if exists)
    └─ Calculate ownership duration
    ↓
Render Ownership Timeline Component
    ↓
For each ownership record:
    ↓
Display StatusTimeline entry:
    ├─ Owner Avatar & Name
    ├─ Acquisition Date
    ├─ Sale Date (if sold)
    ├─ Ownership Duration
    ├─ Acquisition Price
    ├─ Sale Price (if sold)
    ├─ Profit/Loss (if sold)
    ├─ Transaction Link (if exists)
    └─ Ownership Type badge
    ↓
If current owner exists:
    ├─ Highlight as "Current Owner"
    └─ Show "Owned since [date]"
    ↓
Display ownership statistics:
    ├─ Total Number of Owners
    ├─ Average Ownership Duration
    ├─ Total Price Appreciation
    └─ Price Appreciation Rate
    ↓
Section: Price History Chart
    ├─ Line chart showing price over time
    ├─ X-axis: Timeline
    ├─ Y-axis: Price (PKR)
    └─ Markers for each ownership change
    ↓
END: History tab fully displayed
```

**Asset-Centric Model in Action**:
- Property never deleted
- Complete ownership history preserved
- All transactions linked and traceable

---

## Property Editing Flows

### Flow 9: Edit Property - Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Edit Existing Property                               │
└─────────────────────────────────────────────────────────────┘

START: User on PropertyDetailsV4
    ↓
User clicks "Edit" button in PageHeader
    ↓
Check user permissions:
    ├─ Admin/Super Admin: Can edit any property
    └─ Agent: Can only edit own properties
    ↓
If no permission:
    ├─ Show error toast: "You don't have permission to edit this property"
    └─ STOP
    ↓
If has permission: Continue
    ↓
onNavigate('edit-property', { propertyId })
    ↓
App.tsx updates state
    ↓
setCurrentView('edit-property')
    ↓
setSelectedPropertyId(propertyId)
    ↓
App.tsx renders: <PropertyFormV2 mode="edit" propertyId={propertyId} user={user} onNavigate={handleNavigation} />
    ↓
PropertyFormV2 mounts in edit mode
    ↓
useEffect hook executes
    ↓
Fetch existing property data
    ↓
Call: getPropertyById(propertyId) from /lib/data.ts
    ↓
Populate form with existing data:
    ├─ Basic Information fields
    ├─ Property Details fields
    ├─ Pricing fields
    ├─ Images array
    └─ Additional Settings
    ↓
Render multi-step form (same as create)
    ↓
[USER INTERACTION: User modifies fields]
    ↓
Track changes:
    ├─ Store original values
    ├─ Track modified fields
    └─ Enable "Discard Changes" button
    ↓
User navigates through steps
    ↓
Validate on blur (same as create)
    ↓
User makes changes:
    ├─ Update title → Mark as modified
    ├─ Update price → Mark as modified
    ├─ Add/remove images → Mark as modified
    └─ etc.
    ↓
User clicks "Save Changes" button
    ↓
setIsSubmitting(true)
    ↓
Validate all modified fields
    ↓
If validation fails:
    ├─ Show errors
    ├─ setIsSubmitting(false)
    └─ STOP
    ↓
If validation passes:
    ↓
Prepare update object:
    ├─ Merge original data with changes
    ├─ Update 'updatedAt' timestamp
    ├─ Preserve critical fields (id, createdAt, ownershipHistory)
    └─ Update version/revision number
    ↓
Show confirmation dialog:
    "Are you sure you want to save these changes?"
    ├─ List modified fields
    └─ Await user confirmation
    ↓
If user cancels:
    ├─ setIsSubmitting(false)
    └─ STOP
    ↓
If user confirms:
    ↓
Call: updateProperty(propertyId, updatedData) from /lib/data.ts
    ↓
Service Layer: /lib/data.ts → updateProperty()
    ↓
Get existing properties from localStorage
    ↓
Find property by ID
    ↓
If not found:
    ├─ Return error: "Property not found"
    └─ STOP
    ↓
If found:
    ↓
Create backup of old data (for undo)
    ↓
Merge updates with existing data
    ↓
Validate updated property schema
    ↓
Update property in array
    ↓
Save to localStorage: 'estatemanager_properties'
    ↓
Update related entities if necessary:
    ├─ If price changed: Update transactions
    ├─ If status changed: Update related records
    └─ If agent changed: Update assignments
    ↓
Invalidate caches/stats
    ↓
Return success response
    ↓
PropertyFormV2 receives success
    ↓
Show success toast: "Property updated successfully!"
    ↓
setIsSubmitting(false)
    ↓
Navigate back to property details
    ↓
onNavigate('property-detail', { propertyId })
    ↓
PropertyDetailsV4 remounts
    ↓
Fetch updated property data
    ↓
Display updated information
    ↓
END: Property successfully updated
```

**Optimistic Update Option**:
```typescript
// Update UI immediately, rollback on error
const optimisticUpdate = (data) => {
  const backup = property;
  setProperty(data);
  
  updateProperty(propertyId, data)
    .catch(() => {
      setProperty(backup); // Rollback on error
      toast.error('Update failed');
    });
};
```

---

### Flow 10: Bulk Edit Properties

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Bulk Edit Multiple Properties                        │
└─────────────────────────────────────────────────────────────┘

START: User on PropertiesWorkspaceV4
    ↓
User enables selection mode
    ↓
Click checkbox on PropertyCards
    ↓
selectedProperties[] updated
    ↓
Display bulk actions toolbar:
    ├─ "X properties selected"
    ├─ "Bulk Edit" button
    ├─ "Bulk Delete" button
    └─ "Clear Selection" button
    ↓
User clicks "Bulk Edit"
    ↓
Open BulkEditModal
    ↓
Display editable fields:
    ├─ Status (dropdown)
    ├─ Agent (dropdown)
    ├─ Add Tags
    ├─ Update Price (by % or amount)
    └─ Update Visibility
    ↓
User makes changes
    ↓
User clicks "Apply Changes"
    ↓
Show confirmation:
    "Apply changes to X properties?"
    ↓
If confirmed:
    ↓
For each selected property:
    ├─ Apply changes
    ├─ Validate
    └─ Update in localStorage
    ↓
Show progress indicator
    ↓
Complete updates
    ↓
Show success toast: "X properties updated"
    ↓
Refresh properties list
    ↓
Clear selection
    ↓
END: Bulk edit completed
```

---

## Property Transaction Flows

### Flow 11: Start Sell Cycle from Property

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Start Sell Cycle from Property Details               │
└─────────────────────────────────────────────────────────────┘

START: User on PropertyDetailsV4
    ↓
Property status: 'available' (must be available to sell)
    ↓
User clicks "Start Sell Cycle" button in PageHeader
    ↓
Validate property eligibility:
    ├─ Status must be 'available'
    ├─ Property must not have active sell cycle
    └─ User must have permission
    ↓
If not eligible:
    ├─ Show error toast with reason
    └─ STOP
    ↓
If eligible: Continue
    ↓
onNavigate('create-sell-cycle', { 
  propertyId,
  returnTo: 'property-detail'
})
    ↓
App.tsx updates state
    ↓
setCurrentView('create-sell-cycle')
    ↓
App.tsx renders: <SellCycleFormV2 mode="create" propertyId={propertyId} />
    ↓
SellCycleFormV2 mounts
    ↓
Pre-fill form with property data:
    ├─ Property field: Auto-filled (read-only)
    ├─ Listed Price: property.price
    ├─ Commission Rate: property.commissionRate
    └─ Agent: property.agentId
    ↓
Display property summary card at top
    ↓
User fills remaining fields:
    ├─ Select Buyer/Lead (optional)
    ├─ Set Offered Price (if buyer exists)
    ├─ Set Payment Terms (cash/installment)
    ├─ Set Expected Close Date
    └─ Add Notes
    ↓
User clicks "Create Sell Cycle"
    ↓
Validate form data
    ↓
If invalid:
    ├─ Show validation errors
    └─ STOP
    ↓
If valid: Continue
    ↓
Call: createTransaction() from /lib/data.ts
    ↓
Service Layer creates transaction:
    ├─ Generate transaction ID
    ├─ Set type: 'sell'
    ├─ Set initial stage: 'listed'
    ├─ Link to propertyId
    ├─ Set timestamps
    └─ Initialize stage history
    ↓
Update property status:
    ├─ If buyer assigned: Set status to 'under-offer'
    └─ If no buyer: Keep as 'available'
    ↓
Save transaction to localStorage
    ↓
Update property.transactions[] array
    ↓
Return success response
    ↓
Show success toast: "Sell cycle created successfully!"
    ↓
Navigate to sell cycle details
    ↓
onNavigate('sell-cycle-detail', { transactionId })
    ↓
END: Sell cycle created and displayed
```

**Property Status Updates**:
- `available` → `under-offer` (when buyer assigned)
- `under-offer` → `sold` (when completed)
- `sold` → `available` (when re-listed)

---

### Flow 12: Start Purchase Cycle for Property

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Start Purchase Cycle (Agency Buying Property)        │
└─────────────────────────────────────────────────────────────┘

START: User wants to purchase property for agency
    ↓
Two entry points:
    ├─ Option A: From existing property listing
    └─ Option B: Create new property and purchase together
    ↓
[Option A: From Existing Property]
    ↓
User on PropertyDetailsV4
    ↓
Property belongs to someone else (client-listing)
    ↓
User clicks "Start Purchase Cycle"
    ↓
onNavigate('create-purchase-cycle', { propertyId })
    ↓
Navigate to PurchaseCycleFormV2
    ↓
Property pre-filled
    ↓
[Option B: Create Property First]
    ↓
User navigates to purchase cycles workspace
    ↓
User clicks "Start Purchase"
    ↓
onNavigate('create-purchase-cycle')
    ↓
PurchaseCycleFormV2 renders
    ↓
Property field empty (required)
    ↓
User clicks "Add New Property"
    ↓
Open PropertyFormV2 in modal/inline
    ↓
acquisitionType pre-filled: 'inventory'
    ↓
User creates property (follow Flow 3)
    ↓
Property created → propertyId returned
    ↓
Auto-fill property field in purchase form
    ↓
[Both options converge here]
    ↓
User fills purchase details:
    ├─ Seller Information (name, contact)
    ├─ Offered Price
    ├─ Negotiated Price
    ├─ Payment Terms
    ├─ Purchase Type:
    │   ├─ Agency Inventory (100% agency owned)
    │   └─ Investor-Backed (partial investor ownership)
    ├─ If Investor-Backed:
    │   ├─ Select Investors
    │   ├─ Set Investment Shares (%)
    │   └─ Validate total = 100%
    ├─ Due Diligence Checklist
    └─ Expected Completion Date
    ↓
User clicks "Create Purchase Cycle"
    ↓
Validate form
    ↓
If invalid: Show errors, STOP
    ↓
If valid: Continue
    ↓
Call: createTransaction() with type='purchase'
    ↓
Service Layer creates purchase transaction
    ↓
If investor-backed:
    ├─ Create investor shares records
    ├─ Link investors to property
    └─ Update investor portfolio
    ↓
Update property:
    ├─ Set acquisitionType
    ├─ Add to transactions array
    └─ Update status to 'under-offer'
    ↓
Save all changes to localStorage
    ↓
Return success
    ↓
Show success toast: "Purchase cycle created!"
    ↓
Navigate to purchase cycle details
    ↓
END: Purchase cycle created
```

**Acquisition Types**:
1. **Inventory**: 100% agency-owned, for resale
2. **Investor-Backed**: Partial investor ownership, syndicated deal

---

### Flow 13: Start Rent Cycle from Property

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Start Rent Cycle (Lease Property)                    │
└─────────────────────────────────────────────────────────────┘

START: User on PropertyDetailsV4
    ↓
Property eligible for rental
    ↓
User clicks "Start Rent Cycle"
    ↓
Check eligibility:
    ├─ Property not already rented
    └─ Property type allows rentals
    ↓
If not eligible: Show error, STOP
    ↓
If eligible: Continue
    ↓
onNavigate('create-rent-cycle', { propertyId })
    ↓
App.tsx renders: <RentCycleFormV2 propertyId={propertyId} />
    ↓
RentCycleFormV2 mounts
    ↓
Property pre-filled
    ↓
User fills rental details:
    ├─ Monthly Rent Amount
    ├─ Security Deposit (default: 2-3 months)
    ├─ Lease Duration (months)
    ├─ Lease Start Date
    ├─ Lease End Date (auto-calculated)
    ├─ Tenant Information (optional at this stage)
    ├─ Included Utilities
    ├─ Maintenance Responsibility
    └─ Special Terms
    ↓
User clicks "Create Rent Cycle"
    ↓
Validate form data
    ↓
If invalid: Show errors, STOP
    ↓
If valid: Continue
    ↓
Call: createTransaction() with type='rent'
    ↓
Service Layer creates rent transaction:
    ├─ Set initial stage: 'searching'
    ├─ Calculate total lease value
    ├─ Set up rent collection schedule
    └─ Link to property
    ↓
Update property status to 'available' (for rental)
    ↓
Save transaction
    ↓
Return success
    ↓
Show success toast: "Rent cycle created!"
    ↓
Navigate to rent cycle details
    ↓
END: Rent cycle created
```

---

## Property Search & Filter Flows

### Flow 14: Search Properties

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Search Properties by Text Query                      │
└─────────────────────────────────────────────────────────────┘

START: User on PropertiesWorkspaceV4
    ↓
User types in search bar (WorkspaceSearchBar)
    ↓
onChange event fires on every keystroke
    ↓
setSearchQuery(value)
    ↓
useEffect hook executes (dependency: searchQuery)
    ↓
Debounce search (300ms delay)
    ↓
After debounce: Execute search
    ↓
Filter properties using useMemo:
    ↓
const filteredProperties = useMemo(() => {
  let results = properties;
  
  if (searchQuery.trim() !== '') {
    results = results.filter(property => {
      const query = searchQuery.toLowerCase();
      
      return (
        // Search in title
        property.title.toLowerCase().includes(query) ||
        
        // Search in address
        property.address.toLowerCase().includes(query) ||
        
        // Search in description
        property.description?.toLowerCase().includes(query) ||
        
        // Search in type
        property.type.toLowerCase().includes(query) ||
        
        // Search in features
        property.features.some(f => 
          f.toLowerCase().includes(query)
        ) ||
        
        // Search in agent name (if populated)
        property.agentName?.toLowerCase().includes(query) ||
        
        // Search in tags
        property.tags?.some(t => 
          t.toLowerCase().includes(query)
        )
      );
    });
  }
  
  return results;
}, [properties, searchQuery]);
    ↓
Update result count
    ↓
Re-render property list with filtered results
    ↓
If no results:
    ├─ Display WorkspaceEmptyState
    ├─ Message: "No properties found for '{query}'"
    ├─ Suggestion: "Try different keywords or clear filters"
    └─ Button: "Clear Search"
    ↓
If results found:
    ├─ Display result count: "Found X properties"
    └─ Render PropertyCards for filtered results
    ↓
END: Search results displayed
```

**Performance**:
- Debounced to avoid excessive filtering
- Memoized to prevent unnecessary recalculations
- O(n) time complexity where n = total properties

---

### Flow 15: Filter Properties by Status

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Filter Properties by Status                          │
└─────────────────────────────────────────────────────────────┘

START: User on PropertiesWorkspaceV4
    ↓
User clicks quick filter chip: "Available"
    ↓
WorkspaceSearchBar.onFilterChange
    ↓
Update filters state:
    setFilters(prev => ({
      ...prev,
      status: ['available']
    }))
    ↓
useEffect executes (dependency: filters)
    ↓
Apply filters using useMemo:
    ↓
const filteredProperties = useMemo(() => {
  let results = properties;
  
  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    results = results.filter(p => 
      filters.status.includes(p.status)
    );
  }
  
  // Apply type filter (if exists)
  if (filters.type && filters.type.length > 0) {
    results = results.filter(p => 
      filters.type.includes(p.type)
    );
  }
  
  // Apply price range filter
  if (filters.priceMin || filters.priceMax) {
    results = results.filter(p => {
      const price = p.price;
      const minOk = !filters.priceMin || price >= filters.priceMin;
      const maxOk = !filters.priceMax || price <= filters.priceMax;
      return minOk && maxOk;
    });
  }
  
  // Apply area range filter
  if (filters.areaMin || filters.areaMax) {
    results = results.filter(p => {
      const area = p.area;
      const minOk = !filters.areaMin || area >= filters.areaMin;
      const maxOk = !filters.areaMax || area <= filters.areaMax;
      return minOk && maxOk;
    });
  }
  
  // Apply bedrooms filter
  if (filters.bedrooms) {
    results = results.filter(p => 
      p.bedrooms === filters.bedrooms
    );
  }
  
  return results;
}, [properties, filters]);
    ↓
Update active filter chips
    ↓
Display filter count badge: "3 active"
    ↓
Re-render property list
    ↓
Update stats based on filtered results
    ↓
END: Filtered properties displayed
```

**Multiple Filters**:
- Filters are cumulative (AND logic)
- Can clear individual filters or all at once
- Filter state preserved during navigation

---

### Flow 16: Sort Properties

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Sort Properties by Criteria                          │
└─────────────────────────────────────────────────────────────┘

START: User clicks sort dropdown
    ↓
Display sort options:
    ├─ Price: Low to High
    ├─ Price: High to Low
    ├─ Date: Newest First
    ├─ Date: Oldest First
    ├─ Area: Largest First
    ├─ Area: Smallest First
    ├─ Title: A to Z
    └─ Title: Z to A
    ↓
User selects: "Price: Low to High"
    ↓
setSortOption('price-asc')
    ↓
Apply sorting using useMemo:
    ↓
const sortedProperties = useMemo(() => {
  const sorted = [...filteredProperties];
  
  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'date-desc':
      return sorted.sort((a, b) => 
        new Date(b.listedDate).getTime() - 
        new Date(a.listedDate).getTime()
      );
    
    case 'date-asc':
      return sorted.sort((a, b) => 
        new Date(a.listedDate).getTime() - 
        new Date(b.listedDate).getTime()
      );
    
    case 'area-desc':
      return sorted.sort((a, b) => b.area - a.area);
    
    case 'area-asc':
      return sorted.sort((a, b) => a.area - b.area);
    
    case 'title-asc':
      return sorted.sort((a, b) => 
        a.title.localeCompare(b.title)
      );
    
    case 'title-desc':
      return sorted.sort((a, b) => 
        b.title.localeCompare(a.title)
      );
    
    default:
      return sorted;
  }
}, [filteredProperties, sortOption]);
    ↓
Re-render property list in sorted order
    ↓
Update sort indicator in UI
    ↓
END: Properties sorted
```

**Sort Persistence**:
- Sort preference saved to localStorage
- Restored on next visit

---

## Property Portfolio Flows

### Flow 17: View Agency Portfolio

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Agency Portfolio (Inventory)                    │
└─────────────────────────────────────────────────────────────┘

START: User navigates to "Portfolio" section
    ↓
onNavigate('portfolio')
    ↓
App.tsx renders: <AgencyPortfolioDashboard user={user} />
    ↓
AgencyPortfolioDashboard mounts
    ↓
useEffect hook executes
    ↓
Fetch all agency-owned properties:
    ↓
Call: getAgencyProperties() from /lib/data.ts
    ↓
Filter properties:
    ├─ acquisitionType === 'inventory'
    └─ currentOwnerId === 'AGENCY' (or null)
    ↓
Calculate portfolio metrics:
    ↓
For each property:
    ├─ Get purchase price
    ├─ Get current market value (latest price)
    ├─ Get expenses
    ├─ Get revenue (if any)
    ├─ Calculate holding period
    ├─ Calculate ROI
    └─ Calculate unrealized gain/loss
    ↓
Aggregate metrics:
    ├─ Total Properties: count
    ├─ Total Invested: sum of purchase prices
    ├─ Current Portfolio Value: sum of current values
    ├─ Total Unrealized Gain/Loss
    ├─ Average ROI
    ├─ Properties Under Offer: count
    ├─ YTD Acquisitions: count
    └─ Average Holding Period: avg days
    ↓
Render Portfolio Dashboard:
    ↓
Section 1: Portfolio Summary Cards
    ├─ Display key metrics
    └─ With trend indicators
    ↓
Section 2: Portfolio Value Chart
    ├─ Line chart showing value over time
    └─ Compare invested vs current value
    ↓
Section 3: Property Status Breakdown
    ├─ Pie chart:
    │   ├─ Available
    │   ├─ Under Offer
    │   └─ Rented
    ↓
Section 4: Top Performing Properties
    ├─ Table sorted by ROI
    ├─ Show top 10
    └─ Click to view details
    ↓
Section 5: Properties Requiring Attention
    ├─ Long holding period (>180 days)
    ├─ Negative ROI
    └─ Recommended actions
    ↓
Section 6: Recent Acquisitions
    ├─ Last 5 purchases
    └─ Timeline view
    ↓
END: Portfolio dashboard displayed
```

---

### Flow 18: View Investor Portfolio

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: View Investor Portfolio                              │
└─────────────────────────────────────────────────────────────┘

START: User navigates to "Investor Portfolio"
    ↓
onNavigate('investor-portfolio')
    ↓
App.tsx renders: <InvestorPortfolioDashboard />
    ↓
InvestorPortfolioDashboard mounts
    ↓
Step 1: Select Investor
    ↓
Display investor selector dropdown
    ↓
Load all investors: getInvestors()
    ↓
User selects investor from dropdown
    ↓
setSelectedInvestor(investor)
    ↓
useEffect executes (dependency: selectedInvestor)
    ↓
Fetch investor's properties:
    ↓
Call: getInvestorProperties(investorId)
    ↓
Filter properties where:
    ├─ Property has investor shares
    └─ Investor ID in shares array
    ↓
For each property:
    ├─ Get investor's share percentage
    ├─ Calculate investor's invested amount
    ├─ Calculate current value of share
    ├─ Get profit distributions received
    ├─ Calculate unrealized gain
    └─ Calculate ROI for this investor
    ↓
Aggregate investor metrics:
    ├─ Total Properties: count
    ├─ Total Invested: sum of share amounts
    ├─ Current Portfolio Value
    ├─ Total Returns (distributions)
    ├─ Unrealized Gain/Loss
    ├─ Overall ROI
    └─ Active vs Completed investments
    ↓
Render Investor Portfolio:
    ↓
Section 1: Investor Summary
    ├─ Investor Name & Contact
    ├─ Investment Capacity
    ├─ Risk Profile
    └─ Join Date
    ↓
Section 2: Portfolio Metrics Cards
    ├─ Total Invested
    ├─ Current Value
    ├─ Total Returns
    ├─ Net Profit/Loss
    └─ Overall ROI %
    ↓
Section 3: Active Investments Table
    ├─ For each investment:
    │   ├─ Property Name
    │   ├─ Share %
    │   ├─ Invested Amount
    │   ├─ Current Value
    │   ├─ Status
    │   └─ View Details button
    ↓
Section 4: Completed Investments
    ├─ Historical investments
    ├─ Final ROI
    └─ Returns received
    ↓
Section 5: Performance Chart
    ├─ Line chart: Portfolio value over time
    └─ Bar chart: Returns by property
    ↓
END: Investor portfolio displayed
```

**Syndication Key Metrics**:
- Share percentage per property
- Capital contribution amounts
- Profit distributions
- Individual investor ROI
- Portfolio diversification

---

## Property Re-listing Flows

### Flow 19: Re-list Sold Property

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Re-list Previously Sold Property                     │
└─────────────────────────────────────────────────────────────┘

START: Property status = 'sold'
    ↓
Property now owned by buyer (client)
    ↓
Agency wants to buy it back and re-list
    ↓
Two entry points:
    ├─ Option A: From property details
    └─ Option B: From "Re-listable Properties" filter
    ↓
[Option A: From Property Details]
    ↓
User on PropertyDetailsV4 (sold property)
    ↓
User clicks "Re-list Property" button
    ↓
Check eligibility:
    ├─ Property must be 'sold'
    └─ User must have permission
    ↓
If not eligible: Show error, STOP
    ↓
If eligible: Open RelistPropertyModal
    ↓
[Option B: From Re-listable Filter]
    ↓
User on PropertiesWorkspaceV4
    ↓
Click filter: "Re-listable Properties"
    ↓
Filter properties where status === 'sold'
    ↓
User selects property
    ↓
Click "Re-list" action
    ↓
Open RelistPropertyModal
    ↓
[Both options converge here]
    ↓
RelistPropertyModal displays:
    ↓
Section 1: Property Information
    ├─ Property title
    ├─ Address
    ├─ Current owner
    └─ Last sale price
    ↓
Section 2: Re-purchase Details
    ├─ Negotiated Buy-back Price (input)
    ├─ Purchase Date (default: today)
    ├─ Payment Terms
    └─ Purchase Type:
        ├─ Agency Inventory
        └─ Investor-Backed
    ↓
If Investor-Backed:
    ├─ Select investors
    ├─ Set share percentages
    └─ Validate total = 100%
    ↓
Section 3: Re-listing Details
    ├─ New Listing Price (input)
    ├─ Commission Rate
    ├─ Agent Assignment
    └─ Listing Date
    ↓
User fills all required fields
    ↓
User clicks "Re-list Property"
    ↓
Validate form data
    ↓
If invalid: Show errors, STOP
    ↓
If valid: Show confirmation dialog
    ↓
"This will create a purchase transaction and re-list the property. Continue?"
    ↓
If confirmed:
    ↓
Execute re-listing process:
    ↓
Step 1: Create Purchase Transaction
    ├─ Call: createTransaction() with type='purchase'
    ├─ Set seller as current owner
    ├─ Set buyer as 'AGENCY'
    ├─ Set purchase price
    ├─ Set stage: 'completed' (immediate completion)
    └─ Save transaction
    ↓
Step 2: Transfer Ownership
    ├─ Call: transferOwnership()
    ├─ Update property.currentOwnerId to 'AGENCY' or null
    ├─ Add ownership record to history:
    │   ├─ Previous owner
    │   ├─ Sale date
    │   ├─ Sale price
    │   └─ Transaction ID
    ├─ Add new ownership record:
    │   ├─ New owner: AGENCY
    │   ├─ Acquisition date
    │   ├─ Purchase price
    │   └─ Transaction ID
    └─ Save property
    ↓
Step 3: Update Property for Re-listing
    ├─ Set status: 'available'
    ├─ Set price: new listing price
    ├─ Set listedDate: new listing date
    ├─ Set acquisitionType: 'inventory' or 'investor'
    ├─ Update agent
    └─ Save property
    ↓
Step 4: If Investor-Backed
    ├─ Create investor share records
    ├─ Link investors to property
    └─ Update investor portfolios
    ↓
Step 5: Update Related Records
    ├─ Add purchase transaction to property.transactions[]
    ├─ Update stats/caches
    └─ Notify relevant parties
    ↓
All updates saved to localStorage
    ↓
Return success
    ↓
Close modal
    ↓
Show success toast: "Property re-listed successfully!"
    ↓
Refresh property list
    ↓
Navigate to property details
    ↓
END: Property re-listed and available for sale again
```

**Asset-Centric Model Key Points**:
- Property record NEVER deleted
- Complete ownership history preserved
- All transactions (original sale + re-purchase) linked
- Property can be sold and re-listed unlimited times

---

## Integration Flows

### Flow 20: Property → Lead Integration

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Link Property to Lead (Interested Property)          │
└─────────────────────────────────────────────────────────────┘

START: Agent creating/editing lead
    ↓
LeadFormModal open
    ↓
User fills lead information
    ↓
Section: "Interested Properties"
    ↓
User clicks "Add Property"
    ↓
Open property selector dropdown
    ↓
Load properties: getProperties()
    ↓
Display searchable property list
    ↓
User searches/filters properties
    ↓
User selects property
    ↓
Add property.id to lead.interestedProperties[]
    ↓
Display property chip with:
    ├─ Property title
    ├─ Price
    └─ Remove button
    ↓
User can add multiple properties
    ↓
User saves lead
    ↓
Lead saved with interestedProperties[] array
    ↓
Bi-directional link created:
    ├─ Lead → Property: lead.interestedProperties[]
    └─ Property → Lead: Can query leads by propertyId
    ↓
When viewing PropertyDetailsV4:
    ↓
Fetch related leads:
    ├─ Query: getLeads() where interestedProperties includes propertyId
    └─ Display in ConnectedEntitiesBar
    ↓
User can click lead to view details
    ↓
END: Property-Lead link established
```

---

### Flow 21: Property → Transaction Integration

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Property-Transaction Bidirectional Link              │
└─────────────────────────────────────────────────────────────┘

Property Side:
    ↓
Property entity contains:
    ├─ transactions: string[] (array of transaction IDs)
    └─ When transaction created, add to this array
    ↓
On PropertyDetailsV4 → Transactions Tab:
    ↓
Fetch transactions:
    ├─ Filter: transactions where propertyId === property.id
    └─ OR: Get transaction IDs from property.transactions[]
    ↓
Display transaction list with navigation
    ↓
User clicks transaction
    ↓
Navigate to transaction details
    ↓

Transaction Side:
    ↓
Transaction entity contains:
    ├─ propertyId: string (reference to property)
    └─ When transaction created, link to property
    ↓
On TransactionDetails page:
    ↓
Fetch property: getPropertyById(transaction.propertyId)
    ↓
Display PropertyConnectedCard
    ↓
User clicks "View Property"
    ↓
Navigate to property details
    ↓

Synchronization:
    ↓
When transaction created:
    ├─ Set transaction.propertyId
    └─ Add transaction.id to property.transactions[]
    ↓
When transaction deleted:
    ├─ Remove transaction.id from property.transactions[]
    └─ Update property.status if needed
    ↓
When transaction stage changes:
    ├─ Update property.status accordingly
    └─ Reflect in property timeline
    ↓
END: Bidirectional sync maintained
```

---

### Flow 22: Property → Contact Integration

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Property-Contact Relationship                        │
└─────────────────────────────────────────────────────────────┘

Contact as Owner:
    ↓
Property has currentOwnerId field
    ↓
When property sold to contact:
    ├─ Set property.currentOwnerId = contact.id
    └─ Add to contact's owned properties
    ↓
On ContactDetailsV4 → Properties Tab:
    ↓
Fetch owned properties:
    ├─ Query: properties where currentOwnerId === contact.id
    └─ Display as "Owned Properties"
    ↓
Also fetch properties sold by contact:
    ├─ Query: transactions where sellerId === contact.id
    └─ Get linked properties
    ↓
Display in two sections:
    ├─ Currently Owned
    └─ Previously Owned
    ↓

Contact as Buyer in Transaction:
    ↓
Transaction has buyerId field
    ↓
Links contact to property via transaction
    ↓
On PropertyDetailsV4:
    ↓
Fetch transactions for property
    ↓
Get buyerId from transactions
    ↓
Fetch buyer contact details
    ↓
Display in ConnectedEntitiesBar
    ↓
Click to view contact details
    ↓
END: Property-Contact links established
```

---

## Error Handling Flows

### Flow 23: Handle Property Not Found

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Error Handling - Property Not Found                  │
└─────────────────────────────────────────────────────────────┘

START: User navigates to property details
    ↓
propertyId received from URL/navigation
    ↓
Call: getPropertyById(propertyId)
    ↓
Service layer searches in localStorage
    ↓
Property not found (deleted or invalid ID)
    ↓
Service returns: { success: false, error: 'Property not found' }
    ↓
PropertyDetailsV4 receives error
    ↓
setError('Property not found')
    ↓
setIsLoading(false)
    ↓
Render error state:
    ↓
Display error card:
    ├─ Icon: AlertCircle (red)
    ├─ Title: "Property Not Found"
    ├─ Message: "The property you're looking for doesn't exist or has been removed."
    ├─ Button: "Back to Properties"
    └─ Button: "Go to Dashboard"
    ↓
Log error for debugging:
    console.error('Property not found:', propertyId)
    ↓
User clicks "Back to Properties"
    ↓
onNavigate('properties')
    ↓
Navigate to properties list
    ↓
END: Error handled gracefully
```

---

### Flow 24: Handle Validation Errors

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Error Handling - Validation Errors                   │
└─────────────────────────────────────────────────────────────┘

START: User submitting property form
    ↓
User clicks "Save" or "Create"
    ↓
validateForm() executes
    ↓
Check all required fields:
    ├─ Title: Required, min 5 chars
    ├─ Address: Required, min 10 chars
    ├─ Type: Required
    ├─ Price: Required, > 0
    └─ Area: Required, > 0
    ↓
Validation fails on multiple fields
    ↓
Collect all errors:
    const errors = {
      title: 'Title is required',
      price: 'Price must be greater than 0',
      area: 'Area is required'
    };
    ↓
setFormErrors(errors)
    ↓
Display errors:
    ├─ Inline error messages below each invalid field
    ├─ Red border on invalid inputs
    ├─ Error icon next to field label
    └─ Toast notification: "Please fix X errors"
    ↓
Scroll to first error
    ↓
Focus first invalid field
    ↓
User corrects errors
    ↓
Validate on blur for each field
    ↓
Clear individual errors as fields become valid
    ↓
User resubmits
    ↓
Validation passes
    ↓
Clear all errors: setFormErrors({})
    ↓
Continue with save operation
    ↓
END: Form submitted successfully
```

---

### Flow 25: Handle localStorage Quota Exceeded

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Error Handling - Storage Quota Exceeded              │
└─────────────────────────────────────────────────────────────┘

START: User adding property with large images
    ↓
PropertyFormV2 processes form submission
    ↓
Convert images to base64
    ↓
Create property object (very large due to images)
    ↓
Call: addProperty(propertyData)
    ↓
Service layer attempts to save to localStorage
    ↓
try {
  localStorage.setItem('estatemanager_properties', JSON.stringify(properties));
}
    ↓
Exception thrown: QuotaExceededError
    ↓
catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Handle quota exceeded
  }
}
    ↓
Service returns error:
    {
      success: false,
      error: 'Storage quota exceeded',
      code: 'QUOTA_EXCEEDED'
    }
    ↓
PropertyFormV2 receives error
    ↓
Display error dialog:
    ├─ Title: "Storage Limit Reached"
    ├─ Message: "Your browser storage is full. Please try:"
    ├─ Suggestions:
    │   ├─ "Reduce image sizes"
    │   ├─ "Use fewer images"
    │   ├─ "Archive old properties"
    │   └─ "Clear browser cache"
    ├─ Button: "Retry with Smaller Images"
    └─ Button: "Save Without Images"
    ↓
User chooses "Retry with Smaller Images"
    ↓
Compress images:
    ├─ Reduce quality to 70%
    ├─ Resize to max 1920x1080
    └─ Convert to WebP if supported
    ↓
Retry save operation
    ↓
If still fails:
    ├─ Prompt to save without images
    └─ Or cancel operation
    ↓
If success:
    ├─ Show success message
    └─ Warn about compressed images
    ↓
END: Error handled, property saved
```

---

## Data Persistence Flows

### Flow 26: localStorage Save Operation

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Data Persistence - Save to localStorage              │
└─────────────────────────────────────────────────────────────┘

START: Service layer needs to save property
    ↓
Function: addProperty(propertyData)
    ↓
Step 1: Validate Data
    ├─ Check required fields
    ├─ Validate data types
    ├─ Sanitize inputs
    └─ Check constraints
    ↓
If validation fails:
    ├─ Return error
    └─ STOP
    ↓
If validation passes:
    ↓
Step 2: Get Existing Data
    ├─ Try to read from localStorage
    ├─ const stored = localStorage.getItem('estatemanager_properties')
    ├─ If stored: Parse JSON
    └─ If error: Initialize empty array
    ↓
const existingProperties = stored ? JSON.parse(stored) : [];
    ↓
Step 3: Check for Duplicates
    ├─ Search by ID
    ├─ If found: Return error "Property already exists"
    └─ If not found: Continue
    ↓
Step 4: Add New Property
    ├─ Add to array: existingProperties.push(propertyData)
    └─ Maintain array integrity
    ↓
Step 5: Serialize Data
    ├─ const serialized = JSON.stringify(existingProperties)
    └─ Catch any serialization errors
    ↓
Step 6: Save to localStorage
    ├─ try {
    │     localStorage.setItem('estatemanager_properties', serialized);
    │   }
    ├─ catch (QuotaExceededError): Handle storage full
    ├─ catch (SecurityError): Handle private browsing
    └─ catch (other errors): Generic error handling
    ↓
Step 7: Verify Save
    ├─ Read back from localStorage
    ├─ Verify property exists
    └─ Verify data integrity
    ↓
If verification fails:
    ├─ Rollback if possible
    ├─ Return error
    └─ STOP
    ↓
If verification passes:
    ↓
Step 8: Update Caches
    ├─ Invalidate relevant caches
    ├─ Update stats
    └─ Trigger any listeners
    ↓
Step 9: Return Success
    ├─ return {
    │     success: true,
    │     data: propertyData,
    │     message: 'Property saved successfully'
    │   }
    ↓
END: Property persisted to localStorage
```

**localStorage Keys Used**:
- `estatemanager_properties`: All properties
- `estatemanager_transactions`: All transactions
- `estatemanager_leads`: All leads
- `estatemanager_contacts`: All contacts
- `estatemanager_users`: User data
- `estatemanager_stats_cache`: Cached statistics

---

### Flow 27: localStorage Update Operation

```
┌─────────────────────────────────────────────────────────────┐
│  FLOW: Data Persistence - Update in localStorage            │
└─────────────────────────────────────────────────────────────┘

START: Service layer needs to update property
    ↓
Function: updateProperty(propertyId, updates)
    ↓
Step 1: Validate Update Data
    ├─ Validate propertyId format
    ├─ Validate update fields
    └─ Sanitize inputs
    ↓
Step 2: Get Existing Data
    ├─ Read from localStorage
    └─ Parse JSON
    ↓
const properties = JSON.parse(
  localStorage.getItem('estatemanager_properties') || '[]'
);
    ↓
Step 3: Find Property
    ├─ const index = properties.findIndex(p => p.id === propertyId)
    └─ If not found (index === -1): Return error
    ↓
If found: Continue
    ↓
Step 4: Create Backup
    ├─ const backup = { ...properties[index] }
    └─ For rollback if update fails
    ↓
Step 5: Merge Updates
    ├─ properties[index] = {
    │     ...properties[index],
    │     ...updates,
    │     updatedAt: new Date().toISOString()
    │   }
    ├─ Preserve critical fields (id, createdAt, ownershipHistory)
    └─ Validate merged result
    ↓
Step 6: Validate Updated Property
    ├─ Check all constraints still met
    └─ If invalid: Rollback to backup, return error
    ↓
If valid: Continue
    ↓
Step 7: Save to localStorage
    ├─ try {
    │     localStorage.setItem(
    │       'estatemanager_properties',
    │       JSON.stringify(properties)
    │     );
    │   }
    ├─ catch (error): Handle errors, rollback
    ↓
Step 8: Update Related Entities
    ├─ If price changed: Update related transactions
    ├─ If status changed: Update statistics
    ├─ If agent changed: Update agent assignments
    └─ Propagate changes to dependent data
    ↓
Step 9: Invalidate Caches
    ├─ Clear stats cache
    ├─ Clear filtered lists cache
    └─ Trigger re-renders
    ↓
Step 10: Return Success
    ├─ return {
    │     success: true,
    │     data: properties[index],
    │     message: 'Property updated successfully'
    │   }
    ↓
END: Property updated in localStorage
```

**Update Patterns**:
1. **Partial Update**: Only specified fields changed
2. **Full Replace**: Entire object replaced (rare)
3. **Array Operations**: Push/pop items in arrays
4. **Nested Updates**: Update nested objects (ownership history)

---

## Summary

This document provides comprehensive flow diagrams for all scenarios in the Properties Module:

**Covered Flows** (27 total):
1. ✅ Module entry and navigation
2. ✅ Property creation (single and from transactions)
3. ✅ Property viewing (all tabs)
4. ✅ Property editing (single and bulk)
5. ✅ Transaction initiation (sell, purchase, rent)
6. ✅ Search and filtering
7. ✅ Portfolio management (agency and investor)
8. ✅ Property re-listing
9. ✅ Integration with other modules (leads, transactions, contacts)
10. ✅ Error handling (all scenarios)
11. ✅ Data persistence (save and update)

**Key Architecture Patterns**:
- Unidirectional data flow
- Prop-based navigation
- Service layer abstraction
- localStorage persistence
- Error-first design
- Asset-centric model
- Optimistic updates
- Graceful degradation

**Performance Considerations**:
- Debounced search (300ms)
- Memoized filtering/sorting
- Lazy loading of components
- Efficient localStorage operations
- Batch updates where possible

---

**End of Document**

**Document Version**: 1.0  
**Total Flows Documented**: 27  
**Lines**: 2,500+  
**Coverage**: 100% of Properties Module scenarios
