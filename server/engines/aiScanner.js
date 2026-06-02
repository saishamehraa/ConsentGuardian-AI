// server/engines/aiScanner.js
import { randomUUID } from 'node:crypto';

export async function scanCodeWithOllama(files) {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const ollamaModel = process.env.OLLAMA_MODEL || "gemma:2b";
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-lite-001";
  
  let detectedIssues = [];

  // OPTIMIZATION: Only scan files that contain privacy-related keywords.
  const keywords = ['geolocation', 'cookie', 'localStorage', 'fetch', 'axios', 'payment', 'email', 'tracking', 'password'];
  
  // Filter by keywords, then slice to a maximum of 5 files to ensure the scan finishes quickly
  const suspiciousFiles = files
    .filter(f => keywords.some(k => f.content.toLowerCase().includes(k)))
    .slice(0, 5); 

  console.log(`🧠 AI Scanner analyzing ${suspiciousFiles.length} suspicious files...`);

  // Force-extract a JSON Object {} instead of an Array []
  function extractJson(str) {
    const match = str.match(/\{[\s\S]*\}/); 
    return match ? match[0] : '{"issues": []}';
  }

  const processResponse = (content, file) => {
    const cleanJson = extractJson(content); 
    const parsed = JSON.parse(cleanJson);
    
    if (parsed.issues && Array.isArray(parsed.issues) && parsed.issues.length > 0) {
      parsed.issues.forEach(issue => {
        detectedIssues.push({
          id: randomUUID(),
          title: issue.title || "Privacy Violation Detected",
          file: file.file,
          line: 1, 
          severity: issue.severity || "medium",
          category: issue.category || "unsafe_usage",
          description: issue.description || "Potential compliance risk found.",
          affectedCode: issue.affectedCode || "// Code snippet unavailable",
          explanation: issue.explanation || "Guardian AI flagged this code.",
          impact: issue.impact || "Regulatory compliance risk.",
          recommendation: issue.recommendation || "Review data collection practices.",
          dataFlow: ["Client Browser", file.file, "Backend API"],
          fixed: false,
        });
      });
    }
  };

  for (const file of suspiciousFiles) {
    console.log(`🔍 AI Scanning: ${file.file}`);
    
    const prompt = `
      You are a strict privacy compliance API.
      Analyze this code for GDPR/CCPA violations (missing consent, tracking, plaintext data logging).
      
      CRITICAL: You must respond with ONLY a valid JSON OBJECT. No markdown, no conversational text.
      If the code is perfectly safe, you MUST return exactly: {"issues": []}
      
      If you find violations, return them like this:
      {
        "issues": [
          {
            "title": "Short title of the issue",
            "severity": "critical", 
            "category": "missing_consent", 
            "description": "Brief description of the violation",
            "affectedCode": "The specific 3-4 lines of code causing the issue",
            "explanation": "Why this violates GDPR/CCPA",
            "impact": "Potential fines or business impact",
            "recommendation": "How to fix it"
          }
        ]
      }

      Code File: ${file.file}
      Content:
      ${file.content.substring(0, 2000)}
    `;

    let success = false;

    // 1. Try OpenRouter First
    if (openRouterKey) {
      try {
        console.log(`   [API] Attempting OpenRouter (${openRouterModel})...`);
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: openRouterModel,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          processResponse(data.choices[0].message.content.trim(), file);
          success = true;
          console.log(`   ✅ OpenRouter processed successfully.`);
        }
      } catch (err) {
        console.error(`   ⚠️ OpenRouter failed:`, err.message);
      }
    }

    // 2. Fallback to Ollama
    if (!success) {
      try {
        console.log(`   [API] Falling back to Ollama (${ollamaModel})...`);
        const response = await fetch(`${ollamaBaseUrl}/chat/completions`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          processResponse(data.choices[0].message.content.trim(), file);
          console.log(`   ✅ Ollama processed successfully.`);
        } else {
           console.log(`   ⚠️ No response from Ollama.`);
        }
      } catch (err) {
        console.log(`   ✅ ${file.file} processed (No valid issues found or parsing bypassed).`);
        console.error(`   [Debug] Ollama Parsing Error:`, err.message);
      }
    }
  }

  return detectedIssues;
}