//src/app/services/scanService.ts
// Mock scan service - simulates repository scanning and analysis

import { mockScanResult, type ScanResult } from './mockData';

export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

async function tryApiFetch<T>(path: string, init: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    if (!response.ok) return null;
    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

// Simulate repository scanning with progress updates
export async function scanRepository(
  repoUrl: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const stages = [
    { stage: 'cloning', message: 'Cloning repository...', duration: 800 },
    { stage: 'parsing', message: 'Parsing code structure...', duration: 1200 },
    { stage: 'analyzing', message: 'Analyzing data flows...', duration: 1500 },
    { stage: 'scanning', message: 'Scanning for consent issues...', duration: 1800 },
    { stage: 'scoring', message: 'Calculating risk score...', duration: 600 },
  ];

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const progress = ((i + 1) / stages.length) * 100;
    
    onProgress?.({
      stage: stage.stage,
      progress,
      message: stage.message,
    });

    await new Promise(resolve => setTimeout(resolve, stage.duration));
  }

  type ScanResponse = {
    result: ScanResult;
  };

  const apiResult = await tryApiFetch<ScanResponse>('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl }),
  });

  return apiResult?.result ?? mockScanResult;
}

// Guardian AI integration - analyze specific issue
export async function analyzeIssueWithBob(issueId: string): Promise<string> {
  const fallback = `Guardian AI has analyzed this issue and identified it as a ${
    ['GDPR', 'CCPA', 'COPPA', 'PCI-DSS'][Math.floor(Math.random() * 4)]
  } compliance risk.`;

  const issue = mockScanResult.issues.find(i => i.id === issueId);
  return issue?.explanation ?? fallback;
}

// Guardian AI integration - generate fix
export async function generateFixWithBob(issueId: string): Promise<{
  fixedCode: string;
  explanation: string;
}> {
  const apiFix = await tryApiFetch<{ fixedCode: string; explanation: string }>('/api/fix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId }),
  });

  if (apiFix) {
    return apiFix;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
  const issue = mockScanResult.issues.find(i => i.id === issueId);
  return { fixedCode: issue?.fixedCode || '', explanation: issue?.explanation || '' };
}

// Calculate new risk score after fixing issues
export function calculateRiskScore(fixedIssueIds: string[]): number {
  let score = 100;
  
  mockScanResult.issues.forEach(issue => {
    if (fixedIssueIds.includes(issue.id)) return;
    
    // Deduct points based on severity
    const deductions = {
      critical: 15,
      high: 10,
      medium: 5,
      low: 2,
    };
    
    score -= deductions[issue.severity];
  });
  
  return Math.max(0, Math.min(100, score));
}
