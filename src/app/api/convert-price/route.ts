// pages/api/getTokenAmount.ts
import { NextResponse } from "next/server";
import Moralis from "moralis";
import { initializeMoralis } from "../../../../lib/validations";
// Adjust the import path as necessary

// Mapping of token names to their corresponding addresses
const tokenAddresses: Record<string, string> = {
  eth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
  bnb: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
};

// Function to get token amount for a given USD amount
async function getTokenAmountForUsd(
  usdAmount: number,
  token: string
): Promise<number | null> {
  await initializeMoralis(); // Ensure Moralis is initialized

  // Determine the token address
  const address = tokenAddresses[token.toLowerCase()];

  if (!address) {
    console.error(`Invalid token: ${token}`);
    return null;
  }

  try {
    // Use Moralis's token price function to fetch the price in USD
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address, // Use the correct token address
      chain: token === "bnb" ? "0x38" : "0x1", // Specify the correct chain
      include: "percent_change", // Optional: Include percent change data
    });

    const tokenPriceUsd = response.raw.usdPrice;

    // Calculate the amount needed in the token and round it to 3 decimal places
    const tokenAmount = (usdAmount / tokenPriceUsd).toFixed(3);
    return parseFloat(tokenAmount); // Convert back to number for return
  } catch (error) {
    console.error(`Error fetching ${token.toUpperCase()} price:`, error);
    // Return fallback values in case of an error
    return token === "bnb" ? 0.175 : token === "eth" ? 0.04 : null;
  }
}

// API route handler
export async function POST(request: Request) {
  const { usdAmount, token } = await request.json();

  if (!usdAmount || !token) {
    return NextResponse.json({
      status: 400,
      error: true,
      message: "Invalid request. Please provide usdAmount and token.",
    });
  }

  try {
    await initializeMoralis();
    const amount = await getTokenAmountForUsd(usdAmount, token);
    return NextResponse.json({ status: 200, amount, error: false });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      error: true,
      amount: 0,
    });
  }
}
