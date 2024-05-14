/*import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../entity/fireBaseService';

// Function to submit a review for a park
export const submitParkReview = async (parkId, rating, reviewText) => {
  try {
    // Validate review content and rating
    if (!parkId) {
      throw new Error('No park selected.');
    }
    if (reviewText.trim().length < 20) {
      throw new Error('Review must be at least 20 characters long.');
    }
    if (rating < 1 || rating > 5) {
      throw new Error('Invalid rating.');
    }

    // Update park document with new review
    const parkDocRef = doc(db, 'parks', parkId);
    await updateDoc(parkDocRef, {
      reviews: arrayUnion({ rating, reviewText, timestamp: new Date() }),
    });

    return true; // Review submitted successfully
  } catch (error) {
    console.error('Failed to submit review:', error);
    throw error;
  }
};

export default submitParkReview;*/