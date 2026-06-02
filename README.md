# 🛡️ Consent Guardian AI
### The AI Privacy Engineer for Modern Codebases

> Continuous Privacy Intelligence & Compliance Automation that detects privacy risks, predicts compliance degradation, and generates AI-powered fixes before code reaches production.

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-000000?style=for-the-badge)

![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)
![Privacy First](https://img.shields.io/badge/Privacy-First-blue?style=for-the-badge)
![Local LLMs](https://img.shields.io/badge/Local-LLMs-green?style=for-the-badge)
![DevSecOps](https://img.shields.io/badge/DevSecOps-Security-red?style=for-the-badge)
![GDPR](https://img.shields.io/badge/GDPR-Compliant-success?style=for-the-badge)
![CCPA](https://img.shields.io/badge/CCPA-Ready-orange?style=for-the-badge)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype-success?style=for-the-badge)
![Made With Love](https://img.shields.io/badge/Made%20With-Privacy%20Intelligence-ff69b4?style=for-the-badge)

</p>

---

# 📸 Product Screenshots

## 1. Executive Privacy Scorecard
*A high-level view for legal teams, CISOs, and compliance officers to track privacy health, regulatory exposure, and compliance readiness.*
![Dashboard](./assets/jpg1.png)

## 2. AI Issue Detection & PR Guardian
*Autonomous pull request interception flagging problematic code changes that degrade privacy posture before they are merged.*
![Issue Analysis](./assets/jpg2.png)

## 3. Interactive Data Flow Intelligence
*A pinch-to-zoom graph mapping exactly how PII moves through the application and exposing third-party sharing risks.*
![Data Flow Analysis](./assets/jpg3.png)

## 4. Compliance Framework Heatmap
*Real-time cross-referencing of codebase architecture against GDPR, CCPA, COPPA, and PCI-DSS frameworks.*
![Compliance Heatmap](./assets/jpg4.png)

## 5. AI Copilot & Remediation
*Context-aware chat interface providing actionable, ready-to-merge code replacements to fix identified privacy risks.*
![AI Copilot](./assets/jpg5.png)

## 6. Enterprise Deployment Controls
*Enterprise configuration pane to hot-swap between Gemini/OpenRouter API and air-gapped Local Ollama instances.*
![Settings Panel](./assets/jpg6.png)

---

# ⚡ Why Teams Use Consent Guardian

- AI-powered privacy compliance scanning
- Local LLM-based secure repository analysis
- Dynamic Consent Risk Scoring
- GDPR / CCPA / COPPA / PCI-DSS detection
- Automated remediation generation
- Interactive developer security dashboard

---

# 🚨 Why This Matters

Since 2018, organizations worldwide have paid billions in GDPR and privacy-related fines.

Most violations are not caused by cyberattacks.

They happen because developers unintentionally ship:
- hidden tracking systems
- unsafe logging
- missing consent flows
- silent third-party data collection
- manipulative dark patterns

Consent Guardian AI transforms privacy compliance into an automated developer workflow. Privacy compliance today is largely reactive. Consent Guardian shifts privacy governance left by identifying, explaining, and remediating risks before code reaches production.

---

# 🎯 What Consent Guardian Does

Consent Guardian AI is an autonomous, **multi-agent** privacy governance platform that scans entire repositories to identify:
- privacy violations
- missing consent mechanisms
- insecure data collection patterns
- compliance risks

Unlike traditional static analysis tools, Consent Guardian AI uses a coordinated multi-agent architecture to semantically understand code behavior, interact with developers, and generate compliance-aware remediation suggestions.

---

# ✨ Core Capabilities

## 🔮 Predictive Compliance Intelligence
Consent Guardian doesn't just detect violations.

It forecasts future compliance degradation by analyzing development patterns, repository history, and newly introduced code paths.

### How Forecasting Works

Consent Guardian compares repository baselines against newly introduced code changes.

By analyzing:
- pull request diffs
- newly introduced data flows
- privacy-sensitive API usage
- consent regressions
- historical compliance scores

the platform estimates how a proposed change impacts future compliance readiness before deployment.

> **Example Forecast:** "If this pull request is merged, GDPR compliance readiness drops from 92% to 78% due to unconsented geolocation tracking."

## 🚨 Pull Request Guardian
Consent Guardian reviews code before it reaches production.

For every pull request, the PR Guardian Agent:
* Detects privacy regressions
* Calculates compliance impact
* Blocks critical violations
* Generates fix recommendations

> **Example Finding:** "This pull request introduces geolocation collection without explicit user consent and increases GDPR exposure by 22%."

## 🤖 Interactive Privacy Copilot
Finding the problem is only half the battle. Consent Guardian acts as an interactive AI teammate.

**Developer:** "Why is my GDPR score low?"
**Guardian:** "Three location-tracking endpoints collect data before consent."
**Developer:** "Show me where."
**Guardian:** *(Opens files instantly and highlights the insecure `navigator.geolocation` calls)*

**Developer:** "Which services receive this data?"
**Guardian:** "I identified third-party integrations that receive location-related metadata through multiple application endpoints and highlighted the affected code paths."

## 🔍 Repository Scanning
- Full repository analysis
- Recursive file traversal
- AST-aware contextual parsing

## 🧠 Multi-Agent Privacy Detection
Detects:
- hidden tracking
- geolocation misuse
- unsafe payment logging
- expired consent flows
- dark patterns
- biometric/children’s data misuse

## 📊 Executive Privacy Scorecard
Enterprise buyers, legal teams, and compliance officers get a unified view of:
- Privacy Health Score
- Compliance Readiness
- High Risk Findings
- Regulatory Exposure
- Trend Analysis

---

# 📊 Risk Scoring Model

Consent Risk Score is calculated using:

- severity weight
- data sensitivity
- exposure surface
- consent validity
- regulatory impact

Final scores are categorized into:
- Low Risk
- Moderate Risk
- High Risk
- Critical Risk

---

# 🏗️ System Architecture

## 1. Context & Parsing Engine
**Tech:** `simple-git`, `fs`

### Responsibilities
- Clone repositories securely
- Traverse project structures
- Filter dependencies/build artifacts
- Extract contextual source code

---

## 2. Multi-Agent Privacy Intelligence Engine
**Tech:** `Ollama`, Local LLMs

### Responsibilities
- Analyze privacy-sensitive logic
- Detect consent violations
- Identify insecure data flows
- Generate deterministic issue reports

---

## 3. Risk & Consent Engine

### Responsibilities
- Calculate Consent Risk Score
- Map findings to GDPR/CCPA/COPPA/PCI-DSS
- Identify re-consent requirements
- Prioritize severity levels

---

## 4. Storage & Execution Engine
**Tech:** `MongoDB Atlas`

### Responsibilities
- Persist scan sessions
- Store AI findings
- Manage generated remediations
- Serve dashboard analytics

---

# ⚙️ How It Works

1. Connect Repository
2. Orchestrate Multi-Agent Analysis
3. Map Data Flows & Regulatory Exposure
4. Detect Privacy & Consent Violations
5. Forecast Compliance Impact
6. Generate AI-Powered Remediation
7. Improve Privacy Health & Compliance Readiness

---

# 🏗️ High-Level Multi-Agent Architecture

```text
                    Repository
                          │
                          ▼

            ┌─────────────────────────┐
            │ Orchestrator Agent      │
            └──────────┬──────────────┘
                       │

 ┌────────────┬────────────┬────────────┬────────────┐
 ▼            ▼            ▼            ▼

Privacy     Data Flow   Compliance    PR Guardian
Agent       Agent       Agent         Agent

 └────────────┴────────────┴────────────┘
                       │
                       ▼

             Risk Scoring Agent
                       │
                       ▼

             Remediation Agent
                       │
                       ▼

              Privacy Copilot
                       │
                       ▼

      Executive Privacy Intelligence Dashboard
```

### Agent Collaboration Workflow
Consent Guardian is not a sequential workflow. It relies on a coordinated multi-agent architecture orchestrated by the Orchestrator Agent. Each agent operates with a dedicated system role, structured outputs, and specialized prompts coordinated through the Orchestrator Agent.

#### 🧠 Orchestrator Agent
**Responsibilities:**
- Coordinate agent execution
- Aggregate agent findings
- Resolve conflicting assessments
- Prioritize analysis pipelines
- Maintain scan context across agents

1. **Privacy Detection Agent** ➔ *Extracts raw privacy findings*
2. **Data Flow Agent** ➔ *Provides architectural context to findings*
3. **Compliance Agent** ➔ *Maps findings to GDPR/CCPA regulations*
4. **Risk Scoring Agent** ➔ *Prioritizes issues based on impact*
5. **Remediation Agent** ➔ *Generates merge-ready fixes*
6. **Copilot Agent** ➔ *Explains decisions interactively to developers*

➡️ [View Detailed Architecture Documentation](./ARCHITECTURE.md)

---

# 🔄 Developer Workflow Integration

Consent Guardian AI integrates directly into modern engineering workflows:

- GitHub Pull Request scanning
- CI/CD privacy enforcement
- Merge blocking for critical risks
- Automated remediation suggestions
- Compliance-aware code review

---

# 🔐 Why Local LLMs?

Most AI code analysis tools send proprietary source code to external APIs.

Consent Guardian AI runs locally using Ollama-powered models, ensuring:
- enterprise-safe analysis
- source code privacy
- offline-first capability
- reduced compliance exposure

---

# 🧠 AI Analysis Workflow

Consent Guardian AI uses Local LLMs to semantically analyze source code behavior instead of relying purely on regex matching.

The AI engine:
- extracts contextual code chunks
- analyzes developer intent
- detects privacy-sensitive workflows
- maps findings to compliance categories
- generates remediation suggestions

This enables detection of behavioral privacy violations that traditional static analysis tools often miss.

---

# 🔌 API Endpoints

| Endpoint | Description |
|---|---|
| POST /scan | Start repository scan |
| GET /results/:id | Fetch scan findings |
| POST /remediate | Generate remediation suggestions |
| GET /dashboard | Fetch analytics data |

---

# 📊 Compliance Coverage

| Framework | Coverage |
|---|---|
| GDPR | ✅ |
| CCPA | ✅ |
| COPPA | ✅ |
| PCI-DSS | ✅ |

---

# ⚔️ Competitive Advantage

| Traditional Static Analysis | Consent Guardian AI |
|---|---|
| Regex-based detection | Semantic AI reasoning |
| Rule-only systems | Context-aware analysis |
| Point-in-time scans | Continuous privacy intelligence |
| Reactive compliance audits | Predictive compliance forecasting |
| Detection only | Detection + remediation |
| Code findings | Code findings + regulatory context |
| Developers interpret results | AI explains impact & fixes |
| Cloud-dependent | Local AI privacy-first |
| Security focused | Privacy + consent focused |

---

# 💼 Business Impact

Consent Guardian helps organizations:

- Reduce privacy audit preparation time
- Detect compliance risks earlier in the SDLC
- Prevent costly regulatory violations
- Improve developer privacy awareness
- Enable privacy-by-design practices across engineering teams
- Establish continuous governance workflows

---

# 📈 Example Findings

In a demonstration repository scan, Consent Guardian identified:

- Geolocation collection before user consent
- Marketing preferences stored without explicit opt-in
- Sensitive payment fields logged to application logs
- Analytics integrations lacking documented consent paths
- GDPR Article 7 consent management gaps

and generated remediation suggestions for each issue.

---

# 🧪 Sample Issues Detected & Fixed

## 📍 Location Tracking Without Consent

### ❌ BEFORE
```javascript
useEffect(() => {
  navigator.geolocation.watchPosition((pos) => {
    sendLocationToServer(pos.coords);
  });
}, []);
```

### ✅ AFTER
```javascript
useEffect(() => {
  const consentGranted = await checkUserConsent('location_tracking');

  if (!consentGranted) {
    const granted = await requestConsent({
      type: 'location_tracking',
      purpose: 'To provide location-based recommendations'
    });

    if (!granted) return;
  }

  navigator.geolocation.watchPosition((pos) => {
    sendLocationToServer(pos.coords);
  });
}, []);
```

## 💳 Payment Data Logged in Plain Text

### ❌ BEFORE
```javascript
console.log('Payment:', paymentData.cardNumber, paymentData.cvv);
```

### ✅ AFTER
```javascript
logger.info('Payment initiated:', {
  amount: paymentData.amount,
  lastFour: paymentData.cardNumber.slice(-4),
  timestamp: Date.now()
});
```

## ☠️ Dark Pattern: Pre-Checked Consent
### ❌ BEFORE
```HTML
<input type="checkbox" name="marketing" defaultChecked={true} />
```

### ✅ AFTER
```HTML
<input
  type="checkbox"
  name="marketing"
  checked={marketingConsent}
  onChange={(e) => setMarketingConsent(e.target.checked)}
/>
```
---

# 🛠️ Technical Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- OpenRouter API (Primary LLM Engine)
- Ollama API (Local Fallback)
- simple-git

### Hybrid AI Architecture
- Cloud LLM reasoning
- Local privacy-preserving inference
- Automated fallback orchestration
- Multi-model remediation generation

---

# Local Development Setup

### 1. Configure Environment Variables
```env
PORT=8787
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.5-flash-lite-preview-09-2025
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=gemma:2b
MONGODB_URI=your_mongodb_uri
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Start Ollama
```bash
ollama run gemma:2b
```

---

# 🏢 Use Cases

- Enterprise privacy audits
- Secure SDLC pipelines
- DevSecOps compliance workflows
- AI governance validation
- SaaS privacy compliance checks
- Internal repository monitoring

---

# 🚀 Product Roadmap

## Upcoming Features

- GitHub App Integration
- Automated Pull Request Fixes
- CI/CD Enforcement CLI
- Semantic Chunking for Monorepos
- Multi-Model AI Support
- Team Dashboards & Audit Exports

---

# 🧪 Current Prototype Scope

The current live prototype demonstrates:

- repository scanning workflows
- AI-powered privacy issue detection
- consent risk scoring
- remediation suggestion generation
- interactive dashboard visualization

Future roadmap items such as CI/CD enforcement, GitHub App integration, and autonomous monitoring are currently under active development.

---

# 🧠 Future Vision

Consent Guardian AI aims to become an autonomous AI governance layer for modern software ecosystems.

### Future capabilities include:
- autonomous compliance guardrails
- continuous data flow monitoring
- privacy impact assessments

---

# ⚠️ Current Limitations

- Large monorepos may increase scan latency
- AI findings may require developer verification
- Some framework-specific consent flows may need custom rules
- Prototype currently optimized for JavaScript/TypeScript repositories
- Compliance recommendations should not replace legal review

---

# 🎨 Design Philosophy

- Dark-mode first developer experience
- Progressive disclosure UI
- Motion-enhanced interactions
- Severity-driven visual hierarchy
- Enterprise-grade dashboard ergonomics

# 📄 License

![LICENSE](./LICENSE)

---

# 👨‍💻 Author

Built by Saisha