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
import React, { useRef, useCallback } from 'react';
import { Terminal, AlertTriangle, FileText, List, ChevronDown, ChevronUp, Maximize2, Minimize2, X } from 'lucide-react';
import { useAppStore } from '../../stores';
import { TerminalPanel } from '../terminal/TerminalPanel';
import { SearchPanel } from '../search/SearchPanel';

export function BottomPanel() {
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const notifications = useAppStore(s => s.notifications);
  const diagnostics = useAppStore(s => s.diagnostics);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(200);

  const activeTab = layout.bottomTab || 'terminal';
  const isMaximized = (layout.panelHeight || 200) >= 480;

  // Resizing logic for panel height
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = layout.panelHeight || 200;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaY = startY.current - moveEvent.clientY;
      const newHeight = Math.min(Math.max(120, startHeight.current + deltaY), window.innerHeight * 0.7);
      setLayout({ panelHeight: newHeight, panelCollapsed: false });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [layout.panelHeight, setLayout]);

  const toggleMaximize = () => {
    if (isMaximized) {
      setLayout({ panelHeight: 200, panelCollapsed: false });
    } else {
      setLayout({ panelHeight: Math.min(480, window.innerHeight * 0.65), panelCollapsed: false });
    }
  };

  const errorCount = notifications.filter(n => n.type === 'error').length + diagnostics.filter(d => d.severity === 'error').length;
  const warnCount = notifications.filter(n => n.type === 'warning').length;

  if (layout.panelCollapsed) {
    return (
      <div className="h-7 bg-[#141416] border-t border-ide-border flex items-center justify-between px-2 flex-shrink-0 select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'terminal' })}
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
          >
            <Terminal size={12} className="text-zinc-400" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'problems' })}
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
          >
            <AlertTriangle size={12} className="text-zinc-400" />
            <span>Problems</span>
            {errorCount > 0 && (
              <span className="px-1 text-[10px] bg-red-950 text-red-300 rounded">{errorCount}</span>
            )}
          </button>
          <button
            onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'output' })}
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
          >
            <List size={12} className="text-zinc-400" />
            <span>Output</span>
          </button>
        </div>

        <button
          onClick={() => setLayout({ panelCollapsed: false })}
          className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
          title="Expand Panel"
        >
          <ChevronUp size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ height: `${layout.panelHeight || 200}px` }}
      className="bg-[#141416] border-t border-ide-border flex flex-col flex-shrink-0 select-none overflow-hidden relative"
    >
      {/* Resizer Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="h-1 w-full cursor-row-resize hover:bg-blue-500/50 active:bg-blue-500 transition-colors absolute top-0 left-0 right-0 z-20"
        title="Drag to resize panel"
      />

      {/* Tabs Header */}
      <div className="flex items-center gap-1 px-2 pt-1 pb-0.5 bg-[#18181b] border-b border-ide-border flex-shrink-0">
        <BottomTab id="terminal" label="Terminal" icon={<Terminal size={12} />} activeTab={activeTab} />
        <BottomTab
          id="problems"
          label="Problems"
          icon={<AlertTriangle size={12} />}
          badge={errorCount + warnCount}
          activeTab={activeTab}
        />
        <BottomTab id="output" label="Output" icon={<List size={12} />} activeTab={activeTab} />
        <BottomTab id="search" label="Search" icon={<FileText size={12} />} activeTab={activeTab} />

        <div className="flex-1" />

        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleMaximize}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
            title={isMaximized ? "Restore Height" : "Maximize Panel"}
          >
            {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={() => setLayout({ panelCollapsed: true })}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
            title="Minimize Panel"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-hidden relative bg-[#18181b]">
        {activeTab === 'terminal' && <TerminalPanel />}
        {activeTab === 'problems' && <ProblemsPanel />}
        {activeTab === 'output' && <OutputPanel />}
        {activeTab === 'search' && <SearchPanel />}
      </div>
    </div>
  );
}

function BottomTab({
  id,
  label,
  icon,
  badge,
  activeTab,
}: {
  id: 'terminal' | 'problems' | 'output' | 'search';
  label: string;
  icon: React.ReactNode;
  badge?: number;
  activeTab: string;
}) {
  const setLayout = useAppStore(s => s.setLayout);
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setLayout({ bottomTab: id, panelCollapsed: false })}
      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-t transition-colors font-medium ${
        isActive
          ? 'bg-[#18181b] text-zinc-100 border-b-2 border-b-blue-400'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-1 px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded text-[10px] font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}

function ProblemsPanel() {
  const diagnostics = useAppStore(s => s.diagnostics);
  const files = useAppStore(s => s.files);

  if (diagnostics.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs gap-1">
        <span>No problems detected in workspace files.</span>
        <span className="text-[11px] text-zinc-500">Syntax checks, TypeScript validations, and lint errors will appear here.</span>
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
          className="w-full text-left px-4 py-2 border-b border-zinc-800 flex items-start gap-2 hover:bg-zinc-800/50 transition-colors"
        >
          <AlertTriangle size={13} className={`mt-0.5 flex-shrink-0 ${diag.severity === 'error' ? 'text-red-400' : 'text-amber-400'}`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-200 truncate">{diag.message}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
              <span className="text-zinc-300 font-mono">{getFileName(diag.fileId)}</span>
              <span>Line {diag.line}, Col {diag.column}</span>
              {diag.code && <span className="px-1 bg-zinc-800 rounded text-[10px]">{diag.code}</span>}
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

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-1 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
        <span>Build & Runtime Output</span>
        <button
          onClick={clearRuntimeLogs}
          className="text-zinc-400 hover:text-zinc-200 px-2 py-0.5 hover:bg-zinc-800 rounded transition-colors"
        >
          Clear Output
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-zinc-300 select-text">
        {runtimeLogs.length === 0 ? (
          <div className="text-zinc-500 italic">No output generated yet. Run project to view build and execution logs.</div>
        ) : (
          runtimeLogs.map((log, idx) => (
            <div key={idx} className="py-0.5 leading-relaxed font-mono">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
