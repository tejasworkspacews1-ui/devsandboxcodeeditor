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
import { X, Pin, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../stores';
import { ContextMenu } from '../ui/Primitives';

export function EditorTabs() {
  const tabs = useAppStore(s => s.tabs);
  const activeTabId = useAppStore(s => s.activeTabId);
  const closeTab = useAppStore(s => s.closeTab);
  const setActiveTab = useAppStore(s => s.setActiveTab);
  const pinTab = useAppStore(s => s.pinTab);
  const reopenTab = useAppStore(s => s.reopenTab);
  const updateTab = useAppStore(s => s.updateTab);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  
  if (tabs.length === 0) {
    return (
      <div className="h-9 bg-ide-panel border-b border-ide-border flex items-center px-4">
        <span className="text-xs text-ide-textSecondary">No files open</span>
      </div>
    );
  }
  
  const contextMenuItems = contextMenu ? [
    { label: 'Close', onClick: () => { closeTab(contextMenu.tabId); setContextMenu(null); } },
    { label: 'Close Others', onClick: () => { tabs.filter(t => t.id !== contextMenu.tabId).forEach(t => closeTab(t.id)); setContextMenu(null); } },
    { label: 'Close to the Right', onClick: () => { const idx = tabs.findIndex(t => t.id === contextMenu.tabId); tabs.slice(idx + 1).forEach(t => closeTab(t.id)); setContextMenu(null); } },
    { label: 'Close All', onClick: () => { tabs.forEach(t => closeTab(t.id)); setContextMenu(null); } },
    { label: activeTabId === contextMenu.tabId ? 'Unpin' : 'Pin', onClick: () => { pinTab(contextMenu.tabId); setContextMenu(null); } },
  ] : [];
  
  return (
    <div className="h-9 bg-ide-panel border-b border-ide-border flex items-end overflow-x-auto">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`group flex items-center gap-2 px-3 py-1.5 text-sm border-r border-ide-border cursor-pointer min-w-[120px] max-w-[200px] transition-colors ${activeTabId === tab.id ? 'bg-ide-bg text-ide-text border-t-2 border-t-ide-accent' : 'text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover'}`}
          onClick={() => setActiveTab(tab.id)}
          onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id })}
        >
          <span className="truncate flex-1">{tab.name}</span>
          {tab.modified && <span className="w-2 h-2 rounded-full bg-ide-accent flex-shrink-0" />}
          {tab.pinned && <Pin size={10} className="flex-shrink-0" />}
          <button
            onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
            className="opacity-0 group-hover:opacity-100 hover:bg-ide-border rounded p-0.5 transition-all flex-shrink-0"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      <button
        onClick={reopenTab}
        className="px-2 py-1.5 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover transition-colors flex-shrink-0"
        title="Reopen closed tab"
      >
        <ChevronLeft size={14} />
      </button>
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

