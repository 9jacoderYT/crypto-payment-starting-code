import { initializeMoralis } from "../../../../lib/validations";
import { NextResponse } from "next/server";
import Moralis from "moralis";

function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

function convertFromWei(value: string): number {
  // BNB has 18 decimals
  return Number(value) / 1e18;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { transactionHash, wallet, amount, currency } = await request.json();

  console.log(transactionHash, wallet, amount, currency);

  if (!transactionHash || !wallet || !amount || !currency) {
    return NextResponse.json({
      status: 400,
      error: true,
      message: "Missing required parameters",
    });
  }

  try {
    await initializeMoralis();
  } catch (error) {
    console.error("Moralis Initialization Error:", error);
    return NextResponse.json({
      status: 400,
      error: true,
      message: "Moralis initialization failed",
    });
  }

  try {
    // Get transaction data using Moralis
    const transaction = await Moralis.EvmApi.transaction.getTransaction({
      chain: "0x38", // BSC chain ID
      transactionHash,
    });

    if (!transaction) {
      throw new Error("Failed to fetch transaction data");
    }

    const trans = (transaction as any).jsonResponse;

    // Check if transaction was successful
    if (!trans || trans.receipt_status !== "1") {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction failed or pending",
      });
    }

    // For BNB transfers, verify it's a direct transfer (value > 0 and input data is empty/0x)
    if (trans.value === "0" || trans.input !== "0x") {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Not a direct BNB transfer",
      });
    }

    // Verify recipient address
    const normalizedReceiver = normalizeAddress(trans.to_address);
    const normalizedWallet = normalizeAddress(wallet);

    if (normalizedReceiver !== normalizedWallet) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction made to wrong address",
      });
    }

    // Convert and verify amount
    const amountSent = convertFromWei(trans.value);
    const expectedAmount = Number(amount);
    const minAmount = expectedAmount * 0.98;


    if (amountSent < minAmount) {
      return NextResponse.json({
        status: 400,
        error: true,
        message:
          "Amount sent is below the minimum required. Please Contact Support",
        debug: {
          sent: amountSent,
          expected: expectedAmount,
          minimum: minAmount,
        },
      });
    }

    return NextResponse.json({
      status: 200,
      error: false,
      message: "Transaction hash is valid and correct",
    });
  } catch (error) {
    console.error("Error validating BNB transaction:", error);
    return NextResponse.json({
      status: 500,
      error: true,
      message: "An error occurred while validating the transaction",
    });
  }
}
