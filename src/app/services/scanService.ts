// src/app/services/scanService.ts
import { mockScanResult, type ScanResult, type ConsentIssue } from './mockData';

export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}

const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787');

async function tryApiFetch<T>(path: string, init: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    if (!response.ok) {
      console.error(`API Error: ${response.status} at ${path}`);
      return null;
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API Connection Failed:`, error);
    return null;
  }
}

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
    onProgress?.({ stage: stage.stage, progress, message: stage.message });
    await new Promise(resolve => setTimeout(resolve, stage.duration));
  }

  type ScanResponse = { result: ScanResult };
  const apiResult = await tryApiFetch<ScanResponse>('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl }),
  });

  if (!apiResult) {
    throw new Error("Backend API is unreachable. Check your server terminal.");
  }

  return apiResult.result;
}

export async function analyzeIssueWithGuardian(issueId: string): Promise<string> {
  const issue = mockScanResult.issues.find(i => i.id === issueId);
  return issue?.explanation || "Analysis unavailable.";
}

export async function generateFixWithGuardian(issueId: string): Promise<{
  fixedCode: string;
  explanation: string;
}> {
  const apiFix = await tryApiFetch<{ fixedCode: string; explanation: string }>('/api/fix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId }),
  });

  if (!apiFix) {
    throw new Error("Failed to reach Execution Engine API for fix generation.");
  }

  return apiFix;
}

export async function chatWithGuardian(message: string, history: any[], contextIssues: any[]): Promise<string> {
  const response = await tryApiFetch<{ reply: string }>('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, contextIssues }),
  });

  if (!response) {
    throw new Error("Failed to reach Copilot AI backend.");
  }

  return response.reply;
}

export function calculateRiskScore(fixedIssueIds: string[], currentIssues: ConsentIssue[] = mockScanResult.issues): number {
  let score = 100;
  
  const deductions: Record<string, number> = { 
    critical: 15, 
    high: 10, 
    medium: 5, 
    low: 2 
  };
  
  currentIssues.forEach(issue => {
    if (fixedIssueIds.includes(issue.id)) return;
    
    const weight = deductions[issue.severity as keyof typeof deductions] || 0;
    score -= weight;
  });
  
  return Math.max(0, Math.min(100, score));
}