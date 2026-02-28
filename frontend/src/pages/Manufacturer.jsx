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
        { key: "batchId", label: "Batch ID", placeholder: "e.g. BATCH-2026-001", icon: "🏷️" },
        { key: "drugName", label: "Drug Name", placeholder: "e.g. Paracetamol 500mg", icon: "💊" },
        { key: "manufacturerName", label: "Manufacturer", placeholder: "e.g. Sun Pharma", icon: "🏭" },
        { key: "expiryDate", label: "Expiry Date", placeholder: "e.g. 2027-12-31", icon: "📅" },
        { key: "composition", label: "Composition", placeholder: "e.g. Paracetamol IP 500mg", icon: "🧪" },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-icon manufacturer-icon">🏭</div>
                <div>
                    <h2 className="page-title">Manufacturer Dashboard</h2>
                    <p className="page-subtitle">
                        Mint a new medicine batch as an NFT on Ethereum Sepolia
                    </p>
                </div>
            </div>

            {walletAddress && (
                <div className="wallet-badge">
                    <span className="wallet-dot"></span>
                    Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
            )}

            <div className="card">
                <h3 className="card-title">📋 Batch Details</h3>
                {fields.map((field) => (
                    <div key={field.key} className="form-group">
                        <label className="form-label">
                            <span className="form-icon">{field.icon}</span>
                            {field.label}
                        </label>
                        <input
                            className="form-input"
                            value={form[field.key]}
                            onChange={(e) =>
                                setForm({ ...form, [field.key]: e.target.value })
                            }
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}

                <button
                    onClick={handleMint}
                    disabled={loading || !form.batchId || !form.drugName}
                    className={`btn btn-primary btn-full ${loading ? "btn-loading" : ""}`}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span> Processing...
                        </>
                    ) : (
                        "🔗 Mint Batch NFT"
                    )}
                </button>
            </div>

            {status && (
                <div className={`status-bar ${status.includes("❌") ? "status-error" : status.includes("✅") ? "status-success" : "status-info"}`}>
                    <p>{status}</p>
                </div>
            )}

            {mintedTokenId && (
                <div className="card qr-card">
                    <div className="qr-header">
                        <h3 className="card-title">🎉 Batch NFT Minted Successfully!</h3>
                        <div className="token-badge">Token #{mintedTokenId}</div>
                    </div>
                    <p className="qr-subtitle">
                        Share this QR code with supply chain actors and the end patient
                    </p>
                    <div className="qr-wrapper">
                        <QRCode
                            value={`${window.location.origin}/verify/${mintedTokenId}`}
                            size={200}
                            bgColor="transparent"
                            fgColor="#e0e7ff"
                        />
                    </div>
                    <p className="qr-link">
                        {window.location.origin}/verify/{mintedTokenId}
                    </p>
                </div>
            )}
        </div>
    );
}
