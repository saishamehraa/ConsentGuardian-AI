import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitPullRequest, GitMerge, AlertCircle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function PullRequestsPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const issues = session?.scanResult?.issues || [];
  
  const generatedPRs = issues.slice(0, 3).map((issue, index) => {
    const isFix = index % 2 === 0; // Alternate between fixes and regressions
    return {
      id: 140 + index,
      issueId: issue.id,
      title: isFix ? `fix: resolve privacy issue in ${issue.file}` : `feat: update tracking in ${issue.file}`,
      author: isFix ? 'security-bot' : 'dev-team',
      status: isFix ? 'approved' : (issue.severity === 'critical' ? 'blocked' : 'warning'),
      time: `${index + 1} hours ago`,
      riskIncrease: !isFix,
      impact: isFix ? 'Security posture improved' : `Privacy risk increased (${issue.category})`,
      description: isFix ? 'Applies recommended fixes for consent handling.' : issue.description
    };
  });

  if (generatedPRs.length === 0) {
    generatedPRs.push({
      id: 100,
      issueId: '',
      title: 'chore: initial repository setup',
      author: 'admin',
      status: 'approved',
      time: '1 day ago',
      riskIncrease: false,
      impact: 'Baseline secure',
      description: 'Repository initialized without major privacy violations.'
    });
  }

  const PR_DATA = generatedPRs;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Pull Request Guardian</h1>
        <p className="text-muted-foreground">Autonomous privacy review of incoming code changes.</p>
      </div>

      <div className="space-y-4">
        {PR_DATA.map(pr => (
          <div key={pr.id} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10 group">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 p-2 rounded-lg shrink-0",
                    pr.status === 'blocked' ? "bg-red-500/20 text-red-400" :
                    pr.status === 'warning' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {pr.status === 'blocked' ? <ShieldAlert className="w-6 h-6" /> :
                     pr.status === 'warning' ? <AlertCircle className="w-6 h-6" /> :
                     <CheckCircle className="w-6 h-6" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">#{pr.id} {pr.title}</h3>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <GitPullRequest className="w-3.5 h-3.5" /> opened by {pr.author}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{pr.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-500">{pr.time}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  pr.riskIncrease ? "text-red-400" : "text-emerald-400"
                )}>
                  {pr.riskIncrease ? <ArrowRight className="w-4 h-4 rotate-45" /> : <ArrowRight className="w-4 h-4 -rotate-45" />}
                  {pr.impact}
                </div>
                
                <button 
                  onClick={() => pr.issueId ? navigate(`/dashboard/issue/${pr.issueId}`) : window.alert('Detailed report available only for recent issues.')}
                  className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pr.status === 'blocked' ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
                  pr.status === 'warning' ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" :
                  "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                )}>
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
