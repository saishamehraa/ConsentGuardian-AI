// server/engines/aiScanner.js
import { randomUUID } from 'node:crypto';

export async function scanCodeWithOllama(files) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const model = process.env.OLLAMA_MODEL || "gemma:2b";
  
  let detectedIssues = [];

  // OPTIMIZATION: Only scan files that contain privacy-related keywords.
  // This saves massive amounts of time and prevents cloud timeout errors.
  const keywords = ['geolocation', 'cookie', 'localStorage', 'fetch', 'axios', 'payment', 'email', 'tracking', 'password'];
  
  // Filter by keywords, then slice to a maximum of 5 files to ensure the scan finishes quickly
  const suspiciousFiles = files
    .filter(f => keywords.some(k => f.content.includes(k)))
    .slice(0, 5); 

  console.log(`🧠 AI Scanner analyzing ${suspiciousFiles.length} suspicious files...`);

  // HELPER: Force-extract JSON even if the AI wraps it in markdown or chatty text
  function extractJson(str) {
    const match = str.match(/\[[\s\S]*\]/); // Look for anything between [ and ]
    return match ? match[0] : "[]";
  }

  for (const file of suspiciousFiles) {
    console.log(`🔍 AI Scanning: ${file.file}`);
    
    // STRICT PROMPT: Demanding a JSON array to prevent parsing crashes
    const prompt = `
      You are a privacy compliance API.
      Analyze this code for GDPR/CCPA violations (missing consent, tracking, plaintext data logging).
      
      CRITICAL: You must respond with ONLY a raw JSON array. 
      No markdown, no "Output:", no conversational text.
      If the code is perfectly safe, return an empty array: []
      
      [
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

      Code File: ${file.file}
      Content:
      ${file.content.substring(0, 2000)}
    `;

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1, // Low temperature for analytical consistency
        })
      });

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
          console.log(`⚠️ No response from AI for ${file.file}`);
          continue;
      }

      let content = data.choices[0].message.content.trim();
      const cleanJson = extractJson(content); 
      const parsed = JSON.parse(cleanJson);
      
      // Map the AI response into our expected ConsentIssue structure
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(issue => {
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
    } catch (err) {
      console.error(`⚠️ Failed to parse AI response for ${file.file}:`, err.message);
    }
  }

  return detectedIssues;
}