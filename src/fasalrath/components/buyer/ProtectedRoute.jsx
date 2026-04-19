import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useBuyerAuth } from "../../context/BuyerAuthContext";

export default function BuyerProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useBuyerAuth();
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
        to="/fasalrath/buyer/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
