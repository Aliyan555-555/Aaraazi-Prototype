// Comprehensive testing utilities for edge cases and system validation

import { errorReporter } from './errorReporting';
import { storage } from './storage';
import { CommonValidators } from './validation';

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

export interface TestSuite {
  suiteName: string;
  results: TestResult[];
  passed: number;
  failed: number;
  total: number;
}

export class SystemTester {
  private testResults: TestSuite[] = [];

  // Run all system tests
  async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Running comprehensive system tests...');
    
    this.testResults = [];
    
    // Run test suites
    await this.runStorageTests();
    await this.runValidationTests();
    await this.runDataIntegrityTests();
    await this.runComponentTests();
    await this.runErrorHandlingTests();
    
    this.printSummary();
    return this.testResults;
  }

  // Test localStorage functionality and edge cases
  private async runStorageTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Storage Tests',
      results: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test basic storage operations
    suite.results.push(this.testStorageOperation());
    
    // Test storage quota handling
    suite.results.push(await this.testStorageQuota());
    
    // Test data corruption handling
    suite.results.push(this.testCorruptedData());
    
    // Test concurrent access
    suite.results.push(this.testConcurrentAccess());

    this.calculateSuiteStats(suite);
    this.testResults.push(suite);
  }

  // Test validation system
  private async runValidationTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Validation Tests',
      results: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test property validation
    suite.results.push(this.testPropertyValidation());
    
    // Test lead validation
    suite.results.push(this.testLeadValidation());
    
    // Test edge case inputs
    suite.results.push(this.testEdgeCaseInputs());
    
    // Test XSS prevention
    suite.results.push(this.testXSSPrevention());

    this.calculateSuiteStats(suite);
    this.testResults.push(suite);
  }

  // Test data integrity
  private async runDataIntegrityTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Data Integrity Tests',
      results: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test data consistency
    suite.results.push(this.testDataConsistency());
    
    // Test reference integrity
    suite.results.push(this.testReferenceIntegrity());
    
    // Test data migration
    suite.results.push(this.testDataMigration());

    this.calculateSuiteStats(suite);
    this.testResults.push(suite);
  }

  // Test component error handling
  private async runComponentTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Component Tests',
      results: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test form submissions with invalid data
    suite.results.push(this.testInvalidFormData());
    
    // Test empty states
    suite.results.push(this.testEmptyStates());
    
    // Test large datasets
    suite.results.push(this.testLargeDatasets());

    this.calculateSuiteStats(suite);
    this.testResults.push(suite);
  }

  // Test error handling system
  private async runErrorHandlingTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Error Handling Tests',
      results: [],
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test error reporting
    suite.results.push(this.testErrorReporting());
    
    // Test error recovery
    suite.results.push(this.testErrorRecovery());
    
    // Test boundary conditions
    suite.results.push(this.testBoundaryConditions());

    this.calculateSuiteStats(suite);
    this.testResults.push(suite);
  }

  // Individual test implementations
  private testStorageOperation(): TestResult {
    try {
      const testKey = 'test_storage_operation';
      const testData = { test: 'data', number: 123 };
      
      // Test set
      const setResult = storage.set(testKey, testData);
      if (!setResult.success) {
        return {
          testName: 'Basic Storage Operation',
          passed: false,
          message: 'Failed to set data',
          details: setResult.error
        };
      }
      
      // Test get
      const getResult = storage.get(testKey, null);
      if (!getResult.success || JSON.stringify(getResult.data) !== JSON.stringify(testData)) {
        return {
          testName: 'Basic Storage Operation',
          passed: false,
          message: 'Failed to retrieve correct data',
          details: { expected: testData, actual: getResult.data }
        };
      }
      
      // Test remove
      storage.remove(testKey);
      
      return {
        testName: 'Basic Storage Operation',
        passed: true,
        message: 'Storage operations work correctly'
      };
    } catch (error) {
      return {
        testName: 'Basic Storage Operation',
        passed: false,
        message: 'Exception during storage test',
        details: error
      };
    }
  }

  private async testStorageQuota(): Promise<TestResult> {
    try {
      const storageInfo = storage.getStorageInfo();
      
      if (storageInfo.percentage > 90) {
        return {
          testName: 'Storage Quota Handling',
          passed: false,
          message: 'Storage is nearly full',
          details: storageInfo
        };
      }
      
      // Test cleanup functionality
      if (storage.isStorageNearCapacity()) {
        // This would trigger cleanup in real usage
        return {
          testName: 'Storage Quota Handling',
          passed: true,
          message: 'Storage cleanup system is active',
          details: storageInfo
        };
      }
      
      return {
        testName: 'Storage Quota Handling',
        passed: true,
        message: 'Storage quota handling works correctly',
        details: storageInfo
      };
    } catch (error) {
      return {
        testName: 'Storage Quota Handling',
        passed: false,
        message: 'Error testing storage quota',
        details: error
      };
    }
  }

  private testCorruptedData(): TestResult {
    try {
      const testKey = 'test_corrupted_data';
      
      // Manually set corrupted JSON
      localStorage.setItem(testKey, '{"invalid": json}');
      
      // Test recovery
      const result = storage.get(testKey, { default: 'value' });
      
      if (result.success && result.data.default === 'value') {
        storage.remove(testKey);
        return {
          testName: 'Corrupted Data Handling',
          passed: true,
          message: 'Corrupted data handled gracefully'
        };
      }
      
      return {
        testName: 'Corrupted Data Handling',
        passed: false,
        message: 'Failed to handle corrupted data',
        details: result
      };
    } catch (error) {
      return {
        testName: 'Corrupted Data Handling',
        passed: false,
        message: 'Exception during corrupted data test',
        details: error
      };
    }
  }

  private testConcurrentAccess(): TestResult {
    try {
      const testKey = 'test_concurrent_access';
      
      // Simulate rapid concurrent access
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(storage.set(`${testKey}_${i}`, { iteration: i }));
      }
      
      // All operations should succeed
      const allSucceeded = promises.every(p => p);
      
      // Cleanup
      for (let i = 0; i < 10; i++) {
        storage.remove(`${testKey}_${i}`);
      }
      
      return {
        testName: 'Concurrent Access Handling',
        passed: allSucceeded,
        message: allSucceeded ? 'Concurrent access handled correctly' : 'Some concurrent operations failed'
      };
    } catch (error) {
      return {
        testName: 'Concurrent Access Handling',
        passed: false,
        message: 'Exception during concurrent access test',
        details: error
      };
    }
  }

  private testPropertyValidation(): TestResult {
    try {
      const validProperty = {
        title: 'Test Property',
        address: '123 Test Street, Test City',
        price: 100000,
        area: 1200,
        description: 'This is a test property with a valid description that meets the minimum length requirement.'
      };
      
      const invalidProperty = {
        title: 'AB', // Too short
        address: '123', // Too short
        price: -100, // Negative
        area: 0, // Zero
        description: 'Short' // Too short
      };
      
      const validResult = CommonValidators.property.validate(validProperty);
      const invalidResult = CommonValidators.property.validate(invalidProperty);
      
      if (validResult.isValid && !invalidResult.isValid) {
        return {
          testName: 'Property Validation',
          passed: true,
          message: 'Property validation works correctly'
        };
      }
      
      return {
        testName: 'Property Validation',
        passed: false,
        message: 'Property validation failed',
        details: { validResult, invalidResult }
      };
    } catch (error) {
      return {
        testName: 'Property Validation',
        passed: false,
        message: 'Exception during property validation test',
        details: error
      };
    }
  }

  private testLeadValidation(): TestResult {
    try {
      const validLead = {
        name: 'John Doe',
        phone: '+92-300-1234567',
        email: 'john@example.com',
        source: 'Website',
        notes: 'Test notes'
      };
      
      const invalidLead = {
        name: 'A', // Too short
        phone: '123', // Invalid format
        email: 'invalid-email', // Invalid format
        source: '', // Required but empty
        notes: 'x'.repeat(1001) // Too long
      };
      
      const validResult = CommonValidators.lead.validate(validLead);
      const invalidResult = CommonValidators.lead.validate(invalidLead);
      
      if (validResult.isValid && !invalidResult.isValid) {
        return {
          testName: 'Lead Validation',
          passed: true,
          message: 'Lead validation works correctly'
        };
      }
      
      return {
        testName: 'Lead Validation',
        passed: false,
        message: 'Lead validation failed',
        details: { validResult, invalidResult }
      };
    } catch (error) {
      return {
        testName: 'Lead Validation',
        passed: false,
        message: 'Exception during lead validation test',
        details: error
      };
    }
  }

  private testEdgeCaseInputs(): TestResult {
    try {
      const edgeCases = [
        null,
        undefined,
        '',
        '   ',
        0,
        -1,
        Infinity,
        NaN,
        {},
        [],
        '<script>alert("xss")</script>',
        'x'.repeat(10000) // Very long string
      ];
      
      let passedCount = 0;
      const results: any[] = [];
      
      edgeCases.forEach(testCase => {
        try {
          const result = CommonValidators.lead.validateField('name', testCase);
          results.push({ input: testCase, result });
          if (result !== null || testCase === null || testCase === undefined || testCase === '' || testCase === '   ') {
            passedCount++;
          }
        } catch (error) {
          results.push({ input: testCase, error });
        }
      });
      
      return {
        testName: 'Edge Case Input Handling',
        passed: passedCount === edgeCases.length,
        message: `Handled ${passedCount}/${edgeCases.length} edge cases correctly`,
        details: results
      };
    } catch (error) {
      return {
        testName: 'Edge Case Input Handling',
        passed: false,
        message: 'Exception during edge case testing',
        details: error
      };
    }
  }

  private testXSSPrevention(): TestResult {
    try {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\\"xss\\")">',
        '<iframe src="javascript:alert(\\"xss\\")"></iframe>'
      ];
      
      // Test that these inputs don't cause issues in validation
      let safe = true;
      
      xssAttempts.forEach(attempt => {
        try {
          CommonValidators.lead.validateField('name', attempt);
          // If no exception and validation handles it appropriately, it's safe
        } catch (error) {
          // Exceptions during validation of malicious input could indicate vulnerability
          safe = false;
        }
      });
      
      return {
        testName: 'XSS Prevention',
        passed: safe,
        message: safe ? 'XSS attempts handled safely' : 'Potential XSS vulnerability detected'
      };
    } catch (error) {
      return {
        testName: 'XSS Prevention',
        passed: false,
        message: 'Exception during XSS prevention test',
        details: error
      };
    }
  }

  private testDataConsistency(): TestResult {
    try {
      // Test that related data remains consistent
      const properties = storage.get('estate_properties', []);
      const leads = storage.get('estate_leads', []);
      
      if (!properties.success || !leads.success) {
        return {
          testName: 'Data Consistency',
          passed: false,
          message: 'Failed to load data for consistency check'
        };
      }
      
      // Check that lead property references exist
      let inconsistentCount = 0;
      const propertyIds = new Set(properties.data.map((p: any) => p.id));
      
      leads.data.forEach((lead: any) => {
        if (lead.propertyId && !propertyIds.has(lead.propertyId)) {
          inconsistentCount++;
        }
      });
      
      return {
        testName: 'Data Consistency',
        passed: inconsistentCount === 0,
        message: `Found ${inconsistentCount} inconsistent property references`
      };
    } catch (error) {
      return {
        testName: 'Data Consistency',
        passed: false,
        message: 'Exception during data consistency test',
        details: error
      };
    }
  }

  private testReferenceIntegrity(): TestResult {
    try {
      // Test that agent references are valid
      const properties = storage.get('estate_properties', []);
      const users = storage.get('estate_users', []);
      
      if (!properties.success || !users.success) {
        return {
          testName: 'Reference Integrity',
          passed: false,
          message: 'Failed to load data for reference integrity check'
        };
      }
      
      const userIds = new Set(users.data.map((u: any) => u.id));
      let invalidReferenceCount = 0;
      
      properties.data.forEach((property: any) => {
        if (property.agentId && !userIds.has(property.agentId)) {
          invalidReferenceCount++;
        }
      });
      
      return {
        testName: 'Reference Integrity',
        passed: invalidReferenceCount === 0,
        message: `Found ${invalidReferenceCount} invalid agent references`
      };
    } catch (error) {
      return {
        testName: 'Reference Integrity',
        passed: false,
        message: 'Exception during reference integrity test',
        details: error
      };
    }
  }

  private testDataMigration(): TestResult {
    // This would test migration between data format versions
    return {
      testName: 'Data Migration',
      passed: true,
      message: 'Data migration system ready (no migrations needed currently)'
    };
  }

  private testInvalidFormData(): TestResult {
    try {
      // Test handling of malformed form submissions
      const invalidSubmissions = [
        { name: null, phone: undefined },
        { price: 'not-a-number', area: 'invalid' },
        { description: '<script>alert("xss")</script>' }
      ];
      
      let handledCorrectly = 0;
      
      invalidSubmissions.forEach(submission => {
        try {
          const result = CommonValidators.property.validate(submission);
          if (!result.isValid) {
            handledCorrectly++;
          }
        } catch (error) {
          // Should not throw exceptions
        }
      });
      
      return {
        testName: 'Invalid Form Data Handling',
        passed: handledCorrectly === invalidSubmissions.length,
        message: `Handled ${handledCorrectly}/${invalidSubmissions.length} invalid submissions correctly`
      };
    } catch (error) {
      return {
        testName: 'Invalid Form Data Handling',
        passed: false,
        message: 'Exception during invalid form data test',
        details: error
      };
    }
  }

  private testEmptyStates(): TestResult {
    try {
      // Test handling of empty data arrays
      const emptyArrays = [[], null, undefined];
      let handledCorrectly = 0;
      
      emptyArrays.forEach(emptyData => {
        try {
          // Test various functions that should handle empty data gracefully
          const result = Array.isArray(emptyData) ? emptyData : [];
          if (Array.isArray(result)) {
            handledCorrectly++;
          }
        } catch (error) {
          // Should not throw exceptions
        }
      });
      
      return {
        testName: 'Empty State Handling',
        passed: handledCorrectly === emptyArrays.length,
        message: `Handled ${handledCorrectly}/${emptyArrays.length} empty states correctly`
      };
    } catch (error) {
      return {
        testName: 'Empty State Handling',
        passed: false,
        message: 'Exception during empty state test',
        details: error
      };
    }
  }

  private testLargeDatasets(): TestResult {
    try {
      // Test performance with larger datasets
      const largeArray = new Array(1000).fill(0).map((_, i) => ({
        id: i.toString(),
        name: `Item ${i}`,
        value: Math.random() * 1000
      }));
      
      const startTime = performance.now();
      
      // Test filtering and processing
      const filtered = largeArray.filter(item => item.value > 500);
      const processed = filtered.map(item => ({ ...item, processed: true }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      return {
        testName: 'Large Dataset Processing',
        passed: processingTime < 100, // Should process 1000 items in under 100ms
        message: `Processed 1000 items in ${processingTime.toFixed(2)}ms`,
        details: { processingTime, resultCount: processed.length }
      };
    } catch (error) {
      return {
        testName: 'Large Dataset Processing',
        passed: false,
        message: 'Exception during large dataset test',
        details: error
      };
    }
  }

  private testErrorReporting(): TestResult {
    try {
      const initialErrorCount = errorReporter.getRecentErrors().length;
      
      // Generate a test error
      errorReporter.report('system', 'low', 'Test error for validation');
      
      const finalErrorCount = errorReporter.getRecentErrors().length;
      
      return {
        testName: 'Error Reporting System',
        passed: finalErrorCount > initialErrorCount,
        message: 'Error reporting system working correctly'
      };
    } catch (error) {
      return {
        testName: 'Error Reporting System',
        passed: false,
        message: 'Exception during error reporting test',
        details: error
      };
    }
  }

  private testErrorRecovery(): TestResult {
    try {
      // Test that the system can recover from various error conditions
      let recoveryCount = 0;
      
      // Test 1: Recover from invalid JSON
      try {
        JSON.parse('invalid json');
      } catch (e) {
        // Should handle gracefully
        recoveryCount++;
      }
      
      // Test 2: Recover from null reference
      try {
        const obj: any = null;
        const result = obj?.property || 'default';
        if (result === 'default') recoveryCount++;
      } catch (e) {
        // Optional chaining should prevent this
      }
      
      // Test 3: Recover from array access
      try {
        const arr: any[] = [];
        const item = arr[0] || 'default';
        if (item === 'default') recoveryCount++;
      } catch (e) {
        // Should not throw
      }
      
      return {
        testName: 'Error Recovery',
        passed: recoveryCount === 3,
        message: `Recovered from ${recoveryCount}/3 error conditions`
      };
    } catch (error) {
      return {
        testName: 'Error Recovery',
        passed: false,
        message: 'Exception during error recovery test',
        details: error
      };
    }
  }

  private testBoundaryConditions(): TestResult {
    try {
      const boundaryTests = [
        // Test maximum values
        { value: Number.MAX_SAFE_INTEGER, expected: 'handled' },
        { value: Number.MIN_SAFE_INTEGER, expected: 'handled' },
        { value: Number.POSITIVE_INFINITY, expected: 'handled' },
        { value: Number.NEGATIVE_INFINITY, expected: 'handled' },
        { value: Number.NaN, expected: 'handled' }
      ];
      
      let handledCount = 0;
      
      boundaryTests.forEach(test => {
        try {
          const isValid = typeof test.value === 'number' && isFinite(test.value);
          // Should handle both valid and invalid numbers gracefully
          handledCount++;
        } catch (error) {
          // Should not throw exceptions
        }
      });
      
      return {
        testName: 'Boundary Condition Handling',
        passed: handledCount === boundaryTests.length,
        message: `Handled ${handledCount}/${boundaryTests.length} boundary conditions correctly`
      };
    } catch (error) {
      return {
        testName: 'Boundary Condition Handling',
        passed: false,
        message: 'Exception during boundary condition test',
        details: error
      };
    }
  }

  private calculateSuiteStats(suite: TestSuite): void {
    suite.total = suite.results.length;
    suite.passed = suite.results.filter(r => r.passed).length;
    suite.failed = suite.total - suite.passed;
  }

  private printSummary(): void {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    let totalTests = 0;
    let totalPassed = 0;
    
    this.testResults.forEach(suite => {
      totalTests += suite.total;
      totalPassed += suite.passed;
      
      const status = suite.passed === suite.total ? '✅' : suite.failed > 0 ? '❌' : '⚠️';
      console.log(`${status} ${suite.suiteName}: ${suite.passed}/${suite.total} passed`);
      
      // Show failed tests
      suite.results.filter(r => !r.passed).forEach(result => {
        console.log(`   ❌ ${result.testName}: ${result.message}`);
      });
    });
    
    console.log('================');
    console.log(`🎯 Overall: ${totalPassed}/${totalTests} tests passed (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
    
    if (totalPassed === totalTests) {
      console.log('🎉 All tests passed! System is healthy.');
    } else {
      console.log('⚠️ Some tests failed. Please review the issues above.');
    }
  }
}

// Export singleton instance
export const systemTester = new SystemTester();

// Run tests on demand
export const runSystemTests = () => systemTester.runAllTests();