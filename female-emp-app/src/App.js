// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FitnessRecommendations from './FitnessRecommendations/FitnessRecommendations';
import FoodRecommendations from './FoodRecommendations/FoodRecommendations';
import MenstrualTracking from './MenstrualTracking/MenstrualTracking';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/fitness">Fitness Recommendations</Link>
            </li>
            <li>
              <Link to="/food">Food Recommendations</Link>
            </li>
            <li>
              <Link to="/menstrual">Menstrual Tracking</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/fitness" element={<FitnessRecommendations />} />
          <Route path="/food" element={<FoodRecommendations />} />
          <Route path="/menstrual" element={<MenstrualTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
