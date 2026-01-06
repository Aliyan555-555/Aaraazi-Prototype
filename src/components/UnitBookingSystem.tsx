import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { 
  Plus,
  Search,
  Filter,
  Building2,
  Home,
  DollarSign,
  Users,
  Calendar,
  FileText,
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Bed,
  Bath,
  Car,
  Square
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { format } from 'date-fns';
import { User, Project } from '../types';
import { toast } from 'sonner';
import { formatPKR } from '../lib/currency';

interface Unit {
  id: string;
  projectId: string;
  unitNumber: string;
  unitType: 'apartment' | 'house' | 'commercial' | 'parking';
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  area: number; // sqft
  basePrice: number;
  currentPrice: number;
  status: 'available' | 'reserved' | 'sold' | 'under-construction' | 'handover-ready';
  description?: string;
  amenities: string[];
  facing?: 'north' | 'south' | 'east' | 'west' | 'corner';
  parkingSlots?: number;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  unitId: string;
  projectId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCNIC: string;
  bookingDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'cancelled' | 'defaulted';
  paymentSchedule: PaymentInstallment[];
  documents: BookingDocument[];
  notes: string;
  salesAgent: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentInstallment {
  id: string;
  bookingId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'cheque' | 'bank-transfer' | 'financing';
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  receiptNumber?: string;
  notes?: string;
}

interface BookingDocument {
  id: string;
  bookingId: string;
  name: string;
  type: 'contract' | 'payment-receipt' | 'id-copy' | 'bank-statement' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface UnitBookingSystemProps {
  user: User;
  project: Project;
  onNavigate: (page: string, data?: any) => void;
}

const UNIT_STATUS_CONFIG = {
  'available': { label: 'Available', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'reserved': { label: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'sold': { label: 'Sold', color: 'bg-blue-100 text-blue-800', icon: DollarSign },
  'under-construction': { label: 'Under Construction', color: 'bg-orange-100 text-orange-800', icon: Building2 },
  'handover-ready': { label: 'Handover Ready', color: 'bg-purple-100 text-purple-800', icon: Home }
};

const BOOKING_STATUS_CONFIG = {
  'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
  'completed': { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  'defaulted': { label: 'Defaulted', color: 'bg-gray-100 text-gray-800' }
};

const PAYMENT_STATUS_CONFIG = {
  'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'paid': { label: 'Paid', color: 'bg-green-100 text-green-800' },
  'overdue': { label: 'Overdue', color: 'bg-red-100 text-red-800' },
  'partial': { label: 'Partial', color: 'bg-orange-100 text-orange-800' }
};

export const UnitBookingSystem: React.FC<UnitBookingSystemProps> = ({ 
  user, 
  project,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [units, setUnits] = useState<Unit[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Unit form state
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Load data
  useEffect(() => {
    loadUnits();
    loadBookings();
  }, [project.id]);

  const loadUnits = () => {
    try {
      const storedUnits = JSON.parse(localStorage.getItem('project_units') || '[]');
      const projectUnits = storedUnits.filter((unit: Unit) => unit.projectId === project.id);
      setUnits(projectUnits);
    } catch (error) {
      console.error('Error loading units:', error);
      toast.error('Failed to load units');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookings = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('unit_bookings') || '[]');
      const projectBookings = storedBookings.filter((booking: Booking) => booking.projectId === project.id);
      setBookings(projectBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const saveUnit = (unitData: Partial<Unit>) => {
    try {
      const storedUnits = JSON.parse(localStorage.getItem('project_units') || '[]');
      
      if (editingUnit) {
        const updatedUnits = storedUnits.map((unit: Unit) =>
          unit.id === editingUnit.id ? { ...unit, ...unitData, updatedAt: new Date().toISOString() } : unit
        );
        localStorage.setItem('project_units', JSON.stringify(updatedUnits));
        toast.success('Unit updated successfully');
      } else {
        const newUnit: Unit = {
          id: `unit-${Date.now()}`,
          projectId: project.id,
          ...unitData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Unit;
        
        storedUnits.push(newUnit);
        localStorage.setItem('project_units', JSON.stringify(storedUnits));
        toast.success('Unit created successfully');
      }
      
      loadUnits();
      setShowUnitForm(false);
      setEditingUnit(null);
    } catch (error) {
      console.error('Error saving unit:', error);
      toast.error('Failed to save unit');
    }
  };

  const saveBooking = (bookingData: Partial<Booking>) => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('unit_bookings') || '[]');
      
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        projectId: project.id,
        salesAgent: user.id,
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Booking;
      
      storedBookings.push(newBooking);
      localStorage.setItem('unit_bookings', JSON.stringify(storedBookings));
      
      // Update unit status
      if (selectedUnit) {
        const storedUnits = JSON.parse(localStorage.getItem('project_units') || '[]');
        const updatedUnits = storedUnits.map((unit: Unit) =>
          unit.id === selectedUnit.id ? { ...unit, status: 'reserved', updatedAt: new Date().toISOString() } : unit
        );
        localStorage.setItem('project_units', JSON.stringify(updatedUnits));
      }
      
      loadUnits();
      loadBookings();
      setShowBookingForm(false);
      setSelectedUnit(null);
      toast.success('Booking created successfully');
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking');
    }
  };

  const getInventoryStats = () => {
    const total = units.length;
    const available = units.filter(u => u.status === 'available').length;
    const reserved = units.filter(u => u.status === 'reserved').length;
    const sold = units.filter(u => u.status === 'sold').length;
    const totalValue = units.reduce((sum, unit) => sum + unit.currentPrice, 0);
    const soldValue = units.filter(u => u.status === 'sold').reduce((sum, unit) => sum + unit.currentPrice, 0);
    
    return { total, available, reserved, sold, totalValue, soldValue };
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const active = bookings.filter(b => b.status === 'active').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const receivedAmount = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
    const pendingAmount = totalRevenue - receivedAmount;
    
    return { total, active, totalRevenue, receivedAmount, pendingAmount };
  };

  const inventoryStats = getInventoryStats();
  const bookingStats = getBookingStats();

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.unitType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderInventoryTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{inventoryStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{inventoryStats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{inventoryStats.sold}</p>
                <p className="text-sm text-muted-foreground">Sold Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(inventoryStats.totalValue / 1000000)}M</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(UNIT_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setShowUnitForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUnits.map(unit => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{unit.unitNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">{unit.unitType}</p>
                </div>
                <Badge className={UNIT_STATUS_CONFIG[unit.status].color}>
                  {UNIT_STATUS_CONFIG[unit.status].label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>{unit.area} sqft</span>
                </div>
                {unit.bedrooms && (
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bedrooms} BR</span>
                  </div>
                )}
                {unit.bathrooms && (
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.bathrooms} Bath</span>
                  </div>
                )}
                {unit.parkingSlots && (
                  <div className="flex items-center space-x-1">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{unit.parkingSlots} Parking</span>
                  </div>
                )}
              </div>
              
              <div className="text-center py-2 border-t border-b">
                <p className="text-2xl font-bold text-blue-600">{formatPKR(unit.currentPrice)}</p>
                <p className="text-xs text-muted-foreground">{formatPKR(Math.round(unit.currentPrice / unit.area))} per sqft</p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setEditingUnit(unit);
                    setShowUnitForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={unit.status === 'sold' || unit.status === 'reserved'}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setShowBookingForm(true);
                  }}
                >
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No units found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters to see more units.'
              : 'Start by adding units to your project inventory.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={() => setShowUnitForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Unit
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{bookingStats.active}</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(bookingStats.receivedAmount / 1000000)}M</p>
                <p className="text-sm text-muted-foreground">Received Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{formatPKR(bookingStats.pendingAmount / 1000000)}M</p>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => {
                  const unit = units.find(u => u.id === booking.unitId);
                  const paymentProgress = (booking.paidAmount / booking.totalAmount) * 100;
                  
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{unit?.unitNumber || 'Unknown'}</TableCell>
                      <TableCell>{formatPKR(booking.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{formatPKR(booking.paidAmount)}</div>
                          <Progress value={paymentProgress} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={BOOKING_STATUS_CONFIG[booking.status].color}>
                          {BOOKING_STATUS_CONFIG[booking.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Payment Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Generate Contract
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground">
                Bookings will appear here when customers book units.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unit Booking System</h1>
          <p className="text-muted-foreground">
            Manage unit inventory and customer bookings for {project.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory">Unit Inventory</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          <TabsTrigger value="reports">Sales Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          {renderInventoryTab()}
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          {renderBookingsTab()}
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Payment Tracking</h3>
                <p className="text-muted-foreground">
                  Track payment schedules and installments.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Sales Reports</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive sales and booking reports.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Unit Form Dialog */}
      <Dialog open={showUnitForm} onOpenChange={setShowUnitForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
            <DialogDescription>
              {editingUnit ? 'Update unit details' : 'Add a new unit to the project inventory'}
            </DialogDescription>
          </DialogHeader>
          <UnitFormContent 
            unit={editingUnit} 
            onSave={saveUnit} 
            onCancel={() => {
              setShowUnitForm(false);
              setEditingUnit(null);
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>
              Create a new booking for {selectedUnit?.unitNumber}
            </DialogDescription>
          </DialogHeader>
          <BookingFormContent 
            unit={selectedUnit} 
            onSave={saveBooking} 
            onCancel={() => {
              setShowBookingForm(false);
              setSelectedUnit(null);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Unit Form Component
const UnitFormContent: React.FC<{
  unit: Unit | null;
  onSave: (data: Partial<Unit>) => void;
  onCancel: () => void;
}> = ({ unit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    unitNumber: unit?.unitNumber || '',
    unitType: unit?.unitType || 'apartment',
    floor: unit?.floor || 1,
    bedrooms: unit?.bedrooms || 2,
    bathrooms: unit?.bathrooms || 2,
    area: unit?.area || 1000,
    basePrice: unit?.basePrice || 5000000,
    currentPrice: unit?.currentPrice || 5000000,
    status: unit?.status || 'available',
    description: unit?.description || '',
    amenities: unit?.amenities || [],
    facing: unit?.facing || 'north',
    parkingSlots: unit?.parkingSlots || 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number *</Label>
          <Input
            id="unitNumber"
            value={formData.unitNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
            placeholder="e.g., A-101"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type *</Label>
          <Select value={formData.unitType} onValueChange={(value) => setFormData(prev => ({ ...prev, unitType: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
            min="0"
            max="10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
            min="0"
            max="10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area (sqft) *</Label>
          <Input
            id="area"
            type="number"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: parseInt(e.target.value) || 0 }))}
            min="100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price (PKR) *</Label>
          <Input
            id="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }))}
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentPrice">Current Price (PKR) *</Label>
          <Input
            id="currentPrice"
            type="number"
            value={formData.currentPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: parseInt(e.target.value) || 0 }))}
            min="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Unit description and features..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {unit ? 'Update Unit' : 'Create Unit'}
        </Button>
      </div>
    </form>
  );
};

// Booking Form Component
const BookingFormContent: React.FC<{
  unit: Unit | null;
  onSave: (data: Partial<Booking>) => void;
  onCancel: () => void;
}> = ({ unit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCNIC: '',
    bookingDate: new Date().toISOString().split('T')[0],
    totalAmount: unit?.currentPrice || 0,
    paidAmount: 0,
    notes: '',
    paymentSchedule: [] as PaymentInstallment[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit) return;

    const bookingData: Partial<Booking> = {
      unitId: unit.id,
      ...formData,
      remainingAmount: formData.totalAmount - formData.paidAmount,
      status: 'active',
      documents: []
    };

    onSave(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone Number *</Label>
          <Input
            id="customerPhone"
            value={formData.customerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerCNIC">CNIC</Label>
          <Input
            id="customerCNIC"
            value={formData.customerCNIC}
            onChange={(e) => setFormData(prev => ({ ...prev, customerCNIC: e.target.value }))}
            placeholder="12345-1234567-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerAddress">Address</Label>
        <Textarea
          id="customerAddress"
          value={formData.customerAddress}
          onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Amount (PKR) *</Label>
          <Input
            id="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">Initial Payment (PKR)</Label>
          <Input
            id="paidAmount"
            type="number"
            value={formData.paidAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: parseInt(e.target.value) || 0 }))}
            min="0"
            max={formData.totalAmount}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional booking notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Booking
        </Button>
      </div>
    </form>
  );
};