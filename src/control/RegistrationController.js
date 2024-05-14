import { auth, db } from '../entity/fireBaseService';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // User is created
    const user = userCredential.user;

    // Now create a user document in Firestore with the same UID
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email, // Assuming you want to store the email in Firestore as well
      rewardPoints: 0, // Initialize reward points to 0 or any default value you choose
      // Add additional fields as needed
    });

    return userCredential; // Return the user credential after successfully creating the document
  } catch (error) {
    // Handle errors here
    console.error("Error signing up or creating the user document in Firestore: ", error);
    throw error; // It's usually better to handle the error where you can inform the user appropriately
  }
};
