import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import BannerBg1 from "../static/images/sandy-zebua-a7n65pmnJ4Q-unsplash.jpg";
import BannerBg2 from "../static/images/pexels-josh-hild-1270765-14227485.jpg";
import { useTranslation } from "react-i18next";

import "swiper/css";
import "swiper/css/pagination";

const stats = [
  { value: "140M+", label: "Farmers in India" },
  { value: "4", label: "User Profiles" },
  { value: "30+", label: "Crops Supported" },
  { value: "3", label: "Languages" },
];

const features = [
  {
    icon: "🌾",
    color: "teal",
    title: "Smart Farming",
    desc: "Field management, IoT sensors & AI-powered weather alerts tailored for your farm.",
  },
  {
    icon: "⚖️",
    color: "rust",
    title: "Live Marketplace",
    desc: "Spot market bidding, pre-harvest contracts & real-time auction deals — no middlemen.",
  },
  {
    icon: "🛒",
    color: "olive",
    title: "Agri-Input Store",
    desc: "Seeds, equipment & machinery rentals from verified vendors, all in one place.",
  },
  {
    icon: "🏛️",
    color: "slate",
    title: "Govt Integration",
    desc: "Quality grading, QR-linked AGMARK certificates & MSP procurement — fully digital.",
  },
  {
    icon: "✦",
    color: "teal",
    title: "AI Intelligence",
    desc: "Price forecasting via ML, crop recommendations & profit prediction for smarter decisions.",
  },
  {
    icon: "🗣️",
    color: "rust",
    title: "Multi-Language",
    desc: "Full support for English, Hindi, and Bhojpuri — truly built for every farmer in Bharat.",
  },
];

const profiles = [
  {
    role: "Farmer",
    color: "#1a7a6e",
    emoji: "👨‍🌾",
    perks: [
      "Field & crop management",
      "AI price forecasting",
      "Quality certification",
      "Sell via auction or MSP",
      "Earn points & badges",
    ],
  },
  {
    role: "Buyer",
    color: "#c0533a",
    emoji: "🏢",
    perks: [
      "Browse certified harvests",
      "Live bidding room",
      "Pre-harvest contracts",
      "Spot market deals",
      "Manage fulfillment",
    ],
  },
  {
    role: "Vendor",
    color: "#3d5a80",
    emoji: "🚜",
    perks: [
      "List seeds & tools",
      "Machinery rentals",
      "Manage orders",
      "Track payments",
      "GST-verified profile",
    ],
  },
  {
    role: "Government",
    color: "#6b7c3a",
    emoji: "🏛️",
    perks: [
      "Issue QR certificates",
      "Quality grading",
      "MSP price management",
      "Employee management",
      "Admin dashboard",
    ],
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const { t } = useTranslation();

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
                    {/* Using your existing button classes for consistency */}
                    <a
                      className="btn btn-primary"
                      href="https://play.google.com/store/apps"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download app
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
                    AgriTech Bazaar, agri-input marketplace.
                  </h1>
                  <div className="banner-button-container">
                    <Link to="/krishi-bazar" className="btn btn-primary">
                      Explore now
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
            <span className="chip chip-teal">🌱 2026 · Built for Bharat</span>
          </div>
          <h1 className="hero-title">
            One Platform for
            <br />
            <em>India's Entire</em>
            <br />
            Agri Ecosystem
          </h1>
          <p className="hero-sub">
            Connecting farmers, buyers, vendors & government on a single
            intelligent platform — with AI, IoT & live markets, all in your
            language.
          </p>
          <div className="hero-actions">
            <Link to="/how-it-works" className="btn btn-primary">
              See How It Works →
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>

          <div className="hero-profiles">
            {["Farmer", "Buyer", "Vendor", "Govt"].map((p, i) => (
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
                <span>AgriTech</span>
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>🌱</span>
              </div>
              <div className="screen-card teal">
                <div>🌾 North Field — 20 acres</div>
                <div
                  style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: 4 }}
                >
                  Paddy · Harvest ready
                </div>
              </div>
              <div className="screen-stat-row">
                <div className="screen-stat">
                  <div>₹2,338</div>
                  <div>Current MSP</div>
                </div>
                <div className="screen-stat">
                  <div style={{ color: "#1a7a6e" }}>↑ 93.8%</div>
                  <div>Forecast Acc.</div>
                </div>
              </div>
              <div className="screen-card rust">
                <div>⚡ Live Auction Active</div>
                <div
                  style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: 4 }}
                >
                  Arhar (Tur) · 250 quintal
                </div>
              </div>
              <div className="screen-badge-row">
                <div className="screen-badge">🏆 Bronze</div>
                <div className="screen-badge">250 pts</div>
                <div className="screen-badge">📜 AGMARK</div>
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
            <span className="section-label">Platform Features</span>
            <h2 className="section-title">End-to-End Agri Ecosystem</h2>
            <p className="section-sub">
              Every tool a modern farmer needs — from sowing to selling, in one
              app.
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
            <span className="section-label">Who It's For</span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              4 Profiles, 1 Platform
            </h2>
            <p
              className="section-sub"
              style={{ color: "rgba(255,255,255,0.6)", margin: "0 auto" }}
            >
              Every stakeholder in the agriculture chain gets their own
              dedicated experience.
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
            <span className="section-label">Gamification</span>
            <h2 className="section-title">Learn. Earn. Level Up.</h2>
            <div className="divider" />
            <p
              style={{
                color: "var(--text-light)",
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              AgriTech makes farming engaging through a powerful rewards system
              — because motivated farmers grow better crops.
            </p>
            <div className="game-features">
              <div className="game-item">
                <span>🏅</span>
                <div>
                  <strong>Badges & Achievements</strong>
                  <p>
                    Earn badges for quality checks, auctions, quizzes & more —
                    displayed in your Hall of Fame.
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>📊</span>
                <div>
                  <strong>Bronze → Silver → Gold</strong>
                  <p>
                    Accumulate points across activities to level up your farmer
                    league status.
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>🏆</span>
                <div>
                  <strong>District Leaderboard</strong>
                  <p>
                    Compete with farmers in your district and climb the ranks.
                  </p>
                </div>
              </div>
              <div className="game-item">
                <span>📚</span>
                <div>
                  <strong>Knowledge Quizzes</strong>
                  <p>
                    Multilingual quizzes unlock sequentially — earn 50 pts per
                    completed quiz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal gamification-visual">
            <div className="points-card">
              <div className="points-header">
                <span>🏆 Leaderboard · Varanasi</span>
              </div>
              <div className="leaderboard-row rank-1">
                <span className="rank">#1</span>
                <span className="farmer-name">Ram Prasad</span>
                <span className="pts">250 pts</span>
                <span className="league bronze">Bronze</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">#2</span>
                <span className="farmer-name">Suresh Kumar</span>
                <span className="pts">115 pts</span>
                <span className="league bronze">Bronze</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">#3</span>
                <span className="farmer-name">Mohan Singh</span>
                <span className="pts">80 pts</span>
                <span className="league bronze">Bronze</span>
              </div>
            </div>
            <div className="badges-row">
              {[
                "🏅 Knowledge Champion",
                "⭐ Quality Pioneer",
                "🔨 Auction Pro",
                "🌱 Soil Scientist",
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
            Ready to Transform
            <br />
            <em>Indian Agriculture?</em>
          </h2>
          <p>
            Join millions of farmers, buyers, and vendors on AgriTech — India's
            most complete agri platform.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/how-it-works" className="btn btn-ghost">
              See How It Works
            </Link>
            <Link
              to="/about"
              className="btn"
              style={{ background: "var(--white)", color: "var(--teal)" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
