import { Project } from '../types';

const PROJECTS_KEY = 'developer_projects';

// Mock Projects Data for Initial Setup
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Emerald Heights Residency',
    description: 'Luxury residential project featuring 3 high-rise towers with premium apartments and penthouses, world-class amenities including swimming pool, gym, and community center.',
    type: 'residential',
    location: {
      address: 'Main Shahrah-e-Faisal, Block 4',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      zipCode: '75400'
    },
    status: 'construction',
    priority: 'high',
    budget: {
      totalBudget: 2500000000,
      spentBudget: 1250000000,
      allocatedBudget: 1800000000,
      remainingBudget: 1250000000,
      contingencyReserve: 250000000
    },
    revenue: {
      projectedRevenue: 3500000000,
      actualRevenue: 1200000000,
      revenueStreams: [
        {
          id: 'rev-1',
          type: 'unit-sales',
          description: 'Apartment sales - 180 units',
          projectedAmount: 2800000000,
          actualAmount: 1000000000,
          probability: 95,
          timing: 'ongoing'
        },
        {
          id: 'rev-2',
          type: 'commercial-leasing',
          description: 'Ground floor retail spaces',
          projectedAmount: 400000000,
          actualAmount: 150000000,
          probability: 85,
          timing: 'year-3'
        }
      ]
    },
    timeline: {
      startDate: '2023-03-15',
      estimatedEndDate: '2026-12-31',
      actualEndDate: null,
      currentPhase: 'phase-3',
      phases: [
        {
          id: 'phase-1',
          name: 'Planning & Approvals',
          description: 'Land acquisition, design finalization, and regulatory approvals',
          startDate: '2023-03-15',
          endDate: '2023-09-30',
          status: 'completed',
          progress: 100,
          budgetAllocation: 150000000,
          actualCost: 140000000,
          milestones: [
            {
              id: 'milestone-1',
              name: 'Land Acquisition',
              targetDate: '2023-05-15',
              actualDate: '2023-05-10',
              status: 'completed',
              description: 'Complete land purchase and documentation'
            },
            {
              id: 'milestone-2',
              name: 'NOC Approvals',
              targetDate: '2023-08-30',
              actualDate: '2023-09-15',
              status: 'completed',
              description: 'All regulatory approvals and NOCs'
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Foundation & Structure',
          description: 'Excavation, foundation work, and structural development',
          startDate: '2023-10-01',
          endDate: '2024-08-31',
          status: 'completed',
          progress: 100,
          budgetAllocation: 800000000,
          actualCost: 750000000,
          milestones: [
            {
              id: 'milestone-3',
              name: 'Foundation Complete',
              targetDate: '2024-02-28',
              actualDate: '2024-03-15',
              status: 'completed',
              description: 'All three towers foundation work'
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'MEP & Finishing',
          description: 'Mechanical, electrical, plumbing installation and interior finishing',
          startDate: '2024-09-01',
          endDate: '2025-12-31',
          status: 'in-progress',
          progress: 65,
          budgetAllocation: 900000000,
          actualCost: 360000000,
          milestones: [
            {
              id: 'milestone-5',
              name: 'MEP Rough-in',
              targetDate: '2025-03-31',
              actualDate: '2025-04-15',
              status: 'completed',
              description: 'All MEP rough installation'
            },
            {
              id: 'milestone-6',
              name: 'Interior Finishing',
              targetDate: '2025-10-31',
              actualDate: null,
              status: 'in-progress',
              description: 'Apartment finishing and common areas'
            }
          ]
        }
      ]
    },
    properties: {
      totalUnits: 180,
      soldUnits: 78,
      reservedUnits: 12,
      availableUnits: 90,
      unitTypes: [
        {
          type: '2-bedroom',
          count: 60,
          area: 1100,
          price: 12500000,
          sold: 35,
          reserved: 8
        },
        {
          type: '3-bedroom',
          count: 80,
          area: 1450,
          price: 16800000,
          sold: 32,
          reserved: 4
        },
        {
          type: 'penthouse',
          count: 40,
          area: 2200,
          price: 28000000,
          sold: 11,
          reserved: 0
        }
      ]
    },
    team: {
      projectManager: 'Asif Rahman',
      stakeholders: [
        {
          id: 'stake-1',
          name: 'Karachi Development Authority',
          role: 'regulatory-authority',
          influence: 'high',
          interest: 'high',
          communication: 'formal',
          contactPerson: 'Syed Ahmed Shah',
          email: 'syed.shah@kda.gov.pk',
          phone: '+92-21-99201234'
        }
      ],
      contractors: [
        {
          id: 'contractor-1',
          name: 'Allied Engineering',
          type: 'civil-contractor',
          company: 'Allied Engineering (Pvt) Ltd',
          services: ['structural-work', 'civil-construction'],
          contractValue: 800000000,
          status: 'active',
          performance: 'excellent',
          contactPerson: 'Engr. Saeed Khan',
          email: 'saeed@allied.com.pk',
          phone: '+92-300-1234567'
        }
      ]
    },
    documents: [
      {
        id: 'doc-1',
        name: 'Building Plans Approved',
        type: 'regulatory',
        category: 'approvals',
        url: '#',
        uploadedBy: 'admin',
        uploadedAt: '2023-08-15',
        isRequired: true,
        expiryDate: '2027-08-15'
      }
    ],
    tags: ['luxury', 'residential', 'high-rise', 'shahrah-faisal'],
    isActive: true,
    visibility: 'private',
    createdBy: 'developer-1',
    assignedTo: ['developer-1', 'super-admin-1'],
    createdAt: '2023-03-15',
    updatedAt: '2025-01-20'
  },
  {
    id: 'proj-2',
    name: 'Gulshan Trade Center',
    description: 'Modern commercial complex with office spaces, retail outlets, and food court. Strategic location in Gulshan-e-Iqbal with excellent connectivity.',
    type: 'commercial',
    location: {
      address: 'Block 13-C, Main University Road',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      zipCode: '75300'
    },
    status: 'sales',
    priority: 'medium',
    budget: {
      totalBudget: 800000000,
      spentBudget: 720000000,
      allocatedBudget: 800000000,
      remainingBudget: 80000000,
      contingencyReserve: 40000000
    },
    revenue: {
      projectedRevenue: 1200000000,
      actualRevenue: 650000000,
      revenueStreams: [
        {
          id: 'rev-4',
          type: 'office-sales',
          description: 'Office space sales',
          projectedAmount: 700000000,
          actualAmount: 400000000,
          probability: 90,
          timing: 'ongoing'
        }
      ]
    },
    timeline: {
      startDate: '2022-06-01',
      estimatedEndDate: '2025-03-31',
      actualEndDate: null,
      currentPhase: 'phase-4',
      phases: [
        {
          id: 'phase-1',
          name: 'Planning & Design',
          description: 'Concept development and architectural planning',
          startDate: '2022-06-01',
          endDate: '2022-12-31',
          status: 'completed',
          progress: 100,
          budgetAllocation: 80000000,
          actualCost: 75000000,
          milestones: []
        },
        {
          id: 'phase-2',
          name: 'Construction',
          description: 'Main construction and structural work',
          startDate: '2023-01-01',
          endDate: '2024-06-30',
          status: 'completed',
          progress: 100,
          budgetAllocation: 500000000,
          actualCost: 480000000,
          milestones: []
        },
        {
          id: 'phase-3',
          name: 'Finishing',
          description: 'Interior finishing and fit-out',
          startDate: '2024-07-01',
          endDate: '2024-12-31',
          status: 'completed',
          progress: 100,
          budgetAllocation: 180000000,
          actualCost: 165000000,
          milestones: []
        },
        {
          id: 'phase-4',
          name: 'Marketing & Sales',
          description: 'Sales and marketing activities',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          status: 'in-progress',
          progress: 80,
          budgetAllocation: 40000000,
          actualCost: 20000000,
          milestones: []
        }
      ]
    },
    properties: {
      totalUnits: 50,
      soldUnits: 35,
      reservedUnits: 5,
      availableUnits: 10,
      unitTypes: [
        {
          type: 'office-space',
          count: 30,
          area: 800,
          price: 18000000,
          sold: 25,
          reserved: 3
        },
        {
          type: 'retail-shop',
          count: 20,
          area: 400,
          price: 8000000,
          sold: 10,
          reserved: 2
        }
      ]
    },
    team: {
      projectManager: 'Sarah Ahmad',
      stakeholders: [
        {
          id: 'stake-3',
          name: 'Gulshan Town Committee',
          role: 'regulatory-authority',
          influence: 'medium',
          interest: 'high',
          communication: 'formal',
          contactPerson: 'Malik Riaz',
          email: 'malik.riaz@gulshan.gov.pk',
          phone: '+92-21-34567890'
        }
      ],
      contractors: [
        {
          id: 'contractor-3',
          name: 'Modern Construction',
          type: 'civil-contractor',
          company: 'Modern Construction Ltd',
          services: ['construction', 'finishing'],
          contractValue: 600000000,
          status: 'active',
          performance: 'good',
          contactPerson: 'Engr. Ahmed Khan',
          email: 'ahmed@modern.com.pk',
          phone: '+92-300-7654321'
        }
      ]
    },
    documents: [
      {
        id: 'doc-3',
        name: 'Commercial NOC',
        type: 'regulatory',
        category: 'approvals',
        url: '#',
        uploadedBy: 'admin',
        uploadedAt: '2022-08-15',
        isRequired: true,
        expiryDate: '2026-08-15'
      }
    ],
    tags: ['commercial', 'office', 'retail', 'gulshan'],
    isActive: true,
    visibility: 'private',
    createdBy: 'developer-1',
    assignedTo: ['developer-1', 'super-admin-1', 'agency-manager-1'],
    createdAt: '2022-06-01',
    updatedAt: '2025-01-20'
  },
  {
    id: 'proj-3',
    name: 'DHA Villas Phase 8',
    description: 'Premium residential villas in DHA Phase 8 with modern amenities, landscaped gardens, and 24/7 security.',
    type: 'residential',
    location: {
      address: 'Sector A, DHA Phase 8',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      zipCode: '75500'
    },
    status: 'planning',
    priority: 'high',
    budget: {
      totalBudget: 1500000000,
      spentBudget: 75000000,
      allocatedBudget: 300000000,
      remainingBudget: 1425000000,
      contingencyReserve: 150000000
    },
    revenue: {
      projectedRevenue: 2200000000,
      actualRevenue: 0,
      revenueStreams: [
        {
          id: 'rev-7',
          type: 'villa-sales',
          description: 'Luxury villa sales',
          projectedAmount: 2200000000,
          actualAmount: 0,
          probability: 90,
          timing: 'year-2'
        }
      ]
    },
    timeline: {
      startDate: '2025-01-01',
      estimatedEndDate: '2027-12-31',
      actualEndDate: null,
      currentPhase: 'phase-1',
      phases: [
        {
          id: 'phase-1',
          name: 'Planning & Approvals',
          description: 'Site planning, design, and regulatory approvals',
          startDate: '2025-01-01',
          endDate: '2025-06-30',
          status: 'in-progress',
          progress: 25,
          budgetAllocation: 100000000,
          actualCost: 25000000,
          milestones: [
            {
              id: 'milestone-9',
              name: 'Site Survey',
              targetDate: '2025-02-15',
              actualDate: null,
              status: 'in-progress',
              description: 'Complete topographical survey'
            }
          ]
        }
      ]
    },
    properties: {
      totalUnits: 25,
      soldUnits: 0,
      reservedUnits: 0,
      availableUnits: 25,
      unitTypes: [
        {
          type: '5-bedroom-villa',
          count: 15,
          area: 500,
          price: 85000000,
          sold: 0,
          reserved: 0
        },
        {
          type: '6-bedroom-villa',
          count: 10,
          area: 600,
          price: 110000000,
          sold: 0,
          reserved: 0
        }
      ]
    },
    team: {
      projectManager: 'Omar Hassan',
      stakeholders: [
        {
          id: 'stake-4',
          name: 'DHA Karachi',
          role: 'regulatory-authority',
          influence: 'high',
          interest: 'high',
          communication: 'formal',
          contactPerson: 'Brig. Ali Shah',
          email: 'ali.shah@dha.gov.pk',
          phone: '+92-21-35300000'
        }
      ],
      contractors: []
    },
    documents: [],
    tags: ['luxury', 'residential', 'villas', 'dha'],
    isActive: true,
    visibility: 'private',
    createdBy: 'developer-1',
    assignedTo: ['developer-1'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-20'
  }
];

// Initialize projects data if not exists
const initializeProjectsData = () => {
  try {
    const existingData = localStorage.getItem(PROJECTS_KEY);
    if (!existingData || existingData === '[]') {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
      console.log('Initialized projects data with mock projects');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing projects data:', error);
    return false;
  }
};

// Force reinitialize projects data (useful for updating user IDs)
export const forceReinitializeProjects = () => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
    console.log('Force reinitialized projects data with updated mock projects');
    return true;
  } catch (error) {
    console.error('Error force reinitializing projects data:', error);
    return false;
  }
};

// Projects CRUD Functions
export const getProjects = (userId?: string, userRole?: string): Project[] => {
  try {
    // Always try to initialize projects data on first access
    let initialized = initializeProjectsData();
    
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    
    // Validate projects array
    if (!Array.isArray(projects)) {
      console.error('Projects data is not an array, returning empty array');
      return [];
    }
    
    // Filter out invalid project objects
    const validProjects = projects.filter((p: any) => 
      p && p.id && p.name && p.createdBy && Array.isArray(p.assignedTo)
    );
    
    if (userRole === 'admin') {
      return validProjects;
    }
    
    if (userId) {
      const userProjects = validProjects.filter((p: Project) => 
        p.createdBy === userId || p.assignedTo.includes(userId)
      );
      
      // If no projects found for user but projects exist, force reinitialize with correct user IDs
      if (userProjects.length === 0 && validProjects.length > 0 && !initialized) {
        console.log(`No projects found for user ${userId}, force reinitializing...`);
        forceReinitializeProjects();
        // Retry after reinitialization
        const newProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        const newValidProjects = newProjects.filter((p: any) => 
          p && p.id && p.name && p.createdBy && Array.isArray(p.assignedTo)
        );
        return newValidProjects.filter((p: Project) => 
          p.createdBy === userId || p.assignedTo.includes(userId)
        );
      }
      
      return userProjects;
    }
    
    return validProjects;
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

export const getProjectById = (id: string): Project | null => {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    return projects.find((p: Project) => p.id === id) || null;
  } catch (error) {
    console.error('Error getting project by id:', error);
    return null;
  }
};

export const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return newProject;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const index = projects.findIndex((p: Project) => p.id === id);
    
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return projects[index];
    }
    
    return null;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
};

export const deleteProject = (id: string): boolean => {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const filteredProjects = projects.filter((p: Project) => p.id !== id);
    
    if (filteredProjects.length !== projects.length) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Project Statistics
export const getProjectStats = (userId?: string, userRole?: string) => {
  try {
    const projects = getProjects(userId, userRole);
    
    const activeStatuses = ['planning', 'permitting', 'construction', 'sales'];
    const stats = {
      total: projects.length,
      active: projects.filter(p => activeStatuses.includes(p.status)).length,
      byStatus: {
        planning: projects.filter(p => p.status === 'planning').length,
        permitting: projects.filter(p => p.status === 'permitting').length,
        construction: projects.filter(p => p.status === 'construction').length,
        sales: projects.filter(p => p.status === 'sales').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on-hold').length
      },
      byPriority: {
        critical: projects.filter(p => p.priority === 'critical').length,
        high: projects.filter(p => p.priority === 'high').length,
        medium: projects.filter(p => p.priority === 'medium').length,
        low: projects.filter(p => p.priority === 'low').length
      },
      byType: {
        residential: projects.filter(p => p.type === 'residential').length,
        commercial: projects.filter(p => p.type === 'commercial').length,
        mixedUse: projects.filter(p => p.type === 'mixed-use').length,
        industrial: projects.filter(p => p.type === 'industrial').length,
        infrastructure: projects.filter(p => p.type === 'infrastructure').length
      },
      totalBudget: projects.reduce((sum, p) => sum + (p.budget?.totalBudget || 0), 0),
      totalRevenue: projects.reduce((sum, p) => sum + (p.revenue?.projectedRevenue || 0), 0),
      totalUnits: projects.reduce((sum, p) => sum + (p.properties?.totalUnits || 0), 0),
      soldUnits: projects.reduce((sum, p) => sum + (p.properties?.soldUnits || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting project stats:', error);
    return {
      total: 0,
      active: 0,
      byStatus: {},
      byPriority: {},
      byType: {},
      totalBudget: 0,
      totalRevenue: 0,
      totalUnits: 0,
      soldUnits: 0
    };
  }
};

// Timeline and milestone functions
export const updateMilestone = (projectId: string, phaseId: string, milestoneId: string, updates: any): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project) return false;
    
    const phase = project.timeline.phases.find(p => p.id === phaseId);
    if (!phase) return false;
    
    const milestone = phase.milestones.find(m => m.id === milestoneId);
    if (!milestone) return false;
    
    Object.assign(milestone, updates);
    
    return updateProject(projectId, { timeline: project.timeline }) !== null;
  } catch (error) {
    console.error('Error updating milestone:', error);
    return false;
  }
};

export const updatePhase = (projectId: string, phaseId: string, updates: any): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project) return false;
    
    const phase = project.timeline.phases.find(p => p.id === phaseId);
    if (!phase) return false;
    
    Object.assign(phase, updates);
    
    return updateProject(projectId, { timeline: project.timeline }) !== null;
  } catch (error) {
    console.error('Error updating phase:', error);
    return false;
  }
};

