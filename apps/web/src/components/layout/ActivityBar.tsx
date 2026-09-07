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
import { 
  Home, Files, Search, GitBranch, Play, Square,
  Terminal, SplitSquareHorizontal, Settings, User, Cloud, Bot, Package, Bug, Users, Store
} from 'lucide-react';
import { useAppStore } from '../../stores';

const ACTIVITY_ITEMS = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'git', icon: GitBranch, label: 'Source Control' },
  { id: 'runtime', icon: Play, label: 'Runtime' },
  { id: 'ai', icon: Bot, label: 'AI Assistant' },
  { id: 'extensions', icon: Package, label: 'Extensions' },
  { id: 'marketplace', icon: Store, label: 'Marketplace' },
  { id: 'collab', icon: Users, label: 'Collaboration' },
  { id: 'debug', icon: Bug, label: 'Debugger' },
];

export function ActivityBar() {
  const layout = useAppStore(s => s.layout);
  const setLayout = useAppStore(s => s.setLayout);
  const setShowWelcome = useAppStore(s => s.setShowWelcome);
  const setShowSettings = useAppStore(s => s.setShowSettings);
  
  const toggleSidebar = () => setLayout({ sidebarCollapsed: !layout.sidebarCollapsed });
  
  const handleHome = () => {
    setShowWelcome(true);
    setLayout({ activeView: 'explorer' });
  };
  
  const handleSettings = () => {
    setShowSettings(true);
  };
  
  return (
    <div className="w-12 bg-ide-sidebar flex flex-col items-center py-2 border-r border-ide-border flex-shrink-0">
      <div className="flex flex-col gap-1 flex-1">
        <button
          onClick={handleHome}
          className="w-full aspect-square flex items-center justify-center text-ide-textSecondary hover:text-ide-text transition-colors mb-2"
          title="Home"
        >
          <Home size={20} strokeWidth={1.5} />
        </button>
        
        {ACTIVITY_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = layout.activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setLayout({ activeView: item.id as any, sidebarCollapsed: false })}
              className={`w-full aspect-square flex items-center justify-center relative group transition-colors ${isActive ? 'text-ide-text' : 'text-ide-textSecondary hover:text-ide-text'}`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-ide-accent" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col gap-1 border-t border-ide-border pt-2">
        <button
          onClick={toggleSidebar}
          className="w-full aspect-square flex items-center justify-center text-ide-textSecondary hover:text-ide-text transition-colors"
          title="Toggle Sidebar"
        >
          <SplitSquareHorizontal size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={handleSettings}
          className="w-full aspect-square flex items-center justify-center text-ide-textSecondary hover:text-ide-text transition-colors"
          title="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <button
          className="w-full aspect-square flex items-center justify-center text-ide-textSecondary hover:text-ide-text transition-colors"
          title="Account"
        >
          <User size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
