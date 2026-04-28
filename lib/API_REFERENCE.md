# PAJ Ramp — HTTP API Reference

This document describes the raw HTTP endpoints that the `paj_ramp` npm SDK wraps,
so they can be called from any backend (Go, Python, Ruby, PHP, Java, etc.).

All requests use JSON. Timestamps are ISO 8601 strings.

---

## 1. Environments

| Environment | Base URL |
|---|---|
| Production | `https://api.paj.cash` |
| Staging | `https://api-staging.paj.cash` |

Use the base URL as the prefix for every path below.

---

## 2. Authentication

There are two credentials involved:

1. **`apiKey`** — issued by PAJ to your business. Sent as header `x-api-key`.
   Used only for the two session endpoints (`/pub/initiate`, `/pub/verify`).
2. **`sessionToken`** — returned by `/pub/verify` after OTP confirmation.
   Sent as header `Authorization: Bearer <sessionToken>` for every other
   authenticated endpoint. It has an `expiresAt` — re-verify when expired.

A typical integration flow:

```
apiKey  ──► POST /pub/initiate  ──► OTP sent to email/phone
apiKey  ──► POST /pub/verify    ──► sessionToken returned
sessionToken ──► all onramp / offramp / bank / transaction / value endpoints
```

Standard headers for every request:

```
Content-Type: application/json
```

Error responses: any non-2xx response returns a JSON error payload from the
server. The SDK re-throws `error.response.data` as-is; treat any non-2xx
status as a failure and read the JSON body for the message.

---

## 3. Session

### 3.1 Initiate session (send OTP)

```
POST /pub/initiate
```

Headers:
```
x-api-key: <business_api_key>
Content-Type: application/json
```

Body — send **either** `email` **or** `phone` (E.164 format, e.g. `+2349053231563`):

```json
{ "email": "user@example.com" }
```
or
```json
{ "phone": "+2349053231563" }
```

Response `200`:
```json
{ "email": "user@example.com" }
```
or
```json
{ "phone": "+2349053231563" }
```

An OTP is delivered to the given recipient.

---

### 3.2 Verify session (exchange OTP for token)

```
POST /pub/verify
```

Headers:
```
x-api-key: <business_api_key>
Content-Type: application/json
```

Body:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "device": {
    "uuid": "device-uuid",
    "device": "Desktop",
    "os": "MacOS",
    "browser": "Chrome",
    "ip": "127.0.0.1"
  }
}
```

- Use `"phone"` instead of `"email"` if you initiated with a phone number.
- In `device`, only `uuid` and `device` are required; `os`, `browser`, `ip` are optional.

Response `200`:
```json
{
  "recipient": "user@example.com",
  "isActive": "true",
  "expiresAt": "2026-04-20T10:30:00.000Z",
  "token": "eyJhbGciOi..."
}
```

Store `token` — it is the `sessionToken` used by every endpoint below.

---

## 4. Rate

### 4.1 Get all rates

```
GET /pub/rate
```

No auth required.

Response `200`:
```json
{
  "onRampRate": {
    "baseCurrency": "USD",
    "targetCurrency": "NGN",
    "isActive": true,
    "rate": 1510,
    "type": "onRamp"
  },
  "offRampRate": {
    "baseCurrency": "USD",
    "targetCurrency": "NGN",
    "isActive": true,
    "rate": 1525,
    "type": "offRamp"
  }
}
```

### 4.2 Get rate by amount

```
GET /pub/rate/{amount}
```

Path param: `amount` — fiat amount (integer or decimal).

Response `200`:
```json
{
  "rate": {
    "baseCurrency": "USD",
    "targetCurrency": "NGN",
    "rate": 1510
  },
  "amounts": {
    "userTax": 0,
    "merchantTax": 0,
    "amountUSD": 33.11,
    "userAmountFiat": 50000
  }
}
```

### 4.3 Get rate by type

```
GET /pub/rate/{type}
```

Path param: `type` — one of `onRamp`, `offRamp`.

Response `200`:
```json
{
  "baseCurrency": "USD",
  "targetCurrency": "NGN",
  "isActive": true,
  "rate": 1525,
  "type": "offRamp"
}
```

---

## 5. Value conversion

These take a session token and convert between fiat and token amounts for a
specific token/currency pair.

### 5.1 Fiat → token (onramp value)

```
GET /pub/rates/onramp-value?amount={fiatAmount}&mint={mint}&currency={currency}
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Query params:
| name | type | notes |
|---|---|---|
| `amount` | number | fiat amount (OR set `fiatAmount`) |
| `fiatAmount` | number | alternative to `amount` |
| `mint` | string | token mint address |
| `currency` | string | `NGN`, `GHS`, `TZS`, `KES`, `ZAR`, `USD` |

Response `200`:
```json
{
  "amount": 33.11,
  "fiatAmount": 50000,
  "mint": "EPjFW...",
  "currency": "NGN",
  "rate": 1510,
  "tokenRate": 1
}
```

### 5.2 Token → fiat (offramp value)

