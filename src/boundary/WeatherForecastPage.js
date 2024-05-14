import React from 'react';
import WeatherForecastComponent from './WeatherForecastComponent';
import { Link } from 'react-router-dom';


const WeatherForecastPage = () => {

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '-30px',
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


  return (
    <div>

<nav>
<img src="/logo.png" alt="Logo" style={logoStyle} />
        <div>
          <Link to="/home" style={navLinkStyle}>Home</Link>
          <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
          <Link to="/manage" style={navLinkStyle}>Profile</Link>
        </div>
      </nav>

      <h1>Weather Forecast</h1>
      {/* Add your home page content here */}
      <WeatherForecastComponent />
    </div>
  );
};

export default WeatherForecastPage;