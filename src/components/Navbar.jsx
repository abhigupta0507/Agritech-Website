import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t("Home") },
    { to: "/how-it-works", label: t("How It Works") },
    { to: "/about", label: t("About Us") },
    { to: "/privacy", label: t("Privacy") },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <NavLink to="/" className="nav-logo">
          AgriTech<span>IIT(BHU)</span>
        </NavLink>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <strong>
              <a href="#download" className="nav-cta">
                {t("Download App")}
              </a>
            </strong>
          </li>
        </ul>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              transform: menuOpen
                ? "rotate(45deg) translate(5px, 5px)"
                : "none",
            }}
          />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
            {l.label}
          </NavLink>
        ))}

        <LanguageSwitcher />
        <a
          href="#download"
          className="btn btn-primary"
          style={{ width: "fit-content" }}
          onClick={() => setMenuOpen(false)}
        >
          {t("Download App")}
        </a>
      </div>
    </>
  );
}
