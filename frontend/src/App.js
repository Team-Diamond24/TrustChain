import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Manufacturer from "./pages/Manufacturer";
import SupplyChain from "./pages/SupplyChain";
import PatientVerify from "./pages/PatientVerify";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0F1E]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Manufacturer />} />
            <Route path="/chain" element={<SupplyChain />} />
            <Route path="/verify/:tokenId" element={<PatientVerify />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
