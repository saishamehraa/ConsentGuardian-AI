//server/engines/riskEngine.js
const severityWeights = {
  critical: 15,
  high: 10,
  medium: 5,
  low: 2,
};

export function calculateRiskScore(issues, fixedIssueIds = []) {
  const fixedSet = new Set(fixedIssueIds);
  let score = 100;

  for (const issue of issues) {
    if (fixedSet.has(issue.id)) continue;
    score -= severityWeights[issue.severity] ?? 0;
  }

  return Math.max(0, Math.min(100, score));
}
