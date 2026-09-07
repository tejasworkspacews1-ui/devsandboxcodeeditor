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
import { useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppStore } from '../stores';

export function useKeyboardShortcuts() {
  const store = useAppStore();
  
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    saveCurrentFile();
  });
  
  useHotkeys('ctrl+w, cmd+w', (e) => {
    e.preventDefault();
    if (store.activeTabId) {
      store.closeTab(store.activeTabId);
    }
  });
  
  useHotkeys('ctrl+p, cmd+p', (e) => {
    e.preventDefault();
    store.setShowCommandPalette(true);
  });
  
  useHotkeys('ctrl+shift+p, cmd+shift+p', (e) => {
    e.preventDefault();
    store.setShowCommandPalette(true);
  });
  
  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    store.setShowSearch(true);
  });
  
  useHotkeys('ctrl+shift+f, cmd+shift+f', (e) => {
    e.preventDefault();
    store.setShowSearch(true);
  });
  
  useHotkeys('ctrl+b, cmd+b', (e) => {
    e.preventDefault();
    store.setLayout({ sidebarCollapsed: !store.layout.sidebarCollapsed });
  });
  
  useHotkeys('ctrl+`, cmd+`', (e) => {
    e.preventDefault();
    store.setLayout({ panelCollapsed: !store.layout.panelCollapsed });
  });
  
  useHotkeys('ctrl+shift+e, cmd+shift+e', (e) => {
    e.preventDefault();
    store.setLayout({ activeView: 'explorer', sidebarCollapsed: false });
  });
  
  useHotkeys('ctrl+shift+g, cmd+shift+g', (e) => {
    e.preventDefault();
    store.setShowSearch(true);
  });
  
  useHotkeys('ctrl+shift+v, cmd+shift+v', (e) => {
    e.preventDefault();
    store.togglePreview();
  });
  
  useHotkeys('ctrl+z, cmd+z', (e) => {
    // Handled by Monaco
  });
  
  useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
    // Handled by Monaco
  });
}

function saveCurrentFile() {
  const store = useAppStore.getState();
  const activeTab = store.tabs.find(t => t.id === store.activeTabId);
  if (activeTab && activeTab.modified) {
    store.updateFile(activeTab.fileId, activeTab.content);
    store.addNotification({
      type: 'success',
      message: `Saved ${activeTab.name}`,
      duration: 2000,
    });
  }
}

