const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const TrustChain = await hre.ethers.getContractFactory("TrustChain");
    const trustchain = await TrustChain.deploy();
    await trustchain.deployed();

    console.log("✅ TrustChain deployed to:", trustchain.address);
    console.log("📋 Save this address — you'll need it in the frontend!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
