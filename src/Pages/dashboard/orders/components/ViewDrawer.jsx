import { X, Edit3 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ViewDrawer = ({ order, onClose, onEdit }) => {
  const formulaName = order.formula?.formulaName || "Formula Deleted";
  const formulaCode = order.formula?.formulaCode || "";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900
                      border-l border-transparent dark:border-gray-800
                      w-full sm:max-w-md h-full flex flex-col shadow-2xl">

        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-white leading-tight truncate">{order.customerName}</h3>
              <p className="text-emerald-200 text-xs mt-1 uppercase tracking-widest font-bold">
                #{order._id?.slice(-8)}
              </p>
            </div>
            <button onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl ml-2">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label:"Formula",  val: formulaName },
              { label:"Qty (kg)", val: `${order.quantityKG?.toLocaleString()} kg` },
              { label:"Total",    val: `Rs ${order.totalPayment?.toLocaleString()}` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                <p className="text-emerald-200 text-[10px] uppercase tracking-wide">{label}</p>
                <p className="text-white font-bold text-xs mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</span>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-3">
            {[
              { label:"Customer",  val: order.customerName },
              { label:"Formula",   val: `${formulaName} (${formulaCode})` },
              { label:"Quantity",  val: `${order.quantity} ${order.unit} = ${order.quantityKG?.toLocaleString()} kg` },
              { label:"Price/kg",  val: `Rs ${order.price?.toLocaleString()}` },
              { label:"Total",     val: `Rs ${order.totalPayment?.toLocaleString()}` },
            ].map(({ label, val }) => (
              <div key={label}
                className="flex justify-between items-center p-3
                           bg-gray-50 dark:bg-gray-800
                           rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white text-right max-w-[60%] truncate">{val}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Payment Summary
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl
                            border border-gray-100 dark:border-gray-700 p-4 space-y-2">
              {[
                { label:"Total Amount", val:`Rs ${order.totalPayment?.toLocaleString()}`,  color:"text-gray-800 dark:text-white" },
                { label:"Paid",         val:`Rs ${order.paymentPaid?.toLocaleString()}`,   color:"text-emerald-600 dark:text-emerald-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className={`font-bold ${color}`}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-500 dark:text-gray-400">Pending</span>
                <span className={`font-bold ${order.paymentPending > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  Rs {order.paymentPending?.toLocaleString()}
                </span>
              </div>
              {order.totalPayment > 0 && (
                <div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width:`${Math.min(100,Math.round((order.paymentPaid/order.totalPayment)*100))}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">
                    {Math.round((order.paymentPaid/order.totalPayment)*100)}% paid
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-600 pt-2 border-t border-gray-100 dark:border-gray-800">
            Created {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
          <button onClick={() => { onClose(); onEdit(order); }}
            className="flex-1 flex items-center justify-center gap-2
                       border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                       text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
            <Edit3 size={15} /> Edit
          </button>
          <button onClick={onClose}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewDrawer;