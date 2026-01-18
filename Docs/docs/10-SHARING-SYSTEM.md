# aaraazi Sharing & Collaboration System - Complete Documentation

**Document Version**: 1.0  
**Last Updated**: January 15, 2026  
**Module Status**: ✅ 100% Complete  
**Components**: 10 specialized components  
**Core Principle**: "Share the work, protect the relationships"

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Privacy & Security](#privacy--security)
5. [Workflows](#workflows)
6. [Smart Matching Algorithm](#smart-matching-algorithm)
7. [Dual-Agent Deals](#dual-agent-deals)
8. [Best Practices](#best-practices)

---

## Module Overview

### Purpose

The Sharing & Collaboration System enables controlled cross-agent collaboration while maintaining strict privacy protection. It allows agents to:

- Share property listings with other agents
- Find matching properties for their buyers
- Submit offers on shared properties
- Collaborate on dual-agent deals
- Split commissions fairly
- Track collaboration performance

### Core Principle

**"Share the work, protect the relationships"**

The system is built on the principle that agents can collaborate on transactions while maintaining exclusive relationships with their own clients. Contact information is NEVER shared, ensuring each agent retains their client relationships.

### Key Capabilities

- **Cycle Sharing**: Share sell and rent cycles with workspace agents
- **Smart Matching**: Automatic property-to-requirement matching with scoring
- **Cross-Agent Offers**: Submit and manage offers on shared properties
- **Dual-Agent Deals**: Collaborate on deals with automatic commission splitting
- **Privacy Protection**: Enforced contact information protection
- **Analytics**: Track sharing performance and collaboration effectiveness

### Module Statistics

- **Components**: 10 specialized React components
- **Features**: 25+ distinct features
- **Share Types**: 2 (Sell Cycles, Rent Cycles)
- **Match Scoring**: 0-100 point algorithm
- **Privacy Rules**: 5 enforced protections
- **Deal Types**: 2 (dual-agent, single-agent)

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│         Sharing & Collaboration System               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │  Sharing UI      │◄────►│  Matching Engine │   │
│  │  - ShareToggle   │      │  - smartMatching │   │
│  │  - MatchCard     │      │  - scoreCalculator│  │
│  │  - OfferModal    │      └─────────┬────────┘   │
│  └──────────────────┘                │             │
│                                      │             │
│  ┌──────────────────────────────────▼───────────┐ │
│  │         Data Layer                            │ │
│  │  - CycleShare    - PropertyMatch             │ │
│  │  - CrossAgentOffer  - Dual-Agent Deals       │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │         Privacy Enforcement                   │ │
│  │  - Contact Protection  - Access Control      │ │
│  │  - Workspace Isolation - Audit Logging       │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Component Architecture

**Main Components**:
1. **ShareToggle** - Enable/disable sharing
2. **SharedCyclesFilter** - Filter shared items
3. **MatchCard** - Display property matches
4. **MatchedPropertiesTab** - Matches view
5. **CrossAgentOfferCard** - Offer display
6. **SubmitOfferModal** - Submit offer form
7. **MySubmittedOffers** - Offers tracking
8. **OfferStatusBadge** - Status indicator
9. **AccessBanner** - Privacy notices
10. **MatchReviewModal** - Review matches

---

## Core Features

### Cycle Sharing (5 features)

#### 1. Share Sell Cycle

**Description**: Share property listing with other agents

**Configuration Options**:
- Share with all agents or specific agents
- Share level (view-only or collaborate)
- Property details to share (price, photos, features, address)
- Allow offers toggle
- Set expiration date

**Privacy Protection**:
- Seller contact: ALWAYS hidden (enforced)
- Property address: Can be anonymized to area only
- Internal notes: Never shared unless opted-in

**Use Cases**:
- Expand market reach
- Find buyers faster
- Collaborate with buyer agents
- Cross-sell opportunities

#### 2. Share Rent Cycle

**Description**: Share rental listing with other agents

**Configuration Options**:
- Same as sell cycle
- Rent-specific settings (lease terms, deposit)
- Tenant requirements visibility

**Privacy Protection**:
- Landlord contact: ALWAYS hidden
- Same privacy rules as sell cycle

**Use Cases**:
- Find tenants faster
- Collaborate on rentals
- Share rental inventory

#### 3. Sharing Configuration

**Description**: Detailed control over what to share

**Settings**:
```
┌────────────────────────────────────────────┐
│ Share Sell Cycle                           │
├────────────────────────────────────────────┤
│ Share with:                                │
│ ○ All agents in workspace                  │
│ ○ Specific agents [Select...]              │
│                                            │
│ Share level:                               │
│ ○ View only                                │
│ ● Collaborate (allow offers)               │
│                                            │
│ Property details to share:                 │
│ ☑ Price                                    │
│ ☑ Photos                                   │
│ ☑ Features                                 │
│ ☑ Full address                             │
│ ☐ Area only (hide exact address)          │
│                                            │
│ Privacy locked (cannot change):            │
│ ☑ Hide seller contact (enforced)          │
│                                            │
│        [Cancel]  [Share Cycle]             │
└────────────────────────────────────────────┘
```

#### 4. Privacy Controls

**Description**: Enforced privacy protection

**Enforced Rules**:
1. **Seller contact: NEVER shared** - No exceptions
2. **Buyer contact: Hidden until acceptance** - Protected until deal
3. **Listing agent contact: System-mediated** - No direct contact info
4. **Property address: Can anonymize** - Show area only
5. **Internal notes: Never shared** - Private to listing agent

**Audit Trail**:
- All sharing activities logged
- View tracking (who viewed when)
- Offer submissions recorded
- Changes to sharing settings tracked

#### 5. Revoke Sharing

**Description**: Stop sharing instantly

**Actions**:
- Instant removal from shared pool
- Notify all agents who viewed
- Preserve analytics data
- Allow resharing later

**Impact**:
- Property no longer visible to other agents
- Pending offers remain valid
- Match records preserved for history

### Smart Matching (4 features)

#### 6. Automatic Property Matching

**Description**: Real-time matching of shared properties to buyer requirements

**Process**:
```
1. Agent B creates/updates buyer requirement
2. System automatically runs matching algorithm
3. Fetch all shared sell cycles
4. Calculate match score for each property
5. Create PropertyMatch records for high scores
6. Notify agent of new matches
```

**Match Criteria**:
- Price range (40 points)
- Location (15 points)
- Property type (20 points)
- Bedrooms/size (15 points)
- Features (10 points)

**Notifications**:
- High-score matches (>80): Immediate notification
- Good matches (>70): Daily digest
- Medium matches (>60): Weekly summary

#### 7. Match Score Calculation

**Description**: 0-100 point scoring algorithm

**Algorithm**:
```typescript
function calculateMatchScore(
  property: Property, 
  requirement: BuyerRequirement
): MatchScore {
  let score = 0;
  
  // Price (40 points)
  if (property.price >= requirement.minBudget && 
      property.price <= requirement.maxBudget) {
    score += 40;
  }
  
  // Location (15 points)
  if (requirement.preferredLocations.includes(property.area)) {
    score += 15;
  }
  
  // Type (20 points)
  if (requirement.propertyTypes.includes(property.type)) {
    score += 20;
  }
  
  // Bedrooms (15 points)
  if (property.bedrooms >= requirement.minBedrooms) {
    score += 15;
  }
  
  // Features (10 points)
  const matchingFeatures = intersection(
    property.features,
    requirement.mustHaveFeatures
  );
  score += (matchingFeatures.length / 
    requirement.mustHaveFeatures.length) * 10;
  
  return score;
}
```

**Score Ranges**:
- 90-100: Excellent match ⭐⭐⭐
- 80-89: Very good match ⭐⭐
- 70-79: Good match ⭐
- 60-69: Acceptable match
- <60: Poor match (not shown)

#### 8. Match Presentation

**Description**: Display matches with actionable insights

**Match Card Display**:
```
┌────────────────────────────────────────────┐
│ Villa - DHA Phase 8                        │
│ Match Score: 98/100 ⭐⭐⭐                  │
├────────────────────────────────────────────┤
│ Price: PKR 50,000,000 ✓ In budget         │
│ Location: DHA Phase 8 ✓ Preferred area    │
│ Type: Villa ✓ Matches requirement         │
│ Bedrooms: 5 ✓ Sufficient                  │
│ Features: Garden ✓, Parking ✓             │
│                                            │
│ Why it matches:                            │
│ • Perfect price match                      │
│ • Exact location preference                │
│ • All must-have features                   │
│                                            │
│ [View Details]  [Submit Offer]             │
└────────────────────────────────────────────┘
```

#### 9. Match Notifications

**Description**: Alert agents to new opportunities

**Notification Types**:
- **New Match Alert**: "🎯 Excellent match found!"
- **High-Score Emphasis**: Priority notification for >80 score
- **Daily Digest**: Summary of all matches
- **Match Expiration**: 30-day warning before expiry

### Cross-Agent Offers (5 features)

#### 10. Submit Offer

**Description**: Submit offer on shared property

**Offer Form**:
```
┌────────────────────────────────────────────┐
│ Submit Offer to Listing Agent              │
├────────────────────────────────────────────┤
│ Property: Villa - DHA Phase 8              │
│ Asking Price: PKR 50,000,000              │
│                                            │
│ Your Offer:                                │
│ Offer Amount: PKR [48,000,000]            │
│ Token Amount: PKR [5,000,000]             │
│ Down Payment: PKR [14,400,000] (30%)      │
│                                            │
│ Financing: ☑ Cash ☐ Mortgage              │
│                                            │
│ Conditions:                                │
│ [Subject to inspection]                    │
│                                            │
│ Buyer Information:                         │
│ ● Keep buyer anonymous                     │
│ ○ Share buyer name only                   │
│                                            │
│ Valid Until: [2026-02-01]                 │
│                                            │
│        [Cancel]  [Submit Offer]            │
└────────────────────────────────────────────┘
```

**Validation**:
- Offer amount must be positive
- Valid until date in future
- Agent must have active buyer requirement
- Property must still be available

#### 11. Review Offers

**Description**: Listing agent reviews submitted offers

**Offer Display**:
```
┌────────────────────────────────────────────┐
│ Cross-Agent Offer #OFR-2026-001            │
├────────────────────────────────────────────┤
│ From: Agent B                              │
│ Buyer: [Anonymous until accepted]          │
│                                            │
│ Offer Amount: PKR 48,000,000              │
│ Your Asking: PKR 50,000,000               │
│ Difference: -PKR 2,000,000 (4% below)     │
│                                            │
│ Terms:                                     │
│ • Cash purchase                            │
│ • 30% down payment                         │
│ • Subject to inspection                    │
│                                            │
│ Submitted: Jan 15, 2026                   │
│ Valid Until: Feb 1, 2026 (16 days left)   │
│                                            │
│ [Counter-Offer] [Reject] [Accept]         │
└────────────────────────────────────────────┘
```

#### 12. Accept Offer

**Description**: Accept offer and create dual-agent deal

**Acceptance Flow**:
1. Review offer terms
2. Set commission split (default 60/40)
3. Confirm acceptance
4. Buyer information revealed
5. Dual-agent deal auto-created
6. Both agents notified
7. Collaboration workspace activated

**Commission Split Configuration**:
```
┌────────────────────────────────────────────┐
│ Accept Offer & Create Dual-Agent Deal      │
├────────────────────────────────────────────┤
│ Deal Value: PKR 48,000,000                │
│ Total Commission (2%): PKR 960,000        │
│                                            │
│ Commission Split:                          │
│ Your commission: 60% = PKR 576,000        │
│ Agent B commission: 40% = PKR 384,000     │
│                                            │
│ ☑ I agree to this commission split        │
│                                            │
│        [Cancel]  [Accept & Create Deal]    │
└────────────────────────────────────────────┘
```

#### 13. Reject Offer

**Description**: Decline offer with optional reason

**Rejection Options**:
- Provide rejection reason
- Suggest counter-offer
- Keep offer in history
- Notify buyer agent

#### 14. Counter-Offer

**Description**: Propose new terms

**Counter-Offer Flow**:
1. View original offer
2. Modify terms (price, conditions, etc.)
3. Add counter-offer note
4. Send to buyer agent
5. Maintain negotiation thread

### Dual-Agent Deals (6 features)

#### 15. Dual-Agent Deal Creation

**Description**: Automatically create deal from accepted offer

**Deal Structure**:
```
┌────────────────────────────────────────────┐
│ Deal #DEAL-2026-042                        │
│ Type: DUAL-AGENT COLLABORATION            │
├────────────────────────────────────────────┤
│ Seller Side (Agent A):                     │
│ └─ Seller: Mr. Khan                       │
│ └─ Responsibilities:                       │
│    ├─ Seller documents                     │
│    ├─ Property handover                    │
│    └─ Seller payment                       │
│                                            │
│ Buyer Side (Agent B):                      │
│ └─ Buyer: Mr. Ahmed                       │
│ └─ Responsibilities:                       │
│    ├─ Buyer documents                      │
│    ├─ Financing                            │
│    └─ Buyer payment                        │
│                                            │
│ Shared Responsibilities:                   │
│ ├─ Contract signing                        │
│ ├─ Title transfer                          │
│ └─ Final closing                           │
└────────────────────────────────────────────┘
```

#### 16. Commission Splitting

**Description**: Fair commission distribution

**Split Options**:
- Default: 60/40 (listing agent/buyer agent)
- Custom: Negotiate different split
- Separate tracking per agent
- Individual approval workflow

**Commission Records**:
```
Agent A (Listing): PKR 576,000 (60%)
└─ Status: Pending
└─ Linked to: Seller side

Agent B (Buyer): PKR 384,000 (40%)
└─ Status: Pending
└─ Linked to: Buyer side
```

#### 17. Seller Side Management

**Description**: Listing agent manages seller obligations

**Responsibilities**:
- Seller communication
- Seller documentation
- Property handover preparation
- Seller payment collection
- Property condition coordination

#### 18. Buyer Side Management

**Description**: Buyer agent manages buyer obligations

**Responsibilities**:
- Buyer communication
- Buyer documentation
- Financing coordination
- Buyer payment collection
- Inspection arrangement

#### 19. Collaboration Workspace

**Description**: Shared deal management space

**Features**:
```
Dual-Agent Deal Workspace:

Shared Timeline:
└─ Both agents see all deal events
└─ Milestones visible to both

Task Lists:
├─ Seller Side Tasks (Agent A only)
└─ Buyer Side Tasks (Agent B only)

Documents:
├─ Shared document repository
└─ Upload accessible to both

Notes:
├─ Private notes (per agent)
└─ Public notes (both see)

Notifications:
└─ Dual notifications (both notified)
```

#### 20. Separate Commissions

**Description**: Individual commission tracking

**Tracking**:
- Each agent sees only their commission
- Separate approval workflows
- Independent payment schedules
- Individual performance tracking

### Privacy & Security (5 features)

#### 21. Contact Protection

**Description**: Enforced privacy rules

**Rules (Cannot be disabled)**:
1. Seller contact: NEVER shared
2. Buyer contact: Anonymous until acceptance
3. Landlord contact: NEVER shared
4. Tenant contact: Anonymous until acceptance
5. Agent contact: System-mediated only

#### 22. Buyer Anonymity

**Description**: Buyer remains anonymous until offer acceptance

**Process**:
- Buyer name hidden in offer
- Contact info never shared
- After acceptance: Name revealed, contact still protected

#### 23. Address Anonymization

**Description**: Option to hide exact address

**Options**:
- Full address visible
- Area only (e.g., "DHA Phase 8" without exact plot)

#### 24. System-Mediated Contact

**Description**: All communication through platform

**Implementation**:
- No direct contact information shared
- Messages routed through system
- Audit trail maintained

#### 25. Access Control

**Description**: Workspace isolation and permissions

**Rules**:
- Only workspace agents can see shares
- Cross-workspace isolation enforced
- Sharing permissions (view/collaborate)
- Access logs maintained

---

## Workflows

See Document 04 (BUSINESS-FLOWS-WORKFLOWS.md) for detailed collaboration workflows including:
- Cycle sharing workflow
- Smart matching workflow
- Cross-agent offer submission workflow
- Dual-agent deal management workflow

---

## Smart Matching Algorithm

### Algorithm Details

**Input**: Property, Buyer Requirement  
**Output**: Match score (0-100), match reasons, mismatches

**Scoring Breakdown**:
```
Total: 100 points

Price Match (40 points):
├─ Exact range: 40 points
├─ Within 10%: 30 points
├─ Within 20%: 20 points
└─ Outside range: 0 points

Location Match (15 points):
├─ Exact preference: 15 points
├─ Adjacent area: 10 points
├─ Same city: 5 points
└─ Different city: 0 points

Property Type Match (20 points):
├─ Exact match: 20 points
├─ Similar type: 10 points
└─ Different type: 0 points

Bedrooms Match (15 points):
├─ Exact match: 15 points
├─ More than required: 15 points
├─ 1 less: 10 points
└─ 2+ less: 0 points

Features Match (10 points):
├─ All features: 10 points
├─ 75% features: 7.5 points
├─ 50% features: 5 points
└─ <50% features: proportional
```

### Performance Optimization

**Caching**:
- Cache shared cycles list (5 min TTL)
- Cache match results (24 hour TTL)
- Invalidate on updates

**Lazy Loading**:
- Load match details only when viewed
- Paginate match results
- Defer expensive calculations

---

## Dual-Agent Deals

### Deal Lifecycle

```
1. Offer Accepted
   ├─ Create Deal
   ├─ Assign agents
   ├─ Set commission split
   └─ Activate workspace

2. Documentation
   ├─ Seller docs (Agent A)
   ├─ Buyer docs (Agent B)
   └─ Shared docs

3. Payment
   ├─ Token collection
   ├─ Down payment
   └─ Final payment

4. Closing
   ├─ Title transfer
   ├─ Property handover
   └─ Commission payment

5. Completed
   ├─ Both commissions marked earned
   ├─ Analytics updated
   └─ Success metrics tracked
```

---

## Best Practices

### For Listing Agents (Sharing Properties)

1. **Share Actively** - Maximize exposure
2. **Configure Thoughtfully** - Balance privacy and visibility
3. **Respond Quickly** - Review offers promptly
4. **Be Fair** - Consider all offers objectively
5. **Communicate Clearly** - Set expectations upfront

### For Buyer Agents (Finding Properties)

6. **Create Detailed Requirements** - Better matching
7. **Act on Matches** - Don't delay on good matches
8. **Make Strong Offers** - Competitive but fair
9. **Be Professional** - Build collaboration reputation
10. **Follow Through** - Complete deals you start

### For Both Agents

11. **Respect Privacy** - Never try to circumvent protections
12. **Collaborate Fairly** - Honor commission agreements
13. **Communicate Regularly** - Keep partner informed
14. **Track Performance** - Monitor collaboration success
15. **Build Network** - Foster good agent relationships

---

**Document Status**: ✅ Complete  
**Final Document in Series**: Documentation complete for all new modules
