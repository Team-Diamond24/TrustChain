require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY_MANUFACTURER || "";

// Build accounts array only if a valid private key is set
function getAccounts() {
    if (!PRIVATE_KEY || PRIVATE_KEY === "your_metamask_private_key_here") return [];
    if (PRIVATE_KEY.startsWith("0x") && PRIVATE_KEY.length === 66) return [PRIVATE_KEY];
    if (PRIVATE_KEY.length === 64) return [`0x${PRIVATE_KEY}`];
    return [];
}

module.exports = {
    solidity: "0.8.19",
    networks: {
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA_URL || "",
            accounts: getAccounts(),
        },
    },
};
