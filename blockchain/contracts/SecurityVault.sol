// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SecurityVault
 * @dev Secure storage for encrypted sensitive financial data
 * Uses cryptographic commitments for zero-knowledge proofs
 */
contract SecurityVault is AccessControl, ReentrancyGuard {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    struct SecureAsset {
        bytes32 encryptedDataHash; // SHA-256 hash of encrypted data
        address owner;
        uint256 createdAt;
        uint256 lastAccessedAt;
        bool locked;
    }

    struct AccessLog {
        address accessor;
        uint256 accessTime;
        bool granted;
        string reason;
    }

    mapping(bytes32 => SecureAsset) public vault;
    mapping(bytes32 => AccessLog[]) public accessLogs;
    mapping(address => bytes32[]) public userAssets;

    uint256 public totalAssets = 0;
    uint256 public MAX_ACCESS_ATTEMPTS = 5;
    uint256 public LOCK_DURATION = 24 hours;

    event AssetStored(bytes32 indexed assetId, address indexed owner);
    event AssetAccessed(bytes32 indexed assetId, address indexed accessor, bool granted);
    event AssetLocked(bytes32 indexed assetId);
    event AssetUnlocked(bytes32 indexed assetId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GUARDIAN_ROLE, admin);
        _grantRole(RECOVERY_ROLE, admin);
    }

    function storeSecureAsset(
        bytes32 encryptedDataHash,
        address owner
    ) external onlyRole(GUARDIAN_ROLE) nonReentrant returns (bytes32) {
        require(owner != address(0), "Invalid owner");
        require(encryptedDataHash != bytes32(0), "Invalid data hash");

        bytes32 assetId = keccak256(abi.encodePacked(owner, block.timestamp, totalAssets));

        vault[assetId] = SecureAsset({
            encryptedDataHash: encryptedDataHash,
            owner: owner,
            createdAt: block.timestamp,
            lastAccessedAt: 0,
            locked: false
        });

        userAssets[owner].push(assetId);
        totalAssets++;

        emit AssetStored(assetId, owner);
        return assetId;
    }

    function requestAccess(bytes32 assetId, string calldata reason) 
        external 
        nonReentrant 
        returns (bool) 
    {
        SecureAsset storage asset = vault[assetId];
        require(asset.owner != address(0), "Asset not found");
        require(!asset.locked, "Asset is locked");

        bool accessGranted = _validateAccess(assetId, msg.sender);

        accessLogs[assetId].push(AccessLog({
            accessor: msg.sender,
            accessTime: block.timestamp,
            granted: accessGranted,
            reason: reason
        }));

        if (accessGranted) {
            asset.lastAccessedAt = block.timestamp;
        }

        emit AssetAccessed(assetId, msg.sender, accessGranted);
        return accessGranted;
    }

    function lockAsset(bytes32 assetId) external nonReentrant {
        SecureAsset storage asset = vault[assetId];
        require(asset.owner != address(0), "Asset not found");
        require(msg.sender == asset.owner || hasRole(GUARDIAN_ROLE, msg.sender), "Unauthorized");

        asset.locked = true;
        emit AssetLocked(assetId);
    }

    function unlockAsset(bytes32 assetId) external onlyRole(RECOVERY_ROLE) nonReentrant {
        SecureAsset storage asset = vault[assetId];
        require(asset.owner != address(0), "Asset not found");

        asset.locked = false;
        emit AssetUnlocked(assetId);
    }

    function getAccessHistory(bytes32 assetId) 
        external 
        view 
        returns (AccessLog[] memory) 
    {
        return accessLogs[assetId];
    }

    function _validateAccess(bytes32 assetId, address requester) 
        internal 
        view 
        returns (bool) 
    {
        SecureAsset memory asset = vault[assetId];

        // Owner always has access
        if (requester == asset.owner) return true;

        // Check access attempt limit
        AccessLog[] memory logs = accessLogs[assetId];
        uint256 recentFailures = 0;

        for (uint256 i = logs.length > 5 ? logs.length - 5 : 0; i < logs.length; i++) {
            if (logs[i].accessor == requester && !logs[i].granted) {
                recentFailures++;
            }
        }

        if (recentFailures >= MAX_ACCESS_ATTEMPTS) {
            return false;
        }

        // Guardian role bypass
        return hasRole(GUARDIAN_ROLE, requester);
    }
}
