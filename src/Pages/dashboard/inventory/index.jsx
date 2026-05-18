import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  Plus, Edit3, Trash2, Loader2,
  CheckCircle, Clock, DollarSign,
  Search, Filter, X, BarChart2,
  ShoppingCart, RefreshCw,
} from "lucide-react";

import {
  loadInventory, searchInventoryItems, filterInventoryItems,
  createInventoryItem, updateInventoryItem, deleteInventoryItem,
  clearSearch,
  selectDisplayItems, selectInventoryItems,
  selectInventoryStats, selectInventoryTotalStats,
  selectInventoryLoading, selectInventorySubmitting,
  selectInventoryDeleting, selectSearchResults,
} from "../../../store/inventorySlice";

import { STATUS_COLORS, EMPTY_FORM } from "./constants";
import StatCard        from "./components/StatCard";
import EmptyState      from "./components/EmptyState";
import FilterPanel     from "./components/FilterPanel";
import ItemModal       from "./components/ItemModal";
import DeleteModal     from "./components/DeleteModal";
import AnalyticsSection from "./components/AnalyticsSection";

const Inventory = () => {
  const dispatch = useDispatch();

  const items         = useSelector(selectDisplayItems);
  const allItems      = useSelector(selectInventoryItems);
  const stats         = useSelector(selectInventoryStats);
  const totalStats    = useSelector(selectInventoryTotalStats);
  const loading       = useSelector(selectInventoryLoading);
  const submitting    = useSelector(selectInventorySubmitting);
  const deleting      = useSelector(selectInventoryDeleting);
  const searchResults = useSelector(selectSearchResults);

  const [showModal,     setShowModal]     = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [showFilter,    setShowFilter]    = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [deletingItem,  setDeletingItem]  = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  //  same as useEffect(() => loadInventoryData(), [])
  useEffect(() => { dispatch(loadInventory()) }, [dispatch]);

  const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setShowModal(true); };
  const openEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName, vendorName: item.vendorName,
      price: item.price, quantityReceived: item.quantityReceived,
      unit: item.unit || "kg", status: item.status,
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData(EMPTY_FORM); };
  //  same save logic — dispatch thunk, close on success
  const onSave = async () => {
    const result = editingId
      ? await dispatch(updateInventoryItem({ id: editingId, formData }))
      : await dispatch(createInventoryItem(formData));
    const ok = result?.payload === true;
    if (ok) closeModal();
    return ok;
  };

  const onDeleteConfirm = async () => {
    if (!deletingItem) return;
    await dispatch(deleteInventoryItem(deletingItem._id));
    setShowDelete(false); setDeletingItem(null);
  };
  //  same debounced search
  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchInventoryItems(val));
      else dispatch(clearSearch());
    }, 400);
  }, [dispatch]);

  const isSearching = searchResults !== null || searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="This Month Orders" value={stats?.totalOrders}
          icon={<ShoppingCart size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500"
          change={stats?.totalOrders} />
        <StatCard title="Received" value={stats?.receivedOrders}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="Pending" value={stats?.pendingOrders}
          icon={<Clock size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400" />
        <StatCard title="Month Spend"
          value={`Rs ${(stats?.thisMonthTotalPrice || 0).toLocaleString()}`}
          icon={<DollarSign size={20} />}
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

      {showAnalytics && (
        <AnalyticsSection stats={stats} totalStats={totalStats} allItems={allItems} />
      )}
      {/* Main table card */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">
        {/* Table header toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start
                        sm:items-center justify-between
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Inventory Items
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {items.length} {isSearching ? "results" : "total items"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search items, vendors…"
                className="pl-9 pr-4 py-2.5
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
                  onClick={() => { setSearchTerm(""); dispatch(clearSearch()); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((p) => !p)}
                className="flex items-center gap-1.5
                           border border-gray-200 dark:border-gray-700
                           text-gray-600 dark:text-gray-300
                           px-3.5 py-2.5 rounded-xl text-sm
                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Filter size={15} /> Filters
              </button>
              {showFilter && (
                <FilterPanel
                  onFilter={(f) => dispatch(filterInventoryItems(f))}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </div>
            {/* Refresh */}
            <button
              onClick={() => dispatch(loadInventory())}
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
                         font-medium hover:bg-emerald-800
                         transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60
                             border-b border-gray-100 dark:border-gray-800">
                {["#","Item Name","Vendor","Price (Rs)","Qty","Status","Actions"].map((h) => (
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
                    <Loader2 className="animate-spin inline text-emerald-700" size={32} />
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading inventory…</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <EmptyState searching={isSearching} />
              ) : (
                items.map((item, idx) => {
                  const sc = STATUS_COLORS[item.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={item._id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">{item.itemName}</td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{item.vendorName}</td>
                      <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                        Rs {Number(item.price).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {item.status === "Received" ? (() => {
                          const toOriginalUnit = (kg, unit) => {
                            if (unit === "ton")   return kg / 1000;
                            if (unit === "liter") return kg / 0.9;
                            return kg;
                          };
                          const originalQty  = Number(item.quantityReceived) || 0;
                          const remainingKG  = Number(item.quantity) || 0;
                          const remainingUnit = toOriginalUnit(remainingKG, item.unit);
                          const usedUnit     = Math.max(0, originalQty - remainingUnit);
                          const usedPct      = originalQty > 0
                            ? Math.min(100, Math.round((usedUnit / originalQty) * 100)) : 0;
                          const availPct     = 100 - usedPct;
                          const barColor     = availPct > 60 ? "bg-emerald-500" : availPct > 30 ? "bg-amber-400" : "bg-red-500";
                          const textColor    = availPct > 60 ? "text-emerald-700 dark:text-emerald-400" : availPct > 30 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
                          const fmt = (n) => { const r = Math.round(n * 100) / 100; return r % 1 === 0 ? r : r.toFixed(2); };
                          const unitBadge = (unit) => {
                            if (unit === "kg")    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
                            if (unit === "liter") return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
                            if (unit === "ton")   return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
                            return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
                          };
                          return (
                            <div className="min-w-32">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-semibold text-gray-800 dark:text-white text-xs">{fmt(originalQty)}</span>
                                {item.unit && (
                                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${unitBadge(item.unit)}`}>
                                    {item.unit}
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
                                  style={{ width: `${availPct}%` }} />
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className={`text-[10px] font-semibold ${textColor}`}>{fmt(remainingUnit)} {item.unit} left</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{usedPct}% used</span>
                              </div>
                            </div>
                          );
                        })() : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{item.quantityReceived}</span>
                            {item.unit && (() => {
                              const unitBadge = (unit) => {
                                if (unit === "kg")    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
                                if (unit === "liter") return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
                                if (unit === "ton")   return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
                                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
                              };
                              return (
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${unitBadge(item.unit)}`}>
                                  {item.unit}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => { setDeletingItem(item); setShowDelete(true); }}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between items-center
                          text-xs text-gray-400 dark:text-gray-500">
            <span>{items.length} item{items.length !== 1 ? "s" : ""} displayed</span>
            <span>Total value: Rs {items.reduce((s, i) => {
              const qty = i.unit === "liter" ? Number(i.quantityReceived) : Number(i.quantity);
              return s + Number(i.price) * qty;
            }, 0).toLocaleString()}</span>
          </div>
        )}
      </div>

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {showModal && (
        <ItemModal editingId={editingId} formData={formData}
          setFormData={setFormData} onSave={onSave}
          onClose={closeModal} submitting={submitting} />
      )}
      {showDelete && (
        <DeleteModal item={deletingItem} onConfirm={onDeleteConfirm}
          onClose={() => { setShowDelete(false); setDeletingItem(null); }}
          deleting={deleting} />
      )}
    </div>
  );
};

export default Inventory;