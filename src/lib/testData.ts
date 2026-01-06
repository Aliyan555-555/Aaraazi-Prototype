/**
 * Test Data Generator - V3.0
 * Generate sample data for testing migration and features
 */

import { PropertyV2 } from '../types';

/**
 * Generate V2 sample properties for testing migration
 */
export function generateV2TestData(): PropertyV2[] {
  return [
    {
      id: 'prop_test_1',
      agentId: 'agent_1',
      agentName: 'Test Agent',
      ownerId: 'owner_1',
      ownerName: 'John Doe',
      
      address: 'DHA Phase 5, Block A, Street 10, Karachi',
      propertyType: 'house',
      bedrooms: 4,
      bathrooms: 3,
      area: 500,
      features: ['Parking', 'Garden', 'Security'],
      description: 'Beautiful house in prime location',
      images: [],
      
      listingType: 'for-sale',
      price: 50000000,
      status: 'available',
      
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'prop_test_2',
      agentId: 'agent_1',
      agentName: 'Test Agent',
      ownerId: 'owner_2',
      ownerName: 'Jane Smith',
      
      address: 'Clifton Block 2, Main Rd, Karachi',
      propertyType: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: 300,
      features: ['Elevator', 'Gym', 'Pool'],
      description: 'Modern apartment with sea view',
      images: [],
      
      listingType: 'for-rent',
      price: 150000,
      status: 'available',
      
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z',
    },
    {
      id: 'prop_test_3',
      agentId: 'agent_1',
      agentName: 'Test Agent',
      ownerId: 'owner_3',
      ownerName: 'Ahmed Khan',
      
      address: 'Bahria Town, Precinct 10, Karachi',
      propertyType: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 800,
      features: ['Parking', 'Garden', 'Security', 'Pool'],
      description: 'Luxury villa in gated community',
      images: [],
      
      listingType: 'for-sale',
      price: 120000000,
      status: 'available',
      
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-03-10T10:00:00Z',
    },
    {
      id: 'prop_test_4',
      agentId: 'agent_2',
      agentName: 'Another Agent',
      ownerId: 'owner_4',
      ownerName: 'Sara Ali',
      
      address: 'Gulshan-e-Iqbal, Block 13, Karachi',
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      area: 250,
      features: ['Parking', 'Terrace'],
      description: 'Cozy family house',
      images: [],
      
      listingType: 'for-sale',
      price: 35000000,
      status: 'sold',
      
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z',
    },
    {
      id: 'prop_test_5',
      agentId: 'agent_1',
      agentName: 'Test Agent',
      ownerId: 'owner_5',
      ownerName: 'Bilal Hussain',
      
      address: 'North Nazimabad, Block B, Karachi',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      area: 150,
      features: ['Balcony', 'Parking'],
      description: 'Affordable apartment',
      images: [],
      
      listingType: 'for-rent',
      price: 80000,
      status: 'rented',
      
      createdAt: '2024-02-15T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z',
    },
  ];
}

/**
 * Load V2 test data into localStorage
 */
export function loadV2TestData(): void {
  const testData = generateV2TestData();
  localStorage.setItem('properties', JSON.stringify(testData));
  console.log(`✅ Loaded ${testData.length} V2 test properties`);
}

/**
 * Clear all data (use with caution!)
 */
export function clearAllData(): void {
  if (!confirm('This will delete ALL data including backups. Are you sure?')) {
    return;
  }

  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('estate') || key === 'properties' || key.includes('_v3'))) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`🗑️ Cleared ${keysToRemove.length} keys`);
}

/**
 * Clear only V3 data (keep V2 for re-testing migration)
 */
export function clearV3Data(): void {
  localStorage.removeItem('sell_cycles_v3');
  localStorage.removeItem('purchase_cycles_v3');
  localStorage.removeItem('rent_cycles_v3');
  localStorage.removeItem('buyer_requirements_v3');
  localStorage.removeItem('migration_status_v3');
  localStorage.removeItem('estatemanager_backup_v2');
  
  console.log('🗑️ Cleared V3 data and migration status');
}

