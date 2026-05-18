import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllOrders, fetchOrderMonthlyStats, fetchOrderTotalStats,
  fetchFormulaStockSummary, createOrder, updateOrder,
  deleteOrder, searchOrders,
} from '../api/orderService'
import { fetchAllFormulas } from '../api/formulaService'

export const loadOrders = createAsyncThunk(
  'order/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const [ordersRes, monthlyRes, totalRes, stockRes, formulaRes] =
        await Promise.allSettled([
          fetchAllOrders(), fetchOrderMonthlyStats(),
          fetchOrderTotalStats(), fetchFormulaStockSummary(),
          fetchAllFormulas(),
        ])
      return {
        orders:       ordersRes.status  === 'fulfilled' && ordersRes.value.success  ? ordersRes.value.data  || [] : [],
        monthlyStats: monthlyRes.status === 'fulfilled' && monthlyRes.value.success ? monthlyRes.value.monthlyStats || null : null,
        totalStats:   totalRes.status   === 'fulfilled' && totalRes.value.success   ? totalRes.value.totalStats   || null : null,
        stockSummary: stockRes.status   === 'fulfilled' && stockRes.value.success   ? stockRes.value.data   || [] : [],
        formulas:     formulaRes.status === 'fulfilled' && formulaRes.value.success ? formulaRes.value.data || [] : [],
      }
    } catch { return rejectWithValue('Failed to load sales data') }
  }
)

export const searchOrderItems = createAsyncThunk(
  'order/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchOrders(term)
      return res.success ? res.data || [] : []
    } catch (err) {
      return err.response?.status === 404 ? [] : rejectWithValue('Search failed')
    }
  }
)

export const createOrderItem = createAsyncThunk(
  'order/create',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await createOrder(formData)
      if (res.success) { dispatch(loadOrders()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order')
      return rejectWithValue('Create failed')
    }
  }
)

export const updateOrderItem = createAsyncThunk(
  'order/update',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateOrder(id, formData)
      if (res.success) { dispatch(loadOrders()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order')
      return rejectWithValue('Update failed')
    }
  }
)

export const deleteOrderItem = createAsyncThunk(
  'order/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteOrder(id)
      if (res.success) {
        toast.success('Order deleted successfully')
        dispatch(loadOrders())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order')
      return rejectWithValue('Delete failed')
    }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [], formulas: [], stockSummary: [],
    monthlyStats: null, totalStats: null,
    searchResults: null,
    loading: false, submitting: false, deleting: false, error: null,
  },
  reducers: {
    clearSearch: (state) => { state.searchResults = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders       = action.payload.orders
        state.monthlyStats = action.payload.monthlyStats
        state.totalStats   = action.payload.totalStats
        state.stockSummary = action.payload.stockSummary
        state.formulas     = action.payload.formulas
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error('Failed to load sales data')
      })
      .addCase(searchOrderItems.fulfilled, (state, action) => { state.searchResults = action.payload })
      .addCase(searchOrderItems.rejected,  () => { toast.error('Search failed') })
      .addCase(createOrderItem.pending,   (state) => { state.submitting = true })
      .addCase(createOrderItem.fulfilled, (state) => { state.submitting = false })
      .addCase(createOrderItem.rejected,  (state) => { state.submitting = false })
      .addCase(updateOrderItem.pending,   (state) => { state.submitting = true })
      .addCase(updateOrderItem.fulfilled, (state) => { state.submitting = false })
      .addCase(updateOrderItem.rejected,  (state) => { state.submitting = false })
      .addCase(deleteOrderItem.pending,   (state) => { state.deleting = true })
      .addCase(deleteOrderItem.fulfilled, (state) => { state.deleting = false })
      .addCase(deleteOrderItem.rejected,  (state) => { state.deleting = false })
  },
})

export const { clearSearch } = orderSlice.actions

export const selectAllOrders       = (s) => s.order.orders
export const selectOrderFormulas   = (s) => s.order.formulas
export const selectStockSummary    = (s) => s.order.stockSummary
export const selectOrderMonthly    = (s) => s.order.monthlyStats
export const selectOrderLoading    = (s) => s.order.loading
export const selectOrderSubmitting = (s) => s.order.submitting
export const selectOrderDeleting   = (s) => s.order.deleting
export const selectOrderSearch     = (s) => s.order.searchResults
export const selectDisplayOrders   = (s) =>
  s.order.searchResults !== null ? s.order.searchResults : s.order.orders

export const selectOrderTotalStats = (s) => s.order?.totalStats ?? null

export default orderSlice.reducer
