import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import BrowsePage from './components/BrowsePage';
import FictionPage from './components/FictionPage';
import AddChapterPage from './components/AddChapterPage';
import EditFictionPage from './components/EditFictionPage';
import AuthorDashboard from './components/AuthorDashboard';
import ProfilePage from './components/ProfilePage';
import { AuthContext } from './AuthContext';

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="My-Webnovel logo" />
          <h1>My-Webnovel</h1>
        </Link>
        <nav aria-label="Primary">
          <ul>
            <li><Link to="/browse">Browse</Link></li>
            {!user && (
              <>
                <li><Link to="/signup">Signup</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            {user && (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
            {user && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/fiction/:id/new-chapter" element={<AddChapterPage />} />
          <Route path="/fiction/:id/edit" element={<EditFictionPage />} />
          <Route path="/fiction/:id/*" element={<FictionPage />} />
          <Route path="/dashboard" element={<AuthorDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
