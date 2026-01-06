/**
 * End-to-End Testing Suite - V3.0
 * Comprehensive tests for all V3.0 workflows
 */

import { User, Property, Contact } from '../types';
import { createProperty, updateProperty, getPropertyById } from './data';
import { createSellCycle, addOffer, acceptOffer, closeSellCycle } from './sellCycle';
import { createPurchaseCycle, completePurchase } from './purchaseCycle';
import { createRentCycle, addTenantApplication, approveTenantApplication, signLease } from './rentCycle';
import { detectInternalMatches } from './cycleManager';
import { createBuyerRequirement, autoMatchRequirements } from './buyerRequirements';
import { transferOwnership } from './ownership';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  details?: any;
}

export class E2ETestSuite {
  private results: TestResult[] = [];
  private testUser: User;

  constructor() {
    this.testUser = {
      id: 'test_user_1',
      name: 'Test Agent',
      email: 'test@aaraazi.com',
      role: 'agent',
      phone: '+92-300-1234567',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Run all tests
   */
  async runAll(): Promise<{ passed: number; failed: number; results: TestResult[] }> {
    console.log('🧪 Starting E2E Test Suite...');
    console.log('=====================================\n');

    this.results = [];

    // Core property tests
    await this.testPropertyCreation();
    await this.testPropertyUpdate();

    // Sell cycle tests
    await this.testSellCycleWorkflow();
    await this.testOfferManagement();

    // Purchase cycle tests
    await this.testAgencyPurchase();
    await this.testInvestorPurchase();
    await this.testClientPurchase();

    // Rent cycle tests
    await this.testRentCycleWorkflow();
    await this.testTenantApplication();

    // Match detection tests
    await this.testInternalMatchDetection();
    await this.testDualRepresentationDetection();

    // Buyer requirements tests
    await this.testBuyerRequirements();
    await this.testAutoMatching();

    // Ownership transfer tests
    await this.testOwnershipTransfer();

    // Multi-cycle tests
    await this.testSimultaneousCycles();

    // Summary
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    console.log('\n=====================================');
    console.log('📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📋 Total: ${this.results.length}`);
    console.log('=====================================\n');

    return { passed, failed, results: this.results };
  }

  /**
   * Test: Property Creation
   */
  private async testPropertyCreation(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'John Doe',
        address: 'DHA Phase 5, Test Street, Karachi',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 500,
        features: ['Parking', 'Garden'],
      });

      this.addResult('Property Creation', true, { propertyId: property.id });
    } catch (error) {
      this.addResult('Property Creation', false, String(error));
    }
  }

