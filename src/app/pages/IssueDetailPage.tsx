//src/app/pages/IssueDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Code2, 
  Sparkles,
  FileCode,
  Activity,
  Shield,
  Loader2,
  GitBranch, // <-- ADDED: Needed for the new CI/CD UI
  FileSearch
} from 'lucide-react';
import { generateFixWithBob } from '../services/scanService';
import { CodeComparison } from '../components/CodeComparison';
import { getScanSession, markIssueFixed, setScanResult } from '../services/scanSession';
import { mockScanResult } from '../services/mockData';

export function IssueDetailPage() {
  const { id } = useParams();
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
                setScanResult(mockScanResult);
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

  const [isFixing, setIsFixing] = useState(false);
  const [isFixed, setIsFixed] = useState(() => session.fixedIssueIds.includes(id ?? ''));
  const [showFix, setShowFix] = useState(false);
  const [generatedFix, setGeneratedFix] = useState<{ fixedCode: string; explanation: string } | null>(null);

  const issue = session.scanResult.issues.find(i => i.id === id);

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Issue not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleGenerateFix = async () => {
    setIsFixing(true);
    
    try {
      const fix = await generateFixWithBob(issue.id);
      setGeneratedFix(fix);
      setShowFix(true);
    } catch (error) {
      console.error('Fix generation failed:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const handleApplyFix = () => {
    setIsFixed(true);
    markIssueFixed(issue.id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">Issue Details</h1>
                  <p className="text-xs text-slate-400">Powered by Guardian AI</p>
                </div>
              </div>
            </div>
            {isFixed && (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Fixed
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Issue Header */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getSeverityColor(issue.severity)}>
                  {issue.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-300">
                  {getCategoryLabel(issue.category)}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{issue.title}</h2>
              <p className="text-slate-300 mb-4">{issue.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  {issue.file}:{issue.line}
                </span>
              </div>
            </div>
          </div>

          {/* ---> ADDED: Pre-PR CI/CD Gate Warning <--- */}
          {!isFixed && (
            <div className="mb-6 bg-slate-950 rounded-lg p-4 border border-slate-800">
              <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-slate-400" />
                Pre-PR CI/CD Gate
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-slate-400">If merged, this introduces: </span>
                  <span className="text-red-400 font-medium ml-1">HIGH Compliance Risk</span>
                </div>
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                  Deployment Blocked
                </Badge>
              </div>
            </div>
          )}

          {!isFixed && !showFix && (
            <Button 
              onClick={handleGenerateFix}
              disabled={isFixing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isFixing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardian AI is generating fix...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Fix with Guardian AI
                </>
              )}
            </Button>
          )}

          {/* ---> ADDED: PR Integration Text <--- */}
          {showFix && !isFixed && (
            <div>
              <Button 
                onClick={handleApplyFix}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Fix
              </Button>
              <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                Applying this fix will automatically generate a new commit and Pull Request.
              </p>
            </div>
          )}
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="explanation" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="explanation" className="data-[state=active]:bg-slate-800">
              <Sparkles className="h-4 w-4 mr-2" />
              Guardian AI Analysis
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-slate-800">
              <Code2 className="h-4 w-4 mr-2" />
              Code {showFix ? 'Comparison' : 'Snippet'}
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="data-[state=active]:bg-slate-800">
              <Activity className="h-4 w-4 mr-2" />
              Data Flow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Guardian AI's Analysis
              </h3>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-slate-300 font-sans">
                  {issue.explanation}
                </pre>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-red-900/10 border-red-500/20 p-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Impact
                </h3>
                <p className="text-sm text-slate-300">{issue.impact}</p>
              </Card>

              <Card className="bg-blue-900/10 border-blue-500/20 p-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  Recommendation
                </h3>
                <p className="text-sm text-slate-300">{issue.recommendation}</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="code">
            {showFix && (generatedFix?.fixedCode || issue.fixedCode) ? (
              <CodeComparison
                originalCode={issue.affectedCode}
                fixedCode={generatedFix?.fixedCode || issue.fixedCode || ''}
              />
            ) : (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-400" />
                  Affected Code
                </h3>
                <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{issue.affectedCode}</code>
                  </pre>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dataflow">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Data Flow Path
              </h3>
              <div className="space-y-3">
                {issue.dataFlow.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-purple-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-950 rounded-lg px-4 py-3">
                        <code className="text-sm text-slate-300">{step}</code>
                      </div>
                    </div>
                    {index < issue.dataFlow.length - 1 && (
                      <div className="text-slate-600">→</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Guardian AI Explanation */}
        {showFix && (
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20 p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Fix Generated Successfully</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Guardian AI has analyzed the issue and generated a compliant fix that addresses the privacy 
                  concern while maintaining functionality. The fix includes proper consent management, 
                  audit logging, and follows industry best practices.
                </p>
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    onClick={handleApplyFix}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply This Fix
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-slate-700 text-slate-300"
                    onClick={handleGenerateFix}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}