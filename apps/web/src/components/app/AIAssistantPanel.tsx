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
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Loader2, Sparkles, Code, FileText, 
  Lightbulb, Copy, Check, ArrowDownToLine, Zap, Shield, Bug, RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../stores';
import { api } from '../../services/api';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const QUICK_ACTIONS = [
  { label: 'Fix Bugs', prompt: 'Inspect this file and provide solutions for potential bugs, syntax issues, or type errors.', icon: Bug },
  { label: 'Explain Code', prompt: 'Explain the architecture, design patterns, and flow of this file clearly.', icon: Lightbulb },
  { label: 'Optimize', prompt: 'Refactor this code for optimal execution speed, cleaner patterns, and memory efficiency.', icon: Zap },
  { label: 'Unit Tests', prompt: 'Generate comprehensive unit tests for all functions and components in this file.', icon: Code },
  { label: 'Security Audit', prompt: 'Audit this code for security vulnerabilities, injection risks, and data safety.', icon: Shield },
];

export function AIAssistantPanel() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome_ai',
      role: 'assistant',
      content: `Hello! I am your **DevSandbox AI Pair Programmer**.\n\nI can help you review, fix, test, and write code for your active workspace in real-time. Choose a quick action below or describe what you want to build!`,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeTab = useAppStore(s => s.tabs.find(t => t.id === s.activeTabId));
  const activeFile = useAppStore(s => s.files.find(f => f.id === activeTab?.fileId));
  const updateFile = useAppStore(s => s.updateFile);
  const addNotification = useAppStore(s => s.addNotification);
  const settings = useAppStore(s => s.editorSettings);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const fileContext = activeFile ? {
        name: activeFile.name,
        content: activeFile.content || '',
      } : null;

      const result = await api.aiChat({
        messages: [...messages, userMsg],
        fileContext,
        model: selectedModel,
        apiKey: settings.geminiApiKey || settings.openaiApiKey,
      });

      const assistantMsg: AIMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      addNotification({ type: 'error', message: err.message || 'AI request failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification({ type: 'success', message: 'Code copied to clipboard' });
  };

  const handleInsertIntoFile = (code: string) => {
    if (!activeFile) {
      addNotification({ type: 'warning', message: 'No file currently open in editor' });
      return;
    }
    const updated = (activeFile.content || '') + '\n\n' + code;
    updateFile(activeFile.id, updated);
    addNotification({ type: 'success', message: `Inserted code into ${activeFile.name}` });
  };

  // Render markdown with interactive code blocks
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const lang = lines[0]?.trim() || 'typescript';
        const codeText = lines.slice(1).join('\n');
        const codeId = `${msgId}_code_${index}`;

        return (
          <div key={index} className="my-2 rounded-lg border border-ide-border bg-gray-950 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1 bg-ide-panel border-b border-ide-border text-[11px] text-ide-textSecondary">
              <span className="font-semibold uppercase text-blue-400">{lang}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyCode(codeText, codeId)}
                  className="flex items-center gap-1 hover:text-ide-text transition-colors"
                  title="Copy Code"
                >
                  {copiedId === codeId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedId === codeId ? 'Copied' : 'Copy'}</span>
                </button>
                {activeFile && (
                  <button
                    onClick={() => handleInsertIntoFile(codeText)}
                    className="flex items-center gap-1 hover:text-ide-accent transition-colors ml-2"
                    title="Insert Into Active File"
                  >
                    <ArrowDownToLine size={11} />
                    <span>Insert</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="p-3 overflow-x-auto text-ide-text text-[11px] leading-relaxed whitespace-pre">
              {codeText}
            </pre>
          </div>
        );
      }

      // Format markdown headers, bold, and lists
      const formatted = part
        .replace(/^### (.*$)/gim, '<div class="font-bold text-sm text-blue-400 mt-2 mb-1">$1</div>')
        .replace(/^## (.*$)/gim, '<div class="font-bold text-base text-ide-text mt-2 mb-1">$1</div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-ide-panel text-blue-300 font-mono text-[11px]">$1</code>');

      return (
        <div 
          key={index} 
          className="whitespace-pre-wrap leading-relaxed text-xs"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-ide-panel overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-ide-border bg-ide-sidebar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-ide-text">AI Pair Programmer</div>
            <div className="text-[10px] text-ide-textSecondary">DevSandbox Assistant</div>
          </div>
        </div>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-ide-panel text-ide-text border border-ide-border rounded px-2 py-1 text-[11px] outline-none"
        >
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="devsandbox-smart">Local Smart Engine</option>
        </select>
      </div>

      {/* Active File Context Chip */}
      {activeFile && (
        <div className="px-3 py-1.5 bg-blue-950/20 border-b border-blue-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-300">
            <FileText size={12} />
            <span className="truncate max-w-[180px]">Context: <strong>{activeFile.name}</strong></span>
          </div>
          <span className="text-[10px] text-ide-textSecondary">
            {(activeFile.content || '').split('\n').length} lines
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] text-ide-textSecondary px-1">
              {msg.role === 'user' ? (
                <span>You</span>
              ) : (
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <Bot size={11} />
                  DevSandbox AI
                </span>
              )}
            </div>
            <div
              className={`p-3 rounded-xl max-w-[92%] shadow-sm ${
                msg.role === 'user'
                  ? 'bg-ide-accent text-white rounded-br-none'
                  : 'bg-ide-sidebar border border-ide-border text-ide-text rounded-bl-none'
              }`}
            >
              {renderMessageContent(msg.content, msg.id)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-ide-textSecondary py-2 px-3 bg-ide-sidebar border border-ide-border rounded-xl w-fit">
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <span>Analyzing code context & synthesizing solution...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 border-t border-ide-border bg-ide-sidebar/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_ACTIONS.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleSend(action.prompt)}
              disabled={loading}
              className="flex items-center gap-1 px-2.5 py-1 bg-ide-panel hover:bg-ide-hover border border-ide-border rounded-full text-[11px] text-ide-textSecondary hover:text-ide-text transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <Icon size={11} className="text-blue-400" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 border-t border-ide-border bg-ide-panel flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeFile ? `Ask about ${activeFile.name}...` : 'Ask anything about code or architecture...'}
          className="flex-1 bg-ide-sidebar border border-ide-border rounded-lg px-3 py-2 text-xs text-ide-text outline-none focus:border-ide-accent transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-ide-accent hover:bg-ide-accentHover text-white rounded-lg transition-colors disabled:opacity-40"
          title="Send"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
