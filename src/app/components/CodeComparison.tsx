//src/app/components/CodeComparison.tsx
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { XCircle, CheckCircle } from 'lucide-react';

interface CodeComparisonProps {
  originalCode: string;
  fixedCode: string;
}

export function CodeComparison({ originalCode, fixedCode }: CodeComparisonProps) {
  // Helper to fake GitHub-style diff highlighting with line numbers
  const renderCodeWithHighlight = (code: string, type: 'removed' | 'added') => {
    return code.split('\n').map((line, i) => {
      let rowClass = "text-slate-300 hover:bg-slate-800/50"; // Base style
      
      // Basic logic to highlight the "bad" lines in red
      if (type === 'removed' && (line.includes('// ISSUE') || line.includes('❌') || line.includes('navigator.geolocation') || line.includes('console.log') || line.includes('defaultChecked'))) {
        rowClass = "text-red-400 bg-red-950/40 border-l-2 border-red-500";
      } 
      // Basic logic to highlight the "good" lines in green
      else if (type === 'added' && (line.includes('// AI-FIXED') || line.includes('consent') || line.includes('logger.info') || line.includes('onChange'))) {
        rowClass = "text-green-400 bg-green-950/40 border-l-2 border-green-500";
      } else {
        rowClass += " border-l-2 border-transparent"; // Keep alignment
      }

      return (
        <div key={i} className={`flex px-2 py-0.5 ${rowClass}`}>
          {/* Line Numbers */}
          <span className="text-slate-600 select-none w-8 text-right pr-3 border-r border-slate-700/50 mr-3 flex-shrink-0">
            {i + 1}
          </span>
          {/* Code Content */}
          <span className="whitespace-pre font-mono">{line || ' '}</span>
        </div>
      );
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Original Code Card */}
      <Card className="bg-slate-950 border-red-500/20 p-0 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-red-500/20 bg-slate-900/80">
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Original (Vulnerable)
          </Badge>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto bg-[#0d1117] py-2 text-xs md:text-sm">
          {renderCodeWithHighlight(originalCode, 'removed')}
        </div>
      </Card>

      {/* Fixed Code Card */}
      <Card className="bg-slate-950 border-green-500/20 p-0 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-green-500/20 bg-slate-900/80">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Fixed (Compliant)
          </Badge>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto bg-[#0d1117] py-2 text-xs md:text-sm">
          {renderCodeWithHighlight(fixedCode, 'added')}
        </div>
      </Card>
    </div>
  );
}