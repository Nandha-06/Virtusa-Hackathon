import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
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
      <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect} size="large">
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;