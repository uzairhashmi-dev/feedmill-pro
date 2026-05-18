import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import {
  Plus, Loader2, FolderTree, Search,
  X, RefreshCw, AlertCircle, BarChart2,
  CheckCircle, Clock,
} from "lucide-react";

import {
  loadCategories, createCategoryItem, updateCategoryItem,
  deleteCategoryItem, searchCategoryItems, clearSearch,
  selectAllCategories, selectDisplayCategories,
  selectCategoryLoading, selectCategorySubmitting,
  selectCategoryDeleting, selectSearchResults,
} from "../../../store/categorySlice";

import { EMPTY_FORM } from "./constants";
import StatCard        from "./components/StatCard";
import EmptyState      from "./components/EmptyState";
import DeleteModal     from "./components/DeleteModal";
import CategoryModal   from "./components/CategoryModal";
import CategoryCard    from "./components/CategoryCard";
import AnalyticsSection from "./components/AnalyticsSection";

const Category = () => {
  const dispatch = useDispatch();

  const categories    = useSelector(selectDisplayCategories);
  const allCategories = useSelector(selectAllCategories);
  const loading       = useSelector(selectCategoryLoading);
  const submitting    = useSelector(selectCategorySubmitting);
  const deleting      = useSelector(selectCategoryDeleting);
  const searchResults = useSelector(selectSearchResults);

  const [showModal,     setShowModal]     = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [deletingCat,   setDeletingCat]   = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadCategories()) }, [dispatch]);

  const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setShowModal(true); };
  const openEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({ categoryName: cat.categoryName, description: cat.description || "" });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData(EMPTY_FORM); };

  const onSubmit = async () => {
    if (!formData.categoryName.trim()) return toast.error("Category name is required");
    const result = editingId
      ? await dispatch(updateCategoryItem({ id: editingId, formData }))
      : await dispatch(createCategoryItem(formData));
    if (result?.payload === true) {
      toast.success(
        editingId ? "Category updated successfully!" : "Category created successfully!",
        { position: "top-right", style: { zIndex: 9999 } }
      );
      closeModal();
    }
  };

  const onDeleteConfirm = async () => {
    if (!deletingCat) return;
    await dispatch(deleteCategoryItem(deletingCat._id));
    setShowDelete(false);
    setDeletingCat(null);
  };

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchCategoryItems(val));
      else dispatch(clearSearch());
    }, 400);
  }, [dispatch]);

  const isSearching = searchResults !== null || searchTerm.trim().length > 0;

  // same computed stats as before
  const total       = allCategories.length;
  const withDesc    = allCategories.filter((c) => c.description?.trim()).length;
  const recentCount = allCategories.filter((c) => {
    const d = new Date(c.createdAt), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Categories" value={total}
          icon={<FolderTree size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500" />
        <StatCard title="With Description" value={withDesc}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="No Description" value={total - withDesc}
          icon={<AlertCircle size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400" />
        <StatCard title="Added This Month" value={recentCount}
          icon={<Clock size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400" />
      </div>

      {/* Analytics toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowAnalytics((p) => !p)}
          className="flex items-center gap-2 text-sm font-medium
                     text-emerald-700 dark:text-emerald-400
                     hover:text-emerald-800 dark:hover:text-emerald-300
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
        >
          <BarChart2 size={16} />
          {showAnalytics ? "Hide" : "Show"} Analytics
        </button>
      </div>

      {showAnalytics && <AnalyticsSection allCategories={allCategories} />}

      {/* Main card */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center
                        justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Category Management
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {categories.length} {isSearching ? "results" : "total categories"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search categories…"
                className="pl-9 pr-4 py-2.5
                           border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-800 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           rounded-xl text-sm w-full sm:w-52
                           focus:outline-none focus:ring-2
                           focus:ring-emerald-300 dark:focus:ring-emerald-700"
                value={searchTerm}
                onChange={onSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); dispatch(clearSearch()); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={() => dispatch(loadCategories())}
              className="border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300
                         p-2.5 rounded-xl
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            {/* Add */}
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-emerald-700
                         text-white px-4 py-2.5 rounded-xl text-sm
                         font-medium hover:bg-emerald-800 transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-3 text-gray-400">
                <Loader2 size={36} className="animate-spin text-emerald-700" />
                <p className="text-sm dark:text-gray-500">Loading categories…</p>
              </div>
            ) : categories.length === 0 ? (
              <EmptyState searching={isSearching} />
            ) : (
              categories.map((cat, i) => (
                <CategoryCard
                  key={cat._id}
                  cat={cat}
                  index={i}
                  onEdit={openEdit}
                  onDelete={(c) => { setDeletingCat(c); setShowDelete(true); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {categories.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          text-xs text-gray-400 dark:text-gray-500
                          flex justify-between">
            <span>{categories.length} categor{categories.length !== 1 ? "ies" : "y"} displayed</span>
            <span>{withDesc} with descriptions · {total - withDesc} without</span>
          </div>
        )}
      </div>

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {showModal && (
        <CategoryModal
          editingId={editingId} formData={formData}
          setFormData={setFormData} onSubmit={onSubmit}
          onClose={closeModal} submitting={submitting}
        />
      )}
      {showDelete && (
        <DeleteModal
          cat={deletingCat} onConfirm={onDeleteConfirm}
          onClose={() => { setShowDelete(false); setDeletingCat(null); }}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default Category;