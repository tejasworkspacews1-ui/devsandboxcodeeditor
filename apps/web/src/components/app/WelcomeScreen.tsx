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
import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Upload, Github, FileText, Zap, Clock, Trash2, Download, ExternalLink, X, Loader2 } from 'lucide-react';
import { useAppStore } from '../../stores';
import { exportProjectAsZip, importProjectFromZip, downloadBlob } from '../../services/importExport';
import { loadAllProjects, deleteProjectFromDB } from '../../services/storage';
import type { Project, FileNode } from '../../types';

const TEMPLATES = [
  { id: 'blank', name: 'Blank Project', desc: 'Empty workspace', icon: FileText },
  { id: 'html', name: 'HTML/CSS/JS', desc: 'Plain web project', icon: Zap },
  { id: 'react', name: 'React + Vite', desc: 'React with Vite + TS', icon: Zap },
  { id: 'typescript', name: 'TypeScript', desc: 'TypeScript starter', icon: FileText },
  { id: 'node', name: 'Node.js', desc: 'Node.js backend', icon: Zap },
  { id: 'python', name: 'Python', desc: 'Python starter', icon: FileText },
  { id: 'landing', name: 'Landing Page', desc: 'Marketing landing page', icon: FileText },
  { id: 'threejs', name: 'Three.js', desc: '3D web starter', icon: Zap },
  { id: 'tailwind', name: 'Tailwind CSS', desc: 'Tailwind utility-first', icon: Zap },
];

