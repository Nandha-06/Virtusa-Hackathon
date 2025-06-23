import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  FormHelperText,
  Grid,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Warning as WarningIcon,
  Delete as ClearIcon
} from '@mui/icons-material';
import SignatureCanvas from 'react-signature-canvas';
import deliveryService from '../../services/deliveryService';

// Component for capturing customer signature
const SignatureCapture = ({ sigPad, onClear }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Customer Signature
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          width: '100%', 
          height: isMobile ? 150 : 200,
          backgroundColor: '#f8f8f8',
          touchAction: 'none' // Prevents scrolling while signing on touch devices
        }}
      >
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            width: '100%',
            height: isMobile ? 150 : 200,
            className: 'signature-canvas'
          }}
          backgroundColor="rgba(0,0,0,0)"
        />
      </Paper>
      <Button 
        startIcon={<ClearIcon />}
        onClick={onClear}
        size="small"
        sx={{ mt: 1 }}
      >
        Clear Signature
      </Button>
    </Box>
  );
};

// Complete Delivery Dialog
const CompleteDeliveryDialog = ({ open, onClose, delivery, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [signatureError, setSignatureError] = useState('');
  
  const sigPad = useRef({});
  
  const clearSignature = () => {
    sigPad.current.clear();
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!customerName.trim()) {
      setNameError('Customer name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (sigPad.current.isEmpty()) {
      setSignatureError('Customer signature is required');
      isValid = false;
    } else {
      setSignatureError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Get signature as base64 image
      const signatureData = sigPad.current.toDataURL('image/png');
      
      // Call API to update delivery status
      await deliveryService.updateDeliveryStatus(delivery.id, {
        status: 'DELIVERED',
        customerName,
        customerSignature: signatureData,
        notes: notes.trim() || undefined,
        deliveredAt: new Date().toISOString()
      });
      
      onSuccess('Delivery marked as complete successfully!');
      onClose();
    } catch (err) {
      console.error('Error completing delivery:', err);
      setError('Failed to update delivery status. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setCustomerName('');
    setNotes('');
    setNameError('');
    setSignatureError('');
    setError('');
    clearSignature();
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : handleClose}
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            Complete Delivery
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="subtitle2" gutterBottom>
          Delivery #{delivery?.id?.substring(0, 8)}
        </Typography>
        
        <TextField
          label="Customer Name"
          fullWidth
          margin="normal"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          disabled={loading}
          required
        />
        
        <TextField
          label="Notes (Optional)"
          fullWidth
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          disabled={loading}
        />
        
        <SignatureCapture 
          sigPad={sigPad} 
          onClear={clearSignature} 
        />
        {signatureError && (
          <FormHelperText error>{signatureError}</FormHelperText>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Submitting...' : 'Complete Delivery'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Door Lock Dialog
const DoorLockDialog = ({ open, onClose, delivery, onSuccess }) => {
  const [notes, setNotes] = useState('');
  const [attemptedTime, setAttemptedTime] = useState(
    new Date().toISOString().substring(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notesError, setNotesError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    if (!notes.trim()) {
      setNotesError('Please provide details about the door lock situation');
      isValid = false;
    } else {
      setNotesError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Call API to update delivery status
      await deliveryService.updateDeliveryStatus(delivery.id, {
        status: 'DOOR_LOCK',
        notes: notes.trim(),
        attemptedAt: new Date(attemptedTime).toISOString()
      });
      
      onSuccess('Door lock status updated successfully!');
      onClose();
    } catch (err) {
      console.error('Error updating door lock status:', err);
      setError('Failed to update delivery status. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setNotes('');
    setAttemptedTime(new Date().toISOString().substring(0, 16));
    setNotesError('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : handleClose}
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <HomeIcon color="warning" sx={{ mr: 1 }} />
            Report Door Lock
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="subtitle2" gutterBottom>
          Delivery #{delivery?.id?.substring(0, 8)}
        </Typography>
        
        <TextField
          label="Attempted Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={attemptedTime}
          onChange={(e) => setAttemptedTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />
        
        <TextField
          label="Details"
          fullWidth
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          placeholder="Provide details about the door lock situation"
          error={!!notesError}
          helperText={notesError}
          disabled={loading}
          required
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <HomeIcon />}
        >
          {loading ? 'Submitting...' : 'Report Door Lock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Damage Report Dialog
const DamageReportDialog = ({ open, onClose, delivery, onSuccess }) => {
  const [notes, setNotes] = useState('');
  const [damagedItems, setDamagedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Initialize damaged/returned items from delivery items
  useState(() => {
    if (delivery && delivery.items) {
      setDamagedItems(delivery.items.map(item => ({
        sku: item.sku,
        damaged: false,
        quantity: 0
      })));
      setReturnedItems(delivery.items.map(item => ({
        sku: item.sku,
        returned: false,
        quantity: 0
      })));
    }
  }, [delivery]);
  
  const handleDamagedChange = (sku, checked) => {
    setDamagedItems(prevItems => 
      prevItems.map(item => 
        item.sku === sku ? { ...item, damaged: checked, quantity: checked ? 1 : 0 } : item
      )
    );
  };
  
  const handleDamagedQuantityChange = (sku, quantity) => {
    setDamagedItems(prevItems => 
      prevItems.map(item => 
        item.sku === sku ? { ...item, quantity: parseInt(quantity) || 0 } : item
      )
    );
  };
  
  const handleReturnedChange = (sku, checked) => {
    setReturnedItems(prevItems => 
      prevItems.map(item => 
        item.sku === sku ? { ...item, returned: checked, quantity: checked ? 1 : 0 } : item
      )
    );
  };
  
  const handleReturnedQuantityChange = (sku, quantity) => {
    setReturnedItems(prevItems => 
      prevItems.map(item => 
        item.sku === sku ? { ...item, quantity: parseInt(quantity) || 0 } : item
      )
    );
  };
  
  const validateForm = () => {
    const hasDamagedItems = damagedItems.some(item => item.damaged && item.quantity > 0);
    const hasReturnedItems = returnedItems.some(item => item.returned && item.quantity > 0);
    
    if (!hasDamagedItems && !hasReturnedItems) {
      setValidationError('Please select at least one damaged or returned item');
      return false;
    }
    
    if (!notes.trim()) {
      setValidationError('Please provide details about the damage or return');
      return false;
    }
    
    setValidationError('');
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare items data
      const itemsData = delivery.items.map(item => {
        const damagedItem = damagedItems.find(di => di.sku === item.sku);
        const returnedItem = returnedItems.find(ri => ri.sku === item.sku);
        
        return {
          sku: item.sku,
          productName: item.productName,
          quantity: item.quantity,
          damaged: damagedItem?.damaged || false,
          damagedQuantity: damagedItem?.damaged ? damagedItem.quantity : 0,
          returned: returnedItem?.returned || false,
          returnedQuantity: returnedItem?.returned ? returnedItem.quantity : 0
        };
      });
      
      // Call API to update delivery status
      await deliveryService.updateDeliveryStatus(delivery.id, {
        status: 'DAMAGED', // or could be 'RETURNED' based on business logic
        notes: notes.trim(),
        items: itemsData
      });
      
      onSuccess('Damage/return report submitted successfully!');
      onClose();
    } catch (err) {
      console.error('Error submitting damage report:', err);
      setError('Failed to update delivery status. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setNotes('');
    setDamagedItems([]);
    setReturnedItems([]);
    setValidationError('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : handleClose}
      fullWidth 
      maxWidth="md"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Damage/Return Report
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {validationError && <Alert severity="warning" sx={{ mb: 2 }}>{validationError}</Alert>}
        
        <Typography variant="subtitle2" gutterBottom>
          Delivery #{delivery?.id?.substring(0, 8)}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Items with Issues
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Total Qty</TableCell>
                  <TableCell align="center">Damaged</TableCell>
                  <TableCell align="center">Damaged Qty</TableCell>
                  <TableCell align="center">Returned</TableCell>
                  <TableCell align="center">Returned Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {delivery?.items?.map((item, index) => {
                  const damagedItem = damagedItems.find(di => di.sku === item.sku) || { damaged: false, quantity: 0 };
                  const returnedItem = returnedItems.find(ri => ri.sku === item.sku) || { returned: false, quantity: 0 };
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        <Checkbox 
                          checked={damagedItem.damaged}
                          onChange={(e) => handleDamagedChange(item.sku, e.target.checked)}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 0, max: item.quantity } }}
                          value={damagedItem.quantity}
                          onChange={(e) => handleDamagedQuantityChange(item.sku, e.target.value)}
                          disabled={!damagedItem.damaged || loading}
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox 
                          checked={returnedItem.returned}
                          onChange={(e) => handleReturnedChange(item.sku, e.target.checked)}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{ inputProps: { min: 0, max: item.quantity } }}
                          value={returnedItem.quantity}
                          onChange={(e) => handleReturnedQuantityChange(item.sku, e.target.value)}
                          disabled={!returnedItem.returned || loading}
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <TextField
          label="Issue Details"
          fullWidth
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          placeholder="Provide details about the damage or return reason"
          disabled={loading}
          required
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <WarningIcon />}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component that exports all dialogs
const DeliveryStatusUpdate = {
  CompleteDeliveryDialog,
  DoorLockDialog,
  DamageReportDialog
};

export default DeliveryStatusUpdate;