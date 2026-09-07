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
import React, { useEffect, useState } from 'react';
import { Users, Circle, MessageSquare, X, Share, Eye, Edit3 } from 'lucide-react';
import { useAppStore } from '../../stores';
import { API_BASE } from '../../services/api';
import { 
  initCollaboration, 
  getCollaborationProvider, 
  getRemoteCursors,
  destroyCollaboration,
  subscribeToPresence
} from '../../services/collaboration';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor: { lineNumber: number; column: number } | null;
}

export function CollaborationPanel() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const user = useAppStore(s => s.user);
  const projectId = useAppStore(s => s.currentProjectId);
  const addNotification = useAppStore(s => s.addNotification);
  
  useEffect(() => {
    if (!user || !projectId) return;
    
    initCollaboration(projectId, { id: user.id, name: user.name, color: '#0078d4' });
    
    const updateCollaborators = () => {
      const cursors = getRemoteCursors();
      setCollaborators(cursors.map(c => ({
        id: c.clientId.toString(),
        name: c.name,
        color: c.color,
        cursor: c.cursor,
      })));
    };
    
    const unsubscribe = subscribeToPresence(updateCollaborators);
    updateCollaborators();
    
    return () => {
      unsubscribe();
      destroyCollaboration();
    };
  }, [user, projectId]);
  
  const handleShare = async () => {
    if (!projectId) return;
    
    try {
      const response = await fetch(`${API_BASE}/collab/${projectId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission: 'edit' }),
      });
      
      const data = await response.json();
      setShareUrl(data.url);
      setIsSharing(true);
      addNotification({ type: 'success', message: 'Share link created!' });
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to create share link' });
    }
  };
  
  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      addNotification({ type: 'success', message: 'Link copied to clipboard' });
    }
  };
  
  if (!user) {
    return (
      <div className="h-full flex flex-col bg-ide-panel items-center justify-center p-4">
        <Users size={48} className="text-ide-textSecondary mb-3 opacity-30" />
        <p className="text-sm text-ide-textSecondary text-center">
          Sign in to enable collaboration
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border flex items-center gap-2">
        <Users size={18} className="text-ide-accent" />
        <span className="text-sm font-semibold text-ide-text">Collaboration</span>
      </div>
      
      <div className="p-4">
        {!isSharing ? (
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors text-sm"
          >
            <Share size={16} />
            Share Project
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-ide-bg border border-ide-border rounded">
              <span className="text-xs text-ide-textSecondary flex-1 truncate">
                {shareUrl}
              </span>
              <button
                onClick={copyShareLink}
                className="text-xs text-ide-accent hover:text-ide-accentHover"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider mb-3">
          Online ({collaborators.length})
        </h4>
        
        {collaborators.length === 0 ? (
          <div className="text-center text-ide-textSecondary text-sm">
            <Circle size={32} className="mx-auto mb-2 opacity-30" />
            <p>No collaborators yet</p>
            <p className="text-xs mt-1">Share the link to invite others</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {collaborators.map(c => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2 bg-ide-bg border border-ide-border rounded-lg">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-ide-text">{c.name}</div>
                  {c.cursor && (
                    <div className="text-xs text-ide-textSecondary">
                      Line {c.cursor.lineNumber}, Col {c.cursor.column}
                    </div>
                  )}
                </div>
                <Circle size={8} className="text-green-400 fill-green-400" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-ide-border">
        <div className="flex items-center gap-2 text-xs text-ide-textSecondary">
          <Edit3 size={14} />
          <span>Real-time sync enabled</span>
        </div>
      </div>
    </div>
  );
}
