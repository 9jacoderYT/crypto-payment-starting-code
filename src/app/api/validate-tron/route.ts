import { NextResponse } from "next/server";
import axios from "axios";
import bs58 from "bs58";

const TRONGRID_API = "https://api.trongrid.io";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRON USDT contract

const tronApi = axios.create({
  baseURL: TRONGRID_API,
  headers: {
    "TRON-PRO-API-KEY": process.env.NEXT_PUBLIC_API_KEY, // Replace with your API key
  },
});

function normalizeHexAddress(hexAddress: string): string {
  // Remove '0x' or '41' prefix if present
  let clean = hexAddress.toLowerCase();
  if (clean.startsWith("0x")) clean = clean.slice(2);
  if (clean.startsWith("41")) clean = clean.slice(2);
  return clean;
}

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
    const response = await tronApi.get(
      `/v1/transactions/${transactionHash}/events`
    );

    const events = response.data.data;
    // console.log(events);

    if (!events || events.length === 0) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction not found",
      });
    }

    // Find the Transfer event
    const transferEvent = events.find(
      (event: any) =>
        event.contract_address === USDT_CONTRACT &&
        event.event_name === "Transfer"
    );

    if (!transferEvent) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Not a USDT transfer",
      });
    }

    // Get wallet address details
    const addressResponse = await tronApi.get(`/v1/accounts/${wallet}`);
    const walletHexAddress = addressResponse.data?.data[0]?.address || "";

    // Normalize both addresses for comparison
    const eventHexAddress = transferEvent.result.to;
    const normalizedEventAddress = normalizeHexAddress(eventHexAddress);
    const normalizedWalletAddress = normalizeHexAddress(walletHexAddress);

    // Compare normalized addresses
    if (normalizedEventAddress !== normalizedWalletAddress) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction made to wrong address",
      });
    }

    // Verify amount (accept minimum 98% of expected amount)
    const amountSent = Number(transferEvent.result.value) / 1_000_000;
    const expectedAmount = Number(amount);

    // Calculate minimum allowed amount (98% of expected)
    const minAmount = expectedAmount * 0.98;

    if (amountSent < minAmount) {
      return NextResponse.json({
        status: 400,
        error: true,
        message:
          "Amount sent is below the minimum required. Please Contact Support",
      });
    }

    // Verify timestamp (1 hour range)
    const timestamp = transferEvent.block_timestamp;
    const currentTime = Date.now();
    const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

    // Calculate time differences
    const timeDifference = Math.abs(currentTime - timestamp);

    if (timeDifference > oneHourInMs) {
      return NextResponse.json({
        status: 400,
        error: true,
        message: "Transaction time is not within the 1-hour range",
      });
    }

    return NextResponse.json({
      status: 200,
      error: false,
      message: "Transaction hash is valid and correct",
    });
  } catch (error) {
    console.error("Error validating TRON USDT transaction:", error);
    return NextResponse.json({
      status: 500,
      error: true,
      message: "An error occurred while validating the transaction",
    });
  }
}
