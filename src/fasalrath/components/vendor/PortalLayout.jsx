// src/fasalrath/components/vendor/PortalLayout.jsx
import React from "react";
import VendorPortalTopbar from "./PortalTopbar";

export default function VendorPortalLayout({ children }) {
  return (
    <>
      <VendorPortalTopbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {children}
      </div>
    </>
  );
}
