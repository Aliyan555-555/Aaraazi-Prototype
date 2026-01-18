import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Building2, Hammer, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { SaaSUser } from '../types/saas';
import { logger } from '../lib/logger';

interface SaaSLoginProps {
  onLogin: (user: SaaSUser) => void;
}

export function SaaSLogin({ onLogin }: SaaSLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'SaaS Admin',
      email: 'admin@aaraazi.com',
      description: 'Product owner - manage all accounts and pricing',
      color: 'bg-purple-100 text-purple-800',
      icon: '👑'
    },
    {
      role: 'Super Admin',
      email: 'owner@premiumrealty.pk',
      description: 'Agency owner - manage organization and users',
      color: 'bg-blue-100 text-blue-800',
      icon: '🏢'
    },
    {
      role: 'Agency Manager', 
      email: 'manager@premiumrealty.pk',
      description: 'Branch manager - oversee agents and operations',
      color: 'bg-green-100 text-green-800',
      icon: '👨‍💼'
    },
    {
      role: 'Real Estate Agent',
      email: 'agent1@premiumrealty.pk', 
      description: 'Property agent - manage listings and leads',
      color: 'bg-orange-100 text-orange-800',
      icon: '🏡'
    },
    {
      role: 'Developer',
      email: 'developer@premiumrealty.pk',
      description: 'Building developer - manage construction projects and sales',
      color: 'bg-indigo-100 text-indigo-800',
      icon: '🏗️'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Import the saas login function
      const { saasLogin } = await import('../lib/saas');
      
      const user = saasLogin(email, password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password. Please try one of the demo accounts.');
      }
    } catch (error) {
      logger.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">aaraazi</h1>
          </div>
          <p className="text-lg text-gray-600">
            Comprehensive SaaS Platform for Real Estate & Development Management
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
              <CardDescription>
                Access your aaraazi dashboard and manage your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="demo" className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Try aaraazi with these demo accounts. Click any account to auto-fill credentials.
                  </div>
                  
                  <div className="space-y-3">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.email}
                        onClick={() => fillDemoCredentials(account.email)}
                        className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{account.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{account.role}</span>
                                <Badge className={account.color} variant="secondary">
                                  Demo
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {account.description}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {account.email}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Feature Overview */}
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-900">Agency Module</CardTitle>
                </div>
                <CardDescription className="text-blue-700">
                  Complete real estate management system for agencies and agents
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-blue-800">
                <ul className="space-y-1">
                  <li>• Property listing management</li>
                  <li>• Lead tracking and nurturing</li>
                  <li>• Commission tracking and payouts</li>
                  <li>• Agent performance analytics</li>
                  <li>• Document management system</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-purple-900">Developers Module</CardTitle>
                </div>
                <CardDescription className="text-purple-700">
                  Project management system for building developers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-purple-800">
                <ul className="space-y-1">
                  <li>• Construction project management</li>
                  <li>• Unit booking and sales tracking</li>
                  <li>• Budget and cost management</li>
                  <li>• Progress milestone tracking</li>
                  <li>• Financial planning and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Multi-Tenant SaaS Features</CardTitle>
                <CardDescription>
                  Enterprise-grade platform capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• Role-based access control</li>
                  <li>• Multi-branch organization support</li>
                  <li>• Customizable subscription plans</li>
                  <li>• Module-based pricing</li>
                  <li>• Advanced analytics and reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 aaraazi. Built for the Pakistani Real Estate Market.</p>
          <p className="mt-1">All financial values are displayed in Pakistani Rupees (PKR).</p>
        </div>
      </div>
    </div>
  );
}