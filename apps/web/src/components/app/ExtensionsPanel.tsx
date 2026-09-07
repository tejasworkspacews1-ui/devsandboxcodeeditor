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
import React, { useState } from 'react';
import { Package, ToggleLeft, ToggleRight, Trash2, Download, Upload, Search } from 'lucide-react';
import { useAppStore } from '../../stores';
import { extensionManager } from '../../services/extensions';

export function ExtensionsPanel() {
  const extensions = extensionManager.getExtensions();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filtered = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggle = (id: string) => {
    extensionManager.toggle(id);
  };
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border">
        <h3 className="text-sm font-semibold text-ide-text mb-2">Extensions</h3>
        <div className="flex items-center gap-2">
          <Search size={14} className="text-ide-textSecondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extensions..."
            className="flex-1 px-2 py-1 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="text-center text-ide-textSecondary text-sm py-8">
            No extensions found
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(ext => (
              <div key={ext.id} className="p-3 bg-ide-bg border border-ide-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-ide-accent" />
                      <span className="text-sm font-medium text-ide-text">{ext.name}</span>
                      <span className="text-xs text-ide-textSecondary bg-ide-sidebar px-1.5 py-0.5 rounded">{ext.type}</span>
                    </div>
                    <p className="text-xs text-ide-textSecondary mt-1">{ext.description}</p>
                    <p className="text-xs text-ide-textSecondary/60 mt-1">by {ext.author} v{ext.version}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(ext.id)}
                    className="ml-2 flex-shrink-0"
                  >
                    {ext.enabled ? (
                      <ToggleRight size={20} className="text-green-400" />
                    ) : (
                      <ToggleLeft size={20} className="text-ide-textSecondary" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-ide-border">
        <div className="flex items-center gap-2 text-xs text-ide-textSecondary">
          <Package size={14} />
          <span>{extensions.filter(e => e.enabled).length} of {extensions.length} extensions enabled</span>
        </div>
      </div>
    </div>
  );
}
