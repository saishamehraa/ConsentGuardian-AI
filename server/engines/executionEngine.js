//server/engines/executionEngine.js
export async function generateFix(issue) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-lite-001";

  if (!apiKey) {
    console.warn("⚠️ OPENROUTER_API_KEY is missing. Falling back to mock data.");
    return {
      fixedCode: issue?.fixedCode ?? "// API Key missing",
      explanation: issue?.explanation ?? "Please add your OpenRouter API key to the .env file.",
    };
  }

  const prompt = `
    You are an expert AI security architect specializing in privacy compliance (GDPR, CCPA, COPPA, PCI-DSS).
    Analyze the following code issue and generate a fixed, compliant version.
    
    Issue Title: ${issue.title}
    Category: ${issue.category}
    Description: ${issue.description}
    
    Vulnerable Code:
    \`\`\`
    ${issue.affectedCode}
    \`\`\`
    
    Provide your response as a valid JSON object with exactly two keys:
    1. "explanation": A concise, professional explanation of the compliance risk and how your fix addresses it.
    2. "fixedCode": The complete, corrected code snippet. Add a comment like "// AI-FIXED: [brief note]" at the changed lines.
    
    Respond ONLY with the JSON object. Do not include markdown formatting like \`\`\`json around your response.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5173", // Optional, for OpenRouter rankings
        "X-Title": "Consent Guardian AI", // Optional, for OpenRouter rankings
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a specialized code compliance AI. You output strictly valid JSON." },
          { role: "user", content: prompt }
        ],
        // Force JSON response format if the model supports it
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Robust JSON parsing: clean up markdown blocks if the LLM ignores instructions
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const parsedResponse = JSON.parse(content);

    return {
      fixedCode: parsedResponse.fixedCode || "// Failed to parse fixed code",
      explanation: parsedResponse.explanation || "Failed to parse explanation."
    };

  } catch (error) {
    console.error("OpenRouter Execution Error:", error);
    return {
      fixedCode: issue?.affectedCode ?? "",
      explanation: `Guardian AI encountered an error generating the fix: ${error.message}`,
    };
  }
}