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
import { openDB, type IDBPDatabase } from 'idb';
import type { Project, FileNode } from '../types';

const DB_NAME = 'devsandbox-db';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id' });
          filesStore.createIndex('projectId', 'projectId', { unique: false });
        }
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('workspace')) {
          db.createObjectStore('workspace', { keyPath: 'key' });
        }
      }
    },
  });
  
  return dbInstance;
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('projects', 'readwrite');
  const store = tx.objectStore('projects');
  store.put(project);
  await tx.done;
}

export async function loadProject(id: string): Promise<Project | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

export async function loadAllProjects(): Promise<Project[]> {
  const db = await getDB();
  return db.getAll('projects');
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['projects', 'files'], 'readwrite');
  const projectsStore = tx.objectStore('projects');
  const filesStore = tx.objectStore('files');
  const index = filesStore.index('projectId');
  
  projectsStore.delete(id);
  const files = await index.getAll(id);
  for (const file of files) {
    filesStore.delete(file.id);
  }
  await tx.done;
}

export async function saveFiles(projectId: string, files: FileNode[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  
  for (const file of files) {
    store.put({ ...file, projectId });
  }
  await tx.done;
}

export async function loadFiles(projectId: string): Promise<FileNode[]> {
  const db = await getDB();
  const tx = db.transaction('files', 'readonly');
  const store = tx.objectStore('files');
  const index = store.index('projectId');
  return index.getAll(projectId);
}

export async function saveWorkspace(key: string, value: any): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('workspace', 'readwrite');
  tx.objectStore('workspace').put({ key, value });
  await tx.done;
}

export async function loadWorkspace(key: string): Promise<any> {
  const db = await getDB();
  const record = await db.get('workspace', key);
  return record?.value;
}

export async function clearWorkspace(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('workspace', 'readwrite');
  tx.objectStore('workspace').clear();
  await tx.done;
}

export async function saveRecentProject(projectId: string): Promise<void> {
  const recent = await loadWorkspace('recentProjects') || [];
  const filtered = recent.filter((id: string) => id !== projectId);
  filtered.unshift(projectId);
  const trimmed = filtered.slice(0, 20);
  await saveWorkspace('recentProjects', trimmed);
}

export async function getRecentProjects(): Promise<string[]> {
  return (await loadWorkspace('recentProjects')) || [];
}

export async function saveOpenTabs(projectId: string, tabs: any[]): Promise<void> {
  await saveWorkspace(`openTabs_${projectId}`, tabs);
}

export async function getOpenTabs(projectId: string): Promise<any[]> {
  return (await loadWorkspace(`openTabs_${projectId}`)) || [];
}

