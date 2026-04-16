import React, { useEffect } from "react";
import "./AboutUs.css";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();

  // Moved arrays inside the component to access the `t` function
  const values = [
    {
      icon: "🌾",
      title: t("Farmer First"),
      desc: t(
        "Every feature is designed around the farmer — their language, their workflow, their income.",
      ),
    },
    {
      icon: "🔍",
      title: t("Transparency"),
      desc: t(
        "From quality grading logs to market prices, farmers and buyers always know exactly what they're getting.",
      ),
    },
    {
      icon: "🤝",
      title: t("Trust"),
      desc: t(
        "Government-integrated, AGMARK-certified, and OTP-verified. Every stakeholder is accountable.",
      ),
    },
    {
      icon: "🧠",
      title: t("Intelligence"),
      desc: t(
        "AI and IoT work behind the scenes so farmers make decisions based on data, not guesswork.",
      ),
    },
    {
      icon: "🌍",
      title: t("Inclusivity"),
      desc: t(
        "English, Hindi, Bhojpuri — every farmer in Bharat deserves a platform that speaks their language.",
      ),
    },
    {
      icon: "⚡",
      title: t("Speed"),
      desc: t(
        "Real-time auctions, live bidding, and instant certificates — because farming moves fast.",
      ),
    },
  ];

  const team = [
    {
      name: t("Abhishek Gupta"),
      role: t("App developer"),
    },
    {
      name: t("Arsh Natani"),
      role: t("App developer"),
    },
    {
      name: t("Ayushman Mishra"),
      role: t("App developer"),
    },
    {
      name: t("Dr. Ajay Pratap"),
      role: t("Advisor"),
    },
  ];

  // const milestones = [
  //   { year: '2024', event: t('Concept born — identifying the gap between farmers and fair markets in UP.') },
  //   { year: t('Early 2025'), event: t('MVP built with core farmer registration, field management, and weather features.') },
  //   { year: t('Mid 2025'), event: t('Government integration added — MSP, AGMARK quality grading, and QR certificates.') },
  //   { year: t('Late 2025'), event: t('Live marketplace launched with spot auctions and pre-harvest contracts.') },
  //   { year: '2026', event: t('Gamification, IoT sensors, Bhojpuri support, and AI price forecasting live.') },
  // ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-content">
          <h1>
            {t("Dedicated to")}
            <br />
            <em>{t("Empowering Farmers")}</em>
          </h1>
          <p>
            {t(
              "AgriTech was born out of a simple question — why does the farmer, who grows food for a billion people, have the least power in the supply chain?",
            )}
          </p>
        </div>
      </div>

      {/* Mission */}
      <section style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div className="mission-split reveal">
          <div className="mission-text">
            <span className="section-label">{t("Our Mission")}</span>
            <h2 className="section-title">
              {t("Technology in Service of the Farmer")}
            </h2>
            <div className="divider" />
            <p>
              {t(
                "India has over 140 million farmers — yet most still rely on local middlemen (arhatiyas), opaque pricing, and no access to quality certification. AgriTech changes that.",
              )}
            </p>
            <p style={{ marginTop: 16 }}>
              {t(
                "We connect farmers directly with buyers, arm them with AI price forecasts, let them earn government-backed quality certificates, and reward their engagement — all in their own language.",
              )}
            </p>
            <p style={{ marginTop: 16 }}>
              {t(
                "We're not just an app. We're a mission to bring dignity, data, and fair prices to every farmer in Bharat.",
              )}
            </p>
          </div>
          <div className="mission-stats">
            {[
              { n: "140M+", l: t("Farmers we aim to serve") },
              { n: "₹0", l: t("Payment integration fees") },
              { n: "3", l: t("Native languages supported") },
              { n: "27", l: t("Crops with MSP support") },
            ].map((s) => (
              <div key={s.l} className="mission-stat">
                <div className="ms-num">{s.n}</div>
                <div className="ms-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 5%", background: "var(--cream-dark)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <span className="section-label">{t("What We Stand For")}</span>
            <h2 className="section-title">{t("Our Core Values")}</h2>
          </div>
          <div className="values-grid reveal">
            {values.map((v) => (
              <div key={v.title} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {/* <section style={{ padding: '80px 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 56 }}>
          <span className="section-label">{t("Our Journey")}</span>
          <h2 className="section-title">{t("Milestones")}</h2>
          <p className="section-sub">{t("From a question to a full ecosystem.")}</p>
        </div>
        <div className="timeline reveal">
          {milestones.map((m, i) => (
            <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-year">{m.year}</div>
                <p>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Team */}
      <section style={{ padding: "80px 5%", background: "var(--slate)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <span className="section-label">{t("The Team")}</span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              {t("People Behind AgriTech")}
            </h2>
            <p
              className="section-sub"
              style={{ color: "rgba(255,255,255,0.6)", margin: "0 auto" }}
            >
              {t("A passionate team working to digitize Indian agriculture.")}
            </p>
          </div>
          <div className="team-grid reveal">
            {team.map((t) => (
              <div key={t.name} className="team-card">
                <div className="team-avatar">
                  <span>{t.initial}</span>
                </div>
                <h3>{t.name}</h3>
                <div className="team-role">{t.role}</div>
                <div className="team-dept">{t.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government note */}
      <section style={{ padding: "80px 5%", background: "var(--teal-pale)" }}>
        <div
          style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}
          className="reveal"
        >
          <span className="section-label">{t("Government Partnership")}</span>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            {t("Integrated with Govt Systems")}
          </h2>
          <p
            style={{
              color: "var(--text-light)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            {t(
              "AgriTech works directly with government agricultural departments for MSP price feeds, AGMARK quality certification, and verified government officer profiles. All data is sourced from official platforms like upag.gov.in.",
            )}
          </p>
          <div className="govt-badges">
            {[
              "🏛️ " + t("AGMARK Integrated"),
              "💰 " + t("MSP Price Feed"),
              "🔐 " + t("Admin Verified Accounts"),
              "📋 " + t("Official Quality Standards"),
              "🇮🇳 " + t("Built for Bharat"),
            ].map((b) => (
              <span key={b} className="govt-badge">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
