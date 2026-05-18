import { X, CheckCircle, Clock, XCircle } from "lucide-react";
import PaymentBadge from "./PaymentBadge";

const CustomerDrawer = ({ customer, onClose }) => {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900
                      border-l border-transparent dark:border-gray-800
                      w-full sm:max-w-md h-full flex flex-col shadow-2xl">

        {/* Header — same dark green, unchanged */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <span className="text-white font-black text-xl">
                  {customer.customerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight truncate">
                {customer.customerName}
              </h3>
              <div className="mt-1">
                <PaymentBadge hasOutstanding={customer.hasOutstanding} />
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl ml-2 shrink-0">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Orders",    val: customer.totalOrders },
              { label: "Revenue",   val: `Rs ${customer.totalRevenue.toLocaleString()}` },
              { label: "KG Bought", val: `${customer.totalQuantityKG.toLocaleString()}` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                <p className="text-emerald-200 text-[10px] uppercase tracking-wide">{label}</p>
                <p className="text-white font-bold text-xs mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Payment summary */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Payment Summary
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3
                              bg-gray-50 dark:bg-gray-800
                              border border-gray-100 dark:border-gray-700
                              rounded-xl text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Billed</span>
                <span className="font-black text-gray-800 dark:text-white">
                  Rs {customer.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3
                              bg-emerald-50 dark:bg-emerald-900/20
                              border border-emerald-100 dark:border-emerald-800
                              rounded-xl text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">Paid</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400">
                  Rs {customer.totalPaid.toLocaleString()}
                </span>
              </div>
              {customer.totalPending > 0 && (
                <div className="flex justify-between items-center p-3
                                bg-amber-50 dark:bg-amber-900/20
                                border border-amber-200 dark:border-amber-800
                                rounded-xl text-sm">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">⚠ Outstanding</span>
                  <span className="font-black text-amber-700 dark:text-amber-400">
                    Rs {customer.totalPending.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order breakdown */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Order Breakdown
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"Completed", val:customer.completedOrders, color:"text-emerald-700 dark:text-emerald-400", bg:"bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800", icon:<CheckCircle size={14} className="text-emerald-500"/> },
                { label:"Pending",   val:customer.pendingOrders,   color:"text-amber-700 dark:text-amber-400",   bg:"bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",   icon:<Clock size={14} className="text-amber-500"/> },
                { label:"Cancelled", val:customer.cancelledOrders, color:"text-red-700 dark:text-red-400",       bg:"bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",           icon:<XCircle size={14} className="text-red-400"/> },
              ].map(({ label, val, color, bg, icon }) => (
                <div key={label} className={`rounded-xl p-3 border text-center ${bg}`}>
                  <div className="flex justify-center mb-1">{icon}</div>
                  <p className={`text-lg font-black ${color}`}>{val}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order history */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Order History ({customer.orders.length})
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {customer.orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                  <div key={order._id}
                    className="p-3.5 bg-white dark:bg-gray-800
                               border border-gray-100 dark:border-gray-700
                               rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">
                          {order.formula?.formulaName || "Formula Deleted"}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          #{order._id?.slice(-6)} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        order.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : order.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{order.quantityKG?.toLocaleString()} kg</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Rs {order.totalPayment?.toLocaleString()}
                        </span>
                        {order.paymentPending > 0 && (
                          <span className="block text-amber-600 dark:text-amber-400 text-[10px]">
                            Rs {order.paymentPending?.toLocaleString()} due
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-600 pt-2
                          border-t border-gray-100 dark:border-gray-800">
            Last order:{" "}
            {customer.lastOrderDate
              ? new Date(customer.lastOrderDate).toLocaleDateString() : "—"}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <button onClick={onClose}
            className="w-full bg-emerald-700 text-white py-2.5 rounded-xl
                       text-sm font-medium hover:bg-emerald-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default CustomerDrawer;