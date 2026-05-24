// src/app/pages/DashboardPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  FileCode,
  Clock,
  ArrowLeft,
  Sparkles,
  GitBranch,
  Eye,
  Zap,
  Code2,
  FileSearch
} from 'lucide-react';
import { DataFlowChart } from '../components/DataFlowChart';
import { IssuesList } from '../components/IssuesList';
import { getScanSession, setScanResult } from '../services/scanSession';

export function DashboardPage() {
  const navigate = useNavigate();
  const session = getScanSession();

  if (!session || !session.scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <Card className="bg-slate-900/80 border-slate-800 p-8 max-w-md w-full text-center">
          <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSearch className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Active Scan</h2>
          <p className="text-slate-400 mb-8">
            You haven't scanned a repository yet. Please return to the home page to initiate a new Guardian AI security scan, or load the demo environment.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Scanner
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                // setScanResult(scanResult); // This was previously causing an error as scanResult wasn't defined here
                window.location.reload();
              }}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Code2 className="h-4 w-4 mr-2" />
              Load Demo Data
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const [fixedIssues] = useState<string[]>(session.fixedIssueIds);
  
  
  const sessionData = getScanSession();
console.log("DEBUG: Dashboard receiving this data:", sessionData);
const scanResult = sessionData?.scanResult;

  if (!scanResult) {
    return <div>No data available. Please return to the scanner.</div>;
  }

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Force the use of session data for everything
  const currentRiskScore = useMemo(() => {
    const deductions = { critical: 15, high: 10, medium: 5, low: 2 } as const;
    let score = 100;
    // STRICTLY use scanResult from the session
    for (const issue of scanResult.issues) {
      if (fixedIssues.includes(issue.id)) continue;
      score -= deductions[issue.severity as keyof typeof deductions] || 0;
    }
    return Math.max(0, Math.min(100, score));
  }, [fixedIssues, scanResult.issues]);

  const filteredIssues = useMemo(() => {
    // STRICTLY use scanResult from the session
    if (selectedSeverity === 'all') return scanResult.issues;
    return scanResult.issues.filter(issue => issue.severity === selectedSeverity);
  }, [scanResult.issues, selectedSeverity]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskScoreLabel = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
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
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hidden md:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Confidence: 94%
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-300">
                <GitBranch className="h-3 w-3 mr-1" />
                {scanResult.projectName}
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-300 hidden md:flex">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(scanResult.scannedAt).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-slate-800 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Consent Risk Score</span>
                </div>
                <div className="flex items-end gap-4 mb-4">
                  <div className={`text-6xl font-bold ${getRiskScoreColor(currentRiskScore)}`}>
                    {currentRiskScore}
                  </div>
                  <div className="mb-2">
                    <div className="text-sm text-slate-400">/ 100</div>
                    <div className={`text-sm font-medium ${getRiskScoreColor(currentRiskScore)}`}>
                      {getRiskScoreLabel(currentRiskScore)}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={currentRiskScore} 
                  className="h-3 bg-slate-800"
                />
                {fixedIssues.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">
                      +{currentRiskScore - scanResult.riskScore} points after fixing {fixedIssues.length} issue(s)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-950/50 border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Total Issues</span>
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {scanResult.totalIssues - fixedIssues.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {fixedIssues.length} fixed
                  </div>
                </Card>

                <Card className="bg-slate-950/50 border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Files Scanned</span>
                    <FileCode className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {scanResult.totalFiles}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {scanResult.totalFiles} files analyzed
                  </div>
                </Card>

                <Card className="bg-slate-950/50 border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Critical</span>
                    <XCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold text-red-400">
                    {scanResult.stats.critical - fixedIssues.filter(id => {
                      const issue = scanResult.issues.find(i => i.id === id);
                      return issue?.severity === 'critical';
                    }).length}
                  </div>
                </Card>

                <Card className="bg-slate-950/50 border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">High Priority</span>
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400">
                    {scanResult.stats.high - fixedIssues.filter(id => {
                      const issue = scanResult.issues.find(i => i.id === id);
                      return issue?.severity === 'high';
                    }).length}
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="issues" className="data-[state=active]:bg-slate-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="data-[state=active]:bg-slate-800">
              <Sparkles className="h-4 w-4 mr-2" />
              Data Flow Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-400">Filter by severity:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSeverity === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('all')}
                  className={selectedSeverity === 'all' ? 'bg-slate-700' : 'border-slate-700 text-slate-300'}
                >
                  All ({scanResult.totalIssues - fixedIssues.length})
                </Button>
                <Button
                  variant={selectedSeverity === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('critical')}
                  className={selectedSeverity === 'critical' ? 'bg-red-600' : 'border-red-500/20 text-red-400'}
                >
                  Critical ({scanResult.stats.critical})
                </Button>
                <Button
                  variant={selectedSeverity === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('high')}
                  className={selectedSeverity === 'high' ? 'bg-orange-600' : 'border-orange-500/20 text-orange-400'}
                >
                  High ({scanResult.stats.high})
                </Button>
                <Button
                  variant={selectedSeverity === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity('medium')}
                  className={selectedSeverity === 'medium' ? 'bg-yellow-600' : 'border-yellow-500/20 text-yellow-400'}
                >
                  Medium ({scanResult.stats.medium})
                </Button>
              </div>
            </div>

            <IssuesList
              issues={filteredIssues}
              fixedIssues={fixedIssues}
              onViewIssue={(id) => navigate(`/issue/${id}`)}
              getSeverityColor={getSeverityColor}
            />
          </TabsContent>

          <TabsContent value="dataflow">
            <DataFlowChart 
              dataPoints={scanResult.dataCollectionPoints}
              issues={scanResult.issues}
            />
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Powered by Guardian AI</h3>
              <p className="text-sm text-slate-300 mb-4">
                All issue detection and code fixes are generated using Guardian AI's advanced AI capabilities. 
                Guardian AI analyzes your codebase against GDPR, CCPA, COPPA, and PCI-DSS compliance requirements.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Learn More About Guardian AI
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">
                  <Eye className="h-4 w-4 mr-2" />
                  View Analysis Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}