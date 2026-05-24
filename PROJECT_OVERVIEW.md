# Consent Guardian AI - Trust Layer for Codebases

**Built for Guardian AI Hackathon 2026**

## 🎯 Project Overview

Consent Guardian AI is an AI-powered developer tool that scans entire codebases to detect privacy violations, missing consent mechanisms, and compliance risks. It leverages **Guardian AI** as the core AI development partner to analyze code, identify issues, and automatically generate compliant fixes.

This is NOT a chatbot - it's a repository-level developer tool designed to ensure privacy compliance across your entire codebase.

---

## 🏗️ System Architecture

### 4 Core Engines

1. **Context Engine (Code Analysis)**
   - Parses entire repository (frontend + backend)
   - Identifies API calls, user input points, data collection
   - Builds comprehensive data flow map

2. **Risk Engine (Compliance Analysis)**
   - Analyzes flows for missing consent
   - Detects unsafe data usage
   - Identifies hidden/background data collection
   - Assigns "Consent Risk Score" per module
   - Flags high-risk areas

3. **Consent Engine (Policy Enforcement)**
   - Determines where consent is required
   - Detects when consent must be revisited:
     - New feature usage
     - Policy changes
     - Time-based expiry
   - Generates consent enforcement logic

4. **Execution Engine (Guardian AI Integration)**
   - Explains issues in plain language
   - Generates missing consent checks
   - Refactors unsafe code patterns
   - Creates middleware for enforcement
   - Provides compliance documentation

---

## 🚀 Key Features

### Dashboard & Analytics
- **Real-time Risk Score**: 0-100 scale showing overall consent compliance
- **Issue Classification**: Critical, High, Medium, Low severity levels
- **Visual Data Flow**: Charts showing data collection vs consent coverage
- **Live Updates**: Risk score improves as issues are fixed

### Issue Detection
Detects 12+ types of privacy violations:
- Missing consent mechanisms
- Unsafe data usage
- Hidden data collection
- Expired consent
- Dark patterns (pre-checked boxes, etc.)
- Biometric data without special consent
- Children's data without parental consent
- Third-party data sharing without notice
- PCI-DSS violations
- Missing consent withdrawal mechanisms
- Cookie consent issues
- Data retention policy violations

