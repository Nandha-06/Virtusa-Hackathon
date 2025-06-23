import React, { useState, useEffect } from 'react';
import deliveryService from '../../services/deliveryService';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Paper,
    Chip,
    Divider,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const CompletedDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompletedDeliveries = async () => {
            try {
                setLoading(true);
                const response = await deliveryService.getMyDeliveries();
                const completed = response.data.filter(
                    (d) => d.status === 'DELIVERED'
                );
                setDeliveries(completed);
            } catch (err) {
                console.error('Error fetching completed deliveries:', err);
                setError('Failed to fetch completed deliveries.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedDeliveries();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Completed Deliveries
            </Typography>
            {deliveries.length === 0 ? (
                <Alert severity="info">You have no completed deliveries.</Alert>
            ) : (
                <List>
                    {deliveries.map((delivery) => (
                        <Paper key={delivery.id} sx={{ mb: 2, p: 2, borderRadius: '8px' }}>
                            <ListItem>
                                <ListItemText
                                    primary={`Delivery to ${delivery.customerName}`}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {delivery.deliveryAddress}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="caption" color="text.secondary">
                                                {`Completed on: ${new Date(delivery.deliveryDate).toLocaleDateString()}`}
                                            </Typography>
                                        </>
                                    }
                                />
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Delivered"
                                    color="success"
                                    size="small"
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default CompletedDeliveries; 