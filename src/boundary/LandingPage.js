import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start of the main axis
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '0 80px', // Adjust padding to match the image layout
  };

  const leftContainerStyle = {
    maxWidth: '50%', // Set max width to half of the container
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const rightContainerStyle = {
    maxWidth: '50%', // Set max width to half of the container
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the start of the cross axis
    padding: '0 20px', // Adjust padding as needed
  };

  const logoStyle = {
    maxWidth: '300px',
    height: 'auto',
  };

  const welcomeTextStyle = {
    fontSize: '48px', // Adjust font size to match the image
    fontWeight: 'bolder',
    color: '#1D1D1F',
    marginBottom: '20px', // Adjust spacing as needed
    textAlign: 'left', // Align text to the left
  };

  const descriptionTextStyle = {
    fontSize: '18px', // Adjust font size to match the image
    fontWeight: 'normal',
    color: '#1D1D1F',
    marginBottom: '40px', // Adjust spacing as needed
    textAlign: 'left', // Align text to the left
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align buttons to the start of the container
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added shadow for depth
    textTransform: 'uppercase', // Match the case styling from the image
  };

  return (
    <div style={containerStyle}>
      <div style={leftContainerStyle}>
        <img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
      </div>
      <div style={rightContainerStyle}>
        <div style={welcomeTextStyle}>Welcome to Outfit Explorer</div>
        <div style={descriptionTextStyle}>
          Your ultimate guide to park amenities, reviews, and weather conditions.
        </div>
        <div style={buttonContainerStyle}>
          <Link to="/register"><button style={buttonStyle}>Register</button></Link>
          <Link to="/login"><button style={buttonStyle}>Log In</button></Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;