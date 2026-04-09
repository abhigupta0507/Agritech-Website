import React, { useEffect } from 'react';
import './HowItWorks.css';

const tradingMethods = [
  {
    name: 'Spot Market',
    color: '#1a7a6e',
    tag: 'Post-Harvest',
    desc: 'Auction-based real-time bidding for harvested crops. The highest bidder wins.',
    steps: ['Farmer lists certified crop', 'Buyers bid in real-time', 'Highest bid wins', 'Contract & delivery confirmed'],
  },
  {
    name: 'Pre-Harvest Contracts',
    color: '#c0533a',
    tag: 'Forward Contracts',
    desc: 'Buyers post requirements, farmers submit offers, then negotiate the best deal.',
    steps: ['Buyer posts requirement', 'Farmers submit offers', 'Buyer selects best offer', 'Forward contract locked'],
  },
  {
    name: 'Govt MSP Channel',
    color: '#6b7c3a',
    tag: 'Guaranteed Price',
    desc: 'Sell directly to the government at Minimum Support Price with full quality grading.',
    steps: ['Farmer requests MSP sale', 'Govt officer reviews crop', 'Quality grading & approval', 'Procurement at MSP rate'],
  },
];

const farmerSteps = [
  { icon: '📱', title: 'Register via OTP', desc: 'Quick mobile-based registration. Login with your number and a 6-digit OTP — no passwords needed.' },
  { icon: '🏡', title: 'Set Up Your Farm', desc: 'Register multiple fields with GPS location. Plant crops, track growth, and log harvests for each field.' },
  { icon: '🌤️', title: 'Get Weather Insights', desc: 'Field-specific weather forecasts and alerts based on your farm\'s location. Prepare before rain, heat, or drought.' },
  { icon: '🤖', title: 'AI Price Forecast', desc: 'ML model (Prophet) trained on govt market data predicts crop prices 1–6 months ahead with 93%+ accuracy.' },
  { icon: '📜', title: 'Get Quality Certified', desc: 'Request AGMARK quality grading from a government officer. Receive a QR-linked certificate for your harvest.' },
  { icon: '💰', title: 'Sell & Get Paid', desc: 'List on the spot market, respond to pre-harvest contracts, or sell at MSP. Track all deals in one place.' },
];

const scoringItems = [
  { action: 'Complete a Quiz', pts: '+50 pts', color: 'teal' },
  { action: 'Quality Approved', pts: '+100 pts', color: 'rust' },
  { action: 'Vendor Purchase', pts: '+30 pts', color: 'olive' },
  { action: 'Auction Completed', pts: '+150 pts', color: 'slate' },
  { action: 'Profile Completed', pts: '+75 pts', color: 'teal' },
  { action: 'Badge Earned', pts: '+25 pts', color: 'rust' },
  { action: 'Crop Listed', pts: '+20 pts', color: 'olive' },
];

