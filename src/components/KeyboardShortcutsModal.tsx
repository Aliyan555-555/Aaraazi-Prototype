import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Badge } from './ui/badge';
import { shortcutManager, formatShortcut, ShortcutCategory } from '../lib/keyboardShortcuts';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onClose
}) => {
  const shortcuts = shortcutManager.getAllShortcuts();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {shortcuts.map((category: ShortcutCategory, index: number) => (
            <div key={index}>
              <h3 className="text-sm text-gray-900 mb-3">{category.name}</h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <Badge variant="outline" className="bg-white">
                      {formatShortcut(shortcut)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {shortcuts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Keyboard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No keyboard shortcuts registered</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Press <Badge variant="outline" className="mx-1">Shift + ?</Badge> to open this menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