### Compliance Frameworks
- **GDPR** (EU General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **COPPA** (Children's Online Privacy Protection Act)
- **PCI-DSS** (Payment Card Industry Data Security Standard)

### AI-Powered Fixes
- Guardian AI analyzes each issue
- Generates compliant code replacements
- Includes detailed explanations
- Shows before/after comparison
- One-click application

---

## 🎨 Frontend Features

### Landing Page (`/`)
- Hero section with project branding
- Repository URL input
- "Try Demo Repository" button
- Real-time scanning progress with stages:
  - Cloning repository
  - Parsing code structure
  - Analyzing data flows
  - Scanning for consent issues
  - Calculating risk score
- Feature showcase of 4 engines
- "How It Works" guide

### Dashboard (`/dashboard`)
- **Risk Score Widget**: Large display with color-coded status
- **Stats Overview**: Total issues, files scanned, severity breakdown
- **Issue Filtering**: Filter by severity (All, Critical, High, Medium, Low)
- **Issues List**: Detailed cards with:
  - Severity badge
  - Category classification
  - File location
  - Description
  - "View Details" button
- **Data Flow Tab**: Visual charts showing:
  - Data collection points
  - Consent coverage by data type
  - Issue distribution by severity
  - Issue distribution by category

### Issue Detail Page (`/issue/:id`)
- **Full Issue Analysis**:
  - Guardian AI's detailed explanation
  - Impact assessment
  - Recommendations
  - Compliance framework references
- **Code Comparison**:
  - Side-by-side original vs fixed code
  - Syntax highlighted
  - Clear annotations
- **Data Flow Visualization**:
  - Step-by-step data flow path
  - Shows exactly where data travels
- **Fix Generation**:
  - "Generate Fix with Guardian AI" button
  - Loading state with progress
  - "Apply Fix" action
  - Success confirmation

---

## ⚙️ Technical Stack

### Frontend
- **React** with TypeScript
- **React Router** for multi-page navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **shadcn/ui** component library

### Backend (Mock Services)
- Mock repository scanning service
- Simulated Guardian AI integration
- Realistic progress tracking
- Sample issue database with 12 real-world examples

### Key Files

```
/src/app/
├── App.tsx                      # Main app entry with router
├── routes.tsx                   # Route configuration
├── pages/
│   ├── HomePage.tsx            # Landing page with repo input
│   ├── DashboardPage.tsx       # Main dashboard with risk score
│   └── IssueDetailPage.tsx     # Individual issue analysis
├── components/
│   ├── IssuesList.tsx          # Issues table component
│   ├── CodeComparison.tsx      # Side-by-side code diff
│   └── DataFlowChart.tsx       # Data visualization charts
└── services/
    ├── mockData.ts             # Sample scan results & issues
    └── scanService.ts          # Mock scanning & Guardian AI integration
```

---

## 📊 Demo Flow (Hackathon Presentation)

1. **Start** → Landing page with clean hero section
2. **Input** → Click "Try Demo Repository"
3. **Scan** → Watch real-time progress (5 stages, ~5 seconds)
4. **Dashboard** → Show risk score of 67/100
5. **Explore** → Click filters to show Critical issues (3 found)
6. **Detail** → Click "Location tracking without consent"
7. **Analysis** → Show Guardian AI's detailed explanation
8. **Fix** → Click "Generate Fix with Guardian AI"
9. **Compare** → Show before/after code comparison
10. **Apply** → Click "Apply Fix"
11. **Result** → Return to dashboard, risk score improved to 82/100
12. **Data Flow** → Switch to Data Flow tab, show visual charts

**Total Demo Time**: 3-5 minutes

---

## 🎯 Sample Issues (12 Pre-loaded)

1. **Location tracking without explicit user consent** (CRITICAL)
2. **Email collection without consent checkbox** (HIGH)
3. **Hidden tracking pixel without disclosure** (HIGH)
4. **Payment data logged in plain text** (CRITICAL)
5. **Cookie set without consent banner** (HIGH)
6. **User data shared with third-party without notice** (CRITICAL)
7. **Expired consent not re-validated** (MEDIUM)
8. **No consent withdrawal mechanism** (MEDIUM)
9. **Biometric data collected without special consent** (CRITICAL)
10. **Children's data without parental consent** (HIGH)
11. **Pre-selected consent checkboxes (dark pattern)** (MEDIUM)
12. **No data retention policy enforcement** (LOW)

Each issue includes:
- Real code examples
- Guardian AI analysis
- Regulatory references (GDPR Article X, etc.)
- Impact assessment
- Generated fix
- Data flow path

---

## 🧪 Guardian AI Integration

### Mock Implementation
The current version uses simulated Guardian AI responses for hackathon demo purposes.

### Integration Points
1. **Issue Analysis**: `analyzeIssueWithGuardian AI(issueId)`
2. **Fix Generation**: `generateFixWithGuardian AI(issueId)`
3. **Risk Scoring**: `calculateRiskScore(fixedIssues)`

### Real Guardian AI Integration (Future)
```typescript
// Example of how to integrate real Guardian AI API
import { IBMGuardian AIClient } from '@ibm/Guardian AI-sdk';

const Guardian AI = new IBMGuardian AIClient({
  apiKey: process.env.IBM_Guardian AI_API_KEY
});

async function analyzeCodeWithGuardian AI(code: string, context: string) {
  const analysis = await Guardian AI.analyze({
    code,
    context,
    frameworks: ['GDPR', 'CCPA', 'COPPA', 'PCI-DSS'],
    focusAreas: ['consent', 'data-privacy', 'security']
  });
  
  return analysis;
}
```

---

## 🏆 Hackathon Highlights

### Why This Project Stands Out

1. **Real-World Problem**: Privacy compliance is a massive challenge for all companies
2. **AI-Powered Solution**: Guardian AI does the heavy lifting of code analysis
3. **Developer-Focused**: Built for developers, not lawyers
4. **Automated Fixes**: Not just detection, but actual code generation
5. **Visual Impact**: Beautiful dashboard with clear metrics
6. **Production-Ready Design**: Clean, professional UI that looks real
7. **Comprehensive Coverage**: 12 different issue types across 4 compliance frameworks

### Technical Achievements
- ✅ Full-stack architecture with clear separation of concerns
- ✅ Multi-page React app with routing
- ✅ Real-time progress tracking
- ✅ Interactive data visualizations (charts, graphs)
- ✅ Code comparison with syntax highlighting
- ✅ Responsive design
- ✅ Mock backend services for demo
- ✅ Realistic sample data

### Business Value
- **Time Savings**: Automated compliance checking vs manual code review
- **Risk Reduction**: Catch violations before deployment
- **Cost Avoidance**: Prevent GDPR fines (up to €20M)
- **Trust Building**: Show users you care about their privacy
- **Audit Trail**: Document compliance efforts

---

## 🚀 Running the Project

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   Navigate to `http://localhost:5173`

3. **Try Demo**
   - Click "Try Demo Repository"
   - Watch the scan progress
   - Explore the dashboard
   - Click on issues to see details
   - Generate and apply fixes

---

## 🎨 Design Philosophy

### Color Palette
- **Primary**: Blue (#3b82f6) - Trust, security
- **Secondary**: Purple (#8b5cf6) - AI, innovation
- **Critical**: Red (#ef4444) - Danger, urgency
- **Warning**: Orange (#f97316) - Caution
- **Success**: Green (#22c55e) - Fixed, compliant
- **Background**: Dark slate - Professional, modern

### Typography
- Clean, modern sans-serif
- High contrast for readability
- Code blocks with monospace font

### UI Principles
- **Clarity**: Information is easy to understand
- **Action-Oriented**: Clear CTAs ("Generate Fix", "Apply")
- **Progressive Disclosure**: Details on demand
- **Visual Hierarchy**: Important info stands out
- **Trust Signals**: Guardian AI branding, professional design

---

## 🎯 Future Enhancements (Beyond Hackathon)

1. **Real Guardian AI Integration**
   - Connect to actual Guardian AI API
   - Live code analysis
   - Real-time fix generation

2. **GitHub Integration**
   - OAuth authentication
   - Direct repo access
   - Create PRs with fixes
   - CI/CD pipeline integration

3. **Enhanced Detection**
   - Machine learning for pattern detection
   - Custom rule creation
   - Industry-specific compliance (HIPAA, SOC2)

4. **Team Features**
   - Multi-user dashboards
   - Issue assignment
   - Approval workflows
   - Audit reports

5. **Deployment Blocking**
   - Set risk score thresholds
   - Block deployments with critical issues
   - Required fix enforcement

6. **Analytics**
   - Track compliance over time
   - Team performance metrics
   - Issue trend analysis

---

## 📝 License

This project was created for the Guardian AI Hackathon 2026.

---

## 👥 Credits

**Built with Guardian AI** - AI-powered code analysis and generation

**Technologies Used**:
- React
- TypeScript
- Tailwind CSS
- Recharts
- React Router
- shadcn/ui

---

## 🎉 Conclusion

Consent Guardian AI demonstrates how Guardian AI can revolutionize privacy compliance in software development. By combining AI-powered code analysis with automated fix generation, we can make the web safer and more privacy-respecting for everyone.

**Privacy is not optional. Make it automatic.**
