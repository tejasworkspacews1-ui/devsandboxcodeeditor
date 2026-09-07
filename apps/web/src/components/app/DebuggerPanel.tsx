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
import React, { useState, useEffect } from 'react';
import { Bug, Play, Pause, StepForward, StepBack, RotateCw, X, ChevronRight, FileText, Clock } from 'lucide-react';
import { useAppStore } from '../../stores';

interface Breakpoint {
  id: string;
  fileId: string;
  lineNumber: number;
  enabled: boolean;
  condition?: string;
}

export function DebuggerPanel() {
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const activeTab = useAppStore(s => s.tabs.find(t => t.id === s.activeTabId));
  const activeFile = useAppStore(s => s.files.find(f => f.id === activeTab?.fileId));
  
  const handleToggleBreakpoint = (lineNumber: number) => {
    const existing = breakpoints.find(b => b.fileId === activeFile?.id && b.lineNumber === lineNumber);
    if (existing) {
      setBreakpoints(prev => prev.filter(b => b.id !== existing.id));
    } else {
      setBreakpoints(prev => [...prev, {
        id: `bp_${Date.now()}`,
        fileId: activeFile?.id || '',
        lineNumber,
        enabled: true,
      }]);
    }
  };
  
  const handleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setCurrentLine(1);
      setCallStack(['main()']);
      setVariables({ x: 0, y: 10 });
    } else {
      setCurrentLine(null);
      setCallStack([]);
      setVariables({});
    }
  };
  
  const handleStepOver = () => {
    setCurrentLine(prev => (prev ? prev + 1 : 1));
  };
  
  const handleStepInto = () => {
    setCurrentLine(prev => (prev ? prev + 1 : 1));
    setCallStack(prev => [...prev, `function_${prev.length}()`]);
  };
  
  const handleStepOut = () => {
    setCallStack(prev => prev.slice(0, -1));
  };
  
  const handleRestart = () => {
    setIsRunning(false);
    setCurrentLine(null);
    setCallStack([]);
    setVariables({});
  };
  
  const fileBreakpoints = breakpoints.filter(b => b.fileId === activeFile?.id);
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border flex items-center gap-2">
        <Bug size={18} className="text-ide-accent" />
        <span className="text-sm font-semibold text-ide-text">Debugger</span>
        {currentLine && (
          <span className="text-xs text-ide-textSecondary ml-auto">
            Line {currentLine}
          </span>
        )}
      </div>
      
      <div className="px-4 py-2 border-b border-ide-border flex items-center gap-1">
        <button
          onClick={handleRun}
          className={`p-1.5 rounded transition-colors ${isRunning ? 'text-yellow-400 hover:bg-yellow-900/20' : 'text-green-400 hover:bg-green-900/20'}`}
          title={isRunning ? 'Pause' : 'Run'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={handleStepOver} className="p-1.5 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors" title="Step Over">
          <StepForward size={16} />
        </button>
        <button onClick={handleStepInto} className="p-1.5 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors" title="Step Into">
          <ChevronRight size={16} />
        </button>
        <button onClick={handleStepOut} className="p-1.5 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors" title="Step Out">
          <StepBack size={16} />
        </button>
        <button onClick={handleRestart} className="p-1.5 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors ml-auto" title="Restart">
          <RotateCw size={16} />
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-ide-border">
          <div className="px-4 py-2 border-b border-ide-border">
            <h4 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider">Breakpoints</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            {fileBreakpoints.length === 0 ? (
              <div className="px-4 py-8 text-center text-ide-textSecondary text-sm">
                <Bug size={32} className="mx-auto mb-2 opacity-30" />
                <p>No breakpoints</p>
                <p className="text-xs mt-1">Click in the gutter to add one</p>
              </div>
            ) : (
              fileBreakpoints.map(bp => (
                <div key={bp.id} className="flex items-center gap-2 px-4 py-2 hover:bg-ide-hover">
                  <div 
                    className="w-3 h-3 rounded-full cursor-pointer"
                    style={{ backgroundColor: bp.enabled ? '#0078d4' : '#424242' }}
                    onClick={() => setBreakpoints(prev => prev.map(b => b.id === bp.id ? { ...b, enabled: !b.enabled } : b))}
                  />
                  <span className="text-sm text-ide-text">Line {bp.lineNumber}</span>
                  {bp.condition && <span className="text-xs text-ide-textSecondary ml-auto">{bp.condition}</span>}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-ide-border">
            <h4 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider">Call Stack</h4>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {callStack.length === 0 ? (
              <div className="text-center text-ide-textSecondary text-sm py-4">
                <FileText size={24} className="mx-auto mb-1 opacity-30" />
                <p>No stack</p>
              </div>
            ) : (
              callStack.map((frame, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                  <ChevronRight size={12} className="text-ide-textSecondary" />
                  <span className="text-ide-text font-mono">{frame}</span>
                </div>
              ))
            )}
          </div>
          
          <div className="px-4 py-2 border-t border-ide-border">
            <h4 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider mb-2">Variables</h4>
            <div className="space-y-1">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 px-2 py-1 text-sm">
                  <span className="text-ide-textSecondary font-mono">{key}:</span>
                  <span className="text-ide-text font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
