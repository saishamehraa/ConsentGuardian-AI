//server/engines/contextEngine.js
import { mockScanResult } from "../data/mockScanResult.js";

export async function buildContext(repoUrl) {
  const inferredSources = [
    "api calls",
    "user input forms",
    "tracking scripts",
    "sensitive storage operations",
  ];

  return {
    repoUrl,
    inferredSources,
    dataCollectionPoints: mockScanResult.totalIssues,
  };
}
