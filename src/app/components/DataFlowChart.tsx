//src/app/components/DataFlowChart.tsx
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, Database, MapPin, CreditCard, User } from 'lucide-react';
import type { DataCollectionPoint, ConsentIssue } from '../services/mockData';

interface DataFlowChartProps {
  dataPoints: DataCollectionPoint[];
  issues: ConsentIssue[];
}

export function DataFlowChart({ dataPoints, issues }: DataFlowChartProps) {
  // Prepare data for charts
  const severityData = [
    { name: 'Critical', value: issues.filter(i => i.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: issues.filter(i => i.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: issues.filter(i => i.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: issues.filter(i => i.severity === 'low').length, color: '#3b82f6' },
  ];

  const categoryData = issues.reduce((acc, issue) => {
    const existing = acc.find(item => item.name === issue.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: issue.category, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const dataTypeData = dataPoints.reduce((acc, point) => {
    const existing = acc.find(item => item.name === point.type);
    if (existing) {
      existing.withConsent += point.hasConsent ? 1 : 0;
      existing.withoutConsent += point.hasConsent ? 0 : 1;
    } else {
      acc.push({
        name: point.type,
        withConsent: point.hasConsent ? 1 : 0,
        withoutConsent: point.hasConsent ? 0 : 1,
      });
    }
    return acc;
  }, [] as { name: string; withConsent: number; withoutConsent: number }[]);

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'location': return MapPin;
      case 'payment': return CreditCard;
      case 'email': return User;
      default: return Database;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Collection Points */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          Data Collection Points
        </h3>
        
        <div className="grid gap-4 mb-8">
          {dataPoints.map(point => {
            const Icon = getDataTypeIcon(point.type);
            return (
              <div key={point.id} className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{point.dataType}</span>
                        <Badge className={getRiskColor(point.riskLevel)}>
                          {point.riskLevel}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400 mb-2">
                        {point.file}:{point.line}
                      </div>
                      <div className="flex items-center gap-2">
                        {point.hasConsent ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            <Shield className="h-3 w-3 mr-1" />
                            Consent Present
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Missing Consent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Type Chart */}
        <div className="bg-slate-950/50 rounded-lg p-6">
          <h4 className="text-sm font-medium text-white mb-4">Consent Coverage by Data Type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="withConsent" fill="#22c55e" name="With Consent" />
              <Bar dataKey="withoutConsent" fill="#ef4444" name="Without Consent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Issue Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="font-semibold text-white mb-4">Issues by Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h3 className="font-semibold text-white mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={150} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
