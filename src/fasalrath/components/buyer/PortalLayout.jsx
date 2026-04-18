// src/fasalrath/components/buyer/PortalLayout.jsx
import React from "react";
import BuyerPortalTopbar from "./PortalTopbar";

export default function BuyerPortalLayout({ children }) {
  return (
    <>
      <BuyerPortalTopbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {children}
      </div>
    </>
  );
}
