"use client";
import * as React from "react";
import {
  CopyAllOutlined,
  CurrencyExchange,
  LocalAtm,
} from "@mui/icons-material";
import { useState } from "react";
import ElementOne from "./elements/element-1";
import { Alert } from "@mui/material";

export default function PaymentSection() {
  // Transaction states
  const [currency, setCurrency] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");

  // user feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<boolean | null>(false);

  const fetchTokenAmount = async (usdAmount: number, token: string) => {
    try {
      const response = await fetch("/api/convert-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usdAmount, token }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.amount; // Return the fetched amount
    } catch (err) {
      // Return fallback values in case of an error
      return 0;
    }
  };

  const handlePayment = async () => {
    setError(null);
    setSuccess(null);

    if (!currency || !wallet || !amount || !transactionHash) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const url = `/api/validate-${currency}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionHash: transactionHash,
          wallet: wallet,
          amount: amount,
          currency: currency,
        }),
      });

      const { error, message } = await response.json();

      if (error) {
        setError(message);
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setError(null);
    const currencyValue = e.target.value;
    if (currencyValue == "null" || !amount) {
      setWallet("");
      setAmount(0);
      return;
    }

    if (currencyValue == "usdt") {
      setWallet("0x0827BC11F147ABdB20aDF6b5Ff8204A7eEFA165F");
    }
    if (currencyValue == "bnb") {
      setWallet("0x0827BC11F147ABdB20aDF6b5Ff8204A7eEFA165F");
      // convert the currency
      const currency = await fetchTokenAmount(amount, "bnb");
      setAmount(currency);
    }

    setCurrency(currencyValue);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      alert("Wallet address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div id="payment">
      <div className="px-4 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-lg md:px-24 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between lg:flex-row gap-5 lg:gap-0">
          <ElementOne />

          <div className="px-5 pt-6 pb-5 text-center border border-gray-300 rounded lg:w-2/5">
            <input
              type="number"
              placeholder="Amount to Pay in USD"
              className="w-full h-12 px-4 text-teal-700 transition duration-200 bg-white border border-transparent rounded shadow-md focus:border-teal-900 focus:outline-none"
              onChange={(event) => {
                const newAmount =
                  event.target.value === ""
                    ? 0
                    : parseFloat(event.target.value);
                if (!isNaN(newAmount)) {
                  setAmount(newAmount);
                }
              }}
            />

            <p className="py-3 italic text-white">
              Enter Amount you want to pay in dollars, code will convert it to
              your required token
            </p>

            <select
              className="w-full h-12 px-4 text-teal-700 transition duration-200 bg-white border border-transparent rounded shadow-md focus:border-teal-900 focus:outline-none"
              onChange={handleCurrencyChange}
            >
              <option defaultChecked value="null">
                - Mode Of Payment -
              </option>
              <option value="usdt">UsDT - BSC Network</option>
              <option value="bnb">BNB - BSC Network</option>
            </select>

            {currency && (
              <>
                <div className="text-white text-xl my-5 w-full">
                  Send Exactly{" "}
                  <big className="text-teal-400">
                    {amount} {currency}
                  </big>{" "}
                  here
                  <b />
                  <p className="text-sm break-words overflow-hidden">
                    {wallet}
                    <button
                      onClick={copyToClipboard}
                      className="cursor-pointer ml-2"
                    >
                      <CopyAllOutlined className="w-5 h-5 text-gray-500 hover:text-teal-700 transition duration-200" />
                    </button>
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Transaction Hash"
                  className="w-full h-12 px-4 text-teal-700 transition duration-200 bg-white border border-transparent rounded shadow-md focus:border-teal-900 focus:outline-none"
                  onChange={(event) =>
                    setTransactionHash(event.target.value.trim())
                  }
                />

                <div className="my-3 font-light text-white italic">
                  Your Valid Transaction Hash
                </div>

                <p className="max-w-md px-5 mb-3 text-xs text-white sm:text-sm md:mb-5">
                  I confirm I have made exactly {amount} {currency} transfer to
                  the wallet address.
                </p>
              </>
            )}

            <div className="flex items-center w-full mb-5">
              <hr className="flex-1 border-gray-300" />
              <div className="px-3 text-xs text-gray-500 sm:text-sm">
                <LocalAtm className="text-white" />
              </div>
              <hr className="flex-1 border-gray-300" />
            </div>
            <div className="flex justify-center w-full mb-3">
              <button
                onClick={handlePayment}
                className={`inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md md:w-auto bg-teal-700 hover:bg-teal-900 focus:shadow-outline focus:outline-none ${
                  loading && "animate-pulse"
                }`}
              >
                I have made the payment
                <CurrencyExchange className="ml-2" />
              </button>
            </div>

            {error && (
              <>
                <Alert severity="error">{error}</Alert>
              </>
            )}

            {success && (
              <>
                <Alert severity="success">Transaction is Valid.</Alert>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
