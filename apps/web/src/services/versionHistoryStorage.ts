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
import type { Snapshot } from './versionHistory';

const DB_NAME = 'devsandbox-history';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('snapshots')) {
        const store = db.createObjectStore('snapshots', { keyPath: 'id' });
        store.createIndex('projectId', 'projectId', { unique: false });
      }
    },
  });
  
  return dbInstance;
}

export async function saveSnapshot(snapshot: Snapshot): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('snapshots', 'readwrite');
  await tx.store.put(snapshot);
  await tx.done;
}

export async function getSnapshots(projectId: string): Promise<Snapshot[]> {
  const db = await getDB();
  const tx = db.transaction('snapshots', 'readonly');
  const store = tx.store;
  const index = store.index('projectId');
  const snapshots = await index.getAll(projectId);
  await tx.done;
  return snapshots.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSnapshot(id: string): Promise<Snapshot | undefined> {
  const db = await getDB();
  return db.get('snapshots', id);
}

export async function deleteSnapshot(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('snapshots', id);
}

export async function clearProjectSnapshots(projectId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('snapshots', 'readwrite');
  const store = tx.store;
  const index = store.index('projectId');
  const snapshots = await index.getAll(projectId);
  for (const snap of snapshots) {
    await store.delete(snap.id);
  }
  await tx.done;
}
