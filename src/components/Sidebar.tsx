import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  DollarSign, 
  FileText, 
  BarChart3,
  Plus,
  ContactRound,
  Handshake,
  Building2,
  Banknote,
  FolderKanban,
  Hammer,
  Calendar,
  PieChart,
  Layers,
  Package,
  Calculator,
  Warehouse,
  ClipboardCheck,
  Target,
  TrendingUp,
  Home,
  Bell,
  FileCheck
} from 'lucide-react';
import { SaaSUser } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'agent';
  currentModule?: string | null;
  saasUser?: SaaSUser;
  unreadNotificationCount?: number;
  isCollapsed?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: any;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  activeTab, 
  onTabChange, 
  userRole, 
  currentModule,
  saasUser,
  unreadNotificationCount,
  isCollapsed = false
}) => {
  // Agency Module Grouped Menu Items (without Core Operations)
  const agencyGroups: MenuGroup[] = [
    {
      id: 'property',
      label: 'Property Management',
      icon: Building,
      items: [
        { id: 'properties', label: 'Properties' },
        { id: 'sell-cycles', label: 'Sell Cycles' },
        { id: 'purchase-cycles', label: 'Purchase Cycles' },
        { id: 'rent-cycles', label: 'Rent Cycles' },
      ]
    },
    {
      id: 'deals',
      label: 'Deal Pipeline',
      icon: FileCheck,
      items: [
        { id: 'deals', label: 'Deal Management' },
        { id: 'buyer-requirements', label: 'Buyer Requirements' },
        { id: 'rent-requirements', label: 'Rent Requirements' },
      ]
    },
    {
      id: 'relationships',
      label: 'Relationships',
      icon: Users,
      items: [
        { id: 'leads', label: 'Leads' },
        { id: 'contacts', label: 'Contacts' },
      ]
    },
    {
      id: 'financials',
      label: 'Financials & Reporting',
      icon: DollarSign,
      items: [
        { id: 'financials', label: 'Financials' },
        { id: 'portfolio', label: 'Portfolio Management' },
        { id: 'agency', label: 'Performance' },
        { id: 'reports', label: 'Reports' },
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FileText,
      items: [
        { id: 'documents', label: 'Documents' },
      ]
    }
  ];

  // Developers Module Grouped Menu Items (without Core Operations)
  const developersGroups: MenuGroup[] = [
    {
      id: 'land',
      label: 'Land & Planning',
      icon: Layers,
      items: [
        { id: 'land-acquisition', label: 'Land Acquisition' },
        { id: 'feasibility-calculator', label: 'Feasibility Calculator' },
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      items: [
        { id: 'projects', label: 'Projects' },
      ]
    },
    {
      id: 'procurement',
      label: 'Procurement & Inventory',
      icon: Package,
      items: [
        { id: 'central-inventory', label: 'Central Inventory' },
        { id: 'goods-receipt', label: 'Goods Receipt (GRN)' },
        { id: 'procurement', label: 'Procurement & Inventory' },
        { id: 'smart-procurement', label: 'Smart Procurement & RFQ' },
        { id: 'supplier-management', label: 'Supplier Management' },
      ]
    },
    {
      id: 'financials',
      label: 'Financials',
      icon: DollarSign,
      items: [
        { id: 'project-accounting', label: 'Project Accounting' },
        { id: 'banking-treasury', label: 'Banking & Treasury' },
        { id: 'advanced-financials', label: 'Advanced Financials' },
        { id: 'financials', label: 'Financials' },
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FileText,
      items: [
        { id: 'documents', label: 'Documents' },
        { id: 'reports', label: 'Reports' },
      ]
    }
  ];

  // Get menu groups based on current module
  const getMenuGroups = (): MenuGroup[] => {
    if (currentModule === 'agency') {
      return agencyGroups;
    } else if (currentModule === 'developers') {
      return developersGroups;
    }
    // Default combined menu for legacy support (no icons on items)
    return [
      {
        id: 'core',
        label: 'Core Operations',
        icon: LayoutDashboard,
        items: [
          { id: 'dashboard', label: 'Dashboard' },
        ]
      },
      {
        id: 'property',
        label: 'Property Management',
        icon: Building,
        items: [
          { id: 'inventory', label: 'Properties' },
          { id: 'leads', label: 'Leads' },
        ]
      },
      {
        id: 'financials',
        label: 'Financials',
        icon: DollarSign,
        items: [
          { id: 'project-accounting', label: 'Project Accounting' },
          { id: 'banking-treasury', label: 'Banking & Treasury' },
          { id: 'financials', label: 'Financials' },
          { id: 'agency', label: 'Agency Hub' },
        ]
      },
      {
        id: 'resources',
        label: 'Resources',
        icon: FileText,
        items: [
          { id: 'documents', label: 'Documents' },
          { id: 'reports', label: 'Reports' },
        ]
      }
    ];
  };

  const menuGroups = getMenuGroups();

  // Get quick action buttons based on module
  const getQuickActions = () => {
    const actions = [];
    
    if (currentModule === 'agency') {
      actions.push(
        { id: 'add-lead', label: 'Add Lead', icon: Users, primary: true }
      );
    } else if (currentModule === 'developers') {
      actions.push(
        { id: 'add-project', label: 'New Project', icon: FolderKanban, primary: true }
      );
    } else {
      // Default actions for legacy support
      actions.push(
        { id: 'add-project', label: 'New Project', icon: FolderKanban, primary: true }
      );
    }
    
    return actions;
  };

  const quickActions = getQuickActions();

  // Render a navigation item without icon (for group items)
  const renderNavItem = (item: MenuItem, showBadge: boolean = false, showIcon: boolean = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const showNotificationBadge = showBadge && item.id === 'notifications' && unreadNotificationCount && unreadNotificationCount > 0;

    const button = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          isActive && currentModule === 'agency' && "bg-blue-50 text-blue-700 hover:bg-blue-100",
          isActive && currentModule === 'developers' && "bg-purple-50 text-purple-700 hover:bg-purple-100",
          isActive && !currentModule && "bg-blue-50 text-blue-700 hover:bg-blue-100"
        )}
        onClick={() => onTabChange(item.id)}
      >
        {showIcon && Icon && <Icon className="h-4 w-4 mr-3" />}
        <span>{item.label}</span>
        {showNotificationBadge && (
          <Badge className="ml-auto bg-red-500 text-white">
            {unreadNotificationCount! > 9 ? '9+' : unreadNotificationCount}
          </Badge>
        )}
      </Button>
    );

    return button;
  };

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "bg-white border-r h-screen flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 space-y-2">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Button 
                  key={action.id}
                  className={cn(
                    "w-full",
                    action.primary ? "" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  )}
                  variant={action.primary ? "default" : "outline"}
                  onClick={() => onTabChange(action.id)}
                >
                  <ActionIcon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Quick Actions - Collapsed */}
        {isCollapsed && (
          <div className="p-2">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full"
                      variant={action.primary ? "default" : "outline"}
                      size="icon"
                      onClick={() => onTabChange(action.id)}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
        
        {/* Dashboard - Top Item (Expanded) */}
        {!isCollapsed && (
          <div className="px-2 pt-2">
            {renderNavItem({ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, false, true)}
          </div>
        )}

        {/* Dashboard - Top Item (Collapsed) */}
        {isCollapsed && (
          <div className="px-2 pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'dashboard' ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-center px-2",
                    activeTab === 'dashboard' && currentModule === 'agency' && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                    activeTab === 'dashboard' && currentModule === 'developers' && "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                  size="icon"
                  onClick={() => onTabChange('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {/* Navigation Menu - Expanded (Always Open Groups) */}
        {!isCollapsed && (
          <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            <ul className="space-y-3">
              {menuGroups.map((group) => {
                const GroupIcon = group.icon;
                
                return (
                  <li key={group.id}>
                    {/* Group Header - Non-clickable, just a label */}
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <GroupIcon className="h-4 w-4" />
                      <span>{group.label}</span>
                    </div>
                    
                    {/* Group Items - Always visible */}
                    <ul className="mt-1 space-y-0.5 pl-6">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          {renderNavItem(item, false, false)}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Navigation Menu - Collapsed (Icon Only) */}
        {isCollapsed && (
          <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            <ul className="space-y-2">
              {menuGroups.map((group) => {
                const GroupIcon = group.icon;
                
                return (
                  <li key={group.id}>
                    {/* Group Icon with Flyout */}
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-full mb-1 hover:bg-gray-100"
                          >
                            <GroupIcon className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="p-3 bg-white border shadow-lg">
                        <div className="space-y-1 min-w-[180px]">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">{group.label}</p>
                          {group.items.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                className={cn(
                                  "w-full flex items-start px-2 py-1.5 text-sm rounded transition-colors text-left",
                                  isActive 
                                    ? currentModule === 'agency' 
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                    : "hover:bg-gray-100 text-gray-700"
                                )}
                                onClick={() => onTabChange(item.id)}
                              >
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Notifications - Bottom Item (Expanded) */}
        {!isCollapsed && (
          <div className="px-2 pb-2 border-t pt-2">
            {renderNavItem({ id: 'notifications', label: 'Notifications', icon: Bell }, true, true)}
          </div>
        )}

        {/* Notifications - Bottom Item (Collapsed) */}
        {isCollapsed && (
          <div className="px-2 pb-2 border-t pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'notifications' ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-center px-2 relative",
                    activeTab === 'notifications' && currentModule === 'agency' && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                    activeTab === 'notifications' && currentModule === 'developers' && "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                  size="icon"
                  onClick={() => onTabChange('notifications')}
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount && unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Notifications</p>
                {unreadNotificationCount && unreadNotificationCount > 0 && (
                  <p className="text-xs text-red-400">{unreadNotificationCount} unread</p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {/* User Context Footer */}
        {saasUser && !isCollapsed && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-xs text-gray-500">
              <p className="font-medium">{saasUser.name}</p>
              <p>{saasUser.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              {saasUser.moduleAccess.length > 1 && (
                <p className="mt-1 text-gray-400">
                  {saasUser.moduleAccess.length} modules available
                </p>
              )}
            </div>
          </div>
        )}

        {/* User Context Footer - Collapsed */}
        {saasUser && isCollapsed && (
          <div className="p-2 border-t bg-gray-50 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                  {saasUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{saasUser.name}</p>
                <p className="text-xs text-gray-400">
                  {saasUser.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});