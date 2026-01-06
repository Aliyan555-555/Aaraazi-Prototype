import React from 'react';
import { 
  Home, 
  User, 
  Users, 
  Handshake, 
  TrendingUp,
  Building2,
  UserCheck,
  UserPlus,
  MapPin,
  Key,
  FileText
} from 'lucide-react';

export interface EntityChipProps {
  type: 'property' | 'agent' | 'client' | 'deal' | 'investor' | 'owner' | 'seller' | 'buyer' | 'tenant' | 'landlord' | 'location' | 'purchaser' | 'contact' | 'requirement';
  name: string;
  role?: string;
  status?: 'active' | 'inactive';
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

/**
 * EntityChip - Single entity display chip with icon and name
 * 
 * Usage:
 * <EntityChip type="agent" name="Sarah Khan" role="Listing Agent" onClick={() => nav('agent', id)} />
 * <EntityChip type="property" name="Marina Residences" variant="compact" />
 */
export function EntityChip({ 
  type, 
  name, 
  role, 
  status,
  onClick,
  variant = 'default'
}: EntityChipProps) {
  const isClickable = !!onClick;

  // Icon mapping
  const iconMap = {
    property: Home,
    agent: User,
    client: Users,
    deal: Handshake,
    investor: TrendingUp,
    owner: User,
    seller: UserCheck,
    buyer: UserPlus,
    tenant: User,
    landlord: User,
    location: MapPin,
    purchaser: Key,
    contact: User,
    requirement: FileText
  };

  const Icon = iconMap[type];

  // Color mapping based on type
  const colorMap = {
    property: 'text-blue-600 bg-blue-50',
    agent: 'text-green-600 bg-green-50',
    client: 'text-purple-600 bg-purple-50',
    deal: 'text-orange-600 bg-orange-50',
    investor: 'text-indigo-600 bg-indigo-50',
    owner: 'text-gray-600 bg-gray-50',
    seller: 'text-green-600 bg-green-50',
    buyer: 'text-blue-600 bg-blue-50',
    tenant: 'text-gray-600 bg-gray-50',
    landlord: 'text-gray-600 bg-gray-50',
    location: 'text-gray-600 bg-gray-50',
    purchaser: 'text-gray-600 bg-gray-50',
    contact: 'text-gray-600 bg-gray-50',
    requirement: 'text-gray-600 bg-gray-50'
  };

  const baseClasses = `
    inline-flex items-center gap-2 
    ${variant === 'compact' ? 'px-2 py-1' : 'px-3 py-1.5'}
    rounded-md border border-gray-200
    ${isClickable ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all' : ''}
    ${status === 'inactive' ? 'opacity-50' : ''}
  `;

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      aria-label={`${type}: ${name}${role ? ` - ${role}` : ''}`}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center w-5 h-5 rounded ${colorMap[type]}`}>
        <Icon className="w-3 h-3" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#030213]">{name}</span>
        {role && variant !== 'compact' && (
          <>
            <span className="text-gray-400">·</span>
            <span className="text-xs text-gray-500">{role}</span>
          </>
        )}
      </div>
    </div>
  );
}