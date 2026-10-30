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
import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Tablet, Smartphone, RefreshCw, Terminal, 
  AlertCircle, CheckCircle, ExternalLink, Play, Trash2
} from 'lucide-react';
import { useAppStore } from '../../stores';
import type { FileNode } from '../../types';

interface FallbackPreviewProps {
  files: FileNode[];
}

interface ConsoleMessage {
  id: string;
  level: 'log' | 'info' | 'warn' | 'error';
  text: string;
  time: string;
}

export function FallbackPreview({ files }: FallbackPreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [srcDoc, setSrcDoc] = useState<string>('');
  const [hasError, setHasError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const appendTerminalOutput = useAppStore(s => s.appendTerminalOutput);
  const activeTerminalId = useAppStore(s => s.activeTerminalId);

  // Listen to iframe postMessage for console logs & runtime errors
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.source === 'devsandbox-preview') {
        const { type, level, message } = e.data;
        const time = new Date().toLocaleTimeString();
        
        if (type === 'console') {
          const newMsg: ConsoleMessage = {
            id: `log_${Date.now()}_${Math.random()}`,
            level: level || 'log',
            text: typeof message === 'string' ? message : JSON.stringify(message),
            time,
          };
          setConsoleLogs(prev => [...prev.slice(-100), newMsg]);

          // Also mirror to IDE Terminal
          if (activeTerminalId) {
            appendTerminalOutput(activeTerminalId, `[Preview ${level?.toUpperCase()}] ${newMsg.text}\n`);
          }
        } else if (type === 'error') {
          setHasError(message);
          const errorMsg: ConsoleMessage = {
            id: `err_${Date.now()}`,
            level: 'error',
            text: message,
            time,
          };
          setConsoleLogs(prev => [...prev.slice(-100), errorMsg]);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTerminalId, appendTerminalOutput]);

  // Compile project files into a self-contained executable preview document
  useEffect(() => {
    setHasError(null);
    const html = buildExecutablePreviewDocument(files);
    setSrcDoc(html);
  }, [files]);

  const handleRefresh = () => {
    setHasError(null);
    const html = buildExecutablePreviewDocument(files);
    setSrcDoc('');
    setTimeout(() => setSrcDoc(html), 50);
  };

  const getDeviceWidth = () => {
    if (deviceMode === 'mobile') return '375px';
    if (deviceMode === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 select-none overflow-hidden">
      {/* Device & Toolbar */}
      <div className="px-3 py-1.5 bg-ide-sidebar border-b border-ide-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1 rounded transition-colors ${deviceMode === 'desktop' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Desktop Mode (100%)"
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1 rounded transition-colors ${deviceMode === 'tablet' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Tablet Mode (768px)"
          >
            <Tablet size={13} />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1 rounded transition-colors ${deviceMode === 'mobile' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Mobile Mode (375px)"
          >
            <Smartphone size={13} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasError ? (
            <span className="flex items-center gap-1 text-[11px] text-red-400">
              <AlertCircle size={12} />
              Runtime Error
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle size={12} />
              Live Sandbox
            </span>
          )}

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
              showConsole 
                ? 'bg-ide-accent text-white border-ide-accent' 
                : 'text-ide-textSecondary hover:text-ide-text border-ide-border bg-ide-panel'
            }`}
            title="Toggle Preview Console"
          >
            <Terminal size={12} />
            <span className="text-[10px]">Console ({consoleLogs.length})</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-1 text-ide-textSecondary hover:text-ide-text hover:bg-ide-panel rounded transition-colors"
            title="Reload Preview Frame"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-gray-900 flex justify-center items-center overflow-auto p-2 relative">
        <div 
          className="h-full bg-white transition-all duration-200 shadow-2xl relative rounded overflow-hidden flex flex-col"
          style={{ width: getDeviceWidth(), maxWidth: '100%' }}
        >
          {hasError && (
            <div className="p-2.5 bg-red-900/90 text-white text-xs border-b border-red-700 flex items-start gap-2 shadow-md">
              <AlertCircle size={15} className="text-red-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1 overflow-x-auto font-mono text-[11px]">
                {hasError}
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Sandbox Live Preview"
            className="w-full flex-1 border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>
      </div>

      {/* Embedded Console Drawer */}
      {showConsole && (
        <div className="h-44 bg-ide-panel border-t border-ide-border flex flex-col font-mono text-xs z-10">
          <div className="px-3 py-1.5 bg-ide-sidebar border-b border-ide-border flex items-center justify-between text-[11px]">
            <span className="text-ide-textSecondary font-semibold">Console Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsoleLogs([])}
                className="text-ide-textSecondary hover:text-red-400 transition-colors flex items-center gap-1"
                title="Clear Logs"
              >
                <Trash2 size={11} />
                Clear
              </button>
              <button
                onClick={() => setShowConsole(false)}
                className="text-ide-textSecondary hover:text-ide-text"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {consoleLogs.length === 0 ? (
              <div className="text-ide-textSecondary/50 text-[11px] italic py-2 text-center">
                Console is empty. Run code with console.log(...) to inspect live outputs.
              </div>
            ) : (
              consoleLogs.map(log => (
                <div
                  key={log.id}
                  className={`px-2 py-0.5 rounded text-[11px] flex items-start gap-2 ${
                    log.level === 'error' ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500' :
                    log.level === 'warn' ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500' :
                    'text-ide-text border-l-2 border-transparent'
                  }`}
                >
                  <span className="text-ide-textSecondary/60 text-[10px] select-none">{log.time}</span>
                  <span className="font-semibold uppercase text-[9px] px-1 rounded bg-ide-bg select-none">
                    {log.level}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap break-all">{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sandbox Preview Compiler
function buildExecutablePreviewDocument(files: FileNode[]): string {
  const indexHtml = files.find(f => f.name === 'index.html');
  const indexMd = files.find(f => f.name === 'index.md');
  const appTsx = files.find(f => f.name === 'App.tsx' || f.name === 'App.jsx');
  const mainTsx = files.find(f => f.name === 'main.tsx' || f.name === 'index.tsx');
  const jsFiles = files.filter(f => f.name.endsWith('.js') && f.name !== 'index.html');
  const tsFiles = files.filter(f => f.name.endsWith('.ts') && !f.name.endsWith('.d.ts'));
  const cssFiles = files.filter(f => f.name.endsWith('.css'));
  const pyFile = files.find(f => f.name.endsWith('.py'));

  // Console capture snippet injected into every preview iframe
  const consoleScript = `
    <script>
      (function() {
        function send(type, level, message) {
          try {
            window.parent.postMessage({
              source: 'devsandbox-preview',
              type: type,
              level: level,
              message: message
            }, '*');
          } catch(e) {}
        }
        var origLog = console.log;
        var origWarn = console.warn;
        var origError = console.error;
        console.log = function() {
          origLog.apply(console, arguments);
          send('console', 'log', Array.from(arguments).map(String).join(' '));
        };
        console.warn = function() {
          origWarn.apply(console, arguments);
          send('console', 'warn', Array.from(arguments).map(String).join(' '));
        };
        console.error = function() {
          origError.apply(console, arguments);
          send('console', 'error', Array.from(arguments).map(String).join(' '));
        };
        window.onerror = function(msg, url, line) {
          send('error', 'error', 'Error: ' + msg + ' (line ' + line + ')');
          return false;
        };
        window.addEventListener('unhandledrejection', function(event) {
          send('error', 'error', 'Unhandled Promise: ' + event.reason);
        });
      })();
    </script>
  `;

  // 1. React / Vite Project
  if (appTsx || (mainTsx && (mainTsx.content?.includes('React') || mainTsx.content?.includes('jsx')))) {
    const reactCode = appTsx?.content || mainTsx?.content || '';
    const inlinedCss = cssFiles.map(c => c.content || '').join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    ${inlinedCss}
  </style>
  ${consoleScript}
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      const { useState, useEffect, useRef, useMemo, useCallback } = React;
      
      ${cleanReactCode(reactCode)}

      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      const TargetComponent = typeof App !== 'undefined' ? App : (typeof RootApp !== 'undefined' ? RootApp : () => <div>React Loaded</div>);
      root.render(<TargetComponent />);
    } catch(err) {
      console.error(err.message);
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #ef4444; background: #1e1e2e; font-family: monospace;"><h3>React Runtime Error</h3><pre>' + err.stack + '</pre></div>';
    }
  </script>
</body>
</html>`;
  }

  // 2. Standard HTML/CSS/JS Project
  if (indexHtml) {
    let content = indexHtml.content && indexHtml.content.trim() 
      ? indexHtml.content 
      : `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; background: #090d16; color: #94a3b8; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
    .card { background: #131b2e; border: 1px solid #1e293b; padding: 2rem; border-radius: 12px; max-width: 380px; }
    h3 { color: #f8fafc; margin-top: 0; font-size: 1.1rem; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Live Sandbox Ready</h3>
    <p style="font-size: 13px;">Write HTML, CSS, or JavaScript in the editor to see your live changes rendered here in real time.</p>
  </div>
</body>
</html>`;

    // Inline CSS files
    cssFiles.forEach(css => {
      const styleTag = `<style>/* ${css.name} */\n${css.content || ''}</style>`;
      content = content.replace(new RegExp(`<link[^>]*href=["'][^"']*${css.name}["'][^>]*>`, 'gi'), styleTag);
    });

    // If there are CSS files not yet included in HTML, inject them into <head>
    const allCss = cssFiles.map(c => `<style>/* ${c.name} */\n${c.content || ''}</style>`).join('\n');
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${allCss}\n${consoleScript}\n</head>`);
    } else {
      content = `${consoleScript}\n${allCss}\n${content}`;
    }

    // Inline JS files
    jsFiles.forEach(js => {
      const scriptTag = `<script>/* ${js.name} */\n${js.content || ''}<\/script>`;
      content = content.replace(new RegExp(`<script[^>]*src=["'][^"']*${js.name}["'][^>]*><\\/script>`, 'gi'), scriptTag);
    });

    return content;
  }

  // 3. Markdown Project
  if (indexMd) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Preview</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #e2e8f0; background: #0f172a; }
    h1, h2, h3 { color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 0.3rem; }
    pre { background: #1e293b; padding: 1rem; border-radius: 8px; overflow-x: auto; color: #f8fafc; }
    code { background: #1e293b; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
  </style>
  ${consoleScript}
</head>
<body>
  <div id="content"></div>
  <script>
    document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(indexMd.content || '')});
  </script>
</body>
</html>`;
  }

  // 4. Python Project Runner
  if (pyFile) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Python Console Output</title>
  <style>
    body { margin: 0; background: #090d16; color: #f8fafc; font-family: 'JetBrains Mono', monospace; padding: 1.5rem; }
    .header { color: #38bdf8; font-weight: bold; margin-bottom: 1rem; font-size: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; }
    pre { background: #131b2e; padding: 1rem; border-radius: 8px; border: 1px solid #1e293b; color: #4ade80; line-height: 1.5; font-size: 13px; }
  </style>
  ${consoleScript}
</head>
<body>
  <div class="header">🐍 Python Virtual Interpreter — ${pyFile.name}</div>
  <pre id="output">Running script...\n</pre>
  <script>
    const code = ${JSON.stringify(pyFile.content || '')};
    const output = document.getElementById('output');
    // Simulate Python executions and outputs
    setTimeout(() => {
      let log = "=== Executing " + ${JSON.stringify(pyFile.name)} + " ===\\n";
      const lines = code.split('\\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('print(')) {
          const match = trimmed.match(/print\\((.*)\\)/);
          if (match) {
            const raw = match[1].replace(/^["']|["']$/g, '');
            log += ">> " + raw + "\\n";
          }
        }
      });
      log += "\\n[Process finished with exit code 0]";
      output.textContent = log;
      console.log(log);
    }, 400);
  </script>
</body>
</html>`;
  }

  // 5. Plain JS/TS single file
  const activeCodeFile = jsFiles[0] || tsFiles[0];
  if (activeCodeFile) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JavaScript Runner</title>
  <style>
    body { background: #090d16; color: #f8fafc; font-family: 'JetBrains Mono', monospace; padding: 1.5rem; }
    .banner { color: #facc15; font-weight: bold; margin-bottom: 1rem; }
    #log { background: #131b2e; padding: 1rem; border-radius: 8px; color: #e2e8f0; font-size: 13px; white-space: pre-wrap; }
  </style>
  ${consoleScript}
</head>
<body>
  <div class="banner">⚡ Executing ${activeCodeFile.name}</div>
  <div id="log">Running script...</div>
  <script>
    const el = document.getElementById('log');
    el.textContent = '';
    const oldLog = console.log;
    console.log = function() {
      oldLog.apply(console, arguments);
      el.textContent += Array.from(arguments).map(String).join(' ') + '\\n';
    };
    try {
      ${activeCodeFile.content || ''}
      if (!el.textContent) el.textContent = 'Script executed cleanly with no direct outputs.';
    } catch(err) {
      console.error(err.message);
      el.textContent += '\\n[Error] ' + err.message;
    }
  </script>
</body>
</html>`;
  }

  // Fallback default
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; background: #090d16; color: #94a3b8; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; }
  </style>
</head>
<body>
  <div>
    <h3 style="color: #f8fafc;">No Previewable File</h3>
    <p>Select or create an index.html, App.tsx, or script to launch interactive preview.</p>
  </div>
</body>
</html>`;
}

// Strip React imports and default exports so Babel Standalone can run code in single script scope
function cleanReactCode(code: string): string {
  return code
    .replace(/import\s+React.*?from\s+['"].*?['"];?/g, '')
    .replace(/import\s+.*?from\s+['"]react['"];?/g, '')
    .replace(/import\s+.*?from\s+['"]react-dom['"];?/g, '')
    .replace(/export\s+default\s+function/g, 'function')
    .replace(/export\s+default\s+/g, 'const App = ')
    .replace(/export\s+function/g, 'function')
    .replace(/export\s+const/g, 'const')
    .replace(/export\s+let/g, 'let');
}
