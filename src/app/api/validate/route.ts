import Moralis from "moralis";
import { NextResponse } from "next/server";
import { initializeMoralis } from "../../../../lib/validations";
import {
  amountWithinRange,
  convertBnbToDecimals,
  convertDateToTimestamp,
  timestampWithinRange,
} from "../../../../lib/validations";

export const dynamic = "force-dynamic";

function convertUsdtHexToDecimal(hexValue: string) {
  // Extract the last 64 characters representing the amount in hex
  const amountHex = hexValue.slice(-64);

  // Convert hex to decimal (BigInt to handle large numbers safely)
  const amountDecimal = BigInt("0x" + amountHex);

  // First convert from 18 decimals (ETH format) to 6 decimals (USDT format)
  // by dividing by 10^12 (difference between 18 and 6 decimal places)
  const adjustedAmount = Number(amountDecimal) / Math.pow(10, 12);

  // Then convert to USDT by dividing by 10^6
  const amountInUsdt = adjustedAmount / Math.pow(10, 6);

  return amountInUsdt;
}

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
      status: 500,
      error: true,
      message: "Moralis initialization failed",
    });
  }

  // Set the chain based on the currency
  const chain = "0x38";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT BSC contract address

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
        errorStatus: true,
        text: "Transaction not successful or does not exist.",
      });
    }

    if (!trans || trans.receipt_status !== "1") {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Invalid transaction",
      });
    }

    const logs =
      trans.logs[0] ||
      (() => {
        throw new Error("Unable to validate Transaction Hash");
      })();

    console.log(logs.address);

    if (usdtAddress.toLowerCase() !== logs.address) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "You made an error and did not transfer Usdt",
      });
    }

    const receiverAddress = `0x${logs.topic2.slice(26)}`;

    if (wallet.toLowerCase() !== receiverAddress.toLowerCase()) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction made to the wrong address",
      });
    }

    if (!logs.data) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Unable to validate Transactions",
      });
    }

    const amountSent = convertUsdtHexToDecimal(logs.data);
    const isAmountCorrect = amountWithinRange(amountSent, amount);
    if (!isAmountCorrect) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Amount sent is Incorrect",
      });
    }

    const transactionTimestamp = convertDateToTimestamp(logs.block_timestamp);
    const isTimestampValid = timestampWithinRange(transactionTimestamp);
    if (!isTimestampValid) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction was not made within the allocated time.",
      });
    }

    return NextResponse.json({
      status: 200,
      error: false,
      message: "Transaction hash is valid and correct",
    });
  } catch (error) {
    console.error("Error validating USDT transaction:", error);
    return NextResponse.json({
      status: 500,
      error: true,
      message:
        "An error occurred while validating the USDT transaction. Contact Support",
    });
  }
}
