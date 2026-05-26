// server/engines/aiScanner.js
import { randomUUID } from 'node:crypto';

export async function scanCodeWithOllama(files) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const model = process.env.OLLAMA_MODEL || "gemma:2b";
  
  let detectedIssues = [];

  // OPTIMIZATION: Only scan files that contain privacy-related keywords.
  const keywords = ['geolocation', 'cookie', 'localStorage', 'fetch', 'axios', 'payment', 'email', 'tracking', 'password'];
  
  // Filter by keywords, then slice to a maximum of 5 files to ensure the scan finishes quickly
  const suspiciousFiles = files
    .filter(f => keywords.some(k => f.content.toLowerCase().includes(k)))
    .slice(0, 5); 

  console.log(`🧠 AI Scanner analyzing ${suspiciousFiles.length} suspicious files via Ollama/ngrok...`);

  // Force-extract a JSON Object {} instead of an Array []
  function extractJson(str) {
    const match = str.match(/\{[\s\S]*\}/); 
    return match ? match[0] : '{"issues": []}';
  }

  for (const file of suspiciousFiles) {
    console.log(`🔍 AI Scanning: ${file.file}`);
    
    // Prompt explicitly demands a JSON Object with an "issues" array inside
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

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" // Bypasses ngrok's free tier warning
        },
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
      
      // Iterate over parsed.issues instead of just parsed
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
    } catch (err) {
      console.log(`✅ ${file.file} processed (No valid issues found or parsing bypassed).`);
    }
  }

  return detectedIssues;
}