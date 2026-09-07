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
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useAppStore } from '../stores';

let ydoc: Y.Doc | null = null;
let wsProvider: WebsocketProvider | null = null;
let currentProjectId: string | null = null;

export function initCollaboration(projectId: string, user: { id: string; name: string; color: string }): Y.Doc {
  if (ydoc) {
    ydoc.destroy();
  }
  
  ydoc = new Y.Doc();
  currentProjectId = projectId;
  
  wsProvider = new WebsocketProvider(
    'wss://devsandboxcodeeditor.onrender.com',
    `project_${projectId}`,
    ydoc,
    {
      params: { userId: user.id, userName: user.name, userColor: user.color }
    }
  );
  
  return ydoc;
}

export function getCollaborationDoc(): Y.Doc | null {
  return ydoc;
}

export function getCollaborationProvider(): WebsocketProvider | null {
  return wsProvider;
}

export function destroyCollaboration(): void {
  if (wsProvider) {
    wsProvider.destroy();
    wsProvider = null;
  }
  if (ydoc) {
    ydoc.destroy();
    ydoc = null;
  }
  currentProjectId = null;
}

export function syncFileToYjs(fileId: string, content: string): void {
  if (!ydoc) return;
  const filesMap = ydoc.getMap('files');
  filesMap.set(fileId, content);
}

export function getSyncedContent(fileId: string): string | null {
  if (!ydoc) return null;
  const filesMap = ydoc.getMap('files');
  return (filesMap.get(fileId) as string) || null;
}

export function subscribeToFile(fileId: string, callback: (content: string) => void): () => void {
  if (!ydoc) return () => {};
  const filesMap = ydoc.getMap('files');
  const handler = () => {
    const content = filesMap.get(fileId) as string;
    if (content !== undefined) callback(content);
  };
  filesMap.observe(handler);
  return () => filesMap.unobserve(handler);
}

export function getAwareness(): any | null {
  if (!wsProvider) return null;
  return wsProvider.awareness;
}

export function subscribeToPresence(callback: (states: any) => void): () => void {
  if (!wsProvider) return () => {};
  const awareness = wsProvider.awareness;
  awareness.on('change', callback);
  return () => awareness.off('change', callback);
}

export function setLocalCursor(cursor: { lineNumber: number; column: number }): void {
  if (!wsProvider) return;
  const awareness = wsProvider.awareness;
  awareness.setLocalStateField('cursor', cursor);
}

export function getRemoteCursors(): Array<{ clientId: number; name: string; color: string; cursor: any }> {
  if (!wsProvider) return [];
  const awareness = wsProvider.awareness;
  const states: Array<{ clientId: number; name: string; color: string; cursor: any }> = [];
  
  awareness.getStates().forEach((state: any, clientId: number) => {
    if (clientId !== awareness.clientID) {
      states.push({
        clientId,
        name: state.user?.name || 'Anonymous',
        color: state.user?.color || '#000000',
        cursor: state.cursor || null,
      });
    }
  });
  
  return states;
}
