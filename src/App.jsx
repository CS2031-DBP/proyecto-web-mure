import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import User from './pages/User'; 
import Edit from './pages/Edit';
import CreatePost from './pages/CreatePost';
import SongView from './pages/SongView';
import AddSong from './pages/AddSong';
import CreatePlaylist from './pages/CreatePlaylist';
import EditPlaylist from './pages/EditPlaylist';
import CreateSpotify from './pages/CrearSpotify';
import Navbar from './components/navbar/navbar';
import { useState, useEffect } from 'react';
import Footer from './components/footer/Footer';
import NotFound from './pages/NotFound';
import FriendList from './pages/FriendList';
import AddArtistInfo from './pages/AddArtistInfo';
import ChangePassword from './pages/ChangePassword';

function App() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleToggleSearchBar = (show) => {
    setShowSearchBar(show);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Router>
      {isAuthenticated && <Navbar onToggleSearchBar={handleToggleSearchBar} setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/auth/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register setIsAuthenticated={setIsAuthenticated} />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/songs" element={<SongView showSearchBar={showSearchBar} />} />
            <Route path="/user/:id" element={<User />} /> 
            <Route path="/user" element={<User />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/post/create" element={<CreatePost />} />
            <Route path='/addsong' element={<AddSong />} />
            <Route path='/playlist/create' element={<CreatePlaylist />} />
            <Route path="/playlist/edit/:id" element={<EditPlaylist />} />
            <Route path="/friends" element={<FriendList/>} />
            <Route path="/song/create/spotify" element={<CreateSpotify />} />
            <Route path="/add-artist-info" element={<AddArtistInfo />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/auth/login" />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuthenticated ? <Footer /> : null}
    </Router>
  );
}

export default App;