export default function HowItWorks() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page hiw-page">
      {/* Hero */}
      <div className="hiw-hero">
        <span className="section-label">Platform Walkthrough</span>
        <h1>How <em>AgriTech</em> Works</h1>
        <p>From registration to revenue — a complete walkthrough of every feature in the platform.</p>
      </div>

      {/* Farmer Journey */}
      <section style={{ padding: '80px 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 56 }}>
          <span className="section-label">Farmer Journey</span>
          <h2 className="section-title">6 Steps to Smarter Farming</h2>
          <p className="section-sub">Everything a farmer needs, in the right order.</p>
        </div>
        <div className="journey-grid reveal">
          {farmerSteps.map((s, i) => (
            <div key={s.title} className="journey-card">
              <div className="journey-num">0{i + 1}</div>
              <div className="journey-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trading methods */}
      <section style={{ padding: '80px 5%', background: 'var(--slate)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: 56, textAlign: 'center' }}>
            <span className="section-label">Marketplace</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>3 Ways to Trade Crops</h2>
            <p className="section-sub" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 auto' }}>
              Choose how you sell — auction, contract, or guaranteed government price.
            </p>
          </div>
          <div className="trading-grid reveal">
            {tradingMethods.map(m => (
              <div key={m.name} className="trading-card">
                <div className="trading-top" style={{ borderTop: `4px solid ${m.color}` }}>
                  <span className="chip chip-teal" style={{ marginBottom: 16, background: `${m.color}22`, color: m.color }}>
                    {m.tag}
                  </span>
                  <h3 style={{ color: 'var(--white)', marginBottom: 12 }}>{m.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.7 }}>{m.desc}</p>
                </div>
                <div className="trading-steps">
                  {m.steps.map((step, i) => (
                    <div key={step} className="trade-step">
                      <div className="trade-step-num" style={{ background: m.color }}>{i + 1}</div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Grading */}
      <section style={{ padding: '80px 5%', background: 'var(--cream)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div className="reveal">
            <span className="section-label">Quality Assurance</span>
            <h2 className="section-title">AGMARK Quality Grading</h2>
            <div className="divider" />
            <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 24 }}>
              After harvesting, farmers can request official quality grading from a government officer.
              The officer visits, fills in lab parameters, and submits a grade.
              The farmer instantly gets a QR-linked digital certificate.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['Farmer requests quality check', '📋'],
                ['Govt officer self-assigns inspection', '👨‍💼'],
                ['Officer submits moisture, damage data', '🔬'],
                ['Digital AGMARK certificate issued', '📜'],
                ['Certificate linked to all crop listings', '🔗'],
              ].map(([text, icon]) => (
                <div key={text} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--white)', padding: '14px 18px', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <div className="cert-card">
              <div className="cert-header">Quality Certificate</div>
              <div className="cert-qr">
                <div className="qr-placeholder">
                  <div className="qr-pattern" />
                </div>
                <div className="cert-id">CERT-1772986458325-716</div>
                <div className="cert-grade">Grade: Special ⭐</div>
              </div>
              <div className="cert-details">
                <div className="cert-row"><span>Crop</span><span>Paddy (Common)</span></div>
                <div className="cert-row"><span>Quantity</span><span>100 quintal</span></div>
                <div className="cert-row"><span>Field</span><span>North Field</span></div>
                <div className="cert-row"><span>Lab</span><span>Varanasi Central Lab</span></div>
                <div className="cert-row"><span>Harvest Date</span><span>8/3/2026</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification scoring */}
      <section style={{ padding: '80px 5%', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Farmer Rewards</span>
            <h2 className="section-title">How Points Are Earned</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Every meaningful action on the platform earns points. Accumulate to reach Bronze → Silver → Gold.
            </p>
          </div>
          <div className="scoring-grid reveal">
            {scoringItems.map(s => (
              <div key={s.action} className={`scoring-card sc-${s.color}`}>
                <div className="scoring-pts">{s.pts}</div>
                <div className="scoring-action">{s.action}</div>
              </div>
            ))}
          </div>
          <div className="leagues-bar reveal">
            {[['🥉 Bronze', '0 – 499 pts', '#b5651d'], ['🥈 Silver', '500 – 999 pts', '#9e9e9e'], ['🥇 Gold', '1000+ pts', '#e6a817']].map(([name, range, color]) => (
              <div key={name} className="league-item">
                <div className="league-name" style={{ color }}>{name}</div>
                <div className="league-range">{range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IoT section */}
      <section style={{ padding: '80px 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-label">Smart Technology</span>
          <h2 className="section-title">IoT & AI Powered</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Sensors on the ground, drones in the air, and AI in the cloud — all feeding your farm dashboard.
          </p>
        </div>
        <div className="iot-grid reveal">
          {[
            { icon: '📡', title: 'Soil Moisture Sensors', desc: 'Deploy sensors that report moisture %, temperature, pH, and EC levels in real-time.' },
            { icon: '🚁', title: 'Drone Integration', desc: 'Drones capture field imagery and upload to cloud. App fetches and displays field health maps.' },
            { icon: '🌦️', title: 'Weather Station Data', desc: 'Field-specific weather from integrated stations. Get alerts before adverse conditions hit.' },
            { icon: '🧠', title: 'Prophet ML Model', desc: 'Price forecasting model trained on govt market data (upag.gov). 93%+ accuracy over 1–6 months.' },
          ].map(item => (
            <div key={item.title} className="iot-card">
              <div className="iot-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
