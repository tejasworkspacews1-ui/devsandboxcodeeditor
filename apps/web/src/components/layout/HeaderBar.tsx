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
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 transition-colors font-medium flex-shrink-0"
          title="Switch Tenant Workspace"
        >
          <Building2 size={12} />
          <span className="truncate max-w-[140px]">{activeTenant?.name || 'Workspace'}</span>
        </button>

        <span className="text-ide-border font-light select-none">/</span>

        <span className="font-semibold text-ide-text truncate">
          {currentProject?.name || 'DevSandbox'}
        </span>

        {currentProject && (
          <span className="hidden md:inline-block text-[10px] text-ide-textSecondary px-1.5 py-0.2 rounded bg-ide-sidebar border border-ide-border">
            {currentProject.files.length} files
          </span>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePreview}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
            showPreview 
              ? 'bg-ide-accent text-white shadow-sm' 
              : 'bg-ide-sidebar text-ide-text border border-ide-border hover:bg-ide-hover'
          }`}
          title="Toggle In-Browser Live Preview"
        >
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </button>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded transition-colors disabled:opacity-50 ${
            runtimeRunning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
          title={runtimeRunning ? 'Stop Server' : 'Run Project In Sandbox'}
        >
          {isLoading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : runtimeRunning ? (
            <Square size={13} />
          ) : (
            <Play size={13} />
          )}
          <span>{isLoading ? 'Starting...' : runtimeRunning ? 'Stop' : 'Run'}</span>
        </button>

        {/* User Badge */}
        <button
          onClick={handleOpenAccount}
          className="flex items-center gap-1.5 pl-2 border-l border-ide-border text-ide-textSecondary hover:text-ide-text transition-colors"
          title="Multi-Tenant Account & Dashboard"
        >
          <div className="w-5 h-5 rounded-full bg-ide-accent flex items-center justify-center text-white text-[10px] font-bold">
            {(user?.name || 'Tejas').charAt(0).toUpperCase()}
          </div>
          <span className="hidden lg:inline text-[11px] font-medium text-ide-text">
            {user?.name || 'Tejas Kamble'}
          </span>
        </button>
      </div>
    </div>
  );
}
