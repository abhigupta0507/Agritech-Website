import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useFarmerAuth } from "../context/FarmerAuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useFarmerAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div className="fr-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/fasalrath/login" state={{ from: location }} replace />;
  }

  return children;
}
