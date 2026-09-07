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
import { Package, Search, Download, Star, Trash2, Eye, Code, Palette, FileText } from 'lucide-react';
import { getMarketplaceExtensions, installExtension, uninstallExtension, searchMarketplace } from '../../services/marketplace';

export function MarketplacePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  
  const extensions = searchQuery 
    ? searchMarketplace(searchQuery) 
    : getMarketplaceExtensions();
  
  const handleInstall = (id: string) => {
    if (installExtension(id)) {
      setInstalled(prev => new Set(prev).add(id));
    }
  };
  
  const handleUninstall = (id: string) => {
    if (uninstallExtension(id)) {
      setInstalled(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theme': return <Palette size={14} />;
      case 'snippet': return <Code size={14} />;
      case 'formatter': return <FileText size={14} />;
      case 'language': return <Code size={14} />;
      default: return <Package size={14} />;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border">
        <h3 className="text-sm font-semibold text-ide-text mb-2">Extension Marketplace</h3>
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
        {extensions.length === 0 ? (
          <div className="text-center text-ide-textSecondary text-sm py-8">
            No extensions found
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {extensions.map(ext => (
              <div key={ext.id} className="p-3 bg-ide-bg border border-ide-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ide-sidebar flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(ext.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ide-text truncate">{ext.name}</span>
                      <span className="text-xs text-ide-textSecondary bg-ide-sidebar px-1.5 py-0.5 rounded">{ext.type}</span>
                    </div>
                    <p className="text-xs text-ide-textSecondary mt-1">{ext.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-xs text-ide-textSecondary">{ext.rating}</span>
                      </div>
                      <span className="text-xs text-ide-textSecondary">{ext.downloads} downloads</span>
                      <span className="text-xs text-ide-textSecondary">by {ext.author}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {installed.has(ext.id) ? (
                      <button
                        onClick={() => handleUninstall(ext.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-900/20 text-red-400 rounded hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 size={12} />
                        Uninstall
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInstall(ext.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors"
                      >
                        <Download size={12} />
                        Install
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