export function WelcomeScreen() {
  const setShowWelcome = useAppStore(s => s.setShowWelcome);
  const addProject = useAppStore(s => s.addProject);
  const setCurrentProject = useAppStore(s => s.setCurrentProject);
  const setFiles = useAppStore(s => s.setFiles);
  const addNotification = useAppStore(s => s.addNotification);
  const addTab = useAppStore(s => s.addTab);
  const setProjects = useAppStore(s => s.setProjects);
  const triggerOnboarding = useAppStore(s => s.triggerOnboarding);
  
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [showGitModal, setShowGitModal] = useState(false);
  const [gitUrl, setGitUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    loadRecentProjects();
  }, []);
  
  async function loadRecentProjects() {
    try {
      const projects = await loadAllProjects();
      const sorted = projects.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
      setRecentProjects(sorted);
    } catch (err) {
      console.error('Failed to load recent projects:', err);
    }
  }
  
  const handleCreateProject = async (templateId: string) => {
    const project = createProjectFromTemplate(templateId);
    addProject(project);
    setCurrentProject(project.id);
    setFiles(project.files);
    
    if (project.files.length > 0) {
      const firstFile = project.files[0];
      addTab({
        id: `tab_${firstFile.id}`,
        fileId: firstFile.id,
        name: firstFile.name,
        path: firstFile.path,
        content: firstFile.content || '',
        language: firstFile.name.split('.').pop() || 'plaintext',
        modified: false,
        pinned: false,
      });
    }
    
    setShowWelcome(false);
    addNotification({ type: 'success', message: `Created ${project.name}` });
  };
  
  const handleOpenProject = async (project: Project) => {
    setCurrentProject(project.id);
    setFiles(project.files);
    
    if (project.files.length > 0) {
      const firstFile = project.files[0];
      addTab({
        id: `tab_${firstFile.id}`,
        fileId: firstFile.id,
        name: firstFile.name,
        path: firstFile.path,
        content: firstFile.content || '',
        language: firstFile.name.split('.').pop() || 'plaintext',
        modified: false,
        pinned: false,
      });
    }
    
    setShowWelcome(false);
  };
  
  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!confirm('Delete this project? This cannot be undone.')) return;
    
    await deleteProjectFromDB(projectId);
    addNotification({ type: 'info', message: 'Project deleted' });
    await loadRecentProjects();
  };
  
  const handleExportProject = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setIsExporting(true);
    try {
      const blob = await exportProjectAsZip(project, project.files);
      downloadBlob(blob, `${project.name}.zip`);
      addNotification({ type: 'success', message: `Exported ${project.name}` });
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to export project' });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      addNotification({ type: 'info', message: 'Importing project...' });
      
      try {
        const { name, files } = await importProjectFromZip(file);
        
        const project: Project = {
          id: `proj_${Date.now()}`,
          name,
          template: 'imported',
          files,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        addProject(project);
        setCurrentProject(project.id);
        setFiles(files);
        setShowWelcome(false);
        addNotification({ type: 'success', message: `Imported ${name}` });
      } catch (err) {
        addNotification({ type: 'error', message: 'Failed to import project. Ensure it is a valid ZIP file.' });
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };
  
  const handleGitClone = () => {
    setShowGitModal(true);
  };
  
  const confirmGitClone = async () => {
    if (!gitUrl.trim()) return;
    
    addNotification({ type: 'info', message: `Cloning ${gitUrl}...` });
    setShowGitModal(false);
    setGitUrl('');
    
    // GitHub integration would require backend OAuth
    addNotification({ 
      type: 'warning', 
      message: 'GitHub integration requires backend OAuth. Use Import ZIP for now.' 
    });
  };
  
  return (
    <div className="h-full flex flex-col items-center justify-center bg-ide-bg p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ide-text mb-2">DevSandbox</h1>
          <p className="text-ide-textSecondary">Professional browser-based developer sandbox</p>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => handleCreateProject('blank')}
            className="flex items-center gap-2 px-4 py-2 bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 bg-ide-sidebar text-ide-text border border-ide-border rounded hover:bg-ide-hover transition-colors disabled:opacity-50"
          >
            {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isImporting ? 'Importing...' : 'Import ZIP'}
          </button>
          <button
            onClick={handleGitClone}
            className="flex items-center gap-2 px-4 py-2 bg-ide-sidebar text-ide-text border border-ide-border rounded hover:bg-ide-hover transition-colors"
          >
            <Github size={16} />
            Clone GitHub
          </button>
        </div>
        
        {recentProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-ide-textSecondary uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={14} />
              Recent Projects
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {recentProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className="p-4 bg-ide-panel border border-ide-border rounded-lg hover:border-ide-accent hover:bg-ide-hover transition-all text-left group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ide-text truncate">{project.name}</div>
                      <div className="text-xs text-ide-textSecondary mt-1">
                        {project.files.length} files · {project.template}
                      </div>
                      <div className="text-xs text-ide-textSecondary/60 mt-1">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleExportProject(e, project)}
                        disabled={isExporting}
                        className="p-1 hover:bg-ide-border rounded"
                        title="Export ZIP"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        className="p-1 hover:bg-ide-border rounded text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-ide-textSecondary uppercase tracking-wider mb-3">Start a template</h2>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map(template => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleCreateProject(template.id)}
                  className="p-4 bg-ide-panel border border-ide-border rounded-lg hover:border-ide-accent hover:bg-ide-hover transition-all text-left group"
                >
                  <Icon size={24} className="text-ide-accent mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-ide-text">{template.name}</div>
                  <div className="text-xs text-ide-textSecondary mt-1">{template.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="text-center text-xs text-ide-textSecondary">
          <p>Press <kbd className="px-1.5 py-0.5 bg-ide-sidebar border border-ide-border rounded">Ctrl+P</kbd> for command palette</p>
          <button
            onClick={triggerOnboarding}
            className="mt-2 text-ide-accent hover:text-ide-accentHover underline"
          >
            Restart guided tour
          </button>
        </div>
      </div>
      
      {showGitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-ide-panel border border-ide-border rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
              <h2 className="text-sm font-semibold text-ide-text flex items-center gap-2">
                <Github size={16} />
                Clone Repository
              </h2>
              <button onClick={() => setShowGitModal(false)} className="text-ide-textSecondary hover:text-ide-text">
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-ide-textSecondary font-medium mb-1 block">Repository URL</label>
                  <input
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowGitModal(false)} className="px-3 py-1.5 text-sm text-ide-textSecondary hover:text-ide-text">Cancel</button>
                  <button onClick={confirmGitClone} disabled={!gitUrl.trim()} className="px-4 py-1.5 text-sm bg-ide-accent text-white rounded hover:bg-ide-accentHover disabled:opacity-50">
                    Clone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function createProjectFromTemplate(templateId: string): any {
  const now = Date.now();
  
  switch (templateId) {
    case 'blank':
      return {
        id: `proj_${now}`,
        name: 'Blank Project',
        template: 'blank',
        files: [],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'html':
      return {
        id: `proj_${now}`,
        name: 'HTML Project',
        template: 'html',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Project</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="app.js"><\/script>\n</body>\n</html>'),
          createFile('styles.css', 'body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 2rem;\n  background: #1a1a1a;\n  color: #eee;\n}\n\nh1 {\n  color: #0078d4;\n}'),
          createFile('app.js', 'console.log("Hello from DevSandbox!");\n\nconst app = document.querySelector("h1");\napp.addEventListener("click", () => {\n  app.style.color = app.style.color === "rgb(0, 120, 212)" ? "#fff" : "#0078d4";\n});'),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'react':
      return {
        id: `proj_${now}`,
        name: 'React Project',
        template: 'react',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>React App</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"><\/script>\n</body>\n</html>'),
          createFile('package.json', JSON.stringify({
            name: "react-app",
            version: "1.0.0",
            type: "module",
            scripts: {
              dev: "vite",
              build: "vite build",
              preview: "vite preview"
            },
            dependencies: { react: "^18.2.0", "react-dom": "^18.2.0" },
            devDependencies: { "@vitejs/plugin-react": "^4.2.0", vite: "^5.1.0", typescript: "^5.3.0", "@types/react": "^18.2.0", "@types/react-dom": "^18.2.0" }
          }, null, 2)),
          createFile('src/main.tsx', "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);"),
          createFile('src/App.tsx', "import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div style={{ padding: '2rem', fontFamily: 'system-ui', background: '#1a1a1a', color: '#eee', minHeight: '100vh' }}>\n      <h1 style={{ color: '#0078d4' }}>React + Vite</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n}"),
          createFile('vite.config.ts', "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n})"),
          createFile('tsconfig.json', JSON.stringify({ compilerOptions: { target: "ES2020", useDefineForClassFields: true, lib: ["ES2020", "DOM", "DOM.Iterable"], module: "ESNext", skipLibCheck: true, moduleResolution: "bundler", allowImportingTsExtensions: true, resolveJsonModule: true, isolatedModules: true, noEmit: true, jsx: "react-jsx", strict: true }, include: ["src"] }, null, 2)),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'typescript':
      return {
        id: `proj_${now}`,
        name: 'TypeScript Project',
        template: 'typescript',
        files: [
          createFile('index.ts', "interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return `Hello, ${user.name}!`;\n}\n\nconst user: User = { name: 'Developer', age: 30 };\nconsole.log(greet(user));"),
          createFile('tsconfig.json', JSON.stringify({ compilerOptions: { target: "ES2020", module: "commonjs", strict: true, esModuleInterop: true, skipLibCheck: true, forceConsistentCasingInFileNames: true }, include: ["**/*.ts"] }, null, 2)),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'node':
      return {
        id: `proj_${now}`,
        name: 'Node.js Project',
        template: 'node',
        files: [
          createFile('index.js', "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello from Node.js!');\n});\n\nserver.listen(3000, () => {\n  console.log('Server running on http://localhost:3000');\n});"),
          createFile('package.json', JSON.stringify({ name: "node-app", version: "1.0.0", main: "index.js", scripts: { start: "node index.js" } }, null, 2)),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'python':
      return {
        id: `proj_${now}`,
        name: 'Python Project',
        template: 'python',
        files: [
          createFile('main.py', "def hello():\n    print('Hello from Python!')\n\nif __name__ == '__main__':\n    hello()"),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'landing':
      return {
        id: `proj_${now}`,
        name: 'Landing Page',
        template: 'landing',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Landing Page</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <header>\n    <nav>\n      <div class="logo">Brand</div>\n      <ul>\n        <li><a href="#features">Features</a></li>\n        <li><a href="#pricing">Pricing</a></li>\n        <li><a href="#contact">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  <section class="hero">\n    <h1>Build Something Amazing</h1>\n    <p>A professional landing page template</p>\n    <button>Get Started</button>\n  </section>\n</body>\n</html>'),
          createFile('styles.css', '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  background: #0a0a0a;\n  color: #fff;\n}\n\nheader {\n  padding: 1.5rem 2rem;\n  border-bottom: 1px solid #222;\n}\n\n.hero {\n  padding: 6rem 2rem;\n  text-align: center;\n}\n\nh1 {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  background: linear-gradient(135deg, #0078d4, #00d4ff);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\nbutton {\n  padding: 0.75rem 2rem;\n  background: #0078d4;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}'),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'threejs':
      return {
        id: `proj_${now}`,
        name: 'Three.js Starter',
        template: 'threejs',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Three.js</title>\n  <style>body { margin: 0; }</style>\n</head>\n<body>\n  <script type="importmap">\n  {\n    "imports": {\n      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"\n    }\n  }\n  </script>\n  <script type="module" src="main.js"><\/script>\n</body>\n</html>'),
          createFile('main.js', "import * as THREE from 'three';\n\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\n\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\n\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshStandardMaterial({ color: 0x0078d4 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\n\nconst light = new THREE.DirectionalLight(0xffffff, 1);\nlight.position.set(5, 5, 5);\nscene.add(light);\ncamera.position.z = 5;\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\n\nanimate();"),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    case 'tailwind':
      return {
        id: `proj_${now}`,
        name: 'Tailwind Project',
        template: 'tailwind',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Tailwind</title>\n  <script src="https://cdn.tailwindcss.com"><\/script>\n</head>\n<body class="bg-gray-900 text-white">\n  <div class="min-h-screen flex items-center justify-center">\n    <div class="text-center">\n      <h1 class="text-4xl font-bold text-blue-400 mb-4">Tailwind CSS</h1>\n      <p class="text-gray-400 mb-6">Utility-first CSS framework</p>\n      <button class="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors">\n        Get Started\n      </button>\n    </div>\n  </div>\n</body>\n</html>'),
        ],
        createdAt: now,
        updatedAt: now,
      };
    
    default:
      return {
        id: `proj_${now}`,
        name: 'New Project',
        template: 'blank',
        files: [],
        createdAt: now,
        updatedAt: now,
      };
  }
}

function createFile(name: string, content: string): any {
  const path = '/' + name;
  return {
    id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.split('/').pop() || name,
    path,
    type: 'file',
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

