import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import FasalRathPortal from "./fasalrath";
function App() {
  return (
    <Router>
      <Routes>
        {/* ── FasalRath portal — NO Navbar/Footer ── */}
        <Route path="/fasalrath/*" element={<FasalRathPortal />} />

        {/* ── Existing public pages WITH Navbar/Footer ── */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<AboutUs />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
