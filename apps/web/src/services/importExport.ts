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
import JSZip from 'jszip';
import type { FileNode, Project } from '../types';

export async function exportProjectAsZip(project: Project, files: FileNode[]): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    if (file.type === 'file' && file.content !== undefined) {
      zip.file(file.path.replace(/^\//, ''), file.content);
    } else if (file.type === 'folder' && file.children) {
      addFolderToZip(zip, file, '');
    }
  }
  
  const packageJson = {
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: project.description || '',
    template: project.template,
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));
  
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  return blob;
}

function addFolderToZip(zip: JSZip, folder: FileNode, basePath: string): void {
  const folderPath = basePath ? `${basePath}/${folder.name}` : folder.name;
  if (folder.children) {
    for (const child of folder.children) {
      if (child.type === 'file' && child.content !== undefined) {
        const filePath = `${folderPath}/${child.name}`;
        zip.file(filePath, child.content);
      } else if (child.type === 'folder' && child.children) {
        addFolderToZip(zip, child, folderPath);
      }
    }
  }
}

export async function importProjectFromZip(file: File): Promise<{ name: string; files: FileNode[] }> {
  const zip = await JSZip.loadAsync(file);
  const files: FileNode[] = [];
  let rootName = file.name.replace('.zip', '');
  
  const promises: Promise<void>[] = [];
  
  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    
    const path = '/' + relativePath;
    const name = relativePath.split('/').pop() || relativePath;
    const isBinary = /\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|pdf|zip|tar|gz|mp3|mp4|avi|mov)$/i.test(name);
    
    const promise = zipEntry.async(isBinary ? 'uint8array' : 'string').then((content) => {
      files.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        path,
        type: 'file',
        content: isBinary ? '' : content as string,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
    
    promises.push(promise);
  });
  
  await Promise.all(promises);
  
  return { name: rootName, files };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

