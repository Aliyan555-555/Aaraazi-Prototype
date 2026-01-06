import { LandParcel, LandAcquisitionStats } from '../types';

const LAND_PARCELS_KEY = 'land_parcels';

// Mock Land Parcels Data for Initial Setup
const mockLandParcels: LandParcel[] = [
  {
    id: 'land-1',
    parcelName: 'DHA Phase 9 - Corner Plot',
    description: 'Premium corner plot in DHA Phase 9 with excellent development potential for residential or commercial use.',
    
    location: {
      address: 'Street 15, Sector A, DHA Phase 9',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75500',
      country: 'Pakistan',
      coordinates: { lat: 24.8607, lng: 67.0011 },
      landmarks: ['DHA Golf Club', 'Expo Center', 'University of Karachi'],
      accessibility: {
        roadAccess: 'excellent',
        publicTransport: 'good',
        utilities: 'all-available'
      }
    },
    
    area: {
      totalArea: 1000,
      unit: 'sq-yards',
      usableArea: 950,
      frontage: 50,
      depth: 80,
      shape: 'corner'
    },
    
    legal: {
      status: 'verified',
      ownershipType: 'freehold',
      titleDeedStatus: 'clear',
      approvals: [
        {
          id: 'noc-1',
          type: 'noc',
          authority: 'DHA Authority',
          status: 'approved',
          appliedDate: '2024-01-15',
          approvedDate: '2024-02-10',
          expiryDate: '2027-02-10',
          referenceNumber: 'DHA-NOC-2024-001',
          conditions: ['Residential use only', 'Maximum 4 floors'],
          documents: ['noc-certificate.pdf']
        }
      ],
      restrictions: ['No commercial use on ground floor'],
      easements: [],
      encumbrances: []
    },
    
    financial: {
      askingPrice: 250000000, // 25 Crore PKR
      pricePerUnit: 250000, // Per sq yard
      valuationAmount: 240000000,
      marketValue: 245000000,
      stampDuty: 2500000,
      registrationCharges: 500000,
      totalCost: 253000000,
      paymentTerms: '30% advance, 70% on registration',
      brokerageRate: 1,
      brokerageAmount: 2500000
    },
    
    feasibility: {
      score: 85,
      factors: {
        location: 90,
        accessibility: 85,
        legalClearance: 95,
        marketPotential: 80,
        infrastructure: 85,
        priceValue: 75
      },
      strengths: [
        'Prime DHA location',
        'Corner plot with dual road access',
        'Clear title and NOC approved',
        'High appreciation potential'
      ],
      weaknesses: [
        'Premium pricing',
        'Limited commercial options'
      ],
      opportunities: [
        'Growing DHA Phase 9 development',
        'Nearby infrastructure projects',
        'High demand for residential plots'
      ],
      threats: [
        'Market price volatility',
        'Regulatory changes'
      ],
      recommendation: 'highly-recommended'
    },
    
    development: {
      zoningType: 'residential',
      buildingPermissions: ['Residential construction', 'Boundary wall'],
      developmentRestrictions: ['4-floor maximum', 'Setback requirements'],
      maxFloors: 4,
      maxCoverage: 70,
      farRatio: 2.8,
      potentialUnits: 8,
      estimatedDevelopmentCost: 150000000,
      estimatedRevenue: 480000000,
      estimatedProfit: 80000000
    },
    
    market: {
      comparablePrices: [
        {
          id: 'comp-1',
          location: 'DHA Phase 9, Sector B',
          area: 1000,
          price: 245000000,
          pricePerUnit: 245000,
          saleDate: '2024-01-10',
          similarity: 95,
          remarks: 'Similar corner plot, same sector'
        }
      ],
      marketTrend: 'rising',
      demandLevel: 'high',
      competitionLevel: 'medium',
      futureGrowthPotential: 'excellent',
      nearbyDevelopments: [
        {
          id: 'dev-1',
          name: 'DHA Commercial Center',
          type: 'commercial',
          distance: 500,
          status: 'under-construction',
          impact: 'positive',
          description: 'Major shopping mall and office complex'
        }
      ]
    },
    
    dueDiligence: {
      soilTest: {
        status: 'completed',
        results: 'Suitable for construction up to 5 floors',
        suitability: 'excellent'
      },
      surveyReport: {
        status: 'completed',
        discrepancies: []
      },
      environmentalClearance: {
        required: false,
        status: 'not-applicable'
      },
      utilityConnections: {
        electricity: 'available',
        water: 'available',
        gas: 'available',
        sewerage: 'available'
      }
    },
    
    process: {
      stage: 'negotiation',
      priority: 'high',
      assignedTo: ['developer-1', 'land-specialist-1'],
      keyDates: {
        scoutedDate: '2024-01-05',
        reviewDeadline: '2024-02-15',
        dueDiligenceDeadline: '2024-03-01',
        finalDecisionDate: '2024-03-15'
      },
      milestones: [
        {
          id: 'mile-1',
          title: 'Legal Verification Complete',
          description: 'Complete legal documentation review',
          dueDate: '2024-02-01',
          completedDate: '2024-01-28',
          status: 'completed',
          assignedTo: 'legal-team'
        },
        {
          id: 'mile-2',
          title: 'Price Negotiation',
          description: 'Negotiate final price with owner',
          dueDate: '2024-02-20',
          status: 'pending',
          assignedTo: 'negotiation-team'
        }
      ],
      nextActions: [
        'Finalize price negotiation',
        'Prepare purchase agreement',
        'Arrange financing'
      ],
      risks: [
        {
          id: 'risk-1',
          type: 'market',
          description: 'Property prices may decline due to economic conditions',
          impact: 'medium',
          probability: 'low',
          mitigation: 'Secure price lock for 30 days',
          status: 'monitoring',
          identifiedDate: '2024-01-10'
        }
      ]
    },
    
    stakeholders: {
      currentOwner: {
        name: 'Ahmed Ali Khan',
        contact: '+92-300-1234567',
        type: 'individual'
      },
      brokerAgent: {
        name: 'Real Estate Solutions',
        company: 'RES Properties',
        contact: '+92-321-7654321',
        commission: 1
      },
      legalAdviser: {
        name: 'Malik & Associates',
        firm: 'Legal Consultants',
        contact: '+92-21-34567890'
      }
    },
    
    documents: {
      titleDeed: 'title-deed-001.pdf',
      mutationCopy: 'mutation-001.pdf',
      khewatKhasra: 'khewat-001.pdf',
      jamabandi: 'jamabandi-001.pdf',
      noc: 'noc-dha-001.pdf',
      plans: ['layout-plan.pdf', 'boundary-plan.pdf'],
      photos: ['aerial-view.jpg', 'street-view.jpg'],
      reports: ['valuation-report.pdf', 'soil-test-report.pdf']
    },
    
    tags: ['dha', 'corner-plot', 'residential', 'prime-location'],
    notes: 'Excellent opportunity in prime DHA location. Owner motivated to sell.',
    internalRef: 'LA-2024-001',
    projectId: 'proj-1',
    createdBy: 'developer-1',
    assignedTo: ['developer-1', 'land-specialist-1'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
    lastReviewedAt: '2024-01-18',
    lastReviewedBy: 'developer-1'
  },
  
  {
    id: 'land-2',
    parcelName: 'Gulshan-e-Iqbal Block 15',
    description: 'Commercial plot on main University Road with high traffic and excellent business potential.',
    
    location: {
      address: 'Main University Road, Block 15',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75300',
      country: 'Pakistan',
      coordinates: { lat: 24.9265, lng: 67.1025 },
      landmarks: ['University of Karachi', 'Expo Center', 'Gulshan Chowrangi'],
      accessibility: {
        roadAccess: 'excellent',
        publicTransport: 'excellent',
        utilities: 'all-available'
      }
    },
    
    area: {
      totalArea: 2000,
      unit: 'sq-feet',
      usableArea: 1900,
      frontage: 40,
      depth: 50,
      shape: 'regular'
    },
    
    legal: {
      status: 'under-review',
      ownershipType: 'freehold',
      titleDeedStatus: 'pending',
      approvals: [],
      restrictions: [],
      easements: [],
      encumbrances: ['Minor utility easement on rear boundary']
    },
    
    financial: {
      askingPrice: 180000000, // 18 Crore PKR
      pricePerUnit: 90000, // Per sq ft
      valuationAmount: 175000000,
      marketValue: 178000000,
      stampDuty: 1800000,
      registrationCharges: 360000,
      totalCost: 182160000,
      paymentTerms: '50% advance, 50% on possession',
      brokerageRate: 2,
      brokerageAmount: 3600000
    },
    
    feasibility: {
      score: 72,
      factors: {
        location: 85,
        accessibility: 90,
        legalClearance: 60,
        marketPotential: 80,
        infrastructure: 75,
        priceValue: 70
      },
      strengths: [
        'Main University Road location',
        'High traffic area',
        'Commercial zoning approved',
        'Good infrastructure'
      ],
      weaknesses: [
        'Legal clearance pending',
        'Utility easement issue',
        'High initial investment'
      ],
      opportunities: [
        'Growing commercial activity',
        'University nearby ensures footfall',
        'Future metro line planned'
      ],
      threats: [
        'Traffic congestion issues',
        'Regulatory restrictions on commercial use'
      ],
      recommendation: 'conditional'
    },
    
    development: {
      zoningType: 'commercial',
      buildingPermissions: ['Commercial construction', 'Retail space'],
      developmentRestrictions: ['6-floor maximum', 'Parking requirements'],
      maxFloors: 6,
      maxCoverage: 80,
      farRatio: 4.8,
      potentialUnits: 12,
      estimatedDevelopmentCost: 240000000,
      estimatedRevenue: 600000000,
      estimatedProfit: 180000000
    },
    
    market: {
      comparablePrices: [
        {
          id: 'comp-2',
          location: 'University Road, Block 13',
          area: 2000,
          price: 170000000,
          pricePerUnit: 85000,
          saleDate: '2023-12-15',
          similarity: 80,
          remarks: 'Similar commercial plot, slightly less prime location'
        }
      ],
      marketTrend: 'stable',
      demandLevel: 'medium',
      competitionLevel: 'high',
      futureGrowthPotential: 'good',
      nearbyDevelopments: [
        {
          id: 'dev-2',
          name: 'University Metro Station',
          type: 'infrastructure',
          distance: 800,
          status: 'planned',
          impact: 'positive',
          description: 'Planned metro station to increase accessibility'
        }
      ]
    },
    
    dueDiligence: {
      soilTest: {
        status: 'pending',
        suitability: 'good'
      },
      surveyReport: {
        status: 'pending'
      },
      environmentalClearance: {
        required: true,
        status: 'pending'
      },
      utilityConnections: {
        electricity: 'available',
        water: 'available',
        gas: 'nearby',
        sewerage: 'available'
      }
    },
    
    process: {
      stage: 'detailed-analysis',
      priority: 'medium',
      assignedTo: ['developer-1', 'commercial-specialist-1'],
      keyDates: {
        scoutedDate: '2024-01-10',
        reviewDeadline: '2024-02-25',
        dueDiligenceDeadline: '2024-03-15',
        finalDecisionDate: '2024-04-01'
      },
      milestones: [
        {
          id: 'mile-3',
          title: 'Legal Documentation Review',
          description: 'Complete legal verification and title clearance',
          dueDate: '2024-02-15',
          status: 'pending',
          assignedTo: 'legal-team'
        }
      ],
      nextActions: [
        'Complete legal verification',
        'Resolve utility easement issue',
        'Conduct soil testing'
      ],
      risks: [
        {
          id: 'risk-2',
          type: 'legal',
          description: 'Utility easement may affect development plans',
          impact: 'medium',
          probability: 'medium',
          mitigation: 'Negotiate easement modification with utility company',
          status: 'identified',
          identifiedDate: '2024-01-12'
        }
      ]
    },
    
    stakeholders: {
      currentOwner: {
        name: 'Gulshan Properties Ltd',
        contact: '+92-21-34123456',
        type: 'company'
      },
      brokerAgent: {
        name: 'Commercial Realty',
        company: 'CR Pakistan',
        contact: '+92-300-9876543',
        commission: 2
      }
    },
    
    documents: {
      titleDeed: 'title-deed-002.pdf',
      khewatKhasra: 'khewat-002.pdf',
      photos: ['front-view.jpg', 'road-view.jpg'],
      reports: ['initial-survey.pdf']
    },
    
    tags: ['commercial', 'university-road', 'high-traffic', 'retail'],
    notes: 'Good commercial potential but legal issues need resolution before proceeding.',
    internalRef: 'LA-2024-002',
    createdBy: 'developer-1',
    assignedTo: ['developer-1', 'commercial-specialist-1'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    lastReviewedAt: '2024-01-15',
    lastReviewedBy: 'commercial-specialist-1'
  },
  
  {
    id: 'land-3',
    parcelName: 'North Nazimabad Industrial Plot',
    description: 'Industrial land suitable for warehouse and manufacturing facility development.',
    
    location: {
      address: 'Sector 7-D, North Nazimabad',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '74700',
      country: 'Pakistan',
      coordinates: { lat: 24.9341, lng: 67.0648 },
      landmarks: ['Civic Center', 'Nagan Chowrangi', 'Industrial Area'],
      accessibility: {
        roadAccess: 'good',
        publicTransport: 'fair',
        utilities: 'partial'
      }
    },
    
    area: {
      totalArea: 5,
      unit: 'acres',
      usableArea: 4.8,
      frontage: 200,
      depth: 300,
      shape: 'regular'
    },
    
    legal: {
      status: 'pending',
      ownershipType: 'freehold',
      titleDeedStatus: 'clear',
      approvals: [],
      restrictions: ['Industrial use only'],
      easements: [],
      encumbrances: []
    },
    
    financial: {
      askingPrice: 500000000, // 50 Crore PKR
      pricePerUnit: 2500000, // Per acre
      valuationAmount: 480000000,
      marketValue: 490000000,
      stampDuty: 5000000,
      registrationCharges: 1000000,
      totalCost: 506000000,
      paymentTerms: '25% advance, 75% in 6 months',
      brokerageRate: 1.5,
      brokerageAmount: 7500000
    },
    
    feasibility: {
      score: 58,
      factors: {
        location: 70,
        accessibility: 60,
        legalClearance: 40,
        marketPotential: 65,
        infrastructure: 50,
        priceValue: 60
      },
      strengths: [
        'Large area suitable for industrial development',
        'Good road connectivity',
        'Industrial zoning approved'
      ],
      weaknesses: [
        'Limited utility connections',
        'Legal clearance pending',
        'Requires significant infrastructure investment'
      ],
      opportunities: [
        'Growing industrial demand',
        'Government incentives for manufacturing'
      ],
      threats: [
        'Environmental regulations',
        'Utility connection delays'
      ],
      recommendation: 'conditional'
    },
    
    development: {
      zoningType: 'industrial',
      buildingPermissions: ['Industrial construction', 'Warehouse'],
      developmentRestrictions: ['Environmental compliance required'],
      maxFloors: 3,
      maxCoverage: 60,
      farRatio: 1.8,
      estimatedDevelopmentCost: 800000000,
      estimatedRevenue: 1500000000,
      estimatedProfit: 200000000
    },
    
    market: {
      comparablePrices: [],
      marketTrend: 'stable',
      demandLevel: 'medium',
      competitionLevel: 'low',
      futureGrowthPotential: 'fair',
      nearbyDevelopments: []
    },
    
    dueDiligence: {
      soilTest: {
        status: 'not-required',
        suitability: 'good'
      },
      surveyReport: {
        status: 'not-required'
      },
      environmentalClearance: {
        required: true,
        status: 'pending'
      },
      utilityConnections: {
        electricity: 'nearby',
        water: 'distant',
        gas: 'not-available',
        sewerage: 'not-available'
      }
    },
    
    process: {
      stage: 'initial-review',
      priority: 'low',
      assignedTo: ['industrial-specialist-1'],
      keyDates: {
        scoutedDate: '2024-01-08',
        reviewDeadline: '2024-03-01',
        dueDiligenceDeadline: '2024-04-15',
        finalDecisionDate: '2024-05-01'
      },
      milestones: [],
      nextActions: [
        'Complete initial feasibility study',
        'Assess utility connection costs',
        'Environmental impact assessment'
      ],
      risks: [
        {
          id: 'risk-3',
          type: 'environmental',
          description: 'Environmental clearance may be difficult to obtain',
          impact: 'high',
          probability: 'medium',
          mitigation: 'Engage environmental consultants early',
          status: 'identified',
          identifiedDate: '2024-01-08'
        }
      ]
    },
    
    stakeholders: {
      currentOwner: {
        name: 'Industrial Holdings Pvt Ltd',
        contact: '+92-21-36789012',
        type: 'company'
      }
    },
    
    documents: {
      titleDeed: 'title-deed-003.pdf',
      photos: ['aerial-view-industrial.jpg']
    },
    
    tags: ['industrial', 'warehouse', 'manufacturing', 'large-area'],
    notes: 'Potential for industrial development but requires significant due diligence on environmental and utility aspects.',
    internalRef: 'LA-2024-003',
    createdBy: 'developer-1',
    assignedTo: ['industrial-specialist-1'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    lastReviewedAt: '2024-01-10',
    lastReviewedBy: 'industrial-specialist-1'
  }
];

// Initialize land parcels data if not exists
const initializeLandParcelsData = () => {
  try {
    const existingData = localStorage.getItem(LAND_PARCELS_KEY);
    if (!existingData || existingData === '[]') {
      localStorage.setItem(LAND_PARCELS_KEY, JSON.stringify(mockLandParcels));
      console.log('Initialized land parcels data with mock data');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing land parcels data:', error);
    return false;
  }
};

// Land Parcels CRUD Functions
export const getLandParcels = (userId?: string, userRole?: string): LandParcel[] => {
  try {
    initializeLandParcelsData();
    
    const parcels = JSON.parse(localStorage.getItem(LAND_PARCELS_KEY) || '[]');
    
    // Validate parcels array
    if (!Array.isArray(parcels)) {
      console.error('Land parcels data is not an array, returning empty array');
      return [];
    }
    
    // Filter out invalid parcel objects
    const validParcels = parcels.filter((p: any) => 
      p && p.id && p.parcelName && p.createdBy && Array.isArray(p.assignedTo)
    );
    
    if (userRole === 'admin' || userRole === 'super-admin') {
      return validParcels;
    }
    
    if (userId) {
      return validParcels.filter((p: LandParcel) => 
        p.createdBy === userId || p.assignedTo.includes(userId)
      );
    }
    
    return validParcels;
  } catch (error) {
    console.error('Error getting land parcels:', error);
    return [];
  }
};

export const getLandParcelById = (id: string): LandParcel | null => {
  try {
    const parcels = JSON.parse(localStorage.getItem(LAND_PARCELS_KEY) || '[]');
    return parcels.find((p: LandParcel) => p.id === id) || null;
  } catch (error) {
    console.error('Error getting land parcel by id:', error);
    return null;
  }
};

export const addLandParcel = (parcel: Omit<LandParcel, 'id' | 'createdAt' | 'updatedAt'>): LandParcel => {
  try {
    initializeLandParcelsData();
    const parcels = JSON.parse(localStorage.getItem(LAND_PARCELS_KEY) || '[]');
    const newParcel: LandParcel = {
      ...parcel,
      id: `land-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    parcels.push(newParcel);
    localStorage.setItem(LAND_PARCELS_KEY, JSON.stringify(parcels));
    return newParcel;
  } catch (error) {
    console.error('Error adding land parcel:', error);
    throw error;
  }
};

export const updateLandParcel = (id: string, updates: Partial<LandParcel>): LandParcel | null => {
  try {
    const parcels = JSON.parse(localStorage.getItem(LAND_PARCELS_KEY) || '[]');
    const index = parcels.findIndex((p: LandParcel) => p.id === id);
    
    if (index !== -1) {
      parcels[index] = {
        ...parcels[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem(LAND_PARCELS_KEY, JSON.stringify(parcels));
      return parcels[index];
    }
    
    return null;
  } catch (error) {
    console.error('Error updating land parcel:', error);
    return null;
  }
};

export const deleteLandParcel = (id: string): boolean => {
  try {
    const parcels = JSON.parse(localStorage.getItem(LAND_PARCELS_KEY) || '[]');
    const filteredParcels = parcels.filter((p: LandParcel) => p.id !== id);
    
    if (filteredParcels.length !== parcels.length) {
      localStorage.setItem(LAND_PARCELS_KEY, JSON.stringify(filteredParcels));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting land parcel:', error);
    return false;
  }
};

// Land Acquisition Statistics
export const getLandAcquisitionStats = (userId?: string, userRole?: string): LandAcquisitionStats => {
  try {
    const parcels = getLandParcels(userId, userRole);
    
    const stats: LandAcquisitionStats = {
      totalParcels: parcels.length,
      parcelsUnderReview: parcels.filter(p => 
        ['initial-review', 'detailed-analysis', 'due-diligence'].includes(p.process.stage)
      ).length,
      feasibilityPassed: parcels.filter(p => p.feasibility.score >= 60).length,
      dealsClosed: parcels.filter(p => p.process.stage === 'acquired').length,
      
      byStage: {
        scouting: parcels.filter(p => p.process.stage === 'scouting').length,
        initialReview: parcels.filter(p => p.process.stage === 'initial-review').length,
        detailedAnalysis: parcels.filter(p => p.process.stage === 'detailed-analysis').length,
        negotiation: parcels.filter(p => p.process.stage === 'negotiation').length,
        dueDiligence: parcels.filter(p => p.process.stage === 'due-diligence').length,
        finalization: parcels.filter(p => p.process.stage === 'finalization').length,
        acquired: parcels.filter(p => p.process.stage === 'acquired').length,
        rejected: parcels.filter(p => p.process.stage === 'rejected').length
      },
      
      byLegalStatus: {
        pending: parcels.filter(p => p.legal.status === 'pending').length,
        verified: parcels.filter(p => p.legal.status === 'verified').length,
        rejected: parcels.filter(p => p.legal.status === 'rejected').length,
        underReview: parcels.filter(p => p.legal.status === 'under-review').length,
        disputed: parcels.filter(p => p.legal.status === 'disputed').length
      },
      
      byFeasibilityScore: {
        excellent: parcels.filter(p => p.feasibility.score >= 80).length,
        good: parcels.filter(p => p.feasibility.score >= 60 && p.feasibility.score < 80).length,
        fair: parcels.filter(p => p.feasibility.score >= 40 && p.feasibility.score < 60).length,
        poor: parcels.filter(p => p.feasibility.score < 40).length
      },
      
      financial: {
        totalInvestment: parcels.reduce((sum, p) => sum + p.financial.totalCost, 0),
        averagePricePerUnit: parcels.length > 0 
          ? parcels.reduce((sum, p) => sum + p.financial.pricePerUnit, 0) / parcels.length 
          : 0,
        budgetUtilization: 0, // Would require budget data
        estimatedTotalValue: parcels.reduce((sum, p) => sum + (p.financial.marketValue || p.financial.askingPrice), 0)
      },
      
      timeline: {
        averageProcessingTime: 45, // Default average in days
        overdueMilestones: 0, // Would require milestone date calculations
        upcomingDeadlines: 0 // Would require deadline calculations
      }
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting land acquisition stats:', error);
    return {
      totalParcels: 0,
      parcelsUnderReview: 0,
      feasibilityPassed: 0,
      dealsClosed: 0,
      byStage: {
        scouting: 0,
        initialReview: 0,
        detailedAnalysis: 0,
        negotiation: 0,
        dueDiligence: 0,
        finalization: 0,
        acquired: 0,
        rejected: 0
      },
      byLegalStatus: {
        pending: 0,
        verified: 0,
        rejected: 0,
        underReview: 0,
        disputed: 0
      },
      byFeasibilityScore: {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0
      },
      financial: {
        totalInvestment: 0,
        averagePricePerUnit: 0,
        budgetUtilization: 0,
        estimatedTotalValue: 0
      },
      timeline: {
        averageProcessingTime: 0,
        overdueMilestones: 0,
        upcomingDeadlines: 0
      }
    };
  }
};

// Utility functions
export const calculateFeasibilityScore = (factors: LandParcel['feasibility']['factors']): number => {
  const weights = {
    location: 0.25,
    accessibility: 0.15,
    legalClearance: 0.20,
    marketPotential: 0.20,
    infrastructure: 0.10,
    priceValue: 0.10
  };
  
  return Math.round(
    factors.location * weights.location +
    factors.accessibility * weights.accessibility +
    factors.legalClearance * weights.legalClearance +
    factors.marketPotential * weights.marketPotential +
    factors.infrastructure * weights.infrastructure +
    factors.priceValue * weights.priceValue
  );
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'verified': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'under-review': 'bg-blue-100 text-blue-800',
    'rejected': 'bg-red-100 text-red-800',
    'disputed': 'bg-purple-100 text-purple-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getStageColor = (stage: string): string => {
  const stageColors: Record<string, string> = {
    'scouting': 'bg-gray-100 text-gray-800',
    'initial-review': 'bg-blue-100 text-blue-800',
    'detailed-analysis': 'bg-indigo-100 text-indigo-800',
    'negotiation': 'bg-orange-100 text-orange-800',
    'due-diligence': 'bg-purple-100 text-purple-800',
    'finalization': 'bg-green-100 text-green-800',
    'acquired': 'bg-emerald-100 text-emerald-800',
    'rejected': 'bg-red-100 text-red-800'
  };
  return stageColors[stage] || 'bg-gray-100 text-gray-800';
};

export const getFeasibilityScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};