# TM Vault Mobile App

This is a premium React Native mobile application for Token Metrics Vaults, built with Expo and WalletConnect.

## Features Implemented
1. **Wallet Connection**:
   - Integrated `Privy` / `WalletConnect` (via `@walletconnect/modal-react-native`).
   - Displays connected address and USDC balance.
   - Persists connection state.

2. **Vault Display**:
   - Three specific vaults: **Stable Yield**, **Growth Alpha**, **Moonshot Turbo**.
   - Cards display Name, APY, TVL, and User Balance.
   - Color-coded badges and premium styling.

3. **Deposit & Withdraw Flow**:
   - **Approve → Deposit** transaction sequence using `ethers.js`.
   - **Withdrawal** support with pending state handling.
   - Real-time status updates (Checking → Approving → Depositing → Success).
   - Input with "Max" and percentage buttons.
   - Haptic feedback and estimated share calculation.
   
   “The deposit flow explicitly models ERC20 allowance checks and separates approval and deposit into independent on-chain transactions. Each transaction state (checking, approving, pending, confirmed, rejected, failed) is reflected in the mobile UI.”

4. **Network Handling**:
   - Detects if the wallet is on the wrong network.
   - Prompts to switch to **HyperEVM Testnet** (Chain ID: 998).
   - Automatic block updates.
   
5. **Activity & Portfolio**:
   - Mocked "Recent Activity" history feed.
   - Real-time balance and mock vault balance tracking.

## Setup & Run

### Prerequisites
- Node.js & npm/yarn
- Expo Go app on your physical device OR Android/iOS Emulator

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npx expo start
```
- Scan the QR code with your phone (using Expo Go).
- Or press `a` for Android Emulator, `i` for iOS Simulator.

## Configuration
- **Constants**: See `src/utils/constants.ts` to update `USDC_ADDRESS` and `VAULT_ADDRESS` when you deploy your contracts to HyperEVM.
- **Theme**: Premium dark theme configured in `src/utils/theme.ts`.

## Architecture
- **Screens**: `HomeScreen.tsx` handles the main dashboard and data refreshing.
- **Components**: 
  - `VaultCard`: Reusable card for vault data.
  - `DepositModal`: Self-contained interaction flow for deposits and withdrawals (Tab-based).
  - `Header`: Manages wallet connection state.
- **Web3**:
  - `wallet.ts`: WalletConnect config.
  - `vaultActions.ts`: Core logic for ERC20 approval, Vault deposits, and withdrawals.
  - `network.ts`: Network switching utilities.

## Next Steps for Production
1. **Deploy Contracts**: Deploy the Vault and USDC mock contracts to HyperEVM.
2. **Update Addresses**: Update `src/utils/constants.ts` with real addresses.
3. **Assets**: Add a `confetti.json` Lottie file to assets `(assets/confetti.json)` for the full success animation. uncomment lines in `src/component/DepositModal.tsx`.