/**
 * Get data summary
 */
export function getDataSummary(): any {
  const summary: any = {
    v2: {
      properties: 0,
    },
    v3: {
      properties: 0,
      sellCycles: 0,
      purchaseCycles: 0,
      rentCycles: 0,
      buyerRequirements: 0,
    },
    migration: {
      isComplete: false,
      hasBackup: false,
    },
  };

  // V2 data
  try {
    const v2Props = localStorage.getItem('properties');
    if (v2Props) {
      summary.v2.properties = JSON.parse(v2Props).length;
    }
  } catch (e) {}

  // V3 data
  try {
    const v3Props = localStorage.getItem('properties');
    if (v3Props) {
      const props = JSON.parse(v3Props);
      // Check if V3 structure (has activeSellCycleIds)
      if (props[0] && props[0].activeSellCycleIds !== undefined) {
        summary.v3.properties = props.length;
      }
    }

    const sellCycles = localStorage.getItem('sell_cycles_v3');
    if (sellCycles) {
      summary.v3.sellCycles = JSON.parse(sellCycles).length;
    }

    const purchaseCycles = localStorage.getItem('purchase_cycles_v3');
    if (purchaseCycles) {
      summary.v3.purchaseCycles = JSON.parse(purchaseCycles).length;
    }

    const rentCycles = localStorage.getItem('rent_cycles_v3');
    if (rentCycles) {
      summary.v3.rentCycles = JSON.parse(rentCycles).length;
    }

    const buyerReqs = localStorage.getItem('buyer_requirements_v3');
    if (buyerReqs) {
      summary.v3.buyerRequirements = JSON.parse(buyerReqs).length;
    }
  } catch (e) {}

  // Migration status
  try {
    const migStatus = localStorage.getItem('migration_status_v3');
    if (migStatus) {
      const status = JSON.parse(migStatus);
      summary.migration.isComplete = status.isComplete;
    }

    const backup = localStorage.getItem('estatemanager_backup_v2');
    summary.migration.hasBackup = !!backup;
  } catch (e) {}

  return summary;
}

/**
 * Print data summary to console
 */
export function printDataSummary(): void {
  const summary = getDataSummary();
  
  console.log('📊 Data Summary:');
  console.log('================');
  console.log('V2 Data:');
  console.log(`  Properties: ${summary.v2.properties}`);
  console.log('');
  console.log('V3 Data:');
  console.log(`  Properties: ${summary.v3.properties}`);
  console.log(`  Sell Cycles: ${summary.v3.sellCycles}`);
  console.log(`  Purchase Cycles: ${summary.v3.purchaseCycles}`);
  console.log(`  Rent Cycles: ${summary.v3.rentCycles}`);
  console.log(`  Buyer Requirements: ${summary.v3.buyerRequirements}`);
  console.log('');
  console.log('Migration:');
  console.log(`  Complete: ${summary.migration.isComplete ? 'Yes ✅' : 'No ❌'}`);
  console.log(`  Has Backup: ${summary.migration.hasBackup ? 'Yes ✅' : 'No ❌'}`);
}

/**
 * Quick test migration workflow
 */
export function quickTestMigration(): void {
  console.log('🧪 Starting quick test migration...');
  console.log('');
  
  // Step 1: Clear existing data
  console.log('Step 1: Clearing V3 data...');
  clearV3Data();
  
  // Step 2: Load V2 test data
  console.log('Step 2: Loading V2 test data...');
  loadV2TestData();
  
  // Step 3: Show summary
  console.log('');
  console.log('Step 3: Data loaded! Summary:');
  printDataSummary();
  
  console.log('');
  console.log('✅ Test data ready!');
  console.log('💡 Now you can test the migration from the Migration Dashboard');
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).testData = {
    generateV2TestData,
    loadV2TestData,
    clearAllData,
    clearV3Data,
    getDataSummary,
    printDataSummary,
    quickTestMigration,
  };
}
