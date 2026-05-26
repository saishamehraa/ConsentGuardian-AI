// server/engines/aiScanner.js
import { randomUUID } from 'crypto';

export async function scanCodeWithOllama(files) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const model = process.env.OLLAMA_MODEL || "gemma:2b";
  
  let detectedIssues = [];

  // MVP Optimization: Only scan files that contain privacy-related keywords
  const keywords = ['geolocation', 'cookie', 'localStorage', 'fetch', 'axios', 'payment', 'email', 'tracking', 'password'];
  const suspiciousFiles = files.filter(f => keywords.some(k => f.content.includes(k))).slice(0, 3); // Limit to 3 for demo speed

  console.log(`🧠 AI Scanner analyzing ${suspiciousFiles.length} suspicious files...`);

  for (const file of suspiciousFiles) {
    console.log(`🔍 Scanning: ${file.file}`);
    
    const prompt = `
      You are an expert AI security architect specializing in privacy compliance (GDPR, CCPA).
      Analyze the following code. If you find a privacy violation (e.g., missing consent, tracking, plaintext data logging), output a JSON array containing the issue. If the code is safe, output an empty array [].
      
      Output ONLY valid JSON matching this exact structure:
      [{
        "title": "Short title of the issue",
        "severity": "critical", // or "high", "medium", "low"
        "category": "missing_consent", // or "unsafe_usage", "hidden_collection"
        "description": "Brief description of the violation",
        "affectedCode": "The specific 3-4 lines of code causing the issue",
        "explanation": "Detailed explanation of why this violates GDPR/CCPA",
        "impact": "Potential fines or business impact",
        "recommendation": "How to fix it"
      }]

      Code File: ${file.file}
      \`\`\`
      ${file.content.substring(0, 2000)} // Truncated for context window
      \`\`\`
    `;

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        })
      });

      const data = await response.json();
      let content = data.choices[0].message.content.trim();

      // Clean up markdown wrapping from LLM
      if (content.startsWith('```json')) content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
      else if (content.startsWith('```')) content = content.replace(/^```\n/, '').replace(/\n```$/, '');

      const parsed = JSON.parse(content);
      
      // Map the AI response into our expected ConsentIssue structure
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(issue => {
          detectedIssues.push({
            id: randomUUID(),
            title: issue.title || "Privacy Violation Detected",
            file: file.file,
            line: 1, // Simplifying line number for now
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