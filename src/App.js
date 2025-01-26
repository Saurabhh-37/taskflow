import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Tasks from './pages/Tasks';
import Feed from './pages/Feed';
import CustomAppBar from './components/AppBar';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [isNavBarOpen, setNavBarOpen] = useState(false); // Initially closed

  const toggleNavBar = () => {
    setNavBarOpen(!isNavBarOpen);
  };

  return (
    <Router>
      {/* AppBar */}
      <CustomAppBar toggleNavBar={toggleNavBar} />

      <div style={{ display: 'flex', height: '100vh' }}>
        {/* NavBar */}
        <NavBar isOpen={isNavBarOpen} />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: '20px',
            marginLeft: isNavBarOpen ? '200px' : '0px', // Adjust margin dynamically
            marginTop: '64px', // Push content below AppBar
            transition: 'margin 0.3s',
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <DndProvider backend={HTML5Backend}>
                    <Tasks />
                  </DndProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
