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
import type { Project, FileNode, Tab } from '../types';

export function createDefaultShowcaseProject(): { project: Project; defaultTabs: Tab[] } {
  const now = Date.now();
  const projectId = 'proj_showcase_master';

  const appTsxContent = `import React, { useState } from 'react';

export default function App() {
  const [counter, setCounter] = useState(42);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'creator'>('overview');
  const [theme, setTheme] = useState<'indigo' | 'emerald' | 'amber'>('indigo');

  const themeColors = {
    indigo: { accent: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    emerald: { accent: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    amber: { accent: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500/30' }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex flex-col justify-between">
      {/* Top Banner */}
      <div>
        <header className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              DS
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DevSandbox Live Workspace</h1>
              <p className="text-xs text-slate-400">Interactive In-Browser Compilation & Multi-Tenant Runtime</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Sandbox
            </span>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 my-6">
          {(['overview', 'metrics', 'creator'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all \${
                activeTab === tab
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }\`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-2">Interactive React State Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Edit this code directly in the left Monaco editor pane. The live preview immediately reflects your JSX and state changes.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCounter(c => c - 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium border border-slate-700 active:scale-95 transition-all"
                >
                  - Decrement
                </button>
                <span className="font-mono text-xl font-bold text-indigo-400 w-12 text-center">
                  {counter}
                </span>
                <button
                  onClick={() => setCounter(c => c + 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
                >
                  + Increment
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Instant Theme Palette</h3>
              <p className="text-xs text-slate-400 mb-4">Select an active color palette for your sandbox components:</p>
              <div className="flex gap-2">
                {(['indigo', 'emerald', 'amber'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setTheme(color)}
                    className={\`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border \${
                      theme === color
                        ? 'border-white text-white font-bold'
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                    }\`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <div className={\`mt-4 p-3 rounded-lg border text-xs \${themeColors[theme].border} bg-slate-950\`}>
                Active Accent: <strong className={themeColors[theme].text}>{theme.toUpperCase()}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Compile Time</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">12ms</div>
              <div className="text-[10px] text-slate-500 mt-1">Direct In-Browser Transpiler</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Active Tenant</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">Isolated</div>
              <div className="text-[10px] text-slate-500 mt-1">Tejas WorkSpace (Owner)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Peer Sync</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">100% E2E</div>
              <div className="text-[10px] text-slate-500 mt-1">Encrypted Room Channel</div>
            </div>
          </div>
        )}

        {activeTab === 'creator' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Tejas Kamble"
                className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md object-cover"
              />
              <div>
                <h3 className="text-base font-bold text-white">Tejas Kamble</h3>
                <p className="text-xs text-indigo-400 font-medium">Founder & Principal Architect</p>
                <p className="text-xs text-slate-400 mt-1">
                  Email: <span className="text-slate-200">tejasksocials@gmail.com</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
              <a
                href="https://tejaskambleportfolio.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 transition-all font-medium"
              >
                🌐 Visit Portfolio
              </a>
              <a
                href="https://www.linkedin.com/in/tejaskambleportfolio/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 border border-blue-500/30 transition-all font-medium"
              >
                💼 LinkedIn Profile
              </a>
              <a
                href="https://github.com/tejasworkspacews1-ui"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all font-medium"
              >
                🐙 GitHub (@tejasworkspacews1-ui)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <footer className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <span>DevSandbox • Built by Tejas Kamble</span>
        <span className="text-slate-400">
          Disclaimer: All project data shown/accessed is completely legal, free and publicly accessible data.
        </span>
      </footer>
    </div>
  );
}
`;

  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevSandbox Showcase</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const stylesCssContent = `/* Global Sandbox Styles */
@layer base {
  body {
    background-color: #020617;
    color: #f8fafc;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
}
`;

  const readmeMdContent = `# DevSandbox Professional Code Editor

Developed by **Tejas Kamble**
- **Email**: tejasksocials@gmail.com
- **Website**: https://tejaskambleportfolio.vercel.app/
- **LinkedIn**: https://www.linkedin.com/in/tejaskambleportfolio/
- **Instagram**: @tejask.co.in
- **GitHub**: https://github.com/tejasworkspacews1-ui

---

### Project Legal Disclaimer
*All project data shown/accessed is completely legal, free and publicly accessible data and not proprietary data.*

### Features
1. **Multi-Tenant Architecture**: Isolated workspaces with per-tenant databases, quotas, and roles.
2. **Real-Time Live Sandbox**: In-browser compiler with live DOM rendering and Babel transpilation.
3. **Interactive Terminal**: Virtual shell with file system controls, history, autocompletion, and Git commands.
4. **AI Pair Programmer**: Integrated code audit, bug fixing, and test generation.
5. **Team Collaboration**: BroadcastChannel peer sync and live room chat.
`;

  const files: FileNode[] = [
    {
      id: 'file_app_tsx',
      name: 'App.tsx',
      path: '/App.tsx',
      type: 'file',
      content: appTsxContent,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'file_index_html',
      name: 'index.html',
      path: '/index.html',
      type: 'file',
      content: indexHtmlContent,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'file_styles_css',
      name: 'styles.css',
      path: '/styles.css',
      type: 'file',
      content: stylesCssContent,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'file_readme_md',
      name: 'README.md',
      path: '/README.md',
      type: 'file',
      content: readmeMdContent,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const project: Project = {
    id: projectId,
    name: 'React + Vite Showcase',
    description: 'DevSandbox Interactive Showcase Suite by Tejas Kamble',
    template: 'react',
    files,
    createdAt: now,
    updatedAt: now,
    tenantId: 'tenant_primary',
    userId: 'usr_founder',
  };

  const defaultTabs: Tab[] = [
    {
      id: 'tab_file_app_tsx',
      fileId: 'file_app_tsx',
      name: 'App.tsx',
      path: '/App.tsx',
      content: appTsxContent,
      language: 'typescript',
      modified: false,
      pinned: true,
    },
    {
      id: 'tab_file_readme_md',
      fileId: 'file_readme_md',
      name: 'README.md',
      path: '/README.md',
      content: readmeMdContent,
      language: 'markdown',
      modified: false,
      pinned: false,
    },
  ];

  return { project, defaultTabs };
}
