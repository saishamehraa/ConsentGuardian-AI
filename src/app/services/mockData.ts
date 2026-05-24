//src/app/services/mockData.ts
// Mock data for demo - simulates a scanned repository with consent issues

export interface DataCollectionPoint {
  id: string;
  file: string;
  line: number;
  type: 'email' | 'location' | 'payment' | 'personal' | 'tracking' | 'biometric';
  dataType: string;
  hasConsent: boolean;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface ConsentIssue {
  id: string;
  title: string;
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'missing_consent' | 'unsafe_usage' | 'hidden_collection' | 'expired_consent' | 'dark_pattern' | 'contextual_shift';
  description: string;
  affectedCode: string;
  fixedCode?: string;
  explanation: string;
  impact: string;
  recommendation: string;
  dataFlow: string[];
  fixed: boolean;
}

export interface ScanResult {
  projectName: string;
  scannedAt: Date;
  totalFiles: number;
  totalIssues: number;
  riskScore: number;
  issues: ConsentIssue[];
  dataCollectionPoints: DataCollectionPoint[];
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Sample repository issues
export const mockScanResult: ScanResult = {
  projectName: "TEST_LIVE_DATA",
  scannedAt: new Date(),
  totalFiles: 127,
  totalIssues: 13, // Updated to 13
  riskScore: 61,   // Lowered starting score slightly to make the fixes feel more impactful
  stats: {
    critical: 3,
    high: 5,       // Updated to 5 (added the new contextual issue)
    medium: 3,
    low: 2,
  },
  dataCollectionPoints: [
    {
      id: 'dc1',
      file: 'src/api/user.js',
      line: 42,
      type: 'email',
      dataType: 'User email address',
      hasConsent: false,
      riskLevel: 'high',
    },
    {
      id: 'dc2',
      file: 'src/components/LocationTracker.tsx',
      line: 18,
      type: 'location',
      dataType: 'GPS coordinates',
      hasConsent: false,
      riskLevel: 'critical',
    },
    {
      id: 'dc3',
      file: 'src/api/checkout.js',
      line: 89,
      type: 'payment',
      dataType: 'Credit card info',
      hasConsent: true,
      riskLevel: 'medium',
    },
  ],
  issues: [
    {
      id: '1',
      title: 'Location tracking without explicit user consent',
      file: 'src/components/LocationTracker.tsx',
      line: 18,
      severity: 'critical',
      category: 'missing_consent',
      description: 'Background location tracking is initiated without explicit user consent or notification',
      affectedCode: `// src/components/LocationTracker.tsx
useEffect(() => {
  // ISSUE: No consent check before tracking
  navigator.geolocation.watchPosition(
    (position) => {
      sendLocationToServer({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now()
      });
    },
    (error) => console.error(error),
    { enableHighAccuracy: true }
  );
}, []);`,
      fixedCode: `// src/components/LocationTracker.tsx
useEffect(() => {
  // AI-FIXED: Added consent check before tracking
  const consentGranted = await checkUserConsent('location_tracking');
  
  if (!consentGranted) {
    const granted = await requestConsent({
      type: 'location_tracking',
      purpose: 'To provide location-based recommendations',
      dataRetention: '30 days',
      sharingPolicy: 'Not shared with third parties'
    });
    
    if (!granted) return;
  }
  
  navigator.geolocation.watchPosition(
    (position) => {
      sendLocationToServer({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now()
      });
    },
    (error) => console.error(error),
    { enableHighAccuracy: true }
  );
}, []);`,
      explanation: `Guardian AI Analysis:

This code violates GDPR Article 7 and CCPA requirements by collecting sensitive location data without explicit user consent. The geolocation API is called immediately on component mount without:

1. Informing the user why location is needed
2. Obtaining explicit opt-in consent
3. Providing a mechanism to revoke consent
4. Documenting data retention policies

The fix implements a consent-first approach with:
- Pre-collection consent verification
- Clear purpose specification
- Granular consent management
- Audit trail for compliance`,
      impact: 'GDPR violation risk, potential €20M fine or 4% annual revenue. User trust damage.',
      recommendation: 'Implement consent management before any location tracking. Add consent UI modal explaining purpose and allowing opt-out.',
      dataFlow: ['User Browser', 'LocationTracker Component', 'sendLocationToServer()', 'Backend /api/location', 'Analytics Database'],
      fixed: false,
    },
    {
      id: '2',
      title: 'Email collection without consent checkbox',
      file: 'src/api/user.js',
      line: 42,
      severity: 'high',
      category: 'missing_consent',
      description: 'User email is stored and used for marketing without explicit opt-in',
      affectedCode: `// src/api/user.js
async function createUser(userData) {
  const user = await db.users.create({
    email: userData.email,
    name: userData.name,
    marketingOptIn: true  // ISSUE: Forced opt-in
  });
  
  // Automatically subscribe to newsletter
  await emailService.subscribe(user.email, 'weekly-deals');
  
  return user;
}`,
      fixedCode: `// src/api/user.js
async function createUser(userData) {
  // AI-FIXED: Respect user's explicit marketing consent
  const user = await db.users.create({
    email: userData.email,
    name: userData.name,
    marketingOptIn: userData.marketingConsent || false,
    consentTimestamp: userData.marketingConsent ? new Date() : null,
    consentVersion: 'v1.2'
  });
  
  // Only subscribe if user explicitly consented
  if (userData.marketingConsent === true) {
    await emailService.subscribe(user.email, 'weekly-deals', {
      consentProof: user.consentTimestamp,
      allowUnsubscribe: true
    });
  }
  
  return user;
}`,
      explanation: `Guardian AI Analysis:

Pre-checked consent boxes and forced marketing opt-ins violate GDPR's "freely given" consent principle. This code:

1. Forces marketingOptIn to true regardless of user choice
2. Auto-subscribes users to marketing emails
3. Lacks consent timestamp for audit trail
4. No consent version tracking

The fix ensures:
- Opt-in is explicitly provided by user
- Consent is timestamped and versioned
- Marketing actions only occur with consent
- Compliance with GDPR Article 4(11)`,
      impact: 'Direct GDPR violation. Fines up to €10M. Email service provider may suspend account.',
      recommendation: 'Add explicit marketing consent checkbox in signup form. Store consent metadata for audit purposes.',
      dataFlow: ['Signup Form', 'POST /api/users', 'Database', 'Email Marketing Service'],
      fixed: false,
    },
    {
      id: '3',
      title: 'Hidden tracking pixel without disclosure',
      file: 'src/components/ProductPage.tsx',
      line: 156,
      severity: 'high',
      category: 'hidden_collection',
      description: 'Third-party tracking pixel loads without user notification or consent',
      affectedCode: `// src/components/ProductPage.tsx
export function ProductPage() {
  useEffect(() => {
    // ISSUE: Hidden third-party tracker
    const img = document.createElement('img');
    img.src = 'https://tracker.adnetwork.com/pixel?user=' + userId;
    img.style.display = 'none';
    document.body.appendChild(img);
  }, [userId]);
  
  return <div>...</div>;
}`,
      fixedCode: `// src/components/ProductPage.tsx
export function ProductPage() {
  useEffect(() => {
    // AI-FIXED: Load tracker only with user consent
    const loadTrackingPixel = async () => {
      const analyticsConsent = await checkUserConsent('analytics_tracking');
      
      if (!analyticsConsent) {
        // Show consent banner for analytics
        return;
      }
      
      // Load pixel only after consent
      const img = document.createElement('img');
      img.src = 'https://tracker.adnetwork.com/pixel?user=' + userId;
      img.style.display = 'none';
      document.body.appendChild(img);
      
      // Log consent for audit
      logConsentUsage('analytics_tracking', 'pixel_loaded');
    };
    
    loadTrackingPixel();
  }, [userId]);
  
  return <div>...</div>;
}`,
      explanation: `Guardian AI Analysis:

This is a "dark pattern" - hidden data collection that users cannot see or control. Issues:

1. Third-party tracker loads invisibly
2. No user notification or consent
3. PII (userId) shared with external service
4. No cookie/tracking disclosure

This violates:
- GDPR Article 6 (lawful basis)
- ePrivacy Directive
- CCPA disclosure requirements

The fix implements:
- Consent-gated tracking
- Transparent user notification
- Audit logging for compliance`,
      impact: 'Privacy violation. Regulatory fines. Ad network may face enforcement action.',
      recommendation: 'Implement cookie consent banner. Only load third-party scripts after user approval.',
      dataFlow: ['Product Page', 'Hidden IMG Element', 'tracker.adnetwork.com', 'Third-party Analytics'],
      fixed: false,
    },
    {
      id: '4',
      title: 'Payment data logged in plain text',
      file: 'src/api/payment.js',
      line: 67,
      severity: 'critical',
      category: 'unsafe_usage',
      description: 'Sensitive payment information is logged without encryption',
      affectedCode: `// src/api/payment.js
async function processPayment(paymentData) {
  // ISSUE: Logging sensitive data
  console.log('Processing payment:', paymentData);
  logger.info('Payment details:', {
    cardNumber: paymentData.cardNumber,
    cvv: paymentData.cvv,
    amount: paymentData.amount
  });
  
  return await stripeAPI.charge(paymentData);
}`,
      fixedCode: `// src/api/payment.js
async function processPayment(paymentData) {
  // AI-FIXED: Never log sensitive payment data
  const sanitizedLog = {
    amount: paymentData.amount,
    currency: paymentData.currency,
    lastFour: paymentData.cardNumber.slice(-4),
    timestamp: Date.now()
  };
  
  logger.info('Payment initiated:', sanitizedLog);
  
  // Use tokenization - never handle raw card data
  const token = await stripeAPI.createToken(paymentData);
  return await stripeAPI.charge({ token, amount: paymentData.amount });
}`,
      explanation: `Guardian AI Analysis:

Logging full payment card data violates PCI-DSS standards and creates massive security risk. Issues:

1. Plain text card numbers in logs
2. CVV stored/logged (PCI-DSS violation)
3. Logs may be shipped to third-party services
4. No data encryption or tokenization

This is a **critical security vulnerability** that can lead to:
- PCI-DSS compliance failure
- Card data breach
- Loss of payment processing privileges
- Legal liability for fraud

The fix implements PCI-DSS best practices:
- Never log sensitive cardholder data
- Use tokenization for card processing
- Log only non-sensitive transaction metadata`,
      impact: 'PCI-DSS violation. Immediate payment processor suspension risk. Potential fraud liability.',
      recommendation: 'Remove all payment data logging. Implement tokenization. Conduct security audit.',
      dataFlow: ['Checkout Form', 'Payment API', 'Application Logs', 'Log Aggregation Service'],
      fixed: false,
    },
    {
      id: '5',
      title: 'Cookie set without consent banner',
      file: 'src/utils/analytics.js',
      line: 23,
      severity: 'high',
      category: 'missing_consent',
      description: 'Non-essential cookies are set before user consent is obtained',
      affectedCode: `// src/utils/analytics.js
export function initAnalytics() {
  // ISSUE: Setting cookies before consent
  document.cookie = 'analytics_id=' + generateId() + '; max-age=31536000';
  document.cookie = 'user_segment=returning; max-age=31536000';
  
  window.gtag('config', 'GA-XXXXX', {
    'user_id': getUserId()
  });
}`,
      fixedCode: `// src/utils/analytics.js
export async function initAnalytics() {
  // AI-FIXED: Check cookie consent before setting
  const cookieConsent = await getCookieConsent();
  
  if (!cookieConsent.analytics) {
    // Show cookie banner if not decided
    if (!cookieConsent.decided) {
      showCookieBanner();
    }
    return; // Don't initialize without consent
  }
  
  // Set cookies only after consent
  document.cookie = 'analytics_id=' + generateId() + 
    '; max-age=31536000; SameSite=Strict';
  document.cookie = 'user_segment=returning; max-age=31536000; SameSite=Strict';
  
  window.gtag('config', 'GA-XXXXX', {
    'user_id': getUserId(),
    'anonymize_ip': true
  });
  
  // Record consent grant
  logConsentAction('analytics_cookies_set', cookieConsent.timestamp);
}`,
      explanation: `Guardian AI Analysis:

ePrivacy Directive requires consent before setting non-essential cookies. This code:

1. Sets tracking cookies immediately
2. No consent banner or user choice
3. Cookies set for 1 year without review
4. No SameSite protection

The fix implements:
- Consent-first cookie approach
- Cookie banner for user choice
- SameSite security attribute
- IP anonymization for privacy
- Consent action logging

Complies with GDPR Article 5 and ePrivacy Directive requirements.`,
      impact: 'ePrivacy violation in EU. Cookie compliance fines. Ad tracking may be blocked.',
      recommendation: 'Implement cookie consent management system. Categorize essential vs non-essential cookies.',
      dataFlow: ['App Init', 'Browser Cookies', 'Google Analytics', 'Third-party Analytics'],
      fixed: false,
    },
    {
      id: '6',
      title: 'User data shared with third-party without notice',
      file: 'src/api/recommendations.js',
      line: 91,
      severity: 'critical',
      category: 'hidden_collection',
      description: 'User behavior data is sent to external API without disclosure in privacy policy',
      affectedCode: `// src/api/recommendations.js
async function fetchRecommendations(userId) {
  const userHistory = await getUserPurchaseHistory(userId);
  
  // ISSUE: Sending user data to third-party
  const response = await fetch('https://ml-api.thirdparty.com/recommend', {
    method: 'POST',
    body: JSON.stringify({
      userId: userId,
      purchases: userHistory,
      email: await getUserEmail(userId),
      browsing: getBrowsingHistory(userId)
    })
  });
  
  return response.json();
}`,
      fixedCode: `// src/api/recommendations.js
async function fetchRecommendations(userId) {
  // AI-FIXED: Check data sharing consent
  const dataSharingConsent = await checkUserConsent('third_party_recommendations');
  
  if (!dataSharingConsent) {
    // Fall back to local recommendations
    return getLocalRecommendations(userId);
  }
  
  const userHistory = await getUserPurchaseHistory(userId);
  
  // Anonymize data before sharing
  const response = await fetch('https://ml-api.thirdparty.com/recommend', {
    method: 'POST',
    headers: {
      'X-Consent-Token': dataSharingConsent.token
    },
    body: JSON.stringify({
      // Use hashed ID instead of real userId
      anonymousId: hashUserId(userId),
      // Send only necessary aggregated data
      purchaseCategories: aggregateCategories(userHistory),
      // Never send email or PII
      preferences: getUserPreferences(userId)
    })
  });
  
  return response.json();
}`,
      explanation: `Guardian AI Analysis:

Undisclosed third-party data sharing is a serious privacy violation. Issues:

1. User PII (email, userId) sent to external service
2. No user notification or consent
3. Full purchase history exposed
4. Browsing data shared without anonymization

Violates:
- GDPR Article 13 (transparency)
- CCPA right to know who data is shared with
- FTC deceptive practices guidelines

The fix implements:
- Explicit consent for data sharing
- Data minimization and anonymization
- Local fallback option
- Consent token validation

This is the type of practice that leads to major privacy scandals and regulatory enforcement.`,
      impact: 'Major GDPR/CCPA violation. Class action lawsuit risk. Brand reputation damage.',
      recommendation: 'Update privacy policy to disclose third-party sharing. Obtain explicit consent. Minimize data shared.',
      dataFlow: ['User Profile', 'Recommendations API', 'Third-party ML Service', 'External Database'],
      fixed: false,
    },
    {
      id: '7',
      title: 'Expired consent not re-validated',
      file: 'src/middleware/consentCheck.js',
      line: 34,
      severity: 'medium',
      category: 'expired_consent',
      description: 'Consent granted over 12 months ago is still used without re-validation',
      affectedCode: `// src/middleware/consentCheck.js
export function checkConsent(userId, consentType) {
  const consent = getUserConsent(userId, consentType);
  
  // ISSUE: No expiry check
  if (consent && consent.granted) {
    return true;
  }
  
  return false;
}`,
      fixedCode: `// src/middleware/consentCheck.js
export function checkConsent(userId, consentType) {
  const consent = getUserConsent(userId, consentType);
  
  if (!consent || !consent.granted) {
    return false;
  }
  
  // AI-FIXED: Check consent expiry
  const CONSENT_VALIDITY_MONTHS = 12;
  const consentAge = Date.now() - new Date(consent.timestamp).getTime();
  const monthsOld = consentAge / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsOld > CONSENT_VALIDITY_MONTHS) {
    // Consent expired - require re-validation
    markConsentExpired(userId, consentType);
    requestConsentRenewal(userId, consentType);
    return false;
  }
  
  // Check if privacy policy was updated since consent
  if (consent.policyVersion !== getCurrentPolicyVersion()) {
    requestConsentRenewal(userId, consentType, 'policy_updated');
    return false;
  }
  
  return true;
}`,
      explanation: `Guardian AI Analysis:

GDPR requires that consent be "current" and renewed periodically. This implementation:

1. Never expires consent
2. Doesn't track consent age
3. No mechanism for policy change notification

Best practices require:
- Consent expiry (typically 12-24 months)
- Re-consent when privacy policy changes
- Notification of consent expiration

The fix adds:
- Time-based consent expiry
- Policy version tracking
- Automatic re-consent requests
- Audit trail for renewals`,
      impact: 'Consent may not be legally valid. Regulatory audit risk.',
      recommendation: 'Implement consent expiry and renewal workflow. Track policy version changes.',
      dataFlow: ['Consent Check', 'User Consent Database', 'Consent Management System'],
      fixed: false,
    },
    {
      id: '8',
      title: 'No consent withdrawal mechanism',
      file: 'src/pages/Settings.tsx',
      line: 78,
      severity: 'medium',
      category: 'missing_consent',
      description: 'User settings page lacks ability to withdraw previously granted consent',
      affectedCode: `// src/pages/Settings.tsx
export function Settings() {
  return (
    <div>
      <h1>Account Settings</h1>
      {/* ISSUE: No consent management UI */}
      <section>
        <h2>Profile</h2>
        <input name="email" />
        <input name="name" />
      </section>
      <section>
        <h2>Notifications</h2>
        <input type="checkbox" name="emailNotif" />
      </section>
    </div>
  );
}`,
      fixedCode: `// src/pages/Settings.tsx
export function Settings() {
  const [consents, setConsents] = useState([]);
  
  useEffect(() => {
    loadUserConsents().then(setConsents);
  }, []);
  
  const handleConsentToggle = async (consentType, granted) => {
    await updateConsent(consentType, granted);
    // Immediately stop any active data collection
    if (!granted) {
      await stopDataCollection(consentType);
    }
  };
  
  return (
    <div>
      <h1>Account Settings</h1>
      <section>
        <h2>Profile</h2>
        <input name="email" />
        <input name="name" />
      </section>
      
      {/* AI-FIXED: Added consent management section */}
      <section>
        <h2>Privacy & Consent</h2>
        <p>Manage how your data is collected and used</p>
        
        {consents.map(consent => (
          <div key={consent.type}>
            <label>
              <input
                type="checkbox"
                checked={consent.granted}
                onChange={(e) => handleConsentToggle(
                  consent.type, 
                  e.target.checked
                )}
              />
              {consent.description}
            </label>
            <small>
              Granted: {consent.timestamp || 'Never'}
              {consent.granted && (
                <button onClick={() => handleConsentToggle(consent.type, false)}>
                  Withdraw
                </button>
              )}
            </small>
          </div>
        ))}
      </section>
    </div>
  );
}`,
      explanation: `Guardian AI Analysis:

GDPR Article 7(3) mandates: "It shall be as easy to withdraw consent as to give consent."

Missing consent withdrawal violates this principle:

1. No UI to view active consents
2. No mechanism to withdraw consent
3. No immediate effect when withdrawn
4. No user control over data usage

The fix provides:
- Visible list of all consents
- Easy toggle/withdrawal interface
- Immediate data collection stop
- Timestamp transparency

This is a fundamental GDPR requirement that many applications overlook.`,
      impact: 'GDPR Article 7 violation. User complaints. Regulatory enforcement risk.',
      recommendation: 'Add comprehensive consent management dashboard. Allow granular control.',
      dataFlow: ['Settings UI', 'Consent API', 'User Consent Database'],
      fixed: false,
    },
    {
      id: '9',
      title: 'Biometric data collected without special consent',
      file: 'src/features/FaceID.tsx',
      line: 45,
      severity: 'critical',
      category: 'missing_consent',
      description: 'Face recognition uses biometric data requiring special category consent under GDPR',
      affectedCode: `// src/features/FaceID.tsx
export function FaceIDLogin() {
  const handleFaceLogin = async () => {
    // ISSUE: Biometric data needs special consent
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    // Capture and send face data
    const faceData = await captureFaceData(video);
    await sendToFaceRecognitionAPI(faceData);
  };
  
  return <button onClick={handleFaceLogin}>Login with Face</button>;
}`,
      fixedCode: `// src/features/FaceID.tsx
export function FaceIDLogin() {
  const handleFaceLogin = async () => {
    // AI-FIXED: Special consent for biometric data
    const biometricConsent = await checkSpecialCategoryConsent('biometric_face');
    
    if (!biometricConsent) {
      const granted = await requestBiometricConsent({
        type: 'face_recognition',
        purpose: 'User authentication',
        storage: 'Encrypted, device-only',
        retention: 'Until account deletion',
        specialCategory: true, // GDPR Article 9
        riskNotice: 'Biometric data is sensitive personal information'
      });
      
      if (!granted) {
        // Offer alternative login method
        showAlternativeLogin();
        return;
      }
    }
    
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    // Encrypt face data before transmission
    const faceData = await captureFaceData(video);
    const encrypted = await encryptBiometricData(faceData);
    await sendToFaceRecognitionAPI(encrypted);
    
    // Log biometric data access for audit
    logBiometricAccess('face_recognition', 'authentication');
  };
  
  return <button onClick={handleFaceLogin}>Login with Face</button>;
}`,
      explanation: `Guardian AI Analysis:

Biometric data is a "special category" under GDPR Article 9, requiring explicit consent and heightened protection.

Issues:
1. No special category consent notice
2. No encryption of biometric data
3. No risk notification to user
4. Missing data protection measures

Biometric data (fingerprints, face recognition, iris scans) requires:
- Explicit opt-in consent
- Clear risk disclosure
- Strong encryption
- Strict access controls
- Regular security audits

This is one of the most sensitive data types. Breaches can lead to:
- Irreversible identity theft
- Severe regulatory penalties
- Permanent user harm (can't change biometrics)

The fix implements GDPR Article 9 protections with special consent workflow and encryption.`,
      impact: 'GDPR Article 9 violation. Up to €20M fine. Biometric data breach risk.',
      recommendation: 'Implement special category consent. Encrypt all biometric data. Consider device-only storage.',
      dataFlow: ['Camera Input', 'FaceID Component', 'Face Recognition API', 'Biometric Database'],
      fixed: false,
    },
    {
      id: '10',
      title: 'Children\'s data collected without parental consent',
      file: 'src/api/signup.js',
      line: 156,
      severity: 'high',
      category: 'missing_consent',
      description: 'No age verification or parental consent for users under 16 (GDPR) / 13 (COPPA)',
      affectedCode: `// src/api/signup.js
export async function registerUser(formData) {
  // ISSUE: No age verification
  const user = await db.users.create({
    email: formData.email,
    username: formData.username,
    password: hashPassword(formData.password)
  });
  
  return user;
}`,
      fixedCode: `// src/api/signup.js
export async function registerUser(formData) {
  // AI-FIXED: Age verification and parental consent
  const birthDate = new Date(formData.birthDate);
  const age = calculateAge(birthDate);
  
  // GDPR: Under 16 needs parental consent (varies by country)
  // COPPA: Under 13 needs parental consent (US)
  const minAge = getMinimumAgeForRegion(formData.country);
  
  if (age < minAge) {
    // Require parental consent
    const parentalConsent = await requestParentalConsent({
      childEmail: formData.email,
      childAge: age,
      parentEmail: formData.parentEmail,
      verificationMethod: 'email_verification' // or credit card, ID upload
    });
    
    if (!parentalConsent.verified) {
      throw new Error('Parental consent required for users under ' + minAge);
    }
    
    // Create account with parental oversight
    const user = await db.users.create({
      email: formData.email,
      username: formData.username,
      password: hashPassword(formData.password),
      birthDate: formData.birthDate,
      isMinor: true,
      parentalConsentId: parentalConsent.id,
      parentalConsentDate: new Date(),
      dataCollectionRestricted: true // Limited data collection for minors
    });
    
    return user;
  }
  
  // Adult user - standard registration
  const user = await db.users.create({
    email: formData.email,
    username: formData.username,
    password: hashPassword(formData.password),
    birthDate: formData.birthDate,
    isMinor: false
  });
  
  return user;
}`,
      explanation: `Guardian AI Analysis:

Children's data has special legal protections:

**GDPR (EU)**: Article 8 requires parental consent for users under 16 (or lower age set by member state)
**COPPA (US)**: Requires parental consent for children under 13

Issues with original code:
1. No age collection or verification
2. No parental consent mechanism
3. Same data collection for all ages
4. No age-appropriate privacy controls

Legal requirements:
- Verifiable parental consent
- Age-appropriate privacy notices
- Limited data collection for minors
- Parental access to child's data

Penalties for violations:
- COPPA: Up to $46,517 per violation
- GDPR: Standard penalties apply
- FTC enforcement actions

The fix implements age gates, parental consent workflows, and restricted data collection for minors.`,
      impact: 'COPPA/GDPR violation for children. FTC enforcement. Potential service shutdown.',
      recommendation: 'Add age verification. Implement parental consent system. Restrict data collection for minors.',
      dataFlow: ['Signup Form', 'User Registration API', 'Parental Consent Service', 'User Database'],
      fixed: false,
    },
    {
      id: '11',
      title: 'Dark pattern: Pre-selected consent checkboxes',
      file: 'src/components/SignupForm.tsx',
      line: 89,
      severity: 'medium',
      category: 'dark_pattern',
      description: 'Consent checkboxes are pre-checked, violating "freely given" GDPR principle',
      affectedCode: `// src/components/SignupForm.tsx
export function SignupForm() {
  return (
    <form>
      <input name="email" />
      <input name="password" />
      
      {/* ISSUE: Pre-checked consent - GDPR violation */}
      <label>
        <input 
          type="checkbox" 
          name="marketing" 
          defaultChecked={true}  // ❌ Pre-checked
        />
        I agree to receive marketing emails
      </label>
      
      <label>
        <input 
          type="checkbox" 
          name="dataSharing" 
          defaultChecked={true}  // ❌ Pre-checked
        />
        I agree to share my data with partners
      </label>
      
      <button type="submit">Sign Up</button>
    </form>
  );
}`,
      fixedCode: `// src/components/SignupForm.tsx
export function SignupForm() {
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [dataSharingConsent, setDataSharingConsent] = useState(false);
  
  return (
    <form>
      <input name="email" />
      <input name="password" />
      
      {/* AI-FIXED: Unchecked by default - user must actively opt-in */}
      <label>
        <input 
          type="checkbox" 
          name="marketing" 
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
        />
        I agree to receive marketing emails and promotional offers
      </label>
      <small>You can unsubscribe at any time</small>
      
      <label>
        <input 
          type="checkbox" 
          name="dataSharing" 
          checked={dataSharingConsent}
          onChange={(e) => setDataSharingConsent(e.target.checked)}
        />
        I agree to share my data with trusted partners for personalized recommendations
      </label>
      <small>
        <a href="/privacy#data-sharing">See who we share with</a>
      </small>
      
      {/* Required consent must be separate and clear */}
      <label>
        <input 
          type="checkbox" 
          name="terms" 
          required
        />
        I agree to the <a href="/terms">Terms of Service</a> (required)
      </label>
      
      <button type="submit">Sign Up</button>
    </form>
  );
}`,
      explanation: `Guardian AI Analysis:

Pre-checked consent boxes are a classic "dark pattern" that violates GDPR's "freely given" requirement.

**GDPR Recital 32**: "Silence, pre-ticked boxes or inactivity should not constitute consent."

Issues:
1. Pre-checked = not freely given
2. User may not notice
3. Deceptive UX pattern
4. Consent not explicit

This is specifically called out by regulators:
- €50M Google fine (2019) partially for pre-checked boxes
- Multiple enforcement actions across EU

The fix ensures:
- All non-essential consents default to unchecked
- Clear description of what user is consenting to
- Separate required vs optional consents
- Easy opt-out information

This is a common mistake that's easy to fix but can be costly if ignored.`,
      impact: 'GDPR dark pattern violation. Regulatory fines. User complaints.',
      recommendation: 'Uncheck all non-essential consent boxes by default. Make consent granular and clear.',
      dataFlow: ['Signup Form', 'Form Submission', 'User Preferences Database'],
      fixed: false,
    },
    {
      id: '12',
      title: 'No data retention policy enforcement',
      file: 'src/jobs/dataCleanup.js',
      line: 12,
      severity: 'low',
      category: 'unsafe_usage',
      description: 'User data is retained indefinitely without cleanup based on stated retention policy',
      affectedCode: `// src/jobs/dataCleanup.js
// ISSUE: No data cleanup job
export async function cleanupOldData() {
  // TODO: Implement data retention policy
  console.log('Data cleanup not implemented');
}`,
      fixedCode: `// src/jobs/dataCleanup.js
// AI-FIXED: Implement data retention policy enforcement
export async function cleanupOldData() {
  const retentionPolicies = {
    'analytics_events': 90, // days
    'location_history': 30,
    'search_history': 180,
    'deleted_accounts': 30, // fully purge after 30 days
    'marketing_consent_logs': 1095 // 3 years for audit
  };
  
  for (const [dataType, retentionDays] of Object.entries(retentionPolicies)) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    // Delete data older than retention period
    const deleted = await db[dataType].deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    
    logger.info(\`Deleted \${deleted.count} \${dataType} records older than \${retentionDays} days\`);
    
    // Log for audit trail
    await auditLog.create({
      action: 'data_retention_cleanup',
      dataType,
      recordsDeleted: deleted.count,
      retentionPeriod: retentionDays,
      timestamp: new Date()
    });
  }
  
  // Handle user deletion requests (GDPR "right to erasure")
  await processDeletionRequests();
}

// Run daily
schedule.daily('02:00', cleanupOldData);`,
      explanation: `Guardian AI Analysis:

GDPR Article 5(1)(e) requires data minimization and storage limitation - data should not be kept longer than necessary.

Issues:
1. No automated data cleanup
2. Indefinite data retention
3. No enforcement of stated policies
4. GDPR "right to erasure" not implemented

Privacy policies often promise data deletion after X days/months, but if not enforced:
- Policy is misleading (FTC violation)
- Excessive data retention (GDPR violation)
- Increased breach risk
- Storage costs

The fix implements:
- Automated retention policy enforcement
- Different retention periods by data type
- Audit logging of deletions
- Scheduled cleanup jobs
- Right to erasure support

Best practice: Keep data only as long as needed, then automatically delete.`,
      impact: 'Data minimization violation. Increased breach risk. Storage cost waste.',
      recommendation: 'Implement automated data retention cleanup. Align with privacy policy promises.',
      dataFlow: ['Database', 'Cleanup Job', 'Audit Logs'],
      fixed: false,
    },
    // ---> ADDED: ISSUE 13 - Dynamic Revisit Consent Trigger <---
    {
      id: '13',
      title: 'Dynamic consent required: New feature usage detected',
      file: 'src/features/PremiumAnalytics.tsx',
      line: 22,
      severity: 'high',
      category: 'contextual_shift',
      description: 'Code introduces advanced tracking, but relies on standard analytics consent. Re-consent required.',
      affectedCode: `// src/features/PremiumAnalytics.tsx
export function enablePremiumTracking(userId) {
  // ISSUE: Using standard consent for a new, invasive feature
  const hasConsent = getStandardConsent(userId);
  
  if (hasConsent) {
    // Starting deep behavior profiling
    startDeepProfiling(userId);
    crossReferenceWithDataBrokers(userId);
  }
}`,
      fixedCode: `// src/features/PremiumAnalytics.tsx
export async function enablePremiumTracking(userId) {
  // AI-FIXED: Contextual Re-consent Trigger
  const hasStandardConsent = getStandardConsent(userId);
  const hasPremiumConsent = await checkContextualConsent(userId, 'deep_profiling_v2');
  
  if (hasStandardConsent && !hasPremiumConsent) {
    // Feature behavior changed: Trigger "Revisit Consent" flow
    triggerRevisitConsentModal(userId, {
      reason: "We've added new features that require additional data.",
      requiredScopes: ['deep_profiling', 'third_party_crossref']
    });
    return; // Block execution until re-consented
  }
  
  if (hasPremiumConsent) {
    startDeepProfiling(userId);
    crossReferenceWithDataBrokers(userId);
  }
}`,
      explanation: `Guardian AI Analysis:

🧠 **Contextual Shift Detected**
The repository previously collected standard analytics. This new PR introduces \`startDeepProfiling\` and \`crossReferenceWithDataBrokers\`.

Relying on the original, standard consent for this new behavior violates the GDPR principle of "Specific and Informed Consent."

The fix implements a "Revisit Consent" trigger:
- Blocks the new invasive tracking.
- Prompts the user with a contextual modal explaining exactly *what* changed and *why* they need to re-consent.`,
      impact: 'FTC Deceptive Practices violation. Expanding data collection scope without explicit user re-consent.',
      recommendation: 'Implement a dynamic "Revisit Consent" trigger whenever data collection scope expands.',
      dataFlow: ['PremiumAnalytics', 'Consent Engine', 'Revisit Modal', 'Behavior Profiler'],
      fixed: false,
    }
  ],
};

// Guardian AI mock responses
export const mockGuardianAIExplanations = {
  analyze: (code: string, context: string) => {
    return `Guardian AI Analysis Complete:

Scanning code for consent and privacy compliance issues...

✓ Analyzed ${code.split('\n').length} lines of code
✓ Identified data collection patterns
✓ Checked against GDPR, CCPA, COPPA regulations
✓ Evaluated consent mechanisms
✓ Assessed risk level

Ready to generate fixes and recommendations.`;
  },
  
  fix: (issueId: string) => {
    return `Guardian AI is generating a compliant fix...

✓ Identified root cause
✓ Researched best practices
✓ Generated consent-first implementation
✓ Added audit logging
✓ Included compliance comments

Fix generated successfully. Review the updated code.`;
  }
};