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
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../../stores';
import type { FileNode } from '../../types';
import { versionHistory } from '../../services/versionHistory';

interface MonacoEditorProps {
  file: FileNode | undefined;
  onFormat?: () => void;
}

export function MonacoEditorComponent({ file, onFormat }: MonacoEditorProps) {
  const settings = useAppStore(s => s.editorSettings);
  const updateFile = useAppStore(s => s.updateFile);
  const addNotification = useAppStore(s => s.addNotification);
  const updateTab = useAppStore(s => s.updateTab);
  const activeTabId = useAppStore(s => s.activeTabId);
  const currentProjectId = useAppStore(s => s.currentProjectId);
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
  
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ide-bg text-ide-textSecondary">
        <div className="text-6xl mb-4 opacity-20">{} </div>
        <p className="text-sm">No file selected</p>
        <p className="text-xs mt-2 opacity-60">Open a file from the explorer to start editing</p>
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

