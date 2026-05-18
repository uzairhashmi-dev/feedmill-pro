import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import {
  Plus, FlaskConical, Loader2,
  Search, RefreshCw, X,
  BarChart2, Package, DollarSign, Tag,
} from "lucide-react";

import {
  loadFormulas, searchFormulaItems,
  createFormulaItem, updateFormulaItem, deleteFormulaItem,
  clearFormulaSearch,
  selectDisplayFormulas, selectFormulas,
  selectFormulaCategories, selectFormulaInventory,
  selectFormulaLoading, selectFormulaSubmitting,
  selectFormulaDeleting, selectFormulaSearchResults,
} from "../../../store/formulaSlice";

import { EMPTY_FORM } from "./constants";
import StatCard        from "./components/StatCard";
import EmptyState      from "./components/EmptyState";
import FormulaCard     from "./components/FormulaCard";
import FormulaModal    from "./components/FormulaModal";
import DeleteModal     from "./components/DeleteModal";
import ViewDrawer      from "./components/ViewDrawer";
import AnalyticsSection from "./components/AnalyticsSection";

const Formulation = () => {
  const dispatch = useDispatch();

  const formulas       = useSelector(selectDisplayFormulas);
  const allFormulas    = useSelector(selectFormulas);
  const categories     = useSelector(selectFormulaCategories);
  const inventoryItems = useSelector(selectFormulaInventory);
  const loading        = useSelector(selectFormulaLoading);
  const submitting     = useSelector(selectFormulaSubmitting);
  const deleting       = useSelector(selectFormulaDeleting);
  const searchResults  = useSelector(selectFormulaSearchResults);

  const [showModal,       setShowModal]       = useState(false);
  const [showDelete,      setShowDelete]       = useState(false);
  const [showAnalytics,   setShowAnalytics]   = useState(false);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [editingId,       setEditingId]       = useState(null);
  const [deletingFormula, setDeletingFormula] = useState(null);
  const [formData,        setFormData]        = useState(EMPTY_FORM);
  const [searchTerm,      setSearchTerm]      = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadFormulas()) }, [dispatch]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (formula) => {
    setEditingId(formula._id);
    setFormData({
      formulaName:  formula.formulaName,
      formulaCode:  formula.formulaCode,
      category:     formula.category?._id || formula.category || "",
      description:  formula.description || "",
      ingredients:  formula.ingredients?.length
        ? formula.ingredients.map((i) => ({ key: i.key, value: i.value }))
        : [{ key: "", value: 0 }],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const onSubmit = async () => {
    if (!formData.formulaName.trim() || !formData.formulaCode.trim() || !formData.category) {
      return toast.error("Formula name, code and category are required");
    }
    const totalPct = formData.ingredients.reduce((s, i) => s + (Number(i.value) || 0), 0);
    if (Math.round(totalPct) !== 100) {
      return toast.error(`Total must be 100%. Currently: ${totalPct.toFixed(2)}%`);
    }
    if (formData.ingredients.some((i) => !i.key)) {
      return toast.error("All ingredient rows must have an item selected");
    }

    const result = editingId
      ? await dispatch(updateFormulaItem({ id: editingId, formData }))
      : await dispatch(createFormulaItem(formData));

    const ok = result?.payload === true;
    if (ok) {
      toast.success(
        editingId ? "Formula updated successfully!" : "Formula created successfully!",
        { position: "top-right", style: { zIndex: 9999 } }
      );
      closeModal();
    }
  };

  const onDeleteConfirm = async () => {
    if (!deletingFormula) return;
    await dispatch(deleteFormulaItem(deletingFormula._id));
    setShowDelete(false);
    setDeletingFormula(null);
  };

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchFormulaItems(val));
      else dispatch(clearFormulaSearch());
    }, 400);
  }, [dispatch]);

  const isSearching = searchResults !== null || searchTerm.trim().length > 0;

  const totalCost    = allFormulas.reduce((s, f) => s + (f.costPerMT || 0), 0);
  const avgCost      = allFormulas.length ? Math.round(totalCost / allFormulas.length) : 0;
  const totalIngUsed = [...new Set(allFormulas.flatMap((f) => f.ingredients?.map((i) => i.key) || []))].length;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Formulas"
          value={allFormulas.length}
          icon={<FlaskConical size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500"
        />
        <StatCard
          title="Categories Used"
          value={[...new Set(allFormulas.map((f) => f.category?._id || f.category))].length}
          icon={<Tag size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400"
        />
        <StatCard
          title="Unique Ingredients"
          value={totalIngUsed}
          icon={<Package size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400"
        />
        <StatCard
          title="Avg Cost / MT"
          value={`Rs ${avgCost.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400"
        />
      </div>

      {/* Analytics Toggle */}
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

      {showAnalytics && <AnalyticsSection allFormulas={allFormulas} />}

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Feed Formulations</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {formulas.length} {isSearching ? "results" : "total formulas"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search formulas, codes…"
                className="pl-9 pr-8 py-2.5
                           border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-800 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           rounded-xl text-sm w-full sm:w-52
                           focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                value={searchTerm}
                onChange={onSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); dispatch(clearFormulaSearch()); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={() => dispatch(loadFormulas())}
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
              <Plus size={16} /> Create Formula
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
                <Loader2 size={36} className="animate-spin text-emerald-700" />
                <p className="text-sm">Loading formulas…</p>
              </div>
            ) : formulas.length === 0 ? (
              <EmptyState searching={isSearching} onAdd={openAdd} />
            ) : (
              formulas.map((formula, i) => (
                <FormulaCard
                  key={formula._id}
                  formula={formula}
                  index={i}
                  onView={setSelectedFormula}
                  onEdit={openEdit}
                  onDelete={(f) => { setDeletingFormula(f); setShowDelete(true); }}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {formulas.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{formulas.length} formula{formulas.length !== 1 ? "s" : ""} displayed</span>
            <span>Total cost pool: Rs {allFormulas.reduce((s, f) => s + (f.costPerMT || 0), 0).toLocaleString()}</span>
          </div>
        )}
      </div>

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {showModal && (
        <FormulaModal
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          inventoryItems={inventoryItems}
          onSubmit={onSubmit}
          onClose={closeModal}
          submitting={submitting}
        />
      )}

      {showDelete && (
        <DeleteModal
          formula={deletingFormula}
          onConfirm={onDeleteConfirm}
          onClose={() => { setShowDelete(false); setDeletingFormula(null); }}
          deleting={deleting}
        />
      )}

      {selectedFormula && (
        <ViewDrawer
          formula={selectedFormula}
          onClose={() => setSelectedFormula(null)}
          onEdit={openEdit}
        />
      )}
    </div>
  );
};

export default Formulation;