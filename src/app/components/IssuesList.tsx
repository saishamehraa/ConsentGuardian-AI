//src/app/components/IssuesList.tsx
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, FileCode, CheckCircle } from 'lucide-react';
import type { ConsentIssue } from '../services/mockData';

interface IssuesListProps {
  issues: ConsentIssue[];
  fixedIssues: string[];
  onViewIssue: (id: string) => void;
  getSeverityColor: (severity: string) => string;
}

export function IssuesList({ issues, fixedIssues, onViewIssue, getSeverityColor }: IssuesListProps) {
  const getCategoryIcon = (category: string) => {
    // Could expand with specific icons per category
    return FileCode;
  };

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-3">
      {issues.map(issue => {
        const isFixed = fixedIssues.includes(issue.id);
        const CategoryIcon = getCategoryIcon(issue.category);

        return (
          <Card 
            key={issue.id} 
            className={`bg-slate-900/50 border-slate-800 p-6 transition-all hover:border-slate-700 ${
              isFixed ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700 text-slate-300">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {getCategoryLabel(issue.category)}
                  </Badge>
                  {isFixed && (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fixed
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {issue.title}
                </h3>
                
                <p className="text-sm text-slate-400 mb-3">
                  {issue.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileCode className="h-3 w-3" />
                    {issue.file}:{issue.line}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => onViewIssue(issue.id)}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        );
      })}

      {issues.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No issues found in this category
          </h3>
          <p className="text-sm text-slate-400">
            Great job! Your codebase is looking secure.
          </p>
        </Card>
      )}
    </div>
  );
}
