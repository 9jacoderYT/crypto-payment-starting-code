import Moralis from "moralis";

let moralisInitialized = false;

// Function to initialize Moralis lazily
export async function initializeMoralis(): Promise<void> {
  if (!moralisInitialized) {
    try {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY as string,
      });
      moralisInitialized = true;
      console.log("Moralis initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Moralis:", error);
      throw new Error("Failed to initialize Moralis");
    }
  }
}
export const scientificToDecimal = (num: number): string => {
  const nsign = Math.sign(num);
  num = Math.abs(num);

  let result = String(num);

  if (/\d+\.?\d*e[\+\-]*\d+/i.test(result)) {
    const zero = "0";
    const parts = result.toLowerCase().split("e");
    const exponent = parseInt(parts.pop() || "0", 10);
    const coefficient = parts[0].split(".");

    if (exponent < 0) {
      // Handle negative exponent
      const decimalPart = coefficient[1] || "";
      const zerosToAdd = Math.abs(exponent) - coefficient[0].length;
      result =
        zero +
        "." +
        "0".repeat(Math.max(0, zerosToAdd)) +
        coefficient[0] +
        decimalPart;
    } else {
      // Handle positive exponent
      const decimalPart = coefficient[1] || "";
      const extraZeros = exponent - decimalPart.length;
      result =
        coefficient[0] + decimalPart + "0".repeat(Math.max(0, extraZeros));
      if (decimalPart.length < exponent) {
        result += "." + decimalPart.slice(exponent);
      }
    }
  }

  return nsign < 0 ? "-" + result : result;
};


// Validates if a string is a valid Ethereum or BSC transaction hash
export function isValidEthOrBscTransactionHash(txHash: string): boolean {
  const hexRegex = /^0x[a-fA-F0-9]{64}$/;
  return hexRegex.test(txHash);
}

// Converts BNB value to a human-readable decimal format
export function convertBnbToDecimals(value: number): number {
  const decimals = 18;
  return value / Math.pow(10, decimals);
}

// Converts an ISO date string to a Unix timestamp (in seconds)
export function convertDateToTimestamp(dateValue: string): number {
  const dateObject = new Date(dateValue);
  return Math.floor(dateObject.getTime() / 1000);
}

// Checks if a given amount is within ±0.1 range of a target amount
export function amountWithinRange(value: number, amount: number): boolean {
  const lowerBound = amount - 0.1;
  const upperBound = amount + 0.1;
  return value >= lowerBound && value <= upperBound;
}

// Verifies if a timestamp falls within a 48-hour range from the current time
export function timestampWithinRange(timestamp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const twoDaysInSeconds = 2 * 24 * 60 * 60;

  return (
    timestamp >= currentTime - twoDaysInSeconds &&
    timestamp <= currentTime + twoDaysInSeconds
  );
}
