import { Eye, Edit3, Trash2, Tag } from "lucide-react";
import { CARD_ACCENTS } from "../constants";

const FormulaCard = ({ formula, index, onView, onEdit, onDelete }) => {
  const accent       = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const categoryName = formula.category?.categoryName || "—";

  return (
    <div className="bg-white dark:bg-gray-900
                    border border-gray-100 dark:border-gray-800
                    rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className={`bg-gradient-to-r ${accent} h-1.5`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`bg-gradient-to-r ${accent} text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide`}>
            {formula.formulaCode || "N/A"}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onView(formula)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
              title="View details">
              <Eye size={15} />
            </button>
            <button onClick={() => onEdit(formula)}
              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all"
              title="Edit">
              <Edit3 size={15} />
            </button>
            <button onClick={() => onDelete(formula)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
              title="Delete">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <h3 className="font-black text-base text-gray-800 dark:text-white leading-tight">
          {formula.formulaName}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 line-clamp-1 min-h-4">
          {formula.description || "No description"}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <Tag size={11} className="text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{categoryName}</span>
        </div>

        <div className="mt-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3
                        flex justify-between items-center
                        border border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Cost / MT</p>
            <p className="text-emerald-700 dark:text-emerald-400 font-black text-lg leading-tight">
              Rs {formula.costPerMT?.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Ingredients</p>
            <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">
              {formula.ingredients?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaCard;