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
import { Play, Square, Loader2, Rocket } from 'lucide-react';
import { useAppStore } from '../../stores';

export function HeaderBar() {
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  const runtimeUrl = useAppStore(s => s.runtimeUrl);
  const isLoading = useAppStore(s => s.isLoading);
  const startProject = useAppStore(s => s.startProject);
  const stopProject = useAppStore(s => s.stopProject);
  const currentProjectId = useAppStore(s => s.currentProjectId);
  const projects = useAppStore(s => s.projects);
  const togglePreview = useAppStore(s => s.togglePreview);
  const showPreview = useAppStore(s => s.showPreview);
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  
  const handleRun = async () => {
    if (runtimeRunning) {
      await stopProject();
    } else {
      await startProject();
    }
  };
  
  return (
    <div className="h-10 bg-ide-panel border-b border-ide-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-ide-text truncate">
          {currentProject?.name || 'DevSandbox'}
        </span>
        {currentProject && (
          <span className="text-xs text-ide-textSecondary">
            {currentProject.files.length} files
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {runtimeUrl && (
          <button
            onClick={togglePreview}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              showPreview 
                ? 'bg-ide-accent text-white' 
                : 'bg-ide-sidebar text-ide-text border border-ide-border hover:bg-ide-hover'
            }`}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        )}
        
        <button
          onClick={handleRun}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50 ${
            runtimeRunning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : runtimeRunning ? (
            <Square size={14} />
          ) : (
            <Play size={14} />
          )}
          {isLoading ? 'Starting...' : runtimeRunning ? 'Stop' : 'Run'}
        </button>
      </div>
    </div>
  );
}
