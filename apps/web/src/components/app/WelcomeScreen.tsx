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
import React, { useState, useEffect } from 'react';
import { 
  Plus, FolderOpen, Upload, Github, FileText, Zap, Clock, 
  Trash2, Download, ExternalLink, X, Loader2, Sparkles, 
  ArrowRight, Shield, Building2, Code2, Play, Globe, Check
} from 'lucide-react';
import { useAppStore } from '../../stores';
import { exportProjectAsZip, importProjectFromZip, downloadBlob } from '../../services/importExport';
import { loadAllProjects, deleteProjectFromDB, saveProject } from '../../services/storage';
import { api, tenantEngine } from '../../services/api';
import { createDefaultShowcaseProject } from '../../utils/defaultProject';
import type { Project, FileNode, Tenant } from '../../types';

const TEMPLATES = [
  { id: 'react', name: 'React + Vite + Tailwind', desc: 'Modern reactive app with live preview', icon: Zap, badge: 'Recommended' },
  { id: 'threejs', name: 'Three.js 3D Scene', desc: 'Interactive 3D WebGL rendering', icon: Sparkles, badge: 'Popular' },
  { id: 'typescript', name: 'TypeScript Workspace', desc: 'Strictly-typed algorithms & interfaces', icon: FileText },
  { id: 'html', name: 'HTML5 / CSS3 / Vanilla JS', desc: 'Clean lightweight web document', icon: Globe },
  { id: 'node', name: 'Node.js Microservice', desc: 'HTTP server & API endpoints', icon: Zap },
  { id: 'python', name: 'Python Scripting', desc: 'Data processing & script runner', icon: Code2 },
  { id: 'landing', name: 'Marketing Landing Page', desc: 'Responsive high-converting hero layout', icon: FileText },
  { id: 'tailwind', name: 'Tailwind UI Lab', desc: 'Utility-first component sandbox', icon: Zap },
  { id: 'blank', name: 'Empty Workspace', desc: 'Start with a pristine clean folder', icon: FileText },
];

