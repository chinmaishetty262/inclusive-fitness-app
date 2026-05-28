import React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
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
import initGlobalErrorHandling from './errorHandler';
import ErrorBoundary from './ErrorBoundary';

initGlobalErrorHandling();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    setIsLoggedIn(false);
    setCurrentUser('');

    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };



  return (
    <ErrorBoundary>
      <div className="App">
        <AccessibilityToggle />
        <Router>
          <div className="appTitle">
            <h1>Inclusive Fitness</h1>
            <img src={logo} alt="Inclusive Fitness App Logo" id="appLogo" />
          </div>

          {isLoggedIn && <NavbarComponent onLogout={handleLogout} />}

          <main className="componentContainer">
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
          </main>
          <Footer />


          <Modal
            show={showLogoutModal}
            onHide={cancelLogout}
            centered
          >

            <Modal.Header closeButton>
              <Modal.Title className="w-100 text-center">
                Confirm Logout
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
              Do you really wish to leave?
            </Modal.Body>

            <Modal.Footer className="justify-content-center border-0">

              <Button
                variant="primary"
                className="rounded-pill px-4 py-2"
                onClick={cancelLogout}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                className="rounded-pill px-4 py-2"
                onClick={confirmLogout}
              >
                Logout
              </Button>

            </Modal.Footer>

          </Modal>

        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;
