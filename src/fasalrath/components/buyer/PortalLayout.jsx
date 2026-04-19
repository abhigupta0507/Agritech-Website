import React from "react";
import BuyerPortalTopbar from "./PortalTopbar";
import BuyerPortalSidebar from "./PortalSidebar";

export default function BuyerPortalLayout({ children }) {
  return (
    <>
      <BuyerPortalTopbar />
      <div className="fr-dashboard">
        <BuyerPortalSidebar />
        <main className="fr-main">{children}</main>
      </div>
    </>
  );
}