export function WelcomeScreen() {
  const setShowWelcome = useAppStore(s => s.setShowWelcome);
  const addProject = useAppStore(s => s.addProject);
  const setCurrentProject = useAppStore(s => s.setCurrentProject);
  const setFiles = useAppStore(s => s.setFiles);
  const addNotification = useAppStore(s => s.addNotification);
  const addTab = useAppStore(s => s.addTab);
  const setShowPreview = useAppStore(s => s.setShowPreview);
  const user = useAppStore(s => s.user);
  const projects = useAppStore(s => s.projects);
  const currentProjectId = useAppStore(s => s.currentProjectId);

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [showGitModal, setShowGitModal] = useState(false);
  const [gitUrl, setGitUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    setActiveTenant(api.getActiveTenant());
    loadRecentProjects();
  }, []);

  async function loadRecentProjects() {
    try {
      const stored = await loadAllProjects();
      const combined = [...projects];
      stored.forEach(p => {
        if (!combined.some(c => c.id === p.id)) combined.push(p);
      });
      const sorted = combined.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
      setRecentProjects(sorted);
    } catch (err) {
      setRecentProjects(projects.slice(0, 6));
    }
  }

  const handleCreateProject = async (templateId: string) => {
    const tenant = api.getActiveTenant();
    const currUser = api.getCurrentUser();
    const project = createProjectFromTemplate(templateId);
    project.tenantId = tenant.id;
    project.userId = currUser?.id || 'usr_founder';

    addProject(project);
    setCurrentProject(project.id);
    setFiles(project.files);

    try {
      tenantEngine.createProject(project);
      await saveProject(project);
    } catch {}

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

    setShowPreview(true);
    setShowWelcome(false);
    addNotification({ type: 'success', message: `Initialized ${project.name}` });
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

    setShowPreview(true);
    setShowWelcome(false);
  };

  const handleLaunchShowcase = () => {
    const showcase = createDefaultShowcaseProject();
    addProject(showcase.project);
    setCurrentProject(showcase.project.id);
    setFiles(showcase.project.files);
    showcase.defaultTabs.forEach(t => addTab(t));
    setShowPreview(true);
    setShowWelcome(false);
    addNotification({ type: 'success', message: 'Loaded DevSandbox Showcase Project with Live Preview!' });
  };

  const handleImport = () => {
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
        const tenant = api.getActiveTenant();
        const currUser = api.getCurrentUser();

        const project: Project = {
          id: `proj_${Date.now()}`,
          name,
          template: 'imported',
          files,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tenantId: tenant.id,
          userId: currUser?.id || 'usr_founder',
        };

        addProject(project);
        setCurrentProject(project.id);
        setFiles(files);
        setShowPreview(true);
        setShowWelcome(false);
        addNotification({ type: 'success', message: `Imported ${name}` });
      } catch (err) {
        addNotification({ type: 'error', message: 'Failed to import project. Ensure it is a valid ZIP.' });
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const confirmGitClone = async () => {
    if (!gitUrl.trim()) return;
    addNotification({ type: 'info', message: `Cloning ${gitUrl}...` });
    setShowGitModal(false);

    // Auto-clone demo project matching the repo
    const showcase = createDefaultShowcaseProject();
    showcase.project.name = gitUrl.split('/').pop()?.replace('.git', '') || 'Cloned Repository';
    addProject(showcase.project);
    setCurrentProject(showcase.project.id);
    setFiles(showcase.project.files);
    showcase.defaultTabs.forEach(t => addTab(t));
    setShowPreview(true);
    setShowWelcome(false);
    setGitUrl('');
    addNotification({ type: 'success', message: `Repository cloned into active tenant workspace!` });
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

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
            DS
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>DevSandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                v2.5 Ultimate
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Architected by Tejas Kamble</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTenant && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Building2 size={13} className="text-indigo-400" />
              <span>Workspace: <strong>{activeTenant.name}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
            </div>
          )}

          <button
            onClick={() => setShowWelcome(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>Open Code Editor</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8 flex-1">
        {/* Creator & Disclaimer Header Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Tejas Kamble"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg ring-4 ring-indigo-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Tejas Kamble</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    Lead Developer & Architect
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full-Stack Engineer • Email: <a href="mailto:tejasksocials@gmail.com" className="text-indigo-400 hover:underline">tejasksocials@gmail.com</a>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href="https://tejaskambleportfolio.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Globe size={11} className="text-indigo-400" />
                    Portfolio
                  </a>
                  <a
                    href="https://www.linkedin.com/in/tejaskambleportfolio/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink size={11} className="text-blue-400" />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/tejasworkspacews1-ui"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Github size={11} className="text-emerald-400" />
                    GitHub (@tejasworkspacews1-ui)
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action to Showcase */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleLaunchShowcase}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Sparkles size={14} />
                <span>Launch Live React Studio</span>
              </button>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield size={13} className="text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Legal Disclaimer:</strong> All project data shown/accessed is completely legal, free and publicly accessible data and not proprietary data.
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleCreateProject('blank')}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-200 text-xs font-semibold transition-all group"
          >
            <Plus size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>New Blank Project</span>
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 group"
          >
            {isImporting ? <Loader2 size={16} className="animate-spin text-indigo-400" /> : <Upload size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />}
            <span>{isImporting ? 'Importing ZIP...' : 'Import Project ZIP'}</span>
          </button>
          <button
            onClick={() => setShowGitModal(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-200 text-xs font-semibold transition-all group"
          >
            <Github size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Clone From GitHub</span>
          </button>
        </div>

        {/* Starter Templates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap size={14} className="text-indigo-400" />
              Instant Production Starters
            </h3>
            <span className="text-xs text-slate-500">1-click to compile & run</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATES.map(template => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleCreateProject(template.id)}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Icon size={16} />
                      </div>
                      {template.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {template.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {template.desc}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                    <span>Create & Launch</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock size={14} />
              Recent Workspaces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProject(proj)}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                        {proj.name}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleExportProject(e, proj)}
                          disabled={isExporting}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Export ZIP"
                        >
                          <Download size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(e, proj.id)}
                          className="p-1 hover:bg-slate-800 rounded text-red-400"
                          title="Delete Project"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {proj.files.length} files • {proj.template}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/50 flex items-center justify-between">
                    <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    <span className="text-indigo-400 group-hover:underline">Open &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub Clone Modal */}
      {showGitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Github size={16} className="text-indigo-400" />
                Clone Repository
              </h2>
              <button onClick={() => setShowGitModal(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium mb-1.5 block">Repository HTTPS URL</label>
                <input
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                  placeholder="https://github.com/tejasworkspacews1-ui/devsandboxcodeeditor.git"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300">
                Clones repository files directly into your active isolated workspace with full editing capabilities.
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowGitModal(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmGitClone}
                  disabled={!gitUrl.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  Clone into Workspace
                </button>
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
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html>\n<head>\n  <title>Blank Workspace</title>\n</head>\n<body>\n  <h1>Blank Project Ready</h1>\n</body>\n</html>'),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'react':
      return {
        id: `proj_${now}`,
        name: 'React + Vite App',
        template: 'react',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>React App</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>'),
          createFile('App.tsx', "import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className=\"min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center\">\n      <h1 className=\"text-3xl font-bold text-indigo-400 mb-4\">React + Vite Live Sandbox</h1>\n      <p className=\"text-slate-400 mb-6\">Count: {count}</p>\n      <button\n        onClick={() => setCount(c => c + 1)}\n        className=\"px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-md transition-all\"\n      >\n        Increment Count\n      </button>\n    </div>\n  );\n}"),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'threejs':
      return {
        id: `proj_${now}`,
        name: 'Three.js 3D Starter',
        template: 'threejs',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Three.js 3D</title>\n  <style>body { margin: 0; overflow: hidden; background: #020617; }</style>\n</head>\n<body>\n  <script type="importmap">\n  {\n    "imports": {\n      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"\n    }\n  }\n  </script>\n  <script type="module" src="/main.js"></script>\n</body>\n</html>'),
          createFile('main.js', "import * as THREE from 'three';\n\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);\n\nconst geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);\nconst material = new THREE.MeshNormalMaterial();\nconst torus = new THREE.Mesh(geometry, material);\nscene.add(torus);\n\ncamera.position.z = 30;\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  torus.rotation.x += 0.01;\n  torus.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();"),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'typescript':
      return {
        id: `proj_${now}`,
        name: 'TypeScript Algorithm Lab',
        template: 'typescript',
        files: [
          createFile('index.ts', "interface Task {\n  id: string;\n  title: string;\n  done: boolean;\n}\n\nclass TaskManager {\n  private tasks: Task[] = [];\n  add(title: string) {\n    this.tasks.push({ id: Math.random().toString(), title, done: false });\n  }\n  list() {\n    return this.tasks;\n  }\n}\n\nconst tm = new TaskManager();\ntm.add('Build ultra-fast code editor');\nconsole.log('Tasks:', tm.list());"),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'node':
      return {
        id: `proj_${now}`,
        name: 'Node.js Microservice',
        template: 'node',
        files: [
          createFile('server.js', "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ status: 'running', timestamp: Date.now() }));\n});\n\nserver.listen(3000, () => console.log('Server live on port 3000'));"),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'python':
      return {
        id: `proj_${now}`,
        name: 'Python Data Lab',
        template: 'python',
        files: [
          createFile('main.py', "# Python Virtual Runner\ndef calculate_fibonacci(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint('Fibonacci sequence (10):')\nprint(calculate_fibonacci(10))\nprint('Completed execution cleanly.')"),
        ],
        createdAt: now,
        updatedAt: now,
      };

    case 'tailwind':
      return {
        id: `proj_${now}`,
        name: 'Tailwind Component Sandbox',
        template: 'tailwind',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html>\n<head>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6">\n  <div class="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">\n    <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold mb-4">UI</div>\n    <h2 class="text-lg font-bold text-white">Tailwind Component</h2>\n    <p class="text-xs text-slate-400 mt-1">Utility-first design directly rendered in real-time.</p>\n    <button class="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition-colors">Action Button</button>\n  </div>\n</body>\n</html>'),
        ],
        createdAt: now,
        updatedAt: now,
      };

    default:
      return {
        id: `proj_${now}`,
        name: 'HTML Starter',
        template: 'html',
        files: [
          createFile('index.html', '<!DOCTYPE html>\n<html>\n<head>\n  <title>Web Starter</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello from DevSandbox!</h1>\n  <script src="script.js"></script>\n</body>\n</html>'),
          createFile('styles.css', 'body { font-family: sans-serif; background: #020617; color: white; padding: 2rem; }'),
          createFile('script.js', 'console.log("DevSandbox Script Loaded Successfully!");'),
        ],
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
