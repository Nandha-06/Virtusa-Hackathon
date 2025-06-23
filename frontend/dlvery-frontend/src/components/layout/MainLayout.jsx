import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isInventoryTeam, isDeliveryTeam } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getRouteIndex = (pathname) => {
    if (pathname.startsWith('/delivery-agent/dashboard')) return 0;
    if (pathname.startsWith('/delivery/my-deliveries')) return 1;
    if (pathname.startsWith('/deliveries/completed')) return 2;
    if (pathname.startsWith('/profile')) return 3;
    return 0;
  };

  const [bottomNavValue, setBottomNavValue] = useState(getRouteIndex(location.pathname));

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/delivery-agent/dashboard');
        break;
      case 1:
        navigate('/delivery/my-deliveries');
        break;
      case 2:
        navigate('/deliveries/completed');
        break;
      case 3:
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const getMenuItems = () => {
    const commonItems = [{
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/'
      },
      {
        text: 'Reports',
        icon: <AssignmentIcon />,
        path: '/reports'
      }
    ];

    const inventoryTeamItems = [
      {
        text: 'Manage Deliveries',
        icon: <DeliveryIcon />,
        path: '/inventory/deliveries'
      },
      {
        text: 'Inventory Dashboard',
        icon: <InventoryIcon />,
        path: '/inventory'
      },
      {
        text: 'Transactions',
        icon: <AssignmentIcon />,
        path: '/inventory/transactions'
      }
    ];

    const deliveryTeamItems = [
      {
        text: 'My Deliveries',
        icon: <DeliveryIcon />,
        path: '/delivery/my-deliveries'
      },
      {
        text: 'Today\'s Deliveries',
        icon: <AssignmentIcon />,
        path: '/delivery/today'
      },
      {
        text: 'Pending Deliveries',
        icon: <AssignmentIcon />,
        path: '/delivery/pending'
      }
    ];

    if (isInventoryTeam()) {
      return [...commonItems, ...inventoryTeamItems];
    } else if (isDeliveryTeam()) {
      // For delivery team, we use bottom nav on mobile, so side nav can be different or empty
      return [
        { text: 'Dashboard', icon: <HomeIcon />, path: '/delivery-agent/dashboard' },
        { text: 'All Deliveries', icon: <DeliveryIcon />, path: '/delivery/my-deliveries' },
        { text: 'Completed', icon: <CheckCircleIcon />, path: '/deliveries/completed' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' }
      ];
    }

    return commonItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          DlVery
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
  
  const isDeliveryAgentDashboard = isDeliveryTeam() && location.pathname.includes('/delivery-agent/dashboard');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { xs: isDeliveryAgentDashboard ? 'none' : 'block', sm: 'block' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {isInventoryTeam() ? 'Inventory Management' : 'Delivery Management'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.fullName}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, pb: { xs: 7, sm: 3 } }}
      >
        <Toolbar sx={{ display: { xs: isDeliveryAgentDashboard ? 'none' : 'block', sm: 'block' } }} />
        <Outlet />
      </Box>

      {isDeliveryTeam() && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', sm: 'none' } }} elevation={3}>
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={handleBottomNavChange}
          >
            <BottomNavigationAction label="Today" icon={<HomeIcon />} />
            <BottomNavigationAction label="Deliveries" icon={<DeliveryIcon />} />
            <BottomNavigationAction label="Completed" icon={<CheckCircleIcon />} />
            <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default MainLayout;