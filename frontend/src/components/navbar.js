import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = ({ onLogout }) => {
  const navigate = useNavigate();

  const onNavigate = (route) => {
    console.log('Navigating to:', route);
    switch (route) {
      case 'Home':
        navigate('/');
        break;
      case 'Track':
        navigate('/trackExercise');
        break;
      case 'Fitness':
        navigate('/fitness');
        break;
      case 'Journal':
        navigate('/journal');
        break;
      case 'Goals':
        navigate('/goals');
        break;
      default:
        console.error('Invalid route:', route);
    }
  };

  return (
    <Navbar className="nav-back custom-navbar" expand="lg" sticky="top">
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        aria-label="Toggle navigation menu"
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav>
            <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Home')}>
              <span className="nav-icon" aria-hidden="true">🏠</span>
              <span>Home</span>
            </Nav.Link>
            <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Track')}>
              <span className="nav-icon" aria-hidden="true">🏃</span>
              <span>Track</span>
            </Nav.Link>
            <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Fitness')}>
              <span className="nav-icon" aria-hidden="true">📊</span>
              <span>Fitness</span>
            </Nav.Link>
            <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Journal')}>
              <span className="nav-icon" aria-hidden="true">📔</span>
              <span>Journal</span>
            </Nav.Link>
            <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Goals')}>
              <span className="nav-icon" aria-hidden="true">🎯</span>
              <span>Goals</span>
            </Nav.Link>
            <Nav.Link className="custom-nav-link logout-link" onClick={onLogout}>
              <span className="nav-icon" aria-hidden="true">🚪</span>
              <span>Logout</span>
            </Nav.Link>
          </Nav>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
