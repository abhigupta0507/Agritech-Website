import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGovtAuth } from "../../context/GovtAuthContext";

export default function GovtProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useGovtAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="govt-loading-container">
        <div className="govt-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/govt/login" state={{ from: location }} replace />;
  }

  return children;
}
