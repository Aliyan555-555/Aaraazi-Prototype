# Helper Components Guide - Extended Collection

## 📦 Overview

This guide covers the **7 new specialized helper components** created to address specific needs across detail pages in aaraazi.

---

## 🆕 New Components Created

1. **OfferCard** - Rich offer display with actions
2. **DocumentList** - Document management with upload/download
3. **CommissionCalculator** - Commission breakdown display
4. **ContactCard** - Contact information with quick actions
5. **NotesPanel** - Notes/comments management
6. **RelatedEntitiesGrid** - Related entities in grid/list view
7. **FilterPanel** - Advanced filtering component

---

## 1️⃣ OfferCard

### **Purpose**
Display detailed offer information with accept/reject actions.

### **Features**
✅ Rich buyer information display  
✅ Offer amount with percentage of asking  
✅ Token money display  
✅ Conditions and notes sections  
✅ Expiry tracking with warnings  
✅ Accept/Reject/Counter actions  
✅ Status badges and indicators  
✅ Responsive layout  

### **Usage**

```tsx
import { OfferCard } from '../layout';

<OfferCard
  offer={{
    id: '1',
    buyerName: 'John Doe',
    buyerContact: '+92 300 1234567',
    buyerEmail: 'john@example.com',
    offerAmount: 5000000,
    tokenAmount: 500000,
    offeredDate: '2024-12-20',
    expiryDate: '2024-12-31',
    status: 'pending',
    conditions: 'Subject to loan approval',
    notes: 'Interested in immediate possession',
    agentNotes: 'Strong buyer, pre-qualified'
  }}
  askingPrice={5500000}
  isAccepted={false}
  canTakeAction={true}
  onAccept={() => handleAccept(offer.id)}
  onReject={() => handleReject(offer.id)}
  onView={() => viewOffer(offer.id)}
  onCounter={() => counterOffer(offer.id)}
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `offer` | `OfferData` | ✅ | Offer data object |
| `askingPrice` | `number` | ✅ | Property asking price |
| `isAccepted` | `boolean` | ❌ | Highlight as accepted |
| `canTakeAction` | `boolean` | ❌ | Show action buttons |
| `onAccept` | `() => void` | ❌ | Accept handler |
| `onReject` | `() => void` | ❌ | Reject handler |
| `onView` | `() => void` | ❌ | View details handler |
| `onCounter` | `() => void` | ❌ | Counter offer handler |

### **When to Use**
- Detail view of individual offers
- Offer comparison screens
- Mobile-friendly offer display
- Alternative to DataTable for offers

---

## 2️⃣ DocumentList

### **Purpose**
Display and manage documents with upload/download functionality.

### **Features**
✅ File type icons (PDF, DOC, images, etc.)  
✅ Upload functionality  
✅ Download/preview actions  
✅ Delete capability  
✅ File size and date display  
✅ User attribution  
✅ Categories and tags  
✅ Empty state  

### **Usage**

```tsx
import { DocumentList } from '../layout';

<DocumentList
  documents={[
    {
      id: '1',
      name: 'Sale Agreement.pdf',
      type: 'pdf',
      size: 2048576, // bytes
      uploadedDate: '2024-12-20',
      uploadedBy: 'John Doe',
      category: 'Legal',
      tags: ['agreement', 'signed'],
      url: '/documents/...'
    }
  ]}
  title="Property Documents"
  canUpload={user.role === 'admin'}
  canDelete={user.role === 'admin'}
  onUpload={handleUpload}
  onDownload={handleDownload}
  onPreview={handlePreview}
  onDelete={handleDelete}
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `documents` | `Document[]` | ✅ | Array of documents |
| `title` | `string` | ❌ | Panel title |
| `canUpload` | `boolean` | ❌ | Show upload button |
| `canDelete` | `boolean` | ❌ | Show delete buttons |
| `onUpload` | `(files: FileList) => void` | ❌ | Upload handler |
| `onDownload` | `(doc: Document) => void` | ❌ | Download handler |
| `onPreview` | `(doc: Document) => void` | ❌ | Preview handler |
| `onDelete` | `(id: string) => void` | ❌ | Delete handler |

### **When to Use**
- Property documents tab
- Deal documents section
- Legal documents display
- Any file management needs

---

## 3️⃣ CommissionCalculator

### **Purpose**
Display commission breakdown with tax and split calculations.

### **Features**
✅ Percentage vs fixed commission  
✅ Gross commission calculation  
✅ Tax deduction  
✅ Other deductions  
✅ Net commission  
✅ Split commission (co-agents)  
✅ Visual breakdown  
✅ Summary cards  

### **Usage**

