import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, CircularProgress, Alert,
  TablePagination, Button, Chip, Tooltip, IconButton
} from '@mui/material';
import {
  Visibility as ViewIcon, Refresh as RefreshIcon, CheckCircle as CheckCircleIcon,
  Warning as WarningIcon, AccessTime as ClockIcon, Home as HomeIcon,
  Cancel as CancelIcon, LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import deliveryService from '../../services/deliveryService';

const Deliveries = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMyDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getMyDeliveries();
      setDeliveries(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching my deliveries:', err);
      setError('Failed to fetch your deliveries. Please try again.');
      enqueueSnackbar('Failed to fetch deliveries.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const handleRefresh = () => {
    fetchMyDeliveries();
    enqueueSnackbar('Your deliveries have been refreshed', { variant: 'info' });
  };
  
  const getStatusChip = (status) => {
    const statusMap = {
      DELIVERED: { label: "Delivered", color: "success", icon: <CheckCircleIcon /> },
      PENDING: { label: "Pending", color: "primary", icon: <ClockIcon /> },
      IN_TRANSIT: { label: "In Transit", color: "info", icon: <LocalShippingIcon /> },
      DOOR_LOCK: { label: "Door Lock", color: "warning", icon: <HomeIcon /> },
      DAMAGED: { label: "Damaged", color: "error", icon: <WarningIcon /> },
      RETURNED: { label: "Returned", color: "secondary", icon: <CancelIcon /> },
    };
    const { label, color, icon } = statusMap[status] || { label: status, color: "default" };
    return <Chip label={label} color={color} size="small" icon={icon} />;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDelivery = (deliveryId) => {
    navigate(`/delivery/details/${deliveryId}`);
  };

  const filteredDeliveries = deliveries
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">My Deliveries</Typography>
        <Tooltip title="Refresh Deliveries">
            <IconButton onClick={handleRefresh}>
                <RefreshIcon />
            </IconButton>
        </Tooltip>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Delivery ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Scheduled For</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeliveries.length > 0 ? filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} hover>
                    <TableCell>#{delivery.id.substring(0, 8)}</TableCell>
                    <TableCell>{delivery.customerName}</TableCell>
                    <TableCell>{delivery.deliveryAddress}</TableCell>
                    <TableCell>{new Date(delivery.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">{getStatusChip(delivery.status)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewDelivery(delivery.id)} size="small">
                            <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No deliveries found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={deliveries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default Deliveries;