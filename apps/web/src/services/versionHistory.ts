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
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '../stores';
import { 
  saveSnapshot as saveSnapshotToDB,
  getSnapshots as getSnapshotsFromDB,
  deleteSnapshot as deleteSnapshotFromDB,
  clearProjectSnapshots,
  getSnapshot as getSnapshotFromDB
} from './versionHistoryStorage';

export interface Snapshot {
  id: string;
  projectId: string;
  name: string;
  description: string;
  files: any[];
  createdAt: number;
  author: string;
}

class VersionHistoryManager {
  private maxSnapshots = 50;
  
  async createSnapshot(projectId: string, name: string, description: string, files: any[], author: string): Promise<Snapshot> {
    const snapshot: Snapshot = {
      id: uuidv4(),
      projectId,
      name,
      description,
      files: JSON.parse(JSON.stringify(files)),
      createdAt: Date.now(),
      author,
    };
    
    await saveSnapshotToDB(snapshot);
    return snapshot;
  }
  
  async getSnapshots(projectId: string): Promise<Snapshot[]> {
    return getSnapshotsFromDB(projectId);
  }
  
  async restoreSnapshot(id: string): Promise<any[] | null> {
    const snapshot = await getSnapshotFromDB(id);
    if (!snapshot) return null;
    return JSON.parse(JSON.stringify(snapshot.files));
  }
  
  async deleteSnapshot(id: string): Promise<void> {
    await deleteSnapshotFromDB(id);
  }
  
  async clearProject(projectId: string): Promise<void> {
    await clearProjectSnapshots(projectId);
  }
}

export const versionHistory = new VersionHistoryManager();

export function useVersionHistory() {
  const store = useAppStore();
  
  const createSnapshot = async (name: string, description: string) => {
    if (!store.currentProjectId) return null;
    return versionHistory.createSnapshot(
      store.currentProjectId,
      name,
      description,
      store.files,
      store.user?.name || 'Anonymous'
    );
  };
  
  const getSnapshots = async () => {
    if (!store.currentProjectId) return [];
    return versionHistory.getSnapshots(store.currentProjectId);
  };
  
  const restoreSnapshot = async (id: string) => {
    const files = await versionHistory.restoreSnapshot(id);
    if (files) {
      store.setFiles(files);
      store.addNotification({ type: 'success', message: 'Snapshot restored' });
    }
  };
  
  const deleteSnapshot = async (id: string) => {
    await versionHistory.deleteSnapshot(id);
    store.addNotification({ type: 'info', message: 'Snapshot deleted' });
  };
  
  return { createSnapshot, getSnapshots, restoreSnapshot, deleteSnapshot };
}
