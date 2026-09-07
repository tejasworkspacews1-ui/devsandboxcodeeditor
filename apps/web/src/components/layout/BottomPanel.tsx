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
import { Terminal, AlertTriangle, FileText, List } from 'lucide-react';
import { useAppStore } from '../../stores';
import { TerminalPanel } from '../terminal/TerminalPanel';
import { SearchPanel } from '../search/SearchPanel';

type BottomPanelTab = 'terminal' | 'problems' | 'output' | 'search';

export function BottomPanel() {
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const notifications = useAppStore(s => s.notifications);
  const runtimeLogs = useAppStore(s => s.runtimeLogs);
  const showSearch = useAppStore(s => s.showSearch);
  const showSettings = useAppStore(s => s.showSettings);
  
  const activeView = layout.panelCollapsed ? 'terminal' : layout.activeView;
  
  if (layout.panelCollapsed) {
    return (
      <div className="h-8 bg-ide-panel border-t border-ide-border flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLayout({ panelCollapsed: false })}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors"
          >
            <Terminal size={12} />
            Terminal
          </button>
        </div>
        <div className="flex items-center gap-2 text-ide-textSecondary">
          {notifications.filter(n => n.type === 'error').length > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <AlertTriangle size={12} className="text-red-400" />
              {notifications.filter(n => n.type === 'error').length}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-64 bg-ide-panel border-t border-ide-border flex flex-col">
      <div className="flex items-center gap-1 px-2 py-1 bg-ide-sidebar border-b border-ide-border">
        <BottomTab id="terminal" label="Terminal" icon={<Terminal size={12} />} />
        <BottomTab id="problems" label="Problems" icon={<AlertTriangle size={12} />} badge={notifications.filter(n => n.type === 'error' || n.type === 'warning').length} />
        <BottomTab id="output" label="Output" icon={<List size={12} />} />
        <BottomTab id="search" label="Search" icon={<FileText size={12} />} />
        
        <div className="flex-1" />
        <button
          onClick={() => setLayout({ panelCollapsed: true })}
          className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors"
          title="Close Panel"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {layout.activeView === 'terminal' && <TerminalPanel />}
        {layout.activeView === 'search' && <SearchPanel />}
        {layout.activeView === 'problems' && <ProblemsPanel />}
        {layout.activeView === 'output' && <OutputPanel />}
      </div>
    </div>
  );
}

function BottomTab({ id, label, icon, badge }: { id: string; label: string; icon: React.ReactNode; badge?: number }) {
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const isActive = !layout.panelCollapsed && layout.activeView === id;
  
  return (
    <button
      onClick={() => setLayout({ panelCollapsed: false, activeView: id as any })}
      className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${isActive ? 'bg-ide-bg text-ide-text' : 'text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover'}`}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-ide-border rounded text-[10px] text-ide-text">{badge}</span>
      )}
    </button>
  );
}

function ProblemsPanel() {
  const diagnostics = useAppStore(s => s.diagnostics);
  const files = useAppStore(s => s.files);
  
  if (diagnostics.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-ide-textSecondary text-sm">
        No problems detected
      </div>
    );
  }
  
  const getFileName = (fileId: string) => {
    const file = files.find(f => f.id === fileId || f.path === fileId);
    return file?.name || fileId;
  };
  
  return (
    <div className="h-full overflow-y-auto">
      {diagnostics.map((diag, idx) => (
        <button
          key={idx}
          onClick={() => {
            const file = files.find(f => f.id === diag.fileId || f.path === diag.fileId);
            if (file) {
              const store = useAppStore.getState();
              store.addTab({
                id: `tab_${file.id}`,
                fileId: file.id,
                name: file.name,
                path: file.path,
                content: file.content || '',
                language: file.name.split('.').pop() || 'plaintext',
                modified: false,
                pinned: false,
              });
            }
          }}
          className="w-full text-left px-4 py-2 border-b border-ide-border/50 flex items-start gap-2 hover:bg-ide-hover transition-colors"
        >
          <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${diag.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`} />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-ide-text truncate">{diag.message}</div>
            <div className="text-xs text-ide-textSecondary mt-0.5 flex items-center gap-2">
              <span>{getFileName(diag.fileId)}</span>
              <span>Line {diag.line}, Col {diag.column}</span>
              {diag.code && <span className="px-1 bg-ide-border rounded text-[10px]">{diag.code}</span>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function OutputPanel() {
  const runtimeLogs = useAppStore(s => s.runtimeLogs);
  const clearRuntimeLogs = useAppStore(s => s.clearRuntimeLogs);
  
  if (runtimeLogs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-ide-textSecondary text-sm">
        No output yet
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-y-auto p-2 font-mono text-xs text-ide-textSecondary">
      <div className="flex justify-end mb-2">
        <button onClick={clearRuntimeLogs} className="text-xs text-ide-textSecondary hover:text-ide-text px-2 py-1 hover:bg-ide-hover rounded">Clear</button>
      </div>
      {runtimeLogs.map((log, idx) => (
        <div key={idx} className="py-0.5">{log}</div>
      ))}
    </div>
  );
}

