//server/store/analysisStore.js
const analysisByScanId = new Map();

export function saveAnalysis(scanId, analysis) {
  analysisByScanId.set(scanId, {
    ...analysis,
    createdAt: Date.now(),
  });
}

export function getAnalysis(scanId) {
  return analysisByScanId.get(scanId);
}
