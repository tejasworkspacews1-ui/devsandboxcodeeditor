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
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  return (
    <div className="h-6 bg-ide-accent flex items-center justify-between px-3 text-xs text-white select-none">
      <div className="flex items-center gap-3">
        {activeTab && (
          <span className="flex items-center gap-1">
            {activeTab.modified && <span className="w-2 h-2 rounded-full bg-white" />}
            <span>{activeTab.name}</span>
          </span>
        )}
        {activeTab && (
          <span className="text-white/70">
            Ln 1, Col 1
          </span>
        )}
        <span className="text-white/50">
          {settings.theme === 'vs-dark' ? 'Dark+' : settings.theme === 'vs-light' ? 'Light+' : settings.theme}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {notifications.filter(n => n.type === 'error').length > 0 && (
          <span className="flex items-center gap-1 text-red-300">
            <AlertCircle size={12} />
            {notifications.filter(n => n.type === 'error').length}
          </span>
        )}
        
        {notifications.filter(n => n.type === 'warning').length > 0 && (
          <span className="flex items-center gap-1 text-yellow-300">
            <AlertCircle size={12} />
            {notifications.filter(n => n.type === 'warning').length}
          </span>
        )}
        
        {diagnostics.filter(d => d.severity === 'error').length > 0 && (
          <span className="flex items-center gap-1 text-red-300">
            <AlertCircle size={12} />
            {diagnostics.filter(d => d.severity === 'error').length}
          </span>
        )}
        
        <span className="flex items-center gap-1">
          <GitBranch size={12} />
          main
        </span>
        
        {runtimeRunning ? (
          <a href={runtimeUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-300 hover:text-green-200">
            <Wifi size={12} />
            {runtimeUrl ? 'Preview' : 'Running'}
          </a>
        ) : (
          <span className="flex items-center gap-1 text-white/50">
            <WifiOff size={12} />
            Stopped
          </span>
        )}
        
        <span className="text-white/50">
          UTF-8
        </span>
      </div>
    </div>
  );
}

