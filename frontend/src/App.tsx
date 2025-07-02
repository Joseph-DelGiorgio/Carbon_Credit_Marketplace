import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketplacePage from './pages/MarketplacePage';

const App = () => (
  <Router>
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<MarketplacePage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
