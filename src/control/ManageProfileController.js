import { auth } from '../entity/fireBaseService';
import { updatePassword } from "firebase/auth";

export const changeUserPassword = async (newPassword) => {
  const user = auth.currentUser; // Get the currently signed-in user
  if (user) {
    try {
      await updatePassword(user, newPassword);
      console.log('Password update successful');
      return true; // Indicate success
    } catch (error) {
      console.error("Error updating password:", error);
      throw error; // Rethrow the error to handle it in the UI component
    }
  } else {
    throw new Error("No user signed in");
  }
};