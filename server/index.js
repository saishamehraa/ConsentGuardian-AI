import 'dotenv/config';
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import path from "path";
import { fileURLToPath } from "url";

// Data & Engine Imports
import { mockScanResult } from "./data/mockScanResult.js";
import { buildContext } from "./engines/contextEngine.js";
import { detectConsentGaps } from "./engines/consentEngine.js";
import { calculateRiskScore } from "./engines/riskEngine.js";
import { generateFix } from "./engines/executionEngine.js";
import { saveAnalysis, getAnalysis, connectDB } from "./store/analysisStore.js";

// NEW: Live Pipeline Engine Imports
import { cloneRepository, cleanupRepository } from "./engines/gitEngine.js";
import { extractCodeFiles } from "./engines/parserEngine.js";
import { scanCodeWithOllama } from "./engines/aiScanner.js";

// Connect to MongoDB Atlas
connectDB();

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 8787;

app.use(cors({ 
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "consent-guardian-api" });
});

// --- THE LIVE SCANNER PIPELINE ---
app.post("/api/scan", async (req, res) => {
  const { repoUrl } = req.body ?? {};
  const scanId = randomUUID();
  let tmpDir = null;

  try {
    // 1. Determine Project Name from URL
    let projectName = "custom-scan";
    try { projectName = repoUrl ? new URL(repoUrl).pathname.split('/').pop() : "custom-scan"; } 
    catch (e) { projectName = repoUrl || "custom-scan"; }

    // 2. Clone and Parse Repository
    let files = [];
    if (repoUrl && repoUrl.startsWith('http')) {
      tmpDir = await cloneRepository(repoUrl);
      files = await extractCodeFiles(tmpDir);
    } else {
      throw new Error("Please provide a valid HTTP/HTTPS git repository URL.");
    }

    // 3. Run Live AI Analysis via Ollama
    const liveIssues = await scanCodeWithOllama(files);

    // 4. Calculate Stats dynamically
    const newStats = { critical: 0, high: 0, medium: 0, low: 0 };
    liveIssues.forEach(issue => {
        if (newStats[issue.severity] !== undefined) newStats[issue.severity]++;
    });

    // 5. Build the Dynamic Result Object
    const dynamicResult = {
      projectName: projectName,
      scannedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalIssues: liveIssues.length,
      issues: liveIssues,
      stats: newStats,
      dataCollectionPoints: [] // Future scope: AI can extract these too
    };

    const consentGaps = detectConsentGaps(dynamicResult.issues);
    const riskScore = calculateRiskScore(dynamicResult.issues, []);
    const context = await buildContext(repoUrl ?? "demo-repository");

    const analysis = {
      scanId,
      context: { ...context, filesScanned: files.length },
      consentGaps,
      result: {
        ...dynamicResult,
        riskScore,
      },
    };

    // 6. Save to MongoDB Atlas
    await saveAnalysis(scanId, analysis); 
    res.json(analysis);

  } catch (error) {
    console.error("Scan API Error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // 7. ALWAYS clean up the downloaded code
    if (tmpDir) {
      await cleanupRepository(tmpDir);
    }
  }
});

app.post("/api/risk", async (req, res) => {
  const { scanId, fixedIssueIds = [] } = req.body ?? {};
  
  // Await the database lookup
  const analysis = scanId ? await getAnalysis(scanId) : null;
  const issues = analysis?.result?.issues ?? mockScanResult.issues;
  const score = calculateRiskScore(issues, fixedIssueIds);

  res.json({ score });
});

app.post("/api/fix", async (req, res) => {
  const { issueId } = req.body ?? {};
  
  // 1. Try to find the issue in the static demo data first
  let issue = mockScanResult.issues.find((item) => item.id === issueId);
  
  // 2. If it's a live AI issue, find it in the MongoDB Atlas database
  if (!issue) {
    try {
      const mongoose = (await import('mongoose')).default;
      if (mongoose.models.Analysis) {
         const record = await mongoose.models.Analysis.findOne({ "result.issues.id": issueId }).lean();
         if (record) {
            issue = record.result.issues.find(i => i.id === issueId);
         }
      }
    } catch (dbError) {
      console.error("Error looking up issue in DB:", dbError);
    }
  }

  if (!issue) {
    res.status(404).json({ message: "Issue not found in database or demo data" });
    return;
  }

  // 3. Send the specific affected code to Ollama to fix
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