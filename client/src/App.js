import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import BrowsePage from './components/BrowsePage';
import FictionPage from './components/FictionPage';
import AuthorDashboard from './components/AuthorDashboard';

const App = () => (
  <Router>
    <header>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="My-Webnovel logo" />
        <h1>My-Webnovel</h1>
      </div>
      <nav>
        <Link to="/">Browse</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/fiction/:id/*" element={<FictionPage />} />
        <Route path="/dashboard" element={<AuthorDashboard />} />
      </Routes>
    </main>
  </Router>
);

export default App;
