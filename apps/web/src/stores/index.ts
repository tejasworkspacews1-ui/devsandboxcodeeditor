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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, FileNode, EditorSettings, LayoutState, Notification, TerminalSession, Tab, SearchResult } from '../types';
import { DEFAULT_LAYOUT, DEFAULT_TERMINAL } from '../types';

interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  recentProjects: string[];
  files: FileNode[];
  selectedFileId: string | null;
  tabs: Tab[];
  activeTabId: string | null;
  editorSettings: EditorSettings;
  layout: LayoutState;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
  notifications: Notification[];
  showCommandPalette: boolean;
  showSettings: boolean;
  showSearch: boolean;
  showWelcome: boolean;
  closedTabs: Tab[];
  searchResults: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
  runtimeRunning: boolean;
  runtimeUrl: string | null;
  runtimeLogs: string[];
  previewUrl: string | null;
  diagnostics: any[];
  diffOriginal: FileNode | null;
  diffModified: FileNode | null;
  showDiffEditor: boolean;
  showPreview: boolean;
  user: { id: string; email: string; name: string } | null;
  setUser: (user: { id: string; email: string; name: string } | null) => void;
  splitEditor: boolean;
  splitLeftFile: FileNode | null;
  splitRightFile: FileNode | null;
  openSplitEditor: (leftFile: FileNode | null, rightFile: FileNode | null) => void;
  closeSplitEditor: () => void;
  swapSplitFiles: () => void;
  startOnboarding: boolean;
  triggerOnboarding: () => void;
  completeOnboarding: () => void;
  setCurrentProject: (projectId: string | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setRecentProject: (id: string) => void;
  setFiles: (files: FileNode[]) => void;
  updateFile: (id: string, content: string) => void;
  createFile: (file: FileNode) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, name: string) => void;
  selectFile: (id: string | null) => void;
  addTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  reopenTab: () => void;
  pinTab: (id: string) => void;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  setLayout: (layout: Partial<LayoutState>) => void;
  addTerminal: () => void;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string | null) => void;
  updateTerminal: (id: string, updates: Partial<TerminalSession>) => void;
  appendTerminalOutput: (id: string, output: string) => void;
  clearTerminal: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setShowCommandPalette: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
  setShowWelcome: (show: boolean) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setRuntimeRunning: (running: boolean) => void;
  setRuntimeUrl: (url: string | null) => void;
  setPreviewUrl: (url: string | null) => void;
  addRuntimeLog: (log: string) => void;
  clearRuntimeLogs: () => void;
  startProject: () => Promise<void>;
  stopProject: () => Promise<void>;
  sendTerminalCommand: (command: string) => Promise<void>;
  startTerminal: () => Promise<void>;
  stopTerminal: () => Promise<void>;
  setDiagnostics: (diagnostics: any[]) => void;
  addDiagnostic: (diagnostic: any) => void;
  clearDiagnostics: () => void;
  openDiffEditor: (original: FileNode | null, modified: FileNode | null) => void;
  closeDiffEditor: () => void;
  togglePreview: () => void;
  setShowPreview: (show: boolean) => void;
  reset: () => void;
}

