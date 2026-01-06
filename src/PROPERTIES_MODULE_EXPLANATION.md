# Properties Module - Complete Explanation

## **Overview: Asset-Centric Architecture**

The Properties module in aaraazi follows an **Asset-Centric** architecture (not Listing-Centric). This is a fundamental design principle that distinguishes aaraazi from typical real estate CRMs.

### **What is Asset-Centric?**

```
TRADITIONAL (Listing-Centric):
Property = Temporary listing → Gets deleted when sold → New property created if re-listed

AARAAZI (Asset-Centric):
Property = Permanent physical asset → Persists forever → Multiple transactions over lifetime
```

**Key Principle:** Properties are **physical assets** that exist independently of their listing status. When a property is sold, it doesn't disappear—it simply changes ownership and can be re-listed later.

---

## **Access Control: Agent vs Manager**

| **Feature** | **Agent Access** | **Manager/Admin Access** |
|------------|------------------|-------------------------|
| View properties | ✅ Own properties + shared | ✅ All properties |
| Add new property | ✅ Yes (assigned as agent) | ✅ Yes (can assign any agent) |
| Edit property | ✅ Own properties only | ✅ All properties |
| Delete property | ❌ No (archive only) | ✅ Yes (with confirmation) |
| Re-list sold property | ✅ If they own it | ✅ Any property |
| Bulk operations | ✅ Limited (export only) | ✅ Full (assign, edit, delete) |
| Ownership transfer | ❌ No | ✅ Yes |
| Investor syndication | ✅ View shares | ✅ Create syndicates |
| Financial tracking | ✅ View only | ✅ Record transactions |

---

## **The Property Lifecycle**

### **Phase 1: Property Creation & Acquisition**

```
┌─────────────────────────────────────────────────────────┐
│         How Properties Enter the System                 │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Client Lists │  │ Agency Buys  │  │ Direct Add   │
│   Property   │  │   Property   │  │  (Inventory) │
└──────────────┘  └──────────────┘  └──────────────┘
```

#### **Scenario 1: Client Lists Their Property (Most Common)**

**What happens:**
1. **Property Form**: Agent fills in property details
   - Address (City → Area → Block → Building → Unit)
   - Property Type (House, Apartment, Commercial, Land, etc.)
   - Area (with unit: sq ft, sq yd, marla, kanal)
   - Bedrooms, Bathrooms, Features
   - Asking Price (PKR)
   - Images, Description, Amenities

2. **Ownership Assignment**:
   - `currentOwnerType`: "client"
   - `currentOwnerId`: Contact ID of the property owner
   - `currentOwnerName`: Owner's name
   - Agent is assigned to handle the listing

3. **Initial Status**: "available"

4. **Property Record Created**:
   ```typescript
   {
     id: "prop_12345",
     address: { city: "Karachi", area: "DHA Phase 5", ... },
     propertyType: "house",
     area: 500,
     areaUnit: "sqyards",
     price: 50000000, // PKR 50M
     bedrooms: 4,
     bathrooms: 5,
     currentOwnerType: "client",
     currentOwnerId: "contact_789",
     currentOwnerName: "Ahmed Khan",
     agentId: "agent_001",
     status: "available",
     ownershipHistory: [], // Empty initially
     createdAt: "2025-01-15"
   }
   ```

#### **Scenario 2: Agency Buys Property (Agency-Owned)**

**What happens:**
1. **Purchase Cycle**: Agent creates a purchase cycle to acquire the property
2. **Purchase Completion**: When deal closes:
   - Property ownership transfers to agency
   - `currentOwnerType`: "agency"
   - `currentOwnerId`: Agency/Tenant ID
   - Acquisition costs are recorded in Property Financials

3. **Financial Tracking**: All acquisition costs tracked:
   - Purchase price
   - Registration fees
   - Stamp duty
   - Legal fees
   - Renovation costs

4. **Investment Tracking**: Property appears in Portfolio dashboards
   - Can track rental income if rented out
   - Can track expenses (maintenance, taxes, utilities)
   - Can calculate ROI when eventually sold

#### **Scenario 3: Direct Add (Manual Entry)**

**What happens:**
- Agent/Manager manually adds property to inventory
- Useful for importing existing portfolio
- Ownership details entered manually

---

### **Phase 2: Marketing & Listing**

Once a property exists, it can be marketed through **Cycles**.

```
┌─────────────────────────────────────────────────────────┐
│                    PROPERTY CYCLES                       │
│            (Marketing & Transaction Vehicles)            │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  SELL CYCLE  │  │ RENT CYCLE   │  │PURCHASE CYCLE│
│  (For Sale)  │  │ (For Rent)   │  │ (Acquire It) │
└──────────────┘  └──────────────┘  └──────────────┘
```

#### **What is a Cycle?**

A **Cycle** is a marketing campaign or transaction attempt for a property. One property can have multiple cycles throughout its lifetime.

**Example Timeline:**
```
Property Created (Jan 2024)
  ↓
Sell Cycle #1 (Jan-Mar 2024) → Sold to Buyer A
  ↓
Ownership transferred to Buyer A
  ↓
Sell Cycle #2 (Jan 2025) → Buyer A re-sells
  ↓
Ownership transferred to Buyer B
  ↓
All history preserved!
```

