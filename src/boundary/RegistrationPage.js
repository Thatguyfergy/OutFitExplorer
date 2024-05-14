import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../control/RegistrationController';
import { auth } from '../entity/fireBaseService'; // This is correct if it exports the initialized auth object
import { getFirestore, doc, setDoc } from 'firebase/firestore';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredusername, setreentereedUsername] = useState(''); // New state for the re-entered password
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    // Check if passwords match before proceeding
    if (username !== reEnteredusername) {
      setErrorMessage('Passwords do not match.'); // Set an error message if passwords don't match
      return; // Prevent the form from being submitted
    }
    setErrorMessage('');

    try {
      const success = await registerUser(email, username, password);
      console.log("Email: ", email);
console.log("Username: ", username);
console.log("Password: ", password);
      if (success) {
        console.log("Registration successful!");
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        await setDoc(doc(db, 'users', userId), {
          uid: userId,
          username: password,
          email: email,
          points: 0,
          redeemedItems: [],
        });
        navigate('/home');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const pageStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '0 50px',
  };

  const leftContainerStyle = {
    flex: '1',
    maxWidth: '600px',
  };

  const rightContainerStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '600px',
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '100px',
    position: 'absolute', // Position it absolutely relative to its positioned parent
  top: '40px', // Adjust the value to match the desired spacing from the top
  left: '50px', // Adjust the value to match the desired spacing from the left
  width: '80px', // Adjust width as needed
  height: 'auto' // Keep the aspect ratio
  };

  const textStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%', // Full width of the parent container
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6a5acd', // Adjusted to a purple color
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const welcomeTextStyle = {
    ...textStyle,
    fontSize: '54px', // Larger font size for welcome text
  };

  return (
    <div style={pageStyle}>
      <div style={leftContainerStyle}>
        <img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
        <div style={welcomeTextStyle}>Welcome, Explorer.</div>
        <div style={textStyle}>Your next venture is waiting for you.</div>
      </div>
      <div style={rightContainerStyle}>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleRegistration}>
        <input
            style={inputStyle}
            type="text"
            placeholder="Enter Username"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            style={inputStyle}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

<input
            style={inputStyle}
            type="password"
            placeholder="Enter Password"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Re-enter Password"
            value={reEnteredusername}
            onChange={(e) => setreentereedUsername(e.target.value)}
          />
          <button style={buttonStyle} type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;