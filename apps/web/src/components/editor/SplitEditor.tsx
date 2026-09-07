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
import { MonacoEditorComponent as MonacoEditor } from './MonacoEditor';
import type { FileNode } from '../../types';

interface SplitEditorProps {
  leftFile: FileNode | null;
  rightFile: FileNode | null;
  onClose: () => void;
  onSwap: () => void;
}

export function SplitEditor({ leftFile, rightFile, onClose, onSwap }: SplitEditorProps) {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col border-r border-ide-border">
        <div className="flex items-center justify-between px-3 py-1 bg-ide-panel border-b border-ide-border">
          <span className="text-xs text-ide-text-dim truncate">
            {leftFile?.name || 'No file'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onSwap}
              className="p-1 hover:bg-ide-hover rounded text-ide-text-dim hover:text-ide-text"
              title="Swap panes"
            >
              ⇄
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-ide-hover rounded text-ide-text-dim hover:text-ide-text"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1">
          <MonacoEditor file={leftFile || undefined} />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-3 py-1 bg-ide-panel border-b border-ide-border">
          <span className="text-xs text-ide-text-dim truncate">
            {rightFile?.name || 'No file'}
          </span>
        </div>
        <div className="flex-1">
          <MonacoEditor file={rightFile || undefined} />
        </div>
      </div>
    </div>
  );
}
