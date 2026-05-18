import { X, Loader2 } from "lucide-react";

const CategoryModal = ({ editingId, formData, setFormData, onSubmit, onClose, submitting }) => {
  const inputCls = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700";
  const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900
                      border border-transparent dark:border-gray-800
                      rounded-2xl w-full max-w-md shadow-2xl
                      flex flex-col max-h-[82vh]">

        <div className="bg-linear-to-r from-emerald-800 to-emerald-600 px-5 py-3.5 flex justify-between items-center rounded-t-2xl shrink-0">
          <h2 className="text-base font-bold text-white">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className={labelCls}>Category Name *</label>
            <input
              placeholder="e.g. Protein Supplements"
              className={inputCls}
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              placeholder="Optional description…"
              className={`${inputCls} resize-none`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800
                        flex gap-3 shrink-0 rounded-b-2xl
                        bg-white dark:bg-gray-900">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-2.5 rounded-xl
                       font-medium hover:bg-gray-50 dark:hover:bg-gray-800
                       transition-colors text-sm">
            Cancel
          </button>
          <button onClick={onSubmit} disabled={submitting}
            className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl
                       font-medium hover:bg-emerald-800 transition-colors
                       flex items-center justify-center gap-2
                       disabled:opacity-60 text-sm">
            {submitting
              ? <><Loader2 size={15} className="animate-spin" />Saving…</>
              : editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CategoryModal;