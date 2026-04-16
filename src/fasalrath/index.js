import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FarmerAuthProvider } from "./context/FarmerAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PortalTopbar from "./components/PortalTopbar";
import PortalLayout from "./components/PortalLayout";

import LoginPage    from "./pages/LoginPage";
import OtpPage      from "./pages/OtpPage";
import RegisterPage from "./pages/Farmer/RegisterPage";
import DashboardPage from "./pages/Farmer/DashboardPage";
import ProfilePage  from "./pages/Farmer/ProfilePage";
import ComingSoonPage from "./pages/ComingSoonPage";

import "./styles/portal.css";

/**
 * FasalRath portal — mounted at /fasalrath in the main app.
 *
 * Usage in src/App.js:
 *   import FasalRathPortal from "./fasalrath";
 *   <Route path="/fasalrath/*" element={<FasalRathPortal />} />
 */
export default function FasalRathPortal() {
  return (
    <FarmerAuthProvider>
      <div className="fr-portal">
        <Routes>
          {/* ── Auth routes (no sidebar, topbar with no subnav) ── */}
          <Route
            path="login"
            element={
              <>
                <PortalTopbar />
                <LoginPage />
              </>
            }
          />
          <Route
            path="otp"
            element={
              <>
                <PortalTopbar />
                <OtpPage />
              </>
            }
          />
          <Route
            path="register"
            element={
              <ProtectedRoute>
                <PortalTopbar />
                <RegisterPage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected routes (sidebar layout) ── */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <DashboardPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ProfilePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Placeholder pages (to be built step by step) ── */}
          <Route path="farm" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="My Farm & Fields" icon="🌾" description="Manage your fields, plant crops, track growth and log harvests — all from your browser." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="harvest" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="My Harvest" icon="🌽" description="View all your crop outputs, request quality checks and list them for sale." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="marketplace" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Marketplace" icon="🛒" description="Browse seeds, fertilizers, equipment rentals from verified vendors." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="quality" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Quality Certificates" icon="📜" description="Track your quality inspection requests and download AGMARK certificates." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="offers" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="My Offers" icon="🤝" description="View and manage offers you've submitted to buyers on the pre-harvest marketplace." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="orders" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Orders" icon="📦" description="Track all your purchases and rentals from vendors." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="wallet" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Wallet & Transactions" icon="💰" description="View your complete income and expense history." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="msp" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="MSP Rates" icon="📊" description="View government Minimum Support Prices for your crops." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="weather" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Weather & Alerts" icon="⛅" description="Get field-specific weather forecasts and pest/disease alerts." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="quizzes" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Knowledge Quizzes" icon="📚" description="Learn and earn points with multilingual farming quizzes." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="iot" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="IoT Devices" icon="📡" description="Monitor your field sensors — soil moisture, temperature, weather stations." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="forecast" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="Expense Forecast" icon="💹" description="AI-powered cost and revenue predictions for your upcoming season." />
            </PortalLayout></ProtectedRoute>
          }/>
          <Route path="all-actions" element={
            <ProtectedRoute><PortalLayout>
              <ComingSoonPage title="All Features" icon="⚡" description="A full list of everything FasalRath can do for you." />
            </PortalLayout></ProtectedRoute>
          }/>

          {/* Default: redirect /fasalrath → login */}
          <Route path="" element={<Navigate to="login" replace />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </div>
    </FarmerAuthProvider>
  );
}
