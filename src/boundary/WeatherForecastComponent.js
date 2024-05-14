import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoadGoogleMapsApi from './LoadGoogleMapsApi';

const WeatherForecastContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const DateHeading = styled.h2`
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 20px;
`;

const ForecastCard = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
`;

const WeatherForecastComponent = () => {
  const [forecast, setForecast] = useState(null);
  const isApiLoaded = LoadGoogleMapsApi();

  useEffect(() => {
    if (isApiLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const elevator = new window.google.maps.ElevationService();

          const request = {
            locations: [{ lat: latitude, lng: longitude }],
          };

          elevator.getElevationForLocations(request, (results, status) => {
            if (status === window.google.maps.ElevationStatus.OK) {
              const elevation = results[0].elevation;
              fetchWeatherForecast(latitude, longitude, elevation);
            } else {
              console.error('Error getting elevation:', status);
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [isApiLoaded]);

  const fetchWeatherForecast = (latitude, longitude, elevation) => {
    const apiKey = '400f4de0ee400885f65658f4cda3c4da'; // Replace with your actual API key
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(openWeatherUrl)
      .then((response) => response.json())
      .then((data) => {
        setForecast(groupForecastByDate(data.list));
      })
      .catch((error) => {
        console.error('Error fetching weather forecast:', error);
      });
  };

  const groupForecastByDate = (forecastList) => {
    return forecastList.reduce((acc, cur) => {
      const date = new Date(cur.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(cur);
      return acc;
    }, {});
  };

  return (
    <WeatherForecastContainer>
      {forecast ? (
        Object.entries(forecast).map(([date, forecasts]) => (
          <div key={date}>
            <DateHeading>{date}</DateHeading>
            <ForecastGrid>
              {forecasts.map((item, index) => (
                <ForecastCard key={index}>
                  <p>Time: {new Date(item.dt * 1000).toLocaleTimeString()}</p>
                  <p>Temp: {item.main.temp}°C</p>
                  <p>Description: {item.weather[0].description}</p>
                </ForecastCard>
              ))}
            </ForecastGrid>
          </div>
        ))
      ) : (
        <p>Loading weather forecast...</p>
      )}
    </WeatherForecastContainer>
  );
};

export default WeatherForecastComponent;


/*400f4de0ee400885f65658f4cda3c4da OpenWeather API key*/