```tsx
import { CommissionCalculator } from '../layout';

<CommissionCalculator
  totalAmount={5000000}
  commissionType="percentage"
  commissionRate={2}
  splitPercentage={50}
  agentName="John Doe"
  coAgentName="Jane Smith"
  taxRate={5}
  otherDeductions={10000}
  title="Commission Breakdown"
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `totalAmount` | `number` | ✅ | Transaction amount |
| `commissionType` | `'percentage' \| 'fixed'` | ✅ | Commission type |
| `commissionRate` | `number` | ✅ | Rate/amount |
| `splitPercentage` | `number` | ❌ | Split % (0-100) |
| `agentName` | `string` | ❌ | Primary agent name |
| `coAgentName` | `string` | ❌ | Co-agent name |
| `taxRate` | `number` | ❌ | Tax percentage |
| `otherDeductions` | `number` | ❌ | Deduction amount |

### **Calculation**
```
Gross Commission = Transaction × Rate%
Tax = Gross × Tax%
Net Commission = Gross - Tax - Deductions
Agent 1 = Net × Split%
Agent 2 = Net × (100 - Split%)
```

### **When to Use**
- Sell Cycle commission display
- Purchase Cycle commission
- Deal commission breakdown
- Agent earnings reports

---

## 4️⃣ ContactCard

### **Purpose**
Display contact information with quick action buttons.

### **Features**
✅ Avatar or initials display  
✅ Role badges  
✅ Phone, email, address  
✅ Company and designation  
✅ Last contact date  
✅ Notes section  
✅ Tags  
✅ Quick actions (call, email, message)  
✅ Edit functionality  
✅ Click to view full profile  

### **Usage**

```tsx
import { ContactCard } from '../layout';

<ContactCard
  name="John Doe"
  role="buyer"
  avatar="/avatars/john.jpg"
  phone="+92 300 1234567"
  email="john@example.com"
  address="DHA Phase 8, Karachi"
  company="ABC Corporation"
  designation="Director"
  lastContact="2024-12-20"
  notes="Prefers morning calls"
  tags={['VIP', 'Cash buyer']}
  onCall={() => window.open('tel:+923001234567')}
  onEmail={() => window.open('mailto:john@example.com')}
  onMessage={() => sendMessage('john')}
  onEdit={() => editContact('john')}
  onClick={() => viewProfile('john')}
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✅ | Contact name |
| `role` | `string` | ❌ | Role (buyer, seller, etc.) |
| `avatar` | `string` | ❌ | Avatar URL |
| `phone` | `string` | ❌ | Phone number |
| `email` | `string` | ❌ | Email address |
| `address` | `string` | ❌ | Physical address |
| `company` | `string` | ❌ | Company name |
| `designation` | `string` | ❌ | Job title |
| `lastContact` | `string` | ❌ | ISO date string |
| `notes` | `string` | ❌ | Internal notes |
| `tags` | `string[]` | ❌ | Tags array |
| `onCall` | `() => void` | ❌ | Call handler |
| `onEmail` | `() => void` | ❌ | Email handler |
| `onMessage` | `() => void` | ❌ | Message handler |
| `onEdit` | `() => void` | ❌ | Edit handler |
| `onClick` | `() => void` | ❌ | Card click handler |

### **When to Use**
- Buyer/Seller information display
- Agent contact cards
- Client directory
- Contact management sections

---

## 5️⃣ NotesPanel

### **Purpose**
Manage notes and comments with full CRUD operations.

### **Features**
✅ Add new notes with type (internal/client/general)  
✅ Edit existing notes  
✅ Delete notes  
✅ Pin important notes  
✅ User attribution  
✅ Relative timestamps  
✅ Sort by pinned/date  
✅ Type badges  
✅ Empty state  

### **Usage**

