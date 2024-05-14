import { updateUserRewardPoints } from '../control/RewardPointController'; // Adjust the import path as necessary
import { useCooldown } from '../boundary/CoolDownTimer'; // Import the useCooldown hook

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

function RedeemPointsButton({ userId, pointsToRedeem }) {
  const { iscooldown, setIsCooldown, cooldownTimeLeft } = useCooldown(); // Access cooldown context

  const handleRedeemPoints = async () => {
    if (iscooldown) {
      const remainingTime = formatTime(cooldownTimeLeft); // Format remaining time
      alert(`You have recently redeemed points. Please wait ${remainingTime} before redeeming again.`);
      return; // Prevent further execution if cooldown is active
    }

    try {
      const isSuccess = await updateUserRewardPoints(userId, pointsToRedeem);
      if (isSuccess) {
        alert('Points successfully redeemed!');
        console.log('Points redeemed successfully!');
        // Set cooldown start time
        setIsCooldown(true);
        // Handle any follow-up actions, like navigation or updating local state
      } else {
        alert('You have not reached a park yet. Cannot redeem points.');
        console.log('User has not reached a park yet. Cannot redeem points.');
      }
    } catch (error) {
      alert('You have not reached a park yet. Cannot redeem points.');
      console.error('Failed to redeem points:', error);
      // Handle errors, maybe show an error message to the user
    }
  };

  const buttonStyle = {
    padding: '5px 10px',
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };


  return (
    <button style={buttonStyle } onClick={handleRedeemPoints}>Redeem Points</button>
  );
}

export default RedeemPointsButton;
