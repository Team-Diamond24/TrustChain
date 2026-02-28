import React, { useState } from "react";
import { connectWallet, getContract } from "../utils/contract";
import { uploadMetadataToIPFS } from "../utils/ipfs";
import QRCode from "react-qr-code";

export default function Manufacturer() {
    const [form, setForm] = useState({
        batchId: "",
        drugName: "",
        manufacturerName: "",
        expiryDate: "",
        composition: "",
    });
    const [status, setStatus] = useState("");
    const [mintedTokenId, setMintedTokenId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const [txHash, setTxHash] = useState("");
    const [ipfsHashResult, setIpfsHashResult] = useState("");

    const handleMint = async () => {
        try {
            setLoading(true);
            setStatus("Connecting wallet...");

            const { signer, address } = await connectWallet();
            setWalletAddress(address);
            setStatus("Uploading metadata to IPFS...");

            const metadata = {
                name: `TrustChain Batch: ${form.batchId}`,
                drugName: form.drugName,
                batchId: form.batchId,
                manufacturer: form.manufacturerName,
                expiryDate: form.expiryDate,
                composition: form.composition,
                mintedAt: new Date().toISOString(),
            };

            const ipfsHash = await uploadMetadataToIPFS(metadata);
            setIpfsHashResult(ipfsHash);
            setStatus(`IPFS upload done ✅ CID: ${ipfsHash}. Minting NFT...`);

            const contract = getContract(signer);
            const tx = await contract.mintBatch(
                address,
                ipfsHash,
                form.batchId,
                form.drugName,
                form.manufacturerName
            );

            setStatus("Waiting for blockchain confirmation...");
            const receipt = await tx.wait();

            const event = receipt.events?.find((e) => e.event === "BatchMinted");
            const tokenId = event?.args?.tokenId?.toString();

            setMintedTokenId(tokenId);
            setTxHash(receipt.transactionHash);
            setStatus(
                `✅ Batch NFT minted! Token ID: ${tokenId} | TX: ${receipt.transactionHash}`
            );
        } catch (err) {
            setStatus(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: "batchId", label: "Batch ID", placeholder: "e.g. BTC-9921-X" },
        { key: "drugName", label: "Drug Name", placeholder: "e.g. Paracetamol 500mg" },
        { key: "manufacturerName", label: "Manufacturer Name", placeholder: "e.g. TrustChain Supply Labs Corp." },
        { key: "expiryDate", label: "Expiry Date", placeholder: "e.g. 2027-12-31" },
        { key: "composition", label: "Composition", placeholder: "Enter chemical active ingredients..." },
    ];

    return (
        <div className="bg-[#0A0F1E] min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <h1 className="font-grotesk font-bold text-[28px] text-white leading-tight">
                    Mint a New Medicine Batch
                </h1>
                <p className="text-[#94A3B8] text-sm mt-1">
                    Each batch becomes a unique NFT on Ethereum Sepolia
                </p>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT — Form (3/5) */}
                    <div className="lg:col-span-3">
                        <div className="tc-card">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[#38BDF8] text-lg">📋</span>
                                <h3 className="font-grotesk font-semibold text-[#F1F5F9] text-base">
                                    Batch Specifications
                                </h3>
                            </div>

                            {/* 2-col grid for first 2 fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {fields.slice(0, 2).map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-[#94A3B8] text-sm mb-1.5">
                                            {field.label}
                                        </label>
                                        <input
                                            className="tc-input"
                                            value={form[field.key]}
                                            onChange={(e) =>
                                                setForm({ ...form, [field.key]: e.target.value })
                                            }
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Full width field */}
                            <div className="mt-5">
                                <label className="block text-[#94A3B8] text-sm mb-1.5">
                                    {fields[2].label}
                                </label>
                                <input
                                    className="tc-input"
                                    value={form[fields[2].key]}
                                    onChange={(e) =>
                                        setForm({ ...form, [fields[2].key]: e.target.value })
                                    }
                                    placeholder={fields[2].placeholder}
                                />
                            </div>

                            {/* 2-col: Expiry + Composition */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                                <div>
                                    <label className="block text-[#94A3B8] text-sm mb-1.5">
                                        {fields[3].label}
                                    </label>
                                    <input
                                        className="tc-input"
                                        type="date"
                                        value={form[fields[3].key]}
                                        onChange={(e) =>
                                            setForm({ ...form, [fields[3].key]: e.target.value })
                                        }
                                        placeholder={fields[3].placeholder}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#94A3B8] text-sm mb-1.5">
                                        Dosage Form
                                    </label>
                                    <select
                                        className="tc-input"
                                        value={form.dosageForm || ""}
                                        onChange={(e) =>
                                            setForm({ ...form, dosageForm: e.target.value })
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Capsule">Capsule</option>
                                        <option value="Syrup">Syrup</option>
                                        <option value="Injection">Injection</option>
                                    </select>
                                </div>
                            </div>

                            {/* Composition textarea */}
                            <div className="mt-5">
                                <label className="block text-[#94A3B8] text-sm mb-1.5">
                                    {fields[4].label}
                                </label>
                                <textarea
                                    className="tc-input min-h-[80px] resize-y"
                                    value={form[fields[4].key]}
                                    onChange={(e) =>
                                        setForm({ ...form, [fields[4].key]: e.target.value })
                                    }
                                    placeholder={fields[4].placeholder}
                                />
                            </div>

                            {/* Mint Button */}
                            <button
                                onClick={handleMint}
                                disabled={loading || !form.batchId || !form.drugName}
                                className="tc-btn-primary w-full mt-6 text-base py-3"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin-slow h-5 w-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>🔗 Mint Batch NFT</>
                                )}
                            </button>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="tc-card mt-4">
                                <p className="text-[#94A3B8] text-sm font-mono break-all leading-relaxed">
                                    {status}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Success Card + Quick Insights (2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Success Card */}
                        {mintedTokenId ? (
                            <div
                                className="rounded-2xl p-6 text-center"
                                style={{
                                    background: "#111827",
                                    border: "1px solid #10B981",
                                    boxShadow: "0 0 20px rgba(16,185,129,0.15)",
                                }}
                            >
                                {/* QR Code */}
                                <div className="inline-flex p-4 rounded-xl bg-[#0A0F1E] border border-[#1E293B]">
                                    <QRCode
                                        value={`${window.location.origin}/verify/${mintedTokenId}`}
                                        size={180}
                                        bgColor="transparent"
                                        fgColor="#94A3B8"
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <span className="text-lg">✅</span>
                                    <h3 className="font-grotesk font-bold text-[#10B981] text-base">
                                        Batch Minted Successfully
                                    </h3>
                                </div>

                                {/* Info Rows */}
                                <div className="mt-4 space-y-3 text-left">
                                    <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                                        <span className="text-[#94A3B8] text-xs uppercase tracking-wider">Token ID</span>
                                        <span className="font-mono text-sm text-[#F1F5F9]">#{mintedTokenId}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                                        <span className="text-[#94A3B8] text-xs uppercase tracking-wider">IPFS Hash</span>
                                        <span className="font-mono text-sm text-[#F1F5F9]">
                                            {ipfsHashResult ? `${ipfsHashResult.slice(0, 8)}...${ipfsHashResult.slice(-4)}` : "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pb-1">
                                        <span className="text-[#94A3B8] text-xs uppercase tracking-wider">Status</span>
                                        <span className="tc-badge bg-[rgba(16,185,129,0.15)] text-[#10B981]">
                                            CONFIRMED
                                        </span>
                                    </div>
                                </div>

                                {/* Etherscan Link */}
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[#38BDF8] text-sm font-medium mt-4 hover:underline"
                                >
                                    View on Etherscan
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="tc-card flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-4xl mb-3 opacity-30">📦</div>
                                <p className="text-[#475569] text-sm">
                                    Mint a batch to see the NFT details and QR code here
                                </p>
                            </div>
                        )}

                        {/* Quick Insights Card */}
                        <div className="tc-card">
                            <h3 className="font-grotesk font-semibold text-[#F1F5F9] text-base mb-4">
                                Quick Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(56,189,248,0.1)] flex items-center justify-center text-[#38BDF8]">
                                        📊
                                    </div>
                                    <div>
                                        <p className="text-[#94A3B8] text-[11px] uppercase tracking-wider">Active Batches</p>
                                        <p className="text-[#F1F5F9] font-mono font-bold text-lg">—</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#8B5CF6]">
                                        🛡️
                                    </div>
                                    <div>
                                        <p className="text-[#94A3B8] text-[11px] uppercase tracking-wider">Security Score</p>
                                        <p className="text-[#F1F5F9] font-mono font-bold text-lg">99.8%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between text-[#475569] text-xs">
                    <p>🔗 TrustChain Supply © 2024</p>
                    <div className="flex gap-6 mt-2 sm:mt-0">
                        <span className="hover:text-[#94A3B8] cursor-pointer transition-colors">Smart Contract</span>
                        <span className="hover:text-[#94A3B8] cursor-pointer transition-colors">Whitepaper</span>
                        <span className="hover:text-[#94A3B8] cursor-pointer transition-colors">API Docs</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
