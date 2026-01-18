/**
 * Developer Tools Component
 * 
 * Quick controls for Supabase integration during development
 * Shows only when config.isDevelopment = true
 */

import { useState, useEffect } from 'react';
import { Settings, Database, RefreshCw, ToggleLeft, ToggleRight, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { config, features, modes } from '../lib/config';
import { syncAllData, checkSupabaseHealth } from '../lib/dataService';
import { toast } from 'sonner';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [supabaseEnabled, setSupabaseEnabled] = useState(config.supabaseEnabled);
  const [syncing, setSyncing] = useState(false);
  const [backendHealth, setBackendHealth] = useState<boolean | null>(null);

  // Don't show in production
  if (!config.isDevelopment) {
    return null;
  }

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const healthy = await checkSupabaseHealth();
      setBackendHealth(healthy);
    } catch {
      setBackendHealth(false);
    }
  };

  const toggleSupabase = () => {
    const newValue = !supabaseEnabled;
    config.supabaseEnabled = newValue;
    features.supabaseSync = newValue;
    setSupabaseEnabled(newValue);
    
    toast.success(
      newValue 
        ? 'Supabase enabled - data will sync to backend' 
        : 'Supabase disabled - using localStorage only'
    );
  };

  const handleSync = async () => {
    if (!config.supabaseEnabled) {
      toast.error('Enable Supabase first to sync data');
      return;
    }

    setSyncing(true);
    try {
      const result = await syncAllData();
      
      if (result.failed.length > 0) {
        toast.error(`Sync failed for: ${result.failed.join(', ')}`);
      } else {
        toast.success(`Synced ${result.success.length} data types successfully`);
      }
    } catch (error) {
      toast.error('Sync failed - check console for details');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const setMode = (mode: 'figmaMake' | 'testing' | 'production') => {
    modes[mode]();
    setSupabaseEnabled(config.supabaseEnabled);
    
    const modeNames = {
      figmaMake: 'Figma Make Mode (localStorage only)',
      testing: 'Testing Mode (manual sync)',
      production: 'Production Mode (auto-sync)'
    };
    
    toast.success(`Switched to ${modeNames[mode]}`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        title="Developer Tools"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 p-4 shadow-xl border-2 border-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Dev Tools</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Backend Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Backend Status</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkHealth}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              backendHealth === null ? 'bg-gray-400' :
              backendHealth ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">
              {backendHealth === null ? 'Checking...' :
               backendHealth ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Supabase Toggle */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm">Supabase Sync</span>
            </div>
            <button
              onClick={toggleSupabase}
              className="relative inline-flex items-center"
            >
              {supabaseEnabled ? (
                <ToggleRight className="w-10 h-6 text-green-600" />
              ) : (
                <ToggleLeft className="w-10 h-6 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {supabaseEnabled 
              ? 'Data syncs to backend (slower, persistent)'
              : 'localStorage only (fastest, no sync)'}
          </p>
        </div>

        {/* Manual Sync Button */}
        {supabaseEnabled && (
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="w-full mb-4"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        )}

        {/* Quick Mode Buttons */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 mb-2">Quick Modes:</p>
          
          <Button
            onClick={() => setMode('figmaMake')}
            variant={!supabaseEnabled ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            {!supabaseEnabled && <Check className="w-3 h-3 mr-2" />}
            <span className="text-xs">Figma Make (Pure localStorage)</span>
          </Button>
          
          <Button
            onClick={() => setMode('testing')}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <span className="text-xs">Testing (Manual Sync)</span>
          </Button>
          
          <Button
            onClick={() => setMode('production')}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <span className="text-xs">Production (Auto-Sync)</span>
          </Button>
        </div>

        {/* Current Config */}
        <div className="mt-4 p-2 bg-gray-900 text-white rounded text-xs">
          <div className="space-y-1">
            <div>Mode: {!supabaseEnabled ? 'Development' : 'Production'}</div>
            <div>Storage: {!supabaseEnabled ? 'localStorage' : 'Hybrid'}</div>
            <div>Auto-sync: {config.autoSync.enabled ? 'ON' : 'OFF'}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
