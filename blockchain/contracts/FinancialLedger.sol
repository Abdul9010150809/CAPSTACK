// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FinancialLedger
 * @dev Immutable blockchain ledger for all financial transactions
 * Ensures transparency, auditability, and fraud prevention
 */
contract FinancialLedger is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    struct Transaction {
        bytes32 txHash;
        address user;
        uint256 amount;
        string transactionType; // "transfer", "savings", "withdrawal", "investment"
        uint256 timestamp;
        bool verified;
        bytes32 previousHash; // For chain linkage
        string ipfsHash; // Link to encrypted transaction details
    }

    struct AuditLog {
        bytes32 txHash;
        address auditor;
        string status; // "approved", "flagged", "suspicious"
        string reason;
        uint256 auditTimestamp;
    }

    mapping(bytes32 => Transaction) public transactions;
    mapping(bytes32 => AuditLog) public auditLogs;
    mapping(address => bytes32[]) public userTransactions;
    bytes32[] public allTransactions;

    uint256 public transactionCount = 0;
    bytes32 public lastHash = bytes32(0);

    event TransactionRecorded(bytes32 indexed txHash, address indexed user, uint256 amount, string txType);
    event TransactionAudited(bytes32 indexed txHash, string status, string reason);
    event LedgerValidated(uint256 totalTransactions, bytes32 merkleRoot);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
        _grantRole(VALIDATOR_ROLE, admin);
    }

    function recordTransaction(
        address user,
        uint256 amount,
        string calldata transactionType,
        string calldata ipfsHash
    ) external onlyRole(VALIDATOR_ROLE) nonReentrant whenNotPaused returns (bytes32) {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be positive");

        bytes32 txHash = keccak256(
            abi.encodePacked(user, amount, transactionType, block.timestamp, transactionCount)
        );

        transactions[txHash] = Transaction({
            txHash: txHash,
            user: user,
            amount: amount,
            transactionType: transactionType,
            timestamp: block.timestamp,
            verified: false,
            previousHash: lastHash,
            ipfsHash: ipfsHash
        });

        userTransactions[user].push(txHash);
        allTransactions.push(txHash);
        lastHash = txHash;
        transactionCount++;

        emit TransactionRecorded(txHash, user, amount, transactionType);
        return txHash;
    }

    function verifyTransaction(bytes32 txHash) external onlyRole(VALIDATOR_ROLE) {
        require(transactions[txHash].user != address(0), "Transaction not found");
        transactions[txHash].verified = true;
    }

    function auditTransaction(
        bytes32 txHash,
        string calldata status,
        string calldata reason
    ) external onlyRole(AUDITOR_ROLE) nonReentrant {
        require(transactions[txHash].user != address(0), "Transaction not found");

        auditLogs[txHash] = AuditLog({
            txHash: txHash,
            auditor: msg.sender,
            status: status,
            reason: reason,
            auditTimestamp: block.timestamp
        });

        emit TransactionAudited(txHash, status, reason);
    }

    function getUserTransactionHistory(address user) 
        external 
        view 
        returns (Transaction[] memory) 
    {
        bytes32[] memory txHashes = userTransactions[user];
        Transaction[] memory userTxs = new Transaction[](txHashes.length);

        for (uint256 i = 0; i < txHashes.length; i++) {
            userTxs[i] = transactions[txHashes[i]];
        }

        return userTxs;
    }

    function getLedgerIntegrity() external view returns (bool) {
        if (allTransactions.length == 0) return true;

        bytes32 currentHash = bytes32(0);
        for (uint256 i = 0; i < allTransactions.length; i++) {
            Transaction storage tx = transactions[allTransactions[i]];
            if (i > 0) {
                require(tx.previousHash == currentHash, "Chain integrity violated");
            }
            currentHash = tx.txHash;
        }

        return true;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
