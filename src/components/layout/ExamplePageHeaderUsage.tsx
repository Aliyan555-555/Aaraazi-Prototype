/**
 * Example: How to use PageHeader with all foundation components
 * 
 * This file demonstrates the complete PageHeader implementation
 * for a typical detail page in aaraazi.
 * 
 * You can copy this pattern to any detail page.
 */

import React from 'react';
import { PageHeader } from './PageHeader';
import { 
  Home, 
  DollarSign, 
  Square, 
  Calendar, 
  Eye,
  Edit,
  TrendingUp,
  Share2,
  Archive,
  Copy
} from 'lucide-react';
import { formatPKR } from '../../lib/currency';

interface ExamplePageHeaderUsageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function ExamplePageHeaderUsage({ onNavigate }: ExamplePageHeaderUsageProps) {
  // Example data
  const property = {
    id: 'prop-123',
    title: 'Marina Residences',
    address: 'DHA Phase 8, Karachi',
    status: 'available',
    price: 55000000,
    area: 2500,
    areaUnit: 'sqft',
    views: 24,
    listedDate: '2024-12-10'
  };

  const owner = {
    id: 'client-456',
    name: 'Ahmed Khan'
  };

  const agent = {
    id: 'user-789',
    name: 'Sarah Ali'
  };

  const activeDeal = {
    id: 'deal-012',
    dealNumber: 'D-2024-012'
  };

  // Calculate days on market
  const daysOnMarket = Math.floor(
    (new Date().getTime() - new Date(property.listedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Handlers
  const handleEdit = () => {
    console.log('Edit property');
    // Open edit modal
  };

  const handleStartSale = () => {
    console.log('Start sell cycle');
    // Open sell cycle modal
  };

  const handleDuplicate = () => {
    console.log('Duplicate property');
  };

  const handleArchive = () => {
    console.log('Archive property');
  };

  const handleShare = () => {
    console.log('Share property');
  };

  return (
    <PageHeader
      // Navigation
      onBack={() => onNavigate('properties')}
      breadcrumbs={[
        { label: 'Dashboard', onClick: () => onNavigate('dashboard') },
        { label: 'Properties', onClick: () => onNavigate('properties') },
        { label: property.title }
      ]}

      // Title section
      icon={<Home />}
      title={property.title}
      subtitle={property.address}
      status={{ label: property.status, variant: 'success' }}

      // Metrics (Miller's Law: max 5)
      metrics={[
        { 
          label: 'Price', 
          value: formatPKR(property.price), 
          icon: <DollarSign /> 
        },
        { 
          label: 'Area', 
          value: `${property.area.toLocaleString()} ${property.areaUnit}`, 
          icon: <Square /> 
        },
        { 
          label: 'Days Listed', 
          value: daysOnMarket, 
          icon: <Calendar /> 
        },
        { 
          label: 'Views', 
          value: property.views, 
          icon: <Eye />,
          trend: { value: 15, direction: 'up', period: 'this week' }
        }
      ]}

      // Primary actions (Hick's Law: max 3)
      primaryActions={[
        { 
          label: 'Edit', 
          icon: <Edit />, 
          onClick: handleEdit,
          variant: 'outline'
        },
        { 
          label: 'Start Sell Cycle', 
          icon: <TrendingUp />, 
          onClick: handleStartSale 
        }
      ]}

      // Secondary actions (progressive disclosure)
      secondaryActions={[
        { 
          label: 'Duplicate Property', 
          icon: <Copy />, 
          onClick: handleDuplicate 
        },
        { 
          label: 'Share', 
          icon: <Share2 />, 
          onClick: handleShare 
        },
        { 
          label: 'Archive', 
          icon: <Archive />, 
          onClick: handleArchive 
        }
      ]}

      // Connected entities
      connectedEntities={[
        { 
          type: 'owner', 
          id: owner.id, 
          name: owner.name, 
          role: 'Property Owner',
          onClick: () => onNavigate('client', owner.id) 
        },
        { 
          type: 'agent', 
          id: agent.id, 
          name: agent.name, 
          role: 'Listing Agent',
          onClick: () => onNavigate('agent', agent.id) 
        },
        { 
          type: 'deal', 
          id: activeDeal.id, 
          name: `Deal #${activeDeal.dealNumber}`,
          onClick: () => onNavigate('deal', activeDeal.id) 
        }
      ]}
    />
  );
}

/**
 * USAGE IN A DETAIL PAGE:
 * 
 * import { ExamplePageHeaderUsage } from './components/layout/ExamplePageHeaderUsage';
 * 
 * function PropertyDetailPage() {
 *   return (
 *     <div>
 *       <ExamplePageHeaderUsage onNavigate={handleNavigate} />
 *       
 *       <div className="p-6">
 *         <Tabs>
 *           <TabsList>
 *             <TabsTrigger value="overview">Overview</TabsTrigger>
 *             <TabsTrigger value="details">Details</TabsTrigger>
 *             <TabsTrigger value="financials">Financials</TabsTrigger>
 *             <TabsTrigger value="activity">Activity</TabsTrigger>
 *           </TabsList>
 *           
 *           <TabsContent value="overview">
 *             {/* Content */}
 *           </TabsContent>
 *         </Tabs>
 *       </div>
 *     </div>
 *   );
 * }
 */
