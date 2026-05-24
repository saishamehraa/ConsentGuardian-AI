//server/index.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { mockScanResult } from "./data/mockScanResult.js";
import { buildContext } from "./engines/contextEngine.js";
import { detectConsentGaps } from "./engines/consentEngine.js";
import { calculateRiskScore } from "./engines/riskEngine.js";
import { generateFix } from "./engines/executionEngine.js";
import { saveAnalysis, getAnalysis } from "./store/analysisStore.js";

const app = express();
const port = Number(process.env.PORT) || 8787;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "consent-guardian-api" });
});

app.post("/api/scan", async (req, res) => {
  const { repoUrl } = req.body ?? {};
  const scanId = randomUUID();

  const context = await buildContext(repoUrl ?? "demo-repository");
  const consentGaps = detectConsentGaps(mockScanResult.issues);
  const riskScore = calculateRiskScore(mockScanResult.issues, []);

  const analysis = {
    scanId,
    context,
    consentGaps,
    result: {
      ...mockScanResult,
      riskScore,
      scannedAt: new Date().toISOString(),
    },
  };

  saveAnalysis(scanId, analysis);
  res.json(analysis);
});

app.post("/api/risk", (req, res) => {
  const { scanId, fixedIssueIds = [] } = req.body ?? {};
  const analysis = scanId ? getAnalysis(scanId) : null;
  const issues = analysis?.result?.issues ?? mockScanResult.issues;
  const score = calculateRiskScore(issues, fixedIssueIds);

  res.json({ score });
});

app.post("/api/fix", async (req, res) => {
  const { issueId } = req.body ?? {};
  const issue = mockScanResult.issues.find((item) => item.id === issueId);

  if (!issue) {
    res.status(404).json({ message: "Issue not found" });
    return;
  }

  const generated = await generateFix(issue);
  res.json(generated);
});

app.listen(port, () => {
  console.log(`Consent Guardian API listening on http://localhost:${port}`);
});
