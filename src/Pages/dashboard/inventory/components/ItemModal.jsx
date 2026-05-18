import { useState } from "react";
import { X, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { UNIT_OPTIONS } from "../constants";

const ItemModal = ({ editingId, formData, setFormData, onSave, onClose, submitting }) => {
  const [errors, setErrors] = useState({});
  const selectedUnit = UNIT_OPTIONS.find((u) => u.value === formData.unit) || UNIT_OPTIONS[0];

  const change = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.itemName.trim())    newErrors.itemName         = "Item name is required";
    if (!formData.vendorName.trim())  newErrors.vendorName       = "Vendor name is required";
    if (!formData.price)              newErrors.price            = "Price is required";
    if (!formData.quantityReceived)   newErrors.quantityReceived = "Quantity is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const success = await onSave();
    if (success) toast.success(editingId ? "Item updated successfully!" : "Item created successfully!", { position:"top-right", style:{zIndex:9999} });
  };

  const inputCls = (err) => `w-full border rounded-xl p-2.5 text-sm
    bg-white dark:bg-gray-800
    text-gray-800 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700
    ${err ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700"}`;

  const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[82vh]
                      border border-transparent dark:border-gray-800">

        <div className="bg-linear-to-r from-emerald-800 to-emerald-600 px-5 py-3.5 flex justify-between items-center rounded-t-2xl shrink-0">
          <h2 className="text-base font-bold text-white">
            {editingId ? "Edit Inventory Item" : "Add New Item"}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          <div>
            <label className={labelCls}>Item Name *</label>
            <input placeholder="e.g. Corn Gluten Meal" className={inputCls(errors.itemName)}
              value={formData.itemName} onChange={(e) => change("itemName", e.target.value)} />
            {errors.itemName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.itemName}</p>}
          </div>
          <div>
            <label className={labelCls}>Vendor Name *</label>
            <input placeholder="e.g. AgriSupply Co." className={inputCls(errors.vendorName)}
              value={formData.vendorName} onChange={(e) => change("vendorName", e.target.value)} />
            {errors.vendorName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.vendorName}</p>}
          </div>
          <div>
            <label className={labelCls}>Price (Rs) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rs</span>
              <input type="number" min="0" step="0.01" placeholder="0.00"
                className={`${inputCls(errors.price)} pl-9`}
                value={formData.price} onChange={(e) => change("price", e.target.value)} />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.price}</p>}
          </div>
          <div>
            <label className={labelCls}>Quantity Received & Unit *</label>
            <div className="flex gap-2">
              <input type="number" min="0" placeholder="0"
                className={inputCls(errors.quantityReceived)}
                value={formData.quantityReceived} onChange={(e) => change("quantityReceived", e.target.value)} />
              <div className="relative">
                <select className="border border-gray-200 dark:border-gray-700
                                   bg-gray-50 dark:bg-gray-800
                                   text-gray-700 dark:text-white
                                   rounded-xl px-3 py-2.5 text-sm appearance-none
                                   focus:outline-none focus:ring-2 focus:ring-emerald-300 pr-8 font-medium"
                  value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                  {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              </div>
            </div>
            {errors.quantityReceived && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.quantityReceived}</p>}
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5
                          bg-emerald-50 dark:bg-emerald-900/20
                          border border-emerald-100 dark:border-emerald-800
                          rounded-lg px-2.5 py-1.5 leading-relaxed">
              <span className="font-bold">Backend note:</span> {selectedUnit.hint}
            </p>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <div className="relative">
              <select className="w-full border border-gray-200 dark:border-gray-700
                                 bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                                 rounded-xl p-2.5 text-sm appearance-none
                                 focus:outline-none focus:ring-2 focus:ring-emerald-300 pr-10"
                value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Placed">Placed</option>
                <option value="Received">Received</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                        flex gap-3 shrink-0 rounded-b-2xl bg-white dark:bg-gray-900">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                       font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl font-medium
                       hover:bg-emerald-800 transition-colors flex items-center justify-center
                       gap-2 disabled:opacity-60 text-sm">
            {submitting ? <><Loader2 size={15} className="animate-spin"/>Saving…</> : editingId ? "Update Item" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ItemModal;