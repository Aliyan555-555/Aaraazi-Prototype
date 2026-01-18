# Properties Module - Complete User Guide

**aaraazi Real Estate Management Platform**  
**Module**: Properties Management  
**Version**: 4.1  
**Last Updated**: January 15, 2026

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Who Uses This Module](#who-uses-this-module)
3. [Key Concepts](#key-concepts)
4. [Getting Started](#getting-started)
5. [How to Add Properties](#how-to-add-properties)
6. [Managing Properties](#managing-properties)
7. [Property Lifecycle](#property-lifecycle)
8. [Common Workflows](#common-workflows)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)
11. [FAQs](#faqs)

---

## Overview

### What is the Properties Module?

The Properties Module is the **central hub** for managing all real estate assets in aaraazi. It follows an **asset-centric model**, meaning properties are permanent records that persist through multiple ownership cycles, transactions, and listings.

**Think of it like this**: A property is a physical building that exists forever, regardless of who owns it or how many times it's sold. This module tracks the property itself, not just the current sale.

### What Can You Do?

✅ **Add Properties** - List new properties for sale or rent  
✅ **View Properties** - See all properties in grid, list, or map view  
✅ **Edit Properties** - Update details, pricing, photos  
✅ **Track History** - See ownership history and transaction records  
✅ **Manage Status** - Available, Under Offer, Sold, Rented  
✅ **Link Entities** - Connect owners, agents, buyers, transactions  
✅ **Re-list Properties** - Re-market previously sold properties  
✅ **Search & Filter** - Find properties by type, location, price, status  

### Key Features

| Feature | Description |
|---------|-------------|
| **Asset-Centric Model** | Properties are permanent records, not listings |
| **Ownership Tracking** | Complete ownership history preserved |
| **3 Acquisition Types** | Inventory, Client Listing, Investor properties |
| **Re-listing Capability** | Sold properties can be re-listed |
| **Transaction Links** | All deals/cycles linked to property |
| **Multi-Photo Gallery** | Upload multiple property images |
| **Detailed Information** | Type, area, bedrooms, price, location |
| **Status Management** | Available, Under Offer, Sold, Rented |

---

## Who Uses This Module

### For Real Estate Agents

**Primary Users** - Agents use this module daily to:
- Add new property listings
- Update property information
- Track properties they're managing
- View property performance
- Connect properties to buyers/sellers

### For Agency Admins

**Management Users** - Admins use this module to:
- View all agency properties (across all agents)
- Monitor inventory
- Assign properties to agents
- Review property portfolio
- Generate property reports

### For Investors

**Portfolio Users** - Investors use this module to:
- View properties they've invested in
- Track property values
- See rental income
- Monitor ROI on their investments

---

## Key Concepts

### 1. Asset-Centric vs Listing-Centric

**Traditional Listing-Centric** (Most systems):
```
Property Listing → Sold → DELETED ❌
```

**aaraazi Asset-Centric** (Better way):
```
Property Asset → Sold → Ownership Transfer → Can Re-list ✅
```

**Why This Matters**:
- Properties never disappear from the system
- Complete history is preserved
- Properties can be re-listed multiple times
- Better long-term data and analytics

### 2. Three Acquisition Types

Every property in aaraazi has an **acquisition type** that determines how it entered your system:

#### Type 1: Agency Inventory (100% Owned)
```
YOU bought it → YOU own it → YOU sell it → YOU profit
```
**Example**: You purchase a villa for PKR 50M, renovate it, and sell for PKR 75M. The PKR 25M profit is yours.

#### Type 2: Client Listing (Brokerage)
```
CLIENT owns it → YOU list it → YOU earn commission
```
**Example**: Mr. Ahmed owns a villa. You list it and earn 2% commission when sold.

#### Type 3: Investor Syndication (Shared Ownership)
```
MULTIPLE investors → SHARED ownership → SHARED profit
```
**Example**: You and 3 investors buy a commercial plaza. Each owns 25%. When sold, profit is split 25% each.

### 3. Property Status Lifecycle

```
┌─────────────┐
│  AVAILABLE  │ ← Property is listed and ready for buyers
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ UNDER OFFER │ ← Buyer made an offer, negotiating
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    SOLD     │ ← Transaction complete, ownership transferred
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  RE-LISTED  │ ← Property back on market (new owner or buy-back)
└─────────────┘
```

### 4. Property-Transaction Relationship

**One Property, Many Transactions**:
```
Property: Modern Villa DHA Phase 8
├── Transaction 1: Sold to Ahmed (Jan 2024)
├── Transaction 2: Sold to Sara (Jun 2024)
├── Transaction 3: Sold to Khan (Dec 2024)
└── Transaction 4: Currently listed (Jan 2025)
```

Each transaction is a separate record, but the property persists.

---

## Getting Started

### Accessing the Properties Module

**From Dashboard**:
1. Log in to aaraazi
2. Click **"Properties"** in the left sidebar
3. You'll see the Properties Workspace

**From Quick Actions**:
1. Click **"+ Quick Add"** button
2. Select **"Add Property"**

### Understanding the Properties Workspace

When you open Properties, you see:

```
┌────────────────────────────────────────────────┐
│ PROPERTIES                                     │
│ ┌──────┬──────┬──────┬──────┐                 │
│ │Total │Avail.│Under │ Sold │ ← Stats        │
│ │  25  │  12  │  8   │  5   │                 │
│ └──────┴──────┴──────┴──────┘                 │
│                                                 │
│ [+ Add Property]  [Grid] [List]  [Search...]   │
│                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Villa    │ │ Apartment│ │ Plot     │        │
│ │ DHA      │ │ Clifton  │ │ Bahria   │        │
│ │ PKR 75M  │ │ PKR 45M  │ │ PKR 25M  │        │
│ └──────────┘ └──────────┘ └──────────┘        │
└────────────────────────────────────────────────┘
```

**Key Elements**:
- **Stats Cards**: Quick overview of property counts
- **Add Property Button**: Create new property
- **View Switcher**: Grid or List view
- **Search Bar**: Find properties by name/address
- **Property Cards**: Visual cards showing key info

---

## How to Add Properties

### Method 1: Quick Add (Simple)

**Best for**: Basic property listings when you need to add something fast.

**Steps**:
1. Click **"+ Add Property"** button
2. Fill in required fields:
   - **Title**: "Modern Villa DHA Phase 8"
   - **Address**: "123 Street 45, DHA Phase 8"
   - **Type**: Residential > Villa
   - **Price**: PKR 75,000,000
   - **Area**: 500 square yards
3. Click **"Add Property"**
4. Done! Property is now listed.

**Time**: ~2 minutes

### Method 2: Full Property Form (Detailed)

**Best for**: Complete property listings with all details.

**Steps**:

#### Step 1: Basic Information
```
Property Title:     [Modern Villa DHA Phase 8]
Property Type:      [Residential ▼] → [Villa ▼]
Address:            [123 Street 45, DHA Phase 8, Karachi]
Location:           [DHA Phase 8 ▼]
```

#### Step 2: Property Details
```
Area:               [500] [Square Yards ▼]
Bedrooms:           [4]
Bathrooms:          [5]
Floors:             [2]
Year Built:         [2020]
Parking Spaces:     [2]
```

#### Step 3: Pricing
```
Asking Price:       PKR [75,000,000]
Price per Sq Yd:    PKR 150,000 (auto-calculated)
Negotiable:         ☑ Yes
```

#### Step 4: Acquisition Type
```
● Agency Inventory (We bought it)
○ Client Listing (Owner's property)
○ Investor Syndication (Shared ownership)
```

**If Agency Inventory**:
```
Purchase Price:     PKR [50,000,000]
Purchase Date:      [Jan 1, 2025]
Acquisition Costs:  PKR [2,000,000]
```

**If Client Listing**:
```
Owner:              [Search for contact...] → Ahmed Khan
Commission Rate:    [2] %
Listing Agreement:  [Upload contract]
```

**If Investor Syndication**:
```
Total Investment:   PKR [120,000,000]
Number of Shares:   [10]
Select Investors:   
  ☑ Ahmed Khan (30%)
  ☑ Sara Ali (20%)
  ☑ Agency (50%)
```

#### Step 5: Features & Amenities
```
☑ Swimming Pool
☑ Garden
☑ Security System
☑ Backup Generator
☐ Solar Panels
☑ Servant Quarters
```

#### Step 6: Photos
```
[Upload Photos]
- Main photo (required)
- Additional photos (recommended: 5-10)
- Video tour (optional)

Drag & drop or click to upload
```

#### Step 7: Description
```
┌─────────────────────────────────────┐
│ Stunning modern villa in prime DHA  │
│ location. Fully renovated with      │
│ contemporary finishes. Move-in ready│
│ with all amenities.                 │
└─────────────────────────────────────┘
```

#### Step 8: Agent Assignment
```
Assigned Agent:     [Ali Khan ▼]
Listing Date:       [Today]
Status:             [Available ▼]
```

5. Click **"Create Property"**
6. Property is now in the system!

**Time**: ~10-15 minutes

---

## Managing Properties

### Viewing Property Details

**To view a property**:
1. Click on any property card in the workspace
2. Property detail page opens

**Property Detail Page Sections**:

#### Header Section
```
┌────────────────────────────────────────┐
│ Modern Villa DHA Phase 8               │
│ 123 Street 45, DHA Phase 8             │
│                                        │
│ PKR 75M  │  500 sq yd  │  4 BR  │  5 BA│
│                                        │
│ [Edit] [Share] [Start Sell Cycle]     │
└────────────────────────────────────────┘
```

#### Connected Entities Bar
```
┌────────────────────────────────────────┐
│ Owner: Ahmed Khan  │  Agent: Ali Khan  │
└────────────────────────────────────────┘
```

#### Tabs
1. **Overview Tab**: Property details, features, description
2. **Photos Tab**: Image gallery
3. **Documents Tab**: Contracts, agreements, certificates
4. **Transactions Tab**: All buy/sell cycles for this property
5. **Timeline Tab**: Activity history
6. **Financials Tab**: Costs, revenue, profit/loss

### Editing Properties

**To edit a property**:
1. Open property detail page
2. Click **"Edit"** button (top-right)
3. Update any fields
4. Click **"Save Changes"**

**What You Can Edit**:
- ✅ Title, description
- ✅ Price, area, specifications
- ✅ Photos (add/remove)
- ✅ Features & amenities
- ✅ Status (Available, Under Offer, Sold)
- ❌ Ownership history (auto-managed)
- ❌ Transaction records (auto-managed)

### Changing Property Status

**Method 1: Manual Status Change**
1. Open property detail page
2. Click **"Edit"**
3. Change **"Status"** dropdown
4. Save changes

**Method 2: Automatic Status Change** (Recommended)
- Status changes automatically when you:
  - Start a Sell Cycle → Status: "Under Offer"
  - Complete Sale → Status: "Sold"
  - Re-list property → Status: "Available"

### Uploading Photos

**To add/change photos**:
1. Open property detail page
2. Go to **"Photos"** tab
3. Click **"Upload Photos"**
4. Select images from your computer
5. Set one as "Main Photo"
6. Click **"Save"**

**Photo Guidelines**:
- **Format**: JPG, PNG (recommended: JPG)
- **Size**: Maximum 5MB per photo
- **Quantity**: 1 main + up to 20 additional
- **Quality**: High resolution (1920x1080 or higher)
- **Order**: First photo is the main/featured image

---

## Property Lifecycle

### Lifecycle Stages

#### Stage 1: Property Added
```
Property created → Status: Available → Ready for marketing
```

**Actions at this stage**:
- Upload photos
- Write compelling description
- Set competitive pricing
- Assign to agent

#### Stage 2: Marketing & Leads
```
Available → Generating leads → Interested buyers
```

**Actions at this stage**:
- Share property listing
- Create deals with interested buyers
- Schedule property viewings
- Answer buyer inquiries

#### Stage 3: Under Offer
```
Buyer makes offer → Negotiation → Under Offer status
```

**Actions at this stage**:
- Review offers
- Negotiate price
- Prepare documentation
- Start Sell Cycle (transaction)

#### Stage 4: Sale Completed
```
Agreement signed → Payment received → Sold status
```

**Actions at this stage**:
- Transfer ownership
- Complete Sell Cycle
- Update property status
- Record transaction

#### Stage 5: Post-Sale (Optional)
```
Sold → Buy back → Re-list → Available again
```

**Actions at this stage**:
- Monitor market
- Consider re-purchase
- Re-list if bought back
- Start new cycle

### Ownership Transfers

**When a property is sold, ownership transfers automatically**:

**Before Sale**:
```
Property: Modern Villa
Current Owner: Ahmed Khan
Status: Available
```

**After Sale**:
```
Property: Modern Villa
Current Owner: Sara Ali
Previous Owner: Ahmed Khan
Ownership History:
  - Ahmed Khan (Jan 2024 - Dec 2024)
  - [Previous owners...]
Status: Sold
```

**Important**: The property record stays in the system forever. Only ownership changes.

---

## Common Workflows

### Workflow 1: Add Agency Inventory Property

**Scenario**: Your agency purchases a villa to renovate and resell.

**Steps**:
1. **Add Property**
   - Click "Add Property"
   - Fill in property details
   - Select "Agency Inventory" as acquisition type
   - Enter purchase price: PKR 50M
   - Upload photos

2. **Renovate (Outside System)**
   - Do physical renovations
   - Take new photos

3. **Update Property**
   - Add renovation costs (PKR 5M)
   - Upload new photos
   - Update description
   - Set sale price: PKR 75M

4. **Market Property**
   - Share listing
   - Generate leads
   - Create deals

5. **Sell Property**
   - Start Sell Cycle
   - Complete transaction
   - Record profit: PKR 20M (75M - 50M - 5M)

### Workflow 2: Add Client Listing

**Scenario**: A client (Mr. Ahmed) wants you to sell his property.

**Steps**:
1. **Add Client as Contact** (if new)
   - Go to Contacts
   - Add "Ahmed Khan"
   - Type: Owner/Seller

2. **Add Property**
   - Click "Add Property"
   - Fill in property details
   - Select "Client Listing"
   - Link to owner: Ahmed Khan
   - Set commission rate: 2%

3. **Get Listing Agreement**
   - Prepare agreement
   - Upload to Documents tab
   - Set validity period

4. **Market Property**
   - Share listing
   - Find buyers
   - Schedule viewings

5. **Sell Property**
   - Start Sell Cycle
   - Complete sale
   - Earn commission: 2% of PKR 75M = PKR 1.5M

### Workflow 3: Re-list Sold Property

**Scenario**: A property you sold 6 months ago is now back on the market.

**Steps**:
1. **Find Property**
   - Go to Properties
   - Filter: Status = "Sold"
   - Find the property

2. **Check Re-listable**
   - Property shows "Re-listable" badge
   - Current owner wants to sell

3. **Re-list Property**
   - Click "Re-list Property"
   - Update pricing if needed
   - Add new photos if available
   - Set new listing date

4. **Start New Cycle**
   - Status changes to "Available"
   - Create new Sell Cycle
   - Market to buyers

5. **Complete New Sale**
   - Same process as original sale
   - New transaction record created
   - Ownership transfers again

### Workflow 4: Investor Syndication

**Scenario**: You and 3 investors buy a commercial plaza together.

**Steps**:
1. **Add Investors as Contacts**
   - Add all investors to Contacts
   - Type: Investor

2. **Add Property**
   - Click "Add Property"
   - Fill in property details
   - Select "Investor Syndication"
   - Total investment: PKR 120M

3. **Allocate Shares**
   - Ahmed Khan: 30% (PKR 36M)
   - Sara Ali: 20% (PKR 24M)
   - Khan Ahmed: 20% (PKR 24M)
   - Agency: 30% (PKR 36M)
   - Total: 100% (PKR 120M)

4. **Manage Investment**
   - Track rental income
   - Distribute profits
   - Monitor property value

5. **Exit Investment**
   - Sell property
   - Distribute proceeds by %:
     - Ahmed: 30% of profit
     - Sara: 20% of profit
     - Khan: 20% of profit
     - Agency: 30% of profit

---

## Tips & Best Practices

### Property Listing Tips

✅ **DO**:
- **Use Clear Titles**: "Modern 4BR Villa in DHA Phase 8" (good) vs "Property" (bad)
- **Upload Quality Photos**: Minimum 5 photos, well-lit, professional
- **Write Detailed Descriptions**: Highlight unique features
- **Set Competitive Pricing**: Research market rates
- **Update Regularly**: Keep information current
- **Link Entities**: Connect owners, agents, buyers
- **Use Accurate Measurements**: Verify area calculations
- **Add All Amenities**: Helps buyers find what they need

❌ **DON'T**:
- Use vague titles: "Nice house"
- Upload blurry or dark photos
- Leave description empty
- Overprice significantly
- Forget to update status
- Leave fields blank
- Guess at measurements
- Skip important features

### Photo Best Practices

**Optimal Photo Set**:
1. **Exterior Front View** (Main photo)
2. **Living Room** (Well-lit)
3. **Master Bedroom** (Staged)
4. **Kitchen** (Clean, organized)
5. **Bathroom** (Modern, clean)
6. **Garden/Outdoor** (If applicable)
7. **Parking** (If applicable)
8. **Street View** (Show location)

**Photo Tips**:
- Take photos during daytime (natural light)
- Clean and stage rooms before photographing
- Use wide-angle lens for rooms
- Show property's best features
- Include neighborhood shots
- Avoid personal items in frame
- Edit for brightness/contrast
- Consistent orientation (all landscape or portrait)

### Pricing Strategy

**How to Set Competitive Prices**:

1. **Research Market**
   - Check similar properties in area
   - Use aaraazi Reports for market trends
   - Consider recent sales data

2. **Calculate Price**
   ```
   Base Price:        PKR 50M (market rate)
   + Premium Features: PKR 5M (pool, garden)
   + Location Value:  PKR 10M (prime DHA)
   - Negotiation Room: PKR 5M (10% buffer)
   = Asking Price:    PKR 60M
   ```

3. **Monitor & Adjust**
   - Track days on market
   - Review buyer feedback
   - Adjust if no interest after 30 days
   - Consider market changes

### Search & Filter Tips

**Quick Searches**:
- By location: "DHA Phase 8"
- By price range: Use price sliders
- By type: Select "Villa" or "Apartment"
- By status: Filter "Available" only
- By agent: "My Properties" filter

**Advanced Filters**:
```
Type:        [Residential ▼]
Sub-type:    [Villa ▼]
Location:    [DHA Phase 8 ▼]
Price:       [PKR 50M - 100M]
Area:        [400 - 600 sq yd]
Bedrooms:    [4+]
Status:      [Available ▼]
Agent:       [All Agents ▼]
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: Can't Find My Property

**Problem**: Property doesn't appear in the list.

**Solutions**:
1. **Check Filters**
   - Clear all filters
   - Make sure "All Status" is selected
   - Check "All Agents" (if admin)

2. **Check Search**
   - Clear search box
   - Try searching by address

3. **Check Permissions**
   - Agents only see their own properties
   - Ask admin if you should have access

#### Issue 2: Photos Not Uploading

**Problem**: Photos fail to upload.

**Solutions**:
1. **Check File Size**
   - Max 5MB per photo
   - Compress large images

2. **Check Format**
   - Use JPG or PNG
   - Convert HEIC or other formats

3. **Check Internet**
   - Ensure stable connection
   - Try again with better signal

#### Issue 3: Property Status Won't Change

**Problem**: Status stuck on "Under Offer" or "Sold".

**Solutions**:
1. **Check Transaction**
   - Status linked to active Sell Cycle
   - Complete or cancel the transaction first

2. **Manual Override** (Admin only)
   - Edit property
   - Force status change
   - Add reason in notes

#### Issue 4: Duplicate Properties

**Problem**: Same property appears twice.

**Solutions**:
1. **Search First**
   - Always search before adding
   - Check by address

2. **Merge Properties** (Admin only)
   - Contact admin to merge
   - Keep primary record
   - Transfer transactions to primary

#### Issue 5: Owner Information Wrong

**Problem**: Wrong owner shown for property.

**Solutions**:
1. **Check Ownership History**
   - View "Transactions" tab
   - Verify last completed sale

2. **Update Ownership** (Admin only)
   - Use ownership transfer tool
   - Select correct owner
   - Document reason

---

## FAQs

### General Questions

**Q: What's the difference between a property and a transaction?**  
A: A **property** is the physical asset (the building/land). A **transaction** is a deal to buy/sell/rent that property. One property can have many transactions over time.

**Q: Can I delete a property?**  
A: No. Properties are never deleted (asset-centric model). You can mark them as "Archived" or "Inactive" instead.

**Q: What happens to properties when they're sold?**  
A: The property record remains. Ownership transfers to the buyer. The property can be re-listed and sold again later.

**Q: Can I add properties without photos?**  
A: Yes, but it's not recommended. Properties with photos get more interest and sell faster.

**Q: How many properties can I add?**  
A: No limit. Add as many as your agency manages.

### Agency Inventory

**Q: What is agency inventory?**  
A: Properties that your agency owns 100%. You bought them and will sell them for profit.

**Q: How do I track profit on inventory properties?**  
A: When you sell, the system calculates:
```
Profit = Sale Price - (Purchase Price + Costs)
```
View this in the Property Financials tab.

**Q: Can I convert client listing to inventory?**  
A: Yes, if you buy it from the client. Create a Purchase Cycle, then update the acquisition type.

### Client Listings

**Q: How do I set commission rates?**  
A: When adding a client listing, set the commission rate (default 2% for sales, 1 month for rent).

**Q: What if the client sells directly?**  
A: Mark the Sell Cycle as "Lost" and note the reason. Update property status to "Sold" manually.

**Q: Can I have multiple agents on one property?**  
A: Yes. Assign a primary agent, and add co-agents in the property details.

### Investor Syndication

**Q: How many investors can share one property?**  
A: No limit, but typically 2-10 investors work well.

**Q: How are profits distributed?**  
A: Based on ownership percentage. If you own 30%, you get 30% of profit when sold.

**Q: Can investors sell their share?**  
A: Not directly in the system. This is handled outside aaraazi (legal agreements).

### Re-listing

**Q: When can I re-list a property?**  
A: When:
- Property was sold (status: Sold)
- Current owner wants to sell again
- Or you buy it back into inventory

**Q: Do I keep the old transaction history?**  
A: Yes! All previous transactions remain in the property's history.

**Q: Can I re-list at a different price?**  
A: Yes. Set whatever price makes sense for the current market.

---

## Quick Reference

### Property Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Property name (e.g., "Modern Villa DHA") |
| **Type** | Yes | Residential, Commercial, Land |
| **Address** | Yes | Full street address |
| **Price** | Yes | Asking price in PKR |
| **Area** | Yes | Size in sq yards/sq meters |
| **Bedrooms** | No | Number of bedrooms |
| **Bathrooms** | No | Number of bathrooms |
| **Features** | No | Pool, garden, parking, etc. |
| **Photos** | Recommended | Property images |
| **Description** | Recommended | Detailed description |
| **Agent** | Yes | Assigned agent |
| **Status** | Yes | Available, Under Offer, Sold |

### Status Meanings

| Status | Meaning | What It Means |
|--------|---------|---------------|
| **Available** | 🟢 | Listed and ready for buyers |
| **Under Offer** | 🟡 | Offer received, negotiating |
| **Sold** | 🔴 | Sale completed, ownership transferred |
| **Rented** | 🔵 | Currently leased to tenant |
| **Off Market** | ⚪ | Not actively marketed |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Add new property |
| `Ctrl + F` | Search properties |
| `Ctrl + E` | Edit selected property |
| `/` | Focus search box |

---

## Next Steps

### After Adding Your First Property

1. **Upload Photos** - Make it visual
2. **Write Description** - Highlight features
3. **Set Competitive Price** - Research market
4. **Share Listing** - Start marketing
5. **Generate Leads** - Track interested buyers
6. **Create Deals** - Move towards sale
7. **Start Sell Cycle** - Begin transaction

### Learn More

- **Transactions Module**: How to start sell/purchase/rent cycles
- **Leads Module**: How to track interested buyers
- **Deals Module**: How to manage deals and offers
- **Portfolio Module**: How to track agency inventory

---

**Need Help?**

- **In-app**: Click the "?" icon for context help
- **Support**: Contact your system administrator
- **Training**: Request module training session

---

**End of Properties Module User Guide**

**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Module**: Properties Management  
**aaraazi Real Estate Platform**

🏠 **Happy Property Managing!**