```
GET /pub/rates/offramp-value?amount={tokenAmount}&mint={mint}&currency={currency}
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Query params: same shape as 5.1 — set `amount` to the token amount.

Response `200`:
```json
{
  "amount": 100,
  "fiatAmount": 152500,
  "mint": "EPjFW...",
  "currency": "NGN",
  "tokenRate": 1
}
```

---

## 6. Banks

### 6.1 List banks

```
GET /pub/bank
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Response `200`:
```json
[
  {
    "id": "bank_id",
    "code": "058",
    "name": "GTBank",
    "logo": "https://cdn.paj.cash/banks/gtb.png",
    "country": "NG"
  }
]
```

### 6.2 Resolve (confirm) a bank account

```
GET /pub/bank-account/confirm?bankId={bankId}&accountNumber={accountNumber}
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Response `200`:
```json
{
  "accountName": "JOHN DOE",
  "accountNumber": "0123456789",
  "bank": {
    "id": "bank_id",
    "name": "GTBank",
    "code": "058",
    "country": "NG"
  }
}
```

### 6.3 Add (save) a bank account

```
POST /pub/bank-account
```

Headers:
```
Authorization: Bearer <sessionToken>
Content-Type: application/json
```

Body:
```json
{
  "bankId": "bank_id",
  "accountNumber": "0123456789"
}
```

Response `200`:
```json
{
  "id": "saved_account_id",
  "accountName": "JOHN DOE",
  "accountNumber": "0123456789",
  "bank": "bank_id"
}
```

### 6.4 List saved bank accounts

```
GET /pub/bank-account
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Response `200`:
```json
[
  {
    "id": "saved_account_id",
    "accountName": "JOHN DOE",
    "accountNumber": "0123456789",
    "bank": "bank_id"
  }
]
```

---

## 7. KYC

### 7.1 Submit government-ID KYC

```
POST /pub/kyc
```

Headers:
```
Authorization: Bearer <sessionToken>
Content-Type: application/json
```

Body:
```json
{
  "idNumber": "12345678901",
  "idType": "BVN",
  "country": "NG"
}
```

Rules:
- The session must already have completed email verification
  (i.e. obtained from `/pub/verify`).
- `idType` — one of `BVN`, `NIN`.
- `country` — one of `NG`, `GH`, `TZ`, `KE`, `ZA`.
- A given (`idNumber`, `idType`, `country`) combination may only be linked
  to one user; reusing one tied to a different user returns
  `400 IdNumber already used`.

Response `200`:
```json
{
  "message": "KYC submitted successfully"
}
```

---

## 8. Token info

### 8.1 Get token metadata

```
GET /token/{mint}?chain={chain}
```

No auth required.

Path param: `mint` — token mint address.
Query param: `chain` — `SOLANA` or `MONAD`.

Response `200`:
```json
{
  "name": "USD Coin",
  "symbol": "USDC",
  "logo": "https://cdn.paj.cash/tokens/usdc.png",
  "mint": "EPjFW...",
  "decimals": 6,
  "chain": "SOLANA"
}
```

---

## 9. Offramp (crypto → fiat)

### 9.1 Create offramp order

```
POST /pub/offramp
```

Headers:
```
Authorization: Bearer <sessionToken>
Content-Type: application/json
```

Body:
```json
{
  "bank": "bank_id",
  "accountNumber": "0123456789",
  "currency": "NGN",
  "amount": 100,
  "fiatAmount": 152500,
  "mint": "EPjFW...",
  "chain": "SOLANA",
  "description": "Payout",
  "webhookURL": "https://your-domain.com/webhook",
  "businessUSDCFee": 0.5
}
```

Rules:
- Provide **either** `amount` (token) **or** `fiatAmount` (fiat), not necessarily both.
- `currency` — one of `NGN`, `GHS`, `TZS`, `KES`, `ZAR`, `USD`.
- `chain` — `SOLANA` or `MONAD`.
- `description` is optional.
- `businessUSDCFee` is optional, denominated in USDC. **Important:** the SDK
  exposes this as `fee` in its TypeScript input, but it is sent over the wire
  as `businessUSDCFee`. Use `businessUSDCFee` in your HTTP body.

Response `200`:
```json
{
  "id": "order_id",
  "address": "DepositWalletAddress...",
  "mint": "EPjFW...",
  "currency": "NGN",
  "amount": 100,
  "fiatAmount": 152500,
  "rate": 1525,
  "fee": 0.5
}
```

After receiving the response, the user transfers `amount` of `mint` on
`chain` to `address`. Order status updates are pushed to `webhookURL`
(see section 12).

---

## 10. Onramp (fiat → crypto)

### 10.1 Create onramp order

```
POST /pub/onramp
```

Headers:
```
Authorization: Bearer <sessionToken>
Content-Type: application/json
```

Body:
```json
{
  "amount": 33.11,
  "fiatAmount": 50000,
  "currency": "NGN",
  "recipient": "RecipientWalletAddress...",
  "mint": "EPjFW...",
  "chain": "SOLANA",
  "webhookURL": "https://your-domain.com/webhook",
  "businessUSDCFee": 0.5
}
```

