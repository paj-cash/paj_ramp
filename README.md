# paj_ramp

Paj Ramp is a crypto offramp API designed to allow users to convert Solana-based digital assets to fiat and transfer the resulting funds to traditional bank accounts. This backend service acts as a bridge between the Solana blockchain and the traditional banking system, enabling secure, authenticated, and user-friendly offboarding of funds from Web3 to Web2.

> _A simple wrapper for communicating with paj_ramp's backend endpoints — no manual API calls required._

### _“Send SOL. Get Naira.”_

> _The goal is to let users withdraw their crypto holdings from a Solana wallet and receive fiat currency in their linked bank accounts — all through a simple, authenticated API integration._

---

## 🚀 Features

- ✅ Easy-to-use functions for all backend endpoints
- 🔐 Handles Session Management
- 🧱 Clean, modular API
- 🕊️ No need to write `fetch()` or `axios` manually
- 🕸️ Handles Bank Operations like getting banks, adding bank, resolve bank and getting bank linked to the account

---

## 📦 Installation

```bash
# With npm
npm install paj_ramp

# With yarn
yarn add paj_ramp
```

## 📘 Usage Examples

### Get tx pool address

```bash
const txpooladdress = await getTXPoolAddress();

# Response
{
    address: string,
}
```
