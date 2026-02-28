<!-- TrustChain Supply · HackSamarth 2026 · IIT Kanpur -->

# 🔗 TrustChain Supply

*From Factory Floor to Patient Hand — Verified on Ethereum.*

![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=flat&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-f7df1e?style=flat&logo=hardhat&logoColor=black)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-ERC721-4E5EE4?style=flat&logo=openzeppelin&logoColor=white)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v5-2535A0?style=flat&logo=ethereum&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

![Ethereum Sepolia](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat&logo=ethereum&logoColor=white)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-0D1F3C?style=flat&logo=ipfs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat)

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Smart Contract](#smart-contract)
- [Demo Flow](#demo-flow)
- [Team](#team)
- [License](#license)

---

## Overview

TrustChain Supply is a decentralized pharmaceutical supply chain verification system built on Ethereum Sepolia. It allows manufacturers to mint medicine batch NFTs, tracks every custody transfer on-chain, and enables patients to verify medicine authenticity by scanning a QR code — all without trusting a centralized authority.

According to the WHO, an estimated **10% of medicines in low- and middle-income countries are substandard or falsified**, putting millions of lives at risk. TrustChain Supply addresses this by making the entire supply chain transparent and immutable on the blockchain.

Built for **HackSamarth 2026** (Web3 & Decentralized Systems track) at IIT Kanpur, Techkriti.

---

## The Problem

- **Counterfeit medicines kill thousands annually** — the global pharmaceutical counterfeiting market is worth over $200 billion, and patients in developing countries bear the brunt.
- **Existing QR codes are centralized and trivially copyable** — a printed QR code pointing to a company database can be duplicated, spoofed, or tampered with at any point in the supply chain.
- **Patients have no trustless way to verify what they're consuming** — there is no mechanism for an end consumer to independently validate a medicine's journey from factory to pharmacy without relying on intermediaries.

---

## How It Works

1. 🏭 **Manufacturer** mints a batch NFT on-chain — metadata (drug name, batch ID, composition, expiry) is stored on IPFS via Pinata.
2. 🔄 **Each supply chain actor** (Distributor → Stockist → Pharmacy) transfers custody on-chain, creating an immutable record of every handoff.
3. 📱 **Patient scans the QR code** printed on the medicine packaging at the pharmacy counter.
4. ✅ **Smart contract returns the verified ownership trail** — the patient sees a green shield if the full chain is intact, or a warning if it's not.

```
Manufacturer → [Solidity Contract] → Distributor → Stockist → Pharmacy
                       ↕
                  IPFS (Pinata)
                       ↕
                Patient Verification
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Smart Contract | Solidity 0.8.19 + OpenZeppelin ERC721 | NFT minting, custody logic |
| Blockchain | Ethereum Sepolia Testnet | Immutable transaction ledger |
| Development | Hardhat + ethers.js v5 | Compile, deploy, interact |
| Frontend | React.js + Tailwind CSS | User dashboard & UI |
| Storage | IPFS via Pinata | Immutable batch metadata |
| Wallet | MetaMask | Transaction signing |

---

## Project Structure

```
trustchain-supply/
├── contracts/
│   └── TrustChain.sol          # ERC721 contract with custody logic
├── scripts/
│   └── deploy.js               # Hardhat deploy script
├── hardhat.config.js
├── .env                        # Private keys & API keys (never commit)
├── .gitignore
└── frontend/
    ├── public/
    └── src/
        ├── App.jsx             # Router + Navbar
        ├── pages/
        │   ├── Manufacturer.jsx    # Mint batch NFT
        │   ├── SupplyChain.jsx     # Transfer custody
        │   └── PatientVerify.jsx   # Patient QR verification
        ├── components/
        │   ├── Navbar.jsx
        │   └── Stepper.jsx
        ├── utils/
        │   ├── contract.js     # ethers.js contract instance
        │   └── ipfs.js         # Pinata upload helper
        └── abi/
            └── TrustChain.json # Compiled contract ABI
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Sepolia ETH from faucet ([sepoliafaucet.com](https://sepoliafaucet.com))
- Alchemy account (free) — [alchemy.com](https://www.alchemy.com)
- Pinata account (free) — [pinata.cloud](https://www.pinata.cloud)

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/trustchain-supply.git
   cd trustchain-supply
   ```

2. **Install contract dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend && npm install
   ```

4. **Set up environment variables**

   See [Environment Variables](#environment-variables) below.

5. **Compile and deploy the contract**

   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```

6. **Copy ABI to frontend**

   ```bash
   cp artifacts/contracts/TrustChain.sol/TrustChain.json frontend/src/abi/
   ```

7. **Update contract address**

   Open `frontend/src/utils/contract.js` and replace `CONTRACT_ADDRESS` with your deployed address.

8. **Run the frontend**

   ```bash
   cd frontend && npm start
   ```

---

## Environment Variables

> **Note:** Create a `.env` file in the project root. Never commit this file.

```bash
# Alchemy RPC — Ethereum Sepolia
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# MetaMask manufacturer wallet private key
PRIVATE_KEY_MANUFACTURER=your_private_key_here

# Pinata IPFS credentials
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET=your_pinata_secret_key
```

```bash
# frontend/.env
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET=your_pinata_secret_key
```

---

## Smart Contract

### TrustChain.sol

The contract is ERC721-based with two core functions beyond standard NFT minting. Each batch is a unique token whose on-chain metadata tracks every custody transfer from manufacturer to patient.

| Function | Access | Description |
|----------|--------|-------------|
| `mintBatch()` | Manufacturer wallet | Mints batch NFT, stores IPFS hash on-chain |
| `transferCustody()` | Current token owner | Transfers NFT + appends custody record |
| `verifyBatch()` | Public (read-only) | Returns BatchInfo + full CustodyRecord array |
| `totalBatches()` | Public (read-only) | Returns count of minted batches |

> Deployed on Ethereum Sepolia. View contract on Etherscan: `[YOUR_CONTRACT_ADDRESS]`

---

## Demo Flow

1. Go to the **Manufacturer** tab → fill in batch details → click **Mint Batch NFT** → approve MetaMask → QR code appears.
2. Go to the **Supply Chain** tab → enter Token ID → click **Transfer** 3 times (Distributor, Stockist, Pharmacy).
3. Scan the QR code OR navigate to `/verify/1`.
4. See the green ✅ **AUTHENTIC MEDICINE** shield + full custody trail.


---

## License

MIT License © 2026
