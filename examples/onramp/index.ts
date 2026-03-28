import {
  initializeSDK,
  initiate,
  verify,
  createOnrampOrder,
  getTransaction,
  getAllTransactions,
  Environment,
  Chain,
} from "paj_ramp";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log("🚀 Initializing PAJ Ramp SDK...");
  initializeSDK(Environment.Local);

  const email = process.env.USER_EMAIL!;
  const apiKey = process.env.BUSINESS_API_KEY!;
  const fiatAmount = parseInt(process.env.FIAT_AMOUNT!);
  const currency = process.env.CURRENCY!;
  const recipient = process.env.WALLET_ADDRESS!;
  const mint = process.env.TOKEN_MINT!;
  const webhookURL = process.env.WEBHOOK_URL!;

  try {
    // Step 2: Initiate session
    console.log("\n📧 Initiating session...");
    console.log("Email:", email);
    console.log("API Key:", apiKey);
    const initiated = await initiate(email, apiKey);
    console.log("✅ OTP sent to:", initiated.email || initiated.phone);

    // In a real application, you would wait for the user to receive and enter the OTP
    // For this example, we assume you have the OTP from your email
    console.log(
      "\n⏳ Please check your email for the OTP and add it to your .env file",
    );

    const otp = process.env.OTP;
    if (!otp) {
      console.error(
        "❌ OTP not found in .env file. Please add OTP=your_otp to .env",
      );
      process.exit(1);
    }

    // Step 3: Verify session
    console.log("\n🔐 Verifying session with OTP...");
    const verified = await verify(
      email,
      otp,
      {
        uuid: "example-device-uuid-" + Date.now(),
        device: "Desktop",
        os: "MacOS",
        browser: "Chrome",
      },
      apiKey,
    );
    console.log("✅ Session verified successfully!");
    console.log(
      "Token (first 20 chars):",
      verified.token.substring(0, 20) + "...",
    );

    const sessionToken = verified.token;

    // Step 4: Create onramp order
    console.log("\n💰 Creating onramp order...");
    const order = await createOnrampOrder(
      {
        fiatAmount,
        currency,
        recipient,
        mint,
        chain: Chain.SOLANA,
        webhookURL,
        fee: 0.12,
      },
      sessionToken,
    );

    console.log("\n✅ Order created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Order Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Order ID:", order.id);
    console.log("Account Number:", order.accountNumber);
    console.log("Account Name:", order.accountName);
    console.log(
      "Fiat Amount (to send):",
      order.fiatAmount,
      process.env.CURRENCY,
    );
    console.log("Token Amount (to receive):", order.amount);
    console.log("Bank:", order.bank);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("fee:", order.fee);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 5: Fetch the transaction details
    console.log("\n🔍 Fetching transaction details...");
    const transaction = await getTransaction(sessionToken, order.id);

    console.log("\n✅ Transaction fetched successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Transaction Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Transaction ID:", transaction.id);
    console.log("Status:", transaction.status);
    console.log("Type:", transaction.transactionType);
    console.log("Mint:", transaction.mint);
    console.log("Currency:", transaction.currency);
    console.log("Token Amount:", transaction.amount);
    console.log("Fiat Amount:", transaction.fiatAmount);
    console.log("Rate:", transaction.rate);
    console.log("Recipient:", transaction.recipient);
    console.log("Created At:", transaction.createdAt);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 6: Fetch all transactions
    console.log("\n📜 Fetching all transactions...");
    const allTransactions = await getAllTransactions(sessionToken);

    console.log(`\n✅ Found ${allTransactions.length} transaction(s)!\n`);

    if (allTransactions.length > 0) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📋 All Transactions:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      allTransactions.forEach((tx, index) => {
        console.log(`\n${index + 1}. Transaction ID: ${tx.id}`);
        console.log(`   Status: ${tx.status}`);
        console.log(`   Type: ${tx.transactionType}`);
        console.log(`   Amount: ${tx.amount} (${tx.currency})`);
        console.log(`   Fiat: ${tx.fiatAmount}`);
        console.log(`   Created: ${tx.createdAt}`);
      });

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    console.log("\n📝 Next Steps:");
    console.log(
      "1. Transfer",
      order.fiatAmount,
      process.env.CURRENCY,
      "to the account number above",
    );
    console.log("2. Your webhook will receive status updates");
    console.log("3. Once payment is confirmed, you will receive tokens");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    if (error && typeof error === "object" && "response" in error) {
      console.error("Response data:", (error as any).response.data);
    }
    process.exit(1);
  }
}

main();
