// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import { FarmerAuthProvider } from "./context/FarmerAuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import PortalTopbar from "./components/PortalTopbar";
// import PortalLayout from "./components/PortalLayout";

// import LoginPage from "./pages/LoginPage";
// import OtpPage from "./pages/OtpPage";
// import RegisterPage from "./pages/Farmer/RegisterPage";
// import DashboardPage from "./pages/Farmer/DashboardPage";
// import ProfilePage from "./pages/Farmer/ProfilePage";
// import FarmPage from "./pages/Farmer/FarmPage";
// import HarvestPage from "./pages/Farmer/HarvestPage";
// import QualityPage from "./pages/Farmer/QualityPage";
// import ComingSoonPage from "./pages/ComingSoonPage";
// import QuizzesPage from "./pages/Farmer/QuizzesPage";
// import AllActionsPage from "./pages/Farmer/AllActionsPage";
// import ExpensePredictionPage from "./pages/Farmer/ExpensePredictionPage";
// import FarmerOrdersPage from "./pages/Farmer/FarmerOrdersPage";
// import FarmerTransactionHistoryPage from "./pages/Farmer/FarmerTransactionHistoryPage";
// import MyOffersPage from "./pages/Farmer/MyOffersPage"; 
// import VendorMarketplacePage from "./pages/Farmer/VendorMarketplacePage";
// import ViewMspPage from "./pages/Farmer/ViewMspPage";

// import "./styles/portal.css";

// export default function FasalRathPortal() {
//   return (
//     <FarmerAuthProvider>
//       <div className="fr-portal">
//         <Routes>
//           {/* Auth routes */}
          

//           {/* Default redirect */}
//           <Route path="" element={<Navigate to="login" replace />} />
//           <Route path="*" element={<Navigate to="login" replace />} />
//         </Routes>
//       </div>
//     </FarmerAuthProvider>
//   );
// }
// src/fasalrath/index.jsx
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
// import GovtDashboardPage from "./pages/govt/DashboardPage";
// import GovtQualityGradingPage from "./pages/govt/QualityGradingPage";
// import GovtMspCompliancePage from "./pages/govt/MspCompliancePage";
// import GovtProfilePage from "./pages/govt/ProfilePage";

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
                  path="quality"
                  element={
                    <FarmerProtectedRoute>
                      <FarmerPortalLayout>
                        <QualityPage />
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
                        <ViewMspPage/>
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
                  path="profile"
                  element={
                    <VendorProtectedRoute>
                      <VendorPortalLayout>
                        <VendorProfilePage />
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
                {/* <Route path="login" element={<><GovtPortalTopbar /><GovtLoginPage /></>} />
              <Route path="otp" element={<><GovtPortalTopbar /><GovtOtpPage /></>} />
              <Route path="complete-profile" element={<GovtProtectedRoute><GovtPortalTopbar /><GovtCompleteProfilePage /></GovtProtectedRoute>} />
              <Route path="verification-pending" element={<GovtProtectedRoute><GovtPortalTopbar /><GovtVerificationPendingPage /></GovtProtectedRoute>} />
              <Route path="dashboard" element={<GovtProtectedRoute><GovtPortalLayout><GovtDashboardPage /></GovtPortalLayout></GovtProtectedRoute>} />
              <Route path="quality-grading" element={<GovtProtectedRoute><GovtPortalLayout><GovtQualityGradingPage /></GovtPortalLayout></GovtProtectedRoute>} />
              <Route path="msp-compliance" element={<GovtProtectedRoute><GovtPortalLayout><GovtMspCompliancePage /></GovtPortalLayout></GovtProtectedRoute>} />
              <Route path="profile" element={<GovtProtectedRoute><GovtPortalLayout><GovtProfilePage /></GovtPortalLayout></GovtProtectedRoute>} /> */}
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