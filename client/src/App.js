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
      <header>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="My-Webnovel logo" />
          <h1>My-Webnovel</h1>
        </Link>
        <nav>
          <Link to="/browse">Browse</Link>
          {!user && (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile">Profile</Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sign Out
              </button>
            </>
          )}
          {user && <Link to="/dashboard">Dashboard</Link>}
        </nav>
      </header>
      <main>
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
