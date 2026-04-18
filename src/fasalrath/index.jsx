import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { FarmerAuthProvider } from "./context/FarmerAuthContext";
import { VendorAuthProvider } from "./context/VendorAuthContext";
import { BuyerAuthProvider } from "./context/BuyerAuthContext";
import { GovtAuthProvider } from "./context/GovtAuthContext";

import RoleSelection from "./pages/RoleSelection";

// Farmer
import FarmerProtectedRoute from "./components/farmer/ProtectedRoute";
import FarmerPortalTopbar from "./components/farmer/PortalTopbar";
import FarmerPortalLayout from "./components/farmer/PortalLayout";
import FarmerLoginPage from "./pages/farmer/LoginPage";
import FarmerOtpPage from "./pages/farmer/OtpPage";
import FarmerRegisterPage from "./pages/farmer/RegisterPage";
import FarmerDashboardPage from "./pages/farmer/DashboardPage";
import FarmerProfilePage from "./pages/farmer/ProfilePage";
import FarmerFarmPage from "./pages/farmer/FarmPage";
import FarmerHarvestPage from "./pages/farmer/HarvestPage";
import FarmerQualityPage from "./pages/farmer/QualityPage";
import FarmerQuizzesPage from "./pages/farmer/QuizzesPage";
import FarmerComingSoonPage from "./pages/farmer/ComingSoonPage";
import ExpensePredictionPage from "./pages/farmer/ExpensePredictionPage";
import FarmerOrdersPage from "./pages/farmer/FarmerOrdersPage";
import FarmerTransactionHistoryPage from "./pages/farmer/FarmerTransactionHistoryPage";
import MyOffersPage from "./pages/farmer/MyOffersPage";
import QualityPage from "./pages/farmer/QualityPage";
import VendorMarketplacePage from "./pages/farmer/VendorMarketplacePage";
import ViewMspPage from "./pages/farmer/ViewMspPage";

// Vendor
import VendorProtectedRoute from "./components/vendor/ProtectedRoute";
import VendorPortalTopbar from "./components/vendor/PortalTopbar";
import VendorPortalLayout from "./components/vendor/PortalLayout";
import VendorLoginPage from "./pages/vendor/LoginPage";
import VendorOtpPage from "./pages/vendor/OtpPage";
import VendorRegisterPage from "./pages/vendor/RegisterPage";
import VendorProfilePage from "./pages/vendor/ProfilePage";
import VendorDashboardPage from "./pages/vendor/DashboardPage";
import VendorProductsPage from "./pages/vendor/ProductsPage";
import VendorOrdersPage from "./pages/vendor/OrdersPage";
import VendorAddEditProductPage from "./pages/vendor/AddEditProductPage";
import VendorTransactionsPage from "./pages/vendor/TransactionsPage";

// Buyer
import BuyerProtectedRoute from "./components/buyer/ProtectedRoute";
import BuyerPortalTopbar from "./components/buyer/PortalTopbar";
import BuyerPortalLayout from "./components/buyer/PortalLayout";
import BuyerLoginPage from "./pages/buyer/LoginPage";
import BuyerOtpPage from "./pages/buyer/OtpPage";
import BuyerRegisterPage from "./pages/buyer/RegisterPage";
import BuyerProfilePage from "./pages/buyer/ProfilePage";

// Govt
import GovtProtectedRoute from "./components/govt/ProtectedRoute";
import GovtPortalTopbar from "./components/govt/PortalTopbar";
import GovtPortalLayout from "./components/govt/PortalLayout";
import GovtLoginPage from "./pages/govt/LoginPage";
import GovtOtpPage from "./pages/govt/OtpPage";
import GovtCompleteProfilePage from "./pages/govt/CompleteProfilePage";
import GovtVerificationPendingPage from "./pages/govt/VerificationPendingPage";

import "./styles/portal.css";

export default function FasalRathPortal() {
  return (
    <div className="fr-portal">
      <Routes>
        <Route path="" element={<RoleSelection />} />

        {/* FARMER ROUTES */}
        <Route
          path="farmer/*"
          element={
            <FarmerAuthProvider>
              <Routes>
                <Route
                  path="login"
                  element={
                    <>
                      <FarmerPortalTopbar />
                      <FarmerLoginPage />
                    </>
                  }
                />
                <Route
                  path="otp"
                  element={
                    <>
                      <FarmerPortalTopbar />
                      <FarmerOtpPage />
                    </>
                  }
                />
                <Route
                  path="register"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalTopbar />
                      <FarmerRegisterPage />
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerDashboardPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerProfilePage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="farm"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerFarmPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="harvest"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerHarvestPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="quality"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerQualityPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="quizzes"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerQuizzesPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="marketplace"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <VendorMarketplacePage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="expense"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <ExpensePredictionPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerOrdersPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="wallet"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <FarmerTransactionHistoryPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="offers"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <MyOffersPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route
                  path="msp"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <ViewMspPage />
                      </FarmerPortalLayout>
                    </FarmerProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="login" replace />} />
              </Routes>
            </FarmerAuthProvider>
          }
        />

        {/* VENDOR ROUTES */}
        <Route
          path="vendor/*"
          element={
            <VendorAuthProvider>
              <Routes>
                <Route
                  path="login"
                  element={
                    <>
                      <VendorPortalTopbar />
                      <VendorLoginPage />
                    </>
                  }
                />
                <Route
                  path="otp"
                  element={
                    <>
                      <VendorPortalTopbar />
                      <VendorOtpPage />
                    </>
                  }
                />
                <Route
                  path="register"
                  element={
                    <>
                      <VendorPortalTopbar />
                      <VendorRegisterPage />
                    </>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorDashboardPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorProfilePage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="products"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorProductsPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorOrdersPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="add-product"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorAddEditProductPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="edit-product/:id"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorAddEditProductPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route
                  path="transactions"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorTransactionsPage />
                      </VendorPortalLayout>
                    </VendorProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="login" replace />} />
              </Routes>
            </VendorAuthProvider>
          }
        />

        {/* BUYER ROUTES */}
        <Route
          path="buyer/*"
          element={
            <BuyerAuthProvider>
              <Routes>
                <Route
                  path="login"
                  element={
                    <>
                      <BuyerPortalTopbar />
                      <BuyerLoginPage />
                    </>
                  }
                />
                <Route
                  path="otp"
                  element={
                    <>
                      <BuyerPortalTopbar />
                      <BuyerOtpPage />
                    </>
                  }
                />
                <Route
                  path="register"
                  element={
                    <>
                      <BuyerPortalTopbar />
                      <BuyerRegisterPage />
                    </>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <BuyerProtectedRoute>
                      <BuyerPortalLayout>
                        <BuyerProfilePage />
                      </BuyerPortalLayout>
                    </BuyerProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="login" replace />} />
              </Routes>
            </BuyerAuthProvider>
          }
        />

        {/* GOVT ROUTES */}
        <Route
          path="govt/*"
          element={
            <GovtAuthProvider>
              <Routes>
                <Route path="*" element={<Navigate to="login" replace />} />
              </Routes>
            </GovtAuthProvider>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