Rules:
- Provide **either** `amount` (token) **or** `fiatAmount` (fiat).
- `recipient` is the destination wallet address that will receive the crypto.
- `chain` — `SOLANA` or `MONAD`.
- `businessUSDCFee` — same note as offramp: the SDK field is named `fee`
  but the wire field is `businessUSDCFee`.

Response `200`:
```json
{
  "id": "order_id",
  "accountNumber": "0123456789",
  "accountName": "PAJ CASH",
  "amount": 33.11,
  "fiatAmount": 50000,
  "bank": "GTBank",
  "rate": 1510,
  "recipient": "RecipientWalletAddress...",
  "currency": "NGN",
  "mint": "EPjFW...",
  "fee": 0.5
}
```

The user sends `fiatAmount` in `currency` to `accountNumber` at `bank`.
Once PAJ detects the payment, it disburses the crypto to `recipient`
and notifies `webhookURL`.

---

## 11. Transactions

### 11.1 List all transactions

```
GET /pub/transactions
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Response `200`: array of `PajTransaction` (see 11.2).

### 11.2 Get a single transaction

```
GET /pub/transactions/{id}
```

Headers:
```
Authorization: Bearer <sessionToken>
```

Response `200`:
```json
{
  "id": "order_id",
  "address": "...",
  "signature": "SolanaTxSignature...",
  "mint": "EPjFW...",
  "currency": "NGN",
  "amount": 100,
  "usdcAmount": 33.11,
  "fiatAmount": 152500,
  "recipient": "RecipientWalletAddress...",
  "rate": 1525,
  "status": "COMPLETED",
  "transactionType": "OFF_RAMP",
  "createdAt": "2026-04-17T10:30:00.000Z",
  "fee": 0.5
}
```

`status` values: `INIT`, `PAID`, `COMPLETED`.
`transactionType` values: `ON_RAMP`, `OFF_RAMP`.

---

## 12. Webhook payload (onramp & offramp)

When an order progresses, PAJ `POST`s a JSON body to the `webhookURL` you
supplied at order creation. The shape:

```json
{
  "id": "order_id",
  "address": "...",
  "signature": "OnChainTxSignature...",
  "mint": "EPjFW...",
  "currency": "NGN",
  "amount": 100,
  "usdcAmount": 33.11,
  "fiatAmount": 152500,
  "sender": "...",
  "recipient": "...",
  "rate": 1525,
  "status": "COMPLETED",
  "transactionType": "OFF_RAMP"
}
```

Respond with `2xx` to acknowledge. Treat the webhook as the authoritative
source of truth for final order state.

---

## 13. Enum reference

| Enum | Values |
|---|---|
| `Currency` | `NGN`, `GHS`, `TZS`, `KES`, `ZAR`, `USD` |
| `Country` | `NG`, `GH`, `TZ`, `KE`, `ZA` |
| `IdType` | `BVN`, `NIN` |
| `Chain` | `SOLANA`, `MONAD` |
| `TransactionStatus` | `INIT`, `PAID`, `COMPLETED` |
| `TransactionType` | `ON_RAMP`, `OFF_RAMP` |
| `RateType` | `onRamp`, `offRamp` |

---

## 14. End-to-end example flows

### Offramp (crypto → NGN)

1. `POST /pub/initiate` with `apiKey` → OTP sent.
2. `POST /pub/verify` with `apiKey` + OTP → `sessionToken`.
3. `GET /pub/bank` → list banks, pick `bankId`.
4. `GET /pub/bank-account/confirm?bankId=...&accountNumber=...` → confirm name.
5. `POST /pub/bank-account` → save account, receive saved account `id`.
6. `POST /pub/offramp` with saved `bank` id + `accountNumber` → deposit `address`.
7. User transfers `amount` of `mint` on `chain` to `address`.
8. PAJ `POST`s the webhook to `webhookURL` when `status` becomes `COMPLETED`.

### Onramp (NGN → crypto)

1. `POST /pub/initiate` + `POST /pub/verify` → `sessionToken`.
2. `POST /pub/onramp` with `recipient` wallet + amount → bank `accountNumber`
   and `accountName`.
3. User transfers `fiatAmount` in `currency` to that account.
4. PAJ `POST`s the webhook when the crypto is disbursed.

---

## 15. cURL quickstart

```bash
# 1. Initiate
curl -X POST https://api-staging.paj.cash/pub/initiate \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# 2. Verify
curl -X POST https://api-staging.paj.cash/pub/verify \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "device":{"uuid":"dev-1","device":"Desktop"}
  }'
# → { "token": "...", ... }

# 3. Create onramp order
curl -X POST https://api-staging.paj.cash/pub/onramp \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fiatAmount": 10000,
    "currency": "NGN",
    "recipient": "WALLET_ADDRESS",
    "mint": "EPjFW...",
    "chain": "SOLANA",
    "webhookURL": "https://your-domain.com/webhook"
  }'
```
