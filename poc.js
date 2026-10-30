/**
 * Proof of Concept (PoC) for Unitus Finance Debt Ceiling Bypass
 * 
 * Vulnerability: Missing Price Oracle in Segregation Mode
 * File: src/ControllerV2ExtraExplicit.sol (beforeBorrow function)
 * 
 * This script simulates the exact math used in the smart contract 
 * to prove that borrowing a high-value asset (WBTC) impacts the 
 * protocol's currentDebt exactly the same as a low-value asset (USDC).
 */

// Simulating Solidity's SafeMath and Decimal normalization
function calculateNewDebt(tokenName, borrowAmount, decimals) {
    // DEBT_CEILING_DECIMALS is 2 based on ControllerStorage.sol
    const DEBT_CEILING_DECIMALS = 2; 
    
    console.log(`\n--- Testing ${tokenName} ---`);
    console.log(`Borrow Amount: ${borrowAmount} (${borrowAmount / (10 ** decimals)} tokens)`);
    console.log(`Token Decimals: ${decimals}`);
    
    // Solidity logic: _borrowAmount.div(10 ** (_getDecimals(_iToken).sub(DEBT_CEILING_DECIMALS)))
    // Using BigInt to mimic uint256 math in JS
    let divisor = 10n ** BigInt(decimals - DEBT_CEILING_DECIMALS);
    let normalizedAmount = BigInt(borrowAmount) / divisor;
    
    console.log(`Impact on currentDebt: +${normalizedAmount}`);
    return normalizedAmount;
}

// --- Scenario 1: Borrowing 1 USDC (Price: ~$1, Decimals: 6) ---
const usdcBorrowAmount = 1000000; // 1 USDC
let usdcDebtImpact = calculateNewDebt("USDC", usdcBorrowAmount, 6);

// --- Scenario 2: Borrowing 1 WBTC (Price: ~$60,000, Decimals: 8) ---
const wbtcBorrowAmount = 100000000; // 1 WBTC
let wbtcDebtImpact = calculateNewDebt("WBTC", wbtcBorrowAmount, 8);

// --- Conclusion ---
console.log("\n=========================================================");
console.log("💡 CONCLUSION:");
if (usdcDebtImpact === wbtcDebtImpact) {
    console.log("🚨 VULNERABILITY PROVEN!");
    console.log(`Borrowing 1 USDC ($1) and 1 WBTC ($60,000) both add EXACTLY +${usdcDebtImpact} to currentDebt!`);
    console.log("The protocol fails to multiply the amount by the asset's USD price.");
    console.log("An attacker can drain the debt ceiling by borrowing high-value assets.");
} else {
    console.log("No vulnerability found.");
}
console.log("=========================================================");