#### **Sell Cycle** (Property For Sale)

**Purpose:** Market a property for sale

**Agent Workflow:**
1. **Start Sell Cycle** from Property Details page
2. **Fill in details**:
   - Asking price (can differ from property's stored price)
   - Commission rate (default 2%)
   - Marketing materials (title, description, images)
   - Amenities to highlight
   - Publishing platforms (Zameen, OLX, etc.)
3. **Status**: "listed" → "under-offer" → "sold"
4. **Receive Offers**: Buyers submit offers through this cycle
5. **Accept Offer**: Creates a Deal
6. **Complete Sale**: Ownership transfers, cycle marked "sold"

**For Agents:**
- Create sell cycle for their own properties
- Track offers and manage negotiations
- Commission calculated automatically
- See cycle in Properties → Cycles tab

**For Managers:**
- View all active sell cycles
- Monitor pricing and time on market
- Override commission rates if needed
- Approve special terms

#### **Rent Cycle** (Property For Rent)

**Purpose:** Market a property for rental

**Agent Workflow:**
1. **Start Rent Cycle** from Property Details page
2. **Fill in details**:
   - Monthly rent amount
   - Security deposit (usually 1-2 months rent)
   - Lease term (1 year, 2 years, etc.)
   - Available from date
   - Rental terms and conditions
   - Allowed tenant type (family, bachelor, commercial)
3. **Status**: "available" → "negotiation" → "rented"
4. **Tenant Selection**: Review tenant applications
5. **Lease Signing**: Record lease details
6. **Rent Collection**: Track monthly payments

**For Agents:**
- Create rent cycle for client properties
- Screen potential tenants
- Manage lease renewals
- Track rent collection (if managing)

**For Managers:**
- View all rental properties
- Monitor vacancy rates
- Track rental income across portfolio
- Analyze rental yields

#### **Purchase Cycle** (Acquire Property)

**Purpose:** Represent a buyer trying to acquire a property

**Agent Workflow:**
1. **Buyer Requirement**: Agent first creates a buyer requirement
2. **Property Matching**: System suggests matching properties
3. **Start Purchase Cycle** when buyer interested in specific property
4. **Make Offer**: Submit offer on behalf of buyer
5. **Negotiation**: Back-and-forth with seller's agent
6. **Offer Accepted**: Deal created (if dual-cycle)
7. **Purchase Complete**: Buyer becomes new owner

**For Agents:**
- Represent buyers in acquisitions
- Make offers on properties
- Earn buyer-side commission (typically 40% split)
- Can be internal (agency buying) or external (client buying)

**For Managers:**
- Approve agency purchases
- Review purchase offers
- Monitor acquisition pipeline
- Budget allocation for agency investments

---

### **Phase 3: Transaction & Deal**

When an offer is accepted, a **Deal** is created.

```
Sell Cycle (Seller Agent) + Purchase Cycle (Buyer Agent) 
                    ↓
            Offer Accepted
                    ↓
              DEAL CREATED
                    ↓
        ┌───────────┴───────────┐
        ▼                       ▼
Commission Splits          Payment Plan
(60% Seller Agent)      (Track installments)
(40% Buyer Agent)
```

**Deal Lifecycle:**
1. **Offer Accepted** → Deal created
2. **Sales Agreement** → Payment plan created
3. **Documentation** → Collect required documents
4. **Payment Processing** → Record installments
5. **Transfer Registration** → Legal transfer process
6. **Final Handover** → Keys delivered
7. **Completed** → Ownership transferred

**Integration with Properties:**
- Deal links to property via `propertyId`
- Property status updates automatically: available → under-contract → sold
- Commission automatically created in Financials module
- Ownership history updated with new owner

---

### **Phase 4: Ownership Transfer & History**

**The Asset-Centric Model in Action:**

When a property is sold:

```typescript
// Property ownership transfer (using transferOwnership function)
transferOwnership(propertyId, newOwnerId, newOwnerName, transactionId);

// This updates:
{
  currentOwnerId: "new_owner_id",
  currentOwnerName: "New Owner Name",
  ownershipHistory: [
    ...previousHistory,
    {
      ownerId: "new_owner_id",
      ownerName: "New Owner Name",
      ownerType: "client",
      startDate: "2025-01-15",
      endDate: null, // Current owner
      transactionId: "deal_12345",
      purchasePrice: 50000000
    }
  ]
}
```

**Ownership History Tracking:**

Every property maintains a complete ownership chain:
```
Property #123 - DHA Phase 5 Villa
├─ Original Owner (2020-2022): Ahmed Khan
│  └─ Purchase Price: PKR 40M
├─ Second Owner (2022-2024): Sarah Ali  
│  └─ Purchase Price: PKR 45M
└─ Current Owner (2024-present): Metro Holdings
   └─ Purchase Price: PKR 50M
```

**Why This Matters:**
- Complete audit trail
- Valuation history
- Transaction verification
- Property appreciation tracking
- Legal due diligence

---

### **Phase 5: Re-listing (The Asset Persists)**

**Scenario:** Property sold to Buyer A. Later, Buyer A wants to sell it.

**Traditional System (WRONG):**
```
Property sold → Delete from database → Buyer creates "new" property → No history!
```

**aaraazi Asset-Centric (CORRECT):**
```
Property sold → Status: "sold" → Ownership: Buyer A → Can be re-listed!
```

**Re-listing Workflow:**

1. **Property Status**: "sold"
2. **Re-listable Properties Widget**: Shows sold properties that can be re-listed
3. **Manager Action**:
   - Views sold property
   - Clicks "Re-list Property"
   - If agency wants to buy back, creates purchase cycle
   - If new owner wants to sell, creates new sell cycle
4. **New Sell Cycle Created**: Property back on market
5. **Ownership History Preserved**: All previous owners tracked

**Benefits:**
- ✅ Complete property transaction history
- ✅ No duplicate property records
- ✅ Accurate market data (price trends)
- ✅ Referral opportunities (contact previous owners)

---

## **Property Details Page - Information Architecture**

The Property Details page uses the **DetailPageTemplate** with 5 tabs:

### **Tab 1: Overview**

**Content:**
- **Page Header**:
  - Property title and address
  - Breadcrumbs (Dashboard → Properties → [Property])
  - Key metrics: Price, Area, Type, Status
  - Quick actions: Edit, Start Sell Cycle, Start Rent Cycle, etc.

- **Connected Entities Bar**:
  - Current Owner (clickable → Contact Details)
  - Assigned Agent (clickable → Agent Profile)
  - Active Cycles (clickable → Cycle Details)

- **Main Content (2/3 width)**:
  - **Summary Stats Panel**: Bedrooms, Bathrooms, Features
  - **Property Information Panels**:
    - Basic Details (Type, Area, Price, Year Built)
    - Address & Location (Full address with map link)
    - Features & Amenities (Parking, Garden, Pool, etc.)
    - Description

- **Sidebar (1/3 width)**:
  - **Quick Actions Panel**:
    - Start Sell Cycle
    - Start Rent Cycle
    - Edit Property
    - View Financials
    - Upload Documents
  - **Status Timeline**: Property lifecycle stages
  - **Owner Information Card**: Contact details

### **Tab 2: Cycles**

**Content:**
- **Sell Cycles List**: All sell cycles (past and present)
  - Asking price, commission rate
  - Status, dates
  - Number of offers received
  - Click to view cycle details

- **Purchase Cycles List**: If agency acquired this property
  - Acquisition details
  - Offer amounts
  - Negotiation history

- **Rent Cycles List**: All rental listings
  - Monthly rent, lease terms
  - Tenant information
  - Lease status

**Agent View:**
- See cycles they're involved in
- Create new cycles for their properties
- Cannot see other agents' cycles (unless shared)

**Manager View:**
- See all cycles for the property
- Historical view of pricing changes
- Performance analysis (time to sell, etc.)

### **Tab 3: Financials** (If Agency-Owned)

**Content:**
- **Acquisition Summary**:
  - Purchase price
  - Registration fees, stamp duty, legal fees
  - Renovation costs
  - Total investment

- **Income/Expense Tracker**:
  - Rental income collected
  - Property tax paid
  - Maintenance expenses
  - Utilities
  - Management fees

- **Profitability Metrics**:
  - Net cash flow (Income - Expenses)
  - ROI calculation
  - Annualized returns
  - Capital appreciation

- **Transaction History**: All financial transactions
  - Date, type, amount, description
  - Receipt/invoice links

**Agent View:**
- Read-only view of financials
- Can see profitability metrics

**Manager View:**
- Full access to record transactions
- Edit financial records
- Generate property P&L report
- Compare to portfolio

### **Tab 4: Documents**

**Content:**
- **Document Categories**:
  - Title Deed
  - Sale Agreement
  - NOC (No Objection Certificate)
  - Property Tax Records
  - Inspection Reports
  - Photos & Floor Plans
  - Legal Documents

- **Document Actions**:
  - Upload new documents
  - Download documents
  - Share with clients/buyers
  - Version tracking

**Agent View:**
- View documents
- Upload marketing materials
- Cannot delete critical documents

**Manager View:**
- Full document management
- Approve document deletion
- Manage access permissions

### **Tab 5: Activity Timeline**

**Content:**
- **Complete Activity Log**:
  - Property created
  - Cycles started/ended
  - Offers received
  - Status changes
  - Documents uploaded
  - Ownership transfers
  - Price changes
  - Edit history

**For Both Agents & Managers:**
- Full audit trail
- Filterable by activity type
- Searchable
- Export activity log

---

## **Properties Workspace - List View**

The Properties Workspace uses the **WorkspacePageTemplate** with advanced features.

### **Header Section**

**Stats Bar** (5 key metrics):
1. **Total**: All properties in system
2. **For Sale**: Properties with active sell cycles
3. **For Rent**: Properties with active rent cycles
4. **In Acquisition**: Properties in purchase process
5. **Agency-Owned**: Properties owned by agency

**Primary Action**: "Add Property" (large button - Fitts's Law)

**View Toggles**: Grid View (default) | Table View

**Secondary Actions Dropdown**:
- Import Properties (CSV)
- Export All Properties
- Bulk Operations
- Advanced Filters

### **Search & Filters**

**Search Bar**: Search by address, title, type, area name

**Quick Filters** (7 filters - Miller's Law):
1. **Status**: Available, Sold, Rented, Under Contract
2. **Property Type**: House, Apartment, Commercial, Land, Plot
3. **Price Range**: Custom PKR ranges
4. **Area Range**: Custom sq ft/sq yd ranges
5. **Owner Type**: Client-Owned, Agency-Owned, Investor-Owned
6. **Bedrooms**: Studio, 1 BR, 2 BR, 3 BR, 4+ BR
7. **Area/Location**: DHA, Clifton, Gulshan, PECHS, etc.

**Sort Options**:
- Recent (newest first)
- Price (low to high / high to low)
- Area (smallest to largest)
- Status

### **Grid View** (Default)

**Property Card** displays:
- Property image (or building icon if no image)
- Address (short format)
- Property type badge
- Price (large, prominent)
- Area (with unit)
- Bedrooms/Bathrooms
- Status badge (color-coded)
- Current owner info
- Quick actions menu (⋮):
  - View Details
  - Edit Property
  - Start Sell Cycle
  - Start Rent Cycle
  - Archive

**Agent View:**
- See their own properties
- See shared properties (grayed out with "Shared" badge)
- Cannot see other agents' properties

**Manager View:**
- See all properties across agency
- See owner agent name on each card
- Bulk select for bulk operations

### **Table View** (Alternative)

**Columns**:
1. Property (Address + Image + Type)
2. Area (with unit)
3. Rooms (Bedrooms/Bathrooms)
4. Price (PKR)
5. Owner (Name + Type badge)
6. Status (Badge)
7. Agent (Assigned agent)
8. Active Cycles (Count + Types)
9. Actions (Quick menu)

**Features**:
- Sortable columns
- Resizable columns
- Row selection for bulk actions
- Pagination (50 per page)
- Infinite scroll option

### **Bulk Operations** (Manager Only)

**Select Multiple Properties** → Bulk Actions Menu:

1. **Bulk Assign Agent**:
   - Select properties
   - Choose new agent
   - Confirm assignment
   - Properties reassigned

2. **Bulk Edit Properties**:
   - Select properties
   - Change common fields:
     - Status
     - Property type
     - Owner type
     - Tags
   - Apply to all selected

3. **Bulk Status Change**:
   - Available → Under Contract
   - Sold → Available (re-list)
   - Archive multiple

4. **Bulk Export**:
   - Export selected properties to CSV
   - Include financials (optional)
   - Include cycles (optional)

5. **Bulk Delete** (with confirmation):
   - Permanent deletion
   - Requires admin approval
   - Cannot delete if has active cycles

---

## **Property Forms - Creation & Editing**

### **Add New Property Form**

**Form Structure** (Progressive Disclosure - Hick's Law):

**Step 1: Basic Information**
- Property Type (House, Apartment, Commercial, etc.)
- Listing Purpose (For Sale, For Rent, Agency Purchase)
- Title (optional - generated from address if blank)

**Step 2: Location**
- Country: Pakistan (default)
- City: Karachi (or others)
- Area: DHA Phase 5, Clifton, etc. (autocomplete)
- Block/Sector (if applicable)
- Building/Society Name (if applicable)
- Street Address
- Unit Number (for apartments)

**Step 3: Property Details**
- Area: Numeric + Unit (sq ft, sq yd, marla, kanal)
- Bedrooms: 0-10+
- Bathrooms: 0-10+
- Year Built (optional)
- Floors (total)
- Floor Number (if apartment)

**Step 4: Pricing**
- Price (PKR)
- Price per unit (calculated automatically)
- Negotiable? (Yes/No toggle)

**Step 5: Features & Amenities** (Checkboxes)
- Parking (Car spaces)
- Garden
- Swimming Pool
- Gym
- Elevator
- Security
- Servant Quarters
- Store Room
- Balcony
- View (Sea, Park, City, etc.)

**Step 6: Media**
- Upload Images (drag & drop, max 20)
- Cover Photo (select from uploaded)
- Video Tour URL (YouTube, Vimeo)
- Virtual Tour URL (360° tours)

**Step 7: Ownership**
- Owner Type: Client, Agency, Investor Syndicate
- Owner: Search contacts to assign
- Agent: Assign agent (default: current user)

**Step 8: Additional Details**
- Description (rich text editor)
- Special Features (free text)
- Notes (internal, not shown to buyers)
- Tags (for organization)

**Validation:**
- Required fields: Type, Location, Area, Price
- Min values: Area > 0, Price > 0
- Image size: Max 5MB per image
- Address completeness check

### **Edit Property Form**

**Same as Add Form** but:
- Pre-filled with current values
- Shows edit history at bottom
- "Save Changes" vs "Create Property"
- Tracks who edited and when
- Can revert to previous version (manager only)

---

## **Property Status Management**

### **Status Flow Diagram**

```
┌─────────────┐
│  Available  │ ← Initial status
└──────┬──────┘
       │
       │ (Offer received/accepted)
       ▼
┌─────────────────┐
│ Under Contract  │
└──────┬──────────┘
       │
       │ (Deal completed)
       ├─────────────┐
       ▼             ▼
┌──────────┐   ┌──────────┐
│   Sold   │   │  Rented  │
└──────────┘   └──────────┘
       │             │
       │             │ (Lease ends)
       │             ▼
       │       ┌──────────┐
       │       │Available │
       │       └──────────┘
       │
       │ (Re-list)
       ▼
┌─────────────┐
│  Available  │ ← Can be re-listed!
└─────────────┘
```

### **Status Meanings**

1. **Available**:
   - Property ready for marketing
   - Can create sell/rent cycles
   - Shows in public listings

2. **Under Contract**:
   - Deal in progress
   - Not shown in public listings
   - Cannot create new cycles
   - Deal must complete or cancel

3. **Sold**:
   - Deal completed, ownership transferred
   - Property removed from active listings
   - Appears in "Re-listable Properties"
   - All history preserved

4. **Rented**:
   - Active rental lease
   - Not available for sale during lease
   - Lease end date tracked
   - Automatically becomes "Available" after lease ends

5. **Off Market** (optional):
   - Owner doesn't want to sell right now
   - Kept in database
   - Not shown in listings

---

## **Investor Syndication** (Multi-Investor Ownership)

### **What is Investor Syndication?**

Multiple investors pool capital to purchase a property together. The agency manages the property and distributes profits based on ownership shares.

**Example:**
```
Property Price: PKR 100,000,000
├─ Investor A: 40% (PKR 40M) → 40% of profits
├─ Investor B: 30% (PKR 30M) → 30% of profits
├─ Investor C: 20% (PKR 20M) → 20% of profits
└─ Investor D: 10% (PKR 10M) → 10% of profits
```

### **Syndication Workflow**

**Step 1: Purchase with Multiple Investors**
1. Create purchase cycle for property
2. Click "Multi-Investor Purchase"
3. **Multi-Investor Modal** opens:
   - Property price displayed
   - Add investors:
     - Search/select investor
     - Enter investment amount
     - Percentage auto-calculated
   - Validate: Total = 100% of price
4. Submit → Property ownership transferred to investors

**Step 2: Property Owned by Investor Syndicate**
- `currentOwnerType`: "investor"
- `investorShares`: Array of investor ownership
  ```typescript
  investorShares: [
    {
      investorId: "inv_001",
      investorName: "Ahmed Capital",
      sharePercentage: 40,
      investmentAmount: 40000000
    },
    // ... more investors
  ]
  ```

**Step 3: Income/Expense Recording**
- Property generates rental income: PKR 500,000/month
- Agent records transaction in Property Financials
- System calculates each investor's share:
  - Investor A (40%): PKR 200,000
  - Investor B (30%): PKR 150,000
  - Investor C (20%): PKR 100,000
  - Investor D (10%): PKR 50,000

**Step 4: Profit Distribution**
- Manager approves distributions
- **Sale Distribution Modal**: When property sold
  - Sale price: PKR 120,000,000
  - Profit: PKR 20,000,000
  - Each investor receives:
    - Investor A: Original 40M + (40% × 20M) = 48M
    - Investor B: Original 30M + (30% × 20M) = 36M
    - Investor C: Original 20M + (20% × 20M) = 24M
    - Investor D: Original 10M + (10% × 20M) = 12M
- Payment records created
- Distributions tracked in Financials → Investor Distributions

### **Investor View**

Investors can log in and see:
- Their properties (investor-owned only)
- Their ownership percentage
- Property performance (ROI)
- Income distributions received
- Pending distributions
- Transaction history

---

## **Property Financials** (Agency-Owned Properties)

### **Purpose**

Track complete financial performance of agency-owned properties from acquisition to sale.

### **Financial Tracking Components**

#### **1. Acquisition Phase**

**Costs Tracked:**
- Purchase price
- Registration fee (government)
- Stamp duty (4% in Pakistan)
- Legal fees
- Broker commission (if any)
- Renovation/refurbishment
- Other acquisition costs

**Total Acquisition Cost** = Sum of all above

**Recording:**
- Manager records each cost as `AgencyTransaction`
- Transaction type: "purchase_price", "registration_fee", etc.
- All linked to property via `propertyId`

#### **2. Ownership Phase**

**Income Tracked:**
- Rental income (monthly)
- Parking fees
- Late payment fees
- Other income

**Expenses Tracked:**
- Property tax (annual)
- Maintenance & repairs
- Utilities (if agency pays)
- Insurance
- Management fees
- Marketing costs
- Legal expenses
- Other expenses

**Net Cash Flow** = Total Income - Total Expenses

**Recording:**
- Agent/Manager records each transaction
- Income: Transaction type "rental_income", etc.
- Expenses: Transaction type "maintenance", "property_tax", etc.

#### **3. Sale Phase** (When Sold)

**Costs Tracked:**
- Sale commission (to selling agent)
- Closing costs
- Legal fees

**Net Sale Proceeds** = Sale Price - Sale Expenses

#### **4. Profitability Analysis**

**Calculations:**
```
Capital Gain = Net Sale Proceeds - Total Acquisition Cost
Operating Profit = Net Cash Flow (during ownership)
Total Profit = Capital Gain + Operating Profit
ROI = (Total Profit / Total Acquisition Cost) × 100
Annualized ROI = ROI / Holding Period (years)
```

**Example:**
```
Acquisition (Jan 2023):
- Purchase Price: PKR 10,000,000
- Legal + Registration: PKR 500,000
- Renovation: PKR 1,500,000
- Total Acquisition: PKR 12,000,000

Ownership (Jan 2023 - Jan 2025, 2 years):
- Rental Income: PKR 50,000/month × 24 = PKR 1,200,000
- Expenses (tax, maintenance): PKR 800,000
- Net Cash Flow: PKR 400,000

Sale (Jan 2025):
- Sale Price: PKR 16,000,000
- Commission: PKR 320,000
- Net Sale Proceeds: PKR 15,680,000

Profitability:
- Capital Gain: PKR 15,680,000 - PKR 12,000,000 = PKR 3,680,000
- Operating Profit: PKR 400,000
- Total Profit: PKR 4,080,000
- ROI: (4,080,000 / 12,000,000) × 100 = 34%
- Annualized ROI: 34% / 2 years = 17% per year
```

### **Property P&L Report**

Manager can generate **Property Profit & Loss Statement**:

```
PROPERTY P&L STATEMENT
Property: DHA Phase 6, House #123
Period: Jan 2023 - Jan 2025

ACQUISITION COSTS
Purchase Price                 10,000,000
Registration & Legal              500,000
Renovation                      1,500,000
Total Acquisition              12,000,000

OPERATING INCOME
Rental Income                   1,200,000
Total Income                    1,200,000

OPERATING EXPENSES
Property Tax                      150,000
Maintenance                       300,000
Utilities                         200,000
Insurance                         100,000
Other Expenses                     50,000
Total Expenses                    800,000

Operating Profit                  400,000

SALE PROCEEDS
Sale Price                     16,000,000
Less: Commission                 (320,000)
Net Sale Proceeds              15,680,000

PROFITABILITY
Capital Gain                    3,680,000
Operating Profit                  400,000
Total Profit                    4,080,000

ROI                                34.00%
Annualized ROI                     17.00%
Holding Period                  2.0 years
```

---

## **Integration with Other Modules**

### **Properties ↔ Contacts**

**Connection:**
- Every property has an owner (Contact)
- Property ownership tracked via `currentOwnerId`
- Clicking owner name → Contact Details page

**Workflow:**
1. Create Contact (Owner)
2. Create Property, assign owner
3. Contact's Properties tab shows all their properties
4. When property sold, ownership transfers to new contact

### **Properties ↔ Sell Cycles**

**Connection:**
- Sell cycle markets a property
- `sellCycle.propertyId` links to property
- Property stores `activeSellCycleIds[]`

**Workflow:**
1. Property exists
2. Create Sell Cycle
3. Property status updates to reflect cycle status
4. Sell cycle closed → Property marked "sold"
5. Multiple sell cycles possible over time

### **Properties ↔ Purchase Cycles**

**Connection:**
- Purchase cycle to acquire a property
- `purchaseCycle.propertyId` links to property
- Agency can buy properties

**Workflow:**
1. Property owned by client
2. Agency creates Purchase Cycle
3. Offer accepted → Deal created
4. Deal completed → Ownership transfers to agency
5. Property becomes agency-owned asset

### **Properties ↔ Rent Cycles**

**Connection:**
- Rent cycle to lease a property
- `rentCycle.propertyId` links to property
- Property stores `activeRentCycleIds[]`

**Workflow:**
1. Property available for rent
2. Create Rent Cycle
3. Tenant found → Lease signed
4. Property status: "rented"
5. Lease ends → Property available again

### **Properties ↔ Deals**

**Connection:**
- Deal is transaction between buyer and seller
- `deal.cycles.sellCycle.propertyId` links to property
- Deal completion triggers ownership transfer

**Workflow:**
1. Sell Cycle has property
2. Offer accepted → Deal created
3. Deal progresses through stages
4. Deal completed → Property ownership transfers
5. Commission created and tracked

### **Properties ↔ Financials**

**Connection:**
- Agency-owned properties tracked in Property Financials module
- All transactions linked via `propertyId`
- Property P&L generated from transactions

**Workflow:**
1. Agency buys property
2. Record acquisition costs (Financials → Property Financials)
3. Record income/expenses during ownership
4. Property sold → Record sale proceeds
5. Generate Property P&L report
6. Data feeds into Financials Hub reports

### **Properties ↔ Documents**

**Connection:**
- Documents attached to properties
- `document.propertyId` links to property
- Property Details → Documents tab

**Types:**
- Title Deed
- Sale Deed
- NOC
- Property Tax Receipts
- Inspection Reports
- Photos
- Floor Plans

---

## **Search & Filtering - Smart Matching**

### **Property Search Features**

**Basic Search:**
- Text search across:
  - Address fields (area, street, building)
  - Property title
  - Property type
  - Description

**Advanced Filters:**
- Price range (min/max)
- Area range (min/max with unit conversion)
- Bedrooms (exact or min)
- Bathrooms (exact or min)
- Property type (multi-select)
- Status (multi-select)
- Owner type (client, agency, investor)
- Location (city, area, block)
- Amenities (has parking, pool, etc.)
- Date range (created between dates)

**Smart Matching** (for Buyer Requirements):

When buyer has specific needs, system scores properties:

```typescript
Match Score Calculation:
- Price within budget: +30 points
- Property type match: +25 points
- Location match: +20 points
- Bedrooms match: +15 points
- Area within range: +10 points

Total Score: 0-100
- 90-100: Excellent Match
- 70-89: Good Match
- 50-69: Fair Match
- <50: Poor Match
```

**Results Sorted By:**
1. Match score (highest first)
2. Recent listings
3. Price (low to high)

---

## **Mobile Responsiveness**

### **Grid View (Mobile)**
- 1 column layout
- Larger cards (easy tap targets - Fitts's Law)
- Swipe for quick actions
- Bottom navigation

### **Detail Page (Mobile)**
- Full-width layout
- Sticky header with back button
- Collapsible sections
- Horizontal scroll for images
- Bottom action bar (Start Cycle, Edit, Share)

### **Forms (Mobile)**
- One field per screen section
- Large input fields
- Numeric keyboard for prices/areas
- Auto-complete for locations
- Step indicator

---

## **Performance Optimizations**

### **Lazy Loading**
- Images loaded on scroll
- Infinite scroll for large lists
- Virtual scrolling for 1000+ properties

### **Caching**
- Property list cached in memory
- Images cached in browser
- Filter results cached for 5 minutes

### **Search Optimization**
- Debounced search (300ms delay)
- Index on commonly searched fields
- Limit results to 100 by default

### **Data Fetching**
- Load property list without cycles initially
- Fetch cycles only when viewing property details
- Lazy load documents tab
- Lazy load financials tab

---

## **Real-World Use Cases**

### **Use Case 1: Client Property Listing**

**Scenario:** Mr. Ahmed wants to sell his DHA house.

**Steps:**
1. Agent meets Mr. Ahmed, inspects property
2. Agent creates Contact for Mr. Ahmed
3. Agent creates Property:
   - Type: House
   - Location: DHA Phase 5
   - Area: 500 sq yd
   - Price: PKR 50,000,000
   - Owner: Mr. Ahmed (Contact)
   - Agent: Self
4. Agent creates Sell Cycle:
   - Asking Price: PKR 50M
   - Commission: 2%
   - Upload photos
   - Publish to Zameen, OLX
5. Buyers view listing, make offers
6. Best offer accepted (PKR 48M)
7. Deal created, payment plan set up
8. Deal progresses through stages
9. Final payment received, keys handed over
10. Property ownership transfers to buyer
11. Agent earns PKR 960,000 commission (2% of 48M)

### **Use Case 2: Agency Investment Purchase**

**Scenario:** Agency wants to buy property for investment.

**Steps:**
1. Property exists (seller's listing)
2. Manager creates Purchase Cycle:
   - Buyer: Agency (internal)
   - Property: Target property
   - Budget: PKR 10M
3. Manager makes offer (PKR 9.5M)
4. Offer accepted, deal created
5. Agency completes purchase
6. Property ownership transfers to agency
7. Manager records acquisition costs:
   - Purchase: PKR 9,500,000
   - Legal: PKR 200,000
   - Renovation: PKR 1,300,000
   - Total: PKR 11,000,000
8. Property rented out (PKR 100,000/month)
9. Manager records rental income monthly
10. After 2 years, property sold for PKR 15M
11. Profit: PKR 15M - PKR 11M + Rental Income = PKR 6.4M
12. ROI: 58% over 2 years (29% annualized)

### **Use Case 3: Multi-Investor Syndicate**

**Scenario:** 4 investors want to buy luxury apartment together.

**Steps:**
1. Property: Clifton Sea View Apartment (PKR 80M)
2. Manager creates Purchase Cycle
3. Manager clicks "Multi-Investor Purchase"
4. Adds 4 investors:
   - Investor A: PKR 32M (40%)
   - Investor B: PKR 24M (30%)
   - Investor C: PKR 16M (20%)
   - Investor D: PKR 8M (10%)
5. Purchase completed
6. Property owned by investor syndicate
7. Property rented (PKR 400,000/month)
8. Monthly distribution:
   - Investor A: PKR 160,000 (40%)
   - Investor B: PKR 120,000 (30%)
   - Investor C: PKR 80,000 (20%)
   - Investor D: PKR 40,000 (10%)
9. After 3 years, property sold for PKR 100M
10. Profit: PKR 20M
11. Each investor receives capital + profit share
12. Distributions tracked in Investor module

---

## **Best Practices**

### **For Agents**

✅ **Always** complete all property details accurately  
✅ **Always** upload high-quality photos (min 5)  
✅ **Always** verify owner contact information  
✅ **Update** property status as situations change  
✅ **Record** all property interactions in notes  
✅ **Use tags** for easy organization  

❌ **Don't** create duplicate properties  
❌ **Don't** leave required fields blank  
❌ **Don't** overstate features/amenities  
❌ **Don't** forget to update cycle status  

### **For Managers**

✅ **Review** new property listings for accuracy  
✅ **Monitor** days on market metrics  
✅ **Analyze** pricing trends  
✅ **Track** agent performance per property  
✅ **Audit** ownership transfers  
✅ **Verify** financial transactions  

❌ **Don't** approve unrealistic pricing  
❌ **Don't** allow incomplete listings  
❌ **Don't** skip ownership verification  
❌ **Don't** neglect data quality  

---

## **Data Quality & Integrity**

### **Validation Rules**

1. **Address Completeness**: Must have City + Area minimum
2. **Price Validation**: Must be > 0 and reasonable for area
3. **Area Validation**: Must be > 0 and match property type
4. **Owner Assignment**: Must have valid owner contact
5. **Agent Assignment**: Must have assigned agent
6. **Status Consistency**: Status must match cycle status
7. **Ownership Chain**: Must have complete ownership history

### **Deduplication**

System prevents duplicate properties by checking:
- Same address (fuzzy match)
- Same area + similar price
- Same owner + agent combination

**Warning shown** if potential duplicate detected:
```
⚠️ Similar property found:
DHA Phase 5, 500 sq yd House - PKR 50M
Created by: Agent Sarah (3 days ago)

Is this the same property?
[Yes, Use Existing] [No, Create New]
```

### **Data Migration & Cleanup**

**Property Status Migration Tool** (Manager only):
- Detect properties with inconsistent status
- Sync property status with cycle status
- Fix orphaned cycles (property deleted but cycle exists)
- Merge duplicate properties
- Archive old/inactive properties

---

## **Reporting & Analytics**

### **Property Reports** (Available to Managers)

1. **Property Inventory Report**
   - All properties with status
   - Days on market
   - Price changes over time
   - Export to CSV/Excel

2. **Property Performance Report**
   - Properties sold vs. listed
   - Average days to sell
   - Price reduction frequency
   - Commission earned per property

3. **Portfolio Report** (Agency-Owned)
   - Total investment
   - Current value
   - Realized gains (sold)
   - Unrealized gains (current)
   - Overall portfolio ROI

4. **Location Analysis Report**
   - Properties by area
   - Average price by area
   - Demand hotspots
   - Price trends

5. **Agent Performance Report**
   - Properties per agent
   - Listings to sales ratio
   - Average commission per property
   - Fastest sales

---

## **Summary: The Asset-Centric Advantage**

### **Traditional CRM Problems:**
```
❌ Property deleted when sold → No history
❌ Duplicate entries if re-listed → Data chaos
❌ No price trend analysis → Poor market insights
❌ Ownership chain broken → Legal issues
❌ Agent performance unclear → No accountability
```

### **aaraazi Asset-Centric Solution:**
```
✅ Property persists forever → Complete history
✅ Multiple transactions tracked → Rich analytics
✅ Ownership chain preserved → Audit trail
✅ Price trends visible → Market intelligence
✅ Agent performance clear → Commission accuracy
✅ Investment ROI tracked → Portfolio management
✅ Re-listing simple → No data re-entry
```

**The Core Principle:**
> "A property is a permanent physical asset, not a temporary listing. It exists independently of whether it's being marketed, and its complete history is essential for business intelligence, legal compliance, and customer service."

This is what makes aaraazi a true **real estate asset management system** rather than just a listing management tool.

---

## **Quick Reference**

### **Property Creation Checklist**

- [ ] Property type selected
- [ ] Complete address entered
- [ ] Area with unit specified
- [ ] Price entered
- [ ] Owner contact assigned
- [ ] Agent assigned
- [ ] Minimum 3 photos uploaded
- [ ] Description written
- [ ] Amenities checked
- [ ] Status set correctly

### **Cycle Creation Checklist**

**Sell Cycle:**
- [ ] Asking price set
- [ ] Commission rate configured
- [ ] Marketing materials ready
- [ ] Photos uploaded
- [ ] Description compelling
- [ ] Publishing platforms selected

**Rent Cycle:**
- [ ] Monthly rent set
- [ ] Security deposit specified
- [ ] Lease term defined
- [ ] Available from date set
- [ ] Tenant requirements listed

**Purchase Cycle:**
- [ ] Budget approved
- [ ] Buyer requirement created
- [ ] Offer amount determined
- [ ] Financing confirmed
- [ ] Timeline set

### **Common Workflows**

| Task | Steps |
|------|-------|
| **List client property** | Create Contact → Create Property → Create Sell Cycle → Publish |
| **Agency investment** | Create Purchase Cycle → Accept Offer → Complete Deal → Record Acquisition |
| **Property sold** | Accept Offer → Create Deal → Complete Stages → Transfer Ownership |
| **Re-list property** | Find Sold Property → Create New Sell Cycle → Update Details → Publish |
| **Investor syndicate** | Create Purchase Cycle → Multi-Investor Modal → Assign Shares → Complete Purchase |
| **Track rental income** | Property Financials → Record Transaction → Income Type: Rental → Save |

---

**End of Properties Module Explanation**

*For questions or clarifications, refer to `/Guidelines.md` or contact the development team.*
