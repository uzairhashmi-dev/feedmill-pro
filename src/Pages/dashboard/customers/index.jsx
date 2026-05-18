import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  Loader2, Eye, Search, RefreshCw, X,
  BarChart2, Users, DollarSign,
  AlertTriangle, CheckCircle, TrendingUp,
} from "lucide-react";

import {
  loadCustomers, searchCustomers, clearSearch, setSelectedCustomer,
  selectAllCustomers, selectDisplayCustomers, selectMonthlyStats,
  selectCustomerLoading, selectSearchResults, selectSelectedCustomer,
} from "../../../store/customerSlice";

import StatCard        from "./components/StatCard";
import PaymentBadge    from "./components/PaymentBadge";
import CustomerDrawer  from "./components/CustomerDrawer";
import AnalyticsSection from "./components/AnalyticsSection";

const Customers = () => {
  const dispatch = useDispatch();

  const customers        = useSelector(selectDisplayCustomers);
  const allCustomers     = useSelector(selectAllCustomers);
  const monthlyStats     = useSelector(selectMonthlyStats);
  const loading          = useSelector(selectCustomerLoading);
  const searchResults    = useSelector(selectSearchResults);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm,    setSearchTerm]    = useState("");
  const searchTimeout = useRef(null);

  useEffect(() => { dispatch(loadCustomers()) }, [dispatch]);

  const onSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (val.trim()) dispatch(searchCustomers(val));
      else dispatch(clearSearch());
    }, 400);
  }, [dispatch]);

  const isSearching  = searchResults !== null || searchTerm.trim().length > 0;
  const totalRevenue = allCustomers.reduce((s, c) => s + c.totalRevenue, 0);
  const totalPaid    = allCustomers.reduce((s, c) => s + c.totalPaid,    0);
  const totalPending = allCustomers.reduce((s, c) => s + c.totalPending, 0);
  const outstandingCount = allCustomers.filter((c) => c.hasOutstanding).length;

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent
                    p-4 md:p-6 lg:p-8">

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" } },
      }} />

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Customers" value={allCustomers.length}
          icon={<Users size={20} />}
          gradient="bg-gradient-to-br from-emerald-700 to-emerald-500" />
        <StatCard title="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400" />
        <StatCard title="Payment Received" value={`Rs ${totalPaid.toLocaleString()}`}
          icon={<CheckCircle size={20} />}
          gradient="bg-gradient-to-br from-teal-600 to-teal-400" />
        <StatCard title="Outstanding" value={`Rs ${totalPending.toLocaleString()}`}
          icon={<AlertTriangle size={20} />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400"
          sub={`${outstandingCount} customer${outstandingCount !== 1 ? "s" : ""} with pending payment`} />
      </div>

      {/* Monthly mini-stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Month Orders",  val: monthlyStats?.totalOrders             || 0, color: "text-gray-800 dark:text-white" },
          { label: "Month Revenue", val: monthlyStats?.thisMonthTotalAmount    || 0, prefix: "Rs ", color: "text-emerald-700 dark:text-emerald-400" },
          { label: "Month Paid",    val: monthlyStats?.thisMonthPaymentPaid    || 0, prefix: "Rs ", color: "text-blue-700 dark:text-blue-400" },
          { label: "Month Pending", val: monthlyStats?.thisMonthPaymentPending || 0, prefix: "Rs ", color: "text-amber-600 dark:text-amber-400" },
        ].map(({ label, val, prefix, color }) => (
          <div key={label}
            className="bg-white dark:bg-gray-900
                       rounded-xl border border-gray-100 dark:border-gray-800
                       shadow-sm p-4">
            <p className="text-[10px] text-gray-400 dark:text-gray-500
                          uppercase tracking-wide font-medium mb-1">
              {label}
            </p>
            <p className={`text-base font-bold ${color}`}>
              {prefix || ""}{typeof val === "number" ? val.toLocaleString() : val}
            </p>
          </div>
        ))}
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

      {showAnalytics && <AnalyticsSection allCustomers={allCustomers} />}

      {/* Main table card */}
      <div className="bg-white dark:bg-gray-900
                      rounded-2xl shadow-sm
                      border border-gray-100 dark:border-gray-800
                      overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start
                        sm:items-center justify-between
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Customers</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {customers.length} {isSearching ? "results" : "total customers"}
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
            <button onClick={() => dispatch(loadCustomers())}
              className="border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300
                         p-2.5 rounded-xl
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                {["#","Customer","Orders","KG Bought","Total Billed","Paid","Outstanding","Payment","Last Order","Actions"].map((h) => (
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
                <tr>
                  <td colSpan="10" className="py-16 text-center">
                    <Loader2 size={32} className="animate-spin text-emerald-700 inline" />
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading customers…</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-20 text-center">
                    <Users size={48} strokeWidth={1} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                    <p className="text-base font-medium text-gray-400 dark:text-gray-600">
                      {isSearching ? `No customers found for "${searchTerm}"` : "No customers yet"}
                    </p>
                    {!isSearching && (
                      <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                        Customers appear when orders are created
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr key={customer.customerName}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-4 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl
                                        bg-gradient-to-br from-emerald-600 to-emerald-400
                                        flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-sm">
                            {customer.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {customer.customerName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {customer.totalOrders}
                      </span>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {customer.completedOrders}✓ {customer.pendingOrders}⏳{" "}
                        {customer.cancelledOrders > 0 ? `${customer.cancelledOrders}✗` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {customer.totalQuantityKG.toLocaleString()}
                      <span className="text-[10px] text-gray-400 ml-1">kg</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">
                      Rs {customer.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-medium text-emerald-700 dark:text-emerald-400">
                      Rs {customer.totalPaid.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-semibold text-sm ${
                        customer.totalPending > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}>
                        {customer.totalPending > 0
                          ? `Rs ${customer.totalPending.toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <PaymentBadge hasOutstanding={customer.hasOutstanding} />
                    </td>
                    <td className="px-4 py-4 text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => dispatch(setSelectedCustomer(customer))}
                          className="p-2 text-gray-400 hover:text-blue-500
                                     hover:bg-blue-50 dark:hover:bg-blue-900/30
                                     rounded-lg transition-all"
                          title="View customer details">
                          <Eye size={15} />
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
        {customers.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                          flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{customers.length} customer{customers.length !== 1 ? "s" : ""}</span>
            <span>
              Total: Rs {totalRevenue.toLocaleString()}
              {totalPending > 0 && (
                <span className="text-amber-600 dark:text-amber-400 ml-2">
                  · Rs {totalPending.toLocaleString()} outstanding
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDrawer
          customer={selectedCustomer}
          onClose={() => dispatch(setSelectedCustomer(null))}
        />
      )}
    </div>
  );
};

export default Customers;