import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  RefreshCw,
  Layers,
  Building,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { User, LandParcel } from '../types';
import { getLandParcels, getLandAcquisitionStats, getStatusColor, getStageColor, getFeasibilityScoreColor } from '../lib/landAcquisition';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

interface LandAcquisitionDashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export const LandAcquisitionDashboard: React.FC<LandAcquisitionDashboardProps> = ({
  user,
  onNavigate
}) => {
  const [landParcels, setLandParcels] = useState<LandParcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<LandParcel[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedView, setSelectedView] = useState<'table' | 'map'>('table');

  useEffect(() => {
    loadData();
  }, [user.id, user.role]);

  useEffect(() => {
    filterParcels();
  }, [landParcels, searchTerm, stageFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const parcelsData = getLandParcels(user.id, user.role);
      const statsData = getLandAcquisitionStats(user.id, user.role);
      
      setLandParcels(parcelsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading land acquisition data:', error);
      toast.error('Failed to load land acquisition data');
    } finally {
      setLoading(false);
    }
  };

  const filterParcels = () => {
    let filtered = landParcels;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(parcel =>
        parcel.parcelName.toLowerCase().includes(term) ||
        parcel.location.city.toLowerCase().includes(term) ||
        parcel.location.address.toLowerCase().includes(term) ||
        parcel.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.process.stage === stageFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.legal.status === statusFilter);
    }

    setFilteredParcels(filtered);
  };

  const handleViewParcel = (parcel: LandParcel) => {
    onNavigate('land-parcel-detail', parcel);
  };

  const handleEditParcel = (parcel: LandParcel) => {
    onNavigate('edit-land-parcel', parcel);
  };

  const handleAddNewParcel = () => {
    onNavigate('add-land-parcel');
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Data refreshed successfully');
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    toast.success('Export started - you will receive a download link shortly');
  };

  const getAreaDisplay = (parcel: LandParcel) => {
    const { totalArea, unit } = parcel.area;
    if (unit === 'acres') {
      return `${totalArea} acres`;
    } else if (unit === 'marla') {
      return `${totalArea} marla`;
    } else if (unit === 'kanal') {
      return `${totalArea} kanal`;
    }
    return `${totalArea.toLocaleString()} ${unit}`;
  };

  const KPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Parcels Scouted */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total Parcels Scouted</CardTitle>
          <Building className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{stats.totalParcels || 0}</div>
          <p className="text-xs text-blue-600 mt-1">
            +2 from last month
          </p>
        </CardContent>
      </Card>

      {/* Parcels Under Review */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Parcels Under Review</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{stats.parcelsUnderReview || 0}</div>
          <p className="text-xs text-orange-600 mt-1">
            {stats.totalParcels > 0 ? Math.round((stats.parcelsUnderReview / stats.totalParcels) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>

      {/* Feasibility Passed */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Feasibility Passed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.feasibilityPassed || 0}</div>
          <p className="text-xs text-green-600 mt-1">
            Score ≥60% threshold
          </p>
        </CardContent>
      </Card>

      {/* Deals Closed */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Deals Closed</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{stats.dealsClosed || 0}</div>
          <p className="text-xs text-purple-600 mt-1">
            {formatPKR(stats.financial?.totalInvestment || 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const FilterControls = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
      {/* Search */}
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, city, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Stage Filter */}
      <div className="min-w-48">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="scouting">Scouting</SelectItem>
            <SelectItem value="initial-review">Initial Review</SelectItem>
            <SelectItem value="detailed-analysis">Detailed Analysis</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="due-diligence">Due Diligence</SelectItem>
            <SelectItem value="finalization">Finalization</SelectItem>
            <SelectItem value="acquired">Acquired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="min-w-48">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Filter by legal status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={selectedView === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('table')}
          className="px-3"
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant={selectedView === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('map')}
          className="px-3"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const DataTable = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Land Parcels</CardTitle>
            <CardDescription>
              {filteredParcels.length} of {landParcels.length} parcels
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddNewParcel} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Land Parcel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[200px] font-medium text-gray-900">Parcel Name</TableHead>
                <TableHead className="w-[120px] font-medium text-gray-900">City</TableHead>
                <TableHead className="w-[140px] font-medium text-gray-900">Area</TableHead>
                <TableHead className="w-[120px] font-medium text-gray-900">Legal Status</TableHead>
                <TableHead className="w-[120px] font-medium text-gray-900">Feasibility Score</TableHead>
                <TableHead className="w-[140px] font-medium text-gray-900">Stage</TableHead>
                <TableHead className="w-[140px] font-medium text-gray-900">Price</TableHead>
                <TableHead className="w-[120px] font-medium text-gray-900">Priority</TableHead>
                <TableHead className="w-[100px] font-medium text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading land parcels...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredParcels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm || stageFilter !== 'all' || statusFilter !== 'all' 
                      ? 'No parcels found matching your filters'
                      : 'No land parcels found. Add your first parcel to get started.'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredParcels.map((parcel) => (
                  <TableRow key={parcel.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{parcel.parcelName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[180px]" title={parcel.location.address}>
                          {parcel.location.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{parcel.location.city}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{getAreaDisplay(parcel)}</div>
                        <div className="text-sm text-gray-500">{parcel.area.shape}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(parcel.legal.status)}>
                        {parcel.legal.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getFeasibilityScoreColor(parcel.feasibility.score)}`}>
                          {parcel.feasibility.score}%
                        </span>
                        <Progress 
                          value={parcel.feasibility.score} 
                          className="w-16 h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageColor(parcel.process.stage)}>
                        {parcel.process.stage.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{formatPKR(parcel.financial.askingPrice)}</div>
                        <div className="text-sm text-gray-500">{formatPKR(parcel.financial.pricePerUnit)}/unit</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={parcel.process.priority === 'high' ? 'destructive' : 
                                   parcel.process.priority === 'medium' ? 'default' : 'secondary'}>
                        {parcel.process.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewParcel(parcel)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditParcel(parcel)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const MapView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Land Parcels Map</CardTitle>
        <CardDescription>Geographic view of all land parcels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium mb-2">Interactive Map</h3>
            <p className="text-sm">Map integration would show parcel locations with markers</p>
            <p className="text-sm mt-1">Click on markers to view parcel details</p>
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Feasibility Passed (≥60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Under Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Negotiation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Acquired</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Land Acquisition</h1>
            <p className="text-gray-600 mt-1">
              Manage and track potential land deals for development projects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <FileCheck className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button onClick={handleAddNewParcel} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Land Parcel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Filters */}
        <FilterControls />

        {/* Content Tabs */}
        <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'table' | 'map')}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <DataTable />
          </TabsContent>

          <TabsContent value="map">
            <MapView />
          </TabsContent>
        </Tabs>

        {/* Additional Summary Cards */}
        {filteredParcels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-medium">{formatPKR(stats.financial?.totalInvestment || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Price/Unit</span>
                    <span className="font-medium">{formatPKR(stats.financial?.averagePricePerUnit || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Value</span>
                    <span className="font-medium">{formatPKR(stats.financial?.estimatedTotalValue || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.byStage && Object.entries(stats.byStage).filter(([_, count]) => count > 0).map(([stage, count]) => (
                    <div key={stage} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{stage.replace('-', ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Legal Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Legal Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.byLegalStatus && Object.entries(stats.byLegalStatus).filter(([_, count]) => count > 0).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};