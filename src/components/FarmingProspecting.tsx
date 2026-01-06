import React, { useState, useEffect, useMemo } from 'react';
import { User, Farm, Contact } from '../types';
import { getFarms, saveFarm, deleteFarm, getFarmAnalytics, initializeFarms, addContactsToFarm } from '../lib/farming';
import { formatPKR } from '../lib/currency';
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  TrendingUp, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  Activity,
  DollarSign,
  Percent,
  X,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface FarmingProspectingProps {
  user: User;
}

export function FarmingProspecting({ user }: FarmingProspectingProps) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'geographic' as 'geographic' | 'demographic' | 'custom',
    criteria: '',
    selectedContacts: [] as string[]
  });

  // Contact search for multi-select
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  useEffect(() => {
    initializeFarms(user.id);
    loadData();
  }, [user.id, user.role]);

  const loadData = () => {
    const farmsData = getFarms(user.id, user.role);
    setFarms(farmsData);
  };

  // Filter farms by search term
  const filteredFarms = useMemo(() => {
    if (!searchTerm) return farms;
    
    const term = searchTerm.toLowerCase();
    return farms.filter(farm => 
      farm.name.toLowerCase().includes(term) ||
      farm.criteria.toLowerCase().includes(term) ||
      farm.type.toLowerCase().includes(term)
    );
  }, [farms, searchTerm]);

  // Filter contacts for dropdown
  const filteredContacts = useMemo(() => {
    if (!contactSearchTerm) return contacts;
    
    const term = contactSearchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.phone?.toLowerCase().includes(term)
    );
  }, [contacts, contactSearchTerm]);

  const handleCreateFarm = () => {
    setFormData({
      name: '',
      type: 'geographic',
      criteria: '',
      selectedContacts: []
    });
    setShowCreateModal(true);
  };

  const handleSubmitFarm = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a farm name');
      return;
    }

    if (!formData.criteria.trim()) {
      toast.error('Please enter criteria or description');
      return;
    }

    setIsSubmitting(true);

    try {
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        criteria: formData.criteria,
        contactIds: formData.selectedContacts,
        agentId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activeProspects: 0,
        convertedProspects: 0,
        totalInteractions: 0
      };

      saveFarm(newFarm);
      loadData();
      setShowCreateModal(false);
      toast.success('Farm created successfully');
    } catch (error) {
      console.error('Error creating farm:', error);
      toast.error('Failed to create farm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setShowViewModal(true);
  };

  const handleDeleteFarm = (farmId: string) => {
    if (confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      try {
        deleteFarm(farmId);
        loadData();
        toast.success('Farm deleted successfully');
      } catch (error) {
        console.error('Error deleting farm:', error);
        toast.error('Failed to delete farm');
      }
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(contactId)
        ? prev.selectedContacts.filter(id => id !== contactId)
        : [...prev.selectedContacts, contactId]
    }));
  };

  const removeContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.filter(id => id !== contactId)
    }));
  };

  const getSelectedContactsDisplay = () => {
    return contacts.filter(c => formData.selectedContacts.includes(c.id));
  };

  const getFarmTypeColor = (type: string) => {
    switch (type) {
      case 'geographic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'demographic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'custom':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFarmTypeIcon = (type: string) => {
    switch (type) {
      case 'geographic':
        return <MapPin className="w-3 h-3" />;
      case 'demographic':
        return <Users className="w-3 h-3" />;
      case 'custom':
        return <Target className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">My Farms</h1>
              <p className="text-sm text-gray-600 mt-1">
                Organize and manage prospect lists by geography, demographics, or custom criteria
              </p>
            </div>
            <Button onClick={handleCreateFarm} className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Farm
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search farms by name, type, or criteria..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredFarms.length === 0 && !searchTerm ? (
          // Empty State
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Create your first prospect list</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Farms help you organize prospects by location, buyer profile, or custom criteria.
              Stay focused on your target markets and track your prospecting efforts.
            </p>
            <Button onClick={handleCreateFarm} className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Farm
            </Button>
          </div>
        ) : filteredFarms.length === 0 ? (
          // No Search Results
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No farms found matching your search.</p>
          </div>
        ) : (
          // Farm Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFarms.map(farm => {
              const analytics = getFarmAnalytics(farm, contacts);
              
              return (
                <Card key={farm.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-2">{farm.name}</CardTitle>
                        <Badge variant="outline" className={`${getFarmTypeColor(farm.type)} text-xs gap-1`}>
                          {getFarmTypeIcon(farm.type)}
                          {farm.type.charAt(0).toUpperCase() + farm.type.slice(1)}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewFarm(farm)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFarm(farm.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Farm
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Contact Count */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Contacts</span>
                      </div>
                      <span className="text-sm text-gray-900">{analytics.totalContacts}</span>
                    </div>

                    {/* Active Prospects */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                      <span className="text-sm text-gray-900">{analytics.activeProspects}</span>
                    </div>

                    {/* Conversion Rate */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Percent className="w-4 h-4" />
                        <span>Conversion</span>
                      </div>
                      <span className="text-sm text-gray-900">{analytics.conversionRate.toFixed(1)}%</span>
                    </div>

                    {/* Date Created */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <Calendar className="w-3 h-3" />
                      Created on: {new Date(farm.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    {/* View Button */}
                    <Button 
                      onClick={() => handleViewFarm(farm)} 
                      variant="outline" 
                      className="w-full mt-3"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Farm Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Farm</DialogTitle>
            <DialogDescription>
              Create a targeted prospect list based on geography, demographics, or custom criteria
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Farm Name */}
            <div>
              <Label htmlFor="farm-name" className="text-sm mb-2 block">
                Farm Name *
              </Label>
              <Input
                id="farm-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., DHA Phase 6 Prospects"
              />
            </div>

            {/* Farm Type */}
            <div>
              <Label htmlFor="farm-type" className="text-sm mb-2 block">
                Farm Type *
              </Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="farm-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geographic">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Geographic - Location-based prospects
                    </div>
                  </SelectItem>
                  <SelectItem value="demographic">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      Demographic - Profile-based prospects
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      Custom - Custom criteria
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Criteria */}
            <div>
              <Label htmlFor="criteria" className="text-sm mb-2 block">
                Description or Criteria *
              </Label>
              <Textarea
                id="criteria"
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                placeholder="Describe your target prospects, their interests, budget range, preferred locations, etc."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your targeting criteria to help you stay focused
              </p>
            </div>

            {/* Add Contacts */}
            <div>
              <Label className="text-sm mb-2 block">
                Add Contacts (Optional)
              </Label>
              
              {/* Selected Contacts */}
              {formData.selectedContacts.length > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      {formData.selectedContacts.length} contact(s) selected
                    </span>
                    <button
                      onClick={() => setFormData({ ...formData, selectedContacts: [] })}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedContactsDisplay().map(contact => (
                      <Badge key={contact.id} variant="secondary" className="gap-1 pr-1">
                        {contact.name}
                        <button
                          onClick={() => removeContact(contact.id)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Search Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <Input
                    value={contactSearchTerm}
                    onChange={(e) => setContactSearchTerm(e.target.value)}
                    onFocus={() => setShowContactDropdown(true)}
                    placeholder="Search contacts to add..."
                    className="pl-10"
                  />
                </div>

                {showContactDropdown && filteredContacts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredContacts.map(contact => {
                      const isSelected = formData.selectedContacts.includes(contact.id);
                      
                      return (
                        <div
                          key={contact.id}
                          onClick={() => toggleContactSelection(contact.id)}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-900">{contact.name}</div>
                              <div className="text-xs text-gray-500">
                                {contact.phone} {contact.email && `• ${contact.email}`}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {showContactDropdown && (
                <div className="text-right mt-2">
                  <button
                    onClick={() => setShowContactDropdown(false)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitFarm} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Farm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Farm Modal */}
      {selectedFarm && (
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle>{selectedFarm.name}</DialogTitle>
                  <Badge variant="outline" className={`${getFarmTypeColor(selectedFarm.type)} text-xs gap-1 mt-2`}>
                    {getFarmTypeIcon(selectedFarm.type)}
                    {selectedFarm.type.charAt(0).toUpperCase() + selectedFarm.type.slice(1)}
                  </Badge>
                </div>
              </div>
              <DialogDescription>
                View detailed information, performance metrics, and contacts for this farm
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Analytics Overview */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const analytics = getFarmAnalytics(selectedFarm, contacts);
                    return (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-700">Total Contacts</span>
                          </div>
                          <p className="text-xl text-gray-900">{analytics.totalContacts}</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700">Active Prospects</span>
                          </div>
                          <p className="text-xl text-gray-900">{analytics.activeProspects}</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-700">Converted</span>
                          </div>
                          <p className="text-xl text-gray-900">{analytics.convertedProspects}</p>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Percent className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-700">Conversion Rate</span>
                          </div>
                          <p className="text-xl text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Criteria */}
              <div>
                <h4 className="text-sm text-gray-900 mb-2">Targeting Criteria</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedFarm.criteria}</p>
                </div>
              </div>

              {/* Contacts in Farm */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">
                  Contacts in this Farm ({selectedFarm.contactIds.length})
                </h4>
                {selectedFarm.contactIds.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {contacts
                        .filter(c => selectedFarm.contactIds.includes(c.id))
                        .map(contact => (
                          <div key={contact.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-900">{contact.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {contact.phone} {contact.email && `• ${contact.email}`}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {contact.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {contact.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  {contact.totalTransactions} deal{contact.totalTransactions !== 1 ? 's' : ''}
                                </div>
                                {contact.totalCommissionEarned > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    {formatPKR(contact.totalCommissionEarned)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No contacts added to this farm yet</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(selectedFarm.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(selectedFarm.updatedAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}