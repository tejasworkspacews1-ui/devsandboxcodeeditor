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
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink, Maximize2, X, Play, Code, Sparkles, Layers } from 'lucide-react';
import { useAppStore } from '../../stores';
import { FallbackPreview } from './FallbackPreview';

export function PreviewPanel() {
  const runtimeUrl = useAppStore(s => s.runtimeUrl);
  const previewUrl = useAppStore(s => s.previewUrl);
  const setPreviewUrl = useAppStore(s => s.setPreviewUrl);
  const startProject = useAppStore(s => s.startProject);
  const runtimeRunning = useAppStore(s => s.runtimeRunning);
  const files = useAppStore(s => s.files);
  const isLoading = useAppStore(s => s.isLoading);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [webcontainerSupported, setWebcontainerSupported] = useState(false);
  
  useEffect(() => {
    setWebcontainerSupported(typeof window !== 'undefined' && 'SharedArrayBuffer' in window && window.crossOriginIsolated);
  }, []);
  
  useEffect(() => {
    if (runtimeUrl && iframeRef.current) {
      iframeRef.current.src = runtimeUrl;
      setPreviewUrl(runtimeUrl);
      setIframeError(false);
    }
  }, [runtimeUrl, setPreviewUrl]);
  
  const handleRefresh = () => {
    if (iframeRef.current && previewUrl) {
      iframeRef.current.src = previewUrl;
      setIframeError(false);
    }
  };
  
  const handleStart = async () => {
    await startProject();
  };
  
  const hasPreviewable = files.length > 0;
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-ide-panel border-b border-ide-border">
          <span className="text-sm text-ide-text font-medium flex items-center gap-2">
            <Sparkles size={15} className="text-blue-400" />
            Live Preview (Fullscreen)
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors" title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => setIsFullscreen(false)} className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors" title="Exit Fullscreen">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white">
          {runtimeRunning && previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <FallbackPreview files={files} />
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-ide-panel border-b border-ide-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ide-text flex items-center gap-1.5">
            <Layers size={13} className="text-blue-400" />
            Live Sandbox
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1 text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors"
            title="Fullscreen Mode"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>
      
      {/* Sandbox Workspace */}
      <div className="flex-1 relative bg-gray-900">
        {runtimeRunning && previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setIframeError(true)}
          />
        ) : (
          <FallbackPreview files={files} />
        )}
      </div>
    </div>
  );
}
