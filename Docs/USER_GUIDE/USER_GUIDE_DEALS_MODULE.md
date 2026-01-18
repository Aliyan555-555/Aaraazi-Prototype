# Deals Module - Complete User Guide

**aaraazi Real Estate Management Platform**  
**Module**: Deals Management  
**Version**: 4.1  
**Last Updated**: January 15, 2026

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Understanding Deals](#understanding-deals)
3. [Who Uses This Module](#who-uses-this-module)
4. [Deal Types](#deal-types)
5. [How to Create Deals](#how-to-create-deals)
6. [Managing Deals](#managing-deals)
7. [Dual-Agent Workflows](#dual-agent-workflows)
8. [Offer Management](#offer-management)
9. [Common Workflows](#common-workflows)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)
12. [FAQs](#faqs)

---

## Overview

### What is the Deals Module?

The Deals Module is where you manage **active negotiations** between buyers and sellers. It tracks offers, counter-offers, negotiations, and converts qualified leads into transactions.

**Think of it like this**: If Leads are "potential customers" and Transactions are "completed sales", Deals are the "active negotiations" in between.

### What Can You Do?

✅ **Create Deals** - Start negotiations from leads or direct inquiries  
✅ **Manage Offers** - Track offers, counter-offers, rejections  
✅ **Dual-Agent Support** - Represent both buyer AND seller  
✅ **Negotiation History** - Complete audit trail of all discussions  
✅ **Commission Splits** - Calculate splits for co-agents  
✅ **Convert to Transaction** - Turn accepted deals into cycles  
✅ **Track Pipeline** - Monitor deal stages and health  
✅ **Set Timelines** - Deadlines for offers and responses  

### Key Features

| Feature | Description |
|---------|-------------|
| **6-Stage Pipeline** | New → Active → Negotiation → Accepted → Lost → Converted |
| **Offer Management** | Track multiple offers per deal |
| **Dual-Agent Support** | Represent both parties, calculate splits |
| **Counter-Offer Tracking** | Complete negotiation history |
| **Commission Calculator** | Auto-calculate earnings & splits |
| **Timeline Management** | Set deadlines, send reminders |
| **Document Storage** | Offers, agreements, communications |
| **Activity Logging** | Every interaction recorded |

---

## Understanding Deals

### The Deal Lifecycle

```
LEAD → DEAL → TRANSACTION

Lead:        "I'm interested"
Deal:        "Let's negotiate"
Transaction: "Agreement signed, let's close"
```

### Deals vs Leads vs Transactions

| Aspect | Lead | Deal | Transaction |
|--------|------|------|-------------|
| **Stage** | Prospecting | Negotiating | Executing |
| **Commitment** | Low | Medium | High |
| **Timeline** | Days-weeks | Days | Weeks-months |
| **Certainty** | 10-30% | 40-70% | 90%+ |
| **Action** | Qualify | Negotiate | Complete |

**Example Flow**:
```
Sara (Lead):
  "I'm looking for apartments" → LEAD MODULE

Sara (Deal):
  "I want to buy Property A for PKR 70M" → DEALS MODULE

Sara (Transaction):
  "Agreement signed, let's complete paperwork" → TRANSACTIONS MODULE
```

### The 6 Deal Stages

```
Stage 1: NEW
   ↓ (Initial inquiry on specific property)
Stage 2: ACTIVE
   ↓ (Buyer seriously interested, discussing)
Stage 3: NEGOTIATION
   ↓ (Offers being made/countered)
Stage 4: ACCEPTED
   ↓ (Offer accepted, moving to transaction)
Stage 5: LOST
   ✗ (Deal fell through)
Stage 6: CONVERTED
   ✓ (Became a transaction)
```

---

## Who Uses This Module

### For Real Estate Agents

**Primary Users** - Agents use this daily to:
- Create deals from qualified leads
- Track active negotiations
- Manage multiple offers
- Convert deals to transactions
- Monitor their sales pipeline

### For Sales Managers

**Management Users** - Managers use this to:
- Review team deals
- Monitor conversion rates
- Identify bottlenecks
- Coach agents on negotiations
- Forecast revenue

### For Agency Admins

**Admin Users** - Admins use this to:
- View all agency deals
- Analyze performance
- Audit deal history
- Review commission splits
- Generate reports

---

## Deal Types

### Type 1: Sale Deal (Buy/Sell)

**Most common** - Negotiating property sale.

**Parties**:
- Buyer (wants to purchase)
- Seller (property owner)
- Buyer's Agent (you or colleague)
- Seller's Agent (you or colleague)

**Outcome**:
- If accepted → Sell Cycle + Purchase Cycle
- Commission: Typically 2% from each side

---

### Type 2: Rental Deal (Lease)

**Negotiating rental** - Tenant and landlord.

**Parties**:
- Tenant (wants to rent)
- Landlord (property owner)
- Agent(s)

**Outcome**:
- If accepted → Rent Cycle
- Commission: Typically 1 month rent

---

### Type 3: Investment Deal (Syndication)

**Multiple investors** buying together.

**Parties**:
- Multiple investors
- Seller
- Coordinating agent

**Outcome**:
- If accepted → Purchase Cycle (Syndication)
- Commission: From total investment

---

## How to Create Deals

### Method 1: From Lead

**Best for**: Converting qualified leads.

**Steps**:
1. Open **Lead** in Leads Module
2. Lead must be in **"Qualified"** or **"Negotiation"** stage
3. Click **"Create Deal"** button
4. Deal form pre-fills with lead data:

```
┌──────────────────────────────────┐
│ CREATE DEAL FROM LEAD            │
│                                  │
│ Lead: Sara Ali (LEAD-001)        │
│ (Auto-filled)                    │
│                                  │
│ Deal Type:                       │
│ ● Sale Deal                      │
│ ○ Rental Deal                    │
│ ○ Investment Deal                │
│                                  │
│ Property:                        │
│ [Modern Villa DHA ▼]             │
│                                  │
│ Buyer: Sara Ali (from lead)      │
│ Budget: PKR 40-50M               │
│                                  │
│ Seller: Ahmed Khan (owner)       │
│                                  │
│ Asking Price: PKR 75,000,000     │
│                                  │
│ Your Role:                       │
│ ● Buyer's Agent                  │
│ ○ Seller's Agent                 │
│ ○ Both (Dual Agent)              │
│                                  │
│ [Create Deal]                    │
└──────────────────────────────────┘
```

5. Click **"Create Deal"**
6. Deal created, lead auto-converts to deal stage

**Time**: 2 minutes

---

### Method 2: Direct Deal Creation

**Best for**: Direct inquiries without lead stage.

**Steps**:
1. Go to **Deals** module
2. Click **"+ Create Deal"**
3. Fill complete form:

#### Step 1: Deal Type
```
┌──────────────────────────────────┐
│ SELECT DEAL TYPE                 │
│                                  │
│ ● Sale Deal                      │
│   Buying/Selling property        │
│                                  │
│ ○ Rental Deal                    │
│   Leasing property               │
│                                  │
│ ○ Investment Deal                │
│   Syndicated investment          │
│                                  │
│ [Continue]                       │
└──────────────────────────────────┘
```

#### Step 2: Property Selection
```
┌──────────────────────────────────┐
│ SELECT PROPERTY                  │
│                                  │
│ [Search properties...]           │
│                                  │
│ Recent Properties:               │
│ ● Modern Villa DHA Phase 8       │
│   PKR 75M • 500 sq yd • Villa    │
│                                  │
│ ○ Clifton Apartment              │
│   PKR 45M • 1800 sq ft • Apt     │
│                                  │
│ [Select]                         │
└──────────────────────────────────┘
```

#### Step 3: Parties (Sale Deal)
```
┌──────────────────────────────────┐
│ DEAL PARTIES                     │
│                                  │
│ BUYER:                           │
│ [Search contact...] → Sara Ali   │
│ Budget: PKR 40-50M               │
│                                  │
│ SELLER:                          │
│ Ahmed Khan (Property Owner)      │
│ Asking: PKR 75,000,000           │
│                                  │
│ AGENTS:                          │
│ Buyer's Agent: [You ▼]           │
│ Seller's Agent: [Ahmed Khan ▼]   │
│   (Another agent)                │
│                                  │
│ OR                               │
│ ☐ I represent both parties       │
│   (Dual Agent)                   │
└──────────────────────────────────┘
```

#### Step 4: Deal Details
```
┌──────────────────────────────────┐
│ DEAL INFORMATION                 │
│                                  │
│ Deal Title:                      │
│ [Sara - Modern Villa DHA]        │
│                                  │
│ Property Price: PKR 75,000,000   │
│ Buyer Budget:   PKR 40-50M       │
│                                  │
│ Gap Analysis:                    │
│ Asking: PKR 75M                  │
│ Budget: PKR 50M (max)            │
│ Gap:    PKR 25M (33% difference) │
│ Strategy needed! 🎯              │
│                                  │
│ Commission Structure:            │
│ Rate: [2] % per side             │
│ Buyer side:  PKR 1,500,000       │
│ Seller side: PKR 1,500,000       │
│ Total:       PKR 3,000,000       │
│                                  │
│ Timeline:                        │
│ Target Close: [30] days          │
│                                  │
│ [Create Deal]                    │
└──────────────────────────────────┘
```

5. Click **"Create Deal"**
6. Deal is now live!

**Time**: 5-7 minutes

---

### Method 3: From Property Page

**Best for**: Buyer inquiring about specific property.

**Steps**:
1. Open **Property Detail** page
2. Click **"Create Deal"** button
3. Property is pre-selected
4. Fill in buyer details
5. Complete deal form
6. Create deal

---

## Managing Deals

### Deal Detail Page

**When you open a deal**:

```
┌────────────────────────────────────────┐
│ DEAL: Sara - Modern Villa DHA          │
│ Stage: NEGOTIATION • Days: 5           │
│                                        │
│ Property: Modern Villa DHA Phase 8     │
│ PKR 75M → Current Offer: PKR 70M       │
│                                        │
│ Buyer: Sara Ali (Your client)          │
│ Seller: Ahmed Khan                     │
│                                        │
│ Gap: PKR 5M (7%) • Likely to close ✅  │
│                                        │
│ [Make Offer] [View History] [Convert]  │
└────────────────────────────────────────┘

Connected Entities:
[Buyer: Sara Ali] [Seller: Ahmed] [Property: Villa]

TABS:
[Overview] [Offers] [Activity] [Documents]
```

### Overview Tab

```
┌──────────────────────────────────┐
│ DEAL OVERVIEW                    │
│                                  │
│ PARTIES                          │
│ Buyer: Sara Ali                  │
│   Budget: PKR 40-50M             │
│   Financing: Pre-approved        │
│   Agent: You                     │
│                                  │
│ Seller: Ahmed Khan               │
│   Asking: PKR 75,000,000         │
│   Motivation: High (relocating)  │
│   Agent: Hassan Ali              │
│                                  │
│ PROPERTY                         │
│ Modern Villa DHA Phase 8         │
│ Type: Villa • Area: 500 sq yd    │
│ Status: Available                │
│                                  │
│ NEGOTIATION STATUS               │
│ Latest Offer: PKR 70M (Buyer)    │
│ Counter: PKR 73M (Seller)        │
│ Gap: PKR 3M (4.1%)               │
│ Trend: Converging ✅             │
│                                  │
│ COMMISSION                       │
│ If closed at PKR 73M:            │
│ Your commission: PKR 1,460,000   │
│ Co-agent: PKR 1,460,000          │
│ Total: PKR 2,920,000             │
│                                  │
│ TIMELINE                         │
│ Created: 5 days ago              │
│ Target close: 25 days remaining  │
│ Offer expires: 2 days            │
│                                  │
│ [Edit Deal]                      │
└──────────────────────────────────┘
```

### Offers Tab

**Complete offer history**:

```
┌──────────────────────────────────┐
│ OFFER HISTORY (4)                │
│                                  │
│ ACTIVE OFFER                     │
│ Offer #4 • Counter-offer         │
│ From: Seller (Ahmed Khan)        │
│ Amount: PKR 73,000,000           │
│ Date: Today, 10:00 AM            │
│ Expires: In 2 days               │
│ Status: ⏰ Awaiting buyer response│
│                                  │
│ Terms:                           │
│ • Down payment: 30%              │
│ • Closing: 30 days               │
│ • As-is condition                │
│                                  │
│ [Accept] [Counter] [Reject]      │
│                                  │
│ ─────────────────────────────────│
│                                  │
│ PREVIOUS OFFERS                  │
│                                  │
│ Offer #3 • Counter-offer         │
│ From: Buyer (Sara Ali)           │
│ Amount: PKR 70,000,000           │
│ Date: Yesterday                  │
│ Status: ✗ Rejected               │
│                                  │
│ Offer #2 • Counter-offer         │
│ From: Seller                     │
│ Amount: PKR 74,000,000           │
│ Date: 3 days ago                 │
│ Status: ✗ Rejected               │
│                                  │
│ Offer #1 • Initial offer         │
│ From: Buyer                      │
│ Amount: PKR 68,000,000           │
│ Date: 5 days ago                 │
│ Status: ✗ Rejected               │
│                                  │
│ [+ Make New Offer]               │
└──────────────────────────────────┘
```

### Making an Offer

**To submit an offer**:

```
┌──────────────────────────────────┐
│ MAKE OFFER                       │
│                                  │
│ Offer From:                      │
│ ● Buyer (Sara Ali)               │
│ ○ Seller (Ahmed Khan)            │
│                                  │
│ Offer Amount:                    │
│ PKR [71,500,000]                 │
│                                  │
│ Previous: PKR 73M (Seller)       │
│ Difference: -PKR 1.5M (-2.1%)    │
│                                  │
│ TERMS                            │
│ Down Payment:                    │
│ [30] % = PKR 21,450,000          │
│                                  │
│ Financing:                       │
│ ● Pre-approved                   │
│ ○ Subject to approval            │
│                                  │
│ Closing Timeline:                │
│ [30] days from acceptance        │
│                                  │
│ Contingencies:                   │
│ ☑ Home inspection                │
│ ☐ Financing contingency          │
│ ☐ Sale of buyer's property       │
│                                  │
│ Property Condition:              │
│ ● As-is                          │
│ ○ Subject to repairs             │
│                                  │
│ Offer Expiry:                    │
│ [48] hours                       │
│                                  │
│ Notes/Justification:             │
│ ┌──────────────────────────┐    │
│ │ Buyer is flexible on     │    │
│ │ closing date. Can close  │    │
│ │ earlier if needed. This  │    │
│ │ is final offer.          │    │
│ └──────────────────────────┘    │
│                                  │
│ [Submit Offer] [Save Draft]      │
└──────────────────────────────────┘
```

### Moving Through Stages

#### Stage 1: NEW
**Initial deal creation**.

**Typical duration**: 1-2 days

**Actions**:
- Review property details
- Understand buyer/seller motivation
- Analyze price gap
- Plan negotiation strategy
- Schedule initial discussions

**Move to ACTIVE when**: Both parties engaged in discussions

---

#### Stage 2: ACTIVE
**Active discussions, no formal offer yet**.

**Typical duration**: 3-7 days

**Actions**:
- Facilitate buyer-seller communication
- Discuss terms informally
- Prepare for formal offer
- Address initial concerns
- Build rapport

**Move to NEGOTIATION when**: First formal offer submitted

---

#### Stage 3: NEGOTIATION
**Offers and counter-offers flying**.

**Typical duration**: 5-14 days

**Actions**:
- Present offers professionally
- Negotiate price and terms
- Find middle ground
- Address contingencies
- Work toward acceptance

**Move to ACCEPTED when**: Offer accepted by both parties

**Move to LOST when**: Parties can't agree, deal dies

---

#### Stage 4: ACCEPTED
**Offer accepted, preparing to convert**.

**Typical duration**: 1-3 days

**Actions**:
- Celebrate the win! 🎉
- Prepare transaction documents
- Schedule signing
- Convert to transaction
- Start formal cycle

**Move to CONVERTED when**: Transaction cycle started

---

#### Stage 5: LOST
**Deal fell through**.

**Actions**:
- Document loss reason
- Learn from failure
- Maintain relationships
- Follow up later (maybe!)

**Common reasons**:
- Price gap too wide
- Financing fell through
- Inspection issues
- Cold feet
- Better offer elsewhere
- Timeline mismatch

---

#### Stage 6: CONVERTED
**Successfully became transaction**.

**Result**:
- Deal marked as won
- Transaction cycle created
- Commission opportunity secured
- Pipeline moves forward

---

## Dual-Agent Workflows

### What is Dual Agency?

**Dual Agency** = You represent BOTH buyer AND seller in the same deal.

**Example**:
```
Buyer (Your client):    Sara Ali
Seller (Your client):   Ahmed Khan
Property:               Modern Villa DHA
You:                    Agent for BOTH parties
```

### Benefits of Dual Agency

**💰 Double Commission**:
```
Normal Deal (One side):
Your commission: PKR 1,500,000 (2% of PKR 75M)

Dual Agency (Both sides):
Your commission: PKR 3,000,000 (4% of PKR 75M)

= Double the earnings! 💰
```

**⚡ Faster Negotiations**:
- No waiting for other agent
- Direct communication
- Faster decisions
- Smoother process

**🤝 Better Control**:
- You control timeline
- Understand both perspectives
- Can find win-win solutions
- Manage expectations better

### Legal & Ethical Considerations

⚠️ **IMPORTANT**:

**You MUST**:
- ✅ Disclose dual agency to BOTH parties
- ✅ Get written consent from BOTH
- ✅ Remain neutral (don't favor either side)
- ✅ Be transparent about all offers
- ✅ Document everything thoroughly

**You CANNOT**:
- ❌ Favor one party over the other
- ❌ Share confidential information
- ❌ Withhold offers or information
- ❌ Advise on price (remain neutral)
- ❌ Create artificial urgency

### Setting Up Dual-Agent Deal

**Steps**:

1. **Create Deal**:
```
┌──────────────────────────────────┐
│ CREATE DUAL-AGENT DEAL           │
│                                  │
│ Property: Modern Villa DHA       │
│                                  │
│ Buyer: Sara Ali                  │
│ (Your client)                    │
│                                  │
│ Seller: Ahmed Khan               │
│ (Your client)                    │
│                                  │
│ ☑ I represent both parties       │
│   (Dual Agency)                  │
│                                  │
│ ⚠️ DUAL AGENCY DISCLOSURE         │
│                                  │
│ Both parties must consent to dual│
│ representation. You will:        │
│ • Remain neutral                 │
│ • Not favor either party         │
│ • Disclose all offers            │
│ • Facilitate fair negotiation    │
│                                  │
│ ☑ Buyer consent obtained         │
│ ☑ Seller consent obtained        │
│                                  │
│ [Upload Signed Consents]         │
│                                  │
│ [Create Deal]                    │
└──────────────────────────────────┘
```

2. **Commission Split**:
```
┌──────────────────────────────────┐
│ DUAL-AGENT COMMISSION            │
│                                  │
│ Property Price: PKR 75,000,000   │
│                                  │
│ Buyer Side:                      │
│ Rate: 2%                         │
│ Amount: PKR 1,500,000            │
│ Agent: You (100%)                │
│                                  │
│ Seller Side:                     │
│ Rate: 2%                         │
│ Amount: PKR 1,500,000            │
│ Agent: You (100%)                │
│                                  │
│ TOTAL YOUR COMMISSION:           │
│ PKR 3,000,000 (4%)               │
│                                  │
│ Agency Split (if applicable):    │
│ Agency: 20% (PKR 600,000)        │
│ You: 80% (PKR 2,400,000)         │
└──────────────────────────────────┘
```

### Managing Dual-Agent Negotiations

**Best Practices**:

**Communication**:
```
❌ BAD: "The seller will accept PKR 70M"
         (Sharing confidential info)

✅ GOOD: "Let me present your offer to the seller"
         (Remaining neutral)
```

**Negotiation**:
```
❌ BAD: "You should offer more, the seller won't budge"
         (Favoring seller)

✅ GOOD: "The seller has declined. Would you like to revise?"
         (Neutral facilitation)
```

**Documentation**:
```
✅ All offers in writing
✅ All communications documented
✅ Consents signed and filed
✅ Timeline of all interactions
✅ Clear audit trail
```

---

## Offer Management

### Offer Types

**Initial Offer**:
- First offer from buyer
- Sets negotiation baseline
- Usually below asking price

**Counter-Offer**:
- Response to previous offer
- From either party
- Can change price AND terms

**Final Offer**:
- "Best and final"
- Take it or leave it
- Creates urgency

**Multiple Offers** (Bidding War):
- Several buyers want same property
- Seller chooses best offer
- Can lead to above-asking price

### Offer Components

**Every offer includes**:

1. **Price**: PKR amount offered
2. **Down Payment**: % and amount
3. **Financing**: Pre-approved or contingent
4. **Closing Timeline**: Days to complete
5. **Contingencies**: Conditions that must be met
6. **Property Condition**: As-is or with repairs
7. **Expiry**: When offer expires

### Responding to Offers

**Three options**:

**1. Accept** ✅
```
Offer accepted as-is
→ Move to ACCEPTED stage
→ Prepare to convert to transaction
```

**2. Counter** 🔄
```
Propose different terms
→ Stays in NEGOTIATION
→ Ball back in other party's court
```

**3. Reject** ❌
```
Decline offer completely
→ Wait for new offer
→ Or deal may go to LOST
```

### Negotiation Strategies

**For Buyers**:
```
Strategy: Start Low, Move Up Slowly

Asking Price: PKR 75M
Offer 1:      PKR 65M (-13%)
Offer 2:      PKR 68M (+PKR 3M)
Offer 3:      PKR 70M (+PKR 2M)
Offer 4:      PKR 71.5M (+PKR 1.5M)

Goal: Meet around PKR 72-73M
```

**For Sellers**:
```
Strategy: Hold Firm, Concede Gradually

Asking Price: PKR 75M
Counter 1:    PKR 74M (-1M)
Counter 2:    PKR 73M (-1M)
Counter 3:    PKR 72.5M (-500K)

Goal: Don't go below PKR 72M minimum
```

---

## Common Workflows

### Workflow 1: Standard Sale Deal

**Scenario**: Sara wants to buy Ahmed's villa.

**Timeline**: 14-21 days

**Day 1: Create Deal**
```
Lead: Sara Ali (Qualified)
Action: Create deal from lead
Property: Modern Villa DHA (PKR 75M)
Your role: Buyer's agent
Co-agent: Hassan Ali (Seller's agent)
Status: NEW
```

**Day 2-3: Initial Discussions (ACTIVE)**
```
Action: Discuss with Sara
Budget confirmed: PKR 70M max
Financing: Pre-approved
Strategy: Start at PKR 65M
Move to: ACTIVE stage
```

**Day 4: First Offer (NEGOTIATION)**
```
Action: Submit offer
Amount: PKR 65M
Terms: 30% down, 30-day close
Move to: NEGOTIATION stage
```

**Day 5: Counter-Offer**
```
Seller response: PKR 74M
Gap: PKR 9M
Action: Discuss with Sara
```

**Day 7: Second Offer**
```
Action: Counter
Amount: PKR 68M
Rationale: Market analysis shows fair price
```

**Day 8: Second Counter**
```
Seller response: PKR 73M
Gap: PKR 5M (getting close!)
```

**Day 10: Third Offer**
```
Action: Counter
Amount: PKR 70M (Sara's max)
Terms: Final offer, flexible on closing date
```

**Day 11: Third Counter**
```
Seller response: PKR 72.5M
Gap: PKR 2.5M
Sara: Willing to stretch!
```

**Day 12: Final Offer**
```
Action: Counter
Amount: PKR 71.5M (Best and final)
Sara: Absolute maximum
```

**Day 13: ACCEPTED!** ✅
```
Seller: Accepts PKR 71.5M!
Action: Move to ACCEPTED stage
Commission: PKR 1,430,000
```

**Day 14: Convert to Transaction**
```
Action: Start Purchase Cycle
Link: Deal → Transaction
Move to: CONVERTED stage
Result: Success! 🎉
```

**Total time**: 14 days from deal to transaction

---

### Workflow 2: Dual-Agent Deal (Fast Track)

**Scenario**: You represent both buyer and seller.

**Timeline**: 7-10 days (faster!)

**Day 1: Setup**
```
Buyer: Sara Ali (Your client)
Seller: Ahmed Khan (Your client)
Action: Create dual-agent deal
Disclosure: Both parties consent
Status: NEW
```

**Day 2: Strategy Session**
```
Meet with each separately:
Sara: Budget PKR 68-70M
Ahmed: Will accept PKR 72M minimum

Gap: PKR 2-4M
Your role: Find middle ground
```

**Day 3: Facilitate Discussion**
```
Action: Arrange meeting (optional)
Or facilitate via separate conversations
Present reality to each:
- Sara: Won't get it for PKR 68M
- Ahmed: PKR 75M is high for market
```

**Day 4: First Offer**
```
Sara: Offers PKR 68M
You: Present neutrally to Ahmed
Ahmed: Counters PKR 73M
Status: NEGOTIATION
```

**Day 5: Second Round**
```
Sara: PKR 70M
Ahmed: PKR 72.5M
Gap: PKR 2.5M

Your insight: Both ready to compromise
```

**Day 6: Find Middle Ground**
```
You (neutrally): "There's PKR 2.5M gap"
Sara: Can do PKR 71M
Ahmed: Will accept PKR 71.5M

Getting very close!
```

**Day 7: Close the Gap**
```
Sara: PKR 71.5M (Final)
Ahmed: Accepts! ✅

Status: ACCEPTED
Your commission: PKR 2,860,000 (4%)
```

**Day 8-10: Convert**
```
Start both cycles:
- Purchase Cycle (Sara buying)
- Sell Cycle (Ahmed selling)
Both linked to same property
Status: CONVERTED
```

**Total time**: 7 days (half the time of standard deal!)

---

## Tips & Best Practices

### Deal Creation

✅ **DO**:
- Create deal when lead is qualified
- Have property identified
- Know budget and asking price
- Understand both parties' motivations
- Set realistic timelines
- Document everything

❌ **DON'T**:
- Create deal too early (waste of time)
- Start without clear property
- Ignore price gaps > 20%
- Forget to check financing
- Rush the process

### Negotiation Tactics

**Building Rapport**:
```
Good negotiator:
- Listens more than talks
- Finds common ground
- Stays calm under pressure
- Focuses on win-win
- Keeps emotions out
```

**Handling Objections**:
```
Price too high?
→ Show market comparables
→ Highlight unique features
→ Discuss negotiation room

Price too low?
→ Explain buyer's constraints
→ Show market softness
→ Suggest alternative terms
```

**Creating Urgency (Ethically)**:
```
✅ ETHICAL:
"There are 3 other buyers viewing this weekend"
(If true)

❌ UNETHICAL:
"Another offer is coming"
(If false)

✅ ETHICAL:
"Seller wants to move quickly"
(Genuine timeline)

❌ UNETHICAL:
"This price won't last"
(If no reason)
```

### Commission Management

**Track Commission Carefully**:
```
┌──────────────────────────────────┐
│ COMMISSION CALCULATOR            │
│                                  │
│ Final Price: PKR 71,500,000      │
│                                  │
│ BUYER SIDE:                      │
│ Rate: 2%                         │
│ Gross: PKR 1,430,000             │
│ Your split: 80%                  │
│ Your amount: PKR 1,144,000       │
│                                  │
│ SELLER SIDE (Co-agent):          │
│ Rate: 2%                         │
│ Gross: PKR 1,430,000             │
│ Their commission: PKR 1,430,000  │
│                                  │
│ TOTAL DEAL COMMISSION:           │
│ PKR 2,860,000                    │
│                                  │
│ YOUR EARNINGS:                   │
│ PKR 1,144,000                    │
└──────────────────────────────────┘
```

---

## Troubleshooting

### Common Issues

#### Issue: Deal Stuck in Negotiation

**Problem**: Multiple offers/counters, no progress.

**Solutions**:
1. **Identify the blocker**:
   - Price?
   - Terms?
   - Timeline?
   - Contingencies?

2. **Facilitate compromise**:
   - "What if we meet at [middle price]?"
   - "Can you be flexible on [term]?"
   - "What's your bottom line?"

3. **Set deadline**:
   - "Let's resolve by Friday"
   - Creates urgency
   - Forces decision

#### Issue: Buyer Backing Out

**Problem**: Buyer getting cold feet.

**Solutions**:
1. **Understand the real reason**:
   - Financing issues?
   - Found better property?
   - Life circumstances changed?
   - Just nervous?

2. **Address concerns**:
   - If financing: Work with lender
   - If comparison: Show unique value
   - If nervous: Reassure with facts

3. **Know when to let go**:
   - Don't waste time on lost cause
   - Mark deal as LOST
   - Move on to next opportunity

#### Issue: Commission Dispute

**Problem**: Disagreement on commission split.

**Solutions**:
1. **Check agreement**: Review signed documents
2. **Clear communication**: Discuss openly with co-agent
3. **Involve broker**: Escalate if needed
4. **Document everything**: Protect yourself

---

## FAQs

### General Questions

**Q: When should I create a deal vs keeping it as a lead?**  
A: Create a deal when:
- Lead is qualified (budget, timeline confirmed)
- Specific property identified
- Buyer ready to make offer
- Both parties engaged

Keep as lead when still prospecting/qualifying.

**Q: Can one lead create multiple deals?**  
A: Yes! A buyer may be interested in multiple properties. Create separate deals for each.

**Q: What happens to the lead when I create a deal?**  
A: Lead stays in system, marked as "Converted to Deal". You can still access lead history.

### Dual Agency

**Q: Is dual agency legal?**  
A: In Pakistan, yes, but you MUST disclose to both parties and get consent.

**Q: Can I be a dual agent without disclosure?**  
A: NO! This is unethical and potentially illegal. Always disclose.

**Q: How do I split commission in dual agency?**  
A: You earn both buyer and seller commissions (typically 4% total instead of 2%).

### Negotiations

**Q: How long should negotiation take?**  
A: Typically 7-14 days. Longer = less likely to close.

**Q: What if parties are too far apart?**  
A: If gap > 15-20%, consider marking deal as LOST. Focus on better opportunities.

**Q: Can I share buyer's max budget with seller?**  
A: NO! This is confidential information. Never share.

---

## Quick Reference

### Deal Stages Timeline

| Stage | Duration | Conversion Rate |
|-------|----------|----------------|
| **NEW** | 1-2 days | 80% to next |
| **ACTIVE** | 3-7 days | 60% to next |
| **NEGOTIATION** | 7-14 days | 40% to next |
| **ACCEPTED** | 1-3 days | 95% to next |
| **LOST** | - | - |
| **CONVERTED** | - | Success! |

### Negotiation Quick Tips

| Situation | Tactic |
|-----------|--------|
| **Lowball offer** | Counteroffer, don't reject |
| **Stalled negotiation** | Set deadline |
| **Multiple offers** | Bidding war strategy |
| **Cold feet** | Reassure with facts |
| **Gap too wide** | Find creative solutions |

### Commission Rates (Typical)

| Deal Type | Rate | Who Pays |
|-----------|------|----------|
| **Sale (Buyer side)** | 2% | Buyer or split |
| **Sale (Seller side)** | 2% | Seller |
| **Rental** | 1 month | Landlord |
| **Investment** | 2% | Varies |

---

## Next Steps

### After Creating Your First Deal

1. **Set clear timeline** - Target close date
2. **Understand motivations** - Why buy/sell?
3. **Develop strategy** - Negotiation plan
4. **Track all offers** - Document everything
5. **Communicate clearly** - With all parties
6. **Stay neutral** - If dual agent
7. **Convert to transaction** - When accepted!

### Learn More

- **Leads Module**: How leads become deals
- **Transactions Module**: How deals become transactions
- **Properties Module**: Understanding property details
- **Financials Module**: Commission tracking

---

**Need Help?**

- **In-app**: Click "?" for deal help
- **Support**: Contact your manager
- **Training**: Request negotiation training

---

**End of Deals Module User Guide**

**Version**: 4.1  
**Last Updated**: January 15, 2026  
**Module**: Deals Management  
**aaraazi Real Estate Platform**

🤝 **Happy Negotiating!**
