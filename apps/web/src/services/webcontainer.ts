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
import { WebContainer } from '@webcontainer/api';
import type { FileNode } from '../types';

let containerInstance: WebContainer | null = null;
let currentServerProcess: any = null;
let currentInstallProcess: any = null;
let terminalProcess: any = null;

export async function bootWebContainer(): Promise<WebContainer> {
  if (containerInstance) return containerInstance;
  containerInstance = await WebContainer.boot();
  return containerInstance;
}

export function getWebContainer(): WebContainer | null {
  return containerInstance;
}

export async function teardownWebContainer(): Promise<void> {
  if (currentServerProcess) {
    try { await currentServerProcess.kill(); } catch {}
    currentServerProcess = null;
  }
  if (currentInstallProcess) {
    try { await currentInstallProcess.kill(); } catch {}
    currentInstallProcess = null;
  }
  if (terminalProcess) {
    try { await terminalProcess.kill(); } catch {}
    terminalProcess = null;
  }
  containerInstance = null;
}

export function mapFilesToTree(files: FileNode[]): Record<string, any> {
  const tree: Record<string, any> = {};
  
  for (const file of files) {
    if (file.type === 'file') {
      tree[file.name] = {
        file: {
          contents: file.content || '',
        },
      };
    } else if (file.type === 'folder' && file.children) {
      tree[file.name] = {
        directory: mapFilesToTree(file.children),
      };
    }
  }
  
  return tree;
}

export async function mountProject(container: WebContainer, files: FileNode[]): Promise<void> {
  const tree = mapFilesToTree(files);
  await container.mount(tree);
}

export async function runCommand(
  container: WebContainer,
  command: string,
  args: string[] = []
): Promise<{ exitCode: number; output: string }> {
  const process = await container.spawn(command, args);
  const chunks: string[] = [];
  
  process.output.pipeTo(new WritableStream({
    write(data) {
      chunks.push(data);
    }
  }));
  
  const exitCode = await process.exit;
  
  return {
    exitCode: exitCode ?? -1,
    output: chunks.join(''),
  };
}

export async function startDevServer(
  container: WebContainer,
  files: FileNode[] = []
): Promise<string> {
  if (currentServerProcess) {
    try { await currentServerProcess.kill(); } catch {}
  }
  
  const hasPackageJson = files.some(f => f.name === 'package.json');
  const hasIndexHtml = files.some(f => f.name === 'index.html');
  const hasViteConfig = files.some(f => f.name.includes('vite') || f.name.includes('webpack'));
  const hasPython = files.some(f => f.name.endsWith('.py'));
  const hasGo = files.some(f => f.name.endsWith('.go'));
  const hasRust = files.some(f => f.name.endsWith('.rs'));
  const hasRuby = files.some(f => f.name.endsWith('.rb'));
  const hasPhp = files.some(f => f.name.endsWith('.php'));
  const hasJs = files.some(f => f.name.endsWith('.js'));
  const hasTs = files.some(f => f.name.endsWith('.ts'));
  
  let command: string;
  let args: string[];
  
  if (hasPackageJson) {
    command = 'npm';
    args = ['run', 'dev'];
  } else if (hasViteConfig) {
    command = 'npm';
    args = ['run', 'dev'];
  } else if (hasRust) {
    command = 'bash';
    args = ['-c', 'cargo init --name app 2>/dev/null || true; cargo run 2>&1 | head -50'];
  } else if (hasRuby) {
    command = 'ruby';
    const rubyFile = files.find(f => f.name.endsWith('.rb'))?.name || files[0]?.name || 'main.rb';
    args = [rubyFile];
  } else if (hasPhp) {
    command = 'php';
    const phpFile = files.find(f => f.name.endsWith('.php'))?.name || files[0]?.name || 'index.php';
    args = ['-S', '0.0.0.0:3000', phpFile];
  } else if (hasGo) {
    command = 'go';
    args = ['run', '.'];
  } else if (hasPython) {
    command = 'python3';
    const pythonFile = files.find(f => f.name.endsWith('.py'))?.name || files[0]?.name || 'main.py';
    args = [pythonFile];
  } else if (hasIndexHtml) {
    command = 'npx';
    args = ['serve', '-l', '3000'];
  } else if (hasJs || hasTs) {
    command = 'node';
    const jsFile = files.find(f => f.name.endsWith('.js'))?.name || files.find(f => f.name.endsWith('.ts'))?.name || files[0]?.name || 'main.js';
    args = [jsFile];
  } else {
    command = 'npx';
    args = ['serve', '-l', '3000'];
  }
  
  currentServerProcess = await container.spawn(command, args);
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Server startup timeout'));
    }, 30000);
    
    currentServerProcess!.output.pipeTo(new WritableStream({
      write(data) {
        const trimmed = data.trim();
        if (trimmed.includes('Local:') || trimmed.includes('localhost') || trimmed.includes('http') || trimmed.includes('Running')) {
          const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            clearTimeout(timeout);
            resolve(urlMatch[1]);
          }
        }
      }
    }));
    
    currentServerProcess!.exit.then((code: number) => {
      clearTimeout(timeout);
      if (code !== 0 && code !== null) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

export async function stopServer(): Promise<void> {
  if (currentServerProcess) {
    try { await currentServerProcess.kill(); } catch {}
    currentServerProcess = null;
  }
}

export async function installDependencies(
  container: WebContainer,
  onOutput?: (msg: string) => void
): Promise<void> {
  if (currentInstallProcess) {
    try { await currentInstallProcess.kill(); } catch {}
  }
  
  currentInstallProcess = await container.spawn('npm', ['install']);
  
  currentInstallProcess.output.pipeTo(new WritableStream({
    write(data) {
      onOutput?.(data);
    }
  }));
  
  await currentInstallProcess.exit;
  currentInstallProcess = null;
}

export async function startTerminal(container: WebContainer, onOutput?: (msg: string) => void): Promise<any> {
  if (terminalProcess) {
    try { await terminalProcess.kill(); } catch {}
  }
  
  terminalProcess = await container.spawn('jsh', ['-i']);
  
  terminalProcess.output.pipeTo(new WritableStream({
    write(data) {
      onOutput?.(data);
    }
  }));
  
  return terminalProcess;
}

export async function sendTerminalCommand(command: string): Promise<void> {
  if (!terminalProcess) return;
  
  const writer = terminalProcess.input.getWriter();
  await writer.write(new TextEncoder().encode(command + '\n'));
  writer.releaseLock();
}

export async function stopTerminal(): Promise<void> {
  if (terminalProcess) {
    try { await terminalProcess.kill(); } catch {}
    terminalProcess = null;
  }
}

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'SharedArrayBuffer' in window;
}

export function getServerUrl(port: number): string {
  return `https://${port}.devsandbox.app`;
}

