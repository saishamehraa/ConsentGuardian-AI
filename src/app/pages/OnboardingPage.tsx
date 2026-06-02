import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Loader2, CheckCircle2, ShieldCheck, Database, Lock, Network } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { scanRepository } from '../services/scanService';
import { setScanResult } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = [
  { id: 'ingest', label: 'Repository Ingestion & Analysis', icon: Github },
  { id: 'framework', label: 'Framework & Architecture Detection', icon: Network },
  { id: 'dataflow', label: 'Data-Flow & AST Mapping', icon: Database },
  { id: 'sensitive', label: 'Sensitive Data Inventory Generation', icon: Lock },
  { id: 'privacy', label: 'Privacy Agent Initialization', icon: ShieldCheck },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [repoUrl, setRepoUrl] = useState(location.state?.repoUrl || 'https://github.com/acme-corp/ecommerce');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isScanning) {
      setApiError(null);
      let step = 0;
      setCurrentStepIndex(step);
      
      const interval = setInterval(() => {
        step++;
        if (step < STEPS.length - 1) { // Keep it before the last step until the API actually finishes
          setCurrentStepIndex(step);
        }
      }, 1500);

      // Call the actual backend API
      scanRepository(repoUrl).then((result) => {
        clearInterval(interval);
        setCurrentStepIndex(STEPS.length); // Mark all completed
        setScanResult(result);
        
        setTimeout(() => {
          navigate('/dashboard/overview');
        }, 1000);
      }).catch(err => {
        clearInterval(interval);
        setApiError(err.message || "Failed to scan repository. Is the backend running?");
        setIsScanning(false);
      });

      return () => clearInterval(interval);
    }
  }, [isScanning, navigate, repoUrl]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen translate-x-1/2 translate-y-1/4" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Initialize Privacy Guardian</h1>
          <p className="text-muted-foreground text-lg">Connect your repository to deploy autonomous privacy agents.</p>
        </div>

        <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {!isScanning ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Repository URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <button
                onClick={() => setIsScanning(true)}
                className="w-full relative group overflow-hidden rounded-xl p-[1px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-black/50 backdrop-blur-xl px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-transparent">
                  <span className="font-semibold text-white tracking-wide">Deploy Agents & Scan</span>
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </button>
              {apiError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                  {apiError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Analyzing Repository</h3>
                  <p className="text-sm text-indigo-300/80">Consent Guardian AI is processing the codebase...</p>
                </div>
              </div>

              <div className="space-y-4">
                {STEPS.map((step, idx) => {
                  const isCompleted = currentStepIndex > idx;
                  const isActive = currentStepIndex === idx;
                  const isPending = currentStepIndex < idx;

                  return (
                    <div 
                      key={step.id} 
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all duration-500",
                        isActive ? "bg-indigo-500/10 border border-indigo-500/20 translate-x-2" : "border border-transparent",
                        isPending ? "opacity-40" : "opacity-100"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                        isCompleted ? "bg-emerald-500/20 text-emerald-400" : isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-gray-500"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <step.icon className="w-4 h-4 animate-pulse" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <span className={cn(
                        "font-medium transition-colors duration-300",
                        isCompleted ? "text-gray-300" : isActive ? "text-white" : "text-gray-500"
                      )}>
                        {step.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

