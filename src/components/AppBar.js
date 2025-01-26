import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const CustomAppBar = ({ toggleNavBar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      navigate('/'); // Redirect to Login page
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  // Check if the current path is "/tasks" or "/feeds"
  const showLogoutButton = location.pathname === '/tasks' || location.pathname === '/feeds';

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* MenuIcon to toggle the NavBar */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleNavBar}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TaskFlow
        </Typography>
        {/* Conditionally render Logout Button */}
        {showLogoutButton && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
