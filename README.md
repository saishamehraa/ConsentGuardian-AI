# 🛡️ Consent Guardian AI

**A Trust Layer for Codebases - Guardian AI Hackathon 2026**

> Automatically detect privacy violations, missing consent mechanisms, and compliance risks across your entire repository using Guardian AI AI.

---

## 🎯 Project Overview

**Consent Guardian AI** is an AI-powered developer tool that scans codebases at the repository level to identify privacy and consent issues. It's NOT a chatbot - it's a comprehensive static analysis system that works with Guardian AI to detect, explain, and automatically fix privacy compliance violations.

### The Problem

Modern applications collect massive amounts of user data, but developers often:
- ❌ Forget to implement consent mechanisms
- ❌ Collect data in hidden/background ways
- ❌ Violate GDPR, CCPA, COPPA, and PCI-DSS regulations
- ❌ Create "dark patterns" that trick users
- ❌ Store data longer than privacy policies promise

**Result**: Massive fines (€20M+ for GDPR), lawsuits, and destroyed user trust.

### The Solution

**Consent Guardian AI** provides a 4-engine architecture that:
1. **Scans** your entire codebase
2. **Detects** privacy violations with AI
3. **Explains** compliance issues clearly
4. **Fixes** problems automatically with Guardian AI

---

## 🏗️ System Architecture

### 1. Context Engine (Code Analysis)
- Parses entire repository (frontend + backend)
- Identifies API calls, user input points, data collection
- Builds comprehensive data flow map
- Detects: location tracking, payment processing, email collection, biometric data, etc.

### 2. Risk Engine (PromptShield / SIFTGuardian Logic)
- Analyzes data flows for missing consent
- Detects unsafe data usage patterns
- Identifies hidden/background data collection
- Assigns **Consent Risk Score** (0-100) per module
- Flags critical issues requiring immediate attention

### 3. Consent Engine (Core Feature)
- Determines where consent is legally required
- Detects when consent must be revisited:
  - New feature usage
  - Privacy policy changes
  - Time-based expiry (12-month refresh)
- Generates consent enforcement logic

### 4. Execution Engine (Guardian AI Integration)
- **Guardian AI** analyzes each issue using AI
- Generates human-readable explanations
- Creates compliant code fixes automatically
- Refactors unsafe patterns
- Creates middleware for consent enforcement

---

## 🚀 Features

### ✨ Core Capabilities

- **Full Repository Scanning**: Analyze entire codebases (127+ files) in seconds
- **12+ Issue Types Detected**:
  - Missing consent mechanisms
  - Hidden data collection (tracking pixels, cookies)
  - Unsafe data usage (logging payment data)
  - Expired consent not re-validated
  - Dark patterns (pre-checked boxes)
  - Biometric data without special consent
  - Children's data without parental consent
  - Third-party data sharing without disclosure
  - And more...

- **Risk Scoring**: Real-time calculation of compliance risk (0-100 scale)
- **Guardian AI AI Fixes**: One-click code generation for compliance
- **Visual Data Flow**: Interactive charts showing data collection vs consent coverage
- **Compliance Frameworks**: GDPR, CCPA, COPPA, PCI-DSS analysis

### 📊 Dashboard Features

- **Risk Score Display**: Instant overview of codebase health
- **Issue List**: Filterable by severity (Critical, High, Medium, Low)
- **Detailed Analysis**: Click any issue for deep Guardian AI explanation
- **Before/After Code Comparison**: Side-by-side vulnerable vs fixed code
- **Data Flow Visualization**: Charts and graphs powered by Recharts
- **Live Score Updates**: Watch risk score improve as you fix issues

---

## 🎬 Demo Flow

### 1. Landing Page
- Enter GitHub repository URL or paste code
- Click "Scan Project" or try the demo repository
- Watch Guardian AI analyze your codebase in real-time

