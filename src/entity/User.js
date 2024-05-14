import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './fireBaseService'; // Make sure this points to your Firebase initialization file

const db = getFirestore(app);

// Function to create a user profile in Firestore
const createUserProfile = async (userAuth) => {
  const userProfileRef = doc(db, 'users', userAuth.uid);

  const userProfile = {
    uid: userAuth.uid,
    email: userAuth.email,
    rewardPoints: 0, // Initialize with 0 reward points or any starting value you choose
    // You can add more fields as needed
  };

  await setDoc(userProfileRef, userProfile);
};