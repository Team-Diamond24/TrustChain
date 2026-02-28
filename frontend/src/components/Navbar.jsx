import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { connectWallet } from "../utils/contract";

export default function Navbar() {
    const [walletAddress, setWalletAddress] = useState("");
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        try {
            setConnecting(true);
            const { address } = await connectWallet();
            setWalletAddress(address);
        } catch (err) {
            console.error("Wallet connection failed:", err.message);
        } finally {
            setConnecting(false);
        }
    };

    const linkClasses = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive ? "text-[#38BDF8]" : "text-[#94A3B8] hover:text-white"
        }`;

    return (
        <nav className="bg-[#0A0F1E] border-b border-[#1E293B] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <span className="text-lg">🔗</span>
                    <span className="font-grotesk font-bold text-white text-lg tracking-tight">
                        TrustChain
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white px-2 py-0.5 rounded-full">
                        Supply
                    </span>
                </NavLink>

                {/* Nav Links */}
                <div className="hidden sm:flex items-center gap-6">
                    <NavLink to="/" end className={linkClasses}>
                        Manufacturer
                    </NavLink>
                    <NavLink to="/chain" className={linkClasses}>
                        Supply Chain
                    </NavLink>
                    <NavLink to="/verify/1" className={linkClasses}>
                        Verify
                    </NavLink>
                </div>

                {/* Wallet */}
                <div>
                    {walletAddress ? (
                        <div className="flex items-center gap-2 bg-[#111827] border border-[#1E293B] rounded-full px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            <span className="text-xs font-mono text-[#94A3B8]">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="text-xs font-semibold bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {connecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile nav */}
            <div className="sm:hidden flex items-center justify-center gap-6 pb-3">
                <NavLink to="/" end className={linkClasses}>
                    Manufacturer
                </NavLink>
                <NavLink to="/chain" className={linkClasses}>
                    Supply Chain
                </NavLink>
                <NavLink to="/verify/1" className={linkClasses}>
                    Verify
                </NavLink>
            </div>
        </nav>
    );
}
