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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Send, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores';
import { api, tenantEngine } from '../../services/api';
import type { FileNode } from '../../types';

export function TerminalPanel() {
  const terminals = useAppStore(s => s.terminals);
  const activeTerminalId = useAppStore(s => s.activeTerminalId);
  const setActiveTerminal = useAppStore(s => s.setActiveTerminal);
  const addTerminal = useAppStore(s => s.addTerminal);
  const removeTerminal = useAppStore(s => s.removeTerminal);
  const updateTerminal = useAppStore(s => s.updateTerminal);
  const appendTerminalOutput = useAppStore(s => s.appendTerminalOutput);
  const clearTerminal = useAppStore(s => s.clearTerminal);
  const files = useAppStore(s => s.files);
  const createFile = useAppStore(s => s.createFile);
  const deleteFile = useAppStore(s => s.deleteFile);
  const togglePreview = useAppStore(s => s.togglePreview);
  const showPreview = useAppStore(s => s.showPreview);
  const setShowPreview = useAppStore(s => s.setShowPreview);
  const user = useAppStore(s => s.user);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const activeTerminal = terminals.find(t => t.id === activeTerminalId) || terminals[0];

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [activeTerminal?.output]);

  // Initial welcome message if terminal is empty
  useEffect(() => {
    if (activeTerminal && (!activeTerminal.output || activeTerminal.output === '$ Welcome to Terminal\n')) {
      const activeTenant = api.getActiveTenant();
      const welcome = `\x1b[36mDevSandbox Virtual Cloud Terminal v2.4.0\x1b[0m
Logged in as \x1b[32m${user?.name || 'Tejas Kamble'}\x1b[0m (\x1b[34m${activeTenant?.name || 'Primary Workspace'}\x1b[0m)
Type \x1b[33mhelp\x1b[0m for available commands, or \x1b[33mneofetch\x1b[0m for system stats.
\n`;
      updateTerminal(activeTerminal.id, { output: welcome });
    }
  }, [activeTerminal?.id, updateTerminal, user?.name]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const history = activeTerminal?.history || [];

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCommand(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setCommand('');
      } else {
        setHistoryIndex(nextIdx);
        setCommand(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabAutocomplete();
    }
  };

  const handleTabAutocomplete = () => {
    const parts = command.trim().split(' ');
    const lastPart = parts[parts.length - 1] || '';
    if (!lastPart) return;

    const fileMatches = files
      .map(f => f.name)
      .filter(name => name.toLowerCase().startsWith(lastPart.toLowerCase()));

    if (fileMatches.length === 1) {
      parts[parts.length - 1] = fileMatches[0];
      setCommand(parts.join(' '));
    }
  };

  const handleCommand = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const termId = activeTerminal?.id || 'term_1';
    const trimmed = command.trim();
    const promptPrefix = `${user?.email ? user.email.split('@')[0] : 'tejas'}@devsandbox:~/workspace$ `;

    appendTerminalOutput(termId, `${promptPrefix}${trimmed}\n`);

    const response = processCommand(trimmed);
    if (response) {
      appendTerminalOutput(termId, response + '\n');
    }

    updateTerminal(termId, {
      history: [...(activeTerminal?.history || []), trimmed],
      historyIndex: -1,
    });

    setCommand('');
    setHistoryIndex(-1);
  }, [command, activeTerminal, user, appendTerminalOutput, updateTerminal, files]);

  const processCommand = (cmd: string): string => {
    const [action, ...args] = cmd.split(' ');
    const argStr = args.join(' ');
    const activeTenant = api.getActiveTenant();

    switch (action.toLowerCase()) {
      case 'help':
      case '?':
        return `Available DevSandbox Shell Commands:
  ls, dir           - List all project workspace files & metadata
  cat <file>        - View content of a file
  touch <file>      - Create a new file in project
  rm <file>         - Delete a file from project
  pwd               - Print current virtual directory
  clear             - Clear terminal screen
  run, start        - Launch live interactive sandbox preview
  test, npm test    - Execute automated test suite
  git status        - Inspect Git working tree & modified files
  git commit -m "..."- Commit staged changes
  git push          - Push committed changes to remote repository
  neofetch, about   - Display developer credits & system specs
  whoami            - Display active user & role
  tenant            - Display multi-tenant workspace info
  date              - Print current timestamp
  echo <msg>        - Echo text to terminal
  env               - List environment variables`;

      case 'clear':
        clearTerminal(activeTerminal?.id || 'term_1');
        return '';

      case 'ls':
      case 'dir':
        if (files.length === 0) return 'Total: 0 files in workspace.';
        const fileLines = files.map(f => {
          const size = (f.content || '').length;
          const date = new Date(f.updatedAt || Date.now()).toLocaleTimeString();
          return `-rw-r--r-- 1 tejas staff ${size.toString().padStart(6, ' ')}B ${date} ${f.name}`;
        });
        return `total ${files.length}\n${fileLines.join('\n')}`;

      case 'cat':
        if (!argStr) return 'Usage: cat <filename>';
        const target = files.find(f => f.name.toLowerCase() === argStr.toLowerCase() || f.path === argStr);
        if (!target) return `cat: ${argStr}: No such file or directory`;
        const lines = (target.content || '').split('\n').map((l, i) => `${(i + 1).toString().padStart(3, ' ')} | ${l}`);
        return lines.join('\n');

      case 'pwd':
        return `/home/${user?.name?.toLowerCase().replace(/\s+/g, '') || 'tejas'}/devsandbox/workspace`;

      case 'touch':
        if (!argStr) return 'Usage: touch <filename>';
        if (files.some(f => f.name === argStr)) return `touch: ${argStr}: File already exists`;
        createFile({
          id: `file_${Date.now()}`,
          name: argStr,
          path: '/' + argStr,
          type: 'file',
          content: `// Created by ${user?.name || 'Tejas Kamble'} on ${new Date().toLocaleString()}\n`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        return `Created file "${argStr}"`;

      case 'rm':
        if (!argStr) return 'Usage: rm <filename>';
        const toDelete = files.find(f => f.name === argStr);
        if (!toDelete) return `rm: cannot remove '${argStr}': No such file`;
        deleteFile(toDelete.id);
        return `Removed "${argStr}"`;

      case 'run':
      case 'start':
      case 'npm':
        if (cmd === 'npm run dev' || cmd === 'npm start' || cmd === 'run' || cmd === 'start') {
          setShowPreview(true);
          return `\x1b[32m✔ Project compiled successfully.\x1b[0m\nLive Sandbox rendered on port 3000.\nShowing preview drawer.`;
        }
        if (cmd === 'npm test' || cmd === 'test') {
          return `\x1b[36mRunning Vitest Suite...\x1b[0m\n  ✓ App Component > Renders correctly without crashing (4ms)\n  ✓ State Engine > Handles multi-tenant storage dispatch (8ms)\n  ✓ Sandbox Compiler > Compiles JSX & styles into DOM (12ms)\n\n\x1b[32mTest Files: 1 passed (1)\nTests:      3 passed (3)\nDuration:   124ms\x1b[0m`;
        }
        return `npm: executed ${cmd}`;

      case 'git':
        if (cmd.includes('status')) {
          return `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges tracked: ${files.length} files in workspace\nnothing to commit, working tree clean`;
        }
        if (cmd.includes('commit')) {
          return `[main 8a2f1c4] ${argStr.replace(/-m\s*"?|"?$/g, '') || 'Update project files'}\n ${files.length} files changed, 240 insertions(+)`;
        }
        if (cmd.includes('push')) {
          return `Enumerating objects: ${files.length}, done.\nCounting objects: 100% (${files.length}/${files.length}), done.\nCompressing objects: 100%, done.\nWriting objects: 100% (${files.length}/${files.length}), 14.82 KiB | 2.11 MiB/s, done.\nTo https://github.com/tejasworkspacews1-ui/devsandboxcodeeditor.git\n   e2938ab..8a2f1c4  main -> main\n\x1b[32m✔ Successfully pushed to tejasworkspacews1-ui/devsandboxcodeeditor!\x1b[0m`;
        }
        return `git: command completed`;

      case 'whoami':
        return `User: ${user?.name || 'Tejas Kamble'} (${user?.email || 'tejasksocials@gmail.com'})\nRole: ${user?.role || 'Owner'}\nWorkspace: ${activeTenant?.name || 'Primary'}`;

      case 'tenant':
        return `Active Tenant Information:
  ID:          ${activeTenant?.id}
  Name:        ${activeTenant?.name}
  Plan:        ${activeTenant?.plan?.toUpperCase()} Tier
  Storage:     ${activeTenant?.storageUsedMB} MB / ${activeTenant?.storageQuotaMB} MB
  Status:      100% Isolated Real-time Tenant`;

      case 'neofetch':
      case 'about':
        return `
  ██████╗ ███████╗██╗   ██╗███████╗ █████╗ ███╗   ██╗██████╗ ██████╗  ██████╗ ██╗  ██╗
  ██╔══██╗██╔════╝██║   ██║██╔════╝██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝
  ██║  ██║█████╗  ██║   ██║███████╗███████║██╔██╗ ██║██║  ██║██████╔╝██║   ██║ ╚███╔╝ 
  ██║  ██║██╔══╝  ╚██╗ ██╔╝╚════██║██╔══██║██║╚██╗██║██║  ██║██╔══██╗██║   ██║ ██╔██╗ 
  ██████╔╝███████╗ ╚████╔╝ ███████║██║  ██║██║ ╚████║██████╔╝██████╔╝╚██████╔╝██╔╝ ██╗
  ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
  
  Developer:   Tejas Kamble
  Email:       tejasksocials@gmail.com
  Website:     https://tejaskambleportfolio.vercel.app/
  LinkedIn:    https://www.linkedin.com/in/tejaskambleportfolio/
  GitHub:      https://github.com/tejasworkspacews1-ui
  Instagram:   @tejask.co.in
  OS:          DevSandbox Cloud Container (linux-x64)
  Kernel:      Node.js 22.x LTS / TypeScript 5.3
  Uptime:      Real-time active
  Disclaimer:  All project data shown/accessed is completely legal, free & publicly accessible.
`;

      case 'echo':
        return argStr;

      case 'date':
        return new Date().toString();

      case 'env':
        return `NODE_ENV=production\nPORT=3000\nDEV_SANDBOX_USER=${user?.name || 'Tejas Kamble'}\nACTIVE_TENANT=${activeTenant?.id}\nGIT_AUTHOR_NAME=tejasworkspacews1-ui\nGIT_AUTHOR_EMAIL=tejasworkspacews1@gmail.com`;

      default:
        return `bash: ${action}: command not found. Type 'help' to see list of valid commands.`;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 font-mono text-xs select-text">
      {/* Terminal Tab Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-ide-sidebar border-b border-ide-border">
        <div className="flex items-center gap-1.5">
          <TerminalIcon size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-ide-text">bash — {user?.name || 'Tejas Kamble'}</span>
          <span className="text-[10px] text-ide-textSecondary px-1.5 py-0.5 rounded bg-ide-panel border border-ide-border">
            Interactive
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => clearTerminal(activeTerminal?.id || 'term_1')}
            className="p-1 text-ide-textSecondary hover:text-ide-text hover:bg-ide-panel rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalScrollRef}
        className="flex-1 overflow-y-auto p-3 text-ide-text whitespace-pre-wrap leading-relaxed select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTerminal?.output || ''}
      </div>

      {/* Terminal Input Line */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 px-3 py-2 bg-ide-panel border-t border-ide-border">
        <span className="text-emerald-400 font-semibold select-none flex-shrink-0">
          {user?.email ? user.email.split('@')[0] : 'tejas'}@devsandbox:~/workspace$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'neofetch', 'run', 'ls')..."
          className="flex-1 bg-transparent text-ide-text outline-none text-xs font-mono"
          autoFocus
        />
        <button
          type="submit"
          className="text-ide-textSecondary hover:text-ide-text transition-colors p-1"
          title="Send Command"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
