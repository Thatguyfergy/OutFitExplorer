import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../entity/fireBaseService';


// Function to update user's reward points
export const updateUserRewardPoints = async (userId, pointss) => {
  const userDocRef = doc(db, 'users', userId);

  try {
    // Check if the user is within 1km of a park
    const isWithinParkRadius = await checkUserWithinParkRadius(userId);
    if (!isWithinParkRadius) {
      throw new Error("User is not within 1km of a park. Cannot redeem points.");
    }

    // Update the 'rewardPoints' field
    await updateDoc(userDocRef, {
      points: increment(pointss),
    });

    return pointss; // Return updated points
  }
  catch (error) {
    console.error('Error updating reward points:', error);
    throw error;
  }};

// Function to get user's reward points
export const getUserRewardPoints = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  
  try {
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      // User document found in Firestore, return the reward points
      const userData = userDocSnap.data();
      return userData.rewardPoints || 0; // Assuming the field is called 'rewardPoints'
    } else {
      // No user document found in Firestore
      console.log("No such document!");
      return 0; // Or handle this case as appropriate
    }
  } catch (error) {
    console.error("Error fetching user reward points: ", error);
    throw error;
  }
};
// Function to check if user is within 1km of a park
const checkUserWithinParkRadius = async () => {
  try {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places || !window.google.maps.places.PlacesService) {
      throw new Error('Google Maps API is not loaded.');
    }

    // Get user's current location using Geolocation API
    const userLocation = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords),
        error => reject(error)
      );
    });

    console.log('User location:', userLocation);

    // Use Google Maps API to find nearby parks
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    const nearbyParks = await new Promise((resolve, reject) => {
      const request = {
        location: new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude),
        radius: 1000, // 1km radius
        type: ['park']
      };
      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });

    console.log('Nearby parks:', nearbyParks);

    // Return true if there are nearby parks, false otherwise
    return nearbyParks.length > 0;
  } catch (error) {
    console.error('Error checking user location:', error);
    throw error;
  }
};
