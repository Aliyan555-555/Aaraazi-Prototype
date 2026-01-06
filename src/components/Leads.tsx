import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Property, Lead, User } from '../types';
import { getLeads, updateLead, addLead, getProperties, getAllInteractions } from '../lib/data';
import { formatCurrency } from '../lib/currency';
import { saveOffer } from '../lib/offers';
import { createSingleCommission, calculateLeadScore, getLeadScore, saveLeadScore, processFollowUpRules } from '../lib/phase3Enhancements';
import { 
  Users, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Building,
  TrendingUp,
  Eye,
  Edit,
  MoreVertical,
  MapPin,
  DollarSign,
  Clock,
  User as UserIcon,
  Archive,
  X,
  Check,
  FileText,
  Flame,
  Zap,
  ThermometerSun
} from 'lucide-react';
import { toast } from 'sonner';

interface LeadsProps {
  user: User;
  onNavigate?: (page: string, data?: any) => void;
}

const LEAD_STATUSES = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800 border-blue-200', count: 0 },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', count: 0 },
  interested: { label: 'Interested', color: 'bg-green-100 text-green-800 border-green-200', count: 0 },
  'not-interested': { label: 'Not Interested', color: 'bg-red-100 text-red-800 border-red-200', count: 0 },
  converted: { label: 'Converted', color: 'bg-purple-100 text-purple-800 border-purple-200', count: 0 }
};

