//server/engines/executionEngine.js
export async function generateFix(issue) {
  // Pointing to your local Ollama instance
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const model = process.env.OLLAMA_MODEL || "gemma:2b";

  console.log(`🧠 Generating fix using local model (${model}) via ${baseUrl}...`);

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
    
    Respond strictly with the JSON object. Do not include markdown formatting like \`\`\`json around your response.
  `;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a specialized code compliance AI. You output strictly valid JSON without any markdown formatting." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        // Gemma usually doesn't require response_format: {type: "json_object"} 
        // and sometimes it causes errors, so we rely on the system prompt instead.
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Aggressive JSON parsing: strip markdown and extract the JSON object
    if (content.startsWith('```json')) content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    else if (content.startsWith('```')) content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    
    // Find first { and last } to handle chatty models
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      content = content.substring(firstBrace, lastBrace + 1);
    }

    const parsedResponse = JSON.parse(content);

    return {
      fixedCode: parsedResponse.fixedCode || "// Failed to parse fixed code",
      explanation: parsedResponse.explanation || "Failed to parse explanation."
    };

  } catch (error) {
    console.error("Local Execution Engine Error:", error);
    return {
      fixedCode: issue?.affectedCode ?? "",
      explanation: `Guardian AI encountered an error generating the fix via local model: ${error.message}`,
    };
  }
}