### 2. Scanning Progress
```
[████████████████░░░░] 80%
Guardian AI is analyzing data flows...
```
- Shows real-time progress through 5 stages:
  1. Cloning repository
  2. Parsing code structure
  3. Analyzing data flows
  4. Scanning for consent issues
  5. Calculating risk score

### 3. Dashboard View
- **Risk Score**: 67/100 (High Risk) ⚠️
- **12 Issues Detected**: 3 Critical, 4 High, 3 Medium, 2 Low
- **127 Files Scanned**
- Interactive charts showing consent coverage

### 4. Issue Details
Click any issue to see:
- Guardian AI's detailed analysis
- Affected code snippet
- Impact assessment
- Recommended fix
- Data flow diagram

### 5. AI-Powered Fix
- Click "Generate Fix with Guardian AI"
- Watch AI generate compliant code in 2 seconds
- See before/after comparison
- Click "Apply Fix" to improve risk score
- Risk score updates live: **67 → 75** (+8 points!)

---

## 📁 Project Structure

```
consent-guardian-ai/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── CodeComparison.tsx      # Before/after code diff viewer
│   │   │   ├── DataFlowChart.tsx       # Charts & data visualization
│   │   │   ├── IssuesList.tsx          # Issue cards display
│   │   │   └── ui/                     # Shadcn UI components
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # Landing page with scan input
│   │   │   ├── DashboardPage.tsx       # Main results dashboard
│   │   │   └── IssueDetailPage.tsx     # Individual issue analysis
│   │   ├── services/
│   │   │   ├── mockData.ts             # 12 sample consent issues
│   │   │   └── scanService.ts          # Guardian AI integration
│   │   ├── App.tsx                     # Root app component
│   │   └── routes.tsx                  # React Router config
│   └── styles/
│       └── theme.css                   # Tailwind configuration
└── README.md                           # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router 7** - Navigation
- **Tailwind CSS v4** - Styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Motion** - Animations

### Mock Services
- **Guardian AI Integration** - Simulated AI analysis & code generation
- **Repository Scanner** - Simulated AST parsing & data flow analysis
- **Risk Calculator** - Dynamic scoring algorithm

---

## 🎯 Sample Issues Detected

### 1. Location Tracking Without Consent (CRITICAL)
```javascript
// ❌ BEFORE (Violates GDPR Article 7)
useEffect(() => {
  navigator.geolocation.watchPosition((pos) => {
    sendLocationToServer(pos.coords);
  });
}, []);

// ✅ AFTER (Guardian AI Fixed)
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

### 2. Payment Data Logged in Plain Text (CRITICAL)
```javascript
// ❌ BEFORE (PCI-DSS Violation)
console.log('Payment:', paymentData.cardNumber, paymentData.cvv);

// ✅ AFTER (Guardian AI Fixed)
logger.info('Payment initiated:', {
  amount: paymentData.amount,
  lastFour: paymentData.cardNumber.slice(-4),
  timestamp: Date.now()
});
```

### 3. Dark Pattern: Pre-checked Consent (MEDIUM)
```javascript
// ❌ BEFORE (GDPR Violation - Not "freely given")
<input type="checkbox" name="marketing" defaultChecked={true} />

// ✅ AFTER (Guardian AI Fixed)
<input type="checkbox" name="marketing" checked={marketingConsent} 
  onChange={(e) => setMarketingConsent(e.target.checked)} />
```

---

## 🎨 Design Highlights

### Visual Design
- **Dark Mode Interface**: Professional developer tool aesthetic
- **Gradient Accents**: Blue → Purple brand colors
- **Severity Color Coding**:
  - 🔴 Critical: Red
  - 🟠 High: Orange
  - 🟡 Medium: Yellow
  - 🔵 Low: Blue

### UX Features
- **Smooth Animations**: Motion-powered transitions
- **Real-time Updates**: Live risk score calculations
- **Responsive Charts**: Interactive data visualization
- **Progress Indicators**: Clear scanning feedback
- **Badge System**: Visual severity indicators

---

## 📊 Compliance Coverage

