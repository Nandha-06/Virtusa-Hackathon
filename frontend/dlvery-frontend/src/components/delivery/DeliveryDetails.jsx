import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import deliveryService from '../../services/deliveryService';
import DeliveryStatusUpdate from './DeliveryStatusUpdate';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as DeliveryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as ClockIcon,
  Home as HomeIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
  CheckCircle as CheckCircleIconMUI,
  DoNotDisturb,
  Dangerous
} from '@mui/icons-material';

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [doorLockDialogOpen, setDoorLockDialogOpen] = useState(false);
  const [damageDialogOpen, setDamageDialogOpen] = useState(false);

  useEffect(() => {
    fetchDeliveryDetails();
  }, [id, location.key]); // location.key changes when navigating back to this page

  const fetchDeliveryDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await deliveryService.getDeliveryById(id);
      setDelivery(response.data);
    } catch (err) {
      console.error('Error fetching delivery details:', err);
      setError('Failed to fetch delivery details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusUpdateSuccess = (message) => {
    enqueueSnackbar(message, { variant: 'success' });
    fetchDeliveryDetails(); // Refresh details
    setCompleteDialogOpen(false);
    setDoorLockDialogOpen(false);
    setDamageDialogOpen(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <Chip label="Delivered" color="success" icon={<CheckCircleIconMUI />} />;
      case 'PENDING':
        return <Chip label="Pending" color="primary" icon={<ClockIcon />} />;
      case 'IN_TRANSIT':
        return <Chip label="In Transit" color="info" icon={<DeliveryIcon />} />;
      case 'DOOR_LOCK':
        return <Chip label="Door Lock" color="warning" icon={<HomeIcon />} />;
      case 'DAMAGED':
        return <Chip label="Damaged" color="error" icon={<WarningIcon />} />;
      case 'RETURNED':
        return <Chip label="Returned" color="secondary" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const getPriorityChip = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <Chip label="Urgent" color="error" variant="outlined" />;
      case 'HIGH':
        return <Chip label="High" color="warning" variant="outlined" />;
      case 'PERISHABLE':
        return <Chip label="Perishable" color="secondary" variant="outlined" />;
      case 'NORMAL':
        return <Chip label="Normal" color="primary" variant="outlined" />;
      case 'LOW':
        return <Chip label="Low" color="info" variant="outlined" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!delivery) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="warning">Delivery not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const isActionable = delivery.status === 'IN_TRANSIT' || delivery.status === 'PENDING';

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Delivery Details
        </Typography>
      </Box>

      {isActionable && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight:'bold' }}>Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="contained" color="success" startIcon={<CheckCircleIconMUI />} onClick={() => setCompleteDialogOpen(true)}>
                Complete Delivery
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="outlined" color="warning" startIcon={<DoNotDisturb />} onClick={() => setDoorLockDialogOpen(true)}>
                Report Door Lock
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="outlined" color="error" startIcon={<Dangerous />} onClick={() => setDamageDialogOpen(true)}>
                Report Damage
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="h6">
            Delivery #{delivery.id.substring(0, 8)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getStatusChip(delivery.status)}
            {getPriorityChip(delivery.priority)}
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Customer:</strong> {delivery.customerName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <LocationIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body1">
                <strong>Address:</strong> {delivery.customerAddress}
              </Typography>
            </Box>
            {delivery.customerPhone && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Phone:</strong> {delivery.customerPhone}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Scheduled Date:</strong> {new Date(delivery.scheduledDate).toLocaleDateString()}
              </Typography>
            </Box>
            {delivery.deliveredAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  <strong>Delivered At:</strong> {new Date(delivery.deliveredAt).toLocaleString()}
                </Typography>
              </Box>
            )}
            {delivery.notes && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <NotesIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body1">
                  <strong>Notes:</strong> {delivery.notes}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Items
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {delivery.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="center">
                    {item.damaged && <Chip size="small" label="Damaged" color="error" />}
                    {item.returned && <Chip size="small" label="Returned" color="secondary" />}
                    {!item.damaged && !item.returned && <Chip size="small" label="OK" color="success" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {delivery.customerSignature && (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Customer Signature
            </Typography>
            <Box 
              component="img" 
              src={delivery.customerSignature} 
              alt="Customer Signature" 
              sx={{ 
                maxWidth: '100%', 
                height: 'auto', 
                border: '1px solid #ddd', 
                borderRadius: 1,
                p: 1
              }} 
            />
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Deliveries
        </Button>
      </Box>

      <DeliveryStatusUpdate.CompleteDeliveryDialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        delivery={delivery}
        onSuccess={handleStatusUpdateSuccess}
      />
      <DeliveryStatusUpdate.DoorLockDialog
        open={doorLockDialogOpen}
        onClose={() => setDoorLockDialogOpen(false)}
        delivery={delivery}
        onSuccess={handleStatusUpdateSuccess}
      />
      <DeliveryStatusUpdate.DamageReportDialog
        open={damageDialogOpen}
        onClose={() => setDamageDialogOpen(false)}
        delivery={delivery}
        onSuccess={handleStatusUpdateSuccess}
      />
    </Box>
  );
};

export default DeliveryDetails;