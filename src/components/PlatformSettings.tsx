import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { 
  Server,
  Lock,
  Mail,
  Bell,
  CreditCard,
  Building2,
  FileText,
  Webhook,
  Save
} from 'lucide-react';

interface PlatformSettingsProps {
  settings: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateSettings: (section: string, field: string, value: any) => void;
  onSave: (section: string) => void;
  isLoading: boolean;
}

export function PlatformSettings({
  settings,
  activeTab,
  setActiveTab,
  updateSettings,
  onSave,
  isLoading
}: PlatformSettingsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="bg-white shadow-sm border">
          <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Server className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Webhook className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>
        <Button 
          onClick={() => onSave(activeTab)}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <TabsContent value="system" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Configure basic platform settings and system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Platform Name</Label>
                <Input
                  value={settings.system.platformName}
                  onChange={(e) => updateSettings('system', 'platformName', e.target.value)}
                  placeholder="aaraazi"
                />
              </div>
              <div>
                <Label>Platform URL</Label>
                <Input
                  value={settings.system.platformUrl}
                  onChange={(e) => updateSettings('system', 'platformUrl', e.target.value)}
                  placeholder="https://aaraazi.pk"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Support Email</Label>
                <Input
                  type="email"
                  value={settings.system.supportEmail}
                  onChange={(e) => updateSettings('system', 'supportEmail', e.target.value)}
                  placeholder="support@aaraazi.pk"
                />
              </div>
              <div>
                <Label>System Version</Label>
                <Input
                  value={settings.system.systemVersion}
                  onChange={(e) => updateSettings('system', 'systemVersion', e.target.value)}
                  placeholder="2.1.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Default Timezone</Label>
                <Select
                  value={settings.system.defaultTimezone}
                  onValueChange={(value) => updateSettings('system', 'defaultTimezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Default Currency</Label>
                <Select
                  value={settings.system.defaultCurrency}
                  onValueChange={(value) => updateSettings('system', 'defaultCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKR">Pakistani Rupee (PKR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Default Language</Label>
                <Select
                  value={settings.system.defaultLanguage}
                  onValueChange={(value) => updateSettings('system', 'defaultLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">System Toggles</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Enable to restrict platform access for system maintenance
                    </div>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings('system', 'maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Allow New Registrations</div>
                    <div className="text-sm text-muted-foreground">
                      Allow new tenant organizations to register
                    </div>
                  </div>
                  <Switch
                    checked={settings.system.allowRegistrations}
                    onCheckedChange={(checked) => updateSettings('system', 'allowRegistrations', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security & Authentication
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
                  min="5"
                  max="480"
                />
              </div>
              <div>
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
                  min="3"
                  max="10"
                />
              </div>
              <div>
                <Label>Password Expiry (days)</Label>
                <Input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => updateSettings('security', 'passwordExpiry', parseInt(e.target.value) || 90)}
                  min="30"
                  max="365"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Password Length</Label>
                <Input
                  type="number"
                  value={settings.security.minPasswordLength}
                  onChange={(e) => updateSettings('security', 'minPasswordLength', parseInt(e.target.value) || 8)}
                  min="6"
                  max="20"
                />
              </div>
              <div>
                <Label>IP Whitelist (comma-separated)</Label>
                <Textarea
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSettings('security', 'ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.0/8"
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Security Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Require Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Force all users to enable 2FA for enhanced security
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.requireTwoFactor}
                    onCheckedChange={(checked) => updateSettings('security', 'requireTwoFactor', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Allow Password Reset</div>
                    <div className="text-sm text-muted-foreground">
                      Enable self-service password reset functionality
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.allowPasswordReset}
                    onCheckedChange={(checked) => updateSettings('security', 'allowPasswordReset', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Require Special Characters</div>
                    <div className="text-sm text-muted-foreground">
                      Force passwords to contain special characters
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.requireSpecialChars}
                    onCheckedChange={(checked) => updateSettings('security', 'requireSpecialChars', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Audit Logs</div>
                    <div className="text-sm text-muted-foreground">
                      Log all user actions for security auditing
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.enableAuditLogs}
                    onCheckedChange={(checked) => updateSettings('security', 'enableAuditLogs', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable CAPTCHA</div>
                    <div className="text-sm text-muted-foreground">
                      Add CAPTCHA verification to login forms
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.enableCaptcha}
                    onCheckedChange={(checked) => updateSettings('security', 'enableCaptcha', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>
              Configure SMTP settings and email preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SMTP Host</Label>
                <Input
                  value={settings.email.smtpHost}
                  onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                  placeholder="smtp.aaraazi.pk"
                />
              </div>
              <div>
                <Label>SMTP Port</Label>
                <Input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value) || 587)}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SMTP Username</Label>
                <Input
                  value={settings.email.smtpUser}
                  onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                  placeholder="noreply@aaraazi.pk"
                />
              </div>
              <div>
                <Label>SMTP Password</Label>
                <Input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Name</Label>
                <Input
                  value={settings.email.fromName}
                  onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                  placeholder="aaraazi"
                />
              </div>
              <div>
                <Label>From Email</Label>
                <Input
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                  placeholder="noreply@aaraazi.pk"
                />
              </div>
            </div>

            <div>
              <Label>Max Emails Per Hour</Label>
              <Input
                type="number"
                value={settings.email.maxEmailsPerHour}
                onChange={(e) => updateSettings('email', 'maxEmailsPerHour', parseInt(e.target.value) || 1000)}
                placeholder="1000"
                className="w-48"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Email Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Email Verification</div>
                    <div className="text-sm text-muted-foreground">
                      Require email verification for new user accounts
                    </div>
                  </div>
                  <Switch
                    checked={settings.email.enableEmailVerification}
                    onCheckedChange={(checked) => updateSettings('email', 'enableEmailVerification', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Test Email Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure notification channels and default settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Enable browser push notifications
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.enablePushNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'enablePushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Send notifications via email
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.enableEmailNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'enableEmailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Send notifications via SMS (requires SMS provider)
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.enableSmsNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'enableSmsNotifications', checked)}
                  />
                </div>
              </div>
            </div>

            {settings.notifications.enableSmsNotifications && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">SMS Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SMS Provider</Label>
                      <Select
                        value={settings.notifications.smsProvider}
                        onValueChange={(value) => updateSettings('notifications', 'smsProvider', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="nexmo">Nexmo</SelectItem>
                          <SelectItem value="local">Local Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>SMS API Key</Label>
                      <Input
                        type="password"
                        value={settings.notifications.smsApiKey}
                        onChange={(e) => updateSettings('notifications', 'smsApiKey', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Default Notification Types</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-3">
                  Select which notifications are enabled by default for new tenants
                </div>
                {[
                  { id: 'tenant_created', label: 'New Tenant Created' },
                  { id: 'billing_issues', label: 'Billing Issues' },
                  { id: 'security_alerts', label: 'Security Alerts' },
                  { id: 'system_updates', label: 'System Updates' },
                  { id: 'maintenance', label: 'Maintenance Notifications' }
                ].map((notif) => (
                  <div key={notif.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={notif.id}
                      checked={settings.notifications.defaultNotificationSettings.includes(notif.id)}
                      onChange={(e) => {
                        const current = settings.notifications.defaultNotificationSettings;
                        const updated = e.target.checked
                          ? [...current, notif.id]
                          : current.filter(id => id !== notif.id);
                        updateSettings('notifications', 'defaultNotificationSettings', updated);
                      }}
                    />
                    <Label htmlFor={notif.id}>{notif.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing Configuration
            </CardTitle>
            <CardDescription>
              Configure billing policies and payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Grace Period (days)</Label>
                <Input
                  type="number"
                  value={settings.billing.gracePeriodDays}
                  onChange={(e) => updateSettings('billing', 'gracePeriodDays', parseInt(e.target.value) || 7)}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label>Suspend After (days)</Label>
                <Input
                  type="number"
                  value={settings.billing.suspendAfterDays}
                  onChange={(e) => updateSettings('billing', 'suspendAfterDays', parseInt(e.target.value) || 14)}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <Label>Delete After (days)</Label>
                <Input
                  type="number"
                  value={settings.billing.deleteAfterDays}
                  onChange={(e) => updateSettings('billing', 'deleteAfterDays', parseInt(e.target.value) || 30)}
                  min="7"
                  max="365"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Payment Method</Label>
                <Select
                  value={settings.billing.defaultPaymentMethod}
                  onValueChange={(value) => updateSettings('billing', 'defaultPaymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Auto Billing Reminder (days before)</Label>
                <Input
                  type="number"
                  value={settings.billing.reminderDays}
                  onChange={(e) => updateSettings('billing', 'reminderDays', parseInt(e.target.value) || 3)}
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Billing Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Auto-suspend on overdue</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically suspend tenants with overdue payments
                    </div>
                  </div>
                  <Switch
                    checked={settings.billing.autoSuspend}
                    onCheckedChange={(checked) => updateSettings('billing', 'autoSuspend', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Send Payment Reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically send email reminders for upcoming payments
                    </div>
                  </div>
                  <Switch
                    checked={settings.billing.sendReminders}
                    onCheckedChange={(checked) => updateSettings('billing', 'sendReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Partial Payments</div>
                    <div className="text-sm text-muted-foreground">
                      Allow tenants to make partial payments toward their bills
                    </div>
                  </div>
                  <Switch
                    checked={settings.billing.allowPartialPayments}
                    onCheckedChange={(checked) => updateSettings('billing', 'allowPartialPayments', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="modules" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Module Configuration
            </CardTitle>
            <CardDescription>
              Configure module pricing and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Agency Module Price (PKR/month)</Label>
                <Input
                  type="number"
                  value={settings.modules.agencyModulePrice}
                  onChange={(e) => updateSettings('modules', 'agencyModulePrice', parseInt(e.target.value) || 10000)}
                  min="1000"
                />
              </div>
              <div>
                <Label>Developers Module Price (PKR/month)</Label>
                <Input
                  type="number"
                  value={settings.modules.developersModulePrice}
                  onChange={(e) => updateSettings('modules', 'developersModulePrice', parseInt(e.target.value) || 15000)}
                  min="1000"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Plan Limits</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Basic Plan Limits</h5>
                  <div className="space-y-3">
                    <div>
                      <Label>Max Properties</Label>
                      <Input
                        type="number"
                        value={settings.modules.maxPropertiesBasic}
                        onChange={(e) => updateSettings('modules', 'maxPropertiesBasic', parseInt(e.target.value) || 100)}
                        min="10"
                      />
                    </div>
                    <div>
                      <Label>Max Projects</Label>
                      <Input
                        type="number"
                        value={settings.modules.maxProjectsBasic}
                        onChange={(e) => updateSettings('modules', 'maxProjectsBasic', parseInt(e.target.value) || 10)}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-3">Professional Plan Limits</h5>
                  <div className="space-y-3">
                    <div>
                      <Label>Max Properties</Label>
                      <Input
                        type="number"
                        value={settings.modules.maxPropertiesPro}
                        onChange={(e) => updateSettings('modules', 'maxPropertiesPro', parseInt(e.target.value) || 500)}
                        min="100"
                      />
                    </div>
                    <div>
                      <Label>Max Projects</Label>
                      <Input
                        type="number"
                        value={settings.modules.maxProjectsPro}
                        onChange={(e) => updateSettings('modules', 'maxProjectsPro', parseInt(e.target.value) || 50)}
                        min="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Trial Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Module Trials</div>
                    <div className="text-sm text-muted-foreground">
                      Allow tenants to trial modules before purchase
                    </div>
                  </div>
                  <Switch
                    checked={settings.modules.enableModuleTrials}
                    onCheckedChange={(checked) => updateSettings('modules', 'enableModuleTrials', checked)}
                  />
                </div>
                {settings.modules.enableModuleTrials && (
                  <div>
                    <Label>Trial Period (days)</Label>
                    <Input
                      type="number"
                      value={settings.modules.trialPeriodDays}
                      onChange={(e) => updateSettings('modules', 'trialPeriodDays', parseInt(e.target.value) || 14)}
                      min="7"
                      max="30"
                      className="w-48"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="compliance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Compliance & Data Management
            </CardTitle>
            <CardDescription>
              Configure data retention, privacy, and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Retention Period (days)</Label>
                <Input
                  type="number"
                  value={settings.compliance.dataRetentionPeriod}
                  onChange={(e) => updateSettings('compliance', 'dataRetentionPeriod', parseInt(e.target.value) || 2555)}
                  min="365"
                />
                <div className="text-xs text-muted-foreground mt-1">Default: 7 years (2555 days)</div>
              </div>
              <div>
                <Label>Backup Retention (days)</Label>
                <Input
                  type="number"
                  value={settings.compliance.backupRetentionDays}
                  onChange={(e) => updateSettings('compliance', 'backupRetentionDays', parseInt(e.target.value) || 30)}
                  min="7"
                  max="365"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Compliance Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Data Retention</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically delete data after retention period
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.enableDataRetention}
                    onCheckedChange={(checked) => updateSettings('compliance', 'enableDataRetention', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">GDPR Compliance</div>
                    <div className="text-sm text-muted-foreground">
                      Enable GDPR compliance features and data protection
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.enableGdprCompliance}
                    onCheckedChange={(checked) => updateSettings('compliance', 'enableGdprCompliance', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Audit Trail</div>
                    <div className="text-sm text-muted-foreground">
                      Maintain detailed logs of all system activities
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.enableAuditTrail}
                    onCheckedChange={(checked) => updateSettings('compliance', 'enableAuditTrail', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Require Privacy Acceptance</div>
                    <div className="text-sm text-muted-foreground">
                      Require users to accept privacy policy
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.requirePrivacyAcceptance}
                    onCheckedChange={(checked) => updateSettings('compliance', 'requirePrivacyAcceptance', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Data Export</div>
                    <div className="text-sm text-muted-foreground">
                      Allow users to export their data
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.enableDataExport}
                    onCheckedChange={(checked) => updateSettings('compliance', 'enableDataExport', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Automatic Backups</div>
                    <div className="text-sm text-muted-foreground">
                      Enable automated system backups
                    </div>
                  </div>
                  <Switch
                    checked={settings.compliance.automaticBackups}
                    onCheckedChange={(checked) => updateSettings('compliance', 'automaticBackups', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              API & Integrations
            </CardTitle>
            <CardDescription>
              Configure API access and third-party integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max API Calls per Hour</Label>
                <Input
                  type="number"
                  value={settings.integrations.maxApiCallsPerHour}
                  onChange={(e) => updateSettings('integrations', 'maxApiCallsPerHour', parseInt(e.target.value) || 10000)}
                  min="100"
                />
              </div>
              <div>
                <Label>Webhook Retry Attempts</Label>
                <Input
                  type="number"
                  value={settings.integrations.webhookRetryAttempts}
                  onChange={(e) => updateSettings('integrations', 'webhookRetryAttempts', parseInt(e.target.value) || 3)}
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div>
              <Label>Allowed Domains (comma-separated)</Label>
              <Textarea
                value={settings.integrations.allowedDomains}
                onChange={(e) => updateSettings('integrations', 'allowedDomains', e.target.value)}
                placeholder="aaraazi.pk, *.aaraazi.pk"
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Integration Features</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable API Access</div>
                    <div className="text-sm text-muted-foreground">
                      Allow tenants to access platform APIs
                    </div>
                  </div>
                  <Switch
                    checked={settings.integrations.enableApiAccess}
                    onCheckedChange={(checked) => updateSettings('integrations', 'enableApiAccess', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Webhooks</div>
                    <div className="text-sm text-muted-foreground">
                      Allow webhook notifications for events
                    </div>
                  </div>
                  <Switch
                    checked={settings.integrations.enableWebhooks}
                    onCheckedChange={(checked) => updateSettings('integrations', 'enableWebhooks', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Third-Party Integrations</div>
                    <div className="text-sm text-muted-foreground">
                      Allow integration with external services
                    </div>
                  </div>
                  <Switch
                    checked={settings.integrations.enableThirdPartyIntegrations}
                    onCheckedChange={(checked) => updateSettings('integrations', 'enableThirdPartyIntegrations', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}