import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';
import {
    Box, Typography, Card, CardContent, Grid, Chip, Button,
    CircularProgress, Alert, Paper, Avatar, useTheme
} from '@mui/material';
import {
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon,
    AccessTime as ClockIcon,
    Navigation as NavigationIcon,
    PlayCircleFilled as StartIcon,
    Bolt as UrgentIcon,
    Warning as HighIcon,
    AcUnit as PerishableIcon, // Using snowflake for perishable
    Inventory as DeliveriesIcon,
    CheckCircle as CompletedIcon,
    Person as ProfileIcon,
    Home as TodayIcon,
} from '@mui/icons-material';

const DeliveryAgentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();

    const [todayDeliveries, setTodayDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                const response = await deliveryService.getMyTodayDeliveries();
                const deliveriesData = response.data || [];
                // Filter for deliveries that are not yet delivered
                const pendingToday = deliveriesData.filter(d => d.status !== 'DELIVERED' && d.status !== 'RETURNED' && d.status !=='DAMAGED');
                setTodayDeliveries(pendingToday);
            } catch (err) {
                console.error('Error fetching today\'s deliveries:', err);
                setError('Failed to fetch today\'s deliveries.');
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    const priorityCounts = todayDeliveries.reduce((acc, delivery) => {
        const priority = delivery.priority.toUpperCase();
        if (priority === 'URGENT') acc.urgent += 1;
        if (priority === 'HIGH') acc.high += 1;
        if (priority === 'PERISHABLE') acc.perishable += 1;
        return acc;
    }, { urgent: 0, high: 0, perishable: 0 });

    const handleNavigate = (address) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    };

    const handleStartDelivery = async (deliveryId) => {
        try {
            await deliveryService.startDelivery(deliveryId);
            // Navigate to delivery details page after starting
            navigate(`/delivery/details/${deliveryId}`);
        } catch (error) {
            console.error("Failed to start delivery", error);
            setError("Failed to start delivery. Please try again.");
        }
    };

    const PriorityTag = ({ priority }) => {
        const p = priority.toUpperCase();
        let icon, label, color;

        switch (p) {
            case 'URGENT':
                icon = <UrgentIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
                label = 'Urgent';
                color = 'error';
                break;
            case 'HIGH':
                icon = <HighIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
                label = 'High';
                color = 'warning';
                break;
            case 'PERISHABLE':
                icon = <PerishableIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
                label = 'Perishable';
                color = 'info';
                break;
            default:
                return null;
        }

        return (
            <Chip
                icon={icon}
                label={label}
                color={color}
                variant="filled"
                size="small"
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    backgroundColor: `${color}.main`,
                }}
            />
        );
    };

    const SummaryCard = ({ count, label, color }) => (
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                <Box component="span" sx={{ color: `${color}.main`, fontSize: '1.5rem' }}>•</Box> {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Grid>
    );

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 2, pb: 8, backgroundColor: '#f4f6f8' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <div>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Today's Deliveries</Typography>
                    <Typography variant="body1" color="text.secondary">Hello, {user?.name || 'Agent'}</Typography>
                </div>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>{todayDeliveries.length}</Typography>
                    <Typography variant="body2" color="text.secondary">deliveries</Typography>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
                <Grid container spacing={2}>
                    <SummaryCard count={priorityCounts.urgent} label="Urgent" color="error" />
                    <SummaryCard count={priorityCounts.high} label="High" color="warning" />
                    <SummaryCard count={priorityCounts.perishable} label="Perishable" color="info" />
                </Grid>
            </Paper>

            {todayDeliveries.map((delivery) => (
                <Card key={delivery.id} sx={{ mb: 2, borderRadius: '12px', position: 'relative' }}>
                    <CardContent>
                        <PriorityTag priority={delivery.priority} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{delivery.deliveryItems[0]?.product.name || 'Item'} - {delivery.deliveryItems[0]?.product.description || ''}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            SKU: {delivery.deliveryItems[0]?.product.sku || 'N/A'} • Qty: {delivery.deliveryItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon color="action" sx={{ mr: 1.5 }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{delivery.customerName}</Typography>
                                <Typography variant="body2" color="text.secondary">{delivery.deliveryAddress}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon color="action" sx={{ mr: 1.5 }} />
                            <Typography variant="body2" color="primary.main" sx={{fontWeight:'bold'}}>{delivery.customerPhone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ClockIcon color="action" sx={{ mr: 1.5 }} />
                            <Typography variant="body2" color="text.secondary">{delivery.deliveryTimeSlot}</Typography>
                        </Box>

                        {delivery.specialInstructions && (
                             <Box sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 1.5, py: 0.5, backgroundColor: '#eef2f6' }}>
                                <Typography variant="caption" color="text.secondary">Special Instructions:</Typography>
                                <Typography variant="body2">{delivery.specialInstructions}</Typography>
                            </Box>
                        )}

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<NavigationIcon />}
                                    onClick={() => handleNavigate(delivery.deliveryAddress)}
                                >
                                    Navigate
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<StartIcon />}
                                    onClick={() => handleStartDelivery(delivery.id)}
                                >
                                    Start Delivery
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
            
        </Box>
    );
};

export default DeliveryAgentDashboard;