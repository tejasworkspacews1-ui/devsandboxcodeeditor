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
import { 
  Play, Square, Loader2, Eye, EyeOff, Building2, 
  Sparkles, CheckCircle2, Shield, User
} from 'lucide-react';
import { useAppStore } from '../../stores';
import { api } from '../../services/api';

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
  const setLayout = useAppStore(s => s.setLayout);
  const user = useAppStore(s => s.user);

  const currentProject = projects.find(p => p.id === currentProjectId);
  const activeTenant = api.getActiveTenant();

  const handleRun = async () => {
    if (runtimeRunning) {
      await stopProject();
    } else {
      await startProject();
    }
  };

  const handleOpenAccount = () => {
    setLayout({ activeView: 'account', sidebarCollapsed: false });
  };

  return (
    <div className="h-10 bg-ide-panel border-b border-ide-border flex items-center justify-between px-3 flex-shrink-0 select-none text-xs">
      {/* Left: Project & Tenant Info */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={handleOpenAccount}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-750 transition-colors font-medium flex-shrink-0"
          title="Switch Tenant Workspace"
        >
          <Building2 size={12} className="text-zinc-400" />
          <span className="truncate max-w-[140px]">{activeTenant?.name || 'Workspace'}</span>
        </button>

        <span className="text-zinc-600 font-light select-none">/</span>

        <span className="font-semibold text-zinc-200 truncate">
          {currentProject?.name || 'DevSandbox'}
        </span>

        {currentProject && (
          <span className="hidden md:inline-block text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/60">
            {currentProject.files.length} files
          </span>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePreview}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
            showPreview 
              ? 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-750 shadow-sm' 
              : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
          title="Toggle In-Browser Live Preview"
        >
          {showPreview ? <EyeOff size={13} className="text-zinc-400" /> : <Eye size={13} className="text-zinc-400" />}
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </button>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded text-xs transition-colors disabled:opacity-50 ${
            runtimeRunning
              ? 'bg-red-600/90 hover:bg-red-600 text-white'
              : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-sm'
          }`}
          title={runtimeRunning ? 'Stop Server' : 'Run Project In Sandbox'}
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : runtimeRunning ? (
            <Square size={12} />
          ) : (
            <Play size={12} />
          )}
          <span>{isLoading ? 'Starting...' : runtimeRunning ? 'Stop' : 'Run'}</span>
        </button>

        {/* User Badge */}
        <button
          onClick={handleOpenAccount}
          className="flex items-center gap-1.5 pl-2 border-l border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Multi-Tenant Account & Dashboard"
        >
          <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-600/80 flex items-center justify-center text-zinc-100 text-[10px] font-semibold">
            {(user?.name || 'Tejas').charAt(0).toUpperCase()}
          </div>
          <span className="hidden lg:inline text-[11px] font-medium text-zinc-300">
            {user?.name || 'Tejas Kamble'}
          </span>
        </button>
      </div>
    </div>
  );
}
