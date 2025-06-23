import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // In a real application, you would call an API to update the user profile
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        setEditMode(false);
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Alert severity="info">
        Please log in to view your profile.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
          >
            {user.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.fullName}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role === 'INVTEAM' ? 'Inventory Team' : 'Delivery Team'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Formik
          initialValues={{
            username: user.username || '',
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            role: user.role || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="role"
                    label="Role"
                    fullWidth
                    margin="normal"
                    disabled
                    value={user.role === 'INVTEAM' ? 'Inventory Team' : 'Delivery Team'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                    error={editMode && touched.fullName && Boolean(errors.fullName)}
                    helperText={editMode && touched.fullName && errors.fullName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                    error={editMode && touched.email && Boolean(errors.email)}
                    helperText={editMode && touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                    error={editMode && touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={editMode && touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                {!editMode ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;