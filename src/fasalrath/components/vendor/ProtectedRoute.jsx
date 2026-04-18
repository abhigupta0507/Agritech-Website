import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useVendorAuth } from "../../context/VendorAuthContext";

export default function VendorProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useVendorAuth();
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
      <Navigate
        to="/fasalrath/vendor/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
