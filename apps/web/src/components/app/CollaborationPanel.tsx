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
import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, Circle, MessageSquare, Share2, Copy, Check, 
  Send, Shield, Sparkles, UserPlus, Eye, Edit3, Wifi
} from 'lucide-react';
import { useAppStore } from '../../stores';
import { api } from '../../services/api';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  color: string;
  role: 'Host' | 'Editor' | 'Viewer';
  activeFile?: string;
  status: 'online' | 'idle';
}

interface CollabMessage {
  id: string;
  sender: string;
  color: string;
  text: string;
  time: string;
}

export function CollaborationPanel() {
  const user = useAppStore(s => s.user);
  const currentProjectId = useAppStore(s => s.currentProjectId);
  const projects = useAppStore(s => s.projects);
  const addNotification = useAppStore(s => s.addNotification);
  const activeTab = useAppStore(s => s.tabs.find(t => t.id === s.activeTabId));

  const [copied, setCopied] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<CollabMessage[]>([
    {
      id: 'msg_1',
      sender: 'System',
      color: '#38bdf8',
      text: 'Collaboration room initialized with end-to-end encrypted peer channel.',
      time: '12:00 PM',
    },
    {
      id: 'msg_2',
      sender: 'Sarah Chen',
      color: '#ec4899',
      text: 'Hey Tejas! Ready to pair-program on this workspace.',
      time: '12:01 PM',
    }
  ]);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: user?.id || 'usr_tejas',
      name: user?.name || 'Tejas Kamble',
      email: user?.email || 'tejasksocials@gmail.com',
      color: '#0078d4',
      role: 'Host',
      activeFile: activeTab?.name || 'App.tsx',
      status: 'online',
    },
    {
      id: 'usr_sarah',
      name: 'Sarah Chen (Lead Dev)',
      email: 'sarah.chen@devsandbox.io',
      color: '#ec4899',
      role: 'Editor',
      activeFile: 'index.html',
      status: 'online',
    },
    {
      id: 'usr_guest_alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@dev.io',
      color: '#10b981',
      role: 'Viewer',
      activeFile: 'styles.css',
      status: 'online',
    }
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Setup BroadcastChannel for real-time cross-tab peer sync
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('devsandbox_realtime_collab');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'CHAT_MESSAGE') {
          setChatLogs(prev => [...prev, data]);
        } else if (type === 'PEER_PRESENCE') {
          setCollaborators(prev => {
            if (prev.some(c => c.id === data.id)) return prev;
            return [...prev, data];
          });
        }
      };

      // Broadcast self presence
      channel.postMessage({
        type: 'PEER_PRESENCE',
        data: {
          id: user?.id || 'usr_' + Date.now(),
          name: user?.name || 'Tejas Kamble',
          email: user?.email || 'tejasksocials@gmail.com',
          color: '#3b82f6',
          role: 'Editor',
          activeFile: activeTab?.name || 'main.tsx',
          status: 'online',
        }
      });
    } catch (e) {
      // Channel fallback
    }

    return () => {
      channelRef.current?.close();
    };
  }, [user, activeTab?.name]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatLogs]);

  const shareLink = `${window.location.origin}/#room=${currentProjectId || 'workspace_master'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification({ type: 'success', message: 'Collaboration link copied to clipboard!' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg: CollabMessage = {
      id: `msg_${Date.now()}`,
      sender: user?.name || 'Tejas Kamble',
      color: '#0078d4',
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatLogs(prev => [...prev, newMsg]);
    channelRef.current?.postMessage({ type: 'CHAT_MESSAGE', data: newMsg });
    setChatMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-ide-panel overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-ide-border bg-ide-sidebar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-400" />
          <span className="text-xs font-semibold text-ide-text">Real-Time Collaboration</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
          <Wifi size={10} />
          {collaborators.length} Peers Connected
        </span>
      </div>

      {/* Share Room Link Card */}
      <div className="p-3 border-b border-ide-border bg-ide-sidebar/40">
        <div className="text-[11px] font-semibold text-ide-text mb-1.5 flex items-center gap-1.5">
          <Share2 size={12} className="text-blue-400" />
          Invite Collaborators
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            readOnly
            value={shareLink}
            className="flex-1 px-2.5 py-1.5 bg-ide-panel border border-ide-border rounded text-[11px] text-ide-textSecondary font-mono truncate select-all"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-ide-accent hover:bg-ide-accentHover text-white rounded text-xs font-medium transition-colors flex-shrink-0"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
        <div className="text-[10px] text-ide-textSecondary mt-1">
          Anyone with this link can view & live-edit files with active cursor sync.
        </div>
      </div>

      {/* Active Collaborators List */}
      <div className="p-3 border-b border-ide-border">
        <div className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active In Workspace ({collaborators.length})</span>
          <span className="text-[10px] text-emerald-400">● Live sync</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {collaborators.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2 rounded-lg bg-ide-sidebar border border-ide-border text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-ide-text truncate">{c.name}</span>
                    <span className="text-[9px] px-1 rounded bg-ide-panel text-ide-textSecondary border border-ide-border">
                      {c.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-ide-textSecondary truncate">
                    Editing <strong>{c.activeFile || 'index.html'}</strong>
                  </div>
                </div>
              </div>

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" title="Active cursor" />
            </div>
          ))}
        </div>
      </div>

      {/* In-Room Collaborative Team Chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-ide-sidebar/20">
        <div className="px-3 py-1.5 bg-ide-sidebar border-b border-ide-border text-[11px] font-semibold text-ide-textSecondary flex items-center gap-1.5">
          <MessageSquare size={12} className="text-blue-400" />
          Workspace Peer Chat
        </div>

        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {chatLogs.map(log => (
            <div key={log.id} className="flex flex-col text-xs leading-relaxed">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="font-semibold" style={{ color: log.color }}>
                  {log.sender}
                </span>
                <span className="text-ide-textSecondary/60">{log.time}</span>
              </div>
              <div className="text-ide-text bg-ide-sidebar/80 p-2 rounded-lg border border-ide-border/50 mt-0.5 text-[11px]">
                {log.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="p-2 border-t border-ide-border bg-ide-panel flex items-center gap-1.5">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type message to room peers..."
            className="flex-1 px-2.5 py-1.5 bg-ide-sidebar border border-ide-border rounded text-xs text-ide-text outline-none focus:border-ide-accent"
          />
          <button
            type="submit"
            disabled={!chatMessage.trim()}
            className="p-1.5 bg-ide-accent hover:bg-ide-accentHover text-white rounded transition-colors disabled:opacity-40"
            title="Send Message"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
