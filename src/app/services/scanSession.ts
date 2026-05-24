//src/app/services/scanSession.ts
import { mockScanResult, type ScanResult } from './mockData';

const STORAGE_KEY = 'consent-guardian-session-v1';

export interface ScanSessionState {
  scanResult: ScanResult;
  fixedIssueIds: string[];
}

function getFallbackState(): ScanSessionState | null {
  return null;
}

export function getScanSession(): ScanSessionState | null {
  if (typeof window === 'undefined') return getFallbackState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getFallbackState();
    const parsed = JSON.parse(raw) as ScanSessionState;
    if (!parsed?.scanResult || !Array.isArray(parsed.fixedIssueIds)) {
      return getFallbackState();
    }
    return parsed;
  } catch {
    return getFallbackState();
  }
}

export function setScanSession(state: ScanSessionState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setScanResult(scanResult: ScanResult): void {
  setScanSession({
    scanResult,
    fixedIssueIds: [],
  });
}

export function markIssueFixed(issueId: string): void {
  const current = getScanSession();
  if (!current) return;
  if (current.fixedIssueIds.includes(issueId)) return;

  setScanSession({
    ...current,
    fixedIssueIds: [...current.fixedIssueIds, issueId],
  });
}
