import React from "react";
import PortalTopbar from "./PortalTopbar";
import PortalSidebar from "./PortalSidebar";

export default function PortalLayout({ children }) {
  return (
    <>
      <PortalTopbar />
      <div className="fr-dashboard">
        <PortalSidebar />
        <main className="fr-main">
          {children}
        </main>
      </div>
    </>
  );
}
