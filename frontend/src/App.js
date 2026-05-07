import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavbarComponent from './components/navbar';
import TrackExercise from './components/trackExercise';
import ActivitiesSummary from './components/statistics';
import ActivityFeed from './components/activityFeed';
import Dashboard from './components/dashboard';
import Footer from './components/footer';
import Login from './components/login';
import Signup from './components/signup';
import Journal from './components/journal';
import logo from './img/InclusiveFitness.png';
import AccessibilityToggle from './components/AccessibilityToggle';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  return (
    <div className="App">
      <AccessibilityToggle />
      <Router>
        <div className="appTitle">
          <h1>Inclusive Fitness</h1>
          <img src={logo} alt="Inclusive Fitness App Logo" id="appLogo" />
        </div>

        {isLoggedIn && <NavbarComponent onLogout={handleLogout} />}

        <div className="componentContainer">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignup={(username) => {
              setIsLoggedIn(true);
              setCurrentUser(username);
            }} />} />
            <Route path="/" element={isLoggedIn ? <Dashboard currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/trackExercise" element={isLoggedIn ? <TrackExercise currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/fitness" element={isLoggedIn ? <ActivitiesSummary currentUser={currentUser} showSummaryOnly={false} /> : <Navigate to="/login" />} />
            <Route path="/journal" element={isLoggedIn ? <Journal currentUser={currentUser} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
