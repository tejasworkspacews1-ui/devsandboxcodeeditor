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
import React, { useEffect } from 'react';
import { ActivityBar } from './ActivityBar';
import { FileExplorer } from '../explorer/FileExplorer';
import { EditorTabs } from '../editor/EditorTabs';
import { MonacoEditorComponent } from '../editor/MonacoEditor';
import { SplitEditor } from '../editor/SplitEditor';
import { DiffEditorComponent } from '../editor/DiffEditorComponent';
import { BottomPanel } from './BottomPanel';
import { StatusBar } from './StatusBar';
import { HeaderBar } from './HeaderBar';
import { CommandPalette } from '../command-palette/CommandPalette';
import { SettingsPanel } from '../settings/SettingsPanel';
import { WelcomeScreen } from '../app/WelcomeScreen';
import { RuntimePanel } from '../app/RuntimePanel';
import { PreviewPanel } from '../app/PreviewPanel';
import { AIAssistantPanel } from '../app/AIAssistantPanel';
import { ExtensionsPanel } from '../app/ExtensionsPanel';
import { CollaborationPanel } from '../app/CollaborationPanel';
import { DebuggerPanel } from '../app/DebuggerPanel';
import { MarketplacePanel } from '../app/MarketplacePanel';
import { OnboardingTour } from '../app/OnboardingTour';
import { useAppStore } from '../../stores';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import type { FileNode } from '../../types';
import { ExternalLink, Menu, X, Play, Square, Loader2 } from 'lucide-react';

export function App() {
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const activeTabId = useAppStore(s => s.activeTabId);
  const tabs = useAppStore(s => s.tabs);
  const files = useAppStore(s => s.files);
  const showWelcome = useAppStore(s => s.showWelcome);
  const setShowWelcome = useAppStore(s => s.setShowWelcome);
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  const runtimeUrl = useAppStore(s => s.runtimeUrl);
  const showDiffEditor = useAppStore(s => s.showDiffEditor);
  const diffOriginal = useAppStore(s => s.diffOriginal);
  const diffModified = useAppStore(s => s.diffModified);
  const closeDiffEditor = useAppStore(s => s.closeDiffEditor);
  const showPreview = useAppStore(s => s.showPreview);
  const togglePreview = useAppStore(s => s.togglePreview);
  const splitEditor = useAppStore(s => s.splitEditor);
  const splitLeftFile = useAppStore(s => s.splitLeftFile);
  const splitRightFile = useAppStore(s => s.splitRightFile);
  const closeSplitEditor = useAppStore(s => s.closeSplitEditor);
  const swapSplitFiles = useAppStore(s => s.swapSplitFiles);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  useKeyboardShortcuts();
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayout({ sidebarCollapsed: true, panelCollapsed: true });
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setLayout]);
  
  useEffect(() => {
    const state = useAppStore.getState();
    if (state.currentProjectId && state.files.length > 0 && state.showWelcome) {
      setShowWelcome(false);
    }
  }, [setShowWelcome]);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeFile: FileNode | undefined = activeTab ? files.find((f: FileNode) => f.id === activeTab.fileId) : undefined;
  const showRuntime = layout.activeView === 'runtime';
  const showAI = layout.activeView === 'ai';
  const showExtensions = layout.activeView === 'extensions';
  const showCollab = layout.activeView === 'collab';
  const showDebug = layout.activeView === 'debug';
  const showMarketplace = layout.activeView === 'marketplace';
  
  const getSidebarContent = () => {
    if (showAI) return <AIAssistantPanel />;
    if (showExtensions) return <ExtensionsPanel />;
    if (showCollab) return <CollaborationPanel />;
    if (showDebug) return <DebuggerPanel />;
    if (showMarketplace) return <MarketplacePanel />;
    return <FileExplorer />;
  };
  
  if (showWelcome) {
    return (
      <div className="h-screen w-screen flex flex-col bg-ide-bg overflow-hidden">
        <WelcomeScreen />
      </div>
    );
  }
  
  if (isMobile) {
    return (
      <div className="h-screen w-screen flex flex-col bg-ide-bg overflow-hidden">
        <CommandPalette />
        <SettingsPanel />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-ide-panel border-b border-ide-border">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-ide-textSecondary hover:text-ide-text"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm font-semibold text-ide-text">DevSandbox</span>
            <div className="w-8" />
          </div>
          
          {showMobileMenu ? (
            <div className="flex-1 overflow-y-auto p-4 bg-ide-panel">
              {getSidebarContent()}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <div className="flex h-full">
                <div className="flex-1 flex flex-col">
                  {<EditorTabs />}
                  <MonacoEditorComponent file={activeFile} />
                </div>
                {showPreview && (
                  <div className="w-1/2 flex flex-col border-l border-ide-border">
                    <PreviewPanel />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-48 flex-shrink-0">
          <BottomPanel />
        </div>
        
        <StatusBar />
      </div>
    );
  }
  
  return (
    <div className="h-screen w-screen flex flex-col bg-ide-bg overflow-hidden">
      <CommandPalette />
      <SettingsPanel />
      
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar />
        
        {!layout.sidebarCollapsed && !showRuntime && (
          <div className="w-64 bg-ide-panel border-r border-ide-border flex-shrink-0 overflow-hidden">
            {getSidebarContent()}
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <HeaderBar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {!showRuntime && !showDiffEditor && !showAI && !showExtensions && !showCollab && !showDebug && !showMarketplace && <EditorTabs />}
          <div className="flex-1 overflow-hidden relative">
            {showRuntime ? (
              <RuntimePanel />
            ) : showDiffEditor ? (
              <DiffEditorComponent
                original={diffOriginal}
                modified={diffModified}
                onClose={closeDiffEditor}
              />
            ) : splitEditor ? (
              <SplitEditor
                leftFile={splitLeftFile}
                rightFile={splitRightFile}
                onClose={closeSplitEditor}
                onSwap={swapSplitFiles}
              />
            ) : showAI ? (
              <AIAssistantPanel />
            ) : showExtensions ? (
              <ExtensionsPanel />
            ) : showCollab ? (
              <CollaborationPanel />
            ) : showDebug ? (
              <DebuggerPanel />
            ) : showMarketplace ? (
              <MarketplacePanel />
            ) : (
              <div className="flex h-full">
                <div className={`flex flex-col ${showPreview ? 'w-1/2 border-r border-ide-border' : 'w-full'}`}>
                  <MonacoEditorComponent file={activeFile} />
                </div>
                {showPreview && (
                  <div className="w-1/2 flex flex-col">
                    <PreviewPanel />
                  </div>
                )}
              </div>
            )}
            
            {!showRuntime && !showDiffEditor && !splitEditor && !showAI && !showExtensions && !showCollab && !showDebug && !showMarketplace && runtimeRunning && runtimeUrl && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <div className="bg-ide-panel border border-ide-border rounded-lg shadow-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-ide-text">Preview running</span>
                  <button
                    onClick={togglePreview}
                    className="text-xs text-ide-accent hover:text-ide-accentHover"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <a
                    href={runtimeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ide-accent hover:text-ide-accentHover"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      
      {!layout.panelCollapsed && (
        <div className="h-64 flex-shrink-0">
          <BottomPanel />
        </div>
      )}
      
      <StatusBar />
      <OnboardingTour />
    </div>
  );
}

