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
import { Play, Square, RotateCw, Download, Terminal, ExternalLink, AlertCircle, CheckCircle2, Loader2, FileCode } from 'lucide-react';
import { useAppStore } from '../../stores';
import { Button } from '../ui/Primitives';

export function RuntimePanel() {
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  const runtimeUrl = useAppStore(s => s.runtimeUrl);
  const runtimeLogs = useAppStore(s => s.runtimeLogs);
  const isLoading = useAppStore(s => s.isLoading);
  const startProject = useAppStore(s => s.startProject);
  const stopProject = useAppStore(s => s.stopProject);
  const addRuntimeLog = useAppStore(s => s.addRuntimeLog);
  const addNotification = useAppStore(s => s.addNotification);
  const currentProjectId = useAppStore(s => s.currentProjectId);
  const projects = useAppStore(s => s.projects);
  const files = useAppStore(s => s.files);
  
  const [installInput, setInstallInput] = useState('');
  const [installing, setInstalling] = useState(false);
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  
  const handleStart = async () => {
    await startProject();
  };
  
  const handleStop = async () => {
    await stopProject();
  };
  
  const handleInstall = async () => {
    if (!installInput.trim()) return;
    setInstalling(true);
    addRuntimeLog(`$ npm install ${installInput}`);
    
    try {
      const { getWebContainer, installDependencies } = await import('../../services/webcontainer');
      const container = getWebContainer();
      if (!container) {
        throw new Error('WebContainer not booted. Start the project first.');
      }
      await installDependencies(container, (output) => {
        addRuntimeLog(output);
      });
      addNotification({ type: 'success', message: `Installed ${installInput}` });
    } catch (err) {
      addRuntimeLog(`Error: ${err instanceof Error ? err.message : 'Install failed'}`);
      addNotification({ type: 'error', message: err instanceof Error ? err.message : 'Install failed' });
    } finally {
      setInstalling(false);
      setInstallInput('');
    }
  };
  
  const hasPackageJson = currentProject?.files.some(f => f.name === 'package.json');
  const hasIndexHtml = currentProject?.files.some(f => f.name === 'index.html');
  const hasPython = currentProject?.files.some(f => f.name.endsWith('.py'));
  const hasGo = currentProject?.files.some(f => f.name.endsWith('.go'));
  const hasRust = currentProject?.files.some(f => f.name.endsWith('.rs'));
  const hasRuby = currentProject?.files.some(f => f.name.endsWith('.rb'));
  const hasPhp = currentProject?.files.some(f => f.name.endsWith('.php'));
  const hasJs = currentProject?.files.some(f => f.name.endsWith('.js'));
  const hasTs = currentProject?.files.some(f => f.name.endsWith('.ts'));
  
  const hasAnyFile = currentProject && currentProject.files.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border">
        <h3 className="text-sm font-semibold text-ide-text mb-3">Runtime</h3>
        
        <div className="flex items-center gap-2 mb-3">
          {!runtimeRunning ? (
            <Button onClick={handleStart} disabled={isLoading || !hasAnyFile} size="sm">
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isLoading ? 'Starting...' : 'Start Project'}
            </Button>
          ) : (
            <Button onClick={handleStop} variant="danger" size="sm">
              <Square size={14} />
              Stop
            </Button>
          )}
          
          {runtimeRunning && (
            <Button onClick={handleStart} variant="secondary" size="sm" disabled={isLoading}>
              <RotateCw size={14} />
              Restart
            </Button>
          )}
          
          {runtimeUrl && (
            <a
              href={runtimeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-ide-sidebar text-ide-text border border-ide-border rounded hover:bg-ide-hover transition-colors"
            >
              <ExternalLink size={14} />
              Open Preview
            </a>
          )}
        </div>
        
        {!hasAnyFile && (
          <div className="flex items-start gap-2 px-3 py-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-200">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>No files found. Create a file to run your project.</span>
          </div>
        )}
        
        {hasAnyFile && !hasPackageJson && (
          <div className="flex items-start gap-2 px-3 py-2 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-200">
            <FileCode size={14} className="flex-shrink-0 mt-0.5" />
            <span>No package.json detected. The runtime will try to serve your files directly.</span>
          </div>
        )}
        
        {runtimeRunning && (
          <div className="flex items-start gap-2 px-3 py-2 bg-green-900/20 border border-green-700/30 rounded text-xs text-green-200">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Project is running</div>
              {runtimeUrl && <div className="font-mono mt-0.5">{runtimeUrl}</div>}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-b border-ide-border">
        <h4 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider mb-2">Install Package</h4>
        <div className="flex items-center gap-2">
          <input
            value={installInput}
            onChange={(e) => setInstallInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleInstall(); }}
            placeholder="package-name"
            className="flex-1 px-2 py-1 bg-ide-bg border border-ide-border rounded text-sm text-ide-text outline-none focus:border-ide-accent"
            disabled={installing}
          />
          <Button onClick={handleInstall} disabled={installing || !installInput.trim()} size="sm">
            {installing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Install
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-ide-border flex items-center gap-2">
          <Terminal size={12} className="text-ide-textSecondary" />
          <span className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider">Output</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-ide-textSecondary">
          {runtimeLogs.length === 0 ? (
            <div className="text-ide-textSecondary/50 italic">No output yet</div>
          ) : (
            runtimeLogs.map((log, idx) => (
              <div key={idx} className="py-0.5 whitespace-pre-wrap break-all">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
