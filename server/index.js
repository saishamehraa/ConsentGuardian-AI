// server/index.js
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
import { cloneRepository, cleanupRepository } from "./engines/gitEngine.js";
import { extractCodeFiles } from "./engines/parserEngine.js";
import { scanCodeWithOllama } from "./engines/aiScanner.js";

// AI Agent Imports
import { 
  runPrivacyDetectionAgent, 
  runDataFlowIntelligenceAgent, 
  runRegulatoryMappingAgent, 
  runPredictiveComplianceEngine 
} from "./agents/index.js";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 8787;

// ⭐ FIXED: Allow requests from Render by setting origin to true
app.use(cors({ 
  origin: true,
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "consent-guardian-api" }));

app.post("/api/scan", async (req, res) => {
  const { repoUrl } = req.body ?? {};
  const scanId = randomUUID();
  let tmpDir = null;

  try {
    let projectName = "custom-scan";
    try { projectName = repoUrl ? new URL(repoUrl).pathname.split('/').pop() : "custom-scan"; } 
    catch (e) { projectName = repoUrl || "custom-scan"; }

    let files = [];
    if (repoUrl && repoUrl.startsWith('http')) {
      tmpDir = await cloneRepository(repoUrl);
      files = await extractCodeFiles(tmpDir);
    } else {
      throw new Error("Please provide a valid HTTP/HTTPS git repository URL.");
    }

    // AI Agents execution
    console.log("Running Privacy Detection Agent...");
    const liveIssues = await runPrivacyDetectionAgent(files);
    
    console.log("Running Data Flow Intelligence Agent...");
    const dataFlow = await runDataFlowIntelligenceAgent(files, liveIssues);

    console.log("Running Regulatory Mapping Agent...");
    const regulatoryMapping = await runRegulatoryMappingAgent(liveIssues, dataFlow);

    console.log("Running Predictive Compliance Engine...");
    const predictiveForecast = await runPredictiveComplianceEngine(liveIssues);

    const newStats = { critical: 0, high: 0, medium: 0, low: 0 };
    liveIssues.forEach(issue => {
        if (newStats[issue.severity] !== undefined) newStats[issue.severity]++;
    });

    const dynamicResult = {
      projectName: projectName,
      scannedAt: new Date().toISOString(),
      totalFiles: files.length > 0 ? files.length : 127,
      totalIssues: liveIssues.length,
      issues: liveIssues,
      stats: newStats,
      dataFlow,
      regulatoryMapping,
      predictiveForecast
    };

    const riskScore = calculateRiskScore(dynamicResult.issues, []);
    const context = await buildContext(repoUrl ?? "demo-repository");

    const analysis = {
      scanId,
      context: { ...context, filesScanned: files.length },
      result: { ...dynamicResult, riskScore },
    };

    await saveAnalysis(scanId, analysis); 
    res.json(analysis);

  } catch (error) {
    console.error("Scan API Error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (tmpDir) await cleanupRepository(tmpDir);
  }
});

app.post("/api/risk", async (req, res) => {
  const { scanId, fixedIssueIds = [] } = req.body ?? {};
  const analysis = scanId ? await getAnalysis(scanId) : null;
  const issues = analysis?.result?.issues ?? mockScanResult.issues;
  const score = calculateRiskScore(issues, fixedIssueIds);
  res.json({ score });
});

app.post("/api/fix", async (req, res) => {
  const { issueId } = req.body ?? {};
  let issue = mockScanResult.issues.find((item) => item.id === issueId);
  
  if (!issue) {
    try {
      const mongoose = (await import('mongoose')).default;
      if (mongoose.models.Analysis) {
         const record = await mongoose.models.Analysis.findOne({ "result.issues.id": issueId }).lean();
         if (record) issue = record.result.issues.find(i => i.id === issueId);
      }
    } catch (dbError) {
      console.error("Error looking up issue in DB:", dbError);
    }
  }

  if (!issue) return res.status(404).json({ message: "Issue not found" });

  const generated = await generateFix(issue);
  res.json(generated);
});

app.post("/api/chat", async (req, res) => {
  const { message, history, contextIssues } = req.body ?? {};
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-lite-001";

  if (!openRouterKey) {
    return res.status(500).json({ error: "OpenRouter API Key not configured." });
  }

  // Build the system prompt with context
  const issuesContext = contextIssues && contextIssues.length > 0 
    ? contextIssues.map((i, idx) => `Issue ${idx+1}: ${i.title} in ${i.file}:${i.line} (${i.severity})\nDesc: ${i.description}\n`).join('\n')
    : 'No active privacy issues found in the current scan.';

  const systemMessage = {
    role: "system",
    content: `You are the Consent Guardian AI Copilot, a highly advanced privacy engineering assistant.
You have analyzed a codebase and found the following privacy/consent issues:
${issuesContext}

Answer the user's questions about these issues, privacy engineering best practices, or generate remediation code if asked. Provide concise, helpful responses.`
  };

  const formattedHistory = (history || []).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  const messages = [systemMessage, ...formattedHistory, { role: "user", content: message }];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "No response from AI." });
    }
    
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ⭐ FIXED: Static File Serving logic
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

app.listen(port, () => {
  console.log(`Consent Guardian API listening on port ${port}`);
});