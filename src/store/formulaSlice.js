import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllFormulas, createFormula, updateFormula,
  deleteFormula, searchFormulas,
  fetchCategoriesForFormula, fetchInventoryForFormula,
} from '../api/formulaService'

// ── Load all data
export const loadFormulas = createAsyncThunk(
  'formula/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const [formulaRes, catRes, invRes] = await Promise.allSettled([
        fetchAllFormulas(),
        fetchCategoriesForFormula(),
        fetchInventoryForFormula(),
      ])
      return {
        formulas: formulaRes.status === 'fulfilled' && formulaRes.value.success
          ? formulaRes.value.data || [] : [],
        categories: catRes.status === 'fulfilled' && catRes.value.success
          ? catRes.value.data || [] : [],
        inventoryItems: invRes.status === 'fulfilled' && invRes.value.success
          ? (invRes.value.data || []).filter((i) => i.status === 'Received') : [],
      }
    } catch {
      return rejectWithValue('Failed to load formula data')
    }
  }
)

// ── Search
export const searchFormulaItems = createAsyncThunk(
  'formula/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchFormulas(term)
      return res.success ? res.data || [] : []
    } catch (err) {
      if (err.response?.status === 404) return []
      return rejectWithValue('Search failed')
    }
  }
)

// ── Create
export const createFormulaItem = createAsyncThunk(
  'formula/create',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await createFormula(formData)
      if (res.success) {
        dispatch(loadFormulas())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create formula')
      return rejectWithValue('Create failed')
    }
  }
)

// ── Update
export const updateFormulaItem = createAsyncThunk(
  'formula/update',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateFormula(id, formData)
      if (res.success) {
        dispatch(loadFormulas())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update formula')
      return rejectWithValue('Update failed')
    }
  }
)

// ── Delete
export const deleteFormulaItem = createAsyncThunk(
  'formula/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await deleteFormula(id)
      if (res.success) {
        toast.success(res.message || 'Formula deleted successfully')
        dispatch(loadFormulas())
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete formula')
      return rejectWithValue('Delete failed')
    }
  }
)

// ── Slice
const formulaSlice = createSlice({
  name: 'formula',
  initialState: {
    formulas:       [],
    categories:     [],
    inventoryItems: [],
    searchResults:  null,
    loading:        false,
    submitting:     false,
    deleting:       false,
    error:          null,
  },
  reducers: {
    clearFormulaSearch: (state) => { state.searchResults = null },
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadFormulas.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loadFormulas.fulfilled, (state, action) => {
        state.loading        = false
        state.formulas       = action.payload.formulas
        state.categories     = action.payload.categories
        state.inventoryItems = action.payload.inventoryItems
      })
      .addCase(loadFormulas.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error('Failed to load formula data')
      })
      // search
      .addCase(searchFormulaItems.fulfilled, (state, action) => { state.searchResults = action.payload })
      .addCase(searchFormulaItems.rejected,  () => { toast.error('Search failed') })
      // create
      .addCase(createFormulaItem.pending,   (state) => { state.submitting = true })
      .addCase(createFormulaItem.fulfilled, (state) => { state.submitting = false })
      .addCase(createFormulaItem.rejected,  (state) => { state.submitting = false })
      // update
      .addCase(updateFormulaItem.pending,   (state) => { state.submitting = true })
      .addCase(updateFormulaItem.fulfilled, (state) => { state.submitting = false })
      .addCase(updateFormulaItem.rejected,  (state) => { state.submitting = false })
      // delete
      .addCase(deleteFormulaItem.pending,   (state) => { state.deleting = true })
      .addCase(deleteFormulaItem.fulfilled, (state) => { state.deleting = false })
      .addCase(deleteFormulaItem.rejected,  (state) => { state.deleting = false })
  },
})

export const { clearFormulaSearch } = formulaSlice.actions

// ── Selectors
export const selectFormulas        = (s) => s.formula.formulas
export const selectFormulaCategories   = (s) => s.formula.categories
export const selectFormulaInventory    = (s) => s.formula.inventoryItems
export const selectFormulaLoading      = (s) => s.formula.loading
export const selectFormulaSubmitting   = (s) => s.formula.submitting
export const selectFormulaDeleting     = (s) => s.formula.deleting
export const selectFormulaSearchResults = (s) => s.formula.searchResults
export const selectDisplayFormulas     = (s) =>
  s.formula.searchResults !== null ? s.formula.searchResults : s.formula.formulas

export default formulaSlice.reducer