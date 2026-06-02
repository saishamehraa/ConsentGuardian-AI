import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, Database } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DashboardOverview() {
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    // Simple poll in case data arrives late, or just rely on initial mount
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const issues = session?.scanResult?.issues || [];
  const riskScore = session?.scanResult?.riskScore || 0;
  
  // Calculate mock health score based on issues
  const healthScore = Math.max(0, 100 - issues.length * 5);
  // Calculate mock consent maturity
  const consentIssues = issues.filter(i => i.category === 'missing_consent').length;
  const consentMaturity = Math.max(0, 100 - consentIssues * 15);

  const METRICS = [
    {
      title: 'Privacy Health Score',
      value: healthScore.toString(),
      max: 100,
      trend: healthScore > 80 ? '+5%' : '-12%',
      trendUp: healthScore > 80,
      icon: ShieldCheck,
      color: 'emerald',
      description: 'Overall repository privacy posture'
    },
    {
      title: 'Consent Maturity',
      value: consentMaturity.toString(),
      max: 100,
      trend: consentMaturity > 70 ? '+2%' : '-8%',
      trendUp: consentMaturity > 70,
      icon: Activity,
      color: 'indigo',
      description: 'Coverage of required consent flows'
    },
    {
      title: 'Compliance Readiness',
      value: riskScore.toString(),
      max: 100,
      trend: riskScore > 60 ? '+12%' : '-15%',
      trendUp: riskScore > 60,
      icon: ShieldAlert,
      color: 'purple',
      description: 'GDPR & CCPA alignment'
    },
    {
      title: 'Total Issues Found',
      value: issues.length.toString(),
      max: null,
      trend: issues.length > 5 ? 'High Risk' : 'Stable',
      trendUp: issues.length <= 5,
      icon: Database,
      color: 'blue',
      description: 'AI Detected Violations'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Intelligence Overview</h1>
        <p className="text-muted-foreground">Executive summary of your repository's privacy and consent posture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((metric) => (
          <div key={metric.title} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -mr-10 -mt-10 opacity-20 group-hover:opacity-40 transition-opacity",
              metric.color === 'emerald' && "bg-emerald-500",
              metric.color === 'indigo' && "bg-indigo-500",
              metric.color === 'purple' && "bg-purple-500",
              metric.color === 'blue' && "bg-blue-500",
            )} />
            
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                metric.color === 'emerald' && "bg-emerald-500/20 text-emerald-400",
                metric.color === 'indigo' && "bg-indigo-500/20 text-indigo-400",
                metric.color === 'purple' && "bg-purple-500/20 text-purple-400",
                metric.color === 'blue' && "bg-blue-500/20 text-blue-400",
              )}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md",
                metric.trendUp ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
              )}>
                {metric.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {metric.trend}
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 font-medium text-sm mb-1">{metric.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{metric.value}</span>
                {metric.max && <span className="text-gray-500 font-medium">/ {metric.max}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-black/40 backdrop-blur py-2 z-10">Recent Agent Findings</h3>
          <div className="space-y-4">
            {issues.length === 0 ? (
              <p className="text-gray-500 text-sm">No issues found or scan not complete.</p>
            ) : (
              issues.slice(0, 10).map((finding, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    finding.severity === 'critical' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" :
                    finding.severity === 'high' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" :
                    finding.severity === 'medium' ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" :
                    "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  )} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-200 truncate">{finding.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{finding.file}:{finding.line}</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded-md text-gray-400 capitalize shrink-0">{finding.severity}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
          <div className="space-y-4">
            {[
              { name: 'Privacy Detection Agent', status: issues.length > 0 ? `Identified ${issues.length} Issues` : 'Analysis Complete', progress: 100 },
              { name: 'Data Flow Intelligence', status: session?.scanResult?.dataCollectionPoints?.length ? 'Data Flow Mapped' : 'Analysis Complete', progress: 100 },
              { name: 'Regulatory Mapping', status: 'Compliance Calculated', progress: 100 },
            ].map((agent, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-200">{agent.name}</span>
                  <span className="text-gray-500">{agent.status}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
