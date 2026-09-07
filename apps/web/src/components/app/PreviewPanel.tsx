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
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink, Maximize2, X, Play, Code } from 'lucide-react';
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
  const [webcontainerSupported, setWebcontainerSupported] = useState(true);
  
  useEffect(() => {
    setWebcontainerSupported(typeof window !== 'undefined' && 'SharedArrayBuffer' in window);
  }, []);
  
  useEffect(() => {
    if (runtimeUrl && iframeRef.current) {
      iframeRef.current.src = runtimeUrl;
      setPreviewUrl(runtimeUrl);
      setIframeError(false);
    }
  }, [runtimeUrl]);
  
  useEffect(() => {
    if (!autoRefresh || !previewUrl) return;
    
    const interval = setInterval(() => {
      if (iframeRef.current && previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, previewUrl]);
  
  const handleRefresh = () => {
    if (iframeRef.current && previewUrl) {
      iframeRef.current.src = previewUrl;
      setIframeError(false);
    }
  };
  
  const handleStart = async () => {
    await startProject();
  };
  
  const hasPreviewable = files.some(f => 
    f.name === 'index.html' || f.name === 'index.md' || 
    f.name.endsWith('.js') || f.name.endsWith('.ts') || 
    f.name.endsWith('.py') || f.name.endsWith('.go') ||
    f.name.endsWith('.rs') || f.name.endsWith('.rb') ||
    f.name.endsWith('.php') || f.name.endsWith('.css') ||
    f.name === 'package.json'
  );
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-ide-panel border-b border-ide-border">
          <span className="text-sm text-ide-text">Live Preview</span>
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
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
            />
          ) : (
            <FallbackPreview files={files} />
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-1.5 bg-ide-panel border-b border-ide-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ide-text">Preview</span>
          {runtimeRunning && previewUrl && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
          {!webcontainerSupported && hasPreviewable && (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Code size={10} />
              Static
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-1 rounded transition-colors ${autoRefresh ? 'text-ide-accent' : 'text-ide-textSecondary hover:text-ide-text'}`}
            title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          >
            <RefreshCw size={12} />
          </button>
          <button onClick={handleRefresh} className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors" title="Refresh">
            <RefreshCw size={12} />
          </button>
          {previewUrl && (
            <>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1 text-ide-textSecondary hover:text-ide-text transition-colors"
                title="Fullscreen"
              >
                <Maximize2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative bg-gray-900">
        {!runtimeRunning ? (
          hasPreviewable ? (
            <FallbackPreview files={files} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <div className="text-center">
                <Code size={40} className="mx-auto mb-3 text-gray-600" />
                <p className="text-sm mb-3">No previewable file found</p>
                <p className="text-xs text-gray-600 mb-3">Create an index.html, .js, .ts, or .py file</p>
                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className="px-4 py-2 bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Starting...' : 'Start Project'}
                </button>
              </div>
            </div>
          )
        ) : previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading preview...</p>
            </div>
          </div>
        )}
        
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center text-gray-300">
              <p className="text-sm mb-2">Failed to load preview</p>
              <button onClick={handleRefresh} className="px-3 py-1.5 bg-ide-accent text-white rounded text-sm">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
