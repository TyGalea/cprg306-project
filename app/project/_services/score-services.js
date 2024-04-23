import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export const getItems = async (userId) => {
  const q = query(collection(db, "users", userId, "scores"));
  const querySnapshot = await getDocs(q);
  const scores = [];
  querySnapshot.forEach((doc) => {
    scores.push(doc.data());
  });
  return scores;
};

export const addItem = async (userId, score) => {
  await addDoc(collection(db, "users", userId, "scores"), { score });
};
