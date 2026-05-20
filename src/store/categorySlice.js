import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import {
  fetchAllCategories, createCategory,
  updateCategory, deleteCategory, searchCategories,
} from '../api/categoryService'

export const loadCategories = createAsyncThunk(
  'category/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAllCategories()
      return res.success ? res.data || [] : []
    } catch (err) {
      if (err.response?.status !== 404) return rejectWithValue('Failed to load categories')
      return []
    }
  }
)
export const searchCategoryItems = createAsyncThunk(
  'category/search',
  async (term, { rejectWithValue }) => {
    try {
      const res = await searchCategories(term)
      return res.success ? res.data || [] : []
    } catch (err) {
      return err.response?.status === 404 ? [] : rejectWithValue('Search failed')
    }
  }
)
export const createCategoryItem = createAsyncThunk(
  'category/create',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await createCategory(formData)
      if (res.success) { dispatch(loadCategories()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed')
      return rejectWithValue('Create failed')
    }
  }
)

export const updateCategoryItem = createAsyncThunk(
  'category/update',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await updateCategory(id, formData)
      if (res.success) { dispatch(loadCategories()); return true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
      return rejectWithValue('Update failed')
    }
  }
)
export const deleteCategoryItem = createAsyncThunk(
  'category/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteCategory(id)
      if (res.success) {
        toast.success(res.message || 'Category deleted')
        return id  // return id so slice can filter locally (same as old hook)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
      return rejectWithValue('Delete failed')
    }
  }
)
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories:    [],
    searchResults: null,
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
      .addCase(loadCategories.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false; state.categories = action.payload
      })
      .addCase(loadCategories.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
        if (action.payload) toast.error('Failed to load categories')
      })
      // search
      .addCase(searchCategoryItems.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
      // create
      .addCase(createCategoryItem.pending,   (state) => { state.submitting = true })
      .addCase(createCategoryItem.fulfilled, (state) => { state.submitting = false })
      .addCase(createCategoryItem.rejected,  (state) => { state.submitting = false })
      // update
      .addCase(updateCategoryItem.pending,   (state) => { state.submitting = true })
      .addCase(updateCategoryItem.fulfilled, (state) => { state.submitting = false })
      .addCase(updateCategoryItem.rejected,  (state) => { state.submitting = false })
      // delete — filter locally like old hook did
      .addCase(deleteCategoryItem.pending,   (state) => { state.deleting = true })
      .addCase(deleteCategoryItem.fulfilled, (state, action) => {
        state.deleting = false
        if (action.payload) {
          state.categories = state.categories.filter((c) => c._id !== action.payload)
        }
      })
      .addCase(deleteCategoryItem.rejected,  (state) => { state.deleting = false })
  },
})

export const { clearSearch } = categorySlice.actions

export const selectAllCategories   = (s) => s.category.categories
export const selectCategoryLoading  = (s) => s.category.loading
export const selectCategorySubmitting = (s) => s.category.submitting
export const selectCategoryDeleting = (s) => s.category.deleting
export const selectSearchResults    = (s) => s.category.searchResults
export const selectDisplayCategories = (s) =>
  s.category.searchResults !== null ? s.category.searchResults : s.category.categories

export default categorySlice.reducer