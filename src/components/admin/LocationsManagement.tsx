/**
 * LocationsManagement Component
 * Full admin interface for managing cities, areas, blocks, and buildings
 * 
 * FEATURES:
 * - Complete CRUD operations for all location entities
 * - Cascading deletes with validation
 * - Active/inactive status toggle
 * - Search and filtering
 * - Proper parent-child relationship management
 * - Stats and counts for better overview
 * - Seed data initialization for quick setup
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  MapPin,
  Building2,
  Map,
  Square,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { City, Area, Block, Building } from '../../types/locations';
import {
  getCities,
  getAreas,
  getBlocks,
  getBuildings,
  addCity,
  addArea,
  addBlock,
  addBuilding,
  updateCity,
  updateArea,
  updateBlock,
  updateBuilding,
  toggleCityStatus,
  toggleAreaStatus,
  toggleBlockStatus,
  toggleBuildingStatus,
  deleteCity,
  deleteArea,
  deleteBlock,
  deleteBuilding,
  getCityById,
  getAreaById,
  getBlockById
} from '../../lib/data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

interface LocationsManagementProps {
  saasAdminId: string;
}

type TabType = 'cities' | 'areas' | 'blocks' | 'buildings';

export const LocationsManagement: React.FC<LocationsManagementProps> = ({ saasAdminId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('cities');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [buildingDialogOpen, setBuildingDialogOpen] = useState(false);
  
  // Edit mode
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  
  // Load data
  const cities = getCities();
  const areas = getAreas();
  const blocks = getBlocks();
  const buildings = getBuildings();
  
  // Filter by search
  const filteredCities = useMemo(() => {
    if (!searchQuery) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cities, searchQuery]);
  
  const filteredAreas = useMemo(() => {
    if (!searchQuery) return areas;
    return areas.filter(area => 
      area.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [areas, searchQuery]);
  
  const filteredBlocks = useMemo(() => {
    if (!searchQuery) return blocks;
    return blocks.filter(block => 
      block.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blocks, searchQuery]);
  
  const filteredBuildings = useMemo(() => {
    if (!searchQuery) return buildings;
    return buildings.filter(building => 
      building.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [buildings, searchQuery]);
  
  // Count child entities
  const countAreasByCity = (cityId: string) => {
    return areas.filter(a => a.cityId === cityId).length;
  };
  
  const countBlocksByArea = (areaId: string) => {
    return blocks.filter(b => b.areaId === areaId).length;
  };
  
  const countBuildingsByArea = (areaId: string) => {
    return buildings.filter(b => b.areaId === areaId).length;
  };
  
  // Handlers
  const handleAddCity = () => {
    setEditingCity(null);
    setCityDialogOpen(true);
  };
  
  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setCityDialogOpen(true);
  };
  
  const handleToggleCityStatus = async (cityId: string) => {
    try {
      const result = toggleCityStatus(cityId);
      if (result) {
        toast.success(result.isActive ? 'City activated' : 'City deactivated');
      }
    } catch (error) {
      toast.error('Failed to toggle city status');
    }
  };
  
  const handleDeleteCity = async (cityId: string) => {
    try {
      const areasCount = countAreasByCity(cityId);
      if (areasCount > 0) {
        toast.error(`Cannot delete city with ${areasCount} areas`);
        return;
      }
      
      if (window.confirm('Are you sure you want to delete this city?')) {
        deleteCity(cityId);
        toast.success('City deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete city');
    }
  };
  
  const handleAddArea = () => {
    setEditingArea(null);
    setAreaDialogOpen(true);
  };
  
  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setAreaDialogOpen(true);
  };
  
  const handleToggleAreaStatus = async (areaId: string) => {
    try {
      const result = toggleAreaStatus(areaId);
      if (result) {
        toast.success(result.isActive ? 'Area activated' : 'Area deactivated');
      }
    } catch (error) {
      toast.error('Failed to toggle area status');
    }
  };
  
  const handleDeleteArea = async (areaId: string) => {
    try {
      const blocksCount = countBlocksByArea(areaId);
      const buildingsCount = countBuildingsByArea(areaId);
      
      if (blocksCount > 0 || buildingsCount > 0) {
        toast.error(`Cannot delete area with ${blocksCount} blocks and ${buildingsCount} buildings`);
        return;
      }
      
      if (window.confirm('Are you sure you want to delete this area?')) {
        deleteArea(areaId);
        toast.success('Area deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete area');
    }
  };
  
  const handleAddBlock = () => {
    setEditingBlock(null);
    setBlockDialogOpen(true);
  };
  
  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setBlockDialogOpen(true);
  };
  
  const handleToggleBlockStatus = async (blockId: string) => {
    try {
      const result = toggleBlockStatus(blockId);
      if (result) {
        toast.success(result.isActive ? 'Block activated' : 'Block deactivated');
      }
    } catch (error) {
      toast.error('Failed to toggle block status');
    }
  };
  
  const handleDeleteBlock = async (blockId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this block?')) {
        deleteBlock(blockId);
        toast.success('Block deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete block');
    }
  };
  
  const handleAddBuilding = () => {
    setEditingBuilding(null);
    setBuildingDialogOpen(true);
  };
  
  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setBuildingDialogOpen(true);
  };
  
  const handleToggleBuildingStatus = async (buildingId: string) => {
    try {
      const result = toggleBuildingStatus(buildingId);
      if (result) {
        toast.success(result.isActive ? 'Building activated' : 'Building deactivated');
      }
    } catch (error) {
      toast.error('Failed to toggle building status');
    }
  };
  
  const handleDeleteBuilding = async (buildingId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this building?')) {
        deleteBuilding(buildingId);
        toast.success('Building deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete building');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-1">Location Management</h1>
              <p className="text-gray-500">
                Manage cities, areas, blocks, and buildings for property addresses
              </p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="cities" className="gap-2">
                <MapPin className="h-4 w-4" />
                Cities ({cities.length})
              </TabsTrigger>
              <TabsTrigger value="areas" className="gap-2">
                <Map className="h-4 w-4" />
                Areas ({areas.length})
              </TabsTrigger>
              <TabsTrigger value="blocks" className="gap-2">
                <Square className="h-4 w-4" />
                Blocks ({blocks.length})
              </TabsTrigger>
              <TabsTrigger value="buildings" className="gap-2">
                <Building2 className="h-4 w-4" />
                Buildings ({buildings.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Add Button */}
            {activeTab === 'cities' && (
              <Button onClick={handleAddCity}>
                <Plus className="h-4 w-4 mr-2" />
                Add City
              </Button>
            )}
            {activeTab === 'areas' && (
              <Button onClick={handleAddArea}>
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
            )}
            {activeTab === 'blocks' && (
              <Button onClick={handleAddBlock}>
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            )}
            {activeTab === 'buildings' && (
              <Button onClick={handleAddBuilding}>
                <Plus className="h-4 w-4 mr-2" />
                Add Building
              </Button>
            )}
          </div>
          
          {/* Cities Tab */}
          <TabsContent value="cities" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200">
              {filteredCities.length === 0 ? (
                <div className="p-12 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 mb-2">No cities found</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchQuery ? 'Try a different search term' : 'Add your first city to get started'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleAddCity}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add City
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredCities.map((city) => (
                    <CityRow
                      key={city.id}
                      city={city}
                      areasCount={countAreasByCity(city.id)}
                      onEdit={() => handleEditCity(city)}
                      onToggleStatus={() => handleToggleCityStatus(city.id)}
                      onDelete={() => handleDeleteCity(city.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Areas Tab */}
          <TabsContent value="areas" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200">
              {filteredAreas.length === 0 ? (
                <div className="p-12 text-center">
                  <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 mb-2">No areas found</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchQuery ? 'Try a different search term' : 'Add your first area to get started'}
                  </p>
                  {!searchQuery && cities.length > 0 && (
                    <Button onClick={handleAddArea}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Area
                    </Button>
                  )}
                  {!searchQuery && cities.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      Please add a city first
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAreas.map((area) => (
                    <AreaRow
                      key={area.id}
                      area={area}
                      city={getCityById(area.cityId)}
                      blocksCount={countBlocksByArea(area.id)}
                      buildingsCount={countBuildingsByArea(area.id)}
                      onEdit={() => handleEditArea(area)}
                      onToggleStatus={() => handleToggleAreaStatus(area.id)}
                      onDelete={() => handleDeleteArea(area.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Blocks Tab */}
          <TabsContent value="blocks" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200">
              {filteredBlocks.length === 0 ? (
                <div className="p-12 text-center">
                  <Square className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 mb-2">No blocks found</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchQuery ? 'Try a different search term' : 'Add your first block to get started'}
                  </p>
                  {!searchQuery && areas.length > 0 && (
                    <Button onClick={handleAddBlock}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Block
                    </Button>
                  )}
                  {!searchQuery && areas.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      Please add an area first
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredBlocks.map((block) => (
                    <BlockRow
                      key={block.id}
                      block={block}
                      area={getAreaById(block.areaId)}
                      onEdit={() => handleEditBlock(block)}
                      onToggleStatus={() => handleToggleBlockStatus(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Buildings Tab */}
          <TabsContent value="buildings" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200">
              {filteredBuildings.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 mb-2">No buildings found</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchQuery ? 'Try a different search term' : 'Add your first building to get started'}
                  </p>
                  {!searchQuery && areas.length > 0 && (
                    <Button onClick={handleAddBuilding}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Building
                    </Button>
                  )}
                  {!searchQuery && areas.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      Please add an area first
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredBuildings.map((building) => (
                    <BuildingRow
                      key={building.id}
                      building={building}
                      area={getAreaById(building.areaId)}
                      block={building.blockId ? getBlockById(building.blockId) : null}
                      onEdit={() => handleEditBuilding(building)}
                      onToggleStatus={() => handleToggleBuildingStatus(building.id)}
                      onDelete={() => handleDeleteBuilding(building.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <CityDialog
        open={cityDialogOpen}
        onClose={() => {
          setCityDialogOpen(false);
          setEditingCity(null);
        }}
        city={editingCity}
        saasAdminId={saasAdminId}
      />
      
      <AreaDialog
        open={areaDialogOpen}
        onClose={() => {
          setAreaDialogOpen(false);
          setEditingArea(null);
        }}
        area={editingArea}
        cities={cities.filter(c => c.isActive)}
        saasAdminId={saasAdminId}
      />
      
      <BlockDialog
        open={blockDialogOpen}
        onClose={() => {
          setBlockDialogOpen(false);
          setEditingBlock(null);
        }}
        block={editingBlock}
        areas={areas.filter(a => a.isActive)}
        cities={cities}
        saasAdminId={saasAdminId}
      />
      
      <BuildingDialog
        open={buildingDialogOpen}
        onClose={() => {
          setBuildingDialogOpen(false);
          setEditingBuilding(null);
        }}
        building={editingBuilding}
        areas={areas.filter(a => a.isActive)}
        blocks={blocks.filter(b => b.isActive)}
        cities={cities}
        saasAdminId={saasAdminId}
      />
    </div>
  );
};

// ============================================================================
// Row Components
// ============================================================================

interface CityRowProps {
  city: City;
  areasCount: number;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const CityRow: React.FC<CityRowProps> = ({ city, areasCount, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={city.isActive ? 'text-gray-900' : 'text-gray-400'}>
                {city.name}
              </span>
              {!city.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {areasCount} {areasCount === 1 ? 'area' : 'areas'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className={city.isActive ? '' : 'text-green-600'}
          >
            {city.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={areasCount > 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AreaRowProps {
  area: Area;
  city: City | null;
  blocksCount: number;
  buildingsCount: number;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const AreaRow: React.FC<AreaRowProps> = ({ 
  area, 
  city, 
  blocksCount, 
  buildingsCount, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Map className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={area.isActive ? 'text-gray-900' : 'text-gray-400'}>
                {area.name}
              </span>
              {!area.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {city && (
                <>
                  <span>{city.name}</span>
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
              <span>
                {blocksCount} {blocksCount === 1 ? 'block' : 'blocks'}, {buildingsCount} {buildingsCount === 1 ? 'building' : 'buildings'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className={area.isActive ? '' : 'text-green-600'}
          >
            {area.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={blocksCount > 0 || buildingsCount > 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BlockRowProps {
  block: Block;
  area: Area | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const BlockRow: React.FC<BlockRowProps> = ({ block, area, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Square className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={block.isActive ? 'text-gray-900' : 'text-gray-400'}>
                {block.name}
              </span>
              {!block.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            {area && (
              <p className="text-sm text-gray-500">{area.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className={block.isActive ? '' : 'text-green-600'}
          >
            {block.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BuildingRowProps {
  building: Building;
  area: Area | null;
  block: Block | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const BuildingRow: React.FC<BuildingRowProps> = ({ 
  building, 
  area, 
  block, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}) => {
  const getBuildingTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'text-blue-600 bg-blue-50';
      case 'commercial': return 'text-green-600 bg-green-50';
      case 'mixed': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Building2 className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={building.isActive ? 'text-gray-900' : 'text-gray-400'}>
                {building.name}
              </span>
              <Badge className={`text-xs ${getBuildingTypeColor(building.type)}`}>
                {building.type}
              </Badge>
              {!building.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {area && (
                <>
                  <span>{area.name}</span>
                  {block && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span>{block.name}</span>
                    </>
                  )}
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
              <span>{building.totalFloors} floors</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleStatus}
            className={building.isActive ? '' : 'text-green-600'}
          >
            {building.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Dialog Components
// ============================================================================

interface CityDialogProps {
  open: boolean;
  onClose: () => void;
  city: City | null;
  saasAdminId: string;
}

const CityDialog: React.FC<CityDialogProps> = ({ open, onClose, city, saasAdminId }) => {
  const [name, setName] = useState(city?.name || '');
  const [isActive, setIsActive] = useState(city?.isActive ?? true);
  
  React.useEffect(() => {
    if (city) {
      setName(city.name);
      setIsActive(city.isActive);
    } else {
      setName('');
      setIsActive(true);
    }
  }, [city, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('City name is required');
      return;
    }
    
    try {
      if (city) {
        // Update existing
        updateCity(city.id, { name: name.trim(), isActive });
        toast.success('City updated successfully');
      } else {
        // Add new
        addCity({
          name: name.trim(),
          isActive,
          createdBy: saasAdminId
        });
        toast.success('City added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save city');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{city ? 'Edit City' : 'Add City'}</DialogTitle>
          <DialogDescription>
            {city ? 'Update city information' : 'Add a new city to the system'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cityName">City Name *</Label>
              <Input
                id="cityName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Karachi"
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cityActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="cityActive" className="cursor-pointer">
                Active (visible in property forms)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {city ? 'Update' : 'Add'} City
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface AreaDialogProps {
  open: boolean;
  onClose: () => void;
  area: Area | null;
  cities: City[];
  saasAdminId: string;
}

const AreaDialog: React.FC<AreaDialogProps> = ({ open, onClose, area, cities, saasAdminId }) => {
  const [name, setName] = useState(area?.name || '');
  const [cityId, setCityId] = useState(area?.cityId || '');
  const [isActive, setIsActive] = useState(area?.isActive ?? true);
  
  React.useEffect(() => {
    if (area) {
      setName(area.name);
      setCityId(area.cityId);
      setIsActive(area.isActive);
    } else {
      setName('');
      setCityId('');
      setIsActive(true);
    }
  }, [area, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Area name is required');
      return;
    }
    
    if (!cityId) {
      toast.error('Please select a city');
      return;
    }
    
    try {
      if (area) {
        // Update existing
        updateArea(area.id, { name: name.trim(), cityId, isActive });
        toast.success('Area updated successfully');
      } else {
        // Add new
        addArea({
          name: name.trim(),
          cityId,
          isActive,
          createdBy: saasAdminId
        });
        toast.success('Area added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save area');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{area ? 'Edit Area' : 'Add Area'}</DialogTitle>
          <DialogDescription>
            {area ? 'Update area information' : 'Add a new area to a city'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="areaCity">City *</Label>
              <Select value={cityId} onValueChange={setCityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cities.length === 0 && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please add a city first
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="areaName">Area Name *</Label>
              <Input
                id="areaName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., DHA Phase 8"
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="areaActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="areaActive" className="cursor-pointer">
                Active (visible in property forms)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={cities.length === 0}>
              {area ? 'Update' : 'Add'} Area
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface BlockDialogProps {
  open: boolean;
  onClose: () => void;
  block: Block | null;
  areas: Area[];
  cities: City[];
  saasAdminId: string;
}

const BlockDialog: React.FC<BlockDialogProps> = ({ 
  open, 
  onClose, 
  block, 
  areas, 
  cities,
  saasAdminId 
}) => {
  const [name, setName] = useState(block?.name || '');
  const [areaId, setAreaId] = useState(block?.areaId || '');
  const [isActive, setIsActive] = useState(block?.isActive ?? true);
  
  React.useEffect(() => {
    if (block) {
      setName(block.name);
      setAreaId(block.areaId);
      setIsActive(block.isActive);
    } else {
      setName('');
      setAreaId('');
      setIsActive(true);
    }
  }, [block, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Block name is required');
      return;
    }
    
    if (!areaId) {
      toast.error('Please select an area');
      return;
    }
    
    try {
      if (block) {
        // Update existing
        updateBlock(block.id, { name: name.trim(), areaId, isActive });
        toast.success('Block updated successfully');
      } else {
        // Add new
        addBlock({
          name: name.trim(),
          areaId,
          isActive,
          createdBy: saasAdminId
        });
        toast.success('Block added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save block');
    }
  };
  
  // Group areas by city
  const areasByCity = areas.reduce((acc, area) => {
    const city = cities.find(c => c.id === area.cityId);
    if (city) {
      if (!acc[city.name]) {
        acc[city.name] = [];
      }
      acc[city.name].push(area);
    }
    return acc;
  }, {} as Record<string, Area[]>);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{block ? 'Edit Block' : 'Add Block'}</DialogTitle>
          <DialogDescription>
            {block ? 'Update block information' : 'Add a new block to an area'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blockArea">Area *</Label>
              <Select value={areaId} onValueChange={setAreaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(areasByCity).map(([cityName, cityAreas]) => (
                    <React.Fragment key={cityName}>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
                        {cityName}
                      </div>
                      {cityAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              {areas.length === 0 && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please add an area first
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="blockName">Block Name *</Label>
              <Input
                id="blockName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Block A"
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="blockActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="blockActive" className="cursor-pointer">
                Active (visible in property forms)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={areas.length === 0}>
              {block ? 'Update' : 'Add'} Block
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface BuildingDialogProps {
  open: boolean;
  onClose: () => void;
  building: Building | null;
  areas: Area[];
  blocks: Block[];
  cities: City[];
  saasAdminId: string;
}

const BuildingDialog: React.FC<BuildingDialogProps> = ({ 
  open, 
  onClose, 
  building, 
  areas, 
  blocks,
  cities,
  saasAdminId 
}) => {
  const [name, setName] = useState(building?.name || '');
  const [areaId, setAreaId] = useState(building?.areaId || '');
  const [blockId, setBlockId] = useState(building?.blockId || '');
  const [type, setType] = useState<'residential' | 'commercial' | 'mixed'>(building?.type || 'residential');
  const [totalFloors, setTotalFloors] = useState(building?.totalFloors?.toString() || '');
  const [isActive, setIsActive] = useState(building?.isActive ?? true);
  
  React.useEffect(() => {
    if (building) {
      setName(building.name);
      setAreaId(building.areaId);
      setBlockId(building.blockId || '');
      setType(building.type);
      setTotalFloors(building.totalFloors.toString());
      setIsActive(building.isActive);
    } else {
      setName('');
      setAreaId('');
      setBlockId('');
      setType('residential');
      setTotalFloors('');
      setIsActive(true);
    }
  }, [building, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Building name is required');
      return;
    }
    
    if (!areaId) {
      toast.error('Please select an area');
      return;
    }
    
    if (!totalFloors || parseInt(totalFloors) <= 0) {
      toast.error('Please enter valid number of floors');
      return;
    }
    
    try {
      if (building) {
        // Update existing
        updateBuilding(building.id, { 
          name: name.trim(), 
          areaId, 
          blockId: blockId || undefined,
          type,
          totalFloors: parseInt(totalFloors),
          isActive 
        });
        toast.success('Building updated successfully');
      } else {
        // Add new
        addBuilding({
          name: name.trim(),
          areaId,
          blockId: blockId || undefined,
          type,
          totalFloors: parseInt(totalFloors),
          isActive,
          createdBy: saasAdminId
        });
        toast.success('Building added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save building');
    }
  };
  
  // Filter blocks by selected area
  const availableBlocks = areaId ? blocks.filter(b => b.areaId === areaId) : [];
  
  // Group areas by city
  const areasByCity = areas.reduce((acc, area) => {
    const city = cities.find(c => c.id === area.cityId);
    if (city) {
      if (!acc[city.name]) {
        acc[city.name] = [];
      }
      acc[city.name].push(area);
    }
    return acc;
  }, {} as Record<string, Area[]>);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{building ? 'Edit Building' : 'Add Building'}</DialogTitle>
          <DialogDescription>
            {building ? 'Update building information' : 'Add a new building to an area'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="buildingArea">Area *</Label>
              <Select 
                value={areaId || undefined} 
                onValueChange={(value) => {
                  setAreaId(value);
                  setBlockId(''); // Reset block when area changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(areasByCity).map(([cityName, cityAreas]) => (
                    <React.Fragment key={cityName}>
                      <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
                        {cityName}
                      </div>
                      {cityAreas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              {areas.length === 0 && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please add an area first
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="buildingBlock">Block (Optional)</Label>
              <Select 
                value={blockId || undefined} 
                onValueChange={(value) => setBlockId(value || '')} 
                disabled={!areaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select block (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableBlocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {blockId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-auto p-1 text-xs"
                  onClick={() => setBlockId('')}
                >
                  Clear block selection
                </Button>
              )}
            </div>
            
            <div>
              <Label htmlFor="buildingName">Building Name *</Label>
              <Input
                id="buildingName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Coral Tower"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="buildingType">Building Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="buildingFloors">Total Floors *</Label>
              <Input
                id="buildingFloors"
                type="number"
                min="1"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                placeholder="e.g., 15"
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="buildingActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="buildingActive" className="cursor-pointer">
                Active (visible in property forms)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={areas.length === 0}>
              {building ? 'Update' : 'Add'} Building
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};