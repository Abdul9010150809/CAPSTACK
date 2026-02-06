// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CapstackFinanceToken (CFT)
 * @dev A secure ERC20 token for CAPSTACK financial ecosystem
 * Features: Pausable, Burnable, Role-based Access Control
 */
contract CapstackFinanceToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens
    uint256 public totalMinted = 0;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event PauseToggled(bool paused);

    constructor(address admin, address initialMinter) ERC20("CapstackFinance", "CFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, initialMinter);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalMinted + amount <= MAX_SUPPLY, "Max supply exceeded");
        totalMinted += amount;
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
        emit PauseToggled(true);
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
        emit PauseToggled(false);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        super._update(from, to, value);
    }
}
