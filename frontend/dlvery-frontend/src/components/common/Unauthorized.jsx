import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();

  const handleRedirect = () => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else if (hasRole('INVENTORY_TEAM')) {
      navigate('/inventory/products');
    } else if (hasRole('DELIVERY_TEAM')) {
      navigate('/delivery/my-deliveries');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2, color: 'error.main' }}>
        401
      </Typography>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect} size="large">
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;