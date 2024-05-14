import { auth } from '../entity/fireBaseService';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Sign in function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // User is signed in
    console.log("User signed in:", userCredential.user);
    return true; // Indicate success
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error; // Rethrow the error so it can be caught in LoginPage.js
  }
};