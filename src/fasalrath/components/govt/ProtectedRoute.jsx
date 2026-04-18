// src/fasalrath/components/govt/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGovtAuth } from "../../context/GovtAuthContext";

export default function GovtProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, employee } = useGovtAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="fr-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/fasalrath/govt/login" state={{ from: location }} replace />
    );
  }

  if (!employee?.profileComplete) {
    return <Navigate to="/fasalrath/govt/complete-profile" replace />;
  }

  if (employee?.verificationStatus !== "verified") {
    return <Navigate to="/fasalrath/govt/verification-pending" replace />;
  }

  return children;
}
