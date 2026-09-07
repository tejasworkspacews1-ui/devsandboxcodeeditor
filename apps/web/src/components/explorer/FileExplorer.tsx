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
import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, Plus, FolderOpen, File, MoreVertical, Trash2, Edit3, FilePlus, FolderPlus } from 'lucide-react';
import { useAppStore } from '../../stores';
import { buildFileTree, getFileName, isValidFileName } from '../../utils/fileUtils';
import type { FileNode } from '../../types';
import { ContextMenu } from '../ui/Primitives';

const FILE_ICONS: Record<string, React.ReactNode> = {
  'html': <span className="text-orange-400">H</span>,
  'css': <span className="text-blue-400">C</span>,
  'js': <span className="text-yellow-400">J</span>,
  'ts': <span className="text-blue-300">T</span>,
  'jsx': <span className="text-cyan-400">JX</span>,
  'tsx': <span className="text-cyan-300">TX</span>,
  'json': <span className="text-green-400">JS</span>,
  'md': <span className="text-purple-400">M</span>,
  'svg': <span className="text-orange-300">S</span>,
  'py': <span className="text-blue-500">P</span>,
  'sql': <span className="text-pink-400">SQ</span>,
  'yaml': <span className="text-gray-300">Y</span>,
  'yml': <span className="text-gray-300">Y</span>,
  'xml': <span className="text-orange-500">X</span>,
  'txt': <span className="text-gray-400">T</span>,
  'env': <span className="text-gray-300">E</span>,
  'gitignore': <span className="text-gray-400">G</span>,
  'default': <File size={14} className="text-ide-textSecondary" />,
};

function getFileIcon(name: string): React.ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || FILE_ICONS['default'];
}

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  onSelect: (node: FileNode) => void;
  selectedId: string | null;
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
}

