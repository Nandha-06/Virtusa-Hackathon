import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
  Link,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  DeliveryDining as DeliveryDiningIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    deliveriesCompleted: 1247,
    pendingDeliveries: 156,
    damagedGoods: 23,
    successRate: 94.8,
  });
  const [dailyReports, setDailyReports] = useState([
    { date: '1/20/2024', delivered: 45, damaged: 2, pending: 12 },
    { date: '1/19/2024', delivered: 52, damaged: 1, pending: 8 },
    { date: '1/18/2024', delivered: 38, damaged: 3, pending: 15 },
  ]);
  const [agentPerformance, setAgentPerformance] = useState([
    { name: 'Amit Singh', completed: 67, pending: 8, successRate: 84 },
    { name: 'Suresh Kumar', completed: 52, pending: 12, successRate: 87 },
    { name: 'Rajesh Patel', completed: 74, pending: 6, successRate: 90 },
  ]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, you would fetch data from your backend here
        // const response = await api.get('/reports');
        // setStats(response.data.stats);
        // setDailyReports(response.data.dailyReports);
        // setAgentPerformance(response.data.agentPerformance);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      } catch (err) {
        setError('Failed to fetch reports. Please try again.');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>Loading Reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Reports & Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Delivery performance insights
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="This week" />
        <Tab label="This month" />
        <Tab label="This quarter" />
      </Tabs>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Deliveries Completed</Typography>
                <DeliveryDiningIcon color="primary" />
              </Box>
              <Typography variant="h5" fontWeight="bold">{stats.deliveriesCompleted}</Typography>
              <Typography variant="caption" color="text.secondary">This week</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Deliveries</Typography>
                <WarningIcon color="warning" />
              </Box>
              <Typography variant="h5" fontWeight="bold">{stats.pendingDeliveries}</Typography>
              <Typography variant="caption" color="text.secondary">Current</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Damaged Goods</Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h5" fontWeight="bold">{stats.damagedGoods}</Typography>
              <Typography variant="caption" color="text.secondary">This week</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Success Rate</Typography>
                <CheckCircleIcon color="success" />
              </Box>
              <Typography variant="h5" fontWeight="bold">{stats.successRate}%</Typography>
              <Typography variant="caption" color="text.secondary">This month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
        <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Daily Delivery Reports
      </Typography>
      <Paper sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Delivered</TableCell>
                <TableCell>Damaged</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.delivered}</TableCell>
                  <TableCell>{report.damaged}</TableCell>
                  <TableCell>{report.pending}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Agent Performance
      </Typography>
      <Paper sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Agent Name</TableCell>
                <TableCell>Completed Deliveries</TableCell>
                <TableCell>Pending Deliveries</TableCell>
                <TableCell>Success Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentPerformance.map((agent, index) => (
                <TableRow key={index}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.completed}</TableCell>
                  <TableCell>{agent.pending}</TableCell>
                  <TableCell>
                    <LinearProgress variant="determinate" value={agent.successRate} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{agent.successRate}%</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
        <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Export Reports
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
            <PictureAsPdfIcon sx={{ mr: 1 }} /> Export Delivery Report (PDF)
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1 }} /> Export Inventory Report (Excel)
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;