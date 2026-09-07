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
import React from 'react';
import { Palette, Type, Code, Layout, Terminal as TerminalIcon, Monitor } from 'lucide-react';
import { useAppStore } from '../../stores';
import { DEFAULT_SETTINGS } from '../../types';
import { Select, Input } from '../ui/Primitives';

const THEME_OPTIONS = [
  { value: 'vs-dark', label: 'Dark+' },
  { value: 'vs-light', label: 'Light+' },
  { value: 'hc-black', label: 'High Contrast' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
];

const WORD_WRAP_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
  { value: 'wordWrapColumn', label: 'Word Wrap Column' },
  { value: 'bounded', label: 'Bounded' },
];

const CURSOR_STYLE_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'block', label: 'Block' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-thin', label: 'Line Thin' },
  { value: 'block-outline', label: 'Block Outline' },
];

const CURSOR_BLINK_OPTIONS = [
  { value: 'blink', label: 'Blink' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'phase', label: 'Phase' },
  { value: 'expand', label: 'Expand' },
  { value: 'solid', label: 'Solid' },
];

const AUTO_SAVE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'afterDelay', label: 'After Delay' },
  { value: 'onFocusChange', label: 'On Focus Change' },
];

const LINE_NUMBER_OPTIONS = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
  { value: 'relative', label: 'Relative' },
];

export function SettingsPanel() {
  const settings = useAppStore(s => s.editorSettings);
  const updateSettings = useAppStore(s => s.updateSettings);
  const showSettings = useAppStore(s => s.showSettings);
  const setShowSettings = useAppStore(s => s.setShowSettings);
  
  if (!showSettings) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
          <h2 className="text-sm font-semibold text-ide-text">Settings</h2>
          <button onClick={() => setShowSettings(false)} className="text-ide-textSecondary hover:text-ide-text transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-6">
            <Section title="Appearance" icon={<Palette size={16} />}>
              <Select
                label="Theme"
                options={THEME_OPTIONS}
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as any })}
              />
              <Input
                label="Accent Color"
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
              />
            </Section>
            
            <Section title="Editor" icon={<Code size={16} />}>
              <Input
                label="Font Size"
                type="number"
                min="8"
                max="32"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) || 14 })}
              />
              <Input
                label="Font Family"
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              />
              <Input
                label="Tab Size"
                type="number"
                min="1"
                max="16"
                value={settings.tabSize}
                onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) || 2 })}
              />
              <Select
                label="Word Wrap"
                options={WORD_WRAP_OPTIONS}
                value={settings.wordWrap}
                onChange={(e) => updateSettings({ wordWrap: e.target.value as any })}
              />
              <Select
                label="Line Numbers"
                options={LINE_NUMBER_OPTIONS}
                value={settings.lineNumbers}
                onChange={(e) => updateSettings({ lineNumbers: e.target.value as any })}
              />
              <Select
                label="Cursor Style"
                options={CURSOR_STYLE_OPTIONS}
                value={settings.cursorStyle}
                onChange={(e) => updateSettings({ cursorStyle: e.target.value as any })}
              />
              <Select
                label="Cursor Blinking"
                options={CURSOR_BLINK_OPTIONS}
                value={settings.cursorBlinking}
                onChange={(e) => updateSettings({ cursorBlinking: e.target.value as any })}
              />
              <SettingToggle label="Minimap" checked={settings.minimap} onChange={(v) => updateSettings({ minimap: v })} />
              <SettingToggle label="Bracket Pair Colorization" checked={settings.bracketPairColorization} onChange={(v) => updateSettings({ bracketPairColorization: v })} />
              <SettingToggle label="Smooth Scrolling" checked={settings.smoothScrolling} onChange={(v) => updateSettings({ smoothScrolling: v })} />
              <SettingToggle label="Insert Spaces" checked={settings.insertSpaces} onChange={(v) => updateSettings({ insertSpaces: v })} />
              <SettingToggle label="Format on Save" checked={settings.formatOnSave} onChange={(v) => updateSettings({ formatOnSave: v })} />
              <Select
                label="Auto Save"
                options={AUTO_SAVE_OPTIONS}
                value={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.value as any })}
              />
            </Section>
            
            <Section title="Terminal" icon={<TerminalIcon size={16} />}>
              <Input
                label="Terminal Font Size"
                type="number"
                min="8"
                max="32"
                value={settings.terminalFontSize}
                onChange={(e) => updateSettings({ terminalFontSize: parseInt(e.target.value) || 13 })}
              />
            </Section>
            
            <Section title="Behavior" icon={<Monitor size={16} />}>
              <SettingToggle label="Confirm Before Delete" checked={settings.confirmDelete} onChange={(v) => updateSettings({ confirmDelete: v })} />
            </Section>
          </div>
        </div>
        
        <div className="px-4 py-3 border-t border-ide-border flex justify-between">
          <button
            onClick={() => updateSettings(DEFAULT_SETTINGS)}
            className="px-3 py-1.5 text-sm text-ide-textSecondary hover:text-ide-text transition-colors"
          >
            Reset to Defaults
          </button>
          <button onClick={() => setShowSettings(false)} className="px-4 py-1.5 text-sm bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-ide-textSecondary uppercase tracking-wider flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function SettingToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-ide-text">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-ide-accent' : 'bg-ide-border'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

