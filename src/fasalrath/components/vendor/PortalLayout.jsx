import React from "react";
import VendorPortalTopbar from "./PortalTopbar";
import VendorPortalSidebar from "./PortalSidebar";

export default function VendorPortalLayout({ children }) {
  return (
    <>
      <VendorPortalTopbar />
      <div className="fr-dashboard">
        <VendorPortalSidebar />
        <main className="fr-main">
          {children}
        </main>
      </div>
    </>
  );
}
