import React from 'react';
import { CooldownProvider } from './boundary/CoolDownTimer'; // Import the CooldownProvider
import { HomePage, LandingPage, LoginPage, ManageProfilePage, LeaveReviewPage, RegistrationPage, ReviewPage, RewardsPage, ViewNearbyParksPage, WeatherForecastPage, ExerciseSuggestionsPage } from './boundary';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <CooldownProvider> {/* Wrap all routes with CooldownProvider */}
        <div className="App">
          <Routes>
          <Route path="/" element={<Navigate replace to="/landing" />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/manage" element={<ManageProfilePage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/viewnearby" element={<ViewNearbyParksPage />} />
            <Route path="/weatherforecast" element={<WeatherForecastPage />} />
            <Route path="/exercisesuggestions" element={<ExerciseSuggestionsPage />} />
            <Route path="/leavereview" element={<LeaveReviewPage />} />
          </Routes>
        </div>
      </CooldownProvider>
    </Router>
  );
}

export default App;
