import { initializeMoralis } from "../../../../lib/validations";
import {
  amountWithinRange,
  convertBnbToDecimals,
  convertDateToTimestamp,
  timestampWithinRange,
} from "../../../../lib/validations";
import Moralis from "moralis";
import { NextResponse } from "next/server";

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

  // Set the chain based on the currency
  const chain = currency.toLowerCase() === "bnb" ? "0x38" : "0x1";

  const options = {
    chain,
    transactionHash,
  };

  try {
    const fetchedTransaction = await Moralis.EvmApi.transaction.getTransaction(
      options
    );

    if (!fetchedTransaction) {
      throw new Error(
        "Failed to fetch transaction data. fetchedTransaction is null or undefined."
      );
    }
    const trans = (fetchedTransaction as any).jsonResponse;

    if (!trans || trans.receipt_status !== "1") {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Invalid transaction",
      });
    }

    if (wallet.toLowerCase() !== trans.to_address.toLowerCase()) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction made to the wrong address",
      });
    }

    const amountSent = convertBnbToDecimals(trans.value);
    const isAmountCorrect = amountWithinRange(amountSent, amount);
    if (!isAmountCorrect) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Amount sent is incorrect",
      });
    }

    const transactionTimestamp = convertDateToTimestamp(trans.block_timestamp);
    const isTimestampValid = timestampWithinRange(transactionTimestamp);
    if (!isTimestampValid) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction timestamp is outside the allowed range",
      });
    }

    return NextResponse.json({
      status: 200,
      error: false,
      message: "Transaction hash is valid and correct",
    });
  } catch (error) {
    console.error("Error validating transaction:", error);
    return NextResponse.json({
      status: 400,
      error: true,
      message: "An error occurred while validating the transaction",
    });
  }
}
