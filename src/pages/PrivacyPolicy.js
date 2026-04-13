import React, { useState, useEffect } from 'react';
import './PrivacyPolicy.css';

const sections = [
  {
    id: 'collection',
    title: '1. Information We Collect',
    content: `AgriTech collects information necessary to provide our platform services to farmers, buyers, vendors, and government officials.

**Personal Information:**
- Mobile number (used for OTP authentication and unique identification)
- Full name, email address, and home address
- Bank account details and IFSC code (for vendor payment tracking)
- ID proof and address proof documents (for government employee verification)
- Marital status and designation

**Farm & Agricultural Data:**
- Field locations (GPS coordinates for weather forecasting)
- Crop types, planting dates, harvest data, and storage information
- Soil data from IoT sensors (moisture, pH, electrical conductivity)
- Harvest quality parameters and quality grading data

**Transaction Data:**
- Marketplace listings, bids, auction history
- Purchase and rental orders from vendor marketplace
- Pre-harvest contract details and offer history
- MSP sale requests and government procurement records

**Usage Data:**
- Quiz completion records and scores
- Points earned and badges achieved
- App usage patterns and feature interactions
- Device information and app version`
  },
  {
    id: 'usage',
    title: '2. How We Use Your Information',
    content: `We use collected information to:

**Platform Operations:**
- Authenticate users via OTP-based login
- Enable field management, crop tracking, and harvest logging
- Provide weather forecasts specific to your field locations
- Generate AI-powered price forecasts using historical market data
- Facilitate marketplace transactions, auctions, and contracts

**Government Integration:**
- Process AGMARK quality grading requests
- Issue QR-linked digital certificates for certified harvests
- Manage MSP procurement workflows with government officials
- Verify government employee identities and credentials

**Gamification & Engagement:**
- Calculate and award farmer points for platform activities
- Unlock badges based on completed milestones
- Generate district-level leaderboards
- Track quiz progress and unlock subsequent quizzes

**Improvement:**
- Analyze platform usage to improve features
- Train and refine our ML price forecasting model (Prophet)
- Identify and prevent abuse of the points system`
  },
  {
    id: 'sharing',
    title: '3. Information Sharing',
    content: `AgriTech shares information only as described below:

**Between Platform Users:**
- When a farmer lists crops on the marketplace, their crop details, quantity, location, and minimum price are visible to registered buyers.
- When a farmer submits an offer on a pre-harvest requirement, their offer details are shared with the relevant buyer.
- Farmer contact information (mobile number) is shared with the winning buyer or vendor after a transaction is confirmed.
- Government officials can view farmer harvest details when assigned a quality grading inspection.

**Government & Regulatory Bodies:**
- Quality grading data may be shared with relevant government agriculture departments.
- MSP procurement records are shared with the procuring government entity.

**What We Do NOT Share:**
- We do not sell your personal data to third parties.
- We do not share your data with advertisers.
- Bank account details are stored securely and are not shared with other users.
- Uploaded verification documents (ID proof, address proof) are accessible only to platform admins for verification purposes.`
  },
  {
    id: 'storage',
    title: '4. Data Storage & Security',
    content: `**Storage:**
- All user data, documents, and agricultural records are stored on Firebase Cloud Storage and Firestore.
- IoT sensor data is uploaded by devices to cloud storage and fetched by the app.
- Uploaded verification documents are stored as PDF files in Firebase Storage.

**Security Measures:**
- OTP-based authentication — no passwords stored.
- Documents are stored with access controls limiting visibility to admins only.
- QR codes on certificates encode unique certificate IDs, not personal data.

**Data Retention:**
- Your account data is retained as long as your account is active.
- Transaction records are retained for 7 years for regulatory compliance.
- Quality grading inspection logs are retained permanently as part of certification records.`
  },
  {
    id: 'rights',
    title: '5. Your Rights',
    content: `As a user of AgriTech, you have the following rights:

**Access:** You can view all your profile information, farm data, transaction history, and earned badges within the app.

**Correction:** You can update your profile information at any time through the app settings.

**Data Portability:** You can request a copy of your personal data in a standard format by contacting us.


**Children's Privacy:** AgriTech is not intended for users under 18. We do not knowingly collect data from minors.`
  },
//   {
//     id: 'iot',
//     title: '6. IoT & Sensor Data',
//     content: `AgriTech integrates with IoT devices deployed on your farm fields.

// **What Sensors Collect:**
// - Soil moisture percentage
// - Soil temperature (°C)
// - Soil pH levels
// - Electrical conductivity (EC in dS/m)
// - Weather station readings (temperature, humidity, rainfall, wind speed)
// - Drone-captured field imagery

// **How It's Used:**
// - Sensor data is uploaded to cloud storage by the device and fetched by the app to display on your IoT dashboard.
// - Soil data is used by our Expense Prediction feature to estimate pesticide requirements.
// - Field imagery from drones is processed to provide crop health insights.

// **Device Management:**
// - Devices are listed in your IoT dashboard with battery status and alert flags.
// - IoT data collection is subject to modification based on hardware availability and deployment constraints.
// - You control which sensors are registered to your account.`
//   },
  {
    id: 'changes',
    title: '7. Changes to This Policy',
    content: `AgriTech may update this Privacy Policy from time to time to reflect changes in our platform, legal requirements, or business practices.

**How We Notify You:**
- Significant changes will be communicated via in-app notifications.
- The updated policy will be published on this page with a revised "Last Updated" date.
- Continued use of the platform after changes constitutes acceptance of the updated policy.

**Contact Us:**
If you have questions about this Privacy Policy or how your data is handled, please contact:

Email: fasalrath@agritechiitbhu.in

**Last Updated:** April 2026
**Applicable Law:** This policy is governed by the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India).`
  },
];

