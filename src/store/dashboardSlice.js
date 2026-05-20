import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchInventoryDailyStats,   fetchInventoryWeeklyStats,
  fetchInventoryMonthlyStats, fetchInventoryYearlyStats,
  fetchInventoryTotalStats,   fetchInventoryCustomStats,
  fetchProductionDailyStats,  fetchProductionWeeklyStats,
  fetchProductionMonthlyStats,fetchProductionYearlyStats,
  fetchProductionTotalStats,  fetchProductionCustomStats,
  fetchOrderDailyStats,       fetchOrderWeeklyStats,
  fetchOrderMonthlyStats,     fetchOrderYearlyStats,
  fetchOrderTotalStats,       fetchOrderCustomStats,
} from '../api/dashboardService'

// ── Same period-picker logic as the old hook
const getInvFn  = (p, s, e) => {
  if (p === 'daily')  return fetchInventoryDailyStats()
  if (p === 'weekly') return fetchInventoryWeeklyStats()
  if (p === 'yearly') return fetchInventoryYearlyStats()
  if (p === 'total')  return fetchInventoryTotalStats()
  if (p === 'custom') return fetchInventoryCustomStats(s, e)
  return fetchInventoryMonthlyStats()
}
const getProdFn = (p, s, e) => {
  if (p === 'daily')  return fetchProductionDailyStats()
  if (p === 'weekly') return fetchProductionWeeklyStats()
  if (p === 'yearly') return fetchProductionYearlyStats()
  if (p === 'total')  return fetchProductionTotalStats()
  if (p === 'custom') return fetchProductionCustomStats(s, e)
  return fetchProductionMonthlyStats()
}
const getOrdFn  = (p, s, e) => {
  if (p === 'daily')  return fetchOrderDailyStats()
  if (p === 'weekly') return fetchOrderWeeklyStats()
  if (p === 'yearly') return fetchOrderYearlyStats()
  if (p === 'total')  return fetchOrderTotalStats()
  if (p === 'custom') return fetchOrderCustomStats(s, e)
  return fetchOrderMonthlyStats()
}

// ── Async thunk — replaces fetchAll() in the old hook ────
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async ({ period, customStart = '', customEnd = '' }, { rejectWithValue }) => {
    try {
      const [invRes, prodRes, ordRes] = await Promise.allSettled([
        getInvFn(period, customStart, customEnd),
        getProdFn(period, customStart, customEnd),
        getOrdFn(period, customStart, customEnd),
      ])
      return {
        inventoryStats:  invRes.status  === 'fulfilled' && invRes.value.success
                           ? invRes.value.stats  : null,
        productionStats: prodRes.status === 'fulfilled' && prodRes.value.success
                           ? prodRes.value.stats : null,
        orderStats:      ordRes.status  === 'fulfilled' && ordRes.value.success
                           ? ordRes.value.stats  : null,
      }
    } catch {
      return rejectWithValue('Failed to load dashboard data')
    }
  }
)
// ── Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    period:         'monthly',
    customStart:    '',
    customEnd:      '',
    inventoryStats:  null,
    productionStats: null,
    orderStats:      null,
    loading:         false,
    error:           null,
  },
  reducers: {
    setPeriod:      (state, action) => { state.period      = action.payload },
    setCustomStart: (state, action) => { state.customStart = action.payload },
    setCustomEnd:   (state, action) => { state.customEnd   = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading        = false
        state.inventoryStats  = action.payload.inventoryStats
        state.productionStats = action.payload.productionStats
        state.orderStats      = action.payload.orderStats
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
        toast.error('Failed to load dashboard data')
      })
  },
})

export const { setPeriod, setCustomStart, setCustomEnd } = dashboardSlice.actions

export const selectPeriod          = (s) => s.dashboard.period
export const selectCustomStart     = (s) => s.dashboard.customStart
export const selectCustomEnd       = (s) => s.dashboard.customEnd
export const selectInventoryStats  = (s) => s.dashboard.inventoryStats
export const selectProductionStats = (s) => s.dashboard.productionStats
export const selectOrderStats      = (s) => s.dashboard.orderStats
export const selectDashboardLoading= (s) => s.dashboard.loading

export default dashboardSlice.reducer