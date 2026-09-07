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
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, Code, FileText, Lightbulb } from 'lucide-react';
import { useAppStore } from '../../stores';
import { API_BASE } from '../../services/api';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function AIAssistantPanel() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeTab = useAppStore(s => s.tabs.find(t => t.id === s.activeTabId));
  const activeFile = useAppStore(s => s.files.find(f => f.id === activeTab?.fileId));
  const addNotification = useAppStore(s => s.addNotification);
  
  const isImageFile = (file: any) => {
    if (!file) return false;
    const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.webp'];
    return imageExts.some(ext => file.name.toLowerCase().endsWith(ext));
  };
  
  const isBinaryFile = (file: any) => {
    if (!file) return false;
    const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp', '.pdf', '.zip', '.tar', '.gz', '.exe', '.bin'];
    return binaryExts.some(ext => file.name.toLowerCase().endsWith(ext));
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => { scrollToBottom(); }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      let fileContext = null;
      
      if (activeFile) {
        if (isImageFile(activeFile)) {
          addNotification({
            type: 'warning',
            message: `Cannot analyze "${activeFile.name}" — image files are not supported by the AI.`
          });
          fileContext = {
            name: activeFile.name,
            content: `[Image file: ${activeFile.name}]`,
            isImage: true,
          };
        } else if (isBinaryFile(activeFile)) {
          addNotification({
            type: 'warning',
            message: `Cannot analyze "${activeFile.name}" — binary files are not supported.`
          });
          fileContext = {
            name: activeFile.name,
            content: `[Binary file: ${activeFile.name}]`,
            isBinary: true,
          };
        } else {
          fileContext = {
            name: activeFile.name,
            content: activeFile.content,
          };
        }
      }
      
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          fileContext,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'AI request failed');
      }
      
      const data = await response.json();
      
      const assistantMessage: AIMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: AIMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: err.message || 'Sorry, I could not process that request. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const quickActions = [
    { label: 'Explain code', icon: Lightbulb, prompt: 'Explain this code:' },
    { label: 'Fix error', icon: Code, prompt: 'Fix the error in this code:' },
    { label: 'Generate tests', icon: FileText, prompt: 'Generate tests for this code:' },
    { label: 'Refactor', icon: Code, prompt: 'Refactor this code:' },
  ];
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border flex items-center gap-2">
        <Bot size={18} className="text-ide-accent" />
        <span className="text-sm font-semibold text-ide-text">AI Assistant</span>
        {activeFile && (
          <span className="text-xs text-ide-textSecondary ml-auto">
            {activeFile.name}
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-ide-textSecondary text-sm">
            <Bot size={48} className="mx-auto mb-3 opacity-30" />
            <p>Hi! I m your AI coding assistant.</p>
            <p className="text-xs mt-1">Ask me to explain, fix, or refactor code.</p>
            
            <div className="mt-4 flex flex-col gap-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setInput(action.prompt + ' ' + (activeFile?.content || ''))}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors"
                  >
                    <Icon size={14} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-ide-accent' : 'bg-ide-sidebar'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`flex-1 px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-ide-accent text-white' : 'bg-ide-hover text-ide-text'}`}>
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-ide-sidebar flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="px-3 py-2 rounded-lg bg-ide-hover text-ide-text">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-ide-border">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI to help with your code..."
            className="flex-1 px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-ide-accent text-white rounded hover:bg-ide-accentHover disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