```tsx
import { NotesPanel } from '../layout';

<NotesPanel
  notes={[
    {
      id: '1',
      content: 'Buyer wants immediate possession',
      createdBy: 'user1',
      createdByName: 'John Agent',
      createdAt: '2024-12-20T10:30:00',
      isPinned: true,
      type: 'internal'
    }
  ]}
  currentUserId={user.id}
  currentUserName={user.name}
  title="Notes & Comments"
  canAdd={true}
  canEdit={true}
  canDelete={true}
  canPin={true}
  onAdd={(content, type) => addNote(content, type)}
  onEdit={(id, content) => editNote(id, content)}
  onDelete={(id) => deleteNote(id)}
  onPin={(id) => togglePin(id)}
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `notes` | `Note[]` | ✅ | Notes array |
| `currentUserId` | `string` | ✅ | Current user ID |
| `currentUserName` | `string` | ✅ | Current user name |
| `title` | `string` | ❌ | Panel title |
| `canAdd` | `boolean` | ❌ | Show add form |
| `canEdit` | `boolean` | ❌ | Allow editing |
| `canDelete` | `boolean` | ❌ | Allow deletion |
| `canPin` | `boolean` | ❌ | Allow pinning |
| `onAdd` | `(content, type) => void` | ❌ | Add handler |
| `onEdit` | `(id, content) => void` | ❌ | Edit handler |
| `onDelete` | `(id) => void` | ❌ | Delete handler |
| `onPin` | `(id) => void` | ❌ | Pin handler |

### **Note Types**
- **`internal`** - Agent/staff only (yellow badge)
- **`client`** - Client-visible (blue badge)
- **`general`** - Default type (gray badge)

### **When to Use**
- Property notes section
- Deal comments
- Client interaction history
- Internal team communications

---

## 6️⃣ RelatedEntitiesGrid

### **Purpose**
Display related entities in grid or list view with navigation.

### **Features**
✅ Grid/list view toggle  
✅ Entity cards with metadata  
✅ Status indicators  
✅ Image display  
✅ Click to navigate  
✅ Custom card rendering  
✅ Responsive columns  
✅ Empty state  

### **Usage**

```tsx
import { RelatedEntitiesGrid } from '../layout';

<RelatedEntitiesGrid
  title="Related Properties"
  entities={[
    {
      id: '1',
      type: 'property',
      title: 'DHA Phase 8 Villa',
      subtitle: '500 sq yd',
      status: 'available',
      badge: 'Hot',
      imageUrl: '/images/property1.jpg',
      metadata: [
        { label: 'Price', value: formatPKR(5000000) },
        { label: 'Bedrooms', value: 5 },
        { label: 'Listed', value: '2 days ago' }
      ]
    }
  ]}
  columns={3}
  defaultView="grid"
  onEntityClick={(entity) => navigateTo(entity.id)}
  showViewToggle={true}
/>
```

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Grid title |
| `entities` | `RelatedEntity[]` | ✅ | Entities array |
| `columns` | `2 \| 3 \| 4` | ❌ | Grid columns |
| `defaultView` | `'grid' \| 'list'` | ❌ | Default view |
| `onEntityClick` | `(entity) => void` | ❌ | Click handler |
| `renderCustomCard` | `(entity) => ReactNode` | ❌ | Custom renderer |
| `emptyMessage` | `string` | ❌ | Empty message |
| `showViewToggle` | `boolean` | ❌ | Show toggle |

### **When to Use**
- Related properties grid
- Similar listings display
- Client portfolio view
- Agent's properties grid

---

## 7️⃣ FilterPanel

### **Purpose**
Advanced filtering with multiple filter types.

### **Features**
✅ Multiple filter types (select, multi-select, range, date, search)  
✅ Active filter count badge  
✅ Clear all filters  
✅ Collapsible sections  
✅ Active filters display with remove  
✅ Option counts  
✅ Responsive layout  

### **Usage**

```tsx
import { FilterPanel } from '../layout';

<FilterPanel
  filters={[
    {
      id: 'status',
      label: 'Status',
      type: 'multi-select',
      options: [
        { label: 'Pending', value: 'pending', count: 12 },
        { label: 'Active', value: 'active', count: 45 },
        { label: 'Sold', value: 'sold', count: 8 }
      ],
      value: ['pending', 'active']
    },
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'range',
      min: 0,
      max: 10000000,
      value: [0, 5000000],
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: 'listedDate',
      label: 'Listed Date',
      type: 'date-range',
      value: ['2024-01-01', '2024-12-31'],
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search properties...',
      value: ''
    }
  ]}
  onFilterChange={(filterId, value) => updateFilter(filterId, value)}
  onClearAll={() => clearAllFilters()}
  title="Filters"
  collapsible={true}
  defaultExpanded={true}
  showActiveCount={true}
