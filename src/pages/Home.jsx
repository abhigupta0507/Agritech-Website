import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import BannerBg1 from "../assets/images/sandy-zebua-a7n65pmnJ4Q-unsplash.jpg";
import BannerBg2 from "../assets/images/pexels-josh-hild-1270765-14227485.jpg";

import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const heroRef = useRef(null);
  const { t } = useTranslation();

  // Moved arrays inside the component to access the `t` function
  const stats = [
    { value: "140M+", label: t("Farmers in India") },
    { value: "4", label: t("User Profiles") },
    { value: "30+", label: t("Crops Supported") },
    { value: "3", label: t("Languages") },
  ];

  const features = [
    {
      icon: "🌾",
      color: "teal",
      title: t("Smart Farming"),
      desc: t(
        "Field management, IoT sensors & AI-powered weather alerts tailored for your farm.",
      ),
    },
    {
      icon: "⚖️",
      color: "rust",
      title: t("Live Marketplace"),
      desc: t(
        "Spot market bidding, pre-harvest contracts & real-time auction deals — no middlemen.",
      ),
    },
    {
      icon: "🛒",
      color: "olive",
      title: t("Agri-Input Store"),
      desc: t(
        "Seeds, equipment & machinery rentals from verified vendors, all in one place.",
      ),
    },
    {
      icon: "🏛️",
      color: "slate",
      title: t("Govt Integration"),
      desc: t(
        "Quality grading, QR-linked AGMARK certificates & MSP procurement — fully digital.",
      ),
    },
    {
      icon: "✦",
      color: "teal",
      title: t("AI Intelligence"),
      desc: t(
        "Price forecasting via ML, crop recommendations & profit prediction for smarter decisions.",
      ),
    },
    {
      icon: "🗣️",
      color: "rust",
      title: t("Multi-Language"),
      desc: t(
        "Full support for English, Hindi, and Bhojpuri — truly built for every farmer in Bharat.",
      ),
    },
  ];

  const profiles = [
    {
      role: t("Farmer"),
      color: "#1a7a6e",
      emoji: "👨‍🌾",
      perks: [
        t("Field & crop management"),
        t("AI price forecasting"),
        t("Quality certification"),
        t("Sell via auction or MSP"),
        t("Earn points & badges"),
      ],
    },
    {
      role: t("Buyer"),
      color: "#c0533a",
      emoji: "🏢",
      perks: [
        t("Browse certified harvests"),
        t("Live bidding room"),
        t("Pre-harvest contracts"),
        t("Spot market deals"),
        t("Manage fulfillment"),
      ],
    },
    {
      role: t("Vendor"),
      color: "#3d5a80",
      emoji: "🚜",
      perks: [
        t("List seeds & tools"),
        t("Machinery rentals"),
        t("Manage orders"),
        t("Track payments"),
        t("GST-verified profile"),
      ],
    },
    {
      role: t("Government"),
      color: "#6b7c3a",
      emoji: "🏛️",
      perks: [
        t("Issue QR certificates"),
        t("Quality grading"),
        t("MSP price management"),
        t("Employee management"),
        t("Admin dashboard"),
      ],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page home-page">
      {/* --- NEW BANNER SLIDER SECTION --- */}
      <div className="banner-slider-child">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div
              className="banner-layout"
              style={{
                "--bg-image": `url(${BannerBg1})`,
                "--bg-sm-image": `url(${BannerBg1})`,
                "--min-height-1440": "90vh",
              }}
            >
              <div className="banner-container">
                <div className="banner-content-wrapper">
                  <h1 className="banner-title">
                    {t("AgriTech, the future of agriculture.")}
                  </h1>
                  <div className="banner-button-container">
                    <a
                      className="btn btn-primary"
                      href="https://play.google.com/store/apps"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("Download app")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="banner-layout"
              style={{
                "--bg-image": `url(${BannerBg2})`,
                "--bg-sm-image": `url(${BannerBg2})`,
                "--min-height-1440": "90vh",
              }}
            >
              <div className="banner-container">
                <div className="banner-content-wrapper">
                  <h1 className="banner-title">
                    {t("AgriTech Bazaar, agri-input marketplace.")}
                  </h1>
                  <div className="banner-button-container">
                    <Link to="/krishi-bazar" className="btn btn-primary">
                      {t("Explore now")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {/* --- END BANNER SLIDER SECTION --- */}

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div
            className="hero-blob"
            style={{
              width: 600,
              height: 600,
              background: "var(--teal)",
              top: -100,
              right: -100,
            }}
          />
          <div
            className="hero-blob"
            style={{
              width: 400,
              height: 400,
              background: "var(--rust)",
              bottom: -50,
              left: -80,
              animationDelay: "3s",
            }}
          />
        </div>

        <div className="hero-content">
          <div className="hero-label">
            <span className="chip chip-teal">
              🌱 {t("2026 · Built for Bharat")}
            </span>
          </div>
          <h1 className="hero-title">
            {t("One Platform for")}
            <br />
            <em>{t("India's Entire")}</em>
            <br />
            {t("Agri Ecosystem")}
          </h1>
          <p className="hero-sub">
            {t(
              "Connecting farmers, buyers, vendors & government on a single intelligent platform — with AI, IoT & live markets, all in your language.",
            )}
          </p>
          <div className="hero-actions">
            <Link to="/how-it-works" className="btn btn-primary">
              {t("See How It Works →")}
            </Link>
            <Link to="/about" className="btn btn-outline">
              {t("Our Story")}
            </Link>
          </div>

          <div className="hero-profiles">
            {[t("Farmer"), t("Buyer"), t("Vendor"), t("Govt")].map((p, i) => (
              <div
                key={p}
                className="profile-chip"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="screen-header">
                <div className="screen-dot" />
                <span>{t("AgriTech")}</span>
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>🌱</span>
              </div>
              <div className="screen-card teal">
                <div>🌾 {t("North Field — 20 acres")}</div>
                <div
                  style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: 4 }}
                >
                  {t("Paddy · Harvest ready")}
                </div>
              </div>
              <div className="screen-stat-row">
                <div className="screen-stat">
                  <div>{t("₹2,338")}</div>
                  <div>{t("Current MSP")}</div>
                </div>
                <div className="screen-stat">
                  <div style={{ color: "#1a7a6e" }}>{t("↑ 93.8%")}</div>
                  <div>{t("Forecast Acc.")}</div>
                </div>
              </div>
              <div className="screen-card rust">
                <div>⚡ {t("Live Auction Active")}</div>
                <div
                  style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: 4 }}
                >
                  {t("Arhar (Tur) · 250 quintal")}
                </div>
              </div>
              <div className="screen-badge-row">
                <div className="screen-badge">🏆 {t("Bronze")}</div>
                <div className="screen-badge">{t("250 pts")}</div>
                <div className="screen-badge">📜 {t("AGMARK")}</div>
              </div>
            </div>
          </div>
          <div className="phone-glow" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: "96px 5%", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal">
            <span className="section-label">{t("Platform Features")}</span>
            <h2 className="section-title">{t("End-to-End Agri Ecosystem")}</h2>
            <p className="section-sub">
              {t(
                "Every tool a modern farmer needs — from sowing to selling, in one app.",
              )}
            </p>
          </div>
          <div className="features-grid reveal">
            {features.map((f) => (
              <div key={f.title} className={`feature-card card-${f.color}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User profiles */}
      <section style={{ padding: "96px 5%", background: "var(--slate)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <span className="section-label">{t("Who It's For")}</span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              {t("4 Profiles, 1 Platform")}
            </h2>
            <p
              className="section-sub"
              style={{ color: "rgba(255,255,255,0.6)", margin: "0 auto" }}
            >
              {t(
                "Every stakeholder in the agriculture chain gets their own dedicated experience.",
              )}
            </p>
          </div>
          <div className="profiles-grid reveal">
            {profiles.map((p) => (
              <div key={p.role} className="profile-card">
                <div className="profile-top" style={{ background: p.color }}>
                  <span className="profile-emoji">{p.emoji}</span>
                  <h3>{p.role}</h3>
                </div>
                <ul className="profile-list">
                  {p.perks.map((perk) => (
                    <li key={perk}>
                      <span className="check">✓</span> {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification section */}
      <section style={{ padding: "96px 5%", background: "var(--cream)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div className="reveal">
            <span className="section-label">{t("Gamification")}</span>
            <h2 className="section-title">{t("Learn. Earn. Level Up.")}</h2>
            <div className="divider" />
            <p
              style={{
                color: "var(--text-light)",
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              {t(
                "AgriTech makes farming engaging through a powerful rewards system — because motivated farmers grow better crops.",
              )}
            </p>
            <div className="game-features">
              <div className="game-item">
                <span>🏅</span>
                <div>
                  <strong>{t("Badges & Achievements")}</strong>
                  <p>
                    {t(
                      "Earn badges for quality checks, auctions, quizzes & more — displayed in your Hall of Fame.",
                    )}
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>📊</span>
                <div>
                  <strong>{t("Bronze → Silver → Gold")}</strong>
                  <p>
                    {t(
                      "Accumulate points across activities to level up your farmer league status.",
                    )}
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>🏆</span>
                <div>
                  <strong>{t("District Leaderboard")}</strong>
                  <p>
                    {t(
                      "Compete with farmers in your district and climb the ranks.",
                    )}
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>📚</span>
                <div>
                  <strong>{t("Knowledge Quizzes")}</strong>
                  <p>
                    {t(
                      "Multilingual quizzes unlock sequentially — earn 50 pts per completed quiz.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal gamification-visual">
            <div className="points-card">
              <div className="points-header">
                <span>🏆 {t("Leaderboard · Varanasi")}</span>
              </div>
              <div className="leaderboard-row rank-1">
                <span className="rank">{t("#1")}</span>
                <span className="farmer-name">{t("Ram Prasad")}</span>
                <span className="pts">{t("250 pts")}</span>
                <span className="league bronze">{t("Bronze")}</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">{t("#2")}</span>
                <span className="farmer-name">{t("Suresh Kumar")}</span>
                <span className="pts">{t("115 pts")}</span>
                <span className="league bronze">{t("Bronze")}</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">{t("#3")}</span>
                <span className="farmer-name">{t("Mohan Singh")}</span>
                <span className="pts">{t("80 pts")}</span>
                <span className="league bronze">{t("Bronze")}</span>
              </div>
            </div>
            <div className="badges-row">
              {[
                "🏅 " + t("Knowledge Champion"),
                "⭐ " + t("Quality Pioneer"),
                "🔨 " + t("Auction Pro"),
                "🌱 " + t("Soil Scientist"),
              ].map((b) => (
                <span key={b} className="badge-tag">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>
            {t("Ready to Transform")}
            <br />
            <em>{t("Indian Agriculture?")}</em>
          </h2>
          <p>
            {t(
              "Join millions of farmers, buyers, and vendors on AgriTech — India's most complete agri platform.",
            )}
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/how-it-works" className="btn btn-ghost">
              {t("See How It Works")}
            </Link>
            <Link
              to="/about"
              className="btn"
              style={{ background: "var(--white)", color: "var(--teal)" }}
            >
              {t("Learn More")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