function FileTreeItem({ node, depth, onSelect, selectedId, onContextMenu }: FileTreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === 'folder';
  const isSelected = selectedId === node.id;
  
  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-ide-hover transition-colors group ${isSelected ? 'bg-ide-active text-white' : 'text-ide-text'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            setExpanded(!expanded);
          } else {
            onSelect(node);
          }
        }}
        onContextMenu={(e) => onContextMenu(e, node)}
      >
        {isFolder && (
          <span className="flex-shrink-0">
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
        <span className="flex-shrink-0 flex items-center justify-center w-4">
          {isFolder ? <FolderOpen size={14} className="text-yellow-400" /> : getFileIcon(node.name)}
        </span>
        <span className="text-sm truncate flex-1">{node.name}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onContextMenu(e, node); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-ide-border rounded transition-all"
        >
          <MoreVertical size={12} />
        </button>
      </div>
      {isFolder && expanded && node.children?.map(child => (
        <FileTreeItem
          key={child.id}
          node={child}
          depth={depth + 1}
          onSelect={onSelect}
          selectedId={selectedId}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
}

export function FileExplorer() {
  const files = useAppStore(s => s.files);
  const selectedFileId = useAppStore(s => s.selectedFileId);
  const createFile = useAppStore(s => s.createFile);
  const deleteFile = useAppStore(s => s.deleteFile);
  const renameFile = useAppStore(s => s.renameFile);
  const addTab = useAppStore(s => s.addTab);
  const addNotification = useAppStore(s => s.addNotification);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [createName, setCreateName] = useState('');
  
  const treeFiles = buildFileTree(files);
  
  const handleSelect = (node: FileNode) => {
    if (node.type === 'file') {
      addTab({
        id: `tab_${node.id}`,
        fileId: node.id,
        name: node.name,
        path: node.path,
        content: node.content || '',
        language: node.name.split('.').pop() || 'plaintext',
        modified: false,
        pinned: false,
      });
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };
  
  const handleDelete = () => {
    if (!contextMenu) return;
    if (contextMenu.node.type === 'folder') {
      const childCount = countDescendants(contextMenu.node);
      if (childCount > 0 && !confirm(`Delete folder "${contextMenu.node.name}" and its ${childCount} item(s)?`)) {
        setContextMenu(null);
        return;
      }
    }
    deleteFile(contextMenu.node.id);
    setContextMenu(null);
    addNotification({ type: 'info', message: `Deleted ${contextMenu.node.name}` });
  };
  
  const handleRename = () => {
    if (!contextMenu) return;
    setEditingId(contextMenu.node.id);
    setEditingName(contextMenu.node.name);
    setContextMenu(null);
  };
  
  const handleRenameSubmit = () => {
    if (!editingId || !isValidFileName(editingName)) {
      setEditingId(null);
      return;
    }
    renameFile(editingId, editingName);
    setEditingId(null);
    addNotification({ type: 'success', message: `Renamed to ${editingName}` });
  };
  
  const handleCreate = () => {
    if (!createName.trim() || !isValidFileName(createName)) {
      setIsCreating(false);
      setCreateName('');
      return;
    }
    const newFile: FileNode = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: createName,
      path: `/${createName}`,
      type: createType,
      content: '',
      children: createType === 'folder' ? [] : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    createFile(newFile);
    setIsCreating(false);
    setCreateName('');
    addNotification({ type: 'success', message: `Created ${createName}` });
  };
  
  const openDiffEditor = useAppStore(s => s.openDiffEditor);
  
  const contextMenuItems = contextMenu ? [
    { label: 'Rename', onClick: handleRename },
    { label: 'Delete', onClick: handleDelete, danger: true },
    { label: 'Compare with Saved', onClick: () => {
      if (contextMenu.node.type === 'file') {
        const original = { ...contextMenu.node, content: contextMenu.node.content || '' };
        const modified = { ...contextMenu.node, content: contextMenu.node.content || '' };
        openDiffEditor(original, modified);
      }
    }},
  ] : [];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ide-border">
        <span className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider">Explorer</span>
        <div className="flex gap-1">
          <button onClick={() => { setCreateType('file'); setIsCreating(true); }} className="p-1 hover:bg-ide-hover rounded transition-colors" title="New File">
            <FilePlus size={14} className="text-ide-textSecondary" />
          </button>
          <button onClick={() => { setCreateType('folder'); setIsCreating(true); }} className="p-1 hover:bg-ide-hover rounded transition-colors" title="New Folder">
            <FolderPlus size={14} className="text-ide-textSecondary" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-1">
        {isCreating && (
          <div className="px-2 py-1 flex items-center gap-1" style={{ paddingLeft: '20px' }}>
            {createType === 'folder' ? <FolderOpen size={14} className="text-yellow-400" /> : <File size={14} className="text-ide-textSecondary" />}
            <input
              autoFocus
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setIsCreating(false); }}
              onBlur={handleCreate}
              className="bg-ide-bg border border-ide-accent rounded px-1 py-0.5 text-sm text-ide-text outline-none flex-1"
              placeholder={`${createType} name...`}
            />
          </div>
        )}
        
        {treeFiles.length === 0 && !isCreating ? (
          <div className="px-4 py-8 text-center text-ide-textSecondary text-sm">
            <p>No files yet</p>
            <p className="text-xs mt-1">Create a file to get started</p>
          </div>
        ) : (
          treeFiles.map(node => (
            <FileTreeItem
              key={node.id}
              node={node}
              depth={0}
              onSelect={handleSelect}
              selectedId={selectedFileId}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </div>
      
      {editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingId(null)}>
          <div className="bg-ide-panel border border-ide-border rounded-lg p-4 w-80" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-ide-text mb-3">Rename</h3>
            <input
              autoFocus
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setEditingId(null); }}
              className="w-full px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-ide-textSecondary hover:text-ide-text">Cancel</button>
              <button onClick={handleRenameSubmit} className="px-3 py-1.5 text-sm bg-ide-accent text-white rounded hover:bg-ide-accentHover">Rename</button>
            </div>
          </div>
        </div>
      )}
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

function countDescendants(node: FileNode): number {
  let count = 0;
  if (node.children) {
    count += node.children.length;
    node.children.forEach(child => { count += countDescendants(child); });
  }
  return count;
}

