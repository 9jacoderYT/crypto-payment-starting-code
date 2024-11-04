import { useState } from "react";
import axios from "axios";

const PaymentComponent = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");

  const handlePayment = async () => {
    if (amount <= 0) {
      console.error("Amount must be greater than zero.");
      return;
    }

    if (!currency) {
      console.error("Currency must be specified.");
      return;
    }

    console.log(amount, currency);

    try {
      console.log("fish");
      const response = await fetch("/api/createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        }),
      });
      console.log("goat");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${errorData.error || "Unknown error"}`
        );
      }

      const data = await response.json();
      console.log("Payment response:", data);
      // Handle the response, e.g., redirect to payment confirmation page
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="text-center py-16">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* Add more currencies as needed */}
      </select>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentComponent;
