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
import React, { useState } from 'react';
import { User, Mail, LogOut, Save, Cloud, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../stores';
import { api } from '../../services/api';

export function AccountPanel() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const addNotification = useAppStore(s => s.addNotification);
  
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (isSignUp) {
        response = await api.signup(email, password, name);
      } else {
        response = await api.signin(email, password);
      }
      
      localStorage.setItem('devsandbox_token', response.token);
      setUser(response.user);
      setShowSignIn(false);
      addNotification({ type: 'success', message: `Welcome, ${response.user.name}!` });
    } catch (err) {
      addNotification({ type: 'error', message: err instanceof Error ? err.message : 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await api.signout();
      localStorage.removeItem('devsandbox_token');
      setUser(null);
      addNotification({ type: 'info', message: 'Signed out' });
    } catch (err) {
      addNotification({ type: 'error', message: 'Failed to sign out' });
    }
  };
  
  const syncProjects = async () => {
    // Sync local projects to cloud
    addNotification({ type: 'info', message: 'Syncing projects...' });
  };
  
  if (user) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-ide-accent flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ide-text truncate">{user.name}</div>
            <div className="text-xs text-ide-textSecondary truncate">{user.email}</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={syncProjects}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ide-text hover:bg-ide-hover rounded transition-colors"
          >
            <Cloud size={14} />
            Sync Projects
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  
  if (showSignIn) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ide-text mb-3">{isSignUp ? 'Create Account' : 'Sign In'}</h3>
        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          {isSignUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-3 py-2 bg-ide-bg border border-ide-border rounded text-ide-text text-sm outline-none focus:border-ide-accent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-ide-accent text-white rounded text-sm hover:bg-ide-accentHover disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-ide-textSecondary hover:text-ide-text"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </form>
      </div>
    );
  }
  
  return (
    <div className="p-3">
      <button
        onClick={() => setShowSignIn(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-ide-textSecondary hover:text-ide-text hover:bg-ide-hover rounded transition-colors w-full"
      >
        <User size={14} />
        Sign In
      </button>
    </div>
  );
}

