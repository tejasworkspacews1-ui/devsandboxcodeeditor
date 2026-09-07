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
import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../stores';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to DevSandbox',
    description: 'A browser-based developer sandbox. This quick tour will show you around.',
    target: 'welcome',
    position: 'bottom',
  },
  {
    title: 'Create a Project',
    description: 'Click New Project or choose a template to start coding instantly.',
    target: 'new-project',
    position: 'bottom',
  },
  {
    title: 'File Explorer',
    description: 'Browse, create, and manage your project files from the sidebar.',
    target: 'file-explorer',
    position: 'right',
  },
  {
    title: 'Code Editor',
    description: 'Edit files with a full-featured code editor. Tabs, split view, and more.',
    target: 'editor',
    position: 'left',
  },
  {
    title: 'Run & Preview',
    description: 'Click Run to start your project and see live output in the preview panel.',
    target: 'run',
    position: 'top',
  },
  {
    title: 'AI Assistant',
    description: 'Ask the AI to explain, fix, refactor, or generate code for you.',
    target: 'ai',
    position: 'right',
  },
  {
    title: 'You\'re all set!',
    description: 'You now know the basics. Explore the rest on your own.',
    target: 'done',
    position: 'bottom',
  },
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  
  const startOnboarding = useAppStore(s => s.startOnboarding);
  const completeOnboarding = useAppStore(s => s.completeOnboarding);
  const addNotification = useAppStore(s => s.addNotification);
  
  useEffect(() => {
    if (startOnboarding) {
      setVisible(true);
      const timer = setTimeout(() => {
        // Allow the store flag to settle before showing
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const hasSeen = localStorage.getItem('devsandbox_onboarding_seen');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [startOnboarding]);
  
  const step = STEPS[currentStep];
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  const handleComplete = useCallback(() => {
    localStorage.setItem('devsandbox_onboarding_seen', 'true');
    setVisible(false);
    completeOnboarding();
    addNotification({ type: 'info', message: 'Tour completed! Restart it anytime from the welcome screen.' });
  }, [completeOnboarding, addNotification]);
  
  const handleSkip = () => {
    if (window.confirm('Skip the tour? You can restart it later from the welcome screen.')) {
      handleComplete();
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm" 
        onClick={handleSkip} 
      />
      
      <div 
        className="absolute bg-ide-panel border border-ide-accent rounded-lg shadow-2xl p-5 w-80 pointer-events-auto transition-all duration-300"
        style={{ 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-ide-textSecondary">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <button onClick={handleSkip} className="text-ide-text-dim hover:text-ide-text">
            <X size={14} />
          </button>
        </div>
        
        <h3 className="text-lg font-semibold text-ide-text mb-2">{step.title}</h3>
        <p className="text-sm text-ide-textSecondary mb-4">{step.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? 'bg-ide-accent' : 'bg-ide-border'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-ide-textSecondary hover:text-ide-text transition-colors"
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 text-sm bg-ide-accent text-white rounded hover:bg-ide-accentHover transition-colors"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Check size={14} />
                  Done
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingButton() {
  const triggerOnboarding = useAppStore(s => s.triggerOnboarding);
  
  return (
    <button
      onClick={triggerOnboarding}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-ide-textSecondary hover:text-ide-text transition-colors"
      title="Restart tour"
    >
      <ChevronRight size={14} />
      Tour
    </button>
  );
}
