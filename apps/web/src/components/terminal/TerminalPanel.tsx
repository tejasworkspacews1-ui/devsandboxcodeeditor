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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Send } from 'lucide-react';
import { useAppStore } from '../../stores';
import { sendTerminalCommand, startTerminal, stopTerminal, isSupported, getWebContainer } from '../../services/webcontainer';

export function TerminalPanel() {
  const terminals = useAppStore(s => s.terminals);
  const activeTerminalId = useAppStore(s => s.activeTerminalId);
  const setActiveTerminal = useAppStore(s => s.setActiveTerminal);
  const addTerminal = useAppStore(s => s.addTerminal);
  const removeTerminal = useAppStore(s => s.removeTerminal);
  const updateTerminal = useAppStore(s => s.updateTerminal);
  const appendTerminalOutput = useAppStore(s => s.appendTerminalOutput);
  const clearTerminal = useAppStore(s => s.clearTerminal);
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [command, setCommand] = useState('');
  const [realTerminal, setRealTerminal] = useState(false);
  
  const activeTerminal = terminals.find(t => t.id === activeTerminalId) || terminals[0];
  
  useEffect(() => {
    if (runtimeRunning && isSupported()) {
      setRealTerminal(true);
      const container = getWebContainer();
      if (container) {
        startTerminal(container).catch(() => {
          setRealTerminal(false);
        });
      }
    } else {
      setRealTerminal(false);
    }
    
    return () => {
      stopTerminal();
    };
  }, [runtimeRunning]);
  
  useEffect(() => {
    const el = terminalRefs.current.get(activeTerminal?.id || '');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [activeTerminal?.output, command]);
  
  const handleCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return;
    
    const termId = activeTerminal?.id || 'term_1';
    appendTerminalOutput(termId, `$ ${cmd}\n`);
    
    if (realTerminal) {
      try {
        await sendTerminalCommand(cmd);
      } catch (err) {
        appendTerminalOutput(termId, `Error: ${err instanceof Error ? err.message : 'Command failed'}\n`);
      }
    } else {
      const response = processCommand(cmd);
      appendTerminalOutput(termId, response + '\n');
    }
    
    updateTerminal(termId, {
      history: [...(activeTerminal?.history || []), cmd],
      historyIndex: -1,
    });
    
    setCommand('');
  }, [activeTerminal, realTerminal, appendTerminalOutput, updateTerminal]);
  
  const processCommand = (cmd: string): string => {
    const [command, ...args] = cmd.split(' ');
    
    switch (command) {
      case 'help':
        return `Available commands:
  help          - Show this help
  ls            - List files
  pwd           - Print working directory
  clear         - Clear terminal
  echo <text>   - Print text
  date          - Show current date
  whoami        - Show user
  uname         - System info
  npm <cmd>     - Run npm command
  node <script> - Run node
  python        - Run python
  mkdir <dir>   - Create directory
  touch <file>  - Create file
  cat <file>    - Read file
  cd <dir>      - Change directory
  rm <file>     - Remove file`;
      
      case 'clear':
        clearTerminal(activeTerminal!.id);
        return '';
      
      case 'ls':
        return activeTerminal?.name || 'files';
      
      case 'pwd':
        return '/home/project';
      
      case 'echo':
        return args.join(' ');
      
      case 'date':
        return new Date().toString();
      
      case 'whoami':
        return 'developer';
      
      case 'uname':
        return 'Terminal v1.0';
      
      case 'npm':
        if (args[0] === 'install') {
          return 'Installing dependencies... (demo)';
        } else if (args[0] === 'run' && args[1] === 'dev') {
          return 'Starting development server...\n  Server ready at http://localhost:3000/\n  ➜  Local:   http://localhost:3000/\n  ➜  Network: use --host to expose';
        } else if (args[0] === 'run' && args[1] === 'build') {
          return 'Building for production... (demo)';
        }
        return `npm: unknown command '${args.join(' ')}'`;
      
      case 'node':
        return `> ${args.join(' ')}\n(simulated)`;
      
      case 'python':
        return 'Python 3.11.0 (simulated)';
      
      case 'mkdir':
        return `Created directory: ${args[0] || ''}`;
      
      case 'touch':
        return `Created file: ${args[0] || ''}`;
      
      case 'cat':
        return `Contents of ${args[0] || ''}:\n(simulated)`;
      
      case 'cd':
        return `Changed directory to: ${args[0] || '~'}`;
      
      case 'rm':
        return `Removed: ${args[0] || ''}`;
      
      default:
        return `Command not found: ${command}\nType 'help' for available commands.`;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] font-mono text-sm">
      <div className="flex items-center gap-1 px-2 py-1 bg-[#252526] border-b border-ide-border">
        {terminals.map(term => (
          <button
            key={term.id}
            onClick={() => setActiveTerminal(term.id)}
            className={`px-3 py-1 text-xs rounded transition-colors ${activeTerminalId === term.id ? 'bg-ide-bg text-ide-text' : 'text-ide-textSecondary hover:text-ide-text'}`}
          >
            {term.name}
          </button>
        ))}
        <button onClick={addTerminal} className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors ml-auto" title="New Terminal">
          <Plus size={14} />
        </button>
        {terminals.length > 1 && (
          <button onClick={() => activeTerminalId && removeTerminal(activeTerminalId)} className="p-1 text-ide-textSecondary hover:text-red-400 transition-colors" title="Close Terminal">
            <X size={14} />
          </button>
        )}
      </div>
      
      <div
        ref={(el) => { if (el) terminalRefs.current.set(activeTerminal?.id || '', el); }}
        className="flex-1 overflow-y-auto p-2 text-green-400 whitespace-pre-wrap break-all"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus();
          }
        }}
      >
        {activeTerminal?.output}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(command);
              }
            }}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
            spellCheck={false}
            disabled={!realTerminal && !runtimeRunning}
          />
          {!realTerminal && !runtimeRunning && (
            <span className="text-xs text-green-400/50">(simulated)</span>
          )}
        </div>
      </div>
    </div>
  );
}

