import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for Inventory Team, 1 for Delivery Team
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      await login(values.username, values.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
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
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: '999923647040-hpg58sv3b6jaoqeanm5imf0eq7ntu3sb.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:5173/oauth/callback/google',
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent',
    });
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
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
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          DlVery - Login
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ width: '100%', mb: 3 }}
        >
          <Tab label="Inventory Team" />
          <Tab label="Delivery Team" />
        </Tabs>
        
        {error && (
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
        )}
        
        {tabValue === 0 ? (
          // Inventory Team Login Form
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form style={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                  Inventory Team Login
                </Typography>
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      Register
                    </Link>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          // Delivery Team Login (OAuth)
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Delivery Team Login
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{ 
                mb: 2,
                backgroundColor: '#4285F4',
                '&:hover': {
                  backgroundColor: '#357ae8',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
            </Button>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Delivery Team members must use Google Sign-In
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;