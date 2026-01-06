# aaraazi Development Guidelines

## General Development Guidelines

### Code Organization
* Keep components focused and single-purpose - each component should handle one specific feature or UI element
* Use TypeScript interfaces for all props and data structures
* Place helper functions and utilities in separate files under `/lib`
* Keep component files under 300 lines - split larger components into smaller ones
* Use the established folder structure: `/components` for UI, `/lib` for business logic, `/types` for interfaces

### Code Quality Standards
* Always use TypeScript with strict type checking - no `any` types without justification
* Implement proper error handling using try-catch blocks and the ErrorBoundary component
* Use meaningful variable and function names that clearly describe their purpose
* Add JSDoc comments for complex functions and business logic
* Follow the established naming conventions: PascalCase for components, camelCase for functions, UPPER_SNAKE_CASE for constants

### Performance Best Practices
* Use React.memo() for components that receive stable props
* Implement proper cleanup in useEffect hooks to prevent memory leaks
* Use the `key` prop correctly in lists to optimize re-renders
* Avoid creating objects or functions inside render methods
* Load heavy components lazily when possible

---

## Design System Guidelines

### Typography
* **Base font size**: 14px (set in CSS custom property `--font-size`)
* **Font weights**: Use only 400 (normal) and 500 (medium) - defined in CSS variables
* **IMPORTANT**: Never use Tailwind typography classes (`text-xl`, `font-bold`, etc.) unless explicitly overriding defaults
* The typography system is handled by CSS in `/styles/globals.css` - let it handle sizing and weights automatically

### Color Palette
* **Primary**: `#030213` (Dark navy for primary actions and headers)
* **Secondary**: `#ececf0` (Light gray for secondary elements)
* **Muted**: `#ececf0` (For subtle backgrounds and borders)
* **Accent**: `#e9ebef` (For highlighted elements)
* **Background**: `#ffffff` (Main background)
* **Destructive**: `#d4183d` (For error states and dangerous actions)

### Component Styling Standards
* Use the established CSS custom properties for colors instead of hardcoded values
* Maintain consistent spacing using Tailwind's spacing scale (4, 8, 16, 24, 32px)
* Use `rounded-lg` (10px) for most UI elements to maintain consistent corner radius
* Apply proper hover and focus states using Tailwind utilities
* Ensure all interactive elements have proper accessibility attributes

---

## Application-Specific Guidelines

### Currency Formatting
* **Always use PKR** - aaraazi is built for the Karachi real estate market
* Import and use the `formatPKR()` function from `/lib/currency.ts` for all monetary values
* Never hardcode currency symbols or formatting logic in components
* Format: "PKR 1,500,000" (no decimal places for property prices)

### Date Formatting
* Use consistent date formats: "Dec 15, 2024" for display
* Store dates in ISO format in data storage
* Use the established date formatting patterns in existing components

### User Roles and Permissions
* **Admin users** can view and manage all data across the system
* **Agent users** can only access their own properties and leads, plus shared items
* Always check user role before displaying sensitive information or admin-only features
* Use the `user.role` property to conditionally render UI elements

### Data Management
* All data is stored in localStorage using the keys defined in `/lib/data.ts`
* Use the established data service functions for CRUD operations
* Implement proper error handling for data operations
* Always validate data before storing or displaying

---

## Component Guidelines

### Form Components
* Use the ShadCN form components from `/components/ui` for consistency
* Implement proper validation using the validation utilities in `/lib/validation.ts`
* Show loading states during form submission
* Display success/error messages using the Sonner toast system
* Include proper ARIA labels and accessibility attributes

### Navigation and Routing
* Use the established navigation pattern through the `onNavigate` callback prop
* Validate navigation parameters to prevent invalid states
* Handle back navigation properly to maintain user context
* Update the document title when navigating between sections

### Data Display Components
* Use consistent card layouts with proper spacing and shadows
* Implement empty states for lists and collections
* Show loading skeletons while data is being fetched
* Use proper table components for structured data display
* Include search and filtering capabilities where appropriate

### Modal and Dialog Components
* Use ShadCN Dialog components for consistency
* Implement proper focus management and keyboard navigation
* Include clear close actions and confirmation dialogs for destructive actions
* Ensure modals are properly accessible with ARIA attributes

