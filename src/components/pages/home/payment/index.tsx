"use client";
import {
  CopyAllOutlined,
  CurrencyExchange,
  LocalAtm,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ElementOne from "./elements/element-1";
import { Alert, CircularProgress } from "@mui/material";
import { isValidEthOrBscTransactionHash } from "../../../../../lib/validations";
import {
  checkTransactionHash,
  uploadNewUser,
  uploadTransactionHash,
} from "../../../../../lib/database/firebase-funcs";

export default function PaymentSection() {
  const searchParams = useSearchParams(); // Access search parameters
  const [chatId, setChatId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>(""); // For handling user input
  const [isInputLocked, setIsInputLocked] = useState<boolean>(false); // To manage input locking
  const [currency, setCurrency] = useState<string>("usdt");
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<boolean | null>(false);
  const [inviteLink, setInviteLink] = useState<string>("");

  useEffect(() => {
    const chatIdParam = searchParams.get("chatId"); // Get chatId from the query parameters
    if (chatIdParam) {
      setChatId(parseInt(chatIdParam)); // Parse to number
      setIsInputLocked(true); // Lock input immediately if chatId is available
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure only numbers can be entered
    if (/^\d*$/.test(value)) {
      setInputValue(value); // Update input value
      setChatId(value ? parseInt(value) : null); // Update chatId if valid
      if (value) {
        // Delay locking input for 1 second after input changes
        setTimeout(() => {
          if (!searchParams.get("chatId")) {
            // Only lock if no chatId from params
            setIsInputLocked(false);
          }
        }, 1000); // 1000ms = 1 second
      }
    }
  };

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
      if (token === "bnb") {
        return 0.176;
      } else if (token === "eth") {
        return 0.04;
      }
      return 0; // Return 0 if the token is neither BNB nor ETH
    }
  };

  const handlePayment = async () => {
    setError(null);
    setSuccess(null);

    if (!chatId || !currency || !wallet || !amount || !transactionHash) {
      setError("All fields are required");
      return;
    }

    // we have to validate the transaction hash
    let validateTransactionHash =
      isValidEthOrBscTransactionHash(transactionHash);

    if (!validateTransactionHash) {
      setError("Transaction Hash Invalid");
      return;
    }

    setLoading(true);

    try {
      //check if the transaction hash has been used previously
      let res = await checkTransactionHash(transactionHash);
      if (res) {
        setError("Transaction Hash already Used.");
        return;
      }

      let url = "/api/validateTransaction";
      if (currency == "usdt") {
        url = "/api/validate";
      }

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

      // Send the user the link
      const result = await fetch("/api/sendInvite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: chatId,
        }),
      });

      const { errorStatus, text } = await result.json();

      if (errorStatus) {
        setError(text);
        return;
      }

      // add the user to the database
      const resp = await uploadNewUser(chatId, transactionHash);

      //upload the transaction hash
      const hashResponse = await uploadTransactionHash(transactionHash);

      // Success case
      alert("Invite link has been sent to your Telegram!");

      //setSuccess
      setSuccess(true);
      setInviteLink(text);
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
    if (currencyValue == "null") {
      setWallet("");
      setAmount(0);
      return;
    }

    if (!chatId) {
      setError("Valid Chat ID is required");
      return;
    }

    // now before the users continues, we need to validate the chat id
    const result = await fetch("/api/check-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: chatId,
      }),
    });

    const { idStatus } = await result.json();

    if (idStatus) {
      setError("Invalid Trade Tutor ID, Follow step 1 to continue");
      return;
    }

    if (currencyValue == "usdt") {
      setWallet("0x0527bB5863E2904ABB8AfD4D76E90d3C18f55a27");
      setAmount(2.5);
    }
    if (currencyValue == "bnb") {
      setWallet("0x0827BC11F147ABdB20aDF6b5Ff8204A7eEFA165F");
      // convert the currency
      const currency = await fetchTokenAmount(100, "bnb");
      setAmount(currency);
    }
    if (currencyValue == "eth") {
      setWallet("ethwalletaddress");
      const currency = await fetchTokenAmount(100, "eth");
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
              type="text"
              placeholder={chatId ? "" : "Input your Trade Tutor ID"}
              className="w-full h-12 px-4 text-teal-700 transition duration-200 bg-white border border-transparent rounded shadow-md focus:border-teal-900 focus:outline-none"
              value={chatId !== null ? chatId.toString() : inputValue}
              onChange={handleInputChange}
              disabled={isInputLocked} // Disable input if locked
            />
            {chatId ? (
              <p className="text-white italic font-medium py-3">
                Your TradTutor ID: {chatId}
              </p>
            ) : (
              <p className="py-3 italic text-white">
                Please enter your TradeTutor ID to proceed
              </p>
            )}

            <select
              className="w-full h-12 px-4 text-teal-700 transition duration-200 bg-white border border-transparent rounded shadow-md focus:border-teal-900 focus:outline-none"
              onChange={handleCurrencyChange}
              disabled={chatId ? false : true}
            >
              <option defaultChecked value="null">
                - Mode Of Payment -
              </option>
              <option value="usdt">UsDT</option>
              <option value="bnb">BNB</option>
              {/* <option value="eth">Ether</option> */}
            </select>

            {amount && (
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
                  <p className="text-sm text-red-400 py-2 leading-5">
                    *Make sure to select the{" "}
                    <big className="font-bold">BSC(BEP20)</big> Network, if you
                    are transferring from Bybit, Binance or any Crypto Exchange*
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
                <Alert severity="success">
                  You have been sent a 1 hour invite link to the Premium group
                  by the TradeTutor Bot.
                </Alert>
              </>
            )}

            {inviteLink && (
              <>
                <p className="text-white italic text-md">
                  If you have not received an invite link, please use this.
                </p>
                <a
                  href={inviteLink}
                  className="text-teal-300 italic text-lg font-semibold underline"
                >
                  {inviteLink}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
