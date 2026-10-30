# 🚨 Critical: Debt Ceiling Bypass via Missing Price Oracle in Segregation Mode

## 📌 Summary
In the Unitus Finance protocol, the `ControllerV2ExtraExplicit.sol` contract fails to calculate the true USD value of a borrowed asset in Segregation Mode. It relies solely on token decimals, allowing users to bypass the `debtCeiling` limit by borrowing high-value assets (like WBTC) instead of low-value assets (like USDC).

## 🎯 Vulnerability Details
* **Project:** Unitus Labs
* **File:** `src/ControllerV2ExtraExplicit.sol`
* **Function:** `beforeBorrow()`
* **Severity:** Critical / High
* **Category:** Logic Error / Oracle Failure

## 🔍 The Vulnerable Code
```solidity
// ControllerV2ExtraExplicit.sol (Line ~209)
uint256 _newDebt = collateralMarket.currentDebt.add(
    _borrowAmount.div(
        10 ** (_getDecimals(_iToken).sub(DEBT_CEILING_DECIMALS))
    )
);
