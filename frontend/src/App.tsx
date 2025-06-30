import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketplacePage from './pages/MarketplacePage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MarketplacePage />} />
      </Routes>
    </Router>
  );
};

export default App;
