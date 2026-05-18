import { X, ChevronDown, Loader2 } from "lucide-react";
import CostPreview from "./CostPreview";
import { UNIT_OPTIONS } from "../constants";

const BatchModal = ({ editingId, formData, setFormData, formulas, onSubmit, onClose, submitting }) => {
  const selectedFormula = formulas.find((f) => f._id === formData.formulaId);

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-sm " +
    "bg-white dark:bg-gray-800 text-gray-800 dark:text-white " +
    "placeholder:text-gray-400 dark:placeholder:text-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700";

  const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900
                      border border-transparent dark:border-gray-800
                      rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600
                        px-5 py-3.5 flex justify-between items-center rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">
              {editingId ? "Edit Batch" : "Start New Batch"}
            </h2>
            <p className="text-emerald-200 text-xs mt-0.5">
              {editingId ? "Only changed fields will be recalculated" : "Cost is auto-calculated from formula"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Batch Name */}
          <div>
            <label className={labelCls}>Batch Reference *</label>
            <input placeholder="e.g. Broiler Batch-01" className={inputCls}
              value={formData.feedName}
              onChange={(e) => setFormData({ ...formData, feedName: e.target.value })} />
          </div>

          {/* Formula */}
          <div>
            <label className={labelCls}>
              Formula *
              {editingId && (
                <span className="ml-2 text-amber-500 normal-case font-normal text-[10px]">
                  ⚠ Changing recalculates stock
                </span>
              )}
            </label>
            <div className="relative">
              <select className={`${inputCls} appearance-none pr-10`}
                value={formData.formulaId}
                onChange={(e) => setFormData({ ...formData, formulaId: e.target.value })}>
                <option value="">Choose a formula…</option>
                {formulas.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.formulaName} — Rs. {f.costPerMT?.toLocaleString()}/kg
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {formulas.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠ No formulas found. Create one first.</p>
            )}
          </div>

          {/* Quantity + Unit */}
          <div>
            <label className={labelCls}>
              Quantity & Unit *
              {editingId && (
                <span className="ml-2 text-amber-500 normal-case font-normal text-[10px]">
                  ⚠ Changing recalculates stock
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input type="number" min="0.01" step="0.01" placeholder="e.g. 5.5"
                className={inputCls}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              <div className="relative">
                <select
                  className="border border-gray-200 dark:border-gray-700
                             bg-gray-50 dark:bg-gray-800
                             text-gray-700 dark:text-white
                             rounded-xl px-3 py-2.5 text-sm appearance-none
                             focus:outline-none focus:ring-2 focus:ring-emerald-300 pr-8 font-medium"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Waste */}
          <div>
            <label className={labelCls}>Waste (kg)</label>
            <input type="number" min="0" step="0.01" placeholder="0"
              className={inputCls}
              value={formData.waste}
              onChange={(e) => setFormData({ ...formData, waste: e.target.value })} />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Amount of feed lost during production
            </p>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>Status</label>
            <div className="relative">
              <select className={`${inputCls} appearance-none pr-10`}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Queued">Queued</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Cost Preview */}
          <CostPreview
            costPerMT={selectedFormula?.costPerMT}
            quantity={formData.quantity}
            unit={formData.unit}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                        flex gap-3 shrink-0 rounded-b-3xl
                        bg-white dark:bg-gray-900">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                       font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
            Cancel
          </button>
          <button onClick={onSubmit} disabled={submitting}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl font-medium
                       hover:bg-emerald-800 flex items-center justify-center gap-2
                       disabled:opacity-60 text-sm">
            {submitting
              ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
              : editingId ? "Update Batch" : "Start Batch"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchModal;