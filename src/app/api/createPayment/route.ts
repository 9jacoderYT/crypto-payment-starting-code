import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { amount, currency } = await request.json();

    if (!amount || !currency) {
      throw new Error("Amount and currency must be specified");
    }

    console.log("Received payment request:", { amount, currency });

    // Define your public and private keys
    const publicKey =
      "34691858aa9767e8ec72dc432bfa253471a1fe056e8f1ac20aaa42aa6b65c194";
    const privateKey =
      "82Ce5E65F54363bCAb0ec27322d7Ecbe488BD0a232Fba87ddeb3e2852981362E";

    // Prepare the API request parameters
    const params = {
      cmd: "create_transaction",
      amount: amount,
      currency1: currency,
      currency2: "BTC", // The currency you want to receive
      buyer_email: "buyer@example.com", // Optional
    };

    // Generate the HMAC signature
    const queryString = Object.entries(params)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    const signature = crypto
      .createHmac("sha512", privateKey)
      .update(queryString)
      .digest("hex");

    // Add the keys and signature to the request payload
    const requestData = {
      ...params,
      key: publicKey,
      format: "json",
      version: 1,
      // Add the generated HMAC signature
      hmac: signature,
    };

    // Call the CoinPayments API
    const response = await axios.post(
      "https://www.coinpayments.net/api.php",
      requestData
    );

    console.log("CoinPayments response:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({
      error: "Error creating payment",
      details: error,
    });
  }
}
