import { initializeMoralis } from "../../../../lib/validations";
import {
  amountWithinRange,
  convertDateToTimestamp,
  timestampWithinRange,
} from "../../../../lib/validations";
import Moralis from "moralis";
import { NextResponse } from "next/server";
import { ethers } from "ethers";

// BSC USDT contract address
const BSC_USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";

function hexToDecimal(hexValue: string): number {
  // Remove '0x' prefix if present
  const hex = hexValue.startsWith("0x") ? hexValue.slice(2) : hexValue;

  // Convert hex to decimal
  const decimal = BigInt("0x" + hex);

  // Convert to string and pad with zeros to ensure 18 decimals
  let str = decimal.toString();
  while (str.length <= 18) {
    str = "0" + str;
  }

  // Insert decimal point 18 places from the right
  const integerPart = str.slice(0, -18) || "0";
  const decimalPart = str.slice(-18);

  // Convert to number and round to reasonable decimals (e.g., 6)
  return Number(`${integerPart}.${decimalPart}`);
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { transactionHash, wallet, amount, currency } = await request.json();

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
    // Get transaction data
    const transaction = await Moralis.EvmApi.transaction.getTransaction({
      chain: "0x38", // BSC chain ID
      transactionHash,
    });

    if (!transaction) {
      throw new Error("Failed to fetch transaction data");
    }

    const trans = (transaction as any).jsonResponse;

    if (!trans || trans.receipt_status !== "1") {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Invalid transaction",
      });
    }

    // Verify the transaction is for USDT contract
    if (trans.to_address.toLowerCase() !== BSC_USDT_CONTRACT.toLowerCase()) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction is not for BSC USDT",
      });
    }

    // Get the transfer event logs
    const transferLog = trans.logs.find(
      (log: any) =>
        log.address.toLowerCase() === BSC_USDT_CONTRACT.toLowerCase() &&
        log.topic0 ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" // Transfer event signature
    );

    if (!transferLog) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "No valid transfer event found",
      });
    }

    // Get recipient address from topic2 (to address)
    const recipient = "0x" + transferLog.topic2.slice(26);

    // Verify recipient address
    if (wallet.toLowerCase() !== recipient.toLowerCase()) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction made to the wrong address",
      });
    }

    // Convert hex amount to decimal USDT value
    const receivedAmount = hexToDecimal(transferLog.data);
    const expectedAmount = parseFloat(amount);

    const tolerance = 0.01;
    const amountDifference = Math.abs(expectedAmount - receivedAmount);

    if (amountDifference > tolerance) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Amount sent is incorrect",
        debug: {
          expected: expectedAmount,
          received: receivedAmount,
          difference: amountDifference,
        },
      });
    }

    return NextResponse.json({
      status: 200,
      error: false,
      message: "Transaction hash is valid and correct",
    });
  } catch (error) {
    console.error("Error validating BSC USDT transaction:", error);
    return NextResponse.json({
      status: 500,
      error: true,
      message: "An error occurred while validating the transaction",
    });
  }
}
