import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  Trash2, Loader2, Eye,
  Search, RefreshCw, X, BarChart2,
  CheckCircle, DollarSign,
  TrendingUp, Package, AlertTriangle,
  XCircle, ShoppingBag, Weight,
} from "lucide-react";

import {
  loadOrders, searchOrderItems, clearSearch, deleteOrderItem,
  selectAllOrders, selectStockSummary,
  selectOrderMonthly, selectOrderLoading,
  selectOrderDeleting, selectOrderSearch,
  selectOrderTotalStats,
} from "../../../store/orderSlice";

import StatCard    from "../orders/components/StatCard";
import DeleteModal from "../orders/components/DeleteModal";
import ViewDrawer  from "../orders/components/ViewDrawer";
import StockCard      from "./components/StockCard";
import SalesAnalytics from "./components/SalesAnalytics";

const Sales = () => {
  const dispatch = useDispatch();

  const allOrders    = useSelector(selectAllOrders);
  const stockSummary = useSelector(selectStockSummary);
  const monthlyStats = useSelector(selectOrderMonthly);
  const totalStats   = useSelector(selectOrderTotalStats);
  const loading      = useSelector(selectOrderLoading);
  const deleting     = useSelector(selectOrderDeleting);
  const searchResults = useSelector(selectOrderSearch);

  const completedOrders = allOrders.filter((o) => o.status === "Completed");

  const [showDelete,    setShowDelete]    = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewOrder,     setViewOrder]     = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadOrders()) }, [dispatch]);

  const searchCompleted = searchResults !== null
    ? searchResults.filter((o) => o.status === "Completed")
    : null;

  const displayOrders = searchCompleted !== null ? searchCompleted : completedOrders;
  const isSearching   = searchResults !== null || searchTerm.trim().length > 0;

  const onDeleteConfirm = async () => {
    if (!deletingOrder) return;
    await dispatch(deleteOrderItem(deletingOrder._id));
    setShowDelete(false);
    setDeletingOrder(null);
  };

 const onSearchChange = useCallback((e) => {
  const val = e.target.value;
  setSearchTerm(val);
  clearTimeout(searchTimeout.current);
  searchTimeout.current = setTimeout(() => {
    if (val.trim()) dispatch(searchOrderItems(val));
    else dispatch(clearSearch());
  }, 400);
}, [dispatch, setSearchTerm]);

  const totalRevenue    = completedOrders.reduce((s, o) => s + (o.totalPayment   || 0), 0);
  const totalPaid       = completedOrders.reduce((s, o) => s + (o.paymentPaid    || 0), 0);
  const totalPending    = completedOrders.reduce((s, o) => s + (o.paymentPending || 0), 0);
  const totalQuantityKG = completedOrders.reduce((s, o) => s + (o.quantityKG     || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {/* Top 4 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Delivered Orders" value={completedOrders.length}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500" />
        <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400" />
        <StatCard title="Payment Received" value={`Rs ${totalPaid.toLocaleString()}`}
          icon={<TrendingUp size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="Payment Pending" value={`Rs ${totalPending.toLocaleString()}`}
          icon={<AlertTriangle size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400" />
      </div>

      {/* All-time mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "All Time Orders",   val: totalStats?.totalOrders     || 0, color: "text-gray-800 dark:text-white",         icon: <ShoppingBag size={14} className="text-gray-400" /> },
          { label: "Total Completed",   val: totalStats?.completedOrders || 0, color: "text-emerald-700 dark:text-emerald-400", icon: <CheckCircle size={14} className="text-emerald-400" /> },
          { label: "Total Cancelled",   val: totalStats?.cancelledOrders || 0, color: "text-red-600 dark:text-red-400",         icon: <XCircle size={14} className="text-red-300" /> },
          { label: "Total KG Sold",     val: totalStats?.totalQuantityKG || 0, color: "text-blue-700 dark:text-blue-400",       icon: <Weight size={14} className="text-blue-400" />, suffix: " kg" },
        ].map(({ label, val, color, icon, suffix }) => (
          <div key={label}
            className="bg-white dark:bg-gray-900
                       rounded-xl border border-gray-100 dark:border-gray-800
                       shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-1">
              {icon}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                {label}
              </p>
            </div>
            <p className={`text-lg font-bold ${color}`}>
              {typeof val === "number" ? val.toLocaleString() : val}{suffix || ""}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Month Orders",    val: monthlyStats?.totalOrders              || 0, color: "text-gray-800 dark:text-white" },
          { label: "Month Completed", val: monthlyStats?.completedOrders          || 0, color: "text-emerald-700 dark:text-emerald-400" },
          { label: "Month Revenue",   val: monthlyStats?.thisMonthTotalAmount     || 0, color: "text-blue-700 dark:text-blue-400",   prefix: "Rs " },
          { label: "Month Paid",      val: monthlyStats?.thisMonthPaymentPaid     || 0, color: "text-emerald-700 dark:text-emerald-400", prefix: "Rs " },
          { label: "Month Pending",   val: monthlyStats?.thisMonthPaymentPending  || 0, color: "text-amber-600 dark:text-amber-400",  prefix: "Rs " },
          { label: "Month KG Sold",   val: monthlyStats?.thisMonthTotalQuantityKG || 0, color: "text-purple-700 dark:text-purple-400", suffix: " kg" },
        ].map(({ label, val, color, prefix, suffix }) => (
          <div key={label}
            className="bg-white dark:bg-gray-900
                       rounded-xl border border-gray-100 dark:border-gray-800
                       shadow-sm p-4">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium mb-1">
              {label}
            </p>
            <p className={`text-base font-bold ${color}`}>
              {prefix || ""}{typeof val === "number" ? val.toLocaleString() : val}{suffix || ""}
            </p>
          </div>
        ))}
      </div>

      {/* Total Feed Delivered banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600
                      rounded-2xl p-5 mb-6
                      flex flex-col sm:flex-row justify-between
                      items-start sm:items-center gap-4">
        <div>
          <p className="text-emerald-200 text-xs uppercase tracking-widest font-semibold">
            Total Feed Delivered
          </p>
          <p className="text-white text-3xl font-black mt-1">
            {totalQuantityKG.toLocaleString()} KG
          </p>
          <p className="text-emerald-300 text-sm mt-0.5">
            From {completedOrders.length} completed orders
          </p>
        </div>
        <Package size={48} className="text-emerald-400/30" />
      </div>

      {/* Analytics toggle */}
      <div className="mb-6">
        <button onClick={() => setShowAnalytics((p) => !p)}
          className="flex items-center gap-2 text-sm font-medium
                     text-emerald-700 dark:text-emerald-400
                     hover:text-emerald-800 dark:hover:text-emerald-300
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all">
          <BarChart2 size={16} />
          {showAnalytics ? "Hide" : "Show"} Analytics
        </button>
      </div>

      {showAnalytics && (
        <SalesAnalytics completedOrders={completedOrders} totalStats={totalStats} />
      )}

      {/* Formula Stock Summary */}
      {stockSummary.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400
                         uppercase tracking-wide mb-3">
            Formula Stock Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stockSummary.map((s) => (
              <StockCard key={s.formulaId} s={s} />
            ))}
          </div>
        </div>
      )}

      {/* Delivered Orders Table */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start
                        sm:items-center justify-between
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Delivered Sales</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {displayOrders.length} {isSearching ? "results" : "completed orders"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search customer…"
                className="pl-9 pr-8 py-2.5
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
                <button onClick={() => { setSearchTerm(""); dispatch(clearSearch()); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => dispatch(loadOrders())}
              className="border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300 p-2.5 rounded-xl
                         hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Refresh">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60
                             border-b border-gray-100 dark:border-gray-800">
                {["#","Customer","Formula","Qty (KG)","Price/KG","Total","Paid","Pending","Date","Actions"].map((h) => (
                  <th key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold
                               text-gray-500 dark:text-gray-400
                               uppercase tracking-wide whitespace-nowrap last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {loading ? (
                <tr><td colSpan="10" className="py-16 text-center">
                  <Loader2 size={32} className="animate-spin text-emerald-700 inline" />
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading…</p>
                </td></tr>
              ) : displayOrders.length === 0 ? (
                <tr><td colSpan="10" className="py-16 text-center">
                  <CheckCircle size={40} strokeWidth={1} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                    {isSearching ? `No completed orders for "${searchTerm}"` : "No delivered sales yet"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    Completed orders will appear here
                  </p>
                </td></tr>
              ) : (
                displayOrders.map((order, idx) => (
                  <tr key={order._id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-4 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800 dark:text-white">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">#{order._id?.slice(-6)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                        {order.formula?.formulaName || <span className="text-red-400 italic text-xs">Deleted</span>}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{order.formula?.formulaCode}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {order.quantityKG?.toLocaleString()}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        ({order.quantity} {order.unit})
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      Rs {order.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">
                      Rs {order.totalPayment?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                      Rs {order.paymentPaid?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-medium text-xs ${
                        order.paymentPending > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-500 dark:text-emerald-400"
                      }`}>
                        Rs {order.paymentPending?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewOrder(order)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => { setDeletingOrder(order); setShowDelete(true); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
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
        {displayOrders.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{displayOrders.length} delivered order{displayOrders.length !== 1 ? "s" : ""}</span>
            <span>
              Total: Rs {displayOrders.reduce((s,o)=>s+(o.totalPayment||0),0).toLocaleString()}
              {" · "}Pending: Rs {displayOrders.reduce((s,o)=>s+(o.paymentPending||0),0).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteModal order={deletingOrder} onConfirm={onDeleteConfirm}
          onClose={() => { setShowDelete(false); setDeletingOrder(null); }}
          deleting={deleting} />
      )}

      {viewOrder && (
        <ViewDrawer order={viewOrder} onClose={() => setViewOrder(null)} onEdit={() => {}} />
      )}
    </div>
  );
};

export default Sales;