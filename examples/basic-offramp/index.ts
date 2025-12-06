import {
  initializeSDK,
  initiate,
  verify,
  getBanks,
  createOfframpOrder,
  Currency,
  Environment,
} from "paj_ramp";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log("🚀 Initializing PAJ Ramp SDK...");
  initializeSDK(Environment.Local);

  const email = process.env.USER_EMAIL!;
  const apiKey = process.env.BUSINESS_API_KEY!;
  const accountNumber = process.env.ACCOUNT_NUMBER!;
  const bankId = process.env.BANK_ID!;
  const currency = process.env.CURRENCY! as Currency;
  const mint = process.env.TOKEN_MINT!;
  const webhookURL = process.env.WEBHOOK_URL!;

  try {
    // Step 2: Initiate session
    console.log("\n📧 Initiating session...");
    const initiated = await initiate(email, apiKey);
    console.log("✅ OTP sent to:", initiated.email || initiated.phone);

    const otp = process.env.OTP;
    if (!otp) {
      console.error(
        "❌ OTP not found in .env file. Please add OTP=your_otp to .env"
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
      apiKey
    );
    console.log("✅ Session verified successfully!");

    const sessionToken = verified.token;

    // Step 4: Get available banks
    console.log("\n🏦 Fetching available banks...");
    const banks = await getBanks(sessionToken);
    console.log(`✅ Found ${banks.length} banks`);
    if (banks.length > 0) {
      console.log(
        "First few banks:",
        banks
          .slice(0, 3)
          .map((b) => b.name)
          .join(", ")
      );
    }

    // Step 7: Create offramp order
    console.log("\n💸 Creating offramp order...");
    const order = await createOfframpOrder(
      {
        token: verified.token,
        bank: bankId,
        accountNumber,
        currency,
        amount: parseInt(process.env.TOKEN_AMOUNT || "1"),
        mint,
        webhookURL,
      },
      sessionToken
    );

    console.log("\n✅ Offramp order created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Order Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Order ID:", order.id);
    console.log("Address:", order.address);
    console.log("Mint:", order.mint);
    console.log("Token Amount (to pay):", order.amount);
    console.log("Fiat Amount (to receive):", order.fiatAmount);
    console.log("Rate:", order.rate);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n📝 Next Steps:");
    console.log("1. Send", order.amount, "tokens to address:", order.address);
    console.log("2. Your webhook will receive status updates");
    console.log(
      "3. Once tokens are received and confirmed, fiat will be sent to your bank account"
    );
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : String(error)
    );
    if (error && typeof error === "object" && "response" in error) {
      console.error("Response data:", (error as any).response.data);
    }
    process.exit(1);
  }
}

main();
