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
import React, { useMemo } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { useAppStore } from '../../stores';
import type { FileNode } from '../../types';

interface DiffEditorComponentProps {
  original: FileNode | null;
  modified: FileNode | null;
  onClose: () => void;
}

export function DiffEditorComponent({ original, modified, onClose }: DiffEditorComponentProps) {
  const settings = useAppStore(s => s.editorSettings);
  
  const options = useMemo(() => ({
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    tabSize: settings.tabSize,
    insertSpaces: settings.insertSpaces,
    readOnly: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderSideBySide: true,
    enableSplitViewResizing: true,
    showMinimap: false,
    lineNumbers: 'on' as const,
    folding: true,
    showFoldingControls: 'mouseover' as const,
    padding: { top: 8 },
  }), [settings]);
  
  const language = useMemo(() => {
    const file = modified || original;
    if (!file) return 'plaintext';
    const ext = file.name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'html': 'html', 'htm': 'html',
      'css': 'css', 'scss': 'scss', 'sass': 'scss', 'less': 'less',
      'js': 'javascript', 'jsx': 'javascript',
      'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'c': 'c', 'cpp': 'cpp',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml', 'yml': 'yaml',
      'sh': 'shell', 'bash': 'shell',
    };
    return langMap[ext || ''] || 'plaintext';
  }, [original, modified]);
  
  return (
    <div className="h-full flex flex-col bg-ide-bg">
      <div className="flex items-center justify-between px-4 py-2 bg-ide-panel border-b border-ide-border">
        <span className="text-sm text-ide-text">
          Diff: {original?.name || 'original'} → {modified?.name || 'modified'}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <DiffEditor
          height="100%"
          language={language}
          original={original?.content || ''}
          modified={modified?.content || ''}
          theme={settings.theme}
          options={options}
          loading={
            <div className="h-full flex items-center justify-center bg-ide-bg">
              <div className="text-sm text-ide-textSecondary">Loading diff editor...</div>
            </div>
          }
        />
      </div>
    </div>
  );
}

