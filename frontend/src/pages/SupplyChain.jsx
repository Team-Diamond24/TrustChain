import React, { useState } from "react";
import { connectWallet, getContract } from "../utils/contract";

// Pre-loaded demo wallet addresses for simulation
// Replace these with real wallet addresses for actual transfers
const SUPPLY_CHAIN_ACTORS = [
    { role: "Distributor", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", color: "#F59E0B", icon: "🚛" },
    { role: "Stockist", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", color: "#8B5CF6", icon: "📦" },
    { role: "Pharmacy", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", color: "#10B981", icon: "🏥" },
];

const ALL_STEPS = [
    { name: "Manufacturer", icon: "🏭", color: "#38BDF8" },
    { name: "Distributor", icon: "🚛", color: "#F59E0B" },
    { name: "Stockist", icon: "📦", color: "#8B5CF6" },
    { name: "Pharmacy", icon: "🏥", color: "#10B981" },
    { name: "Patient", icon: "👤", color: "#EC4899" },
];

const ROLE_COLORS = {
    Manufacturer: "#38BDF8",
    Distributor: "#F59E0B",
    Stockist: "#8B5CF6",
    Pharmacy: "#10B981",
    Patient: "#EC4899",
};

const ROLE_BADGES = {
    Manufacturer: { text: "ORIGIN", bg: "rgba(56,189,248,0.15)", color: "#38BDF8" },
    Distributor: { text: "ACTIVE", bg: "rgba(245,158,11,0.15)", color: "#F59E0B" },
    Stockist: { text: "ACTIVE", bg: "rgba(139,92,246,0.15)", color: "#8B5CF6" },
    Pharmacy: { text: "ACTIVE", bg: "rgba(16,185,129,0.15)", color: "#10B981" },
    Patient: { text: "FINAL", bg: "rgba(236,72,153,0.15)", color: "#EC4899" },
};

export default function SupplyChain() {
    const [tokenId, setTokenId] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [trail, setTrail] = useState([]);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (currentStep >= SUPPLY_CHAIN_ACTORS.length) {
            setStatus("✅ Full supply chain complete! Ready for patient verification.");
            return;
        }

        try {
            setLoading(true);
            const actor = SUPPLY_CHAIN_ACTORS[currentStep];
            setStatus(`Connecting wallet to transfer to ${actor.role}...`);

            const { signer } = await connectWallet();
            const contract = getContract(signer);

            const tx = await contract.transferCustody(
                parseInt(tokenId),
                actor.address,
                actor.role
            );
            setStatus("⏳ Waiting for blockchain confirmation...");
            await tx.wait();

            setTrail((prev) => [
                ...prev,
                { ...actor, timestamp: new Date().toLocaleString() },
            ]);
            setCurrentStep((prev) => prev + 1);
            setStatus(`✅ Custody transferred to ${actor.role}`);
        } catch (err) {
            setStatus(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isComplete = currentStep >= SUPPLY_CHAIN_ACTORS.length;

    // Determine the "active" step index (1-indexed: Manufacturer=0 completed initially, first actor = step 1)
    // currentStep=0 means Manufacturer just minted, next transfer is to Distributor
    // After transfer, currentStep=1 means Distributor received it, etc.
    const activeStepIndex = currentStep + 1; // +1 because Manufacturer is step 0 and is always "done" once token exists

    return (
        <div className="bg-[#0A0F1E] min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <h1 className="font-grotesk font-bold text-[28px] text-white leading-tight">
                    Supply Chain Custody Transfer
                </h1>
                <p className="text-[#94A3B8] text-sm mt-1">
                    Real-time Web3 pharmaceutical verification dashboard
                </p>

                {/* Stepper */}
                <div className="tc-card mt-8">
                    <div className="flex items-start justify-between px-2 sm:px-4">
                        {ALL_STEPS.map((step, i) => {
                            const isCompleted = i < activeStepIndex;
                            const isActive = i === activeStepIndex;
                            const isPending = i > activeStepIndex;

                            return (
                                <React.Fragment key={step.name}>
                                    <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
                                        {/* Circle */}
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                        ${isCompleted ? "text-white" : ""}
                        ${isActive ? "text-white" : ""}
                        ${isPending ? "border-2 border-[#1E293B] text-[#475569]" : ""}
                      `}
                                            style={{
                                                background: isCompleted
                                                    ? "#10B981"
                                                    : isActive
                                                        ? step.color
                                                        : "transparent",
                                                ...(isActive
                                                    ? {
                                                        animation: "pulseGlow 2s ease-in-out infinite",
                                                        boxShadow: `0 0 0 0 ${step.color}66`,
                                                    }
                                                    : {}),
                                            }}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-base">{step.icon}</span>
                                            )}
                                        </div>
                                        {/* Label */}
                                        <span
                                            className={`text-[11px] mt-2 font-medium text-center uppercase tracking-wider
                        ${isCompleted || isActive ? "text-[#F1F5F9]" : "text-[#475569]"}
                      `}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {/* Connecting Line */}
                                    {i < ALL_STEPS.length - 1 && (
                                        <div className="flex-1 flex items-center pt-5">
                                            <div
                                                className="h-0.5 w-full rounded transition-all duration-500"
                                                style={{
                                                    background: i < activeStepIndex ? "#10B981" : "#1E293B",
                                                }}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Current Holder + Transfer Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                    {/* Left — QR Placeholder / visual */}
                    <div
                        className="lg:col-span-2 rounded-2xl overflow-hidden flex items-center justify-center min-h-[220px]"
                        style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                            border: "1px solid #1E293B",
                        }}
                    >
                        <div className="text-center p-6">
                            <div className="text-6xl mb-3 opacity-60">🔗</div>
                            <p className="text-[#475569] text-xs font-mono">
                                Token #{tokenId || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Right — Current Holder Info */}
                    <div className="lg:col-span-3 tc-card">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="font-grotesk font-bold text-[#F1F5F9] text-lg">
                                Current Holder
                            </h3>
                            {currentStep > 0 && trail.length > 0 && (
                                <span
                                    className="tc-badge text-[11px]"
                                    style={{
                                        background: ROLE_BADGES[trail[trail.length - 1]?.role]?.bg,
                                        color: ROLE_BADGES[trail[trail.length - 1]?.role]?.color,
                                    }}
                                >
                                    {trail[trail.length - 1]?.role?.toUpperCase()}
                                </span>
                            )}
                            {currentStep === 0 && (
                                <span className="tc-badge bg-[rgba(56,189,248,0.15)] text-[#38BDF8] text-[11px]">
                                    MANUFACTURER
                                </span>
                            )}
                        </div>

                        {/* Token ID Input */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-[#94A3B8] text-sm whitespace-nowrap">Token ID:</span>
                            <input
                                className="tc-input w-32"
                                value={tokenId}
                                onChange={(e) => setTokenId(e.target.value)}
                                placeholder="e.g. 1"
                            />
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-3">
                                <span className="text-[#94A3B8] text-sm min-w-[110px]">Wallet Address:</span>
                                <span className="font-mono text-sm text-[#38BDF8] bg-[rgba(56,189,248,0.08)] px-2 py-1 rounded">
                                    {trail.length > 0
                                        ? `${trail[trail.length - 1].address.slice(0, 8)}...${trail[trail.length - 1].address.slice(-4)}`
                                        : "0x0000...0000"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[#94A3B8] text-sm min-w-[110px]">Last Verified:</span>
                                <span className="text-sm text-[#F1F5F9]">
                                    {trail.length > 0 ? trail[trail.length - 1].timestamp : "—"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[#94A3B8] text-sm min-w-[110px]">Status:</span>
                                <span className="flex items-center gap-1.5 text-sm text-[#10B981]">
                                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                    On-Chain Verified
                                </span>
                            </div>
                        </div>

                        {/* Transfer Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleTransfer}
                                disabled={loading || !tokenId || isComplete}
                                className="tc-btn-secondary px-6"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : isComplete ? (
                                    "✅ All Transfers Complete"
                                ) : (
                                    `➡️ Transfer to ${SUPPLY_CHAIN_ACTORS[currentStep]?.role}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="tc-card mt-4">
                        <p className="text-[#94A3B8] text-sm font-mono break-all">{status}</p>
                    </div>
                )}

                {/* On-Chain Custody Trail */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-grotesk font-bold text-[#F1F5F9] text-xl">
                            On-Chain Custody Trail
                        </h2>
                        <a
                            href={`https://sepolia.etherscan.io/`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#38BDF8] text-sm hover:underline"
                        >
                            View on Etherscan
                        </a>
                    </div>

                    <div className="space-y-3">
                        {/* Manufacturer Origin (always shown) */}
                        <div
                            className="tc-card p-4 animate-fade-in"
                            style={{ borderLeft: `4px solid #38BDF8` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                                        style={{ background: "rgba(56,189,248,0.1)" }}
                                    >
                                        🏭
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[#F1F5F9] text-sm">Manufacturer</span>
                                            <span
                                                className="tc-badge text-[10px]"
                                                style={{ background: "rgba(56,189,248,0.15)", color: "#38BDF8" }}
                                            >
                                                ORIGIN
                                            </span>
                                        </div>
                                        <span className="font-mono text-[11px] text-[#475569]">
                                            0x3f1B...92E4
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#F1F5F9] text-xs">—</p>
                                    <p className="text-[#475569] text-[10px]">—</p>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic trail records */}
                        {trail.map((record, i) => {
                            const badge = ROLE_BADGES[record.role] || { text: "ACTIVE", bg: "rgba(148,163,184,0.15)", color: "#94A3B8" };
                            return (
                                <div
                                    key={i}
                                    className="tc-card p-4 animate-slide-up"
                                    style={{
                                        borderLeft: `4px solid ${ROLE_COLORS[record.role] || "#94A3B8"}`,
                                        animationDelay: `${i * 100}ms`,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                                                style={{ background: `${ROLE_COLORS[record.role]}15` }}
                                            >
                                                {record.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-[#F1F5F9] text-sm">
                                                        {record.role}
                                                    </span>
                                                    <span
                                                        className="tc-badge text-[10px]"
                                                        style={{ background: badge.bg, color: badge.color }}
                                                    >
                                                        {badge.text}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-[11px] text-[#475569]">
                                                    {record.address.slice(0, 6)}...{record.address.slice(-4)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#F1F5F9] text-xs">{record.timestamp.split(",")[0]}</p>
                                            <p className="text-[#475569] text-[10px]">{record.timestamp.split(",")[1]?.trim()}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Upcoming steps (greyed out) */}
                        {SUPPLY_CHAIN_ACTORS.slice(currentStep).map((actor, i) => (
                            <div key={`pending-${i}`} className="tc-card p-4 opacity-40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-[#1E293B]">
                                            {actor.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[#475569] text-sm">{actor.role}</span>
                                                <span className="tc-badge text-[10px] bg-[rgba(148,163,184,0.1)] text-[#475569]">
                                                    PENDING
                                                </span>
                                            </div>
                                            <span className="font-mono text-[11px] text-[#475569]">
                                                0x... · To be assigned
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#475569] text-xs">—, ——</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-6 border-t border-[#1E293B] text-center">
                    <p className="text-[#475569] text-xs">
                        🔗 Powered by TrustChain Protocol • Secure Immutable Supply Chain Records
                    </p>
                </footer>
            </div>
        </div>
    );
}
