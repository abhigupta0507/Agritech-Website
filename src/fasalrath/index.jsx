import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { FarmerAuthProvider } from "./context/FarmerAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PortalTopbar from "./components/PortalTopbar";
import PortalLayout from "./components/PortalLayout";

import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import RegisterPage from "./pages/Farmer/RegisterPage";
import DashboardPage from "./pages/Farmer/DashboardPage";
import ProfilePage from "./pages/Farmer/ProfilePage";
import FarmPage from "./pages/Farmer/FarmPage";
import HarvestPage from "./pages/Farmer/HarvestPage";
import QualityPage from "./pages/Farmer/QualityPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import QuizzesPage from "./pages/Farmer/QuizzesPage";
import AllActionsPage from "./pages/Farmer/AllActionsPage";
import ExpensePredictionPage from "./pages/Farmer/ExpensePredictionPage";
import FarmerOrdersPage from "./pages/Farmer/FarmerOrdersPage";
import FarmerTransactionHistoryPage from "./pages/Farmer/FarmerTransactionHistoryPage";
import MyOffersPage from "./pages/Farmer/MyOffersPage"; 
import VendorMarketplacePage from "./pages/Farmer/VendorMarketplacePage";
import ViewMspPage from "./pages/Farmer/ViewMspPage";

import "./styles/portal.css";

export default function FasalRathPortal() {
  return (
    <FarmerAuthProvider>
      <div className="fr-portal">
        <Routes>
          {/* Auth routes */}
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

          {/* ── Farm, Harvest, Quality pages ── */}
          <Route
            path="farm"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <FarmPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="harvest"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <HarvestPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="quality"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <QualityPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Placeholder pages (to be built step by step) ── */}
          <Route
            path="marketplace"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <VendorMarketplacePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="offers"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <MyOffersPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <FarmerOrdersPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="wallet"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <FarmerTransactionHistoryPage/>
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="msp"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ViewMspPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="expense-prediction"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ExpensePredictionPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="weather"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ComingSoonPage
                    title="Weather & Alerts"
                    icon="⛅"
                    description="Get field-specific weather forecasts and pest/disease alerts."
                  />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <QuizzesPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="iot"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ComingSoonPage
                    title="IoT Devices"
                    icon="📡"
                    description="Monitor your field sensors — soil moisture, temperature, weather stations."
                  />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="forecast"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <ComingSoonPage
                    title="Expense Forecast"
                    icon="💹"
                    description="AI-powered cost and revenue predictions for your upcoming season."
                  />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="all-actions"
            element={
              <ProtectedRoute>
                <PortalLayout>
                  <AllActionsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="" element={<Navigate to="login" replace />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </div>
    </FarmerAuthProvider>
  );
}