const defaultSettings = {
  theme: 'vs-dark' as const,
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'off' as const,
  minimap: true,
  lineNumbers: 'on' as const,
  bracketPairColorization: true,
  smoothScrolling: true,
  cursorStyle: 'line' as const,
  cursorBlinking: 'blink' as const,
  autoSave: 'off' as const,
  formatOnSave: false,
  confirmDelete: true,
  terminalFontSize: 13,
  accentColor: '#0078d4',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      recentProjects: [],
      files: [],
      selectedFileId: null,
      tabs: [],
      activeTabId: null,
      editorSettings: defaultSettings,
      layout: DEFAULT_LAYOUT,
      terminals: [{ ...DEFAULT_TERMINAL, id: 'term_1' }],
      activeTerminalId: 'term_1',
      notifications: [],
      showCommandPalette: false,
      showSettings: false,
      showSearch: false,
      showWelcome: true,
      searchResults: [],
      searchQuery: '',
      isLoading: false,
      runtimeRunning: false,
      runtimeUrl: null,
      runtimeLogs: [],
      previewUrl: null,
      closedTabs: [],
      diagnostics: [],
      diffOriginal: null,
      diffModified: null,
      showDiffEditor: false,
      showPreview: false,
      user: null,
      splitEditor: false,
      splitLeftFile: null,
      splitRightFile: null,
      startOnboarding: false,
      
      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project],
        recentProjects: [project.id, ...state.recentProjects.filter(id => id !== project.id)].slice(0, 20),
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p),
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        recentProjects: state.recentProjects.filter(rid => rid !== id),
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
      })),
      setRecentProject: (id) => set((state) => ({
        recentProjects: [id, ...state.recentProjects.filter(rid => rid !== id)].slice(0, 20),
      })),
      setFiles: (files) => set({ files }),
      updateFile: (id, content) => set((state) => ({
        files: state.files.map(f => f.id === id ? { ...f, content, updatedAt: Date.now() } : f),
        tabs: state.tabs.map(t => t.fileId === id ? { ...t, content, modified: false } : t),
      })),
      createFile: (file) => set((state) => ({ files: [...state.files, file] })),
      deleteFile: (id) => set((state) => ({
        files: state.files.filter(f => f.id !== id),
        tabs: state.tabs.filter(t => t.fileId !== id),
        selectedFileId: state.selectedFileId === id ? null : state.selectedFileId,
        activeTabId: state.activeTabId && state.tabs.find(t => t.id === state.activeTabId)?.fileId === id 
          ? (state.tabs.filter(t => t.fileId !== id)[0]?.id || null) 
          : state.activeTabId,
      })),
      renameFile: (id, name) => set((state) => ({
        files: state.files.map(f => f.id === id ? { ...f, name, updatedAt: Date.now() } : f),
        tabs: state.tabs.map(t => t.fileId === id ? { ...t, name, path: t.path.split('/').slice(0, -1).concat(name).join('/') } : t),
      })),
      selectFile: (id) => set({ selectedFileId: id }),
      addTab: (tab) => set((state) => {
        const existing = state.tabs.find(t => t.fileId === tab.fileId);
        if (existing) {
          return { tabs: state.tabs.map(t => t.id === existing.id ? { ...t, modified: false } : t), activeTabId: existing.id };
        }
        return { tabs: [...state.tabs, tab], activeTabId: tab.id };
      }),
      closeTab: (id) => set((state) => {
        const tab = state.tabs.find(t => t.id === id);
        if (!tab) return state;
        const closedTabs = [...state.closedTabs, tab].slice(-20);
        const newTabs = state.tabs.filter(t => t.id !== id);
        let newActiveId = state.activeTabId;
        if (state.activeTabId === id) {
          const idx = state.tabs.findIndex(t => t.id === id);
          newActiveId = newTabs[Math.min(idx, newTabs.length - 1)]?.id || null;
        }
        return { tabs: newTabs, activeTabId: newActiveId, closedTabs };
      }),
      setActiveTab: (id) => set({ activeTabId: id }),
      updateTab: (id, updates) => set((state) => ({
        tabs: state.tabs.map(t => t.id === id ? { ...t, ...updates } : t),
      })),
      reopenTab: () => set((state) => {
        if (state.closedTabs.length === 0) return state;
        const lastClosed = state.closedTabs[state.closedTabs.length - 1];
        return { tabs: [...state.tabs, { ...lastClosed, modified: false }], activeTabId: lastClosed.id, closedTabs: state.closedTabs.slice(0, -1) };
      }),
      pinTab: (id) => set((state) => ({
        tabs: state.tabs.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t),
      })),
      updateSettings: (settings) => set((state) => ({
        editorSettings: { ...state.editorSettings, ...settings },
      })),
      setLayout: (layout) => set((state) => ({
        layout: { ...state.layout, ...layout },
      })),
      addTerminal: () => set((state) => {
        const id = `term_${Date.now()}`;
        return { terminals: [...state.terminals, { ...DEFAULT_TERMINAL, id }], activeTerminalId: id };
      }),
      removeTerminal: (id) => set((state) => ({
        terminals: state.terminals.filter(t => t.id !== id),
        activeTerminalId: state.activeTerminalId === id ? (state.terminals.find(t => t.id !== id)?.id || null) : state.activeTerminalId,
      })),
      setActiveTerminal: (id) => set({ activeTerminalId: id }),
      updateTerminal: (id, updates) => set((state) => ({
        terminals: state.terminals.map(t => t.id === id ? { ...t, ...updates } : t),
      })),
      appendTerminalOutput: (id, output) => set((state) => ({
        terminals: state.terminals.map(t => t.id === id ? { ...t, output: t.output + output } : t),
      })),
      clearTerminal: (id) => set((state) => ({
        terminals: state.terminals.map(t => t.id === id ? { ...t, output: '' } : t),
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: `notif_${Date.now()}` }],
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),
      setShowCommandPalette: (show) => set({ showCommandPalette: show }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowSearch: (show) => set({ showSearch: show }),
      setShowWelcome: (show) => set({ showWelcome: show }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ isLoading: loading }),
      setRuntimeRunning: (running) => set({ runtimeRunning: running }),
      setRuntimeUrl: (url) => set({ runtimeUrl: url }),
      setPreviewUrl: (url) => set({ previewUrl: url }),
      addRuntimeLog: (log) => set((state) => ({
        runtimeLogs: [...state.runtimeLogs, log].slice(-500),
      })),
      clearRuntimeLogs: () => set({ runtimeLogs: [] }),
      startProject: async () => {
        const state = get();
        if (!state.currentProjectId) return;
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project || project.files.length === 0) {
          state.addNotification({ type: 'warning', message: 'No files to run' });
          return;
        }
        state.setLoading(true);
        state.clearRuntimeLogs();
        state.setShowPreview(true);
        state.addRuntimeLog('Starting project...');
        try {
          const { bootWebContainer, mountProject, startDevServer, isSupported } = await import('../services/webcontainer');
          if (!isSupported()) {
            state.addRuntimeLog('Running in preview mode');
            state.addNotification({ 
              type: 'info', 
              message: 'Showing project preview.' 
            });
            state.setRuntimeRunning(false);
            state.setRuntimeUrl(null);
            state.setPreviewUrl(null);
            state.setLoading(false);
            return;
          }
          state.addRuntimeLog('Booting runtime...');
          const container = await bootWebContainer();
          state.addRuntimeLog('Loading files...');
          await mountProject(container, project.files);
          state.addRuntimeLog('Starting server...');
          const url = await startDevServer(container, project.files);
          state.setRuntimeRunning(true);
          state.setRuntimeUrl(url);
          state.setPreviewUrl(url);
          state.addRuntimeLog(`Ready at ${url}`);
          state.addNotification({ type: 'success', message: `Project running at ${url}` });
        } catch (err) {
          state.setRuntimeRunning(false);
          state.setRuntimeUrl(null);
          state.setPreviewUrl(null);
          state.addRuntimeLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
          state.addNotification({ type: 'error', message: err instanceof Error ? err.message : 'Failed to start project' });
        } finally {
          state.setLoading(false);
        }
      },
      stopProject: async () => {
        const state = get();
        state.addRuntimeLog('Stopping server...');
        try {
          const { stopServer, teardownWebContainer, stopTerminal } = await import('../services/webcontainer');
          await stopServer();
          await stopTerminal();
          await teardownWebContainer();
          state.setRuntimeRunning(false);
          state.setRuntimeUrl(null);
          state.setPreviewUrl(null);
          state.addRuntimeLog('Server stopped');
          state.addNotification({ type: 'info', message: 'Project stopped' });
        } catch (err) {
          state.addRuntimeLog(`Error stopping: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },
      sendTerminalCommand: async (command) => {
        const { sendTerminalCommand: sendCmd } = await import('../services/webcontainer');
        await sendCmd(command);
      },
      startTerminal: async () => {
        const state = get();
        if (!state.runtimeRunning) return;
        const { getWebContainer, startTerminal: startTerm } = await import('../services/webcontainer');
        const container = getWebContainer();
        if (!container) return;
        await startTerm(container, (output) => {
          state.appendTerminalOutput(state.activeTerminalId || 'term_1', output);
        });
      },
      stopTerminal: async () => {
        const { stopTerminal: stopTerm } = await import('../services/webcontainer');
        await stopTerm();
      },
      setDiagnostics: (diagnostics) => set({ diagnostics }),
      addDiagnostic: (diagnostic) => set((state) => ({ diagnostics: [...state.diagnostics, diagnostic] })),
      clearDiagnostics: () => set({ diagnostics: [] }),
      openDiffEditor: (original, modified) => set({ diffOriginal: original, diffModified: modified, showDiffEditor: true }),
      closeDiffEditor: () => set({ diffOriginal: null, diffModified: null, showDiffEditor: false }),
      togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
      setShowPreview: (show) => set({ showPreview: show }),
      openSplitEditor: (leftFile, rightFile) => set({ splitLeftFile: leftFile, splitRightFile: rightFile, splitEditor: true }),
      closeSplitEditor: () => set({ splitLeftFile: null, splitRightFile: null, splitEditor: false }),
      swapSplitFiles: () => set((state) => ({ splitLeftFile: state.splitRightFile, splitRightFile: state.splitLeftFile })),
      triggerOnboarding: () => set({ startOnboarding: true }),
      completeOnboarding: () => set({ startOnboarding: false }),
      setUser: (user) => set({ user }),
      reset: () => set({
        projects: [],
        currentProjectId: null,
        recentProjects: [],
        files: [],
        selectedFileId: null,
        tabs: [],
        activeTabId: null,
        terminals: [{ ...DEFAULT_TERMINAL, id: 'term_1' }],
        activeTerminalId: 'term_1',
        notifications: [],
        showCommandPalette: false,
        showSettings: false,
        showSearch: false,
        showWelcome: true,
        searchResults: [],
        searchQuery: '',
        isLoading: false,
        runtimeRunning: false,
        runtimeUrl: null,
        runtimeLogs: [],
        previewUrl: null,
        closedTabs: [],
        diagnostics: [],
        diffOriginal: null,
        diffModified: null,
        showDiffEditor: false,
        showPreview: false,
      }),
    }),
    {
      name: 'devsandbox-storage',
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
        recentProjects: state.recentProjects,
        files: state.files,
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        editorSettings: state.editorSettings,
        layout: state.layout,
        terminals: state.terminals,
        activeTerminalId: state.activeTerminalId,
      }),
    }
  )
);

