//server/index.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import path from "path";
import { fileURLToPath } from "url";

import { mockScanResult } from "./data/mockScanResult.js";
import { buildContext } from "./engines/contextEngine.js";
import { detectConsentGaps } from "./engines/consentEngine.js";
import { calculateRiskScore } from "./engines/riskEngine.js";
import { generateFix } from "./engines/executionEngine.js";
import { saveAnalysis, getAnalysis } from "./store/analysisStore.js";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 8787;

app.use(cors({ origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "consent-guardian-api" });
});

app.post("/api/scan", async (req, res) => {
  const { repoUrl } = req.body ?? {};
  const scanId = randomUUID();

  const context = await buildContext(repoUrl ?? "demo-repository");
  
  const dynamicResult = {
    ...mockScanResult,
    projectName: repoUrl ? new URL(repoUrl).pathname.split('/').pop() : "custom-scan",
    scannedAt: new Date().toISOString(),
  };

  const consentGaps = detectConsentGaps(dynamicResult.issues);
  const riskScore = calculateRiskScore(dynamicResult.issues, []);

  const analysis = {
    scanId,
    context,
    consentGaps,
    result: {
      ...dynamicResult,
      riskScore,
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

// Serve the built frontend static files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Bulletproof catch-all for React Router (bypasses Express 5 string parsing)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Consent Guardian API listening on http://localhost:${port}`);
});