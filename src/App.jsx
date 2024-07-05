import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import CreatePost from './pages/CreatePost';
import SongView from './pages/SongView';
import AddSong from './pages/AddSong';
import UserProfile from './pages/UserProfile';
import CreatePlaylist from './pages/CreatePlaylist';
import EditPlaylist from './pages/EditPlaylist';
import Navbar from './components/navbar/Navbar';
import { useState } from 'react';
import Footer from './components/footer/Footer';

function App() {
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleToggleSearchBar = (show) => {
    setShowSearchBar(show);
  };

  return (
    <Router>
      <Navbar onToggleSearchBar={handleToggleSearchBar} />
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        {localStorage.getItem('token') ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/songs" element={<SongView showSearchBar={showSearchBar} />} />
          </>
        ) : (
          <>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </>
        )}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/post/create" element={<CreatePost />} />
        <Route path='/addsong' element={<AddSong />} />
        <Route path='/playlist/create' element={<CreatePlaylist />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/playlist/edit/:id" element={<EditPlaylist />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
