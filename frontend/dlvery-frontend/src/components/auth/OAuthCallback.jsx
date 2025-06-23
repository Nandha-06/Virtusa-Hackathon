import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, CircularProgress, Alert, Paper, Container } from '@mui/material';

const OAuthCallback = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract the authorization code from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('Authorization code not found in the callback URL');
        }

        // Process the OAuth callback with the code
        await loginWithGoogle(code);
        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        // Handle different types of error responses
        if (err.errors && Array.isArray(err.errors)) {
          // If the backend returns a list of validation errors
          setError(err.errors.map(e => e.message || e).join('\n'));
        } else if (err.message) {
          // If there's a specific error message
          setError(err.message);
          
          // Add helpful troubleshooting tips for connection errors
          if (err.message.includes('Network error') || 
              err.message.includes('No response from server')) {
            setError(err.message + '\n' + 
              'Troubleshooting tips:\n' +
              '1. Check if the backend server is running on http://localhost:8080\n' +
              '2. Verify your internet connection\n' +
              '3. Check if your firewall is blocking the connection');
          }
          
          // If there are additional details, include them
          if (err.details) {
            setError(prev => prev + '\n' + err.details);
          }
        } else if (typeof err === 'string') {
          // If the error is a string
          setError(err);
        } else {
          // Default error message
          setError('Authentication failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, loginWithGoogle, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Google Authentication
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Processing your login...</Typography>
          </Box>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error.includes('\n') ? (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {error.split('\n').map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              ) : (
                error
              )}
            </Alert>
            <Typography variant="body2">
              Please try logging in again. You will be redirected to the login page shortly.
            </Typography>
            {setTimeout(() => navigate('/login'), 5000)}
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default OAuthCallback;