import React, { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FRAMEWORKS = ['GDPR', 'CCPA', 'COPPA', 'PCI-DSS'];
const DOMAINS = ['Data Collection', 'Storage Security', 'User Consent', 'Third-party Sharing', 'Data Deletion'];

function getColorForScore(score: number) {
  if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

export function ComplianceHeatmap() {
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const issues = session?.scanResult?.issues || [];

  // Calculate dynamic heatmap scores based on real issues
  const calculateScore = (framework: string, domain: string) => {
    let baseScore = 100;
    
    // Determine penalty based on issue category overlap
    issues.forEach((issue: any) => {
      let penalty = issue.severity === 'critical' ? 25 : issue.severity === 'high' ? 15 : 5;
      
      const cat = (issue.category || '').toLowerCase();
      const title = (issue.title || '').toLowerCase();

      // Match issue category to domains
      if (domain === 'User Consent' && (cat === 'missing_consent' || cat === 'expired_consent' || title.includes('consent'))) {
        baseScore -= penalty;
      }
      if (domain === 'Third-party Sharing' && (cat === 'missing_consent' || cat === 'hidden_collection' || title.includes('third-party') || title.includes('sharing'))) {
        baseScore -= penalty;
      }
      if (domain === 'Storage Security' && (cat === 'unsafe_usage' || cat === 'data_storage_security' || cat === 'plaintext_data_logging' || title.includes('encrypt') || title.includes('storage') || title.includes('key'))) {
        baseScore -= penalty;
      }
      if (domain === 'Data Collection' && (cat === 'tracking' || cat === 'missing_consent' || cat === 'data_logging' || title.includes('tracking') || title.includes('collection'))) {
        baseScore -= penalty;
      }
    });

    // Add some framework-specific jitter to simulate different stringencies
    if (framework === 'GDPR' && domain === 'User Consent') baseScore -= 5;
    if (framework === 'CCPA' && domain === 'Data Deletion') baseScore -= 5;
    if (framework === 'COPPA' && domain === 'Data Collection') baseScore -= 10;
    if (framework === 'PCI-DSS' && domain !== 'Storage Security') baseScore += 10; // PCI cares mostly about storage/payment

    return Math.max(0, Math.min(100, baseScore));
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Compliance Heatmap</h1>
        <p className="text-muted-foreground">Cross-reference your architecture against major regulatory frameworks.</p>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="col-span-1"></div>
            {FRAMEWORKS.map(framework => (
              <div key={framework} className="col-span-1 text-center font-bold text-white tracking-wide">
                {framework}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {DOMAINS.map(domain => (
              <div key={domain} className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-1 text-sm font-medium text-gray-400 text-right pr-4">
                  {domain}
                </div>
                {FRAMEWORKS.map(framework => {
                  const score = calculateScore(framework, domain);
                  return (
                    <div key={`${domain}-${framework}`} className="col-span-1">
                      <div className={cn(
                        "h-16 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg",
                        getColorForScore(score)
                      )}>
                        <span className="font-bold text-lg">{score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500/50" /> Compliant (85-100)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500/50" /> Warning (60-84)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/50" /> Violation (0-59)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
