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

    const isFullyVerified = batchInfo?.isAuthentic && trail.length >= 4;

    /* ====== LOADING STATE ====== */
    if (loading)
        return (
            <div className="bg-[#0A0F1E] min-h-screen flex flex-col items-center justify-center text-center px-4">
                {/* Shield icon */}
                <div className="relative mb-6">
                    <svg className="w-16 h-16 text-[#38BDF8]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L3 7v5c0 5.25 3.68 10.14 9 11.25C17.32 22.14 21 17.25 21 12V7l-9-5zm0 2.18l7 3.89v4.93c0 4.28-2.95 8.27-7 9.18-4.05-.91-7-4.9-7-9.18V8.07l7-3.89z" />
                    </svg>
                    {/* Shimmer bar */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full overflow-hidden bg-[#1E293B]">
                        <div
                            className="h-full w-1/2 rounded-full animate-shimmer"
                            style={{
                                background: "linear-gradient(90deg, transparent, #38BDF8, transparent)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                </div>
                <h3 className="font-grotesk font-semibold text-[#F1F5F9] text-lg mt-4">
                    Verifying on Ethereum blockchain...
                </h3>
                <p className="text-[#475569] text-sm mt-1 font-mono">
                    Token #{tokenId}
                </p>
            </div>
        );

    /* ====== ERROR STATE ====== */
    if (error)
        return (
            <div className="bg-[#0A0F1E] min-h-screen flex flex-col items-center justify-center text-center px-4">
                {/* Red Shield */}
                <div className="relative mb-4">
                    <svg className="w-20 h-20 text-[#EF4444]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L3 7v5c0 5.25 3.68 10.14 9 11.25C17.32 22.14 21 17.25 21 12V7l-9-5z" />
                    </svg>
                    <svg className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="font-grotesk font-bold text-[32px] text-[#EF4444] tracking-tight">
                    VERIFICATION FAILED
                </h2>
                <p className="text-[#94A3B8] text-sm mt-2 max-w-md">{error}</p>
            </div>
        );

    /* ====== SUCCESS / INCOMPLETE STATE ====== */
    return (
        <div className="bg-[#0A0F1E] min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                {/* ── Shield Verification Badge ── */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="relative inline-block mb-4">
                        <svg
                            className="w-20 h-20"
                            viewBox="0 0 24 24"
                            fill={isFullyVerified ? "#10B981" : "#F59E0B"}
                        >
                            <path d="M12 2L3 7v5c0 5.25 3.68 10.14 9 11.25C17.32 22.14 21 17.25 21 12V7l-9-5z" />
                        </svg>
                        {isFullyVerified ? (
                            <svg className="w-9 h-9 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">!</span>
                        )}
                    </div>

                    <h1
                        className="font-grotesk font-bold text-[32px] tracking-tight"
                        style={{ color: isFullyVerified ? "#10B981" : "#F59E0B" }}
                    >
                        {isFullyVerified ? "AUTHENTIC MEDICINE" : "VERIFICATION INCOMPLETE"}
                    </h1>
                    <p className="text-[#94A3B8] text-sm mt-1">
                        {isFullyVerified
                            ? "This product has been verified against the TrustChain decentralized ledger and is confirmed to be genuine."
                            : "This product has not completed the full supply chain verification."}
                    </p>
                    <div
                        className="inline-block mt-3 tc-badge text-xs"
                        style={{
                            background: isFullyVerified ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                            color: isFullyVerified ? "#10B981" : "#F59E0B",
                        }}
                    >
                        Token #{tokenId}
                    </div>
                </div>

                {/* ── Two Column: Batch Info + Chain of Custody ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ── Batch Information ── */}
                    {batchInfo && (
                        <div className="tc-card">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-lg">📋</span>
                                <h3 className="font-grotesk font-semibold text-[#F1F5F9] text-base">
                                    Batch Information
                                </h3>
                            </div>
                            <div className="divide-y divide-[#1E293B]">
                                {[
                                    ["Drug Name", batchInfo.drugName, false],
                                    ["Batch ID", batchInfo.batchId, true],
                                    ["Manufacturer", batchInfo.manufacturer, false],
                                    ["Minted On", batchInfo.mintedAt, false],
                                ].map(([label, value, isMono]) => (
                                    <div key={label} className="flex items-center justify-between py-3">
                                        <span className="text-[#94A3B8] text-sm">{label}</span>
                                        <span className={`text-[#F1F5F9] text-sm font-medium ${isMono ? "font-mono text-[#38BDF8]" : ""}`}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                                {/* IPFS Hash Row */}
                                <div className="py-3">
                                    <span className="text-[#94A3B8] text-sm block mb-1">IPFS Hash</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-[11px] font-mono text-[#475569] bg-[#0A0F1E] rounded px-2 py-1 break-all">
                                            {batchInfo.ipfsHash}
                                        </code>
                                        <a
                                            href={`https://ipfs.io/ipfs/${batchInfo.ipfsHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#38BDF8] hover:text-[#7dd3fc] flex-shrink-0"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Chain of Custody (vertical timeline) ── */}
                    <div className="tc-card">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-lg">🔗</span>
                            <h3 className="font-grotesk font-semibold text-[#F1F5F9] text-base">
                                Chain of Custody
                            </h3>
                        </div>

                        <div className="relative pl-6">
                            {/* Vertical line */}
                            <div
                                className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-[#1E293B]"
                            />

                            {trail.map((record, i) => {
                                const isLast = i === trail.length - 1;
                                const isTerminal = record.role === "Pharmacy" || record.role === "Patient";
                                return (
                                    <div
                                        key={i}
                                        className="relative flex gap-4 pb-6 last:pb-0 animate-slide-up"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    >
                                        {/* Node circle */}
                                        <div
                                            className="absolute -left-6 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono text-white z-10 flex-shrink-0"
                                            style={{
                                                background: isTerminal ? "#10B981" : "#38BDF8",
                                            }}
                                        >
                                            {i + 1}
                                        </div>

                                        {/* Content */}
                                        <div className="ml-6 min-w-0">
                                            <p className="font-semibold text-[#F1F5F9] text-sm">
                                                {record.role}
                                            </p>
                                            <p className="font-mono text-[11px] text-[#475569] mt-0.5 truncate">
                                                {record.address.slice(0, 6)}...{record.address.slice(-4)}
                                                {" · "}
                                                {record.timestamp.split(",")[0]}
                                            </p>
                                            {isLast && isTerminal && (
                                                <p className="text-[#10B981] text-xs mt-1 font-medium">
                                                    Final Verification Successful
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Etherscan Info Banner ── */}
                <div
                    className="mt-6 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{
                        background: "rgba(56,189,248,0.05)",
                        border: "1px solid #1E293B",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🔒</span>
                        <p className="text-[#94A3B8] text-sm">
                            Verified on Ethereum · Data is immutable and tamper-proof
                        </p>
                    </div>
                    <a
                        href={`https://sepolia.etherscan.io/token/0xYOUR_CONTRACT_ADDRESS?a=${tokenId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#38BDF8] text-sm font-medium hover:underline whitespace-nowrap"
                    >
                        View on Etherscan ↗
                    </a>
                </div>
            </div>
        </div>
    );
}