export default function PrivacyPolicy() {
  const [active, setActive] = useState('collection');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} style={{ color: 'var(--slate)', margin: '20px 0 10px', fontSize: '0.95rem' }}>{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i}>{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      // handle inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} style={{ marginBottom: 6 }}>
          {parts.map((part, j) =>
            part.startsWith('**') ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="page privacy-page">
      <div className="privacy-hero">
        {/* <span className="section-label">Legal</span> */}
        <h1>Privacy Policy</h1>
        <p>How AgriTech collects, uses, and protects your information.</p>
        <div className="privacy-meta">
          <span>📅 Last Updated: April 2026</span>
          <span>🔐 Data stored on Firebase and AWS Cloud</span>
        </div>
      </div>

      <div className="privacy-layout">
        {/* Sidebar */}
        <aside className="privacy-sidebar">
          <div className="sidebar-title">Table of Contents</div>
          <nav>
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`sidebar-link ${active === s.id ? 'active' : ''}`}
                onClick={e => { e.preventDefault(); setActive(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="privacy-content">
          <div className="privacy-intro">
            <p>
              At AgriTech, we take your privacy seriously. This policy explains what data we collect from farmers, buyers,
              vendors, and government officials, and how we use it to provide our platform services.
              By using AgriTech, you agree to the practices described in this policy.
            </p>
          </div>

          {sections.map(s => (
            <div key={s.id} id={s.id} className="privacy-section">
              <h2>{s.title}</h2>
              <div className="privacy-body">
                <ul style={{ display: 'contents' }}>
                  {renderContent(s.content)}
                </ul>
              </div>
            </div>
          ))}

          <div className="privacy-contact">
            <h3>Questions About Your Privacy?</h3>
            <p>Our team is here to help. Reach out at any time.</p>
            <div className="contact-row">
              <a href="mailto:fasalrath@agritechiitbhu.in" className="btn btn-primary">📧 fasalrath@agritechiitbhu.in</a>
              <a href="mailto:fasalrath@agritechiitbhu.in" className="btn btn-outline">⚠️ File a Grievance</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
