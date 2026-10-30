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
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../../stores';
import type { FileNode } from '../../types';
import { versionHistory } from '../../services/versionHistory';
import { getStarterTemplates } from '../../utils/starterTemplates';
import { FilePlus, Terminal, Sparkles, Code2, Play } from 'lucide-react';

interface MonacoEditorProps {
  file: FileNode | undefined;
  onFormat?: () => void;
}

export function MonacoEditorComponent({ file, onFormat }: MonacoEditorProps) {
  const settings = useAppStore(s => s.editorSettings);
  const updateFile = useAppStore(s => s.updateFile);
  const addNotification = useAppStore(s => s.addNotification);
  const updateTab = useAppStore(s => s.updateTab);
  const addTab = useAppStore(s => s.addTab);
  const activeTabId = useAppStore(s => s.activeTabId);
  const currentProjectId = useAppStore(s => s.currentProjectId);
  const setFiles = useAppStore(s => s.setFiles);
  const selectFile = useAppStore(s => s.selectFile);
  const createFile = useAppStore(s => s.createFile);
  const setLayout = useAppStore(s => s.setLayout);
  const files = useAppStore(s => s.files);
  const user = useAppStore(s => s.user);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const lastSaveTime = useRef<number>(0);
  
  const handleAutoSnapshot = useCallback(async () => {
    const now = Date.now();
    if (now - lastSaveTime.current < 30000) return; // 30s cooldown
    lastSaveTime.current = now;
    
    if (currentProjectId && files.length > 0) {
      await versionHistory.createSnapshot(
        currentProjectId,
        `Auto-save ${new Date().toLocaleTimeString()}`,
        'Automatic snapshot before save',
        files,
        user?.name || 'Anonymous'
      );
    }
  }, [currentProjectId, files, user]);
  
  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    editor.focus();
    
    monaco.editor.defineTheme('midnight', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#1e1e2e',
        'editor.foreground': '#cdd6f4',
        'editor.lineHighlightBackground': '#313244',
        'editor.selectionBackground': '#45475a',
        'editorLineNumber.foreground': '#585b70',
        'editorLineNumber.activeForeground': '#cdd6f4',
      },
    });
    
    monaco.editor.defineTheme('monochrome', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#264f78',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
      },
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (file && activeTabId) {
        const content = editor.getValue();
        updateFile(file.id, content);
        updateTab(activeTabId, { content, modified: false });
        addNotification({ type: 'success', message: `Saved ${file.name}` });
        
        // Auto-snapshot on save
        await handleAutoSnapshot();
      }
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.trigger('', 'editor.action.addSelectionToNextFindMatch', null);
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.trigger('actions.find', 'actions.find');
    });
    
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      formatDocument();
    });
  }, [file, activeTabId, updateFile, updateTab, addNotification, handleAutoSnapshot]);
  
  const formatDocument = useCallback(async () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    
    try {
      await editor.getAction('editor.action.formatDocument').run();
      const newContent = editor.getValue();
      if (file && activeTabId) {
        updateFile(file.id, newContent);
        updateTab(activeTabId, { content: newContent, modified: false });
        addNotification({ type: 'success', message: `Formatted ${file.name}` });
      }
    } catch (err) {
      addNotification({ type: 'warning', message: 'Formatting not available for this file type' });
    }
  }, [file, activeTabId, updateFile, updateTab, addNotification]);
  
  const goToDefinition = useCallback(async () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || !file) return;
    
    try {
      const position = editor.getPosition();
      if (!position) return;
      
      const defs = await monaco.languages.typescript.getTypeDefinitionWorker(
        editor.getModel()!.uri,
        position.lineNumber,
        position.column
      );
      
      if (defs && defs.length > 0) {
        const def = defs[0];
        editor.revealLineInCenter(def.startLineNumber);
        editor.setPosition({ lineNumber: def.startLineNumber, column: def.startColumn });
        editor.focus();
      }
    } catch {
      // Definition not available
    }
  }, [file]);
  
  const renameSymbol = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger('', 'editor.action.rename', null);
  }, []);
  
  React.useEffect(() => {
    if (onFormat) {
      onFormat();
    }
  }, [settings.formatOnSave, file, onFormat]);
  
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!file) return;
    const newValue = value || '';
    updateFile(file.id, newValue);
    if (activeTabId) {
      updateTab(activeTabId, { content: newValue, modified: true });
    }
  }, [file, updateFile, updateTab, activeTabId]);
  
  const language = useMemo(() => {
    if (!file) return 'plaintext';
    const ext = file.name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'html': 'html', 'htm': 'html',
      'css': 'css', 'scss': 'scss', 'sass': 'scss', 'less': 'less',
      'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript', 'cjs': 'javascript',
      'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json', 'jsonc': 'json',
      'md': 'markdown', 'markdown': 'markdown',
      'py': 'python',
      'java': 'java',
      'c': 'c', 'cpp': 'cpp', 'h': 'c', 'hpp': 'cpp',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml', 'yml': 'yaml',
      'svg': 'svg',
      'sh': 'shell', 'bash': 'shell', 'zsh': 'shell',
      'env': 'plaintext', 'txt': 'plaintext',
      'gitignore': 'plaintext', 'gitattributes': 'plaintext',
    };
    return langMap[ext || ''] || 'plaintext';
  }, [file]);
  
  const options = useMemo(() => ({
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    tabSize: settings.tabSize,
    insertSpaces: settings.insertSpaces,
    wordWrap: settings.wordWrap,
    minimap: { enabled: settings.minimap },
    lineNumbers: settings.lineNumbers as any,
    bracketPairColorization: { enabled: settings.bracketPairColorization },
    smoothScrolling: settings.smoothScrolling,
    cursorStyle: settings.cursorStyle as any,
    cursorBlinking: settings.cursorBlinking as any,
    formatOnPaste: true,
    formatOnType: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    glyphMargin: true,
    folding: true,
    showFoldingControls: 'mouseover' as const,
    bracketPairGuides: { enabled: settings.bracketPairColorization },
    guides: { bracketPairs: settings.bracketPairColorization, indentation: true },
    padding: { top: 8 },
    renderLineHighlight: 'all' as const,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    overviewRulerLanes: 0,
  }), [settings]);
  
  React.useImperativeHandle(onFormat, () => ({
    formatDocument,
    goToDefinition,
    renameSymbol,
  }), [formatDocument, goToDefinition, renameSymbol]);
  
  const handleLoadTemplate = (type: 'react' | 'web' | 'python') => {
    const templates = getStarterTemplates();
    const templateFiles = templates[type];
    setFiles(templateFiles);
    
    const primary = templateFiles.find(f => f.name === 'App.tsx' || f.name === 'index.html' || f.name === 'main.py') || templateFiles[0];
    if (primary) {
      addTab({
        id: `tab_${primary.id}`,
        fileId: primary.id,
        name: primary.name,
        path: primary.path,
        content: primary.content || '',
        language: primary.name.split('.').pop() || 'plaintext',
        modified: false,
        pinned: false,
      });
      selectFile(primary.id);
    }
    
    if (currentProjectId) {
      useAppStore.getState().updateProject(currentProjectId, { files: templateFiles });
    }
    addNotification({ type: 'success', message: `Loaded ${type.toUpperCase()} template into workspace!` });
  };

  const handleCreateNewFile = () => {
    const now = Date.now();
    const newFile: FileNode = {
      id: `file_${now}`,
      name: 'index.html',
      path: '/index.html',
      type: 'file',
      content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Project</title>\n</head>\n<body>\n  <h1>Hello from DevSandbox!</h1>\n</body>\n</html>\n',
      createdAt: now,
      updatedAt: now,
    };
    createFile(newFile);
    addTab({
      id: `tab_${newFile.id}`,
      fileId: newFile.id,
      name: newFile.name,
      path: newFile.path,
      content: newFile.content || '',
      language: 'html',
      modified: false,
      pinned: false,
    });
    selectFile(newFile.id);
    addNotification({ type: 'success', message: 'Created index.html' });
  };

  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#18181b] text-zinc-300 p-6 select-none overflow-y-auto">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20 font-bold text-lg">
            DS
          </div>
          
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">DevSandbox Code Studio</h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6 leading-relaxed">
            Professional browser-based developer workspace with live compilation and multi-tenant persistence.
          </p>

          <div className="w-full flex flex-col gap-2 mb-6">
            <button
              onClick={handleCreateNewFile}
              className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-lg text-xs font-medium flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FilePlus size={14} className="text-blue-400" />
                <span>Create New File (index.html)</span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">⌘N</span>
            </button>

            <button
              onClick={() => handleLoadTemplate('react')}
              className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">⚛️</span>
                <span>Load React Starter Template</span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">App.tsx</span>
            </button>

            <button
              onClick={() => handleLoadTemplate('web')}
              className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">🌐</span>
                <span>Load HTML5 / CSS / JS Starter</span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">Full Web</span>
            </button>

            <button
              onClick={() => handleLoadTemplate('python')}
              className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">🐍</span>
                <span>Load Python Console Starter</span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">main.py</span>
            </button>

            <button
              onClick={() => setLayout({ panelCollapsed: false, bottomTab: 'terminal' })}
              className="w-full py-2 px-3 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60 rounded-lg text-xs flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-zinc-400" />
                <span>Open Terminal Panel</span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-mono">Ctrl+`</span>
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-800 w-full flex items-center justify-center gap-4 text-[11px] text-zinc-500">
            <span>Tejas Kamble</span>
            <span>•</span>
            <span>Multi-Tenant Architecture</span>
            <span>•</span>
            <span>Universal Dark Theme</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Editor
      height="100%"
      language={language}
      value={file.content || ''}
      theme={settings.theme}
      options={options}
      onChange={handleEditorChange}
      onMount={handleEditorMount}
      loading={
        <div className="h-full flex items-center justify-center bg-ide-bg">
          <div className="text-sm text-ide-textSecondary">Loading editor...</div>
        </div>
      }
    />
  );
}

