import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

// ─── Static fallback data ───────────────────────────────────────────────────
const STATIC_STATES = [
  { state: "Uttar Pradesh", stateCode: "UP" },
  { state: "Maharashtra", stateCode: "MH" },
  { state: "Punjab", stateCode: "PB" },
  { state: "Rajasthan", stateCode: "RJ" },
  { state: "Madhya Pradesh", stateCode: "MP" },
  { state: "Bihar", stateCode: "BR" },
];

const STATIC_DISTRICTS = {
  UP: [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Ayodhya",
    "Azamgarh",
    "Bahraich",
    "Ballia",
    "Banda",
    "Bareilly",
    "Basti",
    "Bijnor",
    "Bulandshahr",
    "Deoria",
    "Etawah",
    "Fatehpur",
    "Firozabad",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hardoi",
    "Jaunpur",
    "Jhansi",
    "Kanpur Nagar",
    "Lucknow",
    "Mathura",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Prayagraj",
    "Rae Bareli",
    "Saharanpur",
    "Shahjahanpur",
    "Sitapur",
    "Varanasi",
  ],
  MH: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Chandrapur",
    "Dhule",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nashik",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Yavatmal",
  ],
  PB: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Mansa",
    "Moga",
    "Mohali",
    "Muktsar",
    "Nawanshahr",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Tarn Taran",
  ],
  RJ: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],
  MP: [
    "Bhopal",
    "Chhindwara",
    "Dewas",
    "Dhar",
    "Gwalior",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Katni",
    "Khandwa",
    "Khargone",
    "Morena",
    "Neemuch",
    "Panna",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Shahdol",
    "Shivpuri",
    "Singrauli",
    "Ujjain",
    "Vidisha",
  ],
  BR: [
    "Araria",
    "Aurangabad",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Katihar",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sitamarhi",
    "Siwan",
    "Vaishali",
    "West Champaran",
  ],
};

