import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../control/LoginPageController.js';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const success = await loginUser(username, password);
      if (success) {
        navigate('/home');
      }
    } catch (error) {
      console.error(error.message);
      alert('Incorrect email or password'); // Display error message as alert
    }
  };

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
  };

  const leftContainerStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '600px',
    padding: '0 50px',
  };

  const rightContainerStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '600px',
    padding: '0 50px',
  };

  const logoStyle = {
    position: 'absolute',
    top: '40px',
    left: '50px',
    width: '80px',
    height: 'auto'
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
    width: '100%',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const signUpStyle = {
    marginTop: '20px',
    color: '#6a5acd',
    textDecoration: 'none',
  };

  const welcomeTextStyle = {
    ...textStyle,
    fontSize: '54px', // Larger font size for welcome text
  };

  return (
    <div style={pageStyle}>
      <img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
      <div style={leftContainerStyle}>
        <div style={welcomeTextStyle}>Welcome back, Explorer.</div>
        <div style={textStyle}>Your next venture is waiting for you.</div>
      </div>
      <div style={rightContainerStyle}>
        <form onSubmit={handleLogin}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={buttonStyle} type="submit">Login</button>
        </form>
        <Link to="/register" style={signUpStyle}>Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginPage;