/>
```

### **Filter Types**

1. **`select`** - Single selection dropdown
2. **`multi-select`** - Multiple checkboxes
3. **`range`** - Min/max number inputs
4. **`date-range`** - Start/end date pickers
5. **`search`** - Text search input

### **Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `filters` | `FilterConfig[]` | ✅ | Filter configs |
| `onFilterChange` | `(id, value) => void` | ✅ | Change handler |
| `onClearAll` | `() => void` | ✅ | Clear handler |
| `title` | `string` | ❌ | Panel title |
| `collapsible` | `boolean` | ❌ | Collapsible panel |
| `defaultExpanded` | `boolean` | ❌ | Initial state |
| `showActiveCount` | `boolean` | ❌ | Show count badge |

### **When to Use**
- Property search/filter
- Deal filtering
- Advanced search pages
- Report filters

---

## 📊 Component Comparison

| Component | Use Case | Complexity | Data Type |
|-----------|----------|------------|-----------|
| **OfferCard** | Individual offer display | Medium | Single offer |
| **DocumentList** | File management | Medium | File array |
| **CommissionCalculator** | Commission breakdown | Low | Numbers |
| **ContactCard** | Contact display | Low | Contact info |
| **NotesPanel** | Notes management | High | Note array |
| **RelatedEntitiesGrid** | Entity grid/list | Medium | Entity array |
| **FilterPanel** | Advanced filtering | High | Filter configs |

---

## 🎯 Implementation Examples

### **Example 1: Sell Cycle with OfferCard**

```tsx
// In Offers tab
const offersContent = allOffersSorted.map(offer => (
  <OfferCard
    key={offer.id}
    offer={offer}
    askingPrice={cycle.askingPrice}
    isAccepted={offer.id === cycle.acceptedOfferId}
    onAccept={() => handleAccept(offer.id)}
    onReject={() => handleReject(offer.id)}
  />
));
```

### **Example 2: Property with Documents**

```tsx
// In Documents tab
<DocumentList
  documents={property.documents}
  canUpload={user.role === 'admin'}
  onUpload={(files) => uploadDocuments(property.id, files)}
  onDownload={(doc) => downloadDocument(doc)}
/>
```

### **Example 3: Deal with Notes**

```tsx
// In Activity tab
<NotesPanel
  notes={deal.notes}
  currentUserId={user.id}
  currentUserName={user.name}
  onAdd={(content, type) => addDealNote(deal.id, content, type)}
/>
```

---

## 🔄 Integration with DetailPageTemplate

All these components work seamlessly with the DetailPageTemplate system:

```tsx
const tabs: DetailPageTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <>
        {/* Use CommissionCalculator */}
        <CommissionCalculator {...commissionData} />
        
        {/* Use ContactCard */}
        <ContactCard {...buyerInfo} />
      </>
    ),
    sidebar: (
      <>
        <QuickActionsPanel {...actions} />
        <NotesPanel {...notes} />
      </>
    ),
    layout: '2-1'
  },
  {
    id: 'offers',
    label: 'Offers',
    content: (
      <>
        <FilterPanel {...filterConfig} />
        {offers.map(offer => (
          <OfferCard key={offer.id} {...offer} />
        ))}
      </>
    ),
    layout: '3-0'
  },
  {
    id: 'documents',
    label: 'Documents',
    content: <DocumentList {...documents} />,
    layout: '3-0'
  },
  {
    id: 'related',
    label: 'Related',
    content: <RelatedEntitiesGrid {...relatedProperties} />,
    layout: '3-0'
  }
];
```

---

## ✅ Best Practices

### **DO:**
✅ Use OfferCard for detailed offer views  
✅ Use DocumentList for all file management  
✅ Use CommissionCalculator for financial breakdowns  
✅ Use ContactCard for contact information  
✅ Use NotesPanel for collaborative notes  
✅ Use RelatedEntitiesGrid for related items  
✅ Use FilterPanel for advanced filtering  

### **DON'T:**
❌ Create custom offer cards  
❌ Build custom file upload UI  
❌ Calculate commissions inline  
❌ Display contacts without ContactCard  
❌ Use basic textarea for notes  
❌ Create custom entity grids  
❌ Build filters from scratch  

---

## 📦 Export Summary

All components are exported from `/components/layout/index.ts`:

```tsx
import {
  // Template
  DetailPageTemplate,
  
  // Original Helpers
  QuickActionsPanel,
  MetricCardsGroup,
  DataTable,
  ActivityTimeline,
  
  // NEW Specialized Helpers
  OfferCard,
  DocumentList,
  CommissionCalculator,
  ContactCard,
  NotesPanel,
  RelatedEntitiesGrid,
  FilterPanel,
  
  // Foundation
  PageHeader,
  ConnectedEntitiesBar,
  StatusBadge,
} from '../layout';
```

---

## 🎊 Conclusion

These **7 specialized helper components** provide:

✅ **Consistent UI patterns** across detail pages  
✅ **Reduced development time** (reusable components)  
✅ **Better user experience** (proven patterns)  
✅ **Easier maintenance** (single source of truth)  
✅ **Full TypeScript support** (type safety)  
✅ **Responsive design** (mobile-first)  
✅ **Accessibility** (WCAG 2.1 AA)  

**Ready to use in all detail pages and beyond!** 🚀

---

**Created:** December 27, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
