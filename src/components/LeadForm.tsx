import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { User, Contact } from '../types';
import { addLead, getProperties, getContacts } from '../lib/data';
import { formatCurrency } from '../lib/currency';
import { checkLeadDuplicates } from '../lib/phase3Enhancements';
import { ArrowLeft, UserPlus, AlertTriangle, Users, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface LeadFormProps {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ user, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    notes: '',
    propertyId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateLeads, setDuplicateLeads] = useState<any[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const properties = getProperties(user.id, user.role).filter(p => p.status === 'available');
  const contacts = getContacts(user.id, user.role);
  
  // Filter contacts for import dialog
  const filteredContacts = contacts.filter(contact => {
    if (!contactSearchTerm) return true;
    const searchLower = contactSearchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.phone.includes(contactSearchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower))
    );
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Check for duplicates when phone or email changes
    if (field === 'phone' || field === 'email') {
      // Debounce duplicate check
      setTimeout(() => {
        if ((field === 'phone' && value.length >= 10) || 
            (field === 'email' && value.includes('@'))) {
          const duplicates = checkLeadDuplicates(
            field === 'phone' ? value : formData.phone,
            field === 'email' ? value : (formData.email || undefined)
          );
          if (duplicates.length > 0) {
            setDuplicateLeads(duplicates);
          } else {
            setDuplicateLeads([]);
          }
        }
      }, 500);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[\+]?[0-9\-\(\)\s]{10,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    // Email validation (optional but if provided must be valid)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Source validation
    if (!formData.source) {
      newErrors.source = 'Lead source is required';
    }
    
    // Notes validation (optional but if provided, check length)
    if (formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const leadData = {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        notes: formData.notes.trim(),
        status: 'new' as const,
        agentId: user.id,
        propertyId: formData.propertyId && formData.propertyId !== 'none' ? formData.propertyId : undefined
      };

      const result = addLead(leadData);
      if (result) {
        onSuccess();
      } else {
        setErrors({ submit: 'Failed to add lead. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceOptions = [
    'Website',
    'Referral',
    'Social Media',
    'Walk-in',
    'Phone Call',
    'Email',
    'Advertisement',
    'Open House',
    'Other'
  ];

  // Import contact data into form
  const handleImportContact = (contact: Contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      source: contact.source || 'Existing Contact',
      notes: contact.notes || '',
      propertyId: contact.interestedProperties?.[0] || ''
    });
    setShowImportDialog(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-600">Capture and track a new potential client</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Lead Information
            </CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowImportDialog(true)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Import from Contacts
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+92 300 1234567"
                  required
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Duplicate Warning */}
            {duplicateLeads.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-yellow-900 mb-1">Potential Duplicate Lead Detected</h4>
                    <p className="text-sm text-yellow-800 mb-3">
                      Found {duplicateLeads.length} existing lead(s) with matching contact information:
                    </p>
                    <div className="space-y-2">
                      {duplicateLeads.map((dup, index) => (
                        <div key={index} className="bg-white rounded border border-yellow-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-900">{dup.name}</span>
                            <Badge className={
                              dup.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              dup.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                              dup.status === 'qualified' ? 'bg-green-100 text-green-800' :
                              dup.status === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {dup.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>📞 {dup.phone}</p>
                            {dup.email && <p>✉️ {dup.email}</p>}
                            {dup.source && <p>Source: {dup.source}</p>}
                            <p className="text-xs text-gray-500">
                              Created: {new Date(dup.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-yellow-800 mt-3">
                      ⚠️ You can still proceed, but consider updating the existing lead instead.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source*</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property">Related Property</Label>
                <Select value={formData.propertyId} onValueChange={(value) => handleInputChange('propertyId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific property</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {formatCurrency(property.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about the lead, their preferences, requirements, etc."
                rows={4}
                className={errors.notes ? 'border-red-500' : ''}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{errors.notes && <span className="text-red-600">{errors.notes}</span>}</span>
                <span>{formData.notes.length}/1000</span>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting || !formData.name || !formData.phone || !formData.source}
              >
                {isSubmitting ? 'Adding Lead...' : 'Add Lead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Import from Contacts Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Import from Contacts</DialogTitle>
            <DialogDescription>
              Select a contact to import their information into the lead form
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts by name, phone, or email..."
                value={contactSearchTerm}
                onChange={(e) => setContactSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No contacts found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <Card
                      key={contact.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleImportContact(contact)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{contact.name}</h4>
                              <Badge variant="outline">{contact.type}</Badge>
                              {contact.category && (
                                <Badge variant="secondary">{contact.category}</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </div>
                              {contact.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </div>
                              )}
                              {contact.source && (
                                <div className="text-xs text-gray-500">
                                  Source: {contact.source}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
