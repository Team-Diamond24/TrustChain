import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Manufacturer from "./pages/Manufacturer";
import SupplyChain from "./pages/SupplyChain";
import PatientVerify from "./pages/PatientVerify";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-brand">
              <span className="brand-icon">🔗</span>
              <span className="brand-text">TrustChain</span>
              <span className="brand-badge">Supply</span>
            </div>
            <div className="nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-active" : ""}`
                }
              >
                <span className="nav-icon">🏭</span>
                Manufacturer
              </NavLink>
              <NavLink
                to="/chain"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-active" : ""}`
                }
              >
                <span className="nav-icon">🔄</span>
                Supply Chain
              </NavLink>
              <NavLink
                to="/verify/1"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-active" : ""}`
                }
              >
                <span className="nav-icon">✅</span>
                Patient Verify
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Manufacturer />} />
            <Route path="/chain" element={<SupplyChain />} />
            <Route path="/verify/:tokenId" element={<PatientVerify />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>
            Powered by Ethereum Sepolia · Built for HackSamarth 2026
          </p>
        </footer>
      </div>
    </Router>
  );
}
