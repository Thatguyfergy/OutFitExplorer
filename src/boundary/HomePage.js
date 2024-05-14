import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import { FaTree, FaDumbbell, FaCloudSun, FaThumbsUp } from 'react-icons/fa';
import RedeemPointsButton from './RedeemPointsButton';
import { auth } from '../entity/fireBaseService';
// Import Firestore functions
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 


const HomePage = () => {

  // State to store the fetched username
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch the user's username from Firestore
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUsername(userData.username); // Set the username in state
        }
      }
    };

    fetchUserData();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '20px',
  };

  const navStyle = {
    alignSelf: 'flex-start',
    paddingLeft: '20px',
    marginBottom: '40px',
    display: 'flex',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#6a5acd',
    margin: '0 10px',
  };

  const welcomeTextStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center', // Align text to the center
    width: '100%', // Take the full width of the container
    marginBottom: '20px',
    color: '#000000',
    display: 'flex', // Use flexbox for centering
    justifyContent: 'center', // Horizontally center the content
  };
  

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
  };

  const cardStyle = {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#6a5acd',
    width: '150px',
    height: '150px',
    margin: '10px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  };

  const iconStyle = {
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
      <nav style={navStyle}>
        <Link to="/home" style={navLinkStyle}>Home</Link>
        <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
        <Link to="/manage" style={navLinkStyle}>Profile</Link>
      </nav>
      <h1 style={welcomeTextStyle}>Welcome, {username || 'Explorer'}.</h1>
      <div style={cardContainerStyle}>
        <Link to="/viewnearby" style={cardStyle}>
          <FaTree style={iconStyle} size="1.5em" />
          View Nearby Parks
        </Link>
        <Link to="/exercisesuggestions" style={cardStyle}>
          <FaDumbbell style={iconStyle} size="1.5em" />
          See Exercises
        </Link>
    
        <Link to="/weatherforecast" style={cardStyle}>
          <FaCloudSun style={iconStyle} size="1.5em" />
          View Weather Forecast
        </Link>
      </div>
      <p style={{ textAlign: 'center', color: 'purple' }}>Explore a park nearby and simply click the button to earn your point!</p>
      <RedeemPointsButton userId={auth.currentUser?.uid} pointsToRedeem={1} />
    </div>
  );
};

export default HomePage;