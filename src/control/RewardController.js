import { collection, getDocs } from 'firebase/firestore';
import { db } from '../entity/fireBaseService'; // Adjust the import path as necessary

// Firestore database instance

// Function to fetch items
export const fetchItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "rewards"));
    const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return itemsList; // Return the list of items
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error; // Rethrow the error to handle it in the UI component
  }
};