---

## UI/UX Component Guidelines (Phase 1-4 - December 2024)

### Foundation Components (`/components/layout/`)

#### PageHeader Component
* **Usage**: Header for detail pages (Properties, Cycles, Deals, Requirements)
* **Props Required**: title, breadcrumbs, onBack
* **Props Optional**: description, metrics, primaryActions, secondaryActions
* **Best Practices**:
  - Max 5 metrics (Miller's Law)
  - Max 3 primary actions
  - Secondary actions in dropdown (Hick's Law)
  - Always include breadcrumbs for navigation
* **Example**:
```tsx
<PageHeader
  title="Modern Villa - DHA Phase 8"
  breadcrumbs={[
    { label: 'Properties', onClick: handleNavigation },
    { label: property.title }
  ]}
  metrics={[
    { label: 'Price', value: formatPKR(property.price), icon: <DollarSign /> },
    { label: 'Area', value: `${property.area} sq yd` }
  ]}
  onBack={handleBack}
/>
```

#### ConnectedEntitiesBar Component
* **Usage**: Display related entities (Owner, Agent, Buyer, etc.)
* **Props**: entities array with type, name, onClick
* **Best Practices**:
  - Max 5 entities visible (Miller's Law)
  - Use horizontal scroll for more
  - Color-code by entity type
  - Make clickable for navigation
* **Space Savings**: 87% (300px → 40px)

#### MetricCard Component
* **Usage**: Display key metrics with trends
* **Props**: label, value, icon, trend (optional)
* **Variants**: info, success, warning, danger
* **Best Practices**:
  - Use icons for quick recognition
  - Show trends when applicable
  - Keep labels concise (1-2 words)

#### StatusBadge Component
* **Usage**: Display status with consistent styling
* **Props**: status (string)
* **Auto-styling**: Maps status to color variants
* **Best Practices**:
  - Use for all status displays
  - Consistent mapping (available=green, sold=gray, etc.)

#### StatusTimeline Component
* **Usage**: Visual status progression
* **Props**: steps array with label, status, date
* **Best Practices**:
  - Max 7 steps (Miller's Law)
  - Show current status prominently
  - Include dates/timestamps

### Workspace Components (`/components/workspace/`)

#### WorkspaceHeader Component
* **Usage**: Header for workspace/listing pages
* **Props Required**: title
* **Props Optional**: description, stats, primaryAction, secondaryActions, viewMode, filters
* **Best Practices**:
  - Max 5 stats (Miller's Law)
  - Large primary action button (Fitts's Law)
  - View switcher for table/grid modes
  - Filter toggle with count badge
* **Example**:
```tsx
<WorkspaceHeader
  title="Properties"
  description="Manage your property portfolio"
  stats={[
    { label: 'Total', value: 150, variant: 'default' },
    { label: 'Available', value: 45, variant: 'success' }
  ]}
  primaryAction={{
    label: 'Add Property',
    icon: <Plus />,
    onClick: handleAdd
  }}
  viewMode="grid"
  onViewModeChange={setViewMode}
/>
```

#### WorkspaceSearchBar Component
* **Usage**: Search and filter for workspace pages
* **Props**: searchValue, onSearchChange, quickFilters, sortOptions
* **Features**:
  - Debounced search (300ms)
  - Multi-select filters
  - Active filter display
  - Clear all button
* **Best Practices**:
  - Max 7 quick filters (Miller's Law)
  - Include filter counts
  - Show active filters with remove buttons

#### WorkspaceEmptyState Component
* **Usage**: Empty states for workspaces
* **Props**: variant, title, description, primaryAction, guideItems
* **Variants**: empty, no-results, error
* **Presets Available**:
  - EmptyStatePresets.properties()
  - EmptyStatePresets.sellCycles()
  - EmptyStatePresets.purchaseCycles()
  - EmptyStatePresets.deals()
  - EmptyStatePresets.requirements()
  - EmptyStatePresets.noResults()
  - EmptyStatePresets.error()
* **Best Practices**:
  - Use presets for consistency
  - Max 5 guide items (Miller's Law)
  - Include helpful actions

### UX Laws Implementation

All components follow these 5 UX Laws:

1. **Fitts's Law** (Targeting)
   - Primary actions: Large buttons (44x44px minimum)
   - Optimal placement (top-right for actions)
   - Easy-to-click targets

2. **Miller's Law** (Cognitive Load)
   - Max 5-7 items in lists/groups
   - Metrics limited to 5
   - Filters limited to 7
   - Stats limited to 5

3. **Hick's Law** (Decision Time)
   - Progressive disclosure (secondary actions in dropdown)
   - Limited primary choices (1-3 max)
   - Filter options in popovers

4. **Jakob's Law** (Familiarity)
   - Breadcrumbs in expected location
   - Standard action placement
   - Familiar patterns throughout

5. **Aesthetic-Usability Effect**
   - Consistent spacing (8px grid)
   - Professional appearance
   - Smooth transitions
   - Cohesive design

### Component Usage Patterns

#### Detail Page Pattern
```tsx
export const EntityDetail = ({ entity, user, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={entity.title}
        breadcrumbs={breadcrumbs}
        metrics={metrics}
        primaryActions={primaryActions}
        secondaryActions={secondaryActions}
        onBack={onBack}
      />
      
      <ConnectedEntitiesBar entities={connectedEntities} />
      
      <div className="p-6">
        <Tabs>
          {/* Tab content */}
        </Tabs>
      </div>
    </div>
  );
};
```

#### Workspace Page Pattern
```tsx
export const EntityWorkspace = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceHeader
        title="Entities"
        stats={stats}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <WorkspaceSearchBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        quickFilters={quickFilters}
        sortOptions={sortOptions}
        onClearAll={handleClearFilters}
      />
      
      <div className="p-6">
        {data.length === 0 ? (
          <WorkspaceEmptyState {...EmptyStatePresets.entity(handleAdd)} />
        ) : (
          <DataDisplay data={data} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
};
```

### Performance Guidelines for New Components

* **PageHeader**: Already memoized with React.memo
* **WorkspaceHeader**: Already memoized with React.memo
* **WorkspaceSearchBar**: Uses debounced search (300ms)
* **All Lists**: Use useMemo for filtered/sorted data
* **Event Handlers**: Use useCallback where appropriate
* **Large Lists**: Consider pagination (> 50 items) or virtual scrolling (> 100 items)

### Accessibility Requirements

All new components must:
* Include proper ARIA labels on interactive elements
* Support keyboard navigation (Tab, Enter, Escape, Arrow keys)
* Have visible focus indicators (3px blue outline)
* Meet WCAG 2.1 AA color contrast (4.5:1 minimum)
* Work with screen readers (NVDA, JAWS, VoiceOver)
* Be responsive (mobile/tablet/desktop)

### Documentation Requirements

When creating new components similar to Phase 1-4 patterns:
* Add JSDoc comments with usage examples
* Document all props with TypeScript interfaces
* Include accessibility notes
* Provide example usage code
* Note any UX laws applied

---

## Module-Specific Guidelines

### Property Management - Asset-Centric Model
* **IMPORTANT**: aaraazi follows an **Asset-Centric** architecture, not a Listing-Centric model
* Properties represent **physical assets** that persist through multiple ownership cycles
* Each property can have multiple **transactions** (deals) over its lifetime
* Properties must include all required fields: title, address, price, type, area
* Images are optional but recommended - use the established image upload pattern
* Agent assignment is required - default to current user for new properties
* Implement proper ownership tracking using `currentOwnerId` and `ownershipHistory`
* Status represents listing state, NOT lifecycle end - sold properties can be re-listed
* Include commission rate configuration (default 2% for sales, 1 month for rentals)

#### Asset-Centric Key Principles
* **Property** = Permanent physical asset record (never deleted)
  - Has `currentOwnerId` field to track current owner
  - Has `ownershipHistory[]` array to preserve all past owners
  - Can be "sold" and "re-listed" unlimited times
* **Transaction** = Individual deal/agreement (many per property)
  - Each buy/sell creates a new Transaction record
  - Transactions are linked to properties via `propertyId`
  - All transactions are preserved as historical records
* **Ownership Transfer** = Updates property owner and creates history record
  - Use `transferOwnership()` function from `/lib/ownership.ts`
  - Automatically updates `currentOwnerId` and adds to `ownershipHistory`
  - Links transaction ID to ownership record for audit trail

#### Re-listing Workflow
1. Property is sold → status changes to "sold", ownership transfers to buyer
2. Property appears in "Re-listable Properties" filter
3. Agency can "re-list" (buy back) the property using `RelistPropertyModal`
4. New transaction is created for the re-purchase
5. Ownership transfers back to agency
6. Property becomes "available" for resale again
7. All history is preserved in `ownershipHistory` and transaction records

### Lead Management
* Follow the established 5-stage pipeline: New → Contacted → Qualified → Negotiation → Closed
* Always associate leads with interested properties
* Include lead source tracking for analytics
* Implement follow-up date scheduling and reminders
* Track conversion rates and agent performance

### Financial Management
* Use the modular FinancialsHub structure with 8 specialized modules
* All financial amounts must be in PKR using the currency utility
* Implement proper double-entry accounting principles where applicable
* Include project cost tracking with budget variance analysis
* Maintain proper audit trails for all financial transactions

### Document Management
* Support multiple file types: PDF, DOC, DOCX, JPG, PNG
* Implement proper access control based on user roles
* Include version tracking and document history
* Use meaningful file naming conventions
* Implement bulk operations for efficiency

---

## Security and Data Privacy Guidelines

### Authentication
* Use the established authentication system in `/lib/auth.ts`
* Implement proper session management with localStorage
* Include automatic logout on session expiry
* Validate user sessions on sensitive operations

### Data Protection
* Never store sensitive data in plain text
* Implement proper input sanitization and validation
* Use the ErrorBoundary component to catch and handle errors gracefully
* Include proper error logging for debugging

### Access Control
* Always check user permissions before displaying or allowing actions
* Filter data based on user role and ownership
* Implement proper sharing mechanisms for collaborative features
* Log access attempts for audit purposes

---

## Testing Guidelines

### Component Testing
* Test user interactions and state changes
* Verify proper error handling and edge cases
* Ensure accessibility requirements are met
* Test responsive behavior across different screen sizes

### Data Testing
* Validate data persistence and retrieval
* Test CRUD operations thoroughly
* Verify data filtering and search functionality
* Ensure proper error handling for data operations

### Integration Testing
* Test navigation flows between components
* Verify proper data flow between parent and child components
* Test user role-based access control
* Ensure proper toast notifications and user feedback

---

## Performance Guidelines

### Loading and UX
* Show loading states for operations taking longer than 200ms
* Implement proper error states with recovery options
* Use optimistic updates where appropriate
* Include proper loading skeletons for content areas

### Data Management
* Implement efficient data filtering and searching
* Use pagination for large data sets
* Cache frequently accessed data appropriately
* Clean up unused data and event listeners

### Component Optimization
* Use React.memo for pure components
* Implement proper dependency arrays in useEffect hooks
* Avoid unnecessary re-renders through proper state management
* Use callback memoization for expensive operations

---

## Deployment and Maintenance

### Code Maintenance
* Keep dependencies up to date
* Regularly review and refactor code for improvements
* Maintain comprehensive documentation
* Follow semantic versioning for releases

### Monitoring and Debugging
* Use the established error reporting system
* Monitor application performance and user interactions
* Implement proper logging for debugging
* Include health checks for critical functionality

---

## Pakistani Real Estate Specific Guidelines

### Market Context
* All pricing in Pakistani Rupees (PKR)
* Use local terminology: "Marla", "Kanal" for area measurements where applicable
* Include relevant location data for Karachi market
* Follow local real estate practices for commission structures

### Legal and Compliance
* Include relevant document types for Pakistani real estate transactions
* Follow local property registration and documentation practices
* Implement proper tax calculation based on Pakistani real estate laws
* Include stamp duty and registration fee calculations

### Cultural Considerations
* Use appropriate professional language for business communications
* Include relevant Islamic calendar dates where applicable
* Respect local business practices and customer relationship norms
* Implement proper family/joint ownership structures

---

*These guidelines should be followed consistently across all development work on aaraazi. When in doubt, refer to existing components for patterns and conventions.*

**Last Updated**: December 2024
**Version**: 2.0.0