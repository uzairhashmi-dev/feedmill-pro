import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllInventory, fetchMonthlyStats, fetchTotalStats,
  createInventory, updateInventory, deleteInventory,
  searchInventory, fetchFilteredOrders,
} from '../api/inventoryService'

// ── Load all data (replaces loadInventoryData in hook) ───
export const loadInventory = createAsyncThunk(
  'inventory/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const [itemRes, statsRes, totalRes] = await Promise.allSettled([
        fetchAllInventory(),
        fetchMonthlyStats(),
        fetchTotalStats(),
      ])
      return {
        items:      itemRes.status  === 'fulfilled' && itemRes.value.success
                      ? itemRes.value.data || []   : [],
        stats:      statsRes.status === 'fulfilled' && statsRes.value.success
                      ? statsRes.value.monthlyStats || null : null,
        totalStats: totalRes.status === 'fulfilled' && totalRes.value.success
                      ? totalRes.value.totalStats || null   : null,
      }
    } catch {
      return rejectWithValue('Failed to load inventory data')
    }
  }
)

// ── Search 
export const searchInventoryItems = createAsyncThunk(
  'inventory/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchInventory(term)
      return res.success ? res.data || [] : []
    } catch (err) {
      if (err.response?.status === 404) return []
      return rejectWithValue('Search failed')
    }
  }
)

// ── Filter
export const filterInventoryItems = createAsyncThunk(
  'inventory/filter',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await fetchFilteredOrders(filters)
      return res.success ? res.data || [] : []
    } catch (err) {
      if (err.response?.status === 404) return []
      return rejectWithValue('Filter failed')
    }
  }
)

// ── Create
export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await createInventory(formData)
      if (res.success) {
        dispatch(loadInventory())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item')
      return rejectWithValue('Create failed')
    }
  }
)

// ── Update
export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateInventory(id, formData)
      if (res.success) {
        dispatch(loadInventory())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item')
      return rejectWithValue('Update failed')
    }
  }
)

// ── Delete
export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteInventory(id)
      if (res.success) {
        toast.success('Item deleted successfully')
        dispatch(loadInventory())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete item')
      return rejectWithValue('Delete failed')
    }
  }
)

// ── Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items:         [],
    stats:         null,
    totalStats:    null,
    searchResults: null,   // null = not searching, [] = no results
    loading:       false,
    submitting:    false,
    deleting:      false,
    error:         null,
  },
  reducers: {
    clearSearch: (state) => { state.searchResults = null },
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadInventory.pending,    (state) => { state.loading = true; state.error = null })
      .addCase(loadInventory.fulfilled,  (state, action) => {
        state.loading    = false
        state.items      = action.payload.items
        state.stats      = action.payload.stats
        state.totalStats = action.payload.totalStats
      })
      .addCase(loadInventory.rejected,   (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error('Failed to load inventory data')
      })
      // search
      .addCase(searchInventoryItems.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
      .addCase(searchInventoryItems.rejected,  () => {
        toast.error('Search failed')
      })
      // filter
      .addCase(filterInventoryItems.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
      .addCase(filterInventoryItems.rejected, () => {
        toast.error('Filter failed')
      })
      // create / update
      .addCase(createInventoryItem.pending, (state) => { state.submitting = true })
      .addCase(createInventoryItem.fulfilled,(state) => { state.submitting = false })
      .addCase(createInventoryItem.rejected, (state) => { state.submitting = false })
      .addCase(updateInventoryItem.pending, (state) => { state.submitting = true })
      .addCase(updateInventoryItem.fulfilled,(state) => { state.submitting = false })
      .addCase(updateInventoryItem.rejected, (state) => { state.submitting = false })
      // delete
      .addCase(deleteInventoryItem.pending,  (state) => { state.deleting = true })
      .addCase(deleteInventoryItem.fulfilled,(state) => { state.deleting = false })
      .addCase(deleteInventoryItem.rejected, (state) => { state.deleting = false })
  },
})

export const { clearSearch } = inventorySlice.actions

// ── Selector
export const selectInventoryItems      = (s) => s.inventory.items
export const selectInventoryStats      = (s) => s.inventory.stats
export const selectInventoryTotalStats = (s) => s.inventory.totalStats
export const selectInventoryLoading    = (s) => s.inventory.loading
export const selectInventorySubmitting = (s) => s.inventory.submitting
export const selectInventoryDeleting   = (s) => s.inventory.deleting
export const selectSearchResults       = (s) => s.inventory.searchResults
export const selectDisplayItems        = (s) =>
  s.inventory.searchResults !== null ? s.inventory.searchResults : s.inventory.items

export default inventorySlice.reducer