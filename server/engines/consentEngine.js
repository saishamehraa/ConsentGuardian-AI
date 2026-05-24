//server/engines/consentEngine.js
export function detectConsentGaps(issues) {
  return issues.map((issue) => ({
    issueId: issue.id,
    required: issue.severity === "critical" || issue.severity === "high",
    revisitRequired: issue.id === "13",
  }));
}
