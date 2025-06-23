import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Typography, Container, Paper, CircularProgress, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const OAuthLogin = () => {
  const { loginWithGoogle, loading, error } = useAuth();
  const navigate = useNavigate();

  // Handle the OAuth redirect callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          await loginWithGoogle(code);
          navigate('/');
        } catch (err) {
          console.error('OAuth callback error:', err);
        }
      }
    };

    handleOAuthCallback();
  }, [loginWithGoogle, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth authorization URL
    // This URL would typically be provided by your backend
    window.location.href = 'http://localhost:8080/api/auth/oauth2/google';
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          DlVery - Delivery Team Login
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{ 
            mt: 2, 
            mb: 2,
            backgroundColor: '#4285F4',
            '&:hover': {
              backgroundColor: '#357ae8',
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
        </Button>

        <Divider sx={{ width: '100%', my: 2 }} />
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            Delivery Team members must use Google Sign-In
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OAuthLogin;