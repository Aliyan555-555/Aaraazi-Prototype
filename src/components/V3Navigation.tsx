/**
 * V3 Navigation Component
 * Navigation wrapper for V3.0 features
 */

import React, { useState } from 'react';
import { User } from '../types';
import { PropertyManagementV3 } from './PropertyManagementV3';
import { SellCyclesWorkspace } from './SellCyclesWorkspace';
import { PurchaseCyclesWorkspace } from './PurchaseCyclesWorkspace';
import { RentCyclesWorkspace } from './RentCyclesWorkspace';
import { BuyerRequirementsWorkspace } from './BuyerRequirementsWorkspace';
import { MigrationDashboard } from './MigrationDashboard';
import { InternalMatchesWidget } from './InternalMatchesWidget';
import { MigrationChecker } from './MigrationChecker';

interface V3NavigationProps {
  user: User;
  activeSection: 'properties' | 'sell-cycles' | 'purchase-cycles' | 'rent-cycles' | 'buyer-requirements' | 'migration';
  onNavigate: (section: string) => void;
}

export function V3Navigation({ user, activeSection, onNavigate }: V3NavigationProps) {
  // Render the appropriate workspace based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'properties':
        return <PropertyManagementV3 user={user} />;
      
      case 'sell-cycles':
        return <SellCyclesWorkspace user={user} />;
      
      case 'purchase-cycles':
        return <PurchaseCyclesWorkspace user={user} />;
      
      case 'rent-cycles':
        return <RentCyclesWorkspace user={user} />;
      
      case 'buyer-requirements':
        return <BuyerRequirementsWorkspace user={user} />;
      
      case 'migration':
        return <MigrationDashboard />;
      
      default:
        return <PropertyManagementV3 user={user} />;
    }
  };

  return (
    <>
      {/* Migration checker - shows on first load if needed */}
      <MigrationChecker onMigrationComplete={() => window.location.reload()} />
      
      {/* Main content */}
      <div className="min-h-screen bg-gray-50">
        {renderContent()}
      </div>
    </>
  );
}
