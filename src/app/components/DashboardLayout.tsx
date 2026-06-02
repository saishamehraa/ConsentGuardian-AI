import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  ShieldCheck, 
  Bot, 
  GitPullRequest, 
  TrendingUp, 
  FileText,
  Settings,
  LogOut,
  Github
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
  { path: '/dashboard/data-flow', icon: Network, label: 'Data Flow' },
  { path: '/dashboard/compliance', icon: ShieldCheck, label: 'Compliance' },
  { path: '/dashboard/copilot', icon: Bot, label: 'AI Copilot' },
  { path: '/dashboard/pull-requests', icon: GitPullRequest, label: 'Pull Requests' },
  { path: '/dashboard/predictive', icon: TrendingUp, label: 'Predictive Engine' },
  { path: '/dashboard/reports', icon: FileText, label: 'Audit Reports' },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const projectName = session?.scanResult?.projectName || 'custom-scan';

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
              ConsentGuardian
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <div className="mb-4 px-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Intelligence
            </p>
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}
                <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20 border border-white/5 mb-2 cursor-pointer hover:bg-black/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
              <Github className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-medium truncate" title={projectName}>{projectName}</span>
              <span className="text-xs text-emerald-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Scan
              </span>
            </div>
          </div>
          
          <button onClick={() => window.alert('Settings panel coming soon')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors mt-1">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors mt-1">
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-background to-indigo-950/10">
        {/* Top decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 relative z-10 scroll-smooth">
          <div className="max-w-6xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
