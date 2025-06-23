import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import ProductForm from './ProductForm'; // Import ProductForm
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false); // State for new product dialog
  const [editingProductId, setEditingProductId] = useState(null); // State for product being edited
  const { enqueueSnackbar } = useSnackbar();

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    perishable: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, activeTab, newProductDialogOpen]); // Add newProductDialogOpen to dependencies

  const getCategoryName = (tabIndex) => {
    switch (tabIndex) {
      case 1: return 'ELECTRONICS';
      case 2: return 'CLOTHING';
      case 3: return 'FOOD';
      case 4: return 'MEDICINE';
      case 5: return 'FURNITURE';
      case 6: return 'TOYS';
      case 7: return 'BOOKS';
      case 8: return 'ESSENTIAL';
      case 9: return 'EMERGENCY';
      case 10: return 'OTHER';
      default: return '';
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getAllProducts();
      const productData = response.data || [];
      setProducts(productData);
      
      // Calculate stats
      const lowStockCount = productData.filter(p => p.quantity < 5).length;
      const perishableCount = productData.filter(p => p.perishable).length;
      
      setStats({
        totalProducts: productData.length,
        lowStock: lowStockCount,
        perishable: perishableCount
      });
    } catch (err) {
      setError(`Failed to load products: ${err.message || 'Unknown error'}. Please try again.`);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset page to 0 when tab changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    setNewProductDialogOpen(true);
  };

  const handleNewProductDialogClose = () => {
    setNewProductDialogOpen(false);
    setEditingProductId(null); // Reset editingProductId when dialog closes
  };

  const handleProductFormSuccess = () => {
    setNewProductDialogOpen(false);
    fetchProducts(); // Refresh products after successful add/edit
    enqueueSnackbar('Product saved successfully!', { variant: 'success' });
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setNewProductDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.id);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        fetchProducts(); // Refresh the product list
        enqueueSnackbar('Product deleted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting product:', error);
        enqueueSnackbar('Failed to delete product.', { variant: 'error' });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 0 ? true : product.category === getCategoryName(activeTab);

    return matchesSearch && matchesTab;
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 6, 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #e6f2ff)'
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            background: 'linear-gradient(to right, #1976d2, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >


          Inventory Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your product inventory efficiently.
        </Typography>
      </Box>

      {/* Inventory Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: '12px', background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <InventoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Products</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{stats.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: '12px', background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Low Stock</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{stats.lowStock}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: '12px', background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TimeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Perishable Items</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{stats.perishable}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            Add New Product
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product categories tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="All Products" value={0} />
          <Tab label="Electronics" value={1} />
          <Tab label="Clothing" value={2} />
          <Tab label="Food" value={3} />
          <Tab label="Medicine" value={4} />
          <Tab label="Furniture" value={5} />
          <Tab label="Toys" value={6} />
          <Tab label="Books" value={7} />
          <Tab label="Essential" value={8} />
          <Tab label="Emergency" value={9} />
          <Tab label="Other" value={10} />
        </Tabs>

        <TableContainer component={Paper} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Table aria-label="products table">
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.damaged ? (
                        <Chip
                          icon={<WarningIcon fontSize="small" />}
                          label="Damaged"
                          color="error"
                          size="small"
                          sx={{ '& .MuiChip-icon': { fontSize: '16px' } }}
                        />
                      ) : product.quantity < 5 ? (
                        <Chip
                          icon={<WarningIcon fontSize="small" />}
                          label="Low Stock"
                          color="warning"
                          size="small"
                          sx={{ '& .MuiChip-icon': { fontSize: '16px' } }}
                        />
                      ) : (
                        <Chip label="In Stock" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditProduct(product.id)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(product)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      No products found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete product "{productToDelete?.name}" (SKU: {productToDelete?.sku})?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Product Dialog */}
      <Dialog open={newProductDialogOpen} onClose={handleNewProductDialogClose} fullWidth maxWidth="md">
        <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <ProductForm
            productId={editingProductId} // Pass productId for editing
            onSuccess={handleProductFormSuccess}
            onCancel={handleNewProductDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;