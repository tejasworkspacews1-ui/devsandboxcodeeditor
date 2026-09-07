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
import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';

const PORT = Number(process.env.WS_PORT) || 3002;

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor: { lineNumber: number; column: number } | null;
}

interface ProjectRoom {
  projectId: string;
  ydoc: Y.Doc;
  collaborators: Map<string, Collaborator>;
  clients: Map<string, WebSocket>;
}

const rooms = new Map<string, ProjectRoom>();
const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF', '#FF8C42', '#C44569', '#6C5CE7'];

function getCollaboratorColor(index: number): string {
  return colors[index % colors.length];
}

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: PORT });
  
  wss.on('connection', (ws: WebSocket) => {
    let projectId: string | null = null;
    let collaborator: Collaborator | null = null;
    let clientId: string | null = null;
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join':
            projectId = message.projectId;
            clientId = uuidv4();
            collaborator = {
              id: message.userId,
              name: message.name,
              color: message.color || getCollaboratorColor(rooms.size % colors.length),
              cursor: null,
            };
            
            if (!rooms.has(projectId!)) {
              const ydoc = new Y.Doc();
              rooms.set(projectId!, { projectId: projectId!, ydoc, collaborators: new Map(), clients: new Map() });
            }
            
            const room = rooms.get(projectId!)!;
            room.collaborators.set(collaborator.id, collaborator);
            room.clients.set(clientId!, ws);
            
            // Send current state to new client
            const state = Y.encodeStateAsUpdate(room.ydoc);
            ws.send(JSON.stringify({
              type: 'sync',
              update: Buffer.from(state).toString('base64'),
            }));
            
            broadcast(projectId!, {
              type: 'user_joined',
              collaborator,
              collaborators: Array.from(room.collaborators.values()),
            }, ws);
            
            break;
            
          case 'yjs_sync':
            if (collaborator && projectId) {
              const room = rooms.get(projectId);
              if (room) {
                const update = Buffer.from(message.update, 'base64');
                Y.applyUpdate(room.ydoc, update);
                
                // Broadcast to other clients
                broadcast(projectId, {
                  type: 'yjs_sync',
                  update: message.update,
                }, ws);
              }
            }
            break;
            
          case 'cursor_move':
            if (collaborator && projectId) {
              collaborator.cursor = message.cursor;
              broadcast(projectId, {
                type: 'cursor_update',
                collaborator,
              }, ws);
            }
            break;
            
          case 'file_change':
            if (collaborator && projectId) {
              const room = rooms.get(projectId);
              if (room) {
                const filesMap = room.ydoc.getMap('files');
                filesMap.set(message.fileId, message.content);
                
                broadcast(projectId, {
                  type: 'file_change',
                  fileId: message.fileId,
                  content: message.content,
                  collaborator: collaborator.id,
                }, ws);
              }
            }
            break;
            
          case 'chat_message':
            if (collaborator && projectId) {
              broadcast(projectId, {
                type: 'chat_message',
                message: message.message,
                collaborator,
              }, ws);
            }
            break;
            
          case 'leave':
            handleLeave(ws, projectId, collaborator, clientId);
            break;
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });
    
    ws.on('close', () => {
      handleLeave(ws, projectId, collaborator, clientId);
    });
  });
  
  function handleLeave(ws: WebSocket, projectId: string | null, collaborator: Collaborator | null, clientId: string | null) {
    if (!projectId || !collaborator) return;
    
    const room = rooms.get(projectId);
    if (room) {
      if (clientId) room.clients.delete(clientId);
      room.collaborators.delete(collaborator.id);
      
      if (room.collaborators.size === 0) {
        room.ydoc.destroy();
        rooms.delete(projectId);
      }
      
      broadcast(projectId, {
        type: 'user_left',
        collaborator,
        collaborators: room ? Array.from(room.collaborators.values()) : [],
      });
    }
  }
  
  function broadcast(projectId: string | null, message: any, exclude: WebSocket | null = null) {
    if (!projectId) return;
    const data = JSON.stringify(message);
    wss.clients.forEach((client: WebSocket) => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  
  console.log(`DevSandbox WebSocket server running on port ${PORT}`);
  
  return wss;
}
