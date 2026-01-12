/**
 * Edit Lead Modal
 * 
 * Dialog for editing existing lead details
 */

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Lead, LeadIntent, LeadTimeline, LeadSource } from '../../types/leads';
import { updateLead, getLeadById } from '../../lib/leads';
import { toast } from 'sonner';

interface EditLeadModalProps {
    open: boolean;
    onClose: () => void;
    leadId: string | null;
    onSuccess: () => void;
}

export function EditLeadModal({
    open,
    onClose,
    leadId,
    onSuccess
}: EditLeadModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        alternatePhone: '',
        source: '' as LeadSource,
        sourceDetails: '',
        campaign: '',
        referredBy: '',
        initialMessage: '',
        intent: 'unknown' as LeadIntent,
        timeline: 'unknown' as LeadTimeline,
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load lead data when modal opens
    useEffect(() => {
        if (open && leadId) {
            const lead = getLeadById(leadId);
            if (lead) {
                setFormData({
                    name: lead.name || '',
                    phone: lead.phone || '',
                    email: lead.email || '',
                    alternatePhone: lead.alternatePhone || '',
                    source: lead.source,
                    sourceDetails: lead.sourceDetails || '',
                    campaign: lead.campaign || '',
                    referredBy: lead.referredBy || '',
                    initialMessage: lead.initialMessage || '',
                    intent: lead.intent,
                    timeline: lead.timeline,
                    notes: lead.notes || '',
                });
            }
        }
    }, [open, leadId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId) return;

        setErrors({});

        // Simple validation
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.source) newErrors.source = 'Source is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            updateLead(leadId, {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || undefined,
                alternatePhone: formData.alternatePhone.trim() || undefined,
                source: formData.source,
                sourceDetails: formData.sourceDetails.trim() || undefined,
                campaign: formData.campaign.trim() || undefined,
                referredBy: formData.referredBy.trim() || undefined,
                initialMessage: formData.initialMessage.trim() || undefined,
                intent: formData.intent,
                timeline: formData.timeline,
                notes: formData.notes.trim(),
            });

            toast.success('Lead updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update lead:', error);
            toast.error('Failed to update lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription>
                        Update the lead's information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone *</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-alt-phone">Alternate Phone</Label>
                            <Input
                                id="edit-alt-phone"
                                value={formData.alternatePhone}
                                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-source">Source *</Label>
                        <Select
                            value={formData.source}
                            onValueChange={(value) => setFormData({ ...formData, source: value as LeadSource })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="phone-call">Phone Call</SelectItem>
                                <SelectItem value="walk-in">Walk-in</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="social-media">Social Media</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="olx">OLX</SelectItem>
                                <SelectItem value="zameen">Zameen</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-intent">Intent</Label>
                            <Select
                                value={formData.intent}
                                onValueChange={(value) => setFormData({ ...formData, intent: value as LeadIntent })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                    <SelectItem value="buying">Buying</SelectItem>
                                    <SelectItem value="selling">Selling</SelectItem>
                                    <SelectItem value="renting">Renting</SelectItem>
                                    <SelectItem value="leasing-out">Leasing Out</SelectItem>
                                    <SelectItem value="investing">Investing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-timeline">Timeline</Label>
                            <Select
                                value={formData.timeline}
                                onValueChange={(value) => setFormData({ ...formData, timeline: value as LeadTimeline })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                    <SelectItem value="immediate">Immediate</SelectItem>
                                    <SelectItem value="within-1-month">Within 1 Month</SelectItem>
                                    <SelectItem value="within-3-months">Within 3 Months</SelectItem>
                                    <SelectItem value="within-6-months">Within 6 Months</SelectItem>
                                    <SelectItem value="long-term">Long Term</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Internal Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
