import React, { useEffect, useState } from 'react';
import { getUserRewardPoints } from '../control/RewardPointController'; // Adjust the import path as necessary
import { auth } from '../entity/fireBaseService';

function PointsDisplay() {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    // This function is defined to be called within useEffect
    const loadUserPoints = async () => {
      const userId = auth.currentUser?.uid; // Make sure this is the correct path to your auth object
      if (userId) {
        try {
          const points = await getUserRewardPoints(userId);
          setPoints(points); // Set the points in state
        } catch (error) {
          console.error('Error getting points:', error);
          setPoints('Error retrieving points'); // Handle the error state appropriately
        }
      }
    };

    loadUserPoints(); // Call the function
  }, []); // Empty dependency array means this effect runs once after the first render

  // Handle the loading state or check if the user is not logged in
  if (points === null) {
    return <p>Loading points...</p>; // or some other loading indicator
  }

  return (
    <p>Points: {points}</p>
  );
}

export default PointsDisplay;
