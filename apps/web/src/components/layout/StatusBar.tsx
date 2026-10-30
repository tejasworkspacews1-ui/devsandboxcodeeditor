/*!
 * Developer: Tejas Kamble
 * Email: tejasksocials@gmail.com
 * Website: https://tejaskambleportfolio.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejaskambleportfolio/
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
import React from 'react';
import { GitBranch, Play, Square, Wifi, WifiOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../stores';

export function StatusBar() {
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  const runtimeUrl = useAppStore(s => s.runtimeUrl);
  const activeTabId = useAppStore(s => s.activeTabId);
  const tabs = useAppStore(s => s.tabs);
  const settings = useAppStore(s => s.editorSettings);
  const notifications = useAppStore(s => s.notifications);
  const diagnostics = useAppStore(s => s.diagnostics);
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const toggleTerminal = () => {
    setLayout({ panelCollapsed: !layout.panelCollapsed, bottomTab: 'terminal' });
  };
  
  return (
    <div className="h-6 bg-[#141416] border-t border-ide-border flex items-center justify-between px-3 text-[11px] text-zinc-400 select-none flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTerminal}
          className="flex items-center gap-1.5 hover:text-zinc-200 hover:bg-zinc-800/60 px-1.5 py-0.5 rounded transition-colors text-zinc-300"
          title="Toggle Terminal Panel"
        >
          <GitBranch size={11} className="text-zinc-400" />
          <span className="font-medium">main</span>
        </button>

        {activeTab && (
          <span className="flex items-center gap-1.5 text-zinc-300 border-l border-ide-border pl-2">
            {activeTab.modified && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            <span className="truncate max-w-[150px]">{activeTab.name}</span>
          </span>
        )}
        
        {activeTab && (
          <span className="text-zinc-500">
            Ln 1, Col 1
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {(notifications.filter(n => n.type === 'error').length > 0 || diagnostics.filter(d => d.severity === 'error').length > 0) && (
          <button
            onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'problems' })}
            className="flex items-center gap-1 text-red-400 hover:bg-red-950/40 px-1.5 py-0.5 rounded transition-colors"
          >
            <AlertCircle size={11} />
            <span>
              {notifications.filter(n => n.type === 'error').length + diagnostics.filter(d => d.severity === 'error').length}
            </span>
          </button>
        )}
        
        {notifications.filter(n => n.type === 'warning').length > 0 && (
          <button
            onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'problems' })}
            className="flex items-center gap-1 text-amber-400 hover:bg-amber-950/40 px-1.5 py-0.5 rounded transition-colors"
          >
            <AlertCircle size={11} />
            <span>{notifications.filter(n => n.type === 'warning').length}</span>
          </button>
        )}
        
        {runtimeRunning ? (
          <a
            href={runtimeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 px-1.5 py-0.5 rounded transition-colors"
          >
            <Wifi size={11} />
            <span>{runtimeUrl ? 'Live Preview' : 'Runtime Active'}</span>
          </a>
        ) : (
          <span className="flex items-center gap-1 text-zinc-500">
            <WifiOff size={11} />
            <span>Stopped</span>
          </span>
        )}
        
        <span className="text-zinc-500 border-l border-ide-border pl-2">
          UTF-8
        </span>

        <span className="text-zinc-500">
          {settings.theme === 'vs-dark' ? 'Dark Modern' : settings.theme === 'vs-light' ? 'Light' : settings.theme}
        </span>
      </div>
    </div>
  );
}

