// src/fasalrath/components/govt/PortalLayout.jsx
import React from "react";
import GovtPortalTopbar from "./PortalTopbar";
import GovtPortalSidebar from "./PortalSidebar";

export default function GovtPortalLayout({ children }) {
  return (
    <>
      <GovtPortalTopbar />
      <div className="fr-dashboard">
        <GovtPortalSidebar />
        <main className="fr-main">{children}</main>
      </div>
    </>
  );
}
