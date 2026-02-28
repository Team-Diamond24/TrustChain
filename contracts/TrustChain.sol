// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TrustChain is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Batch metadata stored per token
    struct BatchInfo {
        string ipfsHash;        // IPFS CID of full metadata JSON
        string batchId;         // Human-readable batch ID e.g. "BATCH-2026-001"
        string drugName;
        string manufacturer;
        uint256 mintedAt;
        bool isAuthentic;       // Can be set false if recalled
    }

    // Custody trail — array of (address, timestamp, role) per token
    struct CustodyRecord {
        address holder;
        uint256 timestamp;
        string role;            // "Manufacturer", "Distributor", "Stockist", "Pharmacy", "Patient"
    }

    mapping(uint256 => BatchInfo) public batches;
    mapping(uint256 => CustodyRecord[]) public custodyTrail;

    // Events — these appear on the blockchain explorer
    event BatchMinted(uint256 tokenId, string batchId, string drugName, address manufacturer);
    event CustodyTransferred(uint256 tokenId, address from, address to, string newRole);

    constructor() ERC721("TrustChain", "TRUST") {}

    // MANUFACTURER calls this to create a new batch NFT
    function mintBatch(
        address to,
        string memory ipfsHash,
        string memory batchId,
        string memory drugName,
        string memory manufacturerName
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);

        batches[newTokenId] = BatchInfo({
            ipfsHash: ipfsHash,
            batchId: batchId,
            drugName: drugName,
            manufacturer: manufacturerName,
            mintedAt: block.timestamp,
            isAuthentic: true
        });

        // First custody record = manufacturer
        custodyTrail[newTokenId].push(CustodyRecord({
            holder: to,
            timestamp: block.timestamp,
            role: "Manufacturer"
        }));

        emit BatchMinted(newTokenId, batchId, drugName, to);
        return newTokenId;
    }

    // SUPPLY CHAIN ACTORS call this to pass custody
    function transferCustody(
        uint256 tokenId,
        address to,
        string memory newHolderRole
    ) public {
        require(ownerOf(tokenId) == msg.sender, "Only current owner can transfer");

        // Record custody before transferring
        custodyTrail[tokenId].push(CustodyRecord({
            holder: to,
            timestamp: block.timestamp,
            role: newHolderRole
        }));

        // ERC721 transfer
        _transfer(msg.sender, to, tokenId);

        emit CustodyTransferred(tokenId, msg.sender, to, newHolderRole);
    }

    // PATIENT calls this to verify — read-only, no gas needed
    function verifyBatch(uint256 tokenId) public view returns (
        BatchInfo memory info,
        CustodyRecord[] memory trail
    ) {
        require(_exists(tokenId), "Token does not exist");
        return (batches[tokenId], custodyTrail[tokenId]);
    }

    // Get total minted
    function totalBatches() public view returns (uint256) {
        return _tokenIds.current();
    }
}
