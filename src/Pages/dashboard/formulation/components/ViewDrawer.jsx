import { X, Edit3 } from "lucide-react";

const ViewDrawer = ({ formula, onClose, onEdit }) => {
  const categoryName = formula.category?.categoryName || formula.category || "—";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900
                      border-l border-transparent dark:border-gray-800
                      w-full sm:max-w-md h-full overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-white leading-tight truncate">
                {formula.formulaName}
              </h3>
              <p className="text-emerald-200 font-bold text-xs uppercase tracking-widest mt-1">
                {formula.formulaCode}
              </p>
            </div>
            <button onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl ml-2 shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-emerald-200 text-[10px] uppercase tracking-wide">Cost / MT</p>
              <p className="text-white font-black text-lg">
                Rs {formula.costPerMT?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-emerald-200 text-[10px] uppercase tracking-wide">Category</p>
              <p className="text-white font-bold text-sm truncate">{categoryName}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-emerald-200 text-[10px] uppercase tracking-wide">Ingredients</p>
              <p className="text-white font-black text-lg">{formula.ingredients?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {formula.description && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-gray-600 dark:text-gray-300
                            bg-gray-50 dark:bg-gray-800
                            rounded-xl p-4 leading-relaxed italic">
                {formula.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Ingredients Breakdown
            </p>
            <div className="space-y-2">
              {formula.ingredients?.map((ing, i) => (
                <div key={i}
                  className="flex justify-between items-center p-3.5
                             bg-white dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700
                             rounded-xl shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{ing.key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-emerald-200 dark:bg-emerald-900 overflow-hidden" style={{ width: 60 }}>
                      <div className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(ing.value, 100)}%` }} />
                    </div>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm w-12 text-right">
                      {ing.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
            Created {new Date(formula.createdAt).toLocaleDateString()}
            {formula.created?.name && ` · by ${formula.created.name}`}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
          <button onClick={() => { onClose(); onEdit(formula); }}
            className="flex-1 flex items-center justify-center gap-2
                       border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-300
                       py-2.5 rounded-xl text-sm font-medium
                       hover:bg-gray-50 dark:hover:bg-gray-800">
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