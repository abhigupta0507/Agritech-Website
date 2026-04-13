import React, { useState, useEffect, useRef } from "react";
import "./PrivacyPolicy.css";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const [active, setActive] = useState("collection");
  const observerRef = useRef(null);

  /* ── Scroll-aware TOC ──────────────────────────────────────────── */
  useEffect(() => {
    window.scrollTo(0, 0);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    document
      .querySelectorAll(".privacy-section")
      .forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Structured section data ───────────────────────────────────── */
  const sections = [
    {
      id: "collection",
      num: "1",
      title: t("Information We Collect"),
      intro: t(
        "AgriTech collects information necessary to provide our platform services to farmers, buyers, vendors, and government officials.",
      ),
      subsections: [
        {
          label: t("Personal Information"),
          items: [
            t(
              "Mobile number (used for OTP authentication and unique identification)",
            ),
            t("Full name, email address, and home address"),
            t(
              "Bank account details and IFSC code (for vendor payment tracking)",
            ),
            t(
              "ID proof and address proof documents (for government employee verification)",
            ),
            t("Marital status and designation"),
          ],
        },
        {
          label: t("Farm & Agricultural Data"),
          items: [
            t("Field locations (GPS coordinates for weather forecasting)"),
            t(
              "Crop types, planting dates, harvest data, and storage information",
            ),
            t(
              "Soil data from IoT sensors (moisture, pH, electrical conductivity)",
            ),
            t("Harvest quality parameters and quality grading data"),
          ],
        },
        {
          label: t("Transaction Data"),
          items: [
            t("Marketplace listings, bids, auction history"),
            t("Purchase and rental orders from vendor marketplace"),
            t("Pre-harvest contract details and offer history"),
            t("MSP sale requests and government procurement records"),
          ],
        },
        {
          label: t("Usage Data"),
          items: [
            t("Quiz completion records and scores"),
            t("Points earned and badges achieved"),
            t("App usage patterns and feature interactions"),
            t("Device information and app version"),
          ],
        },
      ],
    },
    {
      id: "usage",
      num: "2",
      title: t("How We Use Your Information"),
      intro: t("We use collected information to:"),
      subsections: [
        {
          label: t("Platform Operations"),
          items: [
            t("Authenticate users via OTP-based login"),
            t("Enable field management, crop tracking, and harvest logging"),
            t("Provide weather forecasts specific to your field locations"),
            t(
              "Generate AI-powered price forecasts using historical market data",
            ),
            t("Facilitate marketplace transactions, auctions, and contracts"),
          ],
        },
        {
          label: t("Government Integration"),
          items: [
            t("Process AGMARK quality grading requests"),
            t("Issue QR-linked digital certificates for certified harvests"),
            t("Manage MSP procurement workflows with government officials"),
            t("Verify government employee identities and credentials"),
          ],
        },
        {
          label: t("Gamification & Engagement"),
          items: [
            t("Calculate and award farmer points for platform activities"),
            t("Unlock badges based on completed milestones"),
            t("Generate district-level leaderboards"),
            t("Track quiz progress and unlock subsequent quizzes"),
          ],
        },
        {
          label: t("Improvement"),
          items: [
            t("Analyze platform usage to improve features"),
            t("Train and refine our ML price forecasting model (Prophet)"),
            t("Identify and prevent abuse of the points system"),
          ],
        },
      ],
    },
    {
      id: "sharing",
      num: "3",
      title: t("Information Sharing"),
      intro: t("AgriTech shares information only as described below:"),
      subsections: [
        {
          label: t("Between Platform Users"),
          items: [
            t(
              "When a farmer lists crops on the marketplace, their crop details, quantity, location, and minimum price are visible to registered buyers.",
            ),
            t(
              "When a farmer submits an offer on a pre-harvest requirement, their offer details are shared with the relevant buyer.",
            ),
            t(
              "Farmer contact information (mobile number) is shared with the winning buyer or vendor after a transaction is confirmed.",
            ),
            t(
              "Government officials can view farmer harvest details when assigned a quality grading inspection.",
            ),
          ],
        },
        {
          label: t("Government & Regulatory Bodies"),
          items: [
            t(
              "Quality grading data may be shared with relevant government agriculture departments.",
            ),
            t(
              "MSP procurement records are shared with the procuring government entity.",
            ),
          ],
        },
        {
          label: t("What We Do NOT Share"),
          variant: "warning",
          items: [
            t("We do not sell your personal data to third parties."),
            t("We do not share your data with advertisers."),
            t(
              "Bank account details are stored securely and are not shared with other users.",
            ),
            t(
              "Uploaded verification documents (ID proof, address proof) are accessible only to platform admins for verification purposes.",
            ),
          ],
        },
      ],
    },
    {
      id: "storage",
      num: "4",
      title: t("Data Storage & Security"),
      subsections: [
        {
          label: t("Storage"),
          items: [
            t(
              "All user data, documents, and agricultural records are stored on Firebase Cloud Storage and Firestore.",
            ),
            t(
              "IoT sensor data is uploaded by devices to cloud storage and fetched by the app.",
            ),
            t(
              "Uploaded verification documents are stored as PDF files in Firebase Storage.",
            ),
          ],
        },
        {
          label: t("Security Measures"),
          items: [
            t("OTP-based authentication — no passwords stored."),
            t(
              "Documents are stored with access controls limiting visibility to admins only.",
            ),
            t(
              "QR codes on certificates encode unique certificate IDs, not personal data.",
            ),
          ],
        },
        {
          label: t("Data Retention"),
          items: [
            t(
              "Your account data is retained as long as your account is active.",
            ),
            t(
              "Transaction records are retained for 7 years for regulatory compliance.",
            ),
            t(
              "Quality grading inspection logs are retained permanently as part of certification records.",
            ),
          ],
        },
      ],
    },
    {
      id: "rights",
      num: "5",
      title: t("Your Rights"),
      intro: t("As a user of AgriTech, you have the following rights:"),
      highlights: [
        {
          label: t("Access"),
          text: t(
            "You can view all your profile information, farm data, transaction history, and earned badges within the app.",
          ),
        },
        {
          label: t("Correction"),
          text: t(
            "You can update your profile information at any time through the app settings.",
          ),
        },
        {
          label: t("Data Portability"),
          text: t(
            "You can request a copy of your personal data in a standard format by contacting us.",
          ),
        },
        {
          label: t("Children's Privacy"),
          text: t(
            "AgriTech is not intended for users under 18. We do not knowingly collect data from minors.",
          ),
          variant: "info",
        },
      ],
    },
    {
      id: "changes",
      num: "7",
      title: t("Changes to This Policy"),
      intro: t(
        "AgriTech may update this Privacy Policy from time to time to reflect changes in our platform, legal requirements, or business practices.",
      ),
      subsections: [
        {
          label: t("How We Notify You"),
          items: [
            t(
              "Significant changes will be communicated via in-app notifications.",
            ),
            t(
              'The updated policy will be published on this page with a revised "Last Updated" date.',
            ),
            t(
              "Continued use of the platform after changes constitutes acceptance of the updated policy.",
            ),
          ],
        },
      ],
      footer: {
        contactLabel: t("Contact Us"),
        contactText: t(
          "If you have questions about this Privacy Policy or how your data is handled, please contact:",
        ),
        email: "fasalrath@agritechiitbhu.in",
        meta: [
          { label: t("Last Updated"), value: t("April 2026") },
          {
            label: t("Applicable Law"),
            value: t(
              "Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India)",
            ),
          },
        ],
      },
    },
  ];

  /* ── Render a single section ───────────────────────────────────── */
  const renderSection = (s) => (
    <div key={s.id} id={s.id} className="privacy-section">
      <div className="privacy-section-header">
        <div className="privacy-section-num">{s.num}</div>
        <h2>{s.title}</h2>
      </div>

      {s.intro && <p className="privacy-intro-text">{s.intro}</p>}

      {s.subsections?.map((sub) => (
        <div key={sub.label} className="privacy-subsection">
          <div
            className={`privacy-subsection-label${
              sub.variant === "warning" ? " label-warning" : ""
            }`}
          >
            {sub.label}
          </div>
          <ul
            className={`privacy-list${
              sub.variant === "warning" ? " privacy-notshared" : ""
            }`}
          >
            {sub.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {s.highlights?.map((h) => (
        <div
          key={h.label}
          className={`privacy-highlight-block${
            h.variant === "info" ? " highlight-info" : ""
          }`}
        >
          <strong>{h.label}</strong>
          <span>{h.text}</span>
        </div>
      ))}

      {s.footer && (
        <div className="privacy-footer-block">
          <p className="privacy-footer-contact-label">
            {s.footer.contactLabel}
          </p>
          <p>{s.footer.contactText}</p>
          <a href={`mailto:${s.footer.email}`} className="privacy-email-link">
            📧 {s.footer.email}
          </a>
          <div className="privacy-footer-meta">
            {s.footer.meta.map((m) => (
              <div key={m.label} className="privacy-meta-row">
                <span className="meta-label">{m.label}:</span>
                <span className="meta-value">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="page privacy-page">
      <div className="privacy-hero">
        <div className="privacy-hero-eyebrow">🔐 {t("Legal Document")}</div>
        <h1>{t("Privacy Policy")}</h1>
        <p>
          {t("How AgriTech collects, uses, and protects your information.")}
        </p>
        <div className="privacy-meta">
          <span>📅 {t("Last Updated: April 2026")}</span>
          <span>🔐 {t("Data stored on Firebase and AWS Cloud")}</span>
        </div>
      </div>

      <div className="privacy-layout">
        <aside className="privacy-sidebar">
          <div className="sidebar-title">{t("Table of Contents")}</div>
          <nav>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`sidebar-link ${active === s.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
              >
                <span className="sidebar-num">{s.num}.</span>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="sidebar-sep" />
          <div className="sidebar-reading-time">
            📖 &nbsp;~5 {t("min read")}
          </div>
        </aside>

        <main className="privacy-content">
          <div className="privacy-intro">
            <div className="privacy-intro-icon">ℹ️</div>
            <p>
              {t(
                "At AgriTech, we take your privacy seriously. This policy explains what data we collect from farmers, buyers, vendors, and government officials, and how we use it to provide our platform services. By using AgriTech, you agree to the practices described in this policy.",
              )}
            </p>
          </div>

          {sections.map(renderSection)}

          <div className="privacy-contact">
            <div className="privacy-contact-icon">✉️</div>
            <h3>{t("Questions About Your Privacy?")}</h3>
            <p>{t("Our team is here to help. Reach out at any time.")}</p>
            <div className="contact-row">
              <a
                href="mailto:fasalrath@agritechiitbhu.in"
                className="btn btn-primary"
              >
                📧 fasalrath@agritechiitbhu.in
              </a>
              <a
                href="mailto:fasalrath@agritechiitbhu.in"
                className="btn btn-ghost"
              >
                ⚠️ {t("File a Grievance")}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
