// src/app/pages/HomePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Shield, GitBranch, AlertTriangle, CheckCircle, Sparkles, Code2, Lock, FileSearch } from 'lucide-react';
import { scanRepository } from '../services/scanService';
import type { ScanProgress } from '../services/scanService';
import { setScanResult } from '../services/scanSession';

export function HomePage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);

  const handleScan = async () => {
    if (!repoUrl.trim()) return;

    setIsScanning(true);
    setScanProgress({ stage: 'starting', progress: 0, message: 'Initializing scan...' });
    
    try {
      const result = await scanRepository(repoUrl, (progress) => {
        setScanProgress(progress);
      });
      setScanResult(result);
      
      // Navigate to dashboard after scan completes
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Scan failed:', error);
      setIsScanning(false);
      alert("Scan failed: Could not connect to the backend server. Make sure 'npm run dev:api' is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Consent Guardian AI</h1>
              <p className="text-xs text-slate-400">Powered by Guardian AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">AI-Powered Privacy Compliance</span>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-6">
            Trust Layer for Your Codebase
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Automatically detect privacy violations, missing consent mechanisms, 
            and compliance risks across your entire repository.
          </p>

          {/* Scan Input */}
          <Card className="bg-slate-900/50 border-slate-800 p-8 mb-12">
            {!isScanning ? (
              <div className="flex gap-3">
                <Input
                  placeholder="Enter GitHub repository URL..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white text-lg h-14"
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding', { state: { repoUrl } })}
                />
                <Button 
                  onClick={() => navigate('/onboarding', { state: { repoUrl } })}
                  className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={!repoUrl.trim()}
                >
                  <FileSearch className="h-5 w-5 mr-2" />
                  Connect & Scan
                </Button>
              </div>
            ) : null}
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Context Engine</h3>
            <p className="text-sm text-slate-400">
              Parse entire repos to identify API calls, user inputs, and data collection points
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Risk Engine</h3>
            <p className="text-sm text-slate-400">
              Analyze flows for missing consent, unsafe usage, and hidden data collection
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Consent Engine</h3>
            <p className="text-sm text-slate-400">
              Decide where consent is required and detect when it must be revisited
            </p>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Execution Engine</h3>
            <p className="text-sm text-slate-400">
              Use Guardian AI to explain issues, generate fixes, and refactor unsafe code
            </p>
          </Card>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">12+</div>
            <div className="text-sm text-slate-400">Issue Types Detected</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">4</div>
            <div className="text-sm text-slate-400">Compliance Frameworks</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-slate-400">AI-Powered Fixes</div>
          </div>
        </div>
      </div>
    </div>
  );
}