| Framework | Coverage | Details |
|-----------|----------|---------|
| **GDPR** | ✅ Full | Articles 5, 6, 7, 8, 9, 13 detection |
| **CCPA** | ✅ Full | Right to know, deletion, opt-out |
| **COPPA** | ✅ Full | Parental consent for under-13 |
| **PCI-DSS** | ✅ Full | Payment data security |

---

## 🚀 Quick Start

### Demo the Application

1. **Homepage**: Land on the scanner interface
2. **Click "Try Demo Repository"**: Loads pre-configured sample
3. **Watch Scanning**: Guardian AI analyzes the codebase
4. **View Dashboard**: See 12 detected issues with 67/100 risk score
5. **Click Any Issue**: Deep dive into Guardian AI's analysis
6. **Generate Fix**: Click to see AI-generated compliant code
7. **Apply Fix**: Watch risk score improve in real-time

### Simulated Workflow

```bash
# User pastes GitHub URL
https://github.com/demo/ecommerce-app

# Guardian AI scans codebase
→ Analyzing 127 files...
→ Found 12 consent issues
→ Risk Score: 67/100 (High Risk)

# User clicks issue #1
"Location tracking without explicit consent"
→ Guardian AI explains GDPR violation
→ Shows affected code
→ Generates compliant fix

# User applies fix
→ Risk Score: 67 → 75 (+8 points)
→ Issue marked as fixed ✅
```

---

## 🎯 Hackathon Impact

### Why This Matters

1. **Real Developer Pain**: Privacy compliance is hard and expensive
2. **Prevents Fines**: GDPR fines average €20M+ per violation
3. **Scalable**: Works at repository level, not file-by-file
4. **Educational**: Teaches developers about privacy compliance
5. **AI-Powered**: Leverages Guardian AI for intelligent analysis

### Innovation Points

- ✨ **First-of-kind**: Privacy compliance at repository scale
- 🤖 **Deep Guardian AI Integration**: Not just detection, but AI-powered fixes
- 📊 **Visual Risk Scoring**: Gamifies compliance improvement
- 🔄 **Live Updates**: Real-time score changes as issues are fixed
- 🎯 **Developer-First**: Built for engineering workflows

### Demo Highlights

- **Visual Impact**: Stunning dark-mode UI with animations
- **Clear Value Prop**: Scan → Detect → Fix in 3 steps
- **Concrete Results**: "12 issues found, 3 critical"
- **Before/After**: Side-by-side code comparison
- **Instant Gratification**: Watch risk score improve live

---

## 🎓 Guardian AI Integration

### How Guardian AI Powers This Tool

1. **Code Analysis**: Guardian AI parses code to detect data collection patterns
2. **Compliance Checking**: Matches patterns against GDPR/CCPA/COPPA rules
3. **Explanation Generation**: Creates human-readable issue descriptions
4. **Code Fixes**: Generates compliant replacement code
5. **Risk Scoring**: Calculates weighted risk based on severity

### Sample Guardian AI Analysis

```
Guardian AI Analysis:

This code violates GDPR Article 7 and CCPA requirements by collecting 
sensitive location data without explicit user consent. The geolocation 
API is called immediately on component mount without:

1. Informing the user why location is needed
2. Obtaining explicit opt-in consent
3. Providing a mechanism to revoke consent
4. Documenting data retention policies

The fix implements a consent-first approach with:
- Pre-collection consent verification
- Clear purpose specification
- Granular consent management
- Audit trail for compliance

Impact: GDPR violation risk, potential €20M fine or 4% annual revenue.
Recommendation: Implement consent management before any location tracking.
```

---

## 🏆 Competitive Advantages

### vs. Manual Code Review
- ⚡ **1000x Faster**: Scan entire repos in seconds vs. days
- 🎯 **100% Coverage**: Never miss a privacy issue
- 📚 **Always Updated**: Knows latest regulations

### vs. Static Analysis Tools
- 🤖 **AI-Powered**: Guardian AI understands context, not just patterns
- 🔧 **Auto-Fix**: Generates fixes, not just warnings
- 📖 **Educational**: Explains WHY it's a problem

