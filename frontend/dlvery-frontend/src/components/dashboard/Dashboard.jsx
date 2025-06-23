"use client"

import { useState, useEffect } from "react"
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Divider, 
  Alert,
  CardHeader as MuiCardHeader,
  Chip as MuiBadge
} from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Activity,
} from "lucide-react"

/**
 * @typedef {Object} Delivery
 * @property {string} id
 * @property {('DELIVERED'|'PENDING'|'IN_TRANSIT'|'DOOR_LOCK'|'RETURNED'|'DAMAGED')} status
 * @property {string} customerName
 * @property {string} scheduledDate
 * @property {string} [address]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {boolean} damaged
 */

// Custom UI components to replace shadcn components
const CardHeader = ({ children }) => (
  <Box sx={{ p: 2, pb: 0 }}>{children}</Box>
)

const CardTitle = ({ children, className }) => (
  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{children}</Typography>
)

const CardDescription = ({ children, className }) => (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{children}</Typography>
)

const Badge = ({ children, className }) => {
  // Use the color directly if provided in className
  let color = 'default'
  if (className) {
    if (className.includes('success')) color = 'success'
    else if (className.includes('warning')) color = 'warning'
    else if (className.includes('info')) color = 'info'
    else if (className.includes('error')) color = 'error'
  }
  
  return (
    <MuiBadge 
      label={children} 
      size="small" 
      color={color}
      variant="outlined" 
    />
  )
}

const Separator = () => <Divider sx={{ my: 2 }} />

