import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Building2, Hammer, Users, TrendingUp, CheckCircle, Settings, ArrowRight } from 'lucide-react';
import { SaaSUser, Module } from '../types/saas';
import { getAvailableModules, hasModuleAccess } from '../lib/saas';
import { formatPKR } from '../lib/currency';

interface ModuleSelectorProps {
  user: SaaSUser;
  onModuleSelect: (moduleId: string) => void;
}

export function ModuleSelector({ user, onModuleSelect }: ModuleSelectorProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    const availableModules = getAvailableModules();
    setModules(availableModules);
    
    // Auto-select first available module if user has access
    if (user.moduleAccess.length > 0) {
      setSelectedModule(user.moduleAccess[0]);
    }
  }, [user.moduleAccess]);

  const agencyFeatures = [
    {
      icon: Building2,
      title: 'Property Management',
      description: 'Complete property listing and inventory management system',
      features: ['Property listings', 'Image galleries', 'Price tracking', 'Status management']
    },
    {
      icon: Users,
      title: 'Lead Management',
      description: 'Track and nurture potential clients through sales pipeline',
      features: ['Lead capture', 'Pipeline tracking', 'Follow-up automation', 'Conversion analytics']
    },
    {
      icon: TrendingUp,
      title: 'Commission Tracking',
      description: 'Monitor agent performance and commission payments',
      features: ['Commission calculation', 'Payout tracking', 'Agent analytics', 'Performance reports']
    },
    {
      icon: Settings,
      title: 'Agency Hub',
      description: 'Multi-agent dashboard and team management',
      features: ['Team dashboard', 'Sales analytics', 'Agent assignments', 'Performance metrics']
    }
  ];

  const developerFeatures = [
    {
      icon: Hammer,
      title: 'Project Management',
      description: 'Manage construction and development projects end-to-end',
      features: ['Project planning', 'Timeline tracking', 'Milestone management', 'Resource allocation']
    },
    {
      icon: TrendingUp,
      title: 'Project Accounting',
      description: 'Track project costs, budgets, and financial performance',
      features: ['Budget tracking', 'Cost management', 'Financial reports', 'Variance analysis']
    },
    {
      icon: Building2,
      title: 'Unit Booking System',
      description: 'Manage apartment/house bookings and sales process',
      features: ['Unit inventory', 'Booking management', 'Payment tracking', 'Sales reports']
    },
    {
      icon: CheckCircle,
      title: 'Construction Tracking',
      description: 'Monitor construction progress and quality milestones',
      features: ['Progress tracking', 'Quality control', 'Photo documentation', 'Completion reports']
    }
  ];

  const handleModuleSelect = (moduleId: string) => {
    if (hasModuleAccess(user, moduleId)) {
      onModuleSelect(moduleId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome to aaraazi, {user.name}
          </h1>
          <p className="text-lg text-gray-600">
            Choose a module to access your business management tools
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-900">{user.name}</h2>
                  <p className="text-blue-700">{user.email}</p>
                  <p className="text-sm text-blue-600">
                    Role: {user.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Available Modules</p>
                <div className="flex gap-2 mt-2">
                  {user.moduleAccess.map((moduleId) => (
                    <Badge key={moduleId} className="bg-blue-600 text-white">
                      {moduleId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Selection */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Agency Module */}
          <Card className={`cursor-pointer transition-all duration-200 hover:shadow-xl ${
            hasModuleAccess(user, 'agency') 
              ? 'border-blue-300 hover:border-blue-400' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => hasModuleAccess(user, 'agency') && handleModuleSelect('agency')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">Agency Module</CardTitle>
              <CardDescription className="text-blue-700">
                Complete real estate agency management system
              </CardDescription>
              {!hasModuleAccess(user, 'agency') && (
                <Badge variant="outline" className="mx-auto w-fit mt-2">
                  Not Available
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {agencyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feature.features.map((item, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {hasModuleAccess(user, 'agency') && (
                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    Enter Agency Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Developers Module */}
          <Card className={`cursor-pointer transition-all duration-200 hover:shadow-xl ${
            hasModuleAccess(user, 'developers') 
              ? 'border-purple-300 hover:border-purple-400' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => hasModuleAccess(user, 'developers') && handleModuleSelect('developers')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Hammer className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-900">Developers Module</CardTitle>
              <CardDescription className="text-purple-700">
                Building developers project management system
              </CardDescription>
              {!hasModuleAccess(user, 'developers') && (
                <Badge variant="outline" className="mx-auto w-fit mt-2">
                  Not Available
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {developerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {feature.features.map((item, i) => (
                        <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {hasModuleAccess(user, 'developers') && (
                <div className="pt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                    Enter Developers Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Access for Single Module Users */}
        {user.moduleAccess.length === 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              You have access to one module. Click the button below to continue directly.
            </p>
            <Button 
              size="lg" 
              onClick={() => handleModuleSelect(user.moduleAccess[0])}
              className="px-8"
            >
              Continue to {user.moduleAccess[0].charAt(0).toUpperCase() + user.moduleAccess[0].slice(1)} Module
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* No Access Message */}
        {user.moduleAccess.length === 0 && (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">No Module Access</h3>
              <p className="text-amber-800">
                Please contact your administrator to get access to the modules you need.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 aaraazi SaaS Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}