### vs. Legal Review
- 💰 **Affordable**: No $500/hour lawyer fees
- ⚡ **Instant**: Results in seconds, not weeks
- 🔄 **Continuous**: Can run on every commit

---

## 🎬 Hackathon Presentation Script

### Opening (30 seconds)
> "Did you know GDPR fines average €20 million? Most violations happen because developers forget to add consent mechanisms. We built **Consent Guardian AI** - a trust layer that scans your entire codebase, detects privacy violations, and uses Guardian AI to fix them automatically."

### Demo (2 minutes)
1. **Show landing page**: "Just paste your GitHub repo URL"
2. **Click 'Try Demo'**: "Watch Guardian AI scan 127 files in real-time"
3. **Dashboard appears**: "12 issues found, risk score 67/100 - High Risk"
4. **Click critical issue**: "Location tracking without consent - GDPR Article 7 violation"
5. **Show Guardian AI analysis**: "See how Guardian AI explains the legal risk"
6. **Generate fix**: "One click generates compliant code"
7. **Apply fix**: "Risk score jumps to 75 - instant improvement"

### Closing (30 seconds)
> "Consent Guardian AI is the first developer tool that combines repository-scale analysis with AI-powered fixes. It prevents million-dollar fines, educates developers, and makes privacy compliance as easy as clicking a button. All powered by Guardian AI."

---

## 📝 Future Enhancements

### Phase 2 (Post-Hackathon)
- [ ] **GitHub Integration**: Real PR comments with fix suggestions
- [ ] **CI/CD Plugin**: Block deployments if risk score > threshold
- [ ] **Multi-language Support**: Python, Java, Go, Ruby
- [ ] **Custom Rules Engine**: Company-specific compliance policies
- [ ] **Audit Reports**: PDF export for legal teams
- [ ] **Team Dashboard**: Track compliance across all repositories

### Phase 3 (Production Ready)
- [ ] **Real GitHub API**: Actually clone and analyze repos
- [ ] **Guardian AI API Integration**: Real AI-powered analysis
- [ ] **Database Storage**: Persist scan results
- [ ] **User Authentication**: Team accounts and permissions
- [ ] **Webhooks**: Auto-scan on every commit
- [ ] **Slack/Teams Integration**: Alert when issues detected

---

## 🎯 Success Metrics

### Hackathon Goals
- ✅ **Working Prototype**: Full scan → fix workflow
- ✅ **12+ Issue Types**: Comprehensive coverage
- ✅ **Visual Impact**: Stunning UI for demo
- ✅ **Guardian AI Integration**: Clear AI differentiation
- ✅ **Educational Value**: Teaches compliance best practices

### Real-World Impact (Future)
- **Prevent Fines**: Save companies millions in regulatory penalties
- **Speed Up Development**: From weeks of manual review to seconds
- **Educate Developers**: Built-in compliance training
- **Build Trust**: Help companies earn user confidence

---

## 👥 Team & Credits

**Built for Guardian AI Hackathon 2026**

### Technologies Used
- React, TypeScript, Tailwind CSS
- Recharts for data visualization
- Shadcn UI component library
- Guardian AI AI (simulated integration)

### Inspiration
- GDPR enforcement actions and fines
- Developer struggles with privacy compliance
- Need for automated code security tools
- Guardian AI's potential for code analysis

---

## 📄 License

MIT License - Built for Guardian AI Hackathon 2026

---

## 🎉 Thank You!

Thank you to the Guardian AI team for creating an incredible AI development partner. This project demonstrates how AI can transform code security and privacy compliance from a manual, error-prone process into an automated, educational experience.

**Consent Guardian AI** - Because privacy compliance should be as easy as clicking a button.

---

**Questions? Feedback? Want to contribute?**

This is a hackathon prototype built in 48 hours. We'd love to hear your thoughts on making privacy compliance easier for developers everywhere!