export default function Dashboard() {
  const { user, isInventoryTeam, isDeliveryTeam } = useAuth()

  const [deliveries, setDeliveries] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("deliveries") // Track active tab: deliveries or agents
  
  // Mock agents data
  const [agents, setAgents] = useState([
    {
      id: "1",
      name: "Amit Singh",
      phone: "+91 9876543211",
      vehicle: "KA-01-AB-1234",
      currentDeliveries: 3,
      completedDeliveries: 245,
      rating: 4.8,
      status: "active"
    },
    {
      id: "2",
      name: "Suresh Kumar",
      phone: "+91 9876543212",
      vehicle: "KA-01-CD-5678",
      currentDeliveries: 2,
      completedDeliveries: 189,
      rating: 4.6,
      status: "active"
    }
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        // Mock data - replace with actual API calls
        setTimeout(() => {
          setDeliveries([
            {
              id: "1",
              status: "DELIVERED",
              customerName: "Alice Johnson",
              scheduledDate: "2024-01-15",
              address: "123 Main St",
            },
            {
              id: "2",
              status: "PENDING",
              customerName: "Bob Smith",
              scheduledDate: "2024-01-16",
              address: "456 Oak Ave",
            },
            {
              id: "3",
              status: "IN_TRANSIT",
              customerName: "Carol Davis",
              scheduledDate: "2024-01-16",
              address: "789 Pine Rd",
            },
            {
              id: "4",
              status: "DOOR_LOCK",
              customerName: "David Wilson",
              scheduledDate: "2024-01-14",
              address: "321 Elm St",
            },
            {
              id: "5",
              status: "DELIVERED",
              customerName: "Eva Brown",
              scheduledDate: "2024-01-15",
              address: "654 Maple Dr",
            },
          ])

          setProducts([
            { id: "1", name: "Product A", quantity: 15, damaged: false },
            { id: "2", name: "Product B", quantity: 3, damaged: false },
            { id: "3", name: "Product C", quantity: 8, damaged: true },
            { id: "4", name: "Product D", quantity: 25, damaged: false },
          ])

          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.")
        console.error("Dashboard error:", err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getDeliveryStats = () => {
    if (!deliveries.length) return { pending: 0, completed: 0, issues: 0 }

    return deliveries.reduce(
      (stats, delivery) => {
        if (delivery.status === "DELIVERED") {
          stats.completed += 1
        } else if (delivery.status === "PENDING" || delivery.status === "IN_TRANSIT") {
          stats.pending += 1
        } else {
          stats.issues += 1
        }
        return stats
      },
      { pending: 0, completed: 0, issues: 0 },
    )
  }

  const getProductStats = () => {
    if (!products.length) return { total: 0, lowStock: 0, damaged: 0 }

    return products.reduce(
      (stats, product) => {
        stats.total += 1
        if (product.quantity < 5) {
          stats.lowStock += 1
        }
        if (product.damaged) {
          stats.damaged += 1
        }
        return stats
      },
      { total: 0, lowStock: 0, damaged: 0 },
    )
  }

  const deliveryStats = getDeliveryStats()
  const productStats = getProductStats()

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "success"
      case "PENDING":
        return "warning"
      case "IN_TRANSIT":
        return "info"
      default:
        return "error"
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Activity className="animate-spin" style={{ color: '#1976d2', height: 24, width: 24 }} />
          <Typography variant="h6" color="text.secondary">Loading dashboard...</Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle style={{ height: 16, width: 16 }} />
          <Typography>{error}</Typography>
        </Box>
      </Alert>
    )
  }

  return (
    <Box sx={{ 
      p: 6, 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #e6f2ff)'
    }}>
      {/* Header Section */}
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
          Welcome back, {user?.fullName}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users style={{ height: 20, width: 20, color: '#64748b' }} />
          <Typography variant="h6" color="text.secondary">
            {isInventoryTeam() ? "Inventory Team Dashboard" : "Delivery Team Dashboard"}
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        {/* Total Deliveries */}
        <Card sx={{ 
          background: 'linear-gradient(to bottom right, #2196f3, #1976d2)',
          color: 'white',
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Total Deliveries</Typography>
              <Truck style={{ height: 20, width: 20, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">{deliveries.length}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp style={{ height: 12, width: 12, marginRight: 4 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Active shipments</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Completed Deliveries */}
        <Card sx={{ 
          background: 'linear-gradient(to bottom right, #4caf50, #388e3c)',
          color: 'white',
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Completed</Typography>
              <CheckCircle style={{ height: 20, width: 20, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">{deliveryStats.completed}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 1, display: 'block' }}>Successfully delivered</Typography>
          </CardContent>
        </Card>

        {/* Pending Deliveries */}
        <Card sx={{ 
          background: 'linear-gradient(to bottom right, #ff9800, #f57c00)',
          color: 'white',
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Pending</Typography>
              <Clock style={{ height: 20, width: 20, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">{deliveryStats.pending}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 1, display: 'block' }}>Awaiting delivery</Typography>
          </CardContent>
        </Card>

        {/* Issues */}
        <Card sx={{ 
          background: 'linear-gradient(to bottom right, #f44336, #d32f2f)',
          color: 'white',
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Issues</Typography>
              <AlertTriangle style={{ height: 20, width: 20, opacity: 0.9 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">{deliveryStats.issues}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 1, display: 'block' }}>Require attention</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Delivery Tracking Section */}
      <Card sx={{ 
        mb: 4, 
        boxShadow: 3, 
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white'
      }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(to right, #1976d2, #2196f3)',
          color: 'white'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Delivery Tracking
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Monitor deliveries and agents
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: '#f5f5f5'
          }}>
            <Box component="span" sx={{ display: 'flex', mr: 1, color: 'text.secondary' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Search deliveries or agents...
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box 
            onClick={() => setActiveTab("deliveries")}
            sx={{ 
              flex: 1, 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: activeTab === "deliveries" ? '#1976d2' : 'white', 
              color: activeTab === "deliveries" ? 'white' : 'text.primary',
              fontWeight: activeTab === "deliveries" ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: activeTab === "deliveries" ? '#1976d2' : '#f5f5f5' }
            }}
          >
            <Box component="span" sx={{ display: 'flex', mr: 1 }}>
              <Package style={{ width: 18, height: 18 }} />
            </Box>
            <Typography variant="body1">Deliveries</Typography>
          </Box>
          <Box 
            onClick={() => setActiveTab("agents")}
            sx={{ 
              flex: 1, 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: activeTab === "agents" ? '#1976d2' : 'white', 
              color: activeTab === "agents" ? 'white' : 'text.primary',
              fontWeight: activeTab === "agents" ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: activeTab === "agents" ? '#1976d2' : '#f5f5f5' }
            }}
          >
            <Box component="span" sx={{ display: 'flex', mr: 1 }}>
              <Users style={{ width: 18, height: 18 }} />
            </Box>
            <Typography variant="body1">Agents</Typography>
          </Box>
        </Box>

        {/* Deliveries Content */}
        {activeTab === "deliveries" && (
          <Box sx={{ p: 0 }}>
            {deliveries.slice(0, 2).map((delivery, index) => (
              <Box key={delivery.id} sx={{ 
                p: 3, 
                borderBottom: index < deliveries.length - 1 ? '1px solid' : 'none', 
                borderColor: 'divider',
                '&:hover': { bgcolor: '#f5f7fa' }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 1 }}>
                        Delivery #{delivery.id}
                      </Typography>
                      <Box sx={{ 
                        display: 'inline-block', 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: 4, 
                        fontSize: '0.75rem',
                        bgcolor: delivery.status === 'IN_TRANSIT' ? '#e3f2fd' : '#fff8e1',
                        color: delivery.status === 'IN_TRANSIT' ? '#1976d2' : '#f57c00',
                        fontWeight: 'medium'
                      }}>
                        {delivery.status === 'IN_TRANSIT' ? 'In Transit' : 'Pending'}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Box component="span" sx={{ display: 'flex', mr: 0.5 }}>
                        <Users style={{ width: 14, height: 14 }} />
                      </Box>
                      Agent: {delivery.customerName.split(' ')[0]}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ display: 'flex', mr: 0.5, color: 'text.secondary' }}>
                          <Package style={{ width: 14, height: 14 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {index === 0 ? 'ELC001' : 'FOD001'} | Qty: {index === 0 ? '1' : '3'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {delivery.scheduledDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Agents Content */}
        {activeTab === "agents" && (
          <Box sx={{ p: 0 }}>
            {agents.map((agent, index) => (
              <Box key={agent.id} sx={{ 
                p: 3, 
                borderBottom: index < agents.length - 1 ? '1px solid' : 'none', 
                borderColor: 'divider',
                '&:hover': { bgcolor: '#f5f7fa' }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {agent.name}
                    </Typography>
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 4, 
                      fontSize: '0.75rem',
                      bgcolor: '#e8f5e9',
                      color: '#2e7d32',
                      fontWeight: 'medium'
                    }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#2e7d32', 
                        mr: 0.8 
                      }} />
                      Active
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {agent.phone}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    Vehicle: {agent.vehicle}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">{agent.currentDeliveries}</Typography>
                      <Typography variant="body2" color="text.secondary">Current</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">{agent.completedDeliveries}</Typography>
                      <Typography variant="body2" color="text.secondary">Completed</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">{agent.rating}</Typography>
                      <Typography variant="body2" color="text.secondary">Rating</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deliveries */}
        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
              Recent Deliveries
            </CardTitle>
            <CardDescription>Latest delivery updates and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deliveries.slice(0, 5).map((delivery, index) => (
              <div key={delivery.id} className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Delivery #{delivery.id.substring(0, 8)}</span>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {delivery.customerName}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {delivery.address}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {delivery.scheduledDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {index < 4 && <Separator />}
              </div>
            ))}
            {deliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No deliveries found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Stats (if inventory team) */}
        {isInventoryTeam() && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5 text-purple-600" />
                Inventory Overview
              </CardTitle>
              <CardDescription>Product stock and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Total Products</p>
                    <p className="text-2xl font-bold text-purple-700">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-700">{productStats.lowStock}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div>
                    <p className="text-sm font-medium text-red-900">Damaged</p>
                    <p className="text-2xl font-bold text-red-700">{productStats.damaged}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl">
            {isInventoryTeam() ? "Inventory Management Hub" : "Delivery Management Hub"}
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Access all system features through the navigation menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-indigo-100">
            <Activity className="h-4 w-4" />
            <span className="text-sm">System is running smoothly</span>
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}
