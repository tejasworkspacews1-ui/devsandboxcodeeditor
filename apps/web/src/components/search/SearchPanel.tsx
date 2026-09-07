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
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Replace, X, FileText } from 'lucide-react';
import { useAppStore } from '../../stores';
import { searchFiles } from '../../utils/fileUtils';
import type { SearchResult } from '../../types';

export function SearchPanel() {
  const store = useAppStore();
  const files = store.files;
  const searchQuery = store.searchQuery;
  const setSearchQuery = store.setSearchQuery;
  const setSearchResults = store.setSearchResults;
  const showSearch = store.showSearch;
  const setShowSearch = store.setShowSearch;
  const addTab = store.addTab;
  const addNotification = store.addNotification;
  
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  
  const results: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const found = searchFiles(files, searchQuery, caseSensitive);
    const flat: SearchResult[] = [];
    found.forEach(r => {
      r.matches.forEach(m => {
        flat.push({
          fileId: r.file.id,
          filePath: r.file.path,
          lineNumber: m.line,
          column: 0,
          match: m.content,
          context: m.content,
        });
      });
    });
    return flat;
  }, [searchQuery, caseSensitive, files]);
  
  useEffect(() => {
    setSearchResults(results);
  }, [results]);
  
  const handleFileClick = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      addTab({
        id: `tab_${file.id}`,
        fileId: file.id,
        name: file.name,
        path: file.path,
        content: file.content || '',
        language: file.name.split('.').pop() || 'plaintext',
        modified: false,
        pinned: false,
      });
    }
  };
  
  const handleReplace = () => {
    if (!replaceQuery.trim()) return;
    addNotification({ type: 'info', message: `Replaced ${results.length} matches (demo)` });
  };
  
  if (!showSearch) return null;
  
  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="px-4 py-3 border-b border-ide-border">
        <div className="flex items-center gap-2 mb-2">
          <Search size={14} className="text-ide-textSecondary flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in files..."
            className="flex-1 bg-ide-bg border border-ide-border rounded px-2 py-1 text-sm text-ide-text outline-none focus:border-ide-accent"
            autoFocus
          />
          <button onClick={() => setCaseSensitive(!caseSensitive)} className={`px-2 py-1 text-xs rounded ${caseSensitive ? 'bg-ide-accent text-white' : 'bg-ide-sidebar text-ide-textSecondary'}`}>
            Aa
          </button>
          <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-ide-textSecondary hover:text-ide-text">
            <X size={14} />
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="flex items-center gap-2">
            <Replace size={14} className="text-ide-textSecondary" />
            <input
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace..."
              className="flex-1 bg-ide-bg border border-ide-border rounded px-2 py-1 text-sm text-ide-text outline-none focus:border-ide-accent"
            />
            <button onClick={handleReplace} className="px-2 py-1 text-xs bg-ide-accent text-white rounded hover:bg-ide-accentHover">
              Replace All
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {searchQuery && results.length === 0 && (
          <div className="px-4 py-8 text-center text-ide-textSecondary text-sm">
            No results found
          </div>
        )}
        
        {results.map((result, idx) => (
          <button
            key={`${result.fileId}-${result.lineNumber}-${idx}`}
            onClick={() => handleFileClick(result.fileId)}
            className="w-full text-left px-4 py-2 border-b border-ide-border/50 hover:bg-ide-hover transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText size={12} className="text-ide-textSecondary" />
              <span className="text-xs text-ide-textSecondary">{result.filePath}</span>
            </div>
            <div className="text-sm text-ide-text pl-4">
              <span className="text-ide-textSecondary">L{result.lineNumber}:</span>
              <span className="ml-2">{result.match}</span>
            </div>
          </button>
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="px-4 py-2 border-t border-ide-border text-xs text-ide-textSecondary">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

