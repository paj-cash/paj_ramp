import {
  initializeSDK,
  initiate,
  verify,
  getTokenValue,
  getFiatValue,
  getBanks,
  Environment,
  Currency,
} from "paj_ramp";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Step 1: Initialize SDK
  console.log("🚀 Initializing PAJ Ramp SDK...");
  initializeSDK(Environment.Local);

  const email = process.env.USER_EMAIL!;
  const apiKey = process.env.BUSINESS_API_KEY!;
  const mint = process.env.TOKEN_MINT!;
  const currency = process.env.CURRENCY as Currency;

  try {
    // Step 2: Initiate session
    console.log("\n📧 Initiating session...");
    console.log("Email:", email);
    const initiated = await initiate(email, apiKey);
    console.log("✅ OTP sent to:", initiated.email || initiated.phone);

    console.log(
      "\n⏳ Please check your email for the OTP and add it to your .env file"
    );

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

    // Step 4: Get Banks
    console.log("\n🏦 Fetching available banks...");
    const banks = await getBanks(sessionToken);
    console.log(`✅ Found ${banks.length} banks`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 First 3 Banks:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    banks.slice(0, 3).forEach((bank, index) => {
      console.log(`${index + 1}. ${bank.name} (${bank.code}) - ${bank.country}`);
      console.log(`   Logo: ${bank.logo}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 5: Get Onramp (convert fiat to token amount)
    console.log("\n💰 Getting onramp value...");
    const tokenAmount = 1010; // Example: 100 tokens
    const tokenValueResult = await getTokenValue(
      {
        amount: tokenAmount,
        mint,
        currency,
      },
      sessionToken
    );

    console.log("\n✅ Onramp value fetched successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Onramp Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Token Amount:", tokenValueResult.amount);
    console.log("Mint:", tokenValueResult.mint);
    console.log("Currency:", tokenValueResult.currency);
    console.log(`Token Value: ${tokenValueResult.amount} usdc`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 6: Get Offramp (convert token amount to fiat)
    console.log("\n💵 Getting offramp value...");
    const fiatAmount = 1000; // Example: 1000 NGN/USD
    const fiatValueResult = await getFiatValue(
      {
        amount: fiatAmount,
        mint,
        currency,
      },
      sessionToken
    );

    console.log("\n✅ Offramp value fetched successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Offramp Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Token Amount:", fiatValueResult.amount);
    console.log("Mint:", fiatValueResult.mint);
    console.log("Currency:", fiatValueResult.currency);
    console.log(`Fiat Value: ${fiatValueResult.fiatAmount} ${currency}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n✨ Summary:");
    console.log(
      `• ${tokenAmount} ${currency} = ${tokenValueResult.amount} USDC`
    );
    console.log(
      `• ${fiatAmount} USDC = ${fiatValueResult.fiatAmount}  ${currency}`
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
