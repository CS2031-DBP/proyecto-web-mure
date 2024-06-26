import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  if (localStorage.getItem("token") === null) {
    return <div></div>;
  } else {
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate("/dashboard")}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              MyApp
            </Typography>
            <Button color="inherit" onClick={() => navigate("/profile")}>Profile</Button>
            <Button color="inherit" onClick={() => navigate("/songs")}>Songs</Button>
            <Button color="inherit" onClick={() => navigate("/post/create")}>Create Post</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </div>
    );
  }
};

export default Navbar;
