import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

function getExpiryTimestamp(): number {
  const thirtyDaysInSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const expiryTimestamp = currentTimestamp + thirtyDaysInSeconds;

  return expiryTimestamp;
}

export const uploadNewUser = async (
  userId: number,
  hash: string
): Promise<boolean> => {
  const usersCollectionRef = collection(db, "users");

  const expires = getExpiryTimestamp();

  try {
    const docRef = await addDoc(usersCollectionRef, {
      userId: userId,
      hash: hash,
      expiry_date: expires,
      date_added: Date.now(),
    });

    return true;
  } catch (error) {
    console.log("Unable to upload transaction hash: " + error);
    return false;
  }
};

export const uploadTransactionHash = async (hash: string): Promise<boolean> => {
  const transactionsCollectionRef = collection(db, "transactionHash");

  try {
    const docRef = await addDoc(transactionsCollectionRef, {
      hash: hash,
      date_added: Date.now(),
    });

    return true;
  } catch (error) {
    console.log("Unable to upload transaction hash: " + error);
    return false;
  }
};

export const checkTransactionHash = async (hash: string): Promise<boolean> => {
  const transactionsCollectionRef = collection(db, "transactionHash");

  try {
    const q = query(transactionsCollectionRef, where("hash", "==", hash));
    const querySnapshot = await getDocs(q);

    // Extract entries and check if any document matches
    const entries = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log(entries);

    return entries.length > 0;
  } catch (error) {
    console.error("Error checking transaction hash:", error);
    return false;
  }
};

