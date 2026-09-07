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
export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  createdAt: number;
  updatedAt: number;
}

export interface Tab {
  id: string;
  fileId: string;
  name: string;
  path: string;
  content: string;
  language: string;
  modified: boolean;
  pinned: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  template: string;
  files: FileNode[];
  createdAt: number;
  updatedAt: number;
  env?: Record<string, string>;
}

export interface EditorSettings {
  theme: 'vs-dark' | 'vs-light' | 'hc-black' | 'midnight' | 'monochrome' | 'solarized-dark';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  bracketPairColorization: boolean;
  smoothScrolling: boolean;
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  autoSave: 'off' | 'afterDelay' | 'onFocusChange';
  formatOnSave: boolean;
  confirmDelete: boolean;
  terminalFontSize: number;
  accentColor: string;
}

export interface TerminalSession {
  id: string;
  name: string;
  output: string;
  history: string[];
  historyIndex: number;
  running: boolean;
  exitCode: number | null;
}

export interface SearchResult {
  fileId: string;
  filePath: string;
  lineNumber: number;
  column: number;
  match: string;
  context: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export type ViewMode = 'editor' | 'split' | 'preview';

export interface LayoutState {
  sidebarWidth: number;
  panelHeight: number;
  sidebarCollapsed: boolean;
  panelCollapsed: boolean;
  activeView: 'explorer' | 'search' | 'git' | 'settings' | 'terminal' | 'problems' | 'output' | 'runtime' | 'ai' | 'extensions' | 'collab' | 'debug' | 'marketplace';
}

export const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'off',
  minimap: true,
  lineNumbers: 'on',
  bracketPairColorization: true,
  smoothScrolling: true,
  cursorStyle: 'line',
  cursorBlinking: 'blink',
  autoSave: 'off',
  formatOnSave: false,
  confirmDelete: true,
  terminalFontSize: 13,
  accentColor: '#0078d4',
};

export const DEFAULT_LAYOUT: LayoutState = {
  sidebarWidth: 250,
  panelHeight: 200,
  sidebarCollapsed: false,
  panelCollapsed: false,
  activeView: 'explorer',
};

export const DEFAULT_TERMINAL: Omit<TerminalSession, 'id'> = {
  name: 'Terminal',
  output: '$ Welcome to Terminal\n',
  history: [],
  historyIndex: -1,
  running: false,
  exitCode: null,
};

export const LANGUAGE_MAP: Record<string, string> = {
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'scss',
  'less': 'less',
  'js': 'javascript',
  'jsx': 'javascript',
  'mjs': 'javascript',
  'cjs': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'json': 'json',
  'jsonc': 'json',
  'md': 'markdown',
  'markdown': 'markdown',
  'svg': 'svg',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'h': 'c',
  'hpp': 'cpp',
  'sql': 'sql',
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'env': 'plaintext',
  'txt': 'plaintext',
};

export function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || 'plaintext';
  return LANGUAGE_MAP[ext] || 'plaintext';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateFileId(): string {
  return 'file_' + generateId();
}

export function generateTabId(): string {
  return 'tab_' + generateId();
}

export function generateProjectId(): string {
  return 'proj_' + generateId();
}

