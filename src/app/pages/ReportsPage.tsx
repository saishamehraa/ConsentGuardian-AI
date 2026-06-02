import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, Activity, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ReportsPage() {
  const [session, setSession] = useState(getScanSession());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getScanSession());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const projectName = session?.scanResult?.projectName || 'Project';
  const scanDate = session?.scanResult?.scannedAt ? new Date(session.scanResult.scannedAt).toLocaleDateString() : 'Today';
  const issues = session?.scanResult?.issues || [];

  const dynamicReports = [
    {
      id: 'COMP-1',
      title: `${projectName} Comprehensive Privacy Audit`,
      date: scanDate,
      type: 'Executive',
      status: 'Ready',
      size: '2.4 MB',
      content: `Executive Privacy Audit for ${projectName}\n\nTotal Issues: ${issues.length}\nRisk Score: ${session?.scanResult?.riskScore}\n\nIssues Found:\n${issues.map(i => `- ${i.title} (${i.severity})`).join('\n')}`
    },
    {
      id: 'GDPR-1',
      title: 'GDPR Compliance Assessment',
      date: scanDate,
      type: 'Regulatory',
      status: 'Ready',
      size: '1.8 MB',
      content: `GDPR Compliance Assessment for ${projectName}\n\nFocusing on missing consent and tracking violations.\n\nRelevant Issues:\n${issues.filter(i => i.category === 'missing_consent' || i.category === 'hidden_collection').map(i => `- ${i.title}`).join('\n')}`
    }
  ];

  if (issues.some(i => i.severity === 'critical')) {
    dynamicReports.push({
      id: 'INC-1',
      title: 'Incident Report: Critical Vulnerability',
      date: scanDate,
      type: 'Incident',
      status: 'Ready',
      size: '850 KB',
      content: `Incident Report for ${projectName}\n\nCritical vulnerabilities detected requiring immediate remediation:\n\n${issues.filter(i => i.severity === 'critical').map(i => `- ${i.title} in ${i.file}`).join('\n')}`
    });
  }

  const handleDownload = (report: any) => {
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`; // Downloading as text to make it easy for prototype
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    window.alert("Generating new report... Please wait for AI to finish analysis.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Executive Audit Reports</h1>
        <p className="text-muted-foreground">Downloadable summaries for CISOs, Compliance Teams, and Legal.</p>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white">Generated Reports</h2>
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-colors shadow-lg"
          >
            <Activity className="w-4 h-4" />
            Generate New Report
          </button>
        </div>

        <div className="space-y-4">
          {dynamicReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">{report.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {report.date}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {report.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-mono">{report.size}</span>
                <button 
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
