import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getScanSession } from '../services/scanSession';

export function PredictiveCompliancePage() {
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const riskScore = session?.scanResult?.riskScore || 0;
  
  // Calculate mock current compliance (inverse of risk)
  const currentCompliance = Math.max(0, 100 - riskScore);
  const currentExposure = riskScore;

  // Generate dynamic forecast based on current risk
  const isDeteriorating = currentCompliance < 80;
  
  const FORECAST_DATA = [
    { release: 'v1.0', compliance: Math.min(100, currentCompliance + 10), exposure: Math.max(0, currentExposure - 10) },
    { release: 'v1.1', compliance: Math.min(100, currentCompliance + 5), exposure: Math.max(0, currentExposure - 5) },
    { release: 'v1.2', compliance: Math.min(100, currentCompliance + 2), exposure: Math.max(0, currentExposure - 2) },
    { release: 'v2.0 (Current)', compliance: currentCompliance, exposure: currentExposure },
    { release: 'v2.1 (Proj)', compliance: isDeteriorating ? currentCompliance - 15 : currentCompliance, exposure: isDeteriorating ? currentExposure + 15 : currentExposure },
    { release: 'v2.2 (Proj)', compliance: isDeteriorating ? currentCompliance - 25 : currentCompliance + 5, exposure: isDeteriorating ? currentExposure + 25 : Math.max(0, currentExposure - 5) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Predictive Compliance Engine</h1>
        <p className="text-muted-foreground">Forecast compliance degradation and data exposure risks based on current velocity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {isDeteriorating ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-400">Critical Degradation Warning</h3>
              <p className="text-sm text-red-200/80 mt-1">{session?.scanResult?.predictiveForecast?.forecast || "If current development patterns continue, compliance is projected to drop significantly within the next two releases."}</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-emerald-400">Optimal Compliance Trajectory</h3>
              <p className="text-sm text-emerald-200/80 mt-1">{session?.scanResult?.predictiveForecast?.forecast || "Current development velocity maintains high privacy standards. No major degradation forecasted."}</p>
            </div>
          </div>
        )}
        
        <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Risk Growth Trajectory</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-white">{isDeteriorating ? '+215%' : '-15%'}</span>
              <span className={isDeteriorating ? "text-sm text-red-400 flex items-center gap-1" : "text-sm text-emerald-400 flex items-center gap-1"}>
                {isDeteriorating ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />} Expected
              </span>
            </div>
          </div>
          <div className={isDeteriorating ? "w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30" : "w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"}>
            {isDeteriorating ? <TrendingDown className="w-8 h-8 text-red-400" /> : <TrendingUp className="w-8 h-8 text-emerald-400" />}
          </div>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Compliance vs Exposure Forecast</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="release" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" name="Compliance Score" />
              <Area type="monotone" dataKey="exposure" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExposure)" name="Data Exposure Risk" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
