import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { formatPKR } from '../lib/currency';
import { format, differenceInDays } from 'date-fns';
import { 
  AlertCircle, 
  Calendar, 
  Home, 
  User,
  ChevronRight
} from 'lucide-react';

interface LeaseExpiryWidgetProps {
  onPropertyClick: (property: Property) => void;
}

export function LeaseExpiryWidget({ onPropertyClick }: LeaseExpiryWidgetProps) {
  const [expiringLeases, setExpiringLeases] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpiringLeases();
  }, []);

  const loadExpiringLeases = () => {
    try {
      const stored = localStorage.getItem('estate_properties');
      if (!stored) {
        setExpiringLeases([]);
        setLoading(false);
        return;
      }

      const properties: Property[] = JSON.parse(stored);
      const today = new Date();
      
      // Find properties with leases expiring in the next 60 days
      const expiring = properties.filter(property => {
        if (property.listingType !== 'for-rent') return false;
        if (property.status !== 'rented') return false;
        if (!property.leaseExpirationDate) return false;

        const expiryDate = new Date(property.leaseExpirationDate);
        const daysUntilExpiry = differenceInDays(expiryDate, today);
        
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 60;
      });

      // Sort by expiration date (soonest first)
      expiring.sort((a, b) => {
        const dateA = new Date(a.leaseExpirationDate!);
        const dateB = new Date(b.leaseExpirationDate!);
        return dateA.getTime() - dateB.getTime();
      });

      setExpiringLeases(expiring);
      setLoading(false);
    } catch (error) {
      console.error('Error loading expiring leases:', error);
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (property: Property): number => {
    if (!property.leaseExpirationDate) return 0;
    const expiryDate = new Date(property.leaseExpirationDate);
    const today = new Date();
    return differenceInDays(expiryDate, today);
  };

  const getUrgencyBadge = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 7) {
      return <Badge className="bg-red-100 text-red-800">Urgent - {daysUntilExpiry} days</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge className="bg-amber-100 text-amber-800">Soon - {daysUntilExpiry} days</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">{daysUntilExpiry} days</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lease Expiration Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (expiringLeases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lease Expiration Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No leases expiring in the next 60 days</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Lease Expiration Alerts
          <Badge className="ml-auto">{expiringLeases.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-sm text-amber-900">
            {expiringLeases.length} {expiringLeases.length === 1 ? 'lease' : 'leases'} expiring soon. 
            Take action to renew or prepare for turnover.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {expiringLeases.slice(0, 5).map(property => {
            const daysUntilExpiry = getDaysUntilExpiry(property);
            
            return (
              <div
                key={property.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onPropertyClick(property)}
              >
                <Home className="h-8 w-8 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{property.title}</p>
                  <p className="text-sm text-gray-600 truncate">{property.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {formatPKR(property.monthlyRent || 0)}/month
                    </span>
                    {property.leaseExpirationDate && (
                      <span className="text-xs text-gray-500">
                        • Expires {format(new Date(property.leaseExpirationDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {getUrgencyBadge(daysUntilExpiry)}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {expiringLeases.length > 5 && (
          <p className="text-sm text-gray-600 text-center pt-2">
            And {expiringLeases.length - 5} more...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
