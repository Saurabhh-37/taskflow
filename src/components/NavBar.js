import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = ({ isOpen }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        '& .MuiDrawer-paper': {
          width: '200px',
          marginTop: '64px', // Push the NavBar below the AppBar
          height: 'calc(100vh - 64px)', // Avoid overlapping the AppBar
          transition: 'width 0.3s',
        },
      }}
    >
      <Divider />
      <List>
        <ListItem button component={Link} to="/tasks">
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button component={Link} to="/feed">
          <ListItemText primary="Feed" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavBar;
