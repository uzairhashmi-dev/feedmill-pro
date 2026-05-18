import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import {
  Plus, Trash2, Loader2, Eye, Edit3,
  Search, RefreshCw, BarChart2,
  Play, CheckCircle, Clock, DollarSign, X,
} from "lucide-react";

import {
  loadProductions, searchProductionItems,
  createProductionItem, updateProductionItem, deleteProductionItem,
  clearProductionSearch,
  selectDisplayProductions, selectProductions,
  selectProductionFormulas, selectProductionLoading,
  selectProductionSubmitting, selectProductionDeleting,
  selectProductionSearch,
} from "../../../store/productionSlice";

import { EMPTY_FORM } from "./constants";
import StatCard      from "./components/StatCard";
import StatusBadge   from "./components/StatusBadge";
import DeleteModal   from "./components/DeleteModal";
import BatchModal    from "./components/BatchModal";
import ViewDrawer    from "./components/ViewDrawer";
import AnalyticsSection from "./components/AnalyticsSection";

const Production = () => {
  const dispatch = useDispatch();

  const productions  = useSelector(selectDisplayProductions);
  const allProductions = useSelector(selectProductions);
  const formulas     = useSelector(selectProductionFormulas);
  const loading      = useSelector(selectProductionLoading);
  const submitting   = useSelector(selectProductionSubmitting);
  const deleting     = useSelector(selectProductionDeleting);
  const searchResults = useSelector(selectProductionSearch);

  const [showModal,     setShowModal]     = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewBatch,     setViewBatch]     = useState(null);
  const [editingId,     setEditingId]     = useState(null);
  const [deletingBatch, setDeletingBatch] = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadProductions()) }, [dispatch]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (batch) => {
    setEditingId(batch._id);
    setFormData({
      feedName:  batch.feedName,
      formulaId: batch.formula?._id || batch.formula || "",
      quantity:  batch.quantity,
      unit:      batch.unit || "kg",
      waste:     batch.waste ?? 0,
      status:    batch.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const onSubmit = async () => {
    if (!formData.feedName.trim() || !formData.formulaId || !formData.quantity) {
      return toast.error("Batch name, formula, and quantity are required");
    }
    if (Number(formData.quantity) <= 0) return toast.error("Quantity must be greater than 0");
    if (Number(formData.waste) < 0)     return toast.error("Waste cannot be negative");

    const result = editingId
      ? await dispatch(updateProductionItem({ id: editingId, formData }))
      : await dispatch(createProductionItem(formData));

    const ok = result?.payload === true;
    if (ok) {
      toast.success(
        editingId ? "Batch updated successfully!" : "Batch started successfully!",
        { position: "top-right", style: { zIndex: 9999 } }
      );
      closeModal();
    }
  };

  const onDeleteConfirm = async () => {
    if (!deletingBatch) return;
    await dispatch(deleteProductionItem(deletingBatch._id));
    setShowDelete(false);
    setDeletingBatch(null);
  };

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchProductionItems(val));
      else dispatch(clearProductionSearch());
    }, 400);
  }, [dispatch]);

  const isSearching    = searchResults !== null || searchTerm.trim().length > 0;
  const totalCost      = allProductions.reduce((s, p) => s + (p.totalCost  || 0), 0);
  const completedCount = allProductions.filter((p) => p.status === "Completed").length;
  const runningCount   = allProductions.filter((p) => p.status === "Running").length;
  const totalMT        = allProductions.reduce((s, p) => s + (p.targetMT   || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Batches" value={allProductions.length}
          icon={<Play size={20} fill="currentColor" />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500" />
        <StatCard title="Completed" value={completedCount}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="Running" value={runningCount}
          icon={<Clock size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400" />
        <StatCard title="Total Cost (Rs)" value={totalCost.toLocaleString()}
          icon={<DollarSign size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400" />
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

      {showAnalytics && <AnalyticsSection allProductions={allProductions} />}

      {/* Main table card */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center
                        justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Production Batches</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {productions.length} {isSearching ? "results" : "total batches"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search batches, status…"
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
                  onClick={() => { setSearchTerm(""); dispatch(clearProductionSearch()); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => dispatch(loadProductions())}
              className="border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300
                         p-2.5 rounded-xl
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-emerald-700
                         text-white px-4 py-2.5 rounded-xl text-sm
                         font-medium hover:bg-emerald-800 shadow-sm"
            >
              <Plus size={16} /> Start Batch
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60
                             border-b border-gray-100 dark:border-gray-800">
                {["#","Batch Info","Formula","Target MT","Total Cost","Status","Actions"].map((h) => (
                  <th key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold
                               text-gray-500 dark:text-gray-400
                               uppercase tracking-wide whitespace-nowrap last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <Loader2 size={32} className="animate-spin text-emerald-700 inline" />
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading batches…</p>
                  </td>
                </tr>
              ) : productions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
                      <Play size={48} strokeWidth={1} />
                      <p className="text-base font-medium">
                        {isSearching ? "No batches match your search" : "No production batches yet"}
                      </p>
                      {!isSearching && <p className="text-sm">Click 'Start Batch' to begin production</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                productions.map((item, idx) => (
                  <tr key={item._id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800 dark:text-white">{item.feedName}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                        #{item._id?.slice(-6)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">
                      {item.formula?.formulaName || (
                        <span className="text-red-400 text-xs italic">Formula deleted</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {item.quantity}{" "}
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700 dark:text-emerald-400">
                      Rs. {item.totalCost?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewBatch(item)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openEdit(item)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => { setDeletingBatch(item); setShowDelete(true); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {productions.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{productions.length} batch{productions.length !== 1 ? "es" : ""} displayed</span>
            <span>Total: {totalMT.toLocaleString()} MT · Rs. {totalCost.toLocaleString()}</span>
          </div>
        )}
      </div>

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {showModal && (
        <BatchModal editingId={editingId} formData={formData}
          setFormData={setFormData} formulas={formulas}
          onSubmit={onSubmit} onClose={closeModal} submitting={submitting} />
      )}
      {showDelete && (
        <DeleteModal batch={deletingBatch} onConfirm={onDeleteConfirm}
          onClose={() => { setShowDelete(false); setDeletingBatch(null); }}
          deleting={deleting} />
      )}
      {viewBatch && (
        <ViewDrawer batch={viewBatch} onClose={() => setViewBatch(null)} onEdit={openEdit} />
      )}
    </div>
  );
};

export default Production;