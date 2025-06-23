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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  fullName: Yup.string()
    .required('Full name is required'),
  role: Yup.string()
    .required('Role is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, 'Phone number must be valid')
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      await register(values);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      // Handle different types of error responses
      if (err.errors && Array.isArray(err.errors)) {
        // If the backend returns a list of validation errors
        setError(err.errors.map(e => e.message || e).join('\n'));
      } else if (err.message) {
        // If there's a specific error message
        setError(err.message);
      } else if (typeof err === 'string') {
        // If the error is a string
        setError(err);
      } else {
        // Default error message
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
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
        <Typography component="h1" variant="h5">
          DlVery - Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
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
        
        <Formik
          initialValues={{
            username: '',
            password: '',
            email: '',
            fullName: '',
            role: '',
            phoneNumber: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange }) => (
            <Form style={{ width: '100%', marginTop: '1rem' }}>
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
                autoComplete="new-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                error={touched.fullName && Boolean(errors.fullName)}
                helperText={touched.fullName && errors.fullName}
              />
              
              <FormControl 
                fullWidth 
                margin="normal"
                error={touched.role && Boolean(errors.role)}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={values.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="INVTEAM">Inventory Team</MenuItem>
                  <MenuItem value="DLTEAM">Delivery Team</MenuItem>
                </Select>
                {touched.role && errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>
              
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Register;