  /**
   * Test: Property Update
   */
  private async testPropertyUpdate(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'John Doe',
        address: 'Test Property',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 150,
      });

      updateProperty(property.id, {
        bedrooms: 3,
        bathrooms: 2,
        description: 'Updated description',
      });

      const updated = getPropertyById(property.id);
      const success = updated?.bedrooms === 3 && updated?.bathrooms === 2;

      this.addResult('Property Update', success);
    } catch (error) {
      this.addResult('Property Update', false, String(error));
    }
  }

  /**
   * Test: Complete Sell Cycle Workflow
   */
  private async testSellCycleWorkflow(): Promise<void> {
    try {
      // Create property
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller Name',
        address: 'Sell Test Property',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 300,
      });

      // Create sell cycle
      const sellCycle = createSellCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        sellerId: 'owner_1',
        sellerName: 'Seller Name',
        sellerType: 'owner',
        sellerContact: '+92-300-1111111',
        askingPrice: 50000000,
        minAcceptablePrice: 45000000,
        commissionType: 'percentage',
        commissionRate: 2,
      });

      // Add offer
      addOffer(sellCycle.id, {
        buyerName: 'Buyer Name',
        buyerContact: '+92-300-2222222',
        offerAmount: 48000000,
        financingType: 'cash',
      });

      // Accept offer
      acceptOffer(sellCycle.id, sellCycle.offers![0].id);

      // Close cycle
      closeSellCycle(sellCycle.id, 48000000);

      this.addResult('Sell Cycle Workflow', true);
    } catch (error) {
      this.addResult('Sell Cycle Workflow', false, String(error));
    }
  }

  /**
   * Test: Offer Management
   */
  private async testOfferManagement(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Offer Test Property',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 150,
      });

      const sellCycle = createSellCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        sellerId: 'owner_1',
        sellerName: 'Seller',
        sellerType: 'owner',
        sellerContact: '+92-300-1111111',
        askingPrice: 30000000,
        commissionType: 'percentage',
        commissionRate: 2,
      });

      // Add multiple offers
      addOffer(sellCycle.id, {
        buyerName: 'Buyer 1',
        buyerContact: '+92-300-1111111',
        offerAmount: 28000000,
        financingType: 'cash',
      });

      addOffer(sellCycle.id, {
        buyerName: 'Buyer 2',
        buyerContact: '+92-300-2222222',
        offerAmount: 29000000,
        financingType: 'loan',
      });

      this.addResult('Offer Management', true);
    } catch (error) {
      this.addResult('Offer Management', false, String(error));
    }
  }

  /**
   * Test: Agency Purchase
   */
  private async testAgencyPurchase(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Agency Purchase Test',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 400,
      });

      const purchaseCycle = createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'agency',
        purchaserName: 'aaraazi Agency',
        offerAmount: 40000000,
        financingType: 'cash',
        investmentStrategy: 'flip',
        expectedROI: 15,
        renovationBudget: 2000000,
      });

      completePurchase(purchaseCycle.id, 40000000);

      this.addResult('Agency Purchase', true);
    } catch (error) {
      this.addResult('Agency Purchase', false, String(error));
    }
  }

  /**
   * Test: Investor Purchase
   */
  private async testInvestorPurchase(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Investor Purchase Test',
        propertyType: 'villa',
        bedrooms: 5,
        bathrooms: 4,
        area: 600,
      });

      const purchaseCycle = createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'investor',
        purchaserName: 'ABC Investor',
        purchaserContact: '+92-300-3333333',
        offerAmount: 80000000,
        financingType: 'cash',
        facilitationFee: 1000000,
      });

      completePurchase(purchaseCycle.id, 80000000);

      this.addResult('Investor Purchase', true);
    } catch (error) {
      this.addResult('Investor Purchase', false, String(error));
    }
  }

  /**
   * Test: Client Purchase
   */
  private async testClientPurchase(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Client Purchase Test',
        propertyType: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 250,
      });

      const purchaseCycle = createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'client',
        purchaserName: 'Client Buyer',
        purchaserContact: '+92-300-4444444',
        offerAmount: 35000000,
        financingType: 'loan',
        commissionType: 'percentage',
        commissionRate: 2,
        commissionSource: 'seller',
      });

      completePurchase(purchaseCycle.id, 35000000);

      this.addResult('Client Purchase', true);
    } catch (error) {
      this.addResult('Client Purchase', false, String(error));
    }
  }

  /**
   * Test: Rent Cycle Workflow
   */
  private async testRentCycleWorkflow(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Landlord',
        address: 'Rent Test Property',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 150,
      });

      const rentCycle = createRentCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        landlordId: 'owner_1',
        landlordName: 'Landlord',
        landlordType: 'owner',
        landlordContact: '+92-300-5555555',
        monthlyRent: 100000,
        securityDeposit: 200000,
        advanceRent: 100000,
        leaseDuration: 12,
        availableFrom: new Date().toISOString(),
        commissionType: 'fixed',
        commissionRate: 100000,
      });

      this.addResult('Rent Cycle Workflow', true);
    } catch (error) {
      this.addResult('Rent Cycle Workflow', false, String(error));
    }
  }

  /**
   * Test: Tenant Application
   */
  private async testTenantApplication(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Landlord',
        address: 'Tenant Test Property',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 300,
      });

      const rentCycle = createRentCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        landlordId: 'owner_1',
        landlordName: 'Landlord',
        landlordType: 'owner',
        landlordContact: '+92-300-5555555',
        monthlyRent: 150000,
        securityDeposit: 300000,
        advanceRent: 150000,
        leaseDuration: 12,
        availableFrom: new Date().toISOString(),
        commissionType: 'fixed',
        commissionRate: 150000,
      });

      // Add application
      addTenantApplication(rentCycle.id, {
        tenantName: 'Test Tenant',
        tenantContact: '+92-300-6666666',
        tenantEmail: 'tenant@test.com',
        occupation: 'Software Engineer',
        monthlyIncome: 300000,
        familySize: 4,
      });

      // Approve
      approveTenantApplication(rentCycle.id, rentCycle.applications![0].id);

      // Sign lease
      signLease(rentCycle.id, {
        tenantId: rentCycle.applications![0].id,
        tenantName: 'Test Tenant',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        monthlyRent: 150000,
        securityDeposit: 300000,
        advanceRent: 150000,
      });

      this.addResult('Tenant Application', true);
    } catch (error) {
      this.addResult('Tenant Application', false, String(error));
    }
  }

  /**
   * Test: Internal Match Detection
   */
  private async testInternalMatchDetection(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Match Test Property',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 400,
      });

      // Create sell cycle
      createSellCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        sellerId: 'owner_1',
        sellerName: 'Seller',
        sellerType: 'owner',
        sellerContact: '+92-300-1111111',
        askingPrice: 50000000,
        commissionType: 'percentage',
        commissionRate: 2,
      });

      // Create purchase cycle
      createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'client',
        purchaserName: 'Buyer',
        purchaserContact: '+92-300-2222222',
        offerAmount: 48000000,
        financingType: 'cash',
        commissionType: 'percentage',
        commissionRate: 2,
      });

      // Detect matches
      const matches = detectInternalMatches(this.testUser.id, this.testUser.role);
      const hasMatch = matches.some(m => m.propertyId === property.id);

      this.addResult('Internal Match Detection', hasMatch);
    } catch (error) {
      this.addResult('Internal Match Detection', false, String(error));
    }
  }

  /**
   * Test: Dual Representation Detection
   */
  private async testDualRepresentationDetection(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Seller',
        address: 'Dual Rep Test',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 150,
      });

      createSellCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        sellerId: 'owner_1',
        sellerName: 'Seller',
        sellerType: 'owner',
        sellerContact: '+92-300-1111111',
        askingPrice: 30000000,
        commissionType: 'percentage',
        commissionRate: 2,
      });

      createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'client',
        purchaserName: 'Buyer',
        purchaserContact: '+92-300-2222222',
        offerAmount: 29000000,
        financingType: 'cash',
        commissionType: 'percentage',
        commissionRate: 2,
      });

      const matches = detectInternalMatches(this.testUser.id, this.testUser.role);
      const match = matches.find(m => m.propertyId === property.id);
      const isDualRep = match?.isDualRepresentation === true;

      this.addResult('Dual Representation Detection', isDualRep);
    } catch (error) {
      this.addResult('Dual Representation Detection', false, String(error));
    }
  }

  /**
   * Test: Buyer Requirements
   */
  private async testBuyerRequirements(): Promise<void> {
    try {
      const requirement = createBuyerRequirement({
        buyerId: 'buyer_1',
        buyerName: 'Test Buyer',
        buyerContact: '+92-300-7777777',
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        minBudget: 20000000,
        maxBudget: 40000000,
        propertyTypes: ['house', 'apartment'],
        minBedrooms: 2,
        preferredLocations: ['DHA', 'Clifton'],
        urgency: 'high',
        financingType: 'cash',
      });

      this.addResult('Buyer Requirements', true, { requirementId: requirement.id });
    } catch (error) {
      this.addResult('Buyer Requirements', false, String(error));
    }
  }

  /**
   * Test: Auto-Matching
   */
  private async testAutoMatching(): Promise<void> {
    try {
      // Create requirement
      createBuyerRequirement({
        buyerId: 'buyer_1',
        buyerName: 'Test Buyer',
        buyerContact: '+92-300-7777777',
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        minBudget: 25000000,
        maxBudget: 35000000,
        propertyTypes: ['house'],
        minBedrooms: 3,
        preferredLocations: ['DHA'],
        urgency: 'high',
        financingType: 'cash',
      });

      // Create matching property
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Owner',
        address: 'DHA Phase 5, Test Street',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 300,
      });

      // Auto-match
      const matchedReqs = autoMatchRequirements(property.id, {
        price: 30000000,
        propertyType: 'house',
        bedrooms: 3,
        address: 'DHA Phase 5, Test Street',
      });

      this.addResult('Auto-Matching', matchedReqs.length > 0);
    } catch (error) {
      this.addResult('Auto-Matching', false, String(error));
    }
  }

  /**
   * Test: Ownership Transfer
   */
  private async testOwnershipTransfer(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Original Owner',
        address: 'Ownership Test',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 300,
      });

      transferOwnership(property.id, {
        newOwnerId: 'owner_2',
        newOwnerName: 'New Owner',
        transferDate: new Date().toISOString(),
        salePrice: 35000000,
        transferType: 'sale',
        transactionId: 'txn_test',
      });

      const updated = getPropertyById(property.id);
      const success = updated?.currentOwnerId === 'owner_2';

      this.addResult('Ownership Transfer', success);
    } catch (error) {
      this.addResult('Ownership Transfer', false, String(error));
    }
  }

  /**
   * Test: Simultaneous Cycles
   */
  private async testSimultaneousCycles(): Promise<void> {
    try {
      const property = createProperty({
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        currentOwnerId: 'owner_1',
        currentOwnerName: 'Owner',
        address: 'Multi-Cycle Test',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 400,
      });

      // Create sell cycle
      createSellCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        sellerId: 'owner_1',
        sellerName: 'Seller',
        sellerType: 'owner',
        sellerContact: '+92-300-1111111',
        askingPrice: 50000000,
        commissionType: 'percentage',
        commissionRate: 2,
      });

      // Create purchase cycle
      createPurchaseCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        purchaserType: 'agency',
        purchaserName: 'Agency',
        offerAmount: 48000000,
        financingType: 'cash',
        investmentStrategy: 'hold',
      });

      // Create rent cycle
      createRentCycle({
        propertyId: property.id,
        agentId: this.testUser.id,
        agentName: this.testUser.name,
        landlordId: 'owner_1',
        landlordName: 'Landlord',
        landlordType: 'owner',
        landlordContact: '+92-300-1111111',
        monthlyRent: 200000,
        securityDeposit: 400000,
        advanceRent: 200000,
        leaseDuration: 12,
        availableFrom: new Date().toISOString(),
        commissionType: 'fixed',
        commissionRate: 200000,
      });

      const updated = getPropertyById(property.id);
      const hasAllCycles = 
        updated!.activeSellCycleIds.length > 0 &&
        updated!.activePurchaseCycleIds.length > 0 &&
        updated!.activeRentCycleIds.length > 0;

      this.addResult('Simultaneous Cycles', hasAllCycles);
    } catch (error) {
      this.addResult('Simultaneous Cycles', false, String(error));
    }
  }

  /**
   * Add test result
   */
  private addResult(name: string, success: boolean, error?: string | any): void {
    const result: TestResult = {
      name,
      success,
      error: typeof error === 'string' ? error : undefined,
      details: typeof error === 'object' ? error : undefined,
    };

    this.results.push(result);

    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${name}`);
    if (!success && error) {
      console.log(`   Error: ${error}`);
    }
  }

  /**
   * Get results
   */
  getResults(): TestResult[] {
    return this.results;
  }
}

// Expose to window for console use
if (typeof window !== 'undefined') {
  (window as any).E2ETestSuite = E2ETestSuite;
  (window as any).runE2ETests = async () => {
    const suite = new E2ETestSuite();
    return await suite.runAll();
  };
}
