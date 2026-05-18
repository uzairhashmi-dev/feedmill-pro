import { X, Plus, ChevronDown, Loader2 } from "lucide-react";
import IngredientRow from "./IngredientRow";
import PercentBar    from "./PercentBar";

const FormulaModal = ({
  editingId, formData, setFormData,
  categories, inventoryItems,
  onSubmit, onClose, submitting,
}) => {
  const totalPct = formData.ingredients.reduce((s, i) => s + (Number(i.value) || 0), 0);

  const updateIngredient = (index, field, val) => {
    const updated = [...formData.ingredients];
    updated[index] = { ...updated[index], [field]: field === "value" ? parseFloat(val) || 0 : val };
    setFormData({ ...formData, ingredients: updated });
  };

  const removeIngredient = (index) =>
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });

  const addIngredient = () =>
    setFormData({ ...formData, ingredients: [...formData.ingredients, { key: "", value: 0 }] });

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm " +
    "bg-white dark:bg-gray-800 text-gray-800 dark:text-white " +
    "placeholder:text-gray-400 dark:placeholder:text-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700";

  const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900
                      rounded-3xl w-full max-w-4xl shadow-2xl max-h-[82vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-emerald-600 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editingId ? "Edit Formula" : "New Feed Formula"}
            </h2>
            <p className="text-emerald-200 text-xs mt-0.5">All ingredients must total exactly 100%</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1"><X size={22} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0
                          divide-y lg:divide-y-0 lg:divide-x
                          divide-gray-100 dark:divide-gray-800">

            {/* Left — details */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Formula Details
              </h3>

              <div>
                <label className={labelCls}>Formula Name *</label>
                <input placeholder="e.g. Premium Layer Feed" className={inputCls}
                  value={formData.formulaName}
                  onChange={(e) => setFormData({ ...formData, formulaName: e.target.value })} />
              </div>

              <div>
                <label className={labelCls}>Formula Code *</label>
                <input placeholder="e.g. L-102" className={`${inputCls} uppercase`}
                  value={formData.formulaCode}
                  onChange={(e) => setFormData({ ...formData, formulaCode: e.target.value.toUpperCase() })} />
              </div>

              <div>
                <label className={labelCls}>Category *</label>
                <div className="relative">
                  <select className={`${inputCls} appearance-none pr-10`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠ No categories found. Create one first.</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Notes / Description</label>
                <textarea rows={3} placeholder="Nutritional notes, usage instructions…"
                  className={`${inputCls} resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>

            {/* Right — ingredients */}
            <div className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Ingredients ({formData.ingredients.length})
                </h3>
                <button type="button" onClick={addIngredient}
                  className="text-emerald-700 dark:text-emerald-400 text-xs font-bold
                             hover:text-emerald-900 dark:hover:text-emerald-300
                             flex items-center gap-1
                             bg-emerald-50 dark:bg-emerald-900/20
                             px-3 py-1.5 rounded-lg">
                  <Plus size={13} /> Add Row
                </button>
              </div>

              {inventoryItems.length === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20
                                border border-amber-200 dark:border-amber-800
                                rounded-xl p-3 text-xs
                                text-amber-700 dark:text-amber-400">
                  ⚠ No received inventory items found. Add items with "Received" status first.
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {formData.ingredients.map((ing, i) => (
                  <IngredientRow
                    key={i}
                    ing={ing}
                    index={i}
                    inventoryItems={inventoryItems}
                    onUpdate={updateIngredient}
                    onRemove={removeIngredient}
                    canRemove={formData.ingredients.length > 1}
                  />
                ))}
              </div>

              <PercentBar total={totalPct} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300 py-3 rounded-xl
                       font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
            Cancel
          </button>
          <button onClick={onSubmit} disabled={submitting}
            className="flex-1 bg-emerald-700 text-white py-3 rounded-xl font-medium
                       hover:bg-emerald-800 flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting
              ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : editingId ? "Update Formula" : "Save Formula"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaModal;