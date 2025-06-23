import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';
import productService from '../../services/productService';

// Product categories from backend enum
const PRODUCT_CATEGORIES = [
  'ELECTRONICS',
  'CLOTHING',
  'FOOD',
  'MEDICINE',
  'FURNITURE',
  'TOYS',
  'BOOKS',
  'ESSENTIAL',
  'EMERGENCY',
  'OTHER'
];

// Validation schema
const ProductSchema = Yup.object().shape({
  sku: Yup.string()
    .required('SKU is required')
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU must be at most 20 characters'),
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(PRODUCT_CATEGORIES, 'Invalid category'),
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  damaged: Yup.boolean(),
  perishable: Yup.boolean(),
  expiryDate: Yup.date()
    .nullable()
    .when('perishable', {
      is: true,
      then: Yup.date().required('Expiry date is required for perishable items').min(new Date(), 'Expiry date must be in the future')
    })
});

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    quantity: 0,
    damaged: false,
    perishable: false,
    expiryDate: null
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getProductById(id);
      const product = response.data;
      
      setInitialValues({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        quantity: product.quantity || 0,
        damaged: product.damaged || false,
        perishable: product.perishable || false,
        expiryDate: product.expiryDate ? parseISO(product.expiryDate) : null
      });
    } catch (err) {
      setError('Failed to load product. Please try again.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Format the date for API
      const formattedValues = {
        ...values,
        expiryDate: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : null
      };
      
      if (isEditMode) {
        await productService.updateProduct(id, formattedValues);
      } else {
        await productService.createProduct(formattedValues);
      }
      
      navigate('/inventory/products');
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="sku"
                    name="sku"
                    label="SKU"
                    value={values.sku}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sku && Boolean(errors.sku)}
                    helperText={touched.sku && errors.sku}
                    disabled={isEditMode} // SKU cannot be changed in edit mode
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Product Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={touched.category && Boolean(errors.category)}
                    margin="normal"
                  >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Category"
                    >
                      {PRODUCT_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0) + category.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="damaged"
                        name="damaged"
                        checked={values.damaged}
                        onChange={handleChange}
                      />
                    }
                    label="Damaged"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="perishable"
                        name="perishable"
                        checked={values.perishable}
                        onChange={handleChange}
                      />
                    }
                    label="Perishable"
                  />
                </Grid>
                
                {values.perishable && (
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Expiry Date"
                        value={values.expiryDate}
                        onChange={(date) => setFieldValue('expiryDate', date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                            error: touched.expiryDate && Boolean(errors.expiryDate),
                            helperText: touched.expiryDate && errors.expiryDate
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ mr: 2 }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : isEditMode ? (
                      'Update Product'
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/inventory/products')}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ProductForm;