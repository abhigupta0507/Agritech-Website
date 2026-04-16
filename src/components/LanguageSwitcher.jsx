import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "bho", label: "भो" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          style={{
            padding: "5px 10px",
            borderRadius: 50,
            border: "1px solid",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            background: i18n.language === code ? "var(--teal)" : "transparent",
            color: i18n.language === code ? "#fff" : "var(--text-mid)",
            borderColor:
              i18n.language === code ? "var(--teal)" : "var(--cream-dark)",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
