import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllOrdersForCustomers,
  fetchOrderMonthlyStatsForCustomers,
  searchOrdersByCustomer,
} from '../api/customerService'

// ── same buildCustomers logic from old hook
const buildCustomers = (orders) => {
  const map = {}
  orders.forEach((order) => {
    const name = order.customerName
    if (!map[name]) {
      map[name] = {
        customerName: name, totalOrders: 0, completedOrders: 0,
        pendingOrders: 0, cancelledOrders: 0, totalRevenue: 0,
        totalPaid: 0, totalPending: 0, totalQuantityKG: 0,
        lastOrderDate: null, orders: [], hasOutstanding: false,
      }
    }
    const c = map[name]
    c.totalOrders     += 1
    c.totalRevenue    += order.totalPayment   || 0
    c.totalPaid       += order.paymentPaid    || 0
    c.totalPending    += order.paymentPending || 0
    c.totalQuantityKG += order.quantityKG     || 0
    c.orders.push(order)
    if (order.status === 'Completed') c.completedOrders += 1
    if (order.status === 'Pending')   c.pendingOrders   += 1
    if (order.status === 'Cancelled') c.cancelledOrders += 1
    const d = new Date(order.createdAt)
    if (!c.lastOrderDate || d > new Date(c.lastOrderDate)) c.lastOrderDate = order.createdAt
    if (order.paymentPending > 0 && order.status !== 'Cancelled') c.hasOutstanding = true
  })
  return Object.values(map).sort((a, b) => b.totalRevenue - a.totalRevenue)
}
// ── Thunks 
export const loadCustomers = createAsyncThunk(
  'customer/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const [ordersRes, statsRes] = await Promise.allSettled([
        fetchAllOrdersForCustomers(),
        fetchOrderMonthlyStatsForCustomers(),
      ])
      return {
        customers:    ordersRes.status === 'fulfilled' && ordersRes.value.success
                        ? buildCustomers(ordersRes.value.data || []) : [],
        monthlyStats: statsRes.status  === 'fulfilled' && statsRes.value.success
                        ? statsRes.value.monthlyStats || null : null,
      }
    } catch {
      return rejectWithValue('Failed to load customers')
    }
  }
)

export const searchCustomers = createAsyncThunk(
  'customer/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchOrdersByCustomer(term)
      return res.success ? buildCustomers(res.data || []) : []
    } catch (err) {
      return err.response?.status === 404 ? [] : rejectWithValue('Search failed')
    }
  }
)

// ── Slice 
const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers:       [],
    monthlyStats:    null,
    searchResults:   null,
    selectedCustomer: null,
    loading:         false,
    error:           null,
  },
  reducers: {
    clearSearch:         (state) => { state.searchResults    = null },
    setSelectedCustomer: (state, action) => { state.selectedCustomer = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomers.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loadCustomers.fulfilled, (state, action) => {
        state.loading      = false
        state.customers    = action.payload.customers
        state.monthlyStats = action.payload.monthlyStats
      })
      .addCase(loadCustomers.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error('Failed to load customers')
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
      .addCase(searchCustomers.rejected, () => {
        toast.error('Search failed')
      })
  },
})

export const { clearSearch, setSelectedCustomer } = customerSlice.actions

export const selectAllCustomers     = (s) => s.customer.customers
export const selectMonthlyStats     = (s) => s.customer.monthlyStats
export const selectCustomerLoading  = (s) => s.customer.loading
export const selectSearchResults    = (s) => s.customer.searchResults
export const selectSelectedCustomer = (s) => s.customer.selectedCustomer
export const selectDisplayCustomers = (s) =>
  s.customer.searchResults !== null ? s.customer.searchResults : s.customer.customers

export default customerSlice.reducer