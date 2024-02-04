// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Routes } from 'react-router-dom';
import FoodRecommendations from './FoodRecommendations/FoodRecommendations';
import MenstrualTracking from './MenstrualTracking/MenstrualTracking';
import FitnessRecommendations from './FitnessRecommendations/FitnessRecommendations';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const App = () => {
  return (
    <Router>
      <div>
        <Navbar
          variant="dark"
          expand="lg"
          rounded="true"
          style={{ backgroundColor: '#ff1493' }}  
        >
          <Navbar.Brand as={Link} to="/menstrual-tracking">CycleChic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/food-recommendations">Recipe Recommendations</Nav.Link>
              <Nav.Link as={Link} to="/fitness-recommendations">Dining Hall Recommendations</Nav.Link>
              <Nav.Link as={Link} to="/menstrual-tracking">Menstrual Tracking</Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes>
        <Route path="/food-recommendations" element={<FoodRecommendations />} />
        <Route path="/fitness-recommendations" element={<FitnessRecommendations />} />
        <Route path="/menstrual-tracking" element={<MenstrualTracking />} />

        <Route path="/" element={<FoodRecommendations />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;