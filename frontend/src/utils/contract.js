import { ethers } from "ethers";
import TrustChainABI from "../abi/TrustChain.json";

// ⚠️ Replace with your deployed contract address after running:
// npx hardhat run scripts/deploy.js --network sepolia
const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

export const getProvider = () => {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    }
    throw new Error("MetaMask not found. Please install it.");
};

export const getContract = (signerOrProvider) => {
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        TrustChainABI.abi,
        signerOrProvider
    );
};

export const connectWallet = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = getProvider();
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { signer, address };
};
