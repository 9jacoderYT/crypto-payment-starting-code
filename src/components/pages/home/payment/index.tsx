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

  const fetchTokenAmount = async (usdAmount: number, token: string) => {};

  const handlePayment = async () => {};

  const handleCurrencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {};

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
          </div>
        </div>
      </div>
    </div>
  );
}
