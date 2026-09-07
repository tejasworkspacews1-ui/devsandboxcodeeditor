/*!
 * Developer: Tejas Kamble
 * Email: tejaskgm1@gmail.com
 * Website: https://tejas-personal-portfolio-dev.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejas-kamble-5342443b1
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Search, FilePlus, FolderPlus, Save, SaveAll, X, ToggleLeft, Play, Square, RotateCw, Palette, Settings, Upload, Download, GitBranch, Package, Keyboard, Terminal } from 'lucide-react';
import { useAppStore } from '../../stores';
import { Modal } from '../ui/Primitives';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const store = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const commands: CommandItem[] = [
    { id: 'new-file', label: 'New File', icon: <FilePlus size={16} />, action: () => {}, category: 'File' },
    { id: 'new-folder', label: 'New Folder', icon: <FolderPlus size={16} />, action: () => {}, category: 'File' },
    { id: 'save', label: 'Save File', icon: <Save size={16} />, action: () => {}, category: 'File' },
    { id: 'save-all', label: 'Save All', icon: <SaveAll size={16} />, action: () => {}, category: 'File' },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', icon: <ToggleLeft size={16} />, action: () => {}, category: 'View' },
    { id: 'toggle-terminal', label: 'Toggle Terminal', icon: <Terminal size={16} />, action: () => {}, category: 'View' },
    { id: 'toggle-preview', label: 'Toggle Preview', icon: <Play size={16} />, action: () => {}, category: 'View' },
    { id: 'start-project', label: 'Start Project', icon: <Play size={16} />, action: () => {}, category: 'Runtime' },
    { id: 'stop-project', label: 'Stop Project', icon: <Square size={16} />, action: () => {}, category: 'Runtime' },
    { id: 'restart-project', label: 'Restart Project', icon: <RotateCw size={16} />, action: () => {}, category: 'Runtime' },
    { id: 'change-theme', label: 'Change Theme', icon: <Palette size={16} />, action: () => {}, category: 'Preferences' },
    { id: 'open-settings', label: 'Open Settings', icon: <Settings size={16} />, action: () => {}, category: 'Preferences' },
    { id: 'import-project', label: 'Import Project', icon: <Upload size={16} />, action: () => {}, category: 'Project' },
    { id: 'export-project', label: 'Export Project', icon: <Download size={16} />, action: () => {}, category: 'Project' },
    { id: 'clone-repo', label: 'Clone Repository', icon: <GitBranch size={16} />, action: () => {}, category: 'Project' },
    { id: 'install-package', label: 'Install Package', icon: <Package size={16} />, action: () => {}, category: 'Terminal' },
    { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: <Keyboard size={16} />, action: () => {}, category: 'Help' },
  ];
  
  const filtered = query.trim() === '' 
    ? commands 
    : commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      );
  
  useEffect(() => {
    if (store.showCommandPalette) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [store.showCommandPalette]);
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        store.setShowCommandPalette(false);
      }
    } else if (e.key === 'Escape') {
      store.setShowCommandPalette(false);
    }
  };
  
  if (!store.showCommandPalette) return null;
  
  return (
    <Modal isOpen={true} onClose={() => store.setShowCommandPalette(false)} title="Command Palette" size="md">
      <div className="flex flex-col gap-2 max-h-[400px]">
        <div className="flex items-center gap-2 px-3 py-2 bg-ide-bg border border-ide-border rounded">
          <Search size={16} className="text-ide-textSecondary flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="bg-transparent outline-none text-sm text-ide-text flex-1 placeholder-ide-textSecondary"
          />
          <kbd className="text-xs text-ide-textSecondary bg-ide-sidebar px-1.5 py-0.5 rounded border border-ide-border">ESC</kbd>
        </div>
        
        <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[300px]">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-ide-textSecondary text-sm">
              No commands found
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); store.setShowCommandPalette(false); }}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${idx === selectedIndex ? 'bg-ide-hover text-ide-text' : 'text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover'}`}
              >
                <span className="flex-shrink-0 opacity-70">{cmd.icon}</span>
                <span className="flex-1 text-left">{cmd.label}</span>
                <span className="text-xs opacity-50">{cmd.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

