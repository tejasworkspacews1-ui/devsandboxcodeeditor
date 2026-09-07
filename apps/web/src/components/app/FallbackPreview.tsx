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
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores';

interface FallbackPreviewProps {
  files: any[];
}

export function FallbackPreview({ files }: FallbackPreviewProps) {
  const [html, setHtml] = useState('<html><body><h1>No preview available</h1></body></html>');
  
  useEffect(() => {
    const indexFile = files.find(f => f.name === 'index.html');
    const indexMd = files.find(f => f.name === 'index.md');
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name.endsWith('.js'));
    const tsFile = files.find(f => f.name.endsWith('.ts'));
    const pyFile = files.find(f => f.name.endsWith('.py'));
    const goFile = files.find(f => f.name.endsWith('.go'));
    const rustFile = files.find(f => f.name.endsWith('.rs'));
    const rubyFile = files.find(f => f.name.endsWith('.rb'));
    const phpFile = files.find(f => f.name.endsWith('.php'));
    
    if (indexFile) {
      setHtml(indexFile.content || '<html><body>Empty file</body></html>');
    } else if (indexMd) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#333}pre{background:#f5f5f5;padding:1rem;overflow-x:auto}code{background:#f5f5f5;padding:0.1rem 0.3rem}h1,h2,h3{color:#0078d4}</style></head><body><div id="content">${escapeHtml(indexMd.content || '')}</div><script>marked || (function(){var m=document.getElementById('content');m.innerHTML=m.textContent})()<\/script></body></html>`);
    } else if (jsFile || tsFile) {
      const code = (jsFile || tsFile)?.content || '';
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title><style>body{margin:0;padding:0;background:#1a1a1a;color:#eee;font-family:monospace}</style></head><body><script>${escapeHtml(code)}<\/script></body></html>`);
    } else if (cssFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title><style>${escapeHtml(cssFile.content || '')}</style></head><body><h1>CSS Preview</h1><p>Styles applied to this page.</p></body></html>`);
    } else if (pyFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Python Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>Python file detected</h2><p>Run this in a Python environment to see output.</p><pre>${escapeHtml(pyFile.content || '')}</pre></body></html>`);
    } else if (goFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Go Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>Go file detected</h2><p>Run this in a Go environment to see output.</p><pre>${escapeHtml(goFile.content || '')}</pre></body></html>`);
    } else if (rustFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Rust Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>Rust file detected</h2><p>Run this in a Rust environment to see output.</p><pre>${escapeHtml(rustFile.content || '')}</pre></body></html>`);
    } else if (rubyFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ruby Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>Ruby file detected</h2><p>Run this in a Ruby environment to see output.</p><pre>${escapeHtml(rubyFile.content || '')}</pre></body></html>`);
    } else if (phpFile) {
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PHP Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>PHP file detected</h2><p>Run this in a PHP environment to see output.</p><pre>${escapeHtml(phpFile.content || '')}</pre></body></html>`);
    } else {
      const anyFile = files[0];
      setHtml(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview</title><style>body{font-family:system-ui;max-width:800px;margin:2rem auto;padding:0 1rem;background:#1a1a1a;color:#eee}pre{background:#2d2d2d;padding:1rem;overflow-x:auto}</style></head><body><h2>${escapeHtml(anyFile?.name || 'File')}</h2><pre>${escapeHtml(anyFile?.content || '')}</pre></body></html>`);
    }
  }, [files]);
  
  return (
    <iframe
      srcDoc={html}
      title="Preview"
      className="w-full h-full border-0 bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function useFallbackPreview(): boolean {
  const [supported, setSupported] = useState(true);
  
  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'SharedArrayBuffer' in window);
  }, []);
  
  return supported;
}