export const Leads: React.FC<LeadsProps> = ({ user, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    notes: '',
    propertyId: 'general'
  });
  
  // New states for enhanced features
  const [showInterestedDialog, setShowInterestedDialog] = useState(false);
  const [showConvertedDialog, setShowConvertedDialog] = useState(false);
  const [showLeadDetailDialog, setShowLeadDetailDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [offerData, setOfferData] = useState<Record<string, { amount: string; notes: string }>>({});
  const [conversionProperty, setConversionProperty] = useState('');
  const [conversionPrice, setConversionPrice] = useState('');

  const allLeads = useMemo(() => 
    getLeads(user.id, user.role), [user.id, user.role, refreshKey]
  );
  
  // Filter out archived leads by default
  const leads = useMemo(() => 
    showArchived ? allLeads : allLeads.filter(lead => !lead.isArchived),
    [allLeads, showArchived]
  );

  const properties = useMemo(() => 
    getProperties(user.id, user.role), [user.id, user.role]
  );

  // Auto-calculate lead scores on mount and when leads change
  React.useEffect(() => {
    // Load all interactions for scoring
    const allInteractions = getAllInteractions(user.id, user.role);
    
    allLeads.forEach(lead => {
      // Only calculate if score doesn't exist or is outdated
      const existingScore = getLeadScore(lead.id);
      const lastScored = lead.lastScoredAt;
      const needsUpdate = !existingScore || !lastScored || 
        new Date().getTime() - new Date(lastScored).getTime() > 24 * 60 * 60 * 1000;
      
      if (needsUpdate) {
        try {
          // Filter interactions for this lead's contact
          const leadInteractions = allInteractions.filter(i => 
            i.contactId === lead.id || i.contactId === `contact_from_lead_${lead.id}`
          );
          const score = calculateLeadScore(lead, leadInteractions, properties);
          // Use the saveLeadScore function which saves to the lead object
          saveLeadScore(lead.id, score);
        } catch (error) {
          console.error('Error calculating lead score:', error);
        }
      }
    });
  }, [allLeads, properties, user.id, user.role]);

  // Calculate lead counts by status
  const leadCounts = useMemo(() => {
    const counts = { ...LEAD_STATUSES };
    leads.forEach(lead => {
      if (counts[lead.status as keyof typeof counts]) {
        counts[lead.status as keyof typeof counts].count += 1;
      }
    });
    return counts;
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
      const matchesProperty = selectedProperty === 'all' || 
        lead.propertyId === selectedProperty ||
        (selectedProperty === 'general' && (!lead.propertyId || lead.propertyId === ''));
      
      return matchesSearch && matchesSource && matchesProperty;
    });
  }, [leads, searchTerm, selectedSource, selectedProperty]);

  // Group leads by status for pipeline view
  const leadsGroupedByStatus = useMemo(() => {
    const grouped: Record<string, Lead[]> = {};
    Object.keys(LEAD_STATUSES).forEach(status => {
      grouped[status] = filteredLeads.filter(lead => lead.status === status);
    });
    return grouped;
  }, [filteredLeads]);

  // Get unique sources
  const sources = useMemo(() => {
    const uniqueSources = [...new Set(leads.map(lead => lead.source))];
    return uniqueSources.filter(source => source && source.trim() !== '');
  }, [leads]);

  const handleStatusChange = (lead: Lead, newStatus: string) => {
    // When moving to "interested", show property selection dialog
    if (newStatus === 'interested') {
      setSelectedLead(lead);
      setShowInterestedDialog(true);
      return;
    }
    
    // When moving to "converted", show conversion dialog
    if (newStatus === 'converted') {
      setSelectedLead(lead);
      setShowConvertedDialog(true);
      return;
    }
    
    // For "not-interested", archive the lead
    if (newStatus === 'not-interested') {
      const updated = updateLead(lead.id, { 
        status: newStatus,
        isArchived: true,
        archivedAt: new Date().toISOString()
      });
      if (updated) {
        toast.success('Lead marked as not interested and archived');
        setRefreshKey(prev => prev + 1);
      }
      return;
    }
    
    // Regular status update
    const oldStatus = lead.status;
    const updated = updateLead(lead.id, { status: newStatus });
    if (updated) {
      toast.success(`Lead status updated to ${LEAD_STATUSES[newStatus as keyof typeof LEAD_STATUSES].label}`);
      
      // Process follow-up rules and create auto-tasks
      const createdTasks = processFollowUpRules(lead, oldStatus, newStatus, user.id, user.name);
      if (createdTasks.length > 0) {
        toast.success(`${createdTasks.length} follow-up task(s) created automatically`, {
          description: createdTasks.map(t => `• ${t.title}`).join('\n')
        });
      }
      
      setRefreshKey(prev => prev + 1);
    }
  };
  
  const handleInterestedSubmit = () => {
    if (!selectedLead || selectedProperties.length === 0) {
      toast.error('Please select at least one property');
      return;
    }
    
    // Save offers for selected properties
    selectedProperties.forEach(propertyId => {
      const offerInfo = offerData[propertyId] || { amount: '', notes: '' };
      if (offerInfo.amount && parseFloat(offerInfo.amount) > 0) {
        const offer = {
          id: `offer-${Date.now()}-${Math.random()}`,
          propertyId,
          buyerName: selectedLead.name,
          buyerContact: selectedLead.phone,
          buyerEmail: selectedLead.email || '',
          offerAmount: parseFloat(offerInfo.amount),
          dateReceived: new Date().toISOString().split('T')[0],
          status: 'active' as const,
          notes: offerInfo.notes || `Generated from lead: ${selectedLead.name}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveOffer(offer);
      }
    });
    
    // Update lead status and add interested properties
    const updated = updateLead(selectedLead.id, { 
      status: 'interested',
      interestedProperties: selectedProperties,
      updatedAt: new Date().toISOString()
    });
    
    if (updated) {
      toast.success(`Lead moved to Interested. ${selectedProperties.length} offer(s) logged.`);
      setShowInterestedDialog(false);
      setSelectedLead(null);
      setSelectedProperties([]);
      setOfferData({});
      setRefreshKey(prev => prev + 1);
    }
  };
  
  const handleConvertedSubmit = () => {
    if (!selectedLead || !conversionProperty || !conversionPrice) {
      toast.error('Please select a property and enter the final price');
      return;
    }
    
    const finalPrice = parseFloat(conversionPrice);
    if (finalPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    // Create the final offer
    const offer = {
      id: `offer-${Date.now()}-${Math.random()}`,
      propertyId: conversionProperty,
      buyerName: selectedLead.name,
      buyerContact: selectedLead.phone,
      buyerEmail: selectedLead.email || '',
      offerAmount: finalPrice,
      dateReceived: new Date().toISOString().split('T')[0],
      status: 'accepted' as const,
      notes: `Converted lead - Final sale price`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveOffer(offer);
    
    // Update lead status and archive it
    const updated = updateLead(selectedLead.id, { 
      status: 'converted',
      convertedPropertyId: conversionProperty,
      convertedAmount: finalPrice,
      convertedAt: new Date().toISOString(),
      isArchived: true,
      archivedAt: new Date().toISOString()
    });
    
    if (updated) {
      // Get property details for commission
      const property = properties.find(p => p.id === conversionProperty);
      const propertyTitle = property ? property.title : 'Unknown Property';
      const commissionRate = property?.commissionRate || 2; // Default 2% if not set
      
      // Create commission for the lead agent
      const commission = createSingleCommission(
        conversionProperty,
        propertyTitle,
        finalPrice,
        commissionRate,
        user.id,
        user.name,
        'full-payment'
      );
      
      if (commission) {
        toast.success(`Lead converted! Commission of ${formatCurrency(commission.amount)} created and pending approval.`);
      } else {
        toast.success(`Lead converted! Offer of ${formatCurrency(finalPrice)} logged for property.`);
      }
      
      setShowConvertedDialog(false);
      setSelectedLead(null);
      setConversionProperty('');
      setConversionPrice('');
      setRefreshKey(prev => prev + 1);
    }
  };
  
  const handleArchiveLead = (lead: Lead) => {
    const updated = updateLead(lead.id, { 
      isArchived: true,
      archivedAt: new Date().toISOString()
    });
    if (updated) {
      toast.success('Lead archived successfully');
      setRefreshKey(prev => prev + 1);
    }
  };
  
  const handleUnarchiveLead = (lead: Lead) => {
    const updated = updateLead(lead.id, { 
      isArchived: false,
      archivedAt: undefined
    });
    if (updated) {
      toast.success('Lead restored from archive');
      setRefreshKey(prev => prev + 1);
    }
  };
  
  const handleViewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetailDialog(true);
  };

  const handleAddLead = () => {
    // Validate required fields
    if (!newLead.name || newLead.name.trim().length < 2) {
      toast.error('Please enter a valid name (at least 2 characters)');
      return;
    }
    
    if (!newLead.phone || newLead.phone.trim().length === 0) {
      toast.error('Phone number is required');
      return;
    }
    
    // Validate phone number has enough digits
    const phoneDigits = newLead.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      toast.error('Please enter a valid phone number (7-15 digits). Example: 0300-1234567');
      return;
    }

    const leadData = {
      ...newLead,
      propertyId: newLead.propertyId === 'general' ? '' : newLead.propertyId,
      status: 'new' as const,
      agentId: user.id
    };

    const created = addLead(leadData);
    if (created) {
      toast.success('Lead added successfully');
      setNewLead({
        name: '',
        phone: '',
        email: '',
        source: '',
        notes: '',
        propertyId: 'general'
      });
      setShowNewLeadDialog(false);
      setRefreshKey(prev => prev + 1);
    } else {
      toast.error('Failed to add lead. Please check all fields and try again.');
    }
  };

  const getPropertyTitle = (propertyId?: string) => {
    if (!propertyId || propertyId === 'general') return 'General Inquiry';
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : 'Unknown Property';
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekAgo = thisWeek.toISOString().split('T')[0];

    const activeLeads = allLeads.filter(l => !l.isArchived);
    const archivedLeads = allLeads.filter(l => l.isArchived);
    
    return {
      total: activeLeads.length,
      archived: archivedLeads.length,
      newToday: activeLeads.filter(l => l.createdAt === today).length,
      newThisWeek: activeLeads.filter(l => l.createdAt >= weekAgo).length,
      converted: allLeads.filter(l => l.status === 'converted').length,
      conversionRate: allLeads.length > 0 ? ((allLeads.filter(l => l.status === 'converted').length / allLeads.length) * 100).toFixed(1) : '0'
    };
  }, [allLeads]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Manage and track your sales pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? `Archived (${stats.archived})` : 'Show Archived'}
          </Button>
          <Button
            variant={viewMode === 'pipeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('pipeline')}
          >
            Pipeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Enter the lead's information to add them to your pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Enter lead's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="e.g., 0300-1234567 or +92-300-1234567"
                    type="tel"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid phone number (7-15 digits)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <Input
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    placeholder="e.g., Website, Referral, Cold Call"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Interested Property</label>
                  <Select value={newLead.propertyId} onValueChange={(value) => setNewLead({ ...newLead, propertyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title} - {formatCurrency(property.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                    rows={3}
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewLeadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLead}>
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-50">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-50">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'pipeline' ? (
        <>
          {/* Desktop Pipeline View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-4">
                {Object.entries(LEAD_STATUSES).map(([status, config]) => (
                  <div key={status} className="flex-shrink-0 w-80">
                    <Card className="h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{config.label}</CardTitle>
                          <Badge variant="secondary" className="shrink-0">
                            {leadCounts[status as keyof typeof leadCounts].count}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="px-6 pb-6">
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {leadsGroupedByStatus[status]?.map((lead) => (
                              <div
                                key={lead.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm text-gray-900 truncate">{lead.name}</h4>
                                        {(() => {
                                          const storedScore = getLeadScore(lead.id);
                                          if (storedScore && storedScore.score >= 80) {
                                            return (
                                              <Badge className="bg-red-500 text-white gap-1 flex-shrink-0">
                                                <Flame className="h-3 w-3" />
                                                Hot
                                              </Badge>
                                            );
                                          } else if (storedScore && storedScore.score >= 60) {
                                            return (
                                              <Badge className="bg-orange-500 text-white gap-1 flex-shrink-0">
                                                <ThermometerSun className="h-3 w-3" />
                                                Warm
                                              </Badge>
                                            );
                                          } else if (storedScore && storedScore.score >= 40) {
                                            return (
                                              <Badge variant="outline" className="gap-1 flex-shrink-0">
                                                <Zap className="h-3 w-3" />
                                                {storedScore.score}
                                              </Badge>
                                            );
                                          }
                                          return null;
                                        })()}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                        <Phone className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{lead.phone}</span>
                                      </div>
                                      {lead.email && (
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                          <Mail className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">{lead.email}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleViewLeadDetails(lead)}
                                        title="View Details"
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      {!lead.isArchived && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0"
                                          onClick={() => handleArchiveLead(lead)}
                                          title="Archive Lead"
                                        >
                                          <Archive className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <Building className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{getPropertyTitle(lead.propertyId)}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <UserIcon className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{lead.source}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <Clock className="h-3 w-3 flex-shrink-0" />
                                      <span>{lead.createdAt}</span>
                                    </div>
                                  </div>

                                  {lead.notes && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{lead.notes}</p>
                                  )}

                                  {lead.isArchived ? (
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="flex-1 justify-center">
                                        <Archive className="h-3 w-3 mr-1" />
                                        Archived
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUnarchiveLead(lead)}
                                        className="h-8 text-xs"
                                      >
                                        Restore
                                      </Button>
                                    </div>
                                  ) : (
                                    <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead, value)}>
                                      <SelectTrigger className="h-8 text-xs w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(LEAD_STATUSES).map(([statusKey, statusConfig]) => (
                                          <SelectItem key={statusKey} value={statusKey}>
                                            {statusConfig.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            {leadsGroupedByStatus[status]?.length === 0 && (
                              <div className="text-center py-8 text-gray-500 text-sm">
                                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                  <p>No leads in this stage</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Pipeline View */}
          <div className="lg:hidden">
            <div className="space-y-6">
              {Object.entries(LEAD_STATUSES).map(([status, config]) => (
                <Card key={status}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{config.label}</CardTitle>
                      <Badge variant="secondary">
                        {leadCounts[status as keyof typeof leadCounts].count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leadsGroupedByStatus[status]?.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm text-gray-900">{lead.name}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {lead.phone}
                                  </div>
                                  {lead.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {lead.email}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span className="truncate">{getPropertyTitle(lead.propertyId)}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                {lead.source}
                              </div>

                              <div className="flex items-center gap-1 sm:col-span-2">
                                <Clock className="h-3 w-3" />
                                {lead.createdAt}
                              </div>
                            </div>

                            {lead.notes && (
                              <p className="text-xs text-gray-500">{lead.notes}</p>
                            )}

                            {lead.isArchived ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex-1 justify-center">
                                  <Archive className="h-3 w-3 mr-1" />
                                  Archived
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUnarchiveLead(lead)}
                                  className="h-8 text-xs"
                                >
                                  Restore
                                </Button>
                              </div>
                            ) : (
                              <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead, value)}>
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(LEAD_STATUSES).map(([statusKey, statusConfig]) => (
                                    <SelectItem key={statusKey} value={statusKey}>
                                      {statusConfig.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {leadsGroupedByStatus[status]?.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>No leads in this stage</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>Complete list of your leads with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No leads found matching your criteria</p>
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <Card key={lead.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {getPropertyTitle(lead.propertyId)}
                            </div>
                            <span>Source: {lead.source}</span>
                          </div>
                          {lead.notes && (
                            <p className="text-sm text-gray-500 mt-1">{lead.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLeadDetails(lead)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {lead.isArchived ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnarchiveLead(lead)}
                          >
                            Restore
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArchiveLead(lead)}
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead, value)}>
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(LEAD_STATUSES).map(([statusKey, statusConfig]) => (
                                  <SelectItem key={statusKey} value={statusKey}>
                                    {statusConfig.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </>
                        )}
                        <span className="text-xs text-gray-500">{lead.createdAt}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Interested Dialog - Property Selection & Offer Logging */}
      <Dialog open={showInterestedDialog} onOpenChange={setShowInterestedDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Interested Properties & Log Offers</DialogTitle>
            <DialogDescription>
              Choose properties that {selectedLead?.name} is interested in and optionally log offer amounts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {properties.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No properties available</p>
            ) : (
              <div className="space-y-3">
                {properties.map((property) => {
                  const isSelected = selectedProperties.includes(property.id);
                  const offerInfo = offerData[property.id] || { amount: '', notes: '' };
                  
                  return (
                    <div
                      key={property.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProperties([...selectedProperties, property.id]);
                            } else {
                              setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                              const newOfferData = { ...offerData };
                              delete newOfferData[property.id];
                              setOfferData(newOfferData);
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-medium">{property.title}</h4>
                            <p className="text-sm text-gray-600">{property.address}</p>
                            <p className="font-medium text-green-600 mt-1">{formatCurrency(property.price)}</p>
                          </div>
                          
                          {isSelected && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                              <div className="space-y-1">
                                <Label htmlFor={`offer-amount-${property.id}`}>Offer Amount (PKR)</Label>
                                <Input
                                  id={`offer-amount-${property.id}`}
                                  type="number"
                                  placeholder="Optional"
                                  value={offerInfo.amount}
                                  onChange={(e) => {
                                    setOfferData({
                                      ...offerData,
                                      [property.id]: { ...offerInfo, amount: e.target.value }
                                    });
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`offer-notes-${property.id}`}>Notes</Label>
                                <Input
                                  id={`offer-notes-${property.id}`}
                                  placeholder="Optional"
                                  value={offerInfo.notes}
                                  onChange={(e) => {
                                    setOfferData({
                                      ...offerData,
                                      [property.id]: { ...offerInfo, notes: e.target.value }
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowInterestedDialog(false);
              setSelectedLead(null);
              setSelectedProperties([]);
              setOfferData({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleInterestedSubmit} disabled={selectedProperties.length === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Interested ({selectedProperties.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Converted Dialog - Final Property & Price */}
      <Dialog open={showConvertedDialog} onOpenChange={setShowConvertedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead to Sale</DialogTitle>
            <DialogDescription>
              Select the property and enter the final agreed price for {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="conversion-property">Property*</Label>
              <Select value={conversionProperty} onValueChange={setConversionProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      <div className="flex flex-col">
                        <span>{property.title}</span>
                        <span className="text-xs text-gray-500">{formatCurrency(property.price)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversion-price">Final Sale Price (PKR)*</Label>
              <Input
                id="conversion-price"
                type="number"
                placeholder="0"
                value={conversionPrice}
                onChange={(e) => setConversionPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                This will be logged as an accepted offer in the property's offer ledger
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowConvertedDialog(false);
              setSelectedLead(null);
              setConversionProperty('');
              setConversionPrice('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleConvertedSubmit} disabled={!conversionProperty || !conversionPrice}>
              <Check className="h-4 w-4 mr-2" />
              Convert Lead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Lead Detail Dialog */}
      <Dialog open={showLeadDetailDialog} onOpenChange={setShowLeadDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              View complete information and history for this lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6 py-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600">Name</Label>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Phone</Label>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                  {selectedLead.email && (
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-600">Email</Label>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Lead Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">Status</Label>
                      <Badge className={LEAD_STATUSES[selectedLead.status as keyof typeof LEAD_STATUSES].color}>
                        {LEAD_STATUSES[selectedLead.status as keyof typeof LEAD_STATUSES].label}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Source</Label>
                      <p className="font-medium">{selectedLead.source}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Created Date</Label>
                      <p className="font-medium">{selectedLead.createdAt}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Property Interest</Label>
                      <p className="font-medium">{getPropertyTitle(selectedLead.propertyId)}</p>
                    </div>
                  </div>
                  
                  {selectedLead.notes && (
                    <div>
                      <Label className="text-xs text-gray-600">Notes</Label>
                      <p className="text-sm bg-gray-50 p-3 rounded border">{selectedLead.notes}</p>
                    </div>
                  )}
                  
                  {selectedLead.interestedProperties && selectedLead.interestedProperties.length > 0 && (
                    <div>
                      <Label className="text-xs text-gray-600">Interested Properties</Label>
                      <div className="space-y-2 mt-2">
                        {selectedLead.interestedProperties.map(propId => {
                          const prop = properties.find(p => p.id === propId);
                          return prop ? (
                            <div key={propId} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                              <span>{prop.title}</span>
                              <span className="text-sm text-gray-600">{formatCurrency(prop.price)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {selectedLead.status === 'converted' && selectedLead.convertedPropertyId && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <Label className="text-xs text-green-700">Converted Sale</Label>
                      <p className="font-medium text-green-900">
                        {properties.find(p => p.id === selectedLead.convertedPropertyId)?.title || 'Unknown Property'}
                      </p>
                      {selectedLead.convertedAmount && (
                        <p className="text-green-700 mt-1">
                          Final Price: {formatCurrency(selectedLead.convertedAmount)}
                        </p>
                      )}
                      {selectedLead.convertedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Converted on: {new Date(selectedLead.convertedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {selectedLead.isArchived && (
                    <div className="bg-gray-100 border border-gray-300 rounded p-3">
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4 text-gray-600" />
                        <Label className="text-xs text-gray-700">Archived</Label>
                      </div>
                      {selectedLead.archivedAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Archived on: {new Date(selectedLead.archivedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            {selectedLead && !selectedLead.isArchived && (
              <Button variant="outline" onClick={() => {
                handleArchiveLead(selectedLead);
                setShowLeadDetailDialog(false);
              }}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Lead
              </Button>
            )}
            {selectedLead && selectedLead.isArchived && (
              <Button variant="outline" onClick={() => {
                handleUnarchiveLead(selectedLead);
                setShowLeadDetailDialog(false);
              }}>
                Restore Lead
              </Button>
            )}
            <Button onClick={() => setShowLeadDetailDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};