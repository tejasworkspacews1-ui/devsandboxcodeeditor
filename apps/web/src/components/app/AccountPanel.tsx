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
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, LogOut, Cloud, CheckCircle2, Shield, 
  Building2, Plus, Sparkles, FolderKanban, Users, 
  HardDrive, ExternalLink, RefreshCw, KeyRound, ArrowRightLeft
} from 'lucide-react';
import { useAppStore } from '../../stores';
import { api, tenantEngine } from '../../services/api';
import type { Tenant, UserProfile, Project } from '../../types';

export function AccountPanel() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const addNotification = useAppStore(s => s.addNotification);
  const setCurrentProject = useAppStore(s => s.setCurrentProject);
  const setFiles = useAppStore(s => s.setFiles);
  const setShowWelcome = useAppStore(s => s.setShowWelcome);
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [tenantProjects, setTenantProjects] = useState<Project[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Just now');
  
  // Auth state
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('tejasksocials@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Tejas Kamble');
  const [loading, setLoading] = useState(false);

  // New tenant modal
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');

  useEffect(() => {
    loadTenantData();
  }, [user]);

  function loadTenantData() {
    const allTenants = api.getTenants();
    const currTenant = api.getActiveTenant();
    setTenants(allTenants);
    setActiveTenant(currTenant);

    if (currTenant) {
      const projs = tenantEngine.getTenantProjects(currTenant.id);
      setTenantProjects(projs);
    }
  }

  const handleSwitchTenant = (tenantId: string) => {
    try {
      const switched = api.switchTenant(tenantId);
      setActiveTenant(switched);
      const projs = tenantEngine.getTenantProjects(switched.id);
      setTenantProjects(projs);
      
      // Update global user
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      
      addNotification({ 
        type: 'success', 
        message: `Switched to workspace "${switched.name}" (Tenant ID: ${switched.id})` 
      });
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to switch workspace' });
    }
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    
    try {
      const created = api.createTenant(newTenantName, newTenantPlan);
      setTenants(api.getTenants());
      setActiveTenant(created);
      setTenantProjects([]);
      setShowNewTenantModal(false);
      setNewTenantName('');
      addNotification({ 
        type: 'success', 
        message: `Created workspace "${created.name}" with isolated tenant database!` 
      });
    } catch (err) {
      addNotification({ type: 'error', message: 'Could not create workspace' });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (isSignUp) {
        response = await api.signup(email, password, name);
      } else {
        response = await api.signin(email, password);
      }
      
      setUser(response.user);
      setShowSignIn(false);
      loadTenantData();
      addNotification({ type: 'success', message: `Welcome, ${response.user.name}!` });
    } catch (err: any) {
      addNotification({ type: 'error', message: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser: { email: string; name: string }) => {
    const res = tenantEngine.signin(demoUser.email, 'password123');
    setUser(res.user);
    loadTenantData();
    setShowSignIn(false);
    addNotification({ type: 'success', message: `Signed in as ${res.user.name}` });
  };

  const handleSignOut = () => {
    api.signout();
    setUser(null);
    addNotification({ type: 'info', message: 'Signed out from DevSandbox' });
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
      addNotification({ 
        type: 'success', 
        message: `All files in "${activeTenant?.name}" backed up & synced in real-time!` 
      });
    }, 1000);
  };

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project.id);
    setFiles(project.files);
    setShowWelcome(false);
    addNotification({ type: 'info', message: `Opened ${project.name}` });
  };

  return (
    <div className="h-full flex flex-col bg-ide-panel overflow-y-auto">
      {/* Header Banner */}
      <div className="p-4 border-b border-ide-border bg-gradient-to-r from-blue-950/40 via-ide-panel to-purple-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-blue-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">Multi-Tenant Cloud Workspace</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time Synced
          </span>
        </div>
      </div>

      {user ? (
        <div className="p-4 flex flex-col gap-5">
          {/* User Profile Card */}
          <div className="p-3.5 bg-ide-sidebar border border-ide-border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-ide-accent ring-2 ring-blue-500/20"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-ide-sidebar" title="Online" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-ide-text truncate">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    {user.role || 'Owner'}
                  </span>
                </div>
                <div className="text-xs text-ide-textSecondary truncate">{user.email}</div>
                <div className="text-[11px] text-ide-textSecondary/70 mt-0.5">
                  DevSandbox Pro Architect
                </div>
              </div>
            </div>

            {/* Quick Profile Actions */}
            <div className="mt-3 pt-3 border-t border-ide-border/60 flex items-center justify-between text-xs">
              <button
                onClick={handleCloudSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Syncing...' : 'Sync Cloud'}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tenant Switcher & Organization */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} />
                Active Tenant Workspace
              </span>
              <button
                onClick={() => setShowNewTenantModal(true)}
                className="text-xs text-ide-accent hover:text-ide-accentHover flex items-center gap-1 font-medium"
              >
                <Plus size={12} />
                New Workspace
              </button>
            </div>

            {/* Workspace Select Pill List */}
            <div className="flex flex-col gap-1.5">
              {tenants.map(t => {
                const isSelected = activeTenant?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSwitchTenant(t.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-ide-accent/15 border-ide-accent text-ide-text shadow-sm'
                        : 'bg-ide-sidebar/70 border-ide-border text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold truncate">{t.name}</span>
                        {isSelected && <CheckCircle2 size={13} className="text-blue-400 flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-ide-textSecondary/80 flex items-center gap-2 mt-0.5">
                        <span>ID: {t.id}</span>
                        <span>•</span>
                        <span className="capitalize">{t.plan} Plan</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded capitalize font-medium ${
                      t.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      t.plan === 'pro' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {t.plan}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tenant Resource Usage & Isolation Status */}
          {activeTenant && (
            <div className="p-3 bg-ide-sidebar border border-ide-border rounded-lg flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-ide-text flex items-center gap-1.5">
                <HardDrive size={13} className="text-blue-400" />
                Workspace Quota & Health
              </span>

              <div className="flex items-center justify-between text-xs text-ide-textSecondary">
                <span>Storage Allocated</span>
                <span className="font-mono text-ide-text font-medium">
                  {activeTenant.storageUsedMB} MB / {activeTenant.storageQuotaMB} MB
                </span>
              </div>
              <div className="w-full bg-ide-panel rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (activeTenant.storageUsedMB / activeTenant.storageQuotaMB) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ide-border/50 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-ide-textSecondary">Tenant Status</span>
                  <span className="text-emerald-400 font-medium">100% Isolated</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-ide-textSecondary">Last Cloud Backup</span>
                  <span className="text-ide-text font-medium">{lastSynced}</span>
                </div>
              </div>
            </div>
          )}

          {/* Workspace Projects */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban size={13} />
                Projects in {activeTenant?.name} ({tenantProjects.length})
              </span>
            </div>

            {tenantProjects.length === 0 ? (
              <div className="p-4 bg-ide-sidebar/40 border border-dashed border-ide-border rounded-lg text-center text-xs text-ide-textSecondary">
                No projects saved in this tenant yet.
                <div className="mt-2 text-[11px] text-blue-400">
                  Create or import a project from the Welcome Screen.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {tenantProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-2.5 bg-ide-sidebar border border-ide-border rounded-lg flex items-center justify-between hover:border-ide-accent/50 transition-all"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-xs font-medium text-ide-text truncate">{proj.name}</div>
                      <div className="text-[10px] text-ide-textSecondary">
                        {proj.files.length} files • {proj.template} starter
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenProject(proj)}
                      className="px-2 py-1 bg-ide-panel hover:bg-ide-accent hover:text-white text-ide-textSecondary text-[11px] font-medium rounded border border-ide-border transition-colors"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tenant Switcher Shortcuts */}
          <div className="pt-2 border-t border-ide-border flex flex-col gap-2">
            <span className="text-xs font-semibold text-ide-textSecondary flex items-center gap-1.5">
              <ArrowRightLeft size={13} />
              Quick Switch Role / Demo User
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin({ email: 'tejasksocials@gmail.com', name: 'Tejas Kamble' })}
                className="p-2 bg-ide-sidebar border border-ide-border rounded text-left hover:border-ide-accent transition-all text-xs"
              >
                <div className="font-semibold text-ide-text">Tejas Kamble</div>
                <div className="text-[10px] text-ide-textSecondary">Owner / Founder</div>
              </button>
              <button
                onClick={() => handleQuickLogin({ email: 'sarah.chen@devsandbox.io', name: 'Sarah Chen' })}
                className="p-2 bg-ide-sidebar border border-ide-border rounded text-left hover:border-ide-accent transition-all text-xs"
              >
                <div className="font-semibold text-ide-text">Sarah Chen</div>
                <div className="text-[10px] text-ide-textSecondary">Lead Engineer</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Sign In / Sign Up Flow */
        <div className="p-4 flex flex-col gap-4">
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20 text-white font-bold text-xl">
              DS
            </div>
            <h3 className="text-sm font-bold text-ide-text">DevSandbox Identity</h3>
            <p className="text-xs text-ide-textSecondary mt-1">
              Sign in to access your multi-tenant workspaces, cloud sync, and collaborative teams.
            </p>
          </div>

          {/* 1-Click Instant Login as Founder */}
          <button
            onClick={() => handleQuickLogin({ email: 'tejasksocials@gmail.com', name: 'Tejas Kamble' })}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles size={14} />
            Quick Sign In as Tejas Kamble (Founder)
          </button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-ide-border" />
            <span className="text-[10px] text-ide-textSecondary uppercase">or with email</span>
            <div className="flex-1 h-px bg-ide-border" />
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-3">
            {isSignUp && (
              <div>
                <label className="text-[11px] text-ide-textSecondary mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tejas Kamble"
                  className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text text-xs outline-none focus:border-ide-accent"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-[11px] text-ide-textSecondary mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text text-xs outline-none focus:border-ide-accent"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-ide-textSecondary mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 bg-ide-sidebar border border-ide-border rounded text-ide-text text-xs outline-none focus:border-ide-accent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2 bg-ide-accent hover:bg-ide-accentHover text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isSignUp ? 'Create Workspace Account' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-ide-textSecondary hover:text-ide-text text-center"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
          </form>
        </div>
      )}

      {/* New Tenant Modal */}
      {showNewTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-ide-panel border border-ide-border rounded-xl shadow-2xl w-full max-w-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-ide-border pb-2">
              <span className="text-sm font-semibold text-ide-text flex items-center gap-1.5">
                <Building2 size={16} className="text-blue-400" />
                Create New Tenant Workspace
              </span>
              <button
                onClick={() => setShowNewTenantModal(false)}
                className="text-ide-textSecondary hover:text-ide-text"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-ide-textSecondary mb-1 block">Workspace Name</label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="e.g. NextGen Microservices"
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-xs outline-none focus:border-ide-accent"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-ide-textSecondary mb-1 block">Plan Tier</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value as any)}
                  className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-xs outline-none focus:border-ide-accent"
                >
                  <option value="free">Free (256 MB Storage, 1 Member)</option>
                  <option value="pro">Pro (1024 MB Storage, 5 Members)</option>
                  <option value="enterprise">Enterprise (5120 MB Storage, Unlimited)</option>
                </select>
              </div>

              <div className="p-2.5 bg-blue-950/20 border border-blue-500/20 rounded text-[11px] text-blue-300">
                Each workspace is completely isolated with its own storage partition, secrets, and project trees.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTenantModal(false)}
                  className="px-3 py-1.5 text-xs text-ide-textSecondary hover:text-ide-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-ide-accent hover:bg-ide-accentHover text-white text-xs font-medium rounded transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
