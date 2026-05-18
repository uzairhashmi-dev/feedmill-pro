import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllProductions, createProduction, updateProduction,
  deleteProduction, searchProductions, fetchFormulasForProduction,
} from '../api/productionService'

// ── Load all data
export const loadProductions = createAsyncThunk(
  'production/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const [prodRes, formulaRes] = await Promise.allSettled([
        fetchAllProductions(),
        fetchFormulasForProduction(),
      ])
      return {
        productions: prodRes.status === 'fulfilled' && prodRes.value.success
          ? prodRes.value.data || [] : [],
        formulas: formulaRes.status === 'fulfilled' && formulaRes.value.success
          ? formulaRes.value.data || [] : [],
      }
    } catch {
      return rejectWithValue('Failed to load production data')
    }
  }
)

// ── Search
export const searchProductionItems = createAsyncThunk(
  'production/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchProductions(term)
      return res.success ? res.data || [] : []
    } catch (err) {
      if (err.response?.status === 404) return []
      return rejectWithValue('Search failed')
    }
  }
)

// ── Create
export const createProductionItem = createAsyncThunk(
  'production/create',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await createProduction(formData)
      if (res.success) { dispatch(loadProductions()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create batch')
      return rejectWithValue('Create failed')
    }
  }
)

// ── Update
export const updateProductionItem = createAsyncThunk(
  'production/update',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateProduction(id, formData)
      if (res.success) { dispatch(loadProductions()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update batch')
      return rejectWithValue('Update failed')
    }
  }
)

// ── Delete
export const deleteProductionItem = createAsyncThunk(
  'production/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteProduction(id)
      if (res.success) {
        toast.success(res.message || 'Batch deleted successfully')
        dispatch(loadProductions())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete batch')
      return rejectWithValue('Delete failed')
    }
  }
)

// ── Slice
const productionSlice = createSlice({
  name: 'production',
  initialState: {
    productions:   [],
    formulas:      [],
    searchResults: null,
    loading:       false,
    submitting:    false,
    deleting:      false,
    error:         null,
  },
  reducers: {
    clearProductionSearch: (state) => { state.searchResults = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductions.pending,   (state) => { state.loading = true;  state.error = null })
      .addCase(loadProductions.fulfilled, (state, action) => {
        state.loading     = false
        state.productions = action.payload.productions
        state.formulas    = action.payload.formulas
      })
      .addCase(loadProductions.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error('Failed to load production data')
      })
      .addCase(searchProductionItems.fulfilled, (state, action) => { state.searchResults = action.payload })
      .addCase(searchProductionItems.rejected,  () => { toast.error('Search failed') })
      .addCase(createProductionItem.pending,   (state) => { state.submitting = true })
      .addCase(createProductionItem.fulfilled, (state) => { state.submitting = false })
      .addCase(createProductionItem.rejected,  (state) => { state.submitting = false })
      .addCase(updateProductionItem.pending,   (state) => { state.submitting = true })
      .addCase(updateProductionItem.fulfilled, (state) => { state.submitting = false })
      .addCase(updateProductionItem.rejected,  (state) => { state.submitting = false })
      .addCase(deleteProductionItem.pending,   (state) => { state.deleting = true })
      .addCase(deleteProductionItem.fulfilled, (state) => { state.deleting = false })
      .addCase(deleteProductionItem.rejected,  (state) => { state.deleting = false })
  },
})

export const { clearProductionSearch } = productionSlice.actions

// ── Selectors
export const selectProductions        = (s) => s.production?.productions    ?? []
export const selectProductionFormulas = (s) => s.production?.formulas       ?? []
export const selectProductionLoading  = (s) => s.production?.loading        ?? false
export const selectProductionSubmitting = (s) => s.production?.submitting   ?? false
export const selectProductionDeleting = (s) => s.production?.deleting       ?? false
export const selectProductionSearch   = (s) => s.production?.searchResults  ?? null
export const selectDisplayProductions = (s) =>
  s.production?.searchResults !== null && s.production?.searchResults !== undefined
    ? s.production.searchResults
    : (s.production?.productions ?? [])

export default productionSlice.reducer