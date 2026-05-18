import { Trash2 } from "lucide-react";

const getUnitLabel = (unit) => {
  if (unit === "liter") return "ltr";
  if (unit === "ton")   return "ton";
  return "kg";
};

const IngredientRow = ({ ing, index, inventoryItems, onUpdate, onRemove, canRemove }) => (
  <div className="flex items-center gap-2
                  bg-gray-50 dark:bg-gray-800
                  p-2.5 rounded-xl
                  border border-gray-100 dark:border-gray-700">
    <select
      className="flex-1 p-2 bg-white dark:bg-gray-800 outline-none text-sm font-medium 
                 text-gray-700 dark:text-white min-w-0"
      value={ing.key}
      onChange={(e) => onUpdate(index, "key", e.target.value)}
    >
      <option value="">Choose item…</option>
      {inventoryItems.map((item) => (
        <option key={item._id} value={item.itemName}>
          {item.itemName} — Rs {item.price}/{getUnitLabel(item.unit)}
        </option>
      ))}
    </select>

    <div className="flex items-center gap-1
                    bg-white dark:bg-gray-700
                    px-2.5 rounded-lg
                    border border-gray-200 dark:border-gray-600 shrink-0">
      <input
        type="number" min="0.01" max="100" step="0.01"
        className="w-16 py-2 text-center font-bold outline-none
                   bg-transparent text-gray-800 dark:text-white text-sm"
        value={ing.value || ""}
        onChange={(e) => onUpdate(index, "value", e.target.value)}
      />
      <span className="text-xs font-bold text-gray-400">%</span>
    </div>

    <button type="button" onClick={() => onRemove(index)} disabled={!canRemove}
      className="p-2 text-red-300 hover:text-red-500 transition-colors disabled:opacity-30">
      <Trash2 size={15} />
    </button>
  </div>
);

export default IngredientRow;