// Unit booking and sales functions
export const bookUnit = (projectId: string, unitType: string, customerData: any): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project || !project.properties) return false;
    
    const unitTypeData = project.properties.unitTypes.find(ut => ut.type === unitType);
    if (!unitTypeData || unitTypeData.reserved >= (unitTypeData.count - unitTypeData.sold)) {
      return false; // No available units
    }
    
    // Increase reserved count
    unitTypeData.reserved += 1;
    project.properties.reservedUnits += 1;
    project.properties.availableUnits -= 1;
    
    return updateProject(projectId, { properties: project.properties }) !== null;
  } catch (error) {
    console.error('Error booking unit:', error);
    return false;
  }
};

export const sellUnit = (projectId: string, unitType: string, customerData: any): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project || !project.properties) return false;
    
    const unitTypeData = project.properties.unitTypes.find(ut => ut.type === unitType);
    if (!unitTypeData || unitTypeData.sold >= unitTypeData.count) {
      return false; // No available units
    }
    
    // Check if it was reserved first
    if (unitTypeData.reserved > 0) {
      unitTypeData.reserved -= 1;
      project.properties.reservedUnits -= 1;
    } else {
      project.properties.availableUnits -= 1;
    }
    
    // Increase sold count
    unitTypeData.sold += 1;
    project.properties.soldUnits += 1;
    
    // Update actual revenue
    const unitPrice = unitTypeData.price;
    project.revenue.actualRevenue += unitPrice;
    
    return updateProject(projectId, { 
      properties: project.properties,
      revenue: project.revenue 
    }) !== null;
  } catch (error) {
    console.error('Error selling unit:', error);
    return false;
  }
};

// Budget and expense tracking
export const addProjectExpense = (projectId: string, amount: number, category: string, description: string): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project) return false;
    
    project.budget.spentBudget += amount;
    project.budget.remainingBudget = project.budget.totalBudget - project.budget.spentBudget;
    
    return updateProject(projectId, { budget: project.budget }) !== null;
  } catch (error) {
    console.error('Error adding project expense:', error);
    return false;
  }
};

// Document management
export const addProjectDocument = (projectId: string, document: any): boolean => {
  try {
    const project = getProjectById(projectId);
    if (!project) return false;
    
    const newDocument = {
      ...document,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    
    project.documents.push(newDocument);
    
    return updateProject(projectId, { documents: project.documents }) !== null;
  } catch (error) {
    console.error('Error adding project document:', error);
    return false;
  }
};