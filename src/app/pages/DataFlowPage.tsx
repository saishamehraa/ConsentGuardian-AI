import React, { useState, useEffect } from 'react';
import { User, Server, Database, Cloud, AlertTriangle, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DataFlowPage() {
  const [session, setSession] = useState(getScanSession());
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dcp = session?.scanResult?.dataFlow?.dataCollectionPoints || session?.scanResult?.dataCollectionPoints || [];
  
  // Transform data collection points into nodes for the graph
  // We'll generate a source, processing, and storage node for each collection point to make a graph
  const generatedNodes = dcp.length > 0 ? dcp.map((point: any, idx: number) => ({
    id: point.id,
    label: point.dataType,
    type: 'collection',
    status: point.riskLevel === 'critical' ? 'critical' : point.riskLevel === 'high' ? 'warning' : 'secure',
    icon: point.type === 'location' ? Cloud : point.type === 'payment' ? Database : User,
    details: [
      { label: 'File', value: `${point.file}:${point.line}` },
      { label: 'Consent Status', value: point.hasConsent ? 'Granted' : 'Missing/Bypassed' },
      { label: 'Data Type', value: point.dataType },
    ]
  })) : [
    { id: '1', label: 'Client App', type: 'source', status: 'secure', icon: User, details: [] },
    { id: '2', label: 'API Gateway', type: 'processing', status: 'secure', icon: Server, details: [] }
  ];

  const NODES = generatedNodes;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Data-Flow Intelligence</h1>
        <p className="text-muted-foreground">Interactive mapping of PII movement and third-party data sharing.</p>
      </div>

      <div className="flex-1 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center p-8">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5LjUgMGguNXY2MEgwaC0uNXYuNWg2MFYwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative z-10 flex flex-wrap md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-5xl">
          {NODES.map((node: any, index: number) => (
            <React.Fragment key={node.id}>
              <button 
                onClick={() => setActiveNode(node.id)}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 group w-48",
                  activeNode === node.id ? "bg-white/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-105" : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5"
                )}
              >
                {node.status !== 'secure' && (
                  <div className={cn(
                    "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center animate-bounce",
                    node.status === 'critical' ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  )}>
                    {node.status === 'critical' ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                )}
                
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
                  node.type === 'source' ? "bg-emerald-500/20 text-emerald-400" :
                  node.type === 'processing' ? "bg-blue-500/20 text-blue-400" :
                  node.type === 'storage' ? "bg-purple-500/20 text-purple-400" :
                  "bg-orange-500/20 text-orange-400"
                )}>
                  <node.icon className="w-8 h-8" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-white">{node.label}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{node.type}</p>
                </div>
              </button>

              {index < NODES.length - 1 && (
                <div className="hidden md:flex flex-col items-center justify-center relative w-16">
                  <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/50 to-indigo-500/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-indigo-400 blur-[2px] animate-[slide_2s_linear_infinite]" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400 absolute bg-background rounded-full" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Node Detail Panel */}
        {activeNode && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black/90 backdrop-blur-2xl border border-indigo-500/50 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 z-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">
                {NODES.find((n: any) => n.id === activeNode)?.label} Details
              </h3>
              <button onClick={() => setActiveNode(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {NODES.find((n: any) => n.id === activeNode)?.details?.map((detail: any, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{detail.label}</div>
                    <div className="text-sm text-gray-200 mt-1">{detail.value}</div>
                  </div>
                ))}
              </div>

              {['critical', 'warning'].includes(NODES.find((n: any) => n.id === activeNode)?.status || '') ? (
                <div className={cn(
                  "border rounded-xl p-4 flex gap-4",
                  NODES.find((n: any) => n.id === activeNode)?.status === 'critical' ? "bg-red-500/10 border-red-500/20" : "bg-yellow-500/10 border-yellow-500/20"
                )}>
                  {NODES.find((n: any) => n.id === activeNode)?.status === 'critical' ? (
                    <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0" />
                  )}
                  <div>
                    <h4 className={cn("font-medium mb-1", NODES.find((n: any) => n.id === activeNode)?.status === 'critical' ? "text-red-400" : "text-yellow-400")}>Privacy Risk Detected</h4>
                    <p className="text-sm text-gray-300">Data collection point lacks valid consent or is exposed.</p>
                    <button 
                      onClick={() => window.alert('Navigating to AI Copilot to generate remediation...')}
                      className={cn(
                        "mt-3 text-xs text-white px-3 py-1.5 rounded-lg transition-colors",
                        NODES.find((n: any) => n.id === activeNode)?.status === 'critical' ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
                      )}
                    >
                      View Remediation Steps
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-emerald-400 font-medium mb-1">Secure Node</h4>
                    <p className="text-sm text-gray-300">No privacy violations detected in this component's data handling.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
