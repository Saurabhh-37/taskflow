import React, { useState } from 'react';
import { createTheme, ThemeProvider, TextField, Button, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const THEME = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
      setSuccessMessage('Login successful!');
      setTimeout(() => navigate('/tasks'), 1500); // Redirect after 1.5 seconds
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMessage('Login successful with Google!');
      setTimeout(() => navigate('/tasks'), 1500); // Redirect after 1.5 seconds
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={THEME}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '400px',
          margin: '2rem auto',
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <Stack spacing={2}>
          <h2 style={{ textAlign: 'center' }}>Login</h2>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ margin: '0.5rem 0' }}
          >
            OR
          </Typography>
          <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Login with Google
          </Button>
          <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Register here
            </Link>
          </Typography>
        </Stack>
      </form>
    </ThemeProvider>
  );
};

export default Login;
