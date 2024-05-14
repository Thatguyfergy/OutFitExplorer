import React, { useEffect, useState } from 'react';
import { changeUserPassword } from '../control/ManageProfileController';
import { auth } from '../entity/fireBaseService';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 
import { Link } from 'react-router-dom';

function ManageProfilePage() {
  const [points, setPoints] = useState(() => {
    // Get points from local storage or default to 0
    const savedPoints = localStorage.getItem('userPoints');
    return savedPoints ? Number(savedPoints) : 0;
  });
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        const db = getFirestore();
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRedeemedItems(userData.redeemedItems || []);
            setPoints(userData.points|| 0); // Set points state
            localStorage.setItem('userPoints', userData.points || '0'); // Update local storage
            setUsername(userData.username || '');
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // Finish loading
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      const success = await changeUserPassword(newPassword);
      if (success) {
        setMessage('Password successfully updated.');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };


  

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '0 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '40px',
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '-40px',
  };

  const navStyle = {
    alignSelf: 'flex-start',
    paddingLeft: '20px',
    marginBottom: '-40px',
    display: 'flex',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#6a5acd',
    margin: '0 10px',
    
  };

  const inputStyle = {
    width: '300px',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const messageStyle = {
    marginTop: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  };
  
  if (isLoading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div style={containerStyle}>
<nav style={navStyle}>
        <img src="/logo.png" alt="Logo" style={logoStyle} />
        <div>
          <Link to="/home" style={navLinkStyle}>Home</Link>
          <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
          <Link to="/manage" style={navLinkStyle}>Profile</Link>
        </div>
      </nav>

      <div style={headerStyle}>Manage Profile</div>
      <p>Username: {username}</p> {/* Display username */}
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button style={buttonStyle} type="submit">
            Change Password
          </button>
        </form>
        <p>Points: {points}</p> {/* Display points */}
        {message && <p style={messageStyle}>{message}</p>}
      </div>
     

      <h2>Redeemed Items</h2>
          <ul>
            {redeemedItems.map(item => (
              <li key={item}>{item}</li> // Display item IDs; may want to fetch item details
            ))}
          </ul>

    </div>
  );
}

export default ManageProfilePage;