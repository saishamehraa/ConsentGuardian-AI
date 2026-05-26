# 🏗️ System Architecture — Consent Guardian AI

> AI-Native Privacy Governance Platform for Modern Software Systems

---

## 📚 Document Sections

- [Architecture Overview](#-architecture-overview)
- [High-Level Architecture Flow](#-high-level-architecture-flow)
- [Core System Components](#️-core-system-components)
- [Execution Flow](#-end-to-end-execution-flow)
- [Security Architecture](#-security-architecture)
- [Scalability Design](#-scalability-design)
- [CI/CD Integration](#-cicd-integration-architecture)
- [Future Expansion](#-future-architecture-expansion)
- [Architectural Philosophy](#-architectural-philosophy)

---

# 📌 Architecture Overview

Consent Guardian AI is built as a modular AI-powered privacy analysis pipeline that scans repositories, semantically detects compliance violations using Local LLMs, calculates consent risks, and generates automated remediation suggestions.

The architecture is designed for:

* enterprise scalability
* secure offline AI execution
* developer workflow integration
* privacy-first analysis
* extensible compliance intelligence

---

# 🧠 High-Level Architecture Flow

![System Architecture](./assets/architecture.png)

---

# 🛠️ Architecture Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| AI Layer | Ollama, Gemma 2B, Llama 3, Mistral |
| Database | MongoDB Atlas, Mongoose |
| Parsing Engine | simple-git, fs, AST utilities |
| Visualization | Recharts, shadcn/ui |

---

# ⚙️ Core System Components

# 1️⃣ Frontend Layer

## Technologies

* React 18
* TypeScript
* Vite
* Tailwind CSS v4
* shadcn/ui
* Recharts

## Responsibilities

### Dashboard UI

* Privacy analytics visualization
* Risk score rendering
* Scan monitoring

### Repository Management

* Repository submission
* Scan triggering
* Session history

### AI Findings Interface

* View detected violations
* Severity categorization
* Compliance mapping

### Remediation Interface

* Before/after code comparison
* AI-generated fixes
* Merge-ready suggestions

---

# 2️⃣ API Gateway & Backend Layer

## Technologies

* Node.js
* Express.js

## Responsibilities

### API Orchestration

* Route frontend requests
* Manage scan sessions
* Coordinate AI workflows

### Secure Processing

* Validate repositories
* Manage execution pipelines
* Sanitize incoming payloads

### Service Communication

* Connect AI scanner
* Connect database engine
* Coordinate remediation workflows

---

# 3️⃣ Repository Parsing Engine

## Technologies

* simple-git
* fs
* AST parsing utilities

## Responsibilities

### Repository Cloning

* Secure git cloning
* Temporary workspace isolation

### Recursive Traversal

* Source code extraction
* Ignore build artifacts
* Dependency filtering

### Context Building

* AST-aware parsing
* Semantic context creation
* File relationship mapping

---

# 4️⃣ AI Scanner Engine

## Technologies

* Ollama
* Gemma 2B
* Llama 3
* Mistral

## Responsibilities

### Semantic Privacy Analysis

Detect:

* hidden tracking systems
* silent telemetry
* unsafe logging
* consent bypassing
* dark patterns
* biometric misuse
* child-data violations

### AI Understanding

Unlike regex scanners, the engine:

* understands behavioral logic
* interprets developer intent
* analyzes consent flow structures
* identifies contextual risks

### Deterministic Findings

Produces:

* issue summaries
* affected files
* severity labels
* compliance references
* remediation prompts

---

# 5️⃣ Risk & Consent Intelligence Engine

## Responsibilities

### Dynamic Consent Risk Score

Calculates:

* privacy exposure level
* compliance severity
* cumulative risk index

### Compliance Mapping

Maps violations to:

* GDPR
* CCPA
* COPPA
* PCI-DSS

### Severity Prioritization

Categorizes findings:

* Critical
* High
* Medium
* Low

### Re-Consent Detection

Identifies:

* expired consent
* policy drift
* unlawful tracking persistence

---

# 6️⃣ AI Remediation Engine

## Responsibilities

### Automated Code Fixes

Generates:

* secure replacements
* compliance-aware logic
* safe logging mechanisms

### Patch Intelligence

Provides:

* before/after comparison
* merge-ready suggestions
* developer-readable explanations

### Workflow Integration

Supports:

* PR review workflows
* CI/CD remediation pipelines
* developer approval flows

---

# 7️⃣ Storage Layer

## Technologies

* MongoDB Atlas
* Mongoose

## Responsibilities

### Persistent Storage

Stores:

* scan sessions
* findings
* remediation history
* analytics metadata

### Dashboard Analytics

Supports:

* historical trends
* risk progression
* compliance reporting

---

# 🔄 End-to-End Execution Flow

```text
1. Developer submits repository
            ↓
2. Repository Parsing Engine clones & traverses project
            ↓
3. AST/context extraction builds semantic understanding
            ↓
4. AI Scanner Engine analyzes code behavior
            ↓
5. Privacy violations are detected
            ↓
6. Risk Intelligence Engine calculates severity
            ↓
7. AI Remediation Engine generates secure fixes
            ↓
8. Results stored in MongoDB Atlas
            ↓
9. Dashboard visualizes findings & compliance insights
```

---
# 🔐 Security Architecture

## Privacy-First AI Execution

Consent Guardian AI uses Local LLMs through Ollama.

This ensures:

* source code never leaves infrastructure
* offline-first execution
* enterprise-safe analysis
* reduced third-party exposure

---
# 🔒 Data Flow Security Model

Consent Guardian AI follows a privacy-first execution model where:

- repositories are cloned into isolated temporary workspaces
- source code remains local during AI analysis
- no proprietary code is transmitted to external APIs
- scan artifacts are sanitized before persistence
- generated findings are scoped to repository sessions

This architecture minimizes third-party exposure risks while supporting enterprise-safe AI workflows.

---
# 🧱 Scalability Design

The architecture is modular and horizontally extensible.

Future scalability includes:

* distributed scan workers
* monorepo chunking
* multi-model orchestration
* async scan queues
* real-time streaming analysis

---
# 🛡️ Threat Model Considerations

Consent Guardian AI is designed to mitigate:

- accidental privacy violations
- unsafe telemetry exposure
- insecure logging practices
- consent bypass workflows
- hidden tracking persistence
- compliance drift in CI/CD pipelines

---
# 🔌 CI/CD Integration Architecture

```text
GitHub Pull Request
          ↓
Consent Guardian Scan Trigger
          ↓
AI Privacy Analysis
          ↓
Risk Classification
          ↓
Automated Remediation Suggestions
          ↓
Optional Merge Blocking Policies
```

---

# 📌 Key Architectural Decisions

| Decision | Reason |
|---|---|
| Local LLM execution | Preserve source code privacy |
| Modular scanning pipeline | Horizontal scalability |
| Semantic AI analysis | Detect behavioral privacy risks |
| MongoDB storage | Flexible findings schema |
| Express API orchestration | Lightweight service coordination |

---
# 🚀 Future Architecture Expansion

## Planned Capabilities

### Autonomous Privacy Governance

* continuous repository monitoring
* live consent regression detection
* AI policy enforcement

### AI Governance Layer

* prompt safety analysis
* LLM data leakage detection
* AI compliance validation

### Enterprise Intelligence

* organization-wide risk dashboards
* audit exports
* compliance trend forecasting

---
# 🧠 Architectural Philosophy

Consent Guardian AI is designed around four core principles:

## 1. Privacy-First

AI analysis should never compromise source code confidentiality.

## 2. AI-Native

Semantic reasoning should outperform rule-only detection systems.

## 3. Developer-Centric

Compliance workflows should integrate naturally into software delivery pipelines.

## 4. Enterprise-Ready

The system should scale from individual repositories to organizational governance infrastructure.

---
# 🌐 Long-Term Platform Vision

Consent Guardian AI aims to become an autonomous AI governance layer for modern software ecosystems.

From repository scanning to real-time compliance intelligence, the platform evolves privacy protection from a reactive audit process into a continuous AI-driven security workflow.
