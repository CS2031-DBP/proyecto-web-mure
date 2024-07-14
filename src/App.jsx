import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { MusicPlayerProvider } from "./contexts/MusicContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Edit from "./pages/Edit";
import ChangeCredentials from "./pages/ChangeCredentials";
import CreatePost from "./pages/CreatePost";
import SongView from "./pages/SongView";
import AddSong from "./pages/AddSong";
import CreatePlaylist from "./pages/CreatePlaylist";
import EditPlaylist from "./pages/EditPlaylist";
import CreateSpotify from "./pages/CrearSpotify";
import Navbar from "./components/navbar/navbar";
import { useState, useEffect } from "react";
import NotFound from "./pages/NotFound";
import FriendList from "./pages/FriendList";
import AddArtistInfo from "./pages/AddArtistInfo";
import AlbumView from "./pages/AlbumView"; 
import { jwtDecode } from 'jwt-decode';

function App() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleToggleSearchBar = (show) => {
    setShowSearchBar(show);
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkTokenValidity();

    const intervalId = setInterval(checkTokenValidity, 5 * 60 * 1000);

    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <MusicPlayerProvider>
        {isAuthenticated && (
          <Navbar
            onToggleSearchBar={handleToggleSearchBar}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/auth/login" />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/auth/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/songs"
                element={<SongView showSearchBar={showSearchBar} />}
              />
              <Route path="/user/:id" element={<User />} />
              <Route path="/user" element={<User />} />
              <Route path="/edit" element={<Edit />} />
              <Route
                path="/change-credentials"
                element={
                  <ChangeCredentials setIsAuthenticated={setIsAuthenticated} />
                }
              />
              <Route path="/post/create" element={<CreatePost />} />
              <Route path="/addsong" element={<AddSong />} />
              <Route path="/playlist/create" element={<CreatePlaylist />} />
              <Route path="/playlist/edit/:id" element={<EditPlaylist />} />
              <Route path="/friends" element={<FriendList />} />
              <Route path="/song/create/spotify" element={<CreateSpotify />} />
              <Route path="/add-artist-info" element={<AddArtistInfo />} />
              <Route path="/album/:albumId" element={<AlbumView />} /> 
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth/login" />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MusicPlayerProvider>
    </Router>
  );
}

export default App;
