import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import {
  Plus, Edit3, Trash2, Loader2, Eye,
  Search, RefreshCw, X, BarChart2,
  ShoppingBag, CheckCircle, Clock, DollarSign, Printer,
} from "lucide-react";

import {
  loadOrders, searchOrderItems, clearSearch,
  createOrderItem, updateOrderItem, deleteOrderItem,
  selectDisplayOrders, selectAllOrders, selectOrderFormulas,
  selectStockSummary, selectOrderMonthly, selectOrderLoading,
  selectOrderSubmitting, selectOrderDeleting, selectOrderSearch,
} from "../../../store/orderSlice";

import { EMPTY_FORM } from "./constants";
import StatCard       from "./components/StatCard";
import StatusBadge    from "./components/StatusBadge";
import EmptyState     from "./components/EmptyState";
import OrderModal     from "./components/OrderModal";
import DeleteModal    from "./components/DeleteModal";
import ViewDrawer     from "./components/ViewDrawer";
import InvoiceModal   from "./components/InvoiceModal";
import AnalyticsSection from "./components/AnalyticsSection";

const Sales = () => {
  const dispatch = useDispatch();

  const orders       = useSelector(selectDisplayOrders);
  const allOrders    = useSelector(selectAllOrders);
  const formulas     = useSelector(selectOrderFormulas);
  const stockSummary = useSelector(selectStockSummary);
  const monthlyStats = useSelector(selectOrderMonthly);
  const loading      = useSelector(selectOrderLoading);
  const submitting   = useSelector(selectOrderSubmitting);
  const deleting     = useSelector(selectOrderDeleting);
  const searchResults = useSelector(selectOrderSearch);

  const [showModal,     setShowModal]     = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewOrder,     setViewOrder]     = useState(null);
  const [invoiceOrder,  setInvoiceOrder]  = useState(null);
  const [editingId,     setEditingId]     = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [formData,      setFormData]      = useState(EMPTY_FORM);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadOrders()) }, [dispatch]);

  const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setShowModal(true); };
  const openEdit = (order) => {
    setEditingId(order._id);
    setFormData({
      customerName: order.customerName,
      formulaId:    order.formula?._id || order.formula || "",
      quantity:     order.quantity,
      unit:         order.unit || "kg",
      price:        order.price,
      paymentPaid:  order.paymentPaid ?? 0,
      status:       order.status,
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setFormData(EMPTY_FORM); };

  const onSubmit = async () => {
    if (!formData.customerName.trim() || !formData.formulaId || !formData.quantity || !formData.price)
      return toast.error("Customer name, formula, quantity and price are required");
    if (Number(formData.quantity) <= 0) return toast.error("Quantity must be greater than 0");
    if (Number(formData.price)    <= 0) return toast.error("Price must be greater than 0");
    if (Number(formData.paymentPaid) < 0) return toast.error("Payment paid cannot be negative");

    const result = editingId
      ? await dispatch(updateOrderItem({ id: editingId, formData }))
      : await dispatch(createOrderItem(formData));

    if (result?.payload === true) {
      toast.success(editingId ? "Order updated!" : "Order created!", { position:"top-right", style:{zIndex:9999} });
      closeModal();
    }
  };

  const onDeleteConfirm = async () => {
    if (!deletingOrder) return;
    await dispatch(deleteOrderItem(deletingOrder._id));
    setShowDelete(false); setDeletingOrder(null);
  };

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchOrderItems(val));
      else dispatch(clearSearch());
    }, 400);
  }, [dispatch]);

  const isSearching    = searchResults !== null || searchTerm.trim().length > 0;
  const totalRevenue   = allOrders.reduce((s, o) => s + (o.totalPayment  || 0), 0);
  const pendingPayment = allOrders.reduce((s, o) => s + (o.paymentPending || 0), 0);
  const completedCount = allOrders.filter((o) => o.status === "Completed").length;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent p-4 md:p-6 lg:p-8">

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="This Month Orders"
          value={monthlyStats?.totalOrders ?? allOrders.length}
          icon={<ShoppingBag size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500" />
        <StatCard title="Completed" value={completedCount}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400" />
        <StatCard title="Pending Payment" value={`Rs ${pendingPayment.toLocaleString()}`}
          icon={<Clock size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400"
          sub={pendingPayment > 0 ? "Needs collection" : "All clear"} />
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

      {showAnalytics && <AnalyticsSection allOrders={allOrders} stockSummary={stockSummary} />}

      {/* Main table */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start
                        sm:items-center justify-between
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Sales Orders</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {orders.length} {isSearching ? "results" : "total orders"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search customers…"
                className="pl-9 pr-8 py-2.5
                           border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           text-gray-800 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           rounded-xl text-sm w-full sm:w-52
                           focus:outline-none focus:ring-2
                           focus:ring-emerald-300 dark:focus:ring-emerald-700"
                value={searchTerm} onChange={onSearchChange}
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
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-1.5 bg-emerald-700 text-white
                         px-4 py-2.5 rounded-xl text-sm font-medium
                         hover:bg-emerald-800 shadow-sm">
              <Plus size={16} /> New Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60
                             border-b border-gray-100 dark:border-gray-800">
                {["#","Customer","Formula","Qty (kg)","Price/kg","Total","Paid","Pending","Status","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold
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
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading orders…</p>
                </td></tr>
              ) : orders.length === 0 ? (
                <EmptyState searching={isSearching} />
              ) : (
                orders.map((order, idx) => (
                  <tr key={order._id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-4 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                    <td className="px-4 py-4 font-semibold text-gray-800 dark:text-white">{order.customerName}</td>
                    <td className="px-4 py-4 text-xs">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {order.formula?.formulaName || <span className="text-red-400 italic">Deleted</span>}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500">{order.formula?.formulaCode}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {order.quantityKG?.toLocaleString()} kg
                      <span className="block text-[10px] text-gray-400 font-normal">
                        ({order.quantity} {order.unit})
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">Rs {order.price?.toLocaleString()}</td>
                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">Rs {order.totalPayment?.toLocaleString()}</td>
                    <td className="px-4 py-4 font-medium text-emerald-600 dark:text-emerald-400">Rs {order.paymentPaid?.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`font-medium text-xs ${
                        order.paymentPending > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        Rs {order.paymentPending?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewOrder(order)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openEdit(order)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all" title="Edit">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => setInvoiceOrder(order)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all" title="Print Invoice">
                          <Printer size={15} />
                        </button>
                        <button onClick={() => { setDeletingOrder(order); setShowDelete(true); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all" title="Delete">
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
        {orders.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{orders.length} order{orders.length !== 1 ? "s" : ""} displayed</span>
            <span>
              Total: Rs {orders.reduce((s,o)=>s+(o.totalPayment||0),0).toLocaleString()}
              {" · "}Pending: Rs {orders.reduce((s,o)=>s+(o.paymentPending||0),0).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <Toaster position="top-right" toastOptions={{ style:{zIndex:9999},
        success:{ style:{background:"#f0fdf4",color:"#166534",border:"1px solid #bbf7d0"}, iconTheme:{primary:"#16a34a",secondary:"#f0fdf4"} },
        error:{   style:{background:"#fef2f2",color:"#991b1b",border:"1px solid #fecaca"}, iconTheme:{primary:"#dc2626",secondary:"#fef2f2"} },
      }} />

      {invoiceOrder  && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
      {showModal     && <OrderModal editingId={editingId} formData={formData} setFormData={setFormData}
                          formulas={formulas} stockSummary={stockSummary} onSubmit={onSubmit}
                          onClose={closeModal} submitting={submitting} />}
      {showDelete    && <DeleteModal order={deletingOrder} onConfirm={onDeleteConfirm}
                          onClose={() => { setShowDelete(false); setDeletingOrder(null); }} deleting={deleting} />}
      {viewOrder     && <ViewDrawer order={viewOrder} onClose={() => setViewOrder(null)} onEdit={openEdit} />}
    </div>
  );
};
export default Sales;