// ─── Searchable Dropdown Component (Web Equivalent) ─────────────────────────
function SearchableDropdown({
  label,
  placeholder,
  value,
  items,
  onSelect,
  disabled,
  disabledMessage,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="fr-form-group"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <label className="fr-label">{label} *</label>
      <div
        className={`fr-input ${disabled ? "fr-disabled" : ""}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ color: value ? "inherit" : "#aaa" }}>
          {value ? t(value) : placeholder}
        </span>
        {loading ? (
          <div className="fr-spinner fr-spinner-small" />
        ) : (
          <span>▼</span>
        )}
      </div>

      {disabled && disabledMessage && (
        <div className="fr-input-hint" style={{ color: "#E76F51" }}>
          ⚠ {disabledMessage}
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
            marginTop: "4px",
            maxHeight: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "8px" }}>
            <input
              type="text"
              className="fr-input"
              placeholder={t("Type to filter...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    backgroundColor: item === value ? "#f0faf9" : "transparent",
                    color: item === value ? "#2A9D8F" : "inherit",
                    fontWeight: item === value ? "bold" : "normal",
                  }}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f9f9f9")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor =
                      item === value ? "#f0faf9" : "transparent")
                  }
                >
                  {t(item)}
                </div>
              ))
            ) : (
              <div
                style={{ padding: "12px", textAlign: "center", color: "#aaa" }}
              >
                {t("No matches found")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Registration Screen ────────────────────────────────────────────────
export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { farmer, authFetch, updateFarmerLocal } = useFarmerAuth();

  // Form fields
  const [form, setForm] = useState({
    name: "",
    address: "",
    adharNumber: "",
  });

  // Location States
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [coordinates, setCoordinates] = useState(null);
  const [fetchingGps, setFetchingGps] = useState(false);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const stateCodeMap = useRef({});

  // ── Fetch States ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/location/states`);
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setStates(data.states.map((s) => s.state));
            stateCodeMap.current = Object.fromEntries(
              data.states.map((s) => [s.state, s.stateCode]),
            );
            console.log(states);
            setLoadingStates(false);
            return;
          }
        }
      } catch (err) {
        console.warn("States API unavailable, using built-in data.");
      }
      // Fallback
      setStates(STATIC_STATES.map((s) => s.state));
      stateCodeMap.current = Object.fromEntries(
        STATIC_STATES.map((s) => [s.state, s.stateCode]),
      );
      setLoadingStates(false);
    })();
  }, []);

  // ── Fetch Districts ──
  useEffect(() => {
    if (!selectedStateCode) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    (async () => {
      setLoadingDistricts(true);
      setSelectedDistrict("");
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/location/districts/${selectedStateCode}`,
        );
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success) {
            setDistricts(data.districts);
            setLoadingDistricts(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Districts API unavailable, using built-in data.");
      }
      // Fallback
      setDistricts(STATIC_DISTRICTS[selectedStateCode] || []);
      setLoadingDistricts(false);
    })();
  }, [selectedStateCode]);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedStateCode(stateCodeMap.current[state] || null);
    setErrors((er) => ({ ...er, state: "" }));
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setErrors((er) => ({ ...er, district: "" }));
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setApiError("");
  };

  // ── Get GPS Location (HTML5) ──
  const getCurrentLocation = () => {
    setFetchingGps(true);
    setErrors((er) => ({ ...er, coordinates: "" }));

    if (!navigator.geolocation) {
      alert(t("Geolocation is not supported by your browser"));
      setFetchingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFetchingGps(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert(t("Failed to get location. Please allow location permissions."));
        setFetchingGps(false);
      },
      { enableHighAccuracy: true },
    );
  };

  // ── Validation & Submit ──
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (!selectedState) errs.state = t("State is required");
    if (!selectedDistrict) errs.district = t("District is required");
    if (!form.address.trim()) errs.address = t("Address is required");
    if (form.adharNumber && form.adharNumber.replace(/\D/g, "").length !== 12)
      errs.adharNumber = t("Aadhaar must be 12 digits");
    if (!coordinates) errs.coordinates = t("Please map your home location");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/api/farmer-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim(),
          adharNumber: form.adharNumber.replace(/\D/g, ""),
          state: selectedState,
          district: selectedDistrict,
          coordinates: coordinates,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || t("Registration failed"));
      }

      const data = await res.json();
      updateFarmerLocal({ ...data.farmer, profileComplete: true });
      navigate("/fasalrath/dashboard", { replace: true });
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        navigate("/fasalrath/login", { replace: true });
      } else {
        setApiError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div
        className="fr-auth-card fr-slide-up"
        style={{ maxWidth: 520, margin: "20px auto" }}
      >
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark">📋</div>
          <div className="fr-auth-title">{t("Complete Your Profile")}</div>
          <div className="fr-auth-subtitle">
            {t("Fill in the details to get started")}
          </div>
        </div>

        <div className="fr-auth-body">
          {apiError && (
            <div className="fr-alert fr-alert-error">
              <span>⚠</span> {apiError}
            </div>
          )}

          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <span>
              {t("Your mobile number is already verified")}:{" "}
              <strong>+91 {farmer?.phone?.replace("+91", "")}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* --- Personal Info --- */}
            <div
              style={{
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h4 style={{ color: "#2A9D8F", marginBottom: "15px" }}>
                {t("Personal Information")}
              </h4>

              <div className="fr-form-group">
                <label className="fr-label">{t("Full Name")} *</label>
                <input
                  className={`fr-input ${errors.name ? "error" : ""}`}
                  type="text"
                  placeholder={t("Enter your full name")}
                  value={form.name}
                  onChange={set("name")}
                  autoFocus
                />
                {errors.name && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.name}
                  </div>
                )}
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Aadhaar Number")} *</label>
                <input
                  className={`fr-input ${errors.adharNumber ? "error" : ""}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="XXXX XXXX XXXX"
                  value={form.adharNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setForm((f) => ({ ...f, adharNumber: val }));
                    setErrors((er) => ({ ...er, adharNumber: "" }));
                  }}
                  maxLength={12}
                />
                {errors.adharNumber ? (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.adharNumber}
                  </div>
                ) : (
                  form.adharNumber.length > 0 &&
                  form.adharNumber.length < 12 && (
                    <div className="fr-input-hint" style={{ color: "#E76F51" }}>
                      {12 - form.adharNumber.length} {t("more digits needed")}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* --- Address Details --- */}
            <div
              style={{
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h4 style={{ color: "#2A9D8F", marginBottom: "15px" }}>
                {t("Address Details")}
              </h4>

              <SearchableDropdown
                label={t("State")}
                placeholder={t("Select State")}
                value={selectedState}
                items={states}
                onSelect={handleStateSelect}
                loading={loadingStates}
              />
              {errors.state && (
                <div
                  className="fr-input-error"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                >
                  <span>⚠</span> {errors.state}
                </div>
              )}

              <SearchableDropdown
                label={t("District")}
                placeholder={t("Select District")}
                value={selectedDistrict}
                items={districts}
                onSelect={handleDistrictSelect}
                disabled={!selectedState}
                disabledMessage={t("Please select a state first")}
                loading={loadingDistricts}
              />
              {errors.district && (
                <div
                  className="fr-input-error"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                >
                  <span>⚠</span> {errors.district}
                </div>
              )}

              <div className="fr-form-group">
                <label className="fr-label">
                  {t("Village / Town / Street")} *
                </label>
                <textarea
                  className={`fr-input ${errors.address ? "error" : ""}`}
                  placeholder={t("e.g. Village Rampur, Tehsil Sadar")}
                  value={form.address}
                  onChange={set("address")}
                  rows={2}
                  style={{ resize: "vertical" }}
                />
                {errors.address && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* --- Location Block --- */}
            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ color: "#2A9D8F", marginBottom: "5px" }}>
                {t("Home Location")}
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginBottom: "15px",
                }}
              >
                {t("We use this to connect you with nearby services")}
              </p>

              <div
                style={{
                  backgroundColor: coordinates ? "#f0faf9" : "#f4f6f8",
                  border: coordinates ? "2px solid #2A9D8F" : "2px dashed #ccc",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                {coordinates ? (
                  <>
                    <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                      📍
                    </div>
                    <div style={{ fontWeight: "bold", color: "#264653" }}>
                      {t("Location Saved")}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      Lat: {coordinates.lat.toFixed(5)}, Lng:{" "}
                      {coordinates.lng.toFixed(5)}
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="fr-btn fr-btn-outline"
                      style={{
                        marginTop: "15px",
                        padding: "6px 12px",
                        fontSize: "13px",
                      }}
                    >
                      {fetchingGps
                        ? t("Fetching...")
                        : t("Update GPS Location")}
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "36px",
                        marginBottom: "10px",
                        opacity: 0.5,
                      }}
                    >
                      🗺️
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#666",
                        marginBottom: "15px",
                      }}
                    >
                      {t("Pin Your Home")}
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={fetchingGps}
                      className="fr-btn fr-btn-teal"
                      style={{ width: "auto", padding: "8px 20px" }}
                    >
                      {fetchingGps ? (
                        <>
                          <span className="fr-spinner fr-spinner-small" />{" "}
                          {t("Detecting...")}
                        </>
                      ) : (
                        <>🎯 {t("Get Current Location")}</>
                      )}
                    </button>
                  </>
                )}
              </div>
              {errors.coordinates && (
                <div className="fr-input-error" style={{ marginTop: "8px" }}>
                  <span>⚠</span> {errors.coordinates}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-teal"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <div className="fr-spinner" /> {t("Saving...")}
                </>
              ) : (
                t("Complete Registration →")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
