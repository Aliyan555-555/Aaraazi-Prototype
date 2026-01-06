import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus,
  Building2,
  Target,
  Calculator,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ProjectAccountingModuleProps {
  userRole: 'admin' | 'agent';
}

export const ProjectAccountingModule: React.FC<ProjectAccountingModuleProps> = ({ userRole }) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'listing',
    estimatedBudget: '',
    estimatedRevenue: '',
    startDate: new Date().toISOString().split('T')[0],
    estimatedEndDate: ''
  });

  // Mock project data
  const projects = [
    {
      id: '1',
      name: 'Downtown Renovation Project',
      type: 'renovation',
      status: 'active',
      startDate: '2024-01-01',
      estimatedEndDate: '2024-03-15',
      budget: { total: 150000, spent: 89000, remaining: 61000, lastUpdated: '2024-01-10' },
      profitability: {
        estimatedRevenue: 200000,
        actualRevenue: 0,
        estimatedCosts: 150000,
        actualCosts: 89000,
        projectedProfit: 50000,
        actualProfit: -89000
      },
      milestones: [
        { name: 'Demolition', status: 'completed', dueDate: '2024-01-15', budgetAllocation: 25000, actualCost: 28000 },
        { name: 'Electrical Work', status: 'in-progress', dueDate: '2024-02-01', budgetAllocation: 35000, actualCost: 18000 },
        { name: 'Plumbing', status: 'pending', dueDate: '2024-02-15', budgetAllocation: 30000, actualCost: 0 },
        { name: 'Flooring', status: 'pending', dueDate: '2024-03-01', budgetAllocation: 40000, actualCost: 0 }
      ]
    },
    {
      id: '2',
      name: 'Luxury Listing Marketing Campaign',
      type: 'marketing',
      status: 'active',
      startDate: '2023-12-01',
      estimatedEndDate: '2024-02-29',
      budget: { total: 25000, spent: 18500, remaining: 6500, lastUpdated: '2024-01-08' },
      profitability: {
        estimatedRevenue: 75000,
        actualRevenue: 0,
        estimatedCosts: 25000,
        actualCosts: 18500,
        projectedProfit: 50000,
        actualProfit: -18500
      },
      milestones: [
        { name: 'Photography & Staging', status: 'completed', dueDate: '2023-12-15', budgetAllocation: 8000, actualCost: 8500 },
        { name: 'Digital Marketing', status: 'in-progress', dueDate: '2024-01-31', budgetAllocation: 12000, actualCost: 7000 },
        { name: 'Print Materials', status: 'completed', dueDate: '2024-01-10', budgetAllocation: 3000, actualCost: 3000 },
        { name: 'Event Marketing', status: 'pending', dueDate: '2024-02-15', budgetAllocation: 2000, actualCost: 0 }
      ]
    }
  ];

  const expenses = [
    { id: '1', projectId: '1', description: 'Demolition Services - ABC Construction', amount: 28000, category: 'Labor', date: '2024-01-12', status: 'paid' },
    { id: '2', projectId: '1', description: 'Electrical Materials - Supply Co', amount: 5500, category: 'Materials', date: '2024-01-15', status: 'paid' },
    { id: '3', projectId: '2', description: 'Professional Photography', amount: 3500, category: 'Marketing', date: '2023-12-10', status: 'paid' },
    { id: '4', projectId: '2', description: 'Staging Furniture Rental', amount: 5000, category: 'Marketing', date: '2023-12-12', status: 'paid' }
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would call an API
    console.log('Creating new project:', newProject);
    setShowNewProject(false);
    setNewProject({
      name: '',
      description: '',
      type: 'listing',
      estimatedBudget: '',
      estimatedRevenue: '',
      startDate: new Date().toISOString().split('T')[0],
      estimatedEndDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'planning': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'completed': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      'on-hold': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'in-progress': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      'overdue': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Project Accounting</h2>
          <p className="text-gray-600">Track project costs, budgets, and profitability</p>
        </div>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${projects.reduce((sum, p) => sum + p.budget.total, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-50">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${projects.reduce((sum, p) => sum + p.budget.spent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projected Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${projects.reduce((sum, p) => sum + p.profitability.projectedProfit, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget Used</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Projected Profit</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>${project.budget.spent.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">
                        ${project.budget.remaining.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600">
                        ${project.profitability.projectedProfit.toLocaleString()}
                      </TableCell>
                      <TableCell>{project.estimatedEndDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-600">Budget Performance</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Budget</span>
                      <span className="font-medium">${project.budget.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Spent</span>
                      <span className="font-medium text-red-600">${project.budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-medium text-green-600">${project.budget.remaining.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(project.budget.spent / project.budget.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {((project.budget.spent / project.budget.total) * 100).toFixed(1)}% of budget used
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg">{project.name} Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actual Cost</TableHead>
                      <TableHead>Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.milestones.map((milestone, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{milestone.name}</TableCell>
                        <TableCell>{milestone.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                        <TableCell>${milestone.budgetAllocation.toLocaleString()}</TableCell>
                        <TableCell>${milestone.actualCost.toLocaleString()}</TableCell>
                        <TableCell className={milestone.actualCost > milestone.budgetAllocation ? 'text-red-600' : 'text-green-600'}>
                          ${Math.abs(milestone.actualCost - milestone.budgetAllocation).toLocaleString()}
                          {milestone.actualCost > milestone.budgetAllocation ? ' over' : ' under'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => {
                    const project = projects.find(p => p.id === expense.projectId);
                    return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{project?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>${expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select 
                      value={newProject.type} 
                      onValueChange={(value) => setNewProject(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="listing">Property Listing</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="marketing">Marketing Campaign</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="acquisition">Property Acquisition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief project description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                    <Input
                      id="estimatedBudget"
                      type="number"
                      value={newProject.estimatedBudget}
                      onChange={(e) => setNewProject(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedRevenue">Estimated Revenue</Label>
                    <Input
                      id="estimatedRevenue"
                      type="number"
                      value={newProject.estimatedRevenue}
                      onChange={(e) => setNewProject(prev => ({ ...prev, estimatedRevenue: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                    <Input
                      id="estimatedEndDate"
                      type="date"
                      value={newProject.estimatedEndDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, estimatedEndDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewProject(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};