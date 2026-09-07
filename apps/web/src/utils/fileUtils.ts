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
import type { FileNode } from '../types';

export function buildFileTree(files: FileNode[]): FileNode[] {
  const map = new Map<string, FileNode>();
  const roots: FileNode[] = [];
  
  files.forEach(file => {
    map.set(file.path, { ...file, children: [] });
  });
  
  map.forEach((file, path) => {
    if (file.type === 'folder') {
      const lastSlash = path.lastIndexOf('/');
      if (lastSlash > 0) {
        const parentPath = path.substring(0, lastSlash);
        const parent = map.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(file);
        } else {
          roots.push(file);
        }
      } else {
        roots.push(file);
      }
    }
  });
  
  return sortNodes(roots);
}

function sortNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  }).map(node => {
    if (node.children) {
      return { ...node, children: sortNodes(node.children) };
    }
    return node;
  });
}

export function findFileByPath(files: FileNode[], path: string): FileNode | undefined {
  return files.find(f => f.path === path);
}

export function findFileById(files: FileNode[], id: string): FileNode | undefined {
  return files.find(f => f.id === id);
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

export function getFileName(path: string): string {
  return path.split('/').pop() || path;
}

export function getParentPath(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash <= 0) return '/';
  return path.substring(0, lastSlash);
}

export function isValidFileName(name: string): boolean {
  if (!name || name.trim() === '') return false;
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  return !invalidChars.test(name);
}

export function getUniqueName(files: FileNode[], desiredPath: string): string {
  if (!files.some(f => f.path === desiredPath)) return desiredPath;
  
  const parentPath = getParentPath(desiredPath);
  const baseName = getFileName(desiredPath).replace(/\.[^/.]+$/, '');
  const ext = desiredPath.includes('.') ? '.' + desiredPath.split('.').pop() : '';
  let counter = 1;
  
  while (files.some(f => f.path === `${parentPath}/${baseName} (${counter})${ext}`)) {
    counter++;
  }
  
  return `${parentPath}/${baseName} (${counter})${ext}`;
}

export function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.type === 'file') return count + 1;
    return count + countFiles(node.children || []);
  }, 0);
}

export function searchFiles(files: FileNode[], query: string, caseSensitive = false): Array<{ file: FileNode; matches: Array<{ line: number; content: string }> }> {
  if (!query.trim()) return [];
  
  const results: Array<{ file: FileNode; matches: Array<{ line: number; content: string }> }> = [];
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  
  function searchNode(node: FileNode) {
    if (node.type === 'file' && node.content) {
      const lines = node.content.split('\n');
      const matches: Array<{ line: number; content: string }> = [];
      
      lines.forEach((line, idx) => {
        const searchLine = caseSensitive ? line : line.toLowerCase();
        if (searchLine.includes(searchQuery)) {
          matches.push({ line: idx + 1, content: line.trim() });
        }
      });
      
      if (matches.length > 0) {
        results.push({ file: node, matches });
      }
    }
    
    if (node.children) {
      node.children.forEach(searchNode);
    }
  }
  
  files.forEach(searchNode);
  return results;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

