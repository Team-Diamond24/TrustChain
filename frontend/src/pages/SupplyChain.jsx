import React, { useState } from "react";
import { connectWallet, getContract } from "../utils/contract";

// Pre-loaded demo wallet addresses for simulation
// Replace these with real wallet addresses for actual transfers
const SUPPLY_CHAIN_ACTORS = [
    { role: "Distributor", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", color: "#f59e0b", icon: "🚛" },
    { role: "Stockist", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", color: "#8b5cf6", icon: "📦" },
    { role: "Pharmacy", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", color: "#10b981", icon: "🏥" },
];

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

    const steps = [
        { name: "Manufacturer", icon: "🏭" },
        ...SUPPLY_CHAIN_ACTORS.map((a) => ({ name: a.role, icon: a.icon })),
        { name: "Patient", icon: "👤" },
    ];

    const isComplete = currentStep >= SUPPLY_CHAIN_ACTORS.length;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-icon chain-icon">🔄</div>
                <div>
                    <h2 className="page-title">Supply Chain Custody Transfer</h2>
                    <p className="page-subtitle">
                        Simulate the batch moving through the supply chain
                    </p>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">🔑 Enter Token ID</h3>
                <div className="form-group">
                    <label className="form-label">
                        <span className="form-icon">🏷️</span>
                        Token ID (from Manufacturer page)
                    </label>
                    <input
                        className="form-input"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        placeholder="e.g. 1"
                        style={{ maxWidth: "200px" }}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card">
                <h3 className="card-title">📍 Chain Progress</h3>
                <div className="progress-track">
                    {steps.map((step, i) => (
                        <React.Fragment key={step.name}>
                            <div className={`progress-node ${i < currentStep ? "completed" : i === currentStep ? "active" : "pending"}`}>
                                <div className="progress-circle">
                                    {i < currentStep ? (
                                        <span className="check-icon">✓</span>
                                    ) : (
                                        <span className="step-icon">{step.icon}</span>
                                    )}
                                </div>
                                <span className="progress-label">{step.name}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`progress-line ${i < currentStep ? "progress-line-active" : ""}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={handleTransfer}
                    disabled={loading || !tokenId || isComplete}
                    className={`btn btn-chain btn-full ${loading ? "btn-loading" : ""} ${isComplete ? "btn-complete" : ""}`}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span> Processing on-chain...
                        </>
                    ) : isComplete ? (
                        "✅ All Transfers Complete"
                    ) : (
                        `➡️ Transfer to ${SUPPLY_CHAIN_ACTORS[currentStep]?.role}`
                    )}
                </button>
            </div>

            {status && (
                <div className={`status-bar ${status.includes("❌") ? "status-error" : status.includes("✅") ? "status-success" : "status-info"}`}>
                    <p>{status}</p>
                </div>
            )}

            {/* Live Trail */}
            {trail.length > 0 && (
                <div className="card">
                    <h3 className="card-title">📋 On-Chain Custody Trail</h3>
                    <div className="trail-list">
                        {trail.map((record, i) => (
                            <div
                                key={i}
                                className="trail-item"
                                style={{ "--accent-color": record.color }}
                            >
                                <div className="trail-icon">{record.icon}</div>
                                <div className="trail-info">
                                    <div className="trail-role">{record.role}</div>
                                    <div className="trail-address">
                                        {record.address.slice(0, 6)}...{record.address.slice(-4)}
                                    </div>
                                </div>
                                <div className="trail-time">{record.timestamp}</div>
                                <div className="trail-check">✓</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
