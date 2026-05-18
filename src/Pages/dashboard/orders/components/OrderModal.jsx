import { X, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { UNIT_OPTIONS } from "../constants";

const OrderModal = ({ editingId, formData, setFormData, formulas, stockSummary, onSubmit, onClose, submitting }) => {
  const selectedStock = stockSummary.find((s) => s.formulaId === formData.formulaId);
  const toKG = (qty, unit) => {
    if (unit === "ton")   return Number(qty) * 1000;
    if (unit === "liter") return Number(qty) * 0.9;
    return Number(qty);
  };
  const qtyKG        = toKG(formData.quantity || 0, formData.unit);
  const totalPayment = qtyKG * (Number(formData.price) || 0);
  const paymentPaid  = Number(formData.paymentPaid) || 0;
  const pending      = Math.max(0, totalPayment - paymentPaid);

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700";
  const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900
                      border border-transparent dark:border-gray-800
                      rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-6 py-4 flex justify-between items-center rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">{editingId ? "Edit Order" : "New Sales Order"}</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Sell feed to customer</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className={labelCls}>Customer Name *</label>
            <input placeholder="e.g. Ahmed Farms" className={inputCls}
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
          </div>

          <div>
            <label className={labelCls}>Formula / Feed *</label>
            <div className="relative">
              <select className={`${inputCls} appearance-none pr-10`}
                value={formData.formulaId}
                onChange={(e) => setFormData({...formData, formulaId: e.target.value})}>
                <option value="">Select formula…</option>
                {formulas.map((f) => {
                  const stock = stockSummary.find((s) => s.formulaId === f._id);
                  return (
                    <option key={f._id} value={f._id}>
                      {f.formulaName} ({f.formulaCode})
                      {stock ? ` — ${stock.availableKG}kg available` : " — no stock"}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {selectedStock && (
              <div className={`mt-1.5 text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                selectedStock.availableKG > 0
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              }`}>
                <AlertCircle size={11} />
                Available: {selectedStock.availableKG.toLocaleString()} kg
                {" · "}Total: {selectedStock.totalProductionKG.toLocaleString()} kg
                {" · "}Sold: {selectedStock.soldKG.toLocaleString()} kg
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Quantity & Unit *</label>
            <div className="flex gap-2">
              <input type="number" min="0.01" step="0.01" placeholder="e.g. 100"
                className={inputCls}
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
              <div className="relative">
                <select className="border border-gray-200 dark:border-gray-700
                                   bg-gray-50 dark:bg-gray-800
                                   text-gray-700 dark:text-white
                                   rounded-xl px-3 py-2.5 text-sm appearance-none
                                   focus:outline-none focus:ring-2 focus:ring-emerald-300 pr-8 font-medium"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                  {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {formData.quantity && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">= {qtyKG.toFixed(2)} kg</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Price per kg (Rs) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rs</span>
              <input type="number" min="0" step="0.01" placeholder="0.00"
                className={`${inputCls} pl-9`}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Payment Paid (Rs)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rs</span>
              <input type="number" min="0" step="0.01" placeholder="0"
                className={`${inputCls} pl-9`}
                value={formData.paymentPaid}
                onChange={(e) => setFormData({...formData, paymentPaid: e.target.value})} />
            </div>
          </div>

          {totalPayment > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4
                            border border-gray-100 dark:border-gray-700 space-y-2">
              {[
                { label:"Total Amount", val:`Rs ${totalPayment.toLocaleString()}`, color:"text-gray-800 dark:text-white" },
                { label:"Paid",         val:`Rs ${paymentPaid.toLocaleString()}`,  color:"text-emerald-600 dark:text-emerald-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{label}</span>
                  <span className={`font-bold ${color}`}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-500 dark:text-gray-400">Pending</span>
                <span className={`font-bold ${pending > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  Rs {pending.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Status</label>
            <div className="relative">
              <select className={`${inputCls} appearance-none pr-10`}
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800
                        flex gap-3 shrink-0 rounded-b-3xl bg-white dark:bg-gray-900">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                       font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">Cancel</button>
          <button onClick={onSubmit} disabled={submitting}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl font-medium
                       hover:bg-emerald-800 flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
            {submitting ? <><Loader2 size={15} className="animate-spin"/>Saving…</> : editingId ? "Update Order" : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderModal;