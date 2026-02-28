import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProvider, getContract } from "../utils/contract";

export default function PatientVerify() {
    const { tokenId } = useParams();
    const [batchInfo, setBatchInfo] = useState(null);
    const [trail, setTrail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (tokenId) fetchVerification(tokenId);
    }, [tokenId]);

    const fetchVerification = async (id) => {
        try {
            setLoading(true);
            const provider = getProvider();
            const contract = getContract(provider);
            const [info, custodyTrail] = await contract.verifyBatch(parseInt(id));

            setBatchInfo({
                ipfsHash: info.ipfsHash,
                batchId: info.batchId,
                drugName: info.drugName,
                manufacturer: info.manufacturer,
                mintedAt: new Date(info.mintedAt.toNumber() * 1000).toLocaleDateString(),
                isAuthentic: info.isAuthentic,
            });

            setTrail(
                custodyTrail.map((r) => ({
                    address: r.holder,
                    timestamp: new Date(r.timestamp.toNumber() * 1000).toLocaleString(),
                    role: r.role,
                }))
            );
        } catch (err) {
            setError("Token not found or contract error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const roleIcons = {
        Manufacturer: "🏭",
        Distributor: "🚛",
        Stockist: "📦",
        Pharmacy: "🏥",
        Patient: "👤",
    };

    if (loading)
        return (
            <div className="page-container verify-loading">
                <div className="loading-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                    <div className="loading-icon">🔍</div>
                </div>
                <h3 className="loading-text">Verifying on Ethereum blockchain...</h3>
                <p className="loading-sub">Checking Token #{tokenId}</p>
            </div>
        );

    if (error)
        return (
            <div className="page-container">
                <div className="verify-badge verify-fail">
                    <div className="verify-icon-large">❌</div>
                    <h2>Verification Failed</h2>
                    <p>{error}</p>
                </div>
            </div>
        );

    const isFullyVerified = batchInfo?.isAuthentic && trail.length >= 4;

    return (
        <div className="page-container">
            {/* Verification Badge */}
            <div className={`verify-badge ${isFullyVerified ? "verify-pass" : "verify-fail"}`}>
                <div className="verify-icon-large">
                    {isFullyVerified ? "✅" : "⚠️"}
                </div>
                <h2 className="verify-title">
                    {isFullyVerified ? "AUTHENTIC MEDICINE" : "VERIFICATION INCOMPLETE"}
                </h2>
                <p className="verify-sub">
                    Verified on Ethereum Sepolia Blockchain · Token #{tokenId}
                </p>
                <div className="verify-stats">
                    <div className="verify-stat">
                        <span className="stat-value">{trail.length}</span>
                        <span className="stat-label">Custody Steps</span>
                    </div>
                    <div className="verify-stat">
                        <span className="stat-value">{isFullyVerified ? "Yes" : "No"}</span>
                        <span className="stat-label">Authentic</span>
                    </div>
                </div>
            </div>

            {/* Batch Info Card */}
            {batchInfo && (
                <div className="card">
                    <h3 className="card-title">💊 Batch Information</h3>
                    <div className="info-grid">
                        {[
                            ["Drug Name", batchInfo.drugName, "💊"],
                            ["Batch ID", batchInfo.batchId, "🏷️"],
                            ["Manufacturer", batchInfo.manufacturer, "🏭"],
                            ["Minted On", batchInfo.mintedAt, "📅"],
                            ["IPFS Hash", batchInfo.ipfsHash, "📁"],
                        ].map(([label, value, icon]) => (
                            <div key={label} className="info-row">
                                <span className="info-icon">{icon}</span>
                                <span className="info-label">{label}</span>
                                <span className="info-value">
                                    {label === "IPFS Hash"
                                        ? `${value.slice(0, 16)}...`
                                        : value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Custody Trail */}
            <div className="card">
                <h3 className="card-title">🔗 Chain of Custody (On-Chain)</h3>
                <div className="verify-trail">
                    {trail.map((record, i) => (
                        <div key={i} className="verify-trail-item">
                            <div className="verify-trail-number">
                                <div className="trail-num-circle">{i + 1}</div>
                                {i < trail.length - 1 && <div className="trail-connector" />}
                            </div>
                            <div className="verify-trail-content">
                                <div className="verify-trail-header">
                                    <span className="trail-role-icon">
                                        {roleIcons[record.role] || "📍"}
                                    </span>
                                    <span className="verify-trail-role">{record.role}</span>
                                    <span className="verify-trail-check">✓</span>
                                </div>
                                <div className="verify-trail-address">
                                    {record.address.slice(0, 10)}...{record.address.slice(-6)}
                                </div>
                                <div className="verify-trail-time">{record.timestamp}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Etherscan Link */}
            <div className="card etherscan-card">
                <div className="etherscan-content">
                    <span className="etherscan-icon">🔒</span>
                    <div>
                        <p className="etherscan-text">
                            This verification is powered by the Ethereum Sepolia blockchain.
                            The data above cannot be altered or faked.
                        </p>
                        <a
                            href={`https://sepolia.etherscan.io/token/0xYOUR_CONTRACT_ADDRESS?a=${tokenId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="etherscan-link"
                        >
                            View on Etherscan ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
